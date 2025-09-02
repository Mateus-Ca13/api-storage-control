"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = sendResponse;
function sendResponse(res, data, message, success = true, status = 200) {
    res.status(status).json({ success, data, message });
}
