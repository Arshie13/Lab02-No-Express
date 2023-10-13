import { IncomingMessage, ServerResponse } from 'node:http';
import * as fs from 'fs';
import { fetchFromDB, generateHTML, insertFormData, updateLoanStatus } from './database';

export async function handleRequest(request: IncomingMessage, response: ServerResponse) {
  const url = request.url;
  const method = request.method;
  const htmlFilePath = './public/index.html';
  const htmlErrorFilePath = './public/error.html';
  const adminHTMLPath = './public/admin.html'
  const checkLoanStatusPath = './public/checkLoanStatus.html'

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
        response.writeHead(302, { 'Location': '/success-page' }).end();
      } catch (error) {
        const htmlErrorContent = fs.readFileSync(htmlErrorFilePath, 'utf-8')
        console.error('failed to fetch data from database');
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end(htmlErrorContent);
      }
    });
  } else if (url === '/success-page' && method === 'GET') {

    try {
      const result = await fetchFromDB('SELECT * FROM loans ORDER BY loan_id DESC LIMIT 1');
      const data = result.rows;
      const html = await generateHTML(data);
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(html);
    } catch (error) {
      throw error;
    }

  } else if (url === '/admin' && method === 'POST') {
    console.log(url, method)
    try {
      const adminHtml = fs.readFileSync(adminHTMLPath, 'utf-8');
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(adminHtml);
    } catch (error) {
      const htmlErrorContent = fs.readFileSync(htmlErrorFilePath, 'utf-8');
      console.error(error);
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
      const token = formData.get('token') || ''
      const updateStatus = formData.get('new_status') || ''

      try {
        await updateLoanStatus(token, updateStatus);
        const result = await fetchFromDB('SELECT * FROM loans');
        const data = result.rows;
        const html = await generateHTML(data);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(html);
      } catch (error) {
        console.error(error)
        const htmlErrorContent = fs.readFileSync(htmlErrorFilePath, 'utf-8')
        response.writeHead(500, { 'Content-Type': 'text/html' });
        response.end(htmlErrorContent);
      }
    })

  } else if (url === '/check-loan-status' && method === 'POST') {

    try {
      const checkStatusHTML = fs.readFileSync(checkLoanStatusPath, 'utf-8')
      response.writeHead(200, { 'Content-Type': 'text/html' })
      response.end(checkStatusHTML)
    } catch (error) {
      console.error(error)
      const htmlErrorContent = fs.readFileSync(htmlErrorFilePath, 'utf-8')
      response.writeHead(500, { 'Content-Type': 'text/html' });
      response.end(htmlErrorContent);
    }

  } else if (url === '/display-loan-status' && method === 'POST') {

    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
    });
    request.on('end', async () => {
      const formData = new URLSearchParams(body)
      const token = formData.get('token') || ''

      try {
        const query = `SELECT * FROM loans WHERE token = '${token}'`
        const result = await fetchFromDB(query);
        const data = result.rows;
        const html = await generateHTML(data);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(html);
      } catch (error) {
        console.error(error)
        const htmlErrorContent = fs.readFileSync(htmlErrorFilePath, 'utf-8')
        response.writeHead(500, { 'Content-Type': 'text/html' });
        response.end(htmlErrorContent);
      }
    })

  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end(url);
  }
}
