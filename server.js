/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: sage satsavia Student ID: 132238197 Date: _____09/24/2024___________
*  Vercel Link: _______________________________________________________________
*
********************************************************************************/ 
/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: sage satsavia Student ID: 132238197 Date: _____09/24/2024___________
*  Vercel Link: _______________________________________________________________
*
********************************************************************************/ const express = require('express');
const express = require('express');
const cors = require('cors');
require('dotenv').config();  // Load environment variables from .env file
const MoviesDB = require('./modules/moviesDB.js');  // Import the MoviesDB class

const app = express();
app.use(express.json());
app.use(cors());

const db = new MoviesDB();  // Create a new MoviesDB instance
const HTTP_PORT = process.env.PORT || 3000;  // Define the port

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Initialize the MoviesDB connection with the connection string from .env
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on: http://localhost:${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

// Basic GET route to check if API is running
app.get('/', (req, res) => {
  res.json({ message: "API Listening" });
});

// POST /api/movies - Add a new movie
app.post('/api/movies', (req, res) => {
  db.addNewMovie(req.body)
    .then(movie => res.status(201).json(movie)) // Return the newly created movie
    .catch(err => res.status(500).json({ error: err.message })); // Error handling
});

// GET /api/movies - Fetch all movies (with pagination and optional title filtering)
app.get('/api/movies', (req, res) => {
  const { page = 1, perPage = 10, title } = req.query; // Destructure query parameters
  db.getAllMovies(page, perPage, title)
    .then(movies => res.json(movies)) // Return the array of movies
    .catch(err => res.status(500).json({ error: err.message })); // Error handling
});

// GET /api/movies/:id - Fetch a specific movie by ID
app.get('/api/movies/:id', (req, res) => {
  db.getMovieById(req.params.id)
    .then(movie => {
      if (movie) res.json(movie); // Return the movie if found
      else res.status(404).json({ error: "Movie not found" }); // 404 if not found
    }) 
    .catch(err => res.status(500).json({ error: err.message })); // Error handling
});

// PUT /api/movies/:id - Update an existing movie by ID
app.put('/api/movies/:id', (req, res) => {
  db.updateMovieById(req.body, req.params.id)
    .then(() => res.status(204).send()) // 204 No Content if successful
    .catch(err => res.status(500).json({ error: err.message })); // Error handling
});

// DELETE /api/movies/:id - Delete a movie by ID
app.delete('/api/movies/:id', (req, res) => {
  db.deleteMovieById(req.params.id)
    .then(() => res.status(204).send()) // 204 No Content if successful
    .catch(err => res.status(500).json({ error: err.message })); // Error handling
});

// Send index.html for any unmatched route (for frontend routing)
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});