//list와 관련된 동작을 수행
function ObjectList(){

    this.wall_list = [];
    this.player;
    this.enemy_list =[];
    this.bullet_list = [];
    this.garbage_list =[];

    this.initializer = function()
    {
        this.player = -1;
        this.wall_list = [];
        this.enemy_list =[];
        this.bullet_list = [];
        this.garbage_list =[];
    }

    this.bullet_action = function()
    {
        var code = -1;
        var result_index = -1;
        //bullet_list가 수행해야 하는 search
        for(var bullet_index=0; bullet_index<this.bullet_list.length; bullet_index++)
        {
            this.bullet_list[bullet_index].frameWork();
            var center = this.bullet_list[bullet_index].center;
            var r = this.bullet_list[bullet_index].shape[0]/2;
            if(code==-1)
            {
                for(var wall_index=0; wall_index<this.wall_list.length; wall_index++)
                {
                    //충돌검사 + etc
                    var standard = (r/2) + (this.wall_list[wall_index].shape[0]/2)
                    if(getDistance(center, this.wall_list[wall_index].center)<standard)
                    {
                        if(!this.wall_list[wall_index].overwhelming)
                        {
                            code = 3;//wall code
                            result_index=wall_index;//get index
                        }
                        else
                            code = -2;//exception

                        break;
                    }
                }
            }
            if(code==-1)
            {

                for(var enemy_index=0; enemy_index<this.enemy_list.length; enemy_index++)
                {
                    //충돌검사 + etc
                    var standard = (r/2) + (this.enemy_list[enemy_index].shape[0]/2)
                    if(this.bullet_list[bullet_index].team&&getDistance(center, this.enemy_list[enemy_index].center)<standard)
                    {
                        code=2;
                        result_index=enemy_index;
                        break;
                    }
                }
            }
            if(code==-1)
            {/*
                if(this.player!=-1)
                {
                    var standard = (r/2) + (this.player.shape[0]/2)
                    if(getDistance(center, this.player.center)<standard)
                    {
                        code=1;
                        result_index=-1;
                    }
                }*/
            }
            if(code==-2)
            {
                this.addToGarbageList(4, bullet_index);
            }
            else if(code!=-1)
            {
                this.addToGarbageList(4, bullet_index);
                this.addToGarbageList(code, result_index);
            }

        }

        return [code, result_index];
    }
    this.enemy_action = function()
    {
        for(var enemy_index=0; enemy_index<this.enemy_list.length; enemy_index++)
        {
            //enemy_list가 수행해야 하는 search
            var ray = false;

            for(var wall_index=0; wall_index<this.wall_list.length; wall_index++)
            {
                var standard = (this.wall_list[wall_index].shape[0]/2) + (this.enemy_list[enemy_index].shape[0]/2)
                ray = check_ray(this.enemy_list[enemy_index], this.wall_list[wall_index], this.enemy_list[enemy_index].predict_sight, this.wall_list[wall_index].shape[0]);
                if(ray)
                {
                    this.enemy_list[enemy_index].sight_object=3;
                    break;
                }
                else
                {
                    this.enemy_list[enemy_index].sight_object=-1;
                }

            }
            if(this.enemy_list[enemy_index].sight_object==-1)
            {
                for(var enemy_index2 =0 ; enemy_index2<this.enemy_list.length; enemy_index2++)
                {
                    if(enemy_index==enemy_index2)
                        continue;
                    var standard = this.enemy_list[enemy_index].shape[0]
                    ray = check_ray(this.enemy_list[enemy_index], this.enemy_list[enemy_index2], this.enemy_list[enemy_index].predict_sight, this.enemy_list[enemy_index2].shape[0]);
                    if(ray)
                    {
                        this.enemy_list[enemy_index].sight_object=2;
                        break;
                    }
                    else
                    {
                        this.enemy_list[enemy_index].sight_object=-1;
                    }
                }
            }
            for(var bullet_index=0; bullet_index<this.bullet_list.length; bullet_index++)
            {

            }
        }
        return [ray];//ray, etc... code형태로
    }
    this.wall_action = function()
    {
        //wall은 action을 수행하지 않음, 사실상 이용되지 않을듯?
    }
    this.player_action = function()
    {
        var collider = false;
        for(var wall_index=0; wall_index<this.wall_list.length; wall_index++)
        {
            //[width, width]는 벽돌의 크기가 제각기 다를 때 변형
            if(collisionRect(this.wall_list[wall_index].center,this.wall_list[wall_index].shape,[this.player.x_pos, this.player.y_pos],this.player.shape))
            {
                collider=true;
            }
        }
        for(var enemy_index=0; enemy_index<this.enemy_list.length; enemy_index++)
        {
            //[width, width]는 벽돌의 크기가 제각기 다를 때 변형
            if(collisionRect(this.enemy_list[enemy_index].center,this.enemy_list[enemy_index].shape,[this.player.x_pos, this.player.y_pos],this.player.shape))
            {
                collider=true;
            }
        }
        return collider;
    }

    this.addToGarbageList = function(code, index)
    {
        if(code==1)
        {
            //게임오버 or 라이프
        }
        this.garbage_list.push({tag:code, idx:index});
    }
    this.frameWork = function()
    {
        this.enemy_action();
        this.bullet_action();
        this.garbage_list.reduce(function(acc, curr, index){
            acc.indexOf(curr)>-1? acc: acc.push(curr);
            return acc;
        }, []);
        this.garbage_list.sort(function(a, b){
            a.idx>b.idx?-1:a.idx<b.idx?1:0;
          });
        for(var g=0; g<this.garbage_list.length;g++)
        {
            this.removeObject(this.garbage_list[g]);
        }
        this.garbage_list.length=0;
    }
    this.removeObject = function(target)
    {
        if(target.tag==3)
        {
            this.wall_list.splice(target.idx, 1);
        }
        else if(target.tag==4)
        {
            this.bullet_list.splice(target.idx, 1);
        }
        else if(target.tag==2)
        {
            this.enemy_list.splice(target.idx, 1);
        }
    }
}
