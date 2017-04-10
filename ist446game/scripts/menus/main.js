/** @namespace */
var TinyDwarf = TinyDwarf || {};

/**
 * Constructs a new main menu object.
 * @class
 */
TinyDwarf.MainMenu = function()
{
};

// Main menu settings.
TinyDwarf.MainMenu.GAME_TITLE_TEXT = "Tiny Dwarf";
TinyDwarf.MainMenu.GAME_AUTHOR_TEXT = "by A-Send Studio";
TinyDwarf.MainMenu.PLAY_GAME_BUTTON_TEXT = "Play Game";
TinyDwarf.MainMenu.CONTROLS_BUTTON_TEXT = "Controls";

/** Creates the text and buttons on the main menu. */
TinyDwarf.MainMenu.prototype.create = function()
{
	// Create the background image.
	this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, "menuBackground");

	// Create the text and buttons.
	TinyDwarf.addHeaderText(this.game, this.game.canvas.width / 2, this.game.canvas.height / 4, TinyDwarf.MainMenu.GAME_TITLE_TEXT, 48);
	TinyDwarf.addHeaderText(this.game, this.game.canvas.width / 2, this.game.canvas.height / 2.8, TinyDwarf.MainMenu.GAME_AUTHOR_TEXT, 36);
	TinyDwarf.addButtonWithText(this.game, this.game.canvas.width / 2, this.game.canvas.height * 3 / 4, TinyDwarf.MainMenu.PLAY_GAME_BUTTON_TEXT, this.playGameButtonPressed, this);
	//TinyDwarf.addButtonWithText(this.game, this.game.canvas.width / 2, this.game.canvas.height * 3 / 4, TinyDwarf.MainMenu.CONTROLS_BUTTON_TEXT, this.controlsButtonPressed, this);
};

/** Transitions to the select level menu. */
TinyDwarf.MainMenu.prototype.playGameButtonPressed = function()
{
	this.game.transition.to("SelectLevelMenu");
};

/** Transitions to the controls menu. */
TinyDwarf.MainMenu.prototype.controlsButtonPressed = function()
{
	this.game.transition.to("ControlsMenu");
};
