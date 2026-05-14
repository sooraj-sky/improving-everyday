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
  ],
};
