# Chapter 7 — Eigenvalues and Eigenvectors — Structured Notes

**Source:** `Chapter 7 Eigenvalues And Eigenvectors - handouts.pdf` (38 PDF pages, 2 slides per page).
**Citation format below:** `p.N → slide S`. Slide S sits on PDF page ⌈S/2⌉.

---

## 0. Map of the chapter

```
                        ┌──────────────────────────┐
                        │      A x = λ x,  x ≠ 0   │   ← the whole chapter grows from here
                        └────────────┬─────────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
   §7.1 FIND THEM              §7.2 USE THEM               §7.3 BEST CASE
   ───────────────             ───────────────             ───────────────
   det(λI − A) = 0             P⁻¹AP = D                   A = Aᵀ (symmetric)
   eigenspaces (Thm 7.1)       Thm 7.4 similar             Thm 7.7  always works
   Thm 7.3 triangular          Thm 7.5 iff n indep.        Thm 7.9  ⊥ eigenvectors
   linear transformations      Thm 7.6 n distinct          Thm 7.10 ⟺ symmetric
                                                           PᵀAP = D
                                     │
                             §7.4 APPLICATIONS
                             (objectives only in this deck)
```

**Section page ranges in this PDF**

| Section | Title | PDF pages | Slides |
|---|---|---|---|
| §7.1 | Eigenvalues and Eigenvectors | 1–13 | 1–26 |
| §7.2 | Diagonalization | 14–23 | 27–46 |
| §7.3 | Symmetric Matrices and Orthogonal Diagonalization | 24–36 | 47–72 |
| §7.4 | Applications of Eigenvalues and Eigenvectors | 37–38 | 73–76 (objectives only) |

---

## 1. §7.1 — Eigenvalues and Eigenvectors

### 1.1 Stated objectives (p.2 → slide 3)

1. Verify eigenvalues and corresponding eigenvectors.
2. Find eigenvalues and corresponding eigenspaces.
3. Use the characteristic equation to find eigenvalues and eigenvectors; find the eigenvalues and eigenvectors of a **triangular** matrix.
4. Find the eigenvalues and eigenvectors of a **linear transformation**.

### 1.2 The definition (p.3 → slide 5)

> ┌─────────────────────────────────────────────────────────────────┐
> │ Let A be an n × n matrix. The scalar λ is an **eigenvalue** of A │
> │ when there is a ***nonzero*** vector **x** such that A**x** = λ**x**. │
> │ The vector **x** is an **eigenvector** of A corresponding to λ.  │
> └─────────────────────────────────────────────────────────────────┘

**Reading the equation:** A does not knock **x** off its own line. It only rescales it by λ.

**The word doing all the work is *nonzero*.**

| Question | Answer | Why |
|---|---|---|
| Can λ = 0? | **Yes** | Nothing bars the *scalar* from being 0. Example 7b lists λ₃ = 0 outright (p.11 → slide 22). |
| Can **x** = **0**? | **Never** | A**0** = λ**0** for *every* λ, so allowing it would make every scalar an eigenvalue of every matrix. |

### 1.3 Eigenspaces — Theorem 7.1 (p.5 → slide 10)

> **Theorem 7.1 (Eigenvectors of λ Form a Subspace).** If A is an n × n matrix with eigenvalue λ,
> then `{x : x is an eigenvector of λ} ∪ {0}` is a subspace of Rⁿ. This subspace is the
> **eigenspace** of λ.

- **0** must be adjoined *by hand* — it is barred from being an eigenvector, yet every subspace must contain it.
- Equivalently: the eigenspace of λ is the **null space of (λI − A)**, which always contains **0**.
- **Payoff:** eigenvectors for one λ are closed under addition and scalar multiplication ⇒ it makes sense to ask for a **basis** and a **dimension**.

### 1.4 The geometric view — Example 3 (pp.6–7 → slides 11–13)

`A = [[−1, 0], [0, 1]]` reflects vectors in the y-axis: A**v** = (−x, y).

```
              y                     Which vectors land back on their OWN line?
    (−x,y) ●  │  ● (x,y)
           ╲  │  ╱                  · on x-axis:  (x,0) ↦ (−x,0) = −1·v   → λ₁ = −1
            ╲ │ ╱                   · on y-axis:  (0,y) ↦ ( 0,y) = +1·v   → λ₂ = +1
             ╲│╱                    · anywhere else: knocked off its line → NOT an eigenvector
   ───●───────┼───────●─── x
   (−x,0)     │     (x,0)           eigenspace(−1) = the x-axis
              │                     eigenspace(+1) = the y-axis
```

**Mnemonic for any reflection:** the *mirror line* is fixed (λ = +1); the axis *perpendicular* to the mirror is flipped (λ = −1). Figure 7.1 in the handout shows exactly this.

### 1.5 The characteristic equation (p.8 → slide 15)

| Name | Statement |
|---|---|
| **Characteristic equation** | `det(λI − A) = 0`, written `|λI − A| = 0` |
| **Characteristic polynomial** | `|λI − A| = λⁿ + c_{n−1}λⁿ⁻¹ + ⋯ + c₂λ² + c₁λ + c₀` |
| Degree | **n** — the size of the matrix |
| Meaning of roots | The eigenvalues of A are exactly the **real roots** of this polynomial |

### 1.6 The procedure (p.8 → slide 16)

```
 STEP 1  Form  |λI − A| = 0                    → a degree-n polynomial equation in λ
 STEP 2  Find the real roots                   → these ARE the eigenvalues of A
 STEP 3  For each λᵢ, solve (λᵢI − A)x = 0     → row reduce; these ARE the eigenvectors
         ┌──────────────────────────────────────────────────────────────┐
         │ SELF-CHECK: the RREF of (λᵢI − A) MUST have at least one row │
         │ of zeros. If it reduces to I, the only solution is x = 0 —   │
         │ so either λᵢ is not really a root, or you slipped in algebra.│
         └──────────────────────────────────────────────────────────────┘
```

### 1.7 Multiplicity — the central tension (Example 5, pp.9–10 → slides 17–19)

`A = [[2,1,0],[0,2,0],[0,0,2]]` — triangular, so `|λI − A| = (λ − 2)³`.

```
 2I − A = [[0,−1,0],          single equation: −x₂ = 0
           [0, 0,0],          ⇒ x₂ = 0,  x₁ = s free,  x₃ = t free
           [0, 0,0]]          ⇒ x = s(1,0,0) + t(0,0,1)

 λ = 2 appears 3 times as a root  ─────►  multiplicity 3
 λ = 2 supplies 2 independent eigenvectors ─────►  eigenspace dimension 2
                                                    ▲
                                    THE GAP: 2 < 3. Multiplicity is an
                                    UPPER BOUND, not a guarantee.
```

Contrast with **Example 8** (p.13 → slides 25–26), where the double root *does* deliver:

| Matrix | Char. polynomial | Repeated λ | Eigenspace dim | Independent eigenvectors total |
|---|---|---|---|---|
| `[[2,1,0],[0,2,0],[0,0,2]]` | (λ−2)³ | 2 (mult 3) | **2** | 2 < 3 ⇒ **fails** Thm 7.5 |
| `[[1,3,0],[3,1,0],[0,0,−2]]` | (λ−4)(λ+2)² | −2 (mult 2) | **2** | 1 + 2 = 3 ⇒ **passes** Thm 7.5 |

**Learn these two side by side.** They are the chapter's whole point about repeated eigenvalues.

### 1.8 Triangular shortcut — Theorem 7.3 (p.10 → slide 20)

> **Theorem 7.3.** If A is an n × n **triangular** matrix, then its eigenvalues are the entries on its **main diagonal**.

- Works for upper triangular, lower triangular, and diagonal.
- **Why:** det of a triangular matrix = product of diagonal entries, and `λI − A` stays triangular.
- Example 7a (p.11 → slide 21): `[[2,0,0],[−1,1,0],[5,3,−3]]` → λ = 2, 1, −3 — confirmed the long way by `|λI − A| = (λ−2)(λ−1)(λ+3)`.
- Example 7b: 5 × 5 diagonal with entries −1, 2, 0, −4, 3 → those *are* the eigenvalues (note **0** among them).

### 1.9 Linear transformations (p.12 → slide 24)

> λ is an eigenvalue of a linear transformation `T : V → V` when there is a **nonzero** **x** with **T(x) = λx**.
> **x** is an eigenvector of T; all such **x** together with **0** form the eigenspace of λ.

Structurally identical — matrix multiplication `Ax` is simply replaced by `T(x)`. In practice you compute with the **standard matrix** of T.

---

## 2. §7.2 — Diagonalization

### 2.1 Stated objectives (p.15 → slide 29)

1. Find the eigenvalues of similar matrices; determine whether A is diagonalizable; find P such that `P⁻¹AP` is diagonal.
2. For `T : V → V`, find a basis B for V such that the matrix for T relative to B is diagonal.

### 2.2 The definition (p.16 → slide 31)

> ┌────────────────────────────────────────────────────────────────────┐
> │ An n × n matrix A is **diagonalizable** when A is *similar* to a    │
> │ diagonal matrix — i.e. there exists an **invertible** matrix P such │
> │ that `P⁻¹AP` is a diagonal matrix.                                  │
> └────────────────────────────────────────────────────────────────────┘

**Why "invertible" matters:** P invertible ⟺ columns of P linearly independent. That single fact is what turns the diagonalization question into *"count the independent eigenvectors."*

### 2.3 The theorem stack

| Theorem | Statement | Logical strength |
|---|---|---|
| **7.4** (p.16 → slide 32) | If A and B are similar n × n matrices, they have the **same eigenvalues**. | one-way tool |
| **7.5** (p.18 → slide 35) | A is diagonalizable **if and only if** it has **n linearly independent eigenvectors**. | ⟺ **definitive test** |
| **7.6** (p.21 → slide 41) | If A has **n distinct eigenvalues**, its eigenvectors are independent and A is diagonalizable. | ⇒ **sufficient only** |

```
   n distinct eigenvalues  ──(Thm 7.6)──►  diagonalizable
            ▲                                    ▲
            │  NOT reversible!                   │  ⟺ (Thm 7.5)
            └────────── ✗ ──────────  n linearly independent eigenvectors
```

> **⚠ THE #1 EXAM TRAP.** Theorem 7.6 is **sufficient, not necessary**.
> "Repeated eigenvalues" does **not** mean "not diagonalizable" — it means
> *"go count the independent eigenvectors."* See the §1.7 comparison table.

### 2.4 Theorem 7.4 in action — Example 2 (p.17 → slides 33–34)

`A = [[1,0,0],[−1,1,1],[−1,−2,4]]` is similar to `D = diag(1,2,3)`.
D is diagonal ⇒ (Thm 7.3) its eigenvalues are 1, 2, 3 ⇒ (Thm 7.4) **A has eigenvalues 1, 2, 3** with no determinant expansion at all.
Cross-check: `|λI − A| = (λ−1)(λ−2)(λ−3)` ✓

### 2.5 Steps for diagonalizing (pp.18–19 → slides 36–37)

```
 STEP 1  Find n linearly independent eigenvectors p₁, …, pₙ with eigenvalues λ₁, …, λₙ.
         ✗ If n independent eigenvectors do not exist → A is NOT diagonalizable. STOP.
 STEP 2  Let P = [p₁ p₂ … pₙ]  — the eigenvectors as COLUMNS.
 STEP 3  Then D = P⁻¹AP is diagonal with λ₁, …, λₙ on its main diagonal.

         ORDERING RULE (slide 37): the order of the eigenvectors in P determines
         the order of the eigenvalues in D.
                    P = [ p₁ | p₂ | p₃ ]        D = diag(λ₁, λ₂, λ₃)
                          │    │    │                 │    │    │
                          └────┼────┼─────────────────┘    │    │
                               └────┼──────────────────────┘    │
                                    └───────────────────────────┘
         Column i of P pairs with entry (i,i) of D. Swap two columns of P
         and the corresponding diagonal entries of D swap too.
```

### 2.6 Diagonalization and linear transformations (p.22 → slide 44)

> **Question.** For `T : V → V`, does there exist a basis B for V such that the matrix for T relative to B is diagonal?
> **Answer.** "Yes" exactly when the **standard matrix for T is diagonalizable**.

Example 8 (p.23 → slides 45–46): `T(x₁,x₂,x₃) = (x₁ − x₂ − x₃, x₁ + 3x₂ + x₃, −3x₁ + x₂ − x₃)`
has standard matrix `A = [[1,−1,−1],[1,3,1],[−3,1,−1]]`. Reusing the three eigenvectors from Example 4:
`B = {(−1,0,1), (1,−1,4), (−1,1,1)}` and the matrix for T relative to B is `D = diag(2, −2, 3)`.

---

## 3. §7.3 — Symmetric Matrices and Orthogonal Diagonalization

### 3.1 Stated objectives (p.25 → slide 49)

1. Recognize and apply properties of **symmetric** matrices.
2. Recognize and apply properties of **orthogonal** matrices.
3. Find an orthogonal matrix P that **orthogonally diagonalizes** a symmetric matrix A.

### 3.2 Symmetric matrices (p.26 → slide 51)

> **Definition.** A square matrix A is **symmetric** when it equals its transpose: `A = Aᵀ`.

Example 1 (p.26 → slide 52): `A = [[0,1,−2],[1,3,0],[−2,0,5]]` and `B = [[4,3],[3,1]]` are symmetric;
`C = [[3,2,1],[1,−4,0],[1,0,5]]` is **not** (entry (1,2) = 2 but entry (2,1) = 1).

### 3.3 The mirrored pair — pathologies vs guarantees

| **NON-symmetric matrices may…** (pp.26–27 → slides 52–53) | **Theorem 7.7 — symmetric matrices always…** (p.27 → slide 54) |
|---|---|
| 1. fail to be diagonalizable | 1. **are diagonalizable** |
| 2. have eigenvalues that are **not real** | 2. have **all eigenvalues real** |
| 3. have fewer independent eigenvectors than the multiplicity of an eigenvalue | 3. have, for λ of multiplicity k, exactly **k linearly independent eigenvectors** — the eigenspace of λ has **dimension k** |

Each column is the exact negation of the other. **Learn them as a mirrored pair.**

> **Property 3 is the strong one.** For symmetric matrices, multiplicity always equals eigenspace
> dimension — which is *precisely why* property 1 holds. The gap of §1.7 can never open.

**Example 3** (p.28 → slides 55–56) — apply Thm 7.7 with **no row reduction at all**:

`A = [[1,−2,0,0],[−2,1,0,0],[0,0,1,−2],[0,0,−2,1]]` → `|λI − A| = (λ+1)²(λ−3)²`
λ₁ = −1 and λ₂ = 3, **each of multiplicity 2** ⇒ by Thm 7.7.3 each eigenspace has **dimension 2**, known in advance.
Confirmed by the bases `B₁ = {(1,1,0,0), (0,0,1,1)}` and `B₂ = {(1,−1,0,0), (0,0,1,−1)}`.

### 3.4 Orthogonal matrices (p.29 → slide 58)

> **Definition.** A square matrix P is **orthogonal** when it is invertible and `P⁻¹ = Pᵀ`.
>
> **Theorem 7.8.** An n × n matrix P is orthogonal **if and only if** its column vectors form an **orthonormal set**.

> **⚠ TRAP.** *Orthonormal*, not merely *orthogonal*. Columns must be **mutually perpendicular AND
> of length 1**. `[[1,1],[−1,1]]` has perpendicular columns but `PPᵀ = 2I ≠ I` — not an orthogonal matrix.

Example 5 (pp.30–31 → slides 59–61) verifies both characterizations on the same P: first `PPᵀ = I₃`, then
`p₁·p₂ = p₁·p₃ = p₂·p₃ = 0` and `‖p₁‖ = ‖p₂‖ = ‖p₃‖ = 1`.

### 3.5 Theorem 7.9 — why principal directions are perpendicular (p.31 → slide 62)

> **Theorem 7.9.** Let A be an n × n **symmetric** matrix. If λ₁ and λ₂ are **distinct** eigenvalues of A,
> then their corresponding eigenvectors **x₁** and **x₂** are **orthogonal**.

Example 6 (p.32 → slides 63–64): `A = [[3,1],[1,3]]`, `|λI − A| = (λ−2)(λ−4)`.
Every eigenvector of λ=2 has the form `x₁ = (s, −s)`, s ≠ 0; every eigenvector of λ=4 has the form `x₂ = (t, t)`, t ≠ 0.
Then `x₁ · x₂ = st − st = 0` — orthogonal for **every** choice of s and t.

**Practical payoff:**

```
 DIFFERENT eigenvalues → orthogonality is FREE (Thm 7.9)
 SAME eigenvalue (multiplicity ≥ 2) → you may need GRAM-SCHMIDT inside that one eigenspace
```

### 3.6 Theorem 7.10 — the Fundamental Theorem (p.33 → slide 66)

> A matrix A is **orthogonally diagonalizable** when there exists an **orthogonal** matrix P with `P⁻¹AP = PᵀAP = D` diagonal.
>
> **Theorem 7.10 (Fundamental Theorem of Symmetric Matrices).** Let A be an n × n matrix. Then A is
> orthogonally diagonalizable (and has real eigenvalues) **if and only if A is symmetric**.

This is an **⟺**. Symmetry is not just enough — it is the *only* way to get orthogonal diagonalizability.
(Elsewhere this same result is called the **spectral theorem**.)

### 3.7 The orthogonal diagonalization procedure (p.34 → slides 67–68)

```
 STEP 1  Find all eigenvalues of A and the MULTIPLICITY of each.
              │
              ├─── multiplicity 1 ──► STEP 2  Find any eigenvector, then NORMALIZE it
              │                                (divide by its length).
              │
              └─── multiplicity k ≥ 2 ──► STEP 3  Find k linearly independent eigenvectors
                                           (Thm 7.7.3 guarantees they exist).
                                           If that set is not orthonormal → GRAM-SCHMIDT.
              │
 STEP 4  Steps 2–3 produce an orthonormal set of n eigenvectors.
         Use them as the COLUMNS of P.  Then  P⁻¹AP = PᵀAP = D,
         with the eigenvalues of A on the main diagonal.
```

**Difference from ordinary diagonalization (§7.2):** identical up to Step 2, then you additionally
**normalize** every eigenvector and **orthogonalize within repeated eigenspaces**. The reward is that
`P⁻¹` becomes free — it is just `Pᵀ`.

---

## 4. §7.4 — Applications (p.38 → slide 75)

**This deck contains only the objectives slide and a "Population Growth" title slide (slide 76). The section content is not in this PDF.** Stated objectives:

1. Model **population growth** using an age transition matrix and an age distribution vector; find a **stable age distribution vector**.
2. Use a matrix equation to solve a system of **first-order linear differential equations**.
3. Find the matrix of a **quadratic form** and use the **Principal Axes Theorem** to perform a rotation of axes for a conic and a quadric surface.
4. Solve a **constrained optimization** problem.

> **Note.** Objectives 3 and 4 are the machinery behind PCA: `bᵀSb` is a quadratic form, and
> `max bᵀSb subject to ‖b‖ = 1` is the constrained optimization whose Lagrange condition is
> exactly `Sb = λb`. If you need that bridge, `mml-book.pdf` §10.2 covers it.

---

## 5. Master theorem index

| # | Name | Statement (compressed) | Page → slide |
|---|---|---|---|
| 7.1 | Eigenvectors of λ Form a Subspace | eigenvectors of λ, plus **0**, form a subspace = the eigenspace | p.5 → 10 |
| 7.3 | Eigenvalues of Triangular Matrices | eigenvalues = main-diagonal entries | p.10 → 20 |
| 7.4 | Similar Matrices Have the Same Eigenvalues | A ~ B ⇒ same eigenvalues | p.16 → 32 |
| 7.5 | Condition for Diagonalization | diagonalizable **⟺** n linearly independent eigenvectors | p.18 → 35 |
| 7.6 | Sufficient Condition for Diagonalization | n **distinct** eigenvalues **⇒** diagonalizable | p.21 → 41 |
| 7.7 | Properties of Symmetric Matrices | diagonalizable · real eigenvalues · dim eigenspace = multiplicity | p.27 → 54 |
| 7.8 | Property of Orthogonal Matrices | P orthogonal **⟺** columns orthonormal | p.29 → 58 |
| 7.9 | Property of Symmetric Matrices | symmetric + distinct λ **⇒** eigenvectors orthogonal | p.31 → 62 |
| 7.10 | Fundamental Theorem of Symmetric Matrices | orthogonally diagonalizable **⟺** symmetric | p.33 → 66 |

*(Theorem 7.2 is not shown in this handout deck.)*

---

## 6. One-page decision procedure

```
 GIVEN a square matrix A
   │
   ├─ Is A triangular or diagonal? ──YES──► eigenvalues = diagonal entries (Thm 7.3). Skip to ▼
   │
   └─NO─► expand |λI − A| = 0, take the real roots                       (slide 15)
   │
   ▼
 Is A symmetric (A = Aᵀ)?
   │
   ├─YES─► Thm 7.7: diagonalizable, real eigenvalues, dim = multiplicity — GUARANTEED.
   │        Want an ORTHOGONAL P? Normalize each eigenvector; Gram-Schmidt inside
   │        repeated eigenspaces (slides 67–68). Then P⁻¹ = Pᵀ and PᵀAP = D.
   │
   └─NO──► Count linearly independent eigenvectors.
            │
            ├─ n distinct eigenvalues? ──YES──► diagonalizable (Thm 7.6). Done.
            │
            └─ repeated eigenvalues? ──► ⚠ DO NOT CONCLUDE ANYTHING YET.
                     For each repeated λ, row reduce (λI − A) and count free variables.
                     │
                     ├─ total independent eigenvectors = n ──► diagonalizable (Thm 7.5)
                     └─ total < n ─────────────────────────► NOT diagonalizable (Thm 7.5)
```
