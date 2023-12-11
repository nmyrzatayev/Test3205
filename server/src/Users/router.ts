import express from 'express'
import userController from './controller'

const router = express.Router();

router.get('/find', userController.findAll);

export default router