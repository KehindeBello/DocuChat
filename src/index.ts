import express from 'express';

export const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Welcome to DocuChat!');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000 ✅');
})