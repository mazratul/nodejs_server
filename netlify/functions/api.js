const { MongoClient } = require("mongodb");

const handler = async (event, context) => {
    const uri =
    "mongodb+srv://mazumder:rmazu1mazumder@cluster0.dbbf0lb.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const data = await findPokemonData(client);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: "Failed to connect to database" }),
    };
  } finally {
    await client.close();
  }
};

async function findPokemonData(client) {
  const cursor = client.db("pokemondb").collection("pokemons").find({});
  const results = await cursor.toArray();
  return results;
}

module.exports = { handler };
