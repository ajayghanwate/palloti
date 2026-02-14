from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from services.parser_service import parser_service
from services.ai_service import ai_service
from services.supabase_service import supabase_service
from routes.auth import get_current_user
from models.schemas import SyllabusAnalysisRequest, UploadMaterialRequest
from typing import Dict, Any

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
    """Analyze attendance CSV data for trends and student risk"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    content = await file.read()
    try:
        attendance_records = parser_service.parse_attendance_csv(content)
        
        # Insert records into DB
        for record in attendance_records:
            record["subject"] = subject
            if current_user:
                record["teacher_id"] = current_user["id"]
        
        supabase_service.get_client().table("attendance").insert(attendance_records).execute()
        
        # Create a summary for AI
        total_records = len(attendance_records)
        absent_count = len([r for r in attendance_records if r["status"] == "Absent"])
        summary_text = f"Total records: {total_records}. Absences: {absent_count}."
        
        ai_analysis = await ai_service.analyze_attendance(summary_text)
        
        return {
            "total_records": total_records,
            "absent_count": absent_count,
            "risk_analysis": ai_analysis.get("risk_analysis"),
            "engagement_score": ai_analysis.get("engagement_score"),
            "suggestions": ai_analysis.get("suggestions"),
            "message": "Attendance analyzed and saved."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
