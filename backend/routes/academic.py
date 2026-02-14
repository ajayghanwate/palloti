from fastapi import APIRouter, HTTPException, Depends
from models.schemas import AssessmentRequest, FeedbackRequest, MaterialBasedAssessmentRequest
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
