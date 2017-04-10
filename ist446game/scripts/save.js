/** @namespace */
var TinyDwarf = TinyDwarf || {};

/**
 * Creates a new SaveFile object with the specified name. If the named save
 * file already contains data, then that data is loaded into memory and is
 * accessible via this object's instance methods.
 *
 * NOTE: Do not directly create an instance of this class. Use the static
 * method {TinyDwarf.SaveFile.getInstance} to get the shared instance of this
 * class.
 *
 * @class
 * @param {String} name - The name of the save file.
 */
TinyDwarf.SaveFile = function(saveFileName)
{
	if(!store.enabled)
		alert("Local storage is not supported by your browser. Please disable \"Private Mode\" or upgrade to a modern browser to save your game's progress.");

	this._name = saveFileName || TinyDwarf.SaveFile.DEFAULT_SAVE_FILE_NAME;
	this._data = store.get(this._name) || {};
};

// Settings for the save file.
TinyDwarf.SaveFile.DEFAULT_SAVE_FILE_NAME = "saveFile";
TinyDwarf.SaveFile.DEFAULT_SAVE_FILE_DATA = {FallingFastLevelIsLocked: false};
TinyDwarf.SaveFile.DEFAULT_HIGH_SCORE = 0;
TinyDwarf.SaveFile.LEVELS_ARE_LOCKED_BY_DEFAULT = true;

// The singleton instance of the SaveFile class.
TinyDwarf.SaveFile._instance = null;

/**
 * The SaveFile class is intended to be used as a singleton. This static method
 * gets the shared instance of the SaveFile class.
 *
 * @static
 * @returns {TinyDwarf.SaveFile} The shared instance of the SaveFile class.
 */
TinyDwarf.SaveFile.getInstance = function()
{
	if(!TinyDwarf.SaveFile._instance)
		TinyDwarf.SaveFile._instance = new TinyDwarf.SaveFile();

	return TinyDwarf.SaveFile._instance;
};

/**
 * Gets a named value from the save file. If the named value does not exist,
 * then the specified default value will be returned.
 *
 * @private
 * @param {String} valueName - The name of the value.
 * @param {Object} defaultValue - The default value to return if the named value is not found in the save file.
 * @returns The value or the specified default value if the valueName is not found in the save file.
 */
TinyDwarf.SaveFile.prototype._getValue = function(valueName, defaultValue)
{
	if(valueName in this._data)
		return this._data[valueName];

	if(valueName in TinyDwarf.SaveFile.DEFAULT_SAVE_FILE_DATA)
		return TinyDwarf.SaveFile.DEFAULT_SAVE_FILE_DATA[valueName];

	//console.log(sprintf('The named value "%s" was not found in TinyDwarf.SaveFile.DEFAULT_SAVE_FILE_DATA', valueName));
	return defaultValue;
}

/**
 * Sets a named value in the save file.
 *
 * @private
 * @param {String} valueName - The name of the value.
 * @param {Object} value - The value to set.
 */
TinyDwarf.SaveFile.prototype._setValue = function(valueName, value)
{
	this._data[valueName] = value;
	store.set(this._name, this._data);
}

/**
 * Gets a high score from the save file.
 *
 * @param {(Number|String)} levelIdentifier - The number or name of the level.
 * @returns {Number} The high score for the level or {TinyDwarf.SaveFile.DEFAULT_HIGH_SCORE} if there is no high score recorded for this level.
 */
TinyDwarf.SaveFile.prototype.getHighScoreForLevel = function(levelIdentifier)
{
	return this._getValue(sprintf("%sHighScore", levelIdentifier), TinyDwarf.SaveFile.DEFAULT_HIGH_SCORE);
};

/**
 * Saves a high score to the game's save file.
 *
 * @param {(Number|String)} levelIdentifier - The number or name of the level.
 * @param {Number} highScore - The high score for the level.
 */
TinyDwarf.SaveFile.prototype.setHighScoreForLevel = function(levelIdentifier, highScore)
{
	this._setValue(sprintf("%sHighScore", levelIdentifier), highScore);
};

/**
 * Checks whether the specified level is locked. Later levels of the game will
 * start out locked, and must be unlocked by completing certain challenges in
 * the game.
 *
 * @param {(Number|String)} levelIdentifier - The number or name of the level.
 * @returns {Boolean} A boolean indicating whether the level is locked or {TinyDwarf.SaveFile.LEVELS_ARE_LOCKED_BY_DEFAULT} if the locked status hasn't been set yet for this level.
 */
TinyDwarf.SaveFile.prototype.levelIsLocked = function(levelIdentifier)
{
	return this._getValue(sprintf("%sIsLocked", levelIdentifier), TinyDwarf.SaveFile.LEVELS_ARE_LOCKED_BY_DEFAULT);
};

/**
 * Changes the locked status of a level, and saves that change to the game's
 * save file.
 *
 * @param {(Number|String)} levelIdentifier - The number or name of the level.
 * @param {Boolean} isLocked - Whether the level should be locked.
 */	
TinyDwarf.SaveFile.prototype.setLevelIsLocked = function(levelIdentifier, isLocked)
{
	this._setValue(sprintf("%sIsLocked", levelIdentifier), isLocked);
};
