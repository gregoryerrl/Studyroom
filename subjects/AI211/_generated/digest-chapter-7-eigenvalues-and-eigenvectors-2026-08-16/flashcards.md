# Chapter 7 — Flashcards (26 cards)
Source: `Chapter 7 Eigenvalues And Eigenvectors - handouts.pdf`, §7.1–§7.4. Citations are `p.N → slide S`.
Deck order: §7.1 cards 1–9 · §7.2 cards 10–16 · §7.3 cards 17–24 · §7.4 + synthesis cards 25–26.

Q: State the definition of an eigenvalue and eigenvector of an n × n matrix A. Which single word carries the whole definition?
A: λ is an **eigenvalue** of A when there is a **nonzero** vector **x** with **Ax = λx**; that **x** is an **eigenvector** of A corresponding to λ.
The load-bearing word is *nonzero*: if **x** = **0** were permitted, A**0** = λ**0** holds for every scalar λ, making every number an eigenvalue of every matrix.
Geometric reading: A does not knock **x** off its own line — it only rescales it by λ.
(p.3 → slide 5)

Q: Can λ = 0 be an eigenvalue? Can **x** = **0** be an eigenvector? Give the reasoning for each, plus an instance from the handout.
A: **λ = 0 — yes.** Nothing restricts the *scalar*. A**x** = 0**x** = **0** with **x** ≠ **0** simply means A is singular. Example 7b lists a 5 × 5 diagonal matrix with eigenvalues −1, 2, **0**, −4, 3.
**x = 0 — never.** The definition explicitly demands a nonzero vector.
Memory hook: the *scalar* may vanish, the *vector* may not.
(p.3 → slide 5; p.11 → slide 22)

Q: For A = [[2, 0], [0, −1]], verify both standard basis vectors are eigenvectors. Show the multiplications and state the general pattern.
A: A(1,0)ᵀ = (2, 0)ᵀ = **2**·(1,0)ᵀ → λ₁ = 2.
A(0,1)ᵀ = (0, −1)ᵀ = **−1**·(0,1)ᵀ → λ₂ = −1.
**Pattern:** for any diagonal matrix the standard basis vectors are automatically eigenvectors, and **e**ᵢ picks off the i-th diagonal entry as its eigenvalue.
Note this is *verification*, not *finding* — given a candidate you never need the characteristic polynomial.
(p.4 → slides 7–8)

Q: State Theorem 7.1. Why must the zero vector be adjoined by hand, and what does the theorem let you then ask?
A: **Theorem 7.1 (Eigenvectors of λ Form a Subspace):** for an eigenvalue λ of an n × n matrix A, the set {**x** : **x** is an eigenvector of λ} ∪ {**0**} is a subspace of Rⁿ, called the **eigenspace** of λ.
**0** must be adjoined because it is barred from being an eigenvector, yet every subspace must contain it. Equivalently the eigenspace is the **null space of (λI − A)**, which always contains **0**.
**Payoff:** eigenvectors for one λ are closed under addition and scalar multiplication, so it becomes meaningful to ask for a **basis** and a **dimension** — and to rescale any eigenvector to a convenient multiple.
(p.5 → slide 10)

Q: A = [[−1, 0], [0, 1]] reflects vectors in the y-axis. Find its eigenvalues and eigenspaces geometrically, with no characteristic polynomial, and state the transferable rule.
A: A**v** = (−x, y) for **v** = (x, y). Ask which vectors land back on their own line:
· on the **x-axis**: (x, 0) ↦ (−x, 0) = **−1**·**v** → λ₁ = −1, eigenspace = the x-axis
· on the **y-axis**: (0, y) ↦ (0, y) = **+1**·**v** → λ₂ = +1, eigenspace = the y-axis
· anywhere else the reflection knocks **v** off its own line, so it is not an eigenvector.
**Transferable rule for any reflection:** the mirror line is fixed (λ = +1); the axis perpendicular to the mirror is flipped (λ = −1). Figure 7.1 shows exactly this.
(pp.6–7 → slides 11–13)

Q: Write the characteristic equation and characteristic polynomial of an n × n matrix A. What is the degree and what do the roots mean?
A: **Characteristic equation:** det(λI − A) = 0, written |λI − A| = 0.
**Characteristic polynomial:** |λI − A| = λⁿ + c₍n−1₎λⁿ⁻¹ + ⋯ + c₂λ² + c₁λ + c₀.
**Degree = n**, the size of the matrix. The eigenvalues of A are exactly the **real roots** of this polynomial.
(p.8 → slide 15)

Q: List the three-step procedure for finding all eigenvalues and eigenvectors. What built-in check catches an arithmetic slip in step 3?
A: **1.** Form |λI − A| = 0 — a polynomial equation of degree n in λ.
**2.** Find the real roots. These are the eigenvalues of A.
**3.** For each λᵢ, solve the homogeneous system (λᵢI − A)**x** = **0** by row reducing.
**The check:** the RREF of (λᵢI − A) **must have at least one row of zeros**. If it reduces to the identity, the only solution is **x** = **0**, so either λᵢ is not truly a root or the algebra went wrong.
(p.8 → slide 16)

Q: For A = [[2,1,0],[0,2,0],[0,0,2]], find the eigenvalues and the dimension of each eigenspace. What tension does this example expose?
A: A is triangular, so |λI − A| = **(λ − 2)³** — the only eigenvalue is λ = 2, with **multiplicity 3**.
2I − A = [[0,−1,0],[0,0,0],[0,0,0]], already in RREF, giving the single equation x₂ = 0 with x₁ = s and x₃ = t free:
**x** = s(1,0,0) + t(0,0,1), s and t not both zero → **dim(eigenspace) = 2**.
**The tension:** multiplicity 3 but only **2** independent eigenvectors. Multiplicity is an **upper bound, not a guarantee**. With 2 < n = 3, Theorem 7.5 says A is **not diagonalizable**.
(pp.9–10 → slides 17–19)

Q: State Theorem 7.3, explain why it is true, and apply it to A = [[2,0,0],[−1,1,0],[5,3,−3]].
A: **Theorem 7.3 (Eigenvalues of Triangular Matrices):** if A is an n × n **triangular** matrix, its eigenvalues are the entries on its **main diagonal**. Diagonal matrices are a special case.
**Why:** the determinant of a triangular matrix is the product of its diagonal entries, and λI − A remains triangular.
**Applied:** eigenvalues are **λ₁ = 2, λ₂ = 1, λ₃ = −3**, read straight off. Confirmed the long way by |λI − A| = (λ−2)(λ−1)(λ+3).
(p.10 → slide 20; p.11 → slides 21–22)

Q: How are eigenvalues and eigenvectors defined for a linear transformation T : V → V, and how do you compute with them?
A: λ is an eigenvalue of T when there is a **nonzero x ∈ V** with **T(x) = λx**. That **x** is an eigenvector of T corresponding to λ; all such **x** together with **0** form the eigenspace of λ.
Structurally identical to the matrix definition — matrix multiplication A**x** is simply replaced by T(**x**). In practice you compute with the **standard matrix** of T, reading each output component's coefficients as one row.
(p.12 → slide 24; p.23 → slide 45)

Q: Define a diagonalizable matrix. What exactly must P be, and why is that requirement the key to the whole section?
A: An n × n matrix A is **diagonalizable** when A is *similar* to a diagonal matrix — i.e. there exists an **invertible** matrix P such that **P⁻¹AP is diagonal**.
P must be invertible, and a square matrix is invertible **exactly when its columns are linearly independent**. That single equivalence is what converts the diagonalization question into "count the independent eigenvectors," which is Theorem 7.5.
(p.16 → slide 31)

Q: State Theorem 7.4 and use it on A = [[1,0,0],[−1,1,1],[−1,−2,4]], given that A is similar to D = diag(1,2,3). What does the theorem NOT give you?
A: **Theorem 7.4:** if A and B are similar n × n matrices, they have the **same eigenvalues**.
D is diagonal, so by Theorem 7.3 its eigenvalues are 1, 2, 3. Similarity transports them: **A has eigenvalues 1, 2, 3** with no determinant expansion. Cross-check: |λI − A| = (λ−1)(λ−2)(λ−3) ✓
**What it does not give:** the *eigenvectors* are **not** the same — they are related through the change-of-basis matrix. Only eigenvalues transfer.
(p.16 → slide 32; p.17 → slides 33–34)

Q: State Theorem 7.5 exactly, and say why the form of the statement matters.
A: **Theorem 7.5 (Condition for Diagonalization):** an n × n matrix A is diagonalizable **if and only if** it has **n linearly independent eigenvectors**.
**Why the form matters:** it is an **⟺**, so it settles the question in *both* directions. Produce n independent eigenvectors and A is definitively diagonalizable; fall short and A is definitively not. It is the only test in the chapter that can prove a negative.
(p.18 → slide 35)

Q: List the steps for diagonalizing a square matrix, and state the rule governing the order of entries in D.
A: **1.** Find n linearly independent eigenvectors **p₁**, …, **pₙ** with eigenvalues λ₁, …, λₙ. If n independent eigenvectors do not exist, A is not diagonalizable — stop.
**2.** Let P = [**p₁ p₂ … pₙ**], the eigenvectors as **columns**.
**3.** Then D = P⁻¹AP is diagonal with λ₁, …, λₙ on the main diagonal.
**Ordering rule:** the order of the eigenvectors in P determines the order of the eigenvalues in D — column i of P pairs with entry (i,i) of D. Swap two columns of P and the corresponding diagonal entries of D swap too. Neither order is "more correct," but P and D must agree.
(pp.18–19 → slides 36–37)

Q: State Theorem 7.6 and explain the single most common exam trap attached to it, citing the chapter's own two examples.
A: **Theorem 7.6 (Sufficient Condition):** if an n × n matrix A has **n distinct eigenvalues**, the corresponding eigenvectors are linearly independent and A is diagonalizable.
**The trap:** this is **sufficient but not necessary**. Repeated eigenvalues do *not* imply "not diagonalizable" — they mean "go count the independent eigenvectors."
· [[1,3,0],[3,1,0],[0,0,−2]] has char. poly (λ−4)(λ+2)²: the double root yields 2 eigenvectors, total 3 = n → **diagonalizable**.
· [[2,1,0],[0,2,0],[0,0,2]] has char. poly (λ−2)³: yields only 2 eigenvectors, total 2 < 3 → **not diagonalizable**.
(p.21 → slide 41; p.13 → slide 26; p.10 → slide 19)

Q: For a linear transformation T : V → V, when does a basis B exist making the matrix for T relative to B diagonal? Illustrate.
A: **Exactly when the standard matrix for T is diagonalizable** (p.22 → slide 44). The basis B is then the set of eigenvectors.
**Example 8:** T(x₁,x₂,x₃) = (x₁ − x₂ − x₃, x₁ + 3x₂ + x₃, −3x₁ + x₂ − x₃) has standard matrix A = [[1,−1,−1],[1,3,1],[−3,1,−1]], diagonalizable with eigenvectors (−1,0,1), (1,−1,4), (−1,1,1) for λ = 2, −2, 3. So **B** = {(−1,0,1), (1,−1,4), (−1,1,1)} and **D = diag(2, −2, 3)**.
**Interpretation:** in the eigenbasis T stops mixing coordinates — it just stretches each basis direction by its own eigenvalue.
(p.22 → slide 44; p.23 → slides 45–46)

Q: Define a symmetric matrix and state all three parts of Theorem 7.7. Which part is the strong one, and why?
A: **Definition:** a square matrix A is **symmetric** when A = Aᵀ.
**Theorem 7.7 — if A is an n × n symmetric matrix, then:**
**1.** A **is diagonalizable** (always, with no counting required).
**2.** All eigenvalues of A are **real**.
**3.** If λ is an eigenvalue of multiplicity k, then λ has **k linearly independent eigenvectors** — the eigenspace of λ has dimension exactly k.
**Part 3 is the strong one:** for symmetric matrices multiplicity always equals eigenspace dimension, so the gap seen in the (λ−2)³ example can never open — and that is *precisely why* part 1 holds.
(p.26 → slide 51; p.27 → slide 54)

Q: Name the three pathologies non-symmetric matrices can exhibit that symmetric ones cannot.
A: **1.** A non-symmetric matrix **may not be diagonalizable**.
**2.** A non-symmetric matrix can have eigenvalues that are **not real**.
**3.** For a non-symmetric matrix, the number of linearly independent eigenvectors for an eigenvalue can be **less than the multiplicity** of that eigenvalue.
Each is the exact negation of one part of Theorem 7.7 — learn the two lists as a **mirrored pair**.
(pp.26–27 → slides 52–54)

Q: Use Theorem 7.7 to get the eigenspace dimensions of A = [[1,−2,0,0],[−2,1,0,0],[0,0,1,−2],[0,0,−2,1]] without solving a single linear system.
A: A is symmetric (A = Aᵀ), so Theorem 7.7 applies.
|λI − A| = **(λ + 1)²(λ − 3)²** — the matrix is block diagonal with two copies of [[1,−2],[−2,1]], each contributing (λ−1)² − 4 = (λ−3)(λ+1).
So λ₁ = −1 and λ₂ = 3, **each of multiplicity 2** ⇒ by Theorem 7.7.3 **each eigenspace has dimension 2**, known in advance with no row reduction.
Confirmed by the bases B₁ = {(1,1,0,0), (0,0,1,1)} and B₂ = {(1,−1,0,0), (0,0,1,−1)}.
(p.28 → slides 55–56)

Q: Define an orthogonal matrix, state Theorem 7.8, and name the trap in applying it.
A: **Definition:** a square matrix P is **orthogonal** when it is invertible and **P⁻¹ = Pᵀ**.
**Theorem 7.8:** an n × n matrix P is orthogonal **if and only if** its column vectors form an **orthonormal set**.
**The trap:** *orthonormal*, not merely *orthogonal* — columns must be **mutually perpendicular AND of length 1**. Counterexample: [[1,1],[−1,1]] has perpendicular columns but each has length √2, and PPᵀ = 2I ≠ I, so it is **not** an orthogonal matrix.
**Practical check:** rather than inverting P, verify PPᵀ = I; for square matrices that is equivalent and far cheaper.
(p.29 → slide 58; pp.30–31 → slides 59–61)

Q: State Theorem 7.9 and demonstrate it on A = [[3,1],[1,3]], keeping the parameters general.
A: **Theorem 7.9:** let A be an n × n **symmetric** matrix. If λ₁ and λ₂ are **distinct** eigenvalues of A, then their eigenvectors **x₁** and **x₂** are **orthogonal**.
For A = [[3,1],[1,3]]: |λI − A| = (λ−3)² − 1 = λ² − 6λ + 8 = (λ−2)(λ−4), so λ₁ = 2 and λ₂ = 4.
Every eigenvector of λ₁ = 2 is **x₁** = (s, −s) with s ≠ 0; every eigenvector of λ₂ = 4 is **x₂** = (t, t) with t ≠ 0.
**x₁ · x₂ = st − st = 0** — zero for *every* choice of s and t, not merely for one convenient pair.
(p.31 → slide 62; p.32 → slides 63–64)

Q: State Theorem 7.10 and say precisely what its "if and only if" rules out.
A: A matrix A is **orthogonally diagonalizable** when there exists an **orthogonal** matrix P with P⁻¹AP = PᵀAP = D diagonal.
**Theorem 7.10 (Fundamental Theorem of Symmetric Matrices):** let A be an n × n matrix. A is orthogonally diagonalizable (and has real eigenvalues) **if and only if A is symmetric**.
**What the ⟺ rules out:** symmetry is not merely *sufficient* — it is the **only** route. A non-symmetric matrix can never be orthogonally diagonalized, even if it happens to be ordinarily diagonalizable. Always check A = Aᵀ *before* starting the procedure.
(p.33 → slide 66)

Q: Give the four-step procedure for orthogonally diagonalizing a symmetric matrix A. At which step does Gram-Schmidt enter, and why only there?
A: **1.** Find all eigenvalues of A and the **multiplicity** of each.
**2.** For each eigenvalue of **multiplicity 1**: find any eigenvector, then **normalize** it to unit length.
**3.** For each eigenvalue of **multiplicity k ≥ 2**: find k linearly independent eigenvectors (Theorem 7.7.3 guarantees they exist); if that set is not orthonormal, apply **Gram-Schmidt**.
**4.** Steps 2–3 give an orthonormal set of n eigenvectors; use them as the **columns** of P. Then P⁻¹AP = PᵀAP = D, with the eigenvalues of A on the main diagonal.
**Why Gram-Schmidt only at step 3:** Theorem 7.9 already makes eigenvectors from *different* eigenvalues orthogonal for free. The only place orthogonality can fail is *within* a single repeated eigenspace.
(p.34 → slides 67–68)

Q: Orthogonally diagonalize A = [[−2, 2], [2, 1]]. Show every step including the verification.
A: **Step 0 — symmetry:** entry (1,2) = 2 = entry (2,1), so A = Aᵀ and Theorem 7.10 guarantees P exists.
**Step 1 — eigenvalues:** |λI − A| = (λ+2)(λ−1) − 4 = λ² + λ − 6 = **(λ+3)(λ−2)** → λ₁ = −3, λ₂ = 2, each of multiplicity 1.
**Step 2 — eigenvectors:** −3I − A = [[−1,−2],[−2,−4]] → RREF [[1,2],[0,0]] → **(−2, 1)**; 2I − A = [[4,−2],[−2,1]] → RREF [[1,−½],[0,0]] → **(1, 2)**. Orthogonal check: (−2)(1) + (1)(2) = 0 ✓ (guaranteed by Theorem 7.9).
**Step 3 — normalize** (both multiplicities are 1, so no Gram-Schmidt): ‖(−2,1)‖ = ‖(1,2)‖ = √5, giving **p₁** = (−2/√5, 1/√5) and **p₂** = (1/√5, 2/√5).
**Step 4 — assemble and verify:** P = [[−2/√5, 1/√5], [1/√5, 2/√5]], and **PᵀAP = diag(−3, 2)** ✓
(pp.35–36 → slides 69–72)

Q: What are the four stated objectives of §7.4, and how much of the section is actually in this handout deck?
A: **The four objectives** (p.38 → slide 75): **1.** model **population growth** with an age transition matrix and an age distribution vector, and find a **stable age distribution vector**; **2.** use a matrix equation to solve a system of **first-order linear differential equations**; **3.** find the matrix of a **quadratic form** and use the **Principal Axes Theorem** to rotate axes for a conic and a quadric surface; **4.** solve a **constrained optimization** problem.
**Coverage:** essentially none. The deck ends at PDF p.38 with only the objectives slide and a "Population Growth" title slide (slide 76). The section content is **not in this PDF** — you will need another source for it.
(p.38 → slides 75–76)

Q: Summarize what changes as you move from §7.1 → §7.2 → §7.3, and what each stage is guaranteed to deliver.
A: **§7.1 — find eigenvectors:** solve |λI − A| = 0, then (λI − A)**x** = **0**. Requires nothing; **always succeeds** in producing the eigenspaces.
**§7.2 — diagonalize:** additionally assemble the eigenvectors as the **columns** of P, giving P⁻¹AP = D. **Succeeds only if** Theorem 7.5 holds (n linearly independent eigenvectors).
**§7.3 — orthogonally diagonalize:** additionally **normalize** every eigenvector and apply **Gram-Schmidt** inside any repeated eigenspace, giving PᵀAP = D. **Always succeeds when A is symmetric**, by Theorem 7.10 — and the payoff is that P⁻¹ is free, since P⁻¹ = Pᵀ.
The chapter is therefore one procedure, progressively strengthened by progressively stronger hypotheses on A.
(slide 16; slides 36–37; slides 67–68)
