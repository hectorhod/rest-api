import { collections, MangoController } from "./MangoDB/MangoController";
import { Aluno } from "./Models/Pessoas/Aluno";
import { ApiStart } from "./RestController/RestController";
import * as mongoDB from "mongodb"

const mongo:MangoController = new MangoController();

mongo.ConnectCollection("Alunos");
mongo.ConnectCollection("Users");

// console.log(c)
// function isAlunos(aluno:{collection?: mongoDB.Collection, name?:string}){
//     return aluno.name === "Alunos"
// }
// console.log(c.find(isAlunos));

ApiStart();

