// Type definitions for modules not included in DefinitelyTyped
declare module 'sharedb-mongo' {
    import { ShareDBDatabase } from 'sharedb';
    export default function sharedbMongo(uri: string, options?: any): ShareDBDatabase;
  }
  
  declare module '@teamwork/websocket-json-stream' {
    import { Duplex } from 'stream';
    export default class WebSocketJSONStream extends Duplex {
      constructor(ws: any);
    }
  }
  