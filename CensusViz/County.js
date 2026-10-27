/**
 * Alessia Bianchimano, 4/24/26
 * County class has a constructor with obj literal parameter county 
 * that copies the properties from raw data counties to class properties, 
 * sets x and y cord properties to the lon and lat of each county, 
 * calculates immigrant pop, teeth lost, and poverty variables as percentages, 
 * displays two different mappings correlating to user selection from UI 
 * elements and displays a label for each county
 */

"use strict"; //catch some common coding errors

class County { 
   /**
    * constructor : Has parameter value county to receive each 
    * county's raw data, copies county's properties, sets x and 
    * y cord properties to the lon and lat of each county and 
    * bounds it by range, calculates immigrant, teeth lost, and 
    * poverty variables as percentages, inits show label var as false
    * @param {objLiteral} county 
    */
   constructor(county) {
      this.county = county;

      //loop to copy the properties of each county
      for (let i in county) {
         this[i] = county[i];
      }

      //["lon"] range: -80.349492 to -72.842861
      //["lat"] range: 44.746145 to 39.853804
      //set x and y cords from lat and lon of county
      this.x = map(this.lon, -80.349492, -72.842861, 80, width-80);
      this.y = map(this.lat, 44.746145, 39.853804, 80, height-80);
      
      //pop, percent imm, med income, percent adult all teeth lost, percent poverty
      //calculate immigrants, teeth lost, and poverty as percent
      this.pctImmig = Number(this.popImmig) / Number(this.pop);
      this.pctTeethLost = Number(this.outcomes["All teeth lost among adults aged >=65 years"]) / 100;
      this.pctPoverty = Number(this.popPov) / Number(this.pop);
      
      this.showLabel = false;
   }

   /**
    * display : displays county visualization on the canvas according 
    * to selected mapping with an outer ring scaled for population, 
    * displays different visuals using bars and pie chart to represent 
    * selected data vars, checks for and displays each county's label
    */
   display() {
      //outter ring sized from population
      strokeWeight(1);
      noFill();
      stroke("deeppink");
      let popSize = map(this.pop, 5000, 1000000, 70, 170);
      let mapping = ui.selections.mappingViz.value();
      ellipse(this.x, this.y, popSize);

      //displays scaled square and vertical bar for mapping 1
      if (mapping === "Map median income & immigrants") {
         noStroke();
         //remap med income var for circle display
         let size = map(this.medInc, 25000, 90000, 20, 100);
         fill("lightblue");
         rect(this.x, this.y, size, size, 10);
         //vert bar
         fill("yellow");
         rect(this.x, this.y, size/4, size);
         let barHeight = map(this.pctImmig, 0, 1, 0, size);
         fill("crimson");
         rect(this.x, this.y, size/4, barHeight);
      } 
      
      //displays pie chart and horizontal bar for mapping 2
      if (mapping === "Map poverty & adult teeth lost") {
         noStroke();
         let size = 50;
         fill("cornsilk");
         //create pie chart
         ellipse(this.x, this.y, size);
         let angle = map(this.pctPoverty, 0, 1, 0, TWO_PI);
         fill("red");
         arc(this.x, this.y, size, size, 0, angle);
         //horiz bar
         fill("purple");
         rect(this.x, this.y, size, size/7);
         let barWidth = map(this.pctTeethLost, 0, 1, 0, size);
         fill("cyan");
         rect(this.x, this.y, barWidth, size/7);
      }
      
      //print label when mouse is clicked in correct location
      if (this.showLabel) {
         textSize(15);
         let label = this.returnString(mapping);
         strokeWeight(2);
         fill("white");
         stroke(0);
         text(label, this.x - 50, this.y - 20);
      }
   }

   /**
    * returnString : Adds each county's name and pop with switch case 
    * for mapping viz options to add selected county data to string 
    * to be used for county labels
    * @param mapping html dropdown value
    * @returns local string var
    */
   returnString(mapping) {
      let string = "";
      string += this.name + "\n";

      if (this.pop) {
         string += "pop " + ui.formatters.default.format(this.pop) + ":\n";
      }
      switch (mapping) {
         case "Map median income & immigrants" :
            if (this.pctImmig) {
               string += ui.formatters.percentage.format(this.pctImmig) + " immigrants \n";
            }
      
            if (this.medInc) {
               string += ui.formatters.currency.format(this.medInc) + " med inc" + "\n";
            }
            break;

         case "Map poverty & adult teeth lost" :
            if (this.pctTeethLost) {
               string += ui.formatters.percentage.format(this.pctTeethLost) + " ≥ 65 no teeth\n";
            }
            if (this.pctPoverty) {
               string += ui.formatters.percentage.format(this.pctPoverty) + " poverty";
            }
            break;
      }
      //console.log(string);
      return string;
   }

   /**
    * checkMousePressed : checks for mouse pressed on any county 
    * by calculating distance btwn mouse and county viz symbol 
    * and toggling label on/off
    * @param {number} x cord
    * @param {number} y cord
    */
   checkMousePressed(x, y) {
      //calculate distance btwn mouse and county viz symbol
      let distance = dist(x, y, this.x, this.y);
      if (distance < 40) {
         this.showLabel = !this.showLabel;
      }
   }
}