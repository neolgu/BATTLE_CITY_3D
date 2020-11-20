class MiniMapManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.mapdata = null; // objlist
        this.animationFlag = false;
    }

    dataBind(mapdata){
        this.mapdata = mapdata;
    }

    execuse(){
        this.animationFlag = true;
        this.draw();
    }

    draw(t) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //draw background
        this.ctx.beginPath();
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        // Player
        this.drawObj(this.mapdata.player.x_pos, this.mapdata.player.y_pos, "P");

        // // Enemy
        // for (var i = 0; i < this.mapdata.enemy_list.length; i++) {
        //     this.drawObj(this.mapdata.enemy_list[i].x_pos, this.mapdata.enemy_list[i], "E");
        // }

        // // Wall
        // for (var i = 0; i < this.mapdata.wall_list.length; i++) {
        //     this.drawObj(this.mapdata.wall_list[i].x_pos, this.mapdata.wall_list[i], "W");
        // }

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
        this.ctx.arc(obj.cx, obj.cy, 10, 0, 2 * Math.PI);
        this.ctx.stroke();
    }
}