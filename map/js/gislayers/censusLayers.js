rscensuslayer = {

    getState: function (coordObj) {

        var sdk = new CitySDK(); //Create the CitySDK Instance
        census = sdk.modules.census; //Create an instance of the module
        census.enable("504a1d1e3b08f9aed6ced2d9fc88d65673977648"); //Enable the module with the api key

        var request = {
            "lat": coordObj.lat,
            "lng": coordObj.lng,
            "level": "state"/*,
           /"variables": [
                "income",
                "population"
            ]*/
        };

        census.GEORequest(request, function (response) {
            map.data.loadGeoJson(response);
        });

    }

}



