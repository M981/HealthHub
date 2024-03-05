class Command
{
	public string CommandWord { get; init; }
	public string SecondWord { get; init; }

	public Command(string first, string second)
	{
		CommandWord = first;
		SecondWord = second;
	}

	
	// Return true if this command was not understood.
	public bool IsUnknown()
	{
		return CommandWord == null;
	}

	
	// Return true if the command has a second word.
	public bool HasSecondWord()
	{
		return SecondWord != null;
	}
}
