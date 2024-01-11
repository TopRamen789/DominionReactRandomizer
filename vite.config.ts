import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ts from 'vite-plugin-ts';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ts(),
    {
      name: 'generate-files-list',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const kotwListRoute = '/kotws';
          const kotwContentRoute = '/kotw';

          if (req.url === kotwListRoute) {
            const folderPath = path.resolve(__dirname, 'data/KotW');
            const txtFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.txt'));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ files: txtFiles }));
          } else if (req.url.startsWith(kotwContentRoute)) {
            // Extract filename from the URL
            const fileName = req.url.slice(kotwContentRoute.length).replace('%20', ' ');

            // Read and parse file contents
            try {
              const filePath = path.resolve(__dirname, 'data/KotW', fileName.replace('/', ''));
              console.log('Filepath:', filePath);
              console.log(__dirname, 'data/kotw', fileName);
              const fileContent = fs.readFileSync(filePath, 'utf-8');
              // Do something with fileContent
              res.setHeader('Content-Type', 'text/plain');
              res.end(fileContent);
            } catch (error) {
              console.error('Error reading file:', error);
              res.statusCode = 500;
              res.end();
              // res.end('Internal Server Error: ', error);
            }
          } else {
            next();
          }
        });
      },
    },
  ],
  optimizeDeps: {
    include: ['dominionrandomizercore'],
  },
})
