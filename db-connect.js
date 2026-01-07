import { MongoClient, ServerApiVersion } from 'mongodb';

// CORREÇÃO 1: Voltei para o endereço 'tsip4' que sabemos que existe
// Se você criou o usuário novo, mude 'admin' para o nome do seu usuário novo
const MONGO_URI = "mongodb+srv://admin:italo123@tsip4.qhry65h.mongodb.net/?retryWrites=true&w=majority&appName=TSIP4";

// CORREÇÃO 2: Mudei de 'uri' para 'MONGO_URI' para bater com o nome lá de cima
const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log("Tentando conectar ao MongoDB...");
    
    await client.connect();
    
    await client.db("admin").command({ ping: 1 });
    
    console.log("Ping confirmado. Você se conectou com sucesso ao MongoDB!");
    
  } catch (error) {
    console.error("Erro ao conectar:", error);
  } finally {
    await client.close();
    console.log("Conexão fechada.");
  }
}

run().catch(console.dir);