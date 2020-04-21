const USER_TEAM_TOAD = 0
const USER_TEAM_KOOPA = 1
function objToString(obj, ndeep) { // https://stackoverflow.com/a/27055336/13172672
	switch(typeof obj){
	  case "string": return '"'+obj+'"';
	  case "function": return obj.name || obj.toString();
	  case "object":
		var indent = Array(ndeep||1).join('\t'), isArray = Array.isArray(obj);
		return ('{['[+isArray] + Object.keys(obj).map(function(key){
			 return '\n\t' + indent +(isArray?'': key + ': ' )+ objToString(obj[key], (ndeep||1)+1);
		   }).join(',') + '\n' + indent + '}]'[+isArray]).replace(/[\s\t\n]+(?=(?:[^\'"]*[\'"][^\'"]*[\'"])*[^\'"]*$)/g,'');
	  default: return obj.toString();
	}
  }

const http = require('http');
const express = require('express');
const app = express();
const request = require("request")
app.get("/", (request, response) => {
  response.sendStatus(200); //Heroku, no quiero pagar $ ¿Vale?
});
app.listen();
setInterval(() => {
  http.get(`http://cgl-events.herokuapp.com/`);
}, 5000);
const Discord = require('discord.js'); //Añadímos la librería de discord.js
const config = require("./config.json") //Añadimos el jonshon de la configuración
const client = new Discord.Client(); //Creamos el cliente
var RANKS = ["0", "A", "B", "C"]
var RANKS_LEVEL_REQUIREMENT = [0, 10, 25, 40] //Los niveles que se necesitan para obtener el rango
var users = []
var USER_LEVELUP_ADDER = 4 // Se añade al requirement de puntos para llegar al siguiente nivel
						// cada vez que se sube de nivel


/*
Team - Represent various traits of a team
*/
class Team {
	constructor(name, points, rank_names) {
		this.name = name
		this.points = points
		this.rank_names = rank_names
	}
	add_points(points) {
		this.points += points
	}
	set_rank_role(user, rank) {
		// TODO
	}
}
/*
User - Represents a user of the server

	* String - userid
		The user ID of the user
	* Int - team
		Represents the team the user belongs to
		Valid values are:
			USER_TEAM_TOAD
			USER_TEAM_KOOPA
	* Int - points
		The points the user has acquired
	* Int - level
		The level the user is
	* Int - rank
		The rank of the user
*/
class User {
	constructor(userid, team, points, level, rank) {
		this.userid = userid
		this.team = team
		this.points = points
		this.level = level
		this.rank = rank
		this.levelup_req
	}
	// Levelup req significa Levelup requirement y 
	// son los puntos necesario para subir de nivel

	calculate_levelup_req() { 
		if (this.level == 1) this.levelup_req = 40;
		if (this.level == 2) this.levelup_req = 44;
		if (this.levelup_req == undefined) this.levelup_req = 0;
		return this.levelup_req + USER_LEVELUP_ADDER * level
	}
	add_points(points) {

	}
}