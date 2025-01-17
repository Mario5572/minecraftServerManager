import { consoleLoop } from "./commandHandler.js";
import { Controller } from './Controller.js';
import { runServer } from "../web/app.mjs";

const controller : Controller = new Controller();
await runServer() 
consoleLoop(controller)