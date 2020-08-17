const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const dbFunction = async (database) => {
  // creates a new client
  const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });

  // connect to the client
  await client.connect();

  // connect to the database (db name is provided as an argument to the function)
  const db = client.db(database);
  console.log("connected!");

  await db.collection("users").insertOne({ name: "Buck Rogers" });

  // close the connection to the database server
  client.close();
  console.log("disconnected!");
};

dbFunction('exercise_1');
