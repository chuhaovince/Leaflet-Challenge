var tectonicURL = "assets/tectonic_GeoJSON/PB2002_boundaries.json";
var earthquake_geoJsonURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function CreateMap(earthquake, tectonic) {
  var mapConfig = {
    center: [37.09, -95.71],
    zoom:5,
    types : [
      satellitemap,
      earthquake,
      tectonic
    ]
  };

  var greyscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  // Create a basemap object to hold the greyscale layer
  var basemap = {
    "Greyscale" : greyscalemap,
    "Outdoors" : outdoormap,
    "Satellite" : satellitemap
  };

  // Create an overlaymap object to hold the earthquake and tectonic layers
  var overlays = {
    "Earthquakes" : earthquake,
    "Fault lines" : tectonic
  };
  
  // Create the default map with the satellite layers
  var map = L.map("map", mapConfig);

  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(basemap, overlays, {collapsed : false}).addTo(map);

  // Adding legends
  var legend = L.control({position : "bottomright"});
  legend.onAdd = function() {
      var div = L.DomUtil.create('div', 'info legend'),
      mags = [0, 1, 2, 3, 4, 5],
      labels = [];

      // loop through colors
      for (var i = 0; i < mags.length; i++) {
          labels.push('<i class = "box" style="background:' + colorscale(mags[i]+1) + '"> </i>' +
          mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+'))
      };
      div.innerHTML += labels.join("");

      return div;
  };
  legend.addTo(map);

};

// Define color scales
function colorscale(color) {
  return color > 5  ?  "#c71e1e" :
         color > 4  ?  "#ea822c" :
         color > 3  ?  "#ee9c00" :
         color > 2  ?  "#eecc00" :
         color > 1  ?  "#b8d800" :
                       "#98ee00";
}

// Create earthquake layergroup
var earthquake = new L.layerGroup();
//create tectonic layergroup
var tectonic = new L.layerGroup();


// Loading earthquake geojson data and add the data to earthquake variable
d3.json(earthquake_geoJsonURL, function(response) {
  response.features.forEach(location => 
      L.circle(location.geometry.coordinates.slice(0,2).reverse(), {
          fillOpacity : 0.8,
          color : colorscale(location.properties.mag),
          radius : location.properties.mag * 10000
      })
      .bindPopup(`<h3><strong>${location.properties.place}</strong></h3><hr><h4>M level: ${location.properties.mag}</h4><hr><h4>Time: ${new Date(location.properties.time)}</h4>`)
  ).addTo(earthquake);
});

// Load tectonic data and add to tectonic variable
d3.json(tectonicURL, function(response) {
  L.geoJSON(response, {
    style : function() {
      return {
        fillOpacity: 0.7,
        weight : 1.5,
        fillColor : "orange"
      }
    }
  }).addTo(tectonic)
});

CreateMap(earthquake, tectonic);
