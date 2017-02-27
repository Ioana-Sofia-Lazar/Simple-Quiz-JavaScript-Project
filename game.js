var qNr = 0; //number of the question we are at
var test, testStatus;
var question;
var answer, answers;
var chA, chB, chC, chD;
var correct = 0;
var progrWidth = 0;
var userName;
var choices = []; //choices[i] is 0 if answer to question i is incorrect and 1 if it is correct

var questions = [
    ["Which of the following is a possible consequence of eating a low protein diet?", "Increased potential for glycogen storage", "Decreased potential to store body fat", "Decreased muscle growth and repair", "Increased uptake of minerals", "D"],
    ["Which of the following minerals in a trace element?", "Phosphorus", "Calcium", "Potassium", "Zinc", "D"],
    ["Which of the following is a simple carbohydrate?", "Grains", "Jam",  "Vegetables", "Bran", "B"]/*,
    ["Which of the following provides the best source of vitamin A?", "Lentils", "Brown rice", "Full fat milk", "Apples", "C"],
    ["Which of the following protein-based foods contains all the essential amino acids?", "Pasta", "Peanuts", "Soy-bean", "Lentils", "C"],
    ["Which of the following is first in the digestive system?", "Stomach", "Small intestine", "Colon", "Rectum", "A"]*/
];

function _(elem){
    return document.getElementById(elem);
}

//the amount we will increase the progress bar with
var barInc = 100 / questions.length;

function reachedEnd(test){
    var div = _("stats");
    div.style.display = "none"; 
    
    test.innerHTML = "<div id='results'> <br> <br> <h3> See your results here </h3> <br>";
    
    var res = _("results");
    for (i = 0; i < choices.length; i++){
        if (choices[i] == 0){
            res.innerHTML += "<img class='icon' src='x.png'> Question " + (i + 1) + "&ensp; &ensp;"; 
        } 
            
        else {
            res.innerHTML += "<img class='icon' src='check.png'> Question " + (i + 1) + "&ensp; &ensp;";
        }
        if (i % 3 == 2) res.innerHTML += "<br>";
    }
        
            
    
    setTimeout(function(){_("results").style.visibility = "visible";}, 2000); //after 3 seconds we show detailed results
    
    test.innerHTML += "<h2> You answered " + correct + " out of " + questions.length + " correctly! </h2>";
    qNr = 0;
    correct = 0;
    test.innerHTML += "<button class='button' onclick='startQuiz()'> Restart quiz </button><br><br>";
    test.innerHTML += "<button class='button' onclick='showStart()'> Back to start </button>";    
    return false;
}

//displays the progress bar in the 'stats' div
function showProgress(div){
    div.innerHTML = "<div id='bar'> <div id='progress'> </div> </div>"; 
    _("progress").style.width = "0%";  
    barWidth = _("bar").style.width;
}

//increases progress bar after answering a question
function modifyProgress(){
    var progress = _("progress"); 
   
    var id = setInterval(frame, 1);
    var width = progrWidth;
    function frame() {
        if (width >= progrWidth + barInc/100 * barWidth) {
            return false;
        } 
        else {
            width++; 
            progress.style.width = width + '%'; 
        }
    }
    progrWidth += barInc;
    
}

//displays the question
function showQuest(){
    test = _("test");
    
    //in case we restart the quest we reset the progress bar
    if (qNr == 0){
        progrWidth = 0;
    }
            
    //if we answered all questions
    if(qNr >= questions.length)
        reachedEnd(test);
    
    else {
        test.innerHTML = "<h2> Question " + (qNr + 1) + "</h2>";
        question = questions[qNr][0];
        chA = questions[qNr][1];
        chB = questions[qNr][2];
        chC = questions[qNr][3];
        chD = questions[qNr][4];//alert(qNr + "\n" + chA + "\n" + chB + "\n" + chC + "\n" + chD);

        //we display the question and the answers
        test.innerHTML += "<h3>" + question + "</h3>";
        test.innerHTML += "<label> <div class='answerBox'> <input type='radio' name='answers' value='A'> " + chA + "<br> </div> </label>";
        test.innerHTML += "<label> <div class='answerBox'> <input type='radio' name='answers' value='B'> " + chB + "<br> </div> </label>";
        test.innerHTML += "<label> <div class='answerBox'> <input type='radio' name='answers' value='C'> " + chC + "<br> </div> </label>";
        test.innerHTML += "<label> <div class='answerBox'> <input type='radio' name='answers' value='D'> " + chD + "<br> </div> <br> </label> ";
        test.innerHTML += "<button class='button' onclick='checkAnsw()'> Submit Answer </button>";
                
        
        var buttons = document.getElementsByClassName("answerBox");
        for (var i = 0; i < buttons.length; i++){
            buttons[i].style.borderRadius = "4px"; //--
            buttons[i].addEventListener("click", makeSelected, false);
        }
    }        
}

//makes an answer look different when selected
function makeSelected() {
    //when we select a new answer the previous selected will go back to looking unselected
    var buttons = document.getElementsByClassName("selectedBox");
    for (var i = 0; i < buttons.length; i++){
        buttons[i].className = "answerBox";
    }
    //the one we select will change its appearance
    this.className = "selectedBox";
}

//checks if the answer is correct
function checkAnsw() {
    answers = document.getElementsByName("answers");
    for (var i = 0; i < answers.length; i++){
        if (answers[i].checked){           
            answer = answers[i].value;
        }            
    }
    
    //if the correct answer is checked
    if (answer == questions[qNr][5]){
        correct++;
        choices.push(1);
    }
    else
        choices.push(0);
        
    qNr++;//we will show the next question
    showQuest();
    showStats();
    modifyProgress();
}

function createChr(event){alert("!");
    var canvas = _("canvas");
    var img = new Image();
    var x = event.clientX;
    var y = event.clientY;
    img.src = "5.png";alert(x+ " " +y); 
    img.onload = function(){
        canvas.getContext("2d").drawImage(img, x, y);  alert(x+ " " +y); 
    }
}

//adds on canvas the image with the given url at given coordinates
function addImg(url, x, y){
    var canvas = _("canvas");
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.src = url;
    img.onload = function() {
      ctx.drawImage(img, x, y);
    };
    
    //we make the image draggable considering 3 mouse events: 
    //1.mousedown -- set a flag indicating that the drag has begun
    //2.mouseup -- clear that drag flag because the drag is over
    //3.mousemove -- if the drag flag is set, clear the canvas and draw the image at the mouse position
    
    var canvasOffset = $("#canvas").offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var isDragging = false;

    function handleMouseDown(e){
        canMouseX = parseInt(e.clientX - offsetX);
        canMouseY = parseInt(e.clientY - offsetY);
        isDragging = true;
    }

    function handleMouseUp(e){
        canMouseX = parseInt(e.clientX - offsetX);
        canMouseY = parseInt(e.clientY - offsetY);
        isDragging = false;
    }

    function handleMouseOut(e){
        canMouseX = parseInt(e.clientX - offsetX);
        canMouseY = parseInt(e.clientY - offsetY);
        //isDragging = false;
    }

    function handleMouseMove(e){
        canMouseX = parseInt(e.clientX - offsetX);
        canMouseY = parseInt(e.clientY - offsetY);
        // if the drag flag is set, clear the canvas and draw the image
        if(isDragging){
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(img, canMouseX, canMouseY);
        }
    }

    $("#canvas").mousedown(function(e){handleMouseDown(e);});
    $("#canvas").mousemove(function(e){handleMouseMove(e);});
    $("#canvas").mouseup(function(e){handleMouseUp(e);});
    $("#canvas").mouseout(function(e){handleMouseOut(e);});
}

//creates the canvas
function addCanvas(test) {
    test.innerHTML += "<p id='notice'> Before you start, place the <span id='food'> healthy food </span> on your plate </p>";    
    test.innerHTML += "<canvas id='canvas'></canvas>";
    var canvas = _("canvas");
    canvas.width = 490;
    canvas.height = 150;
    _("food").onclick = function() {addImg("food.png", 0, 50);}
    
    var ctx = canvas.getContext("2d");
        
}

//displays the beginning
function showStart(){
    //in case we go back to start multiple times, we will need to hide the stats again
    var div = _("stats");
    div.style.display = "none";    
    
    test = _("test");
    test.innerHTML = "<h3>".concat("Welcome to our NUTRITION quiz</h3> <br>");
    test.innerHTML += "<h4>Enter your data</h4> Name: <input type='text' name='userName' id='userNamee'><br><br> Age: <input type='number' name='age'><br><br>";
    test.innerHTML += "<button class='button' id='start' onclick='startQuiz()'>Start quiz</button> <br> <br>"; 
    _("start").use = "Buton de start";
    
    var box = _("userNamee");
    window.onkeypress = function () {
        _("userNamee").style.backgroundColor = "pink";
    }
    
    addCanvas(test);
    
}

//when we press start the first question is shown
function startQuiz(){
    if (document.getElementsByName("userName")[0] != undefined)
        userName = document.getElementsByName("userName")[0].value;
    var message = "Hello, " + userName + "! Good luck on your quiz! ";
    localStorage.username = userName;
    alert(message);
    showStats();
    showQuest();
}

//creates the stats bar
function showStats(){
    var div = _("stats");
    //we only show the stats after the quiz starts
    div.style.display = "initial";
    showProgress(div);
    if (qNr != 0){        
        div.innerHTML += "<h3> Correct: " + correct + " &ensp; &ensp; &ensp; Incorrect: " + (qNr - correct) + "</h3>";
    }
    
}

function addCredits() {
    var para = document.createElement("p");
    para.setAttribute("id", "credits");
    var credits = document.createTextNode("Pascu Ioana, Faculty of Mathematics and Computer Science, University of Bucharest");
    para.appendChild(credits);
    document.body.appendChild(para);
}

function addTime(){
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();

    _("time").innerHTML = n + ' ' + time;
}

function addLink(){
    document.body.innerHTML += "<button id='open'>Get documented!</button>";
    var myWind;
    _("open").onclick = function() {
        myWind = window.open("http://www.healthier.qld.gov.au/start/", "_blank");
    }
    setTimeout (function(){if(myWind != undefined) myWind.close();}, 20000);    
}

function parcurg(){
    var ch = document.body.children;
    localStorage.nr = 0;
    for (var i = 0; i < ch.length; i++)
        if(typeof(ch[i]) == "string") localStorage.nr++; 
}

window.onload = function(){    
    showStart();
    //addCredits();
    setInterval(addTime, 1000); //show date and time
    addLink();
    parcurg();
}
