var years = [];
var yearIndex = 0;
var interval_id;

function age_chart(){

  var scene = scene_list[slide_index];
  console.log(slide_index);
  var fdata = getFilteredData(scene.data, filters);

  fdata = fdata.filter(function(d){ return d.MaritalStatus == filters.status;});
  years = getYears(fdata);
  fdata = fdata.filter(function(d){ return d.YearStart == years[yearIndex];});
  var domain = fdata.map(d => d.AgeGroup);

  // width = 800;
  // height = 800;
  // margin = 50;
  // xax = width - margin;

  x=d3.scaleBand().domain(domain).range([0,width]).padding(0.2);
  y=d3.scaleLinear().domain([0,100]).range([height,0]);

  d3.select('svg').attr('width',width+2*margin)
                  .attr('height', height+2*margin)
                  .append('g')
                  .classed('rect-group', true)
                  .attr('transform',"translate("+margin+","+margin+")")
                  .selectAll('rect').data(fdata).enter().append('rect')
                  .attr('x', function(d,i){return x(d.AgeGroup);})
                  .attr('y', function(d,i){return y(d.DataValue);})
                  .attr('width', function(d,i){return x.bandwidth()})
                  .attr('height', function(d,i){return height-y(d.DataValue);});

  d3.select('svg').attr('width',width+2*margin)
                  .attr('height', height+2*margin)
                  .append('g')
                  .classed('xaxis-group',true)
                  .attr('transform',"translate("+margin+","+xax+")")
                  .call(d3.axisBottom(x));
  d3.select('svg').attr('width',width+2*margin)
                  .attr('height', height+2*margin)
                  .append('g')
                  .classed('yaxis-group',true)
                  .attr('transform',"translate("+margin+","+margin+")")
                  .attr('height',height)
                  .call(d3.axisLeft(y));

  //setTimeout(function(){interval_id = window.setInterval(cycleYears, 5000)},5000);
  interval_id = window.setInterval(cycleYears, 3000)
}

function updateAgeChart(){

  var scene = scene_list[slide_index];
  console.log(slide_index);
  var fdata = getFilteredData(scene.data, filters);

  fdata = fdata.filter(function(d){ return d.MaritalStatus == filters.status;});
  years = getYears(fdata);
  fdata = fdata.filter(function(d){ return d.YearStart == years[yearIndex];});
  var domain = fdata.map(d => d.AgeGroup);

  // width = 800;
  // height = 800;
  // margin = 50;
  // xax = width - margin;

  x=d3.scaleBand().domain(domain).range([0,width]).padding(0.2);
  y=d3.scaleLinear().domain([0,100]).range([height,0]);

  ch = d3.select('svg').selectAll('g.rect-group').selectAll('rect').data(fdata);
  ch.enter().append('rect').merge(ch)
    .transition()
    .duration(2000)
    .attr('x', function(d,i){return x(d.AgeGroup);})
    .attr('y', function(d,i){console.log(y(d.DataValue));return y(d.DataValue);})
    .attr('width', function(d,i){return x.bandwidth()})
    .attr('height', function(d,i){return height-y(d.DataValue);});

  ch.exit().remove();

  d3.select('svg').selectAll('g.xaxis-group')
                	.attr('transform',"translate("+margin+","+xax+")")
                	.call(d3.axisBottom(x));
	d3.select('svg').selectAll('g.yaxis-group')
                	.attr('transform',"translate("+margin+","+margin+")")
                	.attr('height',height)
                	.call(d3.axisLeft(y));//.tickValues([0,100]).tickFormat(d3.format("~s")));
}

function getYears(cdata){

  return Array.from(new Set(cdata.map(function(record){
                    return record['YearStart']})));

}

function cycleYears(){

	yearIndex++;
	if(yearIndex < years.length){
		//setTimeout(cycleYears, 5000);
    console.log(yearIndex,' ',years.length,' ',years[yearIndex],' ', years);
    updateChart();
  } else {
    window.clearInterval(interval_id);
    yearIndex = 0;
  }

}
