import { Handler } from "express-serve-static-core";
import { MetadataKeys } from "../Controllers/Decorator/controller.decorator";
import { Api } from "../Controllers/RestController";
import { CommonRoutes } from "./CommonRoutes/CommonRoutes";
import { authenticate, Authentification, IRouter } from "./decorators/routes.decorator";
import { METHOD } from "./utils/method.enum";
export class Routes {
  private _server: Api;
  get server() {
    return this._server;
  }

  private _routes: CommonRoutes[] = [];
  get routes() {
    return this._routes;
  }

  constructor(server: Api, listRoutes: any[]) {
    this._server = server;
    if (listRoutes && listRoutes.length > 0) {
      const info: Array<{ api: string, method: string, origem: string, handler: string }> = [];
      listRoutes.forEach((controllerClass) => {
        const controllerInstance: CommonRoutes = new controllerClass(
          this._server
        );
        const controllerMethods: { [handlerName: string]: Handler } =
          controllerInstance as any;
        const path = Reflect.getMetadata(
          MetadataKeys.BASE_PATH,
          controllerClass
        );
        const routers: IRouter[] = Reflect.getMetadata(
          MetadataKeys.ROUTERS,
          controllerClass
        );

        const authorizations: Authentification[] = Reflect.getMetadata(
          MetadataKeys.AUTHORIZATION,
          controllerClass
        )

        const exRouter = controllerInstance.router;

        if(authorizations){
          let authRoute: CommonRoutes;
          if(controllerInstance.getName() === 'userRest'){
            authRoute = controllerInstance;
          }else{
            authRoute = this.getRoute('userRest')
          }
          authorizations.forEach( function({handlerName, tipoPessoas, descriptor}){
            authenticate(authRoute,descriptor, tipoPessoas);
            console.log(controllerMethods[String(handlerName)].bind(controllerMethods))
            
          })
        }

        if (routers) {
          routers.forEach(({ method, path:routePath, handlerName, middleware, rootPath }) => {
            if (!rootPath) {
              if(middleware){
                exRouter[method as METHOD](
                  routePath,
                  middleware,
                  controllerMethods[String(handlerName)].bind(controllerMethods)
                );
              }else{
                exRouter[method as METHOD](
                  routePath,
                  controllerMethods[String(handlerName)].bind(controllerMethods)
                );
              }
              info.push({api:controllerInstance.getName(), method:method, origem:"localhost:"+server.port, handler:path+routePath})
            } else {
              if(middleware){
                this._server.app[method as METHOD](
                  routePath,
                  middleware,
                  controllerMethods[String(handlerName)].bind(controllerMethods)
                );
              }else{
                this._server.app[method as METHOD](
                  routePath,
                  controllerMethods[String(handlerName)].bind(controllerMethods)
                );
              }
              info.push({api:controllerInstance.getName()+`( root: ${server.serverName} )`, method:method, origem:"localhost:"+server.port, handler:routePath})
            }
          });
        }
        if (path) {
          this._server.app.use(path, exRouter);
        }
        
        this._routes.push(controllerInstance);
      });
      console.table(info);
    }
  }

  public getRoute(routeName: string) {
    if(this._routes){
      var route = this._routes.find((route) => {
        return route.getName() === routeName;
      });
    }

    if (route) {
      return route;
    } else {
      throw new Error("Não existia a route " + routeName);
    }
  }
}



// export {routes};
