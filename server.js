const dotenvconfig = require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const uuid = require("uuid");

const mongoose = require("mongoose");
const models = require("./models.js");
const Movies = models.Movie;
const Users = models.User;
const Genres = models.Genre;
const Directors = models.Director;

const cors = require("cors");

const app = express();

const { check, validationResult } = require("express-validator");

// const mongoDBConnectionString = "mongodb://127.0.0.1:27017/ocDB";
// mongoose.connect(mongoDBConnectionString, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose
  .connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`CONNECTED TO MONGO!`);
  })
  .catch((err) => {
    console.log(`OH NO! MONGO CONNECTION ERROR!`);
    console.log(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const passport = require("passport");
require("./passport");
const { error } = require("console");
const { constants } = require("fs/promises");

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.static("public"));

let allowedOrigins = [
  "http://localhost:8080",
  "http://testsite.com",
  "http://localhost:1234",
  "https://myflix-922o.onrender.com",
  "https://radiant-sorbet-24d69d.netlify.app",
];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         // if a specific origin isn't found on the list of allowed origins
//         let message =
//           "The CORS policy for this application does not allow access from origin " +
//           origin;
//         return callback(new Error(message), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

app.use(cors());

require("./auth")(app);

//fetches the welcome page
app.get("/", (req, res) => {
  res.send("Welcome MyFlix API");
});

/**
 * Fetch info about a specific genre using GET method
 * @function
 * @name getOneGenre
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - returns a promise containing an object of the selected genre
 */
app.get(
  "/genres/:genreName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find({ "Genre.Name": req.params.genreName })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Fetch all movies in the database using GET method
 * @function
 * @name getAllMovies
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - returns a promise which is resolved with an array containing all movie objects
 *
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .populate("Genre", "Name")
      .populate("Director", "Name")
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Fetch movie by title using GET method
 * @function
 * @name getOneMovie
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} the movie title (req.params.Title)
 * @returns {object} - returns a promise containing the object of the requested movie title
 */
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.title })
      .then((movie) => {
        res.status(200).json(movie);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Fetch info about a specific director using GET method
 * @function
 * @name getOneDirector
 * @param {object} req - Express request object
 * @param {object} res -Express response object
 * @returns {object} - returns a promise containing an object of the selected director
 */

app.get(
  "/directors/:directorsName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    Movies.find({ "Director.Name": req.params.directorsName })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Create a new user with POST method
 * @function
 * @name createUser
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - returns a promise containing the user object
 */

app.post(
  "/users",
  [
    check("Username", "Username is required.").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "password is required").not().isEmpty(),
    check("Email", "email does not appear to be valid").isEmail(),
  ],

  async (req, res) => {
    //check validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//app.use(express.static("public"));

/**
 * Fetch data on all users using the GET method
 * @function
 * @name getAllUsers
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - returns a promise containing all user objects
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Fetch data on a specific user by username using the GET method
 * @function
 * @name getOneUser
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - returns a promise containing an object of the single user
 */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Update user info using the PUT method
 * @function
 * @name editUserProfile
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} - the user's name (req.params.Username)
 * @returns {object} - returns a promise containing an object of the single user
 */
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed"
    ).isAlphanumeric(),
    check("Password", "password is required").not().isEmpty(),
    check("Email", "email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    //check validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);

    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });

    // CONDITION TO CHECK ADDED HERE
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }
    //CONDITION ENDS
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },

      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Adding a movie to favorites array using the POST method
 * @function
 * @name addFavMovies
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} - the movie's ID (req.params.MovieID)
 * @param {string} - the user's name (req.params.Username)
 * @returns {object} - returns a promise containing an updated user object
 */
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log("Movie ID is here ->", req.params.MovieID);
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Deleting a user with the DELETE method
 * @function
 * @name deleteUser
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} - the user's name (req.params.Username)
 * @returns {object} - returns a promise containing an updated user object
 */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Deleting a movie from favorites array using the DELETE method
 * @function
 * @name deleteMovie
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} - the movie's ID (req.params.MovieID)
 * @param {string} - the user's name (req.params.Username)
 * @returns {object} - returns a promise containing an updated user object
 */
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    )

      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User not found");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something brokeS!");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
