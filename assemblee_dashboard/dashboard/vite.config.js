import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { exec } from 'child_process'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'run-updater-api',
      configureServer(server) {
        server.middlewares.use('/api/update', (req, res) => {
          if (req.url === '/' && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            
            exec('python updater.py', { cwd: '../pipeline' }, (error, stdout, stderr) => {
              if (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: stderr || stdout || error.message }));
              } else {
                res.end(JSON.stringify({ success: true, log: stdout }));
              }
            });
          } else {
            res.statusCode = 404;
            res.end();
          }
        });
      }
    }
  ],
})
