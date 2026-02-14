from pydantic import BaseModel, Field
from typing import List, Optional

class StudentMark(BaseModel):
    student_name: str
    score: float

class MarksAnalysisRequest(BaseModel):
    subject: str
    marks: List[StudentMark]

class AssessmentRequest(BaseModel):
    subject: str
    unit: str
    difficulty: str = "Medium"
    num_questions: int = 5

class FeedbackRequest(BaseModel):
    student_name: str
    score: float
    weak_topics: List[str]

class SyllabusAnalysisRequest(BaseModel):
    subject: str

class UploadMaterialRequest(BaseModel):
    subject: str
    unit: str
    title: Optional[str] = None

class MaterialBasedAssessmentRequest(BaseModel):
    material_id: str
    difficulty: str = "Medium"
    num_questions: int = 5

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    subject: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class StudentLoginRequest(BaseModel):
    email: str
    password: str

class StudentRegister(BaseModel):
    name: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None

class LearningGapRequest(BaseModel):
    subject: str

class LearningGapResponse(BaseModel):
    detected_gaps: List[str]
    recovery_plan: str
    at_risk_topics: List[str]
