import { Router } from "express";
import { CommonRoutes } from "../../Routes/CommonRoutes/CommonRoutes";
import { Api } from "../RestController";

export class LoginRoutes extends CommonRoutes {
  constructor(server: Api, name: string) {
    super(server, Router(), name);
  }
}
