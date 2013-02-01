define([], function(){
	function Anim(tableau)
	{
		this.img = tableau.img;
		this.size = tableau.size;
		this.steps = tableau.steps;
		this.width = tableau.width;
		this.height = tableau.height;
		this.defaultDir = tableau.defaultDir || "idle";
		this.defaultState = tableau.defaultState || "idle";
		this.states = tableau.states;
	}

	return Anim;
});