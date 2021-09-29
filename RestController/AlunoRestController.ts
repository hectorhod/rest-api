import { app } from "./RestController";

app.get("/aluno", (req: any, res: any, next: any) => {
    console.log("Acesso ao aluno");
    res.status(200).json("Acesso ao aluno")
})