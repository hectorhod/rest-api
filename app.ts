import { MangoController } from "./MangoDB/MangoController";
import { ApiStart } from "./RestController/RestController";
var mango = new MangoController();

mango.MangoStart();
ApiStart();

