#Pharmbot App

You are an expert in Python, FastAPI, and Streamlit. Follow best practices for asynchronous API development with FastAPI and simple, responsive UI design using Streamlit. Also, leverage semantic search with a lightweight vector store (e.g., Chroma) and integrate with the OpenAI API for conversational responses.

Your job is to create a minimal management dashboard and chatbot application called Pharmbot with the following features:

Chat Interface:

1. A clean chat window where users can type questions related to standard operating procedures (SOPs) and see conversation history.
Integration with the OpenAI API to generate answers that reference relevant SOP documents.
SOP Document Upload & Categorization:

2. A simple file uploader that accepts SOP documents (PDF or TXT).
Functionality to assign categories or tags to each uploaded document.
Index the uploaded documents using a vector store (e.g., Chroma) for semantic search, so the chatbot can later reference specific SOPs in its responses.
Settings & Configuration:

3. A settings page or section to input/update the OpenAI API key.
Basic configuration options to adjust parameters (e.g., search parameters, response settings).
Backend API:

4. Implement REST endpoints with FastAPI to handle chat queries, document uploads, and configuration.
Incorporate asynchronous processing and retry logic for external API calls.
Deployment & Orchestration:

5. Provide Docker and docker-compose configurations to deploy the entire application.
Organize the codebase into separate modules for the FastAPI backend and the Streamlit frontend, ensuring clear separation of concerns.
Error Handling & Session Management:

6. Maintain session history of chat conversations.
Ensure proper error handling and fallback responses for invalid inputs or failed API calls.
Replace any existing code in the codebase to transform it into Pharmbot. Ensure that the final application is minimal, professional, and user-friendly while supporting the core functionalities above.


#Stack and Infrastructure

1. High-Level Architecture
Goal:
Create a minimal web-based chatbot where you can ask questions related to standard operating procedures (SOPs). The bot will:

Look up answers by categorizing and referencing the uploaded SOP documents.
Return responses that include references to specific document sections (e.g., "see SOP category X, document Y").
Allow you to update the SOP documents as needed.
Architecture Diagram:

sql
Copy
+-------------------+      +-----------------------+      +---------------------+
|                   |      |                       |      |                     |
|  Frontend Chat UI | <--> |  API Middleware       | <--> |   SOP Documents     |
|                   |      | (Chatbot & Lookup API) |      | (Uploaded & Categorized)|
+-------------------+      +-----------------------+      +---------------------+
         |                             |
         |   Chat queries/responses    |
         |                             |
         v                             v
   [OpenAI API or similar]      [Document categorization lookup]
Frontend: A simple single-page application (SPA) with a chat window.
API Layer: A basic backend (using FastAPI, for instance) that:
Receives chat queries.
Searches the uploaded SOP documents for relevant categories or references.
Calls an OpenAI API (or similar) to generate a final answer, integrating document references.
Document Storage: A storage system (could be as simple as local files or a vector store) where SOP documents are uploaded, categorized, and indexed.
2. UI Components
Since you want a basic UI:

Chat Window:
Input Field: For asking questions.
Display Area: For showing conversation history.
SOP Upload (Optional):
A simple file uploader to add new SOP documents.
A minimal categorization field (e.g., dropdown or tags) that lets you tag the document with a category.
Settings:
A field to update the OpenAI (or other LLM) API key.
(Optional) Basic instructions on how the bot uses the documents.
Note: Instead of a complex library, the SOPs are only referenced by the chatbot. For example, when you ask "How do I handle returns?" the bot might respond "Please refer to the Returns category in SOP document #3."

3. Technology & Tools Recommendations
Backend Framework:

FastAPI: Lightweight, asynchronous, and easy to integrate with both an LLM API and file storage.
Frontend Framework:

A minimal framework using basic HTML/CSS/JavaScript, or a lightweight library like Streamlit for rapid prototyping.
Document Indexing:

For simple semantic search, consider a small vector store (such as ChromaDB) if you need to embed document text.
Alternatively, use basic keyword-based search if semantic search is not required.
LLM Integration:

Connect to the OpenAI API (or similar) to generate final responses.
The LLM prompt can include instructions like "If you mention a process, please reference the corresponding SOP category from the uploaded documents."
4. Interaction Flow
SOP Document Upload & Categorization:

You upload one or more SOP documents.
Each document is tagged with a category (e.g., Returns, Inventory, Safety, etc.).
The system indexes these documents for future lookup (either via simple metadata or embedding).
User Interaction:

The user opens the chat window and types a question.
The backend parses the question, determines which category of SOP may be relevant, and retrieves a reference (or snippet) from the corresponding SOP document.
The question and the retrieved reference are passed to the LLM API to generate a final, contextual answer.
The answer, including a reference (e.g., "see SOP [Returns, Doc #3]"), is returned and displayed in the chat window.
Session History:

The conversation history is maintained for context, but the primary focus remains on question-answer pairs with document references.
5. Implementation Outline
Backend (FastAPI):

Endpoint /chat:

Accepts POST requests with a JSON body { "query": "your question" }.
Looks up the query in the categorized SOP index.
Calls the OpenAI API with a prompt that includes the query and the relevant SOP reference.
Returns a JSON response with the answer.
Endpoint /upload:

Accepts file uploads along with a category tag.
Stores the file and updates the SOP index.
Frontend (Streamlit or Minimal HTML/JS):

A chat interface that:
Displays conversation history.
Has an input field to send questions.
Optionally includes a file uploader for new SOP documents.
The UI sends the query to the FastAPI /chat endpoint and displays the response.
Example Chatbot Response
When you ask, "How do I process a return?" the LLM might generate:

"To process a return, follow the guidelines outlined in the Returns SOP (see SOP: Returns, Document #3). Ensure that the product is inspected for quality before issuing a refund."

This answer references the relevant SOP category without needing a full-blown SOP library UI.

Summary
This simplified Pharmbot design focuses on a basic chat interface that:

Receives your questions.
Looks up relevant SOP document categories (based on uploaded files).
Uses an LLM (via OpenAI API) to generate contextual answers with document references.
Maintains a clean, minimal UI to keep the interaction straightforward.
You can now provide this streamlined infrastructure blueprint to your development team or an AI coding assistant to start building Pharmbot's front-end and back-end code.



Follow the following 10 step plan:

Step 1: 
Project Setup and Initial Configuration (Updated)
Set up environment variables for OpenAI and Supabase
Modify the database schema to support SOP document storage and vector search
Install any additional required dependencies

Step 2: Set Up User Authentication Flow
Implement sign-in and sign-up pages with Supabase Auth
Create protected routes and authentication middleware
Implement session management
Step 3: Create Database Models and API
Define TypeScript interfaces for all data models
Implement API routes for SOP document management
Set up OpenAI integration for embeddings generation
Step 4: Build SOP Document Management
Create file upload component for SOP documents
Implement document categorization functionality
Build document listing and management interface
Step 5: Implement Vector Search and Embedding
Add functionality to generate embeddings for uploaded documents
Set up vector search with Supabase pgvector
Create API endpoint for semantic search queries
Step 6: Design Chat Interface
Build a responsive chat UI component
Implement chat session storage and retrieval
Add message history functionality
Step 7: Integrate OpenAI for Chat Responses
Set up chat completion with context from SOP documents
Implement prompt engineering for accurate responses
Add reference linking to relevant SOP documents
Step 8: Create Settings and Configuration
Build settings page for OpenAI API key management
Add configuration options for search parameters
Implement user preference storage
Step 9: Error Handling and Edge Cases
Add robust error handling for API calls
Implement fallback responses for failed queries
Create loading states and error messages
Step 10: Testing and Deployment
Write tests for critical functionality
Set up deployment configuration for Vercel
Configure production environment variables







