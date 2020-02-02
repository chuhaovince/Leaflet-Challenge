var mapConfig = {
    center: [-115.5701667, 33.082],
    zoom: 11
};

var tileURL = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"

var tileConfig = {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.street-basic",
  accessToken: API_KEY
};

var geoJsonURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var map = L.map("map", mapConfig);

// Adding tile layer
L.tileLayer(tileURL, tileConfig).addTo(map);

// Loading geojson data
d3.json(geoJsonURL).then(function(response) {
    var geodata = L.choropleth(response, {

        // Define what property in the features to use
        valueProperty : ""
    })
})