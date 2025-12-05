# AI-Powered RFP Management System

Single-user web application to create RFPs from natural language, send them to vendors, automatically parse vendor proposals, and provide AI-assisted comparison and recommendation.

## Quickstart (MVP)
1. Clone the repo and open terminal.
2. Configure `.env` from `.env.example`.
3. Start Postgres (local or docker).
4. Backend:
   - `cd backend`
   - `npm install`
   - `npx prisma migrate dev --name init`
   - `npm run dev`
5. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

MVP note: For demo you can simulate inbound vendor emails by POSTing to `/api/emails/inbound`.
