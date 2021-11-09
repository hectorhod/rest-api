import { RequestHandler, ParamsDictionary } from "express-serve-static-core";
import "reflect-metadata";
import { MetadataKeys } from "../../Controllers/Decorator/controller.decorator";
import { METHOD } from "../utils/method.enum";

export function routeConfig(
  method: METHOD,
  route: string,
  middleware?: RequestHandler<ParamsDictionary, any, any, Record<string, any>>,
  root?: boolean
): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    if (!root) {
      root = false;
    }
    const controllerClass = target.constructor;
    const routers: IRouter[] = Reflect.hasMetadata(
      MetadataKeys.ROUTERS,
      controllerClass
    )
      ? Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass)
      : [];
    routers.push({
      method,
      path: route,
      handlerName: propertyKey,
      middleware: middleware,
      rootPath: root,
    });
    Reflect.defineMetadata(MetadataKeys.ROUTERS, routers, controllerClass);
  };
}

export interface IRouter {
  method: METHOD;
  path: string;
  handlerName: string | symbol;
  middleware?: RequestHandler<ParamsDictionary, any, any, Record<string, any>>,
  rootPath: boolean;
}
