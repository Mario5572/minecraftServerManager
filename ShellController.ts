import { spawn, ChildProcessWithoutNullStreams} from 'child_process';
import { MinecraftServer } from './minecraftServer';

export class ShellController {
    static serverStates = {
        ServerUp: 'ServerUp',
        LoadingServer: 'LoadingServer',
        ShuttingDownServer: 'ShuttingDownServer',
        NoServer: 'NoServer',
    };
    static serverUpChecker : string = 'XA1231324';
    private currentState: string; // Possible values: "ServerUp", "LoadingServer", "NoServer", "ShuttingDownServer"
    private runningServer: MinecraftServer; //In case of the current state being ServerUp or LoadingServer, runningServer will contain the server being runned
    private shell : ChildProcessWithoutNullStreams | null = null

    constructor(initialState: string = ShellController.serverStates.NoServer) {
        this.currentState = initialState;
        this.shell = spawn('sh')
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
            await this.executeAndWaitForExpectedOutput(server.getExecutablePath(),ShellController.serverUpChecker,server.getMaxTimeToBootUp())            
            this.currentState = ShellController.serverStates.ServerUp
        } catch (error) {
            this.currentState = ShellController.serverStates.NoServer
            throw new Error('Couldnt boot up the server, something went wrong')
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
            this.shell?.stdin.write(`say ${expectedString}`)

            // Adding a timeout if the server doesnt start
            setTimeout(() => {
                this.shell?.stdout.off('data', handleOutput); // Elimina el listener
                reject(new Error('Timeout: No se recibió la salida esperada.'));
            }, maxTime*1000); // MaxTime seconds
        });
    }
    redirectServerOutputToCommandLine() : void{

        if(this.currentState == ShellController.serverStates.NoServer) throw new Error("There is no server being executed cant redirect console output")

        this.shell?.stdout.on('data', (data) => {
            console.log(data)
        });
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
