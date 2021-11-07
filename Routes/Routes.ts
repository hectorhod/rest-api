import { Express } from "express";
import { Handler } from "express-serve-static-core";
import { AlunoRestController } from "../RestController/AlunoRestController";
import { DiretorRestController } from "../RestController/DiretorRestController";
import { LibraryRestController } from "../RestController/LibraryRestController";
import { LoginRestController } from "../RestController/LoginRestController";
import { ProfessorRestController } from "../RestController/ProfessorRestController";
import { Api, controllers } from "../RestController/RestController";
import { UserRestController } from "../RestController/UserRestController";
import { CommonRoutes } from "./CommonRoutes";
import { MetadataKeys } from "./controller.decorator";
import { METHOD } from './method.enum';
import { IRouter } from "./routes.decorator";


// const routes:Array<CommonRoutes> = [
//     new AlunoRestController(Api.app),
//     new ProfessorRestController(Api.app),
//     new DiretorRestController(Api.app),
//     new LibraryRestController(Api.app),
//     new UserRestController(Api.app),
//     new LoginRestController(Api.app)
// ];

export class Routes{
    private _server:Api;
    get server(){
        return this._server;
    }

    private _routes: CommonRoutes[] = [];
    get routes(){
        return this._routes;
    }

    constructor(server:Api){
        this._server = server;
        const info: Array<{api: string, handler: string}> = [];
        controllers.forEach((controllerClass) =>{
            const controllerInstance: CommonRoutes = new controllerClass(this._server);
            const controllerMethods: { [handlerName: string]: Handler} = controllerInstance as any
            const path = Reflect.getMetadata(MetadataKeys.BASE_PATH, controllerClass);
            const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass);
            const exRouter = controllerInstance.router

            if(routers){
                routers.forEach(({method, path, handlerName, rootPath}) => {
                    if(!rootPath){
                        exRouter[method as METHOD](path, controllerMethods[String(handlerName)].bind(controllerMethods));
                    }else{
                        this._server.app[method as METHOD](path, controllerMethods[String(handlerName)].bind(controllerMethods))
                    }
                });
            }
            if(path){
                this._server.app.use(path, exRouter)
            }
            this._routes.push(controllerInstance)  

        })
    }

    public getRoute(routeName:string){
        var route = this._routes.find((route) => {
            return route.getName() === routeName
        });
        
        if(route){
            return route ;
        }else {
            throw new Error("Não existia a route "+routeName);
        }
    }
}



// export {routes};


