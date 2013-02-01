// See my super games on http://lajili.com
define(["Game/Map", "Game/Player", "Game/config", "LajiliEngine/Rendering"], function(map, Player, config)
{
	var moteur;
	var player = new Player;
	window.player = player;
	var gentilleBoule;
	var mechanteBoule;
	var grosseBoule;
	var bouleTimer = Date.now();
	var bouleTime = 250;
	var aBouton = false;
	var charging = false;
	var newBallTimer = 3500;
	var maxBallTimer = 1500;
	var lastBall = Date.now();
	var score = 0;
	var timeScore = 5;
	var scoreAccel = 2;
	var destroyScore = 1000;
	var currentBall = false;
	// The main file of your game, the engine will call its functions init and update. The init will have the engine as a parameter
	function init (LajiliEngine) 
	{
		moteur = LajiliEngine; // I get the engine (the var is at the beginning of the file)
		moteur.world.init({x:0,y:0}); // I init the world
		//I create a few objects i'll use lateron
		moteur.world.createPhysicalObjectType({id: "gentilleBoule", shape: "round", image: "gentilleBoule", width: moteur.utils.metters(35), height: moteur.utils.metters(35), density: 0.5, friction: 1, restitution: 1, imageOffset: {x:0, y:moteur.utils.metters(20)}})
		moteur.world.createPhysicalObjectType({id: "mechanteBoule", shape: "round", image: "mechanteBoule", width: moteur.utils.metters(25), height: moteur.utils.metters(25), density: 0.5, friction: 1, restitution: 1, imageOffset: {x:0, y:moteur.utils.metters(20)}})
		moteur.world.createPhysicalObjectType({id: "grosseBoule", shape: "round", image: "grosseBoule", width: moteur.utils.metters(65), height: moteur.utils.metters(65), density: 0.5, friction: 1, restitution: 1, imageOffset: {x:0, y:moteur.utils.metters(20)}})
		moteur.world.createPhysicalObjectType({id: "block", shape: "square", image: "block", width: moteur.utils.metters(25), height: moteur.utils.metters(25), density: 0.5, friction: 1, restitution: 0, imageOffset: {x:0, y:moteur.utils.metters(20)}})
		this.start(moteur);
	}

	function start (moteur) {
		gentilleBoule = moteur.world.instancePhysicalObject("gentilleBoule", false, 5, 5, {
			onCollision : function (body) {
				var objetTouche = moteur.world.getObject(body.m_userData.id);

				if (objetTouche.typeId == "mechanteBoule") {
					console.log('Perdu §§§');
					moteur.gameOver = true;
					moteur.gameOverTimer = Date.now();
				}
			}}, []);
		addMechant();
		grosseBoule = moteur.world.instancePhysicalObject("grosseBoule", false, 7, 3, {
			onCollision: function(body){
				var objetTouche = moteur.world.getObject(body.m_userData.id);
				if (objetTouche.typeId == "mechanteBoule") {
					moteur.world.removeObject(objetTouche);
					score += destroyScore;
				}
				if (objetTouche.typeId == "gentilleBoule") {
					charging = false;
				}
			}}, []);

		
		for (var i = 0; i < Math.floor(config.width / 50) + 2; i++) {
			moteur.world.instancePhysicalObject("block", true, moteur.utils.metters(i * 50), 0, null, []);
			moteur.world.instancePhysicalObject("block", true, moteur.utils.metters(i * 50), moteur.utils.metters(config.height + 50), null, []);
		}
		for (var j = 0; j < Math.floor(config.height / 50) + 2; j++) {
			moteur.world.instancePhysicalObject("block", true, 0, moteur.utils.metters(j * 50), null, []);
			moteur.world.instancePhysicalObject("block", true, moteur.utils.metters(config.width + 50 ), moteur.utils.metters(j * 50), null, []);
		}
		var offset = moteur.utils.metters(config.width/5);
		// I parse the map (see map.js) to instance every object

		window.moteur =(moteur) // If you want to debug easyly.
	}

	function update()
	{

		if (moteur.gamepads.length >= 1) // If a gamepad is connected
		{
			if (Math.abs(moteur.gamepads[0].axes[0]) > 0.3 || Math.abs(moteur.gamepads[0].axes[1]) > 0.3) {
				gentilleBoule.body.SetLinearVelocity({
					x : moteur.gamepads[0].axes[0] * 4,
					y : moteur.gamepads[0].axes[1] * 4
				});
			};

			if (moteur.gamepads[0].buttons[0] && !aButton) {
				aButton = 1;
				if (Date.now() - bouleTimer > bouleTime) { 
					bouleTimer = Date.now();
					charging = true;
				}
			}
			if (charging) {
				
				var grossePosition = grosseBoule.body.GetPosition();
				var gentillePosition = gentilleBoule.body.GetPosition();
				var angle = Math.atan2(grossePosition.y - gentillePosition.y, grossePosition.x - gentillePosition.x);
				gentilleBoule.body.SetLinearVelocity({
					x : Math.cos(angle) * 12,
					y : Math.sin(angle) * 12
				});
			}
			if (!moteur.gamepads[0].buttons[0]){
				aButton = 0;
			}
		}
		if (Date.now() - lastBall > newBallTimer) {
			lastBall = Date.now();
			addMechant();			
		}
		document.getElementById('score').innerHTML = score;

	}

	function addMechant () {
		var pos = {
			x : moteur.utils.metters(Math.floor(Math.random() * config.width - 100) + 50),
			y : moteur.utils.metters(Math.floor(Math.random() * config.height - 100) + 50)
		};
		if (currentBall != false) {
			var pos = currentBall.body.GetPosition();
		}
		var velocity = {
			x : Math.floor(Math.random() * 15) - 7,
			y : Math.floor(Math.random() * 15) - 7
		};
		var mechanteBoule = moteur.world.instancePhysicalObject("mechanteBoule", false, pos.x, pos.y, null, 
		[]);	
		newBallTimer -= 50;
		if (newBallTimer <= maxBallTimer) {
			newBallTimer = maxBallTimer;
		}
		mechanteBoule.body.SetLinearVelocity(velocity);	
		currentBall = mechanteBoule;
	}

	function reset () {

	}
	return {init: init, update: update, start : start};
})