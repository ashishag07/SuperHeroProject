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
------------------------------------------------------------------------*/
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

const favouriteHeroes = document.getElementById("favourite-heroes");
let favHeroesList = JSON.parse(localStorage.getItem("favHeroes"));
console.log(favHeroesList);
displayFavHeroes(favHeroesList);

/*----------------------------------------------------------------------
function to display favorite heroes 
------------------------------------------------------------------------*/
function displayFavHeroes(favHeroesList) {
  favouriteHeroes.innerHTML = "";
  if (favHeroesList.length === 0) {
    favouriteHeroes.textContent = "No character present in favourite";
    favouriteHeroes.style.backgroundColor = "#353a4a";
  } else {
    favHeroesList.forEach((hero) => {
      favouriteHeroes.insertAdjacentHTML("beforeend", insertHeroCard(hero));
    });

    // add event listner
    const removeFavBtn = document.querySelectorAll(".remove-fav-btn");
    removeFavBtn.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let heroId;
        if (e.target.parentElement.id) {
          heroId = e.target.parentElement.id;
        } else {
          heroId = e.target.id;
        }
        const heroObj = favHeroesList.filter(
          (hero) => hero.id != Number(heroId.substr(2))
        );
        localStorage.setItem("favHeroes", JSON.stringify(heroObj));

        displayFavHeroes(JSON.parse(localStorage.getItem("favHeroes")));
      });
    });
  }
}

/*-----------------------------------------------------------------------
function to provide the favorite hero whic is to be insered into the dom
-------------------------------------------------------------------------*/
function insertHeroCard(heroObj) {
  const thumbnailURL =
    heroObj.thumbnail.path + "." + heroObj.thumbnail.extension;

  return `
  <div class="favourite-hero-card">
            <div class="hero-img-container">
              <img
                src=${thumbnailURL}
                alt=""
                class="fav-hero-img"
              />
            </div>

            <div class="hero-info-container">
              <span class="fav-hero-name">${heroObj.name}</span>
              <span class="fav-hero-info">ID: ${heroObj.id}</span>
              <span class="fav-hero-info">Comics: ${
                heroObj.comics.available
              }</span>
              <span class="fav-hero-info">Series: ${
                heroObj.series.available
              }</span>
              <span class="fav-hero-info">Stories: ${
                heroObj.stories.available
              }</span>
            </div>

            <button class="hero-btn remove-fav-btn" id=${"id" + heroObj.id}>
              <i class="fa-solid fa-heart-circle-xmark"></i>
              remove favourite
            </button>
          </div>
  `;
}
