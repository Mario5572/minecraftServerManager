import { spawn } from 'child_process';
const isWindows = true;
let prefix = 'sh';
if(isWindows){
    prefix = 'wsl.exe';
}
async function testChildProcess() {
    setTimeout(() => {
        const child = spawn(prefix);
        let route = 'C:\\Users\\Usuario\\Desktop\\ProyectosPersonales\\minecraftServerManager\\run.sh';
        let command = '';
        if(isWindows){
            route = convertToWslPath(route);
            console.log(route);
        }
        command = command + ' ' + route;
        child.stdin.write(command + '\n');
        child.stdin.end();
        
        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        child.stderr.on('err', (data) => { // Changed 'err' to 'data' event
            console.error(`stderr: ${data}`);
        });

        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }, 2000);
}
function convertToWslPath(windowsPath: string) {
    return windowsPath
        .replace(/\\/g, '/') // Cambiar las barras invertidas a barras normales
        .replace(/^([a-zA-Z]):/, '/mnt/$1') // Convertir la unidad C:/ a /mnt/c
        .toLowerCase(); // Convertir la letra de unidad a minúsculas
}
testChildProcess();
