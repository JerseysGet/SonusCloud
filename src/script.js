const body = document.querySelector("body");

const countOccurences = (str, char) => {
  return str.split("").filter((c) => c === char).length;
};

const pathPrefix =
  "./" + "../".repeat(countOccurences(window.location.pathname, "/") - 2);
const getPath = (path) => {
  return pathPrefix + path;
};

const getNav = (selected) => {
  const nav = document.createElement("nav");

  const indexLinkNode = document.createElement("a");
  indexLinkNode.href = getPath("index.html");
  indexLinkNode.textContent = "HOME";

  const artistsLinkNode = document.createElement("a");
  artistsLinkNode.href = getPath("artists.html");
  artistsLinkNode.textContent = "ARTISTS";

  const aboutLinkNode = document.createElement("a");
  aboutLinkNode.href = getPath("about.html");
  aboutLinkNode.textContent = "ABOUT";

  const searchLinkNode = document.createElement("a");
  searchLinkNode.href = getPath("search.html");
  searchLinkNode.textContent = "SEARCH";

  const spotlightLinkNode = document.createElement("a");
  spotlightLinkNode.href = getPath("spotlight.html");
  spotlightLinkNode.textContent = "SPOTLIGHT";

  [
    indexLinkNode,
    artistsLinkNode,
    aboutLinkNode,
    searchLinkNode,
    spotlightLinkNode,
  ].forEach((node) => {
    node.addEventListener("mouseenter", () => {
      node.classList.add("nav_hover");
    });
    node.addEventListener("mouseleave", () => {
      node.classList.remove("nav_hover");
    });
  });

  const dotNode = document.createElement("div");
  dotNode.classList.add("dot");

  if (selected === "index") {
    indexLinkNode.classList.add("selected");
  } else if (selected === "artists") {
    artistsLinkNode.classList.add("selected");
  } else if (selected === "about") {
    aboutLinkNode.classList.add("selected");
  } else if (selected === "search") {
    searchLinkNode.classList.add("selected");
  } else if (selected === "spotlight") {
    spotlightLinkNode.classList.add("selected");
  }

  nav.append(
    indexLinkNode,
    artistsLinkNode,
    aboutLinkNode,
    searchLinkNode,
    spotlightLinkNode,
    dotNode
  );

  return nav;
};

const insertNavbar = () => {
  const navbar = document.createElement("div");
  navbar.classList.add("navbar");

  const logo = document.createElement("img");
  logo.src = getPath("assets/images/logo_big_light.png");
  logo.alt = "SoC";
  logo.classList.add("logo");
  navbar.appendChild(logo);
  const filename = window.location.pathname.split("/").pop().split(".")[0];

  if (["about", "artists", "index", "search", "spotlight"].includes(filename)) {
    navbar.appendChild(getNav(filename));
  } else {
    navbar.appendChild(getNav());
  }

  body.insertBefore(navbar, body.firstChild);
};

const insertFooter = () => {
  const footer = document.createElement("footer");

  const aboutLink = document.createElement("a");
  aboutLink.href = getPath("about.html");
  aboutLink.textContent = "ABOUT";

  const footerText = document.createElement("div");
  footerText.classList.add("text");
  footerText.textContent = "Made by Praneeth & Faisal";

  const Logo = document.createElement("img");
  Logo.src = getPath("assets/images/logo_small_light.png");
  Logo.alt = "logo";

  footer.append(aboutLink, footerText, Logo);
  body.appendChild(footer);
};

const getSongsData = async (songName) => {
  const url = `https://itunes.apple.com/search?term=${songName.replace(
    /\s+/g,
    "+"
  )}&media=music`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.results.map(
        ({
          trackName,
          artistName,
          artworkUrl100,
          trackTimeMillis,
          previewUrl,
          trackExplicitness,
        }) => ({
          trackName,
          artistName,
          artworkUrl100,
          trackTimeMillis,
          previewUrl,
          trackExplicitness,
        })
      );
    })
    .catch((error) => console.log(error));
};

const populateResults = async (
  songName,
  allowExplicit,
  maxDuration,
  applyFilters
) => {
  const resultsContainer = document.querySelector(".results");
  resultsContainer.innerHTML = "";
  let songsData = await getSongsData(songName);
  if (applyFilters) {
    if (!allowExplicit) {
      songsData = songsData.filter((songData) => {
        return songData.trackExplicitness !== "explicit";
      });
    }
    if (maxDuration) {
      songsData = songsData.filter((songData) => {
        return songData.trackTimeMillis < maxDuration * 60 * 1000;
      });
    }
  }
  if (songsData.length === 0) {
    let not_found_div = document.createElement("div");
    not_found_div.classList.add("not_found");
    not_found_div.textContent = "Sorry! No songs found.";
    resultsContainer.appendChild(not_found_div);
    return;
  }
  songsData.slice(0, 10).forEach((songData) => {
    let search_card = document.createElement("div");
    search_card.classList.add("search_card");

    let album_cover = document.createElement("div");
    album_cover.classList.add("album_cover");
    album_cover.style.backgroundImage = `url(${songData.artworkUrl100})`;

    let title = document.createElement("div");
    title.classList.add("title");
    title.textContent = songData.trackName;

    let subtitle = document.createElement("subtitle");
    subtitle.classList.add("subtitle");
    subtitle.textContent = songData.artistName;

    let audio = document.createElement("audio");
    audio.controls = "controls";
    audio.src = songData.previewUrl;

    search_card.append(album_cover, title, subtitle, audio);

    resultsContainer.appendChild(search_card);
  });
};

const isVisible = (el) => {
  let rect = el.getBoundingClientRect();

  return rect.top >= 0 && rect.bottom <= window.innerHeight;
};

const isInvisible = (el) => {
  let rect = el.getBoundingClientRect();

  return rect.top >= window.innerHeight || rect.bottom <= 0;
};

const onVisibilityChange = (el, onVisible, onInvisible) => {
  let oldVisible = true;
  let oldInvisible = true;
  return () => {
    let visible = isVisible(el);
    let invisible = isInvisible(el);

    if (!visible && !invisible) return;

    if (oldVisible && invisible) onInvisible();
    else if (oldInvisible && visible) setTimeout(onVisible, 150);

    oldVisible = visible;
    oldInvisible = invisible;
  };
};

const animateHeaders = () => {
  const headers = document.querySelectorAll(".header");
  headers.forEach((h) => {
    const final = h.textContent;
    let happening = false;
    const handler = onVisibilityChange(
      h,
      () => {
        h.textContent = "";
        if (happening) return;
        happening = true;
        const increment = (curPos) => {
          if (curPos == final.length) {
            happening = false;
          } else {
            h.textContent += final.charAt(curPos);
            setTimeout(increment.bind(null, curPos + 1), 69);
          }
        };
        increment(0);
      },
      () => {
        h.textContent = "";
      }
    );
    ["DOMContentLoaded", "load", "scroll", "resize"].forEach((ev) => {
      addEventListener(ev, handler, false);
    });
  });
};

const animateSearchBar = () => {
  const searchBarContainer = document.querySelector(".search_bar_container");
  const searchIcon = document.querySelector(".search_bar_container > svg");
  const searchBar = document.querySelector(".search_bar");
  searchBar.addEventListener("focus", () => {
    searchIcon.style.fill = "white";
    searchBarContainer.style.backgroundImage = `linear-gradient(rgb(10, 10, 10), rgb(10, 10, 10)), linear-gradient(175deg, var(--primary-desat) 10%, var(--secondary-desat) 80%)`;
  });

  searchBar.addEventListener("blur", () => {
    searchIcon.style.fill = "#757575";
    searchBarContainer.style.backgroundImage = "";
    searchBarContainer.style.backgroundColor = "rgb(20, 20, 20)";
  });
};

const animateInputs = () => {
  const reviewInputs = document.querySelectorAll(".review_input");
  reviewInputs.forEach((el) => {
    el.addEventListener("focus", () => {
      el.style.backgroundColor = "#0A0A0A";
    });

    el.addEventListener("blur", () => {
      el.style.backgroundColor = "rgb(20, 20, 20)";
    });
  });
};

animateInputs();
insertNavbar();
insertFooter();
animateHeaders();

if (window.location.pathname === "/src/search.html") {
  animateSearchBar();
  const inp = document.querySelector("input");
  const explicit_checkbox = document.querySelector(
    ".explicit_content_checkbox"
  );
  const max_duration_input = document.querySelector(".minutes");
  const apply_checkbox = document.querySelector(".apply_filters_checkbox");
  inp.addEventListener("keyup", ({ key }) => {
    if (key === "Enter") {
      (async () => {
        await populateResults(
          inp.value,
          explicit_checkbox.checked,
          max_duration_input.value,
          apply_checkbox.checked
        );
      })();
    }
  });
} else if (window.location.pathname === "/src/spotlight.html") {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tableBody = document.querySelector("tbody");
    const row = document.createElement("tr");
    const nameNode = document.createElement("td");
    nameNode.textContent = formData.get("name");
    const reviewNode = document.createElement("td");
    reviewNode.textContent = formData.get("review");
    const ratingNode = document.createElement("td");
    ratingNode.textContent = `${formData.get("rate")} stars`;
    row.append(nameNode, reviewNode, ratingNode);
    tableBody.appendChild(row);
  });
}
