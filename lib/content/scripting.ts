import type { Track } from "./types";

export const scriptingTrack: Track = {
  id: "scripting",
  title: "Scripting & Automation",
  description: "Master Unix utilities, Bash scripting, Python, and Go to automate everything in a DevOps pipeline.",
  icon: "FileCode",
  color: "#a855f7",
  gradient: "track-scripting-gradient",
  level: "intermediate",
  estimatedHours: 14,
  tags: ["bash", "python", "golang", "automation", "unix", "scripting", "devops"],
  modules: [
    // ─────────────────────────────────────────────────────────────
    // MODULE 1 — Unix Utility Mastery
    // ─────────────────────────────────────────────────────────────
    {
      id: "unix-utilities",
      title: "Unix Utility Mastery",
      level: "beginner",
      description: "grep, sed, awk, find, xargs, curl, jq and beyond — chain them into powerful one-liners.",
      lessons: [
        {
          id: "text-processing",
          title: "Text Processing Powerhouse: grep, sed, awk & Friends",
          duration: 55,
          type: "lesson",
          description: "Learn the core Unix text-processing tools and combine them into production-grade pipelines.",
          objectives: [
            "Use grep with extended and Perl-compatible regular expressions",
            "Transform text in-place with sed substitutions and address ranges",
            "Write awk programs that aggregate, format, and report on structured data",
            "Combine sort, uniq, cut, tr, and wc into efficient data pipelines",
          ],
          tags: ["grep", "sed", "awk", "sort", "uniq", "cut", "tr", "wc", "regex", "pipeline"],
          content: `## Text Processing on the Command Line

Unix was built around the philosophy that programs should do one thing well and compose via pipes. The tools in this lesson embody that philosophy — master them and you can process almost any text without writing a full script.

---

## grep — Searching Text

\`grep\` prints every line that matches a pattern.

\`\`\`bash
# Basic match
grep "ERROR" app.log

# Case-insensitive
grep -i "error" app.log

# Invert match (lines that do NOT match)
grep -v "DEBUG" app.log

# Recursive search through a directory tree
grep -r "TODO" ./src/

# Print only filenames that contain a match
grep -rl "password" ./config/

# Count matching lines per file
grep -rc "WARN" ./logs/

# Show 3 lines of context around each match
grep -C 3 "segfault" /var/log/syslog
\`\`\`

### Extended and Perl-Compatible Regex

\`\`\`bash
# -E enables extended regex (alternation, +, ?)
grep -E "ERROR|FATAL|CRITICAL" app.log

# Match lines starting with an IP address
grep -E "^[0-9]{1,3}(\.[0-9]{1,3}){3}" access.log

# -P enables Perl-compatible regex (lookaheads, named groups)
grep -P "(?<=user=)\w+" auth.log

# Extract only the matched part (not the whole line)
grep -oP "duration=\K[0-9]+" app.log
\`\`\`

---

## sed — Stream Editor

\`sed\` applies editing commands to each line of input.

\`\`\`bash
# Substitute first occurrence on each line
sed 's/foo/bar/' file.txt

# Substitute ALL occurrences on each line (global flag)
sed 's/foo/bar/g' file.txt

# Edit the file in-place (macOS needs an extension argument)
sed -i '' 's/localhost/db.prod.internal/g' app.conf   # macOS
sed -i 's/localhost/db.prod.internal/g' app.conf      # Linux

# Delete lines matching a pattern
sed '/^#/d' config.ini        # strip comment lines
sed '/^$/d' file.txt          # strip blank lines

# Print only matching lines (-n suppresses default output)
sed -n '/ERROR/p' app.log

# Address ranges: operate only on lines 10 through 20
sed -n '10,20p' bigfile.txt

# Address range with regex delimiters
sed '/BEGIN/,/END/d' script.sql   # delete between markers

# Insert a line before a match
sed '/^server {/i upstream backend { server 127.0.0.1:8080; }' nginx.conf

# Multi-expression chaining
sed -e 's/WARN/WARNING/g' -e 's/ERR/ERROR/g' app.log
\`\`\`

---

## awk — Programmable Field Processor

\`awk\` splits each line into fields and lets you write full programs.

\`\`\`bash
# Print the 2nd and 5th fields (default separator: whitespace)
awk '{print \$2, \$5}' access.log

# Use a custom field separator
awk -F: '{print \$1}' /etc/passwd         # print all usernames
awk -F, '{print \$3}' data.csv            # 3rd column of CSV

# NR = record number, NF = number of fields
awk 'NR==1 || NR%100==0 {print NR, \$0}' bigfile.txt   # header + every 100th line
awk 'NF > 3' data.txt                                  # lines with more than 3 fields

# BEGIN and END blocks
awk 'BEGIN {total=0} {total += \$4} END {print "Total bytes:", total}' access.log

# Conditional logic
awk '\$9 >= 500 {print \$1, \$7, \$9}' access.log   # HTTP 5xx responses

# printf for formatted output
awk '{printf "%-20s %8.2f MB\n", \$1, \$2/1024}' disk_usage.txt

# Count occurrences of each status code
awk '{codes[\$9]++} END {for (c in codes) print c, codes[c]}' access.log | sort -n

# Real-world: top 10 IPs by request count from nginx log
awk '{print \$1}' access.log | sort | uniq -c | sort -rn | head -10
\`\`\`

---

## sort, uniq, cut, tr, wc

These tools are the glue of any pipeline.

\`\`\`bash
# sort: lexicographic by default
sort names.txt

# Sort numerically, reverse order
sort -rn sizes.txt

# Sort by 3rd field, tab-delimited
sort -t$'\\t' -k3 -rn data.tsv

# uniq: collapses adjacent duplicate lines (always sort first!)
sort words.txt | uniq           # unique lines
sort words.txt | uniq -c        # count duplicates
sort words.txt | uniq -d        # only duplicates
sort words.txt | uniq -u        # only unique (appeared once)

# cut: extract columns
cut -d: -f1,3 /etc/passwd       # username and UID fields
cut -c1-10 file.txt             # first 10 characters of each line

# tr: transliterate characters
echo "hello world" | tr 'a-z' 'A-Z'        # uppercase
echo "path/to/file" | tr '/' '.'            # replace / with .
cat file.txt | tr -d '\\r'                   # strip Windows line endings
cat file.txt | tr -s ' '                    # squeeze repeated spaces to one

# wc: word/line/byte counts
wc -l access.log          # line count
wc -w essay.txt           # word count
wc -c binary.dat          # byte count
\`\`\`

---

## Combining It All — Real Pipeline Examples

\`\`\`bash
# Find the 5 slowest API endpoints from a log where field 7 is path and field 10 is ms
awk '{print \$7, \$10}' api.log | sort -k2 -rn | head -5

# Count unique 4xx errors by path
grep -E ' 4[0-9]{2} ' access.log \\
  | awk '{print \$7}' \\
  | sort | uniq -c | sort -rn | head -20

# Extract all email addresses from a directory of files
grep -rhoP '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' ./docs/ \\
  | sort -u

# Replace version string in all YAML files
find . -name "*.yaml" -exec sed -i 's/image: myapp:1\\.0/image: myapp:2.0/g' {} +

# Summarize disk usage of directories, sorted by size
du -sh /var/log/* | sort -h | tail -10

# Parse CSV: sum the 4th column, skip header
tail -n +2 sales.csv | awk -F, '{sum += \$4} END {printf "Total: \$%.2f\\n", sum}'
\`\`\`

> **Practice tip:** Pipe \`dmesg\`, \`/var/log/syslog\`, or any application log through these tools. Real logs beat toy examples every time.`,
          interviewQuestions: [
            {
              question: "How would you find all lines in a log file that do NOT contain the word 'INFO' or 'DEBUG', then count how many are left?",
              difficulty: "junior",
              answer: `Use grep with the -v flag to invert the match and chain with wc:

\`\`\`bash
grep -Ev "INFO|DEBUG" app.log | wc -l
\`\`\`

-E enables extended regex for alternation with |. -v inverts the match. wc -l counts the resulting lines. You could also do it in a single awk command: awk '!/INFO|DEBUG/ {count++} END {print count}' app.log`,
            },
            {
              question: "You have a CSV with a header row. How do you sum the values in the 3rd column using awk, skipping the header?",
              difficulty: "junior",
              answer: `\`\`\`bash
awk -F, 'NR > 1 {sum += \$3} END {print sum}' data.csv
\`\`\`

NR is the current record number. NR > 1 skips line 1 (header). The END block runs after all input is processed. -F, sets the field separator to a comma.`,
            },
            {
              question: "Explain the difference between sed 's/foo/bar/' and sed 's/foo/bar/g'. When does it matter?",
              difficulty: "junior",
              answer: `Without the g flag, sed replaces only the FIRST occurrence of 'foo' on each line. With g (global), it replaces ALL occurrences on each line.

It matters whenever a pattern can appear more than once per line. For example: replacing all semicolons in a SQL dump, removing all duplicate spaces, or substituting multiple occurrences of a config key on the same line all require /g. Forgetting /g is a very common bug when doing text transformations.`,
            },
            {
              question: "How do you in-place edit all .conf files under /etc/myapp to replace 'staging.db' with 'prod.db'?",
              difficulty: "mid",
              answer: `\`\`\`bash
find /etc/myapp -name "*.conf" -exec sed -i 's/staging\\.db/prod\\.db/g' {} +
\`\`\`

The dot in the hostname is escaped (\\.) to match a literal dot rather than any character. -exec ... {} + batches files into as few sed invocations as possible (more efficient than {} \\; which spawns one process per file). On macOS, sed -i requires an empty string argument: sed -i '' ...`,
            },
            {
              question: "Describe a pipeline to find the top 10 most-requested URLs in an nginx access log.",
              difficulty: "mid",
              answer: `\`\`\`bash
awk '{print \$7}' access.log | sort | uniq -c | sort -rn | head -10
\`\`\`

Explanation:
1. awk '{print \$7}' — extracts the 7th field (the request path) from each log line
2. sort — sorts paths alphabetically so identical paths are adjacent
3. uniq -c — collapses consecutive duplicates and prefixes each with a count
4. sort -rn — sorts numerically in reverse (highest count first)
5. head -10 — shows only the top 10

A common optimization for very large logs: use awk to both extract and count in one pass, avoiding the sort: awk '{c[\$7]++} END {for(u in c) print c[u], u}' access.log | sort -rn | head -10`,
            },
          ],
          quizQuestions: [
            {
              question: "A production server writes logs with both ERROR and error (mixed case). What single grep flag handles this?",
              answer: "grep -i makes the search case-insensitive, matching ERROR, error, Error, and all other capitalizations.",
              type: "scenario",
              difficulty: "junior",
            },
            {
              question: "You run `sort data.txt | uniq -c` and notice duplicates are NOT collapsed. What is the most likely cause?",
              answer: "uniq only collapses ADJACENT duplicate lines. If sort ran lexicographically but lines differ by trailing whitespace or invisible characters, they won't be considered identical. Check for \\r (Windows line endings) with cat -A or use tr -d '\\r' before sorting.",
              type: "scenario",
              difficulty: "mid",
            },
            {
              question: "Your awk command prints \$2 but you get an empty column. The file uses commas, not spaces. What is missing?",
              answer: "The field separator. Add -F, to tell awk that fields are comma-delimited: awk -F, '{print \$2}' file.csv",
              type: "scenario",
              difficulty: "junior",
            },
            {
              question: "Use grep, awk, sort, and uniq to find the top 5 source IPs with HTTP 5xx errors in an nginx access log.",
              answer: "grep -E ' 5[0-9]{2} ' access.log | awk '{print \$1}' | sort | uniq -c | sort -rn | head -5",
              type: "hands-on",
              hint: "The HTTP status code is field \$9 in standard nginx log format. Filter with grep first, then extract field \$1 (IP).",
            },
            {
              question: "Write a sed one-liner to delete all blank lines and comment lines (starting with #) from a config file in-place.",
              answer: "sed -i '/^$/d; /^#/d' config.ini — On macOS: sed -i '' '/^$/d; /^#/d' config.ini",
              type: "hands-on",
              hint: "Use two -e expressions or semicolon-separated commands. The /^$/d deletes empty lines, /^#/d deletes comment lines.",
            },
            {
              question: "Write an awk one-liner to print a report of the count and total bytes for each HTTP status code from an nginx log (status=\$9, bytes=\$10).",
              answer: "awk '{count[\$9]++; bytes[\$9]+=\$10} END {for(s in count) printf \"%-5s %6d requests  %12d bytes\\n\", s, count[s], bytes[s]}' access.log | sort",
              type: "hands-on",
              hint: "Use associative arrays indexed by status code in the main block, then iterate over them in the END block.",
            },
          ],
        },
        {
          id: "file-system-utilities",
          title: "File System Utilities: find, xargs, tar, rsync, curl & jq",
          duration: 60,
          type: "lesson",
          description: "Automate file operations, archives, synchronization, and API interactions with essential Unix tools.",
          objectives: [
            "Construct complex find expressions with -exec and -mtime predicates",
            "Use xargs to build efficient command pipelines from find output",
            "Create, extract, and inspect archives with tar",
            "Synchronize directories with rsync including --delete and --dry-run",
            "Make HTTP requests with curl and parse JSON/YAML with jq and yq",
          ],
          tags: ["find", "xargs", "tar", "rsync", "curl", "jq", "yq", "json", "yaml"],
          content: `## File System & Remote Utilities

These tools operate on files, archives, network resources, and structured data. In DevOps, they appear in every backup script, deployment pipeline, and API integration.

---

## find — Deep File Search

\`find\` traverses directory trees and evaluates expressions against each file.

\`\`\`bash
# Basic: find all .log files from the current directory
find . -name "*.log"

# By type: f=file, d=directory, l=symlink
find /var -type f -name "*.conf"
find /tmp -type d -empty          # empty directories

# By size
find /var/log -type f -size +100M          # larger than 100 MB
find /home -type f -size -10k              # smaller than 10 KB

# By modification time (-mtime uses days, -mmin uses minutes)
find /tmp -mtime +7                        # not modified in 7+ days
find /var/log -mmin -60                    # modified in last 60 minutes

# Combine predicates (AND is default, -o for OR, ! for NOT)
find . -name "*.py" -not -path "*/venv/*"  # Python files outside venv
find . \\( -name "*.jpg" -o -name "*.png" \\) -size +1M

# -exec: run a command on each found file
find . -name "*.tmp" -exec rm {} \\;        # delete each tmp file
find . -name "*.sh" -exec chmod +x {} +    # batch chmod (+ is faster than \\;)

# Print0 + xargs -0: safe handling of spaces in filenames
find . -name "*.log" -print0 | xargs -0 gzip
\`\`\`

---

## xargs — Build Commands from Input

\`xargs\` takes stdin and passes it as arguments to a command.

\`\`\`bash
# Basic usage
echo "file1.txt file2.txt" | xargs rm

# -I{} for placeholder substitution
find . -name "*.bak" | xargs -I{} mv {} {}.old

# Parallel execution with -P
find . -name "*.jpg" | xargs -P4 -I{} convert {} -resize 800x600 {}_resized.jpg

# Limit args per invocation with -n
cat hosts.txt | xargs -n1 ping -c1     # ping each host separately

# Combine with grep for project-wide search
find . -name "*.go" | xargs grep -l "TODO"

# Dry run: see what would happen
find /tmp -mtime +30 -print | xargs -I{} echo "Would delete: {}"
\`\`\`

---

## tar — Archives

\`tar\` creates and extracts archive files. The flags are classic: **c**reate, e**x**tract, **t**est/list, **v**erbose, **f**ile, **z** (gzip), **j** (bzip2), **J** (xz).

\`\`\`bash
# Create a gzipped archive
tar -czf backup.tar.gz /var/www/html/

# Create with exclusions
tar -czf app.tar.gz ./app/ --exclude="./app/node_modules" --exclude="./app/.git"

# Extract to a specific directory
tar -xzf backup.tar.gz -C /restore/

# List contents without extracting
tar -tzf backup.tar.gz | head -20

# Extract a single file
tar -xzf backup.tar.gz ./app/config/settings.py

# Create a bzip2 archive (better compression, slower)
tar -cjf archive.tar.bz2 ./data/

# Incremental backup: only files newer than a snapshot
tar -czf incremental.tar.gz --newer-mtime="2024-01-01" /var/data/
\`\`\`

---

## rsync — Smart File Synchronization

\`rsync\` transfers only changed bytes — far more efficient than \`cp\` or \`scp\` for large directories.

\`\`\`bash
# Basic sync: src to dest (trailing slash on src matters!)
rsync -av /src/dir/ /dest/dir/        # sync contents of dir/
rsync -av /src/dir  /dest/            # sync the dir itself into dest/

# Sync to remote over SSH
rsync -avz -e ssh /local/app/ user@server:/var/www/app/

# --delete: remove files in dest that don't exist in src
rsync -av --delete /src/ /dest/

# --dry-run: show what WOULD be transferred without doing it
rsync -av --dry-run --delete /src/ /dest/

# Exclude patterns
rsync -av --exclude="*.log" --exclude="node_modules/" /src/ /dest/

# Preserve all attributes, useful for system backups
rsync -aAXHv /home/ /backup/home/

# Show progress for large transfers
rsync -av --progress large_file.iso user@server:/storage/

# Bandwidth limit (100 KB/s) to avoid saturating the network
rsync -av --bwlimit=100 /data/ /backup/
\`\`\`

---

## curl — HTTP Swiss Army Knife

\`\`\`bash
# GET request
curl https://api.example.com/users

# Follow redirects, show final URL
curl -L -w "\\nFinal URL: %{url_effective}\\n" https://short.url/abc

# Save to file
curl -o output.json https://api.example.com/data

# Custom headers and authentication
curl -H "Authorization: Bearer \$TOKEN" \\
     -H "Content-Type: application/json" \\
     https://api.example.com/protected

# POST JSON body
curl -X POST \\
     -H "Content-Type: application/json" \\
     -d '{"name":"deploy","status":"started"}' \\
     https://api.example.com/events

# POST form data
curl -X POST -d "username=admin&password=secret" https://app/login

# Show response headers only
curl -I https://example.com

# Fail on HTTP error codes (useful in scripts)
curl -f -s https://api.example.com/health || echo "Health check failed"

# Test TLS cert without trusting it (dangerous but useful for debugging)
curl -k https://self-signed.example.com
\`\`\`

---

## jq — JSON Processor

\`jq\` is a lightweight JSON query language. Every DevOps engineer needs it for parsing API responses.

\`\`\`bash
# Pretty-print JSON
curl -s https://api.example.com/users | jq '.'

# Extract a single field
echo '{"name":"alice","age":30}' | jq '.name'

# Iterate over an array
curl -s https://api.example.com/pods | jq '.[] | .metadata.name'

# Select with a filter
curl -s https://api.example.com/pods | jq '.[] | select(.status.phase == "Failed")'

# Extract multiple fields and build a new object
kubectl get pods -o json | jq '.items[] | {name: .metadata.name, status: .status.phase}'

# Map over an array
echo '[{"v":"1.0"},{"v":"2.0"}]' | jq '[.[] | .v]'

# Count elements
kubectl get pods -o json | jq '.items | length'

# Get a value nested inside an array by index
echo '{"servers":[{"host":"a"},{"host":"b"}]}' | jq '.servers[1].host'

# Real-world: parse AWS EC2 describe-instances
aws ec2 describe-instances \\
  | jq '.Reservations[].Instances[] | {id: .InstanceId, ip: .PrivateIpAddress, state: .State.Name}'
\`\`\`

---

## yq — YAML Processor

\`yq\` brings jq-like querying to YAML files — essential for Kubernetes manifests and Helm values.

\`\`\`bash
# Read a value
yq '.spec.replicas' deployment.yaml

# Update a value in-place
yq -i '.spec.replicas = 3' deployment.yaml

# Read from multiple files
yq '.metadata.name' *.yaml

# Convert YAML to JSON
yq -o=json '.' values.yaml

# Merge YAML files
yq '. * load("overrides.yaml")' base.yaml

# Extract all container image names from a Kubernetes deployment
yq '.spec.template.spec.containers[].image' deployment.yaml
\`\`\`

---

## Putting It Together

\`\`\`bash
# Find all Kubernetes YAML files not updated in 30 days and archive them
find ./manifests -name "*.yaml" -mtime +30 -print0 \\
  | tar -czf old_manifests_\$(date +%Y%m%d).tar.gz --null -T -

# Query all running pod names via kubectl + jq, then curl a health endpoint for each
kubectl get pods -o json \\
  | jq -r '.items[] | select(.status.phase=="Running") | .metadata.name' \\
  | xargs -I{} curl -sf http://{}.pod.cluster.local/healthz

# Download, verify, and extract a release tarball
VERSION="2.3.1"
curl -Lo /tmp/app.tar.gz "https://releases.example.com/app-\${VERSION}.tar.gz"
curl -Lo /tmp/app.tar.gz.sha256 "https://releases.example.com/app-\${VERSION}.tar.gz.sha256"
sha256sum -c /tmp/app.tar.gz.sha256 && tar -xzf /tmp/app.tar.gz -C /opt/app/
\`\`\``,
          interviewQuestions: [
            {
              question: "How do you delete all files in /tmp older than 7 days without deleting directories?",
              difficulty: "junior",
              answer: `\`\`\`bash
find /tmp -type f -mtime +7 -delete
\`\`\`

-type f restricts to regular files only (not directories). -mtime +7 matches files whose last modification time is more than 7 days ago. -delete is atomic and more efficient than -exec rm {} \\; because it avoids spawning a shell for each file. Always test with -print first instead of -delete to verify what will be removed.`,
            },
            {
              question: "Explain the difference between rsync /src/dir/ /dest/ and rsync /src/dir /dest/.",
              difficulty: "mid",
              answer: `The trailing slash on the source path is critical.

- rsync /src/dir/ /dest/ — synchronizes the CONTENTS of dir/ into /dest/. Files in dir/ appear directly in /dest/.
- rsync /src/dir /dest/ — synchronizes the directory ITSELF. Creates /dest/dir/ and places contents there.

This is one of rsync's most common gotchas. A mnemonic: "trailing slash means merge the contents; no trailing slash means copy the container." Always use --dry-run first when unsure.`,
            },
            {
              question: "How would you use jq to extract only the names of pods in a 'Failed' state from kubectl get pods -o json output?",
              difficulty: "mid",
              answer: `\`\`\`bash
kubectl get pods -o json | jq -r '.items[] | select(.status.phase == "Failed") | .metadata.name'
\`\`\`

.items[] iterates the pod array. select() filters to only objects matching the condition. .metadata.name extracts the pod name. -r outputs raw strings (no surrounding quotes), which is important when piping the output to other commands.`,
            },
            {
              question: "Why is find -print0 paired with xargs -0, and when is this combination necessary?",
              difficulty: "mid",
              answer: `Standard Unix tools delimit records with newlines. File names can legally contain spaces and even newlines, which breaks line-based parsing.

-print0 makes find output filenames separated by null bytes (\\0) instead of newlines. xargs -0 reads null-delimited input instead of newline-delimited. Together they handle any legal filename — including those with spaces, tabs, newlines, or special characters.

This is necessary whenever filenames might contain spaces (user-uploaded content, macOS files like "My Document.pdf", etc.). For filenames guaranteed to be simple alphanumeric strings, the plain combination find | xargs works, but -print0 / -0 is a safe default habit.`,
            },
            {
              question: "What does rsync --delete do and what is a safe way to use it in automation?",
              difficulty: "senior",
              answer: `--delete removes files from the destination that do not exist in the source. This makes the destination an exact mirror of the source. Without it, files deleted from the source persist in the destination indefinitely.

Safe usage patterns:
1. Always run --dry-run first to preview deletions: rsync -av --dry-run --delete /src/ /dest/
2. Use --backup and --backup-dir to move deleted files to a dated backup directory rather than immediately removing them: rsync -av --delete --backup --backup-dir=/backup/\$(date +%Y%m%d) /src/ /dest/
3. Combine with --max-delete=N to abort if more than N files would be deleted — protects against accidentally pointing rsync at an empty source
4. Log all operations: rsync -av --delete /src/ /dest/ >> /var/log/rsync.log 2>&1`,
            },
          ],
          quizQuestions: [
            {
              question: "You run find . -name '*.log' -exec gzip {} \\; on 10,000 files. It is very slow. What change makes it faster?",
              answer: "Replace \\; with + to batch files: find . -name '*.log' -exec gzip {} +. The \\; variant spawns one gzip process per file (10,000 processes). The + variant passes as many files as possible per invocation. Alternatively, use xargs: find . -name '*.log' -print0 | xargs -0 -P4 gzip for parallel compression.",
              type: "scenario",
              difficulty: "mid",
            },
            {
              question: "You run rsync -av --delete /backup/ /prod/ instead of rsync -av --delete /prod/ /backup/ and both directories have data. What happens?",
              answer: "The source and destination are swapped. rsync will copy files from /backup/ to /prod/ and delete anything in /prod/ that is not in /backup/. This would destroy production data. Always verify src and dest order, and use --dry-run before any destructive rsync operation.",
              type: "scenario",
              difficulty: "mid",
            },
            {
              question: "curl -f returns exit code 22 in your deploy script, causing it to abort. What does exit code 22 mean?",
              answer: "Exit code 22 means curl received an HTTP error response (4xx or 5xx). The -f / --fail flag tells curl to treat HTTP errors as failures and exit with code 22 rather than outputting the error body. This is intentional for CI/CD scripts — it means your health check or API call returned an error status.",
              type: "scenario",
              difficulty: "junior",
            },
            {
              question: "Use find and tar to create a timestamped archive of all .conf files under /etc that were modified in the last 24 hours.",
              answer: "find /etc -name '*.conf' -mtime -1 -print0 | tar -czf /backup/conf_\$(date +%Y%m%d_%H%M%S).tar.gz --null -T -",
              type: "hands-on",
              hint: "Use find -print0 to output null-delimited filenames, then pass them to tar with --null -T - to read the file list from stdin.",
            },
            {
              question: "Write a curl + jq pipeline to fetch https://jsonplaceholder.typicode.com/users and print only the name and email of each user.",
              answer: "curl -s https://jsonplaceholder.typicode.com/users | jq '.[] | {name, email}'",
              type: "hands-on",
              hint: "Use jq '.[] | ...' to iterate the array. You can build a new object with {name, email} shorthand.",
            },
            {
              question: "Use rsync to perform a dry run that shows which files would be deleted when syncing /src/ to /dest/, without actually making any changes.",
              answer: "rsync -av --delete --dry-run /src/ /dest/",
              type: "hands-on",
              hint: "--dry-run (or -n) makes rsync print what it would do without making any changes. Always combine with --delete when testing mirror operations.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // MODULE 2 — Bash Scripting Zero to Hero
    // ─────────────────────────────────────────────────────────────
    {
      id: "bash-scripting",
      title: "Bash Scripting Zero to Hero",
      level: "intermediate",
      description: "From variables to error-safe scripts with traps, heredocs, and parallel execution.",
      lessons: [
        {
          id: "bash-fundamentals",
          title: "Bash Fundamentals: Variables, Control Flow & Functions",
          duration: 65,
          type: "lesson",
          description: "Build solid Bash foundations — variables, arrays, arithmetic, conditionals, loops, and functions.",
          objectives: [
            "Declare and use variables, arrays, and arithmetic in Bash",
            "Write conditionals with if/elif/else and the [[ ]] test syntax",
            "Implement for, while, and until loops",
            "Define functions with positional parameters and return values",
            "Interpret special variables: \$?, \$\$, \$!, \$@, \$*",
          ],
          tags: ["bash", "variables", "arrays", "loops", "functions", "conditionals", "exit-codes"],
          content: `## Bash Scripting Fundamentals

Every Bash script should start with a shebang and a description:

\`\`\`bash
#!/usr/bin/env bash
# deploy.sh — Deploy application to target environment
# Usage: ./deploy.sh <env> <version>
\`\`\`

Using \`#!/usr/bin/env bash\` rather than \`#!/bin/bash\` is more portable — it finds bash in your PATH regardless of installation location.

---

## Variables

\`\`\`bash
# Assignment: no spaces around =
NAME="production"
PORT=8080
TIMESTAMP=\$(date +%Y%m%d_%H%M%S)   # command substitution

# Referencing: use \${} for clarity
echo "Deploying to \${NAME} on port \${PORT}"

# Default values
ENV=\${1:-"staging"}                     # use first arg, default to staging
DB_HOST=\${DB_HOST:-"localhost"}          # use env var, default to localhost

# Read-only variables
readonly LOG_DIR="/var/log/myapp"

# Environment variables (export to child processes)
export APP_ENV="production"
\`\`\`

### Arrays

\`\`\`bash
# Indexed array
SERVERS=("web01" "web02" "web03")
echo "\${SERVERS[0]}"           # first element: web01
echo "\${SERVERS[@]}"           # all elements
echo "\${#SERVERS[@]}"          # count: 3

# Append to array
SERVERS+=("web04")

# Iterate
for server in "\${SERVERS[@]}"; do
  echo "Checking \$server"
done

# Slice: elements 1 and 2
echo "\${SERVERS[@]:1:2}"       # web02 web03

# Associative array (Bash 4+)
declare -A CONFIG
CONFIG["host"]="db.prod.internal"
CONFIG["port"]="5432"
echo "\${CONFIG[host]}"
\`\`\`

---

## Arithmetic

\`\`\`bash
# (( )) for integer arithmetic
COUNT=0
((COUNT++))
((COUNT += 10))
echo \$COUNT    # 11

# Arithmetic in conditions
if (( PORT > 1024 )); then
  echo "Unprivileged port"
fi

# \$(( )) for arithmetic expansion
TOTAL=\$((100 * 1024 * 1024))   # 104857600

# bc for floating-point
AVG=\$(echo "scale=2; \$TOTAL / 3" | bc)
echo "\$AVG"
\`\`\`

---

## Conditionals

\`\`\`bash
# [[ ]] is the modern Bash test — prefer it over [ ] or test
if [[ "\$ENV" == "production" ]]; then
  echo "Production deployment"
elif [[ "\$ENV" == "staging" ]]; then
  echo "Staging deployment"
else
  echo "Unknown environment: \$ENV"
  exit 1
fi

# File tests
if [[ -f "/etc/myapp/config.yaml" ]]; then echo "Config exists"; fi
if [[ -d "/var/log/myapp" ]]; then echo "Log dir exists"; fi
if [[ -r "\$FILE" ]]; then echo "File is readable"; fi
if [[ -s "\$FILE" ]]; then echo "File is not empty"; fi
if [[ -x "\$SCRIPT" ]]; then echo "Script is executable"; fi

# String tests
if [[ -z "\$VAR" ]]; then echo "Empty string"; fi
if [[ -n "\$VAR" ]]; then echo "Non-empty string"; fi
if [[ "\$STR" =~ ^[0-9]+\$ ]]; then echo "Is a number"; fi   # regex match

# Compound conditions
if [[ "\$ENV" == "prod" && "\$USER" == "deploy" ]]; then
  echo "Authorized production deploy"
fi
\`\`\`

---

## Loops

\`\`\`bash
# for loop over a list
for ENV in dev staging prod; do
  echo "Processing \$ENV"
done

# for loop over an array
for SERVER in "\${SERVERS[@]}"; do
  ssh "\$SERVER" "sudo systemctl restart myapp"
done

# C-style for loop
for ((i=1; i<=5; i++)); do
  echo "Attempt \$i"
done

# while loop
RETRIES=0
while ! curl -sf http://localhost:8080/health; do
  ((RETRIES++))
  if (( RETRIES >= 5 )); then
    echo "Service not healthy after 5 attempts"
    exit 1
  fi
  sleep 2
done

# until loop (opposite of while)
until [[ -f "/tmp/ready.flag" ]]; do
  echo "Waiting for ready flag..."
  sleep 5
done

# Read lines from a file
while IFS= read -r line; do
  echo "Processing: \$line"
done < hosts.txt

# Loop with index
FILES=("a.txt" "b.txt" "c.txt")
for i in "\${!FILES[@]}"; do
  echo "\$i: \${FILES[i]}"
done
\`\`\`

---

## Functions

\`\`\`bash
# Define a function
log() {
  local level="\$1"
  local message="\$2"
  echo "[\$(date '+%Y-%m-%d %H:%M:%S')] [\$level] \$message" | tee -a /var/log/deploy.log
}

deploy_service() {
  local service="\$1"
  local version="\$2"

  log "INFO" "Deploying \$service version \$version"

  if ! docker pull "myrepo/\${service}:\${version}"; then
    log "ERROR" "Failed to pull image"
    return 1    # return non-zero to signal failure
  fi

  docker stop "\$service" 2>/dev/null || true
  docker run -d --name "\$service" "myrepo/\${service}:\${version}"
  log "INFO" "Deployed \$service \$version successfully"
}

# Call the function
deploy_service "api" "v2.3.1" || exit 1

# local variables are scoped to the function
check_port() {
  local port="\$1"
  local timeout="\${2:-5}"
  nc -z -w"\$timeout" localhost "\$port"
  return \$?   # propagate nc exit code
}
\`\`\`

---

## Special Variables

| Variable | Meaning |
|---|---|
| \`\$0\` | Script name |
| \`\$1\`–\`\$9\` | Positional parameters |
| \`\$@\` | All positional parameters (each quoted separately) |
| \`\$*\` | All positional parameters (as one string) |
| \`\$#\` | Number of positional parameters |
| \`\$?\` | Exit code of the last command |
| \`\$\$\` | PID of the current shell |
| \`\$!\` | PID of the last background process |

\`\`\`bash
#!/usr/bin/env bash
echo "Script: \$0"
echo "Args: \$#"
echo "First: \$1"

# \$@ vs \$*: always use "\$@" to preserve individual arguments
for arg in "\$@"; do
  echo "Arg: \$arg"
done

# Check exit code immediately
cp source.txt dest.txt
if [[ \$? -ne 0 ]]; then
  echo "Copy failed"
  exit 1
fi
# Better: use || directly
cp source.txt dest.txt || { echo "Copy failed"; exit 1; }

# Get PID of background process
sleep 30 &
BG_PID=\$!
echo "Background process PID: \$BG_PID"
wait \$BG_PID   # wait for it to finish
\`\`\`

---

## Exit Codes

By convention: **0 = success, non-zero = failure**. Document your exit codes.

\`\`\`bash
readonly E_USAGE=2
readonly E_DEPS=3
readonly E_NETWORK=4

require_command() {
  if ! command -v "\$1" &>/dev/null; then
    echo "ERROR: Required command '\$1' not found" >&2
    exit \$E_DEPS
  fi
}

require_command docker
require_command kubectl
require_command jq

echo "All dependencies satisfied"
\`\`\``,
          interviewQuestions: [
            {
              question: "What is the difference between \$@ and \$* in Bash? Give an example where it matters.",
              difficulty: "mid",
              answer: `When quoted:
- "\$@" expands to each positional parameter as a separate word: "\$1" "\$2" "\$3"
- "\$*" expands to all parameters as a single word: "\$1 \$2 \$3" (joined by the first char of IFS)

It matters when arguments contain spaces:

\`\`\`bash
args() { for a in "\$@"; do echo "[\$a]"; done; }
args "hello world" "foo"
# [hello world]
# [foo]

args2() { for a in "\$*"; do echo "[\$a]"; done; }
args2 "hello world" "foo"
# [hello world foo]   <-- single iteration, args merged
\`\`\`

Always use "\$@" when forwarding arguments to preserve them individually.`,
            },
            {
              question: "Why should you use [[ ]] instead of [ ] for conditionals in Bash scripts?",
              difficulty: "junior",
              answer: `[[ ]] is a Bash keyword (not a command), offering several advantages over [ ] (which is a synonym for the test command):

1. No word splitting or glob expansion inside [[ ]], so unquoted variables are safe: [[ \$file == *.txt ]] works without quoting \$file
2. Supports =~ for regex matching: [[ "\$str" =~ ^[0-9]+ ]]
3. Supports && and || directly inside: [[ -f file && -r file ]]
4. No need to escape comparison operators like < and >
5. Short-circuit evaluation

[ ] has POSIX portability if you're writing sh scripts, but for Bash-specific scripts [[ ]] is always preferred.`,
            },
            {
              question: "How do you define a variable that is local to a function and why does it matter?",
              difficulty: "junior",
              answer: `Use the \`local\` keyword:

\`\`\`bash
myfunc() {
  local count=0
  ((count++))
  echo "\$count"   # prints 1
}
myfunc
echo "\$count"     # prints nothing — count is unset outside
\`\`\`

Without \`local\`, Bash variables are global by default. A function that sets \`i\` as a loop counter without \`local\` will clobber an \`i\` variable in the calling scope. This causes subtle bugs in complex scripts. Always declare loop variables and temporary values with \`local\` inside functions.`,
            },
            {
              question: "What is the difference between exit and return in Bash, and when do you use each?",
              difficulty: "mid",
              answer: `- \`return [N]\` exits a function and sets \$? to N. It does not exit the script. Use it to signal success (0) or failure (non-zero) from a function.
- \`exit [N]\` terminates the entire shell process (script) with exit code N.

\`\`\`bash
validate() {
  if [[ -z "\$1" ]]; then
    return 1  # function failed, script continues
  fi
  return 0
}

if ! validate "\$INPUT"; then
  echo "Validation failed" >&2
  exit 2  # terminate the script with code 2
fi
\`\`\`

A common mistake is using \`exit\` inside a function expecting the script to continue — it terminates everything. Another mistake is forgetting that calling a function with \$(func) runs it in a subshell, so \`exit\` inside only exits the subshell, not the parent script.`,
            },
            {
              question: "Explain the difference between \`command -v\`, \`which\`, and \`type\` for checking if a command exists.",
              difficulty: "senior",
              answer: `- \`command -v name\` — POSIX-standard. Prints the path or function definition. Returns 0 if the command exists, 1 if not. Works for aliases, functions, builtins, and executables. Preferred for scripts.
- \`which name\` — searches only PATH for executables. Does NOT find shell functions, aliases, or builtins. Not POSIX; behavior varies by system (some versions show all matches, some only the first).
- \`type name\` — Bash builtin. Describes what the shell would execute (function, builtin, alias, file). type -P finds only files (like which). Good for interactive inspection.

For scripts: always use \`command -v name &>/dev/null\` to check dependency existence. It's portable and handles all command types.`,
            },
          ],
          quizQuestions: [
            {
              question: "You assign MY_VAR = 'hello' with spaces around the equals sign. What happens and why?",
              answer: "Bash interprets this as running a command named MY_VAR with arguments = and hello. Assignment in Bash requires no spaces: MY_VAR='hello'. This is one of the most common beginner errors.",
              type: "scenario",
              difficulty: "junior",
            },
            {
              question: "Your loop `for server in \${SERVERS}` only processes the first element even though SERVERS has 5 items. Why?",
              answer: "Arrays must be expanded with \${SERVERS[@]} not \${SERVERS}. The latter expands to only the first element (index 0). The correct form is: for server in \"\${SERVERS[@]}\"; do ... done — with double quotes to handle element values that contain spaces.",
              type: "scenario",
              difficulty: "mid",
            },
            {
              question: "You call a function with result=\$(my_func) but exit codes from inside the function don't terminate your script. Why?",
              answer: "Command substitution \$() runs in a subshell. An exit inside the subshell terminates the subshell, not the parent script. Even with set -e enabled, the parent script continues after \$(my_func) completes. Check the return value with if ! result=\$(my_func); then ... fi instead.",
              type: "scenario",
              difficulty: "senior",
            },
            {
              question: "Write a Bash function that accepts a hostname and port, checks if the port is open (using nc or /dev/tcp), and returns 0 if open, 1 if not.",
              answer: "check_port() { local host=\"\$1\" port=\"\$2\" timeout=\"\${3:-5}\"; if timeout \"\$timeout\" bash -c \"</dev/tcp/\${host}/\${port}\" 2>/dev/null; then return 0; else return 1; fi; }",
              type: "hands-on",
              hint: "Bash has a built-in /dev/tcp/host/port pseudo-device. You can also use nc -z -w5 host port. Wrap in a function with local variables.",
            },
            {
              question: "Write a Bash script section that reads a list of servers from servers.txt, pings each one, and prints ALIVE or DOWN for each.",
              answer: "while IFS= read -r server; do if ping -c1 -W2 \"\$server\" &>/dev/null; then echo \"\$server: ALIVE\"; else echo \"\$server: DOWN\"; fi; done < servers.txt",
              type: "hands-on",
              hint: "Use while IFS= read -r to safely read each line. Redirect stdout and stderr of ping to /dev/null and check \$? via if.",
            },
            {
              question: "Write a for loop that iterates from 1 to 10 and prints only even numbers.",
              answer: "for ((i=1; i<=10; i++)); do if (( i % 2 == 0 )); then echo \"\$i\"; fi; done",
              type: "hands-on",
              hint: "Use a C-style for loop with (( )) arithmetic. Check evenness with the modulo operator: (( i % 2 == 0 )).",
            },
          ],
        },
        {
          id: "bash-advanced",
          title: "Bash Advanced: Error Handling, Traps & Parallel Execution",
          duration: 70,
          type: "lesson",
          description: "Write production-quality Bash scripts with proper error handling, cleanup traps, heredocs, and parallelism.",
          objectives: [
            "Apply set -euo pipefail for fail-fast script behaviour",
            "Register trap handlers for cleanup and signal handling",
            "Use heredocs and process substitution for clean code",
            "Perform string manipulation without external tools",
            "Run tasks in parallel with background jobs and wait",
          ],
          tags: ["bash", "error-handling", "trap", "heredoc", "process-substitution", "parallel", "signals", "set-e"],
          content: `## Writing Production-Grade Bash

A script that half-succeeds and leaves the system in an inconsistent state is worse than one that fails cleanly. This lesson covers techniques that make scripts robust.

---

## Fail-Fast: set -euo pipefail

Every production Bash script should start with:

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
\`\`\`

What each flag does:

| Flag | Effect |
|---|---|
| \`-e\` | Exit immediately when any command returns non-zero |
| \`-u\` | Treat unset variables as errors |
| \`-o pipefail\` | A pipeline fails if ANY command in it fails (not just the last) |

\`\`\`bash
# Without pipefail, this returns 0 (grep exit code) even if cat fails
cat nonexistent.txt | grep "pattern"   # exit 0 — BUG

# With pipefail, the pipe returns the first non-zero exit code
set -o pipefail
cat nonexistent.txt | grep "pattern"   # exit 1 — correct
\`\`\`

### Temporarily Disabling -e

Some commands are allowed to fail:

\`\`\`bash
set -euo pipefail

# Method 1: append || true
docker stop myapp 2>/dev/null || true   # OK if container doesn't exist

# Method 2: if statement (doesn't trigger -e)
if grep -q "pattern" file.txt; then
  echo "Found"
fi

# Method 3: temporarily disable
set +e
some_flaky_command
STATUS=\$?
set -e
echo "Status was: \$STATUS"
\`\`\`

---

## trap — Signal and Exit Handling

\`trap\` registers a handler that runs when the script exits or receives a signal.

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

# Cleanup function — runs on exit regardless of success or failure
WORK_DIR=""

cleanup() {
  local exit_code=\$?
  echo "Cleaning up (exit code: \$exit_code)"
  if [[ -n "\$WORK_DIR" && -d "\$WORK_DIR" ]]; then
    rm -rf "\$WORK_DIR"
    echo "Removed temp dir: \$WORK_DIR"
  fi
  exit \$exit_code
}

# ERR: runs when a command fails (with -e, this means just before exiting)
error_handler() {
  echo "ERROR: Command failed at line \$LINENO" >&2
  echo "Last command: \$BASH_COMMAND" >&2
}

trap cleanup EXIT
trap error_handler ERR

# Create temp directory
WORK_DIR=\$(mktemp -d)
echo "Working in \$WORK_DIR"

# Do work...
cp /etc/hostname "\$WORK_DIR/"
echo "Done"
# cleanup() runs automatically when the script exits
\`\`\`

### Handling SIGTERM and SIGINT

\`\`\`bash
handle_signal() {
  echo "Signal received, shutting down gracefully..."
  # kill child processes
  jobs -p | xargs -r kill
  exit 130
}

trap handle_signal SIGTERM SIGINT

# Long-running operation
while true; do
  process_batch
  sleep 10
done
\`\`\`

---

## Heredocs

Heredocs embed multi-line strings without escaping:

\`\`\`bash
# Basic heredoc
cat <<'EOF'
This is literal text.
No \$VARIABLE substitution here because of single quotes on EOF.
No backtick \` interpretation either.
EOF

# With variable substitution (no quotes on EOF delimiter)
HOSTNAME="prod-db-01"
cat <<EOF
[database]
host = \${HOSTNAME}
port = 5432
EOF

# Heredoc as input to a command
mysql -u root -p"\$DB_PASS" <<EOF
CREATE DATABASE IF NOT EXISTS myapp;
GRANT ALL PRIVILEGES ON myapp.* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;
EOF

# Indented heredoc (Bash 4+, strip leading tabs with <<-)
configure_nginx() {
  cat <<-EOF
	server {
	    listen 80;
	    server_name \${DOMAIN};
	    location / {
	        proxy_pass http://localhost:\${PORT};
	    }
	}
	EOF
}
\`\`\`

---

## Process Substitution

Process substitution makes a command's output act like a file:

\`\`\`bash
# diff two command outputs without temp files
diff <(sort file1.txt) <(sort file2.txt)

# Compare running processes to expected
diff <(ps aux | awk '{print \$11}' | sort) <(cat expected_procs.txt | sort)

# while loop that doesn't run in a subshell (preserves variable changes)
TOTAL=0
while IFS= read -r line; do
  ((TOTAL++))
done < <(find /var/log -name "*.log" -mtime -1)
echo "Files modified today: \$TOTAL"
\`\`\`

---

## String Manipulation

Bash has powerful built-in string operations — no awk or sed needed for simple transforms:

\`\`\`bash
FILE="deploy-v2.3.1-prod.tar.gz"

# Length
echo "\${#FILE}"              # 26

# Substring extraction
echo "\${FILE:7:6}"           # v2.3.1  (start at index 7, length 6)

# Remove prefix (shortest match)
echo "\${FILE#deploy-}"       # v2.3.1-prod.tar.gz

# Remove prefix (longest match)
echo "\${FILE##*-}"           # prod.tar.gz

# Remove suffix (shortest match)
echo "\${FILE%.tar.gz}"       # deploy-v2.3.1-prod

# Remove suffix (longest match)
echo "\${FILE%%.*}"           # deploy-v2

# Substitution (first occurrence)
echo "\${FILE/prod/staging}"  # deploy-v2.3.1-staging.tar.gz

# Substitution (all occurrences)
echo "\${FILE//./–}"          # deploy-v2–3–1-prod–tar–gz

# Uppercase / lowercase (Bash 4+)
echo "\${FILE^^}"             # DEPLOY-V2.3.1-PROD.TAR.GZ
echo "\${FILE,,}"             # deploy-v2.3.1-prod.tar.gz

# Check if string contains substring
if [[ "\$FILE" == *"prod"* ]]; then
  echo "Production file detected"
fi
\`\`\`

---

## Reading Files Line by Line

\`\`\`bash
# Safe: IFS= prevents stripping whitespace, -r prevents backslash interpretation
while IFS= read -r line; do
  echo "Line: \$line"
done < input.txt

# Read into array
mapfile -t LINES < input.txt   # Bash 4+
echo "Line count: \${#LINES[@]}"
for line in "\${LINES[@]}"; do
  echo "\$line"
done
\`\`\`

---

## Parallel Execution

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

SERVERS=("web01" "web02" "web03" "web04")
PIDS=()

# Launch jobs in parallel
for server in "\${SERVERS[@]}"; do
  ssh "\$server" "sudo systemctl restart myapp" &
  PIDS+=(\$!)   # save PID of each background job
done

# Wait for all and check exit codes
FAILED=0
for i in "\${!PIDS[@]}"; do
  if ! wait "\${PIDS[i]}"; then
    echo "ERROR: restart failed on \${SERVERS[i]}" >&2
    ((FAILED++))
  fi
done

if (( FAILED > 0 )); then
  echo "\$FAILED server(s) failed restart" >&2
  exit 1
fi
echo "All \${#SERVERS[@]} servers restarted successfully"
\`\`\`

### Limiting Concurrency

\`\`\`bash
MAX_PARALLEL=4
RUNNING=0

run_with_limit() {
  local cmd="\$1"
  while (( RUNNING >= MAX_PARALLEL )); do
    wait -n 2>/dev/null || true   # wait for any job to finish (Bash 4.3+)
    ((RUNNING--))
  done
  eval "\$cmd" &
  ((RUNNING++))
}

for item in "\${ITEMS[@]}"; do
  run_with_limit "process_item \$item"
done
wait   # wait for all remaining jobs
\`\`\`

---

## Script Best Practices Checklist

\`\`\`bash
#!/usr/bin/env bash
#
# script_name.sh — one-line purpose
# Usage: ./script_name.sh [options] <required_arg>
# Author: team@company.com

set -euo pipefail

# Constants
readonly SCRIPT_DIR=\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)
readonly SCRIPT_NAME=\$(basename "\$0")
readonly LOG_FILE="/var/log/\${SCRIPT_NAME%.sh}.log"

# Logging
log()  { echo "[\$(date '+%H:%M:%S')] INFO  \$*" | tee -a "\$LOG_FILE"; }
warn() { echo "[\$(date '+%H:%M:%S')] WARN  \$*" | tee -a "\$LOG_FILE" >&2; }
err()  { echo "[\$(date '+%H:%M:%S')] ERROR \$*" | tee -a "\$LOG_FILE" >&2; }

# Usage
usage() {
  echo "Usage: \$SCRIPT_NAME [--dry-run] <environment>"
  echo "  environment: dev | staging | prod"
  exit 2
}

# Parse arguments
DRY_RUN=false
while [[ \$# -gt 0 ]]; do
  case \$1 in
    --dry-run) DRY_RUN=true ;;
    -h|--help) usage ;;
    -*) err "Unknown option: \$1"; usage ;;
    *)  ENV="\$1" ;;
  esac
  shift
done

[[ -z "\${ENV:-}" ]] && usage

log "Starting deployment to \${ENV} (dry_run=\${DRY_RUN})"
\`\`\``,
          interviewQuestions: [
            {
              question: "Why does set -e not catch all errors in a Bash script? Give two cases where it is ineffective.",
              difficulty: "senior",
              answer: `set -e exits when a command returns non-zero, but it has several blind spots:

1. **Commands in conditions**: A command that returns non-zero inside an if, while, until, or after && / || does NOT trigger -e, because the shell considers the exit code intentional: \`if grep "pattern" file; then ...\` — grep returning 1 (no match) won't exit the script.

2. **Subshells and functions called in assignments**: \`result=\$(failing_command)\` — the exit code of the subshell is propagated to the assignment, but the assignment itself returns 0. With just -e, this silently ignores the failure. You need to check \$? explicitly or use a conditional.

3. **Pipelines without pipefail**: \`failing_cmd | grep something\` — only the exit code of the last command (grep) is checked by -e. This is why you always pair -e with -o pipefail.

4. **Arithmetic that evaluates to 0**: \`(( 0 ))\` returns exit code 1, which -e treats as failure — this catches even legitimate cases like \`(( count-- ))\` when count is 1.`,
            },
            {
              question: "Explain how trap EXIT and trap ERR differ. When would you use each?",
              difficulty: "mid",
              answer: `- \`trap handler EXIT\` — runs the handler whenever the script exits, regardless of whether it exited normally (exit 0) or due to an error. Ideal for cleanup: removing temp files, killing background processes, releasing locks.

- \`trap handler ERR\` — runs the handler when any command returns a non-zero exit code (and -e is set, it runs before the script exits). Useful for logging which command failed and where, since \$LINENO and \$BASH_COMMAND are available.

Typical pattern: use both together — ERR logs the error details, EXIT performs cleanup. The cleanup function checks \$? (the exit code) to determine whether it's cleaning up after success or failure.`,
            },
            {
              question: "What is the difference between a heredoc with <<EOF and <<'EOF' (quoted delimiter)?",
              difficulty: "mid",
              answer: `- \`<<EOF\` (unquoted) — performs variable expansion and command substitution inside the heredoc. \${VARNAME} and \$(command) are interpreted.

- \`<<'EOF'\` (single-quoted) — treats the entire body as a literal string. No variable expansion, no command substitution, no backslash interpretation. The content is output exactly as written.

Use <<'EOF' when you want to embed shell scripts, configuration templates with literal \$ signs, or Kubernetes/Terraform files where variables should not be expanded by the outer script. Use <<EOF when you want to interpolate values into the heredoc.`,
            },
            {
              question: "How do you launch 10 background jobs in Bash and wait for all of them, capturing which ones failed?",
              difficulty: "senior",
              answer: `\`\`\`bash
PIDS=()
ITEMS=(1 2 3 4 5 6 7 8 9 10)

for item in "\${ITEMS[@]}"; do
  process "\$item" &
  PIDS+=(\$!)
done

FAILED=()
for i in "\${!PIDS[@]}"; do
  if ! wait "\${PIDS[i]}"; then
    FAILED+=("\${ITEMS[i]}")
  fi
done

if (( \${#FAILED[@]} > 0 )); then
  echo "Failed items: \${FAILED[*]}"
  exit 1
fi
\`\`\`

Key points: \$! captures the PID of the last backgrounded process immediately after &. Store PIDs in an array parallel to the items array so you can correlate which job failed. wait <PID> returns that process's exit code.`,
            },
            {
              question: "What does \${BASH_SOURCE[0]} give you and why is it more reliable than \$0?",
              difficulty: "senior",
              answer: `\$0 is the name used to invoke the script. If the script is sourced (\`. script.sh\`), \$0 is the parent shell's \$0 (e.g., bash), not the script name.

\${BASH_SOURCE[0]} is always the path to the current file, whether the script is executed directly or sourced. It's an array because Bash tracks the call stack — index [0] is always the currently executing file.

This is why the idiom for finding a script's own directory is:

\`\`\`bash
SCRIPT_DIR=\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)
\`\`\`

This gives an absolute path to the directory containing the script, regardless of where it is called from, resolving symlinks in the process.`,
            },
          ],
          quizQuestions: [
            {
              question: "Your pipeline `grep 'ERROR' app.log | wc -l` returns 0 even though grep finds no matches. With set -e, does the script exit? Why?",
              answer: "No, the script does NOT exit. Without set -o pipefail, only the exit code of the last command in the pipeline (wc -l) is checked. wc -l always succeeds (exit 0) even when its input is empty. With pipefail enabled, grep's exit code 1 (no match) would propagate and set -e would exit the script.",
              type: "scenario",
              difficulty: "mid",
            },
            {
              question: "You have `trap cleanup EXIT` but your cleanup function is removing a temp dir that doesn't exist yet when the script exits early due to an error. How do you fix this?",
              answer: "Guard the removal with an existence check and null check: if [[ -n \"\${WORK_DIR:-}\" && -d \"\$WORK_DIR\" ]]; then rm -rf \"\$WORK_DIR\"; fi. Initialize WORK_DIR to an empty string at the top of the script before the trap is registered, so -u doesn't cause an error on early exits before WORK_DIR is set.",
              type: "scenario",
              difficulty: "mid",
            },
            {
              question: "You use `<<EOF` in a heredoc to write a Kubernetes deployment YAML, but all \${image} references are expanded immediately. You want them literal for a template file. What is the fix?",
              answer: "Use a quoted heredoc delimiter: <<'EOF' instead of <<EOF. This prevents variable expansion inside the heredoc, making all \${image} references output literally. This is the correct approach for writing template files that will be processed later.",
              type: "scenario",
              difficulty: "junior",
            },
            {
              question: "Write a Bash snippet using trap to ensure a temp directory is cleaned up when the script exits, even on failure.",
              answer: "WORK_DIR=''; cleanup() { [[ -n \"\${WORK_DIR}\" && -d \"\${WORK_DIR}\" ]] && rm -rf \"\${WORK_DIR}\"; }; trap cleanup EXIT; WORK_DIR=\$(mktemp -d)",
              type: "hands-on",
              hint: "Register the trap before creating the temp directory. Initialize WORK_DIR to empty before the trap so -u doesn't fail if the script exits before mktemp runs.",
            },
            {
              question: "Write a Bash one-liner to extract the version number from a string like 'myapp-v2.3.1-linux-amd64' using parameter expansion (no sed or awk).",
              answer: "FILE='myapp-v2.3.1-linux-amd64'; VERSION=\"\${FILE#myapp-}\"; VERSION=\"\${VERSION%%-*}\"; echo \"\$VERSION\"  # outputs: v2.3.1",
              type: "hands-on",
              hint: "Use ## to strip the longest prefix matching *- to get the version, or chain two parameter expansions: first strip the prefix, then strip the suffix.",
            },
            {
              question: "Launch three background commands (sleep 3, sleep 1, sleep 5), wait for all to complete, and print 'Done' only if all succeeded.",
              answer: "sleep 3 & P1=\$!; sleep 1 & P2=\$!; sleep 5 & P3=\$!; if wait \$P1 && wait \$P2 && wait \$P3; then echo 'Done'; else echo 'One or more failed'; fi",
              type: "hands-on",
              hint: "Use & to background each command and capture \$! immediately after each one. Use wait <pid> to get the exit code of a specific background process.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // MODULE 3 — Python & Go Scripting
    // ─────────────────────────────────────────────────────────────
    {
      id: "python-golang-scripting",
      title: "Python & Go Scripting",
      level: "intermediate",
      description: "Automate cloud infrastructure, build CLIs, and write deployment tools in Python and Go.",
      lessons: [
        {
          id: "python-scripting",
          title: "Python for DevOps: Automation, AWS & API Integration",
          duration: 75,
          type: "lesson",
          description: "Use Python to automate cloud operations, parse configs, call APIs, and build maintainable DevOps tools.",
          objectives: [
            "Build CLI tools with argparse and validate arguments",
            "Run system commands safely with subprocess",
            "Automate AWS resources with boto3",
            "Make HTTP API calls with the requests library",
            "Parse JSON and YAML configuration files",
            "Structure Python scripts with logging, virtual environments, and best practices",
          ],
          tags: ["python", "boto3", "aws", "requests", "argparse", "subprocess", "yaml", "json", "logging", "automation"],
          content: `## Python for DevOps

Python is the lingua franca of DevOps automation. Its rich ecosystem — boto3 for AWS, requests for HTTP, yaml/json for config — makes it the first choice for scripts beyond Bash's comfort zone.

---

## Script Structure & Virtual Environments

Always isolate dependencies:

\`\`\`bash
# Create a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies and freeze them
pip install boto3 requests pyyaml
pip freeze > requirements.txt

# Restore on another machine
pip install -r requirements.txt
\`\`\`

Standard script skeleton:

\`\`\`python
#!/usr/bin/env python3
"""
deploy.py — Deploy application version to an AWS ECS service.
"""

import argparse
import logging
import sys

# Configure logging early
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)


def main():
    args = parse_args()
    log.info("Starting deployment: service=%s version=%s", args.service, args.version)
    # ... do work ...


def parse_args():
    parser = argparse.ArgumentParser(description="Deploy to ECS")
    parser.add_argument("service", help="ECS service name")
    parser.add_argument("version", help="Docker image tag")
    parser.add_argument("--cluster", default="production", help="ECS cluster name")
    parser.add_argument("--dry-run", action="store_true", help="Print plan without executing")
    parser.add_argument("--verbose", "-v", action="store_true", help="Debug logging")
    return parser.parse_args()


if __name__ == "__main__":
    sys.exit(main())
\`\`\`

---

## subprocess — Running Shell Commands

\`\`\`python
import subprocess
import shlex

def run(cmd: str | list, check: bool = True, capture: bool = False) -> subprocess.CompletedProcess:
    """Run a command, optionally capturing output."""
    if isinstance(cmd, str):
        cmd = shlex.split(cmd)
    return subprocess.run(
        cmd,
        check=check,           # raises CalledProcessError on non-zero exit
        capture_output=capture,
        text=True,             # decode stdout/stderr as str
    )

# Simple execution
run("docker pull myrepo/api:v2.3.1")

# Capture output
result = run("git rev-parse HEAD", capture=True)
commit_sha = result.stdout.strip()
log.info("Current commit: %s", commit_sha)

# Handle failure gracefully
try:
    run("docker inspect myapp", capture=True)
    container_exists = True
except subprocess.CalledProcessError:
    container_exists = False

# Stream output in real time (for long-running commands)
with subprocess.Popen(
    ["docker", "build", "-t", "myapp:latest", "."],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
) as proc:
    for line in proc.stdout:
        print(line, end="")
    proc.wait()
    if proc.returncode != 0:
        raise RuntimeError("docker build failed")
\`\`\`

---

## os & pathlib — File System Operations

\`\`\`python
import os
import shutil
from pathlib import Path

# pathlib is the modern way
config_dir = Path("/etc/myapp")
config_file = config_dir / "settings.yaml"

if not config_file.exists():
    log.warning("Config not found: %s", config_file)
    config_dir.mkdir(parents=True, exist_ok=True)

# Read / write text files
content = config_file.read_text()
config_file.write_text(content.replace("localhost", "prod.db.internal"))

# Iterate files
for path in Path("./logs").glob("**/*.log"):
    if path.stat().st_size > 100 * 1024 * 1024:   # >100 MB
        log.info("Large log file: %s (%.1f MB)", path, path.stat().st_size / 1e6)

# Copy and move
shutil.copy2(src, dst)       # copy preserving metadata
shutil.move(src, dst)        # move/rename

# Environment variables
db_host = os.environ.get("DB_HOST", "localhost")
api_key  = os.environ["API_KEY"]   # KeyError if not set — intentional
\`\`\`

---

## JSON & YAML Parsing

\`\`\`python
import json
import yaml   # pip install pyyaml

# Parse JSON response
def get_service_config(service_name: str) -> dict:
    with open(f"config/{service_name}.json") as f:
        return json.load(f)

# Write JSON
config = {"host": "prod.db.internal", "port": 5432, "pool_size": 10}
with open("output.json", "w") as f:
    json.dump(config, f, indent=2)

# Parse YAML
with open("values.yaml") as f:
    values = yaml.safe_load(f)    # always use safe_load, never load()

image_tag = values["image"]["tag"]
replicas  = values.get("replicaCount", 1)

# Write YAML
with open("output.yaml", "w") as f:
    yaml.dump(values, f, default_flow_style=False)
\`\`\`

---

## boto3 — AWS Automation

\`\`\`python
import boto3
from botocore.exceptions import ClientError

ec2 = boto3.client("ec2", region_name="us-east-1")
ecs = boto3.client("ecs", region_name="us-east-1")
ssm = boto3.client("ssm", region_name="us-east-1")

# List running EC2 instances with a specific tag
def list_instances(env: str) -> list[dict]:
    resp = ec2.describe_instances(
        Filters=[
            {"Name": "tag:Environment", "Values": [env]},
            {"Name": "instance-state-name", "Values": ["running"]},
        ]
    )
    instances = []
    for reservation in resp["Reservations"]:
        instances.extend(reservation["Instances"])
    return instances

# Update ECS service image
def deploy_ecs(cluster: str, service: str, image: str, dry_run: bool = False) -> None:
    # Get current task definition
    resp = ecs.describe_services(cluster=cluster, services=[service])
    task_def_arn = resp["services"][0]["taskDefinition"]

    td = ecs.describe_task_definition(taskDefinition=task_def_arn)["taskDefinition"]
    containers = td["containerDefinitions"]
    containers[0]["image"] = image   # update first container's image

    if dry_run:
        log.info("[DRY RUN] Would update %s/%s with image %s", cluster, service, image)
        return

    new_td = ecs.register_task_definition(
        family=td["family"],
        containerDefinitions=containers,
        executionRoleArn=td.get("executionRoleArn", ""),
        taskRoleArn=td.get("taskRoleArn", ""),
        networkMode=td.get("networkMode", "bridge"),
    )
    new_arn = new_td["taskDefinition"]["taskDefinitionArn"]
    ecs.update_service(cluster=cluster, service=service, taskDefinition=new_arn)
    log.info("Deployed %s to %s/%s", image, cluster, service)

# Read a secret from SSM Parameter Store
def get_secret(name: str) -> str:
    try:
        resp = ssm.get_parameter(Name=name, WithDecryption=True)
        return resp["Parameter"]["Value"]
    except ClientError as e:
        if e.response["Error"]["Code"] == "ParameterNotFound":
            raise KeyError(f"SSM parameter not found: {name}") from e
        raise
\`\`\`

---

## requests — HTTP API Integration

\`\`\`python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def create_session(retries: int = 3, backoff: float = 0.5) -> requests.Session:
    session = requests.Session()
    retry = Retry(
        total=retries,
        backoff_factor=backoff,
        status_forcelist=[429, 500, 502, 503, 504],
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session

SESSION = create_session()

def notify_slack(webhook_url: str, message: str, color: str = "good") -> None:
    payload = {
        "attachments": [
            {"color": color, "text": message, "ts": __import__("time").time()}
        ]
    }
    resp = SESSION.post(webhook_url, json=payload, timeout=10)
    resp.raise_for_status()

def get_github_releases(repo: str, token: str) -> list[dict]:
    headers = {"Authorization": f"token {token}", "Accept": "application/vnd.github.v3+json"}
    resp = SESSION.get(f"https://api.github.com/repos/{repo}/releases", headers=headers, timeout=15)
    resp.raise_for_status()
    return resp.json()
\`\`\`

---

## Fabric / Invoke — Task Automation

\`\`\`python
# tasks.py — run with: invoke deploy --env prod
from invoke import task

@task
def lint(ctx):
    """Run flake8 and mypy."""
    ctx.run("flake8 .")
    ctx.run("mypy .")

@task
def test(ctx, verbose=False):
    """Run pytest."""
    flags = "-v" if verbose else ""
    ctx.run(f"pytest {flags} tests/")

@task(pre=[lint, test])
def deploy(ctx, env="staging", version="latest"):
    """Deploy to environment."""
    ctx.run(f"./scripts/deploy.sh {env} {version}")
\`\`\``,
          interviewQuestions: [
            {
              question: "Why should you always use subprocess.run with a list of arguments rather than a shell string?",
              difficulty: "junior",
              answer: `Using a list avoids shell injection vulnerabilities. When you pass a string with shell=True, the shell interprets special characters. If any argument contains user input, an attacker could inject arbitrary commands.

\`\`\`python
# DANGEROUS — shell injection possible
filename = user_input   # e.g., "file.txt; rm -rf /"
subprocess.run(f"cat {filename}", shell=True)

# SAFE — each element is a separate argument, no shell interpretation
subprocess.run(["cat", filename])
\`\`\`

Additionally, shell=True on Windows uses cmd.exe, making scripts non-portable. The list form is also clearer, avoids quoting complexity, and makes shlex.split unnecessary.`,
            },
            {
              question: "What is the difference between yaml.load() and yaml.safe_load()? Which should you use in scripts?",
              difficulty: "mid",
              answer: `yaml.load() can execute arbitrary Python code embedded in YAML via the !!python/object tag. This is a security vulnerability — a malicious YAML file could compromise the server running your script.

yaml.safe_load() only parses standard YAML types (strings, numbers, lists, dicts, booleans, null). It raises an error if it encounters Python-specific tags.

Always use yaml.safe_load() in scripts. The only legitimate use of yaml.load() is when you explicitly need Python-specific YAML features AND you fully trust the source, in which case you must pass an explicit Loader: yaml.load(f, Loader=yaml.FullLoader).`,
            },
            {
              question: "How do you handle AWS API pagination in boto3? What happens if you ignore it?",
              difficulty: "mid",
              answer: `Many AWS APIs return paginated results — the first response contains only a partial result set and a NextToken. If you ignore pagination, you silently get incomplete data.

The safest way is to use boto3 paginators:

\`\`\`python
paginator = ec2.get_paginator("describe_instances")
instances = []
for page in paginator.paginate(Filters=[...]):
    for reservation in page["Reservations"]:
        instances.extend(reservation["Instances"])
\`\`\`

If you use describe_instances() directly and have more than ~100 instances, you'll silently miss the rest. AWS has different page sizes per API — some return up to 1000 items, others 50. Always use paginators for list operations.`,
            },
            {
              question: "How would you structure a Python script to read a required API key from an environment variable and fail fast with a clear error if it is missing?",
              difficulty: "junior",
              answer: `\`\`\`python
import os
import sys

def require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        print(f"ERROR: Required environment variable {name} is not set", file=sys.stderr)
        sys.exit(1)
    return value

API_KEY = require_env("MY_API_KEY")
DB_URL  = require_env("DATABASE_URL")
\`\`\`

Avoid os.environ[name] directly — it raises KeyError with a cryptic traceback. The pattern above gives a human-readable error message, identifies the missing variable by name, and exits with a non-zero code for CI/CD detection.`,
            },
            {
              question: "Explain how you would implement retry logic for a flaky HTTP endpoint in Python without adding a sleep loop manually.",
              difficulty: "senior",
              answer: `Use urllib3's Retry class with requests' HTTPAdapter:

\`\`\`python
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import requests

session = requests.Session()
retry = Retry(
    total=5,                          # total retries
    backoff_factor=0.5,               # wait 0.5, 1, 2, 4, 8 seconds
    status_forcelist=[429, 500, 503], # retry on these HTTP codes
    allowed_methods=["GET", "POST"],
    raise_on_status=True,
)
session.mount("https://", HTTPAdapter(max_retries=retry))

resp = session.get("https://flaky.api.com/data", timeout=30)
\`\`\`

This provides exponential backoff automatically. The backoff_factor of 0.5 means wait 0.5s after the 1st retry, 1s after the 2nd, 2s after the 3rd, etc. status_forcelist ensures network errors AND HTTP error codes trigger retries. Set a timeout to prevent hanging indefinitely.`,
            },
          ],
          quizQuestions: [
            {
              question: "You run python deploy.py and get ModuleNotFoundError: No module named 'boto3'. Your colleague says it works on their machine. What is the most likely cause?",
              answer: "The virtual environment is not activated, or you're running a different Python interpreter than the one where boto3 is installed. Run `which python3` and `pip list` to verify. Activate the venv with `source .venv/bin/activate` and retry. Always include a requirements.txt and document the venv setup in your README.",
              type: "scenario",
              difficulty: "junior",
            },
            {
              question: "Your AWS boto3 script works locally but fails in a CI pipeline with 'Unable to locate credentials'. What are the possible causes and fixes?",
              answer: "The CI environment has no AWS credentials configured. Options: (1) Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_DEFAULT_REGION as CI environment variables/secrets. (2) Use an IAM role attached to the CI runner (preferred for EC2/ECS/GitHub Actions with OIDC). (3) Use aws sts assume-role to get temporary credentials. Never commit credentials to source control.",
              type: "scenario",
              difficulty: "mid",
            },
            {
              question: "You use argparse with a --dry-run flag but the flag is always False even when you pass it on the command line. What is the most common mistake?",
              answer: "The argument is likely defined with type=bool or default='False' (a string). The correct way to define a boolean flag is: parser.add_argument('--dry-run', action='store_true', default=False). With action='store_true', presence of --dry-run sets the value to True; absence leaves it False. Never use type=bool — it treats any non-empty string (including 'False') as True.",
              type: "scenario",
              difficulty: "junior",
            },
            {
              question: "Write a Python function that lists all S3 buckets using boto3 and prints the name and creation date of each.",
              answer: "import boto3; s3 = boto3.client('s3'); def list_buckets(): resp = s3.list_buckets(); [print(b['Name'], b['CreationDate']) for b in resp['Buckets']]",
              type: "hands-on",
              hint: "boto3.client('s3').list_buckets() returns a dict with a 'Buckets' key. Each bucket has 'Name' and 'CreationDate' keys.",
            },
            {
              question: "Write a Python snippet that reads a YAML file (config.yaml), changes the value of config['database']['host'] to 'prod.db.internal', and writes it back.",
              answer: "import yaml; f=open('config.yaml'); data=yaml.safe_load(f); f.close(); data['database']['host']='prod.db.internal'; open('config.yaml','w').write(yaml.dump(data, default_flow_style=False))",
              type: "hands-on",
              hint: "Use yaml.safe_load() to read, modify the dict in memory, then yaml.dump() to write back. Use default_flow_style=False for human-readable block-style YAML.",
            },
            {
              question: "Write a Python function using subprocess to get the output of `git log --oneline -10` and return it as a list of strings.",
              answer: "import subprocess; def get_recent_commits(): result = subprocess.run(['git', 'log', '--oneline', '-10'], check=True, capture_output=True, text=True); return result.stdout.strip().splitlines()",
              type: "hands-on",
              hint: "Use subprocess.run with capture_output=True and text=True. Split the stdout string on newlines with .splitlines().",
            },
          ],
        },
        {
          id: "golang-scripting",
          title: "Go for DevOps: CLI Tools & Deployment Automation",
          duration: 80,
          type: "lesson",
          description: "Build fast, cross-compiled DevOps tools in Go using cobra, os/exec, goroutines, and JSON/YAML unmarshaling.",
          objectives: [
            "Build CLI tools with cobra and the standard flag package",
            "Execute system commands with os/exec and capture output",
            "Read and write files, JSON, and YAML in Go",
            "Use goroutines and channels for parallel task execution",
            "Cross-compile Go binaries for Linux, macOS, and Windows",
            "Write a complete deployment tool demonstrating Go for DevOps",
          ],
          tags: ["golang", "go", "cobra", "cli", "goroutines", "os-exec", "json", "yaml", "cross-compilation", "devops"],
          content: `## Go for DevOps Tooling

Go has become the default language for DevOps tooling — Docker, Kubernetes, Terraform, Prometheus, and Consul are all written in Go. Its strengths for this domain: static binaries (no runtime dependency), fast startup, easy concurrency, and trivial cross-compilation.

---

## Project Setup

\`\`\`bash
mkdir deploy-tool && cd deploy-tool
go mod init github.com/yourorg/deploy-tool

# Add dependencies
go get github.com/spf13/cobra
go get sigs.k8s.io/yaml
\`\`\`

---

## CLI with cobra

\`cobra\` is the library behind kubectl, Hugo, and dozens of other tools. It handles subcommands, flags, help text, and completions automatically.

\`\`\`go
// main.go
package main

import (
    "fmt"
    "os"

    "github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
    Use:   "deploy",
    Short: "Deploy application services",
    Long:  "A deployment automation tool for managing ECS, K8s, and VM deployments.",
}

var deployCmd = &cobra.Command{
    Use:   "service <name> <version>",
    Short: "Deploy a service to a target environment",
    Args:  cobra.ExactArgs(2),
    RunE:  runDeploy,
}

var (
    flagEnv    string
    flagDryRun bool
    flagVerbose bool
)

func init() {
    deployCmd.Flags().StringVarP(&flagEnv, "env", "e", "staging", "Target environment")
    deployCmd.Flags().BoolVar(&flagDryRun, "dry-run", false, "Print plan without executing")
    deployCmd.Flags().BoolVarP(&flagVerbose, "verbose", "v", false, "Verbose output")
    rootCmd.AddCommand(deployCmd)
}

func runDeploy(cmd *cobra.Command, args []string) error {
    service := args[0]
    version := args[1]

    fmt.Printf("Deploying %s:%s to %s (dry-run=%v)\\n", service, version, flagEnv, flagDryRun)

    if flagDryRun {
        fmt.Println("[DRY RUN] No changes made")
        return nil
    }
    return deployService(service, version, flagEnv)
}

func main() {
    if err := rootCmd.Execute(); err != nil {
        os.Exit(1)
    }
}
\`\`\`

---

## os/exec — Running Commands

\`\`\`go
package main

import (
    "bytes"
    "fmt"
    "os"
    "os/exec"
    "strings"
)

// Run executes a command and returns combined output.
func Run(name string, args ...string) (string, error) {
    cmd := exec.Command(name, args...)
    var out bytes.Buffer
    var errBuf bytes.Buffer
    cmd.Stdout = &out
    cmd.Stderr = &errBuf
    cmd.Env = os.Environ()   // inherit current environment

    if err := cmd.Run(); err != nil {
        return "", fmt.Errorf("command %q failed: %w\\nstderr: %s", name+" "+strings.Join(args, " "), err, errBuf.String())
    }
    return strings.TrimSpace(out.String()), nil
}

// Stream streams command output to stdout in real time.
func Stream(name string, args ...string) error {
    cmd := exec.Command(name, args...)
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr
    return cmd.Run()
}

// Usage
func getGitSHA() (string, error) {
    return Run("git", "rev-parse", "HEAD")
}

func dockerBuild(tag string) error {
    return Stream("docker", "build", "-t", tag, ".")
}

func dockerPush(tag string) error {
    return Stream("docker", "push", tag)
}
\`\`\`

---

## File I/O and JSON/YAML

\`\`\`go
package main

import (
    "encoding/json"
    "fmt"
    "os"

    "sigs.k8s.io/yaml"
)

type Config struct {
    Environment string            \`json:"environment" yaml:"environment"\`
    Services    []ServiceConfig   \`json:"services"    yaml:"services"\`
}

type ServiceConfig struct {
    Name     string \`json:"name"    yaml:"name"\`
    Image    string \`json:"image"   yaml:"image"\`
    Replicas int    \`json:"replicas" yaml:"replicas"\`
}

func loadConfig(path string) (*Config, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("reading config: %w", err)
    }

    var cfg Config
    if err := yaml.Unmarshal(data, &cfg); err != nil {
        return nil, fmt.Errorf("parsing YAML: %w", err)
    }
    return &cfg, nil
}

func writeJSON(path string, v any) error {
    data, err := json.MarshalIndent(v, "", "  ")
    if err != nil {
        return err
    }
    return os.WriteFile(path, data, 0644)
}
\`\`\`

---

## Goroutines and Channels — Parallel Deployment

\`\`\`go
package main

import (
    "fmt"
    "sync"
)

type Result struct {
    Service string
    Err     error
}

func deployAllServices(services []ServiceConfig, env string) error {
    results := make(chan Result, len(services))
    var wg sync.WaitGroup

    for _, svc := range services {
        wg.Add(1)
        go func(s ServiceConfig) {
            defer wg.Done()
            err := deployService(s.Name, s.Image, env)
            results <- Result{Service: s.Name, Err: err}
        }(svc)   // pass svc by value to avoid loop variable capture
    }

    // Close results channel when all goroutines finish
    go func() {
        wg.Wait()
        close(results)
    }()

    // Collect results
    var failed []string
    for r := range results {
        if r.Err != nil {
            fmt.Printf("ERROR: %s: %v\\n", r.Service, r.Err)
            failed = append(failed, r.Service)
        } else {
            fmt.Printf("OK: %s deployed\\n", r.Service)
        }
    }

    if len(failed) > 0 {
        return fmt.Errorf("%d service(s) failed: %v", len(failed), failed)
    }
    return nil
}

// Limit concurrency with a semaphore channel
func deployWithLimit(services []ServiceConfig, env string, maxConcurrency int) error {
    sem := make(chan struct{}, maxConcurrency)
    var wg sync.WaitGroup
    errs := make(chan error, len(services))

    for _, svc := range services {
        wg.Add(1)
        go func(s ServiceConfig) {
            defer wg.Done()
            sem <- struct{}{}        // acquire
            defer func() { <-sem }() // release
            if err := deployService(s.Name, s.Image, env); err != nil {
                errs <- err
            }
        }(svc)
    }

    wg.Wait()
    close(errs)
    for err := range errs {
        if err != nil {
            return err
        }
    }
    return nil
}
\`\`\`

---

## Cross-Compilation

Go cross-compiles with zero external toolchain:

\`\`\`bash
# Linux amd64 (most servers)
GOOS=linux GOARCH=amd64 go build -o deploy-linux-amd64 .

# macOS Apple Silicon
GOOS=darwin GOARCH=arm64 go build -o deploy-darwin-arm64 .

# Windows
GOOS=windows GOARCH=amd64 go build -o deploy.exe .

# Build all targets with a Makefile
build-all:
\tGOOS=linux  GOARCH=amd64 go build -ldflags="-s -w" -o dist/deploy-linux-amd64   .
\tGOOS=darwin GOARCH=arm64 go build -ldflags="-s -w" -o dist/deploy-darwin-arm64  .
\tGOOS=windows GOARCH=amd64 go build -ldflags="-s -w" -o dist/deploy-windows.exe  .
\`\`\`

\`-ldflags="-s -w"\` strips debug info and DWARF tables, reducing binary size by ~30%.

---

## A Complete Minimal Deployment Tool

\`\`\`go
// A real tool: health-check multiple services in parallel and report
package main

import (
    "fmt"
    "net/http"
    "os"
    "sync"
    "time"
)

type HealthResult struct {
    URL    string
    Status int
    Err    error
    Ms     int64
}

func checkHealth(url string) HealthResult {
    start := time.Now()
    client := &http.Client{Timeout: 5 * time.Second}
    resp, err := client.Get(url)
    elapsed := time.Since(start).Milliseconds()
    if err != nil {
        return HealthResult{URL: url, Err: err, Ms: elapsed}
    }
    defer resp.Body.Close()
    return HealthResult{URL: url, Status: resp.StatusCode, Ms: elapsed}
}

func main() {
    urls := os.Args[1:]
    if len(urls) == 0 {
        fmt.Fprintln(os.Stderr, "Usage: healthcheck <url> [url...]")
        os.Exit(2)
    }

    results := make([]HealthResult, len(urls))
    var wg sync.WaitGroup

    for i, url := range urls {
        wg.Add(1)
        go func(idx int, u string) {
            defer wg.Done()
            results[idx] = checkHealth(u)
        }(i, url)
    }
    wg.Wait()

    exitCode := 0
    for _, r := range results {
        if r.Err != nil {
            fmt.Printf("FAIL  %s — error: %v\\n", r.URL, r.Err)
            exitCode = 1
        } else if r.Status >= 400 {
            fmt.Printf("FAIL  %s — HTTP %d (%dms)\\n", r.URL, r.Status, r.Ms)
            exitCode = 1
        } else {
            fmt.Printf("OK    %s — HTTP %d (%dms)\\n", r.URL, r.Status, r.Ms)
        }
    }
    os.Exit(exitCode)
}
\`\`\`

Build and run:

\`\`\`bash
go build -o healthcheck .
./healthcheck https://api.example.com/health https://web.example.com/health

# OK    https://api.example.com/health — HTTP 200 (43ms)
# FAIL  https://web.example.com/health — HTTP 503 (12ms)
\`\`\``,
          interviewQuestions: [
            {
              question: "What is the Go zero value, and why does it matter for DevOps tooling?",
              difficulty: "junior",
              answer: `Every type in Go has a zero value — the value assigned to an uninitialized variable. For example: int is 0, string is "", bool is false, pointer/slice/map/channel are nil.

In DevOps tooling this matters because:
1. Structs can be used immediately without constructor calls — a Config{} struct with zero values is valid to inspect
2. Error handling is explicit — a nil error means success, which is unambiguous
3. Common bugs in other languages (nil pointer dereferences from uninitialized fields) are often caught at compile time in Go
4. When unmarshaling YAML/JSON, missing optional fields get their zero value automatically, which is usually the correct default (replicas: 0, dryRun: false)`,
            },
            {
              question: "Why do you pass the loop variable to a goroutine by value rather than by reference in a for-range loop?",
              difficulty: "mid",
              answer: `In Go, the for-range loop variable is a single variable reused on each iteration (pre-Go 1.22). If you launch a goroutine that closes over the loop variable, all goroutines see the same variable — by the time they run, it holds the last iteration's value.

\`\`\`go
// BUG: all goroutines print the last service name
for _, svc := range services {
    go func() { fmt.Println(svc.Name) }()  // captures loop var
}

// FIX: pass as argument (value copy)
for _, svc := range services {
    go func(s ServiceConfig) { fmt.Println(s.Name) }(svc)
}
\`\`\`

In Go 1.22+, the loop variable is re-scoped per iteration, eliminating this bug. But since many production systems still run older Go, passing by value remains the safe habit.`,
            },
            {
              question: "Explain how to implement a semaphore in Go to limit parallel goroutines to a maximum of N.",
              difficulty: "mid",
              answer: `Use a buffered channel of size N as a semaphore:

\`\`\`go
sem := make(chan struct{}, N)  // capacity N

for _, item := range items {
    go func(i Item) {
        sem <- struct{}{}        // acquire: blocks if N goroutines are running
        defer func() { <-sem }() // release when done
        process(i)
    }(item)
}
\`\`\`

Sending to the channel acquires a "slot." The channel blocks when full (N slots taken), so no more than N goroutines run concurrently. Receiving from the channel in the defer releases the slot. This is simpler than using sync.Mutex with a counter and avoids import of external semaphore packages.`,
            },
            {
              question: "What does GOOS=linux GOARCH=amd64 go build do and why is this valuable for DevOps tooling?",
              difficulty: "junior",
              answer: `It cross-compiles a Go binary for Linux on x86-64, regardless of the host OS (e.g., building on a Mac).

This is extremely valuable for DevOps because:
1. You can build deployment tools on your macOS laptop and ship a single static binary to any Linux server — no Go runtime needed on the target
2. One binary works everywhere: no "it works on my machine" from runtime version differences
3. CI pipelines can build release artifacts for all platforms in one job without VM emulation
4. Static linking means no shared library dependency hell (unlike Python's virtualenvs or Node's node_modules)

The resulting binary is typically 5-15 MB for a typical CLI tool.`,
            },
            {
              question: "How does Go's error handling pattern compare to exceptions? What are the trade-offs for DevOps tools?",
              difficulty: "senior",
              answer: `Go returns errors as values: \`result, err := doSomething()\`. The caller must explicitly check \`if err != nil\`. There are no exceptions, no try/catch blocks.

Trade-offs for DevOps tooling:

**Advantages:**
- Errors are explicit and visible at every call site — you can't accidentally ignore them (unless you use _)
- fmt.Errorf("deploy failed: %w", err) wraps errors with context, creating clear error chains
- No hidden control flow — no unexpected jumps like exceptions cause
- errors.Is() and errors.As() allow structured error inspection

**Disadvantages:**
- Verbose — error checks dominate the code (if err != nil is everywhere)
- Easy to propagate errors without adding context, making debugging harder

Best practice for DevOps tools: always wrap errors with context using %w and use errors.As() to handle specific error types (e.g., AWS ClientError) differently from general failures.`,
            },
          ],
          quizQuestions: [
            {
              question: "Your Go CLI tool panics with 'index out of range' when run with no arguments because it accesses os.Args[1]. How do you fix it?",
              answer: "Check the length of os.Args before accessing it: if len(os.Args) < 2 { fmt.Fprintln(os.Stderr, \"Usage: tool <arg>\"); os.Exit(2) }. Better: use cobra or the flag package, which handles missing arguments gracefully and generates help text automatically.",
              type: "scenario",
              difficulty: "junior",
            },
            {
              question: "Your goroutine parallel deployment works for 3 services but deadlocks when deploying 100 services. The results channel has capacity 10. Why?",
              answer: "The results channel buffer (capacity 10) fills up after 10 goroutines send to it. The remaining goroutines block trying to send, but nothing is reading from the channel yet (the reader comes after wg.Wait()). Fix: make the channel buffered with capacity equal to the number of goroutines (len(services)), or use a goroutine to drain the channel concurrently with the senders.",
              type: "scenario",
              difficulty: "senior",
            },
            {
              question: "You use exec.Command('sh', '-c', userInput) to run a command from user input in your Go tool. What security risk does this introduce?",
              answer: "Shell injection. Any special characters in userInput (;, |, &&, $(), backticks) are interpreted by sh. An attacker could inject: deploy-tool; rm -rf /. Always use exec.Command(name, args...) with separate arguments, never shell=true with user input. If you must run a shell command, sanitize and validate input strictly.",
              type: "scenario",
              difficulty: "mid",
            },
            {
              question: "Write a Go function that runs `git rev-parse HEAD` and returns the SHA as a string, returning an error if the command fails.",
              answer: "func getGitSHA() (string, error) { out, err := exec.Command(\"git\", \"rev-parse\", \"HEAD\").Output(); if err != nil { return \"\", fmt.Errorf(\"git rev-parse: %w\", err) }; return strings.TrimSpace(string(out)), nil }",
              type: "hands-on",
              hint: "Use exec.Command().Output() which returns ([]byte, error). Convert []byte to string with string(out) and trim the trailing newline with strings.TrimSpace.",
            },
            {
              question: "Write a Go struct for a deployment config with fields: Name (string), Image (string), Replicas (int), and write a function to unmarshal it from a YAML file.",
              answer: "type DeployConfig struct { Name string `yaml:\"name\"`; Image string `yaml:\"image\"`; Replicas int `yaml:\"replicas\"` }; func loadConfig(path string) (*DeployConfig, error) { data, err := os.ReadFile(path); if err != nil { return nil, err }; var cfg DeployConfig; return &cfg, yaml.Unmarshal(data, &cfg) }",
              type: "hands-on",
              hint: "Use struct tags `yaml:\"fieldname\"` to map YAML keys to struct fields. Use sigs.k8s.io/yaml or gopkg.in/yaml.v3 for unmarshaling.",
            },
            {
              question: "Write a Go main function that health-checks two URLs concurrently using goroutines and prints OK or FAIL for each.",
              answer: "var wg sync.WaitGroup; for _, url := range []string{\"http://a.com/health\", \"http://b.com/health\"} { wg.Add(1); go func(u string) { defer wg.Done(); resp, err := http.Get(u); if err != nil || resp.StatusCode >= 400 { fmt.Println(\"FAIL\", u) } else { fmt.Println(\"OK\", u) } }(url) }; wg.Wait()",
              type: "hands-on",
              hint: "Use sync.WaitGroup to wait for all goroutines. Pass the URL as a function argument (not a closure over the loop variable) to avoid the loop variable capture bug.",
            },
          ],
        },
      ],
    },
  ],
};
