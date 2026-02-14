# Whisper API Setup Guide

To use the **Lecture-to-PDF** feature, you need a Whisper microservice running on your local machine at `http://localhost:9000`. 

Here are the two easiest ways to set it up:

---

## Option 1: Using Docker (Recommended)
If you have Docker installed, this is the fastest way. Run this command in your terminal:

```bash
docker run -d -p 9000:9000 -e ASR_MODEL=base -e ASR_ENGINE=openai_whisper onerahmet/openai-whisper-asr-webservice:latest
```

This will:
- Download the Whisper API image.
- Start the server on port 9000.
- Handle multiple audio formats automatically.

---

## Option 2: Using Python (No Docker)
If you don't use Docker, you can run a simple Whisper server using Python:

1. **Install requirements**:
   ```bash
   pip install openai-whisper fastapi uvicorn python-multipart
   ```

2. **Create a file named `whisper_server.py`**:
   ```python
   import whisper
   from fastapi import FastAPI, UploadFile, File
   import uvicorn
   import os

   app = FastAPI()
   model = whisper.load_model("base") # Use "tiny", "base", "small", etc.

   @app.post("/transcribe")
   async def transcribe(file: UploadFile = File(...)):
       with open("temp_audio", "wb") as f:
           f.write(await file.read())
       
       result = model.transcribe("temp_audio")
       os.remove("temp_audio")
       return {"text": result["text"]}

   if __name__ == "__main__":
       uvicorn.run(app, host="0.0.0.0", port=9000)
   ```

3. **Run it**:
   ```bash
   python whisper_server.py
   ```

---

## How to Verify it's Working
Once the server is running, open your browser and go to:
`http://localhost:9000/docs`

If you see a Swagger page, your **Lecture-to-PDF** feature is ready to use! 🚀
