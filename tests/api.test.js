import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { build } from '../src/app.js';
describe('CAMS Mock Server API v2', () => {
    let app;
    beforeAll(async () => {
        app = build();
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });
    describe('POST /mock/apiv2/cams', () => {
        it('should return 400 for missing request_data', async () => {
            const response = await supertest(app.server)
                .post('/mock/apiv2/cams')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
        it('should return 401 for invalid auth token', async () => {
            const requestData = {
                ServiceTagId: "test-device-001",
                ApiRequestInfo: {
                    AuthToken: "invalid-token",
                    Operation: "RealTimePunchLog",
                    UserId: "user123",
                    OperationTime: Math.floor(Date.now() / 1000),
                    OperationReferenceId: null,
                    OperationData: {
                        AttendanceType: "CheckIn",
                        InputType: "Fingerprint"
                    }
                }
            };
            const response = await supertest(app.server)
                .post('/mock/apiv2/cams')
                .send({ request_data: JSON.stringify(requestData) });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });
        it('should return success response for valid RealTimePunchLog request', async () => {
            const requestData = {
                ServiceTagId: "test-device-001",
                ApiRequestInfo: {
                    AuthToken: "mock-auth-token-12345",
                    Operation: "RealTimePunchLog",
                    UserId: "user123",
                    OperationTime: Math.floor(Date.now() / 1000),
                    OperationReferenceId: null,
                    OperationData: {
                        AttendanceType: "CheckIn",
                        InputType: "Fingerprint",
                        Temperature: "36.5",
                        FaceMask: true
                    }
                }
            };
            const response = await supertest(app.server)
                .post('/mock/apiv2/cams')
                .send({ request_data: JSON.stringify(requestData) });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ status: "done" });
        });
        it('should return success response for valid LoadPunchLog request', async () => {
            const requestData = {
                ServiceTagId: "test-device-001",
                ApiRequestInfo: {
                    AuthToken: "mock-auth-token-12345",
                    Operation: "LoadPunchLog",
                    UserId: null,
                    OperationTime: Math.floor(Date.now() / 1000),
                    OperationReferenceId: "ref-123",
                    OperationData: {
                        StartTime: Math.floor(Date.now() / 1000) - 86400, // 24 hours ago
                        EndTime: Math.floor(Date.now() / 1000),
                        OffSet: 0
                    }
                }
            };
            const response = await supertest(app.server)
                .post('/mock/apiv2/cams')
                .send({ request_data: JSON.stringify(requestData) });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ status: "done" });
        });
        it('should return success response for valid SendDeviceInfo request', async () => {
            const requestData = {
                ServiceTagId: "test-device-001",
                ApiRequestInfo: {
                    AuthToken: "mock-auth-token-12345",
                    Operation: "SendDeviceInfo",
                    UserId: null,
                    OperationTime: Math.floor(Date.now() / 1000),
                    OperationReferenceId: "ref-456",
                    OperationData: null
                }
            };
            const response = await supertest(app.server)
                .post('/mock/apiv2/cams')
                .send({ request_data: JSON.stringify(requestData) });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ status: "done" });
        });
        it('should return success response for valid ManuallyUserUpdated request', async () => {
            const requestData = {
                ServiceTagId: "test-device-001",
                ApiRequestInfo: {
                    AuthToken: "mock-auth-token-12345",
                    Operation: "ManuallyUserUpdated",
                    UserId: "user456",
                    OperationTime: Math.floor(Date.now() / 1000),
                    OperationReferenceId: null,
                    OperationData: {
                        Name: "John Doe",
                        FirstName: "John",
                        LastName: "Doe",
                        Priority: 0,
                        Signature: [
                            {
                                Template: "base64-fingerprint-data",
                                Type: "Fingerprint",
                                AdditionalData1: "finger-1",
                                AdditionalData2: "reserved"
                            }
                        ]
                    }
                }
            };
            const response = await supertest(app.server)
                .post('/mock/apiv2/cams')
                .send({ request_data: JSON.stringify(requestData) });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ status: "done" });
        });
        it('should return 400 for invalid JSON in request_data', async () => {
            const response = await supertest(app.server)
                .post('/mock/apiv2/cams')
                .send({ request_data: "invalid-json" });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
        it('should return 400 for missing required fields', async () => {
            const requestData = {
                ServiceTagId: "test-device-001"
                // Missing ApiRequestInfo
            };
            const response = await supertest(app.server)
                .post('/mock/apiv2/cams')
                .send({ request_data: JSON.stringify(requestData) });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
        it('should return 400 for unsupported operation', async () => {
            const requestData = {
                ServiceTagId: "test-device-001",
                ApiRequestInfo: {
                    AuthToken: "mock-auth-token-12345",
                    Operation: "UnsupportedOperation",
                    UserId: "user123",
                    OperationTime: Math.floor(Date.now() / 1000),
                    OperationReferenceId: null,
                    OperationData: {}
                }
            };
            const response = await supertest(app.server)
                .post('/mock/apiv2/cams')
                .send({ request_data: JSON.stringify(requestData) });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });
});
