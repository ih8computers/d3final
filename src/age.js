var years = [];
var yearIndex = 0;
var interval_id;
var isPaused = false;
var isAnimating = false;

var sexMaxGlobal = [];
sexMaxGlobal["Men"] = {max : 0, age : "[20-24]", year : -13};
sexMaxGlobal["Women"] = {max : 0, age : "[20-24]", year : -13};

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
  sexMax["Men"] = {max : 0, age : -13, year : -13};
  sexMax["Women"] = {max : 0, age : -13, year : -13};

  var bars = d3.select('svg')
              .append('g')
              .attr('transform',"translate("+margin+","+margin+")")
              .classed('over',true)
              .selectAll("g")
              .data(fdata)
              .join("g")
                .attr("transform", d => `translate(${x(d['AgeGroup'])},0)`)
              .selectAll("rect")
              .data(function(d){

                ret = groups.map(key => ({key: key, value: d.Sex == key ? d.DataValue : 0}));
                console.log(d.Sex);
                if(sexMaxGlobal[d.Sex].max < d.DataValue && d.AgeGroup == sexMaxGlobal[d.Sex].age){
                  sexMaxGlobal[d.Sex].max = parseFloat(d.DataValue);
                  sexMaxGlobal[d.Sex].year = d.YearStart;
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
                .call(d3.axisLeft(y));

console.log(sexMax);
menMax = sexMaxGlobal["Men"].max;//Math.max(...sexMax["Men"].map(key => parseFloat(key)).sort());
menMaxYear = sexMaxGlobal["Men"].year;
womenMax = sexMaxGlobal["Women"].max;//Math.max(...sexMax["Women"].map(key => parseFloat(key)).sort());
womenMaxYear = sexMaxGlobal["Women"].year;
//console.log(menMax,'',womenMax);
d3.select('svg').selectAll('.annotation').remove();
if(sexMaxGlobal["Men"].year != -13)
  annotateAgeMen(menMax, menMaxYear, y, x, xgroupScale, 100);
if(sexMaxGlobal["Women"].year != -13)
  annotateAgeWomen(womenMax, womenMaxYear, y, x, xgroupScale, 100);


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
  sexMax["Men"] = {max : 0, age : -13};
  sexMax["Women"] = {max : 0, age : -13};


  var bars = d3.select('svg')
               .selectAll('g.over')
               .attr('transform',"translate("+margin+","+margin+")")
               .selectAll("g")
               .data(fdata)
               .join("g")
                //.classed('over', true)
                .attr("transform", d => `translate(${x(d['AgeGroup'])},0)`)
               .selectAll("rect")
               .data(function(d){

                ret = groups.map(key => ({key: key, value: d.Sex == key ? d.DataValue : 0}));
                console.log(d.Sex);
                if(sexMaxGlobal[d.Sex].max < d.DataValue && d.AgeGroup == sexMaxGlobal[d.Sex].age){
                  sexMaxGlobal[d.Sex].max = parseFloat(d.DataValue);
                  sexMaxGlobal[d.Sex].year = d.YearStart;
                }
                return ret;
              })
              .join( enter => enter.append('rect')
                              .attr("x", function(d){ return xgroupScale(d.key);})
                              .attr("y", function(d){ console.log(d.value);return y(d.value);})
                              .attr("width", xgroupScale.bandwidth())
                              .attr("height", d => height - y(d.value))
                              .attr("fill", d => color(d.key)),
                     update => update.transition().duration(700)
                               .attr("x", function(d){ return xgroupScale(d.key);})
                               .attr("y", function(d){ console.log(d.value);return y(d.value);})
                               .attr("width", xgroupScale.bandwidth())
                               .attr("height", d => height - y(d.value))
                               .attr("fill", d => color(d.key)),
                     exit   => exit.remove());

  d3.select('svg').select('g.x-axisgroup')
                  .attr('transform',"translate("+margin+","+xax+")")
                  .call(d3.axisBottom(x));
  d3.select('svg').select('g.y-axisgroup')
                  .attr('transform',"translate("+margin+","+margin+")")
                  .attr('height',height)
                  .call(d3.axisLeft(y));

  console.log(sexMax);
  menMax = sexMaxGlobal["Men"].max;//Math.max(...sexMax["Men"].map(key => parseFloat(key)).sort());
  menMaxYear = sexMaxGlobal["Men"].year;
  womenMax = sexMaxGlobal["Women"].max;//Math.max(...sexMax["Women"].map(key => parseFloat(key)).sort());
  womenMaxYear = sexMaxGlobal["Women"].year;
  //console.log(menMax,'',womenMax);
  d3.select('svg').selectAll('.annotation').remove();
  if(sexMaxGlobal["Men"].year != -13)
    annotateAgeMen(menMax, menMaxYear, y, x, xgroupScale, 100);
  if(sexMaxGlobal["Women"].year != -13)
    annotateAgeWomen(womenMax, womenMaxYear, y, x, xgroupScale, 100);
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

    //d3.select('svg').selectAll('.annotation').remove();
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

function annotateAgeWomen(max, year, y, x, xgroupScale, yMaxDomain){

  console.log("ANNOTATE AGE WOMEN");

  color = "pink";

  line1x1 = margin;
  line1x2 = line1x1 + width;
  line2x1 = line1x2;
  line2x2 = line2x1;

  line1y1 = margin+y(max);
  line1y2 = margin+y(max);
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
    .attr("x", line2x2*.7)
    .attr("y", line2y2)
    .text("Max: "+max+"% of Women aged: "+sexMaxGlobal["Women"].age+" ("+year+")")
    .style("font-size", "15px");
}

function annotateAgeMen(max, year, y, x, xgroupScale, yMaxDomain){

  color = "lightblue";

  line1x1 = width + margin;
  line1x2 = margin*2;
  line2x1 = line1x2;
  line2x2 = line2x1;

  line1y1 = margin+y(max);
  line1y2 = margin+y(max);
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
    .text("Max: "+max+"% of Men aged: "+sexMaxGlobal["Men"].age+" ("+year+")")
    .style("font-size", "15px");
}

function reset_sexmaxglobal(){
  sexMaxGlobal = [];
  sexMaxGlobal["Men"] = {max : 0, age : "[20-24]", year : -13};
  sexMaxGlobal["Women"] = {max : 0, age : "[20-24]", year : -13};
}
