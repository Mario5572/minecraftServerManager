import express from 'express'; 
const app = express();
import { fileURLToPath } from "url"; // Importamos fileURLToPath para obtener __filename y __dirname
import path from "path";
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

export async function runServer(){
  app.get('/', (req, res) => {
    res.render('index', { servers });
  });
  
  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
  return;  
}