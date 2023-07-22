var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '34.29.246.131',
                user: 'root',
                password: 'hottubsteamerss',
                database: 'SterlingEngine'
});

connection.connect;


var app = express();

var searchQuery='';
var currUserID=0;

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  var sql = 'SELECT * FROM Games g NATURAL JOIN Details d JOIN (SELECT g.Game, COUNT(*) AS NumOwners FROM Games g NATURAL JOIN Details d JOIN Owns o ON g.Game = o.Game GROUP BY g.Game) own ON g.Game = own.Game JOIN (SELECT Game, Rating AS MediaRating, LocalRating FROM Games JOIN (SELECT Game, AVG(Rating) AS LocalRating FROM Reviews GROUP BY Game) AS LocalRatingTable USING (Game)) r ON g.Game = r.Game;'

  connection.query(sql, function (err, data, fields) {
    if (err) throw err;
  res.render('index', { title: 'Sterling Engine', gamesData: data, UserID: currUserID });  
  });
});

app.get('/changeusernamepage', function(req, res) {
	res.render('changeusernamepage');
});

app.post('/changeusername', function(req,res) {
	var newUsr = req.body.username;
	var sql = 'UPDATE Users SET Username="'+newUsr+'" WHERE UserID='+currUserID+';';
	connection.query(sql, function (err, data, fields) {
            if (err) throw err;
             res.redirect('/');
         }); 
});

app.get('/deleteacc', function(req,res) {
	var sql = 'DELETE FROM Users WHERE UserID =' +currUserID;
	connection.query(sql, function (err, data, fields) {
            if (err) throw err;
	    currUserID = 0;
		res.redirect('/');
         }); 

});

app.get('/signuppage', function(req,res) {
	res.render('signup');
});

app.post('/signup', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var sql = 'SELECT COUNT(*) AS count FROM Users'
	var UserID=9999;	

	connection.query(sql, function (err, rows, fields) {
	    if (err) throw err;
	    createUser(username, password, rows[0].count );

	 });

	res.redirect('/');
	
});

function createUser(username, password, UserID){
	var sql = 'INSERT INTO Users (UserID, Username, Password, Reviews) VALUES ('+UserID+',"'+username+'","'+password+'", 0);';
        connection.query(sql, function (err, data, fields) {
            if (err) throw err;
            currUserID = UserID;
            
	});
}

app.post('/search', function(req,res) {
	searchQuery = req.body.search;
	
	var sql = 'SELECT * FROM Games g NATURAL JOIN Details d JOIN (SELECT g.Game, COUNT(*) AS NumOwners FROM Games g NATURAL JOIN Details d JOIN Owns o ON g.Game = o.Game GROUP BY g.Game) own ON g.Game = own.Game JOIN (SELECT Game, Rating AS MediaRating, LocalRating FROM Games JOIN (SELECT Game, AVG(Rating) AS LocalRating FROM Reviews GROUP BY Game) AS LocalRatingTable USING (Game)) r ON g.Game = r.Game WHERE d.Game LIKE "%' +searchQuery+ '%" OR d.Game LIKE "%' +searchQuery+ '" OR d.Game LIKE "' +searchQuery+ '%";';
	

	connection.query(sql, function (err, data, fields) {
	    	
		if (err) throw err;
	  	res.render('index', { title: 'Sterling Engine', gamesData: data, UserID: currUserID });  
  	});
});

app.listen(80, function () {
    console.log('Node app is running on port 80');
});
