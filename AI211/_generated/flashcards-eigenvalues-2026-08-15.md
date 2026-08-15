# Flashcards — Eigenvalues & Eigenvectors (22 cards)
Source: `Chapter 7 Eigenvalues And Eigenvectors - handouts.pdf`, §7.1–7.3 (PDF pp. 3–36; 2 slides per PDF page).
Citations below give **PDF page → slide number**.

Q: State the definition of an eigenvalue and eigenvector of an n×n matrix A. Which single word in the definition is load-bearing, and what breaks without it?
A: λ is an **eigenvalue** of A when there exists a **nonzero** vector x with Ax = λx; that x is an **eigenvector** of A corresponding to λ.
The load-bearing word is *nonzero*. If x = 0 were allowed, then A0 = λ0 holds for **every** scalar λ, so every number would be an eigenvalue of every matrix and the concept would be empty.
Read the equation geometrically: A does not rotate x off its own line — it only rescales it by λ.
(p.3 → slide 5)

Q: Trap: can λ = 0 be an eigenvalue? Can x = 0 be an eigenvector? Justify both answers.
A: **λ = 0: yes.** Nothing bars the *scalar* from being zero. Ax = 0x = 0 with x ≠ 0 just means A has nontrivial null space (A is singular). The handout's own Example 7b has diagonal entries −1, 2, 0, −4, 3 and lists λ₃ = **0** as a genuine eigenvalue.
**x = 0: never.** The definition explicitly demands a nonzero vector.
Memory hook: the *scalar* may vanish, the *vector* may not.
(p.3 → slide 5; p.11 → slide 22)

Q: For A = [[2, 0], [0, −1]], verify that x₁ = (1, 0) and x₂ = (0, 1) are eigenvectors. Show both multiplications and name each eigenvalue.
A: Ax₁ = [[2,0],[0,−1]]·(1,0)ᵀ = (2, 0)ᵀ = 2·(1, 0)ᵀ → **λ₁ = 2**.
Ax₂ = [[2,0],[0,−1]]·(0,1)ᵀ = (0, −1)ᵀ = −1·(0, 1)ᵀ → **λ₂ = −1**.
Pattern: for a diagonal matrix the standard basis vectors are always eigenvectors, and eᵢ picks off the i-th diagonal entry as its eigenvalue.
(p.4 → slides 7–8)

Q: A = [[−1, 0], [0, 1]] reflects every vector across the y-axis. Find its eigenvalues and eigenspaces **geometrically**, with no characteristic polynomial.
A: Av = (−x, y) for v = (x, y). Ask: which vectors land back on their own line?
· On the **x-axis**, v = (x, 0) → (−x, 0) = **−1**·v. So λ₁ = −1, eigenspace = the x-axis.
· On the **y-axis**, v = (0, y) → (0, y) = **+1**·v. So λ₂ = 1, eigenspace = the y-axis.
· Any other vector gets knocked off its own line by the reflection, so it is not an eigenvector.
Spatial picture (Figure 7.1): the mirror line itself is fixed (λ = 1); the axis perpendicular to the mirror is flipped (λ = −1).
(pp. 6–7 → slides 11–13)

Q: Theorem 7.1 — what set is guaranteed to be a subspace of Rⁿ, and why must the zero vector be added by hand?
A: For an eigenvalue λ of A, the set {x : x is an eigenvector of λ} ∪ **{0}** is a subspace of Rⁿ, called the **eigenspace** of λ.
0 must be adjoined because it is barred from being an eigenvector by definition, yet every subspace must contain the zero vector. Equivalently: the eigenspace is exactly the null space of (λI − A), which always contains 0.
Consequence you'll use constantly: eigenvectors for one λ are closed under addition and scalar multiplication, so it makes sense to ask for a **basis** and a **dimension** of an eigenspace.
(p.5 → slide 10)

Q: Write the characteristic equation and the characteristic polynomial of an n×n matrix A. What is the polynomial's degree, and what do its roots mean?
A: **Characteristic equation:** det(λI − A) = 0, written |λI − A| = 0.
**Characteristic polynomial:** |λI − A| = λⁿ + c₍n−1₎λⁿ⁻¹ + ··· + c₂λ² + c₁λ + c₀.
Degree = **n** (the size of the matrix). The eigenvalues of A are exactly the **real roots** of this polynomial.
(p.8 → slide 15)

Q: List the three-step procedure for finding all eigenvalues and eigenvectors of an n×n matrix A. What internal consistency check catches an arithmetic slip in step 3?
A: **1.** Form |λI − A| = 0 — a degree-n polynomial equation in λ.
**2.** Find the real roots. These are the eigenvalues of A.
**3.** For each λᵢ, solve the homogeneous system (λᵢI − A)x = 0 by row reducing.
**The check:** the reduced row-echelon form of (λᵢI − A) **must have at least one row of zeros**. If it row-reduces to the identity, the only solution is x = 0 — meaning either λᵢ isn't really a root or you made an arithmetic error.
(p.8 → slide 16)

Q: Fully compute the eigenvalues and eigenvectors of A = [[3, 1], [1, 3]]. Show the determinant expansion and both row reductions.
A: **Step 1:** λI − A = [[λ−3, −1], [−1, λ−3]], so |λI − A| = (λ−3)² − (−1)(−1) = (λ−3)² − 1 = λ² − 6λ + 8 = **(λ−2)(λ−4)**.
**Step 2:** λ₁ = 2, λ₂ = 4.
**Step 3a:** 2I − A = [[−1, −1], [−1, −1]] → RREF [[1, 1], [0, 0]] → x₁ + x₂ = 0 → x = s(1, −1), s ≠ 0.
**Step 3b:** 4I − A = [[1, −1], [−1, 1]] → RREF [[1, −1], [0, 0]] → x₁ = x₂ → x = t(1, 1), t ≠ 0.
Both RREFs have a zero row, as required.
(pp. 32 → slides 63–64)

Q: Theorem 7.3 — state the shortcut for triangular matrices, then apply it to A = [[2,0,0], [−1,1,0], [5,3,−3]].
A: **Theorem 7.3:** if A is an n×n **triangular** matrix, its eigenvalues are the entries on the **main diagonal**. (Diagonal matrices are a special case.)
For the given lower-triangular A: eigenvalues are **λ₁ = 2, λ₂ = 1, λ₃ = −3**, read straight off the diagonal.
Verification the long way: |λI − A| = |[[λ−2, 0, 0], [1, λ−1, 0], [−5, −3, λ+3]]| = (λ−2)(λ−1)(λ+3) — same answer.
Why it works: the determinant of a triangular matrix is the product of its diagonal entries, and λI − A stays triangular.
(p.10 → slide 20; p.11 → slides 21–22)

Q: For A = [[2,1,0], [0,2,0], [0,0,2]], find the eigenvalues and the **dimension** of each eigenspace. What is the tension in this example?
A: **Char. polynomial:** the matrix is triangular, so |λI − A| = **(λ − 2)³**; the only eigenvalue is λ = 2, with multiplicity 3.
**Eigenvectors:** 2I − A = [[0, −1, 0], [0, 0, 0], [0, 0, 0]] ⇒ the single equation −x₂ = 0, so x₂ = 0 while x₁ = s and x₃ = t stay free:
x = s(1, 0, 0) + t(0, 0, 1), s and t not both zero.
**Dimension of the eigenspace = 2.**
**The tension:** λ = 2 appears 3 times as a root (multiplicity 3) but supplies only **2** linearly independent eigenvectors. Multiplicity is an upper bound, not a guarantee — and for a 3×3 matrix, 2 independent eigenvectors is short of the 3 that Theorem 7.5 requires for diagonalizability.
(pp. 9–10 → slides 17–19; p.18 → slide 35)

Q: Find the eigenvalues and a basis for each eigenspace of A = [[1,3,0], [3,1,0], [0,0,−2]]. Then verify one basis vector by direct multiplication.
A: |λI − A| = |[[λ−1, −3, 0], [−3, λ−1, 0], [0, 0, λ+2]]| = [(λ−1)² − 9](λ+2) = **(λ − 4)(λ + 2)²**.
**λ₁ = 4** (multiplicity 1): basis B₁ = {(1, 1, 0)}.
**λ₂ = −2** (multiplicity 2): basis B₂ = {(1, −1, 0), (0, 0, 1)}.
**Verify (1, 1, 0):** A(1,1,0)ᵀ = (1+3, 3+1, 0)ᵀ = (4, 4, 0)ᵀ = 4·(1, 1, 0)ᵀ ✓.
**Verify (1, −1, 0):** A(1,−1,0)ᵀ = (1−3, 3−1, 0)ᵀ = (−2, 2, 0)ᵀ = −2·(1, −1, 0)ᵀ ✓.
Note the contrast with the previous card: here the double root λ = −2 *does* deliver 2 independent eigenvectors, so A has 3 in total and is diagonalizable.
(p.13 → slides 25–26)

Q: How are eigenvalues and eigenvectors defined for a **linear transformation** T: V → V rather than a matrix?
A: λ is an eigenvalue of T when there is a **nonzero** vector x ∈ V with **T(x) = λx**. That x is an eigenvector of T corresponding to λ, and the set of all such eigenvectors together with the zero vector is the eigenspace of λ.
Structurally identical to the matrix definition — matrix multiplication Ax is simply replaced by the transformation T(x). In practice you compute with the standard matrix of T.
(p.12 → slide 24)

Q: Define a **diagonalizable** matrix. What exactly does the matrix P have to be?
A: An n×n matrix A is **diagonalizable** when A is *similar* to a diagonal matrix — that is, when there exists an **invertible** matrix P such that **P⁻¹AP is diagonal**.
P must be invertible (nonsingular), which is precisely the condition that its columns are linearly independent — this is why the diagonalization test reduces to counting independent eigenvectors.
(p.16 → slide 31)

Q: Theorem 7.4 — what do similar matrices share? Use it to read off the eigenvalues of A = [[1,0,0], [−1,1,1], [−1,−2,4]], given that A is similar to D = diag(1, 2, 3).
A: **Theorem 7.4:** if A and B are similar n×n matrices, then they have the **same eigenvalues**.
D is diagonal, so by Theorem 7.3 its eigenvalues are its diagonal entries: 1, 2, 3. Since A is similar to D, **A has eigenvalues λ₁ = 1, λ₂ = 2, λ₃ = 3** — no determinant expansion needed.
Cross-check: computing directly gives |λI − A| = (λ−1)(λ−2)(λ−3) ✓.
(p.16 → slide 32; p.17 → slides 33–34)

Q: Theorem 7.5 — state the exact necessary-and-sufficient condition for diagonalizability.
A: An n×n matrix A is diagonalizable **if and only if it has n linearly independent eigenvectors**.
This is an *iff* — it is the definitive test in both directions. Fail to produce n independent eigenvectors and the matrix is definitively not diagonalizable (see the (λ−2)³ example, which yields only 2 for n = 3).
(p.18 → slide 35)

Q: List the steps for diagonalizing a square matrix A, and state what governs the order of the entries in D.
A: **1.** Find n linearly independent eigenvectors p₁, p₂, …, pₙ of A with corresponding eigenvalues λ₁, …, λₙ. If n independent eigenvectors do not exist, A is **not** diagonalizable — stop.
**2.** Form P = [p₁ p₂ … pₙ], the matrix whose **columns** are those eigenvectors.
**3.** Then D = P⁻¹AP is diagonal with λ₁, …, λₙ on the main diagonal.
**Ordering rule:** the order of the eigenvectors used to form P determines the order the eigenvalues appear in D. Column i of P must pair with entry (i,i) of D — swap two columns of P and the corresponding diagonal entries of D swap too.
(pp. 18–19 → slides 36–37)

Q: Show that A = [[1,−1,−1], [1,3,1], [−3,1,−1]] is diagonalizable, build P, and state D. (Given: |λI − A| = (λ−2)(λ+2)(λ−3).)
A: **Eigenvalues:** λ₁ = 2, λ₂ = −2, λ₃ = 3 — three distinct values.
**Eigenvectors** (from RREF of each λI − A): p₁ = (−1, 0, 1), p₂ = (1, −1, 4), p₃ = (−1, 1, 1).
**Check p₁:** A(−1,0,1)ᵀ = (−1−1, −1+1, 3−1)ᵀ = (−2, 0, 2)ᵀ = 2·(−1, 0, 1)ᵀ ✓
**Check p₂:** A(1,−1,4)ᵀ = (1+1−4, 1−3+4, −3−1−4)ᵀ = (−2, 2, −8)ᵀ = −2·(1, −1, 4)ᵀ ✓
**Check p₃:** A(−1,1,1)ᵀ = (−1−1−1, −1+3+1, 3+1−1)ᵀ = (−3, 3, 3)ᵀ = 3·(−1, 1, 1)ᵀ ✓
**P = [[−1, 1, −1], [0, −1, 1], [1, 4, 1]]**, which is nonsingular, so the eigenvectors are independent and A is diagonalizable.
**P⁻¹AP = D = diag(2, −2, 3)** — the eigenvalues in the same order as the columns of P.
(pp. 19–20 → slides 38–40)

Q: Theorem 7.6 gives a *sufficient* condition for diagonalization. State it — then explain the classic exam trap in one sentence.
A: **Theorem 7.6:** if an n×n matrix A has **n distinct eigenvalues**, then the corresponding eigenvectors are linearly independent and A is diagonalizable.
**The trap:** this is sufficient but **not necessary** — a matrix with repeated eigenvalues may still be diagonalizable. Compare the two worked cases: A = [[1,3,0],[3,1,0],[0,0,−2]] has the repeated eigenvalue −2 yet *is* diagonalizable (its double root yields 2 independent eigenvectors), while A = [[2,1,0],[0,2,0],[0,0,2]] has the repeated eigenvalue 2 and is *not*. So "repeated eigenvalues" ⇒ "must go count independent eigenvectors", never ⇒ "not diagonalizable".
Quick application: A = [[1,−2,1], [0,0,1], [0,0,−3]] is triangular with distinct diagonal entries 1, 0, −3, hence diagonalizable immediately.
(p.21 → slides 41–42; p.13 → slide 26; p.10 → slide 19)

Q: Define a symmetric matrix, then state all three parts of Theorem 7.7 (Properties of Symmetric Matrices).
A: **Definition:** a square matrix A is **symmetric** when A = Aᵀ.
**Theorem 7.7 —** if A is an n×n symmetric matrix, then:
**1.** A **is diagonalizable** (always — no counting required).
**2.** All eigenvalues of A are **real**.
**3.** If λ is an eigenvalue of multiplicity k, then λ has **k linearly independent eigenvectors** — i.e. the eigenspace of λ has dimension exactly k.
Property 3 is the strong one: for symmetric matrices, algebraic multiplicity always equals geometric multiplicity, which is *why* property 1 holds.
(p.26 → slide 51; p.27 → slide 54)

Q: Name the three pathologies that **non**-symmetric matrices can exhibit but symmetric ones cannot.
A: **1.** A non-symmetric matrix **may not be diagonalizable**.
**2.** A non-symmetric matrix can have eigenvalues that are **not real**.
**3.** For a non-symmetric matrix, the number of linearly independent eigenvectors for an eigenvalue can be **less than the multiplicity** of that eigenvalue.
Each is the exact negation of one part of Theorem 7.7 — learn the two lists as a mirrored pair.
(pp. 26–27 → slides 52–54)

Q: Apply Theorem 7.7 to the symmetric matrix A = [[1,−2,0,0], [−2,1,0,0], [0,0,1,−2], [0,0,−2,1]]: find the eigenvalues and the dimension of each eigenspace **without** solving any linear system.
A: |λI − A| = **(λ + 1)²(λ − 3)²**, so λ₁ = −1 and λ₂ = 3, each of **multiplicity 2**.
A is symmetric, so Theorem 7.7 part 3 guarantees each eigenspace has dimension equal to its multiplicity = **2** — no row reduction needed to know this.
The actual bases confirm it: B₁ = {(1, 1, 0, 0), (0, 0, 1, 1)} for λ = −1, and B₂ = {(1, −1, 0, 0), (0, 0, 1, −1)} for λ = 3.
Spot-check: A(1,1,0,0)ᵀ = (1−2, −2+1, 0, 0)ᵀ = (−1, −1, 0, 0)ᵀ = −1·(1, 1, 0, 0)ᵀ ✓
(p.28 → slides 55–56)

Q: Define an **orthogonal matrix** and state Theorem 7.8. Then state Theorem 7.9 about symmetric matrices.
A: **Definition:** a square matrix P is **orthogonal** when it is invertible and **P⁻¹ = Pᵀ**.
**Theorem 7.8:** an n×n matrix P is orthogonal **if and only if** its column vectors form an **orthonormal set** (mutually perpendicular, each of length 1).
**Theorem 7.9:** if A is symmetric and λ₁, λ₂ are **distinct** eigenvalues of A, then their eigenvectors x₁ and x₂ are **orthogonal**.
Worked instance of 7.9 with A = [[3,1],[1,3]]: eigenvectors are x₁ = (s, −s) for λ = 2 and x₂ = (t, t) for λ = 4, and x₁ · x₂ = st − st = **0** ✓ — orthogonal for every choice of s, t.
Practical payoff: for a symmetric matrix, eigenvectors from *different* eigenvalues are orthogonal for free; only *within* a repeated eigenvalue's eigenspace might you need Gram-Schmidt.
(p.29 → slide 58; pp. 31–32 → slides 62–64)

Q: State Theorem 7.10 (Fundamental Theorem of Symmetric Matrices) and the four-step procedure for orthogonally diagonalizing A.
A: **Theorem 7.10:** let A be an n×n matrix. A is **orthogonally diagonalizable** (and has real eigenvalues) **if and only if A is symmetric**. "Orthogonally diagonalizable" means there is an *orthogonal* P with P⁻¹AP = PᵀAP = D diagonal.
**Procedure:**
**1.** Find all eigenvalues of A and the multiplicity of each.
**2.** For each eigenvalue of **multiplicity 1**: find any eigenvector, then **normalize** it to unit length.
**3.** For each eigenvalue of **multiplicity k ≥ 2**: find k linearly independent eigenvectors (Theorem 7.7 guarantees they exist); if that set is not orthonormal, apply the **Gram-Schmidt** process.
**4.** Steps 2–3 yield an orthonormal set of n eigenvectors; use them as the columns of P. Then PᵀAP = D, with the eigenvalues of A on the main diagonal.
(p.33 → slide 66; p.34 → slides 67–68)

Q: Find an orthogonal matrix P that orthogonally diagonalizes A = [[−2, 2], [2, 1]]. Show every step, including the final verification.
A: **1. Eigenvalues:** |λI − A| = |[[λ+2, −2], [−2, λ−1]]| = (λ+2)(λ−1) − 4 = λ² + λ − 6 = **(λ+3)(λ−2)** → λ₁ = −3, λ₂ = 2.
**2. Eigenvectors:**
· −3I − A = [[−1, −2], [−2, −4]] → RREF [[1, 2], [0, 0]] → x₁ = −2x₂ → **(−2, 1)**
· 2I − A = [[4, −2], [−2, 1]] → RREF [[1, −½], [0, 0]] → x₁ = ½x₂ → **(1, 2)**
These are orthogonal: (−2)(1) + (1)(2) = 0 ✓ (guaranteed by Theorem 7.9, since A is symmetric with distinct eigenvalues).
**3. Normalize** (both multiplicities are 1, so no Gram-Schmidt): ‖(−2,1)‖ = ‖(1,2)‖ = √5, so p₁ = (−2/√5, 1/√5) and p₂ = (1/√5, 2/√5).
**4. Assemble:** P = [[−2/√5, 1/√5], [1/√5, 2/√5]].
**Verify:** PᵀAP = **[[−3, 0], [0, 2]]** = diag(λ₁, λ₂) ✓
(pp. 35–36 → slides 69–72)
