function draw_age(data){

  return;

  scatter_id = '#chart4';
  width = 200;
  height = 200;
  margin = 50;
  xax = 250;

  x=d3.scaleLog().domain([10,150]).range([0,width]);
  y=d3.scaleLog().domain([10,150]).range([height,0]);
  r=d3.scaleLinear().domain([0,14]).range([0,14]);

   d3.select(scatter_id).append('g')
                   .attr('transform',"translate("+margin+","+margin+")")
                   .selectAll('circle')
                   .data(data).enter()
                   .append("circle")
                   .attr('class','scatter4')
                   .attr('cx', function(d){return x(d.AverageCityMPG);})
                   .attr('cy', function(d){return y(d.AverageHighwayMPG);})
                   .attr('r', function(d){return 2+r(d.EngineCylinders);});

  d3.select(scatter_id).attr('width',width+2*margin)
                  .attr('height', height+2*margin)
                  .append('g')
                  .attr('transform',"translate("+margin+","+margin+")")
                  .call(d3.axisLeft(y)
                          .tickValues([10,20,50,100])
                          .tickFormat(d3.format("~s")));
  d3.select(scatter_id).attr('width',width+2*margin)
                  .attr('height', height+2*margin)
                  .append('g')
                  .attr('transform',"translate("+margin+","+xax+")")
                  .call(d3.axisBottom(x)
                          .tickValues([10,20,50,100])
                          .tickFormat(d3.format("~s")));
}

function ud_age(){

  dropdown = updateDropdown('#select_country', age_countries, drop_callback);
}
