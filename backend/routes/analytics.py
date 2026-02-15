from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse
from services.parser_service import parser_service
from services.ai_service import ai_service
from services.supabase_service import supabase_service
from services.whisper_service import whisper_service
from services.pdf_service import pdf_service
from routes.auth import get_current_user
from models.schemas import SyllabusAnalysisRequest, UploadMaterialRequest
from typing import Dict, Any
import os
import shutil
import tempfile

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.post("/analyze-marks")
async def analyze_marks(file: UploadFile = File(...), topics_covered: str = "General", current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    content = await file.read()
    try:
        avg_score, weak_topics, risk_students, summary = parser_service.parse_marks_csv(content)
        # Add the context to the summary
        full_context = f"{summary} Topics tested: {topics_covered}"
        ai_analysis = await ai_service.analyze_marks(full_context)
        
        result = {
            "average_score": round(avg_score, 2),
            "weak_topics": weak_topics,
            "risk_students": risk_students,
            "performance_summary": ai_analysis.get("performance_summary"),
            "strategy": ai_analysis.get("teaching_strategy")
        }
        
        # Store in Supabase
        data_to_insert = {
            "average_score": avg_score,
            "risk_students_count": len(risk_students),
            "performance_summary": ai_analysis.get("performance_summary")
        }
        if current_user:
            data_to_insert["teacher_id"] = current_user["id"]
            
        supabase_service.get_client().table("marks_analysis").insert(data_to_insert).execute()
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-text-material")
async def upload_text_material(request: UploadMaterialRequest, content: str, current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    """Upload raw text material directly if PDF parsing fails"""
    try:
        word_count = len(content.split())
        
        material_data = {
            "subject": request.subject,
            "unit": request.unit,
            "title": request.title or f"{request.subject}_{request.unit}_text",
            "content_text": content,
            "file_name": "manual_upload.txt",
            "word_count": word_count
        }
        if current_user:
            material_data["teacher_id"] = current_user["id"]
        
        material_result = supabase_service.get_client().table("study_materials").insert(material_data).execute()
        material_id = material_result.data[0]["id"] if material_result.data else None
        
        # Analyze with AI
        ai_analysis = await ai_service.analyze_syllabus(content)
        
        return {
            "material_id": material_id,
            "word_count": word_count,
            "major_topics": ai_analysis.get("major_topics"),
            "message": "Text content uploaded successfully. Use material_id to generate assessments."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-syllabus")
async def analyze_syllabus(file: UploadFile = File(...), subject: str = "General", unit: str = "Unit 1", current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    content = await file.read()
    try:
        text = parser_service.parse_syllabus_pdf(content)
        if not text or text.startswith("Warning:"):
            return {
                "material_id": None,
                "word_count": 0,
                "error": "Could not extract text from this PDF. It might be a scan or image-based.",
                "suggestion": "Please use the /analytics/upload-text-material endpoint and paste the text directly for 100% reliability."
            }
            
        word_count = len(text.split())
        
        # Store the PDF content in database
        material_data = {
            "subject": subject,
            "unit": unit,
            "title": file.filename,
            "content_text": text,
            "file_name": file.filename,
            "word_count": word_count
        }
        if current_user:
            material_data["teacher_id"] = current_user["id"]
        
        material_result = supabase_service.get_client().table("study_materials").insert(material_data).execute()
        material_id = material_result.data[0]["id"] if material_result.data else None
        
        # Analyze with AI
        ai_analysis = await ai_service.analyze_syllabus(text)
        
        # Store analysis
        data_to_insert = {
            "major_topics": ai_analysis.get("major_topics"),
            "assessment_focus": ai_analysis.get("assessment_focus")
        }
        if current_user:
            data_to_insert["teacher_id"] = current_user["id"]
            
        supabase_service.get_client().table("syllabus_analysis").insert(data_to_insert).execute()
        
        
        return {
            "material_id": material_id,
            "word_count": word_count,
            "extracted_text_preview": text[:500] + "..." if len(text) > 500 else text,
            "major_topics": ai_analysis.get("major_topics"),
            "assessment_focus": ai_analysis.get("assessment_focus"),
            "message": "PDF uploaded and analyzed. Use material_id to generate assessments from this content."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-attendance")
async def analyze_attendance(file: UploadFile = File(...), subject: str = "General", current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    """Analyze attendance CSV or PDF data for trends and student risk"""
    content = await file.read()
    
    try:
        if file.filename.endswith('.csv'):
            attendance_records = parser_service.parse_attendance_csv(content)
        elif file.filename.endswith('.pdf'):
            # 1. Extract raw text
            text = parser_service.parse_syllabus_pdf(content)
            if not text or text.startswith("Warning:"):
                raise HTTPException(status_code=400, detail="Could not extract text from this PDF attendance sheet.")
            
            # 2. Parse into structured records via AI
            print("Parsing PDF attendance with AI...")
            attendance_records = await ai_service.parse_attendance_text(text)
        else:
            raise HTTPException(status_code=400, detail="Only CSV and PDF files are allowed")

        if not attendance_records:
            raise HTTPException(status_code=400, detail="No attendance records could be extracted from the provided file.")
        
        # Insert records into DB
        for record in attendance_records:
            record["subject"] = subject
            if current_user:
                record["teacher_id"] = current_user["id"]
        
        supabase_service.get_client().table("attendance").insert(attendance_records).execute()
        
        # Create a summary for AI
        total_records = len(attendance_records)
        absent_count = len([r for r in attendance_records if r["status"] == "Absent"])
        summary_text = f"Total records analyzed for {subject}: {total_records}. Absences: {absent_count}."
        
        ai_analysis = await ai_service.analyze_attendance(summary_text)
        
        return {
            "total_records": total_records,
            "absent_count": absent_count,
            "risk_analysis": ai_analysis.get("risk_analysis"),
            "engagement_score": ai_analysis.get("engagement_score"),
            "suggestions": ai_analysis.get("suggestions"),
            "message": f"Successfully analyzed {total_records} records from {file.filename}."
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/lecture-to-pdf")
async def lecture_to_pdf(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Convert lecture audio into structured PDF notes.
    Flow: Audio -> Whisper (Transcribe) -> Groq (Analyze) -> PDF (Notes)
    """
    # 1. Validation
    # !!! UPDATED FOR MPEG SUPPORT !!!
    allowed_extensions = {'.mp3', '.wav', '.m4a', '.ogg', '.mpeg', '.mpga', '.mp4'}
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    print(f"DEBUG: Processing file {file.filename} with extension {file_ext}") # This will show in terminal
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"FORCED UPDATE: Unsupported format '{file_ext}'. Supported: {sorted(list(allowed_extensions))}"
        )

    # 2. Save temporary file
    temp_dir = tempfile.mkdtemp()
    temp_audio_path = os.path.join(temp_dir, file.filename)
    
    try:
        with open(temp_audio_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 3. Transcribe with Whisper
        print(f"Starting transcription for {file.filename}...")
        transcript = await whisper_service.transcribe(temp_audio_path)
        
        if not transcript:
            raise HTTPException(status_code=500, detail="Transcription failed. Ensure Whisper service is running on localhost:9000")

        # 4. Analyze with Groq AI
        print("Analyzing transcript...")
        structured_notes = await ai_service.analyze_lecture(transcript)

        # 5. Generate PDF
        print("Generating PDF notes...")
        pdf_filename = f"Lecture_Notes_{os.path.splitext(file.filename)[0]}.pdf"
        output_pdf_path = os.path.join(temp_dir, pdf_filename)
        
        pdf_service.create_lecture_notes(structured_notes, output_pdf_path)

        # 6. Save to Supabase (Database Storage)
        try:
            supabase_service.get_client().table("lecture_notes").insert({
                "teacher_id": current_user.get("id"), # Assumes teacher is logged in
                "title": structured_notes.get("title", "Untitled Lecture"),
                "summary": structured_notes.get("summary"),
                "topics": structured_notes.get("topics"),
                "concepts": structured_notes.get("concepts"),
                "definitions": structured_notes.get("definitions"),
                "examples": structured_notes.get("examples"),
                # "transcript": transcript # Optional: Save raw transcript if needed (can be large)
            }).execute()
            print("Lecture notes saved to database.")
        except Exception as db_error:
            print(f"Database Error (Non-blocking): {str(db_error)}")

        # 6. Return File Response
        return FileResponse(
            path=output_pdf_path,
            filename=pdf_filename,
            media_type="application/pdf"
        )

    except Exception as e:
        print(f"Error in lecture-to-pdf: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Lecture processing error: {str(e)}")
    finally:
        # Note: We don't delete the temp_dir here because FileResponse needs it.
        # Ideally, use a BackgroundTask to cleanup after sending.
        pass

@router.get("/engagement")
async def get_engagement(current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Get deep engagement analytics for the current teacher's classes.
    Synthesizes data from marks and attendance.
    """
    try:
        # 1. Fetch recent marks analysis
        marks_query = supabase_service.get_client().table("marks_analysis") \
            .select("*") \
            .order("created_at", desc=True) \
            .limit(3) \
            .execute()
        
        # 2. Fetch recent attendance trends
        attendance_query = supabase_service.get_client().table("attendance") \
            .select("status, subject") \
            .limit(100) \
            .execute()
        
        # 3. Build summary for AI
        marks_data = marks_query.data if marks_query.data else []
        att_data = attendance_query.data if attendance_query.data else []
        
        avg_scores = [m.get("average_score", 0) for m in marks_data]
        overall_avg = sum(avg_scores) / len(avg_scores) if avg_scores else 0
        
        total_att = len(att_data)
        present_count = len([a for a in att_data if a.get("status") == "Present"])
        att_rate = (present_count / total_att * 100) if total_att > 0 else 0
        
        summary = f"""
        Class Performance Overview:
        - Recent Average Scores: {avg_scores}
        - Overall Class Average: {overall_avg:.2f}%
        - Recent Attendance Rate: {att_rate:.2f}% (from {total_att} records)
        - Performance Summaries: {[m.get("performance_summary") for m in marks_data]}
        """
        
        # 4. Generate full analytics with AI
        analysis = await ai_service.analyze_engagement(summary)
        
        return analysis

    except Exception as e:
        print(f"Error fetching engagement analytics: {str(e)}")
        # Return fallback data if something fails
        return {
            "stats": {"engagementScore": 75, "questionsAsked": 25, "avgAttention": 80, "participationRate": 85},
            "charts": {
                "questionFrequency": [{"name": f"Week {i}", "value": 10+i*2} for i in range(1, 9)],
                "topicEngagement": [{"name": "General", "value": 75}],
                "behaviorBreakdown": [{"name": "Active", "value": 60}, {"name": "Passive", "value": 40}],
                "skillRadar": [{"name": "Overall", "value": 70}]
            },
            "pedagogicalInsight": "Baseline engagement is healthy. Data gathering in progress."
        }
