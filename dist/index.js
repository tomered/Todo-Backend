"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const mockDB = {
    todos: [],
};
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.get("/", (req, res) => {
    res.send("My Server");
});
app.get("/todos", (req, res) => {
    res.send({ todos: mockDB.todos });
});
app.post("/todo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const id = req.body.id;
        const description = req.body.description;
        if (!id || !description) {
            throw new Error("invalid inputs");
        }
        mockDB.todos.push(req.body);
        res.status(201).json({
            message: "create OK",
            reqBody: req.body,
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
}));
app.put("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
}));
app.delete("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const id = req.body.id;
        if (!id) {
            throw new Error("invalid inputs");
        }
        const newTodos = mockDB.todos.filter((item) => item.id !== id);
        mockDB.todos = newTodos;
        res.status(201).json({
            message: "deleted",
            changeID: req.body.id,
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
