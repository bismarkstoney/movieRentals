const express = require('express');
const Joi = require('joi');

const app = express();
const movies = [
  { id: 1, title: 'Admas Apple', duration: 2.3 },
  { id: 3, title: 'Accra we day', duration: 2.4 },
  { id: 1, title: 'Okomfo Anokye', duration: 2.1 },
];
//middleware
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api/v1/movies', (req, res) => {
  res.send(movies);
});

app.post('/api/v1/movies', (req, res) => {
  const { error } = validateInput(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const movie = {
    id: movies.length + 1,
    title: req.body.title,
    duration: req.body.duration,
  };
  movies.push(movie);
  res.send(movie);
});
app.put('/api/v1/movies/:id', (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send('Movie not found');
  const { error } = validateInput(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  movie.title = req.body.title;
  movie.duration = req.body.duration;
  res.send(movie);
});

app.delete('/api/v1/movies/:id', (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send('The movie is not found');
  const index = movies.indexOf(movie);
  movies.splice(index, 1);
  res.send(movie);
});
app.get('/api/v1/movies/:id', (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send('Movie not found');
  res.send(movie);
});

app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});

const validateInput = (movie) => {
  const schema = {
    title: Joi.string().min(2).required(),
    duration: Joi.number().required(),
  };
  return Joi.validate(movie, schema);
};
