import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { NekorRouter } from "./nekor";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

// start the express web server listening on 8000
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

const uri = process.env.DB_URI;
const mongoClient = new MongoClient(uri!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoClient.connect().then(() => {
  console.log("Connected to MongoDB");
});
// nekor router
const myNekorRouter = new NekorRouter(mongoClient);
app.use("/nekor", myNekorRouter.getExpressRouter());

app.get("*", (req: Request, res: Response) => {
  res.send("MyHypermedia Backend Service");
});
