using System.Collections.Generic;

class CommandLibrary
{
	private readonly List<string> validCommands;

	// Constructor - initialise the command words.
	public CommandLibrary()
	{
		validCommands = new List<string>();

		validCommands.Add("help");
		validCommands.Add("go");
		validCommands.Add("quit");
		validCommands.Add("look");
		validCommands.Add("status");
		validCommands.Add("take");
		validCommands.Add("drop");
		validCommands.Add("use");
	}

	// Check whether a given string is a valid command word.
	// Return true if it is, false if it isn't.
	public bool IsValidCommandWord(string instring)
	{
		for (int i = 0; i < validCommands.Count; i++)
		{
			if (validCommands[i] == instring)
			{
				return true;
			}
		} 
		//  string not found
		return false;
	}

	// returns valid commands
	public string GetCommandsString()
	{
		string str = "";
		for (int i = 0; i < validCommands.Count; i++)
		{
			str += validCommands[i];
			if (i < validCommands.Count - 1)
			{
				str += ", ";
			}
		}
		return str;
	}
}
