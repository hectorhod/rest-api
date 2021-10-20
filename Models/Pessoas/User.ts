import { ObjectId } from "bson";
import * as bcrypt from "bcrypt"
import { Pessoa } from "./Pessoa";

export class User{
    _id: ObjectId;
    username: string;
    password: string;
    email: string;
    pessoa: ObjectId;

    constructor(username:string, password:string, email:string, pessoa: ObjectId, id?:ObjectId){
        id? this._id = id : this._id = new ObjectId();
        this.username = username;
        this.email = email;
        this.password = password;
        this.pessoa = pessoa;
    }

}

export async function CompareIt(password:string, user:User){
    const validPassword = await bcrypt.compare(password,user.password);
    if(validPassword){
        return true;
    }else{
        return false;
    }
}

export async function HashIt(password:string){
    const seed = await bcrypt.genSalt(6)
    const hashedPassword = await bcrypt.hash(password,seed);
    return hashedPassword;
}

