"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const router = (0, express_1.Router)();
// POST /auth/register
router.post('/register', authControllers_1.registerUserController);
// POST /auth/login
router.post('/login', authControllers_1.loginUserController);
// POST /auth/logout
router.post('/logout');
// POST /auth/refresh-token
router.post('/refresh-token');
exports.default = router;
