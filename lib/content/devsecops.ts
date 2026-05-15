import { Track } from "./types";

export const devsecopsTrack: Track = {
  id: "devsecops",
  title: "DevSecOps",
  description:
    "Integrate security into every stage of the DevOps lifecycle. Covers secure coding, versioning strategies, secret management, SAST/DAST, container hardening, cloud security, and compliance automation.",
  icon: "ShieldCheck",
  color: "#dc2626",
  gradient: "track-devsecops-gradient",
  level: "intermediate",
  estimatedHours: 28,
  modules: [
    // ─────────────────────────────────────────
    // MODULE 1 — Foundations
    // ─────────────────────────────────────────
    {
      id: "devsecops-foundations",
      title: "DevSecOps Foundations",
      description: "Understand the philosophy, culture, and tooling that make security a first-class DevOps citizen.",
      level: "beginner",
      lessons: [
        {
          id: "what-is-devsecops",
          title: "What is DevSecOps?",
          description: "The shift-left movement, threat modelling basics, and the shared responsibility model.",
          type: "lesson",
          duration: 14,
          objectives: [
            "Explain the shift-left security philosophy",
            "Distinguish DevSecOps from traditional security gate-keeping",
            "Describe the shared responsibility model in cloud environments",
            "Identify the OWASP Top 10 and how DevSecOps addresses them",
          ],
          content: `## What is DevSecOps?

DevSecOps extends DevOps by weaving security into *every* phase of the software delivery lifecycle — from the first commit to production monitoring — rather than bolting it on at the end.

> **"Shift left"** means catching vulnerabilities early (left on the timeline), when they cost 100× less to fix.

### Why "Shift Left" Actually Works

Before DevSecOps, security was a gate at the end of the release process. A security team would receive a built application, run a penetration test, find 47 vulnerabilities, and hand back a report two weeks before the launch date. The development team would scramble to patch the most critical issues, ship with known vulnerabilities on a waiver, and repeat the cycle next quarter.

The phrase "shift left" refers to moving security checks leftward on a project timeline — earlier, when code is still being written. The economics are compelling: a SQL injection pattern caught by a SAST tool at PR time takes 5 minutes to fix. The same pattern caught by a penetration tester after the app is built takes days to remediate across multiple files. Caught in production after a breach, the cost includes incident response, legal exposure, customer notification, and brand damage — easily a million-dollar event.

### The SDLC Security Gates

A mature DevSecOps pipeline has security checks at every stage:

| Gate | When | Tools | What it catches |
|------|------|-------|-----------------|
| Pre-commit | Developer's machine | gitleaks, detect-secrets | Secrets, obvious mistakes |
| PR/MR | On every pull request | Semgrep, CodeQL, npm audit | Code vulnerabilities, CVE dependencies |
| Build | After merge | Trivy, Checkov | Container CVEs, IaC misconfigs |
| Pre-deploy | Before production | DAST (ZAP), OPA | Runtime issues, policy violations |
| Runtime | In production | Falco, WAF | Attacks in progress, anomalous behavior |

Each gate is a safety net. The goal is not to block developers but to give them fast, actionable feedback. A security finding at the PR stage is a quick fix. A security finding from Falco at 3am is an incident.

### Threat Modeling: The STRIDE Framework

Before writing code, threat modeling structures the question: "what could go wrong?" The STRIDE framework gives six attack categories to evaluate against every component and data flow in your system:

- **Spoofing** — Can an attacker impersonate a legitimate user or service? (stolen JWT, forged request headers)
- **Tampering** — Can data be modified in transit or at rest? (MITM attack, SQL injection modifying database state)
- **Repudiation** — Can actions be denied? (no audit log means an attacker can deny deleting records)
- **Information Disclosure** — Can sensitive data leak? (verbose error messages exposing stack traces, over-permissive API responses)
- **Denial of Service** — Can the system be made unavailable? (unauthenticated endpoints easy to flood, no rate limiting)
- **Elevation of Privilege** — Can access levels be exceeded? (IDOR bugs, insecure direct object references, misconfigured IAM)

For each component in your architecture, run it through these six questions. The output is a threat register that drives mitigation work. Threat modeling is most valuable at design time — when changing architecture costs nothing.

### Security Testing Types Compared

Understanding which tool catches which class of problem prevents overlap and gaps:

| Type | Full Name | How it works | What it finds |
|------|-----------|-------------|---------------|
| **SAST** | Static Application Security Testing | Analyzes source code or bytecode without execution | Injection patterns, hardcoded secrets, insecure function use |
| **DAST** | Dynamic Application Security Testing | Sends malicious inputs to a running application | Auth bypasses, runtime injection, actual exploitable paths |
| **IAST** | Interactive Application Security Testing | Instruments the app at runtime during testing | Both code-level and runtime findings; low false positives |
| **RASP** | Runtime Application Self-Protection | Agent inside the running app blocks attacks | Blocks attacks in production as they happen |
| **SCA** | Software Composition Analysis | Scans dependency manifests against CVE databases | Known vulnerabilities in third-party libraries |

A complete DevSecOps program uses SAST and SCA in the CI pipeline (fast feedback), DAST against staging environments (realistic tests), and RASP or WAF in production (last line of defense).

---

## The Cost of Late Security Fixes

| Phase discovered | Relative cost to fix |
|---|---|
| Design / code review | 1× |
| CI pipeline (SAST) | 5× |
| QA / staging | 10× |
| Production | 100× |
| Public breach | 1000× |

---

## DevOps vs DevSecOps

\`\`\`
DevOps:    Plan → Code → Build → Test → Release → Deploy → Monitor
DevSecOps: Plan → Code → Build → Test → Release → Deploy → Monitor
           ↑Threat ↑SAST  ↑SCA   ↑DAST  ↑Sign     ↑Harden  ↑SIEM
           model   secrets deps   fuzz   images    runtime  alerts
\`\`\`

---

## The Shared Responsibility Model

In cloud environments security is split between the provider and the customer:

| Provider owns | Customer owns |
|---|---|
| Physical hardware | IAM & access control |
| Hypervisor | OS patching (EC2) |
| Managed service infrastructure | Application code |
| Network backbone | Data encryption in transit/at rest |
| Compliance certifications | Compliance configuration |

---

## OWASP Top 10 (2021)

1. Broken Access Control
2. Cryptographic Failures
3. Injection (SQL, NoSQL, LDAP, OS)
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable & Outdated Components
7. Identification & Authentication Failures
8. Software & Data Integrity Failures (supply chain)
9. Security Logging & Monitoring Failures
10. Server-Side Request Forgery (SSRF)

DevSecOps tools address every one of these through automation.

---

## Key Cultural Shifts

- **Security champions** — embed one security-minded engineer per team
- **Blameless post-mortems** — treat vulnerabilities as system failures, not individual mistakes
- **Security as code** — policy and compliance rules live in version-controlled files
- **Automated gates** — pipelines fail on critical findings; humans review, not approve everything

---

## Quick Wins to Start

\`\`\`bash
# 1. Enable branch protection on main
# (GitHub UI: Settings → Branches → Add rule)

# 2. Require signed commits
git config --global commit.gpgSign true

# 3. Add a .gitignore for secrets
echo ".env*" >> .gitignore
echo "*.pem"  >> .gitignore
echo "*.key"  >> .gitignore
\`\`\`

> **Tip:** The single highest-leverage first step is preventing secrets from ever entering version control. Everything else builds on that foundation.`,
          interviewQuestions: [
            {
              question: "What is DevSecOps and how does it differ from 'security as a separate team' model?",
              difficulty: "junior" as const,
              answer: `**Traditional security model:** Security team reviews code and infrastructure at the END of the SDLC (shift-right). Developers throw code over the wall, security says "that's insecure, fix it," then back to the developer queue. Result: security is a bottleneck, findings are late and expensive to fix.

**DevSecOps:** Security is integrated throughout the SDLC — shift-left means finding vulnerabilities earlier (when they're cheaper to fix) and making security automated (not manual):

\`\`\`
DevSecOps Pipeline:
[Code Commit] → [SAST scan] → [SCA/dependency check] → [IaC scan] →
[Container scan] → [DAST] → [Runtime monitoring]
       ↑                                                       ↑
   seconds after commit                           continuous in production
\`\`\`

**Key principles:**
1. **Everything as code**: Security policies, compliance checks, vulnerability thresholds are code, version-controlled, and tested
2. **Automated gates**: Security checks run automatically in CI/CD — developers get fast feedback without waiting for a security review cycle
3. **Shared responsibility**: Developers own security in their domain, not a separate team
4. **Metrics and SLOs**: Track MTTR for vulnerabilities like any other incident

**Practical shift:** Instead of "security team reviews before release," the pipeline runs automatically: Semgrep/CodeQL for SAST, Trivy for containers, Checkov for IaC, and only pages the security team for high-confidence critical findings. 95% of findings are handled without human review.`,
            },
            {
              question: "A developer accidentally commits an AWS access key to a public GitHub repository. What's your incident response?",
              difficulty: "mid" as const,
              answer: `**Assume compromised immediately** — GitHub indexes public repos within minutes, and bots scan for credentials continuously.

**Step 1 — Revoke the credential (< 2 minutes):**
\`\`\`bash
# Identify the key:
git log --all -p | grep -E "AKIA[0-9A-Z]{16}"

# Revoke in AWS Console or CLI:
aws iam delete-access-key \\
  --access-key-id AKIAIOSFODNN7EXAMPLE \\
  --user-name <username>
# If you don't know which user: aws iam get-access-key-last-used --access-key-id AKIA...
\`\`\`

**Step 2 — Assess blast radius:**
\`\`\`bash
# What did this key have access to?
aws iam list-user-policies --user-name <user>
aws iam list-attached-user-policies --user-name <user>

# Was it used after the commit? Check CloudTrail:
aws cloudtrail lookup-events \\
  --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=AKIAIOSFODNN7EXAMPLE \\
  --start-time <commit-time>
\`\`\`

**Step 3 — Remove from git history:**
\`\`\`bash
# git filter-repo (preferred):
pip install git-filter-repo
git filter-repo --path-glob "*.env" --invert-paths

# After rewriting history, force push ALL branches:
git push origin --force --all
# Note: GitHub needs the branch to be unprotected
\`\`\`

**Step 4 — Notify and document:**
- Notify security team
- Create incident timeline
- If key had access to PII/sensitive data → assess breach notification requirements

**Prevention:**
\`\`\`bash
# Pre-commit hook using detect-secrets or gitleaks:
pip install detect-secrets
detect-secrets scan > .secrets.baseline  # committed to repo
# Add pre-commit hook to run detect-secrets scan on each commit

# GitHub secret scanning (enables automatic detection + revocation for some providers):
# Settings → Security → Code Security → Secret scanning
\`\`\``,
            },
          ],
        },
        {
          id: "threat-modeling",
          title: "Threat Modeling with STRIDE",
          description: "Systematically identify threats before writing a single line of code.",
          type: "lesson",
          duration: 12,
          objectives: [
            "Apply the STRIDE framework to a sample application",
            "Create a Data Flow Diagram (DFD)",
            "Prioritise threats with DREAD scoring",
            "Document mitigations in a threat register",
          ],
          content: `## Threat Modeling with STRIDE

Threat modeling is a structured process for identifying security weaknesses in a system's design — before code is written.

---

## STRIDE Categories

| Category | What an attacker can do | Example |
|---|---|---|
| **S**poofing | Pretend to be someone else | Stolen JWT token |
| **T**ampering | Modify data in transit/rest | Man-in-the-middle, SQL injection |
| **R**epudiation | Deny performing an action | No audit logs → can't prove who did what |
| **I**nformation Disclosure | Read data they shouldn't | Verbose error messages exposing stack traces |
| **D**enial of Service | Make a service unavailable | Rate-limit bypass, resource exhaustion |
| **E**levation of Privilege | Gain more access than granted | IDOR, privilege escalation via sudo misconfiguration |

---

## Data Flow Diagram (DFD)

Draw the system at Level 0 (context) then Level 1 (components):

\`\`\`
[User Browser] ──HTTPS──> [Load Balancer] ──HTTP──> [App Server]
                                                          │
                                               [DB (PostgreSQL)]
                                                          │
                                               [Object Store (S3)]
\`\`\`

For each arrow and component ask: *which STRIDE threats apply?*

---

## DREAD Risk Scoring

Score each threat 1–10 per dimension:

| Dimension | Question |
|---|---|
| **D**amage | How bad if exploited? |
| **R**eproducibility | How easily repeatable? |
| **E**xploitability | How much skill required? |
| **A**ffected users | How many impacted? |
| **D**iscoverability | How easy to find? |

\`\`\`
Risk Score = (D + R + E + A + D) / 5
High: 7-10 | Medium: 4-6 | Low: 1-3
\`\`\`

---

## Threat Register Template

\`\`\`markdown
| ID | Component | STRIDE | Description | DREAD | Mitigation | Owner | Status |
|----|-----------|--------|-------------|-------|------------|-------|--------|
| T1 | Auth API  | S      | JWT not validated on every request | 8 | Add middleware | @alice | Open |
| T2 | DB        | T      | No parameterised queries | 9 | Use ORM / prepared statements | @bob | Closed |
\`\`\`

---

## Integrating Threat Modeling into Agile

- **Sprint 0:** Threat model for the overall architecture
- **Story kick-off:** Ask "what can go wrong?" for each new feature
- **Definition of Done:** Include "no new HIGH threats unmitigated"
- **Quarterly review:** Update DFD as architecture evolves

> **Tip:** Use Microsoft Threat Modeling Tool (free) or OWASP Threat Dragon (open-source, web-based) to draw DFDs and auto-suggest STRIDE threats.`,
        },
      ],
      exam: [
        { question: "Your team is designing a new payment API. At what phase should threat modeling occur and what framework would you apply?", answer: "Threat modeling should occur at the design phase (sprint 0 or feature kickoff), before any code is written. Apply the STRIDE framework: identify Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege threats against each component in the data flow diagram. This catches architectural flaws when they cost 1× to fix versus 100× in production.", difficulty: "junior" },
        { question: "A colleague says 'security slows us down — we'll add it after launch.' How do you counter this with data?", answer: "Use the cost-of-fix multiplier: a vulnerability found in code review costs 1× to fix; in production it costs 100×; after a public breach it's 1000×. DevSecOps embeds automated security checks in CI/CD so developers get immediate feedback without waiting for a security team gate. The goal is shifting security left so it's frictionless, not a bottleneck.", difficulty: "junior" },
        { question: "Describe the shared responsibility model for a company running workloads on AWS EC2. Who patches what?", answer: "AWS owns the physical infrastructure, hypervisor, and managed service backbone. The customer owns the EC2 operating system (patching, updates), application code, IAM configuration, data encryption at rest and in transit, security group rules, and compliance configuration. A misconfigured security group exposing port 22 to the internet is entirely the customer's responsibility — AWS has no visibility into that.", difficulty: "junior" },
        { question: "Walk through how DevSecOps addresses OWASP A03: Injection vulnerabilities in a CI/CD pipeline.", answer: "Injection flaws are caught at multiple stages: SAST tools (Semgrep, Bandit) scan source code for string concatenation in SQL queries and flag unsafe patterns at PR time. DAST tools (OWASP ZAP) send malformed inputs to a running staging app to detect runtime injection. SCA tools flag libraries with known injection CVEs. Additionally, code review guidelines and developer training ensure parameterized queries are used from day one.", difficulty: "mid" },
        { question: "What is a 'security champion' and how does embedding one per team improve security outcomes?", answer: "A security champion is a developer on each product team who has additional security training and acts as the team's security conscience. They attend security team meetings, review PRs for security issues, help interpret scanner findings, and evangelize secure coding practices. This scales security expertise across many teams without requiring every developer to be a security expert, and reduces the bottleneck of a central security team reviewing everything.", difficulty: "mid" },
        { question: "Your SAST scanner is producing 200 findings per sprint and developers are ignoring them. How do you fix this?", answer: "First, triage findings by severity and eliminate false positives by tuning scanner rules. Set a policy that only CRITICAL and HIGH findings block the pipeline — MEDIUM/LOW go to a backlog. Introduce a 'fix-one-per-sprint' rule for existing debt. Add a baseline (ignore findings older than today) so new findings are highlighted separately. Work with developers to understand the findings context and improve rule quality. The goal is a signal-to-noise ratio where developers trust the scanner output.", difficulty: "mid" },
        { question: "Explain the difference between a vulnerability and a threat in the context of STRIDE threat modeling.", answer: "A threat is a potential negative action by an adversary (e.g., an attacker replays an authentication token — Spoofing in STRIDE). A vulnerability is a weakness in the system that enables a threat to be realized (e.g., no token expiry or nonce validation). In STRIDE modeling you first enumerate threats per component, then identify which vulnerabilities make each threat feasible, then design controls to mitigate them. Conflating the two leads to reactive patching rather than systematic risk reduction.", difficulty: "mid" },
        { question: "A security audit finds your team has no blameless post-mortem process. Why does this matter for security culture?", answer: "Without blameless post-mortems, engineers fear reporting vulnerabilities or mistakes because they associate disclosure with punishment. This drives security issues underground — bugs get quietly patched without organizational learning, and near-misses go unreported. Blameless post-mortems treat vulnerabilities as system failures, extract systemic improvements (better tooling, process gaps, training needs), and build psychological safety so engineers proactively disclose issues early when they're cheapest to fix.", difficulty: "mid" },
        { question: "Design a DevSecOps pipeline stage gate for a financial services company. What checks must pass before code reaches production?", answer: "Gates in order: (1) Pre-commit: secret scanning (gitleaks), linting. (2) PR/MR: SAST scan with zero new CRITICAL/HIGH, peer code review with security checklist. (3) Build: SCA scan — no CVE CRITICAL dependencies, SBOM generated. (4) Staging: DAST scan against running app, container image scan (Trivy) — no CRITICAL vulns. (5) Pre-prod: IaC scan (Checkov) passes, penetration test sign-off for major releases, compliance policy check (OPA). (6) Production: signed container images verified, runtime security (Falco) enabled, audit logging active.", difficulty: "senior" },
        { question: "How would you measure the maturity of a DevSecOps program? What metrics would you present to leadership?", answer: "Use the OWASP SAMM or BSIMM maturity model as a framework. Key metrics: Mean Time to Remediate (MTTR) by severity (CRITICAL < 24h, HIGH < 7 days), vulnerability escape rate (% of vulns found in prod vs. caught in pipeline), pipeline security gate coverage (% of repos with SAST/SCA/container scanning), secrets-in-code incidents per quarter, security training completion rate, and cost-per-vulnerability-found (caught in CI is far cheaper than post-breach). Present trend lines quarter-over-quarter to show improvement velocity.", difficulty: "senior" },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 2 — Version Control Security
    // ─────────────────────────────────────────
    {
      id: "version-control-security",
      title: "Secure Version Control & Branching",
      description: "Git security best practices, branching strategies, and preventing secrets in source code.",
      level: "beginner",
      lessons: [
        {
          id: "git-security-practices",
          title: "Git Security Best Practices",
          description: "Signed commits, branch protection, and auditing your repository history.",
          type: "lesson",
          duration: 15,
          objectives: [
            "Configure GPG commit signing",
            "Enforce branch protection rules",
            "Audit git history for accidentally committed secrets",
            "Use git hooks for pre-commit security checks",
          ],
          content: `## Git Security Best Practices

Git is the foundation of your supply chain. A misconfigured repository can expose secrets, allow unauthorized force-pushes, or permit unsigned code to reach production.

## How It Works: Git History Is Permanent

One of the most misunderstood properties of Git is that history is essentially permanent — especially after it has been pushed to a remote. When you delete a file and push, the file content is gone from the working tree, but every previous commit that included that file is still traversable through the commit graph. Anyone who cloned the repository before or after the deletion can access it.

More critically: secrets committed to a public GitHub repository are indexed by bots within minutes. Automated scanners continuously search public repositories and pull request histories for credentials. The moment an API key touches a public repository, you should assume it has been harvested. The credential must be revoked immediately — rewriting history to remove it only prevents *future* exposure.

The mechanics of \`git filter-repo\` rewrite the commit SHAs, producing a new history that is incompatible with any existing clone. After rewriting, everyone who has cloned the repository must re-clone — there is no merge path. This is disruptive, which is why prevention (pre-commit hooks, server-side scanning) is far better than remediation.

## How It Works: Pre-Commit Hooks

The \`.git/hooks/pre-commit\` file is an executable script that Git runs before creating each commit. If it exits non-zero, the commit is aborted. This is the perfect place to run fast security checks that catch issues before they enter history.

The raw hook approach has two problems: hooks are not committed to the repository (each developer must install them manually), and there is no versioning or dependency management. The \`pre-commit\` framework (confusingly also named pre-commit) solves both problems — it stores hook configuration in \`.pre-commit-config.yaml\` (committed to the repo), handles dependency installation, and provides a library of ready-made hooks.

**Important limitation**: Pre-commit hooks are client-side and can be bypassed with \`git commit --no-verify\`. They are the first line of defense, not the authoritative gate. Server-side controls (GitHub Advanced Security, GitLab Secret Detection with push protection) are the enforceable gate that developers cannot bypass.

## How It Works: Secret Scanners

Tools like \`gitleaks\` and \`truffleHog\` use two complementary techniques to find secrets:

1. **Regex pattern matching** — They maintain catalogs of patterns for known secret formats. An AWS access key always starts with \`AKIA\` and is 20 characters. A private key always starts with \`-----BEGIN RSA PRIVATE KEY-----\`. These patterns have near-zero false positives.

2. **Entropy analysis** — Random secrets (API keys, passwords) have high Shannon entropy because they contain evenly-distributed characters. Normal English text has low entropy. By scanning strings above a threshold (typically 4.5 bits/character), they catch custom secrets that don't match known patterns. This produces some false positives (legitimate high-entropy strings like base64-encoded data) but catches secrets that regex alone would miss.

## How It Works: CODEOWNERS

The \`CODEOWNERS\` file (lives at \`.github/CODEOWNERS\`, \`.gitlab/CODEOWNERS\`, or \`CODEOWNERS\` in the repo root) maps file patterns to GitHub/GitLab users or teams who must review any PR touching those files. It is enforced by branch protection rules:

\`\`\`
# .github/CODEOWNERS

# Security-sensitive files require security team review
.github/workflows/        @org/security-team
k8s/secrets/              @org/security-team @org/platform-team
terraform/iam/            @org/security-team
**/Dockerfile             @org/platform-team

# Core business logic requires senior engineer review
src/billing/              @org/backend-senior
src/payments/             @org/backend-senior @org/security-team
\`\`\`

When a developer opens a PR that touches \`src/payments/\`, GitHub automatically adds \`@org/backend-senior\` and \`@org/security-team\` as required reviewers. The PR cannot be merged without their approval. This prevents security-sensitive changes from being merged by a developer acting alone.

---

## Commit Signing with GPG

Signing proves a commit came from you, not an impersonator.

\`\`\`bash
# Generate a GPG key
gpg --full-generate-key
# Choose RSA 4096, no expiry (or 2y for better hygiene)

# List your keys
gpg --list-secret-keys --keyid-format=long

# Export public key → paste into GitHub Settings → GPG Keys
gpg --armor --export YOUR_KEY_ID

# Tell git to use your key
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgSign true

# Verify a signed commit
git log --show-signature -1
\`\`\`

---

## Branch Protection Rules (GitHub)

Navigate to **Settings → Branches → Add rule** and enable:

| Rule | Why |
|---|---|
| Require pull request reviews (≥1) | Peer review catches issues |
| Require status checks to pass | CI must be green |
| Require signed commits | Prevent spoofed authorship |
| Restrict force pushes | Protect history |
| Require linear history | Easier audit trail |
| Require conversation resolution | No dismissed review comments |

\`\`\`bash
# Equivalent via GitHub CLI
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field enforce_admins=true \
  --field required_status_checks='{"strict":true,"contexts":["ci/tests"]}'
\`\`\`

---

## Detecting Secrets in History

Even after deleting a file, secrets persist in git history.

\`\`\`bash
# Install git-secrets (AWS patterns)
brew install git-secrets
git secrets --install
git secrets --register-aws

# Or use truffleHog to scan full history
pip install trufflehog
trufflehog git file://. --since-commit HEAD~50

# Or use gitleaks (fast Go binary)
brew install gitleaks
gitleaks detect --source . -v
\`\`\`

If a secret is found in history, you must:
1. Revoke the secret immediately (rotate credentials)
2. Rewrite history with \`git filter-repo\` (not filter-branch)
3. Force-push (coordinate with team — everyone must re-clone)

\`\`\`bash
# Remove a file from all history (after installing git-filter-repo)
git filter-repo --path secrets.env --invert-paths
git push origin --force --all
\`\`\`

---

## Pre-commit Hooks

Hooks run locally before a commit is created.

\`\`\`bash
# Install pre-commit framework
pip install pre-commit

# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: detect-private-key
      - id: check-added-large-files  # prevents accidental binary commits
      - id: trailing-whitespace
\`\`\`

\`\`\`bash
pre-commit install     # installs hook into .git/hooks/pre-commit
pre-commit run --all-files  # run manually on existing code
\`\`\`

> **Tip:** Pre-commit hooks run client-side. They can be bypassed with \`git commit --no-verify\`. Always add server-side secret scanning (GitHub Advanced Security, GitLab Secret Detection) as the authoritative gate.`,
        },
        {
          id: "branching-strategies",
          title: "Branching Strategies for Security",
          description: "GitFlow, trunk-based development, release branching, and security patch workflows.",
          type: "lesson",
          duration: 13,
          objectives: [
            "Compare GitFlow vs trunk-based development from a security perspective",
            "Implement a hotfix/security patch workflow",
            "Use feature flags to decouple deployment from release",
            "Apply semantic versioning to security releases",
          ],
          content: `## Branching Strategies for Security

Your branching model determines how quickly you can ship a security patch. A model optimised for slow, scheduled releases is dangerous in an incident.

---

## GitFlow

\`\`\`
main ──────────────────────────────────────── (always shippable)
  \\
   develop ──────────────────────────────────
     \\            \\
      feature/x    feature/y
              \\
               release/1.2 ── hotfix/1.2.1
\`\`\`

**Security pros:** Dedicated release branch allows security hardening before shipping.
**Security cons:** Long-lived branches diverge heavily — merge conflicts can mask vulnerability fixes.

---

## Trunk-Based Development (TBD)

\`\`\`
main ──●──●──●──●──●──●──●──●──  (deployable at every commit)
        \\              \\
         short-lived    short-lived
         feature (<2d)  feature (<2d)
\`\`\`

**Security pros:** No long-lived branches → no drift → security patches reach prod in hours.
**Security cons:** Requires robust feature flags to hide incomplete features.

---

## Security Patch / Hotfix Workflow

\`\`\`bash
# 1. Branch from the production tag
git checkout -b hotfix/CVE-2024-1234 v2.3.1

# 2. Apply minimal fix (no unrelated changes)
# Fix the vulnerability...
git commit -S -m "fix: patch SSRF in webhook handler (CVE-2024-1234)"

# 3. Open PR → expedited review (2 approvers minimum)
gh pr create --title "Security: CVE-2024-1234" --label "security,hotfix"

# 4. After merge, tag immediately
git tag -s v2.3.2 -m "Security release: CVE-2024-1234"
git push origin v2.3.2

# 5. Also merge fix forward to main / develop
git checkout main && git cherry-pick <sha>
\`\`\`

---

## Semantic Versioning for Security

\`\`\`
MAJOR.MINOR.PATCH
  │      │     └─ Backwards-compatible bug/security fix → bump PATCH
  │      └─────── New feature, backwards-compatible → bump MINOR
  └────────────── Breaking change → bump MAJOR
\`\`\`

Security-only releases always bump PATCH (or MINOR if the fix requires an API change).

Use **CHANGELOG.md** to communicate CVE details:

\`\`\`markdown
## [2.3.2] - 2024-03-15
### Security
- Fix SSRF vulnerability in webhook handler (CVE-2024-1234, CVSS 8.1)
  Users on 2.x should upgrade immediately.
\`\`\`

---

## Feature Flags for Safe Deployments

Decouple *deployment* (code in prod) from *release* (users can use it):

\`\`\`typescript
// Simple environment-variable flag
const NEW_AUTH_FLOW = process.env.ENABLE_NEW_AUTH === "true";

if (NEW_AUTH_FLOW) {
  return newAuthHandler(req, res);
} else {
  return legacyAuthHandler(req, res);
}
\`\`\`

Benefits for security:
- Ship unfinished security-sensitive features to prod but disabled
- Enable only for internal users first (canary)
- Kill-switch: disable without a deploy if a vulnerability is found

> **Tip:** Use a dedicated feature flag service (LaunchDarkly, Unleash, Flagsmith) rather than env vars for production — they support per-user targeting and instant kill-switches.`,
        },
        {
          id: "secret-management",
          title: "Secret Management",
          description: "Vault, environment variables, CI secret stores, and rotation strategies.",
          type: "lesson",
          duration: 16,
          objectives: [
            "Explain why .env files should never be committed",
            "Configure GitHub Actions secrets and environment protection",
            "Use HashiCorp Vault for dynamic secret generation",
            "Implement automatic secret rotation",
          ],
          content: `## Secret Management

Secrets are credentials, API keys, TLS certificates, and database passwords. The #1 cause of cloud breaches is exposed secrets.

## How It Works: The Secret Lifecycle

Every secret has a lifecycle: creation, distribution, rotation, and revocation. Most breaches happen because one of these stages is handled poorly.

**Creation**: Secrets should be generated with sufficient entropy (at least 256 bits for symmetric keys). Never create predictable secrets — no dictionary words, no incremental IDs.

**Distribution**: The critical question is: how does the running application get the secret without the secret appearing in plaintext in a configuration file, environment variable in a Dockerfile, or CI pipeline log? The options range from least to most secure:
- Hardcoded in code (never do this)
- Committed \`.env\` file (almost as bad)
- CI/CD environment variable (acceptable for low-value secrets)
- Kubernetes Secret (acceptable with RBAC and etcd encryption)
- Secrets manager at startup (good — HashiCorp Vault, AWS Secrets Manager)
- Dynamic/short-lived credentials (best — credentials expire after minutes/hours)

**Rotation**: Static secrets are a liability that grows over time. The longer a credential exists, the more opportunity for exposure. Automated rotation via Vault or AWS Secrets Manager eliminates this risk. The ideal is that credentials expire so quickly that stolen credentials are useless by the time an attacker can use them.

**Revocation**: When a secret is compromised, revocation must be immediate and complete. This means having a tested revocation procedure before an incident happens, not during one.

## How It Works: HashiCorp Vault Architecture

Vault is a sophisticated secrets management system, and understanding its architecture explains why it is trusted for high-security environments.

**Storage backend**: Vault does not store secrets in plaintext. It encrypts all data before writing to its storage backend (which can be Consul, S3, etcd, or a database). The encryption key is derived from the unseal keys.

**Seal/Unseal**: Vault starts in a sealed state — it cannot read its own data. To unseal, operators provide a minimum number of unseal key shares (typically 3 of 5). This ensures no single person can unseal Vault alone. AWS KMS Auto-unseal eliminates this manual step by using a KMS key to automatically unseal Vault when it starts.

**Auth methods**: Vault supports many ways to authenticate: Kubernetes (pods authenticate using their service account JWT, validated against the Kubernetes API), AWS IAM (instances authenticate using their instance identity document), OIDC (human authentication via SSO), AppRole (for services without a cloud identity). Each auth method issues a Vault token with a TTL.

**Policies**: Vault policies (written in HCL or JSON) control which paths a token can access and with what operations. A \`payments-service\` policy might grant \`read\` on \`database/creds/payments-role\` and nothing else — even if the token is compromised, the blast radius is limited to one set of database credentials.

**Dynamic secrets**: The most powerful Vault feature. Instead of storing static database passwords, Vault connects to your database and creates a unique username/password pair on demand. The credentials expire after a configured TTL (e.g., 1 hour), Vault automatically revokes them when they expire, and the entire lifecycle is audited. An attacker who steals these credentials finds them already expired.

## How It Works: SOPS (Secrets OPerationS)

SOPS solves a different problem: some teams want to store secrets in Git (for GitOps workflows) but encrypted. SOPS encrypts individual values within YAML, JSON, or environment files, leaving the keys (field names) visible for code review while encrypting values.

\`\`\`yaml
# Before encryption (secrets.yaml)
database:
  password: "my-super-secret-password"

# After sops encryption (stored in Git)
database:
  password: ENC[AES256_GCM,data:xQ2k...,tag:ab12...,type:str]
sops:
  kms:
    - arn: arn:aws:kms:us-east-1:123456789:key/mrk-abc123
      created_at: "2024-01-15T10:00:00Z"
\`\`\`

SOPS uses cloud KMS (AWS KMS, GCP KMS, Azure Key Vault) or PGP to hold the data encryption key. Only principals with KMS decrypt permission can read the secrets. A developer's \`git diff\` shows field names changed (useful for code review) without revealing values.

## AWS Secrets Manager vs Parameter Store

These are two different services that serve similar but distinct use cases:

| Feature | Secrets Manager | Parameter Store |
|---------|----------------|-----------------|
| Cost | ~$0.40/secret/month | Free for standard, $0.05/param/month advanced |
| Automatic rotation | Built-in (Lambda-backed) | DIY |
| Cross-account access | Yes | Limited |
| Best for | Database passwords, API keys needing rotation | Config values, feature flags, connection strings |

For database credentials with automatic rotation (HIPAA, PCI-DSS requirements), Secrets Manager is the right choice. For non-sensitive configuration values or when cost is a concern, Parameter Store is appropriate.

---

## The Secret Anti-patterns

\`\`\`bash
# ❌ Hardcoded in source
DB_PASSWORD = "hunter2"

# ❌ In .env committed to git
echo "DB_PASSWORD=hunter2" >> .env
git add .env && git commit -m "add config"

# ❌ Printed to logs
console.log("Connecting with password:", process.env.DB_PASSWORD)

# ❌ In Docker image
ENV DB_PASSWORD=hunter2
\`\`\`

---

## GitHub Actions Secrets

\`\`\`yaml
# Settings → Secrets and variables → Actions → New secret

jobs:
  deploy:
    environment: production          # environment-level protection
    steps:
      - name: Deploy
        env:
          DB_URL: \${{ secrets.DATABASE_URL }}
          AWS_KEY: \${{ secrets.AWS_ACCESS_KEY_ID }}
        run: ./deploy.sh
\`\`\`

**Environment protection rules:**
- Require reviewers before secrets are exposed
- Limit to specific branches (e.g., only \`main\`)
- Add deployment wait timer

\`\`\`bash
# Add a secret via CLI
gh secret set DATABASE_URL --body "postgres://..." --env production
\`\`\`

---

## HashiCorp Vault

Vault is the industry standard for secrets management at scale.

\`\`\`bash
# Start dev server (local testing only)
vault server -dev

export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN='root'

# Write a secret
vault kv put secret/myapp/db \
  username="app_user" \
  password="s3cr3t"

# Read it back
vault kv get secret/myapp/db
vault kv get -field=password secret/myapp/db

# Dynamic database credentials (auto-expire after TTL)
vault secrets enable database
vault write database/config/mydb \
  plugin_name=postgresql-database-plugin \
  connection_url="postgresql://{{username}}:{{password}}@localhost/mydb" \
  allowed_roles="app-role" \
  username="vault_admin" \
  password="vault_admin_pass"

vault write database/roles/app-role \
  db_name=mydb \
  creation_statements="CREATE ROLE \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}';" \
  default_ttl="1h" \
  max_ttl="24h"

# App reads fresh credentials each time
vault read database/creds/app-role
\`\`\`

---

## Fetching Vault Secrets in CI

\`\`\`yaml
# GitHub Actions with Vault OIDC (no static token)
- name: Import Secrets
  uses: hashicorp/vault-action@v3
  with:
    url: https://vault.example.com
    method: jwt
    role: github-actions
    secrets: |
      secret/data/myapp/db password | DB_PASSWORD ;
      secret/data/myapp/db username | DB_USERNAME
\`\`\`

---

## Rotation Strategy

| Secret type | Rotation frequency | Method |
|---|---|---|
| Database passwords | Every 30 days | Vault dynamic creds |
| API keys | Every 90 days | Automated via script |
| TLS certificates | Before expiry (Let's Encrypt auto) | cert-manager |
| SSH keys | Every 180 days | Key rotation policy |
| Root/admin credentials | Every 365 days | Manual + MFA |

\`\`\`bash
# Detect expiring AWS keys (rotate before they expire)
aws iam list-access-keys --user-name deploy-bot \
  | jq '.AccessKeyMetadata[] | {KeyId, CreateDate, Status}'

# Rotate
aws iam create-access-key --user-name deploy-bot
aws iam delete-access-key --user-name deploy-bot --access-key-id OLD_KEY_ID
\`\`\`

> **Tip:** Prefer short-lived credentials (OIDC, instance roles, Vault dynamic) over long-lived static keys. A credential that lives 1 hour is 8760× less risky than one that lives a year.`,
        },
      ],
      exam: [
        { question: "A developer accidentally commits an AWS secret key to a public GitHub repo. Walk through your incident response steps.", answer: "Immediate response (first 5 minutes): (1) Revoke the exposed key in AWS IAM immediately — do not wait. (2) Check CloudTrail for any API calls made with the key since the commit timestamp. (3) Remove the secret from git history using git filter-repo or BFG Repo Cleaner and force-push. (4) Rotate any other credentials that may have been exposed in the same commit. (5) Check GitHub's secret scanning alerts. Long term: add pre-commit hooks with gitleaks, configure GitHub secret scanning with push protection, and use a secrets manager (Vault, AWS Secrets Manager) so secrets never appear in code.", difficulty: "junior" },
        { question: "What is a signed commit and why would a security-conscious team require them?", answer: "A signed commit uses a developer's GPG or SSH key to cryptographically sign the commit, proving it was authored by someone who controls the private key. Without signing, anyone with write access (or who compromises a developer account) can author commits as any username. Teams require signed commits to ensure supply-chain integrity — you can verify that every commit in main was authored by a verified team member. GitHub's 'vigilant mode' marks unsigned commits as unverified. Enforcement is via branch protection rules requiring signed commits.", difficulty: "junior" },
        { question: "You find a private API key hardcoded in a git repo's history from 2 years ago. The key is now rotated. Is there still a risk?", answer: "Yes. Git history is permanent and widely cloned. Even if the key is rotated, the history reveals: (1) your secret management practices (or lack thereof), (2) the secret format and length which aids future attacks, (3) context about what service the key accessed. If the repo was ever public or the history was accessed by attackers, they had the key. Best practice: clean the history with git filter-repo, audit who cloned during the exposure window, and treat the exposed service as potentially compromised. Also review if the service logs showed unauthorized access during the window.", difficulty: "mid" },
        { question: "Compare trunk-based development to GitFlow from a security perspective. Which is more secure and why?", answer: "Trunk-based development is generally more secure because: (1) short-lived feature branches mean code reaches main quickly, reducing merge conflict complexity that hides vulnerabilities; (2) security scans run continuously on trunk rather than only at release time; (3) smaller, frequent merges are easier to review for security issues; (4) there's a single source of truth so security policies apply consistently. GitFlow's long-lived branches (develop, release) delay security scanning, accumulate larger diffs that are harder to review, and create more surfaces for conflicts that obscure malicious changes.", difficulty: "mid" },
        { question: "Your team uses GitHub Actions and a developer wants to use a third-party community action. What security checks do you perform?", answer: "Before using a third-party action: (1) Pin the action to a specific commit SHA (not a mutable tag like @v2, which can be changed by the maintainer). (2) Review the action's source code for suspicious behavior — network calls, secret exfiltration, unexpected file writes. (3) Check the publisher's reputation and whether the repo has recent activity. (4) Use the principle of least privilege — pass only the secrets the action needs via env vars, not the full GITHUB_TOKEN. (5) Consider forking and maintaining the action internally for critical workflows. (6) Enable Dependabot for Actions to get notified of updates.", difficulty: "mid" },
        { question: "What is git-crypt and when would you use it over a secrets manager like HashiCorp Vault?", answer: "git-crypt transparently encrypts specified files in a git repo using GPG keys. Files are encrypted at rest in the repo but decrypted automatically for authorized developers. Use git-crypt when: small team, simple secret needs, secrets are closely tied to the codebase (e.g., config files), and operational overhead of running Vault is disproportionate. Prefer Vault when: dynamic credential generation is needed, fine-grained access control per service is required, audit logs of secret access are mandatory, secrets need to be rotated without a git commit, or you have many services with different access patterns. git-crypt is not suitable for high-compliance environments.", difficulty: "mid" },
        { question: "Explain how OIDC-based authentication in GitHub Actions eliminates the need for long-lived cloud credentials.", answer: "With OIDC: GitHub Actions generates a short-lived JWT token for each workflow run, signed by GitHub's OIDC provider. AWS (or GCP/Azure) is configured to trust GitHub's OIDC provider via an IAM identity provider. The workflow exchanges the JWT for temporary AWS credentials (via sts:AssumeRoleWithWebIdentity) that expire after the job completes (typically 1 hour). No static AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is stored anywhere — there's nothing to rotate, leak, or steal. The trust policy can restrict which repos and branches can assume the role.", difficulty: "senior" },
        { question: "Design a branch protection policy for a high-compliance (SOC 2) SaaS product's main branch.", answer: "Required settings: (1) Require pull request reviews — minimum 2 approvers, dismiss stale reviews on new commits, require review from code owners for sensitive directories. (2) Require status checks — SAST scan must pass, SCA scan must pass, all CI tests green. (3) Require signed commits. (4) Require linear history (no merge commits from feature branches — squash or rebase only). (5) Restrict who can push to main — only via PR, no direct pushes even for admins. (6) Require branch to be up to date before merging. (7) Enable secret scanning push protection. Log all rule bypasses for audit.", difficulty: "senior" },
        { question: "A red team finds they can inject malicious code via a dependency confusion attack. Explain the attack and how you mitigate it.", answer: "Dependency confusion: an attacker publishes a public package with the same name as your private internal package but a higher version number. Package managers (npm, pip, Maven) that check public registries first will download the attacker's package instead of yours. Mitigations: (1) Scope all private packages (e.g., @company/package-name for npm). (2) Configure your package manager to check the private registry first with a registry mirror. (3) Use a dependency proxy (Artifactory, Nexus) that proxies public registries and enforces allow lists. (4) Pin exact versions and commit lock files. (5) Use SCA to detect packages from unexpected sources.", difficulty: "senior" },
        { question: "How would you implement a secret rotation strategy for database credentials used by 10 microservices without downtime?", answer: "Use a secrets manager (Vault or AWS Secrets Manager) with dynamic credential generation. Vault's database secrets engine generates unique short-lived credentials per service per lease period. Rotation process: (1) Vault generates new credentials before expiry; services fetch credentials at startup or via sidecar. (2) For static credential rotation without dynamic secrets: use a two-phase rotation — create new credential alongside old, update all services to accept both (or redeploy with new creds via rolling deployment), then revoke old credential only after all instances are running with the new one. (3) Services should handle credential refresh errors gracefully by retrying with a fetched fresh credential from the secrets manager rather than hard-coding the retry logic.", difficulty: "senior" },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 3 — CI/CD Security
    // ─────────────────────────────────────────
    {
      id: "cicd-security",
      title: "CI/CD Pipeline Security",
      description: "SAST, SCA, DAST, container scanning, and supply chain security in automated pipelines.",
      level: "intermediate",
      lessons: [
        {
          id: "sast-and-sca",
          title: "SAST & Dependency Scanning",
          description: "Static analysis and software composition analysis to catch vulnerabilities before runtime.",
          type: "lesson",
          duration: 18,
          objectives: [
            "Integrate Semgrep SAST into a GitHub Actions pipeline",
            "Run OWASP Dependency-Check for SCA",
            "Triage false positives and suppress findings",
            "Enforce a quality gate that blocks deployments on critical findings",
          ],
          content: `## SAST & Dependency Scanning

**SAST** (Static Application Security Testing) analyses source code without executing it.
**SCA** (Software Composition Analysis) analyses third-party libraries for known CVEs.

## How It Works: SAST and Abstract Syntax Trees

SAST tools don't just use \`grep\` for vulnerability patterns — they parse source code into an Abstract Syntax Tree (AST) and reason about data flow. This is why they can find a SQL injection where user input travels through five function calls before reaching a database query, or detect that a taint (untrusted data from HTTP request) reaches a sink (SQL execution) without passing through a sanitization function.

Semgrep is a modern SAST tool that balances AST-based analysis with approachable rule syntax. A Semgrep rule has two key parts:
- **Pattern**: describes the code structure to match (using metavariables like \`$VAR\` to match any expression)
- **Metavariable-pattern**: adds constraints on what the matched expression must look like

This allows rules like "find any place where string concatenation is used to build a SQL query, where the concatenated value is not from a whitelist." This is more powerful than regex because it understands code structure.

**How to write a Semgrep rule:**

\`\`\`yaml
# Rule: detect SQL injection via string concatenation
rules:
  - id: sql-injection-concatenation
    patterns:
      - pattern: |
          $DB.query($QUERY + $USER_INPUT)
      - pattern-not: |
          $DB.query($QUERY + "...")    # string literals are OK
    message: "Potential SQL injection: use parameterized queries instead"
    languages: [javascript, typescript, python]
    severity: ERROR
\`\`\`

The \`pattern-not\` clause prevents false positives — hardcoded string concatenation is not a risk.

## How It Works: SonarQube Quality Gates

SonarQube adds an important concept beyond finding vulnerabilities: it tracks **technical debt** over time and enforces quality gates that prevent code quality from degrading.

A quality gate is a set of conditions that must all pass before code is considered clean. A typical production quality gate:
- New code must have 0 critical or blocker issues
- Test coverage on new code must be ≥ 80%
- No new code smells in the "bad" category
- Duplicated code lines ≤ 3%

When a PR fails the quality gate, the CI pipeline shows a failure and developers see exactly which conditions failed. This is more useful than a binary pass/fail because it explains *what* needs fixing.

**Important**: SonarQube tracks findings over time, allowing a "new code" strategy: only fail the build on issues introduced *since* a specific date or on the current branch. This prevents legacy tech debt from blocking new development while ensuring new code is clean.

## How It Works: CVE Scoring and CVSS

When SCA tools report vulnerabilities, they assign a CVSS (Common Vulnerability Scoring System) score from 0.0 to 10.0. Understanding CVSS scores prevents both over-reaction and under-reaction to findings.

CVSS v3 has three score groups:
- **Base score**: Inherent characteristics of the vulnerability (attack vector, complexity, privileges required, user interaction, scope, impact). This is the number you usually see (e.g., CVE-2021-44228 Log4Shell: 10.0).
- **Temporal score**: Adjusts base score based on exploit maturity (is there a working exploit in the wild?) and remediation level (is a patch available?). A 9.8 with no known exploit and a patch available is less urgent than a 7.5 with active exploitation.
- **Environmental score**: Adjusts for your specific environment. If your application never exposes the vulnerable component to untrusted input, the exploitability is lower in your context.

**The practical implications**: A CRITICAL (9.0+) CVE in a library your application uses but that is only reachable from an internal-only endpoint is very different from the same CVE in a public-facing API endpoint. SCA tools report the base score; your security team determines the environmental score.

## How It Works: Transitive Dependencies

Package managers install not just your direct dependencies but also *their* dependencies — and so on, recursively. A typical Node.js application with 50 direct dependencies might have 1000+ transitive dependencies. The 2021 Log4Shell vulnerability was devastating partly because Log4j appeared as a transitive dependency in thousands of applications where development teams did not know they were using it.

This is why SCA tools analyze the entire dependency tree (from \`package-lock.json\`, \`pom.xml\`, \`go.sum\`, etc.) rather than just the top-level \`package.json\`. They can answer: "Does your application, directly or transitively, use Log4j version 2.0.0-2.14.1?"

**Dependabot vs Snyk vs OWASP Dependency-Check:**
- **Dependabot**: Built into GitHub, automatically opens PRs to update vulnerable dependencies. Best for teams wanting automation without tool configuration.
- **Snyk**: Commercial tool with deeper analysis (reachability analysis: does your code actually call the vulnerable function?), license compliance, and developer-friendly fix guidance.
- **OWASP Dependency-Check**: Open source, multi-language, integrates with CI. No reachability analysis but no cost.

---

## SAST with Semgrep

Semgrep uses pattern-matching rules to find security bugs fast.

\`\`\`bash
# Install
pip install semgrep

# Run with OWASP Top 10 rules
semgrep --config=p/owasp-top-ten .

# Run with security-audit ruleset
semgrep --config=p/security-audit .

# JSON output for CI
semgrep --config=p/owasp-top-ten --json > semgrep-results.json
\`\`\`

**GitHub Actions integration:**

\`\`\`yaml
name: SAST
on: [push, pull_request]

jobs:
  semgrep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: semgrep/semgrep-action@v1
        with:
          config: >-
            p/owasp-top-ten
            p/secrets
            p/nodejs
        env:
          SEMGREP_APP_TOKEN: \${{ secrets.SEMGREP_APP_TOKEN }}
\`\`\`

---

## Custom Semgrep Rules

\`\`\`yaml
# .semgrep/custom.yaml
rules:
  - id: no-eval
    patterns:
      - pattern: eval(...)
    message: "eval() is dangerous — use JSON.parse() or a safe alternative"
    severity: ERROR
    languages: [javascript, typescript]

  - id: no-md5-passwords
    patterns:
      - pattern: crypto.createHash("md5").update($PASSWORD).digest(...)
    message: "MD5 is broken for passwords — use bcrypt or argon2"
    severity: ERROR
    languages: [javascript, typescript]
\`\`\`

---

## SCA with npm audit & OWASP Dependency-Check

\`\`\`bash
# Built-in npm audit
npm audit
npm audit --audit-level=high   # exit code 1 if HIGH+ found
npm audit fix                   # auto-fix where possible

# OWASP Dependency-Check (multi-language)
docker run --rm \
  -v \$(pwd):/src \
  owasp/dependency-check \
  --project "myapp" \
  --scan /src \
  --format HTML \
  --out /src/reports
\`\`\`

\`\`\`yaml
# GitHub Actions — combined SAST + SCA
- name: Dependency Audit
  run: npm audit --audit-level=critical

- name: License Check
  run: npx license-checker --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause"
\`\`\`

---

## Managing False Positives

\`\`\`bash
# Suppress a specific Semgrep finding inline
result = eval(user_input)  # nosemgrep: no-eval (reason: sandboxed VM context)

# Suppress in config
rules:
  - id: no-eval
    ...
    paths:
      exclude:
        - tests/
        - "*.test.ts"
\`\`\`

\`\`\`bash
# npm — accept a known non-exploitable advisory
npm audit --audit-level=high  # review the advisory ID
npm audit fix --force         # only if you understand the change
\`\`\`

---

## Quality Gate Pattern

\`\`\`yaml
jobs:
  security-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: SAST
        run: semgrep --config=p/owasp-top-ten --error .
        # --error exits with code 1 on any finding

      - name: Dependency Audit
        run: npm audit --audit-level=high

      - name: Check Gate
        if: failure()
        run: |
          echo "Security gate FAILED. Review findings before merging."
          exit 1
\`\`\`

> **Tip:** Start with \`--audit-level=critical\` in CI (so only critical findings block) and progressively tighten to \`high\` as your backlog reduces. Never start at \`low\` — alert fatigue kills adoption.`,
          interviewQuestions: [
            {
              question: "Explain the difference between SAST, DAST, and SCA. When does each run in a CI/CD pipeline?",
              difficulty: "junior" as const,
              answer: `**SAST (Static Application Security Testing):**
- Analyzes source code without running it
- Finds: SQL injection patterns, XSS, hardcoded secrets, insecure crypto
- Runs at: PR time, pre-merge (fast, seconds to minutes)
- Tools: Semgrep, CodeQL, SonarQube, Checkmarx

**SCA (Software Composition Analysis):**
- Scans third-party dependencies/libraries for known CVEs
- Finds: vulnerable package versions (e.g., Log4j CVE-2021-44228)
- Runs at: PR time, daily scheduled scans (CVEs are discovered continuously)
- Tools: Dependabot, Snyk, npm audit, Trivy (for containers)

**DAST (Dynamic Application Security Testing):**
- Tests the running application by sending malicious inputs
- Finds: runtime vulnerabilities, auth bypasses, actual exploitable paths
- Runs at: staging environment, post-deploy (needs a running app)
- Tools: OWASP ZAP, Burp Suite, Nuclei

**Pipeline placement:**
\`\`\`
[Commit] → SAST + SCA ← (fast gates, block on critical)
[PR Merge] → Build image → Container scan (Trivy)
[Deploy to Staging] → DAST scan (ZAP)
[Production] → Runtime protection (WAF, RASP)
\`\`\`

**Why the order matters:** SAST at commit is cheapest (catches issues before the code even runs). DAST at staging is most accurate but slowest (requires a deployed environment). Running DAST against production is possible but risky — use a separate production-like environment.`,
            },
            {
              question: "You've integrated SAST into CI/CD and it reports 300 findings. How do you triage and prioritize without blocking all development?",
              difficulty: "mid" as const,
              answer: `**Immediate triage strategy:**

**1. Start permissive, tighten over time:**
\`\`\`yaml
# Week 1: Only block on CRITICAL, report others
- name: Semgrep
  run: semgrep --config auto --severity=ERROR --error
  # ERROR = CRITICAL findings → fail build
  # WARN/INFO → report but don't fail
\`\`\`

**2. Establish a baseline:**
\`\`\`bash
# Scan current codebase, mark ALL current findings as accepted (technical debt)
semgrep --config auto --json > baseline.json
# Commit baseline.json — only NEW findings since baseline fail the build
# This prevents existing tech debt from blocking new work
\`\`\`

**3. Triage the 300 findings:**
- **True positives critical**: Fix immediately, block
- **True positives non-critical**: Add to sprint backlog, track as tech debt
- **False positives**: Suppress with inline comments or rule exceptions:
\`\`\`python
# nosec: B105 — this is not a password, it's a config key name
CONFIG_KEY = "password_field"  # noqa: S105
\`\`\`

**4. Prioritize by:**
- Severity (CRITICAL > HIGH > MEDIUM > LOW)
- Reachability (is the vulnerable code actually called in a user-facing path?)
- CVSS score + exploitability (is there a working exploit in the wild?)

**5. Track metrics:**
- New vulnerabilities introduced per week (should trend toward 0)
- MTTR (mean time to remediate) by severity
- False positive rate (high FP rate = tune rules or switch tools)

**Anti-pattern:** Blocking ALL 300 on day 1 → developers disable the tool or bypass it.`,
            },
          ],
        },
        {
          id: "dast-and-container-scanning",
          title: "DAST & Container Image Scanning",
          description: "Dynamic analysis against running apps and scanning container images for CVEs.",
          type: "lesson",
          duration: 16,
          objectives: [
            "Run OWASP ZAP against a staging environment",
            "Scan Docker images with Trivy",
            "Implement a distroless base image strategy",
            "Sign container images with Cosign",
          ],
          content: `## DAST & Container Image Scanning

**DAST** (Dynamic Application Security Testing) attacks a running application the way a real attacker would.
Container scanning looks for OS-level and application CVEs inside Docker image layers.

## How It Works: DAST Methodology

DAST operates by acting as an adversary: it sends requests to a running application and analyzes responses for vulnerability indicators. The process has three phases:

**Crawling/spidering**: The tool discovers all reachable pages, forms, and API endpoints. For web applications it follows links, submits forms, and parses JavaScript. For APIs it reads an OpenAPI/Swagger spec or uses endpoint discovery.

**Passive scanning**: During or after crawling, the tool analyzes every request and response for information that shouldn't be exposed: detailed error messages, internal stack traces, version headers (e.g., \`X-Powered-By: Express 4.17.1\`), insecure cookie flags, missing security headers (CSP, HSTS, X-Frame-Options).

**Active scanning**: The tool sends modified, malicious inputs to every discovered parameter: SQL injection payloads, XSS vectors, path traversal strings, SSRF URLs, command injection. It analyzes responses to detect successful exploitation. This is the "attack" phase and must only be run against systems you own and have permission to test.

**Why DAST finds what SAST misses**: DAST works against the running application, so it can find vulnerabilities that only manifest at runtime:
- Authentication bypasses that depend on session state
- Business logic flaws (e.g., changing \`quantity=-1\` on an order)
- Server-side vulnerabilities in third-party code that you use but don't scan
- Configuration issues (TLS misconfiguration, open redirects in web framework settings)

**ZAP Baseline vs Full Scan**: The baseline scan performs crawling and passive scanning only — it doesn't send malicious payloads. It's safe to run against any environment and takes ~5 minutes. The full scan adds active scanning — it is genuinely attacking the application and must only target dedicated test environments. Running active scanning against production is both a security risk and potentially illegal.

## How It Works: Container Image Layers

A Docker image is a stack of read-only layers. Each instruction in a Dockerfile adds a layer. Understanding this structure explains where vulnerabilities live and why they're hard to eliminate:

\`\`\`
Layer 0 (FROM ubuntu:20.04):     Ubuntu base OS — hundreds of packages
Layer 1 (RUN apt-get install python3): Python runtime packages
Layer 2 (COPY . /app):           Your application code
Layer 3 (RUN pip install -r requirements.txt): Python dependencies
\`\`\`

A CVE in \`libc\` in Layer 0 affects every container built on Ubuntu 20.04, regardless of what your application does. When a new Ubuntu security patch is released, you must rebuild your image starting from the base layer to pick it up. This is why regular image rebuilds (weekly at minimum) and automated base image update PRs are essential.

**Where Trivy scans:**
- OS package manager database (dpkg, rpm) — finds CVEs in installed OS packages
- Language package manifests (requirements.txt, package-lock.json, pom.xml) — finds CVEs in application dependencies
- Dockerfile configuration — finds misconfigurations (running as root, no healthcheck, etc.)
- Infrastructure as code — Terraform, Kubernetes manifests for misconfigs

**Severity thresholds in CI**: Trivy's \`--exit-code 1 --severity CRITICAL\` flag makes the CI job fail only on critical vulnerabilities. This is the right starting point. As your team matures, lower the threshold to HIGH. Never start at MEDIUM — the volume of findings will cause alert fatigue and developers will ignore the scanner.

## How It Works: Distroless and Scratch Images

The principle of attack surface reduction states: every binary, library, and file in a container that your application doesn't need is a potential attack vector.

A standard \`node:20\` base image contains a full Debian installation: bash, curl, apt, vi, and hundreds of utilities. If an attacker exploits your Node.js application and achieves code execution, they have access to all of these tools to establish persistence, exfiltrate data, or pivot to other systems.

**Distroless images** (from Google) contain only the application runtime and its minimum dependencies — no shell, no package manager, no system utilities. If an attacker exploits a vulnerability in your app, they have a very limited environment in which to operate. They cannot easily run additional commands or install tools.

**Scratch image** takes this further — it's an empty image with nothing at all. You can build a static binary (in Go or Rust) that links nothing from the OS, package it in a scratch image, and the resulting container has exactly one file: your binary.

**The tradeoff**: Distroless and scratch images are harder to debug. You cannot \`exec\` into the container and run diagnostic commands because there's no shell. The solution is to use multi-stage builds — the build image has all the tools, the runtime image is minimal. For debugging production issues, use ephemeral debug containers (\`kubectl debug\`) which inject a debug container into the pod's network namespace without modifying the application container.

---

## DAST with OWASP ZAP

\`\`\`bash
# Quick baseline scan (passive — no active attacks)
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://staging.myapp.com \
  -r zap-report.html

# Full active scan (attacks the app — only against staging/test!)
docker run -t owasp/zap2docker-stable zap-full-scan.py \
  -t https://staging.myapp.com \
  -r zap-full-report.html
\`\`\`

\`\`\`yaml
# GitHub Actions — DAST in CI
jobs:
  dast:
    runs-on: ubuntu-latest
    services:
      app:
        image: myapp:latest
        ports: ["3000:3000"]
    steps:
      - name: ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.11.0
        with:
          target: "http://localhost:3000"
          fail_action: true
          allow_issue_writing: false
\`\`\`

---

## Container Scanning with Trivy

Trivy scans OS packages, language dependencies, and misconfigurations.

\`\`\`bash
# Install
brew install trivy

# Scan a local image
trivy image myapp:latest

# Scan with severity filter
trivy image --severity HIGH,CRITICAL myapp:latest

# Exit code 1 on critical (for CI gate)
trivy image --exit-code 1 --severity CRITICAL myapp:latest

# Scan a Dockerfile for misconfigs
trivy config Dockerfile

# Scan filesystem (before building image)
trivy fs .
\`\`\`

\`\`\`yaml
# GitHub Actions
- name: Trivy Image Scan
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: myapp:latest
    format: sarif
    output: trivy-results.sarif
    severity: CRITICAL,HIGH
    exit-code: "1"

- name: Upload SARIF
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: trivy-results.sarif
\`\`\`

---

## Distroless Base Images

Distroless images contain only your app and its runtime — no shell, no package manager.

\`\`\`dockerfile
# Before: full Debian — 900MB, hundreds of packages
FROM node:20

# After: distroless — ~180MB, minimal attack surface
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["dist/index.js"]
\`\`\`

---

## Image Signing with Cosign

Signing proves an image wasn't tampered with between build and deployment.

\`\`\`bash
# Install cosign
brew install cosign

# Generate a key pair (or use keyless with OIDC)
cosign generate-key-pair

# Sign after push
docker push myregistry/myapp:v1.0.0
cosign sign --key cosign.key myregistry/myapp:v1.0.0

# Verify before deployment
cosign verify --key cosign.pub myregistry/myapp:v1.0.0

# Keyless signing (no key management — uses OIDC identity)
cosign sign myregistry/myapp:v1.0.0
# Prompts for OIDC login; signature stored in Rekor transparency log
\`\`\`

> **Tip:** Pair Cosign with a Kubernetes admission controller (Kyverno or OPA/Gatekeeper) that rejects unsigned images. This prevents pulling an attacker-modified image even if they compromised your registry.`,
        },
      ],
      exam: [
        { question: "What is the difference between SAST and DAST? Give a tool example for each and describe when each runs in a CI pipeline.", answer: "SAST (Static Application Security Testing) analyzes source code or compiled binaries without executing them, catching issues like SQL injection patterns, hardcoded secrets, and insecure API usage at PR time. Tools: Semgrep, Bandit (Python), SonarQube, CodeQL. DAST (Dynamic Application Security Testing) sends malicious inputs to a running application and observes responses, finding runtime issues like authentication bypasses, XSS, and server-side injection. Tools: OWASP ZAP, Burp Suite. In CI: SAST runs at PR creation (fast, no infrastructure needed). DAST runs against a deployed staging environment after the build stage.", difficulty: "junior" },
        { question: "Your SAST scanner flags a SQL query concatenation as a critical vulnerability. The developer says it's a false positive because 'the input is validated upstream.' How do you handle this?", answer: "False positive or not, concatenated SQL is a code smell. Ask the developer to: (1) show the upstream validation code and confirm it uses an allowlist (not a denylist) and handles all code paths; (2) consider whether the validation can be bypassed if the function is called from a different entry point in the future. Best practice is to use parameterized queries regardless — they cost almost nothing in performance and eliminate the entire class of injection risk. If after review it truly is a false positive, document the suppression with a code comment explaining why and the JIRA ticket, so it's auditable.", difficulty: "junior" },
        { question: "Explain what an SBOM is and why it's required for supply chain security.", answer: "An SBOM (Software Bill of Materials) is a machine-readable inventory of all software components, libraries, and their versions in an artifact. It answers 'what's in this binary?' when a new CVE is disclosed. Without an SBOM, answering 'are we affected by Log4Shell?' requires manually checking every application. With an SBOM: run a tool to compare the SBOM against a CVE database (Grype, Trivy) and instantly know which applications are affected. SBOMs are required by US Executive Order 14028 for software sold to the federal government and are becoming standard practice.", difficulty: "junior" },
        { question: "A Trivy container scan reports a CRITICAL CVE in the base image (ubuntu:20.04). How do you remediate this without rewriting the Dockerfile?", answer: "Fastest fix: update the base image tag to a patched version (e.g., ubuntu:22.04 or ubuntu:20.04 with a newer digest). Run apt-get update && apt-get upgrade -y in the Dockerfile after FROM to apply OS patches. For distroless/scratch base images, there's no package manager — you must update the base image. Rebuild and rescan. If the CVE is in a package your application doesn't use, consider using a minimal base image (alpine, distroless) to eliminate unnecessary packages entirely. Pin the base image to a specific digest (FROM ubuntu@sha256:...) to prevent silent pulls of different images.", difficulty: "mid" },
        { question: "What is SCA and how does it differ from license compliance scanning?", answer: "SCA (Software Composition Analysis) scans your dependency tree for known security vulnerabilities (CVEs) in open-source libraries. Tools: Snyk, Dependabot, OWASP Dependency-Check. License compliance scanning checks whether open-source licenses in your dependencies are compatible with your business model — e.g., GPL-licensed libraries in a proprietary product may require releasing your source code. Both SCA and license scanning analyze the same dependency manifest (package.json, requirements.txt), but serve different risk functions: SCA is a security control, license scanning is a legal control. Both should run in CI and block releases on violations.", difficulty: "mid" },
        { question: "Describe a supply chain attack on a CI/CD pipeline and two controls to prevent it.", answer: "Example attack: an attacker compromises a popular npm package (event-stream, 2018) and adds malicious code that runs during npm install in your CI pipeline, exfiltrating environment variables (secrets) to an attacker-controlled server. Controls: (1) Pin exact dependency versions and commit lock files — use npm ci instead of npm install to enforce the lock file. (2) Run dependency installs in a network-isolated sandbox so malicious code can't exfiltrate data. Additional controls: use a private registry proxy (Artifactory) with an allowlist, scan with SCA before install, review dependency update PRs carefully.", difficulty: "mid" },
        { question: "How do you implement DAST scanning with OWASP ZAP in a GitLab CI pipeline without human interaction?", answer: "Use ZAP's Docker image in 'baseline' or 'full scan' mode: `docker run -v $(pwd):/zap/wrk owasp/zap2docker-stable zap-baseline.py -t https://staging.example.com -r report.html`. The baseline scan crawls and passively detects issues (no active attacks). The full scan performs active attacks suitable for staging only. In GitLab CI: run ZAP after the deploy-to-staging job, against the staging URL. Fail the pipeline if ZAP returns exit code 1 (new MEDIUM+). Upload the HTML report as a CI artifact. For API-only apps, use ZAP's OpenAPI import feature: `zap-api-scan.py -t openapi.yaml`.", difficulty: "mid" },
        { question: "A container is running as root in production. What are the security risks and how do you fix it?", answer: "Risks: if an attacker exploits an app vulnerability and achieves code execution, they run as root inside the container. If the container runtime has a vulnerability allowing container escape, they now have root on the host node, compromising the entire Kubernetes node and potentially the cluster. Fix: (1) Add USER directive to Dockerfile: `RUN groupadd -r appuser && useradd -r -g appuser appuser` then `USER appuser`. (2) Set `securityContext.runAsNonRoot: true` and `runAsUser: 1000` in the Kubernetes pod spec. (3) Add `allowPrivilegeEscalation: false` and `readOnlyRootFilesystem: true`. (4) Enforce via OPA/Kyverno admission controller that rejects root containers.", difficulty: "mid" },
        { question: "Your security team wants container image signing enforced in Kubernetes. Design the end-to-end implementation.", answer: "End-to-end implementation: (1) Signing in CI: after building and pushing the image, run `cosign sign --key cosign.key registry/image:tag` (or keyless OIDC signing). Store the cosign public key or configure keyless trust root. (2) Admission control: deploy Kyverno with a ClusterPolicy that verifies signatures: `verifyImages: [{ image: 'registry/*', key: 'cosign.pub' }]`. Kyverno verifies the signature before allowing the pod to schedule. (3) Registry: configure the registry to only accept signed images (Harbor has native cosign support). (4) Monitoring: alert on Kyverno admission denials for unsigned images — these indicate either a pipeline bypass or a misconfiguration. (5) Key management: store cosign private key in Vault with access only from CI runners.", difficulty: "senior" },
        { question: "Design a security gate policy for a microservices company releasing 50 times per day. How do you balance security with release velocity?", answer: "Key principle: fast feedback, fail early, never block on false positives. Pipeline design: (1) PR gates (< 2 min): SAST with suppression for known false positives, secret scan. Block only on new CRITICAL. (2) Build gates (< 5 min): SCA with auto-PR for patch updates, container scan. Block on CRITICAL CVEs with no fix available — otherwise auto-create Jira. (3) Staging gates (< 15 min): DAST baseline scan, SBOM generation. Block on new CRITICAL findings. (4) Non-blocking (async): compliance policy checks, license scanning, full DAST — report to security dashboard. (5) Tooling: maintain a false-positive suppression registry reviewed quarterly. Use risk-acceptance workflow for unresolvable CVEs. Track 'security debt' as a metric reported to leadership.", difficulty: "senior" },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 4 — Cloud & IaC Security
    // ─────────────────────────────────────────
    {
      id: "cloud-iac-security",
      title: "Cloud & IaC Security",
      description: "Scanning Terraform/CloudFormation for misconfigs, IAM least privilege, and policy-as-code.",
      level: "intermediate",
      lessons: [
        {
          id: "iac-scanning",
          title: "IaC Security Scanning",
          description: "tfsec, Checkov, and OPA policies to catch cloud misconfigurations before apply.",
          type: "lesson",
          duration: 17,
          objectives: [
            "Run tfsec and Checkov on Terraform code",
            "Write a custom OPA policy for Terraform",
            "Scan CloudFormation templates with cfn-nag",
            "Integrate IaC scanning into GitHub Actions",
          ],
          content: `## IaC Security Scanning

Infrastructure-as-Code misconfigurations are the #1 source of cloud data breaches. Scan before \`terraform apply\`.

## Why IaC Scanning Matters

The 2019 Capital One breach that exposed 100 million records was caused by a misconfigured AWS Web Application Firewall — a single infrastructure setting. The 2017 Verizon breach exposed 14 million customer records via an improperly secured Amazon S3 bucket. These are not sophisticated attacks; they are configuration errors that IaC scanning would have caught before deployment.

The shift from manual cloud console configuration to Infrastructure-as-Code created an opportunity: security policies can now be enforced *before* infrastructure is created, not discovered after a breach. A \`checkov\` scan on a Terraform PR takes 30 seconds. The same security review by a human cloud architect takes days.

## How It Works: Checkov Policy Checks

Checkov parses IaC files (Terraform HCL, CloudFormation YAML, Kubernetes manifests, Dockerfiles, Helm charts) into an internal resource model and evaluates each resource against hundreds of built-in policies. Each policy is a Python function that receives the resource configuration and returns pass/fail.

Example of what Checkov checks for Terraform \`aws_s3_bucket\`:
- \`CKV_AWS_18\`: Access logging enabled
- \`CKV_AWS_19\`: Server-side encryption enabled
- \`CKV_AWS_20\`: Bucket not publicly accessible via ACL
- \`CKV_AWS_21\`: Versioning enabled
- \`CKV_AWS_144\`: Cross-region replication enabled (for DR)

When you add a new S3 bucket to your Terraform code and open a PR, Checkov immediately tells you which of these safeguards are missing. This is the compliance feedback loop: the developer sees the requirement, understands the reason (the message and documentation link), and adds the configuration before the code is reviewed.

**Custom Checkov policies in Python:**

\`\`\`python
# .checkov/custom_checks/s3_require_lifecycle.py
from checkov.common.models.enums import CheckCategories, CheckResult
from checkov.terraform.checks.resource.base_resource_check import BaseResourceCheck

class S3BucketHasLifecycle(BaseResourceCheck):
    def __init__(self):
        super().__init__(
            name="Ensure S3 bucket has lifecycle configuration",
            id="CKV_CUSTOM_S3_1",
            categories=[CheckCategories.BACKUP_AND_RECOVERY],
            supported_resources=["aws_s3_bucket"],
        )

    def scan_resource_conf(self, conf):
        lifecycle_rule = conf.get("lifecycle_rule", [{}])
        if lifecycle_rule and lifecycle_rule[0]:
            return CheckResult.PASSED
        return CheckResult.FAILED
\`\`\`

This custom check enforces your team's specific policies beyond the built-in ruleset.

## How It Works: OPA and Rego for Policy-as-Code

Open Policy Agent (OPA) takes policy-as-code further than Checkov — it is a general-purpose policy engine that can evaluate any structured data (JSON, YAML) against Rego policies. Checkov has 1000+ opinionated built-in rules; OPA lets you write rules in any shape your organization needs.

**The Rego language** is a declarative query language optimized for policy evaluation. A Rego policy returns \`deny\` messages (or \`allow\` decisions) based on the input data:

\`\`\`rego
# policies/tagging.rego — all resources must have required tags
package main

required_tags = ["Environment", "Team", "CostCenter", "Owner"]

deny[msg] {
    resource := input.resource.aws_instance[name]
    tags := resource.config.tags[0]
    required_tag := required_tags[_]
    not tags[required_tag]
    msg := sprintf("EC2 instance '%v' is missing required tag '%v'", [name, required_tag])
}
\`\`\`

This kind of organizational tagging policy is impossible to express in Checkov's built-in rules but trivial in Rego. OPA + Conftest integrates with the CI pipeline: \`terraform plan -out=plan.json && conftest test plan.json\` evaluates the planned changes before they are applied.

**OPA for Kubernetes Admission Control** (Gatekeeper): OPA can run as a Kubernetes admission webhook, evaluating every pod creation/update against policies. A pod that violates policy (e.g., runs as root) is rejected before it starts. This is the runtime enforcement equivalent of IaC scanning: policy-as-code applied at the cluster level.

## Common Cloud Misconfigurations

These are the top misconfigurations IaC scanners catch — each one has caused real breaches:

**Publicly accessible S3 buckets**: Before AWS added Block Public Access settings, developers could accidentally make buckets public by setting an ACL on a single object that inherited bucket-level public access. Checkov \`CKV_AWS_20\` and \`CKV_AWS_54\` catch this. The fix is always to enable all four Public Access Block settings at the bucket and account level.

**Overly permissive security groups**: \`0.0.0.0/0\` (the entire internet) as a source CIDR on port 22 (SSH), 3306 (MySQL), or 5432 (PostgreSQL) exposes those services to automated credential-stuffing attacks. The correct fix is to restrict SSH to a bastion host or VPN CIDR, and database ports to the application subnet CIDR only.

**Unencrypted EBS volumes**: An unencrypted EBS volume can be snapshotted and copied to another AWS account by anyone with EC2 access to the account. If the account is compromised, all data on unencrypted volumes is exposed. \`CKV_AWS_8\` checks this.

**Missing CloudTrail logging**: Without CloudTrail enabled across all regions, there is no audit trail of API calls. An attacker who compromises IAM credentials can operate undetected. \`CKV_AWS_67\` checks multi-region CloudTrail. This is a compliance baseline requirement for SOC 2 and PCI-DSS.

**Production-grade pattern**: Run Checkov and tfsec on every PR that touches IaC directories. Use OPA/Conftest for organization-specific policies that Checkov doesn't cover. Integrate findings as SARIF uploads to GitHub's Security tab for centralized vulnerability tracking. Require all CRITICAL findings to be resolved before merge — no exceptions, no waivers.

---

## tfsec

tfsec is a fast, purpose-built Terraform security scanner.

\`\`\`bash
brew install tfsec

# Scan current directory
tfsec .

# Soft fail (exit 0, show findings) — for initial adoption
tfsec . --soft-fail

# JSON output
tfsec . --format json > tfsec-results.json

# Ignore a specific rule inline
resource "aws_s3_bucket" "logs" {
  bucket = "my-logs"
  # tfsec:ignore:aws-s3-enable-bucket-logging
}
\`\`\`

**Common findings:**
- S3 bucket public access not blocked
- Security group allows 0.0.0.0/0 ingress on port 22
- RDS instance not encrypted
- CloudTrail logging disabled

---

## Checkov

Checkov covers Terraform, CloudFormation, Kubernetes, and Dockerfiles.

\`\`\`bash
pip install checkov

# Scan Terraform
checkov -d . --framework terraform

# Scan CloudFormation
checkov -f template.yaml --framework cloudformation

# Scan Dockerfile
checkov -f Dockerfile

# Scan with specific check IDs
checkov -d . --check CKV_AWS_18,CKV_AWS_21

# Skip a check globally
checkov -d . --skip-check CKV_AWS_144
\`\`\`

---

## Policy-as-Code with OPA / Conftest

OPA (Open Policy Agent) lets you write custom policies in Rego.

\`\`\`rego
# policies/s3.rego
package main

deny[msg] {
  resource := input.resource.aws_s3_bucket[_]
  not resource.config.server_side_encryption_configuration
  msg := sprintf("S3 bucket '%v' must have server-side encryption enabled", [resource.config.bucket])
}

deny[msg] {
  resource := input.resource.aws_s3_bucket[_]
  not resource.config.versioning[_].enabled
  msg := sprintf("S3 bucket '%v' must have versioning enabled", [resource.config.bucket])
}
\`\`\`

\`\`\`bash
# Install conftest
brew install conftest

# Test Terraform plan against policies
terraform plan -out=tfplan.binary
terraform show -json tfplan.binary > tfplan.json
conftest test tfplan.json --policy policies/
\`\`\`

---

## GitHub Actions Integration

\`\`\`yaml
name: IaC Security

on:
  pull_request:
    paths: ["infra/**", "terraform/**"]

jobs:
  iac-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: tfsec
        uses: aquasecurity/tfsec-action@v1.0.0
        with:
          working_directory: infra/

      - name: Checkov
        uses: bridgecrewio/checkov-action@master
        with:
          directory: infra/
          framework: terraform
          soft_fail: false
          output_format: sarif
          output_file_path: checkov-results.sarif

      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: checkov-results.sarif
\`\`\`

---

## IAM Least Privilege

\`\`\`hcl
# ❌ Too permissive
resource "aws_iam_role_policy" "bad" {
  policy = jsonencode({
    Statement = [{
      Effect   = "Allow"
      Action   = "*"
      Resource = "*"
    }]
  })
}

# ✅ Least privilege
resource "aws_iam_role_policy" "good" {
  policy = jsonencode({
    Statement = [{
      Effect   = "Allow"
      Action   = [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ]
      Resource = "arn:aws:s3:::my-app-bucket/*"
    }]
  })
}
\`\`\`

\`\`\`bash
# Analyse existing IAM permissions with IAM Access Analyzer
aws accessanalyzer create-analyzer \
  --analyzer-name my-analyzer \
  --type ACCOUNT

aws accessanalyzer list-findings --analyzer-name my-analyzer
\`\`\`

> **Tip:** Use \`IAM Access Advisor\` (AWS Console → IAM → User → Access Advisor) to see which services a role actually used in the last 90 days. Remove permissions for services never accessed.`,
        },
      ],
      exam: [
        { question: "You run `checkov -f main.tf` on a new Terraform file and it reports 12 failed checks. How do you prioritize which to fix first?", answer: "Prioritize by: (1) Severity — fix CRITICAL first (e.g., publicly exposed S3 bucket, no encryption on database, security group open to 0.0.0.0/0 on sensitive ports). (2) Exploitability — public-facing resources rank higher than internal-only. (3) Compliance requirement — if you're targeting SOC 2 or PCI-DSS, fix the checks mapped to those controls first. For low-risk findings (e.g., missing optional tags), add a `#checkov:skip=` comment with a justification rather than blocking the team. Create a policy that CRITICAL/HIGH must be resolved, MEDIUM can be tracked in backlog.", difficulty: "junior" },
        { question: "What is the principle of least privilege in IAM and how does it differ from having a single 'admin' role for all services?", answer: "Least privilege means granting only the exact permissions a service or user needs to perform its function — nothing more. A single admin role grants all permissions to all resources, violating least privilege. If a service with admin access is compromised, the attacker can read all data, modify all resources, and delete everything. With least privilege: an order-processing Lambda only gets DynamoDB read/write on the orders table and SQS send on the orders queue. Compromise of this Lambda cannot access S3 buckets, RDS databases, or other resources. Implement via IAM roles with specific resource ARNs and condition keys.", difficulty: "junior" },
        { question: "A Checkov scan flags your Terraform S3 bucket resource for failing CKV_AWS_18 (access logging not enabled). Explain the risk and fix.", answer: "Risk: without access logging, you have no audit trail of who accessed objects in the bucket — critical for detecting unauthorized data exfiltration, debugging access issues, and meeting compliance requirements (SOC 2, HIPAA). Fix in Terraform: add a `logging` block: `logging { target_bucket = aws_s3_bucket.logs.id; target_prefix = \"s3-access-logs/\" }`. Create a separate S3 bucket for logs with appropriate retention policy. The fix is low-effort and high-compliance-value. Tag it as a compliance requirement in your tracking system.", difficulty: "junior" },
        { question: "Explain tfsec vs Checkov. When would you use one over the other?", answer: "Both are IaC static analysis tools, but differ in scope: Checkov is provider-agnostic (Terraform, CloudFormation, Kubernetes manifests, Dockerfiles, ARM templates) with 1000+ built-in policies. tfsec is Terraform-specific with deep Terraform understanding and good IDE integration. Use tfsec when your team is Terraform-only and wants fast, Terraform-native feedback in their editor. Use Checkov when you have mixed IaC (Terraform + K8s manifests + Dockerfiles) and want a single tool covering everything. Both can be integrated in CI — running both in parallel provides complementary coverage with minimal overlap.", difficulty: "mid" },
        { question: "Your CloudFormation stack deploys an RDS instance, and a tfsec scan flags it for having Multi-AZ disabled. How do you fix this and why does it matter for security?", answer: "Fix: set `MultiAZ: true` in the RDS resource properties. Cost increases ~2× for standby. Security/availability relevance: Multi-AZ provides automatic failover during AZ outages and some maintenance operations. From a security standpoint, availability is part of the CIA triad — a single-AZ database is a single point of failure that could be exploited via a targeted AZ disruption. For production databases holding sensitive data, Multi-AZ also prevents data loss during failure events. In non-production, this can be legitimately disabled with a checkov:skip comment and cost justification.", difficulty: "mid" },
        { question: "How does Open Policy Agent (OPA) enable policy-as-code for cloud infrastructure? Give a concrete example.", answer: "OPA is a general-purpose policy engine that evaluates Rego policies against structured data. For cloud IaC: Conftest uses OPA to evaluate Terraform plans or Kubernetes manifests against custom policies before apply. Example Rego policy blocking S3 buckets without encryption: `deny[msg] { resource := input.resource.aws_s3_bucket[_]; not resource.server_side_encryption_configuration; msg := \"S3 bucket must have server-side encryption enabled\" }`. Integrate in CI: `terraform plan -out=plan.json && conftest test plan.json`. Policies live in a Git repo alongside code, are versioned, reviewed, and audited — hence 'policy-as-code'.", difficulty: "mid" },
        { question: "A security reviewer says your Terraform uses `aws_iam_role` with `*` in the Resource field of an inline policy. What's the issue and fix?", answer: "Using `*` as the Resource in an IAM policy grants the role permission on ALL resources of that type in the account — any S3 bucket, any DynamoDB table, any EC2 instance. This violates least privilege. If the role is assumed by an attacker (via a compromised instance or application), they have broad access. Fix: replace `*` with specific resource ARNs: `arn:aws:s3:::my-specific-bucket/*` for S3 operations on that bucket only, or `arn:aws:dynamodb:us-east-1:123456789:table/orders` for a specific table. Use AWS resource condition keys to further restrict access (e.g., `aws:RequestedRegion`).", difficulty: "mid" },
        { question: "Describe a scenario where a misconfigured Terraform networking resource created a critical security incident and how IaC scanning would have prevented it.", answer: "Scenario: a developer creates an RDS security group in Terraform with `cidr_blocks = [\"0.0.0.0/0\"]` on port 5432, intending to test connectivity. They forget to restrict it before merging. The database is now accessible from the public internet. Within hours, automated scanners find and brute-force the weak password. Prevention: Checkov check CKV_AWS_25 (`aws_security_group_rule` should not permit ingress from 0.0.0.0/0 on sensitive ports) would have blocked the PR. The CI pipeline would show a CRITICAL failure with remediation guidance to restrict the cidr to the application subnet CIDR.", difficulty: "senior" },
        { question: "Design an IaC security pipeline for a team that manages infrastructure across AWS, GCP, and Kubernetes.", answer: "Multi-cloud IaC security pipeline: (1) Pre-commit: tflint for Terraform syntax/style, checkov for quick high-severity check. (2) PR gate: run Checkov across all IaC (Terraform, Helm charts, K8s manifests, Dockerfiles) — fail on CRITICAL/HIGH. Run tfsec for Terraform-specific checks. Generate a policy report artifact. (3) Plan stage: `terraform plan -out=tfplan.json` then Conftest with OPA policies for custom org rules (naming conventions, mandatory tags, approved regions). (4) Cost estimation: Infracost to flag unexpected cost increases. (5) Apply gate: require a second approver for production applies. All applies are audited. (6) Drift detection: scheduled Terraform plan in CI to detect configuration drift from manual console changes.", difficulty: "senior" },
        { question: "How would you implement IAM permission boundaries in AWS to allow developers to create IAM roles without granting them the ability to escalate their own privileges?", answer: "Permission boundaries are IAM managed policies attached to a role that set the maximum permissions that role can grant — even if the role's inline policy allows more. Implementation: (1) Create a permission boundary policy that excludes IAM:PutRolePolicy, IAM:AttachRolePolicy, and excludes the ability to remove the permission boundary itself. (2) Create an IAM policy that allows developers to create IAM roles only if they attach the permission boundary: `Condition: { StringEquals: { 'iam:PermissionsBoundary': 'arn:aws:iam::123456789:policy/DeveloperBoundary' } }`. (3) Developers can now create roles for their services but cannot grant those roles more permissions than the boundary allows, preventing privilege escalation.", difficulty: "senior" },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 5 — Runtime Security & Monitoring
    // ─────────────────────────────────────────
    {
      id: "runtime-security",
      title: "Runtime Security & Monitoring",
      description: "Falco runtime threat detection, SIEM integration, and incident response playbooks.",
      level: "advanced",
      lessons: [
        {
          id: "runtime-threat-detection",
          title: "Runtime Threat Detection with Falco",
          description: "Detect container escapes, privilege escalation, and anomalous behaviour at runtime.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Install and configure Falco on a Kubernetes cluster",
            "Write custom Falco rules",
            "Forward Falco alerts to a SIEM",
            "Build an incident response playbook for common alerts",
          ],
          content: `## Runtime Threat Detection with Falco

SAST and image scanning catch vulnerabilities before deployment. Falco catches attacks *during* execution — detecting container escapes, privilege escalation, and data exfiltration in real time.

## How It Works: eBPF and System Call Tracing

Every program running on Linux communicates with the kernel through system calls (syscalls). To open a file, a process calls \`open()\`. To create a network connection, it calls \`connect()\`. To execute another program, it calls \`execve()\`. These are the fundamental operations of any process.

Falco instaches to the Linux kernel and observes every syscall made by every process on the host. It does this via either:

1. **Kernel module**: Compiled code loaded into the kernel. Highest performance, but requires kernel source headers and can cause kernel panics if it has bugs.
2. **eBPF probe**: Programs loaded into the eBPF virtual machine inside the kernel. The kernel verifies these programs cannot crash or harm the system before loading them. This is the recommended approach — safe, no kernel compilation required, supported on modern kernels (4.14+).

When a process makes a syscall, the Falco driver captures the event (process name, user, syscall arguments, file descriptors, timestamps) and sends it to the Falco userspace engine. The engine evaluates the event against Falco rules. If a rule matches, Falco generates an alert.

This approach has a critical advantage over other monitoring methods: it cannot be bypassed by the application. Even if an attacker compromises your container, they cannot disable Falco (it runs outside the container), they cannot modify the syscall trace (Falco observes at the kernel level), and they cannot fake their identity (the kernel knows the process's real UID and namespace).

## How It Works: Falco Rules in Depth

A Falco rule has four key components:

\`\`\`yaml
- rule: Sensitive file opened for reading by non-privileged process
  desc: |
    Detects when a process reads sensitive files like /etc/shadow, /etc/sudoers,
    or SSH private keys outside of expected system operations.
  condition: >
    open_read                           # event type: file opened for reading
    and sensitive_files                 # macro: matches known sensitive file paths
    and not proc.name in (trusted_file_readers)  # not in our trusted list
    and not container.id = host         # not running directly on the host (not in container)
    and user.uid != 0                   # not running as root
  output: >
    Sensitive file read by non-root (file=%fd.name proc=%proc.name
    user=%user.name container=%container.name image=%container.image.repository)
  priority: WARNING
  tags: [filesystem, mitre_credential_access]
\`\`\`

**Condition language**: Falco conditions are boolean expressions over event fields. \`proc.name\` is the process name, \`fd.name\` is the file descriptor path, \`container.name\` is the container name. Macros like \`sensitive_files\` and \`open_read\` are pre-defined reusable conditions.

**Priority levels**: DEBUG, INFORMATIONAL, NOTICE, WARNING, ERROR, CRITICAL, ALERT, EMERGENCY. Only route CRITICAL and ALERT to PagerDuty — WARNING to Slack, lower levels to SIEM for storage.

**MITRE ATT&CK mapping**: Tagging Falco rules with MITRE ATT&CK tactics (Initial Access, Execution, Persistence, Credential Access, etc.) lets you map detections to the industry framework, which is useful for security reporting and building detection coverage heat maps.

## How It Works: Incident Response Integration

Falco generates alerts but doesn't take action — that's by design (you don't want automated responses making decisions without human judgment for most alerts). The architecture for production incident response:

\`\`\`
Falco alert → Falcosidekick → SIEM (Elasticsearch/Splunk)
                           → Slack (#security-alerts)
                           → PagerDuty (CRITICAL only)
                           → Webhook → custom automation
\`\`\`

**Falcosidekick** is a companion service that routes Falco output to 50+ destinations. It handles formatting (JSON for SIEM, formatted message for Slack), filtering by priority, and fan-out to multiple destinations.

**SIEM correlation**: A single Falco alert rarely indicates compromise — it might be a legitimate admin operation. The SIEM's value is correlating multiple alerts: "shell spawned in container" + "sensitive file read" + "outbound connection to unknown IP" within 5 minutes from the same pod is high-confidence lateral movement. Individual alerts are noise; correlated patterns are signal.

**Automated response via webhook**: For high-confidence, low-risk automated responses (isolating a pod with a NetworkPolicy, capturing forensic data before it's lost), a Falcosidekick webhook can trigger Kubernetes operations. This is most useful for crypto-mining detection — if Falco fires on a known miner binary, automatically applying a network-deny policy stops the outbound connection before a human reviews the alert.

---

## How Falco Works

Falco uses Linux kernel syscall tracing (via eBPF or kernel module) to observe every process, file access, and network connection inside containers.

\`\`\`
Container process → syscall → Kernel (eBPF hook) → Falco engine → Rule match → Alert
\`\`\`

---

## Installing Falco on Kubernetes

\`\`\`bash
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm repo update

helm install falco falcosecurity/falco \
  --namespace falco \
  --create-namespace \
  --set driver.kind=ebpf \
  --set falcosidekick.enabled=true \
  --set falcosidekick.config.slack.webhookurl="https://hooks.slack.com/..."

# Verify
kubectl get pods -n falco
kubectl logs -n falco -l app.kubernetes.io/name=falco
\`\`\`

---

## Built-in Rules (Examples)

\`\`\`yaml
# Falco triggers on these by default:

# Shell spawned in a container
- rule: Terminal shell in container
  desc: A shell was used as the entrypoint or is spawned in a container
  condition: >
    spawned_process and container
    and shell_procs and proc.tty != 0
  output: >
    A shell was spawned in a container (user=%user.name container=%container.name
    image=%container.image.repository shell=%proc.name)
  priority: WARNING

# Sensitive file read
- rule: Read sensitive file trusted after startup
  condition: >
    open_read and sensitive_files
    and not proc.name in (trusted_file_readers)
    and not container.id = host
  output: Sensitive file opened for reading (file=%fd.name ...)
  priority: WARNING
\`\`\`

---

## Custom Falco Rules

\`\`\`yaml
# /etc/falco/rules.d/custom.yaml

# Alert when crypto-mining tools are run
- list: crypto_miners
  items: [xmrig, minergate, ccminer, ethminer]

- rule: Crypto Mining Detected
  desc: A known crypto miner was executed
  condition: spawned_process and proc.name in (crypto_miners)
  output: "Crypto miner detected (proc=%proc.name user=%user.name container=%container.name)"
  priority: CRITICAL
  tags: [malware, crypto]

# Alert on unexpected outbound connections
- rule: Unexpected Outbound Network Connection
  desc: Container made an outbound connection to an unexpected port
  condition: >
    outbound and container
    and not fd.sport in (80, 443, 5432, 6379, 27017)
    and not proc.name in (allowed_network_processes)
  output: "Unexpected outbound connection (dest=%fd.rip:%fd.rport proc=%proc.name container=%container.name)"
  priority: HIGH
\`\`\`

---

## SIEM Integration with Falcosidekick

\`\`\`yaml
# falcosidekick ConfigMap
config:
  elasticsearch:
    hostport: "https://elasticsearch:9200"
    index: "falco"
    username: "falco"
    password: "\${{ secrets.ELASTIC_PASSWORD }}"

  slack:
    webhookurl: "https://hooks.slack.com/..."
    minimumpriority: "warning"

  pagerduty:
    routingkey: "\${{ secrets.PD_ROUTING_KEY }}"
    minimumpriority: "critical"
\`\`\`

---

## Incident Response Playbook

When Falco fires **"Shell spawned in container"**:

\`\`\`bash
# 1. Identify the container
kubectl get pods -A | grep <container-name>

# 2. Capture forensic evidence BEFORE killing
kubectl exec -n <ns> <pod> -- ps aux > /tmp/forensics-ps.txt
kubectl exec -n <ns> <pod> -- netstat -tlnp > /tmp/forensics-net.txt
kubectl logs -n <ns> <pod> --since=1h > /tmp/forensics-logs.txt

# 3. Isolate the pod (network policy)
kubectl label pod <pod> -n <ns> security.kubernetes.io/quarantine=true

# 4. Apply deny-all network policy to quarantine label
# 5. Cordon the node if node compromise suspected
kubectl cordon <node-name>

# 6. Preserve the pod spec for investigation
kubectl get pod <pod> -n <ns> -o yaml > /tmp/forensics-podspec.yaml

# 7. Delete the compromised pod (replacement spawns from deployment)
kubectl delete pod <pod> -n <ns>
\`\`\`

> **Tip:** Use Falco's \`json_output: true\` and forward to your SIEM (Elastic, Splunk) for correlation. A single Falco alert rarely means compromise; patterns across multiple pods in minutes are high-confidence indicators.`,
        },
      ],
      exam: [
        { question: "Falco alerts fire for 'terminal shell in container' on a production pod. Walk through your immediate response steps.", answer: "Immediate response: (1) Cordon the node to prevent new pods being scheduled: `kubectl cordon <node>`. (2) Identify the pod: check Falco alert metadata for pod name/namespace. (3) Capture forensic data before killing: `kubectl exec <pod> -- ps aux`, `kubectl logs <pod>`, `kubectl describe pod <pod>`. (4) Check for lateral movement: review network connections from the pod, check if any secrets were accessed. (5) Isolate: apply a network policy blocking all egress from the pod. (6) Preserve: `kubectl get pod <pod> -o yaml > forensics.yaml`. (7) Delete the pod — a new clean pod will spawn from the deployment. (8) Investigate: trace how the shell was opened — was it legitimate maintenance or an attack?", difficulty: "junior" },
        { question: "What is Falco and how does it differ from a container image vulnerability scanner like Trivy?", answer: "Trivy is a static scanner — it scans images before they run to find known CVE vulnerabilities in packages. It catches problems at build time. Falco is a runtime security tool — it monitors system calls made by running containers and alerts on suspicious behavior like: shell execution inside a container, reading sensitive files (/etc/shadow), writing to binary directories, privilege escalation, unexpected network connections. Falco catches attacks that happen at runtime even if the image was clean. They are complementary: Trivy prevents known-vulnerable code from running; Falco detects exploitation of unknown vulnerabilities or misconfigurations at runtime.", difficulty: "junior" },
        { question: "Your SIEM shows a spike in failed SSH login attempts from one IP against multiple production servers. What do you do?", answer: "This is a brute-force or password-spraying attack. Response: (1) Immediately block the source IP in your WAF or security group. (2) Check if any logins succeeded — look for successful auth from that IP in auth.log or CloudTrail. (3) If any succeeded, treat as a compromise: rotate SSH keys for affected accounts, check for new authorized_keys entries, review what commands were run (bash_history). (4) If none succeeded, block and add to threat intelligence blocklist. (5) Longer term: enforce key-only SSH (disable password auth), deploy fail2ban, restrict SSH access to VPN/bastion only, consider removing public SSH access entirely and using SSM Session Manager instead.", difficulty: "mid" },
        { question: "A Kubernetes cluster has no NetworkPolicies defined. Explain the security implications and how you would remediate.", answer: "Without NetworkPolicies, all pods in the cluster can communicate with all other pods by default — this is Kubernetes' flat network model. If an attacker compromises one pod (even a low-privilege frontend pod), they can directly reach all databases, internal APIs, and other sensitive services. Remediation: (1) Start with a default-deny policy per namespace: `spec: podSelector: {} policyTypes: [Ingress, Egress]`. (2) Add explicit allow policies for required communication paths (frontend → API, API → DB). (3) Use a CNI that supports NetworkPolicy enforcement (Calico, Cilium, Weave). (4) Audit with `kubectl get networkpolicies -A` and verify enforcement with network connectivity tests.", difficulty: "mid" },
        { question: "What is a Kubernetes Pod Security Admission policy and what does 'restricted' level enforce?", answer: "Pod Security Admission (PSA) replaces the deprecated PodSecurityPolicy. It enforces security standards at the namespace level via labels. The 'restricted' level is the most hardened and enforces: no privileged containers, no privilege escalation (`allowPrivilegeEscalation: false`), must run as non-root user, must drop all Linux capabilities (`drop: [ALL]`), read-only root filesystem, no host namespaces (hostPID, hostNetwork, hostIPC all false), seccompProfile must be set to RuntimeDefault or Localhost. Enforce by labeling the namespace: `pod-security.kubernetes.io/enforce: restricted`. PSA operates in three modes: enforce (block), audit (log), warn (admission warning).", difficulty: "mid" },
        { question: "Design a runtime security monitoring stack for a Kubernetes cluster serving financial transactions.", answer: "Stack components: (1) Falco: deploy as DaemonSet on every node, custom rules for PCI-DSS relevant events (sensitive file reads, privilege changes, network connections to external IPs). Send alerts to SIEM via Falcosidekick. (2) SIEM (Elastic/Splunk): correlate Falco events with Kubernetes audit logs, CloudTrail, and application logs. Define detection rules for attack patterns. (3) Kubernetes audit logging: enable with comprehensive policy capturing all secret access, pod creation, and RBAC changes. (4) Network monitoring: Cilium Hubble for L3/L4/L7 network observability. Alert on unexpected connections. (5) Node hardening: CIS benchmark compliance via kube-bench. (6) Incident response playbooks: documented runbooks per Falco alert type tested quarterly.", difficulty: "senior" },
        { question: "Explain how a container escape vulnerability works and what defense-in-depth controls limit the blast radius.", answer: "Container escape: a vulnerability in the container runtime (runc CVE-2019-5736), Kubernetes API, or kernel allows code running inside a container to break out and execute commands as root on the host node. Controls that limit blast radius: (1) Run containers as non-root — root inside container + escape = root on host; non-root + escape = limited host access. (2) Read-only root filesystem — limits attacker persistence. (3) Drop Linux capabilities — without CAP_SYS_ADMIN, many escape techniques fail. (4) Use gVisor or Kata Containers — hardware-based isolation adds another layer between container and kernel. (5) Node segregation — run untrusted workloads on isolated node pools with no access to control plane. (6) Runtime detection — Falco detects escape attempts via unusual syscall patterns.", difficulty: "senior" },
        { question: "Your security team wants to detect data exfiltration from Kubernetes pods. What signals do you monitor and how do you reduce false positives?", answer: "Signals to monitor: (1) Unusual outbound network connections — new destination IPs or ports not in the pod's normal communication pattern (baseline with Cilium Hubble or network flow logs). (2) High egress traffic volume — DNS tunneling often involves many small packets; large data transfers may indicate bulk exfiltration. (3) DNS queries to unusual domains — DGA (Domain Generation Algorithm) domains, high entropy domain names. (4) Access to sensitive Kubernetes secrets beyond normal patterns. (5) Falco rules: detect unexpected network connections. False positive reduction: establish behavioral baselines per deployment using a learning period, use allowlists for known external services (CDNs, SaaS APIs), correlate multiple signals before alerting (single unusual connection = low confidence; unusual connection + secret access + high volume = high confidence).", difficulty: "senior" },
        { question: "How do you implement a SIEM-integrated incident response workflow for a Kubernetes security event?", answer: "Workflow: (1) Detection: Falco generates a structured JSON alert (pod name, namespace, rule triggered, syscall). Falcosidekick forwards to SIEM (Elastic). (2) Correlation: SIEM correlates Falco event with K8s audit logs (was a new ClusterRoleBinding created?), CloudTrail (IAM changes from that node?), and app logs. (3) Automated triage: SIEM playbook auto-enriches the alert with pod metadata, owner, recent deployments, network graph. Severity calculated based on the resource's data classification. (4) Response automation: for HIGH severity, SIEM triggers a webhook → Kubernetes operator that applies a network isolation NetworkPolicy to the pod and creates a JIRA incident. (5) Human review: on-call engineer reviews enriched alert, executes containment playbook. (6) Post-incident: update Falco rules, patch the exploited vulnerability, run GameDay to test the workflow.", difficulty: "senior" },
        { question: "What is eBPF and why is it increasingly used for runtime security instead of kernel modules?", answer: "eBPF (extended Berkeley Packet Filter) is a Linux kernel technology that runs sandboxed programs in the kernel without loading kernel modules. For runtime security: eBPF programs attach to kernel events (syscalls, network events, file operations) and can observe or filter them with minimal overhead. Tools like Cilium, Tetragon, and Falco (eBPF driver) use eBPF. Advantages over kernel modules: (1) Safety — eBPF programs are verified by the kernel before loading, preventing kernel crashes. (2) No kernel rebuild required — deploy as a binary. (3) Performance — minimal overhead versus ptrace-based approaches. (4) Visibility — native kernel-level visibility into all syscalls, network connections, and file operations. (5) Dynamic — load and unload rules at runtime without rebooting.", difficulty: "senior" },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 6 — Compliance & Governance
    // ─────────────────────────────────────────
    {
      id: "compliance-governance",
      title: "Compliance & Governance Automation",
      description: "SOC 2, CIS benchmarks, audit trails, and policy-as-code enforcement at scale.",
      level: "advanced",
      lessons: [
        {
          id: "compliance-as-code",
          title: "Compliance as Code",
          description: "Automate SOC 2, CIS benchmark checks, and generate audit evidence programmatically.",
          type: "lesson",
          duration: 18,
          objectives: [
            "Map CI/CD security controls to SOC 2 Trust Service Criteria",
            "Run CIS Benchmark checks with kube-bench",
            "Generate audit evidence automatically from pipeline runs",
            "Implement Open Policy Agent for Kubernetes admission control",
          ],
          content: `## Compliance as Code

Manual compliance audits are slow, error-prone, and expensive. Automating compliance checks turns them into continuous feedback rather than annual stress.

---

## SOC 2 + DevSecOps Mapping

| SOC 2 Criterion | DevSecOps Control |
|---|---|
| CC6.1 — Logical access | IAM least privilege, MFA enforcement |
| CC6.2 — Authentication | SSO + OIDC, branch protection, signed commits |
| CC6.6 — Vulnerability management | SAST, SCA, DAST in every PR |
| CC6.7 — Encryption | TLS everywhere, secrets in Vault, encrypted volumes |
| CC7.2 — System monitoring | Falco alerts, CloudWatch, SIEM |
| CC8.1 — Change management | Git history, PR approvals, signed commits as audit trail |

---

## CIS Kubernetes Benchmark with kube-bench

\`\`\`bash
# Run all CIS checks on a node
kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml

kubectl logs job.batch/kube-bench

# Or run directly on the node
docker run --pid=host --network=host --rm \
  -v /etc:/etc:ro \
  -v /var:/var:ro \
  aquasec/kube-bench:latest
\`\`\`

Sample output:
\`\`\`
[PASS] 1.1.1 Ensure that the API server pod specification file permissions are set to 644 or more restrictive
[FAIL] 1.1.12 Ensure that the etcd data directory ownership is set to etcd:etcd
[WARN] 1.2.20 Ensure that the --audit-log-path argument is set
\`\`\`

---

## OPA Admission Controller (Gatekeeper)

Gatekeeper enforces policies at Kubernetes admission time — pods violating policy are rejected before they start.

\`\`\`bash
# Install Gatekeeper
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/release-3.14/deploy/gatekeeper.yaml
\`\`\`

\`\`\`yaml
# Constraint Template: require security context
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: requiresecuritycontext
spec:
  crd:
    spec:
      names:
        kind: RequireSecurityContext
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package requiresecuritycontext
        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          not container.securityContext.runAsNonRoot
          msg := sprintf("Container '%v' must run as non-root", [container.name])
        }
---
# Apply the constraint
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: RequireSecurityContext
metadata:
  name: must-run-as-nonroot
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
    namespaces: ["production"]
\`\`\`

---

## Generating Audit Evidence Automatically

\`\`\`yaml
# GitHub Actions — create audit artifact on every release
jobs:
  audit-evidence:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Collect Evidence
        run: |
          echo "=== Git Log (signed commits) ===" > evidence.txt
          git log --show-signature --oneline -20 >> evidence.txt

          echo "=== PR Reviews ===" >> evidence.txt
          gh pr list --state merged --limit 20 \
            --json number,title,reviewDecision,mergedAt \
            >> evidence.txt

          echo "=== Dependency Audit ===" >> evidence.txt
          npm audit --json >> evidence.txt
        env:
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      - name: Upload Evidence
        uses: actions/upload-artifact@v4
        with:
          name: audit-evidence-\${{ github.run_id }}
          path: evidence.txt
          retention-days: 365
\`\`\`

---

## Security Scorecard

Use OpenSSF Scorecard to get an automated security score for your repo:

\`\`\`bash
docker run -e GITHUB_AUTH_TOKEN=\$GH_TOKEN \
  gcr.io/openssf/scorecard:stable \
  --repo=github.com/myorg/myapp \
  --format json \
  | jq '.checks[] | {name, score, reason}'
\`\`\`

Checks include: Branch-Protection, Code-Review, Signed-Releases, Vulnerabilities, Token-Permissions, Secret detection.

> **Tip:** Automate scorecard in CI and alert when the score drops below your threshold (e.g., 7/10). Publish the badge in README.md to signal security posture to external contributors and auditors.`,
          interviewQuestions: [
            {
              question: "How do you implement compliance as code, and why is it better than periodic manual audits?",
              difficulty: "mid" as const,
              answer: `**Compliance as code** treats compliance requirements (GDPR, SOC 2, PCI DSS, HIPAA) as automated checks that run continuously, rather than point-in-time manual audits.

**Why manual audits fail:**
- Audits happen quarterly/annually — months of non-compliance go undetected
- Auditors check a sample, not everything
- "Point-in-time" attestation: compliant at audit time, drifts immediately after
- Manual processes don't scale with cloud infrastructure (hundreds of resources)

**Implementation with AWS Config + OPA:**
\`\`\`bash
# AWS Config rule: all S3 buckets must be encrypted:
aws configservice put-config-rule --config-rule '{
  "ConfigRuleName": "s3-bucket-server-side-encryption-enabled",
  "Source": {
    "Owner": "AWS",
    "SourceIdentifier": "S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED"
  }
}'

# AWS Config automatically evaluates all S3 buckets continuously
# Non-compliant resources trigger SNS → PagerDuty or auto-remediation Lambda
\`\`\`

**IaC policy with Checkov:**
\`\`\`bash
# Block deployment if Terraform code violates security policies:
checkov -d . --check CKV_AWS_21,CKV_AWS_18 --hard-fail-on HIGH
# CKV_AWS_21: S3 versioning enabled
# CKV_AWS_18: S3 access logging enabled
\`\`\`

**Continuous compliance dashboard:**
\`\`\`bash
# Security Hub aggregates findings from GuardDuty, Inspector, Config, Macie:
aws securityhub get-findings \\
  --filters '{"ComplianceStatus":[{"Value":"FAILED","Comparison":"EQUALS"}]}' \\
  --query 'Findings[].{Resource:Resources[0].Id,Control:Title,Severity:Severity.Label}'
\`\`\`

**Benefits of continuous compliance:**
- Real-time compliance posture (detect drift within minutes)
- Scales with infrastructure (10 resources or 10,000 resources, same effort)
- Audit evidence is automatically collected
- Compliance becomes a normal part of deployment, not a blocker`,
            },
            {
              question: "Walk me through how you would design the secret management strategy for a microservices application.",
              difficulty: "senior" as const,
              answer: `**The hierarchy of secret security (best to worst):**

1. **Dynamic, short-lived credentials** (best): App gets credentials from Vault/AWS Secrets Manager at runtime, credentials expire in minutes/hours. No stored secrets anywhere.
2. **Environment-injected at deploy time**: Kubernetes Secrets mounted as files, ECS task environment variables from Secrets Manager. Short-lived but not rotating.
3. **Long-lived env vars in container**: Never rotated, leaked in logs, visible in container inspect.
4. **Hardcoded in code** (worst): In version control forever.

**Production-grade architecture:**

**Option A — HashiCorp Vault with Kubernetes:**
\`\`\`yaml
# Vault Agent Injector annotates pods to automatically inject secrets:
annotations:
  vault.hashicorp.com/agent-inject: "true"
  vault.hashicorp.com/role: "payments-service"
  vault.hashicorp.com/agent-inject-secret-db-creds: "database/creds/payments-role"
# Vault auto-renews credentials before they expire
# App reads from /vault/secrets/db-creds (file, not env)
\`\`\`

**Option B — AWS Secrets Manager + IAM roles:**
\`\`\`python
# App fetches secrets at startup, caches with TTL:
import boto3
from functools import lru_cache

@lru_cache(maxsize=None)
def get_secret(secret_name):
    client = boto3.client('secretsmanager')
    return client.get_secret_value(SecretId=secret_name)['SecretString']

# IAM task role grants: secretsmanager:GetSecretValue on specific ARN only
# No access key needed — uses instance/task metadata credentials
\`\`\`

**Rotation strategy:**
\`\`\`bash
# Enable automatic rotation in Secrets Manager:
aws secretsmanager rotate-secret \\
  --secret-id prod/myapp/db-password \\
  --rotation-lambda-arn arn:aws:lambda:...:function:SecretsManagerRotation \\
  --rotation-rules AutomaticallyAfterDays=30
\`\`\`

**Audit trail:**
Every secret access is logged in CloudTrail/Vault audit logs — who accessed what, when. Anomaly detection on unusual access patterns (e.g., Lambda function that usually accesses 10 secrets/day suddenly accessing 100 = potential data exfiltration).`,
            },
          ],
        },
      ],
    },
    {
      id: "cicd-pipelines",
      title: "CI/CD Pipelines",
      level: "intermediate",
      description: "Build production-grade CI/CD pipelines with pipeline rules, MR pipelines, and environment promotion.",
      lessons: [
        {
          id: "pipeline-fundamentals",
          title: "CI/CD Pipeline Fundamentals",
          duration: 22,
          type: "lesson",
          description: "Understand CI/CD concepts, pipeline stages, and how modern pipelines are structured.",
          objectives: [
            "Explain the difference between CI and CD",
            "Design a multi-stage pipeline with gates",
            "Understand pipeline triggers and conditions",
            "Implement fail-fast strategies and parallel jobs",
          ],
          content: `# CI/CD Pipeline Fundamentals

## Why Fast Pipelines Matter

There is a psychological principle at work in CI/CD: a developer who gets feedback within 5 minutes of pushing code is still thinking about that code. They remember what they changed, why they changed it, and can fix a problem immediately. A developer who gets feedback 45 minutes later has context-switched to another task. The cost of fixing the problem is now much higher — not just in time, but in cognitive load and flow state disruption.

The "broken window" theory from criminology applies to codebases: a broken test that developers have learned to ignore becomes a precedent. "The pipeline is always red" becomes a cultural norm, and eventually nobody trusts the pipeline. High-performing teams maintain green pipelines with near-religious dedication because they understand that the value of CI is zero if developers don't trust it.

## How It Works: The CI/CD Feedback Loop

The fundamental CI/CD feedback loop: commit → build → test → feedback → fix → commit. The goal is to minimize the time between "code pushed" and "developer knows if it's broken."

**Trunk-based development** and CI/CD are symbiotic. Trunk-based development (TBD) requires that every developer merges to \`main\` (trunk) at least once per day — often multiple times. Long-lived feature branches defeat CI because they only integrate with the rest of the team's work at merge time. By then, integration conflicts can be massive and tests that were individually passing now fail together.

TBD with feature flags is the enabling technology for CI/CD at scale. You can merge incomplete features to \`main\` daily (keeping the pipeline green) while hiding the feature behind a flag. When the feature is complete, flip the flag — no merge, no conflicts, no big bang deployment.

**Pipeline stages**: The standard pipeline stage order is optimized for fail-fast economics:

1. **Lint** (~30 seconds): Catch syntax errors and style violations. These fail before the compiler runs.
2. **Unit tests** (~2-5 minutes): Fast tests with no external dependencies. They should be 90% of your test suite.
3. **Security scans** (~2-5 minutes): SAST and secret scanning, run in parallel with unit tests.
4. **Build** (~2-5 minutes): Compile code, build Docker image.
5. **Integration tests** (~5-15 minutes): Tests requiring databases, APIs. Slower, so run after faster gates.
6. **Container scanning** (~2-3 minutes): Scan the built image for CVEs.
7. **Deploy to dev** (automated on \`main\`).
8. **Deploy to staging** (automated, with smoke tests).
9. **Deploy to production** (manual approval gate or automated with sufficient confidence).

Each stage is a gate. If stage 2 (unit tests) fails, stages 4-9 never run. This fail-fast approach prevents wasting minutes on later stages when an earlier, cheaper check already found the problem.

## What is CI/CD?

**Continuous Integration (CI)**: Automatically build, test, and validate every code change the moment it's pushed. Catch bugs in minutes, not days.

**Continuous Delivery (CD)**: Automatically deploy validated code to staging environments. Every merge to main is a deployable artifact.

**Continuous Deployment**: Every passing pipeline automatically deploys to production. No human gate. Used by Netflix, Amazon (deploys every 11.7 seconds), and Etsy.

\`\`\`
Developer pushes code
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                   CI Pipeline                           │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │  Build   │→ │   Test   │→ │  Scan    │→ │Package │ │
│  │ compile  │  │unit/intg │  │SAST/SCA  │  │ image  │ │
│  │ lint     │  │coverage  │  │secrets   │  │ helm   │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────────────────────┘
       │
       ▼ (on main branch only)
┌─────────────────────────────────────────────────────────┐
│                   CD Pipeline                           │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  Deploy  │→ │  Deploy  │→ │  Deploy Production   │  │
│  │   Dev    │  │ Staging  │  │  (manual approval)   │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘
\`\`\`

## GitLab CI/CD Pipeline Structure

GitLab CI is defined in \`.gitlab-ci.yml\` at the repo root.

\`\`\`yaml
# .gitlab-ci.yml — complete production pipeline example
image: node:20-alpine

stages:
  - build
  - test
  - scan
  - package
  - deploy-dev
  - deploy-staging
  - deploy-prod

variables:
  IMAGE_NAME: \${CI_REGISTRY_IMAGE}:\${CI_COMMIT_SHA}
  DOCKER_BUILDKIT: "1"

# ── Build ──────────────────────────────────────────────
build:
  stage: build
  script:
    - npm ci --cache .npm
    - npm run build
  cache:
    key: \${CI_COMMIT_REF_SLUG}
    paths:
      - .npm/
      - node_modules/
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

# ── Test ───────────────────────────────────────────────
unit-tests:
  stage: test
  script:
    - npm run test:unit -- --coverage
  coverage: '/Lines\\s*:\\s*(\\d+\\.\\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
      junit: coverage/junit.xml

integration-tests:
  stage: test
  services:
    - postgres:15
    - redis:7
  variables:
    POSTGRES_DB: testdb
    POSTGRES_USER: testuser
    POSTGRES_PASSWORD: testpass
  script:
    - npm run test:integration

# ── Scan ───────────────────────────────────────────────
sast:
  stage: scan
  include:
    - template: Security/SAST.gitlab-ci.yml

dependency-scan:
  stage: scan
  include:
    - template: Security/Dependency-Scanning.gitlab-ci.yml

secret-detection:
  stage: scan
  include:
    - template: Security/Secret-Detection.gitlab-ci.yml

# ── Package ────────────────────────────────────────────
build-image:
  stage: package
  image: docker:24
  services:
    - docker:24-dind
  before_script:
    - docker login -u \$CI_REGISTRY_USER -p \$CI_REGISTRY_PASSWORD \$CI_REGISTRY
  script:
    - docker build --cache-from \$CI_REGISTRY_IMAGE:latest -t \$IMAGE_NAME .
    - docker push \$IMAGE_NAME
  only:
    - main
    - /^release\\/.*/

# ── Deploy Dev ─────────────────────────────────────────
deploy-dev:
  stage: deploy-dev
  environment:
    name: development
    url: https://dev.myapp.com
  script:
    - helm upgrade --install myapp ./helm/myapp
        --set image.tag=\${CI_COMMIT_SHA}
        --namespace dev
        --atomic --timeout 5m
  only:
    - main

# ── Deploy Staging ─────────────────────────────────────
deploy-staging:
  stage: deploy-staging
  environment:
    name: staging
    url: https://staging.myapp.com
  script:
    - helm upgrade --install myapp ./helm/myapp
        --set image.tag=\${CI_COMMIT_SHA}
        --namespace staging
        --atomic --timeout 5m
  only:
    - main
  needs:
    - deploy-dev

# ── Deploy Production ──────────────────────────────────
deploy-prod:
  stage: deploy-prod
  environment:
    name: production
    url: https://myapp.com
  script:
    - helm upgrade --install myapp ./helm/myapp
        --set image.tag=\${CI_COMMIT_SHA}
        --namespace production
        --atomic --timeout 10m
  when: manual
  only:
    - main
  needs:
    - deploy-staging
\`\`\`

## GitHub Actions Equivalent

\`\`\`yaml
# .github/workflows/pipeline.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm test -- --coverage

  deploy-staging:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - run: echo "Deploy to staging"

  deploy-prod:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: echo "Deploy to production"
\`\`\`

## Pipeline Best Practices

**Fail fast**: Run the quickest checks first (lint → unit tests → integration tests → slow scans).

**Parallel jobs**: Run independent stages simultaneously. Unit tests + lint + secret scanning can all run in parallel.

**Cache aggressively**: Cache \`node_modules\`, Maven \`.m2\`, pip packages. Build time drops from 8 minutes to 2.

**Immutable artifacts**: Build once, deploy the same artifact everywhere. Never rebuild for staging vs production.

**Pipeline as code**: The \`.gitlab-ci.yml\` / \`.github/workflows/\` file lives in the repo, version controlled, reviewed in PRs.
`,
          interviewQuestions: [
            {
              question: "What's the difference between Continuous Delivery and Continuous Deployment?",
              difficulty: "junior" as const,
              answer: `**Continuous Delivery**: Every code change that passes the pipeline is deployable to production. But the actual deployment requires a human to approve it. The pipeline validates it *can* be deployed — the human decides *when*.

**Continuous Deployment**: Every code change that passes the pipeline is automatically deployed to production. No human gate. Zero manual steps.

Most companies practice Continuous Delivery, not Continuous Deployment. Continuous Deployment requires very high test coverage (90%+), feature flags, robust monitoring and automated rollback.

Amazon deploys to production every 11.7 seconds — this is continuous deployment. Most enterprises use continuous delivery with a manual approval gate for production.`,
            },
            {
              question: "A pipeline takes 45 minutes to run. How do you speed it up?",
              difficulty: "mid" as const,
              answer: `**Step 1: Measure** where time is spent (GitLab pipeline view shows job durations).

**Step 2: Parallelize** independent jobs:
\`\`\`yaml
test:
  parallel:
    matrix:
      - SUITE: [unit, integration, e2e-chrome, e2e-firefox]
\`\`\`

**Step 3: Cache dependencies**:
\`\`\`yaml
cache:
  key: \${CI_COMMIT_REF_SLUG}-\${hashFiles('package-lock.json')}
  paths: [node_modules/, .npm/]
\`\`\`

**Step 4: Fail fast ordering** — run lint (30s) before integration tests (10m). Don't wait 20 minutes to find a syntax error.

**Step 5: Docker layer caching** — \`docker build --cache-from \$CI_REGISTRY_IMAGE:latest\`

**Step 6: Scope slow tests** — E2E tests only on main/release branches, not every PR.

Result: A 45-minute pipeline typically drops to 8-12 minutes with parallelization + caching.`,
            },
          ],
        },
        {
          id: "pipeline-rules-and-mr",
          title: "Pipeline Rules, MR Pipelines & Branch Protection",
          duration: 20,
          type: "lesson",
          description: "Control when pipelines run, protect branches, and enforce quality gates on merge requests.",
          objectives: [
            "Write pipeline rules to control job execution",
            "Configure MR pipelines that run against merged results",
            "Set up branch protection rules to enforce pipeline success",
            "Implement environment-specific deployment gates",
          ],
          content: `# Pipeline Rules, MR Pipelines & Branch Protection

## Pipeline Rules (GitLab)

\`rules:\` provides fine-grained control over when jobs run:

\`\`\`yaml
deploy-prod:
  stage: deploy-prod
  script:
    - ./deploy.sh production
  rules:
    - if: \$CI_COMMIT_BRANCH == "main"
      when: manual
    - if: \$CI_COMMIT_TAG =~ /^v\\d+\\.\\d+\\.\\d+\$/
      when: on_success
    - when: never

unit-tests:
  stage: test
  script:
    - npm test
  rules:
    - if: \$CI_PIPELINE_SOURCE == "merge_request_event"
    - if: \$CI_COMMIT_BRANCH == "main"
    - if: \$CI_PIPELINE_SOURCE == "schedule"
      when: never

# Only rebuild docs when doc files change
docs-build:
  stage: build
  script:
    - mkdocs build
  rules:
    - changes:
        - docs/**/*
        - mkdocs.yml
      when: on_success
    - when: never
\`\`\`

## MR Pipelines

MR pipelines run against the **merged result** of source + target branch — catching integration conflicts before they land in main.

\`\`\`yaml
validate-mr:
  rules:
    - if: \$CI_PIPELINE_SOURCE == "merge_request_event"

test:
  script:
    - npm test
  rules:
    - if: \$CI_PIPELINE_SOURCE == "merge_request_event"
      variables:
        TEST_FLAGS: "--bail"
    - if: \$CI_COMMIT_BRANCH == "main"
      variables:
        TEST_FLAGS: "--coverage"
\`\`\`

Enable in **Settings → Merge Requests**:
- ✅ Pipelines must succeed before merging
- ✅ All threads must be resolved
- ✅ Require code owner approval

## Branch Protection Rules

### GitLab (Settings → Repository → Protected Branches)

\`\`\`
Branch: main
  Allowed to push:  No one (force push disabled)
  Allowed to merge: Maintainers only
  Require code owner approval: ✅
  Pipeline must succeed: ✅

Branch: release/*
  Allowed to push:  Developers (hotfixes)
  Allowed to merge: Maintainers
  Pipeline must succeed: ✅
\`\`\`

### GitHub Branch Protection as Terraform

\`\`\`hcl
resource "github_branch_protection" "main" {
  repository_id = github_repository.myapp.node_id
  pattern       = "main"

  required_status_checks {
    strict   = true
    contexts = ["build", "test", "sast", "dependency-scan"]
  }

  required_pull_request_reviews {
    required_approving_review_count = 2
    dismiss_stale_reviews           = true
    require_code_owner_reviews      = true
  }

  enforce_admins      = true
  allows_force_pushes = false
  allows_deletions    = false
}
\`\`\`

## Environment Approvals

\`\`\`yaml
# GitLab: manual approval for production
deploy-prod:
  stage: deploy-prod
  environment:
    name: production
    deployment_tier: production
  script:
    - helm upgrade --install myapp ./helm/myapp --namespace production
  when: manual
  allow_failure: false
\`\`\`

In GitHub: set **required reviewers** on the \`production\` environment — any workflow deploying to it will pause for approval.
`,
          interviewQuestions: [
            {
              question: "Why use MR pipelines instead of just branch pipelines?",
              difficulty: "mid" as const,
              answer: `Branch pipelines run against your feature branch in isolation. MR pipelines run against the **simulated merged result** — as if you already merged.

This catches:

1. **Integration conflicts**: Your branch adds \`processPayment()\` to billing.js. Another branch merged yesterday adds a conflicting function. Branch pipelines: both green. MR pipeline: fails on the merged result.

2. **Integration test failures**: Your code works in isolation but breaks a test added to main after you branched.

3. **Earlier detection**: Catch conflicts before merge, when they're cheapest to fix — not after, when they become everyone's problem on main.

Setup in GitLab:
\`\`\`yaml
rules:
  - if: \$CI_PIPELINE_SOURCE == "merge_request_event"
\`\`\`

With "pipelines must succeed" enabled, you can never merge broken code. At scale (20+ developers merging to main), this keeps main perpetually green.`,
            },
          ],
        },
      ],
    },
    {
      id: "artifact-management",
      title: "Artifacts, Versioning & Promotion",
      level: "intermediate",
      description: "Manage build artifacts, semantic versioning, git tags, and promote releases across environments.",
      lessons: [
        {
          id: "artifact-versioning",
          title: "Artifact Management & Versioning",
          duration: 20,
          type: "lesson",
          description: "Build immutable artifacts, version them semantically, and manage registries.",
          objectives: [
            "Implement semantic versioning for releases",
            "Create versioned Docker images and Helm charts",
            "Use GitLab/GitHub Package Registry for artifact storage",
            "Automate versioning with conventional commits",
          ],
          content: `# Artifact Management & Versioning

## What is an Artifact?

Anything produced by the build pipeline that gets deployed or used downstream:
- **Docker images** (container registry)
- **Helm charts** (OCI registry / chart museum)
- **npm/pip packages** (package registry)
- **JAR/WAR files** (Maven/Nexus)
- **Binary executables** (S3, GitLab packages)

**The golden rule**: Build once, deploy everywhere. Never rebuild for staging vs production. The exact artifact promoted through environments guarantees what you tested is what you deployed.

## Semantic Versioning

\`\`\`
Format: MAJOR.MINOR.PATCH[-prerelease][+build]

MAJOR: Breaking changes (API incompatible)
MINOR: New features (backwards compatible)
PATCH: Bug fixes (backwards compatible)

Examples:
  1.0.0       → first stable release
  1.1.0       → new feature added
  1.1.1       → bug fix
  2.0.0       → breaking API change
  1.2.0-rc.1  → release candidate
\`\`\`

## Git Tags for Release Versioning

\`\`\`bash
# Create annotated tag (preferred — includes tagger info and date)
git tag -a v1.2.3 -m "Release 1.2.3 — adds payment retry logic"
git push origin v1.2.3

# List tags (most recent first)
git tag -l --sort=-version:refname | head -10

# Tag a specific commit (e.g., for a hotfix)
git tag -a v1.2.2 abc1234 -m "Hotfix for payment timeout"

# Delete a tag (before it's released)
git tag -d v1.2.3
git push origin --delete v1.2.3
\`\`\`

## Automated Versioning with semantic-release

\`\`\`yaml
# .gitlab-ci.yml
semantic-release:
  stage: release
  image: node:20
  script:
    - npx semantic-release
  only:
    - main
# Reads conventional commits:
#   feat: add payment retry    → bumps MINOR (1.1.0 → 1.2.0)
#   fix: timeout on checkout   → bumps PATCH (1.1.0 → 1.1.1)
#   feat!: new auth API        → bumps MAJOR (1.1.0 → 2.0.0)
\`\`\`

\`\`\`bash
# Conventional commit format
git commit -m "feat: add SQS retry queue for failed payments"
git commit -m "fix: resolve race condition in order lock"
git commit -m "feat!: replace REST API with GraphQL"
\`\`\`

## Docker Image Versioning Strategy

\`\`\`yaml
build-and-tag:
  stage: package
  script:
    - |
      VERSION=$(cat VERSION)
      docker build \
        -t \$CI_REGISTRY_IMAGE:\$CI_COMMIT_SHA \
        -t \$CI_REGISTRY_IMAGE:\$VERSION \
        -t \$CI_REGISTRY_IMAGE:latest \
        .
      docker push \$CI_REGISTRY_IMAGE --all-tags

# Tag strategy:
#   myapp:abc1234   → exact commit SHA (immutable, for debugging)
#   myapp:v1.2.3    → semver release (immutable)
#   myapp:latest    → floating, most recent main build (mutable)
\`\`\`

## Artifact Retention Policies

\`\`\`yaml
# GitLab CI artifacts — set expiry
build:
  artifacts:
    paths: [dist/]
    expire_in: 1 week

test-reports:
  artifacts:
    reports:
      junit: junit.xml
    expire_in: 30 days

# Docker registry cleanup (GitLab):
# Settings → Packages & Registries → Cleanup policies
# Keep last N images per tag, remove older than N days
# Keep images matching regex: v\d+\.\d+\.\d+
\`\`\`
`,
          interviewQuestions: [
            {
              question: "Why build once and promote the same artifact rather than rebuilding per environment?",
              difficulty: "mid" as const,
              answer: `Rebuilding per environment creates a critical gap: the binary tested in staging differs from the one in production, even if source code is identical. Environmental differences (compiler cache, dependency resolution, OS library versions on the runner) can produce different outputs.

**Problems with rebuild-per-environment:**
1. Non-deterministic: build 1 and build 2 of the same commit can differ
2. Dependency drift: a week later you might get a different patch version of a transitive dep
3. Trust gap: "we tested v1.1.0-build-1 in staging but deployed v1.1.0-build-2 to prod"

**Build once, promote everywhere:**
\`\`\`
CI: commit abc1234 → build → myapp:abc1234
    → test in dev with myapp:abc1234
    → promote to staging (same image, different config)
    → promote to prod (same image, different config)
\`\`\`

What changes between environments is **configuration** (env vars, secrets, replica counts) — not the artifact. Tag images with the git SHA (\`myapp:abc1234\`) — immutable, auditable, traceable back to the exact commit.`,
            },
          ],
        },
        {
          id: "artifact-promotion",
          title: "Artifact Promotion & Release Management",
          duration: 18,
          type: "lesson",
          description: "Promote artifacts across environments, manage release branches, and implement deployment strategies.",
          objectives: [
            "Implement promotion pipelines that deploy the same artifact across environments",
            "Manage release branches and hotfix workflows",
            "Use blue/green and canary deployment strategies",
            "Implement rollback procedures for production incidents",
          ],
          content: `# Artifact Promotion & Release Management

## The Promotion Model

\`\`\`
┌──────────────────────────────────────────────────────┐
│               Promotion Pipeline                     │
│                                                      │
│  Build → DEV ──(auto)──> STAGING ──(auto)──>         │
│  PROD (manual approval + change window)              │
│                                                      │
│  Image: myapp:v1.2.3 flows unchanged                 │
│  Config: values-dev.yaml / values-staging.yaml /    │
│          values-prod.yaml (different per env)        │
└──────────────────────────────────────────────────────┘
\`\`\`

## GitLab Promotion Pipeline

\`\`\`yaml
set-version:
  stage: .pre
  script:
    - echo "APP_VERSION=$(cat VERSION)" >> build.env
  artifacts:
    reports:
      dotenv: build.env  # shares APP_VERSION to downstream jobs

deploy-dev:
  stage: deploy-dev
  script:
    - helm upgrade --install myapp ./charts/myapp
        --set image.tag=\$APP_VERSION
        --namespace dev
        --values helm/values-dev.yaml
  environment:
    name: dev

deploy-staging:
  stage: deploy-staging
  needs:
    - job: deploy-dev
      artifacts: true
  script:
    - helm upgrade --install myapp ./charts/myapp
        --set image.tag=\$APP_VERSION   # SAME tag as dev
        --namespace staging
        --values helm/values-staging.yaml

deploy-prod:
  stage: deploy-prod
  needs:
    - job: deploy-staging
      artifacts: true
  script:
    - helm upgrade --install myapp ./charts/myapp
        --set image.tag=\$APP_VERSION   # SAME tag as staging
        --namespace production
        --values helm/values-prod.yaml
  when: manual
\`\`\`

## Release Branch Strategy

\`\`\`
main ──────────────────────────────── (always deployable)
        │              │
        │              └── release/1.3.0 ── hotfix/1.3.1
        └── feature/payment-retry
\`\`\`

\`\`\`bash
# Create release branch from main
git checkout -b release/1.3.0 main
git push origin release/1.3.0

# Only cherry-pick bug fixes into release branch
git cherry-pick abc1234  # specific fix from main

# Tag the release
git tag -a v1.3.0 -m "Release 1.3.0"
git push origin v1.3.0

# Merge release branch back to main
git checkout main && git merge release/1.3.0
\`\`\`

## Hotfix Workflow

\`\`\`bash
# Production is on v1.3.0, critical bug found
# Branch from the tag (NOT from main which has 20 unreleased commits)
git checkout -b hotfix/1.3.1 v1.3.0

git commit -m "fix: payment gateway timeout on retry"
git tag -a v1.3.1 -m "Hotfix: payment gateway timeout"
git push origin v1.3.1 --tags

# Cherry-pick fix back to main
git checkout main
git cherry-pick <hotfix-sha>
\`\`\`

## Deployment Strategies

### Blue/Green: Zero-Downtime Cutover

\`\`\`bash
# Blue is live. Deploy green (new version) in parallel.
kubectl apply -f k8s/deployment-green.yaml
kubectl rollout status deployment/myapp-green

# Smoke test green before switching
./smoke-tests.sh https://green.internal.myapp.com

# Switch service selector from blue to green (instant)
kubectl patch service myapp \
  --patch '{"spec":{"selector":{"slot":"green"}}}'

# Keep blue running 15 min for instant rollback if needed
\`\`\`

### Canary: Gradual Traffic Shift

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
spec:
  strategy:
    canary:
      steps:
      - setWeight: 5      # 5% to canary, watch metrics 10m
      - pause: {duration: 10m}
      - setWeight: 20
      - pause: {duration: 10m}
      - setWeight: 50
      - pause: {}         # manual gate before 100%
      - setWeight: 100
\`\`\`
`,
          interviewQuestions: [
            {
              question: "How do you manage a hotfix when main has moved ahead of production?",
              difficulty: "senior" as const,
              answer: `Production is on v1.3.0 but main has 20 commits not yet ready for production. You can't deploy from main.

**Hotfix workflow:**
\`\`\`bash
# 1. Branch from the production tag (not main)
git checkout -b hotfix/payment-timeout v1.3.0

# 2. Apply the fix
git commit -m "fix: increase payment gateway timeout to 30s"

# 3. Tag and push
git tag -a v1.3.1 -m "Hotfix 1.3.1"
git push origin v1.3.1

# 4. CI triggers on tag: runs tests, deploys to production

# 5. Cherry-pick back to main (don't merge — would bring v1.3.0 state)
git checkout main
git cherry-pick <hotfix-sha>
\`\`\`

**Why cherry-pick not merge**: Merging the hotfix branch back includes the entire v1.3.0 state, which could revert main's 20 new commits. Cherry-pick applies only the specific fix.

**Pipeline consideration**: Hotfix pipelines should skip full E2E suites (testing features not in the hotfix) but still run unit tests + smoke tests.`,
            },
          ],
        },
        {
          id: "deployment-formats",
          title: "How Software Gets Deployed: Formats & Packaging",
          duration: 40,
          type: "lesson" as const,
          description: "Understand every deployment format — Docker images, Helm charts, JAR/WAR files, Lambda ZIPs, native packages, and raw code — with the pipeline steps for each and when to use which.",
          content: `# How Software Gets Deployed: Formats & Packaging

A CI pipeline's job is to turn source code into a **deployable artifact**. The format of that artifact fundamentally shapes how your deployment pipeline works, what your rollback strategy looks like, and how you promote between environments. Understanding each format — and its trade-offs — is core DevOps knowledge.

## Format 1: Container Images (Docker)

The dominant deployment format for modern applications. You build a Docker image, push it to a registry (ECR, DockerHub, GHCR), and your orchestrator (Kubernetes, ECS) pulls and runs it.

**Why containers won:** The image is immutable and self-contained — it bundles your application code, runtime (Node.js, Python, JVM), system libraries, and configuration defaults. "It works on my machine" disappears because dev, staging, and prod all run the identical image bytes.

**Pipeline flow:**
\`\`\`
Code push
  → Lint + Unit tests
  → docker build -t myapp:\${GIT_SHA} .
  → docker push registry.io/myapp:\${GIT_SHA}
  → Image vulnerability scan (Trivy/Grype)
  → Deploy image tag to dev (kubectl set image / helm upgrade)
  → Integration tests against dev
  → Promote same image tag to staging
  → Promote same image tag to prod (manual gate)
\`\`\`

The image tag (\`\${GIT_SHA}\`) is the immutable handle. The exact same bytes that passed tests in dev are what land in prod — no rebuild.

\`\`\`bash
# Build with multiple tags for traceability
docker build \\
  -t registry.io/myapp:\${GIT_SHA} \\
  -t registry.io/myapp:main-latest \\
  --label git.sha=\${GIT_SHA} \\
  --label build.date=$(date -u +%Y-%m-%dT%H:%M:%SZ) \\
  --label build.pipeline=\${CI_PIPELINE_ID} \\
  .

docker push registry.io/myapp:\${GIT_SHA}
\`\`\`

**Signing container images** (supply chain security):
\`\`\`bash
# Sign after push using cosign (Sigstore)
cosign sign --key cosign.key registry.io/myapp:\${GIT_SHA}

# Verify before deploy
cosign verify --key cosign.pub registry.io/myapp:\${GIT_SHA}
\`\`\`

## Format 2: Helm Charts (Kubernetes)

Helm is the package manager for Kubernetes. A Helm **chart** is a templated collection of Kubernetes YAML files (Deployments, Services, ConfigMaps, Ingress, etc.). You deploy a chart with values specific to each environment — the chart template is reused, the values change.

**Chart structure:**
\`\`\`
charts/myapp/
├── Chart.yaml          # chart name, version, appVersion
├── values.yaml         # default values (lowest priority)
├── values-dev.yaml     # dev overrides
├── values-staging.yaml # staging overrides
├── values-prod.yaml    # prod overrides
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    ├── configmap.yaml
    └── hpa.yaml        # Horizontal Pod Autoscaler
\`\`\`

**Deployment pipeline with Helm:**
\`\`\`bash
# Build and push image
docker build -t registry.io/myapp:\${APP_VERSION} .
docker push registry.io/myapp:\${APP_VERSION}

# Deploy to dev
helm upgrade --install myapp ./charts/myapp \\
  --namespace dev \\
  --values ./charts/myapp/values-dev.yaml \\
  --set image.tag=\${APP_VERSION} \\
  --set image.repository=registry.io/myapp \\
  --atomic \\          # roll back automatically if deploy fails
  --timeout 5m \\
  --wait              # wait for all pods to be ready

# Verify health before promoting
kubectl rollout status deployment/myapp -n dev
curl -sf https://dev.myapp.internal/health | jq '.status == "ok"'

# Same chart, same image tag, different values for staging
helm upgrade --install myapp ./charts/myapp \\
  --namespace staging \\
  --values ./charts/myapp/values-staging.yaml \\
  --set image.tag=\${APP_VERSION}
\`\`\`

**Packaging and versioning charts** (for chart promotion):
\`\`\`bash
# Package chart into a .tgz for storage in artifact registry
helm package ./charts/myapp --version 1.3.0 --app-version \${APP_VERSION}
# → myapp-1.3.0.tgz

# Push to OCI chart registry (e.g., ECR, Harbor, GitLab)
helm push myapp-1.3.0.tgz oci://registry.io/helm-charts

# Deploy from registry (not from local filesystem)
helm upgrade --install myapp oci://registry.io/helm-charts/myapp \\
  --version 1.3.0 \\
  --values values-prod.yaml \\
  --set image.tag=\${APP_VERSION}
\`\`\`

**Helm history and rollback:**
\`\`\`bash
helm history myapp -n production
# REVISION  STATUS     CHART       APP VERSION  DESCRIPTION
# 42        superseded myapp-1.2.0 v2.1.0       Upgrade complete
# 43        deployed   myapp-1.3.0 v2.2.0       Upgrade complete

# Instant rollback to previous revision
helm rollback myapp 42 -n production
\`\`\`

## Format 3: JAR / WAR Files (JVM Applications)

Java applications compile to JAR (Java Archive) or WAR (Web Application Archive) files. A JAR contains compiled class files, resources, and dependencies. A WAR is a JAR structured for deployment into a servlet container like Tomcat.

**Fat JAR (Uber JAR)** — All dependencies bundled into one file. Spring Boot's default output is a fat JAR. Self-contained: \`java -jar myapp.jar\`. No dependency classpath to manage.

**Thin JAR** — Only your compiled code; dependencies are on the classpath. Faster to build and transfer (only your code changes), but requires the runtime and dependency JARs to be present.

**Pipeline flow for a Spring Boot app:**
\`\`\`bash
# Build
./mvnw clean package -DskipTests  # or: ./gradlew bootJar

# The JAR is the artifact
ls target/myapp-1.3.0.jar

# Upload to Nexus/Artifactory
mvn deploy:deploy-file \\
  -DgroupId=com.company \\
  -DartifactId=myapp \\
  -Dversion=1.3.0 \\
  -Dpackaging=jar \\
  -Dfile=target/myapp-1.3.0.jar \\
  -DrepositoryId=releases \\
  -Durl=https://nexus.company.com/repository/maven-releases/

# Deploy to a server
scp target/myapp-1.3.0.jar deploy@appserver01:/opt/myapp/
ssh deploy@appserver01 "
  systemctl stop myapp
  cp /opt/myapp/myapp-1.3.0.jar /opt/myapp/current/myapp.jar
  systemctl start myapp
  systemctl is-active myapp
"
\`\`\`

**Modern pattern: JAR inside a Docker image** — Most teams running JVM on Kubernetes wrap the JAR in a container:
\`\`\`dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/myapp-1.3.0.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`
This gives you all the benefits of container immutability while keeping the JVM ecosystem.

## Format 4: Lambda Deployment Packages (ZIP & Container)

AWS Lambda accepts two artifact types: a ZIP file containing your function code and dependencies, or a container image (ECR).

**ZIP deployment (Node.js example):**
\`\`\`bash
# Install only production dependencies
npm ci --production

# Zip function code + node_modules
zip -r function.zip index.js node_modules/

# Deploy via AWS CLI
aws lambda update-function-code \\
  --function-name my-function \\
  --zip-file fileb://function.zip

# Publish a version (immutable snapshot)
VERSION=$(aws lambda publish-version \\
  --function-name my-function \\
  --query 'Version' --output text)

# Point alias to new version
aws lambda update-alias \\
  --function-name my-function \\
  --name prod \\
  --function-version $VERSION

# Weighted alias for canary (10% to new version)
aws lambda update-alias \\
  --function-name my-function \\
  --name prod \\
  --routing-config AdditionalVersionWeights={"$VERSION"=0.1}
\`\`\`

**Lambda container image (for larger functions, >50 MB):**
\`\`\`dockerfile
FROM public.ecr.aws/lambda/python:3.12
COPY requirements.txt .
RUN pip install -r requirements.txt --target \${LAMBDA_TASK_ROOT}
COPY app.py \${LAMBDA_TASK_ROOT}
CMD ["app.handler"]
\`\`\`

## Format 5: Raw Code / Source-Based Deployment

Some platforms deploy source code directly rather than compiled artifacts:
- **PaaS platforms** (Heroku, Railway, Render, Google App Engine): push code, platform builds and runs it
- **PHP/Python/Ruby applications**: rsync or git pull directly to servers (simpler setups)
- **Ansible/Chef/Puppet**: configuration management tools that sync code files to servers

\`\`\`bash
# Simple rsync deployment (small apps, legacy systems)
rsync -avz --delete \\
  --exclude='.git' \\
  --exclude='node_modules' \\
  --exclude='.env' \\
  ./dist/ deploy@webserver:/var/www/myapp/

# Or: git pull on the server (only if the server can reach your repo)
ssh deploy@webserver "
  cd /var/www/myapp
  git fetch origin
  git checkout v1.3.0
  composer install --no-dev
  php artisan migrate --force
  php artisan config:cache
  sudo systemctl reload php8.2-fpm
"
\`\`\`

## Format 6: Infrastructure-as-Code (Terraform/CloudFormation)

"Deploying" infrastructure is a separate pipeline from application deployments. The artifact is a plan — a calculated diff of what infrastructure changes will be applied.

\`\`\`bash
# Terraform pipeline
terraform init
terraform validate
terraform plan -out=tfplan    # generate plan artifact
# → Human/automation reviews plan
terraform apply tfplan         # apply exactly the plan reviewed

# Store plan artifact in CI for audit trail
aws s3 cp tfplan s3://terraform-plans/\${CI_PIPELINE_ID}/tfplan
\`\`\`

## Format 7: Native OS Packages (RPM/DEB)

For applications that need to integrate with systemd, install binaries to PATH, or be managed by OS package managers:

\`\`\`bash
# Build an RPM
rpmbuild -ba myapp.spec
# → myapp-1.3.0-1.x86_64.rpm

# Upload to YUM/APT repository
aws s3 cp myapp-1.3.0-1.x86_64.rpm s3://packages.company.com/el9/

# Deploy via Ansible
- name: Install myapp
  yum:
    name: myapp-1.3.0
    state: present
  notify: restart myapp
\`\`\`

## Choosing a Deployment Format

| Application type | Recommended format |
|---|---|
| Kubernetes-based services | Container image + Helm chart |
| AWS Lambda | ZIP or container image |
| JVM microservices on K8s | Fat JAR inside Docker image |
| Traditional JVM on VMs | JAR deployed via Ansible/Systemd |
| Static frontends | S3 + CloudFront (raw files) |
| ML models | Container image or SageMaker model artifact |
| Infrastructure | Terraform plan |
| Legacy PHP/Ruby on VMs | rsync + git pull |`,
          interviewQuestions: [
            {
              question: "Why is it important that the same artifact (image tag) is deployed to dev, staging, and prod rather than rebuilding for each environment?",
              answer: "Rebuilding for each environment breaks the fundamental guarantee of environment promotion: that what you tested is what you deploy. Even with identical source code, a rebuild can produce a different artifact due to: dependency version resolution (floating versions like ^1.2 may resolve to a newer patch), different base image layers pulled from the registry, build environment differences, or non-deterministic build steps. The immutable artifact pattern — build once, tag with git SHA, promote the same tag — guarantees that the binary in production is byte-for-byte identical to what passed every test gate. Environment-specific configuration is injected at runtime via Helm values files, environment variables, or a config management service.",
              difficulty: "mid" as const,
            },
            {
              question: "What is the difference between a Helm chart version and an app version, and how do you manage them?",
              answer: "In Chart.yaml, 'version' is the Helm chart version (the packaging and templates), while 'appVersion' is the application version (the Docker image tag). They're independent: the chart templates can change (version 1.3.0 → 1.3.1) without the application code changing, and the application image can update (appVersion bumps) without chart template changes. Best practice: keep chart version in semver and increment it when chart templates change; set appVersion to the git SHA or semantic version of the application. In the pipeline, pass the image tag via --set image.tag= rather than appVersion, since appVersion in Chart.yaml is metadata and doesn't control which image is pulled — your deployment.yaml template determines that.",
              difficulty: "senior" as const,
            },
          ],
        },
        {
          id: "standard-pipeline-workflow",
          title: "Standard CI/CD Pipeline Workflow End-to-End",
          duration: 45,
          type: "lesson" as const,
          description: "A complete walkthrough of a production-grade CI/CD pipeline from code push to production, covering environment promotion, verification gates, artifact management, and rollback strategies.",
          content: `# Standard CI/CD Pipeline Workflow End-to-End

A production-grade pipeline is not just "run tests, deploy." It's a sequence of increasingly expensive verification gates, with automated promotion when confidence is high and human gates where the risk warrants it. Here is the complete, standard workflow used by mature engineering teams.

## The Full Pipeline: Code to Production

\`\`\`
Developer pushes to feature branch
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│ MR/PR PIPELINE (runs on every commit to feature branch)         │
│                                                                 │
│  ① Lint + Format Check (~30s)                                   │
│  ② Unit Tests + Code Coverage Gate (~2-5m, parallel)            │
│  ③ SAST scan + Secret Detection (~2m, parallel)                 │
│  ④ Build Docker image (not pushed yet) (~2-5m)                  │
│  ⑤ SCA / Dependency vulnerability scan (~1m)                    │
│                                                                 │
│  GATE: All must pass. MR cannot be merged if any fail.          │
└─────────────────────────────────────────────────────────────────┘
       │ MR approved + merged to main
       ▼
┌─────────────────────────────────────────────────────────────────┐
│ MAIN BRANCH PIPELINE (runs on every merge to main)              │
│                                                                 │
│  ① Build final Docker image                                     │
│     → Tag: registry.io/myapp:abc1234 (git SHA)                  │
│     → Push to registry                                          │
│  ② Container image vulnerability scan (Trivy)                   │
│  ③ Sign image (cosign)                                          │
│  ④ Publish build metadata (SBOM to artifact store)              │
│                                                                 │
│  GATE: Image must have no CRITICAL CVEs. Scan must pass.        │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│ DEPLOY TO DEV (automated, no approval)                          │
│                                                                 │
│  helm upgrade --install myapp ... --set image.tag=abc1234       │
│  → Wait for rollout (kubectl rollout status)                    │
│  → Run smoke tests (health check endpoints)                     │
│  → Run API contract tests                                       │
│                                                                 │
│  GATE: Smoke tests must pass. Rollout must complete in 5m.      │
└─────────────────────────────────────────────────────────────────┘
       │ auto (on green dev)
       ▼
┌─────────────────────────────────────────────────────────────────┐
│ DEPLOY TO STAGING (automated, no approval)                      │
│                                                                 │
│  Same image tag, staging Helm values                            │
│  → Integration tests (full suite, real DB)                      │
│  → E2E tests (Playwright/Cypress against staging)               │
│  → Performance baseline check                                   │
│  → DAST scan (OWASP ZAP against staging URL)                    │
│                                                                 │
│  GATE: E2E must pass. No P0 performance regression.             │
└─────────────────────────────────────────────────────────────────┘
       │ manual approval (or auto on off-hours)
       ▼
┌─────────────────────────────────────────────────────────────────┐
│ DEPLOY TO PRODUCTION (human-gated)                              │
│                                                                 │
│  ① Change ticket auto-created, linked to pipeline               │
│  ② Approver verifies staging passed, reviews diff               │
│  ③ Canary deploy: 5% traffic to new version                     │
│  ④ Monitor error rates + latency for 10 minutes                 │
│  ⑤ Full rollout or automatic rollback                           │
│                                                                 │
│  POST-DEPLOY: Smoke tests on production + alert watchdog        │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## Stage-by-Stage: What Runs and Why

### Stage 1: Lint and Static Analysis (30 seconds)

Run first because it's cheapest. A syntax error shouldn't wait for a 5-minute build.

\`\`\`yaml
# GitLab CI example
lint:
  stage: validate
  script:
    - eslint src/ --max-warnings 0   # JS/TS
    - black --check .                # Python
    - golangci-lint run ./...        # Go
    - hadolint Dockerfile            # Dockerfile
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
\`\`\`

### Stage 2: Unit Tests with Coverage Gate

\`\`\`yaml
unit-tests:
  stage: test
  script:
    - npm run test:coverage
  coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'
  artifacts:
    reports:
      junit: test-results.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      variables:
        COVERAGE_MIN: "80"  # enforce coverage gate on MRs
\`\`\`

**Coverage gate:** Block merges where coverage drops below a threshold. But measure coverage meaningfully — 80% of meaningful logic tested is better than 100% of trivial getters/setters.

### Stage 3: Build and Push Image

\`\`\`yaml
build-image:
  stage: build
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH  # only on main
  variables:
    IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
  script:
    - docker buildx build
        --platform linux/amd64,linux/arm64
        --cache-from type=registry,ref=$CI_REGISTRY_IMAGE:cache
        --cache-to type=registry,ref=$CI_REGISTRY_IMAGE:cache,mode=max
        --tag $IMAGE
        --push
        .
    - echo "IMAGE_TAG=$CI_COMMIT_SHORT_SHA" >> build.env
  artifacts:
    reports:
      dotenv: build.env  # passes IMAGE_TAG to downstream jobs
\`\`\`

### Stage 4: Container Scan

\`\`\`yaml
container-scan:
  stage: scan
  needs: [build-image]
  variables:
    IMAGE: $CI_REGISTRY_IMAGE:$IMAGE_TAG
  script:
    - trivy image
        --exit-code 1
        --severity CRITICAL
        --ignore-unfixed
        --format sarif
        --output trivy-report.sarif
        $IMAGE
  artifacts:
    reports:
      sast: trivy-report.sarif
  allow_failure: false  # CRITICAL CVEs block pipeline
\`\`\`

### Stage 5: Deploy to Dev (Automatic)

\`\`\`yaml
deploy-dev:
  stage: deploy-dev
  needs: [container-scan]
  environment:
    name: dev
    url: https://dev.myapp.internal
  script:
    # Verify the image signature before deploying
    - cosign verify --key cosign.pub $CI_REGISTRY_IMAGE:$IMAGE_TAG

    # Deploy with Helm
    - helm upgrade --install myapp ./charts/myapp
        --namespace dev
        --values charts/myapp/values-dev.yaml
        --set image.repository=$CI_REGISTRY_IMAGE
        --set image.tag=$IMAGE_TAG
        --atomic
        --timeout 5m

    # Wait for rollout
    - kubectl rollout status deployment/myapp -n dev --timeout=5m

    # Smoke tests
    - |
      for endpoint in /health /ready /version; do
        STATUS=$(curl -sf -o /dev/null -w "%{http_code}" https://dev.myapp.internal$endpoint)
        [ "$STATUS" = "200" ] || (echo "Smoke test failed: $endpoint returned $STATUS" && exit 1)
      done
\`\`\`

### Stage 6: Integration & E2E Tests

\`\`\`yaml
integration-tests:
  stage: test-staging
  needs: [deploy-staging]
  script:
    - pytest tests/integration/ -v --tb=short
        --junit-xml=integration-results.xml
  artifacts:
    reports:
      junit: integration-results.xml

e2e-tests:
  stage: test-staging
  needs: [deploy-staging]
  image: mcr.microsoft.com/playwright:v1.40.0-jammy
  script:
    - npx playwright test --reporter=html
  artifacts:
    when: always
    paths:
      - playwright-report/
    expire_in: 7 days
\`\`\`

### Stage 7: Production Deploy with Canary

\`\`\`yaml
deploy-prod-canary:
  stage: deploy-prod
  when: manual  # requires human click after staging passes
  environment:
    name: production
    url: https://myapp.com
  script:
    # Deploy canary (5% traffic) using Argo Rollouts
    - kubectl argo rollouts set image myapp myapp=$CI_REGISTRY_IMAGE:$IMAGE_TAG -n production
    # Argo Rollouts automatically starts the canary steps from the Rollout manifest
    - echo "Canary deployed. Monitor at https://grafana.internal/d/myapp-canary"

deploy-prod-promote:
  stage: deploy-prod
  when: manual  # second manual gate after watching canary metrics
  needs: [deploy-prod-canary]
  script:
    - kubectl argo rollouts promote myapp -n production
\`\`\`

## Environment Promotion Rules

The key principle: **environments are promotion gates, not rebuild targets**.

| Promotion | Trigger | Gate |
|---|---|---|
| Build → Dev | Merge to main | Container scan passes |
| Dev → Staging | Dev smoke tests pass | Automatic |
| Staging → Prod | Staging E2E pass + manual | Human approval |
| Canary → Full prod | Canary metrics pass | Human or automated |

**Never rebuild the image when promoting.** The pipeline passes the image tag as an artifact variable between stages. The same tag flows from dev → staging → prod.

## Automated Verification After Deploy

After each deploy, run automated verification before marking the deploy complete:

\`\`\`bash
#!/bin/bash
# post-deploy-verify.sh — runs after every helm upgrade

NAMESPACE=$1
SERVICE_URL=$2
MAX_RETRIES=12
SLEEP=10

echo "Verifying deployment to $NAMESPACE..."

# 1. Check all pods are running
kubectl wait --for=condition=ready pod -l app=myapp -n $NAMESPACE --timeout=120s

# 2. Check no pod restarts (CrashLoopBackOff detection)
RESTARTS=$(kubectl get pods -n $NAMESPACE -l app=myapp -o jsonpath='{.items[*].status.containerStatuses[*].restartCount}')
if [ "$RESTARTS" -gt "0" ]; then
  echo "ERROR: Pods are restarting. Possible CrashLoopBackOff."
  kubectl logs -l app=myapp -n $NAMESPACE --previous
  exit 1
fi

# 3. Smoke test with retry
for i in $(seq 1 $MAX_RETRIES); do
  STATUS=$(curl -sf -o /dev/null -w "%{http_code}" $SERVICE_URL/health 2>/dev/null)
  if [ "$STATUS" = "200" ]; then
    echo "Health check passed after $i attempt(s)"
    break
  fi
  echo "Attempt $i/$MAX_RETRIES: HTTP $STATUS. Retrying in \${SLEEP}s..."
  sleep $SLEEP
  if [ "$i" = "$MAX_RETRIES" ]; then
    echo "ERROR: Service unhealthy after $MAX_RETRIES attempts"
    exit 1
  fi
done

# 4. Check error rate via metrics (if Prometheus available)
ERROR_RATE=$(curl -sf "http://prometheus:9090/api/v1/query?query=rate(http_requests_total{status=~'5..'}[2m])" | jq '.data.result[0].value[1] // "0"')
if (( $(echo "$ERROR_RATE > 0.01" | bc -l) )); then
  echo "ERROR: Error rate $ERROR_RATE > 1% threshold post-deploy"
  exit 1
fi

echo "Deployment verification complete. All checks passed."
\`\`\`

## Rollback Strategy

**Helm rollback (fastest):** \`helm rollback myapp -n production\` — reverts to the previous Helm release in seconds. The old image is still in the registry.

**Argo Rollouts abort (for canary):** \`kubectl argo rollouts abort myapp\` — immediately routes 100% traffic back to the stable version.

**GitOps rollback (Flux/ArgoCD):** Revert the commit that changed the image tag in the GitOps repo. The GitOps controller reconciles and re-deploys the old tag.

**What NOT to do:** Don't redeploy by running the pipeline again from source. This rebuilds the image, which takes time and changes the artifact. Always roll back to the previously known-good artifact.

## Tracking Deployments

\`\`\`bash
# Create a deployment record in your CMDB/change management
curl -X POST https://servicenow.company.com/api/sn_chg_rest/v1/change/emergency \\
  -H "Authorization: Bearer $SN_TOKEN" \\
  -d "{
    'short_description': 'Deploy myapp $IMAGE_TAG to production',
    'description': 'Pipeline $CI_PIPELINE_ID, commit $CI_COMMIT_SHA, deployed by $GITLAB_USER_LOGIN',
    'assignment_group': 'platform-team',
    'start_date': '$(date -u +%Y-%m-%dT%H:%M:%SZ)'
  }"

# Annotate Grafana deployment markers
curl -X POST https://grafana.internal/api/annotations \\
  -H "Authorization: Bearer $GRAFANA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d "{
    'text': 'Deploy: myapp $IMAGE_TAG',
    'tags': ['deploy', 'myapp', 'production'],
    'time': $(date +%s000)
  }"
\`\`\`

These annotations appear as vertical lines on Grafana dashboards, making it immediately obvious when a deploy correlates with a latency spike or error rate increase.`,
          interviewQuestions: [
            {
              question: "Describe a production deployment pipeline for a containerized microservice end to end.",
              answer: "1) Developer merges feature branch to main. 2) Pipeline builds Docker image tagged with git SHA, pushes to ECR. 3) Trivy scans the image for critical CVEs — fails pipeline if found. 4) Image is signed with cosign. 5) Helm deploys the image to dev namespace, smoke tests verify the health endpoint. 6) On success, same image tag deploys to staging. Integration tests and E2E tests run. 7) A human reviews staging results and approves production deploy. 8) Canary deploys at 5% traffic via Argo Rollouts. Error rate and latency are monitored for 10 minutes. 9) If metrics are healthy, rollout promotes to 100%. If not, automatic rollback. 10) Post-deploy verification script confirms pod health. Grafana deployment annotation is created for correlation with metrics.",
              difficulty: "mid" as const,
            },
            {
              question: "Production has an outage caused by the latest deploy. What are your rollback options and which do you choose first?",
              answer: "Fastest option first: 1) Helm rollback: 'helm rollback myapp -n production' reverts to the previous release in ~30 seconds. The previous image is already in the registry, no rebuild needed. Use this first. 2) If using Argo Rollouts canary: 'kubectl argo rollouts abort myapp' immediately routes all traffic back to stable. 3) GitOps (if using Flux/ArgoCD): revert the commit in the GitOps repo that updated the image tag — the controller reconciles and redeploys the previous tag within 60 seconds. Never wait for a full pipeline rerun during an outage — that rebuilds the image (takes 5+ minutes) and is unnecessary. While rolling back, annotate the Grafana dashboard and open an incident. Root-cause the issue before re-deploying.",
              difficulty: "senior" as const,
            },
          ],
        },
      ],
    },
    {
      id: "monitoring-observability",
      title: "Monitoring & Observability",
      level: "intermediate",
      description: "Build comprehensive observability with Prometheus, Grafana, and OpenSearch.",
      lessons: [
        {
          id: "prometheus-fundamentals",
          title: "Prometheus — Metrics & Alerting",
          duration: 25,
          type: "lesson",
          description: "Collect, store, and query metrics with Prometheus and AlertManager.",
          objectives: [
            "Understand Prometheus's pull-based architecture and metric types",
            "Write PromQL queries for application and infrastructure metrics",
            "Configure AlertManager for on-call routing",
            "Expose custom application metrics",
          ],
          content: `# Prometheus — Metrics & Alerting

## Why Prometheus?

Prometheus is the de facto standard for Kubernetes monitoring. Created at SoundCloud, now used by Uber, DigitalOcean, and thousands of companies.

## How It Works: The Prometheus Data Model

Every measurement in Prometheus is a **time series**: a sequence of (timestamp, value) pairs identified by a metric name and a set of labels.

\`\`\`
http_requests_total{method="GET", status="200", endpoint="/api/users"} 42398  @1715766000
http_requests_total{method="POST", status="201", endpoint="/api/users"} 3441   @1715766000
http_requests_total{method="GET", status="500", endpoint="/api/users"} 17      @1715766000
\`\`\`

This design is powerful: labels turn one metric into a multi-dimensional dataset. You can query \`http_requests_total\` to get all traffic, or filter to \`{status="500"}\` to get just errors, or \`{endpoint="/api/payments"}\` to get payment endpoint traffic. Labels are the key to flexible, reusable metrics.

**The cost of labels**: Each unique combination of label values creates a new time series. If you label metrics with user IDs (\`user_id="12345"\`), you create one time series per user — potentially millions. This is "label cardinality explosion" and will overwhelm Prometheus. Labels should be low-cardinality (a handful of values per label). Good: \`status="200"\`, \`method="GET"\`, \`endpoint="/api/users"\`. Bad: \`user_id="12345"\`, \`trace_id="abc-def-123"\`.

## How It Works: Metric Types in Depth

**Counter**: A value that only ever increases (resets to zero on restart). Use for things you count: total requests processed, total errors encountered, total bytes received. The raw counter value is rarely useful — you use \`rate()\` to convert it to "requests per second over the last 5 minutes."

\`\`\`promql
# Wrong: raw counter just grows, hard to reason about
http_requests_total{status="500"}

# Correct: rate of errors per second over last 5 minutes
rate(http_requests_total{status="500"}[5m])
\`\`\`

**Gauge**: A value that can go up or down. Use for current state: memory usage, number of active connections, queue depth, CPU temperature. Use gauges directly — no \`rate()\` needed.

**Histogram**: Records the distribution of observed values in configurable buckets. Essential for latency metrics because averages are misleading (one 10-second request averages with 999 10-millisecond requests to give an "average" of 19ms, which looks fine while users are experiencing terrible latency). Histograms enable percentile queries: "what is the latency that 95% of requests fall below?"

\`\`\`promql
# 95th percentile latency (P95) — what most users experience
histogram_quantile(0.95,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, endpoint)
)
\`\`\`

**Summary**: Similar to Histogram but calculates quantiles on the client side (in the application). Pre-calculated percentiles cannot be aggregated across multiple instances — Histogram with \`histogram_quantile()\` is almost always preferred.

## How It Works: PromQL Key Functions

PromQL's power comes from a small set of powerful functions:

**\`rate()\`**: Calculates the per-second average rate of increase of a counter over a time range. The time range (\`[5m]\`) is a rolling window. \`rate()\` handles counter resets automatically (when a process restarts and the counter resets to 0).

**\`irate()\`**: Like \`rate()\` but uses only the last two data points — more responsive to spikes but noisier. Use for alerting where you want fast spike detection; use \`rate()\` for dashboards where you want smooth trends.

**\`histogram_quantile(φ, metric)\`**: Calculates the φ-quantile (e.g., 0.95 for P95) from histogram buckets. The \`le\` label (less than or equal) defines the bucket boundaries. This is the correct way to measure latency percentiles across distributed systems.

**\`topk(n, metric)\`**: Returns the n highest-value time series. Useful for "show me the 5 pods consuming the most memory."

**\`label_replace()\`**: Rewrites labels on time series. Useful when metric labels don't match dashboard expectations.

**Recording rules**: Some PromQL queries are expensive and shouldn't be executed on every dashboard refresh. Recording rules pre-compute the result and store it as a new metric:

\`\`\`yaml
groups:
  - name: recording_rules
    rules:
    - record: job:http_requests:rate5m
      expr: sum(rate(http_requests_total[5m])) by (job)
    - record: job:http_error_rate:rate5m
      expr: >
        sum(rate(http_requests_total{status=~"5.."}[5m])) by (job)
        / sum(rate(http_requests_total[5m])) by (job)
\`\`\`

The dashboard queries \`job:http_error_rate:rate5m\` (a simple label lookup) instead of recalculating the full expression every 15 seconds.

## How It Works: AlertManager Routing, Inhibition, and Silences

AlertManager receives firing alerts from Prometheus and handles routing, grouping, deduplication, inhibition, and delivery.

**Routing tree**: A hierarchical route configuration that matches alerts to receivers based on label values. An alert with \`severity=critical\` AND \`team=payments\` routes to the payments PagerDuty integration. The same alert without \`team=payments\` falls through to the default receiver (Slack).

**Grouping**: Multiple alerts with the same \`alertname\` and \`cluster\` labels are grouped into a single notification with a configurable \`group_wait\` delay. This prevents "alert storms" where 50 individual pod alerts become 50 separate pages.

**Inhibition**: One alert can inhibit (suppress) another. If a \`ClusterDown\` alert is firing, \`PodNotRunning\` alerts from that cluster are inhibited — they're symptoms, not root causes. Without inhibition, a single cluster outage generates hundreds of page notifications.

**Silences**: Time-bounded muting of alerts. When you're deploying a known noisy change, create a silence for 30 minutes rather than turning off alerting entirely.

**Key design:**
- **Pull model**: Prometheus scrapes \`/metrics\` endpoints on a schedule. No agents to install — targets just expose an HTTP endpoint.
- **Time series database**: Stores \`metric_name{labels} value timestamp\`
- **PromQL**: Powerful query language for rates, aggregations, and percentiles
- **AlertManager**: Handles alert routing, deduplication, and silencing

## Architecture

\`\`\`
Prometheus (scrapes every 15s)
    │
    ├── /metrics on app pods  (custom app metrics)
    ├── node-exporter          (CPU, memory, disk)
    ├── kube-state-metrics     (pod counts, deployment status)
    └── postgres-exporter      (DB metrics)
    │
    ├── TSDB (local storage, 30d retention)
    ├── Grafana (dashboards)
    └── AlertManager (PagerDuty, Slack)
\`\`\`

## Metric Types

\`\`\`
Counter:   only goes up (total requests, total errors)
           http_requests_total{method="GET",status="200"} 42398
           → use rate() to get per-second rate

Gauge:     goes up or down (memory, active connections, queue depth)
           node_memory_MemAvailable_bytes 4294967296
           → use directly

Histogram: samples latency distribution, enables percentile queries
           http_request_duration_seconds_bucket{le="0.1"} 240
           → use histogram_quantile()
\`\`\`

## Exposing Metrics in Your App

\`\`\`python
from prometheus_client import Counter, Histogram, generate_latest
import time

REQUEST_COUNT = Counter('http_requests_total', 'Total requests',
                        ['method', 'endpoint', 'status'])
REQUEST_LATENCY = Histogram('http_request_duration_seconds', 'Latency',
                            ['endpoint'])

@app.route('/api/payments', methods=['POST'])
def process_payment():
    start = time.time()
    try:
        result = payment_service.process(request.json)
        REQUEST_COUNT.labels('POST', '/api/payments', '200').inc()
        return jsonify(result)
    except Exception:
        REQUEST_COUNT.labels('POST', '/api/payments', '500').inc()
        raise
    finally:
        REQUEST_LATENCY.labels('/api/payments').observe(time.time() - start)

@app.route('/metrics')
def metrics():
    return generate_latest()
\`\`\`

\`\`\`yaml
# Tell Prometheus to scrape your pod
metadata:
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
    prometheus.io/path: "/metrics"
\`\`\`

## Essential PromQL Queries

\`\`\`promql
# Error rate (errors per second)
rate(http_requests_total{status=~"5.."}[5m])

# Error ratio (% of requests failing)
sum(rate(http_requests_total{status=~"5.."}[5m]))
/ sum(rate(http_requests_total[5m]))

# 95th percentile latency by endpoint
histogram_quantile(0.95,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, endpoint)
)

# CPU usage rate by pod
rate(container_cpu_usage_seconds_total{namespace="production"}[5m])

# Memory usage vs limit (saturation)
container_memory_working_set_bytes
/ container_spec_memory_limit_bytes

# Node disk > 85% full
(node_filesystem_size_bytes - node_filesystem_avail_bytes)
/ node_filesystem_size_bytes > 0.85

# Pods not running
kube_pod_status_phase{phase!="Running"} > 0
\`\`\`

## AlertManager Configuration

\`\`\`yaml
# prometheus/alerts.yml
groups:
- name: application
  rules:
  - alert: HighErrorRate
    expr: |
      sum(rate(http_requests_total{status=~"5.."}[5m]))
      / sum(rate(http_requests_total[5m])) > 0.05
    for: 5m
    labels:
      severity: critical
      team: backend
    annotations:
      summary: "Error rate {{ \$value | humanizePercentage }}"
      runbook: "https://wiki.mycompany.com/runbooks/high-error-rate"

  - alert: HighLatency
    expr: |
      histogram_quantile(0.95,
        sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
      ) > 2
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "P95 latency {{ \$value }}s exceeds SLO"
\`\`\`

\`\`\`yaml
# alertmanager/config.yml
route:
  group_by: ['alertname', 'team']
  receiver: default
  routes:
  - match:
      severity: critical
      team: backend
    receiver: pagerduty-backend
  - match:
      severity: warning
    receiver: slack-warnings

receivers:
- name: pagerduty-backend
  pagerduty_configs:
  - routing_key: <KEY>
- name: slack-warnings
  slack_configs:
  - api_url: https://hooks.slack.com/services/...
    channel: '#alerts'
\`\`\`
`,
          interviewQuestions: [
            {
              question: "Explain the four golden signals and how you'd alert on them.",
              difficulty: "mid" as const,
              answer: `From the Google SRE book — the four most critical metrics for any service:

**1. Latency** — How long does a request take?
\`\`\`promql
# P99 latency > 500ms for 5 minutes → alert
histogram_quantile(0.99,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
) > 0.5
\`\`\`

**2. Traffic** — How much demand hits the system?
\`\`\`promql
sum(rate(http_requests_total[5m])) by (service)
\`\`\`
Baseline matters: 100 RPS might be normal or a 10x spike.

**3. Errors** — What rate of requests fail?
\`\`\`promql
sum(rate(http_requests_total{status=~"5.."}[5m]))
/ sum(rate(http_requests_total[5m])) > 0.01
\`\`\`

**4. Saturation** — How full is the service?
\`\`\`promql
container_memory_working_set_bytes
/ container_spec_memory_limit_bytes > 0.85
\`\`\`

**Alert severity:**
- Error rate > 0.1% → warning (Slack)
- Error rate > 1% → critical (page on-call)
- P99 latency > 500ms → warning
- P99 latency > 2s → critical (SLO breach)`,
            },
            {
              question: "What's the difference between a counter and a gauge?",
              difficulty: "junior" as const,
              answer: `**Counter**: Only goes up (resets to 0 on restart). Use for things you count: total requests, total errors, total bytes sent.
\`\`\`promql
# Wrong — raw value is useless (just grows forever)
http_requests_total

# Right — rate() gives per-second rate over 5 minutes
rate(http_requests_total[5m])
\`\`\`

**Gauge**: Can go up or down. Use for current state: memory usage, active connections, queue depth, CPU temperature.
\`\`\`promql
# Gauge — use directly (no rate needed)
node_memory_MemAvailable_bytes
redis_connected_clients
\`\`\`

**Common mistake**: Using a gauge for request counts (resetting each interval). If a scrape is missed, data is lost. Counters are resilient — you calculate rate from the cumulative total.

**Histogram**: Tracks distribution of values (latencies). Required for percentile calculations. Always prefer histogram over average for latency — averages hide tail behavior.`,
            },
          ],
        },
        {
          id: "grafana-dashboards",
          title: "Grafana — Dashboards & Visualization",
          duration: 20,
          type: "lesson",
          description: "Build production dashboards, SLO tracking, and Grafana as code.",
          objectives: [
            "Connect Grafana to Prometheus and other data sources",
            "Build dashboards with panels, variables, and alerts",
            "Implement Grafana as code with provisioning",
            "Create SLO dashboards with error budget tracking",
          ],
          content: `# Grafana — Dashboards & Visualization

## How It Works: Grafana's Data Source Architecture

Grafana is a visualization layer, not a data store. It connects to data sources (Prometheus, Loki, OpenSearch, CloudWatch, PostgreSQL, InfluxDB, and 50+ others) via a plugin system. Each data source plugin knows how to query that system and return results in Grafana's internal data format.

This plugin architecture matters because it enables a single dashboard to display metrics from Prometheus, logs from Loki, and business KPIs from a PostgreSQL database — all side by side. The unified UI eliminates context switching between monitoring tools during incident response.

## How It Works: Panel Types and When to Use Each

Grafana's panel types are optimized for different data shapes and use cases:

**Time Series (Graph)**: The default for metrics over time. Use for request rate, CPU usage, error rate — anything that changes continuously over time. Supports multiple time series on one chart, threshold bands, and annotations (deployment markers).

**Stat**: Displays a single current value with optional color-coded thresholds. Perfect for "current error rate" or "pods running" on an executive dashboard. The value is instantly readable at a glance.

**Gauge**: A circular gauge showing a value relative to a minimum and maximum. Best for "disk usage: 78%" or "CPU: 45%" — values with meaningful bounds.

**Bar Gauge**: A horizontal or vertical bar showing multiple values for comparison. Use for "requests per endpoint" or "memory by pod."

**Table**: Tabular data for comparison across multiple dimensions. Best for "show me all pods with their CPU, memory, and restart count" or a list of recent incidents.

**Heatmap**: Shows the distribution of values over time. Essential for latency histograms — the heatmap reveals that most requests are fast (dark band at low latency) but some are very slow (bright dots at high latency), which a line chart average would obscure.

**Logs**: Displays log lines from Loki or OpenSearch. Use for contextual log exploration directly in a dashboard without switching tools.

## How It Works: Template Variables for Dynamic Dashboards

A static dashboard hardcoded to show \`production\` namespace data is useless for debugging \`staging\`. Template variables make dashboards dynamic — a dropdown at the top lets you select cluster, namespace, pod, or any label value.

\`\`\`yaml
# Variable definition in dashboard JSON
{
  "name": "namespace",
  "type": "query",
  "datasource": "Prometheus",
  "query": "label_values(kube_pod_info, namespace)",
  "refresh": "On time range change"
}
\`\`\`

Once defined, \`$namespace\` appears as a dropdown in the dashboard. Panel queries reference \`$namespace\`:

\`\`\`promql
# Static — only shows production
sum(rate(http_requests_total{namespace="production"}[5m])) by (pod)

# Dynamic with variable — works for any namespace
sum(rate(http_requests_total{namespace="$namespace"}[5m])) by (pod)
\`\`\`

**Chained variables**: A \`$pod\` variable can be filtered by the selected \`$namespace\`:
\`\`\`
query: label_values(kube_pod_info{namespace="$namespace"}, pod)
\`\`\`

The pod dropdown automatically updates when you change the namespace selection.

## How It Works: Grafana vs Prometheus Alerting

Two places to define alerts: Prometheus \`alerting rules\` in YAML, or Grafana's "Unified Alerting."

**Prometheus alerting (recommended for infrastructure/SLO alerts)**: Alerts are defined close to the data, version-controlled as code, and managed in the same place as recording rules. They integrate naturally with AlertManager for routing.

**Grafana Unified Alerting**: Allows alerts from any data source (not just Prometheus), managed through the UI, and supports more complex multi-condition alerts. Good for business metrics from a SQL database that Prometheus doesn't handle.

**Common mistake**: Duplicating alerts in both places, causing double notifications. Pick one system per alert domain.

## How It Works: Provisioning Dashboards as Code

Clicking to create dashboards in the Grafana UI is an anti-pattern for production systems: dashboards can't be reviewed in PRs, can't be rolled back if someone makes a mistake, and differ between environments (staging Grafana vs production Grafana). The correct approach is Grafana's provisioning system.

Grafana reads dashboard JSON files from a configured directory at startup (and can reload them at runtime with the Grafana sidecar pattern). Store dashboard JSON in Git, apply changes via CI/CD, and every Grafana instance gets identical dashboards.

The JSON model is verbose but straightforward — you can export any dashboard via the Grafana API and commit the result. For programmatic generation, **Grafonnet** (a Jsonnet library) provides a typed API for building dashboards as code:

\`\`\`jsonnet
local grafana = import 'grafonnet/grafana.libsonnet';
local dashboard = grafana.dashboard;
local row = grafana.row;
local graphPanel = grafana.graphPanel;
local prometheus = grafana.prometheus;

dashboard.new('Application Overview')
.addPanel(
  graphPanel.new('Request Rate')
  .addTarget(
    prometheus.target(
      'sum(rate(http_requests_total[5m])) by (endpoint)',
      legendFormat='{{endpoint}}'
    )
  ),
  gridPos={h: 8, w: 12, x: 0, y: 0}
)
\`\`\`

## What is Grafana?

Grafana is the visualization layer for your metrics. It connects to Prometheus, Loki, OpenSearch, CloudWatch, and 50+ other sources. Used by Bloomberg, PayPal, and thousands of engineering teams.

## Deploying the Full Stack

\`\`\`bash
# kube-prometheus-stack: Prometheus + Grafana + AlertManager + pre-built K8s dashboards
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  -f monitoring-values.yaml
\`\`\`

\`\`\`yaml
# monitoring-values.yaml
grafana:
  adminPassword: "\${GRAFANA_ADMIN_PASSWORD}"
  persistence:
    enabled: true
    size: 10Gi
  ingress:
    enabled: true
    hosts: [grafana.mycompany.com]
  dashboardProviders:
    dashboardproviders.yaml:
      apiVersion: 1
      providers:
      - name: default
        type: file
        options:
          path: /var/lib/grafana/dashboards/default

prometheus:
  prometheusSpec:
    retention: 30d
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: gp3
          resources:
            requests:
              storage: 100Gi
\`\`\`

## Grafana as Code

Never click to create dashboards — version control them as JSON.

\`\`\`bash
# Export an existing dashboard
curl -s http://admin:password@grafana:3000/api/dashboards/uid/my-dash \
  | jq '.dashboard' > dashboards/app-overview.json
\`\`\`

\`\`\`yaml
# Mount dashboards via ConfigMap (Grafana sidecar picks them up)
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboards
  labels:
    grafana_dashboard: "1"
data:
  app-overview.json: |
    { "title": "Application Overview", "panels": [...] }
\`\`\`

## Key Dashboard Layout

\`\`\`
┌────────────────────────────────────────────────────┐
│           Application Overview                     │
├──────────┬──────────┬──────────┬───────────────────┤
│ RPS      │ P95 Lat  │ Error %  │ Availability      │
│ 1,234/s  │ 142ms    │ 0.02%    │ 99.98%            │
├──────────┴──────────┴──────────┴───────────────────┤
│ Request Rate (time series — last 24h)              │
├──────────────────────────┬─────────────────────────┤
│ Latency Heatmap          │ Error Breakdown by Code  │
│  (shows P50/P95/P99)     │  500: 12  502: 3  504: 1 │
└──────────────────────────┴─────────────────────────┘
\`\`\`

## SLO Dashboard with Error Budget

\`\`\`
SLO: 99.9% availability over 30 days
Error budget: 0.1% of requests allowed to fail
= ~43.8 minutes of downtime per month allowed
\`\`\`

\`\`\`promql
# Error budget remaining (as % of budget)
(
  1 - (
    sum(increase(http_requests_total{status=~"5.."}[30d]))
    / sum(increase(http_requests_total[30d]))
  ) / 0.001   -- divide by 0.1% budget
) * 100

# Burn rate (how fast are we consuming the budget?)
# > 1.0 = consuming faster than 30-day budget allows
sum(rate(http_requests_total{status=~"5.."}[1h]))
/ sum(rate(http_requests_total[1h]))
/ (0.001 / (30 * 24))
\`\`\`

**Dashboard thresholds:**
- Budget > 50%: green (healthy)
- Budget 25-50%: yellow (caution — slow down feature work)
- Budget < 25%: red (freeze features, focus on reliability)

**Burn rate alerts (Google SRE Workbook):**
- Burn rate > 14.4x for 1h → page immediately (budget exhausted in 2 days)
- Burn rate > 6x for 6h → page soon (exhausted in 5 days)
- Burn rate > 3x for 3 days → ticket (trending bad, investigate)
`,
          interviewQuestions: [
            {
              question: "How do you implement an SLO and error budget in practice?",
              difficulty: "senior" as const,
              answer: `**Step 1: Define the SLO**
\`\`\`
SLO: 99.9% of HTTP requests return non-5xx status over a rolling 30-day window
Error budget: 0.1% = 43.8 minutes equivalent of 100% error rate
\`\`\`

**Step 2: Implement the measurement** (PromQL in Grafana)
\`\`\`promql
# Current availability
(
  sum(increase(http_requests_total{status!~"5.."}[30d]))
  / sum(increase(http_requests_total[30d]))
) * 100

# Budget remaining
( 1 - actual_error_rate / 0.001 ) * 100
\`\`\`

**Step 3: Alert on burn rate, not just threshold**
Alerting when budget drops below 50% is too late — you need to know burn rate:
\`\`\`promql
# 1-hour burn rate > 14.4 means budget exhausts in 2 days
sum(rate(http_requests_total{status=~"5.."}[1h]))
/ sum(rate(http_requests_total[1h]))
/ 0.001 > 14.4
\`\`\`

**Step 4: Use budget for decision making**
- Budget > 50%: proceed with feature releases
- Budget 25-50%: engineering manager aware, reduce release cadence
- Budget < 25%: freeze non-critical features, reliability work only
- Budget exhausted: all hands on reliability, no features until next month

**Step 5: Review in weekly reliability meeting**
Look at burn rate trend, planned releases, and adjust accordingly. This is how Google, Spotify, and most mature SRE teams operate.`,
            },
          ],
        },
        {
          id: "opensearch-logging",
          title: "OpenSearch & Centralized Logging",
          duration: 22,
          type: "lesson",
          description: "Aggregate, search, and analyze logs at scale with OpenSearch and Fluent Bit.",
          objectives: [
            "Understand the OpenSearch/ELK stack architecture",
            "Deploy Fluent Bit for Kubernetes log collection",
            "Write OpenSearch queries for log analysis",
            "Implement log-based alerting and index lifecycle management",
          ],
          content: `# OpenSearch & Centralized Logging

## Why Centralized Logging?

In a Kubernetes cluster with 100 pods across 10 nodes, logs are scattered everywhere. When a user reports a bug at 14:32:15, you need to correlate logs across frontend → API → database → queue processor in different pods that may have already restarted.

**Without centralized logging**: SSH to each node, grep through files, logs lost on pod restart.

**With OpenSearch**: All logs searchable from one UI, preserved after pod deletion, full-text search, log-based alerts, anomaly detection.

## Architecture: Fluent Bit → OpenSearch → Dashboards

\`\`\`
┌─────────────────────────────────────────────┐
│              Kubernetes Nodes               │
│                                             │
│  Containers → /var/log/containers/*.log     │
│                    ↓                        │
│  ┌─────────────────────────────────────┐    │
│  │  Fluent Bit (DaemonSet — one/node)  │    │
│  │  • parses container logs            │    │
│  │  • adds K8s metadata (pod/ns/label) │    │
│  │  • forwards to OpenSearch           │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────┐
│           OpenSearch Cluster                │
│  Data Nodes (storage) + Dashboards (UI)    │
└─────────────────────────────────────────────┘
\`\`\`

## Deploying Fluent Bit

\`\`\`bash
helm repo add fluent https://fluent.github.io/helm-charts
helm upgrade --install fluent-bit fluent/fluent-bit \
  --namespace logging \
  -f fluent-bit-values.yaml
\`\`\`

\`\`\`yaml
# fluent-bit-values.yaml
config:
  inputs: |
    [INPUT]
        Name              tail
        Path              /var/log/containers/*.log
        multiline.parser  docker, cri
        Tag               kube.*
        Mem_Buf_Limit     50MB

  filters: |
    [FILTER]
        Name                kubernetes
        Match               kube.*
        Merge_Log           On       # parse JSON logs into fields
        K8S-Logging.Parser  On
        Annotations         Off

  outputs: |
    [OUTPUT]
        Name            opensearch
        Match           kube.*
        Host            opensearch.logging.svc.cluster.local
        Port            9200
        Index           kubernetes-logs
        Logstash_Format On
        Logstash_Prefix kubernetes-logs
        Retry_Limit     5
\`\`\`

## Structured Logging Best Practice

\`\`\`python
# Bad: unstructured — only full-text searchable
print(f"Payment failed for user {user_id}")

# Good: structured JSON — every field is indexed and queryable
import structlog

log = structlog.get_logger()
log.error("payment_failed",
    user_id=user_id,
    amount=amount,
    currency="USD",
    error_code="GATEWAY_TIMEOUT",
    trace_id=request.headers.get("X-Trace-ID"),
    duration_ms=elapsed_ms,
)
# In OpenSearch: filter on error_code="GATEWAY_TIMEOUT" in < 1 second
# With unstructured logs: grep through gigabytes of text
\`\`\`

## OpenSearch Queries

\`\`\`json
{
  "query": {
    "bool": {
      "must": [
        { "term": { "kubernetes.labels.app": "payments-api" }},
        { "term": { "error_code": "GATEWAY_TIMEOUT" }},
        { "range": { "@timestamp": { "gte": "now-1h" }}}
      ]
    }
  },
  "sort": [{ "@timestamp": "desc" }]
}
\`\`\`

\`\`\`json
{
  "aggs": {
    "errors_by_code": {
      "terms": { "field": "error_code.keyword", "size": 10 }
    },
    "errors_over_time": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "5m"
      }
    }
  }
}
\`\`\`

## Index Lifecycle Management

\`\`\`json
{
  "policy": {
    "states": [
      {
        "name": "hot",
        "actions": [{ "rollover": { "min_size": "10gb", "min_index_age": "1d" }}],
        "transitions": [{ "state_name": "warm", "conditions": { "min_index_age": "7d" }}]
      },
      {
        "name": "warm",
        "actions": [{ "force_merge": { "max_num_segments": 1 }}],
        "transitions": [{ "state_name": "delete", "conditions": { "min_index_age": "30d" }}]
      },
      {
        "name": "delete",
        "actions": [{ "delete": {} }]
      }
    ]
  }
}
\`\`\`
`,
          interviewQuestions: [
            {
              question: "What's the difference between metrics and logs, and when do you use each?",
              difficulty: "junior" as const,
              answer: `**Metrics** (Prometheus/Grafana): Numeric measurements over time.
- Low storage cost (just numbers + timestamps)
- Great for: dashboards, alerting, SLOs, trends
- Bad for: understanding WHY something went wrong
- Examples: request count, P99 latency, CPU %, error rate

**Logs** (OpenSearch/Loki): Timestamped text/JSON records of events.
- Higher storage cost (full text)
- Great for: debugging specific incidents, audit trails, root cause analysis
- Bad for: aggregation and alerting at scale (expensive)
- Examples: "Payment failed for user 12345, error: gateway timeout, trace: abc123"

**Traces** (Jaeger/Tempo/X-Ray): Record of a request's journey through multiple services.
- Shows exactly where time was spent across service hops
- Great for: latency debugging in microservices
- Examples: request → API (5ms) → database (200ms ← bottleneck) → cache (1ms)

**The practical workflow**: Metrics alert fires (WHAT is wrong) → check logs for context (WHY it happened) → if latency issue, check traces (WHERE the bottleneck is). They complement each other — you need all three for full observability.`,
            },
            {
              question: "How would you debug a production incident using centralized logging?",
              difficulty: "mid" as const,
              answer: `**Scenario**: Payment service error rate spiked at 14:32, already resolved at 14:55.

**Step 1: Find the error window**
\`\`\`
OpenSearch → Discover
Index: kubernetes-logs-*
Time: 14:25 → 15:00
Filter: kubernetes.labels.app = payments-api
Filter: level = error
\`\`\`

**Step 2: Identify the pattern**
Sort by timestamp, look for the first error. Common patterns:
- All errors have same message → single root cause
- Errors distributed across different messages → multiple causes

**Step 3: Use aggregations**
\`\`\`json
{
  "aggs": {
    "by_error": {
      "terms": { "field": "error_message.keyword" }
    }
  }
}
\`\`\`
Result: 97% of errors are "connection refused: postgres:5432" → database issue.

**Step 4: Correlate with infrastructure metrics**
Switch to Grafana: check postgres metrics at 14:32.
Result: postgres CPU at 100%, connection pool exhausted.

**Step 5: Find the trigger**
Check deployment events in logs:
\`\`\`
Filter: event = deployment, time: 14:25-14:35
Result: v2.1.3 deployed at 14:32 (with 3 extra DB queries per request)
\`\`\`

**Outcome**: Trace from alert → logs → metrics → deployment event in under 10 minutes. Without centralized logging this would take hours of SSH + grep.`,
            },
          ],
        },
      ],
    },
    {
      id: "devops-release-engineering",
      title: "Release Engineering & Feature Flags",
      level: "advanced",
      description: "Implement advanced release patterns, feature flags, DORA metrics, and DevOps culture.",
      lessons: [
        {
          id: "feature-flags",
          title: "Feature Flags & Progressive Delivery",
          duration: 16,
          type: "lesson",
          description: "Decouple deployment from release using feature flags and progressive rollouts.",
          objectives: [
            "Understand the deployment vs release distinction",
            "Implement feature flags for progressive rollouts",
            "Use kill switches for instant rollback without redeployment",
            "Apply percentage-based canary releases via flags",
          ],
          content: `# Feature Flags & Progressive Delivery

## Deployment ≠ Release

**Deployment**: The code is running in production.
**Release**: The feature is visible to users.

Feature flags decouple these. You can deploy to production at any time but only release to specific users, groups, or percentages.

\`\`\`
Traditional:
  Code → CI → Production → Everyone sees it (risky, hard to roll back)

With feature flags:
  Code → CI → Production (dark launch, no users see it) →
  1% of users → 10% → 50% → 100% (gradual rollout with monitoring)
  OR: instant rollback by flipping the flag to 0%
\`\`\`

**Companies:** Facebook deploys to 2 billion users behind feature flags. GitHub deploys to 100% of employees first, then gradually to users. Netflix uses flags as kill switches for every major feature.

## Implementing Feature Flags

\`\`\`python
# Using OpenFeature (vendor-neutral SDK — works with LaunchDarkly, flagd, Unleash)
from openfeature import api
from openfeature.provider.flagd import FlagdProvider

api.set_provider(FlagdProvider(host="flagd", port=8013))
client = api.get_client()

@app.route('/api/checkout', methods=['POST'])
def checkout():
    use_new_flow = client.get_boolean_value(
        flag_key="new-checkout-flow",
        default_value=False,
        evaluation_context={"user_id": current_user.id}
    )
    if use_new_flow:
        return new_checkout_service.process(request.json)
    return legacy_checkout_service.process(request.json)
\`\`\`

\`\`\`yaml
# flagd flag definition — percentage rollout
flags:
  new-checkout-flow:
    state: ENABLED
    variants:
      "on": true
      "off": false
    defaultVariant: "off"
    targeting:
      if:
        - fractional:
            - "\$ud#user_id"    # stable: same user always gets same variant
            - ["on", 10]        # 10% of users
            - ["off", 90]       # 90% remain on old flow
\`\`\`

## Kill Switch Pattern

\`\`\`python
payment_v2_enabled = flags.get_boolean("payment-v2", default=False)

if payment_v2_enabled:
    result = payment_v2.process(order)
else:
    result = payment_v1.process(order)   # battle-tested fallback

# If payment_v2 starts failing in production:
# → Open flagd/LaunchDarkly → set payment-v2 = false
# → ALL traffic instantly returns to payment_v1
# → No deployment, no rollback pipeline, < 1 second
\`\`\`

**Compare to traditional rollback:**
- Feature flag rollback: < 1 second, anyone can do it, no pipeline risk
- Deployment rollback: 15-30 minutes, pipeline must succeed, risk of further issues

## Gradual Rollout with Monitoring

\`\`\`bash
# Week 1: 1% rollout
flagd: new-checkout-flow → ["on", 1]
# Monitor: error rate, conversion rate, latency

# Week 2: 10% (if metrics are healthy)
flagd: new-checkout-flow → ["on", 10]
# Monitor for 2 days

# Week 3: 50%
# Week 4: 100%
# Week 5: Remove the flag (cleanup!)
\`\`\`

Flag cleanup is important — too many flags make code unreadable. Schedule removal as part of the feature work (usually 2-4 weeks after 100% rollout).
`,
          interviewQuestions: [
            {
              question: "How do you roll back a feature at 100% without a code deployment?",
              difficulty: "mid" as const,
              answer: `With feature flags: instant rollback without redeployment.

**With feature flags:**
1. Open your flag management system (LaunchDarkly, flagd, Unleash)
2. Find the \`new-feature\` flag
3. Set percentage: 100% → 0%
4. Live within seconds (next flag evaluation in each SDK instance)
5. Zero deployment, zero downtime, zero pipeline risk

**Traditional rollback (without flags):**
1. Create revert commit
2. CI pipeline runs (5-15 minutes)
3. Deploy to production (rolling update, another 5-10 minutes)
4. Total: 15-30 minutes of continued customer impact

**Why flags win for rollback:**
- Instant (sub-second propagation to all instances)
- No pipeline that can fail
- Partial rollback possible (100% → 50% → 0%)
- Ops/support team can do it, not just engineers
- Can target specific users (roll back for affected customers only)

**Best practice**: Every major feature gets a flag at launch. The flag is removed (code cleaned up) 2-4 weeks after stable 100% rollout. Flag debt (too many old flags) makes code hard to reason about.`,
            },
          ],
        },
        {
          id: "dora-metrics",
          title: "DORA Metrics & DevOps Culture",
          duration: 15,
          type: "lesson",
          description: "Measure DevOps performance with DORA metrics and build high-performing team practices.",
          objectives: [
            "Understand and measure the four DORA metrics",
            "Identify elite vs low-performing DevOps teams",
            "Implement practices that improve deployment frequency and MTTR",
            "Build blameless postmortem culture",
          ],
          content: `# DORA Metrics & DevOps Culture

## How It Works: The Science Behind DORA

The DORA research program (now part of Google Cloud) has conducted annual surveys since 2014, analyzing data from over 33,000 professionals across thousands of organizations. What makes DORA unusual is that it's not anecdotal — it's predictive. The four metrics don't just describe high-performing teams; they *predict* organizational outcomes including profitability, market share, and employee burnout.

The research consistently shows that high performers achieve both high speed (deployment frequency, lead time) AND high stability (change failure rate, MTTR) simultaneously. This disproves the intuition that you must choose between moving fast and being stable. The enabling factor for both is automation: teams with extensive automated testing and deployment automation are faster AND more stable than teams relying on manual processes.

## How It Works: Measuring Each Metric

Understanding how to *measure* DORA metrics is as important as understanding what they are:

**Deployment Frequency**: Measured as deploys to production per day/week. Data source: your deployment system (CI/CD logs, release tags in Git). In practice, count successful production deployments over a 90-day rolling window and divide by days. A "deployment" counts only if it reaches production — staging deploys don't count.

**Lead Time for Changes**: Measured as the median time from "code committed" to "code running in production." Data source: Git commit timestamp + deployment timestamp. Most teams calculate this per-PR: time from PR creation (or first commit on the branch) to deployment of the merge commit. The median is more meaningful than the mean — a few large features with long lead times shouldn't skew the whole picture.

**Time to Restore Service (MTTR)**: Measured as the median time from "incident detected" (alert fired) to "incident resolved" (alert closed). Data source: incident management system (PagerDuty, OpsGenie). Only count production incidents caused by deployments or code, not infrastructure failures outside your team's control.

**Change Failure Rate**: Measured as the percentage of deployments that cause an incident requiring hotfix, rollback, or emergency change. Data source: cross-reference your deployment log with your incident log. If a deployment happened within 1 hour before an incident, attribute the incident to that deployment. Adjust for false attributions by reviewing with the team.

## The Four Performance Tiers

The research identified four performance tiers. What separates Elite from Low performers is not a small incremental difference — it's an order-of-magnitude difference in most metrics:

- **Elite** (e.g., Netflix, Amazon): Deploy multiple times per day, lead time under one hour, MTTR under one hour, change failure rate under 5%.
- **High**: Deploy daily to weekly, lead time one day to one week, MTTR under one day, CFR 5-10%.
- **Medium**: Deploy weekly to monthly, lead time one to four weeks, MTTR under one week, CFR 10-15%.
- **Low**: Deploy monthly or less, lead time over one month, MTTR over one week, CFR over 15%.

The gap between Elite and Low is not about the tools (though tools matter) — it's about practices: trunk-based development, comprehensive test automation, deployments that are small and frequent, feature flags for decoupling release from deployment, and blameless postmortem culture.

## How It Works: Psychological Safety and Blameless Postmortems

The DORA research consistently identifies "psychological safety" as a predictor of software delivery performance. Teams where members feel safe to speak up about problems, admit mistakes, and propose changes perform better — not just culturally, but measurably in DORA metrics.

**Why this matters for security**: In a blame culture, developers who accidentally expose a vulnerability hide it or quietly fix it without disclosure. This prevents organizational learning and means the same vulnerability pattern appears in multiple places. In a blameless culture, developers disclose vulnerabilities early, the team learns, and the organization systematically improves.

**Blameless postmortem principles**:
1. People do not cause incidents — inadequate systems, processes, and tooling do.
2. Given the information available at the time, every person made reasonable decisions.
3. The goal of a postmortem is to understand the system failure, not to find a scapegoat.
4. Action items should improve systems (better alerting, automated safeguards, clearer runbooks) — not punish individuals.

Google's Site Reliability Engineering book popularized this approach. After an incident, SRE teams publish detailed postmortems (often publicly) explaining exactly what happened, what decisions were made and why, and what system improvements will prevent recurrence. The public postmortem format builds trust with customers and demonstrates organizational maturity.

## The Four DORA Metrics

DORA (DevOps Research and Assessment) identified four metrics that predict software delivery performance across 33,000+ professionals.

\`\`\`
         SPEED                    STABILITY
┌────────────────────┐  ┌───────────────────────┐
│ Deployment         │  │ Change Failure Rate    │
│ Frequency          │  │ % of deploys causing   │
│ How often to prod? │  │ incidents              │
└────────────────────┘  └───────────────────────┘
┌────────────────────┐  ┌───────────────────────┐
│ Lead Time          │  │ MTTR                  │
│ Commit → Production│  │ Mean Time to Recovery  │
│ how long?          │  │ How fast you recover   │
└────────────────────┘  └───────────────────────┘
\`\`\`

## Performance Tiers

| Metric | Elite | High | Medium | Low |
|--------|-------|------|--------|-----|
| Deploy Frequency | Multiple/day | Daily-weekly | Weekly-monthly | Monthly+ |
| Lead Time | < 1 hour | 1 day - 1 week | 1-4 weeks | > 1 month |
| Change Failure Rate | 0-5% | 5-10% | 10-15% | > 15% |
| MTTR | < 1 hour | < 1 day | < 1 week | > 1 week |

**Elite performers** (Amazon, Netflix, Google) deploy multiple times per day with < 5% change failure rate and recover from incidents in under an hour. **Low performers** deploy monthly and take weeks to recover.

## Improving Each Metric

**Deployment Frequency:**
- Smaller PRs (< 200 lines → easier to review → faster to merge)
- Trunk-based development (no long-lived feature branches)
- Feature flags (deploy dark, release separately)
- Automate CI/CD (remove manual steps)

**Lead Time:**
- Faster CI pipelines (parallelize, cache)
- Reduce PR review time (pair programming, async review culture)
- Remove manual QA gates (replace with automated tests)

**Change Failure Rate:**
- Higher test coverage + integration tests
- Progressive delivery (canary → gradual rollout)
- Feature flags (instant rollback if failure rate spikes)
- SAST/SCA/container scanning in CI

**MTTR:**
- Alerting + monitoring (detect faster)
- Runbooks for every alert
- Feature flags (roll back in seconds)
- Chaos engineering (practice recovery before incidents)

## Blameless Postmortem Template

\`\`\`markdown
# Postmortem — 2024-01-15 Payment Outage (23 min, 12k users affected)

## Timeline
14:32 - v2.1.3 deployed to production
14:35 - AlertManager: error rate > 5%
14:36 - On-call paged via PagerDuty
14:42 - Root cause: DB connection pool exhausted
14:55 - Rolled back to v2.1.2, service restored

## Root Cause
New feature added 3 additional DB queries per request.
Connection pool size (50) was insufficient at peak traffic.
Load testing covered only 50% of peak traffic.

## Contributing Factors (5 Whys)
Why did the pool exhaust? → new queries per request
Why wasn't it caught? → load test was understaffed
Why was load test understaffed? → no requirement for 110% peak
Why no requirement? → no postmortem from previous similar incident

## Action Items
- [ ] Alert on pool utilization > 80% (team-infra, 2024-01-19)
- [ ] Require load tests at 110% peak in staging (team-platform, 2024-01-31)
- [ ] Runbook: DB connection exhaustion (team-backend, 2024-01-19)

## What Went Well
- Detection: 3 minutes after deploy
- Rollback: 13 minutes (under 15-min SLO)
- Communication: clear escalation path
\`\`\`

**Key principle**: The system failed, not the person. Ask "Why did the system allow this?" not "Who broke this?" Psychological safety enables honest postmortems which enable real improvement.
`,
          interviewQuestions: [
            {
              question: "Your team deploys once a month and takes 3 days to recover from incidents. How do you improve?",
              difficulty: "senior" as const,
              answer: `This is a "low performer" DORA profile. Practical improvement roadmap:

**Phase 1: Reduce fear of deploying (Month 1-2)**
Root cause of monthly deploys: usually manual QA gates, no automated tests, "big bang" releases.

- Break PRs smaller — one feature at a time, < 200 lines
- Build basic CI: lint + unit tests on every PR
- Deploy to staging automatically on every merge to main
- Target: staging deploys daily within 60 days

**Phase 2: Automate production deployment (Month 2-3)**
- Wrap manual deployment scripts in CI/CD
- Add smoke tests (3-5 critical flows) after every deploy
- Implement feature flags — deploy dark, no risk
- Target: weekly prod deploys, confidence increasing

**Phase 3: Reduce MTTR in parallel**
Current 3-day MTTR means: slow detection (no monitoring) + slow rollback + slow incident process.

- Add Prometheus + Grafana — detect via alert, not user complaints
- Write runbooks for top 5 alerts
- Practice rollback drill until it takes < 5 minutes
- Target: detect in < 5 min, recover in < 30 min

**Phase 4: Daily → multiple deploys**
- Canary deployments (automatic rollback on error spike)
- Remove remaining manual gates
- Make deployment boring — not a big event

**Measure and celebrate progress**: Publish DORA metrics on a team dashboard. Celebrate deployment frequency increasing. When deployment is safe and boring, you can deploy many times a day.`,
            },
          ],
        },
      ],
    },
  ],
};
