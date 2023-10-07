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
      age: 42,
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
app.get('/movies', (req, res) => { res.send('Successful GET request returning data on all the movies');

});


// Return data about a single movie by title 
app.get('/movies/:Title'), (req, res) => { res.send('Successful GET request returning data on the single movie');

  
    };



// Gets data about a genre by name
app.get('/movies/genre/:genreName'), (req, res) => {res.send('Successful GET request returning genre of all the movies');

  
    };




//  Return data about a director (age) by name
app.get('/movies/directors/:directorName'), (req, res) => {res.send('Successful GET request returning data about all the movie directors');


    };

// Adds data for a new users
app.post('/users', (req, res) => {res.send('Successful POST request adding new users');



  }
);

// Allow users to add a movie to their list of favorites.
app.post('/favoriteMovies', (req, res) => {res.send('Successful POST request allowing users to add their list of favorite movies');

});

// Deletes an existing user's account.
app.delete('/users/:account', (req, res) => {res.send('Successful DELETE request deleting users account');


});

// Update the user's account
app.put('/users/:name/:password/:email', (req, res) => {res.send('Successful PUT request updating users account');


});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});
