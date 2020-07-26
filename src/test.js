
var data;

function init(){

  pullData();
  onload_slides();
}

async function pullData(){

  data = await d3.csv("https://flunky.github.io/cars2017.csv");

  draw_scatter_1(data);
  draw_scatter_2(data);
  draw_scatter_3(data);
  draw_scatter_4(data);

  //changeSlide(-1);
}

function onclickTest(){

  alert("Test Button Clicked!");

  return;
}

function draw_scatter_1(data){

  scatter_id = '#chart1';
  //scatter_id = '#display_svg';
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
                   .attr('class','scatter')
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
