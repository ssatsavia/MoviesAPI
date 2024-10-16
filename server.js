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
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();


dotenv.config();
app.use(cors());
app.use(express.json());

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

  app.get('/', (req, res) => {
    res.json({ message: "API Listening" });
});

// POST /api/movies - Add a new movie
app.get('/api/movies', (req, res) => {
  const { page = 1, perPage = 5, title } = req.query;
  db.getAllMovies(page, perPage, title)
    .then((movies) => {
      if (!movies || movies.length === 0) {
        res.status(404).json({ error: 'No movies found' });
      } else {
        res.json(movies);
      }
    })
    .catch((err) => {
      console.error('Error retrieving movies:', err); // Detailed log
      res.status(500).json({ error: 'Failed to retrieve movies' });
    });
});
  
  // GET /api/movies - Get all movies with pagination and optional title filter
  app.get('/api/movies', (req, res) => {
    const { page = 1, perPage = 5, title } = req.query; // default values for pagination
    db.getAllMovies(page, perPage, title)
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // GET /api/movies/:id - Get a movie by ID
  app.get('/api/movies/:id', (req, res) => {
    const { id } = req.params; // Get the movie ID from the URL parameter
  
    db.getMovieById(id)
      .then((movie) => {
        if (movie) {
          res.json(movie); // Return the movie object if found
        } else {
          res.status(404).json({ error: 'Movie not found' }); // 404 if the movie is not found
        }
      })
      .catch((err) => {
        res.status(500).json({ error: 'Failed to retrieve the movie', message: err.message }); // 500 for server errors
      });
  });
  
  // PUT /api/movies/:id - Update a movie by ID
  app.put('/api/movies/:id', async (req, res) => {
    try {
      const updatedMovie = await db.updateMovieById(req.body, req.params.id);
      if (updatedMovie.matchedCount > 0) {
        res.json({ message: 'Movie updated successfully' });
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to update the movie', message: err.message });
    }
  });
  
  // DELETE /api/movies/:id - Delete a movie by ID
  app.delete('/api/movies/:id', async (req, res) => {
    try {
      const result = await db.deleteMovieById(req.params.id);
      if (result.deletedCount > 0) {
        res.status(204).send(); // 204 No Content
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete the movie', message: err.message });
    }
  });
  

app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});