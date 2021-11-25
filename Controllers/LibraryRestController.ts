// Realiza a importação dos modulos necessários
import { ObjectId } from "bson";
import { Request, Response } from "express";
import multer from "multer";
import { Livro } from "../Models/Livro/Livro";
import { getCollection } from "../MongoDB/MongoController";
import { PdfInfo, saveArchive } from "../pdfhandler/pdfhandler";
import { routeConfig } from "../Routes/decorators/routes.decorator";
import { METHOD } from "../Routes/utils/method.enum";
import { controller } from "./Decorator/controller.decorator";
import { Api } from "./RestController";
import { LibraryRoutes } from "./Routes/LibraryRoutes";
import * as fs from "fs";

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
        const result: Buffer = await LibraryRestController.getLivroById(id);

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

  // Define um método para o request POST no /biblioteca
  @routeConfig(METHOD.POST, "/", multer().single("pdf"))
  protected async postLivro(req: Request, res: Response) {
    console.log(req.file);
    console.log(req.body);
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
      saveArchive(livro.linkSistema, arquivo);

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
        const biblioteca = req.body as Livro;

        // Renomeia o arquivo undefined e define o linkSistema para o mesmo nome que o usuário criou para o livro
        biblioteca.linkSistema = "/" + biblioteca.nome;
        fs.renameSync('./Livros/undefined.pdf', './Livros/' + biblioteca.nome + '.pdf');
        
        // Cria uma query de pesquisa com o id recebido
        const query = { _id: new ObjectId(id) };

        // Obtem a COLLECTION necessária da lista de collection e tenta atualizar o objeto
        const result = await getCollection("Livros")?.collection?.updateOne(
          query,
          { $set: biblioteca }
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
