import {
  RequestHandler,
  ParamsDictionary,
  Handler,
} from "express-serve-static-core";
import "reflect-metadata";
import { MetadataKeys } from "../../Controllers/Decorator/controller.decorator";
import { Request, Response } from "express";
import { Api, getServer } from "../../Controllers/RestController";
import { UserRestController } from "../../Controllers/UserRestController";
import { TipoPessoa } from "../../Models/Pessoas/TipoPessoa/TipoPessoa";
import { CommonRoutes } from "../CommonRoutes/CommonRoutes";
import { Routes } from "../Routes";
import { METHOD } from "../utils/method.enum";
import { promisify } from "util";

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

export function compareAuthentification(
  listaTipoPessoa: TipoPessoa[]
): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const controllerClass = target.constructor;
    const authentications: Authentification[] = Reflect.hasMetadata(
      MetadataKeys.AUTHORIZATION,
      controllerClass
    )
      ? Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass)
      : [];

    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const getRoute = promisify(getServer('apprender').routes.getRoute)
      console.log(getRoute.toString())
      // const validateUser = promisify((await getRoute('userRest') as UserRestController).validateUser);
      let req = args[0];
      let res = args[1];
      // let validation = await validateUser(req, listaTipoPessoa);
      // if (!validation.result) {
      //   res
      //     .status(400)
      //     .send(
      //       `<p><h2>Acesso Negado !!</h2></p>\n<p><h4>O usuário ${validation?.username} não tem permissão o suficiente para acessar essa página</h4></p>`
      //     );
      //   return;
      // }
      if (req) {
      }

      const result = original.apply(this, args);
      return result;
    };

    authentications.push({
      tipoPessoas: listaTipoPessoa,
      handlerName: propertyKey,
      descriptor: descriptor,
    });

    Reflect.defineMetadata(
      MetadataKeys.AUTHORIZATION,
      authentications,
      controllerClass
    );
  };
}

export const authenticate = (
  route: CommonRoutes,
  method: PropertyDescriptor,
  tipoPessoas: TipoPessoa[]
) => {
  const userController = route as UserRestController;
  // const original = method.value
  // method.value = function (...args:any[]){
  //   var a = args.map(function(req,res){console.log(req,res); return 0;}).join()
  //   const result = original.apply(this,args);
  //   console.log(a)
  //   return result
  // }
  // console.log(method.value.toString())

  // const req = method.arguments.req;
  // const res = method.arguments.res;
  // let validation = userController.validateUser(req, tipoPessoas )
  // if (!validation.result) {
  //   res
  //     .status(400)
  //     .send(
  //       `<p><h2>Acesso Negado !!</h2></p>\n<p><h4>O usuário ${validation?.username} não tem permissão o suficiente para acessar essa página</h4></p>`
  //     );
  //   return;
  // }
};

export interface IRouter {
  method: METHOD;
  path: string;
  handlerName: string | symbol;
  middleware?: RequestHandler<ParamsDictionary, any, any, Record<string, any>>;
  rootPath: boolean;
}

export interface Authentification {
  tipoPessoas: TipoPessoa[];
  handlerName: string | symbol;
  descriptor: PropertyDescriptor;
}
