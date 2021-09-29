import {Router, Express} from "express";

export abstract class CommonRoutes {
    app: Express
    router: Router;
    name: string;

    constructor(app: Express,router: Router,name: string){
        this.app = app
        this.router = router;
        this.name = name
        this.configureRoutes()
    }

    abstract configureRoutes(): Router;

    
    public getName() : string {
        return this.name
    }

    public getRouter(): Router{
        return this.router;
    }
    
}