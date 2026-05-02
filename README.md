# Autora – AI-Powered Car Marketplace

Autora is a full-stack car marketplace web application that allows users to browse cars, book test drives, save favorites, and search for cars using AI-powered image analysis. The platform supports role-based access (Admin/User), is fully deployed on Vercel, and is fully containerized using Docker and Docker Compose for consistent and portable development environments.

---

## Live Demo

Frontend: https://autora-frontend.vercel.app  
Backend API: https://autora-backend.vercel.app  

---

## User Features

- Secure authentication using Clerk  
- Browse cars by make, body type, fuel type, etc.  
- Save cars to wishlist  
- Book test drives  
- AI-powered image-based car search  
- Responsive UI for all devices  

---

## Admin Features

- Admin dashboard with role-based access  
- Manage test drive requests  
- AI-assisted car listing creation  
- Upload a car image  
- AI extracts key vehicle attributes (make, body type, color, category)  
- Auto-fills extracted data to simplify adding listings  
- Reduces manual data entry and speeds up inventory management  

---

## AI Chatbot

Built as a separate FastAPI microservice integrated with the main Node.js backend
Uses LangChain for LLM orchestration and tool integration
Uses LangGraph to manage conversational workflows, state, and multi-step reasoning
Supports Human-in-the-Loop (HITL) confirmation for critical actions like booking test drives
Dynamically calls backend APIs (e.g., availability check, booking endpoints) via tool execution
Maintains conversational state using thread-based context handling
Prevents hallucinations by enforcing structured tool usage and validated inputs
Designed to handle both informational queries and action-based workflows

---

## Platform & Security Features

- Secure backend APIs with authentication middleware  
- Rate-limited AI search endpoints using Arcjet  
- Prevents abuse of AI image search  
- Protects backend resources from excessive requests  
- Production-safe CORS handling  
- SPA routing support (no refresh 404 errors)  
- Optimized static asset handling  
- Deployed frontend & backend on Vercel  

---

## Tech Stack

# Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- FastAPI (Chatbot Service)
- Python
- LangChain
- LangGraph
- Clerk Server SDK
- Arcjet (Rate Limiting & Security)
- AI APIs

# Frontend
- React (Vite)
- Tailwind CSS
- Shadcn UI
- React Router
- Axios
- Clerk Authentication
