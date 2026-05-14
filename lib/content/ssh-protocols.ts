import type { Track } from "./types";

export const sshProtocolsTrack: Track = {
  id: "ssh-protocols",
  title: "SSH & Network Protocols",
  description: "Master SSH, file transfer protocols, email, DNS, and other essential network protocols used in DevOps workflows.",
  icon: "Lock",
  color: "#14b8a6",
  gradient: "track-ssh-protocols-gradient",
  level: "intermediate",
  estimatedHours: 10,
  tags: ["ssh", "networking", "security", "protocols", "file-transfer", "dns", "email", "devops"],
  modules: [
    {
      id: "ssh-mastery",
      title: "SSH Deep Dive",
      level: "beginner",
      description: "From key exchange internals to advanced tunneling — become an SSH power user.",
      lessons: [
        {
          id: "ssh-fundamentals",
          title: "SSH Architecture & Key Management",
          duration: 55,
          type: "lesson",
          description: "Understand how SSH negotiates sessions, generate and manage keys, configure ~/.ssh/config, and troubleshoot connection issues.",
          objectives: [
            "Explain SSH key exchange and symmetric session key negotiation",
            "Generate RSA and Ed25519 key pairs with ssh-keygen",
            "Configure authorized_keys and known_hosts correctly",
            "Write a productive ~/.ssh/config with ProxyJump and ForwardAgent",
            "Use ssh-agent and ssh-add to manage key passphrases",
            "Diagnose connection failures with verbose output",
          ],
          tags: ["ssh", "keys", "security", "authentication", "config"],
          content: `# SSH Architecture & Key Management

SSH (Secure Shell) is the backbone of remote access in DevOps. Understanding how it works internally — not just the commands — makes you faster at debugging and more confident with security decisions.

## How SSH Establishes a Session

SSH authentication happens in two distinct phases:

**Phase 1 — Key Exchange (asymmetric cryptography)**

When you run \`ssh user@host\`, the client and server agree on a shared secret using an asymmetric algorithm such as ECDH (Elliptic Curve Diffie-Hellman). Neither side ever transmits the secret itself; they each compute it independently. This protects against passive eavesdroppers.

**Phase 2 — Symmetric Encryption (session key)**

From the shared secret both sides derive a symmetric session key (e.g., AES-256-GCM). All subsequent traffic — including your keystrokes — is encrypted with this key. Asymmetric crypto is only used to bootstrap; symmetric crypto handles the bulk data because it is orders of magnitude faster.

**Phase 3 — User Authentication**

Only after the encrypted channel is established does the server verify who you are. With key-based auth, the server challenges you to prove ownership of a private key whose corresponding public key lives in \`~/.ssh/authorized_keys\`.

\`\`\`bash
# See the exact algorithms negotiated in real time
ssh -vvv user@host 2>&1 | grep -E 'kex|cipher|mac|auth'
\`\`\`

## Generating Key Pairs

Prefer **Ed25519** for new keys — it is faster, more secure, and produces shorter keys than RSA-2048.

\`\`\`bash
# Ed25519 (recommended)
ssh-keygen -t ed25519 -C "alice@example.com"

# RSA 4096 (for legacy systems that don't support Ed25519)
ssh-keygen -t rsa -b 4096 -C "alice@example.com"

# Generate to a specific path (useful for per-project keys)
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_prod -C "prod-deploy-key"
\`\`\`

Always set a passphrase on private keys stored on workstations. Skip passphrases only on CI/CD service accounts with tightly scoped permissions.

## authorized_keys and known_hosts

**authorized_keys** — on the *server*, lists public keys allowed to authenticate:

\`\`\`bash
# Append your public key to a remote server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@host

# Manually (same effect)
cat ~/.ssh/id_ed25519.pub | ssh user@host "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

# Restrict a key to specific commands (principle of least privilege)
# In authorized_keys:
# command="rsync --server ...",no-pty,no-port-forwarding ssh-ed25519 AAAA...
\`\`\`

**known_hosts** — on the *client*, caches server fingerprints to detect MITM attacks:

\`\`\`bash
# View a server fingerprint before first connection
ssh-keyscan -H host 2>/dev/null | ssh-keygen -lf -

# Remove a stale entry (e.g., after server rebuild)
ssh-keygen -R host

# Disable strict host checking ONLY for automation in controlled environments
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null user@host
\`\`\`

## ~/.ssh/config — The Power File

A well-crafted \`~/.ssh/config\` saves hours of typing and documents your infrastructure:

\`\`\`
# ~/.ssh/config

# Global defaults
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    AddKeysToAgent yes
    IdentitiesOnly yes

# Production bastion
Host bastion-prod
    HostName 203.0.113.10
    User ec2-user
    IdentityFile ~/.ssh/id_ed25519_prod
    ForwardAgent yes

# Private host reached through bastion
Host app-prod
    HostName 10.0.1.50
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519_prod
    ProxyJump bastion-prod

# Dev server shorthand
Host dev
    HostName dev.example.internal
    User alice
    Port 2222
    IdentityFile ~/.ssh/id_ed25519_dev
\`\`\`

Now \`ssh app-prod\` automatically jumps through the bastion — no manual tunnels needed.

## ssh-agent and ssh-add

\`ssh-agent\` holds decrypted private keys in memory so you enter your passphrase once per session:

\`\`\`bash
# Start agent (usually done by your desktop environment or shell profile)
eval "\$(ssh-agent -s)"

# Add default keys
ssh-add

# Add a specific key
ssh-add ~/.ssh/id_ed25519_prod

# List loaded keys
ssh-add -l

# Remove all keys (e.g., before stepping away)
ssh-add -D

# Add with lifetime (key expires after 4 hours)
ssh-add -t 4h ~/.ssh/id_ed25519_prod
\`\`\`

With \`ForwardAgent yes\` in your config, the agent is forwarded through the bastion so the target host can use your local keys — without copying private keys to the bastion.

## Troubleshooting with -vvv

\`\`\`bash
# Three levels of verbosity
ssh -vvv user@host

# What to look for:
# "Authentications that can continue: publickey"  → server accepts key auth
# "Offering public key: ~/.ssh/id_ed25519"        → client is trying the right key
# "Server accepts key"                            → authentication succeeded
# "Permission denied (publickey)"                 → key not in authorized_keys OR wrong permissions

# Fix common permission issues on the server
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/id_ed25519

# Check sshd logs on the server
sudo journalctl -u sshd -f
sudo tail -f /var/log/auth.log   # Debian/Ubuntu
sudo tail -f /var/log/secure     # RHEL/CentOS
\`\`\`
`,
          interviewQuestions: [
            {
              question: "Why does SSH use asymmetric cryptography for key exchange but symmetric for data transfer?",
              difficulty: "mid",
              answer: "Asymmetric algorithms (RSA, ECDH) are computationally expensive and impractical for bulk data. SSH uses them only to securely establish a shared secret, from which a symmetric session key (e.g., AES-256) is derived. Symmetric ciphers are orders of magnitude faster for ongoing encryption of the session stream.",
            },
            {
              question: "What is the difference between authorized_keys and known_hosts?",
              difficulty: "junior",
              answer: "authorized_keys lives on the server and lists public keys that are permitted to authenticate to that account. known_hosts lives on the client and records the fingerprints of servers it has connected to, protecting against man-in-the-middle attacks where a server's identity changes unexpectedly.",
            },
            {
              question: "When would you use ForwardAgent and what are the security risks?",
              difficulty: "mid",
              answer: "ForwardAgent is useful when you need to SSH from a bastion host to internal servers using your local private key, without copying the private key to the bastion. The risk is that a compromised bastion host can use your forwarded agent socket to authenticate as you to other servers. Mitigate by only forwarding to trusted hosts and using short-lived keys.",
            },
            {
              question: "What is the ProxyJump directive and how does it differ from a manual tunnel?",
              difficulty: "mid",
              answer: "ProxyJump (-J on the command line) tells the SSH client to connect through an intermediate host in a single command. It uses an internal TCP forward rather than a listening port, which is cleaner and more secure than manually creating a local tunnel first. Multiple jump hosts can be chained comma-separated.",
            },
            {
              question: "How would you restrict an SSH key to only run a specific command on the server?",
              difficulty: "senior",
              answer: "In the authorized_keys file, prepend a command= option to the public key entry: command=\"/usr/bin/rsync --server ...\",no-pty,no-port-forwarding,no-X11-forwarding ssh-ed25519 AAAA.... This forces any connection using that key to run only the specified command, regardless of what the client requests. Combine with no-pty and no-port-forwarding to lock it down further.",
            },
          ],
          quizQuestions: [
            {
              question: "Your colleague reports they get 'Permission denied (publickey)' on a new server they set up. Walking through the troubleshooting steps, what are the two most likely causes?",
              type: "scenario",
              answer: "The two most common causes are: (1) incorrect file permissions — ~/.ssh should be 700 and authorized_keys should be 600; (2) the public key was not correctly appended to authorized_keys (e.g., line breaks corrupted the key, or it was written to the wrong user's home directory). Run ssh -vvv and check /var/log/auth.log on the server to confirm.",
            },
            {
              question: "You need to automate a deployment script that SSHes to 50 servers. The script runs in CI and you don't want to store a passphrase. What is the correct approach?",
              type: "scenario",
              answer: "Generate a dedicated Ed25519 deploy key with no passphrase (ssh-keygen -t ed25519 -N ''). Store the private key as a CI secret (e.g., GitHub Actions secret). In the CI job, write it to a temp file, set permissions 600, and pass it with -i. Scope the authorized_keys entry on the servers with command= restrictions and no-pty. Never reuse personal keys for automation.",
            },
            {
              question: "A server you previously connected to was rebuilt and now SSH gives a 'REMOTE HOST IDENTIFICATION HAS CHANGED' warning. What command removes the stale entry?",
              type: "scenario",
              answer: "Run ssh-keygen -R hostname (or ssh-keygen -R IP). This removes the old fingerprint from ~/.ssh/known_hosts. After removal, SSH will prompt you to confirm the new fingerprint on the next connection. Verify the new fingerprint out-of-band (e.g., from the cloud console) before accepting.",
            },
            {
              question: "Generate an Ed25519 key pair saved to ~/.ssh/id_ed25519_staging with the comment 'staging-deploy'. Show the command.",
              type: "hands-on",
              hint: "Use the -t, -f, and -C flags with ssh-keygen.",
              answer: "ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_staging -C 'staging-deploy'. This creates two files: id_ed25519_staging (private key, keep secret) and id_ed25519_staging.pub (public key, safe to share).",
            },
            {
              question: "Write a ~/.ssh/config block for a host named 'jump-box' at IP 10.1.0.5, user 'ops', port 22, using key ~/.ssh/id_ed25519_ops, and a second host 'db-prod' at 10.2.0.10 that proxies through jump-box.",
              type: "hands-on",
              hint: "Use the ProxyJump directive in the db-prod block.",
              answer: "Host jump-box\\n    HostName 10.1.0.5\\n    User ops\\n    IdentityFile ~/.ssh/id_ed25519_ops\\n\\nHost db-prod\\n    HostName 10.2.0.10\\n    User ops\\n    IdentityFile ~/.ssh/id_ed25519_ops\\n    ProxyJump jump-box",
            },
            {
              question: "Add a key to ssh-agent so it expires automatically after 8 hours. Show the command.",
              type: "hands-on",
              hint: "The -t flag on ssh-add accepts time values like 8h.",
              answer: "ssh-add -t 8h ~/.ssh/id_ed25519. The -t flag sets a lifetime; after 8 hours the agent automatically removes the key from memory, requiring you to re-add it.",
            },
          ],
        },
        {
          id: "ssh-advanced",
          title: "SSH Tunneling, Multiplexing & Server Hardening",
          duration: 60,
          type: "lesson",
          description: "Master SSH local/remote/dynamic tunnels, jump hosts, connection multiplexing with ControlMaster, sshfs, and securing OpenSSH server configuration.",
          objectives: [
            "Create local (-L), remote (-R), and dynamic (-D SOCKS) SSH tunnels",
            "Use ProxyJump for multi-hop bastion architectures",
            "Configure SSH multiplexing with ControlMaster and ControlPath",
            "Mount remote filesystems with sshfs",
            "Harden sshd_config: disable root, enforce key auth, AllowUsers, fail2ban",
          ],
          tags: ["ssh", "tunneling", "port-forwarding", "security", "hardening", "multiplexing"],
          content: `# SSH Tunneling, Multiplexing & Server Hardening

SSH is far more than a remote shell. Its tunneling capabilities let you securely reach services that aren't exposed to the internet, while multiplexing dramatically speeds up workflows that open many connections.

## Port Forwarding — Three Modes

### Local Port Forwarding (-L)

Forwards a local port to a remote destination *through* the SSH server. Use this to reach a database or internal API that's only accessible from the server side.

\`\`\`bash
# Syntax: ssh -L [local_addr:]local_port:dest_host:dest_port user@jump_host
# Access remote MySQL (port 3306) as if it were local port 3307
ssh -L 3307:db.internal:3306 -N -f user@bastion.example.com

# -N: don't execute a remote command (tunnel only)
# -f: fork to background
# Connect from your machine:
mysql -h 127.0.0.1 -P 3307 -u admin -p
\`\`\`

### Remote Port Forwarding (-R)

Exposes a local port on the remote server. Use this to give a remote server access to something running on your laptop (e.g., webhook testing).

\`\`\`bash
# Expose local port 8080 as port 9090 on the remote server
ssh -R 9090:localhost:8080 -N user@remote.example.com

# On the remote server, requests to localhost:9090 reach your local port 8080
# Useful with tools like ngrok as a self-hosted alternative
\`\`\`

### Dynamic Port Forwarding / SOCKS Proxy (-D)

Creates a local SOCKS5 proxy. Your browser (or any SOCKS-aware tool) routes traffic through the SSH server — effectively making it your exit node.

\`\`\`bash
# Start SOCKS proxy on local port 1080
ssh -D 1080 -N -f user@gateway.example.com

# Use with curl
curl --socks5 127.0.0.1:1080 http://internal-only-service/

# Configure Firefox: Settings → Network → Manual SOCKS5 proxy → 127.0.0.1:1080
\`\`\`

## Multi-Hop with ProxyJump

Modern SSH handles chained bastions natively:

\`\`\`bash
# Jump through two bastions to reach target
ssh -J user@bastion1,user@bastion2 user@final-target

# Equivalent config entry
# Host final-target
#     ProxyJump bastion1,bastion2
\`\`\`

Each hop authenticates independently using your local agent (with ForwardAgent or the built-in proxy mechanism — ProxyJump does not require ForwardAgent).

## SSH Multiplexing with ControlMaster

Every new SSH connection incurs TCP + cryptographic handshake overhead (~200ms). ControlMaster reuses an existing connection:

\`\`\`bash
# In ~/.ssh/config:
Host *
    ControlMaster auto
    ControlPath ~/.ssh/sockets/%r@%h:%p
    ControlPersist 10m

# Create the socket directory
mkdir -p ~/.ssh/sockets

# The first connection creates the master socket.
# Subsequent connections to the same host reuse it instantly.
# ControlPersist 10m keeps the master alive for 10 minutes after last use.

# Check active multiplexed connections
ssh -O check user@host

# Close the master explicitly
ssh -O exit user@host
\`\`\`

This is especially impactful in Ansible, Capistrano, or any tool that opens dozens of SSH connections per run.

## sshfs — Mount Remote Filesystems

\`\`\`bash
# Install
sudo apt install sshfs       # Debian/Ubuntu
brew install macfuse sshfs   # macOS

# Mount remote directory
mkdir -p ~/mnt/remote-home
sshfs user@host:/home/user ~/mnt/remote-home

# With options: reconnect on drop, follow symlinks, read cache
sshfs -o reconnect,follow_symlinks,cache=yes user@host:/var/www ~/mnt/webroot

# Unmount
fusermount -u ~/mnt/remote-home   # Linux
umount ~/mnt/remote-home          # macOS
\`\`\`

sshfs is handy for editing remote files in a local IDE without configuring remote development extensions.

## Hardening OpenSSH Server (sshd_config)

A default OpenSSH install accepts password authentication and root login — fix this immediately on any internet-facing server.

\`\`\`bash
# /etc/ssh/sshd_config — recommended hardened settings

Port 2222                        # Change from 22 to reduce automated scanning noise
AddressFamily inet               # IPv4 only if you don't use IPv6

PermitRootLogin no               # Never allow direct root SSH
PasswordAuthentication no        # Key-only authentication
ChallengeResponseAuthentication no
PubkeyAuthentication yes

AllowUsers alice bob deploy      # Whitelist specific users
# AllowGroups sshusers           # Or restrict by group

AuthorizedKeysFile .ssh/authorized_keys

# Reduce attack surface
X11Forwarding no
AllowTcpForwarding no            # Disable tunnels if not needed
GatewayPorts no
PermitEmptyPasswords no
MaxAuthTries 3
LoginGraceTime 20

# Modern ciphers only
KexAlgorithms curve25519-sha256,ecdh-sha2-nistp256
Ciphers aes256-gcm@openssh.com,chacha20-poly1305@openssh.com
MACs hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com
\`\`\`

\`\`\`bash
# Test config before restarting
sshd -t

# Reload (keep existing sessions alive)
sudo systemctl reload sshd
\`\`\`

## fail2ban for Brute-Force Protection

\`\`\`bash
sudo apt install fail2ban

# /etc/fail2ban/jail.local
[sshd]
enabled  = true
port     = 2222
maxretry = 5
bantime  = 3600
findtime = 600
logpath  = /var/log/auth.log

sudo systemctl enable --now fail2ban

# Check ban status
sudo fail2ban-client status sshd
sudo fail2ban-client set sshd unbanip 203.0.113.99
\`\`\`

## Quick Security Checklist

- Disable password auth (\`PasswordAuthentication no\`)
- Disable root login (\`PermitRootLogin no\`)
- Use \`AllowUsers\` or \`AllowGroups\`
- Change port from 22 (reduces automated scan noise, not true security)
- Install and configure fail2ban
- Use Ed25519 keys with passphrases
- Rotate keys when team members leave
- Monitor auth logs with alerting on repeated failures
`,
          interviewQuestions: [
            {
              question: "Explain the difference between local (-L) and remote (-R) SSH port forwarding with a practical use case for each.",
              difficulty: "mid",
              answer: "Local forwarding (-L) binds a port on your machine and tunnels connections to a destination reachable from the SSH server — e.g., ssh -L 5432:db.internal:5432 user@bastion lets you connect to a private database as localhost:5432. Remote forwarding (-R) binds a port on the SSH server and tunnels it back to a destination reachable from your machine — e.g., ssh -R 8080:localhost:3000 user@server exposes your local dev server on the remote machine, useful for webhook testing.",
            },
            {
              question: "What does ControlMaster do and when is it particularly valuable?",
              difficulty: "mid",
              answer: "ControlMaster creates a persistent master SSH connection whose socket is reused by subsequent connections to the same host, eliminating handshake overhead. It is especially valuable in automation tools like Ansible that open many short-lived SSH sessions to the same host — reducing total runtime significantly. ControlPersist keeps the master alive even after the initial client disconnects.",
            },
            {
              question: "Why is changing the SSH port from 22 not a security measure on its own?",
              difficulty: "junior",
              answer: "Changing the port only reduces noise from unsophisticated bots that only scan port 22. A determined attacker running a full port scan (e.g., nmap -sV) will find the service on any port. Real security comes from disabling password authentication, enforcing key-only auth, using fail2ban, and keeping sshd patched.",
            },
            {
              question: "How does ProxyJump differ from using ForwardAgent through a bastion?",
              difficulty: "senior",
              answer: "ProxyJump establishes a direct TCP tunnel through the intermediate host without exposing your agent socket to it — the cryptographic handshake with the final target happens end-to-end on the client. ForwardAgent passes your agent socket to the bastion, allowing it to authenticate onward but also exposing your keys to any process running as root on the bastion. ProxyJump is safer; ForwardAgent is only needed for legacy setups or when the target uses agent-based auth that ProxyJump can't handle.",
            },
            {
              question: "What sshd_config directives would you set to allow SFTP but block shell access for a group of users?",
              difficulty: "senior",
              answer: "Use a Match Group block: Match Group sftponly followed by ChrootDirectory /srv/sftp/%u, ForceCommand internal-sftp, AllowTcpForwarding no, X11Forwarding no. This forces users in the sftponly group into an SFTP-only chroot without interactive shell access. The chroot directory must be owned by root for security.",
            },
          ],
          quizQuestions: [
            {
              question: "A developer needs to access a Redis instance at redis.internal:6379 that is only reachable from the bastion host at bastion.example.com. What SSH command lets them connect from their laptop?",
              type: "scenario",
              answer: "ssh -L 6379:redis.internal:6379 -N -f user@bastion.example.com. After this, they connect their Redis client to localhost:6379. The -N flag prevents opening a shell, and -f forks the tunnel to the background.",
            },
            {
              question: "An Ansible playbook that hits 30 hosts is slow because each task opens a new SSH connection. What SSH config change would speed this up significantly?",
              type: "scenario",
              answer: "Enable SSH multiplexing by adding ControlMaster auto, ControlPath ~/.ssh/sockets/%r@%h:%p, and ControlPersist 10m to ~/.ssh/config (and creating the sockets directory). Ansible also has its own pipelining and SSH multiplexing settings in ansible.cfg: pipelining = True and ssh_args = -o ControlMaster=auto -o ControlPersist=60s.",
            },
            {
              question: "You hardened sshd_config on a remote server and now cannot log in. What should you have done before applying changes?",
              type: "scenario",
              answer: "Always run sshd -t first to validate the config syntax. More importantly, keep an existing SSH session open while testing changes — reload sshd (systemctl reload sshd, not restart) so existing sessions survive. Open a second connection to verify login works before closing the original. Use cloud provider console/serial access as a fallback if locked out.",
            },
            {
              question: "Write the ssh command to create a SOCKS5 proxy on local port 8888 through user@proxy.example.com, running in the background.",
              type: "hands-on",
              hint: "Use -D for dynamic forwarding, -N to skip opening a shell, -f to background.",
              answer: "ssh -D 8888 -N -f user@proxy.example.com. Configure applications to use SOCKS5 proxy at 127.0.0.1:8888 to route traffic through the remote server.",
            },
            {
              question: "Configure ~/.ssh/config to enable multiplexing for all hosts, with sockets in ~/.ssh/sockets/ and a 5-minute persist time.",
              type: "hands-on",
              hint: "Use ControlMaster, ControlPath, and ControlPersist directives under Host *.",
              answer: "Host *\\n    ControlMaster auto\\n    ControlPath ~/.ssh/sockets/%r@%h:%p\\n    ControlPersist 5m\\nAlso run: mkdir -p ~/.ssh/sockets to create the socket directory.",
            },
            {
              question: "Write the sshd_config lines that disable password authentication, disable root login, and restrict SSH access to users 'deploy' and 'alice'.",
              type: "hands-on",
              hint: "Three separate directives: PasswordAuthentication, PermitRootLogin, AllowUsers.",
              answer: "PasswordAuthentication no\\nPermitRootLogin no\\nAllowUsers deploy alice\\nAfter editing, validate with sshd -t and reload with systemctl reload sshd.",
            },
          ],
        },
      ],
    },
    {
      id: "file-transfer-protocols",
      title: "File Transfer Protocols",
      level: "beginner",
      description: "Master scp, sftp, rsync, and understand when (and when not) to use legacy FTP.",
      lessons: [
        {
          id: "scp-sftp",
          title: "scp, sftp, and rsync over SSH",
          duration: 50,
          type: "lesson",
          description: "Transfer files securely with scp and sftp, use rsync for efficient synchronization, configure SFTP-only chroot jails, and understand the tradeoffs between these tools.",
          objectives: [
            "Transfer files and directories with scp using compression and custom ports",
            "Use sftp interactively and in batch mode for scripted transfers",
            "Sync directories efficiently with rsync over SSH",
            "Configure an OpenSSH SFTP subsystem with a chroot jail",
            "Choose the right tool for each file transfer scenario",
          ],
          tags: ["scp", "sftp", "rsync", "file-transfer", "ssh", "security"],
          content: `# scp, sftp, and rsync over SSH

Secure, efficient file transfer is a daily DevOps task. Knowing which tool to reach for — and why — saves time and prevents mistakes.

## scp — Secure Copy

scp uses the SSH protocol to copy files between hosts. It's simple and available everywhere SSH is installed.

\`\`\`bash
# Copy a local file to a remote server
scp /etc/nginx/nginx.conf user@host:/tmp/

# Copy from remote to local
scp user@host:/var/log/app.log ./logs/

# Recursive copy (directory)
scp -r ./dist/ user@host:/var/www/html/

# Use a specific key, non-standard port, with compression
scp -i ~/.ssh/id_ed25519_prod -P 2222 -C large-archive.tar.gz user@host:/backup/

# Copy between two remote hosts (via your local machine)
scp user@host1:/data/file.csv user@host2:/import/

# Preserve timestamps and permissions
scp -p config.yaml user@host:/etc/app/
\`\`\`

**scp limitations:** scp opens a new SSH connection per invocation and has no resume capability. For large files or many files, prefer rsync.

## sftp — SSH File Transfer Protocol

sftp is a full subsystem running over SSH, offering an interactive FTP-like experience with better security than FTP.

\`\`\`bash
# Start interactive session
sftp user@host

# Interactive commands
sftp> ls -la               # List remote files
sftp> lls                  # List local files
sftp> pwd                  # Print remote working directory
sftp> lpwd                 # Print local working directory
sftp> cd /var/www          # Change remote directory
sftp> lcd ~/downloads      # Change local directory
sftp> get remote-file.log  # Download file
sftp> get -r remote-dir/   # Download directory recursively
sftp> put local-file.zip   # Upload file
sftp> put -r local-dir/    # Upload directory
sftp> mkdir backups        # Create remote directory
sftp> rm old-file.log      # Delete remote file
sftp> rename old.conf new.conf
sftp> exit
\`\`\`

**Batch mode** — automate sftp transfers in scripts:

\`\`\`bash
# Create a batch file
cat > /tmp/sftp-commands.txt << 'EOF'
cd /uploads
put /local/data/report.csv
ls -la
bye
EOF

# Execute batch (sftp exits non-zero on error)
sftp -b /tmp/sftp-commands.txt user@host

# Use in CI pipeline with a specific key
sftp -i ~/.ssh/deploy_key -b /tmp/sftp-commands.txt -P 22 user@host
\`\`\`

## rsync — The Right Tool for Synchronization

rsync only transfers the differences between source and destination, making it dramatically faster than scp for large files or directories that change incrementally.

\`\`\`bash
# Basic remote sync (trailing slash on source matters!)
rsync -avz ./dist/ user@host:/var/www/html/
# -a: archive mode (preserves permissions, timestamps, symlinks, owner)
# -v: verbose
# -z: compress during transfer

# Dry run — see what would change without changing anything
rsync -avzn ./dist/ user@host:/var/www/html/

# Delete files on destination that no longer exist in source
rsync -avz --delete ./dist/ user@host:/var/www/html/

# Exclude patterns
rsync -avz --exclude='*.log' --exclude='.git/' ./project/ user@host:/app/

# Use a specific SSH key and port
rsync -avz -e "ssh -i ~/.ssh/id_ed25519_prod -p 2222" ./dist/ user@host:/var/www/

# Resume a large interrupted transfer
rsync -avzP large-file.iso user@host:/data/
# -P: show progress and keep partial files for resume

# Limit bandwidth (in KB/s) to avoid saturating production links
rsync -avz --bwlimit=5000 ./backup/ user@host:/backup/

# Compare source and destination without transferring (checksum mode)
rsync -avzcn --checksum ./dist/ user@host:/var/www/html/
\`\`\`

**scp vs rsync tradeoffs:**

| Feature | scp | rsync |
|---------|-----|-------|
| Simplicity | Very simple | More flags to learn |
| Delta transfer | No (full copy always) | Yes (only changed blocks) |
| Resume | No | Yes (-P) |
| Delete sync | No | Yes (--delete) |
| Progress | Limited | Detailed (-P) |
| Best for | Quick one-off copies | Deployments, backups, sync |

## Configuring an SFTP-Only Server with Chroot

For giving external partners or customers secure file upload access without shell access:

\`\`\`bash
# /etc/ssh/sshd_config — add at the bottom

# Override the global Subsystem line first if it exists elsewhere
# Subsystem sftp /usr/lib/openssh/sftp-server  ← comment this out

Subsystem sftp internal-sftp

Match Group sftpusers
    ChrootDirectory /srv/sftp/%u
    ForceCommand internal-sftp
    AllowTcpForwarding no
    X11Forwarding no
    PasswordAuthentication yes   # Allow passwords for this group only if needed
\`\`\`

\`\`\`bash
# Set up the chroot environment
sudo groupadd sftpusers
sudo useradd -g sftpusers -s /sbin/nologin -M partner1

# Chroot directory MUST be owned by root (sshd requirement)
sudo mkdir -p /srv/sftp/partner1/uploads
sudo chown root:root /srv/sftp/partner1
sudo chmod 755 /srv/sftp/partner1

# The uploads subdirectory is owned by the user
sudo chown partner1:sftpusers /srv/sftp/partner1/uploads
sudo chmod 750 /srv/sftp/partner1/uploads

# Set a password
sudo passwd partner1

# Test
sftp partner1@localhost
# partner1 can only see /uploads, cannot escape the chroot
\`\`\`
`,
          interviewQuestions: [
            {
              question: "When would you choose rsync over scp for file transfers?",
              difficulty: "junior",
              answer: "Use rsync when: (1) transferring large files or directories that may have been partially transferred before (rsync can resume with -P); (2) syncing directories where only some files have changed — rsync transfers only the delta, not the full file; (3) you need to keep destination in sync with source including deletions (--delete); (4) you need bandwidth limiting (--bwlimit). Use scp for simple one-off copies of small files when simplicity matters more than efficiency.",
            },
            {
              question: "What does the trailing slash mean in rsync source paths?",
              difficulty: "mid",
              answer: "A trailing slash on the source (rsync -av src/ dest/) means 'copy the contents of src into dest'. Without a trailing slash (rsync -av src dest/), rsync copies the src directory itself into dest, creating dest/src/. This is one of the most common rsync mistakes — always use --dry-run (-n) first to verify behavior.",
            },
            {
              question: "Why must the ChrootDirectory in an SFTP chroot configuration be owned by root?",
              difficulty: "mid",
              answer: "OpenSSH's internal-sftp enforces that the chroot directory and all its parent components must be owned by root and not writable by any other user. This is a security requirement to prevent a chrooted user from replacing directories in the path to escape the chroot. If the directory is writable by the sftp user, sshd refuses the connection.",
            },
            {
              question: "How does sftp differ from FTP at the protocol level?",
              difficulty: "junior",
              answer: "sftp (SSH File Transfer Protocol) is a completely separate protocol that runs as a subsystem over an SSH connection — it has nothing to do with FTP at the protocol level. All traffic is encrypted by SSH. FTP is a plaintext protocol that transmits credentials and data in the clear. sftp uses a single TCP connection (the SSH connection) while FTP uses a separate control and data connection, causing NAT/firewall complications.",
            },
            {
              question: "How would you use rsync to deploy a web application while excluding the .git directory and node_modules, deleting stale files on the server?",
              difficulty: "mid",
              answer: "rsync -avz --delete --exclude='.git/' --exclude='node_modules/' --exclude='.env' ./app/ user@server:/var/www/app/. Always run with -n (dry run) first to verify the exclusions and deletions are correct before the live run. The --delete flag removes files from the destination that no longer exist locally.",
            },
          ],
          quizQuestions: [
            {
              question: "You need to deploy a 2GB log archive to a server over a flaky connection. The transfer keeps failing halfway through. What rsync option helps?",
              type: "scenario",
              answer: "Use rsync -avzP large-archive.tar.gz user@host:/backup/. The -P flag combines --progress (show transfer progress) and --partial (keep partially transferred files). On the next run, rsync resumes from where it left off rather than starting over, making it resilient to connection drops.",
            },
            {
              question: "A partner company needs to upload CSV files to your server. They should only access their upload folder and have no shell access. Walk through the setup.",
              type: "scenario",
              answer: "1. Create a group sftpusers and user partner with shell /sbin/nologin. 2. Configure sshd_config with Subsystem sftp internal-sftp and a Match Group sftpusers block with ChrootDirectory, ForceCommand internal-sftp, and AllowTcpForwarding no. 3. Create /srv/sftp/partner owned by root:root (755) and /srv/sftp/partner/uploads owned by partner (750). 4. Reload sshd. The partner can sftp in and access only their uploads folder.",
            },
            {
              question: "Your rsync deployment deleted important user-uploaded files from the production server because you forgot --exclude. How do you prevent this class of mistake?",
              type: "scenario",
              answer: "Always run rsync with -n (--dry-run) first and review the output, especially any lines prefixed with 'deleting'. In CI/CD pipelines, exclude user-generated content directories explicitly (--exclude='uploads/' --exclude='storage/'). Use rsync's --backup flag to keep deleted files in a backup directory. Consider using --itemize-changes to see exactly what would change.",
            },
            {
              question: "Copy the directory ~/project/dist/ to /var/www/html/ on server prod.example.com using rsync, preserving permissions, compressing, showing progress, and using SSH key ~/.ssh/id_prod.",
              type: "hands-on",
              hint: "Combine -avzP with -e to specify the SSH command.",
              answer: "rsync -avzP -e 'ssh -i ~/.ssh/id_prod' ~/project/dist/ user@prod.example.com:/var/www/html/",
            },
            {
              question: "Write an sftp batch script that connects to files.example.com as 'uploader', changes to the /incoming directory, uploads report.csv from the local /data/ directory, and exits.",
              type: "hands-on",
              hint: "Create a text file with sftp commands and pass it with -b.",
              answer: "Create /tmp/upload.sftp:\\ncd /incoming\\nput /data/report.csv\\nbye\\n\\nThen run: sftp -b /tmp/upload.sftp uploader@files.example.com",
            },
            {
              question: "Sync a local backup/ directory to user@nas.local:/backups/ using rsync, deleting files on the destination that were removed locally, and excluding any file named '*.tmp'.",
              type: "hands-on",
              hint: "Use --delete and --exclude flags.",
              answer: "rsync -avz --delete --exclude='*.tmp' ~/backup/ user@nas.local:/backups/. Run with -n first to preview. The --delete flag ensures the destination mirrors the source exactly (minus excluded files).",
            },
          ],
        },
        {
          id: "ftp-legacy-protocols",
          title: "FTP, FTPS & When to Use Legacy Protocols",
          duration: 45,
          type: "lesson",
          description: "Understand FTP active vs passive modes, FTPS (explicit/implicit TLS), vsftpd configuration, when FTP is still encountered in the wild, and how to migrate to safer alternatives.",
          objectives: [
            "Explain FTP active vs passive mode and why passive is required behind NAT/firewalls",
            "Distinguish between FTPS explicit and implicit TLS modes",
            "Configure vsftpd for a basic FTP server",
            "Identify when FTP is encountered in CI/CD and legacy contexts",
            "Understand the security risks of anonymous FTP",
            "Plan FTP-to-SFTP or FTP-to-HTTPS migrations",
          ],
          tags: ["ftp", "ftps", "vsftpd", "file-transfer", "security", "legacy"],
          content: `# FTP, FTPS & When to Use Legacy Protocols

FTP (File Transfer Protocol) is a 1971 protocol that is still encountered regularly in legacy systems, shared hosting, and certain industry verticals (banking, healthcare EDI). Understanding it is necessary for migrations and incident response — even if you would never design a new system around it.

## FTP Active vs Passive Mode

FTP uses two TCP connections: a **control channel** (port 21) for commands, and a separate **data channel** for file transfers. How that data channel is established defines the mode.

**Active Mode (PORT command):**
1. Client connects to server port 21 (control)
2. Client tells server: "Connect back to me at my-ip:random-port"
3. Server initiates data connection FROM port 20 TO client's random port

Problem: The server initiates an inbound connection to the client. Firewalls on the client side (NAT, corporate firewalls) block this incoming connection because it looks like an unsolicited inbound.

**Passive Mode (PASV command):**
1. Client connects to server port 21 (control)
2. Client requests passive mode
3. Server responds: "Connect to me at server-ip:random-high-port"
4. Client initiates the data connection to the server's random port

Passive mode works through NAT because all connections originate from the client. Almost all FTP clients default to passive mode for this reason.

\`\`\`bash
# Test FTP from command line
ftp ftp.example.com
# or with passive mode forced
curl -v --ftp-pasv ftp://user:pass@ftp.example.com/file.txt -o file.txt

# Using lftp (much better FTP client)
lftp -u user,password ftp.example.com
lftp> set ftp:passive-mode yes
lftp> ls
lftp> get remote-file.txt
lftp> mirror -R ./local-dir/ /remote-dir/   # Upload recursively
lftp> bye
\`\`\`

## FTPS — FTP with TLS

FTPS adds TLS encryption to FTP (not to be confused with SFTP, which is a completely different protocol over SSH).

**Explicit FTPS (FTPS on port 21):**
- Client connects to port 21 unencrypted
- Client sends \`AUTH TLS\` command to upgrade the connection
- Negotiated opportunistically — server can fall back to plaintext if client doesn't request TLS
- More firewall-friendly

**Implicit FTPS (port 990):**
- Entire connection is TLS from the start
- Client connects to port 990
- No opportunity for downgrade
- Considered more secure but less widely supported

\`\`\`bash
# Connect with explicit FTPS using curl
curl --ftp-ssl ftps://user:pass@ftp.example.com/file.txt -o file.txt

# Connect with implicit FTPS (port 990)
curl --ftp-ssl --disable-epsv ftps://ftp.example.com:990/

# Using lftp for FTPS
lftp -u user,password -e "set ftp:ssl-force yes" ftps://ftp.example.com
\`\`\`

## vsftpd Configuration

vsftpd (Very Secure FTP Daemon) is the most common FTP server on Linux:

\`\`\`bash
sudo apt install vsftpd

# /etc/vsftpd.conf — basic secure configuration
anonymous_enable=NO          # Disable anonymous access
local_enable=YES             # Allow local user accounts
write_enable=YES             # Allow uploads
local_umask=022
chroot_local_user=YES        # Jail users to their home directory
allow_writeable_chroot=YES   # Required if chroot dir is writable

# Passive mode configuration
pasv_enable=YES
pasv_min_port=40000
pasv_max_port=40100
# Open these ports in your firewall as well

# Logging
xferlog_enable=YES
xferlog_file=/var/log/vsftpd.log
log_ftp_protocol=YES

# FTPS (explicit TLS)
ssl_enable=YES
ssl_tlsv1_2=YES
ssl_sslv2=NO
ssl_sslv3=NO
rsa_cert_file=/etc/ssl/certs/vsftpd.pem
rsa_private_key_file=/etc/ssl/private/vsftpd.key
\`\`\`

\`\`\`bash
sudo systemctl enable --now vsftpd
# Open firewall for control + passive ports
sudo ufw allow 21/tcp
sudo ufw allow 40000:40100/tcp
\`\`\`

## FTP in CI/CD Pipelines

FTP still appears in deployment pipelines, particularly for shared hosting environments. Handle it with care:

\`\`\`bash
# Deploy with lftp in a shell script
lftp -u "\$FTP_USER,\$FTP_PASS" "\$FTP_HOST" << EOF
set ftp:ssl-force true
set ssl:verify-certificate yes
mirror -R --delete ./dist/ /public_html/
bye
EOF

# GitHub Actions example
# - name: Deploy via FTP
#   uses: SamKirkland/FTP-Deploy-Action@4.3.0
#   with:
#     server: \${{ secrets.FTP_HOST }}
#     username: \${{ secrets.FTP_USER }}
#     password: \${{ secrets.FTP_PASS }}
#     server-dir: /public_html/
\`\`\`

## Security Risks of Anonymous FTP

Anonymous FTP allows anyone to connect without credentials. Historically used for public software distribution, today it's almost always misconfigured or unnecessary:

- Credentials transmitted in plaintext (with plain FTP)
- Anonymous write access can turn your server into a malware distribution point
- No audit trail for who downloaded what
- Scanners constantly probe port 21 for anonymous access

**Replace anonymous FTP with:** HTTPS file hosting (nginx, S3 static website, GitHub Releases) for public distribution. Zero anonymous FTP servers should exist in production infrastructure unless you have a specific, audited reason.

## Migration Path: FTP → SFTP or HTTPS

\`\`\`bash
# Step 1: Audit current FTP users
cat /etc/vsftpd.userlist
grep -v nologin /etc/passwd | grep -v false  # Users with shell access

# Step 2: Set up SFTP for each FTP user (see Lesson 1 chroot setup)

# Step 3: Update client configurations
# lftp can speak SFTP: lftp sftp://user@host
# FileZilla, WinSCP support both FTP and SFTP — update server type in config

# Step 4: Migrate CI/CD pipelines (replace FTP action with rsync/scp)
# rsync -avz -e ssh ./dist/ user@host:/public_html/

# Step 5: Disable and remove vsftpd
sudo systemctl disable --now vsftpd
sudo apt remove vsftpd
sudo ufw delete allow 21/tcp
\`\`\`
`,
          interviewQuestions: [
            {
              question: "Why does FTP active mode fail through NAT but passive mode works?",
              difficulty: "junior",
              answer: "In active mode the server initiates a connection back to the client, which NAT/firewalls block because there's no existing session entry for this inbound connection. In passive mode the client initiates both the control and data connections to the server, fitting through NAT's stateful tracking. Almost all FTP clients default to passive mode for this reason.",
            },
            {
              question: "What is the difference between FTPS and SFTP?",
              difficulty: "junior",
              answer: "FTPS is FTP with TLS encryption layered on top — it still uses the FTP protocol with its dual-channel complexity, just encrypted. SFTP (SSH File Transfer Protocol) is a completely different protocol that runs as a subsystem over SSH — it has no relation to FTP at all. SFTP is generally preferred: simpler firewall rules (single port 22), stronger security model, and wider tooling support.",
            },
            {
              question: "When would you still accept FTP in a system design and how would you secure it?",
              difficulty: "mid",
              answer: "FTP is acceptable when: integrating with legacy partner systems or shared hosting that cannot support SFTP; regulatory environments with specific FTP requirements. Secure it by: using FTPS (explicit or implicit TLS), disabling anonymous access, chrooting users, restricting passive port ranges and opening only those ports in the firewall, monitoring /var/log/vsftpd.log, using strong credentials, and preferably restricting by IP.",
            },
            {
              question: "Why must you open passive port ranges in the firewall when configuring vsftpd?",
              difficulty: "mid",
              answer: "In passive mode, the server tells the client to connect to a high-numbered port (e.g., 40000–40100). If the firewall only allows port 21, the data connections will be blocked and file transfers will hang or fail after directory listings succeed (since ls uses the data channel). You must allow inbound TCP on the entire passive port range you configured in vsftpd.conf.",
            },
            {
              question: "How would you approach migrating a legacy application from FTP to SFTP without disrupting operations?",
              difficulty: "senior",
              answer: "1. Audit all FTP users and their access patterns. 2. Stand up SFTP in parallel (OpenSSH subsystem) with the same credentials. 3. Update one non-critical workflow to use SFTP and validate. 4. Roll out to remaining workflows with a deadline. 5. Monitor both FTP and SFTP access logs during the transition period. 6. After cutover, disable FTP (stop vsftpd, close firewall ports). Use lftp for any FTP client that needs to migrate, as lftp speaks both FTP and SFTP.",
            },
          ],
          quizQuestions: [
            {
              question: "A developer reports that their FTP client can connect and log in but file listings and downloads hang indefinitely. What is the most likely cause?",
              type: "scenario",
              answer: "The FTP client is using active mode but the server's outbound connections on port 20 are blocked by the client-side firewall or NAT. Solution: switch the FTP client to passive mode. If passive mode is already configured but still hanging, the server's passive port range is not open in the server-side firewall — verify pasv_min_port/pasv_max_port in vsftpd.conf and open those ports.",
            },
            {
              question: "You discover an internal vsftpd server has anonymous_enable=YES with write_enable=YES. What are the immediate risks and what do you do?",
              type: "scenario",
              answer: "Immediate risks: anyone can connect without credentials and upload arbitrary files (malware, warez, illegal content). The server could become a malware distribution point or use up disk space. Immediate action: set anonymous_enable=NO in vsftpd.conf and reload vsftpd. Audit the upload directory for suspicious files. Review access logs for recent anonymous uploads. File a security incident report. Long-term: migrate legitimate FTP users to SFTP.",
            },
            {
              question: "Your company's partner still uses FTP to upload EDI files and cannot change. How do you accept these files as securely as possible while minimizing risk?",
              type: "scenario",
              answer: "Configure vsftpd with FTPS (ssl_enable=YES), disable anonymous access, chroot the partner user to their upload directory (chroot_local_user=YES), restrict passive port range to a small window (e.g., 40000-40010), whitelist the partner's IP in the firewall (ufw allow from partner.ip to any port 21,40000:40010), enable detailed logging, and scan uploaded files with antivirus before processing. Document this as a known risk with compensating controls.",
            },
            {
              question: "Write the lftp command to mirror a local ./dist/ directory to /public_html/ on ftp.example.com with FTPS enforced.",
              type: "hands-on",
              hint: "Use lftp's set ftp:ssl-force and mirror -R command.",
              answer: "lftp -u \"\$FTP_USER,\$FTP_PASS\" ftp.example.com -e \"set ftp:ssl-force true; mirror -R --delete ./dist/ /public_html/; bye\"",
            },
            {
              question: "Configure vsftpd to disable anonymous access, chroot local users, and enable passive mode on ports 50000-50100.",
              type: "hands-on",
              hint: "Edit /etc/vsftpd.conf with the relevant directives.",
              answer: "In /etc/vsftpd.conf set: anonymous_enable=NO, local_enable=YES, chroot_local_user=YES, allow_writeable_chroot=YES, pasv_enable=YES, pasv_min_port=50000, pasv_max_port=50100. Then: sudo systemctl reload vsftpd && sudo ufw allow 50000:50100/tcp",
            },
            {
              question: "Replace an FTP deployment step in a shell script. Original: ftp -n ftp.example.com. Rewrite it to use rsync over SSH to the same server.",
              type: "hands-on",
              hint: "rsync uses -e to specify the SSH command and requires SSH access to the server.",
              answer: "rsync -avz --delete -e 'ssh -i ~/.ssh/deploy_key' ./dist/ deploy@ftp.example.com:/var/www/html/. This replaces the FTP upload with an SSH-encrypted, delta-efficient sync. Ensure the deploy user has SSH key-based access configured on the server.",
            },
          ],
        },
      ],
    },
    {
      id: "email-and-other-protocols",
      title: "Email, DNS & Application Protocols",
      level: "intermediate",
      description: "Understand email infrastructure, DNS internals, time synchronization, and directory services that underpin DevOps environments.",
      lessons: [
        {
          id: "smtp-email-protocols",
          title: "SMTP, Email Authentication & Delivery",
          duration: 55,
          type: "lesson",
          description: "Master email infrastructure: SMTP relay chain, IMAP vs POP3, SPF/DKIM/DMARC authentication, Postfix basics, sending email from scripts, and troubleshooting delivery failures.",
          objectives: [
            "Trace an email's journey from MUA through MTA to MDA",
            "Understand SMTP ports 25, 465, and 587 and when each is used",
            "Configure SPF, DKIM, and DMARC records to prevent spoofing",
            "Send email from Python scripts and curl",
            "Troubleshoot delivery failures using mail logs and MX record inspection",
            "Understand when to use SES or similar for transactional email",
          ],
          tags: ["smtp", "email", "spf", "dkim", "dmarc", "postfix", "devops"],
          content: `# SMTP, Email Authentication & Delivery

Email delivery seems simple from the outside, but the infrastructure is layered and full of failure points. For DevOps engineers, understanding email is essential for alert pipelines, transactional notifications, and diagnosing delivery failures.

## The Email Chain: MUA → MTA → MDA

\`\`\`
[You / Script]  →  [Postfix / SendGrid]  →  [Recipient's Server]  →  [Mailbox]
    MUA                    MTA                      MTA                   MDA
  (Mail User            (Mail Transfer            (Mail Transfer       (Mail Delivery
   Agent)                Agent / Relay)             Agent / Final)       Agent)
\`\`\`

- **MUA (Mail User Agent):** The email client or script that composes and sends. Examples: Outlook, Thunderbird, Python smtplib, curl.
- **MTA (Mail Transfer Agent):** Routes email between servers using SMTP. Examples: Postfix, Sendmail, Exim, AWS SES.
- **MDA (Mail Delivery Agent):** Accepts final delivery into a mailbox. Examples: Dovecot, Courier.

## SMTP Ports

| Port | Name | Usage |
|------|------|-------|
| 25 | SMTP | Server-to-server (MTA to MTA). ISPs block outbound 25 from residential/cloud IPs to prevent spam. |
| 465 | SMTPS | SMTP over implicit TLS (older standard, still widely supported). |
| 587 | Submission | Client-to-server (MUA to MTA). Requires authentication (STARTTLS). This is what your email client uses. |

\`\`\`bash
# Test SMTP connectivity
telnet mail.example.com 587
# EHLO yourdomain.com
# AUTH LOGIN
# (base64 encoded username and password)

# Modern approach: use swaks for testing
swaks --to test@example.com --from from@yourdomain.com \\
      --server smtp.example.com --port 587 \\
      --auth-user youruser --auth-password yourpass \\
      --tls
\`\`\`

## Email Authentication: SPF, DKIM, DMARC

Without authentication, anyone can send email claiming to be from your domain. These three DNS-based mechanisms prevent spoofing and improve deliverability.

**SPF (Sender Policy Framework)** — which servers are allowed to send for your domain:

\`\`\`
# DNS TXT record for yourdomain.com
v=spf1 include:amazonses.com include:sendgrid.net ip4:203.0.113.10 -all

# -all: hard fail (reject mail from unlisted senders)
# ~all: soft fail (mark as spam but accept)
# +all: accept all (never use this)
\`\`\`

**DKIM (DomainKeys Identified Mail)** — cryptographically signs outgoing email:

\`\`\`bash
# Generate DKIM keys (for Postfix with opendkim)
sudo apt install opendkim opendkim-tools
opendkim-genkey -t -s mail -d yourdomain.com
# Creates mail.private and mail.txt

# Add the public key to DNS as a TXT record:
# mail._domainkey.yourdomain.com TXT "v=DKIM1; k=rsa; p=MIGfMA0..."

# /etc/opendkim.conf
Domain    yourdomain.com
KeyFile   /etc/opendkim/keys/yourdomain.com/mail.private
Selector  mail
\`\`\`

**DMARC (Domain-based Message Authentication)** — policy for SPF/DKIM failures:

\`\`\`
# DNS TXT record: _dmarc.yourdomain.com
v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@yourdomain.com; pct=100

# p=none:       Monitor only, no action
# p=quarantine: Send to spam if SPF and DKIM both fail
# p=reject:     Reject the message outright (strictest)
\`\`\`

## Postfix Basics

\`\`\`bash
sudo apt install postfix

# /etc/postfix/main.cf — minimal relay configuration
myhostname = mail.yourdomain.com
mydomain = yourdomain.com
myorigin = \$mydomain
relayhost = [email-smtp.us-east-1.amazonaws.com]:587
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_use_tls = yes

# /etc/postfix/sasl_passwd
[email-smtp.us-east-1.amazonaws.com]:587 AKIAIOSFODNN7EXAMPLE:secretkey

sudo postmap /etc/postfix/sasl_passwd
sudo systemctl reload postfix

# Send a test email
echo "Test body" | mail -s "Test subject" recipient@example.com

# Check the mail queue
mailq
postqueue -p

# Flush the queue (retry all deferred messages)
postqueue -f

# View mail logs
sudo journalctl -u postfix -f
sudo tail -f /var/log/mail.log
\`\`\`

## Sending Email from Scripts

\`\`\`python
# Python smtplib with STARTTLS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_alert(to_addr: str, subject: str, body: str):
    msg = MIMEMultipart()
    msg['From'] = 'alerts@yourdomain.com'
    msg['To'] = to_addr
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    with smtplib.SMTP('smtp.yourdomain.com', 587) as server:
        server.ehlo()
        server.starttls()
        server.login(os.environ['SMTP_USER'], os.environ['SMTP_PASS'])
        server.sendmail(msg['From'], [to_addr], msg.as_string())

send_alert('oncall@yourdomain.com', 'Disk usage critical', 'Server disk at 95%')
\`\`\`

\`\`\`bash
# Send email with curl (useful in shell scripts)
curl --ssl-reqd \\
  --url 'smtps://smtp.gmail.com:465' \\
  --user 'youruser@gmail.com:apppassword' \\
  --mail-from 'youruser@gmail.com' \\
  --mail-rcpt 'recipient@example.com' \\
  --upload-file - << EOF
From: Your Name <youruser@gmail.com>
To: Recipient <recipient@example.com>
Subject: Alert from script

Disk usage has exceeded 90% on prod-server-01.
EOF
\`\`\`

## Troubleshooting Email Delivery

\`\`\`bash
# Check MX records for a domain
dig MX yourdomain.com
nslookup -type=MX yourdomain.com

# Check SPF record
dig TXT yourdomain.com | grep spf

# Check DMARC record
dig TXT _dmarc.yourdomain.com

# Test if your IP is blacklisted (check mxtoolbox.com or use CLI)
# Check your server's sending IP
curl ifconfig.me
# Then check: https://mxtoolbox.com/blacklists.aspx

# Read mail logs for a specific email
grep "recipient@example.com" /var/log/mail.log | tail -20

# Trace a message through Postfix logs
grep "message-id" /var/log/mail.log

# Check bounce messages
# Bounces come back to the MAIL FROM address — check that inbox
\`\`\`

## When to Use AWS SES or Similar

For production transactional email (user signups, password resets, alerts at scale), self-hosted Postfix is rarely the right answer:

- **AWS SES:** Cheap (\$0.10/1000 emails), high deliverability, handles bounce/complaint management
- **SendGrid / Mailgun / Postmark:** Higher-level APIs, detailed analytics, templates
- **When to self-host:** Internal alerting where deliverability rules don't apply, or air-gapped environments

\`\`\`bash
# Send via AWS SES with the CLI
aws ses send-email \\
  --from alerts@yourdomain.com \\
  --destination ToAddresses=oncall@yourdomain.com \\
  --message "Subject={Data=Disk Alert,Charset=UTF-8},Body={Text={Data=Disk at 95%,Charset=UTF-8}}" \\
  --region us-east-1
\`\`\`
`,
          interviewQuestions: [
            {
              question: "What is the difference between SMTP ports 25, 465, and 587, and when should you use each?",
              difficulty: "junior",
              answer: "Port 25 is for server-to-server (MTA to MTA) email relay. Most ISPs and cloud providers block outbound port 25 from non-mail-server IPs to prevent spam. Port 465 is SMTPS — SMTP over implicit TLS, mostly legacy but still widely supported. Port 587 is the submission port for client-to-server (MUA to MTA) mail with STARTTLS and authentication — use this in applications and email clients. When writing scripts that submit mail through an SMTP relay, always use port 587.",
            },
            {
              question: "Explain SPF, DKIM, and DMARC and how they work together.",
              difficulty: "mid",
              answer: "SPF is a DNS TXT record listing IP addresses/services authorized to send email for your domain. Receiving servers check if the sending IP is in the SPF record. DKIM adds a cryptographic signature to outgoing email headers; the public key is published in DNS and receivers verify the signature. DMARC ties them together with a policy: if SPF and/or DKIM fail, should the receiver accept, quarantine, or reject the message? DMARC also provides aggregate reporting so you can see who's sending on your behalf. All three must be configured for robust anti-spoofing protection.",
            },
            {
              question: "A critical alert email is not reaching the on-call engineer. Walk through your troubleshooting steps.",
              difficulty: "mid",
              answer: "1. Check if the message was sent: review application logs. 2. Check Postfix queue (mailq) for deferred messages. 3. Check /var/log/mail.log for errors. 4. Verify MX records for the recipient domain (dig MX). 5. Check if your sending IP is blacklisted (mxtoolbox.com). 6. Verify SPF/DKIM/DMARC records. 7. Check the recipient's spam folder. 8. Test with swaks directly to rule out application issues.",
            },
            {
              question: "Why should production applications use a service like AWS SES instead of a local Postfix relay?",
              difficulty: "junior",
              answer: "SES and similar services have established IP reputation with inbox providers (Gmail, Outlook), handle bounce and complaint processing automatically, provide delivery analytics, and scale to millions of emails without managing infrastructure. A new or small IP reputation means high spam rates. Self-hosting Postfix makes sense for internal infrastructure alerts but not for customer-facing transactional email.",
            },
            {
              question: "What is DMARC alignment and why does it matter?",
              difficulty: "senior",
              answer: "DMARC alignment means the domain in the From: header must align (match or be a subdomain of) the domain that passes SPF or DKIM. Without alignment, an attacker could use a legitimate domain's SPF to authenticate email while putting a different domain in the From: header. Strict alignment requires exact match; relaxed alignment allows subdomains. This is why simply having SPF is not enough — DMARC enforces that the authenticated domain is the one users actually see.",
            },
          ],
          quizQuestions: [
            {
              question: "Your application sends password reset emails but users report they go to spam. You have SPF configured but not DKIM or DMARC. What steps do you take?",
              type: "scenario",
              answer: "1. Set up DKIM: generate a key pair, add the public key as a DNS TXT record at selector._domainkey.yourdomain.com, configure your MTA (or SES/SendGrid) to sign outgoing mail. 2. Add a DMARC record starting with p=none to monitor without rejecting: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com. 3. Review DMARC aggregate reports to understand who's sending on your behalf. 4. Gradually move to p=quarantine then p=reject. 5. Consider switching to a reputable ESP (SES, SendGrid) if the IP reputation is poor.",
            },
            {
              question: "An alert pipeline sends emails via Postfix. Alerts are queuing up (mailq shows 500 deferred messages). How do you diagnose and recover?",
              type: "scenario",
              answer: "1. Run mailq to see error messages on deferred items. 2. Check /var/log/mail.log for SMTP errors (connection refused, TLS errors, authentication failures, blacklisting). 3. Fix the root cause (e.g., update relay credentials, unblock port 587). 4. Run postqueue -f to retry all deferred messages. 5. Consider switching to a more resilient delivery path (SES with its own retry logic) for critical alerts.",
            },
            {
              question: "You need to verify that your domain's email authentication is correct before enabling DMARC enforcement. What tools and checks do you perform?",
              type: "scenario",
              answer: "1. dig TXT yourdomain.com | grep spf — verify SPF record syntax. 2. dig TXT mail._domainkey.yourdomain.com — verify DKIM public key is published. 3. Send a test email and view headers — look for Authentication-Results: header showing spf=pass, dkim=pass. 4. Use mail-tester.com or mxtoolbox.com to get a score. 5. Set DMARC to p=none; rua=... first to collect reports before enforcing. 6. Review reports after a week to catch any legitimate senders not yet signing with DKIM.",
            },
            {
              question: "Write a Python script snippet that sends an alert email using STARTTLS on port 587, reading credentials from environment variables.",
              type: "hands-on",
              hint: "Use smtplib.SMTP with ehlo() and starttls() before login().",
              answer: "import smtplib, os\\nfrom email.mime.text import MIMEText\\nmsg = MIMEText('Alert body')\\nmsg['Subject'] = 'Alert'\\nmsg['From'] = os.environ['SMTP_FROM']\\nmsg['To'] = os.environ['ALERT_TO']\\nwith smtplib.SMTP(os.environ['SMTP_HOST'], 587) as s:\\n    s.ehlo()\\n    s.starttls()\\n    s.login(os.environ['SMTP_USER'], os.environ['SMTP_PASS'])\\n    s.sendmail(msg['From'], [msg['To']], msg.as_string())",
            },
            {
              question: "Write the DNS TXT records for: SPF allowing only AWS SES us-east-1, and DMARC with quarantine policy and report address dmarc@yourdomain.com.",
              type: "hands-on",
              hint: "SPF uses v=spf1, DMARC record goes at _dmarc subdomain.",
              answer: "SPF: yourdomain.com TXT \"v=spf1 include:amazonses.com -all\"\\nDMARC: _dmarc.yourdomain.com TXT \"v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com; pct=100\"",
            },
            {
              question: "The command 'mailq' shows messages deferred with error '421 Service temporarily unavailable'. What does this mean and how do you handle it?",
              type: "hands-on",
              hint: "421 is a temporary SMTP error from the receiving server.",
              answer: "421 is a transient SMTP error — the receiving server is temporarily unavailable or rate-limiting you. Postfix will automatically retry on its schedule. To check: grep '421' /var/log/mail.log to see frequency. If persistent: verify the remote server's MX is reachable (dig MX + telnet), check if you're being rate-limited (common with Gmail/Outlook for new senders), and consider switching to SES for better deliverability. Run postqueue -f to trigger an immediate retry attempt.",
            },
          ],
        },
        {
          id: "dns-other-protocols",
          title: "DNS Deep Dive, NTP, LDAP & OAuth2",
          duration: 65,
          type: "lesson",
          description: "Master DNS record types and resolution, use dig and nslookup for troubleshooting, understand DNSSEC, NTP, LDAP/Active Directory for service accounts, Kerberos concepts, and OAuth2/OIDC flow.",
          objectives: [
            "Explain all major DNS record types and query them with dig",
            "Understand recursive vs authoritative DNS resolution",
            "Debug DNS propagation and TTL issues",
            "Understand why NTP matters for TLS certs, Kerberos, and log correlation",
            "Use ldapsearch for basic AD/LDAP queries",
            "Explain the OAuth2 authorization code flow for engineers",
          ],
          tags: ["dns", "ntp", "ldap", "kerberos", "oauth2", "oidc", "security", "authentication"],
          content: `# DNS Deep Dive, NTP, LDAP & OAuth2

DNS, time synchronization, and directory services are foundational infrastructure that DevOps engineers constantly interact with — when they work, they're invisible; when they fail, everything breaks.

## DNS Record Types

\`\`\`bash
# A record — IPv4 address
dig A api.example.com
# api.example.com.  300  IN  A  203.0.113.42

# AAAA record — IPv6 address
dig AAAA api.example.com

# CNAME record — canonical name alias
dig CNAME www.example.com
# www.example.com.  3600  IN  CNAME  loadbalancer.example.com.
# Note: CNAME cannot coexist with other records on the same name (use ALIAS/ANAME at root)

# MX record — mail exchange (with priority)
dig MX example.com
# example.com.  3600  IN  MX  10  mail1.example.com.
# example.com.  3600  IN  MX  20  mail2.example.com.

# TXT record — arbitrary text (SPF, DKIM, domain verification)
dig TXT example.com
dig TXT _dmarc.example.com

# NS record — authoritative nameservers for a zone
dig NS example.com

# SOA record — Start of Authority (zone metadata: serial, refresh, retry, expire, TTL)
dig SOA example.com

# PTR record — reverse DNS (IP → hostname)
dig -x 203.0.113.42
# 42.113.0.203.in-addr.arpa.  3600  IN  PTR  api.example.com.

# SRV record — service location (used by Kubernetes, Kerberos, SIP)
dig SRV _http._tcp.example.com
\`\`\`

## Recursive vs Authoritative DNS

\`\`\`
Client
  │
  ▼
Recursive Resolver (e.g., 8.8.8.8, your ISP)
  │  "I don't know, let me find out"
  ▼
Root Nameserver (.)
  │  "Ask .com servers"
  ▼
TLD Nameserver (.com)
  │  "Ask ns1.example.com"
  ▼
Authoritative Nameserver (ns1.example.com)
  │  "api.example.com is 203.0.113.42"
  ▼
Recursive Resolver caches the answer
  │
  ▼
Client gets the answer
\`\`\`

\`\`\`bash
# Query authoritative nameserver directly (bypass cache)
dig @ns1.example.com A api.example.com

# Trace the full resolution chain
dig +trace api.example.com

# Query a specific resolver
dig @8.8.8.8 A api.example.com
dig @1.1.1.1 A api.example.com
\`\`\`

## dig Mastery

\`\`\`bash
# Short output (just the answer)
dig +short A api.example.com

# Check TTL remaining (how long until cache expires)
dig +nocmd +noall +answer A api.example.com
# api.example.com.  287  IN  A  203.0.113.42
# TTL of 287 means the cached record expires in 287 seconds

# Query all record types
dig ANY example.com

# Check if a record has propagated to multiple resolvers
for resolver in 8.8.8.8 1.1.1.1 9.9.9.9; do
  echo -n "\$resolver: "
  dig +short @\$resolver A api.example.com
done

# nslookup (simpler, less information)
nslookup api.example.com
nslookup api.example.com 8.8.8.8
\`\`\`

## DNS Propagation and TTL

When you change a DNS record, the old value is cached by resolvers around the world for the duration of the TTL. This is why DNS "propagation" takes time:

\`\`\`bash
# Before making a DNS change:
# 1. Lower the TTL well in advance (e.g., from 3600 to 60 seconds)
# 2. Wait for the old high-TTL records to expire from caches
# 3. Make the actual change
# 4. Verify with multiple resolvers
# 5. Once stable, raise TTL back to normal

# Check current TTL
dig +noall +answer A example.com | awk '{print "TTL:", \$2}'

# Verify propagation has completed
dig +short @8.8.8.8 A api.example.com
dig +short @1.1.1.1 A api.example.com
# Both should return the same new IP
\`\`\`

## DNSSEC Basics

DNSSEC adds cryptographic signatures to DNS records, preventing DNS spoofing/cache poisoning attacks.

\`\`\`bash
# Check if a domain has DNSSEC enabled
dig +dnssec A example.com
# Look for RRSIG records in the answer section

# Validate DNSSEC chain
dig +cd @8.8.8.8 A example.com  # +cd disables DNSSEC validation to show all records
delv @8.8.8.8 A example.com     # delv performs full DNSSEC validation
\`\`\`

## NTP — Time Synchronization

Accurate time is critical for TLS certificate validation, Kerberos (which has a 5-minute skew tolerance), log correlation across servers, and database consistency.

\`\`\`bash
# Check time synchronization status (systemd-timesyncd)
timedatectl status
timedatectl show-timesync

# Check NTP sync status (chrony)
chronyc tracking
chronyc sources -v

# Check ntpd status (older systems)
ntpq -p

# Force time sync now
sudo chronyc makestep

# Configure NTP servers in /etc/chrony.conf
# server time.google.com iburst
# server time.cloudflare.com iburst
# pool pool.ntp.org iburst

# Restart chronyd
sudo systemctl restart chronyd
\`\`\`

Time drift symptoms: TLS handshake failures ("certificate not yet valid"), Kerberos errors ("Clock skew too great"), log timestamps that don't correlate across servers.

## LDAP/Active Directory for DevOps

LDAP (Lightweight Directory Access Protocol) is used for centralized authentication and authorization. Active Directory is Microsoft's LDAP implementation.

\`\`\`bash
# Install ldap utilities
sudo apt install ldap-utils

# Basic search — list all users in an OU
ldapsearch -H ldap://dc.example.com \\
           -D "CN=svc-devops,OU=ServiceAccounts,DC=example,DC=com" \\
           -w "\$LDAP_PASS" \\
           -b "OU=Users,DC=example,DC=com" \\
           "(objectClass=user)" \\
           cn mail memberOf

# Find a specific user
ldapsearch -H ldap://dc.example.com \\
           -D "CN=svc-devops,OU=ServiceAccounts,DC=example,DC=com" \\
           -w "\$LDAP_PASS" \\
           -b "DC=example,DC=com" \\
           "(sAMAccountName=alice)"

# Test LDAP authentication for a user
ldapwhoami -H ldap://dc.example.com \\
           -D "CN=Alice Smith,OU=Users,DC=example,DC=com" \\
           -w "userpassword"

# Service accounts for DevOps:
# - Create a dedicated service account with read-only access to the directory
# - Store credentials in a secrets manager (Vault, AWS Secrets Manager)
# - Use LDAPS (port 636) or STARTTLS for encrypted connections
\`\`\`

## Kerberos Concepts

Kerberos is the authentication protocol underlying Active Directory. Key concepts:

- **KDC (Key Distribution Center):** The trusted authentication server (your domain controller)
- **TGT (Ticket Granting Ticket):** A time-limited credential you get after authenticating
- **Service Ticket:** A ticket for accessing a specific service, obtained using your TGT
- **Keytab:** A file containing service account credentials for non-interactive authentication

\`\`\`bash
# Obtain a Kerberos ticket
kinit alice@EXAMPLE.COM

# List current tickets
klist

# Destroy tickets (logout)
kdestroy

# Authenticate using a keytab (for services and CI)
kinit -kt /etc/krb5.keytab svc-devops@EXAMPLE.COM

# The 5-minute clock skew rule:
# Kerberos rejects tickets if the client clock is more than 5 minutes off
# → This is why NTP is critical in AD environments
\`\`\`

## OAuth2 and OIDC for Engineers

OAuth2 is an *authorization* framework (what can you access?). OIDC (OpenID Connect) adds *authentication* (who are you?) on top of OAuth2.

**Authorization Code Flow** (most secure, for web apps):

\`\`\`
1. User clicks "Login with Google"
2. App redirects to: https://accounts.google.com/oauth/authorize
   ?client_id=...&redirect_uri=https://app.example.com/callback
   &response_type=code&scope=openid email
3. User authenticates and consents
4. Google redirects back to: https://app.example.com/callback?code=AUTH_CODE
5. App's backend exchanges code for tokens (server-side, never exposed to browser):
   POST https://oauth2.googleapis.com/token
   { code, client_id, client_secret, redirect_uri, grant_type=authorization_code }
6. Google returns: access_token, id_token (JWT), refresh_token
7. App uses access_token for API calls, id_token to identify the user
\`\`\`

\`\`\`bash
# Inspect a JWT token (decode without verification)
JWT="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIi4uLn0.sig"
echo \$JWT | cut -d. -f2 | base64 -d 2>/dev/null | python3 -m json.tool

# Common JWT claims:
# sub: subject (user ID)
# iss: issuer (who issued the token)
# aud: audience (intended recipient)
# exp: expiration timestamp
# iat: issued at timestamp

# Verify a JWT signature (using jwt-cli)
jwt decode --secret "\$JWT_SECRET" "\$JWT_TOKEN"
\`\`\`

**OAuth2 for DevOps tooling:** Many APIs (GitHub, Google Cloud, Vault) use OAuth2/OIDC. In CI/CD, use short-lived OIDC tokens instead of long-lived secrets:

\`\`\`yaml
# GitHub Actions OIDC — no AWS credentials stored in GitHub
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789:role/github-actions-role
    aws-region: us-east-1
# GitHub gets a JWT from GitHub's OIDC provider; AWS trusts it and issues temporary credentials
\`\`\`
`,
          interviewQuestions: [
            {
              question: "Explain the difference between a recursive DNS resolver and an authoritative nameserver.",
              difficulty: "junior",
              answer: "A recursive resolver (like 8.8.8.8) does the work of finding the answer — it queries root servers, TLD servers, and authoritative servers on behalf of the client, caches results, and returns the final answer. An authoritative nameserver is the definitive source of truth for a specific zone (e.g., ns1.example.com holds the actual A records for example.com). The recursive resolver consults authoritative servers but doesn't hold zone data itself.",
            },
            {
              question: "Why can't you put a CNAME record at the root (apex) of your domain, and how do services like Cloudflare work around this?",
              difficulty: "mid",
              answer: "DNS RFC requires that the zone apex (e.g., example.com.) must have SOA and NS records. A CNAME cannot coexist with other record types on the same name. Pointing example.com to a load balancer hostname via CNAME would conflict with the required SOA/NS records. Cloudflare and Route 53 work around this with ALIAS/ANAME records — a proprietary extension that resolves like a CNAME at the DNS server level but returns an A record to clients.",
            },
            {
              question: "Why is NTP critical in Active Directory environments?",
              difficulty: "junior",
              answer: "Kerberos — the authentication protocol used by AD — rejects tickets if the clock difference between client and server exceeds 5 minutes. This is a security feature to prevent replay attacks. If NTP is misconfigured and clocks drift, all Kerberos authentication fails: domain logins, file shares, and any Kerberos-authenticated service stop working. NTP is also critical for log correlation and TLS certificate validity.",
            },
            {
              question: "Explain the OAuth2 authorization code flow and why the code exchange happens server-side.",
              difficulty: "mid",
              answer: "The client receives an authorization code in the browser redirect. This code alone is not useful — it must be exchanged for tokens by the backend server using the client_secret. This server-side exchange keeps the client_secret and the actual tokens out of the browser (where they'd be visible in URLs, browser history, and JavaScript). The short-lived code is useless to an attacker who intercepts the redirect without also having the client_secret.",
            },
            {
              question: "You need to add DNS-based verification for a new SaaS tool to your domain. The vendor says to add a TXT record. What do you check before making the change?",
              difficulty: "mid",
              answer: "1. Verify the exact record name and value from the vendor. 2. Check if a TXT record already exists at that name (dig TXT name.example.com) — multiple TXT records are allowed, but verify you won't break existing SPF/DKIM. 3. Note the current TTL and consider lowering it if you need faster changes. 4. Add the record and verify with dig +short TXT name.example.com after propagation. 5. Confirm with the vendor's verification tool.",
            },
          ],
          quizQuestions: [
            {
              question: "After changing an A record for api.example.com from 1.2.3.4 to 5.6.7.8, some users still hit the old server an hour later. What is the cause and how do you diagnose it?",
              type: "scenario",
              answer: "The old A record is cached by recursive resolvers for its TTL duration. Users hitting the old IP have their resolver serving a cached response. Diagnose by: checking the TTL of the old record (it shows how long caches will keep it), querying multiple resolvers (dig @8.8.8.8 and @1.1.1.1), and checking the user's local DNS cache. Lesson: lower TTL to 60 seconds well before planned DNS changes, then change the record, then restore the TTL after propagation confirms.",
            },
            {
              question: "Your Kubernetes pod is failing to resolve internal service names. Pods can reach external DNS (8.8.8.8) but not cluster-internal names. What do you check?",
              type: "scenario",
              answer: "1. Check the pod's /etc/resolv.conf — it should point to the cluster DNS IP (typically kube-dns or CoreDNS at 10.96.0.10). 2. Verify kube-dns/CoreDNS pods are running: kubectl get pods -n kube-system. 3. Test resolution from inside the pod: kubectl exec pod -- nslookup kubernetes.default.svc.cluster.local. 4. Check CoreDNS logs: kubectl logs -n kube-system -l k8s-app=kube-dns. 5. Verify the DNS service is reachable: kubectl exec pod -- curl -v 10.96.0.10:53.",
            },
            {
              question: "You suspect a security incident where an attacker may be manipulating DNS responses for your users. What DNS security mechanism would prevent this and how does it work?",
              type: "scenario",
              answer: "DNSSEC (DNS Security Extensions) prevents DNS cache poisoning by adding cryptographic signatures to DNS records. Each zone has a key pair; records are signed with the private key and resolvers verify using the public key published in DNS (DNSKEY records). The chain of trust goes from the root zone down to your zone. To implement: enable DNSSEC in your registrar and DNS provider, which generates RRSIG records for all zone data. Resolvers that support DNSSEC validation will reject tampered responses.",
            },
            {
              question: "Use dig to find the authoritative nameservers for github.com, then query one of them directly for github.com's A record.",
              type: "hands-on",
              hint: "Use dig NS to find nameservers, then dig @nameserver to query directly.",
              answer: "Step 1: dig NS github.com — shows ns1.p16.dynect.net and others. Step 2: dig @ns1.p16.dynect.net A github.com — queries the authoritative server directly, bypassing any recursive resolver cache. This is useful for verifying a DNS change has been made at the authoritative level before waiting for propagation.",
            },
            {
              question: "Decode the payload section of this JWT to find the user's email: eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyMTIzIiwiZW1haWwiOiJhbGljZUBleGFtcGxlLmNvbSIsImV4cCI6OTk5OTk5OTk5OX0.signature. Show the command.",
              type: "hands-on",
              hint: "Extract the middle section (between dots), base64 decode it.",
              answer: "echo 'eyJzdWIiOiJ1c2VyMTIzIiwiZW1haWwiOiJhbGljZUBleGFtcGxlLmNvbSIsImV4cCI6OTk5OTk5OTk5OX0' | base64 -d | python3 -m json.tool. This reveals {\"sub\": \"user123\", \"email\": \"alice@example.com\", \"exp\": 9999999999}. Note: this only decodes — it does not verify the signature, so never trust JWT claims without signature verification in application code.",
            },
            {
              question: "Check the NTP synchronization status on a Linux server using chronyd, and show how to force an immediate time correction.",
              type: "hands-on",
              hint: "Use chronyc commands.",
              answer: "chronyc tracking — shows current sync status, reference server, and offset. chronyc sources -v — lists all NTP sources and their quality. To force immediate correction: sudo chronyc makestep. This is a one-time step adjustment; normally chrony slews the clock gradually to avoid disrupting applications.",
            },
          ],
        },
      ],
    },
  ],
};
