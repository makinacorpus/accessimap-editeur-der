=========
CHANGELOG
=========

0.6
-------------------

**New features**

* Radial menu to interact with the objects
* Optionnaly add an empty area surrounding a point
* Optionnaly add an empty area surrounding a text
* Move a point
* Rotate a point
* Improve the line/polygon vertex edition
* Optionnaly add an arrow at line end
* Edit color and pattern with radial menu
* Optionnaly smooth a line

**Minor changes**

* Add a north orientation symbol
* Vertical symbols are no more proposed as the vertical orientation can be achieved through the rotation tool

**Bug fixes**

* Inner and outer paths of a same line are not tied together with a class (link_id) and an attribute (data-link)

0.5
-------------------

**New features**

* Address search: center the map on one or two locations
* Address search: add points on the found locations
* Add a color in pattern's background
* Start from a white page
* Transform the tiles images into base64 so they can be exported
* Introduce layers to order the features drawing
* Allow zooming on edition
* Magnetic lines on Ctrl press to draw vertical or horizontal lines

**Minor changes**

* Add a zebra crossing line style
* Delete the zebra crossing points
* Same icon for the start and stop points when searching an address
* Switch the geocoding provider from Addok to Nominatim (allow searching bus stops)

**Bug fixes**

* Add waterway=riverbank in the "water" preset
* When searching an address, delete the previously added icon
* Do not duplicate the #deletedElement objects
* Be able to write text after a feature has been deleted
* Fix header of the interactions XML

0.4
-------------------

**New features**

* Import a JPG or PNG image
* Import a PDF file
* Add interaction filters
* Export an XML file with interaction filters
* Possibility to add/remove a contour or a white background to any polygon style
* Write in braille or Arial font, several sizes and colors
* Choose file name to be downloaded
* Change polygon style
* Rotate all point features
* Add a background pattern

**Minor changes**

* Show a temporary line when drawing  polygon with no stroke
* Increase width of map contour
* Change color and text of the button to go the the edition step
* Add a new line style
* Explicit text on map rotation slider
* White margin around the map cannot be deleted nor moved
* Be able to delete a rect and an ellipse
* Layout changes
* Improve how the point styles are displayed

**Internal features**

* Refactoring
* Automatic testing and code coverage

0.3
-------------------

**New features**

* Circle drawing
* Parallel ways drawing
* A4 and A3 formats
* Add address search tool
* Add margins around the map and legend
* Add interaction areas
* Undo the last delete action
* Multiline text
* Starting from a SVG, be able to delete it on export
* Rotate symbol on local map

**Minor changes**

* Add zebra crossings from OSM as points
* Add partners logos tothe footer
* Add arrow markers
* Remove the footways from "all the streets"
* Polygon styles without borders
* Add sixth point before numbers

**Bug fixes**

* Be able to delete a circle
* Fix initial import of innerStyle

**Internal features**
* Rewrite the "addText" function on the common map

0.2
-------------------

**New features**

* Polygon styles (textures.js)
* POI styles
* Preview feature style in dropdown list
* Local map rotation
* Map and legend are now on 2 separate SVG files
* Download map, legend and comment in a single zip file
* Map and legend orientation (portrait or landscape)
* Local map layers edition : change the style and remove a feature
* Local map: feature geometric simplification
* Upload a custom SVG file
* Add custom tags with feature properties in the svg file

**Bug fixes**

* Prevent map panning on common map
* An already selected layer cannot be added again to the local
* Better handle the polygons and multipolygons
* Open selection list always down

**Minor changes**

* More line styles
* Add a polygon query: buildings
* OSM attribution
* Add a comment
* Keep OSM tiles on common map view
* Add icons in the features list

**Internal features**
* New svgicon service
* Setup tests
* Move fonts to proper folder

0.1 (2015-03-26)
-------------------

**New features**

* Local map: download pre-configured data from OSM and display it
* Local map: dynamically drawn legend
* Global map: load a SVG file
* Common map: draw, write and delete features on the drawing
* Common map: export the drawing as SVG

