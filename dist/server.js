"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helmet_1 = __importDefault(require("helmet"));
const authRoutes = require('./routes/authRoutes');
const express = require('express');
const app = express();
const PORT = 8000;
app.use((0, helmet_1.default)());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
app.listen(PORT, () => {
    console.log(`Servidor ativo em http://localhost:${PORT}`);
});
