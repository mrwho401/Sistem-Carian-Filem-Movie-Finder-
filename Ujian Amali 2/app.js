const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const moviesGrid = document.getElementById('movies-grid');
const statusMessage = document.getElementById('status-message');
const suggestLinks = document.querySelectorAll('.suggest-link');

// Fungsi utama carian API TVMaze
async function searchMovies(query) {
    if (!query.trim()) {
        statusMessage.textContent = "Sila masukkan tajuk filem untuk memulakan carian.";
        moviesGrid.innerHTML = "";
        return;
    }

    // iii. Kendalikan keadaan "Loading" semasa data sedang diambil
    statusMessage.textContent = "Sedang memuatkan data...";
    statusMessage.style.display = "block";
    moviesGrid.innerHTML = "";

    try {
        // i. Endpoint API TVMaze
        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.length === 0) {
            statusMessage.textContent = `Tiada hasil carian ditemui untuk "${query}".`;
            return;
        }

        // Sembunyikan mesej status jika ada data
        statusMessage.style.display = "none";

        // ii. Paparkan maklumat Poster, Tajuk, dan Tahun Premiered
        data.forEach(item => {
            const show = item.show;
            
            // Semak jika ada imej poster, jika tiada guna placeholder imej kosong
            const posterSrc = show.image ? show.image.medium : 'https://via.placeholder.com/210x295?text=No+Image';
            
            // Dapatkan tahun sahaja daripada tarikh premiered (Contoh: "2015-10-12" -> "2015")
            const premieredYear = show.premiered ? show.premiered.split('-')[0] : 'N/A';
            const genreType = show.type ? show.type : 'Siri TV';

            // Bina elemen kad HTML
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="${posterSrc}" alt="${show.name}">
                <div class="movie-info">
                    <h3>${show.name}</h3>
                    <div class="movie-meta">
                        <span>${genreType}</span>
                        <span>${premieredYear}</span>
                    </div>
                </div>
            `;
            moviesGrid.appendChild(movieCard);
        });

    } catch (error) {
        console.error("Ralat mengambil data API:", error);
        statusMessage.textContent = "Sistem mengalami ralat. Sila cuba sebentar lagi.";
    }
}

// Event listener untuk butang carian
searchBtn.addEventListener('click', () => {
    searchMovies(searchInput.value);
});

// Event listener untuk butang 'Enter' pada papan kekunci
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchMovies(searchInput.value);
    }
});

// Event listener untuk pautan cadangan (Batman, Spider-man, dll)
suggestLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const queryText = e.target.textContent;
        searchInput.value = queryText;
        searchMovies(queryText);
    });
});