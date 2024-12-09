import { askQuestion } from './askQuestion';
import { Controller } from './Controller';
import { MinecraftServer } from './minecraftServer';

const controller : Controller = new Controller();



async function handleCommand(input : string) : Promise<void>{
    const args : string[] = input.split(' ');
    const command : string = args[0]
    if(command.toLowerCase() == 'create'){
        try {
            const server = await MinecraftServer.createMinecraftServerFromUserInput()            
            controller.addServer(server)
            console.log("Succesfully created server: ",server)

        } catch (error) {
            console.log(error.message)
        }
    }
    else if(command.toLowerCase() == 'help'){
        console.log("WELCOME TO THE SERVER MANAGER\n")
        console.log("The thing that appears between [] is the current state of the Controller, wether its running a server, loading it, etc\n")
        console.log("   -create : asks you information to create a minecraft server, you can drag a file to the terminal to paste its route\n")
    }
    else if(command === 'run'){
        if(!args[1]){
            console.log("Either youre a funny guy or illiterate, just type help")
            return;
        }
        try {
            await controller.bootUpServer(args[1]);
        } catch (error) {
            console.log(`Couldnt boot up the server: ${error.message}`);
        }        
    }
    else if(command === 'load'){
        
    }
    else{
        console.log("You seem a little lost, need any \x1b[1mhelp\x1b[0m (there is a command help in case you are wondering)")
    }
}

(async () => {
    while(true){
        const input = await askQuestion(`Next Command[${controller.getCurrentState()}]:`)
        await handleCommand(input)
    }
})()
