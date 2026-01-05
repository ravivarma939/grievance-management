# Grievance Management System - Frontend

A React.js frontend application for managing grievances with full CRUD operations.

## Features

- **Authentication**: Login with JWT token support
- **Grievance Management**: 
  - Create new grievances
  - View all grievances
  - Update existing grievances
  - Delete grievances
  - Filter grievances by issue type and company
- **Company Dropdown**: Select from a list of bank names
- **Issue Type Dropdown**: Select from Banking Issue, Debit Card Issue, Credit Card Issue, or Technical Issue
- **Auto-filled Username**: Username is automatically set from the logged-in user

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend services running on `http://localhost:8080`

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js          # Login component
│   │   ├── Login.css
│   │   ├── GrievanceList.js  # Main grievance list component
│   │   ├── GrievanceList.css
│   │   ├── GrievanceForm.js  # Create/Edit form component
│   │   └── GrievanceForm.css
│   ├── context/
│   │   └── AuthContext.js    # Authentication context
│   ├── services/
│   │   ├── authService.js    # Authentication API calls
│   │   └── grievanceService.js # Grievance API calls
│   ├── App.js                # Main app component
│   ├── App.css
│   ├── index.js              # Entry point
│   └── index.css
├── package.json
└── README.md
```

## API Endpoints

The frontend communicates with the backend API Gateway at `http://localhost:8080`:

- `POST /auth/login` - User login
- `GET /grievance` - Get all grievances
- `POST /grievance` - Create a grievance
- `PUT /grievance/{id}` - Update a grievance
- `DELETE /grievance/{id}` - Delete a grievance
- `GET /grievance/filter?issueType=...&company=...` - Filter grievances

## Bank Names

The company dropdown includes the following banks:
- State Bank of India
- HDFC Bank
- ICICI Bank
- Axis Bank
- Punjab National Bank
- Bank of Baroda
- Canara Bank
- Union Bank of India
- Indian Bank
- Kotak Mahindra Bank

## Issue Types

- Banking Issue
- Debit Card Issue
- Credit Card Issue
- Technical Issue

## Usage

1. **Login**: Enter your username and password to access the system
2. **View Grievances**: All grievances are displayed in a table format
3. **Create Grievance**: Click "Create New Grievance" button and fill in the form
4. **Edit Grievance**: Click the "Edit" button on any grievance row
5. **Delete Grievance**: Click the "Delete" button on any grievance row
6. **Filter**: Use the filter dropdowns to filter grievances by issue type and/or company
7. **Logout**: Click the "Logout" button to sign out

## Notes

- The username field is automatically populated from the logged-in user and cannot be edited
- All form fields are required
- JWT tokens are stored in localStorage for session persistence
- The application uses React Router for navigation

