// db-connect.js
import { MongoClient, ServerApiVersion } from 'mongodb';

// URI
const uri = "mongodb+srv://admin:italo12345@tsip4.qhry65h.mongodb.net/?appName=TSIP4";

const client = new MongoClient(uri, {
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