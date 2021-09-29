import express, { Router } from "express";
import { CommonRoutes } from "../Routes/CommonRoutes";
import { AlunoRestController } from "./AlunoRestController";
import { AlunoRoutes } from "./RoutesControllers/AlunoRoutes";
const PORT = 3000;
// const bodyParser = require('body-parser');
const app = express();
export const routes:{route?:CommonRoutes} = {};

export function ApiStart(){
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.listen(PORT, () => {
        console.log("Servidor rodando na porta " + PORT);
    });
    
    routes.route = new AlunoRestController(app);
}

app.get("/", (req: any, res: any, next: any) => {
    console.log("Acesso ao base");
    res.status(200).json("Acesso ao base")
})

export{app};