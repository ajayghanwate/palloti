from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from services.parser_service import parser_service
from services.ai_service import ai_service
from services.supabase_service import supabase_service
from routes.auth import get_current_user
from typing import Dict, Any

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.post("/analyze-marks")
async def analyze_marks(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    content = await file.read()
    try:
        avg_score, weak_topics, risk_students, summary = parser_service.parse_marks_csv(content)
        ai_analysis = await ai_service.analyze_marks(summary)
        
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

@router.post("/analyze-syllabus")
async def analyze_syllabus(file: UploadFile = File(...), subject: str = "General", unit: str = "Unit 1", current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    content = await file.read()
    try:
        text = parser_service.parse_syllabus_pdf(content)
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
