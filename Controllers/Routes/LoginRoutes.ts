import { Router } from "express";
import { ObjectId } from "mongodb";
import { CommonRoutes } from "../../Routes/CommonRoutes/CommonRoutes";
import { Api } from "../RestController";

export class LoginRoutes extends CommonRoutes {
  constructor(server: Api, name: string) {
    super(server, Router(), name);
  }

  public deletePessoa(id: ObjectId){
    throw new Error("Esse método não deve utilizar essa função!!");
    
  }
}
