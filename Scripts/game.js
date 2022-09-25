var T;
var thisNumber;

$(function () {
    InitStyle();
    // InitGame(ac,bl);
    BindClick();
    BindChange();
});

function BindClick() {
    $("#save").click(function () {

        var a = new Object();
        a.userValue = $("#userValue").val();
        //a.gameValue = "mygame2";
        var str = "";
        var tds = $("table").find("td");
        for (var i = 0; i < tds.length; i++) {
            var value = $(tds).eq(i).find("input").val();
            if (value == "")
                value = "x";
            if (i == 0) {
                str = value;
                str += ";";

            } else {
                str += value;
                str += ";";
            }
        }
        a.gameValue = str;

        var parms = jQuery.param(a);

        var str = Math.random();
        var data = str + "&methodName=SaveGame&" + parms;

        $.ajax({
            type: "GET",
            async: false,
            url: '/ASHX/WebService.ashx?' + data,
            success: function (result) {
                alert(result);
            },
            dataType: "json",
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                alert(XmlHttpRequest.responseText);
            }
        });
    });
    $("#load").click(function () {
        var a = new Object();
        a.userValue = $("#userValueToGet").val();
        //a.gameValue = "mygame2";
        //test
        var test = new Object();
        test.requestId = "123";
        test.debriefId = "abc";
        var testlist = new Array();
        testlist[0] = test;
        a.jslist = testlist;
        //

        var parms = jQuery.param(a);

        var str = Math.random();
        var data = str + "&methodName=LoadGame&" + parms;

        $.ajax({
            type: "GET",
            async: false,
            url: '/ASHX/WebService.ashx?' + data,
            success: function (result) {
                var str = result;
                var list = str.split(";");
                var tds = $("table").find("td");
                for (var i = 0; i < list.length; i++) {
                    if (list[i] == "x") {
                        list[i] = "";
                    }
                    $(tds).eq(i).find("input").val(list[i]);
                }
            },
            dataType: "json",
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                //alert(XmlHttpRequest.responseText);
            }
        });
    });


    $("#btn").click(function () {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                $("table").find("tr").eq(i).find("td").eq(j).find('input').val("");
                $("table").find("tr").eq(i).find("td").eq(j).find('input').css('color', 'black');
            }
        }
        $("#mes").html("");
        $(".choose").remove();
        $(".mark").remove();
        InitGame($('#a').val(), $('#b').val());
    });

    $(".find").click(function () {
        var x = $(this).html();
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var color = $("table").find("tr").eq(i).find("td").eq(j).find('input').css('color');
                //alert(color);
                if (color == 'rgb(255, 165, 0)') {

                } else {
                    $("table").find("tr").eq(i).find("td").eq(j).find('input').css('color', 'black');

                    var compare = $("table").find("tr").eq(i).find("td").eq(j).find('input').val();
                    thisNumber = x;
                    if (compare == x) {
                        $("table").find("tr").eq(i).find("td").eq(j).find('input').css('color', 'red');
                    }
                }
            }
        }
    });

    document.oncontextmenu = function (e) {
        return false
        //或者 e.preventDefault()
    }

    $("input").not(".No").mousedown(function (e) {
        var x = e.clientX;//
        var y = e.clientY;
        T = this;
        if (e.button == 2) {
            Apend2(x, y);
        } else if (e.button == 0) {
            Apend(x, y);
        }
        //alert(e.button);
    })


    //document.onmouseup = function (e) {
    //    if (e.button == 2) {
    //        var x = e.clientX;
    //        var y = e.clientY;
    //        T = this;
    //        Apend2(x, y);
    //    }
    //}
}

function BindChange() {
    $("input").not(".No").change(function () {
        if (Check(this)) {
            $(this).css("color", "orange");
            return;
        } else {
            $(this).css("color", "black");
            if ($(this).val() == thisNumber) {
                $(this).css("color", "red");
            } else {
                $(this).css("color", "black");
            }
        }
        CheckWin();
    });
}

function CheckWin() {
    var winFlag = true;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var This = $("table").find('tr').eq(i).find("td").eq(j).find('input');
            if (Check(This)) {
                winFlag = false;
            }
            if ($(This).eq(0).val() == "") {
                winFlag = false;
            }
        }
    }
    if (winFlag) {
        alert("You Win!");
        $('#mes').html("Well Played!");
    }
}

function Apend(x, y) {
    var str = "<table style='width:80px;table-layout:fixed;height: 150px'>";
    for (var i = 0; i < 9; i++) {
        if (i % 3 == 0) {
            str = str + "<tr style='text-align:center'>";
        }
        str = str + "<td style='width:10px;height:10px;border:pink 1px solid;background-color:#cccccc;' onclick='Choose(" + (i + 1) + ")'>" + (i + 1) + "</td>";
        if ((i - 2) % 3 == 0) {
            str = str + "</tr>";
        }
    }
    str = str + "<tr><td colspan='3' style='text-align:center;width:100%;height:10px;border:pink 1px solid;background-color:#cccccc;' onClick='Clear()'>清除</tr>";
    str += "</table>";
    var ap = "<div class='choose' style='position: absolute; left:" + (x - 40) + "px; top:" + (y - 40) + "px; \'>" + str + "</div>";
    $(document.body).append(ap);

    $(".choose").mouseleave(function () {
        $(".choose").remove();
    });
}

function Clear() {
    var This = T;
    $(This).val("");
    $(This).css('color', 'black');
    $(".choose").remove();
    T = "";

}

function Apend2(x, y) {
    var str = "<table  style='width:80px;table-layout:fixed;height: 150px'>";
    for (var i = 0; i < 9; i++) {
        if (i % 3 == 0) {
            str = str + "<tr style='text-align:center'>";
        }
        str = str + "<td style='width:10px;height:10px;border:pink 1px solid;background-color:#cccccc;' onclick='Choose2(" + x + "," + y + "," + (i + 1) + ")'>" + (i + 1) + "</td>";
        if ((i - 2) % 3 == 0) {
            str = str + "</tr>";
        }
    }
    str += "</table>";
    var ap = "<div class='choose' style='position: absolute; left:" + (x - 40) + "px; top:" + (y - 40) + "px; \'>" + str + "</div>";
    $(document.body).append(ap);

    $(".choose").mouseleave(function () {
        $(".choose").remove();
    });
}

function Choose(x) {
    var This = T;
    $(This).val(x);
    $(".choose").remove();
    T = "";

    if (Check(This)) {
        $(This).css("color", "orange");
    } else {
        $(This).css("color", "black");
        if (x == thisNumber) {
            $(This).css("color", "red");
        } else {
            $(This).css("color", "black");
        }
    }
    CheckWin();
}

function Choose2(x, y, val) {
    //alert(x);
    //onclick='Del()'
    var ap = "<div  class='mark' style='font-size:3px; position: absolute; left:" + (x) + "px; top:" + (y) + "px; \'>" + val + "</div>";
    $(document.body).append(ap);

    $(".choose").remove();
    T = "";
    $('.mark').live("click", function () {
        $(this).remove();
    });
}

function InitStyle() {
    var tdWidth = $("input").eq(0).width();
    $("input").css("height", tdWidth);
    var trs = $("#table").find("tr");

    $(trs).each(function () {
        var tds = $(this).find("td");
        $(tds).each(function () {
            var index = $(this).parent().find("td").index($(this));
            index += 1;
            if (index % 3 == 0) {
                $(this).css("border-right", "pink 10px solid");

            }
            if (index - 1 % 3 == 0) {
                $(this).css("border-left", "pink 10px solid");

            }
            var thisTr = $(this).parent();
            var indexTr = $(thisTr).parent().find("tr").index(thisTr);
            if (indexTr % 3 == 0) {
                $(this).css("border-top", "pink 10px solid");
            }
            if (indexTr == trs.length - 1) {
                $(this).css("border-bottom", "pink 10px solid");
            }

        });

    });

}

function InitGame(a, b) {

    //FillRegular();
    //InitFirst();

    RealInitFirst();

    AcrossLine(b);
    Blank(a);
}

function FillRegular() {
    var tds = $("#table").find("tr").eq(0).find("td");
    var x = 1;
    $(tds).each(function () {
        $(this).find("input").val(x);
        x++;
    });
}

function FillRegular2() {
    var tds = $("#table").find("tr").eq(0).find("td");
    var x = 1;
    $(tds).each(function () {
        $(this).find("input").val(x);
        x++;
    });
    DoChangeCol(100);
}

function Blank(input) {
    var x = input;
    //alert(x);
    for (var i = 1; i <= x; i++) {
        var a = Random();
        var b = Random();

        $("table").find("tr").eq(a).find("td").eq(b).find('input').val("");
    }


}

function AcrossLine(input) {
    var x = input;
    var i = 1;
    for (i; i <= x; i++) {
        //DoChangeOne();
        DoChangeRow();
        DoChangeCol();
    }
}

function DoChangeOne() {
    var x = Random();
    while (x == 2 || x == 5 || x == 8) {
        x = Random();
    }
    var tr1 = $("table").find("tr").eq(x);
    var tr2 = $("table").find("tr").eq(x + 1);
    for (var i = 0; i < 9; i++) {
        var temp;
        var a = $(tr1).find("td").eq(i).find('input').val();
        var b = $(tr2).find("td").eq(i).find('input').val();
        temp = a;
        $(tr1).find("td").eq(i).find('input').val(b);
        $(tr2).find("td").eq(i).find('input').val(temp);
    }

    for (var i = 0; i < 9; i++) {
        var temp;
        var a = $("table").find("tr").eq(i).find("td").eq(x).find('input').val();
        var b = $("table").find("tr").eq(i).find("td").eq(x + 1).find('input').val();
        temp = a;
        $("table").find("tr").eq(i).find("td").eq(x).find('input').val(b);
        $("table").find("tr").eq(i).find("td").eq(x + 1).find('input').val(temp);

    }
}

function DoChangeRow() {
    var x = Random();
    while (x == 2 || x == 5 || x == 8) {
        x = Random();
    }
    var tr1 = $("table").find("tr").eq(x);
    var tr2 = $("table").find("tr").eq(x + 1);
    for (var i = 0; i < 9; i++) {
        var temp;
        var a = $(tr1).find("td").eq(i).find('input').val();
        var b = $(tr2).find("td").eq(i).find('input').val();
        temp = a;
        $(tr1).find("td").eq(i).find('input').val(b);
        $(tr2).find("td").eq(i).find('input').val(temp);
    }
}

function DoChangeCol(input) {
    var flag = false;
    var time;
    if (input == null) {
        input = 1;
    } else {
        flag = true;
    }
    for (var m = 0; m < input; m++) {
        var x = Random();
        if (!flag) {
            while (x == 2 || x == 5 || x == 8) {
                x = Random();
            }
        }
        if (!flag) {
            y = x + 1;
            time = 9;
        } else {
            time = 1;
            y = Random();
        }

        for (var i = 0; i < time; i++) {
            var temp;
            var a = $("table").find("tr").eq(i).find("td").eq(x).find('input').val();
            var b = $("table").find("tr").eq(i).find("td").eq(y).find('input').val();
            temp = a;
            $("table").find("tr").eq(i).find("td").eq(x).find('input').val(b);
            $("table").find("tr").eq(i).find("td").eq(y).find('input').val(temp);

        }

    }
}


function InitFirst() {
    var trs = $("#table").find("tr");
    var i = 0;
    for (i; i < trs.length; i++) {
        var j = 0;
        var tds = $(trs).eq(i).find("td");
        for (j; j < tds.length; j++) {
            var This = $(tds).eq(j).find("input");
            var times = 0;

            if ($(This).val() == "") {
                var thisIndex = $('#table').find('td').index($(This).parent()) - 1;
                var thisValue = $('table').find('td').eq(thisIndex).find('input').val();
                thisValue = parseInt(thisValue) + 1;
                if (thisValue > 9)
                    thisValue = 1;
                $(This).val(thisValue);
            }
            while (Check(This)) {
                times++;
                if (times > 1000) {
                    return;
                }

                var x = $(This).val();
                $(This).val(parseInt(x) + 1);
                if ($(This).val() > 9)
                    $(This).val(1);
            }
        }
    }
}

function RealInitFirst() {
    FillRegular();
    InitFirst();
    FillRegular2();
    var a = [];
    for (var i = 0; i < 9; i++) {
        a[i] = $("table").find("tr").eq(0).find("td").eq(i).find('input').val();
    }

    for (var i = 1; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var val = $("table").find("tr").eq(i).find("td").eq(j).find('input').val();
            $("table").find("tr").eq(i).find("td").eq(j).find('input').val(a[val - 1]);
        }
    }
}

function Check(This) {
    var Flag = 1;
    var value = $(This).val();
    //if (value >= 10)
    //    value = 1;
    var td = $(This).parent();
    var rowIndex = $(td).parent().find("td").index($(td));
    var colIndex = $("table").find("tr").index($(td).parent());
    //rowIndex -= 1;
    //colIndex -= 1;
    var trs = $("table").find("tr");
    var i = 0;
    for (i; i < trs.length; i++) {
        var j = 0;
        var tds = $(trs).eq(i).find("td");
        for (j; j < tds.length; j++) {
            if ((i == colIndex && j == rowIndex)) {
                continue;
            }
            if ((i == colIndex && j != rowIndex) || (i != colIndex && j == rowIndex)) {
                var counter = $(trs).eq(i).find("td").eq(j).find("input").val();
                if (counter == value) {
                    Flag = 2;
                }
            }
        }
    }

    var k = [0, 0];
    var l = [0, 0];
    if (colIndex >= 0 && colIndex < 3) {
        k[1] = 0;
        k[2] = 2;
    }
    if (colIndex >= 3 && colIndex < 6) {
        k[1] = 3;
        k[2] = 5;
    }
    if (colIndex >= 6 && colIndex < 9) {
        k[1] = 6;
        k[2] = 8;
    }
    if (rowIndex >= 0 && rowIndex < 3) {
        l[1] = 0;
        l[2] = 2;
    }
    if (rowIndex >= 3 && rowIndex < 6) {
        l[1] = 3;
        l[2] = 5;
    }
    if (rowIndex >= 6 && rowIndex < 9) {
        l[1] = 6;
        l[2] = 8;
    }
    var trs = $("table").find("tr");
    var m = k[1];
    for (m; m <= k[2]; m++) {
        var tds = $(trs).eq(m).find("td");
        var n = l[1];
        for (n; n <= l[2]; n++) {
            var counter = $(trs).eq(m).find("td").eq(n).find("input").val();
            if (!(colIndex == m && rowIndex == n)) {
                //alert(m + ";" + n + ";" + colIndex + ';' + rowIndex);
                if (counter == value) {
                    //alert(m + ";" + n + ";" + colIndex + ';' + rowIndex);
                    Flag = 3;
                }
            }
        }
    }
    var returnFlag;
    //if (colIndex == 4 && rowIndex == 0) {
    //    alert(Flag+";"+value);
    //}
    if (Flag == 1)
        returnFlag = false;
    else
        returnFlag = true;
    //alert(returnFlag);
    return returnFlag;
}

function Random() {
    var startNumber = 0;
    var endNumber = 8;
    var choice = endNumber - startNumber + 1;

    return Math.floor(Math.random() * choice + startNumber)

}