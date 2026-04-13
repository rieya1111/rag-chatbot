from google import genai

client = genai.Client(api_key="AIzaSyB1-4nmgSs7yFsqnCnk4bRHroV7lCgzLYc")

def get_answer(question: str, context_chunks: list) -> str:
    context = "\n\n".join(context_chunks)
    prompt = f"""You are a helpful assistant for college students.
Use only the context below to answer the question.
If the answer is not in the context, say "I don't know based on the documents provided."

Context:
{context}

Question: {question}
"""
    response = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=prompt
    )
    return response.text