define(["LajiliEngine/box2d", "LajiliEngine/AnimationManager"], function(Box2D, animationManager){ // The Abstraction Layer for Box2D

	var indexObject = 0; // Sert de variable constante
	function World()
	{
		this.objectTypes = {}; // Contains the "class" of your objects
		this.objects = []; // Contains the instance of your objects
		this.callStack = []; // A callStack use for destroy object during collision (not allowed by Box2D normally)
		this.gravity = {x: 0, y:0}
	};
	World.prototype.reset = function () {
		for (var  i= 0; i < this.objects.length; i++) {
			this.removeObject(this.objects[i]);
		}
	}
	World.prototype.init = function(gravity){

		this.gravity = {x: 0, y:0}
			 if (gravity !== undefined)
			 {
			 	this.gravity = gravity;
			 }
			 else
			 {
			 	this.gravity = {x: 0, y:0}
			 }
		  	 this.b2Vec2 = Box2D.Common.Math.b2Vec2;
	         this.b2BodyDef = Box2D.Dynamics.b2BodyDef;
	         this.b2Body = Box2D.Dynamics.b2Body;
	         this.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	         this.b2Fixture = Box2D.Dynamics.b2Fixture;
	         this.b2World = Box2D.Dynamics.b2World;
	         this.b2MassData = Box2D.Collision.Shapes.b2MassData;
	         this.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	         this.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	         this.b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
	         this.b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint;
	         this.world = new this.b2World(
	               new this.b2Vec2(0, 0)    //gravity
	            ,  false                 //allow sleep
	         );
         	 this.contactListener = new Box2D.Dynamics.b2ContactListener;
	         this.contactListener.BeginContact = function(contact, manifold) {
	            if (contact.m_fixtureA.m_body.m_userData != undefined && contact.m_fixtureA.m_body.m_userData.onCollision != undefined) {
	               contact.m_fixtureA.m_body.m_userData.onCollision(contact.m_fixtureB.m_body);
	            }
	            if (contact.m_fixtureB.m_body.m_userData != undefined && contact.m_fixtureB.m_body.m_userData.onCollision != undefined) {
	               contact.m_fixtureB.m_body.m_userData.onCollision(contact.m_fixtureA.m_body);
	            }
	         };
	         this.contactListener.PreSolve = function(contact, manifold) {
	            if (contact.m_fixtureA.m_body.m_userData != undefined && contact.m_fixtureA.m_body.m_userData.onPreSolve != undefined) {
	               contact.m_fixtureA.m_body.m_userData.onPreSolve(contact.m_fixtureB.m_body, contact);
	            }
	            if (contact.m_fixtureB.m_body.m_userData != undefined && contact.m_fixtureB.m_body.m_userData.onPreSolve != undefined) {
	               contact.m_fixtureB.m_body.m_userData.onPreSolve(contact.m_fixtureA.m_body, contact);
	            }
	         };

	         this.world.SetContactListener(this.contactListener);
	         
	}
	/*
	The id is a name you define for your object type, you'll use in order to instance it.
	Shape can be "square" or "round" right now. For other shapes, you'll have to add methods call from box2D in this function
	Width / Height is in metters I guess.
	Density, I never get it. Check google. (arround 1)
	Friction is how the friction will slow down / rotate your object (arround 1)
	Restitution is how bouncy is your object.(arround 1)
	image is the image name for your object
	trigger is if the object is used only for detection (beta feature);
	*/
	World.prototype.createPhysicalObjectType = function(args) // id, shape, width, height, density, friction, restitution, image, trigger
	{
		this.objectTypes[args.id] = new this.b2FixtureDef;
		this.objectTypes[args.id].density = args.density;
		this.objectTypes[args.id].friction = args.friction;
		this.objectTypes[args.id].restitution = args.restitution;
		this.objectTypes[args.id].height = args.height;
		this.objectTypes[args.id].width = args.width;
		this.objectTypes[args.id].image = args.image;
		this.objectTypes[args.id].imageWidth = args.imageWidth || args.width;
		this.objectTypes[args.id].imageHeight = args.imageHeight || args.height;
		this.objectTypes[args.id].imageOffset =  args.imageOffset || {x: 0, y: 0}
		this.objectTypes[args.id].fixedRotation = args.fixedRotation || false;
		this.objectTypes[args.id].animated = args.animated || false;
		this.objectTypes[args.id].noGravity = args.noGravity || false;
		if (args.category != null)
		{
			this.objectTypes[args.id].filter.categoryBits = args.category;
		}
		if (args.mask != null)
		{
			this.objectTypes[args.id].filter.maskBits = args.mask;
		}
		if (args.trigger)
		{
			this.objectTypes[args.id].isSensor = true;
			this.objectTypes[args.id].trigger = true;
		}
		if (args.shape == "square")
		{
			this.objectTypes[args.id].shape = new this.b2PolygonShape;
			this.objectTypes[args.id].shape.SetAsBox(args.width, args.height);
		}
		if (args.shape == "round")
		{
			this.objectTypes[args.id].shape =  new this.b2CircleShape(args.width);
		}
		
	}

	// Doesn't work well right now.
	World.prototype.createDistanceJoint = function(body1,body2,anchor1,anchor2) {
		
		var jointDef = new this.b2DistanceJointDef();
		var firstAnchor = new this.b2Vec2(body1.GetPosition().x, body1.GetPosition().y);
		var secondAnchor = new this.b2Vec2(body2.GetPosition().x, body2.GetPosition().y);
		jointDef.Initialize(body1,body2,firstAnchor,secondAnchor);
		//jointDef.collideConnected = true;
		this.world.CreateJoint(jointDef)
		return jointDef;
	};

	//Instance a physical object you defined earlier with the createPhysicalObjectType.
	//Use the typeID, if it's a static or not, the x and y position, the userData (can have a OnCollision or OnPresolve)
	//Return the objet you instanced.
	World.prototype.instancePhysicalObject = function (typeId,fixe, x, y, userData, tags)
	{
		var bodyDef = new this.b2BodyDef;
		if (fixe) 
			{ bodyDef.type = this.b2Body.b2_staticBody} 
		else 
			{ bodyDef.type = this.b2Body.b2_dynamicBody;}
		
		bodyDef.position.x = x //+ this.objectTypes[typeId].width/2;
		bodyDef.position.y = y //+ this.objectTypes[typeId].height/2;
		bodyDef.userData = userData || {};
		bodyDef.userData.id = indexObject;
		bodyDef.fixedRotation = this.objectTypes[typeId].fixedRotation;
		var thisAnim = null;
		if (this.objectTypes[typeId].animated) 
		{
			thisAnim = animationManager.pushAnim({animName: this.objectTypes[typeId].image});
		}
		this.objects.push({
		id: indexObject,
		typeId : typeId,
		body: this.world.CreateBody(bodyDef).CreateFixture(this.objectTypes[typeId]).GetBody(),
		width : this.objectTypes[typeId].width,
		height : this.objectTypes[typeId].height,
		imageWidth : this.objectTypes[typeId].imageWidth,
		imageHeight : this.objectTypes[typeId].imageHeight,
		imageOffset : this.objectTypes[typeId].imageOffset,
		noGravity : this.objectTypes[typeId].noGravity,
		image: this.objectTypes[typeId].image,
		trigger: this.objectTypes[typeId].trigger,
		tags: tags,
		renderer:{ // For the animation engine
			img: this.objectTypes[typeId].image,
			state: "",
			dir: "",
			anim: thisAnim

		}});

		indexObject++;
		return (this.objects[this.objects.length - 1])
	}

	//Delete an object
     World.prototype.removeObject = function(cible)
     {
     	this.callStack.push({
     		object: cible.body
     	});

     }
     World.prototype.checkStack = function()
     {
      while (this.callStack.length > 0)
      {
         this.objects[this.callStack[0].object.m_userData.id] = null;
 
         this.world.DestroyBody(this.callStack[0].object);
         this.callStack.splice(0,1);
      }
     }

     World.prototype.applyGravity = function(){
     	for (var i=0; i<this.objects.length; i++){
     		if (this.objects[i] == null) continue;
     		if (this.objects[i].noGravity) continue;
     		var objet = this.objects[i].body;
     		var gravite = new this.b2Vec2(this.gravity.x*objet.GetMass(), this.gravity.y*objet.GetMass())
     		objet.ApplyForce(gravite, objet.GetWorldCenter())
     	}
     }
	World.prototype.update = function()
      { 
      	this.applyGravity();
      	this.checkStack();
         this.world.Step(
               1 / 60   //frame-rate
            ,  10       //velocity iterations
            ,  10       //position iterations
         );
         this.world.ClearForces();

      }
    World.prototype.getAllObjects = function()
    {
    	return this.objects;
    }
    World.prototype.getObject = function(id)
    {
    	return this.objects[id];
    }
	return World;

});