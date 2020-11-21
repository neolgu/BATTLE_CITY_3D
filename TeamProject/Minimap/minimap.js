class MiniMapManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.mapdata = null; // objlist
        this.animationFlag = false;

        this.sprite = {}
        this.initSprite();
    }

    dataBind(mapdata) {
        this.mapdata = mapdata;
    }

    execuse() {
        this.animationFlag = true;
        this.draw();
    }

    stop(){
        this.animationFlag = false;
    }

    draw(t) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //draw background
        this.ctx.beginPath();
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        // Player
        this.drawObj(this.mapdata.player.x_pos, this.mapdata.player.y_pos, "P");

        // // Enemy
        for (var i = 0; i < this.mapdata.enemy_list.length; i++) {
            this.drawObj(this.mapdata.enemy_list[i].x_pos, this.mapdata.enemy_list[i].y_pos, "E");
        }

        // // Wall
        for (var i = 0; i < this.mapdata.wall_list.length; i++) {
            this.drawObj(this.mapdata.wall_list[i].x_pos, this.mapdata.wall_list[i].y_pos, "W");
        }

        if (this.animationFlag) {
            requestAnimationFrame(this.draw.bind(this));
        }
    }

    coordTrans(x, y) {
        var cx = (x + 1) * this.canvas.width / 2;
        var cy = (-y + 1) * this.canvas.height / 2;

        var obj = {};
        obj.cx = cx;
        obj.cy = cy;

        return obj;
    }

    drawObj(x_pos, y_pos, mode) {
        var obj = this.coordTrans(x_pos, y_pos);

        this.ctx.beginPath();
        switch (mode) {
            case "P":
                this.ctx.drawImage(this.sprite['player'], obj.cx - 8, obj.cy - 8);
                break;
            case "E":
                this.ctx.drawImage(this.sprite['enemy'], obj.cx - 8, obj.cy - 8);
                break;
            case "W":
                this.ctx.drawImage(this.sprite['wall0'], obj.cx - 8, obj.cy - 8);
                break;
            case "W1":
                this.ctx.drawImage(this.sprite['wall1'], obj.cx - 8, obj.cy - 8);
                break;
            case "T":
                this.ctx.drawImage(this.sprite['target'], obj.cx - 8, obj.cy - 8);
                break;
        }
    }

    initSprite() {
        this.sprite['player'] = new Image();
        this.sprite['enemy'] = new Image();
        this.sprite['target'] = new Image();
        this.sprite['wall0'] = new Image();
        this.sprite['wall1'] = new Image();

        this.sprite['player'].src = "./sprite/player.png";
        this.sprite['enemy'].src = "./sprite/enemy.png";
        this.sprite['target'].src = "./sprite/target.png";
        this.sprite['wall0'].src = "./sprite/wall_0.png";
        this.sprite['wall1'].src = "./sprite/wall_1.png";
    }
}