


var paddle2 =10,paddle1=10;

var paddle1X = 10,paddle1Height = 110;
var paddle2Y = 685,paddle2Height = 70;

var score1 = 0, score2 =0;
var paddle1Y;

var  playerscore =0;

var pcscore =0;
//bola x e y, e velocidade x, velocidade y e raio
var ball = {
    x:350/2,
    y:480/2,
    r:20,
    dx:3,
    dy:3
}

rightWristY = 0;
rightWristX = 0;
scoreRightWrist = 0;

game_status="";

 

function setup(){
var canvas =  createCanvas(700,600);
canvas.parent('canvas');

function preload(){
  ball_touch_paddel=loadSound("ball_touch_paddel.wav");
  missed=loadSound("missed.wav");
}

video = createCapture(VIDEO);
video.size(700, 600);
video.hide();

poseNet = ml5.poseNet(video, modelLoaded);
poseNet.on('pose', gotPoses);
}

function modelLoaded() {
  console.log('PoseNet Is Initialized');
}

function gotPoses(results)
{
  if(results.length > 0)
  {

    rightWristY = results[0].pose.rightWrist.y;
    rightWristX = results[0].pose.rightWrist.x;
    scoreRightWrist =  results[0].pose.keypoints[10].score;
    console.log(scoreRightWrist);
  }
}

function startGame()
{
  game_status="start" //defina o valor da variável de status criada na etapa 1 para "start".
  document.getElementById("status").innerHTML= "Jogo Carregado";
}

function draw(){
if(game_status == "start")
{
  background(0); 
  image(video, 0, 0, 700, 600);

  fill("black");
  stroke("black");
  rect(680,0,20,700);

  fill("black");
  stroke("black");
  rect(0,0,20,700);

  if(scoreRightWrist > 0.2)
  {
    fill("red");
    stroke("red");
    circle(rightWristX, rightWristY, 30);
  }


    //chamar a função paddleInCanvas
    paddleInCanvas();
        
    //raquete ta esquerda 
    fill(250,0,0);
    stroke(0,0,250);
    strokeWeight(0.5);
    paddle1Y = rightWristY; 
    rect(paddle1X,paddle1Y,paddle1,paddle1Height,100);


    //raquete do computador
    fill("#FFA500");
    stroke("#FFA500");
    var paddle2y =ball.y-paddle2Height/2;  rect(paddle2Y,paddle2y,paddle2,paddle2Height,100);
    
    //chamar a função midline
    midline();
    
    //chamar a função drawScore 
    drawScore();

    //chamar a função models  
    models();

    //chamar a função move, que é muito importante
    move();

    }

  }

function restart(){
  loop();
  pcscore=0;
  playerscore=0;
}

//função reset quando a bola não entra no contato com a raquete
function reset(){
   ball.x = width/2+100,
   ball.y = height/2+100;
   ball.dx=3;
   ball.dy =3;   
}


//função midLine desenha uma linha no centro
function midline(){
    for(i=0;i<480;i+=10) {
    var y = 0;
    fill("white");
    stroke(0);
    rect(width/2,y+i,10,480);
    }
}


//função drawScore exibe as pontuações
function drawScore(){
    textAlign(CENTER);
    textSize(20);
    fill("white");
    stroke(250,0,0)
    text("Jogador:",100,50)
    text(playerscore,140,50);
    text("Computador:",500,50)
    text(pcscore,555,50)
}


//função muito importante deste jogo
function move(){
   fill(50,350,0);
   stroke(255,0,0);
   strokeWeight(0.5);
   ellipse(ball.x,ball.y,ball.r,20)
   ball.x = ball.x + ball.dx;
   ball.y = ball.y + ball.dy;
   if(ball.x+ball.r>width-ball.r/2){
       ball.dx=-ball.dx-0.5;       
   }
  if (ball.x-2.5*ball.r/2< 0){
  if (ball.y >= paddle1Y&& ball.y <= paddle1Y + paddle1Height) {
    ball.dx = -ball.dx+0.5; 
    ball_touch_paddel.play();
    playerscore++;
  }
  else{
    pcscore++;
    missed.play();
    reset();
    navigator.vibrate(100);
  }
}
if(pcscore ==4){
    fill("#FFA500");
    stroke(0)
    rect(0,0,width,height-1);
    fill("white");
    stroke("white");
    textSize(25);
    text("Game over",width/2,height/2);
    text("Cligue no botão Reiniciar para jogar novamente",width/2,height/2+30)
    noLoop();
    pcscore = 0;
 }
   if(ball.y+ball.r > height || ball.y-ball.r <0){
       ball.dy =- ball.dy;
   }   
}


//velocidade da bola, largura e altura da tela
function models(){
    textSize(18);
    fill(255);
    noStroke();
    text("Largura:"+width,135,15);
    text("Velocidade:"+abs(ball.dx),50,15);
    text("Altura:"+height,235,15)
}


//esta função ajuda a raquete a não sair tela
function paddleInCanvas(){
  if(paddle1Y+paddle1Height > height){
    paddle1Y=height-paddle1Height;
  }
  if(paddle1Y < 0){
    paddle1Y =0;
  }
 
  
}

