import { Request, Response } from 'express';

const promptHandler = (req:Request,res:Response):void => {
    try {
        // const body = req.body;
        console.log(req.body);
        res.status(200).json({message:'working'});
    } 
    catch (error) {
        res.status(400).json({message:'bad request'});
    }
}
export default promptHandler