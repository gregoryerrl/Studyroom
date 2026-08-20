# AI201 — Lecture 1: What is AI? (v2)

Source: `_generated/transcripts/Lecture_1_What_is_AI.md` (full lecture, [00:00:00]–[01:13:17]).
All timestamps cite the transcript.

**v2 changes:** adds the **FlyWire connectome worked example** to §3 (Cognitive Modeling), plus a
**References** section for the outside sources it draws on. Everything else carries over from v1.

> **Flag for exam use:** the FlyWire material in §3.1 is **not from the lecture**. It's supplementary
> context supplied by me (Gregory) to make the cognitive-modeling validation loop concrete. Cite it as
> outside reading, never as lecture content. Everything else in this file is transcript-grounded.

---

## 0. The one-sentence definition [00:00:46]

> AI is **the field of human endeavor concerned with understanding the nature of intelligence and the construction of intelligent systems.**

And "intelligent system" has a specific meaning [00:01:17]:

> machines that **compute how to act** — effectively, safely, ethically, responsibly — **in a wide variety of novel situations.**

Three exam-relevant hooks buried in that sentence:

| Phrase | Why it's there |
|---|---|
| *compute how to act* | AI is about **action**, not just internal cleverness |
| *safely, ethically, responsibly* | responsible AI is part of the definition, not an add-on |
| *novel situations* | memorized lookup tables don't count; generalization is required |

---

## 1. The 2×2 that generates the four definitions [00:01:53–00:03:43]

There are **two axes**, not four. The lecture is explicit —
*"these are the two axes along which we can define the four definitions of AI"* [00:02:29].
The four *definitions* are the four cells the two axes produce.

```
                     THOUGHT                    BEHAVIOR
                (internal process)          (external action)
              ┌───────────────────────┬───────────────────────┐
              │                       │                       │
  HUMAN       │  THINK like humans    │   ACT like humans     │
  (fidelity   │                       │                       │
   to actual  │  Cognitive Modeling   │    Turing Test        │
   humans)    │       [00:11:12]      │      [00:03:43]       │
              ├───────────────────────┼───────────────────────┤
              │                       │                       │
  RATIONAL    │  THINK rationally     │   ACT rationally      │
  (ideal      │                       │                       │
   standard)  │   Laws of Thought     │   Rational Agent  ★   │
              │       [00:13:31]      │      [00:16:00]       │
              └───────────────────────┴───────────────────────┘

★ = the definition AI201 uses: "AI is the study and construction of
    rational agents." [00:17:04]
```

Two questions that pick out the cell [00:01:53]:
1. Does "intelligence" mean **fidelity to humans** or **rationality** (an ideal standard)?
2. Is intelligence a property of **internal thinking** or **external behavior**?

Each cell has real adherents and gave rise to different research fields [00:03:05].

---

## 2. Definition 1 — Turing Test (act like humans) [00:03:43]

**Turing, 1950:** a machine is intelligent when it exhibits behavior **indistinguishable from a human's**.

### The setup [00:04:18]
- You type at a terminal. At the other end is *either* a person *or* an AI.
- You have **30 minutes**, any questions you like.
- If you **cannot reliably distinguish** human from machine → the AI is intelligent.

### Why it's still hard today [00:04:56]
The system must discuss **"practically any subject under the sun"** — philosophy, anything.

### The worked example the lecture gives: the multiplication trap [00:05:33]

Ask the respondent to multiply two 10-digit numbers.

| Respondent | Time | Answer |
|---|---|---|
| Ordinary human | ~5 minutes | often **wrong** (forgotten times tables, human error) |
| Computer | < 1 second | correct |

The punchline is counter-intuitive and very examinable:

> **A *wrong* answer suggests the respondent is human** [00:06:35].

So to pass, a machine would have to *deliberately be slow and wrong*. This is why Turing's criterion is about **fooling an interrogator**, not about being good:

> intelligence = *"the ability to achieve human-level performance in all cognitive tasks **sufficient enough to fool an interrogator**"* [00:06:35].
> **Emphasis on action. Emphasis on behavior.** [00:07:06]

### Modern version → the six subfields of AI [00:08:11–00:11:12]

In 1950 the machine was a teletype (a typewriter-like terminal) [00:08:11]. Today the test is spoken, so the six required capabilities *are* the major disciplines of AI:

| # | Capability | Subfield | What it does |
|---|---|---|---|
| 1 | Communicate in **human** language (mic = the computer's ear); *"could even be in Filipino or Cebuano"* [00:08:47] | **NLP** | understand + generate human language |
| 2 | Represent and store knowledge, symbolically or non-symbolically [00:09:24] | **Knowledge Representation** | hold what it knows |
| 3 | Draw conclusions from available knowledge by **induction or deduction** [00:09:24] | **Automated Reasoning** | infer new facts |
| 4 | Detect and **extrapolate from patterns**; adapt to new situations [00:09:55] | **Machine Learning** | improve from data |
| 5 | Perceive the world via cameras and microphones [00:09:55] | **Computer Vision** + **Speech Recognition** | sense |
| 6 | Manipulate objects and move about in the world [00:10:29] | **Robotics** | act physically |

### Symbolic vs. non-symbolic

**Symbolic** = reading the instruction manual. Someone writes explicit rules — *"push the left pedal, then the right, keep the handlebars straight."* Knowledge you can write on paper and hand to someone else. Steps like a recipe: clear, logical, **explainable**.

**Non-symbolic** = actually learning to ride by practicing, falling, adjusting until your body just *knows* how to balance. No one can hand you a written rule for balance — it lives in muscle and instinct, not words. Machines learn this way through examples, and the knowledge ends up **buried in numbers**, not rules.

> Shortest hold: symbolic = **"explain the rule."** Non-symbolic = **"just get a feel for it."**

This analogy pays off later — it's exactly the **two camps** of AI history [00:28:35]:

```
        SYMBOLIC CAMP                      NON-SYMBOLIC CAMP
   "intelligence needs symbols            (connectionist / neural nets)
    that can be manipulated"
   symbols give rise to conclusions       "you don't know what's going on
   AI = manipulation of symbols            inside, there's no symbol there,
                                           they just [are] weights"
   e.g. Logic Theorist, GPS,              e.g. SNARC, Perceptron,
        expert systems, Deep Blue              backprop, deep learning
              │                                        │
              └────────── both vying for the same ─────┘
                          government funding [00:29:06]
```

---

## 3. Definition 2 — Cognitive Modeling (think like humans) [00:11:12]

AI is equated with **human thinking**. Very challenging: it requires getting *inside the actual workings of the human mind*.

**Three ways to get the data:**
1. **Introspection** — catching your own thoughts as they go by
2. **Psychological experiments**
3. **Brain imaging** — fMRI, EEG: monitor brain activity, blood flow, glucose consumption while the person performs mental tasks [00:12:23]

**The validation loop — this is the core of the approach** [00:12:57]:

```
  precise theory of the mind
             │
             ▼
   expressed as a computer program
             │
             ▼
   compare program's INPUT–OUTPUT behavior
        against HUMAN behavior
             │
        ┌────┴────┐
      match?    no match?
        │           │
        ▼           ▼
   evidence that   theory is
   the mechanism   wrong → revise
   could be the
   same in humans
```

Key nuance: matching I/O is **evidence**, not proof — *"it is evidence that the program's mechanism **could be** similar in humans."*

### 3.1 Worked modern example — the FlyWire connectome *(outside reading, not lecture content)*

The lecture's brain-imaging tools (fMRI, EEG) sit at one end of a spectrum. A **connectome** sits at the other, and the comparison sharpens what cognitive modeling is actually trying to do.

Between 2014 and 2024 the **FlyWire Consortium** sliced an adult fruit fly brain into **7,000 sections**, imaged each with an electron microscope, and traced out a complete wiring diagram of **139,255 neurons** and roughly **50 million synapses** (Dorkenwald et al., 2024). **Shiu and colleagues** turned that map into a running model, stimulated its sugar-sensing neurons, and it correctly predicted which neurons fire to extend the proboscis and begin feeding, matching real flies at about **95% accuracy** (Shiu et al., 2024). In 2026 **Eon Systems** plugged that model into a simulated body and the digital fly walked toward food and groomed itself — though the **leg coordination came from separate earlier training rather than from the wiring** (Eon Systems, 2026a, 2026b).

**The contrast with fMRI and EEG is the point:**

```
   fMRI / EEG                          CONNECTOME  (FlyWire)
   ───────────────────────             ─────────────────────────
   reads ACTIVITY                      reads STRUCTURE
   blood flow, glucose,                every neuron, every synapse,
   electrical signal                   traced by electron microscope
        │                                       │
        │  structure stays hidden               │  activity is DERIVED
        │  (you see WHEN, not WIRING)           │  by simulating the wiring
        ▼                                       ▼
   correlational: "this region          mechanistic: "these 139,255 cells,
   lights up during this task"          wired this way, produce this behavior"
```

**Why this belongs under Definition 2, not Definition 1.** Read it against the validation loop above — it is that loop, executed:

| Validation-loop step [00:12:57] | FlyWire instantiation |
|---|---|
| precise theory of the mind | the wiring diagram: 139,255 neurons, ~50M synapses |
| expressed as a computer program | Shiu et al.'s runnable model |
| compare program I/O against real behavior | stimulate sugar-sensing neurons → which neurons fire? |
| match ⟹ evidence mechanism is the same | ~**95%** match with real flies |

A Turing-test system (Definition 1) would only need the fly to *behave* like a fly. This model is judged on whether its **internal mechanism** matches — which neuron fires, not just whether the proboscis extends. That is the whole human-thought vs. human-behavior axis from §1, made concrete.

**Keep the hedge.** The 2026 embodied demo is weaker than the headlines suggest: the leg coordination was trained separately, so the walking is **not** derived from the connectome. Commentary pushing back on the "brain upload" framing is worth reading (Zeleznikow-Johnston, 2026). This is itself a lecture-relevant lesson — recall the Logic Theorist rejection [00:25:03] and the AI-winter overconfidence [00:30:10]: **claims outran results**, and the field paid for it.

---

## 4. Definition 3 — Laws of Thought (think rationally) [00:13:31]

Based on **Aristotelian logic**: deductive reasoning via *modus ponens*, *modus tollens*.

**Syllogism** = *"a formula of argument consisting of two propositions (the premises) and a conclusion that is logically drawn from them"* [00:14:11].

Worked example, exactly as given:

```
  Major premise:  All men are mortal.
  Minor premise:  Socrates is a man.
  ───────────────────────────────────
  Conclusion:     Socrates is mortal.       ← necessarily true
```

> *"If the major premise is correct, the minor premise is correct, then the conclusion is **necessarily** correct. It's like a formula. You just apply [it] and you get the answer."* [00:14:45]

**The catch:** syllogisms give correct conclusions **only if the premises are correct** [00:15:16].

For AI this becomes **formal logic** — e.g. **first-order predicate logic** (studied later in the course) — giving *"a precise notation for describing correct reasoning."* The concern of this approach: **how to obtain correct inferences** [00:15:16].

---

## 5. Definition 4 — Rational Agent (act rationally) ★ [00:16:00]

**This is the definition AI201 uses.**

> Intelligence = **acting rationally so as to achieve one's goals given one's beliefs** [00:16:00].
> **"AI is the study and construction of rational agents."** [00:17:04]

```
   BELIEFS about the world  ──┐
                              ├──▶  ACTION in the environment  ──▶  GOAL achieved
   GOALS                    ──┘
```

### Why "act rationally" beats "think rationally" [00:17:04]

Forming correct inferences is *just one way* of acting rationally. The lecture's argument:

- *"We are **not reasoning logically all the time** to arrive at the conclusion."*
- *"Very often we just do what we are supposed to do **without even thinking**."*
- In many situations there is **no provably correct action**, and yet action is still necessary.

> **"Part of intelligence is knowing what to do when one does not know what to do."** [00:17:40]

Therefore: **making inferences is only part of rationality** [00:18:14]. The Laws-of-Thought cell is a *subset* of the Rational-Agent cell.

---

## 6. Rationality: perfect vs. bounded [00:18:14]

### Perfect rationality
**Always doing the right thing all the time.** *Not possible for a computer* in complicated environments — computational demands are too high. You cannot consider all possible scenarios; it would take too long and too many resources [00:18:51].

### Bounded (limited) rationality — **Herbert Simon, 1957** [00:19:26]

An economic theory: decision-makers have limited rational decision-making, driven by **three factors**:

| Factor | Meaning |
|---|---|
| **Cognitive ability** | non-infinite processing power |
| **Time constraint** | the decision can't wait |
| **Imperfect information** | you never have all the facts |

Result: agents make **suboptimal decisions**, influenced by moods and emotions [00:19:58].

### Satisficing [00:20:32]

> **Satisficing** = a decision-making strategy aiming for a **satisfactory or adequate** result rather than the **best/optimal** result.

The lecture's Filipino gloss, worth quoting exactly:

> **"Pwede na."** *"So, pwede na is, in a way, is bounded rationality because we do not have the time, we do not have the resources, we do not have enough information, so we do a satisficing behavior."* [00:20:32]

*"Instead of exerting maximum effort towards attaining the ideal outcome, we focus on **good enough** or satisfactory solutions… because we have to act under bounds of time and space."* [00:21:04]

**The computer version** [00:21:37]:

| | Optimal | Satisficing |
|---|---|---|
| Memory | unbounded (impossible — finite memory resource) | fits available memory |
| Time | a week of computation | a few seconds |
| Answer | the best solution | a good-enough solution |
| Verdict | *"We don't want that."* | **"That's what we need. We need to decide after a few seconds. We cannot wait for a week."** |

---

## 7. History of AI — five eras

### 7.1 Inception: early 1940s → mid-1950s [00:22:41]

| Year | Milestone |
|---|---|
| 1943 | **McCulloch & Pitts** — computational model of the neuron → later neural networks and deep learning |
| 1950 | **Minsky & Edmonds** — **SNARC**, first neural network *computer* in hardware, **3,000 vacuum tubes** |
| 1950 | **Turing** proposes the Turing test; already conceives of **programs that learn from data** rather than hard-coded intelligence — i.e. he already saw ML [00:23:13] |
| 1950 | Turing **warns** that achieving AI *"might not be the best thing for the human race"* — AI risk, flagged in the 1950s [00:23:56] |
| 1952 | First **checkers-playing** program |
| **1956** | **Dartmouth College AI workshop** — *widely considered the founding event of AI*; first time **John McCarthy** used the term "artificial intelligence" [00:24:27] |
| 1956 | **Logic Theorist** (Simon) — proves mathematical theorems |

**The Logic Theorist story** [00:25:03] — good exam anecdote: it found a proof **shorter than Bertrand Russell's** for a theorem. Simon submitted it to a journal and it was **rejected** — *"they didn't really believe that the machine could probably do theorem proving."*

### 7.2 Great expectations: early 1950s → late 1960s [00:26:22]

| Year | Milestone | Camp |
|---|---|---|
| 1952 | First checkers program using **reinforcement learning** | symbolic |
| 1957 | **Perceptron convergence theorem** — Rosenblatt | connectionist |
| 1958 | **LISP** — AI-specific language, used for the next 30 years | symbolic |
| 1959 | **GPS** (General Problem Solver) — solves puzzles like a human | symbolic |
| 1960s | **ADALINE**; **micro-worlds**, especially the **blocks world** → many papers in vision, constraint propagation, NLP, planning | mixed |
| 1965 | **Robinson's resolution principle** for first-order logic | symbolic |

### 7.3 AI Winter: 1960s → mid-1970s [00:30:10]

**Cause: overconfidence.** Researchers promised great performance, but results were demonstrated only on **simple examples like the micro-world** — *"They were not scalable."*

Three specific failures:

1. **Theorem proving** — *"you cannot prove theorems involving more than a dozen facts"* [00:30:41]
2. **Minsky & Papert** showed **mathematically** that the perceptron **cannot learn XOR** (exclusive-or) [00:31:12] — killed the connectionist side
3. **Combinatorial explosion** — the **Lighthill Report** emphasized the *"failure to come to grips with combinatorial explosions."* Search algorithms need to search a space that *"is simply just exploding combinatorially"* [00:31:12]

**Result:** the **Lighthill Report** (UK) and the **ALPAC Report** (US) triggered the **AI winter** — funding for AI research was cut [00:31:47].

### 7.4 Expert systems: 1960s → mid-1980s [00:32:19]

| System | What it did |
|---|---|
| **DENDRAL** | chemical analysis; hypothesized molecular structure of substances — *rivalled chemical experts at this task* |
| **MYCIN** | **backward-chaining** expert system, KB of ~**600 rules**; identifies bacteria causing severe infections; recommends antibiotics with **dosage adjusted for patient body weight** [00:32:51] |
| **R1** (1982) | **first commercial expert system**; rule-based production system |
| **Japanese Fifth Generation Project** (1982) | computers built on **logic programming (Prolog)** + **massively parallel computing**; ran ~a decade; *"produced very good results. However, it was a **commercial failure**"* [00:33:28] |

### 7.5 Probabilistic reasoning → deep learning age [00:34:34]

| Year | Milestone |
|---|---|
| 1980s | **HMMs** (hidden Markov models) — very successful for speech recognition |
| 1982 | **Vapnik & Chervonenkis** — learning theory, the **VC dimension** |
| mid-1980s | **Backpropagation** — Rumelhart, Hinton & Williams |
| 1988 | **Bayesian networks** — Judea Pearl (UCLA) |
| 1988 | Sutton's **reinforcement learning** book |
| 1992 | **Support Vector Machine** — Vapnik |
| 2011 | **IBM Watson** — answers natural-language questions; won **Jeopardy!** and **$1M** against human champions; later sold to a cancer center for lung cancer treatment decisions [00:36:47] |
| **2012** | **AlexNet** — *"started the deep learning craze"* |
| 2014 | **GANs** — Goodfellow |
| 2015 | **ResNet-152** exceeds **human performance** on ImageNet |
| 2016 | **AlphaGo** beats human players |
| 2017 | **Self-supervised learning**; **Google Brain's Transformer architecture** |

**The backprop rediscovery story** [00:35:37]: the same algorithm had been proposed in the **mid-1970s in a master's thesis**, but *"since no one was reading that master's thesis, the rest of the world did not know"* — it was reinvented about a decade later.

---

## 8. Problem domains and their attributes [00:37:56]

| Domain | Knowledge content | Data rate | Response time |
|---|---|---|---|
| Puzzles (e.g. crossword) | poor | low | **hours** |
| Chess | medium | low | **minutes** |
| Vision | **very rich** | **very high** (video, many Mbps) | **real time** |
| Speech | rich | high | **real time** |

**Complexity ladder given in the lecture:**

```
  puzzles  <  chess  <<<  speech  <<  vision
                          ▲            ▲
        "several orders of magnitude   │
         more complex than tasks with  │
         low data rates" [00:46:37]    │
                                       │
                     "about TWO orders of magnitude
                      more than speech" [00:50:21]
```

### 8.1 Chess — testbed for **search** [00:39:38]

> **> 10^123 possible moves.** Brute-force exhaustive search **will not work**.

The scale comparison, worth memorizing:

```
   particles in the universe    ≈ 10^80        ← photons, protons, ALL particles
   possible chess moves         > 10^123       ← "still a very small number
                                                  compared to..." [00:40:09]
```

**Chess program history** [00:40:49]:

| Era | System | Achievement |
|---|---|---|
| 1950s | (first program) | first **operational** chess program |
| 1960s | — | won a game in a regular tournament, beating a **Class C** player |
| 1970s–80s | **Northwestern**, **Belle**, **HITECH** | **Senior Master** rating |
| — | **Deep Thought** (CMU) | first to achieve **Grand Master** status |
| **1996** | **Deep Blue** (IBM) | **lost** to Kasparov 4–2 |
| **1997** | **Deep Blue** | **beat Kasparov** — *"a very important milestone… an AI machine has won over the number one chess player in the world"* [00:41:24] |

**Why chess research mattered:** it produced **alpha-beta search**, **B\* search**, **singular extension search** — *"many of these search concepts have found their way into everyday applications"* [00:41:56].

### 8.2 Go — testbed for **reinforcement learning** [00:42:27]

> **> 10^361 possible moves** — harder than chess.

| Year | Milestone |
|---|---|
| 2007 | first serious computer Go attempt — **Monte Carlo tree search** for Go |
| 2010 | system wins against a human player |
| 2011 | **Zen** beats a Japanese player |
| 2013 | **Crazy Stone** beats Ishida |
| 2015 | **AlphaGo** beats European champion **Fan Hui** |
| 2017 | **AlphaZero** beats the best Go player in the world |
| 2017 | **Leela Zero** released — free and open source, *"examine its innards, modify it to your heart's satisfaction"* |

**AlphaZero (DeepMind, 2017)** plays **chess, Go, and Shogi** [00:44:00].

Player reactions [00:44:00]:
- **Kasparov:** *"a pleasure to watch… its style was open and dynamic like his own"*
- another top player: *"played like a **superior alien species**"*

**The contrast DeepMind drew** [00:44:40] — this is the exam-worthy comparison:

| State-of-the-art engines | AlphaZero |
|---|---|
| search **millions** of positions | searches **1,000× fewer** positions |
| **handcrafted domain expertise** | **no domain knowledge except the rules** |
| sophisticated domain adaptations, tuning | **generic** RL algorithm |
| decades of accumulated engineering | superior results within **a few hours** of training |
| — | plays **against itself** |

### 8.3 Speech recognition [00:46:03]

Requirements — *"far more complex than playing chess"*:
- operate in **real time**
- exploit **vast amounts of knowledge**
- **tolerate error and imprecision**
- **learn** language, **use** language, learn **from examples**

**Why imprecision matters** [00:47:07]: *"Almost no one speaks with perfect, totally perfect grammar. Even the native users of the language speak with ungrammaticality, with imprecision. Yet, the human mind is able to decode the information."*

**Why this research matters for AI generally** [00:47:41]: it gives insight into how intelligent agents *"deal with **incomplete, inaccurate, and partial** knowledge in problem solving, because that is the nature of speech."*

| Era | System | Note |
|---|---|---|
| 1970s | **HARPY**, **HEARSAY**, **HWIM** | connected speech; **syntax and semantics** as major knowledge sources |
| — | **Sphinx-3** (CMU) | **50,000-word** vocabulary, voicemail dictation, **real time on a Pentium Pro**, **speaker-independent** |
| 2002 | **DARPA EARS** | detects keywords in telephone conversations reliably |
| 2007 | **CTC** (Connectionist Temporal Classification) | basis of future connectionist speech algorithms |
| 2015 | **Google Voice** | **49%** performance improvement using **LSTM** |

Techniques it produced: **backward models**, **HMM-based learning**, **beam search**, **CTC** [00:49:49].

### 8.4 Vision [00:49:49]

**Goal:** understand the world — automatic **interpretation and understanding of image data**, and **construction of 3D models** from real-world scenes.

**Three visual tasks** [00:50:21]:

```
   RECOGNITION  ──▶  see in order to recognize objects around us
   MANIPULATION ──▶  see in order to handle things (doorknob, switch)
   MOBILITY     ──▶  see in order to navigate successfully in the world
```

### 8.5 Robotics [00:51:00]

> **A robot is an active artificial agent whose environment is the real world.**

Autonomous mobile systems (robotic vehicles) are hard because they require **many disciplines at once**: vision, advanced sensors, high-speed processors, planning, control, learning.

| Year | System | Achievement |
|---|---|---|
| 1995 | **NavLab 5** — a GM van modified for autonomous steering | navigated correctly **90% of the time**, Washington D.C. → San Diego; **when in doubt, asks the human driver to take over** |
| 2010 | **VisLab** | first **intercontinental** land journey by autonomous vehicles: **Parma, Italy → Shanghai, China in 100 days** |
| now | Waymo, GM, Pony AI, Zoox | — |

---

## 9. ★ The Five Laws of Intelligent Action [00:53:11]

This is the most quotable, most examinable section of the lecture.

```
  LAW 1   bounded rationality  ⟹  opportunistic search
  LAW 2   physical symbol system = NECESSARY & SUFFICIENT for intelligent action
  LAW 3   the magic number is 70,000 ± 20,000
  LAW 4   SEARCH compensates for lack of KNOWLEDGE      ┐
  LAW 5   KNOWLEDGE compensates for lack of SEARCH      ┘  mirror images
```

### Law 1 — Bounded rationality implies opportunistic search [00:53:41]

When agents operate under conditions that **overload computational resources**, they deploy *"opportunistic strategies and tactics of **least computational search** rather than optimal shortest-path search."*

**The Makati traffic analogy** [00:54:17] — the lecture's own worked example:

```
   Going to Makati, there's traffic.

   ✘ shortest PATH        →  stuck in traffic
   ✔ shortest TIME        →  take the side streets

   Costs: more gasoline, longer route
   Gain:  you arrive faster
   ⟹ you optimize the resource that actually binds you
```

### Law 2 — Physical symbol system hypothesis [00:55:27]

> **A physical symbol system is a necessary and sufficient condition for intelligent action.**

- **Physical symbols** = symbols realizable by **engineered components**
- **A physical symbol system** = a set of such entities
- **Symbolic structures** are built from them; operations include **creation, modification, reproduction, destruction**
- These expressions can then be **interpreted as plans of action** [00:56:00]

**Important caveat:** *"this law has been challenged by several researchers… Some researchers have actually criticized that this is not really necessary for intelligent action. So it really is debatable."* [00:55:27, 00:56:33]

> Cross-reference: the FlyWire model in §3.1 is a live data point in this debate. Nothing in that
> simulation is a manipulable symbol — it is 139,255 cells and their synaptic weights — yet it
> reproduces goal-directed feeding behavior. That's an argument against *necessity*.

### Law 3 — The magic number is **70,000 ± 20,000** [00:56:33]

An expert knows roughly that many **chunks** of information. It's a **good guide for sizing an expert's knowledge base** — if you're building an expert system, that number tells you you've reached the top.

Supporting evidence from cognitive science [00:57:07]:

| Evidence | Value |
|---|---|
| Vocabulary of college graduates | ≈ 70,000 chunks — *"It's not 10 times, it's not a million. It's around this number."* |
| Knowledge bases of expert systems | grow toward **tens of thousands** |
| Time to world-class status | **no human** reaches it without **≥ a decade** of intense full-time study and practice |

**Consequences:**
- *"Even if you're a genius, if you don't work very hard for 10 years… you can't really become world class, because remember there are many geniuses outside. You're not the only one."* [00:57:42]
- Equivalent statement: the **10,000-hour rule** [00:58:14]
- **Life-budget corollary:** if expertise costs ~10 years, there is *"only enough time to be an expert in only two or three areas"* in a lifetime — *"So this is 30 years."* [00:58:44]

### Law 4 — Search compensates for lack of knowledge [00:59:23]

```
   LOW knowledge  ──▶  MORE search        (trial and error)
   HIGH knowledge ──▶  LESS search
```

**What search is:** *"Search is **trial and error behavior**. When faced with a puzzle we have never seen before, we engage in trial and error until a solution is found."* Give the same puzzle again — now you have the knowledge, and there's no more trial and error [00:59:54].

**Worked example: Deep Blue** [01:00:28] — the law's headline case.

In the 60s–70s it was believed that master-level chess **could only** be achieved by codifying human expert knowledge. But:

| | Chess master | Deep Blue |
|---|---|---|
| Knowledge base | huge | **very small** — only **openings and endgames** |
| Everything else | learned/known | **processed on the fly** |
| Compensation | knowledge | **200 million moves/second × 2 minutes** |

> **Lesson:** *"it is possible to achieve expert-level performance even with little knowledge as long as it could be compensated by search."* [01:01:03]

**Important honesty note** [01:01:37]: what Deep Blue picks is *"not really the best move because no one knows the best move. To be able to get the best move, you have to compute all the way to the end"* — and with 10^123 moves that's impossible. So it's the **"best good enough move"** given the effort spent. (← this is Law 1 / satisficing showing up again.)

**Second example — NLP** [01:02:43]: the word **"take"** has many meanings — *take a shower, take a book, take a bus*. The precise meaning is clarified **by context, through exploring the alternatives** until it's unambiguous.

> **When knowledge is yet to be acquired and codified, search is a very good way to proceed.** [01:02:43]

### Law 5 — Knowledge compensates for lack of search [01:03:22]

The mirror of Law 4. Knowledge **reduces uncertainty** and **constrains the exponential growth** of search — *"you avoid combinatorial explosion through knowledge."*

**Example A — Rubik's Cube** [01:03:52]: most people take half an hour or more the first time. With practice you gain knowledge of the problem-solving process → less search → less time.

**Example B — Sphinx-3, knowledge-source ablation** [01:04:32]. This is a *quantitative* example; know the numbers:

| Knowledge source removed | What goes wrong | Error rate |
|---|---|---|
| *(baseline, all sources on)* | — | **4%** |
| **Syntactic knowledge** off | absurd word salad becomes legal: *"sleep roses dangerously young colorless"* | **30%** |
| **Probabilistic** knowledge (word-frequency) off | milder degradation | **6%** |

Reading: **syntax is doing far more work than word-frequency statistics** — removing it is a 7.5× error blow-up vs. 1.5×.

---

## 10. Terminology: anytime and anyspace algorithms [01:05:02]

> **Anytime algorithm** — an algorithm that can be **interrupted at any time** and will return a result whose **value monotonically increases with time**.

```
  quality
    ▲
    │                                  ●  ← interrupt at 5 min: better answer
    │                    ●
    │        ●              ← interrupt at 2 min: good answer
    │   ●       ← interrupt at 1 min: good-enough answer, not perfect
    └──────────────────────────────────▶ time

  Never perfect on demand — but never useless either.
```

*"If a program is running and after one minute I interrupt it… it gives me an answer. It's not the perfect answer, it's a good enough answer. After another five minutes of computation, if I interrupt it again, it will give me a **better** answer."* [01:05:35]

> **Anyspace algorithm** — can work with **arbitrarily low memory** and **guarantees optimal solutions upon termination** [01:06:14].

Note the asymmetry: anytime trades **quality**; anyspace trades **time** but keeps **optimality**.

---

## 11. Grand challenges of AI [01:06:44]

| Challenge | What it needs |
|---|---|
| **Translating telephone** — a Japanese speaker converses with an English speaker in real time, each hearing their own language | large vocabulary; **unrehearsed continuous speech**; natural-sounding **speech synthesis that preserves speaker characteristics**; NLP that handles **ambiguity, non-grammaticality, incomplete phrases** |
| **Accident-avoiding car** | vision + **sensor fusion** (cameras, laser, sonar, …); obstacle detection and avoidance |
| **Learning systems** — a robot learns to assemble an appliance **by watching a person do it** ("like a child watching you"); *"still a holy grail"* | vision, language, problem solving, learning theory |
| **Self-replicating systems** — for manufacturing in space | knowledge capture for **reverse engineering and replication**; robotics for control, diagnosis, monitoring, repair |

---

## 12. Risks and benefits of AI [01:09:37]

| Risk | The lecture's specifics |
|---|---|
| **Lethal autonomous weapons** | *"a small group of people, terrorists for example, can deploy an **arbitrarily large number** of weapons against human targets defined by some recognition criteria"* — it sees certain people and automatically kills them |
| **Surveillance and persuasion** | monitoring individuals **at massive scale** → privacy concerns; ML tailors information flows through social media to **modify political behavior such as voting** — *"made possible in 2016… you can now fool people and make them vote for a particular candidate of your choice. And actually this is being used in a lot of countries."* [01:10:40] |
| **Biased decision-making** | bias by **race, gender, or other protected categories**; *"this bias might arise especially from **data**. Simply the data already contain the biases. The algorithms just learn from the data and make decisions that are biased."* [01:11:12] |
| **Impact on employment** | jobs taken over by automation — *"Will the call center industry collapse?"* [01:11:50] |
| **Safety-critical applications** | accidents by autonomous vehicles; mistakes in healthcare — **"who's going to be responsible?"** |
| **Cybersecurity** | ML used to lure users into malware; **highly effective tools for personalized blackmail** [01:12:28] |

Tie back to the opening definition [00:01:17]: *safely, ethically, responsibly* is why this section exists — it isn't an appendix to the course, it's part of what "intelligent system" was defined to mean.

---

## Self-check before the exam

Cover the right column.

| Prompt | Answer |
|---|---|
| How many **axes**, how many **definitions**? | 2 axes → 4 definitions |
| Which definition does AI201 use? | **Rational agent** — act rationally |
| Why is a *wrong* multiplication answer evidence of humanness? | Turing measures **indistinguishability**, not competence [00:06:35] |
| Name the 6 subfields | NLP, KR, automated reasoning, ML, vision + speech, robotics |
| fMRI/EEG vs. connectome — one line each | fMRI/EEG read **activity**, structure hidden; connectome reads **structure**, derives activity |
| Which of the four definitions does FlyWire exemplify, and why? | **Cognitive modeling** — judged on internal mechanism match (~95%), not just outward behavior |
| Simon's year and two terms | 1957 — **bounded rationality**, **satisficing** ("pwede na") |
| Founding event of AI | **Dartmouth 1956**, McCarthy coins "artificial intelligence" |
| Two reports that triggered the AI winter | **Lighthill** (UK), **ALPAC** (US) |
| What can't a perceptron learn? | **XOR** (Minsky & Papert) |
| Chess vs. Go vs. universe | 10^123 vs. 10^361 vs. ~10^80 particles |
| The magic number | **70,000 ± 20,000** chunks; 10 years / 10,000 hours |
| Laws 4 and 5 in one line | search ⇄ knowledge substitute for each other |
| Deep Blue's numbers | tiny KB (openings + endgames); **200M moves/sec × 2 min** |
| Sphinx-3 ablation numbers | 4% → **30%** (no syntax); 4% → **6%** (no word-frequency) |
| Anytime vs. anyspace | anytime: interruptible, quality ↑ with time. anyspace: low memory, **optimal on termination** |

---

## References — §3.1 only (outside the lecture)

Everything else in this file cites `_generated/transcripts/Lecture_1_What_is_AI.md` by timestamp.

Dorkenwald, S., Matsliah, A., Sterling, A. R., Schlegel, P., Yu, S., McKellar, C. E., et al. (2024). Neuronal wiring diagram of an adult brain. *Nature, 634*, 124–138. https://www.nature.com/articles/s41586-024-07558-y

Eon Systems. (2026, March). *How the Eon team produced a virtual embodied fly.* https://eon.systems/updates/embodied-brain-emulation

Eon Systems. (2026, March). *The first multi-behavior brain upload.* https://eon.systems/updates/first-multi-behavior-brain-upload

Okunytė, P. (2026, March 13). The internet is buzzing about a digital fly brain: Are humans next? *Cybernews.* https://cybernews.com/ai-news/digital-fruit-fly-brain-simulation/

Sanders, R. (2024, October 2). Researchers simulate an entire fly brain on a laptop. Is a human brain next? *Berkeley News.* https://news.berkeley.edu/2024/10/02/researchers-simulate-an-entire-fly-brain-on-a-laptop-is-a-human-brain-next/

Shiu, P. K., Sterne, G. R., Spiller, N., Franconville, R., Sandoval, A., Zhou, J., et al. (2024). A Drosophila computational brain model reveals sensorimotor processing. *Nature, 634*, 210–219. https://www.nature.com/articles/s41586-024-07763-9

Tangermann, V. (2026, March 15). Researchers upload fly's brain to Matrix, let it control virtual body. *Futurism.* https://futurism.com/science-energy/research-fly-brain-matrix

Zeleznikow-Johnston, A. (2026, March 19). *No, we haven't uploaded a fly yet.* LessWrong. https://www.lesswrong.com/posts/ybwcxBRrsKavJB9Wz/no-we-haven-t-uploaded-a-fly-yet

ABV — AI · Books · Validation. (2026, March 9). *Startup runs a fruit fly brain in simulation: 125,000 neurons controlling a virtual body* [Video]. YouTube. https://www.youtube.com/watch?v=A8fDr7Rr7yM
