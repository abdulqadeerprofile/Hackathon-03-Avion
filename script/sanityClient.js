"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
// sanityClient.ts
const client_1 = require("@sanity/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.client = (0, client_1.createClient)({
    projectId: 'ah48gcwm',
    dataset: 'production',    
    apiVersion: '2024-01-04', 
    useCdn: true,
    token: 'skkJzcZ6UNdK1Gk3jZ5wK7UzOUjYAT89VPgL8BD2KhSnjahXOobZN439sJ1jWQe6d3G5wCV4JIVD8r7TCdoV4bzRIOofOtcUWukZeUdPQyFTV5rwmNQ0COfid6fP7bDaiVpTjOA4jgEGX1KjTRg0qQE6XtkXms9ngNPg10EYVdztUzzIbiPP',
});