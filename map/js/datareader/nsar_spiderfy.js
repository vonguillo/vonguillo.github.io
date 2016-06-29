/*BASEMAP*/
var map = null;
var viewportArea = null;
var currentZoom = null;
var currentCenter = null;

var oms = null;


/*DATASOURCES*/
var museumGeoJSON = "../../../../data/MUSEUM.geojson";
var theaterGeoJSON = "../../../../data/THEATER.geojson";
var dummyGeoJSON = "../../../../data/DummyData.geojson";

/*FILTERS FROM DATA*/
var mapFiltersObj = {
    agency: {
        title: "Agency",
        elements:{}
    },
    tier1: {
        title: "Tier",
        elements: {}
    },
    biosafetyLevel: {
        title: "Safety Level",
        elements: {}
    }
}

var agenciesSearch = [];

/*GEOMETRIES ELEMENTS*/
var infoWindow = new google.maps.InfoWindow({
    content: "",
    pixelOffset: new google.maps.Size(0,0)
});

/*EVENTS FLAGS*/
var updateEntities = true;
//This flag is used to handle the #safetlevels filter
var allSafetyBoolean = true;


/* UI VARIABLES*/
var featureList;



function loadMapData() {

    getNsarMapData();

    //loadGeoJSON(dummyGeoJSON);



 
   // MUST ENABLE THIS METHOD WHENEVER FILTERS ARE TO BE DYNAMICALLY CREATED FROM THE LOADED DATA.


    
}


/* DATA RELATED FUNCTION*/
function loadGeoJSON(geoJsonObj) {

         /*
        To LOAD a LOCAL file or URL  use loadGeoJson(<datasource>)
        To DISPLAY a GeoJSON variable or OBJECT use addGeoJson(<URL>) 
        */

        map.data.setStyle(function (feature) {
            var type = feature.getProperty("dataSource");
            return {
                icon: getLayerSymbol(type)
            };
        });


        map.data.loadGeoJson(geoJsonObj);

        
        map.data.addListener('click', function (event) {

            var entityHtml = '<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
                                            event.feature.getProperty("NAME") + "<br/>\
                                        Address: " + event.feature.getProperty("ADDRESS1") + "<br/>\
                                        City: " + event.feature.getProperty("CITY") + "<br/>\
                                        URL: " + event.feature.getProperty("URL") + "<br/>\
                                        </div>" ;

            if (mobileDevice) {

                $("#feature-title").html(event.feature.getProperty("NAME"));
                $("#feature-info").html('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">\
                                        Address: ' + event.feature.getProperty("ADDRESS1") + "<br/>\
                                        City: " + event.feature.getProperty("CITY") + "<br/>\
                                        URL: " + event.feature.getProperty("URL") + "<br/>\
                                        Agency: " + event.feature.getProperty("agency") + "<br/>\
                                        Tier: " + event.feature.getProperty("tier1") + "<br/>\
                                        Safety: " + event.feature.getProperty("biosafetyLevel") + "<br/>\
                                        </div>");

                $("#featureModal").modal("show");

            } else {
                //show an infowindow on click
                infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
                                            event.feature.getProperty("NAME") + "<br/>\
                                        Address: " + event.feature.getProperty("ADDRESS1") + "<br/>\
                                        City: " + event.feature.getProperty("CITY") + "<br/>\
                                        URL: " + event.feature.getProperty("URL") + "<br/>\
                                        Agency: " + event.feature.getProperty("agency") + "<br/>\
                                        Tier: " + event.feature.getProperty("tier1") + "<br/>\
                                        Safety: " + event.feature.getProperty("biosafetyLevel") + "<br/>\
                                        </div>");

                anchor = new google.maps.MVCObject();
                anchor.set("position", event.latLng);
                infoWindow.open(map, anchor);
            }

        });

}
function addGeoJSON(geoJsonObj) {

    /*
   To LOAD a LOCAL file or URL  use loadGeoJson(<datasource>)
   To DISPLAY a GeoJSON variable or OBJECT use addGeoJson(<URL>) 
   */
    

    map.data.setStyle(function (feature) {
        var type = feature.getProperty("agency");
        return {
            icon: getLayerSymbol(type)
        };
    });


    map.data.addGeoJson(geoJsonObj);


    map.data.addListener('click', function (event) {

        entityHtml = '<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
                                        event.feature.getProperty("NAME") + "<br/>\
                                        Address: " + event.feature.getProperty("ADDRESS1") + "<br/>\
                                        City: " + event.feature.getProperty("CITY") + "<br/>\
                                        URL: " + event.feature.getProperty("URL") + "<br/>\
                                        Agency: " + event.feature.getProperty("agency") + "<br/>\
                                        Tier: " + event.feature.getProperty("tier1") + "<br/>\
                                        Safety: " + event.feature.getProperty("biosafetyLevel") + "<br/>\
                                        </div>" ;

        if (mobileDevice) {

            $("#feature-title").html(event.feature.getProperty("NAME"));
            $("#feature-info").html('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">\
                                        Address: ' + event.feature.getProperty("ADDRESS1") + "<br/>\
                                        City: " + event.feature.getProperty("CITY") + "<br/>\
                                        URL: " + event.feature.getProperty("URL") + "<br/>\
                                        Agency: " + event.feature.getProperty("agency") + "<br/>\
                                        Tier: " + event.feature.getProperty("tier1") + "<br/>\
                                        Safety: " + event.feature.getProperty("biosafetyLevel") + "<br/>\
                                        </div>");

            $("#featureModal").modal("show");

        } else {
            //show an infowindow on click
            infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
                                        event.feature.getProperty("NAME") + "<br/>\
                                        Address: " + event.feature.getProperty("ADDRESS1") + "<br/>\
                                        City: " + event.feature.getProperty("CITY") + "<br/>\
                                        URL: " + event.feature.getProperty("URL") + "<br/>\
                                        Agency: " + event.feature.getProperty("agency") + "<br/>\
                                        Tier: " + event.feature.getProperty("tier1") + "<br/>\
                                        Safety: " + event.feature.getProperty("biosafetyLevel") + "<br/>\
                                        </div>");

            anchor = new google.maps.MVCObject();
            anchor.set("position", event.latLng);
            infoWindow.open(map, anchor);
        }

    });

    openEntitiesTab("entities", $('[href=#entities]').parent());

}

function getNsarMapData() {
    $.ajax({
        url: "/api/Nsar/GetNsarMapData",
        type: "GET",
        dataType: "json",
        success: function (data) {

            if (data.Result == "SUCCESS") {
                $.each(data.MainEntity.features, function (i, item) {


                    agenciesSearch.push({

                        name: item.properties.org_nm,
                        address: item.properties.strt_adrs,
                        id: item.orgId,
                        source: "Agencies"
                    });
                });

                _nsarMainGeoJSON = JSON.stringify(data.MainEntity);

                if (getFiltersFromData()) {
                    console.log("GOT FILTER DATA");

                };

                loadSelectPicker();
                enableTypeahead();
                $("#layerspinner").css('visibility', 'hidden');

            }



        },
        error: function (msg) {

        }
    });
}

function getFiltersFromData() {

    //var promise = $.getJSON(_nsarMainGeoJSON); //same as map.data.loadGeoJson();
    var data = JSON.parse(_nsarMainGeoJSON);

    var mapFilters = $.keys(mapFiltersObj);

    $.each(data.features, function (i, item) {

   // promise.then(function (data) {
        /*USAGE OF each each(arr, function(index, elem) {});*/
        for (var i = 0; i < mapFilters.length; i++) {

            var filter = mapFilters[i];

            
                //console.log(item);
                mapFiltersObj[filter].elements[item.properties[filter]] = item.properties[filter];
         
        }

    });
    //});

    return true;

}

//function applyFilterToDatasource(filterObj) {

//    /*
//     filterObj()

//     agency: agencies,
//     tier: tierFlag,
//     safety:safetyLevels
//    */

//    //console.log(filterObj);
//    //$.getJSON(geoJSONsource, function (data) {
//    //JSON.parse(geoJSONsource, function (data) {
//    var data = JSON.parse(_nsarMainGeoJSON);
//    //alert(" $.getJSON(geoJSONsource, function (data)");

//    var filteredFeatureArray = [];
//    filteredFeatureArray.length = 0;

//    //console.log(data);

//    var tierFilter = (filterObj.tier ? 'Yes' : 'No');
//    var safetyLevels = filterObj.safety;

//    $.each(data.features, function (i, item) {

//        /* FILTER AGENCY*/
//        /* Do not filter if All agencies are selected*/

//        var filterResult;

//        if (filterObj.agency != 'agencyall' && filterObj.agency != null) {

//            filterResult = (item.properties.agency == filterObj.agency);

//        } else {
//            filterResult = true;
//        }
//        //alert(filterResult);

//        if (filterObj.safety != null && filterObj.safety[0] != "0") {

//            filterResult = filterResult && ($.inArray(item.properties.biosafety, safetyLevels) != -1 ? true : false);
//        } else {
//            filterResult = filterResult && true;
//        }
//        //alert(filterResult);


//        filterResult = filterResult && (item.properties.tier1 == tierFilter)

//        if (filterResult) console.log("Agency: " + item.properties.agency + " - Tier " + item.properties.tier1 + " - Safety:" + item.properties.biosafety);

//        //alert(filterResult);


//        if (filterResult) filteredFeatureArray.push(item);


//    });


//    filteredObject = {
//        "type": "FeatureCollection",
//        "features": filteredFeatureArray
//    }
//    if (filteredObject.length == 0) {
//        alert("NO RESULTS FOUND");
//    } else {

//        addGeoJSON(filteredObject);

//    }

//    //});

//}
//       applyLinqFilter(getSelectedFilter());
function applyLinqFilter(filterObj) {

    if (($('#agencyform').find('input[name=agency]:checked').length != 0)&&
        ($('#tierform').find('input[name=tier]:checked').length != 0)) {

        var agencyQuery = (filterObj.agency.length == 1 ? "$.properties.agency == '" + filterObj.agency[0] + "'" : "1==1");
        var tierQuery = (filterObj.tier.length == 1 ? "$.properties.tier1 == '" + filterObj.tier[0] + "'" : "1==1");

        var queryResult = Enumerable.From(JSON.parse(_nsarMainGeoJSON).features)
            //.Where("$.properties.agency == 'CDC' && $.properties.tier1 == 'No'")
            .Where(agencyQuery + "&&" + tierQuery)
            .Where(function (x) {
                if (filterObj.safety.length == 1 && filterObj.safety[0] == 'All') return true
                else return ((filterObj.safety).indexOf(x.properties.biosafetyLevel) > -1 ? true : false)
            })
            //.Contains("$.properties.biosafetyLevel","$.lista")
            .OrderBy("$.properties.entityName")
            //.Select("$.properties.entityName + ':' + $.properties.agentCategory")
            .Select("$")
            .ToArray();

        console.log(queryResult);

        var filteredObject = {
            "type": "FeatureCollection",
            "features": queryResult
        }

        if (queryResult.length == 0) {

            if ($('#noResultsDiv').length != 0) {

                $('#noResultsDiv').css('display', 'block');
            } else {

                createNoResultsDiv();
                
            }
            openEntitiesTab("entities", $('[href=#entities]').parent());


        } else {

            addGeoJSON(filteredObject);

            if (queryResult.length > 1) {
                var bound = new google.maps.LatLngBounds();
                for (i = 0; i < queryResult.length; i++) {
                    bound.extend(new google.maps.LatLng(queryResult[i].geometry.coordinates[1], queryResult[i].geometry.coordinates[0]));
                    // OTHER CODE
                }
                //console.log(bound.getCenter());
                //map.setCenter(bound.getCenter());
                map.fitBounds(bound);

                if (map.getZoom() > 6) map.setZoom(6);

            }
            


        }

    } else {


        if ($('#noResultsDiv').length != 0) {

            $('#noResultsDiv').css('display', 'block');
        } else {

            createNoResultsDiv();
            openEntitiesTab("entities", $('[href=#entities]').parent());

        }



    }




}

function getEntityByID(id) {

    var queryResult = Enumerable.From(JSON.parse(_nsarMainGeoJSON).features)

    .Where(function (x) {
        return id == x.id
    })
    //.Contains("$.properties.biosafetyLevel","$.lista")
    .OrderBy("$.properties.entityName")
    //.Select("$.properties.entityName + ':' + $.properties.agentCategory")
    .Select("$")
    .ToArray();


    console.log(queryResult);

    var filteredObject = {
        "type": "FeatureCollection",
        "features": queryResult
    }
    if (filteredObject.length == 0) {
        if ($('#noResultsDiv').length != 0) {

            $('#noResultsDiv').css('display', 'block');
        } else {

            createNoResultsDiv();
            openEntitiesTab("entities", $('[href=#entities]').parent());
        }
    } else {

        var objLatLng = new google.maps.LatLng({
            lat: queryResult[0].geometry.coordinates[1],
            lng: queryResult[0].geometry.coordinates[0]
        });

        addGeoJSON(filteredObject);

        map.setCenter(objLatLng);
        map.setZoom(5);
    }

}

/* UI RELATED FUNCTIONS*/
function getActivePane() {

    //var activePanes = $('.active');
    //if (activePanes.length > 1) return activePanes[1].id;
    //else return null;
    return $($('li' && '.active')[0]).find('a')[0].hash;

}
function updateEntityPanel() {

    //var contentPane = $('#entitiesTabs');
    var contentPane = $("#feature-list tbody");
    var viewportFrame = getViewportArea();
    listMapEntities(viewportFrame, contentPane);

}
function createFilterCheckBoxes(divName, filterObj) {

    //createFilterCheckBoxes('safetylevels', 'biosafetyLevel')
    //alert("createFilterCheckBoxes('safetylevels', 'biosafetyLevel')");

    var mapFilters = $.keys(mapFiltersObj[filterObj].elements);
    var filterPanel = $('[name = ' + divName + ']');//$(divId);



    for (var i = 0; i < mapFilters.length; i++) {
        //html += '<option value="' + mapFilters[i] + '">' + mapFilters[i] + '</option>';

        $('#safetylevels').append($('<option>', {
            value: mapFilters[i],
            text: mapFilters[i]
        }));

        $('#safetylevels').selectpicker('refresh');
        //$.keys(mapFiltersObj.agency.elements)
    }
    /*Source:
    https:\//silviomoreto.github.io/bootstrap-select/
    http:\//stackoverflow.com/questions/23259617/how-to-add-option-values-on-silviomoretos-bootstrap-select'
    http:\//formvalidation.io/examples/bootstrap-select/
    */
    //filterPanel.html(html);

    //$('#bootstrapSelectForm').find('[name="safetylevels"]').selectpicker();

    //alert("END  createFilterCheckBoxes");
}
function loadSelectPicker() {

    //createFilterCheckBoxes('safetylevels', 'biosafetyLevel');
    result = $('#bootstrapSelectForm').find('[name="safetylevels"]').selectpicker();

    createFilterCheckBoxes('safetylevels', 'biosafetyLevel');

    $('#safetylevels').change(function () {

        //console.log("$('#safetylevels')");
        //console.log(this);

        var values = $('#safetylevels').val();

        if (values != null) {

            for (var i = 0; i < values.length; i += 1) {
                //console.log(values[i]);
                if (values[i] == 'All' && allSafetyBoolean) {

                    /*STATE: Initial All Safety Levels selected */

                    var foo = $(this);
                    $('#safetylevels').find('[value="All"]').prop('selected', false);
                    //  $('#dataCombo').val(  );
                    $values = $('#safetylevels').val();
                    $('#safetylevels').selectpicker('deselectAll');
                    $('#safetylevels').selectpicker('val', $values);
                    $('#safetylevels').selectpicker('refresh');

                    allSafetyBoolean = false;

                } else if ((values[i] == 'All') && (!allSafetyBoolean)) {
                    /*STATE: All Safety Levels selected after other selections*/
                    $('#safetylevels').selectpicker('deselectAll');
                    $('#safetylevels').selectpicker('val', 'All');
                    $('#safetylevels').selectpicker('refresh');

                    allSafetyBoolean = true;
                } else {
                    /* Do nothing*/
                }
            };
        } else {
            $('#safetylevels').selectpicker('val', 'All');
            $('#safetylevels').selectpicker('refresh');
        }
    });

}
function getSelectedFilter() {

    // var agencies = $('input[name=agency]:checked', '#agencyform').val();


    var agencies = function () {

        var tempArray = [];
        $('input[name=agency]:checked', '#agencyform').each(function (i, item) {
            tempArray.push($(item).val());
            //console.log($(item).val());
        })
        return tempArray;
    }

    var tierFlag = function () {

        var tempArray = [];
        $('input[name=tier]:checked').each(function (i, item) {
            tempArray.push($(item).val());
        })
        return tempArray;
    }


    //var tierFlag = $('input[name=tier]').is(':checked');
    var safetyLevels = $('[name = safetylevels]').selectpicker('val');

    return {
        agency: new agencies,
        tier: new tierFlag,
        safety: safetyLevels
    }

}

function createNoResultsDiv() {
    var controlDiv = document.createElement('div');
    //controlDiv.className = "noResultsDiv";
    controlDiv.id = "noResultsDiv";
    controlDiv.style.zIndex = "1999";
    controlDiv.innerHTML = "<div class='modal-content' style='margin-top:" + window.outerHeight / 3 + "px;padding:15px;background-color:#FFC6B1'><h3 style='color:#B24219'>NO RESULTS FOUND</h3><center><h4 style='color:#FF5F23'>Please Search Again</h4></center></div>";

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
}

function openEntitiesTab(id, $tab) {


    var $sidebar = $('#sidebar');
    var $tabs = $sidebar.find('ul.sidebar-tabs, .sidebar-tabs > ul');
    var $container = $sidebar.children('.sidebar-content').first();

    if (typeof $tab === 'undefined') $tab = $tabs.find('li > a[href="#' + id + '"]').parent();

    // hide old active contents
    $container.children('.sidebar-pane.active').removeClass('active');

    // show new content
    $container.children('#' + id).addClass('active');

    // remove old active highlights
    $tabs.children('li.active').removeClass('active');

    // set new highlight
    $tab.addClass('active');

    $sidebar.trigger('content', { 'id': id });

    if ($sidebar.hasClass('collapsed')) {
        // open sidebar
        $sidebar.trigger('opening');
        $sidebar.removeClass('collapsed');   
    }
    $('.nav-tabs a[href="#entitylist"]').tab('show');


}
function clearEntityPanel() {

    $("#feature-list tbody").empty();
    $("#feature-list tbody").append('<tr class="feature-row"  id="0" lat="" lng=""><td class="feature-name" style="color:gray;padding-left:20px"><i>No Results<i></td></td></tr>');
    $('#entitydetail').empty();

    featureList = new List("features", {
        valueNames: ["feature-name"]
    });
    featureList.sort("feature-name", {
        order: "asc"
    });

}

/* MAP RELATED FUNCTIONS*/
function getViewportArea() {
    
    var bboxPoints = {
        xmin: null,
        ymin: null,
        xmax: null,
        ymax: null
    };

    var bbox = map.getBounds();
    
    if (bbox == null) {
        bbox = new google.maps.LatLngBounds(
    new google.maps.LatLng(0, 0),
    new google.maps.LatLng(0, 0));
    }
    var bboxNE = bbox.getNorthEast();
    var bboxSW = bbox.getSouthWest();

    bboxPoints.xmin = bbox.getSouthWest().lng();
    bboxPoints.ymin = bbox.getSouthWest().lat();
    bboxPoints.xmax = bbox.getNorthEast().lng();
    bboxPoints.ymax = bbox.getNorthEast().lat();

    if (viewportArea != null) {
        viewportArea.setMap(null);
    }


    var bboxFrameObj = [
    { lat: bboxPoints.ymin, lng: bboxPoints.xmin },
    { lat: bboxPoints.ymin, lng: bboxPoints.xmax },
    { lat: bboxPoints.ymax, lng: bboxPoints.xmax },
    { lat: bboxPoints.ymax, lng: bboxPoints.xmin }
    ];



    frame = new google.maps.Polygon({
        paths: bboxFrameObj,
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 10,
        fillColor: '#8EDE88',
        fillOpacity: 0.2
    });

    /*
    If we need to check visually the current viewportArea, add the next line

    frame.setMap(map);
    */
    return frame;

}
function getLayerSymbol(type) {

    switch (type) {

        case 'APHIS':
            return {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 14,
                fillColor: 'green',
                fillOpacity: 0.2,
                strokeColor: 'green',
                strokeWeight: 0.5
            };
            break;
        case 'CDC':
            
            return {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 14,
                fillColor: 'DarkCyan',
                fillOpacity: 0.2,
                strokeColor: 'CornflowerBlue',
                strokeWeight: 0.5
            };
            break;
        default:
            return ""
            break;
    }
}
function getLayerIcon(type) {

    switch (type) {
        case 'APHIS': path = '/360/map/icons/aphis.png';
            return path;
            break;
        case 'CDC': path = '/360/map/icons/CDC.png';
            return path;
            break;
        default:
            return ""
            break;
    }
}
function listMapEntities(viewportFrame, content) {

    content.empty();
    
    map.data.forEach(function (event) {

        var datasourcePoint = new google.maps.LatLng(event.getGeometry().get().lat(), event.getGeometry().get().lng());
        var isOnViewport = google.maps.geometry.poly.containsLocation(datasourcePoint, viewportFrame);

        if (isOnViewport) {

            content.append('<tr class="feature-row"  id=' + event.getId() + ' lat="' + event.getGeometry().get().lat() + '" lng="' + event.getGeometry().get().lng() + '"><td style="vertical-align: middle;"><img width="16" height="18" src="' + getLayerIcon(event.getProperty("agency")) + '"></td><td class="feature-name">' + event.getProperty("NAME") + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
        }

    });

    if ($('.feature-row').length != 0) {

        featureList = new List("features", {
            valueNames: ["feature-name"]
        });
        featureList.sort("feature-name", {
            order: "asc"
        });
    } else {
        clearEntityPanel();
        
    }




}
function clearMap() {

    map.data.forEach(function (feature) {
        map.data.remove(feature);
    })

}



/* EVENT RELATED FUNCTIONS*/

function loadEvents() {

    google.maps.event.addListener(map, 'dragend', function () {


        if (!!getActivePane()) {

            if (getActivePane() == "#entities") updateEntityPanel();
        }

        
    });

    google.maps.event.addListener(map, 'zoom_changed', function () {


        if (!!getActivePane()) {

            if (getActivePane() == "#entities") {
                if (updateEntities) {
                    updateEntityPanel();
                } else {
                    updateEntities = true;
                }
            }
            updateEntities = true;
        }
    });

}

$('.sidebar-tabs li').on('click', function () {

    if ($('#sidebar').hasClass('collapsed')) {

        //The sidebar-panel is closed and <action> should be done

    } else {

        sidebarPane = this;

        switch ($('a', this).attr('href')) {
            case "#entities":
                updateEntityPanel();

                break;

            case "#home":
                //alert("Do nothing");
                break;

            case "#profile":
                //alert("Show user Profile");
                break;

            case "#disable":
                //alert("Messages disabled");
                break;

            case "#settings":
                //alert("Set Map Settings");
                break;

            default:
                break;
        }

    }

    //Close any infoWindow()
    if (infoWindow) {
        infoWindow.close();
    }

})

$('[href="#filter"]').on('click', function () {

    $('.tt-input').each(function (i, item) {

        console.log(item.value);
        item.value = "";
    })

})

$(document).on("click", ".feature-row", function (e) {

    var objLatLng = new google.maps.LatLng({
        lat: parseFloat($(this).attr("lat")),
        lng: parseFloat($(this).attr("lng"))
    });
    var objName = $(".feature-row").find(".feature-name")[0].innerHTML;
    var objId = parseFloat($(this).attr("id"));

    if (objName != 'No Results') {

        currentCenter = map.getCenter();
        currentZoom = map.getZoom();


        map.data.forEach(function (event) {

            var selectedEntity = event;

            if (objId == selectedEntity.getId()) {

                //show an infowindow on click
                entityHtml = '<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
                                            selectedEntity.getProperty("NAME") + "<br/>\
                                        Address: " + selectedEntity.getProperty("ADDRESS1") + "<br/>\
                                        City: " + selectedEntity.getProperty("CITY") + "<br/>\
                                        URL: " + selectedEntity.getProperty("URL") + "<br/>\
                                        Agency: " + selectedEntity.getProperty("agency") + "<br/>\
                                        Tier: " + selectedEntity.getProperty("tier1") + "<br/>\
                                        Safety: " + selectedEntity.getProperty("biosafetyLevel") + "<br/>\
                                        </div>";

                $('#entitydetail').empty();
                $('#entitydetail').append(entityHtml);

                if (!mobileDevice) {
                    infoWindow.setContent(entityHtml);
                    anchor = new google.maps.MVCObject();
                    anchor.set("position", new google.maps.LatLng(event.getGeometry().get().lat(), event.getGeometry().get().lng()));
                    infoWindow.open(map, anchor);
                }
            }

        });

        $('#entitytab a[href="#entitydetail"]').tab('show');

        updateEntities = false;
        map.setCenter(objLatLng);
        map.setZoom(5);

    }

    
});

$('#entitytab a[href="#entitylist"]').on('click', function (e) {

    if (!!currentZoom) {

        updateEntities = false;
        map.setZoom(currentZoom);
        map.setCenter(currentCenter);
        updateEntityPanel();
    }

});


$('#filterbutton').on('click', function () {

    clearMap();

    if ($('#noResultsDiv').length != 0) {

        $('#noResultsDiv').css('display', 'none');
    }

    var filterObj = getSelectedFilter();

    //applyFilterToDatasource(filterObj);
    applyLinqFilter(filterObj);
    //alert('#filterbutton');
    
});

function setMapColors(userStyle) {
    /*
    setMapColors('DEFAULT')
    setMapColors('GRAYSCALE')
    setMapColors('MIDNIGHT')
    setMapColors('BLUE')
    
    */


        var DEFAULT_style = [{ featureType: "all", elementType: "all", stylers: [{ saturation: 0 }] }];
        var GRAYSCALE_style = [{ featureType: "all", elementType: "all", stylers: [{ saturation: -100 }] }];
        var MIDNIGHT_style = [{ featureType: 'water', stylers: [{ color: '#021019' }] }, { featureType: 'landscape', stylers: [{ color: '#08304b' }] }, { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#0c4152' }, { lightness: 5 }] }, { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#000000' }] }, { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#0b434f' }, { lightness: 25 }] }, { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{ color: '#000000' }] }, { featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{ color: '#0b3d51' }, { lightness: 16 }] }, { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: '#000000' }] }, { elementType: 'labels.text.fill', stylers: [{ color: '#ffffff' }] }, { elementType: 'labels.text.stroke', stylers: [{ color: '#000000' }, { lightness: 13 }] }, { featureType: 'transit', stylers: [{ color: '#146474' }] }, { featureType: 'administrative', elementType: 'geometry.fill', stylers: [{ color: '#000000' }] }, { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#144b53' }, { lightness: 14 }, { weight: 1.4 }] }]
        var BLUE_style = [{ featureType: 'water', stylers: [{ color: '#46bcec' }, { visibility: 'on' }] }, { featureType: 'landscape', stylers: [{ color: '#f2f2f2' }] }, { featureType: 'road', stylers: [{ saturation: -100 }, { lightness: 45 }] }, { featureType: 'road.highway', stylers: [{ visibility: 'simplified' }] }, { featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] }, { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#444444' }] }, { featureType: 'transit', stylers: [{ visibility: 'off' }] }, { featureType: 'poi', stylers: [{ visibility: 'off' }] }]

        var mapType = new google.maps.StyledMapType(eval(userStyle + '_style'), { name: userStyle });
        map.mapTypes.set(userStyle, mapType);
        map.setMapTypeId(userStyle);
    
}

function createGislayerSpinner() {

    var opts = {
        lines: 15 // The number of lines to draw
    , length: 0 // The length of each line
    , width: 13 // The line thickness
    , radius: 30 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: ['#3E606F', '#193441'] // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 66 // Afterglow percentage
    , fps: 15 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '45%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning

    }
    var target = document.getElementById('layerspinner')
    var spinner = new Spinner(opts).spin(target);
}

/*-------------------------------TYPEAHEAD SEARCH FUNCTIONALITY--------------------------------*/
function enableTypeahead(){
/* Highlight search box text on click */
$("#filtersearchbox").click(function () {
    $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#filtersearchbox").keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
    }
});

var agenciesBH = new Bloodhound({
  name: "Agencies",
  datumTokenizer: function (d) {
    return Bloodhound.tokenizers.whitespace(d.name);
  },
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  local: agenciesSearch,
  limit: 10
});

agenciesBH.initialize();

  /* instantiate the typeahead UI */
$("#filtersearchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
}, {
    name: "Agencies",
    displayKey: "name",
    source: agenciesBH.ttAdapter(),
    templates: {
        header: "<h4 class='typeahead-header'>&nbsp;Agencies</h4>",
        suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
}).on("typeahead:selected", function (obj, datum) {

    if (datum.source === "Agencies") {

        //console.log("THIS IS THE PICKED ELEMENT");
        //console.log(datum);

        clearMap();

        getEntityByID(datum.id);

      //if (!map.hasLayer(museumLayer)) {
      //  map.addLayer(museumLayer);
      //}
      //map.setView([datum.lat, datum.lng], 17);
      //if (map._layers[datum.id]) {
      //  map._layers[datum.id].fire("click");
      //}
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");

}

/*
===================================================================================
The following code must be wrapped in a new custom javascript library, for example
"utilities.js"
*/

$.extend({
    keys: function (obj) {
        var a = [];
        $.each(obj, function (k) { a.push(k) });
        return a;
    }
})





// Source:
// https:\//github.com/jawj/OverlappingMarkerSpiderfier
function loadSpiderfy() {

    oms = new OverlappingMarkerSpiderfier(map);

    oms.addListener('click', function (marker) {
        infoWindow.setContent(marker.desc);
        infoWindow.open(map, marker);
    });

    oms.addListener('spiderfy', function (markers) {
        //for (var i = 0; i < markers.length; i++) {
        //    markers[i].setIcon(iconWithColor(spiderfiedColor));
        //    markers[i].setShadow(null);
        //}
        infoWindow.close();
    });

    //oms.addListener('unspiderfy', function (markers) {
    //    for (var i = 0; i < markers.length; i++) {
    //        markers[i].setIcon(iconWithColor(usualColor));
    //        markers[i].setShadow(shadow);
    //    }
    //});
    

}


function addSpiderfyData(data) {

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < data.length; i++) {
        var datum = data[i];
        var loc = new google.maps.LatLng(datum.geometry.coordinates[1], datum.geometry.coordinates[0]);
        bounds.extend(loc);
        var marker = new google.maps.Marker({
            position: loc,
            title: datum.properties.entityName,
            map: map,
            icon: getLayerIcon(datum.properties.agency)
            //icon: getLayerSymbol(datum.properties.agency)
        });
        marker.desc = "["+i+"]"+datum.id + " - " + datum.properties.entityName;
        oms.addMarker(marker);
    }
    map.fitBounds(bounds);

    //featuresJson = JSON.parse(_nsarMainGeoJSON).features;
    //addSpiderfyData(featuresJson);

    
}

function clearSpiderfyMap(){

    for (var i = 0; i < oms.a.length; i++) {

        oms.a[i].setMap(null);

    }
}