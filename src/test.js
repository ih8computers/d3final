
var smamJSON = {};
var everJSON = {};
var currJSON = {};
var ageJSON = {};

// TODO: delete these
var default_filters = {};
default_filters.country = 'United States of America';
default_filters.sex = 'Men';
//

var filters = {};
filters.country = 'United States of America';
filters.sex = 'Men';
var scene_list = [];

function init(){

  pullData();
  onload_slides();
}

async function pullData(){

  smamJSON.data = await d3.csv("data/SMAM.csv");
  smamJSON.countries = getCountries(smamJSON.data);

  everJSON.data = await d3.csv("data/EVER_MARRIED.csv");
  everJSON.countries = getCountries(everJSON.data);

  currJSON.data = await d3.csv("data/CURRENTLY_MARRIED.csv");
  currJSON.countries = getCountries(currJSON.data);

  ageJSON.data = await d3.csv("data/MARITAL_STATUS_BY_AGE.csv");
  ageJSON.countries = getCountries(ageJSON.data);

  scene_list = [ smamJSON, everJSON, currJSON, ageJSON ];
  scene_list.map(function(record){ record.filters = default_filters });

  updateDropdown(scene_list[slide_index].countries);

  setupListeners();

  chart();


}

function radio_callback(e){

  var selected_sex = this.value;
  filters.sex = selected_sex;

  updateChart();

}

function drop_callback(){

  //alert("omg");
  var selected_country = this.value;
  filters.country = selected_country;
  // TODO: updateChart
  updateChart();

}

function getCountries(cdata){

  return Array.from(new Set(cdata.map(function(record){
                    return record['Country or area']})));

}

function updateChart(){

  var scene = scene_list[slide_index];
  console.log(slide_index);
  var fdata = getFilteredData(scene.data, filters);
  var domain = fdata.domain;

  x=d3.scaleBand().domain(domain).range([0,width]);
  y=d3.scaleLinear().domain([0,30]).range([height,0]);

  var bars = d3.select('svg')
              .selectAll('g.bargroup')
              .selectAll('rect').data(fdata,function(d){return d.DataValue;});

  //bars.exit().remove();

  bars.enter().append('rect').merge(bars)
                  //.transition()
                  //.duration(2800)
                  .attr('x', function(d,i){return x(d['YearStart']);})
                  .attr('y', function(d,i){console.log(d['DataValue']);return y(d['DataValue']);})
                  .attr('width', function(d,i){return width/domain.length})
                  .attr('height', function(d,i){return height-y(d['DataValue']);});

  bars.exit().remove();


  d3.select('svg').select('g.x-axisgroup')
                  .attr('transform',"translate("+margin+","+xax+")")
                  .call(d3.axisBottom(x));
  d3.select('svg').select('g.y-axisgroup')
                  .attr('transform',"translate("+margin+","+margin+")")
                  .attr('height',height)
                  .call(d3.axisLeft(y).tickValues([20,25,25.2,25.5,30]).tickFormat(d3.format("~s")));

}

function setupListeners(){

  // radio listener
  d3.selectAll("input")
  .on('change', radio_callback);

  // dropdown listener
  d3.select("#select_country")
  .on('change', drop_callback);

}

function getFilteredData(data, filters){

  var COUNTRY = filters.country;
  var SEX = filters.sex;

  var domain = [];
  var filtered_data;

  filtered_data = data.filter(function(d){
		if (d['Country or area'] == COUNTRY && d['Sex'] != SEX) {
    		if(!domain.includes(d['YearStart'])){

    			domain.push(d['YearStart']);
        }

        return true;
         // else{
         // 		console.log("already has it");
         // 		return false;
         //  }
    }
  });

  filtered_data.domain = domain;

  return filtered_data;

}

function chart(){

  var scene = scene_list[slide_index];
  console.log(slide_index);
  var fdata = getFilteredData(scene.data, filters);
  var domain = fdata.domain;

  //console.log(fdata);
  //console.log(fdata.domain);

  width = 200;
  height = 200;
  margin = 50;
  xax = 250;

  x=d3.scaleBand().domain(domain).range([0,width]);
  y=d3.scaleLinear().domain([0,30]).range([height,0]);
  //x.domain(d3.extent(fdata, function(d) { return d.YearStart; }));

  var bars = d3.select('svg').attr('width',width+2*margin)
                  .attr('height', height+2*margin)
                  .append('g')
                  .classed('bargroup', true)
                  .attr('transform',"translate("+margin+","+margin+")")
                  .selectAll('rect').data(fdata,function(d){return d.DataValue;});

  //bars.exit().remove();

  bars.enter().append('rect').merge(bars)
                  //.transition()
                  //.duration(2800)
                  .attr('x', function(d,i){return x(d['YearStart']);})
                  .attr('y', function(d,i){console.log(d['DataValue']);return y(d['DataValue']);})
                  .attr('width', function(d,i){return width/domain.length})
                  .attr('height', function(d,i){return height-y(d['DataValue']);});

  d3.select('svg').attr('width',width+2*margin)
                  .attr('height', height+2*margin)
                  .append('g')
                  .classed('x-axisgroup', true)
                  .attr('transform',"translate("+margin+","+xax+")")
                  .call(d3.axisBottom(x));
  d3.select('svg').attr('width',width+2*margin)
                  .attr('height', height+2*margin)
                  .append('g')
                  .classed('y-axisgroup', true)
                  .attr('transform',"translate("+margin+","+margin+")")
                  .attr('height',height)
                  .call(d3.axisLeft(y).tickValues([20,25,25.2,25.5,30]).tickFormat(d3.format("~s")));
}

/*
console.log(fdata);
  if(filters.sex == 'Men'){ fdata = [{'DataValue':20, 'YearStart':domain[0]},
{'DataValue':25, 'YearStart':domain[1]},{'DataValue':30, 'YearStart':domain[2]}];}
  else{ fdata = [{'DataValue':10, 'YearStart':domain[0]},
{'DataValue':15, 'YearStart':domain[1]},{'DataValue':20, 'YearStart':domain[2]}];}

*/
