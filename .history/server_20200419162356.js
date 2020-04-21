const TEAM_TOAD = 0
const TEAM_KOOPA = 1
var fs = require('fs');
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
const client = new Discord.Client(); //Creamos el cliente
var RANKS = []
RANKS	[0]		= "0"
RANKS	[10]	= "A"
RANKS	[25] 	= "B"
RANKS	[40] 	= "C"
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
		if (!teams[team]) {
			throw `User does not have a valid team`
		}
		this.userid = userid
		this.team = team
		this.points = points
		this.level = level
		this.levelup_req = levelup_req
		this.rank = rank
		this.tokens = tokens
		if (this.level == 0) {
			this.level += 1
			//TODO (DEPENDS ON Team.set_rank_role AND teams key->value array)
			teams[this.team].set_rank_role(RANKS[0])
		}
		if (this.level == 1 || this.level == 2) {
			this.calculate_levelup_req()
		}
	}
	// Levelup req significa Levelup requirement y 
	// son los puntos necesario para subir de nivel

	calculate_levelup_req() { 
		// El primer nivel 40, el segundo 44 y luego req + 4
		if (this.level == 1) { this.levelup_req = 40; return; }
		if (this.level == 2) { this.levelup_req = 44; return; }
		this.levelup_req = this.levelup_req + USER_LEVELUP_ADDER * (this.level-1)
	}
	levelup() {
		this.points = 0;
		this.level += 1;
		this.calculate_levelup_req()
		if (RANKS[this.level] != undefined) {
			//TODO (DEPENDS ON Team.set_rank_role AND teams key->value array)
			teams[this.team].set_rank_role(RANKS[this.level])
		}

	}
	add_points(points) {
		
	}
	get_save_object() {
		return {
			userid: this.userid,
			team: this.team,
			points: this.points,
			level: this.level,
			levelup_req: this.levelup_req,
			rank: this.rank,
			tokens: this.tokens
		}
	}
}

function load_teams() {
	if (fs.existsSync("./db.json")) {
		// TODO (DEPENDS ON saving to db.json)
	} else if (team_config != undefined) {
		team_config.forEach((team) => {
			teams[team.identifier] = new Team(team.name, 0, team.rank_names)
		})
	} else {
		throw "Missing DB or Team config, cannot create teams"
	}
	
	
}

//This function will populate the server with roles for each 
function populate_guild_roles(guildid) {
	let target_guild = client.guilds.cache.find(guild => guild.id == guildid)
	for (var team of Object.keys(teams)) {
		console.log(team + " -> " + teams.team)
	}
}
load_teams()
try {
	user = new User("304249537101299712", TEAM_TOAD, 0, 0, 0, "0", 0)
} catch (error) {
	console.log(`User did not create due to an error:\n\t${error}`)
}
console.log(user)
console.log("[Client] Login in...")
client.login(process.env.TOKEN)

client.on("ready", () => {
	console.log("[Client] Logged in and ready")
	populate_guild_roles("369188095234539521")
})