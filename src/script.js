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

  const dot_node = document.createElement("div");
  dot_node.classList.add("dot");

  if (selected === "index") {
    index_link_node.classList.add("selected");
  } else if (selected === "artists") {
    artists_link_node.classList.add("selected");
  } else if (selected === "about") {
    about_link_node.classList.add("selected");
  }

  nav.append(index_link_node, artists_link_node, about_link_node, dot_node);

  return nav;
};

const insert_navbar = () => {
  const navbar = document.createElement("div");
  navbar.classList.add("navbar");

  const navbar_logo = document.createElement("img");
  navbar_logo.src = get_path("assets/images/logo_big_light.png");
  navbar_logo.alt = "SoC";
  navbar_logo.classList.add("logo");
  navbar.appendChild(navbar_logo);
  const filename = window.location.pathname.split("/").pop().split(".")[0];

  if (["about", "artists", "index"].includes(filename)) {
    navbar.appendChild(get_nav(filename));
  } else {
    navbar.appendChild(get_nav());
  }

  body.insertBefore(navbar, body.firstChild);
};

const insert_footer = () => {
  const footer = document.createElement("footer");

  const footer_about_link = document.createElement("a");
  footer_about_link.href = get_path("about.html");
  footer_about_link.textContent = "ABOUT";

  const footer_text = document.createElement("div");
  footer_text.classList.add("text");
  footer_text.textContent = "Made by Praneeth & Faisal";

  const footer_logo = document.createElement("img");
  footer_logo.src = get_path("assets/images/logo_small_light.png");
  footer_logo.alt = "logo";

  footer.append(footer_about_link, footer_text, footer_logo);
  body.appendChild(footer);
};
insert_navbar();
insert_footer();
