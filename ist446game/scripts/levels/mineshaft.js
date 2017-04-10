/** @namespace */
var TinyDwarf = TinyDwarf || {};

/**
 * Creates a new level object. This is the constructor for the level class.
 * Don't bother to initialize anything here. Instead, use the create() function
 * below to initialize the level.
 * 
 * @class
 */
TinyDwarf.MineshaftLevel = function()
{
};

// Select level menu settings.
TinyDwarf.MineshaftLevel.LEVEL_NAME = "Mineshaft";
TinyDwarf.MineshaftLevel.HIGH_SCORE_FORMAT = "%.1f s";

// General level settings.
TinyDwarf.MineshaftLevel.BACKGROUND_IMAGE_NAME = "crackedBrickWall";
TinyDwarf.MineshaftLevel.BACKGROUND_MOVING_SPEED = 35;
TinyDwarf.MineshaftLevel.FOREGROUND_MOVING_SPEED = 70;
TinyDwarf.MineshaftLevel.HOSTILE_SPAWN_STARTING_DELAY = 2500;

// Platform settings.
TinyDwarf.MineshaftLevel.PLATFORM_SPACING = 180;
TinyDwarf.MineshaftLevel.PLATFORM_SPAWN_TYPES =
[
	[["thick-platform-200", 0.2], ["thick-platform-200", 0.6]],
	[["thick-platform-200", 0.2], ["thick-platform-200", 0.7]],
	[["thick-platform-200", 0.2], ["thick-platform-200", 0.8]],
	[["thick-platform-200", 0.3], ["thick-platform-200", 0.6]],
	[["thick-platform-200", 0.3], ["thick-platform-200", 0.7]],
	[["thick-platform-200", 0.3], ["thick-platform-200", 0.8]],
	[["thick-platform-200", 0.4], ["thick-platform-200", 0.7]],
	[["thick-platform-200", 0.4], ["thick-platform-200", 0.8]],

	[["thin-platform-200", 0.125], ["thick-platform-200", 0.4], ["thin-platform-200", 0.875]],
	[["thin-platform-200", 0.125], ["thick-platform-200", 0.5], ["thin-platform-200", 0.875]],
	[["thin-platform-200", 0.125], ["thick-platform-200", 0.6], ["thin-platform-200", 0.875]],
	[["thin-platform-200", 0.125], ["thick-platform-400", 0.5], ["thin-platform-200", 0.875]],

	[["thin-platform-400", 0.4]],
	[["thin-platform-400", 0.5]],
	[["thin-platform-400", 0.6]],
];

// Minecart settings.
TinyDwarf.MineshaftLevel.MINECART_IMAGE_NAME = "minecart";
TinyDwarf.MineshaftLevel.MINECART_MOVING_SPEED = 150;
TinyDwarf.MineshaftLevel.MINECART_SPAWN_PROBABILITY = function(milliseconds)
{
	if(milliseconds < TinyDwarf.MineshaftLevel.HOSTILE_SPAWN_STARTING_DELAY)
		return 0;

	// http://www.wolframalpha.com/input/?i=graph+y+%3D+arctan%28x%2F40000%29*1.5%2Fpi+%2B+0.15+from+x+%3D+-10000+to+200000
	return Math.atan(milliseconds / 40000) * 1.5 / Math.PI + 0.15;
};

// Bat settings.
TinyDwarf.MineshaftLevel.BAT_IMAGE_NAME = "bat";
TinyDwarf.MineshaftLevel.BAT_MOVING_SPEED = 200;
TinyDwarf.MineshaftLevel.BAT_SPAWN_INTERVAL = 500;
TinyDwarf.MineshaftLevel.BAT_LOWEST_SPAWN_POSITION = 0.1;
TinyDwarf.MineshaftLevel.BAT_HIGHEST_SPAWN_POSITION = 0.9;
TinyDwarf.MineshaftLevel.BAT_SPAWN_PROBABILITY = function(milliseconds)
{
	if(milliseconds < TinyDwarf.MineshaftLevel.HOSTILE_SPAWN_STARTING_DELAY)
		return 0;

	// http://www.wolframalpha.com/input/?i=graph+y+%3D+arctan%28x%2F50000%29*6%2F%284*pi%29+%2B+abs%28sin%28x%2F2000%29%2F4%29+from+x+%3D+-10000+to+200000
	return Math.atan(milliseconds / 50000) * 6 / (4 * Math.PI) + Math.abs(Math.sin(milliseconds / 2000) / 4);
};

/**
 * Loads any images that this level needs. Some images are loaded when the game
 * boots (check the preload function of the BootMenu class in menu.js to see
 * which images are loaded). If your level needs any extra images or sprite
 * sheets, then load them in this function.
 */
TinyDwarf.MineshaftLevel.prototype.preload = function()
{
	this.load.image("bat", "images/mineshaft/bat.png");
	this.load.image("crackedBrickWall", "images/mineshaft/crackedBrickWall.png");
	this.load.image("defaultControls", "images/mineshaft/defaultControls.png");
	this.load.image("lavaPool", "images/mineshaft/lavaPool.png");
	this.load.image("minecart", "images/mineshaft/minecart.png");
	this.load.image("thin-platform-200", "images/mineshaft/thin-platform-200.png");
	this.load.image("thin-platform-400", "images/mineshaft/thin-platform-400.png");
	this.load.image("thin-platform-600", "images/mineshaft/thin-platform-600.png");
	this.load.image("thin-platform-800", "images/mineshaft/thin-platform-800.png");
	this.load.image("thick-platform-200", "images/mineshaft/thick-platform-200.png");
	this.load.image("thick-platform-400", "images/mineshaft/thick-platform-400.png");
	this.load.image("thick-platform-600", "images/mineshaft/thick-platform-600.png");
	this.load.image("thick-platform-800", "images/mineshaft/thick-platform-800.png");
};

/**
 * Initializes the level before the player can start playing. Create any
 * initial platforms or enemies for the level in this function.
 */
TinyDwarf.MineshaftLevel.prototype.create = function()
{
	// Create the background, HUD, and player.
	this.backgroundTileSprite = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, TinyDwarf.MineshaftLevel.BACKGROUND_IMAGE_NAME);
	this.controlsSprite = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 4, "defaultControls");
	this.hud = this.add.existing(new TinyDwarf.HUD(this.game, this.pauseUnpauseGame, this.playAgain, this.quitGame, this));
	this.player = this.add.existing(new TinyDwarf.Player(this.game, this.game.canvas.width / 2, TinyDwarf.MineshaftLevel.PLATFORM_SPACING * 1.5));

	// Create the initial platforms.
	this.platformGroup = this.add.group();
	this.platformGroup.add(this.add.sprite(this.game.canvas.width / 2, TinyDwarf.MineshaftLevel.PLATFORM_SPACING * 2, "thick-platform-800")).anchor.set(0.5, 0);
	this.platformGroup.add(this.add.sprite(this.game.canvas.width * 0.2, TinyDwarf.MineshaftLevel.PLATFORM_SPACING, "thin-platform-200")).anchor.set(0.5, 0);
	this.platformGroup.add(this.add.sprite(this.game.canvas.width * 0.8, TinyDwarf.MineshaftLevel.PLATFORM_SPACING, "thin-platform-200")).anchor.set(0.5, 0);

	// Create the initial enemies.
	this.minecartGroup = this.add.group();
	this.batGroup = this.add.group();
	this.lavaPoolSprite = this.add.sprite(0, this.game.canvas.height, "lavaPool");
	this.lavaPoolSprite.anchor.set(0, 1);

	// Start the physics engine.
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
	this.game.physics.arcade.enable(this.hud.statusBarSprite);
	this.game.physics.arcade.enable(this.controlsSprite);
	this.game.physics.arcade.enable(this.player);
	this.game.physics.arcade.enable(this.platformGroup);
	this.game.physics.arcade.enable(this.minecartGroup);
	this.game.physics.arcade.enable(this.batGroup);
	this.game.physics.arcade.enable(this.lavaPoolSprite);

	// Configure the physics for each game object.
	this.backgroundTileSprite.autoScroll(0, TinyDwarf.MineshaftLevel.BACKGROUND_MOVING_SPEED);
	this.lavaPoolSprite.body.immovable = true;
	this.hud.statusBarSprite.body.immovable = true;
	//this.hud.statusBarCenterText.text = "Use the S key to fall faster!";
	this.player.body.collideWorldBounds = true;
	this.platformGroup.setAll("body.immovable", true);
	this.platformGroup.setAll("body.velocity.y", TinyDwarf.MineshaftLevel.FOREGROUND_MOVING_SPEED);
	this.minecartGroup.setAll("body.gravity.y", TinyDwarf.Player.FALLING_ACCELERATION);
	this.batGroup.setAll("body.immovable", true);

	// Configure the controls sprite.
	this.controlsSprite.alpha = 0.75;
	this.controlsSprite.anchor.set(0.5);
	this.controlsSprite.scale.set(0.75, 0.75);
	this.controlsSprite.checkWorldBounds = true;
	this.controlsSprite.outOfBoundsKill = true;
	this.controlsSprite.body.velocity.y = (TinyDwarf.MineshaftLevel.BACKGROUND_MOVING_SPEED + TinyDwarf.MineshaftLevel.FOREGROUND_MOVING_SPEED) / 2;

	// Regularly spawn new platforms, minecarts, and bats.
	this.gameTimer = this.time.create(false);
	this.gameTimer.loop(TinyDwarf.MineshaftLevel.PLATFORM_SPACING / TinyDwarf.MineshaftLevel.FOREGROUND_MOVING_SPEED * 1000, this.spawnPlatformsAndMinecarts, this);
	this.gameTimer.loop(TinyDwarf.MineshaftLevel.BAT_SPAWN_INTERVAL, this.spawnBats, this);
	this.gameTimer.start();

	// Spawn the first set of platforms and minecarts immediately.
	this.spawnPlatformsAndMinecarts();
};

/**
 * Updates the game on each frame. Use this function to check for collisions
 * between the player and platforms/enemies. You could also spawn more
 * platforms or enemies in this function.
 */
TinyDwarf.MineshaftLevel.prototype.update = function()
{
	if(this.hud.pauseScreen.visible || this.hud.gameOverScreen.visible)
		return; // Don't update the game because the game is paused or over.

	// Make sure sprites overlap in the correct order.
	this.world.bringToTop(this.player);
	this.batGroup.bringToTop(this.lavaPoolSprite);

	// Resolve collisions between game objects.
	this.game.physics.arcade.collide(this.minecartGroup, this.platformGroup);
	this.game.physics.arcade.collide(this.minecartGroup, this.minecartGroup);
	this.game.physics.arcade.collide(this.player, this.hud.statusBarSprite);
	this.game.physics.arcade.collide(this.player, this.platformGroup, undefined, function(player, platform)
	{
		// Allow the player to travel upwards through thin platforms.
		return !(player.body.velocity.y < 0 && /^thin-platform-\d+$/.test(platform.key));
	});

	// Make minecarts move when the player gets close.
	this.minecartGroup.forEach(function(minecart)
	{
		if(!minecart._startedMovingTowardPlayer && this.player.body.y < minecart.body.bottom)
		{
			minecart._startedMovingTowardPlayer = true;
			minecart.body.bounce.set(1, 0.5);
			minecart.body.velocity.x = (this.player.body.center.x < minecart.body.center.x ? -1 : 1) * TinyDwarf.MineshaftLevel.MINECART_MOVING_SPEED;
		}
	}, this);

	// Check whether the player has hit an enemy.
	if(this.game.physics.arcade.overlap(this.player, this.lavaPoolSprite) ||
	   this.game.physics.arcade.overlap(this.player, this.batGroup) ||
	   this.game.physics.arcade.overlap(this.player, this.minecartGroup))
	{
		this.pauseUnpauseGame();
		this.hud.pauseScreen.visible = false;
		this.hud.gameOverScreen.visible = true;

		var saveFile = TinyDwarf.SaveFile.getInstance();
		var currentScore = this.gameTimer.seconds;
		var highScore = saveFile.getHighScoreForLevel(TinyDwarf.MineshaftLevel.LEVEL_NAME);
		var newHighScore = false;

		if(currentScore > highScore)
		{
			saveFile.setHighScoreForLevel(TinyDwarf.MineshaftLevel.LEVEL_NAME, currentScore);
			highScore = currentScore;
			newHighScore = true;
		}

		this.hud.gameOverScreenText.text = sprintf(sprintf("Your Time: %s\nBest Time: %1$s%%s", TinyDwarf.MineshaftLevel.HIGH_SCORE_FORMAT), currentScore, highScore, newHighScore ? "\nNew Best Time!" : "");
	}

	// Destroy game objects that have gone out of bounds.
	TinyDwarf.destroyAllInGroupMatching(this.platformGroup, this.gameObjectIsOutOfBounds, this);
	TinyDwarf.destroyAllInGroupMatching(this.minecartGroup, this.gameObjectIsOutOfBounds, this);
	TinyDwarf.destroyAllInGroupMatching(this.batGroup, this.gameObjectIsOutOfBounds, this);

	// Update the time on the status bar.
	this.hud.statusBarLeftText.text = sprintf("Time: " + TinyDwarf.MineshaftLevel.HIGH_SCORE_FORMAT, this.gameTimer.seconds);
};

/**
 * Checks whether a game object (platform, minecart, projectile, etc.) is out
 * of bounds (off the screen) and should be destroyed.
 *
 * @param {Object} gameObject - The game object to check.
 * @returns {Boolean} Whether the game object is out of bounds.
 */
TinyDwarf.MineshaftLevel.prototype.gameObjectIsOutOfBounds = function(gameObject)
{
	return gameObject.body.right < 0 ||                  // Off the left side of the screen.
	       gameObject.body.x > this.game.canvas.width || // Off the right side of the screen.
//	       gameObject.body.bottom < 0 ||                 // Off the top side of the screen.
	       gameObject.body.y > this.game.canvas.height;  // Off the bottom of the screen.
};

/** Spawns the next round of platforms and minecarts.  */
TinyDwarf.MineshaftLevel.prototype.spawnPlatformsAndMinecarts = function()
{
	var platformsToSpawn;

	if(this.gameTimer.ms < TinyDwarf.MineshaftLevel.HOSTILE_SPAWN_STARTING_DELAY)
	{
		// Spawn platforms on the sides of the screen for the first few seconds to let the player view the controls.
		platformsToSpawn = [["thin-platform-200", 0.2], ["thin-platform-200", 0.8]]
	}
	else
	{
		// Start spawning platforms normally.
		platformsToSpawn = this.rnd.pick(TinyDwarf.MineshaftLevel.PLATFORM_SPAWN_TYPES);
	}

	for(var platformNumber = 0; platformNumber < platformsToSpawn.length; platformNumber++)
	{
		// Spawn the platform.
		var platformImageName = platformsToSpawn[platformNumber][0];
		var platformCenterXPercent = platformsToSpawn[platformNumber][1];
		var platformSprite = this.platformGroup.add(this.add.sprite(platformCenterXPercent * this.game.canvas.width, 0, platformImageName));

		// Configure the platform's settings.
		this.physics.arcade.enable(platformSprite);
		platformSprite.body.immovable = true;
		platformSprite.body.velocity.y = TinyDwarf.MineshaftLevel.FOREGROUND_MOVING_SPEED;
		platformSprite.anchor.set(0.5, 0);

		// Try to spawn a minecart on this platform.
		if(this.rnd.realInRange(0, 1) < TinyDwarf.MineshaftLevel.MINECART_SPAWN_PROBABILITY(this.gameTimer.ms))
		{
			// Spawn the minecart.
			var minecartSprite = this.minecartGroup.add(this.add.sprite(platformSprite.x, platformSprite.y, TinyDwarf.MineshaftLevel.MINECART_IMAGE_NAME));

			// Configure the minecart's settings.
			this.physics.arcade.enable(minecartSprite);
			minecartSprite.body.gravity.y = TinyDwarf.Player.FALLING_ACCELERATION;
			minecartSprite.body.setSize(minecartSprite.width * 4 / 5, minecartSprite.height * 4 / 5);
			minecartSprite.anchor.set(0.5, 1);
		}
	}
};

/** Spawns the next round of bats.  */
TinyDwarf.MineshaftLevel.prototype.spawnBats = function()
{
	if(this.rnd.realInRange(0, 1) < TinyDwarf.MineshaftLevel.BAT_SPAWN_PROBABILITY(this.gameTimer.ms))
	{
		// Spawn the bat.
		var batMovingXDirection = this.rnd.pick([-1, 1]);
		var batCenterYPercent = this.rnd.realInRange(TinyDwarf.MineshaftLevel.BAT_LOWEST_SPAWN_POSITION, TinyDwarf.MineshaftLevel.BAT_HIGHEST_SPAWN_POSITION);
		var batSprite = this.batGroup.add(this.add.sprite(this.game.canvas.width / 2 * (1 - batMovingXDirection), this.game.canvas.height * batCenterYPercent, TinyDwarf.MineshaftLevel.BAT_IMAGE_NAME));

		// Configure the bat's settings.
		this.physics.arcade.enable(batSprite);
		batSprite.body.immovable = true;
		batSprite.body.setSize(batSprite.width * 9 / 10, batSprite.height * 4 / 5);
		batSprite.body.velocity.x = TinyDwarf.MineshaftLevel.BAT_MOVING_SPEED * batMovingXDirection;
		batSprite.scale.x = -batMovingXDirection;
		batSprite.anchor.set(0.5);
	}
};

/**
 * This function is called when the pause/unpause button is pressed. Use this
 * function to show the pause screen and pause/unpause the physics system for
 * any platforms or enemies.
 */
TinyDwarf.MineshaftLevel.prototype.pauseUnpauseGame = function()
{
	if(this.hud.gameOverScreen.visible)
		return; // Can't pause/unpause because the game is over.

	this.player.isPaused = !this.player.isPaused;
	this.hud.pauseScreen.visible = this.player.isPaused;
	this.controlsSprite.body.enable = !this.player.isPaused;
	this.platformGroup.setAll("body.enable", !this.player.isPaused);
	this.minecartGroup.setAll("body.enable", !this.player.isPaused);
	this.batGroup.setAll("body.enable", !this.player.isPaused);

	if(this.player.isPaused)
	{
		this.gameTimer.pause();
		this.backgroundTileSprite.stopScroll();
	}
	else
	{
		this.gameTimer.resume();
		this.backgroundTileSprite.autoScroll(0, TinyDwarf.MineshaftLevel.BACKGROUND_MOVING_SPEED);
	}
};

/**
 * This function is called when the player chooses "Play Again" on the game
 * over screen. This function simply reloads the current game state, which is
 * usually good enough to restart the level.
 */
TinyDwarf.MineshaftLevel.prototype.playAgain = function()
{
	this.game.transition.to(this.game.state.current);
};

/**
 * This function is called when the player chooses "Quit Game" on the pause or
 * game over screen. This function simply transitions to the main menu state.
 */
TinyDwarf.MineshaftLevel.prototype.quitGame = function()
{
	this.game.transition.to("MainMenu");
};
