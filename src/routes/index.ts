import { Router } from 'express'

import authRouter from './auth.routes'
import userRouter from './user.routes'
import documentRouter from './document.routes'

const router = Router()

router.use('/api/v1/auth', authRouter)
router.use('/api/v1/user', userRouter)
router.use('/api/v1/document', documentRouter)

export default router