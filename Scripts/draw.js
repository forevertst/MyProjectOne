var canvasFlag;
var draw_Flag = 1;
var piexs = [];
var down_flag = false;
var ctx;
var c;//canvas对象
$(function () {
    if (!CheckCanvasAble()) {
        alert("环境不支持canvas");
        return;
    }
    //alert(document.body.clientWidth);
    Init();
    BindClick();

});

function Init() {
    Initcanvas();
}
function BindClick() {
    //照片
    $("#add").click(function () {
        $("#idcardFront").val("");
        $("#idcardFront").click();
    });
    $("#idcardFront").change(function (e) {
        //var This = this;
        var imgBox = e.target;
        var file = e.target.files[0];
        if (file.size > 8 * 1024 * 1024) {
            // 文件过大
            e.target.value = '';
        } else {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (res) {
                $('#picSource').attr('src', this.result);
                ctx.clearRect(0, 0, c.width, c.height);
                piexs = [];
                loadImg();
            };
        }
    });
    $("#clear").click(function () {
        ctx.clearRect(0, 0, c.width, c.height);
        piexs = [];
        loadImg();
    });
    $("#del").click(function () {
        ctx.clearRect(0, 0, c.width, c.height);
        piexs = [];
        $('#picForCanvas').attr('src', '');
    });
    $("#display").click(function () {
        var ctx = document.getElementById("canvas_draw");
        var data = ctx.toDataURL('image/png', 1);  //1表示质量(无损压缩)
        // alert(data);
        $('#disImg').attr('src', data);
    });
}

function CheckCanvasAble() {
    var canvas = document.createElement("canvas");

    if (canvas.getContext)
        canvasFlag = true;
    else
        canvasFlag = false;
    return canvasFlag;
}

function Initcanvas() {
    c = document.getElementById("canvas_draw");
    ctx = c.getContext("2d");

    //加载图片到画布
    //loadImg();

    //监听事件
    $('canvas').mousedown(function (e) {//鼠标按下时的事件
        down_flag = true;
    }).mouseup(function (e) {//鼠标抬起事件
        down_flag = false;
        piexs = [];
        //
        draw_Flag = 1;
    }).mousemove(function (e) {//鼠标移动事件
        var a = getMousePos(c, e);
        var x = a[0];
        var y = a[1];
        if (down_flag) {//如果鼠标按下,则将点加入数组,并绘制
            var piex = {
                x: x,
                y: y
            };
            if (draw_Flag == 1) {
                piexs.push(piex);
                draw_Flag = 2;

            }
            else if (draw_Flag == 2) {
                piexs.push(piex);
                drawLine();
                // draw_Flag = 1;
            }
        }
    }).mouseleave(function () {
        down_flag = false;
        piexs = [];
        //
        draw_Flag = 1;
    })
}

function loadImg() {
    var img = document.getElementById("picSource");
    var maxSize = document.body.clientWidth*2/3;
    img.onload = function drawImage() {
        if (img.complete) {
            c.width = img.width
            c.height = img.height;
            if (img.width > maxSize || img.height > maxSize) {
                var max = img.width > img.height ? img.width : img.height;
                var flaxRatio = maxSize / max;
                c.width *= flaxRatio;
                c.height *= flaxRatio;
            }
            ctx.drawImage(img, 0, 0, c.width, c.height);
        }
    };
    if (img.complete) {
        c.width = img.width
        c.height = img.height;
        if (img.width > maxSize || img.height > maxSize) {
            var max = img.width > img.height ? img.width : img.height;
            var flaxRatio = maxSize / max;
            c.width *= flaxRatio;
            c.height *= flaxRatio;
        }
        ctx.drawImage(img, 0, 0, c.width, c.height);
    }


}
//鼠标划线的方法
function drawLine() {
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.strokeStyle = "#FF0000";
    ctx.moveTo(piexs[0].x, piexs[0].y);
    ctx.lineTo(piexs[1].x, piexs[1].y);
    ctx.closePath();
    ctx.stroke();
    piexs[0] = piexs[1];
    piexs.pop();
}
//鼠标在canvas中的位置
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return [x, y];
}