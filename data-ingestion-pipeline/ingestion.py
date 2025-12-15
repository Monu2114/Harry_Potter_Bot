# get files from data folder
# read files
# chunk files
# generate embeddings
# insert into db
from pathlib import Path
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import os
from supabase import create_client, Client
load_dotenv()
model = SentenceTransformer("all-MiniLM-L6-v2")


url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def chunk_text(file,chunk_size=500):
    text=file.read_text(encoding="utf-8")
    for i in range(0,len(text),chunk_size):
        yield text[i:i+chunk_size]
       

path=Path("data")
files=path.glob("**/*.txt")
rows=[] #batch embeddings and insert
for file in files:
    chunks=chunk_text(file)
    for chunk in chunks:
        embeddings=model.encode(chunk).tolist()
        rows.append({"content": chunk, "embedding": embeddings})
        if(len(rows)==50):
            supabase.table("docs").insert(rows).execute()
            rows=[]
if rows:
    supabase.table("docs").insert(rows).execute()
        