// See my super games on http://lajili.com
define([], function(){
//Specific code for my game.
var index = 0;
function Player()
{
	this.index = index;
	index++;
	this.body = {};
	this.transform = {
		position:{
			x: 0,
			y: 0
		},
		size:{
			w:0,
			h:0
		}
	}
	this.load = false
	this.leftLoad = false;
	this.rightLoad = false;
	this.attack = false;
	this.timerMaxCoup = 50;
	this.timerCoup = this.timerMaxCoup;
	this.setNormal = function(){
		this.load = false;
		this.leftLoad = false;
		this.rightLoad = false;
		this.attack = false;
	}
}
return Player;
});