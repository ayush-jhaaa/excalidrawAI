"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import dotenv from 'dotenv';
const cors_1 = __importDefault(require("cors"));
const prompt_1 = __importDefault(require("./prompt"));
const app = (0, express_1.default)();
const port = 3000;
const router = express_1.default.Router();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: 'http://localhost:5173' }));
app.use((0, cors_1.default)());
app.get('/', (_req, res) => {
    res.send('working');
});
app.use('/api', router);
router.post('/prompt', prompt_1.default);
app.listen(port, () => {
    console.log(`server sunning on port => ${port}`);
});
