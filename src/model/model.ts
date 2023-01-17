import { DataType, DataTypes, Model, STRING, UUID } from 'sequelize';
import {db} from "../config"


export interface UserAttribute{
verified: boolean;
id:string;
name:string;
email:string;
password:string;
salt:string;
otp:Number;
otp_expiry:Date
}

export class UserInstance extends Model<UserAttribute>{}

UserInstance.init(
    {
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
        notNull: {msg: "Email address required"},
        isEmail: {msg: "Please provide a valid email"}
        }
    },

password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        notNull: {msg: "Password is required"},
        notEmpty: {msg: "Provide a password"}
    }
},
salt: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        notNull: {msg: "Salt is required"},
        notEmpty: {msg: "Provide a salt"}
    }
},
otp: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
        notNull: {msg: "otp is required"},
        notEmpty: {msg: "Provide an otp"}
    }
},
otp_expiry: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
        notNull: {msg: "otp expired"}
    }
},
verified: {
    type: DataTypes.BOOLEAN,
    allowNull: true
},
},
{
    sequelize: db,
    tableName: 'User'
}
)

