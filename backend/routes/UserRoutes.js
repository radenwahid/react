import  express  from 'express';
import {
    getUsers, 
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controller/UserController.js';

const router = express.Router();

router.get('/data', getUsers);
router.get('/data/:id', getUserById);
router.post('/data/', createUser);
router.patch('/data/:id', updateUser);
router.delete('/data/:id', deleteUser);

export default router;
