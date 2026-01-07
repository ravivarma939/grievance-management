# Troubleshooting Guide

## 401 Unauthorized Error on Login

If you're getting a 401 error when trying to login, follow these steps:

### 1. Check Backend Services are Running

Make sure all backend services are running:
- **Eureka Discovery Server** (usually port 8761)
- **API Gateway** (port 8080)
- **Auth Service**
- **User Service**
- **Grievance Service**

You can check if the API Gateway is running by visiting:
```
http://localhost:8080/actuator/health
```

### 2. Register a User First

**Important**: You must register a user before you can login!

1. Click "Register here" link on the login page
2. Fill in all the required fields:
   - Full Name
   - Email
   - Username (remember this for login)
   - Password (minimum 6 characters)
   - State
3. Click "Register"
4. Wait for the success message
5. You'll be redirected to the login page
6. Use your username and password to login

### 3. Check Kafka is Running

The registration process uses Kafka to send user credentials to the Auth Service. Make sure:
- Kafka is running
- Kafka topics are created (`user-registration-topic`)
- Auth Service consumer is listening

### 4. Verify Database Connection

Check that:
- MySQL is running
- Database `grievance_data` exists (or can be created)
- User Service database is accessible
- Auth Service database is accessible

### 5. Check Browser Console

Open browser Developer Tools (F12) and check:
- **Console tab**: Look for any JavaScript errors
- **Network tab**: 
  - Check if the request to `/auth/login` is being made
  - Check the response status and body
  - Verify the request URL is correct (`http://localhost:8080/auth/login`)

### 6. Common Issues

#### Issue: "Unable to connect to server"
**Solution**: 
- Verify API Gateway is running on port 8080
- Check if there's a firewall blocking the connection
- Try accessing `http://localhost:8080/auth/login` directly in browser (should return 405 Method Not Allowed, not connection error)

#### Issue: "Invalid credentials" but you just registered
**Solution**:
- Wait a few seconds after registration (Kafka might need time to process)
- Check if Kafka consumer in Auth Service received the message
- Verify the user was created in the auth service database
- Try registering again with a different username

#### Issue: CORS errors in console
**Solution**:
- The API Gateway should have CORS configured
- Check `CorsConfig.java` in api-gateway
- Verify CORS allows requests from `http://localhost:3000`

#### Issue: Token not being saved
**Solution**:
- Check browser localStorage (F12 > Application > Local Storage)
- Verify token is being returned in the login response
- Check if browser is blocking localStorage

### 7. Test Backend Directly

You can test the backend directly using curl or Postman:

```bash
# Test registration
curl -X POST http://localhost:8080/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "state": "Karnataka"
  }'

# Test login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### 8. Check Logs

Check the backend service logs for:
- Any exceptions during registration
- Kafka consumer errors
- Database connection errors
- JWT token generation errors

### 9. Reset and Try Again

If nothing works:
1. Clear browser localStorage
2. Stop all backend services
3. Restart all backend services in order:
   - Eureka
   - User Service
   - Auth Service
   - Grievance Service
   - API Gateway
4. Register a new user
5. Try logging in

## React Router Warnings

The warnings about React Router future flags are just deprecation warnings and won't affect functionality. They've been addressed in the code by adding the future flags to the Router configuration.

## Still Having Issues?

1. Check all service logs for errors
2. Verify all services are registered with Eureka
3. Ensure all required ports are available
4. Check network connectivity
5. Verify database schemas are created



