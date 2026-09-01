# Transcript — Lecture_3A_Blind_Search.mp4

_Auto-transcribed with Whisper (mlx-community/whisper-large-v3-turbo) on 2026-09-01. May contain recognition errors; repeated segments (silence hallucinations) were collapsed. Verified against a second independent Whisper pass: identical coverage (99%, ends 3 s before the video's end), no divergent windows, no gaps >45 s._

**[00:00:00]** In today's class, we'll cover the following topics. We'll discuss the problem-solving agent, the different problem types, then how we search solutions for the search problem solving agent. Then we look at the different blind search methods

**[00:00:39]** for doing this search. And at the end we will compare the different blind search strategies that we have discussed. Let's first talk about the problem-solving agent. So what is a problem-solving agent? It is a goal-based agent that decides what to do by finding sequences of actions that lead to desirable states.

**[00:01:10]** So we have seen last time what a goal-based agent is. So it has a goal and in order for the agent to reach its goal, it has to undertake not just one action but a sequence of actions, different actions in order to reach the goal. So that is your goal-based problem-solving agent. So a problem-solving agent must do the following.

**[00:01:46]** It must formulate its problem and its goal. It must also search for the action sequence that makes it achieve its goal. And finally, it will execute the best action sequence that it has found. So what is a goal? Let's define the different terms more precisely. So a goal for the problem-solving agent is a set of world states that the agent would like to reach.

**[00:02:24]** That is the goal. It could be just one world state, or it could be many world states, several world states. or it could be something that is abstract. For example, in chess, so your objective in chess is to be able to corner the king so that the king can be checkmated. So that is the goal of the chess problem-solving agent.

**[00:03:01]** Deep Blue, for example. So in that case, it is not a particular configuration of the chessboard, but that it is an abstract description of the world. So the king is cornered, the king is checkmated, which means that wherever the king goes, whatever the king, whatever move the king

**[00:03:34]** is allowed to do, the king will still be checkmated. So that's your goal. It's an abstract description, not a particular world state, but rather there are so many world states that would correspond to that goal. Second, action. What is an action? It is a transition between world state. So normally,

**[00:04:05]** you have several choices, you have several options. So you have several possible transitions from this world state that I am in now to the next world state. So that is what the problem solving agent is facing. What particular action should I take among the available options that I have? Then third is your search algorithm, which takes a problem as input and returns a solution

**[00:04:35]** in the form of an action sequence. So that is the subject of today's lecture. So we'll go into the different types of search algorithms. Then finally, the agent must execute or perform the action sequence in order to reach the goal state.

**[00:05:06]** In AI, we normally play around with what we call toy problems. These are problems that are important for developing AI algorithms. And many of them are cast as games. And these may appear simplistic, but these games are actually important.

**[00:05:36]** So we'll be dealing with toy problems, such as games, because many real-world problems can actually be cast as games. So that's the importance of using this, studying toy problems in artificial intelligence. As one prominent AI professor said, it is not that games and mathematical puzzles are chosen because they are clear and simple.

**[00:06:13]** Rather, it is that they give us, for the smallest initial structures, the greatest complexity so that one can engage some really formidable situations after a relatively minimal diversion into programming. So that's the reason why we tackle the toy problems. and toy problems are also going to stress test

**[00:06:46]** the different problem solving methods that we will study. Let's take a look at one very important toy problem. It's called the 8th puzzle. You probably know this 8 puzzle as a kid. You probably had this as a toy. So it consists of a 3 by 3 board with 8 numbered slides, tiles

**[00:07:18]** and a blank space. So you have your starting state and then you have a goal state. So the goal state is defined. It could be another configuration if you wish, but it is a well-defined goal state. So the starting state looks like this, for example. And the objective is to reach the goal state by sliding the numbers or the tiles.

**[00:07:50]** So for this particular puzzle, it is simpler to think of blank space moves left rather than move tile one of tile four into the blank space. So it's simpler to think of it that way. Okay, so you just have to deal with one blank space rather than the different tiles here, the different numbered tiles.

**[00:08:25]** Now, the 8th puzzle and its larger version, the 16th puzzle, 15th puzzle rather, which is a 4x4 board, are the standard test problems for new search algorithms in AI. Now, the 5x5 board version, the 24 puzzle, is very challenging even for the best search algorithms developed so far.

**[00:08:57]** And we shall see why. Another toy problem is the 8 queens problem. So the idea here is to place eight queens on the chessboard, the standard chessboard, so that no queen will attack any other queen. So a queen attacks any piece in the same row, column, or diagonal.

**[00:09:32]** So again, the objective is to place eight queens on a chessboard such that no queen attacks any other. So this, for example, is an attempted solution to the problem. Actually, it doesn't solve the problem because these two queens are attacking each other. So it's not a solution. It's not a... That's not your goal. okay so you have not yet reached your goal you still have to do something

**[00:10:07]** then another important toy problem is the route finding problem so here we have a map of Romania, some of the important cities of Romania, and you would like to find a route from Arad, this city here, to Bucharest. And then you are given this straight line distances,

**[00:10:43]** distances that you have to travel in kilometers in order to reach the other city. So you're given this this map and then what is the optimal route for you to reach Bucharest from Arad. So this obviously has lots of applications. In fact, Google Maps uses this algorithm. So we shall learn by the end of today, the algorithm that Google Map uses in order to, well, teach us or instruct us where to pass.

**[00:11:32]** Of course, there are other things that Google has incorporated into the algorithm, but the main algorithm is called A-star. and you should be studying A star in a short while. Google has done some enhancements to the algorithm in order to make it work better. But even the original version of A star is already very useful.

**[00:12:07]** Then you have the blocks world problem. it is another problem, another toy problem rather, which is important for planning. For planning. So when you say planning, you'd like to have a series of action sequences so that you're able to achieve several goals. So the blocks world was originally developed for this. So in this world,

**[00:12:39]** you have numbered blocks that can be stacked in order to form a tower of unlimited height. And the goal is to stack blocks on each other according to a certain order. So these are numbered from 1 to n and then the robot is asked okay move stack them such that you have 1, 2, 3, 4 5 up to n or or 2 4 6 8 10 and so on well the the goal is uh specified but then it's not a simple

**[00:13:24]** problem because in the initial state some of the blocks are on top of each other and the objective is for the algorithm to use logic and search in order to achieve the goal and this requires planning and this actually gave rise to a discovery by Sussman

**[00:13:55]** It's called the Sussman's anomaly, where sub-goals actually interact. And we shall see what happens in the Sussman's anomaly. So let's talk about problem formulation. four types of problems single state the multiple state contingency and exploratory problems

**[00:14:35]** let's have another toy problem it's a super simplistic world with only two cells okay so the left cell or the right in the right cell and the cell or the room can be dirty or not dirty so just two states dirty or not dirty and then you have a vacuum cleaner which is the agent

**[00:15:05]** So the objective of the agent is to reach this goal, goal number eight or goal number seven. Any of these two from any other state. So if you start here, how should the agent act in order to reach this state or this other state? So again, the world consists of two locations, which may be dirty or not.

**[00:15:38]** And the possible world states are enumerated here. So they're just eight possible world states. So very simple world. But then it, as mentioned earlier, this is a toy problem. it is meant to illustrate important concepts for planning. So the agent has two possible actions.

**[00:16:12]** It has two options. Move left. Okay. Or move right. So if it is in state number one, if it moves right, then it's this one action. if it moves left, well, it will cannot move left anymore because it's already here on the left room. So the sensor of the agent will say, okay, so we just stay here in this room.

**[00:16:48]** Okay. And then the third action is soft dirt. So our objective is to reach this goal, state number seven or state number eight. Now for the single state problem, the agent knows exactly which state it is in. so the sensors detect exactly

**[00:17:23]** the state of the world you know that agents can observe the world and the sensors may provide you enough information to describe the state of the world state of the world relevant to the problem at hand or it could not provide you enough information. In that case, your problem now becomes a partially observable problem.

**[00:17:56]** So there's partial observability. In this case, we have complete observability so that the agent exactly knows where it is in the world, meaning it knows that it is in state 1, 2, or 3, or 4, or 5, up to 8. And it knows exactly as well the effects of its action. Okay, so if the agent knows that it is in state, well, state 5,

**[00:18:32]** the action move, write, stop there will bring you to the goal state. Okay, so the same with the other states. So this here, suck dirt, move left, suck dirt, then you're now in state seven, which is your goal statement. So very simple, right? Very simple.

**[00:19:05]** So since there's complete knowledge, there's no more search to be done, right? If you recall, one of the laws of intelligent action is you have a lot of knowledge, you do little search. If you have complete knowledge, you don't do any search at all. On the other hand, if you don't have enough knowledge, if you have very little knowledge, you'll compensate that by doing more research.

**[00:19:43]** In this case, since the agent knows exactly where it is in the world, which state it is in the world, then there is already a predefined action sequence that will bring the agent to the goal state. So no more searching. It knows. So let's just have a lookup table. If I'm in this state, I do this, I can sequence and I reach the goal.

**[00:20:18]** So that's your single state problem. Now, in the multiple state problem, the agent, because of partial observability, because the sensors are not giving it enough information, the world is not fully accessible. So it just knows that it is in one of several world states.

**[00:20:50]** And of course it knows the effects of its action. For example, because of, okay, suppose Because the agent in this case, the simple vacuum cleaning agent, does not provide it. The sensors did not provide the agent enough information. The agent will just say, okay, I am in the following world states, 1, 2, 3, 4, 5, 6, 7, 8, all the possible world states.

**[00:21:21]** Then the action move right will bring the agent to one of the states, 2, 4, 6, 8. Then the agent can reason out that the action sequence move right, sub right, move left, sub right will make it reach a goal state from any initial state. So the agent will have to reason out.

**[00:21:51]** Since the world is not fully accessible, so that's the multiple state agent. So since there's partial observability, there's little knowledge, you'll have to compensate that by either search or by doing more actions, trying more actions. in this case. Okay, there's reasoning and the agent has discovered that the action sequence

**[00:22:28]** move right, sub-dirt, move left, sub-dirt will bring it into the appropriate goal state. So for both single state and multiple state problems, there is an action sequence that is guaranteed to bring the agent to the goal from any initial state. Let's now talk about contingency problems. In a contingency problem, the correct action sequence

**[00:23:05]** depends on a possible contingency that might arise during execution. For example, car driving. Car driving obviously is much, much more complex than the vacuum world. So many things could happen while you are driving. In fact, when I was learning how to drive, I was told that every time you go out driving,

**[00:23:39]** you're learning because you can never tell yourself that I've mastered this. Anything could happen while you are driving. So each drive is always a learning experience. So you cannot memorize, for example, and sleep, obviously. So car driving is a contingency problem.

**[00:24:09]** Since even if we know how to get to our destination, traffic conditions, accidents, people crossing the street, and so on, could alter our land route. So, we need to deal with that, with these situations. And because of that, contingency problems require interleaving of search and execution.

**[00:24:45]** Or more properly, sensing, searching, and execution. and executions. It's a loop. Sense, search, execute. Sense, search, execute. Unlike the single state problem, which is a super simple world, where you just have to execute because you know exactly what's going to happen in the world.

**[00:25:16]** So it's totally predictable. Games can be modeled as contingency problems because your opponent is there to defeat you. So you have to be continually interleaving sensing and search and execution. The last type of problem is called the exploratory problem,

**[00:25:49]** where the agent is ignorant of the effects of its actions and therefore must experiment in the real world to gain experience, which it will then take advantage of to solve subsequent problems. So that's your exploratory problem. In fact, it is doing exploration in order to exploit whatever information that it has gained through the experience that it has acquired.

**[00:26:23]** So you have exploration and exploitation. Exploitation of the knowledge that the agent has acquired. So the agent must experiment gradually discovering what its actions do and what sorts of states exist, just like what newborn babies do when faced with the task of handling, dealing with the environment, for example.

**[00:26:53]** Reinforcement learning attempts to solve exploratory problems. So a simplification of the reinforcement learning problem, for example, like the multi-armed bandit problem deals with the trade-off between exploration and exploitation. So this exploration versus exploitation dilemma is present in reinforcement learning and emphasized in the

**[00:27:30]** multi-armed bandit problem, which is a special case of reinforcement learning. Let's now talk about search. A search problem consists of the following. The state space consisting of the initial state, the goal state or states, and all the other possible states. So all the possible states together constitute the state space.

**[00:28:05]** The operators for the problem is the set of possible actions available to the agent. Then you have a goal and the agent must test after executing an action whether it has already reached the goal or not. So there's what we call a goal test. The agent must also monitor the path cost.

**[00:28:39]** since the agent would not want to waste its time and resources, its energy, in order to reach the goal. So you'd want the path cost to be as small as possible. Say the path cost is typically a function that assigns a cost to a particular path. Let's now take a look at the initial states, operators, goal tests, and path cost for the 8th puzzle.

**[00:29:13]** What are the states? The states here would be the configuration of your 8th puzzle. It is a state description that specifies the location of each of the 8 tiles in one of the 9 squares. square. So it's very simple really. It's just basically a representation that mimics the arrangement of the tiles. So as is. So you represent this in the computer as is.

**[00:29:47]** Then you have operators. What are the operators? As we said, it's better to think of the blank as moving left, right, up, down, and so on, instead of some particular numbers moving into the blank space. So the operators are move, left, right, up, or down. In certain cases, only certain moves are allowed. So if with this particular starting point, starting state, moving up is not allowed because, yeah, for obvious reasons, moving right is also not allowed.

**[00:30:30]** So you only have two choices, move left or move down. Then the goal state, the goal test rather. so any after executing an action the agent will test whether it has already achieved or reached the goal itself and it will compare that particular state where it is in with the goal does the state match the goal configuration

**[00:31:02]** for this particular goal state for the 8 puzzle And for this problem, we can assign a path cost of 1 for each move. Path cost is 1. So the path cost in this case is just the length of the path. Eight queens problem.

**[00:31:34]** The eight queens has two formulations. the so-called incremental formulation and the complete state formulation. In the incremental formulation, the action available is just one. Place the queen on any of the squares while making sure that it's not being attacked by any other queen.

**[00:32:09]** So that's the incremental formulation. You place the queens one by one, while the complete state formulation involves putting all the eight queens on the board and moving them around so that they don't attack each other. So one possible incremental formulation is the following. Okay, for the states, arrangement of zero to eight queens on board with non-attack. So one by one, making sure that as you place the queen, the next queen on the board,

**[00:32:45]** is not being attacked by any other queen. So operators place a queen in the leftmost empty column such that it is not attacked by any other queen. So it's just one possible formulation. There are many possible incremental formulations. And then one possible complete state formulation involves moving any attack wind to any other square in the same column.

**[00:33:16]** So you do that. And after some time, hopefully, you will be able to get the right configuration and you will have reached the goal state. So for both formulations, the goal test is to place the eight queens onboard with non-attack. And the path cost is zero because we are only interested in the final state. But the search cost is important, meaning how many moves we make.

**[00:33:54]** the operators that you have described earlier in the previous slides, there are 2.8 times 10 to the 15 possible sequences for the complete state formulation, while there are only 2,057 possible sequences for the incremental formulation. So they're not the same. So the incremental formulation is obviously much better.

**[00:34:32]** Other important terms we need to know. Given a particular state x, the successor function s of x returns the set of states reachable from x by any single action. We also have the state space, which is the set of all states reachable from the initial state by any sequence of actions.

**[00:35:02]** That's the entire state space for a given particular state. path in state space is any sequence of actions leading from one state to another. Again, the goal is a set of goal states or an abstract description. For example, in chess, the goal is a checkmate where the opponent's king can be captured on the next move no matter what

**[00:35:33]** the opponent does. That's your abstract description of a checkmate. So how it looks like many possible checkmate configurations that it is not practical to enumerate them. Searching for solution. What is a solution? As we said, we are interested in

**[00:36:04]** in state sequences. Solution is a path from the initial state to a state that satisfies the goal test. So that is our solution, the action sequence, which defines a path. The effectiveness of your search can be measured according to the following. completeness, just find a solution when there is one.

**[00:36:35]** If it always does find a solution when there is one, then we can say that the algorithm is complete. Some algorithms are not complete, that sometimes it cannot find a solution because the problem is simply too hard. or even if it is easy, the algorithm is limited. Second, optimality. Does it find the lowest possible path cost?

**[00:37:09]** Time complexity. That is the cost associated with time needed to arrive at the solution. So very important. we'd want our algorithm to be very efficient and therefore we have to look at time complexity as well as space complexity which is the cost associated with memory needed to arrive at the solution now once we have defined a problem and by this we mean we have

**[00:37:47]** determined the initial state operators which will be described by a successor function. We have specified the goal test and formulated the path cost function. The solution can now be found by a search through search space. Let us consider the route of finding problem. Where you'd want to go from Arad to Bucharest.

**[00:38:22]** Okay, so here we have straight line distances in kilometers or in miles and units. Okay, just think of them as units. But for this part of the lecture, the blind search part, we are not given this information. So we're blind. The algorithm is not, or the sensors do not provide that information.

**[00:38:58]** It does not have any GPS information nor a map. So can you still solve the problem? Yes, definitely. But as we said, if you have less information, if you have less knowledge, you need to compensate that by doing more search. And we shall see this. Okay, so generating action sequences. Expand the state. When we say we expand the state, this means we generate a new set of states by applying all valid operations to that state.

**[00:39:35]** For example, these are our root-finding problem. We are here in Arad. So from here, there are only three possible actions. we move to Zerrin, we move to Seabue, or we move to, we travel to Temisawara. So from Arad, we go to Seabue,

**[00:40:05]** Temisawara, or Zerrin. So there are three possible options. Now, suppose you chose Sibiu. Then from Sibiu you can go back to Arad. That's not a good plan. Then you can go to Oradea, Agaras,

**[00:40:38]** Rimniko, Vilsea. Four possible choices. assume we don't have GPS, because if you have GPS, then basically it's using the algorithm already, A star, which is the subject of our next lecture. But then we are not provided that information. So we are just looking at where are the other possible cities, the agent or agent can go. So therefore, so obviously you don't go back to ARAD because you're basically going back to where

**[00:41:14]** you came from. But then anyway, so this is a possible option. It's not a good option at all. Then it's a possible option. So that's why we put it here. So the search process may be informally described as consisting of the volume steps. Choose one state, expanded state. Again, we say expand. we mean consider the other possibilities all the possible states

**[00:41:44]** will succeed, Arad which is Zeran, Zibiu and Timisara that is what is meant by expanding the state then we apply the goal state to the expanded state here Zibiu Zeran or Timisara have I reached my goal? Not yet so since I have not reached my goal, then I will have to choose one of these three. Suppose I choose Sibiu. Okay. From Sibiu, I go to Sibiu, I have four choices.

**[00:42:19]** I won't choose Arad because that's where I came from. Okay. So that's the objective. So at each of these, you'll have to look at you'll apply you'll have to apply the goal state to check whether any of them is the goal state and if you have reached a goal then that's it otherwise you choose another

**[00:42:51]** state any of the three possible when we say any it depends on the algorithm it's the algorithm basically that tells us which of these should I choose. Okay, so as you can see, this builds a search tree. So this is called a search tree. So for those who know computer science, this is something very, very basic. So engineers typically do not deal with search trees.

**[00:43:28]** They just, they deal with arrays, arrays of numbers so it's a regular structure x y x y z tensors okay so m-dimensional densers it's what engineers are very familiar with but not some some of them of course are familiar with trees but in general this three structures not really the forte of engineers. So it's more of for commsci, you know. So a search three is built

**[00:44:01]** during search, okay. And the root of the search three is the search node. So in this case, Arad, because it's our initial state. So the search node is our initial state. Then when choosing an action, we should take note of the other options so that we can backtrack in case our choice does not lead us to a solution. In other words, there should be a backtracking mechanism that allows us to

**[00:44:32]** go back in case we made a mistake. Now the choice of which state to expand next, should I go to CB first or Temisar or Zirin, that is dictated by the search strategy. Now the leaf nodes of a tree correspond to states that do not have successors in the tree. Okay. Either because they have not yet been expanded or because they were expanded but generated an empty set.

**[00:45:08]** So that's like the terminal. So this is a dead end. So if you have reached that, go back to where it came from. So that's a dead end. So we can consider that as a leaf node. Any of these leaf nodes. Or even here, no? So you can, since you're memorizing where you have visited, the places you have visited,

**[00:45:38]** and, okay, I won't visit Arad again because it's where I came from. Or I've seen this city before, so I won't visit that again. So in that case, that becomes a leaf node. So a search algorithm chooses one unexpanded leaf node to expand. So here you have, okay, so you chose Arad as your starting point. And then after expanding Arad, basically this one corresponds to this tree.

**[00:46:11]** Then the next one, after expanding Seabue, Yeah, I think this is C view. You have basically considered these segments. And then finally, the solution is here. Okay, you have reached your target, your goal. So each node corresponds to a state in state space in this case.

**[00:46:43]** and there are 20 states since there are 20 cities in this diagram. In general, the number of nodes of a search tree is infinite because there are an infinite number of paths in state space. The number of paths from one city to another is infinite if we include looping. So if we include looping, which is sometimes allowed depending on the problem, then the

**[00:47:17]** path, the number of paths could increase and even become infinite. Here's the general search algorithm. The general search algorithm takes in a problem as well as a strategy and returns a solution or failure. I can find a solution. So either it finds a solution or it doesn't find a solution.

**[00:47:49]** The solution could be a great solution, a bad solution, but tantalize still a solution, a suboptimal solution if you wish. So that's your general search algorithm. We initialize the search tree using the initial state of the problem. Just like here, initialize. This is a tree already. One node is a tree. The generate tree.

**[00:48:24]** Then we look if there are no candidates for expansion, return failure. But we choose this, choose the leaf node for expansion use according to the strategy that we have. If the node contains a goal state, then return the corresponding solution. Otherwise, expand the node and add the resulting nodes to the search tree. So this means that we need to be able to backtrack and or memorize rather the path because we need to execute the

**[00:49:03]** action sequence. Data structures for search streams. Since it is a data structure which are defined by nodes, we make a node with the following data structure components. State and state space to which the node corresponds. Apparent node, which is a node in the switch tree that generated this particular node.

**[00:49:33]** Then the operator that was applied to generate the node. Move left or move right, up or down. that was the previous, that was the operator, the action that put me in this particular state. Okay, so you need to store that as well in your node. The depth of the node, which is the number of nodes on the path from the root to this particular node, your particular state.

**[00:50:04]** Then the path cost, which is the path, the cost of the path from the initial state to the node. Now, we define an expand function that takes care of calculating each of these components. Okay, so there's an expand function that takes in its state and generates all this, puts it into the appropriate bins

**[00:50:34]** in our node data structure. We define as well the frontier or fringe as the collection of nodes waiting to be expanded. And that is best implemented as a queue for efficiency. okay so if you expand ARAD it has three possible it has three successors possible successors

**[00:51:12]** so this now is placed in a queue these three nodes are placed in a queue and it is the strategy strategy algorithm or the strategy rather that will dictate which of the three will be executed or expanded next. So since we are implementing a queue, we have the following queue operations.

**[00:51:45]** Make a queue from the elements. It creates a queue with a given elements. Then we ask, we have this function empty queue. Then this basically will return true or false, and it returns true only if there are no more elements in the queue. So remove front of queue. This removes the element at the front of the queue and returns it. Then we have a queuing function.

**[00:52:17]** We have a queuing function and it accepts the elements as well as the queue. So this queuing function inserts this set of elements into the queue and how this is done is dictated by the search algorithm. So now our search, general search algorithm is taking shape.

**[00:52:47]** Okay, so it looks like this now. You have your problem, you have your queuing function, and with this you return the solution or failure. So the first step is to make a node from the initial state. Remember your 8 puzzle, so that particular board configuration.

**[00:53:17]** You create a node with that particular board configuration, and you make a queue from that. It's basically just one node. Still a queue, even if it's just one node. So you make a queue, and then that would be our nodes. And then you loop here. If nodes, these nodes, data structure is empty, then return failure.

**[00:53:49]** Cannot process this anymore. We have, yeah, there's no more node to process, so failure. The algorithm cannot find anything. Otherwise, remove what's in the front of the queue, given this nodes list, this queue rather, and that would be your node.

**[00:54:21]** And if gold test for the particular problem is applied to the state, And this turns out to be true, which means that the agent has reached its goal, then you basically just return the node and say that I have found my goal. I have now reached the goal. Otherwise, you expand the node and put that into the queuing function.

**[00:55:06]** So the queuing function will rearrange the queue here. So these nodes here would be the queue. Okay, so it's the queuing function that rearranges the nodes and the expanded node that's coming in to give you your new queue. Now we've been talking about

**[00:55:39]** search and there are criteria for evaluating search algorithms. So the search strategies can be evaluated according to So completeness. Is the strategy guaranteed to find the solution when there is one? Second criterion is time complexity.

**[00:56:11]** How long will it take to find the solution? Third criterion is space complexity. How much memory will the algorithm need in order to perform the search? And finally, admissibility or optimality. Does it find the highest quality solution when there are several possible solutions? So these are the evaluation criteria against which we will compare the different search algorithms.

**[00:56:48]** There are two general classes of search strategies. One is blind search. The other one is juristic search. Uninformed search versus informed search. So for blind search, there is no information that is given about the number of steps or path caused from the current state to the goal. So this is the case when you do not have a sensor that gives you that information.

**[00:57:19]** You don't have GPS, for example. Now, for blind search methods, the choice on which node to expand next depends only on the node's position in the search tree. Examples of line search methods include breadth-first search, depth-first search, uniform cost search, depth-limited search, iterative deepening search, and bidirectional search.

**[00:57:55]** We will cover all these in this part of the lecture. For heuristic search, there is now additional knowledge that is, of course, problem specific. Because there's not additional knowledge, there's going to be less search that's going to be done. And therefore, the solutions will be found more efficiently. More knowledge, less search, and therefore, more efficient searching.

**[00:58:30]** Examples of heuristic search methods include greedy search, A-star search, iterative deepening A-star, simplified memory bounded A-star, real-time A-star, learning real-time A-star, B-star, and so on. For today, we will just focus on the first three. and iterative deepening A-star.

**[00:59:00]** Let's talk about BFS or breadth-first search. In BFS, the root node, which is this, is expanded first, then all the nodes generated by that node is expanded next, and then their successors and so on. So we expand this, this will generate these two successor nodes. here talking about a binary tree. Binary tree means two successors. It could be more than two,

**[00:59:38]** but to simplify, let's just talk about the binary tree. So here, after expanding this node, we now go to this node here and expand it and then proceed to the next node at the same depth. So all nodes at depth D in the search tree are expanded before the nodes

**[01:00:10]** at depth d plus 1. So before expanding this, you go to the next node at the same depth, because that is what is required by BFS. So here you have your BFS after 0 to 3 node expansions. BFS is implemented by calling the general search algorithm with a queuing function that puts newly

**[01:00:43]** generated states at the end of the queue. Okay, so let's go back. So newly generated states at the end of the queue. Okay, so suppose you're here, you've expanded this node, so this gives rise to these two nodes, the successor nodes, this will be put in the queue but at the end.

**[01:01:13]** Which means that this will be expanded after the others have been expanded, which means this one first before you process this. So when you expand this, you have these two nodes, but then these two nodes were expanded ahead. Therefore, this will be expanded first ahead than these two other nodes and so on. So that's your BFS.

**[01:01:47]** BFS is complete because if there is a solution then BFS is guaranteed to find it. Yes, so it's guaranteed to find it because it actually looks at all the nodes at the same level. okay so it will not suppose this the node is here after expanding this it will go to that node and if it's that if that is the goal the goal test will tell us that we have reached the goal

**[01:02:20]** that's for your bfs so it's obvious that it will always find the goal so which means that bfs is complete. If there are several solutions, the shallowest goal will always be found. It is optimal provided that the path cost is a non-decreasing function of the depth of the node. Okay, so the the shallowest goal will always be found.

**[01:02:52]** okay so also you've expanded this and this gives rise to these two nodes then you expand this um okay so when you expand you do a test okay so when when when this node is expanded a test is performed

**[01:03:22]** is this is this the solution no is this a solution no then expand this okay so if if this node is the solution then that's it you have found the shallower shallower solution even if this is also a solution, right? Because as I've said, when you expand, you do a test and check whether

**[01:03:55]** you've reached the goal or not. So if this is your shallower solution, it will be found ahead of a deeper one. So that is clear. If each expansion yields B new states, in this case B is 2, we say that the branching factor of the tree is b. So for the binary tree, b or the branching factor is equal to 2. If the goal state is found at depth d,

**[01:04:30]** the maximum number of nodes expanded before finding a solution is 1 plus b plus b squared plus b cubed plus b raised to the d. So it's obvious here. Number of nodes expanded, 1, 1 plus 2, 1 plus 2 plus, which is basically 1 plus 2 raised to the 1 plus 2 raised to the 2, which is 4, and so on, for a binary tree.

**[01:05:11]** B is your branching factor, and that's why it's 2 raised to the depth. So here d is the depth of your tree. Now let's take a look at the time complexity and space complexity of this algorithm. So it's order b raised to the d for both space and time. So for BFS both time and space complexity are exponential.

**[01:05:53]** Okay let's give some values to the different to the branching factor and to D. So for say depth of zero, of course, it's just one node.

**[01:06:25]** And if it takes one millisecond to expand it, and memory size would be 100 bytes, then okay, so you have this value. So if it's two, four, and so on, you have these values. computed. So you're looking at these values, you'll see that for BFS, for this algorithm, the execution time is a bigger problem than memory requirement. So can you wait for 35 years before you get the solution?

**[01:06:58]** I cannot. But I can spend more money if I'm desperate. it. I can buy lots of hard drives and put in all the data there. This is going to be very expensive, but then I mean, it's just a matter of having more money. But then 35 years is 35 years so no way can i uh really solve it in a much much uh short shorter period of time

**[01:07:35]** of course i can do parallel processing if i do parallel processing if i have 35 computers and normally this algorithm is in a scale linearly so maybe i'm i'm going to reduce it to 10 years with 100 computers, 10 years is still a long time. So for BFS execution time is a bigger problem than the required memory. EUC-S by Dijkstra which is proposed in 1959 is similar to BFS except that it always expands the lowest cost node on the fringe

**[01:08:19]** as measured by the path cost rather than the lowest depth node. In fact, VFS is just a special case of the UCS with your path cost equal to the depth. So provided certain conditions are met, the first solution that is found is guaranteed to be the cheapest solution since if there were a cheaper path that would already be the solution.

**[01:08:49]** it would have been expanded earlier and it would have been found first. So that's your UCS algorithm. UCS finds the cheapest solution if the path cost of the path never decreases as we go along the path and this basically means g of successor of n is greater than g of n for every node n. And if every operator has a non-negative cost, then the cost of a path can never decrease as we go along the path.

**[01:09:23]** In this case, UCS will find the cheapest path without exploring the whole search tree. Still, the time and space complexity are both of order to be raised to the day. So it's the same as that of DFS. Let's now talk about DFS or depth first search. Depth first search expands one of the nodes at the deepest level of the tree. When the search hits a non-goal node with no expansions, it goes back and expands nodes at shallower levels.

**[01:10:01]** So just like here, you have here a binary tree that keeps on going deeper and deeper until it hits the leaf nodes. No longer possible to expand this. No more successors for this. And only then will it go to the next node. node. So here, what happened here, this part here was pruned, okay, so in order to conserve memory

**[01:10:34]** space. Since we know that none of this will be important anymore towards finding the solution, you can save memory by getting rid of this. So now you have pruned the tree, this part, and continue to expand using that memory, reuse that memory for these expansions. So that's your depth for search. This is implemented with a queuing function that puts the newly generated states at the front of the queue.

**[01:11:09]** It's not like the BFS. The BFS is where the newly generated states are placed at the end of the queue. BFS is the opposite in front of the queue. So now BFS stores the path from the root to the leaf node and all remaining unexpanded sibling nodes for each node on the path.

**[01:11:41]** For branching factor B and maximum depth of search tree M, the required storage is B raised to the M nodes. The time complexity of this algorithm is of order b raised to the n, but on average it performs better than BFS since BFS looks at all nodes at depth d minus 1 before going to nodes on depth d. So furthermore we have that space saving solution that prunes the tree when a particular node

**[01:12:18]** the parent node as successors that have reached the leaf nodes. So on the other hand, DFS may never terminate if the trees have infinite depth. It will just keep on expanding nodes forever. And DFS could also return a solution path that is longer than the optimal solution since it could find a deep solution even when the shallow solution exists.

**[01:12:51]** So this obvious here, suppose we have here this. This is a solution as well as this is another solution. Okay. Obviously, this is a better solution because you only need this much resources. is this the length of this is just one. Well, here the length is one, two, three.

**[01:13:21]** But since we are expanding this node, and we have reached this, the goal test is performed, then this will be returned as the solution. Or in fact, there's a better solution, which is this solution. So when you have a solution that's down there deep, it could be found ahead of a shallower solution. So it is not obviously optimal.

**[01:13:52]** So it's neither complete nor optimal. Why is it not complete? because I could just keep on expanding forever. Okay. So this could keep on expanding forever. This one. Sorry, this one. This one could keep on expanding forever and ever and ever when until or there's no, you know,

**[01:14:28]** the leaf node is not reached at all. because there's no leaf node, just looping probably. But there's actually a solution here. Therefore, it is not complete. So we must avoid using DFS for search threes with large or infinite maximum depths. Is DFS hopeless or useless? not exactly because we have the depth limited search version which is the same as dfs but with

**[01:15:06]** a cut off on the maximum depth of a path so you can implement that for the route finding problem by saying that okay there are five cities before we reach the goal so therefore i can assign a cut of four steps. So depth limited search is complete because we are guaranteed to find a solution

**[01:15:38]** if the depth limit is greater than the depth of your solution. However, depth limited search is not optimal for the same reason as DFS. Time complexity is of order B raised to the L and space complexity is of order B L for depth limit L. So this is how it goes. This is the IDS by Slayton Upkin proposed in 1977.

**[01:16:15]** So IDS basically calls the depth limited search with increasing limits until a goal is found. So here you set the limit to zero, you set the limit to one. So by setting the limit to one, you are forced to examine the node on the same level. level 1 and level 2, level 3 and so on. So therefore, it will find the solution when there is a solution.

**[01:17:00]** So it's looking at this, the way this is being expanded, it's like that of a BFS. So this is how it's implemented. Okay, so this is very familiar to those who have done data structures, so it should be easy to implement.

**[01:17:32]** IDS is complete since it can find a solution no matter how deep it is. is also optimal since the shallower solution is always found. So the depth limit is the one that saves the day. Making the depth limited search complete and optimal. And one might think,

**[01:18:04]** okay, I'm wasting resources here. So for limit one, okay, I've expanded this. For limit two, I'm going to expand the same nodes again. I've already expanded these nodes in the previous iteration. Why should I do that again? So yeah, for level three, again, you'll be expanding all those nodes that you've expanded in the previous iteration. well there's that overhead of multiple expansion

**[01:18:38]** but that actually small especially for a tree with a high branching factor and even for a binary tree with a branching factor of just two IDS only takes twice as long as a complete BFS Okay? It only takes as long as a complete BFS. Time complexity is b raised to the d and space complexity is of order bd if a solution is found at depth d.

**[01:19:11]** Iterative deepening search is the preferred search method when there is a large search space in the depth of the solution is unknown. unknown. So for blind search method, this is very much recommended. Now let's go to another kind of search, which is bidirectional search proposed by Paul, where the agent is given

**[01:19:44]** the start in the goal state and agent will generate a tree of forwards toward the goal and backwards from the goal towards the starting point. So the agent simultaneously searches both forward from the initial state and backward from the goal. And the search terminates when the two searches meet in the middle here. So it looks nice.

**[01:20:15]** But there are issues that need to be addressed. We know how to move forward. We have discussed all those algorithms earlier. From the starting state to the goal state, we know how to do that. But then from goal going to the starting state, that might pose some problems. Because when searching backwards, it is necessary to generate the predecessors successively from the goal state.

**[01:20:48]** Okay? How do you deal with problems with many goal states, for example? Or when your goal state is an abstract description, for example, in chess. So, you know, so we said, okay, initial state going to the checkmate. But from checkmate, going to the initial state, how do you do that? What are the predecessors of a checkmate goal in chess? because that checkmate goal is an abstract description.

**[01:21:21]** And there's so many possible checkmate configurations for chess. So that is not practical for, you know, chess is definitely not one for where we would like to use this bidirectional search. So time complexity is of order 2b raised to the d over 2 squared, the square root of d.

**[01:21:53]** Yeah, b squared of d and space complexity is also of b raised to the square root of d. If a solution is found at depth d. This is how it looks like. Now let's compare the various blind search strategies, BFS, UCS, EFS, Deaf Limited Search,

**[01:22:25]** Iterative Deepening Search, and Bidirectional Search, applicable. Which one is complete? BFS, UCS, and Iterative Deepening Search. cost yes for bfs ucs in alternative deepening search time complexity so l is the limit okay um space complexity

**[01:23:03]** so which one is which one should i choose I like this ID. Yeah, it's probably a good choice because it's complete, it's optimal, and time and space complexity are reasonable or feasible. With that, we end our lecture for today.

**[01:23:58]** you

