import type { Track } from "./types";

export const pythonTrack: Track = {
  id: "python",
  title: "Python",
  description: "Python for DevOps and automation",
  longDescription:
    "Learn Python from scratch with a DevOps focus — write automation scripts, build CLI tools, interact with APIs, and automate infrastructure tasks.",
  icon: "Code2",
  color: "#3776ab",
  gradient: "track-python-gradient",
  tags: ["programming", "automation", "scripting", "devops"],
  modules: [
    {
      id: "python-basics",
      title: "Python Basics",
      level: "beginner",
      description: "Get Python set up and learn the fundamental syntax.",
      lessons: [
        {
          id: "installing-python",
          title: "Installing Python",
          duration: 8,
          type: "lesson",
          description: "Install Python and set up a proper development environment.",
          content: `# Installing Python

## Why Python Version Management Matters

Python has a versioning problem: macOS and Linux ship with system Python (often Python 3.9 or older), which is owned by the OS and used by system tools. If you install packages into system Python using \`sudo pip\`, you risk breaking those OS tools. If you just use system Python without \`sudo\`, packages install to a per-user directory that may conflict between projects.

The solution used by professional developers is **pyenv** for version management and **virtual environments** for project isolation. This is the setup pattern you'll see in every serious Python project.

---

## Why pyenv?

pyenv solves three problems:

1. **Multiple Python versions side by side** — your ML project needs Python 3.11, your DevOps scripts need 3.12, your legacy app needs 3.9. pyenv installs all three and switches between them per-directory.
2. **No root required** — installs Python in \`~/.pyenv\` under your home directory. No \`sudo\`.
3. **Per-project version locking** — a \`.python-version\` file in a directory makes pyenv auto-switch to that version when you \`cd\` into it.

---

## Installation

### macOS

\`\`\`bash
# Using pyenv (recommended — manage multiple Python versions)
curl https://pyenv.run | bash

# Add to shell config (~/.zshrc or ~/.bashrc):
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"   # sets up shims — lightweight wrappers that intercept python/pip calls

# Reload shell config
source ~/.zshrc

# Install Python (builds from source — takes ~2 min)
pyenv install 3.12.3
pyenv global 3.12.3        # set as default Python for your user

# Or use Homebrew (simpler but less flexible)
brew install python@3.12
\`\`\`

### Linux (Ubuntu/Debian)

\`\`\`bash
# Install pyenv dependencies first
sudo apt update
sudo apt install -y build-essential libssl-dev zlib1g-dev \
  libbz2-dev libreadline-dev libsqlite3-dev curl \
  libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev

# Install pyenv
curl https://pyenv.run | bash

# Same shell config additions as macOS above...

# Or install system Python (simpler but limited version control)
sudo apt install python3.12 python3.12-venv python3-pip
\`\`\`

### Windows

\`\`\`powershell
# Download from python.org/downloads
# Or use winget (Windows Package Manager)
winget install Python.Python.3.12

# Or use pyenv-win for version management
pip install pyenv-win --target $HOME\\.pyenv
[System.Environment]::SetEnvironmentVariable('PYENV', "$HOME\.pyenv\pyenv-win", 'User')
\`\`\`

---

## Verify Installation

\`\`\`bash
python3 --version
# Python 3.12.3

python3 -c "print('Hello, DevOps!')"
# Hello, DevOps!

which python3
# /Users/you/.pyenv/shims/python3  ← if using pyenv (correct)
# /usr/bin/python3                  ← if using system Python

pip3 --version
# pip 24.0 from ~/.pyenv/versions/3.12.3/lib/...  (pyenv pip)
\`\`\`

**Important**: Always verify \`which python3\` points to pyenv's shims directory, not \`/usr/bin\` or \`/usr/local/bin\`, before installing packages.

---

## Virtual Environments — Essential for Every Project

A virtual environment is a self-contained Python installation with its own packages, isolated from the system Python and from other virtual environments. Think of it like a Docker container for Python dependencies.

**Why you need virtual environments:**
- Project A needs \`requests==2.28\`, Project B needs \`requests==2.31\` — venvs let both coexist
- \`pip install\` in a venv never affects system Python or other projects
- You can \`rm -rf .venv/\` and start fresh without breaking anything
- CI/CD can create a fresh venv on each run for reproducibility

\`\`\`bash
# Create a virtual environment in the project directory
cd my-devops-project
python3 -m venv .venv        # creates .venv/ directory

# Activate it (macOS/Linux)
source .venv/bin/activate
# Activate (Windows PowerShell)
.venv\\Scripts\\Activate.ps1

# Your prompt changes: (.venv) you@machine:~$

# Now pip installs go INTO .venv, not system Python
pip install requests boto3 pyyaml

# See what's installed
pip list

# Freeze exact versions for reproducibility
pip freeze > requirements.txt
# requests==2.31.0
# boto3==1.34.0
# pyyaml==6.0.1

# Deactivate when done
deactivate

# On another machine / in CI:
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt    # installs exact pinned versions
\`\`\`

**Add .venv to .gitignore** — never commit the virtual environment directory:

\`\`\`bash
echo ".venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore
\`\`\`

---

## The REPL (Interactive Shell)

Python's REPL (Read-Eval-Print Loop) lets you experiment interactively — ideal for testing small pieces of code before putting them in a script:

\`\`\`bash
python3
\`\`\`

\`\`\`python
>>> 2 + 2
4
>>> "hello".upper()
'HELLO'
>>> import os
>>> os.getcwd()
'/Users/you'
>>> import json; json.dumps({"key": "value"})
'{"key": "value"}'
>>> exit()
\`\`\`

> **Tip:** IPython gives you syntax highlighting, tab completion, and magic commands — great for exploration:
> \`pip install ipython && ipython\`

---

## Running Python Scripts

\`\`\`bash
# Create a script
cat > deploy_check.py << 'EOF'
#!/usr/bin/env python3
"""Check if all required environment variables are set before deployment."""
import os
import sys

required_vars = ["DATABASE_URL", "API_KEY", "AWS_REGION"]

missing = [var for var in required_vars if not os.getenv(var)]

if missing:
    print(f"ERROR: Missing environment variables: {', '.join(missing)}")
    sys.exit(1)

print("All required environment variables are set. Proceeding...")
EOF

# Run it
python3 deploy_check.py

# Make it executable (Unix — the shebang line #!/usr/bin/env python3 is used)
chmod +x deploy_check.py
./deploy_check.py
\`\`\`

**Shebang line explained**: \`#!/usr/bin/env python3\` tells the OS to find \`python3\` in PATH and use it to run the script. Using \`env\` rather than a hardcoded path (\`#!/usr/bin/python3\`) makes the script portable across machines where Python might be installed in different locations.

---

## Python Version Management with pyenv

\`\`\`bash
# List available Python versions to install
pyenv install --list | grep "  3\\."

# Install multiple versions
pyenv install 3.11.9
pyenv install 3.12.3

# Set global default
pyenv global 3.12.3

# Set version for a specific directory (creates .python-version file)
cd ~/projects/legacy-app
pyenv local 3.11.9
python3 --version   # Python 3.11.9 — auto-switched!

# List installed versions
pyenv versions
#   system
# * 3.12.3 (set by ~/.pyenv/version)
#   3.11.9

# Uninstall a version
pyenv uninstall 3.11.9
\`\`\`
`,
          interviewQuestions: [
            {
              question: "Why is Python popular for DevOps and automation? What are its strengths and weaknesses?",
              difficulty: "junior" as const,
              answer: `**Python's strengths for DevOps:**

1. **Readable syntax** — scripts are maintainable by teammates who aren't Python experts
2. **Rich standard library** — \`os\`, \`subprocess\`, \`json\`, \`pathlib\`, \`http\` cover most automation needs without extra dependencies
3. **Excellent library ecosystem:**
   - \`boto3\` for AWS automation
   - \`kubernetes\` for K8s management
   - \`requests\` for HTTP APIs
   - \`paramiko\` for SSH automation
   - \`ansible\` (written in Python) for config management
4. **Shell replacement** — Python subprocess handles shell commands better than complex Bash (error handling, data parsing)
5. **Cross-platform** — works on Linux, macOS, Windows (unlike Bash)
6. **AI/ML integration** — same language for DevOps automation and ML pipeline management

**Weaknesses:**
- **Slower than Go/Rust** for performance-critical tools (kubectl, Terraform are Go — startup is ~100ms vs Python's 100-500ms)
- **Dependency management** can be complex (virtualenvs, pip conflicts)
- **Not as natural for interactive one-liners** as Bash
- **GIL (Global Interpreter Lock)** limits true thread-based parallelism for CPU-bound tasks

**When to use Python vs. Bash:**
- Logic complexity > 20 lines → Python
- Need to parse JSON/YAML → Python
- Calling multiple APIs → Python
- Simple one-time file ops → Bash`,
            },
          ],
        },
        {
          id: "variables-types",
          title: "Variables & Data Types",
          duration: 15,
          type: "lesson",
          description: "Learn Python's dynamic type system and core data types.",
          content: `# Variables & Data Types

## How Python's Type System Works

Python is **dynamically typed** — the type of a variable is determined at runtime by the value assigned to it, not declared in advance. This is different from Java or Go where you write \`int count = 0;\`.

Under the hood, every Python value is an **object** on the heap. A variable is just a name that points (references) to that object. When you write \`x = 42\`, Python creates an \`int\` object with value 42 and binds the name \`x\` to it. When you write \`x = "hello"\`, \`x\` now points to a new \`str\` object — the integer still exists until garbage collected.

This has a practical consequence: **multiple variables can point to the same object**:

\`\`\`python
a = [1, 2, 3]
b = a          # b points to the SAME list, not a copy
b.append(4)
print(a)       # [1, 2, 3, 4] — a was modified too!

# To copy: use .copy() or list()
b = a.copy()   # now b is an independent list
\`\`\`

Understanding references vs copies prevents a major class of bugs in Python automation scripts.

---

## Variables

\`\`\`python
# No declaration needed — just assign
name = "Alice"
age = 30
is_active = True
score = 98.5

# Multiple assignment — all three point to the same 0 object
x = y = z = 0

# Tuple unpacking — swap without a temp variable
a, b = 1, 2
a, b = b, a    # a=2, b=1

# Unpack from a list or tuple
host, port = "localhost", 5432

# Star unpacking
first, *rest = [1, 2, 3, 4, 5]
# first=1, rest=[2, 3, 4, 5]

head, *middle, last = [1, 2, 3, 4, 5]
# head=1, middle=[2, 3, 4], last=5

# Delete a variable (removes the name binding, object may still exist in memory)
del name
\`\`\`

---

## Core Types

### Strings — Immutable Text

Strings are **immutable** — string methods always return a new string, never modify in place. This is different from lists.

\`\`\`python
name = "DevOps"
greeting = 'Hello, World!'
multiline = """
This spans
multiple lines
"""

# f-strings (Python 3.6+, preferred for formatting — faster than .format())
version = 3.12
print(f"Python {version}")            # Python 3.12
print(f"2 + 2 = {2 + 2}")            # 2 + 2 = 4
print(f"Path: {'/'.join(['usr', 'bin', 'python3'])}")  # expressions work

# Common string methods — all return new strings
"hello".upper()                        # 'HELLO'
"HELLO".lower()                        # 'hello'
"  strip me  ".strip()                 # 'strip me'  (also lstrip, rstrip)
"  strip me  ".strip()                 # 'strip me'
"a,b,c".split(",")                     # ['a', 'b', 'c']
",".join(["a", "b", "c"])             # 'a,b,c'
"hello world".replace("world", "Python")  # 'hello Python'
len("hello")                           # 5
"hello".startswith("he")              # True
"hello".endswith("lo")                # True
"git" in "github"                     # True (membership test)
"hello world".count("l")             # 3

# String formatting for DevOps scripts
ip = "192.168.1.1"
port = 8080
url = f"http://{ip}:{port}/health"    # 'http://192.168.1.1:8080/health'

# Multiline strings for embedding configs or SQL
nginx_config = """
server {
    listen 80;
    server_name example.com;
}
"""

# Raw strings (r-prefix) — backslashes not treated as escape sequences
windows_path = r"C:\\Users\\alice"    # useful for Windows paths and regex
\`\`\`

### Numbers — Integers and Floats

\`\`\`python
# Integer — arbitrary precision in Python (no overflow!)
count = 42
big = 1_000_000       # underscores for readability — same as 1000000
binary = 0b1010       # binary literal → 10
hex_val = 0xFF        # hex literal → 255

# Float — 64-bit IEEE 754 (has precision limits!)
pi = 3.14159
temp = -17.5
scientific = 1.5e10   # 15000000000.0

# IMPORTANT: float comparison pitfall
0.1 + 0.2 == 0.3      # False! (float precision)
abs(0.1 + 0.2 - 0.3) < 1e-9  # True — use epsilon comparison

# Arithmetic operators
10 + 3    # 13
10 - 3    # 7
10 * 3    # 30
10 / 3    # 3.3333...  (always float in Python 3)
10 // 3   # 3  (floor division — rounds down to int)
10 % 3    # 1  (modulo — remainder)
2 ** 10   # 1024  (exponentiation)

# Type conversion
int("42")           # 42
int("0xFF", 16)     # 255 (parse hex string)
float("3.14")       # 3.14
str(100)            # "100"
bin(10)             # "0b1010"
hex(255)            # "0xff"

# Type checking
type(42)                # <class 'int'>
isinstance(42, int)     # True (preferred over type() for inheritance)
isinstance(42, (int, float))  # True — check multiple types
\`\`\`

### Booleans — True, False, and Truthiness

\`\`\`python
is_running = True
has_error = False

# Falsy values — all evaluate to False in boolean context:
# False, None, 0, 0.0, 0j, "", b"", [], (), {}, set()
bool(0)       # False
bool("")      # False
bool([])      # False
bool(None)    # False
bool("hi")    # True
bool([1])     # True
bool(-1)      # True (non-zero numbers are truthy!)

# Pythonic boolean usage — don't write == True or == False
services = get_running_services()

# Anti-pattern:
if len(services) > 0:
    ...
if services == []:
    ...

# Pythonic:
if services:           # truthy if non-empty
    ...
if not services:       # falsy if empty
    ...
\`\`\`

### None — The Absence of a Value

\`\`\`python
result = None   # represents "no value" — like null in other languages

# Always use 'is None', never '== None'
# 'is' checks identity (same object), '==' checks equality
# A custom object could override __eq__ to equal None, but 'is None' is always reliable
if result is None:
    print("No result yet")

if result is not None:
    process(result)

# Functions return None implicitly if no return statement
def log(message):
    print(f"[LOG] {message}")
    # implicitly returns None

value = log("test")
print(value)   # None
\`\`\`

---

## Mutable vs Immutable Types

This is one of the most important distinctions in Python:

| Immutable | Mutable |
|-----------|---------|
| int, float, bool | list |
| str | dict |
| tuple | set |
| frozenset | bytearray |

**Immutable** objects cannot be changed after creation. When you "modify" a string, Python creates a new string object.

**Mutable** objects can be changed in-place. When you pass a list to a function and modify it, the caller sees the change.

\`\`\`python
# Immutable: string operations create new objects
s = "hello"
s.upper()    # returns "HELLO" — s is still "hello"
s = s.upper()  # reassign s to the new string

# Mutable: list operations modify in place
items = [1, 2, 3]
items.append(4)  # modifies items directly, returns None
items[0] = 99    # in-place modification

# Danger: mutable default arguments in functions
def add_item(item, lst=[]):    # DON'T DO THIS
    lst.append(item)
    return lst

add_item("a")   # ["a"]
add_item("b")   # ["a", "b"]  ← bug! default list is shared across calls

def add_item(item, lst=None):  # Correct pattern
    if lst is None:
        lst = []
    lst.append(item)
    return lst
\`\`\`

---

## Type Hints (Python 3.5+)

Type hints document what types your functions expect and return. They're not enforced at runtime but enable IDE autocomplete, catch bugs with mypy/pyright, and serve as documentation.

\`\`\`python
# Basic type hints
def greet(name: str) -> str:
    return f"Hello, {name}!"

def get_port(service: str) -> int:
    ports = {"nginx": 80, "postgres": 5432, "redis": 6379}
    return ports.get(service, 8080)

# Complex types (Python 3.9+ — use list, dict, tuple directly)
def process(items: list[str], limit: int = 10) -> dict[str, int]:
    return {item: len(item) for item in items[:limit]}

# Optional type (can be None) — Python 3.10+ use X | None
from typing import Optional
def find_user(user_id: int) -> Optional[str]:
    ...

# Python 3.10+ union syntax
def find_user(user_id: int) -> str | None:
    ...

# Type alias
IPAddress = str
Port = int
def connect(host: IPAddress, port: Port) -> bool:
    ...
\`\`\`
`,
        },
      ],
      exam: [
        { question: "You need to run the same Python script on macOS, Linux, and Windows. What shebang line do you use and why?", answer: "Use '#!/usr/bin/env python3' because it searches PATH for python3, making the script portable across systems where Python may be installed in different locations. Hardcoding '/usr/bin/python3' fails on systems where Python is installed elsewhere.", difficulty: "junior" as const },
        { question: "A junior dev asks why their script works in the REPL but fails when run as a file. They wrote 'python script.py' but get 'python: command not found'. What are the likely causes and fixes?", answer: "The system may have Python installed as 'python3' not 'python'. Fix: use 'python3 script.py', or create an alias, or use pyenv to set a global Python. On newer Linux/macOS, 'python' is not available by default — only 'python3'.", difficulty: "junior" as const },
        { question: "Your team uses both Python 2 and Python 3 for different projects. How do you manage this without breaking system tools?", answer: "Use pyenv to install and switch between Python versions per project. Set a local version with 'pyenv local 3.12.3' which creates a .python-version file. This lets each project use its own Python version without affecting the system Python.", difficulty: "junior" as const },
        { question: "You see the output 'pip 24.0 from /usr/lib/python3/dist-packages/pip' — is this the pip associated with your pyenv Python? How do you verify?", answer: "No — that path suggests the system pip, not pyenv's. Verify with 'which pip3' and 'which python3'. If they point to /usr/lib instead of ~/.pyenv/shims, pyenv is not active. Fix by running 'pyenv init' and reloading your shell config.", difficulty: "mid" as const },
        { question: "You need to share a Python automation script with teammates who have different Python versions installed. What steps do you take to ensure it runs consistently?", answer: "Pin the Python version in a .python-version file (pyenv), document the minimum Python version required, use a requirements.txt or pyproject.toml for dependencies, include setup instructions in README. Consider packaging with a virtual environment setup script.", difficulty: "mid" as const },
        { question: "A script runs fine locally but on the CI server it fails with 'ModuleNotFoundError: No module named yaml'. What went wrong and how do you fix it?", answer: "The module was installed in the developer's local environment but not declared in requirements.txt. Fix: add 'pyyaml' to requirements.txt, run 'pip install -r requirements.txt' in CI setup, and consider using a virtual environment in CI to isolate dependencies.", difficulty: "junior" as const },
        { question: "Explain the difference between 'python3 -m pip install' and just 'pip3 install'. When does it matter?", answer: "'python3 -m pip install' ensures pip installs into the exact Python interpreter you're running, avoiding ambiguity when multiple Python versions exist. 'pip3 install' uses whatever pip3 is first in PATH, which may differ. Always use 'python3 -m pip' in scripts and CI to be explicit.", difficulty: "mid" as const },
        { question: "You run a Python script and get 'SyntaxError: f-string: invalid syntax' on Python 3.4. What is the issue and what are your options?", answer: "f-strings were introduced in Python 3.6. Options: upgrade to Python 3.6+ (recommended), or rewrite using .format() or % formatting for compatibility. In DevOps, always check the minimum Python version on your target servers before using newer language features.", difficulty: "junior" as const },
        { question: "Your automation script needs to run on air-gapped servers with no internet access. How do you handle pip dependencies?", answer: "Pre-download packages with 'pip download -r requirements.txt -d ./packages/', transfer the packages directory to the server, then install with 'pip install --no-index --find-links ./packages/ -r requirements.txt'. Alternatively, build a private PyPI mirror with devpi or pip2pi.", difficulty: "senior" as const },
        { question: "What is a virtual environment and why should every Python project have one, especially in a DevOps context?", answer: "A virtual environment is an isolated Python environment with its own interpreter and packages, preventing conflicts between projects. In DevOps, it's critical because: different projects need different package versions, system Python packages can be overwritten causing OS tools to break, and reproducibility requires knowing exactly which packages are installed.", difficulty: "junior" as const },
      ],
    },
    {
      id: "control-flow",
      title: "Control Flow",
      level: "beginner",
      description: "Write programs that make decisions and repeat operations.",
      lessons: [
        {
          id: "if-statements",
          title: "if / elif / else",
          duration: 10,
          type: "lesson",
          description: "Write conditional logic in Python.",
          content: `# if / elif / else

## Basic Conditionals

\`\`\`python
exit_code = 1

if exit_code == 0:
    print("Success")
elif exit_code == 1:
    print("General error")
elif exit_code == 127:
    print("Command not found")
else:
    print(f"Unknown exit code: {exit_code}")
\`\`\`

## Comparison Operators

\`\`\`python
x = 5
x == 5      # Equal to
x != 5      # Not equal to
x > 3       # Greater than
x >= 5      # Greater than or equal
x < 10      # Less than
x <= 10     # Less than or equal
x is None   # Identity check (use for None)
x in [1, 2, 5]  # Membership test → True
\`\`\`

## Logical Operators

\`\`\`python
# and, or, not (not &&, ||, !)
is_running = True
has_error = False

if is_running and not has_error:
    print("All good")

if is_running or has_error:
    print("Something is happening")
\`\`\`

## Ternary (Conditional Expression)

\`\`\`python
status = "success" if exit_code == 0 else "failure"

# Equivalent to:
if exit_code == 0:
    status = "success"
else:
    status = "failure"
\`\`\`

## Loops

### for loops

\`\`\`python
# Iterate over a list
services = ["nginx", "postgres", "redis"]
for service in services:
    print(f"Checking {service}...")

# Range
for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 11):    # 1 to 10
    print(i)

for i in range(0, 20, 5): # 0, 5, 10, 15
    print(i)

# With index (enumerate)
for i, service in enumerate(services):
    print(f"{i}: {service}")
# 0: nginx
# 1: postgres
# 2: redis

# Iterate over dict
config = {"host": "localhost", "port": 5432}
for key, value in config.items():
    print(f"{key} = {value}")
\`\`\`

### while loops

\`\`\`python
import time

retries = 0
max_retries = 3

while retries < max_retries:
    try:
        connect()
        break
    except ConnectionError:
        retries += 1
        time.sleep(2 ** retries)  # Exponential backoff

if retries == max_retries:
    print("Failed to connect after 3 attempts")
\`\`\`

### Loop Control

\`\`\`python
# break — exit loop immediately
for port in [80, 443, 8080, 8443]:
    if is_available(port):
        print(f"Using port {port}")
        break

# continue — skip to next iteration
for line in log_lines:
    if line.startswith("#"):
        continue  # Skip comments
    process(line)

# else clause (runs if loop completed without break)
for server in servers:
    if server.is_healthy():
        break
else:
    print("No healthy servers found!")  # Runs if no break
\`\`\`

## List Comprehensions

\`\`\`python
# Traditional loop
squares = []
for x in range(10):
    squares.append(x ** 2)

# List comprehension (preferred for simple cases)
squares = [x ** 2 for x in range(10)]

# With filter
even_squares = [x ** 2 for x in range(10) if x % 2 == 0]

# From DevOps context
failed_jobs = [job for job in jobs if job.status == "failed"]
service_names = [s.name for s in services]
\`\`\`
`,
        },
      ],
      exam: [
        { question: "You're iterating over a list of server health check results and want to stop as soon as you find one unhealthy server and print an alert. Which loop control statement do you use?", answer: "Use 'break' to exit the loop immediately when the unhealthy server is found. Pair it with a for/else clause: the else block runs only if no break occurred, letting you print 'all healthy' cleanly without a flag variable.", difficulty: "junior" as const },
        { question: "A deployment script checks 10 environment variables and must fail fast if any are missing. Write the Python logic for this check.", answer: "Use a for loop over the required variable names, check os.environ.get(var) for each, collect missing ones in a list. After the loop, if the list is non-empty raise a ValueError listing all missing variables at once rather than failing on the first one — better UX.", difficulty: "junior" as const },
        { question: "You need to retry an API call up to 5 times with exponential backoff. Write the while loop logic.", answer: "Use a while loop with a counter: attempt = 0, while attempt < 5: try the call, on success break, on failure increment attempt and sleep(2 ** attempt). After the loop, check if attempt == 5 and raise the last exception. Use time.sleep for backoff.", difficulty: "mid" as const },
        { question: "Your script processes 1000 log files. A list comprehension vs a generator expression — which do you use and why?", answer: "Use a generator expression (parentheses instead of brackets) when processing one file at a time to avoid loading all 1000 results into memory at once. Only use a list comprehension if you need random access or to reuse the results multiple times.", difficulty: "mid" as const },
        { question: "What is the difference between 'is' and '==' in Python? Give a DevOps example where using the wrong one causes a bug.", answer: "'==' checks value equality; 'is' checks identity (same object in memory). Bug example: checking 'if result is True' instead of 'if result == True' — a function returning the integer 1 passes '== True' but fails 'is True' since they're different objects.", difficulty: "junior" as const },
        { question: "You have a list of 10,000 IP addresses and need to check if a given IP is in the list. Should you use a list or a set? Why?", answer: "Use a set. List membership ('in') is O(n) — it checks every element. Set membership is O(1) average because sets use hash tables. Converting: ip_set = set(ip_list), then 'if ip in ip_set' is dramatically faster for large collections.", difficulty: "junior" as const },
        { question: "Explain the for/else pattern in Python. Give a real DevOps scenario where it's useful.", answer: "The else clause of a for loop runs only if the loop completed without hitting a 'break'. Scenario: searching a list of servers for an available one — if no server was found (no break), the else block runs 'raise RuntimeError(\"No healthy servers available\")' cleanly without a boolean flag.", difficulty: "mid" as const },
        { question: "You're writing a script that categorizes HTTP status codes (2xx success, 4xx client error, 5xx server error). How do you structure the if/elif logic efficiently?", answer: "Use integer division for range checks: if 200 <= code < 300: 'success' elif 400 <= code < 500: 'client error' elif 500 <= code < 600: 'server error'. Alternatively, use a dict mapping ranges or a match statement (Python 3.10+) for cleaner dispatch.", difficulty: "junior" as const },
        { question: "A coworker's script uses a nested list comprehension to flatten a list of lists. It works but nobody can read it. How do you make it maintainable?", answer: "Either add a comment explaining the structure, or refactor to a regular for loop for clarity. '[item for sublist in matrix for item in sublist]' can be written as an explicit nested loop. For deep nesting, itertools.chain.from_iterable(matrix) is more readable.", difficulty: "mid" as const },
        { question: "You're writing a CI script that validates multiple conditions before deployment (tests pass, coverage above 80%, no linting errors). How do you structure the conditional logic to give the clearest failure messages?", answer: "Check each condition independently and collect all failures, then report them all at once rather than stopping at the first failure. Use a list to accumulate failure messages, check each condition with if/elif, and at the end if the list is non-empty, raise an error with all failures listed.", difficulty: "mid" as const },
      ],
    },
    {
      id: "data-structures",
      title: "Data Structures",
      level: "beginner",
      description: "Work with Python's powerful built-in data structures.",
      lessons: [
        {
          id: "lists-dicts",
          title: "Lists & Dictionaries",
          duration: 18,
          type: "lesson",
          description: "Master the most commonly used Python data structures.",
          content: `# Lists & Dictionaries

## Why These Two Data Structures Dominate Python

In any Python DevOps script, you'll spend 80% of your time working with lists and dictionaries. Here's why:

- **Lists** model sequences: log lines from a file, server names from an API response, IP addresses in a CIDR block, results from a database query.
- **Dictionaries** model structured data: a JSON response from AWS, a parsed YAML config file, an environment's configuration, a service's health status.

Understanding how they work internally helps you write faster, more correct code.

---

## Lists — Ordered, Mutable Sequences

**Internal structure**: A Python list is a dynamic array. It allocates more capacity than needed (over-allocates) to make \`append()\` O(1) amortized. Accessing by index is O(1). Inserting or removing at the beginning is O(n) because all elements shift.

\`\`\`python
# Creating lists
servers = ["web-01", "web-02", "db-01"]
ports = [80, 443, 8080]
mixed = [1, "hello", True, None, [1, 2]]  # Any types — even nested lists

# Accessing elements (0-indexed)
servers[0]      # "web-01"  (first element)
servers[-1]     # "db-01"   (last element — -1 counts from end)
servers[-2]     # "web-02"  (second to last)

# Slicing — returns a new list [start:stop:step] (stop is exclusive)
servers[1:3]    # ["web-02", "db-01"]  (index 1 and 2, not 3)
servers[:2]     # ["web-01", "web-02"] (from start to index 2)
servers[1:]     # ["web-02", "db-01"]  (from index 1 to end)
servers[::2]    # ["web-01", "db-01"]  (every 2nd element)
servers[::-1]   # ["db-01", "web-02", "web-01"]  (reverse a list)
\`\`\`

### Modifying Lists

\`\`\`python
servers = ["web-01", "web-02"]

# Adding elements
servers.append("web-03")            # Add to end — O(1) amortized
servers.insert(0, "lb-01")         # Insert at index 0 — O(n), shifts everything
servers.extend(["db-01", "db-02"]) # Add all elements from another iterable

# Removing elements
servers.remove("web-02")            # Remove first occurrence by VALUE — O(n) scan
popped = servers.pop()              # Remove and RETURN last element — O(1)
popped = servers.pop(0)             # Remove and return at index — O(n)
servers.clear()                     # Remove all elements

# Sorting
servers.sort()                      # Sort IN PLACE (modifies list, returns None)
servers.sort(reverse=True)          # Descending
sorted_copy = sorted(servers)       # Returns NEW sorted list, original unchanged
servers.sort(key=lambda s: s.split("-")[1])  # Sort by custom key

# Reversing
servers.reverse()                   # Reverse in place
reversed_copy = list(reversed(servers))  # New reversed list

# Querying
len(servers)                # Number of elements
"web-01" in servers         # True/False — O(n) linear scan
servers.index("web-01")     # Index of first occurrence (raises ValueError if missing)
servers.count("web-01")     # Count occurrences
\`\`\`

### List Comprehensions — The Pythonic Way

List comprehensions are more readable AND faster than equivalent for-loops because they're optimized in CPython:

\`\`\`python
# Traditional for-loop approach
failed = []
for j in jobs:
    if j["status"] == "failed":
        failed.append(j)

# List comprehension — same result, more readable, faster
failed = [j for j in jobs if j["status"] == "failed"]

# Structure: [expression for item in iterable if condition]

# Extract a field from a list of dicts (very common with API responses)
names = [s["name"] for s in services]
urls = [f"http://{s['host']}:{s['port']}/health" for s in services]

# Flatten a nested list
all_ports = [port for server in servers for port in server["ports"]]

# Sort by field
services.sort(key=lambda s: s["cpu_usage"], reverse=True)
top_3_cpu = services[:3]

# Remove duplicates — preserving order (sets don't preserve order)
seen = set()
unique = [x for x in items if not (x in seen or seen.add(x))]

# Or use dict.fromkeys() which preserves order in Python 3.7+
unique = list(dict.fromkeys(items))
\`\`\`

### Sets — Unordered, No Duplicates

Sets are like lists but unordered and with no duplicates. Membership testing is O(1) (hash table):

\`\`\`python
running = {"web-01", "web-02", "db-01"}
healthy = {"web-01", "db-01", "db-02"}

# Set operations (very useful for comparing infrastructure state)
running & healthy   # Intersection: {"web-01", "db-01"}  (in both)
running | healthy   # Union: {"web-01", "web-02", "db-01", "db-02"}  (in either)
running - healthy   # Difference: {"web-02"}  (in running but not healthy)
running ^ healthy   # Symmetric difference: {"web-02", "db-02"}  (in one but not both)

# Practical: find services that are running but not healthy
unhealthy_running = running - healthy   # {"web-02"}

# Check membership — O(1) vs O(n) for list
"web-01" in running   # True — hash lookup, instant even for 1M items
\`\`\`

---

## Dictionaries — Key-Value Mappings

**Internal structure**: Python dicts are hash tables. Keys are hashed, and the hash determines the bucket where the value is stored. Lookup, insert, and delete are all O(1) average case. As of Python 3.7, dicts preserve **insertion order** (this is now guaranteed by the language spec).

**Only hashable (immutable) types can be keys**: strings, numbers, tuples. Lists cannot be dict keys because they're mutable (their hash would change if you modified them).

\`\`\`python
# Creating dicts
config = {
    "host": "localhost",
    "port": 5432,
    "database": "myapp",
    "ssl": True
}

# From pairs (useful when building from two lists)
keys = ["host", "port", "db"]
values = ["localhost", 5432, "myapp"]
config = dict(zip(keys, values))

# Dict comprehension — like list comprehension but for dicts
env_vars = {k: v for k, v in os.environ.items() if k.startswith("APP_")}
port_map = {service: 8000 + i for i, service in enumerate(["web", "api", "auth"])}

# Accessing
config["host"]              # "localhost" — raises KeyError if missing
config.get("host")          # "localhost" — returns None if missing (safe)
config.get("timeout", 30)   # Returns 30 if "timeout" key doesn't exist

# Checking
"host" in config            # True — O(1) hash lookup
"password" not in config    # True

# Modifying
config["port"] = 5433       # Update existing key
config["timeout"] = 30      # Add new key
del config["ssl"]           # Delete key — raises KeyError if missing
config.pop("ssl", None)     # Delete and return value, None if missing (safe)
\`\`\`

### Dictionary Methods

\`\`\`python
# Iterate over keys, values, or both
for key in config:                    # iterates over keys
    print(key)
for key in config.keys():            # explicit keys iteration
    print(key)
for value in config.values():        # values only
    print(value)
for key, value in config.items():    # key-value pairs (most common)
    print(f"{key}: {value}")

# Merge dicts
defaults = {"timeout": 30, "retry": 3, "ssl": False}
custom = {"timeout": 60, "host": "prod-db"}

# Python 3.9+: | operator (non-destructive merge)
merged = defaults | custom    # custom values override defaults
# {"timeout": 60, "retry": 3, "ssl": False, "host": "prod-db"}

# Python 3.5+: **unpacking (also non-destructive)
merged = {**defaults, **custom}  # same result

# In-place update
defaults.update(custom)    # modifies defaults in place

# setdefault — get value or set a default if key doesn't exist
config.setdefault("timeout", 30)    # sets "timeout"=30 only if not already set

# defaultdict — automatically creates default values for missing keys
from collections import defaultdict
counts = defaultdict(int)   # default value is int() = 0
for item in items:
    counts[item] += 1   # no KeyError on first access

# Counter — specialized dict for counting
from collections import Counter
word_count = Counter(["aws", "gcp", "aws", "azure", "aws"])
# Counter({"aws": 3, "gcp": 1, "azure": 1})
word_count.most_common(2)   # [("aws", 3), ("gcp", 1)]
\`\`\`

### Nested Structures

\`\`\`python
# Typical DevOps config structure
infrastructure = {
    "production": {
        "web": {
            "instances": ["web-01", "web-02"],
            "load_balancer": "lb-prod",
            "port": 443
        },
        "database": {
            "primary": "db-01",
            "replicas": ["db-02", "db-03"],
            "port": 5432
        }
    }
}

# Access nested values
web_instances = infrastructure["production"]["web"]["instances"]

# Safe deep access (dict.get for each level)
db_port = (infrastructure
    .get("production", {})
    .get("database", {})
    .get("port", 5432))
\`\`\`

### Dict Comprehensions

\`\`\`python
# Service name → status mapping
statuses = {
    service: check_health(service)
    for service in ["nginx", "postgres", "redis"]
}

# Filter dict
active = {k: v for k, v in services.items() if v["status"] == "running"}
\`\`\`
`,
        },
      ],
      exam: [
        { question: "You receive a JSON API response with a list of 500 servers. You need the names of all servers where status is 'degraded' and CPU is above 80%. Write the Python expression.", answer: "Use a list comprehension: [s['name'] for s in servers if s['status'] == 'degraded' and s['cpu'] > 80]. This is readable and efficient for filtering dicts from API responses.", difficulty: "junior" as const },
        { question: "A dictionary merge is needed: default config should apply unless a key exists in the override config. How do you do this in Python 3.9+?", answer: "Use the merge operator: merged = defaults | overrides. Keys in overrides take precedence. For older Python: merged = {**defaults, **overrides}. The right-hand dict wins for duplicate keys.", difficulty: "junior" as const },
        { question: "You have a list of deployment events and need to group them by service name. What data structure and approach do you use?", answer: "Use a dict of lists, building it with dict.setdefault() or collections.defaultdict(list). Iterate events: grouped[event['service']].append(event). defaultdict(list) is cleaner as it auto-creates the list on first access.", difficulty: "mid" as const },
        { question: "Your script reads a config file into a nested dict. How do you safely access a deeply nested key without getting a KeyError?", answer: "Chain .get() calls with empty dict defaults: value = config.get('database', {}).get('primary', {}).get('host', 'localhost'). Alternatively, use the 'glom' library for complex nested access with a path syntax, or write a utility function that walks the path safely.", difficulty: "mid" as const },
        { question: "What is the difference between a list and a tuple in Python? When would you use a tuple for DevOps config data?", answer: "Lists are mutable (can be changed); tuples are immutable (cannot be changed after creation). Use tuples for fixed data that should not be accidentally modified: valid_environments = ('dev', 'staging', 'prod'). Tuples are also hashable and can be dict keys.", difficulty: "junior" as const },
        { question: "You need to remove duplicate server entries from a list while preserving the original order. How do you do this?", answer: "Use a dict (Python 3.7+ preserves insertion order): unique = list(dict.fromkeys(servers)). This is more readable than the seen-set comprehension pattern and leverages the guaranteed dict ordering in modern Python.", difficulty: "mid" as const },
        { question: "You have 1 million log entries in a list. You need to find all unique error codes. Which Python data structure gives you the best performance?", answer: "Use a set. Adding to a set and checking membership are both O(1) average. Set operations (union, intersection) are also highly optimized. error_codes = {entry['code'] for entry in logs if entry['level'] == 'ERROR'} — a set comprehension.", difficulty: "junior" as const },
        { question: "A monitoring script builds a report dict on every run. After 1000 runs the process is using 4GB of RAM. What data structure change could help?", answer: "Switch from storing all report dicts in a list to using a generator or processing each report as it's produced and discarding it. If historical data is needed, store only summary statistics in the dict rather than raw data. Consider using collections.deque with maxlen for a rolling window.", difficulty: "senior" as const },
        { question: "You need to sort a list of server dicts by memory usage (descending), then by name (ascending) as a tiebreaker. How do you do this?", answer: "Use sorted() with a tuple key: sorted(servers, key=lambda s: (-s['memory_mb'], s['name'])). Negating memory gives descending order; name is ascending. The tuple comparison handles the tiebreaker automatically.", difficulty: "mid" as const },
        { question: "Your team stores infrastructure config in nested dicts. A new engineer keeps accidentally mutating the shared config dict. How do you prevent this?", answer: "Use types.MappingProxyType to create an immutable view of the dict: config = MappingProxyType(raw_config). Any attempt to modify it raises TypeError. For deeply nested dicts, use a recursive proxy or frozen dataclass. Also consider using dataclasses with frozen=True.", difficulty: "senior" as const },
      ],
    },
    {
      id: "automation-scripts",
      title: "Automation Scripts",
      level: "advanced",
      description: "Write professional automation scripts for DevOps tasks.",
      lessons: [
        {
          id: "system-automation",
          title: "System Automation",
          duration: 25,
          type: "lesson",
          description: "Automate system tasks using Python's standard library.",
          content: `# System Automation

Python's standard library includes everything you need to automate common DevOps tasks.

## os and pathlib — File System Operations

\`\`\`python
import os
from pathlib import Path

# Current directory
cwd = Path.cwd()
home = Path.home()

# Path construction (works on all OS)
config_file = home / ".config" / "myapp" / "config.json"

# Check existence
config_file.exists()
config_file.is_file()
config_file.is_dir()

# Create directories
(home / ".config" / "myapp").mkdir(parents=True, exist_ok=True)

# List directory contents
for item in Path("/var/log").iterdir():
    print(item.name, item.stat().st_size)

# Find files recursively
log_files = list(Path("/var/log").glob("**/*.log"))

# Read and write
config_file.write_text("key=value\n")
content = config_file.read_text()

# File info
stat = config_file.stat()
print(f"Size: {stat.st_size} bytes")
print(f"Modified: {stat.st_mtime}")
\`\`\`

## subprocess — Run Shell Commands

\`\`\`python
import subprocess

# Simple run (captures output)
result = subprocess.run(
    ["git", "log", "--oneline", "-5"],
    capture_output=True,
    text=True,        # Decode output as text
    check=True        # Raise exception if command fails
)
print(result.stdout)

# Handling errors
try:
    result = subprocess.run(
        ["docker", "pull", "myimage:latest"],
        capture_output=True,
        text=True,
        check=True
    )
    print("Pulled successfully")
except subprocess.CalledProcessError as e:
    print(f"Failed: {e.stderr}")

# Stream output in real-time
import sys
process = subprocess.Popen(
    ["docker", "build", "-t", "myapp", "."],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)
for line in process.stdout:
    sys.stdout.write(line)
process.wait()
if process.returncode != 0:
    raise RuntimeError("Build failed")

# Pass environment variables
env = os.environ.copy()
env["DOCKER_BUILDKIT"] = "1"
subprocess.run(["docker", "build", "."], env=env, check=True)
\`\`\`

## json and yaml — Config Files

\`\`\`python
import json

# Parse JSON
with open("config.json") as f:
    config = json.load(f)

# From string
data = json.loads('{"port": 3000, "debug": true}')

# Write JSON
with open("output.json", "w") as f:
    json.dump(config, f, indent=2)

# YAML (pip install pyyaml)
import yaml

with open("config.yaml") as f:
    config = yaml.safe_load(f)  # safe_load prevents code execution

# Write YAML
with open("output.yaml", "w") as f:
    yaml.dump(config, f, default_flow_style=False)
\`\`\`

## Complete Automation Script Example

\`\`\`python
#!/usr/bin/env python3
"""
Deploy checker — validates services are healthy before deployment.
"""
import json
import subprocess
import sys
import time
from pathlib import Path
from typing import NamedTuple

class ServiceStatus(NamedTuple):
    name: str
    healthy: bool
    message: str


def check_docker_service(name: str) -> ServiceStatus:
    """Check if a Docker container is healthy."""
    try:
        result = subprocess.run(
            ["docker", "inspect", "--format", "{{.State.Health.Status}}", name],
            capture_output=True, text=True, check=True
        )
        status = result.stdout.strip()
        return ServiceStatus(name, status == "healthy", f"Status: {status}")
    except subprocess.CalledProcessError:
        return ServiceStatus(name, False, "Container not found")


def wait_for_healthy(services: list[str], timeout: int = 120) -> bool:
    """Wait for all services to be healthy."""
    deadline = time.time() + timeout

    while time.time() < deadline:
        statuses = [check_docker_service(s) for s in services]
        all_healthy = all(s.healthy for s in statuses)

        for s in statuses:
            emoji = "✅" if s.healthy else "❌"
            print(f"  {emoji} {s.name}: {s.message}")

        if all_healthy:
            return True

        remaining = int(deadline - time.time())
        print(f"\nWaiting... ({remaining}s remaining)")
        time.sleep(10)

    return False


def main():
    services = ["web", "postgres", "redis"]

    print(f"Checking health of: {', '.join(services)}")

    if wait_for_healthy(services):
        print("\n✅ All services healthy — safe to deploy!")
        sys.exit(0)
    else:
        print("\n❌ Services not healthy after timeout — aborting!")
        sys.exit(1)


if __name__ == "__main__":
    main()
\`\`\`
`,
        },
      ],
      exam: [
        { question: "You need to run 'kubectl apply -f deployment.yaml' from Python and fail the script if kubectl returns a non-zero exit code. What is the simplest correct way?", answer: "Use subprocess.run(['kubectl', 'apply', '-f', 'deployment.yaml'], check=True). The check=True argument raises subprocess.CalledProcessError automatically if the exit code is non-zero, avoiding manual exit code checks.", difficulty: "junior" as const },
        { question: "Your automation script calls 'docker build' and you want to stream the build output to the terminal in real time, not after it finishes. How do you implement this?", answer: "Use subprocess.Popen with stdout=subprocess.PIPE and iterate over process.stdout line by line, writing each line to sys.stdout immediately. Call process.wait() after the loop and check process.returncode for the exit status.", difficulty: "mid" as const },
        { question: "A script needs to read AWS credentials from environment variables at runtime. What is the correct way to access them and what should you do if they are missing?", answer: "Use os.environ.get('AWS_ACCESS_KEY_ID') and check for None, or os.environ['AWS_ACCESS_KEY_ID'] which raises KeyError if missing. Prefer getting all required vars at startup and raising a clear error listing all missing variables before any work begins.", difficulty: "junior" as const },
        { question: "You're writing a script to parse a 2GB JSON Lines log file. Loading it all with json.load() causes an OOM error. How do you fix this?", answer: "Read the file line by line: open the file, iterate with 'for line in f:', and call json.loads(line) on each line individually. This processes one JSON object at a time with O(1) memory relative to file size. Never use json.load() for large files.", difficulty: "mid" as const },
        { question: "Your script runs 'apt-get install' inside a subprocess but the install is interactive and hangs waiting for user input. How do you fix this?", answer: "Pass '-y' to apt-get to auto-confirm: subprocess.run(['apt-get', 'install', '-y', 'curl']). Also set DEBIAN_FRONTEND=noninteractive in the environment to suppress all interactive prompts: env={**os.environ, 'DEBIAN_FRONTEND': 'noninteractive'}.", difficulty: "junior" as const },
        { question: "You need to run 10 HTTP health checks against 10 servers and finish as fast as possible. How do you parallelize this in Python?", answer: "Use concurrent.futures.ThreadPoolExecutor for I/O-bound tasks. Submit all check functions to the executor and collect results with as_completed() or map(). The GIL is released during HTTP I/O so threads genuinely run in parallel for this use case.", difficulty: "mid" as const },
        { question: "A shell command your script calls uses shell features like pipes and globs ('grep error *.log | wc -l'). How do you run this from Python subprocess?", answer: "Pass shell=True and the command as a string: subprocess.run('grep error *.log | wc -l', shell=True, capture_output=True, text=True). Note the security risk: never use shell=True with user-supplied input — use explicit pipes via Popen instead.", difficulty: "mid" as const },
        { question: "Your automation script must clean up temporary files even if it crashes mid-way. How do you ensure cleanup runs?", answer: "Use a try/finally block: put cleanup in the finally clause, which runs regardless of exceptions. Better yet, use contextlib.contextmanager or a context manager class that handles cleanup in __exit__. For temp directories, use tempfile.TemporaryDirectory() as a context manager.", difficulty: "junior" as const },
        { question: "You need to run a long-running deployment command but kill it if it takes more than 5 minutes. How do you implement a timeout?", answer: "Use subprocess.run(..., timeout=300). If it times out, subprocess.TimeoutExpired is raised and the process is killed. For streaming output with timeout, use Popen with threading.Timer to call process.kill() after the timeout.", difficulty: "mid" as const },
        { question: "A YAML config file uses anchors and aliases for DRY config. When you load it with yaml.load() you get a warning. What is wrong and how do you fix it?", answer: "yaml.load() without a Loader argument is deprecated and unsafe — it can execute arbitrary Python code. Use yaml.safe_load() which restricts parsing to safe YAML types. safe_load fully supports anchors and aliases, which are pure YAML features not a security concern.", difficulty: "junior" as const },
      ],
    },
    {
      id: "python-file-handling",
      title: "File Handling & Error Management",
      level: "intermediate",
      description: "Read, write, and process files. Handle errors gracefully with exceptions.",
      lessons: [
        {
          id: "file-io",
          title: "Reading & Writing Files",
          duration: 12,
          type: "lesson",
          description: "Work with files, directories, and file paths using Python's built-in tools.",
          objectives: [
            "Open, read, and write files with context managers",
            "Use pathlib for cross-platform file paths",
            "Read and write CSV and JSON files",
            "Walk directory trees",
          ],
          content: `# Reading & Writing Files

## The \`open()\` Function and Context Managers

Always use the \`with\` statement — it automatically closes the file even if an error occurs:

\`\`\`python
# Read entire file
with open("log.txt", "r") as f:
    content = f.read()

# Read line by line (memory-efficient for large files)
with open("log.txt", "r") as f:
    for line in f:
        print(line.strip())

# Write (overwrites existing content)
with open("output.txt", "w") as f:
    f.write("Hello, file!\n")

# Append
with open("output.txt", "a") as f:
    f.write("Another line\n")
\`\`\`

## pathlib — The Modern Way

\`pathlib.Path\` is expressive and cross-platform:

\`\`\`python
from pathlib import Path

# Create paths
home = Path.home()
project = Path("/Users/sooraj/projects/devops-lms")
config = project / "config" / "settings.json"

# Check existence
if config.exists():
    print(config.read_text())

# Create directories
(project / "logs").mkdir(parents=True, exist_ok=True)

# Iterate files
for py_file in project.glob("**/*.py"):
    print(py_file)

# File info
print(config.stat().st_size)   # size in bytes
print(config.suffix)           # .json
print(config.stem)             # settings
print(config.parent)           # /Users/sooraj/projects/devops-lms/config
\`\`\`

## CSV Files

\`\`\`python
import csv
from pathlib import Path

# Write CSV
data = [
    {"name": "Alice", "role": "Engineer", "score": 95},
    {"name": "Bob",   "role": "Designer", "score": 87},
]

with open("team.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "role", "score"])
    writer.writeheader()
    writer.writerows(data)

# Read CSV
with open("team.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"{row['name']}: {row['score']}")
\`\`\`

## JSON Files

\`\`\`python
import json

config = {
    "debug": True,
    "host": "0.0.0.0",
    "port": 8080,
    "allowed_origins": ["https://example.com"],
}

# Write JSON
with open("config.json", "w") as f:
    json.dump(config, f, indent=2)

# Read JSON
with open("config.json") as f:
    loaded = json.load(f)

print(loaded["port"])  # 8080
\`\`\`

## Walking a Directory

\`\`\`python
from pathlib import Path

def count_lines(root: str) -> dict[str, int]:
    """Count lines in all .py files under root."""
    counts = {}
    for path in Path(root).rglob("*.py"):
        lines = path.read_text().count("\n")
        counts[str(path)] = lines
    return counts

totals = count_lines(".")
for path, lines in sorted(totals.items()):
    print(f"{lines:>6} {path}")
\`\`\`
`,
        },
        {
          id: "exceptions",
          title: "Exceptions & Error Handling",
          duration: 10,
          type: "lesson",
          description: "Write robust code that handles failures gracefully.",
          objectives: [
            "Catch and handle exceptions with try/except/finally",
            "Raise exceptions with helpful messages",
            "Create custom exception classes",
            "Distinguish LBYL vs EAFP patterns",
          ],
          content: `# Exceptions & Error Handling

## The try/except Block

\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
except (TypeError, ValueError) as e:
    print(f"Type or value error: {e}")
except Exception as e:
    # Catches any other exception — use as a last resort
    print(f"Unexpected error: {e}")
    raise  # re-raise after logging
else:
    # Runs only if no exception was raised
    print(f"Result: {result}")
finally:
    # Always runs — use for cleanup
    print("Done")
\`\`\`

## Common Built-in Exceptions

| Exception | When |
|-----------|------|
| \`ValueError\` | Wrong value for the type (e.g., \`int("abc")\`) |
| \`TypeError\` | Wrong type (e.g., \`1 + "a"\`) |
| \`KeyError\` | Missing dictionary key |
| \`IndexError\` | List index out of range |
| \`FileNotFoundError\` | File doesn't exist |
| \`PermissionError\` | No access to file |
| \`AttributeError\` | Object has no such attribute |
| \`ImportError\` | Module not found |

## Raising Exceptions

\`\`\`python
def parse_port(value: str) -> int:
    try:
        port = int(value)
    except ValueError:
        raise ValueError(f"Port must be an integer, got {value!r}")
    if not 1 <= port <= 65535:
        raise ValueError(f"Port must be 1–65535, got {port}")
    return port
\`\`\`

## Custom Exceptions

Create a hierarchy of app-specific exceptions:

\`\`\`python
class AppError(Exception):
    """Base class for all application errors."""

class ConfigError(AppError):
    """Raised when configuration is invalid."""

class NetworkError(AppError):
    """Raised when a network operation fails."""
    def __init__(self, message: str, status_code: int | None = None):
        super().__init__(message)
        self.status_code = status_code

# Usage
try:
    raise NetworkError("Connection refused", status_code=503)
except NetworkError as e:
    print(f"Network problem ({e.status_code}): {e}")
except AppError as e:
    print(f"App error: {e}")
\`\`\`

## EAFP vs LBYL

Python favors **EAFP** (Easier to Ask Forgiveness than Permission):

\`\`\`python
# LBYL — "Look Before You Leap" (common in C/Java)
if "key" in data:
    value = data["key"]

# EAFP — Pythonic
try:
    value = data["key"]
except KeyError:
    value = default_value

# Even better for dicts:
value = data.get("key", default_value)
\`\`\`

## Context Managers for Cleanup

\`\`\`python
from contextlib import contextmanager, suppress

# Suppress specific errors
with suppress(FileNotFoundError):
    Path("missing.txt").unlink()  # No error if file doesn't exist

# Create your own context manager
@contextmanager
def temporary_file(suffix=".tmp"):
    path = Path(f"/tmp/work{suffix}")
    try:
        yield path
    finally:
        path.unlink(missing_ok=True)

with temporary_file(".json") as tmp:
    tmp.write_text('{"ok": true}')
    process(tmp)
# File is deleted automatically
\`\`\`
`,
        },
      ],
      exam: [
        { question: "Your script writes to a log file without a context manager: f = open('log.txt', 'a') then f.write(...). What is the risk and how do you fix it?", answer: "If an exception occurs between open() and a manual f.close(), the file handle leaks. The OS eventually closes it but data may not be flushed to disk. Fix: always use 'with open(\"log.txt\", \"a\") as f:' — the context manager guarantees close() and flush() on exit.", difficulty: "junior" as const },
        { question: "You need to read a 10GB log file and count lines containing 'ERROR'. What is the memory-efficient way?", answer: "Iterate the file object directly: 'count = sum(1 for line in open(\"app.log\") if \"ERROR\" in line)'. Python reads one line at a time, never loading the whole file. Do NOT use f.read() or f.readlines() which load everything into memory.", difficulty: "junior" as const },
        { question: "A script writes a CSV report but on Windows the file has blank lines between every row. What is the cause and fix?", answer: "On Windows, opening a file in text mode with csv.writer adds \\r\\n, and Python's text mode adds another \\r, resulting in \\r\\r\\n. Fix: open the file with newline='' parameter: open('report.csv', 'w', newline='') as the csv module docs specify.", difficulty: "mid" as const },
        { question: "You need to atomically write a config file — if the script crashes mid-write, the old file should remain intact. How do you implement this?", answer: "Write to a temp file in the same directory, then use os.replace() (or Path.replace()) to atomically rename it over the target. os.replace is atomic on POSIX systems. This ensures readers never see a partial write.", difficulty: "mid" as const },
        { question: "A try/except/finally block: the try block opens a DB connection, the except block logs the error, and the finally block closes the connection. The except block raises a new exception. Does finally still run?", answer: "Yes. The finally block always runs, even when an exception is raised in the except block. After finally completes, the exception from except propagates. This guarantees resource cleanup regardless of how the exception handling goes.", difficulty: "junior" as const },
        { question: "Your script uses bare 'except:' to catch all errors. A senior engineer says this is dangerous. Why?", answer: "Bare 'except:' catches EVERYTHING including SystemExit, KeyboardInterrupt, and GeneratorExit — built-in signals for stopping programs. This means Ctrl+C won't work and the process can't be cleanly terminated. Use 'except Exception:' at minimum, or ideally catch specific exception types.", difficulty: "junior" as const },
        { question: "You need to process files in a directory, skip any that fail to parse, and report all failures at the end. How do you structure the error handling?", answer: "Use a try/except inside the loop, appending failures to a list: failures = []. For each file, try to parse it, except (ValueError, json.JSONDecodeError) as e: failures.append((file, str(e))). After the loop, if failures: report them all. This processes all files rather than stopping at the first error.", difficulty: "mid" as const },
        { question: "What is the difference between FileNotFoundError and PermissionError? Give a scenario where you'd handle them differently.", answer: "FileNotFoundError means the path doesn't exist; PermissionError means it exists but the process lacks access rights. For a config file: FileNotFoundError → create a default config. PermissionError → fail with a clear message asking the user to check file ownership/permissions, as auto-creating won't help.", difficulty: "junior" as const },
        { question: "You write a pathlib glob to find all .log files recursively: Path('/var/log').glob('*.log'). It only finds top-level files. What is wrong?", answer: "glob('*.log') only matches in the immediate directory. Use rglob('*.log') or glob('**/*.log') for recursive search. rglob is equivalent to glob('**/' + pattern) and is the more readable choice.", difficulty: "junior" as const },
        { question: "A script creates a custom exception class DeploymentError. A colleague says 'just raise RuntimeError instead, it's simpler'. What's the argument for custom exceptions?", answer: "Custom exceptions allow callers to catch specific error types with except DeploymentError: without catching unrelated RuntimeErrors from other libraries. They also carry domain-specific attributes (e.g., service name, exit code) and make error handling self-documenting. In shared libraries, custom exceptions are essential for API clarity.", difficulty: "mid" as const },
      ],
    },
    {
      id: "python-oop",
      title: "Object-Oriented Python",
      level: "intermediate",
      description: "Model real-world concepts with classes, inheritance, and protocols.",
      lessons: [
        {
          id: "classes-basics",
          title: "Classes & Objects",
          duration: 14,
          type: "lesson",
          description: "Build classes, use dataclasses, and understand Python's object model.",
          objectives: [
            "Define classes with __init__, properties, and methods",
            "Use @dataclass to eliminate boilerplate",
            "Implement __repr__, __str__, and comparison methods",
            "Understand class vs instance attributes",
          ],
          content: `# Classes & Objects

## Defining a Class

\`\`\`python
class Server:
    # Class attribute — shared by all instances
    default_port = 8080

    def __init__(self, host: str, port: int | None = None):
        # Instance attributes
        self.host = host
        self.port = port or Server.default_port
        self._healthy = False       # convention: "private" with _

    # Properties — computed attributes with validation
    @property
    def healthy(self) -> bool:
        return self._healthy

    @healthy.setter
    def healthy(self, value: bool):
        self._healthy = value

    def url(self) -> str:
        return f"http://{self.host}:{self.port}"

    # __repr__ is for developers (used in debug/REPL)
    def __repr__(self) -> str:
        return f"Server(host={self.host!r}, port={self.port})"

    # __str__ is for end users
    def __str__(self) -> str:
        status = "healthy" if self._healthy else "unhealthy"
        return f"{self.url()} [{status}]"


s = Server("localhost")
print(repr(s))        # Server(host='localhost', port=8080)
print(str(s))         # http://localhost:8080 [unhealthy]
s.healthy = True
print(s)              # http://localhost:8080 [healthy]
\`\`\`

## dataclasses — Zero Boilerplate

\`\`\`python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class DeployEvent:
    service: str
    version: str
    deployed_by: str
    timestamp: datetime = field(default_factory=datetime.now)
    success: bool = True
    tags: list[str] = field(default_factory=list)

    def summary(self) -> str:
        status = "✅" if self.success else "❌"
        return f"{status} {self.service}@{self.version} by {self.deployed_by}"


event = DeployEvent("api", "v2.3.1", "alice")
print(event.summary())
print(event)  # DeployEvent(service='api', version='v2.3.1', ...)
\`\`\`

## Inheritance

\`\`\`python
class Notifier:
    def send(self, message: str) -> bool:
        raise NotImplementedError

class SlackNotifier(Notifier):
    def __init__(self, webhook_url: str):
        self.webhook_url = webhook_url

    def send(self, message: str) -> bool:
        print(f"[Slack] POST {self.webhook_url}: {message}")
        return True

class EmailNotifier(Notifier):
    def __init__(self, recipients: list[str]):
        self.recipients = recipients

    def send(self, message: str) -> bool:
        print(f"[Email] Sending to {', '.join(self.recipients)}: {message}")
        return True

def notify_all(notifiers: list[Notifier], msg: str) -> None:
    for n in notifiers:
        n.send(msg)

notify_all([SlackNotifier("https://..."), EmailNotifier(["ops@company.com"])],
           "Deploy complete")
\`\`\`

## Protocols (Structural Subtyping)

Prefer \`Protocol\` over inheritance for flexibility:

\`\`\`python
from typing import Protocol

class Sendable(Protocol):
    def send(self, message: str) -> bool: ...

def alert(notifier: Sendable, msg: str) -> bool:
    return notifier.send(msg)

# Any object with a send() method works — no inheritance needed
class PagerDuty:
    def send(self, message: str) -> bool:
        print(f"[PagerDuty] {message}")
        return True

alert(PagerDuty(), "Disk at 95%")  # Works!
\`\`\`
`,
          interviewQuestions: [
            {
              question: "Write a Python script that checks disk usage on multiple servers via SSH and sends an alert if any disk is over 85%.",
              difficulty: "mid" as const,
              answer: `\`\`\`python
#!/usr/bin/env python3
"""Disk usage monitoring script using paramiko for SSH."""
import paramiko
import json
from dataclasses import dataclass
from typing import Optional

SERVERS = [
    {"host": "web-01.prod", "user": "deploy"},
    {"host": "web-02.prod", "user": "deploy"},
    {"host": "db-01.prod", "user": "deploy"},
]
THRESHOLD = 85
KEY_PATH = "/home/deploy/.ssh/id_rsa"

@dataclass
class DiskCheck:
    host: str
    mount: str
    usage_pct: int
    available_gb: float

def check_disk_usage(host: str, user: str) -> list[DiskCheck]:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    results = []
    try:
        client.connect(host, username=user, key_filename=KEY_PATH, timeout=10)
        _, stdout, _ = client.exec_command(
            "df -h --output=target,pcent,avail | tail -n +2"
        )
        for line in stdout.read().decode().splitlines():
            mount, pct, avail = line.split()
            pct_int = int(pct.rstrip("%"))
            avail_gb = float(avail.rstrip("G") if "G" in avail else "0")
            results.append(DiskCheck(host, mount, pct_int, avail_gb))
    except Exception as e:
        print(f"ERROR connecting to {host}: {e}")
    finally:
        client.close()
    return results

def send_alert(checks: list[DiskCheck]) -> None:
    # Replace with your actual alerting: PagerDuty, Slack, etc.
    for check in checks:
        print(f"ALERT: {check.host}:{check.mount} is {check.usage_pct}% full "
              f"({check.available_gb}GB available)")

def main() -> None:
    alerts = []
    for server in SERVERS:
        checks = check_disk_usage(server["host"], server["user"])
        alerts.extend(c for c in checks if c.usage_pct >= THRESHOLD)

    if alerts:
        send_alert(alerts)
        print(f"Sent {len(alerts)} alerts")
    else:
        print("All disks healthy")

if __name__ == "__main__":
    main()
\`\`\`

**Key concepts demonstrated:**
- Type hints for maintainability
- \`dataclass\` for structured data
- Context manager (try/finally) for SSH cleanup
- Separation of concerns: check vs. alert
- Error handling per server (one failure doesn't stop others)`,
            },
            {
              question: "Explain Python's GIL and how to work around it for CPU-bound vs I/O-bound tasks.",
              difficulty: "senior" as const,
              answer: `**The GIL (Global Interpreter Lock):** A mutex in CPython that ensures only one thread executes Python bytecode at a time, even on multi-core CPUs.

**Why it exists:** CPython's memory management (reference counting) is not thread-safe. The GIL simplifies this but limits parallelism.

**Impact by workload type:**

**I/O-bound tasks (network calls, file I/O, disk):**
The GIL is RELEASED during I/O operations. Multiple threads work effectively:
\`\`\`python
import concurrent.futures
import requests

# This actually runs in parallel — GIL released during HTTP calls:
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(requests.get, url) for url in urls]
    results = [f.result() for f in futures]
# 10× faster than sequential for 10 HTTP requests
\`\`\`

**CPU-bound tasks (parsing, compression, math):**
GIL is NOT released — threads take turns, no speedup from multiple cores:
\`\`\`python
# Threading DOESN'T help for CPU work:
with ThreadPoolExecutor(max_workers=4) as ex:
    results = list(ex.map(heavy_computation, data))
# Still single-core performance — threads compete for GIL

# multiprocessing DOES help — separate processes, no GIL:
from multiprocessing import Pool
with Pool(4) as p:
    results = p.map(heavy_computation, data)
# True 4-core parallelism
\`\`\`

**asyncio (for I/O-bound concurrency — most scalable for DevOps tools):**
\`\`\`python
import asyncio
import aiohttp

async def check_service(url: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return {"url": url, "status": resp.status}

async def main():
    urls = ["https://api1.example.com", "https://api2.example.com"]
    results = await asyncio.gather(*[check_service(u) for u in urls])
    return results
# Single thread, single GIL, handles 1000s of concurrent I/O operations
\`\`\`

**Rule of thumb:**
- Network/file I/O → \`threading\` or \`asyncio\`
- CPU computation → \`multiprocessing\`
- Mixed → \`ProcessPoolExecutor\` for CPU parts + \`asyncio\` for I/O`,
            },
          ],
        },
      ],
      exam: [
        { question: "You're writing a Server class. When should you use a @property instead of a regular method for 'is_healthy'?", answer: "Use @property when the value feels like an attribute (a noun describing state) rather than an action. 'server.is_healthy' reads naturally as a property; 'server.check_health()' is better as a method if it does I/O. Properties also allow adding validation logic later without changing the calling code.", difficulty: "junior" as const },
        { question: "A @dataclass and a regular class both represent a DeployEvent. When do you choose @dataclass over a regular class?", answer: "Use @dataclass when you primarily need a data container: it auto-generates __init__, __repr__, and __eq__ from field annotations. Choose a regular class when you need complex initialization logic, metaclass behavior, or heavy method overriding. @dataclass with frozen=True also gives you an immutable, hashable object.", difficulty: "junior" as const },
        { question: "Your Notifier base class has a send() method that raises NotImplementedError. A senior says to use ABC instead. Why?", answer: "ABC (Abstract Base Class) with @abstractmethod prevents instantiation of the base class itself, catching the error at class definition time rather than at runtime when send() is called. It also makes the intent explicit: subclasses MUST implement send(). Use 'from abc import ABC, abstractmethod'.", difficulty: "mid" as const },
        { question: "You have a SlackNotifier and EmailNotifier that both need to log every message sent. How do you add this without duplicating code in each subclass?", answer: "Add the logging to the base class send() method using the Template Method pattern: define send() in the base class to log, then call self._send() which subclasses implement. Alternatively, use a decorator or mixin. This keeps the logging logic in one place.", difficulty: "mid" as const },
        { question: "What is the difference between __repr__ and __str__? Which one does Python use in f-strings?", answer: "__repr__ is for developers — it should produce an unambiguous string that could recreate the object. __str__ is for end users — a readable description. f-strings use __str__ (via str()). In the REPL and logging, __repr__ is used. Implement both: __repr__ for debugging, __str__ for display.", difficulty: "junior" as const },
        { question: "You need a class attribute that counts how many Server instances have been created. How do you implement this?", answer: "Define a class attribute 'count = 0' on the class and increment it in __init__: Server.count += 1 (or cls.count += 1 in a classmethod). Access it as Server.count. Be careful with self.count += 1 which creates an instance attribute shadowing the class attribute.", difficulty: "mid" as const },
        { question: "A Protocol vs an ABC for a Sendable interface — what is the practical difference when used as a type hint in a function signature?", answer: "Protocol uses structural subtyping (duck typing): any class with a matching send() method satisfies it, no inheritance needed. ABC requires explicit inheritance. Protocol is more flexible for integrating with third-party classes you can't modify. Both provide the same type-checking benefits in mypy/pyright.", difficulty: "mid" as const },
        { question: "You inherit from two classes that both define a method 'connect'. Python uses MRO to resolve this. What is MRO and how do you inspect it?", answer: "MRO (Method Resolution Order) is the order Python searches for methods in class hierarchies, using the C3 linearization algorithm. Inspect it with ClassName.__mro__ or ClassName.mro(). The first class in the MRO that defines 'connect' wins. Use super() correctly to cooperate with MRO.", difficulty: "senior" as const },
        { question: "You're designing a plugin system where users can register custom notifiers. How do you use Python's class system to support this?", answer: "Use a registry pattern: keep a class-level dict mapping names to notifier classes. Provide a @classmethod register() or a decorator @Notifier.register('slack') that adds to the registry. This avoids hardcoding subclasses and allows runtime extension without modifying base code.", difficulty: "senior" as const },
        { question: "A coworker writes 'if type(obj) == Server:' to check if an object is a Server instance. What is wrong with this and what should they use instead?", answer: "type() == checks for the exact class, failing for subclasses. Use isinstance(obj, Server) which returns True for the class and all its subclasses. This is the Liskov Substitution Principle in practice — code that accepts a Server should also accept any subclass of Server.", difficulty: "junior" as const },
      ],
    },
  ],
};
