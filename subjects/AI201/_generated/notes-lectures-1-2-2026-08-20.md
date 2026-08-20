# AI 201 — Notes on Weeks 1–2
### Lecture 1: What is Artificial Intelligence? · Lecture 2: Intelligent Agents

**Sources:** `_generated/transcripts/Lecture_1_What_is_AI.md` (**L1**) · `_generated/transcripts/Lecture_2_Intelligent_Agents.md` (**L2**) · `AI201_1S26-27_Artificial_Intelligence_Syllabus.pdf` p.1
**Course:** AI 201 — *Fundamentals of Artificial Intelligence* [L1 00:00:00] · **Instructor:** Pros Naval · First Semester 2026–27

Lecture claims carry timestamps. Where I add context the lectures did not cover, it is marked **[beyond lecture]** — that material is there because several lecture claims are otherwise assertions you would have to take on faith, but you should always know which is which.

**Three provenance markers, and the third one matters most:**

| Marker | Source | Why you care |
|---|---|---|
| `[L1 hh:mm:ss]` | **Spoken** in the lecture | The lecturer said it |
| 📊 `[slide N/30]` | **On the slide, never read aloud** | A transcript cannot contain this. It is examinable and it is not in any audio |
| **[beyond lecture]** | My addition | Not attributable to the course |

The 📊 material was recovered by reading the decks out of the video frames directly. **The lecturer skips a great deal of on-screen content** — he narrates 4 rows of an 8-row table, works 1 of 5 examples, and says *"analyze this on your own"* over a full classification table. All of it is below.

✅ **Transcript repaired 2026-08-20.** A decoder repetition loop had destroyed **[L2 00:41:45]–[00:44:29]** and **[L2 00:48:03]–[00:53:10]** — ~6.4 minutes of actual speech. That window was re-transcribed and spliced back in, with both boundaries verified word-for-word against the surviving text. **These notes now cover both lectures end to end, with no gaps.** The recovered minutes supplied the lecture's own motivation for the utility-based agent (§14.6) and its formal definitions of the environment axes (§15) — material that was previously reconstructed and is now quoted.

---
---

# PART ONE — LECTURE 1: WHAT IS ARTIFICIAL INTELLIGENCE?

The lecture covers, in order [L1 00:00:00]: the nature of AI and its problem domains, a brief history, the five laws of intelligent action, and the risks and benefits of AI.

---

## 1. The definition

> **Artificial intelligence is the field of human endeavor concerned with understanding the nature of intelligence and the construction of intelligent systems.** [L1 00:00:46]

Two halves, and they pull in different directions. *Understanding the nature of intelligence* is a **scientific** aim — there is a phenomenon, and we want to know what it is. *Construction of intelligent systems* is an **engineering** aim — we want to build things that work. The field has never fully reconciled these, and §2 is the record of the argument.

The lecture then defines the object being built:

> **By intelligent systems, we mean machines that compute how to act effectively, safely, ethically, responsibly, in a wide variety of novel situations.** [L1 00:01:17]

Take this clause by clause, because every phrase is load-bearing:

| Clause | What it demands |
|---|---|
| **compute how to act** | The output is an **action**, not a belief, a proof, or a classification. Everything else is in service of choosing what to do. |
| **effectively** | It must actually work — performance, not plausibility. |
| **safely, ethically, responsibly** | These are in the *definition*, not appended as an afterthought. §9 is why. The lecture stresses that the machines we develop must be safe and *"in accordance with responsible AI."* |
| **in a wide variety of novel situations** | **The hardest clause.** Novel means the designer did not anticipate it. A system that handles only what was foreseen is not intelligent by this definition — which is exactly why the table-driven agent of §14.1 fails. |

Hold onto the last row. "Novel situations" is the thread that runs through both lectures: it rules out lookup tables, it is what *autonomy* (§12) is defined to capture, and it is what the designer of a reflex agent cannot supply (§14.5).

---

## 2. The four definitions of AI

The lecture asks two questions [L1 00:01:53]:

1. Does *intelligence* in AI refer to **fidelity to human intelligence**, or to **rationality**?
2. Is intelligence a property of the **internal thinking** of a human being, or of **external behavior**?

These are independent, so they give two axes and four combinations, *"each of them having adherence \[adherents], giving rise to different research fields"* [L1 00:03:05]. The four are: systems that **act like humans**, systems that **think like humans**, systems that **think rationally**, and systems that **act rationally** [L1 00:03:05].

```
                        THOUGHT (internal)          BEHAVIOR (external)
                 ┌────────────────────────────┬────────────────────────────┐
                 │   THINKING HUMANLY         │   ACTING HUMANLY           │
   HUMAN         │   Cognitive modelling      │   Turing Test approach     │
   (fidelity to  │   §2.2                     │   §2.1                     │
    humans)      │                            │                            │
                 ├────────────────────────────┼────────────────────────────┤
                 │   THINKING RATIONALLY      │   ACTING RATIONALLY   ★    │
   RATIONAL      │   "Laws of thought"        │   Rational agent           │
   (ideal        │   §2.3                     │   §2.4 — THIS COURSE       │
    correctness) │                            │                            │
                 └────────────────────────────┴────────────────────────────┘
```

### 2.1 Acting humanly — the Turing Test [L1 00:03:43]

**Alan Turing, 1950.** A machine is deemed intelligent when it exhibits behavior **indistinguishable from that of a human being.**

**The test as the lecture describes it** [L1 00:04:18]:

```
   You are typing into a computer terminal.
   At the other end of the line is either another person or an AI system.
   You have THIRTY MINUTES to ask whatever questions you like.
   If at the end of that time you cannot RELIABLY DISTINGUISH the human
   from the artificial respondent, the AI system is considered intelligent.
```

The lecture notes this is *"even today difficult to achieve"*, because the system must be capable of discussing *"a wide range of topics, practically any subject under the sun"* [L1 00:04:56]. Breadth, not depth, is the demand.

**The multiplication example** [L1 00:05:33] — worth walking through slowly, because it is a structural criticism of the test, not a joke:

```
   Interrogator: "Multiply these two 10-digit numbers."

   Ordinary human   →  answers after ~5 minutes, and the answer might be WRONG
                       (forgotten multiplication tables; human error)
   Computer         →  answers in under 1 second, exactly RIGHT

   The lecture's inference:  "a wrong answer might mean that the respondent
                              is human"  [L1 00:06:04]
```

So being *good* at arithmetic is evidence of being a machine. To pass, a machine must be **slower and worse** than it is capable of being.

**Turing's equation** [L1 00:06:35]: intelligence is equated with **intelligent behavior** — *"the ability to achieve human-level performance in all cognitive tasks sufficient enough to fool an interrogator."* The lecture emphasizes the point twice: *"there is emphasis on action. There is emphasis on behavior"* [L1 00:07:06].

**[beyond lecture]** Two consequences follow, and they are worth stating because they explain why the field eventually moved to a different quadrant:

- The Turing Test is a **matching** criterion, not a **maximizing** one. It rewards resemblance, and resemblance requires imitating human weakness. That is an odd thing to ask of an engineering discipline.
- It sets the **ceiling at human level**. A system twice as capable as any person fails, if the excess is detectable.

**The modern version.** When Turing proposed the test, the machine was *"just a simple computer with maybe a teletype"* — like a typewriter [L1 00:07:39]–[00:08:11]. Now you speak to a microphone, *"the equivalent of the ear of your computer"* [L1 00:08:47]. To pass the modern version, a machine needs **six capabilities** — and these are exactly the major subfields of AI [L1 00:08:11]–[00:10:29]:

| # | Capability | Subfield |
|---|---|---|
| 1 | Communicate successfully in a **human language** — not a computer language; *"it could even be in Filipino or Cebuano or whatever language you like"* | **Natural language processing** |
| 2 | **Represent and store knowledge**, in a symbolic or non-symbolic way | **Knowledge representation** |
| 3 | **Draw conclusions** from available knowledge, using **induction or deduction** | **Automated reasoning** |
| 4 | **Detect and extrapolate from patterns**, and learn to adapt to new situations | **Machine learning** |
| 5 | **Perceive the world** using cameras and microphones | **Computer vision** and **speech recognition** |
| 6 | **Manipulate objects and move about** in the world | **Robotics** |

The lecture calls these *"the six subfields which constitute the major disciplines within artificial intelligence"* [L1 00:10:29]. The Turing Test was constructed to require essentially everything — which is why this list doubles as a table of contents for the field.

**[beyond lecture]** Note that #5 and #6 were *not* required by the original 1950 setup. The teletype was a deliberate wall: text-only interaction excludes appearance, voice, and physical action, isolating whatever it is that language use reveals. Adding perception and robotics produces a **different and stronger test**, not the same test updated.

### 2.2 Thinking humanly — the cognitive modelling approach [L1 00:11:12]

Here **AI is equated with human thinking**. The lecture is candid that this is *"very challenging, because this requires us that we get inside the actual workings of the human mind."*

**Three sources of evidence** [L1 00:11:12]–[00:12:57]:

1. **Introspection** — examining your own thought processes.
2. **Psychological experiments.**
3. **Brain imaging** — functional magnetic resonance imaging (fMRI) and EEG, which *"observe the brain in action"* and *"attempt to read the mind"* by monitoring **brain activity, blood flow, and glucose consumption** while the person performs mental tasks.

**The method** [L1 00:12:57]:

```
   introspection  ─────┐
   psych experiments ──┼──►  a PRECISE, TESTABLE THEORY of the workings
   brain imaging ──────┘      of the human mind
                                        │
                                        ▼
                              expressed as a COMPUTER PROGRAM
                                        │
                                        ▼
              if the program's INPUT–OUTPUT BEHAVIOR matches the
              corresponding human behavior, it is EVIDENCE that the
              program's mechanism could be similar in humans
```

Read the last clause carefully: **evidence**, not proof. Matching behavior underdetermines mechanism — two systems can produce identical outputs by entirely different means. That deliberate hedge is the whole difficulty of the "thought" axis in one word, and it is why cognitive modelling and AI eventually separated into different departments.

### 2.3 Thinking rationally — the laws of thought [L1 00:13:31]

Based on **Aristotelian logic**, which uses **deductive reasoning** to reach conclusions via **modus ponens** and **modus tollens**.

> A **syllogism** is *"a formula of argument consisting of two propositions — the premises — and a conclusion that is logically drawn from them."* [L1 00:14:11]

The lecture's example, in full:

```
   Major premise  :   All men are mortal.
   Minor premise  :   Socrates is a man.
   ──────────────────────────────────────────
   Conclusion     :   Socrates is mortal.
```

**The key property** [L1 00:14:45]: *"It's like a mathematical formula. It's always true. If the major premise is correct, the minor premise is correct, then the conclusion is necessarily correct. You just apply the mathematical formula and you get the answer."* Stated as a law:

> **Syllogisms always give correct conclusions provided that the premises are correct.** [L1 00:15:16]

For AI, the modern form is **formal logic — first-order predicate logic**, which *"provides a precise notation for describing correct reasoning"* [L1 00:15:16], and which this course will study later. The concern of this approach is **how to obtain correct inferences.**

**The two supporting inference rules** — the lecture names them but does not spell them out, so:

```
   MODUS PONENS      If P then Q.   P is true.        ⟹  Q is true.
   MODUS TOLLENS     If P then Q.   Q is FALSE.       ⟹  P is false.
```

*(The transcript renders modus tollens as "modus tonens" — a recognition error.)*

### 2.4 Acting rationally — the rational agent ★ [L1 00:16:00]

**This is the definition the course adopts.**

> Artificial intelligence means **acting rationally so as to achieve one's goals given one's beliefs.** [L1 00:16:00]

You have a **goal**, and you have **beliefs about the world**; given these, you take actions in the environment so as to achieve the goal [L1 00:16:32]. And the textbook definition:

> **AI is the study and construction of rational agents.** [L1 00:16:32]

**Why this quadrant rather than the laws of thought?** The lecture gives three reasons [L1 00:17:04]–[00:18:14]:

1. **Forming correct inferences is just *one way* of acting rationally.** Syllogisms are fine — *"that's correct, it's great"* — but they are a part, not the whole.
2. **We are not reasoning logically all the time.** *"Very often we just do what we are supposed to do without even thinking… without really logically reasoning out the individual steps."*
3. **In many situations there is no provably correct action to perform, and yet it is necessary to act.**

Which the lecture compresses into a line worth memorizing:

> **"Part of intelligence is knowing what to do when one does not know what to do."** [L1 00:17:40]

Therefore *"making inferences is just part of rationality"* [L1 00:18:14].

**[beyond lecture] — what the choice costs.** Each quadrant has a characteristic failure mode, and moving to *acting rationally* does not escape having one; it changes which one you have:

```
   THINKING RATIONALLY   asks:  is this inference VALID?
                         fails: silent under uncertainty; the world
                                resists complete axiomatization

   ACTING RATIONALLY     asks:  does this action MAXIMIZE the objective?
                         fails: you must now WRITE DOWN the objective
                                                    ↓
                                          §11.4 — and you cannot
```

Reason 3 above is the serious one, and it has a precise history. Classical logic gives you *entailment* — if the premises hold, the conclusion holds — and nothing when premises are uncertain, incomplete, or inconsistent, which is the normal condition of an agent in the world. Two specific breakdowns made this concrete: the **qualification problem** (write "turning the key starts the car" and it is false — not unless the battery is charged, the tank not empty, no potato in the tailpipe, and the list has no natural end) and the **frame problem** (having acted, you must derive everything that did *not* change, and the list is enormous). Neither is a bug in an implementation. Both follow from demanding certainty with incomplete knowledge.

Note also what this choice commits you to. If rationality means *maximizing a measure of performance*, then that measure must exist as a mathematical object. **The utility function of §14.6 is not an advanced extra — it is implied here, in Lecture 1.**

---

## 3. Rationality: perfect and bounded

### 3.1 Perfect rationality [L1 00:18:14]

> **Perfect rationality means always doing the right thing, all the time.**

And it is unattainable for a computer, *"especially in complicated environments, because the computational demands are just too high. You cannot possibly consider all the possible scenarios, because it would take a long time, and that would take a lot of computational resources"* [L1 00:18:51].

**[beyond lecture]** There is a deeper reason than speed, and it matters because it tells you the problem will not go away with better hardware. Deliberation takes time, and time affects the value of the outcome. So an agent must decide **how long to deliberate** — but that is itself a decision requiring deliberation, which requires deciding how long to deliberate about *it*:

```
   choose action
     └─ needs: how long to think?
          └─ needs: how long to think about how long to think?
               └─ ⊥   infinite regress
```

For an agent **embedded in time**, "always do the right thing" is not a demanding standard — it is an ill-defined one. Bounded rationality is therefore not a sad compromise to be escaped when machines get faster. It is the only coherent notion of rationality for an agent that exists in time.

### 3.2 Bounded rationality [L1 00:18:51]

> **Herbert Simon, 1957.** Originally an economic theory: consumers have **limited rational decision making**.

**Three driving factors** [L1 00:19:26]:

| Driver | In economics | Machine analogue |
|---|---|---|
| **Cognitive ability** | Consumers have non-infinite cognitive abilities | Finite memory and processing |
| **Time constraint** | Consumers must decide by a deadline | A deadline on the decision |
| **Imperfect information** | Consumers do not have perfect information | Partial observability (§15.2) |

Consequence: consumers **make suboptimal decisions**, and are *"influenced by moods, by emotions"* [L1 00:19:58].

These are not three obstacles to be removed one at a time. They are the three ways the world refuses to let you optimize, and nearly every technique in this course answers one of them.

### 3.3 Satisficing [L1 00:20:32]

> **Satisficing** is a decision-making strategy **aiming for a satisfactory or adequate result rather than the best, optimal result.**

The lecturer's Filipino gloss: **"Pwede na."** [L1 00:20:32]

> *"Instead of exerting maximum effort towards attaining the ideal outcome, we focus on good enough or satisfactory solutions. And that is because we have to act under bounds of time and space."* [L1 00:21:04]

**For computers** [L1 00:21:37]–[00:22:10] the bound is concrete: finite memory for the computation, and no tolerance for a machine *"taking a week just to get the best solution."*

```
   PREFERRED   suboptimal answer in a few seconds   ✔   "that's what we need,
                                                          we need to decide now"
   REJECTED    optimal answer after a week          ✘   "we cannot wait for a week"
```

**[beyond lecture]** Satisficing is more specific than "trying less hard." Simon's mechanism is an **aspiration level** — a threshold of acceptability. You examine alternatives in whatever order they arrive, take the **first** that clears the threshold, and adjust the threshold with experience.

```
   OPTIMIZING     enumerate all alternatives → evaluate each → take the max
   SATISFICING    set aspiration α → take the first alternative with value ≥ α
                  → adjust α from experience
```

And the point that reframes it: **when evaluation is costly, satisficing can be the optimal policy** once the cost of searching is counted in the objective. The "rejected" row above is not *wrong* — it is optimal for an objective that assigns no cost to delay. Put delay into the objective and the "preferred" row *is* the optimum. Satisficing is what optimizing looks like when the objective is honest about time.

---

## 4. A brief history of AI

The lecture walks five phases [L1 00:22:41]–[00:37:56]. Learn the shape — expectation, collapse, recovery — not just the dates.

### 4.1 Inception: early 1940s → mid 1950s [L1 00:22:41]

| Year | Milestone |
|---|---|
| **1943** | **McCulloch & Pitts** — computational model of the neuron. *"It gave rise to the neural networks and eventually deep learning."* |
| **1950** | **Minsky & Edmonds — SNARC**, the first neural-network computer, built from **3,000 vacuum tubes** |
| **1950** | **Turing** proposes the Turing Test; also *"already conceived of programs that learn from data rather than from hard-coded intelligence"*; and *"warned that achieving AI might not be the best thing for the human race"* [L1 00:23:56] |
| **1952** | First **checkers-playing** programs |
| **1956** | **Dartmouth College AI workshop** — *"widely considered the founding event of AI."* First use of the term **artificial intelligence**, by **John McCarthy** [L1 00:24:27] |
| **1956** | **Logic Theorist** (Simon) — proves mathematical theorems. It found a **shorter proof** than Bertrand Russell's; the paper was **rejected**, *"because they didn't really believe that the machine could do theorem proving"* [L1 00:25:03]–[00:26:22] |

Two of these deserve a second look. Turing in 1950 anticipated both **machine learning** and **AI risk** — the two things the field would spend the next seventy years on. And the Logic Theorist rejection is a reminder that peer review is a social process: the result was correct and was refused because it was unbelievable.

*(Transcript renders "McCulloch" as "Makilov", "Edmonds" as "Edwards", "SNARC" as "SNARK".)*

> 📎 **The resource the lecturer points to** [L1 00:26:22] — *"there are many interesting articles about the history of AI."* 📊 The URL is on **slide 11/30** and was never spoken:
>
> **The History of Artificial Intelligence — https://exhibits.stanford.edu/ai** (Stanford Libraries digital exhibit)

### 4.2 Great expectations: early 1950s → late 1960s [L1 00:26:22]

*"There was great excitement about AI and also great expectations."*

📊 The slide dates this era precisely — **"Early enthusiasm and great expectations (1952–1969)"** — and attributes every entry. The lecturer names almost none of them, so the attributions below are slide-only:

| Year | Milestone | Camp |
|---|---|---|
| 1952 | 📊 **Strachey and Samuel** — first checkers-playing programs. **Samuel's** uses **reinforcement learning** | **symbolic** ✋ |
| 1957 | **Rosenblatt's Perceptron convergence theorem** | **non-symbolic** ✋ |
| 1958 | 📊 **McCarthy** developed **LISP**, *"used for the next 30 years"* | symbolic ᵢ |
| 1959 | 📊 **Newell and Simon's GPS** (General Problem Solver) — *"solved puzzles like a human being"* | symbolic ᵢ |
| 1960 | 📊 **Widrow and Hoff — ADALINE**, the *Adaptive Linear Element* (the lecture says only "the 60s… this Adeline") | non-symbolic ᵢ |
| 1963 | 📊 **Micro-worlds — the Blocks World**, with the papers it produced named individually: **vision (Huffman, 1971)**, **constraint propagation (Waltz, 1975)**, **NLP (Winograd, 1972)**, **planner (Fahlman, 1974)** | symbolic ᵢ |
| 1963 | 📊 **Winograd and Cowan** — *a large number of neural elements can represent a concept*. (This is the transcript's unresolved *"then these two guys put together neural elements"* [L1 00:28:02]) | non-symbolic ᵢ |
| 1965 | **Robinson's resolution principle** for first-order logic | **symbolic** ✋ |


✋ **Only three of these camps are the lecturer's.** The slide carries **no** symbolic/non-symbolic labels — he assigns them by pointing at the screen [L1 00:29:39]–[00:30:10], and I checked the cursor position in the video against what he was saying at that instant. He marks exactly three: **1952 Samuel's checkers = symbolic**, **1957 Rosenblatt's perceptron = non-symbolic**, **1965 Robinson's resolution = symbolic**. Rows marked ᵢ are **my** attribution, not his — defensible (LISP and GPS are symbol manipulation; ADALINE and Winograd–Cowan are neural), but do not quote them as the lecture's.

📊 Two of these are worth holding. **McCarthy** appears twice in the history — he names the field at Dartmouth in 1956 *and* writes LISP in 1958. And the **Blocks World line is a reading list**, not a milestone: four separate results, each a different subfield, all from one micro-world. That is the strongest possible evidence for the lecture's claim that micro-worlds *"produced a lot of papers"* — and for the §4.3 criticism that they did not scale.

**The two camps** [L1 00:28:02]–[00:29:39] — *"even up to now, they're still there"*:

```
   SYMBOLIC AI                          │   NON-SYMBOLIC AI (connectionist)
   "Intelligence NEEDS SYMBOLS that     │   neural networks
    can be manipulated; the symbols     │   "you don't know what's going on
    are the ones that give rise to      │    inside, there's no symbol there,
    conclusions."                       │    they just [have] weights"
   AI = manipulation of symbols.        │
              ↘                        ↙
     both "vying for funding from the different government funding
     agencies… trying to outwit the other camp"      [L1 00:29:39]
```

That last line is not gossip. Research programmes are not selected purely on evidence, and the next phase was triggered by funding reports rather than by experiments.

### 4.3 The AI winter: 1960s → mid 1970s [L1 00:30:10]

*"The hype was gone."* Three causes:

1. **Overconfidence.** Researchers promised great performance, but the results were *"just made on simple examples like the micro world. They were not scalable."* Theorem proving broke down beyond *"more than a dozen facts"* [L1 00:30:41]–[00:31:12].
2. **Minsky & Papert** showed **mathematically** that the **perceptron cannot learn the exclusive-or (XOR)** operation [L1 00:31:12].
3. The **Lighthill report** 📊**(1973)** emphasized *"the failure to come to grips with combinatorial explosions"* — search spaces *"simply just exploding combinatorially"*, which at the time nobody could deal with [L1 00:31:12]–[00:31:47].

Consequence: the **Lighthill report (UK)** and the **ALPAC report (US)** triggered the **AI winter**, *"thereby reducing funding for artificial intelligence research"* [L1 00:31:47].

**[beyond lecture] — which of these is fixed?** Cause 2 was solved outright by multi-layer networks and backpropagation (§4.5). Cause 3 was never *solved* but **circumvented** — combinatorial explosion is still a fact (10¹²³, 10³⁶¹), and what changed is that we stopped searching exhaustively and learned to search selectively. **Cause 1 has never been fixed**, because it is sociological rather than technical: impressive demo in a restricted setting → generalized claim → failure to scale → collapse of confidence. §15.4's lesson about environment classes is the same pattern in miniature, and the question *"what was this demonstrated on, and what does that license?"* would have caught the first winter in advance.

### 4.4 Expert systems: 1960s → mid 1980s [L1 00:32:19]

*"Artificial intelligence was back, with expert systems."* 📊 The slide dates the era **1969–1986**.

| System | What it did |
|---|---|
| 📊**DENDRAL** (1969, **Buchanan** et al.) | Chemical analysis — hypothesized the **molecular structure** of substances. Rivaled human chemical experts at this task |
| 📊**MYCIN** (1975, **Shortliffe** et al.) | A **backward-chaining** expert system with a knowledge base of about **600 rules**. Identified **bacteria causing severe infections** and recommended **antibiotics with dosage adjusted for the patient's body weight** [L1 00:32:51] |
| **R1** (1982, 📊**McDermott**) | The **first commercial expert system** — a **rule-based production system** [L1 00:33:28] |
| **Japanese Fifth Generation Project** (1982) | Computers using **logic programming** (Prolog) with **massively parallel computing**. Ran about a decade, *"produced very good results. However, it was a commercial failure"* — companies did not adopt it, *"probably too expensive"* [L1 00:33:28]–[00:34:34] |

### 4.5 Probabilistic reasoning → the deep learning age [L1 00:34:34]

| Year | Milestone |
|---|---|
| 1980s | **Hidden Markov Models (HMMs)** — *"very successful for speech recognition"* |
| 1982 | **Vapnik & Chervonenkis** — learning theory, the **VC dimension** |
| 📊**1986** | **Backpropagation** — Rumelhart, Hinton & Williams. *"Later they discovered that somebody else proposed the same algorithm in the mid-70s… actually a master's thesis, but since no one was reading that master's thesis, the rest of the world did not know."* Rediscovered about a decade later [L1 00:35:37]–[00:36:10] |
| 1988 | **Bayesian networks** — Judea Pearl (UCLA) |
| 1988 | **Sutton's reinforcement learning** book |
| 1992 | **Support vector machine** — Vapnik |
| 2011 | **IBM Watson** — answers questions posed in natural language; competed on **Jeopardy!** and won first prize, **$1 million**, against human champions. Later applied to **lung cancer treatment** decisions 📊**at Memorial Sloan Kettering Cancer Center** [L1 00:36:47]–[00:37:23] |
| 2012 | 📊**Krizhevsky's AlexNet** — *"which started the deep learning craze"* |
| 2014 | **Goodfellow's Generative Adversarial Network** |
| 2015 | **ResNet-152** exceeded **human performance on ImageNet** |
| 2016 | **AlphaGo** won over human players |
| 2017 | **Self-supervised learning**; **Google Brain's Transformer architecture** [L1 00:37:56] |

The backprop story is worth keeping: the field **lost roughly a decade** to a communication failure, not a technical one.

---

## 5. AI problem domains and their attributes [L1 00:37:56]

📊 **[slide 16/30] — the lecturer reads only 4 of these 8 rows.** The four he skips are in the middle of the complexity ladder, which is exactly where the interesting comparisons are. Full table as it appears on screen:

| Problem Domain | Knowledge Content | Data Rate | Response Time |
|---|---|---|---|
| **Puzzles** (e.g. crossword) | Poor | Low | **Hours** |
| **Chess** | Medium | Low | **Minutes** |
| 📊 **Theorem Proving** | Medium | Low | **Variable** |
| 📊 **Expert Systems** | Rich | Medium | **Variable** |
| 📊 **Natural Language** | Rich | Medium | **Real time** |
| 📊 **Motor Processes** | Rich | High | **Real time** |
| **Speech** | Rich | High | **Real time** |
| **Vision** | Rich | **Very high** (video, many Mbps) | **Real time** |

Two things the full table shows that the 4-row version hides:

1. **"Response time" is the column that separates the field.** *Variable* (theorem proving, expert systems) means the system may think as long as it likes — you get correctness-limited problems. *Real time* means a deadline you did not choose. Everything from Natural Language down is deadline-bound, and that is the wall.
2. **Knowledge content saturates at "Rich" and stops discriminating.** Five of eight domains are Rich. So knowledge content cannot be what makes vision harder than expert systems — **data rate** is the only column still moving at the bottom of the table. That is the quantitative form of the lecture's *"two orders of magnitude"* claim.

⚠️ **A discrepancy worth knowing before an exam.** The lecturer *says* vision's knowledge content is *"very rich"* [L1 00:38:30]; **the slide says "Rich"** — same as speech, expert systems, NL, and motor processes. Only the *data rate* column reads "Very high". If asked to reproduce the table, follow the slide.

The complexity ladder the lecture states explicitly:

```
   puzzles  <  chess  <<  speech  <<  vision
                       ↑              ↑
      "speech recognition is      "the task complexity for vision is about
       several orders of           TWO ORDERS OF MAGNITUDE more than
       magnitude more complex"     that of speech"        [L1 00:50:21]
       [L1 00:46:37]
```

### 5.1 Chess — a testbed for search [L1 00:39:02]

> *"Chess is an excellent testbed for developing search algorithms… because there are more than **10¹²³** possible moves. In which case, brute-force exhaustive search will not work."*

**The scale anchor** [L1 00:39:38]–[00:40:09]: the number of **particles** in the universe — *"not atoms, but particles… photons included, light particles included, the protons, all the particles"* — is *"in the vicinity of 10⁸⁰-ish. Still a very small number compared to the number of possible moves for chess."*

```
   10¹²³ / 10⁸⁰  =  10⁴³
   The chess move space is ~43 orders of magnitude larger than the
   matter available to build a computer out of.
```

**History of chess programs** [L1 00:40:49]–[00:41:24]:

| Era | System | Achievement |
|---|---|---|
| mid-1950s | 📊**Newell, Shaw & Simon** | First operational chess program |
| 1960s | 📊**Greenblatt Chess Program** | Won a game in a regular tournament, beating a **Class C** player. 📊 Slide gives the scale: *US Chess Federation Class D ≈ 1,200 pts → Grandmaster ≈ 2,600 pts* |
| 1970s–80s | Northwestern, 📊**Belle**, **HiTech** | **Senior Master** rating |
| — | **Deep Thought** (CMU) | First to achieve **Grand Master** status |
| **1996** | **Deep Blue** (IBM) | **Lost** to Kasparov, 4–2 |
| **1997** | **Deep Blue** | **Won** over Kasparov — *"a very important milestone… an AI machine has won over the number one chess player in the world"* |

Chess research produced **alpha-beta search, B\* search, and singular extension search**, and *"many of these search concepts have found their way into everyday applications"* [L1 00:41:24]–[00:41:56]. *(Transcript renders B\* as "V star".)*

### 5.2 Go — a testbed for reinforcement learning [L1 00:41:56]

> *"Go is a game that is more difficult. It is a more advanced testbed for developing reinforcement learning algorithms. There are more than **10³⁶¹** possible moves for Go."*

| Year | Milestone |
|---|---|
| 2007 | First serious computer Go attempt — **Monte Carlo tree search** for Go |
| 2010 | 📊**MogoTW** won against **Catalin Taranu (5-dan pro)** |
| 2011 | **Zen** won against 📊**Takemiya Masaki** |
| 2013 | **Crazy Stone** beat 📊**Yoshio Ishida** |
| 2015 | **AlphaGo** beat the European Go champion **Fan Hui** |
| 2017 | **AlphaZero** beat 📊**Ke Jie (world rank 1)**; **Leela Zero** released — *"free and open source… you can download this and examine its innards"* [L1 00:43:29] |

**AlphaZero** (DeepMind, 2017) can play **chess, Go, and shogi** [L1 00:44:00]. Reactions from top players [L1 00:44:00]–[00:44:40]: Kasparov said *"it was a pleasure to watch AlphaGo play, especially since its style was open and dynamic like his own"*; 📊**Peter Heine Nielsen** said it *"played like a superior alien species."*

**DeepMind's own contrast** [L1 00:44:40]–[00:46:03]. Their framing first: *"the game of chess represented **the pinnacle of AI research over several decades**"* — the contrast below is meant to be read as a claim about that whole tradition, not about one opponent:

```
   STATE-OF-THE-ART CHESS ENGINES     │   ALPHAZERO
   ───────────────────────────────────┼──────────────────────────────────
   search MILLIONS of positions       │   searches 1000× FEWER positions
   leverage HANDCRAFTED domain        │   NO domain knowledge except
     expertise                        │     the rules
   sophisticated domain adaptations   │   a GENERIC reinforcement
     requiring tuning                 │     learning algorithm
   decades of development             │   superior results within a FEW
                                      │     HOURS of training — by
                                      │     playing against itself
```

Less knowledge **and** less search. §6.6 resolves how that is possible without violating Laws 4 and 5.

### 5.3 Speech recognition [L1 00:46:03]

*"Speech recognition is far more complex than playing chess."* Its requirements [L1 00:46:37]–[00:47:07]: it must **operate in real time**, **exploit vast amounts of knowledge**, **tolerate error and imprecision**, **learn and use language**, and **learn from examples**.

On imprecision [L1 00:47:07]–[00:47:41]:

> *"When a person is talking in whatever language, that's not perfect grammar. Almost no one speaks with perfect, totally perfect grammar. Even the native users of the language speak with ungrammaticality, with imprecision. Yet the human mind is able to decode the information."*

And why this matters for the whole field [L1 00:47:41]:

> *"Research into speech recognition provides insights into the structure of intelligent agents, especially as regards how systems can deal with **incomplete, inaccurate, and partial knowledge** in problem solving — because that is the nature of speech."*

| Year | Milestone |
|---|---|
| 1970s | **Harpy, Hearsay, HWIM** — connected-speech systems using **syntax and semantics** as major knowledge sources |
| — | **Sphinx-3** (CMU) — **50,000-word** vocabulary on a voicemail dictation task, running **real time on a Pentium Pro**, and **speaker-independent** |
| 2002 | DARPA **EARS** — detects keywords in telephone conversations reliably |
| 2007 | **CTC** (Connectionist Temporal Classification) — *"the basis of future connectionist algorithms for speech recognition"* |
| 2015 | **Google Voice** — a dramatic performance improvement of **49%** using **LSTM** neural networks |

Techniques it produced: **word models, HMM-based learning, beam search, and CTC** [L1 00:49:49].

### 5.4 Vision [L1 00:49:49]

> The goal of computer vision is **to understand the world**: automatic interpretation and understanding of image data, and **construction of 3D models from real-world scenes**.

Three important visual tasks [L1 00:50:21]–[00:51:00]:

```
   RECOGNITION    we need to see in order to recognize objects around us
   MANIPULATION   we need to see so that we can manipulate objects —
                  a doorknob, a switch
   MOBILITY       we need to see in order to navigate successfully in the world
```

### 5.5 Robotics [L1 00:51:00]

> **A robot is an active artificial agent whose environment is the real world.** [L1 00:51:00]

Computer-controlled manipulators are *"routinely used in many manufacturing environments."* Of special interest are **autonomous mobile systems**, also called **robotic vehicles** 📊(*"for navigation on roads"*), which are challenging to construct *"because they require several disciplines together: vision, advanced sensors, high-speed processors, planning, control, learning"* [L1 00:51:35]–[00:52:09].

| Year | Milestone |
|---|---|
| **1995** | **NAVLAB 5** — a commercial GM van modified for autonomous steering. Navigated correctly **90% of the time** from Washington D.C. to San Diego. *"When in doubt, the system asks the human driver to take over"* [L1 00:52:09] |
| **2010** | **VisLab** — the first **intercontinental** land journey by autonomous vehicles: **Parma, Italy → Shanghai, China, in 100 days** [L1 00:52:40] |
| Today | Waymo, GM, Pony.ai, Zoox and others [L1 00:53:11] |

That NAVLAB detail — *when in doubt, hand back to the human* — is worth noticing. It is an early, honest engineering answer to bounded rationality: know the limits of your competence and defer.

---

## 6. The five laws of intelligent action [L1 00:53:11]

```
   ┌──────────────────────────────────────────────────────────────────────┐
   │  L1   Bounded rationality implies OPPORTUNISTIC SEARCH               │
   │  L2   A PHYSICAL SYMBOL SYSTEM is necessary and sufficient for       │
   │       intelligent action                        ← contested          │
   │  L3   The magic number is 70,000 ± 20,000 chunks                     │
   │  L4   SEARCH compensates for lack of KNOWLEDGE   ⟵┐                 │
   │  L5   KNOWLEDGE compensates for lack of SEARCH   ⟵┘ one axis        │
   └──────────────────────────────────────────────────────────────────────┘
```

**[beyond lecture]** These are **empirical generalizations** from AI's first three decades, mostly from the Newell–Simon tradition — not laws in the physics sense. Nothing forbids their violation; they summarize what has been observed to work.

### 6.1 Law 1 — Bounded rationality implies opportunistic search [L1 00:53:11]

> When intelligent agents operate under conditions that **overload computational resources**, they deploy **opportunistic strategies and tactics of least-computation search** rather than **optimal shortest-path search.** [L1 00:53:41]–[00:54:17]

**The Makati traffic analogy** [L1 00:54:17]–[00:55:27]:

```
   Goal: get to Makati.   Obstacle: traffic.

   Shortest-PATH optimum  :  the main road, fewest kilometres    ✘ stuck in traffic
   Opportunistic choice   :  side streets, more kilometres,
                             more gasoline                       ✔ arrive FASTER

   ⟹ You re-optimize the objective you can actually afford: TIME, not distance.
```

The lecture notes there is active research on *"algorithms that approximate optimal computation search"* — i.e. deciding **how** to search is itself a decision problem.

### 6.2 Law 2 — The physical symbol system hypothesis [L1 00:55:27]

> **A physical symbol system is a necessary and sufficient condition for intelligent action.**

| Term | Meaning in the lecture [L1 00:55:27]–[00:56:33] |
|---|---|
| **Physical symbol** | A symbol **realizable by engineered components** |
| **Physical symbol system** | A **set** of such entities |
| **Symbol structure** | A structure built using the symbol system |
| **Operations** | **Creation, modification, reproduction, and destruction** of symbols |
| **Payoff** | These expressions *"can now be interpreted as **plans of action**"* |

**Status: contested.** The lecture flags it twice — *"this law has been challenged by several researchers"* and *"some researchers have actually criticized that this is not really necessary for intelligent action. So it really is debatable"* [L1 00:56:00]–[00:56:33].

*(The transcript renders this as "necessary insufficient" — a recognition error for "necessary and sufficient.")*

**[beyond lecture] — how contested, exactly.** This was Newell and Simon's central claim and the organizing hypothesis of a whole research programme. Its two halves are in very different shape:

```
   SUFFICIENT   "symbol manipulation is ENOUGH"
                unproven. No symbolic system has shown general intelligent
                action. Not refuted either — the programme hit scaling walls
                (§4.3) rather than a disproof.

   NECESSARY    "you CANNOT have intelligence without symbols"
                this half is in serious trouble. Systems manipulating no
                discrete symbols now do the standard examples of intelligent
                action: perception, language, game play.
```

The lecture's own timeline is the evidence: ResNet-152, AlphaZero, the Transformer [L1 00:37:23]–[00:37:56] manipulate nothing that Newell and Simon would recognize as a symbol — the lecture describes such systems exactly right as having *"no symbol there, they just [have] weights"* [L1 00:29:06]. The honest position is not "the symbolists lost" but that necessity looks false, sufficiency remains open, and the live question has become **what each kind of representation is good for.**

### 6.3 Law 3 — The magic number is 70,000 ± 20,000 [L1 00:56:33]

> **An expert knows around 70,000 ± 20,000 chunks of information** — *"a good guide for us to measure the size of an expert's knowledge base."*

The engineering use [L1 00:57:07]: if you are building an expert system and reach that many chunks, *"you know that you've reached the top."*

**Supporting evidence from cognitive science** [L1 00:57:07]–[00:58:14]:

1. The **vocabularies of college graduates** are around this size — *"it's not 10 times, it's not a million."*
2. The knowledge bases of expert systems **grow towards tens of thousands**.
3. **No human being reaches world-class status without at least a decade of intense, full-time study and practice** in the domain.

The corollaries [L1 00:58:14]–[00:59:23]:

```
   "Even if you're a genius, if you don't work very hard for 10 years,
    you can't really become world class — because there are many geniuses
    outside. The ones that work hard are the ones considered world class."

   Equivalent statement:  the 10,000-HOUR RULE.

   Lifetime arithmetic:   ~10 years per domain
                          ⟹ time enough for only TWO or THREE areas
                          ⟹ about 30 years
```

**[beyond lecture] — current standing.** The "chunk" is a real unit from the study of chess expertise: a perceptual pattern recognized as one object rather than as its parts. The order of magnitude survives. The **10,000-hour rule**, however, has been substantially qualified since: the underlying research concerned *deliberate practice* — structured, effortful, feedback-driven — and the round number is a popularization. Later meta-analysis found accumulated practice accounts for a substantial but far from dominant share of performance variance, differing sharply by domain (large in games and music, small in less structured fields). Practice is necessary; it is not close to sufficient, and 10,000 is not a threshold.

### 6.4 Law 4 — Search compensates for lack of knowledge [L1 00:59:23]

> **Search is trial-and-error behavior.** *"When faced with a puzzle we have never seen before, we engage in trial and error behavior until a solution is found."* Given the same puzzle again, *"you already know the solution, you already know the knowledge — there's no more trial and error."* [L1 00:59:54]

That last sentence is the whole idea: **knowledge is the residue of search already performed.**

**Worked example — Deep Blue** [L1 01:00:28]–[01:02:12]:

| | |
|---|---|
| 1960s–70s belief | 📊 Verbatim from the slide: *"In the 1960's and 70's, it was believed that **masters-level performance in chess cannot be achieved except by codifying and using the knowledge of expert human players**"* |
| Reality | *"Deep Blue's knowledge database is very small compared to that of a chess master"* — just the **opening and end games**. The rest is *"processed on the fly"* |
| Compensation | **200 million possible moves per second, for a duration of two minutes**, before choosing the best move |

Do the arithmetic:

```
   positions per move  =  2 × 10⁸ /s  ×  120 s  =  2.4 × 10¹⁰
   fraction of the tree =  2.4 × 10¹⁰ / 10¹²³  ≈  10⁻¹¹³      ← essentially nothing
```

And the lecture's crucial caveat [L1 01:01:37]:

> *"It's not really the best move, because no one knows the best move. To be able to get the best move, you have to compute all the way to the end. And with 10¹²³ possible moves, that's not within the capabilities of your computational device. So the best is **good enough** move, given the amount of effort that you have put."*

**The lesson** [L1 01:01:03]: *"it is possible to achieve expert-level performance even with little knowledge, as long as it could be compensated by search."*

**Second example — word-sense ambiguity in NLP** [L1 01:02:12]–[01:03:22]:

```
   "take"  →  take a shower | take a book | take a bus | …

   The precise meaning is clarified by CONTEXT, through the EXPLORATION
   OF THE ALTERNATIVES until the meaning is unambiguous.
                        ↑ that exploration IS search
```

> Law 4 in one line: *"When faced with a situation in which knowledge is yet to be acquired and codified, **search is a very good way to proceed**."* [L1 01:03:22]

### 6.5 Law 5 — Knowledge compensates for lack of search [L1 01:03:22]

> Knowledge **reduces uncertainty** and **constrains the exponential growth of search** needed to solve problems — *"you avoid combinatorial explosion through knowledge."*

**Example A — the Rubik's Cube** [L1 01:03:52]: most people take half an hour or more. *"But with practice, you gain more knowledge about the problem-solving process, and therefore the time is reduced. Gain more knowledge, you do less search, therefore less time to get the solution."*

Same person, same puzzle, two points in time. Nothing about the cube changed; only where the cost was paid.

**Example B — the Sphinx-3 ablation** [L1 01:04:32]–[01:05:02]:

| Configuration | Word error rate |
|---|---|
| Full system | **4 %** |
| **Syntactic** knowledge source turned off | **30 %** |
| **Probabilistic** knowledge (word-occurrence frequency) removed | **6 %** |

With syntax off, absurd strings like *"sleep roses dangerously young colorless"* **become legal**, and *"the error rate increases from 4% to 30%."*

**Why the asymmetry?** The two knowledge sources act on the hypothesis space in different ways:

```
   SYNTACTIC KNOWLEDGE — a CONSTRAINT.
     Declares whole regions of the space ILLEGAL. Remove it and the space
     the decoder must search GROWS enormously.                      → 7.5×

   FREQUENCY KNOWLEDGE — a RE-RANKER.
     Reorders candidates that are already legal. Remove it and the space
     is the same SIZE; only the ordering degrades.                   → 1.5×
```

> **Knowledge that changes the *size* of the search space dominates knowledge that changes only the *order* within it. Pruning beats re-ranking.**

**[beyond lecture]** A caution if you ever run an ablation: these figures are measured **singly**, and knowledge sources interact. "Removing B costs only 2 points" does not license "removing B and C costs only 4."

### 6.6 Laws 4 and 5 are one axis — and *where you pay* is a design choice

**[beyond lecture, but it unifies the lecture's own examples]**

Any function can be **stored** or **computed**. Storing costs space and design effort; computing costs time. Everything between is a spectrum:

```
   PURE STORAGE                                          PURE COMPUTATION
   ──────────────────────────────────────────────────────────────────────►
   lookup table       opening book +      learned         exhaustive search
   for every input    endgame tables      heuristic

   space:  enormous ◄──────────────────────────────────────────► minimal
   time:   O(1)     ◄──────────────────────────────────────────► enormous
```

The lecture's own examples land at different points: MYCIN's 600 authored rules at the far left; the chess grandmaster's 70,000 chunks at the left; **Deep Blue at the right**; the first-time Rubik's solver at the far right. A grandmaster and Deep Blue sit at opposite ends and achieve comparable results — which is exactly what "substitutable resources" means.

There is a second question hidden inside: **when** is the cost paid?

```
   DESIGN TIME     a human authors the knowledge
                   MYCIN's rules; Deep Blue's opening book; reflex rules
   TRAINING TIME   the system acquires knowledge by searching, offline
                   self-play; gradient descent; the grandmaster's decade
   RUN TIME        the system searches, per decision
                   Deep Blue's 2.4 × 10¹⁰ positions — paid again every move
```

**This resolves the AlphaZero puzzle from §5.2.** Less knowledge *and* less search looks like a violation of both laws. It is not:

```
   DEEP BLUE      little AUTHORED knowledge  +  massive RUN-TIME search    (L4)
   2017 ENGINES   much  AUTHORED knowledge  +  large   RUN-TIME search
   ALPHAZERO      much  LEARNED  knowledge  +  1000× LESS run-time search  (L5)
                       ↑
                  acquired by enormous offline self-play search,
                  compressed into network weights
```

**A trained model is compiled search.** AlphaZero moved the search to training time and collects the discount on every move afterward. What it genuinely lacks is *handcrafted* knowledge — a claim about **provenance**, which is what DeepMind actually asserted. And the lecture records the precursor: Turing in 1950 already conceived of *"programs that learn from data rather than from hard-coded intelligence"* [L1 00:23:56].

---

## 7. Terminology [L1 01:05:02]

| Term | Definition | What it means concretely |
|---|---|---|
| **Anytime algorithm** | An algorithm that can be **interrupted at any time** and will return a result **whose value monotonically increases with time** [L1 01:05:35] | *"If a program is running and after one minute I interrupt it — it gives me an answer. Not the perfect answer, a good enough answer. After another five minutes of computation, if I interrupt it again, it will give me a **better** answer."* |
| **Any-space algorithm** | Can work with **arbitrarily low memory** and **guarantees optimal solutions upon termination** [L1 01:06:14] | Trades space down while keeping optimality |

Both are engineering answers to bounded rationality (§3): they let you choose your point on the quality/resource curve. Note the pairing — the anytime algorithm answers Simon's **time constraint**, the any-space algorithm answers his **limited cognitive capacity**.

---

## 8. Grand challenges of AI [L1 01:06:44]

| Challenge | What it requires |
|---|---|
| **Translating telephone** — a Japanese speaker converses with an English speaker in real time; each hears their own language [L1 01:06:44] | A **large vocabulary** capable of translating **unrehearsed continuous speech**; a **natural-sounding speech synthesis** module that **preserves speaker characteristics**; NLP that deals with **ambiguity, non-grammaticality, and incomplete phrases** [L1 01:07:14] |
| **Accident-avoiding car** [L1 01:07:14] | Advances in vision and **sensor fusion** — *"using together information from your cameras, from your laser, sonar, and many other sensors"*; obstacle detection and avoidance [L1 01:07:51] |
| **Learning systems** — a robot that learns to assemble an appliance **by observing a person** do the same task [L1 01:07:51] | *"Like a child watching you do something, the child learns right away."* Still *"a holy grail."* Requires advances in **vision, language, problem solving, and learning theory** [L1 01:08:29] |
| **Self-replicating systems** — for **manufacturing in space** [L1 01:08:29] | **Knowledge capture for reverse engineering and replication**; robotics for **control, diagnosis, monitoring, and repair** of machinery [L1 01:09:05] |

---

## 9. Risks and benefits of AI [L1 01:09:37]

| Risk | The mechanism as the lecture describes it |
|---|---|
| **Lethal autonomous weapons** | *"A small group of people, terrorists for example, can deploy an arbitrarily large number of weapons against human targets defined by some recognition criteria"* — the weapon has a basic recognition capability, and *"when it sees certain people, it automatically kills"* [L1 01:09:37]–[01:10:08] |
| **Surveillance and persuasion** | **Monitoring of individuals on a massive scale**, raising privacy concerns; and *"using machine learning we can tailor information flows through social media that can modify political behavior such as voting."* The lecture dates this to **2016** and notes *"this is being used in a lot of countries"* [L1 01:10:08]–[01:11:12] |
| **Biased decision making** | Decisions biased by **race, gender, or other protected categories**. The mechanism is stated exactly: *"this bias might arise especially from data. Simply the data already contain the biases. So the algorithms just learn from the data and make decisions that are biased"* [L1 01:11:12]–[01:11:50] |
| **Impact on employment** | Jobs taken over by automation. *"Will the call center industry collapse? There are AI systems that can take over their jobs. We don't know"* [L1 01:11:50] |
| **Safety-critical applications** | Accidents by autonomous vehicles; mistakes in healthcare — *"and who's going to be responsible?"* [L1 01:11:50]–[01:12:28] |
| **Cybersecurity** | Machine learning used to **lure users into using malware**, and to create *"highly effective tools for personalized blackmail"* [L1 01:12:28] |

**Read the bias row against the definition in §1.** The lecture opened by defining intelligent systems as ones that act *"effectively, safely, ethically, responsibly"* [L1 00:01:17]. §9 is why that clause is in the definition, and the bias case shows why it cannot be handled as a separate ethics module: the system **did not malfunction**. It was asked to predict historical labels accurately, and it did. There is no bug to find. §11.4 develops this.

---
---

# PART TWO — LECTURE 2: INTELLIGENT AGENTS

Lecture 2 opens by recalling where Lecture 1 left off [L2 00:00:00]: we adopted the definition that equates intelligence with **rational behavior**; we assume the agent has **limited computational resources** and therefore departs from perfect rationality; this gives **satisficing behavior**, focused on *"generating good enough solutions rather than attaining the best possible outcome."* The lecture then examines *"the characteristics of these agents with bounded rationality — we call these agents **intelligent agents** — as well as their interaction with the world, which we call the agent's **environment**"* [L2 00:01:13].

Outline [L2 00:01:13]: the notion of agent and environment; the types of agents from simplest to most advanced; and the properties of environments.

---

## 10. What an agent is

> **An agent is a system that perceives its environment through its sensors and acts on that environment through effectors.** [L2 00:01:53]

**The loop** [L2 00:02:26]–[00:03:43]:

```
        ┌──────────────────────── ENVIRONMENT ────────────────────────┐
        │              (the source of percepts)                       │
        └───────┬──────────────────────────────────────▲──────────────┘
                │ percepts                             │ actions modify
                ▼                                      │ the state of the
        ┌───────────────┐                      ┌───────┴───────┐  environment
        │    SENSORS    │  detect the percepts │   EFFECTORS   │
        └───────┬───────┘                      └───────▲───────┘
                │                                      │
                ▼                                      │
        ┌───────────────────────────────────────────────────┐
        │              AGENT PROGRAM                        │
        │   processes percepts, computes, generates action   │
        └───────────────────────────────────────────────────┘
```

The lecture stresses that **this is a loop**: *"the agent is in an environment. It's continually receiving percepts, processing these percepts, and generating actions that modify the environment"* [L2 00:03:06]. **Effectors** are *"the parts of your agent that interact with the environment so as to modify the state of the environment"* [L2 00:03:43].

### 10.1 Examples of agents [L2 00:03:43]–[00:06:31]

| Agent | Sensors | Effectors | Environment |
|---|---|---|---|
| **Human agent** | Eyes, ears, skin (touch), nose (smell), tongue — *"the five senses"* | Hands, legs, mouth, etc. | The physical world |
| **Robot** — *"the prototypical intelligent agent in AI"* | *"the ubiquitous camera"*, laser range finder, microphone | Wheels, robot arm — *"anything that would generate action in the physical environment"* | The physical world |
| **Softbot** (software robot) | Text strings as input | Text strings as output | **The internet** |

The lecture's softbot example [L2 00:05:25]–[00:06:31]: *"You could have your software for efficiently browsing the internet. You could have your Google search engine, where the search engine accepts as inputs some text and generates some outputs — a document, or even a set of pictures. So the Google search engine is basically navigating in that environment, which is the internet."*

The softbot matters because it shows the agent abstraction is not about robots. An agent needs a boundary, percepts crossing inward, and actions crossing outward — not a body.

---

## 11. Rational agents

> **A rational agent is an agent that acts rationally so as to achieve one's goals given one's beliefs.** [L2 00:06:31]

So an agent has **goals** and it has **beliefs** — *"assumptions about the environment"* [L2 00:06:31].

**On "beliefs"** [L2 00:07:04] — the lecture heads off a misreading: *"nothing to do with religious beliefs. It's just a terminology. Basically it's about **knowledge about the environment**."*

The worked example is a good one:

```
   A ground robot may model the world as a TWO-DIMENSIONAL SURFACE —
   the floor. That belief is fine for most types of robots.

   But for a FLYING robot or a drone, it is no longer valid: the world
   must be modelled as a THREE-DIMENSIONAL SPACE.            [L2 00:07:04]
```

Beliefs are **assumptions that make the agent's reasoning tractable, and that can be wrong.** The 2D assumption is not a fact about the world; it is a modelling choice that happens to hold for wheeled robots and fails for drones.

### 11.1 Performance measures: the *how* and the *when* [L2 00:07:36]

*"It is necessary to measure achievement of goals. For this, we must evaluate **how** successful the agent is and **when** it was able to achieve goals."*

**The how** [L2 00:08:09]. **The performance measure indicates how successful the agent was.** For a vacuum-cleaning agent, the lecture offers [L2 00:08:42]–[00:09:47]:

```
   • the amount of dirt cleaned up in a day
   • the electricity consumed        — "we want it to be green"
   • the noise generated             — "it doesn't generate a lot of noise"
```

Already three measures, and they conflict. That conflict is exactly what §14.6's utility function exists to resolve.

**The when** [L2 00:09:47]. *"It's also important to determine when the agent is able to achieve its goal — or more specifically, **when to measure, when to evaluate performance**."*

The lecture's example is sharp:

> *"If I give a surprise exam at the start of the class, obviously the ones who will perform well are the ones with **good study habits** — not necessarily the ones who are really very smart. Even if you're not the smartest, you can get very high grades, you can even be the smartest in the class, if you have a good study habit."* [L2 00:09:47]–[00:10:48]

**The timing of the measurement changes what is being measured.** A surprise exam measures preparation; an announced exam measures preparation plus cramming capacity. Same students, same material, different construct.

### 11.2 Performance must be measured given what has been perceived [L2 00:10:48]

*"When we talk about performance of a rational agent, it must be measured **given what has been perceived** by the agent."*

The example [L2 00:10:48]–[00:11:21]: think of the student as an agent. The student receives lectures in AI. *"But if the teacher asks questions that have no relation to AI, then the student might not perform well — even if that student studied a lot."*

You cannot be held to account for what you were never given.

### 11.3 What rationality depends on [L2 00:11:21]

**What is rational at a given time depends on four things:**

```
   1.  THE PERFORMANCE MEASURE            what counts as success

   2.  THE PERCEPTUAL HISTORY             "everything that the agent has
       (percept sequence)                  perceived so far and stored in
                                           its memory — we can call that
                                           EXPERIENCE as well"

   3.  KNOWLEDGE OF THE ENVIRONMENT       "could come from the programmer —
                                           prior knowledge encoded into the
                                           agent — or knowledge LEARNED by
                                           the agent as it navigates"

   4.  THE ACTIONS THE AGENT CAN PERFORM  "we don't expect a person to fly,
                                           because a human being doesn't have
                                           that capability. But a bird has."
```

And the constraint that makes rationality a fair standard [L2 00:13:01]:

> *"The agent's choice of action at a given instant depends on all these four — **but not on anything that has not yet been perceived.**"*

This makes rationality an **ex ante** standard: judged on the information available at the time of choice, not on how things turned out. An agent that looks both ways and crosses is rational even if something unforeseeable kills it. The alternative would require **omniscience**, and §12 records that the rational agent is explicitly not omniscient.

**The consequence worth internalizing:** rationality is not a property of an action, nor of an agent. It is a **four-place relation**. Asking "is this agent rational?" without fixing all four is like asking whether a number is large.

### 11.4 Designing performance measures — and unintended consequences [L2 00:13:33]

> **The AI designer must design performance measures according to what the agent would want to achieve in the environment, rather than according to how the designer thinks the agent should behave.** [L2 00:14:03]

**The vacuum-cleaner failure** [L2 00:14:36]–[00:15:51]. Suppose the designer blindly assigns as the performance measure *the maximum amount of dirt collected*:

```
   The agent moves around, sucks the dirt, SPILLS IT OUT AGAIN,
   collects the dirt, spills it out again, and so on.

   It is maximizing the amount of dirt collected — perfectly.
   The floor is exactly as dirty as when it started.
```

*"But the designer should rather think of having a **clean floor** as the performance measure"* [L2 00:15:17]. The lecture names the general phenomenon **unintended consequences** [L2 00:15:51], and adds: *"this issue is crucial, especially in **reinforcement learning** — and in fact, there's a course that's just all about reinforcement learning"* [L2 00:16:23]. Treat that as a flag: this is a topic the programme expects you to meet again at depth, not a passing remark.

**The structure of the repair:**

```
   MEASURE AN AGENT-SIDE QUANTITY   →  the agent can inflate it without
   ("dirt collected")                   changing anything that matters   ✘

   MEASURE A WORLD STATE            →  the loophole closes; a re-dirtied
   ("the floor is clean")               floor scores no better than one
                                        never cleaned                    ✔
```

**The point that changes how you read the whole example: the agent is not malfunctioning.** It does exactly what it was told, with more diligence than a human would. The **designer** failed.

**[beyond lecture] — why this is structurally hard, not just a careless mistake.** Three independent reasons:

1. **What we want is high-dimensional and mostly implicit.** You want a clean floor. You also want the cat unharmed, the rug not shredded, the pump not run to destruction, no operation at 3 a.m. None of that was in the specification — not through carelessness, but because it is **the unbounded background of things that go without saying**. This is the qualification problem from §2.4, arriving on the objective side.
2. **Optimization pressure finds every gap.** A proxy correlates with what you want *within the range of behavior you had in mind*. An optimizer does not stay in that range; it searches the extremes, which is exactly where proxy and target diverge. The more capable the optimizer, the more reliably it finds the divergence.
3. **The proxy is easier to measure than the thing.** Dirt collected is countable by a sensor already on the machine; floor cleanliness needs perception you may not have. **The easily instrumented metrics are systematically the agent-side ones** — the path of least resistance runs toward the wrong choice.

Read §9's bias row again with this in hand: *"the data already contain the biases"* [L1 01:11:12]. The objective was "predict the historical label accurately," and the system did. Nothing malfunctioned. That is the same failure, at scale, with moral consequences.

### 11.5 Rationality is not perfection [L2 00:16:23]

> **Rationality maximizes the EXPECTED performance, while perfection maximizes ACTUAL performance.**

And perfection *"is not possible. It's only possible in a simplified, idealized environment. But in most cases, in fact, the environment is a challenging environment, and therefore perfection is simply not possible"* [L2 00:16:53].

This gives four distinct notions that are constantly confused:

```
   OMNISCIENCE   knows the ACTUAL outcome of every action     impossible
   PERFECTION    maximizes ACTUAL performance                 impossible outside toy worlds
   RATIONALITY   maximizes EXPECTED performance, given
                 percepts and knowledge                       the achievable standard
   AUTONOMY      behavior determined by the agent's own
                 experience; the ability to ADAPT             §12 — a different axis entirely
```

### 11.6 Information gathering is part of rationality [L2 00:17:28]

> *"We have the notion of **information gathering**, where the agent performs actions **in order to modify future percepts**. And this is part of the rational."*

The example: **exploring the environment**. *"The agent probes the unknown environment — for example, a robot mapping the physical environment. Looking around, moving around, gathering information, so that this information is stored. As a result, you influence your future actions, because you now know more"* [L2 00:17:28]–[00:18:36].

Mapping yields **no immediate goal progress**. It makes every later decision better. An agent that refuses to spend anything on exploration is not being efficient — it is optimizing a horizon shorter than its own lifetime. This returns as the **problem generator** in §14.7, and in force when the course reaches reinforcement learning in Week 14.

### 11.7 The ideal rational agent [L2 00:18:36]

> **For each possible percept sequence, an ideal rational agent should do whatever action is expected to maximize its performance measure, on the basis of the evidence provided by the percept sequence and whatever knowledge the agent has.**

*"So there are two things here: you have your **knowledge** and you have your **percept sequence**."*

**And the behavior of a rational agent can be thought of as a mapping** [L2 00:19:09]:

```
        PERCEPT SEQUENCE  ──►  AGENT PROGRAM  ──►  ACTION
        (perceptual history)   (the processing)     (from a set of
                                                     possible actions)
```

> *"This mapping can be as simple as a **lookup table**, but in most cases it is a **sophisticated algorithm**."* [L2 00:19:40]

**That single sentence is the entire agent ladder in miniature**, and §14.8 unpacks why.

---

## 12. Autonomy [L2 00:20:14]

The lecture deliberately contrasts two definitions:

| **Dictionary definition** [L2 00:20:14] | **AI definition** [L2 00:20:45] |
|---|---|
| *"The ability to make your own decisions without being controlled by anyone else."* | *"The ability to **adapt to its environment** — and this implies **flexibility**."* |

> *"If an agent relies solely on its built-in knowledge and completely disregards the environment, completely disregards the percept sequence, the sensors — **the agent lacks autonomy**."* [L2 00:20:45]

**The clock example** [L2 00:21:46]–[00:22:46]:

```
   An ordinary quartz clock has NO autonomy.
   Why?  "It just relies on internal built-in knowledge — the vibration of
          the quartz crystal, divided down by circuits, to display the time."

   Take it to Europe and cross a time zone:
          "The clock will NOT adjust its time. You'll have to manually adjust it."

   A modern SMART CLOCK with GPS does have autonomy — it senses and adapts.
```

Nobody controls a quartz clock; it decides what to display entirely by itself. By the dictionary definition it is autonomous. By the AI definition it is not, at all.

**The rational agent is not omniscient** [L2 00:23:17]: a good rational agent acts according to its built-in knowledge, *"which is often imperfect knowledge, or partial knowledge — because if knowledge is perfect, then that's **omniscience** already, and there's no rationality anymore."* So the agent's **percept sequence / experience** *"makes up for the imperfect or partial knowledge that the agent might have about the environment"* [L2 00:23:48].

**The operational definition** [L2 00:24:18]:

> **A system is autonomous to the extent that its behavior is determined by its own experience.**

Two things follow. First, **"to the extent that"** — autonomy is a **degree**, never a yes/no. Second, **autonomy is orthogonal to rationality**, not a higher grade of it.

**[beyond lecture]** The sharpest case makes the second point unavoidable: a table-driven agent (§14.1) holding a *complete and correct* table has **perfect performance and zero capacity to adapt, simultaneously**. That combination is only possible if the two are separate axes.

There is also a genuine ordering hidden here, worth drawing out, because "depends on percepts" is *not* the criterion:

```
   NO PERCEPTS         the clock — behavior from built-in mechanism alone
        ↓
   PERCEPTS SELECT     the table-driven agent — percepts choose among
                       responses fixed by the designer. After a million
                       percepts the agent is byte-identical.
        ↓
   PERCEPTS MODIFY     autonomous — experience changes the mapping itself.
                       After a million percepts, it is a different agent.
```

"Determined by its own experience" means the experience **fixed what the agent is**, not merely which pre-written branch fired.

---

## 13. The structure of an intelligent agent [L2 00:24:53]

Two components:

| Component | Definition |
|---|---|
| **Agent program** | *"The **implementation of the mapping from percepts to actions**. That's what we're interested in — making programs that map inputs into proper actions, the rational actions"* [L2 00:24:53] |
| **Agent architecture** | *"The **computing device in which the agent program runs**. It could be your computer, your CPU. It could be a specialized device like the Jetson"* [L2 00:25:23] |

> **The agent consists of the hardware and the software** — the architecture and the agent program [L2 00:25:53].

**[beyond lecture]** This is not a diagram label. If rationality is bounded (§3) and boundedness is set by the machine, then **the architecture is part of the specification of what counts as rational for this agent.** The same program is rational on hardware fast enough to finish deliberating before the deadline and irrational on hardware that is not. Rationality has a hardware dependency.

### 13.1 PEAS [L2 00:25:53]

An agent can be described in terms of four things:

```
   P  —  PERFORMANCE measure
   E  —  ENVIRONMENT
   A  —  ACTUATORS  (effectors)
   S  —  SENSORS
```

*"So this is the PEAS description of an intelligent agent."*

**The lecture's worked example — a medical diagnosis system** [L2 00:26:54]–[00:27:54]:

| | |
|---|---|
| **Performance measure** | **Reduced cost** and a **healthy patient** |
| **Environment** | The **patient**, the **hospital**, the **medical staff** |
| **Actuators** | **Display of questions** (additional questions for the patient), **recommended tests**, **diagnoses**, **treatments** |
| **Sensors** | **Touchscreen** or **voice capture device** allowing entry of symptoms and findings; could be a **keyboard**. The text and symptoms are translated into percepts accepted by the agent program |

Notice that the performance measure has **two terms that conflict** — reduced cost pushes against healthy patient — and that both are stated over the **world** (money spent, patient health), not over agent actions. That is §11.4's principle applied correctly.

📊 **[slide 10/27] — the slide carries five worked examples; the lecturer says *"here are some samples, let's choose one"* and does only the first.** The other four are the most useful thing in Lecture 2 for actually learning to write a PEAS, so here is the full table as it appears on screen:

| Agent Type | Performance Measure | Environment | Actuators | Sensors |
|---|---|---|---|---|
| **Medical diagnosis system** | Healthy patient, reduced costs | Patient, hospital, staff | Display of questions, tests, diagnoses, treatments | Touchscreen/voice entry of symptoms and findings |
| 📊 **Satellite image analysis system** | Correct categorization of objects, terrain | Orbiting satellite, downlink, weather | Display of scene categorization | High-resolution digital camera |
| 📊 **Part-picking robot** | Percentage of parts in correct bins | Conveyor belt with parts; bins | Jointed arm and hand | Camera, tactile and joint-angle sensors |
| 📊 **Refinery controller** | Purity, yield, safety | Refinery, raw materials, operators | Valves, pumps, heaters, stirrers, displays | Temperature, pressure, flow, chemical sensors |
| 📊 **Interactive English tutor** | Student's score on test | Set of students, testing agency | Display of exercises, feedback, speech | Keyboard entry, voice |

**Read down the Performance column — that is where the lesson is.** Four of the five are stated over **world states** (healthy patient, correct categorization, parts in correct bins, purity/yield/safety). One is not: the English tutor is scored on *"student's score on test."* That is an **agent-side proxy** of exactly the kind §11.4 warns about, sitting in the course's own reference table — and it is the same failure as Problem 12's Attempt 1. A tutor maximizing it teaches to the test.

Note also the **refinery controller** is the only one whose measure is explicitly multi-term and conflicting (purity *vs* yield *vs* safety). That is a utility function (§14.6) hiding inside a PEAS table.

**Writing a PEAS is the first thing you do for any agent design.** It forces you to answer, before writing code: what does success mean, what am I embedded in, what can I actually do, and what can I actually see?

---

## 14. Types of agents

The lecture proceeds *"starting with the simplest ones to the most advanced type that involves learning"* [L2 00:01:13].

### 14.1 The table-driven agent [L2 00:27:54]

> **The simplest possible agent.** *"Here we store the percept sequence in memory and use this as an **index onto a table**, which contains the appropriate action for all possible sequences."*

The structure [L2 00:28:24]–[00:29:24]:

📊 **[slide 11/27] — the exact pseudocode on screen**, which the lecturer paraphrases rather than reads:

```
   function TABLE-DRIVEN-AGENT(percept) returns an action
       persistent: percepts, a sequence, initially empty
                   table,   a table of actions, indexed by percept sequences,
                            INITIALLY FULLY SPECIFIED
       append percept to the end of percepts
       action ← LOOKUP(percepts, table)
       return action
```

📊 **`initially fully specified` is the whole objection in two words.** The table is not built up as the agent runs — it must be *complete before the agent starts*, one entry per possible percept sequence. That is why objection 1 (size) and objection 2 (design time) are the same objection, and why objection 4 holds: learning cannot help something that must already be finished.

**What's wrong with it** — the lecture gives four objections [L2 00:29:54]–[00:31:24]:

1. **The table is extremely large.** For chess it would be on the order of **10¹²³ entries** — *"definitely much more than the number of particles in the universe."*
2. **It takes the designer a long time to build**, because *"the programmer, the designer, will have to think of **all** the possible inputs or percepts so that a table can be built."*
3. **There is no autonomy at all.** *"If the environment changes in a way that was not foreseen by the designer, the agent will not be able to act rationally."*
4. **Learning does not rescue it.** *"If we include a learning mechanism, it will also take a very long time to learn the right value for all the table entries, simply because the table is going to be very large."*

**Verdict** [L2 00:31:24]: table-driven agents are only used *"for very simple environments where it's possible to make the table — highly constrained environments where there's very little uncertainty, no uncertainty, everything behaves as expected."*

Objection 4 is the one students most often try to defeat, so state it precisely: **learning relocates the cost from design time to training time without shrinking the table.** Every one of ~10¹²³ entries must still be visited, repeatedly if the environment is noisy. You changed who pays, not how much (§6.6).

### 14.2 The simple reflex agent [L2 00:31:54]

> **Selects an action based on the current percept**, and *"basically this ignores the perceptual history. It's just what the agent sees at the moment."*

The mechanism [L2 00:33:26]: *"You first transform your percept into **state**, and then that state is matched against certain rules"* — **condition-action rules** — *"and from there you choose the rule appropriate to that state."*

```
   The lecture's example:

        IF the car in front is braking  THEN initiate braking
```

📊 **[slide 12/27] — the pseudocode, never read aloud.** It names the two steps the lecture describes only in prose:

```
   function SIMPLE-REFLEX-AGENT(percept) returns an action
       persistent: rules, a set of condition-action rules
       state  ← INTERPRET-INPUT(percept)
       rule   ← RULE-MATCH(state, rules)
       action ← rule.ACTION
       return action
```

Note `INTERPRET-INPUT` — the percept is **not** matched against rules directly; it is first turned into a *state*. That is the lecture's *"you first transform your percept into state"* [L2 00:33:26], and it is the seam where the next rung is inserted.

📊 **[slide 12/27] — the architecture diagram.** Learn this shape: the next three rungs are all *this diagram with boxes added*.

```
   ┌── Agent ──────────────────────────────────┐  ┌─────────────┐
   │                     ┌───────────┐         │◄─┤             │
   │                     │  Sensors  │◄────────┼──┤             │
   │                     └─────┬─────┘         │  │             │
   │                           ▼               │  │             │
   │              ┌────────────────────────┐   │  │             │
   │              │ What the world         │   │  │ ENVIRONMENT │
   │              │ is like now            │   │  │             │
   │              └────────────┬───────────┘   │  │             │
   │  ┌───────────────────┐    ▼               │  │             │
   │  │ Condition-action  │──► What action     │  │             │
   │  │ rules             │    I should do now │  │             │
   │  └───────────────────┘         │          │  │             │
   │                     ┌──────────▼┐         │  │             │
   │                     │ Actuators ├─────────┼─►│             │
   │                     └───────────┘         │  └─────────────┘
   └───────────────────────────────────────────┘
```

> *"The simple reflex agent looks for the rule whose condition matches the current situation as defined by the percept, and then performs the action associated with that rule."* [L2 00:33:56]

**Assessment** [L2 00:34:26]: *"the simple reflex agent is **very efficient**. However, its applicability is **very limited**, since it only uses the current percept."*

**The lecture's analogy:** *"Just like the **makahiya** plant — you touch the makahiya, and the leaves fold up."* Touch, fold. Every time. No memory, no context.

### 14.3 The model-based reflex agent [L2 00:34:26]

> *"It's a reflex agent, but this time it has an **internal state** that keeps track of the part of the world that it cannot see now. In other words, it has stored in memory the previous percepts. So it has perceptual history and uses that to make decisions."*

**The criterion for when you need it** — the most useful single sentence in Lecture 2 [L2 00:35:33]:

> **It maintains internal state information to distinguish between world states that generate the same perceptual input but require different actions.**

This is a **test you can apply**. Find two histories that look identical to the sensors right now but demand different responses; if they exist, a simple reflex agent is impossible, and you have *proved* it rather than guessed it.

📊 **[slide 14/27] — the pseudocode, and it is worth more than the prose.** On screen it sits *beside* the diagram, not after it:

```
   function MODEL-BASED-REFLEX-AGENT(percept) returns an action
       persistent: state,            the agent's current conception of the world state
                   transition_model, how the next state depends on current state and action
                   sensor_model,     how the world state is reflected in percepts
                   rules,            a set of condition-action rules
                   action,           the most recent action, INITIALLY NONE
       state  ← UPDATE-STATE(state, action, percept, transition_model, sensor_model)
       rule   ← RULE-MATCH(state, rules)
       action ← rule.ACTION
       return action
```

Read the arguments of `UPDATE-STATE`: **state, action, percept, transition_model, sensor_model**. The agent's own *previous action* is an input to knowing where it now is — which is why `action` has to be a persistent variable, and why "initially none" is a real base case rather than boilerplate. Compare the simple reflex agent above: same last three lines, entirely different first line.

📊 **[slides 13–14/27] — the diagram** (this agent gets two slides; the second adds the pseudocode). **Two boxes are added and one arrow becomes a loop:**

```
   ┌── Agent ──────────────────────────────────┐  ┌─────────────┐
   │   ┌─────────┐ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐       │◄─┤             │
   │   │  State  │◄                    ¦       │  │             │
   │   └────┬────┘ ¦  ┌───────────┐    ¦       │  │             │
   │        ▼         │  Sensors  │◄───┼───────┼──┤             │
   │  ┌──────────────┐└─────┬─────┘    ¦       │  │             │
   │  │ How the      │      ▼          ¦       │  │             │
   │  │ world evolves│─►┌────────────────────┐ │  │ ENVIRONMENT │
   │  └──────────────┘  │ What the world     │ │  │             │
   │  ┌──────────────┐  │ is like now        │ │  │             │
   │  │ What my      │─►└─────────┬──────────┘ │  │             │
   │  │ actions do   │            ▼            │  │             │
   │  └──────────────┘  ┌────────────────────┐ │  │             │
   │  ┌───────────────┐ │ What action        │ │  │             │
   │  │ Condition-    │►│ I should do now    │ │  │             │
   │  │ action rules  │ └─────────┬──────────┘ │  │             │
   │  └───────────────┘ ┌─────────▼─┐          │  │             │
   │                    │ Actuators ├──────────┼─►│             │
   │                    └───────────┘          │  └─────────────┘
   └───────────────────────────────────────────┘
        NEW vs simple reflex:  State · How the world evolves · What my actions do
        (the dashed line is the state feeding back into the next update)
```

**Two types of information are needed** [L2 00:36:06]–[00:36:38]:

```
   1.  How the world changes INDEPENDENTLY of the agent
       — "how the world evolves"; must be built-in information

   2.  How the AGENT'S OWN ACTIONS affect the world
       — "what my actions do"
```

*"So these are the three inputs that will be used by the agent together with what's being sensed — the percept. And using condition-action rules, since it's a reflex agent, the appropriate action is selected"* [L2 00:36:38].

The knowledge is encoded in two models [L2 00:37:13]–[00:37:55]:

| Model | What it captures |
|---|---|
| **Transition model of the world** | How the world evolves, both on its own and under the agent's actions |
| **Sensor model** | *"Describes how the state of the world is reflected in the agent's percepts."* Needed *"because the sensors capture only a limited part of the environment"* |

**Keep these apart.** *Transition = how the world moves. Sensor = how the world looks to me.* A self-driving car's transition model says the truck seen two seconds ago has advanced ~44 m. Its sensor model says that empty LIDAR returns behind a guardrail mean **occlusion, not empty road**. Different kinds of ignorance, different repairs.

### 14.4 The goal-based agent [L2 00:38:25]

> *"This time it's no longer a reflex agent. It is a **goal-based agent** — which means that the agent now **incorporates goal information** in deciding what to do. Therefore, it **considers the future**."*

The difference from the previous type [L2 00:39:04]:

> *"You have this: **What will it be like if I do action A?** So it performs **deliberation**. It considers possible actions. If I do this action, this is how the world will evolve. If I do this other action, the world will change in this manner — it will transition to another state."*

And because the goal must actually be reached [L2 00:39:38]:

> *"We'll have to look at **long sequences of action**. Not just what I need to do right now, but what **sequence** of actions will I do so that I reach my goal. And this involves **planning**."*

> **Planning is concerned with finding the right action sequences that will lead to the goal.** It is *"fundamental in the area of robotics"*, and is *"structured as a **search** for these sequences, given a set of atomic operations"* [L2 00:39:38]–[00:40:10].

📊 **[slide 15/27] — the diagram. `Condition-action rules` is *replaced*, not extended:**

```
   ┌── Agent ──────────────────────────────────┐  ┌─────────────┐
   │   ┌─────────┐   ┌───────────┐             │◄─┤             │
   │   │  State  │   │  Sensors  │◄────────────┼──┤             │
   │   └────┬────┘   └─────┬─────┘             │  │             │
   │  ┌─────▼────────┐     ▼                   │  │             │
   │  │ How the      │─►┌────────────────────┐ │  │ ENVIRONMENT │
   │  │ world evolves│  │ What the world     │ │  │             │
   │  └──────────────┘  │ is like now        │ │  │             │
   │  ┌──────────────┐  └─────────┬──────────┘ │  │             │
   │  │ What my      │─►┌─────────▼──────────┐ │  │             │
   │  │ actions do   │  │ What it will be    │ │  │             │
   │  └──────────────┘  │ like if I do A     │ │  │             │
   │      ┌───────┐     └─────────┬──────────┘ │  │             │
   │      │ GOALS │────►┌─────────▼──────────┐ │  │             │
   │      └───────┘     │ What action        │ │  │             │
   │                    │ I should do now    │ │  │             │
   │                    └─────────┬──────────┘ │  │             │
   │                    ┌─────────▼─┐          │  │             │
   │                    │ Actuators ├──────────┼─►│             │
   │                    └───────────┘          │  └─────────────┘
   └───────────────────────────────────────────┘
        NEW:  "What it will be like if I do action A"  ·  GOALS
        GONE: condition-action rules  ← this is the rung's whole content
```

**That swap is the entire difference between rung 2 and rung 3.** The reflex agent's rules are *deleted* and replaced by a projection box plus a goal. Nothing is added to make it smarter — something is removed and computed instead (§6.6).

### 14.5 Reflex vs. goal-based: the trade-off [L2 00:40:44]

The lecture makes the comparison explicitly, and it is the most instructive paragraph in Lecture 2:

> *"The reflex agent **also achieves the goal** — even just like the goal-based agent. But the reflex agent achieves the goal because **the designer has pre-computed the correct action for the different cases**. The designer has already put that goal into the agent program. Because of that, it's **very efficient**. But it suffers from **lack of flexibility**, because the designer in many cases cannot possibly think of all the different scenarios that the agent will encounter in that complex environment."*
>
> *"The goal-based agent considers what will happen if certain actions are performed, and selects the one that will make it achieve its goal. It's **not going to be that efficient**, but it is **more flexible**. It is not that efficient because it will have to do **search**."* [L2 00:40:44]–[00:41:45]

| | Reflex agent | Goal-based agent |
|---|---|---|
| How the goal is achieved | Designer pre-computed the action per case | Agent projects consequences and selects |
| Where the goal lives | **In the designer's head, at design time**, compiled into rules | **In the agent, as data**, at run time |
| Efficiency | **Very efficient** — deliberation was paid offline | **Less efficient** — must search |
| Flexibility | **Poor** | **Good** |

Two consequences of the goal living in the designer's head: an unforeseen situation has **no matching rule**, and **if the goal changes, every rule must be re-derived**, because no rule refers to the goal. A goal-based agent takes the goal as input — which is why a taxi can accept a destination it has never seen.

**The lecturer draws this back to Lecture 1 himself** [L2 00:42:15]–[00:43:17], and it is the hinge between the two lectures:

> *"We learned in our previous lecture that **search and knowledge are like opposites**. You need more search when you have less knowledge. And if you have more knowledge, then you need less search. **And similarly here.** … The goal-based agent will do planning. But here \[the reflex agent], the designer already incorporated everything — the goal is already taken into account by the designer, **so that there's no more search.**"*

So the reflex/goal-based trade-off **is Laws 4 and 5** (§6.4–§6.5), operating inside one agent's architecture rather than across two different systems. The designer's pre-computation *is* the knowledge; the goal-based agent, lacking it, *"will have to do search."* Same axis, same substitution, one rung apart — and the lecture says so in as many words. §14.8 develops the consequence.

### 14.6 The utility-based agent [L2 00:44:29]

**Why a goal is not enough — the lecture's own setup** [L2 00:43:17]–[00:44:29]. The bridge from §14.4 is explicit:

> *"In the previous slide we talked about the goal-based agent, which incorporates goal information in deciding what to do. Now we have to consider the fact that **not all goals are the same.** For example, you want to go to Makati from Quezon City, and you're going to ride an autonomous vehicle, a taxi. The goal that we have is simply to go to Makati — but then not all goals are the same. The agent might travel very fast and therefore **make the trip unsafe.** So we are talking about **safety versus speed**, or that **the taxi fare might be high or low.**"*

Note there are **three** competing objectives in the lecturer's own example, not two — arrival time, safety, and **fare**. A goal predicate (*"am I in Makati?"*) is satisfied identically by a slow cheap safe trip and a fast expensive dangerous one. It cannot see the difference, which is precisely the deficiency the next rung repairs.

📊 **[slide 17/27] adds a definition the lecturer never states**, and it is the cleanest bridge from goals to utility:

> 📊 *"Not all goals are the same. **Goals may be viewed as world states which make the agent happy** (e.g. taxi fare is low)."*

That reframing is what makes the next sentence non-arbitrary: if a goal just *is* a happy world state, then "how happy" is already a meaningful question, and utility is its answer.

> *"The objective of a utility-based agent is to maximize the so-called **happiness** of the agent. So we need to measure this degree of happiness, and that is captured by the **utility**. This is a concept that we have in economics. **It is a function that maps a state onto a real number.**"*

```
        U  :  State  ──►  ℝ
```

**The lecturer returns to the same example after defining utility, to name what resolves the conflict** [L2 00:45:04]:

> *"There are many goals, and some of these goals are **conflicting**. You want to reach Makati in the fastest way — this implies that the autonomous vehicle will have to travel at great speed. But if you travel at great speed, then you **compromise safety**. So these two goals may be conflicting. And it is the **utility function that provides the trade-off** between these two goals."*

> *"For the model-based utility agent, we choose the **action sequence that will maximize the utility**."* [L2 00:45:37]

📊 **[slide 17/27] — the diagram. One box is inserted into the goal-based chain:**

```
   ...  ┌────────────────────┐
        │ What it will be    │
        │ like if I do A     │
        └─────────┬──────────┘
   ┌─────────┐    ▼
   │ UTILITY │─►┌────────────────────┐
   └─────────┘  │ How happy I will   │   ◄── the inserted box
                │ be in such a state │
                └─────────┬──────────┘
                ┌─────────▼──────────┐
                │ What action        │
                │ I should do now    │
                └────────────────────┘
```

`GOALS` is replaced by `UTILITY`, and *"what will it be like"* now feeds *"how happy will I be in such a state"* before the action is chosen. 📊 The slide closes with the decision rule verbatim: **"Choose the action sequence that gives maximum utility."**

A goal is a **binary predicate** — reached or not — so it cannot arbitrate between objectives that oppose. Utility gives you **degrees**, and degrees can be traded.

**[beyond lecture] — two things worth knowing.** First, **goals are a special case of utility**: `U = 1_G`, the indicator function of the goal set. The ladder is not adding a new faculty here; it is removing a restriction. (Why keep the goal rung at all, then? Because a goal predicate makes search a **satisfaction** problem — stop at the first success — while utility makes it **optimization**, with no early stopping. Expressiveness and cost are different axes.)

Second, **this rung was implied back in Lecture 1**. Defining rationality as *maximizing expected performance* (§2.4) presupposes a real-valued measure over states, and `U : S → ℝ` is that object. The reason it is real-valued rather than something richer is the von Neumann–Morgenstern theorem: if preferences over uncertain outcomes satisfy four modest axioms — completeness, transitivity, continuity, independence — they are representable as the expectation of a real-valued utility, unique up to positive affine transformation. Violate the axioms and you can be turned into a money pump. That is why "maximize expected utility" is not one decision rule among many.

### 14.7 The learning agent [L2 00:45:37]

> *"The learning agent is **any type of agent** — the previous types that we have learned, the model-based agent, the goal-based agent, utility-based agent, etc. — **but this time, this agent incorporates learning**."*

**This is the sentence to hold onto: the learning agent is not a sixth rung above utility-based. It is orthogonal to the ladder.** You can have a learning reflex agent or a learning utility-based agent.

**Four components** [L2 00:46:14]–[00:47:29]:

```
                      ┌──────────────────────────────────────────────┐
                      │  CRITIC                                      │
                      │  "measures how the agent is doing and         │
                      │   determines how the performance element      │
                      │   should be modified to do better in the      │
                      │   future, through the learning element"       │
                      └──────────────────┬───────────────────────────┘
                                         │ feedback
                                         ▼
   ┌─────────────────────┐  improves   ┌─────────────────────────────┐
   │  LEARNING ELEMENT   │────────────►│  PERFORMANCE ELEMENT        │───► action
   │  "makes improvements│             │  "responsible for action    │
   │   to the knowledge  │             │   selection"                │
   │   components"       │             │  — this IS one of §14.1–14.6│
   └──────────▲──────────┘             └─────────────────────────────┘
              │ suggests
   ┌──────────┴──────────────────────────────────────────┐
   │  PROBLEM GENERATOR                                   │
   │  "suggests EXPLORATORY ACTIONS that lead to new and  │
   │   more informative experiences"                      │
   └──────────────────────────────────────────────────────┘
```

*"So the learning element improves or changes the performance element, so that overall the learning agent is able to achieve its goal — it gets better and better"* [L2 00:46:58].

The **problem generator** exists because of §11.6: an agent that only exploits will never discover that a better option exists. *"It will instruct the agent to perform some actions which are necessary for getting more information about the environment, so that in the future the agent will perform better"* [L2 00:47:29].

### 14.8 The ladder, seen whole

**[beyond lecture — but it is the unifying idea, and it makes the list a derivation rather than a list]**

Return to [L2 00:19:09]: the agent's behavior is *a mapping from percept sequence to action*, and it *"can be as simple as a lookup table, but in most cases it is a sophisticated algorithm."* Underneath that sentence are two different objects:

```
   THE AGENT FUNCTION        f : P* → A
      a mathematical object. Maps every possible percept SEQUENCE to an
      action. Usually INFINITE. Specifies WHAT the agent does.

   THE AGENT PROGRAM
      a FINITE artifact running on the architecture that COMPUTES f.
      Specifies HOW.
```

**Every agent type is a different strategy for representing an infinite function in a finite program.** The question each rung answers is: *what structure does this environment have that lets me compress f?*

| Rung | The compression assumption | What it stores |
|---|---|---|
| **Table-driven** | **None.** Store `f` extensionally, as a literal list | ~\|P*\| entries — unaffordable |
| **Simple reflex** | `f(p₁…pₙ) = g(pₙ)` — `f` factors through the **current percept alone** | `g : P → A`, the condition-action rules |
| **Model-based reflex** | `sₙ = u(sₙ₋₁, pₙ)` and `f(p₁…pₙ) = g(sₙ)` — factors through a **bounded internal state** | `S`, `u`, `g` — this is exactly a finite state machine |
| **Goal-based** | Don't store `g` at all — **compute it at run time** by searching a model | transition model `T`, goal predicate `G` |
| **Utility-based** | Same, but optimize rather than satisfy | `T`, utility `U : S → ℝ` |

**Two payoffs from seeing it this way.**

**First — rungs 0–2 *store* the policy; rungs 3–4 *compute* it.** That is Laws 4 and 5 (§6.6) appearing **inside the architecture of a single agent**. Space collapses to `|T| + |G|`; time explodes into search. **This one is not my inference — the lecturer makes it explicitly** at [L2 00:42:15]: *"search and knowledge are like opposites… and similarly here,"* the reflex agent needing no search precisely because the designer supplied the knowledge (§14.5).

**Second — it explains why learning is orthogonal.** Each rung is defined by **which objects it uses** (`g`, or `S, u, g`, or `T, G`, or `T, U`). Learning is a claim about **where those objects come from** — authored by a programmer, or acquired from experience. Provenance is independent of type. That is why *"the learning agent is any type of agent"* [L2 00:45:37] is a structural fact, not a definitional quirk.

**And one more, which closes the loop with Lecture 1.** The table-driven agent is the **limiting case of paying entirely in knowledge**: zero run-time search, O(1) per decision — the theoretical maximum of Law 5. And it is unaffordable. Exhaustive search is unaffordable in time; the complete table is unaffordable in space. **Law 5 is not a direction to travel as far as possible — it is an axis with unaffordable ends on both sides.** Every real agent lives strictly between them, and Deep Blue's design (openings and endgames stored, midgame searched) is that choice made *per region of one problem*.

---

## 15. Types of environment [L2 00:47:29]

> *"As we have learned, the environment is the one that provides percepts to the agent. The agent in turn does actions on the environment and changes the state of the environment."*

> ✅ **This section was recovered on 2026-08-20.** The original transcript lost [00:48:03]–[00:53:10] to a decoder loop, and an earlier draft of these notes reconstructed the axis definitions from how they were later *used*. The audio has since been re-transcribed and the definitions below are now **the lecturer's own words**. Two things the reconstruction had wrong: he defines observability in terms of *relevance to the choice of action*, not raw completeness, and he gives the single-/multi-agent axis a full treatment (cooperative vs. adversarial) rather than the passing mention it appeared to get. For the record, no seventh axis (*known vs. unknown*) was taught.

### 15.1 The axes

| Axis | Definition | The lecture's examples |
|---|---|---|
| **Fully / partially observable** | **Fully observable** if *"the agent's sensors give or provide access to the **complete state** of the environment **at each point in time**"* — equivalently, *"the sensors detect **all aspects of the environment that are relevant to the choice of action**, and **relevance depends on the performance measure**"* [L2 00:48:37]–[00:49:12]. **Partially observable** if part of the state *"is not measured or measurable by the sensors"* **or** *"the sensors are **noisy and inaccurate**"* [L2 00:49:42] | Chess: fully. **Poker: partially** — *"you don't observe the hand of the other people"* |
| **Deterministic / stochastic** | *"An environment is **deterministic** if its **next state is completely determined by the current state and the actions selected by the agent**"* [L2 00:52:02]. **Why it matters, in the lecture's own terms:** deterministic environments *"are easier, because you can actually model the next state — not only the next state, but the next states, many states. And with that it's easier for you to act, because **there's less search, maybe no search at all**… On the other hand, if the environment is non-deterministic or stochastic, then **you'll have to do a lot of search**"* [L2 00:52:36] | **Chess is deterministic** — *"you know all the rules of chess, and what you see is what your adversary sees. The next possible moves are all determined"* [L2 00:53:40] |
| **Episodic / non-episodic (sequential)** | Episodic if *"the agent's experience is divided into **episodes**"*, an episode being *"an agent perceiving and acting"* — *"like a game over for a game, then you start again"* — and *"the quality of action depends on just the episode itself, since subsequent episodes do not depend on actions in previous episodes"* [L2 00:55:47]. **The payoff: *"episodic environments are much easier to deal with, because planning is limited to one episode"*** [L2 00:56:21] | **Chess is non-episodic**; the **chest X-ray analyzer is episodic** — *"the previous patient's X-ray result will not have any bearing on the current patient"* [L2 00:56:55] |
| **Dynamic / static / semi-dynamic** | *"A **dynamic** environment changes while the agent is deliberating."* **Semi-dynamic**: *"if the environment does not change with the passage of time, but the agent's performance does"* [L2 00:57:26]–[00:58:27] | **Chess: static.** **Chess with a clock: semi-dynamic** — *"you could lose due to time default."* **Taxi driving: definitely dynamic** |
| **Discrete / continuous** | *"An environment is **discrete** when there is a limited number of distinct, clearly defined percepts and actions."* Continuous means percepts and actions can be **continuous-valued** [L2 00:59:00] | Chess: discrete. Taxi steering and speed: continuous |
| **Single- / multi-agent** | *"In a **multi-agent** environment, the agents will treat each other **either as agents or just as objects**"* [L2 00:50:21]. Treated as an object, the other party is scenery the agent *"doesn't care about."* Treated as an agent, the environment is either **cooperative** (*"the agent can cooperate with the other agents"*) or **adversarial** [L2 00:50:53] | *"For example, game playing, chess — there are two agents, and the other agent is adversarial"* [L2 00:51:27]. The lecture also points to a summary table and asks you to *"analyze this on your own"* [L2 01:01:48] |

**Two things from this passage worth pulling out of the table.**

**First — what "adversarial" actually means** [L2 00:51:27]. The definition is stronger than "competing," and it is the one Week 3's adversarial search assumes:

> *"When you say adversarial, you mean that type of agent that **tries to reduce your well-being**, that tries to destroy you, that **tries its best so that you don't achieve your goal** — and so that it achieves its goal, which is winning the game."*

Read it precisely: the adversary is not indifferent to you and not merely pursuing its own aims. It is **optimizing against your objective**. That is what licenses minimax — you may assume the opponent picks the worst move *for you*, because by definition that is what it is trying to do. Against a merely self-interested agent that assumption is wrong and needlessly pessimistic.

**Second — observability decides whether you need memory at all** [L2 00:49:42]:

> *"If the agent has complete access to the state of the environment at each point in time, the agent **need not maintain an internal state** to keep track of the world."*

This is the missing justification for the whole §14.3 rung, stated by the lecture rather than inferred. Full observability makes the model-based reflex agent's internal state **redundant** — the percept already is the state. Partial observability makes it **mandatory**. So the axis at §15.1 and the agent type at §14.3 are not two separate topics: *the environment property is the reason the agent type exists.* And note the lecture's own definition of "fully observable" is relative to the **performance measure** — *"the sensors detect all aspects that are relevant to the choice of action, and relevance depends on the performance measure."* Change what you are scoring and a sufficient sensor suite can become insufficient without the world changing at all.

**One caveat the lecture attaches to "episodic"** [L2 00:56:21]. The independence claim — later episodes do not depend on earlier ones — is stated *for the agent, not for the world*: *"this is true for agents that are **not allowed to learn** from the previous episodes. But for **learning agents**, it's better that you learn from previous episodes."*

So "episodic" describes how the **performance measure** decomposes, not a ban on carrying information across the boundary. The chest X-ray analyzer is scored one patient at a time — that is what makes it episodic — and it should still be trained on every previous patient it has ever seen. Episodic buys you a shorter **planning** horizon, never a shorter **learning** horizon.

**On dynamic environments** [L2 00:57:57], the lecture gives the practical consequence:

> *"To deal with this, it is necessary to **keep sensing while deliberating**. Like, you're crossing the street — you need to be sensing even if you're thinking of your exam. Otherwise you get into an accident. While you are driving, you need to be continually sensing what's in front of you while you're thinking."*

**[beyond lecture] — why each axis matters.** Each one is a statement about what mathematics your problem requires:

| Axis | What changes when you cross it |
|---|---|
| Observability | Fully: state = percept. Partially: you must maintain a **belief** over states. A cliff, not a step — §15.2 |
| Determinism | Deterministic: a plan is a **sequence**. Stochastic: a plan must be a **policy** `π : S → A` — §15.3 |
| Episodic | Episodic: each decision evaluated alone. Sequential: you inherit the **credit-assignment problem** — which of a hundred earlier actions caused this outcome? |
| Dynamic | Static: deliberate freely. Dynamic: deliberation time enters the objective, and **anytime algorithms** (§7) stop being optional |
| Discrete | Discrete: enumerate. Continuous: you cannot enumerate — **function approximation** |
| Multi-agent | Single: optimization, there is a best action. Multi: **game theory**, and the best action depends on what others do |

### 15.2 Partial observability is the master property [L2 00:53:10]

The lecture's own passage carries the whole argument. It opens by naming the combination [L2 00:53:10] — *"an environment may be **deterministic, but then it's partially observable**"* — and then:

> *"The sensors of your agent cannot fully observe the complete state of the environment. So you might as well treat that environment as a **non-deterministic or stochastic** environment… But in reality, it is a deterministic environment. It's just that your sensors are not capable of sensing all the relevant parts of the state. So it's better to think of an environment as deterministic or stochastic **from the point of view of the agent**."*

And the worked case [L2 00:54:41]–[00:55:13]:

> *"In the case of **poker**, it's also deterministic — the rules of poker are deterministic. But it's better to treat that game as **non-deterministic**. Why? Because **you don't observe the hand of the other people** in poker… **It's non-deterministic because it's partially observable.**"*

```
   PARTIAL OBSERVABILITY
        │
        ├──► manufactures apparent STOCHASTICITY
        │    the world is determined; YOUR PREDICTION is not, because you
        │    are conditioning on less than the state
        │
        ├──► forces INTERNAL STATE  (§14.3)
        │    the only way to act on what you cannot see is to remember
        │
        └──► forces a BELIEF over states rather than a state
```

**Observability is upstream of determinism.** The principle — assess properties **from the agent's point of view** — is not a simplifying convention. It is correct, because the agent can only act on its information state.

**[beyond lecture]** The cost of crossing this line is not incremental. Under full observability, a sequential decision problem is a Markov decision process and optimal policies are tractable to compute. Under partial observability the agent acts on a *distribution* over states — the belief state, which is the sufficient statistic replacing the raw history — and the resulting problem (a POMDP) is dramatically harder: finite-horizon POMDP planning is PSPACE-complete, and the infinite-horizon version is undecidable in general. When you classify an environment as partially observable, you are reporting that the tractable machinery does not apply.

### 15.3 Determinism decides whether a plan is a sequence or a policy

**[beyond lecture — and it exposes a limitation in how §14.4 describes planning]**

The lecture says planning means *"looking for the right action sequences"* [L2 00:39:38]. In a deterministic, fully observable environment that is exactly right — you know where each action lands you, so you can commit to `a₁ a₂ … a_k` and execute blind. That is an **open-loop plan**.

In a stochastic environment it fails, and not marginally:

```
   DETERMINISTIC     plan = SEQUENCE     a₁, a₂, …, a_k
                     open loop — commit now, execute blind

   STOCHASTIC        plan = POLICY       π : S → A
                     closed loop — specify what to do in every state you
                     MIGHT reach. The sequence is not even well-typed.
```

A taxi that plans "turn left, then accelerate" has said nothing about what to do if a truck is there after the turn. So Lecture 2's action-sequence language is right for its chess-flavoured examples and quietly inadequate for its own taxi example. This is the standard simplification made when planning is introduced — Week 3's search algorithms assume it — but you should know the assumption is there, because Weeks 5 and 14 remove it.

### 15.3b 📊 The classification table — [slide 26/27]

**This is the table the lecturer points at and says *"just go through this — analyze this on your own"* [L2 01:01:48].** It was never read aloud, so no transcript contains it. It is also the single most exam-shaped object in Lecture 2: ten task environments classified on six axes.

| Task Environment | Observable | Agents | Deterministic | Episodic | Static | Discrete |
|---|---|---|---|---|---|---|
| Crossword puzzle | Fully | Single | Deterministic | Sequential | Static | Discrete |
| Chess with a clock | Fully | Multi | Deterministic | Sequential | **Semi** | Discrete |
| Poker | Partially | Multi | Stochastic | Sequential | Static | Discrete |
| Backgammon | Fully | Multi | **Stochastic** | Sequential | Static | Discrete |
| Taxi driving | Partially | Multi | Stochastic | Sequential | Dynamic | Continuous |
| Medical diagnosis | Partially | Single | Stochastic | Sequential | Dynamic | Continuous |
| Image analysis | Fully | Single | Deterministic | **Episodic** | Semi | Continuous |
| Part-picking robot | Partially | Single | Stochastic | **Episodic** | Dynamic | Continuous |
| Refinery controller | Partially | Single | Stochastic | Sequential | Dynamic | Continuous |
| English tutor | Partially | Multi | Stochastic | Sequential | Dynamic | Discrete |

**Do the analysis he assigned — here are the four rows that actually teach something:**

**Backgammon is *Fully observable* yet *Stochastic*.** Every other stochastic row here is stochastic *because* it is partially observable — that is §15.2's whole argument. Backgammon breaks the pattern: you see the entire board, and the dice are still random. **This is the counterexample proving stochasticity is not merely disguised partial observability.** Poker sits directly above it as the contrast: *Partially* observable, and stochastic for that reason.

**Only two rows are Episodic** — image analysis and the part-picking robot. Both are perception-then-act with no carryover, which is why §15.1's *"planning is limited to one episode"* payoff applies to them and to nothing else here. Note medical diagnosis is **Sequential**, not episodic — unlike the chest X-ray analyzer of [L2 00:56:55], because diagnosis involves a treatment history.

**Chess with a clock is the lone Semi-dynamic** entry, exactly as [L2 00:59:00] explains — the board does not change while you think, but your clock does. Image analysis is also Semi.

**Read the Continuous column against the Discrete one.** Everything physical (taxi, robot, refinery, medical) is Continuous; everything game-like or symbolic (crossword, chess, poker, backgammon, tutor) is Discrete. Continuous is what forces function approximation — and it correlates almost perfectly with *"is there a body in this problem."*

**The hardest row is taxi driving**: Partially observable, Multi-agent, Stochastic, Sequential, Dynamic, Continuous — the worst value on all six axes simultaneously. That is why it is the textbook's running example, and why Week 3's search algorithms cannot touch it.

---

### 15.4 Environment classes [L2 00:59:30]

> *"When we design an agent, we should design it for a whole set of different environments called the **environment class** — not just a particular environment."*

The illustration [L2 01:00:01]:

> *"A chess program could be designed to take advantage of the **specific weakness of an opponent**. And it may be very good at beating that opponent, but it **may not be suitable for a tournament**."*

**And the case study** [L2 01:00:34]:

> *"This was the complaint of Kasparov when he lost to Deep Blue. He said IBM actually took advantage of my weaknesses — looking at the databases of his previous games and exploiting these weaknesses. And Deep Blue may not be suitable for a general tournament. **So maybe he's right. He is right. But then the point is, he lost to Deep Blue.**"*

The design rule [L2 01:01:04]: *"When we are designing an AI algorithm, make sure that we design it for different environments in the environment class — not just for this particular set of inputs. Because when you change the environment a little, your AI program will not perform as well."*

**Both halves of the lecturer's verdict are correct, and here is why they are compatible.** Kasparov's complaint is about **generalization**: optimizing against one opponent is optimizing against a degenerate distribution of environments, all the mass on a single point, and high performance there guarantees nothing over the class. The result nonetheless stands, because **rationality is relative to the performance measure and the environment actually inhabited** (§11.3) — the measure that day was "win this match against this opponent."

So the correct conclusion is narrower than the popular one: what was shown is *"Deep Blue beat Kasparov"*, not *"machines play better chess than humans."* **The gap between what an evaluation licenses and what people conclude from it is a permanent hazard** — and it is the same pattern that produced the first AI winter (§4.3, cause 1).

---

## 16. Where the two lectures meet

The chain, end to end:

```
    1  AI = understanding intelligence + constructing intelligent systems   [L1 00:00:46]
    2  Four definitions: human|rational × thought|behavior                  [L1 00:01:53]
    3  Adopt ACTING RATIONALLY — inference is one route among many, we
       don't reason logically all the time, and often no provably correct
       action exists                                                        [L1 00:17:04]
    4  ⟹ committed to a performance measure as a mathematical object       §2.4 → §14.6
    5  But perfect rationality is unattainable — the demands are too high
       (and, deeper, it is incoherent for an agent embedded in time)        [L1 00:18:14], §3.1
    6  ⟹ BOUNDED RATIONALITY (Simon 1957) ⟹ SATISFICING                    [L1 00:18:51]
    7  ⟹ knowledge and search substitute for each other (Laws 4, 5)        [L1 00:59:23]
    8  An agent perceives via sensors and acts via effectors, running a
       program on an architecture that fixes its computational budget       [L2 00:01:53], [L2 00:24:53]
    9  Its behavior is a MAPPING from percept sequence to action —
       "as simple as a lookup table, or a sophisticated algorithm"          [L2 00:19:09]
   10  That mapping is infinite; a program is finite ⟹ it must be
       COMPRESSED. The agent ladder is the sequence of compression
       assumptions, and rungs 0–2 STORE while rungs 3–4 COMPUTE             §14.8
   11  Learning is orthogonal — it concerns the PROVENANCE of the
       objects each rung uses                                               [L2 00:45:37]
   12  Environment properties determine which compressions are available,
       and each axis names a branch of the required mathematics             §15
   13  The performance measure of line 4 must be written by a human,
       and cannot be written completely correctly                           §11.4
```

Lines 4, 9, and 10 are the ones usually dropped, and they are the load-bearing ones: without 4, utility looks arbitrary; without 9 and 10, the agent ladder is a list to memorize instead of a derivation.

### Where these two weeks sit in the course

From the syllabus (p.1): **Exam 1 is on Oct 1 and covers Weeks 1–7.** These two lectures are the first two of those seven, and they are the *framing* ones — Weeks 3–7 (search, CSPs, probabilistic reasoning, supervised learning) are all instances of machinery this pair sets up. Concretely: the agent ladder (§14.8) is what search and learning are *rungs of*, and the environment axes (§15) are what decide which of Weeks 3–7 applies to a given problem. The exam weighting is 20% for exams against 40% for programming assignments, so the payoff from these two lectures is mostly in *being able to use* the vocabulary on assignments, not recite it. Programming is in **Python**; Assignment 1 follows Week 3 and is due Sept 9.

The syllabus outcomes these two weeks discharge: *"describe the nature of AI and its relationship with other fields of human endeavor"*, *"explain the notion of intelligent agents and how autonomous systems can be built from them"*, and *"demonstrate understanding of key ethical issues… their use in warfare, manipulation of public opinion, machine bias and risks, and responsibilities related to AI software deployment"* — that last one is §9, and it maps onto the risk rows one for one.

### What Week 3 needs from this

The syllabus puts **Problem Solving by Search / Adversarial Search** next (p.1):

- **Search** is rung 3 of the ladder (§14.8) — computing the policy at run time from a model instead of storing it.
- **Alpha-beta, B\*, singular extension** [L1 00:41:24] are Law 1 (§6.1) in practice: opportunistic strategies that skip the parts of the tree not worth examining.
- The **10¹²³ figure** (§5.1) is why heuristics are mandatory, not optional.
- **Adversarial** search is the multi-agent axis (§15.1), where the best action depends on another agent's choice.
- Week 3 will silently assume the environment is **fully observable, deterministic, static, and discrete** — exactly the four assumptions that make an open-loop *sequence* a well-formed plan (§15.3). Watch for where that is stated and where it is merely assumed; Weeks 5 and 14 remove them one at a time.

---
---

## 17. Problems to work

Work these with paper before reading the discussions. Several are open, and I say so where they are.

**1.** State the lecture's definition of an intelligent system [§1] and identify which clause rules out the table-driven agent. Then explain why a quartz clock satisfies *"computes how to act"* and still fails the definition.

**2.** Write a full **PEAS** description for an **automated insulin pump**: a continuous glucose monitor reports a noisy reading every 5 minutes, a pump delivers insulin in 0.5-unit increments, and delivered insulin keeps acting for 3–4 hours. Then show that a simple reflex agent with the rule `IF glucose > 180 THEN deliver 2 units` seriously harms the patient. Give times and readings.

**3.** The syllogism *All men are mortal / Socrates is a man / ∴ Socrates is mortal* is guaranteed correct. Given that guarantee, state the three reasons the lecture rejects the laws-of-thought approach as the organizing definition of AI, and say which of the three is the strongest.

**4.** A robot in a corridor must alternate turns: at each beep, turn left if the last turn was right, and right if the last turn was left. Its **only** percept is the beep. Prove no simple reflex agent can do this, using the criterion at [L2 00:35:33]. Then give the smallest sufficient internal state space `S`.

**5.** Deep Blue examines 2.4 × 10¹⁰ positions per move against a tree of ~10¹²³. A grandmaster finds a comparable move in two seconds. Locate each on the storage↔computation spectrum (§6.6), say **where each paid**, and explain why the grandmaster's route is not simply the better engineering choice.

**6.** The lecture says vision is *"about two orders of magnitude more complex"* than speech, and speech *"several orders of magnitude"* more than low-data-rate tasks. Using the attributes table in §5, explain **which attribute** is doing the work in each comparison — and why chess, with 10¹²³ states, is nonetheless the *easier* problem.

**7.** A hospital deploys a model to allocate extra care to high-risk patients. It is trained to predict **future healthcare costs**, reasoning that sicker patients cost more. Using §11.4, identify the specification failure and predict which group is systematically under-served, and why.

**8.** Deep Blue stores the **opening and endgame** and searches the midgame. Why those regions and not the midgame? Answer in terms of §6.6 — what property must a region of a problem have to be worth storing?

**9.** §15.2 argued that observability is upstream of determinism, using poker (deterministic world, treated as stochastic). Construct the **reverse** case: an environment genuinely stochastic in the underlying world that a particular agent may safely treat as deterministic. What property of the agent makes this legitimate, and when does it stop being legitimate?

**10.** The lecture says the reflex agent *"also achieves the goal"* [L2 00:40:44]. Explain how an agent with no representation of a goal achieves one, and state exactly what it forfeits. Then: what breaks if the goal changes?

**11.** §6.2 says the *necessity* half of the physical symbol system hypothesis looks false. Construct the strongest reply a defender could make. (Hint: attack the definition of "symbol," not the evidence.) Then say why the reply is not fully satisfying.

**12.** Design the performance measure for an AI tutoring system for this course. Write one you would actually deploy — then attack it: find the behavior that maximizes it while failing the student. Iterate at least once.

---

## Answers

*Discussions, not a key. Where a problem is genuinely open, I say so rather than manufacturing closure.*

### 1 — The definition, and the clock

**The definition** [L1 00:01:17]: intelligent systems are *"machines that compute how to act effectively, safely, ethically, responsibly, **in a wide variety of novel situations**."*

**The clause that rules out the table-driven agent is "novel situations."** Novel means the designer did not anticipate it — and the table-driven agent's behavior is *entirely* the designer's anticipation, written out in advance. The lecture makes the connection explicit at [L2 00:30:54]: *"if the environment changes in a way that was not foreseen by the designer, the agent will not be able to act rationally."* A table has no entry for the unforeseen.

**The clock.** A quartz clock does *"compute how to act"* in a thin sense — it divides crystal vibrations down through circuits and acts by displaying a time [L2 00:21:46]. It does so effectively, safely, and with no ethical difficulty. It fails on the same final clause: cross a time zone and it will not adjust. **One situation outside its design and it is simply wrong**, with no capacity to notice or repair.

The instructive part is that the clock and the table-driven agent fail for the *same* reason at opposite extremes of competence — one is trivial, the other could in principle be optimal — which tells you the clause is not about how *good* the system is. It is about whether the system's competence extends past what was written into it. That is precisely what §12 defines autonomy to capture, and it is why the definition in §1 and the autonomy discussion in §12 are the same idea stated twice.

### 2 — Insulin pump

**PEAS.**

| | |
|---|---|
| **Performance** | Time-in-range (70–180 mg/dL) maximized; **hypoglycemic events (< 70) minimized and weighted far more heavily** — hypo is acute and can kill within an hour, hyper is chronic; HbA1c over the long run; alarm burden and user interruptions minimized |
| **Environment** | The patient's metabolism; meals, exercise, sleep, illness, stress; the clinician; the insulin reservoir and infusion site |
| **Actuators** | The pump (0.5 U increments); alerts and alarms; a display of recommendations; requests for patient confirmation or carbohydrate entry |
| **Sensors** | Continuous glucose monitor (5-minute, noisy); reservoir level; clock; patient-entered meal and exercise data; occlusion and battery sensors |

Note two things done deliberately, following §11.4 and the medical-diagnosis PEAS in §13.1: the performance measure is stated over **states of the world** (glucose in range, events avoided), and it is **asymmetric** — the two failure directions are not equally bad, and a symmetric measure would kill people.

**The simple reflex failure — insulin stacking:**

```
   10:00   reading 190   →  rule fires  →  deliver 2 U
   10:05   reading 186   →  rule fires  →  deliver 2 U   (the 10:00 dose has
   10:10   reading 181   →  rule fires  →  deliver 2 U    barely begun to act)
   10:15   reading 176   →  silent
   ──────────────────────────────────────────────────────────────────────────
   11:30   6 units are acting simultaneously. Glucose crashes to 35 mg/dL.
           Severe hypoglycemia: seizure, possible death.
```

**Stated in the lecture's terms** [L2 00:35:33]: two different world states — *"2 U delivered five minutes ago, still acting"* and *"no active insulin"* — produce the **same percept**, `glucose = 186`, but **require different actions**. A simple reflex agent selects on the current percept and *"ignores the perceptual history"* [L2 00:31:54], so it cannot distinguish them.

**The fix is the model-based reflex agent** (§14.3), tracking the hidden variable **insulin-on-board**. Its required knowledge, from [L2 00:36:06] and [L2 00:37:13]:

- **Transition model** — how glucose evolves on its own (rises after a meal, drifts overnight) and what a dose does (1 U lowers glucose by *X* over a 3–4 hour decay curve).
- **Sensor model** — the CGM measures *interstitial* glucose with a lag of several minutes and meaningful noise, so a reading is not the current blood value.

The sensor model matters more than it looks here: acting on a lagged reading as though it were current is a second, independent route to the same crash.

### 3 — The guarantee, and why it isn't enough

**The three reasons** [L1 00:17:04]–[00:18:14]: (i) forming correct inferences is only **one way** of acting rationally; (ii) we are **not reasoning logically all the time** — *"very often we just do what we're supposed to do"*; (iii) in many situations there is **no provably correct action**, and yet action is necessary.

**The strongest is (iii)**, and the reason is that (i) and (ii) are compatible with logic still being the *ideal* — they only say it is partial or that humans deviate from it. Reason (iii) says something stronger: **there are situations in which the logical approach returns nothing at all**, so it cannot be the ideal.

The syllogism's guarantee is exactly what exposes this. *"Syllogisms always give correct conclusions **provided that the premises are correct**"* [L1 00:15:16]. The guarantee is **conditional**, and it is silent about where correct premises come from. For an agent in the world, premises are uncertain, incomplete, and sometimes inconsistent — and the guarantee has no content under those conditions. It is not that logic gives wrong answers; it gives *no* answer, which for an agent that must act is worse.

Which is what the lecture's line means: *"part of intelligence is knowing what to do when one does not know what to do"* [L1 00:17:40]. A system with only the syllogism has no behavior at all in that case.

### 4 — The alternating robot

**The proof.** Apply [L2 00:35:33] directly. Consider two histories at the moment a beep arrives:

```
   History A:   … last turn was LEFT    →  correct action now: RIGHT
   History B:   … last turn was RIGHT   →  correct action now: LEFT
```

The percept in both cases is **beep** — identical, since the beep is the only percept. A simple reflex agent computes `g(pₙ)`, a function of the current percept alone (§14.8). A function returns the same output for the same input, so `g(beep)` is one fixed action. But the task requires RIGHT after A and LEFT after B. **Contradiction.** ∎

Note the shape of the argument, because it generalizes to every such question: exhibit two histories that are **observationally identical now** and **behaviorally different now**. That is a proof of insufficiency, not an intuition about difficulty.

**The smallest sufficient state space:** `S = {last turn was LEFT, last turn was RIGHT}` — **two states, one bit.**

```
   u(LEFT,  beep) = RIGHT          g(LEFT)  = turn RIGHT
   u(RIGHT, beep) = LEFT           g(RIGHT) = turn LEFT
```

That is exactly the `(S, u, g)` triple of §14.8's rung 2. Worth noticing how little it takes: the gap between rung 1 and rung 2 is not a matter of degree — it is the gap between **zero memory and any memory**, and one bit crosses it.

### 5 — Deep Blue and the grandmaster

**Placement.** The grandmaster sits at the **knowledge end** of §6.6's spectrum: recognition of a position as an instance of a familiar pattern replaces calculation — Law 5. Deep Blue sits at the **search end**, with a knowledge base of openings and endgames only [L1 01:00:28] — Law 4.

**Where each paid.** The grandmaster paid at **training time** — Law 3's decade of full-time practice, accumulating on the order of 70,000 ± 20,000 chunks [L1 00:56:33]. Deep Blue paid at **run time**, 2.4 × 10¹⁰ positions per move, and pays again on every move of every game forever.

**Why the grandmaster's route is not simply better** — three reasons, and the third is the interesting one:

1. **The acquisition cost is enormous and non-transferable.** A decade of a human life, and the chunks do not transfer to shogi or Go. AlphaZero playing *"chess, Go, and shogi"* from one algorithm [L1 00:44:00] is precisely what pattern-based human expertise cannot do.
2. **It is not reproducible.** You cannot copy a grandmaster; you can copy a binary to a thousand machines at zero marginal cost. For an engineering discipline this asymmetry is decisive.
3. **The two routes fail differently, and the failure modes are complementary.** Pattern knowledge fails on *unfamiliar* positions — where the library has no entry — and it fails **silently**, because the player does not know the position is unfamiliar. Search fails on positions needing depth beyond the horizon, but it *knows* it was cut off. The engineering conclusion is not that one end wins but that **the ends have complementary blind spots** — which is why modern systems occupy the middle: learned evaluation guiding selective search.

### 6 — Which attribute does the work

From §5's table:

| Domain | Knowledge | Data rate | Response time |
|---|---|---|---|
| Puzzles | poor | low | hours |
| Chess | medium | low | minutes |
| Speech | rich | high | real time |
| Vision | very rich | very high | real time |

**Speech over low-data-rate tasks: the response-time and data-rate attributes together.** The lecture's list of speech requirements [L1 00:46:37] is dominated by them — it *"has to operate in real time"*, must *"exploit vast amounts of knowledge"*, and must *"tolerate error and imprecision."* A crossword can be pondered for hours; speech arrives continuously and must be decoded as it arrives.

**Vision over speech: knowledge content and data rate.** Vision's knowledge content is *"very rich"* and its data rate *"very high, especially if you have video, so many Mbps"* [L1 00:39:02], while carrying the same real-time demand. More information per second, requiring more world knowledge to interpret, on the same clock.

**Why chess is the easier problem despite 10¹²³.** Because state-space size is *not* one of the three attributes. Chess is **medium** knowledge, **low** data rate, **minutes** of response time. Its input is a handful of discrete symbols — perfectly observed, unambiguous, arriving slowly. Its difficulty is entirely **combinatorial**, and combinatorial difficulty is the kind we know how to attack: prune, order, evaluate, cut off (§6.1).

Vision and speech are hard in a different way. Their input is **continuous, noisy, ambiguous, and incomplete** — the lecture's point that speech is *"incomplete, inaccurate, and partial"* [L1 00:47:41]. There is no exhaustive search to prune because the state is not even cleanly defined. This is why the lecture says research into speech *"provides insights into the structure of intelligent agents"* while chess provides search algorithms: **chess is hard for a computer, perception is hard for a theory.**

### 7 — The hospital cost model

**The specification failure.** The target is **future healthcare cost**; the thing wanted is **future health need**. Cost is a proxy for *care received*, not for *illness*.

**Who is under-served.** Patients who have historically **received less care for the same illness** — through lack of access, lack of insurance, distance from providers, or unequal treatment. They generated lower costs while being equally or more sick. The model learns they are low-risk and allocates them less extra care, so **the system reproduces and amplifies the access gap it learned from.**

Read this against the lecture's account: *"the data already contain the biases. So the algorithms just learn from the data and make decisions that are biased"* [L1 01:11:12]. And note the crucial property — **the model is not broken.** It predicts cost accurately. It was asked the wrong question and answered it well, which is §11.4's point about optimization pressure finding every gap between proxy and target.

This example defeats the two standard responses to algorithmic bias:

- *"Remove the protected attribute"* — race was never an input. The cost proxy carries the information regardless.
- *"Get better data"* — the data are accurate. Costs really were lower.

**The defect is in the choice of target variable**, which is a design decision made by a person. The repair follows §11.4's shape: measure something closer to the world state you care about — active chronic conditions, physiological markers, avoidable deterioration — rather than a conveniently logged financial quantity.

### 8 — Why the opening book and not the midgame

A region of a problem is worth **storing** rather than **computing** when three conditions hold *together*:

```
   1.  HIGH REUSE           the same states recur across many episodes
                            → amortizes the storage cost
   2.  BOUNDED SIZE         small enough to store
   3.  EXPENSIVE TO         computing at run time costs more than
       RECOMPUTE            retrieving
```

**The opening satisfies all three.** Every game starts from the identical position, so the first several moves recur in *every game ever played* — maximal reuse. Theory constrains the sound lines to a comparatively small set — bounded size. And evaluating an opening move correctly requires seeing twenty-plus moves ahead, far beyond any run-time horizon — expensive to recompute.

**The midgame fails condition 1 decisively.** After a dozen moves, positions are effectively unique — with ~10¹²³ reachable positions [L1 00:39:02], a given midgame position will very likely never recur in the history of chess. Storing an answer consulted once is strictly worse than computing it. It fails condition 2 catastrophically as well.

**The endgame is the interesting case, and it *does* get stored** — the lecture confirms Deep Blue held *"the opening and end games"* [L1 01:00:28]. Endgames satisfy the three conditions for a *different* reason than openings: few pieces remain, so the space is small enough to enumerate **exhaustively**; many different midgames funnel into the same simplified endings, giving reuse; and correct play may require fifty precise moves, far beyond a run-time search.

So Deep Blue stores the **two ends**, where reuse is high and the space is bounded, and searches the **middle**, where reuse is nil and the space is astronomical. **That is §6.6's spectrum applied within a single problem** — the general lesson being that the knowledge/search choice is made per region, not once per system.

### 9 — Stochastic world, deterministic treatment

**Construction.** An industrial robot arm placing components. At the level of physics the actuators are stochastic — thermal noise, backlash, gear wear, small variation in every commanded motion. The world is genuinely non-deterministic. Yet the controller may treat *"move to (x, y, z)"* as deterministic, and be right to.

**The property that legitimizes it: the agent's state representation is coarser than the noise.** If commanded moves land within ±0.05 mm and the task tolerance is ±2 mm, then every outcome the agent can **distinguish**, and every outcome that **matters to the performance measure**, is the same outcome. The stochasticity exists but is invisible at the granularity at which the agent represents the world and is evaluated.

This mirrors the lecture's poker case with the sign reversed:

```
   POKER   world DETERMINISTIC  →  treat as STOCHASTIC
           because your sensors see LESS than the state
           (partial observability ADDS apparent randomness)

   ROBOT   world STOCHASTIC     →  treat as DETERMINISTIC
           because your representation is COARSER than the noise
           (abstraction REMOVES real randomness)
```

Both instantiate the same principle from [L2 00:53:40]: **environment properties are properties of the agent–environment pair, not of the world alone.** Only the direction of the mismatch differs. The correct question is never *"is this world deterministic?"* but **"at the granularity at which this agent represents and is evaluated, does state plus action determine outcome?"**

**When it stops being legitimate:** the moment the tolerance tightens past the noise. Require ±0.02 mm and the same world with the same agent now demands stochastic treatment. **The classification changes without the world changing** — which is the sharpest possible illustration that these are not properties of the world.

### 10 — How a reflex agent achieves a goal it does not represent

**How.** The lecture answers directly [L2 00:40:44]: *"the reflex agent achieves the goal because **the designer has pre-computed the correct action for the different cases**. The designer has already put that goal into the agent program."*

So the goal is real, but it lives **in the designer's head at design time**, and the design process compiles it into condition-action rules. `IF car in front is braking THEN brake` [L2 00:33:26] encodes "don't crash" without containing any representation of "don't crash." That is exactly why the reflex agent is *"very efficient"* — the deliberation was performed once, offline, by a human, and never has to be repeated.

**What it forfeits: flexibility.** *"The designer in many cases cannot possibly think of all the different scenarios that the agent will encounter in that complex environment"* [L2 00:41:14]. Any situation the designer failed to anticipate has no matching rule, and the agent has no way to derive one — this is the same "novel situations" failure as Problem 1.

**What breaks if the goal changes: everything.** Since **no rule refers to the goal**, there is no localized edit that changes it. The entire rule set must be re-derived by whatever process produced it — a human thinking through cases. Compare the goal-based agent, which *"incorporates goal information in deciding what to do"* [L2 00:38:25] and takes the goal as **data**: change the destination and the same planner runs unmodified.

This is the sharpest statement of §14.5's trade-off. The reflex agent is a **compiled** artifact — fast, and requiring recompilation by hand for any change of objective. The goal-based agent is an **interpreter** — slower, and reconfigurable at run time.

### 11 — Defending symbol-system necessity

**The strongest reply attacks the definition, as the hint says: "symbol" was never restricted to discrete, human-legible tokens.**

The lecture's own gloss supports this. Physical symbols are *"symbols that are realizable by engineered components"* [L1 00:55:27] — entities that can be created, modified, reproduced and destroyed, composed into structures, and *"interpreted as plans of action"* [L1 00:56:00]. Nothing there requires discreteness or legibility.

The defense then runs: a trained network's internal representations **are** symbols under this definition. Particular directions in activation space designate particular features; the network composes them; the composition supports systematically different behavior. That the vehicle is a continuous vector rather than a LISP atom is an implementation detail, not a difference in kind. On this reading, connectionist systems do not refute the hypothesis — they **vindicate it in an unexpected substrate**.

**Why it is not fully satisfying**, and where the real argument now lives:

- The move risks making the hypothesis **unfalsifiable**. If any internal state supporting intelligent behavior counts as a symbol system, then "intelligence requires a symbol system" is true by construction and has stopped being an empirical claim. Newell and Simon intended an empirical claim.
- The properties that **motivated** the hypothesis were **compositionality and systematicity** — that symbols recombine reliably to handle novel structures. Whether distributed representations have these *robustly*, rather than approximately with failures at the edges, is an open empirical question.

So the honest verdict is neither "the defense works" nor "it fails," but that **the dispute has migrated from *are there symbols?* to *does the system compose reliably?*** — which is a better question, because it is testable. That migration is what progress on a philosophical dispute usually looks like, and it is why the lecture's *"it really is debatable"* [L1 00:56:33] is the correct thing to say in 2026.

### 12 — A performance measure for an AI tutor

Open-ended; the value is in the iteration. One honest pass:

**Attempt 1.** *Maximize the student's exam score.*

**Attack.** Maximized by **teaching to the exam** — drilling question formats, supplying answer templates, coaching on how marks are allocated. The student scores well and understands nothing transferable. This is the vacuum cleaner [L2 00:14:36]: a convenient agent-side proxy, gamed while the world state (understanding) is unchanged.

*This is not hypothetical. It is exactly the failure of the reviewer handout that preceded these notes, and the reason they were rewritten.*

**Attempt 2.** *Maximize performance on a held-out assessment the tutor has never seen, written by someone else, testing transfer to unfamiliar problems.*

Better — an unpredictable target closes the teach-to-the-test loophole. Attack again:

**Attack.** Nothing values the student's **time**: a tutor maximizing this consumes forty hours a week and crowds out five other courses. Nothing penalizes damage to **motivation**: relentless difficulty maximizes short-run transfer and produces a student who quits in November. And it is indifferent between retention for three years and retention for three weeks.

**Attempt 3.** A vector with explicit trade-offs — which is precisely the move to a utility function (§14.6):

```
   U  =  w₁ · transfer performance on unseen, externally-written problems
       + w₂ · retention measured at a delay of months
       − w₃ · student hours consumed
       + w₄ · willingness to continue        (a motivation proxy)
       − w₅ · variance across students       (does it fail the struggling ones?)
```

**Attack this too — and here is where the exercise pays off.** Every term is itself a proxy. `w₄` invites the tutor to be pleasant rather than effective. `w₅` is maximized by making everyone uniformly mediocre. Delayed retention testing is expensive and rarely done, so in practice it gets dropped and you slide back toward Attempt 1.

**The conclusion, arrived at by your own hand — which is §11.4's point:** you cannot write down what you want. What you *can* do is (a) prefer **world-state** measures over agent-side ones, (b) make targets **unpredictable to the optimizer** where possible, (c) include **cost and harm terms**, not only benefit terms, and (d) keep a human in the loop who can notice the measure has come apart from the intent — because the agent, by construction, cannot: the measure *is* what "good" means to it.

---

*Generated 2026-08-20 · Sources: `_generated/transcripts/Lecture_1_What_is_AI.md`, `_generated/transcripts/Lecture_2_Intelligent_Agents.md`, `AI201_1S26-27_Artificial_Intelligence_Syllabus.pdf` p.1. Material marked **[beyond lecture]** is context I have added and is not attributable to the transcripts. **Sources: audio *and* slides.** The decks were read directly out of the video frames (OCR over sampled frames of both recordings), because the lecturer leaves a great deal on screen unspoken — an 8-row table narrated as 4 rows, a 5-example PEAS table worked once, a 10×6 environment classification assigned as *"analyze this on your own"*, and roughly two dozen names, years and attributions. All of that is marked 📊 and is in these notes. **Transcript status: complete.** Two stretches of L2 ([00:41:45]–[00:44:29] and [00:48:03]–[00:53:10], ~6.4 min of speech) were lost to a Whisper repetition loop; they were re-transcribed and spliced back on 2026-08-20, with both seams verified word-for-word against the surviving text. Every minute of both lectures is now accounted for in these notes.*
