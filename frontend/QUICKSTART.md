# Quick Start Guide

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Backend Services**
   Make sure all your backend services are running:
   - Eureka Discovery Server (port 8761)
   - API Gateway (port 8080)
   - Auth Service
   - Grievance Service
   - User Service

3. **Start Frontend**
   ```bash
   npm start
   ```

4. **Access the Application**
   Open your browser and navigate to: `http://localhost:3000`

## First Time Login

You'll need to register a user first through the backend API, then login with those credentials.

## Features Implemented

✅ **Authentication**
- Login with username/password
- JWT token management
- Auto-logout on token expiration

✅ **Grievance CRUD Operations**
- Create new grievances
- View all grievances in a table
- Update existing grievances
- Delete grievances

✅ **Filtering**
- Filter by Issue Type
- Filter by Company (Bank)
- Clear filters option

✅ **Company Dropdown**
- 10 major Indian banks pre-configured
- Easy selection from dropdown

✅ **Issue Type Dropdown**
- Banking Issue
- Debit Card Issue
- Credit Card Issue
- Technical Issue

✅ **Auto-filled Username**
- Username automatically populated from logged-in user
- Cannot be edited in the form

## API Configuration

The frontend is configured to connect to the API Gateway at:
- **Base URL**: `http://localhost:8080`

If your API Gateway runs on a different port, update the `API_BASE_URL` in:
- `src/services/api.js`

## Troubleshooting

**CORS Errors**: Make sure the API Gateway CORS configuration allows requests from `http://localhost:3000`

**401 Unauthorized**: 
- Check if your JWT token is valid
- Try logging in again
- Verify the token is being sent in the Authorization header

**Connection Errors**:
- Verify backend services are running
- Check API Gateway is accessible at `http://localhost:8080`
- Verify network connectivity



