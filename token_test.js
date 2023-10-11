"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var http = require("node:http");
var pg_1 = require("pg");
var querystring = require("querystring"); // ES6 module syntax
var pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'labs',
    password: 'BASILA2001',
    port: 5432,
});
function sendToDatabase(formData) {
    return __awaiter(this, void 0, void 0, function () {
        var query, values, client, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "\n  INSERT INTO loans (name, email, phone_number, loan_amount, reason)\n  VALUES ($1, $2, $3, $4, $5)\n\n  RETURNING *\n";
                    values = [formData.name, formData.email, formData.phone_number, formData.loan_amount, formData.reason];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.connect()];
                case 2:
                    client = _a.sent();
                    result = client.query(query, values);
                    console.log('Data sent to db');
                    return [2 /*return*/, result];
                case 3:
                    err_1 = _a.sent();
                    console.log('Error connecting to the database:', err_1);
                    if (client) {
                        client.release();
                    }
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
var server = http.createServer(function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var method, url, htmlContents, contents, html, body_1;
    return __generator(this, function (_a) {
        method = request.method, url = request.url;
        if (url === '/apply-loan') {
            htmlContents = './ui.html';
            try {
                contents = fs.readFileSync(htmlContents, 'utf-8');
                response
                    .writeHead(200, { 'Content-Type': 'text/html' })
                    .end(contents); // Send the contents as the response
            }
            catch (error) {
                console.error('Error reading HTML file:', error);
                response
                    .writeHead(500, { 'Content-Type': 'text/plain' })
                    .end('Internal Server Error');
            }
        }
        else if (url === '/apply-loan-success' && method === 'POST') {
            html = "\n      <!DOCTYPE html>\n      <html lang=\"en\">\n      <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Document</title>\n      </head>\n      <body>\n        Date and time right now: ".concat(new Date().toLocaleString(), "\n      </body>\n      </html>\n    ");
            response.writeHead(200, { 'Content-Type': 'text/html' }).end(html);
            body_1 = '';
            request.on('data', function (chunk) {
                body_1 += chunk;
            });
            request.on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
                var parsedFormData, formData, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            parsedFormData = querystring.parse(body_1);
                            formData = {
                                name: parsedFormData.name,
                                email: parsedFormData.email,
                                phone_number: parsedFormData.phone_number,
                                loan_amount: parsedFormData.loan_amount ? parseInt(parsedFormData.loan_amount, 10) : 0,
                                reason: parsedFormData.reason,
                            };
                            return [4 /*yield*/, sendToDatabase(formData)];
                        case 1:
                            result = _a.sent();
                            console.log('Data inserted:', result.rows);
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            console.error(error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        }
        else {
            response
                .writeHead(404, { 'Content-Type': 'text/plain' })
                .end('Not Found');
        }
        return [2 /*return*/];
    });
}); });
// Function to insert loan application data into the database (you need to customize this)
function insertLoanApplication(formData) {
    return __awaiter(this, void 0, void 0, function () {
        var client, query, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, pool.connect()];
                case 1:
                    client = _a.sent();
                    query = "\n        INSERT INTO loans (/* List of columns */) \n        VALUES (/* List of values */) \n        RETURNING id;\n      ";
                    return [4 /*yield*/, client.query(query)];
                case 2:
                    result = _a.sent();
                    client.release(); // Release the database client
                    // Check if the insertion was successful
                    return [2 /*return*/, result.rowCount === 1];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error inserting loan application data:', error_2);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
server.listen(3000, function () {
    console.log('Server started at http://localhost:3000');
});
