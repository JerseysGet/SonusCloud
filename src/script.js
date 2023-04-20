const body = document.querySelector("body");

const countOccurences = (str, char) => {
  return str.split("").filter((c) => c === char).length;
};

const path_prefix =
  "./" + "../".repeat(countOccurences(window.location.pathname, "/") - 2);
const get_path = (path) => {
  return path_prefix + path;
};

const get_nav = (selected) => {
  const nav = document.createElement("nav");

  const index_link_node = document.createElement("a");
  index_link_node.href = get_path("index.html");
  index_link_node.textContent = "HOME";

  const artists_link_node = document.createElement("a");
  artists_link_node.href = get_path("artists.html");
  artists_link_node.textContent = "ARTISTS";

  const about_link_node = document.createElement("a");
  about_link_node.href = get_path("about.html");
  about_link_node.textContent = "ABOUT";

  const search_link_node = document.createElement("a");
  search_link_node.href = get_path("search.html");
  search_link_node.textContent = "SEARCH";

  const dot_node = document.createElement("div");
  dot_node.classList.add("dot");

  if (selected === "index") {
    index_link_node.classList.add("selected");
  } else if (selected === "artists") {
    artists_link_node.classList.add("selected");
  } else if (selected === "about") {
    about_link_node.classList.add("selected");
  }

  nav.append(
    index_link_node,
    artists_link_node,
    about_link_node,
    search_link_node,
    dot_node
  );

  return nav;
};

const insertNavbar = () => {
  const navbar = document.createElement("div");
  navbar.classList.add("navbar");

  const logo = document.createElement("img");
  logo.src = get_path("assets/images/logo_big_light.png");
  logo.alt = "SoC";
  logo.classList.add("logo");
  navbar.appendChild(logo);
  const filename = window.location.pathname.split("/").pop().split(".")[0];

  if (["about", "artists", "index", "search"].includes(filename)) {
    navbar.appendChild(get_nav(filename));
  } else {
    navbar.appendChild(get_nav());
  }

  body.insertBefore(navbar, body.firstChild);
};

const insertFooter = () => {
  const footer = document.createElement("footer");

  const aboutLink = document.createElement("a");
  aboutLink.href = get_path("about.html");
  aboutLink.textContent = "ABOUT";

  const footerText = document.createElement("div");
  footerText.classList.add("text");
  footerText.textContent = "Made by Praneeth & Faisal";

  const Logo = document.createElement("img");
  Logo.src = get_path("assets/images/logo_small_light.png");
  Logo.alt = "logo";

  footer.append(aboutLink, footerText, Logo);
  body.appendChild(footer);
};

const getSongData = (songName) => {
  const url = `https://itunes.apple.com/search?term=${songName.replace(
    /\s+/g,
    "+"
  )}&media=music&limit=10`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.results.map(
        ({ trackName, artistName, artworkUrl100, trackTimeMillis }) => ({
          trackName,
          artistName,
          artworkUrl100,
          trackTimeMillis,
        })
      );
    })
    .catch((error) => console.log(error));
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
        const increment = (cur_pos) => {
          if (cur_pos == final.length) {
            happening = false;
          } else {
            h.textContent += final.charAt(cur_pos);
            setTimeout(increment.bind(null, cur_pos + 1), 69);
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

insertNavbar();
insertFooter();
animateHeaders();
