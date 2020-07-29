

var slide_index = 0;
var slide_Max = null;
var slide_class = "svg_slide";
var slide_list = null;
var display_svg = null;

var update_slide = [ud_smam, ud_ever, ud_age, ud_curr];

function onload_slides(){

  slide_list = document.getElementsByClassName(slide_class);
  slide_display = document.getElementById('display_svg');
  slide_Max = slide_list.length -1;

}

function changeSlide(dir){

  slide_index += dir;

  if (slide_index < 0){ slide_index = 0; }
  if (slide_index > slide_Max){ slide_index = slide_Max; }
  //slide_list = document.getElementsByClassName(slide_class);


  //for(i = 0; i < slide_list.length; i++){
  //  slide_list[i].display = "none";
  //}

//  alert(slide)display.innerHTML);

  update_slide[slide_index]();

  slide_display.innerHTML = slide_list[slide_index].innerHTML;


}

function updateDropdown(sel, opts, callback){


  dropdown = d3.select(sel)
  .on('change', callback)
  .classed('droppy', true)
  .selectAll('option')
 	.data(opts);

  dropdown.exit().remove();

  return dropdown
  .enter()
	.append('option')
  .text(function (d) { return d; })
  .attr("value", function (d) { return d; });

}
