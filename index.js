const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { get } = require("express/lib/response");
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sbsohag.2i4yv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
  
});

// http://localhost:5000/
async function run() {
  try {
    await client.connect();
    const productsCollection = client.db("sbDress").collection('products');

    // http://localhost:5000/products
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    //Crreate Post
    // http://localhost:5000/login

    app.post('/login', async(req, res)=>{
      const data = req.body;
      console.log(data)
      const result = await productsCollection.insertOne(data)
      res.send(result)
    })
    //Update Post
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("Hello world running", port);
});
