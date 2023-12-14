import express from "express";
import cors from "cors";
//https://stackoverflow.com/questions/35356692/best-practice-when-using-an-api-key-in-node-js
//https://github.com/motdotla/dotenv
import "dotenv/config";

const PORT = 4000;

const app = express();
app.use(express.static("./public"));
app.use(express.json());
app.use(cors());
app.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const response = await fetch(
      process.env.BASE_URL +
        `/forecast.json?key=${process.env.API_KEY}&q=${req.body.q}&lang=es`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();
    console.log("Console in Server: ", data);
    res.json(data);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
