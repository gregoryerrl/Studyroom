# Transcript — Lecture_1_What_is_AI.mp4

_Auto-transcribed with Whisper (mlx-community/whisper-large-v3-turbo) on 2026-08-16. May contain recognition errors; repeated segments (silence hallucinations) were collapsed._

**[00:00:00]** Welcome to our first lecture for this course, AI 201, Fundamentals of Artificial Intelligence. So in this lecture, we'll talk about the nature of artificial intelligence and describe the problem domains within AI, history, a brief, very brief history of artificial intelligence, the five laws of intelligent action.

**[00:00:46]** and at the end we will talk about the risks and benefits of artificial intelligence. So what is artificial intelligence? Artificial intelligence is the field of human endeavor concerned with understanding the nature of intelligence and construction of intelligent systems.

**[00:01:17]** By intelligent systems, we mean machines that compute how to act effectively, safely, ethically, responsibly, in a wide variety of novel situations. So it's important to emphasize that the machines that we develop are safe and also are in accordance with responsible AI.

**[00:01:53]** So let's now define artificial intelligence more precisely. There are four definitions following how intelligence is understood. Does intelligence in AI refer to fidelity to human intelligence or to rationality? Or is intelligence a property of the internal thinking of a human being?

**[00:02:29]** or the external behavior of humans. So these are the two axes along which we can define the four definitions of AI. So we have from these two dimensions, human versus rational and thought versus behavior. we have the four definitions.

**[00:03:05]** So the four possible combinations give rise to the different definitions, each of them having adherence, giving rise to different research fields. So these four groups define artificial intelligence as systems that act like humans, or systems that think like humans, or systems that think rationally, or systems that act rationally.

**[00:03:43]** Let's now talk about these definitions in more detail. The Turing Test Approach. Alan Turing in 1950 proposed that a machine is deemed to be intelligent when it exhibits behavior that is indistinguishable from that of a human being.

**[00:04:18]** proposed the following test, which we now call the Turing test. Imagine that you are typing into a computer terminal. At the other end of the line is another, either another person or an artificial intelligence system. You have 30 minutes to ask whatever questions you'd like to ask. If at the end of that time, you cannot reliably distinguish the human from the artificial respondent, then the AI system is considered intelligent.

**[00:04:56]** So this Turing test is even today difficult to achieve because the AI system must be able to, must be capable of discussing a wide range of topics, practically any subject under the sun. You can ask anything about philosophy, anything. And the system or the human being should be able to, of course, answer that question.

**[00:05:33]** Now, if you ask the respondent to multiply two 10-digit numbers, we know that the ordinary human respondent will give an answer after five minutes say or that the answer might even be wrong so that's normal probably we've forgotten a bit our

**[00:06:04]** multiplication table or there's what you call human error so now if the answer is wrong then ah you're a human being so while a computer of course can can answer can give the answer to that in in less than one second why because humans are not very good at this multiplication task

**[00:06:35]** And a wrong answer might mean that the respondent is human. For Turing, artificial intelligence is equated to intelligent behavior, which is the ability to achieve human-level performance in all cognitive tasks sufficient enough to fool an interrogator. interrogator. So that's

**[00:07:06]** what this is saying. That the Turing test basically says that intelligence is equated with intelligent behavior. The ability to achieve human level performance in all cognitive tasks. Sufficient to fool an interrogator. Again, there is emphasis on action. There is emphasis on behavior.

**[00:07:39]** That's the Turing test approach. Now, when Turing proposed that test, this was way back in the 50s. And at the time, the machine was just a simple computer with maybe a teletype.

**[00:08:11]** Probably none of you knows what a teletype machine is, but it's like a typewriter. So nowadays, we don't have teletype machines anymore. By the time, that was the most advanced machine that was available. So to pass the modern version of the Turing test, our machine must have the following capabilities. It should be able to communicate to us successfully in a human language.

**[00:08:47]** So instead of typing into your teletype, you now speak to the machine. So there's a microphone, and you speak to the machine using that microphone, which is like the equivalent of the ear of your computer. And when we say human language, it's not computer language. human language. It could even be in Filipino or Cebuano or whatever language you like.

**[00:09:24]** The machine should also be able to represent and store knowledge in a symbolic or non-symbolic way. So that's what's called knowledge representation. and the machine should be able to draw conclusions from available knowledge using either induction or deduction. That is what is called automated reasoning.

**[00:09:55]** And the machine should be able to detect and extrapolate from patterns as well as learn how to adapt to new situations. That is what we call machine learning. The machine must likewise be able to perceive the world using cameras, using microphones. It is the subject of computer vision and speech recognition. And finally,

**[00:10:29]** the machine must be able to manipulate objects and move around move about in the world that is the area of robotics so these are the six subfields which constitute the major disciplines within artificial intelligence NLP, knowledge representation, automated reasoning, machine learning, computer vision, speech recognition, and robotics.

**[00:11:12]** Now let's go to the second definition, the cognitive modeling approach. In the cognitive modeling approach, AI is equated with human thinking. We know that this is very challenging because this requires us that we get inside the actual workings of the human mind through introspection or psychological experiments.

**[00:11:52]** And using this, we construct theories of the workings of the human mind, which can be verified using computer programs. We would like to come up with testable theories of the human mind. We can also use brain imaging techniques. and in recent years there have been attempts to understand and even read

**[00:12:23]** our thought processes using brain activity monitoring devices such as functional magnetic resonance imaging and EEG. So all these observe the brain in action. All these attempt to read the mind. Where we want to monitor brain activity, blood flow, glucose consumption, etc.

**[00:12:57]** while the person performs certain mental tasks. Now, once a precise theory of the mind has been made, It can be expressed as a computer program. If the program's input-output behavior matches the corresponding human behavior, it is evidence that the program's mechanism could be similar in humans.

**[00:13:31]** So that's your cognitive modeling approach. Now in the next definition where AI is equated with loss of thought, This loss of thought approach is based on Aristotelian logic that uses deductive reasoning to arrive at the conclusion using modus ponens, modus tonens.

**[00:14:11]** so for Aristotelian logic what we have are syllogisms what is a syllogism it is a formula of argument consisting of two propositions the premises and a conclusion that is logically drawn from them so here you have a major premise all men are mortal minor premise, Socrates is a man.

**[00:14:45]** And from this, we're saying the formula is like a mathematical formula. It's always true. It's always correct. We arrive at the conclusion. So if the major premise is correct, the minor premise is correct, then the conclusion is necessarily correct. It's like a formula. You just apply mathematical formula and you get the answer. This is how syllogisms work.

**[00:15:16]** Syllogisms always give correct conclusions provided that the premises are correct. And for AI, we have formal logic, first order predicate logic, for example, which we will study also. that will provide us a precise notation for describing correct reasoning. So in the laws of thought approach, we are concerned with how to obtain correct inferences.

**[00:16:00]** So finally, we have the rational agent approach. And this is what we'll be using. In this approach, intelligence or artificial intelligence means acting rationally so as to achieve one's goals given one's beliefs. so you have a goal and you have a belief about the world beliefs about the world

**[00:16:32]** so given these truths you arrive do some actions in the world environment so that you are able to achieve your goals so the book's definition of AI is the following AI is the study and construction of rational agents.

**[00:17:04]** And forming correct inferences is just one way of acting rationally. It's like the loss of thought approach, your syllogisms. Yeah, that's correct. it's great but we are not reasoning logically all the time to arrive at the conclusion. Very often we just do what we are supposed to do without even thinking because in many situations there

**[00:17:40]** is no probably correct action to perform and yet it's necessary to do action. So very often we just do what we're supposed to do without really logically reasoning out the individual steps that we need to undertake in order to achieve our goal or to finish our task. So we could say that part of intelligence is knowing what to do when one does not know what to do.

**[00:18:14]** Therefore, making inferences is just part of rationality. So what is rationality? Well, there are two types of rationality. First is perfect rationality, which means always doing the right thing all the time. And for a computer, this is not possible, especially in complicated environments, because the computational demands are just too high.

**[00:18:51]** So you cannot possibly consider all the possible scenarios, because it would take a long time, and that would take a lot of computational resources. So we cannot be perfectly rational. There's this concept by Herbert Simon, which he proposed in 1957, the concept of bounded or limited rationality.

**[00:19:26]** This is basically a theory, an economic theory, that consumers have limited rational decision making. Therefore, they're driven by three main factors, their cognitive ability, time constraint, and imperfect information. Since not all consumers have perfect information, and since consumers have a time constraint,

**[00:19:58]** and also that consumers of non-infinite cognitive abilities, consumers do make suboptimal decisions. They're influenced by moods, by emotions. So Simon proposed satisficing behavior.

**[00:20:32]** Satisficing means having the decision-making strategy aiming for a satisfactory or adequate result rather than the best result, the optimal result. Pwede na. So, pwede na is, in a way, is bounded rationality because we do not have the time, we do not have the resources, we do not have enough information,

**[00:21:04]** so we do a satisfying behavior. Instead of exerting maximum effort towards attaining the ideal outcome, we focus on good enough or satisfactory solutions. That is satisfying behavior. And that is because we have to act under bounds of time and space. okay so if you're talking about computers computer has to

**[00:21:37]** have a finite memory resource so you cannot have a lot of space to do the computation memory for your computation or that you cannot take your time computer taking time computing taking a week just to get the best solution, the optimal solution. We don't want that. We'd rather get a computer that gives us the answer,

**[00:22:10]** the suboptimal answer in a few seconds because that's what we need. We need to decide after a few seconds. We cannot wait for a week. Even though after one week of computation, you know, that that is the best, the best solution that you can come up with. So let's talk about a little bit regarding the history of artificial intelligence.

**[00:22:41]** So in the inception phase of AI, we're in the 40s, early 40s, up to the mid 50s. So these are the major milestones. In 1943, Makilov and Pitts developed the computational model of the neuron, which later on became very important. It gave rise to the neural networks and eventually deep learning.

**[00:23:13]** In the 50s, Minsky and Edwards developed SNARK, which is the first ever neural network computer using 3,000 vacuum tubes. So that was in 1950. So the first neural network computer in hardware. And in 1950, Turing proposed a Turing test. And also around this time, he already has conceived of programs that learn from data

**[00:23:56]** rather than from hard-coded intelligence. So he already saw machine learning. and then also he warned that achieving AI might not be the best thing for the human race he already saw in 1950s during that the dangers of AI this was in many many years ago in 1952

**[00:24:27]** we have the first checkers playing programs And another milestone was made in 1956 during the Dartmouth College AI workshop, which is widely considered as the founding event of AI. This was the first time that the word artificial intelligence was mentioned by John McCarthy. So this workshop in 1956 is like the start of AI.

**[00:25:03]** And also in 1956, as a result of this workshop, Simon developed his logic theorist, a program that is able to prove mathematical theorems. Imagine a program that can already prove mathematical theorems. That was in 1956. And in fact, he, he, this logic theorist was able to come up with a proof that was shorter than the proof of a mathematical theorem of Bertrand Russell.

**[00:25:49]** so Bertrand Russell proposed made a mathematical theorem and made a proof as well but then this logic theorist came up with a shorter proof which Simon submitted to a journal and it was rejected because they didn't really believe that the machine could probably do theorem proving So that paper was rejected.

**[00:26:22]** Yeah, again, if you're interested in history, the history of AI, I invite you to go to this website, just use this link, and there are many interesting articles about the history of AI. So in the early 50s down to 1960, the late 60s, there were great excitement about AI and also great expectations.

**[00:26:55]** So in 1952, we had the first checker playing program that uses reinforcement learning. And then in 57, the perceptron convergence theorem was developed and proved by Rosenblatt. Then in the next year, we have a new language specific to artificial intelligence.

**[00:27:28]** It's called LISP, which people use for the next 30 years. Then in 59, the GPS or general problem solvers solve puzzles like a human being. In the 60s, we have this Adeline, micro world, especially the blocks world, which produce a lot of papers in vision, in constraint propagation, NLP and planning.

**[00:28:02]** Then these two guys put together neural elements and show that these elements can actually represent the concept. In 1965, we have Robinson's resolution principle for first order logic. So there are basically two main branches of two camps, you might say, of artificial intelligence.

**[00:28:35]** Even up to now, they're still there. The symbolic AI and then the non-symbolic AI. The symbolic AI camp believe that you need to have symbols for artificial intelligence. Intelligence needs symbols that can be manipulated. And the symbols are the ones that give rise to occlusions.

**[00:29:06]** AI is basically about manipulation of symbols. And you can see that also here. And the other one is non-symbolic, which means, especially at the time, neural networks or connectionist models. So neural networks, you don't know what's going on inside. on inside, there's no symbol there, they just wait. So these are the two camps. And these

**[00:29:39]** two camps were basically vying for funding from the different government funding agencies. They're trying to produce results, trying to outwit the other camp. So this is this checker playing, using reinforcement learning that belongs to the symbolic. Then this is connectionist or non-symbolic.

**[00:30:10]** This obviously is symbolic. Then in the 60s down to the mid-70s, the hype was gone and it was because there was overconfidence of the researchers promising performance, great performance of systems.

**[00:30:41]** But this performance, great performance, were just made on simple examples like the micro world. They were not scalable. For theorem proving, for example, you cannot prove theorems involving more than a dozen facts. And then also for the neural network side, the connectionist side,

**[00:31:12]** Minsky and Poppert showed mathematically that the perceptron cannot learn the exclusive or operation. and then also there was this light hill report in that emphasized the failure to come to grips with combinatorial explosions so you have many of these algorithms require searching through search space and this space is simply just exploding combinatorially and at that time

**[00:31:47]** people were not able to deal with that yet. So that was emphasized in the Light Hill report. And because of that, the AI winter was triggered by this report, the Light Hill report in the UK and the ALPAC report in the US, thereby reducing funding for artificial intelligence research. So this is the AI winter.

**[00:32:19]** Then in the 60s down to the mid 80s, artificial intelligence was back with AI with expert So you have the dendral expert system, which is a chemical analysis expert system that hypothesize substance molecular structure.

**[00:32:51]** And this was cool because it tried about chemical experts at this task. Then you also have the myocin expert system, which is a backward chaining expert system with a knowledge base of around 600 rules. It can identify bacteria that causes severe infections. And also it could recommend antibiotics with dosage that's adjusted for the patient's body weight.

**[00:33:28]** Then in the 80s, 82, we have R1, the first commercial expert system, which is a rule-based production system. Also in the same year, the Japanese fifth-generation project, whose objective was to create computers using logic programming, especially based on Prolog, the language Prolog, together with massively parallel computing.

**[00:33:59]** So you have these huge machines doing parallel computation but processing prologue. So that was the fifth generation project of the Japanese government, which run for about a decade. They produced very good results. However, it was a commercial failure. So companies didn't really want to make use of this, the results,

**[00:34:34]** and probably too expensive. Now we are in the deep learning age. Deep learning, as we know, is based on neural networks. There was a probabilistic reasoning. So in the 80s, we saw the HMM, hidden Markov models.

**[00:35:06]** And these models were very successful for speech recognition. In 1982, Vapnik and Chervonenkis made important contributions to learning theory and proposed the so-called VC dimension. Then in the mid-80s, we had the backpropagation algorithm by Rumenhardt, Hinton, and Williams.

**[00:35:37]** later on they discovered that somebody else proposed the same algorithm in the 70s in the mid 70s it was actually a master's thesis but since no one was reading that master's thesis the rest of the world did not know the backpropagation algorithms it was rediscovered or reinvented about a decade after. In 1988, we had the Bayesian networks

**[00:36:10]** by Judea Pearl of UCLA. Also in the same year, Sutton's reinforcement learning book was published. And in 1992, the support vector machine was proposed by Vapnik. continuing that in 2011 IBM's Watson can already answer questions

**[00:36:47]** post in natural language and in fact it competed on Jopper D just like a quiz contest and won first prize $1 million against human champions And then afterwards, IBM sold it to this hospital or this cancer center in order to help make decisions in lung cancer treatment.

**[00:37:23]** In 2012, we have AlexNet, which started the deep learning craze. In 2014, we had the Generative Adversarial Network by Goodfellow. The following year, RestNet 152 exceeded human performance for ImageNet. So this network can beat humans in recognizing objects.

**[00:37:56]** And in 2016, AlphaGo won over human players. Following year, 2017, self-supervised learning was born. And also in the same year, Google Brains Transformer Architecture was proposed. So here are some AI problem domains and their attributes. Puzzles, crossword puzzle for example.

**[00:38:30]** Knowledge content would be poor. Data rate is low. Response time is ours. Chess, knowledge content is medium. Data rate is low. Response time in minutes and so on. So for vision, the knowledge content is very rich. The data rate is very high, especially if you have video, so many mbps.

**[00:39:02]** Then the response time that is expected is quite often real time. The same with the speech. Chess. Chess is an excellent testbed for developing search algorithm. So we will study search algorithms after two weeks from the third lecture and we'll discuss different search algorithms. And this is a very good testbed because there are more than 10 to the 123 possible moves.

**[00:39:38]** In which case, brute force exhaustive search will not work. This is a huge number. This is larger than the total number of particles in the universe. Particles. Not atoms, but particles in the universe. And you're talking about photons included, light. Light particles included. the protons, protons, all the particles.

**[00:40:09]** The number of particles is just there in the vicinity of 10 to the 80-ish. Still a very small number compared to the number of possible moves for chess. So let's take a look at the brief history of the chess programs developed over the years. So in the 50s, these guys developed the first operational chess program. Then in the 60s, you have this chess program that won a game in a regular chess tournament, beating a Class C player.

**[00:40:49]** In the 70s and 80s, there were these systems, Northwestern Bell and HITECH systems that achieve SM or Senior Master Rating. The first system to achieve Grand Master status was Deep Thought developed at CMU. And IBM developed Deep Blue, which lost to Kasparov 4-2 in 1996. But the following year in 1997, Deep Blue won over Kasparov.

**[00:41:24]** Kasparov. So very significant. This is an important, very important milestone in the history of AI that an AI machine has won over the number one chess player in the world, the world's champion. So it was written by Deep Blue. So chess research is important because it has led to a number of search algorithms such

**[00:41:56]** as alpha beta search, V star search, single extension search. And many of these search concepts have found their way into everyday applications. Go. Go is a game that is more difficult. It is a more advanced testbed for developing reinforcement learning algorithms.

**[00:42:27]** There are more than 10 to the 361 possible moves for Go. So the first series attempt in Go, computer Go, was made in 2007 where the Monte Carlo research algorithm for Go has developed. In 2010, we have this system that won against a human player. In 2011,

**[00:42:57]** Zen won against a Japanese player. In 2013, the Go playing machine called Crazy Stone beat Ishida in 2015 AlphaGo beat the European Go champion Fanhui and in 2017 AlphaZero beat the best

**[00:43:29]** Go player in the world and also in the same year the Leela Zero was released It's a free and open source Go program. So if you're interested, you can download this and check it out. Examine its innards. Modify it to your heart's satisfaction.

**[00:44:00]** So this is AlphaZero, developed by DeepMind in 2017. AlphaZero, by the way, can play chess, Go, and Shogi. Here are some comments from the top chess players. According to Kasparov, it was a pleasure to watch AlphaGo play, especially since its style was open and dynamic like his own. And another top-rated chess player said that AlphaZero played like a superior alien species.

**[00:44:40]** So the company, DeepMind, issued a statement saying that the game of chess represented the pinnacle of AI research over several decades. State of the art programs are based on powerful engines that search many millions of positions, leveraging on handcrafted domain expertise and sophisticated domain adaptations. On the other hand, the AlphaZero program that DeepMind developed is a generic reinforcement learning algorithm, unlike these other state-of-the-art programs which required tuning, sophisticated domain adaptation.

**[00:45:28]** While the generic RL program for Go was originally devised for Go, and it achieved superior results within a few hours only of training, searching a thousand times fewer positions, given no domain knowledge except the rules of Go. So it plays against itself. And I learned the rules, of course. Well, the rules are

**[00:46:03]** hard-coded, but there's no domain knowledge that was used by this AlphaZero program. It's generic. You can use it for chess, for shogi, and whatever favorite game you wish. Then speech recognition. So speech recognition is several orders of magnitude more complex than

**[00:46:37]** tasked with low data rates and with or without time constraints. In other words, speech recognition is far more complex than playing chess. It has to operate in real time, must explode vast amounts of knowledge, must tolerate error and imprecision, must learn language, must use language, must learn from examples. So,

**[00:47:07]** tolerate imprecision and error. When a person is talking in whatever language, that's not perfect grammar. Almost no one speaks with perfect, totally perfect grammar. Even the native users of the language speak with ungrammaticality, with imprecision. Yet, the human mind is able to decode the information that we have, that we wish to communicate.

**[00:47:41]** So for speech recognition, it should be able to tolerate error and imprecision. Now, research into speech recognition provides insights into the structure of intelligent agents, especially as regards how the systems can deal with incomplete, inaccurate, and partial knowledge in problem solving, because that is the nature of speech.

**[00:48:12]** It's incomplete, inaccurate, and partial. Very challenging. In the 70s, we had these systems, the Harpy hearsay, HWIM connected speech systems that use syntax and semantics as major knowledge sources. Then Sphinx 3 of CMU had a 50,000 word vocabulary on a voicemail dictation task.

**[00:48:43]** It run real-time on a Pension Pro PC. So this is a very old processor, Pension Pro. It's speaker-independent as well. In 2002, the DARPA had the EARS program, which actually is dropping into the conversation of people. it's able to detect keywords in telephone conversations reliably.

**[00:49:17]** In 2007, you had the CTC or the Connectionist Temporal Classification algorithm, which was the basis of future Connectionist algorithms for speech recognition. So in 2015, the Google Voice program was released and it exhibited dramatic performance trump of 49% using the LSTM neural network.

**[00:49:49]** The speech recognition led to basic techniques such as blackword models, hidden Markov model based learning, beam search and CTC. Vision. The goal of computer vision is to understand the world, automatic interpretation and understanding of image data and construction of 3D models from real world scenes.

**[00:50:21]** The task complexity for vision is about two orders of magnitude more than that of speech. So these are the important visual tasks. Recognition, manipulation, and mobility. So we need to see in order to recognize objects around us. We need to see so that we can manipulate objects, doorknob, switch on and switch.

**[00:51:00]** That's manipulation and mobility. We need to see in order to navigate successfully in the world. Robotics, what is a robot? A robot is an active artificial agent whose environment is the real world. So nowadays, computer-controlled manipulators, which are robots, are routinely used in many manufacturing environments. of special interest nowadays are autonomous mobile systems,

**[00:51:35]** also known as robotic vehicles. So these systems are challenging because challenging to construct because they require several disciplines together, such as vision, advanced sensors, high-speed processors, planning, control, learning, and so on. So you need to put these disciplines together in order to come up with autonomous vehicles.

**[00:52:09]** One of the first important autonomous systems was the NAVLAB5, a commercial van from GM, modified for autonomous steering. It navigated correctly 90% of the time from Washington, D.C. to San Diego, California in 1995. When in doubt, the system asks the human driver to take over. In 2010, we had the VisLab.

**[00:52:40]** the first intercontinental land journey was completed by autonomous vehicles from this lab. So the vehicles, autonomous vehicles traveled from Parma, Italy to Shanghai, China in 100 days. Nowadays, you have lots of companies making these autonomous vehicles.

**[00:53:11]** You have Waymo, GM, Pony AI, Zoops, and so on. Now let's talk about the five laws of intelligent action. The first law is the following. It states that bounded rationality implies opportunistic search. You've learned that bounded rationality

**[00:53:41]** forces the intelligent agent to just aim for a good enough solution because of computational constraints. So when intelligent agents operate under conditions that overload computational resources, opportunistic strategies and tactics of least optimal, least computational search rather than optimal shortest path search are deployed.

**[00:54:17]** so you're not going to aim for the shortest path but you're going to aim for the optimal least computation search by analogy it's like going to to say uh say Makati and there's traffic so you're not going to aim for the shortest path anymore because there's traffic so you're going to aim for the shortest time. So even if you have to go to the side streets, that's okay,

**[00:54:50]** because you are going to optimize your time, spend more gasoline, perhaps, because you're traveling longer on the route, but then you'll arrive faster at your destination. So there's research focusing on algorithms that approximate algorithms that for optimal research computation, this optimal computation research.

**[00:55:27]** Then the second law is that of physical symbol system. A physical symbol system is a necessary insufficient condition for intelligent action. So this law has been challenged by several researchers. So what are physical symbols? Symbols that are realizable by engineered components. And a physical symbol system is a set of these entities.

**[00:56:00]** Now, a structure, symbolic structure can be built using this symbol system. And operations on this expression include creation, modification, reproduction, and destruction of symbols. And these expressions can now be interpreted as plans of action. Some researchers have actually criticized that this is not really necessary for

**[00:56:33]** intelligent action. So it really is debatable. Okay, another, the third law of intelligent action is the following. The magic number is 70,000 plus 20 000. So what does this mean? That an expert for example knows around that much chunks of information and this number is a good guide for us to measure the size of an expert's knowledge base.

**[00:57:07]** So if you're building an expert system then you know more or less that if you have this much information, this number here, then you know that you've reached the top. And this is supported by experimental evidence in cognitive science. For example, the vocabularies of college graduates is around that many. It's not 10 times, it's not a million. It's around this number.

**[00:57:42]** The knowledge base of expert systems grows towards tens of thousands. And it has been observed that no human being reaches world-class status without at least a decade of intense full-time study and practice in the domain. So even if you're a genius, if you don't work very hard for 10 years, more or less, then you can't really become world class because remember that there are many geniuses

**[00:58:14]** outside. You're not the only one. The ones that work hard these are the ones who are considered world class. Another equivalent statement of this is the 10,000 hour rule that unless you have spent 10,000 hours on that subject matter, on whatever that field is, then you really

**[00:58:44]** can claim that you are an expert. So even the most talented do not reach expert levels of competence without immense effort. And therefore, it's just if it is 10 years, then there's only enough time. There's only enough time to be an expert in only two or three other areas of your life, of our lifetime. So this is 30 years. 30. Then we have the fourth law. Search compensates

**[00:59:23]** for lack of knowledge. So these two are like opposites. Search versus knowledge. So if you lack knowledge, you do more search. If you have a lot of knowledge, you basically will have reduced search. So what is search? Your search is trial and error behavior. When faced with a puzzle we have never seen before, we engage in trial and error behavior until a solution is found.

**[00:59:54]** And then if we, since we have found the solution, if we are given the same puzzle as before, you already know the solution, you already know the knowledge, there's no more trial and error. It's obvious, but we need to state it here, because these two are really quite opposite. So in the 60s and 70s, it was believed that master's level performance in chess cannot be achieved except by codifying and using the knowledge of expert human players.

**[01:00:28]** However, Deep Blue's knowledge database is very small compared to that of a chess master. So the knowledge base of Deep Blue is just the opening and end games. So the database is just that for opening and end games. The rest are processed on the fly by Deep Blue. So what this is saying? That, okay, Deep Blue has a small database, knowledge database, lack of knowledge.

**[01:01:03]** And therefore, it has to search. It has to do more search, more effort in searching through possibilities. So lesson that we can derive here is the following. that it is possible to achieve expert-level performance even with little knowledge as long as it could be compensated by search. So Deep Blue is a very small database, very small knowledge. Therefore, we'll have to compensate for that by doing a lot more search.

**[01:01:37]** For example, Deep Blue computes 200 million possible moves per second for a duration of two minutes before choosing the best, the so-called best move. It's not really the best move because no one knows the best move. To be able to get the best move, you have to compute all the way to the end. And with 10 raised to 1, 2, 3 possible moves, that's not within the capabilities of your computational device.

**[01:02:12]** So the best is good enough move. Given the amount of effort that you have put, which is 200 million moves per second for a duration of two minutes. So in natural language processing, search can compensate for incomplete and inaccurate knowledge. So that's how we deal with incomplete and inaccurate knowledge.

**[01:02:43]** For example, the word take has many meanings. Take a shower, take a book, take a bus, and so on. Now the precise meaning can be clarified by context through the exploration of the alternatives until the meaning is unambiguous. So this law basically tells us that when faced with a situation in which knowledge is yet to be acquired and codified, search is a very good way to proceed.

**[01:03:22]** Then finally, the fifth law is the opposite of the fourth law. Knowledge compensates for lack of search. So when you have knowledge, that knowledge reduces uncertainty and constrains the exponential growth of search needed to solve problems. So you avoid combinatorial explosion through knowledge. For example, try to solve the Rubik's Cube.

**[01:03:52]** So most people will take half an hour or more to solve this puzzle. But with practice, you gain more knowledge about the problem-solving process. And therefore, the time is reduced with practice. So gain more knowledge, you do less search, then therefore less time to get the solution. So importance of knowledge in speech recognition for the Sphinx 3 of the CMU system.

**[01:04:32]** If you turn off the syntactic knowledge source, you'll get sentences of the form sleep, roses, dangerously young, colorless, which is absurd. This becomes legal. And the error rate increases from 4% to 30%. So 30% because this sentence is absurd. I mean, it doesn't mean anything. Now, if you, on the other hand, remove

**[01:05:02]** the probabilistic knowledge about frequency of word occurrences, the error rate increased to only 6%. So these are the five laws of intelligent action. just some terminology that would be important for us. And any time algorithm is an algorithm that can be interrupted anytime and will return results whose value

**[01:05:35]** monotonically increases with time. This means that if a program is running and after one minute I interrupt it, give me your answer. It gives me an answer. is not the perfect answer it's a good enough answer but then after if i then after another minute or after five minutes of more computation if i interrupt it again it will give me a better answer which is what is meant by results whose value monotonically increases with time so

**[01:06:14]** So results whose quality monotonically increases with time. That's your anytime algorithm. And any space algorithm, on the other hand, can work with arbitrarily low memories and guarantee optimal solutions upon termination. So grand challenges of artificial intelligence, translating telephone,

**[01:06:44]** example of that would be a Japanese speaker conversing with an English speaker in real time. So the Japanese speaker speaks in Japanese and the other end, the English speaker hears that speech that what the Japanese said, but this time in English in real time, it's like automatic translation. So translating telephone, this requires a large vocabulary

**[01:07:14]** that must be capable of translating unrehearsed continuous speech. It also requires a natural sounding speech synthesis module that preserves the speaker characteristics. And the MLP system must deal with ambiguity, non-grammaticality, and incomplete phrases. Second challenge, accident avoiding car. So this requires advances in vision and sensor fusion, using together information from your

**[01:07:51]** cameras, from your laser, sonar, and many other sensors. We should be able to do obstacle detection and avoid these obstacles. learning systems. So basically robots that can learn, for example, to assemble an appliance by observing a person do the same task. So like you show the robot an example of how to do things, and it learns from that, from your demo. Like a child watching you do something,

**[01:08:29]** the child learns right away. So we want that robot to have that capability as well. So this is still this is still a holy grail for us. This requires advances in vision, language, problem solving, and learning theory. Then you have also that challenge of self-replicating systems that are important for manufacturing in space. So systems that can produce many cars, vehicles,

**[01:09:05]** automatically. And this requires advances in knowledge capture for reverse engineering and replication, robotics technologies for control, diagnosis, monitoring, and repair of machinery. And finally, we come to the risks and benefits of AI. So, you know that AI could be used

**[01:09:37]** could be misused. So you probably have seen movies about autonomous weapons. So lethal autonomous weapons. A small group of people, terrorists, for example, can deploy an arbitrarily large number of weapons against human targets defined by some recognition criteria. So it's a basic recognition capability, these weapons, and then when it sees

**[01:10:08]** certain people, it automatically kills that person, these people. Then AI, unfortunately, has been used for surveillance and persuasion, monitoring of individuals in a massive scale, giving rise to privacy concerns and issues, and we know all too well that using machine learning we can tailor information flows

**[01:10:40]** through social media that can modify political behavior such as voting and this was made possible in 2016 so I think 2016 is the year that this was made possible through machine learning you can now fool people and make people think make them vote for a particular candidate of your choice

**[01:11:12]** and actually this is being used in a lot of countries so then you have biased decision making decisions that are biased by race gender, or other protected categories. And this bias might arise especially from data. Simply the data already contain the biases. So that's why the algorithms just learn from the data and decide, make decisions that are biased.

**[01:11:50]** Impact on employment. So jobs taken over by machines due to automation. Will the call center industry collapse? There are AI systems that can take over their jobs. We don't know. Then also we need to look at the safety critical applications of AI. because there might be accidents by autonomous vehicles or that for healthcare there might be

**[01:12:28]** mistakes and who's going to be responsible. Then lastly, cybersecurity, machines, machine learning rather can be used to lure users into using malware and machine learning can create highly effective tools for personalized blackmail. So with that, we end our lecture for today.

**[01:13:17]** Thank you.

