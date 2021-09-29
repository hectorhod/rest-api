import express from "express";
import { AlunoRoutes } from "./RoutesControllers/AlunoRoutes";
const PORT = 3000;
const bodyParser = require('body-parser');
const app = express();
const aluno = new AlunoRoutes(app);

export function ApiStart(){
    app.use(bodyParser.json());
    app.use(express.urlencoded({extended: false}));
    app.listen(PORT, () => {
        console.log("Servidor rodando na porta " + PORT);
    });
}

app.get("/", (req: any, res: any, next: any) => {
    console.log("Acesso ao base");
    res.status(200).json("Acesso ao base")
})

export{app};