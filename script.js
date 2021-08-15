const resultsNav = document.getElementById("resultsNav");
const favouritesNav = document.getElementById("favouritesNav");
const imageContainer = document.querySelector(".image-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

// NASA API
const count = 10;
const apiKey = "myBCYemdUPBRztdCPtrkWDHA8F2zXsGqkolSI3RG";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favourites = {};

function showContent(page) {
  window.scrollTo({ top: 0, behavior: "instant" });
  loader.classList.add("hidden");
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favouritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favouritesNav.classList.remove("hidden");
  }
}
function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favourites);

  currentArray.forEach(result => {
    // card container
    const card = document.createElement("div");
    card.classList.add("card");
    // Link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    // Image
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "NASA Picture of the day!";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    // Card Body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Card title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    // Save Text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Add to Favourites";
      saveText.setAttribute("onclick", `saveFavourites('${result.url}')`);
    } else {
      saveText.textContent = "Remove Favourites";
      saveText.setAttribute("onclick", `removeFavourites('${result.url}')`);
    }
    // Card Text
    const cardText = document.createElement("p");
    cardText.textContent = result.explanation;
    // Footer Container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    // Date
    const date = document.createElement("strong");
    date.textContent = result.date;
    // Copyright
    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = `  ${copyrightResult}`;
    // Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imageContainer.appendChild(card);
  });
}

function updateDOM(page) {
  // Get favourites from localstorage
  if (localStorage.getItem("nasaFavourites")) {
    favourites = JSON.parse(localStorage.getItem("nasaFavourites"));
  }
  imageContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
}

//  Get 10 images from NASA API
async function getNasaPictures() {
  // Show loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM("results");
  } catch (error) {
    //error
  }
}

// Add result to favourite
function saveFavourites(itemUrl) {
  //  Loop though results array to select favourites
  resultsArray.forEach(item => {
    if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
      favourites[itemUrl] = item;
      // Show save confirmation for 2 seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // Set favourites in local storage
      localStorage.setItem("nasaFavourites", JSON.stringify(favourites));
    }
  });
}
// Remove item from favourites
function removeFavourites(itemUrl) {
  if (favourites[itemUrl]) {
    delete favourites[itemUrl];
    localStorage.setItem("nasaFavourites", JSON.stringify(favourites));
    updateDOM("favourites");
  }
}

// on load
getNasaPictures();
