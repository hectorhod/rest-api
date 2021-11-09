import * as fs from "fs";
import * as path from "path";

var PATH = path.join("./livros");

export function getArchive(filepath: string): Buffer {
  try {
    return fs.readFileSync(PATH + filepath);
  } catch (error: any) {
    throw new Error(`Ocorreu uma exceção ao ler arquivo: ${error}`);
  }
}

export interface PdfInfo{
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: Number;
}



export function saveArchive(filepath: string, info: PdfInfo){
  try {
    fs.writeFileSync(PATH + filepath + '.pdf',info.buffer);
    console.log(`Arquivo ${path} salvo com sucesso`)
  } catch (error: any) {
    throw new Error(`Ocorreu uma exceção ao salvar arquivo: ${error}`);
  }
}
