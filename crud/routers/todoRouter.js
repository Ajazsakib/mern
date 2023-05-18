const express = require('express');

const router = express.Router();

const Todo = require('../models/todo');

const isAuth = require('../isAuth');
const { findById } = require('../models/user');

router.get('/', isAuth, async (req, res) => {
  const loggedInUserId = req.user;
  console.log('<<<<<', loggedInUserId.id);

  try {
    const todos = await Todo.find({ userId: loggedInUserId.id });
    res.send(todos);
  } catch (err) {
    res.send('Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    res.json(todo);
  } catch (err) {
    res.send('Error');
  }
});

router.post('/', isAuth, async (req, res) => {
  const todo = new Todo({
    task: req.body.task,
    userId: req.user.id,
  });

  try {
    const t1 = await todo.save();
    res.json(t1);
  } catch (err) {
    res.send('Error');
  }
});

router.delete('/:id', isAuth, async (req, res) => {
  try {
    const documentId = req.params.id;
    const todo = await Todo.findById(documentId);
    if (req.user.id === todo.userId) {
      const data = await Todo.findByIdAndDelete(documentId);
      res.send(`Document with ${data.task} has been deleted..`);
    } else {
      res.status(400).send("can't delete others");
    }
  } catch (err) {
    res.send('Error');
  }
});

router.patch('/:id', isAuth, async (req, res) => {
  try {
    taskId = req.params.id;
    userId = req.user.id;
    const todo = await Todo.findById(taskId);
    if (userId === todo.userId) {
      const updateData = req.body;
      const updatedTodo = await Todo.findByIdAndUpdate(taskId, updateData, {
        new: true,
      });
      res.json(updatedTodo);
    } else {
      res.status(400).send("can't edit others data");
    }
  } catch (err) {
    res.send('Error');
  }
});

module.exports = router;
