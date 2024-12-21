import { spawn } from 'child_process';

function testChildProcess() {
    setTimeout(() => {
        const child = spawn('sh');

        child.stdin.write('ls -lh /usr\n');
        child.stdin.end();
        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }, 2000);
}

testChildProcess();
