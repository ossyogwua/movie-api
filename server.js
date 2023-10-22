const mongoose = require ('mongoose');
  const models = require ('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
  const bodyParser = require('body-parser');
  const uuid = require('uuid');
  

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan('common'));
  
  app.use(bodyParser.json())

  mongoose.connect('mongodb://localhost:27017/ocDB', { useNewUrlParser: 
true, useUnifiedTopology: true });


app.get('/genres', (req, res) => {
Movies.find({ 'Genre.Name':'Thriller' })
  .then((movies) => {
    // Logic here
  })
  .catch((err) => {
    // Logic here
  });
});
  // returns a json object of all the movies
  app.get('/movies', (req, res) => {
     Movies.find()
  .then((movies) => { 
  })
  .catch((err) => {

  });
});
  // returns a single Json object of a movie
  app.get('/movies', (req, res) => {
  Movies.findOne({ Title: req.params.title})
  .then((movies) => {
 })
 .catch((err) => {

 });
});

 // returns movies by the directors name
 app.get("/directors", (req, res) => {
 Movies.find({ 'Director.Name': req.params.directorsName })
      .then((movies) => {
      })
      .catch((err) => {
      });
    });

  //Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get all users
app.get('/users', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })

});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Delete a user by username
app.delete('/users/:Username', async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Deletes movies from users favorites
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
  $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }) 

  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });

  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });
