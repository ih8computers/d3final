var years = [];
var yearIndex = 0;
var interval_id;
var isPaused = false;
var isAnimating = false;

function age_chart(){

  var scene = scene_list[slide_index];
  console.log(slide_index);
  var fdata = getFilteredData(scene.data, filters);

  yearIndex = 0;
  fdata = fdata.filter(function(d){ return d.MaritalStatus == filters.status;});
  years = getYears(fdata);
  fdata = fdata.filter(function(d){ return d.YearStart == years[yearIndex];});
  var domain = fdata.map(d => d.AgeGroup).sort();;

  setupSlider(true);

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


  setTimeout(function(){startAnimation();},5000);
  //interval_id = window.setInterval(cycleYears, 1000)
}

function updateAgeChart(){

  var scene = scene_list[slide_index];
  console.log(slide_index);
  var fdata = getFilteredData(scene.data, filters);

  fdata = fdata.filter(function(d){ return d.MaritalStatus == filters.status;});
  years = getYears(fdata);
  fdata = fdata.filter(function(d){ return d.YearStart == years[yearIndex];});
  var domain = fdata.map(d => d.AgeGroup).sort();

  x=d3.scaleBand().domain(domain).range([0,width]).padding(0.2);
  y=d3.scaleLinear().domain([0,100]).range([height,0]);

  ch = d3.select('svg').selectAll('g.rect-group').selectAll('rect').data(fdata);
  ch.enter().append('rect').merge(ch)
    .transition()
    .duration(700)
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

  if(isPaused){ return; }

	yearIndex++;
	if(yearIndex < years.length){
		//setTimeout(cycleYears, 5000);
    //console.log(yearIndex,' ',years.length,' ',years[yearIndex],' ', years);

    updateChart();
  } else {

    stopAnimation();
  }

  // document.getElementById('yearSlider').value = yearIndex;
  // span = document.getElementById('ysSpan');
  // span.innerHTML = '';
  // span.appendChild(document.createTextNode(''+years[yearIndex]));

}

function setupSlider(reset = false){

  document.getElementById('ys_div').style.display = "block";
  document.getElementById('yearSlider').max = years.length-1;

  if(reset){
    yearIndex = 0;
  }
  document.getElementById('yearSlider').value = yearIndex;

  span = document.getElementById('ysSpan');
  span.innerHTML = '';
  span.appendChild(document.createTextNode(''+years[yearIndex]));
}

function ys_callback(e){

  span = document.getElementById('ysSpan');
  span.innerHTML = '';
  span.appendChild(document.createTextNode(''+years[e.target.value]));

  yearIndex = e.target.value;
  updateAgeChart();
}

function hideSlider(){
  document.getElementById('ys_div').style.display = "none";
  document.getElementById('yearSlider').value = 0;
}

function stopAnimation(){
  isAnimating = false;
  window.clearInterval(interval_id);
  yearIndex = years.length - 1;
  document.getElementById('PlayPause').firstChild.data = "Play";
}

function startAnimation(){
  if(slide_index < 1){ return; }
  if(isAnimating){return;}
  isAnimating = true;
  setupSlider(true);
  document.getElementById('PlayPause').firstChild.data = "Pause";
  interval_id = window.setInterval(cycleYears, 1000);
}
