/** @namespace */
var TinyDwarf = TinyDwarf || {};

/**
 * Constructs a new heads-up-display object. This HUD includes the status bar
 * at the top of the screen, a pause screen, and a game over screen.
 *
 * @class
 * @param {Object} pauseUnpauseCallback - A function that is called each time the pause or unpause button is pressed.
 * @param {Object} playAgainCallback - A function that is called each time the player clicks the "Play Again" button on the game over screen.
 * @param {Object} quitGameCallback - A function that is called each time the player clicks the "Quit Game" button on the pause or game over screen.
 * @param {Object} callbackContext - The context in which to run the callbacks.
 */
TinyDwarf.HUD = function(game, pauseUnpauseCallback, playAgainCallback, quitGameCallback, callbackContext)
{
	// Call the constructor of the super class.
	Phaser.Group.call(this, game);

	// Private properties.
	this._playAgainCallback = playAgainCallback;
	this._callbackContext = callbackContext;

	// Status bar.
	this.statusBar = this.add(new Phaser.Group(this.game));
	this.statusBarSprite = this.statusBar.add(new Phaser.Sprite(this.game, 0, 0, TinyDwarf.HUD.STATUS_BAR_IMAGE_NAME));
	this.statusBarLeftText = this.statusBar.add(new Phaser.Text(this.game, TinyDwarf.HUD.STATUS_BAR_PADDING.X, TinyDwarf.HUD.STATUS_BAR_PADDING.Y, "", TinyDwarf.HUD.STATUS_BAR_FONT_STYLES, this));
	this.statusBarCenterText = this.statusBar.add(new Phaser.Text(this.game, this.game.canvas.width / 2, TinyDwarf.HUD.STATUS_BAR_PADDING.Y, "", TinyDwarf.HUD.STATUS_BAR_FONT_STYLES, this));
	this.statusBarCenterText.anchor.set(0.5, 0);
	this.statusBarPauseUnpauseButton = this.statusBar.add(new Phaser.Button(this.game, this.game.canvas.width - TinyDwarf.HUD.STATUS_BAR_PADDING.X, TinyDwarf.HUD.STATUS_BAR_PADDING.Y - 2, TinyDwarf.HUD.PAUSE_BUTTON_IMAGE_NAME, pauseUnpauseCallback, callbackContext));
	this.statusBarPauseUnpauseButton.anchor.set(1, 0);

	// Pause screen.
	this.pauseScreen = this.add(new Phaser.Group(this.game));
	this.pauseScreen.visible = false;
	this.pauseScreen.add(new Phaser.Sprite(this.game, 0, 0, TinyDwarf.HUD.MENU_BACKGROUND_IMAGE_NAME));
	this.pauseScreen.add(new Phaser.Button(this.game, this.game.canvas.width / 2, this.game.canvas.height * 3 / 5, TinyDwarf.HUD.MENU_BUTTON_IMAGE_NAME, pauseUnpauseCallback, callbackContext, 1, 0, 2, 0)).anchor.set(0.5);
	this.pauseScreen.add(new Phaser.Button(this.game, this.game.canvas.width / 2, this.game.canvas.height * 3 / 4, TinyDwarf.HUD.MENU_BUTTON_IMAGE_NAME, quitGameCallback, callbackContext, 1, 0, 2, 0)).anchor.set(0.5);
	this.pauseScreen.add(new Phaser.Text(this.game, this.game.canvas.width / 2, this.game.canvas.height * 3 / 5 - 8, TinyDwarf.HUD.UNPAUSE_BUTTON_TEXT, TinyDwarf.HUD.MENU_BUTTON_FONT_STYLES)).anchor.set(0.5);
	this.pauseScreen.add(new Phaser.Text(this.game, this.game.canvas.width / 2, this.game.canvas.height * 3 / 5 + 16, TinyDwarf.HUD.UNPAUSE_BUTTON_ALT_TEXT, TinyDwarf.HUD.MENU_BUTTON_ALT_FONT_STYLES)).anchor.set(0.5);
	this.pauseScreen.add(new Phaser.Text(this.game, this.game.canvas.width / 2, this.game.canvas.height * 3 / 4, TinyDwarf.HUD.QUIT_GAME_BUTTON_TEXT, TinyDwarf.HUD.MENU_BUTTON_FONT_STYLES)).anchor.set(0.5);
	this.pauseScreen.add(new Phaser.Text(this.game, this.game.canvas.width / 2, this.game.canvas.height / 4, TinyDwarf.HUD.PAUSE_SCREEN_TITLE_TEXT, TinyDwarf.HUD.MENU_TITLE_FONT_STYLES)).anchor.set(0.5);
	this.pauseScreenText = this.pauseScreen.add(new Phaser.Text(this.game, this.game.canvas.width / 2, this.game.canvas.height * 5 / 12, "", TinyDwarf.HUD.MENU_MESSAGE_FONT_STYLES));
	this.pauseScreenText.anchor.set(0.5);

	// Game over screen.
	this.gameOverScreen = this.add(new Phaser.Group(this.game));
	this.gameOverScreen.visible = false;
	this.gameOverScreen.add(new Phaser.Sprite(this.game, 0, 0, TinyDwarf.HUD.MENU_BACKGROUND_IMAGE_NAME));
	this.gameOverScreen.add(new Phaser.Button(this.game, this.game.canvas.width / 2, this.game.canvas.height * 3 / 5, TinyDwarf.HUD.MENU_BUTTON_IMAGE_NAME, playAgainCallback, callbackContext, 1, 0, 2, 0)).anchor.set(0.5);
	this.gameOverScreen.add(new Phaser.Button(this.game, this.game.canvas.width / 2, this.game.canvas.height * 3 / 4, TinyDwarf.HUD.MENU_BUTTON_IMAGE_NAME, quitGameCallback, callbackContext, 1, 0, 2, 0)).anchor.set(0.5);
	this.gameOverScreen.add(new Phaser.Text(this.game, this.game.canvas.width / 2, this.game.canvas.height * 3 / 5 - 8, TinyDwarf.HUD.PLAY_AGAIN_BUTTON_TEXT, TinyDwarf.HUD.MENU_BUTTON_FONT_STYLES)).anchor.set(0.5);
	this.gameOverScreen.add(new Phaser.Text(this.game, this.game.canvas.width / 2, this.game.canvas.height * 3 / 5 + 16, TinyDwarf.HUD.PLAY_AGAIN_BUTTON_ALT_TEXT, TinyDwarf.HUD.MENU_BUTTON_ALT_FONT_STYLES)).anchor.set(0.5);
	this.gameOverScreen.add(new Phaser.Text(this.game, this.game.canvas.width / 2, this.game.canvas.height * 3 / 4, TinyDwarf.HUD.QUIT_GAME_BUTTON_TEXT, TinyDwarf.HUD.MENU_BUTTON_FONT_STYLES)).anchor.set(0.5);
	this.gameOverScreen.add(new Phaser.Text(this.game, this.game.canvas.width / 2, this.game.canvas.height / 4, TinyDwarf.HUD.GAME_OVER_SCREEN_TITLE_TEXT, TinyDwarf.HUD.MENU_TITLE_FONT_STYLES)).anchor.set(0.5);
	this.gameOverScreenText = this.gameOverScreen.add(new Phaser.Text(this.game, this.game.canvas.width / 2, this.game.canvas.height * 5 / 12, "", TinyDwarf.HUD.MENU_MESSAGE_FONT_STYLES));
	this.gameOverScreenText.anchor.set(0.5);

	// Keyboard controls.
	this.game.input.keyboard.addKey(TinyDwarf.HUD.PAUSE_KEY).onDown.add(pauseUnpauseCallback, callbackContext);
	this.game.input.keyboard.addKey(TinyDwarf.HUD.PLAY_AGAIN_KEY).onDown.add(this._playAgainKeyPressed, this);
};

// General settings for the TinyDwarf.HUD class.
TinyDwarf.HUD.STATUS_BAR_IMAGE_NAME = "statusBar";
TinyDwarf.HUD.PAUSE_BUTTON_IMAGE_NAME = "pause";
TinyDwarf.HUD.UNPAUSE_BUTTON_IMAGE_NAME = "play";
TinyDwarf.HUD.MENU_BACKGROUND_IMAGE_NAME = "translucentBackground";
TinyDwarf.HUD.MENU_BUTTON_IMAGE_NAME = "button";

// Status bar settings.
TinyDwarf.HUD.STATUS_BAR_PADDING = {X: 10, Y: 10};
TinyDwarf.HUD.STATUS_BAR_FONT_STYLES = {font: "bold 16px arial", fill: "black"};

// Menu settings.
TinyDwarf.HUD.PAUSE_SCREEN_TITLE_TEXT = "Game Paused";
TinyDwarf.HUD.GAME_OVER_SCREEN_TITLE_TEXT = "Game Over";
TinyDwarf.HUD.UNPAUSE_BUTTON_TEXT = "Unpause";
TinyDwarf.HUD.UNPAUSE_BUTTON_ALT_TEXT = "(Press ESC Key)";
TinyDwarf.HUD.PLAY_AGAIN_BUTTON_TEXT = "Play Again";
TinyDwarf.HUD.PLAY_AGAIN_BUTTON_ALT_TEXT = "(Press R Key)";
TinyDwarf.HUD.QUIT_GAME_BUTTON_TEXT = "Quit Game";
TinyDwarf.HUD.MENU_TITLE_FONT_STYLES = {font: "bold 48px arial", fill: "white", stroke: "black", strokeThickness: 15};
TinyDwarf.HUD.MENU_MESSAGE_FONT_STYLES = {font: "bold 24px arial", fill: "white", stroke: "black", strokeThickness: 12, align: "center"};
TinyDwarf.HUD.MENU_BUTTON_FONT_STYLES = {font: "bold 24px arial", fill: "black"};
TinyDwarf.HUD.MENU_BUTTON_ALT_FONT_STYLES = {font: "bold 14px arial", fill: "black"};

// Keyboard controls.
TinyDwarf.HUD.PAUSE_KEY = Phaser.Keyboard.ESC;
TinyDwarf.HUD.PLAY_AGAIN_KEY = Phaser.Keyboard.R;

// Make TinyDwarf.HUD extend from Phaser.Group
TinyDwarf.HUD.prototype = Object.create(Phaser.Group.prototype);
TinyDwarf.HUD.prototype.constructor = TinyDwarf.HUD;

/** Updates the items on the heads-up-display. */
TinyDwarf.HUD.prototype.update = function()
{
	// Make sure the HUD always overlays anything else on the screen.
	this.game.world.bringToTop(this);

	// Update the pause/unpause button to reflect the current visibility of the pause screen.
	if(this.pauseScreen.visible)
		this.statusBarPauseUnpauseButton.loadTexture(TinyDwarf.HUD.UNPAUSE_BUTTON_IMAGE_NAME);
	else
		this.statusBarPauseUnpauseButton.loadTexture(TinyDwarf.HUD.PAUSE_BUTTON_IMAGE_NAME);
};

/** Triggers a play again event if the play again key is pressed at the game over screen. */
TinyDwarf.HUD.prototype._playAgainKeyPressed = function()
{
	if(this.gameOverScreen.visible)
		this._playAgainCallback.call(this._callbackContext);
};
