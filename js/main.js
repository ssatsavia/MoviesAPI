let page = 1;  // Current page the user is viewing
const perPage = 10;  // Number of movies per page
async function loadMovieData(title = null) {
    const url = title 
    ? `https://movies-api-one-roan.vercel.app/api/movies?page=1&perPage=${perPage}&title=${title}`
    : `https://movies-api-one-roan.vercel.app/api/movies?page=${page}&perPage=${perPage}`;


        try {
            const response = await fetch(url);
            const movies = await response.json();
    
            updateMovieTable(movies);
    
            document.querySelector("#current-page").innerText = page;
            
            // If searching by title, hide pagination
            if (title) {
                document.querySelector(".pagination").classList.add("d-none");
                page = 1;
            } else {
                document.querySelector(".pagination").classList.remove("d-none");
            }
        } catch (error) {
            console.error("Error loading movie data:", error);
        }
    }
    function updateMovieTable(movies) {
        const tbody = document.querySelector("#moviesTable tbody");
        tbody.innerHTML = "";  // Clear the existing content
    
        const rows = movies.map(movie => `
            <tr data-id="${movie._id}">
                <td>${movie.year || "N/A"}</td>
                <td>${movie.title || "N/A"}</td>
                <td>${movie.plot || "N/A"}</td>
                <td>${movie.rated || "N/A"}</td>
                <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, "0")}</td>
            </tr>
        `).join('');
    
        tbody.innerHTML = rows;
    
        // Add click event listener to each row to load movie details
        document.querySelectorAll('#moviesTable tbody tr').forEach(row => {
            row.addEventListener('click', () => {
                const movieId = row.getAttribute('data-id');
                loadMovieDetails(movieId);
            });
        });
        document.querySelector('#current-page').innerHTML = page;
    }
    async function loadMovieDetails(movieId) {
        try {
            const response = await fetch(`https://web422-2jx9.onrender.com/api/movies/${movieId}`);
            const movie = await response.json();
    
            // Populate the modal with movie details
            document.querySelector(".modal-title").innerText = movie.title;
            document.querySelector(".modal-body").innerHTML = `
                <img class="img-fluid w-100" src="${movie.poster}" alt="${movie.title}"><br><br>
                <strong>Directed By:</strong> ${movie.directors.join(", ")}<br><br>
                <p>${movie.fullplot}</p>
                <strong>Cast:</strong> ${movie.cast?.join(", ") || "N/A"}<br><br>
                <strong>Awards:</strong> ${movie.awards?.text || "N/A"}<br>
                <strong>IMDB Rating:</strong> ${movie.imdb?.rating || "N/A"} (${movie.imdb?.votes || "N/A"} votes)
            `;
            
            // Show the modal
            const modal = new bootstrap.Modal(document.querySelector("#detailsModal"));
            modal.show();
        } catch (error) {
            console.error("Error loading movie details:", error);
        }
    }
    document.querySelector("#previous-page").addEventListener("click", function() {
        if (page > 1) {
            page--;
            loadMovieData();
        }
    });
    
    document.querySelector("#next-page").addEventListener("click", function() {
        page++;
        loadMovieData();
    });
    document.querySelector("#searchForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const title = document.querySelector("#title").value.trim();
        if (title) {
            loadMovieData(title);
        }
    });
    
    // Clear form and load all movies
    document.querySelector("#clearForm").addEventListener("click", function() {
        document.querySelector("#title").value = "";
        loadMovieData();
    });
    document.addEventListener("DOMContentLoaded", function() {
        loadMovieData(); // Load first page of movies on page load
    });