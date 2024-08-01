import Login from "../models/LoginModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getLoginUser = async (req, res) => {
    try {
        const loginall = await Login.findAll({
            attributes: ['email', 'username']
        });
        res.json(loginall);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const Register = async (req, res) => {
    const { email, username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Password and Confirm Password do not match" });
    }
    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        await Login.create({
            email: email,
            username: username,
            password: hashPassword
        });
        res.json({ msg: "Register Success" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Login.findOne({ where: { email } });
        if (!user) return res.status(404).json({ msg: "Email not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ msg: "Incorrect password" });

        const userId = user.id;
        const name = user.username;

        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        await Login.update({ refresh_Token: refreshToken }, { where: { id: userId } });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
           
        });
        res.json({ accessToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204); // No content

    try {
        const login = await Login.findOne({ where: { refresh_Token: refreshToken } });
        if (!login) return res.sendStatus(204);

        const userId = login.id;
        await Login.update({ refresh_Token: null }, { where: { id: userId } });
        res.clearCookie('refreshToken');
        res.sendStatus(200); // OK
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
};
