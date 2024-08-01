import {Sequelize} from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;

const Login = db.define('login',{
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    refresh_Token: DataTypes.TEXT
},{
    freezeTableName: true
});

export default Login;

