const express = require("express");
const router = express.Router();

// Import the Todo model
const Todo = require("../models/todo.model");

// Route to create a new Todo item
router.post("/:username", async (req, res) => {
  try {
    const { description, username, status } = req.body;

    // Create a new todo
    const todo = new Todo({
      userId: req.user._id,
      description,
      username,
      status,
    });

    await todo.save();

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch all Todo items for a specific user
router.get("/:username", async (req, res) => {
  try {
    // Get the userId from the authenticated user's request
    const userId = req.user._id;

    // Query the Todo collection for todos with the matching userId
    const userTodos = await Todo.find({ userId });

    // Send the todos back in the response
    res.json(userTodos);
  } catch (error) {
    console.error("Error fetching todos for user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to update a specific Todo item
router.put("/:username/:todoId", async (req, res) => {
  try {
    // Extract the username and todoId from the URL parameters
    const { username, todoId } = req.params;

    // Find the to-do item by its ID and username
    const todo = await Todo.findOne({ _id: todoId, username });

    if (!todo) {
      // If the to-do item was not found, respond with a 404 error
      return res.status(404).json({ error: "Todo not found" });
    }

    if (req.body.description !== undefined) {
      // If a description is provided in the request body, update the description
      todo.description = req.body.description;

      // Save the updated to-do item
      await todo.save();

      // Respond with the updated to-do item
      return res.json(todo);
    } else {
      // If no description is provided in the request body, toggle the status
      todo.status = !todo.status;

      // Save the updated to-do item
      await todo.save();

      // Respond with the updated to-do item
      return res.json(todo);
    }
  } catch (error) {
    console.error("Error updating a todo or toggling status:", error);
    res
      .status(500)
      .json({ error: "Server error: Unable to update todo or toggle status" });
  }
});

// Route to delete a specific Todo item
router.delete("/:username/:todoId", async (req, res) => {
  try {
    // Extract the todoId from the request body

    const { todoId } = req.params;
    console.log("Received todoId:", todoId);

    // Check if the todo exists
    const todo = await Todo.findById(todoId);
    if (!todo) {
      // If the todo does not exist, return a 404 status code
      return res.status(404).json({ error: "Todo not found" });
    }

    // Delete the todo from the database
    await Todo.findByIdAndDelete(todoId);

    // Return a success message and the deleted todo
    res
      .status(200)
      .json({ success: true, message: "Todo deleted successfully", todo });
  } catch (error) {
    console.error("Error in deleting a todo:", error);
    // Return a 500 status code for server errors
    res.status(500).json({ error: "Server error: Unable to delete todo" });
  }
});

module.exports = router;
