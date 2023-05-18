const express = require('express');

const bcrypt = require('bcryptjs');

const router = express.Router();

const User = require('../models/user');

const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.send('Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.send('Error');
  }
});

router.post('/registration', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  });

  try {
    const u1 = await user.save();
    res.json(u1);
  } catch (err) {
    res.send('Error');
  }
});

router.post('/login', async (req, res) => {
  try {
    var email = req.body.email;
    var password = req.body.password;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('No User Found');
    }
    console.log(req.body.password);
    console.log(user);
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    console.log('try block runnign');
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null });
    }

    var token = jwt.sign({ id: user._id }, 'Secert message', {
      expiresIn: 86400, // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });

    //res.send({ email, password });
  } catch (err) {
    console.log('catch block running');
    res.send({ Error: err });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const documentId = req.params.id;
    const user = await User.findByIdAndDelete(documentId);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (err) {
    res.send('Error');
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updateData = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (err) {
    res.send('Error');
  }
});

module.exports = router;
