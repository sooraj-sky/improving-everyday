import type { Track } from "./types";

export const complianceTrack: Track = {
  id: "compliance",
  title: "Compliance & Governance",
  description: "Master regulatory compliance frameworks — HIPAA, GDPR, SOC 2, PCI-DSS — and learn to implement compliance as code for modern cloud environments.",
  longDescription: "Regulatory compliance is a non-negotiable part of operating in healthcare, finance, and global markets. This track takes you from understanding the core legal requirements of HIPAA, GDPR, SOC 2, and PCI-DSS to automating compliance controls with tools like OPA, Terraform Sentinel, AWS Config, and Prowler. Learn how to build audit-ready systems, handle data subject requests, and integrate compliance checks into your CI/CD pipelines.",
  icon: "Scale",
  color: "#10b981",
  gradient: "track-compliance-gradient",
  level: "intermediate",
  estimatedHours: 10,
  tags: ["HIPAA", "GDPR", "SOC 2", "PCI-DSS", "compliance-as-code", "audit", "privacy"],
  modules: [
    {
      id: "hipaa-compliance",
      title: "HIPAA Compliance",
      level: "intermediate",
      description: "Understand HIPAA rules, PHI handling, and technical safeguards for healthcare data.",
      lessons: [
        {
          id: "hipaa-fundamentals",
          title: "HIPAA Fundamentals",
          duration: 50,
          type: "lesson",
          description: "The Privacy Rule, Security Rule, and Breach Notification Rule — who must comply and why.",
          objectives: [
            "Understand covered entities and business associates",
            "Define Protected Health Information (PHI) and ePHI",
            "Distinguish administrative, physical, and technical safeguards",
            "Know Breach Notification timelines",
            "Draft a Business Associate Agreement (BAA)",
          ],
          tags: ["HIPAA", "PHI", "healthcare", "privacy", "BAA"],
          content: `## HIPAA Overview

The **Health Insurance Portability and Accountability Act (HIPAA)** was enacted in 1996. It applies to **covered entities** (hospitals, insurers, providers) and their **business associates** (cloud vendors, SaaS platforms, billing services) who handle **Protected Health Information (PHI)**.

### Three Core Rules

| Rule | What It Governs |
|------|----------------|
| **Privacy Rule** | Use and disclosure of PHI |
| **Security Rule** | Technical/physical/administrative safeguards for ePHI |
| **Breach Notification Rule** | Reporting requirements after a breach |

### What Is PHI?

PHI is any individually identifiable health information. The 18 HIPAA identifiers include:

- Name, address, phone, email
- Dates (birth, admission, discharge, death)
- Social Security Number, account numbers
- Device identifiers, IP addresses
- Biometric identifiers, photos

**De-identified data is not PHI** — HIPAA provides two de-identification methods: Safe Harbor (remove all 18 identifiers) and Expert Determination (statistical analysis proving re-identification risk < 0.01%).

### Safeguard Categories

**Administrative safeguards** (§164.308):
- Security Officer designation
- Workforce training and access management
- Risk analysis and risk management
- Contingency planning

**Physical safeguards** (§164.310):
- Facility access controls
- Workstation security
- Device and media controls (including disposal)

**Technical safeguards** (§164.312):
- Access controls (unique user IDs, emergency access)
- Audit controls (hardware and software activity logs)
- Integrity controls (ePHI must not be improperly altered)
- Transmission security (encryption in transit)

### Business Associate Agreements

Any vendor that touches PHI must sign a BAA. AWS, Google Cloud, and Azure all offer BAAs for covered services. Key BAA clauses:

\`\`\`
- Permitted uses of PHI
- Obligation to report breaches within 60 days of discovery
- Return or destroy PHI upon contract termination
- Ensure downstream subcontractors also sign BAAs
\`\`\`

### Breach Notification

- **Covered entity** must notify affected individuals within **60 days** of discovery
- Breaches affecting **500+ individuals** must notify HHS and media simultaneously
- HHS maintains a public "Wall of Shame" for large breaches
- **Business associate** must notify covered entity within **60 days** of discovery

### HIPAA Enforcement

- Office for Civil Rights (OCR) enforces HIPAA
- Penalties range from **\$100 to \$50,000 per violation** (up to \$1.9M annually per violation category)
- Criminal penalties possible for willful neglect

> **Key insight for engineers:** HIPAA doesn't mandate specific technologies — it requires reasonable and appropriate safeguards based on your organization's risk analysis. Document everything.`,
          interviewQuestions: [
            {
              question: "What is the difference between a covered entity and a business associate under HIPAA?",
              answer: "A covered entity directly provides or pays for healthcare (hospitals, insurers, providers). A business associate is a vendor or partner who creates, receives, maintains, or transmits PHI on behalf of a covered entity — examples include cloud providers, billing companies, and analytics platforms. Business associates must sign a BAA and are directly subject to HIPAA's Security Rule.",
              difficulty: "junior",
            },
            {
              question: "A startup is building a telehealth app that stores patient records. What HIPAA obligations apply?",
              answer: "The startup is a covered entity if it provides healthcare services, or a business associate if it's processing PHI for another covered entity. Either way: conduct a formal risk analysis, implement all required safeguards (admin/physical/technical), sign BAAs with all cloud vendors (AWS, Twilio, etc.), encrypt ePHI at rest and in transit, maintain audit logs, train staff, and create a breach notification procedure. Use AWS HIPAA-eligible services only and ensure they are covered under AWS's BAA.",
              difficulty: "mid",
            },
            {
              question: "What are the two HIPAA-approved methods for de-identifying PHI?",
              answer: "**Safe Harbor:** Remove all 18 specified identifiers (name, address, dates, SSN, phone, email, IP, device IDs, etc.) and have no actual knowledge that the remaining data could re-identify individuals. **Expert Determination:** A qualified statistician applies generally accepted principles to demonstrate that the risk of re-identification is very small. Expert determination allows more flexibility but requires documented statistical analysis.",
              difficulty: "mid",
            },
            {
              question: "What are the Breach Notification Rule's key timelines for covered entities and business associates?",
              answer: "Both covered entities and business associates have **60 days** from the date they discover a breach to complete their notification obligations. The covered entity must notify affected individuals, and for breaches of 500+ records in a state, must also notify HHS and prominent media outlets simultaneously. The business associate must notify the covered entity within 60 days of discovery, giving them time to complete required notifications.",
              difficulty: "mid",
            },
            {
              question: "How would you design an audit logging system for a HIPAA-covered application on AWS?",
              answer: "Use CloudTrail for API-level audit trails across all AWS services (enable in all regions, with S3 log file integrity validation). Use CloudWatch Logs for application-level access logs (who accessed which patient record, when, from where). Enable S3 server access logging and VPC Flow Logs. Store logs in a separate, dedicated AWS account with restricted access. Apply S3 Object Lock (WORM) for immutability. Retain logs for minimum 6 years (HIPAA requirement). Set up CloudWatch alarms for suspicious patterns. Use Athena to query historical access logs during audits.",
              difficulty: "senior",
            },
          ],
          quizQuestions: [
            {
              question: "A developer asks if they can store patient names and appointment dates in a shared Redis cache. How do you respond?",
              answer: "No — patient names + appointment dates constitute PHI (names are one of the 18 HIPAA identifiers; dates are another). The shared Redis cache would need to be encrypted at rest, access-controlled, and covered under a BAA with the Redis provider. Better approach: store only non-PHI tokens in the cache and look up PHI from the secured backend when needed. If Redis must hold PHI, use Redis with TLS, AUTH, encryption-at-rest, and ensure your cloud provider's managed Redis service is HIPAA-eligible and covered by your BAA.",
              type: "scenario",
              difficulty: "mid",
            },
            {
              question: "Your company discovers that a misconfigured S3 bucket exposed 800 patient records for 3 weeks. What must happen next?",
              answer: "Immediate steps: 1) Contain — make the bucket private immediately. 2) Assess — determine exactly what data was exposed (the 18 identifiers present, number of individuals). 3) Document — log discovery date, timeline, and containment steps. 4) Breach notification — with 800 records, this triggers full Breach Notification Rule. Notify affected individuals within 60 days of discovery. Notify HHS simultaneously (800 > 500 threshold also requires notifying prominent media in affected states). 5) Root cause analysis — implement preventive controls (S3 Block Public Access at organization level, AWS Config rule to detect public buckets). 6) Report to executive team and legal.",
              type: "scenario",
              difficulty: "senior",
            },
            {
              question: "Identify and remove PHI from this dataset: [{\"patient_id\": \"P123\", \"dob\": \"1985-03-15\", \"diagnosis_code\": \"J06.9\", \"visit_date\": \"2024-01-10\", \"zip\": \"90210\"}]",
              answer: "PHI elements to remove under Safe Harbor: dob (date of birth — a date identifier), visit_date (date of service — a date identifier), zip (geographic data smaller than state is an identifier). The patient_id P123 is also an identifier if it can be linked back to a real person. Safe-harbor de-identified result: {\"diagnosis_code\": \"J06.9\"} — just the clinical code. If you need temporal analysis, truncate dates to year only and use 3-digit ZIP prefix (90210 → 902) when population > 20,000.",
              type: "hands-on",
              difficulty: "mid",
              hint: "Look up the 18 HIPAA Safe Harbor identifiers — dates and geographic subdivisions smaller than a state are both on the list.",
            },
            {
              question: "Write an AWS CLI command to enable CloudTrail logging across all regions with log file validation.",
              answer: `aws cloudtrail create-trail \\
  --name hipaa-audit-trail \\
  --s3-bucket-name my-hipaa-audit-logs \\
  --include-global-service-events \\
  --is-multi-region-trail \\
  --enable-log-file-validation

aws cloudtrail start-logging --name hipaa-audit-trail

# Also apply S3 Object Lock on the bucket for WORM immutability:
aws s3api put-object-lock-configuration \\
  --bucket my-hipaa-audit-logs \\
  --object-lock-configuration '{
    "ObjectLockEnabled": "Enabled",
    "Rule": {"DefaultRetention": {"Mode": "COMPLIANCE", "Years": 6}}
  }'`,
              type: "hands-on",
              difficulty: "mid",
              hint: "CloudTrail needs --is-multi-region-trail and --enable-log-file-validation for HIPAA. HIPAA requires 6 years of log retention.",
            },
            {
              question: "A new SaaS vendor wants to integrate with your HIPAA-covered system and will process patient data. What contractual and technical steps are required?",
              answer: "Contractual: Execute a Business Associate Agreement (BAA) before sharing any PHI. The BAA must specify permitted uses, breach notification obligations (60 days), and PHI return/destruction on termination. Technical: Verify the vendor's HIPAA compliance attestation. Ensure data in transit uses TLS 1.2+. Ensure data at rest uses AES-256 encryption. Request SOC 2 Type II report for their controls. Establish minimum necessary data sharing — only send the PHI fields actually needed. Implement API authentication (OAuth2/mTLS). Add the vendor to your risk register and conduct periodic reviews. Define data retention and deletion procedures.",
              type: "scenario",
              difficulty: "senior",
            },
            {
              question: "Set up an AWS Config rule to automatically detect and alert on unencrypted RDS instances (which would violate HIPAA's encryption requirement).",
              answer: `# Deploy via AWS Config managed rule
aws configservice put-config-rule --config-rule '{
  "ConfigRuleName": "rds-storage-encrypted",
  "Source": {
    "Owner": "AWS",
    "SourceIdentifier": "RDS_STORAGE_ENCRYPTED"
  },
  "Scope": {
    "ComplianceResourceTypes": ["AWS::RDS::DBInstance"]
  }
}'

# Create a remediation action to notify via SNS
aws configservice put-remediation-configurations --remediation-configurations '[{
  "ConfigRuleName": "rds-storage-encrypted",
  "TargetType": "SSM_DOCUMENT",
  "TargetId": "AWS-PublishSNSNotification",
  "Parameters": {
    "TopicArn": {"StaticValue": {"Values": ["arn:aws:sns:us-east-1:123456789:hipaa-alerts"]}},
    "Message": {"StaticValue": {"Values": ["Unencrypted RDS instance detected"]}}
  }
}]'`,
              type: "hands-on",
              difficulty: "senior",
              hint: "AWS Config has a managed rule called RDS_STORAGE_ENCRYPTED. Pair it with an SNS remediation action.",
            },
          ],
        },
        {
          id: "hipaa-technical-controls",
          title: "HIPAA Technical Implementation",
          duration: 55,
          type: "lesson",
          description: "Implement encryption, access controls, audit trails, and minimum necessary standards on AWS.",
          objectives: [
            "Encrypt ePHI at rest and in transit",
            "Implement role-based access control for PHI",
            "Set up immutable audit trails",
            "Apply the minimum necessary standard programmatically",
            "Respond to a simulated breach scenario",
          ],
          tags: ["encryption", "KMS", "IAM", "CloudTrail", "HIPAA-technical"],
          content: `## Technical Safeguards in Practice

HIPAA's technical safeguards (45 CFR §164.312) require four categories of controls for electronic PHI (ePHI).

### 1. Access Controls (§164.312(a))

Each user must have a **unique identifier** — shared accounts are a HIPAA violation. Implement least-privilege IAM:

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "s3:GetObject"
    ],
    "Resource": "arn:aws:s3:::phi-bucket/patients/\${!aws:username}/*",
    "Condition": {
      "StringEquals": {"aws:RequestedRegion": "us-east-1"},
      "Bool": {"aws:MultiFactorAuthPresent": "true"}
    }
  }]
}
\`\`\`

**Emergency access procedure**: Maintain a documented "break-glass" account for emergency access, with automatic alerts and post-incident review.

### 2. Audit Controls (§164.312(b))

Track all access to ePHI at the application layer:

\`\`\`python
import logging
import json
from datetime import datetime

def log_phi_access(user_id: str, patient_id: str, action: str, record_type: str):
    audit_event = {
        "timestamp": datetime.utcnow().isoformat(),
        "user_id": user_id,
        "patient_id": patient_id,
        "action": action,          # READ, WRITE, DELETE, EXPORT
        "record_type": record_type, # demographics, labs, notes
        "ip_address": get_client_ip(),
        "session_id": get_session_id(),
    }
    # Write to append-only audit log (CloudWatch Logs, immutable S3)
    logging.getLogger("phi_audit").info(json.dumps(audit_event))
\`\`\`

### 3. Integrity Controls (§164.312(c))

ePHI must not be improperly altered or destroyed. Implement:

- **S3 Object Lock** (WORM) for audit logs
- **Database row versioning** — never DELETE PHI, use soft deletes with timestamps
- **Checksums** — verify file integrity after transmission

\`\`\`sql
-- Soft delete pattern for HIPAA
ALTER TABLE patient_records ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE patient_records ADD COLUMN deletion_reason TEXT;

-- Never: DELETE FROM patient_records WHERE id = 123;
-- Always:
UPDATE patient_records
SET deleted_at = NOW(), deletion_reason = 'Patient request - §45 CFR 164.526'
WHERE id = 123;
\`\`\`

### 4. Transmission Security (§164.312(e))

- Enforce **TLS 1.2 minimum** (TLS 1.3 preferred)
- Never send PHI over unencrypted HTTP
- Use **AWS PrivateLink** or VPC endpoints for service-to-service ePHI transfers
- Disable email transmission of PHI unless using encrypted email (S/MIME, PGP)

### Encryption at Rest

Use **AWS KMS Customer Managed Keys (CMK)** for PHI:

\`\`\`bash
# Create a HIPAA-dedicated KMS key with rotation
aws kms create-key \\
  --description "PHI encryption key - HIPAA" \\
  --key-usage ENCRYPT_DECRYPT \\
  --key-spec SYMMETRIC_DEFAULT

aws kms enable-key-rotation --key-id <key-id>

# Apply to RDS
aws rds create-db-instance \\
  --storage-encrypted \\
  --kms-key-id <key-id> \\
  --db-instance-identifier phi-database \\
  ...
\`\`\`

### Minimum Necessary Standard

Only access, use, or disclose the minimum PHI necessary. In code:

\`\`\`python
# BAD: Returning full patient record
def get_appointment_status(patient_id):
    return db.query("SELECT * FROM patients WHERE id = ?", patient_id)

# GOOD: Return only fields needed for the specific use case
def get_appointment_status(patient_id):
    return db.query(
        "SELECT appointment_date, status, provider_name FROM patients WHERE id = ?",
        patient_id
    )
\`\`\`

### AWS HIPAA-Eligible Services

Not all AWS services are HIPAA-eligible. Covered services include: EC2, RDS, S3, Lambda, CloudTrail, CloudWatch, DynamoDB, EKS, Secrets Manager, and more. Always verify at the AWS HIPAA page before storing PHI in a new service.`,
          interviewQuestions: [
            {
              question: "Why are shared AWS accounts or IAM users a HIPAA violation?",
              answer: "HIPAA's technical safeguards require unique user identification — every access to ePHI must be traceable to a specific individual. Shared credentials make audit trails meaningless: you cannot prove who accessed a specific patient record. HIPAA requires the ability to detect unauthorized access by specific individuals, which is impossible with shared accounts. The fix: individual IAM users or roles (preferably via SSO/SAML federation), MFA enforced, and CloudTrail logging all API calls.",
              difficulty: "junior",
            },
            {
              question: "What is the minimum necessary standard and how do you implement it in an API?",
              answer: "The minimum necessary standard (§164.514(d)) requires using, disclosing, or requesting only the minimum PHI needed to accomplish the intended purpose. In an API: define role-based field-level access (a billing clerk can see billing codes but not clinical notes). Use GraphQL field-level authorization or REST response projection to exclude fields the caller's role doesn't need. In database queries, SELECT only required columns — never SELECT *. Log all access with the fields returned. Implement purpose-based access: the same user may need different PHI fields for different workflows (appointment scheduling vs. clinical documentation).",
              difficulty: "mid",
            },
            {
              question: "How would you implement an emergency (break-glass) access procedure for ePHI while maintaining HIPAA audit requirements?",
              answer: "Create a break-glass IAM role with broad PHI access, locked behind MFA + manager approval. Store the role's credentials in AWS Secrets Manager with automatic rotation. When accessed: CloudTrail records the AssumeRole event, an EventBridge rule triggers a Lambda that immediately sends alerts to the Security Officer and CISO via PagerDuty/email. The accessing user must document the emergency reason in a ticket within 1 hour. A post-incident review happens within 24 hours. All break-glass access is logged in the PHI audit trail with a 'EMERGENCY_ACCESS' flag. Monthly review of any break-glass events by the Privacy Officer.",
              difficulty: "senior",
            },
            {
              question: "A developer hard-coded an S3 bucket URL containing PHI into a public GitHub repository for 2 hours. Is this a HIPAA breach? What do you do?",
              answer: "This is a potential breach requiring investigation. Steps: 1) Immediately revoke all access to that S3 bucket, rotate any credentials in the code. 2) Enable S3 server access logs to determine if the URL was accessed. 3) Review GitHub access logs and any forks/clones during those 2 hours. 4) Assess the probability that PHI was acquired by unauthorized persons — this determines if it's a reportable breach. If you cannot rule out unauthorized access, it IS a reportable breach. Notify the Privacy Officer immediately. If reportable: follow Breach Notification Rule (60-day clock starts from discovery). Remediation: implement pre-commit hooks to scan for secrets/URLs, IAM policies preventing PHI bucket public access, and mandatory security training for the developer.",
              difficulty: "senior",
            },
            {
              question: "What is the difference between TLS in transit and application-level encryption for HIPAA purposes?",
              answer: "TLS in transit encrypts the network channel between two endpoints — it protects PHI while it's moving from A to B, but the receiving server decrypts it. Application-level encryption (end-to-end) encrypts at the application layer so PHI is encrypted before it leaves the client and only decrypted by the intended recipient — even the server/vendor cannot read it. For HIPAA: TLS is required as a minimum. Application-level encryption is required when PHI passes through third-party systems where you cannot trust or audit the intermediary (e.g., patient messaging through a third-party chat platform). Most HIPAA-covered web APIs satisfy the requirement with TLS 1.2+, but messaging apps and file sharing require stronger guarantees.",
              difficulty: "senior",
            },
          ],
          quizQuestions: [
            {
              question: "Your team wants to send de-identified patient data to a data science team for ML model training. Walk through the process of ensuring the data is truly de-identified per HIPAA.",
              answer: "Choose a de-identification method: Safe Harbor (remove all 18 identifiers — name, all geographic data smaller than state, all dates except year for people over 89, phone, fax, email, SSN, medical record numbers, health plan numbers, account numbers, certificate numbers, vehicle identifiers, device identifiers, IP addresses, URLs, biometric identifiers, photos, any other unique identifier) OR Expert Determination (statistical analysis). For Safe Harbor on a dataset: write a pipeline that strips the 18 fields, truncates dates to year only, generalizes ZIP to 3-digit prefix (verify population > 20,000), replaces patient IDs with random tokens, and applies differential privacy noise to any quasi-identifiers like age + diagnosis + location combinations. Document the process. No BAA is needed for truly de-identified data.",
              type: "scenario",
              difficulty: "senior",
            },
            {
              question: "You need to implement field-level encryption for a patient notes field in PostgreSQL. What approach do you take?",
              answer: `-- Use pgcrypto extension with KMS-managed keys
-- The application fetches a data encryption key from KMS,
-- encrypts the notes field before INSERT, and decrypts after SELECT.

-- Application-level encryption (Python example):
import boto3, base64
from cryptography.fernet import Fernet

kms = boto3.client('kms')

def encrypt_phi(plaintext: str, key_id: str) -> bytes:
    # Generate data key from KMS
    response = kms.generate_data_key(KeyId=key_id, KeySpec='AES_256')
    data_key = response['Plaintext']
    encrypted_key = response['CiphertextBlob']

    f = Fernet(base64.urlsafe_b64encode(data_key[:32]))
    encrypted = f.encrypt(plaintext.encode())
    return encrypted_key + b'.' + encrypted  # store both

# Store: INSERT INTO notes (patient_id, encrypted_content) VALUES (?, ?)
# Retrieve: decrypt using KMS to get data key, then decrypt content`,
              type: "hands-on",
              difficulty: "senior",
              hint: "Use envelope encryption: KMS generates a data key, you encrypt the PHI with it, and store the encrypted data key alongside the ciphertext.",
            },
            {
              question: "Your HIPAA audit log shows user 'dr.smith' accessed 3,200 patient records in 4 hours — far more than typical clinical access. What is your incident response?",
              answer: "This could be insider threat or credential compromise. Immediate actions: 1) Do NOT alert dr.smith yet — preserve the investigation. 2) Temporarily disable the account via IAM or application access controls. 3) Check if the IP, device, and session are consistent with dr.smith's normal patterns (CloudTrail, VPN logs). 4) Review what data was accessed — specific patient populations, all records, or targeted? Was any data exported (S3 GetObject followed by large data transfers)? 5) Escalate to Security Officer and Privacy Officer within 1 hour. 6) If credential compromise is confirmed, force password reset and MFA re-enrollment. 7) If this is a potential breach, start the 60-day clock. 8) Conduct forensic analysis before restoring access. 9) Document everything — you may need this for HHS investigation.",
              type: "scenario",
              difficulty: "senior",
            },
            {
              question: "Create a Terraform resource for an S3 bucket configured for HIPAA-compliant PHI storage.",
              answer: `resource "aws_s3_bucket" "phi_storage" {
  bucket = "company-phi-storage-prod"
}

resource "aws_s3_bucket_versioning" "phi" {
  bucket = aws_s3_bucket.phi_storage.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "phi" {
  bucket = aws_s3_bucket.phi_storage.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.phi_key.arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "phi" {
  bucket                  = aws_s3_bucket.phi_storage.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_object_lock_configuration" "phi" {
  bucket = aws_s3_bucket.phi_storage.id
  rule {
    default_retention {
      mode  = "COMPLIANCE"
      years = 7
    }
  }
}`,
              type: "hands-on",
              difficulty: "mid",
              hint: "HIPAA-compliant S3 needs: KMS encryption, versioning, public access blocked, and object lock for audit logs.",
            },
            {
              question: "A business associate (your cloud EHR vendor) notifies you they had a breach affecting your patients 45 days ago. What are your obligations and what should you have already done?",
              answer: "Your obligations: As the covered entity, YOUR 60-day breach notification clock runs from when YOU discovered the breach — which is today (day 45 of theirs, day 1 of yours). You have 60 days to notify affected individuals. You still have time, but must act immediately. Actions: 1) Confirm the breach scope with the vendor (how many of YOUR patients, which data elements). 2) Review your BAA — the BA is 45 days into their 60-day obligation to notify you, which they've now met. 3) Draft individual notices (name, description of breach, what data was exposed, steps they can take, your contact info, credit monitoring if financial data exposed). 4) Determine if 500+ individuals in any state — if yes, notify HHS and media. 5) File with HHS at hhs.gov/hipaa. What you should have had: the BAA should specify that the BA notifies you within a shorter window (30 days or less is common) rather than waiting the full 60. Build contractual requirements for faster notification.",
              type: "scenario",
              difficulty: "senior",
            },
            {
              question: "Write a Python script that scans an S3 bucket for any objects that are publicly accessible and alerts via SNS.",
              answer: `import boto3

s3 = boto3.client('s3')
sns = boto3.client('sns')
SNS_TOPIC = 'arn:aws:sns:us-east-1:123456789:hipaa-alerts'

def check_bucket_public_access(bucket_name: str):
    violations = []

    # Check bucket-level public access block
    try:
        pab = s3.get_public_access_block(Bucket=bucket_name)
        cfg = pab['PublicAccessBlockConfiguration']
        if not all([cfg['BlockPublicAcls'], cfg['BlockPublicPolicy'],
                    cfg['IgnorePublicAcls'], cfg['RestrictPublicBuckets']]):
            violations.append(f"Bucket {bucket_name}: Public Access Block not fully enabled")
    except s3.exceptions.NoSuchPublicAccessBlockConfiguration:
        violations.append(f"Bucket {bucket_name}: No Public Access Block configured!")

    # Check bucket ACL
    acl = s3.get_bucket_acl(Bucket=bucket_name)
    for grant in acl['Grants']:
        if 'AllUsers' in grant['Grantee'].get('URI', ''):
            violations.append(f"Bucket {bucket_name}: Public ACL grant found!")

    if violations:
        sns.publish(
            TopicArn=SNS_TOPIC,
            Subject='HIPAA ALERT: S3 Public Access Detected',
            Message='\\n'.join(violations)
        )
    return violations

# Run against all buckets
buckets = s3.list_buckets()['Buckets']
for bucket in buckets:
    check_bucket_public_access(bucket['Name'])`,
              type: "hands-on",
              difficulty: "mid",
              hint: "Check both the Public Access Block configuration and the bucket ACL. Alert via SNS if either shows public exposure.",
            },
          ],
        },
      ],
      exam: [

        { question: "What are the three HIPAA rules and what does each govern?", answer: "Privacy Rule (PHI use/disclosure), Security Rule (ePHI safeguards: admin/physical/technical), Breach Notification Rule (reporting requirements after breach — 60 days to notify individuals, HHS simultaneously if 500+ records).", difficulty: "junior" },
        { question: "What are the 18 HIPAA Safe Harbor identifiers?", answer: "Name, geographic subdivisions smaller than state, all dates (except year) for people ≥90, phone, fax, email, SSN, medical record numbers, health plan beneficiary numbers, account numbers, certificate/license numbers, vehicle identifiers, device identifiers/serial numbers, URLs, IP addresses, biometric identifiers, full-face photos, and any other unique identifying number.", difficulty: "mid" },
        { question: "A patient asks you to delete their data from your healthcare app. What are your HIPAA obligations?", answer: "HIPAA doesn't grant a right to erasure (unlike GDPR). Patients have a right to access and amend records, but covered entities must retain medical records per state law (often 7-10 years). You may restrict certain uses but cannot delete records needed for treatment. Respond in writing within 60 days. If state law requires retention, document the reason for not deleting.", difficulty: "mid" },
        { question: "What is a Business Associate Agreement and what must it contain?", answer: "A BAA is a contract required between a covered entity and any business associate handling PHI. Required elements: permitted/required uses of PHI, prohibition on unauthorized use, safeguard obligations, breach notification obligations (within 60 days of discovery), PHI return/destruction upon termination, and ensuring subcontractors agree to the same terms.", difficulty: "junior" },
        { question: "How do you test whether your encryption implementation is HIPAA-compliant?", answer: "Verify: AES-256 for at rest (check KMS key specs), TLS 1.2+ for in transit (use testssl.sh or Qualys SSL Labs), key rotation enabled (annually minimum), KMS CMK with CloudTrail logging, no hardcoded keys in code (git-secrets scan), encryption covers all PHI stores (RDS, S3, EBS, DynamoDB, backups), and encryption verified in disaster recovery scenarios.", difficulty: "senior" },
        { question: "What is the difference between HIPAA and HITRUST?", answer: "HIPAA is a US federal law with mandatory compliance requirements for covered entities/BAs. HITRUST CSF is a certifiable framework (created by HITRUST Alliance) that maps to HIPAA, NIST, ISO 27001, and other frameworks. HITRUST certification is voluntary but provides documented proof of HIPAA compliance — many health systems require it from vendors. HIPAA compliance is required by law; HITRUST certification is a market differentiator.", difficulty: "mid" },
        { question: "Your app uses Twilio for SMS appointment reminders. What must you do to comply with HIPAA?", answer: "Sign a BAA with Twilio (they offer one for their HIPAA-eligible services). Verify the specific Twilio products used are covered under the BAA. Minimize PHI in SMS — ideally no PHI in the message body (e.g., 'You have an appointment tomorrow' not 'Your oncology appointment for cancer treatment is tomorrow'). Ensure the phone number itself is treated as PHI. Log all SMS transmissions in your audit trail. Confirm TLS for the API calls to Twilio.", difficulty: "mid" },
        { question: "What AWS services are NOT HIPAA-eligible and should never store PHI?", answer: "AWS publishes its list of HIPAA-eligible services. Services NOT on the list as of recent updates include some developer tools like Cloud9, CodeStar, and certain AI/ML services. Always check the current AWS HIPAA page before using a new service. Using a non-eligible service with PHI violates your BAA with AWS and creates HIPAA exposure.", difficulty: "mid" },
        { question: "How would you implement a data retention and destruction policy for PHI in compliance with HIPAA?", answer: "Define retention periods (follow state law — typically 7-10 years for adults, longer for minors). Implement automated lifecycle policies: S3 Lifecycle rules to transition to Glacier after active period, then expire after retention period. For databases: mark records with deletion_eligible_date, run scheduled jobs to soft-delete, then hard-delete after review. For paper PHI: tracked shredding with certificate of destruction. Document all destruction with timestamps, method, and who authorized. For backups: apply same retention rules; test that backups are also destroyed on schedule.", difficulty: "senior" },
        { question: "A whistleblower reports that your company has been sharing patient data with pharmaceutical companies without consent. What is your response plan?", answer: "Treat this as a critical incident. Immediately convene Privacy Officer, Legal, CISO, and executive team. Preserve all evidence — do not delete any data or logs. Conduct internal investigation: what data was shared, with whom, under what agreement, was a BAA in place, was this a permitted disclosure under HIPAA? If unauthorized disclosure is confirmed: this is a reportable breach. Notify HHS Office for Civil Rights proactively (cooperation reduces penalties). Notify affected patients. Stop all unauthorized disclosures immediately. If criminal intent exists, refer to DOJ. Document everything. Penalties: up to $1.9M per violation category per year, plus potential criminal charges for knowingly disclosing PHI.", difficulty: "senior" },
      ],
    },
    {
      id: "gdpr-compliance",
      title: "GDPR & Data Privacy",
      level: "intermediate",
      description: "Navigate GDPR's principles, data subject rights, and implement privacy by design.",
      lessons: [
        {
          id: "gdpr-fundamentals",
          title: "GDPR Fundamentals",
          duration: 50,
          type: "lesson",
          description: "GDPR's seven principles, lawful bases, data subject rights, and key roles (DPA/DPO).",
          objectives: [
            "Name the seven GDPR principles",
            "Choose the correct lawful basis for data processing",
            "Handle data subject rights requests",
            "Understand DPO requirements",
            "Know breach notification timelines",
          ],
          tags: ["GDPR", "privacy", "data-subject-rights", "DPO", "EU"],
          content: `## The General Data Protection Regulation (GDPR)

GDPR is EU law (effective May 25, 2018) that protects EU/EEA residents' personal data. It applies to any organization that processes data of EU residents — regardless of where the organization is located. Violations: up to **€20 million or 4% of global annual turnover** (whichever is higher).

### The Seven Principles (Article 5)

1. **Lawfulness, fairness, transparency** — Tell people what you're doing, do it legally
2. **Purpose limitation** — Collect data for specified, explicit purposes only
3. **Data minimization** — Collect only what you need
4. **Accuracy** — Keep data correct and up-to-date
5. **Storage limitation** — Don't keep data longer than needed
6. **Integrity and confidentiality** — Secure the data (encryption, access controls)
7. **Accountability** — You must be able to demonstrate compliance

### Six Lawful Bases for Processing

| Basis | When to Use |
|-------|-------------|
| **Consent** | Freely given, specific, informed, unambiguous opt-in |
| **Contract** | Necessary to perform a contract with the individual |
| **Legal obligation** | Required by law |
| **Vital interests** | Life or death emergency |
| **Public task** | Exercise of official authority |
| **Legitimate interests** | Balanced against individual's rights (requires LIA) |

### Data Subject Rights

| Right | Timeframe |
|-------|-----------|
| **Access (SAR)** | 1 month |
| **Rectification** | 1 month |
| **Erasure ("right to be forgotten")** | 1 month |
| **Restriction of processing** | 1 month |
| **Data portability** | 1 month |
| **Object to processing** | Must stop immediately |
| **Rights re automated decisions** | Must provide human review |

### Key Roles

**Data Controller**: Decides why and how data is processed. Ultimately responsible.
**Data Processor**: Processes data on behalf of the controller (e.g., your SaaS vendor).
**Data Protection Officer (DPO)**: Required for public authorities, large-scale systematic monitoring, or large-scale special category data processing. The DPO must be independent and report to top management.

### Special Categories of Data

Extra protection required for: health data, biometric data, genetic data, racial/ethnic origin, political opinions, religious beliefs, trade union membership, sex life/sexual orientation.

### Breach Notification (Article 33-34)

- **72 hours** to notify the supervisory authority (e.g., ICO in UK, CNIL in France)
- Notify affected individuals "without undue delay" if high risk to their rights
- Breaches not likely to result in risk don't require individual notification
- Maintain a breach register even for non-reportable incidents

### International Transfers

Transferring data outside EU/EEA requires: adequacy decision (UK, Canada, Japan, etc.), Standard Contractual Clauses (SCCs), or Binding Corporate Rules (BCRs). The EU-US Data Privacy Framework (2023) replaced Privacy Shield.`,
          interviewQuestions: [
            {
              question: "What is the difference between a data controller and a data processor under GDPR?",
              answer: "The data controller determines the purposes and means of processing personal data — they decide WHY and HOW data is processed and bear primary legal responsibility. The data processor processes data on behalf of the controller according to their instructions. A processor can only process data as instructed by the controller and must sign a Data Processing Agreement (DPA). Both have GDPR obligations, but controllers have more responsibility. Example: You (the controller) use Mailchimp (the processor) to send marketing emails to your user list.",
              difficulty: "junior",
            },
            {
              question: "A user submits a Subject Access Request (SAR). What must you provide and by when?",
              answer: "Within 1 month (extendable by 2 more months for complex requests, with notice): provide a copy of all personal data you hold about them, the purposes of processing, categories of data, recipients or categories of recipients, retention periods, the source of the data if not collected directly, whether automated decision-making is used, and their rights (rectification, erasure, restriction, objection). Provide in a commonly used electronic format. First copy is free; reasonable fee for subsequent requests or manifestly unfounded/excessive requests.",
              difficulty: "mid",
            },
            {
              question: "When should you use 'consent' vs 'legitimate interests' as your lawful basis?",
              answer: "Use consent when you want to do something that isn't strictly necessary for your service and where you want individuals to have genuine choice — e.g., marketing emails, non-essential cookies, sharing data with third parties. Consent must be freely given (no bundling with service terms), specific, informed, and unambiguous (no pre-ticked boxes). Use legitimate interests when processing is necessary for a genuine purpose, that purpose isn't overridden by the individual's rights. Requires a Legitimate Interests Assessment (LIA). Example: fraud prevention, network security, direct marketing to existing customers (with opt-out). Never use legitimate interests for processing children's data or special categories.",
              difficulty: "mid",
            },
            {
              question: "Your US company processes data of EU customers through a US-based SaaS tool. What GDPR transfer mechanism do you use?",
              answer: "If the SaaS vendor participates in the EU-US Data Privacy Framework (DPF), that provides the adequacy basis. If not, use Standard Contractual Clauses (SCCs) — the 2021 EU SCCs must be incorporated into the contract with the processor. The SCCs cover controller-to-controller and controller-to-processor transfers. You must also conduct a Transfer Impact Assessment (TIA) to assess whether the destination country's laws undermine the SCCs' protections. Binding Corporate Rules (BCRs) are another option but take years to approve and are for intra-group transfers.",
              difficulty: "senior",
            },
            {
              question: "What are the GDPR breach notification requirements, and how do they differ from HIPAA's?",
              answer: "GDPR: notify supervisory authority within **72 hours** of becoming aware of a breach likely to result in risk to individuals' rights and freedoms. Notify individuals 'without undue delay' if high risk. No 72h clock for individual notification — must be 'without undue delay.' HIPAA: notify affected individuals within **60 days** of discovery. No 72-hour supervisory authority timeline. Key differences: GDPR's 72h to regulator is much faster; HIPAA gives 60 days to individuals. GDPR notification applies to all personal data breaches (not just health); HIPAA is health-data specific. GDPR requires risk assessment to determine if notification is needed; HIPAA uses a different 'low probability of compromise' safe harbor standard.",
              difficulty: "senior",
            },
          ],
          quizQuestions: [
            {
              question: "A user asks you to delete their account. Your legal team says you must keep billing records for 7 years for tax purposes. How do you handle the erasure request?",
              answer: "GDPR's right to erasure is not absolute — it has exceptions. Legal obligation is one: you must retain data required by law. Response: delete all personal data not required by law (profile, preferences, usage history, marketing data), but retain billing records for the legally required period (7 years per tax law). Inform the user of what was deleted and what was retained, with the legal basis for retention. Ensure retained billing data is isolated and not used for any other purpose. Consider pseudonymizing data you must retain — replace names with IDs where the name isn't strictly needed for the legal obligation.",
              type: "scenario",
              difficulty: "mid",
            },
            {
              question: "Your analytics platform uses third-party cookies for advertising. What GDPR changes are required to your website?",
              answer: "Third-party advertising cookies require explicit consent (they cannot use legitimate interests). Required changes: 1) Implement a consent management platform (CMP) that shows a clear cookie banner before setting any non-essential cookies. 2) The banner must have equal prominence for Accept and Reject buttons — no pre-ticked boxes, no dark patterns. 3) Store consent records with timestamp, what the user consented to, and the consent UI version. 4) Implement a preference center where users can change consent at any time. 5) Honor consent signals — if rejected, fire zero advertising cookies. 6) No page walls (requiring cookie consent to access content). 7) Renew consent periodically (annually). 8) List all third-party cookies and their purposes in your cookie policy.",
              type: "scenario",
              difficulty: "mid",
            },
            {
              question: "Write a GDPR-compliant data retention policy for a SaaS application with user accounts, logs, and backups.",
              answer: `Data Retention Policy (Example):

Account data: Retained while account is active + 30 days after deletion request
Billing records: 7 years (legal obligation - tax law)
Access logs/audit trails: 12 months (security/legal purposes, legitimate interests)
Marketing data: Until consent withdrawn, then deleted within 30 days
Backups: Aligned with account data - ensure erasure requests propagate to backups within 30 days (backup cycle should not exceed this)
Analytics (aggregated): Indefinite (anonymized data is not personal data)

Implementation:
- Automated deletion jobs running nightly for expired data
- Backups rotated on 30-day cycle so SAR deletions propagate
- Data map documenting all stores, retention periods, and legal bases
- Quarterly audit of retention compliance`,
              type: "hands-on",
              difficulty: "mid",
              hint: "Different data types have different retention requirements — some by legal obligation, some by business need. Backups are often forgotten but must also respect erasure timelines.",
            },
            {
              question: "Implement a consent tracking system using a database schema that would satisfy GDPR requirements.",
              answer: `-- GDPR-compliant consent records table
CREATE TABLE consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  purpose VARCHAR(100) NOT NULL,       -- 'marketing_email', 'analytics', 'third_party'
  lawful_basis VARCHAR(50) NOT NULL,   -- 'consent', 'legitimate_interest', 'contract'
  consented BOOLEAN NOT NULL,
  consent_given_at TIMESTAMP WITH TIME ZONE,
  consent_withdrawn_at TIMESTAMP WITH TIME ZONE,
  consent_method VARCHAR(100),          -- 'cookie_banner_v2', 'registration_form', 'api'
  ip_address INET,                     -- for proof of consent
  user_agent TEXT,
  consent_text_hash VARCHAR(64),       -- hash of exact consent wording shown
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, purpose)             -- one record per user per purpose
);

-- When user withdraws consent:
UPDATE consent_records
SET consented = false, consent_withdrawn_at = NOW()
WHERE user_id = ? AND purpose = 'marketing_email';

-- Check if processing is allowed:
SELECT consented FROM consent_records
WHERE user_id = ? AND purpose = 'marketing_email'
  AND consented = true AND consent_withdrawn_at IS NULL;`,
              type: "hands-on",
              difficulty: "mid",
              hint: "GDPR requires you to prove consent was given — store the timestamp, method, and the exact text the user agreed to (or a hash of it).",
            },
            {
              question: "You are migrating from AWS us-east-1 to eu-west-1 for EU customers. What GDPR implications does this solve and what new ones does it create?",
              answer: "Solved: Data residency concerns — EU customer data now stays in the EU, eliminating the need for transfer mechanisms like SCCs for the primary data store. EU supervisory authorities are more comfortable with data not leaving the EU. New/remaining concerns: CI/CD pipelines may still transfer code/config to US teams — code repositories containing sample EU data need review. Support staff accessing EU data from the US still requires a transfer mechanism (SCCs or DPF). Log aggregation to US-based SIEM needs SCCs. Backups replicated to non-EU regions require transfer mechanisms. Third-party integrations (Stripe, Salesforce, etc.) still process EU data in the US under their own DPAs. You still need a DPA with AWS for EU region data.",
              type: "scenario",
              difficulty: "senior",
            },
            {
              question: "Create a script to generate a GDPR data export (Subject Access Request response) for a user from a PostgreSQL database.",
              answer: `#!/usr/bin/env python3
import json
import psycopg2
from datetime import datetime

def generate_sar_export(user_id: str, output_file: str):
    conn = psycopg2.connect(dsn="postgresql://user:pass@localhost/app")
    cur = conn.cursor()

    export = {
        "generated_at": datetime.utcnow().isoformat(),
        "subject": user_id,
        "data": {}
    }

    # Profile data
    cur.execute("SELECT name, email, created_at, last_login FROM users WHERE id = %s", (user_id,))
    row = cur.fetchone()
    if row:
        export["data"]["profile"] = {"name": row[0], "email": row[1],
                                       "created_at": str(row[2]), "last_login": str(row[3])}

    # Orders
    cur.execute("SELECT id, amount, status, created_at FROM orders WHERE user_id = %s", (user_id,))
    export["data"]["orders"] = [
        {"id": str(r[0]), "amount": float(r[1]), "status": r[2], "date": str(r[3])}
        for r in cur.fetchall()
    ]

    # Consent records
    cur.execute("SELECT purpose, consented, consent_given_at FROM consent_records WHERE user_id = %s", (user_id,))
    export["data"]["consent"] = [
        {"purpose": r[0], "consented": r[1], "date": str(r[2])} for r in cur.fetchall()
    ]

    with open(output_file, 'w') as f:
        json.dump(export, f, indent=2, default=str)

    cur.close()
    conn.close()
    print(f"SAR export written to {output_file}")

generate_sar_export("user-uuid-here", "sar_export.json")`,
              type: "hands-on",
              difficulty: "mid",
              hint: "The SAR must include all personal data you hold — iterate through every table that could contain user data.",
            },
          ],
        },
        {
          id: "gdpr-technical",
          title: "GDPR Technical Implementation",
          duration: 50,
          type: "lesson",
          description: "Privacy by design, data mapping, pseudonymization, and automating DSAR handling.",
          objectives: [
        "Apply privacy by design principles to system architecture",
        "Build a data map / Records of Processing Activities (RoPA)",
        "Implement pseudonymization and anonymization",
        "Automate data subject request handling",
        "Implement cookie consent correctly",
          ],
          tags: ["privacy-by-design", "RoPA", "pseudonymization", "DSAR", "cookie-consent"],
          content: `## Privacy by Design & Default (Article 25)

Privacy by design means building privacy protections into systems from the start — not bolting them on later. Seven foundational principles (Ann Cavoukian):

1. **Proactive not reactive** — Anticipate privacy issues before they happen
2. **Privacy as the default** — Default settings should be most privacy-protective
3. **Privacy embedded into design** — Not an add-on
4. **Full functionality** — Privacy and business goals aren't zero-sum
5. **End-to-end security** — Protect data throughout its lifecycle
6. **Visibility and transparency** — Open about practices
7. **Respect for user privacy** — Keep it user-centric

### Practical Privacy by Design

\`\`\`
// BAD: Collect everything, figure out what you need later
user.save({
  name, email, phone, dob, address, ip, device_id,
  browsing_history, location, ...everything
})

// GOOD: Collect only what serves a specific, documented purpose
user.save({
  email,              // login - legal basis: contract
  name,               // display - legal basis: contract
  // phone: OPTIONAL, only if 2FA enabled
  // location: NOT collected, not needed for service
})
\`\`\`

### Records of Processing Activities (RoPA)

Article 30 requires organizations with 250+ employees (or processing special categories) to maintain a RoPA. For each processing activity document:

| Field | Example |
|-------|---------|
| Activity name | User registration |
| Controller/processor | Acme Corp (controller) |
| Purposes | Account creation, service delivery |
| Data categories | Email, name, preferences |
| Data subjects | End users / customers |
| Recipients | None / AWS (processor) |
| International transfers | None |
| Retention period | 3 years after account closure |
| Security measures | Encrypted at rest (AES-256), TLS in transit |

### Pseudonymization vs Anonymization

**Pseudonymized data** = still personal data (can be re-identified with the key). Requires GDPR protections but earns certain benefits (e.g., data breach lower risk threshold, easier to use for research).

**Anonymized data** = not personal data (irreversibly stripped of identifying info). GDPR doesn't apply.

\`\`\`python
import hashlib
import secrets

# Pseudonymization: replace direct identifier with token
# Store mapping separately (in secure vault, not with data)
def pseudonymize(user_id: str, secret_key: str) -> str:
    return hashlib.hmac(
        secret_key.encode(), user_id.encode(), 'sha256'
    ).hexdigest()

# Anonymization: k-anonymity example
# Generalize quasi-identifiers so each record is
# indistinguishable from at least k-1 others
# Age 34 -> Age range 30-39
# ZIP 90210 -> ZIP region 902
\`\`\`

### Automating DSAR Handling

\`\`\`python
from datetime import datetime, timedelta
from typing import Dict, Any

class DSARHandler:
    def __init__(self, db, storage):
        self.db = db
        self.storage = storage

    def handle_access_request(self, user_id: str) -> Dict[str, Any]:
        """Generate complete data export within 30-day SLA."""
        data = {
        "generated": datetime.utcnow().isoformat(),
        "profile": self.db.get_user(user_id),
        "orders": self.db.get_orders(user_id),
        "support_tickets": self.db.get_tickets(user_id),
        "consent_history": self.db.get_consent(user_id),
        "activity_logs": self.db.get_activity(user_id),
        }

        # Log the DSAR for compliance record
        self.db.log_dsar(user_id, "access", datetime.utcnow(),
                     deadline=datetime.utcnow() + timedelta(days=30))
        return data

    def handle_erasure_request(self, user_id: str, reason: str):
        """Right to erasure — delete non-legally-required data."""
        # Check for legal holds first
        legal_holds = self.db.get_legal_holds(user_id)
        if legal_holds:
        return {"status": "partial", "retained": legal_holds}

        # Cascade delete
        self.db.delete_user_data(user_id)
        self.db.delete_from_backups_queue(user_id)  # async cleanup
        self.db.log_dsar(user_id, "erasure", datetime.utcnow())
        return {"status": "complete"}
\`\`\``,
          interviewQuestions: [
        { question: "What is a RoPA and what must it contain?", answer: "Records of Processing Activities (Article 30): name/contact of controller, purposes of processing, description of data subject categories and personal data categories, recipients of personal data, international transfer details, retention schedules, and security measures. Required for organizations with 250+ employees or those processing special categories or criminal conviction data at any scale.", difficulty: "junior" },
        { question: "What is the difference between pseudonymization and anonymization, and how does GDPR treat each?", answer: "Pseudonymization replaces direct identifiers with tokens — the mapping is stored separately. The data is still personal data (re-identification is possible) but earns GDPR benefits: lower breach risk threshold, easier to use for research/testing. Anonymization irreversibly removes all identifying information — the result is no longer personal data and GDPR doesn't apply. True anonymization is very difficult; most 'anonymized' datasets can be re-identified with enough context.", difficulty: "mid" },
        { question: "How do you handle the GDPR erasure right for data stored in immutable audit logs?", answer: "Audit logs cannot be deleted if they are required for security or legal purposes (legitimate interests / legal obligation lawful basis). Options: 1) Pseudonymize the logs — replace user identifiers with a token and delete the mapping when erasure is requested (logs remain but can't be linked to the individual). 2) Inform users that certain logs are retained for security/legal purposes and cannot be erased. 3) Design logs to not contain personal data beyond what's strictly necessary (log event type + pseudonymous ID, not full name or email).", difficulty: "senior" },
        { question: "Describe a privacy-by-design architecture for a new user analytics feature.", answer: "Start with a privacy impact assessment before building. Collect minimum data (events + pseudonymous user ID, not name/email). Separate the analytics store from the primary user database. Store the pseudonymization key in a separate vault. Implement data retention: automatically purge analytics data after 12 months. Default to no analytics collection — user must opt in. Make analytics opt-out available in profile settings. Ensure analytics vendor signs a DPA. Don't share raw event data with analytics vendor if it can be aggregated first. Document the lawful basis (consent or legitimate interests with LIA).", difficulty: "senior" },
        { question: "What is the GDPR penalty structure and what determines the penalty tier?", answer: "Two tiers: Tier 1 (up to €10M or 2% global annual turnover) for infringements of processors' obligations, certification bodies, monitoring bodies. Tier 2 (up to €20M or 4% global annual turnover) for infringements of basic principles (Article 5), rights of data subjects (Articles 12-22), transfers to third countries (Chapter V), member state laws. Supervisory authorities consider: nature/gravity/duration, intentional vs negligent, mitigation actions, cooperation with authority, categories of data involved, prior infringements.", difficulty: "senior" },
          ],
          quizQuestions: [
        { question: "Your analytics tool wants to track user behavior with full session replay. What GDPR questions must you answer before implementing?", answer: "Lawful basis: What lawful basis applies? Legitimate interests requires an LIA showing the analytics benefit isn't overridden by user privacy rights. Or use consent — but session replay is highly intrusive and consent may be hard to justify as 'freely given' if required for service access. Data minimization: Is full session replay necessary or would aggregated event tracking suffice? Could you mask sensitive form fields (passwords, credit cards) in replays? Transparency: Disclose session replay clearly in privacy policy and cookie banner. Retention: How long are replay sessions stored? Third-party processor: The replay vendor must sign a DPA. International transfers: Where is replay data processed?", type: "scenario", difficulty: "mid" },
        { question: "Design a cookie consent banner that is GDPR-compliant. What elements are required?", answer: "Required elements: 1) Clear description of cookie categories (essential, analytics, marketing) with ON/OFF toggles. 2) Equal prominence Accept All and Reject All buttons (no dark patterns — reject must be as easy as accept). 3) No pre-ticked boxes. 4) Link to full cookie policy. 5) No cookie walls (can't require cookie consent to use the site). 6) Ability to change preferences at any time (via 'Cookie Settings' in footer). 7) Store proof of consent (timestamp, banner version, what was accepted). 8) No 'nudge' techniques making rejection harder. 9) Renew consent annually or when purpose changes.", type: "scenario", difficulty: "mid" },
        { question: "Implement pseudonymization for user IDs in an analytics database.", answer: `import hmac
import hashlib
import os

# Secret key stored in vault (AWS Secrets Manager, not in code)
PSEUDO_KEY = os.environ['PSEUDONYMIZATION_SECRET']

def pseudonymize_user_id(real_user_id: str) -> str:
    """One-way pseudonymization using HMAC-SHA256."""
    return hmac.new(
        PSEUDO_KEY.encode(),
        real_user_id.encode(),
        hashlib.sha256
    ).hexdigest()

# Usage: when writing to analytics DB
analytics_event = {
    "user_pseudo_id": pseudonymize_user_id(user.id),  # not user.id!
    "event_type": "page_view",
    "page": "/dashboard",
    "timestamp": datetime.utcnow().isoformat(),
    # No name, email, or direct identifiers
}

# On erasure request: delete the HMAC key for that user
# (or rotate the secret key to re-pseudonymize all users,
# making old records impossible to link)`, type: "hands-on", difficulty: "mid", hint: "Use HMAC not plain hash — it requires a secret key, so deleting the key makes re-identification impossible." },
        { question: "Write a Python function to automatically detect if a string contains personal data (PII) before storing it in a database.", answer: `import re
from typing import List

PII_PATTERNS = {
    "email": r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
    "phone": r'(\+?1?\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}',
    "ssn": r'\d{3}-\d{2}-\d{4}',
    "ip_v4": r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
    "credit_card": r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',
    "dob": r'\b\d{2}[/-]\d{2}[/-]\d{4}\b',
}

def detect_pii(text: str) -> List[dict]:
    findings = []
    for pii_type, pattern in PII_PATTERNS.items():
        matches = re.findall(pattern, text)
        if matches:
        findings.append({
            "type": pii_type,
            "count": len(matches),
            "risk": "HIGH" if pii_type in ["ssn", "credit_card"] else "MEDIUM"
        })
    return findings

# Use before storing user-generated content:
content = user_input
pii_found = detect_pii(content)
if pii_found:
    logger.warning(f"PII detected in user content: {pii_found}")
    # Either reject, redact, or handle per your policy`, type: "hands-on", difficulty: "mid", hint: "Use regex patterns for common PII types. This is a first-pass detection — ML models (like AWS Comprehend or Azure PII detection) give better accuracy." },
        { question: "Your company wants to use EU customer data to train an AI model. What GDPR considerations apply?", answer: "Key questions: 1) Lawful basis — was the data collected with a lawful basis that covers AI training? The original purpose (e.g., service delivery) likely doesn't cover ML training — purpose limitation applies. You may need a new lawful basis or user consent for training. 2) If using legitimate interests for training: conduct an LIA, implement opt-out. 3) Data minimization — can you train on anonymized or synthetic data instead? 4) Automated decision-making — if the model makes decisions affecting users, Article 22 rights apply (human review, explanation). 5) Data retention — training data and model weights may need deletion procedures. 6) Processor agreement with your ML platform (AWS SageMaker, GCP Vertex, etc.). Best practice: use anonymized or synthetic data for training if possible.", type: "scenario", difficulty: "senior" },
        { question: "How do you handle a user who repeatedly submits abusive or manifestly unfounded Subject Access Requests?", answer: "GDPR Article 12(5) allows you to charge a reasonable fee or refuse to act on requests that are 'manifestly unfounded or excessive, in particular because of their repetitive character.' Steps: 1) Document each request with timestamps and what was provided. 2) After multiple requests in a short period (define in policy, e.g., more than 2 in 12 months), assess if it's excessive. 3) If yes, notify the user in writing that you will charge a fee for subsequent requests OR explain why you are refusing. 4) The user can complain to the supervisory authority. 5) You must demonstrate the 'manifestly excessive' determination. Never refuse a first-time SAR without a clear reason.", type: "scenario", difficulty: "senior" },
      ],
        },
      ],
      exam: [
        { question: "Name the seven GDPR principles.", answer: "Lawfulness/fairness/transparency, purpose limitation, data minimization, accuracy, storage limitation, integrity and confidentiality, accountability.", difficulty: "junior" },
        { question: "What are the six lawful bases for processing personal data?", answer: "Consent, contract, legal obligation, vital interests, public task, legitimate interests.", difficulty: "junior" },
        { question: "What is the GDPR breach notification timeline and to whom?", answer: "Notify supervisory authority within 72 hours of awareness. Notify affected individuals without undue delay if high risk to their rights. Maintain internal breach register for all breaches.", difficulty: "junior" },
        { question: "What special categories of data receive extra GDPR protection?", answer: "Health, biometric, genetic data; racial/ethnic origin; political opinions; religious/philosophical beliefs; trade union membership; sex life/sexual orientation; criminal convictions.", difficulty: "mid" },
        { question: "When is a Data Protection Officer (DPO) mandatory?", answer: "Public authorities (except courts), organizations that carry out large-scale systematic monitoring of individuals (e.g., behavior tracking), or organizations processing special category data at large scale.", difficulty: "mid" },
        { question: "What mechanisms allow GDPR-compliant data transfers to the US?", answer: "EU-US Data Privacy Framework (2023 adequacy decision), Standard Contractual Clauses (SCCs — 2021 version), Binding Corporate Rules (intra-group only), derogations in Article 49 (consent, vital interests, etc.).", difficulty: "mid" },
        { question: "A user withdraws marketing consent. What must happen within what timeframe?", answer: "Stop all marketing processing immediately. Remove from all marketing lists. Confirm withdrawal to the user. The data itself can be retained if there's another lawful basis (e.g., contract, legal obligation), but must not be used for marketing. GDPR says 'without undue delay' — best practice is within 24-48 hours.", difficulty: "mid" },
        { question: "What is a Data Processing Agreement and when is it required?", answer: "A DPA is required whenever a controller engages a processor to process personal data. It must specify: subject matter/duration/nature of processing, type of data, obligations/rights of both parties, processor can only act on controller's instructions, security measures required, subprocessor approval process, and cooperation with audits.", difficulty: "mid" },
        { question: "How does GDPR's right to erasure interact with backup systems?", answer: "Erasure requests must eventually propagate to backups. Best practice: use backup rotation cycles short enough that erased data is gone within the 30-day response window. Or maintain an erasure log and apply deletions when backups are restored. Data 'in backup' is still personal data if it can be restored and identified.", difficulty: "senior" },
        { question: "What is a Legitimate Interests Assessment (LIA) and when do you need one?", answer: "An LIA is a three-part test used when relying on legitimate interests as a lawful basis: 1) Purpose test — is there a legitimate interest? 2) Necessity test — is processing necessary for that purpose? 3) Balancing test — do the legitimate interests override the individual's rights/interests? Document the LIA. Not appropriate for children's data or special categories.", difficulty: "senior" },
      ],
    },
    {
      id: "soc2-and-frameworks",
      title: "SOC 2, PCI-DSS & Compliance Automation",
      level: "advanced",
      description: "SOC 2 audit readiness, PCI-DSS controls, ISO 27001 basics, and compliance as code.",
      lessons: [
        {
          id: "soc2-pci-fundamentals",
          title: "SOC 2 & PCI-DSS Fundamentals",
          duration: 55,
          type: "lesson",
          description: "SOC 2 Trust Service Criteria, Type I vs Type II, PCI-DSS requirements, and audit readiness.",
          objectives: [
            "Explain the five SOC 2 Trust Service Criteria",
            "Distinguish SOC 2 Type I from Type II",
            "Map PCI-DSS requirements to DevOps practices",
            "Build evidence for a SOC 2 audit",
            "Understand ISO 27001 applicability",
          ],
          tags: ["SOC2", "PCI-DSS", "ISO27001", "audit", "controls"],
          content: `## SOC 2: Service Organization Control 2

SOC 2 is a voluntary audit framework by AICPA that evaluates a service organization's controls around **security, availability, processing integrity, confidentiality, and privacy**. B2B SaaS companies commonly undergo SOC 2 audits to give enterprise customers assurance.

### Five Trust Service Criteria (TSC)

| Criterion | What Auditors Examine |
|-----------|----------------------|
| **Security (CC)** | Access controls, encryption, incident response, change management, risk assessment — required for all SOC 2 reports |
| **Availability (A)** | Uptime commitments, disaster recovery, performance monitoring |
| **Processing Integrity (PI)** | Complete, valid, accurate, timely processing — important for financial/payment systems |
| **Confidentiality (C)** | Data classified as confidential is protected through lifecycle |
| **Privacy (P)** | AICPA's GAPP principles aligned with GDPR/CCPA |

### Type I vs Type II

| | Type I | Type II |
|-|--------|---------|
| **What** | Controls described and designed appropriately | Controls are operating effectively |
| **Period** | Point in time | 6-12 month observation period |
| **Value** | Faster to obtain; shows intent | Higher assurance; shows controls actually work |
| **Timeline** | 2-4 months | 6-18 months |

Most enterprise customers require Type II. Start with Type I to get certified faster, then pursue Type II.

### Common SOC 2 CC Controls

\`\`\`
CC6.1 - Logical and physical access controls
CC6.2 - User provisioning/deprovisioning
CC6.3 - Role-based access control
CC7.1 - Vulnerability management
CC7.2 - Monitoring for anomalies
CC8.1 - Change management process
CC9.1 - Risk assessment process
\`\`\`

### Building Evidence

Auditors request evidence for each control. Automate evidence collection:

\`\`\`bash
# Evidence for CC6.1: List all IAM users and their MFA status
aws iam generate-credential-report
aws iam get-credential-report --query 'Content' --output text | \\
  base64 -d | grep -v mfa_active=false

# Evidence for CC7.1: Vulnerability scan results
aws ecr describe-image-scan-findings \\
  --repository-name my-app \\
  --image-id imageTag=latest

# Evidence for CC8.1: Change management - git log as evidence
git log --oneline --since="90 days ago" > change_log_evidence.txt
\`\`\`

## PCI-DSS: Payment Card Industry Data Security Standard

PCI-DSS applies to any organization that stores, processes, or transmits cardholder data (credit/debit card numbers, CVV, PINs). Version 4.0 is current (released 2022).

### 12 PCI-DSS Requirements

1. Install and maintain network security controls
2. Apply secure configurations to all system components
3. Protect stored account data
4. Protect cardholder data with strong cryptography in transit
5. Protect all systems from malware
6. Develop and maintain secure systems and software
7. Restrict access to system components by business need-to-know
8. Identify users and authenticate access
9. Restrict physical access to cardholder data
10. Log and monitor all access to system components and cardholder data
11. Test security of systems and networks regularly
12. Support information security with organizational policies

### PCI Scope Reduction

The best PCI strategy is **scope reduction** — minimize where cardholder data flows:

\`\`\`
Without scope reduction:
Web server → App server → DB (all in PCI scope)

With tokenization:
User → Payment iframe (Stripe/Braintree hosted) → Token returned
Your app stores TOKEN only (not card number)
→ Only the payment vendor handles actual card data
→ Your scope is dramatically reduced (SAQ A or SAQ A-EP)
\`\`\`

## ISO 27001

International standard for Information Security Management Systems (ISMS). 114 controls across 14 domains. Certification requires external audit against the standard. More process/policy focused than SOC 2's control testing. Common in Europe and enterprise procurement requirements.`,
          interviewQuestions: [
            { question: "What is the difference between SOC 2 Type I and Type II?", answer: "Type I: auditor tests that controls are appropriately designed at a single point in time. Faster (2-4 months), less expensive, shows intent. Type II: auditor tests that controls operated effectively over an observation period (typically 6-12 months). Higher assurance, required by most enterprise customers, takes 6-18 months total. Start with Type I to get certified, then pursue Type II for the following period.", difficulty: "junior" },
            { question: "What are the five SOC 2 Trust Service Criteria and which is always required?", answer: "Security (CC - Common Criteria), Availability (A), Processing Integrity (PI), Confidentiality (C), Privacy (P). Security is always required — every SOC 2 report must include the Security criterion. The others are optional and chosen based on the service's commitments to customers.", difficulty: "junior" },
            { question: "How does tokenization reduce PCI-DSS scope?", answer: "Tokenization replaces a real card number with a meaningless token. If you use a payment processor's hosted fields or hosted payment page, the card number never touches your servers — it goes directly to the payment processor who returns a token. Your servers only ever see the token, which is worthless if stolen. This reduces your PCI scope from SAQ D (most extensive) to SAQ A (simplest) or SAQ A-EP. Fewer systems in scope means fewer controls to implement and audit.", difficulty: "mid" },
            { question: "What evidence would you collect to demonstrate CC6.1 (logical access controls) for a SOC 2 audit?", answer: "CC6.1 requires restricting access to authorized users. Evidence: IAM user list with MFA status (from AWS credential report), evidence of role-based access (IAM policies, roles, and who has them), user access review records (quarterly reviews of who has access to what), offboarding checklists showing access removed within 24h of termination, evidence of least privilege (no users with AdministratorAccess unless documented), VPN/bastion host logs showing all production access is controlled, and evidence that SSH keys are rotated and unused accounts are disabled.", difficulty: "senior" },
            { question: "What is a Shared Responsibility Model in the context of SOC 2 on AWS?", answer: "AWS has its own SOC 2 report covering their infrastructure controls (physical security, hypervisor, network). You rely on AWS's controls for the underlying infrastructure. Your SOC 2 report covers what you control: application access controls, data handling, your use of AWS services (how you configure security groups, S3 permissions, etc.). AWS provides their SOC 2 report as evidence of subservice organization controls — you can reference it in your report for the infrastructure layer. This is documented in your SOC 2 via the 'Complementary User Entity Controls' or 'Complementary Subservice Organization Controls' section.", difficulty: "senior" },
          ],
          quizQuestions: [
            { question: "Your startup just signed its first enterprise customer who requires SOC 2 Type II. You have no existing compliance program. What is your 12-month roadmap?", answer: "Month 1-2: Gap assessment — compare current controls to SOC 2 Common Criteria. Identify which TSC to include (start with Security only). Engage an auditor early for readiness assessment. Month 2-4: Implement missing controls — document policies (access control, change management, incident response, risk assessment), implement MFA everywhere, set up vendor management, implement security awareness training, deploy logging/monitoring. Month 3-4: Implement evidence collection automation. Month 4-5: Internal readiness review, fix gaps. Month 5-6: Engage auditor for Type I audit (observation period not needed). Month 6-18: Begin Type II observation period. Month 18: Type II audit completes. Ongoing: quarterly user access reviews, annual risk assessments, security training.", type: "scenario", difficulty: "senior" },
            { question: "You are implementing a change management process for SOC 2 CC8.1. What controls must be in place?", answer: "Required for CC8.1 (Change Management): 1) All changes must go through a defined process (PR/MR review). 2) Changes must be reviewed and approved by someone other than the author. 3) Changes must be tested before production deployment. 4) Emergency changes must have a post-hoc approval process. 5) Change log must be maintained with who made what change, when, why, and who approved. Evidence to collect: Git commit history with PR approvals, deployment logs, CI/CD pipeline execution records, change tickets (Jira/Linear), and emergency change records. Automated: require GitHub branch protection with required reviews, CI must pass before merge, deployment pipeline logs stored for 12 months.", type: "scenario", difficulty: "mid" },
            { question: "Set up an automated vulnerability scanning pipeline that would satisfy SOC 2 CC7.1 requirements.", answer: `# .github/workflows/security-scan.yml
name: Security Vulnerability Scan
on:
  push:
    branches: [main, develop]
  schedule:
    - cron: '0 6 * * 1'  # Weekly Monday scan

jobs:
  container-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build image
        run: docker build -t app:latest .
      - name: Trivy vulnerability scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'app:latest'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'HIGH,CRITICAL'
          exit-code: '1'  # Fail on HIGH/CRITICAL
      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'

  sast-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Semgrep SAST
        uses: semgrep/semgrep-action@v1
        with:
          config: 'p/owasp-top-ten'`, type: "hands-on", difficulty: "mid", hint: "SOC 2 CC7.1 requires vulnerability monitoring. Use Trivy for containers and Semgrep/CodeQL for SAST. The key is automated, recurring scans with evidence (SARIF reports) stored." },
            { question: "A PCI-DSS audit finds that your developers have direct SSH access to production servers that process card data. What must change?", answer: "This violates multiple PCI-DSS requirements: Req 7 (restrict access by business need), Req 8 (MFA required for all non-console admin access to cardholder data environment), Req 10 (all access must be logged). Required changes: 1) Remove direct SSH — use a bastion/jump host with MFA (AWS Systems Manager Session Manager is ideal — no open SSH port, all sessions logged to CloudTrail/CloudWatch). 2) Implement just-in-time access — developers request temporary elevated access only when needed, with automatic expiration. 3) Log all session activity. 4) Separate developer access from cardholder data environment where possible. 5) Conduct annual access reviews. 6) Implement network segmentation so the CDE is isolated from developer workstations.", type: "scenario", difficulty: "senior" },
            { question: "Implement an OPA (Open Policy Agent) policy that prevents deployment of Docker images with HIGH or CRITICAL CVEs.", answer: `# policy/deny_vulnerable_images.rego
package kubernetes.admission

import future.keywords.if
import future.keywords.contains

deny contains msg if {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  not valid_image(container.image)
  msg := sprintf("Container image %v has not passed vulnerability scan", [container.image])
}

valid_image(image) if {
  scan := data.vulnerability_scans[image]
  scan.scan_complete == true
  scan.high_count == 0
  scan.critical_count == 0
  # Scan must be recent (within 7 days)
  time.now_ns() - scan.scanned_at < 7 * 24 * 60 * 60 * 1000000000
}

# Deploy with:
# kubectl apply -f - <<EOF
# apiVersion: v1
# kind: ConfigMap
# metadata:
#   name: opa-policy
# data:
#   deny_vulnerable_images.rego: |
#     <policy content>
# EOF`, type: "hands-on", difficulty: "senior", hint: "OPA Rego policies use 'deny' rules. Check the image scan results from your registry (ECR, Harbor) and reject if HIGH/CRITICAL CVEs exist or scan is stale." },
            { question: "How would you automate evidence collection for a SOC 2 audit using AWS and Python?", answer: `import boto3
import json
from datetime import datetime, timedelta

def collect_soc2_evidence():
    evidence = {"collected_at": datetime.utcnow().isoformat(), "controls": {}}

    # CC6.1: IAM users without MFA
    iam = boto3.client('iam')
    iam.generate_credential_report()
    import time; time.sleep(5)
    report = iam.get_credential_report()
    import csv, io
    reader = csv.DictReader(io.StringIO(report['Content'].decode()))
    no_mfa = [r['user'] for r in reader if r['mfa_active'] == 'false' and r['user'] != '<root_account>']
    evidence["controls"]["CC6.1_mfa"] = {"users_without_mfa": no_mfa, "compliant": len(no_mfa) == 0}

    # CC7.2: CloudTrail enabled in all regions
    ct = boto3.client('cloudtrail')
    trails = ct.describe_trails(includeShadowTrails=False)['trailList']
    multi_region = [t for t in trails if t.get('IsMultiRegionTrail')]
    evidence["controls"]["CC7.2_cloudtrail"] = {"multi_region_trails": len(multi_region), "compliant": len(multi_region) > 0}

    # Save evidence
    s3 = boto3.client('s3')
    filename = f"soc2-evidence/{datetime.utcnow().strftime('%Y%m%d')}.json"
    s3.put_object(Bucket="audit-evidence-bucket", Key=filename, Body=json.dumps(evidence))
    return evidence`, type: "hands-on", difficulty: "senior", hint: "Automate evidence collection with boto3. Store evidence in S3 with timestamps. Run this weekly during the Type II observation period." },
          ],
        },
        {
          id: "compliance-automation",
          title: "Compliance as Code",
          duration: 55,
          type: "lesson",
          description: "Automate compliance with OPA, Terraform Sentinel, AWS Config, Chef InSpec, and Prowler.",
          objectives: [
        "Write OPA Rego policies for Kubernetes admission control",
        "Use Terraform Sentinel for IaC policy enforcement",
        "Automate AWS Config rules for continuous compliance",
        "Run Prowler security assessments",
        "Build a compliance dashboard",
          ],
          tags: ["OPA", "Sentinel", "AWS-Config", "Prowler", "InSpec", "compliance-as-code"],
          content: `## Compliance as Code

Treating compliance controls as code means they are:
- **Version controlled** — auditors can see the history
- **Testable** — you can write unit tests for policies
- **Automated** — enforced before deployment, not after
- **Auditable** — evidence is generated automatically

### Open Policy Agent (OPA)

OPA is a general-purpose policy engine. Write policies in Rego:

\`\`\`rego
# policy/no_root_containers.rego
package kubernetes.admission

deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  container.securityContext.runAsRoot == true
  msg := sprintf("Container '%v' must not run as root", [container.name])
}

deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  not container.securityContext.readOnlyRootFilesystem
  msg := sprintf("Container '%v' must have read-only root filesystem", [container.name])
}
\`\`\`

Test your policies:
\`\`\`bash
# opa test policy/ -v
PASS: 5/5
\`\`\`

### Terraform Sentinel (HashiCorp)

Policy as code for Terraform plans — runs in CI/CD before \`terraform apply\`:

\`\`\`hcl
# sentinel/restrict-s3-public.sentinel
import "tfplan/v2" as tfplan

# All S3 buckets must block public access
main = rule {
  all tfplan.resource_changes as _, changes {
    changes.type is "aws_s3_bucket_public_access_block" implies {
      changes.change.after.block_public_acls is true
      changes.change.after.block_public_policy is true
      changes.change.after.restrict_public_buckets is true
    }
  }
}
\`\`\`

### AWS Config Continuous Compliance

\`\`\`bash
# Deploy multiple compliance rules
aws configservice put-config-rule --config-rule '{
  "ConfigRuleName": "s3-bucket-public-read-prohibited",
  "Source": {"Owner": "AWS", "SourceIdentifier": "S3_BUCKET_PUBLIC_READ_PROHIBITED"}
}'

aws configservice put-config-rule --config-rule '{
  "ConfigRuleName": "rds-storage-encrypted",
  "Source": {"Owner": "AWS", "SourceIdentifier": "RDS_STORAGE_ENCRYPTED"}
}'

aws configservice put-config-rule --config-rule '{
  "ConfigRuleName": "iam-user-mfa-enabled",
  "Source": {"Owner": "AWS", "SourceIdentifier": "IAM_USER_MFA_ENABLED"}
}'

# Check compliance status
aws configservice describe-compliance-by-config-rule
\`\`\`

### Prowler Security Assessment

\`\`\`bash
# Install and run Prowler
pip install prowler

# Run all HIPAA checks
prowler aws --compliance hipaa_aws \\
  --output-formats json html \\
  --output-directory ./prowler-reports

# Run SOC 2 checks
prowler aws --compliance soc2_aws

# Run for specific account
prowler aws --profile production \\
  --compliance pci_dss_v4_aws \\
  --severity high critical
\`\`\`

### Chef InSpec for Infrastructure Compliance

\`\`\`ruby
# inspec/controls/s3_security.rb
control 'S3-01' do
  impact 1.0
  title 'S3 buckets must not be public'
  desc 'All S3 buckets must block public access per HIPAA/SOC2'

  aws_s3_buckets.bucket_names.each do |bucket|
    describe aws_s3_bucket(bucket_name: bucket) do
      it { should_not be_public }
      its('bucket_acl') { should_not include('AllUsers') }
    end
  end
end

control 'RDS-01' do
  impact 1.0
  title 'RDS instances must be encrypted'

  aws_rds_instances.db_instance_identifiers.each do |db|
    describe aws_rds_instance(db_instance_identifier: db) do
      it { should be_encrypted }
      its('storage_encrypted') { should eq true }
    end
  end
end
\`\`\`

### Compliance Dashboard with Security Hub

AWS Security Hub aggregates findings from Config, GuardDuty, Inspector, Macie, and third-party tools into a single compliance dashboard with frameworks mapped:

\`\`\`bash
# Enable Security Hub with standard frameworks
aws securityhub enable-security-hub \\
  --enable-default-standards

# Enable specific standards
aws securityhub batch-enable-standards \\
  --standards-subscription-requests '[
    {"StandardsArn": "arn:aws:securityhub:::ruleset/cis-aws-foundations-benchmark/v/1.4.0"},
    {"StandardsArn": "arn:aws:securityhub:us-east-1::standards/pci-dss/v/3.2.1"}
  ]'

# Get compliance score
aws securityhub get-insights \\
  --insight-arns "arn:aws:securityhub:::insight/securityhub/default/18"
\`\`\``,
          interviewQuestions: [
        { question: "What is the benefit of 'compliance as code' over manual compliance checking?", answer: "Manual compliance is point-in-time, error-prone, expensive, and slow. Compliance as code is: continuous (checked on every deploy), automated (no human needed for routine checks), version-controlled (audit trail of when policies changed), testable (unit tests for policies), and scalable (same policy enforced across 100 accounts automatically). Evidence is generated automatically, making audits faster. Drift is detected immediately rather than at the next annual audit.", difficulty: "junior" },
        { question: "What is the difference between OPA and Terraform Sentinel for policy enforcement?", answer: "OPA is a general-purpose policy engine (open source) used for Kubernetes admission control, microservice authorization, and infrastructure validation. It runs at runtime (e.g., blocks a pod deployment). Terraform Sentinel is HashiCorp's policy-as-code framework that runs during the Terraform plan phase — it can prevent 'terraform apply' from running if policies are violated. Sentinel is tightly integrated with Terraform Cloud/Enterprise. OPA with Conftest can also validate Terraform plans. Use Sentinel if you're on Terraform Cloud; use OPA/Conftest for open-source Terraform.", difficulty: "mid" },
        { question: "How do you implement drift detection for compliance — detecting when a resource was manually changed outside of Terraform?", answer: "Use AWS Config: it detects when a resource configuration differs from its expected state. CloudTrail events trigger Config re-evaluation. For Terraform state drift: run 'terraform plan' periodically (scheduled CI job) — any diff indicates drift. Terraform Cloud has native drift detection. For a full solution: AWS Config rules define the policy, Config remediation actions (via Systems Manager Automation) auto-remediate violations, and SNS alerts notify the team. Store all config changes in a SIEM for audit trail.", difficulty: "senior" },
        { question: "Describe how to implement continuous compliance monitoring for a multi-account AWS environment.", answer: "Use AWS Organizations + Config aggregator: enable Config in all accounts, create an aggregator account to collect all findings. Deploy common Config rules via AWS Organization-level SCPs and CloudFormation StackSets — this ensures the same rules apply everywhere. Use Security Hub with cross-account aggregation in a security tooling account. Set up EventBridge rules in each account to forward compliance violations to a central SNS/SQS for alerting. Run Prowler from a centralized CI pipeline across all accounts using assumed roles. Generate weekly compliance reports from Security Hub's API. Use AWS Config conformance packs for pre-built compliance frameworks (HIPAA, PCI, NIST).", difficulty: "senior" },
        { question: "What is a Config conformance pack and how does it differ from individual Config rules?", answer: "A conformance pack is a collection of AWS Config rules and remediation actions packaged together to address a compliance framework. AWS provides pre-built packs for PCI-DSS, HIPAA, NIST 800-53, CIS Benchmarks, SOC 2. A conformance pack deploys all rules atomically and generates a consolidated compliance score for the entire pack. Individual Config rules are single checks. Conformance packs give you a framework-level view ('75% compliant with HIPAA') vs. individual rule pass/fail. Deploy via CloudFormation StackSets across an organization.", difficulty: "mid" },
          ],
          quizQuestions: [
        { question: "Your team wants to prevent any Terraform plan that creates a security group with port 22 (SSH) open to 0.0.0.0/0. Write the policy logic.", answer: `# OPA / Conftest policy (Rego)
package terraform.security_groups

deny[msg] {
  resource := input.resource_changes[_]
  resource.type == "aws_security_group"
  ingress := resource.change.after.ingress[_]
  ingress.from_port <= 22
  ingress.to_port >= 22
  cidr := ingress.cidr_blocks[_]
  cidr == "0.0.0.0/0"
  msg := sprintf(
    "Security group '%v' exposes SSH (port 22) to 0.0.0.0/0 - violates security policy",
    [resource.address]
  )
}

# Test:
# terraform plan -out=plan.tfplan
# terraform show -json plan.tfplan > plan.json
# conftest test plan.json --policy policy/`, type: "hands-on", difficulty: "mid", hint: "Use OPA/Conftest to validate Terraform plan JSON output. The plan shows resource_changes with before/after configurations." },
        { question: "Security Hub shows you are 60% compliant with CIS AWS Foundations Benchmark. What is your systematic approach to reaching 90%+?", answer: "1) Export all non-compliant findings: aws securityhub get-findings --filters SecurityControlId=[...] --record-state ACTIVE. 2) Group by control type (IAM, S3, CloudTrail, etc.) and count. 3) Prioritize HIGH severity findings first. 4) For each control category: write automation (Config remediation, Lambda auto-fix, Terraform changes). 5) Quick wins first — MFA on all IAM users, CloudTrail in all regions, S3 public access block at account level are often 10-20 findings each. 6) For manual controls (policies, procedures), assign owners with deadlines. 7) Re-assess weekly. 8) Track improvement on a dashboard. Common low-hanging fruit: enable Config, enable Security Hub standards, set account-level S3 block public access, enable MFA for root account, set CloudTrail to multi-region.", type: "scenario", difficulty: "senior" },
        { question: "Write a GitHub Actions workflow that runs Prowler on every merge to main and fails the pipeline if CRITICAL findings exist.", answer: `name: Compliance Check
on:
  push:
    branches: [main]

jobs:
  prowler-scan:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/ProwlerScanRole
          aws-region: us-east-1

      - name: Install Prowler
        run: pip install prowler

      - name: Run Prowler
        run: |
          prowler aws \\
        --compliance soc2_aws \\
        --severity critical \\
        --output-formats json \\
        --output-directory prowler-output

      - name: Check for critical findings
        run: |
          CRITICAL=\$(cat prowler-output/*.json | jq '[.[] | select(.severity == "critical" and .status == "FAIL")] | length')
          echo "Critical findings: \$CRITICAL"
          if [ "\$CRITICAL" -gt "0" ]; then
        echo "Pipeline failed: \$CRITICAL critical compliance violations"
        exit 1
          fi

      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: prowler-report
          path: prowler-output/`, type: "hands-on", difficulty: "mid", hint: "Use OIDC to assume an IAM role in the pipeline (no static credentials). Parse Prowler's JSON output to count CRITICAL/FAIL findings." },
        { question: "You need to enforce that all new RDS instances in your AWS organization must be encrypted. What combination of tools do you use?", answer: "Defense in depth approach: 1) AWS Config Rule (organization-level): rds-storage-encrypted managed rule deployed via conformance pack or StackSets to all accounts — detects unencrypted RDS instances. 2) AWS Organizations SCP: Deny the rds:CreateDBInstance action if StorageEncrypted is not true (use a condition key). This prevents creation at the API level. 3) Terraform policy: OPA/Sentinel rule that checks storage_encrypted = true in Terraform plans before apply. 4) Config remediation: auto-terminate or alert on unencrypted instances. The SCP is the strongest control (can't be bypassed), supported by Config for detection and Terraform policy for shift-left prevention.", type: "scenario", difficulty: "senior" },
        { question: "How do you test OPA policies before deploying them to production?", answer: `# Create test files alongside your policies
# policy/no_root_containers_test.rego
package kubernetes.admission

# Test case: root container should be denied
test_deny_root_container {
  deny[_] with input as {
    "request": {
      "kind": {"kind": "Pod"},
      "object": {
        "spec": {
          "containers": [{
        "name": "app",
        "image": "myapp:latest",
        "securityContext": {"runAsRoot": true}
          }]
        }
      }
    }
  }
}

# Test case: non-root container should be allowed
test_allow_non_root_container {
  count(deny) == 0 with input as {
    "request": {
      "kind": {"kind": "Pod"},
      "object": {
        "spec": {
          "containers": [{
        "name": "app",
        "securityContext": {"runAsRoot": false, "readOnlyRootFilesystem": true}
          }]
        }
      }
    }
  }
}

# Run tests:
# opa test policy/ -v`, type: "hands-on", difficulty: "senior", hint: "OPA has a built-in test framework. Test files use _test suffix and test_ prefix on test rules. Run with 'opa test'." },
        { question: "What is the 'shift left' principle in compliance and how do you implement it in a CI/CD pipeline?", answer: "Shift left means moving compliance checks earlier in the development lifecycle — catching violations during coding or pull requests rather than in production audits. Implementation: 1) Pre-commit hooks (git-secrets for credential detection, tflint for Terraform). 2) PR checks (Checkov for IaC security scanning, Trivy for container scanning, Semgrep for SAST). 3) CI pipeline (Prowler for AWS compliance, OPA/Conftest for policy validation, dependency scanning). 4) Staging enforcement (mandatory compliance gates before production deployment). 5) Production monitoring (AWS Config, Security Hub for drift detection). The earlier a violation is caught, the cheaper it is to fix — a misconfig caught in PR review costs minutes; the same issue in production audit costs days.", type: "scenario", difficulty: "mid" },
          ],
        },
      ],
      exam: [
        { question: "What is OPA and what language are its policies written in?", answer: "Open Policy Agent — a general-purpose policy engine. Policies are written in Rego, a declarative query language. OPA decouples policy decisions from application/infrastructure code. Used for Kubernetes admission control, microservice authorization, Terraform validation, and more.", difficulty: "junior" },
        { question: "What is the difference between preventive and detective compliance controls?", answer: "Preventive controls stop violations before they happen (SCP denying unencrypted RDS creation, OPA policy blocking insecure pods, Terraform Sentinel preventing bad infrastructure). Detective controls find violations after they happen (AWS Config rules, Prowler scans, CloudTrail analysis, Security Hub findings). Best practice: preventive for critical controls, detective for monitoring drift and catching edge cases.", difficulty: "mid" },
        { question: "How does AWS Config differ from CloudTrail?", answer: "CloudTrail logs API calls — who did what action, when, from where. Config records the configuration state of resources at a point in time and tracks how that state changes. CloudTrail = activity log (verb-based). Config = configuration snapshot (noun-based). Use CloudTrail for security forensics. Use Config for compliance (is this resource configured correctly?) and drift detection.", difficulty: "mid" },
        { question: "What is a Config conformance pack?", answer: "A collection of Config rules and remediation actions packaged together to address a compliance framework. AWS provides pre-built packs for PCI-DSS, HIPAA, NIST 800-53, CIS Benchmarks, SOC 2. Deploy across an organization with StackSets. Generates a compliance score for the entire framework.", difficulty: "mid" },
        { question: "What is Checkov and how does it fit into a compliance pipeline?", answer: "Checkov is an open-source static analysis tool for IaC (Terraform, CloudFormation, Kubernetes YAML, Dockerfile). It has 1000+ built-in checks mapped to CIS, SOC 2, HIPAA, PCI-DSS, and NIST. Run in CI/CD (pre-plan, pre-merge) to catch security/compliance misconfigs before they reach cloud infrastructure. Can generate SARIF output for GitHub Security tab integration.", difficulty: "mid" },
        { question: "What is the NIST Cybersecurity Framework and how does it relate to SOC 2?", answer: "NIST CSF is a voluntary framework with five functions: Identify, Protect, Detect, Respond, Recover. It's a risk management framework. SOC 2 maps well to NIST CSF — SOC 2 controls address Protect (access controls, encryption), Detect (monitoring, logging), and Respond (incident response). Many organizations use NIST CSF as their internal framework and SOC 2 as the external audit to validate it.", difficulty: "senior" },
        { question: "How do you handle false positives in automated compliance scanning?", answer: "False positives waste engineer time and erode trust in the tool. Handling: 1) Document suppressions with justification and owner (code-level comments or config files). 2) Use tool-specific suppression mechanisms (Prowler's ignore files, Trivy's .trivyignore, Checkov's skip_checks). 3) Require manager/security team approval for suppressions. 4) Set expiry dates on suppressions — review quarterly. 5) Track all suppressions in a register. 6) Distinguish 'risk accepted' (legitimate suppression) from 'under remediation' (tracking open issues). Auditors will ask about suppressed findings.", difficulty: "senior" },
        { question: "What is SBOM and why is it important for compliance?", answer: "Software Bill of Materials — a formal inventory of all components in a software artifact (libraries, versions, licenses, vulnerabilities). Required by US Executive Order 14028 for software sold to federal government. Important for compliance: identifies known vulnerabilities in dependencies (CVE tracking), tracks license compliance (GPL restrictions in commercial software), enables faster incident response when a new CVE drops. Generate with Syft, CycloneDX, or SPDX. Store SBOM in artifact registry alongside images.", difficulty: "senior" },
        { question: "How would you implement a policy that requires all Kubernetes pods to have resource limits defined?", answer: `# OPA/Gatekeeper constraint template
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: requireresourcelimits
spec:
  crd:
    spec:
      names:
        kind: RequireResourceLimits
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package requireresourcelimits
        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          not container.resources.limits.cpu
          msg := sprintf("Container %v missing CPU limit", [container.name])
        }
        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          not container.resources.limits.memory
          msg := sprintf("Container %v missing memory limit", [container.name])
        }`, difficulty: "senior" },
        { question: "What is the difference between a security audit and a penetration test, and when do compliance frameworks require each?", answer: "Security audit: systematic review of controls, policies, and configurations against a standard — can be done by internal or external team, produces a compliance report. Penetration test: simulated attack by skilled testers to find exploitable vulnerabilities — must be authorized, scoped, and documented. PCI-DSS requires both annual pen tests (internal + external) and quarterly vulnerability scans. SOC 2 requires evidence of security testing (pen test evidence is commonly used). HIPAA requires risk analysis (which may include pen testing). ISO 27001 requires systematic vulnerability assessments. Pen test results + remediation evidence are key audit artifacts.", difficulty: "senior" },
      ],
    },
  ],
};
