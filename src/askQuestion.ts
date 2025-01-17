import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ''
});

// Helper para hacer preguntas al usuario
export const askQuestion = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        process.stdout.write(query);
        rl.question(query, (answer : any) => {
            resolve(answer.trim());
        });
    });
};

export const closeReadLine = () : void => {
    rl.close();
}
