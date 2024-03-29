from GameEnvironment.gameEngine.gameEnvironment import *
import unittest





class test_isViolateGameLaw(unittest.TestCase):
    def test_isVoidCard_should_return_True_if_player_does_not_has_same_suite_card_as_first_card(self):
        p1 = player("p1",0)
        p2 = player("p2",1)
        p3 = player("p3",2)
        p4 = player("p4",3)
        game = Game(p1,p2,p3,p4)
        game.setGameScore()
        game.provideCard()
        game.determineBidWinner()
        game.setFriendCard()
        game.identifyTeam()
        Card1 = card("Hearts",5,10)
        cardList = [card("Spades",5,10),card("Clubs",5,10)]
        self.assertTrue(game.isVoidCard(cardList,Card1,1))
    def test_isVoidCard_should_return_false_if_player_has_same_suite_card_as_first_card(self):
        p1 = player("p1",0)
        p2 = player("p2",1)
        p3 = player("p3",2)
        p4 = player("p4",3)
        game = Game(p1,p2,p3,p4)
        game.setGameScore()
        game.provideCard()
        game.determineBidWinner()
        game.setFriendCard()
        game.identifyTeam()
        Card1 = card("Diamonds",5,10)
        cardList = [card("Hearts",5,10),card("Diamonds",5,10)]
        self.assertFalse(game.isVoidCard(cardList,Card1,1))
   

   

# Run the tests
if __name__ == '__main__':
    unittest.main()