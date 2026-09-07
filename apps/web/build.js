// apps/web/build.js - Sanitized production build runner
const path = require('path');

// Clean and strictly force standard production NODE_ENV without quotes or whitespace
process.env.NODE_ENV = 'production';

// Ensure working directory is apps/web so Tailwind content paths resolve properly
process.chdir(path.resolve(__dirname));

process.argv = [
  process.argv[0],
  require.resolve('next/dist/bin/next'),
  'build',
];

require('next/dist/bin/next');
