import os
import json
from groq import Groq
from dotenv import load_dotenv
from typing import List, Dict, Any

load_dotenv()

class AIService:
    def __init__(self):
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY must be set")
        self.client = Groq(api_key=api_key)
        self.model = "llama-3.3-70b-versatile"

    async def generate_completion(self, prompt: str, system_prompt: str = "You are a helpful teaching assistant.") -> str:
        completion = self.client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            model=self.model,
            response_format={"type": "json_object"}
        )
        return completion.choices[0].message.content

    async def analyze_marks(self, marks_summary: str) -> Dict[str, Any]:
        prompt = f"""
        Analyze the following student marks summary and provide:
        1. Performance summary
        2. Teaching strategy suggestions
        
        Summary Data:
        {marks_summary}
        
        Return JSON format:
        {{
            "performance_summary": "...",
            "teaching_strategy": "..."
        }}
        """
        response = await self.generate_completion(prompt)
        return json.loads(response)

    async def generate_assessment(self, subject: str, unit: str, difficulty: str, num_questions: int) -> Dict[str, Any]:
        prompt = f"""
You are an expert teacher creating an assessment.

Generate {num_questions} questions for:
- Subject: {subject}
- Unit/Topic: {unit}
- Difficulty Level: {difficulty}

Create a mix of Multiple Choice Questions (MCQs) and Short Answer questions.
For each question, include a Bloom's Taxonomy level (Remember, Understand, Apply, Analyze, Evaluate, Create).

Return ONLY valid JSON in this exact format:
{{
  "assessment_title": "{subject} - {unit} Assessment",
  "total_questions": {num_questions},
  "questions": [
    {{
      "question_number": 1,
      "question_text": "What is...",
      "question_type": "MCQ",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct_answer": "A",
      "bloom_level": "Remember",
      "marks": 2
    }},
    {{
      "question_number": 2,
      "question_text": "Explain...",
      "question_type": "Short Answer",
      "bloom_level": "Understand",
      "marks": 5
    }}
  ]
}}
        """
        try:
            response = await self.generate_completion(prompt, system_prompt="You are an expert teacher. Return only valid JSON, no additional text.")
            return json.loads(response)
        except json.JSONDecodeError as e:
            # Fallback: return a simple structure if AI fails
            return {{
                "assessment_title": f"{subject} - {unit} Assessment",
                "total_questions": num_questions,
                "questions": [
                    {{
                        "question_number": i+1,
                        "question_text": f"Sample question {i+1} for {unit}",
                        "question_type": "MCQ" if i % 2 == 0 else "Short Answer",
                        "bloom_level": "Apply",
                        "marks": 2
                    }} for i in range(num_questions)
                ],
                "note": "AI generation failed, showing sample structure"
            }}

    async def generate_assessment_from_content(self, content: str, subject: str, unit: str, difficulty: str, num_questions: int) -> Dict[str, Any]:
        """Generate assessment questions based on actual PDF content"""
        # Truncate content if too long (keep first 3000 words to stay within token limits)
        words = content.split()
        if len(words) > 3000:
            content = " ".join(words[:3000]) + "... [content truncated]"
        
        prompt = f"""
You are an expert teacher creating an assessment based on the following study material.

STUDY MATERIAL:
{content}

Based ONLY on the content above, generate {num_questions} questions for:
- Subject: {subject}
- Unit/Topic: {unit}
- Difficulty Level: {difficulty}

IMPORTANT: Create questions that test understanding of the SPECIFIC content provided above.
Do NOT create generic questions - use actual facts, concepts, and examples from the material.

Create a mix of Multiple Choice Questions (MCQs) and Short Answer questions.
For each question, include a Bloom's Taxonomy level.

Return ONLY valid JSON in this exact format:
{{
  "assessment_title": "{subject} - {unit} Assessment",
  "total_questions": {num_questions},
  "source": "Generated from uploaded PDF content",
  "questions": [
    {{
      "question_number": 1,
      "question_text": "Based on the material, what is...",
      "question_type": "MCQ",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct_answer": "A",
      "bloom_level": "Remember",
      "marks": 2
    }}
  ]
}}
        """
        try:
            response = await self.generate_completion(prompt, system_prompt="You are an expert teacher. Generate questions from the provided content only. Return only valid JSON.")
            return json.loads(response)
        except json.JSONDecodeError:
            return {{
                "assessment_title": f"{subject} - {unit} Assessment",
                "total_questions": num_questions,
                "source": "PDF content",
                "questions": [
                    {{
                        "question_number": i+1,
                        "question_text": f"Question {i+1} based on {unit} material",
                        "question_type": "Short Answer",
                        "bloom_level": "Apply",
                        "marks": 3
                    }} for i in range(num_questions)
                ],
                "note": "AI generation failed, showing sample structure"
            }}

    async def generate_feedback(self, student_name: str, score: float, weak_topics: List[str]) -> Dict[str, Any]:
        prompt = f"""
        Generate personalized feedback for:
        Student: {student_name}
        Score: {score}
        Weak Topics: {", ".join(weak_topics)}
        
        Include:
        - Strengths
        - Weak Areas
        - Improvement Plan
        - Motivational message
        
        Return JSON format:
        {{
            "strengths": "...",
            "weak_areas": "...",
            "improvement_plan": "...",
            "motivational_message": "..."
        }}
        """
        response = await self.generate_completion(prompt)
        return json.loads(response)

    async def analyze_syllabus(self, text: str) -> Dict[str, Any]:
        prompt = f"""
        Analyze the following syllabus text:
        1. Extract major topics
        2. Suggest assessment focus areas
        
        Text:
        {text[:4000]} # Truncate for token limits if necessary
        
        Return JSON format:
        {{
            "major_topics": ["...", "..."],
            "assessment_focus": ["...", "..."]
        }}
        """
        response = await self.generate_completion(prompt)
        return json.loads(response)

    async def analyze_attendance(self, attendance_summary: str) -> Dict[str, Any]:
        prompt = f"""
        Analyze this student attendance summary:
        {attendance_summary}
        
        Identify:
        1. Students with worrying attendance trends
        2. Impact on class engagement
        3. Simple suggestions for the teacher
        
        Return JSON:
        {{
            "risk_analysis": "...",
            "engagement_score": 0-100,
            "suggestions": [...]
        }}
        """
        response = await self.generate_completion(prompt)
        return json.loads(response)

    async def detect_learning_gaps(self, marks_summary: str, syllabus_topics: List[str]) -> Dict[str, Any]:
        prompt = f"""
        Compare student performance with syllabus topics:
        Syllabus: {", ".join(syllabus_topics)}
        Performance Summary: {marks_summary}
        
        Identify where students are failing to understand specific topics (Learning Gaps).
        Provide a recovery plan.
        
        Return JSON:
        {{
            "detected_gaps": ["topic 1", "topic 2"],
            "recovery_plan": "Specific teaching steps...",
            "at_risk_topics": ["topic A"]
        }}
        """
        response = await self.generate_completion(prompt)
        return json.loads(response)

ai_service = AIService()
