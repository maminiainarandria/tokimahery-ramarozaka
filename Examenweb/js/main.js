import { data } from "./data.js";

["bioText1", "bioText2"].forEach((id, i) => {
  document.getElementById(id).textContent = data["aboutMe_part" + (i + 1)];
});

data.overview.forEach((item, i) => {
  const n = i + 1;

  document.getElementById("stat" + n).textContent = item.number;
  document.querySelector(".statLabel" + n).textContent = item.label;
});

data.experiences.forEach((exp, i) => {
  const n = i + 1;

  document.getElementById("expYear" + n).textContent = exp.year;
  document.getElementById("expRole" + n).textContent = exp.role;
  document.getElementById("expOrg" + n).textContent = exp.org;
  document.getElementById("expDesc" + n).textContent = exp.desc;
})

const menuToggle = document.querySelector(".menu_toggle");
const navbar = document.querySelector(".navbar");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navbar.classList.toggle("active");
});




