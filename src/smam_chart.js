

function draw_smam(data){

  scatter_id = '#chart1';
  //scatter_id = '#display_svg';
  width = 200;
  height = 200;
  margin = 50;
  xax = 250;

  return;

  var domain = [];

  data = data.filter(function(d){
		if (d['Country or area'] == 'Afghanistan' && d['Sex'] == 'Men') 		{
    		if(!domain.includes(d['YearStart'])){
    			domain.push(d['YearStart']);

        	return true;
         }
         else{
         		console.log("already has it");
         		return false;
          }
    }

  });
}
