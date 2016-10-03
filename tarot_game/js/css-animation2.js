// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.



var app = angular.module('cardGameApp', []);
app.controller('cardGameCtrller', function($scope) {
 // private variables
 var cards = []
 var card_value = [{id:"1C",text:"1C"},{id:"2C",text:"2C"},{id:"3C",text:"3C"},{id:"4C",text:"4C"},{id:"5C",text:"5C"},
 {id:"6C",text:"6C"},{id:"7C",text:"7C"},{id:"8C",text:"8C"},{id:"1H",text:"1H"},
 {id:"2H",text:"2H"},{id:"3H",text:"3H"},{id:"4H",text:"4H"},{id:"5H",text:"5H"},
 {id:"6H",text:"6H"},{id:"7H",text:"3H"},{id:"8H",text:"8H"}];

 var started = false;
 var matches_found = 0;
 var card1 = false, card2 = false;

 var cardImagesUrl = "images/cards";
 var imagesUrl = "images";

  var hideCard = function(id) // turn card face down
  {
    cards[id].firstChild.src = cardImagesUrl+"/back.png";
    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.0) rotate(180deg)";
    }
  };

  var moveToPack = function(id) // move card to pack
  {
    hideCard(id);
    cards[id].matched = true;
    with(cards[id].style) {
      zIndex = "1000";
      top = "100px";
      left = "-140px";
      WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
      zIndex = "0";
    }
  };

  var moveToPlace = function(id) // deal card
  {
    cards[id].matched = false;
    with(cards[id].style) {
      zIndex = "1000";
      top = cards[id].fromtop + "px";
      left = cards[id].fromleft + "px";
     // WebkitTransform = MozTransform = OTransform = msTransform = "rotate("+ cards[id].fromRotate+"deg)";
     zIndex = "0";
   }
 };

  var showCard = function(id,imgId) // turn card face up, check for match
  {
    var img =document.getElementById(imgId);
    img.src = cardImagesUrl +"/"+ card_value[id].id + ".png";
    with(img.style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2)";
    }
  };

  var addDescription = function(id){
    var descriptionSpan = document.getElementById("spanDescription");
    descriptionSpan.innerHTML = card_value[id].text;
  };


  var destroyCardContainer = function(id){
    $("#cardDiv"+id).css("width","1px");
    $("#cardDiv"+id).css("height","1px");
    
  };

  var cardShowDeal = function(id)
  {
      // shuffle and deal cards
      card_value.sort(function() { return Math.round(Math.random()) - 0.5; });
      for(i=0; i < card_value.length; i++) {
        (function(idx) {
          setTimeout(function() { moveToPlace(idx); }, idx * 100);
        })(i);
      }
    };

    var addCardFunction= function(style,felt,card,title){
     card.setAttribute("style",style);
     var span =  document.createElement("span");
     span.setAttribute("class","dragPointCardLabel");
     span.innerHTML = title;
     card.appendChild(span);

     $(card).droppable({
      drop: function( event, ui ) {
       $(this).droppable( 'disable' );
       ui.draggable.draggable( 'disable' );
       ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
       ui.draggable.draggable( 'option', 'revert', false );
       $( this )
       .addClass( "ui-state-highlight" );
       var idCardNumber = ui.draggable[0].id.replace("image","");
       showCard(idCardNumber,ui.draggable[0].id);
       addDescription(idCardNumber);
destroyCardContainer(idCardNumber);

     }
   });;
     felt.appendChild(card);
   };

var createDraggablePoints= function(felt){
 var cardTime = document.createElement("div");
 cardTime.setAttribute("class", "dragPointCard");
 var pastCard = cardTime.cloneNode(true);
 var presentCard = cardTime.cloneNode(true);
 var futureCard = cardTime.cloneNode(true);
 addCardFunction("top: 100px; left: 70px;",felt,pastCard,"Pasado");
 addCardFunction("top: 85px; left: 270px;",felt,presentCard,"Presente");
 addCardFunction("top: 100px; left: 470px;",felt,futureCard,"Futuro");
};


var createCard = function(){
 var card = document.createElement("div");
 card.setAttribute("class", "cardClass");
 var img = document.createElement("img");
 img.setAttribute("src",cardImagesUrl+"/back.png");
 card.appendChild(img);
 return card;
};

var createDescriptionDiv = function(felt){
  var divText = document.createElement("div");
  var span = document.createElement("span");
  span.setAttribute("id","spanDescription");
  divText.appendChild(span);
  divText.setAttribute("class", "descriptionDiv");
  felt.appendChild(divText);
};

var reloadGame=function(){
  $("#felt").remove();
  cards = [];
$scope.init("stage");
};


var createReloadButton=function(felt){
 var img = document.createElement("img");
 img.setAttribute("src",imagesUrl+"/refresh.png");
 img.setAttribute("width","40px");
 img.setAttribute("height","40px");
 
 img.addEventListener("click",reloadGame);
  felt.appendChild(img);
};

$scope.init= function(targetId){
  var stage = document.getElementById(targetId);
  var felt = document.createElement("div");
  felt.id = "felt";
  stage.appendChild(felt);
  createDraggablePoints(felt);
  createDescriptionDiv(felt);
createReloadButton(felt);
  // template for card
  var card  = createCard();

  var lastYPosition =300;
  var rotateDegree = 170;
  for(var i=0; i < card_value.length; i++) {
    var newCard = card.cloneNode(true);
    newCard.id = "cardDiv"+i;
    newCard.fromRotate = rotateDegree
    newCard.fromtop = lastYPosition;
    newCard.fromleft = 70 + 30 * (i);
    (function(idx) {
      var imgCard =newCard.childNodes[0];
      imgCard.id = "image"+i;
      $(imgCard).draggable(
        {revert:'invalid',
        start:function(){
          $(this).addClass("cardInDrag");
        },
        stop:function(){
           $(this).removeClass("cardInDrag");
        }
      });

    })(i);

    felt.appendChild(newCard);
    cards.push(newCard);
    if(i < card_value.length/2-1){
      lastYPosition = lastYPosition-5;
      rotateDegree = rotateDegree+1;
    }
    else if(i == card_value.length/2-1){
      rotateDegree = rotateDegree+5;

    }
    else{
      lastYPosition = lastYPosition+5; 
      rotateDegree = rotateDegree+1; 
    }
  }

  cardShowDeal();
}

$scope.init("stage");



});

