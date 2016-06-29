/*BASEMAP*/
var map = null;
var viewportArea = null;
var currentZoom = null;
var currentCenter = null;

/*DATASOURCES*/
var _nsarMainGeoJSON = null;
var _nsarDetailGeoJSON = null;


/*FILTERS FROM DATA*/
var mapFiltersObj = {
    agency: {
        title: "Agency",
        elements:{}
    },
    tier1: {
        title: "Tier1",
        elements: {}
    },
    biosafetyLevel: {
        title: "Safety Level",
        elements: {}
    }
}

var agenciesSearch = [];

/* MAP ELEMENTS*/
var infoWindow = new google.maps.InfoWindow({
    content: document.getElementById("infobox"),//createInfoboxDiv(),
    pixelOffset: new google.maps.Size(0,-30)
});
var infoboxColor = '#99B3CC';

var infoBox = new InfoBox({
    alignBottom:true,
    content: "",
    disableAutoPan: false,
    maxWidth: "300px",
    pixelOffset: new google.maps.Size(-15,-30),
    zIndex: null,
    closeBoxMargin: "5px 0px 0px 260px",
    //closeBoxURL: "http://www.eucornea.org/wp-content/themes/EUCORNEA2014/images/close-button.png",
    closeBoxURL:"http://cdn.bernell.com/images/close_button.png",
    infoBoxClearance: new google.maps.Size(20, 20),
    isHidden: false,
	pane: "floatPane",
    enableEventPropagation: false
});

/*EVENTS FLAGS*/
var updateEntities = true;
//This flag is used to handle the #safetlevels filter
var allSafetyBoolean = true;


/* UI VARIABLES*/
var featureList;
var circleMarker = null;


function loadMapData() {

    getNsarMapData();
    //loadGeoJSON(dummyGeoJSON);
   // MUST ENABLE THIS METHOD WHENEVER FILTERS ARE TO BE DYNAMICALLY CREATED FROM THE LOADED DATA.
}


/* DATA RELATED FUNCTION*/

function addGeoJSON(geoJsonObj) {

    /*
   To LOAD a LOCAL file or URL  use loadGeoJson(<datasource>)
   To DISPLAY a GeoJSON variable or OBJECT use addGeoJson(<URL>) 
   */
    

    map.data.setStyle(function (feature) {
        var type = feature.getProperty("agency");
        return {
            icon: getLayerIcon(type)
        };
    });


    geoJsonData = map.data.addGeoJson(geoJsonObj);


    map.data.addListener('click', function (event) {

        /*
        entityHtml = '<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
                                        event.feature.getProperty("NAME") + "<br/>\
                                        Address: " + event.feature.getProperty("ADDRESS1") + "<br/>\
                                        City: " + event.feature.getProperty("CITY") + "<br/>\
                                        URL: " + event.feature.getProperty("URL") + "<br/>\
                                        Agency: " + event.feature.getProperty("agency") + "<br/>\
                                        Tier: " + event.feature.getProperty("tier1") + "<br/>\
                                        Safety: " + event.feature.getProperty("biosafetyLevel") + "<br/>\
                                        </div>" ;
        */

        if (mobileDevice) {

            $("#feature-title").html(event.feature.getProperty("org_nm"));
            $("#feature-info").html('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
                '<br/><b>Org ID:' + event.feature.S +'</b>'+
                '<br/>Agency:' + event.feature.getProperty("agency") +
                '<br/>Tier1:' + event.feature.getProperty("tier1") +
                '<br/>Organization:' + event.feature.getProperty("org_nm") +
                '<br/>RO:' + event.feature.getProperty("ro") +
                '<br/>Address:' + event.feature.getProperty("strt_adrs") +
                '<br/>City:' + event.feature.getProperty("cty_nm") +
                '<br/>State:' + event.feature.getProperty("st_cd") +
                '<br/>ZipCode:' + event.feature.getProperty("zip_cd") +
                "<br/><br/><input id='entityMoreDetailBtnModal' type='button' class='btn btn-default btn-xs' onclick='javascript:getViewMoreDetailsModal(" + event.feature.S + ")' value='View More Details'/> " +
                '</div>');

            $("#featureModal").modal("show");

        } else {

            $('#entitytab a[href="#entitylist"]').tab('show');

            if (infoBox.getVisible()) {

                infoBox.close();
                var infoboxDiv = createInfoboxDiv();
                updateInfoboxContent(infoboxDiv, event);

            } else {

                var infoboxDiv = createInfoboxDiv();
                updateInfoboxContent(infoboxDiv, event);

            }



         }

    });

    openEntitiesTab("entities", $('[href=#entities]').parent());

}

function getNsarMapData() {
    $.ajax({
        //url: "/api/Nsar/GetNsarMapData",
        url:"data/DummyData.geojson",
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data);
            //if (data.Result == "SUCCESS") {       //------------IF

                $.each(data.features, function (i, item) {    //------------EACH

                    agenciesSearch.push({

                        name: item.properties.NAME,
                        //address: item.properties.st_cd,
                       // id: item.orgId,
                        source: "Agencies"
                    });
                });

                _nsarMainGeoJSON = JSON.stringify(data);           // ------------ JSON PARSE

            //    _nsarMainGeoJSON = JSON.stringify(data.MainEntity);
           //     _nsarDetailGeoJSON = JSON.stringify(data.DetailEntity);
                //  _nsarMainGeoJSON = JSON.stringify(data);
                if (getFiltersFromData()) {
                    //console.log("GOT FILTER DATA");

                };

                loadSelectPicker();
                enableTypeahead();
                $("#layerspinner").css('visibility', 'hidden');

                initialView();

            // }                                 //------------IF



        },
        error: function (msg) {
            alert('ERROR');
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
//       applyLinqFilter(getSelectedFilter());
function applyLinqFilter(filterObj) {
    console.log(filterObj);
    if (($('#agencyform').find('input[name=agency]:checked').length != 0)&&
        ($('#tierform').find('input[name=tier]:checked').length != 0)) {

        var agencyQuery = (filterObj.agency.length == 1 ? "$.properties.agency == '" + filterObj.agency[0] + "'" : "1==1");
        var tierQuery = (filterObj.tier.length == 1 ? "$.properties.tier1 == '" + filterObj.tier[0] + "'" : "1==1");

        var queryResult = Enumerable.From(JSON.parse(_nsarMainGeoJSON).features)
            //.Where("$.properties.agency == 'CDC' && $.properties.tier1 == 'No'")
            .Where(agencyQuery + " && " + tierQuery)
            //.Where(function (x) {
            //    if (filterObj.safety.length == 1 && filterObj.safety[0] == 'All') return true
            //    else return ((filterObj.safety).indexOf(x.properties.biosafetyLevel) > -1 ? true : false)
            //})
            //.Contains("$.properties.biosafetyLevel","$.lista")
            .OrderBy("$.properties.entityName")
            //.Select("$.properties.entityName + ':' + $.properties.agentCategory")
            .Select("$")
            .ToArray();

        //console.log(queryResult);

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
                    maxBoundArea = bound;
                    bound.extend(new google.maps.LatLng(queryResult[i].geometry.coordinates[1], queryResult[i].geometry.coordinates[0]));
                    // OTHER CODE
                }
                //console.log(bound.getCenter());
                //map.setCenter(bound.getCenter());
                map.fitBounds(bound);
                
                if (map.getZoom() > 9) map.setZoom(9); //Commented MAY27
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


    //console.log(queryResult);

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

        map.setZoom(10);
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
    controlDiv.innerHTML = "<div class='modal-content' style='margin-top:" + window.outerHeight / 3 + "px;padding:15px;background:rgba(0, 0, 0, 0.6)'>\
                                <h4 style ='color:white' >NO RESULTS FOUND</h4><center>\
                                <h5 style ='color:white'>Please Search Again</h5></center>\
                            </div>";
    //style = 'color:#B24219'
    //style = 'color:#FF5F23'
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
}

function createInfoboxDiv() {

    console.log(1);

    var div = document.createElement('div');
    div.id = "infobox";

    var divtitle = document.createElement('div');
    divtitle.id = "infotitle";

    var divcontent = document.createElement('div');
    divcontent.id = "infocontent";

    var divfooter = document.createElement('div');
    divfooter.id = "infofooter";

    $(div).html(divtitle);
    $(divtitle).after(divcontent);
    $(divcontent).after(divfooter);

    //console.log(2);
    //console.log(div)

    return div;
}

function updateInfoboxContent(objDiv,event) {

    

    console.log(3);
   
    if ('feature' in event) {
        var localEvent = event.feature;
    } else {
        var localEvent = event;
    }

    console.log(localEvent);

    result1 = $(objDiv).find('#infotitle').length;
    result2 = $(objDiv).find('#infocontent').length;



    $(objDiv).find('#infotitle').html('<div><b>' + localEvent.getProperty("org_nm") + '</b></div>');


    $(objDiv).find('#infocontent').html('<p>' + "\
                            Agency: " + localEvent.getProperty("agency") + "<br/>\
                            Tier1: " + localEvent.getProperty("tier1") + "<br/>\
                            Organization: " + localEvent.getProperty("org_nm") + "<br/>\
                            RO: " + localEvent.getProperty("ro") + "<br/>\
                            Address: " + localEvent.getProperty("strt_adrs") + "<br/>\
                            City: " + localEvent.getProperty("cty_nm") + "<br/>\
                            State: " + localEvent.getProperty("st_cd") + "<br/>\
                            Zipcode: " + localEvent.getProperty("zip_cd") + "<br/>\
                            </p>");

    $(objDiv).find('#infofooter').html("<br/><a id='entityMoreDetailBtn' type='button' class='btn btn-default btn-xs pull-right' onclick='javascript:getViewMoreDetails(" + localEvent.getId() + ")' > View More Details </a>");

    //console.log("THIS IS THE INFOBOX ");
    //console.log(document.getElementById('infobox'));
    //console.log("THIS IS THE OBJ DIV");
    //console.log(objDiv);

    infoBox.setContent(objDiv);

    var anchor = new google.maps.MVCObject();
    anchor.set("position", new google.maps.LatLng(localEvent.getGeometry().get().lat(), localEvent.getGeometry().get().lng()));
    anchor.getPosition = function () { return this.position; }

    infoBox.open(map, anchor);
    
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
    var mapCenter = map.getCenter();
    var mapZoom = map.getZoom();
    
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


    var bboxFrameObj = [

   { lat: bboxPoints.ymin, lng: bboxPoints.xmax },
   { lat: bboxPoints.ymax, lng: bboxPoints.xmax },
   { lat: bboxPoints.ymax, lng: bboxPoints.xmin },
   { lat: bboxPoints.ymin, lng: bboxPoints.xmin },
   { lat: bboxPoints.ymin, lng: bboxPoints.xmax }

        ];


    

    
    if (viewportArea != null) {
        viewportArea.setMap(null);
    }
    

   
/*
     bboxFrameObj = [xmin

{ lat: 5, lng: 5 },
{ lat: -5, lng:5},
{ lat: -5, lng: bboxPoints.xmin },
{ lat: 5, lng: -5 },
{ lat: bboxPoints.ymin, lng: bboxPoints.xmax }

    ];
    */

    dummyVarCoords = bboxFrameObj;

    viewportArea = new google.maps.Polygon({
        paths: bboxFrameObj,
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 5,
        fillColor: '#8EDE88',
        fillOpacity: 0.2
    });

    
    //If we need to visually check the current viewportArea, add the next line

    //viewportArea.setMap(map);
    
    return viewportArea;

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
        case 'circleMarker':
            return {

                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                strokeColor: 'DarkCyan',
                strokeWeight: 0.5,
                fillColor: '#ffb900',
                fillOpacity: 0.7
                //anchor: new google.maps.Size(0,20)

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

        var zoomFlag = (map.getZoom() < 4);

        if (isOnViewport || zoomFlag) {

            content.append('<tr class="feature-row"  id=' + event.getId() + ' lat="' + event.getGeometry().get().lat() + '" lng="' + event.getGeometry().get().lng() + '">\
                                    <td style="vertical-align: middle;"><img width="16" height="18" src="' + getLayerIcon(event.getProperty("agency")) + '"></td>\
                                                            <td class="feature-name">' + event.getProperty("org_nm") + ' - <b>' + event.getProperty("agency") + '</b> (' + event.getProperty("cty_nm") + ',' + event.getProperty("st_cd") + ')</td>\
                                                            <td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
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

function initialView() {


    var filterObj = getSelectedFilter();
    //applyFilterToDatasource(filterObj);
    applyLinqFilter(filterObj);

}


/* EVENT RELATED FUNCTIONS*/

function loadEvents() {

    google.maps.event.addListener(map, 'dragend', function () {

        /*
        if (!!getActivePane()) {

            if (getActivePane() == "#entities")
                updateEntityPanel();
        }
        */
        
    });

    google.maps.event.addListener(map, 'zoom_changed', function () {

        var zoom = map.getZoom();
        //[MAP LAYERS]
        rsgislayer.updateCheckboxDisplay(zoom);
        if (refreshMapLayers) {
            rsgislayer.onMonitoringGisLayers('dragend');
            refreshMapLayers = true;
        }
        refreshMapLayers = true;

        /*
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

        if (infoBox.getVisible()) {
            infoBox.setVisible(false);
        }

        */
    });

    google.maps.event.addListener(infoBox, 'domready', function () {


       
        //Source:http://enscrollplugin.com/
        //https://github.com/jstoudt/enscroll

        //Infobox Down Arrow 
        var triangle = document.createElement('div');
        triangle.id = 'triangle-down';
        svgTriangle = '<svg height="30" width="30">\
                        <polygon points="0,0 30,0 15,30" style="fill:'+infoboxColor+';stroke:0px transparent" />\
                        </svg>'
        $('#infobox').after(svgTriangle);


        $('#infobox').prev().css({ "position": "absolute", "z-index": "1000" });
        $('#infobox').css('background', infoboxColor);

        //Source https://github.com/malihu/malihu-custom-scrollbar-plugin
        $("#infocontent").mCustomScrollbar({
            theme: "dark"
        });

        $('#infocontent').outerHeight($('#infobox').outerHeight() - $('#infotitle').outerHeight() - 30);

        /*
        $('#infocontent').enscroll({
            //showOnHover: true,
            //verticalScrolling: true,
            clickTrackToScroll: false,
            propagateWheelEvent: false,
    });
    */
        
        
    });

    google.maps.event.addListener(map, 'idle', function () {


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


        if (!infoBox.getVisible()) {
            infoBox.setVisible(true);
        }

    });

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

        if (infoBox) {
            infoBox.close();
        }

    })

    $('[href="#filter"]').on('click', function () {

        $('.tt-input').each(function (i, item) {

            //console.log(item.value);
            item.value = "";
        });

        hideHighlightCircle();

    })

    $(document).on("click", ".feature-row", function (e) {

        hideHighlightCircle();

        if (infoBox) {
            infoBox.close();
        }

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
                    entityHtml = '<div>' +
                                            '<div>\
                                     <b style="float: left">Org ID: ' + selectedEntity.getId() + '</b><br/>\
                                     </div><p>'+"\
                                        Agency: " + selectedEntity.getProperty("agency") + "<br/>\
                                        Tier1: " + selectedEntity.getProperty("tier1") + "<br/>\
                                        Organization: " + selectedEntity.getProperty("org_nm") + "<br/>\
                                        RO: " + selectedEntity.getProperty("ro") + "<br/>\
                                        Street: " + selectedEntity.getProperty("strt_adrs") + "<br/>\
                                        City: " + selectedEntity.getProperty("cty_nm") + "<br/>\
                                        State: " + selectedEntity.getProperty("st_cd") + "<br/>\
                                        Zipcode: " + selectedEntity.getProperty("zip_cd") + "<br/></p>\
                                        \
                                        </div>";

                    if (mobileDevice) {

                        entityHtml += "<input id='entityMoreDetailBtn' type='button' class='btn btn-default btn-xs push-right' onclick='javascript:getViewMoreDetails(" + selectedEntity.getId() + ")' value='View More Details'/>";
                    }


                    $('#entitydetail').empty();
                    $('#entitydetail').append(entityHtml);

                    if (!mobileDevice) {

                        var infoboxDiv = createInfoboxDiv();
                        updateInfoboxContent(infoboxDiv, selectedEntity);

                    } else {

                        displayHighlightCircle(new google.maps.LatLng(selectedEntity.getGeometry().get().lat(), selectedEntity.getGeometry().get().lng()));

                        $('#entitytab a[href="#entitydetail"]').tab('show');

                        


                    }
                }

            });

            //updateEntities = false;
            map.setZoom(8);
            map.setCenter(objLatLng);


        }


    });

    $('#entitytab a[href="#entitylist"]').on('click', function (e) {

        if (!!currentZoom) {

            updateEntities = false;
            map.setZoom(currentZoom);
            map.setCenter(currentCenter);
            updateEntityPanel();
        }

        //Close any infoWindow()
        if (infoWindow) {
            infoWindow.close();
        }

        if (infoBox) {
            infoBox.close();
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

    $(document).on("mouseover", ".feature-row", function (e) {

        var objLatLng = new google.maps.LatLng({
            lat: parseFloat($(this).attr("lat")),
            lng: parseFloat($(this).attr("lng"))
        });
        var objName = $(".feature-row").find(".feature-name")[0].innerHTML;
        var objId = parseFloat($(this).attr("id"));

        if (objName != 'No Results') {

            displayHighlightCircle(objLatLng);
        }


    });

    $(document).on("mouseout", ".feature-row", function (e) {

        if (!mobileDevice) { hideHighlightCircle(); }
    });

    //$('#floatingControl').draggable();
    //$('#legend-wrapper').draggable();

    $('.collapsiblepanels').on('click', function (e) {

        /*
         * Sets the arrows ASC or DESC
         */
        if ($(this).find('i').hasClass('fa-sort-desc')) {

            var icon = $(this).find('i.fa-sort-desc');
            icon.removeClass("fa-sort-desc");
            icon.addClass("fa-sort-asc");

        } else if ($(this).find('i').hasClass('fa-sort-asc')) {
            var icon = $(this).find('i.fa-sort-asc')
            icon.removeClass("fa-sort-asc");
            icon.addClass("fa-sort-desc");
        } else {

        }


    });

    $('.collapse').on('shown.bs.collapse', function (e) {

        if (getActivePane() != "#maplayers") {

            var containerId = '#' + this.id;

            /*
             * Sets the Panel Body Max Height
             */

            var panelPosition = $(containerId).position();

            if (containerId != "#") {

                var panelbarHeight = $('.sidebar-content').height() -
                                     $('.sidebar-header').height() -
                                     panelPosition.top;

                if ($(containerId).children().height() > panelbarHeight) {

                    $(containerId).children().css('max-height', parseInt(Math.round(panelbarHeight) + 20) + "px");
                    $(containerId).children().css('overflow-y', "scroll");
                }
            }

        } else {
            var containerId = '#' + this.id;


            if (containerId == '#demogmaplayerset') {
                var obj = { color: blueColor + " !important;", html: "<b>US. CENSUS</b> | Right-click on any location to request Census info.", visibility: "visible" };
                rsgislayer.loadDisclaimer(obj);
            } else {
                var obj = { color: "gray", html: "Data for certain layers is available at the Country, State, and City level", visibility: "hidden" };
                rsgislayer.loadDisclaimer(obj);
            }

            var heightDiff = ($("#sidebar").height() - 130) - $("#maplayerscontainer").height();
            //alert(heightDiff);

            if (heightDiff < 0) {
                var newHeight = $("#sidebar").height() - 130;
                $("#maplayerscontainer").css("max-height", newHeight + "px");
                $("#maplayerscontainer").css("overflow-y", "auto");

            }
        }
    });

    $('.alertclosebtn').on('click', function (e) {

        e.stopPropagation();

        if ($('#alertcontainer').is(':visible'))
            $('#alertcontainer').css('display', 'none');
        else $('#alertcontainer').css('display', 'block');
    });

    $('.cdpboxclosebtn').on('click', function (e) {

        e.stopPropagation();

        if ($('.cdpcontrolbox-wrapper').is(':visible')) {
            $('.cdpcontrolbox-wrapper').css('display', 'none');
            rsgislayer.manageCDPmarker("", false);
        }
        else $('.cdpcontrolbox-wrapper').css('display', 'block');
    });

    sidebar.on('opening', function () {
        //alert(getActivePane());
        /* MapLayers Sidebar Height*/
        var heightDiff = ($("#sidebar").height() - 130) - $("#maplayerscontainer").height();
        //alert(heightDiff);

        if (heightDiff < 0) {
            var newHeight = $("#sidebar").height() - 130;
            $("#maplayerscontainer").css("max-height", newHeight + "px");
            $("#maplayerscontainer").css("overflow-y", "auto");

        }
    });

    rsgislayer.initGisDisplayStatus();

    /* $('.maplayersbtninput .btn').on('change', function(){
         rsgislayer.onMonitoringGisLayers('click');
     });
     */
    /* ENABLE OR DISABLE SINGLE CHECKBOX                                   */
    //$('.maplayersbtninput .btn').one('change', removeActiveChecked);
    $('.maplayersbtninput .btn').on('change', multipleLayerSelect);

    function removeActiveChecked() {

        var layerGroup = $(this).find('input').attr('name');
        var layerName = $(this).find('input').attr('id');

        $('.maplayersbtninput .btn').unbind('change');
        //console.log(times++);
        //console.log(this);
        //if (this.isDisabled) {
        if (this.disabled) {
            $('.maplayersbtninput .btn').unbind('change');

            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).children().prop('checked', false);

            }



        } else {


            // var layerGroup = $(this).find('input').attr('name');
            // var layerName = $(this).find('input').attr('id');

            //alert(layerName);

            var activeCheckboxes = $("#maplayerscontainer").children("").find("input[type='checkbox']")


            activeCheckboxes.each(function (e) {


                if ($(this).attr('id') != layerName && $(this).prop("checked")) {

                    $(this).prop("checked", false);
                    $(this).parent().removeClass('active');
                    //rsgislayer.manageMaplayersDivTitle(false, "");
                }

            });
            /*
            if (layerGroup == 'demographic') {
                rsgislayer.clearCensusData();
                rsgislayer.onMonitoringGisLayers('click');
            }
            else {
                rsgislayer.clearCensusData();
                rsgislayer.onMonitoringGisLayers('click');
            }
            */
            rsgislayer.clearCensusData();
            rsgislayer.onMonitoringGisLayers('click');


            $('.maplayersbtninput .btn').one('change', removeActiveChecked);

            //if (mobileDevice) {
            //    mapcontrol.close();
            //} else if (isTabletDevice) {
            //    sidebar.close();
            //}
        }
    };

    function multipleLayerSelect() {

        var layerGroup = $(this).find('input').attr('name');
        var layerName = $(this).find('input').attr('id');

        if (layerGroup == 'demographic') {
            $('.maplayersbtninput .btn').one('change', removeActiveChecked);
            rsgislayer.clearCensusData();
        }
        rsgislayer.onMonitoringGisLayers('click');


        //if (mobileDevice) {
        //    mapcontrol.close();
        //} else if (isTabletDevice) {
        //    sidebar.close();
        //}
    };
    rsgislayer.enableGisEventListeners();
    rsgislayer.initGisDisplayStatus();
    //$('.collapsiblepanels').on('click', function (e) {

    //    /*
    //     * Sets the arrows ASC or DESC
    //     */
    //    if ($(this).find('i').hasClass('fa-sort-desc')) {

    //        var icon = $(this).find('i.fa-sort-desc');
    //        icon.removeClass("fa-sort-desc");
    //        icon.addClass("fa-sort-asc");

    //    } else if ($(this).find('i').hasClass('fa-sort-asc')) {
    //        var icon = $(this).find('i.fa-sort-asc')
    //        icon.removeClass("fa-sort-asc");
    //        icon.addClass("fa-sort-desc");
    //    } else {

    //    }



    //});

    //$('.collapse').on('shown.bs.collapse', function (e) {

    //    if (getActivePane() != "#maplayers") {

    //        var containerId = '#' + this.id;

    //        /*
    //         * Sets the Panel Body Max Height
    //         */

    //        var panelPosition = $(containerId).position();

    //        if (containerId != "#") {

    //            var panelbarHeight = $('.sidebar-content').height() -
    //                                 $('.sidebar-header').height() -
    //                                 panelPosition.top;

    //            if ($(containerId).children().height() > panelbarHeight) {

    //                $(containerId).children().css('max-height', parseInt(Math.round(panelbarHeight) + 20) + "px");
    //                $(containerId).children().css('overflow-y', "scroll");
    //            }
    //        }

    //    } else {
    //        var containerId = '#' + this.id;


    //        if (containerId == '#demogmaplayerset') {
    //            var obj = { color: blueColor + " !important;", html: "<b>US. CENSUS</b> | Right-click on any location to request Census info.", visibility: "visible" };
    //            rsgislayer.loadDisclaimer(obj);
    //        }

    //        var heightDiff = ($("#sidebar").height() - 130) - $("#maplayerscontainer").height();
    //        //alert(heightDiff);

    //        if (heightDiff < 0) {
    //            var newHeight = $("#sidebar").height() - 130;
    //            $("#maplayerscontainer").css("max-height", newHeight + "px");
    //            $("#maplayerscontainer").css("overflow-y", "auto");

    //        }
    //    }
    //});

    //sidebar.on('opening', function () {
    //    //alert(getActivePane());
    //    /* MapLayers Sidebar Height*/
    //    var heightDiff = ($("#sidebar").height() - 130) - $("#maplayerscontainer").height();
    //    //alert(heightDiff);

    //    if (heightDiff < 0) {
    //        var newHeight = $("#sidebar").height() - 130;
    //        $("#maplayerscontainer").css("max-height", newHeight + "px");
    //        $("#maplayerscontainer").css("overflow-y", "auto");

    //    }
    //});

    //rsgislayer.initGisDisplayStatus();

    ///* $('.maplayersbtninput .btn').on('change', function(){
    //     rsgislayer.onMonitoringGisLayers('click');
    // });
    // */
    ///* ENABLE OR DISABLE SINGLE CHECKBOX                                   */


    //$('.maplayersbtninput .btn').one('change', removeActiveChecked);

    //function removeActiveChecked() {
    //    $('.maplayersbtninput .btn').unbind('change');
    //    //console.log(times++);
    //    //console.log(this);
    //    //if (this.isDisabled) {
    //    if (this.disabled) {
    //        $('.maplayersbtninput .btn').unbind('change');

    //        if ($(this).hasClass('active')) {
    //            $(this).removeClass('active');
    //            $(this).children().prop('checked', false);

    //        }

    //        $('.maplayersbtninput .btn').one('change', removeActiveChecked);

    //    } else {


    //        var layerGroup = $(this).find('input').attr('name');
    //        var layerName = $(this).find('input').attr('id');

    //        //alert(layerName);

    //        var activeCheckboxes = $("#maplayerscontainer").children("").find("input[type='checkbox']")


    //        activeCheckboxes.each(function (e) {


    //            if ($(this).attr('id') != layerName && $(this).prop("checked")) {

    //                $(this).prop("checked", false);
    //                $(this).parent().removeClass('active');
    //            }

    //        });
    //        /*
    //        if (layerGroup == 'demographic') {
    //            rsgislayer.clearCensusData();
    //            rsgislayer.onMonitoringGisLayers('click');
    //        }
    //        else {
    //            rsgislayer.clearCensusData();
    //            rsgislayer.onMonitoringGisLayers('click');
    //        }
    //        */
    //        rsgislayer.clearCensusData();
    //        rsgislayer.onMonitoringGisLayers('click');


    //        $('.maplayersbtninput .btn').one('change', removeActiveChecked);

    //        //if (mobileDevice) {
    //        //    mapcontrol.close();
    //        //} else if (isTabletDevice) {
    //        //    sidebar.close();
    //        //}
    //    }
    //};

    ///*-------------------------------------------------------*/
    //rsgislayer.enableGisEventListeners();

    //rsgislayer.initGisDisplayStatus();

}



function displayHighlightCircle(position) {

    //console.log(circleMarker == null);
    if (circleMarker == null) {
        circleMarker = new google.maps.Marker({

            map: map,
            position: position,
            icon: getLayerSymbol("circleMarker")
        });

    } else {
        circleMarker.setPosition(position);
        circleMarker.setVisible(true);
    }

}

function hideHighlightCircle() {

    //console.log(circleMarker != null);
    if (circleMarker != null) {

        circleMarker.setVisible(false);
    }
}

function setMapColors(userStyle) {

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
    , radius: 40 // The radius of the inner circle
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



//https://github.com/jawj/OverlappingMarkerSpiderfier


function getViewMoreDetails(choosenOrgId) {

    var mainResult = Enumerable.From(JSON.parse(_nsarMainGeoJSON).features)
        .Where("$.id ==" + choosenOrgId)
        .Select("$.properties")
        .ToArray();

    var objMain = mainResult[0];

    var mainHtml = '<div>' +
                                            '<div>\
                                     <b style="float: left">Org ID: ' + choosenOrgId + '</b><br/>\
                                     </div><p>'+ "\
                                        Agency: " + objMain.agency + "<br/>\
                                        Tier1: " + objMain.tier1 + "<br/>\
                                        Organization: " + objMain.org_nm + "<br/>\
                                        RO: " + objMain.ro + "<br/>\
                                        Street: " + objMain.strt_adrs + "<br/>\
                                        City: " + objMain.cty_nm + "<br/>\
                                        State: " + objMain.st_cd + "<br/>\
                                        Zipcode: " + objMain.zip_cd + "<br/></p>\
                                        \
                                        </div>";

    var detailResult = Enumerable.From(JSON.parse(_nsarDetailGeoJSON))
    .Where("$.orgId ==" + choosenOrgId)
    .Select("$")
    .ToArray();

    var objDetail = detailResult[0];
    //console.log(objDetail);
    var detailHtml = '<div id="entitymoredetail">' +
                'Agents:' + objDetail.countAgents +
                '<br/>E-mail:' + objDetail.email +
                '<br/>Last Inspection Date:' + objDetail.lastInspectionDate +
                '<br/>Level 4:' + objDetail.level4 +
                '<br/>Phone:' + objDetail.phone +
                '</div>';

    if (mobileDevice) {
        if ($("#entityMoreDetailBtn").length == 1) {
            $("#entityMoreDetailBtn").remove();
        }
            detailHtml += "<br/><input id='entityLessDetailBtn' type='button' class='btn btn-default btn-xs push-right' onclick='javascript:getViewLessDetails(" + choosenOrgId + ")' value='View Less Details'/>";
        
        
    }

    //1) Open Detail Tabs
    openEntitiesTab("entities", $('[href=#entities]').parent());
    $('#entitytab a[href="#entitydetail"]').tab('show');

    //2) Append the More Detail Info and Info
    $("#entitydetail").html(mainHtml);
    $('#entitydetail').append(detailHtml);
    /*
    if ($("#entitymoredetail").length == 0) {
        $('#entitydetail').append(detailHtml);

    } else {
        $('#entitymoredetail').empty();
        $('#entitymoredetail').append(detailHtml);

    }
    */
}

function getViewLessDetails(choosenOrgId) {

    $("#entitymoredetail").remove();
    $("#entityLessDetailBtn").remove();
    //entityLessDetailBtn
    var entityHtml = "<br/><input id='entityMoreDetailBtn' type='button' class='btn btn-default btn-xs push-right' onclick='javascript:getViewMoreDetails(" + choosenOrgId + ")' value='View More Details'/>";
    $("#entitydetail").after(entityHtml);

}

function getViewMoreDetailsModal(choosenOrgId) {

    var mainResult = Enumerable.From(JSON.parse(_nsarMainGeoJSON).features)
        .Where("$.id ==" + choosenOrgId)
        .Select("$.properties")
        .ToArray();

    var objMain = mainResult[0];

    var mainHtml = '<div>' +
                                            '<div>\
                                     <b style="float: left">Org ID: ' + choosenOrgId + '</b><br/>\
                                     </div><p>'+ "\
                                        Agency: " + objMain.agency + "<br/>\
                                        Tier1: " + objMain.tier1 + "<br/>\
                                        Organization: " + objMain.org_nm + "<br/>\
                                        RO: " + objMain.ro + "<br/>\
                                        Street: " + objMain.strt_adrs + "<br/>\
                                        City: " + objMain.cty_nm + "<br/>\
                                        State: " + objMain.st_cd + "<br/>\
                                        Zipcode: " + objMain.zip_cd + "<br/></p>\
                                        \
                                        </div>";

    var detailResult = Enumerable.From(JSON.parse(_nsarDetailGeoJSON))
    .Where("$.orgId ==" + choosenOrgId)
    .Select("$")
    .ToArray();

    var objDetail = detailResult[0];
    //console.log(objDetail);
    var detailHtml = '<div id="entitymoredetail">' +
                'Agents:' + objDetail.countAgents +
                '<br/>E-mail:' + objDetail.email +
                '<br/>Last Inspection Date:' + objDetail.lastInspectionDate +
                '<br/>Level 4:' + objDetail.level4 +
                '<br/>Phone:' + objDetail.phone +
                '</div>';


    if ($("#entityMoreDetailBtnModal").length == 1) {
        $("#entityMoreDetailBtnModal").remove();
    }
        
        detailHtml += "<input id='entityLessDetailBtnModal' type='button' class='btn btn-default btn-xs' onclick='javascript:getViewLessDetailsModal(" + choosenOrgId + ")' value='View Less Details'/>";


    

    //$("#feature-info").append(detailHtml);
        $("#feature-info").html(mainHtml+'<br/>'+detailHtml);
    
}

function getViewLessDetailsModal(choosenOrgId) {

    $("#entitymoredetail").remove();
    $("#entityLessDetailBtnModal").remove();
    //entityLessDetailBtn
    var entityHtml = "<input id='entityMoreDetailBtnModal' type='button' class='btn btn-default btn-xs' onclick='javascript:getViewMoreDetailsModal(" + choosenOrgId + ")' value='View More Details'/>";
    $("#feature-info").append(entityHtml);
}