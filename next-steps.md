# Next Steps:

##9/18
Need to get the classes sorted.
- What kind of symbology do we want?
- What do we want to do with the water class? (The one that is sea level 0 and lower?)

## 9/24
- the next step needs to be to try and figure out if the map is updatable. Is there a way to use leaflet to reset the flood coloring without having to reload the entire map? 
- button added. Now to get the button to redraw the tiles we need redrawn. This will need JS connectivity, and the .redraw method from leaflet.

## 10/31
Ok, here's the issue: 
1. There's still an issue with the slider. Maybe we need to manually define the step change, or make it move the slider to an acceptable value if not. To do this, let's check the slider documentation. Also, let's get a debug line set up that directly displays the slider's value. Maybe we need to specify that it's always an integer? Or round that value to the nearest integer? If something in the value-choosing process is letting a floating-point sneak in (which it looks like it is), we need to squash that. Otherwise there's no reason to be working in CM. 
2. The final issue is something to do with our math. The map is displaying really, really big changes in sea level rise. Let's look at this. I think I made an arithmatic error somewhere. 

## 10/31 
Problem 1 fixed. Problem 2 remains. 

## 11/1
Problem 2 fixed. 

## 11/2 
Next step is getting the initial screen set up. 

## 1/22
Next step is to style the hide button on the map in keeping with the exhisting nav buttons, then insert the search buttons and dropdown button on the map. 
After that look at changing the orientation and size of the dropdown button on the splash screen. 
# 1/23
We need to: 
<!-- - get the person SVG input into the slot -->
<!-- - doesn't effect fig.2. --> 
<!-- - resized while preserving the aspect ratio -->
<!-- - colored the way we want  -->
- flipped so that it's looking at the map
- is overlayed with a light blue rectangle svg
- hooked up to the sea level rise object 


OK we've currently got a situation where we need to have a div overlay the SVG-contained overlay. 
