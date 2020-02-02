var mapConfig = {
    center: [37.09, -95.71],
    zoom:5
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
    response.features.forEach(location => 
        L.circle(location.geometry.coordinates.slice(0,2).reverse(), {
            fillOpacity : 0.8,
            color : colorscale(location.properties.mag),
            radius : location.properties.mag * 10000
    })
    .bindPopup(`<h3><strong>${location.properties.place}</strong></h3><hr><h4>M level: ${location.properties.mag}</h4><hr><h4>Time: ${new Date(location.properties.time)}</h4>`)
    .addTo(map)
    );

    // Define color scales
  function colorscale(color) {
    return color > 5  ? '#ff1111' :
           color > 4  ? '#ff6633' :
           color > 3  ? '#ff9933' :
           color > 2  ? '#ffcc33' :
           color > 1  ? '#ffff33' :
                        '#ccff33';
  }
    // Adding legends
    var legend = L.control({position : "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend'),
        mags = [0, 1, 2, 3, 4, 5],
        labels = [];

        // loop through colors
        for (var i = 0; i < mags.length; i++) {
            labels.push('<i style="background:' + colorscale(mags[i]) + '"></i>' +
            mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+'))
        };
        div.innerHTML += labels.join("");

        return div;
    };
      legend.addTo(map);
});
