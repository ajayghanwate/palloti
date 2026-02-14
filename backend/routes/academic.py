from fastapi import APIRouter, HTTPException, Depends
from models.schemas import AssessmentRequest, FeedbackRequest, MaterialBasedAssessmentRequest, LearningGapRequest
from services.ai_service import ai_service
from services.supabase_service import supabase_service
from routes.auth import get_current_user
from typing import Dict, Any

router = APIRouter(prefix="/academic", tags=["Academic"])

@router.post("/generate-assessment-from-pdf")
async def generate_assessment_from_pdf(request: MaterialBasedAssessmentRequest, current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    """Generate assessment questions based on uploaded PDF content"""
    try:
        # Fetch the study material from database
        material = supabase_service.get_client().table("study_materials").select("*").eq("id", request.material_id).single().execute()
        
        if not material.data:
            raise HTTPException(status_code=404, detail="Study material not found. Please upload a PDF first using /analyze-syllabus")
        
        pdf_content = material.data["content_text"]
        subject = material.data["subject"]
        unit = material.data["unit"]
        
        # Generate assessment using the PDF content
        assessment = await ai_service.generate_assessment_from_content(
            content=pdf_content,
            subject=subject,
            unit=unit,
            difficulty=request.difficulty,
            num_questions=request.num_questions
        )
        
        # Store in Supabase
        data_to_insert = {
            "subject": subject,
            "unit": unit,
            "data": assessment
        }
        if current_user:
            data_to_insert["teacher_id"] = current_user["id"]
            
        supabase_service.get_client().table("assessments").insert(data_to_insert).execute()
        
        return assessment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-assessment")
async def generate_assessment(request: AssessmentRequest, current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    try:
        assessment = await ai_service.generate_assessment(
            request.subject, 
            request.unit, 
            request.difficulty, 
            request.num_questions
        )
        
        # Store in Supabase
        data_to_insert = {
            "subject": request.subject,
            "unit": request.unit,
            "data": assessment
        }
        if current_user:
            data_to_insert["teacher_id"] = current_user["id"]
            
        supabase_service.get_client().table("assessments").insert(data_to_insert).execute()
        
        return assessment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-feedback")
async def generate_feedback(request: FeedbackRequest, current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    try:
        feedback = await ai_service.generate_feedback(
            request.student_name,
            request.score,
            request.weak_topics
        )
        
        # Store in Supabase
        data_to_insert = {
            "student_name": request.student_name,
            "score": request.score,
            "feedback_data": feedback
        }
        if current_user:
            data_to_insert["teacher_id"] = current_user["id"]
            
        supabase_service.get_client().table("feedback").insert(data_to_insert).execute()
        
        return feedback
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/detect-learning-gaps")
async def detect_learning_gaps(request: LearningGapRequest, current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    """Cross-references marks with syllabus to identify student struggles"""
    try:
        # 1. Fetch performance summary
        marks_res = supabase_service.get_client().table("marks_analysis").select("performance_summary").order("created_at", desc=True).limit(1).execute()
        
        # 2. Fetch syllabus topics
        syllabus_res = supabase_service.get_client().table("syllabus_analysis").select("major_topics").order("created_at", desc=True).limit(1).execute()
        
        if not marks_res.data or not syllabus_res.data:
            raise HTTPException(status_code=404, detail="Performance or syllabus data not found. Please analyze both first.")
        
        marks_summary = marks_res.data[0]["performance_summary"]
        topics = syllabus_res.data[0]["major_topics"]
        
        # 3. Analyze with AI
        analysis = await ai_service.detect_learning_gaps(marks_summary, topics)
        
        return analysis
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/my-feedback")
async def get_my_feedback(current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    """Allows authenticated students to fetch their OWN feedback"""
    if current_user["role"] != "student":
         raise HTTPException(status_code=403, detail="This endpoint is for students only.")
         
    student_name = current_user["email"] # marking the name as 'email' in the token 'sub' field for simplicity
    
    try:
        result = supabase_service.get_client().table("feedback").select("*").ilike("student_name", f"%{student_name}%").order("created_at", desc=True).limit(1).execute()
        
        if not result.data:
            # Fallback: maybe the token name is slightly different?
            raise HTTPException(status_code=404, detail=f"No feedback found for you ({student_name}). Please asking your teacher to generate it.")
            
        return result.data[0]["feedback_data"]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
