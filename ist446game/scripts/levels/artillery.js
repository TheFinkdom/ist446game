/** @namespace */
var TinyDwarf = TinyDwarf || {};

/**
 * Creates a new level object. This is the constructor for the level class.
 * Don't bother to initialize anything here. Instead, use the create() function
 * below to initialize the level.
 * 
 * @class
 */
TinyDwarf.ArtilleryLevel = function()
{
};

// These two settings are used by the select level menu.
TinyDwarf.ArtilleryLevel.LEVEL_NAME = "Artillery";
TinyDwarf.ArtilleryLevel.HIGH_SCORE_FORMAT = "%.1f s";

// These settings are only used by this level class.
TinyDwarf.ArtilleryLevel.BACKGROUND_MOVING_SPEED = -90;
TinyDwarf.ArtilleryLevel.FOREGROUND_MOVING_SPEED = -130;
TinyDwarf.ArtilleryLevel.CANNON_BALL_VELOCITY = -300;
TinyDwarf.ArtilleryLevel.CANNON_FIRE_INTERVAL = 750;
TinyDwarf.ArtilleryLevel.CANNON_FIRE_PROBABILITY = function(milliseconds)
{
	// http://www.wolframalpha.com/input/?i=graph+y+%3D+atan%28x+%2F+30000%29+*+2%2Fpi+*+0.3+%2B+0.4+from+x+%3D+-50000+to+100000
	return Math.atan(milliseconds / 30000) * 2 / Math.PI * 0.3 + 0.4;
};

// Chunks of the level that will be randomly spawned.
TinyDwarf.ArtilleryLevel.CHUNK_LAYOUTS =
[
	[
		["castle100x600Both",  [[0, 425],                                     [400, 150],                                   ]],
		["castle100x600Mid",   [          [100, 550], [200, 550], [300, 300],             [500, 300], [600, 500], [700, 550]]],
		["spikes100x30",       [          [100, 520], [200, 520], [300, 270],             [500, 270], [600, 470], [700, 520]]],
		["cannon100x70",       [                                              [400,  80],                                   ]],
	],

	[
		["castle100x600Both",  [[0, 500], [100, 450], [200, 400], [300, 350], [400, 300], [500, 350], [600, 400], [700, 450]]],
		["cannon100x70",       [          [100, 380], [200, 330], [300, 280], [400, 230], [500, 280], [600, 330], [700, 380]]],
	],

	[
		["castle50x600Both",  [                      [225,-250],                                     [675,-250],           ]],
		["castle70x40Both",   [                                              [400, 350],                                   ]],
		["castle100x600Both", [[0, 350],                                                                                   ]],
		["castle100x600Mid",  [          [100, 500], [200, 550], [300, 500], [400, 500], [500, 300], [600, 550], [700, 550]]],
		["spikes100x30",      [          [100, 470], [200, 520], [300, 470], [400, 470], [500, 270], [600, 520], [700, 520]]],
	],

	[
		["castle50x600Both",  [                                                                                  [675,-250]]],
		["castle100x600Both", [[0, 375], [100, 400],             [300, 300],             [500, 200],                       ]],
		["castle100x600Mid",  [                      [200, 550],             [400, 550],             [600, 550], [700, 550]]],
		["spikes100x30",      [                      [200, 520],             [400, 520],             [600, 520], [700, 520]]],
		["cannon100x70",      [          [100, 330],             [300, 230],             [500, 130],
		                                                         [300, 160],                                               ]],
	],

	[
		["castle50x600Both",  [                       [225,-250],                                     [675,-250],           ]],
		["castle70x40Both",   [[15, 350],                                     [415, 350],                                   ]],
		["castle100x600Mid",  [[ 0, 525], [100, 550], [200, 525], [300, 500], [400, 525], [500, 500], [600, 525], [700, 550]]],
		["spikes100x30",      [[ 0, 495], [100, 520], [200, 495], [300, 470], [400, 495], [500, 470], [600, 495], [700, 520]]],
	],

	[
		["castle50x600Both",  [                                                           [575,-250],                       ]],
		["castle70x40Both",   [[15, 475], [115, 180],                                                                       ]],
		["castle100x600Both", [                                               [400, 500],                                   ]],
		["castle100x600Mid",  [[ 0, 550], [100, 550], [200, 550], [300, 550],             [500, 550], [600, 550], [700, 550]]],
		["spikes100x30",      [[ 0, 520], [100, 520], [200, 520], [300, 520],             [500, 520], [600, 520], [700, 520]]],
		["cannon100x70",      [                                               [400, 430],
		                                                                      [400, 360],
		                                                                      [400, 290],
		                                                                      [400, 220],
		                                                                      [400, 150],                                   ]],
	],

	[
		["castle50x600Both",  [           [125,-200],             [375,-190],                                               ]],
		["castle70x40Both",   [[15, 350],             [240, 375],             [425, 350],                                   ]],
		["castle100x600Both", [                                                                                   [700, 335]]],
		["castle100x600Mid",  [[ 0, 550], [100, 550], [200, 550], [300, 550], [400, 550], [500, 550], [600, 350],           ]],
		["spikes100x30",      [[ 0, 520], [100, 520], [200, 520], [300, 520], [400, 520], [500, 520], [600, 320],           ]],
		["cannon100x70",      [                                                                                   [700, 265]]],
	],

	[
		["castle100x600Both", [[0, 420],                                                                                   ]],
		["castle100x600Mid",  [          [100, 500], [200, 400], [300, 300], [400, 200], [500, 300], [600, 400], [700, 500]]],
		["spikes100x30",      [          [100, 470], [200, 370], [300, 270], [400, 170], [500, 270], [600, 370], [700, 470]]],
	],

	[
		["castle50x600Both",  [                      [430,-250],                                                          ]],
		["castle70x40Both",   [                      [480, 210], [530, 310],
		                                                         [530, 110],                                              ]],
		["castle100x600Both", [[0, 390],                                                             [600, 90], [700, 250]]],
		["castle100x600Mid",  [          [100, 300], [200, 300], [300, 500], [400, 500], [500, 500],                      ]],
		["spikes100x30",      [          [100, 270], [200, 270], [300, 470], [400, 470], [500, 470],                      ]],
		["cannon100x70",      [                                                                                 [700, 180]]],
	],

	[
		["castle100x600Both", [[0, 440],                         [350,-250],                                     [700, 530]]],
		["castle100x600Mid",  [          [100, 350], [200, 450], [300, 550], [400, 550], [500, 450], [600, 350],           ]],
		["spikes100x30",      [          [100, 320], [200, 420], [300, 520], [400, 520], [500, 420], [600, 320],           ]],
		["cannon100x70",      [                                                                                  [700, 460]]],
	],
];

// These chunk layout always spawn at the beginning of the level.
TinyDwarf.ArtilleryLevel.INITIAL_CHUNK_LAYOUTS =
[
	[
		["castle100x600Left",  [[0, 400]]],
		["castle100x600Mid",   [          [100, 400], [200, 400], [300, 400], [400, 400], [500, 400], [600, 400], [700, 400]]],
	],

	[
		["castle100x600Mid",   [[0, 400], [100, 400], [200, 400], [300, 400], [400, 400], [500, 400], [600, 400],           ]],
		["castle100x600Right", [                                                                                  [700, 400]]],
	],
];

/**
 * Loads any images that this level needs. Some images are loaded when the game
 * boots (check the preload function of the BootMenu class in menu.js to see
];

/**
 * Loads any images that this level needs. Some images are loaded when the game
 * boots (check the preload function of the BootMenu class in menu.js to see
 * which images are loaded). If your level needs any extra images or sprite
 * sheets, then load them in this function.
 */
TinyDwarf.ArtilleryLevel.prototype.preload = function()
{
	this.load.image("cannon100x70", "images/artillery/cannon100x70.png");
	this.load.image("cannon100x70Firing", "images/artillery/cannon100x70Firing.png");
	this.load.image("cannonBall", "images/artillery/cannonBall.png");
	this.load.image("castle100x600Both", "images/artillery/castle100x600Both.png");
	this.load.image("castle100x600Left", "images/artillery/castle100x600Left.png");
	this.load.image("castle100x600Mid", "images/artillery/castle100x600Mid.png");
	this.load.image("castle100x600Right", "images/artillery/castle100x600Right.png");
	this.load.image("castle50x600Both", "images/artillery/castle50x600Both.png");
	this.load.image("castle70x40Both", "images/artillery/castle70x40Both.png");
	this.load.image("castle70x40Left", "images/artillery/castle70x40Left.png");
	this.load.image("castle70x40Mid", "images/artillery/castle70x40Mid.png");
	this.load.image("castle70x40Right", "images/artillery/castle70x40Right.png");
	this.load.image("castleBackground", "images/artillery/castleBackground.png");
	this.load.image("doubleJumpControls", "images/artillery/doubleJumpControls.png");
	this.load.image("spikes100x30", "images/artillery/spikes100x30.png");
	this.load.image("spikesWall", "images/artillery/spikesWall.png");
};

/**
 * Initializes the level before the player can start playing. Create any
 * initial platforms or enemies for the level in this function.
 */
TinyDwarf.ArtilleryLevel.prototype.create = function()
{
	// Private variables.
	this._cannonStageNumber = 0;

	// Create the background, HUD, and player.
	this.backgroundTileSprite = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, "castleBackground");
	this.controlsSprite = this.add.sprite(this.game.canvas.width * 0.8, this.game.canvas.height * 0.37, "doubleJumpControls");
	this.hud = this.add.existing(new TinyDwarf.HUD(this.game, this.pauseUnpauseGame, this.playAgain, this.quitGame, this));
	this.player = this.add.existing(new TinyDwarf.Player(this.game, this.game.canvas.width / 2, this.game.canvas.height / 2));

	// Create groups for categorizing friends and enemies.
	this.friendGroup = this.add.group();
	this.enemyGroup = this.add.group();

	// Create a line of spikes on the left side of the screen.
	this.spikesWallSprite = this.enemyGroup.add(this.add.sprite(0, this.hud.statusBarSprite.height, "spikesWall"));

	// Start the physics engine.
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
	this.game.physics.arcade.enable(this.hud.statusBarSprite);
	this.game.physics.arcade.enable(this.controlsSprite);
	this.game.physics.arcade.enable(this.player);
	this.game.physics.arcade.enable(this.friendGroup);
	this.game.physics.arcade.enable(this.enemyGroup);

	// Configure the physics for each game object.
	this.backgroundTileSprite.autoScroll(TinyDwarf.ArtilleryLevel.BACKGROUND_MOVING_SPEED, 0);
	this.hud.statusBarSprite.body.immovable = true;
	this.hud.statusBarCenterText.text = "Special Ability: Tap Space again to double jump!";
	this.player.body.collideWorldBounds = true;
	this.player.maxConsecutiveJumps = 2;
	this.spikesWallSprite.body.immovable = true;
	this.spikesWallSprite.body.setSize(this.spikesWallSprite.width * 0.8, this.spikesWallSprite.height);

	// Configure the controls sprite.
	this.controlsSprite.alpha = 0.75;
	this.controlsSprite.anchor.set(0.5);
	this.controlsSprite.scale.set(0.75, 0.75);
	this.controlsSprite.checkWorldBounds = true;
	this.controlsSprite.outOfBoundsKill = true;
	this.controlsSprite.body.velocity.x = TinyDwarf.ArtilleryLevel.BACKGROUND_MOVING_SPEED * 0.8;

	// Spawn the first and second chunks immediately.
	this.spawnChunk(TinyDwarf.ArtilleryLevel.INITIAL_CHUNK_LAYOUTS[1]);
	this.spawnChunk();

	// Regularly spawn new chunks.
	this.gameTimer = this.time.create(false);
	this.gameTimer.loop(this.game.canvas.width / Math.abs(TinyDwarf.ArtilleryLevel.FOREGROUND_MOVING_SPEED) * 1000, this.spawnChunk, this);
	this.gameTimer.loop(TinyDwarf.ArtilleryLevel.CANNON_FIRE_INTERVAL, this.fireCannons, this);
	this.gameTimer.start();
};

/**
 * Updates the game on each frame. Use this function to check for collisions
 * between the player and platforms/enemies. You could also spawn more
 * platforms or enemies in this function.
 */
TinyDwarf.ArtilleryLevel.prototype.update = function()
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
		var highScore = saveFile.getHighScoreForLevel(TinyDwarf.ArtilleryLevel.LEVEL_NAME);
		var newHighScore = false;

		if(currentScore > highScore)
		{
			saveFile.setHighScoreForLevel(TinyDwarf.ArtilleryLevel.LEVEL_NAME, currentScore);
			highScore = currentScore;
			newHighScore = true;
		}

		this.hud.gameOverScreenText.text = sprintf(sprintf("Your Time: %s\nBest Time: %1$s%%s", TinyDwarf.ArtilleryLevel.HIGH_SCORE_FORMAT), currentScore, highScore, newHighScore ? "\nNew Best Time!" : "");
	}

	// Destroy game objects that have gone out of bounds.
	TinyDwarf.destroyAllInGroupMatching(this.friendGroup, this.gameObjectIsOutOfBounds, this);
	TinyDwarf.destroyAllInGroupMatching(this.enemyGroup, this.gameObjectIsOutOfBounds, this);

	// Update the time on the status bar.
	this.hud.statusBarLeftText.text = sprintf("Time: " + TinyDwarf.ArtilleryLevel.HIGH_SCORE_FORMAT, this.gameTimer.seconds);
};

/**
 * Checks whether a game object (platform, minecart, projectile, etc.) is out
 * of bounds (off the screen) and should be destroyed.
 *
 * @param {Object} gameObject - The game object to check.
 * @returns {Boolean} Whether the game object is out of bounds.
 */
TinyDwarf.ArtilleryLevel.prototype.gameObjectIsOutOfBounds = function(gameObject)
{
	return 
	       gameObject.body.right < 0 ||                  // Off the left side of the screen.
//	       gameObject.body.x > this.game.canvas.width || // Off the right side of the screen.
	       gameObject.body.bottom < 0 ||                 // Off the top side of the screen.
	       gameObject.body.y > this.game.canvas.height;  // Off the bottom of the screen.
};

/** Spawns the next chunk of level. */
TinyDwarf.ArtilleryLevel.prototype.spawnChunk = function(chunkLayout)
{
	if(undefined === chunkLayout)
	{
		do
		{
			chunkLayout = this.rnd.pick(TinyDwarf.ArtilleryLevel.CHUNK_LAYOUTS);
		}
		while(TinyDwarf.ArtilleryLevel.CHUNK_LAYOUTS.length > 1 && this._lastChunkLayout == chunkLayout);

		this._lastChunkLayout = chunkLayout;
	}

	var xOffset = 0;

	this.friendGroup.forEach(function(gameObject)
	{
		xOffset = Math.max(xOffset, gameObject.body.right - 1);
	}, this);

	for(var n = 0; n < chunkLayout.length; n++)
	{
		var spriteImageName = chunkLayout[n][0];
		var spritePositions = chunkLayout[n][1];

		for(var k = 0; k < spritePositions.length; k++)
		{
			var sprite = this.add.sprite(spritePositions[k][0] + xOffset, spritePositions[k][1], spriteImageName);

			this.physics.arcade.enable(sprite);
			sprite.body.immovable = true;
			sprite.body.velocity.x = TinyDwarf.ArtilleryLevel.FOREGROUND_MOVING_SPEED;

			if("spikes100x30" == spriteImageName || "cannon100x70" == spriteImageName)
				sprite.body.setSize(sprite.width * 0.8, sprite.height * 0.8, sprite.width * 0.1, sprite.height * 0.2);

			if("spikes100x30" == spriteImageName)
				this.enemyGroup.add(sprite);
			else
				this.friendGroup.add(sprite);
		}
	}
};

/** Fires all cannons in the level. */
TinyDwarf.ArtilleryLevel.prototype.fireCannons = function()
{
	if(0 == this._cannonStageNumber)
	{
		// Determine which cannons will fire.
		this.friendGroup.forEach(function(gameObject)
		{
			if("cannon100x70" == gameObject.key && this.rnd.realInRange(0, 1) <= TinyDwarf.ArtilleryLevel.CANNON_FIRE_PROBABILITY(this.gameTimer.ms))
				gameObject.loadTexture("cannon100x70Firing");
		}, this);
	}
	else
	{
		// Spawn cannon balls for firing cannons.
		this.friendGroup.forEach(function(gameObject)
		{
			if("cannon100x70Firing" == gameObject.key)
			{
				var cannonBallSprite = this.enemyGroup.add(this.add.sprite(gameObject.x, gameObject.y + 15, "cannonBall"));

				this.physics.arcade.enable(cannonBallSprite);
				cannonBallSprite.body.immovable = true;
				cannonBallSprite.body.velocity.x = TinyDwarf.ArtilleryLevel.CANNON_BALL_VELOCITY;
				cannonBallSprite.body.setSize(cannonBallSprite.width * 0.7, cannonBallSprite.height * 0.7, cannonBallSprite.width * 0.15, cannonBallSprite.height * 0.15);

				gameObject.loadTexture("cannon100x70");
			}
		}, this);
	}

	this._cannonStageNumber = (this._cannonStageNumber + 1) % 2;
};

/**
 * This function is called when the pause/unpause button is pressed. Use this
 * function to show the pause screen and pause/unpause the physics system for
 * any platforms or enemies.
 */
TinyDwarf.ArtilleryLevel.prototype.pauseUnpauseGame = function()
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
	}
	else
	{
		this.gameTimer.resume();
		this.backgroundTileSprite.autoScroll(TinyDwarf.ArtilleryLevel.BACKGROUND_MOVING_SPEED, 0);
	}
};

/**
 * This function is called when the player chooses "Play Again" on the game
 * over screen. This function simply reloads the current game state, which is
 * usually good enough to restart the level.
 */
TinyDwarf.ArtilleryLevel.prototype.playAgain = function()
{
	this.game.transition.to(this.game.state.current);
};

/**
 * This function is called when the player chooses "Quit Game" on the pause or
 * game over screen. This function simply transitions to the main menu state.
 */
TinyDwarf.ArtilleryLevel.prototype.quitGame = function()
{
	this.game.transition.to("MainMenu");
};
