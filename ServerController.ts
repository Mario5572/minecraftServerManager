import { spawn, exec, execFile, fork } from 'child_process';
import { MinecraftServer } from './minecraftServer';

export class ServerController {
    private currentState: string; // Possible values: "ServerUp", "LoadingServer", "NoServer"
    private runningServer: MinecraftServer; //In case of the current state being ServerUp or LoadingServer, runningServer will contain the server being runned

    constructor(initialState: string = "NoServer", servers: MinecraftServer[] = []) {
        this.currentState = initialState;
    }

    // Método para representar el estado del controlador como una cadena
    toString(): string {
        return `ServerController: {
                currentState: "${this.currentState}",
                serverUp: ${this.runningServer} 
                }`;
    }
}
