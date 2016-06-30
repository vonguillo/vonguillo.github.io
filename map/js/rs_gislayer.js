//var map = null;
var highDensZoomThreshold = 12;//city scale
var midDensZoomThreshold = 8;//state or country
var lowDensZoomThreshold = 4;//continent worldwide

var disclaimerMain = "Data for certain layers is available at the Country, State and City level.";
var geojsonArray = null;
var censusDataArray = null;
var censusPolyArray = [];
var infoWindowFlag = false;
var infowindowsArray = [];
var refreshMapLayers = true;
var stopMaplayersBtnEvt = true;
var layerQueryWatch = true;
var cdpMarker = null;

//KML KMZ Variables
var readerKML = null;
var readerKMZ = null;
var tempKMZarray = new Array();

var kmlkmzSource = {

    "borders_kmz": "map/Content/gislayers/data/KMZ/HSIP/CanadaMexicoBorderCrossings.zip",
    "eparegions_kmz": "map/Content/gislayers/data/KMZ/HSIP/EPA_Regions_LayerToKML.zip",
    "congressdistr_kmz": "map/Content/gislayers/data/KMZ/HSIP/CongressionalDistricts.zip",
    "habitat_kmz": "map/Content/gislayers/data/KMZ/HSIP/CriticalHabitatDesignations.zip",
    "airconditions_kml": "map/Content/gislayers/data/KML/airnow_conditions.kml",
    "usstates_kml": "map/Content/gislayers/data/KML/usStates.kml"
};

var fileToLayerDict = {

    "map/Content/gislayers/data/KMZ/HSIP/CanadaMexicoBorderCrossings.zip": "Borders",
    "map/Content/gislayers/data/KMZ/HSIP/EPA_Regions_LayerToKML.zip": "EPA Regions",
    "map/Content/gislayers/data/KMZ/HSIP/CongressionalDistricts.zip": "Congressional Districts",
    "map/Content/gislayers/data/KMZ/HSIP/CriticalHabitatDesignations.zip": "Critical Habitat Areas",
    "map/Content/gislayers/data/KML/airnow_conditions.kml": "Air Conditions",
    "map/Content/gislayers/data/KML/usStates.kml": "U.S. States"
}

var inputParameters = [
    {
        //----------------------------------------------------------------------------------------------------------------------------------------------
        // INFRASTRUCTURE
        layerName: "airport",
        urlEndpoint: "http://services.nationalmap.gov/arcgis/rest/services/transportation/MapServer",
        layerId: 1,
        outfieldsLabels: ["Name", "Airport Code", "Airport Type", "Info Source", "Source Description"],
        inputOutfields: ["NAME", "FAA_AIRPORT_CODE", "AIRPORT_CLASS", "SOURCE_ORIGINATOR", "SOURCE_DATADESC"],
        iconPath: "/vonguillo.github.io/GithubTests/map/icons/gislayers/airportB.png",
        whereString: "",
        coverage: "local",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
    },
    {
        layerName: "hospital",
        urlEndpoint: "http://services.nationalmap.gov/arcgis/rest/services/structures/MapServer",
        layerId: 3,
        outfieldsLabels: ["Name", "Address", "City", "State", "Zipcode", "Info Source", "Source Description"],
        inputOutfields: ["NAME", "ADDRESS", "CITY", "STATE", "ZIPCODE", "SOURCE_ORIGINATOR", "SOURCE_DATADESC"],
        iconPath: '/vonguillo.github.io/GithubTests/map/icons/gislayers/hospitalB.png',
        whereString: "",
        coverage: "local",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: highDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
    },
    {
        layerName: "ambulance",
        urlEndpoint: "http://services.nationalmap.gov/arcgis/rest/services/structures/MapServer",
        layerId: 5,
        outfieldsLabels: ["Name", "Address", "City", "State", "Zipcode", "Info Source", "Source Description"],
        inputOutfields: ["NAME", "ADDRESS", "CITY", "STATE", "ZIPCODE", "SOURCE_ORIGINATOR", "SOURCE_DATADESC"],
        iconPath: '/vonguillo.github.io/GithubTests/map/icons/gislayers/ambulance.png',
        whereString: "",
        coverage: "local",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: highDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
    },

    {
        layerName: "fire_station",
        urlEndpoint: "http://services.nationalmap.gov/arcgis/rest/services/structures/MapServer",
        layerId: 7,
        outfieldsLabels: ["Name", "Address", "City", "State", "Zipcode", "Info Source", "Source Description"],
        inputOutfields: ["NAME", "ADDRESS", "CITY", "STATE", "ZIPCODE", "SOURCE_ORIGINATOR", "SOURCE_DATADESC"],
        iconPath: '/vonguillo.github.io/GithubTests/map/icons/gislayers/firestation.png',
        whereString: "",
        coverage: "local",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: highDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
    },

    {
        layerName: "police",
        urlEndpoint: "http://services.nationalmap.gov/arcgis/rest/services/structures/MapServer",
        layerId: 6,
        outfieldsLabels: ["Name", "Address", "City", "State", "Zipcode", "Info Source", "Source Description"],
        inputOutfields: ["NAME", "ADDRESS", "CITY", "STATE", "ZIPCODE", "SOURCE_ORIGINATOR", "SOURCE_DATADESC"],
        iconPath: '/vonguillo.github.io/GithubTests/map/icons/gislayers/police.png',
        whereString: "",
        coverage: "local",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: highDensZoomThreshold,
        layerObject: null,
        layerObject: null,
        visibleFlag: false,
        legend: false
    },
    //----------------------------------------------------------------------------------------------------------------------------------------------
    // HAZARDS
    // Sources:https://idpgis.ncep.noaa.gov/arcgis/rest/services
    //
    {
        layerName: "severe",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        layerId: 12,
        outfieldsLabels: ["Category", "Effective since: ", "Expires on: ", "More Info."],
        inputOutfields: ["event", "effective", "expires", "web"],
        iconPath: '',
        whereString: "",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "warning",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        layerId: 13,
        outfieldsLabels: ["Category", "Effective since: ", "Expires on: ", "More Info."],
        inputOutfields: ["event", "effective", "expires", "web"],
        iconPath: '',
        whereString: "",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
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
        visibleFlag: false,
        legend: false
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
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "hail",
        urlEndpoint: "http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/NOAA_storm_reports/MapServer",
        layerId: 0,
        outfieldsLabels: ["UTC_DATETIME", "HAIL_SIZE", "LOCATION", "COUNTY", "STATE", "COMMENTS"],
        inputOutfields: ["UTC_DATETIME", "HAIL_SIZE", "LOCATION", "COUNTY", "STATE", "COMMENTS"],
        iconPath: '/vonguillo.github.io/GithubTests/map/icons/gislayers/hail.png',
        whereString: "",
        coverage: "global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "tornado",
        urlEndpoint: "http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/NOAA_storm_reports/MapServer",
        layerId: 1,
        outfieldsLabels: ["UTC_DATETIME", "F_SCALE", "LOCATION", "COUNTY", "STATE", "COMMENTS"],
        inputOutfields: ["UTC_DATETIME", "F_SCALE", "LOCATION", "COUNTY", "STATE", "COMMENTS"],
        //iconPath: '/GithubTests/map/icons/gislayers/tornado.png',
        iconPath: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAgCAYAAADqgqNBAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAABo9JREFUSInVl39QVNcVx7/nvveWXZCAC+zycxWD4I+oxTgSGW1sw4rUOEbwRxQRbZxkGmv/qLEdM52OpD/MaGY6nWnq1GlsEhOEVYlOJBiXSNVGpWrQhjSpGDWCIoiL/FoW9r17+geL3SGIy0ydTu+f7917Pt977rnnnqPifzjU/ys4MxMRMTNH6f096aopooGI7gEgAPzI4MxMQZAJQlW3AHgDwN/dbjfl5OSAiEIWEDJ8AFytEDl1Zn7K19myv/XioeS46YufZuYVRHSCmRVmlqEKCAke2PEgeGZfd2v5nbO7kr+pLtFl9w1b/NxNZcxcQESnRyMg1J0rRKQz8xN+711X+/k9jvbaEr8jA2rH+d/6TZopPjZ7Yxkz5xPReWZWmdl4mICHwplZDYAzdN89V/uFdx5vq9nqj02CZjIBphRo7ee2+RUtLMWa9VI5My8lon+EImBEODNrRORn5lSjv6v8Xt3eya2fbNZtM/I0s2gFOi5A0QBrIrS7Z7b6STFNsM5+oTzggS+ZWQWgjxoeBE42/D2ujktlM5qP/kRPzNqgRIyfDTK8kDdjQe0fAwCs8dDunNqsk2KaZH2y2BXwwJVBOyHDg8B2qXtdnZ8fnNV05EXDPi1XiXDMJnltP4j9UBO/D9n2MVQBQANiEqC0ntikC9X0RHTmahczP0dENx4k4FvwIHAMZF9ZZ/2hOTePFhsxyRCR4+YT3z4Bo9ENxQJILQJCGbj4UAAQyGqH0lz9kiGUsMyoGStcgSO4NZwANQhKAEQAHAXo73fUH57fdLRQjo0CRY5fT6olGsY9P0wZL0K27IZxuxJKSgGMmwchCFD6AbMGstohmo6tMyC0rKjpBfuYeRkR3WFmBcD9a3gfHvhgMPMYQN/bUX8k95uPVsqYGCA8DMKSvhZaYiZ44vMgUwT06/nwn1sIGjMONAYQ5kVQY+ei/9pWWBhktUE0VhUapGjfjZ7+XCkzryQiz0g7J2b5ZldDzeKGiqXSlgBYFAiT48fQHNkAmQZcDEBNzYUIv4C+009Cm/IWFMezIIsNInYmek/mIjwMZMRBXPlghTFRq8yJTH9mNzOvAmAQkRx65mMBTPbcqF/7RekCxEWDwzQoigKYJxUDZAJYAoN4Igj7TMALsNcHstgAAFrq96A3/Qzy8g6YzaBIK3Dx/UWYuv5MQXhKVi6IzgFoGep2D8Cnu3vS3s4sPr3u8nvZFBEOGbfyayGiJgQmiaHxCUshQ79aBe/bA6KkAJSJWyAcRfD+cy/39EBMLzqGXkvKyYysJY2eOF/vA6Kd+PV3D7yyuTA3IW3ZR7ktta9KX2cXm/TrxHofhKD7bv/PEhUiajyUiVtgNO6E9APGLRekfS139wOpiz8gPWbauVd/+fvtnosffomgpDNctN81U9n6jc8vLI2fs3P+tX3fkY9FA2PCQQoBqgAoWIEBwJwAkbIB5HgZwtcGP0dyZ/vXSM6rIN3+VN0vdvyp5J1dr9cA6A/WPVy0q0TUbIuuLF6el70vaeHB7KYPCyTFABHhIEhAIUAMvuwApLcZ+vVfQSpT4e3zcFdvM9uy9gsjfk79jjdLS3bv3HYcQB+GFBzfSjKBR0QlohsRlbVFi+bmlCcvOTyrqXKJQRpEuAVENHD8RAOWpAHofUCv7wv2tILjnXuEjJ/71R/2VJTs3LbZDaB3KHhY+BABVw+4TxY5Z88rS1qwb8bNqlUG2SEsYSCWgCIAKQGdAZ8Obm8DxzvfEmpa3pW/uI6VbPv5xioA3uHAD4QHBBjMrBDRV9VnLhXNmuQsT1ywd3Kzu0iHDaolDIAEDAZ8/YCnBdI2f5eipuVdf+9QzWs//VHxEQA9DwKPCAfARCQDAj7/9LPLa6am5ZXbjT+n3f5kgz7WDjVMA/p1wHMbRty83ymm9CVNFVVnX9v0wurDALpHAj8MPlTAZ7WXrhZlpC8ui/P/cVxz9ct6VBLUjlsw7E/vUMxTlzcf+evFX/9wTX4FgM7B9SMZD6WMYgIkMwsiOlvX0Lg2dcrS0jhpJDVUbPI//ux2LXza6tbjZ//1mzUFP3AB6AjBZshwgIjBjICAk/XXmtYlTcl/d8pj4xPUhGltf6u7uj1/0TNlANpDBYcOx0AecLvdFGgaqk/V1hVOcMx65fipTytXLV92AMDdwakIsXkYVdPgdDql2+0WAHheVmYNgEsYyHGDrh5V1zLqdsnpdAYb7xry+9G1S8MAhi0MHyX8vzb+DQ1uECjfRh2aAAAAAElFTkSuQmCC",
        whereString: "",
        coverage: "global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "wind",
        urlEndpoint: "http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/NOAA_storm_reports/MapServer",
        layerId: 2,
        outfieldsLabels: ["UTC_DATETIME", "SPEED", "LOCATION", "COUNTY", "STATE", "COMMENTS"],
        inputOutfields: ["UTC_DATETIME", "SPEED", "LOCATION", "COUNTY", "STATE", "COMMENTS"],
        iconPath: '/vonguillo.github.io/GithubTests/map/icons/gislayers/wind.png',
        whereString: "",
        coverage: "global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "tornadopast",
        urlEndpoint: "http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/NOAA_storm_reports/MapServer",
        layerId: 3,
        outfieldsLabels: ["UTC_DATETIME", "F_SCALE", "LOCATION", "COUNTY", "STATE", "COMMENTS"],
        inputOutfields: ["UTC_DATETIME", "F_SCALE", "LOCATION", "COUNTY", "STATE", "COMMENTS"],
        iconPath: '/vonguillo.github.io/GithubTests/map/icons/gislayers/tornadopast.png',
        whereString: "",
        coverage: "global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "hurricane",
        //urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        urlEndpoint: "http://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones_active/MapServer",
        //layerId: 5,
        layerId: 0,
        //outfieldsLabels: ["Type", "Name", "Movement", "Wind Speed", "Date", "More Info."],
        //inputOutfields: ["type", "name", "movement", "wind", "pubdate", "link"],
        outfieldsLabels: ["basin", "prob2day", "risk2day", "prob5day", "risk5day", "idp_issueddate"],
        inputOutfields: ["basin", "prob2day", "risk2day", "prob5day", "risk5day", "idp_issueddate"],
        iconPath: '/GithubTests/map/icons/gislayers/hurricane.png',
        whereString: "",
        coverage: "global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false,
        value: "prob2day"

        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "hurricaneobs",
        urlEndpoint: "http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Hurricane_Active/MapServer",
        layerId: 0,
        outfieldsLabels: ["Type", "Name", "Movement", "Wind Speed", "Date", "More Info."],
        inputOutfields: ["type", "name", "movement", "wind", "pubdate", "link"],
        iconPath: '/vonguillo.github.io/GithubTests/map/icons/gislayers/hurricane.png',
        whereString: "",
        coverage: "global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "hurricaneforecast",
        urlEndpoint: "http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Hurricane_Active/MapServer",
        layerId: 1,
        outfieldsLabels: ["Type", "Name", "Movement", "Wind Speed", "Date", "More Info."],
        inputOutfields: ["type", "name", "movement", "wind", "pubdate", "link"],
        iconPath: '/vonguillo.github.io/GithubTests/map/icons/gislayers/hurricane.png',
        whereString: "",
        coverage: "global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },


    {
        layerName: "flood",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        layerId: 0,
        outfieldsLabels: ["Status ", "Location", "Waterbody", "Stage", "Units", "Observation Time", "More Info."],
        inputOutfields: ["Status", "Location", "Waterbody", "Stage", "Units", "ObsTime", "URL"],
        iconPath: '/vonguillo.github.io/GithubTests/map/icons/gislayers/flood.png',
        whereString: "",
        coverage: "US",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "floodriver",
        urlEndpoint: "http://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/sig_riv_fld_outlk/MapServer",
        layerId: 0,
        outfieldsLabels: ["Outlook ", "Valid Time Range", "Start Time", "End Time"],
        inputOutfields: ["outlook", "valid_time", "start_time", "end_time"],
        iconPath: '',
        whereString: "",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: true,
        value: "outlook"
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "usgaugeobserved",
        urlEndpoint: "http://gis.srh.noaa.gov/arcgis/rest/services/ahps_gauges/MapServer",
        layerId: 0,
        outfieldsLabels: ["Outlook ", "Valid Time Range", "Start Time", "End Time"],
        inputOutfields: ["Status", "valid_time", "start_time", "end_time"],
        iconPath: '',
        whereString: "status='major' OR status='moderate' OR status='minor' OR status='action' ",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "usgaugeforecast",
        urlEndpoint: "http://gis.srh.noaa.gov/arcgis/rest/services/ahps_gauges/MapServer",
        layerId: 1,
        outfieldsLabels: ["Outlook ", "Valid Time Range", "Start Time", "End Time"],
        inputOutfields: ["Status", "valid_time", "start_time", "end_time"],
        iconPath: '',
        whereString: "status='major' OR status='moderate' OR status='minor' OR status='action' ",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "firepoint",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        //urlEndpoint: "http:\//wildfire.cr.usgs.gov/ArcGIS/rest/services/geomac_dyn/MapServer/0",
        //urlEndpoint: "http:\//rmgsc.cr.usgs.gov/arcgis/rest/services/geomac_dyn/MapServer/",
        layerId: 10,
        outfieldsLabels: ["Incident: ", "Acres", "Contained [%]", "Discovery Date", "Report Data", "Cause", "More Info."],
        inputOutfields: ["incidentname", "acres", "percentcontained", "firediscoverydatetime", "reportdatetime", "firecause", "hotlink"],
        iconPath: '/vonguillo.github.io/GithubTests/map/icons/gislayers/fire.png',
        whereString: "",
        coverage: "US",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "fireperimeter",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        //urlEndpoint: "http:\//wildfire.cr.usgs.gov/ArcGIS/rest/services/geomac_dyn/MapServer/1",
        //urlEndpoint: "http:\//rmgsc.cr.usgs.gov/arcgis/rest/services/geomac_dyn/MapServer/",
        layerId: 11,
        outfieldsLabels: ["Incident: ", "Acres", "Current DateTime", "Perimeter DateTime"],
        inputOutfields: ["incidentname", "gisacres", "datecurrent", "perimeterdatetime", "objectid"],
        iconPath: '',
        whereString: "",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },

    {
        layerName: "earthquake",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        layerId: 3,
        outfieldsLabels: ["MAG", "Depth", "Location", "Date", "More Info."],
        inputOutfields: ["magnitude", "depth", "location", "pubdate", "link"],
        iconPath: '/vonguillo.github.io/GithubTests/map/icons/gislayers/earthquakes/earthquake',
        whereString: "magnitude > 4.5",
        coverage: "global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "usvolcano",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        layerId: 1,
        outfieldsLabels: ["Volcano: ", "Alert Level", "Code", "Date", "More Info."],
        inputOutfields: ["id", "alertlevel", "colorcode", "pubdate", "link"],
        iconPath: '/vonguillo.github.io/vonguillo.github.io/GithubTests/map/icons/gislayers/usvolcanoes',
        whereString: "",
        coverage: "global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "othervolcano",
        urlEndpoint: "http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
        layerId: 2,
        outfieldsLabels: ["Volcano: ", "Date", "More Info."],
        inputOutfields: ["id", "pubdate", "link"],
        iconPath: '/vonguillo.github.io/GithubTests/map/icons/gislayers/volcano.png',
        whereString: "",
        coverage: "global",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    //----------------------------------------------------------------------------------------------------------------------------------------------
    // WEATHER
    {
        layerName: "cloud",
        urlEndpoint: "http:\//arthurhou.pps.eosdis.nasa.gov/ppshome/THORonline/KML/image/IR..kml",
        geomType: "kmz",
        zoomControl: false,
        zoomThreshold: 1,
        layerObject: null,
        visibleFlag: false,
        legend: false

    },
    {
        layerName: "precipitation",
        //urlEndpoint:"http:\//www.cpc.ncep.noaa.gov/products/precip/CWlink/ghazards/KMZs/TC_WK1.kml",
        //urlEndpoint: "http:\//arthurhou.pps.eosdis.nasa.gov/ppshome/THORonline/KML/image/03hr..kml",
        urlEndpoint: "http:\//arthurhou.pps.eosdis.nasa.gov/ppshome/THORonline/KML/image/1day..kml",
        geomType: "kmz",
        zoomControl: false,
        zoomThreshold: 1,
        layerObject: null,
        visibleFlag: false,
        legend: false

    },

    {
        layerName: "temperature",
        urlEndpoint: "http://gis.ncdc.noaa.gov/arcgis/rest/services/cdo/ghcndms_obs/MapServer",
        layerId: 0,
        outfieldsLabels: ["AVG [°F]", "Station"],
        inputOutfields: ["IMPERIAL", "STATION_NAME"],
        iconPath: '/vonguillo.github.io/GithubTests/map/icons/gislayers/temperature.png',
        whereString: "",
        coverage: "global",
        geomType: "popup",
        zoomControl: false,
        zoomThreshold: 1,
        layerObject: null,
        visibleFlag: false,
        legend: false
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
        visibleFlag: false,
        legend: true,
        value: "SoVI"
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "metrics",
        coverage: "global",
        geomType: "polygon2",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
    },
    {
        layerName: "state",
        coverage: "us",
        geomType: "polygon2",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "county",
        coverage: "us",
        geomType: "polygon2",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "tract",
        coverage: "us",
        geomType: "polygon2",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "borders_kmz",
        geomType: "kmzfile",
        urlEndpoint: "map/Content/gislayers/data/KMZ/HSIP/CanadaMexicoBorderCrossings.zip",
        layerObject: null,
        legend: false

    },
    {
        layerName: "eparegions_kmz",
        geomType: "kmzfile",
        urlEndpoint: "map/Content/gislayers/data/KMZ/HSIP/EPA_Regions_LayerToKML.zip",
        layerObject: null,
        legend: false

    },
    {
        layerName: "airconditions_kml",
        geomType: "kmlfile",
        urlEndpoint: "map/Content/gislayers/data/KML/airnow_conditions.kml",
        layerObject: null,
        legend: false

    },
    {
        layerName: "usstates_kml",
        geomType: "kmlfile",
        urlEndpoint: "map/Content/gislayers/data/KML/usStates.kml",
        layerObject: null,
        legend: false

    },

    {
        layerName: "citytown",
        urlEndpoint: "http://services.nationalmap.gov/arcgis/rest/services/USGSTopoLarge/MapServer",
        layerId: 25,
        outfieldsLabels: ["Place Name", "Place ", "State ", "Source ", "Last update "],
        inputOutfields: ["GNIS_NAME", "PLACE_NAME", "STATE_NAME", "SOURCE_DATADESC", "LOADDATE"],
        iconPath: '',
        whereString: "FCODE IN (61403,61404,61407,61410,61414)",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: highDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "munivillage",
        urlEndpoint: "http://services.nationalmap.gov/arcgis/rest/services/USGSTopoLarge/MapServer",
        layerId: 25,
        outfieldsLabels: ["Place Name", "Place ", "State ", "Source ", "Last update "],
        inputOutfields: ["GNIS_NAME", "PLACE_NAME", "STATE_NAME", "SOURCE_DATADESC", "LOADDATE"],
        iconPath: '',
        whereString: "FCODE IN (61412,61415)",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: highDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    }, {
        layerName: "borrough",
        urlEndpoint: "http://services.nationalmap.gov/arcgis/rest/services/USGSTopoLarge/MapServer",
        layerId: 25,
        outfieldsLabels: ["Place Name", "Place ", "State ", "Source ", "Last update "],
        inputOutfields: ["GNIS_NAME", "PLACE_NAME", "STATE_NAME", "SOURCE_DATADESC", "LOADDATE"],
        iconPath: '',
        whereString: "FCODE = 61401",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: highDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "dmestate",
        urlEndpoint: "http://geohealth.hhs.gov/dataaccess/rest/services/CMS_DME/HHS_CMS_DME_ESRD_onlyAll/MapServer",
        layerId: 2,
        outfieldsLabels: ["Place Name", "Place ", "State ", "Source ", "Last update "],
        inputOutfields: ["State", "Medicare_Benes", "Power_Dependent_DME_13mo"],
        iconPath: '',
        whereString: "",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: true,
        value: "Power_Dependent_DME_13mo"
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "dmecounty",
        urlEndpoint: "http://geohealth.hhs.gov/dataaccess/rest/services/CMS_DME/HHS_CMS_DME_ESRD_onlyAll/MapServer",
        layerId: 1,
        outfieldsLabels: ["County", "Name ", "State ", "Medicare Benefitiaties ", "Power Dependant"],
        inputOutfields: ["County", "NAMELSAD", "State_1", "Medicare_Benes", "Power_Dependent_DME_13mo"],
        iconPath: '',
        whereString: "",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: true,
        value: "Power_Dependent_DME_13mo"
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "dmezipcode",
        urlEndpoint: "http://geohealth.hhs.gov/dataaccess/rest/services/CMS_DME/HHS_CMS_DME_ESRD_onlyAll/MapServer",
        layerId: 0,
        outfieldsLabels: ["Place Name", "Place ", "State ", "Source ", "Last update "],
        inputOutfields: ["Zip_Code", "COUNTY", "State_1", "Medicare_Benes", "Power_Dependent_DME_13mo"],
        iconPath: '',
        whereString: "",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: highDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: true,
        value: "Power_Dependent_DME_13mo"
        //query?where=1=1&f=pjson&outFields=*&returnGeometry=false
    },
    {
        layerName: "shelter",
        urlEndpoint: "http://gis.fema.gov/REST/services/NSS/OpenShelters/MapServer",
        layerId: 0,
        outfieldsLabels: ["SHELTER_NAME", "ADDRESS", "CITY", "STATE", "ZIP", "SHELTER_STATUS", "EVACUATION_CAPACITY", "POST_IMPACT_CAPACITY", "TOTAL_POPULATION", "HOURS_OPEN", "HOURS_CLOSE", "ORG_NAME", "MATCH_TYPE"],
        inputOutfields: ["SHELTER_NAME", "ADDRESS", "CITY", "STATE", "ZIP", "SHELTER_STATUS", "EVACUATION_CAPACITY", "POST_IMPACT_CAPACITY", "TOTAL_POPULATION", "HOURS_OPEN", "HOURS_CLOSE", "ORG_NAME", "MATCH_TYPE"],
        iconPath: '/vonguillo.github.io/GithubTests/map/icons/gislayers/shelter.png',
        whereString: "",
        coverage: "local",
        geomType: "point",
        zoomControl: true,
        zoomThreshold: lowDensZoomThreshold,
        layerObject: null,
        visibleFlag: false,
        legend: false
    },
    {
        layerName: "poweroutage_percent",
        urlEndpoint: "http://gis.fema.gov/REST/services/FEMA/PowerOutages/MapServer",
        layerId: 0,
        outfieldsLabels: ["UTILITIES", "CUSTOMERS_", "TOTAL_CUST", "PCT_OUT", "TIME_STAMP", "COUNTY_NAM", "STATE_NAME"],
        inputOutfields: ["UTILITIES", "CUSTOMERS_", "TOTAL_CUST", "PCT_OUT", "TIME_STAMP", "COUNTY_NAM", "STATE_NAME"],
        iconPath: '',
        whereString: "",
        coverage: "US",
        geomType: "polygon",
        zoomControl: true,
        zoomThreshold: midDensZoomThreshold + 2,
        layerObject: null,
        visibleFlag: false,
        legend: true,
        value: "PCT_OUT"
    }
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
        console.log(localLayerVar);

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

                    //console.log("[DEBUG] - DELETING....." + localLayerVar.layerName);
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

            } else if (localLayerVar.geomType == "kmlfile" || localLayerVar.geomType == "kmzfile") {

                console.log("INSIDE KMLFILE KMZFILE");
                console.log(localLayerVar);

                var fileextension = (localLayerVar.layerName).split("_")[1];
                if (fileextension == 'kmz') rsgislayer.removeKMZ(localLayerVar.urlEndpoint);
                if (fileextension == 'kml') rsgislayer.removeKML(localLayerVar.urlEndpoint);

                return true;


            } else if (localLayerVar.geomType == 'polygon2') {
                rsgislayer.clearCensusData();
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
            //console.log("Displaying " + localLayerVar.layerName + "Layer");

            localLayerVar.layerObject = new google.maps.KmlLayer({
                url: localLayerVar.urlEndpoint,
                preserveViewport: true,
                clickable: false
            });
            localLayerVar.layerObject.setMap(map);

            rsgislayer.updateCurrentLayerStatus({ layerName: localLayerVar.layerName, displayStatus: true });
            return true;

            //} else if (localLayerVar.geomType == 'point' || localLayerVar.geomType == 'polygon' || localLayerVar.geomType == 'polyline') {
        } else if (localLayerVar.geomType == "kmlfile" || localLayerVar.geomType == "kmzfile") {


            var fileextension = (localLayerVar.layerName).split("_")[1];

            if (fileextension == 'kmz') {

                rsgislayer.readKMZ(localLayerVar.urlEndpoint);
                localLayerVar.layerObject = true;
                //localLayerVar.layerObject = readerKMZ.docsByUrl['/rs/' + localLayerVar.urlEndpoint];
                return true;
            }


            if (fileextension == 'kml') {

                rsgislayer.readKML(localLayerVar.urlEndpoint);
                localLayerVar.layerObject = true;
                return true;
                //localLayerVar.layerObject = readerKML.docsByUrl['/rs/' + localLayerVar.urlEndpoint];
            }

        }


        else if (localLayerVar.geomType == 'popup') {

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
                //console.log(country);


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
        //rsgislayer.createGislayerSpinner();

        var obj = { color: "gray", html: "Data for certain layers is available at the Country, State, and City level", visibility: "hidden" };
        rsgislayer.loadDisclaimer(obj);
        //rsgislayer.loadDisclaimer(disclaimerMain, { visibility: "hidden", color: grayColor + " !important" });


        //console.log(gisLayersDisplayFlag);
    },

    getListGisLayerCheckboxes: function () {

        var tempCheckboxes = [];

        var cbs = $("#maplayerscontainer").children("").find("input[type='checkbox']");
        for (var i = 0; i < cbs.length; i++) {
            //console.log("getListGisLayerCheckboxes(): "+cbs[i].id + "-"+cbs[i].checked);
            tempCheckboxes.push({ layerName: cbs[i].id, displayStatus: cbs[i].checked });
        }
        return tempCheckboxes;

    },

    updateCheckboxDisplay: function (currentZoom) {
        for (var i = 0; i < inputParameters.length; i++) {

            if (currentZoom < inputParameters[i].zoomThreshold) {
                $("#" + inputParameters[i].layerName).parent().prop('disabled', true);

                //$("#" + inputParameters[i].layerName).prop('disabled', true);



            } else {
                $("#" + inputParameters[i].layerName).parent().prop('disabled', false);
                //$("#" + inputParameters[i].layerName).prop('disabled', false);
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

        rsgislayer.clearCensusData();

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

                        //TRUE --> TRUE: no change.

                    } else {

                        //FALSE --> TRUE: Show the choosen layer.
                        rsgislayer.updateCurrentLayerStatus(tempCheckboxes[i]);
                        rsgislayer.getBboxPoints();
                        var showLayerOk = rsgislayer.showGisLayerBeta(tempCheckboxes[i]);

                    }

                } else {

                    if (tempCheckboxes[i].displayStatus == currentGisLayersStatus[i].displayStatus) {
                        //FALSE -> FALSE: no change.

                    } else {
                        //TRUE --> FALSE: Hide the choosen layer.
                        $("#layerspinner").css('visibility', 'hidden');
                        map.setOptions({ scrollwheel: true, draggable: true });

                        rsgislayer.updateCurrentLayerStatus(tempCheckboxes[i]);

                        var hideLayerOk = rsgislayer.hideGisLayerBeta(tempCheckboxes[i]);
                        if (hideLayerOk) {

                            if (tempCheckboxes[i].layerName != 'temperature') {
                                var obj = { color: grayColor + " !important;", html: disclaimerMain, visibility: "hidden" };
                                rsgislayer.loadDisclaimer(obj);
                            }
                            rsgislayer.manageMaplayersNotFound(false, tempCheckboxes[i].layerName);
                        }
                        rsgislayer.clearMaplayersIW();
                    }
                }
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
            //GMO BUSTOS - Close sidebar if QuickInfo is displayed
            if (getActivePane() != "" && map.getZoom() == 2) {
                sidebar.close();
            };


            /*if ($("input[name='demographic']").prop('checked')) {


                rsgislayer.getCountryBoundary(e, $('input[name=metricsLevel]:checked').val());

            } else {
                //do nothing
            }
            */

            if ($('input[name=demographic]:checked').attr('id') != null) {
                rsgislayer.onMonitoringGisLayers('click');
                rsgislayer.getCensusData(e.latLng, $('input[name=demographic]:checked').attr('id'));




            } else {

                //Reverse Geocoding
                rsgislayer.getReverseGeocoding(e.latLng);
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

    getReverseGeocoding: function (coord) {

        var html = {}
        html["Coordinates"] = '<br>Lat: ' + coord.lat() + ' <br>Lng: ' + coord.lng();

        $("#layerspinner").css('visibility', 'visible');
        var url = 'http:\//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=' + coord.lng() + '%2C' + coord.lat() + '&distance=200&outSR=&f=json';
        console.log(url);
        var apiRequest = $.ajax({
            type: 'GET',
            dataType: 'json',
            contentType: 'text/plain',
            url: url,
            success: function (data) {
                $("#layerspinner").css('visibility', 'hidden');
                console.log(data);
                if ('error' in data) {
                    rsgislayer.manageCDPmarker("", false);
                    $('.cdpcontrolbox-content').empty();
                    $('.cdpcontrolbox-content').append("Geolocation information not available.");
                    $('#cdpcontrolboxsubmit').hide();
                    $('.cdpcontrolbox-wrapper').css('display', 'block');
                } else {
                    rsgislayer.manageCDPmarker(coord, true);

                    var myData = data;
                    html['Country/Island'] = myData.address.CountryCode;
                    html['State/Province'] = myData.address.Region;
                    html['County/District'] = myData.address.Subregion;
                    html['City/Town'] = myData.address.City;
                    var addr = myData.address.Address;
                    var reg = /\d+/;;
                    var number = addr.match(reg);
                    html['Street#'] = number;
                    html['Street Name'] = addr;
                    html['ZipCode'] = myData.address.Postal;
                    html['Full Address'] = myData.address.Match_addr;

                    if (html['Country/Island'] == 'USA') {
                        var layer = new gmaps.ags.Layer('https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer/10');

                        var outfieldsArray = ["STATE", "COUNTY"];
                        var params = {
                            returnGeometry: false,
                            geometryType: "esriGeometryPoint",
                            inSR: "4326",
                            outSR: "4326",
                            outFields: outfieldsArray,

                            geometry: coord.lng() + ',' + coord.lat(),
                            spatialRelationship: "esriSpatialRelIntersects"

                        };

                        layer.query(params, processResultSet, callbackErr);

                        function processResultSet(data) {
                            console.log(data);
                            var attr = data.features[0].attributes;

                            var fipscode = attr['STATE'] + attr['COUNTY'];

                            var layer = new gmaps.ags.Layer('https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer/86');
                            //var layer = new gmaps.ags.Layer('http://services.nationalmap.gov/arcgis/rest/services/USGSTopoLarge/MapServer/25');

                            var outfieldsArray = "*";
                            var params = {
                                returnGeometry: false,
                                geometryType: "esriGeometryPoint",
                                inSR: "4326",
                                outSR: "4326",
                                outFields: "*",
                                where: 'GEOID=' + fipscode

                            };

                            layer.query(params, processResultSet, callbackErr);

                            function processResultSet(data) {
                                var attr = data.features[0].attributes;
                                html['County/District'] = attr['NAME'];
                                console.log(attr);

                                var text = "";
                                for (k in html) {
                                    if (html[k] != null)
                                        text += "<b><i>" + k + "</b></i>" + " : " + html[k] + "<br>";
                                }
                                $('.cdpcontrolbox-content').empty();
                                $('.cdpcontrolbox-content').append(text);
                                $('#cdpcontrolboxsubmit').show();
                                $('.cdpcontrolbox-wrapper').css('display', 'block');
                            }
                            function callbackErr(err) {
                                alert(err);
                            }


                        }

                        function callbackErr(err) {
                            alert(err);
                        }


                    } else {
                        var text = "";
                        for (k in html) {
                            if (html[k] != null) text += "<b><i>" + k + "</b></i>" + " : " + html[k] + "<br>";
                        }
                        $('.cdpcontrolbox-content').empty();
                        $('.cdpcontrolbox-content').append(text);
                        $('#cdpcontrolboxsubmit').show();
                        $('.cdpcontrolbox-wrapper').css('display', 'block');

                    }


                }

            },

            error: function (err) {
                $('.cdpcontrolbox-content').empty();
                $('.cdpcontrolbox-wrapper').css('display', 'none');
                console.log(err);
            }
        });

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

    getCountryBoundary: function (eventObj, level) {

        var pointLatLng = eventObj.latLng;

        var metricsUrl = null;
        /*
        ***  COUNTRIES ***
        http:\//gis.ncdc.noaa.gov/arcgis/rest/services/geo/references/MapServer/15
        
        *** CITIES ***
        http:\//gis.ncdc.noaa.gov/arcgis/rest/services/geo/references/MapServer/16
        */

        var layer = new gmaps.ags.Layer(metricsUrl);

        var params = {
            returnGeometry: true,
            geometryType: "esriGeometryPoint",
            inSR: "4326",
            outSR: "4326",
            outFields: outfieldsArray,

            geometry: pointLatLng.lng() + ',' + pointLatLng.lat(),
            spatialRelationship: "esriSpatialRelIntersects"

        };

        $("#layerspinner").css('visibility', 'visible');
        layer.query(params, processResultSet, callbackErr);

    },

    manageCDPmarker: function (coord, show) {
        if (show) {
            if (cdpMarker) {
                cdpMarker.setPosition(new google.maps.LatLng(coord.lat(), coord.lng()));
                cdpMarker.setMap(map);

            } else {
                cdpMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(coord.lat(), coord.lng())
                });
                cdpMarker.setMap(map);
            }
        } else {
            if (cdpMarker) {
                cdpMarker.setMap(null);
            }
        }

    },

    handlerMaplayersTitle: function (dataFlag, show, layerName) {

        if (dataFlag) {
            rsgislayer.manageMaplayersDivTitle(show, layerName);
        } else {
            rsgislayer.manageMaplayersNotFound(show, layerName);
        }

        //if ($('.btn-notfound').length == 0 || $('.btn-layertitle').length == 0) $('#controlboxlayername').hide();


    },
    manageMaplayersDivTitle: function (show, layerName) {
        if (show) {
            $('#controlboxlayername').show();
            if ($('#btn_' + layerName).length == 0) {


                if (layerName == 'state' || layerName == 'county' || layerName == 'tract') {

                    $('#controlboxlayername').append('<button id="btn_' + layerName + '" type="button" class="btn-layertitle btn btn-success btn-xs">'
                                                            + '<b>Demographic - ' + $('#' + layerName).parent().text().trim() + '</b>   <i class="fa fa-times fa-xs" aria-hidden="true"></i>' + '\
                                                            </button>');

                } else {
                    $('#controlboxlayername').append('<button id="btn_' + layerName + '" type="button" class="btn-layertitle btn btn-success btn-xs">' + '<b>'
                                                            + $('#' + layerName).parent().text().trim() + '</b>   <i class="fa fa-times fa-xs" aria-hidden="true"></i>' + '</button>');
                }



                $('#btn_' + layerName).click(function () {

                    $('#' + layerName).parent().removeClass('active');
                    $('#' + layerName).prop('checked', false);

                    if (layerName == 'state' || layerName == 'county' || layerName == 'tract') {


                        rsgislayer.clearCensusData();

                    } else {
                        //alert((this.id).split("_")[1]);
                        rsgislayer.onMonitoringGisLayers('click');
                    }


                });

            }


        } else {

            if (layerName == 'census') {

                $('#btn_state').remove();
                $('#btn_county').remove();
                $('#btn_tract').remove();

            } else {
                $('#btn_' + layerName).remove();
            }

            if ($('.btn-notfound').length == 0 && $('.btn-layertitle').length == 0) $('#controlboxlayername').hide();

        }
    },
    manageMaplayersNotFound: function (show, layerName) {
        if (show) {
            //replace #controlboxlayernotfound  with #controlboxlayername
            $('#controlboxlayername').show();
            if ($('#not_' + layerName).length == 0) {

                $('#controlboxlayername').append('<button id="not_' + layerName + '" type="button" class="btn-notfound btn btn-default btn-xs">\
                                                            ' + '<b>'
                                                            + $('#' + layerName).parent().text().trim() + '</b>   <i class="fa fa-times fa-xs" aria-hidden="true"></i></button>');

                $('#not_' + layerName).click(function () {

                    $('#' + layerName).parent().removeClass('active');
                    $('#' + layerName).prop('checked', false);

                    if (layerName == 'state' || layerName == 'county' || layerName == 'tract') {


                        rsgislayer.clearCensusData();

                    } else {
                        //alert((this.id).split("_")[1]);
                        rsgislayer.onMonitoringGisLayers('click');
                    }


                });

            }


        } else {
            if ($('#not_' + layerName).length != 0) {
                if (layerName == 'census') {

                    $('#not_state').remove();
                    $('#not_county').remove();
                    $('#not_tract').remove();

                } else {
                    $('#not_' + layerName).remove();
                }

            }
            /*$('#controlboxlayername').hide();*/

        }

    },

    toggleGisMenus: function () {

        if ($("#uscensus").prop("checked")) {

            //$("#censusCoverage").css("visibility", "visible");
            $("#censusCoverage").css("display", "block");
            var obj = { color: blueColor + " !important;", html: "<b>US. CENSUS</b> | Right-click on any location to request Census info.", visibility: "visible" };
            rsgislayer.loadDisclaimer(obj);
            //$("#metrics").prop('disabled', true);
        }
            /*else if ($("#metrics").prop("checked")) {
                ("#censusMetrics").css("visibility", "visible");
                $("#uscensus").prop('disabled', true);
            }
            */
        else {
            //$("#censusCoverage").css("visibility", "hidden");
            $("#censusCoverage").css("display", "none");
            //   $("#metricsCoverage").css("visibility", "hidden");

            //   $("#metrics").prop('disabled', false);
            //   $("#uscensus").prop('disabled', false);
            $("#layerspinner").css('visibility', 'hidden');
            rsgislayer.clearCensusData();
            var obj = { color: "gray", html: "Data for certain layers is available at the Country, State, and City level", visibility: "hidden" };
            rsgislayer.loadDisclaimer(obj);
        }
    },

    getCensusData: function (coord, level) {


        rsgislayer.clearCensusData();
        rsgislayer.manageMaplayersDivTitle(true, level);


        //alert(level);
        var censusUrl = null;
        var tigerwebUrl = null;
        var outfieldsArray = null;
        var censusSource = "2009-2013 American Community Survey 5-Year Profiles";
        //http://api.census.gov/data/2013/acs5.json

        var censusDataDict = {
            "NAME": "",
            "B19013_001E": "Income",
            "B19301_001E": "Income Per Capita",
            "B01003_001E": "Population",
            "B01002_002E": "Median Male Age",
            "B01002_003E": "Median Female Age"
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

        http://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2013/MapServer/85/query?where=1=1&f=pjson&outFields=*&returnGeometry=false

        http://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2013/MapServer/8/query?where=1=1&f=pjson&outFields=*&returnGeometry=false
        
        2) ***  COUNTRIES ***
        http://gis.ncdc.noaa.gov/arcgis/rest/services/geo/references/MapServer/15
        
        *** CITIES ***
        http://gis.ncdc.noaa.gov/arcgis/rest/services/geo/references/MapServer/16
        */


        //alert("Coord: " + coord + " - Level: " + level);

        //rsgislayer.clearGeoJSONdata();
        console.log(tigerwebUrl);

        var layer = new gmaps.ags.Layer(tigerwebUrl);

        var params = {
            returnGeometry: true,
            geometryType: "esriGeometryPoint",
            inSR: "4326",
            outSR: "4326",
            outFields: outfieldsArray,

            geometry: coord.lng() + ',' + coord.lat(),
            spatialRelationship: "esriSpatialRelIntersects"

        };

        $("#layerspinner").css('visibility', 'visible');
        layer.query(params, processResultSet, callbackErr);

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

                var apiRequest = $.ajax({
                    type: 'GET',
                    dataType: 'text',
                    contentType: 'text/plain',
                    url: censusUrl,
                    success: function (data) {
                        console.log(data);
                        createCensusPolygon(data, geom);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                        $("#layerspinner").css('visibility', 'hidden');
                        var obj = {
                            color: redColor + " !important;", html: "No " + ((level == "state") ? "State " : (level == "county") ? "County " : (level == "place") ? "City " : "")
                                + " data could be retrieve from the server", visibility: "hidden"
                        };
                        rsgislayer.loadDisclaimer(obj);

                        console.log('jqXHR:'); console.log(jqXHR);
                        console.log('textStatus:'); console.log(textStatus);
                        console.log('errorThrown:'); console.log(errorThrown);
                    }
                });

                /*apiRequest.done(function (response) {
                    var data = response;
                    //console.log(response);
                    createCensusPolygon(data, geom);

                });*/


            } else {

                $("#layerspinner").css('visibility', 'hidden');
                var obj = {
                    color: redColor + " !important;", html: "No " + ((level == "state") ? "State " : (level == "county") ? "County " : (level == "place") ? "City " : "")
                        + " data in the viewport area", visibility: "hidden"
                };
                rsgislayer.loadDisclaimer(obj);
            }


        }

        function callbackErr(err) {
            alert(err);
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


            google.maps.event.addListener(polygon, 'click', function () {

                //GMO BUSTOS - Close sidebar if QuickInfo is displayed
                if (getActivePane() != "" && map.getZoom() == 2) {
                    sidebar.close();
                };

                var myHTML = '<div id="iw-container">\
                                    <div class="iw-title" style="background-color: rgba(213,133,18,0.8) !important;">\
                                        <img src="/images/gisinfo.png" style="float:left;width:20px; height:20px; margin-left:10px; margin-right:8px;margin-bottom:4px;"/>\
                                        <b style="float: left">' + ((level == "state") ? "State " : (level == "county") ? "County " : (level == "tract") ? "Tract " : "") + '</b>\
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


                        } else {
                            myHTML += "<b>" + censusDataDict[labels[i]] + "</b>: " + values[i] + "<br/>";
                        }
                    }
                }

                myHTML += '</p><p style="font-family:Arial;font-size:10px !important;">Source:' + censusSource + '</p></div>\
                        </div>\
                        </div>';


                if (mobileDevice) {

                    var onlyContent = $(myHTML).find('.QuickInfoDesc');
                    $('.quickinfomodal-body').html(onlyContent);
                    $("#modalQuickinfo").modal("show");

                } else {
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
                            'margin-right': '48px', 'margin-top': '10px',

                            //left: '310px',top: '20px', // button repositioning

                            border: '13px light blue', // increasing button border and new color
                            'border-radius': '13px', // circular effect
                            'box-shadow': '0 0 5px #3990B9' // 3D effect to highlight the button
                        });

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
                }






            });

            censusPolyArray.push(polygon);
            polygon.setMap(map);
            $("#layerspinner").css('visibility', 'hidden');

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

    },

    clearGeoJSONdata: function () {

        map.data.forEach(function (feature) {
            map.data.remove(feature);
        });

        var obj = { color: "gray", html: "Data for certain layers is available at the Country, State, and City level", visibility: "hidden" };
        rsgislayer.loadDisclaimer(obj);
    },

    clearCensusData: function () {

        rsgislayer.manageMaplayersDivTitle(false, "census");
        if (censusPolyArray.length != 0) {

            for (var i = 0; i < censusPolyArray.length; i++) {
                //console.log(this.geomArrayAirport[i]);
                censusPolyArray[i].setMap(null);
            }

            censusPolyArray.length = 0;

        }

        //for (var i = 0; i < infowindowsArray.length; i++) {

        //    infowindowsArray[i].close();
        //}
        rsgislayer.clearMaplayersIW();


        var obj = { color: "gray", html: "Data for certain layers is available at the Country, State, and City level", visibility: "hidden" };
        rsgislayer.loadDisclaimer(obj);
    },

    clearMaplayersIW: function () {
        for (var i = 0; i < infowindowsArray.length; i++) {

            infowindowsArray[i].close();
        }
    },

    getCheckboxName: function (ev) {
        var filepath = kmlkmzSource[$(ev).attr('id')];
        var fileextension = ($(ev).attr('id')).split("_")[1];


        if ($(ev).prop('checked')) {

            if (fileextension == 'kmz') rsgislayer.readKMZ(filepath);
            if (fileextension == 'kml') rsgislayer.readKML(filepath);
        } else {

            if (fileextension == 'kmz') rsgislayer.removeKMZ(filepath);
            if (fileextension == 'kml') rsgislayer.removeKML(filepath);

        }


    },

    fireTimeoutWatch: function () {

        setTimeout(function () {

            if (layerQueryWatch) {

                //alert("WATCH - Source not available, please try again");
                $("#layerspinner").css('visibility', 'hidden');
                map.setOptions({ scrollwheel: true, draggable: true });
            }


        }, 30000);

    },

    getGEfileExtension: function (filename) {

        return filename.split('.').pop();
    },

    removeJSfiles: function (jsFileArray) {

        var allsuspects = document.getElementsByTagName("script");
        for (var j = 0; j < jsFileArray.length; j++) {
            for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
                if (allsuspects[i] && allsuspects[i].getAttribute("src") != null && allsuspects[i].getAttribute("src").indexOf(jsFileArray[j]) != -1)
                    allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
            }
        }

        return true;
    },

    loadJSfiles: function (jsFileArray) {

        var headRef = document.getElementsByTagName('head');

        for (var i = 0; i < jsFileArray.length; i++) {

            var fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", jsFileArray[i]);
            $(headRef)[0].appendChild(fileref);

        }

        return true;
    },

    readKML: function (filename) {



        if (!readerKML) {

            var jsLibraries = ["map/Scripts/gislayers/geoxml3/polys/geoxml3.js"];


            rsgislayer.loadJSfiles(jsLibraries);

            window.setTimeout(function () {

                readerKML = new geoXML3.parser({
                    map: map,
                    processStyles: false,
                    singleInfoWindow: true,
                    zoom: false,
                    afterParse: rsgislayer.postProcessKML

                });

                google.maps.event.addListener(readerKML, 'parsed', function (e) {

                    $("#layerspinner").css('visibility', 'hidden');

                })

                $("#layerspinner").css('visibility', 'visible');
                readerKML.parse(filename);

            }, 100);

            rsgislayer.removeJSfiles(jsLibraries);
            jsLibraries.length = 0;

        } else {

            if (rsgislayer.getDocs(filename, readerKML).length == 0) {
                //alert("parsea");
                $("#layerspinner").css('visibility', 'visible');
                readerKML.parse(filename);
            } else {
                //alert("only show")
                var doc = rsgislayer.getDocs(filename, readerKML);
                readerKML.showDocument(doc);
                if (doc.baseUrl.split("/").pop() == "airnow_conditions.kml") {
                    doc.markers[0].setVisible(false);
                }
            }

        }

        //readerKML.docs[0].gpolygons[0].infoWindow.getContent();

    },

    removeKML: function (filename) {

        readerKML.hideDocument(rsgislayer.getDocs(filename, readerKML));

    },

    postProcessKML: function (doc) {

        if (doc[0].baseUrl.split("/").pop() == "airnow_conditions.kml") {
            // alert("FOUNDAIRKML");
            doc[0].markers[0].setVisible(false);
        }

    },

    readKMZ: function (filename) {


        if (!readerKMZ) {

            var jsLibraries = ["map/Scripts/gislayers/geoxml3/kmz/geoxml3.js", "map/Scripts/gislayers/geoxml3/kmz/ZipFile.complete.js"];
            rsgislayer.loadJSfiles(jsLibraries);

            window.setTimeout(function () {
                readerKMZ = new geoXML3.parser({
                    map: map,
                    processStyles: true,
                    singleInfoWindow: true,
                    zoom: false,
                    //createMarker: addMyMarker,
                    afterParse: rsgislayer.dataProcessKMZ
                });
                google.maps.event.addListener(readerKMZ, 'parsed', function (e) {
                    $("#layerspinner").css('visibility', 'hidden');
                })

                $("#layerspinner").css('visibility', 'visible');
                readerKMZ.parse(filename);


            }, 100);

            window.setTimeout(function () {
                rsgislayer.removeJSfiles(jsLibraries);
                jsLibraries.length = 0;
            }, 100);



        } else {
            console.log("LENGTH: " + rsgislayer.getDocs(filename, readerKMZ));
            if (rsgislayer.getDocs(filename, readerKMZ).length == 0) {

                //alert("KMZ - parsea");
                $("#layerspinner").css('visibility', 'visible');
                readerKMZ.parse(filename);

            } else {

                //alert("only show KMZ")
                readerKMZ.showDocument(rsgislayer.getDocs(filename, readerKMZ));

            }
        }


    },

    removeKMZ: function (filename) {

        readerKMZ.hideDocument(rsgislayer.getDocs(filename, readerKMZ));

    },

    dataProcessKMZ: function (doc) {


        var myDoc = doc[0];
        if ((myDoc.url == kmlkmzSource["borders_kmz"]) && myDoc.markers.length == 0) {



            ////customizeInfoWindow(doc[0]);

            for (var j = 0; j < myDoc.placemarks.length; j++) {


                var placemark = myDoc.placemarks[j];


                //console.log("CREATE MARKERS FOR Borders");
                //var contentText = customizeMarkerInfoWindow(placemark.description);

                //console.log(placemark.description);

                var customIcon = {
                    url: '/GithubTests/map/icons/gislayers/icon-borderCrossing-red.png',

                    scaledSize: new google.maps.Size(25, 25)

                };

                var marker = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(placemark.Point.coordinates[0].lat, placemark.Point.coordinates[0].lng),
                    icon: customIcon,
                    description: placemark.description
                });


                //var infowindow = new google.maps.InfoWindow({
                //    content: rsgislayer.getHtmlString(placemark.description, fileToLayerDict[myDoc.url]),
                //});
                var infowindow = new google.maps.InfoWindow();

                google.maps.event.addListener(marker, 'click', function (e) {

                    //GMO BUSTOS - Close sidebar if QuickInfo is displayed
                    if (getActivePane() != "" && map.getZoom() == 2) {
                        sidebar.close();
                    };

                    map.setZoom(14);
                    map.setCenter(this.getPosition());
                    infowindow.setContent(rsgislayer.getHtmlString(this.description, fileToLayerDict[myDoc.url]));
                    infowindow.open(map, this);

                });


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
                        'margin-right': '48px', 'margin-top': '10px',

                        //left: '310px',top: '20px', // button repositioning

                        border: '13px light blue', // increasing button border and new color
                        'border-radius': '13px', // circular effect
                        'box-shadow': '0 0 5px #3990B9' // 3D effect to highlight the button
                    });

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


                tempKMZarray.push(marker);

            }


            myDoc.markers = new Array();
            myDoc.markers = tempKMZarray;

        }
    },

    getHtmlString: function (content, titleName) {

        var myHTML = '<div id="iw-container">\
                        <div class="iw-title" style="background-color: rgba(213,133,18,0.8) !important;">\
                            <img src="/images/gisinfo.png" style="float:left;width:20px; height:20px; margin-left:10px; margin-right:8px;margin-bottom:4px;"/>\
                            <b style="float: left">' + titleName + '</b>\
                        </div>\
                        <div style="max-height:200px;overflow-x: hidden;margin-bottom:3px; margin-left:10px;">\
                        <div class="QuickInfoDesc" style="overflow:visible;">';
        myHTML += content;
        myHTML += '</div>\
            </div>\
            </div>';

        return myHTML;

    },

    getDocs: function (filename, reader) {

        for (var i = 0; i < reader.docs.length; i++) {
            if (reader.docs[i].url == filename) {
                return reader.docs[i];
            }
        }
        return [];
    }
}
//removeAllKmzKml: function () {

//    if (readerKML != null) for (var i = 0; i < readerKML.docs.length; i++) {
//        readerKML.hideDocument(readerKML.docs[i]);
//    }

//    if (readerKMZ != null) for (var i = 0; i < readerKMZ.docs.length; i++) {
//        readerKMZ.hideDocument(readerKMZ.docs[i]);
//    }

//}


function drawWMS(layerFlag) {




    //Define custom WMS tiled layer
    var SLPLayer = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            var proj = map.getProjection();
            var zfactor = Math.pow(2, zoom);
            // get Long Lat coordinates
            var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
            var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));

            //corrections for the slight shift of the SLP (mapserver)
            var deltaX = 0.0013;
            var deltaY = 0.00058;

            //create the Bounding box string
            var bbox = (top.lng() + deltaX) + "," +
                           (bot.lat() + deltaY) + "," +
                           (bot.lng() + deltaX) + "," +
                           (top.lat() + deltaY);

            var url = "http://idpgis.ncep.noaa.gov/arcgis/services/NWS_Forecasts_Guidance_Warnings/watch_warn_adv/MapServer/WMSServer?";

            //var url = "http://gis.fema.gov/SOAP/services/FEMA/PowerOutages/MapServer/WMSServer?";
            url += "&SERVICE=WMS";    //WMS service
            url += "&VERSION=1.3.0";  //WMS version  
            url += "&REQUEST=GetMap"; //WMS operation
            url += "&LAYERS=" + "1"; //WMS layers
            url += "&STYLES=default";
            url += "&CRS=CRS:84";//"CRS=EPSG:4326";     //set WGS84 
            //url += "&SRS=EPSG:4326";
            url += "&FORMAT=image/png"; //WMS format
            url += "&TRANSPARENT=TRUE";
            //url += "&BGCOLOR=0xFFFFFF";
            url += "&BBOX=" + bbox;      // set bounding box
            url += "&WIDTH=256";         //tile size in google
            url += "&HEIGHT=256";
            console.log(url);
            return url;                 // return URL for the tile

        },
        tileSize: new google.maps.Size(256, 256),
        isPng: true,
        opacity: 1
    });

    // mapInstance.overlayMapTypes.push(temperatureLayer);
    map.overlayMapTypes.push(null); // create empty overlay entry
    map.overlayMapTypes.setAt("1", SLPLayer);

}

function getLegend(url) {


    $('.legend-content').empty();


    $.ajax({
        url: url + "?f=json",
        dataType: 'json',
        success: function (data) {
            //console.log(data);
            var drawData = data.drawingInfo.renderer;
            if (drawData.type == "classBreaks") {

                myData = drawData.classBreakInfos;
                console.log(myData);
                var html = '<svg height="' + 20 * (myData.length) + '" width="' + $('#legend-content').width + '">';
                for (var i = 0; i < myData.length; i++) {
                    console.log(myData[i]);

                    var item = myData[i];
                    var color = 'rgba(' + item.symbol.color[0] + ',' + item.symbol.color[1] + ',' + item.symbol.color[2] + ',1)';
                    var label = (item.label).replace('"', '');

                    html += '<rect id="myRect" height="10" width="10" fill="' + color + '" transform="translate(0 ' + i * 20 + ')"/>\
                                                    <text x="20" y="' + parseInt(8 + i * 20) + '" fill="red" font-size="10px" font-family="sans-serif">' + label + '</text>';

                }
                html += '</svg>';

                $('.legend-content').append(html);
                $('.legend-wrapper').css('display', 'block');




            } else if (drawData.type == "uniqueValue" && drawData.uniqueValueInfos.length > 1) {
                myData = drawData.uniqueValueInfos;
                console.log(myData);
                var html = '<svg height="' + 20 * (myData.length) + '" width="' + $('#legend-content').width + '">';
                for (var i = 0; i < myData.length; i++) {
                    console.log(myData[i]);

                    var item = myData[i];
                    var color = 'rgba(' + item.symbol.color[0] + ',' + item.symbol.color[1] + ',' + item.symbol.color[2] + ',1)';
                    var label = (item.label).replace('"', '');

                    html += '<rect id="myRect" height="10" width="10" fill="' + color + '" transform="translate(0 ' + i * 20 + ')"/>\
                                                    <text x="20" y="' + parseInt(8 + i * 20) + '" fill="red" font-size="10px" font-family="sans-serif">' + label + '</text>';

                }
                html += '</svg>';

                $('.legend-content').append(html);
                $('.legend-wrapper').css('display', 'block');

            } else {
                console.log(drawData);
            }


        }

    });
}

function myCallback(result) {

    var drawData = result.drawingInfo.renderer;

    var legendObj = {
        domainArray: [],
        colorLabel: {},
    };


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
        dummyVar = legendObj;
        console.log(legendObj);
        //console.log(legendObj);
        return legendObj;

    }

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
}

function foo(callback, url) {
    //url = 'http://gis.fema.gov/REST/services/FEMA/PowerOutages/MapServer/0';

    $.ajax({
        url: url + "?f=pjson",
        dataType: 'jsonp',
        success: callback
    })
}
