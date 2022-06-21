const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()
const PORT = 8000

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
        '$search' : {
          'autocomplete' : {
            'query': `${req.query.query}`,
            'path': 'title',
            'fuzzy': {
              'maxEdits': 1,
              'prefixLength': 2
            }
          }
        }
      }
    ]).toArray()    
    res.send(result)
  } catch (e) {
    console.log(e)
    res.status(500).send({message: e.message})
  }
})

app.get('/get/:id', async (req, res) => {
  try {
    let result = await collection.findOne({
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