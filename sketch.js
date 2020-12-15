var dog, database, foodS, foodStock, lastFed,food1;
var food = 20;
var addFood, feedFood, fedTime, lastFed, foodObj, readState, changeState;
function preload(){
  sadDogImg = loadImage("Dog.png");
  happyDogImg = loadImage("Lazy.png");
  bedroomImg = loadImage("BedRoom.png");
  washroomImg = loadImage("WashRoom.png");
  gardenImg = loadImage("Garden.png");
  livingRoomImg = loadImage("Living Room.png");
  milkImg = loadImage("Milk.png");
}

function setup() {
  createCanvas(500, 500);
  dog = createSprite(300,270);
  dog.addImage(happyDogImg);
  dog.scale = 0.3;

  milk = createSprite(190,310);
  milk.addImage(milkImg);
  milk.scale = 0.15;
  database = firebase.database();
  foodStock = database.ref('Food');
  foodStock.on("value", function(data){
    foodS = data.val();
  });
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    fedTime=data.val();
  })
  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val(); 
  }); 

  food1 = new Food();

  feed = createButton("Feed the Dog");
  feed.position(520,170);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(620,170);
  addFood.mousePressed(addFood);
  
  var input = createInput("Your Dog's Name");
  input.position(520,110);
  Dogname = input.value();
  var button = createButton("Submit");
  button.position(580,140);
  button.mousePressed(function(){
    input.hide();
    button.hide();
  });  
}


function draw() {  
  currentTime = hour();
  if(currentTime ==(fedTime+1))
  {
    update("Playing");
    food1.garden();

  }
  else if(currentTime == (fedTime + 2))
  {
    update("Sleeping");
    food1.bedroom();

  }
  else if(currentTime == (fedTime+3))
  {
    update("Bathing");
    food1.washroom();
  }
  else if(currentTime == (fedTime+4))
  {
    update("Watching");
    food1.livingRoom();

  }
  else
  {
    update("Hungry");
    food1.display();

  }
  if(gameState!="Hungry")
  {
    feed.hide();
    addFood.hide();
    dog.remove();
    food1.hide();
  }
  else
  {
    feed.show();
    addFood.show();
    dog.addImage(sadDogImg)
  }
  background(46,139,87);  
  food1.display();
  drawSprites();  
  textSize(20);
  fill("white");
  text("Food Remaining: "+foodS,170,50);
  if(fedTime>=12)
        {
        fill("white");
        textSize(15); 
        text("Last Fed : "+ fedTime%12 + " PM", 350,30);
        }
        else if(fedTime==0)
        {
            fill("white");
            textSize(15); 
             text("Last Fed : 12 AM",350,30);
        }
        else
        {
            fill("white");
            textSize(15); 
            text("Last Fed : "+ fedTime + " AM", 350,30);
        }
  


  drawSprites();
  //add styles here

}

//Function to write values in DB function 
function writeStock(x){
   if(x<=0){
      x=0 
    }
    else{
       x=x-1
    } 
  database.ref('/').update({Food:x})
 }

 function feedDog(){
   dog.addImage(happyDogImg);
   foodS--;
   database.ref('/').update({
     Food : foodS
   })
   fedTime = hour(); 
 }
 function addFoods(){
   foodS++;
   database.ref('/').update({
     Food:foodS
   })
 }

 function update(state)
 {
   database.ref('/').update({
     gameState:state
   });
 }