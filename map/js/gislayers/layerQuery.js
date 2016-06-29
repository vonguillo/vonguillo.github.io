var hStyle = {
    strokeWeight: 3,
    zIndex: 100,
    strokeOpacity: 1

};
var style = {
    fillColor: '#E84C66',
    fillOpacity: 0.2,
    strokeColor: '#E84C66',
    strokeWeight: 1,
    strokeOpacity: 1,
    zIndex: 0
};

var polygonColor = null;
var polygonStyle = {
    fillColor: '#000000',
    fillOpacity: 0.9,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    strokeOpacity: 1,
    zIndex: 0
}

var usedColors = {};

var legendObj = {
    domainArray: [],
    colorLabel: {},
};

function ArcgisLayer(mapFunc, inputObj, bbox) {

    this.mapId = mapFunc;
    this.layerName = inputObj.layerName;
    this.urlEndpoint = inputObj.urlEndpoint;
    this.layerId = inputObj.layerId;
    this.whereString = inputObj.whereString;
    this.outfieldsLabels = inputObj.outfieldsLabels;
    this.inputOutfields = inputObj.inputOutfields;
    this.geomArray = new Array();
    this.iconPath = inputObj.iconPath;
    this.geomType = inputObj.geomType;
    this.legend = inputObj.legend;
    this.value = inputObj.value;

    this.iw = null;
    this.highlighted = null;

    this.layer = new gmaps.ags.Layer(this.urlEndpoint + "/" + this.layerId);

    this.params = {
        returnGeometry: true,
        geometryType: "esriGeometryEnvelope",
        inSR: "4326",
        outSR: "4326",
        outFields: this.inputOutfields,
        geometry: "{xmin:" + bbox.xmin + ",ymin:" + bbox.ymin + ",xmax:" + bbox.xmax + ",ymax:" + bbox.ymax + "}",
        spatialRelationship: "esriSpatialRelIntersects",
        where: this.whereString,
        overlayOptions: style,

    };



}

ArcgisLayer.prototype = {

    constructor: ArcgisLayer,

    executeQuery: function (self) {

        /*Measuring Response Request*/
        startTime = new Date();

        layerQueryWatch = true;
        rsgislayer.fireTimeoutWatch();

        callerObject = self;
        self.layer.query(self.params, self.processResultSet, self.callbackErr);

        map.setOptions({ scrollwheel: false, draggable: false });

        $("#layerspinner").css('visibility', 'visible');
        rsgislayer.disableDragendGisEventListeners();

    },
    callbackErr: function (err) {
        console.log(err);

        //var obj = { color: redColor + " !important;", html: "No " + $('#' + callerObject.layerName).parent().text().trim() + " data retrieved, please try again", visibility: "hidden" };
        //rsgislayer.loadDisclaimer(obj);
        rsgislayer.manageMaplayersNotFound(true, callerObject.layerName);

        $("#layerspinner").css('visibility', 'hidden');
        map.setOptions({ scrollwheel: true, draggable: true });

    },

    processResultSet: function (rs) {
        layerQueryWatch = false;

        var endTime = new Date();
        console.log("totalTime:");
        var time = new Date(endTime - startTime);
        console.log(time.getMinutes() + ":" + time.getSeconds() + "," + time.getMilliseconds());

        var fs = rs.features;

        if (fs) {
            if (fs.length == 0) {

                /*
                 *  NO RESULTS FROM REQUEST
                 */

                $("#layerspinner").css('visibility', 'hidden');
                map.setOptions({ scrollwheel: true, draggable: true });

                rsgislayer.enableDragendGisEventListeners();


                //var obj = { color: redColor + " !important;", html: "No " + $('#' + callerObject.layerName).parent().text().trim() + " data in the viewport area", visibility: "hidden" };
                //rsgislayer.loadDisclaimer(obj);
                rsgislayer.manageMaplayersNotFound(true, callerObject.layerName);

                if (queryLayerCheckedBoxes.length != 0) {
                    rsgislayer.showGisLayerBeta(queryLayerCheckedBoxes.pop());
                }

            } else {
                /*
                 *  RESULTS RETURNED
                 */


                $("#layerspinner").css('visibility', 'hidden');
                map.setOptions({ scrollwheel: true, draggable: true });

                rsgislayer.enableDragendGisEventListeners();

                if (callerObject.geomArray.length != 0) {
                    callerObject.geomArray.length = 0;
                }
                /*
                 *  LEGEND CREATION TEST CONDITION
                 */
                if (callerObject.legend) {
                    //alert("LETS CREATE A LEGEND");
                    this.ArcgisLayer.prototype.getLegendValues(callerObject.urlEndpoint + "/" + callerObject.layerId, fs, this);

                } else {
                    this.ArcgisLayer.prototype.processGeometry(fs, this);
                }

            }

        } else {

            $("#layerspinner").css('visibility', 'hidden');
            map.setOptions({ scrollwheel: true, draggable: true });

            rsgislayer.enableDragendGisEventListeners();

            //var obj = { color: redColor + " !important;", html: "No " + $('#' + callerObject.layerName).parent().text().trim() + " data in the viewport area", visibility: "hidden" };
            //rsgislayer.loadDisclaimer(obj);

            rsgislayer.manageMaplayersNotFound(true, callerObject.layerName);

            if (queryLayerCheckedBoxes.length != 0) {
                rsgislayer.showGisLayerBeta(queryLayerCheckedBoxes.pop());
            }
        }
    },

    setupFeature: function (feat) {

        var a = feat.attributes;

        var html = this.getHTMLlabels(callerObject.layerName, a, callerObject.inputOutfields, callerObject.outfieldsLabels);

        var g = feat.geometry[0];//V3 supports multiple rings, so should have only 1 element

        if (callerObject.geomType == 'point') {
            var latlng = this.getPointCenter(g);
            var image = this.getIconImage(callerObject.layerName, a);
            g.setOptions({ icon: image });

        } else if (callerObject.geomType == 'polygon') {
            var latlng = this.getPolyCenter(g);

        } else {
            return true;
        }


        if (callerObject.legend) {

            polygonStyle.fillColor = polygonColor(a[callerObject.value]);
            //polygonStyle.strokeColor = polygonStyle.fillColor;

            usedColors[polygonStyle.fillColor] = true;

            g.setOptions(polygonStyle);

            google.maps.event.addListener(g, 'click', function () {

                ArcgisLayer.prototype.popupWindow(g, html, latlng);
            });

        } else {
            g.setOptions(style);
            google.maps.event.addListener(g, 'click', function () {
                //console.log("Inside InfoWindowEventListener");
                //console.log(this);
                ArcgisLayer.prototype.popupWindow(g, html, latlng);
            });
        }

        callerObject.geomArray.push(g);

    },

    getPolyCenter: function (poly) {
        //alert(4);
        var paths, path, latlng;
        var lat = 0;
        var lng = 0;
        var c = 0;
        paths = poly.getPaths();
        for (var j = 0, jc = paths.getLength() ; j < jc; j++) {
            path = paths.getAt(j);
            for (var k = 0, kc = path.getLength() ; k < kc; k++) {
                latlng = path.getAt(k);
                lat += latlng.lat();
                lng += latlng.lng();
                c++;
            }
        }
        if (c > 0) {
            return new google.maps.LatLng(lat / c, lng / c);
        }
        return null;
    },

    getPointCenter: function (point) {
        //alert(5);
        return new google.maps.LatLng(point.position.lat(), point.position.lng());

    },

    highlight: function (g) {

        //console.log("INSIDE HIGHLIGHT");
        //console.log(callerObject);

        if (callerObject.highlighted) {
            callerObject.highlighted.setOptions(style);
            callerObject.highlighted = null;
        }
        g.setOptions(hStyle);
        callerObject.highlighted = g;

    },

    popupWindow: function (g, html, latlng) {
        if (!mobileDevice) {
            if (!callerObject.iw) {
                callerObject.iw = new google.maps.InfoWindow({
                    content: html,
                    position: latlng
                    /*maxWidth: 240*/
                });

            } else {
                callerObject.iw.setContent(html);
                callerObject.iw.setPosition(latlng);
            }
            callerObject.iw.open(callerObject.mapId);
            //Close window
            infowindowsArray.push(callerObject.iw);

            google.maps.event.addListener(callerObject.iw, 'domready', function () {

                var iwOuter = $('.gm-style-iw');

                var iwBackground = iwOuter.prev();

                iwBackground.children(':nth-child(2)').css({
                    'display': 'none'
                });

                iwBackground.children(':nth-child(4)').css({
                    'display': 'none'
                });

                var iwCloseBtn = iwOuter.next();

                iwCloseBtn.html('<span style="font-size:medium">X</span>');

                iwCloseBtn.addClass('label label-info');

                iwCloseBtn.css({
                    width: '30px',
                    height: '20px',
                    opacity: '1', // by default the close button has an opacity of 0.7
                    'margin-right': '48px', 'margin-top': '10px',

                    //left: '310px',top: '20px', // button repositioning

                    border: '13px light blue', // increasing button border and new color
                    'border-radius': '13px', // circular effect
                    'box-shadow': '0 0 5px #3990B9' // 3D effect to highlight the button


                });
                iwOuter.css('border', '#D58512');

                iwImg = $('.gm-style-iw').parent().find('img');
                /*IF TRUE, we need to adjust the transparent img set by Google Maps API within the Close Button*/
                iwImg.each(function (i, item) {


                    if ('href' in item) {

                        if (((item.href).split('/').pop() === 'transparent.png')) {


                            $(item).css('right', '55px');
                            $(item).css('top', '10px');

                        }

                    } else if ('src' in item) {

                        if (((item.src).split('/').pop() === 'transparent.png')) {


                            $(item).css('right', '55px');
                            $(item).css('top', '10px');

                        }

                    } else {

                    }


                });


                iwCloseBtn.mouseout(function () {
                    $(this).css({
                        opacity: '1'
                    });
                });

            });
            //--------------------------
        } else {
            var onlyContent = $(html).find('.QuickInfoDesc');
            $('.quickinfomodal-body').html(onlyContent);
            $("#modalQuickinfo").modal("show");

        }
    },

    getAirportSize: function (val) {

        switch (val) {
            case 4:
                return new google.maps.Size(32, 37);
            case 5:
                return new google.maps.Size(28, 32);
            case 2:
                return new google.maps.Size(23, 27);
            case 1:
                return new google.maps.Size(19, 22);
            case 3:
                return new google.maps.Size(15, 17);
            case 99:
                return new google.maps.Size(11, 13);
            default:
                return new google.maps.Size(11, 13)
        }
    },

    getEarhquakeIcon: function (val) {
        //source: http:\//earthquake.usgs.gov/learn/topics/mag_vs_int.php

        if (val >= 7) {
            return {
                url: callerObject.iconPath + "_high.png",
                scaledSize: new google.maps.Size(32, 37)
            }

        } else if (val < 7 && val >= 6) {
            return {
                url: callerObject.iconPath + ".png",
                scaledSize: new google.maps.Size(23, 27)
            }
        } else if (val < 6 && val >= 5) {
            //return new google.maps.Size(28, 32);
            return {
                url: callerObject.iconPath + "_med.png",
                scaledSize: new google.maps.Size(19, 22)
            }

        } else if (val < 5 && val >= 4) {

            return {
                url: callerObject.iconPath + "_low.png",
                scaledSize: new google.maps.Size(19, 22)
            }


        } else if (val < 4 && val >= 3) {
            return {
                url: callerObject.iconPath + "_low.png",
                scaledSize: new google.maps.Size(15, 17)
            }

        } else if (val < 3) {
            return {
                url: callerObject.iconPath + "_low.png",
                scaledSize: new google.maps.Size(11, 13)
            }

        } else {
            return {
                url: callerObject.iconPath + "_low.png",
                scaledSize: new google.maps.Size(11, 13)
            }
        }

    },

    getAirportLabel: function (typeValue) {

        //Source: http:\//services.nationalmap.gov/arcgis/rest/services/transportation/MapServer/legend?f=pjson
        var airportDict = {
            1: "Private Airstrip / Airport",
            2: "Municipal Airstrip / Airport",
            3: "Regional Airport",
            4: "International Airport",
            5: "Militarty",
            99: "Unknown"
        }

        return airportDict[typeValue];

    },

    getIconImage: function (layername, attr) {
        //console.log(layername);
        switch (layername) {

            case "airport":
                return {
                    url: callerObject.iconPath,
                    // This marker is 20 pixels wide by 32 pixels high.
                    scaledSize: this.getAirportSize(attr['AIRPORT_CLASS']),
                    //origin: new google.maps.Point(32,0), //origin
                    //anchor: new google.maps.Point(32, 0)
                }
            case "earthquake":
                return this.getEarhquakeIcon(parseFloat(attr['magnitude']));
                //origin: new google.maps.Point(32,0), //origin
                //anchor: new google.maps.Point(32, 0)

            case "usvolcano":
                return { url: callerObject.iconPath + "/" + attr["alertlevel"] + "-" + attr["colorcode"] + ".png" }

            default:
                return { url: callerObject.iconPath, scaledSize: new google.maps.Size(19, 21) }

        }



    },

    getHTMLlabels: function (layername, attr, fields, labels) {

        //var iwTitle = $('label[for=' + layername + "label" + ']').html();
        var iwTitle = $('#' + layername).parent().text().trim();
        //console.log(iwTitle);
        var htmlString = '<div id="iw-container">\
                                    <div class="iw-title" style="background-color: rgba(213,133,18,0.8) !important;">\
                                        <img src="/images/gisinfo.png" style="float:left;width:20px; height:20px; margin-left:10px; margin-right:8px;margin-bottom:4px;"/>\
                                        <b style="float: left">' + iwTitle + '</b>\
                                    </div>\
                                    <div style="max-height:200px;overflow-x: hidden;margin-bottom:3px; margin-right:8px;">\
                                    <div class="QuickInfoDesc" style="overflow:visible;"><p>';
        //create the body
        for (var i = 0; i < labels.length; i++) {

            if (fields[i] == 'AIRPORT_CLASS') {
                htmlString += "<b>" + labels[i] + ": </b>" + this.getAirportLabel(attr[fields[i]]) + "</br>";
            } else if (labels[i] == "More Info.") {
                htmlString += '<a href = "' + attr[fields[i]] + '" target="_blank">' + labels[i] + '</a>';
            } else if ((layername == 'earthquake') && (fields[i] == 'pubdate')) {
                var tmpDate = new Date(attr[fields[i]]).toGMTString();
                htmlString += "<b>" + labels[i] + ": </b>" + tmpDate + "</br>";
            } else if ((layername == 'firepoint') && ((fields[i] == 'reportdatetime') || (fields[i] == 'firediscoverydatetime'))) {
                var tmpDate = new Date(attr[fields[i]]).toGMTString();
                htmlString += "<b>" + labels[i] + ": </b>" + tmpDate + "</br>";
            } else if ((layername == 'fireperimeter') && ((fields[i] == 'datecurrent') || (fields[i] == 'perimeterdatetime'))) {
                var tmpDate = new Date(attr[fields[i]]).toGMTString();
                htmlString += "<b>" + labels[i] + ": </b>" + tmpDate + "</br>";
            } else if ((layername == 'municity') && (fields[i] == 'LOADDATE')) {
                var tmpDate = new Date(attr[fields[i]]).toDateString();
                htmlString += "<b>" + labels[i] + ": </b>" + tmpDate + "</br>";
            }



            else {
                htmlString += "<b>" + labels[i] + ": </b>" + attr[fields[i]] + "</br>";

            }

        }

        //htmlString += "</p></div></div style='max-height:300px;overflow-x: hidden;margin-bottom:3px; margin-right:102px;'>";
        htmlString += '</p></div>\
                        </div>\
                        </div>';
        //console.log(htmlString);

        return htmlString;

    },

    setVisLayerOff: function (self) {
        //alert(8);
        //alert("AIRPORTS OFF");
        for (var i = 0; i < self.geomArray.length; i++) {
            //console.log(this.geomArrayAirport[i]);
            self.geomArray[i].setMap(null);
        }

        $('.legend-wrapper').css('display', 'none');
        rsgislayer.manageMaplayersDivTitle(false, self.layerName);
        return true;
    },

    setVisLayerOn: function (self, mapId) {
        //alert(9);
        //alert("AIRPORTS ON");

        for (var i = 0; i < self.geomArray.length; i++) {
            //console.log(callerObject.geomArray[i]);
            self.geomArray[i].setMap(mapId);
        }

        /*
        if ($.inArray(self.layerName,['severe','warning','watch','advisory']) < 0)
     getLegendValues(self.urlEndpoint + "/" + self.layerId);
        */
        rsgislayer.manageMaplayersDivTitle(true, self.layerName);
        rsgislayer.manageMaplayersNotFound(false, self.layerName);
        var time = new Date();
        console.log("FINISH setVisLayerOn");
        console.log(time.getMinutes() + ":" + time.getSeconds() + "," + time.getMilliseconds());

    },

    returnDatetimeFormat: function (unixTime) {

        var t = new Date(unixTime);
        return t.format("dd.mm.yyyy hh:MM:ss");
    },

    processGeometry: function (fs, self) {

        usedColors = {};
        for (var i = 0, c = fs.length; i < c; i++) {
            if (("geometry" in fs[i])) {
                self.ArcgisLayer.prototype.setupFeature(fs[i]);
            } else {
                console.log("The location: " + fs[i].attributes['NAME'] + " has no LAT/LNG");

            }

        }
        massiveVisibleRange = true;

        var time = new Date();
        console.log("setVisLayerOn");
        console.log(time.getMinutes() + ":" + time.getSeconds() + "," + time.getMilliseconds());

        self.ArcgisLayer.prototype.setVisLayerOn(callerObject, map);

        if (callerObject.legend) self.ArcgisLayer.prototype.setLegendDiv();


        if (queryLayerCheckedBoxes.length != 0) {
            rsgislayer.showGisLayerBeta(queryLayerCheckedBoxes.pop());
        }

    },

    getLegendValues: function (url, fs, self) {
        //url = 'http://gis.fema.gov/REST/services/FEMA/PowerOutages/MapServer/0';

        $.ajax({
            url: url + "?f=json",
            dataType: 'json',
            success: function (data) {


                legendObj.domainArray.length = 0;
                legendObj.colorLabel = {};


                var drawData = data.drawingInfo.renderer;
                console.log(drawData);
                if (drawData.type == "classBreaks") {

                    myData = drawData.classBreakInfos;

                    for (var i = 0; i < myData.length; i++) {

                        var item = myData[i];
                        console.log(item);

                        if ((i + 1) < myData.length) legendObj.domainArray.push(item.classMaxValue);

                        var color = rgbToHex(item.symbol.color[0], item.symbol.color[1], item.symbol.color[2]);
                        var label = (item.label).replace('"', '');

                        legendObj.colorLabel[color] = label;

                    }
                    polygonColor = null;
                    createClassBreaks(legendObj, fs, self);

                    dummyVar = legendObj;
                    //console.log(legendObj);
                    //alert("legendValuesExtracted");

                } else if (drawData.type == "uniqueValue" && drawData.uniqueValueInfos.length > 1) {

                    myData = drawData.uniqueValueInfos;

                    if ("color" in myData[0].symbol) {
                        for (var i = 0; i < myData.length; i++) {

                            var item = myData[i];
                            var color = rgbToHex(item.symbol.color[0], item.symbol.color[1], item.symbol.color[2]);
                            var label = item.label;
                            legendObj.domainArray.push(color);
                            legendObj.colorLabel[color] = label;
                        }

                        polygonColor = null;
                        createUniqueValues(legendObj, fs, self);
                    }

                } else {
                    console.log(drawData);
                }

                function componentToHex(c) {
                    var hex = c.toString(16);
                    return hex.length == 1 ? "0" + hex : hex;
                }

                function rgbToHex(r, g, b) {
                    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
                }

                function createClassBreaks(legendObj, fs, self) {
                    polygonColor = d3.scale.threshold()
                    .domain(legendObj.domainArray)
                    .range(ArcgisLayer.prototype.getKeys(legendObj.colorLabel));

                    self.ArcgisLayer.prototype.processGeometry(fs, self);

                }

                function createUniqueValues(legendObj, fs, self) {
                    polygonColor = d3.scale.ordinal()
                        .domain(ArcgisLayer.prototype.getValues(legendObj.colorLabel))
                        .range(ArcgisLayer.prototype.getKeys(legendObj.colorLabel));

                    self.ArcgisLayer.prototype.processGeometry(fs, self);
                }

            }

        });




    },

    setLegendDiv: function () {

        $('.legend-content').empty();

        var colorLabel = legendObj.colorLabel;
        var colArr = ArcgisLayer.prototype.getKeys(usedColors);
        var legendHtml = '';
        var i = 0;
        for (k in colorLabel) {

            if ($.inArray(k, colArr) > -1) {
                console.log(k + ":" + colorLabel[k])

                legendHtml += '<rect id="myRect" height="10" width="10" fill="' + k + '" transform="translate(0 ' + i * 20 + ')"/>\
                                                    <text x="20" y="' + parseInt(8 + i * 20) + '" fill="gray" font-size="10px" font-family="sans-serif">' + colorLabel[k] + '</text>';

                i++;
            }

        }
        legendHtml += '</svg>';

        var preHtml = '<svg height="' + 20 * i + '" width="' + $('#legend-content').width + '">';

        legendHtml = preHtml + legendHtml

        $('.legend-content').append(legendHtml);
        $('.legend-wrapper').css('display', 'block');
    },

    getKeys: function (obj) {
        var a = [];
        $.each(obj, function (k) { a.push(k) });
        return a;
    },

    getValues: function (obj) {
        var a = [];
        $.each(obj, function (k) { a.push(obj[k]) });
        return a;
    }

}



