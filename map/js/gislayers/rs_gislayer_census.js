//var map = null;
var highDensZoomThreshold = 12;//city scale
var midDensZoomThreshold  = 8;//state or country
var lowDensZoomThreshold = 4;//continent worldwide

var disclaimerMain = "Data for certain layers is available at the Country, State and City level.";
var geojsonArray = null;
var censusDataArray = null;
var censusPolyArray = [];
var infoWindowFlag = false;
var infowindowsArray = [];

var inputParameters = [
    {
    //----------------------------------------------------------------------------------------------------------------------------------------------
    // INFRASTRUCTURE
        layerName: "airport",
        urlEndpoint: "http://services.nationalmap.gov/arcgis/rest/services/transportation/MapServer",
        layerId: 1,
        outfieldsLabels:["Name", "Airport Code", "Airport Type", "Info Source", "Source Description"],
        inputOutfields: ["NAME", "FAA_AIRPORT_CODE", "AIRPORT_CLASS","SOURCE_ORIGINATOR", "SOURCE_DATADESC"],
        iconPath :"/rs/map/Content/gislayers/airportB.png",
        whereString: "",
        coverage:"local",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag:false
    },
    {
        layerName: "hospital",
        urlEndpoint: "http://services.nationalmap.gov/arcgis/rest/services/structures/MapServer",
        layerId: 3,
        outfieldsLabels: ["Name", "Address", "City", "State", "Zipcode", "Info Source", "Source Description"],
        inputOutfields: ["NAME", "ADDRESS", "CITY", "STATE", "ZIPCODE", "SOURCE_ORIGINATOR", "SOURCE_DATADESC"],
        iconPath: '/rs/map/Content/gislayers/hospitalB.png',
        whereString: "",
        coverage:"local",
        geomType: "point",
        zoomControl: true,
        zoomThreshold:highDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
    },
    {
        layerName: "ambulance",
        urlEndpoint: "http://services.nationalmap.gov/arcgis/rest/services/structures/MapServer",
        layerId: 5,
        outfieldsLabels: ["Name", "Address", "City", "State", "Zipcode", "Info Source", "Source Description"],
        inputOutfields: ["NAME", "ADDRESS", "CITY", "STATE", "ZIPCODE", "SOURCE_ORIGINATOR", "SOURCE_DATADESC"],
        iconPath: '/rs/map/Content/gislayers/ambulance.png',
        whereString: "",
        coverage: "local",
        geomType: "point",
        zoomControl: true,
        zoomThreshold:highDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
    },
    
    {
        layerName: "fire_station",
        urlEndpoint: "http://services.nationalmap.gov/arcgis/rest/services/structures/MapServer",
        layerId: 7,
        outfieldsLabels: ["Name", "Address", "City", "State", "Zipcode", "Info Source", "Source Description"],
        inputOutfields: ["NAME", "ADDRESS", "CITY", "STATE", "ZIPCODE", "SOURCE_ORIGINATOR", "SOURCE_DATADESC"],
        iconPath: '/rs/map/Content/gislayers/firestation.png',
        whereString: "",
        coverage: "local",
        geomType: "point",
        zoomControl: true,
        zoomThreshold:highDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
    },

    {   
        layerName: "police",
        urlEndpoint: "http://services.nationalmap.gov/arcgis/rest/services/structures/MapServer",
        layerId: 6,
        outfieldsLabels: ["Name", "Address", "City", "State", "Zipcode", "Info Source", "Source Description"],
        inputOutfields: ["NAME", "ADDRESS", "CITY", "STATE", "ZIPCODE","SOURCE_ORIGINATOR", "SOURCE_DATADESC"],
        iconPath: '/rs/map/Content/gislayers/police.png',
        whereString: "",
        coverage: "local",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: highDensZoomThreshold,
        layerObject: null,
        layerObject: null,
        visibleFlag: false
    },
    //----------------------------------------------------------------------------------------------------------------------------------------------
    // HAZARDS
    {
        layerName: "severe",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        layerId: 12,
        outfieldsLabels:["Category"     , "Effective since: ", "Expires on: ","More Info."],
        inputOutfields: ["event", "effective"        , "expires"     , "web" ],
        iconPath: '',
        whereString: "",
        coverage:"US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "warning",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        layerId: 13,
        outfieldsLabels: ["Category", "Effective since: ", "Expires on: ", "More Info."],
        inputOutfields:  ["event"            , "effective"       , "expires"     , "web" ],
        iconPath: '',
        whereString: "",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "watch",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        layerId: 14,
        outfieldsLabels: ["Category", "Effective since: ", "Expires on: ", "More Info."],
        inputOutfields: ["event", "effective", "expires", "web", ],
        iconPath: '',
        whereString: "",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "advisory",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        layerId: 15,
        outfieldsLabels: ["Category", "Effective since: ", "Expires on: ", "More Info."],
        inputOutfields: ["event", "effective", "expires", "web"],
        iconPath: '',
        whereString: "",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "hurricane",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        layerId: 5,
        outfieldsLabels: ["Type"    , "Name", "Movement", "Wind Speed","Date"     ,"More Info."],
        inputOutfields:  ["type", "name", "movement", "wind"      , "pubdate" ,"link"],
        iconPath: '/rs/map/Content/gislayers/hurricane.png',
        whereString: "",
        coverage:"global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "hurricaneobs",
        urlEndpoint: "http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Hurricane_Active/MapServer",
        layerId: 0,
        outfieldsLabels: ["Type"    , "Name", "Movement", "Wind Speed","Date"     ,"More Info."],
        inputOutfields:  ["type", "name", "movement", "wind"      , "pubdate" ,"link"],
        iconPath: '/rs/map/Content/gislayers/hurricane.png',
        whereString: "",
        coverage: "global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold:lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "hurricaneforecast",
        urlEndpoint: "http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Hurricane_Active/MapServer",
        layerId: 1,
        outfieldsLabels: ["Type"    , "Name", "Movement", "Wind Speed","Date"     ,"More Info."],
        inputOutfields:  ["type", "name", "movement", "wind"      , "pubdate" ,"link"],
        iconPath: '/rs/map/Content/gislayers/hurricane.png',
        whereString: "",
        coverage: "global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold:lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    

    {
        layerName: "flood",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        layerId: 0,
        outfieldsLabels: ["Status ", "Location", "Waterbody", "Stage", "Units", "Observation Time", "More Info."],
        inputOutfields:  ["Status"  , "Location", "Waterbody", "Stage", "Units", "ObsTime"         , "URL"       ],
        iconPath: '/rs/map/Content/gislayers/flood.png',
        whereString: "",
        coverage: "US",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "floodriver",
        urlEndpoint: "http://gis.srh.noaa.gov/ArcGIS/rest/services/FOP/MapServer",
        layerId: 0,
        outfieldsLabels : ["Outlook ", "Valid Time Range", "Start Time", "End Time"],
        inputOutfields  : ["outlook"   , "valid_time"     , "start_time", "end_time"],
        iconPath: '',
        whereString: "",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "usgaugeobserved",
        urlEndpoint: "http://gis.srh.noaa.gov/arcgis/rest/services/ahps_gauges/MapServer",
        layerId: 0,
        outfieldsLabels: ["Outlook ", "Valid Time Range", "Start Time", "End Time"],
        inputOutfields:  ["Status"   , "valid_time"      , "start_time", "end_time"],
        iconPath: '',
        whereString: "status='major' OR status='moderate' OR status='minor' OR status='action' ",
        coverage:"US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "usgaugeforecast",
        urlEndpoint: "http://gis.srh.noaa.gov/arcgis/rest/services/ahps_gauges/MapServer",
        layerId: 1,
        outfieldsLabels: ["Outlook ", "Valid Time Range", "Start Time", "End Time"],
        inputOutfields:  ["Status"   , "valid_time"      , "start_time", "end_time"],
        iconPath: '',
        whereString: "status='major' OR status='moderate' OR status='minor' OR status='action' ",
        coverage:"US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "firepoint",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        //urlEndpoint: "http:\//wildfire.cr.usgs.gov/ArcGIS/rest/services/geomac_dyn/MapServer/0",
        //urlEndpoint: "http:\//rmgsc.cr.usgs.gov/arcgis/rest/services/geomac_dyn/MapServer/",
        layerId: 10,
        outfieldsLabels:["Incident: "   , "Acres", "Contained [%]"   , "Discovery Date"       , "Report Data"   , "Cause"     , "More Info."],
        inputOutfields: ["incidentname" , "acres", "percentcontained", "firediscoverydatetime", "reportdatetime", "firecause" , "hotlink"   ],
        iconPath: '/rs/map/Content/gislayers/fire.png',
        whereString: "",
        coverage:"US",
        geomType: "point",
        zoomControl: true,
        zoomThreshold:midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "fireperimeter",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        //urlEndpoint: "http:\//wildfire.cr.usgs.gov/ArcGIS/rest/services/geomac_dyn/MapServer/1",
        //urlEndpoint: "http:\//rmgsc.cr.usgs.gov/arcgis/rest/services/geomac_dyn/MapServer/",
        layerId: 11,
        outfieldsLabels : ["Incident: ", "Acres"],
        inputOutfields  : ["fire_name" , "acres","objectid"],
        iconPath: '',
        whereString: "",
        coverage:"US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "earthquake",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        layerId: 3,
        outfieldsLabels: ["MAG"  , "Depth", "Location", "Date"   , "More Info."],
        inputOutfields:  ["magnitude", "depth", "location", "pubdate", "link"],
        iconPath: '/rs/map/Content/gislayers/earthquakes/earthquake',
        whereString: "magnitude > 4.5",
        coverage:"global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold:lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "usvolcano",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        layerId: 1,
        outfieldsLabels: ["Volcano: ","Alert Level", "Code"     , "Date"   ,"More Info." ],
        inputOutfields:  ["id"       , "alertlevel", "colorcode", "pubdate", "link"      ],
        iconPath: '/rs/map/Content/gislayers/usvolcanoes',
        whereString: "",
        coverage:"global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "othervolcano",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        layerId: 2,
        outfieldsLabels: ["Volcano: ", "Date"   , "More Info."],
        inputOutfields:  ["id"       , "pubdate", "link"],
        iconPath: '/rs/map/Content/gislayers/volcano.png',
        whereString: "",
        coverage:"global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    //----------------------------------------------------------------------------------------------------------------------------------------------
    // WEATHER
    {
        layerName: "cloud",
        urlEndpoint: "http:\//arthurhou.pps.eosdis.nasa.gov/ppshome/THORonline/KML/image/IR..kml",
        geomType: "kmz",
        zoomControl: false,
        zoomThreshold:1,
        layerObject: null,
        visibleFlag: false

    },
    {
        layerName: "precipitation",
        urlEndpoint: "http:\//arthurhou.pps.eosdis.nasa.gov/ppshome/THORonline/KML/image/03hr..kml",
        //urlEndpoint: "http:\//arthurhou.pps.eosdis.nasa.gov/ppshome/THORonline/KML/image/1day..kml",
        geomType: "kmz",
        zoomControl: false,
        zoomThreshold:1,
        layerObject: null,
        visibleFlag: false

    },

    {
        layerName: "temperature",
        urlEndpoint: "http://gis.ncdc.noaa.gov/arcgis/rest/services/cdo/ghcndms_obs/MapServer",
        layerId: 0,
        outfieldsLabels: ["AVG [°F]", "Station"],
        inputOutfields:  ["IMPERIAL", "STATION_NAME"],
        iconPath: '/rs/map/Content/gislayers/temperature.png',
        whereString: "",
        coverage: "global",
        geomType: "popup",
        zoomControl: false,
        zoomThreshold:1,
        layerObject: null,
        visibleFlag: false
        //query?where=STATION_ID="GHCND:USR0000SSV1"&f=pjson&outFields=*&returnGeometry=false
    },
        //----------------------------------------------------------------------------------------------------------------------------------------------
    // SOCIODECONOMIC
    {
        layerName: "sovi",
        urlEndpoint: "http://ec2-50-18-215-52.us-west-1.compute.amazonaws.com/arcgis/rest/services/nascience/pgclc_data/MapServer",
        layerId: 18,
        outfieldsLabels: ["SVI"],
        inputOutfields: ["SoVI"],
        iconPath: '',
        whereString: "",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: highDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "metrics",
        coverage: "global",
        geomType: "polygon2",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
    },
    {
        layerName: "uscensus",
        coverage: "us",
        geomType: "polygon2",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
},


];

/* [BEGIN]	Variables for point features that require filtering options for visualization*/

//var massiveVisibleRange = true;
/* [END]	-----------------------------------------------------------------------------*/

var currentGisLayersStatus = [];
var queryLayerCheckedBoxes = [];

var bbox = null;
var bboxPoints = {
    xmin: null,
    ymin: null,
    xmax: null,
    ymax: null
};
var frame = null;

var redColor = "#cc3300";
var blueColor = "#0073e6";
var grayColor = "#595959";

var rsgislayer = {

    hideGisLayerBeta: function (layer) {
        var localLayerVar = rsgislayer.getObjectByLayer(layer.layerName);

        if (localLayerVar.layerObject != null) {
            if (localLayerVar.geomType == 'kmz') {

                if (localLayerVar.layerObject) {
                    localLayerVar.layerObject.setMap(null);
                    localLayerVar.layerObject = null;
                }
                return true;
            }

            else if (localLayerVar.geomType == "point" || localLayerVar.geomType == "polygon" || localLayerVar.geomType == "polyline") {

                if (localLayerVar.layerObject.setVisLayerOff(localLayerVar.layerObject)) {

                    console.log("[DEBUG] - DELETING....." + localLayerVar.layerName);
                    localLayerVar.layerObject = null;
                    localLayerVar.visibleFlag = false;
                    return true;
                }

            }

            else if (localLayerVar.geomType == "popup") {
                //rsgislayer.showUserNotification("Temperature", "Detailed weather info disabled.");
                //rsgislayer.loadDisclaimer("<b>Temperature</b> | Detailed weather info disabled", { visibility: "visible", color: "visible" });
                var obj = { color: blueColor + " !important;", html: "<b>Temperature</b> | Detailed weather info disabled", visibility: "visible" };
                rsgislayer.loadDisclaimer(obj);
                return true;
            }

            else {

                //rsgislayer.showUserNotification($('label[for=' + layerId + "label" + ']').html(), "Developer's fault! <br> Hidden Method not Implemented.");
                //rsgislayer.loadDisclaimer($('label[for=' + layerId.layerName + "label" + ']').html() + "Developer's fault! <br> Hidden Method not Implemented.", { visibility: "visible", color: redColor + " !important;" });
                var obj = { color: redColor + " !important;", html: $('label[for=' + layerId.layerName + "label" + ']').html() + "Developer's fault! <br> Hidden Method not Implemented.", visibility: "visible" };
                rsgislayer.loadDisclaimer(obj);
                return false;
            }
        } else {
            return true;
        }


    },

    showGisLayerBeta: function (layer) {
        var localLayerVar = rsgislayer.getObjectByLayer(layer.layerName);
        var currentZoom = map.getZoom();

        //alert(localLayerVar.coverage);

        if (localLayerVar.geomType == 'kmz') {
            console.log("Displaying " + localLayerVar.layerName + "Layer");

            localLayerVar.layerObject = new google.maps.KmlLayer({
                url: localLayerVar.urlEndpoint,
                preserveViewport: true,
                clickable: false
            });
            localLayerVar.layerObject.setMap(map);

            rsgislayer.updateCurrentLayerStatus({ layerName: localLayerVar.layerName, displayStatus: true });
            return true;

            //} else if (localLayerVar.geomType == 'point' || localLayerVar.geomType == 'polygon' || localLayerVar.geomType == 'polyline') {
        } else if (localLayerVar.geomType == 'popup') {

            if (localLayerVar.layerName == 'temperature') {
                //$('.notificationmodal-body').html("Please double-click on any location \nto request detailed weather info.");
                //$("#modalNotification").modal("show");
                //rsgislayer.showUserNotification("Temperature", "Please double-click on any location to request detailed weather info.");
                //rsgislayer.loadDisclaimer("<b>Temperature</b> | Double-click on any location to request detailed weather info.", { visibility: "visible", color: blueColor + " !important;" });
                var obj = { color: blueColor + " !important;", html: "<b>Temperature</b> | Double-click on any location to request detailed weather info.", visibility: "visible" };
                rsgislayer.loadDisclaimer(obj);

                //rsgislayer.updateCurrentLayerStatus({ layerName: localLayerVar.layerName, displayStatus: true });
                return true;
            }
        } else if (localLayerVar.geomType == 'polygon2') {

        }
        else {

            if (localLayerVar.coverage == "local") {

                var country = getPointLocation(map.getCenter());
                console.log(country);


                if (country == 'US') {

                    if (currentZoom >= localLayerVar.zoomThreshold) {
                        localLayerVar.layerObject = new ArcgisLayer(map, localLayerVar, bboxPoints);
                        localLayerVar.layerObject.executeQuery(localLayerVar.layerObject);
                        localLayerVar.visibleFlag = true;
                        //rsgislayer.updateCurrentLayerStatus({ layerName: localLayerVar.layerName, displayStatus: true });
                        return true;

                    } else {

                        if (queryLayerCheckedBoxes.length != 0) {
                            rsgislayer.showGisLayerBeta(queryLayerCheckedBoxes.pop());
                        } else {
                            queryLayerCheckedBoxes.length = 0;

                        }
                        return true;
                    }
                    //*************************************** WORLDWIDE LOCATION ********************************************
                } else {
                    if (currentZoom >= localLayerVar.zoomThreshold) {

                        localLayerVar.layerObject = new GooglePlaceMarkers(map, localLayerVar);
                        localLayerVar.layerObject.getGooglePlace(bbox, localLayerVar.layerObject);
                        localLayerVar.visibleFlag = true;

                        return true;

                    } else {

                        if (queryLayerCheckedBoxes.length != 0) {
                            rsgislayer.showGisLayerBeta(queryLayerCheckedBoxes.pop());
                        } else {
                            queryLayerCheckedBoxes.length = 0;
                        }
                        return true;
                    }
                }
            } else if (localLayerVar.coverage == "global" || localLayerVar.coverage == "US") {


                if (currentZoom >= localLayerVar.zoomThreshold) {

                    //alert(localLayerVar.coverage + ": " + localLayerVar.layerName);

                    localLayerVar.layerObject = new ArcgisLayer(map, localLayerVar, bboxPoints);
                    localLayerVar.layerObject.executeQuery(localLayerVar.layerObject);
                    localLayerVar.visibleFlag = true;
                    //rsgislayer.updateCurrentLayerStatus({ layerName: localLayerVar.layerName, displayStatus: true });
                    return true;

                } else {

                    if (queryLayerCheckedBoxes.length != 0) {
                        rsgislayer.showGisLayerBeta(queryLayerCheckedBoxes.pop());
                    } else {
                        queryLayerCheckedBoxes.length = 0;

                    }
                    return true;
                }

            } else {
                //rsgislayer.showUserNotification($('label[for=' + layerId + "label" + ']').html(), "Data not available");
                //rsgislayer.loadDisclaimer("Developer's fault!<br>Data not available for " + $('label[for=' + layer.layerName + "label" + ']').html(), { visibility: "visible", color: redColor + " !important;" });

                //var obj = { color: redColor + " !important;", html: "Developer's fault!<br>Data not available for " + $('label[for=' + layer.layerName + "label" + ']').html(), visibility: "hidden" };
                var obj = { color: redColor + " !important;", html: "Data not available for " + $('label[for=' + layer.layerName + "label" + ']').html() + " in this area", visibility: "hidden" };
                rsgislayer.loadDisclaimer(obj);


                rsgislayer.updateCurrentLayerStatus({ layerName: localLayerVar.layerName, displayStatus: false });
                return false;
            }

        }

    },

    initGisDisplayStatus: function () {
        //console.log("1) initGisDisplayStatus()");

        currentGisLayersStatus = rsgislayer.getListGisLayerCheckboxes();
        rsgislayer.createGislayerSpinner();

        var obj = { color: "gray", html: "Data for certain layers is available at the Country, State, and City level", visibility: "hidden" };
        rsgislayer.loadDisclaimer(obj);
        //rsgislayer.loadDisclaimer(disclaimerMain, { visibility: "hidden", color: grayColor + " !important" });


        //console.log(gisLayersDisplayFlag);
    },

    getListGisLayerCheckboxes: function () {

        var tempCheckboxes = [];

        var cbs = $("#toggleMapGis").children("").find("input[type='checkbox']").not("#unselectallfilters");
        for (var i = 0; i < cbs.length; i++) {
            //console.log("getListGisLayerCheckboxes(): "+cbs[i].id + "-"+cbs[i].checked);
            tempCheckboxes.push({ layerName: cbs[i].id, displayStatus: cbs[i].checked });
        }
        return tempCheckboxes;

    },

    updateCheckboxDisplay: function (currentZoom) {
        for (var i = 0; i < inputParameters.length; i++) {

            if (currentZoom < inputParameters[i].zoomThreshold) {
                $("#" + inputParameters[i].layerName).prop('disabled', true);
                //$('label[for=' + inputParameters[i].layerName + "label" + ']').css('color', 'lightgray');

            } else {
                $("#" + inputParameters[i].layerName).prop('disabled', false);
                //$('label[for=' + inputParameters[i].layerName + "label" + ']').css('color', 'inherit');
            }

        }


    },

    unSelectAllGis: function () {

        //console.log(currentGisLayersStatus);
        //console.log("----- INSIDE unSelectAllGis()");
        for (var i = 0; i < currentGisLayersStatus.length; i++) {
            //console.log(currentGisLayersStatus[i].displayStatus + "-" + currentGisLayersStatus[i].layerName);
            if (currentGisLayersStatus[i].displayStatus) {

                if (rsgislayer.hideGisLayerBeta(currentGisLayersStatus[i])) {
                    //console.log(i+")-INSIDE unSelectAllGis()");
                    $("#" + currentGisLayersStatus[i].layerName).prop("checked", false);
                    currentGisLayersStatus[i].displayStatus = false;
                }


            }
        }
        /*var cbs = $("#toggleMapGis").children(":visible").find('input:checkbox:checked').not("#unselectallfilters");
		$.each(cbs,function(index,val){
		//TO DO : hideGisLayer(val.id);
    	val.checked = false;
    	});
        */

        //console.log(cbs);
    },

    resetNoResultLayer: function (layerId) {

        //console.log(currentGisLayersStatus);
        for (var i = 0; i < currentGisLayersStatus.length; i++) {

            if (currentGisLayersStatus[i].layerName == layerId) {
                currentGisLayersStatus[i].displayStatus = false;
                rsgislayer.hideGisLayerBeta(currentGisLayersStatus[i]);
            }


        }
    },

    onMonitoringGisLayers: function (event) {

        if (event == 'click') {

            var tempCheckboxes;
            tempCheckboxes = rsgislayer.getListGisLayerCheckboxes();
            for (var i = 0; i < tempCheckboxes.length; i++) {

                //console.log("tempCheckbox:" + tempCheckboxes[i].id+" <---> currentCheckbox:"+ currentGisLayersStatus[i].id);


                if (tempCheckboxes[i].displayStatus) {

                    if (tempCheckboxes[i].displayStatus == currentGisLayersStatus[i].displayStatus) {
                        //console.log("From TRUE -> TRUE               " + tempCheckboxes[i].layerName);

                        /*Mod 2015-12-29*/
                        //rsgislayer.updateCurrentLayerStatus(tempCheckboxes[i]);

                        console.log("[DEBUG] - A click event should NOT REMOVE " + tempCheckboxes[i].layerName + " LAYERS")


                    } else {
                        //console.log("SHOW LAYER (false-->true): "+ currentGisLayersStatus[i].displayStatus+"-->" + tempCheckboxes[i].displayStatus);
                        //console.log("FALSE -> TRUE          " + tempCheckboxes[i].layerName);
                        rsgislayer.updateCurrentLayerStatus(tempCheckboxes[i]);

                        rsgislayer.getBboxPoints();

                        var showLayerOk = rsgislayer.showGisLayerBeta(tempCheckboxes[i]);

                        /* if (showLayerOk) {
                             currentGisLayersStatus[i].displayStatus = tempCheckboxes[i].displayStatus;
                         } else {
                             $("#"+tempCheckboxes[i].id).prop( "checked", false );
                         }
                         */

                    }
                    //console.log("Layer SHOULD NOT BE Displayed: "+ tempCheckboxes[i].displayStatus );
                    //console.log("showGisLayer(tempCheckboxes[i].id)");
                } else {

                    if (tempCheckboxes[i].displayStatus == currentGisLayersStatus[i].displayStatus) {
                        //console.log("FALSE -> FALSE   " + tempCheckboxes[i].layerName);
                        /*Mod 2015-12-29*/
                        //rsgislayer.updateCurrentLayerStatus(tempCheckboxes[i]);
                        //console.log("Layer NOT Displayed/Checked: "+ currentGisLayersStatus[i].displayStatus +"-->" + tempCheckboxes[i].displayStatus);
                    } else {
                        //console.log("HIDE LAYER(true --> false): "+ currentGisLayersStatus[i].displayStatus+"-->" + tempCheckboxes[i].displayStatus);
                        //console.log("TRUE -> FALSE     " + tempCheckboxes[i].layerName);
                        rsgislayer.updateCurrentLayerStatus(tempCheckboxes[i]);

                        var hideLayerOk = rsgislayer.hideGisLayerBeta(tempCheckboxes[i]);
                        if (hideLayerOk) {
                            //console.log("[DEBUG] - Layer: " + tempCheckboxes[i].layerName + " DELETED.");
                            //currentGisLayersStatus[i].displayStatus = tempCheckboxes[i].displayStatus;
                            if (tempCheckboxes[i].layerName != 'temperature') {
                                //rsgislayer.loadDisclaimer(disclaimerMain, { visibility: "hidden", color: grayColor + " !important" });
                                var obj = { color: grayColor + " !important;", html: disclaimerMain, visibility: "hidden" };
                                rsgislayer.loadDisclaimer(obj);
                            }

                        }

                    }
                }

                //console.log("-------------------------------------------------------------------------\n");
            }

        } else if (event == 'dragend') {

            rsgislayer.getBboxPoints();

            if (rsgislayer.getQueryLayerCheckedBoxes() && queryLayerCheckedBoxes.length != 0) {

                for (var i = 0; i < queryLayerCheckedBoxes.length; i++) {

                    var hideLayerOk = rsgislayer.hideGisLayerBeta(queryLayerCheckedBoxes[i]);

                    if (hideLayerOk) {
                        console.log("[DEBUG] - DELETED " + queryLayerCheckedBoxes[i].layerName + " LAYER");
                    }

                }

                //Once layerQuery objects/elements are deleted,they will be drawn asynchronically
                console.log("[Array]: " + queryLayerCheckedBoxes);
                console.log(queryLayerCheckedBoxes);
                if (queryLayerCheckedBoxes.length != 0) {
                    rsgislayer.showGisLayerBeta(queryLayerCheckedBoxes.pop());
                } else {
                    queryLayerCheckedBoxes.length = 0;
                }

            }

        } else {
            alert("Developer's fault! Something is not right");
        }

    },

    getLayerCheckBox: function (layerId) {

        var cbFlag = $("#" + layerId).prop("checked");
        return cbFlag;

    },

    getBboxPoints: function () {

        bbox = map.getBounds();

        if (bbox == null) {
            bbox = new google.maps.LatLngBounds(
        new google.maps.LatLng(0, 0),
        new google.maps.LatLng(0, 0));
        }
        var bboxNE = bbox.getNorthEast();
        var bboxSW = bbox.getSouthWest();

        /*
        console.log("NE: " + bbox.getNorthEast().lat() + "," + 
            bbox.getNorthEast().lng() + 
            "-SW: " + bbox.getSouthWest().lat() + 
            "," + bbox.getSouthWest().lng());
        */
        bboxPoints.xmin = bbox.getSouthWest().lng();
        bboxPoints.ymin = bbox.getSouthWest().lat();
        bboxPoints.xmax = bbox.getNorthEast().lng();
        bboxPoints.ymax = bbox.getNorthEast().lat();

        if (frame != null) {
            frame.setMap(null);
        }
        //rsgislayer.drawBboxFrame(bboxPoints);

    },

    getObjectByLayer: function (layername) {
        //console.log('-----------------------\n' + layername);
        for (var i = 0; inputParameters.length; i++) {
            if (inputParameters[i].layerName == layername) {
                //console.log('-----------------------\n' + inputParameters[i].layerName);
                return inputParameters[i];
            }
        }
    },

    checkZoomGisLayers: function (currentZoom) {

        //console.log("checkZoomGisLayers()");
        var tempCheckboxes = rsgislayer.getListGisLayerCheckboxes();

        for (var i = 0; i < tempCheckboxes.length; i++) {
            var layerObj = rsgislayer.getObjectByLayer(tempCheckboxes[i].layerName);
            //console.log(layerObj.zoomControl);
            if (layerObj.zoomControl && tempCheckboxes[i].displayStatus && layerObj.layerObject != null) {

                if (currentZoom >= layerObj.zoomThreshold) {
                    //alert("YES WE CAN PLOT THE AIRPORTS!!!");
                    if (!layerObj.visibleFlag) {
                        layerObj.visibleFlag = true;
                        layerObj.layerObject.setVisLayerOn(layerObj.layerObject, map);

                    }
                } else {
                    //alert("NO, WE CANNOT PLOT THE AIRPORTS!!!");
                    layerObj.visibleFlag = false;
                    layerObj.layerObject.setVisLayerOff(layerObj.layerObject);

                }

            }

        }

        rsgislayer.updateCheckboxDisplay(currentZoom);

    },

    getZoomlevelText: function (zoomLevel) {

        if (zoomLevel == highDensZoomThreshold) {
            return "city";
        } else if (zoomLevel == midDensZoomThreshold) {
            return "state or country";
        } else {
            return "worldwide";
        }

    },

    getWeatherURL: function (eventObj) {

        var pointLatLng = eventObj.latLng;
        //document.getElementById("outputConsole").innerHTML = pointLatLng + "<br>";
        map.setZoom(10);
        map.setCenter(pointLatLng);

        window.open("/rs/map/Utilities/gislayers/weatherIframe.html" + "?lng=" + pointLatLng.lng() + "&lat=" + pointLatLng.lat());

    },

    createGislayerSpinner: function () {

        var opts = {
            lines: 13 // The number of lines to draw
        , length: 28 // The length of each line
        , width: 10 // The line thickness
        , radius: 30 // The radius of the inner circle
        , scale: 1 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#65797A' // #rgb or #rrggbb or array of colors
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
    },

    showUserNotification: function (title, text) {
        sessionStorage.notificationTitle = title;
        sessionStorage.notificationText = text;
        $('.modal-content').empty();
        $('.modal-content').load('/rs/kmi/partials/modal/modalmapnotification.html');
        $("#modalNotification").modal("show");
    },

    loadDisclaimer: function (obj) {
        $('#lblNotificationText').css("color", obj.color);
        $('#lblNotificationText').html(obj.html);
        $('#disclaimerBtn').prop('value', 'OK');
        $('#disclaimerBtn').css("visibility", obj.visibility);
    },

    disclaimerBtn_click: function () {

        $('#lblNotificationText').css("color", grayColor);
        $('#lblNotificationText').html(disclaimerMain);
        $('#disclaimerBtn').css("visibility", "hidden");
    },

    setGisMapLayerZoom: function (varZoom) {
        map.setZoom(parseInt(varZoom));
        return true;
    },

    updateCurrentLayerStatus: function (layerObj) {

        for (var i = 0; i < currentGisLayersStatus.length; i++) {

            if (currentGisLayersStatus[i].layerName == layerObj.layerName) {
                currentGisLayersStatus[i].displayStatus = layerObj.displayStatus;
            }

        }
    },

    getQueryLayerCheckedBoxes: function () {
        var tempArray = rsgislayer.getListGisLayerCheckboxes();
        for (var i = 0; i < tempArray.length; i++) {

            if (tempArray[i].displayStatus == true) {
                var objectLayer = rsgislayer.getObjectByLayer(tempArray[i].layerName);

                if (objectLayer.geomType == 'point' || objectLayer.geomType == 'polygon' || objectLayer.geomType == 'polyline') {
                    queryLayerCheckedBoxes.push(tempArray[i]);
                }
            }
        }
        //console.log(queryLayerCheckedBoxes);
        return true;
    },

    enableGisEventListeners: function () {

        dblClickEvent = google.maps.event.addListener(map, 'dblclick', function (e) {
            if ($("#temperature").prop('checked')) {
                rsgislayer.getWeatherURL(e);
            } else {
                //do nothing
            }
        });


        rightClickEvent = google.maps.event.addListener(map, 'rightclick', function (e) {

            if ($("#metrics").prop('checked')) {


                rsgislayer.getCountryBoundary(e);

            } else {
                //do nothing
            }


            if ($("#uscensus").prop('checked')) {
                rsgislayer.getCensusData(e.latLng, $('input[name=censusLevel]:checked').val());

            } else {
                //do nothing
            }



        });


        dragEvent = google.maps.event.addListener(map, 'dragend', function (e) {
            var obj = { color: grayColor + " !important;", html: disclaimerMain, visibility: "hidden" };
            rsgislayer.loadDisclaimer(obj);
            rsgislayer.onMonitoringGisLayers('dragend');
        });

        //google.maps.event.addListener(map, 'dblclick', function (e) {
        //    if ($("#temperature").prop('checked')) {
        //        rsgislayer.getWeatherURL(e);
        //    }
        //});

    },

    disableDragendGisEventListeners: function () {
        google.maps.event.removeListener(dragEvent);
    },

    enableDragendGisEventListeners: function () {
        dragEvent = google.maps.event.addListener(map, 'dragend', function (e) {
            var obj = { color: grayColor + " !important;", html: disclaimerMain, visibility: "hidden" };
            rsgislayer.loadDisclaimer(obj);
            rsgislayer.onMonitoringGisLayers('dragend');
        });
    },

    drawBboxFrame: function (framePoints) {

        var bboxFrameObj = [
            { lat: framePoints.ymin, lng: framePoints.xmin },
            { lat: framePoints.ymin, lng: framePoints.xmax },
            { lat: framePoints.ymax, lng: framePoints.xmax },
            { lat: framePoints.ymax, lng: framePoints.xmin }
        ];



        frame = new google.maps.Polygon({
            paths: bboxFrameObj,
            strokeColor: '#000000',
            strokeOpacity: 0.8,
            strokeWeight: 10,
            fillColor: '#8EDE88',
            fillOpacity: 0.2
        });
        frame.setMap(map);
    },

    gislayerGetTestData: function () {

        try {

            var _loadedPoints = rsData.getMapDataByFilter();
            console.log(_loadedPoints);
            return _loadedPoints;

        } catch (err) {
            alert(err.message);
        }

    },

    getMetricsDialogue: function () {

        //[GMOBUSTOS] 
        //rsgislayer.gislayerGetTestData();

        if (!($("#metrics").prop('checked'))) {

            $("#uscensus").prop('disabled', false);

            if (!!geojsonArray) {
                map.data.forEach(function (feature) {
                    //If you want, check here for some constraints.
                    map.data.remove(feature);
                });

                var obj = { color: "gray", html: "Data for certain layers is available at the Country, State, and City level", visibility: "hidden" };
                rsgislayer.loadDisclaimer(obj);
            }

        } else {
            $("#uscensus").prop('disabled', true);

        }

        //getSpatialMetrics();
    },

    getCountryBoundary: function (eventObj) {

        var pointLatLng = eventObj.latLng;
        var lat = pointLatLng.lat();
        var lng = pointLatLng.lng();
        //console.log(eventObj);
        //console.log(pointLatLng);
        //console.log("LAT: " + lat + " LNG: " + lng);
        //document.getElementById("outputConsole").innerHTML = pointLatLng + "<br>";
        //map.setZoom(10);
        //map.setCenter(pointLatLng);

        if (!!geojsonArray) {
            map.data.forEach(function (feature) {
                //If you want, check here for some constraints.
                map.data.remove(feature);
            });
        }



        $.ajax({
            url: "/api/MapData/GetCountryBoundary?lat=" + lat + "&lng=" + lng,
            //url: "/api/MapData/GetCountryBoundary?lat=33.2365&lng=-84.3215",
            type: "GET",
            success: function (data) {
                console.log(data);



                var geoJson = {
                    "type": "FeatureCollection",
                    "features": [
                      {
                          "type": "Feature",
                          "geometry": {
                              "type": data.WktGeometry[0].type,
                              "coordinates": data.WktGeometry[0].geometry.coordinates,
                              "crs": {
                                  "type": "name",
                                  "properties": {
                                      "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                                  }
                              }
                          }
                      }
                    ]
                };


                geoJson = turf.flip(geoJson);
                //geoJson = turf.simplify(geoJson, 5, false);// 0.1 - 5

                map.data.setStyle({
                    fillColor: '#ff9900',
                    strokeColor: '#804d00',
                    strokeWeight: 0.5
                });
                $("#layerspinner").css('visibility', 'hidden');
                geojsonArray = map.data.addGeoJson(geoJson);



                /*if (data.Result == "OK") {
                    console.log(data.wktGeometry);
                }
                else {
                    //if (data.UserInfo.isActive == true)
                    //    alert(data.Message);
                    location.href = "/accessdenied.html";
                }*/

            },
            error: function (msg) {
                console.log(msg)
                //alert("Error ocurred. System is not available at this time.  Technical support is working to resolve this issue and to bring the system online.")
                //location.href = "/accessdenied.html";
                //var err = "Failed on getCurrentUser: ";//+ msg.message;
                //rsUtility.SendErrorEmail(err, userInfo.email);
            }
        });
    },

    enableCensusDataRequest: function () {

        if ($("#uscensus").prop("checked")) {
            $("#censusCoverage").css("visibility", "visible");
            $("#metrics").prop('disabled', true);
        } else {
            $("#censusCoverage").css("visibility", "hidden");
            $("#metrics").prop('disabled', false);
            $("#layerspinner").css('visibility', 'hidden');
            rsgislayer.clearGeoJSONdata();
            var obj = { color: "gray", html: "Data for certain layers is available at the Country, State, and City level", visibility: "hidden" };
            rsgislayer.loadDisclaimer(obj);
        }
    },

    getCensusData: function (coord, level) {

        rsgislayer.clearCensusData();


        alert(level);
        var censusUrl = null;
        var tigerwebUrl = null;
        var outfieldsArray = null;

        var censusDataDict = {
            "NAME":"",
            "B19013_001E":"Income",
            "B19301_001E":"Income Per Capita",
            "B01003_001E":"Population",
            "B01002_002E":"Median Male Age",
            "B01002_003E":"Median Female Age"
        }

        switch (level) {
            case "state":
                tigerwebUrl = "http://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2013/MapServer/82",//"http:\//tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Labels/MapServer/64",//query?where=1=1&f=pjson&outFields=*&returnGeometry=false
                outfieldsArray = ['GEOID'];
                break;
            case "county":
                tigerwebUrl = "http:\//tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2013/MapServer/84";///query?where=1=1&f=pjson&outFields=*&returnGeometry=false
                outfieldsArray = ["STATE", "COUNTY"];
                break;
            case "tract":
                tigerwebUrl = "http:\//tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2013/MapServer/8";///query?where=1=1&f=pjson&outFields=*&returnGeometry=false
                outfieldsArray = ["STATE", "COUNTY", "TRACT"];
                break;
            default:
                break;
                //do nothing
        }



        //TODO
        /*
        1) REQUEST GEOGRAPHY FROM POINT (83 only Labels)
        http://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2013/MapServer/84/query?where=1=1&f=pjson&outFields=*&returnGeometry=false
           "attributes": {
                "GEOID": "41",
                "STUSAB": "OR",
                "OBJECTID": 41
               }
        http://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2013/MapServer/85/query?where=1=1&f=pjson&outFields=*&returnGeometry=false
           "attributes": {
                "OBJECTID": 1397,
                "GEOID": "41009",
                "BASENAME": "Columbia"
               }

        http://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2013/MapServer/8/query?where=1=1&f=pjson&outFields=*&returnGeometry=false
        
           "attributes": {
                "GEOID": "37179020902",
                "BASENAME": "209.02",
                "OBJECTID": 9531
               }
        
        2) ***  COUNTRIES ***
        http://gis.ncdc.noaa.gov/arcgis/rest/services/geo/references/MapServer/15
        
        *** CITIES ***
        http://gis.ncdc.noaa.gov/arcgis/rest/services/geo/references/MapServer/16
        */


        //alert("Coord: " + coord + " - Level: " + level);

        //rsgislayer.clearGeoJSONdata();
        console.log(tigerwebUrl);

        var layer = new gmaps.ags.Layer(tigerwebUrl);
        //$("#outputConsole").append(layer + "<br>");
        var params = {
            returnGeometry: true,
            geometryType: "esriGeometryPoint",
            inSR: "4326",
            outSR: "4326",
            outFields:outfieldsArray,
            //outFields: ["STUSAB","GEOID"],
            //outfields:["STATE","COUNTY"],
            geometry: coord.lng() + ',' + coord.lat(),
            spatialRelationship: "esriSpatialRelIntersects"

        };

        layer.query(params, processResultSet,callbackErr);

        function processResultSet(data) {
            console.log(data);

            if (data.features.length != 0) {
                var attr = data.features[0].attributes;
                var geom = data.features[0].geometry[0];


                switch (level) {
                    case "state":
                        censusUrl = "http:\//api.census.gov/data/2013/acs5?get=NAME,B19013_001E,B19301_001E,B01003_001E,B01002_002E,B01002_003E&for=state:" + attr["GEOID"] + "&key=504a1d1e3b08f9aed6ced2d9fc88d65673977648";
                        break;
                    case "county":
                        censusUrl = "http:\//api.census.gov/data/2013/acs5?get=NAME,B19013_001E,B19301_001E,B01003_001E,B01002_002E,B01002_003E&for=county:" + attr["COUNTY"] + "&in=state:" + attr["STATE"] + "&key=504a1d1e3b08f9aed6ced2d9fc88d65673977648";
                        break;
                    case "tract":
                        censusUrl = "http:\//api.census.gov/data/2013/acs5?get=NAME,B19013_001E,B19301_001E,B01003_001E,B01002_002E,B01002_003E&for=tract:" + attr["TRACT"] + "&in=state:" + attr["STATE"] + "+county:" + attr["COUNTY"] + "&key=504a1d1e3b08f9aed6ced2d9fc88d65673977648";
                        break;
                    default:
                        break;
                        //do nothing
                }
                //for=county:195&in=state:02&key=YOUR_KEY
                //http://www.census.gov/data/developers/data-sets/population-estimates-and-projections.html
                //&in=tract:710800+county:75+state:72
                //http://api.census.gov/data/2013/acs5?get=NAME,B19013_001E,B19301_001E,B01003_001E,B01002_002E,B01002_003E&for=county:075&&in=tract:710800+county:075+state:72&key=504a1d1e3b08f9aed6ced2d9fc88d65673977648

                //TRACTS
                //http://api.census.gov/data/2013/acs5?get=NAME,B19013_001E,B19301_001E,B01003_001E,B01002_002E,B01002_003E&for=tract:20100&in=state:01+county:001&key=504a1d1e3b08f9aed6ced2d9fc88d65673977648


                var apiRequest = $.ajax({
                    type: 'GET',
                    dataType: 'text',
                    contentType: 'text/plain',
                    //url: "http:\//api.census.gov/data/2013/acs5?get=NAME,B19013_001E,B19301_001E,B01003_001E,B01002_002E,B01002_003E&for=state:" + attr["GEOID"] + "&key=504a1d1e3b08f9aed6ced2d9fc88d65673977648",
                    url: censusUrl,//"http:\//api.census.gov/data/2013/acs5?get=NAME,B19013_001E,B19301_001E,B01003_001E,B01002_002E,B01002_003E&for=county:" + attr["COUNTY"] + "&in=state:" + attr["STATE"] + "&key=504a1d1e3b08f9aed6ced2d9fc88d65673977648",
                    /*success: function (data) {
                        //console.log("byHand");
                        //createCensusPolygon(data,geom);
                        console.log(geom);
                    }*/
                });

                apiRequest.done(function (response) {
                    var data = response;
                    //console.log(response);
                    createCensusPolygon(data, geom);

                });


            } else alert("NO DATA!!!");

        }

        function callbackErr(err) {
            console.log(err);
        }

        function createCensusPolygon(attrData, polygon) {

            response = JSON.parse(attrData);
            labels = response[0];
            values = response[1];
            console.log(labels);
            console.log(values);
            var latlng = getPolyCenter(polygon);

            //var labels = attrData[0];
            //var values = attrData[1];

            console.log("LABELS: " + labels);
            console.log("VALUES: " + values);

            polygon.setOptions({
                fillColor: '#ff9900',
                strokeColor: '#804d00',
                strokeWeight: 0.5
            });

            if (infoWindowFlag == false) {
                infowindow = new google.maps.InfoWindow();
                infoWindowFlag = true;

                infowindowsArray.push(infowindow);
            }


            google.maps.event.addListener(polygon, 'mouseover', function () {
                
                var myHTML = '<div id="iw-container">\
                                    <div class="iw-title" style="background-color: rgba(213,133,18,0.8) !important;">\
                                        <img src="/images/gisinfo.png" style="float:left;width:20px; height:20px; margin-left:10px; margin-right:8px;margin-bottom:4px;"/>\
                                        <b style="float: left">' + ((level == "state") ? "State " : (level == "county") ? "County " : (level == "tract") ? "Tract " : "")+ '</b>\
                                    </div>\
                                    <div style="max-height:200px;overflow-x: hidden;margin-bottom:3px; margin-right:8px;">\
                                    <div class="QuickInfoDesc" style="overflow:visible;">';



                for (var i = 0; i < 6; i++) {

                    if (labels[i] != null) {
                        //using http:\//openexchangerates.github.io/accounting.js/#download
                        if (censusDataDict[labels[i]].substring(0, 6) == 'Income') {

                            myHTML += "<b>" + censusDataDict[labels[i]] + "</b>: " + accounting.formatMoney(values[i]) + "<br/>";

                        } else if (censusDataDict[labels[i]].substring(0, 6) == "Popula") {

                            myHTML += "<b>" + censusDataDict[labels[i]] + "</b>: " + accounting.formatNumber(values[i]) + "<br/>";

                        } else if (labels[i] == 'NAME') {
                        
                            myHTML += "<b>" + ((level == "state") ? "State " : (level == "county") ? "County " : (level == "tract") ? "Tract " : "") + "</b>: " + values[i] + "<br/>";
                        
                        
                        }else {
                            myHTML += "<b>" + censusDataDict[labels[i]] + "</b>: " + values[i] + "<br/>";
                        }
                    }



                }

                myHTML += '</p></div>\
                        </div>\
                        </div>';

                infowindow.setContent(myHTML);
                infowindow.setPosition(latlng);
                infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
                infowindow.open(map);


                google.maps.event.addListener(infowindow, 'domready', function () {

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
                        left: '310px', top: '20px', // button repositioning
                        border: '13px light blue', // increasing button border and new color

                    });

                    iwCloseBtn.mouseout(function () {
                        $(this).css({
                            opacity: '1'
                        });
                    });

                });





            });

            censusPolyArray.push(polygon);
            polygon.setMap(map);

        }

        function getPolyCenter(poly) {
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
        }






        var sdk = new CitySDK(); //Create the CitySDK Instance
        census = sdk.modules.census; //Create an instance of the module
        census.enable("504a1d1e3b08f9aed6ced2d9fc88d65673977648");


        var variables = ['income', 'income_per_capita', 'population', 'median_male_age', 'median_female_age'];
        var varLabel = ['Income', 'Income Per Capita', 'Population', 'Median Male Age', 'Median Female Age'];
        //var level = "place";

        //if(infoWindowFlag == false){
        //    infowindow = new google.maps.InfoWindow();
        //    infoWindowFlag = true;
        //}

        // When the user clicks, open an infowindow
        //map.data.addListener('click', function (event) {

        //    var myHTML = '<div id="iw-container">\
        //                            <div class="iw-title" style="background-color: rgba(213,133,18,0.8) !important;">\
        //                                <img src="/images/gisinfo.png" style="float:left;width:20px; height:20px; margin-left:10px; margin-right:8px;margin-bottom:4px;"/>\
        //                                <b style="float: left">' + ((level == "state") ? "State: " : (level == "county") ? "County: " : (level == "place") ? "City: " : "")
        //    + event.feature.getProperty("NAME") + '</b>\
        //                            </div>\
        //                            <div style="max-height:200px;overflow-x: hidden;margin-bottom:3px; margin-right:8px;">\
        //                            <div class="QuickInfoDesc" style="overflow:visible;">';



        //    for (var i = 0; i < variables.length; i++) {

        //        if (event.feature.getProperty(variables[i]) != null) {
        //            //using http:\//openexchangerates.github.io/accounting.js/#download
        //            if (variables[i].substring(0, 6) == 'income') {
                        
        //                myHTML += "<b>" + varLabel[i] + "</b>: " + accounting.formatMoney(event.feature.getProperty(variables[i])) + "<br/>";
                        
        //            } else if (variables[i].substring(0, 6) == "popula") {

        //                myHTML += "<b>" + varLabel[i] + "</b>: " + accounting.formatNumber(event.feature.getProperty(variables[i])) + "<br/>";
                    
        //            }else{
        //                myHTML += "<b>" + varLabel[i] + "</b>: " + event.feature.getProperty(variables[i]) + "<br/>";
        //            }
        //       }



        //    }

        //    myHTML += '</p></div>\
        //                </div>\
        //                </div>';

        //    infowindow.setContent(myHTML);
        //    infowindow.setPosition(event.latLng);
        //    infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
        //    infowindow.open(map);


        //    google.maps.event.addListener(infowindow, 'domready', function () {

        //        var iwOuter = $('.gm-style-iw');

        //        var iwBackground = iwOuter.prev();

        //        iwBackground.children(':nth-child(2)').css({
        //            'display': 'none'
        //        });

        //        iwBackground.children(':nth-child(4)').css({
        //            'display': 'none'
        //        });

        //        var iwCloseBtn = iwOuter.next();

        //        iwCloseBtn.html('<span style="font-size:medium">X</span>');

        //        iwCloseBtn.addClass('label label-info');

        //        iwCloseBtn.css({
        //            width: '30px',
        //            height: '20px',
        //            opacity: '1', // by default the close button has an opacity of 0.7
        //            left: '310px', top: '20px', // button repositioning
        //            border: '13px light blue', // increasing button border and new color

        //        });

        //        iwCloseBtn.mouseout(function () {
        //            $(this).css({
        //                opacity: '1'
        //            });
        //        });

        //    });



        //});

        function checkLoading() {
            if (census.SUPPLEMENTAL_REQUESTS_IN_FLIGHT == 0) {
                $("#layerspinner").css('visibility', 'hidden');
                //$("#layerspinner").css('display', 'none');
                return;
            } else if (census.SUPPLEMENTAL_REQUESTS_IN_FLIGHT > 0) {
                window.setTimeout(checkLoading, 1500);
            }
        }

        function checkTimeout() {
            if ($("#layerspinner").is(":visible")) {

                $("#layerspinner").css('visibility', 'hidden');

                var obj = {
                    color: redColor + " !important;", 
                    html: "Timeout, please try again.", 
                    visibility: "hidden"
                };
                rsgislayer.loadDisclaimer(obj);

                //$("#layerspinner").css('display', 'none');
                
            } else  {
              
            }
        }


        function loadLocation(coordfn, levelfn) {

            var reqLevel = levelfn;

            //BEGIN CITYSDK REQUEST
            $("#layerspinner").css('visibility', 'visible');
            // $("#layerspinner").css('display', 'block');

            var request = {
                "lat": coordfn.lat(),
                "lng": coordfn.lng(),
                "level": reqLevel,
                "variables": variables
            };

            try {
                census.APIRequest(request, function (response) {
                    //setTimeout(checkTimeout(),20000);
                    console.log("afterAPIRequest");
                    console.log(response);
                    if ('data' in response) {
                        
                        //alert("We have DATA!!!");
                        census.GEORequest(request, function (geojson) {
                            checkLoading();

                            map.data.setStyle({
                                fillColor: '#ff9900',
                                strokeColor: '#804d00',
                                strokeWeight: 0.5
                            });
                            console.log("afterGEORequest");
                            console.log(response);
                            censusDataArray = map.data.addGeoJson(geojson);
                            $("#layerspinner").css('visibility', 'hidden');
                        });
                    } else {
                        $("#layerspinner").css('visibility', 'hidden');
                        var obj = {
                            color: redColor + " !important;", html: "No " + ((level == "state") ? "State " : (level == "county") ? "County " : (level == "place") ? "City " : "")
                                + " data in the viewport area", visibility: "hidden"
                        };
                        rsgislayer.loadDisclaimer(obj);
                    }
                });
            }
            catch (err) {
                alert(err.message);
            }


        }
        //[GMOBUSTOS - 2016/01/22
        //loadLocation(coord, level);

    },

    clearGeoJSONdata: function () {

        map.data.forEach(function (feature) {
            map.data.remove(feature);
        });

        var obj = { color: "gray", html: "Data for certain layers is available at the Country, State, and City level", visibility: "hidden" };
        rsgislayer.loadDisclaimer(obj);
    },
    clearCensusData: function () {

        if (censusPolyArray.length != 0) {

            for (var i = 0; i < censusPolyArray.length; i++) {
                //console.log(this.geomArrayAirport[i]);
                censusPolyArray[i].setMap(null);
            }

            censusPolyArray.length = 0;

        }

        for (var i = 0; i < infowindowsArray.length; i++) {

            infowindowsArray[i].close();
        }



        var obj = { color: "gray", html: "Data for certain layers is available at the Country, State, and City level", visibility: "hidden" };
        rsgislayer.loadDisclaimer(obj);
    },




}


