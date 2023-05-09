const express =require('express')
const app =express()
const cors =require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT || 5000;
//midleware
app.use(cors());
app.use(express.json());

//mongodb code
const uri = "mongodb+srv://mohibulsh:oMOoIK75SuuClbZZ@cluster0.khyx0yo.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("usersDB");
    const userCollection = database.collection("userCollection");
   
    app.get('/users',async(req,res)=>{
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })
    // post the user data from client side
    app.post('/users',async(req,res)=>{
        const user = req.body;
        console.log('new user ',user)
        const result = await userCollection.insertOne(user);
        res.send(result)
    })
    // delete the users
    app.delete('/users/:id',async(req,res)=>{
        const id = req.params.id;
        console.log('please delete the users from id', id)
        const query = {_id : new ObjectId (id)}
        const result = await userCollection.deleteOne(query)
        res.send(result)
    })




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('server is running')
});
//mohibulsh
//oMOoIK75SuuClbZZ



app.listen(port,()=>{
    console.log(`server is runnig on${port}`)
})