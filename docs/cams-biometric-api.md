# CAMS Biometric Web API 2.0 Documentation

## Overview

CAMS is the pioneer and global leader in Biometric Research and Development. It supports the Web API 2.0 for biometric time, attendance and access control machines, to integrate with websites or web applications. It provides powerful REST APIs and Callback APIs for various operations to communicate with biometric machines from your server application.

**Supported Biometric Inputs:**
- Fingerprint
- Face Recognition
- Card/RFID
- Palm Recognition
- Vein Recognition
- Retina Recognition
- Body Temperature
- Password/PIN

## Architecture

Biometric devices placed at any location are connected to the CAMS Protocol Engine through internet. The Protocol Engine is hosted at CAMS Data Server and maintains attendance data when cloud servers or biometric devices are unreachable.

## API Types

CAMS offers two sets of APIs:

### 1. Attendance API
Provides real-time biometric attendance data to your server.

### 2. Management API
Helps manage devices with the following operations:
- `AddUser` - Add a user to the device
- `DeleteUser` - Delete a user from the device
- `EnrollFingerprint` - Trigger fingerprint enrollment
- `EnableMessage` - Display short messages on device
- `DisableMessage` - Disable message display
- `SendAttendancePhoto` - Request user photo during punch
- `ManuallyUserUpdated` - Notification when user is added/updated
- `ManuallyUserDeleted` - Notification when user is deleted
- `ManuallyDateModified` - Notification when date is modified
- `LoadPunchLog` - Load attendance data between timeline
- `SendDeviceInfo` - Get device information and subscription status
- `ClearLog` - Clear all attendance logs
- `TriggerUserDetail` - Send all user information including templates

## URL Types

### CallBack API
For communication from device to your server. You must expose a URL at your server which will be called back in real-time.

### RESTful API
For communication from your server to the device. Call the exposed CAMS URL. Time latency may vary from 30-60 seconds.

## Data Format for CallBack API

All request and response data is in JSON format. Request data is passed in POST body parameter with key name `request_data`.

### Request Format
```json
{
  "ServiceTagId": "device_id",
  "ApiRequestInfo": {
    "AuthToken": "your_auth_token",
    "Operation": "operation_name",
    "UserId": "user_id",
    "OperationTime": 1234567890,
    "OperationReferenceId": "reference_id",
    "OperationData": {}
  }
}
```

### Request Parameters
- **ServiceTagId**: Device ID provided when purchasing or registering device
- **ApiRequestInfo.AuthToken**: Token configured in API Monitor for validation
- **ApiRequestInfo.Operation**: Operation type (see operations list)
- **ApiRequestInfo.UserId**: User ID registered in device (if applicable)
- **ApiRequestInfo.OperationTime**: Operation time in EPOCH/unix timestamp (timezone adjusted)
- **ApiRequestInfo.OperationReferenceId**: NULL for CallBack API, same as request for Lazy Response
- **ApiRequestInfo.OperationData**: Operation-specific data (can be null)

### Required Response Format
Your server must always return this response:
```json
{
  "status": "done"
}
```

**Important**: If status is anything other than "done", the request will be retried until this response is received.

## Data Format for RESTful API

RESTful API calls are made when your server needs to communicate with the biometric device. Request data should be passed in POST body parameter with key name `request_data`.

### Response Format
```json
{
  "StatusCode": 0,
  "Status": "done",
  "RequestedOperation": "operation_name",
  "OperationReferenceId": "reference_id",
  "OperationData": {}
}
```

### Status Codes
- `0` - done (success)
- `1` - API_RESPONSE_INVALID_REQUEST_DATA
- `2` - API_RESPONSE_INVALID_SERVICE_TAG_ID
- `3` - API_RESPONSE_INVALID_ORIGIN_IP
- `4` - API_RESPONSE_INVALID_ENCRYPTION
- `5` - API_RESPONSE_INVALID_SUBSCRIPTION
- `6` - API_RESPONSE_INVALID_OPERATION
- `7` - API_RESPONSE_INVALID_AUTHTOKEN
- `8` - API_RESPONSE_INVALID_OPERATION_TYPE
- `9` - API_RESPONSE_INVALID_START_TIME
- `10` - API_RESPONSE_INVALID_USERID
- `11` - API_RESPONSE_INVALID_API_CONFIGURATION
- `12` - API_RESPONSE_INVALID_API_REQUEST_INFO
- `13` - API_RESPONSE_INVALID_SECURITY_KEY
- `14` - API_RESPONSE_INVALID_OPERATION_DATA
- `15` - API_RESPONSE_INVALID_TEMPLATE
- `999` - API_RESPONSE_UNKNOWN_ERROR

## Attendance API Operations

### RealTimePunchLog
Called when new attendance is registered in device.

**OperationData for Attendance:**
```json
{
  "AttendanceType": "CheckIn|CheckOut|BreakOut|BreakIn|OverTimeIn|OverTimeOut|MealStart|MealEnd|None",
  "InputType": "Password|Card|Fingerprint|Face|Palm",
  "Temperature": "body_temperature",
  "FaceMask": true
}
```

**OperationData for Photo:**
```json
{
  "AttendancePhoto": "base64_jpg_image"
}
```

## Management API Operations

### ManuallyUserUpdated
Called when user is manually added/modified in device.

**OperationData:**
```json
{
  "Name": "user_name",
  "FirstName": "first_name",
  "LastName": "last_name",
  "Priority": 0,
  "Signature": [
    {
      "Template": "template_data",
      "Type": "Fingerprint|Face|Palm|Password|Card|TemplatePhoto|UserPhoto",
      "AdditionalData1": "template_id",
      "AdditionalData2": "reserved"
    }
  ]
}
```

**Priority Values:**
- `0` - Regular user
- `16` - Admin user

**Template Types:**
- `Fingerprint` - Fingerprint template
- `Face` - Face template
- `Palm` - Palm template
- `Password` - Password/PIN
- `Card` - Card/RFID data
- `TemplatePhoto` - Base64 JPG image (300x300 pixels)
- `UserPhoto` - Base64 JPG image (300x300 pixels)

### LoadPunchLog
Load attendance logs between specified time range.

**Request OperationData:**
```json
{
  "StartTime": 1234567890,
  "EndTime": 1234567890,
  "OffSet": 0
}
```

**Response OperationData:**
```json
{
  "OffSet": 50,
  "ActualRowCount": 100,
  "Punch": [
    {
      "AttendanceType": "CheckIn",
      "InputType": "Fingerprint",
      "UserID": "user_id",
      "AttendanceTime": 1234567890
    }
  ]
}
```

**Note**: Maximum 50 rows returned per response. Use OffSet for pagination.

### SendDeviceInfo
Get device information and subscription status.

**Response OperationData:**
```json
{
  "SerialNumber": "device_serial",
  "LastConnectedTime": 1234567890,
  "DeviceLabelName": "device_name",
  "Model": "device_model",
  "TimeZone": "timezone",
  "Services": [
    {
      "ServiceName": "service_name",
      "ActivationDate": "activation_date",
      "ExpiryDate": "expiry_date"
    }
  ]
}
```

## Integration Requirements

1. **Expose HTTP URL**: Configure your callback URL in API Monitor (port 80 or 8123 for testing)
2. **HTTPS Support**: Ensure SSL certificate doesn't require server restart
3. **Authentication**: Validate AuthToken in incoming requests
4. **Response Format**: Always return `{"status": "done"}` for callback requests
5. **Error Handling**: Handle all status codes appropriately
6. **Timezone**: Convert EPOCH timestamps from device timezone to your timezone

## Security Considerations

- Validate AuthToken for all incoming requests
- Verify ServiceTagId matches your registered devices
- Implement proper error handling without exposing internal errors
- Use HTTPS for production deployments
- Store biometric templates securely if caching locally

## Testing

- Use API Monitor for configuration and monitoring
- Test with mock events for all operation types
- Verify signature validation and error responses
- Test pagination for LoadPunchLog operations
- Validate timezone conversions for attendance data
