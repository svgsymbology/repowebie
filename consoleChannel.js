var PUBLICKEY = "";
var VISITORIP = "";
var CDNROOTDIR = "";
var CURRENTCONTEXT = "00000000000000000000000000000000";
var DEVICE = "";
var DEVICEWIDTH = 0;
var DEVICEHEIGHT = 0;
var WIDTH = "600";
var HEIGHT = "500";
var FITWIDTH = "600";
var FITHEIGHT = "500";
var SHOWTRACKER = "true";
var TRACKERSCALE = "";
var DARKESTCLR = "";
var GLASS = "";
var FONTSIZE = 40;
var FONTLEFTMARGIN = 10;
var ICONSIZE = 50;
var BARWIDTH_PC = 60;
var BARWIDTH_MOBILE = 56;
var BARWIDTH = BARWIDTH_PC;
var PARENTURL = "";
var PARENTREGISTERED = false;
var SITEURL = "";
var rootData;
var rootDataStr = "";
var DARKESTCOLOR = "#0178af";
var DARKCOLOR = "#188fc6";
var LIGHTCOLOR = "#34abe2";
var LIGHTERCOLOR = "#4ec5fc";
var LIGHTESTCOLOR = "#5ad1ff";
var NAVCOLOR = "#b5d7e8";
var HTML = null;

const CACHE_BASE64 = new Map();
const CACHE_SVG = new Map();
const CACHE_JS = new Map();

var styleDefault = "topLeft{background-color: NAVCOLOR;} div.horscroll {margin:0 !important;padding:0 !important;height:60px;overflow-x: auto;overflow-y:hidden;white-space:nowrap;background-color: NAVCOLOR;}div.verscroll {margin:0 !important;padding:0 !important;width:60px;overflow-y:auto;overflow-x:hidden;white-space:nowrap;background-color: NAVCOLOR;} .trackerImage{cursor:pointer;margin-right:4px !important;margin-top:2px !important;} .rootImage{cursor:pointer;margin-right:2px !important;margin-top:2px !important;display:table-column;} a {color:#0178af;font-weight:bold;font-size:12px;} * {margin:0 !important;padding:0 !important;} .topLeft{padding: 0px 0px 5px 2px !important;}";
var styleScroll = "*{scrollbar-width:thin;scrollbar-height:thin;scrollbar-color: #ffffff;} *::-webkit-scrollbar {height:4px;width:4px;} *::-webkit-scrollbar-track {background-color: NAVCOLOR;} *::-webkit-scrollbar-thumb {background-color:#ffffff;border-radius:2px;border: 1px solid #ffffff;}";
var styleScroller = ".scroller {--scrollbar-color-thumb: #ffffff;--scrollbar-color-track: NAVCOLOR;--scrollbar-width: thin;--scrollbar-width-legacy: 0.5rem;}";
var styleTrackerScroller = "#trackerDiv::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.0);background-color:NAVCOLOR;}#trackerDiv::-webkit-scrollbar {width:4px;height:4px;background-color: #ffffff;}#trackerDiv::-webkit-scrollbar-thumb {background-color:#ffffff;}";
var styleRootScroller = "#rootDiv::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.0);background-color:NAVCOLOR;}#rootDiv::-webkit-scrollbar {width:4px;height:4px;background-color: #ffffff;}#rootDiv::-webkit-scrollbar-thumb {background-color:#ffffff;}";
var styleSupport1 = "@supports (scrollbar-width: auto) {.scroller {scrollbar-color: var(--scrollbar-color-thumb) var(--scrollbar-color-track);scrollbar-width: var(--scrollbar-width);}}";
var styleSupport2 = "@supports selector(::-webkit-scrollbar) {.scroller {text-align: justify;}.scroller::-webkit-scrollbar-thumb {background: var(--scrollbar-color-thumb);}.scroller::-webkit-scrollbar-track {background: var(--scrollbar-color-track);}.scroller::-webkit-scrollbar {max-width: var(--scrollbar-width-legacy);max-height: var(--scrollbar-width-legacy);}}";
var styleGlass = ".glass{position:relative;display:inline-block;background-color:DARKCOLOR;background-image:linear-gradient(DARKCOLOR,LIGHTCOLOR);padding: 0px 0px 0px FONTMARGINLEFTGLASSpx !important;height:50px;width:50px;color:#fff;font-size:40px;font-family:sans-serif;font-weight:bold;border-radius:3px;box-shadow:0px 1px 4px -2px DARKESTCOLOR;text-shadow:0px -1px DARKESTCOLOR;cursor:pointer;}.glass:after{content:'';position:absolute;top:2px;left:2px;width:calc(100% - 4px);height:50%;background:linear-gradient(rgba(255,255,255,0.8),rgba(255,255,255,0.2));}.glass:hover{background:linear-gradient(LIGHTCOLOR,LIGHTERCOLOR);}";
var styleMat = ".mat{position: relative;display: inline-block;background-color: DARKCOLOR;border-radius: 3px;border: 2px solid DARKESTCOLOR;padding: 0px 0px FONTMARGINBOTMATpx FONTMARGINLEFTMATpx !important;height:50px;width:50px;color:#fff;font-size:40px;font-family:sans-serif;font-weight:bold;cursor:pointer;}";

$(document).ready(function () {

    var body = $("#body");
    var path = document.getElementById("cdnOrigin").src;
    CDNROOTDIR = getPath(path);
    PUBLICKEY = document.getElementById("cdnOrigin").getAttribute("data-publicKey");
    VISITORIP = document.getElementById("cdnOrigin").getAttribute("data-visitorIp");
    console.log('cdnOrigin : ' + CDNROOTDIR);
    console.log('PUBLICKEY : ' + PUBLICKEY);
    console.log('VISITORIP : ' + VISITORIP);
    
    $.get(CDNROOTDIR + 'consoleChannelUI.html', function (contents) {
        HTML = $.parseHTML(contents.replaceAll("@",CDNROOTDIR));
        body.append(HTML);
        buildUI();
    }, 'text');

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
    
    DEVICE = window.matchMedia("(pointer: coarse)").matches ? "Mobile" : "PC";    
    $('#deviceType').html(' ' + DEVICE);
    $('#deviceWidth').html($(window).width());
    $('#deviceHeight').html($(window).height());

    PARENTURL = (window.location != window.parent.location) ? document.referrer : document.location;

    SITEURL = new URL(PARENTURL);

    var contextId = (new URL(location.href)).searchParams.get('contextId');
    var showTracker = (new URL(location.href)).searchParams.get('showTracker');
    var trackerScale = (new URL(location.href)).searchParams.get('trackerScale');
    var fitWidth = (new URL(location.href)).searchParams.get('fitWidth');
    var fitHeight = (new URL(location.href)).searchParams.get('fitHeight');
    var color = (new URL(location.href)).searchParams.get('color');
    var navColor = (new URL(location.href)).searchParams.get('navColor');
    var glass = (new URL(location.href)).searchParams.get('glass');

    if (contextId != null && contextId != "") {
        CURRENTCONTEXT = contextId;
    }
    if (color != null && color != "") {
        fetchHues('#' + color);
    } else {
        fetchHues('#0178af');
    }
    if (showTracker != null && showTracker != "") {
        SHOWTRACKER = showTracker;
    }
    if (trackerScale != null && trackerScale != "") {
        TRACKERSCALE = trackerScale;
    }
    if (fitWidth != null && fitWidth != "") {
        WIDTH = fitWidth;
    }
    if (fitHeight != null && fitHeight != "") {
        HEIGHT = fitHeight;
    }
    
    if(DEVICE == "Mobile"){    
        WIDTH = $(window).width();
        HEIGHT = $(window).height() - 60;
    }
        
    if(WIDTH < 300){
        $("#widthLbl").hide();
        $("#heightLbl").hide();
        $("#deviceWidth").hide();
        $("#deviceHeight").hide();
    }
    
    if (color != null && color != "") {
        DARKESTCLR = color;
    }
    if (navColor != null && navColor != "") {
        NAVCOLOR = '#' + navColor;
    } else {
        if (color == null || color == "") {
            NAVCOLOR = "#b5d7e8";
        } else {
            NAVCOLOR = LIGHTESTCOLOR;
        }
    }
    setDefaultColor(NAVCOLOR);
    if (glass != null && glass != "") {
        GLASS = glass;
    }

    var ceiling = 500;
    var max = Math.max(fitWidth, fitHeight);
    var scale = 1;
    if (max < ceiling) {
        scale = 1 - ((ceiling - max) / ceiling);
    }
    var fontMarginLeft = (10 * scale);
    var fontMarLeftGlass = fontMarginLeft * trackerScale;
    var fontMarLeftMat = fontMarLeftGlass - 2;
    var fontMarBotMat = 10 - fontMarginLeft;

    styleDefault = styleDefault.replaceAll("NAVCOLOR", NAVCOLOR);
    styleScroll = styleScroll.replaceAll("DARKESTCOLOR", DARKESTCOLOR).replaceAll("NAVCOLOR", NAVCOLOR);
    styleTrackerScroller = styleTrackerScroller.replaceAll("NAVCOLOR", NAVCOLOR); 
    styleRootScroller = styleRootScroller.replaceAll("NAVCOLOR", NAVCOLOR); 
    styleScroller = styleScroller.replaceAll("NAVCOLOR", NAVCOLOR);
    styleGlass = styleGlass.replaceAll("DARKESTCOLOR", DARKESTCOLOR).replaceAll("DARKCOLOR", DARKCOLOR).replaceAll("LIGHTCOLOR", LIGHTCOLOR).replaceAll("LIGHTERCOLOR", LIGHTERCOLOR).replaceAll("FONTMARGINLEFTGLASS", fontMarLeftGlass);
    styleMat = styleMat.replaceAll("DARKESTCOLOR", DARKESTCOLOR).replaceAll("DARKCOLOR", DARKCOLOR).replaceAll("FONTMARGINBOTMAT", fontMarBotMat).replaceAll("FONTMARGINLEFTMAT", fontMarLeftMat);

    if(/chrome/.test(navigator.userAgent.toLowerCase())){
        console.log("Chrome!");
        injectCSS(styleTrackerScroller);
        //console.log(styleTrackerScroller);
        injectCSS(styleRootScroller);
        //console.log(styleRootScroller);    
    }else{
        console.log("Other!");
        injectCSS(styleScroll);
    }

//    injectCSS(styleScroller);
//    injectCSS(styleSupport1);
//    injectCSS(styleSupport2);
    injectCSS(styleGlass);
    injectCSS(styleMat);

    if (window.matchMedia("(pointer: coarse)").matches) {
        //console.log('MATCH MEDIA');
    } else {
        validateSite();
    }
    if (WIDTH == 0) {
        WIDTH = $(document).width();
    }
    if (HEIGHT == 0) {
        HEIGHT = $(document).height();
    }
    getRootContexts();
    configureUI();
}

function refreshUI() {
    $.ajax({
        type: "POST",
        url: window.location,
        data: data,
        success: success,
        dataType: dataType
    });
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

function setDefaultColor(color) {
    document.getElementById("channelTbl").style.border = "0px solid " + color;
    document.getElementById("trackingTd").style.backgroundColor = color;
    document.getElementById("trackerTd").style.backgroundColor = color;
    document.getElementById("channelTbl").style.backgroundColor = color;
    document.getElementById("rootTd").style.backgroundColor = color;
    document.getElementById("contentFrm").style.border = "0px solid " + color;
}

function validateSite() {
    var path = SITEURL.pathname.split('/');
    var domain = path[1];
    var finalUrl = BASEURL + "jquery/validateRepoSite/?siteHost=" + SITEURL.hostname + "&siteDomain=" + domain;
    $.ajax({
        url: finalUrl
    }).then(function (data) {
        if (data == "HOME") {
            PARENTREGISTERED = true;
        } else {
            if (parseInt(data) > 0) {
                PARENTREGISTERED = true;
            } else if (parseInt(data) == 0) {
                PARENTREGISTERED = false;
                window.location = "images/symbology-viewBrohibited.svg";
            } else if (parseInt(data) == -1) {
                PARENTREGISTERED = false;
            }
        }
    });
}

function autoScale() {
    var ceiling = 500;
    var max = Math.max(WIDTH, HEIGHT);
    if (max < ceiling) {
        var difference = ceiling - max;
        var recoReduct = 1 - (difference / ceiling);
        TRACKERSCALE = recoReduct;
    }
}

function configureUI() {
    autoScale();
    if (window.matchMedia("(pointer: coarse)").matches) {
        BARWIDTH = BARWIDTH_MOBILE;
    }
    $('#channelTbl').css('border-color', '0px solid ' + "LIGHTESTCOLOR");
    $('#channelTbl').css('background-color', "LIGHTESTCOLOR");
    $('#trackerTd').css('background-color', "LIGHTESTCOLOR");
    $('#rootTd').css('background-color', "LIGHTESTCOLOR");
    $('#channelTbl').css('width', WIDTH + 'px');
    $('#channelTbl').css('height', HEIGHT + 'px');
    FITWIDTH = parseInt(WIDTH) - BARWIDTH;
    if (SHOWTRACKER == "false") {
        $('#trackingTd').hide();
        FITHEIGHT = parseInt(HEIGHT);
    } else {
        FITHEIGHT = parseInt(HEIGHT) - BARWIDTH;
    }
    if (GLASS == "false") {
        console.log("SEARCH BUTTON OTHER");        
        $('#searchButton').removeClass("glass");
        $('#searchButton').addClass("mat");
    }else{
        console.log("SEARCH BUTTON GLASS");
    }
    if (parseFloat(TRACKERSCALE) < 1) {
        console.log("TRACKERSCALE SMALLER");
        let keep = parseFloat(ICONSIZE) * parseFloat(TRACKERSCALE);
        let subtract = ICONSIZE - keep;
        let dim = BARWIDTH - subtract;
        let fontSize = parseFloat(FONTSIZE) * parseFloat(TRACKERSCALE);
        $('#searchButton').css('width', keep + 'px');
        $('#searchButton').css('height', keep + 'px');
        $('#searchButton').css('font-size', fontSize + 'px');
        $('#trackerTd').css('height', dim + 'px');
        $('#trackerDiv').css('height', dim + 'px');
        let newHeight = parseInt(HEIGHT) - parseInt($('#trackerDiv').height());
        $('#channelTbl').css('height', newHeight + 'px');
        $('#channelTbl').css('height', newHeight + 'px');
        $('#rootDiv').css('width', dim + 'px');
        $('#rootDiv').css('height', newHeight + 'px');
        FITWIDTH = parseInt(WIDTH) - parseInt($('#rootDiv').width());
        FITHEIGHT = parseInt(HEIGHT) - parseInt($('#trackerDiv').height());
        $('#trackerDiv').css('width', FITWIDTH + 'px');
        $('#contentFrm').css('width', FITWIDTH + 'px');
        $('#contentFrm').css('height', FITHEIGHT + 'px');
    } else {
        console.log("TRACKERSCALE OTHER [" + TRACKERSCALE + "]");
        $('#contentFrm').css('width', FITWIDTH + 'px');
        $('#contentFrm').css('height', FITHEIGHT + 'px');
        $('#trackerDiv').css('width', FITWIDTH + 'px');
        $('#rootDiv').css('height', FITHEIGHT + 'px');
        console.log('GLASS : ' + GLASS);
        if(TRACKERSCALE == ""){
            console.log("SPACE");
            $('#search').html('&nbsp;?');
            $('#search').css('padding-left', '20px');
            $('#search').css('padding-bottom', '20px !important');         
        }else{
            console.log("NONE");
            $('#search').css('padding-left', '10px !important');
            $('#search').css('padding-bottom', '10px !important');
        }
    }
    if (CURRENTCONTEXT) {
        viewContextSvg(CURRENTCONTEXT, true, true);
    }
    $('#contentFrm').on('load', function () {
        if (!CACHE_SVG.has(CURRENTCONTEXT)) {
            var JS = $("#contentFrm")[0].contentWindow.document.getElementById('apiCallsJS').innerHTML;
            var SVG = $("#contentFrm")[0].contentWindow.extSVG;
            CACHE_JS.set(CURRENTCONTEXT, JS);
            CACHE_SVG.set(CURRENTCONTEXT, SVG);
        }
    });

}

function getRootContexts() {
    $.ajax({
        url: BASEURL + "jquery/rootabrevcontexts/"
    }).done(function (data) {
        rootDataStr = JSON.stringify(data);
        setTimeout(renderRootContexts, 500);
    });
}

function renderRootContexts() {
    rootData = jQuery.parseJSON(rootDataStr);
    for (let i = 0; i < rootData.length; i++) {
        (function (i) {
            setTimeout(function () {
                renderRootThumbtag(i, rootData[i]);
            }, 100 * i);
        })(i);
    }
}

function handleImageLoad(evnt) {
    for (var i in evnt.target) {
        //console.log(i);
    }
}

function renderRootThumbtag(index, rootContext) {
    var image = new Image();
    image.src = rootContext.base64image;
    image.id = rootContext.id;
    image.setAttribute('id', rootContext.id);
    image.setAttribute('name', index);
    image.setAttribute('style', 'visibility:hidden;');
    image.setAttribute('title', rootContext.name)
    image.addEventListener('load', function (evnt) {
        var img = evnt.target;
        if (TRACKERSCALE != "1") {
            var width = Math.ceil(img.width * parseFloat(TRACKERSCALE));
            var height = Math.ceil(img.height * parseFloat(TRACKERSCALE));
            $("#rootDiv").append("<div style=\"display:table-row;\"><img class=\"rootImage\" width=\"" + width + "\" height=\"" + height + "\" onclick=\"viewContextSvg('" + img.id + "',true,false);\" title=\"" + img.title + "\" src=\"" + img.src + "\"/></div>");
        } else {
            $("#rootDiv").append("<div style=\"display:table-row;\"><img class=\"rootImage\" onclick=\"viewContextSvg('" + img.id + "',true,false);\" src=\"" + img.src + "\"/></div>");
        }
    });
    document.body.appendChild(image);
}

function viewContextSvg(contextId, addViewContextIcon, clearContextIcons) {
    if (contextId != null && contextId != "") {
        CURRENTCONTEXT = contextId;
    }
    loopTracker(CURRENTCONTEXT);
    if (!CACHE_SVG.has(CURRENTCONTEXT)) {
        var SCALEFITWIDTH = parseFloat(FITWIDTH);
        var SCALEFITHEIGHT = parseFloat(FITHEIGHT);
        if (window.matchMedia("(pointer: coarse)").matches) {
            // MOBILE
            SCALEFITWIDTH = parseInt(parseFloat(FITWIDTH) * 0.96);
            SCALEFITHEIGHT = parseInt(parseFloat(FITHEIGHT) * 0.96);
        }
        var url = BASEURL + "contextConsole/" + CURRENTCONTEXT + "/contextConsole.html?fitWidth=" + SCALEFITWIDTH + "&fitHeight=" + SCALEFITHEIGHT;
        $("#contentFrm").attr("src", url);
        if (clearContextIcons) {
            $("#trackerDiv").empty();
        }
        if (addViewContextIcon && SHOWTRACKER == "true") {
            viewContextIcon(CURRENTCONTEXT);
        }
    } else {
        $("#contentFrm").attr("src", "");
        $("#contentFrm").attr("padding", "0px");
        $("#contentFrm").contents().find("body").css("padding", "0px 0px 0px 0px");
        var contentFrm = document.getElementById('contentFrm');
        setTimeout(() => {
            var JS = wrapJS(CACHE_JS.get(CURRENTCONTEXT));
            var SVG = CACHE_SVG.get(CURRENTCONTEXT);
            var HTML = wrapSVG(JS, SVG);
            var doc = contentFrm.contentWindow || contentFrm.contentDocument.document || contentFrm.contentDocument;
            doc.document.open();
            doc.document.write(HTML);
            doc.document.close();
        }
        , 100);
    }
}

function getApiJS(){
    return '<script id="svgApiJS" src="https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.2.0/svg.min.js"></script>\n<script id="symbologyApiJS" src="' + CDNROOTDIR + 'svgAnimatedFilters.min.js"></script>\n';
}

function wrapJS(js) {
    return "<script id=''onLoadJS'>\nvar draw = null;\nvar children = null;\nvar grpEl = null;\n" + js + "\n</script>";
}

function wrapSVG(apiCallsJS, svg) {
    return "<html>\n<head>\n<title>\n</title>\n</head>\n<body style='padding:5px;margin:0px;' onload='animateContext();'>\n" + getApiJS() + apiCallsJS + svg + "\n</body>\n</html>";
}

function viewContextIcon(contextId) {
    CURRENTCONTEXT = contextId;
    if (SHOWTRACKER == "true" && !CACHE_BASE64.get(CURRENTCONTEXT)) {
        $.ajax({
            url: BASEURL + "jquery/symbologyContextById/" + contextId + "/"
        }).then(function (data) {
            CACHE_BASE64.set(CURRENTCONTEXT, data);
            $("#trackerDiv").append(wrapBase64Image(data));
            loopTracker(CURRENTCONTEXT);
        });
    } else {
        loopTracker(CURRENTCONTEXT);
    }
}

function loopTracker(contextId) {
    $("#trackerDiv").children('img').each(function () {
        let index = $(this).index();
        let image = $(this);
        if (image.attr('id') == contextId) {
            image.css('border', "solid 2px red");
            let offSet = image.width() * index;
            $("#trackerDiv").scrollLeft(offSet);
        } else {
            image.css('border', "solid 0px white");
        }
    });
}

function wrapBase64Image(data) {
    var dim = getThumbtagDimensions(data.base64image);
    if (TRACKERSCALE != "1") {
        var width = dim.width * parseFloat(TRACKERSCALE);
        var height = dim.height * parseFloat(TRACKERSCALE);
        return "<img width=\"" + width + "\" height=\"" + height + "\" src=\"" + data.base64image + "\" class=\"trackerImage\" alt=\"Base64Image\" onclick=\"viewContextSvg('" + data.id + "',false,false);\" id=\"" + data.id + "\" title=\"" + data.name + "\"/>";
    } else {
        return "<img src=\"" + data.base64image + "\" class=\"trackerImage\" alt=\"Base64Image\" onclick=\"viewContextSvg('" + data.id + "',false,false);\" id=\"" + data.id + "\"/>";
    }
}

function getThumbtagDimensions(base64image) {
    $('#thumbtag').attr("src", base64image);
    var width = $('#thumbtag').width();
    var height = $('#thumbtag').height();
    let dim = new Object();
    dim.width = width;
    dim.height = height;
    return dim;
}

function getQueryParam(param, defaultValue = undefined) {
    location.search.substr(1)
            .split("&")
            .some(function (item) { // returns first occurence and stops
                return item.split("=")[0] == param && (defaultValue = item.split("=")[1], true);
            });
    return defaultValue;
}

function doSearch() {
    const color = DARKESTCLR.replace(/#/, '');
    var url = BASEURL + "contextSearch.html?fitWidth=" + FITWIDTH + "&fitHeight=" + FITHEIGHT + "&color=" + DARKESTCLR + "&glass=" + GLASS;
    $("#contentFrm").attr("src", url);
}