const express = require('express'),
  morgan = require('morgan');

const app = express();



app.use(morgan('common'));

app.get('/movies', (req, res) => {
  res.json('topTenMovies');
});

app.get('/', (req, res) => {
  res.send('Welcome to Myflix.');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
app.use('/documentation.html', express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });