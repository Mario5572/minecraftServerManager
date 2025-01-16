import { askQuestion } from "./askQuestion";
export class MinecraftServer {
    id: number;
    private name: string;
    private executablePath: string;
    private maxPlayers: number;
    private version: string;
    private maxTimeToBootUp: number;

    constructor(name: string, executablePath: string, maxPlayers: number, version: string, maxTimeToBootUp : number = 200) {
        this.name = name;
        this.executablePath = executablePath;
        this.maxPlayers = maxPlayers;
        this.version = version;
        this.id = Math.floor(Math.random() * 10000); // Genera un ID único por defecto
        this.maxTimeToBootUp = maxTimeToBootUp;
    }

    static async createMinecraftServerFromUserInput(): Promise<MinecraftServer> {
        // Configurar la interfaz para leer entrada del usuario

        try {
            const name = await askQuestion('Enter the server name: ');
            const executablePath = await askQuestion('Enter the executable path: ');
            const maxPlayers = await askQuestion('Enter the maximum number of players: ');
            const version = await askQuestion('Enter the server version: ');
            const maxTimeToBootUp = await askQuestion('Enter the max time to boot up (in seconds): ');
            
            // Crear y devolver una instancia de MinecraftServer
            const badParameters = MinecraftServer.validateParameters(name,executablePath,maxPlayers,version,maxTimeToBootUp);
            if(badParameters.length > 0){
                throw new Error("Some parameter couldnt be validated: [ " + badParameters+" ]")
            }
            const server = new MinecraftServer(
                name,
                executablePath,
                parseInt(maxPlayers, 10),
                version,
                parseInt(maxTimeToBootUp, 10)
            );
            
            return server
        } catch (error : any) {
            throw new Error('Error while creating the server: ' + error.message);
        }
        
    }

    getExecutablePath() : string{
        return this.executablePath;
    }
    getMaxTimeToBootUp(): number{
        return this.maxTimeToBootUp
    }
    getName() : string{
        return this.name
    }

    static validateParameters(
        name: string,
        executablePath: string,
        maxPlayers: string,
        version: string,
        maxTimeToBootUp: string
    ): string[] {
        const invalidParameters: string[] = [];

        if (!name || name.trim() === '') {
            invalidParameters.push('name ');
        }

        if (!executablePath || executablePath.trim() === '') {
            invalidParameters.push('executablePath ');
        }

        const maxPlayersInt = parseInt(maxPlayers, 10);
        if (isNaN(maxPlayersInt) || maxPlayersInt <= 0) {
            invalidParameters.push('maxPlayers ');
        }

        if (!version || version.trim() === '') {
            invalidParameters.push('version ');
        }

        const maxTimeToBootUpInt = parseInt(maxTimeToBootUp, 10);
        if (isNaN(maxTimeToBootUpInt) || maxTimeToBootUpInt <= 0 || maxTimeToBootUpInt > 3600) {
            invalidParameters.push('maxTimeToBootUp ');
        }

        return invalidParameters;
    }


    toString(): string {
        return `MinecraftServer: { 
            id: ${this.id}, 
            name: "${this.name}", 
            executablePath: "${this.executablePath}", 
            maxPlayers: ${this.maxPlayers}, 
            version: "${this.version}" 
        }`;
    }

    equals(other: MinecraftServer): boolean {
        if (!other) return false;

        return (
            this.name === other.name &&
            this.executablePath === other.executablePath &&
            this.maxPlayers === other.maxPlayers &&
            this.version === other.version &&
            this.id === other.id
        );
    }
}

