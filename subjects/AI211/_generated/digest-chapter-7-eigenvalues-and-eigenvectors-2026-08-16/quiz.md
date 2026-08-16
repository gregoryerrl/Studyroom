# Chapter 7 — Exam-Style Quiz (20 questions)

**Source:** `Chapter 7 Eigenvalues And Eigenvectors - handouts.pdf`, §7.1–§7.4.
**Instructions:** work each question fully on paper *before* scrolling. Several questions are traps —
they look like one-line recalls and are not. Answers with complete reasoning are at the end.

Suggested timing: Part A 10 min · Part B 40 min · Part C 20 min · Part D 15 min.

---

## Part A — Rapid checks (5 questions)

**1.** State the definition of an eigenvalue and eigenvector of an n × n matrix A. Then explain in one
sentence what would go wrong if the definition omitted the word *nonzero*.

**2.** Decide each, with justification:
&nbsp;&nbsp;(a) Can 0 be an eigenvalue of a matrix?
&nbsp;&nbsp;(b) Can **0** be an eigenvector of a matrix?

**3.** Find all eigenvalues of `A = [[5,0,0],[2,−1,0],[7,3,4]]`. State the theorem you used and say in one
sentence why that theorem is true.

**4.** Verify that **x** = (1, −1) is an eigenvector of `A = [[3,1],[1,3]]` and state its eigenvalue.
Show the multiplication.

**5.** Theorem 7.1 says the eigenvectors of λ **together with 0** form a subspace of Rⁿ. Is the set of
eigenvectors *alone* (without **0**) a subspace? Explain.

---

## Part B — Computation (7 questions)

**6.** For `A = [[−2, 2], [2, 1]]`:
&nbsp;&nbsp;(a) find the characteristic polynomial and the eigenvalues;
&nbsp;&nbsp;(b) find an eigenvector for each eigenvalue by row reduction;
&nbsp;&nbsp;(c) verify without further computation that the two eigenvectors are orthogonal, citing a theorem.

**7.** For `A = [[1,3,0],[3,1,0],[0,0,−2]]`, find the characteristic polynomial, all eigenvalues with
their multiplicities, and a basis for each eigenspace. State the dimension of each eigenspace.

**8.** For `A = [[2,1,0],[0,2,0],[0,0,2]]`, find the eigenvalues, the dimension of each eigenspace, and
decide whether A is diagonalizable. Justify the final decision by a named theorem.

**9.** Given that the characteristic polynomial of `A = [[1,−1,−1],[1,3,1],[−3,1,−1]]` is
`(λ − 2)(λ + 2)(λ − 3)`, diagonalize A: produce a matrix P and the resulting D. Then state what D would
become if you had listed the eigenvectors in the reverse order.

**10.** *(No matrix from the handout — transfer test.)* For `A = [[4, −2], [1, 1]]`, find the eigenvalues
and eigenvectors from scratch, decide whether A is diagonalizable, and if so exhibit P and D.

**11.** Orthogonally diagonalize `A = [[3,1],[1,3]]`. Give the orthogonal matrix P explicitly and state
what PᵀAP equals. At which step of the §7.3 procedure did you *not* need Gram-Schmidt, and why?

**12.** For the symmetric matrix `A = [[1,−2,0,0],[−2,1,0,0],[0,0,1,−2],[0,0,−2,1]]`, the characteristic
polynomial is `(λ + 1)²(λ − 3)²`. State the dimension of each eigenspace **without solving any linear
system**, and name the exact result that licenses this.

---

## Part C — Conceptual traps (5 questions)

**13.** True or false, with justification: *"If an n × n matrix has a repeated eigenvalue, it is not
diagonalizable."* Support your answer with **two** matrices from Chapter 7 that point in opposite
directions.

**14.** Theorem 7.4 states that similar matrices have the same eigenvalues. Is the converse true — must
two matrices with the same eigenvalues be similar? Justify using matrices you have already met.

**15.** Is `P = [[1, 1], [−1, 1]]` an orthogonal matrix? Compute PPᵀ and explain precisely which
condition of Theorem 7.8 fails. How would you repair the matrix?

**16.** In the orthogonal diagonalization procedure, Gram-Schmidt appears only in step 3, for eigenvalues
of multiplicity k ≥ 2. Explain why it is never needed for eigenvectors belonging to *different*
eigenvalues.

**17.** A student computes the eigenvalues of a 3 × 3 matrix, picks λ₁, and row reduces (λ₁I − A) to
`[[1,0,0],[0,1,0],[0,0,1]]`. They conclude the eigenspace of λ₁ is {**0**}. What has actually gone wrong,
and which check in the handout's procedure should have caught it?

---

## Part D — Synthesis (3 questions)

**18.** A 5 × 5 matrix A has characteristic polynomial `(λ − 1)²(λ − 5)³`.
&nbsp;&nbsp;(a) If dim(eigenspace of λ=1) = 2 and dim(eigenspace of λ=5) = 2, is A diagonalizable?
&nbsp;&nbsp;(b) If instead dim(eigenspace of λ=5) = 3, is A diagonalizable?
&nbsp;&nbsp;(c) Now suppose additionally that A is **symmetric**. Which of (a) and (b) is even possible, and why?

**19.** Lay out the logical chain from "A is symmetric" to "PᵀAP = D with P orthogonal," naming every
theorem used and stating what each one contributes. Where in this chain would a *non*-symmetric matrix
break down?

**20.** §7.4 lists four objectives. Name them, and state how much of §7.4 is actually contained in this
handout PDF.

---
---

## Answers

### Part A

**1.** Let A be an n × n matrix. The scalar λ is an **eigenvalue** of A when there is a **nonzero** vector
**x** such that **Ax = λx**; that **x** is an **eigenvector** of A corresponding to λ. *(p.3 → slide 5)*

Without *nonzero*: A**0** = λ**0** = **0** holds for **every** scalar λ, so every number would be an
eigenvalue of every matrix and the definition would carry no information at all.

---

**2. (a) Yes — 0 can be an eigenvalue.** Nothing in the definition restricts the *scalar*. A**x** = 0**x**
= **0** with **x** ≠ **0** simply says A has a nontrivial null space, i.e. A is singular. The handout's
Example 7b gives a 5 × 5 diagonal matrix with eigenvalues −1, 2, **0**, −4, 3 *(p.11 → slide 22)*.

**(b) No — 0 can never be an eigenvector.** The definition explicitly requires a nonzero vector, for the
reason in Q1.

Memory hook: **the scalar may vanish, the vector may not.**

---

**3.** A is **lower triangular**, so by **Theorem 7.3 (Eigenvalues of Triangular Matrices)** *(p.10 →
slide 20)* the eigenvalues are the main-diagonal entries:
```
 λ₁ = 5,   λ₂ = −1,   λ₃ = 4
```
**Why the theorem holds:** the determinant of a triangular matrix is the product of its diagonal entries,
and λI − A remains triangular, so |λI − A| = (λ−5)(λ+1)(λ−4) factors immediately.

---

**4.**
```
 A x = [3  1] [ 1]  =  [3 − 1]  =  [ 2]  =  2 · [ 1]
       [1  3] [−1]     [1 − 3]     [−2]        [−1]
```
The output is a scalar multiple of the input, so **x** = (1, −1) is an eigenvector with eigenvalue
**λ = 2**. *(Consistent with Example 6, p.32 → slides 63–64, where eigenvectors of λ = 2 have the form
(s, −s).)*

---

**5. No.** Every subspace must contain the zero vector, but **0** is explicitly *excluded* from being an
eigenvector. So the set of eigenvectors alone fails the very first subspace requirement — which is exactly
why Theorem 7.1 adjoins **{0}** by hand *(p.5 → slide 10)*.

Equivalently: the eigenspace is the **null space of (λI − A)**, and a null space always contains **0**.

---

### Part B

**6. (a)**
```
              | λ+2   −2  |
 |λI − A|  =  |  −2  λ−1  |  =  (λ+2)(λ−1) − (−2)(−2)
           =  λ² + λ − 2 − 4  =  λ² + λ − 6  =  (λ + 3)(λ − 2)
```
**λ₁ = −3, λ₂ = 2.**

**(b)**
```
 −3I − A = [−1  −2]  ──►  RREF [1  2]   ⇒ x₁ = −2x₂ ⇒ take x₂ = 1 ⇒  (−2, 1)
           [−2  −4]              [0  0]

  2I − A = [ 4  −2]  ──►  RREF [1  −½]  ⇒ x₁ = ½x₂  ⇒ take x₂ = 2 ⇒  ( 1, 2)
           [−2   1]              [0   0]
```
Both RREFs contain a zero row, as the procedure requires *(slide 16)*.

**(c)** A is **symmetric** (entry (1,2) = 2 = entry (2,1)) and λ₁ ≠ λ₂, so by **Theorem 7.9** *(p.31 →
slide 62)* the eigenvectors **must** be orthogonal — no computation needed. (Confirming anyway:
(−2)(1) + (1)(2) = 0 ✓)

---

**7.** Expand along the third row/column, which is nearly empty:
```
              | λ−1   −3     0  |
 |λI − A|  =  |  −3  λ−1     0  |  =  [ (λ−1)² − 9 ] (λ + 2)
              |   0    0   λ+2  |

 (λ−1)² − 9 = (λ − 1 − 3)(λ − 1 + 3) = (λ − 4)(λ + 2)

 ⇒  |λI − A| = (λ − 4)(λ + 2)²
```
| Eigenvalue | Multiplicity | Basis for eigenspace | Dimension |
|---|---|---|---|
| λ₁ = 4 | 1 | B₁ = {(1, 1, 0)} | 1 |
| λ₂ = −2 | 2 | B₂ = {(1, −1, 0), (0, 0, 1)} | 2 |

Verification: A(1,1,0)ᵀ = (4,4,0)ᵀ = 4(1,1,0)ᵀ ✓ · A(1,−1,0)ᵀ = (−2,2,0)ᵀ = −2(1,−1,0)ᵀ ✓ ·
A(0,0,1)ᵀ = (0,0,−2)ᵀ = −2(0,0,1)ᵀ ✓ *(p.13 → slides 25–26)*

---

**8.** A is triangular, so |λI − A| = **(λ − 2)³**; the only eigenvalue is **λ = 2, multiplicity 3**.
```
 2I − A = [0  −1  0]      already RREF, two zero rows ✓
          [0   0  0]      only equation: −x₂ = 0
          [0   0  0]      ⇒ x₂ = 0,  x₁ = s free,  x₃ = t free

 x = s(1, 0, 0) + t(0, 0, 1)      ⇒  dim(eigenspace) = 2
```
**A is NOT diagonalizable.** By **Theorem 7.5** *(p.18 → slide 35)*, an n × n matrix is diagonalizable
**iff** it has n linearly independent eigenvectors. Here n = 3 but A supplies only **2**, so the "only if"
direction of Theorem 7.5 rules A out definitively. *(pp.9–10 → slides 17–19)*

**The lesson:** multiplicity 3 delivered only dimension 2 — multiplicity is an **upper bound**, not a
guarantee.

---

**9.** Eigenvalues: **λ₁ = 2, λ₂ = −2, λ₃ = 3** (three distinct values, so Theorem 7.6 already guarantees
diagonalizability — but you still need the eigenvectors to build P).
```
 2I − A = [ 1   1   1]              [1  0  1]
          [−1  −1  −1]  ──RREF──►   [0  1  0]   ⇒ x₁ = −x₃, x₂ = 0  ⇒  p₁ = (−1, 0, 1)
          [ 3  −1   3]              [0  0  0]

 −2I − A = [−3   1   1]             [1  0  −¼]
           [−1  −5  −1]  ──RREF──►  [0  1   ¼]  ⇒ x₃ = 4 clears fractions ⇒ p₂ = (1, −1, 4)
           [ 3  −1  −1]             [0  0   0]

  3I − A = [ 2   1   1]             [1  0   1]
           [−1   0  −1]  ──RREF──►  [0  1  −1]  ⇒ x₁ = −x₃, x₂ = x₃ ⇒ p₃ = (−1, 1, 1)
           [ 3  −1   4]             [0  0   0]
```
Checks: A(−1,0,1)ᵀ = (−2,0,2)ᵀ = 2p₁ ✓ · A(1,−1,4)ᵀ = (−2,2,−8)ᵀ = −2p₂ ✓ · A(−1,1,1)ᵀ = (−3,3,3)ᵀ = 3p₃ ✓
```
      [−1   1  −1]                   [2   0   0]
  P = [ 0  −1   1]        P⁻¹AP = D = [0  −2   0]
      [ 1   4   1]                   [0   0   3]
```
**Reverse order.** If P had columns p₃, p₂, p₁, then D = **diag(3, −2, 2)** — the diagonal entries permute
to match. Neither ordering is "more correct," but **P and D must agree** *(slide 37)*. *(pp.19–20 →
slides 38–40)*

---

**10.**
```
              | λ−4    2  |
 |λI − A|  =  |  −1  λ−1  | = (λ−4)(λ−1) − (2)(−1) = λ² − 5λ + 4 + 2 = λ² − 5λ + 6 = (λ−2)(λ−3)
```
**λ₁ = 2, λ₂ = 3.**
```
 2I − A = [−2   2]  ──►  RREF [1  −1]  ⇒ x₁ = x₂   ⇒  p₁ = (1, 1)
          [−1   1]              [0   0]

 3I − A = [−1   2]  ──►  RREF [1  −2]  ⇒ x₁ = 2x₂  ⇒  p₂ = (2, 1)
          [−1   2]              [0   0]
```
Checks: A(1,1)ᵀ = (4−2, 1+1)ᵀ = (2,2)ᵀ = 2p₁ ✓ · A(2,1)ᵀ = (8−2, 2+1)ᵀ = (6,3)ᵀ = 3p₂ ✓

A is 2 × 2 with **2 distinct eigenvalues**, so by **Theorem 7.6** it is **diagonalizable**.
```
      [1   2]                   [2   0]
  P = [1   1]        P⁻¹AP = D = [0   3]
```
Full verification: P⁻¹ = [[−1, 2],[1, −1]], AP = [[2, 6],[2, 3]], and P⁻¹AP = [[2,0],[0,3]] ✓

**Note:** A is *not* symmetric, so nothing here could have been shortcut by §7.3 — and no orthogonal P
exists for it (Theorem 7.10).

---

**11.** From Q4/Example 6: |λI − A| = (λ−3)² − 1 = (λ − 2)(λ − 4), so **λ₁ = 2, λ₂ = 4**, each of
multiplicity 1.
```
 Eigenvectors:   λ=2 → (1, −1)          λ=4 → (1, 1)
 Orthogonal already, by Theorem 7.9 (symmetric, distinct eigenvalues):  (1)(1) + (−1)(1) = 0 ✓
 Normalize:      ‖(1,−1)‖ = ‖(1,1)‖ = √2

     p₁ = ( 1/√2, −1/√2 )              p₂ = ( 1/√2,  1/√2 )

          [  1/√2    1/√2 ]                        [2   0]
      P = [                ]        PᵀAP = D =     [0   4]
          [ −1/√2    1/√2 ]
```
Verification: AP = [[2/√2, 4/√2], [−2/√2, 4/√2]], and PᵀAP = [[2, 0], [0, 4]] ✓

**Gram-Schmidt was not needed at step 3** because **both eigenvalues have multiplicity 1**. Gram-Schmidt
is only ever required *inside* a single eigenspace of multiplicity k ≥ 2; orthogonality *between*
different eigenvalues is already free from Theorem 7.9. *(pp.34–36 → slides 67–72)*

---

**12.** λ₁ = −1 has multiplicity 2 and λ₂ = 3 has multiplicity 2. A is **symmetric** (A = Aᵀ), so
**Theorem 7.7 part 3** *(p.27 → slide 54)* applies: an eigenvalue of multiplicity k has an eigenspace of
dimension exactly k. Therefore
```
 dim(eigenspace of λ = −1) = 2          dim(eigenspace of λ = 3) = 2
```
with **no row reduction at all**. (Confirmed by the handout's bases B₁ = {(1,1,0,0), (0,0,1,1)} and
B₂ = {(1,−1,0,0), (0,0,1,−1)}, *p.28 → slides 55–56*.)

---

### Part C

**13. FALSE.** Repeated eigenvalues make diagonalizability an **open question**, not a settled one — you
must go and count the linearly independent eigenvectors. The two Chapter 7 matrices that point in
opposite directions:

| Matrix | Char. polynomial | Repeated λ | Eigenspace dim | Total indep. eigenvectors | Diagonalizable? |
|---|---|---|---|---|---|
| `[[1,3,0],[3,1,0],[0,0,−2]]` | (λ−4)(λ+2)² | −2, mult 2 | 2 | 1 + 2 = 3 = n | **YES** |
| `[[2,1,0],[0,2,0],[0,0,2]]` | (λ−2)³ | 2, mult 3 | 2 | 2 < 3 = n | **NO** |

The source of the confusion is **Theorem 7.6**, which is **sufficient but not necessary**: n distinct
eigenvalues ⇒ diagonalizable, but the arrow does **not** reverse. Only **Theorem 7.5** (an ⟺) settles the
question in both directions. *(p.21 → slide 41; p.18 → slide 35)*

---

**14. No — the converse is false.** Theorem 7.4 runs one way only: similar ⇒ same eigenvalues.

Counterexample built from matrices already in the chapter: `A = [[2,1,0],[0,2,0],[0,0,2]]` and
`D = diag(2,2,2) = 2I` both have the single eigenvalue 2 with multiplicity 3, so they have identical
eigenvalues. But they are **not similar**: A is not diagonalizable (Q8), whereas 2I is already diagonal.
More directly, any matrix similar to 2I equals P⁻¹(2I)P = 2P⁻¹P = 2I itself — so the only matrix similar
to 2I is 2I, and A ≠ 2I.

**Diagnosis:** eigenvalues alone do not determine a matrix up to similarity; the *eigenspace dimensions*
must match too.

---

**15. No, P is not orthogonal.**
```
 P Pᵀ = [ 1   1] [ 1  −1]  =  [1+1   −1+1]  =  [2   0]  =  2I  ≠  I
        [−1   1] [ 1   1]     [−1+1   1+1]     [0   2]
```
Since PPᵀ ≠ I, we have Pᵀ ≠ P⁻¹, so P fails the definition *(p.29 → slide 58)*.

**Which condition of Theorem 7.8 fails:** the columns are (1, −1) and (1, 1), whose dot product is
1 − 1 = **0** — so they *are* mutually perpendicular. What fails is **unit length**: ‖(1,−1)‖ = ‖(1,1)‖ =
**√2 ≠ 1**. The columns are an orthogonal set but **not an orthoNORMAL set**.

**Repair:** divide each column by √2, giving `P = [[1/√2, 1/√2], [−1/√2, 1/√2]]` — which is exactly the
orthogonal matrix from Q11.

**The trap in one line:** *orthogonal matrix* requires *orthonormal* columns; perpendicularity alone is
not enough.

---

**16.** Because **Theorem 7.9** *(p.31 → slide 62)* already guarantees it: for a **symmetric** matrix,
eigenvectors belonging to **distinct** eigenvalues are automatically orthogonal. That orthogonality comes
for free from the symmetry of A — it costs no work and cannot fail.

The only place orthogonality can fail is **inside a single eigenspace**. There, Theorem 7.7 part 3
guarantees you k linearly independent eigenvectors, but *linearly independent* does not imply
*mutually perpendicular* — you may have picked a skew basis for that eigenspace. Gram-Schmidt straightens
that one basis out. Hence step 3 of the procedure, and only step 3. *(p.34 → slides 67–68)*

---

**17.** **The eigenspace of an eigenvalue is never {0}** — by definition an eigenvalue must have at least
one nonzero eigenvector, so its eigenspace always has dimension ≥ 1. The student's conclusion is
impossible, so an error occurred upstream: either λ₁ is not actually a root of the characteristic
polynomial (arithmetic slip when expanding |λI − A|), or the row reduction of (λ₁I − A) was done wrong.

**The check that should have caught it** is stated in step 3 of the handout's procedure *(p.8 → slide 16)*:

> "The reduced row-echelon form must have **at least one row of zeros**."

An RREF equal to I has no zero row, which is an immediate signal to stop and recheck rather than to draw a
conclusion. Equivalently: (λ₁I − A) must be **singular**, i.e. det(λ₁I − A) = 0 — which is precisely the
characteristic equation the student claimed to have solved.

---

### Part D

**18. (a) Not diagonalizable.** Total independent eigenvectors = 2 + 2 = **4 < 5 = n**. Theorem 7.5 is an
**iff**, so falling short of n settles it in the negative.

**(b) Diagonalizable.** Total = 2 + 3 = **5 = n**, satisfying Theorem 7.5. Note this matrix has *only two
distinct* eigenvalues, so Theorem 7.6 never applies — a reminder that Theorem 7.6 is sufficient, not
necessary.

**(c) Only (b) is possible.** If A is symmetric, **Theorem 7.7 part 3** forces every eigenspace dimension
to equal its multiplicity: dim(E₁) = **2** and dim(E₅) = **3**, with no other option. Scenario (a), with
dim(E₅) = 2 < 3, would violate Theorem 7.7 part 3 and therefore cannot occur for a symmetric matrix.
This is also consistent with Theorem 7.7 part 1 — a symmetric matrix is *always* diagonalizable, so the
non-diagonalizable scenario (a) is unreachable.

---

**19.** The chain:

```
 A = Aᵀ  (A is symmetric)
    │
    │  Thm 7.7.2 — all eigenvalues of A are REAL
    │      contributes: the roots of |λI − A| = 0 are usable; no complex λ to discard
    ▼
 Thm 7.7.3 — an eigenvalue of multiplicity k has eigenspace of dimension EXACTLY k
    │  contributes: enough eigenvectors always exist; the "multiplicity gap" cannot open
    ▼
 Thm 7.7.1 — A is DIAGONALIZABLE
    │  contributes: n linearly independent eigenvectors exist, satisfying Thm 7.5
    ▼
 Thm 7.9 — eigenvectors for DISTINCT eigenvalues are ORTHOGONAL
    │  contributes: cross-eigenspace orthogonality for free; Gram-Schmidt needed only
    │               within a repeated eigenspace (procedure step 3)
    ▼
 Normalize every eigenvector  →  orthoNORMAL set of n eigenvectors
    │
    │  Thm 7.8 — columns orthonormal ⟺ P is an ORTHOGONAL matrix, so P⁻¹ = Pᵀ
    ▼
 Thm 7.10 — A is orthogonally diagonalizable ⟺ A is symmetric
    ▼
 P⁻¹AP = PᵀAP = D
```

**Where a non-symmetric matrix breaks down — potentially at every link:**
- It may have **non-real eigenvalues** (pathology 2, slide 52).
- It may have **fewer eigenvectors than the multiplicity** (pathology 3, slide 53) — this is the failure
  in `[[2,1,0],[0,2,0],[0,0,2]]`.
- It may therefore **fail to be diagonalizable at all** (pathology 1, slide 52).
- Even if it *is* diagonalizable (e.g. Q10's `[[4,−2],[1,1]]`), Theorem 7.9 does not apply, so its
  eigenvectors need not be orthogonal — and by the **⟺** in Theorem 7.10 **no orthogonal P can exist**.
  You get P⁻¹AP = D but never PᵀAP = D.

---

**20.** The four stated objectives of §7.4 *(p.38 → slide 75)*:

1. Model **population growth** using an **age transition matrix** and an **age distribution vector**, and
   find a **stable age distribution vector**.
2. Use a matrix equation to solve a system of **first-order linear differential equations**.
3. Find the matrix of a **quadratic form** and use the **Principal Axes Theorem** to perform a rotation of
   axes for a conic and a quadric surface.
4. Solve a **constrained optimization** problem.

**How much is actually in this PDF: essentially none.** The handout deck ends at PDF page 38 with only the
objectives slide (75) and a "Population Growth" section-title slide (76). None of the §7.4 content itself
is present — you will need another source for these four topics.

*(Aside worth knowing: objectives 3 and 4 together are the machinery behind PCA — `bᵀSb` is a quadratic
form and `max bᵀSb subject to ‖b‖ = 1` is the constrained optimization whose Lagrange condition is exactly
`Sb = λb`.)*
