import { exec } from "child_process";
import { ShellController } from "./ShellController.js";
import { MinecraftServer } from "./minecraftServer.js";
import { readFile } from 'fs/promises';
import { askQuestion } from "./askQuestion.js";

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
    getRunningServer() : MinecraftServer | null{
        return this.shell.getRunningServer();
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
    async introCommand(){
        if(this.getCurrentState() != ShellController.serverStates.ServerUp){
            throw new Error("There is no server running, cant introduce a command")
        }
        const wasRedirecting = this.shell.getIsRedirectingToCommandLine()
        this.stopredirectServerOutputToCommandLine()
        const command = await askQuestion("Enter the command to introduce: ")
        if (wasRedirecting) this.redirectServerOutputToCommandLine()
    }
    async loadServersFromJson(fileToReadpath : string = './servers.json'){
        const data = await readFile(fileToReadpath, 'utf-8');
        const dataJson = JSON.parse(data)
        const servers : MinecraftServer[] = [] 
        for (const server of dataJson) {
            try{
                servers.push(MinecraftServer.createMinecraftServerFromJson(server))
            }
            catch(error : any){
                console.log("Error parsing the json: ",error.message)
            }
        }
        this.servers = servers;
    }
    getServersObject() : Object[]{
        const servers = []
        for(const server of this.servers){
            let state = "offline"
            if(this.getRunningServer() == server){
                if(this.getCurrentState() == ShellController.serverStates.ServerUp) state = "online"
                if(this.getCurrentState() == ShellController.serverStates.LoadingServer) state = "loading"
            }
            servers.push({
                name: server.getName(),
                maxPlayers: server.getMaxPlayers(),
                version: server.getVersion(),
                executablePath: server.getExecutablePath(),
                maxTimeToBootUp: server.getMaxTimeToBootUp(),
                state : state
            })
        }
        return servers;
    }

}