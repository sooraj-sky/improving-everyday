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

Unix was designed around a powerful philosophy: every program should do one thing well, read from standard input, and write to standard output. This means programs can be chained together using pipes (\`|\`), creating processing pipelines that rival dedicated scripts. The tools in this lesson — grep, sed, awk, sort, uniq, cut, tr, and wc — embody that philosophy. They were created at Bell Labs in the 1970s and remain the backbone of production log analysis, config transformation, and data extraction in modern DevOps.

The key mental model: text flows left to right through a pipeline. Each tool reads stdin, transforms it, and writes to stdout. No tool knows or cares what comes before or after it. This composability is why a 5-tool pipeline can replace hundreds of lines of Python.

---

## grep — Searching Text

\`grep\` (Global Regular Expression Print) reads lines from files or stdin and prints only those that match a pattern. The name comes from the ed editor command \`g/re/p\` — globally print lines matching a regular expression.

### How It Works

grep reads input line by line, evaluates the regex against each line, and outputs matching lines. It never modifies input — it only filters. The exit code is 0 if at least one match was found, 1 if none, 2 on error — this makes it composable with conditionals.

\`\`\`bash
# Basic match — print every line containing "ERROR"
grep "ERROR" app.log

# Case-insensitive (-i): matches ERROR, error, Error, eRrOr
grep -i "error" app.log

# Invert match (-v): lines that do NOT match (v = "inverse")
# Useful for filtering out noise like DEBUG and INFO lines
grep -v "DEBUG" app.log

# Recursive search (-r): walk directory trees
# Essential for project-wide searches across many files
grep -r "TODO" ./src/

# List only filenames (-l = "list"), not matching lines
# Useful when you just need to know WHICH files contain a pattern
grep -rl "password" ./config/

# Count matching lines per file (-c = "count")
# Does not print lines, only the count per file
grep -rc "WARN" ./logs/

# Context lines: show N lines before (-B), after (-A), or around (-C) each match
# Invaluable for understanding what happened before a crash
grep -C 3 "segfault" /var/log/syslog     # 3 lines before AND after
grep -A 5 "OOM killer" /var/log/syslog   # 5 lines after the match
grep -B 2 "connection refused" app.log   # 2 lines before

# Whole word match (-w): "log" won't match "logging" or "catalog"
grep -w "log" app.log

# Print only the matching part (-o), not the whole line
# Combined with -P (Perl regex), extremely powerful for extraction
grep -oP "user_id=\K[0-9]+" auth.log   # \K resets the match start

# Show line numbers (-n): critical for debugging config files
grep -n "server_name" /etc/nginx/nginx.conf

# Suppress errors about unreadable files (-s = "silent")
grep -rs "pattern" /proc/ 2>/dev/null
\`\`\`

### Extended and Perl-Compatible Regex

grep supports three regex flavors with different capabilities:

- **Basic regex (BRE)** — default, older syntax, some operators like \`+\` need escaping
- **Extended regex (ERE)** — \`-E\` flag, enables \`+\`, \`?\`, \`|\`, \`()\` without backslashes
- **Perl-compatible regex (PCRE)** — \`-P\` flag, enables lookaheads, lookbehinds, non-greedy matching, named groups, and the \`\K\` reset

\`\`\`bash
# -E enables extended regex — use | for alternation, + for one-or-more
grep -E "ERROR|FATAL|CRITICAL" app.log

# Match an IPv4 address at the start of each line
# {n} repetition requires -E
grep -E "^[0-9]{1,3}(\.[0-9]{1,3}){3}" access.log

# -P enables Perl-compatible regex
# Positive lookbehind: match only the word after "user="
grep -P "(?<=user=)\w+" auth.log

# \K resets the start of the match (more powerful than lookbehind)
# Extract only the number from "duration=142ms" lines
grep -oP "duration=\K[0-9]+" app.log

# Named capture groups and non-greedy matching
grep -oP 'error="(?P<msg>[^"]+)"' app.log

# Exclude certain file types when searching recursively
grep -r --include="*.go" --exclude-dir=vendor "TODO" .
\`\`\`

### Common Mistakes with grep

A frequent mistake is forgetting that grep's exit code 1 (no match) triggers \`set -e\` in scripts. Protect against this:

\`\`\`bash
# WRONG — script exits silently if no matches found
set -e
COUNT=$(grep -c "ERROR" app.log)

# RIGHT — use || true to allow non-match exit code
COUNT=$(grep -c "ERROR" app.log || true)

# Or test for existence separately
if grep -q "CRITICAL" app.log; then
  echo "Critical errors found"
fi
\`\`\`

---

## sed — Stream Editor

\`sed\` (Stream EDitor) applies editing commands to text as it flows through a stream. Unlike a regular text editor, sed processes one line at a time and can edit files in-place without loading them fully into memory — critical for multi-gigabyte log files.

### How sed Works: Pattern Space and Address Mechanism

sed maintains a **pattern space** (the current line being processed) and an optional **hold space** (a scratchpad). For each input line, sed: copies the line into the pattern space, applies commands, then (by default) prints the pattern space to stdout.

The **address mechanism** controls which lines a command applies to:
- No address: applies to every line
- Single line number: \`3d\` deletes only line 3
- Last line: \`\$\` refers to the last line
- Regex address: \`/pattern/d\` deletes lines matching pattern
- Range: \`5,10d\` deletes lines 5 through 10
- Regex range: \`/BEGIN/,/END/d\` deletes from first match to second match

\`\`\`bash
# The s (substitute) command: s/pattern/replacement/flags
# Without the g flag: replaces only the FIRST match per line
sed 's/foo/bar/' file.txt

# With g (global) flag: replaces ALL matches per line
# This is the flag you forget and then wonder why only the first changed
sed 's/foo/bar/g' file.txt

# i flag (case-insensitive substitution)
sed 's/error/ERROR/gi' app.log

# Edit the file in-place — -i takes a backup suffix (or '' on macOS)
# ALWAYS test without -i first and verify output before going in-place
sed -i '' 's/localhost/db.prod.internal/g' app.conf   # macOS
sed -i 's/localhost/db.prod.internal/g' app.conf      # Linux/GNU

# Use a different delimiter when the pattern contains /
# This avoids escaping URLs like http://old-api/v1
sed 's|http://old-api/v1|https://new-api/v2|g' config.yaml

# Delete lines matching a pattern (d command)
sed '/^#/d' config.ini        # strip comment lines (start with #)
sed '/^$/d' file.txt          # strip blank lines (empty lines)
sed '/DEBUG/d' app.log        # remove debug log lines

# Print only matching lines: -n suppresses default output, p forces print
# Equivalent to grep but allows address ranges and other sed logic
sed -n '/ERROR/p' app.log

# Address ranges: act only on a range of lines
sed -n '10,20p' bigfile.txt              # print lines 10-20 only
sed '1d' file.txt                         # delete the header line
sed '$d' file.txt                         # delete the last line

# Regex address ranges: delete everything between BEGIN and END markers
# Useful for removing sections from config templates
sed '/BEGIN CERT/,/END CERT/d' bundle.pem

# Insert (i) a line BEFORE the matching line
# Append (a) a line AFTER the matching line
sed '/^server {/i upstream backend { server 127.0.0.1:8080; }' nginx.conf
sed '/listen 80;/a \    listen [::]:80;' nginx.conf   # add IPv6 after IPv4

# Change (c) an entire line matching the pattern
sed '/^JAVA_OPTS=/c JAVA_OPTS="-Xmx2g -Xms512m"' /etc/default/myapp

# Multi-expression: chain multiple commands with -e or semicolons
sed -e 's/WARN/WARNING/g' -e 's/ERR$/ERROR/g' app.log
sed 's/WARN/WARNING/g; s/ERR$/ERROR/g' app.log   # equivalent

# Practical: increment a version number in a Makefile
# Extracts the number after VERSION = and increments it
sed 's/VERSION = \([0-9]*\)/echo "VERSION = \$((\\1 + 1))"/e' Makefile
\`\`\`

### sed Address Ranges in Depth

The range \`/pattern1/,/pattern2/\` is especially powerful for config manipulation:

\`\`\`bash
# Extract a specific server block from nginx config
sed -n '/server_name api.example.com/,/^}/p' /etc/nginx/sites-available/

# Replace content of a specific YAML section (between two markers)
sed '/^  database:/,/^  [a-z]/{ /host:/s/.*/  host: prod.db.internal/ }' config.yaml

# Delete everything after a line matching a pattern (to end of file)
sed '/^# END CONFIG/,$d' config.ini
\`\`\`

---

## awk — Programmable Field Processor

\`awk\` is a complete programming language designed for processing structured text. Where grep filters lines and sed transforms text, awk can aggregate, compute, reformat, and report — all in a single pass through a file.

### How awk Works: Records, Fields, and Programs

awk reads input as **records** (default: one line = one record). Each record is split into **fields** by a separator (default: any whitespace). Fields are accessed as \$1, \$2, \$3, ... with \$0 being the entire record and \$NF being the last field.

An awk program is a series of \`pattern { action }\` pairs. For each record:
1. If pattern matches (or no pattern), execute action
2. Special patterns \`BEGIN\` and \`END\` run before/after all input

\`\`\`bash
# Print the 2nd and 5th fields (default separator: whitespace)
awk '{print \$2, \$5}' access.log

# -F sets the field separator (like cut -d but smarter)
awk -F: '{print \$1}' /etc/passwd         # extract usernames
awk -F, '{print \$3}' data.csv            # 3rd column of CSV
awk -F'\t' '{print \$2}' data.tsv         # TSV second column

# Built-in variables:
# NR = Number of Records (total lines seen so far)
# NF = Number of Fields in current record
# FS = Field Separator (modifiable per-line)
# RS = Record Separator (default: newline)
# OFS = Output Field Separator (used between fields in print)

# Print record number and line for every 100th line (header + sampling)
awk 'NR==1 || NR%100==0 {print NR, \$0}' bigfile.txt

# Lines with more than 3 fields (dynamic content check)
awk 'NF > 3' data.txt

# Lines where the 5th field is greater than 1000
awk '\$5 > 1000 {print \$0}' metrics.log

# BEGIN block: runs once before any input (initialization, headers)
# END block: runs once after all input (aggregation, summaries)
awk 'BEGIN { print "Bytes by IP:"; total=0 }
     { total += \$10; bytes[\$1] += \$10 }
     END { for (ip in bytes) printf "%-20s %10d\\n", ip, bytes[ip] }
    ' access.log | sort -k2 -rn

# Conditional logic — HTTP 5xx responses (field 9 = status code)
awk '\$9 >= 500 && \$9 < 600 {print \$1, \$7, \$9}' access.log

# printf for precise formatting (just like C)
# %-20s = left-aligned, 20-char wide string; %8.2f = 8-wide float with 2 decimals
awk '{printf "%-20s %8.2f MB\\n", \$1, \$2/1024}' disk_usage.txt

# Associative arrays: awk's built-in hash maps — keys can be strings or numbers
# Count HTTP status code occurrences across the entire log
awk '{codes[\$9]++} END {for (c in codes) print c, codes[c]}' access.log | sort -n

# Real-world: top 10 IPs by request count from nginx combined log format
# Field 1 is remote IP in standard nginx log format
awk '{print \$1}' access.log | sort | uniq -c | sort -rn | head -10

# Multi-value aggregation: requests and bytes per HTTP method
awk '{method[\$6]++; bytes[\$6]+=\$10}
     END {for (m in method) printf "%-8s %6d requests  %10d bytes\\n", m, method[m], bytes[m]}
    ' access.log | sort

# Reformatting: convert space-separated to CSV
awk 'BEGIN{OFS=","} {print \$1,\$2,\$3}' data.txt

# Getline: read the next line within an awk action
# Useful for processing two-line records (key on line N, value on line N+1)
awk '/^HOST:/ { getline value; print substr(\$0, 6), value }' headers.txt

# Piping within awk: send output to a system command
awk '/CRITICAL/ { print | "mail -s 'Alert' ops@example.com" }' app.log
\`\`\`

### awk vs cut for Field Extraction

\`cut\` is faster and simpler for fixed-delimiter extraction. \`awk\` is more powerful for:
- Multiple field separators
- Computed field numbers (\$NF, \$(NF-1))
- Conditional logic on the extracted fields
- Aggregation across all records

Use \`cut\` when you just need columns. Use \`awk\` when you need logic.

---

## sort, uniq, cut, tr, wc

These tools are the connective tissue of any pipeline.

### sort — Ordering Lines

sort reads all input, then outputs it sorted. The default is lexicographic (dictionary order). Numeric sort (-n) is completely different — without it, "10" sorts before "9".

\`\`\`bash
# Lexicographic sort (default): "10" < "2" because "1" < "2" as chars
sort names.txt

# Numeric sort (-n): 2 < 10 as numbers
sort -n numbers.txt

# Reverse order (-r)
sort -rn sizes.txt

# Sort by a specific field (-k) with a custom delimiter (-t)
# -k3 means "sort by field 3"
# -k2,2n means "sort by field 2 only (not continuing to field 3), numerically"
sort -t: -k3 -n /etc/passwd              # sort by UID
sort -t$'\\t' -k3 -rn data.tsv            # tab-delimited, field 3, numeric, reverse

# Sort by multiple keys (primary and secondary sort)
sort -k1,1 -k2,2n data.tsv               # field 1 alphabetically, then field 2 numerically

# Human-readable size sort (-h): understands K, M, G suffixes
du -sh /var/log/* | sort -rh             # largest directories first

# Unique sort (-u): sort and remove duplicates in one pass (faster than sort | uniq)
sort -u names.txt

# Stability: GNU sort is stable (-s explicit), preserves equal-key order
sort -s -k1,1 data.txt

# Large file sort (-S buffer size): increase memory to avoid disk spills
sort -S 2G bigfile.txt
\`\`\`

### uniq — Collapse Consecutive Duplicates

**Critical caveat:** uniq only collapses ADJACENT duplicate lines. You almost always need to sort first.

\`\`\`bash
# Basic deduplication (must be sorted!)
sort words.txt | uniq

# Count occurrences (-c): prepends a count to each unique line
# The count + sort -rn pattern is the foundation of frequency analysis
sort words.txt | uniq -c

# Show ONLY duplicate lines (-d = "duplicates")
sort words.txt | uniq -d

# Show ONLY unique lines — appeared exactly once (-u)
sort words.txt | uniq -u

# Ignore case when comparing (-i)
sort -f words.txt | uniq -i

# Compare only first N characters (-w N)
sort log.txt | uniq -w 10   # deduplicate based on first 10 chars only
\`\`\`

### cut — Extract Columns by Position or Delimiter

\`cut\` extracts sections from each line. Fast but limited — no regex, no conditionals.

\`\`\`bash
# Extract fields by delimiter (-d) and field numbers (-f)
cut -d: -f1 /etc/passwd                 # usernames (field 1)
cut -d: -f1,3 /etc/passwd               # username and UID (fields 1 and 3)
cut -d: -f1-3 /etc/passwd               # fields 1 through 3
cut -d, -f2- report.csv                 # all fields from 2 onwards (skip first)

# Extract by character position (-c)
cut -c1-10 file.txt                     # first 10 characters of each line
cut -c5-   file.txt                     # from character 5 to end of line

# Practical: extract the second column from a space-separated file
# Note: multiple spaces = multiple delimiters, which confuses cut
# awk handles this better: awk '{print $2}'
cut -d' ' -f2 file.txt  # only works if exactly one space between fields
\`\`\`

### tr — Character Translation

\`tr\` operates on individual characters, not patterns. It's the fastest tool for character-level transformations.

\`\`\`bash
# Translate (map) characters: a-z to A-Z (uppercase)
echo "hello world" | tr 'a-z' 'A-Z'

# Replace one character with another
echo "path/to/file" | tr '/' '.'           # dots instead of slashes
echo "192.168.1.1" | tr '.' '_'            # safe filename from IP

# Delete characters (-d = "delete")
cat file.txt | tr -d '\\r'                  # strip Windows CRLF carriage returns
echo "h3ll0 w0rld" | tr -d '0-9'           # remove all digits

# Squeeze repeated characters (-s = "squeeze")
# Replaces runs of the same character with a single instance
echo "hello    world" | tr -s ' '          # squeeze spaces to one
echo "aaabbbccc" | tr -s 'a-z'             # squeeze any repeated lowercase

# Complement (-c = "complement"): operate on characters NOT in the set
echo "abc123def" | tr -cd '0-9'            # keep only digits
echo "hello!" | tr -cd 'a-zA-Z\\n'          # keep only letters and newlines

# Character classes (POSIX): [:alpha:], [:digit:], [:space:], [:upper:], [:lower:]
echo "Hello World" | tr '[:upper:]' '[:lower:]'  # portable lowercase
\`\`\`

### wc — Count Words, Lines, Bytes

\`\`\`bash
wc -l access.log          # line count — most common use in DevOps
wc -w essay.txt           # word count
wc -c binary.dat          # byte count (c = "characters" but actually bytes)
wc -m unicode.txt         # character count (multi-byte aware)

# Count without filename: pipe stdin
cat access.log | wc -l

# Multiple files: shows count per file and a total
wc -l /var/log/*.log

# Combine with grep: count matching lines
grep "ERROR" app.log | wc -l
# Note: use grep -c "ERROR" app.log instead — avoids a pipe process
\`\`\`

---

## How It Works: The Unix Pipeline Model

When you write \`grep "ERROR" app.log | awk '{print \$5}' | sort | uniq -c | sort -rn | head -10\`, the shell creates 6 processes connected by pipes. Each process reads from stdin as fast as the next one can consume — no intermediate files, no waiting for one to finish before the next starts. The kernel buffers data in pipe ring buffers (typically 64KB). This is why pipelines on a 10GB log file use almost no memory — only the buffer is in RAM at any time.

---

## Common Mistakes

1. **Forgetting \`uniq\` needs sorted input** — if you skip \`sort\`, identical non-adjacent lines don't collapse
2. **Not using \`-g\` in sed** — forgetting the global flag means only the first match per line is replaced
3. **Using \`cut\` for variable-width whitespace** — \`cut -d' ' -f2\` fails when fields have multiple spaces; use \`awk '{print \$2}'\` instead
4. **Not escaping dots in sed** — \`sed 's/10.0.0.1/10.0.0.2/g'\` matches "10X0X0X1" because \`.\` is regex "any char". Use \`sed 's/10\\.0\\.0\\.1/10.0.0.2/g'\`
5. **Comparing numbers without \`-n\`** — \`sort\` without \`-n\` sorts "100" before "20" because "1" < "2" lexicographically

---

## Combining It All — Real Pipeline Examples

\`\`\`bash
# Find the 5 slowest API endpoints from a log where field 7 is path and field 10 is ms
awk '{print \$7, \$10}' api.log | sort -k2 -rn | head -5

# Count unique 4xx errors by path — useful for finding broken links or bad clients
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

# Parse /var/log/nginx/access.log: find top 10 IPs with 5xx errors
# Standard nginx combined log: $1=IP $9=status $10=bytes
awk '\$9 >= 500 {errors[\$1]++} END {for (ip in errors) print errors[ip], ip}' \\
  /var/log/nginx/access.log | sort -rn | head -10

# Calculate error rate: percentage of 5xx responses in last 1000 lines
tail -1000 /var/log/nginx/access.log | \\
  awk '{total++; if (\$9>=500) errors++} END {printf "Error rate: %.1f%%\\n", errors*100/total}'

# Find files modified today that are larger than 10MB (audit log)
find /var/log -type f -newer /var/log/syslog -size +10M -exec ls -lh {} \\;
\`\`\`

## Production Pattern: Log Analysis One-Liner Template

\`\`\`bash
# Template for analyzing any structured log file:
# 1. Filter relevant lines (grep)
# 2. Extract the field you care about (awk)
# 3. Count occurrences (sort | uniq -c)
# 4. Show top N (sort -rn | head)
grep "<filter>" <logfile> | awk '{print \$<field_number>}' | sort | uniq -c | sort -rn | head -20

# Real example: top User-Agent strings in nginx log (field 12 onward, quoted)
grep -v "bot\\|crawler" /var/log/nginx/access.log \\
  | awk -F'"' '{print \$6}' \\
  | sort | uniq -c | sort -rn | head -20
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

These tools operate on files, archives, network resources, and structured data. In DevOps, they appear in every backup script, deployment pipeline, and API integration. Where the text-processing tools (grep, sed, awk) transform content, this group of tools manages where content lives — finding it, archiving it, synchronizing it, fetching it, and parsing it.

---

## find — Deep File Search

\`find\` traverses directory trees and evaluates a chain of predicates against each file it encounters. It is the right tool any time you need to act on files based on their properties (name, size, age, permissions) rather than their content.

### How find Works

find performs a depth-first traversal by default. It evaluates each found path against the predicate expression (AND is implicit, OR requires \`-o\`). Only when the full expression is true does find take action. The default action is \`-print\`, but you can substitute \`-delete\`, \`-exec\`, or \`-print0\`.

\`\`\`bash
# Basic: find all .log files from the current directory (recursive by default)
find . -name "*.log"

# -maxdepth limits traversal depth (1 = current directory only, no recursion)
find /var/log -maxdepth 1 -name "*.log"

# -mindepth skips the top N levels (useful to skip the root dir itself)
find /etc -mindepth 2 -name "*.conf"  # configs at least 2 levels deep

# By type: f=regular file, d=directory, l=symbolic link, p=named pipe, s=socket
find /var -type f -name "*.conf"
find /tmp -type d -empty          # empty directories (good for cleanup audits)
find /etc -type l                 # find all symlinks in /etc

# By size: k=kilobytes, M=megabytes, G=gigabytes
# + means "more than", - means "less than", no prefix means "exactly"
find /var/log -type f -size +100M          # files larger than 100 MB
find /home -type f -size -10k              # files smaller than 10 KB
find /data -type f -size +1G               # files larger than 1 GB (big file audit)

# By modification time:
# -mtime uses days (integer), -mmin uses minutes
# +N = more than N days/minutes ago (older)
# -N = less than N days/minutes ago (newer/recent)
find /tmp -mtime +7                        # files not modified in 7+ days (stale)
find /var/log -mmin -60                    # files modified in last 60 minutes
find /data -newer /tmp/checkpoint.txt      # files newer than a reference file

# By permissions: exact match or mode check
find /var/www -type f -perm 777            # world-writable files (security audit)
find /etc -type f -perm -o+w              # any file others can write (dangerous)
find /usr/local/bin -type f -perm -u+x    # executable by owner

# By owner
find /home -user alice -type f            # files owned by alice
find /var/run -not -user root -type f     # files NOT owned by root

# Combine predicates: AND is implicit (both must be true)
find . -name "*.py" -not -path "*/venv/*"  # Python files outside venv
find . -name "*.py" -not -path "*/.git/*" -not -path "*/node_modules/*"

# OR with -o (must wrap in parentheses, escaped from shell)
find . \\( -name "*.jpg" -o -name "*.png" -o -name "*.webp" \\) -size +1M

# -exec: run a command on each found file
# {} is replaced by the current filename
# \\; runs the command once per file (slower — one process per file)
find . -name "*.tmp" -exec rm {} \\;

# + batches all filenames into as few invocations as possible (much faster)
find . -name "*.sh" -exec chmod +x {} +

# -delete: atomic, faster than -exec rm — but no confirmation!
# Always test with -print first before using -delete
find /tmp -mtime +7 -type f -print        # FIRST: verify what will be deleted
find /tmp -mtime +7 -type f -delete       # THEN: delete

# -print0 + xargs -0: null-delimited pipeline, handles spaces in filenames
find . -name "*.log" -print0 | xargs -0 gzip

# Practical: find and delete empty directories (recursive cleanup)
find /data -type d -empty -delete

# Find files by inode number (useful after moving files)
find / -inum 1234567 2>/dev/null

# Find recently-changed config files (change audit)
find /etc -newer /etc/last_audit -type f -ls 2>/dev/null
\`\`\`

### Common find Mistakes

1. **Forgetting quotes on wildcards** — \`find . -name *.log\` expands glob in the shell before find runs, potentially matching only current directory. Always quote: \`find . -name "*.log"\`
2. **Not using \`-type f\`** — \`find /tmp -delete\` would delete directories too. Always specify \`-type f\` for file-only operations
3. **Using \`\\;\` for large batches** — one process per file is slow for thousands of files. Use \`+\` or pipe to \`xargs\`

---

## xargs — Build Commands from Input

\`xargs\` solves a fundamental Unix problem: many commands accept filenames as arguments, but you often have a list of filenames from stdin (from find, grep -l, etc.). xargs bridges this gap by converting stdin lines into command arguments.

### Why xargs Exists: The Argument Length Limit

Unix systems have a maximum command-line argument length (ARG_MAX, typically 2MB on Linux). If you try \`rm $(find . -name "*.log")\` with thousands of files, the shell expansion could exceed ARG_MAX and fail with "Argument list too long". xargs automatically batches arguments to stay under this limit.

\`\`\`bash
# Basic usage: pass stdin as arguments to a command
echo "file1.txt file2.txt file3.txt" | xargs rm

# -I{}: placeholder substitution — {} is replaced by each input item
# Required when you need the input somewhere other than the end of the command
find . -name "*.bak" | xargs -I{} mv {} {}.old

# Parallel execution with -P (N parallel processes)
# This is one of the simplest ways to parallelize file operations
find . -name "*.jpg" | xargs -P4 -I{} convert {} -resize 800x600 {}_resized.jpg
# -P4 = run up to 4 concurrent convert processes

# -n max-args: limit how many arguments per invocation
# Useful when the command only handles one item at a time
cat hosts.txt | xargs -n1 ping -c1     # ping each host in its own process
cat packages.txt | xargs -n5 apt-get install -y  # install 5 at a time

# -0 (zero): read null-delimited input (from find -print0)
# Handles filenames with spaces, tabs, newlines
find . -name "*.log" -print0 | xargs -0 -P2 gzip

# Combine find and xargs for project-wide operations
find . -name "*.go" -print0 | xargs -0 grep -l "TODO"
find . -name "*.yaml" -print0 | xargs -0 yamllint

# Dry run: see what WOULD happen
find /tmp -mtime +30 -print0 | xargs -0 -I{} echo "Would delete: {}"

# -t (trace): print each command before executing (debugging)
cat servers.txt | xargs -t -I{} ssh {} "uptime"

# Verify xargs is available and check its options on macOS vs Linux
# macOS (BSD xargs) differs from GNU xargs — -P exists on both, -d doesn't on macOS
# Use -print0 / -0 for cross-platform safety

# Real DevOps use: restart services on multiple servers
cat servers.txt | xargs -P5 -I{} ssh {} "sudo systemctl restart myapp"
\`\`\`

---

## tar — Archives

\`tar\` (Tape ARchive) combines multiple files and directories into a single file, optionally compressed. The name comes from its original use with magnetic tape drives. Despite its age (1979), it remains the standard for Unix archives.

### Why tar Separates Archive and Compress

tar itself creates an archive (bundles files + preserves metadata) without compression. Compression is delegated to gzip (-z), bzip2 (-j), or xz (-J). This separation is intentional: you can pipe a tar stream through any compression tool, or stream it directly to/from storage without creating intermediate files.

\`\`\`bash
# Creating archives — the flags spell out their meaning:
# -c create, -z gzip, -j bzip2, -J xz, -v verbose, -f file
tar -czf backup.tar.gz /var/www/html/    # gzip: fastest, moderate compression
tar -cjf archive.tar.bz2 ./data/         # bzip2: slower, better compression
tar -cJf archive.tar.xz ./data/          # xz: slowest, best compression (~30% better than gzip)

# Compression comparison for a typical directory:
# gzip:  compress=0.5s  decompress=0.1s  ratio=65%
# bzip2: compress=3s    decompress=1s    ratio=75%
# xz:    compress=15s   decompress=0.5s  ratio=80%
# For most DevOps use (CI artifacts, deployments): gzip wins (speed matters)
# For long-term storage: xz wins (ratio matters)

# Create with exclusions — critical for application backups
tar -czf app.tar.gz ./app/ \\
  --exclude="./app/node_modules" \\
  --exclude="./app/.git" \\
  --exclude="./app/__pycache__" \\
  --exclude="./app/*.pyc"

# Extract to a specific directory (-C = change directory before extracting)
tar -xzf backup.tar.gz -C /restore/

# List contents without extracting — verify an archive before extracting
tar -tzf backup.tar.gz | head -20
tar -tjf archive.tar.bz2 | grep "config"  # check if config files are in there

# Extract a single file from a large archive
tar -xzf backup.tar.gz ./app/config/settings.py

# Stream tar output to stdout (-f -) — avoids needing local disk space
# Pipe directly to S3 without creating the archive file locally
tar -czf - /opt/app | aws s3 cp - s3://my-bucket/backups/app-\$(date +%Y%m%d).tar.gz

# Stream from S3 and extract on the fly
aws s3 cp s3://my-bucket/backups/app-20240115.tar.gz - | tar -xzf - -C /opt/app/

# Incremental backup: only files newer than a reference timestamp
tar -czf incremental.tar.gz --newer-mtime="2024-01-01" /var/data/

# Add files to existing archive (only uncompressed .tar, not .tar.gz)
tar -rf existing.tar newfile.txt

# List archive with permissions and timestamps
tar -tvf backup.tar.gz | grep "config"
\`\`\`

### tar: The -C Flag and Path Conventions

A common tar pitfall: paths in the archive. If you run \`tar -czf backup.tar.gz /var/www/html\`, the archive contains absolute paths starting with \`/var/www/html/\`. Extracting without care will try to write to \`/var/www/html\` on the target machine.

Best practice: always \`cd\` first and use relative paths, or use \`-C\` to establish a relative root:

\`\`\`bash
# Bad: absolute paths in archive
tar -czf backup.tar.gz /var/www/html/  # paths start with var/www/html/

# Good: relative paths
tar -czf backup.tar.gz -C /var/www html/  # paths start with html/

# Extract safely to a target directory
tar -xzf backup.tar.gz -C /restore/       # extracts as /restore/html/
\`\`\`

---

## rsync — Smart File Synchronization

\`rsync\` is the right tool for any large-scale file synchronization. Unlike \`cp\` which always copies everything, rsync uses a **delta-transfer algorithm**: it breaks files into blocks, computes checksums, and only transfers blocks that have changed. This makes it orders of magnitude faster for keeping large directories in sync after an initial copy.

### How rsync's Delta Algorithm Works

1. rsync on the sender calculates checksums for each block of each file
2. rsync on the receiver does the same for its existing files
3. They compare checksums and only transfer blocks where they differ
4. On the receiver, modified blocks are patched into the existing file

For a 1GB file where only 10MB changed, rsync transfers ~10MB instead of 1GB. This is why rsync is used for deployments, backups, and CDN syncs.

\`\`\`bash
# Basic sync: trailing slash on source is CRITICAL — easy to get wrong
# With trailing slash: sync CONTENTS of src into dest
rsync -av /src/dir/ /dest/dir/        # files appear directly in /dest/dir/

# Without trailing slash: sync the DIRECTORY ITSELF into dest
rsync -av /src/dir  /dest/            # creates /dest/dir/ with files inside

# The -a (archive) flag is a shorthand for: -rlptgoD
# -r recursive  -l copy symlinks as symlinks  -p preserve permissions
# -t preserve timestamps  -g preserve group  -o preserve owner  -D device files
rsync -av /src/ /dest/

# Sync to remote over SSH — rsync uses SSH as transport by default for remote
rsync -avz -e ssh /local/app/ deploy@prod-server:/var/www/app/
# -z = compress during transfer (helpful for text files over slow networks)

# Custom SSH options (non-standard port, specific key)
rsync -av -e "ssh -p 2222 -i ~/.ssh/deploy_rsa" /src/ user@server:/dest/

# --delete: remove files in dest that are NOT in src
# This makes dest an exact MIRROR of src — use with extreme caution
# A wrong src path can delete all of dest
rsync -av --delete /src/ /dest/

# ALWAYS use --dry-run before any destructive rsync operation
# Shows exactly what WOULD be transferred/deleted without doing it
rsync -av --dry-run --delete /src/ /dest/

# --backup + --backup-dir: move deleted files to a dated backup instead of erasing
rsync -av --delete \\
  --backup --backup-dir=/backup/\$(date +%Y%m%d) \\
  /prod/ /mirror/

# --max-delete: abort if too many files would be deleted (safety net)
# Protects against accidentally syncing an empty source over a full dest
rsync -av --delete --max-delete=100 /src/ /dest/

# Exclude patterns — patterns are matched against the relative path from src
rsync -av --exclude="*.log" --exclude="node_modules/" --exclude=".git/" /src/ /dest/
rsync -av --exclude-from=".rsyncignore" /src/ /dest/

# Preserve extended attributes and ACLs (system backup)
rsync -aAXHv /home/ /backup/home/
# -A preserve ACLs  -X preserve extended attributes  -H preserve hard links

# Show progress for large transfers (--info=progress2 for overall progress)
rsync -av --progress large_file.iso user@server:/storage/
rsync -av --info=progress2 /big/dir/ /dest/

# Bandwidth limit (KB/s) — prevent saturating production network
rsync -av --bwlimit=50000 /data/ /backup/   # limit to 50 MB/s

# Verify transfer integrity with checksums (slower but trustworthy)
rsync -avc /src/ /dest/    # -c = compare by checksum, not just size+timestamp
\`\`\`

---

## curl — HTTP Swiss Army Knife

\`curl\` (Client URL) is a command-line tool for transferring data using any network protocol — but it's primarily used for HTTP. In DevOps, it's indispensable for health checks, API calls, downloading artifacts, and testing endpoints.

### How curl Works: The Request Lifecycle

When you run \`curl https://api.example.com/data\`, curl:
1. Resolves DNS for api.example.com
2. Establishes a TCP connection
3. Performs TLS handshake (for HTTPS)
4. Sends the HTTP request (method, headers, body)
5. Receives the response
6. Outputs response body to stdout (or to a file with \`-o\`)

\`\`\`bash
# GET request (default method)
curl https://api.example.com/users

# Follow HTTP redirects (-L = --location): essential for URLs that redirect
# Without -L, curl returns the 301/302 response itself, not the final page
curl -L https://short.url/abc

# Show HTTP response code and timing without the body (-w = --write-out)
curl -s -o /dev/null -w "%{http_code} %{time_total}s\\n" https://api.example.com/health
# Output: 200 0.043s

# Save response to file (-o = --output)
curl -o release.tar.gz https://releases.example.com/v1.0.tar.gz

# Custom request method (-X = --request)
curl -X DELETE https://api.example.com/users/123
curl -X PUT -H "Content-Type: application/json" -d '{"status":"inactive"}' https://api.example.com/users/123

# Custom headers (-H = --header): authentication and content type
curl -H "Authorization: Bearer \$TOKEN" \\
     -H "Content-Type: application/json" \\
     -H "X-Request-ID: \$(uuidgen)" \\
     https://api.example.com/protected

# POST JSON body (-d = --data)
curl -X POST \\
     -H "Content-Type: application/json" \\
     -d '{"name":"deploy","status":"started","version":"v2.3.1"}' \\
     https://api.example.com/events

# POST form data (application/x-www-form-urlencoded)
curl -X POST -d "username=admin&password=secret" https://app/login

# POST multipart form data (-F = --form): file uploads
curl -F "file=@/path/to/artifact.zip" -F "name=release" https://upload.example.com/

# Show response headers only (-I = HEAD request)
curl -I https://example.com
# Check headers without downloading body (cache headers, redirects, TLS info)

# Show both request and response headers (-v = verbose)
# Essential for debugging authentication or SSL issues
curl -v https://api.example.com/data 2>&1 | head -50

# -f (--fail): exit with code 22 on HTTP 4xx/5xx — crucial for CI/CD scripts
# Without -f, curl exits 0 even on a 404 response
curl -f -s https://api.example.com/health || { echo "Health check failed"; exit 1; }

# -s (--silent): suppress progress meter and error messages
# Always use in scripts where output will be parsed

# Retry on failure (--retry N): useful for flaky endpoints
curl --retry 3 --retry-delay 2 --retry-max-time 30 https://api.example.com/data

# Timeout settings: --connect-timeout = TCP connect, --max-time = total transfer
curl --connect-timeout 5 --max-time 30 https://api.example.com/data

# Skip TLS certificate verification (-k = --insecure)
# DANGEROUS in production — use only for debugging self-signed certs
curl -k https://self-signed.internal.example.com

# Upload with progress and resume capability (-C - = resume from where we left off)
curl -C - -o large_file.iso https://mirror.example.com/ubuntu.iso

# Get metrics about a request (-w with all timing fields)
curl -s -o /dev/null -w "\\
  dns: %{time_namelookup}s\\n\\
  connect: %{time_connect}s\\n\\
  ssl: %{time_appconnect}s\\n\\
  ttfb: %{time_starttransfer}s\\n\\
  total: %{time_total}s\\n" https://api.example.com/

# Use a config file to store common options (avoids repeating -H everywhere)
# ~/.curlrc or per-project .curlrc
curl --config .curlrc https://api.example.com/data
# .curlrc contents: header = "Authorization: Bearer mysecrettoken"
\`\`\`

---

## jq — JSON Processor

\`jq\` is a lightweight, streaming JSON processor. Every DevOps engineer needs it for parsing AWS CLI output, Kubernetes API responses, GitHub API calls, and any service that speaks JSON.

### How jq Works

jq reads JSON input (from a file or stdin), applies a filter expression, and outputs the result as JSON. Filters are composable: \`.\` is the identity (output everything), \`.foo\` extracts a field, \`.foo.bar\` navigates nested objects, \`.foo[]\` iterates an array. Filters are chained with \`|\` just like shell pipes.

\`\`\`bash
# Pretty-print JSON (. is the identity filter — output everything, formatted)
curl -s https://api.example.com/users | jq '.'

# Extract a single field (.fieldname accesses an object key)
echo '{"name":"alice","age":30}' | jq '.name'
# Output: "alice"  (with JSON quoting)

# -r (raw output): strip JSON string quoting — essential when piping to other commands
echo '{"name":"alice"}' | jq -r '.name'
# Output: alice  (no quotes)

# -c (compact output): single line per result — good for logging
kubectl get pods -o json | jq -c '.items[] | {name: .metadata.name}'

# Iterate over an array (.[] expands each element)
curl -s https://api.example.com/pods | jq '.[] | .metadata.name'
curl -s https://api.example.com/users | jq -r '.[].email'   # list all emails (raw)

# select(): filter objects — like WHERE in SQL
# Only output objects where the condition is true
curl -s https://api.example.com/pods | jq '.[] | select(.status.phase == "Failed")'
kubectl get pods -o json | jq '.items[] | select(.metadata.namespace == "production")'

# Build new objects from existing data
kubectl get pods -o json | jq '.items[] | {name: .metadata.name, status: .status.phase, node: .spec.nodeName}'

# map(): transform every element in an array
echo '[{"v":"1.0"},{"v":"2.0"}]' | jq '[.[] | .v]'
# Shorter equivalent: jq '[.[].v]'

# Count elements in array
kubectl get pods -o json | jq '.items | length'

# Array indexing and slicing
echo '{"servers":[{"host":"a"},{"host":"b"}]}' | jq '.servers[1].host'  # by index
echo '{"servers":[{"host":"a"},{"host":"b"}]}' | jq '.servers[-1].host' # last element

# // (alternative operator): default value if null or missing
echo '{"name":"alice"}' | jq '.age // 0'   # 0 if age is absent

# String interpolation with \(.expression)
kubectl get pods -o json | jq -r '.items[] | "Pod: \(.metadata.name) [\(.status.phase)] on \(.spec.nodeName)"'

# @csv and @tsv: format for spreadsheet export
kubectl get pods -o json | jq -r '.items[] | [.metadata.name, .status.phase, .spec.nodeName] | @tsv'

# --arg: inject shell variables safely (avoids shell injection into jq filters)
NAMESPACE="production"
kubectl get pods -o json | jq --arg ns "\$NAMESPACE" '.items[] | select(.metadata.namespace == \$ns)'

# Real-world: parse AWS EC2 describe-instances
# Navigating the nested Reservations[].Instances[] structure
aws ec2 describe-instances \\
  | jq '.Reservations[].Instances[] | {id: .InstanceId, ip: .PrivateIpAddress, state: .State.Name, type: .InstanceType}'

# Real-world: get all container images across all pods (for security scanning)
kubectl get pods -A -o json | jq -r '.items[].spec.containers[].image' | sort -u

# Aggregate: count pods by namespace
kubectl get pods -A -o json | jq -r '.items[].metadata.namespace' | sort | uniq -c | sort -rn
\`\`\`

---

## yq — YAML Processor

\`yq\` brings jq-like querying to YAML files. It is indispensable for Kubernetes manifests, Helm values files, GitHub Actions workflows, and any YAML-heavy infrastructure.

\`yq\` preserves YAML formatting, comments, and anchors during in-place edits — something \`sed\` cannot do reliably. It also converts between YAML and JSON, making it a bridge tool in pipelines.

\`\`\`bash
# Read a value from YAML (same syntax as jq)
yq '.spec.replicas' deployment.yaml

# Update a value in-place (-i): preserves comments and formatting
yq -i '.spec.replicas = 3' deployment.yaml

# Update a deeply nested value (bump container image)
yq -i '.spec.template.spec.containers[0].image = "myapp:v2.3.1"' deployment.yaml

# Read from multiple YAML files at once (audit all manifests)
yq '.metadata.name' *.yaml

# Convert YAML to JSON (for tools that only speak JSON)
yq -o=json '.' values.yaml

# Convert JSON to YAML (-P = pretty-print YAML)
cat config.json | yq -P '.'

# Merge YAML files: apply overrides on top of base values
# Mimics how Helm merges values.yaml with environment-specific overrides
yq '. * load("production-overrides.yaml")' base-values.yaml

# Deep merge two YAML files
yq eval-all 'select(fileIndex == 0) * select(fileIndex == 1)' base.yaml overrides.yaml

# Extract all container image names from a Kubernetes deployment
yq '.spec.template.spec.containers[].image' deployment.yaml

# Find all services using a specific image version (audit)
yq 'select(.spec.template.spec.containers[].image == "nginx:1.21") | .metadata.name' *.yaml

# Validate YAML syntax (exits non-zero on malformed YAML)
yq '.' suspicious.yaml > /dev/null && echo "Valid YAML" || echo "Invalid YAML"

# Extract GitHub Actions job names from a workflow
yq '.jobs | keys | .[]' .github/workflows/ci.yml
\`\`\`

---

## How It Works: Combining These Tools in Production

The real power emerges when you chain these tools. Each tool handles one concern:
- **find**: locate files by properties
- **xargs**: convert file list to command arguments with parallelism
- **tar**: bundle/unbundle files efficiently
- **rsync**: synchronize to remote with delta transfers
- **curl**: fetch/send over HTTP with retry logic
- **jq/yq**: parse/transform structured data

\`\`\`bash
# Find all Kubernetes YAML files not updated in 30 days and archive them
# find outputs null-delimited names → tar reads them from stdin with --null -T -
find ./manifests -name "*.yaml" -mtime +30 -print0 \\
  | tar -czf old_manifests_\$(date +%Y%m%d).tar.gz --null -T -

# Query all running pod names via kubectl + jq, then curl a health endpoint for each
# jq -r strips JSON quoting; xargs -I{} substitutes each pod name into the URL
kubectl get pods -o json \\
  | jq -r '.items[] | select(.status.phase=="Running") | .metadata.name' \\
  | xargs -I{} curl -sf http://{}.pod.cluster.local/healthz

# Download, verify, and extract a release tarball
# curl -L follows redirects; sha256sum -c verifies integrity before extracting
VERSION="2.3.1"
curl -Lo /tmp/app.tar.gz "https://releases.example.com/app-\${VERSION}.tar.gz"
curl -Lo /tmp/app.tar.gz.sha256 "https://releases.example.com/app-\${VERSION}.tar.gz.sha256"
sha256sum -c /tmp/app.tar.gz.sha256 && tar -xzf /tmp/app.tar.gz -C /opt/app/

# Rotate old logs: compress logs older than 7 days, delete compressed logs older than 30
find /var/log/myapp -name "*.log" -mtime +7 -not -name "*.gz" -print0 \\
  | xargs -0 gzip -9
find /var/log/myapp -name "*.log.gz" -mtime +30 -delete

# Deploy to multiple servers: rsync app and restart service in parallel
cat servers.txt | xargs -P4 -I{} sh -c \\
  'rsync -az ./dist/ {}:/var/www/app/ && ssh {} "sudo systemctl restart myapp"'
\`\`\`

## Common Mistakes

1. **rsync trailing slash confusion** — \`rsync /src/dir/ /dest/\` vs \`rsync /src/dir /dest/\` produce different results. Always verify with \`--dry-run\` first
2. **curl without \`-f\`** — curl exits 0 on a 404 response. Use \`-f\` or check \`-w "%{http_code}"\` in scripts
3. **jq without \`-r\`** — JSON string quoting breaks downstream commands. Always use \`-r\` for string output
4. **find \`-exec\` with \`\\;\` on many files** — spawns one process per file. Use \`+\` for batch processing instead
5. **Not verifying tar archives** — always run \`tar -tzf archive.tar.gz\` to verify before extracting or distributing`,
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
      exam: [
        {
          question: "You need to search all .log files under /var/log recursively for lines containing 'CRITICAL' or 'FATAL', but the directory has thousands of files and you want the fastest possible result. What command do you use?",
          answer: "grep -r -E 'CRITICAL|FATAL' /var/log --include='*.log'. The -E flag enables extended regex for alternation. grep -r handles recursion natively without needing find | xargs. For even faster results on large trees, use ripgrep (rg 'CRITICAL|FATAL' /var/log) which uses multiple threads by default.",
          difficulty: "junior",
        },
        {
          question: "You run 'find /var/log -name *.log | xargs grep ERROR' but it fails with 'Argument list too long' or breaks on filenames with spaces. How do you fix both problems?",
          answer: "Use find -print0 and xargs -0: find /var/log -name '*.log' -print0 | xargs -0 grep ERROR. The -print0 flag outputs null-separated filenames and xargs -0 reads them, safely handling filenames with spaces, tabs, or special characters. This also avoids the 'Argument list too long' issue because xargs automatically batches arguments.",
          difficulty: "mid",
        },
        {
          question: "You have a CSV file where the third column is a response time in milliseconds. Write a one-liner to calculate the average response time across all rows.",
          answer: "awk -F',' '{sum += $3; count++} END {print sum/count}' responses.csv. awk -F',' sets the field separator to comma. The main block accumulates sum and count for each row. The END block divides after all rows are processed. For more precision: awk -F',' '{sum += $3; count++} END {printf \"%.2f\\n\", sum/count}'.",
          difficulty: "mid",
        },
        {
          question: "You need to replace every occurrence of 'http://old-api.internal' with 'https://new-api.example.com' across 50 YAML config files in place. What sed command does this safely?",
          answer: "sed -i 's|http://old-api.internal|https://new-api.example.com|g' *.yaml. Use | as the delimiter instead of / because the URLs contain slashes, which would require escaping. On macOS, sed -i requires an empty string argument: sed -i '' 's|...|...|g' *.yaml. Always run without -i first and verify output before editing in place.",
          difficulty: "junior",
        },
        {
          question: "You want to find all files larger than 100MB under /data, print their sizes in human-readable format, and sort them largest first. Write the pipeline.",
          answer: "find /data -type f -size +100M -exec du -sh {} + | sort -rh. The find command locates files over 100MB, -exec du -sh {} + runs du on batches of files for human-readable sizes, and sort -rh sorts in reverse human-readable order (recognising K, M, G suffixes). Alternative: find /data -type f -size +100M -printf '%s\\t%p\\n' | sort -rn | awk '{printf \"%.0fMB\\t%s\\n\", $1/1024/1024, $2}'.",
          difficulty: "mid",
        },
        {
          question: "Your CI pipeline downloads a JSON response from an API and needs to extract all 'id' fields from a nested array at '.data.items[].id'. Write the jq command.",
          answer: "curl -s https://api.example.com/items | jq -r '.data.items[].id'. The -r flag outputs raw strings without JSON quoting, which is important when piping IDs to other commands. To handle null values safely: jq -r '.data.items[] | .id // empty'. To get a comma-separated list: jq -r '[.data.items[].id] | join(\",\")'.",
          difficulty: "junior",
        },
        {
          question: "You need to archive the /opt/app directory to S3, but want to stream the tar output directly to an S3 bucket without writing a local file. How do you do this?",
          answer: "tar -czf - /opt/app | aws s3 cp - s3://my-bucket/backups/app-$(date +%Y%m%d).tar.gz. The -f - tells tar to write to stdout instead of a file. aws s3 cp reads from stdin when the source is -. This avoids needing local disk space equal to the archive size, which is critical on servers with limited storage.",
          difficulty: "senior",
        },
        {
          question: "You need to use rsync to deploy a web app to 10 servers listed in servers.txt, running the transfers in parallel (4 at a time). Write the shell pipeline.",
          answer: "cat servers.txt | xargs -P4 -I{} rsync -avz --delete ./dist/ {}:/var/www/html/. xargs -P4 runs 4 rsync processes concurrently. -I{} substitutes each server hostname into the command. Alternatively: while read server; do rsync -avz ./dist/ $server:/var/www/html/ & done < servers.txt; wait — but xargs -P gives better control over concurrency.",
          difficulty: "senior",
        },
        {
          question: "A log file has lines like '2024-01-15 ERROR user_id=1234 message=Login failed'. You need to extract all unique user_ids that had errors. Write the pipeline.",
          answer: "grep 'ERROR' app.log | grep -oP 'user_id=\\K[0-9]+' | sort -u. grep -oP with \\K (Perl-compatible lookbehind reset) prints only the number after 'user_id='. sort -u sorts and removes duplicates. Alternative with awk: awk '/ERROR/ {match($0, /user_id=([0-9]+)/, a); if (a[1]) print a[1]}' app.log | sort -u.",
          difficulty: "mid",
        },
        {
          question: "You need to curl a REST API endpoint that returns a JWT token, then use that token in a second curl request to a protected endpoint. Write the two-step pipeline as a single shell expression.",
          answer: "TOKEN=$(curl -s -X POST https://api.example.com/auth -d '{\"user\":\"admin\",\"pass\":\"secret\"}' -H 'Content-Type: application/json' | jq -r '.token') && curl -s -H \"Authorization: Bearer $TOKEN\" https://api.example.com/protected/data. The $() captures the token from the first curl via jq, and && ensures the second request only runs if the first succeeds.",
          difficulty: "mid",
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

Bash (Bourne Again SHell) is the glue language of DevOps. It is already installed on every Linux server and macOS machine, needs no runtime or dependencies, and is the native language of the shell environment you're already working in. For automation tasks that orchestrate other tools (docker, kubectl, terraform, git), Bash is often the simplest and most direct choice.

The right mental model: a Bash script is a recorded sequence of interactive shell commands. Everything you can type at a prompt, you can put in a script. The difference is that scripts add variables, conditionals, loops, and functions to make those commands dynamic and reusable.

### The Shebang: How the Kernel Runs Scripts

Every script should start with a shebang line:

\`\`\`bash
#!/usr/bin/env bash
# deploy.sh — Deploy application to target environment
# Usage: ./deploy.sh <env> <version>
\`\`\`

When you run \`./deploy.sh\`, the kernel reads the first two bytes: if they are \`#!\` (hex 23 21), the kernel uses the rest of the line as the interpreter. The shebang is not a Bash comment — it is a kernel directive.

**\`#!/usr/bin/env bash\` vs \`#!/bin/bash\`:**
- \`#!/bin/bash\` hardcodes the path to bash. Fails on systems where bash is at \`/usr/local/bin/bash\` (e.g., macOS with Homebrew bash)
- \`#!/usr/bin/env bash\` searches \`PATH\` for \`bash\`, finding the right version regardless of where it is installed
- Always use \`env\` for portability in scripts you share across teams

Without a shebang, the script runs under \`/bin/sh\`, which may be dash (not bash) on Ubuntu/Debian systems. Bash-specific syntax (\`[[ ]]\`, arrays, \`declare -A\`) will fail under sh.

---

## Variables

Bash variables are untyped by default — everything is a string until you use arithmetic context.

\`\`\`bash
# Assignment: NO spaces around = (spaces make Bash interpret it as a command)
NAME="production"          # string
PORT=8080                  # still a string, but can be used arithmetically
TIMESTAMP=\$(date +%Y%m%d_%H%M%S)   # command substitution — runs date and captures output

# Referencing: always use double quotes around variable references
# Without quotes: word splitting and glob expansion happen on the value
echo "Deploying to \${NAME} on port \${PORT}"   # \${} is clearer when adjacent to text
echo "App: \${NAME}v2"                           # without {} this would look for $NAMEv2

# Variable expansion modifiers — extremely useful for default values and validation:
ENV=\${1:-"staging"}             # use \$1 if set and non-empty, else use "staging"
DB_HOST=\${DB_HOST:-"localhost"} # env var if set, else default (safe default for dev)
DB_HOST=\${DB_HOST:="localhost"} # same + also ASSIGN the default to the variable
REQUIRED=\${REQUIRED:?"ERROR: REQUIRED must be set"}  # exit with error if unset/empty
LENGTH=\${#NAME}                 # length of the string value of NAME

# Read-only variables: prevent accidental reassignment
readonly LOG_DIR="/var/log/myapp"
readonly SCRIPT_VERSION="1.0.0"

# Export: make the variable visible to child processes (subshells, commands run from script)
# Without export, variables are local to the current shell
export APP_ENV="production"
export DATABASE_URL="postgresql://prod-db:5432/myapp"
\`\`\`

### Variable Expansion for String Manipulation

Bash has built-in string operations that avoid spawning external processes (sed, awk):

\`\`\`bash
FILE="deploy-v2.3.1-linux-amd64.tar.gz"

# String length
echo "\${#FILE}"              # 38

# Remove shortest prefix matching pattern
echo "\${FILE#deploy-}"       # v2.3.1-linux-amd64.tar.gz

# Remove longest prefix matching pattern
echo "\${FILE##*-}"           # amd64.tar.gz   (greedy, removes everything up to last -)

# Remove shortest suffix matching pattern
echo "\${FILE%.tar.gz}"       # deploy-v2.3.1-linux-amd64

# Remove longest suffix matching pattern
echo "\${FILE%%.*}"           # deploy-v2  (greedy, removes from first dot to end)

# Find and replace first occurrence
echo "\${FILE/linux/darwin}"  # deploy-v2.3.1-darwin-amd64.tar.gz

# Find and replace ALL occurrences
echo "\${FILE//-/_}"          # deploy_v2.3.1_linux_amd64.tar.gz  (all hyphens to underscores)

# Uppercase / lowercase (Bash 4+)
echo "\${FILE^^}"             # DEPLOY-V2.3.1-LINUX-AMD64.TAR.GZ  (all uppercase)
echo "\${FILE,,}"             # deploy-v2.3.1-linux-amd64.tar.gz  (all lowercase)
echo "\${FILE^}"              # Deploy-...  (first char uppercase only)

# Substring: \${var:offset:length}
echo "\${FILE:7:6}"           # v2.3.1  (start at position 7, take 6 chars)
echo "\${FILE: -6}"           # tar.gz  (last 6 chars — note space before -)
\`\`\`

### Arrays

\`\`\`bash
# Indexed array (Bash 3+)
SERVERS=("web01" "web02" "web03")
echo "\${SERVERS[0]}"           # first element: web01
echo "\${SERVERS[-1]}"          # last element: web03 (negative indexing)
echo "\${SERVERS[@]}"           # ALL elements as separate words — ALWAYS quote!
echo "\${#SERVERS[@]}"          # count: 3
echo "\${!SERVERS[@]}"          # indices: 0 1 2

# Append to array (not concatenate — this adds a new element)
SERVERS+=("web04")
# Append multiple
SERVERS+=("db01" "db02")

# CRITICAL: always quote "\${SERVERS[@]}" in loops
# Without quotes, array elements with spaces are split
for server in "\${SERVERS[@]}"; do   # CORRECT: each element intact
  ssh "\$server" "uptime"
done

for server in \${SERVERS[@]}; do     # WRONG: spaces in names would break this
  ssh "\$server" "uptime"
done

# Slice: elements starting at index 1, count 2
echo "\${SERVERS[@]:1:2}"       # web02 web03

# Associative arrays (Bash 4+ — like hash maps / dicts)
declare -A CONFIG
CONFIG["host"]="db.prod.internal"
CONFIG["port"]="5432"
CONFIG["database"]="myapp"

echo "\${CONFIG[host]}"          # db.prod.internal
echo "\${!CONFIG[@]}"            # all keys: host port database
echo "\${CONFIG[@]}"             # all values

# Iterate over associative array
for key in "\${!CONFIG[@]}"; do
  echo "\$key = \${CONFIG[\$key]}"
done

# Common mistake: single-element assignment looks like array but isn't
WRONG=(web01)       # This creates an array with one element
RIGHT="web01"       # This is just a string

# Read a file into an array (Bash 4+)
mapfile -t LINES < /etc/hosts
echo "Lines: \${#LINES[@]}"
\`\`\`

---

## Arithmetic

Bash only does integer arithmetic natively. For floating-point, delegate to \`bc\` or \`awk\`.

\`\`\`bash
# (( )) for integer arithmetic — no dollar sign needed inside
COUNT=0
((COUNT++))           # increment (post-increment)
((COUNT += 10))       # add 10
((COUNT *= 2))        # multiply by 2
echo \$COUNT           # 22

# Arithmetic in conditions: (( )) returns exit code based on result
# (( 0 )) = exit code 1 (false), (( non-zero )) = exit code 0 (true)
if (( PORT > 1024 )); then
  echo "Unprivileged port (no root needed)"
fi

if (( COUNT % 2 == 0 )); then
  echo "\$COUNT is even"
fi

# \$(( )) for arithmetic expansion — assigns result to variable
TOTAL=\$((100 * 1024 * 1024))   # 104857600 (100 MB in bytes)
HALF=\$((TOTAL / 2))
PERCENT=\$((COUNT * 100 / TOTAL))

# TRAP: (( x-- )) when x=1 returns exit code 1 (value is 0 = false)
# This triggers set -e! Use: (( x-- )) || true
COUNT=1
((COUNT--)) || true   # safe decrement when set -e is active

# bc for floating-point arithmetic
# scale=2 means 2 decimal places
AVG=\$(echo "scale=2; \$TOTAL / 3" | bc)
echo "\$AVG"

# awk for floating-point (often faster and more portable than bc)
AVG=\$(awk "BEGIN { printf \"%.2f\", \$TOTAL / 3 }")

# Hex and octal
echo \$((0xFF))     # 255 — hex to decimal
echo \$((0777))     # 511 — octal to decimal
printf "%x\n" 255  # ff  — decimal to hex
\`\`\`

---

## Conditionals

### [[ ]] vs [ ] vs test — Why [[ ]] Wins

\`[[ ]]\` is a Bash keyword (not a process), offering significant advantages:
- No word splitting or glob expansion — unquoted \`\$var\` is safe
- Supports \`=~\` for regex matching
- Supports \`&&\` and \`\|\|\` directly inside without short-circuit issues
- \`<\` and \`>\` for string comparison work without escaping
- Pattern matching with \`==\` uses glob syntax

\`[ ]\` is the POSIX test command — portable to \`sh\` but fragile with unquoted variables.

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

# File tests — most common in DevOps scripts
if [[ -f "/etc/myapp/config.yaml" ]]; then echo "File exists"; fi
if [[ -d "/var/log/myapp" ]]; then echo "Directory exists"; fi
if [[ -r "\$FILE" ]]; then echo "File is readable"; fi
if [[ -w "\$FILE" ]]; then echo "File is writable"; fi
if [[ -x "\$SCRIPT" ]]; then echo "File is executable"; fi
if [[ -s "\$FILE" ]]; then echo "File is not empty (size > 0)"; fi
if [[ -L "\$PATH" ]]; then echo "Is a symbolic link"; fi
if [[ -e "\$PATH" ]]; then echo "Exists (any type)"; fi

# String tests
if [[ -z "\$VAR" ]]; then echo "Empty string (zero length)"; fi
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
      exam: [
        {
          question: "Your Bash script sources a config file with 'source config.env', but config.env has a syntax error. With 'set -e' enabled, what happens and how do you handle it safely?",
          answer: "With set -e, a syntax error in sourced file causes the script to exit immediately at the source line. To handle safely: use 'if ! source config.env; then echo \"Failed to load config\" >&2; exit 1; fi' — the if statement prevents -e from triggering automatically and lets you emit a helpful error. Alternatively, validate with bash -n config.env before sourcing.",
          difficulty: "mid",
        },
        {
          question: "You write a function 'deploy()' that creates a temp dir and runs several commands. If any command fails, the temp dir must be cleaned up. How do you implement this robustly?",
          answer: "Register a trap inside the function scope using a local cleanup function: deploy() { local TMPDIR; TMPDIR=$(mktemp -d); cleanup() { rm -rf \"$TMPDIR\"; }; trap cleanup RETURN ERR; ... commands ... }. Trapping on both RETURN and ERR ensures cleanup runs whether the function returns normally or on error. Use 'local' for TMPDIR so it doesn't pollute the global scope.",
          difficulty: "senior",
        },
        {
          question: "Your script uses 'set -o pipefail' but you have a pipeline 'cmd | tee output.log | grep pattern' where you want the script to fail if 'cmd' fails, but 'grep' finding no matches (exit 1) should not fail the script. How do you handle this?",
          answer: "Use 'cmd | tee output.log | grep pattern || true'. The '|| true' prevents grep's non-zero exit from triggering pipefail. For more granular control: { cmd | tee output.log; } | { grep pattern || true; }. If you need to check whether grep found matches separately, capture the output: output=$(cmd | tee output.log); echo \"$output\" | grep pattern || echo 'No matches'.",
          difficulty: "senior",
        },
        {
          question: "You have an array of server names and need to deploy to all of them in parallel, collecting which ones failed. Write the Bash logic.",
          answer: "SERVERS=(web1 web2 web3 db1); FAILED=(); for server in \"${SERVERS[@]}\"; do (deploy_to \"$server\" || echo \"$server\" >> /tmp/failed_$$) & done; wait; if [[ -f /tmp/failed_$$ ]]; then mapfile -t FAILED < /tmp/failed_$$; rm /tmp/failed_$$; echo \"Failed: ${FAILED[*]}\"; fi. Using a temp file with the PID ($$ ) avoids race conditions when multiple background processes write failures.",
          difficulty: "senior",
        },
        {
          question: "Your script accepts a --env flag that should only accept 'dev', 'staging', or 'prod'. Write the argument parsing and validation logic in Bash.",
          answer: "ENV=''; while [[ $# -gt 0 ]]; do case $1 in --env) ENV=\"$2\"; shift 2 ;; *) echo \"Unknown arg: $1\" >&2; exit 1 ;; esac; done; if [[ ! \"$ENV\" =~ ^(dev|staging|prod)$ ]]; then echo \"--env must be dev, staging, or prod\" >&2; exit 1; fi. The =~ operator with a regex in [[ ]] performs the validation without needing case statements or external tools.",
          difficulty: "mid",
        },
        {
          question: "A Bash script must create a lock file to prevent concurrent execution. If another instance is running, it should print a message and exit. Implement this with proper cleanup.",
          answer: "LOCKFILE=/var/run/myscript.lock; cleanup() { rm -f \"$LOCKFILE\"; }; trap cleanup EXIT; if ! (set -C; echo $$ > \"$LOCKFILE\") 2>/dev/null; then echo \"Already running (PID $(cat $LOCKFILE))\" >&2; exit 1; fi. The 'set -C' (noclobber) makes the redirect fail if the file exists, providing atomic lock creation. Trapping EXIT removes the lock when the script ends for any reason.",
          difficulty: "senior",
        },
        {
          question: "You need to retry a flaky command up to 5 times with a 10-second delay between attempts. Write a reusable Bash function for this.",
          answer: "retry() { local max=$1 delay=$2; shift 2; local attempt=1; while (( attempt <= max )); do \"$@\" && return 0; echo \"Attempt $attempt/$max failed. Retrying in ${delay}s...\" >&2; (( attempt++ )); sleep \"$delay\"; done; echo \"All $max attempts failed\" >&2; return 1; }; retry 5 10 curl -f https://api.example.com/health. The function receives max retries, delay, and the command as arguments.",
          difficulty: "mid",
        },
        {
          question: "Your heredoc writes a Kubernetes YAML template to a file, but you need some variables expanded (APP_NAME, VERSION) while others are literal (${POD_IP}, ${NODE_NAME} for the container env). How do you handle this?",
          answer: "Use two separate heredocs or escape the literal variables. In a single heredoc with expansion (<<EOF), prefix literal variables with a backslash: \\${POD_IP}. Alternatively, write the literal-variable sections as separate strings or use a quoted heredoc (<<'EOF') for sections that need no expansion and concatenate. The cleanest approach: use envsubst or a templating tool (gomplate, Helm) which clearly separates template variables from runtime env vars.",
          difficulty: "mid",
        },
        {
          question: "A script processes files with names like 'my report (2024).csv'. When you loop with 'for file in $(ls *.csv)', files with spaces break. What is the correct approach?",
          answer: "Never use $(ls) for file iteration. Use a glob directly: for file in *.csv; do echo \"$file\"; done. The glob expansion in Bash handles filenames with spaces correctly as long as the variable is double-quoted. For find: find . -name '*.csv' -print0 | while IFS= read -r -d '' file; do echo \"$file\"; done. The -d '' combined with read -r handles null-delimited filenames.",
          difficulty: "junior",
        },
        {
          question: "You need to write a Bash script that reads deployment status from an API every 10 seconds and exits when status is 'complete' or after a 5-minute timeout. Implement this.",
          answer: "TIMEOUT=300; START=$(date +%s); while true; do STATUS=$(curl -s https://api/deploy/status | jq -r '.status'); [[ \"$STATUS\" == 'complete' ]] && { echo 'Deployment complete'; exit 0; }; ELAPSED=$(( $(date +%s) - START )); (( ELAPSED >= TIMEOUT )) && { echo 'Timeout after 5 minutes' >&2; exit 1; }; echo \"Status: $STATUS (${ELAPSED}s elapsed)\"; sleep 10; done. Uses epoch timestamps for timeout calculation to avoid drift from sleep imprecision.",
          difficulty: "mid",
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
      exam: [
        {
          question: "You need a Python script that checks the health of 20 microservice endpoints concurrently and prints a summary. Using sequential requests takes 30 seconds. How do you speed this up?",
          answer: "Use concurrent.futures.ThreadPoolExecutor: from concurrent.futures import ThreadPoolExecutor, as_completed; import requests; urls = [...]; def check(url): resp = requests.get(url, timeout=5); return url, resp.status_code; with ThreadPoolExecutor(max_workers=10) as ex: futures = {ex.submit(check, u): u for u in urls}; for f in as_completed(futures): url, code = f.result(); print(f'{url}: {code}'. For I/O-bound tasks like HTTP requests, threading works well without needing asyncio.",
          difficulty: "mid",
        },
        {
          question: "Your Python deployment script calls subprocess.run('docker build -t myapp:latest .', shell=True). A colleague says this is a security risk. Why, and how do you fix it?",
          answer: "shell=True passes the command string to /bin/sh, enabling shell injection if any part of the command comes from user input or environment variables. Even without injection risk, shell=True is fragile due to quoting and shell differences. Fix: use a list of arguments without shell=True: subprocess.run(['docker', 'build', '-t', 'myapp:latest', '.'], check=True). This passes arguments directly to the OS without shell interpretation.",
          difficulty: "mid",
        },
        {
          question: "You write a Python script with boto3 to tag all untagged EC2 instances. It works in dev but throws 'EndpointResolutionError' in production. What are the two most likely causes?",
          answer: "1. Wrong AWS region: the production instances may be in a different region than your default. Fix: explicitly set the region in boto3.client('ec2', region_name='us-east-1') or ensure AWS_DEFAULT_REGION is set. 2. Network connectivity: the production environment may not have internet access or VPC endpoints for the EC2 API. Fix: configure a VPC endpoint for EC2 or ensure the security group/NAT gateway allows outbound HTTPS to ec2.amazonaws.com.",
          difficulty: "senior",
        },
        {
          question: "Your Go CLI tool needs to read AWS credentials from environment variables for CI, but fall back to ~/.aws/credentials for local development. How does the AWS SDK for Go handle this, and how do you implement it?",
          answer: "The AWS SDK for Go uses a credential chain that automatically checks: environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) first, then ~/.aws/credentials, then IAM instance profile/ECS task role. Use the default credential provider: cfg, err := config.LoadDefaultConfig(context.TODO()); svc := ec2.NewFromConfig(cfg). No manual credential logic needed — the SDK handles the chain. For explicit control, use config.LoadDefaultConfig with custom credential providers.",
          difficulty: "mid",
        },
        {
          question: "You need a Python script that watches a directory for new JSON files, parses each one, and POSTs its contents to an API. How do you implement the file watching without polling in a busy loop?",
          answer: "Use the watchdog library: from watchdog.observers import Observer; from watchdog.events import FileSystemEventHandler; class Handler(FileSystemEventHandler): def on_created(self, event): if event.src_path.endswith('.json'): data = json.loads(Path(event.src_path).read_text()); requests.post(API_URL, json=data); observer = Observer(); observer.schedule(Handler(), path='/watch/dir', recursive=False); observer.start(). watchdog uses OS-level file system events (inotify on Linux, FSEvents on macOS) instead of polling.",
          difficulty: "mid",
        },
        {
          question: "A Go tool that deploys to 50 servers panics occasionally with 'concurrent map writes'. You use a map to track deployment results from goroutines. How do you fix this?",
          answer: "Maps in Go are not goroutine-safe. Fix options: 1. Use sync.Mutex: var mu sync.Mutex; mu.Lock(); results[server] = status; mu.Unlock(). 2. Use sync.Map for concurrent access without explicit locking: var results sync.Map; results.Store(server, status). 3. Use a channel to collect results into a single goroutine that writes to the map: resultsCh <- Result{server, status}; in a separate goroutine: for r := range resultsCh { results[r.server] = r.status }. The channel pattern is often the most idiomatic Go approach.",
          difficulty: "senior",
        },
        {
          question: "Your Python script uses 'import yaml; config = yaml.load(open(\"config.yaml\"))' and works, but you get a security warning. What is the issue and how do you fix it?",
          answer: "yaml.load() with the default Loader can deserialize arbitrary Python objects, enabling code execution if the YAML file is untrusted (e.g., user-supplied). Fix: always use yaml.safe_load() which only loads standard YAML types (strings, numbers, lists, dicts) without executing Python code: config = yaml.safe_load(open('config.yaml')). For writing, use yaml.dump() which is always safe. The full safe pattern: with open('config.yaml') as f: config = yaml.safe_load(f).",
          difficulty: "junior",
        },
        {
          question: "You need to build a Go binary that works on both Linux/amd64 (production servers) and macOS/arm64 (developer machines). How do you set up the build and what Makefile targets would you write?",
          answer: "Go supports cross-compilation with GOOS and GOARCH environment variables. Makefile targets: build-linux: GOOS=linux GOARCH=amd64 go build -o dist/tool-linux-amd64 ./cmd/tool; build-mac: GOOS=darwin GOARCH=arm64 go build -o dist/tool-darwin-arm64 ./cmd/tool; build-all: build-linux build-mac. For CI: build all targets in one job and upload artifacts. Add -ldflags='-s -w' to strip debug info and reduce binary size. Use goreleaser for production release management.",
          difficulty: "junior",
        },
        {
          question: "Your Python boto3 script lists S3 objects but only returns 1000 items even though the bucket has 50,000 objects. How do you retrieve all objects?",
          answer: "S3's list_objects_v2 is paginated with a max of 1000 objects per request. Use the paginator: paginator = s3.get_paginator('list_objects_v2'); pages = paginator.paginate(Bucket='my-bucket', Prefix='logs/'); all_objects = [obj for page in pages for obj in page.get('Contents', [])]. Alternatively, manually handle ContinuationToken: response = s3.list_objects_v2(Bucket='my-bucket'); while response.get('IsTruncated'): response = s3.list_objects_v2(Bucket='my-bucket', ContinuationToken=response['NextContinuationToken']). The paginator approach is cleaner and recommended.",
          difficulty: "mid",
        },
        {
          question: "You need to write a Go function that retries an HTTP request up to 3 times with exponential backoff, only retrying on 5xx errors or network failures. Describe the implementation.",
          answer: "func requestWithRetry(url string, maxRetries int) (*http.Response, error) { backoff := time.Second; for i := 0; i <= maxRetries; i++ { resp, err := http.Get(url); if err == nil && resp.StatusCode < 500 { return resp, nil }; if i < maxRetries { time.Sleep(backoff); backoff *= 2 }; }; return nil, fmt.Errorf('all retries failed') }. Key points: exponential backoff (double the wait each attempt), only retry on 5xx (server errors) not 4xx (client errors which won't improve on retry), add jitter in production (backoff += time.Duration(rand.Intn(1000)) * time.Millisecond) to prevent thundering herd.",
          difficulty: "senior",
        },
      ],
    },
  ],
};
