const allData = document.getElementById("data");
const searchSection = document.getElementById("searchSection");
let submitBtn;
let nameInput = document.querySelector("#name");
let emailInput = document.querySelector("#email");
let phoneInput = document.querySelector("#phone");
let ageInput = document.querySelector("#age");
let passwordInput = document.querySelector("#password");
let repasswordInput = document.querySelector("#repassword");

function openNav() {
  $("nav").animate({ left: 0 }, 500);
  $(".open-close-icon").removeClass("fa-align-justify");
  $(".open-close-icon").addClass("fa-x");
}

function closeNav() {
  const width = $("nav .tab").outerWidth();
  $("nav").animate({ left: -width }, 500);
  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");
}

closeNav();

$("nav .open-close-icon").on("click", () => {
  if ($("nav").css("left") == "0px") {
    closeNav();
  } else {
    openNav();
  }
});

async function getMainMeals() {
  $(".loading").removeClass("d-none");
  const api = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  const response = await api.json();
  displayMeals(response.meals);
  $(".loading").addClass("d-none");
}

getMainMeals();

function displayMeals(arr) {
  let box = ``;
  for (let i = 0; i < arr.length; i++) {
    box += `<div class="col-md-3">
                    <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2">
                        <img src="${arr[i].strMealThumb}" class="w-100" alt>
                        <div class="layer position-absolute d-flex align-items-center justify-content-center text-black p-2">
                            <h3>${arr[i].strMeal}</h3>
                        </div>
                    </div>
                </div>`;
  }
  allData.innerHTML = box;
}

async function getMealDetails(mealId) {
  allData.innerHTML = "";
  searchSection.innerHTML = "";
  $(".inner").removeClass("d-none");

  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let res = await api.json();

  displayMealDeatails(res.meals[0]);
  $(".inner").addClass("d-none");
}

function displayMealDeatails(meal) {
  // allData.innerHTML = "";
  searchSection.innerHTML = "";
  let ingredients = ``;
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }
  let tags = meal.strTags?.split(",");
  if (!tags) tags = [];
  let myTags = "";
  for (let i = 0; i < tags.length; i++) {
    myTags += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }
  let myMeal = ` <div class="col-md-4 text-white">
                    <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                        alt="">
                    <h2>${meal.strMeal}</h2>
                  </div>
                  <div class="col-md-8 text-white">
                    <h2>Instructions</h2>
                    <p>${meal.strInstructions}</p>
                    <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                    <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                    <h3>Recipes :</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap">
                        ${ingredients}
                    </ul>

                    <h3>Tags :</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap">
                        ${myTags}
                    </ul>

                    <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                    <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
                  </div>`;
  allData.innerHTML = myMeal;
}

function searchInputs() {
  searchSection.innerHTML = `<div class="row py-4">
        <div class="col-md-6">
          <input
            onkeyup="searchByName(this.value)"
            placeholder="Search by Name"
            class="form-control bg-transparent text-white inp"
            type="text"
          />
        </div>
        <div class="col-md-6">
          <input
            onkeyup="searchByFirstLetter(this.value)"
            placeholder="Search by First Letter"
            class="form-control bg-transparent text-white inp"
            maxlength="1"
            type="text"
          />
        </div>
      </div>`;

  allData.innerHTML = "";
}

async function searchByName(name) {
  $(".inner").removeClass("d-none");

  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  let res = await api.json();
  if (res.meals) {
    displayMeals(res.meals);
  } else {
    displayMeals([]);
  }
  $(".inner").addClass("d-none");
}

async function searchByFirstLetter(name) {
  $(".inner").removeClass("d-none");

  name == "" ? (name = "a") : "";

  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${name}`
  );
  let res = await api.json();
  if (res.meals) {
    displayMeals(res.meals);
  } else {
    displayMeals([]);
  }
  $(".inner").addClass("d-none");
}

async function getCategories() {
  $(".inner").removeClass("d-none");
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );

  let res = await api.json();
  displayCategories(res.categories);
  $(".inner").addClass("d-none");
}

function displayCategories(arr) {
  let myData = ``;
  for (let i = 0; i < arr.length; i++) {
    myData += `<div class="col-md-3">
            <div
              onclick="getCategMeal('${arr[i].strCategory}')"
              class="meal position-relative overflow-hidden rounded-2"
            >
              <img src="${arr[i].strCategoryThumb}" class="w-100" alt="" />
              <div class="layer position-absolute text-center p-2 text-black">
                <h3>${arr[i].strCategory}</h3>
                <p>${arr[i].strCategoryDescription
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")}</p>
              </div>
            </div>
          </div>`;
  }
  allData.innerHTML = myData;
}

async function getCategMeal(cat) {
  allData.innerHTML = "";
  $(".inner").removeClass("d-none");

  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
  );
  let res = await api.json();

  displayMeals(res.meals.slice(0, 20));
  $(".inner").addClass("d-none");
}

async function getArea() {
  $(".inner").removeClass("d-none");
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let res = await api.json();
  displayAreas(res.meals);
  $(".inner").addClass("d-none");
}

function displayAreas(arr) {
  let myData = ``;
  for (let i = 0; i < arr.length; i++) {
    myData += `<div class="col-md-3 text-white">
            <div onclick="getMealsOfArea('${arr[i].strArea}')" class="text-center rounded-2">
              <i class="fa-solid fa-house-laptop fa-4x"></i>
              <h3>${arr[i].strArea}</h3>
            </div>
          </div>`;
  }
  allData.innerHTML = myData;
}

async function getMealsOfArea(area) {
  allData.innerHTML = "";
  $(".inner").removeClass("d-none");
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let res = await api.json();
  displayMeals(res.meals.slice(0, 20));
  $(".inner").addClass("d-none");
}

async function getIngredients() {
  allData.innerHTML = "";
  searchSection.innerHTML = "";
  $(".inner").removeClass("d-none");
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let res = await api.json();
  displayIngredients(res.meals.slice(0, 20));
  $(".inner").addClass("d-none");
}

function displayIngredients(arr) {
  myData = ``;
  for (let i = 0; i < arr.length; i++) {
    myData += `<div class="col-md-3 text-white">
            <div
              onclick="getMealsOfIngredient('${arr[i].strIngredient}')"
              class="text-center rounded-2"
            >
              <i class="fa-solid fa-drumstick-bite fa-4x"></i>
              <h3>${arr[i].strIngredient}</h3>
              <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
          </div>`;
  }
  allData.innerHTML = myData;
}

async function getMealsOfIngredient(ing) {
  allData.innerHTML = "";
  $(".inner").removeClass("d-none");
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`
  );
  let res = await api.json();
  displayMeals(res.meals.slice(0, 20));
  $(".inner").addClass("d-none");
}

let onNameInput = false;
let onEmailInput = false;
let onPhoneInput = false;
let onAgeInput = false;
let onPasswordInput = false;
let onRepasswordInput = false;

function displayContact() {
  searchSection.innerHTML = "";
  allData.innerHTML = `<div
            class="contact min-vh-100 d-flex justify-content-center align-items-center"
          >
            <div class="container w-75 text-center">
              <div class="row g-4">
                <div class="col-md-6">
                  <input
                    type="text"
                    class="form-control"
                    onkeyup="validations()"
                    placeholder="Enter Your Name"
                    id="name"
                  />
                  <div class="alert alert-danger d-none w-100 mt-2 d-none" id="nameValid">
                    Special characters and numbers not allowed.
                  </div>
                </div>
                <div class="col-md-6">
                  <input
                    type="email"
                    class="form-control"
                    onkeyup="validations()"
                    placeholder="Enter Your Email"
                    id="email"
                  />
                  <div class="alert alert-danger d-none w-100 mt-2 d-none" id="emailValid">
                    Email not valid! *example@yyy.zzz
                  </div>
                </div>
                <div class="col-md-6">
                  <input
                    type="tel"
                    class="form-control"
                    onkeyup="validations()"
                    placeholder="Enter Your Phone"
                    id="phone"
                  />
                  <div class="alert alert-danger d-none w-100 mt-2 d-none" id="phoneValid">
                    Enter valid phone number.
                  </div>
                </div>
                <div class="col-md-6">
                  <input
                    type="number"
                    class="form-control"
                    onkeyup="validations()"
                    placeholder="Enter Your Age"
                    id="age"
                  />
                  <div class="alert alert-danger d-none w-100 mt-2 d-none" id="ageValid">
                    Enter valid age.
                  </div>
                </div>
                <div class="col-md-6">
                  <input
                    type="password"
                    class="form-control"
                    onkeyup="validations()"
                    placeholder="Enter Your Password"
                    id="password"
                  />
                  <div class="alert alert-danger d-none w-100 mt-2 d-none" id="passwordValid">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                  </div>
                </div>
                <div class="col-md-6">
                  <input
                    type="password"
                    class="form-control"
                    onkeyup="validations()"
                    placeholder="Repassword"
                    id="repassword"
                  />
                  <div class="alert alert-danger d-none w-100 mt-2 d-none" id="repasswordValid">
                    Enter valid repassword.
                  </div>
                </div>
              </div>
              <button
              class="btn btn-outline-danger px-2 mt-3" disabled
              id="submitBtn"
              
              >
              Submit
              </button>
            </div>
          </div>`;
  submitBtn = document.getElementById("submitBtn");

  $("#name").on("focus", () => {
    onNameInput = true;
  });

  $("#email").on("focus", () => {
    onEmailInput = true;
  });

  $("#phone").on("focus", () => {
    onPhoneInput = true;
  });

  $("#age").on("focus", () => {
    onAgeInput = true;
  });

  $("#password").on("focus", () => {
    onPasswordInput = true;
  });

  $("#repassword").on("focus", () => {
    onRepasswordInput = true;
  });

  submitBtn.addEventListener("click", () => {
    $("#name").val("");
    $("#email").val("");
    $("#phone").val("");
    $("#age").val("");
    $("#password").val("");
    $("#repassword").val("");
    alert("Submitted");
  });
}

function validations() {
  if (onNameInput) {
    if (nameValidate()) {
      $("#nameValid").removeClass("d-block").addClass("d-none");
    } else {
      $("#nameValid").removeClass("d-none").addClass("d-block");
    }
  }

  if (onEmailInput) {
    if (emailValidate()) {
      $("#emailValid").removeClass("d-block").addClass("d-none");
    } else {
      $("#emailValid").removeClass("d-none").addClass("d-block");
    }
  }

  if (onPhoneInput) {
    if (phoneValidate()) {
      $("#phoneValid").removeClass("d-block").addClass("d-none");
    } else {
      $("#phoneValid").removeClass("d-none").addClass("d-block");
    }
  }

  if (onAgeInput) {
    if (ageValidate()) {
      $("#ageValid").removeClass("d-block").addClass("d-none");
    } else {
      $("#ageValid").removeClass("d-none").addClass("d-block");
    }
  }

  if (onPasswordInput) {
    if (passwordValidate()) {
      $("#passwordValid").removeClass("d-block").addClass("d-none");
    } else {
      $("#passwordValid").removeClass("d-none").addClass("d-block");
    }
  }

  if (onRepasswordInput) {
    if (repasswordValidate()) {
      $("#repasswordValid").removeClass("d-block").addClass("d-none");
    } else {
      $("#repasswordValid").removeClass("d-none").addClass("d-block");
    }
  }

  if (
    nameValidate() &&
    emailValidate() &&
    phoneValidate() &&
    ageValidate() &&
    passwordValidate() &&
    repasswordValidate()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

function nameValidate() {
  const nameRegex = /^[a-zA-Z ]+$/;
  let name = document.querySelector("#name");
  return nameRegex.test(name.value);
}

function emailValidate() {
  const emailRegex = /^.{3,}@(gmail|yahoo).com$/;
  let email = document.querySelector("#email");
  return emailRegex.test(email.value);
}

function phoneValidate() {
  const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  let phone = document.querySelector("#phone");
  return phoneRegex.test(phone.value);
}

function ageValidate() {
  const ageRegex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
  let age = document.querySelector("#age");
  return ageRegex.test(age.value);
}

function passwordValidate() {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
  let password = document.querySelector("#password");
  return passwordRegex.test(password.value);
}

function repasswordValidate() {
  return (
    document.getElementById("repassword").value ==
    document.getElementById("password").value
  );
}

$("#searchNav").on("click", () => {
  searchInputs();
  closeNav();
});

$("#categoriesNav").on("click", () => {
  getCategories();
  closeNav();
});

$("#areaNav").on("click", () => {
  getArea();
  closeNav();
});

$("#ingrediantsNav").on("click", () => {
  getIngredients();
  closeNav();
});

$("#contactNav").on("click", () => {
  displayContact();
  console.log(submitBtn);
  closeNav();
});
