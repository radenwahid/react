import express from 'express';
import { getLoginUser, Register, LoginUser, Logout } from "../controller/LoginController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controller/RefreshToken.js";

const router = express.Router();

router.get('/login', verifyToken, getLoginUser);
router.post('/register', Register); // Ubah rute ini
router.post('/login', LoginUser); // Ubah endpoint ini agar sesuai dengan LoginUser
router.delete('/logout', Logout);
router.get('/token', refreshToken);

export default router;
