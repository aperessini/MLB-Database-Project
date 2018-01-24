

document.addEventListener('DOMContentLoaded', bindButtons);

document.getElementById('body').style.fontFamily = 'Arial';
document.getElementById('body').style.backgroundColor = '#e0eaf9';
var h1 = document.getElementsByTagName('h1');
var h2 = document.getElementsByTagName('h2');
var tables = document.getElementsByTagName('table');
var headers = document.getElementsByTagName('th');
var tds = document.getElementsByTagName('td');
var dobs = document.getElementsByName('dob');
var fieldsets = document.getElementsByTagName('fieldset');
var legends = document.getElementsByTagName('legend');


h1[0].style.color = '#0C2C56';

for(var x = 0; x < h2.length; x++)
{
   h2[x].style.color = 'silver';
   h2[x].style.backgroundPosition = 'top left';
   h2[x].style.backgroundColor = 'teal';
   h2[x].style.backgroundSize = '1px 1px';

}

for(var x = 0; x < tables.length; x++)
{
    tables[x].style.border = 'medium solid #005C5C';
    tables[x].style.textAlign = 'left';
    //tables[x].style.margin = '0 auto';
    //tables[x].style.width = '50%';

}

for(var x = 0; x < headers.length; x++)
{
    headers[x].style.textDecoration = 'underline';
    headers[x].style.padding = '5px';
    
}

for(var x = 0; x < tds.length; x++)
{
   tds[x].style.padding = '5px';
}

for(var x = 0; x < dobs.length; x++)
{
    var str = dobs[x].innerText.toString();
    console.log(str);
    dobs[x].innerText = str.substring(4,15);
}

for(var x = 0; x < fieldsets.length; x++)
{
   fieldsets[x].style.width = '50%';
   fieldsets[x].style.backgroundColor = 'silver';

}

for(var x = 0; x < legends.length; x++)
{
   legends[x].style.color = 'silver';
   legends[x].style.backgroundColor = 'teal';
   legends[x].style.fontWeight = 'bold';
}




function bindButtons(){

        document.getElementById('add_location_submit').addEventListener('click', function(event){
	var hostname = "http://mlb-database-peressini.herokuapp.com";          
          var req = new XMLHttpRequest();
          var city = document.getElementById('add_location_city').value;
          if(city == "")
          {
              alert("City is required. Please try again.");
              //event.preventDefault();
              return;
          }
          var state = document.getElementById('add_location_state').value;
          var country = document.getElementById('add_location_country').value;
         // var params = "city=" + city + "&state=" + state + "&country=" + country; //"city=" + city + "&state=" + state + "&country=" + country;
          //alert(params);

          
          req.open('POST', "/insert-location", true);
          req.setRequestHeader('Content-Type', 'application/json');
          req.addEventListener("load", function(){
          if(req.status >= 200 && req.status < 400)
          {
              var response = req.responseText;
              //alert(response);

          }
          else
          {
             console.log("Error in network request: " + req.statusText);
          }
              
                          
         });
          //event.preventDefault();  
          req.send('{"city": "' + city + '", "state": "' + state + '", "country": "' + country + '"}');           //'{"city": "' + city + '", "state": "' + state + '", "country": "' + country + '"}'
                    
        });



        document.getElementById('add_team_submit').addEventListener('click', function(event){
          
          var req = new XMLHttpRequest();
          var team_name = document.getElementById('add_team_name').value;
          var stadium_name = document.getElementById('add_team_stadium_name').value;
          var league = document.getElementById('add_team_league').value;
          var division = document.getElementById('add_team_division').value; 
          var wins = document.getElementById('add_team_wins').value;    
          var losses = document.getElementById('add_team_losses').value;  
          var mascot = document.getElementById('add_team_mascot').value;   
          var city = document.getElementById('add_team_city').value;
          if(city == "" || team_name == "" || stadium_name == "" || wins == "" || losses == "" || mascot == "")
          {
              console.log("All team attributes are required. Please try again.");
              //event.preventDefault();
              return;
          }
          var state = document.getElementById('add_team_state').value;
          var country = document.getElementById('add_team_country').value;
          //var params = "city=" + city + "&state=" + state + "&country=" + country; //"city=" + city + "&state=" + state + "&country=" + country;
          //alert(params);

          
          req.open('POST', "/insert-team", true);
          req.setRequestHeader('Content-Type', 'application/json');
          req.addEventListener("load", function(){
          if(req.status >= 200 && req.status < 400)
          {
              var response = req.responseText;
              //alert(response);

          }
          else
          {
             console.log("Error in network request: " + req.statusText);
          }
              
                          
         });
          //event.preventDefault();  
          req.send('{"team_name": "' + team_name + '", "stadium_name": "' + stadium_name + '", "league": "' + league + '", "division": "' + division + '", "team_wins": ' + wins + ', "team_losses": ' + losses + ', "mascot": "' + mascot + '", "city": "' + city + '", "state": "' + state + '", "country": "' + country + '"}');           //'{"city": "' + city + '", "state": "' + state + '", "country": "' + country + '"}'
                    
        });


        document.getElementById('teams_sort_submit').addEventListener('click', function(event){
          
          var req = new XMLHttpRequest();
          
          var order_by = document.getElementById('teams_sort_on').value;
          //var params = "city=" + city + "&state=" + state + "&country=" + country; //"city=" + city + "&state=" + state + "&country=" + country;
          //alert(params);
          //alert(order_by);
          
          req.open('GET', hostname + "/?teams_order_by=" + order_by, true);
          req.setRequestHeader('Content-Type', 'application/json');
          req.addEventListener("load", function(){
          if(req.status >= 200 && req.status < 400)
          {
              var response = req.responseText;
              //alert(response);

          }
          else
          {
             console.log("Error in network request: " + req.statusText);
          }
              
                          
         });
          //event.preventDefault();  
          req.send(null);           //'{"city": "' + city + '", "state": "' + state + '", "country": "' + country + '"}'
                    //'{"order_by": "' + order_by + '"}'
        });
}
