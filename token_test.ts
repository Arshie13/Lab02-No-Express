import * as fs from 'fs';
import * as http from 'node:http';
import { IncomingMessage, ServerResponse } from 'node:http';
import { Pool, PoolClient, QueryResult } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'labs',
  password: 'BASILA2001',
  port: 5432,
});

async function sendToDatabase(formData: {
  name: string;
  email: string;
  phone_number: string;
  loan_amount: number;
  reason: string;
}): Promise<QueryResult> {
  const query = `
  INSERT INTO loans (name, email, phone_number, loan_amount, reason)
  VALUES ($1, $2, $3, $4, $5)

  RETURNING *
`;
  const values = [formData.name, formData.email, formData.phone_number, formData.loan_amount, formData.reason];

  let client: PoolClient;
  try {
    client = await pool.connect();
    const result = client.query(query, values)
    console.log('Data sent to db');
    return result
  } catch (err) {
    console.log('Error connecting to the database:', err);
    if (client) {
      client.release();
    }
    throw err;
  }
}

const server = http.createServer(async (request: IncomingMessage, response: ServerResponse) => {
  const { method, url } = request;

  if (url === '/apply-loan') {
    // Serve the loan application form HTML page
    const htmlContents = './ui.html';
    try {
      const contents = fs.readFileSync(htmlContents, 'utf-8');
      response
        .writeHead(200, { 'Content-Type': 'text/html' })
        .end(contents); // Send the contents as the response
    } catch (error) {
      console.error('Error reading HTML file:', error);
      response
        .writeHead(500, { 'Content-Type': 'text/plain' })
        .end('Internal Server Error');
    }
  } else if (url === '/apply-loan-success' && method === 'POST') {
    // Your HTML response
    const html = /* html */ `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        Date and time right now: ${new Date().toLocaleString()}
      </body>
      </html>
    `;
    response.writeHead(200, { 'Content-Type': 'text/html' }).end(html);

    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', async () => {

      const formData = new URLSearchParams(body);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const phone_number = formData.get('phone_number') || '';
      const loanAmount = formData.get('loan_amount') || '';
      const loanAmountInt = parseInt(loanAmount)
      const reason = formData.get('reason') || '';
      
      try {
        const result = await sendToDatabase({
          name,
          email,
          phone_number,
          loan_amount: loanAmountInt,
          reason
        });
        if (result) {
          console.log('i dunno')
          console.log('Data inserted:', result.rows);
        }
      } catch (error) {
        console.error(error);
      }
    });

  } else {
    response
      .writeHead(404, { 'Content-Type': 'text/plain' })
      .end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});