const http = require('http');

const server = http.createServer((req, res) => {
  // Serve test page on root
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Playwright Route Test</title>
        </head>
        <body>
          <div id="results">Waiting for test...</div>
          <script>
            window.results = [];
            async function run() {
              for (let i = 0; i < 2; i++) {
                try {
                  const r = await fetch('/data');
                  window.results.push(r.status);
                } catch (e) {
                  window.results.push('aborted');
                }
              }
            }
            run();
          </script>
        </body>
      </html>
    `);
  } 
  // Respond to /data requests
  else if (req.url === '/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
  } 
  else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3333, () => {
  console.log('Test server running on http://localhost:3333');
});
