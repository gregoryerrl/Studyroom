# How Eigenvalues Are Used in Principal Component Analysis

**Research note — 2026-08-15.** Web sources cross-referenced against `mml-book.pdf` Ch. 10 and
`Chapter 7 Eigenvalues And Eigenvectors - handouts.pdf`. All source URLs listed at the end.

---

## 1. The one-sentence answer

PCA computes the eigenvectors and eigenvalues of the **data covariance matrix S**: the *eigenvectors*
are the principal component directions, and each *eigenvalue is literally the variance of the data
projected onto its eigenvector*. Ranking eigenvalues largest-to-smallest ranks the components by how
much information they carry.

The critical point most tutorials assert but do not prove: **the eigenvalue does not merely *measure*
the variance — it *is* the variance.** The MML book proves this in three lines (§10.2.1, eq. 10.15).

---

## 2. The derivation spine — where the eigenvalue equation comes from

This is the part worth internalizing, because it shows eigenvalues are not *chosen* for PCA; they
*fall out* of the optimization.

```
  GOAL: find unit vector b₁ maximizing the variance of the projected data
         │
         │  projected coordinate:  z₁ₙ = b₁ᵀxₙ                        (10.8)
         ▼
  V₁ = (1/N) Σ (b₁ᵀxₙ)²  =  b₁ᵀ ( (1/N) Σ xₙxₙᵀ ) b₁  =  b₁ᵀ S b₁     (10.9b)
         │                          └──── this is S ────┘
         │  ← a QUADRATIC FORM in b₁ (Ch.7 §7.4 objective!)
         ▼
  max  b₁ᵀ S b₁    subject to   ‖b₁‖² = 1                            (10.10)
         │
         │  ← CONSTRAINED OPTIMIZATION (Ch.7 §7.4 objective!)
         │     Lagrangian: 𝔏 = b₁ᵀSb₁ + λ₁(1 − b₁ᵀb₁)                 (10.11)
         │     ∂𝔏/∂b₁ = 2b₁ᵀS − 2λ₁b₁ᵀ = 0
         ▼
  ╔═══════════════════════════════════════════════════════════════╗
  ║   S b₁ = λ₁ b₁        ← THE EIGENVALUE EQUATION, DERIVED      ║  (10.13)
  ║   ‖b₁‖ = 1                                                    ║  (10.14)
  ╚═══════════════════════════════════════════════════════════════╝
         │  substitute back into the objective:
         ▼
  V₁ = b₁ᵀSb₁ = λ₁ b₁ᵀb₁ = λ₁      ← VARIANCE **EQUALS** EIGENVALUE  (10.15)
```

The Lagrange multiplier of the unit-norm constraint *is* the eigenvalue. (mml-book PDF pp. 327–328 =
printed pp. 321–322.)

Two consequences the book then derives:

- Generalizing to the m-th component: `Vₘ = bₘᵀSbₘ = λₘ` (10.23), so the variance captured by an
  M-dimensional principal subspace is **`V_M = Σ_{m=1}^{M} λₘ`** (10.24) — just add up the top-M
  eigenvalues. (PDF p. 330–331 = printed pp. 324–325.)
- The variance **lost** to compression is the sum of the eigenvalues you threw away:
  **`J_M = Σ_{j=M+1}^{D} λⱼ = V_D − V_M`** (10.25). And this is not a loose analogy — the average
  squared reconstruction error is *exactly* that same tail sum:
  `(1/N) Σ ‖xₙ − x̃ₙ‖² = Σ_{i=M+1}^{D} λᵢ` (10.62, PDF p. 345 = printed p. 339).

---

## 3. The five distinct jobs eigenvalues do in PCA

| # | Job | Formula | Source |
|---|-----|---------|--------|
| 1 | **Are** the variance along each PC | Vₘ = λₘ | mml 10.15, 10.23 |
| 2 | **Rank** the components (sort descending) | λ₁ ≥ λ₂ ≥ … ≥ λ_D | Raschka; Built In |
| 3 | **Quantify** explained variance ratio | EVR(λᵢ) = λᵢ / Σⱼλⱼ | Raschka; Built In; sklearn |
| 4 | **Measure** the reconstruction error you accept | J_M = Σ_{j>M} λⱼ | mml 10.25, 10.62 |
| 5 | **Detect** redundancy / rank deficiency | λ = 0 ⇒ that direction has no spread | mml §10.5 |

A sixth, minor one: MML notes `√λ₁` is called the **loading** of the unit vector b₁ — it is the
*standard deviation* of the data accounted for by that principal subspace (margin note, PDF p. 328).

---

## 4. Worked example — Chapter 7 machinery reproducing real scikit-learn output

The scikit-learn docs give this example, which I recomputed by hand using the Chapter 7 characteristic-
polynomial method to confirm the sources agree.

**Data** (n = 6, already mean-zero):
```
X = [(-1,-1), (-2,-1), (-3,-2), (1,1), (2,1), (3,2)]
```

**Step 1 — covariance matrix** (using the 1/(n−1) convention, i.e. divide by 5):
```
XᵀX = [[28, 18],        S = (1/5)·XᵀX = [[5.6, 3.6],
       [18, 12]]                          [3.6, 2.4]]
```
Note S = Sᵀ. **This is the hinge on which everything else depends** (see §5).

**Step 2 — characteristic equation**, exactly as taught in Ch. 7 §7.1 (slide 15):
```
|λI − S| = (λ − 5.6)(λ − 2.4) − (3.6)²
         = λ² − 8λ + 13.44 − 12.96
         = λ² − 8λ + 0.48 = 0
λ = [8 ± √(64 − 1.92)]/2 = [8 ± √62.08]/2
```
→ **λ₁ = 7.9395**, **λ₂ = 0.0605**

**Step 3 — cross-check against sklearn's published output.** The docs report
`singular_values_ = [6.30061, 0.54980]` and state `explained_variance_ = singular_values_²/(n−1)`:
```
6.30061² / 5 = 39.6977 / 5 = 7.9395   ✓ matches λ₁
0.54980² / 5 =  0.3023 / 5 = 0.0605   ✓ matches λ₂
```
The hand-computed eigenvalues of the covariance matrix and the SVD-derived singular values agree.

**Step 4 — explained variance ratio:**
```
EVR₁ = 7.9395 / 8.0 = 0.9924      EVR₂ = 0.0605 / 8.0 = 0.0076
```
sklearn's docs report `explained_variance_ratio_ = [0.9924, 0.0075]` ✓

**Step 5 — a free sanity check the course gives you.** trace(S) = 5.6 + 2.4 = **8.0**, and
λ₁ + λ₂ = 7.9395 + 0.0605 = **8.0**. The sum of the eigenvalues equals the total variance, which is
why dividing by Σλⱼ in step 4 gives a genuine *fraction of total variance*.

**Step 6 — the eigenvector (PC1).** Solving (S − λ₁I)v = 0:
```
(5.6 − 7.9395)v₁ + 3.6v₂ = 0  →  −2.3395v₁ + 3.6v₂ = 0  →  v₁ = 1.5388·v₂
v ∝ (1.5388, 1),  ‖v‖ = 1.8352  →  p₁ = (0.8385, 0.5449)
```
Sanity: the data run from (−3,−2) to (3,2), direction (3,2)/√13 = (0.832, 0.555). PC1 points along
the long axis of the cloud, as it must. PC2 = (−0.5449, 0.8385), orthogonal to PC1 — **guaranteed in
advance by Theorem 7.9 of your handouts**, since S is symmetric with distinct eigenvalues.

---

## 5. Cross-reference: what Chapter 7 already gave you

The handouts never mention PCA, but they supply **every guarantee PCA silently relies on**. This is
the payoff of the chapter.

```
 CH.7 HANDOUTS                             ROLE IN PCA
 ─────────────────────────────────────────────────────────────────────────────
 Def. symmetric: A = Aᵀ         ──────►    S is symmetric by construction
 (p.26, slide 51)                          (cov(a,b) = cov(b,a))
                                                    │
 Thm 7.7.2  eigenvalues real    ──────►    variances are real numbers.
 (p.27, slide 54)                          A complex "variance" would be nonsense.
                                                    │
 Thm 7.7.1  A diagonalizable    ──────►    PCA ALWAYS has a full solution.
 (p.27, slide 54)                          No covariance matrix is ever the
                                           "defective" case of your λ=2 example.
                                                    │
 Thm 7.7.3  dim eigenspace = k  ──────►    repeated eigenvalues still yield
 (p.27, slide 54)                          enough independent PCs — no shortfall.
                                                    │
 Thm 7.9  distinct λ ⇒ eigen-   ──────►    principal components are PERPENDICULAR.
 vectors orthogonal                        Built In's claim that PC2 is "uncorrelated
 (p.31, slide 62)                          with (i.e. perpendicular to) PC1" is
                                           exactly this theorem.
                                                    │
 Thm 7.10 Fundamental Theorem   ──────►    THE SPECTRAL THEOREM. Identical to
 orthogonally diagonalizable                mml Theorem 4.15 (cited at 10.2.2) and
 ⟺ symmetric                                to Shlens' Theorem 4, "A = EDEᵀ".
 (p.33, slide 66)                          Same theorem, three names.
                                                    │
 Orthogonal diagonalization     ──────►    mml §10.6 step 3 is this procedure
 procedure + Gram-Schmidt                   verbatim. Gram-Schmidt is needed exactly
 (p.34, slides 67–68)                       when an eigenvalue repeats (degenerate PCs).
                                                    │
 P⁻¹AP = D, columns of P are    ──────►    P is the projection matrix B; D holds the
 eigenvectors (p.18, slide 36)              variances. Off-diagonals of D are 0 =
                                            "PCA decorrelates the data."
```

**Agreements (unanimous across all sources):**

1. **Eigenvectors of the covariance matrix = principal components.** Stated identically by Shlens
   ("The principal components of X are the eigenvectors of Cₓ"), Built In, Raschka, and derived from
   scratch in mml eq. 10.13.
2. **Eigenvalue = variance along that direction.** Raschka: eigenvalues "explain variance along the
   new axes." mml proves it: `V₁ = λ₁`.
3. **EVR = λᵢ / Σλⱼ.** Identical formula in Raschka, Built In, sklearn, and implied by mml 10.24.
4. **Symmetry of the covariance matrix is what makes it all work.** Every source leans on it; only
   your Chapter 7 (Thm 7.7 / 7.10) and Shlens' appendix actually state the theorem being used.
5. **Sorting descending, then truncating.** Universal.

---

## 6. Differences and tensions worth knowing for the exam

### 6.1 The 1/N vs 1/(N−1) split — real, but harmless

| Source | Covariance definition | Eigenvalue ↔ singular value |
|---|---|---|
| mml-book (10.1, 10.45) | `S = (1/N) Σ xₙxₙᵀ` | `λ_d = σ_d²/N` (10.49) |
| Shlens | `Cₓ = (1/n)XXᵀ`, notes 1/(n−1) "used in practice" | `σᵢ = √λᵢ` |
| Raschka | `Σ = 1/(n−1)·(X−x̄)ᵀ(X−x̄)` | — |
| scikit-learn | n_samples − 1 degrees of freedom | `explained_variance_ = σ²/(n−1)` |

**Resolution:** the two conventions differ by a constant factor N/(N−1). Scaling S by a constant
scales every eigenvalue by that same constant and **leaves every eigenvector unchanged** — so the
principal component *directions* are identical, and the EVR *ratios* are identical (the factor
cancels in λᵢ/Σλⱼ). Only the raw eigenvalue magnitudes differ. Do not lose marks "correcting" one
convention to the other; do state which you are using.

### 6.2 Standardization — a genuine practical disagreement

- **mml-book §10.6** lists standardization as **step 2 of the algorithm**: divide each dimension by
  its standard deviation σ_d so every axis has variance 1 (PDF p. 342 = printed p. 336).
- **Built In** likewise insists on standardizing first, since "PCA is sensitive to variance
  differences" and large-range variables would otherwise dominate.
- **scikit-learn explicitly does NOT**: "The input data is centered but not scaled for each feature
  before applying the SVD." You must apply `StandardScaler` yourself.

**Why it matters:** standardizing changes S from a *covariance* matrix into a *correlation* matrix,
which has genuinely different eigenvalues and different principal components. Feed unstandardized
data measured in millimetres and kilograms into sklearn and the millimetre axis will hijack PC1
purely because of its units. This is a real trap, not a notational one.

### 6.3 How eigenvalues are actually computed — the course method does not scale

This is the sharpest divergence between your Chapter 7 and practice.

- **Chapter 7 teaches one method only:** form `|λI − A| = 0` and find the real roots (p.8, slide 16).
- **mml-book §10.4.2 says this is impossible in general.** By the **Abel–Ruffini theorem** (Ruffini
  1799, Abel 1826) there is no algebraic solution for polynomial roots of degree ≥ 5 — so for any
  matrix larger than 4×4, the characteristic-polynomial route is a dead end. Practice uses **iterative
  methods** (`np.linalg.eigh`, `np.linalg.svd`), or **power iteration** `x_{k+1} = Sx_k/‖Sx_k‖` when
  only the top eigenvector is needed. (PDF p. 340 = printed p. 334.) The book notes Google's original
  PageRank used exactly this power iteration.
- **SVD is preferred over eigendecomposition** in production: sklearn's default is SVD; the "PCA vs
  SVD" write-up notes SVD is numerically more stable because it avoids forming the covariance matrix
  at all. mml gives the bridge: since `S = (1/N)XXᵀ`, writing `X = UΣVᵀ` gives `S = (1/N)UΣΣᵀUᵀ`, so
  the columns of **U are the eigenvectors of S** and `λ_d = σ_d²/N` (eqs. 10.47–10.49).

**Read Chapter 7's method as a *definition and a hand-calculation tool*, not as the algorithm.** It
tells you what an eigenvalue *is*; it is not how anyone computes one on a 784-dimensional MNIST image.

### 6.4 Things PCA needs that Chapter 7 never mentions

- **Positive semi-definiteness.** Covariance matrices always have λ ≥ 0 (a variance cannot be
  negative). Chapter 7 proves eigenvalues of a symmetric matrix are *real* but says nothing about
  sign. In PCA, a negative eigenvalue is a bug, not a result.
- **λ = 0 is informative, not an error.** mml §10.5: when N ≪ D (fewer samples than dimensions),
  S has rank N, so **D − N + 1 eigenvalues are exactly 0** — those directions carry no variance and
  are dropped for free. This links directly to the Ch.7 fact that 0 is a legitimate eigenvalue
  (Example 7b, p.11 slide 22): here it means "redundant dimension."
- **The high-dimensional trick** (mml §10.5): the nonzero eigenvalues of the D×D matrix `(1/N)XXᵀ`
  equal those of the N×N matrix `(1/N)XᵀX`, and if `cₘ` is an eigenvector of the latter then `Xcₘ` is
  an eigenvector of S. For a 10,000-pixel image set with 500 samples, this turns a 10,000×10,000
  eigenproblem into a 500×500 one.

### 6.5 Your handouts stop right at the door

Chapter 7 §7.4's objectives slide (PDF p. 38, slide 75) lists exactly two items that *are* the PCA
derivation:

> "Find the matrix of a **quadratic form** and use the **Principal Axes Theorem** to perform a
> rotation of axes…" and "Solve a **constrained optimization problem**."

`b ᵀSb` is a quadratic form; `max bᵀSb s.t. ‖b‖ = 1` is the constrained optimization; the Principal
Axes Theorem is the rotation into the eigenbasis. **The handout PDF ends at page 38 with only the
objectives slide and a "Population Growth" title slide** — the §7.4 content itself is not in this
deck. If you want the bridge from Chapter 7 to PCA spelled out, that missing material is where it
lives; mml-book §10.2 is the substitute.

---

## 7. Exam-ready summary

- Eigenvector of S → **direction** of a principal component. Eigenvalue of S → **variance** along it.
- `Sb = λb` is *derived* from maximizing `bᵀSb` subject to `‖b‖ = 1`; λ is the Lagrange multiplier.
- Keep the top M eigenvalues → keep variance `Σ_{m≤M} λₘ`; discard the rest → error `Σ_{j>M} λⱼ`.
- `Σλᵢ = trace(S)` = total variance, which is what makes EVR a true percentage.
- PCA works at all **because covariance matrices are symmetric** — Thm 7.7 (always diagonalizable,
  real eigenvalues) and Thm 7.10 (orthogonally diagonalizable ⟺ symmetric) are the licence.
- PCs are orthogonal **because of Thm 7.9**, not by construction or by luck.
- Compute with SVD or iterative methods in practice; `det(λI − A) = 0` is for exams and for
  understanding, and is provably useless past 4×4.

---

## Sources

Fetched and read in full:

- https://sebastianraschka.com/Articles/2015_pca_in_3_steps.html
- https://builtin.com/data-science/step-step-explanation-principal-component-analysis
- https://ar5iv.labs.arxiv.org/html/1404.1100
- https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html

Consulted via search results (summaries only, not fetched in full):

- https://arxiv.org/abs/1404.1100
- https://medium.com/@notsokarda/pca-vs-svd-simplified-32c5c753998
- https://codesignal.com/learn/courses/navigating-data-simplification-with-pca/lessons/mastering-pca-eigenvectors-eigenvalues-and-covariance-matrix-explained
- https://www.geeksforgeeks.org/data-analysis/principal-component-analysis-pca/
- https://towardsdatascience.com/eigenvalues-and-eigenvectors-378e851bf372/
- https://pages.mtu.edu/~shanem/psy5220/daily/Day04/PCA.html

Course materials cross-referenced:

- `mml-book.pdf` — Ch. 10 "Dimensionality Reduction with PCA": §10.1–10.2 (PDF pp. 323–331 = printed
  pp. 317–325), §10.4–10.6 (PDF pp. 339–345 = printed pp. 333–339). PDF page = printed page + 6.
- `Chapter 7 Eigenvalues And Eigenvectors - handouts.pdf` — §7.1 (slide 16), §7.2 (slide 36),
  §7.3 Theorems 7.7 / 7.9 / 7.10 (PDF pp. 27, 31, 33), orthogonal diagonalization procedure
  (PDF p. 34), §7.4 objectives (PDF p. 38).
