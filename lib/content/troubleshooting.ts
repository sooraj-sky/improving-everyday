import type { Track } from "./types";

export const troubleshootingTrack: Track = {
  id: "troubleshooting",
  title: "Troubleshooting & Debugging",
  description:
    "Master systematic debugging techniques for Linux systems, networks, and modern application pipelines.",
  icon: "Wrench",
  color: "#ea580c",
  gradient: "track-troubleshooting-gradient",
  level: "intermediate",
  estimatedHours: 12,
  tags: [
    "troubleshooting",
    "debugging",
    "linux",
    "networking",
    "ci-cd",
    "devops",
    "sre",
  ],
  modules: [
    {
      id: "linux-troubleshooting",
      title: "Linux System Troubleshooting",
      level: "intermediate",
      description:
        "Diagnose and resolve CPU, memory, disk, and process-level issues on Linux servers using standard observability tools.",
      lessons: [
        {
          id: "linux-system-debug",
          title: "CPU, Memory & Disk Diagnostics",
          duration: 55,
          type: "lesson",
          description:
            "Learn to identify resource bottlenecks using top, htop, vmstat, iostat, df, du, dmesg, journalctl, and the /proc filesystem.",
          objectives: [
            "Use top and htop to identify CPU and memory hogs in real time",
            "Interpret vmstat and iostat output to diagnose I/O and memory pressure",
            "Check disk usage and find large files with df and du",
            "Read kernel ring buffer messages with dmesg and journalctl",
            "Navigate /proc to inspect live kernel and process state",
          ],
          tags: ["linux", "cpu", "memory", "disk", "performance", "dmesg"],
          content: `# CPU, Memory & Disk Diagnostics

Effective troubleshooting starts with a mental model: **resource bottlenecks cascade**. A disk I/O spike causes process queuing, which drives CPU wait time up, which makes the system feel slow. Your job is to trace the cascade back to its source.

## Step 1 — Get a 30-second Overview with \`top\`

\`\`\`bash
top -b -n 1 | head -20
\`\`\`

Key fields to read immediately:

| Field | Meaning |
|-------|---------|
| \`load average\` | 1m / 5m / 15m — compare to CPU count |
| \`%Cpu(s): wa\` | iowait — high means disk/network bottleneck |
| \`KiB Mem: buff/cache\` | Linux aggressively caches; real free = free + buff/cache |
| \`S\` column per process | D = uninterruptible sleep (disk wait) |

A load average consistently above the number of vCPUs indicates saturation. A single 4-core machine running at load 8 is over-saturated by 2×.

## Step 2 — Memory Deep-dive with \`vmstat\`

\`\`\`bash
vmstat 2 5
\`\`\`

Expected output on a healthy system:

\`\`\`
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 1  0      0 812340  54120 2341876    0    0     4    12  421  834  8  2 89  1  0
 0  0      0 810220  54200 2343200    0    0     0    20  387  710  5  1 93  1  0
\`\`\`

Red flags:
- \`si\`/\`so\` > 0 — swap is actively being used (severe memory pressure)
- \`b\` column > 0 — processes blocked waiting on I/O
- \`wa\` cpu column > 20% — excessive I/O wait

## Step 3 — Disk I/O with \`iostat\`

\`\`\`bash
# Install: apt install sysstat / yum install sysstat
iostat -xz 2 3
\`\`\`

\`\`\`
Device   r/s   w/s  rMB/s  wMB/s  await  %util
sda      0.5  45.2   0.02   5.60  120.3   98.4
\`\`\`

- \`await\` > 20ms for spinning disk or > 1ms for NVMe is a warning sign
- \`%util\` near 100% means the device is saturated

## Step 4 — Disk Space with \`df\` and \`du\`

\`\`\`bash
# Check filesystem usage
df -hT

# Find top 10 largest directories under /var
du -sh /var/* 2>/dev/null | sort -rh | head -10

# Find files larger than 500MB
find /var /tmp /home -size +500M -type f 2>/dev/null
\`\`\`

A common trap: \`df\` shows 100% usage but \`du\` shows plenty of space. This happens when a deleted file is held open by a running process — the inode is still consuming blocks. Fix it:

\`\`\`bash
# Find processes holding deleted files open
lsof +L1 | grep deleted
# Restart the culprit process to release the file handle
systemctl restart <service-name>
\`\`\`

## Step 5 — Kernel Messages with \`dmesg\` and \`journalctl\`

\`\`\`bash
# Recent kernel errors (last 30 minutes)
dmesg --level=err,warn --since "30 min ago" --human

# Follow system journal in real time
journalctl -f

# Last 100 lines from a specific service
journalctl -u nginx --no-pager -n 100

# Kernel OOM killer events
journalctl -k | grep -i "oom\|killed process"
\`\`\`

OOM killer output looks like this — it tells you which process was killed and why:

\`\`\`
May 12 03:14:22 prod-web-01 kernel: Out of memory: Kill process 18423 (java) score 872 or sacrifice child
May 12 03:14:22 prod-web-01 kernel: Killed process 18423 (java) total-vm:8192000kB, anon-rss:3145728kB
\`\`\`

## Step 6 — The /proc Filesystem

\`\`\`bash
# See memory breakdown for PID 1234
cat /proc/1234/status | grep -E "VmRSS|VmSwap|Threads"

# Open file descriptors for a process
ls -la /proc/1234/fd | wc -l

# See what a process is currently doing
cat /proc/1234/wchan        # kernel function it's sleeping in
cat /proc/1234/cmdline | tr '\\0' ' '   # full command line

# System-wide limits
cat /proc/sys/vm/swappiness
cat /proc/sys/fs/file-max
\`\`\`

## Practical Debugging Workflow

1. \`uptime\` — check load average trend
2. \`top\` or \`htop\` — identify heavy processes
3. \`vmstat 2 5\` — check for swap activity and I/O wait
4. \`iostat -xz 2 3\` — identify saturated disks
5. \`df -hT\` — verify disk space
6. \`dmesg --level=err\` — check for kernel errors
7. \`journalctl -u <service>\` — check application logs

This systematic top-down approach prevents jumping to conclusions and ensures you find the root cause, not just a symptom.`,
          interviewQuestions: [
            {
              difficulty: "junior",
              question:
                "How do you check if a Linux server is running out of memory?",
              answer:
                "Use \`free -h\` to see total, used, and available memory. Check the buff/cache line — Linux uses spare RAM for caching, so 'available' is the more useful metric than 'free'. Run \`vmstat 2 5\` and look at the si/so (swap in/out) columns; any non-zero value means the kernel is swapping and memory is under pressure. Also check \`dmesg | grep -i oom\` for OOM killer events.",
            },
            {
              difficulty: "junior",
              question: "What does a high iowait percentage in top indicate?",
              answer:
                "iowait (%wa in top's CPU line) measures time the CPU spent idle while waiting for disk or network I/O to complete. Values consistently above 20% indicate an I/O bottleneck. Follow up with \`iostat -xz 2\` to identify which device is saturated, then check \`%util\` and \`await\` columns to confirm.",
            },
            {
              difficulty: "mid",
              question:
                "You run \`df -h\` and see a filesystem at 100%, but \`du -sh /*\` only accounts for 60% of the disk. What's happening?",
              answer:
                "A process is holding open a file descriptor to a deleted file. When you delete a file in Linux, the directory entry is removed but the inode (and its disk blocks) remain until all open file descriptors are closed. Use \`lsof +L1\` to list processes holding such deleted files. Restarting the offending process releases the file handle and the disk space is reclaimed.",
            },
            {
              difficulty: "mid",
              question:
                "How would you identify which process is causing excessive disk I/O on a production server?",
              answer:
                "Start with \`iostat -xz 2\` to confirm which device is saturated. Then use \`iotop -ao\` (accumulated I/O mode) to rank processes by their I/O usage. Alternatively, inspect \`/proc/<pid>/io\` for specific processes, which shows read_bytes and write_bytes counters. For more detail, \`blktrace\` and \`bpftrace\` can trace I/O at the block level.",
            },
            {
              difficulty: "senior",
              question:
                "Explain how you'd use /proc to diagnose a process that is stuck in uninterruptible sleep (D state).",
              answer:
                "Check \`cat /proc/<pid>/wchan\` to see which kernel function the process is sleeping in — this identifies the subsystem involved (e.g., \`nfs_file_read\` points to NFS issues). Read \`/proc/<pid>/stack\` for the full kernel stack trace. Check \`/proc/<pid>/status\` for VmRSS and Threads. Cross-reference with \`dmesg\` for kernel errors related to storage or network. D-state processes cannot be killed with SIGKILL; the fix requires resolving the underlying kernel wait condition (e.g., unmounting a hung NFS share, replacing a failing disk).",
            },
          ],
          quizQuestions: [
            {
              type: "scenario",
              question:
                "A production web server is responding slowly. You SSH in and run \`top\`, which shows load average of 18 on a 4-core machine and \`wa\` CPU at 65%. Which command should you run next to identify the root cause?",
              answer:
                "Run \`iostat -xz 2 5\` to identify which disk device is saturated. The high iowait strongly suggests a disk I/O bottleneck. Check the \`%util\` and \`await\` columns — if \`%util\` is near 100%, the disk is the bottleneck. Follow up with \`iotop -ao\` to identify the process causing the I/O.",
            },
            {
              type: "scenario",
              question:
                "After a deployment, \`journalctl -u myapp\` shows 'Out of memory: Kill process' entries repeatedly. The deployment added a new feature. What steps do you take?",
              answer:
                "First, confirm the OOM events with \`dmesg | grep -i oom\` and note which process is being killed and its memory usage at kill time. Check current memory state with \`free -h\` and \`vmstat\`. Review the new feature for memory leaks — look for unbounded caches, missing connection pool limits, or loading large datasets into memory. Consider adding JVM heap limits (if Java), Node.js \`--max-old-space-size\`, or container memory limits to prevent cascading failures.",
            },
            {
              type: "scenario",
              question:
                "A cron job runs every hour and \`df -h\` shows /var at 95% capacity. You need to find what is filling it up. Walk through your diagnostic steps.",
              answer:
                "Run \`du -sh /var/* 2>/dev/null | sort -rh | head -10\` to find the largest subdirectories. Common culprits: \`/var/log\` (unbounded logs), \`/var/lib/docker\` (dangling images/volumes), \`/var/cache\` (package manager cache). Use \`find /var -size +100M -type f -mtime -1\` to find recently modified large files. If logs are the issue, check \`logrotate\` configuration. For Docker, run \`docker system df\` and \`docker system prune\`.",
            },
            {
              type: "hands-on",
              question:
                "Write a one-liner that finds the top 5 memory-consuming processes and prints their PID, memory percentage, and command name.",
              answer:
                "Run: \`ps aux --sort=-%mem | awk 'NR==1 || NR<=6 {print \$2, \$4, \$11}'\` — this sorts by memory descending, keeps the header row, and prints the first 5 processes with their PID, %MEM, and command.",
              hint: "Use \`ps aux\` with \`--sort\` and pipe to \`awk\` to extract columns.",
            },
            {
              type: "hands-on",
              question:
                "Write a command to check if swap is actively being used, and if so, identify which processes are consuming swap space.",
              answer:
                "Check active swap: \`vmstat 1 3 | awk '{print \$7, \$8}'\` (si/so columns). To find processes using swap: \`for pid in /proc/[0-9]*; do awk -v pid=\${pid##*/} '/VmSwap/{if(\$2>0) print pid, \$2\" kB\"}' \$pid/status 2>/dev/null; done | sort -k2 -rn | head -10\`",
              hint: "Per-process swap is in /proc/<pid>/status under the VmSwap field.",
            },
            {
              type: "hands-on",
              question:
                "Using journalctl, write a command to find all error-level messages from the last 2 hours, filter for 'connection refused', and output with timestamps.",
              answer:
                "Run: \`journalctl -p err --since '2 hours ago' --no-pager | grep -i 'connection refused'\` — the \`-p err\` flag filters to error priority and above, \`--since\` scopes the time window, and \`grep\` narrows to the specific error pattern.",
              hint: "Use journalctl's -p flag for priority filtering and --since for time scoping.",
            },
          ],
        },
        {
          id: "linux-process-debug",
          title: "Process Debugging & Core Dumps",
          duration: 50,
          type: "lesson",
          description:
            "Debug running processes using strace, lsof, ps, and kill signals. Handle zombie processes and analyze core dumps.",
          objectives: [
            "Trace system calls of a running process with strace",
            "Identify open files and network connections with lsof",
            "Send the right kill signal for each scenario",
            "Understand zombie processes and how to clean them up",
            "Enable and analyze core dumps for crashed processes",
            "Use /proc/PID to inspect live process state",
          ],
          tags: ["linux", "strace", "lsof", "processes", "core-dumps", "signals"],
          content: `# Process Debugging & Core Dumps

When a process misbehaves — hangs, crashes, leaks memory, or burns CPU — you need tools that let you see inside it without modifying the code. Linux provides exceptional introspection capabilities through system call tracing, the /proc filesystem, and core dumps.

## System Call Tracing with \`strace\`

\`strace\` intercepts every system call a process makes. It's invasive (adds overhead) but invaluable for diagnosing mysterious hangs and permission errors.

\`\`\`bash
# Attach to a running process
strace -p 1234 -e trace=network,file 2>&1 | head -30

# Trace a new process, show timing
strace -T -tt -o /tmp/trace.log mycommand arg1

# Count system calls (summary mode)
strace -c -p 1234
\`\`\`

Example — diagnosing why an app is slow to start:

\`\`\`bash
strace -T ./myapp 2>&1 | grep -E "open|read|stat" | sort -t= -k2 -rn | head -20
\`\`\`

This reveals if the app is spending time opening thousands of files or hitting slow stat() calls.

## Open Files & Sockets with \`lsof\`

\`lsof\` (list open files) shows every file, socket, pipe, and device a process has open.

\`\`\`bash
# All open files for a PID
lsof -p 1234

# What process is listening on port 8080?
lsof -i :8080

# All network connections for a process
lsof -p 1234 -i

# Files opened by a specific user
lsof -u deployuser

# Find deleted-but-held-open files (disk space issue)
lsof +L1

# Count file descriptors per process (find FD leaks)
lsof | awk '{print \$1}' | sort | uniq -c | sort -rn | head -10
\`\`\`

File descriptor limits are a common production issue. Check them:

\`\`\`bash
# System-wide limit
cat /proc/sys/fs/file-max

# Per-process limits (soft and hard)
cat /proc/1234/limits | grep "open files"

# Current FD count for a process
ls /proc/1234/fd | wc -l
\`\`\`

## Process Inspection with \`ps\`

\`\`\`bash
# Full process tree with CPU/memory
ps auxf

# Find all threads of a process
ps -L -p 1234

# Processes sorted by memory
ps aux --sort=-%mem | head -15

# Show process start time and elapsed time
ps -o pid,lstart,etime,cmd -p 1234

# Find zombie processes
ps aux | awk '\$8 == "Z" {print \$2, \$11}'
\`\`\`

## Kill Signals — Using the Right One

Sending the wrong signal wastes time or causes data loss.

| Signal | Number | Behavior |
|--------|--------|----------|
| SIGTERM | 15 | Graceful shutdown (default for \`kill\`) |
| SIGKILL | 9 | Immediate kill — cannot be caught or ignored |
| SIGHUP | 1 | Reload config (many daemons handle this) |
| SIGSTOP | 19 | Pause process |
| SIGCONT | 18 | Resume paused process |
| SIGUSR1/2 | 10/12 | Application-defined — e.g., Nginx: reopen logs |

\`\`\`bash
# Always try SIGTERM first
kill -15 1234
# Wait 10 seconds, then force if needed
kill -9 1234

# Reload nginx config without downtime
kill -HUP \$(cat /var/run/nginx.pid)

# Kill all processes matching a name
pkill -f "python myworker.py"
\`\`\`

## Zombie Processes

A zombie (defunct) process has exited but its parent hasn't called \`wait()\` to collect its exit status. Zombies hold a PID slot but no memory.

\`\`\`bash
# Find zombies
ps aux | grep 'Z'

# Find the zombie's parent
ps -o ppid= -p <zombie_pid>

# Send SIGCHLD to the parent to prompt it to collect the child
kill -SIGCHLD <parent_pid>

# If parent is the issue, restart it
# Never kill the zombie directly — it's already dead
\`\`\`

Persistent zombies usually indicate a bug in the parent application's signal handling. In containerized environments, PID 1 must handle \`SIGCHLD\` — use \`tini\` or \`dumb-init\` as your container init process.

## Core Dumps

A core dump captures the full memory state of a crashed process, enabling post-mortem debugging.

\`\`\`bash
# Check if core dumps are enabled
ulimit -c         # 0 = disabled

# Enable for this session
ulimit -c unlimited

# Set core dump pattern (systemd systems)
cat /proc/sys/kernel/core_pattern
# Modern systems send to systemd-coredump:
# |/usr/lib/systemd/systemd-coredump %P %u %g %s %t %c %h

# Retrieve a core dump
coredumpctl list
coredumpctl dump <PID> -o /tmp/core.dump

# Analyze with gdb
gdb /usr/bin/myapp /tmp/core.dump
(gdb) bt full        # backtrace with local variables
(gdb) info threads   # all thread states
(gdb) frame 3        # switch to stack frame 3
\`\`\`

## Practical Debugging Scenario

A web worker process is hanging and not serving requests:

\`\`\`bash
# 1. Find the PID
ps aux | grep worker

# 2. Check what syscall it's stuck in
strace -p 4567 -e trace=all 2>&1 | head -5
# Output: read(7, 0x7fff..., 4096 <unfinished ...>
# It's blocking on a read() from fd 7

# 3. What is fd 7?
ls -la /proc/4567/fd/7
# lrwxrwxrwx 1 app app 0 May 12 10:23 7 -> socket:[1234567]

# 4. What socket?
lsof -p 4567 -i | grep 1234567
# Shows connection to 10.0.1.5:5432 (PostgreSQL) in ESTABLISHED state

# Conclusion: The worker is waiting on a database query.
# Check slow query log on the DB side.
\`\`\`

This strace → lsof → /proc chain is a repeatable workflow that works for any blocking process.`,
          interviewQuestions: [
            {
              difficulty: "junior",
              question:
                "What is the difference between SIGTERM and SIGKILL, and when should you use each?",
              answer:
                "SIGTERM (15) is a polite request for the process to shut down — the process can catch it, finish in-flight work, close connections, and flush buffers before exiting. SIGKILL (9) is unconditional and immediate — the kernel kills the process and it cannot be caught, blocked, or ignored. Always try SIGTERM first, wait a few seconds, then resort to SIGKILL only if the process doesn't respond. Using SIGKILL on a database process can leave it in an inconsistent state.",
            },
            {
              difficulty: "junior",
              question: "What is a zombie process and is it dangerous?",
              answer:
                "A zombie (defunct) process is one that has finished executing but whose exit status hasn't been collected by its parent process via the \`wait()\` system call. It occupies a PID slot in the process table but consumes no CPU or memory. Small numbers of zombies are harmless. The danger is if a buggy parent creates thousands of zombies, exhausting the PID namespace and preventing new processes from starting. The fix is to send SIGCHLD to the parent or restart the parent process.",
            },
            {
              difficulty: "mid",
              question: "How would you use strace to diagnose why an application is slow to start?",
              answer:
                "Run \`strace -T -tt ./myapp 2>&1 | sort -t= -k2 -rn | head -20\` to show each system call with its duration, then sort by time spent. Look for slow \`open()\`/\`stat()\` calls on files that don't exist (ENOENT errors in a loop indicate config probing), slow DNS lookups in \`connect()\` calls, or repeated reads from slow network filesystems. The \`-e trace=file,network\` filter helps narrow to relevant syscall categories.",
            },
            {
              difficulty: "mid",
              question:
                "A process is consuming all available file descriptors. How do you diagnose and fix this?",
              answer:
                "First confirm with \`lsof -p <pid> | wc -l\` and compare to \`cat /proc/<pid>/limits | grep 'open files'\`. If the process is near its limit, run \`lsof -p <pid>\` and look for patterns — thousands of entries for the same socket type indicate a socket leak, many log file handles indicate a log rotation issue. Short-term fix: raise the limit via \`/etc/security/limits.conf\` or systemd's \`LimitNOFILE\`. Long-term fix: patch the application to close file descriptors properly.",
            },
            {
              difficulty: "senior",
              question:
                "How do you analyze a core dump from a production process crash, and what information can you extract?",
              answer:
                "On modern systemd systems, core dumps are captured by \`systemd-coredump\`. Use \`coredumpctl list\` to find the dump, then \`coredumpctl gdb <pid>\` to open it in GDB. Key commands: \`bt full\` for the backtrace with local variables, \`info threads\` to see all thread states (identify which thread crashed), \`thread apply all bt\` for all thread backtraces, and \`x/20wx \$sp\` to inspect the stack. You can also extract the binary and core for offline analysis with \`coredumpctl dump\`. For containerized workloads, ensure your kernel core pattern and container runtime both support core dumps, and that the container has sufficient memory for a dump.",
            },
          ],
          quizQuestions: [
            {
              type: "scenario",
              question:
                "An Nginx worker is not serving requests. \`ps aux\` shows it's in 'D' (uninterruptible sleep) state. strace shows it's stuck on \`read()\` from a socket. How do you determine what it's waiting for?",
              answer:
                "Run \`lsof -p <pid>\` to identify all open file descriptors, focusing on the socket it's reading from. Note the socket inode. Cross-reference with \`ss -tnp | grep <pid>\` to see the remote address. If it's waiting on a backend (upstream), check if that upstream is responding. Check \`/var/log/nginx/error.log\` for upstream timeout errors. The D state means a kernel-level I/O is in progress — likely a slow upstream or broken TCP connection.",
            },
            {
              type: "scenario",
              question:
                "A microservice crashes every few hours with a segfault but leaves no error message. How do you capture and analyze the crash?",
              answer:
                "Enable core dumps: \`ulimit -c unlimited\` in the service's environment, or configure \`DefaultLimitCORE=infinity\` in the systemd unit file. Set a useful core pattern: \`echo '/var/cores/core.%e.%p.%t' > /proc/sys/kernel/core_pattern\`. After the next crash, analyze with \`gdb /usr/bin/myservice /var/cores/core.myservice.1234.*\`, run \`bt full\` to see the stack trace at the point of the segfault, and \`info registers\` to inspect CPU state. This identifies the crashing function and line.",
            },
            {
              type: "scenario",
              question:
                "You notice a growing number of zombie processes owned by your application. The parent PID is your main application process. What are your options?",
              answer:
                "Try \`kill -SIGCHLD <parent_pid>\` first — this signals the parent to call \`wait()\` and reap its children. If that doesn't work, the parent process has a bug where it's not handling SIGCHLD. You can restart the parent process as a temporary fix. Long-term, fix the application code to properly wait for child processes, or use a process supervisor like supervisord or a proper init system (tini/dumb-init in containers) that automatically reaps orphaned children.",
            },
            {
              type: "hands-on",
              question:
                "Write a command using lsof and awk to show a sorted count of open file types (REG, IPv4, IPv6, etc.) for a given PID.",
              answer:
                "Run: \`lsof -p <PID> | awk 'NR>1 {print \$5}' | sort | uniq -c | sort -rn\` — this skips the header row, extracts the TYPE column (column 5), then counts and sorts by frequency.",
              hint: "The TYPE column in lsof output is the 5th field. Use awk to extract it, then sort and count with uniq -c.",
            },
            {
              type: "hands-on",
              question:
                "Write a bash one-liner to find all processes that have been running for more than 24 hours, showing their PID, elapsed time, and command.",
              answer:
                "Run: \`ps -eo pid,etimes,comm --sort=-etimes | awk 'NR==1 || \$2 > 86400 {print \$1, \$2, \$3}'\` — \`etimes\` gives elapsed time in seconds, 86400 = 24 hours. Alternatively: \`ps -eo pid,etime,cmd | awk '\$2 ~ /^[0-9]+-/ {print}'\` matches the \`days-HH:MM:SS\` format that appears after 24 hours.",
              hint: "ps -eo lets you select output columns. The 'etimes' column gives elapsed seconds; 'etime' gives a human-readable string that includes 'days-' prefix after 24h.",
            },
            {
              type: "hands-on",
              question:
                "Write a strace command to trace only file-related system calls for an already running process (PID 9999) and save the output with timestamps to /tmp/file-trace.log.",
              answer:
                "Run: \`strace -p 9999 -e trace=file -T -tt -o /tmp/file-trace.log\` — \`-p\` attaches to the running process, \`-e trace=file\` filters to file-related syscalls, \`-T\` shows time spent in each call, \`-tt\` adds microsecond timestamps, and \`-o\` writes output to the file.",
              hint: "Use strace -p to attach to a running process. The -e trace= filter accepts syscall categories like 'file', 'network', 'process'.",
            },
          ],
        },
      ],
    },
    {
      id: "network-troubleshooting",
      title: "Network & Firewall Debugging",
      level: "intermediate",
      description:
        "Diagnose connectivity failures, firewall misconfigurations, and DNS issues using standard Linux network tools.",
      lessons: [
        {
          id: "network-connectivity",
          title: "Network Connectivity Debugging",
          duration: 55,
          type: "lesson",
          description:
            "Systematically debug network failures using ping, traceroute, ss, netstat, tcpdump, curl, nmap, dig, and nslookup. Understand MTU issues and packet loss.",
          objectives: [
            "Use ping and traceroute to locate where connectivity breaks",
            "Analyze TCP/UDP connections with ss and netstat",
            "Capture and filter packets with tcpdump",
            "Debug HTTP connections with curl verbose mode",
            "Resolve DNS issues with dig and nslookup",
            "Diagnose MTU-related problems",
          ],
          tags: ["networking", "tcpdump", "dns", "ping", "curl", "debugging"],
          content: `# Network Connectivity Debugging

Network issues fall into predictable categories: the host is unreachable, the port is closed, DNS resolution fails, or the connection is established but slow. A systematic approach using the right tool at each layer saves hours of guesswork.

## Layer by Layer: The Debugging Framework

Work up the network stack:
1. Physical/Link — is the interface up? Is there an IP?
2. IP/Routing — can we reach the gateway? Correct routes?
3. Transport — is the port open? TCP handshake completing?
4. Application — is the service responding correctly?
5. DNS — are names resolving to the right addresses?

## Layer 1-2: Interface Status

\`\`\`bash
# Check interface status and IP addresses
ip addr show
ip link show

# Check routing table
ip route show
ip route get 8.8.8.8      # Which interface/gateway for a specific destination

# Interface statistics (errors, drops)
ip -s link show eth0
\`\`\`

A non-zero \`RX errors\` or \`dropped\` count points to a hardware or driver issue.

## Layer 3: Reachability with \`ping\` and \`traceroute\`

\`\`\`bash
# Basic reachability test
ping -c 4 -W 2 10.0.1.5

# Traceroute (UDP by default on Linux)
traceroute 10.0.1.5

# ICMP traceroute (better through firewalls)
traceroute -I 10.0.1.5

# TCP traceroute to a specific port (bypasses ICMP filters)
traceroute -T -p 443 api.example.com

# Continuous traceroute with stats (mtr)
mtr --report --report-cycles 20 api.example.com
\`\`\`

Reading traceroute output — look for:
- \`* * *\` — that hop doesn't respond (not necessarily broken)
- Sudden RTT spike at a hop — latency introduced there
- Same hop repeated with increasing TTL — routing loop

## Layer 4: TCP/UDP Connection State with \`ss\`

\`\`\`bash
# All listening TCP ports with process info
ss -tlnp

# All established connections
ss -tnp state established

# Connections to a specific port
ss -tnp dst :5432

# Socket statistics by state
ss -s

# Show timer info (useful for detecting stuck connections)
ss -tnop
\`\`\`

Key connection states: \`ESTABLISHED\` (active), \`TIME_WAIT\` (closing, normal), \`CLOSE_WAIT\` (application isn't closing — often a bug), \`SYN_SENT\` (trying to connect, no response).

A large number of \`CLOSE_WAIT\` sockets usually means the application is not calling \`close()\` after the peer closes the connection — a code bug.

## Packet Capture with \`tcpdump\`

\`\`\`bash
# Capture HTTP traffic on eth0
tcpdump -i eth0 -n port 80

# Capture traffic to/from a specific host, save to file
tcpdump -i eth0 -w /tmp/capture.pcap host 10.0.1.5

# Capture DNS queries
tcpdump -i eth0 -n port 53

# Inspect a pcap file (read without capture)
tcpdump -r /tmp/capture.pcap -n | head -50

# Verbose output showing TCP flags
tcpdump -i eth0 -nn -vvv port 8080
\`\`\`

TCP flags to recognize: \`[S]\` = SYN, \`[S.]\` = SYN-ACK, \`[.]\` = ACK, \`[P.]\` = PSH-ACK (data), \`[R]\` = RST (connection refused/reset), \`[F.]\` = FIN.

A connection where you see \`[S]\` but no \`[S.]\` means the remote host isn't responding — either it's down, the port is closed, or a firewall is dropping packets silently.

## HTTP Debugging with \`curl\`

\`\`\`bash
# Verbose output — shows TLS handshake, headers, timing
curl -v https://api.example.com/health

# Timing breakdown for a request
curl -w "\\nDNS: %{time_namelookup}s\\nConnect: %{time_connect}s\\nTTFB: %{time_starttransfer}s\\nTotal: %{time_total}s\\n" -o /dev/null -s https://api.example.com

# Test with specific DNS (bypass system resolver)
curl --resolve api.example.com:443:10.0.1.50 https://api.example.com/health

# Follow redirects, show final URL
curl -L -o /dev/null -s -w "%{url_effective}\\n" http://example.com

# Test with a specific client certificate
curl --cert client.crt --key client.key https://mtls.example.com
\`\`\`

## DNS Debugging with \`dig\` and \`nslookup\`

\`\`\`bash
# Basic lookup
dig api.example.com

# Lookup using a specific DNS server
dig @8.8.8.8 api.example.com

# Trace the full DNS resolution chain
dig +trace api.example.com

# Check reverse DNS (PTR record)
dig -x 10.0.1.50

# Check MX records
dig api.example.com MX

# One-line answer only
dig +short api.example.com
\`\`\`

Common DNS problems and their signatures:
- \`SERVFAIL\` — the authoritative server returned an error (check DNSSEC)
- \`NXDOMAIN\` — the name doesn't exist
- Different answers from different servers — DNS propagation in progress, or split-horizon misconfiguration
- Slow resolution — check \`/etc/resolv.conf\` for unreachable nameservers

## MTU Issues

MTU (Maximum Transmission Unit) mismatches cause a fascinating failure mode: small packets work but large ones don't. HTTPS connections to some hosts fail but HTTP works. VPN tunnels drop large transfers.

\`\`\`bash
# Find the MTU of an interface
ip link show eth0 | grep mtu

# Test if ICMP fragmentation needed messages are blocked (black hole detection)
ping -M do -s 1472 10.0.1.5   # 1472 + 28 byte IP/ICMP header = 1500 MTU

# If this fails but ping -s 64 succeeds, you have an MTU problem
# Temporarily lower MTU to work around it
ip link set eth0 mtu 1400
\`\`\`

For VPNs, the tunnel overhead reduces effective MTU — typically 1500 - 60 bytes overhead = 1440 MTU inside the tunnel. Configure your VPN server to advertise the correct MTU via DHCP or use MSS clamping with iptables.`,
          interviewQuestions: [
            {
              difficulty: "junior",
              question:
                "What is the difference between ss and netstat, and why is ss preferred?",
              answer:
                "\`ss\` (socket statistics) is the modern replacement for \`netstat\`. It reads data directly from the kernel's netlink interface, making it significantly faster — especially important when there are thousands of connections. \`netstat\` reads from /proc/net/tcp which is slower and deprecated in some distributions. \`ss\` supports the same filtering syntax and output formats as netstat but with better performance and more detailed output for TCP internals like timer states.",
            },
            {
              difficulty: "junior",
              question: "How would you determine which process is listening on port 3306?",
              answer:
                "Run \`ss -tlnp | grep :3306\` or \`lsof -i :3306\`. The \`-p\` flag in ss shows the process name and PID. If the process name is hidden (requires root to see other users' processes), run with \`sudo\`. Alternatively, \`fuser -n tcp 3306\` shows the PID using that port.",
            },
            {
              difficulty: "mid",
              question:
                "You can ping a remote server but cannot establish a TCP connection on port 443. What are the possible causes and how do you diagnose them?",
              answer:
                "ICMP (ping) succeeds but TCP fails indicates the port-level issue, not a routing problem. Possible causes: (1) the service isn't running — check with \`ss -tlnp\` on the remote, (2) a firewall is dropping TCP SYN packets — use \`tcpdump\` to see if SYN packets are sent and whether SYN-ACK returns, (3) the service is listening on a different interface (e.g., 127.0.0.1 only), (4) SELinux/AppArmor is blocking the bind. Run \`tcpdump -i eth0 -n port 443\` and attempt a connection — if you see SYN with no SYN-ACK, it's firewall or service down.",
            },
            {
              difficulty: "mid",
              question: "How do you use tcpdump to capture only HTTP GET requests without capturing response body data?",
              answer:
                "Use: \`tcpdump -i eth0 -A -s 512 'tcp port 80 and (tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x47455420)'\` — the BPF filter matches the ASCII bytes for 'GET ' (0x47455420) at the start of the TCP payload. The \`-s 512\` limits capture to the first 512 bytes (headers only for most requests). For a simpler approach, capture to a pcap and analyze with \`tshark -r capture.pcap -Y 'http.request.method == GET'\`.",
            },
            {
              difficulty: "senior",
              question:
                "Describe an MTU black hole scenario and how you would diagnose and fix it.",
              answer:
                "An MTU black hole occurs when ICMP 'fragmentation needed' messages (type 3, code 4) are blocked by a firewall between two hosts. Without these messages, the sender doesn't know to reduce packet size, so large packets are silently dropped. Symptoms: SSH connections work but large file transfers hang; HTTPS works for small pages but fails for large downloads. Diagnosis: \`ping -M do -s 1472 <host>\` — if large pings fail but small ones succeed, you have a black hole. Fix options: (1) allow ICMP type 3 through firewalls, (2) use MSS clamping: \`iptables -t mangle -A FORWARD -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu\`, (3) manually lower the MTU on the interface.",
            },
          ],
          quizQuestions: [
            {
              type: "scenario",
              question:
                "Users report that your web app is slow but not down. curl -v shows the DNS lookup takes 3 seconds but the actual connection is fast. How do you diagnose and fix this?",
              answer:
                "Run \`time dig api.example.com\` to confirm DNS latency. Check \`/etc/resolv.conf\` to see which nameservers are configured. Test each nameserver directly: \`dig @<nameserver-ip> api.example.com\`. A 3-second delay often means the first nameserver is unreachable and the resolver is timing out before trying the next one. Fix: remove the bad nameserver from \`/etc/resolv.conf\`, add \`options timeout:1 attempts:2\` to reduce timeout, or switch to a reliable resolver like 169.254.169.253 (AWS) or 10.0.0.2 (GCP).",
            },
            {
              type: "scenario",
              question:
                "A microservice can connect to its database from a developer laptop but not from the Kubernetes pod. Both are in the same VPC. How do you debug this?",
              answer:
                "First verify the pod's network namespace: exec into the pod and run \`curl -v telnet://db-host:5432\` or \`nc -zv db-host 5432\`. Check DNS from the pod: \`nslookup db-host\`. Compare the pod's IP range to the database's security group rules — the pod CIDR may not be allowed. Check network policies: \`kubectl get networkpolicy\`. Run \`tcpdump\` on the database host filtering for the pod's IP to see if packets arrive. Common cause: security group allows the laptop's IP but not the pod subnet.",
            },
            {
              type: "scenario",
              question:
                "traceroute to a host shows packets reach hop 10 fine, but hop 11 shows '* * *' and the destination is unreachable. Is hop 11 the problem?",
              answer:
                "Not necessarily. '* * *' means that router isn't responding to traceroute probes (often ICMP TTL-exceeded messages are rate-limited or blocked). The actual issue could be at hop 11 or beyond. Try \`traceroute -T -p 443 <destination>\` (TCP SYN traceroute) which is more likely to get responses through firewalls. Also try \`mtr\` which shows packet loss percentages — if loss only appears at hop 11 but not at subsequent hops, hop 11 is just not responding to probes, not broken.",
            },
            {
              type: "hands-on",
              question:
                "Write a curl command that tests an HTTPS endpoint, shows the HTTP status code and response time breakdown (DNS, connect, TTFB, total), but suppresses the response body.",
              answer:
                "Run: \`curl -s -o /dev/null -w 'HTTP Status: %{http_code}\\nDNS: %{time_namelookup}s\\nConnect: %{time_connect}s\\nTLS: %{time_appconnect}s\\nTTFB: %{time_starttransfer}s\\nTotal: %{time_total}s\\n' https://api.example.com/health\`",
              hint: "Use curl's -w flag with timing variables like %{time_namelookup}, %{time_connect}, %{time_starttransfer}. Use -o /dev/null to discard the body and -s for silent mode.",
            },
            {
              type: "hands-on",
              question:
                "Write a tcpdump command to capture all TCP RST packets on interface eth0 and display them with timestamps and source/destination IPs.",
              answer:
                "Run: \`tcpdump -i eth0 -nn -tt 'tcp[13] & 4 != 0'\` — the BPF filter \`tcp[13] & 4 != 0\` checks bit 2 of the TCP flags byte (offset 13), which is the RST flag. \`-nn\` disables name resolution for faster output, and \`-tt\` shows Unix timestamps.",
              hint: "TCP flags are at byte offset 13 in the TCP header. The RST flag is bit 2 (value 4). Use BPF filter tcp[13] & 4 != 0 to match RST packets.",
            },
            {
              type: "hands-on",
              question:
                "Write a dig command to trace the complete DNS resolution chain for 'api.example.com' using the 1.1.1.1 resolver, and explain what each section of the output represents.",
              answer:
                "Run: \`dig @1.1.1.1 +trace api.example.com\` — \`+trace\` makes dig resolve from the root servers down. Output sections: first shows root NS records, then TLD (.com) NS records, then the authoritative NS for example.com, then the final A record answer. This reveals where delegation breaks down or where a misconfigured record lives.",
              hint: "dig's +trace flag performs iterative resolution starting from the root. Combine with @1.1.1.1 to use Cloudflare as the starting resolver.",
            },
          ],
        },
        {
          id: "firewall-debug",
          title: "Firewall & iptables Debugging",
          duration: 50,
          type: "lesson",
          description:
            "Debug firewall rules with iptables, ufw, nftables, and cloud security groups. Use conntrack and port scanning to verify rule behavior.",
          objectives: [
            "List and interpret iptables rules in INPUT, OUTPUT, and FORWARD chains",
            "Use ufw status and logging to debug blocked connections",
            "Understand nftables as the modern iptables replacement",
            "Use conntrack to inspect connection tracking state",
            "Verify open ports with nmap",
            "Debug cloud security groups and NACLs",
          ],
          tags: ["firewall", "iptables", "ufw", "nftables", "security", "nmap"],
          content: `# Firewall & iptables Debugging

Firewall misconfigurations are responsible for a large percentage of "why can't I connect?" incidents. The challenge is that firewalls fail silently — packets are dropped without notification, making it look like the service is down when it's actually the firewall blocking access.

## Understanding iptables Structure

iptables organizes rules into **tables** (filter, nat, mangle) and **chains** (INPUT, OUTPUT, FORWARD, PREROUTING, POSTROUTING). For connectivity debugging, focus on the \`filter\` table.

\`\`\`bash
# List all rules with line numbers and packet counts
iptables -L -n -v --line-numbers

# List a specific chain
iptables -L INPUT -n -v --line-numbers

# List NAT rules (for port forwarding and SNAT)
iptables -t nat -L -n -v

# Check rules in numeric format (faster, no DNS lookups)
iptables -nL INPUT

# Show rules in iptables-save format (easy to read and restore)
iptables-save | grep -v "^#"
\`\`\`

Understanding the output:

\`\`\`
Chain INPUT (policy DROP)
target     prot opt source               destination
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0    tcp dpt:22
ACCEPT     tcp  --  10.0.0.0/8           0.0.0.0/0    tcp dpt:8080
DROP       tcp  --  0.0.0.0/0            0.0.0.0/0    tcp dpt:3306
\`\`\`

Policy DROP means packets that don't match any rule are dropped. Rule order matters — first match wins.

## Adding Logging to Debug Rules

The most powerful debugging technique: add a LOG rule before a DROP to see what's being blocked.

\`\`\`bash
# Log all dropped INPUT packets
iptables -I INPUT 1 -j LOG --log-prefix "IPT-INPUT-DROP: " --log-level 4

# Watch the log in real time
journalctl -kf | grep "IPT-INPUT-DROP"

# Or via dmesg
dmesg -w | grep "IPT-INPUT-DROP"

# Remove the logging rule when done
iptables -D INPUT 1
\`\`\`

Log output looks like:

\`\`\`
May 12 10:23:41 web01 kernel: IPT-INPUT-DROP: IN=eth0 OUT= SRC=203.0.113.5 DST=10.0.1.10 PROTO=TCP SPT=51234 DPT=3306
\`\`\`

This immediately tells you the source, destination, and port of blocked traffic.

## UFW (Uncomplicated Firewall)

UFW is a frontend for iptables common on Ubuntu.

\`\`\`bash
# Check status with rule details
ufw status verbose

# Check numbered rules
ufw status numbered

# Enable UFW logging
ufw logging on
ufw logging medium   # captures blocked and invalid packets

# View UFW logs
journalctl -u ufw --no-pager -n 50
# Or in older systems:
tail -f /var/log/ufw.log

# Test if a port would be allowed (dry run)
ufw --dry-run allow 8080/tcp
\`\`\`

## nftables — The Modern Replacement

nftables is the successor to iptables, offering better performance and cleaner syntax. On modern Debian/Ubuntu and RHEL 9+ systems, iptables may be a compatibility shim over nftables.

\`\`\`bash
# List all nftables rules
nft list ruleset

# List a specific table
nft list table inet filter

# Add a temporary logging rule
nft add rule inet filter input tcp dport 3306 log prefix "nft-blocked: " drop

# Check if iptables is a nftables shim
iptables --version | grep -i nf
# "iptables v1.8.7 (nf_tables)" = nftables backend
\`\`\`

## Connection Tracking with \`conntrack\`

Linux tracks the state of all connections in a conntrack table. This enables stateful firewall rules (RELATED, ESTABLISHED).

\`\`\`bash
# Install: apt install conntrack / yum install conntrack-tools
# Show all tracked connections
conntrack -L

# Watch new connections in real time
conntrack -E -e NEW

# Find connections to a specific destination
conntrack -L --dst-port 443

# Check conntrack table usage (important — if full, new connections fail)
cat /proc/sys/net/netfilter/nf_conntrack_count
cat /proc/sys/net/netfilter/nf_conntrack_max

# Increase the conntrack table size (temporary)
sysctl -w net.netfilter.nf_conntrack_max=524288
\`\`\`

A full conntrack table causes all new connections to fail with "connection refused" or silent drops, even if the firewall rules allow them. This is a common high-traffic production incident.

## Port Scanning with \`nmap\`

nmap is the definitive tool for verifying what a firewall exposes to the outside world.

\`\`\`bash
# Scan common ports
nmap -sV 10.0.1.5

# Scan specific ports
nmap -p 22,80,443,8080,3306 10.0.1.5

# Scan all TCP ports (slow but thorough)
nmap -p- 10.0.1.5

# UDP scan (requires root)
nmap -sU -p 53,123,161 10.0.1.5

# Check if a firewall is silently dropping vs rejecting
# "filtered" = DROP (no response), "closed" = REJECT (RST/ICMP)
nmap -p 3306 10.0.1.5
\`\`\`

## Cloud Security Groups

Cloud firewalls (AWS Security Groups, GCP Firewall Rules, Azure NSGs) operate outside the OS — iptables won't help you see what they're blocking.

**AWS Security Groups:**
\`\`\`bash
# List rules for a security group
aws ec2 describe-security-groups --group-ids sg-12345678

# Check which security groups are attached to an instance
aws ec2 describe-instances --instance-ids i-12345678 \
  --query 'Reservations[].Instances[].SecurityGroups'

# Enable VPC Flow Logs to see dropped packets
aws ec2 create-flow-logs \
  --resource-type VPC --resource-ids vpc-12345678 \
  --traffic-type REJECT \
  --log-destination-type cloud-watch-logs \
  --log-group-name /aws/vpc/flowlogs
\`\`\`

VPC Flow Logs show you REJECT entries for dropped packets, which you can query in CloudWatch Logs Insights to find blocked source IPs and ports.

## Practical Debugging Workflow

1. \`nmap -p <port> <host>\` from outside — see what the world sees
2. \`iptables -L -n -v\` on the host — see local rules
3. Add LOG rule — capture what's actually being blocked
4. Check \`conntrack -L\` — is the connection being tracked?
5. Check cloud security groups — if the packet never arrives at the OS
6. Check \`ufw status verbose\` if using UFW
7. Verify the service is listening: \`ss -tlnp | grep <port>\``,
          interviewQuestions: [
            {
              difficulty: "junior",
              question: "How do you list all current iptables rules on a Linux server?",
              answer:
                "Run \`iptables -L -n -v --line-numbers\` to list all rules in the filter table with packet/byte counters, numeric addresses (no DNS lookups), and line numbers. Add \`-t nat\` to see NAT rules. For a format you can save and restore, use \`iptables-save\`. On systems using nftables, use \`nft list ruleset\` instead.",
            },
            {
              difficulty: "junior",
              question: "What is the difference between iptables DROP and REJECT targets?",
              answer:
                "DROP silently discards the packet — the sender gets no response and must wait for a timeout. REJECT sends an ICMP error (connection refused) or TCP RST back to the sender, which immediately notifies them the connection was denied. From a security perspective, DROP is preferred because it reveals less about your infrastructure. From a debugging perspective, REJECT is easier to diagnose. nmap reports DROP targets as 'filtered' and REJECT targets as 'closed'.",
            },
            {
              difficulty: "mid",
              question:
                "Users suddenly can't connect to your service, but the iptables rules haven't changed and the service is running. What could cause this?",
              answer:
                "The conntrack table may be full. Linux uses connection tracking to handle stateful firewall rules, and when the table is full (\`nf_conntrack_count == nf_conntrack_max\`), all new connections are dropped. Check: \`cat /proc/sys/net/netfilter/nf_conntrack_count\` vs \`nf_conntrack_max\`. Also check \`dmesg | grep 'nf_conntrack: table full'\`. Immediate fix: \`sysctl -w net.netfilter.nf_conntrack_max=524288\`. Long-term: tune the max or reduce connection tracking overhead by using \`NOTRACK\` rules for high-volume trusted traffic.",
            },
            {
              difficulty: "mid",
              question: "How would you temporarily allow traffic on a port to test if a firewall rule is the problem, then revert the change?",
              answer:
                "With iptables: \`iptables -I INPUT 1 -p tcp --dport 8080 -j ACCEPT\` inserts at position 1 (evaluated first). Test the connection. Then remove it: \`iptables -D INPUT -p tcp --dport 8080 -j ACCEPT\`. With ufw: \`ufw allow 8080/tcp\`, test, then \`ufw delete allow 8080/tcp\`. Always document what you change and revert promptly in production.",
            },
            {
              difficulty: "senior",
              question:
                "Explain how you would use iptables LOG rules in a production environment to diagnose intermittent connection failures without impacting performance.",
              answer:
                "Add targeted LOG rules with specific matching criteria to minimize log volume — e.g., log only SYN packets from a specific IP range rather than all dropped traffic. Use the \`--log-level 4\` (warning) flag to avoid flooding logs. Implement rate limiting: \`iptables -I INPUT 1 -p tcp --dport 443 -m limit --limit 10/min --limit-burst 20 -j LOG --log-prefix 'DROP-443: '\`. Set up the rule, reproduce the issue, collect logs, then remove the LOG rule. In high-traffic environments, consider using \`nflog\` with \`ulogd2\` for more efficient userspace logging, or enable VPC Flow Logs if you're in a cloud environment.",
            },
          ],
          quizQuestions: [
            {
              type: "scenario",
              question:
                "An application team says their service can't connect to a Redis instance at 10.0.1.20:6379. The Redis server is running and \`ss -tlnp\` shows it's listening on 0.0.0.0:6379. What is your debugging approach?",
              answer:
                "1. From the application server, test connectivity: \`nc -zv 10.0.1.20 6379\` or \`redis-cli -h 10.0.1.20 ping\`. 2. If it fails, run \`nmap -p 6379 10.0.1.20\` — 'filtered' means a firewall is dropping packets. 3. On the Redis server, add a temporary log rule: \`iptables -I INPUT 1 -p tcp --dport 6379 -j LOG --log-prefix 'REDIS-ACCESS: '\`. 4. Retry the connection and check \`journalctl -k | grep REDIS-ACCESS\` — if no log entry appears, the packet never reached the Redis host (cloud security group is blocking). If a log appears, check iptables rules on the Redis host.",
            },
            {
              type: "scenario",
              question:
                "After a system update, iptables shows policy ACCEPT on all chains but the server seems to be blocking traffic. What else could be enforcing the firewall policy?",
              answer:
                "Several layers can enforce access control beyond iptables: (1) nftables — the iptables command may show the legacy view while nftables has its own ruleset (\`nft list ruleset\`), (2) UFW — manages its own iptables rules that persist, (3) firewalld — manages iptables/nftables as a service, (4) SELinux/AppArmor — can block network access at the application level, (5) cloud security groups — operate entirely outside the OS. Check each layer systematically.",
            },
            {
              type: "scenario",
              question:
                "Your monitoring shows intermittent connection failures to a microservice during traffic spikes. Everything looks normal between spikes. What is the most likely cause and how do you verify it?",
              answer:
                "The most likely cause is the conntrack table filling up. During spikes, the number of tracked connections exceeds \`nf_conntrack_max\`, causing new connections to be dropped. Verify: \`watch -n 1 'cat /proc/sys/net/netfilter/nf_conntrack_count'\` during a spike. Also check \`dmesg | grep nf_conntrack\` for 'table full' messages. Fix: increase \`nf_conntrack_max\`, tune \`nf_conntrack_tcp_timeout_time_wait\` to reduce how long TIME_WAIT connections are tracked, or use \`NOTRACK\` for high-volume internal traffic.",
            },
            {
              type: "hands-on",
              question:
                "Write iptables commands to: (1) add a logging rule for all dropped packets on port 5432, (2) check what's being logged, and (3) remove the logging rule when done.",
              answer:
                "Add: \`iptables -I INPUT 1 -p tcp --dport 5432 -j LOG --log-prefix 'PG-DROP: ' --log-level 4\`. Monitor: \`journalctl -kf | grep 'PG-DROP'\`. Remove: \`iptables -D INPUT 1\` (if it's still at position 1) or \`iptables -D INPUT -p tcp --dport 5432 -j LOG --log-prefix 'PG-DROP: ' --log-level 4\`.",
              hint: "Use iptables -I (insert) to put the LOG rule before any DROP rules. Use iptables -D (delete) with the exact same rule specification to remove it.",
            },
            {
              type: "hands-on",
              question:
                "Write an nmap command to scan a host and determine which ports are open, closed (rejected), and filtered (silently dropped), focusing on ports 22, 80, 443, 3306, 5432, 6379, and 8080.",
              answer:
                "Run: \`nmap -p 22,80,443,3306,5432,6379,8080 -sV --reason <target-ip>\` — \`-p\` specifies the ports, \`-sV\` attempts service version detection, \`--reason\` shows why each port state was determined (e.g., 'syn-ack' for open, 'rst' for closed, 'no-response' for filtered).",
              hint: "nmap's --reason flag shows what response (or lack of response) determined the port state. 'filtered' = DROP, 'closed' = REJECT with RST/ICMP.",
            },
            {
              type: "hands-on",
              question:
                "Write a conntrack command to monitor new connections being established in real time, filtered to only show TCP connections on port 443.",
              answer:
                "Run: \`conntrack -E -e NEW -p tcp --dport 443\` — \`-E\` enables event monitoring mode, \`-e NEW\` shows only new connection events, \`-p tcp\` filters to TCP protocol, and \`--dport 443\` filters to destination port 443.",
              hint: "conntrack -E enables event mode (like 'watch' for the conntrack table). The -e flag specifies event types: NEW, UPDATE, DESTROY.",
            },
          ],
        },
      ],
    },
    {
      id: "app-pipeline-troubleshooting",
      title: "Application & Pipeline Debugging",
      level: "intermediate",
      description:
        "Debug web application errors, log analysis, CI/CD pipeline failures, Docker build issues, and flaky tests in modern DevOps environments.",
      lessons: [
        {
          id: "webapp-debug",
          title: "Web Application Debugging",
          duration: 55,
          type: "lesson",
          description:
            "Diagnose 4xx/5xx HTTP errors, analyze nginx and application logs, implement health checks, debug connection pooling, and identify slow database queries.",
          objectives: [
            "Distinguish between 4xx client errors and 5xx server errors",
            "Extract meaningful signals from nginx and Apache access and error logs",
            "Parse and correlate application logs across microservices",
            "Implement and interpret health check endpoints",
            "Identify connection pool exhaustion symptoms",
            "Find and optimize slow database queries",
          ],
          tags: ["web", "nginx", "logs", "http", "debugging", "database", "health-checks"],
          content: `# Web Application Debugging

Web application failures manifest as HTTP error codes, timeouts, or degraded performance. Each error code tells a story — your job is to read it, find the log line, and trace the failure to its root cause in the stack.

## Understanding HTTP Status Codes

| Code | Category | Common Cause |
|------|----------|--------------|
| 400 | Client Error | Malformed request, invalid JSON |
| 401 | Client Error | Missing or invalid auth token |
| 403 | Client Error | Auth valid but insufficient permissions |
| 404 | Client Error | Resource doesn't exist, wrong URL |
| 408 | Client Error | Client too slow sending request |
| 429 | Client Error | Rate limit exceeded |
| 500 | Server Error | Unhandled exception, code bug |
| 502 | Server Error | Upstream returned invalid response |
| 503 | Server Error | Upstream down or overloaded |
| 504 | Server Error | Upstream timed out |

502 and 504 are especially important — they mean nginx received the request but the upstream app server failed (502) or was too slow (504).

## Nginx Log Analysis

\`\`\`bash
# Access log format (default combined)
# 10.0.1.5 - - [12/May/2026:10:23:41 +0000] "GET /api/users HTTP/1.1" 200 4302 "-" "curl/7.81.0"

# Tail the access log in real time
tail -f /var/log/nginx/access.log

# Count HTTP status codes in the last 1000 requests
tail -1000 /var/log/nginx/access.log | awk '{print \$9}' | sort | uniq -c | sort -rn

# Find the slowest requests (if \$request_time is logged)
awk '{print \$NF, \$7}' /var/log/nginx/access.log | sort -rn | head -20

# Find all 5xx errors with their URLs
grep ' 5[0-9][0-9] ' /var/log/nginx/access.log | awk '{print \$9, \$7}' | sort | uniq -c | sort -rn

# Error log — shows upstream failures
tail -f /var/log/nginx/error.log
\`\`\`

Key nginx error log patterns:

\`\`\`
# Upstream returned error
2026/05/12 10:23:41 [error] 1234#0: *5678 connect() failed (111: Connection refused) while connecting to upstream

# Upstream too slow
2026/05/12 10:23:41 [error] 1234#0: *5679 upstream timed out (110: Connection timed out) while reading response header from upstream

# Too many open files
2026/05/12 10:23:41 [alert] 1234#0: *5680 accept4() failed (24: Too many open files)
\`\`\`

## Application Log Analysis

Modern applications log to stdout/stderr, captured by systemd or the container runtime.

\`\`\`bash
# Follow application logs via systemd
journalctl -u myapp -f

# Find all ERROR level logs in the last hour
journalctl -u myapp --since "1 hour ago" | grep -i error

# For containerized apps
docker logs myapp --tail 100 -f
kubectl logs -n production deployment/myapp --tail 100 -f

# Correlate logs across multiple pods
kubectl logs -n production -l app=myapp --prefix --tail 50 | grep ERROR
\`\`\`

For structured (JSON) logs, use \`jq\` for filtering:

\`\`\`bash
# Parse JSON logs and filter by level
journalctl -u myapp -o json | jq 'select(.level == "ERROR") | {timestamp: .REALTIME_TIMESTAMP, msg: .MESSAGE}'

# Find logs containing a specific request ID
docker logs myapp 2>&1 | grep '"request_id":"abc-123"'
\`\`\`

## Health Check Endpoints

A proper health check endpoint is essential for automated debugging and load balancer routing.

\`\`\`bash
# Basic availability check
curl -f http://localhost:8080/health || echo "Service unhealthy"

# Detailed health check with timing
curl -s -w "\\nStatus: %{http_code} | Time: %{time_total}s\\n" http://localhost:8080/health | jq .

# Check health across multiple pods
for pod in \$(kubectl get pods -n production -l app=myapp -o name); do
  echo -n "\$pod: "
  kubectl exec -n production \$pod -- curl -sf http://localhost:8080/health | jq -r '.status'
done
\`\`\`

A well-designed health endpoint returns:

\`\`\`json
{
  "status": "degraded",
  "checks": {
    "database": "ok",
    "redis": "ok",
    "external_api": "timeout"
  },
  "version": "1.2.3",
  "uptime_seconds": 3600
}
\`\`\`

This tells you immediately which dependency is causing the degradation.

## Connection Pool Exhaustion

Connection pool exhaustion is one of the most common causes of 500/503 errors under load. It happens when all connections in the pool are in use and new requests must wait.

Symptoms:
- Requests time out after exactly the pool timeout value
- Error messages like "connection pool timeout", "too many connections", or "pool exhausted"
- Database shows many connections in IDLE state (held but not used)

\`\`\`bash
# PostgreSQL: count connections by state
psql -h dbhost -U admin -c "SELECT state, count(*) FROM pg_stat_activity GROUP BY state;"

# MySQL: show all connections
mysql -h dbhost -u admin -e "SHOW PROCESSLIST;"

# Check max connections vs current
psql -c "SELECT setting FROM pg_settings WHERE name = 'max_connections';"
psql -c "SELECT count(*) FROM pg_stat_activity;"
\`\`\`

Fix: reduce pool size per application instance (ensure pool × instances < DB max_connections), implement connection timeouts, or add a connection pooler like PgBouncer.

## Slow Query Diagnosis

\`\`\`bash
# PostgreSQL: find queries running > 5 seconds right now
psql -c "SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
         FROM pg_stat_activity
         WHERE (now() - pg_stat_activity.query_start) > interval '5 seconds'
         ORDER BY duration DESC;"

# PostgreSQL: enable slow query log
# In postgresql.conf:
# log_min_duration_statement = 1000   # log queries > 1 second

# MySQL slow query log
mysql -e "SET GLOBAL slow_query_log = 'ON'; SET GLOBAL long_query_time = 1;"
tail -f /var/log/mysql/slow.log

# Explain a slow query
psql -c "EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 12345;"
\`\`\`

The EXPLAIN output shows table scans (Seq Scan) vs index scans. A Seq Scan on a large table with no filter push-down is a red flag — add an index.`,
          interviewQuestions: [
            {
              difficulty: "junior",
              question:
                "What is the difference between a 502 Bad Gateway and a 504 Gateway Timeout?",
              answer:
                "Both occur when nginx (acting as a reverse proxy) has a problem communicating with the upstream application server. 502 Bad Gateway means the upstream server responded but with an invalid response (e.g., it crashed mid-response, sent malformed HTTP, or was completely unreachable). 504 Gateway Timeout means the upstream server accepted the connection but didn't respond within the configured timeout — usually indicating the upstream is alive but overloaded or stuck on a slow operation.",
            },
            {
              difficulty: "junior",
              question:
                "How do you find the top 10 most frequent URLs returning 500 errors in an nginx access log?",
              answer:
                "Run: \`grep ' 500 ' /var/log/nginx/access.log | awk '{print \$7}' | sort | uniq -c | sort -rn | head -10\` — this filters lines with HTTP 500 status, extracts the URL (field 7 in combined log format), counts occurrences, and sorts by frequency.",
            },
            {
              difficulty: "mid",
              question:
                "Users report intermittent 503 errors that appear under load but not during normal traffic. How do you diagnose this?",
              answer:
                "503 under load suggests resource exhaustion. Check: (1) connection pool — if pool is exhausted, requests queue then time out; (2) upstream health — nginx returns 503 when all upstreams are marked down; (3) worker process limits — nginx/gunicorn worker count vs concurrent requests; (4) system limits — file descriptors, conntrack table. Reproduce the load with a tool like \`ab\` or \`hey\`, then monitor \`ss -s\` for connection counts, check nginx error log for the specific 503 reason, and watch \`vmstat\` for resource saturation.",
            },
            {
              difficulty: "mid",
              question:
                "What is connection pool exhaustion and how does it manifest in application logs?",
              answer:
                "Connection pool exhaustion occurs when all pre-allocated database connections are in use and new requests must wait for one to be released. Applications typically log errors like 'connection pool timeout after Xms', 'too many clients', or 'QueuePool limit of size X, overflow Y reached'. It manifests as requests that take exactly the pool timeout value to fail. The database side shows many connections in 'idle in transaction' or 'idle' state (held by the pool but not executing). Root cause is usually pool size too small for the concurrency level, or slow queries holding connections too long.",
            },
            {
              difficulty: "senior",
              question:
                "How would you implement a distributed tracing strategy to debug a latency issue that only manifests when multiple microservices are involved?",
              answer:
                "Implement trace context propagation using W3C TraceContext or B3 headers — each service passes a trace ID and span ID in HTTP headers. Use an instrumentation library (OpenTelemetry is the standard) to auto-instrument HTTP clients and servers. Send spans to a tracing backend (Jaeger, Tempo, Zipkin). When a latency issue is reported, pull the trace by ID and view the waterfall — you'll see the exact span where latency is introduced. For intermittent issues, set up tail-based sampling to capture 100% of traces exceeding a latency threshold. Correlate trace IDs with application logs by injecting the trace ID into log context.",
            },
          ],
          quizQuestions: [
            {
              type: "scenario",
              question:
                "Your nginx access log shows a spike in 504 errors starting at 14:00. The app process is still running. What do you check and in what order?",
              answer:
                "1. Check nginx error log for timeout messages: \`grep 'upstream timed out' /var/log/nginx/error.log | tail -20\`. 2. Check if the app process is healthy: \`systemctl status myapp\` and the app's own logs. 3. Check for slow database queries: query \`pg_stat_activity\` for long-running queries. 4. Check system resources at 14:00: correlate with monitoring for CPU, memory, disk I/O spikes. 5. Check if any deployment or cron job ran at 14:00. 6. Increase nginx proxy_read_timeout as a temporary mitigation while identifying root cause.",
            },
            {
              type: "scenario",
              question:
                "Your health check endpoint returns 200 OK but users report the app is broken. The health check just returns 'OK'. What's wrong and how do you improve this?",
              answer:
                "The health check is too shallow — it only verifies the web server process is running, not that dependencies are working. A process can be running while its database connection is broken or its external API dependency is down. Improve the health check to: (1) verify database connectivity (run a simple SELECT 1), (2) check Redis connection with a PING, (3) verify external API dependencies with a lightweight request, (4) return a structured JSON response with per-dependency status. Consider implementing separate /healthz (liveness) and /readyz (readiness) endpoints — readiness failing removes the pod from load balancer rotation without restarting it.",
            },
            {
              type: "scenario",
              question:
                "Application logs show 'connection pool timeout' errors starting after a recent deployment that added a new feature. How do you diagnose the connection leak?",
              answer:
                "The new feature likely introduces a code path that acquires a database connection but doesn't always release it (e.g., an exception handler that returns before closing the connection). Steps: (1) Check \`pg_stat_activity\` to count connections and see which queries they're running, (2) look for 'idle in transaction' connections — these indicate transactions not committed/rolled back, (3) compare pool usage metrics before and after deployment, (4) code review the new feature's database access paths, focusing on error handling and finally blocks, (5) test with increased pool timeout to get better stack traces in logs.",
            },
            {
              type: "hands-on",
              question:
                "Write a command to extract all unique 5xx error URLs from an nginx access log, count them, and show the top 10 sorted by frequency.",
              answer:
                "Run: \`awk '\$9 ~ /^5/ {print \$7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10\` — \`awk\` checks if field 9 (status code) starts with 5, extracts field 7 (URL), then \`sort | uniq -c | sort -rn\` counts and ranks by frequency.",
              hint: "In nginx combined log format, the status code is the 9th field and the URL is the 7th field. Use awk to filter on the status code field.",
            },
            {
              type: "hands-on",
              question:
                "Write a PostgreSQL query to find all currently running queries that have been executing for more than 30 seconds, showing the query, duration, and client address.",
              answer:
                "Run: \`SELECT pid, client_addr, now() - query_start AS duration, left(query, 100) AS query_preview FROM pg_stat_activity WHERE state = 'active' AND (now() - query_start) > interval '30 seconds' ORDER BY duration DESC;\` — this filters to active queries, calculates runtime, and truncates the query text for readability.",
              hint: "pg_stat_activity shows all current database connections and their state. The query_start timestamp and 'active' state filter identifies running queries.",
            },
            {
              type: "hands-on",
              question:
                "Write a shell script snippet that checks the /health endpoint of a service every 5 seconds for 60 seconds and reports when it returns a non-200 status code.",
              answer:
                "Use: \`end=\$((SECONDS+60)); while [ \$SECONDS -lt \$end ]; do status=\$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/health); [ \"\$status\" != '200' ] && echo \"\$(date): Health check failed with status \$status\"; sleep 5; done\` — this runs a timed loop, captures the HTTP status code, and prints an alert with timestamp if it's not 200.",
              hint: "Use curl's -w flag with %{http_code} and -o /dev/null to capture just the status code. SECONDS is a bash built-in that tracks elapsed time.",
            },
          ],
        },
        {
          id: "pipeline-debug",
          title: "CI/CD Pipeline Failure Debugging",
          duration: 50,
          type: "lesson",
          description:
            "Diagnose and fix CI/CD pipeline failures including failed stages, docker build issues, artifact problems, environment variable errors, permission failures, and flaky tests.",
          objectives: [
            "Read and interpret CI pipeline logs to identify failure root cause",
            "Debug Docker build failures including layer caching issues",
            "Identify missing or misconfigured environment variables",
            "Resolve permission errors in CI runners and Docker",
            "Handle artifact upload/download failures",
            "Diagnose and quarantine flaky tests",
          ],
          tags: ["ci-cd", "docker", "github-actions", "jenkins", "flaky-tests", "debugging"],
          content: `# CI/CD Pipeline Failure Debugging

CI/CD pipelines fail in predictable patterns. The key is building a mental taxonomy of failure types — build failures, test failures, infrastructure failures, and environment failures — and applying targeted diagnostic techniques to each.

## Reading Pipeline Logs Effectively

Before diving into specific tools, know how to read logs efficiently:

\`\`\`bash
# In GitHub Actions, collapse passing steps and focus on the red X
# In Jenkins, search for "ERROR" or "FAILED" in the console output
# In GitLab CI, the last few lines before "ERROR" are most important

# Reproduce locally with the same environment
docker run --rm -it \
  -e CI=true \
  -e NODE_ENV=test \
  -v \$(pwd):/workspace \
  -w /workspace \
  node:20-alpine \
  sh -c "npm ci && npm test"
\`\`\`

Always try to reproduce CI failures locally with the same Docker image the CI uses. If it passes locally but fails in CI, the difference is the environment.

## Docker Build Failures

### Layer Cache Issues

\`\`\`bash
# Build with no cache to rule out stale cache
docker build --no-cache -t myapp:debug .

# Show build cache usage
docker system df -v | grep -A5 "Build Cache"

# Prune build cache
docker builder prune --filter "until=24h"
\`\`\`

### Debugging a Failing Dockerfile

\`\`\`dockerfile
# Failing Dockerfile step:
# RUN pip install -r requirements.txt
\`\`\`

\`\`\`bash
# Build up to the failing step (use the step just before)
docker build --target=build-deps -t myapp:debug .

# Or build and capture the intermediate image ID from the output, then exec into it
docker build 2>&1 | grep "Running in"
docker run --rm -it <intermediate-image-id> /bin/sh

# Inside the container, run the failing command manually
pip install -r requirements.txt
# Now you see the actual error: "Could not find a version that satisfies..."
\`\`\`

### Common Docker Build Errors

\`\`\`bash
# "COPY failed: file not found in build context"
# Check .dockerignore isn't excluding the file
cat .dockerignore | grep <filename>
# Check the file path is relative to the build context
ls -la src/config/

# "exec /entrypoint.sh: no such file or directory"
# Usually a Windows line ending (CRLF) issue
file entrypoint.sh        # Should say "ASCII text" not "CRLF"
dos2unix entrypoint.sh    # Fix CRLF endings

# "permission denied" on entrypoint
# Check the CHMOD in Dockerfile
docker run --rm myapp ls -la /entrypoint.sh
# Fix: add to Dockerfile: RUN chmod +x /entrypoint.sh
\`\`\`

## Environment Variable Issues

Missing or wrong environment variables are responsible for a huge portion of CI failures.

\`\`\`bash
# Print all environment variables at the start of your CI job
env | sort

# Check if a specific variable is set (without printing its value)
[ -z "\${DATABASE_URL}" ] && echo "DATABASE_URL is not set!" && exit 1

# Debug variable substitution issues
echo "Connecting to: \${DATABASE_URL:-<not set>}"

# In GitHub Actions — check secrets are properly mapped
# In the workflow file:
# env:
#   DATABASE_URL: \${{ secrets.DATABASE_URL }}
\`\`\`

Common variable issues:
- Secret not added to the repository/environment
- Variable has a trailing newline or space (from copy-paste)
- Variable is set in the wrong scope (job vs step vs matrix)
- Different variable names between environments (PROD_DB_URL vs DATABASE_URL)

\`\`\`bash
# Detect trailing whitespace in a variable
echo "\${MY_VAR}" | cat -A   # Shows $ at end of each line; ^M indicates CRLF
echo "\${#MY_VAR}"           # Check length vs expected
\`\`\`

## Permission Errors in CI

\`\`\`bash
# "Permission denied" writing to workspace
# Often caused by Docker running as root creating files owned by root
# But CI runner trying to clean up as non-root user
ls -la /workspace   # Check file owners

# Fix: run the Docker container as the same UID as the CI runner
docker run --user \$(id -u):\$(id -g) ...

# Or in docker-compose for CI:
# user: "\${UID}:\${GID}"

# "Permission denied" on /var/run/docker.sock
# The CI runner user isn't in the docker group
groups   # Check current user's groups
ls -la /var/run/docker.sock   # Check socket permissions
# Fix: add user to docker group or use DOCKER_HOST to a TCP socket

# GitHub Actions: script is not executable
chmod +x scripts/deploy.sh
git update-index --chmod=+x scripts/deploy.sh   # Track in git
\`\`\`

## Artifact Issues

\`\`\`bash
# In GitHub Actions: upload artifact for debugging even on failure
- name: Upload test results
  uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: test-results-\${{ github.run_id }}
    path: |
      test-results/
      logs/
    retention-days: 5

# Download and inspect a CI artifact locally
gh run download <run-id> --name test-results
ls -la test-results/

# For large artifacts that time out during upload:
# Split them and upload incrementally, or store in S3/GCS directly
aws s3 cp test-results/ s3://my-ci-artifacts/\${CI_RUN_ID}/ --recursive
\`\`\`

## Diagnosing Flaky Tests

Flaky tests are the most insidious CI problem — they fail intermittently, making it hard to distinguish real failures from noise.

\`\`\`bash
# Run a test 10 times to measure its flakiness rate
for i in \$(seq 1 10); do
  npm test -- --testNamePattern "my flaky test" 2>&1 | tail -3
done

# Common causes of flaky tests:
# 1. Timing/race conditions — fix by using explicit waits
# 2. Shared state between tests — fix by proper setup/teardown
# 3. External service dependencies — fix by mocking
# 4. Order-dependent tests — fix by running in random order
# 5. Resource exhaustion — fix by reducing parallelism

# Run tests in random order to detect order dependencies (Jest)
jest --randomize

# Find the slowest tests (candidates for timeout flakiness)
jest --verbose 2>&1 | grep -E "✓|✗|✕" | awk '{print \$NF, \$0}' | sort -rn | head -20
\`\`\`

## Pipeline Debugging Checklist

\`\`\`bash
# 1. Is it reproducible locally?
docker run --rm -it <ci-image> bash
# Run the failing command manually

# 2. Did it pass before? When did it start failing?
git bisect start
git bisect bad HEAD
git bisect good <last-known-good-sha>

# 3. Is it infrastructure? (Network, registry, disk)
# Check CI runner logs, not just job logs

# 4. Is the dependency available?
# Pin dependency versions; use checksum verification
# npm ci (uses package-lock.json) vs npm install

# 5. Is there a timing issue?
# Add retries for network operations
# Use health checks before connecting to services
\`\`\`

## Practical Example: Debug a Failing GitHub Actions Workflow

\`\`\`bash
# 1. Get the failed run ID
gh run list --workflow=deploy.yml --status=failure | head -5

# 2. View the logs
gh run view <run-id> --log-failed

# 3. Re-run only failed jobs
gh run rerun <run-id> --failed

# 4. Download artifacts for offline analysis
gh run download <run-id>

# 5. Add debug logging to the workflow temporarily
# Set secret: ACTIONS_RUNNER_DEBUG = true
# Set secret: ACTIONS_STEP_DEBUG = true
\`\`\`

The \`ACTIONS_STEP_DEBUG\` secret enables verbose logging for every step, showing the exact commands executed and their full output — invaluable for debugging opaque action failures.`,
          interviewQuestions: [
            {
              difficulty: "junior",
              question:
                "A Docker build fails with 'COPY failed: file not found in build context'. How do you debug this?",
              answer:
                "First check if the file exists in the expected location relative to the build context directory. Run \`ls -la\` to verify. Then check \`.dockerignore\` — the file may be excluded by an overly broad pattern like \`*.env\` or \`**/*.json\`. Verify the build context path: if running \`docker build -f docker/Dockerfile .\` the context is \`.\` but if running from a different directory, paths may not match. The Dockerfile COPY path must be relative to the build context root, not relative to the Dockerfile location.",
            },
            {
              difficulty: "junior",
              question:
                "How do you make CI pipeline artifacts available for debugging after a test failure?",
              answer:
                "In GitHub Actions, use the \`upload-artifact\` action with \`if: failure()\` to upload test results, logs, and screenshots even when the job fails. In Jenkins, use the \`archiveArtifacts\` step in a \`post { failure { } }\` block. In GitLab CI, use the \`artifacts: when: on_failure\` option. The key is to capture logs, test reports, and any generated files before the workspace is cleaned up.",
            },
            {
              difficulty: "mid",
              question:
                "Your pipeline fails intermittently about 20% of the time on the same test. How do you diagnose flaky tests?",
              answer:
                "First isolate the test by running it in a loop (e.g., 20 times) to measure its actual failure rate and collect failure messages. Common causes: (1) race conditions — the test has async operations without proper awaiting; (2) test order dependency — add randomized test ordering to expose this; (3) shared state — check if tests are modifying global state without cleanup; (4) external dependencies — mock external services; (5) timing assumptions — use polling with a timeout instead of \`sleep\`. Check if the failure correlates with high system load by running with reduced parallelism.",
            },
            {
              difficulty: "mid",
              question:
                "A CI job fails with 'permission denied' when trying to write to the workspace. What are the likely causes?",
              answer:
                "The most common cause is a Docker container running as root creating files in the mounted workspace, and then the CI runner (running as a different user) can't read or delete them during cleanup. Fix: run the Docker container with \`--user \$(id -u):\$(id -g)\` to match the CI runner's UID/GID. Other causes: incorrect file permissions on scripts (\`chmod +x\` not committed to git — fix with \`git update-index --chmod=+x\`), or the CI runner lacks write permission to the workspace directory (check runner configuration).",
            },
            {
              difficulty: "senior",
              question:
                "How do you use git bisect to find which commit introduced a CI failure?",
              answer:
                "Run \`git bisect start\`, then \`git bisect bad HEAD\` (current commit is broken) and \`git bisect good <last-known-good-sha>\`. Git checks out a commit halfway between good and bad. Test it (run the CI job locally or trigger CI), then mark it \`git bisect good\` or \`git bisect bad\`. Repeat until git identifies the exact commit. Automate it: \`git bisect run npm test\` runs your test suite automatically at each step and bisects based on exit code. For CI failures, you can write a script that runs only the failing test and use it with \`git bisect run\`.",
            },
          ],
          quizQuestions: [
            {
              type: "scenario",
              question:
                "A Docker image builds successfully locally but the CI build fails with 'no space left on device'. The CI runner has 50GB of disk but the image is only 2GB. What is happening?",
              answer:
                "The CI runner's Docker build cache has accumulated over time and is consuming the disk space. Docker layer caches, dangling images, stopped containers, and unused volumes all contribute. Fix: add \`docker system prune -f --volumes\` to the CI job's setup step, or configure the CI runner to periodically clean up. Also check if the build itself creates large temporary files in intermediate layers that aren't cleaned up within the same layer — each RUN command creates a new layer, so cleanup must happen in the same RUN command: \`RUN apt-get update && apt-get install -y build-tools && make && apt-get purge -y build-tools && rm -rf /var/lib/apt/lists/*\`.",
            },
            {
              type: "scenario",
              question:
                "A pipeline passes on the main branch but fails on feature branches with 'API key not found'. The API key is a repository secret. What is likely wrong?",
              answer:
                "Repository secrets in GitHub Actions are not available to pull requests from forks (security feature), but branch secrets should be available on internal branches. Check: (1) the secret name matches exactly — secrets are case-sensitive; (2) the secret is defined at the right scope (repo vs environment vs organization); (3) the workflow's \`env\` block correctly references the secret (\`\${{ secrets.API_KEY }}\` not \`\$API_KEY\`); (4) if using environment-level secrets, the branch must match the environment's deployment branch rules. Add a debug step: \`run: echo \"Key length: \${{ secrets.API_KEY != '' && 'set' || 'empty' }}\"`.",
            },
            {
              type: "scenario",
              question:
                "Tests pass individually but fail when run in parallel in CI. What are the most likely causes and how do you fix them?",
              answer:
                "Parallel test execution failures indicate shared mutable state. Common causes: (1) Database — tests write to the same tables; fix by giving each parallel worker its own database schema or using database transactions that roll back; (2) Files — tests write to the same file paths; fix by using unique temp directories per test; (3) Ports — tests bind to the same port; fix by using random ports or port allocation; (4) Environment variables — one test modifies global env vars; fix by saving/restoring; (5) Shared caches or singletons in the application code. Run tests with \`--maxWorkers=1\` to confirm they pass serially, confirming parallelism is the issue.",
            },
            {
              type: "hands-on",
              question:
                "Write a bash script that runs a test command 10 times and reports how many times it failed, capturing the output of each failure.",
              answer:
                "Use: \`pass=0; fail=0; for i in \$(seq 1 10); do if npm test > /tmp/test-run-\$i.log 2>&1; then ((pass++)); else ((fail++)); echo \"Run \$i FAILED:\"; tail -5 /tmp/test-run-\$i.log; fi; done; echo \"Results: \$pass passed, \$fail failed out of 10 runs\"\`",
              hint: "Use a for loop with seq, redirect output to a per-run log file, check the exit code with if, and use arithmetic to count passes and failures.",
            },
            {
              type: "hands-on",
              question:
                "Write a Dockerfile RUN instruction that installs build dependencies, compiles a binary, and removes the build tools — all in a single layer to minimize image size.",
              answer:
                "Use: \`RUN apt-get update && apt-get install -y --no-install-recommends gcc make libssl-dev && make build && cp bin/myapp /usr/local/bin/ && apt-get purge -y gcc make libssl-dev && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*\` — chaining all commands in one RUN with && ensures cleanup happens in the same layer, preventing the build tools from being included in the final image size.",
              hint: "Each RUN creates a new image layer. Installing and removing tools in separate RUN commands still includes the tools in the intermediate layer. Chain them with && to keep it in one layer.",
            },
            {
              type: "hands-on",
              question:
                "Write a GitHub Actions workflow step that uses the gh CLI to download artifacts from the most recent failed run of a specific workflow, for local debugging.",
              answer:
                "Use: \`run: | FAILED_RUN=\$(gh run list --workflow=deploy.yml --status=failure --limit=1 --json databaseId --jq '.[0].databaseId') && echo \"Downloading artifacts from run \$FAILED_RUN\" && gh run download \$FAILED_RUN --dir ./ci-artifacts && ls -la ./ci-artifacts/ env: GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}\` — this uses \`gh run list\` with JSON output and \`jq\` to extract the ID of the latest failed run, then downloads its artifacts.",
              hint: "Use gh run list with --status=failure and --json to get structured output, then pipe to jq to extract the run ID. Then use gh run download with that ID.",
            },
          ],
        },
      ],
    },
  ],
};
