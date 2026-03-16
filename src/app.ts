import Fastify from 'fastify';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { CallBackRequest, CallBackResponse, StatusCode } from './types.js';

// Hardcoded auth token for mocking (documented for testing purposes)
const MOCK_AUTH_TOKEN = "mock-auth-token-12345";

// Supported operations
const SUPPORTED_OPERATIONS = [
  "RealTimePunchLog",
  "ManuallyUserUpdated",
  "ManuallyUserDeleted",
  "ManuallyDateModified",
  "LoadPunchLog",
  "SendDeviceInfo",
  "ClearLog",
  "TriggerUserDetail",
  "AddUser",
  "DeleteUser",
  "EnrollFingerprint",
  "EnableMessage",
  "DisableMessage",
  "SendAttendancePhoto"
];

interface RequestBody {
  request_data?: string;
}

export function build(): FastifyInstance {
  const fastify = Fastify({
    logger: {
      level: 'info'
    }
  });

  // Register form body parser for handling form-encoded data
  fastify.register(import('@fastify/formbody'));

  // Health check endpoint
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Main CAMS API v2 endpoint
  fastify.post('/mock/apiv2/cams', async (request: FastifyRequest<{ Body: RequestBody }>, reply: FastifyReply) => {
    try {
      // Check if request_data is present
      if (!request.body || !request.body.request_data) {
        reply.status(400);
        return {
          error: "Missing request_data parameter",
          statusCode: 1,
          message: "Request data is required in the request_data parameter"
        };
      }

      // Parse JSON from request_data
      let parsedData: CallBackRequest;
      try {
        parsedData = JSON.parse(request.body.request_data);
      } catch (error) {
        reply.status(400);
        return {
          error: "Invalid JSON in request_data",
          statusCode: 1,
          message: "request_data must contain valid JSON"
        };
      }

      // Validate required structure
      if (!parsedData.ServiceTagId || !parsedData.ApiRequestInfo) {
        reply.status(400);
        return {
          error: "Invalid request structure",
          statusCode: 12,
          message: "Missing required fields: ServiceTagId or ApiRequestInfo"
        };
      }

      const { ApiRequestInfo } = parsedData;

      // Validate required ApiRequestInfo fields
      if (!ApiRequestInfo.AuthToken || !ApiRequestInfo.Operation || typeof ApiRequestInfo.OperationTime !== 'number') {
        reply.status(400);
        return {
          error: "Invalid ApiRequestInfo structure",
          statusCode: 12,
          message: "Missing required fields in ApiRequestInfo: AuthToken, Operation, or OperationTime"
        };
      }

      // Validate AuthToken
      if (ApiRequestInfo.AuthToken !== MOCK_AUTH_TOKEN) {
        reply.status(401);
        return {
          error: "Invalid AuthToken",
          statusCode: 7,
          message: `Invalid authentication token. Use '${MOCK_AUTH_TOKEN}' for testing.`
        };
      }

      // Validate Operation
      if (!SUPPORTED_OPERATIONS.includes(ApiRequestInfo.Operation)) {
        reply.status(400);
        return {
          error: "Unsupported operation",
          statusCode: 6,
          message: `Operation '${ApiRequestInfo.Operation}' is not supported. Supported operations: ${SUPPORTED_OPERATIONS.join(', ')}`
        };
      }

      // Log the request for debugging
      fastify.log.info({
        serviceTagId: parsedData.ServiceTagId,
        operation: ApiRequestInfo.Operation,
        userId: ApiRequestInfo.UserId,
        operationTime: ApiRequestInfo.OperationTime,
        hasOperationData: !!ApiRequestInfo.OperationData
      }, 'Processing CAMS API request');

      // Return success in RESTful API format
      reply.status(200);
      return {
        StatusCode: 0,
        Status: "Success",
        RequestedOperation: ApiRequestInfo.Operation,
        OperationReferenceId: ApiRequestInfo.OperationReferenceId
      };

    } catch (error) {
      fastify.log.error(error, 'Unexpected error processing CAMS API request');
      reply.status(500);
      return {
        error: "Internal server error",
        StatusCode: 999,
        message: "An unexpected error occurred"
      };
    }
  });

  return fastify;
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = build();
  
  server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    server.log.info(`CAMS Mock Server listening at ${address}`);
    server.log.info(`Auth Token for testing: ${MOCK_AUTH_TOKEN}`);
  });
}