

function divorce_chart(){

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

                ret = groups.map(key => ({key: key, value: d.Sex == key ? d.DataValue : 0, year : d.YearStart, sname : d['DataCatalog ShortName'], age : d.AgeGroup}));
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
                .attr("fill", d => color(d.key))
                .on('mousemove', function (d, i) {
                                  tt_on(this, d, i);
                                 })
                .on('mouseout', function (d, i) {
                                  tt_off(this, d, i);
                                });

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
}

function updateDivorceChart(){

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

                ret = groups.map(key => ({key: key, value: d.Sex == key ? d.DataValue : 0, year : d.YearStart, sname : d['DataCatalog ShortName'], age : d.AgeGroup}));
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
                              .attr("fill", d => color(d.key))
                              .on('mousemove', function (d, i) {
                                                tt_on(this, d, i);
                                               })
                              .on('mouseout', function (d, i) {
                                                tt_off(this, d, i);
                                              }),
                     update => update.on('mousemove', function (d, i) {
                                       tt_on(this, d, i);
                                      })
                                      .on('mouseout', function (d, i) {
                                       tt_off(this, d, i);
                                      })
                               .transition().duration(700)
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
