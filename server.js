import axios from "axios";
import express from "express";
//https://stackoverflow.com/questions/35356692/best-practice-when-using-an-api-key-in-node-js
//https://github.com/motdotla/dotenv
import "dotenv/config";

const PORT = 4000;

const app = express();
app.use(express.static("./public"));
app.use(express.json());

app.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const response = await axios.get(
      process.env.BASE_URL +
        `/forecast.json?key=${process.env.API_KEY}&q=${req.body.q}&lang=es`,
      { responseType: "json" }
    );
    res.json(response.data);
  } catch (error) {
    console.log("Error: ", error);
  }
});

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
