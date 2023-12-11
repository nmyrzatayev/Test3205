import { NextFunction, Request, Response } from 'express'
import User from '../entities/User'
import userService from './service'
class UserController {

    async findAll(req: Request, res: Response, next: NextFunction) {

        try {
            const email = req.query.email as string,
                number = req.query.number as string
            const users = await userService.findAll(email, number);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return res.json(users)
        } catch (e: any) {
            next(e)
        }
    }
}

export default new UserController()