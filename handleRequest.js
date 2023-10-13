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
exports.handleRequest = void 0;
var fs = require("fs");
var database_1 = require("./database");
function handleRequest(request, response) {
    return __awaiter(this, void 0, void 0, function () {
        var url, method, htmlFilePath, htmlErrorFilePath, adminHTMLPath, checkLoanStatusPath, htmlContent, htmlErrorContent, body_1, result, data, html, error_1, adminHtml, htmlErrorContent, body_2, checkStatusHTML, htmlErrorContent, body_3;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = request.url;
                    method = request.method;
                    htmlFilePath = './public/index.html';
                    htmlErrorFilePath = './public/error.html';
                    adminHTMLPath = './public/admin.html';
                    checkLoanStatusPath = './public/checkLoanStatus.html';
                    console.log('Debugging -- url is', url, 'while method is', method);
                    if (!(url === '/apply-loan')) return [3 /*break*/, 1];
                    try {
                        htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.end(htmlContent);
                    }
                    catch (err) {
                        htmlErrorContent = fs.readFileSync(htmlErrorFilePath, 'utf-8');
                        console.error('some kinda error but in console');
                        response.writeHead(500, { 'Content-Type': 'text/html' });
                        response.end(htmlErrorContent);
                    }
                    return [3 /*break*/, 9];
                case 1:
                    if (!(url === '/apply-loan-success' && method === 'POST')) return [3 /*break*/, 2];
                    body_1 = '';
                    request.on('data', function (chunk) {
                        body_1 += chunk.toString();
                    });
                    request.on('end', function () { return __awaiter(_this, void 0, void 0, function () {
                        var formData, name, email, phone_number, loanAmount, loanAmountInt, reason, approval_or_rejection, error_2, htmlErrorContent;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    formData = new URLSearchParams(body_1);
                                    name = formData.get('name') || '';
                                    email = formData.get('email') || '';
                                    phone_number = formData.get('phone_number') || '';
                                    loanAmount = formData.get('loan_amount') || '';
                                    loanAmountInt = parseInt(loanAmount);
                                    reason = formData.get('reason') || '';
                                    approval_or_rejection = new Date(Date.now()) // convert from number to Date object
                                    ;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, (0, database_1.insertFormData)({
                                            name: name,
                                            email: email,
                                            phone_number: phone_number,
                                            loan_amount: loanAmountInt,
                                            reason: reason,
                                            approval_or_rejection: approval_or_rejection
                                        })];
                                case 2:
                                    _a.sent();
                                    console.log('Data inserted successfully.');
                                    response.writeHead(302, { 'Location': '/success-page' }).end();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _a.sent();
                                    htmlErrorContent = fs.readFileSync(htmlErrorFilePath, 'utf-8');
                                    console.error('failed to fetch data from database');
                                    response.writeHead(500, { 'Content-Type': 'text/plain' });
                                    response.end(htmlErrorContent);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 9];
                case 2:
                    if (!(url === '/success-page' && method === 'GET')) return [3 /*break*/, 8];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, (0, database_1.fetchFromDB)('SELECT * FROM loans ORDER BY loan_id DESC LIMIT 1')];
                case 4:
                    result = _a.sent();
                    data = result.rows;
                    return [4 /*yield*/, (0, database_1.generateHTML)(data)];
                case 5:
                    html = _a.sent();
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(html);
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    throw error_1;
                case 7: return [3 /*break*/, 9];
                case 8:
                    if (url === '/admin' && method === 'POST') {
                        console.log(url, method);
                        try {
                            adminHtml = fs.readFileSync(adminHTMLPath, 'utf-8');
                            response.writeHead(200, { 'Content-Type': 'text/html' });
                            response.end(adminHtml);
                        }
                        catch (error) {
                            htmlErrorContent = fs.readFileSync(htmlErrorFilePath, 'utf-8');
                            console.error(error);
                            response.writeHead(500, { 'Content-Type': 'text/plain' });
                            response.end(htmlErrorContent);
                        }
                    }
                    else if (url === '/update-loan-status' && method === "POST") {
                        body_2 = '';
                        request.on('data', function (chunk) {
                            body_2 += chunk.toString();
                        });
                        request.on('end', function () { return __awaiter(_this, void 0, void 0, function () {
                            var formData, token, updateStatus, result, data, html, error_3, htmlErrorContent;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        formData = new URLSearchParams(body_2);
                                        token = formData.get('token') || '';
                                        updateStatus = formData.get('new_status') || '';
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 5, , 6]);
                                        return [4 /*yield*/, (0, database_1.updateLoanStatus)(token, updateStatus)];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, (0, database_1.fetchFromDB)('SELECT * FROM loans')];
                                    case 3:
                                        result = _a.sent();
                                        data = result.rows;
                                        return [4 /*yield*/, (0, database_1.generateHTML)(data)];
                                    case 4:
                                        html = _a.sent();
                                        response.writeHead(200, { 'Content-Type': 'text/html' });
                                        response.end(html);
                                        return [3 /*break*/, 6];
                                    case 5:
                                        error_3 = _a.sent();
                                        console.error(error_3);
                                        htmlErrorContent = fs.readFileSync(htmlErrorFilePath, 'utf-8');
                                        response.writeHead(500, { 'Content-Type': 'text/html' });
                                        response.end(htmlErrorContent);
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                    else if (url === '/check-loan-status' && method === 'POST') {
                        try {
                            checkStatusHTML = fs.readFileSync(checkLoanStatusPath, 'utf-8');
                            response.writeHead(200, { 'Content-Type': 'text/html' });
                            response.end(checkStatusHTML);
                        }
                        catch (error) {
                            console.error(error);
                            htmlErrorContent = fs.readFileSync(htmlErrorFilePath, 'utf-8');
                            response.writeHead(500, { 'Content-Type': 'text/html' });
                            response.end(htmlErrorContent);
                        }
                    }
                    else if (url === '/display-loan-status' && method === 'POST') {
                        body_3 = '';
                        request.on('data', function (chunk) {
                            body_3 += chunk.toString();
                        });
                        request.on('end', function () { return __awaiter(_this, void 0, void 0, function () {
                            var formData, token, query, result, data, html, error_4, htmlErrorContent;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        formData = new URLSearchParams(body_3);
                                        token = formData.get('token') || '';
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 4, , 5]);
                                        query = "SELECT * FROM loans WHERE token = '".concat(token, "'");
                                        return [4 /*yield*/, (0, database_1.fetchFromDB)(query)];
                                    case 2:
                                        result = _a.sent();
                                        data = result.rows;
                                        return [4 /*yield*/, (0, database_1.generateHTML)(data)];
                                    case 3:
                                        html = _a.sent();
                                        response.writeHead(200, { 'Content-Type': 'text/html' });
                                        response.end(html);
                                        return [3 /*break*/, 5];
                                    case 4:
                                        error_4 = _a.sent();
                                        console.error(error_4);
                                        htmlErrorContent = fs.readFileSync(htmlErrorFilePath, 'utf-8');
                                        response.writeHead(500, { 'Content-Type': 'text/html' });
                                        response.end(htmlErrorContent);
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                    else {
                        response.writeHead(404, { 'Content-Type': 'text/plain' });
                        response.end(url);
                    }
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.handleRequest = handleRequest;
