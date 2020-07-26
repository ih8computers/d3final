

var slide_index = 0;
var slide_Max = null;
var slide_class = "svg_slide";
var slide_list = null;
var display_svg = null;

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

  slide_display.innerHTML = slide_list[slide_index].innerHTML;


}
