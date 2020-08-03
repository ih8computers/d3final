
var smamJSON = {};
var everJSON = {};
var currJSON = {};
var ageJSON = {};

var width = 800;
var height = 300;
var margin = 50;
var xax = height + margin;

var filters = {};
filters.country = 'United States of America';
filters.sex = 'All';
filters.status = 'Married';
var scene_list = [];

function init(){

  pullData();
  onload_slides();
}

async function pullData(){

  smamJSON.data = await d3.csv("data/SMAM.csv");
  smamJSON.countries = getCountries(smamJSON.data);

  ageJSON.data = await d3.csv("data/MARITAL_STATUS_BY_AGE.csv");
  ageJSON.countries = getCountries(ageJSON.data);

  scene_list = [ smamJSON, ageJSON, ageJSON, ageJSON ];

  updateDropdown(scene_list[slide_index].countries);

  setupListeners();

  smam_chart();

  loaded();

  setStatus();


}

function radio_callback(e){

  var selected_sex = this.value;
  filters.sex = selected_sex;

  reset_sexmaxglobal();
  updateChart(true);

}

function drop_callback(){

  var selected_country = this.value;
  filters.country = selected_country;

  yearIndex = 0;
  reset_sexmaxglobal();
  updateChart(true);

}

function status_callback(){

  var selected_status = this.value;
  filters.status = selected_status;

  yearIndex = 0;
  reset_sexmaxglobal();
  updateChart(true);

}

function getCountries(cdata){

  return Array.from(new Set(cdata.map(function(record){
                    return record['Country or area']})));

}

function updateSMAMChart(){

  var scene = scene_list[slide_index];

  var fdata = getFilteredData(scene.data, filters);
  var domain = fdata.map(d => d.YearStart);//fdata.domain;
  var yMaxDomain = Math.max(...fdata.map(key => (parseFloat(key.DataValue))).sort());


  x=d3.scaleBand().domain(domain).range([0,width]).padding([0.25]);
  y=d3.scaleLinear().domain([0,yMaxDomain]).range([height,0]);


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
               .selectAll('g.over')
               .attr('transform',"translate("+margin+","+margin+")")
               .selectAll("g")
               .data(fdata)
               .join("g")
                //.classed('over', true)
                .attr("transform", d => `translate(${x(d['YearStart'])},0)`)
               .selectAll("rect")
               .data(function(d){

                ret = groups.map(key => ({key: key, value: d.Sex == key ? d.DataValue : 0, year : d.YearStart, sname : d['DataCatalog ShortName']}));

                if(sexMax[d.Sex].max < d.DataValue){
                  sexMax[d.Sex].max = parseFloat(d.DataValue);
                  sexMax[d.Sex].year = parseFloat(d.YearStart);
                }
                return ret;
              })
              .join('rect')
                .attr("x", function(d){ return xgroupScale(d.key);})
                .attr("y", function(d){ return y(d.value);})
                .attr("width", xgroupScale.bandwidth())
                .attr("height", d => height - y(d.value))
                .attr("fill", d => color(d.key))
                .on('mousemove', function (d, i) {
                                  tt_on(this, d, i);
                                 })
                .on('mouseout', function (d, i) {
                                  tt_off(this, d, i);
                                });
                //.append("svg:title")
                //.text(function(d) { return "HAM"; });

  d3.select('svg').select('g.x-axisgroup')
                  .attr('transform',"translate("+margin+","+xax+")")
                  .call(d3.axisBottom(x));
  d3.select('svg').select('g.y-axisgroup')
                  .attr('transform',"translate("+margin+","+margin+")")
                  .attr('height',height)
                  .call(d3.axisLeft(y));


  menMax = sexMax["Men"].max;//Math.max(...sexMax["Men"].map(key => parseFloat(key)).sort());
  menMaxYear = sexMax["Men"].year;
  womenMax = sexMax["Women"].max;//Math.max(...sexMax["Women"].map(key => parseFloat(key)).sort());
  womenMaxYear = sexMax["Women"].year;

  d3.select('svg').selectAll('.annotation').remove();
  if(sexMax["Men"].year != -13)
    annotateMen(menMax, menMaxYear, y, x, xgroupScale, yMaxDomain);
  if(sexMax["Women"].year != -13)
    annotateWomen(womenMax, womenMaxYear, y, x, xgroupScale, yMaxDomain);

}

function setupListeners(){

  // radio listener
  d3.selectAll("input[name=gender]")
  .on('change', radio_callback);

  // dropdown listener
  d3.select("#select_country")
  .on('change', drop_callback);

  // status listener
  d3.select("#select_status")
  .on('change', status_callback);

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
    }
  });

  filtered_data.domain = domain;

  return filtered_data;

}

function smam_chart(){

  var scene = scene_list[slide_index];

  var fdata = getFilteredData(scene.data, filters);
  var domain = fdata.map(key => (key.YearStart)).sort();
  var yMaxDomain = Math.max(...fdata.map(key => (parseFloat(key.DataValue))).sort());

  x=d3.scaleBand().domain(domain).range([0,width]).padding([0.25]);
  y=d3.scaleLinear().domain([0,yMaxDomain]).range([height,0]);

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
                .classed('over',true)
                .selectAll("g")
                .data(fdata)
                .join("g")
                  .attr("transform", d => `translate(${x(d['YearStart'])},0)`)
                .selectAll("rect")
                .data(function(d){

                  ret = groups.map(key => ({key: key, value: d.Sex == key ? d.DataValue : 0, year : d.YearStart, sname : d['DataCatalog ShortName']}));

                  if(sexMax[d.Sex].max < d.DataValue){
                    sexMax[d.Sex].max = parseFloat(d.DataValue);
                    sexMax[d.Sex].year = parseFloat(d.YearStart);
                  }
                  return ret;
                })

                .join('rect')
                  .attr("x", function(d){ return xgroupScale(d.key);})
                  .attr("y", function(d){ return y(d.value);})
                  .attr("width", xgroupScale.bandwidth())
                  .attr("height", d => height - y(d.value))
                  .attr("fill", d => color(d.key))
                  .on('mousemove', function (d, i) {
                                    tt_on(this, d, i);
                                   })
                  .on('mouseout', function (d, i) {
                                    tt_off(this, d, i);
                                  });
                  //.append("svg:title")
                  //.text(function(d) { return "HAM"; });

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


                  menMax = sexMax["Men"].max;//Math.max(...sexMax["Men"].map(key => parseFloat(key)).sort());
                  menMaxYear = sexMax["Men"].year;
                  womenMax = sexMax["Women"].max;//Math.max(...sexMax["Women"].map(key => parseFloat(key)).sort());
                  womenMaxYear = sexMax["Women"].year;

                  d3.select('svg').selectAll('.annotation').remove();
                  if(sexMax["Men"].year != -13)
                    annotateMen(menMax, menMaxYear, y, x, xgroupScale, yMaxDomain);
                  if(sexMax["Women"].year != -13)
                    annotateWomen(womenMax, womenMaxYear, y, x, xgroupScale, yMaxDomain);

}

function updateChart(reset = false){

  if(slide_index == 0){
    updateSMAMChart();
    //updateSMAMChart();
  } else if(slide_index == 1) {
    updateAgeChart();
    setupSlider(reset);
  } else if(slide_index == 2) {
    //updateDivorceChart();
    updateAgeChart();
    setupSlider(reset);
  } else if(slide_index == 3) {
    updateAgeChart();
    setupSlider(reset);
  }
}

function loaded(){

  document.getElementById('loading_screen').style.display = 'none';
  document.getElementById('vis_div').style.display = 'block';
  document.getElementById('desc_div').style.display = 'block';
  document.getElementById('ftitle').style.display = 'block';
  document.getElementById('fsuppl').style.display = 'block';
}

function playpause_callback(e){

  if(e.target.firstChild.data == 'Pause'){
    isPaused = true;
    document.getElementById('PlayPause').firstChild.data = 'Play';

  } else {
    isPaused = false;

    if(!isAnimating){startAnimation(); return;}
    document.getElementById('PlayPause').firstChild.data = 'Pause';
  }

}

function annotateWomen(max, year, y, x, xgroupScale, yMaxDomain){

  color = "pink";

  line1x1 = line1x2 = margin+x(year)+xgroupScale("Women")+xgroupScale.bandwidth()/2;
  line2x1 = line1x2;
  line2x2 = width;

  line1y1 = margin+y(max);
  line1y2 = line1y1 - 20;
  line2y1 = line1y2;
  line2y2 = .5*margin+y(yMaxDomain);

  d3.select('svg')
    .append("line")
    .classed('annotation',true)
    .attr("x1", line1x1 )
    .attr("x2", line1x2 )
    .attr("y1", line1y1)
    .attr("y2", line1y2)
    .attr("stroke", color)
    .attr("stroke-dasharray", "4");

  d3.select('svg')
    .append("line")
    .classed('annotation',true)
    .attr("x1", line2x1 )
    .attr("x2", line2x2 )
    .attr("y1", line2y1)
    .attr("y2", line2y2)
    .attr("stroke", color)
    .attr("stroke-dasharray", "4");
  d3.select('svg')
    .append("text")
    .classed('annotation',true)
    .attr("x", line2x2*.9)
    .attr("y", line2y2)
    .text("Max: "+max+" ("+year+")")
    .style("font-size", "15px");
}

function annotateMen(max, year, y, x, xgroupScale, yMaxDomain){

  color = "lightblue";

  line1x1 = line1x2 = margin+x(year)+xgroupScale("Men")+xgroupScale.bandwidth()/2;
  line2x1 = line1x2;
  line2x2 = margin*2;

  line1y1 = margin+y(max);
  line1y2 = line1y1 - 20;
  line2y1 = line1y2;
  line2y2 = .5*margin+y(yMaxDomain);

  d3.select('svg')
    .append("line")
    .classed('annotation',true)
    .attr("x1", line1x1 )
    .attr("x2", line1x2 )
    .attr("y1", line1y1)
    .attr("y2", line1y2)
    .attr("stroke", color)
    .attr("stroke-dasharray", "4");

  d3.select('svg')
    .append("line")
    .classed('annotation',true)
    .attr("x1", line2x1 )
    .attr("x2", line2x2 )
    .attr("y1", line2y1)
    .attr("y2", line2y2)
    .attr("stroke", color)
    .attr("stroke-dasharray", "4");
  d3.select('svg')
    .append("text")
    .classed('annotation',true)
    .attr("x", line2x2*.9)
    .attr("y", line2y2)
    .text("Max: "+max+" ("+year+")")
    .style("font-size", "15px");
}

function tt_on(that, d, i){

  // setup tooltip
  tooltip_div.style("visibility", "visible");

  // set location
  tooltip_div.style("top",(d3.event.pageY-25)+"px");
  tooltip_div.style("left",(d3.event.pageX+25)+"px");

  // set text
  tooltip_div.html(getTT(d));

  // change bar
  d3.select(that).transition()
   .duration('70')
   .attr('opacity', '.80');
}

function tt_off(that, d, i){

  // teardown tooltip
  tooltip_div.style("visibility", "hidden");

  // change bar
  d3.select(that).transition()
    .duration('70')
    .attr('opacity', '1')
}

function getTT(d){

  rethtml = "";

  if( slide_index < 1 ) {

    rethtml += "<b>SMAM: </b>" + d.value;
    rethtml += "<br><b>Sex: </b>"  + d.key;
    rethtml += "<br><b>Year: </b>" + d.year;
    rethtml += "<br><b>Data Catalog: </b>" + d.sname;

  } else if( slide_index >= 1 ) {

    rethtml += "<b>Age Group: </b>" + d.age;
    rethtml += "<br><b>% "+ filters.status +": </b>" + d.value;
    rethtml += "<br><b>Sex: </b>"  + d.key;
    rethtml += "<br><b>Year: </b>" + d.year;
    rethtml += "<br><b>Data Catalog: </b>" + d.sname;

  }

  rethtml += "<br>";

  return rethtml;

}
