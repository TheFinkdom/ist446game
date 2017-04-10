/** @namespace */
var TinyDwarf = TinyDwarf || {};

/**
 * Creates a new level object. This is the constructor for the level class.
 * Don't bother to initialize anything here. Instead, use the create() function
 * below to initialize the level.
 * 
 * @class
 */
TinyDwarf.RollLevel = function()
{
};

// These two settings are used by the select level menu.
TinyDwarf.RollLevel.LEVEL_NAME = "Roll";
TinyDwarf.RollLevel.HIGH_SCORE_FORMAT = "%.1f s";

// These settings are only used by this level class.
TinyDwarf.RollLevel.BACKGROUND_IMAGE_NAME = "crackedBrickWall";
TinyDwarf.RollLevel.BACKGROUND_MOVING_SPEED = -35;
TinyDwarf.RollLevel.FOREGROUND_MOVING_SPEED = -70;
TinyDwarf.RollLevel.SPAWN_TIMEOUT = 3500;

/**
 * Loads any images that this level needs. Some images are loaded when the game
 * boots (check the preload function of the BootMenu class in menu.js to see
 * which images are loaded). If your level needs any extra images or sprite
 * sheets, then load them in this function.
 */
TinyDwarf.RollLevel.prototype.preload = function()
{
	this.load.image("crackedBrickWall", "images/mineshaft/crackedBrickWall.png");
	this.load.image("horizontal-thick-platform-200", "images/Rolling/horizontal-thick-platform-200.png");
	this.load.image("horizontal_spikeStrip", "images/Rolling/horizontal_spikeStrip.png");
	this.load.image("Ground_Chunk_1","images/Rolling/Ground_Chunk_1");
	this.load.image("spikesWall", "images/artillery/spikesWall.png");
};

TinyDwarf.RollLevel.CHUNK_LAYOUTS = 
[
	[
		["Ground_Chunk_1", [[0,300] , [100,300] , [200,300] , [300,300] , [400,300] , [500,300] , [600,300] , [700,300]]],

		["Ground_Chunk_1", [[0,200] , [100,300] , [200,300] , [300,300] , [400,300] , [500,300] , [600,300] , [700,300]]],

		["Ground_Chunk_1", [[0,200] , [100,200] , [200,300] , [300,300] , [400,300] , [500,300] , [600,300] , [700,300]]],
	];

];

/**
 * Initializes the level before the player can start playing. Create any
 * initial platforms or enemies for the level in this function.
 */
TinyDwarf.RollLevel.prototype.create = function()
{
	// Create the background, HUD, and player.
	this.backgroundTileSprite = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, TinyDwarf.RollLevel.BACKGROUND_IMAGE_NAME);
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
	this.backgroundTileSprite.autoScroll(TinyDwarf.RollLevel.BACKGROUND_MOVING_SPEED, 0);
	this.hud.statusBarSprite.body.immovable = true;
	this.player.body.collideWorldBounds = true;
	this.player.enableRolling = true;
	this.spikesWallSprite.body.immovable = true;
	this.spikesWallSprite.body.setSize(this.spikesWallSprite.width * 0.8, this.spikesWallSprite.height);

	// Regularly spawn new friends and enemies.
	this.gameTimer = this.time.create(false);
	this.gameTimer.loop(TinyDwarf.RollLevel.SPAWN_TIMEOUT, this.spawnFriendsAndEnemies, this);
	this.gameTimer.start();

	// Spawn Level Chunks
	this.spawnChunk(TinyDwarf.RollLevel.CHUNK_LAYOUTS[1]);

	// Spawn the first round of friends and enemies immediately.
	this.spawnFriendsAndEnemies();


};


/**
 * Updates the game on each frame. Use this function to check for collisions
 * between the player and platforms/enemies. You could also spawn more
 * platforms or enemies in this function.
 */
TinyDwarf.RollLevel.prototype.update = function()
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
		var highScore = saveFile.getHighScoreForLevel(TinyDwarf.RollLevel.LEVEL_NAME);
		var newHighScore = false;

		if(currentScore > highScore)
		{
			saveFile.setHighScoreForLevel(TinyDwarf.RollLevel.LEVEL_NAME, currentScore);
			highScore = currentScore;
			newHighScore = true;
		}

		this.hud.gameOverScreenText.text = sprintf(sprintf("Your Time: %s\nBest Time: %1$s%%s", TinyDwarf.RollLevel.HIGH_SCORE_FORMAT), currentScore, highScore, newHighScore ? "\nNew Best Time!" : "");
	}

	// Destroy game objects that have gone out of bounds.
	TinyDwarf.destroyAllInGroupMatching(this.friendGroup, this.gameObjectIsOutOfBounds, this);
	TinyDwarf.destroyAllInGroupMatching(this.enemyGroup, this.gameObjectIsOutOfBounds, this);

	// Update the time on the status bar.
	this.hud.statusBarLeftText.text = sprintf("Time: " + TinyDwarf.RollLevel.HIGH_SCORE_FORMAT, this.gameTimer.seconds);
};

/**
 * Checks whether a game object (platform, minecart, projectile, etc.) is out
 * of bounds (off the screen) and should be destroyed.
 *
 * @param {Object} gameObject - The game object to check.
 * @returns {Boolean} Whether the game object is out of bounds.
 */
TinyDwarf.RollLevel.prototype.gameObjectIsOutOfBounds = function(gameObject)
{
	return
	       gameObject.body.right < 0; // ||                  // Off the left side of the screen.
//	       gameObject.body.x > this.game.canvas.width || // Off the right side of the screen.
//	       gameObject.body.bottom < 0 ||                 // Off the top side of the screen.
//	       gameObject.body.y > this.game.canvas.height;  // Off the bottom of the screen.
};

/** Spawns the next round of friends and enemies.  */
TinyDwarf.RollLevel.prototype.spawnFriendsAndEnemies = function()
{
	// Spawn a platform.
	var platformSprite = this.friendGroup.add(this.add.sprite(this.game.canvas.width, this.game.canvas.height * 0.75, "horizontal-thick-platform-200"));


	// Configure the platform's settings.
	this.physics.arcade.enable(platformSprite);
	platformSprite.body.immovable = true;
	platformSprite.body.velocity.x = TinyDwarf.RollLevel.FOREGROUND_MOVING_SPEED;

	// Spawn a spike strip on the platform.
	var spikeStripSprite = this.enemyGroup.add(this.add.sprite(this.game.canvas.width + platformSprite.width / 2, this.game.canvas.height * 0.75, "horizontal_spikeStrip"));

	// Configure the spike strip's settings.
	this.physics.arcade.enable(spikeStripSprite);
	spikeStripSprite.body.immovable = true;
	spikeStripSprite.body.velocity.x = TinyDwarf.RollLevel.FOREGROUND_MOVING_SPEED;
	spikeStripSprite.anchor.set(0.5, 1);

	// Spawn ground
	var groundSprite = this.friendGroup.add(this.add.sprite(this.game.canvas.width, this.game.canvas.height * 0.75, "Ground_Chunk_1"));

	// configure ground settings
	this.physics.arcade.enable(groundSprite);
	platformSprite.body.immovable = true;
	platformSprite.body.velocity.x = TinyDwarf.RollLevel.FOREGROUND_MOVING_SPEED;
};

/**
 * This function is called when the pause/unpause button is pressed. Use this
 * function to show the pause screen and pause/unpause the physics system for
 * any platforms or enemies.
 */
TinyDwarf.RollLevel.prototype.pauseUnpauseGame = function()
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
		this.backgroundTileSprite.autoScroll(TinyDwarf.RollLevel.BACKGROUND_MOVING_SPEED, 0);
	}
};

/**
 * This function is called when the player chooses "Play Again" on the game
 * over screen. This function simply reloads the current game state, which is
 * usually good enough to restart the level.
 */
TinyDwarf.RollLevel.prototype.playAgain = function()
{
	this.game.transition.to(this.game.state.current);
};

/**
 * This function is called when the player chooses "Quit Game" on the pause or
 * game over screen. This function simply transitions to the main menu state.
 */
TinyDwarf.RollLevel.prototype.quitGame = function()
{
	this.game.transition.to("MainMenu");
};

TinyDwarf.RollingLevel.prototype.spawnChunk = function(chunkLayout)
{
	if(undefined === chunkLayout)
	{
		do
		{
			chunkLayout = this.rnd.pick(TinyDwarf.RollLevel.CHUNK_LAYOUTS);
		}
		while(TinyDwarf.RollingLevel.CHUNK_LAYOUTS.length > 1 && this._lastChunkLayout == chunkLayout);

		this._lastChunkLayout = chunkLayout;
	}

	/*var xOffset = 0;

	this.friendGroup.forEach(function(gameObject)
	{
		xOffset = Math.max(xOffset, gameObject.body.right - 1);
	}, this);

	for(var n = 0; n < chunkLayout.length; n++)
	{
		var spriteImageName = chunkLayout[n][0];
		var spritePositions = chunkLayout[n][1];
	*/

	/*	for(var k = 0; k < spritePositions.length; k++)
		{
			var sprite = this.add.sprite(spritePositions[k][0] + xOffset, spritePositions[k][1], spriteImageName);

			this.physics.arcade.enable(sprite);
			sprite.body.immovable = true;
			sprite.body.velocity.x = TinyDwarf.RollingLevel.FOREGROUND_MOVING_SPEED;

			if("spikes100x3" == spriteImageName || "cannon100x70" == spriteImageName)
				sprite.body.setSize(sprite.width * 0.8, sprite.height * 0.8, sprite.width * 0.1, sprite.height * 0.2);

			if("horizontal_spikeStrip" == spriteImageName)
				this.enemyGroup.add(sprite);
			else
				this.friendGroup.add(sprite);
		}
	*/}
};
