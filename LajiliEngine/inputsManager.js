define([], function(){

function InputsManager()
{
	var self = this;
	
	self.touches = [];
	
	this.init = function()
	{
		window.addEventListener("keydown",self.down, false);
		window.addEventListener("keyup",self.up, false);	
		window.addEventListener("mousedown",self.clickDown, false);	
		window.addEventListener("mouseup",self.clickUp, false);	
	}
	
	this.down = function(e)
	{
		self.touches[e.keyCode] = true;
	}
	
	this.up = function(e)
	{
		if(self.touches.hasOwnProperty(e.keyCode))
			self.touches[e.keyCode] = false;
	}
	
	this.clickDown = function(e)
	{
		
	}
	
	this.clickUp = function(e)
	{
		
	}
	
}
return new InputsManager;
});