const { MongoClient } = require("mongodb");

const handler = async (event, context) => {
  const uri =
    "mongodb+srv://mazumder:rmazu1mazumder@cluster0.dbbf0lb.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const data = await findPokemonData(client);
    if (data.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ msg: "No Pokemon data found" }),
      };
    }
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
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
