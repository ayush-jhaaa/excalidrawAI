"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promptHandler = (req, res) => {
    try {
        // const body = req.body;
        console.log(req.body);
        res.status(200).json({ message: 'working' });
    }
    catch (error) {
        res.status(400).json({ message: 'bad request' });
    }
};
exports.default = promptHandler;
