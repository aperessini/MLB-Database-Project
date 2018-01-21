

var express = require('express');
var mysql = require('./dbcon3.js');
var bodyParser = require('body-parser');
var async = require('async');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//app.set('port', 5100);
app.use(express.static('jsfiles'));
var port = Number(process.env.PORT || 8000);
var server = app.listen(port, function() {
        console.log('Listening on port ' + server.address().port);
});

app.get('/',function(req,res,next){
  var context = {};

  mysql.pool.query("CREATE TABLE IF NOT EXISTS `location` (`location_id` int(11) NOT NULL AUTO_INCREMENT, `city` varchar(255) NOT NULL, `state` varchar(255), `country` varchar(255) NOT NULL, PRIMARY KEY(`location_id`), UNIQUE KEY(`city`, `state`, `country`);", function(err, rows, fields){
  if(err){
    next(err);
    return;
    }
    mysql.pool.query('SELECT city, state, country FROM location', function(err, rows, fields){
      if(err){
        next(err);
        return;
    }
    context.locations = rows;
    //console.log(context.locations);
    //res.render('homeMLB', context);
  //});  
    if(req.query.teams_order_by == null)
    {
        req.query.teams_order_by = 'team_id'
    } 
    mysql.pool.query("SELECT T.team_id, team_location_id, team_name, stadium_name, league, division, wins, losses, mascot, city, state, country FROM team T INNER JOIN location LO on LO.location_id = T.team_location_id ORDER BY " + req.query.teams_order_by, function(err, rows, fields){   // [req.query.order_by]
        if(err){
        next(err);
        return;
        }
        context.teams = rows;
    // console.log(context.teams);
        //res.render('homeMLB', context);
    //});  

        mysql.pool.query('SELECT player_id, first_name, last_name, dob, position, uni_num, bats, throws, team_name, city, state, country FROM player P INNER JOIN location L on L.location_id = P.hometown_id INNER JOIN team TE on TE.team_id = P.team_id', function(err, rows, fields){
            if(err){
            next(err);
            return;
            }
            context.players = rows;
            //console.log(context.players);
            //res.render('homeMLB', context);
        //});

            mysql.pool.query('SELECT first_name, last_name, batting_average, hits, runs_scored, runs_batted_in, home_runs, walks, strikeouts FROM player PL INNER JOIN hitting_stats HS on HS.player_id = PL.player_id', function(err, rows, fields){
                if(err){
                next(err);
                return;
                }
		rows.forEach(function(row){
		    row.batting_average = row.batting_average.toFixed(3);
		});
                context.hittingstats = rows;
                //console.log(context.hittingstats);
                //res.render('homeMLB', context);
            // }); 

                mysql.pool.query('SELECT first_name, last_name, earned_run_average, opp_batting_average, wins, losses, walks, strikeouts FROM player PL INNER JOIN pitching_stats PS on PS.player_id = PL.player_id', function(err, rows, fields){
                    if(err){
                    next(err);
                    return;
                    }
		    rows.forEach(function(row){
                        row.opp_batting_average = row.opp_batting_average.toFixed(3);
			row.earned_run_average = row.earned_run_average.toFixed(2);
		    });
                    context.pitchingstats = rows;
                    //console.log(context.hittingstats);
                    //res.render('homeMLB', context);
                // }); 

                    mysql.pool.query('SELECT award_id, award_name FROM award', function(err, rows, fields){
                        if(err){
                        next(err);
                        return;
                        }
                        context.awards = rows;
                        //console.log(context);
                        //res.render('homeMLB', context);

                        mysql.pool.query('SELECT PA.player_id, PA.award_id, first_name, last_name, award_name, league, year FROM award A INNER JOIN player_awards PA on A.award_id = PA.award_id INNER JOIN player P on P.player_id = PA.player_id ORDER BY year', function(err, rows, fields){
                            if(err){
                            next(err);   
                            return;
                            }
                            context.playerawards = rows;
                            //console.log(context);
                            //res.render('homeMLB', context);

                            mysql.pool.query("SELECT player_id, first_name, last_name FROM player WHERE position='P'", function(err, rows, fields){
                                if(err){
                                next(err);
                                return;
                                }
                                context.pitchers = rows;
                                res.render('homeMLB', context);
                            });
                        }); 
                    }); 
                });   
             });
         });
      });
   }); 
});
});

app.post('/insert-location',function(req,res,next){
  var context = {};
  //console.log(req.body);

  mysql.pool.query('INSERT INTO location (`city`, `state`, `country`) VALUES (?, ?, ?)', [req.body.city, req.body.state, req.body.country], function(err, result){
    if(err){
        if(err.code == 'ER_DUP_ENTRY'){
            console.log(err.code);
            console.log(req.body.city + ", " + req.body.state + " " + req.body.country + " already exists in the database.");
        }
         else{
            next(err);
            return;
        }          
    }
    context.city = req.body.city;
    context.state = req.body.state;
    context.country = req.body.country;
    res.send(context);
    //res.redirect('/');
  });  
});

app.post('/insert-team',function(req,res,next){
  var context = {};
  //console.log(req.body);
  mysql.pool.query('INSERT INTO location (`city`, `state`, `country`) VALUES (?, ?, ?)', [req.body.city, req.body.state, req.body.country], function(err, results){
    if(err){
        if(err.code == 'ER_DUP_ENTRY'){
            mysql.pool.query("INSERT INTO team (`team_name`, `stadium_name`, `league`, `division`, `wins`, `losses`, `mascot`, `team_location_id`) VALUES ('" + req.body.team_name + "','" + req.body.stadium_name + "','" + req.body.league + "','" + req.body.division + "'," + req.body.team_wins + "," + req.body.team_losses + ",'" + req.body.mascot + "', (SELECT location_id FROM location WHERE city='" + req.body.city + "' AND state='" + req.body.state + "' AND country='" + req.body.country + "'))", function(err, result){
                if(err){
                    if(err.code == 'ER_DUP_ENTRY'){
                        console.log(err.code);
                        console.log(req.body.team_name + " already exists in database.")
                    }
                    else{
                        next(err);
                        return;
                    }          
                }
                context.team_name = req.body.team_name;
                context.stadium_name = req.body.stadium_name;
                context.league = req.body.league;
                context.division = req.body.division;
                context.team_wins = req.body.team_wins;
                context.team_losses = req.body.team_losses;
                context.mascot = req.body.mascot;
                context.city = req.body.city;
                context.state = req.body.state;
                context.country = req.body.country;
                res.send(context);
                //res.redirect('/');
            });
        }
         else{
            next(err);
            return;
        }          
    }

    else{
        mysql.pool.query("INSERT INTO team (`team_name`, `stadium_name`, `league`, `division`, `wins`, `losses`, `mascot`, `team_location_id`) VALUES ('" + req.body.team_name + "','" + req.body.stadium_name + "','" + req.body.league + "','" + req.body.division + "'," + req.body.team_wins + "," + req.body.team_losses + ",'" + req.body.mascot + "', (SELECT location_id FROM location WHERE city='" + req.body.city + "' AND state='" + req.body.state + "' AND country='" + req.body.country + "'))", function(err, result){
                if(err){
                    if(err.code == 'ER_DUP_ENTRY'){
                        console.log(err.code);
                        console.log(req.body.team_name + " already exists in database.")
                    }
                    else{
                        next(err);
                        return;
                    }          
                }
                context.team_name = req.body.team_name;
                context.stadium_name = req.body.stadium_name;
                context.league = req.body.league;
                context.division = req.body.division;
                context.team_wins = req.body.team_wins;
                context.team_losses = req.body.team_losses;
                context.mascot = req.body.mascot;
                context.city = req.body.city;
                context.state = req.body.state;
                context.country = req.body.country;
                res.send(context);
                //res.redirect('/');
            });
    }
  });  

 /* mysql.pool.query('INSERT INTO team (`team_name`, `stadium_name`, `league`, `division` `wins`, `losses`, `mascot`) VALUES (?, ?, ?, ?, ?, ?, ?); INSERT INTO location (`city`, `state`, `country`) VALUES (?, ?, ?); COMMIT' [req.body.team_name, req.body.stadium_name, req.body.league, req.body.division, req.body.team_wins, req.body.team_losses, req.body.mascot, req.body.city, req.body.state, req.body.country],  function(err, result){
      console.log(req.body.city);
    if(err){
        if(err.code == 'ER_DUP_ENTRY'){
            console.log(err.code);
        }
         else{
            next(err);
            return;
        }          
    }
    res.redirect('/');
  });  */
});   


app.post('/insert-player',function(req,res,next){
  var context = {};
  if(req.body.city == "" || req.body.first_name == "" || req.body.last_name == "" || req.body.dob == "" || req.body.uni_num == "")
  {
      console.log("All fields are required. Please try again.")
      res.redirect('/');
  }

  else{
      mysql.pool.query('INSERT INTO location (`city`, `state`, `country`) VALUES (?, ?, ?)', [req.body.city, req.body.state, req.body.country], function(err, results){
    if(err){
        if(err.code == 'ER_DUP_ENTRY'){
            mysql.pool.query("INSERT INTO player (`first_name`, `last_name`, `dob`, `position`, `uni_num`, `bats`, `throws`, `team_id`, `hometown_id`) VALUES ('" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.dob + "','" + req.body.position + "','" + req.body.uni_num + "','" + req.body.bats + "','" + req.body.throws + "','" + req.body.team_id + "', (SELECT location_id FROM location WHERE city='" + req.body.city + "' AND state='" + req.body.state + "' AND country='" + req.body.country + "'))", function(err, result){
                console.log(req.body.team_id);
                if(err){
                    if(err.code == 'ER_DUP_ENTRY'){
                        console.log(err.code);
                    }
                    else{
                        next(err);
                        return;
                    }          
                }
                res.redirect('/');
            });
        }
         else{
            next(err);
            return;
        }          
    }

    else{
        mysql.pool.query("INSERT INTO player (`first_name`, `last_name`, `dob`, `position`, `uni_num`, `bats`, `throws`, `team_id`, `hometown_id`) VALUES ('" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.dob + "','" + req.body.position + "','" + req.body.uni_num + "','" + req.body.bats + "','" + req.body.throws + "','" + req.body.team_id + "', (SELECT location_id FROM location WHERE city='" + req.body.city + "' AND state='" + req.body.state + "' AND country='" + req.body.country + "'))", function(err, result){
                //console.log(req.body.team_id);
                if(err){
                    if(err.code == 'ER_DUP_ENTRY'){
                        console.log(err.code);
                    }
                    else{
                        next(err);
                        return;
                    }          
                }
                res.redirect('/');
            });
    }
  });  

  }
});

app.post('/insert-award',function(req,res,next){
  var context = {};
  if(req.body.award_name == "")
  {
      console.log('Award Name is required. Please try again.');
      res.redirect('/');
  }

else{
  mysql.pool.query('INSERT INTO award (`award_name`) VALUES (?)', [req.body.award_name], function(err, results){
    if(err){
        if(err.code == 'ER_DUP_ENTRY'){
            console.log(err.code);
        }
        else{
          next(err);
          return;
        }          
    }

     res.redirect('/');
    });
}
});  

app.post('/insert-player-award',function(req,res,next){
  var context = {};
  //console.log(req.body.player_id, req.body.award_id, req.body.year, req.body.league);
  mysql.pool.query('INSERT INTO player_awards (`player_id`, `award_id`, `year`, `league`) VALUES (?, ?, ?, ?)', [req.body.player_id, req.body.award_id, req.body.year, req.body.league], function(err, results){
    if(err){
        if(err.code == 'ER_DUP_ENTRY'){
            console.log(err.code);
        }
        else{
          next(err);
          return;
        }          
    }

     res.redirect('/');
    });
});  

app.post('/delete-player-award',function(req,res,next){
  var context = {};
  //console.log(req.body.player_id, req.body.award_id, req.body.league, req.body.year);
  mysql.pool.query('DELETE FROM player_awards WHERE player_id=? AND award_id=? AND league=? AND year=?', [req.body.player_id, req.body.award_id, req.body.league, req.body.year], function(err, result){
    if(err){
      next(err);
      return;
    }
    
    res.redirect('/');
  });
});


app.post('/update-hitting-stats',function(req,res,next){
  var context = {};

  mysql.pool.query('INSERT INTO hitting_stats (`player_id`, `hits`, `batting_average`, `runs_scored`, `runs_batted_in`, `home_runs`, `walks`, `strikeouts`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [req.body.player_id, req.body.hits, req.body.batting_average, req.body.runs_scored, req.body.runs_batted_in, req.body.home_runs, req.body.walks, req.body.strikeouts], function(err, results){
    if(err){
        if(err.code == 'ER_DUP_ENTRY'){
            console.log(err.code);
            mysql.pool.query("SELECT * FROM hitting_stats WHERE player_id=?", [req.body.player_id], function(err, result){
                if(err){
                next(err);
                return;
                }
            
                if(result.length == 1){
                    var curVals = result[0];
                    mysql.pool.query("UPDATE hitting_stats SET hits=?, batting_average=?, runs_scored=?, runs_batted_in=?, home_runs=?, walks=?, strikeouts=? WHERE player_id=? ",
                        [req.body.hits || curVals.hits, req.body.batting_average || curVals.batting_average, req.body.runs_scored || curVals.runs_scored, req.body.runs_batted_in || curVals.runs_batted_in, 
                        req.body.home_runs || curVals.home_runs, req.body.walks || curVals.walks, req.body.strikeouts || curVals.strikeouts, req.body.player_id],
                        function(err, result){
                            if(err){
                            next(err);
                            return;
                            }

                            else
                            {
                                res.redirect('/');                                        
                            }
                            
                        });
                 }
            });
        }
                    
        else{
            next(err);
            return;
        }  
        
    }

    else
    {
        res.redirect('/');                                        
    }
    });
});



app.post('/update-pitching-stats',function(req,res,next){
  var context = {};

  console.log("Updating stats for player: " + req.body.player_id);
  
  mysql.pool.query('INSERT INTO pitching_stats (`player_id`, `earned_run_average`, `opp_batting_average`, `wins`, `losses`, `walks`, `strikeouts`) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.body.player_id, req.body.earned_run_average, req.body.opp_batting_average, req.body.wins, req.body.losses, req.body.walks, req.body.strikeouts], function(err, results){
    if(err){
        if(err.code == 'ER_DUP_ENTRY'){
            console.log(err.code);
  
            mysql.pool.query("SELECT * FROM pitching_stats WHERE player_id=?", [req.body.player_id], function(err, result){
                if(err){
                    next(err);
                    return;
                }
                
                if(result.length == 1){
                    var curVals = result[0];
                    mysql.pool.query("UPDATE pitching_stats SET earned_run_average=?, opp_batting_average=?, wins=?, losses=?, walks=?, strikeouts=? WHERE player_id=? ",
                        [req.body.earned_run_average || curVals.earned_run_average, req.body.opp_batting_average || curVals.opp_batting_average, req.body.wins || curVals.wins, req.body.losses || curVals.losses, 
                        req.body.walks || curVals.walks, req.body.strikeouts || curVals.strikeouts, req.body.player_id],
                        function(err, result){
                            if(err){
                                next(err);
                                return;
                            }
                            else
                            {
                                res.redirect('/');
                            }
                         }); 
                }  
            });
        }
        
        else{
            next(err);
            return;
        } 
    }

    else
    {
        res.redirect('/');
                
    }
    
});
});


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
