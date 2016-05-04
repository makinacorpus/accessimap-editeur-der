This file is going to try to explain how the relief design editor is structured, and how it works.

# Documentation

## Major Dependencies

We use D3 & Leaflet for the graphic part.

Angular JS for the application management.

D3 is used to draw svg shapes.

Leaflet is used to manage map & layers.

## Files

This software use Angular JS, so we use controller, services, and a filter.

That's all.

The clever part is in service.

We have split the app in views, localized in app/scripts/views .

Each view is a compilation of one controller, one service (which depends on several others), and one or more templates.

View's service use a lot of sub-services. These differents services are localized in app/scripts/commons.

## Main use case

The user wants to make a drawing.

For this, he can choose put a map background, or not.

To do this, he can edit the map. 
Then, add geojson features, search for addresses, add POI, editing the patterns for these features, etc.


## Layers requirements

We use three overlay layers.

Each layers have a specific behavior.

when a move is triggered on the map,
we have to follow these rules 
- when user has started to draw
+ the overlay's layer must move
+ the drawing's layer must move
+ the geojson's layer must move

- when the user has not started to draw
+ the overlay's layer must not move
+ the drawing's layer must move
+ the geojson's layer must move

- when the user has started to draw, but decide to insert geojson data (map editing)
+ the overlay's layer must move
+ the drawing's layer must move
+ the geojson's layer must move

- when the user has a map, has started to draw, but want to change the overlay
+ the overlay's layer must not move
+ the drawing's layer must not move ?
+ the geojson's layer must move


### Drawing



### GeoJSON

The behavior of this layer depend on the state of the drawing.

If the 'scale' have been fixed (the drawing has begun), then the fill-pattern must not be redrawn.

If not, then the fill-pattern must be redrawn (or not scaled).

### 