import { Track } from "./types";

export const awsTrack: Track = {
  id: "aws",
  title: "AWS for DevOps",
  description:
    "Master Amazon Web Services from CLI basics to production-grade architectures. Covers IAM, EC2, S3, VPC, RDS, Lambda, ECS/EKS, CloudFormation, CodePipeline, and security/cost management — with CLI commands throughout.",
  icon: "Cloud",
  color: "#f59e0b",
  gradient: "track-aws-gradient",
  level: "intermediate",
  estimatedHours: 36,
  modules: [
    // ─────────────────────────────────────────
    // MODULE 1 — Foundations & IAM
    // ─────────────────────────────────────────
    {
      id: "aws-foundations",
      title: "AWS Foundations & IAM",
      description: "Core AWS concepts, the CLI, and Identity & Access Management.",
      level: "beginner",
      lessons: [
        {
          id: "aws-global-infrastructure",
          title: "AWS Global Infrastructure",
          description: "Regions, Availability Zones, Edge Locations, and the shared responsibility model.",
          type: "lesson",
          duration: 12,
          objectives: [
            "Explain the difference between Regions and Availability Zones",
            "Choose the right region for a workload",
            "Describe the AWS shared responsibility model",
            "Navigate the AWS Management Console",
          ],
          content: `## AWS Global Infrastructure

AWS operates the world's largest cloud network — 33 geographic regions, 105+ Availability Zones, and 400+ edge locations as of 2024. Understanding how this infrastructure is structured is foundational to designing highly available, low-latency, and compliant applications.

---

## Why Geography Matters in Cloud

Before cloud, your application lived in one data centre. If it burned down, you were offline. AWS's global infrastructure solves this by distributing your workload across physically isolated facilities — but this requires you to understand the hierarchy and design your architecture accordingly.

The three levels you need to internalize: **Regions** (coarse-grained geography), **Availability Zones** (fine-grained fault isolation), and **Edge Locations** (content delivery and DNS).

---

## Regions

A **Region** is a geographic area containing multiple, physically separated data centres. Each region is a completely independent cloud — separate power grids, separate networking, separate control planes.

**Critical rule:** Data does NOT replicate between regions unless you explicitly configure it. Your us-east-1 RDS database has no automatic backup in eu-west-1. This is a feature (data sovereignty) and a responsibility (disaster recovery is your problem).

| Region | Code | Notes |
|---|---|---|
| US East (N. Virginia) | us-east-1 | Oldest, most services, cheapest prices, most traffic |
| US West (Oregon) | us-west-2 | Standard DR pair for us-east-1 |
| EU (Ireland) | eu-west-1 | Most popular EU region, GDPR-compliant |
| EU (Frankfurt) | eu-central-1 | German data sovereignty requirements |
| Asia Pacific (Singapore) | ap-southeast-1 | SEA hub, closest to Southeast Asia |
| Asia Pacific (Tokyo) | ap-northeast-1 | Japan and Korea workloads |
| Asia Pacific (Sydney) | ap-southeast-2 | Australia/NZ |
| Asia Pacific (Mumbai) | ap-south-1 | India, lower latency for South Asia |

**How to choose a region — decision framework:**

1. **Data residency law first** — GDPR mandates EU data stays in EU. HIPAA has no mandatory region but contracts may specify. Brazil's LGPD, India's DPDP Act, and China's PIPL all have localization requirements. This is non-negotiable and must be evaluated before all other factors.

2. **Latency second** — Use tools like [cloudping.info](https://cloudping.info) or AWS's own latency tests to measure round-trip time from your users' location. A user in London hitting us-east-1 adds ~80ms vs eu-west-1. For APIs this matters. For batch jobs it doesn't.

3. **Service availability third** — Not every AWS service is in every region. New services launch in us-east-1 first, sometimes months before other regions. Check the [AWS Regional Services List](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/) before architecting around a specific service.

4. **Cost last** — Prices vary 10–40% between regions. us-east-1 is typically cheapest. ap-southeast-2 (Sydney) is ~20% more expensive. eu-central-1 (Frankfurt) runs ~10% above us-east-1. Use the [AWS Pricing Calculator](https://calculator.aws) to compare.

---

## Availability Zones (AZs)

Each region contains 2–6 **Availability Zones**. An AZ is one or more discrete data centres with redundant power, cooling, and networking — but physically separated from other AZs by meaningful distance (miles, not feet) to prevent correlated failures.

AZs within a region are connected by AWS's private fibre network with sub-millisecond latency. This allows synchronous replication (RDS Multi-AZ) and makes distributing workloads across AZs practical.

\`\`\`
us-east-1
├── us-east-1a  (data centre campus A — distinct building, power grid)
├── us-east-1b  (data centre campus B — physically separated)
├── us-east-1c  (data centre campus C)
├── us-east-1d  (data centre campus D)
├── us-east-1e  (some accounts, not always visible)
└── us-east-1f

Note: The letter (1a, 1b) is randomized per AWS account —
your "us-east-1a" is not the same physical AZ as another account's "us-east-1a".
This prevents everyone from picking "1a" and overloading it.
\`\`\`

**How to design for AZ failure:**

AZ failures happen. Not often, but they happen — power grid issues, cooling failures, networking events. Your architecture should treat an AZ outage as a routine event, not a disaster.

- **EC2**: Use Auto Scaling Groups spanning ≥2 AZs with \`min-healthy-percentage=100\`
- **RDS**: Enable Multi-AZ (creates synchronous standby in second AZ, ~60s failover)
- **ALB**: Automatically distributes across AZs when you add subnets from multiple AZs
- **S3**: Automatically stores objects across ≥3 AZs (you get this for free, no config)
- **ElastiCache**: Use cluster mode with replicas in separate AZs
- **DynamoDB**: Multi-AZ by default in all standard tables

The SLA difference is stark: single-AZ EC2 is 99.9% uptime. Multi-AZ is 99.99%. That's the difference between 8.7 hours/year downtime and 52 minutes/year.

---

## Edge Locations & CloudFront

AWS has 400+ **edge locations** (Points of Presence) in 90+ cities across 50+ countries. These are NOT regions — you don't run EC2 here. They serve two purposes:

**Content Delivery (CloudFront CDN):**
When a user in Tokyo requests your image stored in S3 in us-east-1, CloudFront serves it from the Tokyo edge location after the first request. Subsequent users get ~5ms response instead of ~150ms.

**Global DNS (Route 53):**
Route 53's DNS resolvers are distributed across edge locations. DNS queries resolve from the nearest PoP — typically under 5ms globally.

**DDoS Absorption (AWS Shield):**
Edge locations absorb volumetric DDoS attacks at the network layer before traffic reaches your origin. AWS Shield Standard is free and automatic for all customers. Shield Advanced ($3,000/month) provides 24/7 DDoS response team access.

\`\`\`bash
# Check CloudFront cache hit ratio (high = good, means edge is serving requests)
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name CacheHitRate \
  --dimensions Name=DistributionId,Value=EXAMPLEID \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 3600 \
  --statistics Average
\`\`\`

---

## Shared Responsibility Model

The most important mental model for cloud security. AWS and the customer each own different layers — and the boundary depends on the service type.

\`\`\`
AWS is responsible FOR the cloud (the infrastructure):
├── Physical security of data centres (no one walks in)
├── Network infrastructure (backbone, hardware switches)
├── Hypervisor & hardware (the physical servers)
├── Managed service patches (RDS database engine OS, Lambda runtime)
└── Global network DDoS protection (Shield Standard)

You are responsible IN the cloud (what runs on it):
├── Your data — encryption at rest, encryption in transit
├── OS patching — EC2 guest OS is entirely your responsibility
├── IAM — who has access, principle of least privilege
├── Application code — vulnerabilities in your code
├── Security group rules — what ports are open to whom
├── Network ACL configuration
├── S3 bucket policies — public access settings
└── Backups and disaster recovery strategy
\`\`\`

**The responsibility line shifts with service abstraction level:**

| Service | What YOU own | What AWS owns |
|---------|-------------|---------------|
| EC2 (IaaS) | OS, app, network config, patching | Physical hardware, hypervisor |
| RDS (PaaS) | Data, access control, backups strategy | OS, DB engine patches, HA replication |
| Lambda (FaaS) | Function code, IAM role | Runtime, OS, scaling, patching |
| S3 (Object Storage) | Bucket policies, encryption, access | Durability, hardware redundancy |

**The uncomfortable truth:** The vast majority of cloud security incidents are not AWS infrastructure failures — they are customer misconfigurations. Public S3 buckets with sensitive data, IAM keys checked into GitHub, EC2 instances running unpatched software. AWS can't protect you from your own configuration choices.

> **Real-world example:** Capital One's 2019 breach compromised 100 million records. The attack exploited a misconfigured WAF and an overly permissive IAM role on an EC2 instance — entirely in the customer's responsibility domain. AWS's infrastructure was not compromised.`,
          interviewQuestions: [
            {
              question: "What is the AWS shared responsibility model? Give examples of what AWS vs. the customer is responsible for.",
              difficulty: "junior" as const,
              answer: `AWS is responsible for "security OF the cloud" — the physical hardware, hypervisor, global network backbone, and managed service infrastructure. Customers are responsible for "security IN the cloud" — IAM policies, security group rules, OS patching on EC2, application code, data encryption, and S3 bucket policies.

The responsibility line moves based on service type:
- **EC2 (IaaS)**: You patch the OS, configure firewalls, manage the app
- **RDS (PaaS)**: AWS patches the database engine; you manage access, backups strategy, and parameter groups
- **Lambda (FaaS)**: AWS manages the runtime; you own the code and IAM execution role

**Classic customer mistakes** (not AWS's fault):
- Public S3 buckets with sensitive data
- Overly permissive IAM policies (AdministratorAccess for everything)
- Unpatched EC2 instances (AWS doesn't patch your guest OS)
- No encryption enabled on EBS volumes or RDS
- Secrets stored in EC2 user data or environment variables in plain text

The key insight: moving to cloud doesn't eliminate your security responsibilities — it shifts which layer you're responsible for.`,
            },
            {
              question: "Explain the difference between Regions, Availability Zones, and Edge Locations. How do you design for high availability?",
              difficulty: "junior" as const,
              answer: `**Region**: Geographic area with multiple data centers (e.g., us-east-1 in N. Virginia, eu-west-1 in Ireland). Each region is completely independent — no automatic failover between regions.

**Availability Zone (AZ)**: One or more data centers within a region with independent power, cooling, and networking. Physically separated but connected with low-latency links. Typical region has 3 AZs.

**Edge Location**: CloudFront CDN points of presence. 400+ globally. Cache content close to users. Not where you run compute.

**High availability design:**
\`\`\`
Single AZ: 1 failure point → total outage
Multi-AZ:  Lose 1 of 3 AZs → 67% capacity, no outage
Multi-Region: Lose entire region → failover to DR region (complex)
\`\`\`

**Practical HA patterns:**
- EC2: spread across 3 AZs using Auto Scaling Groups
- RDS: Multi-AZ deployment (synchronous standby, ~60s failover)
- ALB: automatically spans multiple AZs
- S3: automatically stores across 3+ AZs (no config needed)
- DynamoDB: Global Tables for multi-region active-active

**Design target:** Treat AZ failure as routine (it happens). Design for multi-AZ as baseline. Multi-region only when required by compliance (data sovereignty) or RTO/RPO requirements < 1 hour.`,
            },
          ],
        },
        {
          id: "aws-cli-setup",
          title: "AWS CLI Setup & Configuration",
          description: "Install, authenticate, and configure multiple AWS CLI profiles.",
          type: "lesson",
          duration: 14,
          objectives: [
            "Install and configure the AWS CLI v2",
            "Configure named profiles for multiple accounts",
            "Use environment variables for CI authentication",
            "Query AWS resources with JMESPath and jq",
          ],
          content: `## AWS CLI Setup & Configuration

The AWS CLI is the fastest and most scriptable way to interact with AWS. Unlike the console (which requires clicking through menus), the CLI lets you automate repetitive tasks, script deployments, query resources across accounts, and pipe output into other tools. Every DevOps workflow eventually depends on it.

## How the CLI Works

When you run an AWS CLI command, it:
1. Reads your credentials from the credential chain (environment variables → named profile → EC2 instance metadata)
2. Signs the HTTP request using AWS Signature Version 4 (HMAC-SHA256)
3. Sends the signed request to the regional AWS API endpoint (e.g., \`ec2.us-east-1.amazonaws.com\`)
4. Parses the JSON response and formats it according to your \`--output\` flag

Understanding this chain matters because it's the same chain the SDKs (boto3, AWS JS SDK) use — so debugging credential issues follows the same logic everywhere.

---

## Installation

\`\`\`bash
# macOS (Homebrew)
brew install awscli

# macOS (official installer — always latest)
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o AWSCLIV2.pkg
sudo installer -pkg AWSCLIV2.pkg -target /

# Linux (x86_64)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
unzip awscliv2.zip
sudo ./aws/install

# Linux (ARM64 — e.g., Graviton EC2 or Apple Silicon rosetta)
curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o awscliv2.zip
unzip awscliv2.zip
sudo ./aws/install

# Windows (MSI installer)
# Download from: https://awscli.amazonaws.com/AWSCLIV2.msi

# Verify version (should be v2.x)
aws --version
# aws-cli/2.15.0 Python/3.11.6 Linux/5.15.0 botocore/2.x.x

# Enable shell autocomplete (bash)
echo 'complete -C /usr/local/bin/aws_completer aws' >> ~/.bashrc
source ~/.bashrc
\`\`\`

**Why v2?** AWS CLI v2 has improved SSO support, auto-pagination, output streaming, and better error messages. If you're running v1, upgrade — v2 is the active development branch.

---

## Initial Configuration

\`\`\`bash
aws configure
# AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
# AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
# Default region name [None]: us-east-1
# Default output format [None]: json

# This writes two files:
# ~/.aws/credentials  — contains the actual keys (sensitive, never commit this)
# ~/.aws/config       — region, output format, and profile settings
\`\`\`

**What each setting means:**
- \`AWS Access Key ID\` — starts with \`AKIA\` (long-term user key) or \`ASIA\` (temporary/assumed-role key)
- \`AWS Secret Access Key\` — 40-character secret, treat like a password
- \`Default region\` — which AWS region commands run against when you don't specify \`--region\`
- \`Output format\` — \`json\` (machine-readable), \`table\` (human-readable), \`text\` (simple piping), \`yaml\` (new in v2)

---

## Named Profiles (Multiple Accounts)

In practice, you'll work with multiple AWS accounts — separate accounts for dev, staging, and production is a security best practice. Named profiles let you switch between them without changing environment variables.

\`\`\`bash
# Configure separate profiles per environment
aws configure --profile production
aws configure --profile staging
aws configure --profile dev

# ~/.aws/credentials — stores the keys
[default]
aws_access_key_id = AKIA...
aws_secret_access_key = ...

[production]
aws_access_key_id = AKIA...
aws_secret_access_key = ...

[staging]
aws_access_key_id = AKIA...
aws_secret_access_key = ...

# Use a specific profile for a single command
aws s3 ls --profile production

# Set profile for the entire shell session
export AWS_PROFILE=production
aws ec2 describe-instances  # uses production credentials

# Unset to go back to default
unset AWS_PROFILE

# Verify which identity you're using (always do this before destructive ops)
aws sts get-caller-identity
# {
#   "UserId": "AROAIOSFODNN7EXAMPLE:session-name",
#   "Account": "123456789012",
#   "Arn": "arn:aws:iam::123456789012:user/alice"
# }
\`\`\`

**Best practice:** Set \`AWS_PROFILE\` in your shell prompt so you always know which account your commands will affect. Accidentally running a deletion command against production instead of dev is a classic and painful mistake.

---

## SSO Login (Recommended for Teams)

AWS IAM Identity Center (formerly SSO) is the recommended approach for human users in organizations. Instead of long-lived access keys in \`~/.aws/credentials\`, you authenticate via your company's identity provider (Okta, Azure AD, etc.) and get short-lived credentials automatically.

\`\`\`bash
# ~/.aws/config — no secrets here, just configuration
[profile dev-account]
sso_start_url = https://myorg.awsapps.com/start
sso_region = us-east-1
sso_account_id = 123456789012
sso_role_name = DeveloperAccess
region = us-east-1
output = json

[profile prod-account]
sso_start_url = https://myorg.awsapps.com/start
sso_region = us-east-1
sso_account_id = 999999999999
sso_role_name = ReadOnlyAccess   # restricted in production
region = us-east-1

# Login (opens browser to identity provider)
aws sso login --profile dev-account
# Will open: https://myorg.awsapps.com/start#/
# Sign in with Okta/Azure AD/Google — credentials valid for 8 hours

# Now use the profile normally
aws s3 ls --profile dev-account
aws ec2 describe-instances --profile prod-account

# List all available accounts and roles you can access
aws sso list-accounts --access-token $(cat ~/.aws/sso/cache/*.json | jq -r '.accessToken')
\`\`\`

**Why SSO over static keys:**
- Credentials expire automatically (8 hours default, configurable)
- Single sign-on — one login for all accounts
- Revocable — if someone leaves, disable their IdP account, all AWS access is gone
- Auditable — CloudTrail shows the SSO session, not a generic access key ID
- No credential files to accidentally push to GitHub

---

## Environment Variables (for CI/CD)

CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins) cannot use \`aws configure\` because they don't have a home directory or interactive login. Environment variables are the standard approach.

\`\`\`bash
# Standard environment variables — recognized by all AWS SDKs and CLI
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_DEFAULT_REGION="us-east-1"

# For assumed roles (from sts:AssumeRole), you also need:
export AWS_SESSION_TOKEN="IQoJ..."  # temporary token, expires in 1-12 hours

# Verify the identity before running any commands
aws sts get-caller-identity
# Always run this at the start of CI scripts — confirms credentials work
# and tells you which account/role you're operating as

# Credential precedence (highest to lowest):
# 1. Environment variables (AWS_ACCESS_KEY_ID, etc.)
# 2. AWS CLI profile (AWS_PROFILE env var or --profile flag)
# 3. ~/.aws/credentials (named profile matching [default])
# 4. ~/.aws/config
# 5. EC2 instance metadata / ECS task role / Lambda execution role
\`\`\`

**Security note for CI:** Use OIDC federation instead of long-lived keys whenever possible. GitHub Actions, GitLab, and CircleCI all support OIDC — your pipeline gets a short-lived token that exchanges for AWS credentials via \`sts:AssumeRoleWithWebIdentity\`. No keys to rotate, no keys to leak.

\`\`\`yaml
# GitHub Actions OIDC example (no static keys needed):
- uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
    aws-region: us-east-1
    # Automatically calls sts:AssumeRoleWithWebIdentity
    # Credentials are scoped to this workflow run and expire
\`\`\`

---

## Querying with JMESPath & jq

The \`--query\` flag uses JMESPath — a query language for JSON. Mastering it saves enormous time when scripting.

\`\`\`bash
# List all EC2 instances with key fields (JMESPath)
aws ec2 describe-instances \
  --query 'Reservations[*].Instances[*].{
    Name: Tags[?Key==\`Name\`]|[0].Value,
    ID: InstanceId,
    State: State.Name,
    Type: InstanceType,
    AZ: Placement.AvailabilityZone,
    IP: PublicIpAddress
  }' \
  --output table

# Get only running instance IDs (for use in scripts)
RUNNING_IDS=$(aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running" \
  --query 'Reservations[*].Instances[*].InstanceId' \
  --output text)
echo "Running: $RUNNING_IDS"

# JMESPath sort and filter — find largest EBS volumes
aws ec2 describe-volumes \
  --query 'sort_by(Volumes, &Size)[-5:].{ID:VolumeId,Size:Size,State:State}' \
  --output table

# List S3 buckets sorted by creation date (piping to jq)
aws s3api list-buckets \
  | jq '.Buckets | sort_by(.CreationDate) | .[] | .Name'

# Find all Lambda functions with memory over 512MB (jq filter)
aws lambda list-functions \
  | jq '.Functions[] | select(.MemorySize > 512) | {Name:.FunctionName, Memory:.MemorySize}'

# Check costs for last 7 days with daily breakdown
aws ce get-cost-and-usage \
  --time-period Start=$(date -d '7 days ago' +%Y-%m-%d),End=$(date +%Y-%m-%d) \
  --granularity DAILY \
  --metrics BlendedCost \
  --query 'ResultsByTime[*].{Date:TimePeriod.Start,Cost:Total.BlendedCost.Amount}' \
  --output table
\`\`\`

**JMESPath quick reference:**
- \`Reservations[*]\` — all elements of array
- \`Instances[0]\` — first element
- \`Tags[?Key==\`Name\`]|[0].Value\` — filter by key, get value
- \`sort_by(@, &Size)\` — sort by field
- \`[-5:]\` — last 5 elements

---

## Useful CLI Tricks

\`\`\`bash
# Check permissions before running (dry run — EC2 specific)
aws ec2 run-instances --dry-run \
  --image-id ami-12345 \
  --instance-type t3.micro
# Returns: DryRunOperation — you have permission
# Or: UnauthorizedOperation — you don't

# Wait for async operations (blocks until complete)
aws ec2 wait instance-running --instance-ids i-1234567890abcdef0
aws ec2 wait image-available --image-ids ami-12345
aws cloudformation wait stack-create-complete --stack-name my-stack
# Useful in scripts to avoid polling loops

# Auto-pagination — fetches ALL pages automatically
# Without --no-paginate, large result sets are truncated
aws ec2 describe-instances --no-paginate  # get all instances

# Output to file for large responses
aws ec2 describe-instances --output json > all-instances.json

# Get current account ID (useful in scripts)
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "Account: $ACCOUNT_ID"

# Get current region from instance metadata (on EC2)
REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/region)

# Enable debug mode (see raw HTTP requests/responses)
aws s3 ls --debug 2>&1 | head -50

# CLI output to clipboard (macOS)
aws ec2 describe-instances --output table | pbcopy

# Get help for any command
aws s3 cp help          # shows all flags for s3 cp
aws ec2 run-instances help   # exhaustive option list
\`\`\`

---

## Common Pitfalls

**Accidentally targeting the wrong account or region:** Always run \`aws sts get-caller-identity\` before destructive operations. Consider adding it as the first line of deployment scripts.

**Region mismatch:** The CLI uses your configured default region unless you specify \`--region\`. If your resource is in eu-west-1 and your default is us-east-1, commands return empty results — not errors. Always specify \`--region\` in scripts.

**Credential caching with SSO:** SSO credentials cache in \`~/.aws/sso/cache/\`. If you get "Token expired" errors, run \`aws sso login --profile your-profile\` again.

**Output format in scripts:** Use \`--output text\` for simple values (easier to assign to variables), \`--output json\` when you need to process structured data with jq. The \`--output table\` format is only for humans — never parse table output in scripts.`,
        },
        {
          id: "iam-deep-dive",
          title: "IAM Deep Dive",
          description: "Users, groups, roles, policies, and least-privilege patterns.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Create IAM users, groups, and roles via CLI",
            "Write custom IAM policies in JSON",
            "Assume IAM roles with STS",
            "Enforce MFA with IAM condition keys",
            "Use IAM Access Analyzer to find overly permissive policies",
          ],
          content: `## IAM Deep Dive

IAM (Identity and Access Management) is AWS's authorization system — it controls *who* can do *what* to *which* AWS resources. Get IAM wrong and you either expose your entire AWS account or lock out legitimate users. Get it right and it becomes your most powerful security control.

## Why IAM Is Complex (and Why That Complexity Matters)

IAM isn't just "give this user permission to do X." In a real organization, you have hundreds of developers, dozens of services, multiple AWS accounts, CI/CD pipelines, third-party SaaS tools, and automated processes — all needing different, precisely scoped access. IAM handles all of this through a layered evaluation model.

The mental model: **everything is denied by default**. A request to AWS must have an explicit Allow from at least one policy, AND no explicit Deny from any policy, to succeed.

---

## How IAM Policy Evaluation Works (The Algorithm)

This is critical knowledge for both debugging and designing secure systems:

\`\`\`
Request arrives → IAM evaluates in this order:

1. SCP (Service Control Policy) — Does the Organization ALLOW this action?
   → If no Allow in SCP: DENY immediately (cannot be overridden)

2. Resource-based policy — Does the resource (S3 bucket, KMS key) ALLOW this principal?
   → For same-account: Allow here can be sufficient
   → For cross-account: BOTH resource policy AND identity policy must Allow

3. IAM Permissions Boundary — Does the boundary ALLOW this action?
   → Boundaries cap maximum permissions; they don't grant anything
   → Identity policy: {S3:*, EC2:*, IAM:*} + Boundary: {S3:*, EC2:*} = {S3:*, EC2:*}

4. Identity-based policy — Does the IAM user/role's policy ALLOW this?
   → The main policy you think of when you think "IAM policy"

5. Session policy — Is this assumed-role session further restricted?
   → Used when calling sts:AssumeRole with an inline policy

6. Explicit Deny — Does ANY policy DENY this action?
   → DENY wins over ALL Allows, no exceptions
   → An SCP with Deny can block even the root account user
\`\`\`

**The practical implication:** When someone gets AccessDenied, there are 6 places to check, not 1. The \`iam simulate-principal-policy\` command is your best friend for debugging.

---

## Core Concepts

\`\`\`
Users    → individual people or service accounts (long-term credentials, avoid in favor of SSO/roles)
Groups   → collections of users sharing permissions (no direct permissions — policies attach to groups)
Roles    → assumed identities with temporary credentials (EC2, Lambda, CI/CD, cross-account)
Policies → JSON documents defining Allow/Deny rules — attached to users, groups, or roles
\`\`\`

**IAM Principals hierarchy:**
- **Root user** — unrestricted access, should be locked away with hardware MFA, never used day-to-day
- **IAM users** — long-lived credentials, acceptable for human users without SSO, avoid for services
- **IAM roles** — temporary credentials via STS, the correct choice for all service-to-service and CI/CD access
- **Federated identities** — external users (SAML, OIDC) who assume roles without an IAM user

**Always prefer Roles over Users for:**
- EC2 instances (use instance profiles — no keys in the instance)
- Lambda functions (execution roles — no keys in function code)
- GitHub Actions, GitLab CI (OIDC federation — no keys stored anywhere)
- Cross-account access (assume a role in the target account)
- ECS tasks (task roles — separate from the EC2 node role)

---

## Creating IAM Resources via CLI

\`\`\`bash
# Create a user
aws iam create-user --user-name alice

# Create a group and add the user
aws iam create-group --group-name developers
aws iam add-user-to-group --user-name alice --group-name developers

# Create an access key for the user
aws iam create-access-key --user-name alice

# Enable console access (with password)
aws iam create-login-profile --user-name alice \
  --password "TempPass123!" \
  --password-reset-required

# List all users
aws iam list-users --query 'Users[*].{Name:UserName,Created:CreateDate}' --output table
\`\`\`

---

## Writing IAM Policies

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3AppBucket",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::myapp-prod-data",
        "arn:aws:s3:::myapp-prod-data/*"
      ]
    },
    {
      "Sid": "DenyDeleteBucket",
      "Effect": "Deny",
      "Action": "s3:DeleteBucket",
      "Resource": "*"
    }
  ]
}
\`\`\`

\`\`\`bash
# Create and attach a policy
aws iam create-policy \
  --policy-name S3AppBucketAccess \
  --policy-document file://s3-policy.json

aws iam attach-group-policy \
  --group-name developers \
  --policy-arn arn:aws:iam::123456789012:policy/S3AppBucketAccess
\`\`\`

---

## IAM Roles

\`\`\`bash
# Create a role for EC2 instances
cat > trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "ec2.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}
EOF

aws iam create-role \
  --role-name EC2AppRole \
  --assume-role-policy-document file://trust-policy.json

aws iam attach-role-policy \
  --role-name EC2AppRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

# Create instance profile and associate
aws iam create-instance-profile --instance-profile-name EC2AppProfile
aws iam add-role-to-instance-profile \
  --instance-profile-name EC2AppProfile \
  --role-name EC2AppRole
\`\`\`

---

## Assuming Roles with STS

\`\`\`bash
# Assume a role (cross-account or elevated)
aws sts assume-role \
  --role-arn "arn:aws:iam::999999999999:role/ProductionDeploy" \
  --role-session-name "deploy-session-$(date +%s)"

# Use the returned credentials
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="..."

# Or configure in profile
aws configure --profile prod-deploy set role_arn arn:aws:iam::999999999999:role/ProductionDeploy
aws configure --profile prod-deploy set source_profile default
aws s3 ls --profile prod-deploy
\`\`\`

---

## Enforcing MFA

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Deny",
    "Action": "*",
    "Resource": "*",
    "Condition": {
      "BoolIfExists": {
        "aws:MultiFactorAuthPresent": "false"
      }
    }
  }]
}
\`\`\`

---

## Advanced IAM: OIDC Federation for GitHub Actions

The modern approach for CI/CD: no long-lived keys, no secrets to rotate, no risk of credential leakage.

\`\`\`bash
# Step 1: Create the OIDC provider for GitHub Actions
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1

# Step 2: Create a role with a trust policy tied to your GitHub org/repo
cat > github-trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
      },
      "StringLike": {
        "token.actions.githubusercontent.com:sub": "repo:myorg/myrepo:*"
        // Restrict to specific branches: "repo:myorg/myrepo:ref:refs/heads/main"
      }
    }
  }]
}
EOF

aws iam create-role \
  --role-name GitHubActionsDeployRole \
  --assume-role-policy-document file://github-trust-policy.json

aws iam attach-role-policy \
  --role-name GitHubActionsDeployRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess  # scope down for prod
\`\`\`

\`\`\`yaml
# .github/workflows/deploy.yml — no AWS keys needed
- uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsDeployRole
    aws-region: us-east-1
    # GitHub sends a signed JWT, AWS STS verifies it and returns 1-hour credentials
    # Nothing stored, nothing to rotate, nothing to leak
\`\`\`

---

## Permission Boundaries (Delegated Administration)

Permission boundaries solve the problem of letting developers create IAM roles for their services without allowing them to grant themselves unlimited permissions.

\`\`\`json
// Create this as the boundary policy:
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "s3:*",
      "dynamodb:*",
      "lambda:*",
      "logs:*"
    ],
    "Resource": "*"
  }]
}
\`\`\`

\`\`\`bash
# Attach as permission boundary when creating roles:
aws iam create-role \
  --role-name my-service-role \
  --assume-role-policy-document file://trust.json \
  --permissions-boundary arn:aws:iam::123456789012:policy/DeveloperBoundary

# Now even if the developer attaches AdministratorAccess to this role,
# the boundary restricts it to only S3, DynamoDB, Lambda, and CloudWatch Logs.
# They cannot grant themselves EC2, IAM, or billing access.
\`\`\`

**Real-world use:** Netflix uses permission boundaries to let application teams create their own service roles without a centralized IAM team becoming a bottleneck for every service's deployment.

---

## Service Control Policies (SCPs)

SCPs apply at the AWS Organizations level — they're guardrails on entire accounts or organizational units.

\`\`\`bash
# SCP: Deny creation of non-encrypted S3 buckets across entire organization
aws organizations create-policy \
  --type SERVICE_CONTROL_POLICY \
  --name "RequireS3Encryption" \
  --description "Block creation of unencrypted S3 buckets" \
  --content '{
    "Version": "2012-10-17",
    "Statement": [{
      "Sid": "DenyUnencryptedS3",
      "Effect": "Deny",
      "Action": "s3:CreateBucket",
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "s3:x-amz-server-side-encryption": ["AES256", "aws:kms"]
        }
      }
    }]
  }'

# SCP: Lock resources to specific regions (data sovereignty)
# This prevents anyone in the account from launching EC2 in unauthorized regions
\`\`\`

**SCPs vs IAM policies:** SCPs do NOT grant permissions — they only restrict. Even an account root user cannot override an SCP Deny. SCPs are the ultimate guardrail for multi-account organizations.

---

## IAM Access Analyzer

Access Analyzer identifies resources (S3 buckets, IAM roles, KMS keys) that are accessible from outside your account or organization — potential unintended public exposure.

\`\`\`bash
# Create an analyzer
aws accessanalyzer create-analyzer \
  --analyzer-name account-analyzer \
  --type ACCOUNT

# List findings (publicly accessible resources)
aws accessanalyzer list-findings \
  --analyzer-arn arn:aws:access-analyzer:us-east-1:123456789012:analyzer/account-analyzer \
  --query 'findings[*].{Resource:resource,Type:resourceType,Status:status}' \
  --output table

# Generate least-privilege policy from actual CloudTrail usage
# This is the most powerful feature — it reads what actions were actually called
# and generates a minimal policy covering exactly that usage
aws accessanalyzer generate-policy \
  --trail-arn arn:aws:cloudtrail:us-east-1:123456789012:trail/my-trail

# Validate a policy document for syntax and security issues
aws accessanalyzer validate-policy \
  --policy-type IDENTITY_POLICY \
  --policy-document file://my-policy.json \
  --query 'findings[*].{Issue:issueCode,Severity:findingType,Details:learnMoreLink}'
\`\`\`

---

## Common IAM Pitfalls

**Wildcard resources in production policies:** \`"Resource": "*"\` means the permission applies to every resource of that type across your entire account. Use specific ARNs or ARN patterns (\`arn:aws:s3:::myapp-*/*\`) instead.

**Confusing execution role and task role in ECS/Lambda:** The execution role is used by the AWS infrastructure (to pull images, write logs). The task role is used by your application code (to access DynamoDB, S3). Many developers attach application permissions to the execution role and wonder why their app can't call DynamoDB.

**Stale IAM users:** Long-lived access keys that aren't used for 90+ days are a significant security risk. Enable AWS Config rule \`iam-user-unused-credentials-check\` and automate disabling of inactive keys.

**Not enabling CloudTrail:** Without CloudTrail, you have no audit trail of what IAM calls were made. Enable CloudTrail organization-wide as the first thing you do in a new account.

> **Tip:** The AWS Security Reference Architecture (SRA) recommends a dedicated **security tooling account** with cross-account read access. Never run security tooling in the same account as production workloads. GuardDuty, Security Hub, and Config should all aggregate findings into a central security account.`,
          interviewQuestions: [
            {
              question: "What is the difference between an IAM role and an IAM user? When should you use each?",
              difficulty: "junior" as const,
              answer: `**IAM User**: A permanent identity with static credentials (access key ID + secret). Represents a person or a specific service that doesn't support role-based auth.

**IAM Role**: A temporary identity that's assumed by AWS services, users, or external identities. Issues short-lived STS tokens (15 minutes to 12 hours). No stored credentials.

**When to use roles (almost always):**
- EC2 instances needing to access S3/DynamoDB → attach an instance profile (role)
- Lambda functions → execution role
- ECS tasks → task role
- GitHub Actions → OIDC federation (no stored credentials at all)
- Cross-account access

**When IAM users are acceptable:**
- Human users (but prefer AWS SSO/IAM Identity Center)
- Legacy CI/CD systems that don't support OIDC

**Why roles are better:**
\`\`\`bash
# IAM User credentials: static, must be manually rotated, can be leaked in code
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE  # never expires unless you delete it

# Role credentials: temporary, auto-rotating
aws_session_token=IQoJ...  # expires in 1-12 hours
\`\`\`

**Best practice:** Zero long-lived access keys. Use IAM Identity Center for humans (SSO), OIDC for CI/CD (GitHub Actions, GitLab), and instance profiles/task roles for compute.`,
            },
            {
              question: "Explain IAM policy evaluation logic. How does AWS determine if a request is allowed or denied?",
              difficulty: "senior" as const,
              answer: `AWS policy evaluation is **deny by default** — a request must have explicit Allow and no explicit Deny to succeed.

**Evaluation order (all must pass):**
1. **SCP (Service Control Policy)** — Organizations guardrail, must allow the action
2. **Resource-based policy** — For same-account access, an explicit Allow here can be sufficient
3. **Identity-based policy** — Must Allow the action
4. **Permissions boundary** — Caps what identity-based policies can grant (intersection)
5. **Session policy** — Further restricts assumed-role sessions
6. **Explicit Deny** — Any explicit Deny anywhere = DENY (cannot be overridden)

**Key insight — explicit Deny is absolute:**
\`\`\`json
// SCP denies s3:DeleteObject organization-wide
// Even if an IAM admin policy allows s3:*, they cannot delete objects
// The SCP Deny wins
\`\`\`

**Cross-account access requires trust on BOTH sides:**
\`\`\`
Account A has IAM user → needs sts:AssumeRole permission in Account A
Account B has the role → trust policy must allow Account A to assume it
\`\`\`

**Permissions boundaries (for delegation):**
\`\`\`
Boundary allows: EC2, S3
IAM policy allows: EC2, S3, IAM
Effective permissions: EC2, S3 (intersection)
\`\`\`
Use case: Allow developers to create IAM roles for their services without them being able to grant themselves arbitrary permissions.

**Practical debugging:**
\`\`\`bash
# Use IAM Policy Simulator:
aws iam simulate-principal-policy \\
  --policy-source-arn arn:aws:iam::123456789:role/my-role \\
  --action-names s3:GetObject \\
  --resource-arns arn:aws:s3:::my-bucket/*
\`\`\``,
            },
          ],
        },
      ],
      exam: [
        { question: "A new developer on your team needs read-only access to S3 and EC2. What is the most secure IAM approach?", answer: "Create an IAM group with read-only managed policies for S3 and EC2 (AmazonS3ReadOnlyAccess, AmazonEC2ReadOnlyAccess), then add the user to that group. Never share root account credentials or attach policies directly to users — groups make permission management scalable.", difficulty: "junior" as const },
        { question: "An IAM user has an S3 full-access policy attached but still gets AccessDenied on a specific bucket. What are the likely causes?", answer: "1) A bucket policy on that S3 bucket explicitly denies the user or their account. 2) An SCP (Service Control Policy) at the organization level is blocking S3 access. 3) The bucket uses a resource-based policy that only allows specific principals. 4) The object is in a different account and the cross-account trust is misconfigured. Explicit Deny in any policy always wins.", difficulty: "mid" as const },
        { question: "You need to give an EC2 instance permission to write to an S3 bucket. How do you do this securely?", answer: "Create an IAM role with an S3 write policy, attach the role to the EC2 instance as an instance profile. The AWS SDK on the instance automatically retrieves temporary credentials from the instance metadata service (IMDS). Never hardcode access keys on EC2 instances — keys can be leaked via the filesystem or code repository.", difficulty: "junior" as const },
        { question: "Your company requires all AWS CLI operations to use MFA. How do you enforce this and how do developers get temporary credentials?", answer: "Add a Condition to IAM policies requiring aws:MultiFactorAuthPresent: true. Developers use 'aws sts get-session-token --serial-number arn:aws:iam::ACCOUNT:mfa/USERNAME --token-code 123456' to get temporary credentials (Access Key ID, Secret Key, Session Token) valid for up to 12 hours, then export them as environment variables or use aws configure with a named profile.", difficulty: "mid" as const },
        { question: "What is the AWS shared responsibility model and how does it affect EC2 vs RDS security?", answer: "AWS secures the infrastructure (hardware, network, hypervisor, physical facilities). For EC2 (IaaS), you own OS patching, application security, security group rules, and data encryption. For RDS (managed service), AWS patches the database engine and OS — you own network controls, IAM access, and encrypting data at rest/in transit. The higher the abstraction level, the less you manage.", difficulty: "junior" as const },
        { question: "A junior engineer accidentally deleted the wrong CloudFormation stack, removing production resources. What controls should have been in place?", answer: "1) Enable CloudFormation termination protection on production stacks. 2) Use IAM policies with Deny on cloudformation:DeleteStack for non-admin roles. 3) Add SCPs to prevent deletions in production accounts. 4) Separate production into its own AWS account (multi-account strategy). 5) Enable AWS Config to record all configuration changes and set up alerts for resource deletions.", difficulty: "senior" as const },
        { question: "How do you configure the AWS CLI to use different credentials for different projects?", answer: "Use named profiles in ~/.aws/credentials and ~/.aws/config. Run 'aws configure --profile myproject' to set up a profile, then use 'aws s3 ls --profile myproject' or set 'export AWS_PROFILE=myproject'. For cross-account access, create a profile with role_arn and source_profile so the CLI automatically assumes the role using STS.", difficulty: "junior" as const },
        { question: "An attacker gained access to an IAM access key. What immediate steps do you take?", answer: "1) Immediately deactivate the compromised key via IAM console or 'aws iam update-access-key --status Inactive'. 2) Check CloudTrail logs to identify all API calls made with that key. 3) Revoke any resources created by the attacker. 4) Check for unauthorized IAM users, roles, or policies created. 5) Delete the compromised key and create a new one. 6) Review and revoke any active sessions via sts:invalidate. 7) Rotate all other credentials as precaution.", difficulty: "senior" as const },
        { question: "What is the difference between an IAM role's trust policy and its permissions policy?", answer: "The trust policy (resource-based policy on the role) defines WHO can assume the role — it specifies trusted principals like EC2 service, another AWS account, or an OIDC provider. The permissions policy defines WHAT the role can do once assumed — which AWS actions and resources are allowed. Both must be configured correctly for cross-account or service access to work.", difficulty: "mid" as const },
        { question: "Your organization is expanding to three new AWS regions. How do you decide which region to use for each workload?", answer: "Evaluate: 1) Data residency — GDPR requires EU regions for EU personal data, HIPAA may require specific regions. 2) Latency — use latency-based routing tests or CloudPing to measure RTT to your users. 3) Service availability — check the AWS regional services list; newer services launch in us-east-1 first. 4) Cost — prices vary 10-30% between regions; use the AWS Pricing Calculator. 5) Disaster recovery — pair regions geographically (e.g., us-east-1 + us-west-2).", difficulty: "mid" as const },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 2 — Compute
    // ─────────────────────────────────────────
    {
      id: "aws-compute",
      title: "Compute: EC2 & Lambda",
      description: "Virtual machines, auto scaling, and serverless functions.",
      level: "beginner",
      lessons: [
        {
          id: "ec2-fundamentals",
          title: "EC2 Fundamentals",
          description: "Launch, configure, and connect to EC2 instances. AMIs, key pairs, and user data.",
          type: "lesson",
          duration: 22,
          objectives: [
            "Launch an EC2 instance via CLI with all required parameters",
            "Connect via SSH and Session Manager",
            "Create and use custom AMIs",
            "Configure Auto Scaling Groups with Launch Templates",
          ],
          content: `## EC2 Fundamentals

EC2 (Elastic Compute Cloud) provides resizable virtual machines in AWS. Despite the rise of containers and serverless, EC2 remains the most widely used AWS compute service — and understanding it deeply is essential because ECS, EKS, and many managed services run on EC2 under the hood.

## How EC2 Works Internally

When you launch an EC2 instance, AWS:
1. Selects a physical host server in the AZ you specified
2. Creates a virtual machine using the Nitro hypervisor (AWS's custom hardware-based hypervisor, offering near bare-metal performance)
3. Attaches network interfaces (ENIs) with IPs from your subnet's CIDR
4. Attaches EBS volumes over the NVMe-over-fabric network (appears as a local disk)
5. Makes the instance metadata service (IMDS) available at \`169.254.169.254\`
6. Runs your User Data script as root

**The Nitro System** is important to understand: AWS replaced the Xen hypervisor with Nitro in 2017. Nitro offloads hypervisor functions to dedicated hardware, meaning your EC2 instance gets near-100% of the host's CPU and memory. A c5.xlarge with 4 vCPUs gets genuine 4 vCPUs, not virtualized overhead.

## EC2 Instance Families — When to Use Each

\`\`\`
T-family (t3, t4g): Burstable CPU — CPU credits accumulate during idle time
  Use for: dev/test, low-traffic web servers, microservices with variable load
  Avoid for: sustained 100% CPU workloads (you'll exhaust credits and throttle)
  t4g uses ARM Graviton3 (20% cheaper, often faster for web workloads)

M-family (m6i, m7g): General purpose — balanced CPU/memory ratio (1:4)
  Use for: app servers, web backends, small databases
  m7g (Graviton3) is the best general-purpose choice for most new workloads

C-family (c6i, c7g): Compute optimized — high CPU, less memory (1:2 ratio)
  Use for: CPU-intensive compute, batch processing, gaming servers, ad serving
  c6i is Intel Ice Lake; c6a is AMD EPYC (10% cheaper than c6i, similar performance)

R-family (r6i, r7g): Memory optimized — high memory (1:8 ratio)
  Use for: in-memory databases (Redis), SAP HANA, large caches, ML inference

I-family (i3, i4i): Storage optimized — local NVMe SSD
  Use for: databases needing very low latency I/O (Cassandra, MongoDB, MySQL)
  Note: local NVMe is ephemeral — lost when instance stops. Use for temp data or replicated data

G-family (g4dn, g5): GPU compute — NVIDIA T4/A10G
  Use for: ML inference, video encoding, graphics rendering, CUDA workloads

P-family (p3, p4d): GPU training — NVIDIA V100/A100
  Use for: ML/DL training, scientific simulation (most powerful and most expensive)

X-family (x1e, x2gd): Extreme memory — up to 24TB RAM
  Use for: SAP HANA, large in-memory analytics, very large caches
\`\`\`

## EC2 Purchasing Options — Cost Optimization

\`\`\`
On-Demand:
  Pay by the second (Linux) or hour (Windows)
  No commitment, highest price
  Use for: unpredictable workloads, dev/test, short-lived jobs

Reserved Instances (Standard/Convertible):
  1-year or 3-year commitment → 30-60% savings vs On-Demand
  Standard: locked to instance family/region (best savings, least flexible)
  Convertible: can change instance type within family (fewer savings, more flexible)
  Use for: steady-state production workloads you'll run 24/7 for 12+ months

Savings Plans (Compute/EC2):
  Commitment to $ per hour, flexible across instance types, AZs, regions
  Compute Savings Plans: apply to EC2, Fargate, Lambda (most flexible)
  Use for: mixed compute workloads where instance types vary

Spot Instances:
  Use spare EC2 capacity → up to 90% savings
  AWS can reclaim with 2-minute warning (Spot interruption)
  Use for: fault-tolerant batch jobs, ML training, CI/CD build agents
  Avoid for: databases, anything that can't handle sudden termination
  Spot capacity pools by AZ and instance type — use Spot Fleet for diversification

Dedicated Hosts:
  Physical server reserved for your account
  Required for: BYOL (Bring Your Own License) for Oracle, Windows Server
  Use for: compliance requirements (dedicated hardware), software licensing
\`\`\`

---

## Launching an Instance via CLI

\`\`\`bash
# Get the latest Amazon Linux 2023 AMI ID
AMI_ID=$(aws ec2 describe-images \
  --owners amazon \
  --filters "Name=name,Values=al2023-ami-*-x86_64" \
            "Name=state,Values=available" \
  --query 'sort_by(Images,&CreationDate)[-1].ImageId' \
  --output text)

echo "Using AMI: \$AMI_ID"

# Create a key pair
aws ec2 create-key-pair \
  --key-name my-key \
  --query 'KeyMaterial' \
  --output text > my-key.pem
chmod 400 my-key.pem

# Launch an instance
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id \$AMI_ID \
  --instance-type t3.micro \
  --key-name my-key \
  --security-group-ids sg-0123456789abcdef0 \
  --subnet-id subnet-0123456789abcdef0 \
  --iam-instance-profile Name=EC2AppProfile \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=my-server},{Key=Env,Value=dev}]' \
  --user-data file://init.sh \
  --query 'Instances[0].InstanceId' \
  --output text)

echo "Launched: \$INSTANCE_ID"

# Wait until running
aws ec2 wait instance-running --instance-ids \$INSTANCE_ID

# Get public IP
aws ec2 describe-instances \
  --instance-ids \$INSTANCE_ID \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text
\`\`\`

---

## User Data Script (Bootstrap)

\`\`\`bash
# init.sh — runs as root on first boot
#!/bin/bash
yum update -y
yum install -y nginx git

systemctl enable nginx
systemctl start nginx

# Install CloudWatch agent
yum install -y amazon-cloudwatch-agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 -c ssm:/cloudwatch-config -s
\`\`\`

---

## Connecting to Instances

\`\`\`bash
# SSH (requires public IP + open port 22)
ssh -i my-key.pem ec2-user@<public-ip>

# Session Manager (no SSH, no open ports needed — preferred)
aws ssm start-session --target \$INSTANCE_ID

# Port forwarding via SSM (no bastion needed)
aws ssm start-session \
  --target \$INSTANCE_ID \
  --document-name AWS-StartPortForwardingSession \
  --parameters '{"portNumber":["5432"],"localPortNumber":["15432"]}'
# Now connect to localhost:15432 → forwards to RDS on port 5432
\`\`\`

---

## Creating a Custom AMI

\`\`\`bash
# Snapshot a running instance
AMI_ID=$(aws ec2 create-image \
  --instance-id \$INSTANCE_ID \
  --name "myapp-base-$(date +%Y%m%d)" \
  --description "Pre-configured app server" \
  --no-reboot \
  --query 'ImageId' \
  --output text)

aws ec2 wait image-available --image-ids \$AMI_ID
echo "AMI ready: \$AMI_ID"
\`\`\`

---

## Auto Scaling Groups

\`\`\`bash
# Create a Launch Template
aws ec2 create-launch-template \
  --launch-template-name my-app-lt \
  --version-description "v1" \
  --launch-template-data '{
    "ImageId": "ami-0123456789abcdef0",
    "InstanceType": "t3.small",
    "IamInstanceProfile": {"Name": "EC2AppProfile"},
    "SecurityGroupIds": ["sg-0123456789abcdef0"],
    "UserData": "'$(base64 -w0 init.sh)'"
  }'

# Create the Auto Scaling Group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name my-app-asg \
  --launch-template "LaunchTemplateName=my-app-lt,Version=\$Latest" \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2 \
  --vpc-zone-identifier "subnet-aaa,subnet-bbb" \
  --target-group-arns arn:aws:elasticloadbalancing:...

# Scale manually
aws autoscaling set-desired-capacity \
  --auto-scaling-group-name my-app-asg \
  --desired-capacity 4
\`\`\`

---

## Instance Metadata Service (IMDS)

The IMDS is an HTTP endpoint available at \`169.254.169.254\` from inside every EC2 instance. It provides instance identity, network configuration, and — critically — temporary credentials from the attached IAM role.

\`\`\`bash
# Inside an EC2 instance:

# Get instance ID
curl http://169.254.169.254/latest/meta-data/instance-id

# Get the current region
curl http://169.254.169.254/latest/meta-data/placement/region

# Get IAM role credentials (used by AWS SDKs automatically)
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/EC2AppRole
# Returns: AccessKeyId, SecretAccessKey, Token (expiring, auto-rotated)

# IMDSv2 (more secure — requires a token, prevents SSRF attacks)
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/instance-id
\`\`\`

**IMDSv2 is important:** The 2019 Capital One breach involved an SSRF attack that used the IMDS to steal IAM credentials from an EC2 instance. IMDSv2 adds a token requirement that makes SSRF-based credential theft much harder. Enforce IMDSv2:

\`\`\`bash
# Require IMDSv2 (disables v1) on a running instance
aws ec2 modify-instance-metadata-options \
  --instance-id $INSTANCE_ID \
  --http-endpoint enabled \
  --http-tokens required  # 'optional' allows v1, 'required' enforces v2

# Enforce at launch via Launch Template
aws ec2 create-launch-template \
  --launch-template-name my-app-lt \
  --launch-template-data '{
    "MetadataOptions": {
      "HttpEndpoint": "enabled",
      "HttpTokens": "required"
    }
  }'
\`\`\`

---

## Placement Groups

Placement groups control how instances are physically placed on hardware — important for performance and availability.

\`\`\`bash
# Cluster placement group: all instances on same rack
# Lowest latency (sub-millisecond), 10/25 Gbps enhanced networking
# Risk: single rack failure takes all instances
aws ec2 create-placement-group \
  --group-name hpc-cluster \
  --strategy cluster
# Use for: HPC, MPI workloads, ML training with NVLink, low-latency trading

# Spread placement group: each instance on different rack
# Maximum isolation — rack failure only kills one instance
aws ec2 create-placement-group \
  --group-name critical-services \
  --strategy spread
# Use for: small groups of critical instances you can't afford to lose simultaneously
# Limit: max 7 instances per AZ per group

# Partition placement group: groups of instances, each group on different rack
aws ec2 create-placement-group \
  --group-name cassandra-cluster \
  --strategy partition \
  --partition-count 3
# Use for: distributed storage (HDFS, Cassandra, Kafka) where you want rack awareness
\`\`\`

---

## Common CLI Operations

\`\`\`bash
# Stop / start / terminate
aws ec2 stop-instances --instance-ids $INSTANCE_ID
aws ec2 start-instances --instance-ids $INSTANCE_ID
aws ec2 terminate-instances --instance-ids $INSTANCE_ID
# Note: stop preserves the instance (data on EBS volumes survives)
# terminate destroys it permanently (EBS deleted unless DeleteOnTermination=false)

# List all instances in a table
aws ec2 describe-instances \
  --query 'Reservations[*].Instances[*].{
    Name:Tags[?Key==\`Name\`]|[0].Value,
    ID:InstanceId,State:State.Name,Type:InstanceType,AZ:Placement.AvailabilityZone
  }' --output table

# Find all instances with no Name tag (common hygiene issue)
aws ec2 describe-instances \
  --query 'Reservations[*].Instances[?!Tags || !Tags[?Key==\`Name\`]].InstanceId' \
  --output text

# Get current spot prices
aws ec2 describe-spot-price-history \
  --instance-types m5.xlarge m5.2xlarge \
  --product-descriptions "Linux/UNIX" \
  --start-time $(date -u +"%Y-%m-%dT%H:%M:%S") \
  --query 'SpotPriceHistory[*].{Type:InstanceType,Price:SpotPrice,AZ:AvailabilityZone}' \
  --output table

# Describe instance type specs (vCPU, memory, network)
aws ec2 describe-instance-types \
  --instance-types m5.xlarge c5.xlarge r5.xlarge \
  --query 'InstanceTypes[*].{
    Type:InstanceType,
    vCPU:VCpuInfo.DefaultVCpus,
    MemoryGiB:MemoryInfo.SizeInMiB,
    NetworkGbps:NetworkInfo.NetworkPerformance
  }' --output table
\`\`\`

---

## Common EC2 Pitfalls

**Using t3 in production under sustained CPU load:** T-family instances earn CPU credits when idle and spend them under load. When credits are exhausted, CPU is throttled to 5-20% of baseline. Monitor \`CPUCreditBalance\` in CloudWatch. If it consistently hits zero, switch to a fixed-performance family (m5, c5).

**Forgetting to configure DeleteOnTermination for EBS:** By default the root volume is deleted on termination, but additional volumes are not. Check your launch configuration and ensure you're not accumulating unattached EBS volumes.

**Ignoring Spot interruptions in batch processing:** Spot instances can be reclaimed with only a 2-minute warning. Use spot interruption handlers (check \`http://169.254.169.254/latest/meta-data/spot/termination-time\`) to checkpoint work before the instance is taken.

**Not using the Nitro-based instance types:** Older instance types (t2, m4, c4) use the legacy Xen hypervisor and have lower EBS and network performance ceilings. Always prefer the current generation (t3/t4g, m5/m6i/m7g, c5/c6i) for new workloads.`,
        },
        {
          id: "lambda-serverless",
          title: "Lambda & Serverless",
          description: "Functions, triggers, layers, concurrency, and deploying with SAM.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Deploy a Lambda function via CLI",
            "Configure triggers (API Gateway, S3, SQS, EventBridge)",
            "Use Lambda Layers for shared dependencies",
            "Monitor Lambda with CloudWatch Logs and X-Ray",
          ],
          content: `## Lambda & Serverless

Lambda is AWS's Function-as-a-Service (FaaS) platform. You write code, Lambda handles everything else — servers, OS, runtime, scaling, and high availability. You pay per invocation and per millisecond of execution time. At zero traffic, you pay nothing.

## How Lambda Works Under the Hood

When Lambda receives an invocation request, here's what happens:

\`\`\`
1. Request arrives → Lambda Service picks it up

2. Check for warm execution environment:
   - Warm: your handler is invoked immediately (~1ms overhead)
   - Cold: proceed to steps 3-5 (adds latency)

3. Cold start:
   a. Provision a microVM (Firecracker — AWS's open-source microVM)
   b. Download your deployment package (from S3)
   c. Start the runtime (Node.js, Python, Java JVM, etc.)
   d. Run your INIT code (code outside the handler function)
   e. Invoke your handler

4. After invocation: environment kept alive for ~5-15 minutes
   - Next invocation within this window = warm start (reuses everything)
   - init code does NOT re-run on warm invocations
   - Global variables, DB connections persist between warm invocations
\`\`\`

**Lambda Execution Model:**
\`\`\`
Each concurrent invocation = separate execution environment
100 simultaneous requests = 100 environments (if none are warm)
                          = potentially 100 cold starts

Lambda concurrency limits:
- Default: 1,000 concurrent executions per account per region
- Reserved concurrency: cap a function to N concurrent (protect downstream systems)
- Provisioned concurrency: pre-warm N environments (eliminates cold starts, costs $)
\`\`\`

**Memory and CPU:** Lambda allocates CPU proportionally to memory. At 128MB you get ~0.1 vCPU. At 1,769MB you get exactly 1 full vCPU. At 3,008MB you get ~1.7 vCPU. For CPU-intensive work, increase memory even if you don't need the RAM — you get more CPU.

## Cold Starts in Detail

Cold start latency depends on runtime and package size:

| Runtime | Typical Cold Start | Notes |
|---------|-------------------|-------|
| Node.js (18/20) | 100–300ms | Fast, V8 JIT helps |
| Python (3.11/3.12) | 100–400ms | Fast for small packages |
| Go | 50–100ms | Fastest startup |
| Java (Corretto 17) | 1,000–3,000ms | JVM startup is slow |
| Java with SnapStart | 200–500ms | JVM snapshot at publish time |
| .NET (dotnet8) | 300–800ms | Moderate |

**Strategies to minimize cold starts:**
1. **Provisioned Concurrency** — pre-warms N environments, you pay whether invoked or not
2. **Lambda SnapStart** (Java only) — snapshots initialized JVM, restores on cold start
3. **Smaller packages** — less to download and parse
4. **Keep init code minimal** — heavy imports outside handler still run on cold start
5. **Stay in a single runtime** — mixing runtimes in a Layer can cause re-initialization

---

## Deploying a Function via CLI

\`\`\`bash
# Create the function code
cat > index.mjs << 'EOF'
export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda!' }),
  };
};
EOF

# Package it
zip function.zip index.mjs

# Create the function
aws lambda create-function \
  --function-name my-api-handler \
  --runtime nodejs20.x \
  --role arn:aws:iam::123456789012:role/LambdaExecutionRole \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 256 \
  --environment Variables='{DB_HOST=mydb.cluster.amazonaws.com,LOG_LEVEL=info}'

# Test invoke
aws lambda invoke \
  --function-name my-api-handler \
  --payload '{"key": "value"}' \
  --cli-binary-format raw-in-base64-out \
  response.json
cat response.json

# Update function code
zip function.zip index.mjs
aws lambda update-function-code \
  --function-name my-api-handler \
  --zip-file fileb://function.zip

# Publish a version
aws lambda publish-version --function-name my-api-handler

# Create an alias (for blue/green deployments)
aws lambda create-alias \
  --function-name my-api-handler \
  --name production \
  --function-version 5 \
  --routing-config AdditionalVersionWeights={"4"=0.1}  # 10% to v4, 90% to v5
\`\`\`

---

## Common Triggers

\`\`\`bash
# API Gateway trigger (HTTP endpoint)
aws apigatewayv2 create-api \
  --name my-api \
  --protocol-type HTTP \
  --target arn:aws:lambda:us-east-1:123456789012:function:my-api-handler

# S3 trigger (process uploads)
aws s3api put-bucket-notification-configuration \
  --bucket my-uploads-bucket \
  --notification-configuration '{
    "LambdaFunctionConfigurations": [{
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:123456789012:function:process-upload",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {"Key": {"FilterRules": [{"Name": "suffix","Value": ".jpg"}]}}
    }]
  }'

# SQS trigger (message queue processing)
aws lambda create-event-source-mapping \
  --function-name process-orders \
  --event-source-arn arn:aws:sqs:us-east-1:123456789012:orders-queue \
  --batch-size 10 \
  --bisect-batch-on-function-error

# EventBridge rule (cron schedule)
aws events put-rule \
  --name daily-cleanup \
  --schedule-expression "cron(0 2 * * ? *)"  # 2 AM UTC daily

aws events put-targets \
  --rule daily-cleanup \
  --targets 'Id=cleanup-fn,Arn=arn:aws:lambda:us-east-1:123456789012:function:daily-cleanup'
\`\`\`

---

## Lambda Layers

Layers share code (libraries, runtimes, data) across functions.

\`\`\`bash
# Create a layer with node_modules
mkdir -p nodejs
npm install --prefix nodejs aws-sdk lodash
zip -r layer.zip nodejs/

aws lambda publish-layer-version \
  --layer-name shared-deps \
  --compatible-runtimes nodejs20.x \
  --zip-file fileb://layer.zip

# Attach the layer to a function
aws lambda update-function-configuration \
  --function-name my-api-handler \
  --layers arn:aws:lambda:us-east-1:123456789012:layer:shared-deps:1
\`\`\`

---

## Lambda Destinations and Error Handling

\`\`\`bash
# Configure async invocation destinations (where to send success/failure)
aws lambda put-function-event-invoke-config \
  --function-name my-processor \
  --maximum-retry-attempts 2 \
  --maximum-event-age-in-seconds 3600 \
  --destination-config '{
    "OnSuccess": {
      "Destination": "arn:aws:sqs:us-east-1:123456789012:success-queue"
    },
    "OnFailure": {
      "Destination": "arn:aws:sqs:us-east-1:123456789012:dead-letter-queue"
    }
  }'
# Async invocations retry up to 2 times automatically
# After all retries, the event goes to the failure destination
# Destinations are better than Dead Letter Queues (DLQs) — they include the response
\`\`\`

---

## Concurrency Control

\`\`\`bash
# Reserved concurrency: cap this function to 100 concurrent executions
# Protects downstream services (DB, API) from Lambda fan-out
aws lambda put-function-concurrency \
  --function-name my-api-handler \
  --reserved-concurrent-executions 100
# Side effect: this function cannot exceed 100, even if account limit is 1000
# Setting to 0 effectively disables the function (useful for emergency shutoff)

# Provisioned concurrency: pre-warm 10 execution environments
# These stay warm, eliminating cold starts for these 10 concurrent invocations
aws lambda put-provisioned-concurrency-config \
  --function-name my-api-handler \
  --qualifier production \  # attach to alias, not $LATEST
  --provisioned-concurrent-executions 10
# Cost: you pay for 10 environments whether or not they're invoked

# Check concurrency usage
aws lambda get-account-settings \
  --query '{TotalConcurrency:AccountLimit.ConcurrentExecutions,UnreservedConcurrency:AccountLimit.UnreservedConcurrentExecutions}'
\`\`\`

---

## Monitoring & Debugging

\`\`\`bash
# Tail live logs (very useful during development)
aws logs tail /aws/lambda/my-api-handler --follow

# Get last 5 minutes of error logs
aws logs filter-log-events \
  --log-group-name /aws/lambda/my-api-handler \
  --start-time $(date -d '5 minutes ago' +%s)000 \
  --filter-pattern "ERROR"

# View concurrency metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name ConcurrentExecutions \
  --dimensions Name=FunctionName,Value=my-api-handler \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 60 \
  --statistics Maximum

# Lambda Power Tuning — find optimal memory for cost vs speed
# Run the open-source AWS Lambda Power Tuning tool (Step Functions state machine)
# It runs your function at different memory levels and plots cost/performance
# Typical finding: a function at 128MB might be 3x slower but 2x more expensive
# than the same function at 512MB (because it runs 3x longer)

# Check init duration (cold start time) in logs
aws logs filter-log-events \
  --log-group-name /aws/lambda/my-api-handler \
  --filter-pattern "REPORT" \
  --query 'events[*].message' \
  --output text | grep "Init Duration"
# REPORT: Duration: 234ms | Init Duration: 312ms ← cold start happened
# REPORT: Duration: 12ms  ← no Init Duration = warm start
\`\`\`

---

## Lambda Common Pitfalls

**Opening DB connections inside the handler:** Every cold start AND every warm invocation opens a new connection. A Lambda function under load can exhaust your RDS connection pool in seconds. Always open the connection outside the handler (in the init phase) so it's reused across warm invocations. Or better, use **RDS Proxy** which pools connections on your behalf.

**Lambda inside a VPC without a NAT Gateway:** Lambda in a VPC cannot reach the internet (for external APIs) or AWS services without either a NAT Gateway or VPC endpoints. Many developers are surprised to find their Lambda can't call the Stripe API or SendGrid because they added it to a VPC for RDS access without thinking about outbound connectivity.

**Memory/timeout defaults:** Default memory is 128MB and default timeout is 3 seconds. Both are far too low for most real workloads. Set memory based on your function's needs and test timeout by timing actual invocations.

**Not pinning function versions in production:** If your ECS task or API Gateway references \`$LATEST\`, any code update immediately affects production with no canary period. Use versioned aliases (\`production\`, \`staging\`) and deploy to staging first.

> **Tip:** Use **Provisioned Concurrency** for latency-sensitive APIs — it pre-warms Lambda instances and eliminates cold starts. Enable it for your \`production\` alias, not the function itself, so it doesn't slow deployments.`,
          interviewQuestions: [
            {
              question: "Explain Lambda cold starts — when do they happen and how do you minimize them?",
              difficulty: "mid" as const,
              answer: `A cold start happens when Lambda must initialize a new execution environment: first invocation after idle, concurrent requests beyond warm environments, or after deployment.

**Cold start anatomy:**
\`\`\`
Total = [Download code] + [Init runtime] + [Run init code] + [Handle request]
           ~50-200ms         ~100-500ms       Your code          ~1ms
\`\`\`

**Runtime comparison:** Python/Node.js: 100–300ms total. Java (JVM): 1–5 seconds. Go: 50–100ms.

**Mitigation strategies:**

1. **Provisioned Concurrency** — pre-warms N environments:
\`\`\`bash
aws lambda put-provisioned-concurrency-config \\
  --function-name my-api --qualifier prod \\
  --provisioned-concurrent-executions 10
# 10 always-warm environments. Cost: charged even when idle.
\`\`\`

2. **Lambda SnapStart (Java)** — snapshot of initialized JVM:
\`\`\`bash
aws lambda update-function-configuration \\
  --function-name my-java-fn \\
  --snap-start ApplyOn=PublishedVersions
# Reduces Java cold starts: 5s → ~200ms
\`\`\`

3. **Keep init code outside handler** — runs once per cold start:
\`\`\`python
import boto3
# This runs ONCE and is reused across warm invocations:
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('my-table')

def handler(event, context):
    return table.get_item(Key={'id': event['id']})
\`\`\`

4. **Small packages** — less code to download and parse
5. **Choose fast runtimes** — Python/Node.js/Go over Java for latency-sensitive

**Rule of thumb:** For synchronous APIs (ALB/API Gateway), cold starts matter. For async processing (SQS, S3 events), a 1s cold start is irrelevant.`,
            },
            {
              question: "When would you use Lambda vs. EC2 vs. ECS/Fargate for running application logic?",
              difficulty: "mid" as const,
              answer: `**Lambda:**
✅ Event-driven, sporadic traffic
✅ Short-duration tasks (< 15 min)
✅ Auto-scale to zero (no traffic = no cost)
✅ No server management
❌ Cold starts for latency-sensitive APIs
❌ 15-minute max execution time
❌ Limited to 10GB memory, 6 vCPUs

Use for: API handlers, file processing triggers, scheduled jobs, event fanout

**ECS/Fargate:**
✅ Consistent traffic patterns
✅ Long-running tasks
✅ Container workloads, predictable scaling
✅ No EC2 management (Fargate)
❌ Minimum billing unit is per-second (no scale-to-zero by default)

Use for: Microservices, web APIs with consistent load, batch jobs > 15 min, ML inference

**EC2:**
✅ Maximum control (GPU, specific instance types, bare metal)
✅ Lowest cost at scale (spot instances, reserved)
✅ Stateful workloads (databases, caches)
❌ You manage OS, patching, AMIs
❌ Manual scaling (with ASG but more complex)

Use for: Databases, high-compute ML training, workloads needing specific hardware, cost-optimized at scale

**Decision tree:**
- Sporadic/event-driven + < 15 min → Lambda
- Containers + consistent load → Fargate
- Need GPU/specific hardware or maximum cost efficiency → EC2`,
            },
          ],
        },
      ],
      exam: [
        { question: "Your EC2 instance in a private subnet cannot reach the internet to download yum updates. What is likely wrong and how do you fix it?", answer: "The private subnet's route table is missing a route to a NAT Gateway (or NAT instance). Fix: 1) Ensure a NAT Gateway exists in a public subnet with an Elastic IP. 2) Add a route in the private subnet's route table: destination 0.0.0.0/0 → target nat-gw-id. 3) Verify the NAT Gateway's security group/NACL allows outbound traffic. Also check that the security group on the EC2 instance allows outbound HTTPS (port 443).", difficulty: "junior" as const },
        { question: "A production EC2 instance is showing 100% CPU for the last 30 minutes. Walk through your response.", answer: "1) Check CloudWatch metrics to confirm and see if it's a spike or sustained. 2) SSH in and run 'top' or 'htop' to identify the offending process. 3) Check application logs for errors or runaway loops. 4) If it's a web server, check connections: 'netstat -an | grep ESTABLISHED | wc -l'. 5) Consider horizontal scaling — add instances to the ASG manually or trigger a scale-out policy. 6) If needed, take a snapshot and terminate the instance after replacing it. 7) Post-incident: set CloudWatch alarm on CPU > 80% for 5 minutes to alert early next time.", difficulty: "mid" as const },
        { question: "Your Lambda function times out after 3 seconds on every invocation. What do you investigate first?", answer: "1) Check if the Lambda is making external HTTP/database calls — network latency is the most common cause. 2) Verify the function is not inside a VPC without a NAT Gateway — Lambda in a VPC needs NAT to reach the internet or VPC endpoints for AWS services. 3) Review the timeout setting — default is 3 seconds, max is 15 minutes; increase if the operation genuinely needs more time. 4) Add structured logging with timing around each operation to identify the slow section. 5) Check if connections are being reused (put DB connections outside the handler for reuse across invocations).", difficulty: "mid" as const },
        { question: "You need to run a long-running batch job that takes 2 hours. Should you use Lambda or EC2, and why?", answer: "EC2 (or AWS Batch/Fargate). Lambda has a hard limit of 15 minutes per invocation. For 2-hour jobs: use EC2 Spot Instances for cost efficiency (up to 90% cheaper than On-Demand), or AWS Batch which manages the EC2 fleet automatically. If the job can be broken into chunks under 15 minutes each, Lambda with SQS can work, but that requires redesigning the workflow. For simplicity, EC2 with a startup script or AWS Batch is the right choice.", difficulty: "junior" as const },
        { question: "An Auto Scaling Group is not launching new instances despite high CPU load. What are the possible causes?", answer: "1) Max capacity reached — ASG cannot exceed its maximum instance count. 2) EC2 service limit (vCPU quota) reached — request a limit increase in Service Quotas. 3) The Launch Template references an AMI that no longer exists or is in a different region. 4) The target subnet is out of IP addresses (check subnet available IP count). 5) The scaling policy cooldown period hasn't elapsed. 6) IAM role for the ASG doesn't have permissions to launch instances. 7) Spot interruptions — if using Spot, no capacity may be available in that AZ.", difficulty: "mid" as const },
        { question: "How do you deploy a new version of your application to EC2 with zero downtime?", answer: "Use a rolling deployment via an Application Load Balancer + Auto Scaling Group: 1) Create a new Launch Template version with the new AMI. 2) Update the ASG to use the new launch template. 3) Use 'aws autoscaling start-instance-refresh' with MinHealthyPercentage=100 to replace instances gradually. 4) The ASG launches new instances with the new version, waits for them to pass health checks, then terminates old ones. 5) Alternatively, use CodeDeploy with an In-Place or Blue/Green deployment strategy on EC2.", difficulty: "mid" as const },
        { question: "What EC2 purchasing options would you use for: a critical production API with steady traffic, a nightly batch job, and a 3-day load test?", answer: "Critical production API (steady traffic): Reserved Instances (1-year, all-upfront) — up to 40% savings vs On-Demand. Predictable baseline workload justifies commitment. Nightly batch job: Spot Instances — can handle interruptions since the job runs nightly and can restart; up to 90% savings. 3-day load test: On-Demand — no commitment needed, pay for exactly what you use, no risk of spot interruption during critical test window.", difficulty: "mid" as const },
        { question: "A Lambda function is working correctly in dev but failing with a permissions error in production. What do you check?", answer: "1) Compare the IAM execution roles between dev and prod Lambda functions — they are likely different. 2) Check if the resource (S3 bucket, DynamoDB table, SQS queue) in prod has a resource-based policy that restricts access. 3) Verify environment variables point to the correct prod resources. 4) Check if VPC configuration differs — prod Lambda may be in a VPC without access to the target service. 5) Review CloudWatch Logs for the exact error message (UnauthorizedAccess, AccessDenied) to identify which specific action is denied.", difficulty: "mid" as const },
        { question: "How do Lambda cold starts affect your application and what techniques reduce them?", answer: "Cold starts occur when Lambda initializes a new execution environment (download code, start runtime, run init code) — this adds 100ms–2s+ latency. Reduction strategies: 1) Provisioned Concurrency — pre-warms a set number of environments; eliminates cold starts for that concurrency level. 2) Keep functions warm with scheduled EventBridge pings (less reliable). 3) Reduce deployment package size — smaller zips initialize faster; use Lambda layers for dependencies. 4) Use languages with fast cold starts: Node.js and Python are faster than Java. 5) Move heavy initialization (DB connections, config loading) outside the handler so it's reused across invocations.", difficulty: "senior" as const },
        { question: "You need EC2 instances to automatically recover if the underlying host fails. How do you configure this?", answer: "Two approaches: 1) EC2 Auto Recovery — enable the 'Recover' CloudWatch alarm: create an alarm on StatusCheckFailed_System metric with action 'recover'. AWS migrates the instance to a healthy host preserving the instance ID, private IP, and EBS volumes. 2) Auto Scaling Group with min/desired capacity of 1 — if an instance becomes unhealthy, ASG terminates and replaces it. ASG is more resilient but creates a new instance (new instance ID). Use Auto Recovery for stateful single instances, ASG for stateless workloads.", difficulty: "senior" as const },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 3 — Storage & Databases
    // ─────────────────────────────────────────
    {
      id: "aws-storage",
      title: "Storage & Databases",
      description: "S3, EBS, EFS, RDS, DynamoDB — the full AWS data tier.",
      level: "intermediate",
      lessons: [
        {
          id: "s3-deep-dive",
          title: "S3 Deep Dive",
          description: "Buckets, lifecycle policies, versioning, replication, presigned URLs, and cost optimisation.",
          type: "lesson",
          duration: 22,
          objectives: [
            "Create and configure S3 buckets with security best practices",
            "Implement lifecycle policies and intelligent tiering",
            "Generate presigned URLs for temporary object access",
            "Configure cross-region replication",
            "Analyse S3 costs with Storage Lens",
          ],
          content: `## S3 Deep Dive

S3 (Simple Storage Service) is one of AWS's oldest and most foundational services. It provides object storage with 11 nines (99.999999999%) of durability and effectively unlimited capacity. Understanding S3 deeply saves you money, prevents security incidents, and unlocks patterns unavailable in traditional file systems.

## How S3 Stores Data Internally

When you upload an object to S3, AWS:
1. Breaks it into chunks using **erasure coding** (similar to RAID 6, not just replication)
2. Distributes chunks across **≥3 Availability Zones** in the bucket's region
3. Confirms write to all AZs before returning HTTP 200 (strong consistency)
4. Stores redundant metadata in a distributed key-value store

This means:
- An entire AZ can fail and your objects remain 100% available
- Durability (11 nines) means losing 1 object out of 100 billion every 1,000 years
- **S3 has been strongly consistent since December 2020** — prior to this, overwrite PUTs had eventual consistency (a common gotcha in older tutorials). Today, every read-after-write is immediately consistent.

**S3 is NOT a filesystem:** Objects are immutable (no append). "Folders" don't exist — they're just common prefixes in key names. There's no file locking. These differences matter when choosing S3 vs EBS vs EFS.

## S3 Storage Classes — Choosing the Right Tier

S3 offers 7 storage classes with different cost/availability/retrieval tradeoffs:

\`\`\`
S3 Standard:
  Price: ~$0.023/GB/month
  Retrieval: Milliseconds, free
  Availability: 99.99%
  Min duration: None
  Use for: Actively accessed data, content distribution, static websites

S3 Intelligent-Tiering:
  Price: $0.023/GB/month + $0.00025/1000 objects monitoring fee
  Retrieval: Milliseconds (frequent/infrequent), free
  Auto-moves objects between tiers based on access patterns
  Use for: Data with unpredictable or changing access patterns
  Not ideal for: Objects < 128KB (monitoring fee exceeds savings)

S3 Standard-IA (Infrequent Access):
  Price: ~$0.0125/GB/month storage, $0.01/GB retrieval
  Availability: 99.9%
  Min duration: 30 days (charged even if deleted sooner)
  Use for: Backups, disaster recovery data, monthly reports

S3 One Zone-IA:
  Price: ~$0.01/GB/month
  Stored in ONE AZ only (99.5% availability)
  Use for: Reproducible data (thumbnails, transcoded video) where recreation is cheap
  Avoid for: Primary backups (AZ failure = data loss)

S3 Glacier Instant Retrieval:
  Price: ~$0.004/GB/month
  Retrieval: Milliseconds, $0.03/GB retrieval fee
  Min duration: 90 days
  Use for: Archive data accessed once per quarter (compliance data, old logs)

S3 Glacier Flexible Retrieval:
  Price: ~$0.0036/GB/month
  Retrieval: 3-5 hours (standard), 12 hours (bulk, cheapest)
  Min duration: 90 days
  Use for: Yearly disaster recovery restores, compliance archives

S3 Glacier Deep Archive:
  Price: ~$0.00099/GB/month (cheapest storage on AWS)
  Retrieval: 12 hours (standard), 48 hours (bulk)
  Min duration: 180 days
  Use for: 7-year compliance retention, data you'll probably never need
\`\`\`

**Decision guide:** If data is accessed multiple times/month → Standard. Unknown patterns → Intelligent-Tiering. Monthly access → Standard-IA. Quarterly → Glacier Instant. Yearly → Glacier Flexible. Compliance retention → Deep Archive.

---

## Creating a Secure Bucket

\`\`\`bash
# Create bucket
aws s3api create-bucket \
  --bucket my-app-data-$(aws sts get-caller-identity --query Account --output text) \
  --region us-east-1

# Block ALL public access (security baseline)
aws s3api put-public-access-block \
  --bucket my-app-data-123456789012 \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket my-app-data-123456789012 \
  --versioning-configuration Status=Enabled

# Enable default encryption (SSE-S3)
aws s3api put-bucket-encryption \
  --bucket my-app-data-123456789012 \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"},
      "BucketKeyEnabled": true
    }]
  }'

# Enable access logging
aws s3api put-bucket-logging \
  --bucket my-app-data-123456789012 \
  --bucket-logging-status '{
    "LoggingEnabled": {
      "TargetBucket": "my-access-logs",
      "TargetPrefix": "s3/my-app-data/"
    }
  }'
\`\`\`

---

## Common S3 Operations

\`\`\`bash
# Upload a file
aws s3 cp myfile.txt s3://my-bucket/path/myfile.txt

# Upload with storage class
aws s3 cp large-archive.zip s3://my-bucket/ \
  --storage-class INTELLIGENT_TIERING

# Sync a directory
aws s3 sync ./dist s3://my-bucket/app/ --delete

# Download
aws s3 cp s3://my-bucket/path/myfile.txt ./local/

# List objects with sizes
aws s3 ls s3://my-bucket/ --recursive --human-readable --summarize

# Copy between buckets
aws s3 cp s3://source-bucket/key s3://dest-bucket/key --source-region us-west-2

# Delete an object
aws s3 rm s3://my-bucket/path/old-file.txt

# Empty a bucket (required before deletion)
aws s3 rm s3://my-bucket/ --recursive
aws s3 rb s3://my-bucket
\`\`\`

---

## Lifecycle Policies

\`\`\`bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket my-app-data-123456789012 \
  --lifecycle-configuration '{
    "Rules": [
      {
        "ID": "transition-and-expire",
        "Status": "Enabled",
        "Filter": {"Prefix": "logs/"},
        "Transitions": [
          {"Days": 30, "StorageClass": "STANDARD_IA"},
          {"Days": 90, "StorageClass": "GLACIER_IR"},
          {"Days": 365, "StorageClass": "DEEP_ARCHIVE"}
        ],
        "Expiration": {"Days": 2555}
      },
      {
        "ID": "cleanup-old-versions",
        "Status": "Enabled",
        "Filter": {},
        "NoncurrentVersionExpiration": {"NoncurrentDays": 30}
      }
    ]
  }'
\`\`\`

---

## Presigned URLs

\`\`\`bash
# Generate a presigned URL (expires in 1 hour)
aws s3 presign s3://my-bucket/report.pdf --expires-in 3600

# Presigned POST URL for browser uploads (up to 5GB)
aws s3 presign s3://my-bucket/uploads/myfile.csv \
  --expires-in 900 \
  --method PUT

# With Python SDK (for custom conditions)
# aws s3api generate-presigned-post is better for browser uploads
\`\`\`

---

## Cross-Region Replication

\`\`\`bash
# Enable replication (both buckets must have versioning enabled)
aws s3api put-bucket-replication \
  --bucket source-bucket \
  --replication-configuration '{
    "Role": "arn:aws:iam::123456789012:role/S3ReplicationRole",
    "Rules": [{
      "Status": "Enabled",
      "Filter": {},
      "Destination": {
        "Bucket": "arn:aws:s3:::dest-bucket-us-west-2",
        "StorageClass": "STANDARD_IA"
      },
      "DeleteMarkerReplication": {"Status": "Enabled"}
    }]
  }'
\`\`\`

---

## Multipart Upload (Large Files)

For files over 5GB, you MUST use multipart upload. AWS recommends it for anything over 100MB.

\`\`\`bash
# The AWS CLI does multipart automatically for large files
aws s3 cp large-file.tar.gz s3://my-bucket/ \
  --expected-size 10737418240  # 10GB in bytes

# Control multipart threshold and part size
aws s3 cp large-file.tar.gz s3://my-bucket/ \
  --cli-binary-format raw-in-base64-out \
  --sse aws:kms \
  --storage-class INTELLIGENT_TIERING

# Manual multipart (for fine-grained control):
UPLOAD_ID=$(aws s3api create-multipart-upload \
  --bucket my-bucket --key large-file.tar.gz \
  --query 'UploadId' --output text)

# Upload parts (each must be 5MB–5GB)
aws s3api upload-part \
  --bucket my-bucket --key large-file.tar.gz \
  --upload-id $UPLOAD_ID --part-number 1 \
  --body part1.bin

# Complete the multipart upload
aws s3api complete-multipart-upload \
  --bucket my-bucket --key large-file.tar.gz \
  --upload-id $UPLOAD_ID \
  --multipart-upload '{"Parts":[{"PartNumber":1,"ETag":"..."}]}'

# List and abort abandoned multipart uploads (they accumulate cost!)
aws s3api list-multipart-uploads --bucket my-bucket
aws s3api abort-multipart-upload --bucket my-bucket \
  --key large-file.tar.gz --upload-id $UPLOAD_ID
# Add a lifecycle rule to auto-abort incomplete multipart uploads after 7 days
\`\`\`

---

## S3 Transfer Acceleration and S3 Select

\`\`\`bash
# S3 Transfer Acceleration: routes uploads/downloads through CloudFront edge locations
# Speeds up uploads from distant locations (e.g., Europe → us-east-1: 2-3x faster)
aws s3api put-bucket-accelerate-configuration \
  --bucket my-bucket \
  --accelerate-configuration Status=Enabled

# Use accelerated endpoint:
aws s3 cp large-file.tar.gz s3://my-bucket/ \
  --endpoint-url https://my-bucket.s3-accelerate.amazonaws.com

# S3 Select: run SQL queries on objects without downloading the whole file
# Massive cost and performance win for large CSV/JSON/Parquet files
aws s3api select-object-content \
  --bucket my-bucket \
  --key data/users.csv.gz \
  --expression "SELECT * FROM S3Object WHERE age > 30 LIMIT 100" \
  --expression-type SQL \
  --input-serialization '{"CSV":{"FileHeaderInfo":"USE"},"CompressionType":"GZIP"}' \
  --output-serialization '{"CSV":{}}' \
  output.csv
# Downloads only matching rows — saves 90%+ data transfer vs downloading the full file
\`\`\`

---

## S3 Common Pitfalls

**The minimum duration trap:** Standard-IA and Glacier have minimum storage durations (30 days and 90 days respectively). If you delete an object after 1 day, you're charged for the full minimum period. Lifecycle rules that transition too aggressively can increase costs rather than decrease them.

**Multipart upload debt:** If a multipart upload is started but never completed or aborted (due to application crash), the parts stay in S3 and you're charged for them. Add a lifecycle rule to abort incomplete multipart uploads after 7 days as standard practice.

**Not enabling versioning before enabling replication:** Cross-region replication requires versioning on the source bucket. Enable versioning first, then configure replication.

**Object ownership with ACLs:** Since April 2023, S3 Object Ownership defaults to "Bucket owner enforced" — ACLs are disabled by default. If you have old code that uses \`--acl public-read\` or \`--acl bucket-owner-full-control\`, it will fail silently or throw an error. Modern S3 uses bucket policies instead of ACLs.

**S3 eventual consistency myths:** Since December 2020, S3 provides strong read-after-write consistency for all operations. The old guidance about "eventual consistency for overwrite PUTs" is obsolete. You can safely read an object immediately after writing it.

> **Tip:** Use **S3 Intelligent-Tiering** for data with unpredictable access patterns. It automatically moves objects between frequent and infrequent access tiers with no retrieval fees. For >90 days of storage, it almost always saves money over STANDARD.`,
          interviewQuestions: [
            {
              question: "An S3 bucket was accidentally made public. Walk me through your incident response.",
              difficulty: "mid" as const,
              answer: `**Immediate containment (first 2 minutes):**
\`\`\`bash
# Block all public access immediately:
aws s3api put-public-access-block \\
  --bucket exposed-bucket \\
  --public-access-block-configuration \\
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
\`\`\`

**Assessment — what was exposed?**
\`\`\`bash
# Check object ACLs and bucket policy:
aws s3api get-bucket-acl --bucket exposed-bucket
aws s3api get-bucket-policy --bucket exposed-bucket

# Audit what was accessed (requires logging to be enabled):
aws s3api get-bucket-logging --bucket exposed-bucket

# Check CloudTrail for GetObject events in the exposure window:
aws cloudtrail lookup-events \\
  --lookup-attributes AttributeKey=ResourceType,AttributeValue=AWS::S3::Object \\
  --start-time <exposure_start> --end-time <now> | \\
  jq '.Events[] | select(.EventName=="GetObject") | {user:.Username, object:.Resources[0].ResourceName}'
\`\`\`

**Remediation:**
1. Fix bucket policy — restrict to specific IAM roles only
2. Enable S3 server access logging (to detect future incidents)
3. Enable CloudTrail data events for S3 (GetObject, PutObject)
4. Enable AWS Config rule: s3-bucket-public-read-prohibited

**Organizational fix:**
\`\`\`bash
# Apply SCP to deny s3:PutBucketAcl with public-read:
# This prevents anyone in the org from making buckets public
aws organizations create-policy \\
  --type SERVICE_CONTROL_POLICY \\
  --name "DenyPublicS3" \\
  --content file://deny-public-s3.json
\`\`\`

**Notification:** If the bucket contained PII or sensitive data, assess GDPR/CCPA breach notification requirements.`,
            },
            {
              question: "Explain S3 storage classes and how to design a cost-effective lifecycle policy.",
              difficulty: "mid" as const,
              answer: `**S3 Storage Classes by use case:**

| Class | Retrieval | Min Duration | Price (GB/month) | Best For |
|-------|-----------|-------------|-----------------|----------|
| Standard | Instant | None | $0.023 | Frequently accessed |
| Intelligent-Tiering | Instant | None | $0.023 + monitoring | Unknown patterns |
| Standard-IA | Instant | 30 days | $0.0125 | Monthly access |
| Glacier Instant | Instant | 90 days | $0.004 | Quarterly access |
| Glacier Flexible | 3-5h | 90 days | $0.0036 | Yearly archive |
| Deep Archive | 12h | 180 days | $0.00099 | 7-year retention |

**Cost-effective lifecycle policy for application logs:**
\`\`\`json
{
  "Rules": [{
    "Status": "Enabled",
    "Filter": {"Prefix": "logs/"},
    "Transitions": [
      {"Days": 30, "StorageClass": "STANDARD_IA"},
      {"Days": 90, "StorageClass": "GLACIER_IR"},
      {"Days": 365, "StorageClass": "DEEP_ARCHIVE"}
    ],
    "Expiration": {"Days": 2555}
  }]
}
\`\`\`

**Savings example for 1TB of logs:**
- Without lifecycle: $23/month = $276/year
- With lifecycle: $23 for month 1, $12.50 months 2-3, $4 months 3-12, $1/year after that
- **Annual savings: ~70% after first year**

**Intelligent-Tiering tip:** Use for objects > 128KB that are accessed unpredictably. It automatically moves to cheaper tiers with no retrieval fees. Small per-object monitoring charge ($0.00025/1000 objects) makes it uneconomical for many small objects.`,
            },
          ],
        },
        {
          id: "rds-and-dynamodb",
          title: "RDS & DynamoDB",
          description: "Managed relational and NoSQL databases — provisioning, backups, and access patterns.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Create an RDS Aurora cluster via CLI",
            "Configure Multi-AZ and read replicas",
            "Design a DynamoDB table with partition and sort keys",
            "Use DynamoDB Streams and GSIs",
          ],
          content: `## RDS & DynamoDB

AWS offers two managed database categories: relational (RDS/Aurora) for structured data with complex queries, and NoSQL (DynamoDB) for high-scale key-value and document access patterns. Choosing between them — and understanding their internals — is one of the most important decisions in cloud architecture.

## RDS vs Aurora — Understanding the Difference

**RDS** is managed MySQL, PostgreSQL, MariaDB, Oracle, or SQL Server on EC2 instances. AWS manages the OS and database engine patching. You provision the instance size and storage.

**Aurora** is AWS's reimagining of MySQL/PostgreSQL built on a distributed storage system. The key innovation is separating compute from storage:

\`\`\`
Traditional RDS (e.g., PostgreSQL):
  Writer instance ─────────────────────────────────── EBS volume
  Read replica   ─── async replication lag ─────────── EBS volume
                                              (separate, replicated independently)

Aurora:
  Writer instance ─── reads/writes ─────────────────┐
  Read replica 1  ─── reads ──────────────────────── Aurora Distributed Storage
  Read replica 2  ─── reads ──────────────────────── (6 copies across 3 AZs)
                                                       ↑ Storage auto-scales 10GB–128TB
\`\`\`

**Aurora advantages:**
- Storage automatically replicates across 6 nodes in 3 AZs (you can lose 2 without data loss)
- Failover to a read replica takes ~30 seconds (vs 60-120s for Multi-AZ RDS)
- Read replicas share the same underlying storage — zero replication lag for reads
- Storage auto-grows in 10GB increments, you never provision storage
- Aurora Serverless v2 scales compute in fine-grained 0.5 ACU increments (2GB RAM each)

**When to use RDS vs Aurora:**
- Aurora: new production workloads on MySQL or PostgreSQL (better HA, faster failover)
- RDS: Oracle or SQL Server (Aurora doesn't support these); simple dev environments; cost sensitivity (Aurora ~20% more expensive than comparable RDS)

## Multi-AZ vs Read Replicas — Different Purposes

This is one of the most commonly confused concepts in AWS:

\`\`\`
Multi-AZ (High Availability):
  Purpose: Automatic failover if primary fails
  Replication: SYNCHRONOUS (primary waits for standby to confirm write)
  Standby: NOT readable — it only exists for failover
  Failover time: ~60-120 seconds (RDS), ~30 seconds (Aurora)
  Cost: ~2x (you're paying for an instance that does no useful work)
  When to use: Production databases that need HA

Read Replicas (Horizontal Read Scaling):
  Purpose: Offload read traffic from the primary
  Replication: ASYNCHRONOUS (replication lag of milliseconds to seconds)
  Replica: READABLE — your application can query it
  Failover: Manual promotion (not automatic in RDS; automatic in Aurora)
  Can be cross-region (useful for DR and geo-distributed reads)
  When to use: When read traffic is overwhelming the primary
\`\`\`

Production databases should have BOTH: Multi-AZ for HA, plus read replicas for read scaling.

---

## RDS Aurora Cluster

\`\`\`bash
# Create a subnet group (required for RDS)
aws rds create-db-subnet-group \
  --db-subnet-group-name my-db-subnets \
  --db-subnet-group-description "Private subnets for RDS" \
  --subnet-ids subnet-aaa subnet-bbb

# Create Aurora PostgreSQL cluster
aws rds create-db-cluster \
  --db-cluster-identifier my-aurora-cluster \
  --engine aurora-postgresql \
  --engine-version 15.4 \
  --master-username dbadmin \
  --master-user-password "$(openssl rand -base64 24)" \
  --db-subnet-group-name my-db-subnets \
  --vpc-security-group-ids sg-0123456789abcdef0 \
  --storage-encrypted \
  --backup-retention-period 7 \
  --deletion-protection \
  --enable-cloudwatch-logs-exports '["postgresql"]'

# Add a writer instance
aws rds create-db-instance \
  --db-instance-identifier my-aurora-writer \
  --db-cluster-identifier my-aurora-cluster \
  --db-instance-class db.r7g.large \
  --engine aurora-postgresql

# Add a read replica
aws rds create-db-instance \
  --db-instance-identifier my-aurora-reader \
  --db-cluster-identifier my-aurora-cluster \
  --db-instance-class db.r7g.large \
  --engine aurora-postgresql

# Wait for available
aws rds wait db-instance-available --db-instance-identifier my-aurora-writer

# Get connection endpoint
aws rds describe-db-clusters \
  --db-cluster-identifier my-aurora-cluster \
  --query 'DBClusters[0].{Writer:Endpoint,Reader:ReaderEndpoint,Port:Port}'
\`\`\`

---

## RDS Snapshots & Restore

\`\`\`bash
# Manual snapshot
aws rds create-db-cluster-snapshot \
  --db-cluster-identifier my-aurora-cluster \
  --db-cluster-snapshot-identifier my-snapshot-$(date +%Y%m%d)

# Restore to a new cluster
aws rds restore-db-cluster-from-snapshot \
  --db-cluster-identifier my-restored-cluster \
  --snapshot-identifier my-snapshot-20240115 \
  --engine aurora-postgresql

# Point-in-time restore (to any second within backup window)
aws rds restore-db-cluster-to-point-in-time \
  --db-cluster-identifier my-pitr-cluster \
  --source-db-cluster-identifier my-aurora-cluster \
  --restore-to-time 2024-01-15T14:30:00Z
\`\`\`

---

## DynamoDB

DynamoDB is a fully managed key-value and document database with single-digit millisecond latency at any scale. Unlike RDS, there are no connection pools, no instance sizes to choose, and no schema migrations — but the data modeling philosophy is completely different from relational databases.

## DynamoDB Internals — How It Achieves Scale

DynamoDB distributes data across partitions based on the partition key:

\`\`\`
Table with partition key = customerId

customerId="cust-001" → Partition A (stored on nodes 1,2,3 across 3 AZs)
customerId="cust-002" → Partition B (stored on nodes 4,5,6 across 3 AZs)
customerId="cust-003" → Partition A (hash collision, same partition)

Each partition has: 1 leader node + 2 follower nodes
Writes go to leader → synchronously replicated to 2 followers → success
Reads can serve from any follower (read consistency options apply)
\`\`\`

**Why partition key design is critical:**
- DynamoDB spreads partitions across servers to achieve horizontal scale
- If your partition key has low cardinality (e.g., \`status: "pending"|"completed"\`), all "pending" orders land on the same few partitions — a "hot partition"
- Hot partitions get throttled regardless of your table's total capacity
- The solution: use high-cardinality partition keys (user IDs, UUIDs, order IDs)

## DynamoDB Capacity Modes

\`\`\`bash
# Provisioned capacity (predictable workloads):
# You specify read capacity units (RCUs) and write capacity units (WCUs)
# 1 RCU = 1 strongly consistent read of ≤4KB per second
#       = 2 eventually consistent reads of ≤4KB per second
# 1 WCU = 1 write of ≤1KB per second
# Reads > 4KB consume multiple RCUs; writes > 1KB consume multiple WCUs
# Enable auto-scaling to adjust capacity based on utilization

# On-demand capacity (unpredictable workloads):
# PAY_PER_REQUEST: you don't provision anything
# AWS scales to handle your actual traffic
# ~6x more expensive per operation than optimally-provisioned capacity
# Ideal for: new tables with unknown traffic, development, infrequent workloads
\`\`\`

## GSI vs LSI — When to Use Each

\`\`\`
Local Secondary Index (LSI):
  - Created at table creation time ONLY (cannot add later)
  - Same partition key as the table, different sort key
  - Shares the table's provisioned capacity
  - Allows strongly consistent reads
  - Maximum 5 per table

Global Secondary Index (GSI):
  - Can be added at any time after table creation
  - Different partition key and/or sort key from the table
  - Has its own provisioned capacity (separate RCUs/WCUs)
  - Only supports eventually consistent reads
  - Maximum 20 per table (default limit)
  - Use for access patterns that query by a non-primary-key attribute

Decision: If you need a different sort key on the same partition, use LSI.
          For any other secondary access pattern, use GSI.
\`\`\`

\`\`\`bash
# Create a table
aws dynamodb create-table \
  --table-name orders \
  --attribute-definitions \
    AttributeName=customerId,AttributeType=S \
    AttributeName=orderId,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
  --key-schema \
    AttributeName=customerId,KeyType=HASH \
    AttributeName=orderId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes '[{
    "IndexName": "CreatedAtIndex",
    "KeySchema": [
      {"AttributeName":"customerId","KeyType":"HASH"},
      {"AttributeName":"createdAt","KeyType":"RANGE"}
    ],
    "Projection": {"ProjectionType":"ALL"}
  }]' \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true

# Put an item
aws dynamodb put-item \
  --table-name orders \
  --item '{
    "customerId": {"S": "cust-123"},
    "orderId": {"S": "ord-456"},
    "createdAt": {"S": "2024-01-15T10:00:00Z"},
    "total": {"N": "99.99"},
    "status": {"S": "pending"}
  }'

# Query by partition key
aws dynamodb query \
  --table-name orders \
  --key-condition-expression "customerId = :cid" \
  --expression-attribute-values '{":cid": {"S": "cust-123"}}' \
  --query 'Items[*].{OrderId:orderId.S,Status:status.S,Total:total.N}' \
  --output table

# Query with sort key range
aws dynamodb query \
  --table-name orders \
  --index-name CreatedAtIndex \
  --key-condition-expression "customerId = :cid AND createdAt BETWEEN :start AND :end" \
  --expression-attribute-values '{
    ":cid": {"S": "cust-123"},
    ":start": {"S": "2024-01-01"},
    ":end": {"S": "2024-01-31"}
  }'

# Update an item
aws dynamodb update-item \
  --table-name orders \
  --key '{"customerId": {"S": "cust-123"}, "orderId": {"S": "ord-456"}}' \
  --update-expression "SET #s = :newStatus" \
  --expression-attribute-names '{"#s": "status"}' \
  --expression-attribute-values '{":newStatus": {"S": "shipped"}}'
\`\`\`

---

## DynamoDB Streams

\`\`\`bash
# Enable DynamoDB Streams (change data capture)
aws dynamodb update-table \
  --table-name orders \
  --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES
# StreamViewType options:
#   KEYS_ONLY: only the key attributes
#   NEW_IMAGE: item after modification
#   OLD_IMAGE: item before modification
#   NEW_AND_OLD_IMAGES: both (useful for auditing and change detection)

# Connect Lambda to process the stream
aws lambda create-event-source-mapping \
  --function-name process-order-changes \
  --event-source-arn arn:aws:dynamodb:us-east-1:123456789012:table/orders/stream/2024-01-01T00:00:00.000 \
  --batch-size 100 \
  --starting-position LATEST \
  --bisect-batch-on-function-error  # split batch and retry halves on error

# Use cases for Streams:
# - Trigger notifications when order status changes
# - Replicate changes to Elasticsearch for full-text search
# - Maintain aggregate counters in a secondary table
# - Audit log of all changes
# - Cross-region replication (DynamoDB Global Tables uses streams internally)
\`\`\`

---

## DynamoDB Common Pitfalls

**Scanning in production:** A \`Scan\` operation reads every item in the table. For a table with 10 million items, this costs 10 million RCUs. It will also be slow and throttle other operations. If you need to query by an attribute that's not a key, add a GSI. Never use Scan in production critical paths.

**Choosing status as partition key:** If 90% of your orders are \`status=pending\`, all writes hit the same partition and you'll be throttled. Use \`orderId\` or \`customerId\` as the partition key, and add a GSI on \`status\` if you need to query by it.

**Under-provisioning WCUs for burst workloads:** DynamoDB has burst capacity (up to 5 minutes of unused capacity), but sustained writes over provisioned WCU will throttle. Enable DynamoDB auto-scaling with a target of 70% utilization to handle spikes.

**Not enabling PITR (Point-in-Time Recovery):** DynamoDB PITR allows you to restore the table to any second within the last 35 days. It's inexpensive (~$0.20/GB/month) and should be enabled on every production table. A bug that deletes items has a recovery path with PITR; without it, you have nothing.

> **Tip:** The most important DynamoDB design decision is choosing the right partition key. A poor partition key (like a date or boolean) creates "hot partitions" that throttle. Use high-cardinality keys (user ID, order ID) and add a random suffix if you need to spread writes across items with the same key.`,
          interviewQuestions: [
            {
              question: "When would you choose DynamoDB over RDS, and what are the access pattern implications?",
              difficulty: "mid" as const,
              answer: `**Choose DynamoDB when:**
- Scale > 10 million items or > 10,000 requests/second
- Data access patterns are known and consistent (key-value or simple queries)
- Auto-scaling to zero or infinite required
- Fully managed, no connection management needed
- Multi-region replication required (Global Tables)
- You can model your data around the access patterns

**Choose RDS when:**
- Complex queries with JOINs, aggregations, window functions
- ACID transactions across multiple tables/rows are critical
- Schema flexibility needed (ALTER TABLE is acceptable)
- Team is familiar with SQL
- Data model isn't fully known upfront

**The DynamoDB trap:**
DynamoDB is excellent but requires designing your data model around access patterns FIRST — opposite of relational design. If you try to query DynamoDB like a relational DB, you'll pay for full table scans or struggle with filter expressions.

\`\`\`
Relational: Design normalized schema, write queries as needed
DynamoDB: Know your queries, design the table to serve them efficiently
\`\`\`

**DynamoDB table design example:**
\`\`\`
Access patterns: Get order by orderId, Get all orders by userId
Single-table design:
PK=USER#userId, SK=ORDER#orderId → GetItem (single order)
Query PK=USER#userId → all orders for user
\`\`\`

**Anti-patterns:**
- Using DynamoDB like a relational DB (filter by non-key attributes)
- Using status as partition key (hot partition: all "pending" orders → same partition)
- Scan operations in production (full table scan = expensive)`,
            },
          ],
        },
      ],
      exam: [
        { question: "An S3 bucket was accidentally made public. What immediate steps do you take, and how do you prevent it in future?", answer: "Immediate: 1) Enable S3 Block Public Access at the account level — this overrides all bucket and object ACLs. 2) Remove any bucket policy statements with Principal: '*'. 3) Check CloudTrail to identify what data was accessed. 4) Check if any object-level ACLs grant public access. Prevention: Enable 'S3 Account-Level Block Public Access' via AWS Organizations SCP, use AWS Config rule 's3-bucket-public-read-prohibited' to alert on violations, and enable S3 Access Analyzer.", difficulty: "mid" as const },
        { question: "How do you prevent data exposure when sharing an S3 bucket URL temporarily with an external partner?", answer: "Use presigned URLs: 'aws s3 presign s3://my-bucket/file.pdf --expires-in 3600'. The URL is time-limited (max 7 days for IAM user credentials, or longer with assumed role). The bucket itself stays private — no public policy needed. For large file sets, use presigned POST for uploads. For ongoing access, create a dedicated IAM user with scoped permissions or use S3 Access Points to isolate access per consumer.", difficulty: "junior" as const },
        { question: "Your application reads from an RDS MySQL database but response times are slow during peak hours. What do you investigate and fix?", answer: "1) Check RDS Performance Insights — identify long-running queries and wait events. 2) Look for missing indexes: run EXPLAIN on slow queries. 3) Check CPU, memory, and IOPS in CloudWatch — you may be hitting instance limits. 4) Add a Read Replica and route read traffic there (separate read from write endpoints in your application). 5) Implement connection pooling with RDS Proxy to reduce connection overhead (Lambda especially exhausts connections). 6) Consider caching layer: ElastiCache Redis for frequently-read, rarely-changing data.", difficulty: "mid" as const },
        { question: "You need to migrate a 5TB MySQL database to RDS with minimal downtime. What strategy do you use?", answer: "Use AWS Database Migration Service (DMS): 1) Create RDS target instance. 2) Run a full load to copy existing data. 3) Enable CDC (Change Data Capture) to replicate ongoing changes while full load runs. 4) Monitor replication lag — wait until it's near zero. 5) During a brief maintenance window, stop writes to source, let CDC catch up, then cut over by updating application connection strings. 6) Keep source running for 24-48 hours as rollback option. DMS handles schema conversion for heterogeneous migrations (e.g., Oracle → PostgreSQL) via SCT (Schema Conversion Tool).", difficulty: "senior" as const },
        { question: "A DynamoDB table's read costs are unexpectedly high. You suspect inefficient queries. How do you identify and fix them?", answer: "1) Enable DynamoDB Contributor Insights to identify the most-accessed and throttled keys. 2) Check for Scan operations — a full table scan reads every item and is very expensive; replace with Query using partition key or add GSIs for your access patterns. 3) Check ConsumedReadCapacityUnits in CloudWatch — high values indicate large reads. 4) Use ProjectionExpression to return only needed attributes. 5) Add a GSI for non-primary-key query patterns instead of filtering. 6) Enable DAX (DynamoDB Accelerator) for read-heavy workloads to cache results.", difficulty: "mid" as const },
        { question: "What is the difference between S3 Standard, Standard-IA, and Glacier, and how do you choose the right tier?", answer: "S3 Standard: Frequent access (multiple times/month), highest cost per GB, lowest retrieval cost. Good for active data. Standard-IA (Infrequent Access): Accessed less than once/month. ~40% cheaper storage but charges per GB retrieved. Good for backups and disaster recovery data accessed occasionally. Glacier Instant Retrieval: Archival data accessed once a quarter, millisecond retrieval. Glacier Deep Archive: Long-term compliance data accessed once/year or less, retrieval in 12 hours. Use S3 Lifecycle policies to automatically transition objects as they age (e.g., move to IA after 30 days, Glacier after 90 days).", difficulty: "junior" as const },
        { question: "How do you ensure an RDS instance is highly available and recovers automatically from an AZ failure?", answer: "Enable Multi-AZ deployment when creating or modifying the RDS instance. AWS maintains a synchronous standby replica in a different AZ. On primary failure, RDS automatically promotes the standby (60-120 seconds typically) and updates the DNS endpoint. Your application connection string stays the same — it points to the endpoint, not a specific IP. For read scaling, additionally create Read Replicas (these are async and don't provide automatic failover). Always set the connection string to use the RDS endpoint, not the IP address.", difficulty: "mid" as const },
        { question: "Your S3 lifecycle policy isn't transitioning objects to Glacier as expected. What do you check?", answer: "1) Objects must be at least 128KB for Standard-IA transitions (smaller objects cost more in IA than Standard). 2) Check the filter in the lifecycle rule — it may only apply to a specific prefix or tag, not all objects. 3) The transition may be pending — AWS processes lifecycle rules once daily and with a 24-hour delay. 4) Versioned objects: lifecycle rules for versioned buckets require separate rules for current vs noncurrent versions. 5) Objects uploaded by multipart upload that weren't completed may not transition. 6) Verify the rule is 'Enabled', not 'Disabled'.", difficulty: "mid" as const },
        { question: "A Lambda function needs to query DynamoDB. What is the most efficient connection pattern?", answer: "Initialize the DynamoDB client outside the Lambda handler function (in the global scope). On warm invocations, Lambda reuses the same execution environment, so the client is already initialized and connections are reused. Inside the handler, only perform the actual query. For very high-throughput Lambdas hitting DynamoDB, enable DAX with a cluster endpoint and use the DAX client — DAX caches reads and dramatically reduces DynamoDB read costs and latency for repeated queries.", difficulty: "mid" as const },
        { question: "How do you implement disaster recovery for an RDS database with an RPO of 1 hour and RTO of 4 hours?", answer: "RPO 1 hour: Enable automated backups with 1-hour backup window, or enable continuous backups with Point-In-Time Recovery (PITR) which captures changes every 5 minutes — actually gives you ~5 minute RPO. RTO 4 hours: Keep a Read Replica in a secondary region (cross-region replica). In a disaster, manually promote the replica to a primary (takes minutes) and update application configs. Multi-AZ alone doesn't meet cross-region DR. For faster RTO, use RDS Global Database which reduces promotion to under 1 minute. Test DR procedures quarterly — document and automate the runbook.", difficulty: "senior" as const },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 4 — Networking
    // ─────────────────────────────────────────
    {
      id: "aws-networking",
      title: "VPC & Networking",
      description: "VPCs, subnets, security groups, NAT gateways, VPC peering, and Route 53.",
      level: "intermediate",
      lessons: [
        {
          id: "vpc-fundamentals",
          title: "VPC Design & Security Groups",
          description: "Build a production-grade VPC with public/private subnets, NAT, and security group rules.",
          type: "lesson",
          duration: 24,
          objectives: [
            "Create a VPC with public and private subnets across two AZs",
            "Configure Internet Gateway, NAT Gateway, and route tables",
            "Write precise security group rules",
            "Implement VPC Flow Logs for network visibility",
          ],
          content: `## VPC Design & Security Groups

A VPC (Virtual Private Cloud) is your isolated private network within AWS. Every EC2 instance, RDS database, Lambda in a VPC, ECS task, and EKS node lives inside a VPC. Good VPC design determines your security posture, network performance, and operational complexity.

## How VPC Networking Works

When you create a VPC, you're claiming a CIDR block from AWS's virtual network space. AWS's SDN (Software Defined Networking) handles all the routing — there's no physical network to configure.

\`\`\`
Key networking concepts:

CIDR block (e.g., 10.0.0.0/16):
  /16 = 65,536 IP addresses (10.0.0.0 to 10.0.255.255)
  /24 = 256 IP addresses (10.0.1.0 to 10.0.1.255)
  /28 = 16 IP addresses (minimum for a subnet; AWS reserves 5 of them)

  AWS reserves 5 IPs per subnet:
    10.0.1.0   = network address
    10.0.1.1   = VPC router
    10.0.1.2   = DNS resolver
    10.0.1.3   = reserved for future use
    10.0.1.255 = broadcast (not used in VPC but reserved)
  So a /24 subnet = 251 usable IPs, not 256.

Route tables:
  Each subnet has a route table defining where traffic goes
  0.0.0.0/0 → igw-xxx (public subnet — internet via Internet Gateway)
  0.0.0.0/0 → nat-xxx (private subnet — internet via NAT Gateway)
  No 0.0.0.0/0 route = no internet access (fully private)

Internet Gateway (IGW):
  Allows bidirectional internet traffic for instances with public IPs
  One per VPC, no bandwidth limits, no charge for the gateway itself

NAT Gateway:
  Allows OUTBOUND-only internet traffic for private subnet instances
  Deployed in a public subnet with an Elastic IP
  Stateful — return traffic is allowed automatically
  Cost: $0.045/hour + $0.045/GB data processed (can be expensive at scale)
\`\`\`

## CIDR Planning for Multi-Account Organizations

Bad CIDR planning causes VPC peering conflicts and Transit Gateway routing issues. Plan before you deploy:

\`\`\`
Recommended allocation:
  Production account:   10.0.0.0/16   (65K IPs across all environments)
  Staging account:      10.1.0.0/16
  Development account:  10.2.0.0/16
  Shared services:      10.10.0.0/16  (VPN gateway, Active Directory, etc.)

  Within each VPC (10.0.0.0/16):
    Public subnets:       10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24  (one per AZ)
    Private app subnets:  10.0.10.0/24, 10.0.11.0/24, 10.0.12.0/24
    Private DB subnets:   10.0.20.0/24, 10.0.21.0/24, 10.0.22.0/24

Why non-overlapping matters:
  VPC peering requires non-overlapping CIDRs
  Transit Gateway requires non-overlapping CIDRs
  If you use 10.0.0.0/16 in all accounts, you can never peer them directly
\`\`\`

---

## Standard 3-Tier VPC Architecture

\`\`\`
Internet
    │
 [IGW]
    │
 Public Subnets (10.0.0.0/24, 10.0.1.0/24)
    │  Load Balancers, NAT Gateways, Bastion (or none)
    │
[NAT GW]
    │
 Private App Subnets (10.0.10.0/24, 10.0.11.0/24)
    │  EC2, ECS tasks, Lambda (in VPC)
    │
 Private DB Subnets (10.0.20.0/24, 10.0.21.0/24)
       RDS, ElastiCache, DynamoDB endpoints
\`\`\`

---

## Creating the VPC via CLI

\`\`\`bash
# Create VPC
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=my-prod-vpc}]' \
  --query 'Vpc.VpcId' --output text)

# Enable DNS hostnames
aws ec2 modify-vpc-attribute --vpc-id \$VPC_ID --enable-dns-hostnames

# Create public subnets (2 AZs)
PUB_SN_1=$(aws ec2 create-subnet --vpc-id \$VPC_ID \
  --cidr-block 10.0.0.0/24 --availability-zone us-east-1a \
  --query 'Subnet.SubnetId' --output text)
PUB_SN_2=$(aws ec2 create-subnet --vpc-id \$VPC_ID \
  --cidr-block 10.0.1.0/24 --availability-zone us-east-1b \
  --query 'Subnet.SubnetId' --output text)

# Create private subnets
PRI_SN_1=$(aws ec2 create-subnet --vpc-id \$VPC_ID \
  --cidr-block 10.0.10.0/24 --availability-zone us-east-1a \
  --query 'Subnet.SubnetId' --output text)
PRI_SN_2=$(aws ec2 create-subnet --vpc-id \$VPC_ID \
  --cidr-block 10.0.11.0/24 --availability-zone us-east-1b \
  --query 'Subnet.SubnetId' --output text)

# Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 attach-internet-gateway --internet-gateway-id \$IGW_ID --vpc-id \$VPC_ID

# Public route table
PUB_RT=$(aws ec2 create-route-table --vpc-id \$VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id \$PUB_RT --destination-cidr-block 0.0.0.0/0 --gateway-id \$IGW_ID
aws ec2 associate-route-table --route-table-id \$PUB_RT --subnet-id \$PUB_SN_1
aws ec2 associate-route-table --route-table-id \$PUB_RT --subnet-id \$PUB_SN_2

# NAT Gateway (one per AZ for HA, one for cost savings)
EIP=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
NAT_ID=$(aws ec2 create-nat-gateway \
  --subnet-id \$PUB_SN_1 \
  --allocation-id \$EIP \
  --query 'NatGateway.NatGatewayId' --output text)
aws ec2 wait nat-gateway-available --nat-gateway-ids \$NAT_ID

# Private route table → NAT
PRI_RT=$(aws ec2 create-route-table --vpc-id \$VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id \$PRI_RT --destination-cidr-block 0.0.0.0/0 --nat-gateway-id \$NAT_ID
aws ec2 associate-route-table --route-table-id \$PRI_RT --subnet-id \$PRI_SN_1
aws ec2 associate-route-table --route-table-id \$PRI_RT --subnet-id \$PRI_SN_2
\`\`\`

---

## Security Groups

\`\`\`bash
# ALB security group — public internet
ALB_SG=$(aws ec2 create-security-group \
  --group-name alb-sg --description "ALB inbound" \
  --vpc-id \$VPC_ID --query 'GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id \$ALB_SG \
  --ip-permissions \
    'IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges=[{CidrIp=0.0.0.0/0}]' \
    'IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges=[{CidrIp=0.0.0.0/0}]'

# App security group — only from ALB
APP_SG=$(aws ec2 create-security-group \
  --group-name app-sg --description "App instances" \
  --vpc-id \$VPC_ID --query 'GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id \$APP_SG \
  --protocol tcp --port 3000 --source-group \$ALB_SG

# DB security group — only from app tier
DB_SG=$(aws ec2 create-security-group \
  --group-name db-sg --description "RDS instances" \
  --vpc-id \$VPC_ID --query 'GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id \$DB_SG \
  --protocol tcp --port 5432 --source-group \$APP_SG
\`\`\`

---

## VPC Flow Logs

\`\`\`bash
# Create CloudWatch Log Group
aws logs create-log-group --log-group-name /aws/vpc/flowlogs

# Enable flow logs
aws ec2 create-flow-logs \
  --resource-type VPC \
  --resource-ids \$VPC_ID \
  --traffic-type ALL \
  --log-destination-type cloud-watch-logs \
  --log-group-name /aws/vpc/flowlogs \
  --deliver-logs-permission-arn arn:aws:iam::123456789012:role/VPCFlowLogsRole

# Query rejected traffic (Insights)
aws logs start-query \
  --log-group-name /aws/vpc/flowlogs \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string 'fields @timestamp, srcAddr, dstAddr, dstPort, action | filter action = "REJECT" | sort @timestamp desc | limit 20'
\`\`\`

---

## VPC Endpoints — Eliminate NAT Gateway Costs

VPC endpoints allow your private subnet resources to reach AWS services (S3, DynamoDB, SSM, ECR, etc.) without traffic leaving the AWS network — and without using a NAT Gateway.

\`\`\`bash
# Gateway Endpoint for S3 (free — just updates route tables)
aws ec2 create-vpc-endpoint \
  --vpc-id $VPC_ID \
  --service-name com.amazonaws.us-east-1.s3 \
  --type Gateway \
  --route-table-ids $PRI_RT
# Now S3 traffic from private subnets routes directly, not through NAT Gateway
# Typical savings: $500–$5000/month for high-S3-traffic workloads

# Gateway Endpoint for DynamoDB (also free)
aws ec2 create-vpc-endpoint \
  --vpc-id $VPC_ID \
  --service-name com.amazonaws.us-east-1.dynamodb \
  --type Gateway \
  --route-table-ids $PRI_RT

# Interface Endpoints for other AWS services (costs ~$7/month per endpoint)
# Needed for: SSM, Secrets Manager, ECR, CloudWatch, SQS, etc.
aws ec2 create-vpc-endpoint \
  --vpc-id $VPC_ID \
  --service-name com.amazonaws.us-east-1.ssm \
  --type Interface \
  --subnet-ids $PRI_SN_1 $PRI_SN_2 \
  --security-group-ids $APP_SG
  --private-dns-enabled  # resolves ssm.us-east-1.amazonaws.com to private IP

# List all available endpoint services in your region
aws ec2 describe-vpc-endpoint-services \
  --query 'ServiceNames[*]' --output text | tr '\t' '\n' | grep amazonaws
\`\`\`

**Which endpoints to prioritize:**
1. **S3 and DynamoDB** (Gateway — free): Always create these, they have zero downside
2. **ECR** (Interface): If you use ECS/EKS with private subnets, ECR endpoints eliminate NAT charges for image pulls (images can be GBs)
3. **SSM** (Interface): Enables Session Manager on private instances without internet access
4. **Secrets Manager** (Interface): Allows Lambda/ECS to fetch secrets without internet

---

## VPC Peering vs Transit Gateway

\`\`\`
VPC Peering:
  Direct network connection between exactly 2 VPCs
  Non-transitive: A↔B and B↔C does NOT mean A↔C
  No bandwidth limit, minimal latency
  Cost: $0.01/GB data transfer (within a region)
  Use for: 2-3 VPCs, simple hub-and-spoke
  Complexity: grows as O(n²) with VPC count (10 VPCs = 45 peering connections)

Transit Gateway:
  Central hub connecting many VPCs (and on-premises via VPN/Direct Connect)
  Transitive: A→TGW→B→TGW→C works
  Cost: $0.05/GB + $0.07/hour per attachment
  Use for: 4+ VPCs, multi-account organizations, complex routing needs
  Complexity: O(n) — just attach each VPC to the TGW

AWS PrivateLink:
  Expose a service endpoint from one VPC to another
  Consumer connects via Interface Endpoint (private IP in their VPC)
  Only the specific service is exposed, not the whole VPC
  Use for: SaaS vendor integration, cross-account service sharing without full network access
\`\`\`

---

## Common VPC Pitfalls

**Default VPC:** Every AWS account has a default VPC with public subnets. It's convenient but insecure — instances launch with public IPs by default. Delete the default VPC in production accounts and use purpose-built VPCs with explicit public/private subnet design.

**Single NAT Gateway:** Putting one NAT Gateway in one AZ is a single point of failure. If that AZ has issues, all private subnet instances in other AZs lose internet access. Use one NAT Gateway per AZ for HA (at $0.045/hour per gateway).

**Security group sprawl:** Over time, teams add rules to security groups without removing old ones. A security group with 100 rules that nobody understands is a liability. Run regular audits and use descriptive names and descriptions.

**NACL ephemeral port confusion:** NACLs are stateless. If you allow inbound HTTP (port 80), you must also explicitly allow outbound on ephemeral ports (1024-65535) for the response to reach the client. Forgetting this is a classic NACL debugging mistake.

> **Tip:** Enable **VPC Endpoints** for services like S3 and DynamoDB. Traffic uses the AWS private network instead of going through the NAT Gateway, which saves both cost and latency. A single S3 VPC endpoint can eliminate thousands of dollars in NAT Gateway data processing charges per month.`,
          interviewQuestions: [
            {
              question: "Design a VPC for a 3-tier web application deployed across 3 Availability Zones.",
              difficulty: "senior" as const,
              answer: `**VPC CIDR:** 10.0.0.0/16 (65,536 IPs — plenty of room to grow)

**Subnet design (3 tiers × 3 AZs = 9 subnets):**
\`\`\`
               AZ-1a            AZ-1b            AZ-1c
Public:    10.0.1.0/24     10.0.2.0/24     10.0.3.0/24   (ALB, NAT GW)
App:       10.0.11.0/24    10.0.12.0/24    10.0.13.0/24  (EC2/ECS)
Database:  10.0.21.0/24    10.0.22.0/24    10.0.23.0/24  (RDS, ElastiCache)
\`\`\`

**Routing:**
- Public subnets → Internet Gateway (IGW)
- App subnets → NAT Gateway per AZ (for outbound internet, resilient to AZ failure)
- DB subnets → No internet route (isolated)

**Security Groups (stateful, preferred control):**
\`\`\`
ALB-SG:  inbound 80/443 from 0.0.0.0/0
App-SG:  inbound 8080 from ALB-SG only
DB-SG:   inbound 5432 from App-SG only
\`\`\`

**NACLs:** Subnet-level backstop. Use to block known bad CIDRs or add compliance layer. Stateless — must allow both inbound and outbound (including ephemeral ports 1024-65535 for return traffic).

**Cost considerations:**
- NAT Gateway: $0.045/hr + $0.045/GB data — expensive at scale
- VPC Endpoints for S3/DynamoDB eliminate NAT Gateway charges for those services
- Private subnet → public S3 → NAT = expensive; VPC Endpoint = free

**Terraform module:** Use terraform-aws-modules/vpc/aws — well-tested, handles all the routing/subnet complexity.`,
            },
            {
              question: "What is the difference between a Security Group and a Network ACL? When does each apply?",
              difficulty: "mid" as const,
              answer: `**Security Groups:**
- **Stateful** — return traffic automatically allowed
- Attached to **ENIs** (EC2, RDS, Lambda in VPC, etc.)
- Only **Allow** rules (no explicit deny)
- Default: deny all inbound, allow all outbound
- Evaluated at the resource level

**Network ACLs:**
- **Stateless** — must explicitly allow both inbound AND outbound (including return traffic on ephemeral ports 1024-65535)
- Attached to **subnets** — affects all resources in the subnet
- Both **Allow and Deny** rules
- Rules evaluated in number order (lowest first, first match wins)
- Default VPC NACL: allow all

**Evaluation order:**
Traffic hits NACL first (subnet boundary), then Security Group (resource boundary).

**When to use which:**
- **Security Groups** = primary security control (always)
- **NACLs** = supplement for subnet-level blocking:
  - Block a known malicious IP attacking your entire subnet
  - Compliance requirement for network-level isolation
  - Defense in depth (extra layer if SG misconfigured)

**The stateless NACL gotcha:**
\`\`\`
# NACL rule allows inbound HTTP (port 80):
ALLOW TCP 0.0.0.0/0 80 INBOUND ✓

# But response traffic uses ephemeral ports (1024-65535):
# If you don't have this outbound rule, responses are blocked!
ALLOW TCP 0.0.0.0/0 1024-65535 OUTBOUND ✓
\`\`\`
Security groups handle this automatically — with NACLs, you must do it manually.`,
            },
          ],
        },
      ],
      exam: [
        { question: "You launch an EC2 instance in a public subnet but cannot SSH into it. What do you check?", answer: "1) Security group inbound rules — must allow TCP port 22 from your IP (or 0.0.0.0/0 for open access). 2) The subnet must have 'auto-assign public IP' enabled, or the instance needs an Elastic IP. 3) The route table for the subnet must have a route 0.0.0.0/0 → Internet Gateway. 4) The Internet Gateway must be attached to the VPC. 5) The key pair used to launch must match the .pem file you're using. 6) Network ACLs — check they allow inbound port 22 AND outbound ephemeral ports (1024-65535).", difficulty: "junior" as const },
        { question: "Two microservices in different VPCs need to communicate privately without traversing the internet. What are your options?", answer: "1) VPC Peering — direct private connectivity between two VPCs (same or different accounts/regions). Non-transitive: A-B and B-C doesn't let A reach C. 2) AWS Transit Gateway — hub-and-spoke model connecting many VPCs through a central gateway; supports transitive routing. 3) AWS PrivateLink — expose a service via a VPC endpoint; only the service is accessible, not the entire VPC. Best for: VPC Peering for simple 2-VPC cases, Transit Gateway for 3+ VPCs, PrivateLink for SaaS-style service exposure.", difficulty: "mid" as const },
        { question: "Your application in a private subnet is making API calls to S3 and the NAT Gateway costs are very high. How do you reduce them?", answer: "Create an S3 VPC Gateway Endpoint: 'aws ec2 create-vpc-endpoint --vpc-id vpc-xxx --service-name com.amazonaws.us-east-1.s3 --type Gateway --route-table-ids rtb-yyy'. Traffic to S3 routes through the endpoint instead of the NAT Gateway — no data transfer charges. Gateway endpoints are free. Similarly, create DynamoDB Gateway Endpoints for DynamoDB traffic. For other AWS services (SSM, ECR, Secrets Manager), use Interface Endpoints (PrivateLink) — these have an hourly cost but eliminate NAT data charges for high-volume traffic.", difficulty: "mid" as const },
        { question: "Explain the difference between a Security Group and a Network ACL, and when you would use each.", answer: "Security Groups: Stateful (return traffic is automatically allowed), operate at the instance/ENI level, support allow rules only, evaluate all rules together. NACLs: Stateless (must explicitly allow return traffic including ephemeral ports), operate at the subnet level, support both allow and deny rules, process rules in numeric order (lowest first). Use Security Groups as your primary defense for controlling instance-level access. Use NACLs for: blocking a specific IP or CIDR across the whole subnet, compliance requirements for network-level controls, or as a defense-in-depth layer if security groups are misconfigured.", difficulty: "mid" as const },
        { question: "A Route 53 health check is failing and traffic is not routing to your backup region. What do you investigate?", answer: "1) Verify the health check endpoint is accessible from Route 53 health checkers' IP ranges (they are well-known; add them to security groups). 2) Check if the health check is HTTP vs HTTPS — a mismatch causes failures. 3) Verify the expected response string matches what the endpoint returns. 4) Check if the primary record in Route 53 has a health check associated — only records with health checks can fail over. 5) Confirm the failover policy is set correctly: primary record with health check, secondary record as failover. 6) Check the backup region's resources are healthy and the DNS record points to the correct endpoint.", difficulty: "senior" as const },
        { question: "How would you design a VPC for a multi-tier application with web, app, and database layers?", answer: "Three-tier VPC across 2+ AZs: Public subnets (10.0.0.0/24, 10.0.1.0/24) — contain ALB and NAT Gateways only. Private app subnets (10.0.2.0/24, 10.0.3.0/24) — EC2/ECS containers, route to NAT Gateway for outbound internet. Private database subnets (10.0.4.0/24, 10.0.5.0/24) — RDS, ElastiCache, no internet access. Security groups: ALB allows 80/443 from internet. App servers allow only from ALB SG. Database allows only from App SG on the DB port. This prevents database exposure even if the app layer is compromised.", difficulty: "mid" as const },
        { question: "What is CIDR and how do you plan IP address space for a growing AWS environment?", answer: "CIDR (Classless Inter-Domain Routing) defines IP ranges: /16 = 65,536 IPs, /24 = 256 IPs, /28 = 16 IPs (minimum for AWS subnets — AWS reserves 5 per subnet). Planning: Use a /16 per VPC (e.g., 10.0.0.0/16) to allow many subnets. Reserve non-overlapping ranges per environment: prod 10.0.0.0/16, staging 10.1.0.0/16, dev 10.2.0.0/16. Non-overlapping ranges are critical for VPC peering and Transit Gateway (overlapping CIDRs cannot be peered). Use /24 subnets per AZ per tier — they're easy to reason about (251 usable IPs) and you can split later.", difficulty: "mid" as const },
        { question: "An EC2 instance in a private subnet needs to make outbound HTTPS calls but you don't have a NAT Gateway. What are the alternatives?", answer: "1) NAT Gateway — the standard solution; deploy one in each public subnet per AZ for HA. 2) NAT Instance — an EC2 instance configured as a NAT; cheaper but you manage it; single point of failure unless you configure failover. 3) VPC Endpoints (Interface or Gateway) — for AWS services (S3, DynamoDB, SSM, ECR, etc.) use endpoints to avoid needing NAT entirely. 4) IPv6 with Egress-Only Internet Gateway — provides outbound-only internet access for IPv6 addresses, no inbound allowed. For most cases: deploy NAT Gateway in prod, use VPC endpoints for AWS services to minimize NAT traffic.", difficulty: "mid" as const },
        { question: "How does Route 53 latency-based routing work, and how is it different from geolocation routing?", answer: "Latency-based routing: Route 53 measures actual latency from the user's DNS resolver to each AWS region endpoint. Requests are routed to the region with the lowest measured latency. This is dynamic and considers real network conditions, not just geography. Geolocation routing: Routes based on the geographic location of the DNS query source (by continent, country, or US state). Used for content localization, regulatory compliance, or language-specific content. A user in Germany is routed to eu-west-1 regardless of latency. Key difference: latency-based optimizes for performance, geolocation controls WHERE requests go. You can combine both using traffic policies.", difficulty: "senior" as const },
        { question: "You need to allow an EC2 instance to access the AWS Systems Manager (SSM) API without opening port 22. How do you configure this?", answer: "1) Attach an IAM role to the EC2 instance with the AmazonSSMManagedInstanceCore policy. 2) For instances in private subnets without internet access, create VPC Interface Endpoints for: com.amazonaws.region.ssm, com.amazonaws.region.ssmmessages, com.amazonaws.region.ec2messages. 3) Enable DNS resolution for the VPC endpoints. Now 'aws ssm start-session --target i-xxxxx' connects via SSM Session Manager — no bastion host, no port 22, all traffic stays within AWS network. Audit all sessions via CloudTrail.", difficulty: "senior" as const },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 5 — Containers
    // ─────────────────────────────────────────
    {
      id: "aws-containers",
      title: "Containers: ECR, ECS & EKS",
      description: "Container registry, managed container orchestration, and Kubernetes on AWS.",
      level: "intermediate",
      lessons: [
        {
          id: "ecr-and-ecs",
          title: "ECR & ECS Fargate",
          description: "Push images to ECR and deploy containerised workloads with ECS Fargate.",
          type: "lesson",
          duration: 22,
          objectives: [
            "Create an ECR repository and push a Docker image",
            "Define ECS task definitions and services",
            "Deploy to ECS Fargate with an ALB",
            "Configure ECS service auto scaling",
          ],
          content: `## ECR & ECS Fargate

ECR (Elastic Container Registry) is AWS's managed Docker registry — like Docker Hub but integrated with IAM, VPC, and the rest of AWS. ECS (Elastic Container Service) is AWS's container orchestrator, competing with Kubernetes but with far less operational complexity.

## ECS Architecture — How It Works

\`\`\`
Your cluster is a logical grouping. Actual compute is either:

Fargate launch type:
  You describe CPU/memory requirements per task
  AWS provisions invisible EC2 instances (you never see them)
  Billed per task-second
  No node management, no AMI updates, no capacity planning

EC2 launch type:
  You manage an Auto Scaling Group of EC2 instances
  The ECS agent runs on each instance, accepting tasks from the control plane
  You choose instance types, handle patching, manage scaling
  More control, lower cost at scale, supports GPU and spot instances

Key ECS concepts:
  Task Definition: Blueprint for a container (image, CPU, memory, env vars, volumes)
  Task: A running instance of a Task Definition (like a Kubernetes Pod)
  Service: Maintains N running tasks, integrates with load balancers, handles rolling deploys
  Cluster: Logical namespace containing services and tasks
\`\`\`

**ECS vs Kubernetes:** ECS is simpler but more opinionated. Kubernetes has a richer ecosystem (Helm, custom controllers, CRDs) but higher operational overhead. For most teams that don't need Kubernetes-specific features, ECS Fargate is the right choice for containers.

## ECR — How Image Scanning Works

When you enable scan-on-push in ECR, AWS uses Amazon Inspector (enhanced scanning) or Clair (basic scanning) to check for known CVEs in:
- OS packages (apt, yum)
- Language runtime packages (npm, pip, gem)

\`\`\`bash
# Check image vulnerabilities after push
aws ecr describe-image-scan-findings \
  --repository-name myapp \
  --image-id imageTag=v1.0.0 \
  --query 'imageScanFindings.findings[?severity==\`CRITICAL\`].{
    Name:name,Severity:severity,Description:description
  }' --output table

# Fail CI/CD pipeline if CRITICAL vulnerabilities found
CRITICAL_COUNT=$(aws ecr describe-image-scan-findings \
  --repository-name myapp \
  --image-id imageTag=v1.0.0 \
  --query 'length(imageScanFindings.findings[?severity==\`CRITICAL\`])' \
  --output text)

if [ "$CRITICAL_COUNT" -gt "0" ]; then
  echo "Found $CRITICAL_COUNT CRITICAL vulnerabilities. Blocking deployment."
  exit 1
fi
\`\`\`

---

## ECR — Push an Image

\`\`\`bash
# Create repository
aws ecr create-repository \
  --repository-name myapp \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256

# Get the registry URI
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGION=us-east-1
REGISTRY=\$ACCOUNT.dkr.ecr.\$REGION.amazonaws.com

# Login
aws ecr get-login-password --region \$REGION \
  | docker login --username AWS --password-stdin \$REGISTRY

# Build, tag, push
docker build -t myapp:v1.0.0 .
docker tag myapp:v1.0.0 \$REGISTRY/myapp:v1.0.0
docker push \$REGISTRY/myapp:v1.0.0

# List images
aws ecr describe-images \
  --repository-name myapp \
  --query 'imageDetails[*].{Tag:imageTags[0],Pushed:imagePushedAt,Size:imageSizeInBytes}' \
  --output table

# ECR lifecycle policy (keep last 10 tagged images)
aws ecr put-lifecycle-policy \
  --repository-name myapp \
  --lifecycle-policy-text '{
    "rules": [{
      "rulePriority": 1,
      "description": "Keep last 10 production images",
      "selection": {
        "tagStatus": "tagged",
        "tagPrefixList": ["v"],
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": {"type": "expire"}
    }]
  }'
\`\`\`

---

## ECS Task Definition

\`\`\`bash
aws ecs register-task-definition --cli-input-json '{
  "family": "myapp",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/myapp-task-role",
  "containerDefinitions": [{
    "name": "myapp",
    "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.0.0",
    "portMappings": [{"containerPort": 3000, "protocol": "tcp"}],
    "environment": [
      {"name": "NODE_ENV", "value": "production"}
    ],
    "secrets": [
      {"name": "DB_PASSWORD", "valueFrom": "arn:aws:ssm:us-east-1:123456789012:parameter/myapp/db_password"}
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/myapp",
        "awslogs-region": "us-east-1",
        "awslogs-stream-prefix": "ecs"
      }
    },
    "healthCheck": {
      "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
      "interval": 30,
      "timeout": 5,
      "retries": 3
    }
  }]
}'
\`\`\`

---

## ECS Service + ALB

\`\`\`bash
# Create ECS cluster
aws ecs create-cluster --cluster-name production

# Create service
aws ecs create-service \
  --cluster production \
  --service-name myapp \
  --task-definition myapp:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration '{
    "awsvpcConfiguration": {
      "subnets": ["subnet-aaa","subnet-bbb"],
      "securityGroups": ["sg-app"],
      "assignPublicIp": "DISABLED"
    }
  }' \
  --load-balancers '[{
    "targetGroupArn": "arn:aws:elasticloadbalancing:...",
    "containerName": "myapp",
    "containerPort": 3000
  }]' \
  --deployment-configuration '{
    "minimumHealthyPercent": 50,
    "maximumPercent": 200,
    "deploymentCircuitBreaker": {"enable": true, "rollback": true}
  }'

# Update the service (rolling deploy)
aws ecs update-service \
  --cluster production \
  --service myapp \
  --task-definition myapp:2  # new version
\`\`\`

---

## ECS Auto Scaling

\`\`\`bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/production/myapp \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 20

# Scale on CPU utilisation
aws application-autoscaling put-scaling-policy \
  --policy-name cpu-scaling \
  --service-namespace ecs \
  --resource-id service/production/myapp \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 60.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleInCooldown": 300,
    "ScaleOutCooldown": 60
  }'
\`\`\`

---

## ECS Deployment Strategies

\`\`\`bash
# Rolling update (built-in, shown above):
# ECS replaces tasks incrementally based on minimumHealthyPercent and maximumPercent
# minimumHealthyPercent=50 means ECS can take down half the tasks at once
# maximumPercent=200 means ECS can briefly double the task count during deploy

# Blue/Green deployment with CodeDeploy (production standard):
aws ecs update-service \
  --cluster production \
  --service myapp \
  --deployment-controller '{"type": "CODE_DEPLOY"}'
# CodeDeploy creates a new task set (green), shifts traffic gradually,
# then deletes the old set (blue). Supports automatic rollback on alarms.

# Check deployment status
aws ecs describe-services \
  --cluster production \
  --services myapp \
  --query 'services[0].deployments[*].{
    ID:id,
    Status:status,
    Running:runningCount,
    Desired:desiredCount,
    PendingCount:pendingCount
  }' --output table

# Force new deployment (useful to pick up new secrets, updated images)
aws ecs update-service \
  --cluster production \
  --service myapp \
  --force-new-deployment
\`\`\`

---

## ECS Service Connect (Modern Service Discovery)

Service Connect, launched in 2022, simplifies inter-service communication within ECS clusters:

\`\`\`bash
# Task definition with Service Connect configuration
aws ecs register-task-definition --cli-input-json '{
  "family": "api-service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [{
    "name": "api",
    "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/api:latest",
    "portMappings": [{
      "containerPort": 3000,
      "name": "api-port",        // named port for Service Connect
      "appProtocol": "http"
    }]
  }]
}'

# Create service with Service Connect enabled
aws ecs create-service \
  --cluster production \
  --service-name api \
  --task-definition api-service:1 \
  --service-connect-configuration '{
    "enabled": true,
    "namespace": "production",
    "services": [{
      "portName": "api-port",
      "clientAliases": [{"port": 3000, "dnsName": "api"}]
    }]
  }'
# Now other services in the cluster can reach this service at http://api:3000
# No ALB needed for internal communication, built-in retries and metrics
\`\`\`

---

## Common ECS/ECR Pitfalls

**Not setting task role vs execution role correctly:** The execution role (\`ecsTaskExecutionRole\`) is for ECS infrastructure: pulling ECR images and writing CloudWatch logs. The task role is for your application code: accessing S3, DynamoDB, SQS, etc. Beginners often put application permissions on the execution role or forget the task role entirely.

**Log driver not configured:** If you don't set up the \`awslogs\` log driver in your task definition, your container logs disappear into the void. Always configure CloudWatch logging — it's the only place you'll look when debugging a failing task.

**ECR image pull failures in private subnets:** Fargate tasks in private subnets need either a NAT Gateway or VPC Interface Endpoints for ECR (\`ecr.api\`, \`ecr.dkr\`) and S3 (for image layers) to pull images. Many teams discover this the hard way after a deployment hangs for 10 minutes.

**Health check misconfiguration:** ECS uses the task definition health check AND the ALB target group health check. If either fails, the task is marked unhealthy and ECS starts a rolling restart loop. Check both — a health check hitting an authenticated endpoint without credentials is a common trap.

> **Tip:** Enable ECS **deployment circuit breaker** (shown above). It automatically rolls back a bad deployment if tasks fail to reach RUNNING state, saving you from manually rolling back at 3 AM.`,
          interviewQuestions: [
            {
              question: "ECS Fargate vs. ECS on EC2 — when do you choose each?",
              difficulty: "mid" as const,
              answer: `**ECS on Fargate (serverless compute):**
- AWS manages the EC2 instances; you define CPU/memory per task
- Pay per task-second (no idle EC2 cost if all tasks stop)
- No AMI management, no node capacity planning
- Works well for: variable workloads, microservices, teams without deep EC2 expertise

\`\`\`bash
aws ecs run-task \\
  --launch-type FARGATE \\
  --task-definition myapp \\
  --network-configuration "awsvpcConfiguration={subnets=[subnet-abc],securityGroups=[sg-xyz]}"
# AWS provisions compute, starts task, tears it down when done
\`\`\`

**ECS on EC2:**
- You manage the EC2 instances (AMIs, capacity, patching) in the ECS cluster
- Can use Spot Instances (60-90% savings for batch/fault-tolerant workloads)
- Required for GPU workloads (Fargate doesn't support GPU)
- Better cost efficiency at scale with reserved instances
- More control over instance type, networking, storage

**Decision framework:**
| Criteria | Fargate | EC2 |
|----------|---------|-----|
| Team size | Small | Large (can manage infra) |
| Cost at scale | Higher | Lower (reserved/spot) |
| GPU workloads | No | Yes |
| Spot discounts | Yes (Fargate Spot) | Yes (EC2 Spot, more options) |
| Cold starts | ~10-30s | Faster (warm instances) |

**Fargate Spot** (recommended): Use Fargate Spot for batch processing and fault-tolerant workloads — 70% cheaper than regular Fargate, with the caveat that tasks can be interrupted.`,
            },
            {
              question: "How does ECS service discovery work, and how do microservices communicate in ECS?",
              difficulty: "mid" as const,
              answer: `**Three patterns for ECS service-to-service communication:**

**1. ALB (Application Load Balancer) — most common for HTTP:**
\`\`\`
Service A → ALB DNS (my-service.internal) → Target Group → Service B tasks
\`\`\`
- Each service gets an ALB or a target group on a shared ALB
- Services call each other by ALB DNS name
- ALB handles health checks and load balancing across tasks

**2. AWS Cloud Map (Service Discovery):**
\`\`\`bash
# Register service:
aws servicediscovery create-service \\
  --name api --dns-config "NamespaceId=ns-abc,RoutingPolicy=MULTIVALUE" \\
  --health-check-custom-config FailureThreshold=1

# ECS registers each task as a DNS record automatically:
# api.internal → [172.17.0.10, 172.17.0.11, ...] (task IPs)
\`\`\`
- Direct DNS-based discovery, no ALB needed
- Good for service mesh patterns, internal-only services
- Round-robin DNS across healthy task IPs

**3. AWS App Mesh (service mesh):**
- Envoy sidecar proxy injected into each task
- Centralized traffic control: retries, circuit breaking, mTLS
- Good for: complex microservice topologies, advanced observability

**Best practice for most teams:**
- External-facing services: ALB (handles TLS termination, WAF, access logs)
- Internal service-to-service: Cloud Map DNS or shared internal ALB
- App Mesh: only if you need advanced traffic management

**ECS with VPC networking:** Each task in Fargate/awsvpc mode gets its own ENI and private IP — security groups apply at the task level, not the host level.`,
            },
          ],
        },
      ],
      exam: [
        { question: "Your Docker image is 2GB and ECS Fargate deployments are taking 10+ minutes. How do you speed this up?", answer: "1) Use multi-stage Docker builds — compile in a full SDK image, copy only the final binary/artifacts to a minimal base image (e.g., alpine or distroless). Can reduce from 2GB to under 100MB. 2) Order Dockerfile layers with least-frequently-changed layers first (e.g., install dependencies before copying app code) to maximize Docker layer caching. 3) Push to ECR in the same region as your ECS cluster to avoid inter-region transfer time. 4) Enable ECR pull-through cache or use a VPC endpoint for ECR to avoid public internet pulls. 5) Consider using a smaller base image — 'node:18-alpine' vs 'node:18'.", difficulty: "mid" as const },
        { question: "An ECS Fargate task keeps failing with 'CannotPullContainerError'. What are the causes?", answer: "1) No network access to ECR — Fargate tasks need either a NAT Gateway (for private subnets) or VPC Interface Endpoints for ECR (com.amazonaws.region.ecr.api and com.amazonaws.region.ecr.dkr) plus an S3 Gateway Endpoint for pulling image layers. 2) Task execution role missing the ecr:GetAuthorizationToken and ecr:BatchGetImage permissions. 3) Image tag doesn't exist in ECR — verify the tag pushed matches the task definition. 4) ECR repository is in a different account and the cross-account policy is not configured. 5) Task is in a public subnet but 'assignPublicIP' is set to DISABLED.", difficulty: "mid" as const },
        { question: "How do you pass secrets (database passwords, API keys) to an ECS container securely?", answer: "Use AWS Secrets Manager or Parameter Store (SSM) with ECS secrets injection: In the container definition, use the 'secrets' field with the ARN of the secret. ECS fetches the secret at task startup and injects it as an environment variable. The task execution role must have permissions to access the secret. Never pass secrets as plain environment variables or bake them into Docker images. For rotation: Secrets Manager can auto-rotate RDS credentials; tasks pick up the new value on the next deployment or restart.", difficulty: "mid" as const },
        { question: "When would you choose ECS EC2 launch type over Fargate, and vice versa?", answer: "Choose Fargate when: You want serverless containers (no EC2 management), workloads have variable traffic patterns, you want per-task security isolation, or you're getting started. Choose EC2 launch type when: Tasks need GPU instances, you need Windows containers on specific OS versions, you require very high network throughput or specific networking configurations, you want to pack many containers per host for cost efficiency at scale (EC2 can be 30-50% cheaper than Fargate at sustained load), or you need to use capacity reservations or Spot instances on specific instance types.", difficulty: "mid" as const },
        { question: "Your ECS service has 10 tasks running but users are reporting some requests are slow. How do you investigate?", answer: "1) Check ECS service events in the console — look for task health check failures or placement failures. 2) Check CloudWatch Container Insights (if enabled) for per-task CPU and memory metrics. 3) Look at ALB target group metrics — check the percentage of healthy targets and per-target response times. 4) Examine ECS task logs via CloudWatch Logs (/ecs/service-name). 5) Check if any tasks are repeatedly stopping/restarting (this creates unhealthy targets). 6) Review ALB access logs for 5XX errors and slow response codes. 7) If memory is high, increase task memory or investigate memory leaks.", difficulty: "mid" as const },
        { question: "How do you implement blue/green deployments for an ECS service?", answer: "Use AWS CodeDeploy with ECS blue/green deployment: 1) Configure the ECS service to use CodeDeploy as the deployment controller. 2) CodeDeploy creates a new task set (green) with the new container image alongside the existing one (blue). 3) Traffic shifts from ALB production listener to green using a weighted canary or linear strategy (e.g., 10% every 5 minutes). 4) If alarms trigger during rollout, CodeDeploy automatically rolls back to blue. 5) After the bake time (configurable), the blue task set is deleted. This gives zero-downtime deployments with automatic rollback.", difficulty: "senior" as const },
        { question: "An ECS task needs to write to an S3 bucket. How do you grant it the necessary permissions?", answer: "Create an IAM role with the required S3 policy and specify it as the task role (not the execution role) in the task definition. The task role grants permissions for the application code running in the container. The execution role is different — it's used by the ECS agent for pulling images from ECR and writing logs to CloudWatch. In the task definition: 'taskRoleArn' = your application's permissions, 'executionRoleArn' = ECS infrastructure permissions. Never hardcode AWS credentials in container images or environment variables.", difficulty: "junior" as const },
        { question: "How does ECR image scanning work and how do you enforce no high-severity vulnerabilities in production?", answer: "ECR offers two scanning modes: Basic scanning (powered by Clair) runs on push or manually. Enhanced scanning (powered by Amazon Inspector) provides continuous scanning, detecting new CVEs even for images already in ECR. To enforce in CI/CD: After pushing to ECR, run 'aws ecr describe-image-scan-findings --repository-name myapp --image-id imageTag=v1.2.3' and fail the pipeline if CRITICAL or HIGH findings exist. Use an ECR lifecycle policy to keep only scanned images. For compliance, enable enhanced scanning at the organization level via AWS Organizations.", difficulty: "senior" as const },
        { question: "Your ECS Fargate tasks are running out of memory and being killed (OOMKilled). What do you do?", answer: "1) Increase the task memory in the task definition and redeploy. 2) Enable CloudWatch Container Insights to get per-task memory metrics over time — set an alarm before hitting the limit. 3) Check if the application has a memory leak — use application profiling (e.g., Node.js --inspect, JVM heap dumps). 4) Use a memory limit on the container (not just task) to catch leaks early. 5) Review the application code — uncontrolled caches, event listeners not cleaned up, or circular references in JavaScript are common causes. 6) Set memory reservation separately from memory limit — reservation for scheduling, limit for OOM kill threshold.", difficulty: "mid" as const },
        { question: "How do you implement auto-scaling for an ECS Fargate service based on custom application metrics?", answer: "1) Publish a custom CloudWatch metric from the application (e.g., queue depth, requests per task). 2) Create an Application Auto Scaling target for the ECS service: 'aws application-autoscaling register-scalable-target --service-namespace ecs --resource-id service/cluster/service --scalable-dimension ecs:service:DesiredCount'. 3) Create a scaling policy using the custom metric: TargetTrackingScaling targets a specific metric value, StepScaling fires at specific thresholds. 4) Set scale-out cooldown (e.g., 60s) and scale-in cooldown (e.g., 300s) to prevent flapping. 5) Also configure CPU and memory-based scaling as baseline policies.", difficulty: "senior" as const },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 6 — DevOps Services
    // ─────────────────────────────────────────
    {
      id: "aws-devops-services",
      title: "AWS DevOps Services",
      description: "CloudFormation, CodePipeline, CodeBuild, CodeDeploy, and Systems Manager.",
      level: "intermediate",
      lessons: [
        {
          id: "cloudformation",
          title: "CloudFormation Infrastructure as Code",
          description: "Stacks, templates, change sets, nested stacks, and drift detection.",
          type: "lesson",
          duration: 22,
          objectives: [
            "Write a CloudFormation template for a web application",
            "Use change sets to preview infrastructure changes",
            "Detect and remediate stack drift",
            "Organise stacks with nested stacks and StackSets",
          ],
          content: `## CloudFormation Infrastructure as Code

CloudFormation is AWS's native IaC service. You describe the desired state of your AWS resources in a JSON or YAML template, and CloudFormation figures out how to create, update, or delete resources to match that state. It handles dependency ordering, rollback on failure, and drift detection.

## How CloudFormation Works Internally

\`\`\`
You submit a template → CloudFormation:

1. Parses and validates the template (syntax, resource types, required properties)
2. Builds a dependency graph from resource references (!Ref, !GetAtt, DependsOn)
3. Determines which resources to create/update/delete (compared to existing stack)
4. Creates a change set (plan) — what actions will be taken
5. Executes changes in dependency order:
   - Resources with no dependencies are created first (in parallel)
   - Resources that depend on them are created after
6. On failure: automatically rolls back all changes made in that update

Key insight: CloudFormation is not sequential — it's a dependency graph executor.
Resources that don't depend on each other are created in parallel.
\`\`\`

## CloudFormation vs Terraform — When to Use Each

Both are mature IaC tools. The right choice depends on your context:

\`\`\`
CloudFormation:
  ✅ Native AWS — free, no backend to manage, integrated with IAM/Organizations
  ✅ StackSets for multi-account/region deployments (powerful for enterprise)
  ✅ Drift detection built-in
  ✅ Change sets = built-in plan/apply workflow
  ❌ AWS only — can't manage GitHub, Datadog, PagerDuty alongside AWS resources
  ❌ Verbose YAML/JSON — more lines than equivalent Terraform HCL
  ❌ Stack state in AWS (can become corrupted; recovery is painful)

Terraform:
  ✅ Multi-cloud and multi-provider — AWS + GitHub + Cloudflare in one plan
  ✅ More concise HCL syntax
  ✅ Rich ecosystem of modules (terraform-aws-modules/*)
  ✅ Explicit state file gives full control
  ❌ State backend needs to be set up (S3 + DynamoDB for locking)
  ❌ Paid features for enterprise (Sentinel, team management in Terraform Cloud)

Recommendation:
  AWS-only, enterprise organization → CloudFormation + StackSets
  Multi-provider, startup/team → Terraform
  Many teams use both: CloudFormation for account baseline (via StackSets),
                       Terraform for application infrastructure
\`\`\`

## Stack vs StackSet — Organizational Scale

\`\`\`
Stack: Single CloudFormation deployment in one account + one region

StackSet: Deploy the same template across multiple accounts and/or regions
  from one management account — with drift detection and automatic deployment
  to new accounts that join the organization

Use StackSets for:
  - Security baseline (CloudTrail, Config, GuardDuty enabled everywhere)
  - Default VPC deletion (remove insecure default VPC from all accounts)
  - IAM password policy enforcement
  - Organization-wide S3 block public access settings
\`\`\`

---

## Template Structure

\`\`\`yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: Web application stack

Parameters:
  Environment:
    Type: String
    AllowedValues: [dev, staging, production]
    Default: dev
  InstanceType:
    Type: String
    Default: t3.small

Mappings:
  EnvConfig:
    dev:
      MinSize: 1
      MaxSize: 2
    production:
      MinSize: 2
      MaxSize: 10

Conditions:
  IsProduction: !Equals [!Ref Environment, production]

Resources:
  AppSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: App server SG
      VpcId: !ImportValue SharedVPC-VPCID
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 3000
          ToPort: 3000
          SourceSecurityGroupId: !ImportValue SharedVPC-ALBSGID

  AppASG:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      MinSize: !FindInMap [EnvConfig, !Ref Environment, MinSize]
      MaxSize: !FindInMap [EnvConfig, !Ref Environment, MaxSize]
      DesiredCapacity: !FindInMap [EnvConfig, !Ref Environment, MinSize]
      LaunchTemplate:
        LaunchTemplateId: !Ref AppLaunchTemplate
        Version: !GetAtt AppLaunchTemplate.LatestVersionNumber
      VPCZoneIdentifier:
        - !ImportValue SharedVPC-PrivateSubnet1
        - !ImportValue SharedVPC-PrivateSubnet2
      TargetGroupARNs:
        - !Ref AppTargetGroup
    UpdatePolicy:
      AutoScalingRollingUpdate:
        MinInstancesInService: 1
        MaxBatchSize: 1

  # Only create alarm in production
  HighCPUAlarm:
    Type: AWS::CloudWatch::Alarm
    Condition: IsProduction
    Properties:
      AlarmName: !Sub "\${AWS::StackName}-high-cpu"
      MetricName: CPUUtilization
      Namespace: AWS/EC2
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 80
      ComparisonOperator: GreaterThanThreshold

Outputs:
  AppURL:
    Value: !Sub "https://\${AppALB.DNSName}"
    Export:
      Name: !Sub "\${AWS::StackName}-AppURL"
\`\`\`

---

## CLI Operations

\`\`\`bash
# Validate template
aws cloudformation validate-template --template-body file://template.yaml

# Create stack
aws cloudformation create-stack \
  --stack-name myapp-production \
  --template-body file://template.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=production \
    ParameterKey=InstanceType,ParameterValue=t3.small \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --on-failure DO_NOTHING  # ROLLBACK | DELETE | DO_NOTHING

aws cloudformation wait stack-create-complete --stack-name myapp-production

# Create a Change Set (preview changes before applying)
aws cloudformation create-change-set \
  --stack-name myapp-production \
  --change-set-name update-instance-type \
  --template-body file://template-v2.yaml \
  --parameters ParameterKey=Environment,ParameterValue=production

# Review the change set
aws cloudformation describe-change-set \
  --stack-name myapp-production \
  --change-set-name update-instance-type \
  --query 'Changes[*].ResourceChange.{Action:Action,Resource:LogicalResourceId,Type:ResourceType}'

# Execute (or delete to cancel)
aws cloudformation execute-change-set \
  --stack-name myapp-production \
  --change-set-name update-instance-type

# Detect drift
aws cloudformation detect-stack-drift --stack-name myapp-production
aws cloudformation describe-stack-drift-detection-status \
  --stack-drift-detection-id <id>
aws cloudformation describe-stack-resource-drifts \
  --stack-name myapp-production \
  --stack-resource-drift-status MODIFIED

# Delete stack
aws cloudformation delete-stack --stack-name myapp-production
aws cloudformation wait stack-delete-complete --stack-name myapp-production
\`\`\`

---

## Useful CloudFormation Patterns

\`\`\`bash
# Export stack outputs for cross-stack references
# In stack A:
Outputs:
  VPCID:
    Value: !Ref VPC
    Export:
      Name: MyVPC-VPCID

# In stack B:
Resources:
  Subnet:
    Properties:
      VpcId: !ImportValue MyVPC-VPCID

# List all exports
aws cloudformation list-exports \
  --query 'Exports[*].{Name:Name,Value:Value}' --output table

# List all stack resources
aws cloudformation list-stack-resources \
  --stack-name myapp-production \
  --query 'StackResourceSummaries[*].{Logical:LogicalResourceId,Physical:PhysicalResourceId,Status:ResourceStatus}' \
  --output table
\`\`\`

---

## Custom Resources (Extending CloudFormation)

CloudFormation doesn't support every AWS feature or third-party service. Custom Resources let you extend it with Lambda:

\`\`\`yaml
# Custom Resource backed by Lambda
Resources:
  GenerateSecretKey:
    Type: AWS::CloudFormation::CustomResource
    Properties:
      ServiceToken: !GetAtt SecretGeneratorFunction.Arn  # Lambda ARN
      Length: 32
      # Any properties here are passed to the Lambda as event.ResourceProperties

  # Use the result in other resources
  AppSecret:
    Type: AWS::SecretsManager::Secret
    Properties:
      SecretString: !GetAtt GenerateSecretKey.SecretKey  # return value from Lambda
\`\`\`

\`\`\`bash
# Custom Resource Lambda must respond to CloudFormation with success/failure
# Common use cases:
# - Generate random values (passwords, API keys) at deploy time
# - Register DNS records in external providers
# - Trigger database migrations on stack update
# - Wait for external systems to be ready before proceeding
# - Clean up resources that CloudFormation doesn't know about
\`\`\`

---

## Nested Stacks and Cross-Stack References

\`\`\`yaml
# Breaking large templates into nested stacks
Resources:
  VPCStack:
    Type: AWS::CloudFormation::Stack
    Properties:
      TemplateURL: https://s3.amazonaws.com/my-templates/vpc.yaml
      Parameters:
        Environment: !Ref Environment

  DatabaseStack:
    Type: AWS::CloudFormation::Stack
    DependsOn: VPCStack
    Properties:
      TemplateURL: https://s3.amazonaws.com/my-templates/rds.yaml
      Parameters:
        VpcId: !GetAtt VPCStack.Outputs.VpcId
        SubnetIds: !GetAtt VPCStack.Outputs.PrivateSubnetIds
\`\`\`

**Nested stacks vs. cross-stack references:**
- **Nested stacks**: parent-child relationship, parent manages lifecycle of children
- **Cross-stack references** (\`!ImportValue\`): stacks are independent, outputs exported by name — use for shared infrastructure (VPCs, security groups) referenced by many application stacks

---

## Common CloudFormation Pitfalls

**UPDATE_ROLLBACK_FAILED:** If a stack update fails AND the rollback fails, the stack is stuck in a terminal state. Common causes: the resource was deleted manually between the update and rollback, or an IAM permission that was present for the update was removed. Recovery requires manually fixing the resource state and then calling \`continue-update-rollback\`.

**Replacement vs Update:** Some resource property changes require resource replacement (delete + recreate). CloudFormation will delete the old resource before creating the new one. For databases, this is catastrophic. Always check the change set for \`Replacement: True\` before executing. Set \`DeletionPolicy: Retain\` on critical resources.

**Not enabling termination protection:** Any principal with \`cloudformation:DeleteStack\` can destroy your stack. Enable termination protection on production stacks. Add an SCP to deny \`cloudformation:DeleteStack\` for production accounts.

**\`cfn-init\` vs user data:** \`cfn-init\` runs once and has a signal mechanism — the instance can tell CloudFormation when initialization is complete or failed. User data also runs once but CloudFormation doesn't know if it succeeded. For instances in a CloudFormation stack, use \`cfn-init\` + \`cfn-signal\` for proper lifecycle management.

> **Tip:** Always use **change sets** in production — never \`update-stack\` directly. A change set is like \`terraform plan\`: review exactly what will be created, modified, or deleted before committing. The few seconds it takes saves hours of incident response.`,
          interviewQuestions: [
            {
              question: "What is AWS CloudFormation drift detection and when should you use it?",
              difficulty: "mid" as const,
              answer: `**Drift** occurs when someone manually changes a CloudFormation-managed resource (via console, CLI, SDK) without updating the CloudFormation template.

**When to detect:**
\`\`\`bash
# Detect drift on a stack:
aws cloudformation detect-stack-drift --stack-name prod-stack

# Get drift status (takes a minute):
aws cloudformation describe-stack-drift-detection-status \\
  --stack-drift-detection-id <id>

# See what drifted:
aws cloudformation describe-stack-resource-drifts \\
  --stack-name prod-stack \\
  --stack-resource-drift-status-filters MODIFIED DELETED
\`\`\`

**What it tells you:**
- Which resources differ from the template
- What properties changed (e.g., security group rule added manually)
- Whether resources were deleted outside CloudFormation

**Common scenarios where drift happens:**
- Ops team adds a security group rule during an incident (quick fix, forgot to update template)
- Developer changes instance type in console to debug a performance issue
- IAM policies modified manually to grant temporary access

**Remediation options:**
1. **Update template to match reality** — if the manual change was intentional
2. **Run stack update** — to revert drift back to template definition
3. **Prevent drift** — CloudFormation Stack Policies to prevent direct resource modifications

**Automated drift detection in CI:**
\`\`\`bash
# Weekly drift check in CloudWatch Events → Lambda → SNS alert
# If drift found, create PagerDuty incident or GitHub issue
\`\`\`

**Terraform equivalent:** \`terraform plan\` always shows drift — it's built in to the workflow.`,
            },
          ],
        },
        {
          id: "codepipeline",
          title: "CodePipeline & CodeBuild",
          description: "Build a CI/CD pipeline with CodePipeline, CodeBuild, and automated deployments.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Create a CodeBuild project to build and test code",
            "Wire CodePipeline with GitHub, CodeBuild, and ECS deployment",
            "Add manual approval gates for production deployments",
            "Monitor pipeline executions via CLI",
          ],
          content: `## CodePipeline & CodeBuild

AWS CodePipeline orchestrates CI/CD workflows — it's the glue connecting your source code repository, build system, test environments, and deployment targets. CodeBuild provides managed, ephemeral build environments that scale automatically and cost nothing when idle (pay per build minute).

## How CodePipeline Works

\`\`\`
Pipeline execution triggered by:
  - Source code push (GitHub, CodeCommit, S3 object change)
  - Manual trigger
  - Scheduled trigger (EventBridge)

Pipeline stages execute sequentially:
  Source → [Build/Test → ...] → [Approval] → Deploy

Artifacts (files passed between stages):
  Each stage can produce output artifacts stored in S3
  Next stages consume those artifacts as inputs
  This S3 bucket is the "pipeline state" — don't delete it

Action types per stage:
  Source:   CodeCommit, GitHub, Bitbucket, S3
  Build:    CodeBuild, Jenkins (custom action)
  Test:     CodeBuild, Device Farm, custom
  Deploy:   CodeDeploy, ECS, Elastic Beanstalk, S3, CloudFormation
  Approval: Manual (human clicks Approve in Console/Slack/email)
  Invoke:   Lambda (for custom actions)
\`\`\`

## CodeBuild Compute Types and When to Use Each

\`\`\`
BUILD_GENERAL1_SMALL:   3 GB RAM, 2 vCPU   → $0.005/min — unit tests, linting
BUILD_GENERAL1_MEDIUM:  7 GB RAM, 4 vCPU   → $0.01/min  — Docker builds, integration tests
BUILD_GENERAL1_LARGE:   15 GB RAM, 8 vCPU  → $0.02/min  — large builds, parallel test suites
BUILD_GENERAL1_2XLARGE: 145 GB RAM, 72 vCPU → $0.20/min — very large builds, ML model builds

ARM compute (Graviton — same price as Intel, often faster):
BUILD_GENERAL1_SMALL (arm1):  4 GB RAM, 2 vCPU
BUILD_GENERAL1_LARGE (arm1): 16 GB RAM, 8 vCPU

GPU compute (for ML builds):
BUILD_GENERAL1_SMALL (gpu1):  16 GB RAM, 4 vCPU, 1 NVIDIA T4 GPU

Tip: Cache your build dependencies (node_modules, .m2, pip cache)
     in S3 to cut build times by 50-80%.
\`\`\`

---

## CodeBuild Project

\`\`\`bash
# buildspec.yml — lives in your repository root
version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 20
    commands:
      - npm ci

  pre_build:
    commands:
      - echo Logging in to ECR...
      - aws ecr get-login-password --region \$AWS_DEFAULT_REGION
          | docker login --username AWS --password-stdin \$ECR_REGISTRY
      - npm run lint
      - npm test

  build:
    commands:
      - docker build -t \$IMAGE_REPO_NAME:\$IMAGE_TAG .
      - docker tag \$IMAGE_REPO_NAME:\$IMAGE_TAG \$ECR_REGISTRY/\$IMAGE_REPO_NAME:\$IMAGE_TAG

  post_build:
    commands:
      - docker push \$ECR_REGISTRY/\$IMAGE_REPO_NAME:\$IMAGE_TAG
      - printf '[{"name":"myapp","imageUri":"%s"}]' \$ECR_REGISTRY/\$IMAGE_REPO_NAME:\$IMAGE_TAG > imagedefinitions.json

artifacts:
  files:
    - imagedefinitions.json
\`\`\`

\`\`\`bash
# Create CodeBuild project
aws codebuild create-project \
  --name myapp-build \
  --source '{
    "type": "GITHUB",
    "location": "https://github.com/myorg/myapp",
    "buildspec": "buildspec.yml"
  }' \
  --environment '{
    "type": "LINUX_CONTAINER",
    "image": "aws/codebuild/standard:7.0",
    "computeType": "BUILD_GENERAL1_SMALL",
    "privilegedMode": true,
    "environmentVariables": [
      {"name":"ECR_REGISTRY","value":"123456789012.dkr.ecr.us-east-1.amazonaws.com","type":"PLAINTEXT"},
      {"name":"IMAGE_REPO_NAME","value":"myapp","type":"PLAINTEXT"},
      {"name":"IMAGE_TAG","value":"latest","type":"PLAINTEXT"},
      {"name":"DB_PASSWORD","value":"/myapp/db_password","type":"PARAMETER_STORE"}
    ]
  }' \
  --service-role arn:aws:iam::123456789012:role/CodeBuildServiceRole \
  --artifacts '{"type":"NO_ARTIFACTS"}'
\`\`\`

---

## CodePipeline

\`\`\`bash
# pipeline.json
{
  "pipeline": {
    "name": "myapp-pipeline",
    "roleArn": "arn:aws:iam::123456789012:role/CodePipelineRole",
    "artifactStore": {
      "type": "S3",
      "location": "my-pipeline-artifacts-123456789012"
    },
    "stages": [
      {
        "name": "Source",
        "actions": [{
          "name": "GitHub",
          "actionTypeId": {
            "category": "Source",
            "owner": "ThirdParty",
            "provider": "GitHub",
            "version": "1"
          },
          "configuration": {
            "Owner": "myorg",
            "Repo": "myapp",
            "Branch": "main",
            "OAuthToken": "{{resolve:secretsmanager:github-token}}"
          },
          "outputArtifacts": [{"name": "SourceOutput"}]
        }]
      },
      {
        "name": "Build",
        "actions": [{
          "name": "CodeBuild",
          "actionTypeId": {
            "category": "Build",
            "owner": "AWS",
            "provider": "CodeBuild",
            "version": "1"
          },
          "inputArtifacts": [{"name": "SourceOutput"}],
          "outputArtifacts": [{"name": "BuildOutput"}],
          "configuration": {"ProjectName": "myapp-build"}
        }]
      },
      {
        "name": "Approval",
        "actions": [{
          "name": "ProductionApproval",
          "actionTypeId": {
            "category": "Approval",
            "owner": "AWS",
            "provider": "Manual",
            "version": "1"
          },
          "configuration": {
            "NotificationArn": "arn:aws:sns:us-east-1:123456789012:deployments",
            "CustomData": "Please review the staging environment before approving."
          }
        }]
      },
      {
        "name": "Deploy",
        "actions": [{
          "name": "ECS",
          "actionTypeId": {
            "category": "Deploy",
            "owner": "AWS",
            "provider": "ECS",
            "version": "1"
          },
          "inputArtifacts": [{"name": "BuildOutput"}],
          "configuration": {
            "ClusterName": "production",
            "ServiceName": "myapp",
            "FileName": "imagedefinitions.json"
          }
        }]
      }
    ]
  }
}

# Create the pipeline
aws codepipeline create-pipeline --cli-input-json file://pipeline.json
\`\`\`

---

## Pipeline CLI Operations

\`\`\`bash
# Trigger a pipeline manually
aws codepipeline start-pipeline-execution --name myapp-pipeline

# Get pipeline state (shows current stage and status)
aws codepipeline get-pipeline-state --name myapp-pipeline \
  --query 'stageStates[*].{Stage:stageName,Status:latestExecution.status}'

# List recent executions with status
aws codepipeline list-pipeline-executions --pipeline-name myapp-pipeline \
  --query 'pipelineExecutionSummaries[0:5].{
    ID:pipelineExecutionId,
    Status:status,
    Started:startTime,
    Trigger:trigger.triggerType
  }' --output table

# Get detailed execution information
aws codepipeline get-pipeline-execution \
  --pipeline-name myapp-pipeline \
  --pipeline-execution-id <execution-id>

# Approve a manual gate programmatically (useful for ChatOps bots)
APPROVAL=$(aws codepipeline get-pipeline-state --name myapp-pipeline \
  --query 'stageStates[?stageName==\`Approval\`].actionStates[0].latestExecution.token' \
  --output text)

aws codepipeline put-approval-result \
  --pipeline-name myapp-pipeline \
  --stage-name Approval \
  --action-name ProductionApproval \
  --result '{"summary":"LGTM — staging verified","status":"Approved"}' \
  --token $APPROVAL

# Reject (with reason)
aws codepipeline put-approval-result \
  --pipeline-name myapp-pipeline \
  --stage-name Approval \
  --action-name ProductionApproval \
  --result '{"summary":"P1 bug found in staging — do not deploy","status":"Rejected"}' \
  --token $APPROVAL

# Retry a failed stage
aws codepipeline retry-stage-execution \
  --pipeline-name myapp-pipeline \
  --stage-name Build \
  --pipeline-execution-id <execution-id> \
  --retry-mode FAILED_ACTIONS
\`\`\`

---

## CodeDeploy — Deployment Strategies

\`\`\`bash
# Create a CodeDeploy application for ECS
aws deploy create-application \
  --application-name myapp \
  --compute-platform ECS

# Create deployment group with canary strategy
aws deploy create-deployment-group \
  --application-name myapp \
  --deployment-group-name production \
  --deployment-config-name CodeDeployDefault.ECSCanary10Percent5Minutes \
  # Shift 10% of traffic to new version, wait 5 minutes, then shift remaining 90%
  # Options:
  # ECSCanary10Percent5Minutes   — 10% canary, bake 5 min
  # ECSCanary10Percent15Minutes  — 10% canary, bake 15 min
  # ECSLinear10PercentEvery1Minute — 10% more every minute (10 min total)
  # ECSAllAtOnce                 — immediate full cutover (blue/green, no canary)
  --ecs-services '[{
    "serviceName": "myapp",
    "clusterName": "production"
  }]' \
  --load-balancer-info '{
    "targetGroupPairInfoList": [{
      "targetGroups": [
        {"name": "myapp-tg-blue"},
        {"name": "myapp-tg-green"}
      ],
      "prodTrafficRoute": {"listenerArns": ["arn:aws:elasticloadbalancing:..."]},
      "testTrafficRoute": {"listenerArns": ["arn:aws:elasticloadbalancing:..."]}
    }]
  }' \
  --auto-rollback-configuration '{
    "enabled": true,
    "events": ["DEPLOYMENT_FAILURE", "DEPLOYMENT_STOP_ON_ALARM"]
  }' \
  --alarm-configuration '{
    "enabled": true,
    "ignorePollAlarmFailure": false,
    "alarms": [{"name": "api-high-5xx-errors"}]
  }'
  # If the api-high-5xx-errors alarm fires during the deployment,
  # CodeDeploy automatically rolls back to the previous version
\`\`\`

---

## Common CodePipeline/CodeBuild Pitfalls

**Missing CAPABILITY_IAM in CloudFormation actions:** If your pipeline deploys a CloudFormation stack that creates IAM resources, you must add \`CAPABILITY_IAM\` (or \`CAPABILITY_NAMED_IAM\`) to the CloudFormation action configuration. Forgetting this causes the pipeline to fail with an unintuitive error.

**Hardcoded image tags in ECS deployments:** If your task definition uses \`image: myapp:latest\`, ECS doesn't know a new image was pushed — \`:latest\` still points to the same cached image. Use the \`imagedefinitions.json\` artifact pattern (shown in the buildspec above) where CodeBuild generates the exact digest-tagged image URI, ensuring ECS pulls the new image.

**CodeBuild without caching:** By default, CodeBuild installs dependencies from scratch on every build. For a Node.js app, \`npm install\` can take 2-3 minutes. Enable S3 caching for \`node_modules\` to reduce this to ~10 seconds.

**Secrets in environment variables (PLAINTEXT type):** Never use PLAINTEXT type for secrets in CodeBuild — they appear in CloudTrail and build logs. Use \`PARAMETER_STORE\` or \`SECRETS_MANAGER\` type — the values are fetched at runtime and masked in logs.`,
        },
      ],
      exam: [
        { question: "A CloudFormation stack update fails halfway through, leaving some resources updated and others not. What happens and how do you recover?", answer: "CloudFormation automatically rolls back the stack to the last known good state when an update fails. Resources that were updated get reverted, and CloudFormation reports the stack status as UPDATE_ROLLBACK_COMPLETE. To investigate: check the 'Events' tab in the CloudFormation console for the specific resource and error that triggered the rollback. To fix: resolve the issue in the template (e.g., fix an invalid parameter, correct IAM permissions, fix a resource configuration), then run the update again. If rollback itself fails (UPDATE_ROLLBACK_FAILED), you must manually fix the out-of-band resource and then signal CloudFormation to continue the rollback.", difficulty: "mid" as const },
        { question: "How do you safely update a CloudFormation stack that changes a database's deletion policy?", answer: "1) Use a Change Set first — create it with 'aws cloudformation create-change-set' and review 'Changes' to see what will be modified, replaced, or deleted. 2) Ensure DeletionPolicy: Retain or Snapshot is set on the RDS resource before making any changes that could trigger replacement. 3) Never change properties that force replacement (like RDS engine, subnet group) without a planned migration. 4) Enable termination protection on the stack itself. 5) Test changes in a non-production stack first with identical parameters. The Change Set preview shows 'Replacement: True' for resources that will be deleted and recreated.", difficulty: "mid" as const },
        { question: "Your CodePipeline fails at the CodeBuild stage with 'BUILD_GENERAL1_SMALL exceeded memory'. What do you do?", answer: "Increase the CodeBuild compute type: change from BUILD_GENERAL1_SMALL (3GB RAM) to BUILD_GENERAL1_MEDIUM (7GB) or BUILD_GENERAL1_LARGE (15GB). In the buildspec.yml or CodeBuild project, update the computeType under environment. Also check: 1) Are Docker layer caches being used? Enable 'cache' in the buildspec or use an S3 bucket for build cache to speed up builds and reduce memory pressure from re-downloading dependencies. 2) Are you building multiple services in parallel in the same build? Split into separate CodeBuild projects.", difficulty: "junior" as const },
        { question: "How do you implement a multi-stage deployment pipeline with automatic rollback if error rate exceeds 5%?", answer: "Use CodePipeline with CodeDeploy: 1) Pipeline stages: Source (CodeCommit/GitHub) → Build (CodeBuild) → Deploy-Staging (CodeDeploy) → Manual-Approval → Deploy-Production (CodeDeploy). 2) For production CodeDeploy, use a Blue/Green or Canary deployment configuration (e.g., 10% for 5 minutes, then 100%). 3) Configure a CloudWatch alarm on the ALB's HTTPCode_Target_5XX_Count > threshold. 4) Link the alarm to the CodeDeploy deployment group — CodeDeploy monitors alarms and automatically initiates a rollback if the alarm fires during the bake period. 5) The rollback shifts traffic back to the original (blue) deployment.", difficulty: "senior" as const },
        { question: "A CloudFormation stack shows 'DRIFT_DETECTED'. What does this mean and how do you remediate it?", answer: "Drift means resources have been modified outside CloudFormation (e.g., someone changed a security group rule via CLI or Console). Run 'aws cloudformation detect-stack-drift' and then 'describe-stack-resource-drifts' to see the specific differences. Remediation options: 1) Re-run the CloudFormation update to overwrite the manual change back to the desired state. 2) If the manual change was intentional, update the template to match and do a stack update. 3) If critical, use AWS Config or CloudTrail to identify who made the change. Prevention: Restrict IAM permissions so only CloudFormation can modify production resources, enforce with an SCP.", difficulty: "mid" as const },
        { question: "How do you securely inject secrets (database passwords) into a CodeBuild build without exposing them in logs?", answer: "Use AWS Secrets Manager or Parameter Store with CodeBuild: In the CodeBuild project environment, add an environment variable of type SECRETS_MANAGER or PARAMETER_STORE (not PLAINTEXT) referencing the secret ARN/path. CodeBuild fetches and injects the value at runtime — it's masked in CloudWatch Logs (shown as '****'). The CodeBuild service role needs secretsmanager:GetSecretValue or ssm:GetParameter permissions. Never put secrets in buildspec.yml or source code. Also useful: CodeBuild can access Secrets Manager secrets referenced in buildspec under 'env.secrets-manager'.", difficulty: "mid" as const },
        { question: "Your team wants to use Infrastructure as Code but the existing production infrastructure was built manually. How do you approach this migration?", answer: "Strategy: Import existing resources into CloudFormation rather than recreating them (which would cause downtime). 1) Use 'aws cloudformation import' with a resource import change set to bring existing resources under stack management. 2) Write the template to match the existing resource's exact configuration. 3) Create a change set of type IMPORT and verify it shows zero changes — if it would modify the resource, the import will fail. 4) After import, future changes go through CloudFormation. Alternative: Use former2 or other tools to auto-generate CloudFormation templates from existing AWS resources. Terraform has a similar 'terraform import' command.", difficulty: "senior" as const },
        { question: "What is the difference between CodeDeploy's In-Place and Blue/Green deployment strategies?", answer: "In-Place: CodeDeploy stops the application on existing EC2 instances, deploys the new version, and restarts. Faster (no new instances) but has downtime risk and rollback means re-deploying the old version. Good for: non-critical environments, apps where brief downtime is acceptable. Blue/Green: Provisions a new set of instances (green) with the new version, shifts traffic via the load balancer from blue to green, then terminates the blue fleet after the bake time. Zero downtime, instant rollback by shifting traffic back to blue. Higher cost (dual fleet during transition) but production standard. For ECS, blue/green uses new task sets rather than new EC2 instances.", difficulty: "mid" as const },
        { question: "How do you use CloudFormation StackSets to enforce a security baseline across all AWS accounts in your organization?", answer: "StackSets allow you to deploy the same CloudFormation template to multiple accounts and regions from a single management account. 1) Enable trusted access between AWS Organizations and CloudFormation. 2) Create a StackSet in the management account with your security baseline template (e.g., CloudTrail, Config, GuardDuty, default VPC deletion, IAM password policy). 3) Deploy to the organization's root OU or specific OUs — StackSets handles deployment across all member accounts. 4) Enable 'Automatic deployment' so new accounts joining the organization automatically get the baseline. 5) Use SELF_MANAGED or SERVICE_MANAGED permission model depending on your organization structure.", difficulty: "senior" as const },
        { question: "A CodePipeline pipeline is stuck in 'InProgress' at a CodeDeploy stage for 30 minutes. How do you debug?", answer: "1) Check CodeDeploy deployment details — go to CodeDeploy console, find the deployment, and check the lifecycle event logs. Common culprits: ApplicationStop script hanging, BeforeInstall failing, or the deployment agent not running. 2) SSH into target EC2 instances and check the CodeDeploy agent logs: /var/log/aws/codedeploy-agent/codedeploy-agent.log. 3) Check appspec.yml hooks — a script that doesn't exit with code 0, or hangs (missing timeout), blocks the deployment. 4) Verify the CodeDeploy agent is running: 'systemctl status codedeploy-agent'. 5) Check if the EC2 instance can reach the CodeDeploy service endpoint (needs internet access or VPC endpoint).", difficulty: "mid" as const },
      ],
    },

    // ─────────────────────────────────────────
    // ─────────────────────────────────────────
    // MODULE 7 — EKS (Elastic Kubernetes Service)
    // ─────────────────────────────────────────
    {
      id: "eks-kubernetes",
      title: "EKS — Elastic Kubernetes Service",
      level: "advanced",
      description: "Run production Kubernetes on AWS with EKS — the managed control plane used by Airbnb, Lyft, and thousands of enterprises.",
      lessons: [
        {
          id: "eks-fundamentals",
          title: "EKS Architecture & Setup",
          duration: 25,
          type: "lesson",
          description: "Understand EKS architecture, managed node groups, Fargate, and cluster setup.",
          objectives: [
            "Understand EKS control plane vs. worker nodes and what AWS manages",
            "Create an EKS cluster using eksctl and Terraform",
            "Configure managed node groups and Fargate profiles",
            "Connect kubectl to an EKS cluster with proper IAM authentication",
          ],
          content: `# EKS — Elastic Kubernetes Service

## Why EKS? The Real-World Context

Running Kubernetes yourself (kubeadm, kops) means managing etcd backups, control plane upgrades, API server HA, and certificates. **EKS eliminates this** by managing the control plane entirely.

**Who uses EKS in production:**
- **Airbnb**: Migrated from a custom infrastructure to EKS, running 1,000+ microservices
- **Lyft**: Uses EKS for their entire backend, handling millions of ride requests
- **Samsung**: Runs global IoT platform on EKS across multiple regions
- **Robinhood**: Financial trading platform on EKS with strict latency requirements

## EKS Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                     AWS Managed Control Plane                     │
│  ┌──────────────┐  ┌──────────┐  ┌────────────────────────────┐ │
│  │ kube-apiserver│  │  etcd    │  │ kube-controller-manager    │ │
│  │ (HA, 3 AZs)  │  │ (managed)│  │ kube-scheduler             │ │
│  └──────────────┘  └──────────┘  └────────────────────────────┘ │
│              AWS handles: upgrades, backups, HA                   │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ AWS VPC
┌─────────────────────────────────▼───────────────────────────────┐
│                        Your Worker Nodes                          │
│  ┌─────────────────────┐    ┌────────────────────────────────┐  │
│  │ Managed Node Group  │    │    Fargate Profile              │  │
│  │ EC2 (you choose     │    │    (serverless pods, no nodes  │  │
│  │  type, ASG managed  │    │     to manage)                 │  │
│  │  by EKS)            │    └────────────────────────────────┘  │
│  └─────────────────────┘                                         │
│  Each node runs: kubelet, kube-proxy, containerd                  │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

**What AWS manages (you don't touch):**
- Control plane EC2 instances
- etcd cluster with automated backups
- API server TLS certificates
- Control plane scaling and HA across 3 AZs
- Kubernetes version upgrades (you initiate, AWS executes)

**What you manage:**
- Worker nodes (EC2 type, count, AMI)
- Node group upgrades (managed, but you trigger)
- Add-ons (CoreDNS, kube-proxy, VPC CNI, EBS CSI driver)
- Networking (VPC, subnets, security groups)
- IAM roles for nodes and pods (IRSA)

## Creating an EKS Cluster

### Using eksctl (fastest for getting started)

\`\`\`bash
# Install eksctl:
curl --silent --location "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_\$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Create cluster with managed node group:
eksctl create cluster \\
  --name prod-cluster \\
  --version 1.29 \\
  --region us-east-1 \\
  --nodegroup-name general \\
  --node-type m5.xlarge \\
  --nodes 3 \\
  --nodes-min 2 \\
  --nodes-max 10 \\
  --managed \\
  --asg-access \\
  --external-dns-access \\
  --full-ecr-access \\
  --with-oidc        # enables IRSA (IAM Roles for Service Accounts)

# Takes 15-20 minutes. Creates:
# - VPC with public/private subnets across 3 AZs
# - EKS control plane
# - Managed node group
# - Updates ~/.kube/config automatically
\`\`\`

### Using eksctl with a config file (production approach)

\`\`\`yaml
# cluster.yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: prod-cluster
  region: us-east-1
  version: "1.29"

iam:
  withOIDC: true  # required for IRSA

vpc:
  id: vpc-0a1b2c3d  # use existing VPC
  subnets:
    private:
      us-east-1a: {id: subnet-aaa}
      us-east-1b: {id: subnet-bbb}
      us-east-1c: {id: subnet-ccc}

managedNodeGroups:
  - name: general
    instanceType: m5.xlarge
    minSize: 3
    maxSize: 15
    desiredCapacity: 3
    volumeSize: 100
    volumeType: gp3
    privateNetworking: true   # nodes in private subnets
    labels:
      role: general
    tags:
      Environment: production
    iam:
      attachPolicyARNs:
        - arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy
        - arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
        - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy

  - name: gpu-nodes
    instanceType: g4dn.xlarge
    minSize: 0
    maxSize: 5
    labels:
      role: gpu
      nvidia.com/gpu: "true"
\`\`\`

\`\`\`bash
eksctl create cluster -f cluster.yaml
\`\`\`

### Using Terraform (IaC approach — production standard)

\`\`\`hcl
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "prod-cluster"
  cluster_version = "1.29"

  vpc_id                         = module.vpc.vpc_id
  subnet_ids                     = module.vpc.private_subnets
  cluster_endpoint_public_access = true

  # Add-ons managed by EKS:
  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }

  # Enable IRSA:
  enable_irsa = true

  eks_managed_node_groups = {
    general = {
      instance_types = ["m5.xlarge"]
      min_size       = 3
      max_size       = 15
      desired_size   = 3

      block_device_mappings = {
        xvda = {
          device_name = "/dev/xvda"
          ebs = {
            volume_size           = 100
            volume_type           = "gp3"
            encrypted             = true
            delete_on_termination = true
          }
        }
      }
    }
  }
}
\`\`\`

## Connecting kubectl to EKS

\`\`\`bash
# Update kubeconfig:
aws eks update-kubeconfig \\
  --region us-east-1 \\
  --name prod-cluster

# Verify:
kubectl get nodes
# NAME                          STATUS   ROLES    AGE   VERSION
# ip-10-0-1-123.ec2.internal   Ready    <none>   5m    v1.29.0-eks-abc123

# Check cluster info:
kubectl cluster-info
kubectl version --short
\`\`\`

## IAM Roles for Service Accounts (IRSA)

**The problem:** A pod needs to write to S3. Old approach: put AWS credentials in a Secret (insecure). **IRSA solution:** Link a Kubernetes ServiceAccount to an IAM role — the pod gets temporary credentials automatically via metadata service.

\`\`\`bash
# 1. Create IAM policy:
aws iam create-policy \\
  --policy-name s3-write-policy \\
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }]
  }'

# 2. Create IAM role + ServiceAccount with eksctl:
eksctl create iamserviceaccount \\
  --name s3-writer \\
  --namespace production \\
  --cluster prod-cluster \\
  --attach-policy-arn arn:aws:iam::123456789:policy/s3-write-policy \\
  --approve \\
  --region us-east-1

# 3. Use the ServiceAccount in your pod:
\`\`\`

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: production
spec:
  template:
    spec:
      serviceAccountName: s3-writer  # binds to the IAM role
      containers:
        - name: app
          image: my-app:latest
          # No AWS credentials needed — SDK auto-discovers via IRSA
\`\`\`

## EKS Fargate — Serverless Kubernetes

\`\`\`yaml
# Fargate profile: pods matching these selectors run on Fargate
# (AWS manages the underlying EC2 — you never see the nodes)
\`\`\`

\`\`\`bash
eksctl create fargateprofile \\
  --cluster prod-cluster \\
  --name batch-jobs \\
  --namespace batch \\
  --labels type=batch
\`\`\`

**When to use Fargate:**
- Batch jobs with variable resource needs (scale to zero when no jobs)
- Isolating untrusted workloads (each pod gets its own microVM)
- Compliance requirements (no shared nodes between tenants)
- **Cost:** More expensive per-CPU than EC2, but no idle node cost

## EKS Node Group Upgrades

\`\`\`bash
# Check available K8s versions:
aws eks describe-addon-versions --query 'addons[0].addonVersions[].compatibilities[].clusterVersion' --output table

# Upgrade control plane first:
aws eks update-cluster-version \\
  --name prod-cluster \\
  --kubernetes-version 1.30

# Wait for upgrade to complete:
aws eks wait cluster-active --name prod-cluster

# Upgrade managed node group:
aws eks update-nodegroup-version \\
  --cluster-name prod-cluster \\
  --nodegroup-name general \\
  --kubernetes-version 1.30

# The node group upgrade process:
# 1. Launches new nodes with new version
# 2. Cordons and drains old nodes (respects PodDisruptionBudgets)
# 3. Terminates old nodes
# Zero-downtime when PDBs and rolling update strategy are configured
\`\`\`
`,
          interviewQuestions: [
            {
              question: "What is the difference between EKS managed node groups and self-managed nodes? When do you use Fargate?",
              difficulty: "mid" as const,
              answer: `**Self-managed nodes:** You create EC2 instances manually, join them to the cluster with bootstrap scripts. You manage: AMI updates, security patches, scaling. Full control, full responsibility.

**Managed node groups:** AWS creates and manages the EC2 instances. You define the configuration (instance type, size, min/max). AWS handles: node provisioning, automatic node repair, version upgrades (rolling). You still choose the instance type and manage IAM permissions.

**Benefits of managed node groups:**
- Nodes are automatically drained before termination (respects PodDisruptionBudgets)
- Launch templates for customization
- Automatic version upgrade with zero-downtime rolling
- AWS-optimized AMI with containerd + kubelet preconfigured

**Fargate:** Serverless — no nodes at all. Each pod runs in its own isolated microVM. AWS manages all infrastructure.

**Decision matrix:**
| | Self-managed | Managed Node Group | Fargate |
|--|--|--|--|
| Control | Full | High | None |
| Ops burden | High | Medium | None |
| GPU support | Yes | Yes | No |
| Cost | Lowest | Low | Higher |
| Use case | Custom AMIs, GPU | Standard workloads | Batch, isolation |

**When Fargate makes sense:**
- Batch jobs that run occasionally (pay only when running)
- Strict multi-tenancy (no shared hosts)
- Small teams that don't want node management
- When workloads are variable and you need scale-to-zero

**When to stick with EC2 (managed or self):**
- GPU workloads (ML training, inference)
- Spot instance strategies for 60-90% cost savings
- Workloads needing specific instance types (compute-optimized, memory-optimized)
- Stateful apps needing local NVMe storage`,
            },
            {
              question: "How does IRSA (IAM Roles for Service Accounts) work? Why is it better than storing AWS credentials as Kubernetes Secrets?",
              difficulty: "senior" as const,
              answer: `**The old way (credentials as Secrets):**
\`\`\`yaml
# Dangerous — long-lived credentials stored in etcd
apiVersion: v1
kind: Secret
data:
  AWS_ACCESS_KEY_ID: AKIAIOSFODNN7EXAMPLE  # base64 encoded
  AWS_SECRET_ACCESS_KEY: abc123...
\`\`\`
Problems: Long-lived, must be rotated manually, can be leaked via logs/env inspection, all pods on the node share the instance profile.

**IRSA — how it works:**
1. **OIDC Provider**: EKS creates an OIDC identity provider. Each cluster has a unique OIDC URL.
2. **Token projection**: Kubernetes projects a signed JWT into the pod as a file (\`/var/run/secrets/eks.amazonaws.com/serviceaccount/token\`)
3. **AWS STS**: The AWS SDK calls \`sts:AssumeRoleWithWebIdentity\` using this JWT
4. **Verification**: STS verifies the JWT with the cluster's OIDC provider
5. **Short-lived creds**: STS returns temporary credentials (1 hour)
6. **Auto-renewal**: AWS SDK automatically refreshes before expiry

\`\`\`bash
# The trust policy on the IAM role:
{
  "Effect": "Allow",
  "Principal": {"Federated": "arn:aws:iam::123456789:oidc-provider/..."},
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": {
      "oidc.eks.us-east-1.amazonaws.com/id/EXAMPLED539D4633E53DE1B71EXAMPLE:sub":
        "system:serviceaccount:production:s3-writer"
    }
  }
}
\`\`\`

**Why IRSA is better:**
- Credentials expire in 1 hour (automatic)
- Per-pod granularity (pod A gets S3 access, pod B gets DynamoDB)
- No secrets in etcd, no secrets in environment variables
- Auditable: CloudTrail shows exactly which pod assumed which role
- No rotation burden — fully automated

**Pro tip:** Combine with \`eks.amazonaws.com/role-arn\` annotation on the ServiceAccount, and the IRSA token is projected automatically — no code changes needed, just IAM and K8s configuration.`,
            },
            {
              question: "Your EKS cluster nodes are NotReady. How do you diagnose and fix this?",
              difficulty: "senior" as const,
              answer: `**Step 1 — Check node status:**
\`\`\`bash
kubectl get nodes
# NAME           STATUS     ROLES    AGE   VERSION
# ip-10-0-1-1    NotReady   <none>   5m    v1.29.0

kubectl describe node ip-10-0-1-1
# Look for: Conditions section, Events at the bottom
# Key fields: MemoryPressure, DiskPressure, PIDPressure, NetworkUnavailable
\`\`\`

**Step 2 — Check node conditions:**
\`\`\`bash
kubectl get node ip-10-0-1-1 -o jsonpath='{.status.conditions[*]}' | jq .
# Common conditions:
# NetworkUnavailable: True → VPC CNI issue
# MemoryPressure: True → OOM, pods being evicted
# DiskPressure: True → disk full, clean up images/logs
# KubeletReady: Unknown → kubelet stopped reporting
\`\`\`

**Step 3 — SSH to the node and check kubelet:**
\`\`\`bash
# Get instance ID from node name:
aws ec2 describe-instances \\
  --filters "Name=private-dns-name,Values=ip-10-0-1-1.ec2.internal" \\
  --query 'Reservations[0].Instances[0].InstanceId'

# Connect via SSM (no SSH key needed on EKS nodes):
aws ssm start-session --target i-xxx

# On the node:
systemctl status kubelet        # is kubelet running?
journalctl -u kubelet -n 50     # kubelet logs

# Check for CNI issues:
ls /etc/cni/net.d/              # CNI config files exist?
ls /opt/cni/bin/aws-cni         # VPC CNI binary installed?
cat /var/log/aws-routed-eni/ipamd.log  # VPC CNI logs
\`\`\`

**Step 4 — Common root causes:**

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| NetworkUnavailable | VPC CNI crashed/misconfigured | Restart aws-node daemonset |
| kubelet not running | Ran out of disk (logs/images) | Clean up: docker/crictl prune |
| MemoryPressure | Too many pods, OOMed | Scale out node group |
| Node unreachable | Security group blocking 10250 | Add SG rule |
| Certificate expired | Time drift | Sync NTP, rotate bootstrap token |

\`\`\`bash
# Restart VPC CNI:
kubectl rollout restart daemonset aws-node -n kube-system

# Force drain and terminate the bad node (ASG replaces it):
kubectl drain ip-10-0-1-1 --ignore-daemonsets --delete-emptydir-data
aws ec2 terminate-instances --instance-ids i-xxx
# Cluster Autoscaler or ASG will provision a healthy replacement
\`\`\``,
            },
          ],
        },
        {
          id: "eks-networking-storage",
          title: "EKS Networking, Load Balancing & Storage",
          duration: 22,
          type: "lesson",
          description: "Master AWS Load Balancer Controller, EBS/EFS CSI drivers, and VPC networking in EKS.",
          objectives: [
            "Configure AWS Load Balancer Controller for ALB and NLB integration",
            "Use EBS CSI driver for persistent storage in EKS",
            "Implement EFS for shared ReadWriteMany storage",
            "Understand VPC CNI and IP address management",
          ],
          content: `# EKS Networking, Load Balancing & Storage

## AWS Load Balancer Controller

The **AWS Load Balancer Controller** (formerly ALB Ingress Controller) provisions AWS ALBs and NLBs from Kubernetes Ingress and Service resources.

**Why it matters:** Native Kubernetes LoadBalancer services provision a Classic Load Balancer per service (expensive, no URL routing). The AWS Load Balancer Controller provisions one ALB for all your Ingress rules — massive cost savings.

\`\`\`bash
# Install via Helm:
helm repo add eks https://aws.github.io/eks-charts
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \\
  -n kube-system \\
  --set clusterName=prod-cluster \\
  --set serviceAccount.create=false \\
  --set serviceAccount.name=aws-load-balancer-controller
  # (serviceAccount pre-created with IRSA role)
\`\`\`

### ALB Ingress

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip   # route to pod IPs directly
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:...  # HTTPS
    alb.ingress.kubernetes.io/ssl-redirect: "443"
    alb.ingress.kubernetes.io/healthcheck-path: /health
    alb.ingress.kubernetes.io/group.name: shared-alb  # SHARE one ALB across multiple Ingresses
spec:
  rules:
    - host: api.myapp.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 3000
    - host: admin.myapp.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: admin-service
                port:
                  number: 8080
\`\`\`

### NLB for Non-HTTP Traffic

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: game-server
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
    service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
spec:
  type: LoadBalancer
  selector:
    app: game-server
  ports:
    - port: 7777
      protocol: UDP
\`\`\`

## VPC CNI and IP Address Planning

EKS uses the **VPC CNI plugin** — each pod gets a real VPC IP address (not an overlay network). This is unique to AWS and has important implications:

\`\`\`
AWS VPC: 10.0.0.0/16

Pod IPs come directly from your VPC subnets:
Pod 1: 10.0.1.54    ← real VPC IP (no NAT)
Pod 2: 10.0.2.183   ← real VPC IP
Pod 3: 10.0.1.92    ← real VPC IP

This means:
✅ Pods accessible from anywhere in the VPC without special routing
✅ Security groups apply directly to pods (pod-level SGs)
❌ You need enough IP space — a /24 subnet only has 254 IPs
\`\`\`

**IP exhaustion problem and solutions:**

\`\`\`bash
# Check available IPs per subnet:
aws ec2 describe-subnets \\
  --subnet-ids subnet-xxx \\
  --query 'Subnets[0].AvailableIpAddressCount'

# Solution 1: Custom CIDR blocks for pods (prefix delegation)
kubectl set env daemonset aws-node -n kube-system \\
  ENABLE_PREFIX_DELEGATION=true \\
  WARM_PREFIX_TARGET=1
# Each node gets a /28 prefix (16 IPs) from the subnet, not individual IPs
# Dramatically increases pod density per node

# Solution 2: Secondary CIDR block (add 100.64.0.0/16 to VPC)
aws ec2 associate-vpc-cidr-block \\
  --vpc-id vpc-xxx \\
  --cidr-block 100.64.0.0/16
# Create subnets in this CIDR for pods only
\`\`\`

## EBS CSI Driver — Persistent Storage

\`\`\`yaml
# StorageClass for gp3 SSD (default after EBS CSI driver install)
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp3
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer  # provision in same AZ as pod
reclaimPolicy: Retain   # don't delete EBS volume when PVC deleted
parameters:
  type: gp3
  encrypted: "true"
  kmsKeyId: arn:aws:kms:...  # encrypt with your KMS key
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data
spec:
  accessModes: [ReadWriteOnce]   # EBS can only attach to ONE node
  storageClassName: gp3
  resources:
    requests:
      storage: 100Gi
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: [ReadWriteOnce]
        storageClassName: gp3
        resources:
          requests:
            storage: 100Gi
\`\`\`

## EFS CSI Driver — Shared Storage

EFS provides **ReadWriteMany** — multiple pods across multiple nodes can mount the same filesystem simultaneously. EBS cannot do this.

\`\`\`bash
# Create EFS filesystem:
EFS_ID=$(aws efs create-file-system \\
  --performance-mode generalPurpose \\
  --throughput-mode elastic \\
  --encrypted \\
  --query 'FileSystemId' --output text)

# Create mount targets in each AZ:
for SUBNET in subnet-aaa subnet-bbb subnet-ccc; do
  aws efs create-mount-target \\
    --file-system-id \$EFS_ID \\
    --subnet-id \$SUBNET \\
    --security-groups sg-xxx
done
\`\`\`

\`\`\`yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: efs-sc
provisioner: efs.csi.aws.com
parameters:
  provisioningMode: efs-ap
  fileSystemId: fs-xxxxx
  directoryPerms: "700"
---
# Use case: shared ML training data mounted by multiple GPU pods
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: training-data
spec:
  accessModes: [ReadWriteMany]   # multiple pods across nodes
  storageClassName: efs-sc
  resources:
    requests:
      storage: 1Ti
\`\`\`
`,
          interviewQuestions: [
            {
              question: "Your EKS pods are running out of IP addresses. How do you diagnose and fix it?",
              difficulty: "senior" as const,
              answer: `**Diagnosis:**
\`\`\`bash
# Symptom: pods stuck in Pending, event says:
# "0/3 nodes are available: 3 Insufficient pods"
# OR
# CNI error: "failed to assign an IP address to container"

# Check node IP capacity:
kubectl describe node ip-10-0-1-1 | grep -A5 "Allocatable"
# pods: 110  ← default max pods per node
# This is limited by ENIs and IPs per ENI

# Check per-node pod count:
kubectl get pods --all-namespaces -o wide | awk '{print \$8}' | sort | uniq -c | sort -rn
# Node with 110/110 pods → IP exhaustion on that node

# Check subnet available IPs:
aws ec2 describe-subnets --subnet-ids subnet-xxx \\
  --query 'Subnets[0].AvailableIpAddressCount'
\`\`\`

**Understanding the limit:** Each EC2 instance type has a max number of ENIs and IPs per ENI. E.g., m5.xlarge has 4 ENIs × 15 IPs = 60 IPs → max ~58 pods (2 reserved for node).

**Solutions:**

**Option 1 — Scale out node group (short-term):**
\`\`\`bash
aws eks update-nodegroup-config \\
  --cluster-name prod-cluster \\
  --nodegroup-name general \\
  --scaling-config desiredSize=10,minSize=5,maxSize=20
\`\`\`

**Option 2 — Enable prefix delegation (best long-term):**
\`\`\`bash
# Each node gets a /28 block (16 IPs) instead of individual IPs
# m5.xlarge: 4 ENIs × 15 prefixes × 16 IPs = 960 possible pod IPs!
kubectl set env daemonset aws-node -n kube-system \\
  ENABLE_PREFIX_DELEGATION=true \\
  WARM_PREFIX_TARGET=1
kubectl rollout restart daemonset aws-node -n kube-system
\`\`\`

**Option 3 — Larger subnets (infrastructure change):**
\`\`\`bash
# /24 subnet = 254 IPs. For 100 pods with buffer, need /22 or larger
# Add secondary CIDR: 100.64.0.0/16 to VPC (100K+ IPs)
# Create new subnets in secondary CIDR for pods
\`\`\`

**Option 4 — Use Fargate for suitable workloads:**
Fargate pods don't consume node IP capacity.`,
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 8 — Monitoring, Security & Cost
    // ─────────────────────────────────────────
    {
      id: "aws-monitoring-security",
      title: "Monitoring, Security & Cost",
      description: "CloudWatch, CloudTrail, GuardDuty, Config, Cost Explorer, and Budgets.",
      level: "intermediate",
      lessons: [
        {
          id: "cloudwatch",
          title: "CloudWatch Monitoring",
          description: "Metrics, alarms, dashboards, log insights, and composite alarms.",
          type: "lesson",
          duration: 18,
          objectives: [
            "Create CloudWatch alarms for EC2, RDS, and Lambda",
            "Query logs with CloudWatch Logs Insights",
            "Build a CloudWatch dashboard via CLI",
            "Set up anomaly detection alarms",
          ],
          content: `## CloudWatch Monitoring

CloudWatch is AWS's native observability platform. It handles metrics collection, log aggregation, alarm evaluation, dashboards, and automated actions — all in one service. Understanding its architecture helps you design effective monitoring strategies.

## How CloudWatch Metrics Work

\`\`\`
Metric = a named data stream associated with a namespace and dimensions

Namespace: AWS service or your application (e.g., AWS/EC2, MyApp/Orders)
MetricName: What you're measuring (CPUUtilization, OrdersProcessed)
Dimensions: Qualifiers that identify the source (InstanceId=i-xxx, Env=prod)

Metric resolution:
  Standard metrics: 1-minute minimum (5-minute default for basic monitoring)
  High-resolution custom metrics: 1-second resolution (extra cost)
  Most AWS service metrics (EC2, RDS, ALB): 1-minute resolution

Storage:
  Data points aggregated to 1-minute: stored for 15 days
  Data points aggregated to 5-minute: stored for 63 days
  Data points aggregated to 1-hour: stored for 455 days
  You CANNOT get 1-minute data for events 16+ days ago

Alarms:
  Evaluate the metric every Period seconds
  Enter ALARM state after EvaluationPeriods consecutive breaches
  Actions: SNS notification, Auto Scaling policy, EC2 recovery, Systems Manager
\`\`\`

## CloudWatch Logs Insights Query Language

Logs Insights is a powerful query engine for your CloudWatch log groups. It's far more capable than basic \`filter-log-events\`.

\`\`\`
Key commands:
  fields @timestamp, @message  - display fields
  filter @message like /ERROR/  - filter by regex or comparison
  parse @message "* [*] *" as level, requestId, msg  - extract fields with pattern
  stats count(*) by bin(5m)    - aggregate (count, avg, min, max, percentile)
  sort @timestamp desc         - sort results
  limit 100                    - limit output rows

Percentile syntax: percentile(latency, 99) as p99

Example: Find the most common error messages:
  filter @message like /Exception/
  | parse @message "* Exception: *" as ts, errorMsg
  | stats count(*) as occurrences by errorMsg
  | sort occurrences desc
  | limit 20
\`\`\`

---

## Creating Alarms

\`\`\`bash
# EC2 CPU alarm → SNS notification
aws cloudwatch put-metric-alarm \
  --alarm-name "ec2-high-cpu" \
  --alarm-description "EC2 CPU > 80% for 5 minutes" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --statistic Average \
  --period 60 \
  --evaluation-periods 5 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:ops-alerts \
  --ok-actions arn:aws:sns:us-east-1:123456789012:ops-alerts \
  --treat-missing-data notBreaching

# Lambda error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "lambda-error-rate" \
  --metrics '[
    {"Id":"errors","MetricStat":{"Metric":{"Namespace":"AWS/Lambda","MetricName":"Errors","Dimensions":[{"Name":"FunctionName","Value":"my-function"}]},"Period":60,"Stat":"Sum"}},
    {"Id":"invocations","MetricStat":{"Metric":{"Namespace":"AWS/Lambda","MetricName":"Invocations","Dimensions":[{"Name":"FunctionName","Value":"my-function"}]},"Period":60,"Stat":"Sum"}},
    {"Id":"errorRate","Expression":"errors/invocations*100","Label":"Error Rate %"}
  ]' \
  --comparison-operator GreaterThanThreshold \
  --threshold 5 \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:ops-alerts

# RDS freeable memory alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "rds-low-memory" \
  --metric-name FreeableMemory \
  --namespace AWS/RDS \
  --dimensions Name=DBInstanceIdentifier,Value=my-aurora-writer \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 256000000 \
  --comparison-operator LessThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:ops-alerts
\`\`\`

---

## CloudWatch Logs Insights

\`\`\`bash
# Query Lambda errors
aws logs start-query \
  --log-group-name /aws/lambda/my-function \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string '
    fields @timestamp, @message
    | filter @message like /ERROR/
    | sort @timestamp desc
    | limit 50
  '

# Get the query results
aws logs get-query-results --query-id <query-id>

# P99 latency for API Gateway
aws logs start-query \
  --log-group-name /aws/apigateway/my-api \
  --start-time $(date -d '24 hours ago' +%s) \
  --end-time $(date +%s) \
  --query-string '
    fields @timestamp, responseLatency
    | stats
      count(*) as requests,
      avg(responseLatency) as p50,
      percentile(responseLatency, 95) as p95,
      percentile(responseLatency, 99) as p99
      by bin(5m)
  '
\`\`\`

---

## Custom Metrics

\`\`\`bash
# Push a custom metric from application code
aws cloudwatch put-metric-data \
  --namespace "MyApp/Orders" \
  --metric-name OrdersProcessed \
  --value 42 \
  --unit Count \
  --dimensions Environment=production,Region=us-east-1

# From a script
for i in {1..5}; do
  aws cloudwatch put-metric-data \
    --namespace "MyApp/Queue" \
    --metric-name QueueDepth \
    --value $(redis-cli llen orders_queue) \
    --unit Count
  sleep 60
done
\`\`\`

---

## Composite Alarms and Anomaly Detection

\`\`\`bash
# Composite alarm: alert only when BOTH error rate AND latency are high
# (reduces false positives — high latency alone might be a blip)
aws cloudwatch put-composite-alarm \
  --alarm-name "api-degraded" \
  --alarm-rule "ALARM(api-high-5xx) AND ALARM(api-high-latency)" \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:oncall-pagerduty \
  --ok-actions arn:aws:sns:us-east-1:123456789012:oncall-pagerduty

# Anomaly detection: alarm when metric deviates from its normal pattern
# ML model learns the metric's baseline (time-of-day, day-of-week patterns)
aws cloudwatch put-metric-alarm \
  --alarm-name "api-anomalous-request-count" \
  --metrics '[
    {"Id":"m1","MetricStat":{"Metric":{"Namespace":"AWS/ApplicationELB",
      "MetricName":"RequestCount","Dimensions":[{"Name":"LoadBalancer","Value":"app/my-alb/..."}]},
      "Period":300,"Stat":"Sum"}},
    {"Id":"t1","Expression":"ANOMALY_DETECTION_BAND(m1, 2)","Label":"Expected Band"}
  ]' \
  --comparison-operator GreaterThanUpperThreshold \
  --threshold-metric-id t1 \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:ops-alerts
# This alarm fires when request count is more than 2 standard deviations above normal
\`\`\`

---

## Container Insights and X-Ray Integration

\`\`\`bash
# Enable Container Insights on ECS cluster (adds CPU, memory, network per task)
aws ecs update-cluster-settings \
  --cluster production \
  --settings name=containerInsights,value=enabled

# Check Container Insights metrics
aws cloudwatch get-metric-statistics \
  --namespace ECS/ContainerInsights \
  --metric-name MemoryUtilized \
  --dimensions Name=ClusterName,Value=production Name=ServiceName,Value=myapp \
  --statistics Average \
  --period 300 \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S)

# Enable X-Ray tracing on Lambda (traces request flow across services)
aws lambda update-function-configuration \
  --function-name my-api-handler \
  --tracing-config Mode=Active  # Active = sample every request (dev)
                                 # PassThrough = honor incoming X-Ray header

# Get X-Ray service map (shows latency between services)
aws xray get-service-graph \
  --start-time $(date -u -d '1 hour ago' +%s) \
  --end-time $(date -u +%s) \
  --query 'Services[*].{Name:Name,Type:Type,AvgLatency:SummaryStatistics.TotalResponseTime}'
\`\`\`

---

## CloudWatch Dashboard

\`\`\`bash
aws cloudwatch put-dashboard \
  --dashboard-name "Production-Overview" \
  --dashboard-body '{
    "widgets": [
      {
        "type": "metric",
        "x": 0, "y": 0, "width": 12, "height": 6,
        "properties": {
          "title": "EC2 CPU Utilization",
          "metrics": [["AWS/EC2","CPUUtilization","AutoScalingGroupName","my-app-asg"]],
          "period": 60,
          "stat": "Average",
          "view": "timeSeries"
        }
      },
      {
        "type": "alarm",
        "x": 12, "y": 0, "width": 12, "height": 6,
        "properties": {
          "title": "Active Alarms",
          "alarms": [
            "arn:aws:cloudwatch:us-east-1:123456789012:alarm:ec2-high-cpu",
            "arn:aws:cloudwatch:us-east-1:123456789012:alarm:rds-low-memory"
          ]
        }
      }
    ]
  }'
\`\`\`

---

## Common CloudWatch Pitfalls

**Default monitoring vs. detailed monitoring on EC2:** By default, EC2 metrics are reported every 5 minutes (basic monitoring). Enable detailed monitoring for 1-minute resolution — it costs $3.50/instance/month but is essential for fast-responding Auto Scaling policies and catching short spikes.

**The missing-data alarm trap:** When an EC2 instance is stopped or terminated, its metrics stop flowing. If your alarm treats missing data as \`INSUFFICIENT_DATA\` (the default), the alarm never enters ALARM state — and you never get notified that the instance is gone. Use \`--treat-missing-data breaching\` for health-check-style alarms.

**Not setting OK actions:** Alarms that notify on ALARM but not on OK state leave your team uncertain about recovery. Always set \`--ok-actions\` to the same SNS topic so the team knows when the issue resolved.

**Logs Insights query cost:** Every query scans the log data for the time range you specify. Scanning 100GB of logs repeatedly gets expensive. Use specific time ranges, filter early in your query, and consider moving infrequently queried logs to S3 + Athena.`,
        },
        {
          id: "security-and-cost",
          title: "Security Services & Cost Management",
          description: "GuardDuty, Security Hub, Config, Cost Explorer, and Budgets.",
          type: "lesson",
          duration: 18,
          objectives: [
            "Enable GuardDuty and investigate findings",
            "Set up AWS Config rules for compliance checking",
            "Analyse costs with Cost Explorer CLI",
            "Create Budget alerts to prevent cost overruns",
          ],
          content: `## Security Services & Cost Management

AWS provides a comprehensive set of native security services. Together, they form a layered defense: GuardDuty detects active threats, Security Hub aggregates findings, Config ensures compliance, CloudTrail audits every API call, and Organizations + SCPs prevent misconfigurations from ever happening.

## The AWS Security Stack — Understanding What Each Service Does

\`\`\`
Prevention (stop bad things before they happen):
  IAM + SCPs       → who can do what (authorization)
  Security Groups  → what network traffic is allowed
  S3 Block Public  → prevent accidental data exposure
  AWS Config       → detect non-compliant configurations

Detection (know when something bad is happening):
  GuardDuty        → ML threat detection (anomalous API calls, crypto mining, etc.)
  CloudTrail       → full audit log of every API call
  VPC Flow Logs    → network traffic records
  Security Hub     → aggregates findings from all security services

Response (what to do when bad things happen):
  EventBridge      → trigger Lambda/SNS on security findings
  Systems Manager  → patch instances, run commands, access without SSH
  AWS Config Rules → auto-remediate non-compliant resources

Cost management:
  Cost Explorer    → analyze past spending
  Budgets          → alert on spending thresholds
  Compute Optimizer → right-size recommendations
  Savings Plans    → commit for discount on flexible compute
\`\`\`

---

## GuardDuty — Threat Detection

GuardDuty analyses CloudTrail API logs, VPC Flow Logs, and DNS query logs using machine learning models and threat intelligence feeds. It runs continuously, 24/7, with no infrastructure to manage.

**What GuardDuty can detect:**
- EC2 instance calling known cryptocurrency mining pools
- IAM credentials used from an unusual geographic location or TOR exit node
- EC2 instance port scanning your own VPC (potential lateral movement)
- Root account activity (should be zero in normal operations)
- S3 bucket ACLs being changed to public
- Lambda function making unusual outbound calls
- API calls from known malicious IPs

\`\`\`bash
# Enable GuardDuty
DETECTOR_ID=$(aws guardduty create-detector \
  --enable \
  --finding-publishing-frequency FIFTEEN_MINUTES \
  --query 'DetectorId' --output text)

echo "Detector ID: \$DETECTOR_ID"

# List findings (filter to HIGH)
aws guardduty list-findings \
  --detector-id \$DETECTOR_ID \
  --finding-criteria '{
    "Criterion": {
      "severity": {"Gte": 7}
    }
  }'

# Get finding details
aws guardduty get-findings \
  --detector-id \$DETECTOR_ID \
  --finding-ids <finding-id> \
  --query 'Findings[0].{Title:Title,Severity:Severity,Type:Type,Description:Description}'

# Archive a finding (after investigation)
aws guardduty archive-findings \
  --detector-id \$DETECTOR_ID \
  --finding-ids <finding-id>

# Sample common finding types:
# UnauthorizedAccess:EC2/SSHBruteForce
# Recon:EC2/PortProbeUnprotectedPort
# CryptoCurrency:EC2/BitcoinTool.B!DNS
# PrivilegeEscalation:IAMUser/AnomalousBehavior
\`\`\`

---

## AWS Config — Compliance Rules

Config continuously records AWS resource configurations and evaluates them against rules.

\`\`\`bash
# Enable Config recorder
aws configservice put-configuration-recorder \
  --configuration-recorder '{
    "name": "default",
    "roleARN": "arn:aws:iam::123456789012:role/ConfigRole",
    "recordingGroup": {
      "allSupported": true,
      "includeGlobalResourceTypes": true
    }
  }'

aws configservice put-delivery-channel \
  --delivery-channel '{
    "name": "default",
    "s3BucketName": "my-config-bucket",
    "configSnapshotDeliveryProperties": {"deliveryFrequency": "TwentyFour_Hours"}
  }'

aws configservice start-configuration-recorder --configuration-recorder-name default

# Add managed rules
aws configservice put-config-rule \
  --config-rule '{
    "ConfigRuleName": "s3-bucket-public-read-prohibited",
    "Source": {
      "Owner": "AWS",
      "SourceIdentifier": "S3_BUCKET_PUBLIC_READ_PROHIBITED"
    }
  }'

aws configservice put-config-rule \
  --config-rule '{
    "ConfigRuleName": "encrypted-volumes",
    "Source": {
      "Owner": "AWS",
      "SourceIdentifier": "ENCRYPTED_VOLUMES"
    }
  }'

# Check compliance
aws configservice describe-compliance-by-config-rule \
  --query 'ComplianceByConfigRules[*].{Rule:ConfigRuleName,Compliance:Compliance.ComplianceType}' \
  --output table

# Get non-compliant resources
aws configservice get-compliance-details-by-config-rule \
  --config-rule-name s3-bucket-public-read-prohibited \
  --compliance-types NON_COMPLIANT
\`\`\`

---

## Cost Explorer & Budgets

\`\`\`bash
# Get cost breakdown by service for last month
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-02-01 \
  --granularity MONTHLY \
  --metrics "UnblendedCost" \
  --group-by Type=DIMENSION,Key=SERVICE \
  --query 'ResultsByTime[0].Groups[*].{Service:Keys[0],Cost:Metrics.UnblendedCost.Amount}' \
  --output table | sort -k2 -rn

# Get cost by tag (requires cost allocation tags enabled)
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-02-01 \
  --granularity MONTHLY \
  --metrics "UnblendedCost" \
  --group-by Type=TAG,Key=Environment \
  --query 'ResultsByTime[0].Groups[*].{Env:Keys[0],Cost:Metrics.UnblendedCost.Amount}'

# Get rightsizing recommendations
aws ce get-rightsizing-recommendation \
  --service EC2 \
  --configuration '{"RecommendationTarget":"SAME_INSTANCE_FAMILY","BenefitsConsidered":true}' \
  --query 'RightsizingRecommendations[0:5].{
    Instance:CurrentInstance.ResourceId,
    Savings:RightsizingType,
    Estimated:EstimatedMonthlySavings
  }'

# Create a budget with alert
aws budgets create-budget \
  --account-id 123456789012 \
  --budget '{
    "BudgetName": "monthly-spending",
    "BudgetLimit": {"Amount": "1000", "Unit": "USD"},
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST"
  }' \
  --notifications-with-subscribers '[{
    "Notification": {
      "NotificationType": "ACTUAL",
      "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80,
      "ThresholdType": "PERCENTAGE"
    },
    "Subscribers": [{
      "SubscriptionType": "EMAIL",
      "Address": "devops@mycompany.com"
    }]
  }]'

# Spot savings analysis
aws ce get-savings-plans-purchase-recommendation \
  --savings-plans-type COMPUTE_SP \
  --term-in-years ONE_YEAR \
  --payment-option NO_UPFRONT \
  --lookback-period-in-days THIRTY_DAYS \
  --query 'SavingsPlansPurchaseRecommendation.SavingsPlansRecommendationDetails[0:3].{
    EstimatedROI:EstimatedROI,
    EstimatedSavings:EstimatedSavingsAmount,
    Commitment:HourlyCommitmentToPurchase
  }'
\`\`\`

> **Tip:** Enable **AWS Compute Optimizer** — it analyses EC2, ECS, Lambda, and EBS usage and recommends right-sized replacements. Typical savings are 20–40% for workloads that were initially over-provisioned. It's free to enable and recommendations are updated weekly.`,
          interviewQuestions: [
            {
              question: "Your AWS bill increased by 40% last month. Walk me through how you investigate and reduce it.",
              difficulty: "mid" as const,
              answer: `**Step 1 — Identify the source:**
\`\`\`bash
# Cost Explorer — top services by cost:
aws ce get-cost-and-usage \\
  --time-period Start=2024-01-01,End=2024-01-31 \\
  --granularity MONTHLY \\
  --metrics BlendedCost \\
  --group-by Type=DIMENSION,Key=SERVICE \\
  --query 'ResultsByTime[0].Groups | sort_by(@, &Metrics.BlendedCost.Amount) | reverse(@)[:10]'

# Identify the spike date:
aws ce get-cost-and-usage \\
  --time-period Start=2024-01-01,End=2024-01-31 \\
  --granularity DAILY \\
  --metrics BlendedCost
\`\`\`

**Step 2 — Common culprits and fixes:**

**NAT Gateway data transfer:**
\`\`\`bash
# Often the biggest surprise. Fix: VPC Endpoints for S3/DynamoDB
aws ec2 create-vpc-endpoint \\
  --vpc-id vpc-xxx --service-name com.amazonaws.us-east-1.s3 \\
  --type Gateway --route-table-ids rtb-yyy
# Eliminates NAT Gateway charges for S3 traffic
\`\`\`

**EC2 — right-sizing with Compute Optimizer:**
\`\`\`bash
aws compute-optimizer get-ec2-instance-recommendations \\
  --query 'instanceRecommendations[?finding==\`OVER_PROVISIONED\`].{
    Instance:instanceArn,
    Current:currentInstanceType,
    Recommended:recommendationOptions[0].instanceType,
    Savings:recommendationOptions[0].estimatedMonthlySavings.value
  }'
\`\`\`

**Unattached EBS volumes:**
\`\`\`bash
aws ec2 describe-volumes \\
  --filters Name=status,Values=available \\
  --query 'Volumes[].{ID:VolumeId,Size:Size,Type:VolumeType}'
# $0.08-0.12/GB/month for sitting unused
\`\`\`

**Unattached Elastic IPs:**
\`\`\`bash
aws ec2 describe-addresses \\
  --query 'Addresses[?InstanceId==null].PublicIp'
# $0.005/hr each when unattached
\`\`\`

**Step 3 — Reserved Instances / Savings Plans:**
For stable workloads, commit to 1 or 3 years: 30–65% savings vs On-Demand.
\`\`\`bash
# Get Savings Plans recommendation:
aws ce get-savings-plans-purchase-recommendation \\
  --savings-plans-type COMPUTE_SP \\
  --term-in-years ONE_YEAR --payment-option NO_UPFRONT \\
  --lookback-period-in-days THIRTY_DAYS
\`\`\`

**Step 4 — Set up budget alerts (prevent future surprises):**
\`\`\`bash
aws budgets create-budget \\
  --account-id 123456789 \\
  --budget file://budget.json  # alert at 80% of monthly budget
\`\`\``,
            },
            {
              question: "How do you monitor application health in AWS using CloudWatch? What metrics and alarms would you set for a production API?",
              difficulty: "mid" as const,
              answer: `**Key metrics for a production API:**

**ALB metrics:**
\`\`\`bash
# Alarm: p99 latency > 1 second for 3 consecutive minutes:
aws cloudwatch put-metric-alarm \\
  --alarm-name "api-high-latency" \\
  --namespace AWS/ApplicationELB \\
  --metric-name TargetResponseTime \\
  --extended-statistic p99 \\
  --threshold 1.0 --comparison-operator GreaterThanThreshold \\
  --evaluation-periods 3 --period 60 \\
  --alarm-actions arn:aws:sns:...:oncall

# 5XX error rate > 1%:
aws cloudwatch put-metric-alarm \\
  --alarm-name "api-high-5xx" \\
  --namespace AWS/ApplicationELB \\
  --metric-name HTTPCode_Target_5XX_Count \\
  --threshold 10 --evaluation-periods 2 --period 60 \\
  --alarm-actions arn:aws:sns:...:oncall
\`\`\`

**EC2/Container metrics:**
- CPUUtilization > 80% for 5 min → scale out trigger
- MemoryUtilization > 85% → potential OOM incoming
- Disk usage > 80% → app may fail to write

**Custom application metrics:**
\`\`\`python
# Send custom metrics from your app:
cloudwatch.put_metric_data(
    Namespace='MyApp/API',
    MetricData=[{
        'MetricName': 'OrdersProcessed',
        'Value': order_count,
        'Unit': 'Count'
    }, {
        'MetricName': 'PaymentErrors',
        'Value': error_count,
        'Unit': 'Count'
    }]
)
\`\`\`

**Dashboard:**
\`\`\`bash
# Create a dashboard with key widgets:
aws cloudwatch put-dashboard --dashboard-name "API-Production" \\
  --dashboard-body file://dashboard.json
# Include: request count, p50/p95/p99 latency, error rates, EC2 CPU/memory, RDS connections
\`\`\`

**Alarm best practices:**
- Use ALARM state to page oncall, OK state to auto-resolve
- Set evaluation periods to 2-3 to avoid false positives from transient spikes
- Composite alarms to reduce noise (only alert if both error rate AND latency are high)`,
            },
          ],
        },
      ],
      exam: [
        { question: "You created an EKS cluster but kubectl can't connect to the API server. What do you check?", answer: "1) Run 'aws eks update-kubeconfig --name cluster-name --region us-east-1' to generate/update the kubeconfig. 2) Verify the IAM user/role running kubectl has an entry in the EKS aws-auth ConfigMap — only the creator has access by default. 3) Check cluster endpoint access: if 'Private' only, kubectl must run from within the VPC or a connected network. If 'Public', verify the public endpoint is not restricted to specific CIDRs that exclude your IP. 4) Confirm the IAM entity has eks:DescribeCluster permission. 5) Check that your AWS credentials are set correctly (AWS_PROFILE or AWS_ACCESS_KEY_ID).", difficulty: "mid" as const },
        { question: "A Pod in EKS cannot access an S3 bucket despite the node's IAM role having S3 permissions. What is the recommended fix?", answer: "Use IRSA (IAM Roles for Service Accounts) instead of relying on node-level IAM roles. Node-level roles grant permissions to ALL pods on that node — a security anti-pattern. IRSA: 1) Enable the OIDC provider for the cluster. 2) Create an IAM role with a trust policy allowing the cluster's OIDC provider and the specific ServiceAccount. 3) Annotate the Kubernetes ServiceAccount: 'eks.amazonaws.com/role-arn: arn:aws:iam::ACCOUNT:role/my-pod-role'. 4) The pod's containers get temporary credentials scoped to that role via projected token. This provides per-pod, least-privilege IAM access.", difficulty: "senior" as const },
        { question: "EKS nodes are running but pods are stuck in Pending state. What are the possible causes?", answer: "1) Insufficient resources — nodes don't have enough CPU/memory for the pod's requests. Run 'kubectl describe pod' to see the 'Insufficient cpu/memory' event. 2) Taints without matching tolerations — nodes have taints that the pod doesn't tolerate. 3) Node selector or affinity rules don't match any node labels. 4) PersistentVolumeClaim not bound — if the pod requires a PVC, it won't schedule until the PVC is bound to a PV. 5) Node group hasn't scaled up yet — if using Cluster Autoscaler, wait for it to provision new nodes. 6) Pod quota exceeded in the namespace. Run 'kubectl describe pod <name>' — the Events section shows the exact scheduling failure reason.", difficulty: "mid" as const },
        { question: "How do you upgrade an EKS cluster from version 1.28 to 1.29 with minimal disruption?", answer: "1) Check release notes for 1.29 breaking changes and deprecated APIs. 2) Update control plane first: 'aws eks update-cluster-version --name prod-cluster --kubernetes-version 1.29'. Wait for the control plane upgrade to complete (~15 minutes). 3) Update cluster add-ons (CoreDNS, kube-proxy, VPC CNI) to versions compatible with 1.29. 4) Update managed node groups one at a time: 'aws eks update-nodegroup-version --cluster-name prod-cluster --nodegroup-name general'. This cordons and drains nodes, then replaces with new AMIs. 5) Test workloads after each step. You can only upgrade one minor version at a time (1.28→1.29, not 1.27→1.29).", difficulty: "senior" as const },
        { question: "What is the EKS VPC CNI plugin and what problem does it solve?", answer: "The Amazon VPC CNI (Container Network Interface) plugin gives each Kubernetes Pod a real VPC IP address from the node's subnet. Without it, pods would use an overlay network (like Flannel) with a different IP space that doesn't integrate with VPC routing. With VPC CNI: each pod gets a private IP from the subnet, security groups and NACLs can reference pod IPs directly, and pods can communicate with other VPC resources using native VPC routing. Limitation: each EC2 instance has a maximum number of network interfaces and IPs per interface (instance-dependent), which limits how many pods can run per node. Use 'kubectl describe node' to see allocatable pod count.", difficulty: "senior" as const },
        { question: "You need to run a batch job on EKS that requires 8 GPU cores, but no GPU nodes are currently running. How do you handle this?", answer: "1) Create a separate managed node group with GPU instance types (e.g., p3.8xlarge or p4d.24xlarge) with an initial count of 0. 2) Install the NVIDIA device plugin as a DaemonSet so Kubernetes can schedule pods with 'nvidia.com/gpu: 8' resource requests. 3) Add a taint to GPU nodes (e.g., 'nvidia.com/gpu=true:NoSchedule') so only GPU-requesting pods land there. 4) Configure Cluster Autoscaler to scale this node group when GPU pods are pending. 5) When the batch job pod is submitted, Cluster Autoscaler sees it's pending due to insufficient GPU nodes and provisions the GPU instance. After the job completes, scale-in removes the expensive node.", difficulty: "senior" as const },
        { question: "How do managed node groups differ from self-managed node groups in EKS?", answer: "Managed Node Groups: AWS provisions and manages the underlying EC2 instances using an EKS-optimized AMI. AWS handles node upgrades (cordon, drain, replace) via 'aws eks update-nodegroup-version'. Automatic EC2 instance repair — unhealthy nodes are replaced. Limited to a subset of instance types. Self-managed Node Groups: You control the EC2 instances via a Launch Template and Auto Scaling Group. You're responsible for AMI updates, draining, and replacement. More flexible — supports any instance type, custom AMIs, Windows nodes, custom user data. Use managed node groups unless you have specific requirements (custom AMI, Windows, specific instance configs) that they don't support.", difficulty: "mid" as const },
        { question: "A developer accidentally deleted the aws-auth ConfigMap on EKS. How do you recover access?", answer: "The aws-auth ConfigMap controls who can authenticate to the cluster via IAM. If deleted, only the IAM identity that created the cluster retains access. Recovery: 1) Use the cluster creator's IAM credentials to run kubectl. 2) Recreate the aws-auth ConfigMap with the correct IAM user/role mappings. Format: mapRoles for IAM roles (recommended), mapUsers for specific IAM users. 3) Add back all admin roles and the node group instance role (required for nodes to join the cluster). Prevention: Use GitOps (Flux or ArgoCD) to manage the aws-auth ConfigMap so it's always in source control and auto-reconciled.", difficulty: "senior" as const },
        { question: "How does Fargate work with EKS, and when would you choose it over managed node groups?", answer: "EKS Fargate runs each pod on its own dedicated compute without you managing EC2 nodes. You create Fargate profiles that match pods by namespace and labels. When a matching pod is scheduled, EKS provisions Fargate compute (billed per pod per second). Choose Fargate when: You want no node management overhead, you need strong workload isolation (each pod on its own microVM), or for batch/short-lived workloads. Choose managed node groups when: You need DaemonSets (Fargate doesn't support them), you need specific instance types or GPUs, you have long-running services where EC2 pricing is cheaper, or you need to mount node-local storage.", difficulty: "mid" as const },
        { question: "How do you implement cluster-level autoscaling in EKS when pods can't be scheduled due to insufficient node capacity?", answer: "Install Cluster Autoscaler (CA): 1) Create an IAM role with IRSA for the CA pod with permissions to modify Auto Scaling Groups. 2) Deploy CA with the annotation specifying the cluster name. 3) Tag your node group ASG with 'k8s.io/cluster-autoscaler/enabled: true' and 'k8s.io/cluster-autoscaler/cluster-name: my-cluster'. 4) CA watches for pending pods and scales up the matching node group's ASG, then scales down when nodes are underutilized for 10+ minutes. Alternative: Karpenter (AWS's newer autoscaler) is more flexible — it directly provisions EC2 instances without needing predefined node groups and can pick the most cost-efficient available instance type.", difficulty: "senior" as const },
      ],
    },
  ],
};
