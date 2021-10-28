// Realiza a importação dos modulos necessários
import * as mongoDB from "mongodb"
import dotenv from "dotenv"

// Define uma lista constante de COLLECTIONS para todos objetos
export const collections: [{collection?: mongoDB.Collection, name?:string}] = [{}];

// Define as configurações do arquivo "banco.env" para acesso 
dotenv.config({path: './banco.env'});

// Define a classe chamada MongoController, a qual controla a conexão com o MongoDB
export class MongoController {

    // Lê a informação do "banco.env" e obtém a uri para conexão
    private readonly uri:string = process.env.BD_CONN_URI as string;

    // Cria um client para a conexão com o MongoDB
    private client:mongoDB.MongoClient = new mongoDB.MongoClient(this.uri);

    // Lê a informação do "banco.env" e obtém a uri para conexão
    private db: mongoDB.Db = this.client.db(this.getDBName());

    // É o construtor da classe
    constructor(){
        try{
            // Executa a conexão com o MongoDB
            this.client.connect()

            // Imprime no console a conexão realizada
            console.log('Conectado ao banco de dados: %s',this.db.databaseName);
        }catch(error: any){
             // Imprime no console o erro
             console.log(error);
        }

    }

    // Cria e adiciona um objeto COLLECTION na lista de collections
    public async ConnectCollection(collectionName:string){
        try{
            // Realiza a conexão com a collection
            const collection: mongoDB.Collection = this.db.collection(collectionName);

            // Empurra a conexão para a lista de collections
            collections.push({collection:collection,name:collectionName})

            // Imprime no console a conexão realizada
            console.log('Acesso ao banco de dados: %s e coleção: %s',this.db.databaseName, collection.collectionName);

        }catch(error:any){
            // Imprime no console o erro
            console.log(error);
        }
    }

    public async getConnection():Promise<mongoDB.MongoClient>{
        return await this.client.connect();
    }
    public getDBName():string{
        return process.env.BD_CONN_NAME as string;
    }

}
/* É um método para obter a COLLECTION específica da lista de collections conectadas
    utilizando somente do nome da collection necessária */
export function getCollection(collectionName:string){
    // Procura na lista de collections a collection com nome especificado
    try{
        var collection = collections.find((collection) => {
            return collection.name === collectionName
        });
        
        if(collection){
            return collection ;
        }else {
            throw new Error("Não existia a collection "+collectionName);
        }

    }catch(error: any){
        // Imprime no console o erro
        console.log(error);
    }
}