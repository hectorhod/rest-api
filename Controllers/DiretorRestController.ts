// Realiza a importação dos modulos necessários
import { ObjectId } from "bson";
import { Request, Response } from "express";
import Materia from "../Models/Materia/Materia";
import { Diretor } from "../Models/Pessoas/Diretor";
import { TipoPessoa } from "../Models/Pessoas/TipoPessoa/TipoPessoa";
import { User } from "../Models/Pessoas/User";
import { Turma } from "../Models/Turma/Turma";
import { getCollection } from "../MongoDB/MongoController";
import { routeConfig } from "../Routes/decorators/routes.decorator";
import { METHOD } from "../Routes/utils/method.enum";
import { controller } from "./Decorator/controller.decorator";
import { Api } from "./RestController";
import { DiretorRoutes } from "./Routes/DiretorRoutes";
import { UserRestController } from "./UserRestController";

// Define a classe ProfessorRestController, a qual controla os requests recebidos no /diretor
@controller("/diretor")
export class DiretorRestController extends DiretorRoutes {
  // É um construtor, inicializando a classe pai ProfessorRoutes
  constructor(server: Api) {
    super(server, "diretorRest");
  }

  // Define um método para o request GET no /professor
  @routeConfig(METHOD.GET, "/")
  public async get(req: Request, res: Response) {
    try {
      // Obtem a COLLECTION necessária da lista de collection
      const collection = getCollection("Diretors");
      if (collection) {
        // Obtém todos os diretors do MongoDB
        const diretors = (await collection?.collection
          ?.find({})
          .toArray()) as Diretor[];

        // Devolve uma mensagem para o remetente com os diretors e um código de status
        res.status(200).send(diretors);
        console.log("Diretors retornado com sucesso");
      } else {
        // Joga um novo erro caso não exista uma collection
        throw new Error("Collections Diretor estava nulo!");
      }
    } catch (error: any) {
      // Imprime um erro no console
      console.log(error);

      // Devolve uma mensagem para o remetente com o erro e um código de status
      res.status(400).send(error.message);
    }
  }

  // Define um método para o request POST no /professor
  @routeConfig(METHOD.POST, "/")
  public async post(req: Request, res: Response) {
    try {
      // Cria um objeto Diretor utilizando o json recebido no corpo do request
      const professor = req.body as Diretor;

      // Obtem a COLLECTION necessária da lista de collection e tenta inserir o objeto
      const result = await getCollection("Diretors")?.collection?.insertOne(
        professor
      );

      // Exibe o resultado da operação anterior
      result
        ? (res
            .status(200)
            .send("Diretor criado com sucesso com o id: " + result.insertedId),
          console.log(
            "Diretor criado com sucesso com o id: " + result.insertedId
          ))
        : (res.status(500).send("Diretor não foi criado com sucesso"),
          console.log("Diretor não foi criado com sucesso"));
    } catch (error: any) {
      // Imprime um erro no console
      console.log(error);

      // Devolve uma mensagem para o remetente com o erro e um código de status
      res.status(400).send(error.message);
    }
  }

  @routeConfig(METHOD.POST, "/postTurma")
  public async postTurma(req: Request, res: Response) {
    try {
      const turma = req.body as Turma;
      const result = await getCollection("Turmas")?.collection?.insertOne(turma);
      result
        ? (res
            .status(200)
            .send("Turma criada com sucesso com o id: " + result.insertedId),
          console.log(
            "Turma criada com sucesso com o id: " + result.insertedId
          ))
        : (res.status(500).send("Turma não foi criada com sucesso"),
          console.log("Turma não foi criada com sucesso"));
    } catch (error: any) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }

  @routeConfig(METHOD.POST, "/postMateria")
  public async postMateria(req: Request, res: Response) {
    try {
      const materia = req.body as Materia;
      materia.professor = new ObjectId(req.body.professor);
      materia.turma = new ObjectId(req.body.turma);
      const result = await getCollection("Materias")?.collection?.insertOne(materia);
      result
        ? (res
            .status(200)
            .send("Materia criada com sucesso com o id: " + result.insertedId),
          console.log(
            "Materia criada com sucesso com o id: " + result.insertedId
          ))
        : (res.status(500).send("Materia não foi criada com sucesso"),
          console.log("Materia não foi criada com sucesso"));
    } catch (error: any) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }

  // Define um método para o request POST no /user
  @routeConfig(METHOD.POST, "/user")
  protected async postUser(req: Request, res: Response) {
    try {
      var route = this.server.routes.getRoute("userRest") as UserRestController;
      if (req.body && route) {
        var result: User = await route.createUser(
          req.body.username,
          req.body.password,
          req.body.email,
          req.body.pessoa,
          TipoPessoa.Diretor,
          false
        );

        // Exibe o resultado da operação anterior
        result
          ? (res
              .status(200)
              .send("User criado com sucesso com o id " + result._id),
            console.log("User criado com sucesso com o id " + result._id))
          : (res.status(500).send("User não foi criado com sucesso"),
            console.log("User não foi criado com sucesso"));
      } else {
        throw new Error("O payload ou route veio vazio!!");
      }
    } catch (error: any) {
      // Imprime um erro no console
      console.log(error);

      // Devolve uma mensagem para o remetente com o erro e um código de status
      res.status(400).send(error.message);
    }
  }

  // Define um método para o request PUT no /professor
  @routeConfig(METHOD.PUT, "/update/:id")
  public async put(req: Request, res: Response) {
    try {
      if (req.params?.id) {
        //Obtem um id da url
        const id = req.params.id;

        // Cria um objeto Diretor utilizando o json recebido no corpo do request
        const professor = req.body as Diretor;

        // Cria uma query de pesquisa com o id recebido
        const query = { _id: new ObjectId(id) };

        // Obtem a COLLECTION necessária da lista de collection e tenta atualizar o objeto
        const result = await getCollection("Diretors")?.collection?.updateOne(
          query,
          { $set: professor }
        );

        // Exibe o resultado da operação anterior
        result
          ? (res
              .status(200)
              .send("Diretor atualizado com sucesso com o id: " + id),
            console.log("Diretor atualizado com sucesso com o id: " + id))
          : (res.status(500).send("Diretor não foi atualizado."),
            console.log("Diretor não foi atualizado."));
      } else {
        throw new Error("A requisição não pode ser concluida pela falta do ID");
      }
    } catch (error: any) {
      // Imprime um erro no console
      console.log(error);

      // Devolve uma mensagem para o remetente com o erro e um código de status
      res.status(400).send(error.message);
    }
  }

  // Define um método para o request DELETE no /professor
  @routeConfig(METHOD.DELETE, "/delete/:id")
  public async delete(req: Request, res: Response) {
    try {
      if (req.params.id) {
        //Obtem um id da url
        const id = req.params.id;

        // Cria uma query de pesquisa com o id recebido
        const query = { _id: new ObjectId(id) };

        // Obtem a COLLECTION necessária da lista de collection e tenta remover o objeto
        const result = await getCollection("Diretors")?.collection?.deleteOne(
          query
        );

        // Exibe o resultado da operação anterior
        result
          ? (res
              .status(200)
              .send("Diretor removido com sucesso com o id " + id),
            console.log("Diretor removido com sucesso com o id " + id))
          : (res.status(500).send("Diretor não foi removido."),
            console.log("Diretor não foi removido."));
      } else {
        throw new Error("A requisição não pode ser concluida pela falta do ID");
      }
    } catch (error: any) {
      // Imprime um erro no console
      console.log(error);

      // Devolve uma mensagem para o remetente com o erro e um código de status
      res.status(400).send(error.message);
    }
  }
}
