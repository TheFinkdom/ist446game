/** @namespace */
var TinyDwarf = TinyDwarf || {};

/**
 * Creates a new level object. This is the constructor for the level class.
 * Don't bother to initialize anything here. Instead, use the create() function
 * below to initialize the level.
 * 
 * @class
 */
TinyDwarf.AirborneLevel = function()
{
};

// These two settings are used by the select level menu.
TinyDwarf.AirborneLevel.LEVEL_NAME = "Airborne";
TinyDwarf.AirborneLevel.HIGH_SCORE_FORMAT = "%.1f s";

// These settings are only used by this level class.
TinyDwarf.AirborneLevel.BACKGROUND_MOVING_SPEED = -80;
TinyDwarf.AirborneLevel.FOREGROUND_MOVING_SPEED = -120;
TinyDwarf.AirborneLevel.WALL_SPACING = 180;
TinyDwarf.AirborneLevel.WALL_GAP_SIZE = 100;
TinyDwarf.AirborneLevel.MIN_WALL_HEIGHT = 50;

/**
 * Loads any images that this level needs. Some images are loaded when the game
 * boots (check the preload function of the BootMenu class in menu.js to see
 * which images are loaded). If your level needs any extra images or sprite
 * sheets, then load them in this function.
 */
TinyDwarf.AirborneLevel.prototype.preload = function()
{
	this.load.image("flyControls", "images/airborne/flyControls.png");
	this.load.image("grassBorderTexture", "images/airborne/grassBorderTexture.png");
	this.load.image("grassPlatformLarge", "images/airborne/grassPlatformLarge.png");
	this.load.image("grassWallLarge", "images/airborne/grassWallLarge.png");
	this.load.image("skyBackground", "images/airborne/skyBackground.png");
};

/**
 * Initializes the level before the player can start playing. Create any
 * initial platforms or enemies for the level in this function.
 */
TinyDwarf.AirborneLevel.prototype.create = function()
{
	// Create the background, HUD, and player.
	this.backgroundTileSprite = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, "skyBackground");
	this.controlsSprite = this.add.sprite(this.game.canvas.width * 3 / 4, this.game.canvas.height / 2, "flyControls");
	this.hud = this.add.existing(new TinyDwarf.HUD(this.game, this.pauseUnpauseGame, this.playAgain, this.quitGame, this));
	this.player = this.add.existing(new TinyDwarf.Player(this.game, this.game.canvas.width / 2, this.game.canvas.height / 2));

	// Create groups for categorizing friends and enemies.
	this.friendGroup = this.add.group();
	this.enemyGroup = this.add.group();

	// Create some initial platforms.
	var initialPlatform = this.friendGroup.add(this.add.sprite(this.game.canvas.width, this.game.canvas.height * 0.8, "grassPlatformLarge"));
	initialPlatform.anchor.set(1, 0);

	// Create the spikes bordering the top and bottom of the screen.
	var borderHeight = this.cache.getImage("grassBorderTexture").height;
	this.topBorder = this.enemyGroup.add(this.add.tileSprite(0, this.hud.statusBarSprite.height - borderHeight / 2, this.game.canvas.width, borderHeight, "grassBorderTexture"));
	this.bottomBorder = this.enemyGroup.add(this.add.tileSprite(0, this.game.canvas.height - borderHeight / 2, this.game.canvas.width, borderHeight, "grassBorderTexture"));

	// Start the physics engine.
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
	this.game.physics.arcade.enable(this.hud.statusBarSprite);
	this.game.physics.arcade.enable(this.controlsSprite);
	this.game.physics.arcade.enable(this.player);
	this.game.physics.arcade.enable(this.friendGroup);
	this.game.physics.arcade.enable(this.enemyGroup);

	// Configure the physics for each game object.
	this.backgroundTileSprite.autoScroll(TinyDwarf.AirborneLevel.BACKGROUND_MOVING_SPEED, 0);
	this.hud.statusBarSprite.body.immovable = true;
	this.hud.statusBarCenterText.text = "Special Ability: Repeatedly tap Space to fly!";
	this.player.body.collideWorldBounds = true;
	this.player.maxConsecutiveJumps = -1;
	this.topBorder.body.setSize(this.topBorder.width, this.topBorder.height * 0.85, 0, 0);
	this.topBorder.autoScroll(TinyDwarf.AirborneLevel.FOREGROUND_MOVING_SPEED, 0);
	this.bottomBorder.body.setSize(this.bottomBorder.width, this.bottomBorder.height * 0.85, 0, this.bottomBorder.height * 0.15);
	this.bottomBorder.autoScroll(TinyDwarf.AirborneLevel.FOREGROUND_MOVING_SPEED, 0);
	this.friendGroup.setAll("body.immovable", true);
	this.friendGroup.setAll("body.velocity.x", TinyDwarf.AirborneLevel.FOREGROUND_MOVING_SPEED);

	// Configure the controls sprite.
	this.controlsSprite.alpha = 0.75;
	this.controlsSprite.anchor.set(0.5);
	this.controlsSprite.scale.set(0.75, 0.75);
	this.controlsSprite.checkWorldBounds = true;
	this.controlsSprite.outOfBoundsKill = true;
	this.controlsSprite.body.velocity.x = (TinyDwarf.AirborneLevel.BACKGROUND_MOVING_SPEED + TinyDwarf.AirborneLevel.FOREGROUND_MOVING_SPEED) / 2;

	// Regularly spawn new walls.
	this.gameTimer = this.time.create(false);
	this.gameTimer.loop(TinyDwarf.AirborneLevel.WALL_SPACING / Math.abs(TinyDwarf.AirborneLevel.FOREGROUND_MOVING_SPEED) * 1000, this.spawnWall, this);
	this.gameTimer.start();

	// Spawn the first wall immediately.
	this.spawnWall();
};

/**
 * Updates the game on each frame. Use this function to check for collisions
 * between the player and platforms/enemies. You could also spawn more
 * platforms or enemies in this function.
 */
TinyDwarf.AirborneLevel.prototype.update = function()
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
		var highScore = saveFile.getHighScoreForLevel(TinyDwarf.AirborneLevel.LEVEL_NAME);
		var newHighScore = false;

		if(currentScore > highScore)
		{
			saveFile.setHighScoreForLevel(TinyDwarf.AirborneLevel.LEVEL_NAME, currentScore);
			highScore = currentScore;
			newHighScore = true;
		}

		this.hud.gameOverScreenText.text = sprintf(sprintf("Your Time: %s\nBest Time: %1$s%%s", TinyDwarf.AirborneLevel.HIGH_SCORE_FORMAT), currentScore, highScore, newHighScore ? "\nNew Best Time!" : "");
	}

	// Destroy game objects that have gone out of bounds.
	TinyDwarf.destroyAllInGroupMatching(this.friendGroup, this.gameObjectIsOutOfBounds, this);
	TinyDwarf.destroyAllInGroupMatching(this.enemyGroup, this.gameObjectIsOutOfBounds, this);

	// Update the time on the status bar.
	this.hud.statusBarLeftText.text = sprintf("Time: " + TinyDwarf.AirborneLevel.HIGH_SCORE_FORMAT, this.gameTimer.seconds);
};

/**
 * Checks whether a game object (platform, minecart, projectile, etc.) is out
 * of bounds (off the screen) and should be destroyed.
 *
 * @param {Object} gameObject - The game object to check.
 * @returns {Boolean} Whether the game object is out of bounds.
 */
TinyDwarf.AirborneLevel.prototype.gameObjectIsOutOfBounds = function(gameObject)
{
	return
	       gameObject.body.right < 0 ||                  // Off the left side of the screen.
//	       gameObject.body.x > this.game.canvas.width || // Off the right side of the screen.
	       gameObject.body.bottom < 0 ||                 // Off the top side of the screen.
	       gameObject.body.y > this.game.canvas.height;  // Off the bottom of the screen.
};

/** Spawns the next wall.  */
TinyDwarf.AirborneLevel.prototype.spawnWall = function()
{
	var xOffset = this.game.canvas.width;

	// Find the right edge of the rightmost enemy in the level.
	this.enemyGroup.forEach(function(gameObject)
	{
		xOffset = Math.max(xOffset, gameObject.body.right);
	}, this);

	var yPositionOfWallGap = this.rnd.integerInRange(this.hud.statusBarSprite.height + TinyDwarf.AirborneLevel.MIN_WALL_HEIGHT, this.game.canvas.height - TinyDwarf.AirborneLevel.WALL_GAP_SIZE - TinyDwarf.AirborneLevel.MIN_WALL_HEIGHT);
	var wallSpriteHeight = this.cache.getImage("grassWallLarge").height;

	for(var n = 0; n < 2; n++)
	{
		// Spawn a wall.
		var wallSpriteYPosition = 0 == n ? yPositionOfWallGap - wallSpriteHeight : yPositionOfWallGap + TinyDwarf.AirborneLevel.WALL_GAP_SIZE;
		var wallSprite = this.enemyGroup.add(this.add.sprite(xOffset + TinyDwarf.AirborneLevel.WALL_SPACING, wallSpriteYPosition, "grassWallLarge"));

		// Configure the wall's settings.
		this.physics.arcade.enable(wallSprite);
		wallSprite.body.immovable = true;
		wallSprite.body.velocity.x = TinyDwarf.AirborneLevel.FOREGROUND_MOVING_SPEED;
		wallSprite.body.setSize(wallSprite.width * 0.7, wallSprite.height * 0.95, wallSprite.width * 0.15, wallSprite.height * 0.025);
	}
};

/**
 * This function is called when the pause/unpause button is pressed. Use this
 * function to show the pause screen and pause/unpause the physics system for
 * any platforms or enemies.
 */
TinyDwarf.AirborneLevel.prototype.pauseUnpauseGame = function()
{
	if(this.hud.gameOverScreen.visible)
		return; // Can't pause/unpause because the game is over.

	this.player.isPaused = !this.player.isPaused;
	this.hud.pauseScreen.visible = this.player.isPaused;
	this.controlsSprite.body.enable = !this.player.isPaused;
	this.friendGroup.setAll("body.enable", !this.player.isPaused);
	this.enemyGroup.setAll("body.enable", !this.player.isPaused);

	if(this.player.isPaused)
	{
		this.gameTimer.pause();
		this.backgroundTileSprite.stopScroll();
		this.topBorder.stopScroll();
		this.bottomBorder.stopScroll();
	}
	else
	{
		this.gameTimer.resume();
		this.backgroundTileSprite.autoScroll(TinyDwarf.AirborneLevel.BACKGROUND_MOVING_SPEED, 0);
		this.topBorder.autoScroll(TinyDwarf.AirborneLevel.FOREGROUND_MOVING_SPEED, 0);
		this.bottomBorder.autoScroll(TinyDwarf.AirborneLevel.FOREGROUND_MOVING_SPEED, 0);
	}
};

/**
 * This function is called when the player chooses "Play Again" on the game
 * over screen. This function simply reloads the current game state, which is
 * usually good enough to restart the level.
 */
TinyDwarf.AirborneLevel.prototype.playAgain = function()
{
	this.game.transition.to(this.game.state.current);
};

/**
 * This function is called when the player chooses "Quit Game" on the pause or
 * game over screen. This function simply transitions to the main menu state.
 */
TinyDwarf.AirborneLevel.prototype.quitGame = function()
{
	this.game.transition.to("MainMenu");
};
