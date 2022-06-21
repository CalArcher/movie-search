const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ObjectID } = require('mongodb')
require('dotenv').config()
const PORT = 8100

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'sample_mflix',
  collection

MongoClient.connect(dbConnectionStr)
  .then(client => {
    console.log('Connected to DB')
    db = client.db(dbName)
    collection = db.collection('movies')
  })

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cors())

app.get('/search', async (req, res) => {
  try {
    let result = await collection.aggregate([
      {
        '$Search' : {
          'autocomplete' : {
            'query': `${req.query.query}`,
            'path': 'title',
            'fuzzy': {
              'maxEdits': 2,
              'prefixLength': 2
            }
          }
        }
      }
    ]).toArray()    
    res.send(result)
  } catch (e) {
    res.status(500).send({message: e.message})
  }
})

app.get('/get/:id', async (req, res) => {
  try {
    let res = await collection.findOne({
      '_id' : ObjectId(req.params.id)
    })
    res.send(result)
  } catch (e) {
    res.status(500).send({message: e.message})
  }
})

app.listen(process.env.PORT || PORT, () => {
  console.log('Server is running')
})