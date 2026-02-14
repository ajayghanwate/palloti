import whisper
from fastapi import FastAPI, UploadFile, File, HTTPException
import uvicorn
import os
import tempfile
import shutil
import urllib.request
import zipfile
import io
import sys

def check_and_install_ffmpeg():
    """
    Checks if ffmpeg is available. If not, downloads and installs it locally.
    """
    if shutil.which("ffmpeg"):
        print("✅ FFmpeg found.")
        return

    print("❌ FFmpeg not found in system PATH.")
    print("⬇️  Downloading FFmpeg (Essentials Build)... This may take a minute.")
    
    url = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
    zip_path = "ffmpeg_temp.zip"
    
    def progress_bar(block_num, block_size, total_size):
        downloaded = block_num * block_size
        percent = int(downloaded / total_size * 100)
        sys.stdout.write(f"\rDownloading: {percent}% ({downloaded // 1024 // 1024}MB / {total_size // 1024 // 1024}MB)")
        sys.stdout.flush()

    try:
        # Download the zip file with progress
        urllib.request.urlretrieve(url, zip_path, progress_bar)
        print("\n📦 Extracting FFmpeg...")
        
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            # Find the bin folder in the zip
            bin_folder = None
            for file in zip_ref.namelist():
                if file.endswith("bin/"):
                    bin_folder = file
                    break
            
            if not bin_folder:
                # Fallback search for executables
                for file in zip_ref.namelist():
                    if file.endswith("ffmpeg.exe"):
                        with open("ffmpeg.exe", "wb") as f_out:
                            f_out.write(zip_ref.read(file))
                    elif file.endswith("ffprobe.exe"):
                        with open("ffprobe.exe", "wb") as f_out:
                            f_out.write(zip_ref.read(file))
            else:
                 # Extract standard structure
                 for file in zip_ref.namelist():
                     if file.endswith("ffmpeg.exe") or file.endswith("ffprobe.exe"):
                         filename = os.path.basename(file)
                         with open(filename, "wb") as f_out:
                             f_out.write(zip_ref.read(file))

        print("✅ FFmpeg installed locally!")
        
        # Cleanup zip
        if os.path.exists(zip_path):
            os.remove(zip_path)
            
        # Add current directory to PATH for this process
        os.environ["PATH"] += os.pathsep + os.getcwd()
        
    except Exception as e:
        print(f"\n⚠️ Failed to auto-install FFmpeg: {e}")
        print("Please install FFmpeg manually or use the Docker method.")

app = FastAPI(title="Whisper ASR Microservice")

# Ensure FFmpeg is available before loading model
check_and_install_ffmpeg()

# "tiny" is much faster for CPU-based transcription (perfect for hackathons)
print("Loading Whisper 'tiny' model...")
model = whisper.load_model("tiny")
print("✅ Whisper 'tiny' model loaded and ready!")

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    """
    Receives an audio file and returns the transcribed text.
    """
    try:
        # Create a temporary file to save the upload
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_audio:
            shutil.copyfileobj(file.file, temp_audio)
            temp_path = temp_audio.name

        # Transcribe using Whisper
        print(f"Transcribing: {file.filename}...")
        # Disable fp16 for CPU to avoid warnings and potential errors
        result = model.transcribe(temp_path, fp16=False)
        print(f"✅ Transcription complete for: {file.filename}")
        
        # Cleanup temp file
        os.remove(temp_path)
        
        if result and "text" in result:
            return {"text": result["text"]}
        else:
            print(f"❌ Empty result from Whisper for {file.filename}")
            return {"text": ""}
    
    except Exception as e:
        import traceback
        error_msg = f"Transcription error: {str(e)}"
        print(error_msg)
        traceback.print_exc() # Show exactly where it failed in the terminal
        raise HTTPException(status_code=500, detail=error_msg)

if __name__ == "__main__":
    # Run on port 9000 as expected by the main backend
    uvicorn.run(app, host="0.0.0.0", port=9000)
