import express from 'express'; 
const app = express();
import { fileURLToPath } from "url"; // Importamos fileURLToPath para obtener __filename y __dirname
import path from "path";
import { Controller } from '../src/Controller.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname,"public", "views"));
app.use(express.static(path.join(__dirname, 'public')));

// Array de servidores
const servers = [
  {
    id: 1,
    name: "Survival Paradise",
    description: "Classic survival experience with a friendly community",
    image: "https://images.unsplash.com/photo-1607988795691-3d0147b43231?auto=format&fit=crop&q=80&w=1600",
    players: "124/200",
    version: "1.20.1"
  },
  {
    id: 2,
    name: "Creative World",
    description: "Unleash your creativity in this building-focused server",
    image: "https://images.unsplash.com/photo-1623934199716-dc28818a6ec7?auto=format&fit=crop&q=80&w=1600",
    players: "89/150",
    version: "1.20.1"
  },
  {
    id: 3,
    name: "Skyblock Adventures",
    description: "Start with an island and build your empire",
    image: "https://images.unsplash.com/photo-1624626075493-b163c96c0d1e?auto=format&fit=crop&q=80&w=1600",
    players: "256/300",
    version: "1.20.1"
  }
];

export async function runServer(controller : Controller){
  app.get('/', (req, res) => {
    console.log(controller.getServersObject())
    res.render('index', {servers : controller.getServersObject()});
  });

  app.get('/bootup/:name', (req, res) => {
    
    controller.bootUpServer(req.params.name)
    .catch((error : any) => {
      console.log("Error someone tried booting up the server: ",error.message)
    });
    res.send("Server Will boot up soon")
  });
  app.get('/stop/:name', (req, res) => {
    try {
      controller.stopServer(req.params.name)
    } catch (error : any) {
      console.log("Error someone tried stopping the server: ",error.message)
    }
  });
  
  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
  return;  
}