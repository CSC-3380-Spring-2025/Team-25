import express from 'express';
import connectMongo from '../src/lib/mongoose.js';
import User from '../src/models/User.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

connectMongo().then(() => {
  console.log('Connected to MongoDB');

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});