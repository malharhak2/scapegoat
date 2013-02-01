// See my super games on http://lajili.com
define(["LajiliEngine/Game"], function(game) // It requires the game, therefore, init it.
{
	function run() // the run is made this way so the requestAnimFrame can access it.
	{
		if (!window.FULLSTOP) requestAnimFrame(run);
		game.logique();
		game.render();
	}

	window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    return {run: run}
}
);