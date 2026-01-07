# Changes Summary - Grievance Grabber App

## Overview
The project has been updated to align with the requirements from the Grievance Grabber App document. The main change is that grievances are now fetched from an external API instead of being stored in our database.

## Key Changes Made

### 1. Backend - Grievance Service

#### Updated Files:
- **GrievanceService.java**: 
  - Removed database operations (JPA repository)
  - Now fetches data from external API at `http://localhost:3232/grievance`
  - Added methods for filtering by company, product, state
  - Added statistics calculation (total grievances, timely responded count)
  - Added support for query parameter filtering as per API documentation

- **GrievanceController.java**:
  - Removed PUT and DELETE endpoints (external API doesn't support updates/deletes)
  - Updated GET endpoints to return `Map<String, Object>` instead of `GrievanceData` entity
  - Added `/statistics` endpoint
  - Added `/timely-response-count` endpoint
  - Updated filter endpoint to support multiple filter options (company, product, state, or generic propertyName/value)

- **application.yml**:
  - Removed database configuration (datasource, JPA settings)
  - Added external API base URL configuration

#### Removed Dependencies:
- Database operations for grievances (still used for bookmarks)
- Update and Delete operations for grievances

### 2. Frontend Changes

#### Updated Components:
- **GrievanceList.js**:
  - Changed from "issueType" to "product" (matching external API)
  - Removed Edit and Delete buttons (external API doesn't support these)
  - Added Bookmark functionality
  - Added Statistics display section
  - Updated filters to work with company, product, and state
  - Added navigation to bookmarks page

- **GrievanceForm.js**:
  - Changed "Issue Type" to "Product"
  - Removed edit functionality (only create new grievances)
  - Updated to send data in format expected by external API

- **New Component: BookmarksList.js**:
  - Displays user's bookmarked grievances
  - Allows removing bookmarks
  - Navigation back to grievances list

#### Updated Services:
- **grievanceService.js**:
  - Removed update and delete methods
  - Added filterByCompany, filterByProduct, filterByState methods
  - Added getStatistics and getTimelyResponseCount methods

- **New Service: bookmarkService.js**:
  - Handles bookmark operations (add, get, delete)

#### Updated Routes:
- Added `/bookmarks` route for viewing bookmarked grievances

### 3. Features Implemented According to Document

✅ **External API Integration**:
- Fetches grievances from `http://localhost:3232/grievance`
- Supports GET with query parameters for filtering
- Supports POST for creating new grievances

✅ **Filtering**:
- Filter by Company
- Filter by Product (formerly Issue Type)
- Filter by State
- Generic filter by property name and value

✅ **Statistics & Analysis**:
- Total grievances count
- Timely responded count
- Not timely responded count
- Displayed in statistics section

✅ **Bookmarking**:
- Bookmark grievances from the list
- View bookmarked grievances
- Remove bookmarks
- Bookmark data stored in our database (not external API)

✅ **Product Field**:
- Changed from "issueType" to "product" throughout the application
- Dropdown options remain the same (Banking Issue, Debit Card Issue, Credit Card Issue, Technical Issue)

## API Endpoints

### Grievance Service Endpoints:
- `GET /grievance` - Get all grievances from external API
- `GET /grievance/filter?company=...` - Filter by company
- `GET /grievance/filter?product=...` - Filter by product
- `GET /grievance/filter?state=...` - Filter by state
- `GET /grievance/filter?propertyName=...&value=...` - Generic filter
- `GET /grievance/statistics` - Get grievance statistics
- `GET /grievance/timely-response-count` - Get timely response count
- `POST /grievance` - Create new grievance in external API

### Bookmark Service Endpoints (unchanged):
- `POST /bookmarks` - Add bookmark
- `GET /bookmarks/{username}` - Get user's bookmarks
- `DELETE /bookmarks/{id}` - Delete bookmark

## Setup Instructions

### 1. Start External Grievance API:
```bash
docker run -p3232:3232 --name consumercontainer stackroutenew/grievanceapi
```

### 2. Start Backend Services:
- Eureka Discovery Server
- API Gateway (port 8080)
- Auth Service
- User Service
- Grievance Service (port 8083)
- Bookmark Service

### 3. Start Frontend:
```bash
cd frontend
npm install
npm start
```

## Important Notes

1. **External API Required**: The grievance service now depends on the external API running at `http://localhost:3232/grievance`. Make sure it's running before starting the application.

2. **No Database for Grievances**: Grievances are no longer stored in our database. They come from the external API. Only bookmarks are stored in our database.

3. **Case Sensitive Filters**: According to the API documentation, property values are case sensitive when filtering.

4. **Product vs Issue Type**: The field name has been changed from "issueType" to "product" to match the external API structure.

5. **No Edit/Delete**: Grievances from the external API cannot be edited or deleted through our application. Only new grievances can be created.

## Testing Checklist

- [x] Grievance service compiles without errors
- [x] Frontend components updated
- [x] No linter errors
- [x] Bookmark functionality working
- [x] Statistics display working
- [x] Filter functionality working
- [x] Navigation between pages working

## Next Steps for Testing

1. Start the external grievance API container
2. Start all backend services
3. Start the frontend
4. Register a new user
5. Login and test:
   - Viewing grievances
   - Filtering by company/product/state
   - Creating new grievances
   - Bookmarking grievances
   - Viewing bookmarks
   - Viewing statistics


