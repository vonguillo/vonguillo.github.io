
//SET  <head><title> NODE

var data = {
    "widget": {
        "windowTitle": "NSAR360",
        "upperSidebarTabs": [
            {
                "href": "entities",
                "icon": "fa fa-bars",
                "sidebarHeader": "Entities",
                "sidebarContentPath": "map/html/prt/tab-entities.html",
                "availability": ""
            },
            {
                "href": "filter",
                "icon": "fa fa-search",
                "sidebarHeader": "Filter",
                "sidebarContentPath": "map/html/prt/tab-filter.html",
                "availability": ""

            },
             {
                 "href": "maplayers",
                 "icon": "fa fa-map-marker",
                 "sidebarHeader": "Map Layers",
                 "sidebarContentPath": "map/html/prt/tab-maplayers.html",
                 "availability": ""

             },

            {
                "href": "profile",
                "icon": "fa fa-user",
                "sidebarHeader": "Entities",
                "sidebarContentPath": "map/html/prt/tab-profile.html",
                "availability": "class='disabled'"
            }
        ],
        "lowerSidebarTabs": [

            {
                "href": "settings",
                "icon": "fa fa-cog",
                "sidebarHeader": "Settings",
                "sidebarContentPath": "map/html/prt/tab-settings.html",
                "availability": ""
            }

        ]

    }
};

$('head title').html("NSAR360");

var upperGroup = $("#sidebar .sidebar-tabs ul[role='tablist']")[0];

var lowerGroup = $("#sidebar .sidebar-tabs ul[role='tablist'")[1];


function getWebsiteParameters() {


            // FILLING <head><title>
            $('head title').html(data.widget.windowTitle);


            var upperTabsArray = data.widget.upperSidebarTabs;
            var lowerTabsArray = data.widget.lowerSidebarTabs;
            var divId = null;
            // FILLING UPPER TABS
            var html = '';
            for (var i = 0; i < upperTabsArray.length; i++) {
     
                html += '<li ' + upperTabsArray[i].availability + '><a role="tab" href="#' + upperTabsArray[i].href + '"><i class="' + upperTabsArray[i].icon + '"></i></a></li>';

                $('.sidebar-content').append('<div class="sidebar-pane" id="' + upperTabsArray[i].href + '">\
                                            <h1 class="sidebar-header">' + upperTabsArray[i].sidebarHeader + '<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>\
                                            <div id="' + upperTabsArray[i].href + 'content"></div>\
                                            </div>');

                console.log("#" + upperTabsArray[i].href + "content");
                $("#" + upperTabsArray[i].href + "content").load(upperTabsArray[i].sidebarContentPath);


            }
            upperGroup.innerHTML = html;

            //FILLING LOWER TABS
            html = '';
            for (var i = 0; i < lowerTabsArray.length; i++) {
                html += '<li ' + lowerTabsArray[i].availability + '><a role="tab" href="#' + lowerTabsArray[i].href + '"><i class="' + lowerTabsArray[i].icon + '"></i></a></li>';

                $('.sidebar-content').append('<div class="sidebar-pane" id="' + lowerTabsArray[i].href + '">\
                                            <h1 class="sidebar-header">' + lowerTabsArray[i].sidebarHeader + '<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>\
                                          <div id="' + lowerTabsArray[i].href + 'content"></div>\
                                          </div>');

                console.log("#" + lowerTabsArray[i].href + "content");
                $("#" + lowerTabsArray[i].href + "content").load(lowerTabsArray[i].sidebarContentPath);

            }
            lowerGroup.innerHTML = html;


            initialize();
        

}


function initialize() {
    // Initial SPINNER
    createGislayerSpinner();
    $("#layerspinner").css('visibility', 'visible');

    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(40.76325169676985, -73.96080873254686),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    google.maps.event.addListenerOnce(map, 'idle', function () {
        //alert("map IDLE ready");

        mq992.addListener(handleOrientationChange);
        handleOrientationChange(mq992);

        
        loadEvents();
        loadMapData();
        //updateEntityPanel();
    });

    sidebar = $('#sidebar').sidebar();
    var mapcontrol = $('#sidebar').mapcontrol($('#horizontalcontrol'));



}