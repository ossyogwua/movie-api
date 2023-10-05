const express = require('express'),
  morgan = require('morgan');
  const fs = require('fs');
  const path = require('path');
  const bodyParser = require('bodyparser');
  const uuid = require('uuid');

  const { check, validationResult } = require('express-validator');

  const Genres = Models.Genre;
  const Directors = Models.Director;
  const Movies = Models.Movie;
  const Users = Models.User;
  
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
const app = express();

const topTenMovies = [
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
      age: 36, death, year: 2011
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

app.use(morgan('common'));

app.get('/movies', (req, res) => {
  res.json(topTenMovies);
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

  // Return data about a single movie by title 
app.get('/movies/:Title', { session: false }), (req, res) => {
  Movies.findOne({Title: req.params.Title})
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
};

// Return data about a genre by name
app.get('/movies/genre/:genreName', { session: false }), (req, res) => {
  Movies.findOne({'Genre.Name':req.params.genreName})
    .then((movie) => {
      res.status(200).json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
};

//  Return data about a director (age and death year) by name
app.get('/movies/directors/:directorName', { session: false }), (req, res) => {
  Movies.findOne({'Director.Name':req.params.directorName})
    .then((movie) => {
      res.status(200).json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
};


  {
    username: String, (required)
    password: String, (required)
    email: String, (required)
    birth_date: Date
}
app.post('/users',
    [
        // Validation here for request
        check('Username', 'Username is required.')
            .isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.')
            .isAlphanumeric(),
        check('Password', 'Password is required.')
            .isLength({ min: 8 }),
        check('Email', 'Email is required.')
            .not().isEmpty(),
        check('Email', 'Email does not appear to be valid.')
            .isEmail()
    ],
    async (req, res) => {
        // validation object for errors
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422)
                .json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);
        await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
            .then((user) => {
                if (user) { // If the user is found, send a response that it already exists
                    return res.status(400)
                        .send(req.body.Username + ' already exists');
                } else { // If it does not exist, create a user with the given username
                    Users
                        .create({
                            Username: req.body.Username,
                            Password: hashedPassword,
                            Email: req.body.Email,
                            Birth_Date: req.body.Birth_Date
                        })
                        .then((user) => {
                            res.status(201)
                                .json(user)
                        })
                        .catch((error) => {
                            console.error(error);
                            res.status(500)
                                .send('Error: ' + error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500)
                    .send('Error: ' + error);
            });
    }
);
app.listen(8080);
console.log('My test server is running on Port 8080.');

