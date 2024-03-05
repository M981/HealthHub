using System;

class Parser
{
	private readonly CommandLibrary commandLibrary; 

	public Parser()
	{
		commandLibrary = new CommandLibrary();
	}

	public Command GetCommand()
	{
		Console.Write("> "); 

		string word1 = null;
		string word2 = null;

		string[] words = Console.ReadLine().Split(' ');
		if (words.Length > 0) { word1 = words[0]; }
		if (words.Length > 1) { word2 = words[1]; }

		if (commandLibrary.IsValidCommandWord(word1)) {
			return new Command(word1, word2);
		}

		return new Command(null, null);
	}

	public void PrintValidCommands()
	{
		Console.WriteLine("Je kan de volgende commando's uitvoeren:");
		Console.WriteLine(commandLibrary.GetCommandsString());
	}
}
