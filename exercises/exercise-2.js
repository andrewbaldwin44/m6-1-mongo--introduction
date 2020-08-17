const { MongoClient } = require("mongodb");
const assert = require('assert');

require("dotenv").config();
const { MONGO_URI } = process.env;

async function createGreeting(req, res) {
  try {
    const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });

    await client.connect();

    const db = client.db('exercise_1');

    const databaseResponse = await db.collection("greetings").insertOne(req.body);

    assert.equal(1, databaseResponse.insertedCount);

    client.close();

    res.status(201).json({ status: 201, data: req.body });
  }
  catch ({ message }) {
    res.status(500).json({ status: 500, message })
  }
}

module.exports = { createGreeting };
