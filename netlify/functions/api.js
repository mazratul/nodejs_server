const { MongoClient } = require("mongodb");
const fs = require('fs').promises;

const handler = async (event, context) => {
  const uri = "mongodb+srv://mazumder:rmazu1mazumder@cluster0.dbbf0lb.mongodb.net/?retryWrites=true&w=majorit";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const data = await findPokemonData(client);

    if (data.length === 0) { 
      const errorPage = await fs.readFile('../../errorPages/404.html', 'utf8');  
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "text/html"
        },
        body: errorPage
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
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
