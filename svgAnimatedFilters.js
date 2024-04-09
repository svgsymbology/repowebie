
function registerGroups(){
    children = grpEl.childNodes;
    children.forEach(function(item){
        if(item.nodeType !== 3){
            if((item.nodeName == 'path' || item.nodeName == 'text') && groups[item.getAttribute('symbology:group')] == null && item.getAttribute('symbology:group') != '0'){
                groups[item.getAttribute('symbology:group')] = draw.group();
                groups[item.getAttribute('symbology:group')].attr('transform', 'scale(' + grpEl.getAttribute('data-scale') + ')');
                groups[item.getAttribute('symbology:group')].data('childX', 1000, true);
                groups[item.getAttribute('symbology:group')].data('childY', 1000, true);
            }else if(item.nodeName == 'a' && groups[item.children[0].getAttribute('symbology:group')] == null && item.children[0].getAttribute('symbology:group') != '0'){
                groups[item.children[0].getAttribute('symbology:group')] = draw.group();
                groups[item.children[0].getAttribute('symbology:group')].attr('transform', 'scale(' + grpEl.getAttribute('data-scale') + ')');
                groups[item.children[0].getAttribute('symbology:group')].data('childX', 1000, true);
                groups[item.children[0].getAttribute('symbology:group')].data('childY', 1000, true);
            }
        }
    });
    children.forEach(function(item){
        if(item.nodeType !== 3){
            if(item.nodeName == 'path' && item.getAttribute('symbology:group') != '0'){
                groups[item.getAttribute('symbology:group')].add(SVG('#' + item.getAttribute('id')));
                if(groups[item.getAttribute('symbology:group')].data('childX') > item.getBBox().x){
                    groups[item.getAttribute('symbology:group')].data('childX', item.getBBox().x, true);
                }
                if(groups[item.getAttribute('symbology:group')].data('childY') > item.getBBox().y){
                    groups[item.getAttribute('symbology:group')].data('childY', item.getBBox().y, true);
                }
            }else if(item.nodeName == 'a' && item.children[0].getAttribute('symbology:group') != '0'){
                var el = SVG('#' + item.children[0].getAttribute('id'));
                if(groups[item.children[0].getAttribute('symbology:group')].data('childX') > item.children[0].getBBox().x){
                    groups[item.children[0].getAttribute('symbology:group')].data('childX', item.children[0].getBBox().x, true);
                }
                if(groups[item.children[0].getAttribute('symbology:group')].data('childY') > item.children[0].getBBox().y){
                    groups[item.children[0].getAttribute('symbology:group')].data('childY', item.children[0].getBBox().y, true);
                }
                groups[item.children[0].getAttribute('symbology:group')].add(el.parent());
            }
        }
    });	
}

var NS = "http://www.w3.org/2000/svg";

function title(rect, words) {
    var title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = words;
    rect.appendChild(title);
}

function ClipPath(clipPathId, path) {
    this.clipPath = document.createElementNS(NS, "clipPath");
    this.clipPath.setAttribute("id", clipPathId);
    this.path = document.createElementNS(NS, "path");
    this.path.setAttribute("d", path);
    this.clipPath.appendChild(this.path);
}

function Filter(filterId, x, y, width, height) {
    this.filter = document.createElementNS(NS, "filter");
    this.filter.setAttribute("id", filterId);
    this.filter.setAttribute("filterUnits", "userSpaceOnUse");
    this.filter.setAttribute("x", x);
    this.filter.setAttribute("y", y);
    if (width != null) {
        this.filter.setAttribute("width", width);
    }
    if (height != null) {
        this.filter.setAttribute("height", height);
    }
}

function TexturedFilter(filterId, x, y, width, height) {
    this.filter = document.createElementNS(NS, "filter");
    this.filter.setAttribute("id", filterId);
    this.filter.setAttribute("filterUnits", "objectBoundingBox");
    this.filter.setAttribute("primitiveUnits", "userSpaceOnUse");
    this.filter.setAttribute("color-interpolation-filters", "linearRGB");
    this.filter.setAttribute("x", x);
    this.filter.setAttribute("y", y);
    if (width != null) {
        this.filter.setAttribute("width", width);
    }
    if (height != null) {
        this.filter.setAttribute("height", height);
    }
}

function TextureFilter(filterId) {
    this.filter = document.createElementNS(NS, "filter");
    this.filter.setAttribute("id", filterId);
    this.filter.setAttribute("x", "0%");
    this.filter.setAttribute("y", "0%");
    this.filter.setAttribute("width", "100%");
    this.filter.setAttribute("height", "100%");
}

function pointLight(filterId, color, x, y, z) {
    this.filter = new Filter(filterId, "0", "0", null, null).filter;
    this.defLighting = document.createElementNS(NS, "feDiffuseLighting");
    this.defLighting.setAttribute("in", "SourceGraphic");
    this.defLighting.setAttribute("result", "light");
    this.defLighting.setAttribute("lighting-color", color);
    this.pointLight = document.createElementNS(NS, "fePointLight");
    this.pointLight.setAttribute("x", x);
    this.pointLight.setAttribute("y", y);
    this.pointLight.setAttribute("z", z);
    this.defLighting.appendChild(this.pointLight);
    this.composite = document.createElementNS(NS, "feComposite");
    this.composite.setAttribute("in", "SourceGraphic");
    this.composite.setAttribute("in2", "light");
    this.composite.setAttribute("operator", "arithmetic");
    this.composite.setAttribute("k1", "1");
    this.composite.setAttribute("k2", "0");
    this.composite.setAttribute("k3", "0");
    this.composite.setAttribute("k4", "0");
    this.filter.appendChild(this.defLighting);
    this.filter.appendChild(this.composite);
    this.animate = function(z){
        this.pointLight.setAttribute("z", z);
    };
}

function specLight(filterId, color, x, y, z, specExpo) {
    this.filter = new Filter(filterId, "0", "0", null, null).filter;
    this.specLight = document.createElementNS(NS, "feSpecularLighting");
    this.specLight.setAttribute("specularExponent", specExpo);
    this.specLight.setAttribute("lighting-color", color);
    this.specLight.setAttribute("result", "light");
    this.pointLight = document.createElementNS(NS, "fePointLight");
    this.pointLight.setAttribute("x", x);
    this.pointLight.setAttribute("y", y);
    this.pointLight.setAttribute("z", z);
    this.specLight.appendChild(this.pointLight);
    this.composite = document.createElementNS(NS, "feComposite");
    this.composite.setAttribute("in", "SourceGraphic");
    this.composite.setAttribute("in2", "specOut");
    this.composite.setAttribute("operator", "arithmetic");
    this.composite.setAttribute("k1", "1");
    this.composite.setAttribute("k2", "0");
    this.composite.setAttribute("k3", "1");
    this.composite.setAttribute("k4", "0");
    this.filter.appendChild(this.specLight);
    this.filter.appendChild(this.composite);
    this.animate = function(specExpo){
        this.specLight.setAttribute("specularExponent", specExpo);
    };    
}

function distLight(filterId, color, azimuth, elevation) {
    this.filter = new Filter(filterId, "0", "0", null, null).filter;
    this.defLighting = document.createElementNS(NS, "feDiffuseLighting");
    this.defLighting.setAttribute("in", "SourceGraphic");
    this.defLighting.setAttribute("result", "light");
    this.defLighting.setAttribute("lighting-color", color);
    this.distantLight = document.createElementNS(NS, "feDistantLight");
    this.distantLight.setAttribute("azimuth", azimuth);
    this.distantLight.setAttribute("elevation", elevation);
    this.defLighting.appendChild(this.distantLight);
    this.composite = document.createElementNS(NS, "feComposite");
    this.composite.setAttribute("in", "SourceGraphic");
    this.composite.setAttribute("in2", "light");
    this.composite.setAttribute("operator", "arithmetic");
    this.composite.setAttribute("k1", "1");
    this.composite.setAttribute("k2", "0");
    this.composite.setAttribute("k3", "0");
    this.composite.setAttribute("k4", "0");
    this.filter.appendChild(this.defLighting);
    this.filter.appendChild(this.composite);
    this.animate = function(azimuth){
        this.distantLight.setAttribute("azimuth", azimuth);
    };    
}

function spotLight(filterId, color, specConst, specExp, x, y, z, coneAngle, pointsAtX, pointsAtY, pointsAtZ) {
    this.filter = new Filter(filterId, "0%", "0%", "100%", "100%").filter;
    this.defLighting = document.createElementNS(NS, "feSpecularLighting");
    this.defLighting.setAttribute("result", "spotlight");
    this.defLighting.setAttribute("lighting-color", color);
    this.defLighting.setAttribute("specularConstant", specConst);
    this.defLighting.setAttribute("specularExponent", specExp);
    this.spotLight = document.createElementNS(NS, "feSpotLight");
    this.spotLight.setAttribute("x", x);
    this.spotLight.setAttribute("y", y);
    this.spotLight.setAttribute("z", z);
    this.spotLight.setAttribute("limitingConeAngle", coneAngle);
    this.spotLight.setAttribute("pointsAtX", pointsAtX);
    this.spotLight.setAttribute("pointsAtY", pointsAtY);
    this.spotLight.setAttribute("pointsAtZ", pointsAtZ);
    this.defLighting.appendChild(this.spotLight);
    this.composite = document.createElementNS(NS, "feComposite");
    this.composite.setAttribute("in", "SourceGraphic");
    this.composite.setAttribute("in2", "spotlight");
    this.composite.setAttribute("operator", "out");
    this.composite.setAttribute("k1", "0");
    this.composite.setAttribute("k2", "1");
    this.composite.setAttribute("k3", "1");
    this.composite.setAttribute("k4", "0");
    this.filter.appendChild(this.defLighting);
    this.filter.appendChild(this.composite);
    this.animate = function(specConst){
        this.defLighting.setAttribute("specularConstant", specConst);
    };    
}

function shadow(filterId, color, opacity, dx, dy, stdDeviation) {
    this.filter = new Filter(filterId, "0", "0", null, null).filter;
    this.dropShadowFilter = document.createElementNS(NS, "feDropShadow");
    this.dropShadowFilter.setAttribute("dx", dx);
    this.dropShadowFilter.setAttribute("dy", dy);
    this.dropShadowFilter.setAttribute("stdDeviation", stdDeviation);
    this.dropShadowFilter.setAttribute("flood-color", color);
    this.dropShadowFilter.setAttribute("flood-opacity", opacity);
    this.filter.appendChild(this.dropShadowFilter);
    this.animate = function(opacity){
        this.dropShadowFilter.setAttribute("flood-opacity", opacity);
    };    
}

function bright(filterId, color, opacity, radius, stdDeviation) {
    this.filter = new Filter(filterId, "0", "0", null, null).filter;
    this.flood = document.createElementNS(NS, "feFlood");
    this.flood.setAttribute("flood-color", color);
    this.flood.setAttribute("flood-opacity", opacity);
    this.compositea = document.createElementNS(NS, "feComposite");
    this.compositea.setAttribute("operator", "out");
    this.compositea.setAttribute("in2", "SourceGraphic");
    this.morphology = document.createElementNS(NS, "feMorphology");
    this.morphology.setAttribute("operator", "dilate");
    this.morphology.setAttribute("radius", radius);
    this.guassianBlur = document.createElementNS(NS, "feGaussianBlur");
    this.guassianBlur.setAttribute("stdDeviation", stdDeviation);
    this.compositeb = document.createElementNS(NS, "feComposite");
    this.compositeb.setAttribute("operator", "atop");
    this.compositeb.setAttribute("in2", "SourceGraphic");
    this.filter.appendChild(this.flood);
    this.filter.appendChild(this.compositea);
    this.filter.appendChild(this.morphology);
    this.filter.appendChild(this.guassianBlur);
    this.filter.appendChild(this.compositeb);
    this.animate = function(radius){
        this.morphology.setAttribute("radius", radius);
    };
}

function glow(filterId, color, opacity, radius, stdDeviation) {
    this.filter = new Filter(filterId, "-200%", "-200%", "600%", "600%").filter;
    this.flood = document.createElementNS(NS, "feFlood");
    this.flood.setAttribute("result", "flood");
    this.flood.setAttribute("flood-color", color);
    this.flood.setAttribute("flood-opacity", opacity);
    this.composite = document.createElementNS(NS, "feComposite");
    this.composite.setAttribute("in", "flood");
    this.composite.setAttribute("result", "mask");
    this.composite.setAttribute("in2", "SourceGraphic");
    this.composite.setAttribute("operator", "in");
    this.morphology = document.createElementNS(NS, "feMorphology");
    this.morphology.setAttribute("in", "mask");
    this.morphology.setAttribute("result", "dilated");
    this.morphology.setAttribute("operator", "dilate");
    this.morphology.setAttribute("radius", radius);
    this.guassianBlur = document.createElementNS(NS, "feGaussianBlur");
    this.guassianBlur.setAttribute("in", "dilated");
    this.guassianBlur.setAttribute("result", "blurred");
    this.guassianBlur.setAttribute("stdDeviation", stdDeviation);
    this.merge = document.createElementNS(NS, "feMerge");
    this.mergeNodea = document.createElementNS(NS, "feMergeNode");
    this.mergeNodea.setAttribute("in", "blurred");
    this.mergeNodeb = document.createElementNS(NS, "feMergeNode");
    this.mergeNodeb.setAttribute("in", "SourceGraphic");
    this.merge.appendChild(this.mergeNodea);
    this.merge.appendChild(this.mergeNodeb);
    this.filter.appendChild(this.flood);
    this.filter.appendChild(this.composite);
    this.filter.appendChild(this.morphology);
    this.filter.appendChild(this.guassianBlur);
    this.filter.appendChild(this.merge);
    this.animate = function(radius){
        this.morphology.setAttribute("radius", radius);
    };    
}

function burn(filterId, color, opacity, radius, stdDeviation) {
    this.filter = new Filter(filterId, "0", "0", null, null).filter;
    this.flood = document.createElementNS(NS, "feFlood");
    this.flood.setAttribute("flood-color", color);
    this.flood.setAttribute("flood-opacity", opacity);
    this.compositea = document.createElementNS(NS, "feComposite");
    this.compositea.setAttribute("operator", "out");
    this.compositea.setAttribute("in2", "SourceGraphic");
    this.morphology = document.createElementNS(NS, "feMorphology");
    this.morphology.setAttribute("operator", "dilate");
    this.morphology.setAttribute("radius", radius);
    this.guassianBlur = document.createElementNS(NS, "feGaussianBlur");
    this.guassianBlur.setAttribute("stdDeviation", stdDeviation);
    this.compositeb = document.createElementNS(NS, "feComposite");
    this.compositeb.setAttribute("operator", "atop");
    this.compositeb.setAttribute("in2", "SourceGraphic");
    this.filter.appendChild(this.flood);
    this.filter.appendChild(this.compositea);
    this.filter.appendChild(this.morphology);
    this.filter.appendChild(this.guassianBlur);
    this.filter.appendChild(this.compositeb);
    this.animate = function(radius){
        this.morphology.setAttribute("radius", radius);
    };    
}

function blur(filterId, stdDeviation) {
    this.filter = new Filter(filterId, "0", "0", null, null).filter;
    this.gaussianFilter = document.createElementNS(NS, "feGaussianBlur");
    this.gaussianFilter.setAttribute("in", "SourceGraphic");
    this.gaussianFilter.setAttribute("stdDeviation", stdDeviation);
    this.filter.appendChild(this.gaussianFilter);
    this.animate = function(stdDeviation){
        this.gaussianFilter.setAttribute("stdDeviation", stdDeviation);
    };
}

function motion(filterId, stdHorDeviation, stdVerDeviation) {
    this.orientation = parseInt(stdHorDeviation) > parseInt(stdVerDeviation) ? "hor" : "ver";
    this.filter = new Filter(filterId, "0", "0", null, null).filter;
    this.gaussianFilter = document.createElementNS(NS, "feGaussianBlur");
    this.gaussianFilter.setAttribute("in", "SourceGraphic");
    this.gaussianFilter.setAttribute("stdDeviation", stdHorDeviation + " " + stdVerDeviation);
    this.filter.appendChild(this.gaussianFilter);
    this.animate = function(stdDeviation){
        if(this.orientation == "hor"){
            this.gaussianFilter.setAttribute("stdDeviation", stdDeviation + " 0");
        }else{
            this.gaussianFilter.setAttribute("stdDeviation", "0 " + stdDeviation);
        }
    };    
}

function emboss(filterId, color, dx, dy, surfScale, specConst, specExpo, stdDeviation) {
    this.filter = new Filter(filterId, "0%", "0%", "100%", "100%").filter;
    this.guassianBlur = document.createElementNS(NS, "feGaussianBlur");
    this.guassianBlur.setAttribute("in", "SourceAlpha");
    this.guassianBlur.setAttribute("stdDeviation", stdDeviation);
    this.guassianBlur.setAttribute("result", "blur");
    this.offset = document.createElementNS(NS, "feOffset");
    this.offset.setAttribute("in", "blur");
    this.offset.setAttribute("dx", dx);
    this.offset.setAttribute("dy", dy);
    this.offset.setAttribute("result", "offsetBlur");
    this.specLight = document.createElementNS(NS, "feSpecularLighting");
    this.specLight.setAttribute("in", "blur");
    this.specLight.setAttribute("surfaceScale", surfScale);
    this.specLight.setAttribute("specularConstant", specConst);
    this.specLight.setAttribute("specularExponent", specExpo);
    this.specLight.setAttribute("lighting-color", color);
    this.specLight.setAttribute("result", "specOut");
    this.pointLight = document.createElementNS(NS, "fePointLight");
    this.pointLight.setAttribute("x", "-5000");
    this.pointLight.setAttribute("y", "-10000");
    this.pointLight.setAttribute("z", "20000");
    this.specLight.appendChild(this.pointLight);
    this.compositea = document.createElementNS(NS, "feComposite");
    this.compositea.setAttribute("in", "specOut");
    this.compositea.setAttribute("in2", "SourceAlpha");
    this.compositea.setAttribute("operator", "in");
    this.compositea.setAttribute("result", "specOut");
    this.compositeb = document.createElementNS(NS, "feComposite");
    this.compositeb.setAttribute("in", "SourceGraphic");
    this.compositeb.setAttribute("in2", "specOut");
    this.compositeb.setAttribute("operator", "arithmetic");
    this.compositeb.setAttribute("k1", "0");
    this.compositeb.setAttribute("k2", "1");
    this.compositeb.setAttribute("k3", "1");
    this.compositeb.setAttribute("k4", "0");
    this.compositeb.setAttribute("result", "litPaint");
    this.filter.appendChild(this.guassianBlur);
    this.filter.appendChild(this.offset);
    this.filter.appendChild(this.specLight);
    this.filter.appendChild(this.compositea);
    this.filter.appendChild(this.compositeb);
    this.animate = function(surfScale){
        this.specLight.setAttribute("surfaceScale", surfScale);
    };    
}

function warp(filterId, baseHFreq, baseVFreq, turbType, numOctaves, scale) {
    this.filter = new Filter(filterId, "0", "0", null, null).filter;
    this.turbulenceFilter = document.createElementNS(NS, "feTurbulence");
    this.turbulenceFilter.setAttribute("type", "turbulence");
    this.turbulenceFilter.setAttribute("baseFrequency", baseHFreq + " " + baseVFreq);
    this.turbulenceFilter.setAttribute("numOctaves", numOctaves);
    if(turbType == "turb"){
        this.turbulenceFilter.setAttribute("result", "turbulence");
    }else{
        this.turbulenceFilter.setAttribute("result", "fractalNoise");
    }
    this.displacementMap = document.createElementNS(NS, "feDisplacementMap");
    this.displacementMap.setAttribute("in", "SourceGraphic");
    this.displacementMap.setAttribute("in2", "turbulence");
    this.displacementMap.setAttribute("scale", scale);
    this.displacementMap.setAttribute("xChannelSelector", "R");
    this.displacementMap.setAttribute("yChannelSelector", "G");
    this.filter.appendChild(this.turbulenceFilter);
    this.filter.appendChild(this.displacementMap);
    this.animate = function(scale){
        this.displacementMap.setAttribute("scale", scale);
    };    
}

function torn(filterId, baseFreq, numOctaves, scale) {
    this.filter = new Filter(filterId, "0", "0", null, null).filter;
    this.turbulenceFilter = document.createElementNS(NS, "feTurbulence");
    this.turbulenceFilter.setAttribute("type", "turbulence");
    this.turbulenceFilter.setAttribute("result", "turbulence");
    this.turbulenceFilter.setAttribute("baseFrequency", baseFreq);
    this.turbulenceFilter.setAttribute("numOctaves", numOctaves);
    this.turbulenceFilter.setAttribute("seed", "2");
    this.turbulenceFilter.setAttribute("x", "-100%");
    this.turbulenceFilter.setAttribute("y", "-100%");
    this.turbulenceFilter.setAttribute("width", "300%");
    this.turbulenceFilter.setAttribute("height", "300%");
    this.displacementMap = document.createElementNS(NS, "feDisplacementMap");
    this.displacementMap.setAttribute("in", "SourceGraphic");
    this.displacementMap.setAttribute("in2", "turbulence");
    this.displacementMap.setAttribute("scale", scale);
    this.displacementMap.setAttribute("xChannelSelector", "R");
    this.displacementMap.setAttribute("yChannelSelector", "G");
    this.filter.appendChild(this.turbulenceFilter);
    this.filter.appendChild(this.displacementMap);
    this.animate = function(scale){
        this.displacementMap.setAttribute("scale", scale);
    };    
}

function serrated(filterId, baseHFreq, baseVFreq, numOctaves, scale){
    this.filter = new Filter(filterId, "0", "0", null, null).filter;
    this.turbulenceFilter = document.createElementNS(NS, "feTurbulence");
    this.turbulenceFilter.setAttribute("type", "turbulence");
    this.turbulenceFilter.setAttribute("result", "turbulence");
    this.turbulenceFilter.setAttribute("baseFrequency", baseHFreq + " " + baseVFreq);
    this.turbulenceFilter.setAttribute("numOctaves", numOctaves);
    this.colorMatrix = document.createElementNS(NS, "feColorMatrix");
    this.colorMatrix.setAttribute("values", "5");
    this.colorMatrix.setAttribute("in", "displacementMap2");
    this.colorMatrix.setAttribute("result", "colormatrix1");
    this.displacementMap = document.createElementNS(NS, "feDisplacementMap");
    this.displacementMap.setAttribute("in", "SourceGraphic");
    this.displacementMap.setAttribute("in2", "turbulence");
    this.displacementMap.setAttribute("scale", scale);
    this.displacementMap.setAttribute("xChannelSelector", "R");
    this.displacementMap.setAttribute("yChannelSelector", "G");
    this.filter.appendChild(this.turbulenceFilter);
    this.filter.appendChild(this.colorMatrix);
    this.filter.appendChild(this.displacementMap);
    this.animate = function(scale){
        this.displacementMap.setAttribute("scale", scale);
    };    
}

function splash(filterId, baseFreq, numOctav, scale, stdDeviation) {
    this.filter = new Filter(filterId, "-100%", "-100%", "300%", "300%").filter;
    this.turbulence = document.createElementNS(NS, "feTurbulence");
    this.turbulence.setAttribute("type", "turbulence");
    this.turbulence.setAttribute("baseFrequency", baseFreq);
    this.turbulence.setAttribute("numOctaves", numOctav);
    this.turbulence.setAttribute("result", "turbulence");
    this.displaceMap = document.createElementNS(NS, "feDisplacementMap");
    this.displaceMap.setAttribute("in", "SourceGraphic");
    this.displaceMap.setAttribute("in2", "turbulence");
    this.displaceMap.setAttribute("scale", scale);
    this.displaceMap.setAttribute("xChannelSelector", "R");
    this.displaceMap.setAttribute("yChannelSelector", "G");
    this.gaussianBlur = document.createElementNS(NS, "feGaussianBlur");
    this.gaussianBlur.setAttribute("in", "map");
    this.gaussianBlur.setAttribute("stdDeviation", stdDeviation);
    this.filter.appendChild(this.turbulence);
    this.filter.appendChild(this.displaceMap);
    this.filter.appendChild(this.gaussianBlur);
    this.animate = function(baseFreq){
        this.turbulence.setAttribute("baseFrequency", baseFreq);
    };    
}

function fracture(filterId, color, baseHFreq, baseVFreq, numOctav, surfScale, specConst, speExp){
    this.filter = new Filter(filterId, "-20%", "-20%", "140%", "140%").filter;
    this.gaussianBlur = document.createElementNS(NS, "feGaussianBlur");
    this.gaussianBlur.setAttribute("stdDeviation","5 5");
    this.gaussianBlur.setAttribute("in","SourceGraphic");
    this.gaussianBlur.setAttribute("edgeMode","none");
    this.gaussianBlur.setAttribute("result","blur");
    this.turbulence = document.createElementNS(NS, "feTurbulence");
    this.turbulence.setAttribute("id","turbulence");
    this.turbulence.setAttribute("type","turbulence");
    this.turbulence.setAttribute("baseFrequency",baseHFreq + " " + baseVFreq);
    this.turbulence.setAttribute("numOctaves",numOctav);
    this.turbulence.setAttribute("seed","2");
    this.turbulence.setAttribute("stitchTiles","stitch");
    this.turbulence.setAttribute("result","turbulence");
    this.composite = document.createElementNS(NS, "feComposite");
    this.composite.setAttribute("in","turbulence");
    this.composite.setAttribute("in2","blur");
    this.composite.setAttribute("operator","in");
    this.composite.setAttribute("result","composite");
    this.colorMatrix = document.createElementNS(NS, "feColorMatrix");
    this.colorMatrix.setAttribute("type","matrix");
    this.colorMatrix.setAttribute("values","1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 40 -4");
    this.colorMatrix.setAttribute("in","composite");
    this.colorMatrix.setAttribute("result","colormatrix");
    this.specularLighting = document.createElementNS(NS, "feSpecularLighting");
    this.specularLighting.setAttribute("surfaceScale",surfScale);
    this.specularLighting.setAttribute("specularConstant",specConst);
    this.specularLighting.setAttribute("specularExponent",speExp);
    this.specularLighting.setAttribute("kernelUnitLength","10 10");
    this.specularLighting.setAttribute("lighting-color","#ffffff");
    this.specularLighting.setAttribute("in","turbulence");
    this.specularLighting.setAttribute("result","specularLighting");
    this.distantLight = document.createElementNS(NS, "feDistantLight");
    this.distantLight.setAttribute("azimuth","0");
    this.distantLight.setAttribute("elevation","100");
    this.specularLighting.appendChild(this.distantLight);
    this.flood = document.createElementNS(NS, "feFlood");
    this.flood.setAttribute("flood-color",color);
    this.flood.setAttribute("flood-opacity","1");
    this.flood.setAttribute("result","flood");
    this.composite1 = document.createElementNS(NS, "feComposite");
    this.composite1.setAttribute("in","flood");
    this.composite1.setAttribute("in2","colormatrix");
    this.composite1.setAttribute("operator","in");
    this.composite1.setAttribute("result","composite2");
    this.composite2 = document.createElementNS(NS, "feComposite");
    this.composite2.setAttribute("in","specularLighting");
    this.composite2.setAttribute("in2","colormatrix");
    this.composite2.setAttribute("operator","in");
    this.composite2.setAttribute("result","composite1");
    this.merge = document.createElementNS(NS, "feMerge");
    this.merge.setAttribute("result","merge1");
    this.mergeNode1 = document.createElementNS(NS, "feMergeNode");
    this.mergeNode1.setAttribute("in","composite2");
    this.mergeNode2 = document.createElementNS(NS, "feMergeNode");
    this.mergeNode2.setAttribute("in","composite1");
    this.merge.appendChild(this.mergeNode1);
    this.merge.appendChild(this.mergeNode2);
    this.filter.appendChild(this.gaussianBlur);
    this.filter.appendChild(this.turbulence);
    this.filter.appendChild(this.composite);
    this.filter.appendChild(this.colorMatrix);
    this.filter.appendChild(this.specularLighting);
    this.filter.appendChild(this.flood);
    this.filter.appendChild(this.composite1);
    this.filter.appendChild(this.composite2);
    this.filter.appendChild(this.merge);
    this.animate = function(surfScale){
        this.specularLighting.setAttribute("surfaceScale", surfScale);
    };    
}

function grain(filterId, color, baseHFreq, baseVFreq, numOctav){
    this.filter = new Filter(filterId, "-20%", "-20%", "140%", "140%").filter;
    this.turbulence = document.createElementNS(NS, "feTurbulence");
    this.turbulence.setAttribute("id","turbulence");
    this.turbulence.setAttribute("type","turbulence");
    this.turbulence.setAttribute("baseFrequency",baseHFreq + " " + baseVFreq);
    this.turbulence.setAttribute("numOctaves",numOctav);
    this.turbulence.setAttribute("seed","1");
    this.turbulence.setAttribute("stitchTiles","stitch");
    this.turbulence.setAttribute("result","turbulence");
    this.colorMatrix = document.createElementNS(NS, "feColorMatrix");
    this.colorMatrix.setAttribute("type","matrix");
    this.colorMatrix.setAttribute("values","1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 80 -5");
    this.colorMatrix.setAttribute("in","turbulence");
    this.colorMatrix.setAttribute("result","colormatrix");
    this.flood = document.createElementNS(NS, "feFlood");
    this.flood.setAttribute("flood-color",color);
    this.flood.setAttribute("flood-opacity","1");
    this.flood.setAttribute("result","flood");
    this.composite1 = document.createElementNS(NS, "feComposite");
    this.composite1.setAttribute("in","flood");
    this.composite1.setAttribute("in2","colormatrix");
    this.composite1.setAttribute("operator","in");
    this.composite1.setAttribute("result","composite2");
    this.composite2 = document.createElementNS(NS, "feComposite");
    this.composite2.setAttribute("in","composite2");
    this.composite2.setAttribute("in2","SourceAlpha");
    this.composite2.setAttribute("operator","in");
    this.composite2.setAttribute("result","composite3");
    this.filter.appendChild(this.turbulence);
    this.filter.appendChild(this.colorMatrix);
    this.filter.appendChild(this.flood);
    this.filter.appendChild(this.composite1);
    this.filter.appendChild(this.composite2);
}

function scrape(filterId, baseHFreq, baseVFreq, numOctav, scale){
    this.filter = new Filter(filterId, "-100%", "-100%", "300%", "300%").filter;
    this.turbulence = document.createElementNS(NS, "feTurbulence");
    this.turbulence.setAttribute("id","turbulence");
    this.turbulence.setAttribute("type","fractalNoise");
    this.turbulence.setAttribute("baseFrequency",baseHFreq + " " + baseVFreq);
    this.turbulence.setAttribute("numOctaves",numOctav);
    this.turbulence.setAttribute("seed","2");
    this.turbulence.setAttribute("result","turbulence");
    this.dispMap = document.createElementNS(NS, "feDisplacementMap");
    this.dispMap.setAttribute("in2","turbulence");
    this.dispMap.setAttribute("in","SourceGraphic");
    this.dispMap.setAttribute("scale",scale);
    this.dispMap.setAttribute("xChannelSelector","R");
    this.dispMap.setAttribute("yChannelSelector","G");
    this.filter.appendChild(this.turbulence);
    this.filter.appendChild(this.dispMap);
    this.animate = function(scale){
        this.dispMap.setAttribute("scale", scale);
    };    
}

function splatter(filterId, color, baseHFreq, baseVFreq, numOctav){
    this.filter = new TexturedFilter(filterId, "-20%", "-20%", "140%", "140%").filter;
    this.turbulence = document.createElementNS(NS, "feTurbulence");
    this.turbulence.setAttribute("id","turbulence");
    this.turbulence.setAttribute("type","turbulence");
    this.turbulence.setAttribute("baseFrequency",baseHFreq + " " + baseVFreq);
    this.turbulence.setAttribute("numOctaves",numOctav);
    this.turbulence.setAttribute("seed","4");
    this.turbulence.setAttribute("stitchTiles","stitch");
    this.turbulence.setAttribute("result","turbulence");
    this.colorMatrix = document.createElementNS(NS, "feColorMatrix");
    this.colorMatrix.setAttribute("type","matrix");
    this.colorMatrix.setAttribute("values","0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -90 5");
    this.colorMatrix.setAttribute("in","turbulence");
    this.colorMatrix.setAttribute("result","colormatrix");
    this.composite1 = document.createElementNS(NS, "feComposite");
    this.composite1.setAttribute("in","colormatrix");
    this.composite1.setAttribute("in2","colormatrix1");
    this.composite1.setAttribute("operator","over");
    this.composite1.setAttribute("result","composite");
    this.composite2 = document.createElementNS(NS, "feComposite");
    this.composite2.setAttribute("in","colormatrix");
    this.composite2.setAttribute("in2","SourceAlpha");
    this.composite2.setAttribute("operator","in");
    this.composite2.setAttribute("result","composite2");
    this.flood = document.createElementNS(NS, "feFlood");
    this.flood.setAttribute("flood-color",color);
    this.flood.setAttribute("flood-opacity","1");
    this.flood.setAttribute("result","flood");
    this.composite3 = document.createElementNS(NS, "feComposite");
    this.composite3.setAttribute("in","flood");
    this.composite3.setAttribute("in2","composite2");
    this.composite3.setAttribute("operator","in");
    this.composite3.setAttribute("result","composite3");
    this.filter.appendChild(this.turbulence);
    this.filter.appendChild(this.colorMatrix);
    this.filter.appendChild(this.composite1);
    this.filter.appendChild(this.composite2);
    this.filter.appendChild(this.flood);
    this.filter.appendChild(this.composite3);
}

function smoothT(filterId, color, baseHFreq, baseVFreq, surfScale, azimuth, elevation){
    this.filter = new TextureFilter(filterId).filter;
    this.turbulence = document.createElementNS(NS, "feTurbulence");
    this.turbulence.setAttribute("type","fractalNoise");
    this.turbulence.setAttribute("baseFrequency",baseHFreq + " " + baseVFreq);
    this.turbulence.setAttribute("result","noise");
    this.defLight = document.createElementNS(NS, "feDiffuseLighting");
    this.defLight.setAttribute("in","noise");
    this.defLight.setAttribute("lighting-color",color);
    this.defLight.setAttribute("surfaceScale",surfScale);
    this.distLight = document.createElementNS(NS, "feDistantLight");
    this.distLight.setAttribute("azimuth",azimuth);
    this.distLight.setAttribute("elevation",elevation);
    this.defLight.appendChild(this.distLight);
    this.filter.appendChild(this.turbulence);
    this.filter.appendChild(this.defLight);
    this.animate = function(surfScale){
        this.defLight.setAttribute("surfaceScale", surfScale);
    };    
}

function rippleT(filterId, color, baseHFreq, baseVFreq, surfScale, azimuth, elevation){
    this.filter = new TextureFilter(filterId).filter;
    this.turbulence = document.createElementNS(NS, "feTurbulence");
    this.turbulence.setAttribute("baseFrequency",baseHFreq + " " + baseVFreq);
    this.turbulence.setAttribute("result","noise");
    this.defLight = document.createElementNS(NS, "feDiffuseLighting");
    this.defLight.setAttribute("in","noise");
    this.defLight.setAttribute("lighting-color",color);
    this.defLight.setAttribute("surfaceScale",surfScale);
    this.distLight = document.createElementNS(NS, "feDistantLight");
    this.distLight.setAttribute("azimuth",azimuth);
    this.distLight.setAttribute("elevation",elevation);
    this.defLight.appendChild(this.distLight);
    this.filter.appendChild(this.turbulence);
    this.filter.appendChild(this.defLight);
    this.animate = function(surfScale){
        this.defLight.setAttribute("surfaceScale", surfScale);
    };    
}

function courseT(filterId, color, baseHFreq, baseVFreq, numOctaves, surfScale, azimuth, elevation){
    this.filter = new TextureFilter(filterId).filter;
    this.turbulence = document.createElementNS(NS, "feTurbulence");
    this.turbulence.setAttribute("type","fractalNoise");
    this.turbulence.setAttribute("baseFrequency",baseHFreq + " " + baseVFreq);
    this.turbulence.setAttribute("numOctaves",numOctaves);
    this.turbulence.setAttribute("result","noise");
    this.defLight = document.createElementNS(NS, "feDiffuseLighting");
    this.defLight.setAttribute("in","noise");
    this.defLight.setAttribute("lighting-color",color);
    this.defLight.setAttribute("surfaceScale",surfScale);
    this.distLight = document.createElementNS(NS, "feDistantLight");
    this.distLight.setAttribute("azimuth",azimuth);
    this.distLight.setAttribute("elevation",elevation);
    this.defLight.appendChild(this.distLight);       
    this.filter.appendChild(this.turbulence);
    this.filter.appendChild(this.defLight);
    this.animate = function(surfScale){
        this.defLight.setAttribute("surfaceScale", surfScale);
    };    
}

function liquidT(filterId, color, baseHFreq, baseVFreq, numOctaves){
    this.filter = new TextureFilter(filterId).filter;
    this.turbulence = document.createElementNS(NS, "feTurbulence");
    this.turbulence.setAttribute("type","turbulence");
    this.turbulence.setAttribute("baseFrequency",baseHFreq + " " + baseVFreq);
    this.turbulence.setAttribute("numOctaves",numOctaves);
    this.turbulence.setAttribute("result","turbulence");
    this.flood = document.createElementNS(NS, "feFlood");
    this.flood.setAttribute("flood-color",color);
    this.flood.setAttribute("flood-opacity","1");
    this.flood.setAttribute("result","flood");
    this.composite1 = document.createElementNS(NS, "feComposite");
    this.composite1.setAttribute("in","flood");
    this.composite1.setAttribute("in2","turbulence");
    this.composite1.setAttribute("operator","in");
    this.composite1.setAttribute("result","composite2");
    this.composite2 = document.createElementNS(NS, "feComposite");
    this.composite2.setAttribute("in","composite2");
    this.composite2.setAttribute("in2","SourceAlpha");
    this.composite2.setAttribute("operator","in");
    this.composite2.setAttribute("result","composite3");
    this.filter.appendChild(this.turbulence);
    this.filter.appendChild(this.flood);
    this.filter.appendChild(this.composite1);
    this.filter.appendChild(this.composite2);
}

function gasT(filterId, color, baseHFreq, baseVFreq, numOctaves){
    this.filter = new TextureFilter(filterId).filter;
    this.turbulence = document.createElementNS(NS, "feTurbulence");
    this.turbulence.setAttribute("type","fractalNoise");
    this.turbulence.setAttribute("baseFrequency",baseHFreq + " " + baseVFreq);
    this.turbulence.setAttribute("numOctaves",numOctaves);
    this.turbulence.setAttribute("result","turbulence");
    this.flood = document.createElementNS(NS, "feFlood");
    this.flood.setAttribute("flood-color",color);
    this.flood.setAttribute("flood-opacity","1");
    this.flood.setAttribute("result","flood");
    this.composite1 = document.createElementNS(NS, "feComposite");
    this.composite1.setAttribute("in","flood");
    this.composite1.setAttribute("in2","turbulence");
    this.composite1.setAttribute("operator","in");
    this.composite1.setAttribute("result","composite2");
    this.composite2 = document.createElementNS(NS, "feComposite");
    this.composite2.setAttribute("in","composite2");
    this.composite2.setAttribute("in2","SourceAlpha");
    this.composite2.setAttribute("operator","in");
    this.composite2.setAttribute("result","composite3");
    this.filter.appendChild(this.turbulence);
    this.filter.appendChild(this.flood);
    this.filter.appendChild(this.composite1);
    this.filter.appendChild(this.composite2);
}

