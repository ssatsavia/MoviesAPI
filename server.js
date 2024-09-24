const express = require('express'); 
const app = express(); 
const cors = require('cors');
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();


require('dotenv').config(); 

const HTTP_PORT = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "API Listening" });
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});



// routes

app.post('/api/movies', (req, res) => {
    db.addNewMovie(req.body)
      .then((newMovie) => {
        res.status(201).json(newMovie); // 201 Created
      })
      .catch((err) => {
        res.status(500).json({ error: err.message }); // 500 Internal Server Error
      });
  });
  

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

  app.get('/api/movies/:id', (req, res) => {
    db.getMovieById(req.params.id)
      .then((movie) => {
        if (movie) {
          res.json(movie);
        } else {
          res.status(404).json({ error: "Movie not found" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  app.put('/api/movies/:id', (req, res) => {
    db.updateMovieById(req.body, req.params.id)
      .then(() => {
        res.status(204).send(); // 204 No Content
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  
  app.delete('/api/movies/:id', (req, res) => {
    db.deleteMovieById(req.params.id)
      .then(() => {
        res.status(204).send(); // 204 No Content
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));