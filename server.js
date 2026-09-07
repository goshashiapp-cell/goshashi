// Root server.js for GoShashi Node.js deployment
const path = require('path');
const fs = require('fs');
const { createServer } = require('http');
const next = require('next');

// Attempt to load .env if available
try {
  const dotenvPath = path.join(__dirname, '.env');
  if (fs.existsSync(dotenvPath)) {
    const dotenv = require('dotenv');
    dotenv.config({ path: dotenvPath });
  }
} catch (e) {
  // Ignore if dotenv is not available; production uses environment variables
}

// In production deployment, dev MUST be false so Next.js uses the pre-built .next artifacts
const dev = process.env.NODE_ENV === 'development' && process.env.FORCE_DEV === 'true';

// Port selection: Use WEB_PORT (3000) or PORT if not conflicting with API (4000)
const rawPort = process.env.WEB_PORT || (process.env.PORT && process.env.PORT !== '4000' ? process.env.PORT : '3000');
const port = isNaN(Number(rawPort)) ? rawPort : parseInt(rawPort, 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

const webDir = path.join(__dirname, 'apps', 'web');

const app = next({
  dev,
  dir: webDir,
  hostname: typeof port === 'number' ? hostname : undefined,
  port: typeof port === 'number' ? port : undefined,
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error('Error handling request:', req.url, err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      }
    });

    server.listen(port, () => {
      console.log(`> GoShashi Web Server ready on port ${port} (production mode: ${!dev})`);
    });
  })
  .catch((err) => {
    console.error('Failed to start Next.js application:', err);
    process.exit(1);
  });
