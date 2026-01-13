import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGO_URI = "mongodb+srv://admin:italo123@tsip4.qhry65h.mongodb.net/?retryWrites=true&w=majority&appName=TSIP4";

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