const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const productsCollection = client.db("sbDress").collection("products");

    // http://localhost:5000/products
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    //Update Post
    app.put("/product/:id", async(req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log("from dat update", data);

      // console.log('from put', id)
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          stock: data.stock
        },
      };
       const result = await productsCollection.updateOne(filter, updateDoc, options);
       res.send(result);
    });

    //Create Post
    // http://localhost:5000/product

    app.post("/product", async (req, res) => {
      const data = req.body;
      const result = await productsCollection.insertOne(data);
      res.send(result);
    });
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
