// Realiza a importação dos modulos necessários
import { Express, Router } from "express";
import { ObjectId } from "mongodb";
import { Livro } from "../../Models/Livro/Livro";
import { getCollection } from "../../MongoDB/MongoController";
import { getArchive } from "../../pdfhandler/pdfhandler";
import { CommonRoutes, METHOD, routeConfig } from "../../Routes/CommonRoutes";
import { getRoute } from "../../Routes/Routes";

// Define a classe LibraryRoutes, que controla os caminhos do endereço /aluno
export class LibraryRoutes extends CommonRoutes{
    // Comando herdado para configurar os endereços observados
    configureRoutes(): Router {

        // Define a raiz desse ROUTE no caso sendo /aluno
        this.app.use('/biblioteca', this.router);
        return this.router;
    }
    
    // É um construtor, inicializando a classe pai CommonRoutes
    constructor(app: Express, routeName:string){
        super(app,Router(),routeName);
    }

    // protected getById(uri:string){throw new Error("O método não foi implementado!!!");
    // };

    public static async getLivroById(id:string): Promise<Buffer>{
        try{
            if (id) {
                const query = { _id:new ObjectId(id) };
                const result = await getCollection("Livros")?.collection?.findOne(query) as Livro;
                return getArchive(result.linkSistema);
            }else{
                throw new Error("O id(livro) não foi recebido com sucesso.");
            }
        }catch(error:any){
            throw new Error(`Ocorre um erro na obtenção do pdf ${error}`);
        }
    }

    
}

