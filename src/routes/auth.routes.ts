import express  from 'express';   
const router = express.Router()
import { register, login, getMe, logout} from '../controllers/auth.controller';

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);
router.delete('/logout',logout)

export default router