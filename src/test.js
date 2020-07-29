
var data;
var smam_data, smam_countries;
var ever_data, ever_countries;
var currently_data, currently_countries;
var age_data, age_countries;

function init(){

  pullData();
  onload_slides();
}

async function pullData(){

  data = await d3.csv("https://flunky.github.io/cars2017.csv");

  smam_data = await d3.csv("data/SMAM.csv");
  smam_countries = getCountries(smam_data);

  ever_data = await d3.csv("data/EVER_MARRIED.csv");
  ever_countries = getCountries(ever_data);

  currently_data = await d3.csv("data/CURRENTLY_MARRIED.csv");
  currently_countries = getCountries(currently_data);

  age_data = await d3.csv("data/MARITAL_STATUS_BY_AGE.csv");
  age_countries = getCountries(age_data);


  draw_smam(smam_data);
  draw_ever(ever_data);
  draw_currently(currently_data);
  draw_age(age_data);

  changeSlide(-1);
}

function drop_callback(){

  //alert("omg");
  var selected_country = d3.select(this).property("value");
  console.log(selected_country);
  // TODO: updateChart
  updateChart({ 'country' : selected_country });

}

function getCountries(cdata){

  return Array.from(new Set(cdata.map(function(indicator){
                    return indicator['Country or area']})));
}

function updateChart(update){

  country = update.country;
  mf = update.mf;
  slide = update.slide;

  if(country){

    
  }


}
