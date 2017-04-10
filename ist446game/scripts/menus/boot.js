/** @namespace */
var TinyDwarf = TinyDwarf || {};

/**
 * Constructs a new boot menu object.
 * @class
 */
TinyDwarf.BootMenu = function()
{
};

// Settings for state change transitions.
TinyDwarf.BootMenu.STATE_TRANSITION_SETTINGS =
{
	duration: 500,
	ease: Phaser.Easing.Cubic.InOut,
	properties:
	{
		alpha: 0,
		scale: {x: 1.25, y: 1.25},
	},
};

/** Loads a few assets that are used by every state of the game. */
TinyDwarf.BootMenu.prototype.preload = function()
{
	// Load single-frame images.
	this.load.image("menuBackground", "images/menuBackground.png");
	this.load.image("pause", "images/pause.png");
	this.load.image("play", "images/play.png");
	this.load.image("spikeStrip", "images/spikeStrip.png");
	this.load.image("statusBar", "images/statusBar.png");
	this.load.image("translucentBackground", "images/translucentBackground.png");

	// Load multi-frame sprite sheets.
	this.load.spritesheet("button", "images/button.png", 165, 68);
	this.load.spritesheet("player", "images/player.png", 32, 48);
};

/** Configures the state transition plugin and transitions to the main menu. */
TinyDwarf.BootMenu.prototype.create = function()
{
	this.game.transition = this.game.plugins.add(Phaser.Plugin.StateTransition);
	this.game.transition.settings(TinyDwarf.BootMenu.STATE_TRANSITION_SETTINGS);
	this.game.state.start("MainMenu");
};
