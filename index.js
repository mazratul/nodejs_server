const http = require("http");
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

http
  .createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.url == "/") {
      fs.readFile(
        path.join(__dirname, "public", "index.html"),
        (err, content) => {
          if (err) throw err;
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(content);
        }
      );
    } else if (req.url == "/api") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(await main().catch(console.error));
    } else {
      let filePath = path.join(__dirname, "public", req.url);
      const ext = path.extname(filePath);
      let contentType;
      switch (ext) {
        case ".css":
          contentType = "text/css";
          break;
        case ".png":
          contentType = "image/png";
          break;
        case ".jpg":
          contentType = "image/jpeg";
          break;
        default:
          if (ext === "") {
            filePath += ".html";
          }
          contentType = "application/octet-stream";
      }
      fs.readFile(filePath, (err, content) => {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
      });
    }
  })
  .listen(5959, () => console.log("server running"));

async function main() {
  const uri =
    "mongodb+srv://mazumder:rmazu1mazumder@cluster0.dbbf0lb.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    let data = await findPokemonData(client);
    return data;
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function findPokemonData(client) {
  const cursor = client.db("pokemondb").collection("pokemons").find({});
  const results = await cursor.toArray();
  const js = JSON.stringify(results);
  return js;
}
