import { Express } from "express";
import { AlunoRestController } from "../RestController/AlunoRestController";
import { DiretorRestController } from "../RestController/DiretorRestController";
import { LibraryRestController } from "../RestController/LibraryRestController";
import { LoginRestController } from "../RestController/LoginRestController";
import { ProfessorRestController } from "../RestController/ProfessorRestController";
import { Api } from "../RestController/RestController";
import { UserRestController } from "../RestController/UserRestController";
import { CommonRoutes, METHOD } from "./CommonRoutes";

export const routes:Array<CommonRoutes> = new Array<CommonRoutes>();

export function routesStart(application: Express){
    if(routes.length === 0){
        // Empurra uma ROUTE para a lista de routes
        routes.push(new AlunoRestController(application));
        routes.push(new ProfessorRestController(application));
        routes.push(new DiretorRestController(application));
        routes.push(new LibraryRestController(application));
        routes.push(new UserRestController(application));
        routes.push(new LoginRestController(application));
    }else{
        console.log("As rotas já estão inicializada, o que você planeja?")
    }
}

// function getRoutes(routeName:string){
//     // Procura na lista de routes a ROUTE com nome especificado
//     try{
//         var route = routes.find((route) => {
//             return route.getName() === routeName
//         });
        
//         if(route){
//             return route ;
//         }else {
//             throw new Error("Não existia a route "+routeName);
//         }

//     }catch(error: any){
//         // Imprime no console o erro
//         console.log(error);
//     }
// }
export const getRoute = function (routeName:string){
    try{
        var route = routes.find((route) => {
            return route.getName() === routeName
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




