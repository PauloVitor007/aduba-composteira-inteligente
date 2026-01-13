import express from 'express';
import cors from 'cors'; 
import { MongoClient, ServerApiVersion } from 'mongodb';

const app = express();

// --- CORREÇÃO DO CORS 
app.use(cors({
    origin: "*", // Aceita conexões de qualquer lugar
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// SUA CONEXÃO 
const MONGO_URI = "mongodb+srv://admin:italo123@tsip4.qhry65h.mongodb.net/?retryWrites=true&w=majority&appName=TSIP4";

const client = new MongoClient(MONGO_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

async function run() {
  try {
    await client.connect();
    console.log(" CONECTADO AO MONGODB!");
  } catch (err) {
    console.error( "Erro Mongo:", err);
  }
}
run();

app.post('/signup', async (req, res) => {
  console.log("📩 Recebi cadastro de:", req.body.email);
  const { email, password } = req.body;
  try {
    const db = client.db("aduba_db");
    // Verifica se já existe
    const exists = await db.collection("users").findOne({ email });
    if (exists) {
        return res.status(400).json({ error: "Email já cadastrado" });
    }
    
    await db.collection("users").insertOne({ email, password, date: new Date() });
    console.log("✅ Usuário criado!");
    res.json({ message: "Usuário criado!", user: { email } });
  } catch (e) {
    console.error("Erro no cadastro:", e);
    res.status(500).json({ error: e.message });
  }
});

// Login simples para não dar erro
app.post('/signin', async (req, res) => {
    console.log("Recebi login de:", req.body.email);
    const { email, password } = req.body;
    const db = client.db("aduba_db");
    const user = await db.collection("users").findOne({ email, password });
    
    if (user) {
        res.json({ user: { email: user.email, id: user._id } });
    } else {
        res.status(400).json({ error: "Usuário não encontrado" });
    }
});

// Roda liberando acesso externo
app.listen(3000, '0.0.0.0', () => {
    console.log("Servidor rodando na porta 3000 com CORS liberado!");
});