import type { Track } from "./types";

export const gitTrack: Track = {
  id: "git",
  title: "Git",
  description: "Master version control from internals to enterprise workflows. Zero to hero.",
  longDescription:
    "Go beyond basic commands. Understand Git object model, the DAG, merge algorithms, rebase internals, and the workflows that power the world's largest engineering teams.",
  icon: "GitBranch",
  color: "#f05033",
  gradient: "track-git-gradient",
  tags: ["version-control", "collaboration", "workflow"],
  modules: [
    {
      id: "intro-to-git",
      title: "Introduction to Git",
      description: "Understand what Git really is under the hood, not just what it does.",
      level: "beginner",
      lessons: [
        {
          id: "what-is-git",
          title: "What Git Really Is — The Object Model",
          description: "Git is a content-addressable filesystem. Understanding this changes everything.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Describe Git's four object types: blob, tree, commit, tag",
            "Explain content-addressable storage and SHA-1 hashing",
            "Navigate the .git directory and understand each component",
            "Explain why Git is a Directed Acyclic Graph (DAG)",
          ],
          content: `## What Git Really Is

Most tutorials teach Git as a list of commands. That leaves you confused when things go wrong because you don't understand what the commands actually do. Let's fix that.

> **Key insight:** Git is a **content-addressable key-value store** with a version control interface built on top. Every piece of data is stored and retrieved by the SHA-1 hash of its content. This single fact explains all of Git's behaviour.

---

## The Four Object Types

Every piece of data Git ever stores is one of exactly four object types:

| Object | What it stores | Analogy |
|---|---|---|
| **blob** | Raw file content (no name, no permissions) | A file without a label |
| **tree** | Directory listing: filenames + modes + SHA refs | A folder structure |
| **commit** | Snapshot metadata: tree + parent(s) + author + message | A labelled snapshot |
| **tag** | Annotated pointer to another object | A post-it on a commit |

### Blobs — Content Without Context

A blob stores ONLY file content. No filename, no permissions. If two files have identical content, Git stores ONE blob and both tree entries point to it.

\`\`\`bash
# See what SHA a file would get
git hash-object README.md
# 8ab686eafeb1f44702738c8b0f24f2567c36da6d

# Git stores it at .git/objects/8a/b686eafeb1f...
# (first 2 chars = directory, remaining 38 = filename)

# Inspect any object
git cat-file -t 8ab686ea   # prints type: "blob"
git cat-file -p 8ab686ea   # prints raw content
\`\`\`

### Trees — Directory Snapshots

\`\`\`bash
git cat-file -p HEAD^{tree}
# 100644 blob a8b3f9... .gitignore
# 100644 blob 3c4def... README.md
# 040000 tree 7e8fab... src/
\`\`\`

Mode: \`100644\` = regular file, \`100755\` = executable, \`120000\` = symlink, \`040000\` = directory (sub-tree).

### Commits — Snapshots with Context

\`\`\`bash
git cat-file -p HEAD
# tree   4b825dc...       <- root tree SHA (full project snapshot)
# parent a1b2c3d4...      <- previous commit SHA (absent on first commit)
# author  Alice Chen <alice@co.com> 1700000000 +0530
# committer Alice Chen <alice@co.com> 1700000000 +0530
#
# feat: add OAuth2 login
\`\`\`

**author** = person who wrote the change. **committer** = person who applied it to the repo. These differ in patch-email workflows and after rebasing.

---

## The Directed Acyclic Graph (DAG)

Commits form a DAG — each commit points to its parent(s). The graph is:
- **Directed**: parent pointers flow backwards in time
- **Acyclic**: circular references are physically impossible (a commit's SHA depends on its parent's SHA — a loop would require knowing a SHA before it exists)

\`\`\`
A <- B <- C <- D  (main)
          ^
          E <- F  (feature)
\`\`\`

Branches are simply **named files** containing a 40-char SHA. Creating a branch writes a 41-byte file — O(1), instant, regardless of repo size.

---

## The .git Directory

\`\`\`
.git/
├── HEAD              <- current branch ("ref: refs/heads/main")
├── config            <- repo-local git config
├── index             <- staging area (binary file)
├── objects/          <- the object store
│   ├── 8a/b686...    <- loose objects (one file per object)
│   └── pack/         <- packed objects (after garbage collection)
├── refs/
│   ├── heads/main    <- contains SHA of main's latest commit
│   ├── remotes/      <- remote-tracking refs
│   └── tags/         <- tag refs
└── logs/HEAD         <- reflog: every HEAD position (your safety net)
\`\`\`

---

## Content Addressing in Practice

Because SHA-1 hashes content, identical content always gets the same hash:

\`\`\`bash
echo "hello" > file1.txt
echo "hello" > file2.txt
git add file1.txt file2.txt
git ls-files -s
# 100644 ce013625030ba8dba906f756967f9e9ca394464a 0 file1.txt
# 100644 ce013625030ba8dba906f756967f9e9ca394464a 0 file2.txt
# One blob stored, referenced twice in the tree
\`\`\`

Git's superpowers from content addressing:
1. **Deduplication** — identical content stored once
2. **Integrity** — any corruption changes the SHA (Git detects this)
3. **Efficient transfers** — only objects the remote lacks are transmitted

> **Tip:** Run \`git cat-file -p HEAD\` and \`git cat-file -p HEAD^{tree}\` right now on any repo. Seeing the raw objects makes everything else in Git click.`,
          interviewQuestions: [
            {
              question: "What happens internally when you run `git commit`? Walk through every step.",
              difficulty: "mid",
              answer: `1. **Compute blobs**: For each file in the staging area, Git checks if a blob with its SHA already exists. If so, it reuses it (deduplication). Otherwise, it writes a new blob object.
2. **Build tree objects**: Git recursively constructs tree objects from the index. Each directory becomes a tree pointing to blobs and sub-trees.
3. **Create the commit object**: Contains the root tree SHA, parent commit SHA(s), author name/email/timestamp, committer name/email/timestamp, and commit message.
4. **Compute the commit SHA**: SHA-1 of all the above. This is why amending a commit produces a new SHA — even changing one character of the message changes the hash.
5. **Update the branch ref**: The current branch file (e.g., .git/refs/heads/main) is overwritten with the new commit SHA.
6. **Write reflog entry**: .git/logs/HEAD records the transition for recovery.

Everything in Git is just reading and writing objects identified by SHA.`,
            },
            {
              question: "Why is circular reference in a Git commit graph physically impossible?",
              difficulty: "mid",
              answer: `A commit's SHA-1 hash is computed from its content, which includes the SHA-1 hash of its parent commit. To create a circular reference where commit B references C and C references B, you would need to know C's SHA before C exists — which requires running the hash function on content that includes C's own SHA. This is a preimage problem: finding x such that SHA1(x) = x is computationally infeasible (would require breaking SHA-1). The acyclic property is mathematically guaranteed by the hash function itself, not enforced by policy.`,
            },
            {
              question: "Two files in a repo have identical content. How many blob objects does Git store? What implications does this have?",
              difficulty: "junior",
              answer: `**One blob.** Content-addressable storage means the blob SHA is derived from file content only (not filename or path). Identical content produces identical SHA, so Git stores the blob once regardless of how many files reference it.

Implications:
- **Efficient storage**: Large codebases with repeated content (config templates, boilerplate) use much less disk than naive systems
- **Copy detection**: When you rename a file, Git sees the same blob in a different tree entry. \`git diff --find-renames\` uses this to report renames instead of delete+add
- **Cross-repo efficiency**: Server-side deduplication becomes possible since objects are content-identified globally`,
            },
            {
              question: "Your colleague says 'Git stores diffs between commits.' How do you correct this?",
              difficulty: "senior",
              answer: `**Incorrect — Git's conceptual model is snapshot-based, not diff-based.**

Each commit points to a complete tree object representing the full repository state. There are no diffs stored in Git's object model. When you run \`git diff\`, Git computes it on-demand by comparing two trees — it's not retrieving a stored diff.

**The confusion:** Git's storage layer (packfiles) uses delta compression for efficiency — similar blobs are stored as deltas to save space. But this is a hidden storage optimization, not the data model. The logical model is always: commit = complete snapshot.

**Why snapshot model matters:** Branching, checkout, and comparing arbitrary commits are all fast O(1) pointer operations. Systems storing diffs must replay history to reconstruct state — exponentially slower as history grows. This is why Git can instantly switch between branches that differ by thousands of files.`,
            },
            {
              question: "What is the difference between `author` and `committer` in a Git commit? When do they differ?",
              difficulty: "mid",
              answer: `**Author**: person who originally wrote the code change.
**Committer**: person who applied it to the repository.

They differ in several scenarios:
1. **Email-patch workflows** (Linux kernel): Linus Torvalds applies contributor patches — he's the committer, the patch writer is the author
2. **\`git cherry-pick\`**: Original author preserved, you become the committer
3. **\`git rebase\`**: Author preserved, committer becomes the rebaser with current timestamp
4. **\`git am\`** (apply mailbox): Same as cherry-pick

This matters for: \`git log --author\` filtering, contribution graphs, and audit trails where you need to distinguish who wrote code from who approved and applied it.`,
            },
          ],
        },
        {
          id: "git-installation",
          title: "Git Configuration & Setup",
          description: "Global config, aliases, SSH keys, GPG signing, and the config hierarchy.",
          type: "lesson",
          duration: 14,
          objectives: [
            "Configure identity, editor, and core settings at the appropriate level",
            "Create powerful aliases that speed up daily work",
            "Set up SSH keys and GPG commit signing",
            "Understand the config file hierarchy and precedence rules",
          ],
          content: `## Config Hierarchy — How Git Merges Settings

Git reads configuration from up to four levels and merges them at runtime, with lower levels overriding higher ones:

\`\`\`
/etc/gitconfig             system   (every user on this machine)   ← lowest priority
~/.gitconfig               global   (your user account only)
.git/config                local    (this repository only)
.git/config.worktree       worktree (this specific worktree — rare) ← highest priority
\`\`\`

This cascade means you can set organisation-wide defaults at the system level, personal preferences globally, and project-specific overrides locally — without ever touching the global file for a one-off change.

### Where Each File Lives and Who Owns It

**System** (\`/etc/gitconfig\` on Linux/macOS, \`C:\\ProgramData\\Git\\config\` on Windows): Written by the OS package manager or your IT team. Sets safe defaults for every developer on a shared machine — e.g., a corporate proxy or a mandatory \`init.defaultBranch\`. You need root/admin to edit it.

**Global** (\`~/.gitconfig\` or \`~/.config/git/config\`): Your personal settings. This is where your name, email, preferred editor, and aliases live. Everything you set with \`--global\` goes here.

**Local** (\`.git/config\` inside the repository): Repository-specific settings. A \`--local\` write goes here and overrides global for this repo only. Version-controlled projects never commit this file because it contains local paths and personal settings.

**Worktree** (\`.git/config.worktree\`): Only relevant when using \`git worktree\`. Allows per-worktree configuration within the same repository — almost never used directly.

\`\`\`bash
# See every setting AND which file it came from:
git config --list --show-origin
# file:/etc/gitconfig         core.autocrlf=input
# file:/Users/alice/.gitconfig  user.name=Alice Chen
# file:.git/config              branch.main.remote=origin

# Check a single key (shows the winning value after cascade):
git config user.email

# Check a key at a specific level:
git config --global user.email
git config --local core.editor

# Edit a config file directly in your editor:
git config --global --edit   # opens ~/.gitconfig
\`\`\`

### The includeIf Directive — Context-Aware Config

A powerful feature most developers don't know: you can conditionally include entire config files based on directory path. This is how you use your personal email for hobby projects and your work email for company repos — without ever thinking about it:

\`\`\`ini
# ~/.gitconfig
[user]
  name = Alice Chen
  email = alice@personal.com

[includeIf "gitdir:~/work/"]
  path = ~/.gitconfig-work       # applied to any repo under ~/work/

[includeIf "gitdir:~/clients/acme/"]
  path = ~/.gitconfig-acme
\`\`\`

\`\`\`ini
# ~/.gitconfig-work
[user]
  email = alice@company.com
  signingkey = WORK_GPG_KEY_ID
[commit]
  gpgSign = true
\`\`\`

Now every repo under \`~/work/\` automatically gets the work identity — zero manual configuration per repo.

---

## Essential Global Configuration

\`\`\`bash
git config --global user.name "Alice Chen"
git config --global user.email "alice@company.com"

# Editor (choose yours)
git config --global core.editor "vim"
# VS Code: "code --wait"  |  Neovim: "nvim"  |  nano: "nano"

# Modern defaults
git config --global init.defaultBranch main
git config --global diff.algorithm histogram    # better diff, finds block moves
git config --global pull.rebase true            # pull with rebase (linear history)
git config --global push.autoSetupRemote true   # auto-set tracking on new branches
git config --global push.default current        # push to same-named remote branch
git config --global commit.verbose true         # show full diff when writing message

# Line endings (commit LF, checkout platform-native)
git config --global core.autocrlf input         # Linux/macOS
# git config --global core.autocrlf true        # Windows (converts to CRLF on checkout)

# Rerere: re-use recorded resolution (remembers how you resolved a conflict)
git config --global rerere.enabled true         # saves hours on long-lived branches
\`\`\`

### Why These Settings Matter

**\`diff.algorithm histogram\`** — Git's default "myers" algorithm works well for code but struggles with moved blocks. Histogram diff produces cleaner output that is easier to read in code review. It is strictly better for source code; there is no downside.

**\`pull.rebase true\`** — When you \`git pull\`, instead of merging the remote branch into your local branch (creating a merge commit), Git rebases your local commits on top of the remote. This keeps history linear and avoids the infamous "Merge branch 'main' of github.com/org/repo" clutter that pollutes logs.

**\`push.autoSetupRemote true\`** — Without this, your first \`git push\` on a new branch fails with a verbose error asking you to specify \`--set-upstream\`. With this set, Git automatically establishes tracking and pushes. Save thousands of keystrokes over a career.

**\`rerere.enabled true\`** — "Reuse Recorded Resolution". When you resolve a merge conflict, Git memorises the resolution. If the same conflict appears again (common during repeated rebases), Git applies the saved resolution automatically. Essential for long-lived feature branches.

---

## Power Aliases

Aliases are shell-shortcut definitions stored in \`~/.gitconfig\`. They save keystrokes and embed best-practice flags so you use them consistently:

\`\`\`bash
git config --global alias.st "status -sb"
# -s: short format  -b: show branch tracking info

git config --global alias.lg "log --oneline --decorate --graph --all"
# --graph: ASCII branch diagram  --all: show all branches not just HEAD

git config --global alias.lp "log -p --follow"
# -p: show patch (full diff)  --follow: track file renames

git config --global alias.br "branch -vv"
# -vv: show tracking branch + ahead/behind counts

git config --global alias.last "log -1 HEAD --stat"
# last commit with file change summary

git config --global alias.undo "reset --soft HEAD~1"
# uncommit but keep changes staged (safe undo)

git config --global alias.amend "commit --amend --no-edit"
# add staged changes to last commit, keep same message

git config --global alias.unstage "reset HEAD --"
# move staged changes back to working directory

git config --global alias.changed "diff --name-only HEAD~1 HEAD"
# files changed in last commit

git config --global alias.fpush "push --force-with-lease"
# safer force push: fails if someone else pushed (unlike --force)

git config --global alias.contributors "shortlog -sn --all"
# count commits per author across all branches
\`\`\`

---

## SSH Key Setup

SSH keys authenticate you to GitHub/GitLab without a password on every push. Ed25519 is the modern standard — shorter key, faster operations, more secure than RSA-4096.

\`\`\`bash
# Generate Ed25519 key (preferred over RSA)
# -t: key type  -C: comment (label for the key)  -f: output file
ssh-keygen -t ed25519 -C "alice@company.com" -f ~/.ssh/id_ed25519_github

# Add to the SSH agent (manages keys in memory for this session)
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_github

# ~/.ssh/config — per-host settings
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  AddKeysToAgent yes          # auto-add to agent on first use

# Copy the PUBLIC key to GitHub Settings -> SSH Keys
cat ~/.ssh/id_ed25519_github.pub
# ssh-ed25519 AAAA... alice@company.com

# Test the connection
ssh -T git@github.com
# Hi alice! You've successfully authenticated, but GitHub does not provide shell access.
\`\`\`

### Why SSH Over HTTPS?

HTTPS requires a personal access token (PAT) stored in a credential manager or re-entered on every push. SSH keys are more ergonomic and just as secure. Once set up, they work silently forever. For CI/CD systems, a **deploy key** (a repo-specific SSH key with read-only or write access) is more granular than a PAT.

---

## GPG Commit Signing — Proving Authorship

Without signing, anyone who knows your email address can impersonate you in a commit (\`git commit --author "Alice Chen <alice@company.com>"\`). GPG signing creates a cryptographic proof that the commit came from whoever holds your private key.

\`\`\`bash
gpg --full-generate-key           # choose RSA 4096

gpg --list-secret-keys --keyid-format=long
# sec rsa4096/3AA5C34371567BD2 2024-01-01 [SC]

git config --global user.signingkey 3AA5C34371567BD2
git config --global commit.gpgSign true    # sign every commit automatically
git config --global tag.gpgSign true       # sign tags too

# Export public key to GitHub Settings -> GPG Keys:
gpg --armor --export 3AA5C34371567BD2 | pbcopy  # macOS
gpg --armor --export 3AA5C34371567BD2 | xclip   # Linux

# Verify: commits show "Verified" badge on GitHub
git log --show-signature -1
\`\`\`

### Common Pitfall: GPG and TTY Issues

On headless CI servers, GPG prompts for a passphrase interactively and hangs. Fix:

\`\`\`bash
# Tell GPG which TTY to use:
export GPG_TTY=$(tty)

# Or use a passphrase-less key for CI:
gpg --batch --passphrase '' --quick-gen-key "CI Bot <ci@company.com>"

# Or use SSH signing instead of GPG (simpler for most teams):
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519_github.pub
\`\`\`

### Production Pattern: Organisation-Wide Signing Policy

GitHub and GitLab support **required commit signing** as a branch protection rule. Combined with \`includeIf\` for automatic per-repo config, you get cryptographically verified commits with zero developer friction:

\`\`\`bash
# 1. Distribute ~/.gitconfig-work via onboarding script
# 2. Enable "Require signed commits" in branch protection
# 3. Developers get the Verified badge automatically
# 4. Unsigned commits are rejected by the branch protection rule
\`\`\`

> **Tip:** Configure \`push.autoSetupRemote true\` — this eliminates the \`git push --set-upstream origin feature/xyz\` ceremony every time you push a new branch. One setting, saves thousands of keystrokes over a career. And use \`includeIf\` with directory-based path conditions to auto-switch identities between personal and work repositories — zero mental overhead.`,
          interviewQuestions: [
            {
              question: "What is the difference between `git config --global` and `git config --local`? Give a real scenario where you'd use --local.",
              difficulty: "junior",
              answer: `**\`--global\`** modifies \`~/.gitconfig\` — applies to all repos on your machine.
**\`--local\`** modifies \`.git/config\` in the current repo only — overrides global for this repo.

**Real scenario:** Your global config has your personal email \`alice@gmail.com\`. You start working on a client project. You run:
\`\`\`
cd client-project
git config --local user.email alice@clientcorp.com
git config --local user.signingkey CLIENT_GPG_KEY_ID
\`\`\`
Now commits in that repo use the client email and key, while all personal repos still use your personal identity. No global change needed.

Other uses: repo-specific merge strategies, different core.autocrlf settings, per-repo hooks directory.`,
            },
            {
              question: "A developer's commits show up as 'unknown' on GitHub with no avatar. What's the cause and fix?",
              difficulty: "junior",
              answer: `GitHub matches commits to user accounts by email address. If \`git config user.email\` doesn't match any email on the developer's GitHub account, the commit appears unattributed.

**Fix:**
1. Check current config: \`git config user.email\`
2. Ensure it matches an email added to GitHub account (Settings -> Emails)
3. Update: \`git config --global user.email correct@email.com\`

**For already-pushed commits:** The commits can't be re-associated without rewriting history. Going forward, new commits will correctly attribute. If attribution matters (open source contributor count, company audit), rewrite with \`git filter-repo --commit-callback\` to update the author email throughout history.

**Prevention:** Add a company-wide git config template that sets the email to \`user@company.com\` via \`init.templateDir\`.`,
            },
          ],
        },
      ],
      exam: [
        { question: "You join a team and your first commit shows up unattributed on GitHub. What do you check and fix?", answer: "Run `git config user.email` to check the configured email. If it doesn't match an email registered on your GitHub account, run `git config --global user.email your@github-email.com`. For the already-pushed commit, re-attribution isn't possible without rewriting history, but future commits will be correctly attributed.", difficulty: "junior" },
        { question: "A teammate claims 'Git saves diffs between versions.' How do you correct them, and what does Git actually store?", answer: "Git stores complete snapshots, not diffs. Each commit points to a full tree object representing the entire repository state at that moment. When you run `git diff`, Git computes it on-demand by comparing two tree objects — it's not retrieving a stored diff. The storage layer uses delta compression in packfiles as an optimization, but the logical data model is always snapshot-based.", difficulty: "junior" },
        { question: "You run `git init` on a new project. What files and directories are created inside `.git/`, and what is each one's purpose?", answer: "Key entries: `HEAD` (symbolic ref pointing to the current branch), `config` (repo-local git settings), `index` (the staging area — binary file), `objects/` (the content-addressable object store for blobs, trees, commits, and tags), `refs/heads/` (local branch refs), `refs/remotes/` (remote-tracking refs), `refs/tags/` (tag refs), and `logs/HEAD` (the reflog — every HEAD position for recovery).", difficulty: "junior" },
        { question: "Two separate files in your repo have identical content. How many blob objects does Git store, and why?", answer: "Git stores exactly one blob. Because blobs are identified by a SHA-1 hash of their content (not filename or path), identical content produces the same SHA. Both files' tree entries point to the single blob. This deduplication reduces storage and enables efficient transfers — only unique objects are sent over the network.", difficulty: "junior" },
        { question: "You need to configure your work laptop to sign commits with GPG for your company repo but keep your personal repos unsigned. How do you achieve this without changing your global config?", answer: "Use `git config --local` inside the company repo: `git config --local user.signingkey COMPANY_KEY_ID` and `git config --local commit.gpgSign true`. Local config in `.git/config` overrides global `~/.gitconfig`. Personal repos remain unaffected because they use the global settings.", difficulty: "mid" },
        { question: "Your team uses a monorepo and developers frequently clone it fresh. `npm install` after cloning takes 4 minutes. You notice `node_modules` content rarely changes between commits. What Git-level concept explains the inefficiency, and what would you investigate?", answer: "Git's object model stores the full snapshot on every commit regardless of what changed. For clones, all objects are transferred. The issue isn't Git itself — it's the post-clone setup. Investigation points: check if a `.gitignore` is correctly excluding `node_modules` (it should be), ensure the team uses `npm ci` with a lockfile, and consider Git LFS or a caching proxy (like Verdaccio) for npm packages. Also check if `git sparse-checkout` can help developers who only need part of the monorepo.", difficulty: "mid" },
        { question: "You accidentally committed your AWS credentials to git and pushed to a public GitHub repo. What are your immediate steps?", answer: "1. Immediately rotate/revoke the compromised credentials in AWS IAM — assume they are already compromised. 2. Remove the secret from the repo: use `git filter-repo --path credentials.txt --invert-paths` to rewrite history, then force-push. 3. Ask GitHub Support to clear cached views of the old commits. 4. Add the credentials file to `.gitignore`. 5. Audit AWS CloudTrail logs for any unauthorized access. Rotating credentials must happen before history rewriting — someone may have already scraped the public repo.", difficulty: "mid" },
        { question: "Explain why it is mathematically impossible to create a circular reference in a Git commit graph.", answer: "A commit's SHA-1 hash is computed from its content, which includes its parent's SHA-1. To create commit B pointing to C and C pointing back to B, you would need to know C's SHA before C exists — which requires running SHA-1 on content that includes C's own hash. This is a preimage problem: finding x such that SHA1(content_including_x) = x is computationally infeasible. The acyclic property is enforced by the hash function itself, not by policy or runtime checks.", difficulty: "senior" },
        { question: "A new developer set up their SSH key but `git push` still asks for a password. Walk through the debugging steps.", answer: "1. Check the remote URL: `git remote -v` — if it shows `https://`, the SSH key is irrelevant; change to SSH: `git remote set-url origin git@github.com:org/repo.git`. 2. Test SSH connectivity: `ssh -T git@github.com` — a successful auth prints 'Hi username!'. 3. Check the SSH agent: `ssh-add -l` — if the key isn't listed, run `ssh-add ~/.ssh/id_ed25519_github`. 4. Verify `~/.ssh/config` has the correct `IdentityFile` entry for `github.com`. 5. Confirm the public key is added to GitHub Settings → SSH Keys.", difficulty: "mid" },
        { question: "Your organization wants all developers to automatically use the company email in new repos without manual configuration. How do you enforce this with Git?", answer: "Use Git's `init.templateDir` setting. Create a template directory with a `hooks/` folder containing a `post-checkout` or `post-init` hook that runs `git config user.email $USER@company.com` if no local email is set. Configure `git config --global init.templateDir ~/.git-templates`. Alternatively, use a company-wide `.gitconfig` snippet distributed via onboarding scripts or configuration management (Ansible/Chef) that sets `user.email` and optionally uses a `includeIf` directive to apply company identity only in repos under a specific directory path.", difficulty: "senior" },
      ],
    },
    {
      id: "core-concepts",
      title: "Core Git Concepts",
      description: "Commits, branches, and merging — with internals exposed.",
      level: "beginner",
      lessons: [
        {
          id: "commits-and-history",
          title: "Commits, HEAD & History Navigation",
          description: "Commit anatomy, HEAD mechanics, detached HEAD, amending, and git log mastery.",
          type: "lesson",
          duration: 18,
          objectives: [
            "Describe every field in a commit object",
            "Explain HEAD and detached HEAD — and safely recover",
            "Navigate history with relative refs and git log filters",
            "Use git blame and git log -L for deep code archaeology",
          ],
          content: `## Commit Anatomy — What Is Actually Stored

A commit is a plain-text object Git stores in \`.git/objects/\`. Inspecting it raw reveals exactly what goes into a SHA-1 hash:

\`\`\`bash
git cat-file -p HEAD
# tree   4b825dc...       <- root tree SHA (full project snapshot)
# parent a1b2c3d4...      <- previous commit SHA (absent on the very first commit)
# author  Alice <a@co.com> 1700000000 +0530
# committer Alice <a@co.com> 1700000000 +0530
#                          ↑ Unix timestamp  ↑ timezone offset
# feat: add OAuth2 login
#
# Implements Google + GitHub OAuth2 providers.
# Closes #142
\`\`\`

### The SHA-1 is Deterministic and Tamper-Proof

Git computes the commit's SHA-1 by hashing this exact text (plus a header). Every field contributes to the hash:

- **tree SHA** — if any file changed, the tree SHA changes → commit SHA changes
- **parent SHA** — reordering or rebasing produces a new parent SHA → new commit SHA
- **author + committer** — changing the name, email, or timestamp changes the SHA
- **message** — even a single character change produces a completely different SHA

This is why \`git commit --amend\` creates a *new* object even if you only fix a typo in the message. The old object is not deleted — it stays in \`.git/objects/\` and is accessible via the reflog for 30 days.

### Content-Addressable Storage in Practice

The SHA-1 is both the object's identity and its integrity check. Git verifies every object it reads. If a bit flips on disk or in transit, the SHA mismatch is detected immediately:

\`\`\`bash
# Verify the entire object database:
git fsck --full
# Dangling commits, missing blobs, broken links all surface here

# Verify a specific object:
git cat-file -t a1b2c3d4   # "commit" — type check
git cat-file -p a1b2c3d4   # dump the content
\`\`\`

---

## Commit Messages — Why They Matter Far Beyond Code Review

A commit message is not just documentation for code review. It is a first-class data source for four critical production workflows:

1. **\`git bisect\`** — when bisecting a regression, the first bad commit's message is your only clue about *what changed* at that point. "WIP" tells you nothing. "fix: increase JWT expiry to 30 days (was 5 minutes)" points directly to the bug.

2. **\`git blame\` / \`git log -L\`** — when you're debugging why a function looks the way it does, the commit messages on each line tell the story. "refactor" without context is noise; "refactor: extract middleware to support rate limiting (see #234)" is a breadcrumb.

3. **Automated changelogs** — tools like \`semantic-release\`, \`conventional-changelog\`, and \`release-please\` parse commit messages to generate release notes, bump version numbers (major/minor/patch), and tag releases. This only works with structured messages.

4. **Code archaeology** — six months from now, when you can't remember why that weird \`if\` statement exists, \`git log -S "the weird condition"\` finds the commit. Its message is the institutional knowledge that explains *why*.

### Conventional Commits Format

\`\`\`
<type>(<optional scope>): <subject>
<blank line>
<optional body>
<blank line>
<optional footer>
\`\`\`

\`\`\`bash
# Examples:
feat(auth): add OAuth2 login with Google and GitHub
# ↑ triggers minor version bump in semantic-release

fix(api): prevent race condition in session store (#342)
# ↑ triggers patch version bump

feat!: remove deprecated v1 API endpoints
# ↑ '!' marks a breaking change → major version bump

chore(deps): upgrade Next.js to 14.2.0
# ↑ no version bump, but documented for changelog

# Subject line rules:
# - 72 chars max (GitHub wraps at 72 in most views)
# - Imperative mood: "add OAuth2" not "added OAuth2" or "adds OAuth2"
# - No trailing period
# - Don't describe WHAT (the diff shows that) — describe WHY
\`\`\`

---

## HEAD — Git's Current Position Pointer

HEAD is a 41-byte file (\`ref: refs/heads/main\\n\`) that points to where you currently are:

\`\`\`bash
cat .git/HEAD
# ref: refs/heads/main    <- symbolic ref (normal, "attached" state)

cat .git/refs/heads/main
# a1b2c3d4e5f6789abcdef0123456789abcdef01  <- 40-char SHA + newline
\`\`\`

When you make a commit:
1. Git writes the new commit object to \`.git/objects/\`
2. Git reads the branch file (\`refs/heads/main\`) to find the parent
3. Git writes the new commit SHA into the branch file
4. HEAD still points to the branch — it indirectly follows the branch forward

This is why switching branches is fast: Git just writes a new SHA into \`.git/HEAD\`.

---

## Detached HEAD — What It Is and Why It Happens

Detached HEAD means HEAD points directly to a commit SHA instead of a branch name:

\`\`\`bash
git checkout a1b2c3d4    # explicit SHA checkout
cat .git/HEAD
# a1b2c3d4...            <- raw SHA, no branch reference!

# Other ways you land in detached HEAD:
git checkout v1.2.0      # checking out a tag
git checkout origin/main # checking out a remote-tracking ref
git bisect start         # bisect checks out commits directly
\`\`\`

**Why it is dangerous:** Commits you make in detached HEAD have no branch pointing to them. When you run \`git switch main\`, HEAD moves back to the branch and your experimental commits become "orphaned" — unreachable through normal refs. Git garbage-collects orphaned objects after 30 days.

\`\`\`bash
# Safe exploration workflow:
git checkout abc123               # explore — you're in detached HEAD
# Found something useful? Create a branch BEFORE leaving:
git switch -c experiment/save-this

# Already switched away and lost your work?
git reflog                        # find the orphaned commit SHA
# HEAD@{3}: commit: my experimental changes
git branch rescued-work HEAD@{3}  # create branch at that SHA
\`\`\`

---

## Amending Commits — Rewriting the Last Commit

\`\`\`bash
# Fix the last commit message:
git commit --amend -m "feat: add OAuth2 (Google + GitHub) (#142)"

# Add a forgotten file to the last commit:
git add forgotten.py
git commit --amend --no-edit    # keep the same message

# Change the author of the last commit:
git commit --amend --reset-author   # uses current git config identity

# Amend with a specific author:
git commit --amend --author="Alice Chen <alice@company.com>"
\`\`\`

**What amend actually does:** It creates a completely new commit object (new SHA) and updates the branch pointer to it. The original commit stays in \`.git/objects/\` and is referenced by the reflog. It is not deleted — it is simply unreachable via normal refs.

**The golden rule:** Never amend commits that have been pushed to a shared branch. Other developers have the original SHA. If you amend and force-push, their local history diverges.

---

## Navigating History

\`\`\`bash
# Relative refs — addressing commits relative to a known point:
HEAD~1       # one commit back (first parent)
HEAD~3       # three commits back
HEAD^        # same as HEAD~1
HEAD^2       # second parent of a merge commit (the merged branch tip)
main~5       # five back from main tip
v1.2.0^{}   # the commit a tag points to (dereference a tag)

# Log views:
git log --oneline --decorate --graph --all   # visual DAG (alias: lg)
git log -p --follow -- src/auth.py           # full diffs + follow renames
git log -S "authenticate"                    # commits that added/removed this string (pickaxe)
git log -G "regex.*pattern"                  # commits where diff matches regex
git log --author="Alice" --since="1 week ago" --until="yesterday"

# Inspect a specific commit:
git show HEAD
git show HEAD~2:src/auth.py    # content of a file at a specific commit

# Code archaeology:
git blame -w -C src/auth.py                  # who changed each line
# -w: ignore whitespace  -C: detect moves within the file

git log -L :authenticate:src/auth.py         # full history of one function
# Shows every commit that touched this function and the diff for each

git log --diff-filter=D -- deleted-file.py   # find when a file was deleted
# D=deleted, A=added, M=modified, R=renamed
\`\`\`

### The Most Powerful Archaeology Commands

**\`git log -L :functionName:file.py\`** traces the *evolution of a function* across all time. Instead of showing every file change in a commit, it shows only the lines belonging to that function. Use this to understand why a function looks the way it does — far more useful than blame for complex code.

**\`git log -S "string"\`** (the "pickaxe") finds every commit where this exact string was added or removed. It does not find commits where the string was present but unchanged. Essential for finding when a function was introduced, a constant was defined, or a dependency was first used.

\`\`\`bash
# Real-world usage: find when a dependency was added
git log -S "require('vulnerable-package')" --all

# Find when a feature flag was introduced:
git log -S "FEATURE_AUTH_V2_ENABLED" --all
\`\`\`

> **Tip:** \`git log -L :functionName:file.py\` (capital L, colon-function-colon-file) shows the complete evolution of a function through all time. Far more useful than blame for understanding WHY code looks the way it does. Combine it with \`git show <sha>\` on interesting commits to read the full context of each change.`,
          interviewQuestions: [
            {
              question: "What is a detached HEAD state? How do you safely work in it and preserve any commits you make?",
              difficulty: "mid",
              answer: `**Detached HEAD** = HEAD points to a commit SHA directly, not a branch name. Git's commit mechanism works normally, but commits have no branch anchoring them — they're "floating."

**Safe workflow:**
1. \`git checkout abc123\` — enter detached HEAD (e.g., to test an old version)
2. Explore, make changes, even commit
3. **BEFORE switching branches**: \`git checkout -b experiment\` — creates a branch at current HEAD, anchoring your commits
4. Now safely switch: \`git switch main\`

**If you forgot to create a branch:**
\`\`\`
git reflog
# abc123 HEAD@{3}: commit: my experimental fix
git branch rescue abc123   # recreate branch from that SHA
\`\`\`
Orphaned commits live in the object store for 30 days before \`git gc\` removes them.`,
            },
            {
              question: "How would you find which commit introduced a bug that appeared 3 months ago among 400+ commits?",
              difficulty: "mid",
              answer: `**Use \`git bisect\`** — binary search through history:
\`\`\`
git bisect start
git bisect bad HEAD           # current: has bug
git bisect good v3.1.0        # this release was clean

# Git checks out commit #200 (midpoint)
# Test the app...
git bisect good / git bisect bad
# Repeat ~9 times (log2(400) = ~9 checks)
# Git reports: "abc123 is the first bad commit"
git bisect reset
\`\`\`

**For automated bisect** (if you have a reproducing test):
\`\`\`
git bisect run ./reproduce-bug-test.sh
# Exits 0=good, non-zero=bad. Git runs automatically.
\`\`\`

**Also useful:**
\`\`\`
git log -S "suspectedFunction"   # find when a string appeared/disappeared
git log -G "regex"               # find commits where diff matches pattern
\`\`\``,
            },
          ],
        },
        {
          id: "branching",
          title: "Branching — Lightweight Pointers",
          description: "Branch internals, the ref system, tracking branches, and naming conventions.",
          type: "lesson",
          duration: 16,
          objectives: [
            "Explain why branch creation is O(1) in Git",
            "Use git switch for branch operations",
            "Understand remote-tracking branches and ahead/behind",
            "Design and enforce a branch naming convention",
          ],
          content: `## What Is a Branch? — The 41-Byte Secret

Most developers think of branches as "copies of the codebase" or "parallel timelines." These mental models break down and cause confusion. The reality is far simpler and more powerful:

**A branch is a text file containing a single 40-character SHA-1 hash.**

\`\`\`bash
cat .git/refs/heads/main
# a1b2c3d4e5f6789abcdef0123456789abcdef01

# The entire file is 41 bytes (40 hex chars + newline)
wc -c .git/refs/heads/main
# 41

# Creating a branch writes this same SHA into a new file:
git branch feature/auth
cat .git/refs/heads/feature/auth
# a1b2c3d4...   <- identical to main — both point to the same commit
\`\`\`

This has profound implications:

**Branch creation is O(1) — constant time and constant space.** No matter if your repo has 10 commits or 10 million, creating a branch takes the same time: one file write. SVN branches were directory copies — O(n) proportional to repo size. Mercurial branches embed metadata into commits. Git's approach is uniquely lightweight.

**Branch deletion is also O(1)** — deleting a branch deletes the file. The commits it pointed to are not deleted (they stay in \`.git/objects/\` until garbage collected). This is why \`git branch -D\` feels risky but is recoverable: you only deleted the pointer, not the data.

**Switching branches is a directory update, not a copy.** When you run \`git switch main\`, Git reads the SHA from \`.git/refs/heads/main\`, computes the diff between that tree and your current tree, and applies the diff to your working directory. On a large codebase with thousands of files where you only changed two, only those two files are touched on disk.

---

## Under the Hood: The Ref System

Branches live in \`.git/refs/heads/\`. Remote-tracking branches live in \`.git/refs/remotes/\`. Tags live in \`.git/refs/tags/\`. All are the same format — a file containing a SHA.

For performance with large repos (thousands of branches), Git packs refs:

\`\`\`bash
# Loose refs (one file each):
ls .git/refs/heads/
# main  feature/auth  hotfix/xss

# Packed refs (all in one file after git pack-refs):
cat .git/packed-refs
# a1b2c3d4... refs/heads/main
# d4e5f6... refs/heads/feature/auth

# Git checks packed-refs if the loose ref file doesn't exist.
# git fetch --prune removes stale remote-tracking refs from packed-refs.
\`\`\`

---

## Branch Operations

\`\`\`bash
# List branches:
git branch                  # local only
git branch -r               # remote-tracking only
git branch -a               # all (local + remote-tracking)
git branch -vv              # local with tracking info + ahead/behind counts

# Create & switch (modern, unambiguous syntax):
git switch -c feature/login             # create and switch immediately
git switch main                         # switch to existing branch
git switch -                            # switch to previous branch (like cd -)

# Create from a specific point:
git switch -c hotfix/session-bug main         # from main's current HEAD
git switch -c release/v2.4 v2.3.0            # from a tag
git switch -c recovery abc123def             # from a specific SHA

# Rename:
git branch -m old-name new-name          # rename local branch
git push origin --delete old-name        # delete old remote name
git push -u origin new-name              # push new name

# Delete:
git branch -d feature/done               # safe: refuses if unmerged
git branch -D abandoned-work             # force delete regardless of merge status
git push origin --delete old-branch      # delete the branch on the remote
\`\`\`

### The Difference Between \`git switch\` and \`git checkout\`

\`git checkout\` does two completely unrelated things:
1. Switch branches: \`git checkout main\`
2. Restore files: \`git checkout -- src/auth.py\` (discard local changes)

This overloading caused countless "I accidentally discarded my changes" accidents. Git 2.23 introduced dedicated commands:

\`\`\`bash
git switch main               # replaces: git checkout main
git switch -c feature/auth    # replaces: git checkout -b feature/auth
git restore src/auth.py       # replaces: git checkout -- src/auth.py
\`\`\`

Use \`switch\` and \`restore\`. They are unambiguous and impossible to accidentally confuse.

---

## Remote-Tracking Branches — Local Mirrors of the Remote

When you \`git fetch\`, Git downloads objects from the remote and updates special read-only refs in \`.git/refs/remotes/\`:

\`\`\`bash
git branch -r
# origin/main          <- remote-tracking: "where main was when I last fetched"
# origin/feature/auth
# origin/HEAD -> origin/main

git branch -vv
# * feature/auth a1b2c3 [origin/feature/auth: ahead 2, behind 1] Add JWT
#   main         d4e5f6 [origin/main] Initial commit
# "ahead 2" = 2 local commits not pushed yet
# "behind 1" = 1 remote commit not pulled yet
\`\`\`

**Critical insight:** \`origin/main\` is *not* the same as the remote's \`main\`. It is a snapshot of what the remote's \`main\` was the last time you fetched. It is not automatically updated. Run \`git fetch\` to synchronise it.

\`\`\`bash
# These are different operations:
git fetch origin        # update origin/main, DON'T touch local main
git pull                # fetch + merge (or fetch + rebase with pull.rebase true)

# Check the gap before integrating:
git fetch origin
git log --oneline main..origin/main    # what's on remote but not local
git log --oneline origin/main..main    # what's local but not pushed

# Create local branch from remote-tracking ref:
git switch -c feature/auth origin/feature/auth
# --track is implied: the new branch tracks origin/feature/auth

# Prune stale remote-tracking refs (when remote branches are deleted):
git fetch --prune
# or globally:
git config --global fetch.prune true
\`\`\`

---

## Branch Naming Convention

Branch names are refs stored as files in \`.git/refs/heads/\`. Forward slashes create directory nesting in the refs filesystem. Enforce a naming convention with a pre-push hook or CI rule that rejects non-conforming names:

\`\`\`
feature/142-oauth-login         <- ticket number + short description
bugfix/fix-session-expiry
hotfix/critical-xss-patch       <- production emergency
chore/upgrade-to-node-20        <- maintenance, no user-visible change
release/v2.4.0                  <- release preparation
experiment/try-redis-caching    <- exploratory, may be discarded
docs/update-api-reference
\`\`\`

**Why include the ticket number?** It creates a bidirectional link: you can find the branch from the ticket and find the ticket from the branch. Many tools (Jira, Linear, GitHub) automatically detect ticket numbers and create cross-links.

### Common Mistake: Long-Lived Feature Branches

The most common Git pain comes not from command mistakes but from branches that live too long. A branch open for two weeks accumulates commits on \`main\` that touch the same files. When you finally merge, you get "merge conflicts" that are really just "everyone changed the same code independently." The fix is process, not Git knowledge: keep branches under 2-3 days old.

> **Tip:** Use \`git switch\` instead of \`git checkout\` for branches — \`checkout\` is overloaded (it also restores files). \`switch\` is unambiguous. \`git switch -\` goes to the previous branch (like \`cd -\` in shell). And remember: a branch is 41 bytes — create them freely, delete them aggressively.`,
          interviewQuestions: [
            {
              question: "Why is branch creation O(1) in Git? Why does this matter for developer workflow?",
              difficulty: "junior",
              answer: `Creating a branch writes one file: \`.git/refs/heads/<name>\` containing a 40-char SHA. Constant time, constant space — 41 bytes regardless of repo size, number of commits, or number of files.

**Why it matters:** This makes branching essentially free, which unlocks:
- Short-lived feature branches (create-use-delete in hours)
- Experimental branches with zero risk (branch from main, experiment, delete if it fails)
- One branch per PR/ticket as standard practice
- Parallel work on multiple features simultaneously

Teams with expensive branching (SVN) develop habits of committing directly to trunk. This is riskier and makes code review harder. Git's O(1) branching is a key reason modern teams ship faster.`,
            },
            {
              question: "What is the difference between `origin/main` and local `main`? When do they diverge?",
              difficulty: "mid",
              answer: `**Local \`main\`**: your editable branch pointer. Advances when you commit locally.
**\`origin/main\`**: read-only local mirror of the remote's \`main\` as of your last \`git fetch\`. Cannot be committed to directly.

**When they diverge:**
- **You're ahead**: committed locally, not yet pushed → \`main\` is ahead of \`origin/main\`
- **You're behind**: someone else pushed to remote → \`origin/main\` advances after \`git fetch\`
- **Both ahead**: you and others both committed → branches diverged, need rebase or merge

\`git status\` reads this gap: "Your branch is 3 commits ahead of 'origin/main'."

**Key insight:** \`git fetch\` updates \`origin/main\` without touching local \`main\`. This lets you inspect remote changes before integrating them.`,
            },
            {
              question: "15 developers commit directly to main. Propose a branching strategy and justify it.",
              difficulty: "senior",
              answer: `**Recommendation: Trunk-Based Development with short-lived feature branches.**

**Branch protection rules on \`main\`:**
- Require PR + ≥1 approval + green CI to merge
- Disable force push
- Auto-delete merged branches
- Require up-to-date branch before merge (prevents stale merges)

**Developer workflow:**
\`\`\`
git switch -c feature/TICKET-123-add-auth main
# work 1-2 days max
# open PR, get reviewed, CI passes
# merge to main (squash or merge commit — pick one and enforce it)
# branch auto-deletes
\`\`\`

**Feature flags** for unfinished work shipped to prod but hidden from users.

**Why not GitFlow:** GitFlow's long-lived \`develop\` branch creates large, painful merges. Companies shipping daily (Google, Netflix, Shopify) use TBD. The shorter the branch lifetime, the smaller the merge conflict.

**Metrics to target:** PR open time <24h, branch lifetime <48h, CI duration <10min.`,
            },
          ],
        },
        {
          id: "merging",
          title: "Merging — The Three-Way Algorithm",
          description: "Merge internals, fast-forward vs recursive, conflict resolution, and merge strategies.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Explain three-way merge and what the merge base is",
            "Distinguish fast-forward from true merges",
            "Resolve merge conflicts systematically with context",
            "Apply squash, --no-ff, and other merge strategies",
          ],
          content: `## The Three-Way Merge Algorithm — Step by Step

When you run \`git merge feature/auth\`, Git does not compare your branch and the feature branch directly. That approach would produce conflicts for every line that differs between them, even if both sides are making compatible changes. Instead Git uses **three-way merge**, which requires a third data point: the merge base.

### What Is the Merge Base?

The merge base is the most recent common ancestor commit — the last commit where both branches were identical:

\`\`\`
       A (merge base — both branches started here)
      / \\
     B   C   <- work done on main since branching
      \\ /
       D   <- the merge result
\`\`\`

\`\`\`bash
# Find the merge base:
git merge-base main feature/auth
# a1b2c3...

# See what main changed since branching:
git diff $(git merge-base main feature/auth) main

# See what feature/auth changed since branching:
git diff $(git merge-base main feature/auth) feature/auth
\`\`\`

### The Algorithm Applied to Each Hunk

For every changed hunk in the file, Git asks three questions and applies this logic:

| Base says | Ours says | Theirs says | Result |
|-----------|-----------|-------------|--------|
| \`timeout = 30\` | \`timeout = 30\` | \`timeout = 60\` | **Take theirs** — only they changed it |
| \`timeout = 30\` | \`timeout = 10\` | \`timeout = 30\` | **Take ours** — only we changed it |
| \`timeout = 30\` | \`timeout = 10\` | \`timeout = 60\` | **CONFLICT** — both changed it differently |
| \`timeout = 30\` | \`timeout = 10\` | \`timeout = 10\` | **Take either** — both made the same change |

The merge base is what makes this possible. Without it, every difference would look like a conflict.

\`\`\`bash
# Visualise what each side changed before merging:
git log --oneline main..feature/auth     # commits on feature not in main
git log --oneline feature/auth..main     # commits on main not in feature
\`\`\`

---

## Fast-Forward vs True Merge — When Each Applies

### Fast-Forward Merge

When the current branch is a direct ancestor of the branch being merged (no divergence), Git can simply advance the pointer — no merge commit needed:

\`\`\`
Before:  main: A─B       feature: A─B─C─D
         (main is an ancestor of feature)

After:   main: A─B─C─D   (pointer moved forward — no merge commit)
\`\`\`

\`\`\`bash
git merge feature/auth              # fast-forward if possible (default)
git merge --ff-only feature/auth    # fail if fast-forward not possible
# Use --ff-only in automated pipelines to enforce rebased branches
\`\`\`

### True (Three-Way) Merge

When both branches have diverged (both have commits the other lacks), a merge commit is required:

\`\`\`
Before:  main: A─B─E     feature: A─B─C─D
         (both have diverged from B)

After:   main: A─B─E─M   (M has two parents: E and D)
\`\`\`

The merge commit M records that at this point in history, two development lines were reconciled. You can \`git log --graph\` and see the branch topology.

### Merge Strategies Compared

\`\`\`bash
git merge feature/auth              # fast-forward if possible, else true merge
git merge --no-ff feature/auth      # always create a merge commit
# --no-ff preserves the fact that a feature branch was used
# Useful when you want git log to show feature branches as branches

git merge --squash feature/auth     # collapse all feature commits into one staged diff
# Then: git commit -m "feat: add OAuth2"
# History: feature branch history NOT preserved in main
# Use case: messy WIP history on feature, want one clean commit on main

git merge --strategy-option=ours main
# In conflict, always take our version
# Useful for maintenance branches where you want to mark commits as merged
# without actually integrating changes
\`\`\`

---

## What a Merge Conflict Actually Is at the File Level

A conflict marker is not an error — it is Git telling you "I found a hunk where both sides made incompatible changes and I need you to decide the right outcome."

\`\`\`bash
git merge feature/auth
# CONFLICT (content): Merge conflict in src/auth.py
# Automatic merge failed; fix conflicts and then commit the result.

# The conflicted file now contains markers:
<<<<<<< HEAD
def authenticate(user, password):
    return bcrypt.check(password, user.hash)
||||||| merged common ancestors      # the BASE version (with mergetool)
def authenticate(user, password):
    return db.verify(password, user.id)
=======
def authenticate(user, token):
    return jwt.verify(token, SECRET)
>>>>>>> feature/auth
\`\`\`

Three zones:
- \`<<<<<<< HEAD\` to \`|||||||\` — **your version** (current branch)
- \`|||||||\` to \`=======\` — **base version** (what it was before both changed it)
- \`=======\` to \`>>>>>>>\` — **their version** (the branch being merged)

The base section only appears with \`merge.conflictstyle=diff3\` (recommended — configure it globally):

\`\`\`bash
git config --global merge.conflictstyle diff3
# Now you see all three versions in every conflict → much easier to understand
\`\`\`

### Resolving Conflicts Systematically

\`\`\`bash
# Step 1: Understand the intent of each side
git log --oneline main..feature/auth              # what feature was building
git log --oneline feature/auth..main              # what main received since branching

# Step 2: Check what the base version was
git show $(git merge-base main feature/auth):src/auth.py

# Step 3: Edit the file — remove ALL markers, produce the correct combined result
# Never blindly pick one side — understand what both were trying to do

# Step 4: Verify your resolution
# Run tests! A syntactically correct file can be semantically broken.

# Step 5: Stage and commit
git add src/auth.py
git merge --continue    # or git commit

# Bail out entirely (restores to pre-merge state):
git merge --abort
\`\`\`

### Using a Three-Pane Merge Tool

\`\`\`bash
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

git mergetool   # opens VS Code's three-pane diff editor
# Left pane: ours  |  Middle: result  |  Right: theirs

# Other options:
# vimdiff, intellij, meld, p4merge
\`\`\`

---

## ORIG_HEAD and MERGE_HEAD — Safety Nets

Before every merge, Git saves the current HEAD to \`ORIG_HEAD\`. Before every rebase, it saves to \`ORIG_HEAD\` too. This is your automatic backup:

\`\`\`bash
git merge feature/auth
# Merge result looks wrong:
git reset --hard ORIG_HEAD    # undo the entire merge instantly

# MERGE_HEAD exists during a merge-in-progress:
cat .git/MERGE_HEAD           # SHA of the branch being merged
cat .git/MERGE_MSG            # pre-filled merge commit message

# These files are cleaned up when the merge is completed or aborted.
\`\`\`

---

## Production Pattern: Merge vs Squash vs Rebase

\`\`\`
Strategy        History           Bisect    Revert      When to use
─────────────────────────────────────────────────────────────────────
--no-ff merge   Branch visible    Good      Easy (whole Visible feature history matters
                                            feature)

--squash merge  Linear, clean     Great     Easy (one   WIP commits, clean main history
                                  commit)

Rebase + merge  Linear, no MC     Great     Commit by   Perfect commit hygiene required
                                  commit

Fast-forward    Linear            Great     Commit by   Simple, no divergence
                                  commit
\`\`\`

Teams should pick **one strategy** and enforce it consistently via GitHub merge settings (allow only squash merges, or only merge commits). Inconsistency produces a log that is impossible to read.

> **Tip:** Before resolving a complex conflict, run \`git log --oneline main..feature/auth\` to understand what the feature was trying to accomplish. Mechanical conflict resolution (blindly picking one side) often introduces logic bugs worse than the original conflict. Also enable \`merge.conflictstyle=diff3\` globally — seeing the base version in every conflict makes resolution dramatically easier.`,
          interviewQuestions: [
            {
              question: "Explain the three-way merge algorithm. Why does Git need the merge base?",
              difficulty: "senior",
              answer: `Three-way merge uses: **ours** (current branch), **theirs** (merging branch), and **merge base** (most recent common ancestor).

**Why the merge base is essential:** Without it, Git can't determine who changed what. Example: if line 42 says \`timeout = 30\` in ours and \`timeout = 60\` in theirs, is this a conflict? It depends entirely on the base:
- Base says \`timeout = 30\` → only they changed it → auto-accept theirs (no conflict)
- Base says \`timeout = 10\` → both changed it differently → **conflict, human decides**
- Base says \`timeout = 60\` → only we changed it → auto-accept ours (no conflict)

The merge base is the "before" reference that makes it possible to attribute each change to one side. Without it, every difference would require manual resolution — making automated merges impossible.`,
            },
            {
              question: "What is the difference between `git merge --no-ff` and `git merge --squash`?",
              difficulty: "mid",
              answer: `**\`--no-ff\`**: Always creates a merge commit even when fast-forward is possible. Full feature branch history preserved in main. \`git log --graph\` shows branch structure. You can \`git revert <merge-sha>\` to undo the entire feature atomically.

**\`--squash\`**: Condenses all feature commits into one staged change. You then create one commit. No merge commit created. Feature branch history is NOT in main — only the final state diff.

**When to use each:**
- \`--no-ff\`: Commits are meaningful and well-crafted, team cares about history, branch structure important for releases
- \`--squash\`: Feature branch has WIP/fixup noise, want clean linear history on main, GitHub "Squash and merge" button uses this

**Key difference in practice:** With \`--no-ff\`, \`git blame\` on main shows individual commit authors. With \`--squash\`, blame shows only the squash commit. Pick one strategy and enforce it consistently via branch protection.`,
            },
            {
              question: "Walk me through the complete conflict resolution process for a database schema migration conflict.",
              difficulty: "senior",
              answer: `This is high-stakes because database migrations often can't be mechanically merged.

**Step 1: Gather context**
\`\`\`
git log --merge        # which commits created the conflict
git show HEAD:db/migrations/003.sql        # our version
git show feature/auth:db/migrations/003.sql  # their version
\`\`\`

**Step 2: Understand intent** — don't look at diffs, look at purpose:
- Did both branches add columns? → Both sets of columns likely needed
- Did one rename a table the other is modifying? → Serious semantic conflict
- Are they independent changes to the same file? → Combine both

**Step 3: Resolve semantically**
\`\`\`sql
-- Correct merged migration includes BOTH changes:
ALTER TABLE users ADD COLUMN oauth_provider VARCHAR(50);   -- ours
ALTER TABLE users ADD COLUMN oauth_token TEXT;             -- theirs
\`\`\`

**Step 4: Mark resolved and test**
\`\`\`
git add db/migrations/003.sql
# Run migration against test DB to verify it works!
git commit
\`\`\`

**Prevention:** Use timestamped migration filenames (20240115143000_add_oauth.sql). Two developers creating migrations simultaneously get different filenames → no merge conflict at file level (only potential schema conflicts that tests catch).`,
            },
          ],
        },
      ],
      exam: [
        { question: "You run `git log --oneline` and see 400 commits. A bug was introduced somewhere in the last 3 months. How do you find the exact commit that caused it?", answer: "Use `git bisect`: run `git bisect start`, mark current commit as bad with `git bisect bad HEAD`, mark a known-good older commit with `git bisect good <sha>`. Git checks out the midpoint. Test and mark good/bad. Repeat ~9 times (log2(400)). Git reports the first bad commit. For automated testing, use `git bisect run ./test-script.sh` where exit 0 = good and non-zero = bad.", difficulty: "mid" },
        { question: "You made a commit with the wrong email address. The commit hasn't been pushed yet. How do you fix it?", answer: "Run `git commit --amend --reset-author` after correcting the email with `git config user.email correct@email.com`. This rewrites the commit object with the correct author and committer info. Since it hasn't been pushed, rewriting local history is safe. The old commit SHA is orphaned but accessible via reflog for 30 days.", difficulty: "junior" },
        { question: "What is a detached HEAD state? You've been experimenting in it and made 3 commits. How do you preserve that work?", answer: "Detached HEAD means HEAD points directly to a commit SHA rather than a branch name. Any commits made have no branch anchoring them and will be orphaned when you switch away. To preserve the work: run `git checkout -b experiment-branch` (or `git switch -c experiment-branch`) BEFORE switching back. This creates a branch at your current position, anchoring all 3 commits. If you've already switched away, find the SHA in `git reflog` and run `git branch rescue <sha>`.", difficulty: "mid" },
        { question: "A teammate force-pushed to `main` and your local `main` is now ahead with commits that don't exist on the remote. What happened and how do you reconcile?", answer: "The teammate rewrote the shared branch history (via rebase or reset --hard + force push), creating new commit SHAs. Your local `main` still has the old SHAs. Running `git pull` will try to merge two diverged histories. The correct recovery (if you have no local-only work to save) is `git fetch origin && git reset --hard origin/main`. If you have unique local commits, cherry-pick them onto the new history. Going forward, enforce branch protection to prevent force pushes to main.", difficulty: "senior" },
        { question: "Explain what `git merge --ff-only` does and when you would use it.", answer: "`--ff-only` performs the merge only if it can be done as a fast-forward (i.e., the current branch is a direct ancestor of the branch being merged). If the branches have diverged, the command fails with an error instead of creating a merge commit. Use it when you want to enforce linear history on a branch — for example, in a CI step that validates feature branches are rebased on top of main before merging, or in automated release scripts where you only want to advance a pointer.", difficulty: "mid" },
        { question: "15 developers are committing directly to `main` without PRs. Propose a branching strategy and the specific GitHub settings to enforce it.", answer: "Implement Trunk-Based Development with short-lived feature branches. GitHub settings: enable branch protection on `main` — require pull request with at least 1 approval, require status checks to pass, require branches to be up to date before merging, disable force push, enable auto-delete of merged branches. Developer workflow: branch from main, work 1-2 days max, open PR, get reviewed, merge via squash or merge commit (pick one and enforce). Use feature flags for long-running changes. Target: PR lifetime < 24 hours, CI < 10 minutes.", difficulty: "senior" },
        { question: "You need to understand who changed a specific function over the past year and why. What Git commands give you the most context?", answer: "Use `git log -L :functionName:file.py` to see the complete history of just that function across all commits. Use `git blame -w -C file.py` to see which commit last changed each line (-w ignores whitespace, -C detects moves from other files). For each interesting commit SHA, use `git show <sha>` to see the full diff and commit message. `git log -S 'function signature'` finds commits where that string was added or removed.", difficulty: "mid" },
        { question: "A merge conflict occurred in `src/config.py`. Walk through the systematic process of resolving it correctly.", answer: "1. Read the conflict markers: `<<<<< HEAD` is your version, `=======` divides them, `>>>>> branch-name` is theirs. 2. Run `git log --merge` to see which commits on each side created the conflict. 3. Run `git show HEAD:src/config.py` and `git show branch-name:src/config.py` to understand the full context of each side. 4. Edit the file to the semantically correct combined result — don't just pick one side blindly. 5. Remove all conflict markers. 6. Run tests to verify the resolved code works. 7. `git add src/config.py` and `git commit`. Use `git merge --abort` at any point to bail out entirely.", difficulty: "mid" },
        { question: "What is the merge base, and why is it essential for Git's three-way merge algorithm?", answer: "The merge base is the most recent common ancestor commit of the two branches being merged. It serves as the 'before' reference. Without it, Git cannot determine which side made each change. Example: if line 10 reads `timeout=60` in ours and `timeout=30` in theirs, the merge base tells Git who changed it: if the base says `timeout=60`, only they changed it (auto-accept); if base says `timeout=10`, both changed it differently (conflict). Without the merge base, every difference would require manual resolution. Find it with `git merge-base branch1 branch2`.", difficulty: "senior" },
        { question: "You are asked to do a code review and notice the PR has 23 commits with messages like 'WIP', 'fix', 'oops'. How do you ask the developer to clean this up, and what commands would they use?", answer: "Ask them to use interactive rebase to clean up before review: `git rebase -i origin/main`. In the editor, they can: use `reword` to fix commit messages, `squash` or `fixup` to combine related commits (e.g., 'WIP' + 'fix' + 'oops' into one meaningful commit), and `drop` to remove accidental commits. The result should be a small number of well-described commits, each representing a logical unit of change. After cleaning up, they force-push with `git push --force-with-lease`. Review the rebased commits via `git log --oneline origin/main..HEAD`.", difficulty: "mid" },
      ],
    },
    {
      id: "advanced-git",
      title: "Advanced Git",
      description: "Rebase internals, undoing changes, bisect, and workflow mastery.",
      level: "intermediate",
      lessons: [
        {
          id: "rebasing",
          title: "Rebasing — Rewriting History",
          description: "Rebase internals, interactive rebase, golden rule, and rebase vs merge.",
          type: "lesson",
          duration: 22,
          objectives: [
            "Explain step-by-step what git rebase does internally",
            "Use interactive rebase to squash, fixup, reorder, and split commits",
            "State and apply the golden rule of rebasing",
            "Choose between rebase and merge for different scenarios",
          ],
          content: `## How Rebase Works Internally — New Commits, Not Moved Ones

The word "rebase" is slightly misleading. Rebase does not *move* commits from one branch to another. It **re-applies** the work those commits represent, creating entirely new commit objects on the new base:

\`\`\`
Before:  main:    A─B─C
         feature: A─B─D─E─F   (branched off at B)

git rebase main   (run from feature branch)

After:   main:    A─B─C              (unchanged)
         feature: A─B─C─D'─E'─F'   (D', E', F' are new commits)
\`\`\`

D', E', F' are **new commit objects** with new SHAs. They contain the same changes as D, E, F but have \`C\` as their ancestor instead of \`B\`. The original D, E, F are orphaned — no branch points to them, but the reflog holds them for 30 days.

### Step-by-Step Algorithm

\`\`\`bash
# When you run: git rebase main (from feature branch)

# 1. Find the merge base:
MERGE_BASE=$(git merge-base main feature)
# = B in our diagram

# 2. Save the diff for each commit since the merge base:
# D's patch = "add authentication module"
# E's patch = "add OAuth provider"
# F's patch = "add tests"

# 3. Reset the feature branch pointer to main's tip (C):
# HEAD is now at C

# 4. Apply each saved patch as a new commit:
# Apply D's patch → new commit D' (parent: C, same changes as D)
# Apply E's patch → new commit E' (parent: D', same changes as E)
# Apply F's patch → new commit F' (parent: E', same changes as F)

# 5. If any patch fails to apply cleanly → conflict:
# Git pauses, you resolve, then:
git rebase --continue

# Or bail out entirely:
git rebase --abort    # restores feature to its original state

# 6. Move the feature branch pointer to F'
\`\`\`

### Why Rebase Produces New SHAs Every Time

A commit's SHA is computed from its content: tree + parent + author + message. When you rebase, the **parent** changes (C instead of B). Therefore D', E', F' always have different SHAs than D, E, F — even if the changes are identical. This is not a bug; it is the content-addressable model working correctly.

---

## Interactive Rebase — Rewriting History Before Review

Interactive rebase (\`-i\`) opens your editor with a todo list of commits. You change the action next to each commit and Git executes your instructions in order:

\`\`\`bash
git rebase -i HEAD~5
# Or rebase on the remote branch to clean up everything not yet pushed:
git rebase -i origin/main
\`\`\`

The editor opens:

\`\`\`
pick a1b2c3 Fix login bug
pick d4e5f6 WIP: start oauth
pick 7g8h9i WIP: oauth almost done
pick 1j2k3l Fix typo
pick 3m4n5o Add oauth tests
\`\`\`

Edit to:

\`\`\`
pick   a1b2c3 Fix login bug
reword d4e5f6 feat: add OAuth2 (Google + GitHub)
squash 7g8h9i WIP: oauth almost done
fixup  1j2k3l Fix typo
pick   3m4n5o test: add OAuth2 integration tests
\`\`\`

### Command Reference

| Command | What it does |
|---------|-------------|
| \`pick\` | Use the commit unchanged |
| \`reword\` | Edit the commit message — pauses the editor |
| \`edit\` | Pause after this commit so you can amend or split it |
| \`squash\` | Combine with the previous commit, opening editor to merge messages |
| \`fixup\` | Combine with the previous commit, **discarding this commit's message** |
| \`drop\` | Delete this commit entirely — **dangerous** if later commits depend on it |
| (reorder lines) | Reorder lines to reorder commits in history |

### Common Mistake: squash vs fixup

\`squash\` opens the editor showing both commit messages combined — you write a new message that incorporates both. \`fixup\` silently discards the second message. Use \`fixup\` for cleanup commits ("fix typo", "fmt", "oops") and \`squash\` when both messages contain useful information worth merging.

---

## Splitting a Commit with \`edit\`

Sometimes a commit contains two unrelated changes that should be separate commits. Use \`edit\` to pause and split it:

\`\`\`bash
git rebase -i HEAD~3
# Mark target commit as "edit" in the editor

# Git applies the commit and pauses:
git reset HEAD~1             # uncommit but keep changes as unstaged
git add -p                   # interactively stage only the first logical chunk
git commit -m "feat: add login form validation"
git add -p                   # stage the remaining changes
git commit -m "feat: add login form HTML structure"
git rebase --continue        # continue replaying remaining commits
\`\`\`

---

## The Golden Rule of Rebasing — When NOT to Rebase

> **Never rebase commits that have been pushed to a branch other people have already pulled from.**

Rebase creates new SHAs. If others have already cloned or pulled the old SHAs, they now have commits that no longer exist on the remote. When they try to push or pull, Git sees two unrelated histories:

\`\`\`
Situation after force-push following a rebase:
Remote:         A─B─C─D'─E'─F'   (new history)
Developer Alice: A─B─C─D─E─F     (old history she pulled yesterday)

Alice's git pull:
Merges the two histories into: A─B─C─D─E─F─D'─E'─F'─M (duplicate commits!)
\`\`\`

Alice now has a fork containing both the old and new versions of each commit. Her \`git log --graph\` looks like a nightmare.

\`\`\`bash
# SAFE: rebase your own feature branch (only you use it)
git rebase origin/main         # update feature branch
git push --force-with-lease    # safe force push: fails if someone else pushed

# DANGEROUS: rebasing any branch others are working on
git rebase -i main             # on a shared branch
git push --force               # BREAKS everyone who pulled this branch

# --force-with-lease vs --force:
# --force: overwrites remote regardless (dangerous)
# --force-with-lease: checks that the remote ref hasn't changed since your last fetch
# If someone pushed after you fetched, --force-with-lease refuses (you must pull first)
\`\`\`

---

## \`--autosquash\` — Preparing fixup Commits in Advance

When you make a small fix to a previous commit, use \`--fixup\` to create a commit that will be automatically squashed:

\`\`\`bash
# You made a typo in commit abc123:
git add src/auth.py
git commit --fixup abc123    # creates "fixup! <original message>"

# When you rebase:
git rebase -i --autosquash origin/main
# Git automatically places the fixup commit after abc123 and marks it as fixup
# No manual editor work needed — the todo list is pre-arranged
\`\`\`

---

## Rebase vs Merge — Decision Guide

| Scenario | Recommendation | Why |
|---|---|---|
| Update feature from main | **Rebase** | Keeps history linear, no merge commit noise |
| Integrating to a shared long-lived branch | **Merge** | Safe, preserves history |
| Cleaning up before PR review | **Rebase + squash** | Reviewers see clean, logical commits |
| After PR is reviewed and SHAs are recorded | **Do NOT rebase** | Reviewers' SHA references would break |
| Merging to main from a short-lived PR | **Squash merge** | One clean commit per feature on main |
| Hotfix to prod with clear attribution needed | **--no-ff merge** | Branch structure visible in log |

---

## Under the Hood: What Makes a Conflict During Rebase

When a patch from commit D cannot apply cleanly to the new base C, rebase pauses. This is the same three-way merge algorithm as \`git merge\`, applied per-commit:

\`\`\`bash
# Rebase conflicts look identical to merge conflicts:
git rebase origin/main
# CONFLICT (content): Merge conflict in src/auth.py
# error: could not apply d4e5f6... feat: add OAuth2

# Fix the conflict:
# Edit src/auth.py to resolve the conflict markers
git add src/auth.py
git rebase --continue    # apply the next patch

# Check where you are in the rebase:
cat .git/rebase-merge/msgnum     # current commit number (e.g., "2")
cat .git/rebase-merge/end        # total commits to replay (e.g., "5")
ls .git/rebase-merge/            # all state for the in-progress rebase
\`\`\`

> **Tip:** \`git rebase --autostash --autosquash origin/main\` — automatically stashes uncommitted changes before rebasing, applies autosquash fixup commits in order, then restores the stash. One command to clean up and rebase in one shot. Configure \`rebase.autostash=true\` and \`rebase.autosquash=true\` globally to always get this behaviour.`,
          interviewQuestions: [
            {
              question: "What is the golden rule of rebasing? What happens if you break it?",
              difficulty: "mid",
              answer: `**Rule:** Never rebase commits that have been pushed to a branch other people have pulled from.

**What happens if broken:**
1. Rebase creates new commits (D', E', F') with new SHAs on remote
2. Other developers have the old commits (D, E, F) locally
3. Their next \`git pull\` sees two divergent histories (old SHAs + new SHAs with no common ancestor after the rebase point)
4. They get a confusing "diverged" state and accidentally create merge commits re-introducing the "old" commits
5. Result: history has both old and new versions of commits — the repo is a mess

**Recovery for the victims:** \`git fetch && git reset --hard origin/main\` — but they lose any unpushed local work.

**Safe force push:** At minimum use \`--force-with-lease\` to protect against overwriting others' commits on the branch.`,
            },
            {
              question: "Walk through what `git rebase -i HEAD~3` does when you squash two commits into one.",
              difficulty: "senior",
              answer: `1. Git identifies the 3 commits and the commit just before them (HEAD~3 = new rebase target)
2. Editor opens showing 3 commits as \`pick\`
3. You change second to \`squash\`, save, close editor
4. Git starts replaying: picks first commit (C1) by applying its diff onto HEAD~3 — new commit C1' created with new SHA
5. For \`squash\`: Git applies C2's diff on top, then opens editor to combine the two commit messages into one
6. Result: one new commit C1' containing both C1 and C2's changes
7. Third commit (originally C3) is replayed as C3' on top of C1'
8. Branch pointer moves to C3'

**Net result:** 3 original commits → 2 new commits (one squashed, one normal). All have new SHAs. The original 3 commits are orphaned in the object store, accessible via reflog for 30 days.`,
            },
            {
              question: "Your team runs `git rebase origin/main` in CI before allowing merges. A developer's branch has 20 commits and fails with 12 conflicts. What are your recommendations?",
              difficulty: "senior",
              answer: `**Root cause:** The developer's branch has diverged significantly from main — long-lived branch with many commits touching the same areas as others.

**Immediate solutions:**

1. **Squash first, then rebase:** 20 commits → 1 commit → only one conflict point to resolve
\`\`\`
git rebase -i origin/main~20   # squash all to 1
git rebase origin/main         # now only 1 patch to apply
\`\`\`

2. **Merge instead for this PR:** \`git merge origin/main\` resolves conflicts once rather than 20 times. Less clean history but pragmatic.

3. **Identify independent conflict layers:** Some conflicts may be simple (formatting), others semantic. Prioritize understanding the semantic ones.

**Prevention (the real fix):**
- Developers should rebase on \`origin/main\` daily
- PRs should be smaller (max 400 LOC, 1-2 days of work)
- Short-lived branches = trivial merges
- Assign clear ownership of modules to reduce simultaneous editing of same files`,
            },
          ],
        },
        {
          id: "undoing-changes",
          title: "Undoing Changes & Disaster Recovery",
          description: "reset, revert, stash, the reflog, and recovering from any local disaster.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Choose the right undo tool for each scenario",
            "Use the reflog to recover from any local disaster",
            "Distinguish revert from reset for shared branches",
            "Use git stash for quick context switches",
          ],
          content: `## Undo Decision Framework — Choosing the Right Tool

Git has many undo mechanisms and each is appropriate for a specific situation. Using the wrong one either does nothing (frustrating) or causes data loss (catastrophic). Use this decision tree first:

\`\`\`
What are you undoing?
│
├── Uncommitted changes (not yet committed):
│   ├── Staged files:   git restore --staged <file>   (unstage, keep changes)
│   └── Working dir:    git restore <file>             [DESTRUCTIVE — truly unrecoverable!]
│
├── Committed changes — has the commit been pushed?
│   ├── NOT pushed (local only):
│   │   └── git reset --soft/--mixed/--hard HEAD~N    (rewrite history freely)
│   │
│   └── PUSHED to a shared branch:
│       └── git revert <sha>                           (add an inverse commit — safe)
│
└── Need to undo a Git operation (bad rebase, bad merge):
    └── git reset --hard ORIG_HEAD  or  git reflog + reset
\`\`\`

---

## Git's Three Trees — The Mental Model Behind Reset

To understand \`reset\`, you need to understand Git's three trees:

1. **Repository** (\`.git/objects/\` — the commit history): where objects are stored permanently
2. **Index** (\`.git/index\` — the staging area): what will go into the next commit
3. **Working tree** (your files on disk): what you see and edit

Every \`git reset\` command moves the branch pointer (and HEAD) backward in the commit graph. The three modes differ in how far the change propagates into the Index and Working tree:

\`\`\`
         HEAD pointer    Index       Working tree
reset --soft:   ✓ moves        unchanged   unchanged
reset --mixed:  ✓ moves        ✓ updates   unchanged
reset --hard:   ✓ moves        ✓ updates   ✓ updates
\`\`\`

\`\`\`bash
# --soft: move HEAD only. Changes stay staged.
git reset --soft HEAD~1
# Result: last commit is gone, but all its changes are in the Index (staged)
# When to use: "I committed too early — want to add more files to this commit"
# After this: add more files, then 'git commit' recreates the commit with everything

# --mixed (default): move HEAD + reset Index. Working tree unchanged.
git reset HEAD~1
# Result: last commit is gone, changes are in working tree (unstaged)
# When to use: "I committed things that shouldn't be together — re-stage selectively"
# After this: use 'git add -p' to stage only what belongs in each commit

# --hard: move HEAD + reset Index + reset working tree.
git reset --hard HEAD~1
# Result: last commit is gone, ALL its changes are gone from working tree
# When to use: "This experiment failed completely — throw everything away"
# WARNING: changes NOT in a prior commit are GONE FOREVER (no recovery via reflog!)
\`\`\`

### The Key Safety Distinction

\`git reset --hard\` is safe for **committed** work (reflog has it) but **permanently destroys uncommitted working tree changes**. There is no reflog for unstaged changes. Always commit or stash before running \`--hard\`.

---

## \`git restore\` — The Modern Way to Undo File Changes

\`\`\`bash
# Unstage a file (move from Index back to working tree):
git restore --staged src/auth.py
# Equivalent to the old: git reset HEAD src/auth.py

# Discard working tree changes (DESTRUCTIVE — no recovery):
git restore src/auth.py
# Equivalent to the old: git checkout -- src/auth.py

# Restore a file to what it looked like in a specific commit:
git restore --source HEAD~3 src/auth.py
# The file in your working tree is now what it was 3 commits ago

# Restore multiple files matching a pattern:
git restore --staged '*.py'
\`\`\`

---

## \`git revert\` — Safe Undo for Shared History

\`git revert\` does not remove a commit. It **adds a new commit** that applies the exact inverse of the target commit's changes. The original commit remains in history forever:

\`\`\`bash
# Revert the most recent commit:
git revert HEAD
# Git computes the inverse diff and creates a new commit

# Revert a specific older commit:
git revert a1b2c3d4
# Note: this applies the inverse of ONLY that commit, not everything after it

# Revert a range (creates one revert commit per reverted commit):
git revert HEAD~3..HEAD

# Revert but don't commit yet (stage the revert for inspection):
git revert -n a1b2c3d4
git status           # see the reverted changes staged
git diff --staged    # review before committing

# Reverting a merge commit (you must specify which parent to keep):
git revert -m 1 <merge-sha>
# -m 1 = keep first parent (the main branch), revert the merged changes
# -m 2 = keep second parent (would revert what was on main)
\`\`\`

### Why Revert Exists (Not Just Reset)

Once a commit is pushed to a shared branch, everyone who pulled has that commit's SHA in their local history. If you \`reset\` the shared branch and force-push, their local history diverges and they get a confusing "diverged branches" error on next pull. \`git revert\` adds new history instead of rewriting old history — all developers can simply \`git pull\` and get the fix.

---

## The Reflog — Git's 30-Day Undo Journal

The reflog (\`.git/logs/HEAD\`) records every single position HEAD has occupied. Every commit, checkout, merge, rebase, reset, and branch switch gets logged:

\`\`\`bash
git reflog
# a1b2c3 HEAD@{0}: commit: Add OAuth2 login
# d4e5f6 HEAD@{1}: rebase (finish): returning to refs/heads/feature/auth
# 7g8h9i HEAD@{2}: rebase (pick): Add OAuth2 login
# 9f8e7d HEAD@{3}: rebase (start): checkout origin/main
# 2c3d4e HEAD@{4}: reset: moving to HEAD~3   ← aha, this is where things went wrong
# 5b6c7d HEAD@{5}: commit: Add user model
# ...

# Go back to any point in reflog history:
git reset --hard HEAD@{4}    # go back to before the reset
git reset --hard HEAD@{5}    # go back to the commit before the reset

# Create a branch from any reflog entry (non-destructive):
git switch -c rescue HEAD@{5}
\`\`\`

The reflog is **local only** — it is not pushed to the remote. It records 30 days of HEAD positions (configurable via \`gc.reflogExpire\`). This 30-day window means you can recover from virtually any local disaster.

### Reflog for Specific Refs

\`\`\`bash
# Reflog for a specific branch (even deleted ones for 30 days):
git reflog show feature/deleted-branch

# Reflog in time-based format:
git reflog --format='%h %gd %gs %s'

# Show reflog with date:
git reflog --date=iso
\`\`\`

---

## \`git stash\` — Temporary Shelving

Stash saves your uncommitted work (staged + unstaged) onto a stack so you can switch context without committing work-in-progress:

\`\`\`bash
# Save current work with a description:
git stash push -m "WIP: auth middleware — need to hotfix prod first"

# List stashes (they persist across branch switches):
git stash list
# stash@{0}: On feature/auth: WIP: auth middleware
# stash@{1}: On main: WIP: refactor database layer

# Apply and remove from stack (most common):
git stash pop                    # applies stash@{0} and removes it

# Apply but keep in stack (to apply to multiple branches):
git stash apply stash@{1}

# Include untracked files in the stash:
git stash push -u -m "WIP including new files"

# Partial stash — interactively pick which changes to stash:
git stash push -p

# Create a branch from a stash (useful when the stash no longer applies cleanly):
git stash branch new-branch stash@{0}
# Creates new-branch at the commit where the stash was created, then applies it

# Drop a stash without applying:
git stash drop stash@{1}

# Clear ALL stashes (DESTRUCTIVE):
git stash clear
\`\`\`

### When Stash vs Commit

Stash is for **minutes to hours** of context-switch. For anything longer, commit. A stash that sits for days is a liability: it may conflict badly when applied. A commit on a branch is safer and easier to recover.

---

## Disaster Recovery Playbook

\`\`\`bash
# Scenario: "git reset --hard lost my work"
# Your changes were committed (even if just to a temp commit):
git reflog                         # find the SHA just before the reset
git reset --hard HEAD@{N}          # restore to that point

# Scenario: "I accidentally deleted a branch"
git reflog show feature/deleted    # shows recent commits on that branch
git switch -c recovered-branch <SHA>

# Scenario: "Bad merge — want to undo the whole merge"
git reset --hard ORIG_HEAD         # Git saves pre-merge state to ORIG_HEAD
# or:
git revert -m 1 <merge-commit-sha> # safe if already pushed

# Scenario: "Bad rebase — everything is a mess"
git reflog                          # find HEAD state before the rebase
# Look for: "rebase (start): checkout origin/main" entry
git reset --hard HEAD@{N}           # go to the commit just before that entry

# Scenario: "Orphaned commits I can't find"
git fsck --lost-found               # finds ALL unreachable objects
ls .git/lost-found/commit/          # orphaned commits listed here
git show <sha>                      # inspect each one

# Scenario: "Force push deleted commits on the remote"
# Check if any teammate still has the old commits locally
# If yes: they can push the old history back (coordinate with them)
# If no: the commits may be gone — only GitHub Support can recover from snapshots
\`\`\`

---

## Under the Hood: Why ORIG_HEAD and MERGE_HEAD Exist

Git stores context for in-progress and just-completed operations:

\`\`\`bash
# ORIG_HEAD: HEAD before the last merge/rebase/reset
cat .git/ORIG_HEAD    # the SHA you came from

# MERGE_HEAD: the branch being merged (only during a merge)
cat .git/MERGE_HEAD   # SHA of the incoming branch

# CHERRY_PICK_HEAD: the commit being cherry-picked
cat .git/CHERRY_PICK_HEAD

# These are cleaned up when the operation completes or is aborted.
# They're why "git reset --hard ORIG_HEAD" always undoes the last big operation.
\`\`\`

> **Tip:** Before any risky operation (rebase, merge, filter-repo), run \`git branch backup-$(date +%Y%m%d)\` to create a branch at current HEAD. If anything goes wrong, that branch still points to where you were. It costs nothing (41 bytes) and has saved many developers. Delete it once the operation succeeds.`,
          interviewQuestions: [
            {
              question: "Explain `git reset --soft`, `--mixed`, and `--hard` with a concrete example of when you'd use each.",
              difficulty: "mid",
              answer: `All three move the branch pointer (HEAD). What differs is how far the change propagates through Git's three trees.

**\`--soft\`:** Move HEAD only. Index and working dir unchanged.
*When:* "I committed too soon — forgot to add a file." \`git reset --soft HEAD~1\` uncommits but keeps everything staged. Add the forgotten file, then commit again.

**\`--mixed\` (default):** Move HEAD + reset index. Working dir unchanged.
*When:* "I committed unrelated changes together." \`git reset HEAD~1\` unstages everything. Now use \`git add -p\` to carefully re-stage only the first logical change, commit, then stage and commit the rest.

**\`--hard\`:** Move HEAD + reset index + reset working dir.
*When:* "This entire experiment failed — throw everything away." \`git reset --hard origin/main\` discards local commits AND uncommitted changes, returning you to remote state.

**Recovery safety net:** All three are recoverable via \`git reflog\` as long as the changes were previously committed. Uncommitted working dir changes lost by \`--hard\` are gone forever.`,
            },
            {
              question: "A critical commit was pushed to `main` 2 weeks ago and 40 developers have pulled it. How do you undo it?",
              difficulty: "senior",
              answer: `**Use \`git revert\`** — never \`git reset\` + force push. Rewriting 40 developers' shared history would break everyone.

\`\`\`
git revert abc123
git push origin main
\`\`\`

If abc123 was a merge commit:
\`\`\`
git revert -m 1 abc123   # -m 1: keep main parent, revert the feature
git push origin main
\`\`\`

**Complications to handle:**
- If later commits depend on abc123's changes, the revert will conflict with them. Resolve carefully — understand the dependency chain.
- The reverted changes may need to be re-introduced later (after a fix): \`git revert <revert-commit-sha>\` un-reverts.
- If abc123 introduced a security vulnerability: also audit logs to see who accessed what, rotate affected credentials, notify security team.

**Why not force push:** All 40 developers would need to \`git reset --hard origin/main\` (losing local work) or face complex divergence. Never worth it for a fix that can be done with revert.`,
            },
            {
              question: "What is the reflog? When would you use it over other recovery methods?",
              difficulty: "mid",
              answer: `The reflog (\`.git/logs/HEAD\`) records every position HEAD has been in — every commit, checkout, merge, rebase, reset. It's Git's local audit log.

\`\`\`
git reflog
# a1b2c3 HEAD@{0}: commit: latest change
# d4e5f6 HEAD@{1}: rebase (finish)
# 7g8h9i HEAD@{2}: reset: moving to HEAD~3
\`\`\`

**Use reflog when:**
- \`git reset --hard\` accidentally discarded commits — find the SHA before the reset and \`git reset --hard HEAD@{N}\`
- A branch was accidentally deleted — find the last commit on that branch and \`git branch recovered <sha>\`
- After a bad rebase — find where HEAD was before the rebase and \`git reset --hard HEAD@{N}\`
- Any time you need to undo a Git operation that changed HEAD

**Limitations:** Reflog is local only (not shared with remotes), and entries expire after 30 days. For remote-side recovery, \`git push --force\` by someone else, check if other developers still have the commits locally.`,
            },
          ],
        },
      ],
      exam: [
        { question: "Your feature branch has 15 WIP commits. Before opening a PR, you want to squash them into 3 logical commits. What is the exact process?", answer: "Run `git rebase -i origin/main` (or `git rebase -i HEAD~15`). In the editor, keep the first commit of each logical group as `pick`, change the rest in each group to `fixup` (discard their messages) or `squash` (merge messages). Use `reword` on the `pick` commits to write clean messages. Save and close. Resolve any conflicts that arise, running `git rebase --continue` after each. Force-push with `git push --force-with-lease`.", difficulty: "mid" },
        { question: "You ran `git reset --hard HEAD~3` to undo three commits but realize you needed the second one. How do you recover it?", answer: "Use `git reflog` to find the SHA of the commit you want to recover. The reflog records every HEAD position, so the three discarded commits will appear as entries shortly before the reset operation. Once you have the SHA, either: `git cherry-pick <sha>` to apply that commit's changes onto the current HEAD, or `git branch recovered-work <sha>` to create a branch preserving that exact state. Commits stay in the reflog for 30 days before garbage collection.", difficulty: "mid" },
        { question: "What is the golden rule of rebasing? A colleague breaks it on a shared branch — what happens to the rest of the team, and how do they recover?", answer: "The golden rule: never rebase commits that have been pushed to a branch others have already pulled from. When broken: the remote gets new commit SHAs (D', E', F'). Other developers still have the old SHAs (D, E, F) locally. Their next `git pull` sees two divergent histories — `git log --graph` shows duplicated commits. Recovery for victims: `git fetch origin && git reset --hard origin/main` (discards any local-only work). Going forward, enforce `--force-with-lease` at minimum and disallow force-pushes to shared branches via branch protection.", difficulty: "senior" },
        { question: "Explain the difference between `git revert` and `git reset` for undoing a commit. When should you use each?", answer: "**`git reset`** moves the branch pointer backward, rewriting history. Use it only for local/unpushed commits. `--soft` keeps changes staged, `--mixed` unstages them, `--hard` discards them entirely. **`git revert`** creates a new commit that applies the inverse diff of the target commit — history is preserved, not rewritten. Use it whenever the commit has been pushed to a shared branch (anyone could have pulled it). Revert is always safe for shared branches; reset on shared branches breaks teammates' history.", difficulty: "mid" },
        { question: "A critical commit was pushed to `main` 2 weeks ago and all 30 developers have pulled it. You need to undo its changes. What is the safest approach?", answer: "Use `git revert <commit-sha>` — this creates a new commit that undoes the changes, leaving all prior history intact. For a merge commit, use `git revert -m 1 <sha>` to specify which parent to keep. Push the revert commit to main normally (no force push needed). All 30 developers will pull the revert commit cleanly on their next `git pull`. Never use `git reset` + force push in this scenario — it would break everyone's local history and force each developer to manually recover.", difficulty: "senior" },
        { question: "What is interactive rebase's `edit` command used for, and walk through splitting one large commit into two smaller ones.", answer: "The `edit` command pauses the rebase at that commit so you can amend it. To split: run `git rebase -i HEAD~N`, mark the target commit as `edit`. When Git pauses there, run `git reset HEAD~1` to uncommit but keep the changes as unstaged. Use `git add -p` to interactively stage only the first logical chunk, then `git commit -m 'Part 1: description'`. Stage the remaining changes and `git commit -m 'Part 2: description'`. Then run `git rebase --continue` to finish replaying the remaining commits.", difficulty: "senior" },
        { question: "Your team's CI runs `git rebase origin/main` before merging. A developer's branch has 20 commits and fails with 15 conflicts. What are your tactical and strategic recommendations?", answer: "**Tactical (fix this PR now):** Squash the 20 commits into 1 first (`git rebase -i origin/main~20`), then rebase onto origin/main — one patch, one set of conflicts to resolve instead of 15. Alternatively, `git merge origin/main` to resolve all conflicts at once and move on. **Strategic (prevent recurrence):** Set a policy that branches are rebased on origin/main daily. Keep PRs small — max 1-2 days of work, < 400 lines changed. Assign module ownership to reduce different developers editing the same files simultaneously. Set a branch age warning in CI.", difficulty: "senior" },
        { question: "You accidentally deleted a local branch that had 5 commits not yet pushed. How do you recover it?", answer: "Run `git reflog` and look for the last commit that was on the deleted branch — it will appear in the log as the tip before the branch was deleted. Note its SHA. Then run `git branch recovered-branch <sha>` to recreate the branch pointing at that commit. All 5 commits are still in the object store (for 30 days). If unsure which SHA, `git reflog --all` shows refs for all branches including recently deleted ones. Also try `git fsck --lost-found` which collects all unreachable objects.", difficulty: "mid" },
        { question: "Explain the three modes of `git stash` — when do you use `stash push`, `stash pop`, and `stash apply`?", answer: "`git stash push -m 'description'` saves all tracked modified files (and optionally untracked with `-u`) onto a stack, restoring the working directory to a clean state. Use it when you need to urgently switch context (e.g., hotfix on another branch) without committing incomplete work. `git stash pop` re-applies the most recent stash and removes it from the stack — use when you're returning to the stashed work and don't need to keep the stash entry. `git stash apply stash@{N}` applies a specific stash but keeps it on the stack — use when you want to apply the same stash multiple times or on multiple branches.", difficulty: "junior" },
        { question: "Before a risky `git rebase -i` that will restructure 10 commits, what safety steps should you take, and how do you recover if the rebase goes wrong?", answer: "**Before:** Create a backup branch: `git branch backup-before-rebase` — costs nothing (41 bytes) and preserves your current state. Note the current HEAD SHA from `git log --oneline -1`. **During:** If a conflict looks complex, `git rebase --abort` immediately returns to the pre-rebase state. **After (if something went wrong):** Check `git reflog` for the state just before the rebase started. Run `git reset --hard HEAD@{N}` where N is the reflog entry prior to the rebase. Or simply: `git reset --hard backup-before-rebase` to restore from the backup branch. Delete the backup branch once the rebase is confirmed good.", difficulty: "mid" },
      ],
    },
  ],
};
