import * as mongoDB from "mongodb"
import dotenv from "dotenv"

export const collections: [{collection?: mongoDB.Collection, name?:string}] = [{}];
dotenv.config({path: './banco.env'})
export class MangoController {
    readonly uri:string = process.env.BD_CONN_URI as string;
    private client:mongoDB.MongoClient = new mongoDB.MongoClient(this.uri);
    private db: mongoDB.Db = this.client.db((process.env.BD_CONN_NAME as string));

    /**
     * MangoConnect
     */
    constructor(){
        this.client.connect()
    }

    public async ConnectCollection(collectionName:string){
        const collection: mongoDB.Collection = this.db.collection(collectionName);
        collections.push({collection:collection,name:collectionName})

        console.log('Acesso ao banco de dados: %s e coleção: %s',this.db.databaseName, collection.collectionName);
    }

}
export function getCollection(collectionName:string){
    return collections.find((aluno) => {
        return aluno.name === collectionName
    })
}