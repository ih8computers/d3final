
var smamJSON = {};
var everJSON = {};
var currJSON = {};
var ageJSON = {};

var width = 800;
var height = 300;
var margin = 50;
var xax = height + margin;

// TODO: delete these
var default_filters = {};
default_filters.country = 'United States of America';
default_filters.sex = 'Men';
//

var filters = {};
filters.country = 'United States of America';
filters.sex = 'Men';
filters.status = 'Married';
var scene_list = [];

function init(){

  pullData();
  onload_slides();
}

async function pullData(){

  smamJSON.data = await d3.csv("data/SMAM.csv");
  smamJSON.countries = getCountries(smamJSON.data);

  everJSON.data = null;//await d3.csv("data/EVER_MARRIED.csv");
  everJSON.countries = null;//getCountries(everJSON.data);

  currJSON.data = null;//await d3.csv("data/CURRENTLY_MARRIED.csv");
  currJSON.countries = null;//getCountries(currJSON.data);

  ageJSON.data = await d3.csv("data/MARITAL_STATUS_BY_AGE.csv");
  ageJSON.countries = getCountries(ageJSON.data);

  scene_list = [ smamJSON, ageJSON, ageJSON, ageJSON ];
  //scene_list.map(function(record){ record.filters = default_filters });

  updateDropdown(scene_list[slide_index].countries);

  setupListeners();

  smam_chart();

  loaded();


}

function radio_callback(e){
console.log("RADIO CALLBACK");
  var selected_sex = this.value;
  filters.sex = selected_sex;

  updateChart(true);

}

function drop_callback(){
console.log("DROP_CALLBACK");
  //alert("omg");
  var selected_country = this.value;
  filters.country = selected_country;
  // TODO: updateChart
  yearIndex = 0;
  updateChart(true);

}

function getCountries(cdata){

  return Array.from(new Set(cdata.map(function(record){
                    return record['Country or area']})));

}

function updateSMAMChart(){

  var scene = scene_list[slide_index];
  console.log(slide_index);
  var fdata = getFilteredData(scene.data, filters);
  var domain = fdata.domain;

  x=d3.scaleBand().domain(domain).range([0,width]);
  y=d3.scaleLinear().domain([0,30]).range([height,0]);

  var bars = d3.select('svg')
              .selectAll('g.bargroup')
              .selectAll('rect').data(fdata,function(d){return d.DataValue;});

  bars.enter().append('rect').merge(bars)
                  //.transition()
                  //.duration(2800)
                  .attr('x', function(d,i){return x(d.YearStart);})
                  .attr('y', function(d,i){console.log(d.DataValue);return y(d.DataValue);})
                  .attr('width', function(d,i){return x.bandwidth()})
                  .attr('height', function(d,i){return height-y(d.DataValue);});

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
  d3.selectAll("input[name=gender]")
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

function smam_chart(){

  var scene = scene_list[slide_index];
  console.log(slide_index);
  var fdata = getFilteredData(scene.data, filters);
  var domain = fdata.map(d => d.YearStart);//fdata.domain;
  var yMaxDomain = Math.max(...fdata.map(key => (parseFloat(key.DataValue))).sort());
  console.log('yMAX ',yMaxDomain);

  x=d3.scaleBand().domain(domain).range([0,width]).padding([0.25]);
  y=d3.scaleLinear().domain([0,yMaxDomain]).range([height,0]);
  //x.domain(d3.extent(fdata, function(d) { return d.YearStart; }));

  var groups = ['Men', 'Women'];
  var xgroupScale = d3.scaleBand()
  .domain(groups)
  .range([0, x.bandwidth()])
  .padding([0.05]);

  var color = d3.scaleOrdinal()
    .domain(groups)
    .range(['lightblue','pink'])

  var yvals = [];
  var sexMax = [];
  sexMax["Men"] = {max : 0, year : -13};
  sexMax["Women"] = {max : 0, year : -13};


  var bars = d3.select('svg')
               .append('g')
               .attr('transform',"translate("+margin+","+margin+")")
               .selectAll("g")
               .data(fdata)
               .join("g")
                .attr("transform", d => `translate(${x(d['YearStart'])},0)`)
               .selectAll("rect")
               .data(function(d){

                ret = groups.map(key => ({key: key, value: d.Sex == key ? d.DataValue : 0}));
                console.log(d.Sex);

                //sexMax[d.Sex].push(d.DataValue);
                //sexMax[d.Sex].push(d.DataValue);
                //sexMax[d.Sex][d.DataValue];

                if(sexMax[d.Sex].max < d.DataValue){
                  sexMax[d.Sex].max = parseFloat(d.DataValue);
                  sexMax[d.Sex].year = parseFloat(d.YearStart);
                }

                return ret;
              })
              //.data(function(d){ret = {key:d.Sex, value:d.DataValue}; console.log(ret); return ret;})
              .join('rect')
                .attr("x", function(d){ return xgroupScale(d.key);})
                .attr("y", function(d){ console.log(d.value);return y(d.value);})
                .attr("width", xgroupScale.bandwidth())
                .attr("height", d => height - y(d.value))
                .attr("fill", d => color(d.key));

  bars.enter().append('rect').merge(bars)
                                  //.transition()
                                  //.duration(2800)
              .attr('x', function(d,i){console.log("hello");return xgroupScale(d.key);})
              .attr('y', function(d,i){return y(d.value);})
              .attr('width', function(d,i){return xgroupScale.bandwidth()})
              .attr('height', function(d,i){return height-y(d.value);})
              .attr("fill", function(d) { return color(d.key); });

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
                  .call(d3.axisLeft(y));//.tickValues([20,25,25.2,25.5,30]).tickFormat(d3.format("~s")));

  console.log(sexMax);
  menMax = sexMax["Men"].max;//Math.max(...sexMax["Men"].map(key => parseFloat(key)).sort());
  menMaxYear = sexMax["Men"].year;
  womenMax = sexMax["Women"].max;//Math.max(...sexMax["Women"].map(key => parseFloat(key)).sort());
  womenMaxYear = sexMax["Women"].year;
  console.log(menMax,'',womenMax);
  if(sexMax["Men"].year != -13)
    annotateMen(menMax, menMaxYear, y, x, xgroupScale, yMaxDomain);
  if(sexMax["Women"].year != -13)
    annotateWomen(womenMax, womenMaxYear, y, x, xgroupScale, yMaxDomain);
}

function updateChart(reset = false){
console.log("UPDATE CHART");
  if(slide_index == 0){
    updateSMAMChart();
  } else if(slide_index == 1) {
    updateAgeChart();
    setupSlider(reset);
  } else if(slide_index == 2) {
    updateAgeChart();
    setupSlider(reset);
    enableControls();
  } else if(slide_index == 3) {
    updateAgeChart();
    setupSlider(reset);
  }
}

function loaded(){

  document.getElementById('loading_screen').style.display = 'none';
  document.getElementById('vis_div').style.display = 'block';
}

function playpause_callback(e){

  //ppbutton_text = document.getElementById('PlayPause').firstChild.data;
//console.log(ppbutton_text,'',e.target.firstChild.data);
  if(e.target.firstChild.data == 'Pause'){
    isPaused = true;
    document.getElementById('PlayPause').firstChild.data = 'Play';
    //console.log(ppbutton_text,'',e.target.firstChild.data);
  } else {
    isPaused = false;
    if(!isAnimating){startAnimation(); return;}
    document.getElementById('PlayPause').firstChild.data = 'Pause';
  }

}

function annotateMen(maxVal, maxYear, y, x, xgroupScale, yMaxDomain){

  mencolor = "lightblue";
  annotate(maxVal, maxYear, y, x, xgroupScale, yMaxDomain, mencolor);
}

function annotateWomen(maxVal, maxYear, y, x, xgroupScale, yMaxDomain){

  womencolor = "pink";
  modifier = .8;
  annotate(maxVal, maxYear, y, x, xgroupScale, yMaxDomain, womencolor, modifier);
}

function annotate(max, year, y, x, xgroupScale, yMaxDomain, color, mod = 1){

  d3.select('svg')
    .append("line")
    .attr("x1", margin )
    .attr("x2", (2*margin+width)*.60*mod )
    .attr("y1", margin+y(max))
    .attr("y2", margin+y(max)*mod)
    .attr("stroke", color)
    .attr("stroke-dasharray", "4");
  d3.select('svg')
    .append("line")
    .attr("x1", (2*margin+width)*.60*mod )
    .attr("x2", (2*margin+width)*.85*mod*mod )
    .attr("y1", margin+y(max)*mod)
    .attr("y2", .5*margin+y(yMaxDomain))
    .attr("stroke", color)
    .attr("stroke-dasharray", "4");
  d3.select('svg')
    .append("text")
    .attr("x", (2*margin+width)*.85*mod*mod)
    .attr("y", .5*margin)
    .text("Max: "+max+" ("+year+")")
    .style("font-size", "15px");
}
