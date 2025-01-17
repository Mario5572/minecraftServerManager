import { spawn, ChildProcessWithoutNullStreams} from 'child_process';
import { MinecraftServer } from './minecraftServer.js';

const isWindows = true;
let prefix = 'sh';
if(isWindows){
    prefix = 'wsl.exe';
}
export class ShellController {
    static serverStates = {
        ServerUp: 'ServerUp',
        LoadingServer: 'LoadingServer',
        ShuttingDownServer: 'ShuttingDownServer',
        NoServer: 'NoServer',
    };
    static serverUpChecker : string = 'XA1231324';
    private currentState: string; // Possible values: "ServerUp", "LoadingServer", "NoServer", "ShuttingDownServer"
    private runningServer: MinecraftServer | null; //In case of the current state being ServerUp or LoadingServer, runningServer will contain the server being runned
    private shell : ChildProcessWithoutNullStreams | null = null
    private isRedirectingToCommandLine : Boolean;

    constructor(initialState: string = ShellController.serverStates.NoServer) {
        this.currentState = initialState;
        this.shell = spawn(prefix)
        this.runningServer = null
        this.isRedirectingToCommandLine = false
    }

    async bootUp(server: MinecraftServer) : Promise<void>{
        if(this.currentState == ShellController.serverStates.ServerUp) throw new Error('There is a server Running, cant boot up')
        if(this.currentState == ShellController.serverStates.LoadingServer) throw new Error('There is a server being loaded, cant boot up')
        if(this.currentState == ShellController.serverStates.ShuttingDownServer) throw new Error('There is a server being shut down, cant boot up')
        // We can assume there is No server being run
        this.currentState = ShellController.serverStates.LoadingServer
        this.runningServer = server
        // We wait for the server to load 
        try {
            let command =  server.getExecutablePath()+'\nsay '+ShellController.serverUpChecker;
            if(isWindows){
                command = this.convertToWslPath(command)
            }
            await this.executeAndWaitForExpectedOutput(command,ShellController.serverUpChecker,server.getMaxTimeToBootUp())            
            this.currentState = ShellController.serverStates.ServerUp
        } catch (error : any) {
            this.currentState = ShellController.serverStates.NoServer
            this.runningServer = null;
            throw new Error('Couldnt boot up the server, something went wrong' + error.message)
        }
        
    }
    async stop(server: MinecraftServer) : Promise<void>{
        if(this.currentState == ShellController.serverStates.NoServer) throw new Error('There is no server running, cant stop')
        if(this.currentState == ShellController.serverStates.ShuttingDownServer) throw new Error('There is a server being shut down, cant stop')
        if(this.currentState == ShellController.serverStates.LoadingServer) throw new Error('There is a server being loaded, cant stop')
        
        if(this.runningServer != server){
            throw new Error('The server will not be closed as it is not the one being run')
        }
        
        this.runningServer = null;
        const stopVerifier = 'Exit complete'
        let command = `stop\necho "${stopVerifier}"\n`;
        try{
            await this.executeAndWaitForExpectedOutput(command,stopVerifier,10)
            this.currentState = ShellController.serverStates.NoServer;
            return;
        }catch(error : any){
            throw new Error('The server couldnt be closed, '+ error.message)
        }
    }

    async executeAndWaitForExpectedOutput(command: string, expectedString: string, maxTime : number): Promise<void> {
        return new Promise((resolve, reject) => {
            // Listener temporal para capturar la salida
            let buffer : string = '' 
            const handleOutput = (data: Buffer) => {
                const output = data.toString();
                buffer += output
                const lines : string[] = buffer.split('\n')
                buffer = lines.pop() || '';
                //Im reading the buffer line by line
                lines.forEach((line)=>{
                    if (line.includes(expectedString)){
                        this.shell?.stdout.off('data', handleOutput); // Elimina el listener
                        resolve()
                        return;
                    }
                })
            };
            this.shell?.stdout.on('data', handleOutput);

            // Sending the command to the shell
            this.shell?.stdin.write(`${command}\n`);
            // Adding a timeout if the server doesnt start
            setTimeout(() => {
                this.shell?.stdout.off('data', handleOutput); // Elimina el listener
                reject(new Error('Timeout: the expected output was not received'));
            }, maxTime*1000); // MaxTime seconds
        });
    }
    redirectServerOutputToCommandLine() : void{
        if (this.isRedirectingToCommandLine) return;
        this.isRedirectingToCommandLine = true;
        this.shell?.stdout.on('data', this.outputHandler)
    }
    stopredirectServerOutputToCommandLine() : void{
        if(!this.isRedirectingToCommandLine) return;
        this.isRedirectingToCommandLine = false;
        this.shell?.stdout.off('data', this.outputHandler)
    }
    convertToWslPath(windowsPath: string) : string{
        return windowsPath
            .replace(/\\/g, '/') // Cambiar las barras invertidas a barras normales
            .replace(/^([a-zA-Z]):/, '/mnt/$1') // Convertir la unidad C:/ a /mnt/c
    }
    
    outputHandler(data: Buffer) : void{
        data.toString().split('\n').forEach((line) => {
            if(line) console.log("out: ",line)
        })
    }

    getCurrentState() : string{
        return this.currentState
    }

    toString(): string {
        return `ShellController: {
                currentState: "${this.currentState}",
                serverUp: ${this.runningServer} 
                }`;
    }
}
