import * as http from 'node:http';
import { handleRequest } from './handleRequest';

const server = http.createServer(handleRequest);

server.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});
