import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { error } from "console";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
type mockDBType = { todos: { description: string; id: number }[] };
const mockDB: mockDBType = {
  todos: [
    { description: "feed my cat", id: 1.7 },
    { description: "feed my dog", id: 2 },
    { description: "feed my dog", id: 3 },
  ],
};

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

app.get("/", (req: Request, res: Response) => {
  res.send("My Server");
});

app.get("/todos", (req: Request, res: Response) => {
  res.send({ todos: mockDB.todos });
});

app.post("/todo", async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const description = req.body.description;

    if (!description) {
      throw new Error("invalid inputs");
    }
    mockDB.todos.push({ description, id: Math.random() });
    res.status(201).json({
      message: "create OK",
      added: { description, id: Math.random() },
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.put("/todos", async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const id = req.body.id;

    if (!id) {
      throw new Error("invalid inputs");
    }
    mockDB.todos.map((item) => {
      if (item.id === id) {
        item.description = req.body.description;
      }
    });
    res.status(201).json({
      message: "changed",
      changeID: req.body.id,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const id = parseFloat(req.params.id);

    if (!id) {
      throw new Error("invalid inputs");
    }
    const newTodos = mockDB.todos.filter((item) => item.id !== id);

    mockDB.todos = newTodos;

    res.status(201).json({
      message: "deleted",
      deletedID: id,
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
