var PUBLICKEY = "";
var VISITORIP = "";
var CDNROOTDIR = "";
var HTML = null;

$(document).ready(function () {

    var body = $("#body");
    var path = document.getElementById("cdnOrigin").src;
    var CDNROOTDIR = getPath(path);
    PUBLICKEY = document.getElementById("cdnOrigin").getAttribute("data-publicKey");
    VISITORIP = document.getElementById("cdnOrigin").getAttribute("data-visitorIp");
    console.log('cdnOrigin : ' + CDNROOTDIR);
    console.log('PUBLICKEY : ' + PUBLICKEY);
    console.log('VISITORIP : ' + VISITORIP);
    
    $.get(CDNROOTDIR + 'consoleViewportUI.html', function(contents) {
        HTML = $.parseHTML(contents.replaceAll("@",CDNROOTDIR));
        body.append(HTML);
        buildUI();
    },'text');           

});

function getPath(path){
    path = path.match(/(^.*[\\\/]|^[^\\\/].*)/i);
    if(path != null){
        return path[0];
    }else{
        return false;
    }            
}

function buildUI() {
    
    console.log('host : ' + window.location.hostname);

    $(document).tooltip();    
        
    var submit = $("button").button();
    submit.css("font-size", "0.7em");

    $("#grid").attr("src", GRIDURL);
    $("#preview").attr("src", ORIGURL);
    
    $("#shrinkFitVar").text(SHRINKFIT);
    $("#expandFitVar").text(EXPANDFIT);
    $("#fitWidthVar").text(FITWIDTH);
    $("#fitHeightVar").text(FITHEIGHT);
    
    var url = $('#url');
    url.addClass("ui-corner-all");
    url.width(640);
    url.css("border", "0px");
    url.css("color", "#0178af");
    url.val(ORIGURL);

    var moveX = $("#moveX").spinner({step: 10, min: 0, max: 1000});
    moveX.width(30);
    moveX.spinner("value", 0);
    moveX.css("font-size", "0.6em");
    moveX.css("color", "#0178af");
    moveX.css("border", "0px");

    var moveY = $("#moveY").spinner({step: 10, min: 0, max: 1000});
    moveY.width(30);
    moveY.spinner("value", 0);
    moveY.css("font-size", "0.6em");
    moveY.css("color", "#0178af");

    var fitWidth = $("#fitWidth").spinner({step: 10, min: 0, max: 1000});
    fitWidth.width(30);
    fitWidth.spinner("value", 600);
    fitWidth.css("font-size", "0.6em");
    fitWidth.css("color", "#0178af");

    var fitHeight = $("#fitHeight").spinner({step: 10, min: 0, max: 1000});
    fitHeight.width(30);
    fitHeight.spinner("value", 500);
    fitHeight.css("font-size", "0.6em");
    fitHeight.css("color", "#0178af");

    var rotate = $("#rotate").spinner({step: 10, min: 0, max: 1000});
    rotate.width(30);
    rotate.spinner("value", 0);
    rotate.css("font-size", "0.6em");
    rotate.css("color", "#0178af");

    $("#submit").on("click", function () {
        newUrl = ORIGURL;
        addQSParm("moveX", moveX.spinner("value"));
        addQSParm("moveY", moveY.spinner("value"));
        addQSParm("fitWidth", fitWidth.spinner("value"));
        addQSParm("fitHeight", fitHeight.spinner("value"));
        addQSParm("rotate", rotate.spinner("value"));

        const slug = newUrl.split('/').pop();
        url.val(slug);

        $('#preview').attr('src', newUrl);
        $('#viewportDiv').empty();

        var minRight = parseInt(moveX.spinner("value"));
        var minDown = parseInt(moveY.spinner("value"));

        var maxRight = parseInt(moveX.spinner("value")) + parseInt(fitWidth.spinner("value"));
        var maxDown = parseInt(moveY.spinner("value")) + parseInt(fitHeight.spinner("value"));

        var draw = SVG().addTo('#viewportDiv');
        draw.attr({width: 800});
        draw.attr({height: 600});

        var minRightSVG = draw.line(minRight, 0, minRight, minDown).attr({'stroke-dasharray': '10,10'}).stroke({color: '#f06', width: 2});
        var maxRightSVG = draw.line(maxRight, 0, maxRight, maxDown).attr({'stroke-dasharray': '10,10'}).stroke({color: '#f06', width: 2});
        var minDownSVG = draw.line(0, minDown, minRight, minDown).attr({'stroke-dasharray': '10,10'}).stroke({color: '#f06', width: 2});
        var maxDownSVG = draw.line(0, maxDown, maxRight, maxDown).attr({'stroke-dasharray': '10,10'}).stroke({color: '#f06', width: 2});

    });
};

function navigate(page) {
    switch (page) {
        case 'contextConsole.html':
            if (CONTEXTID) {
                location.href = BASEURL + page + '?contextId=' + CONTEXTID;
            } else {
                location.href = BASEURL + page;
            }
            break;
        case 'symbologyConsole.html':
            if (SYMBOLOGYID) {
                location.href = BASEURL + page + '?symbologyId=' + SYMBOLOGYID;
            } else {
                location.href = BASEURL + page;
            }
            break;
        case 'symbolConsole.html':
            location.href = BASEURL + page;
            break;
        case 'channel.html':
            if (CONTEXTID) {
                var fitWidth = $("#fitWidth").spinner("value");
                var fitHeight = $("#fitHeight").spinner("value");
                if (!window.matchMedia("(pointer: coarse)").matches && (fitWidth == "0" || fitHeight == "0")) {
                    var WIDTH = $(document).width();
                    var HEIGHT = $(document).height();
                    fitWidth = Math.ceil(WIDTH / 3);
                    fitHeight = Math.ceil(HEIGHT / 2);
                }
                var url = BASEURL + page + '?showTracker=true&trackerScale=1.0&glass=false&color=0178af&navColor=b5d7e8&fitWidth=' + fitWidth + '&fitHeight=' + fitHeight + '&contextId=' + CONTEXTID;
                window.open(url, "_blank");
            } else {
                var WIDTH = $(document).width();
                var HEIGHT = $(document).height();
                if (!window.matchMedia("(pointer: coarse)").matches) {
                    WIDTH = Math.ceil(WIDTH / 3);
                    HEIGHT = Math.ceil(HEIGHT / 2);
                }
                var url = BASEURL + page + '?showTracker=true&trackerScale=1.0&glass=false&color=0178af&navColor=b5d7e8&fitWidth=' + WIDTH + '&fitHeight=' + HEIGHT;
                window.open(url, "_blank");
            }
            break;
        case 'context.html':
            console.log('CONTEXTID : ' + CONTEXTID);
            if(CONTEXTID == ""){
               CONTEXTID = "00000000000000000000000000000000";
            }
            if (CONTEXTID) {
                var fitWidth = $("#fitWidth").spinner("value");
                var fitHeight = $("#fitHeight").spinner("value");
                var url = BASEURL + 'animatedContext/' + CONTEXTID + '/1.0/animatedContext.html?fitWidth=' + fitWidth + '&fitHeight=' + fitHeight;
                window.open(url, "_blank");
            }
            break;
        default:
    }
}

function addQSParm(name, value) {
    var re = new RegExp("([?&]" + name + "=)[^&]+", "");
    function add(sep) {
        newUrl += sep + name + "=" + encodeURIComponent(value);
    }
    if (newUrl.indexOf("?") === -1) {
        add("?");
    } else {
        if (re.test(newUrl)) {
            change();
        } else {
            add("&");
        }
    }
}

function openUrl() {
    var fitWidth = $("#fitWidth").spinner("value");
    var fitHeight = $("#fitHeight").spinner("value");
    var url = ORIGURL + "?fitWidth=" + fitWidth + '&fitHeight=' + fitHeight;
    window.open(url, "_blank");
}