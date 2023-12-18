import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { error } from "console";
import bodyParser from "body-parser";
import cors from "cors";
import { Todo, connectDB } from "./db";

const http = require("http");
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(bodyParser.json({ limit: "50mb" }));

const serverOptions: any = {};

// serverOptions.server = http.createServer(app);
// serverOptions.port = 4000;
// serverOptions.protocol = "HTTP";

connectDB("mongodb://127.0.0.1:27017/todos")
  .then(() => {
    console.log("connected");
  })
  .catch(() => {});

app.get("/", (req: Request, res: Response) => {
  res.send("My Server");
});

app.get("/todos", async (req: Request, res: Response) => {
  const todos = await Todo.find(
    {},
    { id: true, description: true, _id: false }
  );
  res.send({ todos });
});

app.post("/todo", async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const description = req.body.description;

    if (!description) {
      throw new Error("invalid inputs");
    }

    const todo = new Todo({ description, id: Math.random() });
    await todo.save();
    res.status(201).json({
      message: "create OK",
      added: { description, id: todo.id },
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// app.put("/todos", async (req: Request, res: Response) => {
//   try {
//     console.log(req.body);
//     const id = req.body.id;

//     if (!id) {
//       throw new Error("invalid inputs");
//     }
//     mockDB.todos.map((item) => {
//       if (item.id === id) {
//         item.description = req.body.description;
//       }
//     });
//     res.status(201).json({
//       message: "changed",
//       changeID: req.body.id,
//     });
//   } catch (err: any) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// });

app.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const id = parseFloat(req.params.id);

    if (!id) {
      throw new Error("invalid inputs");
    }
    const todo = await Todo.deleteOne({ id });

    res.status(201).json({
      message: "deleted",
      changeID: id,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
