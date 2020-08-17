const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function getCollection(database) {
  const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });

  await client.connect();

  const db = client.db(database);
  // console.log("connected!");
  //
  // await db.collection("users").insertOne({ name: "Buck Rogers" });
  const data = await db.collection("users").find().toArray();
  console.log(data)

  client.close();
};

getCollection('exercise_1');
