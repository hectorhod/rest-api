// Realiza a importação dos modulos necessários
import { ObjectId } from "bson";
import { Request, Response } from "express";
import multer from "multer";
import { Livro } from "../Models/Livro/Livro";
import { getCollection } from "../MongoDB/MongoController";
import { PdfInfo, removeArchive, saveArchive } from "../pdfhandler/pdfhandler";
import { routeConfig } from "../Routes/decorators/routes.decorator";
import { METHOD } from "../Routes/utils/method.enum";
import { controller } from "./Decorator/controller.decorator";
import { Api } from "./RestController";
import { LibraryRoutes } from "./Routes/LibraryRoutes";
import * as fs from "fs";
import Materia from "../Models/Materia/Materia";
import { UserRestController } from "./UserRestController";
import { TipoPessoa } from "../Models/Pessoas/TipoPessoa/TipoPessoa";

// Define a classe LibraryRestController, a qual controla os requests recebidos no /biblioteca
@controller("/biblioteca")
export class LibraryRestController extends LibraryRoutes {
  // É um construtor, inicializando a classe pai AlunoRoutes
  constructor(server: Api) {
    super(server, "libraryRest");
  }

  // Define um método para o request GET no /biblioteca
  @routeConfig(METHOD.GET, "/")
  protected async index(req: Request, res: Response) {
    try {
      res.status(200).send(`
          <form method="post" enctype="multipart/form-data">
            <input type = "file" id="pdf" name = "pdf", accept = ".pdf">
            <div>
              <label for="nome">Nome do Livro:. </laber><br>
              <input type = "text" id="nome" name = "nome"><br>
              <label for="nome">Autor do Livro:. </laber><br>
              <input type = "text" id="autor" name = "autor"><br>
              <label for="nome">Volume do Livro:. </laber><br>
              <input type = "text" id="volume" name = "volume"><br>
              <label for="nome">Ano do Livro:. </laber><br>
              <input type = "text" id="ano" name = "ano"><br>
            </div>
            <div>
              <button> submit </button>
            </div>

          </form>
        `);
    } catch (error: any) {
      // Imprime um erro no console
      console.log(error);

      // Devolve uma mensagem para o remetente com o erro e um código de status
      res.status(400).send(error.message);
    }
  }

  @routeConfig(METHOD.GET, "/getLivros")
  protected async get(req: Request, res: Response) {
    try {
      // Obtem a COLLECTION necessária da lista de collection
      const collection = getCollection("Livros");
      if (collection) {
        // Obtém todos os livros do MongoDB
        const livros = (await collection?.collection
          ?.find({})
          .toArray()) as Livro[];
        res.status(200).send(livros);
        console.log("Livros retornado com sucesso");
      } else {
        // Joga um novo erro caso não exista uma collection
        throw new Error("Collections Users estava nulo!");
      }
    } catch (error: any) {
      // Imprime um erro no console
      console.log(error);

      // Devolve uma mensagem para o remetente com o erro e um código de status
      res.status(400).send(error.message);
    }
  }

  // Define um método para o request GET no /biblioteca
  @routeConfig(METHOD.GET, "/id/:id")
  protected async getById(req: Request, res: Response) {
    try {
      if (req.params?.id) {
        //Obtem um id da url
        const id = req.params.id;

        // Cria uma query de pesquisa com o id recebido
        const result: Buffer = await this.getLivroById(id);

        // Exibe o resultado da operação anterior
        if (result) {
          res.contentType("application/pdf");
          res.status(200).send(result);
          console.log(`Pdf encontrado com sucesso com o id: ${{ id }} `);
        } else {
          res.status(500).send("Pdf não foi encontrado.");
          console.log("Pdf não foi encontrado.");
        }
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

  @routeConfig(METHOD.GET, "/getLivrosMateria/:idMateria")
  public async getLivrosMateria(req: Request, res: Response){
    try {
      const materiaCollection = getCollection("Materias");
      const livroCollection = getCollection("Livros");

      const idMateria = new ObjectId(req.params.idMateria);


      const materia = (await materiaCollection?.collection?.findOne({_id: idMateria})) as Materia;
      const livrosMateria: ObjectId[] = materia.livros;
      console.log(livrosMateria)
      const livros = (await livroCollection?.collection?.find({_id: {$in: livrosMateria}}).toArray()) as Livro[]
      
      
      livros
        ? (res
            .status(200)
            .send(livros),
          console.log(
            livros
          ))
        : (res.status(500).send("Materia não foi encontrada"),
          console.log("Materia não foi encontrada"));
    } catch (error: any) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }

  @routeConfig(METHOD.PUT, "/putLivroMateria/:idMateria")
  public async putLivroMateria(req: Request, res: Response){
    try {
      const userRoutes = this.server.routes.getRoute("userRest") as UserRestController

      let validation = await userRoutes.validateUser(req,[TipoPessoa.Diretor, TipoPessoa.Professor])
      if ( !validation.result) {
        throw new Error(`O usuário ${ validation.username} não possuí permissão para utilizar esse método!!`)
      }
      const turmaCollection = getCollection("Materias");

      const idMateria = new ObjectId(req.params.idMateria);
      const idLivro = new ObjectId(req.body.livroID)
      
      const materia = (await turmaCollection?.collection?.findOne({_id: idMateria})) as Materia;
      let tmpLivros = materia.livros ?? [];
      tmpLivros.push(idLivro);
      materia.livros = tmpLivros;      

      let result = turmaCollection?.collection?.updateOne({_id: idMateria}, { $set: materia})
      
      result
        ? (res
            .status(200)
            .send("Materia atualizada com sucesso com o id: " + idMateria.toString()),
          console.log(
            "Materia atualizada com sucesso com o id: " + idMateria.toString()
          ))
        : (res.status(500).send("Materia não foi atualizada com sucesso"),
          console.log("Materia não foi atualizada com sucesso"));
    } catch (error: any) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }

  // Define um método para o request POST no /biblioteca
  @routeConfig(METHOD.POST, "/", multer().single("pdf"))
  protected async postLivro(req: Request, res: Response) {
    try {
      // Cria um objeto Livro utilizando o json recebido no corpo do request
      const livro = req.body as Livro;
      console.log(livro)
      livro.linkSistema = "/" + livro.nome;
      const arquivo = req.file as PdfInfo;

      // Obtem a COLLECTION necessária da lista de collection e tenta inserir o objeto
      const result = await getCollection("Livros")?.collection?.insertOne(
        livro
      );
      saveArchive(livro.linkSistema, result?.insertedId, arquivo);

      // Exibe o resultado da operação anterior
      result
        ? (res
            .status(200)
            .send("Livro criado com sucesso com o id: " + result.insertedId),
          console.log(
            "Livro criado com sucesso com o id: " + result.insertedId
          ))
        : (res.status(500).send("Livro não foi criado com sucesso"),
          console.log("Livro não foi criado com sucesso"));
    } catch (error: any) {
      // Imprime um erro no console
      console.log(error);

      // Devolve uma mensagem para o remetente com o erro e um código de status
      res.status(400).send(error.message);
    }
  }

  // Define um método para o request PUT no /biblioteca
  @routeConfig(METHOD.PUT, "/update/:id")
  protected async updateLivro(req: Request, res: Response) {
    try {
      if (req.params?.id) {
        //Obtem um id da url
        const id = req.params.id;

        // Cria um objeto Livro utilizando o json recebido no corpo do request
        const livro = req.body as Livro;
        
        // Cria uma query de pesquisa com o id recebido
        const query = { _id: new ObjectId(id) };

        // Obtem a COLLECTION necessária da lista de collection e tenta atualizar o objeto
        const result = await getCollection("Livros")?.collection?.updateOne(
          query,
          { $set: livro }
        );

        // Exibe o resultado da operação anterior
        result
          ? (res
              .status(200)
              .send("Livro atualizado com sucesso com o id: " + id),
            console.log("Livro atualizado com sucesso com o id: " + id))
          : (res.status(500).send("Livro não foi atualizado."),
            console.log("Livro não foi atualizado."));
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

  // Define um método para o request DELETE no /biblioteca
  @routeConfig(METHOD.DELETE, "/delete/:id")
  protected async deleteLivro(req: Request, res: Response) {
    try {
      if (req.params.id) {
        //Obtem um id da url
        const id = req.params.id;

        // Cria uma query de pesquisa com o id recebido
        const query = { _id: new ObjectId(id) };

        // Obtem a COLLECTION necessária da lista de collection e tenta remover o objeto
        const result = await getCollection("Livros")?.collection?.deleteOne(
          query
        );

        removeArchive(query._id);

        // Exibe o resultado da operação anterior
        result
          ? (res.status(200).send("Livro removido com sucesso com o id: " + id),
            console.log("Livro removido com sucesso com o id: " + id))
          : (res.status(500).send("Livro não foi removido."),
            console.log("Livro não foi removido."));
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
