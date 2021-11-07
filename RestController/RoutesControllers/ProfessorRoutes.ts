import { Router,Express, Request, Response } from "express";
import { CommonRoutes } from "../../Routes/CommonRoutes";
import { Api } from "../RestController";

export class ProfessorRoutes extends CommonRoutes{

    constructor(server:Api,routeName:string){
        super(server,Router(),routeName);
    }

    protected postUser(req:Request, res:Response){ throw new Error("Método não foi declarado!!"); };

}