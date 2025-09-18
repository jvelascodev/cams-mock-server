# CAMS Mock Server API v2

A mock server implementation for the CAMS Biometric Web API 2.0, built with Node.js, Fastify, TypeScript, Vitest, and Supertest using Test-Driven Development (TDD).

## Features

- ✅ **POST endpoint** `/mock/apiv2/cams` matching CAMS API v2 specification
- ✅ **Request validation** for proper JSON structure and required fields
- ✅ **AuthToken authentication** with hardcoded token for testing
- ✅ **Support for all operation types** from CAMS API documentation
- ✅ **Comprehensive error handling** with proper HTTP status codes
- ✅ **TypeScript** for type safety and better development experience
- ✅ **Full test coverage** with 18 tests using Vitest and Supertest

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

### Run Tests

```bash
npm test
```

### Start Server

```bash
npm start
```

The server will start on port 3000 by default.

## API Usage

### Authentication

**For testing purposes, use the hardcoded AuthToken:**

```
mock-auth-token-12345
```

### Endpoint

```
POST /mock/apiv2/cams
```

### Request Format

Send data as form-encoded with `request_data` parameter containing JSON:

```bash
curl -X POST http://localhost:3000/mock/apiv2/cams \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'request_data={"ServiceTagId":"test-device-001","ApiRequestInfo":{"AuthToken":"mock-auth-token-12345","Operation":"RealTimePunchLog","UserId":"user123","OperationTime":1234567890,"OperationReferenceId":null,"OperationData":{"AttendanceType":"CheckIn","InputType":"Fingerprint"}}}'
```

### Example Requests

#### Real-Time Attendance Log

```json
{
  "ServiceTagId": "test-device-001",
  "ApiRequestInfo": {
    "AuthToken": "mock-auth-token-12345",
    "Operation": "RealTimePunchLog",
    "UserId": "user123",
    "OperationTime": 1234567890,
    "OperationReferenceId": null,
    "OperationData": {
      "AttendanceType": "CheckIn",
      "InputType": "Fingerprint",
      "Temperature": "36.5",
      "FaceMask": true
    }
  }
}
```

#### User Management

```json
{
  "ServiceTagId": "test-device-001",
  "ApiRequestInfo": {
    "AuthToken": "mock-auth-token-12345",
    "Operation": "ManuallyUserUpdated",
    "UserId": "user456",
    "OperationTime": 1234567890,
    "OperationReferenceId": null,
    "OperationData": {
      "Name": "John Doe",
      "FirstName": "John",
      "LastName": "Doe",
      "Priority": 0,
      "Signature": [
        {
          "Template": "base64-fingerprint-data",
          "Type": "Fingerprint",
          "AdditionalData1": "finger-1",
          "AdditionalData2": "reserved"
        }
      ]
    }
  }
}
```

#### Load Attendance Logs

```json
{
  "ServiceTagId": "test-device-001",
  "ApiRequestInfo": {
    "AuthToken": "mock-auth-token-12345",
    "Operation": "LoadPunchLog",
    "UserId": null,
    "OperationTime": 1234567890,
    "OperationReferenceId": "ref-123",
    "OperationData": {
      "StartTime": 1234567000,
      "EndTime": 1234567890,
      "OffSet": 0
    }
  }
}
```

#### Device Information

```json
{
  "ServiceTagId": "test-device-001",
  "ApiRequestInfo": {
    "AuthToken": "mock-auth-token-12345",
    "Operation": "SendDeviceInfo",
    "UserId": null,
    "OperationTime": 1234567890,
    "OperationReferenceId": "ref-456",
    "OperationData": null
  }
}
```

### Response Format

For CallBack API (this mock server), the response is always:

```json
{
  "status": "done"
}
```

## Supported Operations

The mock server supports all operations documented in the CAMS Biometric Web API 2.0:

### Attendance API
- `RealTimePunchLog` - Real-time attendance data

### Management API
- `ManuallyUserUpdated` - User added/modified notification
- `ManuallyUserDeleted` - User deleted notification
- `ManuallyDateModified` - Date modified notification
- `LoadPunchLog` - Load attendance logs
- `SendDeviceInfo` - Device information
- `ClearLog` - Clear attendance logs
- `TriggerUserDetail` - Send user information
- `AddUser` - Add user to device
- `DeleteUser` - Delete user from device
- `EnrollFingerprint` - Trigger fingerprint enrollment
- `EnableMessage` - Display messages on device
- `DisableMessage` - Disable message display
- `SendAttendancePhoto` - Request user photo

## Error Handling

The server returns appropriate HTTP status codes and error messages:

- `400 Bad Request` - Invalid request structure, missing fields, or unsupported operations
- `401 Unauthorized` - Invalid AuthToken
- `500 Internal Server Error` - Unexpected server errors

Error response format:

```json
{
  "error": "Error description",
  "statusCode": 7,
  "message": "Detailed error message"
}
```

## Health Check

Check server status:

```bash
curl http://localhost:3000/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Development

### Project Structure

```
src/
├── app.ts          # Fastify application setup
├── index.ts        # Server entry point
└── types.ts        # TypeScript interfaces

tests/
└── api.test.ts     # Comprehensive API tests

docs/
└── cams-biometric-api.md  # API documentation
```

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run
```

### Development Mode

```bash
npm run dev
```

## Configuration

Environment variables:

- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)

## Testing with Different Tools

### cURL

```bash
curl -X POST http://localhost:3000/mock/apiv2/cams \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'request_data={"ServiceTagId":"test-device-001","ApiRequestInfo":{"AuthToken":"mock-auth-token-12345","Operation":"RealTimePunchLog","UserId":"user123","OperationTime":1234567890,"OperationReferenceId":null,"OperationData":{"AttendanceType":"CheckIn","InputType":"Fingerprint"}}}'
```

### Postman

1. Set method to `POST`
2. URL: `http://localhost:3000/mock/apiv2/cams`
3. Headers: `Content-Type: application/x-www-form-urlencoded`
4. Body (x-www-form-urlencoded):
   - Key: `request_data`
   - Value: JSON string of the request

### JavaScript/Node.js

```javascript
const response = await fetch('http://localhost:3000/mock/apiv2/cams', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    request_data: JSON.stringify({
      ServiceTagId: "test-device-001",
      ApiRequestInfo: {
        AuthToken: "mock-auth-token-12345",
        Operation: "RealTimePunchLog",
        UserId: "user123",
        OperationTime: Math.floor(Date.now() / 1000),
        OperationReferenceId: null,
        OperationData: {
          AttendanceType: "CheckIn",
          InputType: "Fingerprint"
        }
      }
    })
  })
});

const result = await response.json();
console.log(result); // { status: "done" }
```

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for your changes
4. Implement the changes
5. Ensure all tests pass
6. Submit a pull request

---

**Note**: This is a mock server for testing and development purposes. The AuthToken `mock-auth-token-12345` is hardcoded and should not be used in production environments.