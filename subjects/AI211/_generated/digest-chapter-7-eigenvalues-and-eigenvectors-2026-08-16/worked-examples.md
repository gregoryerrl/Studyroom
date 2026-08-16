# Chapter 7 — Worked Examples, Fully Reasoned

**Source:** `Chapter 7 Eigenvalues And Eigenvectors - handouts.pdf`. Citations are `p.N → slide S`.

Every example below is from the handout. The *arithmetic* is the handout's; the **"why this step"**
commentary is written out so nothing is left as an exercise. All results were recomputed and verified.

---

## Example 1 — Verifying an eigenvector (p.4 → slides 7–8)

**Problem.** For `A = [[2, 0], [0, −1]]`, verify that **x₁** = (1, 0) is an eigenvector corresponding to
λ₁ = 2, and **x₂** = (0, 1) is an eigenvector corresponding to λ₂ = −1.

**Strategy.** Verification is *not* the same as finding. You are given a candidate, so you do **not**
need the characteristic polynomial. Just multiply and check whether the output is a scalar multiple of
the input.

**Step 1 — multiply A by x₁.**
```
A x₁ = [ 2   0 ] [1]  =  [2]
       [ 0  −1 ] [0]     [0]
```

**Step 2 — is the output a multiple of the input?**
```
[2]  =  2 · [1]      ← YES, with factor 2
[0]         [0]
```
The factor is the **eigenvalue**; the vector being scaled is the **eigenvector**. So **x₁** = (1,0) is an
eigenvector corresponding to λ₁ = **2** ✓

**Step 3 — repeat for x₂.**
```
A x₂ = [ 2   0 ] [0]  =  [ 0]  =  −1 · [0]
       [ 0  −1 ] [1]     [−1]          [1]
```
So **x₂** = (0,1) is an eigenvector corresponding to λ₂ = **−1** ✓

> **Pattern to keep.** For any **diagonal** matrix, the standard basis vectors are automatically
> eigenvectors, and **e**ᵢ picks off the i-th diagonal entry as its eigenvalue. This is Theorem 7.3
> (p.10 → slide 20) showing up in its simplest form.

---

## Example 2 — Eigenspaces found geometrically (pp.6–7 → slides 11–13)

**Problem.** Find the eigenvalues and corresponding eigenspaces of `A = [[−1, 0], [0, 1]]`.

**Strategy.** Recognize the transformation *before* computing. Here
`A v = [[−1,0],[0,1]] (x, y)ᵀ = (−x, y)ᵀ` — a **reflection in the y-axis**. For a geometric map, ask
directly: *which vectors land back on their own line?* No determinant needed.

**Step 1 — test a vector on the x-axis.** Put **v** = (x, 0):
```
A v = (−x, 0) = (−1)·(x, 0) = −1 · v          ← stays on its line, scaled by −1
```
So every nonzero vector on the x-axis is an eigenvector with λ₁ = **−1**.

**Step 2 — test a vector on the y-axis.** Put **v** = (0, y):
```
A v = (0, y) = (+1)·(0, y) = 1 · v            ← stays on its line, scaled by +1
```
So every nonzero vector on the y-axis is an eigenvector with λ₂ = **+1**.

**Step 3 — argue that nothing else works.** Figure 7.1 in the handout shows the reflection sending a
generic point (x, y) to (−x, y). If both x ≠ 0 and y ≠ 0, the image is not on the line through **v**
and the origin — the reflection knocks it off its own line. So there are no other eigenvectors.

**Step 4 — name the eigenspaces.** By Theorem 7.1 each set, together with **0**, is a subspace:
```
 eigenspace(λ₁ = −1) = the x-axis          eigenspace(λ₂ = +1) = the y-axis
```

> **Transferable mnemonic.** For *any* reflection: the **mirror line is fixed** (λ = +1) and the axis
> **perpendicular to the mirror is flipped** (λ = −1).

---

## Example 3 — The multiplicity gap (pp.9–10 → slides 17–19)

**Problem.** Find the eigenvalues and corresponding eigenvectors of
`A = [[2,1,0],[0,2,0],[0,0,2]]`. What is the dimension of the eigenspace of each eigenvalue?

**Why this example matters.** This is the chapter's counterexample — the case where a repeated root
does **not** produce enough eigenvectors.

**Step 1 — characteristic polynomial.** A is upper triangular, so `λI − A` is too:
```
                 | λ−2   −1     0  |
 |λI − A|  =     |  0   λ−2     0  |  =  (λ − 2)³
                 |  0     0   λ−2  |
```
(The determinant of a triangular matrix is the product of its diagonal entries.)

**Step 2 — solve the characteristic equation.** `(λ − 2)³ = 0` ⇒ the **only** eigenvalue is λ = **2**,
appearing with **multiplicity 3**.

**Step 3 — set up the homogeneous system** `(2I − A)x = 0`:
```
 2I − A = [0  −1  0]
          [0   0  0]
          [0   0  0]
```
This is already in reduced row-echelon form, and it has **two rows of zeros** — the self-check from
slide 16 passes (at least one zero row is required).

**Step 4 — read the solution off the RREF.** The only nontrivial row says `−x₂ = 0`, so:
```
 x₂ = 0                      (the single constraint)
 x₁ = s                      (free)
 x₃ = t                      (free)
```

**Step 5 — write the eigenvectors in parametric form.**
```
     [x₁]   [s]      [1]      [0]
 x = [x₂] = [0] = s· [0] + t· [0] ,     s and t not both zero
     [x₃]   [t]      [0]      [1]
```

**Step 6 — count.** λ = 2 has **two** linearly independent eigenvectors, (1,0,0) and (0,0,1), so
```
 dim(eigenspace of λ = 2) = 2
```

**Step 7 — the punchline.**
```
 algebraic multiplicity (root count) = 3
 geometric count (independent eigenvectors) = 2
                                              ▲
                          2 < 3 — the gap. Multiplicity is an UPPER BOUND.
```
A is 3 × 3 but supplies only 2 independent eigenvectors in total, so by **Theorem 7.5** (p.18 → slide 35)
**A is not diagonalizable**.

---

## Example 4 — Triangular and diagonal shortcuts (p.11 → slides 21–22)

**Problem.** Find the eigenvalues of
(a) `A = [[2,0,0],[−1,1,0],[5,3,−3]]`  (b) the 5 × 5 diagonal matrix with diagonal −1, 2, 0, −4, 3.

**Part (a) — the long way, to show the shortcut is honest.**
```
              | λ−2     0     0  |
 |λI − A|  =  |   1   λ−1     0  |  =  (λ − 2)(λ − 1)(λ + 3)
              |  −5    −3   λ+3  |
```
Expanding along the first row (two zeros make this trivial) gives the product of the diagonal entries
of `λI − A`. Setting it to zero: **λ₁ = 2, λ₂ = 1, λ₃ = −3** — exactly the main diagonal entries of A.

**Part (b) — Theorem 7.3 directly.** The matrix is diagonal, hence triangular, so read the diagonal:
```
 λ₁ = −1,  λ₂ = 2,  λ₃ = 0,  λ₄ = −4,  λ₅ = 3
```

> **Note λ₃ = 0.** A zero *eigenvalue* is perfectly legitimate — it means A is singular. What is
> forbidden is a zero *eigenvector*. Do not "correct" this to four eigenvalues.

---

## Example 5 — A repeated eigenvalue that *does* deliver (p.13 → slides 25–26)

**Problem.** Find the eigenvalues and a basis for each eigenspace of `A = [[1,3,0],[3,1,0],[0,0,−2]]`.

**Step 1 — characteristic polynomial.** The third row and column are almost empty, so expand along them:
```
              | λ−1   −3     0  |
 |λI − A|  =  |  −3  λ−1     0  |  =  [ (λ−1)² − 9 ] (λ + 2)
              |   0    0   λ+2  |
```
**Step 2 — factor.** `(λ−1)² − 9` is a difference of squares:
```
 (λ−1)² − 9 = (λ − 1 − 3)(λ − 1 + 3) = (λ − 4)(λ + 2)
 ⇒  |λI − A| = (λ − 4)(λ + 2)²
```
So **λ₁ = 4** with multiplicity 1, and **λ₂ = −2** with multiplicity **2**.

**Step 3 — bases for the eigenspaces** (as given on slide 26):
```
 B₁ = { (1, 1, 0) }                        for λ₁ = 4      → dimension 1
 B₂ = { (1, −1, 0), (0, 0, 1) }            for λ₂ = −2     → dimension 2
```

**Step 4 — verify each basis vector by direct multiplication** (the handout says "verify these"):
```
 A(1,1,0)ᵀ  = (1+3, 3+1, 0)ᵀ  = ( 4,  4, 0)ᵀ = 4 ·(1, 1, 0)ᵀ    ✓
 A(1,−1,0)ᵀ = (1−3, 3−1, 0)ᵀ  = (−2,  2, 0)ᵀ = −2·(1,−1, 0)ᵀ    ✓
 A(0,0,1)ᵀ  = (0, 0, −2)ᵀ                    = −2·(0, 0, 1)ᵀ    ✓
```

**Step 5 — compare against Example 3.**
```
 Example 3:  (λ−2)³        mult 3 → only 2 eigenvectors     GAP   → not diagonalizable
 Example 5:  (λ−4)(λ+2)²   mult 2 → exactly 2 eigenvectors  NO GAP → 1 + 2 = 3 = n
                                                            → diagonalizable (Thm 7.5)
```
**This is the pair to memorize.** Repeated eigenvalues are a *question*, never an answer.

---

## Example 6 — Eigenvalues via similarity (p.17 → slides 33–34)

**Problem.** `A = [[1,0,0],[−1,1,1],[−1,−2,4]]` and `D = diag(1, 2, 3)` are similar. Use a theorem to
find the eigenvalues of A.

**Step 1 — get D's eigenvalues for free.** D is diagonal ⇒ by **Theorem 7.3**, its eigenvalues are its
diagonal entries: 1, 2, 3.

**Step 2 — transport them across the similarity.** By **Theorem 7.4** (p.16 → slide 32), similar
matrices have the same eigenvalues. Therefore
```
 λ₁ = 1,   λ₂ = 2,   λ₃ = 3
```
**with no determinant expansion whatsoever.**

**Step 3 — cross-check the long way** (the handout asks you to confirm):
```
              | λ−1    0     0  |
 |λI − A|  =  |   1  λ−1    −1  |
              |   1    2   λ−4  |

 Expand along row 1 (two zeros):
   = (λ−1) · | λ−1   −1  |  = (λ−1)[ (λ−1)(λ−4) + 2 ]
             |   2  λ−4  |
   = (λ−1)(λ² − 5λ + 4 + 2) = (λ−1)(λ² − 5λ + 6) = (λ−1)(λ−2)(λ−3)   ✓
```

> **What Theorem 7.4 does and does not give you.** It transports *eigenvalues* across a similarity —
> it does **not** say the eigenvectors are the same. They are related by the change-of-basis matrix.

---

## Example 7 — Full diagonalization (pp.19–20 → slides 38–40)

**Problem.** Show that `A = [[1,−1,−1],[1,3,1],[−3,1,−1]]` is diagonalizable, then find P with `P⁻¹AP` diagonal.

**Step 1 — characteristic polynomial.** The handout gives `|λI − A| = (λ − 2)(λ + 2)(λ − 3)`.
Expanded form (verified): `λ³ − 3λ² − 4λ + 12`.

**Step 2 — eigenvalues.** λ₁ = **2**, λ₂ = **−2**, λ₃ = **3** — **three distinct** values.

> **Shortcut available here.** Theorem 7.6 (p.21 → slide 41) already settles diagonalizability: a
> 3 × 3 matrix with 3 distinct eigenvalues is diagonalizable. But you still need the eigenvectors to
> *build* P, so continue.

**Step 3 — eigenvector for λ₁ = 2.** Form `2I − A` and row reduce:
```
 2I − A = [ 1   1   1]     R₂ ← R₂ + R₁     [1   1   1]
          [−1  −1  −1]     R₃ ← R₃ − 3R₁    [0   0   0]
          [ 3  −1   3]                      [0  −4   0]

          R₂ ↔ R₃, R₂ ← R₂/(−4), R₁ ← R₁ − R₂    [1  0  1]
                                          RREF = [0  1  0]   ← has a zero row ✓
                                                 [0  0  0]
```
Reading it: `x₁ + x₃ = 0` and `x₂ = 0`. Set `x₃ = t`: then `x₁ = −t`, giving `x = t(−1, 0, 1)`.
**p₁ = (−1, 0, 1)**

**Step 4 — eigenvector for λ₂ = −2.**
```
 −2I − A = [−3   1   1]                          [1  0  −1/4]
           [−1  −5  −1]   ──── row reduce ────►  [0  1   1/4]   ← zero row ✓
           [ 3  −1  −1]                          [0  0    0 ]
```
Reading it: `x₁ = ¼x₃` and `x₂ = −¼x₃`. Choosing `x₃ = 4` clears the fractions:
**p₂ = (1, −1, 4)**

> **Why choose x₃ = 4?** Any nonzero scalar multiple of an eigenvector is still an eigenvector
> (Theorem 7.1 — the eigenspace is closed under scalar multiplication). Pick the multiple that makes
> the arithmetic clean.

**Step 5 — eigenvector for λ₃ = 3.**
```
 3I − A = [ 2   1   1]                          [1  0   1]
          [−1   0  −1]   ──── row reduce ────►  [0  1  −1]   ← zero row ✓
          [ 3  −1   4]                          [0  0   0]
```
Reading it: `x₁ = −x₃`, `x₂ = x₃`. Set `x₃ = 1`: **p₃ = (−1, 1, 1)**

**Step 6 — verify all three before building P.** (Cheap insurance; a wrong column ruins everything.)
```
 A(−1,0,1)ᵀ = (−1−1, −1+1,  3−1)ᵀ = (−2, 0,  2)ᵀ =  2·(−1, 0, 1)ᵀ   ✓
 A(1,−1,4)ᵀ = (1+1−4, 1−3+4, −3−1−4)ᵀ = (−2, 2, −8)ᵀ = −2·(1,−1, 4)ᵀ ✓
 A(−1,1,1)ᵀ = (−1−1−1, −1+3+1, 3+1−1)ᵀ = (−3, 3, 3)ᵀ =  3·(−1, 1, 1)ᵀ ✓
```

**Step 7 — assemble P from the eigenvectors as COLUMNS.**
```
      [−1   1  −1]
  P = [ 0  −1   1]        P is nonsingular (check this) ⇒ the three eigenvectors
      [ 1   4   1]        are linearly independent ⇒ A is diagonalizable (Thm 7.5)
```

**Step 8 — state D, respecting the column order.**
```
              [2   0   0]
  P⁻¹AP = D = [0  −2   0]
              [0   0   3]
        col 1 of P was p₁ (λ=2) → entry (1,1) is 2
        col 2 of P was p₂ (λ=−2) → entry (2,2) is −2
        col 3 of P was p₃ (λ=3) → entry (3,3) is 3
```

> **Ordering rule (slide 37).** Had you written P with columns in the order p₃, p₁, p₂, then D would be
> `diag(3, 2, −2)`. Neither is "more correct" — but P and D must agree.

---

## Example 8 — Deciding diagonalizability in one line (p.21 → slide 42)

**Problem.** Determine whether `A = [[1,−2,1],[0,0,1],[0,0,−3]]` is diagonalizable.

**Step 1 — recognize the structure.** A is **upper triangular**.

**Step 2 — read the eigenvalues off the diagonal** (Theorem 7.3): λ₁ = **1**, λ₂ = **0**, λ₃ = **−3**.

**Step 3 — check distinctness.** 1, 0, −3 are three **distinct** values for a 3 × 3 matrix.

**Step 4 — apply Theorem 7.6.** n distinct eigenvalues ⇒ the eigenvectors are linearly independent ⇒
**A is diagonalizable.** No row reduction was needed at any point.

> **Note the free λ = 0 again.** It counts as an eigenvalue and it counts toward distinctness.

---

## Example 9 — A basis that diagonalizes a linear transformation (p.23 → slides 45–46)

**Problem.** Let `T : R³ → R³` be `T(x₁,x₂,x₃) = (x₁ − x₂ − x₃, x₁ + 3x₂ + x₃, −3x₁ + x₂ − x₃)`.
If possible, find a basis B for R³ such that the matrix for T relative to B is diagonal.

**Step 1 — extract the standard matrix.** Each output component's coefficients form one **row**:
```
 row 1 from (x₁ − x₂ − x₃)      → [ 1  −1  −1]
 row 2 from (x₁ + 3x₂ + x₃)     → [ 1   3   1]      A = [[1,−1,−1],[1,3,1],[−3,1,−1]]
 row 3 from (−3x₁ + x₂ − x₃)    → [−3   1  −1]
```

**Step 2 — recognize it.** This is exactly the matrix of Example 7, already known to be diagonalizable
with eigenvectors (−1,0,1), (1,−1,4), (−1,1,1) for λ = 2, −2, 3.

**Step 3 — invoke the principle** (p.22 → slide 44): a basis making the matrix for T diagonal exists
exactly when the standard matrix for T is diagonalizable. It is. So take the eigenvectors as the basis:
```
 B = { (−1, 0, 1),  (1, −1, 4),  (−1, 1, 1) }
```

**Step 4 — state the matrix for T relative to B.**
```
      [2   0   0]
  D = [0  −2   0]
      [0   0   3]
```

> **Interpretation.** In the eigenbasis, T stops mixing coordinates — it just stretches each basis
> direction by its own eigenvalue. That is the entire point of diagonalization.

---

## Example 10 — Eigenspace dimensions with no row reduction (p.28 → slides 55–56)

**Problem.** Find the eigenvalues of the symmetric matrix
`A = [[1,−2,0,0],[−2,1,0,0],[0,0,1,−2],[0,0,−2,1]]` and determine the dimensions of the eigenspaces.

**Step 1 — confirm symmetry.** Entry (1,2) = −2 = entry (2,1); entry (3,4) = −2 = entry (4,3); the rest
are 0 or on the diagonal. So `A = Aᵀ` ✓ — **Theorem 7.7 is now available.**

**Step 2 — characteristic polynomial.** The handout gives
```
              | λ−1    2     0     0  |
              |   2  λ−1     0     0  |
 |λI − A|  =  |   0    0   λ−1     2  |  =  (λ + 1)²(λ − 3)²
              |   0    0     2   λ−1  |
```
(A is **block diagonal** with two identical 2 × 2 blocks. Each block contributes
`(λ−1)² − 4 = (λ−3)(λ+1)`, and the two contributions multiply.)

**Step 3 — eigenvalues and multiplicities.**
```
 λ₁ = −1  with multiplicity 2
 λ₂ =  3  with multiplicity 2
```

**Step 4 — invoke Theorem 7.7.3 — this is the whole trick.** A is symmetric, so an eigenvalue of
multiplicity k has an eigenspace of dimension **exactly k**. Therefore:
```
 dim(eigenspace of λ₁ = −1) = 2         ← known WITHOUT solving any system
 dim(eigenspace of λ₂ =  3) = 2         ← known WITHOUT solving any system
```

**Step 5 — the bases confirm it** (given on slide 56):
```
 B₁ = { (1, 1, 0, 0),  (0, 0, 1, 1) }        for λ₁ = −1
 B₂ = { (1, −1, 0, 0), (0, 0, 1, −1) }       for λ₂ =  3
```
Spot-check one: `A(1,1,0,0)ᵀ = (1−2, −2+1, 0, 0)ᵀ = (−1,−1,0,0)ᵀ = −1·(1,1,0,0)ᵀ` ✓

> **Contrast with Example 3.** There, multiplicity 3 gave only dimension 2 — but that matrix was **not**
> symmetric. Symmetry closes the gap permanently.

---

## Example 11 — Verifying an orthogonal matrix, two ways (pp.30–31 → slides 59–61)

**Problem.** Show that
```
      [   1/3        2/3        2/3    ]
  P = [ −2/√5       1/√5         0     ]
      [ −2/(3√5)  −4/(3√5)   5/(3√5)   ]
```
is orthogonal by showing `Pᵀ = P⁻¹`, then show its column vectors form an orthonormal set.

**Method 1 — the definition (p.29 → slide 58).** P is orthogonal when `P⁻¹ = Pᵀ`. Rather than invert P,
show `PPᵀ = I` — for square matrices that is equivalent and far cheaper. The handout computes:
```
 P Pᵀ = I₃    ⇒    Pᵀ = P⁻¹    ⇒  P is orthogonal  ✓
```

**Method 2 — Theorem 7.8.** P is orthogonal **iff** its columns form an orthonormal set. The columns are
```
 p₁ = ( 1/3, −2/√5, −2/(3√5) )
 p₂ = ( 2/3,  1/√5, −4/(3√5) )
 p₃ = ( 2/3,     0,  5/(3√5) )
```
**Mutually perpendicular** (the handout reports all three dot products vanish):
```
 p₁·p₂ = 2/9 − 2/5 + 8/45  = 10/45 − 18/45 + 8/45 = 0  ✓
 p₁·p₃ = 2/9 +  0  − 10/45 = 10/45 − 10/45        = 0  ✓
 p₂·p₃ = 4/9 +  0  − 20/45 = 20/45 − 20/45        = 0  ✓
```
**Unit length:**
```
 ‖p₁‖² = 1/9 + 4/5 + 4/45  =  5/45 + 36/45 +  4/45 = 45/45 = 1  ✓
 ‖p₂‖² = 4/9 + 1/5 + 16/45 = 20/45 +  9/45 + 16/45 = 45/45 = 1  ✓
 ‖p₃‖² = 4/9 +  0  + 25/45 = 20/45 +  0    + 25/45 = 45/45 = 1  ✓
```
So {p₁, p₂, p₃} is an orthonormal set, "as guaranteed by Theorem" — the two methods agree.

> **⚠ Both conditions are required.** Perpendicular alone is not enough. `[[1,1],[−1,1]]` has
> perpendicular columns but each has length √2, and `PPᵀ = 2I ≠ I`. Not orthogonal.

---

## Example 12 — Why eigenvectors of a symmetric matrix are perpendicular (p.32 → slides 63–64)

**Problem.** Show that any two eigenvectors of `A = [[3,1],[1,3]]` corresponding to distinct eigenvalues
are orthogonal.

**Step 1 — characteristic polynomial.**
```
              | λ−3   −1  |
 |λI − A|  =  |  −1  λ−3  |  = (λ−3)² − (−1)(−1) = (λ−3)² − 1
```
Expand: `λ² − 6λ + 9 − 1 = λ² − 6λ + 8 = (λ − 2)(λ − 4)`. So **λ₁ = 2, λ₂ = 4**.

**Step 2 — eigenvectors for λ₁ = 2.**
```
 2I − A = [−1  −1]   ──►  RREF [1  1]   ⇒  x₁ + x₂ = 0  ⇒  x₂ = −x₁
          [−1  −1]              [0  0]

 Every eigenvector of λ₁ = 2 has the form   x₁ = (s, −s),  s ≠ 0
```

**Step 3 — eigenvectors for λ₂ = 4.**
```
 4I − A = [ 1  −1]   ──►  RREF [1  −1]  ⇒  x₁ = x₂
          [−1   1]              [0   0]

 Every eigenvector of λ₂ = 4 has the form   x₂ = (t, t),  t ≠ 0
```

**Step 4 — take the dot product, keeping the parameters general.**
```
 x₁ · x₂ = (s)(t) + (−s)(t) = st − st = 0
```
This is **0 for every choice of s and t** — not just for one convenient pair. So *every* eigenvector of
λ=2 is orthogonal to *every* eigenvector of λ=4.

**Step 5 — recognize the general principle.** This is not luck; it is **Theorem 7.9** (p.31 → slide 62):
A is symmetric and λ₁ ≠ λ₂, so their eigenvectors *must* be orthogonal. The computation just confirms it.

---

## Example 13 — Orthogonal diagonalization, end to end (pp.35–36 → slides 69–72)

**Problem.** Find a matrix P that orthogonally diagonalizes `A = [[−2, 2], [2, 1]]`.

**Step 0 — check symmetry first.** Entry (1,2) = 2 = entry (2,1), so `A = Aᵀ`. By **Theorem 7.10**
(p.33 → slide 66) an orthogonal P is guaranteed to exist. Without symmetry, this problem would have no
solution and there would be nothing to compute.

**Step 1 — eigenvalues** (procedure step 1, slide 67).
```
              | λ+2   −2  |
 |λI − A|  =  |  −2  λ−1  | = (λ+2)(λ−1) − (−2)(−2) = λ² + λ − 2 − 4 = λ² + λ − 6
            = (λ + 3)(λ − 2)
```
**λ₁ = −3, λ₂ = 2**, each of **multiplicity 1**.

**Step 2 — an eigenvector for each** (procedure step 2).
```
 −3I − A = [−1  −2]  ──►  RREF [1  2]  ⇒ x₁ = −2x₂ ⇒ take x₂=1 ⇒  (−2, 1)
           [−2  −4]             [0  0]

  2I − A = [ 4  −2]  ──►  RREF [1  −½] ⇒ x₁ = ½x₂  ⇒ take x₂=2 ⇒  ( 1, 2)
           [−2   1]             [0   0]
```
Both RREFs have a zero row ✓

**Step 3 — confirm orthogonality (free, by Theorem 7.9).**
```
 (−2)(1) + (1)(2) = −2 + 2 = 0    ✓  orthogonal, as guaranteed for a symmetric
                                     matrix with distinct eigenvalues
```
So {(−2,1), (1,2)} is already an **orthogonal** basis for R². It is not yet **orthonormal**.

**Step 4 — normalize** (this is the step that ordinary §7.2 diagonalization skips).
```
 ‖(−2, 1)‖ = √(4 + 1) = √5            ‖(1, 2)‖ = √(1 + 4) = √5

 p₁ = (−2, 1)/√5 = ( −2/√5,  1/√5 )   p₂ = (1, 2)/√5 = ( 1/√5,  2/√5 )
```

**Step 5 — no Gram-Schmidt needed** (procedure step 3). Each eigenvalue has multiplicity 1, so there is
no repeated eigenspace to orthogonalize within. Go straight to step 4.

**Step 6 — build P from the orthonormal eigenvectors as columns** (procedure step 4).
```
      [ −2/√5   1/√5 ]
  P = [                ]
      [  1/√5   2/√5 ]
```

**Step 7 — verify.** Because P is orthogonal, `P⁻¹ = Pᵀ`, so compute `PᵀAP` instead of inverting:
```
       [ −2/√5   1/√5 ] [ −2   2 ] [ −2/√5   1/√5 ]     [ −3   0 ]
 PᵀAP =[                ][         ][                ]  = [         ]  = diag(λ₁, λ₂)  ✓
       [  1/√5   2/√5 ] [  2   1 ] [  1/√5   2/√5 ]     [  0   2 ]
```
The eigenvalues appear on the diagonal in the same order as the columns of P — the ordering rule from
§7.2 still applies.

---

## Cross-example summary — what changes between the three procedures

| | §7.1 find eigenvectors | §7.2 diagonalize | §7.3 orthogonally diagonalize |
|---|---|---|---|
| Requires | nothing | n independent eigenvectors | **A symmetric** |
| Find eigenvalues | ✔ | ✔ | ✔ |
| Solve (λI − A)x = 0 | ✔ | ✔ | ✔ |
| Build P from eigenvector **columns** | — | ✔ | ✔ |
| **Normalize** each eigenvector | — | — | ✔ |
| **Gram-Schmidt** in repeated eigenspaces | — | — | ✔ (only if multiplicity ≥ 2) |
| Result | eigenspaces | `P⁻¹AP = D` | `PᵀAP = D` (inverse is free) |
| Guaranteed to succeed? | always | only if Thm 7.5 holds | **always**, by Thm 7.10 |
