# API Endpoints Reference

## Base URL

All endpoints are prefixed with `/api/v1`.

## Authentication

All endpoints require authentication unless otherwise noted. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Health Check

### Get Service Health

```
GET /health
```

**Response**

```json
{
  "status": "ok",
  "timestamp": "2023-07-20T13:45:30.123Z",
  "version": "1.0.0"
}
```

## Agents

### List Registered Agents

```
GET /agents
```

**Response**

```json
{
  "agents": [
    {
      "name": "builder",
      "version": "1.0.0",
      "description": "Builder agent for managing profiles",
      "actions": ["createProfile", "updateProfile", "getProfile"]
    }
  ]
}
```

### Execute Agent Action

```
POST /agents/:agentName/actions/:actionName
```

**Request Body**

```json
{
  "input": {
    // Action-specific input
  }
}
```

**Response**

```json
{
  "success": true,
  "data": {
    // Action-specific output
  },
  "metadata": {
    "duration": 42,
    "timestamp": "2023-07-20T13:45:30.123Z"
  }
}
```

## Metrics

### Get Prometheus Metrics

```
GET /metrics
```

**Response**

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/health",status="200"} 1
...
```

## Authentication

### Get Test Token (Development Only)

```
POST /auth/test-token
```

**Request Body**

```json
{
  "userId": "user-123",
  "role": "admin"
}
```

**Response**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error details
    }
  }
}
```

### Common Error Codes

- `AUTH_REQUIRED`: Authentication required
- `INVALID_TOKEN`: Invalid or expired token
- `PERMISSION_DENIED`: Insufficient permissions
- `VALIDATION_ERROR`: Request validation failed
- `AGENT_NOT_FOUND`: Specified agent not found
- `ACTION_NOT_FOUND`: Specified action not found
- `INTERNAL_ERROR`: Internal server error
