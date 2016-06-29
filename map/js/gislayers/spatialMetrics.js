function getSpatialMetrics(_loadedPoints) {

    for (var i = 0; i < _loadedPoints.length; i++) {

        var pointData = _loadedPoints[i];
        console.log(pointData);
        var markerparam = {
            //title: pointData.mapId.toString(),
            mapId: pointData.mapId.toString(),
            dataPointId: pointData.dataPointId,
            lat: pointData.latitude.toString(),
            lon: pointData.longitude.toString(),
            title1: pointData.title1,
            tier1: pointData.tier1,
            tier2: pointData.tier2,
            publishDate: pointData.publishDt,
            color: pointData.color,
            epixColor: pointData.epixColor,
            epixColorDescription: pointData.epixColorDescription,
            city: pointData.city,
            state: pointData.State,
            country: pointData.country,
            publishDt: pointData.publishDt,
            title2: pointData.title2,
            eventName: pointData.eventName,
            eventLocation: pointData.eventLocation,
            eventShortLocation: pointData.eventShortLocation,
            eventTitle: pointData.eventTitle,
            displayDt: pointData.displayDt,
            source: pointData.source,
            description: pointData.description,
            blinkenable: true // enable cluster blinking
        };
    }

}