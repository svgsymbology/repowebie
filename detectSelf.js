
$(document).ready(function () {
    var path = document.getElementById("cdnOrigin").src;
    var url = getPath(path);
    console.log('cdnOrigin : ' + url);

});

function getPath(path){
    path = path.match(/(^.*[\\\/]|^[^\\\/].*)/i);
    if(path != null){
        return path[0];
    }else{
        return false;
    }            
}


