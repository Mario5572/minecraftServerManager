import { askQuestion } from './askQuestion.js';
import { Controller } from './Controller.js';
import { MinecraftServer } from './minecraftServer.js';



async function handleCommand(input : string, controller : Controller) : Promise<void>{
    const args : string[] = input.split(' ');
    const command : string = args[0]
    if(command.toLowerCase() == 'create'){
        try {
            const server = await MinecraftServer.createMinecraftServerFromUserInput()            
            controller.addServer(server)
            console.log("Succesfully created server: ",server)

        } catch (error : any) {
            console.log(error.message)
        }
    }
    else if(command.toLowerCase() == 'help'){
        console.log("WELCOME TO THE SERVER MANAGER\n")
        console.log("The thing that appears between [] is the current state of the Controller, wether its running a server, loading it, etc\n")
        console.log("   -create : asks you information to create a minecraft server, you can drag a file to the terminal to paste its route\n")
        console.log("   -run : runs a server, run it by the name of the server you want to run\n")
        console.log("   -stop : stops a server, stop it by the name of the server you want to stop\n")
        console.log("   -redirect : redirects the output of the server to the command line\n")
        console.log("   -stopredirect : stops redirecting the server output to the command line\n")
    }   
    else if(command === 'run'){
        if(!args[1]){
            console.log("Either youre a funny guy or illiterate, just type help")
            return;
        }
        try {
            await controller.bootUpServer(args[1]);
        } catch (error : any) {
            console.log(`Couldnt boot up the server: ${error.message}`);
        }        
    }
    else if(command === 'stop'){
        if(!args[1]){
            console.log("Either youre a funny guy or illiterate, just type help")
            return;
        }
        try {
            await controller.stopServer(args[1])
        } catch (error : any) {
            console.log("Couldnt stop the server, due to: "+ error.message)
        }
    }
    else if(command == 'redirect'){
        controller.redirectServerOutputToCommandLine()
    }
    else if(command == 'stopredirect'){
        controller.stopredirectServerOutputToCommandLine()
    }
    else if(command == 'load'){
        try {
            await controller.loadServersFromJson(args[1] ? args[1] : undefined)
        } catch (error : any) {
            console.log("Couldnt load the servers: "+ error)
        }
    }
    else if(command == 'list'){
        console.log("Servers:")
        for(const server of controller.getServers())
            console.log(server)
    }
    else if(command == 'introcommand'){
        try {
            await controller.introCommand()
        } catch (error : any) {
            console.log("Couldnt introduce the command: "+ error.message)
        }
    }
    else if(command == 'save'){
        try {
            await controller.saveServersToJson(args[1] ? args[1] : undefined)
        } catch (error : any) {
            console.log("Couldnt save the servers: "+ error.message)
        }
    }
    else if(command != ''){
        console.log("You seem a little lost, need any \x1b[1mhelp\x1b[0m (there is a command help in case you are wondering)")
    }
}
export const consoleLoop = (async (controller : Controller) => {
    while(true){
        const input = await askQuestion(`Next Command[${controller.getCurrentState()}]:`)
        await handleCommand(input,controller)
    }
})
