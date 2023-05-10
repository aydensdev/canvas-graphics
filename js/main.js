window.onload = () => {
    //variables
    canvas = document.getElementById('canvas');
    title = document.getElementById('title');
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    cUtils = new canvasUtils;

    fps = 60, secondsPassed = 0, oldTimeStamp = 0;
    previousFrame = []; keysPressed = [], planes = [], buffer=[];

    res = 1;

    //key handlers
    document.addEventListener('keydown', (key) => {
        if(!keysPressed.includes(key.key)){
            keysPressed.push(key.key);
        }
    });
    document.addEventListener('keyup', (key) => {
        keysPressed.splice(keysPressed.indexOf[key.key], 1);
    });

    //start main loop
    window.requestAnimationFrame(renderFrame);
}

function renderFrame(timeStamp){

    //prepares buffer
    canvas.width = canvas.clientWidth / res;
    canvas.height = canvas.clientHeight / res;
    if(canvas.height <= 0){return 0};
    let buffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
    cUtils.setBuffer(buffer);

    //draw to canvas
    u = Math.round(canvas.width * 0.1);
    triangles = [[
        {x:-u, y:-u , z:0, c:[255, 0, 0]}, 
        {x:0, y:Math.round(u*0.866), z:0, c:[0, 0, 255]}, 
        {x:u, y:-u, z:0, c:[0, 255, 0]}
    ]];
    triangles.forEach((value, index, array) => {
        cUtils.fillTriangle(value[0], value[1], value[2]);
    });

    ctx.putImageData(buffer, 0, 0);

    //Updates Title and continues loop
    secondsPassed = (timeStamp - oldTimeStamp) / 1000, oldTimeStamp = timeStamp;
    let titleText = `Graphics Engine | ${Math.round(1 / secondsPassed)} FPS`;
    if(titleText && secondsPassed){
        title.innerHTML = titleText
    };
    window.requestAnimationFrame(renderFrame);
}

//utility functions


function index(x, y, width, height){
    x1 = x*4 + Math.floor(width / 2)*4;
    y1 = y*-1 + Math.floor(height/2);
    return (y1 * width*4 + x1);
};

function requestLock(){
    canvas.requestPointerLock();
    canvas.requestFullscreen();
};

function random(max){
    return Math.floor(Math.random() * max);
};
