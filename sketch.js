//Create variables here
var foodStock;
var lastFed,fedTime;
var dog,happyDog,feed,addFood,dogImg,database, foodS, foodStock,foodObj;
function preload(){
  //load images here
  dogImg = loadImage("Dog.png");
  happyDog = loadImage("happydog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000,500);

  foodObj = new Food();
  
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  dog = createSprite(900,250,10,10);
  dog.addImage(dogImg);
  dog.scale = 0.2;
  
  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
}
function draw() { 
  background(46,139,87);
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12) {
    text("last Fed : "+ lastFed%12 + "PM",350,30)
  }else if(lastFed==0) {
    text("last Fed : 12 AM",350,30);
  }else{
    text("last Fed : "+ lastFed + " AM",350,30)
  }
  
  drawSprites();
  fill("blue");
  textSize(20);
  text("foodStock:"+foodS,200,100);
  //add styles here
}
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}
function writeStock(x) {

  database.ref('/').update({
    Food:x
  });
}
function feedDog() {
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  writeStock(foodS);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
    
  })
}
function addFoods() {
  foodS++;
  dog.addImage(dogImg);
  database.ref('/').update({
    Food:foodS
  })
}
