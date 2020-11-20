function Stage()
{
    this.axis_num=0;
    this.block_size = 1;
    this.object_list = new ObjectList();
    this.frameWork = function()
    {
        //프레임 별 수행해야 할 동작
        
    }
    
    this.over = function()
    {
        console.log("게임 오버_메인 화면으로");
    }

    //대충 맵구성, 적 수, etc 구현.
}