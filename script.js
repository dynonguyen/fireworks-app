const RADIUS = 3;
const DEFAULT_COLOR = 3;
const X_MAX_SPEEP = 6;
const Y_MAX_SPEEP = 4;
const MAX_NUMBER = 40;
const MAX_SPARK_NUMBER = 10;
const FRICTION = 0.055;
const MAX_LIFETIME = 120;

document.addEventListener('DOMContentLoaded', () => {

    // ============================= Canvas ============================= //
    // create a canvas
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    //add body
    document.body.appendChild(canvas);

    //Setting canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //resize window
    document.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // ============================= Config ================================ //
    let reset = document.getElementById('reset');
    let size = document.getElementById('size');
    let quantity = document.getElementById('quantity');

    let config = {
        size: RADIUS,
        quantity: 10
    }

    size.addEventListener('change', function () {
        config.size = size.value;
    })

    quantity.addEventListener('change', function(){
        config.quantity = Math.round(quantity.value);
    });

    reset.addEventListener('click', function(){
        config.size = RADIUS;
        config.quantity = 10
        size.value = 1;
        quantity.value = 1;
    });

    // ============================= Audio ================================ //
    let a = new Audio('explosive.mp3');
    let play = false;
    // ============================= Firework ============================= //
    function randomColor() {
        let red = Math.round(Math.random() * 255);
        let green = Math.round(Math.random() * 255);
        let blue = Math.round(Math.random() * 255);
        return 'rgb(' + red.toString() + ',' + green.toString() + ',' + blue.toString() + ')';
    }

    //firework constructor
    function FireWork() {
        this.radius = config.size;
        this.x = canvas.width / 2;
        this.y = canvas.height;
        this.color = randomColor();
        this.speed = {
            x: Math.random() * X_MAX_SPEEP - X_MAX_SPEEP / 2,
            y: Math.random() * Y_MAX_SPEEP / 2 + Y_MAX_SPEEP / 2
        }
        this.isAlive = true;
        this.maxHeight = Math.random() * (canvas.height / 2) + 10;
    }

    FireWork.prototype.draw = function (context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    FireWork.prototype.explosive = function () {
        if (this.y <= this.maxHeight || this.x <= 10 || this.x >= canvas.width - 10) {
            play = true;
            this.isAlive = false;
            for (let i = 0; i < MAX_SPARK_NUMBER; ++i) {
                sparkArray.push(new Spark(this.radius / 2, this.x, this.y, this.color));
            }
        }
    }

    FireWork.prototype.update = function (context) {
        this.x += this.speed.x;
        this.y -= this.speed.y;
        this.draw(context);
        this.explosive();
    }

    // ============================= Spark ============================= //
    function Spark(radius, x, y, color) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = {
            x: Math.random() * X_MAX_SPEEP - X_MAX_SPEEP / 2,
            y: Math.random() * Y_MAX_SPEEP / 2 + Y_MAX_SPEEP / 4
        }
        this.friction = FRICTION;
        this.isAlive = true;
        this.lifetime = Math.round(Math.random() * MAX_LIFETIME) + MAX_LIFETIME / 2;
    }

    Spark.prototype.draw = function (context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    Spark.prototype.update = function (context) {
        this.speed.y -= this.friction;
        this.y -= this.speed.y;
        this.x += this.speed.x;
        this.lifetime--;
        if (this.lifetime < 0)
            this.isAlive = false;
        this.draw(context);
    }

    let sparkArray = [];
    // ============================= Main ============================= //
    let fireworkArray = [];

    function init() {
        if (fireworkArray.length < config.quantity)
            fireworkArray.push(new FireWork());
    }

    function clear() {
        context.fillStyle = 'rgba(1, 1, 1, 0.1)';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function main() {

        window.requestAnimationFrame(main);
        clear();

        fireworkArray.forEach((item, index) => {
            item.update(context);

            //delete item
            if (!item.isAlive)
                fireworkArray.splice(index, 1);
        });

        sparkArray.forEach(function (item, index) {
            item.update(context);
            if (!item.isAlive)
                sparkArray.splice(index, 1);
        });

        if(play){
            a.play();
        }

        init();

    }

    main();

});