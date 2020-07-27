
var data;
var smam_data;
var ever_data;
var currently_data;
var age_data;

function init(){

  pullData();
  onload_slides();
}

async function pullData(){

  data = await d3.csv("https://flunky.github.io/cars2017.csv");
  smam_data = await d3.csv("data/SMAM.csv");

  draw_scatter_1(data);
  draw_scatter_2(smam_data);
  draw_scatter_3(data);
  draw_scatter_4(data);

  changeSlide(-1);
}

function onclickTest(){

  alert("Test Button Clicked!");

  return;
}
