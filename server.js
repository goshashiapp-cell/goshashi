// Root server.js for GoShashi Node.js deployment
const path = require('path');
const fs = require('fs');
const { createServer } = require('http');
const next = require('next');

// Load environment variables if present
try {
  const dotenvPath = path.join(__dirname, '.env');
  if (fs.existsSync(dotenvPath)) {
    require('dotenv').config({ path: dotenvPath });
  }
} catch (e) {}

// Production mode for live deployments
const dev = false;

// Listen on Passenger / Hostinger assigned port or socket
const rawPort = process.env.PORT || '3000';
const port = isNaN(Number(rawPort)) ? rawPort : parseInt(rawPort, 10);

const webDir = path.join(__dirname, 'apps', 'web');

const app = next({
  dev,
  dir: webDir,
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        console.log(`[REQ] ${req.method} ${req.url}`);
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
      console.log(`> GoShashi Web Server ready on port ${port} (production mode)`);
    });
  })
  .catch((err) => {
    console.error('Failed to start Next.js application:', err);
    process.exit(1);
  });
