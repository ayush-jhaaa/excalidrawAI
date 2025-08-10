import express from "express";
// import dotenv from 'dotenv';
import cors from 'cors'
import promptHandler from "./prompt";

const app = express();
const port = 3000;
const router = express.Router();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(cors());
app.get('/',(_req,res) => {
    res.send('working');
})

app.use('/api', router);
router.post('/prompt',promptHandler);

app.listen(port,() => {
    console.log(`server sunning on port => ${port}`);
})