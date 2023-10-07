const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
  const bodyParser = require('body-parser');
  const uuid = require('uuid');

  const app = express();
  
  app.use(bodyParser.json())


let topTenMovies = [
  {
    title: "Titanic",
    director: {
      name: "James Cameron",
      age: 65
    },
    genre: {
      name: "adventure"
    }
  },
  {
    title: "Jurrasic Park 1",
    director: {
      name: "Steven Speilburg",
      age: 75
    },
    genre: {
      name: "adventure"
    }
  },
  {
    title: "Woody Woodpecker",
    director: {
      name: "Alex Zamm",
      age: 61
    },
    genre: {
      name: "Animated Comedy"
    }
  },
  {
    title: "The Wolf of Wall Street",
    director: {
      name: "Martin Scorsese",
      age: 80
    },
    genre: {
      name: "Crime"
    }
  },
  {
    title: "Love at First Sight",
    director: {
      name: "Venessa Caswill",
      age: 36,
    },
    genre: {
      name: "Romance"
    }
  },
  {
    title: "The Foreigner",
    director: {
      name: "Martin Campbell",
      age: 79
    },
    genre: {
      name: "Action Thriller"
    }
  },
  {
    title: "Forgotten Love",
    director: {
      name: "Michal Gazda ",
      age: 42, death, year:1969
    },
    genre: {
      name: "Drama"
    }
  },{
    title: "Spy Kids: Armageddon",
    director: {
      name: "Robert Rodriguez",
      age: 55
    },
    genre: {
      name: "Family Comedy"
    }
  },
  {
    title: "The Machine",
    director: {
      name: "Peter Atencio",
      age: 40
    },
    genre: {
      name: "Action Comedy"
    }
  },
  {
    title: "Monkey King",
    director: {
      name: "Anthony Stacchi",
      age: 59
    },
    genre: {
      name: "Action, Adventure"
    }
  },



]

// Gets the list of all movies

app.get('/movies', (req, res) => {
  res.json(topTenMovies);
});

// Return data about a single movie by title 
app.get('/movies/:Title', { session: false }), (req, res) => {
  Movies.findOne({Title: req.params.Title})
    .then((movie) => {
      res.status(200).json(movie);
    })
  
};


// Gets data about a genre by name
app.get('/movies/genre/:genreName', { session: false }), (req, res) => {
  Movies.findOne({'Genre.Name':req.params.genreName})
    .then((movie) => {
      res.status(200).json(movie.Genre);
    })

};


//  Return data about a director (age and death year) by name
app.get('/movies/directors/:directorName', { session: false }), (req, res) => {
  Movies.findOne({'Director.Name':req.params.directorName})
    .then((movie) => {
      res.status(200).json(movie.Director);
    })

};

// Adds data for a new users
app.post('/users', (req, res) => {
  let users = req.body;

  }
);

// Allow users to add a movie to their list of favorites.
app.post('/favoriteMovies', (req, res) => {
  let favoriteMovies = req.body;

  if (!favoriteMovies.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    favoriteMovies.id = uuid.v4();
    Movies.push(favoriteMovies);
    res.status(201).send(favoriteMovies);
  }
});

// Deletes an existing user's account.
app.delete('/users/:account', (req, res) => {
  let user = user.find((user) => { return user.account === req.params.account });

  if (user) {
    users = users.filter((obj) => { return obj.account !== req.params.account });
    res.status(201).send('users ' + req.params.account + ' was deleted.');
  }
});

// Update the user's account
app.put('/users/:name/:password/:email', (req, res) => {
  let user = users.find((user) => { return user.name === req.params.name });

  if (user) {
    user.password[req.params.password] = parseInt(req.params.email);
    res.status(201).send('user ' + req.params.name + ' was assigned a dateOfBirth of ' + req.params.dateOfBirth + ' in ' + req.params.password);
  } else {
    res.status(404).send('User with the name ' + req.params.name + ' was not found.');
  }
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});
