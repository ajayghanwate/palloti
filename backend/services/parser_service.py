import pandas as pd
import pdfplumber
from typing import List, Dict, Any, Tuple
import io

class ParserService:
    def parse_marks_csv(self, file_content: bytes) -> Tuple[float, List[str], List[str], str]:
        df = pd.read_csv(io.BytesIO(file_content))
        
        # Assuming CSV has 'student_name' and 'score' columns
        # If columns are different, we might need a more robust mapping
        if 'score' not in df.columns:
            # Try to find numeric column
            numeric_cols = df.select_dtypes(include=['number']).columns
            if not numeric_cols.empty:
                score_col = numeric_cols[0]
            else:
                raise ValueError("CSV must contain a numeric 'score' column")
        else:
            score_col = 'score'
            
        average_score = df[score_col].mean()
        
        # Simple logic for risk students- those below 40% of max or below certain threshold
        threshold = 40 
        risk_students = df[df[score_col] < threshold]['student_name'].tolist() if 'student_name' in df.columns else []
        
        # Weak topics (this usually requires topic-wise marks, but if not provided, we can't infer much from a single score)
        # For now, let's assume we might have column-wise topics or just a general list
        weak_topics = [] # This would ideally come from analyzing sub-scores
        
        # Create a summary for AI
        summary = f"Average Score: {average_score:.2f}. Total Students: {len(df)}. Risk Students: {len(risk_students)}."
        
        return average_score, weak_topics, risk_students, summary

    def parse_syllabus_pdf(self, file_content: bytes) -> str:
        """
        Extract text from PDF with multiple strategies for better content extraction
        """
        text = ""
        try:
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                for page_num, page in enumerate(pdf.pages, 1):
                    # Try multiple extraction strategies
                    page_text = page.extract_text()
                    
                    # If extract_text() returns very little, try with layout preservation
                    if not page_text or len(page_text.strip()) < 50:
                        page_text = page.extract_text(layout=True)
                    
                    # If still minimal, try extracting from tables
                    if not page_text or len(page_text.strip()) < 50:
                        tables = page.extract_tables()
                        if tables:
                            for table in tables:
                                for row in table:
                                    page_text += " ".join([str(cell) for cell in row if cell]) + "\n"
                    
                    if page_text:
                        text += f"\n--- Page {page_num} ---\n{page_text}\n"
            
            # Clean up the text
            text = text.strip()
            
            # If we got very little text, it might be an image-based PDF
            if len(text) < 100:
                return f"Warning: Only extracted {len(text)} characters. This PDF might be image-based or encrypted. Extracted content: {text}"
            
            return text
            
        except Exception as e:
            raise ValueError(f"Failed to parse PDF: {str(e)}")

parser_service = ParserService()
