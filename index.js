const searchButton = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-input');
const videoList = document.querySelector('.video-list');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const pageNumber = document.querySelector('.page-number');
const googleSearch = document.querySelector('.google-search');
const googleSearchBtn = document.querySelector('.google-search-btn');

const url = "https://customsearch.googleapis.com/customsearch/v1"
const apiKey = "AIzaSyDWIPzV-Xg3A2EPyftQyRKTHo9_1100Z8Q";
const cxId = "22ea306c9f83a4126";

let currentPage = 1;
let totalPages = 0;
const resultsPerPage = 10;

const getData = async () => {

    const params = {
        key: apiKey,
        cx: cxId,
        q: searchInput.value,
        siteSearch: "youtube.com",
        orTerms: "music",
        start: ((currentPage - 1) * resultsPerPage + 1).toString(),
        num: resultsPerPage.toString()
    };

    const response = await fetch(url + "?" + new URLSearchParams(params));
    const data = await response.json();
    totalPages = data.searchInformation.totalResults;
    addItems(data.items);
}

function addItems(data) {
    videoList.innerHTML = '';

    data.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("item");

        const imgUrl = item.pagemap?.cse_image?.[0]?.src;
        const title = item.title;
        const artist = item.pagemap?.person?.[0]?.name || "Unknown artist"
        const views = getViewsNumber(item.pagemap?.videoobject?.[0]?.interactioncount);

        div.innerHTML = `
            <img class="img" src="${imgUrl}" alt="${title}">
            <div class="info">
                <h4 class='info-title'>${title}</h4>
                <p class='info-artist'>${artist}</p>
                <div class='info-footer'>
                  <img src="youtube-icon.svg" alt="youtube icon">
                  <span>Youtube.com</span>
                  <p class='info-views'>${views} views</p>
                </div> 
            </div>
        `;

        videoList.appendChild(div);


        pageNumber.textContent = currentPage > 1 ? currentPage.toString() : "";
        pageNumber.style.display = currentPage > 1 ? "block" : "none";

        prevBtn.style.display = currentPage > 1 ? "flex" : "none";
        nextBtn.style.display = currentPage < totalPages ? "flex" : "none";

        googleSearch.style.display = 'block';
        googleSearchBtn.innerHTML = `
            <img src="search-icon.svg" alt="search">
            Search <strong>${searchInput.value}</strong> on Google
        `
    });

}

const getViewsNumber = (num) => {
    if (num === undefined) {
        return "unknown"
    }
    if (num.length > 6) {
        return num.slice(0, -6) + "m"
    }
    if (num.length > 3 && num.length <= 6) {
        return num.slice(0, -3) + "k"
    }
    if (num.length <= 3 ) {
        return num
    }
}


searchButton.addEventListener('click', (e) => {
    e.preventDefault()
    getData();
})

nextBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (currentPage < totalPages) {
        currentPage++;
        getData();
    }
})

prevBtn.addEventListener("click", (e) => {
    e.preventDefault()
    if (currentPage > 1) {
        currentPage--;
        getData();
    }
});

googleSearchBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const url = `https://www.google.com/search?q=${searchInput.value}`;
    window.open(url, "_blank")
});