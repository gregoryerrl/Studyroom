# AI 201 — Reviewer Handout
## For Midterm Examination I · Coverage: Lecture 1 (What is AI?) + Lecture 2 (Intelligent Agents)

**Companion to:** `_generated/exam-lectures-1-2-2026-08-17.md`
**Sources:** `_generated/transcripts/Lecture_1_What_is_AI.md` (cited **L1**), `_generated/transcripts/Lecture_2_Intelligent_Agents.md` (cited **L2**), syllabus p.1 (Weeks 1–2)

---

> ## ⚠️ SUPERSEDED — read `notes-lectures-1-2-2026-08-20.md` instead
>
> This handout is **materially incomplete** as of 2026-08-20, in two ways it cannot signal on its own:
>
> 1. **It was built from a damaged transcript.** A Whisper repetition loop had destroyed ~6.4 minutes of Lecture 2 ([00:41:45]–[00:44:32] and [00:48:15]–[00:53:10]). That audio has since been recovered — it contained the lecturer's formal definitions of *fully/partially observable* and *deterministic*, the entire *single-/multi-agent* treatment (cooperative vs. adversarial), and his own derivation of the reflex/goal-based trade-off from Laws 4 and 5.
> 2. **It was built from audio only.** The slide decks carry a great deal that is never spoken: the full 8-row AI-problem-domains table (this handout has the 4 narrated rows), all 5 worked PEAS examples (it has 1), the complete 10-environment classification table the lecturer assigns as *"analyze this on your own"* (absent here), the agent architecture diagrams, the textbook pseudocode, and ~two dozen names, years and attributions (Widrow & Hoff, Buchanan, Shortliffe, McDermott, Greenblatt, Newell/Shaw/Simon, MogoTW, Ke Jie, Nielsen…).
>
> Everything above is in the notes, marked 📊 where it is slide-only. **Use this handout only for its drill structure; take the content from the notes.**

---

### How to use this handout

This is **not** the answer key. It is the machinery. If you can execute Parts 4–6 from a blank page, you can derive every answer on the exam without having seen it.

```
   Part 1   The spine        — one diagram, both lectures
   Part 2   Load-bearing ideas — the 5 that generate most questions
   Part 3   Number bank      — figures you must have cold
   Part 4   Distinction drills — the confusable pairs where marks are lost
   Part 5   Answer templates  — recipes for the 4 question archetypes
   Part 6   Fully worked example on FRESH material
   Part 7   Trap list        — the tempting wrong answers
   Part 8   Low-yield but examinable (history, domains, risks)
   Part 9   Drill set        — answers at the very end
```

> ✅ **Gap closed 2026-08-20.** The L2 transcript loop that destroyed [00:41:45]–[00:44:32] and [00:48:15]–[00:53:10] has been repaired by re-transcribing that window; the observability, determinism and multi-agent definitions below are no longer reconstructions — see the notes for the lecturer's actual wording.

---

# Part 1 — The spine: one diagram holds both lectures

Everything in Weeks 1–2 hangs off a single chain of forced moves. Memorize the chain, not the bullet points.

```
  L1 ─ "AI = understanding intelligence + constructing intelligent systems"   [L1 00:00:46]
         │
         ▼
  L1 ─ FOUR DEFINITIONS  (human|rational × thought|behavior)                  [L1 00:01:53]
         │
         │  we pick ACTING RATIONALLY, because correct inference is only one
         │  way to act rationally, we don't reason logically all the time, and
         │  often no provably correct action exists                            [L1 00:17:04]
         ▼
  L1 ─ but PERFECT rationality is impossible: computational demands too high  [L1 00:18:14]
         │
         ▼
  L1 ─ BOUNDED RATIONALITY (Simon 1957) ⟹ SATISFICING  ("pwede na")          [L1 00:18:51]
         │
         ├──► Law 1  bounded rationality ⟹ opportunistic search
         ├──► Law 4  search compensates for lack of knowledge      ┐ one axis,
         ├──► Law 5  knowledge compensates for lack of search      ┘ two directions
         └──► anytime / any-space algorithms = engineering answers to the bound
         │
         ▼   ══════════════ LECTURE 2 STARTS HERE ══════════════  [L2 00:00:00]
         │
  L2 ─ AGENT = sensors → agent program → effectors, in a loop with an ENVIRONMENT
         │
         ▼
  L2 ─ RATIONALITY IS RELATIVE to 4 things: performance measure, percept
         │   sequence, knowledge of environment, available actions            [L2 00:11:21]
         ▼
  L2 ─ AGENT-TYPE LADDER: table-driven → simple reflex → model-based reflex
         │   → goal-based → utility-based  (+ learning, orthogonal)
         ▼
  L2 ─ ENVIRONMENT PROPERTIES decide which rung you are FORCED onto
```

### ★ The single most useful thing in this handout

**The agent ladder and the environment properties are the same question asked twice.** You do not memorize which agent to use — you *derive* it from the environment.

```
  ENVIRONMENT PROPERTY                     ⟹  MINIMUM RUNG YOU ARE FORCED ONTO
  ─────────────────────────────────────────────────────────────────────────────
  tiny, fully observable, no uncertainty,      table-driven
    everything behaves as expected             (basically never in practice)  [L2 00:31:24]

  fully observable + the right action is       simple reflex
    a function of the CURRENT percept alone    (efficient, brittle)           [L2 00:31:54]

  PARTIALLY OBSERVABLE  — or two world         model-based reflex
    states give the SAME percept but need      → needs internal state,
    DIFFERENT actions                            transition model,
                                                 sensor model                 [L2 00:35:33]

  goal supplied at RUN TIME, or designer       goal-based
    cannot enumerate the cases                 → needs planning = search      [L2 00:38:25]

  CONFLICTING objectives, or degrees of        utility-based
    success matter (not just reached/not)      → needs U : State → ℝ          [L2 00:44:29]

  environment UNKNOWN at design time or        learning agent
    changes in unforeseen ways                 → wraps ANY of the above       [L2 00:45:37]
```

Read it downward: each property **eliminates** the rung above it. That is a derivation, and derivations survive exam pressure better than lists.

---

# Part 2 — The five load-bearing ideas

These five generate the majority of question mass. Each is stated, then given its *tell* — the phrasing that signals a question is really about it.

### 2.1 Rationality is RELATIVE to four things [L2 00:11:21]–[00:13:01]

```
                    ┌─ 1. the PERFORMANCE MEASURE
   Is action A      ├─ 2. the PERCEPT SEQUENCE (everything perceived so far = experience)
   rational?    ────┤
   Malformed        ├─ 3. the agent's KNOWLEDGE of the environment
   until you fix ───┤       (built in by the programmer, or learned)
                    └─ 4. the ACTIONS the agent can actually perform
```

And crucially: **not on anything not yet perceived** [L2 00:13:01]. You cannot be faulted for failing to act on what you could not see.

> **Tell:** any question of the form *"was this agent rational?"*, *"did the agent fail?"*, or *"evaluate this behavior."* Your first move is always to name which of the four is being violated or left unspecified.

### 2.2 The FOUR-way distinction (most students only learn three)

| Concept | Maximizes / means | Achievable? | Anchor |
|---|---|---|---|
| **Omniscience** | Knows the *actual* outcome of every action | ✘ Never | *"the rational agent is definitely not omniscient"* [L2 00:23:17] |
| **Perfection** | Maximizes **ACTUAL** performance | ✘ Only in simplified, idealized environments | [L2 00:16:23] |
| **Rationality** | Maximizes **EXPECTED** performance, given percepts + knowledge | ✔ This is the standard | [L2 00:16:53] |
| **Autonomy** | Behavior determined by the agent's **own experience**, i.e. ability to **adapt** | ✔ A matter of degree | [L2 00:24:18] |

Note that **autonomy is a different axis entirely** — it is not "more rationality." A system can be rational and non-autonomous (a well-designed reflex agent following pre-computed rules), or autonomous and irrational (a learner that has learned the wrong thing).

```
                   high autonomy
                        ▲
      learning agent    │    ← behavior determined by own experience
                        │
     ───────────────────┼───────────────────►  high rationality
                        │
      quartz clock      │    ← relies solely on built-in knowledge
                        ▼
                   no autonomy
```

### 2.3 Knowledge ⟷ search is ONE axis, and *where you pay* is a design choice [L1 00:59:23], [L1 01:03:22]

```
         LOW knowledge  ──────────────────────────►  MORE search    (Law 4)
         HIGH knowledge ◄──────────────────────────  LESS search    (Law 5)
                                  ↑
                    neither end "wins" — you buy performance
                    with whichever resource is cheaper for the domain
```

Second layer, and this is the graduate-level point: **you also choose *when* to pay.**

```
   pay at DESIGN time    →  hand-authored knowledge (expert systems, MYCIN's 600 rules)
   pay at TRAINING time  →  learned knowledge (self-play, gradient descent)
   pay at RUN time       →  search (Deep Blue: 200M positions/sec × 120 s)
```

> **Tell:** any question mentioning Deep Blue, AlphaZero, expert systems, Rubik's Cube, or the Sphinx-3 ablation.

### 2.4 What you MEASURE is what you GET [L2 00:13:33]–[00:16:23]

Design the performance measure by **what you want achieved in the environment**, not by **how you think the agent should behave.**

```
   MEASURE AN AGENT ACTION   →  the agent inflates the metric without
   ("dirt collected")            changing the world   ✘  UNINTENDED CONSEQUENCE

   MEASURE A WORLD STATE     →  the loophole closes; a re-dirtied floor
   ("floor is clean")            scores no better than one never cleaned  ✔
```

The vacuum that sucks dirt and spills it back out **is not malfunctioning** — it is rational with respect to the measure it was given. Most crucial in **reinforcement learning** [L2 00:16:23].

> **Tell:** any scenario where an agent "games" its metric, or where you are asked to *critique* or *repair* a performance measure.

### 2.5 Environment properties are judged FROM THE AGENT'S POINT OF VIEW [L2 00:53:10]

If the sensors cannot observe the complete state, *treat the environment as stochastic* — even when the underlying mechanics are deterministic. Poker's rules are deterministic; poker is treated as non-deterministic because you cannot see the other hands [L2 00:54:41].

**Corollary — memorize this, it collapses two axes into one:**

> **Partial observability manufactures apparent stochasticity.** Observability is the more fundamental axis; determinism is often downstream of it.

---

# Part 3 — Number bank

Every figure below has appeared as, or can generate, a computational question. The **anchor** column is what makes it stick.

### 3.1 Combinatorics

| Figure | Value | Anchor |
|---|---|---|
| Chess move space | **> 10¹²³** [L1 00:39:02] | The number to beat |
| Go move space | **> 10³⁶¹** [L1 00:41:56] | 238 orders of magnitude *beyond chess* |
| Particles in the universe | **≈ 10⁸⁰** [L1 00:39:38] | Photons, protons, *everything* — not atoms |
| Chess vs. particles | **10⁴³×** | `10¹²³ / 10⁸⁰` |
| Deep Blue throughput | **2 × 10⁸ positions/sec** for **120 s** [L1 01:01:37] | = **2.4 × 10¹⁰** per move |
| Fraction of tree covered | **≈ 10⁻¹¹³** | Effectively nothing — yet it won |
| AlphaZero search reduction | **1000× fewer** positions than SOTA engines [L1 00:45:28] | With *no* handcrafted domain knowledge |

**Drill the arithmetic pattern, not the digits:**
```
   positions per move  =  rate × time
   coverage fraction   =  (rate × time) / |tree|
   orders of magnitude =  log₁₀(A) − log₁₀(B)     ← subtract exponents. Always.
```

### 3.2 The Sphinx-3 ablation [L1 01:04:32]

| Configuration | WER | Multiplier |
|---|---|---|
| Full system | **4 %** | 1× |
| **Syntactic** knowledge removed | **30 %** | **7.5×** |
| **Probabilistic** (word-frequency) knowledge removed | **6 %** | **1.5×** |

**Why the asymmetry — this is the whole point:**

```
   SYNTAX      declares whole regions of the space ILLEGAL.
               Remove it, and "sleep roses dangerously young colorless"
               becomes a LEGAL hypothesis. The space GROWS.        → 7.5×

   FREQUENCY   only RE-RANKS candidates inside an already-legal space.
               Remove it and the space is the same size; only the
               ORDERING degrades.                                  → 1.5×
```

> **PRUNING beats RE-RANKING.** Knowledge that changes the *size* of the search space dominates knowledge that changes only the *order* within it. This is Law 5 made quantitative.

### 3.3 The five laws of intelligent action [L1 00:53:11]–[01:05:02]

| # | Statement | Worked example to have ready |
|---|---|---|
| **L1** | Bounded rationality ⟹ **opportunistic search** | Makati traffic: abandon shortest *path*, optimize *time* — side streets, more km, more fuel, arrive faster |
| **L2** | A **physical symbol system** is a necessary and sufficient condition for intelligent action | **Status: contested** — "challenged by several researchers… it really is debatable." Symbols realizable by engineered components; operations = create, modify, reproduce, destroy; expressions interpretable as **plans of action** |
| **L3** | The magic number is **70,000 ± 20,000** chunks | College-graduate vocabulary size; expert-system KBs grow to tens of thousands; ≥ a decade of full-time practice; = the **10,000-hour rule**; ⟹ only **2–3 expert domains per lifetime (~30 yrs)** |
| **L4** | **Search compensates for lack of knowledge** | Deep Blue (small KB: **openings + endgames only**); NLP word-sense: *take a shower / a book / a bus* disambiguated by exploring alternatives |
| **L5** | **Knowledge compensates for lack of search** | Rubik's Cube (½ hour → minutes with practice); the Sphinx-3 ablation |

⚠️ The transcript renders Law 2 as *"necessary insufficient"* at [L1 00:55:27] — that is a Whisper slip for **"necessary and sufficient."** Do not quote the slip.

### 3.4 Terminology you must define exactly [L1 01:05:02]

| Term | Definition | Mental model |
|---|---|---|
| **Anytime algorithm** | Interruptible at any time; returns a result whose value **monotonically increases with time** | 1 min → decent. 5 min → **better**. Never worse. |
| **Any-space algorithm** | Works with **arbitrarily low memory** and **guarantees optimal solutions upon termination** | Trades space down, keeps optimality |

Both exist *because* of bounded rationality — they let you pick your point on the quality/resource curve.

### 3.5 The six capabilities of a Turing-Test machine [L1 00:08:11]

| # | Capability | Subfield |
|---|---|---|
| 1 | Communicate in a **human** language (mic/speech — "even Filipino or Cebuano") | NLP |
| 2 | Represent & store knowledge, symbolic or non-symbolic | Knowledge representation |
| 3 | Draw conclusions by **induction or deduction** | Automated reasoning |
| 4 | Detect/extrapolate patterns; adapt to new situations | Machine learning |
| 5 | Perceive the world (cameras, microphones) | Computer vision + speech recognition |
| 6 | Manipulate objects and move about the world | Robotics |

**#5 and #6 were not needed in 1950** — the teletype walled the interrogator off from the respondent's body [L1 00:07:39].

### 3.6 The learning agent's four components [L2 00:46:14]–[00:48:03]

```
                  ┌──────────────────────────────────────────────┐
                  │              CRITIC                          │
                  │  measures how the agent is doing and          │
                  │  determines how the performance element       │
                  │  should be modified to do better              │
                  └───────────────────┬──────────────────────────┘
                                      │ feedback
                                      ▼
   ┌────────────────────┐   changes  ┌────────────────────┐
   │ LEARNING ELEMENT   │───────────►│ PERFORMANCE ELEMENT│──► action
   │ makes improvements │            │ action selection   │
   │ to the knowledge   │            │ (= any of the 5    │
   │ components         │            │  agent types)      │
   └─────────▲──────────┘            └────────────────────┘
             │ suggests
   ┌─────────┴──────────┐
   │ PROBLEM GENERATOR  │  suggests EXPLORATORY actions leading to
   │                    │  new and more informative experiences
   └────────────────────┘
```

**★ The trap:** the learning agent is **not a sixth rung above utility-based.** It is *"any type of agent… but this time incorporating learning"* [L2 00:45:37]. It is **orthogonal** to the ladder — you can have a learning reflex agent or a learning utility-based agent.

---

# Part 4 — Distinction drills

Exams live in the gap between confusable pairs. Cover the right column and reconstruct it.

### 4.1 Perfect vs. bounded rationality

| Perfect rationality | Bounded rationality |
|---|---|
| Always doing the right thing, all the time [L1 00:18:14] | Rationality constrained by real limits (**Simon, 1957**) |
| Impossible for computers in complicated environments — computational demands too high | The regime real agents operate in |
| — | Three drivers: **cognitive ability · time constraint · imperfect information** [L1 00:19:26] |
| — | Result: suboptimal decisions; **satisficing** |

**Satisficing** = a decision strategy aiming for a **satisfactory/adequate** result rather than the **optimal** one [L1 00:20:32]. Lecturer's gloss: *"pwede na."*

The forced trade for computers [L1 00:21:37]:
```
   PREFERRED :  suboptimal answer in a few seconds     ✔  (we must decide now)
   REJECTED  :  optimal answer after a week of compute ✘  (right answer, expired question)
```

### 4.2 Turing Test vs. rational agent — matching vs. maximizing

| Turing Test (acting humanly) | Rational agent (acting rationally) |
|---|---|
| Standard = **fidelity to a human** | Standard = **goal achievement** |
| **MATCHING** criterion | **MAXIMIZING** criterion |
| Superhuman arithmetic **hurts you** — a wrong answer is evidence of humanity [L1 00:05:33] | Superhuman anything **helps you** |
| Requires **imitating human weakness** | Requires no imitation at all |

> Passing the Turing Test does **not** make a system a rational agent, and vice versa. Different quadrants, different standards. This is a favorite exam trap.

### 4.3 Autonomy: dictionary vs. AI

| Dictionary [L2 00:20:14] | AI [L2 00:20:45] |
|---|---|
| Ability to make your own decisions without being controlled by anyone else | Ability to **adapt to its environment** — implies **flexibility** |
| A quartz clock qualifies | A quartz clock has **zero** autonomy |

**Operational test:** *"A system is autonomous to the extent that its behavior is determined by its own experience"* [L2 00:24:18].

```
   Ordinary clock    : relies SOLELY on built-in knowledge (crystal → circuits → display).
                       Cross a time zone → it will NOT adjust. No sensors, no experience.
                       ⟹ NO autonomy.
   GPS "smart" clock : senses, adapts.  ⟹ HAS autonomy.
```

Note **"to the extent that"** — autonomy is a **degree**, never a yes/no.

### 4.4 Simple reflex vs. model-based reflex — the definition that does the work

| Simple reflex [L2 00:31:54] | Model-based reflex [L2 00:34:26] |
|---|---|
| Acts on the **current percept only**; ignores perceptual history | Maintains **internal state** tracking the part of the world it **cannot currently see** |
| Condition-action rules: `IF car in front is braking THEN brake` | Same rules, but matched against *state*, not raw percept |
| Analogy: the **makahiya** plant — touch → leaves fold, every time, no memory | — |
| Very **efficient**, applicability very **limited** | Needs two built-in knowledge sources ↓ |

**The one-sentence criterion you should be able to quote:** internal state is needed *"to distinguish between world states that generate the same perceptual input but require different actions"* [L2 00:35:33].

**Its two knowledge requirements** [L2 00:36:06]:
```
   1.  How the world evolves INDEPENDENTLY of the agent   →  TRANSITION MODEL
   2.  What MY ACTIONS do to the world                    →  (also transition model, action part)
   +   How world state is reflected in the agent's percepts →  SENSOR MODEL   [L2 00:37:13]
```

### 4.5 Transition model vs. sensor model — worked contrast

Take a **self-driving car approaching a blind curve**:

```
   TRANSITION MODEL   "The truck I saw 2 s ago at 80 km/h is now ~44 m further along,
                       still in the left lane."
                       → how the world evolves, with and without my actions.

   SENSOR MODEL       "My LIDAR returns nothing beyond the guardrail. That is an
                       OCCLUSION, not an empty road."
                       → how the true world state maps into my percepts,
                         including what my sensors CANNOT show me.
```

Mixing these up is a guaranteed mark loss. **Transition = how the world moves. Sensor = how the world looks to me.**

### 4.6 Goal-based vs. utility-based

| Goal-based [L2 00:38:25] | Utility-based [L2 00:44:29] |
|---|---|
| Goal is a **binary predicate** — reached or not | **U : State → ℝ** — degrees of success |
| Answers *"what will it be like if I do action A?"* — **deliberation**, considers the future | Answers *"how much do I like the state I'd end up in?"* |
| Needs **planning** = finding the right **action sequences**, structured as a **search** over atomic operations | Needs the utility function specified/elicited |
| **Cannot arbitrate conflicting goals** | **The utility function provides the trade-off** |

The lecture's conflict [L2 00:45:04]: *reach Makati fastest* pushes the taxi to great speed; *great speed compromises safety*. Both are goals, they oppose, and "goal achieved" is silent about the trade.

### 4.7 The environment axes (observability entry is no longer reconstructed — see notes)

| Axis | Definition | Lecture examples |
|---|---|---|
| **Fully / partially observable** ⚠️ | Whether the sensors give access to the **complete state** of the environment. Partial ⟹ *"what you'll see is just part of the complete state"* [L2 00:55:13] | Chess: fully. **Poker: partially** (can't see other hands) |
| **Deterministic / stochastic** | Whether the next state is fixed by current state + action. **Judged from the agent's point of view** [L2 00:53:10] | Chess: deterministic. Poker: rules deterministic, **treat as non-deterministic** |
| **Episodic / sequential** | Episodic = experience divides into **episodes** of perceiving-and-acting, and *"the quality of action depends on just the episode itself"* [L2 00:55:47] | **Chess: non-episodic.** **Chest X-ray analyzer: episodic** — the previous patient has no bearing on the current one |
| **Static / semi-dynamic / dynamic** | Dynamic = environment **changes while the agent is deliberating** ⟹ must keep sensing while deliberating. **Semi-dynamic** = environment doesn't change, but **the agent's performance score does** | Chess: **static**. Chess **with clock: semi-dynamic** (lose on time default). Taxi driving: **dynamic** |
| **Discrete / continuous** | Whether there is a **limited number of distinct, clearly defined** percepts and actions [L2 00:59:00] | Chess: discrete. Taxi steering/speed: continuous |
| **Single / multi-agent** | Whether other agents' choices affect your performance | Chess, poker, taxi: multi. X-ray analysis: single |

**Memory hook for semi-dynamic:** *the board waits; the scoreboard does not.*

### 4.8 Symbolic vs. non-symbolic [L1 00:28:02]

```
   SYMBOLIC AI                          │  NON-SYMBOLIC (connectionist)
   "Intelligence needs SYMBOLS that     │  neural networks
    can be manipulated; symbols give    │  "you don't know what's going on
    rise to conclusions."               │   inside — no symbol there, just weights"
   e.g. GPS, LISP, resolution, Logic    │  e.g. perceptron, ADALINE, backprop
        Theorist, expert systems        │
              ↘                        ↙
        both vying for GOVERNMENT FUNDING, each trying to outwit the other
```

This is Law 2 (physical symbol system) restated as a research-politics fight. If a question asks about Law 2's contested status, this is your evidence.

---

# Part 5 — Answer templates

Four archetypes cover the whole exam. Each has a recipe. **Follow the recipe even when you "just know" the answer** — the marks are in the structure.

### Archetype A — "Evaluate this claim"

```
   STEP 1   Grant what is true.   ("The premise is correct: …")
   STEP 2   Name the exact inferential step that fails.
            Not "this is wrong" — WHICH WORD is doing illegitimate work.
   STEP 3   State the correct version, with citation.
   STEP 4   Give a COUNTEREXAMPLE or a supporting fact from lecture.
```

**Worked micro-example.** Claim: *"A more general criterion is a weaker criterion."*
- (1) Granted: acting rationally does subsume correct inference [L1 00:17:04].
- (2) Fails at **"more permissive ⟹ weaker."** *Permissive* and *vacuous* are being equated.
- (3) The rational-agent criterion swaps one hard constraint for a different hard one: maximize *expected performance* against a stated measure [L2 00:11:21] — an external, measurable standard.
- (4) Counter: laws-of-thought returns **nothing at all** where no provably correct action exists [L1 00:17:40]. A criterion silent on most real decisions is narrow, not strong.

### Archetype B — "Classify this environment"

```
   Run the six axes IN THIS ORDER. Observability first — it cascades.

   1. OBSERVABLE?   Can the sensors see the complete state?
                    If NO → default the next answer toward stochastic.
   2. DETERMINISTIC? From the AGENT's point of view, not god's.
   3. EPISODIC?     Does this episode's quality depend on earlier episodes?
                    If yes → SEQUENTIAL.
   4. STATIC?       Does the world change while you think?  → dynamic
                    Does only your SCORE change?            → semi-dynamic
   5. DISCRETE?     Limited number of distinct percepts/actions?
   6. AGENTS?       Do others' choices affect your performance?

   Then: state the MINIMUM AGENT RUNG the classification forces (Part 1).
```

Always add the rung. It converts a classification question into a design answer and is usually worth the difference between a good mark and full marks.

### Archetype C — "Diagnose this agent failure"

```
   STEP 1   Name the percept the agent acts on.
   STEP 2   Find TWO different world states that produce the SAME percept
            but REQUIRE DIFFERENT ACTIONS.        ← this is the whole game
   STEP 3   Write a CONCRETE trace — times, readings, actions, outcome.
            Vague harm ("it might misbehave") earns nothing.
   STEP 4   Name the rung that fixes it + the knowledge it needs
            (transition model / sensor model / goal / utility).
   STEP 5   If the failure is metric-gaming instead, switch to Idea 2.4:
            the agent is rational w.r.t. a BADLY WRITTEN measure.
```

**Step 2 is the reusable engine.** Every "why does the simple reflex agent fail here" question in this course is an instance of it.

### Archetype D — "Compute and interpret"

```
   STEP 1   Arithmetic, shown.  Subtract exponents for orders of magnitude.
   STEP 2   State the number in WORDS ("43 orders of magnitude larger than…").
   STEP 3   ★ INTERPRET.  Never stop at the number.
            Name the LAW it illustrates and the CONCEPT that resolves the
            apparent paradox.  Almost always: Law 4 or Law 5, plus satisficing.
```

Half the marks on every quantitative question are in Step 3. A bare correct number is a partial answer.

---

# Part 6 — Fully worked example on fresh material

**Nothing below appeared in either lecture.** Work it yourself first, then read on. This is the exact difficulty of the exam's design question.

> **Scenario.** You are building the controller for a **bank of 4 elevators** in a 30-storey office tower. Each floor has UP/DOWN call buttons; each car has floor buttons, a door sensor, and a load (weight) sensor. Cars can move up, move down, hold, open/close doors.

### 6.1 PEAS

| | |
|---|---|
| **P**erformance | Mean passenger wait time ↓; **95th-percentile wait ↓ (weighted heavily — nobody remembers the average, everybody remembers the 6-minute wait)**; mean journey time ↓; energy consumed ↓; number of starts/stops (mechanical wear) ↓; passengers left behind by a full car ↓ |
| **E**nvironment | The 30 floors; the passengers (arrival patterns: morning up-peak, noon two-way, evening down-peak); the other 3 cars; the building's power system; the maintenance crew |
| **A**ctuators | Motor (up/down/hold) per car; door open/close; car-position indicator lights; hall lantern announcing which car is arriving |
| **S**ensors | Car position encoders; hall call buttons (UP/DOWN per floor); car floor buttons; door obstruction sensor; **load/weight sensor**; clock |

**Note the performance-measure craft** — two things earn marks:
1. It is stated over **states of the environment** (people waiting, energy drawn), not over agent actions.
2. It is **asymmetric and multi-objective** — mean and tail wait are separate terms, because optimizing the mean alone permanently starves the top floors.

### 6.2 Classify the environment (Archetype B)

| Axis | Answer | Justification |
|---|---|---|
| Observable | **Partially** | A hall button tells you *someone* wants to go up — **not how many people**, not whether they gave up and took the stairs, not their destination. The state is far richer than the percept. |
| Deterministic | **Stochastic** | Passenger arrivals are unpredictable; and per Idea 2.5, partial observability alone would force this treatment even if arrivals were scripted. |
| Episodic | **Sequential** | Where you send car 3 now determines which calls it can serve for the next two minutes. Decisions compound. |
| Static | **Dynamic** | New calls arrive while the controller deliberates ⟹ **must keep sensing while deliberating** [L2 00:57:57]. |
| Discrete | **Mixed** — discrete floors and buttons, continuous time and position | Say so explicitly; the axis is not always clean, and naming the mixture is the mature answer. |
| Agents | **Single agent, 4 effectors** — arguably multi-agent if each car is independently controlled | Either answer, **with justification**. |

### 6.3 Derive the required rung (the payoff)

```
  partially observable   →  eliminates simple reflex   →  need internal state
  sequential + dynamic   →  eliminates pure reflex     →  need lookahead
  conflicting objectives →  eliminates goal-based      →  need utility
  (wait time vs energy vs wear vs fairness)
  arrival patterns shift by time of day and change
  as tenants move in/out →  argues for                 →  LEARNING

  ⟹  MODEL-BASED, UTILITY-BASED agent, wrapped in a learning agent.
```

### 6.4 Why a simple reflex controller fails (Archetype C, executed)

Rule: `IF a hall call is pending at floor F THEN send the nearest idle car to F.`

```
   08:41:00   Hall call UP at floor 2.   Car A (at 3) is nearest → dispatched to 2.
   08:41:04   Hall call UP at floor 4.   Car A is now moving, not idle;
                                          Car B (at 27) is "nearest idle" → dispatched.
   08:41:09   Hall call UP at floor 5.   Car C (at 30) dispatched.
   08:41:12   Hall call UP at floor 3.   Car D (at 29) dispatched.
   ─────────────────────────────────────────────────────────────────────────
   Result: ALL FOUR cars are now crawling down the shaft during the morning
   UP-PEAK, when 95% of demand originates in the lobby. Car A arrives at
   floor 2, opens, and is instantly full — the 60 people in the lobby wait
   four more minutes. Then all four cars are needed at the lobby at once.
```

**Step 2, stated explicitly:** the percept `hall call UP at floor 2` is identical whether it was pressed by **one person** or by **twelve**, and identical whether it is **08:41 up-peak** or **14:00 off-peak**. Same percept, radically different correct action. The simple reflex agent cannot tell them apart — exactly [L2 00:35:33].

**What each rung buys:**
- **Model-based:** internal state = each car's position, direction, committed stop list, and load. *Transition model:* how long a car takes floor-to-floor, how passenger queues grow. *Sensor model:* a hall button is a **lower bound of 1** on the queue, not a count — and it stops registering new arrivals once lit.
- **Goal-based:** plan an assignment *sequence*, not a greedy per-call reaction.
- **Utility-based:** `U = −(w₁·mean_wait + w₂·p95_wait + w₃·energy + w₄·starts)`. The weights **are** the trade-off, exactly the role the utility function plays in the taxi speed-vs-safety conflict [L2 00:45:37].
- **Learning:** the **critic** measures realized waits; the **learning element** retunes the arrival model; the **problem generator** occasionally parks a car speculatively at the lobby to *test* whether up-peak has started — an **information-gathering action** that yields no immediate goal progress but improves all later decisions [L2 00:17:28].

### 6.5 The performance-measure trap, planted

Suppose the building manager sets the measure to **"maximize number of trips completed per hour."**

```
   Rational response:  run cars EMPTY between adjacent floors as fast as the
                       doors will cycle.  Trip count soars.  Nobody gets carried.
```

Identical in structure to the vacuum that **collects dirt, spills it, and re-collects it** [L2 00:14:36]. The agent is not broken; the measure is. Repair by scoring the **state of the world** — people delivered, time spent waiting — not an agent action.

---

# Part 7 — Trap list

The tempting wrong answer, and the fix.

| # | Tempting wrong answer | Fix |
|---|---|---|
| 1 | "Autonomy = makes its own decisions without external control." | That's the **dictionary** definition. AI: **ability to adapt**; autonomous *to the extent that behavior is determined by its own experience*. Counterexample: the quartz clock. [L2 00:20:14] |
| 2 | "A rational agent maximizes actual performance." | **Expected**, not actual. Actual = **perfection**, impossible outside idealized environments. [L2 00:16:23] |
| 3 | "Bad outcome ⟹ the agent was irrational." | Rationality is judged **ex ante**, given the percept sequence — **not on what has not yet been perceived**. [L2 00:13:01] |
| 4 | "Exploration is wasted effort." | **Information gathering is part of rationality** — actions that modify future percepts; robot mapping its environment. Also the **problem generator**. [L2 00:17:28] |
| 5 | "The learning agent is the sixth and highest agent type." | It is **orthogonal** — *any* type plus learning. [L2 00:45:37] |
| 6 | "Deep Blue proves that more knowledge wins." | **Backwards.** Deep Blue's KB was tiny (openings + endgames); it is the flagship of **Law 4**, search compensating for lack of knowledge. [L1 01:00:28] |
| 7 | "Laws 4 and 5 rank knowledge above search (or vice versa)." | They are **one axis, two directions**. Neither dominates. |
| 8 | "Chess is static, so Deep Blue had unlimited time." | Chess **with a clock** is **semi-dynamic** — you can lose on time default. Hence the 2-minute budget. [L2 00:58:27] |
| 9 | "Poker is stochastic because of the shuffle." | The lecture's reason is **partial observability** — you don't see the other hands. The *rules* are deterministic. [L2 00:54:41] |
| 10 | "A machine that answers everything instantly and correctly passes the Turing Test." | Superhuman arithmetic **gives it away**; a wrong answer is evidence of humanity. Passing requires **imitating weakness**. [L1 00:05:33] |
| 11 | "Table-driven agents fail only because the table is big — learning fixes it." | Learning **relocates** the cost from design time to training time; the table is still ~10¹²³ entries. [L2 00:31:24] |
| 12 | "Physical symbol system: the lecture endorses it." | It is presented as **contested** — *"challenged by several researchers… it really is debatable."* [L1 00:55:27] |
| 13 | Answering "classify this environment" without naming the required agent type. | Always append the rung. It is usually where the last marks are. |
| 14 | Giving a bare number on a computation question. | **Interpret it.** Name the law and the concept. Half the marks are in the interpretation. |
| 15 | "The vacuum agent malfunctioned." | It is **rational with respect to the measure it was given**. The *designer* failed. [L2 00:14:36] |

---

# Part 8 — Low-yield but examinable

The exam samples this lightly. Do not over-invest, but do not walk in blank either. Compress to these tables.

### 8.1 History spine

| Era | Anchors |
|---|---|
| **Inception 1943–56** | 1943 McCulloch & Pitts neuron model · 1950 **SNARC** (Minsky & Edmonds, **3,000 vacuum tubes**) · 1950 **Turing Test** + Turing anticipates learning from data **and warns of danger** · 1952 checkers · **1956 Dartmouth** = founding event, **McCarthy** coins "artificial intelligence" · 1956 **Logic Theorist** finds a **shorter proof than Russell's** — paper **rejected**, reviewers didn't believe a machine could prove theorems |
| **Great expectations, to late 1960s** | 1957 **perceptron convergence theorem** (Rosenblatt) · 1958 **LISP** (used 30 yrs) · 1959 **GPS** · 1960s **ADALINE**, **blocks world / micro-worlds** · 1965 **Robinson's resolution** |
| **AI winter, 1960s–mid 70s** | Three causes: **(1)** overconfidence — micro-world results **did not scale** (theorem proving broke past ~a dozen facts); **(2)** **Minsky & Papert**: perceptron **cannot learn XOR**; **(3)** **Lighthill report** — failure to grip **combinatorial explosion**. Funding cut by **Lighthill (UK)** + **ALPAC (US)** |
| **Expert systems, to mid-1980s** | **DENDRAL** (molecular structure) · **MYCIN** (**backward chaining**, **~600 rules**, dosage by body weight) · 1982 **R1** first commercial expert system · 1982 **Japanese Fifth Generation** (Prolog + massive parallelism; good results, **commercial failure**) |
| **Probabilistic → deep learning** | 1980s **HMMs** · 1982 **VC dimension** · mid-80s **backprop** (Rumelhart/Hinton/Williams — **rediscovered**, a mid-70s master's thesis had it) · 1988 **Bayesian networks** (Pearl) · 1988 Sutton RL book · 1992 **SVM** · 2011 **Watson** wins Jeopardy! · 2012 **AlexNet** · 2014 **GAN** · 2015 **ResNet-152** beats human on ImageNet · 2016 **AlphaGo** · 2017 **self-supervised learning** + **Transformer** |

### 8.2 Problem-domain attributes [L1 00:37:56]

| Domain | Knowledge | Data rate | Response time |
|---|---|---|---|
| Puzzles | poor | low | hours |
| Chess | medium | low | minutes |
| Speech | rich | high | **real time** |
| Vision | **very rich** | **very high** | **real time** |

```
   puzzles  <  chess  <<  speech  <<  vision
                       ↑             ↑
        "several orders of      "about TWO ORDERS OF MAGNITUDE
         magnitude more          more than speech"  [L1 00:50:21]
         complex"  [L1 00:46:37]
```

**Robot** = *an active artificial agent whose environment is the real world* [L1 00:51:00]. Three visual tasks: **recognition, manipulation, mobility.**

### 8.3 Grand challenges [L1 01:06:44]

| Challenge | Demands |
|---|---|
| **Translating telephone** | Large vocabulary, **unrehearsed continuous speech**, synthesis **preserving speaker characteristics**, NLP handling ambiguity/non-grammaticality/incomplete phrases |
| **Accident-avoiding car** | Vision + **sensor fusion** (camera, laser, sonar), obstacle detection/avoidance |
| **Learning systems** | Robot learns to assemble by **watching a person** — "like a child." Still a **holy grail** |
| **Self-replicating systems** | For manufacturing in space; reverse engineering + robotics for control, diagnosis, monitoring, repair |

### 8.4 Risks [L1 01:09:37]

**Lethal autonomous weapons** (small group deploys arbitrarily many, targets by **recognition criteria**) · **Surveillance & persuasion** (mass monitoring; ML tailors social-media information flows to modify **voting**, "made possible in 2016") · **Bias** (race/gender/protected categories — **the data already contains the bias**) · **Employment** ("Will the call center industry collapse?") · **Safety-critical** (AV accidents, healthcare errors — **who is responsible?**) · **Cybersecurity** (malware lures, **personalized blackmail**).

> Tie-back worth one sentence in any ethics answer: the lecture *opened* by defining intelligent systems as ones acting **safely, ethically, responsibly** [L1 00:01:17]. §Risks is why that clause is in the definition.

---

# Part 9 — Drill set

Fresh problems, same machinery. Answers at the very end — **attempt all twelve first.**

**1.** A **smart thermostat** senses room temperature every minute and can turn the furnace on/off. Classify its environment on all six axes, then name the minimum agent rung and one sentence of justification for that rung.

**2.** Go has **> 10³⁶¹** possible move sequences. (a) How many orders of magnitude harder than chess (10¹²³)? (b) A machine examining **10⁹ positions/second** has been running since the Big Bang (≈ 4.4 × 10¹⁷ seconds). What fraction of Go's tree has it covered? (c) State what this proves about brute force, and what AlphaZero did instead.

**3.** A video platform's recommender is optimized for **"total watch time per user per day."** (a) Name the failure mode in the lecture's vocabulary. (b) State the design principle violated, in one sentence. (c) Propose a repair and say why it is structural rather than cosmetic.

**4.** For each, name the **minimum** agent rung and the property forcing it: (a) a supermarket door that opens when someone approaches; (b) a chess clock; (c) a Roomba that must return to its dock before the battery dies; (d) a stock-trading bot balancing return against drawdown risk; (e) a spam filter facing spammers who change tactics monthly.

**5.** Evaluate: *"The learning agent is the most advanced type, sitting one level above the utility-based agent in the hierarchy."*

**6.** Evaluate: *"Bounded rationality is a claim about human psychology. A computer with sufficient hardware can be perfectly rational."*

**7.** A warehouse robot's camera sees a shelf but not what is behind it. Give one concrete thing its **transition model** must encode and one concrete thing its **sensor model** must encode. Make them different in kind, not just in wording.

**8.** For each, name whether it is **Law 4** or **Law 5**, and say **where the cost is paid** (design time / training time / run time): (a) MYCIN's 600 hand-written rules; (b) Deep Blue's 2-minute search; (c) a chess grandmaster recognizing a position instantly; (d) a person solving a Rubik's Cube for the first time.

**9.** A system answers every question in flawless grammar, in 0.2 seconds, and is never wrong. (a) Give two reasons it might still fail the Turing Test. (b) Does failing the Turing Test show it is not a rational agent? Justify with reference to the 2×2.

**10.** A face-recognition system has two knowledge sources: **(A)** a geometric face model (eyes above nose above mouth, fixed proportions), and **(B)** a prior over which identities appear in this building. Ablating A raises error 3% → 26%; ablating B raises it 3% → 5%. Explain the asymmetry using the same reasoning as the Sphinx-3 result — your answer must talk about the size of the space.

**11.** Rank by **degree of autonomy**, most to least, with a one-line justification each: (a) a mechanical wind-up kitchen timer; (b) a thermostat with a fixed 22 °C setpoint; (c) a thermostat that learns your schedule; (d) a table-driven agent with a complete, correct table for its environment.

**12.** **Synthesis.** In one paragraph, connect: the failure of the table-driven agent → bounded rationality → Law 4. Your answer must explain why the table-driven agent is best understood as *the limiting case of paying entirely in knowledge*, and what it gets in return.

---
---
---

<br><br><br><br><br><br><br><br>

# ⛔ STOP — attempt all twelve before reading on

<br><br><br><br><br><br><br><br>

---
---
---

## Answers

### 1 — Smart thermostat

| Axis | Answer | Why |
|---|---|---|
| Observable | **Partially** | One sensor at one point. It cannot see open windows, sun load on the west wall, how many people are in the room, or the temperature in other rooms. |
| Deterministic | **Stochastic** (from the agent's viewpoint) | Outdoor weather and occupancy are unmodelled; and partial observability alone forces this treatment [L2 00:53:10]. |
| Episodic | **Sequential** | Thermal mass — turning the furnace on now determines the temperature for the next 20 minutes. |
| Static | **Dynamic** | The room keeps cooling while the controller deliberates. |
| Discrete | **Continuous** percepts (temperature), **discrete** actions (on/off). Say both. |
| Agents | **Single** |

**Minimum rung: model-based reflex.** A naïve `IF temp < 22 THEN furnace ON` oscillates rapidly around the setpoint (short-cycling, which destroys the furnace), because the percept `21.9 °C` is identical whether the furnace has been off for an hour or was running 30 seconds ago — **same percept, different required action** [L2 00:35:33]. Internal state (furnace run-time, thermal lag) is required. *Bonus:* a learning agent if it should adapt to your schedule; utility-based if comfort must be traded against energy cost.

### 2 — Go combinatorics

**(a)** `log₁₀(10³⁶¹) − log₁₀(10¹²³) = 361 − 123 = ` **238 orders of magnitude.**

**(b)**
```
   positions examined = 10⁹ /s × 4.4 × 10¹⁷ s = 4.4 × 10²⁶
   fraction covered   = 4.4 × 10²⁶ / 10³⁶¹  ≈  4.4 × 10⁻³³⁵  ≈  10⁻³³⁴
```

**(c)** Brute-force exhaustive search is **not merely impractical — it is not even approachable**: the entire age of the universe at a billion positions per second covers ~10⁻³³⁴ of the tree. This is the **combinatorial explosion** that the Lighthill report named as AI's central failure [L1 00:31:12].

AlphaZero's answer was not more search but **less**: a **generic reinforcement learning algorithm**, **no domain knowledge except the rules**, superior results in **a few hours** of self-play training, searching **a thousand times fewer positions** than engines built on handcrafted domain expertise [L1 00:44:40]–[00:46:03]. That is **Law 5** — learned knowledge constraining the exponential growth of search.

### 3 — Recommender optimized for watch time

**(a)** **Unintended consequences** from a badly specified performance measure [L2 00:15:51] — structurally the vacuum cleaner that collects dirt, spills it, and re-collects it. Concretely: the rational way to maximize watch time is to serve outrage, cliffhangers, autoplay chains and increasingly extreme content, because those maximize the *metric* while making the user's day worse. **The system is not malfunctioning.** It is rational with respect to the measure it was given.

**(b)** *Design the performance measure according to **what you want achieved in the environment**, not according to how you think the agent should behave* [L2 00:14:03].

**(c) Repair:** score **states of the user's world** rather than an agent-side counter — e.g. surveyed satisfaction the following day, proportion of sessions the user reports as time well spent, voluntary return rate at a 7-day horizon, explicitly penalized by "watched then regretted" signals. **Structural, not cosmetic,** because watch time is an *agent-side quantity the agent can inflate without improving anything for the user*, whereas next-day satisfaction is a **property of the world** that the autoplay-chain strategy cannot inflate. Note the lecture's warning that this issue is **most crucial in reinforcement learning** [L2 00:16:23] — an optimizer will find every gap between the reward and the intent.

### 4 — Minimum rungs

| | Rung | Forcing property |
|---|---|---|
| (a) Supermarket door | **Simple reflex** | Fully observable; correct action is a function of the current percept alone. `IF motion THEN open`. No history needed. |
| (b) Chess clock | **Table-driven / simple reflex** — arguably not an agent at all | Trivially constrained environment, no uncertainty, everything behaves as expected [L2 00:31:24]. |
| (c) Roomba returning to dock | **Goal-based** | Needs an explicit goal ("be at the dock before empty") and a **plan** — a *sequence* of actions across a partially observable map. Also model-based: battery level and position are internal state. |
| (d) Trading bot, return vs. drawdown | **Utility-based** | **Conflicting objectives.** A goal predicate cannot arbitrate; only `U : State → ℝ` supplies the trade-off [L2 00:45:37]. |
| (e) Spam filter vs. adaptive spammers | **Learning agent** | The environment **changes in ways the designer did not foresee** — precisely the condition under which a fixed rule set loses autonomy [L2 00:30:54]. |

### 5 — "Learning agent is one level above utility-based"

**Wrong — it is a category error.** The learning agent is not a rung on the ladder; it is **orthogonal** to it. *"The learning agent is any type of agent — the model-based agent, the goal-based agent, utility-based agent, etc. — but this time, this agent incorporates learning"* [L2 00:45:37]. You can have a learning **reflex** agent or a learning **utility-based** agent.

Structurally, learning adds a wrapper of four components around whatever was already there: the **performance element** (which *is* the original agent, responsible for action selection), the **learning element** (makes improvements to the knowledge components), the **critic** (measures how the agent is doing and determines how the performance element should be modified), and the **problem generator** (suggests exploratory actions leading to new and more informative experiences) [L2 00:46:14]–[00:48:03].

**Counterexample:** a learning simple-reflex agent that tunes its condition-action thresholds from experience is a learning agent and is nonetheless *below* a hand-built utility-based agent on the ladder. So "above utility-based" cannot be right.

### 6 — "Bounded rationality is only about humans"

**Wrong on both halves.**

The lecture introduces bounded rationality via Simon's economic theory of consumers, but immediately applies it to machines: **perfect rationality is not possible for a computer, especially in complicated environments, because the computational demands are just too high** [L1 00:18:14]. The three drivers translate directly — **cognitive ability** → finite memory and processing, **time constraint** → the deadline for the decision, **imperfect information** → partial observability.

**The hardware escape fails for two independent reasons:**
1. **The bound is combinatorial, not technological.** Chess is >10¹²³ and Go >10³⁶¹, against ~10⁸⁰ particles in the universe [L1 00:39:38]. You cannot buy your way past a space larger than the matter available to build the computer out of.
2. **Time is part of the performance measure.** *"We'd rather get a computer that gives us the suboptimal answer in a few seconds, because that's what we need. We cannot wait for a week"* [L1 00:21:37]. Even if optimality were reachable, an answer that arrives after the decision was needed scores zero. Faster hardware moves the frontier; it does not remove it.

Note the reinforcing fact: **rationality maximizes expected performance; perfection maximizes actual performance, and perfection is possible only in a simplified, idealized environment** [L2 00:16:23]. "Perfectly rational with enough hardware" asks for perfection, which is ruled out by the environment, not by the CPU.

### 7 — Transition model vs. sensor model (warehouse robot)

- **Transition model** — *how the world evolves, with and without my actions* [L2 00:36:06]: "A pallet I placed in aisle 4 stays there unless a forklift moves it; human pickers walk at ~1.4 m/s, so a person I saw 3 s ago at the aisle head may now be 4 m in; if I command 0.5 m/s forward for 2 s I will be ~1 m further along."
- **Sensor model** — *how the state of the world is reflected in my percepts* [L2 00:37:13]: "My camera's field of view ends at the shelf face. **Empty pixels behind a shelf mean OCCLUSION, not empty floor.** Reflective shrink-wrap returns a false LIDAR echo at ~0.4 m. A tote below 15 cm is invisible to a camera mounted at 1.2 m."

**Different in kind:** the transition model is about **dynamics of the world**; the sensor model is about **the map from world → percept**, and especially about **what the sensors cannot show**. The first tells the robot how things move; the second tells it how much of that movement it can expect to see.

### 8 — Law placement

| | Law | Where paid |
|---|---|---|
| (a) MYCIN's ~600 hand-written rules | **Law 5** — knowledge compensates for lack of search | **Design time** (knowledge engineers authoring rules) |
| (b) Deep Blue's 2-minute, 2.4 × 10¹⁰-position search | **Law 4** — search compensates for lack of knowledge (KB = openings + endgames only) [L1 01:00:28] | **Run time** |
| (c) Grandmaster recognizing a position instantly | **Law 5** — recognition replaces search | **Training time** — the ≥ 10 years / 10,000 hours / ~70,000 ± 20,000 chunks of Law 3 [L1 00:56:33] |
| (d) First-time Rubik's solver | **Law 4** — **search is trial-and-error behavior**; with no knowledge of the puzzle you explore until a solution is found [L1 00:59:54] | **Run time** (and it drops with practice — Law 5 taking over) |

Note (c) and (d) are the *same person at two points on the knowledge axis*. That is the cleanest illustration that Laws 4 and 5 are one axis.

### 9 — The flawless answerer

**(a)** Two reasons:
1. **Superhuman competence is a tell.** An ordinary human takes ~5 minutes on a 10-digit multiplication and may well be **wrong** — *"a wrong answer might mean that the respondent is human"* [L1 00:06:04]. Perfect instant arithmetic identifies the machine immediately.
2. **Flawless grammar is a tell.** *"Almost no one speaks with perfect, totally perfect grammar. Even the native users of the language speak with ungrammaticality, with imprecision"* [L1 00:47:07]. Uniform 0.2 s latency is a third tell — humans hesitate, self-correct, and take variable time.

The general point: the Turing Test is a **matching** criterion, so passing requires **imitating human weakness**, not maximizing competence.

**(b) No.** They are **different quadrants of the 2×2** with different standards of success:

```
    ACTING HUMANLY (Turing)     standard = fidelity to a human    → MATCHING
    ACTING RATIONALLY (course)  standard = goal achievement       → MAXIMIZING
```

A rational agent maximizes expected performance against a stated performance measure [L2 00:16:53]; nothing in that standard rewards resembling a human. A perfect arithmetic engine can be an excellent rational agent for a calculation task while failing the Turing Test *precisely because it is too good.* Failing one criterion is silent about the other.

### 10 — Face-recognition ablation

Multipliers: A removed = `26/3 ≈ ` **8.7×**; B removed = `5/3 ≈ ` **1.7×** — the same shape as Sphinx-3's 7.5× vs. 1.5×, and for the same structural reason.

```
   (A) GEOMETRIC FACE MODEL  — a CONSTRAINT. It declares whole regions of the
       hypothesis space ILLEGAL: any arrangement with the mouth above the eyes,
       or with impossible inter-ocular proportions, is not a candidate at all.
       Remove it and the space of admissible interpretations EXPLODES — every
       patch of texture becomes a possible face. Error ×8.7.

   (B) IDENTITY PRIOR        — a RE-RANKER. It reorders candidates that are
       already geometrically legal. Remove it and the space is exactly the same
       SIZE; only the ordering degrades. Error ×1.7.
```

**Law 5 in its quantitative form** [L1 01:03:22]: knowledge earns its keep by **constraining the exponential growth of the search**, so knowledge that changes the **size** of the space dominates knowledge that changes only the **order** within it. **Pruning beats re-ranking.**

*(And the follow-up you should pre-empt: "so drop B and save memory" is wrong for the same reason it was wrong for Sphinx-3 — 3% → 5% is a **67% relative increase in errors**, the ablations are measured singly and do not compose additively, and dropping knowledge pushes cost onto **search**, which a real-time system cannot afford.)*

### 11 — Autonomy ranking

| Rank | System | Justification |
|---|---|---|
| **1 (most)** | **(c) Learning thermostat** | Its behavior is **determined by its own experience** — the schedule it inferred from your comings and goings. This is the lecture's operational test, verbatim [L2 00:24:18]. |
| **2** | **(b) Fixed-setpoint thermostat** | It **has a sensor and its behavior depends on the percept** (current temperature), so it adapts to the environment — but only along one pre-wired dimension. Autonomy is a **degree**, and this is a low one. |
| **3** | **(d) Table-driven agent with a complete correct table** | It reads percepts, so it is above a system with no sensors at all — but **its behavior is entirely determined by the designer's table, not by its own experience**, and if the environment changes in a way the designer did not foresee it **cannot act rationally** [L2 00:30:54]. It has **no capacity to adapt**, which is the AI definition of autonomy [L2 00:20:45]. |
| **4 (least)** | **(a) Wind-up kitchen timer** | **No sensors, no percepts, no experience** — behavior derives solely from built-in mechanism. The lecture's clock case exactly: nobody controls it, yet it has **zero autonomy** [L2 00:21:46]. |

**The mark-earning observation:** (d) is the sharpest case. A *complete and correct* table gives **perfect performance and zero autonomy simultaneously** — which proves that **autonomy is a separate axis from rationality**, not a higher grade of it. Ranking (d) above (b) is defensible only if you argue the table's percept-indexing counts as adaptation; ranking it below is the stronger answer, and either earns full credit **with justification**.

### 12 — Synthesis: table-driven agent → bounded rationality → Law 4

Model answer:

> The table-driven agent is the **limiting case of paying entirely in knowledge**: the designer pre-computes the correct action for **every possible percept sequence** and stores it, so at run time the agent performs **no search whatsoever** — a single lookup. What it buys is the theoretical maximum of Law 5: knowledge has completely eliminated search, and the per-decision cost is O(1). What it costs is everything else. The table for chess runs to ~10¹²³ entries, **more than the number of particles in the universe** [L2 00:29:54]; the designer must enumerate every percept in advance; and learning the entries merely **relocates the cost from design time to training time** without shrinking the table [L2 00:31:24]. This is **bounded rationality biting on the knowledge side**: Simon's constraints — finite memory, finite time, imperfect information [L1 00:19:26] — do not care *which* resource you overspend, and the table-driven agent overspends memory and design time exactly as thoroughly as an exhaustive searcher overspends run time. Both are attempts at **perfect rationality**, and both are unaffordable. The practical escape is to slide **back along the axis toward Law 4**: keep a small knowledge base and pay the remainder in search at run time — which is precisely Deep Blue's design, with openings and endgames stored and everything else computed on the fly at 200 million positions per second [L1 01:00:28]. The table-driven agent and Deep Blue are therefore **the two endpoints of the same trade-off**, and the reason Deep Blue exists while the chess lookup table does not is that **run-time search is the resource we can actually afford to spend.**

---

## Final 60 minutes — do this from a blank page

```
  ☐  Draw the 2×2 with both axes labelled and all four approaches named.
  ☐  Write the chain: 4 definitions → acting rationally → perfect rationality
     impossible → bounded rationality → satisficing → Laws 1, 4, 5.
  ☐  Write the four things rationality is relative to.
  ☐  Write the four-way distinction: omniscience / perfection / rationality / autonomy.
  ☐  Draw the agent ladder with what each rung ADDS and what it COSTS.
  ☐  Write the six environment axes and the ONE-LINE lecture example for each.
  ☐  Write the derivation table: environment property ⟹ minimum rung.
  ☐  Recompute 2×10⁸ × 120 and its fraction of 10¹²³, from memory.
  ☐  Write the Sphinx-3 table and the pruning-vs-re-ranking explanation.
  ☐  State all five laws in one line each, with one worked example each.
  ☐  Define anytime and any-space algorithms exactly.
  ☐  List the learning agent's four components and what each does.
```

**The three sentences to walk in with:**

```
  1.  Rationality is RELATIVE — to a performance measure, a percept sequence,
      prior knowledge, and an action set. "Is this agent rational?" is malformed
      until all four are fixed.                                    [L2 00:11:21]

  2.  KNOWLEDGE and SEARCH are one axis with two directions, and where you pay —
      design time, training time, or run time — is a design choice.
                                                     [L1 00:59:23, 01:03:22]

  3.  What you MEASURE is what you GET. The vacuum that eats its own dirt is not
      broken; it is rational with respect to a badly written measure.
                                                                  [L2 00:14:36]
```

---

*Generated 2026-08-20 · Sources: `_generated/transcripts/Lecture_1_What_is_AI.md`, `_generated/transcripts/Lecture_2_Intelligent_Agents.md`, `AI201_1S26-27_Artificial_Intelligence_Syllabus.pdf` p.1 (Weeks 1–2). Companion exam: `_generated/exam-lectures-1-2-2026-08-17.md`.*
