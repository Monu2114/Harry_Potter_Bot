from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel


app = FastAPI()
model = SentenceTransformer("all-MiniLM-L6-v2")
class EmbedRequest(BaseModel):
    text: str

@app.post("/embed")
def embed(request: EmbedRequest):
    return model.encode(request.text).tolist()
