# Autora – AI-Powered Car Marketplace

Autora is a full-stack car marketplace web application that allows users to browse cars, book test drives, save favorites, and search for cars using AI-powered image analysis. The platform supports role-based access (Admin/User) and is fully deployed using Vercel.

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

### Backend

- Node.js  
- Express.js  
- MongoDB + Mongoose  
- Clerk Server SDK  
- Arcjet (Rate Limiting & Security)  
- AI Image Processing APIs  

### Frontend

- React (Vite)  
- Tailwind CSS  
- Shadcn UI  
- React Router  
- Axios  
- Clerk Authentication  

---


## Docker Setup

This project is fully containerized using Docker and Docker Compose.

For the complete Docker configuration and setup instructions, refer to:

https://github.com/kartikgupta2003/Autora---Ai-Car-MarketPlace
