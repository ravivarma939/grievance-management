# Guest Mode and Login Issues - Fixes Applied

## Issues Fixed

### 1. Guest Mode Redirecting Back to Login
**Problem:** Guest mode was being lost and redirecting back to login immediately.

**Fix:**
- Updated `PrivateRoute` in `App.js` to check localStorage for guest status before context loads
- Updated API interceptor to not redirect guests on 401 errors
- Guest state now persists properly

### 2. Login Showing "Invalid Credentials"
**Problem:** After registration, login was failing with "Invalid credentials".

**Possible Causes:**
1. **Kafka Processing Delay:** After registration, Kafka needs time to process the user credentials and send them to Auth Service. Wait 5-10 seconds after registration before trying to login.
2. **Kafka Not Running:** Make sure Kafka is running on localhost:9092
3. **Auth Service Not Running:** Ensure Auth Service is running and registered with Eureka
4. **Wrong Credentials:** Double-check username and password

**Fix:**
- Added better error messages in `authService.js` that suggest waiting after registration
- Added connection error detection

### 3. Guest Mode Showing "Loading grievances..." Forever
**Problem:** Guest users see loading state but no data.

**Possible Causes:**
1. **External API Not Running:** The grievance API at `http://localhost:3232/grievance` must be running
2. **Backend Services Not Running:** API Gateway, Grievance Service, Eureka must all be running
3. **Network Connection Issues:** Cannot connect to backend

**Fix:**
- Added better error messages that indicate which service might be down
- Added connection error detection
- Guest mode now properly handles API errors without redirecting

## How to Verify Everything is Working

### Step 1: Start External Grievance API
```bash
docker run -p3232:3232 --name consumercontainer stackroutenew/grievanceapi
```

Verify it's running:
```bash
docker ps
```

Test the API:
```bash
curl http://localhost:3232/grievance
```

### Step 2: Start Backend Services (in order)
1. **Eureka Discovery Server** (port 8761)
2. **Kafka** (port 9092)
3. **Auth Service** (port 8081)
4. **User Service** (port 8082)
5. **Grievance Service** (port 8083)
6. **Bookmark Service** (port 8084)
7. **API Gateway** (port 8080)

### Step 3: Test Guest Mode
1. Go to `http://localhost:3000/login`
2. Click "Continue as Guest"
3. Should see grievance data (if external API is running)
4. Should NOT see "Create", "Bookmark", or "User Profile" buttons

### Step 4: Test Registration and Login
1. Register a new user
2. **WAIT 5-10 SECONDS** for Kafka to process
3. Try to login with the registered credentials
4. If it still fails, check:
   - Kafka logs for consumer messages
   - Auth Service logs for user creation
   - Database to see if user was created

## Common Error Messages and Solutions

### "Cannot connect to server"
- **Solution:** Check if API Gateway (port 8080) is running
- Check if all backend services are registered with Eureka

### "Failed to load grievances: Failed to fetch grievances from external API"
- **Solution:** Start the external grievance API container:
  ```bash
  docker run -p3232:3232 --name consumercontainer stackroutenew/grievanceapi
  ```

### "Invalid credentials" after registration
- **Solution:** Wait 5-10 seconds after registration, then try again
- Check Kafka is running and processing messages
- Check Auth Service logs

### Guest mode redirecting to login
- **Solution:** Clear browser localStorage and try again
- Check browser console for errors
- Ensure PrivateRoute is properly checking guest status

## API Gateway Configuration

The API Gateway now allows:
- GET requests to `/grievance/**` without authentication (for guests)
- POST/PUT/DELETE requests to `/grievance/**` require authentication
- All `/bookmarks/**` requests require authentication
- All `/users/**` requests (except `/register`) require authentication

## Testing Checklist

- [ ] External grievance API running at localhost:3232
- [ ] All backend services running and registered with Eureka
- [ ] Kafka running and processing messages
- [ ] Guest mode works and shows data
- [ ] Guest mode doesn't show bookmark/profile buttons
- [ ] Registration works
- [ ] Login works after waiting 5-10 seconds post-registration
- [ ] Authenticated users can create/bookmark grievances


