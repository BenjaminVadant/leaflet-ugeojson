Leaflet uGeoJSON Layer 
=============================

## What is it?
A [Leaflet](http://leafletjs.com/) plugin to create a custom GeoJSON overlay which is updated after each drag and each zoom. 
The "u" stands for "updating".


## Installation
Just copy src/leaflet.uGeoJSON.js into your working directory.


## How to use it?
The plugin trigger an ajax POST call each time you move the map. This ajax call sends at least 5 parameters : 
* North latitude
* South latitude
* East longitude
* West longitude
* Zoom level

So you need a server that uses this parameters to generate a GeoJSON.

Here is the basic example : 

```javascript
var attr_osm = 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors',
var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

var map = new L.Map('map').addLayer(osm).setView(new L.LatLng(52.265, 10.524), 14);

L.uGeoJSONLayer({ endpoint:"URL TO SERVER"
                }).addTo(map);
```

## What are the options?
As this layer is based on the GeoJSON layer, you can use all the original options.

Here are the additionnal options you can specify as an argument of L.uGeoJSONLayer.
* endpoint: Mandatory : the url of the server the plugin is going to reach for new data,

* debug: display debug log in the console or not. Default : false,
* light: remove or not data after updating. Default : true,

* maxRequests: the number of parallel requests allowed. Default : 5,
* pollTime: the time in ms between 2 updates without moving. Default : 0 (ie no automatic update)

* parameters: additional parameters to the post requests,

## How to use the "parameters" option?
This option can be used in 2 ways : 
* static : ```javascript parameters:{toto:123}, ```
* dynamic: ```javacript parameters:{toto:{scope:"window"}}, ```

In the second case, the plugin is going to look for the value of window["toto"] as the value of the post parameters toto.

## Dependencies
- Leaflet (tried with version 0.7.3)

## Development
This plugin is working but might not be optimal, so feel free to fork it and send PR!

## Remark
I'm not using the "movend" event as it triggers strange behavior : it can start an autocall loop! So I prefer to use dragend and zoomend.

##Thanks
I would like to thank kartenkarsten for his plugin https://github.com/kartenkarsten/leaflet-layer-overpass/ which was a base for this one.
