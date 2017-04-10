window.onload = function()
{
	var game = new Phaser.Game(800, 600, Phaser.CANVAS);

	// Create game states for each menu.
	game.state.add("BootMenu", TinyDwarf.BootMenu);
	game.state.add("MainMenu", TinyDwarf.MainMenu);
	game.state.add("SelectLevelMenu", TinyDwarf.SelectLevelMenu);
	//game.state.add("ControlsMenu", TinyDwarf.ControlsMenu);

	// Create game states for each level.
	for(var n = 0; n < TinyDwarf.SelectLevelMenu.LEVEL_CLASS_NAMES.length; n++)
	{
		var levelClassName = TinyDwarf.SelectLevelMenu.LEVEL_CLASS_NAMES[n];
		game.state.add(levelClassName, TinyDwarf[levelClassName]);
	}

	// Load the boot menu state.
	game.state.start("BootMenu");
};
