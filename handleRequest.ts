import { IncomingMessage, ServerResponse } from 'node:http';
import * as fs from 'fs';
import { fetchFromDB, generateHTML, insertFormData, updateLoanStatus } from './database';

export async function handleRequest(request: IncomingMessage, response: ServerResponse) {
  const url = request.url;
  const method = request.method;
  const htmlFilePath = './public/index.html';
  const htmlErrorFilePath = './public/error.html';
  const adminHTMLPath = './public/admin.html'

  console.log('Debugging -- url is', url, 'while method is', method);

  if (url === '/apply-loan') {
    try {
      const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(htmlContent);
    } catch (err) {
      const htmlErrorContent = fs.readFileSync(htmlErrorFilePath, 'utf-8')
      console.error('some kinda error but in console')
      response.writeHead(500, { 'Content-Type': 'text/html' });
      response.end(htmlErrorContent);
    }
  } else if (url === '/apply-loan-success' && method === 'POST') {

    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    request.on('end', async () => {
      const formData = new URLSearchParams(body);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const phone_number = formData.get('phone_number') || '';
      const loanAmount = formData.get('loan_amount') || '';
      const loanAmountInt = parseInt(loanAmount)
      const reason = formData.get('reason') || '';
      const approval_or_rejection = new Date(Date.now()) // convert from number to Date object

      try {
        await insertFormData({
          name: name,
          email: email,
          phone_number: phone_number,
          loan_amount: loanAmountInt,
          reason: reason,
          approval_or_rejection: approval_or_rejection
        });
        console.log('Data inserted successfully.');
      } catch (error) {
        console.error('Error inserting data:', error);
        console.log('Data insertion failed.');
      }
    });

    try {
      const result = await fetchFromDB('SELECT * FROM loans');
      const data = result.rows;
      const html = await generateHTML(data);

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(html);
    } catch (error) {
      const htmlErrorContent = fs.readFileSync(htmlErrorFilePath, 'utf-8')
      console.error('failed to fetch data from database')
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end(htmlErrorContent);
    }
  } else if (url === '/admin') {
    console.log(url, method)
    try {
      const adminHtml = fs.readFileSync(adminHTMLPath, 'utf-8');
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(adminHtml);
    } catch (error) {
      const htmlErrorContent = fs.readFileSync(htmlErrorFilePath, 'utf-8');
      console.error('Failed to load admin.html');
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end(htmlErrorContent);
    }

  } else if (url === '/update-loan-status' && method === "POST") {

    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
    });
    request.on('end', async () => {
      const formData = new URLSearchParams(body)
      const loanName = formData.get('name') || ''
      const updateStatus = formData.get('new_status') || ''

      try {
        const result = await updateLoanStatus(loanName, updateStatus)
        response.writeHead(500, { 'Content-Type': 'text/html' });
        response.end('loan status updated successsfully');

      } catch (error) {
        const htmlErrorContent = fs.readFileSync(htmlErrorFilePath, 'utf-8')
        console.error('failed to update loan status')
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end(htmlErrorContent);
      }

    })

  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end(url);
  }
}
