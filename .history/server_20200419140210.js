const TEAM_TOAD = 0
const TEAM_KOOPA = 1

if (process.env.HEROKU) {
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
}
const Discord = require('discord.js'); //Añadímos la librería de discord.js
const config = require("./config.json") //Añadimos el jonshon de la configuración
const team_config = require("./team_config.json")
//const client = new Discord.Client(); //Creamos el cliente
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
	get_save_object() {
		return {
			name: this.name,
			points: this.points,
			rank_names: this.rank_names
		}
	}
}

let teams = {}
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
	constructor(userid, team, points, level, levelup_req, rank, tokens) {
		this.userid = userid
		if (!teams[team]) {
			return console.error(`User ${userid} does not have a valid team`)
		}
		this.team = team
		this.points = points
		this.level = level
		this.rank = rank
		this.levelup_req = levelup_req
		this.tokens = tokens
	}
	// Levelup req significa Levelup requirement y 
	// son los puntos necesario para subir de nivel

	calculate_levelup_req() { 
		// El primer nivel 40, el segundo 44 y luego req + 4
		if (this.level == 1) { this.levelup_req = 40; return; }
		if (this.level == 2) { this.levelup_req = 44; return; }
		this.levelup_req = this.levelup_req + USER_LEVELUP_ADDER * (this.level-2)
	}
	levelup() {

	}
	add_points(points) {
		
	}
	get_save_object() {
		return {
			userid: this.userid,

		}
	}
}

function load_teams() {

}

user = new User("304249537101299712", TEAM_TOAD, 0, 0, 0, "0", 0)
if (typeof user == Error) {
	console.log("Error!")
}