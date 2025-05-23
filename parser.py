from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pdfplumber, io, os, json
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class FormSpec(BaseModel):
    spec: dict   # Whatever the LLM returns

def call_llm(raw_text: str) -> dict:
    """
    Ask the model to summarise the PDF into a JSON form definition.
    A *very* small prompt works on the sample file, but you can refine / add
    function-calling, schema validation, etc.
    """
    SYSTEM = """You are an insurance-form analyst. 
    Convert raw text into JSON of {section:{label:type}}."""
    USER   = f"""RAW FORM TEXT (truncated if >7 kB):
    ```
    {raw_text[:7000]}
    ```"""

    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": USER},
        ],
        # good idea to add a JSON schema + function here
        temperature=0
    )
    return json.loads(response.choices[0].message.content)

@app.post("/upload", response_model=FormSpec)
async def upload(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "PDF only")

    with pdfplumber.open(io.BytesIO(await file.read())) as pdf:
        raw_text = "\n".join(p.extract_text() or "" for p in pdf.pages)

    spec = call_llm(raw_text)
    return {"spec": spec}
