import * as mongoDB from "mongodb"
import { ObjectId } from "mongodb";

export const collections: {users?: mongoDB.Collection} = {};
export class MangoController {
    readonly uri:string = "mongodb+srv://dbUser:userDB1234@cluster0.qpj9v.mongodb.net";
    // readonly save = "/dadosdb?retryWrites=true&w=majority"
    readonly bodyParser = require('body-parser');

    /**
     * MangoConnect
     */
    public async MangoConnect() {        
        const client: mongoDB.MongoClient = new mongoDB.MongoClient(this.uri);
        await client.connect();
        const db: mongoDB.Db = client.db("dadosdb");
        const usersCollection: mongoDB.Collection = db.collection("Alunos");
        collections.users = usersCollection;

        console.log('Acesso ao banco de dados: %s e coleção: %s',db.databaseName, usersCollection.collectionName);

    }
}