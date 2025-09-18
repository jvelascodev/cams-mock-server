import { build } from './app.js';

const server = build();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`CAMS Mock Server listening at ${address}`);
  server.log.info('Auth Token for testing: mock-auth-token-12345');
  server.log.info('Use POST /mock/apiv2/cams with request_data parameter for API calls');
});