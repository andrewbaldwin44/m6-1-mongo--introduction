const { MongoClient } = require("mongodb");
const assert = require('assert');

require("dotenv").config();
const { MONGO_URI } = process.env;

const {
  paginateModel,
} = require('./paginateModel');

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

function capitalizeFirstLetter(string) {
  string = string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function getGreeting(req, res) {
  const { _id } = req.params;

  const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });

  await client.connect();

  const db = client.db('exercise_1');


  db.collection('greetings').findOne(
    {
      $or: [
        { _id: _id.toUpperCase() },
        { lang: capitalizeFirstLetter(_id) }
      ]
    },
    (err, result) => {
      result
        ? res.status(200).json({ status: 200, data: result })
        : res.status(404).json({ status: 404, data: "Not Found" });
      client.close();
    }
  );
}

async function getGreetings(req, res) {
  let { page, limit } = req.query;

  const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });

  await client.connect();

  const db = client.db('exercise_1');

  const greetings = await db.collection('greetings').find().toArray();

  const paginatedGreetings = paginateModel(greetings, page, limit);

  if (greetings.length > 0) {
    res.status(200).json({ status: 200, ...paginatedGreetings });
  }
  else {
    res.status(404).json({ status: 404, message: 'Greetings not found!' });
  }
}

async function deleteGreeting(req, res) {
  const { _id } = req.params;

  try {
    const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });

    await client.connect();

    const db = client.db('exercise_1');

    const databaseResponse = await db.collection("greetings").deleteOne({ _id });

    assert.equal(1, databaseResponse.deletedCount);

    client.close();

    res.status(204).json({ status: 204, data: _id });
  }
  catch ({ message }) {
    res.status(500).json({ status: 500, message })
  }
}

async function updateGreeting(req, res) {
  const { _id } = req.params;
  const { hello } = req.body;

  try {
    if (!hello) throw new Error('Invalid request');

    const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });

    await client.connect();

    const db = client.db('exercise_1');

    const newValues = { $set: { hello } };

    const databaseResponse = await db.collection("greetings")
                                     .updateOne({ _id }, { ...newValues});

    assert.equal(1, databaseResponse.matchedCount);
    assert.equal(1, databaseResponse.modifiedCount);

    client.close();

    res.status(200).json({ status: 200, data: { _id, hello } });
  }
  catch ({ message }) {
    res.status(500).json({ status: 500, message })
  }
}

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
