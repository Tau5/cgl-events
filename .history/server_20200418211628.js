const USER_KINGDOM_TOAD = true
const USER_KINGDOM_KOOPA = false


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

/*
User - Represents a user of the server

	* String - userid
		The user ID of the user
	* Bool - kingdom
		Represents the kingdom the user belongs to
		Valid values are:
			KINGDOM_TOAD
			KINGDOM_KOOPA
	* Int - points
		The points the user has acquired
	* Int - level
		The level the user is
	* Int - rank
		The rank of the user
*/
class Kingdom 
class User {
	constructor(userid, kingdom, points, level, rank) {
		this.userid = userid
		this.kingdom = kingdom
		this.points = points
		this.level = level
		this.rank = rank
	}
}