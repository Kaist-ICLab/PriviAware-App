const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb');
require('dotenv').config({path: __dirname + '/../../.env'});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const mongoDBConnectFunc = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('abc');
    console.log('[Express server.js] Database connected');
    client.close();
  } catch (err) {
    throw err;
  } finally {
    client.close();
    console.log('[Express server.js] Database connection closed');
  }
};

const mongoDBDataQueryFunc = async queryFilter => {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    console.log('[Express server.js] Database connected');
    console.log('[TimeStamp] ' + Date.now());
    const db = client.db('abc');
    const datum = db.collection('datum');
    const findResult = await datum.findOne(queryFilter);
    console.log(
      '[Express server.js] Found data: ' + JSON.stringify(findResult),
    );
    console.log('[TimeStamp] ' + Date.now());
  } catch (err) {
    throw err;
  } finally {
    client.close();
    console.log('[Express server.js] Database connection closed');
  }
};

app.listen(process.env.SERVER_PORT, process.env.SERVER_IP_ADDR, () => {
  console.log(
    `[Express server.js] Listening on address ${process.env.SERVER_IP_ADDR} with port ${process.env.SERVER_PORT}`,
  );
  console.log(
    '[Express server.js] Will be connecting to MongoDB with URI: ' +
      process.env.MONGODB_URI,
  );
});

app.post('/testConnection', (req, res) => {
  console.log('[Express server.js] Reached path /testConnection');
  const queryFilter = req.body.queryFilter;
  mongoDBDataQueryFunc({'subject.groupName': 'SS'});
  res.status(200).send({result: 'success'});
});

app.get('/test', (_, res) => {
  console.log('[Express server.js] Reached path /test');
  res.status(200).send({result: 'ConnSuccess'});
});
