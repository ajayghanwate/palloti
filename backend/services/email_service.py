import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
from typing import List, Dict

load_dotenv()

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.sender_email = os.getenv("EMAIL_SENDER")
        self.sender_password = os.getenv("EMAIL_PASSWORD")
        
        if not self.sender_email or not self.sender_password:
            print("Warning: Email credentials not configured. Set EMAIL_SENDER and EMAIL_PASSWORD in .env")
    
    def send_email(self, recipient: str, subject: str, body: str) -> bool:
        """Send a single email to a recipient"""
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self.sender_email
            message["To"] = recipient
            
            # Add HTML body
            html_part = MIMEText(body, "html")
            message.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.sendmail(self.sender_email, recipient, message.as_string())
            
            print(f"Email sent successfully to {recipient}")
            return True
        except Exception as e:
            print(f"Failed to send email to {recipient}: {str(e)}")
            return False
    
    def send_attendance_alert(self, student_email: str, student_name: str, attendance_percentage: float, total_classes: int, attended_classes: int) -> bool:
        """Send attendance alert email to a student"""
        subject = "⚠️ Low Attendance Alert - Action Required"
        
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #d9534f;">⚠️ Attendance Alert</h2>
                    <p>Dear <strong>{student_name}</strong>,</p>
                    
                    <p>This is an automated notification regarding your class attendance.</p>
                    
                    <div style="background-color: #f8d7da; border-left: 4px solid #d9534f; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Current Attendance:</strong> {attendance_percentage:.1f}%</p>
                        <p style="margin: 5px 0 0 0;"><strong>Classes Attended:</strong> {attended_classes} out of {total_classes}</p>
                    </div>
                    
                    <p>Your attendance is below the required threshold. Please attend your classes regularly to maintain good academic standing.</p>
                    
                    <p><strong>Recommended Actions:</strong></p>
                    <ul>
                        <li>Attend all upcoming classes</li>
                        <li>Speak with your teacher if you're facing any challenges</li>
                        <li>Catch up on missed lessons</li>
                    </ul>
                    
                    <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                        This is an automated message from MentorAI Academic System. Please do not reply to this email.
                    </p>
                </div>
            </body>
        </html>
        """
        
        return self.send_email(student_email, subject, body)
    
    def send_bulk_attendance_alerts(self, alerts: List[Dict]) -> Dict[str, int]:
        """Send attendance alerts to multiple students"""
        results = {"sent": 0, "failed": 0}
        
        for alert in alerts:
            success = self.send_attendance_alert(
                student_email=alert["email"],
                student_name=alert["name"],
                attendance_percentage=alert["attendance_percentage"],
                total_classes=alert["total_classes"],
                attended_classes=alert["attended_classes"]
            )
            
            if success:
                results["sent"] += 1
            else:
                results["failed"] += 1
        
        return results

# Create a singleton instance
email_service = EmailService()
