import * as mongoDB from "mongodb"
import { ObjectId } from "mongodb";

export const collections: {collection?: mongoDB.Collection} = {};
export class MangoController {
    readonly uri:string = "mongodb+srv://dbUser:userDB1234@cluster0.qpj9v.mongodb.net";
    // readonly save = "/dadosdb?retryWrites=true&w=majority"
    readonly bodyParser = require('body-parser');
    private client:mongoDB.MongoClient = new mongoDB.MongoClient(this.uri);
    private db: mongoDB.Db = this.client.db("dadosdb");

    /**
     * MangoConnect
     */
    constructor(){
        this.client.connect()
    }

    public async ConnectCollection(collectionName:string){
        const collection: mongoDB.Collection = this.db.collection(collectionName);
        collections.collection = collection;

        console.log('Acesso ao banco de dados: %s e coleção: %s',this.db.databaseName, collection.collectionName);
    }
}