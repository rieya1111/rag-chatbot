import chromadb
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
client = chromadb.PersistentClient(path="./chroma_db")

def store_chunks(chunks: list, doc_name: str):
    collection = client.get_or_create_collection(name="documents")
    embeddings = model.encode(chunks).tolist()
    ids = [f"{doc_name}_{i}" for i in range(len(chunks))]
    collection.add(documents=chunks, embeddings=embeddings, ids=ids)
    print(f"Stored {len(chunks)} chunks for {doc_name}")