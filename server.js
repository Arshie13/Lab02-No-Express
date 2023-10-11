"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("node:http");
var handleRequest_1 = require("./handleRequest");
var server = http.createServer(handleRequest_1.handleRequest);
server.listen(3000, function () {
    console.log('Server started at http://localhost:3000');
});
