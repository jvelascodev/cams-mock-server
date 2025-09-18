// Types for CAMS Biometric Web API 2.0

export interface ApiRequestInfo {
  AuthToken: string;
  Operation: string;
  UserId?: string;
  OperationTime: number;
  OperationReferenceId?: string | null;
  OperationData?: any;
}

export interface CallBackRequest {
  ServiceTagId: string;
  ApiRequestInfo: ApiRequestInfo;
}

export interface CallBackResponse {
  status: "done";
}

export interface RESTfulResponse {
  StatusCode: number;
  Status: string;
  RequestedOperation: string;
  OperationReferenceId?: string;
  OperationData?: any;
}

// Status codes for RESTful API
export enum StatusCode {
  DONE = 0,
  INVALID_REQUEST_DATA = 1,
  INVALID_SERVICE_TAG_ID = 2,
  INVALID_ORIGIN_IP = 3,
  INVALID_ENCRYPTION = 4,
  INVALID_SUBSCRIPTION = 5,
  INVALID_OPERATION = 6,
  INVALID_AUTHTOKEN = 7,
  INVALID_OPERATION_TYPE = 8,
  INVALID_START_TIME = 9,
  INVALID_USERID = 10,
  INVALID_API_CONFIGURATION = 11,
  INVALID_API_REQUEST_INFO = 12,
  INVALID_SECURITY_KEY = 13,
  INVALID_OPERATION_DATA = 14,
  INVALID_TEMPLATE = 15,
  UNKNOWN_ERROR = 999
}

// Operation types
export enum OperationType {
  REAL_TIME_PUNCH_LOG = "RealTimePunchLog",
  MANUALLY_USER_UPDATED = "ManuallyUserUpdated",
  MANUALLY_USER_DELETED = "ManuallyUserDeleted",
  MANUALLY_DATE_MODIFIED = "ManuallyDateModified",
  LOAD_PUNCH_LOG = "LoadPunchLog",
  SEND_DEVICE_INFO = "SendDeviceInfo",
  CLEAR_LOG = "ClearLog",
  TRIGGER_USER_DETAIL = "TriggerUserDetail",
  ADD_USER = "AddUser",
  DELETE_USER = "DeleteUser",
  ENROLL_FINGERPRINT = "EnrollFingerprint",
  ENABLE_MESSAGE = "EnableMessage",
  DISABLE_MESSAGE = "DisableMessage",
  SEND_ATTENDANCE_PHOTO = "SendAttendancePhoto"
}

// Attendance related types
export interface AttendanceOperationData {
  AttendanceType: "CheckIn" | "CheckOut" | "BreakOut" | "BreakIn" | "OverTimeIn" | "OverTimeOut" | "MealStart" | "MealEnd" | "None";
  InputType: "Password" | "Card" | "Fingerprint" | "Face" | "Palm";
  Temperature?: string;
  FaceMask?: boolean;
}

export interface PhotoOperationData {
  AttendancePhoto: string; // base64 JPG image
}

// User management types
export interface UserTemplate {
  Template: string;
  Type: "Fingerprint" | "Face" | "Palm" | "Password" | "Card" | "TemplatePhoto" | "UserPhoto";
  AdditionalData1?: string;
  AdditionalData2?: string;
}

export interface UserOperationData {
  Name: string;
  FirstName?: string;
  LastName?: string;
  Priority: 0 | 16; // 0 = Regular user, 16 = Admin user
  Signature?: UserTemplate[];
}

// LoadPunchLog types
export interface LoadPunchLogRequest {
  StartTime: number;
  EndTime: number;
  OffSet: number;
}

export interface PunchLogEntry {
  AttendanceType: string;
  InputType: string;
  UserID: string;
  AttendanceTime: number;
}

export interface LoadPunchLogResponse {
  OffSet: number;
  ActualRowCount: number;
  Punch: PunchLogEntry[];
}

// Device info types
export interface DeviceService {
  ServiceName: string;
  ActivationDate: string;
  ExpiryDate: string;
}

export interface DeviceInfoResponse {
  SerialNumber: string;
  LastConnectedTime: number;
  DeviceLabelName: string;
  Model: string;
  TimeZone: string;
  Services: DeviceService[];
}