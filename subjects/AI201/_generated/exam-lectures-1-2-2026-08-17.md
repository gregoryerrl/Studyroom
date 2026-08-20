# AI 201 — Midterm Examination I
## Coverage: Lecture 1 (What is AI?) · Lecture 2 (Intelligent Agents)

**Time: 180 minutes · 100 points + 5 bonus · Closed notes**

---

### Instructions

1. Write your answers directly under each question, below the `>` prompt line.
2. **Do not scroll to `## Answers` until you have attempted every question.** The answer key is deliberately at the very bottom of this file.
3. Where a question says *"justify"*, an unjustified correct answer earns **zero**. This is not a vocabulary test.
4. Numerical answers require the arithmetic shown, not just the result.
5. Where a question asks you to *evaluate* a claim, you must state whether it is right, wrong, or right-for-the-wrong-reason — and say which part fails.

**Sources.** Every question is answerable from `_generated/transcripts/Lecture_1_What_is_AI.md`, `_generated/transcripts/Lecture_2_Intelligent_Agents.md`, and `_generated/notes-lectures-1-2-2026-08-20.md` (which additionally carries the slide-only material marked 📊). Timestamps in the answer key point into the transcripts.

> ✅ **Transcript note (updated 2026-08-20).** This exam was written against a Lecture 2 transcript that had a Whisper repetition loop destroying **[00:41:45]–[00:44:32]** and **[00:48:15]–[00:53:10]**. **That audio has since been recovered and spliced in, and the decks have been read out of the video frames.** Question 10 is now fully supported: the lecturer's formal definitions of *fully/partially observable*, *deterministic*, and *single-/multi-agent* are in the transcript, and slide 26/27 carries a complete 10-environment classification table. No cells are 'affected' any more — disregard any earlier marking to that effect.

---

# Section A — Definitions Under Pressure (18 pts)

### Question 1 (8 pts) — The 2×2, and an objection to it

**(a) [2 pts]** Fill in the grid. Label **both axes** (what each axis varies) and name all four approaches.

```
                 ┌──────────────────────────┬──────────────────────────┐
                 │                          │                          │
      ?          │                          │                          │
                 │                          │                          │
                 ├──────────────────────────┼──────────────────────────┤
                 │                          │                          │
      ?          │                          │                          │
                 │                          │                          │
                 └──────────────────────────┴──────────────────────────┘
                            ?                           ?
```

>

**(b) [3 pts]** The lecture gives **three distinct reasons** for adopting *acting rationally* over *thinking rationally*. State all three. One is a claim about scope, one about human practice, one about the existence of a correct answer.

>

**(c) [3 pts]** A classmate argues:

> *"Acting rationally is a strict superset of thinking rationally — correct inference is just one way to act rationally. A superset is more permissive, and a more permissive criterion is a weaker scientific criterion. Therefore the rational-agent definition is scientifically weaker than the laws-of-thought definition."*

The premise is correct. **Evaluate the inference.** Where exactly does it fail?

>

---

### Question 2 (6 pts) — The Turing Test trap

**(a) [2 pts]** An interrogator asks the respondent to compute `8,347,291,556 × 4,912,038,177`. The machine returns the exactly correct product in 0.3 seconds. Explain precisely why this **damages** the machine's chance of passing, and state the general design conclusion this forces about what "human-level performance" means.

>

**(b) [3 pts]** Name the **six capabilities** a machine needs to pass the *modern* version of the Turing Test, and name the AI subfield each corresponds to.

>

**(c) [1 pt]** **Two** of those six were *not* required by Turing's original 1950 setup. Which two, and what feature of the original setup excused them?

>

---

### Question 3 (4 pts) — Bounded rationality

**(a) [2 pts]** Who proposed bounded rationality, in what year, and what are its **three** driving factors?

>

**(b) [2 pts]** A software engineer objects:

> *"Satisficing is just a polite name for a buggy algorithm. A correct algorithm returns the optimum; anything else is a defect you should fix."*

Rebut in no more than three sentences, using the lecture's explicit cost model (memory and time).

>

---

# Section B — Quantitative (22 pts)

### Question 4 (8 pts) — Deep Blue, by the numbers

Deep Blue evaluated **200 million positions per second** and deliberated for **2 minutes** per move. The chess game tree contains **> 10¹²³** possible move sequences.

**(a) [2 pts]** How many positions does Deep Blue examine per move? Show the arithmetic.

>

**(b) [2 pts]** Express that as a fraction of 10¹²³, to the nearest order of magnitude.

>

**(c) [2 pts]** The lecture anchors 10¹²³ against the number of **particles** (not atoms) in the universe. State that figure and the ratio, in orders of magnitude.

>

**(d) [2 pts]** Given your answer to (b), Deep Blue searched effectively *none* of the game tree — yet beat the world champion in 1997. This is not a contradiction. Name (i) the **law of intelligent action** that explains it and (ii) the **rationality concept** that explains why the move it returns should not be called "the best move."

>

---

### Question 5 (7 pts) — The Sphinx-3 ablation

| Configuration | Word error rate |
|---|---|
| Full system | 4 % |
| Syntactic knowledge source removed | 30 % |
| Probabilistic (word-frequency) knowledge removed | 6 % |

**(a) [2 pts]** Compute the **multiplicative** error increase for each ablation.

>

**(b) [3 pts]** Explain the asymmetry in terms of **Law 5**. Your explanation must use the lecture's absurd example string and must say something about the *size of the space being searched* — not merely that "syntax is more important."

>

**(c) [2 pts]** A student concludes: *"4 % → 6 % is negligible. Drop the frequency model and save the memory."* Give the strongest counterargument the lecture material supports. (There is more than one; the best answer names the constraint that dropping knowledge violates.)

>

---

### Question 6 (7 pts) — Sizing the table-driven agent

**(a) [2 pts]** Give the lecture's figure for the size of a table-driven chess agent's table, and the physical comparison used to make it vivid.

>

**(b) [3 pts]** Size is only the first objection. State the **three further** objections the lecture raises against the table-driven agent.

>

**(c) [2 pts]** A student proposes: *"Don't hand-author the table — learn the entries from experience."* The lecture explicitly rejects this. Why? State the reason in terms of where the cost goes, not merely that "it takes long."

>

---

# Section C — Agent Design (24 pts)

### Question 7 (8 pts) — PEAS and the diagnosis of a failure

**Scenario.** You are building an **automated closed-loop insulin pump** for a Type-1 diabetic. It has a continuous glucose monitor that reports a (noisy) blood-glucose reading every 5 minutes, and a pump that can deliver insulin in 0.5-unit increments. Insulin delivered continues to act on blood glucose for roughly 3–4 hours after the dose.

**(a) [4 pts]** Give a complete **PEAS** description. Be specific — "the patient" is not an acceptable performance measure.

>

**(b) [4 pts]** A colleague proposes a **simple reflex agent** with the rule:

```
IF glucose_reading > 180 mg/dL THEN deliver 2 units
```

Construct a **concrete failure scenario** — give times, readings, and actions — in which this agent seriously harms the patient. Then name the **exact agent class** that fixes it and the **two kinds of knowledge** that class requires.

>

---

### Question 8 (8 pts) — The agent ladder

**(a) [3 pts]** For each type, state in one line **what it adds** over its predecessor and **what it pays** for the addition.

| Type | What it adds | What it costs |
|---|---|---|
| Table-driven | — | — |
| Simple reflex | | |
| Model-based reflex | | |
| Goal-based | | |
| Utility-based | | |

>

**(b) [3 pts]** The lecture states that a reflex agent "also achieves the goal." Explain **how a reflex agent achieves a goal it does not represent**, and state precisely what capability it forfeits by doing so.

>

**(c) [2 pts]** Under what condition does the goal-based agent's advantage over a well-tuned reflex agent become **decisive** rather than merely theoretical? Name two situations.

>

---

### Question 9 (8 pts) — Utility, and the performance measure that backfires

**(a) [3 pts]** Why is a *goal* insufficient for the autonomous-taxi case? Name the specific conflict the lecture uses, and state exactly what job the utility function does. Include the formal type signature of a utility function.

>

**(b) [3 pts]** Describe the **vacuum-cleaner failure** the lecture uses to illustrate a badly specified performance measure — the actual behavior the agent adopts — and state the design principle it violates in one sentence.

>

**(c) [2 pts]** Repair the vacuum performance measure. Then explain why your repair is a **structural** fix and not merely a cosmetic reword. Name the subfield where the lecture says this issue is most crucial.

>

---

# Section D — Environments (16 pts)

### Question 10 (10 pts) — Classification

**(a) [7 pts]** Classify each environment on every axis. Use: *fully / partially observable · deterministic / stochastic · episodic / sequential · static / semi-dynamic / dynamic · discrete / continuous · single- / multi-agent*.

| Environment | Observable | Determ.? | Episodic? | Static? | Discrete? | Agents |
|---|---|---|---|---|---|---|
| Chess **with a clock** | | | | | | |
| Poker | | | | | | |
| Chest X-ray analysis | | | | | | |
| Taxi driving in Metro Manila | | | | | | |
| Google search engine (softbot) | | | | | | |

>

**(b) [3 pts]** The rules of poker are perfectly deterministic, yet the lecture says to treat poker as **non-deterministic**. Explain why, and then state the **general principle** this implies about the standpoint from which environment properties must be assessed.

>

---

### Question 11 (6 pts) — Environment class, and Kasparov's complaint

**(a) [2 pts]** State the design rule about **environment classes**, and the lecture's chess illustration of violating it.

>

**(b) [4 pts]** Kasparov complained that IBM had mined his game database and tuned Deep Blue to his specific weaknesses. **Assume the complaint is factually true.**

Using the environment-class idea, state formally what would be wrong with such an agent. Then explain why this **does not invalidate** the 1997 result — your explanation must invoke the relationship between rationality and the performance measure.

>

---

# Section E — Diagnose the Flaw (20 pts)

Each statement below is **wrong or subtly misstated**. For each: (i) identify the error precisely, (ii) give the correct version, (iii) give a counterexample or supporting fact from lecture. **4 pts each.**

### Question 12
> "An agent is autonomous if it can make its own decisions without being controlled by anyone else."

>

### Question 13
> "A rational agent is one that maximizes its actual performance. If the outcome turns out badly, the agent was not rational."

>

### Question 14
> "A rational agent should never take an action that does not directly advance its goal. Wandering around to look at things is wasted effort."

>

### Question 15
> "Law 5 says knowledge compensates for lack of search. Therefore the best AI system is the one with the largest knowledge base — and Deep Blue is the proof."

>

### Question 16
> "Chess is a static environment. Therefore Deep Blue was free to deliberate as long as it needed to find the best move."

>

---

### Bonus (5 pts — all or nothing)

AlphaZero uses **no handcrafted domain knowledge except the rules**, *and* searches **1000× fewer positions** than state-of-the-art engines — less knowledge **and** less search — while beating them.

Laws 4 and 5 state that search and knowledge substitute for each other. AlphaZero appears to have cut both and won.

**Resolve the paradox.** A correct answer must locate the missing resource and say across which boundary the trade is made. Full credit requires naming the 1950 remark that anticipated exactly this.

>

---
---
---

<br><br><br><br><br><br><br><br><br><br><br><br>

# ⛔ STOP

**Do not read past this line until you have attempted every question.**

<br><br><br><br><br><br><br><br><br><br><br><br>

---
---
---

## Answers

### Q1 (8 pts)

**(a)** Axes [L1 00:01:53–00:03:05]: **standard of success** (fidelity to *humans* vs. *rationality*) × **what is measured** (internal *thought* vs. external *behavior*).

```
                        THOUGHT (internal)        BEHAVIOR (external)
                 ┌──────────────────────────┬──────────────────────────┐
                 │   THINKING HUMANLY       │   ACTING HUMANLY         │
   HUMAN         │   Cognitive modeling     │   Turing Test approach   │
                 │   [00:11:12]             │   [00:03:43]             │
                 ├──────────────────────────┼──────────────────────────┤
                 │   THINKING RATIONALLY    │   ACTING RATIONALLY  ★   │
   RATIONAL      │   "Laws of thought"      │   Rational agent         │
                 │   Aristotle, syllogisms  │   ← THIS COURSE          │
                 │   [00:13:31]             │   [00:16:00]             │
                 └──────────────────────────┴──────────────────────────┘
```

**(b)** [00:17:04]–[00:18:14]
1. **Scope:** forming correct inferences is *just one way* of acting rationally — a proper part, not the whole.
2. **Human practice:** we are *not reasoning logically all the time*; very often we just do what we are supposed to do without reasoning out the steps.
3. **Existence:** in many situations there is **no provably correct action**, yet action is still necessary. Hence: *"part of intelligence is knowing what to do when one does not know what to do"* [00:17:40].

**(c)** The premise is granted; the inference fails at **"more permissive ⟹ weaker."**

- The rational-agent criterion is not "anything goes." It replaces one hard constraint (must be derived by valid inference) with a **different hard constraint**: the action must maximize *expected performance* against a stated **performance measure**, given the percept sequence and available knowledge [L2 00:11:21]. That is an external, *measurable* standard — arguably a sharper scientific criterion than "did the derivation typecheck."
- The superset property is what makes the definition **applicable rather than vacuous**. Laws-of-thought is *silent* — it returns nothing at all — precisely in the cases where no provably correct action exists [00:17:40]. A criterion that says nothing about most real decisions is not "strong"; it is narrow.
- The argument conflates **generality** with **permissiveness**. Logic is demoted from *the standard* to *a means*; the standard becomes goal achievement.

---

### Q2 (6 pts)

**(a)** [00:05:33]–[00:06:35] An ordinary human respondent would take ~5 minutes and might well get it **wrong** — forgotten multiplication tables, human error. So a **wrong answer is evidence of humanity**. Instantaneous perfect arithmetic is therefore a giveaway: humans are *not good* at this task.

**Design conclusion:** for Turing, intelligence is equated with *behavior indistinguishable from a human's* — so passing requires **imitating human weakness**, not maximizing competence. "Human-level performance" is a **matching** criterion, not a **maximizing** one. (Contrast this sharply with the rational-agent quadrant, where you maximize.)

**(b)** [00:08:11]–[00:10:29]

| # | Capability | Subfield |
|---|---|---|
| 1 | Communicate in a **human** language (not a computer language — "even Filipino or Cebuano") | **NLP** |
| 2 | Represent and store knowledge, symbolic or non-symbolic | **Knowledge representation** |
| 3 | Draw conclusions from available knowledge by **induction or deduction** | **Automated reasoning** |
| 4 | Detect and extrapolate patterns; adapt to new situations | **Machine learning** |
| 5 | Perceive the world via cameras and microphones | **Computer vision + speech recognition** |
| 6 | Manipulate objects and move about the world | **Robotics** |

**(c)** **Perception (#5)** and **robotics (#6)**. The original setup interposed a **teletype** — typed text only [00:07:39]–[00:08:11] — which deliberately walled the interrogator off from the respondent's body and senses. The modern version puts a microphone in front of the machine ("you now speak to the machine") and expects action in the world, so perception and manipulation come back in.

---

### Q3 (4 pts)

**(a)** **Herbert Simon, 1957** [00:18:51]. Three drivers [00:19:26]: **(1) cognitive ability, (2) time constraint, (3) imperfect information.**

**(b)** Model answer:

> Optimality is not free — it is purchased with **time and memory**, and both are hard-bounded [00:21:37]–[00:22:10]. The lecture's explicit trade: a **suboptimal answer in a few seconds** beats an **optimal answer after a week of computation**, because the decision is needed now — the "correct" algorithm returns the right answer to a question that has expired. Satisficing is therefore not a defect in the algorithm but a **correct response to the resource constraint** — the objective being optimized includes the cost of optimizing.

*(Extra credit thought: the engineer's claim is itself perfect rationality — "always doing the right thing all the time" — which the lecture states is impossible for computers in complicated environments [00:18:14].)*

---

### Q4 (8 pts)

**(a)** `2 × 10⁸ positions/s × 120 s = 2.4 × 10¹⁰ positions per move.`

**(b)**
```
2.4 × 10¹⁰ / 10¹²³  ≈  2.4 × 10⁻¹¹³   ≈  10⁻¹¹³
```
Essentially **zero** — 113 orders of magnitude short of the tree.

**(c)** Particles in the universe ≈ **10⁸⁰** — "not atoms, but particles… photons included, protons, all the particles" [00:39:38]–[00:40:09].
```
10¹²³ / 10⁸⁰ = 10⁴³
```
The chess move space is **43 orders of magnitude larger** than the particle count of the universe.

**(d)**
- **(i) Law 4 — search compensates for lack of knowledge** [00:59:23]. Deep Blue's knowledge base was *very small* compared to a chess master's: **openings and endgames only**; everything else computed on the fly [01:00:28]. It paid for that missing knowledge in search.
- **(ii) Satisficing / bounded rationality.** *"It's not really the best move, because no one knows the best move. To be able to get the best move, you have to compute all the way to the end"* [01:01:37] — which 10¹²³ forbids. What it returns is the **best good-enough move given the effort expended**.

**Exam-worthy framing:** the 1960s–70s belief was that master-level chess was impossible *except* by codifying expert human knowledge. Deep Blue falsified that — expert-level performance is reachable with little knowledge, *provided it is compensated by search* [01:01:03].

---

### Q5 (7 pts)

**(a)** Syntax removed: `30 / 4 = ` **7.5×**. Frequency removed: `6 / 4 = ` **1.5×**.

**(b)** Law 5: knowledge **reduces uncertainty and constrains the exponential growth of search** — you avoid combinatorial explosion *through* knowledge [01:03:22]–[01:03:52]. The two knowledge sources act on the hypothesis space in structurally different ways:

```
   SYNTACTIC knowledge  →  declares whole regions of the space ILLEGAL
                           Remove it, and "sleep roses dangerously young colorless"
                           becomes a LEGAL hypothesis [01:04:32].
                           The decoder must now search a vastly larger admissible
                           space → 4% → 30%.

   FREQUENCY knowledge   →  RE-RANKS candidates INSIDE an already-legal space.
                           Remove it and the space does not grow — only the
                           ordering degrades → 4% → 6%.
```

**Pruning beats re-ranking.** Knowledge that changes the *size* of the search space dominates knowledge that changes only the *order* within it.

**(c)** Strongest answer: **4 % → 6 % is a 50 % relative increase in errors**, not a 2-point rounding error — on a 50,000-word vocabulary that is one extra error in every 50 words.

But the decisive counterargument is the constraint being violated: Law 5 says the trade is **knowledge against search**. Dropping knowledge to save memory does not make the problem easier — it **pushes the cost onto search**, and speech recognition must **operate in real time** [00:46:37]. You cannot spend the saved memory as time. Additionally, the ablation figures are measured *singly*; they do not compose additively, so "negligible alone" does not license "negligible in combination."

---

### Q6 (7 pts)

**(a)** On the order of **10¹²³ entries** — *"definitely much more than the number of particles in the universe"* [L2 00:29:54].

**(b)** [L2 00:30:24]–[00:31:24]
1. **Designer time.** Even for a small environment, the designer must think of *all* possible percepts/percept sequences to build the table — prohibitively long.
2. **No autonomy whatsoever.** If the environment changes in a way the designer did not foresee, the agent **cannot act rationally**. Its behavior is determined entirely by built-in knowledge, not experience.
3. **Learning does not rescue it** — it would take a very long time to learn the right value for all table entries.

**(c)** Because **learning does not shrink the table** — and the table *is* the problem. Every one of ~10¹²³ entries must still be visited (repeatedly, if noisy) before its value is known. Learning merely **relocates the cost from design time to training time**; it does not remove it. The table-driven agent is only usable in *very simple, highly constrained environments with little or no uncertainty, where everything behaves as expected* [00:31:24]–[00:31:54].

---

### Q7 (8 pts)

**(a)** PEAS [L2 00:25:53]–[00:27:54]:

| | |
|---|---|
| **P**erformance measure | Time-in-range (e.g. 70–180 mg/dL) maximized; **hypoglycemic events (< 70) minimized — weighted far more heavily**, since hypo is acute and hyper is chronic; HbA1c long-run; alarm-fatigue / number of user interruptions minimized; insulin used efficiently |
| **E**nvironment | The patient's metabolism; meals, exercise, sleep, illness, stress; the clinician; the insulin reservoir and infusion site |
| **A**ctuators | The insulin pump (0.5 U increments); alerts/alarms to patient; a display of recommendations; a request for patient confirmation or carb entry |
| **S**ensors | Continuous glucose monitor (5-min, noisy); reservoir-level sensor; clock; patient-entered meal/carb and exercise input; battery/occlusion sensors |

Note the performance measure is stated over **states of the environment** (glucose in range) and is **asymmetric** in the two failure directions — this is the lesson of Q9(b) applied.

**(b) Failure scenario — insulin stacking:**

```
  10:00   reading 190  →  rule fires  →  deliver 2 U
  10:05   reading 186  →  rule fires  →  deliver 2 U      (the 10:00 dose has barely begun to act)
  10:10   reading 181  →  rule fires  →  deliver 2 U
  10:15   reading 176  →  silent
  ...
  11:30   8 units are now acting simultaneously.
          Glucose crashes to 35 mg/dL  →  severe hypoglycemia, seizure, possible death.
```

**Root cause, stated in the lecture's own terms:** two *different* world states — "2 U delivered 5 minutes ago, still acting" and "no active insulin" — produce the **same percept**, `glucose = 186`, but **require different actions**. A simple reflex agent selects on the current percept only and *ignores the perceptual history* [00:31:54]–[00:34:26], so it cannot tell them apart. (The lecture's analogy: the **makahiya** plant — touch it, the leaves fold, every time, with no memory.)

**Fix: the model-based reflex agent** [00:34:26] — it maintains **internal state that keeps track of the part of the world it cannot currently see**, precisely in order "to distinguish between world states that generate the same perceptual input but require different actions" [00:35:33]. Here the hidden state is **insulin-on-board**.

**Two knowledge sources it requires** [00:36:06]–[00:37:13]:
1. **How the world evolves independently of the agent** — glucose rises after a meal, drifts overnight (a **transition model**).
2. **What my actions do** — 1 U lowers glucose by *X* mg/dL over a 3–4 h decay curve.

(Full credit also for naming the **sensor model** — how the state of the world is reflected in the agent's percepts [00:37:13] — which matters here because the CGM is noisy and lags interstitial glucose.)

---

### Q8 (8 pts)

**(a)**

| Type | What it adds | What it costs |
|---|---|---|
| Table-driven | (baseline) direct percept-sequence → action lookup | Astronomical table; designer must enumerate everything; **zero autonomy** |
| Simple reflex | Compresses the table into **condition-action rules** on the *current* percept | Ignores perceptual history → cannot separate states that look alike |
| Model-based reflex | **Internal state** + transition model + sensor model → tracks the unobservable | Requires the models to be built in and correct; still reactive, no lookahead |
| Goal-based | **Explicit goal** + deliberation over the future ("what will it be like if I do action A?") → planning over action *sequences* | **Efficiency** — it must **search**; much slower than a pre-compiled reflex |
| Utility-based | A **utility function** over states → resolves *conflicting* goals and degrees of success | Requires eliciting/specifying utility; still more expensive to evaluate |

**(b)** [00:40:44]–[00:41:14] The reflex agent achieves the goal because **the designer pre-computed the correct action for each case** and compiled it into the condition-action rules. The goal exists — but it lives **in the designer's head at design time**, not in the agent at run time. That is exactly why it is *very efficient*: the deliberation has already been paid for, offline.

**What it forfeits: flexibility.** "The designer in many cases cannot possibly think of all the different scenarios that the agent will encounter in that complex environment" [00:41:14]. Two consequences: (i) an unforeseen situation has no matching rule; (ii) **if the goal changes, the entire rule set must be re-derived**, because no rule references the goal.

**(c)** Decisive when:
1. **The environment is too complex/varied for the designer to enumerate the cases in advance** — the flexibility failure above.
2. **The goal is a run-time input, not a design-time constant** — e.g. a taxi whose destination is given by the passenger. A reflex agent would need a distinct rule set per destination; a goal-based agent takes the goal as data and plans.

*(Also acceptable: partially observable or dynamic environments where the consequences of action sequences must be projected forward before committing.)*

---

### Q9 (8 pts)

**(a)** A goal is a **binary predicate** — reached or not — so it cannot arbitrate **conflicting goals**. Lecture's conflict [00:45:04]: *reach Makati as fast as possible* pushes the autonomous taxi to great speed, but **great speed compromises safety**. Both are goals; they are in direct opposition, and "goal achieved" is silent about how to trade them.

The **utility function provides the trade-off** between conflicting goals [00:45:37] and lets the agent express *degrees* of success. Its signature:

```
    U : State  →  ℝ
```

a function mapping a state onto a **real number** [00:44:29] — the "happiness" the agent maximizes. The model-based utility agent selects the **action sequence maximizing utility**.

**(b)** [00:14:36]–[00:15:51] The designer sets the performance measure to **"maximize the amount of dirt collected."** The rational response is:

```
      suck up dirt  →  spill it back out  →  suck it up again  →  spill it out  → …
```

The agent **maximizes the metric perfectly while leaving the floor exactly as dirty as it found it.** The agent is not malfunctioning — it is behaving *rationally with respect to the measure it was given*. This is the lecture's example of **unintended consequences** [00:15:51].

**Principle violated:** design the performance measure according to **what you want achieved in the environment**, not according to **how you (the designer) think the agent should behave** [00:14:03].

**(c) Repair:** measure the **state of the environment** — *a clean floor* [00:15:17] — e.g. `fraction of floor area clean, sampled over the day`, jointly with **electricity consumed** and **noise generated** [00:09:14], combined by a utility function that fixes the trade-off among them.

**Why structural, not cosmetic:** the original measure scored an **agent action** (dirt collected), which the agent can inflate without changing the world. The repair scores a **property of the world**, which the dump-and-recollect cycle cannot inflate — a floor that is re-dirtied scores no better than one never cleaned. The loophole is closed at the level of *what is being measured*, not by patching the agent.

**Subfield where this is most crucial: reinforcement learning** [00:16:23] — where the agent optimizes the reward signal directly and with great persistence, so any gap between the reward and the intent is found and exploited.

---

### Q10 (10 pts)

**(a)**

| Environment | Observable | Determ.? | Episodic? | Static? | Discrete? | Agents |
|---|---|---|---|---|---|---|
| Chess **with a clock** | Fully | Deterministic | **Sequential** (non-episodic) — you learn from and are affected by earlier moves | **Semi-dynamic** — the board doesn't change while you think, but **your score does; you can lose on time default** | Discrete | **Multi** |
| Poker | **Partially** (you don't see opponents' hands) | Rules are deterministic, but **treat as stochastic** — see (b) | Sequential | Static (semi-dynamic if timed) | Discrete | **Multi** |
| Chest X-ray analysis | Partially (the image is a projection of the patient's true state) | Deterministic | **Episodic** — the previous patient's X-ray has no bearing on the current one | Static | **Continuous** (pixel intensities) | Single |
| Taxi driving, Metro Manila | **Partially** | **Stochastic** | Sequential | **Dynamic** — the world changes while you deliberate | **Continuous** (steering, speed, position) | **Multi** |
| Google search (softbot) | **Partially** — cannot observe the whole internet | Stochastic | Episodic per query (though session history and personalization make it partly sequential — either answer accepted **with justification**) | **Dynamic** — the web changes while the engine works | Discrete-ish (text tokens, ranked lists) | Multi |

Lecture anchors: chess deterministic [00:53:40]; chess static, chess-with-clock semi-dynamic, taxi driving dynamic [00:58:27]–[00:59:00]; chess non-episodic, chest X-ray analyzer episodic [00:56:55]; softbot with the internet as its environment [00:04:44]–[00:06:31]; episodic = experience divided into episodes of perceiving-and-acting, where *"the quality of action depends on just the episode itself"* [00:55:47].

**(b)** [00:54:41]–[00:55:13] Poker's rules are deterministic, but **you do not observe the other players' hands**. Because the state is only **partially observable**, the outcome of your action is unpredictable *from what you can see* — so for simplicity you treat it as non-deterministic.

**General principle** [00:53:10]–[00:53:40]:

> Environment properties are assessed **from the agent's point of view**, not from a god's-eye view of the underlying mechanics. If the sensors cannot fully observe the complete state, you *might as well treat the environment as stochastic* — even when, in reality, it is deterministic.

**Corollary worth stating:** *partial observability manufactures apparent stochasticity.* Observability is the more fundamental axis; determinism is often downstream of it.

---

### Q11 (6 pts)

**(a)** [00:59:30]–[01:01:04] Design the agent for the whole **environment class** — a set of different environments — not for one particular environment. Illustration: a chess program can be designed to exploit **a specific opponent's weakness**, and may beat that opponent very well while being **unsuitable for a tournament**. *"When you change the environment a little, your AI program will not perform as well."*

**(b) What would be formally wrong:** the agent was optimized against a **performance measure evaluated on a degenerate environment distribution** — all mass on a single opponent — rather than on the environment class (arbitrary tournament opponents). High performance on that point mass carries **no guarantee** of performance on the class: the agent's policy may encode *"exploit Kasparov's habits"* rather than *"play strong chess."* The claim it licenses is narrow: *"Deep Blue beats Kasparov,"* not *"Deep Blue plays grandmaster chess."*

**Why the 1997 result stands:** rationality is always **relative to the specified performance measure and the environment actually inhabited** [L2 00:11:21]. The performance measure for that match *was* "win this match against this opponent," and the environment *was* that match. Deep Blue acted rationally with respect to both and achieved the goal. Kasparov's complaint attacks the **generalization claim**, not the result. The lecturer's own verdict:

> *"So maybe he's right. He is right. But then the point is, he lost to Deep Blue."* [01:00:34]

The lesson is a caution about **inference from result to competence** — not a caution about the result.

---

### Q12 (4 pts)

**(i) Error:** that is the **dictionary** definition, which the lecture explicitly distinguishes from the AI notion [00:20:14]–[00:20:45].

**(ii) Correct version:** in AI, autonomy is **the ability to adapt to its environment**, which implies **flexibility**. Operationally: *"a system is autonomous to the extent that its behavior is determined by its own experience"* [00:24:18] — i.e. by its percept sequence. An agent that relies **solely on built-in knowledge and disregards the percept sequence lacks autonomy** [00:20:45].

**(iii) Counterexample:** an **ordinary quartz clock** [00:21:46]. Nobody controls it; it "decides" what to display entirely by itself, purely from built-in knowledge (crystal vibration divided down by circuits). By the dictionary definition it is autonomous. Yet **cross a time-zone border in Europe and it will not adjust** — you must set it by hand. No sensors, no experience, **no autonomy**. A GPS-equipped smart clock *does* have autonomy, because its behavior is determined by what it senses.

**Note it is a matter of degree** — "to the extent that" — not a binary property.

---

### Q13 (4 pts)

**(i) Error:** two errors. Rationality maximizes **expected** performance, not **actual**; and rationality is judged **ex ante**, given the percept sequence, not by the outcome.

**(ii) Correct version:** [00:16:23]–[00:17:28] *"Rationality is not the same as perfection. Rationality aims for maximizing the expected performance, while perfection maximizes actual performance."* Perfection is only possible in a **simplified, idealized environment**; in realistic environments it is simply not possible. The ideal rational agent standard: *for each possible percept sequence, do whatever action is expected to maximize the performance measure, given the evidence provided by the percept sequence and whatever knowledge the agent has* [00:18:36].

**(iii) Counterexample:** an agent crossing an empty street after looking both ways is **rational**; if a cargo door falls from a passing airplane and flattens it, the outcome is terrible but the agent was not irrational. It could not act on **what had not yet been perceived** [00:13:01]. The alternative standard would require **omniscience**, and *"the rational agent is definitely not omniscient"* [00:23:17].

**Sharpen the three-way distinction — this is a classic exam trap:**

```
    OMNISCIENCE  — knows the actual outcome of every action           (impossible)
    PERFECTION   — maximizes ACTUAL performance                       (impossible outside toy worlds)
    RATIONALITY  — maximizes EXPECTED performance, given percepts
                   and knowledge                                      (the achievable standard)
```

---

### Q14 (4 pts)

**(i) Error:** it excludes **information gathering**, which the lecture states is *part of* rationality — not a deviation from it.

**(ii) Correct version:** [00:17:28]–[00:18:36] A rational agent performs **actions in order to modify its future percepts** — this is information gathering, and it *is* rational. **Exploration** is the canonical case: the agent probes the unknown environment, improving its knowledge and thereby **influencing its future actions**.

**(iii) Supporting fact:** a robot **mapping its physical environment** — looking around, moving around, gathering information that is then stored [00:17:28]. The map yields no immediate goal progress; it makes every later action better.

**Two further connections that earn full marks:**
- The **problem generator** in the learning agent exists precisely for this: it *"suggests exploratory actions that lead to new and more informative experiences"* so the agent performs better in future [00:47:29].
- The claim also collides with the definition of **autonomy** (Q12): an agent that acts only on built-in knowledge and never gathers information has no autonomy.

---

### Q15 (4 pts)

**(i) Error:** Deep Blue is the flagship example of **Law 4**, which runs in the **opposite direction**, and "biggest knowledge base wins" misreads a trade-off axis as a ranking.

**(ii) Correct version:** [00:59:23]–[01:00:28] Laws 4 and 5 are the **two directions of a single axis**, not a ranking of ingredients:

```
        LOW knowledge  ──→  MORE search        (Law 4)
        HIGH knowledge ──→  LESS search        (Law 5)
```

Neither dominates; you buy performance with whichever resource is cheaper for the domain.

**(iii) Counterexample — Deep Blue itself:** its knowledge database was **very small** compared to a chess master's — just **openings and endgames**, with everything else computed on the fly [01:00:28]. It compensated with **200 million positions/second for two minutes**. It is evidence for *"expert-level performance is possible even with little knowledge, as long as it is compensated by search"* [01:01:03] — the **exact converse** of the claim.

*(A second counterexample: the 1960s–70s consensus that master-level chess required codified expert knowledge was precisely the belief Deep Blue refuted.)*

---

### Q16 (4 pts)

**(i) Error:** the environment is **chess**; the environment Deep Blue actually inhabited was **chess with a clock**, which is **semi-dynamic** — a category the statement omits.

**(ii) Correct version:** [00:58:27]–[00:59:00] *"If the environment does not change with the passage of time, but the agent's performance does, then the environment is semi-dynamic."* Chess is static; **chess with a clock is semi-dynamic**, because you can **lose due to time default**. The board waits; the scoreboard does not.

**(iii) Supporting fact:** Deep Blue's **2-minute** per-move budget [01:01:37] is exactly this constraint made concrete, and it is why the move it returns is *not* the best move but the best **good-enough** move — the operational face of **bounded rationality** and satisficing [00:18:51], [00:20:32].

**The deeper point:** "static" is a property of *the world*, "semi-dynamic" is a property of *the world plus the scoring rule*. Time pressure need not change the state to change what counts as rational.

---

### Bonus (5 pts)

**No paradox. The missing resource is training compute, and the trade is made across the train/deploy boundary.**

1. **AlphaZero's knowledge is not zero — it is *learned* rather than *handcrafted*.** DeepMind's claim is that it uses *"no domain knowledge except the rules of Go"* [00:45:28] — that is the absence of **handcrafted domain expertise and sophisticated domain adaptations**, which is what conventional engines relied on [00:44:40]. The trained evaluation function *is* a knowledge base; it is simply not one a human wrote.

2. **The search was not eliminated — it was relocated.** AlphaZero **plays against itself** during training [00:45:28], which is search: enormous quantities of it, run **offline**, over a few hours on a large machine. That offline search is **amortized into the weights**.

3. **Therefore the 1000× reduction in per-move positions searched is Law 5 operating across the boundary:** *knowledge compensates for lack of search* — the knowledge distilled during training constrains the exponential growth of the search needed at play time [01:03:22]. Deep Blue paid at **run time** (Law 4: little knowledge, 2.4 × 10¹⁰ positions per move). AlphaZero paid at **training time** and collects the discount every move thereafter.

```
    DEEP BLUE     handcrafted little knowledge  +  MASSIVE run-time search   ← Law 4
    ENGINES 2017  handcrafted much  knowledge  +  large   run-time search
    ALPHAZERO     LEARNED knowledge (offline
                  self-play search, hours)     +  1000× LESS run-time search ← Law 5
                        └──────── the search moved here ────────┘
```

4. **The 1950 remark that anticipated this: Turing**, in the same paper as the Turing Test, *"already has conceived of programs that learn from data rather than from hard-coded intelligence"* [00:23:56] — i.e. acquiring knowledge by learning instead of authoring it. AlphaZero is that idea with 67 years of compute behind it.

---

## Post-mortem: what your score means

| Score | Reading |
|---|---|
| **90–105** | You can *apply* the framework, not just recite it. Section E was the discriminator. |
| **75–89** | Solid. Re-drill the three-way distinction in Q13 (omniscience / perfection / rationality) and the Law 4 ↔ Law 5 axis in Q15. |
| **60–74** | You know the vocabulary but not the machinery. Redo Q7(b) and Q9 from scratch — those two test whether you can *diagnose* rather than *label*. |
| **< 60** | Re-read `summary-lecture-1-what-is-ai-2026-08-17.md` §2, §5 and both agent-type sections of the Lecture 2 transcript ([00:27:54]–[00:48:03]) before re-attempting. |

**The three ideas this exam was actually testing**, in case the questions obscured them:

```
  1.  Rationality is RELATIVE — to a performance measure, a percept sequence,
      prior knowledge, and an action set.  Every "is this agent rational?"
      question is malformed until those four are fixed.   [L2 00:11:21]

  2.  KNOWLEDGE and SEARCH are one axis with two directions, and where you
      pay (design time / training time / run time) is a design choice.
                                                          [L1 00:59:23, 01:03:22]

  3.  What you MEASURE is what you GET.  The vacuum that eats its own dirt
      is not broken — it is rational with respect to a badly written measure.
                                                          [L2 00:14:36]
```

---

*Generated 2026-08-17 · Sources: `_generated/transcripts/Lecture_1_What_is_AI.md`, `_generated/transcripts/Lecture_2_Intelligent_Agents.md`, `AI201_1S26-27_Artificial_Intelligence_Syllabus.pdf` p.1 (Weeks 1–2 coverage).*
