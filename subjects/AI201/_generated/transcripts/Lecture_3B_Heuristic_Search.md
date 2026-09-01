# Transcript — Lecture_3B_Heuristic_Search.mp4

_Auto-transcribed with Whisper (mlx-community/whisper-large-v3-turbo) on 2026-09-01. May contain recognition errors; repeated segments (silence hallucinations) were collapsed. Verified against a second independent Whisper pass: identical coverage (100%), no divergent windows, no gaps >45 s._

**[00:00:00]** In a heuristic search, we will do less search by incorporating domain knowledge or problem-specific knowledge into the algorithm.

**[00:00:30]** Here's the outline for this lecture. We'll talk about heuristic search and discuss two search algorithms, heuristic search algorithms, the best first search strategy as well as A-star search. Then we look at the properties of the A-star algorithm. We have seen again that blind search methods are in most cases very inefficient.

**[00:01:06]** Heuristic search methods will find solutions more efficiently using problem-specific knowledge. The algorithm that we have seen before, the general search algorithm, implements the various blind search algorithms by changing the order in which the nodes are expanded. So if we put the successor nodes at the end of the queue, we have your BFS

**[00:01:44]** algorithm. If we put the successor nodes in front of the queue, then we have the DFS algorithm. So we have actually been modifying the queuing function. And this is the only place where knowledge can be incorporated there in the queuing function. By putting, by incorporating knowledge in this queuing function, we actually improve the way we do search.

**[00:02:19]** Problem-specific knowledge is embodied in a function that measures the desirability of expanding a node. And we shall call this the evaluation function. The best first search strategy is the following. it orders the nodes so that the one with the best evaluation function is expanded first. So it's not putting the nodes that are expanded last at the end nor in front, but rather this

**[00:02:57]** a rearrangement of the nodes inside the queue depending on how well or how good the nodes are according to the evaluation function. So this is how it looks like. Basically it's the same as what we have seen before except that here there is a function that reorders or that orders the node and we call that the evaluation function.

**[00:03:32]** There are two approaches. The first is called greedy search where we expand first the node closest to the goal. It's called greedy because it just looks at how close the the agent is to the goal. The other one expands the node on the path with the least cost

**[00:04:03]** solution, and that is called A star. And we shall see how these two differ and how they work. In greedy search, we expand the node whose state appears to be closest to the gold state. So there is a function called the heuristic function that estimates the cost of the cheapest path to the gold state. So it is an estimate. It is not an exact value.

**[00:04:39]** It is an estimate of the cost from where I am now to my goal state. How far I am from the goal. I can estimate that. And that is the heuristic function. So let's call it H. It is the estimated cost of the cheapest path from the state at node n to the goal state.

**[00:05:10]** And obviously, H of goal is zero. So when the node, when the agent has reached a goal, the value of the heuristic function is zero. H of goal is zero. Greedy search is a best search that uses this H to select the next node for expansion. Let's apply this concept to the route finding problem.

**[00:05:44]** We wish to travel from Arad to Bucharest, and we have this map. And we are given information now, the straight line distance to Bucharest. Okay. So these are the straight line distances from Uradea to Sibiu, it's 151 kilometers, from Uradea to Zirin, 71 and so on. So in the previous lecture, we did not use the straight line distance.

**[00:06:20]** There's no distance information that has been given to us. But now we would like to incorporate this information into the algorithm and see how we can actually perform less search or search more efficiently because we have more information. As we have said, more knowledge means less search and we will see that it is indeed the case for this algorithm, for the greedy search,

**[00:06:54]** particularly for the route finding problems. So now the heuristic functions are problem specific. And for route finding, one heuristic function that we could use is the straight line distance from where I am now, my current state to the goal and it is just an estimate so um

**[00:07:33]** okay so so uh so these are the the distances okay for oridea to sebu but then which is the path that I will take. It depends. And the total distance will be dependent on which path I traverse. Now, I am given that straight line distance to Bucharest. Meaning, if I connect the line from Arad to Bucharest,

**[00:08:04]** that distance is 366 kilometers. and you can, if you have GPS information, you can easily do that, right? The distance between this city and that other city, the straight line distance, very easy to compute that. Obviously, that is not the distance that you actually travel because you will be passing through several streets and it's going to be larger or bigger, longer

**[00:08:35]** than that straight line distance. However, if you use that straight line distance as an estimate, then we could actually come up with a more efficient search algorithm. So again, the heuristic function that we'll use here is the straight line distance between n, between the node n representing the state, the current state, and the goal location. your HSDL, straight line distance heuristic, which is specific for this route finding problem

**[00:09:13]** that we have at hand. Okay, so just like what we had earlier, but this time we will incorporate distance information, straight line distance information in particular. So we are here at Arad, and the straight line distance to Bucharest is 366. Okay? When, of course, we will expand the node Arad.

**[00:09:47]** We go to Zerind, Seabue, Timisara. so if we expand Arad we get Sibiu, Temisawara and Zarin and then each of this will have a straight line distance that is calculated according to the table so Sibiu, H is 253 253 there Temisawara, 329 and so on

**[00:10:19]** Okay. Now, in the case of BFS, breadth-first search, we will expand this node, CBU, right? But here, we will take advantage of that information that we have, which is this table here, and make use of that information to decide which of these three the agent should take.

**[00:10:49]** So looking at the straight line distances, the heuristic straight line distances for the three, we choose the one with a minimum value. So yeah, that's the intuition. Of course, you would want to go to a place where you're closer to the destination, right? And that's just logical. okay so okay let's choose this look at you're gonna look at this values the one with the lowest

**[00:11:23]** value is this c view so we expand it okay um when we expand it it gives rise to this uh um successor nodes four success winners are at foggeras or the uh ribdiku and looking at the straight line distances of these four, the one with the lowest value is Fagoras. Therefore, we expand Fagoras. And when we expand Fagoras, there you are. You have your goal, Bucharest.

**[00:11:58]** So your solution is, you just backtrack. Okay. Bucharest, Fagoras, Sibiu, Arad. So Arad, Sibiu, Fagoras, Bucharest. So that's how it works. Quite simple, right? So that we have just described how the greedy search algorithm is used for this route finding problem. Although it looks nice and clean, greedy search does not always arrive at the optimal solution.

**[00:12:41]** Now for this particular example that we have, the best first search algorithm has the minimum search cost. Yeah, it works. It works. It's the right solution maybe. Yeah, I think it's the the right solution. But greedy search sometimes causes unnecessary nodes to be expanded. For example, suppose you are starting here, ISC, and then you'd like to go to Fagoras. So the path

**[00:13:12]** that you should take is this, right? ISC to Basiul, Ur-Viceni, Bucharest, and Fagoras. This is the right path, right? However, if you use greedy search, when you expand ISC, you get Naim and then Vasu. So you're here and you shouldn't be using this table. You should be using this distance here, which we don't know. But then you know from the diagram that this will have a shorter short line

**[00:13:46]** distance than this, whatever those values are. So from IOC, the next, so you expand this two, expand IOC rather, and you get this successor nodes, these two. Then since the street line distance here is shorter than this, the algorithm will tell you go to this city. and obviously it's the wrong move. It's a dead end in fact, right?

**[00:14:18]** So, this is an example of how greedy search fails. You can, of course, go back and say that, okay, I'll go the other way. I won't go there anymore next time. But then you have expanded unnecessarily this node. So greedy search sometimes can cause unnecessary expansion of nodes. So greedy search expands this city first, goes to the city first, which is a dead end because

**[00:14:55]** its straight line distance is the shorter of the two. Okay, so greedy search is not optimal. It's not complete because it could start off an infinite path and never return. It also has a worst case space and time complexity of b raised to the m, where m is the maximum depth of the search tree. The actual space and time complexity are usually better depending on the heuristic function. Let's now go to A star.

**[00:15:31]** It's a beautiful algorithm. So A star search minimizes the total path cost, not just G. It looks for the G with the lowest value. No. It also, sorry, it will, okay, the greedy algorithm basically just considers H, the estimated cost of the cheapest path from node N to the goal. while A star considers the cost as well from the start node to node N.

**[00:16:10]** Should I go to this node? Although that node is the cheapest path to the goal, but going from the start node to that particular node may actually be a bad idea because the cost of that might be very big. So what the ISAR algorithm does is it takes the sum of the two.

**[00:16:41]** So A star computes the total path cost consisting of the sum of the two, the path cost from the start node to node n, and the estimated cost of the cheapest path from node n to the goal. So that is your basis for selecting the node. So A star basically returns the solution or failure to find a solution

**[00:17:13]** using the best first search algorithm that we have discussed earlier. But this time we just have this modification. add G plus H and you have an optimal algorithm so it's complete and optimal if H never overestimates the cost to reach a goal that means that the heuristic function is less than or equal to the actual distance

**[00:17:45]** from node N to the goal so if this condition is satisfied then A star is complete and optimal. And we will prove this. We will prove A star's optimality as well as its completeness. Now if the heuristic function is less than the actual distance from node into the goal, then it is called an admissible heuristic.

**[00:18:20]** If H is admissible, the function F never overestimates the actual cost of the best solution through node N. Now, among algorithms that extend such paths from the root, A star is optimally efficient for any given heuristic function. And it has been shown that no other optimal algorithm is guaranteed to expand fewer nodes than A star, given that heuristic.

**[00:18:57]** Okay, so it's really the heuristic that dictates how much effort A star will make. But then for that given heuristic, there's no better algorithm than A star. Okay. So we've seen how 3D search works on our root finding problem. Here we apply a start to the root finding problem. So we have Arad. Okay. We said that we need to add H plus G. What is G? G is the distance from the starting point.

**[00:19:41]** to my current state. Right? So let's start with Arad. I'm here. So what is the distance from where I am to my current state? Zero, of course, because I haven't done anything. So zero plus 366. 366 is the straight line distance from Arad to Bucharest. Then now I expand the node, giving me Sibiu, Temisara, Zarin.

**[00:20:14]** And now I have to add. 253 is your H. I got that from here. 253. And 140 is the distance from Arad to Sibiu. So that is the effort that I spent or the distance that I traveled moving from Arad to Sibiu. And then from Aretutemisara, 118 plus 329 here, giving me 447 and so on.

**[00:20:51]** So now I will have to look at this sum and choose the one with the smallest value. And it's still CBU as before. Then I repeat the same process. Okay. Now here... The one with the lowest cost is Rimniku. Rimniku. So from, then expand Rimniku, go to this, and so on.

**[00:21:25]** So that is how ASTART works. So let us recall this function. Okay, so F of n is the estimated path cost. Sorry, GS of n is the path cost from the start node to node n. And H of n is the estimated cost of the cheapest path from n to the goal.

**[00:21:56]** So f of n is the estimate of the path from the start node to the goal through node n. So let's g be an optimal goal state. So this is the optimal goal state whose path cost is f star. We call it F star because it's the optimal value, star, optimal.

**[00:22:30]** And then let us consider another goal, G2, which is a suboptimal goal state. Okay. Then because of that, we can say that G of G2 is greater than F star. So this is the optimal path cost, while this one is the suboptimal one.

**[00:23:09]** And being suboptimal, this will have a larger value than F star. Now consider a node N. It is currently a leaf node here on an optimal path to G. It's on the way to G. And since H is admissible, then F star is greater than or equal to F of N.

**[00:23:39]** Right? Since N is a node that is on the way to your goal node. Now, if n is not chosen for expansion over G2, then F of n is going to be greater than F of G2. So that now F star is greater than or equal to F of G2. okay however since g2 is a gold state we also have h of g2 as zero and therefore f of g2 is

**[00:24:21]** equal to g of g2 and therefore f star is greater than or equal to g of g2 right? Again, f star is greater than or equal to f of n. Then also f of n is greater than f of g2. Therefore, f star is greater than or equal to f of g2, which is our conclusion here, which contradicts our previous assumption here.

**[00:24:58]** So this is our assumption and this is what we ended up with. This is a proof by contradiction. We therefore conclude that a star never reaches a suboptimal goal. What erat demonstrandum? Now let's talk about admissible heuristics and mona monotonicity.

**[00:25:28]** most admissible heuristic functions are monotonic, which means that they make the resulting F-cost non-decreasing along any path from the root. So in other words, the F-cost will be decreasing along the way, right? As you go from one state to the other, as you move closer to the goal, we expect that the F cost will be non-decreasing.

**[00:26:05]** Because it's always an overestimate. So if an admissible heuristic is not monotonic, we can modify it to make it monotonic. So consider two nodes, N and N prime, where n is the parent of n prime. Suppose that f of n is greater than f of n prime. That means we have a non-monotonic heuristic.

**[00:26:36]** Observe that any path through n prime is also a path through n. The value of f of n prime can be disregarded since we know that the path cost is at least f of n. We can therefore modify f as follows. f of n prime is the maximum of f of n and the sum of g of n prime plus h of n prime. This means that we first check the f cost of the new node to see if it is less than its parents.

**[00:27:13]** If it is so, then we use the parent's F cost instead, this one. So this is the so-called max path equation. If we do this, if we apply this max path equation, we will expand fewer nodes. Now let's prove the correctness of A star. since A star expands nodes of increasing F.

**[00:27:47]** If it does not, then we can apply the Paxmat equation. It will eventually reach a goal state. And this is true unless there's an infinitely many nodes with F of n less than F prime of n. And there is an infinite number of nodes only when there is a node with an infinite branching factor or there is a path with a finite path cost

**[00:28:17]** but an infinite number of nodes along that path. A star is therefore complete on locally finite graphs. These are graphs with finite branching factor provided that there is some positive constant delta such that every operator costs at least delta. It can be shown that A star is of exponential complexity unless the error in the heuristic function grows no faster than the logarithm of the actual path cost.

**[00:28:54]** So in this case, we can see that memory space, more than computation time, is the main drawback of A star. But let's now take a look at another toy problem. The end puzzle, or in this case, the 8th puzzle. So what's a good heuristic function for the end puzzle?

**[00:29:27]** These are two popular heuristic functions. One is called the first heuristic function as H1. It's the number of tiles in the wrong position. So, okay. So this is in the wrong position, right? This is also in the wrong position. It's one, two, then three, four, five, six, seven. All the, well, all except one are in the wrong position.

**[00:29:58]** So seven. Okay. Number of tiles in the wrong position, seven. Only this one is in the right position. Now, why is this an admissible heuristic? Because a tile that is out of place must be moved at least once, right? So, okay, suppose we want, so this tile here, 4, is in the wrong position, right? But for it to reach 4, sorry, this place, it has to move at least 1, and we're only counting it 1.

**[00:30:33]** In fact, the actual distance is the actual number of moves, maybe more than two, right? So this is the number of tiles in the wrong position heuristic. It is admissible. Now, is there a better heuristic? There's a better heuristic called the Manhattan distance, which is the sum of the horizontal and vertical distances of a displaced tile from its goal position.

**[00:31:07]** Okay, let's take a look at this tile. Five has to move this way. One, two, okay. Number of steps before it goes to this position, it has to move vertically or horizontally. 1, 2, and then 3, 4. So it's 1, 2, 3, 4. This is just for 5. For 4, 1 here, 1, 2.

**[00:31:41]** So 4 plus 2 plus the number of steps that each of these tiles will have to move in the horizontal and vertical to reach the goal. So this again is visible because the number of steps a tile has to move is at least equal to the sum of the horizontal and vertical distances of the misplaced tile. So obviously the Manhattan distance is a better estimate.

**[00:32:12]** It's closer to the actual number of steps compared to H1, which is the number of tiles in the wrong position. So we are considering two heuristics, and we will see that when we have a better heuristic, we will expand fewer nodes. Okay, so let n be the total number of nodes expanded by a star, and the solution depth is d.

**[00:32:44]** The effective branching factor is defined as the branching factor that a uniform tree of depth D would have to have in order to contain D nodes. Okay, so here you have N as the total number of nodes expanded by the algorithm. And then this B star is the effective branching factor.

**[00:33:14]** So the effective branching factor for a given heuristic is fairly constant over a wide range of problem instances. And obviously we want our heuristic to have a B star or effective branching factor close to 1. Now for the 8th puzzle example, for any node in H2 of N is greater than or equal to H1 of N. This is your Manhattan distance, right?

**[00:33:50]** Okay. And we say that H2 dominates H1. So H2 is closer to the actual number of moves that the tiles will have to move in order to reach their state, the goal state, right? So H2 dominates H1 because H2 is greater than H1.

**[00:34:20]** So the number of the Manhattan distance for any particular configuration is greater than or equal to the number of tiles in the wrong position for the 8-puzzle problem. Okay, now, so your assignment, your programming assignment actually will involve implementing ASTAR. And once you've implemented that, then you will be able to come up with a table like this.

**[00:34:57]** So for A star using the H1 heuristic, the number of tests in the wrong position, if the depth of the solution is six, then you'll have 24 nodes expanded or generated. While for A star using the Manhattan distance, you only need 19. Now, as you'll see that as d increases, this becomes much larger compared to the other one.

**[00:35:33]** So the number of nodes that will be generated by the Acer algorithm using the H1 heuristic will be much larger than using the Manhattan distance heuristic. Okay. And effective branching factor is also better on average. Okay, so yeah, that's a comparison. Now you have to see this for yourself,

**[00:36:14]** because you have to implement the 8 puzzle problem, solve rather, the 8 puzzle problem using A star. Now, if we have a collection of admissible heuristics, h1, h2, hm, that's available for a problem, we can define the following. The heuristic that we will use is the one with

**[00:36:44]** the maximum value among these different heuristics. So for example, we have the number of tiles in the wrong position heuristic, and the other one is Manhattan distance. For that case, it's all the time. The Manhattan distance, it will be bigger in value. So effectively, we will be using the Manhattan distance all the time.

**[00:37:16]** But in case for another problem, you have a collection of these heuristics, and some of them are better or higher in value for certain nodes, then you select the one with the largest value. So if the heuristic function is complex, that computing its value for a node takes as long as expanding hundreds of nodes, a less accurate but simply heuristic function may make the search cost lower.

**[00:37:48]** So another consideration that we need to take into account is to suggest, okay, maximizing this, but then if this turns out to be the one with the largest value, but it takes a long time to compute this, then we would settle for other heuristics admissible heuristics that are simpler to calculate. Okay, so this is the pseudo code for A star.

**[00:38:20]** It actually does not build a tree-like structure that we have seen, rather it uses a list which we'll call open containing nodes ready for expansion and another list that is called closed, containing expanded nodes. So basically what the algorithm does is first put the start node on the list called open, then we compute F of S. Then if the list is empty, we execute failure,

**[00:38:54]** otherwise we continue. Then we remove from that list, that node whose F value is smallest and put it on a list called closed. We call this node N. And if there are ties, we will resolve this arbitrarily, meaning randomly select any of this, but always in favor of any goal node.

**[00:39:26]** Then if N is a goal node, We exit with a solution path obtained by tracing back the pointers. Otherwise, we continue. We expand node N, generating all its successors. If there are no successors, we go back to 2. On each successor, Ni, we compute f of Ni. Then we associate with the successors not already on either open or closed.

**[00:39:57]** and the F values just computed. We put those nodes on the open list and direct pointers from them back to their parent node. Then we associate with those successors that were already on open or closed the smaller of the F values just computed and their previous F values. Then we put on open those successors and close whose F values were thus lowered and redirect to end the pointers from all nodes whose F values were lowered.

**[00:40:34]** Then we go back to 2. So iterating until we exit from here. So here, the beauty of this code is that duplicates are not retained. When the nodes are rediscovered, the ancestor history is updated. And also when a successor is already on open or closed, the algorithm modifies the pointer so that the nodes record the shorter of the two partial paths.

**[00:41:09]** Then some improvements on the basic A-star algorithm. We have the memory-bounded search. For mobile search algorithms, the first thing to give is usually the available memory, and we need algorithms that conserve memory. For A-star, we cannot solve the 16 puzzle in most machines because of excessive space required. A star remember requires exponential space in many

**[00:41:41]** cases. To do to alleviate that problem we have the iterative deepening A star proposed by Corf which is similar probably inspired by the iterative deepening search algorithm in the previous lecture. So a modification of A star that reduces its space complexity from exponential to linear is this ID A star. So what it does very similar to the DFS.

**[00:42:15]** So it performs a series of DFS searches in which a branch is cut off when the cost of its frontier node exceeds a cutoff threshold. It's similar to the DFS, but in the case of DFS, we only use the depth as the cutoff, but here we use the frontier node cost. So the threshold starts at the heuristic estimate of the initial state and is increased each iteration to the minimum value that exceeded the previous threshold until

**[00:42:49]** solution is found. So in terms of time complexity, obviously both A star and Ida star will have the same exponential time complexities. Ida star cannot outperform A star obviously, you know, when it comes to this. So since this one is of exponential time complexity, so will Ida star Then idea star uses space that is proportional to the longest path it explores since it is

**[00:43:26]** depth first. So with idea star we can solve the 15 puzzle but not the 24 puzzle. And its storage requirement is just B times D nodes. This is how it looks like. That's the end of our picture for today.

**[00:44:13]** Thank you.

