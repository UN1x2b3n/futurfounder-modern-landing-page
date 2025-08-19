#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3001;

// Simple HTTP server to serve the demo
const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  
  if (filePath === './') {
    filePath = './demo.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1>404 - File Not Found</h1>
              <p>The requested file could not be found.</p>
              <a href="/">Go to Demo</a>
            </body>
          </html>
        `);
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log('🚀 Analytics Demo Server Started!');
  console.log(`📊 Demo URL: http://localhost:${PORT}`);
  console.log('🎯 Features demonstrated:');
  console.log('   • Real-time event tracking');
  console.log('   • Conversion tracking with values');
  console.log('   • A/B testing with variant assignment');
  console.log('   • Form analytics with field interactions');
  console.log('   • Performance monitoring');
  console.log('   • Scroll depth tracking');
  console.log('   • Heatmap simulation');
  console.log('');
  console.log('💡 Tip: Open browser console to see detailed tracking logs');
  console.log('🔄 Press Ctrl+C to stop the server');
  
  // Try to open browser automatically
  const url = `http://localhost:${PORT}`;
  const start = process.platform === 'darwin' ? 'open' : 
                process.platform === 'win32' ? 'start' : 'xdg-open';
  
  exec(`${start} ${url}`, (error) => {
    if (error) {
      console.log(`\n🌐 Please open ${url} in your browser manually`);
    } else {
      console.log('🌐 Opening demo in your default browser...');
    }
  });
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down demo server...');
  server.close(() => {
    console.log('✅ Demo server stopped');
    process.exit(0);
  });
});