import chromadb
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
client = chromadb.PersistentClient(path="./chroma_db")

def retrieve_relevant_chunks(question: str, top_k: int = 5) -> list:
    collection = client.get_or_create_collection(name="documents")
    question_embedding = model.encode([question]).tolist()
    results = collection.query(query_embeddings=question_embedding, n_results=top_k)
    return results["documents"][0]