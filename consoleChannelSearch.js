var CDNROOTDIR = "";
var DARKESTCOLOR = "#0178af";
var DARKCOLOR = "#188fc6";
var LIGHTCOLOR = "#34abe2";
var LIGHTERCOLOR = "#4ec5fc";
var LIGHTESTCOLOR = "#5ad1ff";

var HTML = null;

var styleDefault = "* {scrollbar-width: thin;scrollbar-color: DARKESTCOLOR;}*::-webkit-scrollbar {width: 5px;height: 5px;}*::-webkit-scrollbar-track {background: LIGHTERCOLOR;}*::-webkit-scrollbar-thumb {background-color: DARKESTCOLOR;border-radius: 5px;}input:-webkit-autofill {-webkit-text-fill-color: DARKESTCOLOR;-webkit-box-shadow:0 0 0 50px white inset;}input:-webkit-autofill:focus {-webkit-text-fill-color: DARKESTCOLOR;-webkit-box-shadow: 0 0 0 50px white inset;}@-webkit-keyframes autofill {to {color: DARKESTCOLOR;background: #ffffff;}}input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill{-webkit-animation-name: autofill;-webkit-animation-fill-mode: both;}.glass{position: relative;display: inline-block;padding-left: 7px;padding-right: 7px;padding-top: 5px;padding-bottom: 3px;margin: 0px;background-color: DARKCOLOR;background-image: linear-gradient(DARKCOLOR,LIGHTCOLOR);height:16px !important;text-decoration: none;color: #ffffff;font-size: 12px;font-family: sans-serif;font-weight: bold;border-radius: 3px;}.glass:after{content: '';position: absolute;top: 1px;left: 2px;width: calc(100% - 4px);height: 50%;background: linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.2));}.glass:hover{background: linear-gradient(LIGHTCOLOR,LIGHTERCOLOR);}.glassHeader{position: relative;display: inline-block;padding: 1px 1px;background-color: DARKCOLOR;background-image: linear-gradient(DARKCOLOR,LIGHTCOLOR);border-radius: 3px;text-shadow: 0px -1px DARKESTCOLOR;}.glassHeader:after{content: '';position: absolute;top: 2px;left: 2px;width: calc(100% - 4px);height: 50%;background: linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.2));}.mat{position: relative;display: inline-block;background-color: DARKCOLOR;border: 2px solid DARKESTCOLOR;border-radius: 3px;width: 74px;height: 20px;padding: 5px 4px 0px 0px;color: #fff;font-size: 12px;font-family: sans-serif;font-weight: bold;cursor:pointer;}th, td {border: 2px solid DARKESTCOLOR;color : DARKESTCOLOR;}th {background: LIGHTCOLOR;color:#ffffff;}.fixed_header{width: 170px;table-layout: fixed;border-collapse: collapse;}.fixed_header tbody{display:block;width: 100%;overflow: auto;height: 116px;}.fixed_header thead tr {display: block;}.fixed_header thead {color:#ffffff;}table.fixed_header > thead{background-color: DARKESTCOLOR;}table.fixed_header > thead > tr > th:nth-of-type(1) {padding: 2px;text-align: center;font-family: sans-serif;font-size:14px;width: 30px !important;background-color: LIGHTCOLOR;}table.fixed_header > thead > tr > th:nth-of-type(2) {padding: 2px;text-align: center;font-family: sans-serif;font-size:14px;width: 140px;background-color: LIGHTCOLOR;}table.fixed_header > tbody > tr > td:nth-of-type(1) {padding: 2px;text-align: center;font-family: sans-serif;font-size:10px;width: IMGWIDTH !important;}table.fixed_header > tbody > tr > td:nth-of-type(2) {padding: 2px;text-align: center;font-family: sans-serif;font-size:10px;width: CONTEXTWIDTH !important;}#contextName{border-radius:5px;background-color:#ffffff !important;color:DARKESTCOLOR !important;border: 2px solid DARKESTCOLOR;border-color: DARKESTCOLOR;margin-top:2px !important;}#contextName:focus {border: 2px solid DARKESTCOLOR;border-color: DARKESTCOLOR;background-color:#ffffff !important;color:DARKESTCOLOR !important;-webkit-box-shadow: none;box-shadow: none;outline: none;}.ui{width:170px;height:170px;margin-top:0px;margin-bottom:0px;margin-left:auto !important;margin-right:auto !important;padding: 0px 0px 0px 0px;}#confirm {display: none;color:#ffffff;background-color: LIGHTESTCOLOR;border: 2px solid DARKESTCOLOR;border-radius: 5px;position: fixed;width: 100px;height: 60px;left: 40%;top: 40%;box-sizing: border-box;text-align: center;font-family: sans-serif;font-weight:bold;}#confirm button {background-color: DARKCOLOR;color:#ffffff;display: inline-block;border-radius: 5px;border: 2px solid DARKESTCOLOR;padding: 5px;text-align: center;width: 60px;cursor: pointer;font-family: sans-serif;font-weight:bold;}#confirm .message {padding-top:4px;padding-bottom:4px;text-align: center;}a{color:DARKESTCOLOR;}";

$(document).ready(function () {

    var body = $("#body");
    var path = document.getElementById("cdnOrigin").src;
    var CDNROOTDIR = getPath(path);
    console.log('cdnOrigin : ' + CDNROOTDIR);
    
    $.get(CDNROOTDIR + 'consoleChannelSearchUI.html', function (contents) {
        HTML = $.parseHTML(contents.replaceAll("@",CDNROOTDIR));
        body.append(HTML);
        buildUI();
    }, 'text');

    buildUI();

});

function getPath(path){
    path = path.match(/(^.*[\\\/]|^[^\\\/].*)/i);
    if(path != null){
        return path[0];
    }else{
        return false;
    }            
}

function buildUI(){
    
    var color = (new URL(location.href)).searchParams.get('color');
    
    if (color != null && color != "") {
        fetchHues('#' + color);
    } else {
        fetchHues('#0178af');
    }    
    
    styleDefault = styleDefault.replaceAll("DARKESTCOLOR", DARKESTCOLOR).replaceAll("DARKCOLOR", DARKCOLOR).replaceAll("LIGHTCOLOR", LIGHTCOLOR).replaceAll("LIGHTERCOLOR", LIGHTERCOLOR).replaceAll("LIGHTESTCOLOR", LIGHTESTCOLOR).replace("IMGWIDTH", IMGWIDTH).replace("CONTEXTWIDTH", CONTEXTWIDTH);
    
    console.log(styleDefault);
    
    injectCSS(styleDefault);    
    
    if (GLASS == "false") {
        $('#contextName').width(78);
        $('#contextName').height(23);
        $('#searchButton').removeClass("glass");
        $('#searchButton').addClass("mat");
        $('#confirmAlert').addClass("mat");
    } else {
        $('#contextName').width(77);
        $('#contextName').height(20);
        $('#colIcon').addClass("glassHeader");
        $('#colIcon').width(34);
        $('#colContext').addClass("glassHeader");
        $('#colContext').width(118);
        $('#confirmAlert').addClass("glass");
    }    
}

const injectCSS = css => {
    let el = document.createElement('style');
    el.type = 'text/css';
    el.innerText = css;
    document.head.appendChild(el);
    return el;
};

function LightenDarkenColor(col, amt) {
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;
    var b = ((num >> 8) & 0x00FF) + amt;
    var g = (num & 0x0000FF) + amt;
    var newColor = g | (b << 8) | (r << 16);
    return newColor.toString(16);
}

function LightenColor(color, percent) {
    var num = parseInt(color.replace("#", ""), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            B = (num >> 8 & 0x00FF) + amt,
            G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
}
;

function fetchHues(colorHex) {
    var hue1 = LightenColor(colorHex, 9);
    var hue2 = LightenColor(colorHex, 20);
    var hue3 = LightenColor(colorHex, 30);
    var hue4 = LightenColor(colorHex, 35);

    DARKESTCOLOR = colorHex;
    DARKCOLOR = hue1;
    LIGHTCOLOR = hue2;
    LIGHTERCOLOR = hue3;
    LIGHTESTCOLOR = hue4;

}

function searchIfHaveParam() {
    var contextName = $("#contextName").val();
    if (contextName.length < 3) {
        var confirmBox = $("#alerter");
        confirmBox.find(".yes").unbind().click(function () {
            confirmBox.toggle();
        });
        confirmBox.show();
    } else {
        doContextSearch();
    }
}

function doContextSearch() {
    var contextName = $("#contextName").val();
    $.ajax({
        url: BASEURL + "jquery/searchContextsByName/?contextName=" + contextName
    }).then(function (data) {
        $("#contextsContent").find("tr").remove().end();
        for (var i = 0; i < data.length; i++) {
            $("#contextsContent").append("<tr><td><img onclick=\"viewContextSvg('" + data[i].id + "');\" src=\"data:image/png;base64," + data[i].base64Image + "\" title=\"Context : " + data[i].context + " - " + data[i].id + "\" style=\"cursor:pointer;width:30px;height:30px;\"/></td><td onclick=\"viewContextSvg('" + data[i].id + "');\" title=\"Context : " + data[i].context + " - " + data[i].id + "\" style=\"cursor:pointer;\" class=\"contextText\">" + data[i].context + "</td></tr>");
        }
    });
}

function viewContextSvg(contextId) {
    window.parent.viewContextSvg(contextId, true, false);
}