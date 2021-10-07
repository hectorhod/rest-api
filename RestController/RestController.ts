// Realiza a importação dos modulos necessários
import express, { Router } from "express";
import { CommonRoutes } from "../Routes/CommonRoutes";
import { AlunoRestController } from "./AlunoRestController";
import { ProfessorRestController } from "./ProfessorRestController";

// Define a porta de hospedagem
const PORT = 3000;

// Define o tipo de servidor
const app = express();

// Armazena as ROUTE em uma lista de routes
export const routes:[{route?:CommonRoutes}] = [{}];

// Serve para inicializar a API
export function ApiStart(){
    // Define que a api vai receber JSON/Application
    app.use(express.json());

    // app.use(express.urlencoded({extended: false}));

    // Define qual porta o sistema estará observando
    app.listen(PORT, () => {
        console.log("Servidor rodando na porta " + PORT);
    });
    
    // Empurra uma ROUTE para a lista de routes
    routes.push({route : new AlunoRestController(app)});
    routes.push({route : new ProfessorRestController(app)})
}

export function getRoute(routeName:string){
    // Procura na lista de routes a ROUTE com nome especificado
    try{
        var route = routes.find((route) => {
            return route.route?.getName() === routeName
        });
        
        if(route){
            return route ;
        }else {
            throw new Error("Não existia a route "+routeName);
        }

    }catch(error: any){
        // Imprime no console o erro
        console.log(error);
    }
}

// Define um endereço de escuta para responder (neste caso localhost:port/)
app.get("/", (req: any, res: any, next: any) => {
    console.log("Acesso ao base");
    res.status(200).json("Acesso ao base")
})

export{app};