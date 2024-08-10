/***************************
  Api credentials:
  ----------------  
  user defined string   : const ts = "AshishString"
  public key            : 4375433bf19f245517cdb61d99824999
  private key           : 255d32fd57754b1d22db60000a4777ea29ee6096
  md5                   : (ts + privateKey + publicKey)
  AshishString255d32fd57754b1d22db60000a4777ea29ee60964375433bf19f245517cdb61d99824999
  hash                  : 925292159721194f37e48f5dba33a1bc
 ************************ */

// Global variables
const ts = "AshishString"; // user defined string

// dom elements
const mainInputSearch = document.querySelector(".main-search-input");
const searchResults = document.getElementById("main-search-results");

// add event listner to the input search for hero
mainInputSearch.addEventListener("input", (e) => {
  searchHero(e.target.value);
});

/*---------------------------------------------------------------------
  searchHero function is used for:
  -to call the api based on the input
  -also consists displaySearchHero function to display the api results
-----------------------------------------------------------------------*/
async function searchHero(event) {
  if (event.length === 0) {
    // when there is no data to display set the searchResults
    searchResults.style.display = "none";
    return;
  }

  // when there is data to display set the searchResults display to flex
  searchResults.style.display = "flex";

  // api url based on input
  const url = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${event}&apikey=4375433bf19f245517cdb61d99824999&hash=925292159721194f37e48f5dba33a1bc&ts=AshishString`;

  // call the api using fetch
  const response = await fetch(url);
  const jsonData = await response.json();
  const result = jsonData.data.results;

  // display the search hero list
  console.log(result);
  displaySearchHero(result);
}

/*-------------------------------------------------------------------------------
  displaySearchHero function is used to display all heroes availaible in the result
---------------------------------------------------------------------------------*/
function displaySearchHero(result) {
  searchResults.innerHTML = "";
  result.forEach((hero) => {
    //insert all the heroes appear during search results
    searchResults.insertAdjacentHTML("beforeend", insertHero(hero));
  });

  // add event listner to the add-to-fav button
  const addToFavBtn = document.querySelectorAll(".add-fav");
  addToFavBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // get the id of the clicked button
      let heroId;
      if (e.target.parentElement.id) {
        heroId = e.target.parentElement.id;
      } else {
        heroId = e.target.id;
      }

      // get the favHeroesList array from the local storage
      let favHeroesList = JSON.parse(localStorage.getItem("favHeroes"));

      // find the complete hero object associated with the heroId
      const heroObj = result.find(
        (hero) => hero.id === Number(heroId.substr(2))
      );

      // push the hero object into the favHeroesList array
      favHeroesList.push(heroObj);
      // update the favHeroes variable in local storage
      localStorage.setItem("favHeroes", JSON.stringify(favHeroesList));

      // get the current clicked button
      const currBtn = document.getElementById(`${heroId}`);
      // get the container in which current clicked button exists
      const currContainer = currBtn.parentElement;
      // remove the current clicked button
      currBtn.remove();

      const btnToAppend = `<button class="fav-btn remove-fav" id=${heroId}>
            <i class="fa-solid fa-heart-circle-xmark nav-link-icon"></i>
            <span>Remove Favourite</span>
          </button>
            `;
      // insert the newly created button to the container
      currContainer.insertAdjacentHTML("beforeend", btnToAppend);

      // after append reload the page to show the new changes
      displaySearchHero(result);
    });
  });

  // add event listner to the remove fovourite btn
  const removeFavBtn = document.querySelectorAll(".remove-fav");
  removeFavBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // get the id of the clicked button
      let heroId;
      if (e.target.parentElement.id) {
        heroId = e.target.parentElement.id;
      } else {
        heroId = e.target.id;
      }

      // get the favHeroesList from the localStorage
      let favHeroesList = JSON.parse(localStorage.getItem("favHeroes"));
      // in order to remove the hero from favHeroes, filter out the hero from the favHeroesList
      const heroObj = favHeroesList.filter(
        (hero) => hero.id != Number(heroId.substr(2))
      );
      // update the newList of favHeroes to the local storage
      localStorage.setItem("favHeroes", JSON.stringify(heroObj));

      // get the current clicked button
      const currBtn = document.getElementById(`${heroId}`);
      // get the container in which current clicked button exists
      const currContainer = currBtn.parentElement;
      // remove the current clicked button
      currBtn.remove();

      const btnToAppend = `<button class="fav-btn add-fav" id=${heroId}>
            <i class="fa-solid fa-heart nav-link-icon"></i>
            <span>Add to Favourite</span>
          </button>
            `;

      // insert the newly created button to the container
      currContainer.insertAdjacentHTML("beforeend", btnToAppend);

      // after append reload the page to show the new changes
      displaySearchHero(result);
    });
  });
}

/*----------------------------------------------------------------------------
function to insert the hero into the search results
------------------------------------------------------------------------------*/
function insertHero(hero) {
  // in order to check if the hero is already exists in favourite list, get the favHeroesList from the local storage
  let favHeroesList = localStorage.getItem("favHeroes");

  if (favHeroesList == null) {
    favHeroesList = [];

    // update the favHeroes with the empty favHeroesList
    localStorage.setItem("favHeroes", JSON.stringify(favHeroesList));
  } else {
    // get the favHeroesList from the local storage
    favHeroesList = JSON.parse(localStorage.getItem("favHeroes"));
  }

  const thumbnailURL = hero.thumbnail.path + "." + hero.thumbnail.extension;
  return `<div class="search-hero-container">
          <div class="hero-img-container">
            <img
              src=${thumbnailURL}
              alt=""
              class="hero-img"
            />
          </div>
          <span class="search-hero-title">${hero.name}</span>
          ${
            favHeroesList.find((ele) => ele.id === hero.id)
              ? `<button class="fav-btn remove-fav" id=${"id" + hero.id}>
            <i class="fa-solid fa-heart-circle-xmark nav-link-icon"></i>
            <span>Remove Favourite</span>
          </button>
            `
              : `<button class="fav-btn add-fav" id=${"id" + hero.id}>
            <i class="fa-solid fa-heart nav-link-icon"></i>
            <span>Add to Favourite</span>
          </button>
            `
          }
          
        </div>
  `;
}

/********************************************
light and dark theme
dynamically changing the color scheme
********************************************/

// get the root
const root = document.getElementById("root");

// get the theme Icon
const [themeIcon] = document.getElementsByClassName("theme-icon");

/*----------------------------------------------------------------------
function to set the color scheme light/dark
-----------------------------------------------------------------------*/
function setColorScheme(mode) {
  if (mode === "dark") {
    root.setAttribute("color-scheme", "dark");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    root.setAttribute("color-scheme", "light");
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
}

// set the color scheme based on local storage value
if (localStorage.getItem("mode") === "dark") {
  setColorScheme("dark");
} else {
  setColorScheme("light");
}

// add event listner to themeIcon to set the local storage and color scheme
themeIcon.addEventListener("click", () => {
  if (localStorage.getItem("mode") === "light") {
    localStorage.setItem("mode", "dark");
    setColorScheme("dark");
  } else {
    localStorage.setItem("mode", "light");
    setColorScheme("light");
  }
});
