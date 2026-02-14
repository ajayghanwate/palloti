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
        Extract text from PDF using multiple libraries and strategies.
        """
        text = ""
        # Strategy 1: pdfplumber (Better for layout and tables)
        try:
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                for page_num, page in enumerate(pdf.pages, 1):
                    page_text = page.extract_text()
                    if not page_text or len(page_text.strip()) < 50:
                        page_text = page.extract_text(layout=True)
                    
                    if page_text:
                        # Basic filtering: ignore lines that are just a single number (often page numbers)
                        filtered_lines = [line for line in page_text.split('\n') if len(line.strip()) > 2 or not line.strip().isdigit()]
                        text += "\n".join(filtered_lines) + "\n"
        except Exception as e:
            print(f"pdfplumber failed: {e}")

        # Strategy 2: pypdf (Better for certain encodings, use as fallback/append if text is short)
        if len(text.strip()) < 100:
            try:
                from pypdf import PdfReader
                reader = PdfReader(io.BytesIO(file_content))
                pypdf_text = ""
                for page in reader.pages:
                    pypdf_text += page.extract_text() + "\n"
                
                if len(pypdf_text.strip()) > len(text.strip()):
                    text = pypdf_text
            except Exception as e:
                print(f"pypdf failed: {e}")

        text = text.strip()
        
        # Final safety check: If we still only have numbers or very little text
        digits_only = "".join([c for c in text if c.isdigit()])
        if len(text) > 0 and (len(digits_only) / len(text)) > 0.5 and len(text) < 200:
             return f"Warning: Extracted content looks like mostly metadata or page numbers. Please ensure the PDF is text-based. Extracted: {text[:100]}"
        
        return text

parser_service = ParserService()
