/* jshint esversion: 6 */
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

const TEAM_TOAD 	= 0;
const TEAM_KOOPA 	= 1;
const GUILD_ID 				= "571031367568064552";
const DEFAULT_CHANNEL_ID 	= "571031368042283009";

let CHANNELS;
let LOADING_COMPLETE = false;
var fs = require('fs');
const Discord = require('discord.js'); //Añadímos la librería de discord.js
const config = require("./config.json"); //Añadimos el jonshon de la configuración
const team_config = require("./team_config.json");
const client = new Discord.Client(); //Creamos el cliente
var RANKS = [];
RANKS	[0]		= "0";
RANKS	[10]	= "A";
RANKS	[25] 	= "B";
RANKS	[40] 	= "C";
var RANKS_LEVEL_REQUIREMENT = [0, 10, 25, 40]; //Los niveles que se necesitan para obtener el rango
var USER_LEVELUP_ADDER = 4; // Se añade al requirement de puntos para llegar al siguiente nivel
						// cada vez que se sube de nivel


/*
Team - Represent various traits of a team
*/
class Team {
	constructor(name, points, rank_names) {
		this.name = name;
		this.points = points;
		this.rank_names = rank_names;
	}
	add_points(points) {
		this.points += points;
	}
	set_rank_role(user, rank) {
		for (let rank in this.rank_names) {
			console.log(rank)
		}
		
	}
	get_save_object() {
		return {
			name: this.name,
			points: this.points,
			rank_names: this.rank_names
		}
	}
}

let teams = {};
let users = {};
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
	* Int - tokens
		Event tokens, these are not removed on new events
	* String - lastseen
		This is a optional argument on creation
		ID of the lastest channel where he sent a message
*/
class User {
	constructor(userid, team, points, level, levelup_req, rank, tokens, lastseen) {
		if (!teams[team]) {
			throw `User does not have a valid team`
		}
		if (!lastseen) lastseen = DEFAULT_CHANNEL_ID;
		this.userid = userid;
		this.team = team;
		this.points = points;
		this.level = level;
		this.levelup_req = levelup_req;
		this.rank = rank;
		this.tokens = tokens;
		this.lastseen = DEFAULT_CHANNEL_ID;
		if (this.level == 0) {
			this.level += 1
			//TODO (DEPENDS ON Team.set_rank_role)
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
		this.levelup_req = this.levelup_req + USER_LEVELUP_ADDER * (this.level-1);
	}
	get_guild_user() {
		return GUILD.members.cache.get(m => m.id == this.userid);
	}
	levelup() {
		this.points = 0;
		this.level += 1;
		
		GUILD.channels.cache.get(c => c.id == this.lastseen).send(
			`¡${this.get_guild_user.displayName} has subido a nivel ${this.level}!`
		);
		this.calculate_levelup_req()
		if (RANKS[this.level] != undefined) {
			//TODO (DEPENDS ON Team.set_rank_role)
			rank_name = teams[this.team].rank_names[RANKS[this.level]]
			GUILD.channels.cache.get(c => c.id == this.lastseen).send(
				`¡${this.get_guild_user.displayName} has llegado al rango ${rank_names} 🎉!`
			);
			teams[this.team].set_rank_role(RANKS[this.level]);
		}

	}
	add_points(points) {
		this.points += 1;
		if (this.points > this.levelup_req) this.levelup();
	}
	get_save_object() {
		return {
			userid: this.userid,
			team: this.team,
			points: this.points,
			level: this.level,
			levelup_req: this.levelup_req,
			rank: this.rank,
			tokens: this.tokens,
			lastseen: this.lastseen
		};
	}
}

function load_teams() {
	console.log("[load_teams] Loading teams")
	if (fs.existsSync("./teams_db.json")) {
		console.log("[load_teams] Attempting to load teams from database");
		// TODO (DEPENDS ON saving to teams_db.json)
	} else if (team_config != undefined) {
		console.log("[load_teams] Creating new teams from scratch")
		team_config.forEach((team) => {
			teams[team.identifier] = new Team(team.name, 0, team.rank_names)
		})
		
	} else {
		throw "Missing DB or Team config, cannot create teams"
	}
	
	
}

//This function will populate the server with roles for each 
function populate_guild_roles(guildid) {
	team_colors = {}
	team_colors[TEAM_TOAD] 	=	"#d35f8d";
	team_colors[TEAM_KOOPA] =	"#7fd07f";
	let target_guild = client.guilds.cache.find(guild => guild.id == guildid)
	for (var team of Object.keys(teams)) {
		for (var rank of Object.keys(teams[team].rank_names)) {
			name = teams[team].rank_names[rank];
			target_guild.roles.create({
				data: {
					name: name,
					color: team_colors[team]
				}
			});
		}
	}
}



load_teams();
LOADING_COMPLETE = true;


console.log("[Client] Login in...");
client.login(process.env.TOKEN);

client.on("ready", () => {
	console.log("[Client] Logged in and ready");
	GUILD = client.guilds.cache.get(g => g.id == GUILD_ID);
	try {
		user = new User("304249537101299712", TEAM_TOAD, 0, 0, 0, "0", 0);
	} catch (error) {
		console.log(`User did not create due to an error:\n\t${error}`);
	}
	console.log(user);
});

function handle_commands(message, command, args) {
	if (command == "register") {
		if (users[message.author.id]!=undefined) {
			return message.channel.send("ERROR: Ya estás registrado");
		}
		options = {
			"toad": TEAM_TOAD,
			"koopa": TEAM_KOOPA
		};
		message.channel.send("Escribe a que equipo quieres unirte **Luego no podrás cambiarlo**\n`toad`: Reino Champiñon\n`koopa`: Reino Koopa");
		
		const filter = m => m.author.id == message.author.id;
		const collector = message.channel.createMessageCollector(filter, { time: 15000 });
		collector.on('collect', m => {
			target_team = m.content.toLowerCase();
			collector.stop();
			if (options[m.content]==undefined) return message.channel.send("ERROR: Equipo no válido");
			user = new User(message.author.id, options[m.content], 0, 0, 0, "0", 0);
			users[message.author.id] = user;
		});
		collector.on('end', collected => console.log(`Collected ${collected.size} items`));
	}
}
function handle_messages(message) {
	if (!users[message.author.id]) return;
	users[message.author.id].add_points(1);
} 
function update_user(message) {
	if (!users[message.author.id]) return;
	users[message.author.id].lastseen = message.channel.id;
}
client.on("message", (message) => {
	if (!LOADING_COMPLETE) return;
	if (message.content.startsWith(config.prefix)) {
		args = message.content.slice(1).split(" ");
		command = args.shift();
		handle_commands(message, command, args);
	} else {
		handle_messages(message);
	}

})