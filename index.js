const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0wqac.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

async function run() {
  try {
    
    // const db = client.db('pc-builder');
    // const productCollection = db.collection('pc_parts');

    await client.connect();

    const productCollection = client.db('pc-builder').collection('pc_parts');

    app.post('/product', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);

      const result = await productCollection.insertOne(newProduct);
    //   const result = await productCollection.insertMany(newProduct);

      res.send(result);
    });

    app.get('/pc_parts', async (req, res) => {
        const collectProduct = productCollection.find({});
        const product = await collectProduct.toArray();
  
        res.send(product);
      });
    
      app.get('/pc_parts/:id', async (req, res) => {
        const id = req.params.id;
  
        const result = await productCollection.findOne({ id: id });
        // console.log(result);
        res.send(result);
      });


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('DB is Running....')
})

app.listen(port, () => {
    console.log(`MongoDB is running on port ${port}`);
})


