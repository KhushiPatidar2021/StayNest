# StayNest - Application Flow and Architecture

This document outlines the core architecture, user flows, and features of the StayNest PG and Room Finder platform.

## 🏗️ Architecture Overview
StayNest follows a modern MERN stack architecture:
- **Frontend**: React (built with Vite), TailwindCSS for styling, React Router for navigation, and Axios for API communication.
- **Backend**: Node.js with Express.js.
- **Database**: MongoDB Atlas.
- **Authentication**: JSON Web Tokens (JWT) stored in localStorage, with bcryptjs for password hashing.
- **File Storage**: ImageKit for CDN-based image storage (with Base64 fallback).

## 👥 User Roles & Access Control
The application implements Role-Based Access Control (RBAC) with two primary roles:

### 1. Tenant
- **Goal**: Find and rent PGs/rooms.
- **Permissions**:
  - Browse all public properties.
  - View property details and owner contact info.
  - Add properties to favorites.
  - Send enquiries to property owners.
  - View status of sent enquiries (Pending, Accepted, Rejected).
  - Manage personal profile.

### 2. Owner
- **Goal**: List and manage properties.
- **Permissions**:
  - Create new property listings (with up to 5 images).
  - Edit and delete their own properties.
  - View enquiries received from tenants.
  - Accept or reject tenant enquiries.
  - Manage personal profile.

## 🔄 Core User Flows

### Authentication Flow
1. **Registration**: 
   - User provides Name, Email, Phone, Password, and Role.
   - Frontend and Backend perform format validation (e.g., valid email regex, 10-digit Indian mobile number).
   - Backend hashes password, creates user in DB, and returns a JWT.
2. **Login**:
   - User provides Email and Password.
   - Backend verifies credentials and returns a JWT.
3. **Session Management**:
   - JWT is saved in `localStorage`.
   - `api.js` Axios interceptor attaches `Authorization: Bearer <token>` to all subsequent requests.
   - Initial app load triggers `/api/auth/me` to validate the token and restore the user session in `AuthContext`.

### Property Discovery Flow (Tenant)
1. **Search & Filter**:
   - User navigates to the Properties page.
   - Can search by title/location (regex search).
   - Can apply filters: Min/Max Rent, Room Type, Gender Preference, Facilities.
   - Can sort by Rent (High/Low) or Newest.
2. **Details & Action**:
   - User clicks a property to view full details (images, address, owner info).
   - Can click "Add to Favorites" to save for later.
   - Can click "Send Enquiry" to express interest.

### Property Management Flow (Owner)
1. **Creation**:
   - Owner goes to Add Property form.
   - Fills in details (Title, Rent, Location, Room Type, Facilities, etc.).
   - Uploads images (handled by Multer memory storage and uploaded to ImageKit).
2. **Management**:
   - Owner dashboard displays all owned properties.
   - Can edit details or delete the property (which cascades to delete related favorites and enquiries).

### Enquiry Flow
1. **Initiation**: Tenant sends an enquiry message for a specific property. Status is `Pending`.
2. **Review**: Owner sees the enquiry in their dashboard.
3. **Decision**: Owner can update status to `Accepted` or `Rejected`.
4. **Resolution**: Tenant sees the updated status in their "My Enquiries" dashboard.

## 🛡️ Security & Validation
- **Protected Routes**: React router wrappers (`<ProtectedRoute>`) ensure only authenticated users can access dashboards, and route users based on their specific role.
- **Backend Middleware**: 
  - `protect`: Verifies JWT and attaches `req.user`.
  - `authorize`: Ensures `req.user.role` matches required roles for specific endpoints (e.g., only owners can create properties).
- **Data Validation**: Strict server-side checks for required fields, email formats, and ownership verification before updates/deletes.
