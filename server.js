// Root server.js for GoShashi Node.js deployment
const path = require('path');
const fs = require('fs');
const { createServer } = require('http');
const next = require('next');

// Attempt to load .env if available
try {
  const dotenvPath = path.join(__dirname, '.env');
  if (fs.existsSync(dotenvPath)) {
    // Optional dotenv loading without crashing if not installed at root
    const dotenv = require('dotenv');
    dotenv.config({ path: dotenvPath });
  }
} catch (e) {
  // Ignore if dotenv is not available; production uses environment variables
}

const dev = process.env.NODE_ENV !== 'production';
const rawPort = process.env.PORT || '3000';
// In Passenger or socket setups, PORT may be a named pipe or Unix domain socket path
const port = isNaN(Number(rawPort)) ? rawPort : parseInt(rawPort, 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

const webDir = path.join(__dirname, 'apps', 'web');

// Pre-flight check: Ensure production build exists when in production mode
if (!dev) {
  const buildIdPath = path.join(webDir, '.next', 'BUILD_ID');
  if (!fs.existsSync(buildIdPath)) {
    console.error(
      '⚠️ ERROR: Next.js production build not found in apps/web/.next!\n' +
      'Please run "npm run build" before starting the server in production mode.'
    );
  }
}

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
      console.log(`> GoShashi Web Server ready on ${port} (dev: ${dev})`);
    });
  })
  .catch((err) => {
    console.error('Failed to start Next.js application:', err);
    process.exit(1);
  });
