//Global vars
var _total;
var _parsed;
var _data = [];
var _answerArray = [];
var _selectedArray = [];

// Init with data
function init() {
  loadJSON(function (response) {
    _total = Object.keys(JSON.parse(response)).length;
    _parsed = JSON.parse(response);

    if(window.localStorage.getItem('answerArray')){
      for(var i = 0; i < _total; i++){
        var y = JSON.parse(window.localStorage.getItem('answerArray'))[i];
        _data.push(_parsed.find(x => x.id === y));
      }
      _selectedArray = JSON.parse(window.localStorage.getItem('selectedArray'));
    }
    else {
      _data = shuffle(JSON.parse(response));
    }

    if(!window.localStorage.getItem('best_picture')){
      for(var i = 0; i < _total; i++){
        _answerArray.push(_data[i].id);
        _selectedArray.push(0);
      }
      window.localStorage.setItem('answerArray', JSON.stringify(_answerArray));
      window.localStorage.setItem('selectedArray', JSON.stringify(_selectedArray));
      movieSelector();
    }
    else {
      buildBingo()
    }
  });
}

//Load JSON from file
function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', './data/answers.json', true);

  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };

  xobj.send(null);
}

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref = [array[j], array[i]];
    array[i] = _ref[0];
    array[j] = _ref[1];
  }

  return array;
}

function movieSelector(){
  $(".option").each(function(){
    $(this).on("click", function(){
      window.localStorage.setItem('best_picture', $(this)[0].dataset["title"]);
      buildBingo();
    })
  });
}

function buildBingo(){
  var container = $("<ul id='boxes'><li class='letter'>O</li><li class='letter'>S</li><li class='letter'>C</li><li class='letter'>A</li><li class='letter'>R</li></ul>");
  for(var i = 0; i < _total; i++){
    var stamped = _selectedArray[i] == 1 ? "box stamped" : 'box';
    if(i == 12){
      var square = $("<li class='" + stamped + "' data-id='" + i + "'><div class='inner_box'><div class='stamp'><img class='oscar' src='../img/oscar.svg' /><img class='circle' src='../img/circle.svg' /></div><span>" + window.localStorage.getItem('best_picture') + " wins best picture</span></div></li>");
    }
    else {
      var square = $("<li class='" + stamped + "' data-id='" + i + "'><div class='inner_box'><div class='stamp'><img class='oscar' src='../img/oscar.svg' /><img class='circle' src='../img/circle.svg' /></div><span>" + _data[i].answer + "</span></div></li>");
    }

    container.append(square);
  }

  $("#quiz_container").remove();
  $("#bingo").append(container);
  addStamps();
  $(window).trigger('resize');
}

function addStamps(){
  $(".box").each(function(){
    $(this).on("click", function(){
      $(this).toggleClass("stamped");
      var which = $(this).attr("data-id");
      _selectedArray[which] = _selectedArray[which] == 0 ? 1 : 0;
      window.localStorage.setItem('selectedArray', JSON.stringify(_selectedArray));
    })
  });
}

$(window).resize(function() {
  var cw = $('.box').width();
  $('.box').css({
      'height': cw + 'px'
  });
});

$(window).trigger('resize');
init();
