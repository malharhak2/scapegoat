// See my super games on http://lajili.com
define(["Game/config"], function(config)
{
	// The page manager is in charge of creating the canvas, give him his size, id etc.
	var canvas = document.createElement("canvas");
	canvas.id = "canvas"
	canvas.width = config.width; // Width / Height fixe. If you want fullscreen, create it, you lazy ass.
	canvas.height = config.height;
	var ctx = canvas.getContext("2d");
	document.getElementById(config.divName).appendChild(canvas); // Here, I should call a variable of your game. Lazyness...
	canvas.style.backgroundColor = config.canvasBackgroundColor;
	canvas.style.marginLeft = -config.width/2 + "px"

	return ({canvas: canvas, ctx: ctx});
});