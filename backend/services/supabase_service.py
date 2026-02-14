import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class SupabaseService:
    def __init__(self):
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")
        self.client: Client = create_client(url, key)

    def get_client(self) -> Client:
        return self.client

supabase_service = SupabaseService()
