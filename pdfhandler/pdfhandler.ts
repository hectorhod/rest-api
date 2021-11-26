import { ObjectId } from "bson";
import * as fs from "fs";
import * as path from "path";
import { Stream } from "stream";
import { Api } from "../Controllers/RestController";

var PATH = path.join("./livros");

export async function getArchive(idLivro: ObjectId): Promise<any> {
  try {
    var cursor = await Api.mongo.bucket
      .find({ metadata: { field: "idLivro", value: idLivro } })
      .toArray();
    // console.log(cursor)
    
    if(cursor && cursor.length == 1){
      var result;

      let stream = Api.mongo.bucket.openDownloadStream(cursor[0]._id);
      let concat: any[] = [];
      stream.on("data", (data) => {
        concat.push(data);
      });

      var end = new Promise(function(resolve,reject){
        stream.on('end', () =>{resolve(Buffer.concat(concat))})
      })

      result = await end;
      console.log(result)
      return result;
    }

  } catch (error: any) {
    throw new Error(`Ocorreu uma exceção ao ler arquivo: ${error}`);
  }
}

export async function removeArchive(idLivro: ObjectId){
  try {
    var cursor = await Api.mongo.bucket
      .find({ metadata: { field: "idLivro", value: idLivro } })
      .toArray();
    
    if(cursor && cursor.length == 1){

      let result = await Api.mongo.bucket.delete(cursor[0]._id);
      console.log('livro removido do banco de dados')
      return result;
    }

  } catch (error: any) {
    throw new Error(`Ocorreu uma exceção ao ler arquivo: ${error}`);
  }
}

export interface PdfInfo {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: Number;
}

export function saveArchive(
  filepath: string,
  idLivro: ObjectId | undefined,
  info: PdfInfo
) {
  try {
    if (idLivro) {
      var bufferStream = new Stream.PassThrough();
      bufferStream.end(info.buffer);
      console.log(info.buffer);
      bufferStream.pipe(
        Api.mongo.bucket.openUploadStream(filepath, {
          chunkSizeBytes: 1048576,
          metadata: { field: "idLivro", value: idLivro },
        })
      );
    }
    console.log(`Arquivo ${info.fieldname} salvo com sucesso`);
  } catch (error: any) {
    throw new Error(`Ocorreu uma exceção ao salvar arquivo: ${error}`);
  }
}
