import mongoose, { connect } from "mongoose";

export async function connectDB(uri: string) {
  try {
    const mongoose = await connect(uri);
  } catch (err) {}
}

const todoListSchema = new mongoose.Schema({
  description: String,
  id: Number,
});

export const Todo = mongoose.model("todoList", todoListSchema);
