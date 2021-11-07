import express, { Router,Express } from "express";
import { CommonRoutes } from "../../Routes/CommonRoutes";
import { Api } from "../RestController";

export class LoginRoutes extends CommonRoutes{

    constructor(server:Api,name:string){
        super(server,Router(),name);
    }
    

}