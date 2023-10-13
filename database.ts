import { Pool, QueryResult } from 'pg'
import { generateToken, checkIfTokenExists } from './generator';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Students',
  password: `postgres`,
  port: 5432
});

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
    console.log('Data inserted to db')
    return result;

  } catch (error) {
    console.error('something went wrong', error)
  }
}

export async function updateLoanStatus(token: string, new_status: string): Promise<void> {

  const query = `UPDATE loans SET loan_status = $2 WHERE token = $1 RETURNING *`;
  const values = [token, new_status];

  try {

    const client = await pool.connect();
    const checkToken = await checkIfTokenExists(client, token)

    if (checkToken) {
      await client.query(query, values)
    }

  } catch (error) {
    console.error(error)
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
