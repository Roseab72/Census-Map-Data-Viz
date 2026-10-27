/**
 * Alessia Bianchimano, 4/24/26
 * Loads raw data from JSON file, processes that data 
 * and visualizes it through two mappings that display 
 * different variables using shapes and charts, filters 
 * county data, allows for interaction switch between 
 * mappings and toggle label of county's data
 */

"use strict"; //catch some common coding errors

/* Global variables */
let countyList;
let vizLegend;
let counties = [];
let ui = {
   formatters: {},
   selections: {}
}

/**
 * preload : sets JSON file data to variable 
 * countyList and loads legend image
 */
function preload() {
countyList = loadJSON("media/acsNyPaCounties.json");
vizLegend = loadImage("media/legend.png");
}

/**
 * setup : create canvas, set text size, set shape modes,
 * call function to create number formats, function to 
 * set up UI elements, and function to process data
 */
function setup() {
   createCanvas(windowWidth, windowHeight);
   ellipseMode(CENTER);
   rectMode(CENTER);
   textSize(8);
   numFormat();
   UI();
   processData();
}

/**
 * numFormat : creates number formatting objects for 
 * default formatting, percent formatting, and 
 * currency formatting
 */
function numFormat() {
   ui.formatters.default = new Intl.NumberFormat();
   ui.formatters.percentage = new Intl.NumberFormat('en-US', {style: 'percent', maximumFractionDigits: 2,});
   ui.formatters.currency = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0,});
}

/**
 * processData : loops over every county from raw data 
 * to make it a county class instance and push it to 
 * counties array, calls function to show counties
 */
function processData() {
   //console.log(countyList);
   
   for (let i in countyList) {
      let county = new County(countyList[i]);
      counties.push(county);
   }
   showCounties();
}

/**
 * showCounties : sets backgrund, text size, loads legend,
 * switch case to filter counties based on user selection 
 * which shows all counties by default, and can filter for 
 * counties with middle median income, and counties with 
 * > 2% immigrant pop, calls each county's display method
 */
function showCounties() {
   background("darkslategrey");
   image(vizLegend, 0, 0, width * 0.3, height * 0.3);
   textSize(8);

   let countiesDrawn = counties;

   switch (ui.selections.filter.value()) {
      case "for middle income (> $45k)" :
         countiesDrawn = countiesDrawn.filter(i => i.medInc > 45000);
         break;
      case "for > 2% immigrant counties" :
         countiesDrawn = countiesDrawn.filter(i => i.pctImmig > 0.02);
         break;
      case "for all counties" :
         default:
            break;
   }
   //call each county's display method
   countiesDrawn.forEach(i => i.display());
}

/**
 * UI : creates HTML controls for UI with two dropdowns for 
 * selecting two different mapping visualization and 3 options 
 * for filtering county subsets, updates display when user selects
 */
function UI() {
   let position = select("#controls");
   createElement("label", "Census Visualization Controls: ").parent(position);
   createElement("br").parent(position);

   ui.selections.mappingViz = createSelect();
   ui.selections.mappingViz.parent(position);
   ui.selections.mappingViz.option("Map median income & immigrants");
   ui.selections.mappingViz.option("Map poverty & adult teeth lost");
   ui.selections.mappingViz.changed(showCounties);

   createElement("br").parent(position);
   createElement("br").parent(position);

   ui.selections.filter = createSelect();
   ui.selections.filter.parent(position);
   ui.selections.filter.option("for all counties");
   ui.selections.filter.option("for middle income (> $45k)");
   ui.selections.filter.option("for > 2% immigrant counties");
   createElement("br").parent(position);
   createElement("br").parent(position);
   ui.selections.filter.changed(showCounties);
}

/**
 * mousePressed : sends mouse location cords to check mouse 
 * method to check for user click on county, redraws them 
 * after toggle 
 */
function mousePressed() {
   counties.forEach(county => county.checkMousePressed(mouseX, mouseY));
   showCounties();
}