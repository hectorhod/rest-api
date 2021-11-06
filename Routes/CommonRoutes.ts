// Realiza a importação dos modulos necessários
import {Router, Express, Request} from "express";
import { Api } from "../RestController/RestController";
import { getRoute, routes } from "./Routes";

// Define a classe abstrata CommonRoutes, a qual define a base dos caminhos ROUTE
export abstract class CommonRoutes {
    // É o sistema responsável pela ROUTE
    app: Express

    // É o ROUTE do sistema
    router: Router;

    // É o nome do ROUTE
    name: string;

    // É um construtor, definindo a classe construida
    constructor(app: Express,router: Router,name: string){
        this.app = app
        this.router = router;
        this.name = name

        // Executa o método sempre que a classe for construída
        this.configureRoutes();
    }

    // Método abstrato para configurar o ROUTE
    abstract configureRoutes(): Router;

    // Métodos que podem só ser utilizados pelas classes filhas para definir o GET,POST,PUT,DELETE
    protected get(uri:string){throw new Error("O Método não foi implementado!!")};
    protected post(uri:string){throw new Error("O Método não foi implementado!!")};
    protected put(uri:string){throw new Error("O Método não foi implementado!!")};
    protected delete(uri:string){throw new Error("O Método não foi implementado!!")};
    
    // Getters e Setters
    public getName() : string {
        return this.name
    }

    public getRouter(): Router{
        return this.router;
    }
    
}

export enum METHOD{
    GET = "get",
    POST = "post",
    PUT = "put",
    DELETE = "delete",
}

const getRouteTest = function (routeName:string){
    const tmpApi = import('../RestController/RestController').then(({Api}) => Api);

    return tmpApi.then((Api) =>{
        var route = Api.routes.find((route) => {
            return route.getName() === routeName
        });

        if(route){
            return route ;
        }else {
            throw new Error("Não existia a route "+routeName);
        }

    })
}

export function routeConfig (method:METHOD, route:string, routeName: string): MethodDecorator {
    const router = getRouteTest(routeName)
    if(router != null && !router){
        throw new Error("O router não foi encontrado");        
    }
    return function(
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ){
        const response = (req: Request, res: any) => {
            const original = descriptor.value(req,res)
            // res.status(200).json(original)
        }

        router.then((router) => {
            router.getRouter()[method](route,response)
        })
        // route[method](route,response);
    }
}