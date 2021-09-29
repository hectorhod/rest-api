export class MangoController {
    readonly uri = "mongodb+srv://dbUser:userDB1234@cluster0.qpj9v.mongodb.net/dadosdb?retryWrites=true&w=majority";
    readonly bodyParser = require('body-parser');
    readonly MongoClient = require('mongodb').MongoClient;
    // readonly { ObjectID } = require("bson");

    public MangoStart(){
        this.MongoClient.connect(this.uri, (err: any, client: { db: (arg0: string) => any; }) => {
            if (err) return console.log(err)
            const db = client.db('dadosdb') //Nome do Banco de Dados
        })
    }
}