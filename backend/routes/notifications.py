from fastapi import APIRouter, HTTPException, Depends
from services.email_service import email_service
from services.supabase_service import supabase_service
from routes.auth import get_current_user
from typing import Dict, Any
from pydantic import BaseModel

router = APIRouter(prefix="/notifications", tags=["Notifications"])

class AttendanceAlertRequest(BaseModel):
    threshold: float = 75.0  # Default: Alert if attendance < 75%

@router.post("/send-attendance-alerts")
async def send_attendance_alerts(
    request: AttendanceAlertRequest,
    current_user: dict = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Analyze attendance data and send email alerts to students with low attendance.
    Only teachers can trigger this.
    """
    # Ensure only teachers can send alerts
    if current_user.get("role") != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can send attendance alerts")
    
    try:
        # Fetch all attendance records
        attendance_data = supabase_service.get_client().table("attendance").select("*").execute()
        
        if not attendance_data.data:
            raise HTTPException(status_code=404, detail="No attendance records found")
        
        # Calculate attendance for each student
        student_attendance = {}
        for record in attendance_data.data:
            student_name = record["student_name"]
            status = record["status"]
            
            if student_name not in student_attendance:
                student_attendance[student_name] = {"total": 0, "present": 0}
            
            student_attendance[student_name]["total"] += 1
            if status == "Present":
                student_attendance[student_name]["present"] += 1
        
        # Identify low-attendance students
        low_attendance_students = []
        for student_name, stats in student_attendance.items():
            attendance_percentage = (stats["present"] / stats["total"]) * 100
            
            if attendance_percentage < request.threshold:
                # Try to find student email
                student_record = supabase_service.get_client().table("students").select("email, name").ilike("name", f"%{student_name}%").limit(1).execute()
                
                if student_record.data:
                    low_attendance_students.append({
                        "name": student_record.data[0]["name"],
                        "email": student_record.data[0]["email"],
                        "attendance_percentage": attendance_percentage,
                        "total_classes": stats["total"],
                        "attended_classes": stats["present"]
                    })
        
        if not low_attendance_students:
            return {
                "message": "No students with low attendance found",
                "threshold": request.threshold,
                "alerts_sent": 0
            }
        
        # Send emails
        results = email_service.send_bulk_attendance_alerts(low_attendance_students)
        
        return {
            "message": f"Attendance alerts processed",
            "threshold": request.threshold,
            "students_identified": len(low_attendance_students),
            "emails_sent": results["sent"],
            "emails_failed": results["failed"],
            "low_attendance_students": [
                {
                    "name": s["name"],
                    "attendance": f"{s['attendance_percentage']:.1f}%",
                    "classes_attended": f"{s['attended_classes']}/{s['total_classes']}"
                }
                for s in low_attendance_students
            ]
        }
    
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending attendance alerts: {str(e)}")
