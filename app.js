var express = require("express");
var app = express();

app.get("/url", (req, res, next) =>
{
    res.json(["Julio", "Giba", "Xandão", "Miltinho"])
});

app.put('/put/:id', (req,res) => 
{
    console.log("chegou no PUT...");
    res.status(200).send('retorno do PUT');
});

app.post('/post', (req, res) =>
{
    console.log("chegou no POST...");
    res.status(200).json(["Programação", "API", "JSON"]);
});

app.delete('/delete/:id', (req, res) =>
{
    console.log("chegou no DELETE...");
    res.status(200).send('utilização correta do DELETE para excluir');
});

app.listen(3000, () =>
{
    console.log("Servidor rodando na porta 3000");
});