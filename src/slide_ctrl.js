

var slide_index = 0;
var slide_Max = null;
var slide_class = "svg_slide";
var title_class = "chartTitle";
var slide_list = null;
var title_list = null;
var display_svg = null;
var tooltip_div = null;

//var update_slide = [ud_smam, ud_ever, ud_age, ud_curr];

function onload_slides(){

  title_list = document.getElementsByClassName(title_class);
  slide_list = document.getElementsByClassName(slide_class);
  slide_display = document.getElementById('display_svg');
  slide_Max = 3//;slide_list.length -1;

  tooltip_div = d3.select("body")
                  .append("div")
                  .classed("tt", true);

}

function changeSlide(dir){

  slide_index += dir;

  if (slide_index < 0){ slide_index = 0; }
  if (slide_index > slide_Max){ slide_index = slide_Max; }
  //slide_list = document.getElementsByClassName(slide_class);


  for(i = 0; i < title_list.length; i++){
    title_list[i].style.display = "none";
  }

  title_list[slide_index].style.display = "block";
  //d3.selectAll(title_list[slide_index]).style('display', 'block');

//  alert(slide)display.innerHTML);

  //update_slide[slide_index]();
  updateDropdown(scene_list[slide_index].countries);

  //if(slide_index == 3) updateDropdown('#select_country', ["BUTTS"]);

  slide_display.innerHTML = "";//slide_list[slide_index].innerHTML;
  showPlayButton();
  hideSlider();
  stopAnimation();
  if(slide_index < 1){
    hidePlayButton();
    //disableControls();
    smam_chart();
    disableControls();
  } else if(slide_index == 1){
    disableControls();
    age_chart();
  } else if(slide_index == 2){
    disableControls();
    divorce_chart();
  } else if(slide_index == 3){
    enableControls();
    age_chart();
  }

}

function updateDropdown(opts){

  console.log('opts.len: ', opts.length);

  dropdown = d3.select("#select_country")
  .classed('droppy', true)
  .selectAll('option')
 	.data(opts);

  dropdown.exit().remove();

   dropdown
  .enter()
	.append('option')
  .property("selected",function(d){return d === 'United States of America';})
  .text(function (d) { return d; })
  .attr("value", function (d) { return d; });

  return dropdown
  .property("selected",function(d){return d === filters.country;})
  .text(function (d) { return d; })
  .attr("value", function (d) { return d; });

}

function enableControls(){

  d3.selectAll("input[name=gender]").attr('disabled', null);
  d3.selectAll("#yearSlider").attr('disabled', null);
  d3.selectAll("#select_country").attr('disabled', null);
}

function disableControls(){

  d3.selectAll("input[name=gender]").attr('disabled', true);
  d3.selectAll("#yearSlider").attr('disabled', true);
  d3.selectAll("#select_country").attr('disabled', true);
}

function hidePlayButton(){
  //return;
  d3.selectAll("#PlayPause").style('display', 'none');
}

function showPlayButton(){
  //return;
  d3.selectAll("#PlayPause").style('display', 'block');
}
