import { data } from "./data.js";

data
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const courses = data.courses;

const container = document.getElementById("coursesContainer");

const techFilter = document.getElementById("technology");
const levelFilter = document.getElementById("level");

const searchFilter = document.getElementById("search");
const clearBtn = document.getElementById("clear");

const count = document.getElementById("courseCount");

/* LANGUAGE FLAGS */

const flags = document.querySelectorAll(".flag");
let selectedLang = "all";


/* PRICE RANGE */

const minRange = document.getElementById("minRange");
const maxRange = document.getElementById("maxRange");

const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");


/* DISPLAY COURSES */

function displayCourses(list){

container.innerHTML="";

count.textContent = `${list.length} courses found`;

if(list.length === 0){

container.innerHTML=`

<div class="noCourses">

No courses match your filters.

<span class="clearFilters" id="clearFilters">CLEAR FILTERS</span>

</div>

`;

document.getElementById("clearFilters").addEventListener("click",()=>{

clearBtn.click();

});

return;

}


list.forEach(course=>{

const card=document.createElement("div");

card.classList.add("course");

card.innerHTML = `

<div class="course-image">

<img src="${course.thumbnail}">

<div class="badges">
<span class="badge language">${course.language.toUpperCase()}</span>
${course.technologies?.[0] ? `<span class="badge">${course.technologies[0]}</span>` : ""}
</div>

<div class="levelBadge ${course.level}">
${course.level}
</div>

</div>

<div class="course-content">

<h3>${course.title}</h3>

<p class="price">MGA ${course.price}</p>

<p>${course.description}</p>

<div class="course-buttons">
<button class="learnMore">Learn more</button>
<button class="addCart">Add to cart</button>
</div>

</div>
`;

const btn=card.querySelector(".addCart");

btn.addEventListener("click", () => {
    addToCart(course);
});

container.appendChild(card);

});

}

displayCourses(courses);

function addToCart(course) {

    const exists = cart.some(c => c.id === course.id);

    if (exists) {
        showMessage("This course is already in your cart ❌");
        return;
    }

    cart.push(course);

    saveCart();

    showMessage("Course added to cart ✅");
}
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/* FILTER COURSES */

function filterCourses(){

const tech = techFilter.value;
const level = levelFilter.value;
const lang = selectedLang;

const min = parseInt(minRange.value);
const max = parseInt(maxRange.value);

const search = searchFilter.value.toLowerCase();

const filtered = courses.filter(course=>{

const matchTech =
tech==="all" || course.technologies.includes(tech);

const matchLevel =
level==="all" || course.level===level;

const matchLang =
lang==="all" || course.language===lang;

const matchPrice =
course.price >= min && course.price <= max;

const matchSearch =
course.title.toLowerCase().includes(search);

return matchTech && matchLevel && matchLang && matchPrice && matchSearch;

});

displayCourses(filtered);

}


/* TECHNOLOGY & LEVEL */

techFilter.addEventListener("change",filterCourses);
levelFilter.addEventListener("change",filterCourses);


/* SEARCH */

searchFilter.addEventListener("input",filterCourses);


/* FLAGS LANGUAGE */

flags.forEach(flag=>{

    flag.addEventListener("mouseenter",()=>{

        if(!document.querySelector(".flag.active")){
            flags.forEach(f=>{
                if(f !== flag){
                    f.classList.add("dim");
                }
            });
        }

    });

    flag.addEventListener("mouseleave",()=>{

        if(!document.querySelector(".flag.active")){
            flags.forEach(f=>f.classList.remove("dim"));
        }

    });

    flag.addEventListener("click",()=>{

        flags.forEach(f=>{
            f.classList.remove("active");
            f.classList.add("dim");
        });

        flag.classList.add("active");
        flag.classList.remove("dim");

        selectedLang = flag.dataset.lang;

        filterCourses();

    });

});


/* PRICE RANGE */

function updatePrice(){

let min = parseInt(minRange.value);
let max = parseInt(maxRange.value);

if(min > max){

minRange.value = max;
min = max;

}

minPrice.textContent = min.toLocaleString();
maxPrice.textContent = max.toLocaleString();

filterCourses();

}

minRange.addEventListener("input",updatePrice);
maxRange.addEventListener("input",updatePrice);

updatePrice();


/* CLEAR FILTER */

clearBtn.addEventListener("click",()=>{

techFilter.value="all";
levelFilter.value="all";

selectedLang="all";

flags.forEach(f=>{
    f.classList.remove("active");
    f.classList.remove("dim");
});

minRange.value=0;
maxRange.value=300000;

searchFilter.value="";

updatePrice();

displayCourses(courses);

});

const ranges = document.querySelectorAll('.priceBox input[type="range"]');

ranges.forEach(range => {

    function updateRange() {
        const min = range.min || 0;
        const max = range.max || 100;
        const val = range.value;

        const percent = ((val - min) / (max - min)) * 100;

        range.style.background = `linear-gradient(to right, 
            var(--color-red) 0%, 
            var(--color-red) ${percent}%, 
            #d1d5db ${percent}%, 
            #d1d5db 100%)`;
    }

    range.addEventListener("input", updateRange);

    // init
    updateRange();
});

const toast = document.getElementById("toast");

function showMessage(msg) {

    toast.textContent = msg;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}