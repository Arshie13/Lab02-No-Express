import { Pool, QueryResult } from 'pg'
import * as crypto from 'node:crypto'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Students',
  password: `postgres`,
  port: 5432
});

function generateToken() {
  return crypto.randomBytes(32).toString('base64url')
}

export async function insertFormData(formData: {
  name: string;
  email: string;
  phone_number: string;
  loan_amount: number;
  reason: string;
  approval_or_rejection: Date;
}): Promise<QueryResult> {

  const token = generateToken()

  const query = `
    INSERT INTO loans (name, email, phone_number, loan_amount, reason, approval_or_rejection, token)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    formData.name,
    formData.email,
    formData.phone_number,
    formData.loan_amount,
    formData.reason,
    formData.approval_or_rejection,
    token
  ];

  try {
    const client = await pool.connect();
    const result = await client.query(query, values);
    console.log('Data inserted with token: ', token, 'and date: ', result.rows[0].approval_or_rejection)
    console.log('sent')
    return result;
  } catch (error) {
    console.error('something went wrong', error)
  }
}

export async function fetchFromDB(query: string): Promise<QueryResult> {
  try {
    const client = await pool.connect();
    const result = await client.query(query);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function generateHTML(data: any[]): Promise<string> {
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Data from Database</title>
    </head>
    <body>
      <h1>Data from Database</h1>
      <ul>
  `

  data.forEach((item) => {
    html += `
        <li>Name: ${item.name}</li>
        <li>Email: ${item.email}</li>
        <li>Phone Number: ${item.phone_number}</li>
        <li>Loan Amount: ${item.loan_amount}</li>
        <li>Reason: ${item.reason}</li>
    `;
  });

  html += `
      </ul>
    </body>
    </html>
  `;

  return html;
}
