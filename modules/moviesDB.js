const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  plot: String,
  genres: [String],
  runtime: Number,
  cast: [String],
  num_mflix_comments: Number,
  poster: String,
  title: String,
  fullplot: String,
  languages: [String],
  released: Date,
  directors: [String],
  rated: String,
  awards: {
    wins: Number,
    nominations: Number,
    text: String
  },
  lastupdated: Date,
  year: Number,
  imdb: {
    rating: Number,
    votes: Number,
    id: Number
  },
  countries: [String],
  type: String,
  tomatoes: {
    viewer: {
      rating: Number,
      numReviews: Number,
      meter: Number
    },
    dvd: Date,
    lastUpdated: Date
  }
}
);
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10,             // Adjust the pool size (number of connections in the pool)
  connectTimeoutMS: 10000,   // Connection timeout in milliseconds
  socketTimeoutMS: 45000     // How long MongoDB will wait for responses from the server
};

module.exports = class MoviesDB {
  constructor() {
    // We don't have a `Movie` object until initialize() is complete
    this.Movie = null;
  }

  // Pass the connection string to `initialize()`
  initialize(connectionString) {
    return new Promise((resolve, reject) => {
      if (!connectionString) {
        reject(new Error('MongoDB connection string is required'));
      }
  
      const db = mongoose.createConnection(
        connectionString,
        options
      );
      
  
      db.once('error', (err) => {
        reject(new Error(`Database connection error: ${err.message}`));
      });
      db.once('open', () => {
        this.Movie = db.model("movies", movieSchema);
        resolve();
      });
    });
  }

  async addNewMovie(data) {
    if (!data.title || !data.year) {
      throw new Error('Title and Year are required fields');
    }
    const newMovie = new this.Movie(data);
    await newMovie.save();
    return newMovie;
  }

  getAllMovies(page, perPage, title) {
    let findBy = title ? { title: { $regex: title, $options: 'i' } } : {}; // Title filter with regex for partial matching
  
    if (+page && +perPage) {
      return this.Movie.find(findBy)
        .sort({ year: +1 })
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .exec()
        .then((movies) => {
          if (movies && movies.length > 0) {
            return movies;
          } else {
            return []; // Return empty array if no movies found
          }
        });
    }
  
    return Promise.reject(new Error('page and perPage query parameters must be valid numbers'));
  }

  getMovieById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Promise.reject(new Error('Invalid movie ID format'));
    }
    return this.Movie.findOne({ _id: id }).exec();
  }

  updateMovieById(data, id) {
    return this.Movie.updateOne({ _id: id }, { $set: data }).exec();
  }

  deleteMovieById(id) {
    return this.Movie.deleteOne({ _id: id }).exec();
  }
}