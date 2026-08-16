# Transcript — Lecture_2_Intelligent_Agents.mp4

_Auto-transcribed with Whisper (mlx-community/whisper-large-v3-turbo) on 2026-08-15. May contain recognition errors; consecutive duplicate segments (silence hallucinations) were collapsed._

**[00:00:00]** In our previous lecture, we talked about the notion of intelligence. We also talked about the four different definitions of intelligence in AI. And for this course, we adopt the one that equates intelligence with rational behavior. We also assume that the agent has limited computational resources

**[00:00:40]** and depart from perfect rationality. This results in what is called satisficing behavior, where the focus is on generating good enough solutions rather than attaining the best possible outcome, which requires maximum effort. So in this lecture, we further examine the characteristics of

**[00:01:13]** these agents with bounded rationality. And we call these agents intelligent agents, as well as their interaction with the world, which we call the agent's environment. Here's the outline for today's class. We first discuss the notion of intelligent agent and environment. We then talk about the different types of agents, starting with the simplest ones

**[00:01:53]** to the most advanced type that involves learning. And towards the end, we examine the different properties of environment. So here's an agent. What is an agent? An agent is a system that perceives its environment through its sensors and acts on that environment through effectors. So here you have your

**[00:02:26]** environment. And environment is the source of percepts. The sensors detect the percepts. And these percepts are processed by your agent program here. And then the agent does computation and generates an action. And these actions are carried out through the effectors of the agent.

**[00:03:06]** These effectors act on the environment and modify the state of the environment. And this is a loop. So the agent is in an environment. It's continually receiving percepts, processing these percepts, and generating actions that modify the environment. So these effectors, these are the parts of your agent that interact with the environment so as to modify the state

**[00:03:43]** of the environment. So the environment. Some examples of agents. You have your human agent. The sensors are the eyes, ears, skin for touch, nose for smelling, tongue. So these are the five senses. And then the effectors are hands, legs, mouth, etc.

**[00:04:13]** So this is for your human agent. The prototypical intelligent agent in AI is your robot where you have your sensors as well as effectors. So the sensors are usually the ubiquitous camera. It could be your laser range finder. It could be your microphone to listen to the sounds.

**[00:04:44]** So the effectors are the effectors. The sensors are the wheels of the robot, the robot arm. Anything that would generate action in the physical environment of the robot. It doesn't have to be a physical robot. It could be a software robot called the softbot, where your input could be text with strings and your output are likewise text with strings. The software or the softbot rather

**[00:05:25]** have the internet for its environment. So you could have your software for efficiently browsing the internet. You could have your Google search engine where the search engine accepts as inputs some text text and generates some outputs. It could be a document or even set the pictures.

**[00:05:59]** So the Google search engine is basically sort of navigating in that environment, which is the internet. So it takes text, takes pictures, stored information from servers and makes use of this information and throws it back to the user. So that's your agent.

**[00:06:31]** So let's now talk about the generic intelligent agent. A rational agent is an agent that acts rationally so as to achieve one's goals given one's beliefs. So an agent has an advanced agent, his goals. We shall see that later. And it also has assumptions about the environment. These are beliefs, what we call beliefs.

**[00:07:04]** No, nothing to do, nothing to do with religious beliefs. It's just, it's a terminology. Basically, it's about knowledge about the environment. So it could be that the robot thinks the environment as a two dimensional surface, the floor, for example. That's, that's good for most types of robots. But if you have robots. But if you have a flying robot or a drone, then that's no longer valid.

**[00:07:36]** So in that case, the world is modeled as a three dimensional space. So it has certain assumptions about the environment. And these are, again, we, what we call beliefs about the environment. So it's about the environment. Now it is necessary to measure achievement of goals. For this, we must evaluate how successful the agent is

**[00:08:09]** and when it was the way to achieve goals. So the how and the when. Let's talk about the how. The performance measure indicates how successful the agent was. For example, let us consider a vacuum cleaning agent. Nowadays, you can buy this vacuum cleaners that are

**[00:08:42]** supposed to be smart, intelligent, they move around your room, sucking dirt. And okay, so for this agent, for the vacuum cleaning agent, we can measure the performance by the amount of dirt cleaned up in a day. So that could be performance measure for that agent.

**[00:09:14]** So we want to consider the electricity that is consumed. We want it to be green, doesn't consume a lot of power, and also it doesn't consume, it doesn't generate a lot of noise. So these are performance measures that we could use to indicate or measure how successful the vacuum cleaning agent is. So it's not just important to measure performance.

**[00:09:47]** It's also important to determine when the agent is able to achieve its goal. Or more specifically, when to measure, when to evaluate performance. So for example, if I give a surprise exam at the start of the class, obviously the ones who will perform well are the ones who will with good study habits.

**[00:10:18]** Not necessarily the ones who are really very smart. Of course, very smart ones, they don't even need to study. But even if you're not really the smartest, you can get very high grades. You can even be the smartest in the class. If you have a good study habit. So when to evaluate performance is therefore important.

**[00:10:48]** Now, when we talk about performance of irrational agent, it must be measured given what has been perceived. What has been perceived by the agent. Think of the student as an agent. So the student receives lectures in AI. But if the teacher asks questions that have no relation to AI,

**[00:11:21]** then the student might not perform well. Even if that student studied a lot. So again, what has been perceived, what was in this case, what has been taught in class. What is rational at a given time depends on the following. Performance measure. Perceptual history or percept sequence. So this means everything that the agent has perceived so far and stored in its memory.

**[00:11:57]** We can call that experience as well. Then we have knowledge of the environment. So this knowledge of the environment could come from the programmer itself. The programmer has encoded some prior knowledge into the agent. Or it could be knowledge that is learned by the agent as it navigates the environment.

**[00:12:30]** And then finally, the actions that the agent can perform. So obviously, we don't expect a person to fly. But because the person, a human being, doesn't have that capability. But a bird has that capability. So the available actions to the agent would be important in measuring rationality.

**[00:13:01]** The agent's choice of action at the given instant depends on all these four. But not on anything that does not yet being perceived. So it's unreasonable for us to expect that the agent will behave.

**[00:13:33]** So the person will make a decision or make an action on something that is not yet being perceived. Now, the AI designer, AI programmer, must design performance measures

**[00:14:03]** according to what the agent would want to achieve in the environment. Rather than according to how the designer thinks the agent should behave. So for example, the designer just blindly assigns for its performance measure, performance measure, the performance measure of a vacuum cleaner,

**[00:14:36]** as the maximum amount of dirt collected. So the agent would just move around, suck the dirt, and then spill it out again, and then collect the dirt, spill it out again, and so on. So basically, it's maximizing the amount of dirt collected, right? But the designer on the other end should rather think of having a clean floor as the performance measure.

**[00:15:17]** So the agent's policy should be removed. The performance measure should be based on what you want to achieve, rather than on how the designer wants the agent to behave. So therefore, we must be aware of what is called unintended consequences.

**[00:15:51]** Unintended consequences, for example, the maximizing of the amount of dirt collected. So if you hard code that into your vacuum cleaner, then you might have the unintended consequences of just dumping the dirt and collecting the dirt again, and so on. So this issue is crucial, especially in reinforcement learning. So we'll talk about this in the future.

**[00:16:23]** And in fact, there's a course that's just all about reinforcement learning. Rationality is not the same as perfection. Because rationality aims for maximizing the expected performance. While perfection maximizes actual performance.

**[00:16:53]** So actual performance. And this is not possible. It's only possible in a simplified, idealized environment, in a simple one. But in many cases, in most cases, in fact, environment is a challenging environment. And therefore, perfection is simply not possible. So rationality, again, maximizes the expected performance of the agent.

**[00:17:28]** We have the notion of information gathering, where the agent performs actions in order to modify future percepts. And this is part of the irrational. So one example of this would be exploring the environment. So the agent probes the unknown environment. For example, it would be in the form of a robot mapping the physical environment.

**[00:18:02]** Looking around, moving around, gathering information, so that this information is actually stored. So the agent probes the unknown environment. As a result of that, you basically influence your future actions. Because you now know more. You improve your knowledge about the environment. Let's now talk about the ideal rational agent. So for the ideal rational agent.

**[00:18:36]** For each possible percept sequence. This agent should do whatever action is expected to maximize its performance measure. On the basis of the evidence provided by the percept sequence. And whatever knowledge the agent has. So there are two things here. You have your knowledge and you have your percept sequence.

**[00:19:09]** And the behavior of the rational agent can be thought of as a mapping from your perceptual history. So you have your percept sequence. Percept sequence. To one. To a set of actions. So you have your input. Percept sequence. Then from that. There's processing.

**[00:19:40]** The agent program. That's the processing. And the output of the agent program. Is an action. From. A set of possible actions. And this mapping can be. As simple as a lookup table. But in most cases. It is a sophisticated algorithm.

**[00:20:14]** Let's talk about. Autonomy. So the dictionary definition of autonomy. Autonomy is the following. It is the ability to make your own decisions. Without being controlled by anyone else. So that is a dictionary definition. However, that is different from. The notion of. Autonomy in artificial intelligence.

**[00:20:45]** Which is the ability to adopt. To its environment. And this implies flexibility. If an agent relies solely. On its built-in knowledge. And completely disregards the environment. Completely disregards. The percept sequence. The sensors. The agent lacks autonomy.

**[00:21:16]** So it just. Will. Will act according to its built-in knowledge. Nothing. Is going to be influenced by that. Nothing is going to. To change. Everything will be based on. What the agent knows. Internally. Autonomy. It does not have any sensor. Okay. Or it may have. But it. Completely disregards the sensor. The environment. Therefore. In that case. The agent lacks autonomy.

**[00:21:46]** For example. A clock. Your clock. The ordinary clock. Has no autonomy. Why? Because it just relies on internal. Built-in knowledge. Which is. You know. Some vibration. Of the quartz crystal. And then. From that. Using some circuits. Which divided. Divide this. Vibrations. In kilohertz. Megahertz. To. The seconds. The clock displays.

**[00:22:16]** The time. Now. If you are in. Say. In Europe. Where you can. Move from one country. To another. Easily. You can cross borders. You can cross. Time zones. The clock. Will not. Adjust. It's time. So. You'll have to manually. Adjust your. Your clock. Your. Time. Nowadays. Of course. You have clocks.

**[00:22:46]** That are. Smart clocks. So. It has GPS. These are the more advanced ones. It has autonomy. In that case. But. The ordinary clock. Does not have. Any autonomy. Just relies. On. Built-in knowledge. So. No sensing. No sensor. Okay. So. A good. Rational agent. Acts. According to. Its built-in knowledge. Of course. It has to act. According to that knowledge. But it's. Not just based on that. Built-in knowledge.

**[00:23:17]** Which is. Often. Imperfect. Knowledge. Or. Partial. Knowledge. Partial. Because. Well. Knowledge. If it is perfect. Then that's. Omniscience already. So. There's not rationality anymore. That's omniscience. And. The rational agent. Is definitely not omniscient. A good rational agent. Acts. According to. Its own experience.

**[00:23:48]** Or. Percept sequence. As well. So. The. Percept sequence. Or. The experience. Of the rational agent. Makes up for. The. Imperfect. Or. Partial. Knowledge. That the. Agent. Might have. About the environment. We can say. Therefore. That. A system. Is. Autonomous.

**[00:24:18]** To that. To the extent. That. Its behavior. Is determined. By its own. Experience. Just like. The clock. So. It's not. Autonomous. Because. It does not have. Any experience. It doesn't have. Any. Percepts. Perceptual history. Which is. Experience. It just relies. Solely. On. Its built. In. Knowledge. Here's.

**[00:24:53]** The. Structure. Of. A typical. Intelligent. Agent. You have. Your program. Your. Your agent. Program. Which is. The. Implementation. Of. The mapping. From. Percepts. To actions. Is. What. You're. Interested. In. Making. Programs. That. Map. Inputs. Into. Proper. Actions. The. Rational. Actions. Then. You also. Have.

**[00:25:23]** The. Intelligent. Agent. Architecture. Which is. The. Computing. Device. In. Which. The. Agent. Program. Runs. It could. Be. Your. Computer. Your. CPU. It could. Be. Specialized. Device. Like. The. Jetson. So. This. Is. The. Computing. Device. In. Which. Agent. Program. Runs. So. You. Can. Also. Have. Specialized. Architectures. That. Are.

**[00:25:53]** Appropriate. More. Appropriate. For. Intelligent. Agents. The. Agent. Consists. Of. The. Hardware. Of course. And. A. Software. So. Your. Architecture. And. Your. Agent. Program. We. Can. Describe. An. Agent. In. Terms. Of. Its. Performance. We. Talk. About. Performance. Measures. Earlier.

**[00:26:24]** Its. Environment. The. Actuators. Or. Effectors. Of. The. Agent. As. Well. As. The. Sensors. Of. The. Agent. So. This. Is. The. Peace. Description. Of. Intelligent. Agent. Here. Some. Samples. And. Let's. Choose. One. The. Medical. Diagnosis. System. Is. An.

**[00:26:54]** Agent. What. Would. Be. The. Inputs. The. Sensors. This. Could. Be. Your. Touchscreen. Or. Voice. Capture. Device. That. Will. Allow. Entry. Of. Symptoms. And. Findings. Could. Be. Keyboard. And. Then. The. Information. The. Percepts. This. Text. This. Symptoms. Are. Translated. Into. Well. Accepted. By. Your. Agent.

**[00:27:24]** Program. And. Output. Would. Be. A. Display. Of. Questions. Additional. Questions. From. The. Patient. Could. Be. Tests. Recommended. Tests. Or. Diagnosis. Or. Even. Treatments. So. The. Environment. Of. This. Medical. Diagnosis. System. Would. Be. Your. Patient. Hospital. Medical. Staff.

**[00:27:54]** For. The. Performance. Measure. Of. This. System. We. Have. Reduced. Cost. And. Healthy. Patient. Let's. Now. Talk. About. The. Types. Of. Agents. The. Simplest. Possible. Agent. Is. The. Table. Driven. Agent. Here. We. Store. The. Percept. Sequence. In. Memory.

**[00:28:24]** And. Use. This. As. An. Index. Onto. A. Table. Which. Contains. The. Appropriate. Action. For. All. Possible. Sequences. This. How. It. Looks. Like. So. It. Accepts. A. Percept. And. It. Returns. The. Action. Percept. So. This. Percept. Could. Be. A. Sequence.

**[00:28:54]** Or. It. Just. Could. Be. The. Current. Percept. Then. You. Also. Have. A. Table. Which. Is. Created. By. The. Programmer. A. Table. Of. Actions. Index. By. Percept. Sequences. So. What. You. Do. Is. You. Accept. The. Agent. Accepts. The. Percept. And. Stores. It. To. This. Variable. Percept. Sequence.

**[00:29:24]** And. Then. Given. The. Percept. Sequence. You. Look. It. Up. Into. The. Table. Created. By. Your. Programmer. So. The. Table. Outputs. A. Corresponding. Action. Which. Is. Executed. By. Your. Agent. What's. Wrong. With. This. Agent. This. Table. Driven. Agent.

**[00:29:54]** If. The. Table. Is. Extremely. Large. So. For. Chess. It. Could. Be. In. The. Order. Of. 10. Raised. To. The. One. To. Three. Entries. That's. Definitely. Much. More. Than. The. Number. Of. Particles. In. The. Universe. Second. If. You. Have. A. An. Environment. Or. Your. Problem. Is. Really. Just. Something. That's. Smaller. Than. This. It. Will. Stay.

**[00:30:24]** It. Will. Take. The. Designer. A. Long. Time. To. Build. The. Table. Long. Time. Because. The. Programmer. The. Designer. Will. Have. To. Think. Of. All. The. Possible. Inputs. Or. Percepts. So. That. A. Table. Can. Be. Built. And. Even. If. The. Table. Is. Built. Suppose. You. Have. A.

**[00:30:54]** Really. Simple. Environment. That. It's. Possible. To. Make. Such. Table. There. Is. No. Autonomy. At. All. Table. Why. Because. If. The. Environment. Changes. In. A. Way. That. Was. Not. Foreseen. By. The. Designer. The. Agent. Will. Not. Be. Able. To. Act. Rationally. Now. If. We. Include. A. Learning. Mechanism. It. Will. Also. Take. A. Very. Long. Time. To. Learn. The. Right. Value.

**[00:31:24]** For. All. The. Table. Entries. Simply. Because. The. Table. Is. Going. To. Be. Very. Large. So. This. Table. Driven. Agent. Is. Only. Used. For. Very. Simple. Environments. Where. It's. Possible. To. Make. The. Table. Very.

**[00:31:54]** Highly. Constrained. Environment. Where. There's. Very. Little. Uncertainty. No. Uncertainty. Everything. Behaves. As. Expected. So. Just. That. The. Usual. Case. The. Second. Type. Of. Agent. Is. A. Simple. Reflex. Agent. Which. Selects. An. Action. Based. On. The. Current. Percept.

**[00:32:25]** And. Basically. This. Ignores. The. Perceptual. History. Is. Just. What. The. Agent. Sees. At. The. Moment. And. The. And. That. Would. Be. The. Input. To. Your. Agent. Program. And. From. There. It. Just. Chooses. The. Appropriate. Action. Based. On.

**[00:32:55]** That. Perceptual. So. What. Action. Should. I. Do. Now. We. Basically. Depend. On. What. I. See. So. For. Example. The. Car. Driving. Agent. If. Car. In. Front. Is. Breaking. Then. Initiate. Breaking. So. It's. You. Have. Your. Condition. Action. Rules. You. Have. Many. Of. These. So.

**[00:33:26]** Basically. You. Match. Your. State. See. You. First. Transform. Your. Percept. Into. State. And. Then. That. State. Is. Match. Against. Certain. Rules. And. From. There. You. Choose. The. Rule. This. Appropriate. Action. Rather. Appropriate. To. That. To. That. State. Just. Like.

**[00:33:56]** This. Example. If. The. Car. In. Front. Is. Breaking. Then. Initiate. Breaking. So. The. Simple. Reflex. Agent. Looks. For. The. Rule. Whose. Condition. Matches. The. Current. Situation. As. Defined. By. The. Percept. In. The. And. Then. Perform. The. Action. Associated. With. That. Rule. So. This. Simple. Reflex. Agent. As. You. Can. See. Is. Very. Efficient.

**[00:34:26]** However. Is. Its. Applicability. Is. Very. Limited. Since. It. Only. Uses. The. Current. Percept. Just. Like. The. Makahiya. Plant. You. Touch. The. Makahiya. And. Then. It. Just. The. Leaves. Fold. Up. We. Now. Come. To. The. Model. Base. Reflex. Agent.

**[00:34:56]** The. Model. Base. Reflex. Agent. Is. Just. Like. The. Previous. Type. Of. Agent. It's. A. Reflex. Agent. But. This. Time. It. Has. An. Internal. State. That. Keeps. Track. Of. The. Part. Of. The. World. That. It. Cannot. See. Now. In. Other. Words. It. Is. It. Is. Stored. In. Memory. The. Previews. Percepts. So it has perceptual history and uses that to make decisions.

**[00:35:33]** So it maintains an internal state information to distinguish between world states that generate the same perceptual input but requiring different actions. So the basis for these actions are your perceptual history. Two types of information are needed by this model-based reflex agent.

**[00:36:06]** Information about how the world changes independently of the agent. And this must be built-in information. Information. So in other words, how the world evolves. Independently of the agent. Okay. It's this part. And second. Information about how the agent's actions will affect the world or the environment.

**[00:36:38]** What my actions do. So these are the three inputs that will be used by the agent together with what's being sensed. Percept. And using condition action rules, since it's a reflex agent, the appropriate action is selected. And then you can see that the model-based reflex agent.

**[00:37:13]** Again, for this part, how the world evolves would require that knowledge be encoded in the agent program. And this knowledge could be in the form of a transition model of the world. And also a model of the sensors, a sensor model, which describes how the state of the world is reflected in the agent's percepts.

**[00:37:55]** So you need that to be able to model this part, this part here. Because you know the sensors capture only a limited part of the environment. So you need to take that into account to model the sensor. And to model also this part, the transition model of the world. You need that for the model-based reflex agent.

**[00:38:25]** The next type of agent is the model-based goal-based agent. This time it's no longer a reflex agent. It is a goal-based agent. Which means that the agent now incorporates goal information in deciding what to do. Therefore, it considers the future. So the difference between this and the previous one is that you have this.

**[00:39:04]** What will I do? What will it be like if I do action A? So it performs deliberation. It considers possible actions. If I do this action, this is how the world will evolve. If I do this next action or this other action, probably the world will evolve, will change in this manner. So it will transition to another state. And then since we're aiming for the achievement of the goal,

**[00:39:38]** we'll have to look at long sequences of action. Not just what I need to do right now, but also what sequence of actions will I do so that I reach my goal. And this involves planning. Planning is concerned with finding the right action sequences that will lead to the goal.

**[00:40:09]** Planning is fundamental in the area of robotics. Planning involves looking for the right action sequences. And structured as a search for these sequences. Given a set of atomic operations.

**[00:40:40]** So we have discussed the different types of reflex agents. And the goal based agent as well. The reflex agent achieves the goal. It also achieves the goal. Even just like the goal based agent. But the reflex agent achieves the goal because the designer has pre-computed the correct action for the different cases. So that's how the reflex agent achieves its goal.

**[00:41:14]** The designer has already put that goal into the agent program. Because of that, it's very efficient. Very efficient. But it suffers from lack of flexibility because the designer in many cases cannot possibly think of all the different scenarios that the agent will encounter in that complex environment.

**[00:41:45]** Goal based agent considers what will happen if certain actions are performed. And selects the one that will make it achieve its goal. It's not going to be that efficient. But it is more flexible. It is not that efficient because it will have to do search. You'll have to do search.

**[00:44:32]** Now we need to take that into account. So the objective of a utility based agent is to maximize the so-called happiness of the agent. So we need to measure this degree of happiness. And that is captured by the utility. This is a concept that we have in economics, a utility. It is a function that maps a state onto a real number.

**[00:45:04]** And as I've said, there are many goals. Some of these goals are conflicting. You want to reach Makati in the fastest way. And this means, this implies that the taxi, the autonomous vehicle, will have to travel at great speed. But at the same time, if you travel at great speed, then you compromise safety. So these two, these two goals may be conflicting.

**[00:45:37]** And it is the utility function that provides the trade-off between these two goals. So for the model based utility agent, we choose the action sequence that will maximize the utility. Now we come to the last type of agent. The learning agent is any type of agent. The previous types that we have learned.

**[00:46:09]** The model based agent, the goal based agent, utility based agent, etc. But this time, this agent incorporates learning. Components of the learning agent are the following. It has a performance element, which is responsible for action selection. So this performance agent is also changed by the learning element.

**[00:46:43]** So the learning element improves or changes the performance element. So that overall, the learning agent is able to achieve its goal. It gets better and better in achieving its goal. So the learning element is the second element here. It makes improvements to the knowledge components.

**[00:47:13]** And you also have a critic that measures how the agent is doing and determines how performance element should be modified to do better in the future through the learning element. Then lastly, you have a problem generator, which suggests exploratory actions that lead to a new and more informative experiences.

**[00:47:43]** So it will probably instruct the agent to perform some actions which are necessary for getting more information about the environment. So that overall, in the future, in the near future especially, the agent will perform better. Now let's talk about the types of environment.

**[00:48:15]** As we have learned, the environment is the one that provides percepts to the agent. The agent in turn does actions on the environment and changes the state of the environment. You can say that that environment receives action from the agent. The environment is the one that provides a sense of the environment.

**[00:48:51]** The environment is the environment. The environment is the one that provides a sense of the environment. The environment is the environment that provides a sense of the environment. ! The environment is the environment that provides a sense of the environment.

**[00:49:26]** ! The environment is the environment that provides a sense of the environment. ! The environment is the environment that provides a sense of the environment that provides a sense of the environment. The environment is the environment that provides a sense of the environment that provides a sense of the environment that provides a sense of the environment. The environment is the environment that provides a sense of the environment that provides a sense of the environment that provides a sense of the environment that provides a sense of the environment that provides a sense of the environment that provides a sense of the environment that provides a sense of the environment that provides a sense of the environment that provides a sense of the environment. !

**[00:53:10]** !! the sensors of your agent cannot fully observe the state, the complete state of the environment. So you might as well treat that environment as a non-deterministic or stochastic environment.

**[00:53:40]** ! But in reality, it is a deterministic environment. It's just that it's you, your sensors, are not capable of sensing all the relevant parts of the state of the environment. So it's better to think of an environment as deterministic or stochastic from the point of view of the agent. As an example, chess is deterministic.

**[00:54:10]** Chess is deterministic because you know all the rules of chess and it's what you see is what your adversary sees. So it's deterministic. The next moves are, well, the next possible moves at least are all determined. Okay? You know, but it's just that there are too many, you know, so that's another issue.

**[00:54:41]** Now, in the case of poker, it's also deterministic, right? The rules of poker are deterministic. But it's better to treat that game, that adversarial game, as non-deterministic. Why? Because you don't observe the hand of the other people in poker.

**[00:55:13]** So, therefore, you say, okay, for simplicity, I'll just treat it as non-deterministic. It's non-deterministic because it's partially observable. What you'll see is just part of the complete state of the environment. Another characteristic of environments is that of being episodic versus non-episodic.

**[00:55:47]** An environment is episodic if the agent's experience is divided into episodes. So what is an episode? It consists of an agent perceiving and acting and that you have a, like a, an end game over for a game. Then you start again and learn from what you have gained from the previous games.

**[00:56:21]** Now, the quality of action depends on just the episode itself. Since subsequent episodes do not depend on actions in previous episodes. So this is true for, for agents that are not allowed to use the, to learn from the previous episodes. But for learning agents, it's better that you learn from previous episodes. Episodic environments are much easier to deal with because planning is limited to one episode.

**[00:56:55]** So for example, chess is non-episodic. While the chest X-ray analyzer is episodic. So, which means that, okay, for, for chest X-ray, the previous, the previous patient, whatever whatever X-ray result it has, will not have any bearing on the current patient.

**[00:57:26]** So, so episodic, episodic. But chess is, you can actually, um, uh, learn from the previous, uh, uh, episodes. Then, uh, dynamic versus static. A dynamic environment changes while the agent is deliberating. So while, while, uh, while the agent is processing information, the environment is changing all the time.

**[00:57:57]** And to do, to, to, to, uh, to deal with this, it is necessary to keep sensing while deliberating. Okay. For a dynamic environment. So you need to deliberate while, sorry, you, you need to sense while deliberating. Like, you know, you're crossing the street. You need to be sensing you while, even if, uh, you're thinking of your exam. Otherwise you get, uh, uh, into an accident.

**[00:58:27]** While you are driving, you need to be continually sensing the, uh, what's in front of you while you're thinking. Um, that is because you have a dynamic environment. However, if the environment does not change with the passage of time, but the agent's performance does, then the environment is semi-dynamic. Chess is an example of a static, uh, uh, environment.

**[00:59:00]** Okay. While a chess with clock is semi-dynamic because you could lose due to time default. Taxi driving is definitely a dynamic environment. Discrete versus continuous. An environment is discrete when there is a limited number of distinct, clearly defined, percepts and actions.

**[00:59:30]** So while if it is continuous, um, that means that the actions could be continuous valued and the percepts also could be continuous valued. And lastly, when we design an agent, we should design it for a whole set of different environments called the environmental environment class. Not just, uh, uh, uh, uh, a particular environment.

**[01:00:01]** For example, a chess program could be designed to take advantage of the specific weakness of an opponent. And it may be very good at beating that opponent, but it may not be suitable for a tournament. This was the complaint of, uh, Kasparov when he was, uh, when he lost to Deep Blue. He said, uh, he was interviewed and he said that, uh, IBM actually took advantage of my weaknesses.

**[01:00:34]** Um, looking at the databases, perhaps of his, uh, games, previous games and, uh, and, uh, exploited, uh, these, uh, weaknesses. And Deep Blue may not be suitable for a general tournament. So maybe he's right. He is right. But then the point is, uh, he lost to, uh, to Deep Blue.

**[01:01:04]** So again, when we are designing an A algorithm, make sure that we design it for different environments, in the environmental class, not just, not just for this particular set of inputs. Because when you change the environment a little, your, your performance, your AI program will not perform as well. So this, this, uh, just a listing of an example of, uh, different types of, uh, environments and, uh, their observability.

**[01:01:48]** So you can see whether it's single agent or multi-agent and so on. Just, uh, go through this. Example. Analyze this, uh, on your own. With that, we end our lecture for today. And we'll see you next time. Thanks for today.

