/** @namespace */
var TinyDwarf = TinyDwarf || {};

/**
 * Takes an input array of probabilities (and their corresponding indexes) and
 * randomly returns an index number based on those probabilities.
 *
 * @param {Number[]} probabilityOfEachIndex - The probability for each index number.
 * @returns {Number} A random index number from the input array or -1 if an error occurs.
 */
TinyDwarf.randomIndex = function(probabilityOfEachIndex)
{
	var randomNumber = Math.random();

	for(var index = 0; index < probabilityOfEachIndex.length; index++)
	{
		randomNumber -= probabilityOfEachIndex[index];

		if(randomNumber < 0)
			return index;
	}

	return -1;
};

/**
 * Add header text to the game. Header text is simply the large text that is
 * used for the title of each menu.
 *
 * @param {Phaser.Game} game - The game to add the text to.
 * @param {Number} centerX - The X coordinate to position the text at.
 * @param {Number} centerY - The Y coordinate to position the text at.
 * @param {String} text - The string of text.
 * @param {Number} fontSizeInPixels - The size of the font in pixels.
 * @param {String} [horizontalAlignment=center] - The horizontal alignment for the text (left, right, or center).
 * @param {Phaser.Group} [group=undefined] - The Phaser group to add the text to.
 * @returns {Phaser.Text} The text object that was added to the game.
 */
TinyDwarf.addHeaderText = function(game, centerX, centerY, text, fontSizeInPixels, horizontalAlignment, group)
{
	horizontalAlignment = horizontalAlignment || "center";

	var stylesForHeaderText =
	{
		horizontalAlignment: horizontalAlignment,
		font: "bold " + fontSizeInPixels + "px arial",
		fill: "white",
		strokeThickness: Math.pow(fontSizeInPixels, 0.7),
	};

	var headerText = game.add.text(centerX, centerY, text, stylesForHeaderText, group);
	headerText.anchor.set(0.5);

	return headerText;
};

/**
 * Add a clickable button to the game and place text on top of the button.
 *
 * @param {Phaser.Game} game - The game to add the button and text to.
 * @param {Number} centerX - The X coordinate to position the center of the button and text at.
 * @param {Number} centerY - The Y coordinate to position the center of the button and text at.
 * @param {String} text - The string of text.
 * @param {Object} callback - The function to call each time the button is clicked.
 * @param {Object} callbackContext - The context to invoke the callback in (if the callback is an instance method, provide an instance of the object here).
 * @param {Phaser.Group} [group=undefined] - The Phaser group to add the button and text to.
 * @returns {Object} An object containing the Phaser button object (the .button property) and the Phaser text object (the .text property).
 */
TinyDwarf.addButtonWithText = function(game, centerX, centerY, text, callback, callbackContext, group)
{
	var stylesForButtonText =
	{
		font: "bold 24px arial",
		fill: "black",
	};

	var button = game.add.button(centerX, centerY, "button", callback, callbackContext, 1, 0, 2, 0, group);
	var text = game.add.text(centerX, centerY, text, stylesForButtonText, group);

	button.anchor.set(0.5);
	text.anchor.set(0.5);

	return {button: button, text: text};
};

/**
 * Destroys all children of a group for which the callback function returns
 * true. Each destroyed child is also removed from the group. Note that the
 * callback function is passed the game object as its first argument.
 *
 * @param {Phaser.Group} group - The group to search through.
 * @param {Object} callback - The callback function.
 * @param {Object} callbackContext - The context of the callback function.
 */
TinyDwarf.destroyAllInGroupMatching = function(group, callback, callbackContext)
{
	var childrenToDestroy = [];

	group.forEach(function(child)
	{
		if(callback.call(callbackContext, child))
			childrenToDestroy.push(child);
	});

	for(var child; child = childrenToDestroy.pop();)
	{
		if(child.body)
			child.body.destroy();

		//console.log("destroyed: " + child.key);
		group.remove(child, true);
	}
};
