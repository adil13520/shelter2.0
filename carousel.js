let petsInfoDictionaries = [];

fetch("./json/pets.json")
  .then(response => {
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных.');
    }
    return response.json(); 
  })
  .then(data => {
    petsInfoDictionaries = data; 

    StartThis();
  })
  .catch(error => {
    console.error(error);
  });

let carouselStatesIndexes = [0, 1, 2, 3, 4];
let carouselStates = [];
let carouselCards = [];

let swipable = true;

function TrySwipeCarousel(delta)
{
  if (swipable)
  {
    SwipeCarousel(delta);

    swipable = false;

    Sleep(getComputedStyle(root).getPropertyValue("--carouselAnimationTime").replace('s', '') - 0.1).then(() => swipable = true);
  }
}

function SwipeCarousel(delta)
{
  for (let i = 0; i < carouselStatesIndexes.length; ++i)
  {
    carouselStatesIndexes[i] += delta;

    if (carouselStatesIndexes[i] < 0)
      carouselStatesIndexes[i] = carouselStates.length - 1;
    else if (carouselStatesIndexes[i] >= carouselCards.length)
      carouselStatesIndexes[i] = 0;
  }

  for (let i = 0; i < carouselStates.length; ++i)
    carouselStates[i] = 0;

  for (let i = 0; i < carouselStatesIndexes.length; ++i)
    carouselStates[carouselStatesIndexes[i]] = i;

  for (let i = 0; i < carouselStates.length; ++i)
    carouselCards[i].setAttribute("state", carouselStates[i]);
}

function GeneratePetCard(state, index)
{
  let pet = petsInfoDictionaries[index];
  
  // Create a new div element
  const div = document.createElement("div");
  div.classList.add("pets__carousel__item");
  div.setAttribute("state", state);

  // Create a figure element
  const figure = document.createElement("figure");
  figure.classList.add("pets__carousel__figure");

  // Create an image element and set its source and alt attributes
  const img = document.createElement("img");
  img.src = pet.img;
  img.alt = pet.name;
  img.classList.add("pet-img");

  // Create a figcaption element and set its text content
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = pet.name;

  // Append the img and figcaption elements to the figure element
  figure.appendChild(img);
  figure.appendChild(figcaption);

  // Create a button element and set its type and class attributes
  const button = document.createElement("button");
  button.type = "button";
  button.onclick = () => { blackout.setAttribute("state", 1); document.getElementsByClassName("pet-pop-up")[0].setAttribute("state", 1); SetPopUpInfo(index); };
  button.classList.add("pets__carousel__btn");
  button.textContent = "Learn more";

  // Append the figure and button elements to the div element
  div.appendChild(figure);
  div.appendChild(button);

  return div;
}

function InitializeCarousel(carouselDiv, carouselCards, itemsCount)
{
  for (let i = 0; i < itemsCount; ++i)
  {
      petCard = GeneratePetCard(i, i);
      
      carouselCards.push(petCard);
      carouselStates.push(i);
      carouselDiv.appendChild(petCard);
  }
}

let popUpTitle = document.getElementsByClassName("pet-pop-up__title")[0];
let popUpSubtitle = document.getElementsByClassName("pet-pop-up__subtitle")[0];
let popUpDescription = document.getElementsByClassName("pet-pop-up__description")[0];
let popUpAge = document.getElementsById("age");
let popUpInoculations = document.getElementsById("inoculations");
let popUpDiseases= document.getElementsById("diseases");
let popUpParasites = document.getElementById("parasites");

function SetPopUpInfo(petIndex)
{
  let pet = petsInfoDictionaries[petIndex];

  popUpTitle.innerHTML = pet.name;
  popUpSubtitle.innerHTML = pet.type + " - " + pet.breed;
  popUpDescription.innerHTML = pet.description;
  popUpAge.innerHTML = pet.age;
  popUpInoculations.innerHTML = pet.inoculations;
  popUpDiseases.innerHTML = pet.diseases;
  popUpParasites.innerHTML = pet.parasites;
}

function StartThis()
{
  let carouselDiv = document.getElementsByClassName("pets__carousel__items")[0];
  
  InitializeCarousel(carouselDiv, carouselCards, 8);

  carouselCards.sort(() => Math.random() - 0.5)
  
  SwipeCarousel(0);
}