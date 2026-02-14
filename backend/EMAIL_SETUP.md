# Attendance Alert System - Email Setup Guide

## Quick Setup (Using Gmail)

### Step 1: Enable 2-Step Verification
1. Go to your [Google Account](https://myaccount.google.com/)
2. Click **Security** → **2-Step Verification**
3. Follow the prompts to enable it

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Other (Custom name)**
3. Enter "MentorAI Backend" as the name
4. Click **Generate**
5. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update Your `.env` File
Add these lines to your `.env` file (create it if it doesn't exist):

```
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_SENDER=your.email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

**Replace**:
- `your.email@gmail.com` with your Gmail address
- `abcd efgh ijkl mnop` with the App Password you copied

### Step 4: Test the System
1. **Register a Student** (must have a real email):
   ```json
   POST /auth/student-register
   {
       "name": "Test Student",
       "email": "student_real_email@gmail.com",
       "password": "password123"
   }
   ```

2. **Upload Attendance** (make sure the student has low attendance):
   - Upload a CSV with the student marked as "Absent" multiple times

3. **Trigger Alerts**:
   ```json
   POST /notifications/send-attendance-alerts
   {
       "threshold": 75.0
   }
   ```

4. **Check the student's email** - they should receive a nicely formatted alert!

## How It Works

1. The system calculates attendance percentage for each student
2. Students below the threshold (default 75%) are identified
3. Their email addresses are fetched from the `students` table
4. A professional HTML email is sent to each low-attendance student

## Troubleshooting

### "Authentication failed"
- Make sure you're using an **App Password**, not your regular Gmail password
- Double-check there are no spaces in the password in your `.env` file

### "Email not sent"
- Check that the student has registered with a valid email
- Verify your internet connection
- Check the terminal logs for specific error messages

### Emails going to Spam
- Ask recipients to mark emails from your address as "Not Spam"
- Consider using a professional email domain instead of Gmail for production

## Testing Without Real Emails

During development, you can check the terminal logs to see which students would receive emails without actually sending them.
