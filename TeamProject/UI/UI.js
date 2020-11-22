/**
 * UI Manager Class
 * 모든 UI 관리
 */
class UIManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.nowUI = new Start(this.ctx);
    }

    UIkeyEvent(e) {
        var result = this.nowUI.keyFunc(e.key);

        if (result != null) {
            var arr = result.split(',');

            if (arr.length == 1) { // 일반적인 경우
                // clear ui canvas
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                // change UI class
                this.nowUI = this.reloadUIClass(arr[0]);
            }
            else if(arr.length == 2 && arr[0] == "Game"){ // 스테이지 선택시
                // clear ui canvas
                this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
                // change UI class
                this.nowUI = this.reloadUIClass(arr[0]);
                return Number(arr[1]); // 스테이지 번호 리턴
            }

        }
        return null;
    }

    reloadUIClass(UIName) {
        var ui = null;
        switch (UIName) {
            case "Main":
                ui = new Start(this.ctx);
                break;
            case "Stage":
                ui = new StageUI(this.ctx);
                break;
            case "Game":
                ui = new GameUI(this.ctx);
                break;
            default:
                ui = null;
        }
        return ui;
    }
}


/**
 * Start UI Class
 * 첫 시작 화면
 */
class Start {
    constructor(ctx) {
        this.draw(ctx);
    }

    draw(ctx) {
        var img = new Image();
        img.onload = function(){
            ctx.drawImage(img, 0, 0);
        }
        img.src = "./UI/title.png";
    }

    keyFunc(key) {
        // console.log(key);
        return "Stage";
    }
}

/**
 * Start UI Class
 * 스테이지 고르는 화면
 */
class StageUI {
    constructor(ctx) {
        this.draw(ctx);
    }

    draw(ctx) {
        var img = new Image();
        img.onload = function(){
            ctx.drawImage(img, 0, 0);
        }
        img.src = "./UI/stage.png";
    }

    keyFunc(key) {
        var result = null;
        switch (key) {
            case "Escape":
                result = "Main"
                break;
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
                result = "Game" + "," + key
                break;
            default:
        }
        return result;
    }
}

/**
 * Game UI Class
 * 게임내 UI
 */
class GameUI {
    constructor(ctx) {
        this.ctx = ctx;

        this.initSprite();

        this.score = 300;
        this.numEnemy = null;
        this.hp = 2;

        this.pause = false;
        this.animationFlag = false;

        this.drawbackground();
        this.execuse();
    }

    initData(score, enemy, hp){
        this.score = score;
        this.numEnemy = enemy;
        this.hp = hp;
    }

    initSprite(){
        this.loadnum = 0;

        this.enemySprite = new Image();
        this.enemySprite.src = "./sprite/enemy.png";

        this.heart = {};
        for(var i=0; i<4; i++){
            this.heart[i] = new Image();
            this.heart[i].src = "./sprite/heart_" + i + ".png";
        }
    }

    execuse(){
        this.animationFlag = true;
        this.draw();
    }

    stop(){
        this.animationFlag = false;
    }

    draw() {
        this.drawbackground();
        this.drawScore();
        this.drawHP();

        if (this.animationFlag) {
            requestAnimationFrame(this.draw.bind(this));
        }
    }

    drawbackground(){
        this.ctx.fillStyle = 'rgb(100, 100, 100)';
        this.ctx.fillRect(0, 0, 960, 720);
        this.ctx.clearRect(10, 10, 700, 700); // clear game canvas
        this.ctx.clearRect(735, 510, 200, 200); // clear minimap canvas;
    }

    drawScore(){
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.font = "30px serif"
        this.ctx.fillText("SCORE", 730, 50);
        this.ctx.fillText(String(this.score), 730, 80);
    }

    drawHP(){
        this.ctx.fillText("HP", 730, 150);
        this.ctx.drawImage(this.heart[this.hp], 710, 160);
    }

    keyFunc(key) {
        var result = null;
        switch (key) {
            default:
        }
        return result;
    }
}
