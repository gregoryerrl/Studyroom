# Lecture 1 — What is AI?

**Source:** `_generated/transcripts/Lecture_1_What_is_AI.md` (AI 201, Fundamentals of Artificial Intelligence)
**Generated:** 2026-08-17 · All `[HH:MM:SS]` cites point into that transcript.

---

## 0. Lecture roadmap [00:00:00] – [00:00:46]

```
   ┌─────────────┐   ┌──────────────┐   ┌───────────┐   ┌──────────────┐   ┌──────────────┐
   │  Nature of  │ → │   Problem    │ → │  Brief    │ → │  Five laws   │ → │   Risks &    │
   │     AI      │   │   domains    │   │  history  │   │ of int. act. │   │   benefits   │
   └─────────────┘   └──────────────┘   └───────────┘   └──────────────┘   └──────────────┘
```

**Working definition** [00:00:46]:
> AI is the field of human endeavor concerned with **understanding the nature of intelligence** and the **construction of intelligent systems**.

**Intelligent system** [00:01:17]: a machine that computes how to act *effectively, safely, ethically, responsibly*, in a **wide variety of novel situations**. The "novel situations" clause is what makes it hard — a lookup table is not intelligent.

---

## 1. The four definitions of AI — the 2×2 that organizes the whole field

Two axes [00:01:53] – [00:03:05]:

- **Standard of success:** fidelity to *humans* vs. *rationality* (ideal correctness)
- **What is measured:** internal *thought* vs. external *behavior*

```
                    THOUGHT (internal)          BEHAVIOR (external)
                 ┌────────────────────────┬────────────────────────────┐
                 │  THINKING HUMANLY      │   ACTING HUMANLY           │
   HUMAN         │  Cognitive modeling    │   Turing Test approach     │
   (fidelity to  │  → psychology, cogsci  │   → NLP, KR, ML, vision,   │
    humans)      │    brain imaging       │     robotics               │
                 ├────────────────────────┼────────────────────────────┤
                 │  THINKING RATIONALLY   │   ACTING RATIONALLY        │
   RATIONAL      │  "Laws of thought"     │   Rational agent  ★        │
   (ideal        │  → Aristotle, logic,   │   → THIS COURSE USES THIS  │
    correctness) │    syllogisms, FOL     │     [00:16:00]             │
                 └────────────────────────┴────────────────────────────┘
```

Each quadrant "has adherents, giving rise to different research fields" [00:03:05].

### 1a. Acting humanly — the Turing Test [00:03:43]

| Element | Detail |
|---|---|
| Proposed | Alan Turing, **1950** [00:03:43] |
| Setup | You type at a terminal; other end is a human **or** an AI [00:04:18] |
| Budget | **30 minutes**, any questions you like |
| Pass condition | You **cannot reliably distinguish** human from machine |

**Turing's equation** [00:06:35]: *intelligence = intelligent behavior* = human-level performance on **all** cognitive tasks, sufficient to fool an interrogator. Note the emphasis: **action / behavior**, not internals [00:07:06].

**Worked example — the 10-digit multiplication trap** [00:05:33] – [00:06:04]:

```
  Interrogator: "Multiply 8,347,291,556 × 4,912,038,177."

  Human respondent   → ~5 minutes, answer possibly WRONG   ← "human error"
  Naive machine      → < 1 second, answer exactly RIGHT    ← gives itself away!

  Inference the interrogator draws:  wrong answer ⟹ probably human
  ⟹ To PASS, the machine must deliberately be slow and imperfect.
```

This is the classic exam point: passing the Turing Test requires **imitating human weakness**, not just competence.

**Six capabilities a modern Turing-Test machine needs** [00:08:11] – [00:10:29] — these are exactly the major subfields of AI:

| # | Capability | Subfield |
|---|---|---|
| 1 | Communicate in a **human** language (mic/speech, not computer language — "even Filipino or Cebuano") | **NLP** |
| 2 | Represent & store knowledge, symbolic or non-symbolic | **Knowledge representation** |
| 3 | Draw conclusions from knowledge via **induction or deduction** | **Automated reasoning** |
| 4 | Detect/extrapolate patterns, adapt to new situations | **Machine learning** |
| 5 | Perceive the world (cameras, microphones) | **Computer vision + speech recognition** |
| 6 | Manipulate objects and move about the world | **Robotics** |

### 1b. Thinking humanly — cognitive modeling [00:11:12]

Requires getting **inside the actual workings of the human mind**. Three evidence sources:

```
   introspection ──┐
   psych. experiments ──┼──→ testable THEORY of mind ──→ expressed as a COMPUTER PROGRAM
   brain imaging (fMRI, EEG) ──┘                                    │
       ↑ monitors brain activity, blood flow,                       ↓
         glucose consumption during mental tasks     if program's INPUT–OUTPUT behavior
         [00:12:23] – [00:12:57]                     matches human behavior ⟹ evidence the
                                                     mechanism may be similar in humans
                                                     [00:12:57] – [00:13:31]
```

Note the standard of proof is weak on purpose: matching I/O is **evidence**, not proof, of a shared mechanism.

### 1c. Thinking rationally — "laws of thought" [00:13:31]

Based on **Aristotelian logic**: deductive reasoning via *modus ponens* / *modus tollens*.

**Syllogism** = a form of argument with **two premises + a conclusion logically drawn from them** [00:14:11]:

```
   Major premise :  All men are mortal.
   Minor premise :  Socrates is a man.
   ─────────────────────────────────────
   Conclusion    :  Socrates is mortal.        ← necessarily true IF both premises are true
```

Key property [00:14:45] – [00:15:16]: it works "like a mathematical formula" — **syllogisms always give correct conclusions provided the premises are correct**. AI's modern version: **first-order predicate logic**, a precise notation for correct reasoning (studied later in the course). Concern of this approach: *how to obtain correct inferences* [00:15:16].

### 1d. Acting rationally — the rational agent ★ [00:16:00]

> Acting rationally = acting **so as to achieve one's goals, given one's beliefs** [00:16:00].
> **The book's definition: AI is the study and construction of rational agents** [00:16:32].

Why this quadrant wins over "laws of thought" [00:17:04] – [00:18:14]:

1. Correct inference is only **one way** of acting rationally — a subset, not the whole.
2. We are **not reasoning logically all the time**; often we just act.
3. In many situations there is **no provably correct action**, yet action is still necessary.

> "Part of intelligence is **knowing what to do when one does not know what to do**." [00:17:40]

---

## 2. Rationality: perfect vs. bounded [00:18:14]

| | **Perfect rationality** | **Bounded (limited) rationality** |
|---|---|---|
| Definition | Always doing the right thing, all the time [00:18:14] | Rationality constrained by real limits (Herbert **Simon, 1957**) [00:18:51] |
| Feasible? | **No** for computers in complicated environments — computational demands too high; cannot consider all possible scenarios [00:18:51] | Yes — this is what real agents do |
| Drivers | — | **(1) cognitive ability, (2) time constraint, (3) imperfect information** [00:19:26] |
| Result | — | Suboptimal decisions; also influenced by moods and emotions [00:19:58] |

**Satisficing** [00:20:32]: a decision strategy aiming for a **satisfactory / adequate** result rather than the **optimal** result. The lecturer's Filipino gloss: **"Pwede na."** [00:20:32]

> "Instead of exerting maximum effort towards attaining the ideal outcome, we focus on **good enough** solutions... because we have to act under bounds of **time and space**." [00:21:04]

**Computer version** [00:21:37] – [00:22:10]:

```
   Finite MEMORY  ──┐
                    ├──→ satisficing is forced, not optional
   Finite TIME    ──┘

   Preferred:  suboptimal answer in a few seconds     ✔ (we must decide now)
   Rejected :  optimal answer after a week of compute ✘
```

---

## 3. Brief history of AI

### Phase 1 — Inception, early 1940s → mid 1950s [00:22:41]

| Year | Milestone |
|---|---|
| 1943 | McCulloch & Pitts — **computational model of the neuron** → later neural nets & deep learning [00:22:41] *(transcript: "Makilov")* |
| 1950 | Minsky & Edmonds — **SNARC**, first neural-network computer, **3,000 vacuum tubes** [00:23:13] *(transcript: "Edwards"/"SNARK")* |
| 1950 | Turing proposes the **Turing Test**; also already conceives of **programs that learn from data** rather than hard-coded intelligence; and **warns AI might not be best for the human race** [00:23:13] – [00:23:56] |
| 1952 | First **checkers-playing** programs [00:24:27] |
| **1956** | **Dartmouth College AI workshop** — widely considered the **founding event of AI**; first use of the term "artificial intelligence" by **John McCarthy** [00:24:27] |
| 1956 | **Logic Theorist** (Simon) — proves mathematical theorems; found a **shorter proof** than Bertrand Russell's; the paper was **rejected** because reviewers didn't believe a machine could do theorem proving [00:25:03] – [00:26:22] |

### Phase 2 — Great expectations, early 1950s → late 1960s [00:26:22]

| Year | Milestone | Camp |
|---|---|---|
| 1952 | First checkers program using **reinforcement learning** [00:26:55] | symbolic |
| 1957 | **Perceptron convergence theorem** — Rosenblatt [00:26:55] | non-symbolic |
| 1958 | **LISP** — AI-specific language, used for the next 30 years [00:27:28] | symbolic |
| 1959 | **GPS** (General Problem Solver) — solves puzzles like a human [00:27:28] | symbolic |
| 1960s | **ADALINE**; **micro-worlds** esp. the **blocks world** → many papers in vision, constraint propagation, NLP, planning [00:27:28] | — |
| 1965 | **Robinson's resolution principle** for first-order logic [00:28:02] | symbolic |

**The two camps** [00:28:02] – [00:29:39] — still present today:

```
   SYMBOLIC AI                          |   NON-SYMBOLIC AI (connectionist)
   "Intelligence needs SYMBOLS that     |   neural networks
    can be manipulated; symbols give    |   "you don't know what's going on
    rise to conclusions."               |    inside — there's no symbol there,
   AI = manipulation of symbols.        |    just weights."
   e.g. GPS, LISP, resolution           |   e.g. perceptron, ADALINE
              ↘                        ↙
        both vying for GOVERNMENT FUNDING, each trying to outwit the other
```

### Phase 3 — The AI winter, 1960s → mid 1970s [00:30:10]

Causes:

1. **Overconfidence** — researchers promised great performance, but results were only on **simple micro-world examples** that **did not scale** [00:30:41]. Theorem proving broke down beyond ~a dozen facts [00:31:12].
2. **Minsky & Papert** showed mathematically that the **perceptron cannot learn XOR** [00:31:12].
3. The **Lighthill report** emphasized failure to come to grips with **combinatorial explosion** — search spaces exploding combinatorially [00:31:12] – [00:31:47].

Consequence: the **Lighthill report (UK)** and **ALPAC report (US)** triggered the **AI winter**, cutting research funding [00:31:47].

### Phase 4 — Expert systems, 1960s → mid 1980s [00:32:19]

| System | What it did |
|---|---|
| **DENDRAL** | Chemical analysis — hypothesized molecular structure of substances; rivaled chemical experts [00:32:19] |
| **MYCIN** | **Backward-chaining** expert system, knowledge base of **~600 rules**; identified bacteria causing severe infections and recommended **antibiotics with dosage adjusted for patient body weight** [00:32:51] |
| **R1** (1982) | **First commercial expert system**, a **rule-based production system** [00:33:28] |
| **Japanese Fifth Generation Project** (1982) | Computers using **logic programming (Prolog)** + **massively parallel computing**; ran ~a decade; produced good results but was a **commercial failure** — companies didn't adopt it, probably too expensive [00:33:28] – [00:34:34] |

### Phase 5 — Probabilistic reasoning → deep learning age [00:34:34]

| Year | Milestone |
|---|---|
| 1980s | **HMMs** (hidden Markov models) — very successful for speech recognition [00:34:34] |
| 1982 | Vapnik & Chervonenkis — learning theory, the **VC dimension** [00:35:06] |
| mid-1980s | **Backpropagation** — Rumelhart, Hinton & Williams; later found to have been proposed in a **mid-1970s master's thesis** nobody read, so it was **rediscovered ~a decade later** [00:35:06] – [00:36:10] |
| 1988 | **Bayesian networks** — Judea Pearl (UCLA) [00:35:37] |
| 1988 | Sutton's **reinforcement learning** book [00:36:10] |
| 1992 | **Support vector machine** — Vapnik [00:36:10] |
| 2011 | **IBM Watson** — answers natural-language questions; won **Jeopardy!** ($1M) vs. human champions; later sold to a cancer center to help with **lung cancer treatment** decisions [00:36:10] – [00:37:23] |
| 2012 | **AlexNet** — started the deep learning craze [00:37:23] |
| 2014 | **GAN** — Goodfellow [00:37:23] |
| 2015 | **ResNet-152** exceeds **human performance on ImageNet** [00:37:23] |
| 2016 | **AlphaGo** wins over human players [00:37:56] |
| 2017 | **Self-supervised learning**; **Google Brain's Transformer architecture** [00:37:56] |

---

## 4. AI problem domains and their attributes [00:37:56]

| Domain | Knowledge content | Data rate | Response time |
|---|---|---|---|
| Puzzles (e.g. crossword) | poor | low | hours |
| Chess | medium | low | minutes |
| Vision | **very rich** | **very high** (video, many Mbps) | **real time** |
| Speech | rich | high | **real time** |

**Complexity ladder stated in the lecture:**

```
  puzzles  <  chess  <<  speech  <<  vision
                    ↑              ↑
     "speech recognition is        "vision task complexity is about
      several orders of magnitude   TWO ORDERS OF MAGNITUDE more
      more complex than tasks with  than that of speech" [00:50:21]
      low data rates" [00:46:37]
```

### 4a. Chess — testbed for **search** [00:39:02]

- **> 10^123 possible moves** ⟹ **brute-force exhaustive search will not work** [00:39:02] – [00:39:38].
- Scale anchor [00:39:38] – [00:40:09]: the number of **particles** in the universe (not atoms — photons, protons, everything) is only around **10^80**. Still "a very small number compared to the number of possible moves for chess."

| Era | System | Achievement |
|---|---|---|
| 1950s | first operational chess program [00:40:49] | — |
| 1960s | — | won a game in a regular tournament, beating a **Class C** player |
| 1970s–80s | Northwestern, Bell, **HITECH** | **Senior Master** rating |
| — | **Deep Thought** (CMU) | first to achieve **Grand Master** status [00:40:49] |
| 1996 | **Deep Blue** (IBM) | **lost** to Kasparov 4–2 |
| **1997** | **Deep Blue** | **won** over Kasparov — "very important milestone... an AI machine has won over the world's champion" [00:40:49] – [00:41:24] |

Chess research produced **alpha-beta search, B\* search, singular extension search**, and these search concepts "have found their way into everyday applications" [00:41:24] – [00:41:56].

### 4b. Go — testbed for **reinforcement learning** [00:41:56]

- **> 10^361 possible moves** — harder than chess [00:41:56].

| Year | Milestone |
|---|---|
| 2007 | First serious computer Go attempt — **Monte Carlo tree search** for Go [00:42:27] |
| 2010 | System won against a human player |
| 2011 | **Zen** won against a Japanese player |
| 2013 | **Crazy Stone** beat Ishida |
| 2015 | **AlphaGo** beat European champion **Fan Hui** [00:42:57] |
| 2017 | **AlphaZero** beat the best Go player in the world; **Leela Zero** released (free & open source) [00:43:29] |

**AlphaZero** (DeepMind, 2017) plays **chess, Go, and Shogi** [00:44:00]. Reactions [00:44:00] – [00:44:40]: Kasparov — "a pleasure to watch... its style was open and dynamic like his own"; another top player — it "played like a **superior alien species**."

**The contrast DeepMind drew** [00:44:40] – [00:46:03] — this is the exam-worthy point:

```
   State-of-the-art chess engines          |   AlphaZero
   ────────────────────────────────────────┼──────────────────────────────────────
   search MILLIONS of positions            |   searches 1000× FEWER positions
   handcrafted domain expertise            |   NO domain knowledge except the rules
   sophisticated domain adaptations        |   GENERIC reinforcement learning algorithm
   decades of tuning                       |   superior results in a FEW HOURS of
                                           |   training, by playing against itself
```

### 4c. Speech recognition [00:46:03]

Requirements [00:46:37] – [00:47:07]: operate in **real time**, exploit **vast amounts of knowledge**, **tolerate error and imprecision**, learn and use language, learn from examples.

Why imprecision tolerance matters [00:47:07] – [00:47:41]: "**almost no one speaks with perfect grammar** — even native users speak with ungrammaticality, with imprecision. Yet the human mind is able to decode the information."

> Research into speech gives insight into intelligent-agent structure precisely because the input is **incomplete, inaccurate, and partial** [00:47:41] – [00:48:12].

| Year | Milestone |
|---|---|
| 1970s | **Harpy, Hearsay, HWIM** — connected-speech systems using **syntax + semantics** as major knowledge sources [00:48:12] |
| — | **Sphinx-3** (CMU) — **50,000-word** vocabulary, voicemail dictation, **real time on a Pentium Pro**, **speaker-independent** [00:48:12] – [00:48:43] |
| 2002 | DARPA **EARS** — reliably detects keywords in telephone conversations [00:48:43] |
| 2007 | **CTC** (Connectionist Temporal Classification) — basis of later connectionist speech algorithms [00:49:17] |
| 2015 | **Google Voice** — **49%** performance jump using **LSTM** [00:49:17] |

Techniques it produced: word models, **HMM-based learning**, **beam search**, **CTC** [00:49:49].

### 4d. Vision [00:49:49]

Goal: **understand the world** — automatic interpretation of image data + construction of **3D models** from real-world scenes.

Three visual tasks [00:50:21] – [00:51:00]:

```
   RECOGNITION  — see in order to recognize objects around us
   MANIPULATION — see in order to handle things (doorknob, switch)
   MOBILITY     — see in order to navigate the world successfully
```

### 4e. Robotics [00:51:00]

> A **robot** is an **active artificial agent whose environment is the real world** [00:51:00].

Autonomous mobile systems ("robotic vehicles") are hard because they need **many disciplines at once**: vision, advanced sensors, high-speed processors, planning, control, learning [00:51:35] – [00:52:09].

| Year | Milestone |
|---|---|
| 1995 | **NAVLAB 5** — GM commercial van modified for autonomous steering; **navigated correctly 90% of the time** from Washington D.C. → San Diego; **when in doubt, asked the human driver to take over** [00:52:09] |
| 2010 | **VisLab** — first **intercontinental** land journey by autonomous vehicles: **Parma, Italy → Shanghai, China in 100 days** [00:52:40] |
| Now | Waymo, GM, Pony.ai, Zoox, etc. [00:53:11] |

---

## 5. ★ The Five Laws of Intelligent Action [00:53:11]

```
   ┌──────────────────────────────────────────────────────────────────────┐
   │ L1  Bounded rationality  ⟹  OPPORTUNISTIC SEARCH                     │
   │ L2  Physical symbol system: NECESSARY & SUFFICIENT for int. action   │
   │ L3  The magic number is 70,000 ± 20,000 chunks                       │
   │ L4  SEARCH compensates for lack of KNOWLEDGE      ⟵┐ mirror images   │
   │ L5  KNOWLEDGE compensates for lack of SEARCH      ⟵┘                 │
   └──────────────────────────────────────────────────────────────────────┘
```

### Law 1 — Bounded rationality implies opportunistic search [00:53:11]

When agents operate under conditions that **overload computational resources**, they deploy **opportunistic strategies of least-computation search** rather than **optimal shortest-path search** [00:53:41] – [00:54:17].

**Worked example — the Makati traffic analogy** [00:54:17] – [00:55:27]:

```
   Goal: get to Makati.  Obstacle: traffic.

   Shortest-PATH optimum  :  main road, fewest km        ✘ (stuck in traffic)
   Opportunistic choice   :  side streets, more km,      ✔ arrive FASTER
                             more gasoline
   ⟹ You re-optimize the objective you can actually afford:  TIME, not distance.
```

### Law 2 — The physical symbol system hypothesis [00:55:27]

> A physical symbol system is a **necessary and sufficient condition for intelligent action**.

| Term | Meaning [00:55:27] – [00:56:33] |
|---|---|
| Physical symbol | A symbol **realizable by engineered components** |
| Physical symbol system | A **set** of such entities |
| Symbol structure | Built from the symbol system |
| Operations | **creation, modification, reproduction, destruction** of symbols |
| Payoff | These expressions can be **interpreted as plans of action** |

**Status: contested.** "This law has been challenged by several researchers... some have criticized that this is not really necessary for intelligent action. So it really is **debatable**" [00:55:27], [00:56:00] – [00:56:33]. (This is the symbolic-vs-connectionist fight from §3 in law form.)

### Law 3 — The magic number is 70,000 ± 20,000 [00:56:33]

An **expert knows roughly 70,000 ± 20,000 chunks** of information — "a good guide for us to measure the size of an expert's knowledge base." If you're building an expert system and you hit this number, "you know that you've reached the top" [00:56:33] – [00:57:07].

Supporting evidence from cognitive science [00:57:07] – [00:58:14]:

1. Vocabularies of **college graduates** are around this size — "not 10 times, not a million."
2. Expert-system knowledge bases **grow toward tens of thousands** of rules.
3. **No human reaches world-class status without ≥ a decade of intense full-time study and practice.**

The corollaries [00:58:14] – [00:59:23]:

```
   "Even a genius who doesn't work hard for ~10 years won't be world class —
    there are many geniuses out there; the ones who WORK are the world class."

   Equivalent statement:  the 10,000-HOUR RULE.

   Lifetime arithmetic:  10 years per domain
                         ⟹ time enough to be expert in only TWO or THREE areas
                         ⟹ ~30 years
```

### Law 4 — Search compensates for lack of knowledge [00:59:23]

> **Search = trial-and-error behavior.** Faced with a puzzle we've never seen, we engage in trial and error until a solution is found. Given the *same* puzzle again, we already have the knowledge — **no more trial and error** [00:59:54].

```
        LOW knowledge  ──→  MORE search
        HIGH knowledge ──→  LESS search       (Law 4 and Law 5 are one axis)
```

**Worked example — Deep Blue** [01:00:28] – [01:02:12]:

| | |
|---|---|
| 1960s–70s belief | Master-level chess is impossible **except** by codifying expert human knowledge |
| Reality | Deep Blue's knowledge database is **very small** vs. a chess master's — just **openings and endgames**; everything else computed **on the fly** |
| Compensation | **200,000,000 positions per second**, for **2 minutes**, then pick the "best" move |

Do the arithmetic — this is what makes the law concrete:

```
   positions examined = 2×10^8 /s × 120 s = 2.4×10^10 positions

   vs. the game tree     ≈ 10^123
   fraction covered      ≈ 2.4×10^10 / 10^123  ≈  10^-113   ← essentially nothing

   ⟹ "It's NOT really the best move, because no one knows the best move.
       To get the best move you'd have to compute all the way to the end."  [01:01:37]
   ⟹ It is the "best GOOD ENOUGH move, given the effort put in."  ← satisficing again (§2)
```

**Second example — word-sense ambiguity in NLP** [01:02:12] – [01:03:22]:

```
   "take"  →  take a shower | take a book | take a bus | ...
   Precise meaning is clarified by CONTEXT, through EXPLORATION OF THE
   ALTERNATIVES until the meaning is unambiguous.   ← that exploration IS search
```

> Law 4 in one line: **when knowledge is yet to be acquired and codified, search is a very good way to proceed** [01:03:22].

### Law 5 — Knowledge compensates for lack of search [01:03:22]

Knowledge **reduces uncertainty** and **constrains the exponential growth of search** — i.e. you **avoid combinatorial explosion through knowledge** [01:03:22] – [01:03:52].

**Example A — Rubik's Cube** [01:03:52]: most people take half an hour or more. With practice you gain knowledge of the solving process, and time drops. `more knowledge → less search → less time`.

**Example B — Sphinx-3 ablation study** [01:04:32] – [01:05:02] — memorize these numbers:

| Configuration | Word error rate |
|---|---|
| Full system | **4%** |
| **Syntactic** knowledge source **turned off** | **30%** |
| **Probabilistic** knowledge (word-occurrence frequency) removed | **6%** |

With syntax off, absurd strings like *"sleep roses dangerously young colorless"* become **legal** — the search space is no longer constrained, so errors explode ~7.5×. Note the asymmetry: **syntactic** knowledge constrains search far more than **frequency** knowledge does.

---

## 6. Terminology [01:05:02]

| Term | Definition | Mental model |
|---|---|---|
| **Anytime algorithm** | Can be **interrupted at any time** and returns a result whose **value/quality monotonically increases with time** [01:05:35] | Interrupt at 1 min → decent answer. Interrupt at 5 min → **better** answer. Never worse. |
| **Any-space algorithm** | Can work with **arbitrarily low memory** and **guarantees optimal solutions upon termination** [01:06:14] | Trades space down, keeps optimality. |

Both are engineering answers to bounded rationality (§2): they let you *choose your point on the quality/resource curve.*

---

## 7. Grand challenges of AI [01:06:44]

| Challenge | What it demands |
|---|---|
| **Translating telephone** — Japanese speaker converses with English speaker in real time, each hearing their own language [01:06:44] | Large vocabulary; **unrehearsed continuous speech**; natural-sounding **speech synthesis that preserves speaker characteristics**; NLP that handles **ambiguity, non-grammaticality, incomplete phrases** [01:07:14] |
| **Accident-avoiding car** [01:07:14] | Advances in vision + **sensor fusion** (cameras, laser, sonar, others together); obstacle detection and avoidance [01:07:51] |
| **Learning systems** — robot learns to assemble an appliance by **watching a person** [01:07:51] | "Like a child watching you do something." Still a **holy grail**. Needs vision, language, problem solving, learning theory [01:08:29] |
| **Self-replicating systems** — for manufacturing in space [01:08:29] | Knowledge capture for **reverse engineering and replication**; robotics for **control, diagnosis, monitoring, repair** [01:09:05] |

---

## 8. Risks and benefits of AI [01:09:37]

| Risk | Mechanism described in lecture |
|---|---|
| **Lethal autonomous weapons** | A small group (e.g. terrorists) can deploy an **arbitrarily large number** of weapons against targets defined by **recognition criteria** — it sees certain people and kills automatically [01:09:37] – [01:10:08] |
| **Surveillance and persuasion** | **Massive-scale** monitoring of individuals → privacy issues; ML **tailors information flows through social media** to modify political behavior such as **voting** — "made possible in 2016... actually being used in a lot of countries" [01:10:08] – [01:11:12] |
| **Biased decision making** | Decisions biased by **race, gender, or other protected categories**. Root cause: **the data already contains the biases** — "the algorithms just learn from the data and make decisions that are biased" [01:11:12] – [01:11:50] |
| **Impact on employment** | Jobs taken over by automation — "**Will the call center industry collapse?** There are AI systems that can take over their jobs. We don't know." [01:11:50] |
| **Safety-critical applications** | Accidents by autonomous vehicles; mistakes in healthcare — **"who's going to be responsible?"** [01:11:50] – [01:12:28] |
| **Cybersecurity** | ML used to **lure users into installing malware**; ML creates "highly effective tools for **personalized blackmail**" [01:12:28] – [01:13:17] |

Note the through-line back to [00:01:17]: the lecture *opened* by defining intelligent systems as ones that act **safely, ethically, responsibly** — §8 is why that clause is in the definition.

---

## 9. Self-check questions (cover the answers)

1. Draw the 2×2 of AI definitions. Which quadrant does this course adopt, and give **two** reasons the lecture gives for rejecting the "laws of thought" quadrant.
2. Why would a machine that instantly and correctly multiplies two 10-digit numbers **fail** the Turing Test?
3. State bounded rationality's three driving factors, and define satisficing in one sentence.
4. Deep Blue examines 2×10⁸ positions/sec for 120 s. What fraction of chess's ~10¹²³ move space is that, and which law of intelligent action does this illustrate?
5. In the Sphinx-3 ablation, why does removing **syntactic** knowledge (4%→30%) hurt so much more than removing **word-frequency** knowledge (4%→6%)?
6. Which two reports triggered the AI winter, and what were the three technical failures behind it?
7. Law 2 is stated as necessary **and sufficient** — what is the lecturer's caveat about its status?
8. Distinguish an **anytime** algorithm from an **any-space** algorithm.

---

## Appendix — likely transcription slips

The transcript header warns of Whisper recognition errors. Proper names to read through when studying:

| Transcript | Almost certainly |
|---|---|
| "Makilov and Pitts" | **McCulloch** and Pitts |
| "Minsky and Edwards", "SNARK" | Minsky and **Edmonds**, **SNARC** |
| "loss of thought" | **laws of thought** |
| "modus tonens" | *modus **tollens*** |
| "Adeline" | **ADALINE** |
| "Minsky and Poppert" | Minsky and **Papert** |
| "Light Hill report" | **Lighthill** report |
| "myocin" / "dendral" | **MYCIN** / **DENDRAL** |
| "Rumenhardt" | **Rumelhart** |
| "RestNet 152" | **ResNet-152** |
| "Jopper D" | **Jeopardy!** |
| "Pension Pro" | **Pentium Pro** |
| "Zoops" | **Zoox** |
| "V star search" | **B\* search** |
| "occlusions" (at [00:29:06]) | **conclusions** |
