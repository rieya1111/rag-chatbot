import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pdf_extractor import extract_text_from_pdf
from chunker import chunk_text
from embedder import store_chunks
from retriever import retrieve_relevant_chunks
from llm import get_answer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
    text = extract_text_from_pdf(file_path)
    chunks = chunk_text(text)
    store_chunks(chunks, file.filename)
    return {"message": f"{file.filename} uploaded and processed successfully"}

@app.post("/ask")
async def ask_question(payload: dict):
    question = payload.get("question")
    chunks = retrieve_relevant_chunks(question)
    answer = get_answer(question, chunks)
    return {"answer": answer}