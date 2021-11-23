import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { TipoPessoa } from "../../Models/Pessoas/TipoPessoa/TipoPessoa";
import { HashIt, User } from "../../Models/Pessoas/User";
import { getCollection } from "../../MongoDB/MongoController";
import { CommonRoutes } from "../../Routes/CommonRoutes/CommonRoutes";
import { validateEmail } from "../LoginRestController";
import { Api } from "../RestController";

export abstract class UserRoutes extends CommonRoutes {
  constructor(server: Api, name: string) {
    super(server, Router(), name);
  }

  protected abstract getById(req: Request, res: Response): void;
  protected abstract getByUsername(req: Request, res: Response): void;

  protected async getListUsername(): Promise<string[]> {
    var users = await this.getAllUsers();
    var usernames: string[] = [];
    users.forEach((user) => {
      usernames.push(user.username);
    });

    return usernames;
  }

  protected async getListEmail(): Promise<string[]> {
    var users = await this.getAllUsers();
    var usernames: string[] = [];
    users.forEach((user) => {
      usernames.push(user.email);
    });

    return usernames;
  }

  protected async getAllUsers() {
    const collection = getCollection("Users");
    if (collection) {
      // Obtém todos os users do MongoDB
      const users = (await collection?.collection
        ?.find({})
        .toArray()) as User[];
      return users;
    } else {
      // Joga um novo erro caso não exista uma collection
      throw new Error("Collections Users estava nulo!");
    }
  }

  public async getUserById(id: string): Promise<User> {
    const result = await this.queryUser(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      id
    );
    return result;
  }

  public async getUserByUsername(username: string | undefined): Promise<User> {
    if (username) {
      const result = await this.queryUser(username);
      return result;
    } else {
      throw new Error("o username é nulo!!");
    }
  }

  public async getUserByEmail(email1: string): Promise<User> {
    const result = await this.queryUser(undefined, undefined, email1);
    return result;
  }

  public async validateUsername(username:string):Promise<boolean>{
    var listUsername = await this.getListUsername();
    if (listUsername.includes(username)) {
      throw new Error("O username já existe no sistema!!");
    }
    return true;

  }

  public async validateEmail(email: string):Promise<boolean>{
    var listEmail = await this.getListEmail();
    if(!validateEmail(email)){
      throw new Error("O email inserido é invalido!!");
    }
    if (listEmail.includes(email)) {
      throw new Error("O email já existe no sistema!!");
    }
    return true;
  }

  public async createUser(
    username: string,
    password: string,
    email: string,
    pessoa: ObjectId,
    tipoPessoa: TipoPessoa | undefined,
    active: boolean
  ): Promise<User> {
    try {

      // Cria um objeto User utilizando o json recebido no corpo do request
      const user = new User(
        username,
        password,
        email,
        pessoa,
        tipoPessoa,
        active
      );
      user.password = await HashIt(user.password);

      // Obtem a COLLECTION necessária da lista de collection e tenta inserir o objeto
      const result = await getCollection("Users")?.collection?.insertOne(user);
      return user;
    } catch (error: any) {
      throw new Error(`Ocorreu um erro ao criar um usuario: ${error}`);
    }
  }

  public async activateUser(id: string): Promise<boolean> {
    try {
      const user = await this.queryUser(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        id
      );
      if (!user.active) {
        user.active = true;
        return true;
      } else {
        throw new Error("O usuário já estava ativado!!");
      }
    } catch (error: any) {
      throw new Error(`Ocorreu um erro ao tentar ativar o usuário: ${error}`);
    }
  }

  public validateUser(user: User, required: TipoPessoa): boolean {
    if (user.active && user.tipoPessoa && user.tipoPessoa === required) {
      return true;
    } else {
      return false;
    }
  }

  protected async queryUser(
    username?: string,
    password?: string,
    email?: string,
    pessoa?: string,
    tipoPessoa?: TipoPessoa | undefined,
    active?: boolean,
    id?: string
  ): Promise<User> {
    try {
      // let query = {_id: id,username:username, password: password, email: email, pessoa: pessoa, tipoPessoa: tipoPessoa, active: active};
      let query = {} as User;
      if (username) {
        query.username = username;
      }
      if (password) {
        query.password = password;
      }
      if (email) {
        query.email = email;
      }
      if (pessoa) {
        query.pessoa = new ObjectId(pessoa);
      }
      if (tipoPessoa) {
        query.tipoPessoa = tipoPessoa;
      }
      if (active) {
        query.active = active;
      }
      if (id) {
        query._id = new ObjectId(id);
      }

      if (query) {
        const result: User = (await getCollection("Users")?.collection?.findOne(
          query
        )) as User;
        return result;
      } else {
        throw new Error("Ocorreu um erro ao obter a query");
      }
    } catch (error: any) {
      throw new Error(`Ocorreu um erro ao obter o objeto: ${error}`);
    }
  }
}
