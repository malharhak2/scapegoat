// See my super games on http://lajili.com
define(["Game/config", "LajiliEngine/Rendering", "LajiliEngine/World", "LajiliEngine/utils","LajiliEngine/Gamepad", "Game/Main", "LajiliEngine/inputsManager", "LajiliEngine/Loader"], function(config, rendering, World, utils, gamepad, Main, inputsManager, loader)
{
	//Creating the world

	function Game()
	{
		this.world = new World; // We create the physical world
		gamepad.init(); // We initialize the gamepad
		this.gamepads = gamepad.gamepads; // We gave the game the gamepad, for rapid access.
		this.pageManager = rendering.pageManager;
		this.width = this.pageManager.canvas.width; //We get the width and the height, if we need it later on
		this.height = this.pageManager.canvas.height;
		this.inputsManager = inputsManager; //We instanciate a
		this.inputsManager.init();
		this.utils = utils
		this.loaded = false;
		this.gameOver = false;
		this.gameOverTimer = Date.now();
		this.constructCurrent = 0;
		this.constructMax = 63;

	}

	Game.prototype.render = function()  // The main render function.
	{
		if (!this.loaded)
		{
			loader.render(rendering.pageManager.ctx);
			return;
		} else if (this.constructMenu) {
			rendering.cleanCanvas();
			rendering.pageManager.ctx.drawImage(rendering.animationManager.imageManager.get('construct'), config.width / 2 - 50, config.height / 2 - 100);
			rendering.pageManager.ctx.fillStyle = "#1e90ff";
			rendering.pageManager.ctx.fillRect(config.width / 2 - 50 + 2, config.height / 2 - 16 - 8, this.constructCurrent, 5);
		}else if (this.startMenu) {
			rendering.cleanCanvas();
			rendering.pageManager.ctx.textAlign = "center";
			rendering.pageManager.ctx.fillStyle = "#fff";
			rendering.pageManager.ctx.font = "24px";
			rendering.pageManager.ctx.fillText("Press A to play", config.width / 2, config.height / 2);			
		}else if (this.gameOver) {
			rendering.cleanCanvas();
			rendering.pageManager.ctx.textAlign = "center";
			rendering.pageManager.ctx.fillStyle = "#fff";
			rendering.pageManager.ctx.font = "24px";
			rendering.pageManager.ctx.fillText("Game Over - Press A to replay", config.width / 2, config.height / 2);
		} else {

			rendering.cleanCanvas();      
			var objects = this.world.getAllObjects();
			//console.log("getAllObjects", objects.length);
			//console.log("worldObjects",this.world.objects.length)
			for (var i = 0; i< objects.length; i++)
			{
				if (objects[i] == null) continue;
				if (!objects[i].trigger)
				{
					rendering.renderObject({
						angle: objects[i].body.GetAngle(),
						x: utils.pixels(objects[i].body.GetPosition().x) - utils.pixels(objects[i].width /2) - utils.pixels(objects[i].imageOffset.x),
						y: utils.pixels(objects[i].body.GetPosition().y) - utils.pixels(objects[i].height /2) - utils.pixels(objects[i].imageOffset.y),
						w: utils.pixels(objects[i].imageWidth*2),
						h: utils.pixels(objects[i].imageHeight*2),
						image: objects[i].image,
						renderer: objects[i].renderer
					})
				}
				else
				{
					rendering.renderSquare(
					{
						angle: objects[i].body.GetAngle(),
						x: utils.pixels(objects[i].body.GetPosition().x) + utils.pixels(objects[i].width /2),
						y: utils.pixels(objects[i].body.GetPosition().y) + utils.pixels(objects[i].height /2),
						w: utils.pixels(objects[i].width*2),
						h: utils.pixels(objects[i].height*2)
					})
				}
			}
		}
	}

	Game.prototype.logique = function()
	{
		this.gamepads = gamepad.gamepads; 
		if (!this.loaded)
		{
			if (loader.update() == "loaded")
			{
				Main.init(game);
				console.log("INIT")
				this.loaded = true;
				this.constructMenu = true;
			}
		}
		else if (this.constructMenu) {
			this.constructCurrent += 0.25;
			if (this.constructCurrent >= this.constructMax) {
				this.startMenu = true;
				this.constructMenu = false;
			}
		}
		else if (this.startMenu) {
			if (this.gamepads[0].buttons[0]) {
				this.startMenu = false;
			}
		}
		else if (!this.gameOver)
		{
			this.world.update(); // We update the world
			Main.update(); // We update YOUR game

		} else if (this.gameOver) {
			//gameOver.update();
			if (this.gamepads[0].buttons[0] && Date.now() - this.gameOverTimer > 500) {

				window.location.reload();
			}
		}

		
	}
	var game = new Game(); // We create the game here, so it's unique and accessible with require(["LajiliEngine/Game"])

	return game;
}
);