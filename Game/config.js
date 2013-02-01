define([], function(){
var config = {
	gameTitle : "Scapegoat", // The title of your game, that will apear in the default HTML page
	divName : "scapegoat", // The div name that will contain your game. It's usefull when you want to integrate your game on someone else page easily,
	backgroundColor: "#EEE", // The background color of the body
	width: 1300, // The width of the canvas
	height: 600, // The height of the canvas
	canvasBackgroundColor: "#222", // the backgroundColor of your canvas,
	showCredit: true, // Have a footer with the text "realised with the Lajili Engine" and a link to my website. If you choose not to, please send me a mail with the adress of your game, i'm curious of the games made with my engine :),
	showCustomFooter: true,
	customFooter: "By <a href='http://www.anthonypigeot.com'>Anthony Pigeot</a> - <a href='http://www.twitter.com'>@Malharhak</a>" // A custom footer with the text you want.
}

return config
});