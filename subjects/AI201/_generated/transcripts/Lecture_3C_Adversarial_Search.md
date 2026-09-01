# Transcript — Lecture_3C_Adversarial_Search.mp4

_Auto-transcribed with Whisper (mlx-community/whisper-large-v3-turbo) on 2026-09-01. May contain recognition errors; repeated segments (silence hallucinations) were collapsed. Verified against a second independent Whisper pass: identical coverage (100%), no divergent windows, no gaps >45 s._

**[00:00:00]** Today we will talk about adversarial search. So in adversarial search we are interested in acting in an environment where there are adversaries. So we will cover the following topics. We will discuss what game playing is in artificial intelligence.

**[00:00:35]** Then we will talk about Minimax, the most basic game playing algorithm in AI. Then we will talk about the variant of Minimax called alpha beta pruning. And then we will talk about heuristic alpha beta research and proceed to the Monte Carlo research and at the end we'll discuss a little stochastic games.

**[00:01:09]** So in AI, quite often, especially when we talk about search, we use board games. games are interesting because they offer pure abstract competition. There are, of course, less abstract games such as robot soccer, which is also of great interest in artificial intelligence.

**[00:01:42]** Now, game playing is an idealization of worlds in which there are hostile agents, and these agents act so as to diminish one's well-being. In AI, games are very useful because they help us better understand how to act in complex as well as uncertain domains. There are two general types of games studied in AI.

**[00:02:15]** The first type is the game of perfect information. When you say game of perfect information, the knowledge that is available to each player is the same. What player A sees is also what player B sees. For example, chess or go. There are also games of imperfect information where the player does not see the hand, for example, of the other player, such as in poker.

**[00:02:59]** So in AI, when we say perfect information, we mean fully observable, fully observable environment. And since we will be talking about games, board games especially, when we say move, we mean action. And quite often, the term position is synonymous with state.

**[00:03:32]** There are single agent games as well as multi-agent games. And for two-person games, such as chess, the players alternate their moves. In multi-agent games, it's possible for the agents to form teams and collaborate in order to be their adversaries.

**[00:04:04]** Now in games, the presence of the opponent introduces uncertainty since the agent doesn't know what the opponent is going to do. In general, uncertainty can arise from an incomplete knowledge of the environment, such as a robot navigating in an unknown environment, or in an environment with an incomplete map, It could also arise from the presence of an opponent that

**[00:04:39]** acts as to divert the agent from reaching the goal. And the third form of uncertainty comes from computational constraints. The agent simply does not have enough time to calculate the exact consequences of each move. Games also have time limits, and therefore execution efficiency is very important.

**[00:05:13]** And this reality that you have to make a move within a certain number of minutes or number of seconds is important because these games have spurred the development of anytime algorithms. You have said that an anytime algorithm is an algorithm that can be interrupted anytime. And if you give the algorithm more time to process, it will give, it will return a higher

**[00:05:49]** quality of a solution. All games are contingency problems because the game playing agent must calculate a whole tree of actions where each branch deals with what the opponent will do. So how do we deal with the time limit? We use techniques that allow us to ignore portions of the search tree that will make no difference to the final choice and we will see how this is done. And therefore we need

**[00:06:25]** heuristic evaluation functions that will measure how good a position is without doing a complete search. So just like what we discussed last time where we had a heuristic function, The purpose of the heuristic function in games is the same, to reduce the search space that will be explored. We have to be aware of the so-called base level and meta level trade-off.

**[00:07:04]** For many heuristic search problems, the heuristic function can be so complicated that computing that function requires a long time. Why is that important? Because time spent in calculating a complicated heuristic function takes away time for expanding nodes. And time spent evaluating the heuristic function

**[00:07:35]** in order to select a node for expansion must therefore be recovered by a corresponding reduction in the size of the search space to be explored. So we distinguish here two levels. The base level activity, which is the effort spent by the algorithm trying to solve the problem versus the meta-level activity, which is the effort spent in deciding what to do.

**[00:08:07]** There is, therefore, a base level, meta level trade-off where the time spent at the meta level must be recovered by corresponding reductions in the amount of time required to solve the problem at the base level. You will see this later. Let's talk about two-person games.

**[00:08:37]** And let's talk about perfect decisions in two-person games. So we can model the two-person game as following. It's a problem consisting of an initial state, a set of operators, a goal test, a path cost function. So again, in games, we have the following. We need to define the initial state as of 0,

**[00:09:10]** which is usually the board configuration. You also need to define whose turn it is to move at the initial state. So for chess, it's always, by default, white. So it's white. So that's the rule in chess. and we have also the to move function which accepts s the state s as input basically

**[00:09:46]** this function returns the player whose turn it is to move for state S. For a given state S, who will move? Which player will move? We also have the actions, which is a function of S. This is the set of legal moves in state S. Then we have the terminal test,

**[00:10:19]** is terminal S, that checks whether game is over. And a game is over when the terminal state has reached its goal. And finally, we have a utility function or objective function or payoff function that defines the numeric value

**[00:10:49]** for the final outcome of the game to the player peak. Let's talk about minimax. Minimax is an algorithm that allows us to decide which move to take.

**[00:11:20]** So there are two players. For Minimax, these are Max and Bin, and we want Max to win. Player max tries to maximize the value of a payoff function, while min tries to minimize the value of the payoff function. And it is always at the start, max's turn to move.

**[00:11:56]** Max will try to find a strategy that will lead to a winning state regardless of what min does. And let us first consider the ideal case where there is no time limit. And when we say there is no time limit, we can compute the entire search tree all the way to the end until we reach the terminal states. This is the minimax tree, search tree for tic-tac-toe.

**[00:12:33]** This is a very familiar game. So let's define the ply or move. When we say one move, we refer to two half moves. one by each player. So a player performs a half move. And when we say one move or one ply, it consists of one cycle. For Tic-Tac-Toe, the game three is quite small. They're just

**[00:13:14]** 362,000 plus terminal nodes and 5,000 plus distinct states. And this is very small compared to that of chess where the total number of nodes could reach up to 10 raised to the 40. So here we have the utility values.

**[00:13:45]** When it's 0, that means it's a tie. When it's 1, that means that Max won. When it's negative 1, it means that Max lost the game. The minimax optimal strategy is the following. If it is the turn of max to move, we select the action that maximizes the minimax result.

**[00:14:25]** And if it is mince move, we select the action that minimizes the minimax result. You will see what this means. If the state is a terminal state, then the minimax function returns the utility value. Minimax assumes that the opponent will play perfectly.

**[00:14:57]** For minimax, the depth, if the maximum depth of a tree is m and there are b legal moves for each node, the time complexity of minimax is of order b raised to the m. And we've seen this. And this means that the algorithm is impractical because it is exponential. in the depth of the tree. So space complexity is linear in M and B since minimax is depth-versed.

**[00:15:40]** This is how minimax works. First we generate the entire game tree up to the terminal states. Then we compute the payoff of each terminal state using the utility function. And we use the payoff values of the terminal states to determine the payoff values of the nodes that are one level higher up the search tree.

**[00:16:12]** So the payoff for a higher level node is the lowest payoff of the node's children if it is minstern to move or the highest payoff if it is max turn to move. We continue backing up the values from the leaf nodes towards the root one level at a time. and when we have breached the root node,

**[00:16:43]** the branch that leads to the highest payoff should be chosen by max. For example, here we have a very simple game tree. These are the values of the terminal states. So remember, we want to maximize these values. So here it's min's turn to move. Okay. And min, as we know, tries to minimize the payoff,

**[00:17:17]** while max will try to maximize the payoff. So what happens here is that min expands node B, and the utility values are 3, 12, and 8. And since min chooses the minimum, it will have this value 3 here. And similarly here, for this node, the minimum value is 2.

**[00:17:50]** And for this node, the minimum value is likewise 2. Now for A, it tries to maximize the available values. So the maximum value of 3, 2, and 2 is 3. So therefore, the correct action for max is action A1.

**[00:18:23]** Now for multiplayer games, instead of just one value that has to be considered, here we have each node returning a vector of values. So here you have this vector of values here. So for player C, the value for C is 6. right, 6 versus 3. So since C is trying to maximize its values it will

**[00:19:02]** choose this move because it will get a value of 6 instead of just 3. While here it also choose to choose this action since it will get a value of 2 rather than one. And here it will choose this action, while here it will choose this action.

**[00:19:36]** Similarly for B, B will be looking at the second value. So therefore the correct action is this for B and for this node the correct action is this. And now for A it will maximize the first element of the vectors it will choose this this action. So this is how

**[00:20:10]** how you use Minimax for multiplayer games. So the backup value of a node n is the utility vector of the successor node with the highest value for the player choosing at node a. Let's talk about chess.

**[00:20:47]** Chess is a game of perfect information. displayed on an eight by eight checkerboard for its initial state the chessboard has to be oriented in such a way that the white corner is to the right of the player then the white queen is on white the black queen is in black the rooks are on the corner squares then you have two knights followed by two bishops. And on second row, you have the pawns.

**[00:21:25]** Now the actions need to be defined as well. The pawn can only move one, move forward. Can only move forward. For the first advance, it has the option of moving one or two squares forward but thereafter it can only move one square at a time. It can capture diagonally but only forwards. Now as for the rope, it's allowed actions or legal actions are move column

**[00:22:06]** wise or row wise to any distance unless blocked by another piece. Bishop can move diagonally to any distance again unless blocked, while the knight can undergo L movements. The queen can move row wise, column wise, diagonally to any distance unless blocked. The king can move one step at a time. So all pieces except the pawn capture in

**[00:22:41]** their normal direction of movement. And it is not obligatory to capture your opponent's piece, but the objective is to capture the opponent's king. Imperfect decisions. Unlike minimax where there's no time limit for most games or for practically all games, there is a time limit and there's also limited memory space.

**[00:23:16]** Now let's think about how humans play games. Humans do not analyze all the way to the end. humans only look a few moves ahead and then try to evaluate the non-terminal position and back up the value that we have formed. But minimax still applies. It's the same

**[00:23:47]** principle as minimax. So we can modify minimax in the following way. We replace the utility function by an evaluation function. What is an evaluation function? It is a function that returns as an estimate of the payoff value. They also modify minimax by replacing the terminal test by a cutoff test. So we only can think, say, four moves forward.

**[00:24:24]** So after four moves, we don't consider any more the possibilities after four moves. So we consider all the possible moves, perhaps, the possible four moves, or most of those possible moves. Minimax computes the optimal playing strategy, but does so inefficiently since it generates

**[00:24:56]** a complete tree and then computes and backs up the static evaluation function. Can we do better? The alpha beta pruning is a modification of minimax that allows the non-consideration of portions of the trees that are not worth looking into.

**[00:25:28]** So the idea is the following. Here we have a game tree where the value of the root is computed as follows. Basically, we will be maximizing the minimum values of 3, 12, and 8, 14, 5, and 2, and 2 and some unknown values here.

**[00:26:01]** And you will see that whatever the values of these are, the minimax value at the root, the backup value at the root remains 3. It's the same. It's going to change. So that is the idea of minimax. Sorry. That is the idea of alpha beta pruning. we can prune the tree because this part of the tree is now irrelevant to the decision of

**[00:26:38]** of your agent so let's have an example suppose you're here and you have evaluated the backup value here it's 0.03 and then you have the option of attacking his queen and then after that you have a queen trade and

**[00:27:09]** and you look at the evaluation function underneath under that and you have minus 0 minus 0.05 and minus 0.1. So what is the conclusion here? Well, since we already have 0.03 here,

**[00:27:42]** okay, and we see this negative, okay, and this minus also negative even more negative than this then we will say that there's no more point in examining the other node okay so so we can generalize that and say that

**[00:28:13]** if a player has a choice in moving to node N and if the player has a better choice either at the same level or at any point higher up in the tree then the player will never move to N therefore we can prune the tree at node N So here, this is better than this, and this is also better than this.

**[00:28:53]** Therefore, we can prune this, the tree, the subtree that follows after this. So in alpha beta pruning, we define two values. the value of the best, that is the highest value choice we have found so far at any choice point along the path to max.

**[00:29:25]** And beta, the value of the best, that is the lowest value choice we have found so far at any choice point along the path to min. Alpha-beta search prunes the remaining branches at the node as soon as the value of the current node is known to be worse than the current alpha or beta for min or max or min respectively. We will also observe that alpha-beta pruning is highly dependent

**[00:29:59]** on the order in which the states are examined. So to fully take advantage of alpha beta pruning, it is best that we examine first the successors that are likely to be best. And when there is perfect ordering among these successors, the number of the branching factor

**[00:30:34]** will be reduced from m over 2, from m rather, to m over 2. For random ordering, the branching factor is of order 3m over 4. So for chess, the average effective branching factor is around 35. Now, if you apply alpha beta pruning in perfect ordering,

**[00:31:11]** that gets reduced to square root of 35 or around 6. So that's the effective branching factor for chess. Reduction from 35 to 6. And that is a big, big reduction. So how do you order the successors? You first consider the captures, then the threads, then the forward moves, and the backward moves.

**[00:31:43]** In doing so, you will reduce the number of nodes that will be expanded by alpha beta pruning for chess. So here's the algorithm. It is similar to minimax, except that bounds are maintained in the variables alpha and beta, which are used to cut off the search when a value is outside the bounds.

**[00:32:17]** So here we have your, this part here, which basically gives us a value, a window of alpha and beta. If the value is outside that alpha beta window,

**[00:32:47]** then we can actually prune the tree. So we can improve on the alpha beta research by making use of the heuristic evaluation function. Here, the heuristic evaluation function returns an estimate of the expected utility for state S for player P.

**[00:33:22]** And at the terminal states, the value of the evaluation function is equal to the utility of the utility for player P. For non-terminal states, is somewhere between somewhere between the value for the winning utility and the losing utility values.

**[00:33:58]** And furthermore we replace the E-terminal state with the cutoff, this cutoff function. Let's now talk further about chess. So as I've said the average branching factor is 35 and if you use alpha beta pruning it gets reduced to around six. There are about 50 moves for a typical chess game which means that they're about 35 raised to the 100 nodes to consider.

**[00:34:38]** So what are the evaluation functions for chess? We can look at the material value as well as the good positional features. So for the material value, we assign a value for each piece. For the pawn, for example, we assign a value of 1. For the knight or bishop, we assign 3. For rook 5, for queen 9.

**[00:35:08]** And then for good positional features, like a good pawn structure, where we can use a pawn to defend another pawn, and we add a value of 0.5. When there's an isolated pawn, that means no pawns on adjacent files, we subtract a value of 1 third. And then the other things like control of the center of the board, how protected is the king, and so on and so forth. So all these values are added together

**[00:35:43]** to form your evaluation function. Now the performance of the chess program depends greatly on the quality of the evaluation function. And when we say quality, we mean how close the evaluation function is to the payoff value. We also need to think about the trade-off between the accuracy of the evaluation function and its time cost.

**[00:36:17]** If it's going to take a lot of time computing the evaluation function because it is very complicated, then probably it's better to come up with a simpler evaluation function and spend the time evaluating nodes. Computing the material advantage is fast because the value of a piece can be judged independently of the other pieces. We can use a weighted linear function for that.

**[00:36:50]** But computing the positional feature is time-consuming. So this, for example, for an isolated pond, this will require that the position of the other points will be considered. And for this, we need a nonlinear evaluation function. So a linear evaluation function will have the following form. Here, F1 are the features. And we weigh each feature and sum them up.

**[00:37:22]** There is, however, a strong assumption here that the features are independent of each other. For the nonlinear evaluation function, a sophisticated function approximator, such as a neural network, can be used. Cutting off search in trees, in chess. When do we cut off search?

**[00:37:53]** We could use a depth limit that's fixed, or we could use an iterative deepening search, which is an anytime algorithm. So when time is up, we return what is the best solution that we have at hand. That is the advantage of the iterative deepening search.

**[00:38:24]** Now for chess, we have the so-called horizon effect. This horizon effect arises from the fact that the evaluation function only gives estimates of the payoff function. It's not exact. So this arises when there is a threat that appears unavoidable. So if such happens, then the program will just think of some useless moves, such as a nuisance check that could push over the threat or push out the threat over the horizon instead of dealing directly with the threat.

**[00:39:18]** So that is what could happen. when there is that threat. The horizon effect, since we know that the number of moves is only limited up to, say, 14 moves, as in the case of Deep Blue, then after 14 moves, the threat is already out of the horizon because the program or the algorithm is saying that

**[00:39:49]** a noise science check or some useless moves could push that threat over the horizon. So it is difficult to distinguish between a move that really neutralizes the threat and one that just pushes the threat over the horizon. To solve this, we have a secondary search where we examine the search space beneath the apparently best move to see if something has in fact been pushed beyond the horizon so that an alternative move can be chosen.

**[00:40:34]** or if you could find a move that is good for your opponent then look at this move early on when considering your opponent's action it's called the killer heuristic or you can you can combine both one and two but still not all instances of the horizon effect the horizon problem can be avoided. Another consequence of the fact that evaluation functions are not exact,

**[00:41:13]** are just estimates, is that some portions of the game tree are hotter than others. And this means that a move that leads to lengthy exchanges of pieces should be investigated with greater depths than others, because these portions of the search tree are characterized by rapidly changing values of the evaluation function.

**[00:41:45]** When there is such rapid change in the evaluation function, the values of the function become unreliable. and we can only rely on the evaluation function when its value is slowly changing from ply to ply. So what we can do is to perform a quiescent search where we expand further non-quiescent positions

**[00:42:20]** until quiescent positions are reached. So quiescent positions are those positions where the value of the evaluation function is not changing too fast or too much. And another trick is to use a singular extension search. Here, a particular node could be examined further, which means to greater depth. if one of the opponent's moves leads to a result vastly preferable to him

**[00:42:52]** than all other options. And since this is a forced move in some sense, the effective branching factor is actually small. So this is believed to be the reason why Deep Thought outperformed its predecessor, High Tech, the use of the singular extension switch. Alpha-beta pruning prunes any node that is provably outside the current alpha-beta window.

**[00:43:27]** Now a variant of alpha-beta pruning uses the probabilistic cut or prob cut where you have a forward pruning version of this algorithm, the alpha-beta pruning, which prunes nodes that are probably outside the window. So here we're sure that the value of the node is definitely outside the current alpha beta window,

**[00:43:59]** so we prune the node. But here it's probable, it's highly probable that the value of the node is outside the current window, so we can make use of this to cut off search. The probability is computed through a shallow search to compute the backup value of a node and using past experience to estimate how likely it is

**[00:44:29]** that the node score is outside the alpha beta window. For chess, we can also use a lookup table for opening and end games. So imagine if you're just on move one or move two, you have to search all the way to 14 moves. Why not rely on human experts with known openings

**[00:45:03]** like the Sicilian Defense, the French Defense, Rui Lopez Defense, and so on. So we can make use of the openings, store all these openings in the database, and just make use of them. For ending games, for end games, we have, for example, rules for king and rook versus king, or king, bishop, knight, versus king and make use of these rules to speed up computation.

**[00:45:40]** There's no need to, again, generate a search tree if we find that the configuration is king and rook versus king, or king, bishop, knight versus king configuration. However, these tables could be very large. For example, for the king-bishop-knight versus king

**[00:46:13]** endings, the number of entries could be around 400 trillion. Go. Go is a game of perfect information played on a 19 by 19 board with stones of two colors. And the objective of Goa is to play stones so that they surround those of your opponent.

**[00:46:43]** For Goa, the best move is selected more on the basis of how the position looks rather than on intricate tactical analysis. We also note that the difference between two Go players can be measured precisely. This means that a Go player who beats another by a certain margin in one game is very likely

**[00:47:15]** to beat the other player by nearly identical margin in the subsequent games. Go has motivated the development of the Monte Carlo tree search algorithm. For Go, the branching factor is very large, greater than 360. And if we use alpha beta pruning, we can only search up to 4 to 5 lie.

**[00:47:49]** And furthermore, it is difficult to define a good evaluation function for Go because the material value is not a good indicator and most positions are in flux until the end game. So for the Monte Carlo Tree Search algorithm, instead of a heuristic evaluation function,

**[00:48:20]** the value of a state is estimated as the average utility over a number of simulations of a complete game, of complete games starting from the current point, the current state. When we say simulation or play out, we choose moves first for one player and for the other player until a terminal position is reached.

**[00:48:53]** Moves are chosen randomly during play out, but then we know that that isn't really a very good way. We have a play out policy that bias the moves towards good ones. And this play out policy is learned from self-play using neural networks. For a given play out policy, from what positions do we start the play outs?

**[00:49:32]** How many playouts do we perform per position? In the pure Monte Carlo search, we perform n simulations starting from the current state and track which of the moves have the highest win percentages. there's also a selection policy that focuses on exploration of states that have fewer playouts

**[00:50:03]** and exploitation of states that have done, that have gone all the way, that sorry, that have done well, that have done well in the past playouts. So this is an example of one decarlic research. So just like the other methods, it maintains a search tree and grows it on each iteration.

**[00:50:41]** So it does four steps, the selection step, expansion, simulation, and back propagation. So here we have this node here, which basically has a value of 37 out of 100. This is the number of wins that the node has backed up.

**[00:51:20]** So if it does, all the other nodes have similar values. So for this node, it has 60 out of 79 wins, 1 out of 10, 2 out 11, and so on. So here, among these four nodes, we know that we should choose this because it has 27 wins out of 35.

**[00:51:57]** So we have chosen this node and we do a simulation. We perform a play out from the child node choosing moves for both players according to the play out policy and this moves are not recorded in the search tree and then we note that black wins

**[00:52:33]** so in this case for black it will be 28 over 36 Okay, and then for white, 16 over 54. Then for black, it's 61 over 80 now. So you have added one to the values here, to the value here. So from 27, it has become 28.

**[00:53:07]** But here, since black 1, it's still 16, but this time over 54. Here, you add 1 because black 1, so it's 61 over 80, and so on. So at the top, you have 37 over 101. So that is your backpropagation step. So we use the results of the simulation to update all the search nodes going up to the root.

**[00:53:44]** This is how it looks like. The time to compute the playout is linear in the depth of the game tree since only one move is taken at each choice point, thus giving time for multiple playouts. MCTS is better than alpha beta search for games with higher branching factor. For example, Go. So for Go, MCTS is better.

**[00:54:17]** But for chess, it seems like alpha beta search is still preferred. And also for MCTS, it has the property of being less vulnerable to errors arising from the wrong evaluation function value. So alpha beta search is better for games where a single move could change the entire course of the game.

**[00:54:49]** Finally, we go to stochastic games. So here we have Bakhtaman, which is a stochastic game. We need not know how to play this. It's just important to know that when we have stochastic games, we have a tree that has a chance nodes. So these are the chance nodes when you have your stochastic game.

**[00:55:20]** So you have your max, your chance nodes, and then min, chance, max. And depending on the outcome of the die roll, you go to this node, or this other node, and so on.

**[00:55:50]** So here we have expected minimax, which is again a modification of minimax, where the value of the state is equal to the utility if the terminal node has been reached. For if it is the turn of max, then we do this calculation, basically take the maximum

**[00:56:20]** maximizing action that maximizes the expected minimax value. If it is a min node, we take the minimum. If it is a chance node, we take the expected minimax and weigh that with a probability. So here R represents a possible die roll and the result here is the same

**[00:56:56]** as the state as with additional fact that it is the result of the die roll. We have to be a little careful about interpreting the chance nodes because it could give wrong results. So looking at this for example, so these are the evaluation function, and they are, okay, so here the values are 2, 2, 3, 1, 4, while here the values are 20,

**[00:57:36]** 30, 1, and 400. As you know, these are the result of your evaluation function, and If we weigh this with the probability 0.9, 0.1, this could give us wrong results. So for example, here, for the first tree here, the value, backup value is 2.1,

**[00:58:08]** and therefore we choose action 1. while for the second tree, the second action A2 is selected because the backup value is higher than the other one. And in order to solve this, we use evaluation function that will return values that are a positive linear transformation of the probability of winning. So instead of this, we transform this into probabilities,

**[00:58:40]** probability of winning. With that, we end today's lecture on adversarial search. Thank you.

