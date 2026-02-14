import httpx
import os
from typing import Optional

class WhisperService:
    def __init__(self):
        self.endpoint = os.getenv("WHISPER_ENDPOINT", "http://localhost:9000/transcribe")

    async def transcribe(self, file_path: str) -> Optional[str]:
        """
        Send audio file to self-hosted Whisper service and return transcript.
        """
        try:
            async with httpx.AsyncClient(timeout=300.0) as client:
                with open(file_path, "rb") as f:
                    files = {"file": f}
                    response = await client.post(self.endpoint, files=files)
                
                if response.status_code == 200:
                    # Depending on whisper-api implementation, it might be in "text" or a JSON field
                    result = response.json()
                    return result.get("text", "") if isinstance(result, dict) else response.text
                else:
                    print(f"Whisper Error: {response.status_code} - {response.text}")
                    return None
        except Exception as e:
            print(f"Whisper Connection Error: {str(e)}")
            return None

whisper_service = WhisperService()
