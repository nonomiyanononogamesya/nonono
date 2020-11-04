$(document).ready(function () {
    //音乐播放器需要，播放器对象player，音乐对象，用play去播放music对象 
    // 创建music对象,用于保存音乐的属性 
    function Music() {

    }
    Music.prototype.src = "";
    Music.prototype.img = "";
    Music.prototype.num = "";
    Music.prototype.sc_name = "";
    Music.prototype.jp_name = "";
    //创建player对象 
    function Player() {

    }
    Player.prototype.audio = document.getElementById("audio");
    // 目前播放第几首歌 
    Player.prototype.playIndex = 0;
    Player.prototype.isplay = false;
    // 定义播放器的方法 
    Player.prototype.rangUpdate = function () {
        //this.audio.ontimeupdate =function() 音乐播放器播放音乐时监听 
        //把进度条和音乐的时间长度结合起来 
        //音乐每播放一秒进读条就会前进一个单位 this.duration音乐的总长度 
        this.audio.ontimeupdate = function () {
            //把进度条的总长度设为音乐的总长度 
            $(".range").attr("max", this.duration);

            //设置进度条的值为播放的时间 
            $(".range").val(this.currentTime);
            //当一首歌播放完再去播放下一首 
            if (this.currentTime == this.duration) {
                player.nextMusic();
            }



        }

    };
    Player.prototype.playMusic = function () {
        //向播放器添加音乐路径 
        $(this.audio).attr("src", musicModels[this.playIndex].src);
        this.audio.play();
        //换音乐图片 
        $(".pic").attr("src", musicModels[this.playIndex].img);
        //波让其的状态 
        this.isplay = true;

    };
    Player.prototype.nextMusic = function () {


        //越界问题 
        if (this.playIndex >= musicModels.length - 1) {
            this.playIndex = 0;

        } else {
            this.playIndex = this.playIndex + 1;
        }
        //改变音乐类表的对应项的样式 

        this.playMusic();
        $(".music").eq(this.playIndex).addClass("musicPlay")
            .siblings()
            .removeClass("musicPlay");

    };
    Player.prototype.preMusic = function () {
        if (this.playIndex <= 0) {
            this.playIndex = musicModels.length - 1;

        } else {
            this.playIndex = this.playIndex - 1;
        }
        //改变音乐类表的对应项的样式 

        this.playMusic();
        $(".music").eq(this.playIndex).addClass("musicPlay")
            .siblings()
            .removeClass("musicPlay");
    };
    Player.prototype.playOrPause = function () {
        if (this.isplay) {
            this.audio.pause();
            $(".play").attr("src", "icon/play.svg");
        } else {
            this.audio.play();
            $(".play").attr("src", "icon/pause.svg");
        }
        this.isplay = !this.isplay;
    };
    // js文件从此向下 
    // 创建音乐数组 
    var musicModels = [];
    //创建音乐播放器对象 
    var player = new Player();
    /*Ajax 目的是在js中实现异步操作 
     * JS是单线程 的，在单线程中模拟java oc 多线程 开辟异步任务，，浏览器的引擎去做一步操作， 
     * 实质上不是开辟一个子线程，而是创建一个异步任务 
     * 优点： 
     * 1.不需要用户等待服务器相应 
     * 在异步派发xmlHTTPRequest 请求后，马上把控制权收回就被返回浏览器空页面 
     * 界面不会出现白板，等待后台服务器得到请求后，再去执行完成方法，在方法中填写界面数据的代码 
     * 2.不需要加载整个页面只需要更新局部数据，节省流量，减轻服务器压力 
     * 
     * 为xmlHTTPRequest 设置一个回调函数，服务器数据到达时触发函数，发送请求时可以带少量的参数 
     * 实现按需去数据 
     * 
     $.ajax(),这是jQuery 对ajax的封装的最基础的函数，通过这个函数可以实现异步通讯功能 
     var configObj= { 
   //  method:数据提交方式 get OR post 
     URL：请求的网址 
     async：是否异步，默认true 
     data：post请求的参数 
     dataType ：服务器返回的类型，xml string json 
     success:请求成功后的回调方法 
     error ：请求失败后的方法 
     
     } 
     $.ajax(configObj);完成异步请求 
     二、$post()只能采取post请求 
     三、$get() 
     四、$getJSON( url ,完成回调);可以请求本地路径的内容 
     * 
     * 
     * */
    $.getJSON("music_list.json", function (data) {
        //  console.log(data); 
        for (var i = 0; i < data.length; i++) {
            var music = new Music();
            music.src = data[i].src;
            music.img = data[i].img;
            music.sc_name = data[i].sc_name;
            music.jp_name = data[i].jp_name;
            music.num = data[i].num;
            musicModels.push(music);

        }
        //播放音乐 
        isertData();
        player.playMusic();
        player.rangUpdate();
        $(".music").eq(player.playIndex).addClass("musicPlay")
            .siblings()
            .removeClass("musicPlay");
    });
    function isertData() {
        //先要遍历数据源数组 
        /* 
        html5 中添加了一个data-*的方式 来自定义属性 
        用data-前缀，添加到自定义属性名上， 
        这样的结构可以存储少量的数据 
        * */
        for (var i = 0; i < musicModels.length; i++) {
            //  /创建一个DIV元素表示,音乐中的一行,给这个div添加music样式 
            //和绑定自定义属性index来记录这个div是列表中的第几行 
            var $musicDiv = $("<div class = 'music' data-index = " + i + "></div>");
            //  将这个div添加到musicBox 中 
            $(".inner").append($musicDiv);
            //  设计musicdiv中的子元素,子元素有两个,一个是歌曲的图片,歌曲的信息 
            //  创建一个img 显示歌曲图片 
            var $img = (
                "<img src =" + musicModels[i].img + " />");
            $musicDiv.append($img);
            //  创建一个音乐信息的p标签 
            var $musicMsg = $("<p>" + musicModels[i].sc_name + " &nbsp;&nbsp;&nbsp;&nbsp;"
                + musicModels[i].jp_name
                + "</p>"
            );
            $musicDiv.append($musicMsg);

        }
        $(".music").click(
            function (e) {
                //从被选中的div中读取自定义 index属性 

                player.playIndex = $(this).data("index");
                player.playMusic();
                //被选中的div设置musicplay样式，该div的兄弟元素要溢出musicplay样式 
                //保证只有一个div有musicplay 
                $(this).addClass("musicPlay").siblings().removeClass("musicPlay");


            }
        );
    }

    $(".play").click(function () {
        player.playOrPause();
    });

    $(".next").click(function () {
        player.nextMusic();
    });
    $(".pre").click(function () {
        player.preMusic();
    });

    $(".range").on("input propertychange", () => {
        player.audio.currentTime = $(".range").val()
        player.audio.play();
    })
})