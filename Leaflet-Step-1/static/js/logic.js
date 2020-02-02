var mapConfig = {
    center: [37.09, -95.71],
    zoom:4
};

var tileURL = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"

var tileConfig = {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
};

var geoJsonURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var map = L.map("map", mapConfig);

// Adding tile layer
L.tileLayer(tileURL, tileConfig).addTo(map);


// Loading geojson data
d3.json(geoJsonURL).then(function(response) {
    console.log(response.features[0].geometry.coordinates.slice(0,2))
    response.features.forEach(location => 
        L.circle(location.geometry.coordinates.slice(0,2).reverse(), {
            fillOpacity : 0.75,
            color : "red",
            radius : location.properties.mag * 10000
    })
    .bindPopup(`<h3 style = {"text-align": "center"}><strong>${location.properties.place}</strong></h3><hr><h4 style = {"text-align": "center"}>M level: ${location.properties.mag}</h4><hr><h4 style = {"text-align": "center"}>Time: ${Date.parse(location.properties.time)}</h4>`)
    .addTo(map)
    )
});
