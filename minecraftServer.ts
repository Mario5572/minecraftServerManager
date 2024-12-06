export class MinecraftServer {
    id: number;
    private name: string;
    private executablePath: string;
    private maxPlayers: number;
    private version: string;

    constructor(name: string, executablePath: string, maxPlayers: number, version: string) {
        this.name = name;
        this.executablePath = executablePath;
        this.maxPlayers = maxPlayers;
        this.version = version;
        this.id = Math.floor(Math.random() * 10000); // Genera un ID único por defecto
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
