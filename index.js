const express = require('express')
const bodyParser = require('body-parser')
const cors = require ('cors')
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config()

const port = 5000
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vfsjf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)

const app = express()
app.use(bodyParser.json())
app.use(cors())



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("formBuilderStore").collection("forms");
  const detailCollection = client.db("formBuilderStore").collection("details");
  
  app.post('/createForm',(req,res)=>{
      const data = req.body
      collection.insertOne(data)
      .then(result=>{
          res.send(result.insertedId)
          
      })
  })

  app.post('/addDetail',(req,res)=>{
    const detail = req.body
    console.log(detail)
    detailCollection.insertOne(detail)
    .then(result=>{
      console.log(result)
      res.send(result.insertedId)
    })
  })

  app.get('/detail',(req,res)=>{
    detailCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })



  app.get('/formLists',(req,res)=>{
      collection.find({})
      .toArray((err,documents)=>{
          res.send(documents)
          
      })
  })
  
  app.get('/form/:id',(req,res)=>{
      collection.find({_id: ObjectId(req.params.id)})
      .toArray((err,documents)=>{
          res.send(documents[0])
      })
  })
 
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)