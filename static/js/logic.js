// How to capitalize first letter easily? is something like this really the easiest way?(this is for the marker pop-ups, i waned to capitalize the properties.type):
    // https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript

// Please check line 119 for a question


function chooseColor(magnitude) {
  switch (true) {
  case magnitude > 5:
    return "#E74737";
  case magnitude > 4:
    return "#F49D2C";
  case magnitude > 3:
    return "#E7BB4A";
  case magnitude > 2:
    return "#2C8983";
  case magnitude > 1:
  return "#0E3C74";
  default:
    return "#0000FF";
  }
}


function createMap() {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var earth = new L.LayerGroup()
  var overlays = {
    Earthquakes: earth
  }


  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Light Map": lightmap
  };

  // Create the map object with options
  var map = L.map("map", {
    center: [37.7749, -100.4194],
    zoom: 3,
    layers: [streetmap,earth]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps,overlays).addTo(map);

  // Grabbing our GeoJSON data..
  d3.json(url, function(data) {
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
      pointToLayer:function(feature,latlng){
        return L.circleMarker(latlng)
      },
      // Style each feature (in this case a neighborhood)
      style: function(feature) {
        return {
          color: "#000",
          // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
          fillColor: chooseColor(feature.properties.mag),
          fillOpacity: 1,
          weight: 1.5,
          radius: feature.properties.mag*2
        };
      },
      // Called on each feature
      onEachFeature: function(feature, layer) {
        // Giving each feature a pop-up with information pertinent to it
        layer.bindPopup(`<h3>${feature.properties.type}: ${feature.properties.title}<h3><hr><p>${new Date(feature.properties.time)}</p>`);
  
      }
    }).addTo(earth);

    // an object legend
    var legend = L.control({
      position: "bottomright"
    });
  
    // details for the legend
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
  
      var grades = [0, 1, 2, 3, 4, 5];
      var colors = [
        "#0000FF",
        "#0E3C74",
        "#2C8983",
        "#E7BB4A",
        "#F49D2C",
        "#E74737"
      ];
  
  
      // Looping through, SIDE NOTE: line 123 I wasn't sure how to make the ternary operator fully work with the f-string so I had to use the concatenation for that part. Can you show how to do it correctly?
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          `<i style='background:${colors[i]}'></i>
          ${grades[i]} ${(grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+")}`;
      }
      return div;
    };
  
    // Finally, we our legend to the map.
    legend.addTo(map);

  });
  
}

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

createMap()