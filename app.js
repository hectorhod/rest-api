var express = require("express");
var app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require("bson");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const uri = "mongodb+srv://dbUser:userDB1234@cluster0.qpj9v.mongodb.net/dadosdb?retryWrites=true&w=majority";

MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('dadosdb') //Nome do Banco de Dados

    app.listen(3000, () => {
        console.log("Servidor rodando na porta 3000");
    });
})

app.get("/", (req, res, next) =>
{
    db.collection('users').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.json(results)
        console.log("Acesso ao index");
    })
});

app.post('/update/:id', (req,res) => 
{
    var id = req.params.id
    var username = req.body.username
    var email = req.body.email
    const ObjectID = require('mongodb').ObjectId

    db.collection('users').updateOne({_id:ObjectID(id)}, {
        $set: {
            username: username,
            email: email
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.status(200).json("Usuário alterado com sucesso.")
        console.log("Documentto ID:%s alterado com sucesso.", id);
    })
});

app.post('/create', (req, res) =>
{
    const user = req.body
    db.collection('users').insertOne(user, (err, result) => {
        if (err) return res.send(err)
        res.status(200).json('Usuário criado com sucesso.')
        console.log("Usuário criado com sucesso.");
    })
});


app.delete('/delete/:id', (req, res) =>
{
    var id = req.params.id

    db.collection('users').deleteOne({_id: ObjectID(id)}, (err, result) => {
        if (err) return res.send(500, err)
        res.status(200).json('Deletado do Banco de dados!');
        console.log('Documento ID:%s foi deletado do Banco de dados.', id);
    })
});