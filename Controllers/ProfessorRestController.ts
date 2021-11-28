// Realiza a importação dos modulos necessários
import { ObjectID, ObjectId } from "bson";
import { Request, Response } from "express";
import { Atividade } from "../Models/Atividade/Atividade";
import Materia from "../Models/Materia/Materia";
import { Professor } from "../Models/Pessoas/Professor";
import { TipoPessoa } from "../Models/Pessoas/TipoPessoa/TipoPessoa";
import { User } from "../Models/Pessoas/User";
import { Turma } from "../Models/Turma/Turma";
import { getCollection } from "../MongoDB/MongoController";
import { routeConfig } from "../Routes/decorators/routes.decorator";
import { METHOD } from "../Routes/utils/method.enum";
import { controller } from "./Decorator/controller.decorator";
import { Api } from "./RestController";
import { ProfessorRoutes } from "./Routes/ProfessorRoutes";
import { UserRestController } from "./UserRestController";

// Define a classe ProfessorRestController, a qual controla os requests recebidos no /professor
@controller("/professor")
export class ProfessorRestController extends ProfessorRoutes {
  // É um construtor, inicializando a classe pai ProfessorRoutes
  constructor(server: Api) {
    super(server, "professorRest");
  }

  // Define um método para o request GET no /professor
  @routeConfig(METHOD.GET, "/")
  protected async get(req: Request, res: Response) {
    try {
      // Obtem a COLLECTION necessária da lista de collection
      const collection = getCollection("Professors");
      if (collection) {
        // Obtém todos os professors do MongoDB
        const professors = (await collection?.collection
          ?.find({})
          .toArray()) as Professor[];

        // Devolve uma mensagem para o remetente com os professors e um código de status
        res.status(200).send(professors);
        console.log("Professors retornado com sucesso");
      } else {
        // Joga um novo erro caso não exista uma collection
        throw new Error("Collections Professor estava nulo!");
      }
    } catch (error: any) {
      // Imprime um erro no console
      console.log(error);

      // Devolve uma mensagem para o remetente com o erro e um código de status
      res.status(400).send(error.message);
    }
  }

  @routeConfig(METHOD.GET, "/getMaterias")
  public async getMaterias(req: Request, res: Response) {
    try {
      const collection = getCollection("Turmas");
      const materiaCollection = getCollection("Materias");

      const userRoutes = this.server.routes.getRoute(
        "userRest"
      ) as UserRestController;

      let validation = await userRoutes.validateUser(req, [
        TipoPessoa.Professor,
      ]);
      console.log(validation);
      if (!validation.result) {
        res
          .status(400)
          .send(
            `<p><h2>Acesso Negado !!</h2></p>\n<p><h4>O usuário ${validation?.username} não tem permissão o suficiente para acessar essa página</h4></p>`
          );
        return;
      }
      const user = await userRoutes.getUserByUsername(validation.username);

      const materiasProfessor = (await materiaCollection.collection
        .find({ professor: user.pessoa })
        .toArray()) as Materia[];

      if (materiasProfessor) {
        res.status(200).send(materiasProfessor);
        console.log("Materias retornadas com sucesso");
      } else {
        res.status(500).send("Materia não foi adquirida com sucesso")
        console.log("Materia não foi adquirida com sucesso");
      }
      
    } catch (error: any) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }

  // Define um método para o request POST no /professor
  @routeConfig(METHOD.POST, "/")
  protected async post(req: Request, res: Response) {
    try {
      // Cria um objeto Professor utilizando o json recebido no corpo do request
      const professor = req.body as Professor;

      // Obtem a COLLECTION necessária da lista de collection e tenta inserir o objeto
      const result = await getCollection("Professors")?.collection?.insertOne(
        professor
      );

      // Exibe o resultado da operação anterior
      result
        ? (res
            .status(200)
            .send("Professor criado com sucesso com o id " + result.insertedId),
          console.log(
            "Professor criado com sucesso com o id " + result.insertedId
          ))
        : (res.status(500).send("Professor não foi criado com sucesso"),
          console.log("Professor não foi criado com sucesso"));
    } catch (error: any) {
      // Imprime um erro no console
      console.log(error);

      // Devolve uma mensagem para o remetente com o erro e um código de status
      res.status(400).send(error.message);
    }
  }

  // Define um método para o request POST no /user
  @routeConfig(METHOD.POST, "/user")
  protected async postUser(req: Request, res: Response) {
    try {
      var route = this.server.routes.getRoute("userRest") as UserRestController;
      if (req.body && route) {
        let professorCollection = getCollection("Professors");

        (await route.validateEmail(req.body.email)) ?? false;
        (await route.validateUsername(req.body.username)) ?? false;

        var professor: Professor = new Professor(
          req.body.username,
          req.body.idade,
          req.body.cpf
        );

        let resultProfessor =
          professorCollection?.collection?.insertOne(professor);
        if (!resultProfessor) {
          throw new Error("Ocorreu um erro ao criar o professor");
        }

        var result: User = await route.createUser(
          req.body.username,
          req.body.password,
          req.body.email,
          professor._id,
          TipoPessoa.Professor,
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
  @routeConfig(METHOD.POST, "/postAtividade")
  protected async postAtividade(req: Request, res: Response) {
    try {
      const atividade = req.body as Atividade;
      atividade.materia = new ObjectID(req.body.materia);
      const result = await getCollection("Atividades")?.collection?.insertOne(
        atividade
      );
      result
        ? (res
            .status(200)
            .send("Atividade criada com sucesso com o id " + result.insertedId),
          console.log(
            "Atividade criada com sucesso com o id " + result.insertedId
          ))
        : (res.status(500).send("Atividade não foi criada com sucesso"),
          console.log("Atividade não foi criada com sucesso"));
    } catch (error: any) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }

  // Define um método para o request PUT no /professor
  @routeConfig(METHOD.PUT, "/update/:id")
  protected async put(req: Request, res: Response) {
    try {
      if (req.params?.id) {
        //Obtem um id da url
        const id = req.params.id;

        // Cria um objeto Professor utilizando o json recebido no corpo do request
        const professor = req.body as Professor;

        // Cria uma query de pesquisa com o id recebido
        const query = { _id: new ObjectId(id) };

        // Obtem a COLLECTION necessária da lista de collection e tenta atualizar o objeto
        const result = await getCollection("Professors")?.collection?.updateOne(
          query,
          { $set: professor }
        );

        // Exibe o resultado da operação anterior
        result
          ? (res
              .status(200)
              .send("Professor atualizado com sucesso com o id " + id),
            console.log("Professor atualizado com sucesso com o id " + id))
          : (res.status(500).send("Professor não foi atualizado."),
            console.log("Professor não foi atualizado."));
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
