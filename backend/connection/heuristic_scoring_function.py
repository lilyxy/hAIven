def getHuristicAnalysis(journalSentiment, moodSentiment, audioSentiment){
    """ currently hard coded to trigger the chat bot, 
        will eventually use RNN to predict when to trigger the chatBot
    """
    if (journalSentiment.count('sad') == 3)
        return True
    elif (moodSentiment.count('sad') == 3)
        return True
    elif (audioSentiment.count('sad') == 3)
        return True
}