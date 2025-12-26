# Quarkas Authentication System

This repository contains a complete authentication system split into **three separate services**:

1. **Frontend** – React-based user interface  
2. **Middleware** – Node.js (Express) session & API gateway  
3. **Backend** – Quarkus-based authentication service  

Each layer has a clear responsibility and communicates over HTTP using well-defined APIs.

---

## Repository Structure

```
root/
│
├── frontend-web/        # React application (Vite)
├── middleware-node/      # Node.js Express middleware
└── backend-quarkus/         # Quarkus authentication service
```

---

## 1. Frontend (React)

### Purpose
The frontend provides the user-facing interface for:
- User signup
- User login
- Authentication state handling
- Dashboard access after authentication

### Tech Stack
- React
- Vite
- JavaScript
- Fetch API
- Cookie-based authentication (httpOnly cookies)

### Key Characteristics
- No direct calls to the Quarkus backend
- All authentication requests go through the **middleware**
- Authentication state is determined by calling `/me`
- Automatic session restoration on page refresh

### Implemented Pages
- **Signup Page**
- **Login Page**
- **Dashboard Page**

### API Usage
Frontend communicates with middleware using:
- `POST /auth/login`
- `POST /auth/signup`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET /me`

Cookies are sent using `credentials: 'include'`.

---

## 2. Middleware (Node.js / Express)

### Purpose
The middleware acts as:
- A secure API gateway
- A session handler
- A bridge between frontend and Quarkus backend

### Tech Stack
- Node.js
- Express
- Axios
- Cookie Parser
- dotenv

### Responsibilities
- Receives requests from frontend
- Stores access & refresh tokens in **httpOnly cookies**
- Forwards authentication requests to Quarkus backend
- Protects routes using session-based middleware
- Handles token refresh transparently

### Authentication Flow
- On login, middleware:
  - Calls Quarkus `/auth/login`
  - Stores tokens in cookies
- On protected requests:
  - Reads `accessToken` from cookies
  - Attaches it to backend requests
- On token expiry:
  - Uses refresh token to obtain new access token

### Implemented Routes

#### Auth Routes
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

#### User Routes
- `GET /me` (protected)

### Session Handling
- Access token is required for protected routes
- Missing or expired token results in `401 Unauthorized`
- Logout clears all authentication cookies

---

## 3. Backend (Quarkus)

### Purpose
The backend is the **source of truth** for authentication and user data.

### Tech Stack
- Quarkus
- Java 21
- PostgreSQL
- Hibernate ORM + Panache
- BCrypt
- Quarkus Mailer
- Maven

### Core Features
- User registration with hashed passwords
- Email verification workflow
- Login with credential validation
- Opaque access & refresh tokens
- Token rotation on refresh
- Explicit logout and token revocation
- Protected routes with request filtering
- Mock-based backend testing

### Authentication Model
- **Access Tokens**
  - Short-lived
  - Stored in database
  - Required for protected APIs
- **Refresh Tokens**
  - Long-lived
  - Rotated on every refresh
  - Old tokens are revoked

### Email Verification Rules
- Users can log in without verification
- Unverified users receive a restricted message
- Full access is granted only after verification

### Backend Endpoints

#### Authentication
| Method | Endpoint               |
|------|------------------------|
| POST | `/auth/signup`         |
| GET  | `/auth/verify?token=`  |
| POST | `/auth/login`          |
| POST | `/auth/refresh`        |
| POST | `/auth/logout`         |

#### Protected
| Method | Endpoint |
|------|----------|
| GET  | `/me`    |

---

## End-to-End Flow

1. User signs up via frontend
2. Middleware forwards signup to backend
3. Backend sends verification email
4. User verifies email
5. User logs in
6. Backend issues tokens
7. Middleware stores tokens in cookies
8. Frontend accesses protected dashboard
9. Tokens are refreshed automatically
10. User logs out and session is revoked

---

## Running the System

### Backend
- Requires Java 21 and PostgreSQL
- Runs on port `8080`

```bash
./mvnw quarkus:dev
```

### Middleware
- Requires Node.js
- Uses environment variables for backend base URL
- Runs on configured port

```bash
npm install
node server.js
```

### Frontend
- Requires Node.js
- Runs using Vite

```bash
npm install
npm run dev
```

---

## Design Notes

- Frontend never handles tokens directly
- Tokens are never exposed to JavaScript
- Middleware enforces session security
- Backend remains stateless from UI perspective
- Clear separation of concerns across layers

---

## Status

This repository represents a **working authentication system** with:
- Proper session handling
- Secure token management
- Email verification
- Clear frontend–middleware–backend separation

No additional features or assumptions are included beyond what is implemented.
