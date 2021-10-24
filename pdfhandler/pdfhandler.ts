import { Console } from 'console';
import { Express } from 'express';
import * as fs from 'fs'
import * as path from 'path'

var PATH= path.join('./livros')


export function getArchive(filepath:string): Buffer{
    try{
        return (fs.readFileSync(PATH+filepath))
    }catch(error: any){
        throw new Error(`Ocorreu uma exceção ao ler arquivo: ${error}`);
    }
}