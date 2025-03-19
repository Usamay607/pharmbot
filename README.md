# Pharmbot

Pharmbot is an AI-powered chatbot application for pharmaceutical Standard Operating Procedures (SOPs). It allows users to upload, manage, and search through SOP documents, and get instant answers with references to specific SOP documentation.

## Features

- **Authentication**: Secure user authentication with Supabase Auth
- **SOP Document Management**: Upload, categorize, and manage SOP documents
- **Vector Search**: Semantic search through documents using embeddings
- **AI-Powered Chat**: Chat with an AI assistant that references your SOP documents
- **Dashboard Analytics**: View statistics about your SOP documents

## Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase Postgres with pgvector
- **AI**: OpenAI API for embeddings and chat completions
- **Deployment**: Vercel

## Deployment to Vercel

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign up or log in
2. Create a new project
3. Once the project is created, go to the SQL Editor and run the following migrations:
   - The init SQL migration from `supabase/migrations/20230707053030_init.sql`
   - The SOP documents migration from `supabase/migrations/20240319000000_sop_documents.sql`
   - The match documents function from `supabase/migrations/20240319010000_match_documents_func.sql`

### 2. Fork or Clone This Repository to Your GitHub Account

```bash
git clone https://github.com/yourusername/pharmbot.git
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com/) and sign up or log in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: leave as is (/)
   - Build and Output Settings: leave as default

5. Add the following environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project anon key
   - `MAX_FILE_SIZE`: `10485760` (10MB)
   - `ALLOWED_FILE_TYPES`: `application/pdf,text/plain`

6. Click "Deploy"

Once the deployment is complete, your Pharmbot application will be available at the provided Vercel URL.

### 4. Configure Supabase Authentication

1. Go to your Supabase dashboard
2. Navigate to Authentication > URL Configuration
3. Add your Vercel deployment URL as the Site URL
4. Save the changes

## Using Pharmbot

1. Sign up for an account
2. Upload your SOP documents in the SOP Management section
3. Categorize your documents
4. Use the chat interface to ask questions about your SOPs
5. View analytics about your SOP documents in the dashboard

## Local Development

If you want to run the application locally:

```bash
# Install dependencies
npm install

# Create a .env.local file with your development keys
cp .env.example .env.local

# Start the development server
npm run dev
```

Then, open your browser and navigate to http://localhost:3000.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
