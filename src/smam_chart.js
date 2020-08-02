
var smamJSON = {};
var everJSON = {};
var currJSON = {};
var ageJSON = {};

width = 200;
height = 200;
margin = 50;
xax = 250;

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
              .data(fdata)
              .enter()
              //.append('g')
              //.attr("transform", function(d) { return "translate(" + x(d.YearStart) + ",0)"; })
              .selectAll('rect').data(fdata,function(d){return d.DataValue;});
              //.data(function(d){return groups.map(function(key){return{key:key,value:d[key]};});});
  //bars.exit().remove();

  bars.enter().append('rect').merge(bars)
                  //.transition()
                  //.duration(2800)
                  .attr('x', function(d,i){return x(d.YearStart);})
                  .attr('y', function(d,i){console.log(d['DataValue']);return y(d['DataValue']);})
                  .attr('width', function(d,i){return x.bandwidth()})
                  .attr('height', function(d,i){return height-y(d['DataValue']);})
                  .attr("fill", function(d) { return "lightblue" });
                  .on('mouseover', function (d, i) {
                                   d3.select(this).transition()
                                    .duration('50')
                                    .attr('opacity', '.85');
                  .on('mouseout', function (d, i) {
                                  d3.select(this).transition()
                                    .duration('50')
                                    .attr('opacity', '1');

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
  var SEX = "AMEN";//filters.sex;

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
  var domain = fdata.map(key => (key.YearStart)).sort();
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
  sexMax["Men"] = [];
  sexMax["Women"] = [];

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

                  sexMax[d.Sex].push(d.DataValue);
                  return ret;
                })
                //.data(function(d){ret = {key:d.Sex, value:d.DataValue}; console.log(ret); return ret;})
                .join('rect')
                  .attr("x", function(d){ return xgroupScale(d.key);})
                  .attr("y", function(d){ console.log(d.value);return y(d.value);})
                  .attr("width", xgroupScale.bandwidth())
                  .attr("height", d => height - y(d.value))
                  .attr("fill", d => color(d.key));

              //  .data(function(d){return groups.map(function(key){console.log({key:key,value:d.DataValue});return{key:key,value:d[key]};});});
    //bars.exit().remove();
  //bars.exit().remove();

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
  menMax = Math.max(...sexMax["Men"].map(key => parseFloat(key)).sort());
  womenMax = Math.max(...sexMax["Women"].map(key => parseFloat(key)).sort());
  console.log(menMax,'',womenMax);

  annotateMen(menMax, y, x, xgroupScale, yMaxDomain);
  annotateWomen(womenMax, y, x, xgroupScale, yMaxDomain);


}

function annotateMen(maxVal, y, x, xgroupScale, yMaxDomain){

  mencolor = "lightblue";
  annotate(maxVal, y, x, xgroupScale, yMaxDomain, mencolor);
}

function annotateWomen(maxVal, y, x, xgroupScale, yMaxDomain){

  womencolor = "pink";
  modifier = .8;
  annotate(maxVal, y, x, xgroupScale, yMaxDomain, womencolor, modifier);
}

function annotate(max, y, x, xgroupScale, yMaxDomain, color, mod = 1){

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
    .attr("x", (2*margin+width)*.65*mod*mod)
    .attr("y", .5*margin)
    .text("Max: "+max)
    .style("font-size", "15px");
}

/*
console.log(fdata);
  if(filters.sex == 'Men'){ fdata = [{'DataValue':20, 'YearStart':domain[0]},
{'DataValue':25, 'YearStart':domain[1]},{'DataValue':30, 'YearStart':domain[2]}];}
  else{ fdata = [{'DataValue':10, 'YearStart':domain[0]},
{'DataValue':15, 'YearStart':domain[1]},{'DataValue':20, 'YearStart':domain[2]}];}

*/
