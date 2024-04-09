var PUBLICKEY = "";
var VISITORIP = "";
var CDNROOTDIR = "";
var SYMBOL_SHAPEDDEMO = 0;
var SYMBOL_SHAPED = 1;
var SYMBOL_IMPORTED = 2;
var HTML = null;

var styleScroll = "*{scrollbar-width:thin;scrollbar-height:thin;scrollbar-color: #ffffff;} *::-webkit-scrollbar {height:4px;width:4px;} *::-webkit-scrollbar-track {background-color: #C0DBEE;} *::-webkit-scrollbar-thumb {background-color:#ffffff;border-radius:2px;border: 1px solid #ffffff;}";

$(document).ready(function () {

    var body = $("#body");
    var path = document.getElementById("cdnOrigin").src;
    var CDNROOTDIR = getPath(path);
    PUBLICKEY = document.getElementById("cdnOrigin").getAttribute("data-publicKey");
    VISITORIP = document.getElementById("cdnOrigin").getAttribute("data-visitorIp");
    console.log('cdnOrigin : ' + CDNROOTDIR);
    console.log('PUBLICKEY : ' + PUBLICKEY);
    console.log('VISITORIP : ' + VISITORIP);
        
    $.get(CDNROOTDIR + 'consoleSymbolUI.html', function(contents) {
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

function buildUI(){
    
    console.log('host : ' + window.location.hostname);
    
    $(document).tooltip();

    $("input").checkboxradio();

    $("input").click(setSymbolType);

    $("#symbol-demo").css({'padding-left': '2px', 'padding-right': '2px', 'padding-top': '2px', 'padding-bottom': '2px'});
    $("#symbol-shaped").css({'padding-left': '2px', 'padding-right': '2px', 'padding-top': '2px', 'padding-bottom': '2px'});
    $("#symbol-imported").css({'padding-left': '2px', 'padding-right': '2px', 'padding-top': '2px', 'padding-bottom': '2px'});

    $('#libSymbols').dataTable({
        "paging": false,
        "searching": false,
        "ordering": false,
        "scrollCollapse": true,
        "scrollY": 520,
        "info": false,
        "lengthChange": true,
        "autoWidth": false,
        "header": false,
        fixedHeader: {
            "header": false,
            "footer": false
        }
    });

    if (CURRENTSYMBOL) {
        getSymbolAbrev(CURRENTSYMBOL);
    }

    if (CURRENTSHAPEDSYMBOL) {
        getShapedSymbolAbrev(CURRENTSHAPEDSYMBOL);
    }

    if (!CURRENTSYMBOL && !CURRENTSHAPEDSYMBOL) {
        CURRENTSHAPEDSYMBOL = "1";
        FORDEMO = true;
        getShapedSymbolAbrev(CURRENTSHAPEDSYMBOL);
    }
    
    if(/chrome/.test(navigator.userAgent.toLowerCase())){
    }else{
        console.log("Other!");
        injectCSS(styleScroll);
    }
}

function getSymbolAbrev(symbolId) {
    var URL = BASEURL + "jquery/symbol/" + symbolId + "/abrev/";
    $.ajax({
        url: URL
    }).then(function (data) {
        LIBID = data.libraryId;
        viewSymbolSvg(data.path, 5.0);
        getSymbolLibs(SYMBOL_IMPORTED, FORDEMO);
        getSymbolsForSymbol(CURRENTSYMBOL);
    });
}

function getShapedSymbolAbrev(symbolId) {
    var URL = BASEURL + "jquery/shapedsymbol/" + symbolId + "/abrev/";
    $.ajax({
        url: URL
    }).then(function (data) {
        LIBID = data.libraryId;
        viewSymbolSvg(data.path, 5.0);
        getSymbolLibs(SYMBOL_SHAPED, FORDEMO);
        getShapedSymbolsForSymbol(CURRENTSHAPEDSYMBOL);
    });
}

function setSymbolType() {
    var symbolType = $('.symbolChoose:checked').val();
    if (parseInt(symbolType) === 0) {
        getSymbolLibs(1, true);
    } else if (parseInt(symbolType) === 1) {
        getSymbolLibs(1, false);
    } else if (parseInt(symbolType) === 2) {
        getSymbolLibs(2, false);
    }
}

function getSymbolLibs(symbolTypeId, isForDemo) {
    var URL = "";
    if (isForDemo) {
        URL = BASEURL + "jquery/symbolLibraries/" + symbolTypeId + "/?demo=" + isForDemo;
    } else {
        URL = BASEURL + "jquery/symbolLibraries/" + symbolTypeId + "/";
    }
    $.ajax({
        url: URL
    }).then(function (data) {
        var select = "<select id=\"symbolLibs\" name=\"symbolLibs\">\n<option value=\"0\">Symbol Libs</option>\n";
        for (var i = 0; i < data.length; i++) {
            if (LIBID) {
                if (data[i].id === LIBID) {
                    select += "<option selected=\"selected\" value=" + data[i].id + ">" + data[i].name + "</option>";
                } else {
                    select += "<option value=" + data[i].id + ">" + data[i].name + "</option>";
                }
            } else {
                select += "<option value=" + data[i].id + ">" + data[i].name + "</option>";
            }
        }
        select += "</select>";
        $("#selectMenu").empty();
        $("#selectMenu").append(select);
        var symbolLibs = $("#symbolLibs").selectmenu({width: 180});
        symbolLibs.selectmenu("menuWidget").addClass("option_class");
        symbolLibs.selectmenu("widget").addClass("option_class");
        $("#symbolLibs").on("selectmenuchange", function () {
            getLibSymbols(this.value);
        });
    });
}

function getLibSymbols(lib) {
    var URL = BASEURL + "jquery/symbolAbrev/" + lib + "/";
    $.ajax({
        url: URL
    }).then(function (data) {
        $("#navigatorContent").find("tr").remove().end();
        for (var i = 0; i < data.length; i++) {
            $("#navigatorContent").append("<tr><td style=\"cursor:pointer;\" onclick=\"viewSymbolSvg('" + data[i].path + "',5.0);\">" + wrapPathWithSVG(data[i].path, 0.5) + "</td><td onclick=\"viewSymbolSvg('" + data[i].path + "',5.0);\" title=\"Symbol : " + data[i].name + "\" style=\"cursor:pointer;\" class=\"symbolText\">" + data[i].name + "</td></tr>");
        }
    });
}

function viewSymbolSvg(symbolId) {
    CURRENTSYMBOL = symbolId;
    var url = BASEURL + "symbol/" + symbolId + "/1.0/symbology.svg";
    $("#symbolFrm").attr("src", url);
}

function getSymbolsForSymbol(symbolId) {
    var URL = BASEURL + "jquery/siblingsymbols/" + symbolId + "/abrev/";
    $.ajax({
        url: URL
    }).then(function (data) {
        $("#navigatorContent").find("tr").remove().end();
        for (var i = 0; i < data.length; i++) {
            $("#navigatorContent").append("<tr><td style=\"cursor:pointer;\" onclick=\"viewSymbolSvg('" + data[i].path + "',5.0);\">" + wrapPathWithSVG(data[i].path, 0.5) + "</td><td onclick=\"viewSymbolSvg('" + data[i].path + "',5.0);\" title=\"Symbol : " + data[i].name + "\" style=\"cursor:pointer;\" class=\"symbolText\">" + data[i].name + "</td></tr>");
        }
    });
}

function getShapedSymbolsForSymbol(symbolId) {
    var URL = BASEURL + "jquery/siblingshapedsymbols/" + symbolId + "/abrev/";
    $.ajax({
        url: URL
    }).then(function (data) {
        $("#navigatorContent").find("tr").remove().end();
        for (var i = 0; i < data.length; i++) {
            $("#navigatorContent").append("<tr><td style=\"cursor:pointer;\" onclick=\"viewSymbolSvg('" + data[i].path + "',5.0);\">" + wrapPathWithSVG(data[i].path, 0.5) + "</td><td onclick=\"viewSymbolSvg('" + data[i].path + "',5.0);\" title=\"Symbol : " + data[i].name + "\" style=\"cursor:pointer;\" class=\"symbolText\">" + data[i].name + "</td></tr>");
        }
    });
}

const injectCSS = css => {
    let el = document.createElement('style');
    el.type = 'text/css';
    el.innerText = css;
    document.head.appendChild(el);
    return el;
};

function getQueryParam(param, defaultValue = undefined) {
    location.search.substr(1)
            .split("&")
            .some(function (item) { // returns first occurence and stops
                return item.split("=")[0] == param && (defaultValue = item.split("=")[1], true);
            });
    return defaultValue;
}

function navigateConsole(page) {
    switch (page) {
        case 'contextConsole.html':
            var url = BASEURL + page;
            location.href = url;
            break;
        case 'symbologyConsole.html':
            var url = BASEURL + page;
            location.href = url;
            break;
        case 'channel.html':
            var WIDTH = $(document).width();
            var HEIGHT = $(document).height();
            if (!window.matchMedia("(pointer: coarse)").matches) {
                WIDTH = Math.ceil(WIDTH / 3);
                HEIGHT = Math.ceil(HEIGHT / 2);
            }
            var url = BASEURL + page + '?showTracker=true&trackerScale=1.0&glass=false&color=0178af&navColor=b5d7e8&fitWidth=' + WIDTH + '&fitHeight=' + HEIGHT;
            window.open(url, "_blank");
            break;
        default:
        // code block
    }
}

function wrapPathWithSVG(path, scale) {
    var dimensions = parseFloat(100) * parseFloat(scale);
    var result = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + dimensions + "px\" height=\"" + dimensions + "px\">\n";
    result += ("<path transform=\"scale(" + scale + ")\" d=\"" + path + "\"/>\n");
    result += ("</svg>\n");
    return result;
}

function viewSymbolSvg(path, scale) {
    var svg = wrapPathWithSVG(path, scale);
    $("#symbolTd").empty();
    $("#symbolTd").append(svg);
}