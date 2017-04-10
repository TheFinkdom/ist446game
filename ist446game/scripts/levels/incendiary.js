/** @namespace */
var TinyDwarf = TinyDwarf || {};

/**
 * Creates a new level object. This is the constructor for the level class.
 * Don't bother to initialize anything here. Instead, use the create() function
 * below to initialize the level.
 * 
 * @class
 */
TinyDwarf.IncendiaryLevel = function()
{
};

// These two settings are used by the select level menu.
TinyDwarf.IncendiaryLevel.LEVEL_NAME = "Incendiary";
TinyDwarf.IncendiaryLevel.HIGH_SCORE_FORMAT = "%.1f s";

// These settings are only used by this level class.
TinyDwarf.IncendiaryLevel.BACKGROUND_IMAGE_NAME = "crackedBrickWall";
TinyDwarf.IncendiaryLevel.BACKGROUND_MOVING_SPEED = 35;
TinyDwarf.IncendiaryLevel.FOREGROUND_MOVING_SPEED = 70;
TinyDwarf.IncendiaryLevel.SPAWN_TIMEOUT = 3500;

/**
 * Loads any images that this level needs. Some images are loaded when the game
 * boots (check the preload function of the BootMenu class in menu.js to see
 * which images are loaded). If your level needs any extra images or sprite
 * sheets, then load them in this function.
 */
TinyDwarf.IncendiaryLevel.prototype.preload = function()
{
	this.load.image("crackedBrickWall", "images/mineshaft/crackedBrickWall.png");
	this.load.image("thick-platform-200", "images/mineshaft/thick-platform-200.png");
};

/**
 * Initializes the level before the player can start playing. Create any
 * initial platforms or enemies for the level in this function.
 */
TinyDwarf.IncendiaryLevel.prototype.create = function()
{
	// Create the background, HUD, and player.
	this.backgroundTileSprite = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, TinyDwarf.IncendiaryLevel.BACKGROUND_IMAGE_NAME);
	this.hud = this.add.existing(new TinyDwarf.HUD(this.game, this.pauseUnpauseGame, this.playAgain, this.quitGame, this));
	this.player = this.add.existing(new TinyDwarf.Player(this.game, this.game.canvas.width / 2, this.game.canvas.height / 2));

	// Create groups for categorizing friends and enemies.
	this.friendGroup = this.add.group();
	this.enemyGroup = this.add.group();

	// Start the physics engine.
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
	this.game.physics.arcade.enable(this.hud.statusBarSprite);
	this.game.physics.arcade.enable(this.player);
	this.game.physics.arcade.enable(this.friendGroup);
	this.game.physics.arcade.enable(this.enemyGroup);

	// Configure the physics for each game object.
	this.backgroundTileSprite.autoScroll(0, TinyDwarf.IncendiaryLevel.BACKGROUND_MOVING_SPEED);
	this.hud.statusBarSprite.body.immovable = true;
	this.player.body.collideWorldBounds = true;
	this.player.maxConsecutiveHovers = 2;

	// Regularly spawn new friends and enemies.
	this.gameTimer = this.time.create(false);
	this.gameTimer.loop(TinyDwarf.IncendiaryLevel.SPAWN_TIMEOUT, this.spawnFriendsAndEnemies, this);
	this.gameTimer.start();

	// Spawn the first round of friends and enemies immediately.
	this.spawnFriendsAndEnemies();
};

/**
 * Updates the game on each frame. Use this function to check for collisions
 * between the player and platforms/enemies. You could also spawn more
 * platforms or enemies in this function.
 */
TinyDwarf.IncendiaryLevel.prototype.update = function()
{
	if(this.hud.pauseScreen.visible || this.hud.gameOverScreen.visible)
		return; // Don't update the game because the game is paused or over.

	// Make sure sprites overlap in the correct order.
	this.world.bringToTop(this.player);

	// Resolve collisions between game objects.
	this.game.physics.arcade.collide(this.player, this.hud.statusBarSprite);
	this.game.physics.arcade.collide(this.player, this.friendGroup);

	// Check whether the player has hit an enemy.
	if(this.game.physics.arcade.overlap(this.player, this.enemyGroup))
	{
		this.pauseUnpauseGame();
		this.hud.pauseScreen.visible = false;
		this.hud.gameOverScreen.visible = true;

		var saveFile = TinyDwarf.SaveFile.getInstance();
		var currentScore = this.gameTimer.seconds;
		var highScore = saveFile.getHighScoreForLevel(TinyDwarf.IncendiaryLevel.LEVEL_NAME);
		var newHighScore = false;

		if(currentScore > highScore)
		{
			saveFile.setHighScoreForLevel(TinyDwarf.IncendiaryLevel.LEVEL_NAME, currentScore);
			highScore = currentScore;
			newHighScore = true;
		}

		this.hud.gameOverScreenText.text = sprintf(sprintf("Your Time: %s\nBest Time: %1$s%%s", TinyDwarf.IncendiaryLevel.HIGH_SCORE_FORMAT), currentScore, highScore, newHighScore ? "\nNew Best Time!" : "");
	}

	// Destroy game objects that have gone out of bounds.
	TinyDwarf.destroyAllInGroupMatching(this.friendGroup, this.gameObjectIsOutOfBounds, this);
	TinyDwarf.destroyAllInGroupMatching(this.enemyGroup, this.gameObjectIsOutOfBounds, this);

	// Update the time on the status bar.
	this.hud.statusBarLeftText.text = sprintf("Time: " + TinyDwarf.IncendiaryLevel.HIGH_SCORE_FORMAT, this.gameTimer.seconds);
};

/**
 * Checks whether a game object (platform, minecart, projectile, etc.) is out
 * of bounds (off the screen) and should be destroyed.
 *
 * @param {Object} gameObject - The game object to check.
 * @returns {Boolean} Whether the game object is out of bounds.
 */
TinyDwarf.IncendiaryLevel.prototype.gameObjectIsOutOfBounds = function(gameObject)
{
	return
//	       gameObject.body.right < 0 ||                  // Off the left side of the screen.
//	       gameObject.body.x > this.game.canvas.width || // Off the right side of the screen.
//	       gameObject.body.bottom < 0 ||                 // Off the top side of the screen.
	       gameObject.body.y > this.game.canvas.height;  // Off the bottom of the screen.
};

/** Spawns the next round of friends and enemies.  */
TinyDwarf.IncendiaryLevel.prototype.spawnFriendsAndEnemies = function()
{
	// Spawn a platform.
	var platformSprite = this.friendGroup.add(this.add.sprite(this.game.canvas.width / 2, 0, "thick-platform-200"));

	// Configure the platform's settings.
	this.physics.arcade.enable(platformSprite);
	platformSprite.body.immovable = true;
	platformSprite.body.velocity.y = TinyDwarf.IncendiaryLevel.FOREGROUND_MOVING_SPEED;
	platformSprite.anchor.set(0.5, 0);

	// Spawn a spike strip on the platform.
	var spikeStripSprite = this.enemyGroup.add(this.add.sprite(this.game.canvas.width / 2, 0, "spikeStrip"));

	// Configure the spike strip's settings.
	this.physics.arcade.enable(spikeStripSprite);
	spikeStripSprite.body.immovable = true;
	spikeStripSprite.body.velocity.y = TinyDwarf.IncendiaryLevel.FOREGROUND_MOVING_SPEED;
	spikeStripSprite.anchor.set(0.5, 1);
};

/**
 * This function is called when the pause/unpause button is pressed. Use this
 * function to show the pause screen and pause/unpause the physics system for
 * any platforms or enemies.
 */
TinyDwarf.IncendiaryLevel.prototype.pauseUnpauseGame = function()
{
	if(this.hud.gameOverScreen.visible)
		return; // Can't pause/unpause because the game is over.

	this.player.isPaused = !this.player.isPaused;
	this.hud.pauseScreen.visible = this.player.isPaused;
	this.friendGroup.setAll("body.enable", !this.player.isPaused);
	this.enemyGroup.setAll("body.enable", !this.player.isPaused);

	if(this.player.isPaused)
	{
		this.gameTimer.pause();
		this.backgroundTileSprite.stopScroll();
	}
	else
	{
		this.gameTimer.resume();
		this.backgroundTileSprite.autoScroll(0, TinyDwarf.IncendiaryLevel.BACKGROUND_MOVING_SPEED);
	}
};

/**
 * This function is called when the player chooses "Play Again" on the game
 * over screen. This function simply reloads the current game state, which is
 * usually good enough to restart the level.
 */
TinyDwarf.IncendiaryLevel.prototype.playAgain = function()
{
	this.game.transition.to(this.game.state.current);
};

/**
 * This function is called when the player chooses "Quit Game" on the pause or
 * game over screen. This function simply transitions to the main menu state.
 */
TinyDwarf.IncendiaryLevel.prototype.quitGame = function()
{
	this.game.transition.to("MainMenu");
};
