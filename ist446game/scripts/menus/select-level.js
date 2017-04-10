/** @namespace */
var TinyDwarf = TinyDwarf || {};

/**
 * Constructs a new select level menu object. The select level menu displays
 * all the levels of the game, indicates which levels are locked, and lists the
 * high scores for each level.
 *
 * @class
 */
TinyDwarf.SelectLevelMenu = function()
{
};

// Settings for the select level menu.
TinyDwarf.SelectLevelMenu.TITLE_TEXT = "Select Level";
TinyDwarf.SelectLevelMenu.BACK_BUTTON_TEXT = "Back";
TinyDwarf.SelectLevelMenu.LEVEL_BUTTONS_PER_ROW = 4;
TinyDwarf.SelectLevelMenu.LEVEL_CLASS_NAMES =
[
	"MineshaftLevel",
	"ArtilleryLevel",
	"IncendiaryLevel",
	"RollLevel",
	"AirborneLevel",
];

/** Creates the select level menu. */
TinyDwarf.SelectLevelMenu.prototype.create = function()
{
	// Create the background image.
	this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, "menuBackground");

	// Create the text and buttons.
	TinyDwarf.addHeaderText(this.game, this.game.canvas.width / 2, this.game.canvas.height / 4, TinyDwarf.SelectLevelMenu.TITLE_TEXT, 48);
	TinyDwarf.addButtonWithText(this.game, this.game.canvas.width / 2, this.game.canvas.height * 3 / 4, TinyDwarf.SelectLevelMenu.BACK_BUTTON_TEXT, this.backButtonPressed, this);

	// Level buttons.
	for(var n = 0; n < TinyDwarf.SelectLevelMenu.LEVEL_CLASS_NAMES.length; n++)
	{
		var levelClassName = TinyDwarf.SelectLevelMenu.LEVEL_CLASS_NAMES[n];
		var levelClass = TinyDwarf[levelClassName];
		var highScore = TinyDwarf.SaveFile.getInstance().getHighScoreForLevel(levelClass.LEVEL_NAME);
		var xPosition = (n % TinyDwarf.SelectLevelMenu.LEVEL_BUTTONS_PER_ROW + 1) * (this.game.canvas.width / 5 + 10) - 25;
		var yPosition = Math.floor(n / TinyDwarf.SelectLevelMenu.LEVEL_BUTTONS_PER_ROW) * 80 + this.game.canvas.height / 2.25;
		var buttonText = sprintf("%s\nBest: %s", levelClass.LEVEL_NAME, highScore == TinyDwarf.SaveFile.DEFAULT_HIGH_SCORE ? "--" : sprintf(levelClass.HIGH_SCORE_FORMAT, highScore));
		var buttonWithText = TinyDwarf.addButtonWithText(this.game, xPosition, yPosition, buttonText, this.levelButtonPressed, this);

		buttonWithText.button._levelClassName = levelClassName
		buttonWithText.text.align = "center";
		buttonWithText.text.font = "arial";
		buttonWithText.text.fontWeight = "bold";
		buttonWithText.text.fontSize = 18;
	}
};

/** Transitions to the selected level. */
TinyDwarf.SelectLevelMenu.prototype.levelButtonPressed = function(button)
{
	this.game.transition.to(button._levelClassName);
};

/** Transitions to the main menu. */
TinyDwarf.SelectLevelMenu.prototype.backButtonPressed = function()
{
	this.game.transition.to("MainMenu");
};
