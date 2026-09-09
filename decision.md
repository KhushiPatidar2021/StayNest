# StayNest - Decisions and Bug Fixes Log

This document records the critical bug fixes and technical decisions made to stabilize the StayNest platform.

## 🐛 Bugs Resolved

### 1. API Base URL Misconfiguration (CRITICAL)
- **Issue**: Frontend API requests were failing locally because the Axios `baseURL` was pointing directly to the host (e.g., `http://localhost:5000`) without the `/api` prefix, causing 404s.
- **Fix**: Updated `frontend/src/services/api.js` to append `/api` to the `baseURL`. Updated `frontend/.env` to point to the local server `http://localhost:5000` for development.

### 2. Auth Middleware Double Response Bug (CRITICAL)
- **Issue**: `backend/middleware/authMiddleware.js` was crashing the server with "Cannot set headers after they are sent to the client". The middleware called `next()` for a valid token but then continued execution and hit an `if (!token)` block, attempting to send a 401 response.
- **Fix**: Restructured the logic to use `return next()` and placed the `if (!token)` check inside an `else` block to guarantee mutually exclusive execution.

### 3. False "Session Expired" Toasts (MEDIUM)
- **Issue**: The frontend fired an annoying "Session expired" toast notification on initial page load if the user's stored token was expired.
- **Fix**: Updated the Axios response interceptor in `api.js` to suppress the 401 toast specifically for the `/auth/me` background check, while still showing it for active user interactions.

### 4. Missing Email and Phone Validation (HIGH)
- **Issue**: Users could register with invalid email strings (e.g., `abc@`) and invalid phone numbers, which were only caught by basic HTML5 validation that could be bypassed.
- **Fix**: 
  - Added robust server-side regex validation for emails (RFC 5322 style) and Indian mobile numbers (10 digits starting with 6-9) in `backend/controllers/authController.js`.
  - Added real-time inline client-side validation for emails in the Register component (`frontend/src/pages/Register.jsx`) with visual feedback (red borders and error text).

### 5. MongoDB Atlas Authentication Failure (HIGH)
- **Issue**: The local backend was crashing continuously with a `bad auth : authentication failed` error, causing the frontend to fail to communicate with it.
- **Fix**: 
  - Improved the `db.js` error handler to explicitly state when an authentication failure occurs versus a generic network timeout.
  - The user manually reset the Atlas password, and we updated `backend/.env` with the new credentials (`khushi123`), restoring full database connectivity.

## 📝 Design Decisions

### Email Verification Strategy
- **Decision**: We opted to strictly validate email *formatting* rather than email *existence*. 
- **Rationale**: Implementing true existence verification requires setting up an SMTP provider (like SendGrid or Nodemailer) and implementing an OTP (One Time Password) flow. Given the current scope, strict regex validation prevents malformed inputs (like `abc@` or `notanemail`), while keeping the registration flow frictionless. An email like `abc13@gmail.com` will be accepted because it mathematically matches a valid email structure. If true verification is needed in the future, an OTP flow should be introduced.

### Database Connection Resiliency
- **Decision**: The backend `server.js` relies on `mongoose.connect` before starting the Express app. If the database connection fails, the process intentionally exits (`process.exit(1)`).
- **Rationale**: StayNest is entirely dependent on MongoDB. Running the server without a database would result in immediate crashes on any route. Failing fast is the correct pattern here, and `nodemon` handles the auto-restarts during development when credentials are fixed.
