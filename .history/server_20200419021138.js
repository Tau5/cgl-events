const USER_TEAM_TOAD = 0
const USER_TEAM_KOOPA = 1


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
RANKS = ["0", "A", "B", "C"]
RANKS_LEVEL_REQUIREMENT = [0, 10, 25, 40] //Los niveles que se necesitan para obtener el rango
users = []
USER_LEVELUP_ADDER = 15 // Se añade al requirement de puntos para llegar al siguiente nivel
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
		this.levelup
	}
	//Levelup req significa Levelup requirement y 
	// son los puntos necesario para subir de nivel
	calculate_levelup_req(level) { 
		
	}
	add_points(points) {

	}
}