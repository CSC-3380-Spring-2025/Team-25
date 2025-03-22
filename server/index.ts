import { createServer } from 'http';
import express, { Request, Response } from 'express';
import next from 'next';
import { WebSocketServer, WebSocket } from 'ws';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import ShareDB from 'sharedb';
import ShareDBMongo from 'sharedb-mongo';

// 1) Environment Config
const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydbname';

// 2) Initialize Next.js
const nextApp = next({ dev, dir: './' });
const handle = nextApp.getRequestHandler();

// 3) Create Express App
const expressApp = express();

// 4) Setup ShareDB with MongoDB Adapter
const shareDB = new ShareDB({ db: ShareDBMongo(mongoUrl) });

// 5) Create a Default Document if It Doesn’t Exist
function createInitialDoc(): void {
  const connection = shareDB.connect();
  const doc = connection.get('examples', 'counter');

  doc.fetch((err: ShareDB.Error | null) => {
    if (err) {
      console.error('Error fetching document:', err);
      return;
    }
    if (!doc.type) {
      doc.create({ num: 0 }, (createErr: ShareDB.Error | null) => {
        if (createErr) console.error('Failed to create document:', createErr);
        else console.log('Initialized document: { num: 0 }');
      });
    }
  });
}

// 6) Start Server and WebSocket Setup
async function main() {
  try {
    // Prepare Next.js
    await nextApp.prepare();

    // Handle all Next.js requests via Express
    expressApp.all('*', (req: Request, res: Response) => {
      return handle(req, res);
    });

    // Create HTTP server
    const server = createServer(expressApp);

    // Initialize WebSocket Server
    const wss = new WebSocketServer({ server });

    // Handle WebSocket Connections for ShareDB
    wss.on('connection', (ws: WebSocket) => {
      const stream = new WebSocketJSONStream(ws);
      shareDB.listen(stream);
    });

    // Ensure Default Document Exists
    createInitialDoc();

    // Start Listening
    server.listen(port, () => {
      console.log(`> Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Fatal Error:', error);
    process.exit(1);
  }
}

main();
