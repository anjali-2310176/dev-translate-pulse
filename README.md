# DevTranslate | Workspace Intelligence

DevTranslate is a next-generation workspace intelligence platform that bridges the gap between engineering teams and business stakeholders. It seamlessly transforms technical GitHub activity, Jira tickets, and architectural states into plain-language progress briefs, executive scorecards, and interactive Q&A sessions.

## 🚀 Features (MVP)

- **Translation Engine**: Paste any highly technical engineering update (e.g., "Refactored the Redis caching layer to use read-through strategy with TTL-based invalidation") and instantly generate a business-friendly explanation of its impact.
- **Sandbox Q&A**: An interactive chat interface powered by a contextual system prompt, allowing non-technical executives to ask questions about sprint blockers, architecture choices, and release timelines.
- **Executive Dashboard**: A premium, glassmorphism-inspired UI displaying project health, sprint velocity, and technical debt distribution.
- **Demo Authentication**: Secure, stateless login using a built-in Demo Credentials provider (no OAuth configuration required).
- **Persistent History**: All translations and chat sessions are permanently saved to a Supabase PostgreSQL database for easy retrieval.

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Vanilla CSS with modern Glassmorphism aesthetics
- **Database**: PostgreSQL (hosted on Supabase)
- **ORM**: Prisma v7
- **Authentication**: NextAuth.js (Demo Credentials Provider + Prisma Adapter)
- **AI Engine**: Google Gemini API (`gemini-flash-lite-latest`)
- **Charting**: Recharts

## 💻 Local Development Setup

To run this project locally, you will need a Supabase database and a Gemini API key.

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/dev-translate-pulse.git
   cd dev-translate-pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add the following keys:
   ```env
   # Database connection string from Supabase
   DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

   # NextAuth Setup
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-random-secret-key"

   # Google Gemini API
   GEMINI_API_KEY="your_gemini_api_key"
   ```

4. **Initialize the Database**
   Push the Prisma schema to your Supabase database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

This project is fully optimized for deployment on Vercel. 
1. Import the repository into Vercel.
2. Copy the contents of your `.env.local` into the Vercel Environment Variables section (ensure they apply to both Production and Preview).
3. Important: Leave `NEXTAUTH_URL` blank in Vercel (it handles this automatically).
4. Deploy!
