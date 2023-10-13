import * as crypto from 'node:crypto'

export function generateToken() {
  return crypto.randomBytes(32).toString('base64url')
};

export async function checkIfTokenExists(client, token: string): Promise<boolean> {

  const query = `SELECT * FROM loans WHERE token = '${token}'`
  const checkResult = await client.query(query)
  return checkResult.rows.length > 0
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
        <li>Loan Status: ${item.loan_status}</li>
        <li>Token: ${item.token} <======= Please copy this as this is needed for loan validation. 
        Please don't share token to anyone.
        </li>
        <br> <br>
    `;
  });

  html += `
      </ul>
    </body>
    </html>
  `;

  return html;
};