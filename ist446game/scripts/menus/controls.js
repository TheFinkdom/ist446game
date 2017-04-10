/** @namespace */
var TinyDwarf = TinyDwarf || {};

/**
 * Constructs a new controls menu object. The controls menu is the screen
 * containing a list of the game's basic controls.
 *
 * @class
 */
TinyDwarf.ControlsMenu = function()
{
};

// Controls menu settings.
TinyDwarf.ControlsMenu.TITLE_TEXT = "Controls";
TinyDwarf.ControlsMenu.BASIC_CONTROLS_TEXT = "a = Hold to Move Left\nd = Hold to Move Right\nspace = Tap to Jump\nspace = Repeated Tap to Fly";
TinyDwarf.ControlsMenu.ADVANCED_CONTROLS_TEXT = "s = Hold to Fall Faster\nw = Hold to Hover\nshift = Hold to Roll\nesc = Pause/Unpause";
TinyDwarf.ControlsMenu.BACK_BUTTON_TEXT = "Back";

/** Creates the text and buttons on the controls menu. */
TinyDwarf.ControlsMenu.prototype.create = function()
{
	// Create the background image.
	this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, "menuBackground");

	// Create the text and buttons.
	TinyDwarf.addHeaderText(this.game, this.game.canvas.width / 2, this.game.canvas.height / 4, TinyDwarf.ControlsMenu.TITLE_TEXT, 48);
	TinyDwarf.addHeaderText(this.game, this.game.canvas.width / 4, this.game.canvas.height / 2, TinyDwarf.ControlsMenu.BASIC_CONTROLS_TEXT, 24, "left");
	TinyDwarf.addHeaderText(this.game, this.game.canvas.width * 3 / 4, this.game.canvas.height / 2, TinyDwarf.ControlsMenu.ADVANCED_CONTROLS_TEXT, 24, "left");
	TinyDwarf.addButtonWithText(this.game, this.game.canvas.width / 2, this.game.canvas.height * 3 / 4, TinyDwarf.ControlsMenu.BACK_BUTTON_TEXT, this.backButtonPressed, this);
};

/** Transitions to the main menu. */
TinyDwarf.ControlsMenu.prototype.backButtonPressed = function()
{
	this.game.transition.to("MainMenu");
};
