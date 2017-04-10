/** @namespace */
var TinyDwarf = TinyDwarf || {};

/**
 * Constructs a new player object.
 *
 * @class
 * @param {Phaser.Game} game - The game to add the player to.
 * @param {Number} centerX - The initial center X coordinate of the player
 * @param {Number} centerY - The initial center Y coordinate of the player.
 * @param {String} [spriteSheetName=TinyDwarf.Player.DEFAULT_SPRITE_SHEET_NAME] - The name of the sprite sheet to use for the player.
 * @param {String} [spriteSheetName=TinyDwarf.Player.DEFAULT_SPRITE_SHEET_FRAME] - The frame of the sprite sheet to use for the player.
 */
TinyDwarf.Player = function(game, centerX, centerY, spriteSheetName, spriteSheetFrame)
{
	spriteSheetName = spriteSheetName || TinyDwarf.Player.DEFAULT_SPRITE_SHEET_NAME;

	if(undefined === spriteSheetFrame) 
		spriteSheetFrame = TinyDwarf.Player.DEFAULT_SPRITE_SHEET_FRAME;

	// Call the constructor of the super class.
	Phaser.Sprite.call(this, game, centerX, centerY, spriteSheetName, spriteSheetFrame);
	this.anchor.set(0.5);

	// Animations.
	this.animations.add("walkLeft", [0, 1, 2, 3], TinyDwarf.Player.WALKING_ANIMATION_FRAME_RATE);
	this.animations.add("walkRight", [5, 6, 7, 8], TinyDwarf.Player.WALKING_ANIMATION_FRAME_RATE);
	this.animations.add("rollLeft", [9, 19, 10, 20, 11, 21, 12, 22], TinyDwarf.Player.ROLLING_ANIMATION_FRAME_RATE);
	this.animations.add("rollRight", [14, 24, 15, 25, 16, 26, 17, 27], TinyDwarf.Player.ROLLING_ANIMATION_FRAME_RATE);

	// Private properties.
	this._horizontalState = "idle";
	this._verticalState = "idle";
	this._currentConsecutiveJumps = 1;
	this._currentConsecutiveHovers = 0;
	this._jumpingKeyWasReleasedSinceLastJump = true;
	this._hoveringKeyWasReleasedSinceLastHover = true;

	// Public properties.
	this.enableFallingFast = TinyDwarf.Player.DEFAULT_ENABLE_FALLING_FAST;
	this.enableRolling = TinyDwarf.Player.DEFAULT_ENABLE_ROLLING;
	this.maxConsecutiveJumps = TinyDwarf.Player.DEFAULT_MAX_CONSECUTIVE_JUMPS;
	this.maxConsecutiveHovers = TinyDwarf.Player.DEFAULT_MAX_CONSECUTIVE_HOVERS;
	this.maxHoverDuration = TinyDwarf.Player.DEFAULT_MAX_HOVER_DURATION;
};

// General settings for the TinyDwarf.Player class.
TinyDwarf.Player.WALKING_SPEED = 200;
TinyDwarf.Player.ROLLING_SPEED = 350;
TinyDwarf.Player.JUMPING_SPEED = 400;
TinyDwarf.Player.FALLING_ACCELERATION = 425;
TinyDwarf.Player.FALLING_FAST_ACCELERATION = 2500;
TinyDwarf.Player.WALKING_ANIMATION_FRAME_RATE = 10;
TinyDwarf.Player.ROLLING_ANIMATION_FRAME_RATE = 15;

// This variable is for informational purposes only.
// Changing its value does NOT affect the player's physics.
TinyDwarf.Player.JUMPING_HEIGHT = Math.pow(TinyDwarf.Player.JUMPING_SPEED, 2) / (2 * TinyDwarf.Player.FALLING_ACCELERATION);

// Keyboard controls for the TinyDwarf.Player class.
TinyDwarf.Player.WALKING_LEFT_KEY = Phaser.Keyboard.A;
TinyDwarf.Player.WALKING_RIGHT_KEY = Phaser.Keyboard.D;
TinyDwarf.Player.ROLLING_KEY = Phaser.Keyboard.SHIFT;
TinyDwarf.Player.JUMPING_KEY = Phaser.Keyboard.SPACEBAR;
TinyDwarf.Player.FALLING_FAST_KEY = Phaser.Keyboard.S;
TinyDwarf.Player.HOVERING_KEY = Phaser.Keyboard.W;
TinyDwarf.Player.CARRYING_KEY = Phaser.Keyboard.ALT;
TinyDwarf.Player.TELEPORTING_KEY = Phaser.Keyboard.E;

// Default settings for new instances of the TinyDwarf.Player class.
// These can be modified on a per-instance basis (check the constructor).
TinyDwarf.Player.DEFAULT_ENABLE_ROLLING = false;
TinyDwarf.Player.DEFAULT_ENABLE_FALLING_FAST = true;
TinyDwarf.Player.DEFAULT_MAX_CONSECUTIVE_JUMPS = 1;
TinyDwarf.Player.DEFAULT_MAX_CONSECUTIVE_HOVERS = 0;
TinyDwarf.Player.DEFAULT_MAX_HOVER_DURATION = 2000;
TinyDwarf.Player.DEFAULT_SPRITE_SHEET_NAME = "player";
TinyDwarf.Player.DEFAULT_SPRITE_SHEET_FRAME = 5;

// Make TinyDwarf.Player extend from Phaser.Sprite
TinyDwarf.Player.prototype = Object.create(Phaser.Sprite.prototype);
TinyDwarf.Player.prototype.constructor = TinyDwarf.Player;

/** Updates the player's physics based on keyboard input. */
TinyDwarf.Player.prototype.update = function()
{
	if(this.isPaused)
		return;

	// Configure the player's physics when the physics system starts.
	if(!this.body._wasConfiguredByPlayerClass)
	{
		this.body._wasConfiguredByPlayerClass = true;
		this.body.gravity.y = TinyDwarf.Player.FALLING_ACCELERATION;
		this.body.setSize(18, 26, 0, 10);
	}

	// Make the player walk or roll.
	if(this.game.input.keyboard.isDown(TinyDwarf.Player.WALKING_LEFT_KEY))
	{
		if(this.enableRolling && this.game.input.keyboard.isDown(TinyDwarf.Player.ROLLING_KEY))
			this.rollLeft();
		else
			this.walkLeft();
	}
	else if(this.game.input.keyboard.isDown(TinyDwarf.Player.WALKING_RIGHT_KEY))
	{
		if(this.enableRolling && this.game.input.keyboard.isDown(TinyDwarf.Player.ROLLING_KEY))
			this.rollRight();
		else
			this.walkRight();
	}
	else if(this.isWalking)
		this.stopWalking();
	else if(this.isRolling)
		this.stopRolling();
	else
		this.body.velocity.x = 0;

	// Make the player jump, fall fast, or hover.
	if(this._jumpingKeyWasReleasedSinceLastJump && (this._currentConsecutiveJumps < this.maxConsecutiveJumps || this.maxConsecutiveJumps < 0) && this.game.input.keyboard.isDown(TinyDwarf.Player.JUMPING_KEY))
	{
		this._jumpingKeyWasReleasedSinceLastJump = false;
		this._currentConsecutiveJumps++;
		this.jump();
	}
	else if(this._hoveringKeyWasReleasedSinceLastHover && (this._currentConsecutiveHovers < this.maxConsecutiveHovers || this.maxConsecutiveHovers < 0) && this.game.input.keyboard.downDuration(TinyDwarf.Player.HOVERING_KEY, this.maxHoverDuration))
	{
		this._hoveringKeyWasReleasedSinceLastHover = false;
		this._currentConsecutiveHovers++;
		this.hover();
	}
	else if(this.enableFallingFast && this.game.input.keyboard.isDown(TinyDwarf.Player.FALLING_FAST_KEY))
		this.fallFast();
	else if(this.isHovering && !this.game.input.keyboard.downDuration(TinyDwarf.Player.HOVERING_KEY, this.maxHoverDuration))
		this.stopHovering();
	else if(this.isFallingFast)
		this.stopFallingFast();

	// The player needs to release the jumping key before they can jump again.
	if(!this.game.input.keyboard.isDown(TinyDwarf.Player.JUMPING_KEY))
	{
		this._jumpingKeyWasReleasedSinceLastJump = true;

		// Reset jumping when the player touches the ground.
		if(!this.isJumping)
			this._currentConsecutiveJumps = 0;
	}

	// The player needs to release the hovering key before they can hover again.
	if(!this.game.input.keyboard.isDown(TinyDwarf.Player.HOVERING_KEY))
	{
		this._hoveringKeyWasReleasedSinceLastHover = true;

		// Reset jumping when the player touches the ground.
		if(!this.isJumping)
			this._currentConsecutiveHovers = 0;
	}

	// If the player walked off a platform without jumping, then they wasted one jump.
	if(this.isJumping && this._currentConsecutiveJumps < 1)
		this._currentConsecutiveJumps = 1;
};

/**
 * Checks or changes whether the player's motion is paused.
 *
 * @name TinyDwarf.Player.isPaused
 * @type Boolean
 */
Object.defineProperty(TinyDwarf.Player.prototype, "isPaused",
{
	get: function()
	{
		return !this.body || !this.body.enable;
	},

	set: function(isPaused)
	{
		if(this.animations.currentAnim)
			this.animations.currentAnim.paused = isPaused;
		if(this.body)
			this.body.enable = !isPaused;
	},
});

/**
 * Stops the current player animation from running and resets the sprite to the
 * first frame of the animation.
 */
TinyDwarf.Player.prototype.stopCurrentAnimation = function()
{
	if(this.animations.currentAnim)
		this.animations.currentAnim.stop(true);
};

/**
 * Checks whether the player is currently walking.
 *
 * @name TinyDwarf.Player.isWalking
 * @type Boolean
 * @readonly
 */
Object.defineProperty(TinyDwarf.Player.prototype, "isWalking",
{
	get: function()
	{
		return "walking" == this._horizontalState;
	},
});

/** Makes the player continuously walk to the left. */
TinyDwarf.Player.prototype.walkLeft = function()
{
	this.animations.play("walkLeft");
	this.body.velocity.x = -TinyDwarf.Player.WALKING_SPEED;
	this._horizontalState = "walking";
};

/** Makes the player continuously walk to the right. */
TinyDwarf.Player.prototype.walkRight = function()
{
	this.animations.play("walkRight");
	this.body.velocity.x = TinyDwarf.Player.WALKING_SPEED;
	this._horizontalState = "walking";
};

/** Stops the player from walking. */
TinyDwarf.Player.prototype.stopWalking = function()
{
	if(this.isWalking)
	{
		this.stopCurrentAnimation();
		this.body.velocity.x = 0;
		this._horizontalState = "idle";
	}
};

/**
 * Checks whether the player is currently rolling.
 *
 * @name TinyDwarf.Player.isRolling
 * @type Boolean
 * @readonly
 */
Object.defineProperty(TinyDwarf.Player.prototype, "isRolling",
{
	get: function()
	{
		return "rolling" == this._horizontalState;
	},
});

/**
 * Makes the player continuously roll to the left. Also, this drops any
 * currently held items.
 */
TinyDwarf.Player.prototype.rollLeft = function()
{
	this.animations.play("rollLeft");
	this.body.velocity.x = -TinyDwarf.Player.ROLLING_SPEED;
	this._horizontalState = "rolling";
};

/**
 * Makes the player continuously roll to the right. Also, this drops any
 * currently held items.
 */
TinyDwarf.Player.prototype.rollRight = function()
{
	this.animations.play("rollRight");
	this.body.velocity.x = TinyDwarf.Player.ROLLING_SPEED;
	this._horizontalState = "rolling";
};

/** Stops the player from rolling. */
TinyDwarf.Player.prototype.stopRolling = function()
{
	if(this.isRolling)
	{
		this.stopCurrentAnimation();
		this.body.velocity.x = 0;
		this._horizontalState = "idle";
	}
};

/**
 * Checks whether the player is currently jumping but is neither falling fast
 * nor hovering.
 *
 * @name TinyDwarf.Player.isJumping
 * @type Boolean
 * @readonly
 */
Object.defineProperty(TinyDwarf.Player.prototype, "isJumping",
{
	get: function()
	{
		return !this.body.touching.down && !(this.body.collideWorldBounds && this.body.bottom >= this.game.canvas.height);
	},
});

/**
 * Makes the player jump once. Also, this stops the player from falling fast or
 * hovering if the player is currently performing one of those actions.
 */
TinyDwarf.Player.prototype.jump = function()
{
	this.stopFallingFast();
	this.stopHovering();
	this.body.velocity.y = -TinyDwarf.Player.JUMPING_SPEED;
};

/**
 * Checks whether the player is currently falling fast.
 *
 * @name TinyDwarf.Player.isFallingFast
 * @type Boolean
 * @readonly
 */
Object.defineProperty(TinyDwarf.Player.prototype, "isFallingFast",
{
	get: function()
	{
		return "fallingFast" == this._verticalState;
	},
});

/**
 * Makes the player continuously fall fast. Also, this stops the player from
 * hovering if the player is currently performing that action.
 */
TinyDwarf.Player.prototype.fallFast = function()
{
	this.stopHovering();
	this.body.gravity.y = TinyDwarf.Player.FALLING_FAST_ACCELERATION;
	this._verticalState = "fallingFast";
};

/**
 * Stops the player from continuously falling fast if the player is currently
 * performing that action.
 */
TinyDwarf.Player.prototype.stopFallingFast = function()
{
	if(this.isFallingFast)
	{
		this.body.gravity.y = TinyDwarf.Player.FALLING_ACCELERATION;
		this._verticalState = "idle";
	}
};

/**
 * Checks whether the player is currently hovering.
 *
 * @name TinyDwarf.Player.isHovering
 * @type Boolean
 * @readonly
 */
Object.defineProperty(TinyDwarf.Player.prototype, "isHovering",
{
	get: function()
	{
		return "hovering" == this._verticalState;
	},
});

/**
 * Makes the player continuously hover. Also, this stops the player from
 * continuously falling fast if the player is currently performing that action.
 */
TinyDwarf.Player.prototype.hover = function()
{
	this.stopFallingFast();
	this.body.velocity.y = 0;
	this.body.gravity.y = 0;
	this._verticalState = "hovering";
};

/**
 * Stops the player from continuously hovering if the player is currently
 * performing that action.
 */
TinyDwarf.Player.prototype.stopHovering = function()
{
	if(this.isHovering)
	{
		this.body.gravity.y = TinyDwarf.Player.FALLING_ACCELERATION;
		this._verticalState = "idle";
	}
};
