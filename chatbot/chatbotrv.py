from langchain.text_splitter import RecursiveCharacterTextSplitter 
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFacePipeline
from langchain_community.vectorstores import Chroma 
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain.schema import Document
import sys
from PyPDF2 import PdfReader
from transformers import pipeline
import os

# Suppress the warning for symlinks
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

# Specify the path to the PDF file
pdf_path = "C:\\Users\\Erin\\Desktop\\HRBOT\\HR_Policy.pdf"

# Read the PDF and extract text
try:
    with open(pdf_path, "rb") as file:
        reader = PdfReader(file)
        pdf_text = [page.extract_text() for page in reader.pages if page.extract_text()]
        full_text = "\n".join(pdf_text)

except Exception as e:
    print(f"Error reading PDF: {e}")
    sys.exit()

# Check if any text is extracted
if not full_text.strip():
    print("No text extracted from the PDF. Please check the content.")
    sys.exit()

# Chunking
text_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
chunks = text_splitter.split_text(full_text)

# Check if chunks are created
if not chunks:
    print("No chunks created. Please check the text splitting parameters.")
    sys.exit()

# Print the number of chunks created
print(f"Number of chunks created: {len(chunks)}")

# Convert text chunks into Document objects
documents = [Document(page_content=chunk) for chunk in chunks]

# Embeddings creation
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Generate IDs for each document
ids = [str(i) for i in range(len(documents))]

# Vector store creation
vectorstore = Chroma.from_documents(documents, embeddings, ids=ids)

# Setting up retriever with top 5 relevant documents
retriever = vectorstore.as_retriever(search_kwargs={'k': 5})

# Load the Hugging Face model using the QA pipeline
hf_pipeline = pipeline("question-answering", model="distilbert-base-uncased-distilled-squad")

# Define a function to preprocess retrieved documents
def preprocess_retrieved_documents(documents):
    return " ".join([doc.page_content for doc in documents])

# Query loop
while True:
    user_input = input("Input query: ")
    if user_input.lower() == 'exit':
        print("Exiting...")
        break
    if user_input.strip() == "":
        continue
    # Retrieve documents based on user query
    retrieved_docs = retriever.get_relevant_documents(user_input)
    # Preprocess documents to get text content
    context_text = preprocess_retrieved_documents(retrieved_docs)
    # Use the question-answering pipeline with question and context
    result = hf_pipeline(question=user_input, context=context_text)
    print("Answer:", result['answer'])
