import { ShellController } from "./ShellController.js";
import { MinecraftServer } from "./minecraftServer.js";
export class Controller{
    private servers : MinecraftServer[];
    private shell : ShellController;
    
    constructor(shell : ShellController | undefined = undefined){
        if(shell == undefined) this.shell = new ShellController(ShellController.serverStates.NoServer)
        else this.shell = shell;
        this.servers = [];
    }

    redirectServerOutputToCommandLine() : void{
        this.shell.redirectServerOutputToCommandLine()
    }
    stopredirectServerOutputToCommandLine() : void{
        this.shell.stopredirectServerOutputToCommandLine()
    }

    addServer(server : MinecraftServer) : void{
        this.servers.push(server);
    }
    getServers() : MinecraftServer[]{
        return this.servers;
    }
    getCurrentState() : string{
        return this.shell.getCurrentState()
    }
    async bootUpServer(name: string): Promise<void> {
        for (const server of this.servers) {
            if (server.getName() == name) {
                await this.shell.bootUp(server); // Espera a que termine la operación
                return; // Finaliza la función si se encuentra el servidor
            }
        }
        throw new Error("Couldn't find a server with that name");
    }
    async stopServer(name: string): Promise<void> {
        for (const server of this.servers) {
            if (server.getName() == name) {
                await this.shell.stop(server);
                return;
            }
        }
        throw new Error("Server was not found")
    }

}