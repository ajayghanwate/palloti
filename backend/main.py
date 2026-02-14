import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import analytics, academic, auth
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="MentorAI Backend", description="AI Academic Co-Pilot for Educators")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes
app.include_router(analytics.router)
app.include_router(academic.router)
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "Welcome to MentorAI API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
