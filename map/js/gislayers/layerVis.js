var dynamap;
var map;
var service;

function getArcgisMapOverlay(mapId) {
    alert("DENTRO DE LA FUNCION");
    /*var myOptions = {
        zoom: 4,
        center: new google.maps.LatLng(40, -95),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: true
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    */
    
        map = mapId;


        //var url = "http:\//sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer";
        //var url = 'http:\//sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer';
        //var url = 'http:\//gis.srh.noaa.gov/arcgis/rest/services/RIDGERadar/MapServer';
        //var url = 'http:\//gis.srh.noaa.gov/arcgis/rest/services/FOP/MapServer';
        //var url = 'http:\//ndgishub.nd.gov/ArcGIS/rest/services/All_Elevation/MapServer';
        //var url = 'http:\//raster.nationalmap.gov/ArcGIS/services/LandCover/USGS_EROS_LandCover_NLCD/MapServer/WCSServer?request=GetCapabilities&service=WCS';
        //var url = 'http:\//services.nationalmap.gov/arcgis/rest/services/nhd/MapServer';
        //var url = "http:\//services.nationalmap.gov/arcgis/rest/services/structures/MapServer";
        //var url = "https:\//nowcoast.noaa.gov/arcgis/rest/services/nowcoast/sat_meteo_imagery_goes_time/MapServer";


        
        //var url = "http:\//igems.doi.gov/ArcGIS/rest/services/igems_info/MapServer";
        //var url = "http:\//igems.doi.gov/ArcGIS/rest/services/igems_haz/MapServer";
        var url = "http:\//services.nationalmap.gov/arcgis/rest/services/structures/MapServer";
        console.log(url);

        dynamap = new gmaps.ags.MapOverlay(url, {
            opacity: 1
        });

        //if (flag) {

        google.maps.event.addListenerOnce(dynamap.getMapService(), 'load', function () {
            dynamap.setMap(map);
            service = dynamap.getMapService();
            console.log(service);
            
            for (var i = 0; i < service.layers.length; i++) {
                
                if (service.layers[i].id == 5 || service.layers[i].id == 6 || service.layers[i].id == 7){
                    service.layers[i].visible = true;
                } else {
                    service.layers[i].visible = false;
                }
                                //toc += ' checked="checked"';

                dynamap.refresh();

            }
        });

}

function setVis() {
    var service = dynamap.getMapService();
    for (var i = 0; i < service.layers.length; i++) {
        var el = document.getElementById('layer' + service.layers[i].id);
        service.layers[i].visible = (el.checked === true);
    }
    dynamap.refresh();
}

function setVisOff() {
    var service = dynamap.getMapService();
    for (var i = 0; i < service.layers.length; i++) {
        var el = document.getElementById('layer' + service.layers[i].id);
        service.layers[i].visible = (false);
    }
    dynamap.refresh();
}

window['setVis'] = setVis;
//window.onload = init;