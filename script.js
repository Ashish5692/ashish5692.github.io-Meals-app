// Retrieving HTML element
let search_box = document.getElementById("search_box");
let main = document.getElementById("main");
let container = document.getElementById("container");
let favourite_btn = document.getElementById("favourite_btn");
let fav_exit = document.getElementById("exit");
let fav_body = document.getElementById("fav_body");
let heart = []; //This line declares an empty array named heart which will be used to store references to heart icons
let view = 0;   //keeps track of the number of recipe views.
let btn_array = [];  //This line declares an empty array named btn_array which will store the IDs of recipe buttons that have been clicked.

//checks if there is no value stored in the local storage with the key "meals_id_array".
if (localStorage.getItem("meals_id_array") === null) {
    //a new array meals_id is created and stored in the local storage
    let meals_id = [];
    //This line stores the meals_id array in the local storage with the key "meals_id_array" after converting it to a JSON string.
    localStorage.setItem("meals_id_array", JSON.stringify(meals_id));
}

//Create Array
let object_array = [];  //This array will be used to store the fetched data from an API.

//show alert takes text parameter
function show_alert(text) {
    alert(text);
}

//adds an event listener to the search_box element, listening for the "keyup" event, and calling the find_Recipes function when the event is triggered.
search_box.addEventListener("keyup", find_Recipes);

// This function fetches data from the API based on the search value entered in the search_box.
function find_Recipes() {
    let search_value = search_box.value; // retrieves the value entered in the search_box element

    // Get request to the specified URL, appending the search_value to search for recipes.
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + search_value)
        .then(function (response) {
            return response.json(); //response data in JSON format.
        })
        .then(function (data) {
            // The resulting data is stored in object_array
            object_array = data;
            // call render_cards functions and pass object_array
            render_cards(object_array);
        })
        .catch(function () {
            main.innerHTML = `<div id="error1">
                <p>There is no recipe match to your search</p>
            </div>`;
        })
}

//This function clears the main element and iterates over the object_array to create and append recipe cards.
function render_cards(object_array) {
    //clear cards in each char next search
    main.innerHTML = "";
    let length = object_array.meals.length;

    //For each element, it calls the append_cards() function to create and append a recipe card to the main element.
    for (let i = 0; i < length; i++) {
        append_cards(object_array.meals[i]);
    }
}


let card_btn_array = [];  //This array stores references to recipe buttons in the dynamically created cards.
let index = 0;

//append_cards() function creates and appends a recipe card to the main element based on the provided object
function append_cards(object) {
    
    let mealCard = document.createElement("div"); //serve as receipe card
    mealCard.classList.add("food_card");   //CSS class added
    // HTML structure with dynamic data extracted from the object parameter
    mealCard.innerHTML = `
        <div class="card_img_div">
            <img class="card_img" src = "${object.strMealThumb}"/>
        </div >
        <p class="card_text_para">${object.strMeal}</p>
        <div class="card_lower_div">
            <button id="${object.idMeal}" class="btn">View Recipe</button>
            <span id="${object.idMeal}1" class="material-symbols-sharp"> favorite </span> 
        </div>`;
    //add 1 in id = ${object.idMeal}1 to make all id unique for heart

    //The mealCard element is appended to the main element.
    main.append(mealCard);


    //This section checks if the current recipe (object) is already in the favorites list by retrieving the list from the local storage.
    let mls_id = JSON.parse(localStorage.getItem("meals_id_array"));
    for (let i = 0; i < mls_id.length; i++) {
        //it checks if the idMeal of the current element in mls_id matches the idMeal of the object being processed
        //it checks if the recipe is already in the favorites list. 
        if (mls_id[i].idMeal === object.idMeal) {
            let heart_id = `${object.idMeal}1`;  // retrieve the element with the corresponding heart icon
            let element = document.getElementById(heart_id); //retrieves the heart icon element
            element.style.color = "red";
        }
    } //The favorites list is updated, and the heart icon is set to red.

    // for card view btn
    card_btn_array[index] = document.getElementById(`${object.idMeal}`);
    // add event listner when the "View Recipe" button on the card is clicked.
    card_btn_array[index].addEventListener("click", Recipe_container);

    // This stores a reference to the heart icon element associated with the recipe.
    heart[index] = document.getElementById(`${object.idMeal}1`);
    // This function handles adding the recipe to the favorites list.
    heart[index].addEventListener("click", add_to_fav);
    index++; // variable is incremented to ensure that next card and heart elements are stored in corresponding arrays.
}

// Add recipes card to fav section called when the heart icon is clicked
function add_to_fav(event) {
    // search in local storage for card is in fav section or not
    let mls_id = JSON.parse(localStorage.getItem("meals_id_array"));
    for (let i = 0; i < mls_id.length; i++) {
        // It checks if the meals_id_array includes the provided id 
        //if present display alert
        if ((event.target.id).slice(0, -1) === mls_id[i].idMeal) {
            show_alert(" Your Meal Recipe already exists in your favourites list");
            return;
            // dont want to go downside of code if it return
        }
    }
    // find card which have to add in fav section
    mls_id = mls_id.concat(object_array.meals.filter(function (object) {
        return object.idMeal === (event.target.id).slice(0, -1);
    }));
    //converts it back to a JSON string using JSON.stringify(), and stores it in the local storage
    localStorage.setItem("meals_id_array", JSON.stringify(mls_id));
    localStorage_fetch();
    show_alert("Your Meal Recipe has been added to your favourites list");

    // Add red color to heart
    (event.target).style.color = "red";
}

// fn called when View Recipe btn is clicked
function Recipe_container(event) {
    if (btn_array.includes(event.target.id) === true) {
        show_alert("Your Meal Recipe is already open");
    }
    else {
        btn_array.push(event.target.id);
        view++;
        //It then hides the main element, prepares the HTML structure for the recipe details
        //and appends it to the container element.
        main.style.visibility = "hidden"; 
        // filter_array have 1 object whose meal id match with button target id
        let filter_array = object_array.meals.filter(function (object) {
            return object.idMeal === event.target.id;
        });

        let Recipe_div = document.createElement("div");
        Recipe_div.classList.add("Recipe_card");
        Recipe_div.innerHTML = `    
        <div id="left">
            <div id="left_upper">
                <img id="left_upper_img"src="${filter_array[0].strMealThumb}" alt="error">
                <p id="left_upper_p1">${filter_array[0].strMeal}</p>  
                <p id="left_upper_p2">Cuisine : ${filter_array[0].strArea}</p>
            </div>
            <div id="left_lower">
                <a href="${filter_array[0].strYoutube}" target="_blank"><button id="left_lower_btn">Watch Video</button></a>
            </div>
        </div>

        <div id="right">
            <span id="${(event.target.id)}5" class="cross material-symbols-outlined">cancel</span>
            <h3 id="right_inst">INSTRUCTIONS</h3>
            <p id="right_p">${filter_array[0].strInstructions}</p>
        </div>`;

        container.append(Recipe_div);
        //click event listener to the cross icon
        let cross = document.getElementsByClassName("cross");
        cross[0].addEventListener("click", exit_page);
    }
}
//This function is called when the cross icon in the recipe details is clicked
function exit_page(event) {
    //delete div on click of cross
    const index = btn_array.indexOf(event.target.id.slice(0, -1));
    //removes the element at the index from the btn_array
    btn_array.splice(index, 1);
    view--;
    let recipes_container_div = document.getElementsByClassName("Recipe_card");
    recipes_container_div[recipes_container_div.length - 1].remove();

    if (view === 0) {
        main.style.visibility = "visible";
    }
}

// function is triggered when the favourite_btn is clicked
favourite_btn.addEventListener("click", fav_page);

//function is triggered when the favourite_btn is clicked
function fav_page() {
    container.style.filter = "brightness(50%)";
    let favourite_container = document.getElementById("favourite_container");
    favourite_container.style.right = "0vw";
    fav_exit.addEventListener("click", exit);

    function exit() {
        favourite_container.style.right = "-360px";
        container.style.filter = "brightness(100%)";
    }
    localStorage_fetch();
}

// This function fetches the favorite recipes from local storage and renders them on the favorite recipes page.
function localStorage_fetch() {
    let localStorage_length = JSON.parse(localStorage.getItem("meals_id_array")).length;
    let meals_id_array = JSON.parse(localStorage.getItem("meals_id_array"));
    if (localStorage_length === 0) {
        fav_body.innerHTML = "<h2>No recipes added in your favourites list.</h2>";
    }
    else {
        fav_body.innerHTML = "";
        for (let i = 0; i < localStorage_length; i++) {
            //set card in fav div
            let mealCard = document.createElement("div");
            mealCard.classList.add("food_card");
            mealCard.innerHTML = `
            <div class="card_img_div">
                <img class="card_img" src = "${meals_id_array[i].strMealThumb}"/>
            </div>

            <p class="card_text_para">${meals_id_array[i].strMeal}</p>
            <div class="card_lower_div_fav">
                <button id="${meals_id_array[i].idMeal}2" class="btn1">View</button>
                <button id="${meals_id_array[i].idMeal}3" class="btn1">Remove</button>
            </div>`;

            //add 1 in id = ${object.idMeal} becuse i want to make all id unique for heart
            fav_body.append(mealCard);

            // for card view btn
            card_btn_array[index] = document.getElementById(`${meals_id_array[i].idMeal}2`);
            // add event listner for evry card button
            card_btn_array[index].addEventListener("click", Recipe_container1);

            // for card remove
            heart[index] = document.getElementById(`${meals_id_array[i].idMeal}3`);
            // add event listner for evry remove button
            heart[index].addEventListener("click", remove_from_fav);
            index++;
        }
    }
}

// work on View Recipe but is specific to the favorite recipes page. 
function Recipe_container1(event) {

    //It checks if the button's ID is already present in btn_array
    if (btn_array.includes((event.target.id).slice(0, -1)) === true) {
        show_alert(" Your Meal Recipe is already open");
    }
    else {
        // the ID is added to btn_array, and the recipe details are prepared and appended to the container element
        btn_array.push((event.target.id).slice(0, -1));
        view++;
        // main.innerHTML = ""; // option1
        main.style.visibility = "hidden"; // alternate option 2
        // filter_array have 1 object whose meal id match with button target id
        let filter_array = JSON.parse(localStorage.getItem("meals_id_array")).filter(function (object) {
            return object.idMeal === (event.target.id).slice(0, -1);
        });

        let Recipe_div = document.createElement("div");
        Recipe_div.classList.add("Recipe_card");
        Recipe_div.innerHTML = `    
        <div id="left">
            <div id="left_upper">
                <img id="left_upper_img"src="${filter_array[0].strMealThumb}" alt="error">
                <p id="left_upper_p1">${filter_array[0].strMeal}</p>
                <p id="left_upper_p2">Cuisine : ${filter_array[0].strArea}</p>
            </div>
            <div id="left_lower">
                <a href="${filter_array[0].strYoutube}" target="_blank"><button id="left_lower_btn">Watch Video</button></a>
            </div>
        </div>

        <div id="right">
            <span id="${(event.target.id).slice(0, -1)}4" class="cross material-symbols-outlined">cancel</span>
            <h3 id="right_inst">INSTRUCTIONS</h3>
            <p id="right_p">${filter_array[0].strInstructions}</p>
        </div>`;

        //The function also attaches click event listener to cross icon (with class "cross") in the recipe details
        container.append(Recipe_div);
        let cross = document.getElementsByClassName("cross");
        for (let i = cross.length - 1; i >= 0; i--) {
            cross[i].addEventListener("click", exit_page);
        }
    }
}

// remove recipes card from_fav section

function remove_from_fav(event) {
    // search in local storage for card is in fav section or not
    let mls_id = JSON.parse(localStorage.getItem("meals_id_array"));

    //iterates over the array to find the matching recipe
    for (let i = 0; i < mls_id.length; i++) {
        if (mls_id[i].idMeal === event.target.id.slice(0, -1)) {
            mls_id.splice(i, 1);  //method is used to remove that object from the mls_id array.
        }
    }
    localStorage.setItem("meals_id_array", JSON.stringify(mls_id));  //converts the array to a string 
    localStorage_fetch();
    show_alert("Your Meal Recipe has been removed from your favourites list");

    // Remove red color from heart icon
    //fetch or find heart element by their id
    let heart_id = event.target.id.slice(0, -1) + 1; //generates the ID of the heart icon element
    let element = document.getElementById(heart_id);
    
    //This condition checks if the heart icon element exists in the DOM.
    if (element !== null) {
        element.style.color = "black";
    }
}