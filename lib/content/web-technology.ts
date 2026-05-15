import type { Track } from "./types";

export const webTechnologyTrack: Track = {
  id: "web-technology",
  title: "Web Technology",
  description: "Master HTTP, web servers, proxies, caching, and API security for production systems",
  icon: "Monitor",
  color: "#0ea5e9",
  gradient: "track-web-technology-gradient",
  level: "intermediate",
  estimatedHours: 15,
  tags: ["http", "nginx", "tls", "cdn", "caching", "api", "waf", "load-balancing"],
  modules: [
    {
      id: "http-https",
      title: "HTTP & HTTPS Fundamentals",
      level: "beginner",
      description: "Understand the protocol stack powering every web request — from HTTP methods and status codes to TLS handshakes and certificate chains.",
      lessons: [
        {
          id: "http-protocol",
          title: "HTTP Protocol: Methods, Status Codes & Headers",
          duration: 35,
          type: "lesson",
          description: "Deep dive into HTTP/1.1, HTTP/2, and HTTP/3 — methods, status codes, headers, the request/response lifecycle, cookies, sessions, and CORS.",
          objectives: [
            "Compare HTTP/1.1, HTTP/2, and HTTP/3 and explain when to use each",
            "Use the correct HTTP method for CRUD operations",
            "Interpret any HTTP status code class (2xx–5xx)",
            "Read and set common request/response headers",
            "Explain how cookies and sessions maintain state",
            "Configure CORS headers to allow cross-origin requests safely",
          ],
          tags: ["http", "http2", "http3", "cors", "cookies", "sessions", "status-codes"],
          content: `# HTTP Protocol: Methods, Status Codes & Headers

## HTTP Version Evolution

**HTTP/1.1** (1997) is the baseline. Each request opens a TCP connection, sends one request, waits for the response, and (with keep-alive) reuses the connection for the next request. Head-of-line blocking means one slow response stalls everything behind it.

**HTTP/2** (2015) multiplexes multiple requests over a single TCP connection using binary frames. A browser can send 100 requests simultaneously without opening 100 connections. Server push lets the server proactively send assets the client hasn't requested yet.

**HTTP/3** (2022) replaces TCP with QUIC (UDP-based). QUIC eliminates TCP's head-of-line blocking at the transport layer — a lost packet only stalls the stream it belongs to, not all streams. Critical for mobile networks with packet loss.

\`\`\`bash
# Check which HTTP version a site uses:
curl -sI --http2 https://example.com | grep -i "HTTP/"
# HTTP/2 200

# Force HTTP/3 with curl (if compiled with QUIC support):
curl --http3 https://cloudflare.com -I
\`\`\`

## HTTP Methods

| Method | Idempotent | Safe | Body | Use |
|--------|-----------|------|------|-----|
| GET | Yes | Yes | No | Fetch resource |
| HEAD | Yes | Yes | No | Fetch headers only |
| POST | No | No | Yes | Create resource |
| PUT | Yes | No | Yes | Replace resource entirely |
| PATCH | No | No | Yes | Partial update |
| DELETE | Yes | No | No | Remove resource |
| OPTIONS | Yes | Yes | No | CORS preflight, capability check |

**Idempotent** means calling it multiple times produces the same result. \`PUT /users/42\` with the same body always ends in the same state. \`POST /orders\` creates a new order each time — not idempotent.

\`\`\`bash
# Real-world REST API calls:
curl -X GET https://api.example.com/users/42
curl -X POST https://api.example.com/users -d '{"name":"Alice"}' -H "Content-Type: application/json"
curl -X PUT https://api.example.com/users/42 -d '{"name":"Alice Smith"}' -H "Content-Type: application/json"
curl -X PATCH https://api.example.com/users/42 -d '{"email":"alice@example.com"}' -H "Content-Type: application/json"
curl -X DELETE https://api.example.com/users/42
\`\`\`

## Status Codes

**2xx Success**
- \`200 OK\` — request succeeded
- \`201 Created\` — resource created (POST/PUT); Location header points to it
- \`204 No Content\` — success, no body (DELETE, PUT with no return)
- \`206 Partial Content\` — range request fulfilled (video streaming)

**3xx Redirection**
- \`301 Moved Permanently\` — cached forever by browsers; use for permanent URL changes
- \`302 Found\` — temporary redirect; not cached
- \`304 Not Modified\` — browser cache is fresh; no body sent
- \`307/308\` — temporary/permanent redirect preserving HTTP method (POST stays POST)

**4xx Client Errors**
- \`400 Bad Request\` — malformed syntax
- \`401 Unauthorized\` — authentication required
- \`403 Forbidden\` — authenticated but no permission
- \`404 Not Found\` — resource doesn't exist
- \`409 Conflict\` — state conflict (duplicate create)
- \`422 Unprocessable Entity\` — validation failed
- \`429 Too Many Requests\` — rate limited

**5xx Server Errors**
- \`500 Internal Server Error\` — generic crash
- \`502 Bad Gateway\` — upstream returned invalid response
- \`503 Service Unavailable\` — overloaded or maintenance
- \`504 Gateway Timeout\` — upstream timed out

## Important Headers

\`\`\`
# Request headers:
Host: api.example.com
Accept: application/json
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJSUzI1NiJ9...
Cache-Control: no-cache
If-None-Match: "abc123"
User-Agent: Mozilla/5.0...

# Response headers:
Content-Type: application/json; charset=utf-8
Cache-Control: public, max-age=3600
ETag: "abc123"
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1716000000
Vary: Accept-Encoding
\`\`\`

## Cookies & Sessions

Cookies are key=value pairs stored in the browser, sent with every matching request:

\`\`\`
Set-Cookie: session_id=abc123; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
\`\`\`

**Session flow:** browser sends credentials → server validates → server creates session in Redis with a random session ID → server sets \`Set-Cookie: session_id=<id>\` → browser includes cookie on every request → server looks up session ID in Redis to get user data.

## CORS

Browsers block cross-origin requests by default. CORS headers on the server tell the browser which origins are permitted:

\`\`\`bash
# Nginx CORS config for an API:
# add_header 'Access-Control-Allow-Origin' 'https://app.example.com';
# add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
# add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type';
# add_header 'Access-Control-Max-Age' 86400;
\`\`\`

For requests with credentials or non-simple methods, browsers send a **preflight** OPTIONS request first. The server must respond with the correct CORS headers before the real request proceeds.`,
          interviewQuestions: [
            {
              question: "What is the difference between HTTP/1.1, HTTP/2, and HTTP/3?",
              difficulty: "junior",
              answer: "HTTP/1.1 uses one request per TCP connection (with keep-alive reuse) and suffers from head-of-line blocking. HTTP/2 multiplexes multiple streams over one TCP connection using binary framing, eliminating per-request connection overhead. HTTP/3 uses QUIC over UDP, which eliminates TCP-level head-of-line blocking — a lost packet only blocks its own stream, not all streams. HTTP/3 is especially beneficial on high-latency or lossy mobile networks.",
            },
            {
              question: "What is the difference between PUT and PATCH?",
              difficulty: "junior",
              answer: "PUT replaces the entire resource with the request body — if you omit a field, it is removed. PATCH applies a partial update, only modifying the fields included in the request body. PUT is idempotent; PATCH is not guaranteed to be idempotent. Use PATCH when you want to update one attribute without sending the whole document.",
            },
            {
              question: "Explain the difference between 401 and 403 status codes.",
              difficulty: "junior",
              answer: "401 Unauthorized means the request lacks valid authentication credentials — the user is not logged in or the token is invalid/expired. 403 Forbidden means the server recognized the identity but the user does not have permission to access the resource. 401 should trigger a login prompt; 403 means access is denied regardless of credentials.",
            },
            {
              question: "How does CORS work and why does the browser enforce it?",
              difficulty: "mid",
              answer: "CORS (Cross-Origin Resource Sharing) is a browser security mechanism that prevents malicious scripts on one origin from making credentialed requests to another origin. The browser sends an Origin header with requests. For non-simple requests (non-GET/POST or custom headers), it first sends a preflight OPTIONS request. The server responds with Access-Control-Allow-Origin, Access-Control-Allow-Methods, and other headers. If the origin is not listed, the browser blocks the response. CORS is enforced client-side by browsers — server-to-server calls are not restricted by it.",
            },
            {
              question: "What is the difference between cookies and sessions, and what are their security implications?",
              difficulty: "mid",
              answer: "A cookie is a piece of data stored in the browser and sent with every matching request. A session is server-side state identified by a session ID stored in a cookie. Cookie-based auth stores the JWT or session token directly in the cookie — if stolen, the attacker can impersonate the user. Mitigations: HttpOnly prevents JavaScript access (XSS protection), Secure ensures HTTPS-only transmission, SameSite=Strict blocks CSRF, short Max-Age limits the exposure window. Sessions stored in Redis are invalidatable server-side; JWTs in cookies are not unless you maintain a blocklist.",
            },
          ],
          quizQuestions: [
            {
              question: "A client sends DELETE /orders/99 twice. The first call succeeds (200). What should the second call return?",
              type: "scenario",
              answer: "404 Not Found. DELETE is idempotent in that repeating it should not have additional side effects, but the resource no longer exists after the first call, so returning 404 is correct and RESTful.",
            },
            {
              question: "Your API returns 200 with {error: 'User not found'} in the JSON body. What is wrong with this?",
              type: "scenario",
              answer: "The HTTP status code and body are contradictory. A 200 status signals success to clients and intermediaries (proxies, monitoring tools), which will not treat it as an error. The correct approach is to return 404 Not Found with the error message in the body. Always use HTTP status codes semantically.",
            },
            {
              question: "A browser makes a fetch() call from https://app.example.com to https://api.example.com/data with an Authorization header. The server only has Access-Control-Allow-Origin: *. Will this work?",
              type: "scenario",
              answer: "No. Wildcard (*) is not allowed when the request includes credentials (Authorization header or cookies). The server must explicitly set Access-Control-Allow-Origin: https://app.example.com and also include Access-Control-Allow-Credentials: true.",
            },
            {
              question: "Configure an Nginx location block to add CORS headers allowing GET and POST from https://myapp.com, with a preflight cache of 24 hours.",
              type: "hands-on",
              hint: "Use add_header directives and handle OPTIONS method with a 204 return.",
              answer: "location /api/ { add_header 'Access-Control-Allow-Origin' 'https://myapp.com' always; add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always; add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always; add_header 'Access-Control-Max-Age' 86400; if (\$request_method = 'OPTIONS') { return 204; } proxy_pass http://backend; }",
            },
            {
              question: "Write a curl command to send a PATCH request updating only the email field of user 5 at https://api.example.com/users/5, with a Bearer token.",
              type: "hands-on",
              hint: "Use -X PATCH, -H for headers, and -d for the JSON body.",
              answer: "curl -X PATCH https://api.example.com/users/5 -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' -d '{\"email\":\"newemail@example.com\"}'",
            },
            {
              question: "A user reports they can log in but immediately get logged out on every page refresh. The session is stored server-side. What are three likely causes?",
              type: "hands-on",
              hint: "Think about cookie attributes, session storage, and load balancing.",
              answer: "1) The session cookie is missing Secure or SameSite attributes and is being dropped. 2) The session store (Redis/DB) has an extremely short TTL. 3) Multiple app servers each have their own in-memory session store — sticky sessions are not configured on the load balancer, so requests hit different servers that don't share session state.",
            },
          ],
        },
        {
          id: "https-tls",
          title: "HTTPS & TLS: Certificates, Handshakes & mTLS",
          duration: 40,
          type: "lesson",
          description: "Understand TLS/SSL from handshake mechanics to certificate types, CA chains, Let's Encrypt automation, HSTS, certificate pinning, SNI, and mutual TLS.",
          objectives: [
            "Trace the TLS 1.3 handshake step by step",
            "Distinguish DV, OV, and EV certificates",
            "Explain the certificate authority chain of trust",
            "Automate certificate issuance with Let's Encrypt / Certbot",
            "Configure HSTS and understand its security implications",
            "Explain SNI and why it enables virtual hosting over HTTPS",
            "Describe mTLS and where it is used in service meshes",
          ],
          tags: ["tls", "ssl", "certificates", "lets-encrypt", "hsts", "sni", "mtls", "pki"],
          content: `# HTTPS & TLS: Certificates, Handshakes & mTLS

## Why TLS Matters

HTTP sends everything in plaintext. Any network hop between client and server — ISP routers, Wi-Fi access points, CDN nodes — can read or modify the data. A coffee shop attacker with a packet capture tool can intercept every login form, session cookie, and API key sent over plain HTTP. TLS (Transport Layer Security) solves this with three guarantees: **confidentiality** (data is encrypted), **integrity** (any tampering is detected), and **authentication** (you are talking to the real server, not an impostor).

TLS 1.3 is the current standard (released 2018). TLS 1.2 is still widely deployed. TLS 1.0, 1.1, and all SSL versions are deprecated and cryptographically broken — never enable them.

## How TLS Works Internally: The Handshake

The TLS handshake is the negotiation phase before any application data is sent. It establishes which cryptographic algorithms to use and derives the shared session keys. Understanding it explains why TLS is both secure and fast.

### TLS 1.2 Handshake (2-RTT — the old way)

\`\`\`
Client                                           Server
  |                                                 |
  |--- ClientHello (random, cipher list, SNI) --->  |
  |                                                 |
  |<-- ServerHello (chosen cipher, random) ---      |
  |<-- Certificate (server cert chain) --------     |
  |<-- ServerHelloDone -------------------------     |
  |                                                 |
  |--- ClientKeyExchange (pre-master secret) ---->  |
  |--- ChangeCipherSpec --------------------------> |
  |--- Finished (encrypted) ---------------------> |
  |                                                 |
  |<-- ChangeCipherSpec --------------------------  |
  |<-- Finished (encrypted) ---------------------   |
  |                                                 |
  |=== Encrypted Application Data ===============  |
\`\`\`

TLS 1.2 takes **2 round trips** before any application data flows. On a 100ms latency link, this adds 200ms of overhead to every new connection.

### TLS 1.3 Handshake (1-RTT — the modern way)

TLS 1.3 redesigned the handshake to complete in **1 round trip** by combining the key exchange into the ClientHello:

\`\`\`
Client                                           Server
  |                                                 |
  |--- ClientHello -------------------------------->|
  |    Supported cipher suites (only AEAD ciphers)  |
  |    Key shares (ECDH public key for each group)  |
  |    TLS version extension (1.3)                  |
  |    Random nonce (32 bytes)                      |
  |    SNI (server hostname)                        |
  |                                                 |
  |<-- ServerHello -------------------------------- |
  |    Selected cipher suite                        |
  |    Server ECDH key share                        |
  |<-- {Certificate} (encrypted already) --------- |
  |<-- {CertificateVerify} -------------------- --- |
  |<-- {Finished} --------------------------------- |
  |                                                 |
  |--- {Finished} --------------------------------->|
  |--- {HTTP Request} -----------------------------> |   ← Application data in same flight!
  |                                                 |
  |<-- {HTTP Response} ----------------------------  |
\`\`\`

The curly braces indicate the messages are already encrypted — TLS 1.3 starts encrypting earlier in the handshake, which also means the server's certificate is encrypted in transit (protecting against passive surveillance of certificate metadata).

### How Session Keys Are Derived

The key exchange uses **Elliptic Curve Diffie-Hellman (ECDHE)**. Neither side ever sends the secret key over the wire:

1. Both sides independently generate ephemeral key pairs (public + private)
2. They exchange public keys
3. Each side computes the shared secret: \`shared_secret = my_private_key × their_public_key\`
4. Both arrive at the **same** shared secret without transmitting it
5. Session keys (one for each direction) are derived from the shared secret using a PRF (Pseudorandom Function)

The "E" in ECDHE means "Ephemeral" — new keys are generated for each connection. This provides **forward secrecy**: if a server's private key is compromised in the future, past session recordings cannot be decrypted because the ephemeral keys are never stored.

\`\`\`bash
# Inspect a TLS handshake in detail:
openssl s_client -connect example.com:443 -tls1_3
# Shows: cipher suite, curve used, certificate chain, session ticket

# What to look for in the output:
# New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384  ← cipher suite
# Server public key is 256 bit (ECDSA)            ← server key algorithm
# Verify return code: 0 (ok)                      ← certificate valid

# Force TLS 1.2 to compare:
openssl s_client -connect example.com:443 -tls1_2

# Check certificate expiry dates:
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
# notBefore=Jan  1 00:00:00 2024 GMT
# notAfter=Jan  1 00:00:00 2025 GMT
\`\`\`

## Certificate Anatomy

A TLS certificate is a signed document that binds a public key to an identity. It contains:

\`\`\`
Subject: CN=example.com, O=Example Corp, C=US
  (who the cert is for — the identity being certified)

Subject Alternative Names (SAN): DNS:example.com, DNS:www.example.com
  (all hostnames this cert is valid for — CN is deprecated, SANs are authoritative)

Issuer: CN=Let's Encrypt R11, O=Let's Encrypt, C=US
  (who signed it — the Certificate Authority)

Validity:
  Not Before: Jan 1 00:00:00 2024 GMT
  Not After:  Apr 1 00:00:00 2024 GMT
  (90 days for Let's Encrypt, up to 398 days for commercial CAs)

Public Key: ECDSA (P-256) or RSA (2048/4096)
  (the public half of the server's key pair)

Signature Algorithm: SHA256withRSA or ecdsa-with-SHA256
  (how the issuer signed this certificate — what you verify)

Signature: (binary blob — the CA's cryptographic signature over all the above)
\`\`\`

\`\`\`bash
# Read certificate details in human-readable form:
openssl x509 -in /etc/letsencrypt/live/example.com/cert.pem -noout -text

# Quick view of Subject and SANs:
openssl x509 -in cert.pem -noout -subject -ext subjectAltName

# Check SANs from a live connection:
echo | openssl s_client -connect example.com:443 2>/dev/null | \
  openssl x509 -noout -ext subjectAltName
\`\`\`

## Certificate Authority Chain

No browser trusts your certificate directly. The OS/browser ships with a list of ~150 **root CAs** (Certificate Authorities) whose public keys are pre-installed. Your certificate is issued by an **intermediate CA**, which is signed by a root CA. This creates a chain of trust:

\`\`\`
Root CA (trusted by OS — pre-installed, never expires during its use period)
  └── Intermediate CA (signed by root, typically 5-10 year validity)
        └── Your Leaf Certificate (signed by intermediate, 90 days to 1 year)
\`\`\`

**Why intermediates?** Root CA private keys are kept offline in hardware security modules in physically secured vaults. If an intermediate is compromised, it can be revoked and replaced without retiring the root. Intermediates do the day-to-day certificate signing.

**You must serve the full chain.** Your certificate alone is not enough — clients need to verify the entire chain from your cert to the root. If you only configure your leaf cert in Nginx, iOS devices and some older clients will fail because they don't automatically download missing intermediates.

\`\`\`bash
# Verify your chain is complete (should say: fullchain.pem: OK):
openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt fullchain.pem

# Check if the chain is complete on a live server:
openssl s_client -connect example.com:443 -showcerts 2>/dev/null | grep "subject\|issuer"
# Should show: your cert → intermediate → (root or nothing)
# If only one cert appears, you are missing the intermediate

# In Nginx: always use fullchain.pem, never cert.pem alone:
# ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;   ← correct
# ssl_certificate /etc/letsencrypt/live/example.com/cert.pem;        ← wrong
\`\`\`

## Certificate Types

| Type | Validation | Browser Indicator | Use Case |
|------|-----------|-------------------|----------|
| DV (Domain Validation) | DNS/HTTP challenge only | Padlock | Most sites, APIs |
| OV (Organization Validation) | Legal entity verified | Padlock | Corporate sites |
| EV (Extended Validation) | Strict legal vetting | Padlock (green bar removed by browsers in 2019) | Banks, e-commerce |

DV certs can be issued in seconds (Let's Encrypt does it automatically). OV/EV require human vetting — days to weeks. For the vast majority of use cases, DV from Let's Encrypt is the correct choice.

## Let's Encrypt & Certbot

Let's Encrypt is a free, automated CA run by the Internet Security Research Group. It uses the ACME protocol: the client proves domain control either by serving a specific file over HTTP or by creating a specific DNS TXT record. Certbot automates the full lifecycle.

\`\`\`bash
# Install Certbot with Nginx plugin on Ubuntu:
sudo apt install certbot python3-certbot-nginx

# Issue cert AND automatically configure Nginx:
sudo certbot --nginx -d example.com -d www.example.com
# Certbot will: issue cert, update nginx.conf, set up renewal

# Issue cert only (manage Nginx manually):
sudo certbot certonly --nginx -d example.com

# Wildcard cert (requires DNS-01 challenge — proves DNS control):
sudo certbot certonly --manual --preferred-challenges dns -d "*.example.com"
# Certbot will ask you to create: _acme-challenge.example.com TXT <value>
# Create the DNS record, wait ~60s for propagation, then press Enter

# Certificates are stored in:
# /etc/letsencrypt/live/example.com/fullchain.pem  ← cert + intermediate chain
# /etc/letsencrypt/live/example.com/privkey.pem    ← private key (keep secret)
# /etc/letsencrypt/live/example.com/cert.pem       ← cert only (rarely needed)
# /etc/letsencrypt/live/example.com/chain.pem      ← intermediate chain only

# Test auto-renewal (does not actually renew):
sudo certbot renew --dry-run
# Certbot installs a systemd timer: certbot.timer → runs twice daily
sudo systemctl list-timers certbot*

# Manually trigger renewal (if cert < 30 days from expiry):
sudo certbot renew --force-renewal

# After renewal, Nginx must reload to pick up the new cert:
# Add this to /etc/letsencrypt/renewal-hooks/post/reload-nginx.sh:
#!/bin/bash
systemctl reload nginx
\`\`\`

## HSTS (HTTP Strict Transport Security)

HSTS tells browsers to always use HTTPS for your domain, even if the user types \`http://\`. It prevents SSL stripping attacks — where a MITM attacker intercepts the HTTP request before HTTPS is established.

\`\`\`nginx
# In your Nginx server block for HTTPS:
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
\`\`\`

What each directive means:
- \`max-age=31536000\` — browser caches this policy for 1 year (31536000 seconds); any HTTP request within this period is automatically redirected to HTTPS by the browser itself before any network request is made
- \`includeSubDomains\` — applies to all subdomains (api.example.com, admin.example.com); only set this if ALL subdomains serve HTTPS
- \`preload\` — indicates you want to be added to the browser's hardcoded HSTS preload list; even first-time visitors get HTTPS enforcement without an initial HTTP visit

**HSTS is not the same as an HTTP-to-HTTPS redirect.** The 301 redirect handles new users. HSTS handles returning users — the browser never even tries HTTP for them.

**Warning:** \`includeSubDomains\` combined with a long \`max-age\` is a commitment. Once browsers cache this policy, you cannot serve any subdomain over HTTP for up to a year. Test with \`max-age=300\` in staging before deploying to production.

## SNI (Server Name Indication)

TLS negotiation happens before any HTTP data is sent — including the \`Host\` header. This created a problem: a server receiving a TLS connection doesn't know which domain the client wants, so it can't choose the right certificate if multiple domains share one IP.

SNI (Server Name Indication) solves this by adding the target hostname to the **ClientHello** message. The server reads the SNI field and selects the correct certificate before sending the ServerHello. This enables a single IP to serve thousands of HTTPS domains.

\`\`\`bash
# Without SNI (specify the IP directly), the server picks its default cert:
openssl s_client -connect 93.184.216.34:443

# With SNI (specify the hostname), the server picks the correct cert:
openssl s_client -connect 93.184.216.34:443 -servername example.com

# Verify what SNI name a connection uses:
curl -v --resolve example.com:443:93.184.216.34 https://example.com/ 2>&1 | grep "SNI\|SSL"
\`\`\`

## Mutual TLS (mTLS)

Standard TLS: the client verifies the server's certificate. The server does not verify who the client is — any client can connect.

Mutual TLS: both sides present certificates. The server verifies the client's certificate against a trusted CA. Only clients with valid certificates can connect. This implements authentication at the network level without any application-layer login.

**Where mTLS is used:**
- **Service meshes** (Istio, Linkerd): every service has a certificate issued by the mesh CA; services verify each other before forwarding requests — zero-trust east-west traffic
- **B2B APIs**: partners are issued client certificates; the API server only accepts connections from certificate holders
- **Zero-trust networks**: replacing VPNs with certificate-based network access control

\`\`\`nginx
# Nginx mTLS config — require and verify client certificate:
server {
    listen 443 ssl;
    server_name api.example.com;

    ssl_certificate /etc/nginx/certs/server.crt;       # server's cert
    ssl_certificate_key /etc/nginx/certs/server.key;   # server's private key

    ssl_client_certificate /etc/nginx/certs/client-ca.crt;  # CA that issued client certs
    ssl_verify_client on;                                    # require valid client cert
    ssl_verify_depth 2;                                      # verify chain up to 2 levels deep

    location / {
        # Client cert details are available as Nginx variables:
        # \$ssl_client_s_dn     — subject DN: "CN=service-a,O=MyOrg,C=US"
        # \$ssl_client_verify   — SUCCESS, FAILED, or NONE
        # \$ssl_client_serial   — cert serial number (for revocation checks)
        proxy_set_header X-Client-Cert-Subject \$ssl_client_s_dn;
        proxy_set_header X-Client-Verify \$ssl_client_verify;
        proxy_pass http://backend;
    }
}
\`\`\`

\`\`\`bash
# Test mTLS with curl (provide client cert and key):
curl --cert /etc/certs/client.crt \
     --key /etc/certs/client.key \
     --cacert /etc/certs/ca.crt \
     https://api.example.com/v1/data

# Without a client cert, the server should reject with:
# SSL routines:ssl3_read_bytes:sslv3 alert bad certificate
\`\`\`

## OCSP Stapling

When a browser receives a certificate, it needs to check whether the certificate has been revoked. Without OCSP stapling, the browser makes a separate HTTP request to the CA's OCSP server for every HTTPS connection — adding latency and leaking browsing behavior to the CA.

OCSP stapling lets the server periodically fetch its own OCSP response from the CA and include ("staple") it in the TLS handshake. The client gets the revocation status from the server without making a separate request to the CA.

\`\`\`nginx
# Enable OCSP stapling in Nginx:
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;  # CA chain for verification
resolver 8.8.8.8 1.1.1.1 valid=300s;  # Nginx needs a resolver to fetch OCSP responses
resolver_timeout 5s;
\`\`\`

## Common TLS Mistakes in Production

**1. Serving only the leaf certificate (missing intermediate)**
Symptom: "Certificate not trusted" on iOS or certain Android versions. Fix: use \`fullchain.pem\` in Nginx's \`ssl_certificate\` directive.

**2. Wildcard cert on the apex domain**
A \`*.example.com\` cert does NOT cover \`example.com\` (the apex). You need either a SAN cert covering both, or two separate certs.

**3. Certificate expired silently**
Let's Encrypt sends email reminders 20 days before expiry, but auto-renewal hooks are often misconfigured. Set up external monitoring: \`check_http -S -p 443 -C 30\` (Nagios/Icinga), or Prometheus ssl_exporter to alert when expiry < 30 days.

**4. Mixed content**
HTTPS page loading HTTP sub-resources (images, scripts, iframes). Browsers block these. Fix: update all hard-coded \`http://\` URLs to \`https://\` or protocol-relative \`//\`.

**5. Weak cipher suites from TLS 1.2**
TLS 1.2 allows weak ciphers (RC4, 3DES, CBC-mode AES without AEAD). Test with: \`nmap --script ssl-enum-ciphers -p 443 example.com\` or \`testssl.sh example.com\`.

\`\`\`nginx
# Hardened TLS configuration for Nginx (disables weak ciphers):
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
ssl_prefer_server_ciphers off;  # In TLS 1.3 the client picks; for TLS 1.2 we still set this

# Verify your configuration:
# testssl.sh --protocols --ciphers example.com
\`\`\`

## Production Pattern: Certificate Monitoring

Even with auto-renewal, always monitor certificate expiry externally:

\`\`\`bash
# Shell script to check expiry (run from cron or monitoring system):
DOMAIN="example.com"
EXPIRY=$(echo | openssl s_client -connect \$DOMAIN:443 -servername \$DOMAIN 2>/dev/null \
         | openssl x509 -noout -enddate | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "\$EXPIRY" +%s)
NOW_EPOCH=$(date +%s)
DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

if [ \$DAYS_LEFT -lt 30 ]; then
    echo "ALERT: \$DOMAIN cert expires in \$DAYS_LEFT days"
    # Send to PagerDuty, Slack, etc.
fi
echo "\$DOMAIN: \$DAYS_LEFT days remaining"
\`\`\``,
          interviewQuestions: [
            {
              question: "Walk me through the TLS 1.3 handshake.",
              difficulty: "mid",
              answer: "The client sends a ClientHello with supported cipher suites, its key share (Diffie-Hellman public key), and a random nonce. The server responds with ServerHello (chosen cipher, its DH key share), the certificate chain, and a Finished message. Both sides derive the session keys from the DH exchange without transmitting any key material directly. The client verifies the certificate against trusted CAs, sends its Finished, and the connection is encrypted. All of this happens in one round trip. For resumption, TLS 1.3 supports 0-RTT using session tickets.",
            },
            {
              question: "What is the difference between DV, OV, and EV certificates?",
              difficulty: "junior",
              answer: "DV (Domain Validation) only verifies that the requester controls the domain — issued in minutes via DNS/HTTP challenge. OV (Organization Validation) additionally verifies the legal entity behind the domain — requires business documentation. EV (Extended Validation) has the strictest vetting process, verifying legal, operational, and physical existence. Browsers historically showed a green bar for EV, though modern browsers have removed this visual distinction. For most use cases, DV (e.g., from Let's Encrypt) is sufficient.",
            },
            {
              question: "What is SNI and why is it important?",
              difficulty: "mid",
              answer: "SNI (Server Name Indication) is a TLS extension that allows the client to specify the target hostname in the ClientHello message, before the server responds with a certificate. Without SNI, a server can only present one certificate per IP address because the certificate selection happens before any HTTP Host header is read. With SNI, a single IP/port can serve thousands of different HTTPS domains by selecting the appropriate certificate based on the SNI value.",
            },
            {
              question: "What is mTLS and when would you use it?",
              difficulty: "senior",
              answer: "Mutual TLS (mTLS) is a TLS mode where both the client and server must present valid certificates from a trusted CA. Standard TLS only authenticates the server. mTLS provides strong service identity — the server knows exactly which service is connecting. Used in service meshes (Istio, Linkerd) for east-west traffic between microservices, zero-trust network architectures, B2B APIs where partners are issued client certificates, and internal corporate APIs. The main operational challenge is certificate lifecycle management for client certs at scale.",
            },
            {
              question: "A site sets Strict-Transport-Security with max-age=31536000 and includeSubDomains. The team decides to temporarily serve HTTP for a maintenance page on a subdomain. What happens?",
              difficulty: "senior",
              answer: "Users whose browsers have cached the HSTS policy (within the max-age window) will refuse to connect via HTTP to any subdomain. The browser enforces HTTPS-only before even sending a request. Because HSTS is cached for up to 1 year, you cannot undo this quickly — users who visited the site within the max-age window will be affected. The correct approach is to serve the maintenance page over HTTPS, or to have set a short max-age during development. This is why includeSubDomains should be set carefully.",
            },
          ],
          quizQuestions: [
            {
              question: "Your certificate is valid but users report SSL errors on iOS. You notice your Nginx config only includes ssl_certificate server.crt (not fullchain.pem). What is the issue?",
              type: "scenario",
              answer: "You are not serving the intermediate certificate. iOS (and some other clients) do not perform AIA fetching to download missing intermediates. Without the full chain, the client cannot build the trust path to the root CA. The fix is to use the fullchain.pem file (server cert + intermediate) in the ssl_certificate directive.",
            },
            {
              question: "Let's Encrypt certificates expire every 90 days. Certbot is installed but the auto-renewal cron failed silently for 3 months. What monitoring would have caught this?",
              type: "scenario",
              answer: "1) Monitor certificate expiry with a check tool (e.g., Prometheus ssl_exporter, Datadog TLS check, or a simple curl | openssl script in cron). Alert when expiry is less than 30 days away. 2) Set up alerting on Certbot renewal failures via systemd service status or cron job exit codes. 3) Use Let's Encrypt's expiry notification emails (sent 20 days before expiry).",
            },
            {
              question: "A developer wants to use 0-RTT (early data) in TLS 1.3 to speed up login POST requests. Is this safe?",
              type: "scenario",
              answer: "No. 0-RTT data is not replay-safe — an attacker who captures a 0-RTT packet can replay it, causing the server to process it multiple times. For idempotent GET requests, 0-RTT is acceptable. For state-changing requests like login POSTs, it is not safe unless the application implements its own replay protection (e.g., nonces). Most frameworks disable 0-RTT for POST requests by default.",
            },
            {
              question: "Write the Nginx SSL config directives to: use TLS 1.2 and 1.3 only, use a strong cipher list, enable HSTS for 1 year including subdomains.",
              type: "hands-on",
              hint: "Use ssl_protocols, ssl_ciphers, ssl_prefer_server_ciphers, and add_header Strict-Transport-Security.",
              answer: "ssl_protocols TLSv1.2 TLSv1.3; ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384; ssl_prefer_server_ciphers off; add_header Strict-Transport-Security 'max-age=31536000; includeSubDomains' always;",
            },
            {
              question: "Use openssl to check the TLS certificate expiry date and subject for api.github.com.",
              type: "hands-on",
              hint: "Pipe openssl s_client output into openssl x509 with -noout -dates -subject flags.",
              answer: "echo | openssl s_client -connect api.github.com:443 -servername api.github.com 2>/dev/null | openssl x509 -noout -dates -subject",
            },
            {
              question: "Set up Certbot to issue a wildcard certificate for *.staging.example.com using DNS-01 challenge. What DNS record must be created?",
              type: "hands-on",
              hint: "Wildcard certs require DNS challenge. Certbot will tell you the exact TXT value to set.",
              answer: "Run: certbot certonly --manual --preferred-challenges dns -d '*.staging.example.com'. Certbot will prompt you to create a TXT record: _acme-challenge.staging.example.com with a specific value. After creating it and waiting for DNS propagation, press Enter to complete validation. The cert is stored in /etc/letsencrypt/live/staging.example.com/.",
            },
          ],
        },
      ],
      exam: [
        { question: "A user reports that navigating to your site over HTTP is not redirecting to HTTPS, even though HSTS is configured. The HSTS max-age is set to 31536000. What is the most likely reason?", answer: "HSTS is only enforced by browsers that have previously visited the site over HTTPS and cached the policy. A brand-new user (or a user whose HSTS cache has expired) visiting via HTTP for the first time will not be automatically upgraded by the browser — the redirect must be handled by the server (a 301 from Nginx). HSTS prevents downgrade attacks only after the first HTTPS visit. Use a 301 redirect on the server for all HTTP requests, and consider submitting to the HSTS preload list for first-visit protection.", difficulty: "mid" },
        { question: "Your API returns a 504 Gateway Timeout to clients but the backend server logs show requests completing successfully in under 2 seconds. What is the likely cause?", answer: "The reverse proxy (Nginx or a load balancer) has a shorter timeout than the backend takes to respond. The backend completes successfully, but Nginx's proxy_read_timeout has already expired and sent a 504 to the client. Fix: align proxy_read_timeout in Nginx with the actual maximum response time of the backend. Also check upstream keepalive timeouts — if the backend closes an idle keepalive connection and Nginx tries to reuse it, it can also cause 504s on the first request.", difficulty: "mid" },
        { question: "You receive a bug report: 'After clicking a link in our marketing email, I'm not logged in even though I was logged in moments ago.' Sessions use cookies with SameSite=Strict. Explain what is happening.", answer: "SameSite=Strict prevents the session cookie from being sent on cross-site navigations, including when a user follows a link from an email client (which is considered a cross-site context). The user appears logged out because the browser did not send the session cookie with the navigation. To fix this: use SameSite=Lax instead, which sends the cookie on top-level GET navigations (clicking a link) but not on cross-site POST or subresource requests. SameSite=Lax still protects against CSRF while preserving the login state on link navigation.", difficulty: "senior" },
        { question: "A client reports seeing another user's cached API response. The API endpoint returns user-specific data and has no Cache-Control header set. What happened and how do you fix it?", answer: "Without a Cache-Control header, CDNs and shared proxies may cache the response by default. All users requesting the same URL receive the cached response from the first user. Fix: add Cache-Control: private, no-store to all authenticated and user-specific API responses. The private directive instructs shared caches not to store the response. Audit your CDN configuration for default caching rules and purge any existing cached user-specific responses immediately.", difficulty: "senior" },
        { question: "Explain the difference between HTTP/2 multiplexing and HTTP/1.1 keep-alive. Why does HTTP/2 eliminate head-of-line blocking at the HTTP layer?", answer: "HTTP/1.1 keep-alive reuses a single TCP connection for multiple requests but processes them serially — the next request can only begin after the previous response is fully received. HTTP/2 uses binary framing to multiplex multiple streams over one TCP connection simultaneously. Each request/response pair is a stream identified by a stream ID; frames from different streams can be interleaved. This eliminates HTTP-level head-of-line blocking because a slow response on stream 3 does not block streams 1, 2, or 4. Note: HTTP/2 still has TCP-level head-of-line blocking (a lost TCP packet blocks all streams), which HTTP/3/QUIC resolves.", difficulty: "mid" },
        { question: "A developer asks why their POST login request is getting an OPTIONS request first that seems to fail. Explain what is happening and how to fix it.", answer: "The browser is sending a CORS preflight OPTIONS request before the actual POST because the request has a custom header (e.g., Content-Type: application/json or Authorization), which qualifies it as a 'non-simple' CORS request. The browser asks the server if the cross-origin POST is allowed before sending it. If the server does not respond correctly to OPTIONS, the browser blocks the real request. Fix: configure the server to respond to OPTIONS requests with the appropriate CORS headers (Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers) and a 200 or 204 status. In Nginx, add an 'if ($request_method = OPTIONS) { return 204; }' block with the CORS headers.", difficulty: "mid" },
        { question: "Your certificate renews successfully with Certbot but traffic keeps hitting the old expired certificate. What is the most likely cause?", answer: "Nginx (or Apache) has not been reloaded after the certificate renewal. Certbot renews the certificate files, but the web server continues using the old certificate that was loaded into memory at startup. Fix: configure Certbot's renewal hook to reload the web server after renewal. In /etc/letsencrypt/renewal-hooks/post/, add a script containing 'systemctl reload nginx'. Alternatively, Certbot's --nginx plugin does this automatically. Verify with 'echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates'.", difficulty: "mid" },
        { question: "Explain what mTLS provides that standard TLS does not, and give a concrete use case where it is required.", answer: "Standard TLS authenticates only the server — the client verifies the server's certificate but the server does not verify the client. mTLS (mutual TLS) requires both sides to present and verify certificates. The server knows exactly which client (identified by its certificate's CN/SAN) is connecting. This prevents unauthorized services from making requests even if they can reach the network endpoint. Concrete use case: in a microservices environment using Istio, every service has a certificate issued by the mesh CA. Service A's sidecar verifies Service B's certificate before forwarding the request, ensuring only services within the mesh can communicate — implementing zero-trust networking without application code changes.", difficulty: "senior" },
        { question: "What is the purpose of the ETag header and how does it reduce bandwidth?", answer: "An ETag is a unique identifier for a specific version of a resource (typically a hash of the content). The server includes ETag: 'abc123' in its response. On subsequent requests, the browser sends If-None-Match: 'abc123'. If the resource has not changed, the server returns 304 Not Modified with no body — saving the bandwidth of re-transmitting the content. ETag is more precise than Last-Modified/If-Modified-Since because it handles cases where the modification time changes without content changes (touching a file). ETags are especially valuable for large resources like API responses or images that change infrequently.", difficulty: "junior" },
        { question: "A penetration tester reports that your site is vulnerable to a session fixation attack. Your session cookie does not have the HttpOnly attribute. Explain the attack chain and how to remediate.", answer: "Session fixation: an attacker tricks a victim into using a session ID chosen by the attacker (e.g., by sharing a URL with a known session ID in a query parameter). If the server does not generate a new session ID after login, the attacker already knows the session ID and can hijack the session. Without HttpOnly, XSS can also steal the cookie directly. Remediation: (1) Always generate a new session ID upon successful login (invalidate the pre-authentication session). (2) Add HttpOnly to session cookies to prevent JavaScript access. (3) Add Secure to prevent transmission over HTTP. (4) Use SameSite=Strict or Lax to prevent CSRF. (5) Validate that session IDs cannot be set via query parameters.", difficulty: "senior" },
      ],
    },
    {
      id: "web-servers-proxy",
      title: "Web Servers, Proxy & Load Balancing",
      level: "intermediate",
      description: "Configure Nginx and Apache for production, implement reverse proxies, and design load balancing strategies with HAProxy.",
      lessons: [
        {
          id: "nginx-apache-config",
          title: "Nginx & Apache: Virtual Hosts, Caching & Rate Limiting",
          duration: 45,
          type: "lesson",
          description: "Production Nginx and Apache configuration — virtual hosts, server blocks, location blocks, static file serving, gzip/brotli compression, caching headers, rate limiting, and connection limits.",
          objectives: [
            "Configure Nginx server blocks and location blocks for multiple domains",
            "Serve static files efficiently with correct caching headers",
            "Enable gzip and brotli compression",
            "Implement rate limiting and connection limits",
            "Compare Nginx event-driven vs Apache process/thread models",
            "Set up Apache virtual hosts",
          ],
          tags: ["nginx", "apache", "virtual-hosts", "compression", "rate-limiting", "caching"],
          content: `# Nginx & Apache: Virtual Hosts, Caching & Rate Limiting

## Nginx vs Apache Architecture

**Nginx** uses an event-driven, asynchronous, non-blocking architecture. A single worker process handles thousands of connections using epoll/kqueue. This makes it extremely efficient for high-concurrency workloads and static file serving. A 4-core server running Nginx can typically serve 10,000+ concurrent connections.

**Apache** defaults to the prefork MPM (one process per connection) or worker MPM (threads). Prefork is heavy — 1,000 concurrent requests means 1,000 processes each consuming ~10MB RAM. The worker MPM improves this significantly. The event MPM (similar to Nginx's model) is available but less commonly used.

**Rule of thumb:** Nginx for front-end (static files, TLS termination, proxying), Apache when you need .htaccess or mod_php (PHP applications that pre-date PHP-FPM).

## Nginx Server Blocks

\`\`\`nginx
# /etc/nginx/sites-available/example.com
server {
    listen 80;
    server_name example.com www.example.com;
    # Redirect HTTP to HTTPS
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    root /var/www/example.com/html;
    index index.html;

    # Logging
    access_log /var/log/nginx/example.com.access.log;
    error_log  /var/log/nginx/example.com.error.log warn;

    # Main location block
    location / {
        try_files \$uri \$uri/ =404;
    }

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static assets with long cache
    location ~* \\.(js|css|png|jpg|gif|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}
\`\`\`

## Location Block Priority

Nginx matches location blocks in this order:
1. Exact match: \`location = /path\`
2. Preferential prefix: \`location ^~ /path\`
3. Regex (first match): \`location ~ /pattern\` or \`location ~* /pattern\` (case-insensitive)
4. Longest prefix: \`location /path\`

## Compression: gzip and Brotli

\`\`\`nginx
# In nginx.conf http block:
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_types text/plain text/css text/javascript application/json
           application/javascript application/x-javascript
           text/xml application/xml image/svg+xml;

# Brotli (requires ngx_brotli module — included in nginx mainline):
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript
             text/xml application/xml image/svg+xml;
\`\`\`

Brotli achieves ~20% better compression than gzip for text. The \`Vary: Accept-Encoding\` header (set by \`gzip_vary on\`) tells CDNs to cache separate copies for gzip vs brotli clients.

## Caching Headers

\`\`\`nginx
# HTML — always revalidate (content changes frequently):
location ~* \\.html$ {
    add_header Cache-Control "no-cache, must-revalidate";
    etag on;
}

# Hashed assets (e.g., main.abc123.js — immutable):
location ~* \\.[0-9a-f]{8}\\.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# API responses — short cache, must revalidate:
location /api/ {
    add_header Cache-Control "private, max-age=0, must-revalidate";
}
\`\`\`

## Rate Limiting

\`\`\`nginx
# Define a rate limit zone in http block:
# 10 requests/second per IP, zone stored in 10MB shared memory
limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=10r/s;

# Apply in a server or location block:
location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
    # burst=20: allow up to 20 queued requests
    # nodelay: process burst immediately, not delayed
    limit_req_status 429;
    proxy_pass http://backend;
}

# Connection limits:
limit_conn_zone \$binary_remote_addr zone=conn_limit:10m;
location /download/ {
    limit_conn conn_limit 5;  # Max 5 concurrent connections per IP
}
\`\`\`

## Apache Virtual Hosts

\`\`\`apache
# /etc/apache2/sites-available/example.com.conf
<VirtualHost *:80>
    ServerName example.com
    ServerAlias www.example.com
    Redirect permanent / https://example.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName example.com
    DocumentRoot /var/www/example.com/html

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/example.com/cert.pem
    SSLCertificateChainFile /etc/letsencrypt/live/example.com/chain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/example.com/privkey.pem

    <Directory /var/www/example.com/html>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Enable compression
    AddOutputFilterByType DEFLATE text/html text/css application/javascript

    ErrorLog \${APACHE_LOG_DIR}/example.com.error.log
    CustomLog \${APACHE_LOG_DIR}/example.com.access.log combined
</VirtualHost>
\`\`\``,
          interviewQuestions: [
            {
              question: "How does Nginx's event-driven architecture differ from Apache's process-based model?",
              difficulty: "mid",
              answer: "Nginx uses a single-threaded event loop per worker process. Each worker handles thousands of connections non-blocking using OS primitives like epoll (Linux) or kqueue (BSD). When a connection is waiting for I/O, the worker moves to the next connection instead of blocking. Apache's prefork MPM forks one process per connection — 1000 connections = 1000 processes, each using 8–20MB of RAM. Apache's event MPM is more similar to Nginx's model but Nginx is still generally more efficient for high-concurrency static serving and proxying.",
            },
            {
              question: "Explain Nginx location block matching priority.",
              difficulty: "mid",
              answer: "Nginx evaluates location blocks in this order: (1) exact match = /path, which stops processing immediately; (2) preferential prefix ^~ /path, which prevents regex matching; (3) regular expressions ~ (case-sensitive) and ~* (case-insensitive) — first match wins; (4) longest prefix /path — used if no regex matches. A common mistake is putting a catch-all regex before a more specific prefix, causing the regex to match first.",
            },
            {
              question: "What does the Vary: Accept-Encoding response header do?",
              difficulty: "mid",
              answer: "Vary: Accept-Encoding tells CDNs and caching proxies that the response varies based on the client's Accept-Encoding request header. This means the cache must store separate copies for gzip-capable and non-gzip clients. Without this header, a CDN might serve a gzip-compressed response to a client that doesn't support gzip (because it cached the gzip version and doesn't know it varies). Nginx's gzip_vary on directive sets this header automatically.",
            },
            {
              question: "What is the difference between limit_req and limit_conn in Nginx?",
              difficulty: "mid",
              answer: "limit_req controls the request rate — it limits how many HTTP requests per second an IP can make. It uses a leaky bucket algorithm: requests over the rate are queued (up to the burst limit) or dropped. limit_conn limits the number of concurrent open connections from an IP. These serve different purposes: limit_req prevents API abuse and bot traffic, while limit_conn prevents slowloris-style attacks and limits bandwidth hogs on download endpoints.",
            },
            {
              question: "When should you use Apache over Nginx?",
              difficulty: "junior",
              answer: "Apache is preferred when: (1) you need .htaccess files for per-directory configuration (common in shared hosting and WordPress), (2) you use mod_php (PHP embedded in Apache — simpler for some setups), (3) the application uses Apache-specific modules like mod_rewrite with complex rules already written for Apache syntax. Nginx is generally preferred for new deployments: better performance, easier configuration, built-in rate limiting, and excellent reverse proxy capabilities. In practice, Nginx is often used as the front-end proxy passing requests to Apache or PHP-FPM.",
            },
          ],
          quizQuestions: [
            {
              question: "An Nginx server has two location blocks: location ~* \\.php$ and location /api/. A request for /api/data.php arrives. Which block matches?",
              type: "scenario",
              answer: "The regex ~* \\.php$ matches because regex blocks take priority over prefix blocks. To force /api/ to match first and prevent .php requests there, use location ^~ /api/ (the ^~ prefix prevents regex matching for that prefix).",
            },
            {
              question: "Your static site gets a Lighthouse score of 40 for performance. Network tab shows JS and CSS files are served without compression. What Nginx config change fixes this?",
              type: "scenario",
              answer: "Enable gzip compression: add 'gzip on;' and 'gzip_types text/css application/javascript;' in the http or server block. Also add 'gzip_vary on;' so CDNs cache correctly. For even better compression, add brotli if the ngx_brotli module is available. Then run nginx -s reload.",
            },
            {
              question: "After enabling Nginx rate limiting at 10r/s with burst=20, a load test shows some requests get 429 even though the overall rate is below 10/s. Why?",
              type: "scenario",
              answer: "Rate limiting in Nginx uses a leaky bucket algorithm that smooths requests to exactly the defined rate. Even if the average is 10r/s, if requests arrive in bursts (all at once), they exceed the instantaneous rate. The burst=20 parameter allows 20 additional requests to be queued. With nodelay, queued requests are served immediately but counted against the burst budget. Without nodelay, excess requests are delayed. Increase burst or adjust rate to match actual traffic patterns.",
            },
            {
              question: "Write an Nginx location block that serves files from /var/www/static, sets a 1-year cache for .jpg and .png files, and returns 404 for .php files.",
              type: "hands-on",
              hint: "Use separate location blocks with different directives. Use return 404 for PHP files.",
              answer: "location /static/ { root /var/www; location ~* \\.(jpg|png)$ { expires 1y; add_header Cache-Control 'public, immutable'; } location ~* \\.php$ { return 404; } }",
            },
            {
              question: "Enable gzip compression in an Apache virtual host for HTML, CSS, and JavaScript content types.",
              type: "hands-on",
              hint: "Use mod_deflate with AddOutputFilterByType or SetOutputFilter.",
              answer: "<IfModule mod_deflate.c> AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json SetEnvIfNoCase Request_URI \\.(?:gif|jpe?g|png)$ no-gzip dont-vary Header append Vary User-Agent env=!dont-vary </IfModule>",
            },
            {
              question: "Configure Nginx to limit the /login endpoint to 5 requests per minute per IP, returning 429 on excess, with no burst allowance.",
              type: "hands-on",
              hint: "Use limit_req_zone with rate in r/m, then apply with limit_req in a location block. Set burst=0 or omit it.",
              answer: "In http block: limit_req_zone \$binary_remote_addr zone=login_limit:10m rate=5r/m; In server block: location = /login { limit_req zone=login_limit; limit_req_status 429; proxy_pass http://backend; }",
            },
          ],
        },
        {
          id: "proxy-loadbalancing",
          title: "Reverse Proxy, Load Balancing & HAProxy",
          duration: 40,
          type: "lesson",
          description: "Reverse proxy vs forward proxy, load balancing algorithms (round-robin, least-connections, IP-hash), HAProxy configuration, upstream health checks, and sticky sessions.",
          objectives: [
            "Explain the difference between reverse proxy and forward proxy",
            "Configure Nginx upstream blocks with multiple load balancing algorithms",
            "Configure HAProxy for TCP and HTTP load balancing",
            "Implement upstream health checks",
            "Configure sticky sessions and explain their tradeoffs",
            "Understand weighted load balancing and its use cases",
          ],
          tags: ["nginx", "haproxy", "load-balancing", "reverse-proxy", "health-checks", "sticky-sessions"],
          content: `# Reverse Proxy, Load Balancing & HAProxy

## Forward Proxy vs Reverse Proxy

The distinction matters at the TCP level, not just conceptually.

A **forward proxy** intercepts outbound connections from clients. The client is configured to send its requests to the proxy rather than the destination server. The proxy makes the request on the client's behalf and returns the response. The server sees only the proxy's IP address. Use cases: corporate egress filtering, circumventing geo-restrictions, anonymization (Tor), caching outbound traffic in an enterprise network.

A **reverse proxy** intercepts inbound connections to servers. The client has no idea it is talking to a proxy — it thinks the proxy IS the server. The proxy receives the connection, forwards it to one of the backend servers, and returns the response. The client only ever sees the proxy's IP. Use cases: load balancing, TLS termination (backends serve plain HTTP), caching, WAF, routing based on URL path or host.

\`\`\`
Forward proxy — client knows about the proxy:
Client (configured to use proxy) → [Proxy] → Internet → Server
Destination server sees proxy IP

Reverse proxy — client is unaware:
Client → [Nginx/HAProxy:443] → Backend Server 1 (10.0.0.1:3000)
                              → Backend Server 2 (10.0.0.2:3000)
                              → Backend Server 3 (10.0.0.3:3000)
Client sees only 203.0.113.10:443 (the proxy's IP)
\`\`\`

**Why terminate TLS at the reverse proxy?** Your backend servers serve plain HTTP to the proxy (private network, trusted). The proxy handles TLS with the client (public network, untrusted). Benefits: backends don't need SSL certs or SSL libraries; SSL inspection tools (WAF, logging) can see plaintext; certificate management is centralized on the proxy.

## Layer 4 vs Layer 7 Load Balancing

This is one of the most important distinctions in load balancing design.

**Layer 4 (Transport Layer) load balancing** operates on TCP/UDP packets without understanding the application protocol. It sees source/destination IP and port, TCP flags, and packet payload as opaque bytes. Decisions are made purely on network-level information.

- Pros: extremely fast (pure network routing, can be hardware-accelerated), protocol-agnostic (works for any TCP service)
- Cons: cannot route based on HTTP headers, URLs, or cookies; cannot inject headers; cannot do SSL termination at the load balancer level (SSL passthrough only)
- Use cases: high-throughput TCP services, UDP load balancing, raw database connection load balancing

**Layer 7 (Application Layer) load balancing** understands HTTP. It can read the complete HTTP request before forwarding it — headers, URL path, cookies, request body.

- Pros: can route /api to one backend and /static to another; can insert X-Forwarded-For headers; can perform SSL termination; can do header-based routing (A/B testing); can implement rate limiting per-user or per-endpoint
- Cons: higher CPU overhead (must parse each HTTP request); slightly higher latency; cannot handle non-HTTP protocols without protocol-specific plugins
- Use cases: web applications, microservices routing, API gateways

In practice: cloud load balancers (AWS ALB = L7, AWS NLB = L4), HAProxy (supports both), Nginx (L7 by default, L4 with stream module).

## Nginx Load Balancing

\`\`\`nginx
# /etc/nginx/conf.d/upstream.conf

# Round-robin (default) — requests distributed sequentially:
upstream backend_rr {
    server 10.0.0.1:3000;
    server 10.0.0.2:3000;
    server 10.0.0.3:3000;
}

# Weighted round-robin — server 1 gets 3x the traffic:
upstream backend_weighted {
    server 10.0.0.1:3000 weight=3;
    server 10.0.0.2:3000 weight=1;
    server 10.0.0.3:3000 weight=1;
}

# Least connections — new request goes to server with fewest active connections:
upstream backend_least {
    least_conn;
    server 10.0.0.1:3000;
    server 10.0.0.2:3000;
    server 10.0.0.3:3000;
}

# IP hash — same client IP always routes to the same server (basic sticky sessions):
upstream backend_iphash {
    ip_hash;
    server 10.0.0.1:3000;
    server 10.0.0.2:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend_rr;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
    }
}
\`\`\`

## Nginx Health Checks (Open Source)

\`\`\`nginx
upstream backend {
    server 10.0.0.1:3000 max_fails=3 fail_timeout=30s;
    server 10.0.0.2:3000 max_fails=3 fail_timeout=30s;
    # If a server fails 3 times in 30s, remove it for 30s
}
\`\`\`

Active health checks (polling a health endpoint) require Nginx Plus. The open-source version uses passive health checks — it marks a server down only after actual request failures.

## HAProxy Configuration

HAProxy is a dedicated high-performance load balancer with more fine-grained control than Nginx:

\`\`\`
# /etc/haproxy/haproxy.cfg

global
    log /dev/log local0
    maxconn 50000
    user haproxy
    group haproxy
    daemon

defaults
    log global
    mode http
    option httplog
    option dontlognull
    timeout connect 5s
    timeout client  30s
    timeout server  30s
    retries 3

frontend web_front
    bind *:80
    bind *:443 ssl crt /etc/ssl/certs/example.pem
    http-request redirect scheme https unless { ssl_fc }
    default_backend web_back

backend web_back
    balance roundrobin
    option httpchk GET /health HTTP/1.1\\r\\nHost:\\ example.com
    http-check expect status 200
    server web1 10.0.0.1:3000 check inter 5s rise 2 fall 3
    server web2 10.0.0.2:3000 check inter 5s rise 2 fall 3
    server web3 10.0.0.3:3000 check inter 5s rise 2 fall 3 backup
\`\`\`

HAProxy health check parameters:
- \`check\` — enable active health checking
- \`inter 5s\` — check every 5 seconds
- \`rise 2\` — mark healthy after 2 consecutive successes
- \`fall 3\` — mark unhealthy after 3 consecutive failures
- \`backup\` — only used when all primary servers are down

## Load Balancing Algorithms In Depth

**Round-robin:** Each request goes to the next server in sequence. Server 1, Server 2, Server 3, Server 1, ... Assumes all requests take the same time and all servers have the same capacity. Simple and effective for homogeneous stateless workloads. Fails when requests have variable processing time — a server accumulates slow requests while others are idle.

**Weighted round-robin:** Like round-robin but each server gets a proportion of traffic based on its weight. A server with weight=3 gets 3 requests for every 1 sent to a weight=1 server. Use when servers have different CPU/RAM capacities.

**Least connections:** Each new request goes to the server with the fewest currently active connections. Tracks per-server active connection count. Better than round-robin when request duration varies — a server running slow queries accumulates connections and gets fewer new ones. Overhead: the load balancer must maintain connection counts.

**IP hash:** Hash the client's IP address to consistently route to the same backend. Client 1.2.3.4 always hits server A; client 5.6.7.8 always hits server B. Provides basic stickiness without cookies. Fatal flaw: if most clients share one public IP (corporate NAT, carrier-grade NAT), all traffic goes to one server.

**Least response time (HAProxy):** Routes to the server with the fastest response time combined with the fewest connections. Most adaptive algorithm — learns which servers are slow under load. Requires HAProxy to measure backend response times.

**Random:** Pick a server randomly from the pool. Surprisingly effective for large pools with uniform capacity. Avoids coordinated behavior that can happen with round-robin under certain traffic patterns (e.g., all load-test threads synchronized).

| Algorithm | Best For | Avoid When |
|-----------|---------|-----------|
| Round-robin | Stateless, uniform requests | Variable request duration |
| Weighted | Heterogeneous server capacity | Weights become stale as traffic changes |
| Least connections | Variable request duration | Connection tracking adds overhead at very high RPS |
| IP hash | Legacy stateful apps, basic stickiness | Corporate NAT concentrates traffic |
| Least response time | Latency-sensitive, mixed workloads | Not available in Nginx open source |
| Random | Large pools, uniform capacity | Need guaranteed distribution |

## Sticky Sessions: When and Why to Avoid Them

When application session state is stored in server memory (not a shared store), users must always reach the same backend. The alternative is that session data is "on the other server" and the user gets logged out.

\`\`\`
# HAProxy cookie-based sticky sessions:
backend app_back
    balance roundrobin

    # HAProxy inserts SERVERID cookie into responses:
    cookie SERVERID insert  # insert: HAProxy adds the cookie
                   indirect # don't set cookie if already set
                   nocache  # tell CDNs not to cache this response

    server app1 10.0.0.1:8080 check cookie app1  # cookie value for this server
    server app2 10.0.0.2:8080 check cookie app2
    server app3 10.0.0.3:8080 check cookie app3

# Now when app1 serves a user, HAProxy sets: Set-Cookie: SERVERID=app1
# Subsequent requests with SERVERID=app1 always go to app1
\`\`\`

**Why sticky sessions are a scaling anti-pattern:**
1. Adding a new server doesn't help existing users — they stay on their assigned server
2. If server app1 goes down, all users on app1 lose their session
3. Rolling deployments are harder — you must drain a server before restarting it
4. Uneven load if some users are more active than others (heavy users always hit one server)

**The correct fix:** externalize session state to Redis. Any backend can serve any user because session data lives in a shared store, not in-process memory.

## Connection Draining for Zero-Downtime Deployments

When you need to remove a backend for maintenance or deployment, you cannot just kill it — in-flight requests would fail. Connection draining (also called graceful shutdown) stops new requests while letting existing ones complete.

\`\`\`bash
# HAProxy graceful drain via admin socket:

# Step 1: Put server in DRAIN state (stop new connections, let existing ones finish):
echo "set server backend/web1 state drain" | socat stdio /var/run/haproxy.sock

# Step 2: Watch active connection count drop to zero:
watch -n 1 'echo "show servers state" | socat stdio /var/run/haproxy.sock | grep web1'

# Step 3: Once connections = 0, put in MAINT (completely remove from rotation):
echo "set server backend/web1 state maint" | socat stdio /var/run/haproxy.sock

# Step 4: Deploy new version, start the server, verify health:
systemctl restart myapp

# Step 5: Return to service:
echo "set server backend/web1 state ready" | socat stdio /var/run/haproxy.sock
\`\`\`

Nginx does not have native connection draining — it relies on upstream health checks (passive). For Nginx, a common pattern is: remove the server from upstream config, reload Nginx (which only affects new connections), and let existing connections drain naturally.

## Common Mistakes in Production Load Balancing

**1. Not setting proxy headers on the backend**
Without \`X-Forwarded-For\`, your backend logs all traffic from the proxy IP (127.0.0.1 or 10.0.0.x). Real client IPs are lost. Always set \`proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for\` and configure your app to read it for logging.

**2. IP hash when clients are behind NAT**
If your B2B clients all use corporate VPNs or CGNAT, a single IP can represent thousands of users. IP hash sends all of them to one backend.

**3. Health check path returns 200 even when the app is broken**
A common mistake: the health check hits \`/health\` which returns 200 regardless of database connectivity. Real health checks should verify that the application's dependencies are responsive.

\`\`\`
# Good health check: verify the full stack works
# In HAProxy:
option httpchk GET /health/deep HTTP/1.1\r\nHost:\ example.com
http-check expect string {"status":"ok"}   # check for specific JSON content, not just 200
\`\`\`

**4. Session persistence with mutable server state**
If you rely on sticky sessions because of in-memory state (caches, queued jobs), a server restart loses all state for all users on that server. The correct solution is always external state in Redis.`,
          interviewQuestions: [
            {
              question: "What is the difference between round-robin and least-connections load balancing?",
              difficulty: "junior",
              answer: "Round-robin distributes requests sequentially across backends — each server gets one request in turn. This works well when requests have similar processing time. Least-connections routes each new request to the server with the fewest currently active connections — this is better when request duration varies significantly (e.g., some requests take 1ms and others take 5s). Least-connections adapts to actual server load, while round-robin can overload a slow server if it's accumulating connections.",
            },
            {
              question: "Why are sticky sessions problematic in production?",
              difficulty: "mid",
              answer: "Sticky sessions route a user to the same server every time, which: (1) creates uneven load if some users are more active than others; (2) means all traffic for a user is lost when that server goes down or is replaced; (3) complicates rolling deployments since you must drain connections before removing a server; (4) defeats the purpose of horizontal scaling — adding a server doesn't help existing users. The correct solution is to store session state in a shared external store (Redis, Memcached) so any backend can serve any user.",
            },
            {
              question: "What headers should a reverse proxy set when forwarding requests?",
              difficulty: "mid",
              answer: "Key headers: X-Real-IP (original client IP), X-Forwarded-For (chain of IPs if through multiple proxies), X-Forwarded-Proto (original scheme — http or https, since the backend might see http if TLS is terminated at the proxy), Host (original Host header, since the proxy may have a different hostname configured for the backend). The backend application uses these headers for logging, redirects, and security checks.",
            },
            {
              question: "What is the difference between active and passive health checks?",
              difficulty: "mid",
              answer: "Passive health checks mark a backend unhealthy only after real client requests fail (connection error, timeout, 5xx response). No additional requests are made — failures during normal traffic are detected. Active health checks proactively send synthetic requests to a health endpoint (e.g., GET /health) at a defined interval, independent of client traffic. Active checks detect failures faster and before real clients experience them. HAProxy supports active health checks in the open-source version; Nginx requires the Plus subscription for active checks.",
            },
            {
              question: "An IP-hash load balancer with 3 backends has 90% of traffic going to one server. What is the likely cause and solution?",
              difficulty: "senior",
              answer: "IP-hash distributes traffic based on client IP addresses. If most clients come from behind a NAT (e.g., a corporate office or mobile carrier), they all share one public IP, so all their requests hash to the same backend. The solution is to switch to a different stickiness mechanism: cookie-based sticky sessions (HAProxy SERVERID cookie), or better yet, move session state to Redis and use round-robin or least-connections for true horizontal scaling.",
            },
          ],
          quizQuestions: [
            {
              question: "Your app has 3 backends. One server is 4x more powerful than the others. Which algorithm and configuration best utilizes this?",
              type: "scenario",
              answer: "Weighted round-robin: assign weight=4 to the powerful server and weight=1 to the others. This sends 4 out of every 6 requests to the powerful server. Example Nginx config: upstream backend { server 10.0.0.1:3000 weight=4; server 10.0.0.2:3000 weight=1; server 10.0.0.3:3000 weight=1; }",
            },
            {
              question: "Users report intermittent 502 Bad Gateway errors but backend servers look healthy in monitoring. The errors happen only under high load. What are three likely causes?",
              type: "scenario",
              answer: "1) Backend servers are overwhelmed and closing connections before Nginx can proxy — increase proxy_read_timeout and check backend capacity. 2) The Nginx upstream has too few keepalive connections configured, causing connection exhaustion — add 'keepalive 32;' in the upstream block. 3) Backend servers have a max connection limit (e.g., Node.js single-threaded, PHP-FPM pool size) that is being exceeded — tune the backend worker count and add queue limits.",
            },
            {
              question: "A deployment requires zero downtime. You need to remove a backend from rotation during deployment. What HAProxy mechanism enables graceful draining?",
              type: "scenario",
              answer: "HAProxy supports graceful removal via the admin socket: 'echo \"set server web_back/web1 state drain\" | socat stdio /var/run/haproxy.sock'. In drain state, the server receives no new connections but existing connections complete. Once connections drop to zero, remove the server: 'echo \"set server web_back/web1 state maint\" | socat stdio /var/run/haproxy.sock'. After deployment, return it: 'echo \"set server web_back/web1 state ready\" | socat stdio /var/run/haproxy.sock'.",
            },
            {
              question: "Write an Nginx upstream block that uses least-connections across 3 backends, with a health check that removes a backend after 2 failures in 20 seconds.",
              type: "hands-on",
              hint: "Use least_conn directive and max_fails/fail_timeout parameters on each server line.",
              answer: "upstream backend { least_conn; server 10.0.0.1:3000 max_fails=2 fail_timeout=20s; server 10.0.0.2:3000 max_fails=2 fail_timeout=20s; server 10.0.0.3:3000 max_fails=2 fail_timeout=20s; }",
            },
            {
              question: "Configure HAProxy to perform an active HTTP health check on /healthz, expecting a 200 response, checking every 3 seconds, marking healthy after 2 successes and unhealthy after 2 failures.",
              type: "hands-on",
              hint: "Use option httpchk, http-check expect, and the check inter/rise/fall server parameters.",
              answer: "backend app_back option httpchk GET /healthz HTTP/1.1\\r\\nHost:\\ app.example.com http-check expect status 200 server app1 10.0.0.1:8080 check inter 3s rise 2 fall 2 server app2 10.0.0.2:8080 check inter 3s rise 2 fall 2",
            },
            {
              question: "Debug a scenario: proxy_pass http://backend returns 502 when backend is running. What are the first 3 commands you run?",
              type: "hands-on",
              hint: "Check Nginx error logs, verify backend connectivity from the Nginx server, and test the upstream directly.",
              answer: "1) tail -f /var/log/nginx/error.log — look for 'connect() failed' or 'recv() failed' messages with details. 2) curl -v http://10.0.0.1:3000/health — test backend connectivity directly from the Nginx server (rules out firewall/network issues). 3) nginx -t — verify Nginx config syntax is valid and the upstream IPs/ports are correct.",
            },
          ],
        },
      ],
      exam: [
        { question: "A user reports HTTP 502 Bad Gateway from your Nginx reverse proxy. The backend application server is running and responding locally. What are the three most likely causes and how do you diagnose each?", answer: "1) Nginx cannot reach the upstream: verify the proxy_pass address and port are correct, and that no firewall rule blocks Nginx-to-backend traffic — test with 'curl -v http://127.0.0.1:3000' from the Nginx server. 2) The backend returned an invalid HTTP response (e.g., crashed mid-response or sent a malformed status line) — check both Nginx error logs (/var/log/nginx/error.log) and the backend application logs simultaneously. 3) Upstream keepalive connection was closed by the backend and Nginx tried to reuse it — add 'proxy_next_upstream error timeout invalid_header' and consider tuning keepalive_timeout on both sides.", difficulty: "mid" },
        { question: "Your Nginx server has both 'location ~* \\.php$' and 'location /api/' blocks. A request to /api/data.php arrives. Which block matches and why? How do you change this behavior?", answer: "The regex location '~* \\.php$' matches because regex blocks (~ and ~*) take priority over prefix blocks (/api/) in Nginx's matching order. To force /api/ to match first and prevent the regex from applying, change the prefix to 'location ^~ /api/' — the ^~ modifier tells Nginx to skip regex matching if this prefix matches. This is a common pitfall when mixing PHP pass-through rules with API proxy locations on the same server.", difficulty: "mid" },
        { question: "Under high traffic your Nginx returns 429 even though monitoring shows average request rate is below your configured limit of 10r/s. Explain why and what to adjust.", answer: "Nginx's limit_req uses a leaky bucket algorithm that smooths traffic to the exact configured rate. Even if the average over a minute is 10r/s, if requests arrive in bursts — for example, 50 requests in the same 100ms window — they exceed the instantaneous rate. The burst parameter allows a queue of excess requests; without nodelay, queued requests are delayed (slowing the user); with nodelay, they are served immediately but counted against the burst budget. To fix: increase the burst value to match realistic peak burst sizes, or use a token bucket approach with a higher rate and lower burst.", difficulty: "mid" },
        { question: "A WordPress site is extremely slow. You check and PHP-FPM pm.max_children is set to 200. The server has 4GB RAM. What is the problem and what is the correct configuration?", answer: "Each PHP-FPM worker for WordPress consumes 30-60MB of RAM. With pm.max_children=200, the system would allocate up to 12GB for PHP workers — 3x the available memory. This causes constant disk swapping, making everything extremely slow. For a 4GB server with ~2GB available for PHP: max_children = 2000MB / 50MB per worker = ~40. Set pm.max_children=40, pm.start_servers=5, pm.min_spare_servers=5, pm.max_spare_servers=20. Monitor actual worker memory usage with 'ps aux | grep php-fpm' to fine-tune.", difficulty: "mid" },
        { question: "Explain the difference between a forward proxy and a reverse proxy. Give a production use case for each.", answer: "A forward proxy sits between clients and the internet, acting on behalf of clients. Clients explicitly configure the proxy. Use case: a corporate network routes employee web traffic through a proxy for content filtering, caching, and egress control — employees' browsers are configured to use the proxy. A reverse proxy sits in front of servers, acting on behalf of servers. Clients do not know which backend server handles their request. Use case: Nginx in front of three application servers — it load balances requests, terminates TLS so backends serve plain HTTP, and serves static files directly without touching the app servers.", difficulty: "junior" },
        { question: "You are deploying a new version of a backend service behind HAProxy and need zero downtime. Walk through the steps to drain and replace one server.", answer: "1) Connect to HAProxy's admin socket: 'echo \"set server backend/server1 state drain\" | socat stdio /var/run/haproxy.sock' — HAProxy stops sending new connections to server1 but existing connections continue. 2) Monitor active connections: 'echo \"show servers state\" | socat stdio /var/run/haproxy.sock' — wait until server1's session count reaches 0. 3) Set server1 to maintenance: 'echo \"set server backend/server1 state maint\" | socat stdio /var/run/haproxy.sock'. 4) Deploy and start the new version on server1. 5) Re-enable: 'echo \"set server backend/server1 state ready\" | socat stdio /var/run/haproxy.sock'. Repeat for each server.", difficulty: "senior" },
        { question: "Explain how IP-hash load balancing can result in 80% of traffic going to one server, and what the correct solution is.", answer: "IP-hash maps each client IP to a specific backend using a hash function. If most clients share the same public IP — for example, an entire corporate office or mobile carrier NAT behind one IP — they all hash to the same backend. This is a very common scenario: a user base that includes offices with NAT or ISPs using CGNAT will create extreme imbalance. The correct solution depends on the reason for wanting stickiness: if session state is the concern, externalize session data to Redis so any backend can serve any user, then switch to round-robin or least-connections. If you truly need stickiness, use cookie-based sticky sessions (HAProxy SERVERID cookie) which distributes initial requests randomly before binding.", difficulty: "senior" },
        { question: "What is the Vary: Accept-Encoding header and why is it critical when using gzip compression with a CDN?", answer: "Vary: Accept-Encoding tells CDNs and shared caches that the response content varies based on whether the client sent 'Accept-Encoding: gzip' in its request. Without this header, a CDN might cache the gzip-compressed version and then serve it to a client that does not support gzip — the client receives binary garbage it cannot decompress. With the Vary header, the CDN maintains separate cache entries for clients that accept gzip and those that do not, ensuring each client receives the correct encoding. Nginx sets this automatically with 'gzip_vary on;'.", difficulty: "mid" },
        { question: "An Nginx server is serving 200 virtual hosts. A request arrives for a domain not defined in any server block. Which server block responds and why?", answer: "Nginx uses the first server block defined in the configuration as the default when no server_name matches the Host header. To explicitly control this, designate a default_server: 'listen 80 default_server;'. Best practice is to define a dedicated catch-all server block that returns 444 (close connection without response) or a 403/421 for unrecognized hosts — this prevents accidentally serving content for misconfigured DNS pointing at your server. Without an explicit default_server, Nginx falls back to the first defined server block in file-system order of includes.", difficulty: "senior" },
        { question: "Describe when you would choose least_conn load balancing over round-robin, and give a scenario where round-robin would be a poor choice.", answer: "Choose least_conn when request processing time varies significantly between requests. It routes each new request to the backend with the fewest active connections, adapting to actual load. Scenario where round-robin fails: an API that has two types of requests — fast reads (5ms) and slow report generations (10 seconds). Round-robin distributes sequentially; a backend that received many report-generation requests becomes overloaded with 50 slow connections while the other backend has 5. Least_conn would see one backend's high active connection count and prefer the other. Round-robin works well when all requests have similar duration, like static file serving.", difficulty: "mid" },
      ],
    },
    {
      id: "web-frameworks-hosting",
      title: "Frameworks & Hosting",
      level: "intermediate",
      description: "Deploy Django, Spring Boot, and WordPress in production — WSGI/ASGI, JVM tuning, PHP-FPM, CDNs, and edge caching strategies.",
      lessons: [
        {
          id: "web-frameworks",
          title: "Django, Spring Boot & WordPress: Deployment Patterns",
          duration: 45,
          type: "lesson",
          description: "Production deployment of Django (Python/WSGI/ASGI), Spring Boot (Java/JVM), and WordPress (PHP/PHP-FPM) — each with Nginx, process managers, and framework-specific tuning.",
          objectives: [
            "Deploy Django with Gunicorn (WSGI) and Uvicorn (ASGI) behind Nginx",
            "Configure Spring Boot as a systemd service with JVM memory tuning",
            "Set up WordPress with PHP-FPM and Nginx",
            "Explain WSGI vs ASGI and when to use each",
            "Write framework-specific Nginx location configs",
            "Tune PHP-FPM pool sizes for production load",
          ],
          tags: ["django", "spring-boot", "wordpress", "wsgi", "asgi", "php-fpm", "gunicorn", "jvm"],
          content: `# Django, Spring Boot & WordPress: Deployment Patterns

## Why Not Expose Python/Java/PHP Directly to the Internet

Every framework — Django, Spring Boot, WordPress — has its own embedded HTTP server. Django's development server (\`python manage.py runserver\`), Spring Boot's embedded Tomcat, WordPress run directly by Apache. So why add Nginx in front?

**Security:** Nginx is written in C, hardened over decades, and has a tiny attack surface for a reverse proxy. Your application server may have HTTP parsing bugs, slow header processing, or incomplete timeout handling. Nginx handles the raw internet; your app handles business logic.

**Performance:** Nginx serves static files directly from disk without touching your Python/Java/PHP process. A 100KB JS file served by Nginx: ~0.1ms and near-zero CPU. Served by Django/Gunicorn: the request goes through the Python interpreter, URL router, view function, and response serializer — 10-50ms and significant CPU.

**Process management:** Nginx is the front door that stays up during rolling restarts. Your Gunicorn or JVM process can restart while Nginx holds new connections in the upstream queue.

**TLS termination:** Certificate management, OCSP stapling, HTTP/2 multiplexing — all handled at Nginx, not in your application code.

## Django: WSGI vs ASGI — What Actually Differs

Django is a Python web framework. Python web servers communicate with Django through an interface standard:

**WSGI (Web Server Gateway Interface)** is the traditional synchronous interface. A WSGI application is a callable that receives an HTTP request environment and returns a response. Gunicorn manages a pool of WSGI worker processes. Each worker handles one request at a time — while a Django view waits for a database query, that worker is blocked and cannot handle any other request. With 4 workers, you can serve 4 simultaneous requests.

**ASGI (Asynchronous Server Gateway Interface)** is the modern async interface. An ASGI application is a coroutine. Workers use an event loop (asyncio) and can handle many concurrent requests without blocking. While an async view awaits a database query, the same worker continues handling other requests. With 4 workers each running an event loop, you can handle thousands of concurrent long-lived connections (WebSockets, SSE, long-polling).

**When ASGI actually matters:** ASGI provides no benefit for traditional request/response views that do synchronous database queries — those queries still block regardless of the interface. ASGI's value is in:
- **WebSockets**: real-time chat, live dashboards (Django Channels requires ASGI)
- **Long-polling**: streaming responses (Server-Sent Events)
- **Genuinely async views**: using async ORM (Django 4.x+) or async HTTP clients (httpx, aiohttp) that yield to the event loop during I/O

For a typical Django API that makes sync database calls, WSGI with Gunicorn is still the simpler and correct choice.

## Gunicorn Worker Types

Gunicorn supports multiple worker implementations:

\`\`\`bash
# sync (default) — one request per worker at a time:
gunicorn myproject.wsgi:application --worker-class sync --workers 4
# Best for: CPU-bound Django, simple CRUD APIs

# gevent/eventlet — green threads, monkey-patches stdlib for async I/O:
pip install gevent
gunicorn myproject.wsgi:application --worker-class gevent --workers 2 --worker-connections 1000
# Best for: many long-lived connections (WebSocket via Channels in compatibility mode)
# Caution: monkey-patching can cause subtle bugs with some libraries

# uvicorn — native asyncio ASGI worker:
pip install uvicorn
gunicorn myproject.asgi:application --worker-class uvicorn.workers.UvicornWorker --workers 4
# Best for: async Django views, Django Channels, SSE

# Worker count formula (starting point):
nproc --all  # get CPU count
# Sync workers: (2 * CPU_count) + 1
# Async workers: CPU_count (event loop handles concurrency internally)
\`\`\`

\`\`\`bash
# Install production dependencies:
pip install django gunicorn uvicorn[standard] psycopg2-binary

# Run with Gunicorn (WSGI — for traditional Django):
gunicorn myproject.wsgi:application \\
    --workers 4 \\
    --worker-class sync \\
    --bind 127.0.0.1:8000 \\
    --timeout 30 \\
    --access-logfile /var/log/gunicorn/access.log \\
    --error-logfile /var/log/gunicorn/error.log

# Run with Uvicorn workers (ASGI — for async Django, Channels, WebSockets):
gunicorn myproject.asgi:application \\
    --workers 4 \\
    --worker-class uvicorn.workers.UvicornWorker \\
    --bind 127.0.0.1:8000

# Worker count rule of thumb: 2 * CPU_cores + 1
nproc --all  # Get CPU count
\`\`\`

**Systemd service for Gunicorn:**

\`\`\`
# /etc/systemd/system/gunicorn.service
[Unit]
Description=Gunicorn Django Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/myproject
ExecStart=/var/www/myproject/venv/bin/gunicorn \\
    myproject.wsgi:application \\
    --workers 4 \\
    --bind 127.0.0.1:8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
\`\`\`

**Nginx config for Django:**

\`\`\`nginx
server {
    listen 443 ssl http2;
    server_name app.example.com;

    ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

    # Django static files (collectstatic output):
    location /static/ {
        alias /var/www/myproject/staticfiles/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Django media files:
    location /media/ {
        alias /var/www/myproject/media/;
    }

    # Proxy everything else to Gunicorn:
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
\`\`\`

## Spring Boot: JVM Deployment and Tuning

Spring Boot packages as a fat JAR containing an embedded Tomcat/Netty server. Unlike Python (one process per Gunicorn worker), the JVM uses threads — a single JVM process handles concurrency with a thread pool. The embedded Tomcat creates a thread per request (up to \`server.tomcat.max-threads\`, default 200). When all threads are busy, requests queue. When the queue is full, Tomcat returns 503.

**JVM Memory: More Than Just the Heap**

When you set \`-Xmx2g\`, you are only setting the maximum heap size. Total JVM memory consumption includes:
- **Heap** (your \`-Xmx\` setting): objects your application creates
- **Metaspace**: class metadata, method bytecode (~100-300MB typically)
- **JIT code cache**: compiled native code (~240MB)
- **Thread stacks**: each thread uses ~512KB-1MB (~200 threads = ~100-200MB)
- **Direct byte buffers**: I/O buffers for NIO/Netty
- **JVM overhead**: GC data structures, JIT compiler itself

A JVM with \`-Xmx2g\` may use 2.8-3.5GB total. This is why Kubernetes pods get OOMKilled even when you set -Xmx well below the pod limit.

\`\`\`bash
# G1GC (Garbage-First GC) — recommended for most Spring Boot apps:
java \
    -Xms512m \              # Initial heap — pre-allocate to avoid resizing during startup
    -Xmx2g \               # Maximum heap — tune based on available memory
    -XX:+UseG1GC \         # G1 garbage collector (default in JDK 9+, but explicit is clear)
    -XX:MaxGCPauseMillis=200 \   # G1 targets pauses < 200ms (best-effort, not guaranteed)
    -XX:+UseContainerSupport \   # Read cgroup memory limits (critical in Docker/Kubernetes)
    -XX:InitialRAMPercentage=40 \  # Initial heap as % of container memory (use with UseContainerSupport)
    -XX:MaxRAMPercentage=75 \      # Max heap as % (leaves room for non-heap + OS)
    -XX:+HeapDumpOnOutOfMemoryError \  # Write heap dump to disk on OOM for post-mortem analysis
    -XX:HeapDumpPath=/var/log/myapp/ \
    -Dspring.profiles.active=production \
    -jar target/myapp-1.0.0.jar
\`\`\`

**Containerized Spring Boot (Kubernetes):** Never hardcode \`-Xmx\` in container deployments. Instead use \`-XX:MaxRAMPercentage=75\` — the JVM reads the container's cgroup memory limit and sets the heap to 75% of it, leaving 25% for non-heap memory. Without \`UseContainerSupport\` (JDK 8u191+, all JDK 11+), the JVM reads the host's total memory, not the container limit.

\`\`\`bash
# Diagnose JVM memory breakdown at runtime:
jcmd <PID> VM.native_memory summary
# Shows: heap, class (Metaspace), thread, code (JIT cache), GC, etc.

# Spring Boot Actuator exposes JVM metrics:
curl http://localhost:8080/actuator/metrics/jvm.memory.used
curl http://localhost:8080/actuator/metrics/jvm.gc.pause
\`\`\`

\`\`\`bash
# Build the JAR:
./mvnw clean package -DskipTests
# or
./gradlew bootJar

# Run with JVM tuning:
java \\
    -Xms512m \\        # Initial heap size
    -Xmx2g \\          # Maximum heap size
    -XX:+UseG1GC \\    # G1 garbage collector (recommended for most apps)
    -XX:MaxGCPauseMillis=200 \\   # Target max GC pause
    -Dspring.profiles.active=production \\
    -jar target/myapp-1.0.0.jar
\`\`\`

**Systemd service for Spring Boot:**

\`\`\`
# /etc/systemd/system/myapp.service
[Unit]
Description=My Spring Boot Application
After=network.target

[Service]
User=springapp
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/java \\
    -Xms512m -Xmx2g \\
    -XX:+UseG1GC \\
    -Dspring.profiles.active=production \\
    -jar /opt/myapp/myapp.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
\`\`\`

Nginx reverse proxy for Spring Boot is identical to Django — proxy to localhost on the configured port (default 8080).

## WordPress: PHP-FPM with Nginx

WordPress is PHP-based. Nginx does not have a PHP runtime — it passes PHP requests to **PHP-FPM** (PHP FastCGI Process Manager) over a Unix socket or TCP connection using the FastCGI protocol. PHP-FPM manages a pool of PHP worker processes that execute the PHP code and return the rendered HTML to Nginx.

**PHP-FPM Process Management Modes:**

- **static**: always keep exactly \`pm.max_children\` workers running. High memory usage but no spawning overhead. Best for servers with predictable load and enough RAM.
- **dynamic**: spawn workers up to \`pm.max_children\` as needed, keep at least \`pm.min_spare_servers\` idle. Balance between memory and responsiveness. Best for most production WordPress sites.
- **ondemand**: spawn workers only when a request arrives, kill idle workers after \`pm.process_idle_timeout\`. Lowest memory usage. Best for low-traffic sites or many sites on shared hosting where idle workers waste RAM.

**OPcache — PHP Bytecode Caching:**

PHP is interpreted — every request normally compiles PHP files from source to bytecode before executing them. OPcache stores compiled bytecode in shared memory. Subsequent requests execute the cached bytecode directly, skipping compilation. This typically reduces PHP execution time by 50-70% for WordPress.

\`\`\`php
# /etc/php/8.2/fpm/conf.d/10-opcache.ini
opcache.enable=1
opcache.memory_consumption=256    # MB of shared memory for cached bytecode
opcache.interned_strings_buffer=16 # MB for interned strings (PHP internal strings)
opcache.max_accelerated_files=20000 # max number of files to cache
opcache.validate_timestamps=0     # 0 = trust cache; 1 = revalidate on file change
                                  # set to 0 in production for best performance
                                  # set to 1 in development to see code changes
opcache.revalidate_freq=60        # only matters if validate_timestamps=1; check every 60s
\`\`\`

\`\`\`nginx
# /etc/nginx/sites-available/wordpress.conf
server {
    listen 443 ssl http2;
    server_name blog.example.com;
    root /var/www/wordpress;
    index index.php;

    ssl_certificate /etc/letsencrypt/live/blog.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/blog.example.com/privkey.pem;

    # WordPress permalinks:
    location / {
        try_files \$uri \$uri/ /index.php?\$args;
    }

    # Pass PHP to PHP-FPM:
    location ~ \\.php$ {
        try_files \$uri =404;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        include fastcgi_params;
    }

    # Deny access to sensitive files:
    location ~ /\\.ht { deny all; }
    location ~ /wp-config.php { deny all; }

    # Cache static assets:
    location ~* \\.(js|css|png|jpg|gif|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
\`\`\`

**PHP-FPM pool configuration:**

\`\`\`
# /etc/php/8.2/fpm/pool.d/www.conf
[www]
pm = dynamic
pm.max_children = 50         # Max PHP worker processes
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500        # Restart workers after 500 requests (prevent memory leaks)

# Increase for heavy WordPress sites:
php_admin_value[memory_limit] = 256M
php_admin_value[max_execution_time] = 60
\`\`\``,
          interviewQuestions: [
            {
              question: "What is the difference between WSGI and ASGI?",
              difficulty: "mid",
              answer: "WSGI (Web Server Gateway Interface) is a synchronous Python standard for web application servers. Each request is handled synchronously — the worker is blocked until the response is sent. ASGI (Asynchronous Server Gateway Interface) supports asynchronous request handling, WebSockets, and long-lived connections. WSGI with Gunicorn is fine for traditional request/response Django apps. ASGI (Uvicorn/Daphne) is required for Django Channels (WebSockets), async views, and Server-Sent Events.",
            },
            {
              question: "Why does Spring Boot need a reverse proxy like Nginx in front of it even though it has an embedded Tomcat?",
              difficulty: "mid",
              answer: "Spring Boot's embedded Tomcat is a capable server but lacks the operational features needed at the edge: TLS termination with automatic certificate renewal, rate limiting, gzip/brotli compression, static file serving (Nginx is far more efficient), access logging in common formats, DDoS protection, and easy integration with WAF/CDN. Nginx also provides a stable front-end while Spring Boot restarts during deployments. Additionally, Nginx can load-balance across multiple Spring Boot instances without application changes.",
            },
            {
              question: "What is PHP-FPM and why does Nginx use it instead of executing PHP directly?",
              difficulty: "junior",
              answer: "PHP-FPM (FastCGI Process Manager) is a process manager for PHP that implements the FastCGI protocol. Nginx is a web server written in C — it has no built-in PHP runtime. Nginx passes PHP file requests to PHP-FPM via a Unix socket or TCP connection using the FastCGI protocol. PHP-FPM maintains a pool of PHP worker processes that execute PHP code and return the output to Nginx. Apache with mod_php embeds PHP in the web server process, which is heavier but simpler. The Nginx + PHP-FPM architecture separates concerns and allows independent scaling.",
            },
            {
              question: "How do you determine the correct number of Gunicorn workers?",
              difficulty: "mid",
              answer: "The common formula is (2 * CPU_count) + 1. For a 4-core server, use 9 workers. This formula assumes CPU-bound work; for I/O-bound apps (lots of database queries, external API calls), you can go higher. For async ASGI workloads (Uvicorn workers), fewer workers are needed since each handles many concurrent requests. Monitor CPU utilization, memory usage, and request queue depth. If workers are all busy and requests are queuing, add workers — but each worker uses its own memory for the Python interpreter and application.",
            },
            {
              question: "What JVM flags would you set for a Spring Boot service running on a 2-core, 4GB server?",
              difficulty: "senior",
              answer: "Set -Xms512m (initial heap, avoids startup resizing overhead) and -Xmx2g (leave 2GB for OS, other processes, and non-heap JVM memory). Use -XX:+UseG1GC for low-pause garbage collection. Add -XX:MaxGCPauseMillis=200 to target short GC pauses. For containerized deployments, use -XX:+UseContainerSupport (default in JVM 11+) so the JVM reads cgroup limits correctly rather than using host memory. Add -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/log/myapp/ for debugging OOM crashes.",
            },
          ],
          quizQuestions: [
            {
              question: "A Django app works in development but returns 400 Bad Request errors in production behind Nginx. The error only happens for HTTPS requests. What is the likely cause?",
              type: "scenario",
              answer: "Django's CSRF protection and SECURE_PROXY_SSL_HEADER setting. In production behind Nginx (which terminates TLS), Django sees requests as HTTP (from Nginx to Gunicorn). If Django is configured with SECURE_SSL_REDIRECT=True or checks for HTTPS in CSRF validation, it may reject requests. Fix: set SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https') in Django settings, and ensure Nginx sets proxy_set_header X-Forwarded-Proto \$scheme.",
            },
            {
              question: "A Spring Boot service runs well with -Xmx512m during testing but crashes in production with OutOfMemoryError: GC overhead limit exceeded. CPU usage is near 100% on the VM. What is happening?",
              type: "scenario",
              answer: "The heap is too small for the production load. GC overhead limit exceeded means the JVM is spending more than 98% of time on garbage collection. Increase -Xmx to give the JVM more heap (e.g., -Xmx2g on a 4GB server). Also check for memory leaks: enable -XX:+HeapDumpOnOutOfMemoryError, analyze with Eclipse MAT or VisualVM to find objects accumulating. Also verify there is no caching layer that grows unboundedly (e.g., an in-memory cache without size limits).",
            },
            {
              question: "WordPress is extremely slow on a VPS with 2GB RAM. You check and PHP-FPM has pm.max_children=200 configured. What is wrong?",
              type: "scenario",
              answer: "Each PHP-FPM worker can use 30-60MB RAM for WordPress. With pm.max_children=200, the system tries to allocate up to 12GB of RAM for PHP workers alone, far exceeding the 2GB available. This causes constant swapping, making everything extremely slow. Reduce pm.max_children to a realistic value — for 2GB RAM with 512MB available for PHP-FPM, set pm.max_children=10-15. Use pm=dynamic with pm.max_children=15, pm.start_servers=3, pm.min_spare_servers=2, pm.max_spare_servers=5.",
            },
            {
              question: "Write a systemd service file for a Django Gunicorn app at /var/www/myapp, running as user 'webuser', with 4 workers on port 8000.",
              type: "hands-on",
              hint: "Include the virtualenv path in ExecStart, set WorkingDirectory, and configure Restart=always.",
              answer: "[Unit] Description=Django Gunicorn Service After=network.target [Service] User=webuser Group=webuser WorkingDirectory=/var/www/myapp ExecStart=/var/www/myapp/venv/bin/gunicorn myapp.wsgi:application --workers 4 --bind 127.0.0.1:8000 Restart=always RestartSec=5 [Install] WantedBy=multi-user.target",
            },
            {
              question: "Write the Nginx location block to pass .php requests to PHP-FPM socket at /run/php/php8.2-fpm.sock for a WordPress site rooted at /var/www/wordpress.",
              type: "hands-on",
              hint: "Use fastcgi_pass with the socket path, set SCRIPT_FILENAME, and include fastcgi_params.",
              answer: "location ~ \\.php$ { try_files \$uri =404; fastcgi_pass unix:/run/php/php8.2-fpm.sock; fastcgi_index index.php; fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name; include fastcgi_params; }",
            },
            {
              question: "A Spring Boot container on Kubernetes has -Xmx4g but the pod limit is 2Gi. What happens and how do you fix it?",
              type: "hands-on",
              hint: "Think about what happens when JVM heap exceeds the container memory limit, and how to make JVM aware of container limits.",
              answer: "The JVM will allocate up to 4GB heap, but the container cgroup limit is 2GiB. When the JVM uses more than 2GiB (including non-heap memory like metaspace, threads, and code cache), the OOM killer terminates the container. Fix: ensure -XX:+UseContainerSupport is active (default in JDK 11+, which makes JVM respect cgroup limits) and remove the explicit -Xmx flag to let the JVM calculate it automatically, or set -Xmx to a value leaving room for non-heap memory, e.g., -Xmx1500m for a 2Gi container limit.",
            },
          ],
        },
        {
          id: "static-dynamic-hosting",
          title: "Static & Dynamic Hosting, CDN & Cache Invalidation",
          duration: 35,
          type: "lesson",
          description: "Static hosting with Nginx and S3+CloudFront, dynamic hosting patterns, CDN edge caching, cache invalidation strategies, and WAF basics.",
          objectives: [
            "Configure Nginx to serve a static site with SPA fallback routing",
            "Explain how S3+CloudFront works for static hosting",
            "Describe CDN edge caching and cache-control interaction",
            "Implement cache invalidation strategies",
            "Explain WAF basics and OWASP Top 10 protection",
            "Compare static vs dynamic hosting costs and operational complexity",
          ],
          tags: ["static-hosting", "cdn", "cloudfront", "s3", "cache-invalidation", "waf", "edge-caching"],
          content: `# Static & Dynamic Hosting, CDN & Cache Invalidation

## Static vs Dynamic Content

**Static content** is pre-built and identical for all users: HTML files, CSS, JS bundles, images, fonts. It can be cached aggressively at every layer.

**Dynamic content** is generated per-request: personalized dashboards, shopping carts, user-specific data. It typically cannot be cached (or only briefly and carefully).

Modern web apps blend both: a static React/Vue/Next.js shell + dynamic API calls. The shell can be served from a CDN; the API runs on servers.

## Nginx: Serving a Static Site with SPA Routing

Single-Page Applications (React, Vue, Angular) handle routing client-side. All URL paths must return \`index.html\` — the JS router handles the rest:

\`\`\`nginx
server {
    listen 443 ssl http2;
    server_name app.example.com;

    root /var/www/app/dist;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

    # SPA fallback: try file, then directory, then fallback to index.html
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Hashed assets: immutable, 1-year cache
    location ~* \\.[0-9a-f]{8}\\.(js|css|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # index.html: no cache (always fresh)
    location = /index.html {
        add_header Cache-Control "no-cache, must-revalidate";
        add_header ETag "";
    }
}
\`\`\`

## S3 + CloudFront Static Hosting

AWS pattern for globally distributed static hosting:

\`\`\`bash
# 1. Create and configure an S3 bucket:
aws s3 mb s3://my-app-static
aws s3 website s3://my-app-static/ --index-document index.html --error-document index.html

# 2. Upload build artifacts:
aws s3 sync ./dist s3://my-app-static --delete \\
    --cache-control "public, max-age=31536000, immutable" \\
    --exclude "index.html"

# Upload index.html with no-cache:
aws s3 cp ./dist/index.html s3://my-app-static/index.html \\
    --cache-control "no-cache, must-revalidate"

# 3. Create CloudFront distribution pointing to S3 origin
# (done via console or Terraform/CDK)

# 4. Invalidate after deployment:
aws cloudfront create-invalidation \\
    --distribution-id EDFDVBD6EXAMPLE \\
    --paths "/index.html"
\`\`\`

## HTTP Caching Headers In Depth

Caching is controlled by the \`Cache-Control\` response header. Every directive has specific semantics that browsers, CDNs, and proxies interpret differently.

**Cache-Control Directives Explained:**

\`\`\`
Cache-Control: public, max-age=3600, s-maxage=86400, must-revalidate

public       — Any cache (browser, CDN, shared proxy) may store this response.
               The default for responses without Cache-Control is often treated as public.
               Required when combined with s-maxage to tell CDNs to cache.

private      — Only the end-user's browser may cache this response.
               Shared caches (CDNs, proxies) must not store it.
               Use for: any authenticated, user-specific response.

max-age=3600 — Browser may serve the cached response for up to 3600 seconds (1 hour)
               without revalidating with the server. After expiry, browser revalidates.

s-maxage=86400 — CDNs and shared caches use this instead of max-age.
                 Lets you cache in the CDN for 24 hours while browsers recheck hourly.

no-cache     — CONFUSINGLY NAMED. Does NOT mean "don't cache."
               It means: cache the response, but always revalidate with the server
               before serving it. The server can return 304 Not Modified (no body)
               which is fast, but still requires a round trip.
               Use for: HTML files that change occasionally.

no-store     — Do not cache this response anywhere, ever. Not in the browser,
               not in the CDN, not in any intermediate proxy. Every request
               goes to the origin server. Use for: highly sensitive data.

must-revalidate — After max-age expires, the cache MUST revalidate before serving.
                  (Without this, some caches serve stale content when the origin is down.)

stale-while-revalidate=60 — Serve stale content for up to 60 seconds while fetching
                            a fresh copy in the background. Eliminates revalidation latency
                            for the user. Popular for CDN-cached API responses.

immutable    — This response will NEVER change. Browsers should not revalidate even
               after max-age expires. Use only with content-hashed filenames.
               Cache-Control: public, max-age=31536000, immutable
\`\`\`

**ETag vs Last-Modified Cache Validation:**

When a cached response expires (\`max-age\` exceeded or \`no-cache\` set), the browser revalidates. It sends a conditional request asking: "Is this still fresh?"

\`\`\`
# Server sends ETag on first response:
Response: HTTP/1.1 200 OK
          Content-Type: application/json
          ETag: "abc123def456"     ← hash of the response content
          Cache-Control: no-cache

# Browser's conditional revalidation request:
Request: GET /api/users HTTP/1.1
         If-None-Match: "abc123def456"    ← "do you still have this version?"

# Server compares ETags:
# If content unchanged → 304 Not Modified (no body, saves bandwidth)
# If content changed   → 200 OK with new body and new ETag
\`\`\`

ETag is more reliable than Last-Modified because:
- Last-Modified has 1-second granularity (two changes in the same second look identical)
- Some servers update Last-Modified when files are copied/deployed even if content is unchanged
- ETag is computed from the content hash — identical content = same ETag

\`\`\`nginx
# Nginx automatically generates ETags for static files
# Enable ETag for proxied content too:
etag on;
proxy_cache_valid 200 302 10m;

# For APIs, generate ETags in your application:
# In Django: from django.utils.cache import patch_cache_control, patch_response_headers
# In Express: app.set('etag', 'strong')
\`\`\`

## CDN Architecture and Edge Caching

A CDN (Content Delivery Network) has hundreds of Points of Presence (PoPs) distributed globally — data centers in major cities worldwide. When a user requests a resource, DNS directs them to the nearest PoP based on latency (anycast routing).

**Cache HIT path** (the happy path):
1. User in Berlin requests \`https://cdn.example.com/image.jpg\`
2. DNS returns the IP of the Frankfurt PoP (nearest)
3. Frankfurt PoP has the image cached
4. Response served from Frankfurt: ~5ms latency

**Cache MISS path** (first request for this resource at this PoP):
1. Same as above, but the Frankfurt PoP doesn't have the image
2. Frankfurt fetches from the origin server (wherever it is hosted)
3. Frankfurt caches the response according to the \`Cache-Control\` and \`s-maxage\` headers
4. Future requests to Frankfurt are served from cache

**Origin Pull vs Origin Push:**
- **Origin pull** (default for all major CDNs): CDN fetches from your origin on the first cache miss. Zero setup — you just point the CDN at your origin. Content is cached lazily.
- **Origin push**: you explicitly upload content to CDN storage (S3, CloudFront Origin, Fastly KV). You control exactly what's cached and pre-warm the cache before traffic. Needed when your origin cannot serve traffic at CDN scale.

CDNs respect your \`Cache-Control\` and \`Expires\` headers. The \`s-maxage\` directive specifically targets CDN/shared caches (overrides \`max-age\` for CDNs):

\`\`\`
# Cached by CDN for 1 day, browser for 1 hour:
Cache-Control: public, max-age=3600, s-maxage=86400

# Not cached by CDN, but browser can cache for 1 hour:
Cache-Control: private, max-age=3600

# Bypass all caches:
Cache-Control: no-store

# Serve stale while revalidating in background (zero-latency revalidation):
Cache-Control: public, s-maxage=300, stale-while-revalidate=600
\`\`\`

## Cache Invalidation Strategies

Cache invalidation is hard. The three main strategies:

**1. Versioned URLs (best):** Embed a content hash in the filename: \`main.abc12345.js\`. When content changes, the URL changes. Old cached URL is never invalidated — it just expires naturally. New URL is fetched fresh. This is what webpack/Vite do automatically.

**2. Query string versioning:** \`/assets/style.css?v=20240101\`. Works for URLs you don't control. Some CDNs ignore query strings by default — check CDN settings.

**3. Explicit invalidation:** Call the CDN API to purge specific paths or \`/*\`. CloudFront charges per-invalidation (first 1000 paths/month free). Use for emergency fixes to non-versioned assets.

**4. Surrogate keys / cache tags (Fastly, Varnish):** Tag cached objects with metadata (e.g., \`product:123\`). Purge all objects tagged with \`product:123\` in one API call when product 123 changes. More surgical than URL-based invalidation.

## WAF Basics

A Web Application Firewall inspects HTTP requests and blocks malicious patterns:

- **SQLi:** requests with \`' OR 1=1 --\`, \`UNION SELECT\`, etc.
- **XSS:** requests with \`<script>\`, \`javascript:\`, event handlers
- **LFI/RFI:** requests with \`../../../etc/passwd\`
- **SSRF:** requests hitting internal metadata endpoints (169.254.169.254)

AWS WAF, Cloudflare WAF, and ModSecurity (Nginx module) can all block OWASP Top 10 attacks. WAF rules use regex and rate patterns. Be careful with false positives — start in monitor mode, review blocked legitimate requests before switching to block mode.`,
          interviewQuestions: [
            {
              question: "Why do you serve index.html with no-cache but other assets with max-age=1y?",
              difficulty: "junior",
              answer: "index.html is the entry point that references versioned assets (e.g., main.abc123.js). If index.html is cached aggressively, users will load old JavaScript and CSS even after a deployment, because the browser uses the cached index.html that still references old asset hashes. By keeping index.html uncached (no-cache or max-age=0), users always get the latest asset URLs. The assets themselves use content-hashed filenames so they can be cached indefinitely — if the content changes, the hash changes and a new URL is requested.",
            },
            {
              question: "What is the difference between max-age and s-maxage in Cache-Control?",
              difficulty: "mid",
              answer: "max-age controls how long the response is cached by both browsers and shared caches (CDNs). s-maxage (shared max-age) overrides max-age specifically for shared/proxy caches — CDNs respect s-maxage and ignore max-age when s-maxage is present. This lets you cache content in the CDN for a long time (s-maxage=86400) while keeping browser cache short (max-age=3600) so users get updates faster when you push to the CDN.",
            },
            {
              question: "Explain the tradeoffs between explicit CDN invalidation and versioned URLs.",
              difficulty: "mid",
              answer: "Versioned URLs (content-hashed filenames) are the better approach: zero invalidation cost, instant availability of new versions globally (new URL = no stale cache), and old URLs naturally expire. The downside is that every change produces a new URL, so bookmarks and links to specific asset paths break (not a real issue for bundled JS/CSS). Explicit invalidation (purging by URL) works for any URL but has costs: CloudFront charges after 1000 paths/month, takes 1-5 minutes to propagate globally, and if you forget to invalidate, users get stale content. Use versioned URLs for JS/CSS/images; use explicit invalidation only for emergencies on non-versioned resources.",
            },
            {
              question: "What is a surrogate key (cache tag) in CDN caching?",
              difficulty: "senior",
              answer: "A surrogate key (called cache tags in Cloudflare, cache control tags in Fastly) is metadata attached to a cached object that groups objects by logical entity. The server sends Surrogate-Key: product-42 category-electronics headers. The CDN stores these keys alongside cached objects. When product 42 is updated, one API call purges all objects tagged product-42 — regardless of URL. This enables surgical cache invalidation at scale: purge a product page, its thumbnails, and any listing page that includes it, all with one logical key rather than enumerating every URL.",
            },
            {
              question: "What is the SPA routing problem with Nginx and how does try_files solve it?",
              difficulty: "junior",
              answer: "A Single-Page Application uses client-side routing — the JavaScript router handles /users/42, /settings, etc. These are not real files on disk. If a user bookmarks https://app.example.com/users/42 and opens it directly, Nginx looks for a file or directory named /users/42, finds nothing, and returns 404. try_files \$uri \$uri/ /index.html; tells Nginx to: try the exact file, then try it as a directory, and if neither exists, serve /index.html. The JavaScript bundle then loads and the SPA router reads the URL path to show the correct view.",
            },
          ],
          quizQuestions: [
            {
              question: "After deploying a new version of your React SPA to S3+CloudFront, some users still see the old version. index.html is cached by CloudFront. What is the fix?",
              type: "scenario",
              answer: "Invalidate /index.html in CloudFront: 'aws cloudfront create-invalidation --distribution-id DIST_ID --paths \"/index.html\"'. Future prevention: upload index.html with Cache-Control: no-cache, must-revalidate so CloudFront respects it and revalidates with S3 on every request. All other assets should use content-hashed filenames with immutable cache headers — they never need invalidation.",
            },
            {
              question: "A CDN is serving your API responses (JSON) to all users — user A is seeing user B's data. How did this happen and how do you fix it?",
              type: "scenario",
              answer: "The API responses are being cached by the CDN because the Cache-Control header is missing or set to public. Without explicit instructions, CDNs may cache any response. Fix: add Cache-Control: private, no-store to all authenticated API responses. The private directive tells CDNs not to cache the response (only the user's browser can). Also add Vary: Authorization, Cookie to ensure different users' responses are not conflated. Audit existing CDN cache for affected responses and purge them.",
            },
            {
              question: "Your WAF is blocking legitimate requests from your mobile app that sends large JSON payloads. How do you investigate and resolve this?",
              type: "scenario",
              answer: "1) Check WAF logs to identify which rule is triggering (rule ID, rule group). 2) Examine the blocked request — look for patterns that the WAF incorrectly flags as malicious (e.g., a large body, special characters in JSON values). 3) Options to resolve: (a) tune the rule threshold (e.g., increase body size limit), (b) create an exception for specific rules on the affected endpoint, (c) add the app's IP to an allowlist if it's a static IP. Always test exceptions in monitor mode first before applying to block mode.",
            },
            {
              question: "Write an S3 sync command that uploads ./dist to s3://myapp-prod, setting immutable cache for all files except index.html which should be no-cache.",
              type: "hands-on",
              hint: "Use two separate aws s3 commands — one sync with --exclude and one cp for index.html.",
              answer: "aws s3 sync ./dist s3://myapp-prod --delete --cache-control 'public, max-age=31536000, immutable' --exclude 'index.html' && aws s3 cp ./dist/index.html s3://myapp-prod/index.html --cache-control 'no-cache, must-revalidate' --content-type 'text/html'",
            },
            {
              question: "Configure Nginx to serve a React SPA from /var/www/app with SPA routing fallback and immutable caching for hashed .js and .css files.",
              type: "hands-on",
              hint: "Use try_files for SPA routing, a regex location for hashed assets, and no-cache for index.html.",
              answer: "server { listen 443 ssl http2; root /var/www/app; index index.html; location / { try_files \$uri \$uri/ /index.html; } location = /index.html { add_header Cache-Control 'no-cache, must-revalidate'; } location ~* \\.[0-9a-f]{8}\\.(js|css)$ { expires 1y; add_header Cache-Control 'public, immutable'; } }",
            },
            {
              question: "What Cache-Control header should you set for: (a) a user profile API endpoint, (b) a public product listing API, (c) a product image?",
              type: "hands-on",
              hint: "Think about who can cache each response and for how long.",
              answer: "(a) User profile API: Cache-Control: private, no-store — user-specific, never cache in CDN or shared proxy. (b) Public product listing: Cache-Control: public, max-age=60, s-maxage=300 — browsers cache 1 min, CDN caches 5 min. (c) Product image: Cache-Control: public, max-age=86400, s-maxage=2592000 — browsers 1 day, CDN 30 days. Use versioned URLs for images so you can update them without invalidation.",
            },
          ],
        },
      ],
      exam: [
        { question: "A Django app deployed with Gunicorn behind Nginx works fine locally but returns 400 Bad Request in production only for HTTPS form submissions. What is the most likely cause and fix?", answer: "Django's CSRF protection checks that the request came over HTTPS when SECURE_SSL_REDIRECT or CSRF validation is active. Behind Nginx, Gunicorn receives requests as plain HTTP (Nginx terminates TLS), so Django cannot confirm the original scheme. Fix: set SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https') in Django settings.py, and ensure Nginx passes 'proxy_set_header X-Forwarded-Proto $scheme;'. This tells Django to trust the X-Forwarded-Proto header set by Nginx rather than inspecting the connection directly.", difficulty: "mid" },
        { question: "Explain why the recommended Gunicorn worker count formula is (2 * CPU cores) + 1 and when you should deviate from it.", answer: "The formula assumes a mix of CPU-bound and I/O-bound work. Each CPU core can run one worker process at a time; the +1 accounts for one worker that is always ready when another is blocked on I/O (database query, network call). For highly I/O-bound apps (most Django/Flask apps making many DB calls), you can go higher — 4x or more — because workers spend most of their time waiting. For async ASGI apps with Uvicorn workers, you need far fewer workers (one per CPU core is often enough) because each async worker handles thousands of concurrent coroutines. Monitor CPU and memory — if workers are CPU-idle but all busy, the app is I/O-bound and you can add more workers.", difficulty: "mid" },
        { question: "A Spring Boot service on a 4GB Kubernetes pod is being OOMKilled regularly despite -Xmx2g. What is consuming the extra memory and how do you fix it?", answer: "JVM memory is more than just the heap. Non-heap memory includes: Metaspace (class metadata), JIT compiled code cache, thread stacks (each thread uses ~512KB by default), direct byte buffers, and JVM overhead. A 2GB heap JVM easily uses 2.5-3GB total. Fix: (1) Ensure -XX:+UseContainerSupport is active (default in JDK 11+) so JVM reads cgroup limits. (2) Set -Xmx to leave room for non-heap — for a 4GB pod, use -Xmx2500m. (3) Tune -XX:MetaspaceSize and -XX:MaxMetaspaceSize to limit metaspace growth. (4) Reduce thread pool sizes to lower thread stack consumption. Monitor with 'jcmd <pid> VM.native_memory' to see actual memory breakdown.", difficulty: "senior" },
        { question: "What is the difference between WSGI and ASGI, and when does switching from Gunicorn (WSGI) to Uvicorn/Daphne (ASGI) provide a concrete benefit?", answer: "WSGI is a synchronous interface: each request occupies a worker until it completes. If the handler does 'time.sleep(5)' or a slow DB call, the worker is blocked for the duration. ASGI is asynchronous: a single worker handles many concurrent requests by yielding during I/O waits. ASGI provides concrete benefits when: (1) your Django views use 'async def' and await async ORM calls or async HTTP clients, (2) you need WebSockets (Django Channels requires ASGI), (3) you have long-polling or Server-Sent Events endpoints. For traditional synchronous Django views with no async code, ASGI provides no performance benefit and adds deployment complexity.", difficulty: "mid" },
        { question: "You need to deploy the same Django application to development, staging, and production with different database credentials and debug settings. What is the recommended approach?", answer: "Use environment variables for all environment-specific configuration and a settings module that reads from them. Django's recommended pattern: a base settings.py with shared config, and environment-specific overrides via environment variables or separate settings files (settings/production.py). Database credentials go in DATABASE_URL (parsed by dj-database-url) or individual DB_HOST, DB_NAME, DB_PASSWORD vars. Set DEBUG=False in production via environment variable. Never commit credentials to git — use a secret manager (AWS Secrets Manager, HashiCorp Vault) in production and inject via environment variables at runtime through the container/systemd configuration.", difficulty: "mid" },
        { question: "Nginx returns 502 when proxying to a Spring Boot service. Spring Boot logs show it is running and accepting connections. What are the first three diagnostic steps?", answer: "1) Check Nginx error log: 'tail -f /var/log/nginx/error.log' — look for 'connect() failed (111: Connection refused)' (port wrong or service not listening) vs 'recv() failed' (connection made but response invalid). 2) Test connectivity from Nginx's perspective: 'curl -v http://127.0.0.1:8080/actuator/health' — run this on the server where Nginx runs to confirm the port, path, and response. 3) Verify Spring Boot is listening on the correct interface and port: 'ss -tlnp | grep 8080' — if it shows 127.0.0.1:8080, it only accepts local connections; if it should accept from a different host, check server.address in application.properties.", difficulty: "mid" },
        { question: "A WordPress site hosted on Nginx returns a blank white page with no error for all pages except the homepage. PHP logs show no errors. What is the likely cause?", answer: "The WordPress permalink rewrite rule is missing or misconfigured. WordPress uses pretty permalinks that require URL rewriting — all non-file requests must be passed to index.php. The Nginx try_files directive for WordPress is: 'try_files $uri $uri/ /index.php?$args;'. Without this, Nginx looks for the actual file or directory, finds nothing, and returns 404 or an empty 200. The homepage works because it maps to the root index.php directly. Fix: add the try_files rule to the root location block and verify 'nginx -t' passes, then reload Nginx.", difficulty: "mid" },
        { question: "PHP-FPM is configured with pm=dynamic. Explain the role of pm.max_children, pm.min_spare_servers, and pm.max_spare_servers, and how to determine appropriate values.", answer: "pm.max_children is the absolute ceiling — no more than this many PHP workers run at once, regardless of demand. It should be set to (available RAM) / (average PHP worker memory). pm.min_spare_servers is the minimum number of idle workers maintained — ensures immediate response when traffic starts. pm.max_spare_servers caps idle workers to avoid wasting RAM during quiet periods. Tuning process: 1) Find average worker memory: 'ps --no-headers -o rss -C php-fpm8.2 | awk \"{sum+=\$1} END {print sum/NR}\"' (in KB). 2) Set max_children = available_RAM_KB / avg_worker_KB. 3) Set min_spare to handle your typical baseline traffic without spawning. 4) Set max_spare to ~50% of max_children to balance responsiveness and memory.", difficulty: "senior" },
        { question: "You are migrating a legacy monolith to serve static assets from S3+CloudFront. After the migration, users report images sometimes load and sometimes return 403. What is the likely cause?", answer: "The S3 bucket policy or CloudFront Origin Access Control (OAC) configuration is incomplete or inconsistent. Common causes: (1) The S3 bucket blocks public access but CloudFront is configured as a public URL origin (not using OAC) — CloudFront cannot authenticate to S3 and gets 403, which it passes to the client. (2) Some objects were uploaded without the required ACL or are owned by a different AWS account. (3) Mixed origins — some requests go through CloudFront (which has IAM access via OAC) and some go directly to S3 (which blocks public access). Fix: configure CloudFront with an OAC, attach a bucket policy granting only CloudFront's service principal read access, and block all public S3 access.", difficulty: "senior" },
        { question: "A CDN is caching your Django API responses and serving user-specific data to wrong users. What Cache-Control headers should authenticated API endpoints return and why?", answer: "Authenticated and user-specific API endpoints should return: 'Cache-Control: private, no-store'. 'private' instructs shared caches (CDNs, proxies) not to cache the response — only the end-user's browser may cache it. 'no-store' prevents even browser caching for sensitive data. Also add 'Vary: Authorization, Cookie' to ensure CDNs that may have misread the initial directive do not conflate responses from different users. If the CDN has already cached user data, immediately invalidate affected paths via the CDN's purge API. Audit all API endpoints to ensure user-specific responses carry these headers.", difficulty: "mid" },
      ],
    },
    {
      id: "web-performance-security",
      title: "Performance, Security & APIs",
      level: "advanced",
      description: "Master caching layers, Redis sessions, JWT security, REST API design, WAF rules, DDoS protection, and load testing with k6 and Locust.",
      lessons: [
        {
          id: "caching-sessions",
          title: "Caching Layers, Redis Sessions & Cookie Security",
          duration: 45,
          type: "lesson",
          description: "Full caching stack — browser, CDN, server, application, and database caching. Redis for session storage, cookie security attributes (HttpOnly, Secure, SameSite), JWT vs sessions, and Cache-Control headers.",
          objectives: [
            "Describe all 5 caching layers and what belongs in each",
            "Configure Redis for session storage and set TTL policies",
            "Set cookie security attributes and explain each one",
            "Compare JWT and server-side sessions with their security tradeoffs",
            "Write Cache-Control headers for different content types",
            "Implement application-level caching with cache-aside pattern",
          ],
          tags: ["caching", "redis", "sessions", "jwt", "cookies", "cache-control", "performance"],
          content: `# Caching Layers, Redis Sessions & Cookie Security

## The 5 Caching Layers

Every web request can be served from multiple cache layers. Understanding each layer determines where to optimize:

**1. Browser Cache:** Stores responses in the user's browser. Controlled by Cache-Control, ETag, and Expires headers. Zero server cost — the fastest possible response. Scope: per-user.

**2. CDN/Edge Cache:** Shared cache at CDN PoPs. Serves the same cached response to thousands of users from a nearby edge node. Scope: global, per-URL.

**3. Reverse Proxy Cache (Nginx/Varnish):** Cache in front of your application servers. Can cache dynamic pages if they're the same for all users. Scope: server-wide, per-URL.

**4. Application Cache (Redis/Memcached):** Cache at the application layer — store computed results, database query results, API responses. Your application code controls this cache. Scope: per-key.

**5. Database Cache:** Query result cache, buffer pool. PostgreSQL and MySQL cache frequently-accessed data pages in memory automatically.

\`\`\`
Request → Browser Cache → CDN Edge → Nginx Proxy Cache → App Server → Redis Cache → Database
         (0ms)           (5ms)       (10ms)              (50ms)       (100ms)       (200ms)
\`\`\`

## Cache-Aside Pattern

The most common application caching pattern:

\`\`\`python
# Python/Django with Redis:
import redis
import json

r = redis.Redis(host='localhost', port=6379, db=0)

def get_user(user_id):
    cache_key = f"user:{user_id}"

    # 1. Check cache first:
    cached = r.get(cache_key)
    if cached:
        return json.loads(cached)  # Cache HIT

    # 2. Cache MISS — fetch from DB:
    user = User.objects.get(id=user_id)
    user_data = {"id": user.id, "name": user.name, "email": user.email}

    # 3. Store in cache with 5-minute TTL:
    r.setex(cache_key, 300, json.dumps(user_data))

    return user_data
\`\`\`

## Redis Session Storage

Server-side sessions in Redis enable stateless application servers — any server can handle any request:

\`\`\`python
# Django: install django-redis and configure settings.py
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'default'

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'TIMEOUT': 3600,  # Session TTL: 1 hour
    }
}

# Session data is stored in Redis as:
# Key: django.contrib.sessions.cache:<session_id>
# Value: serialized session dict
# TTL: 3600 seconds
\`\`\`

\`\`\`bash
# Inspect Redis session data:
redis-cli
> KEYS django.contrib.sessions*
> TTL django.contrib.sessions.cache:abc123
> GET django.contrib.sessions.cache:abc123
\`\`\`

## Cookie Security Attributes

\`\`\`
Set-Cookie: session_id=abc123;
            Path=/;
            Domain=example.com;
            HttpOnly;              # JS cannot read this cookie (XSS protection)
            Secure;                # Only sent over HTTPS
            SameSite=Strict;       # Never sent on cross-site requests (CSRF protection)
            Max-Age=3600           # Expire in 1 hour (vs Expires: for absolute date)
\`\`\`

| Attribute | Without It | With It |
|-----------|-----------|---------|
| HttpOnly | JS can read via document.cookie — XSS steals session | JS cannot access cookie |
| Secure | Sent over HTTP — man-in-the-middle can steal it | HTTPS-only transmission |
| SameSite=Strict | Sent on cross-site requests — CSRF possible | Not sent cross-site |
| SameSite=Lax | Sent on cross-site GET requests | Sent on top-level navigation only |
| SameSite=None | Required when setting None | Must also set Secure |

## JWT vs Server-Side Sessions

| | JWT | Server-Side Sessions |
|-|-----|---------------------|
| Storage | Cookie or localStorage | Cookie (ID) + Redis (data) |
| Validation | Verify signature — no DB needed | Redis lookup required |
| Revocation | Cannot revoke before expiry (without blocklist) | Delete from Redis — instant revocation |
| Scalability | No shared state needed | Redis must be available |
| Size | Large (contains claims) | Small cookie (just an ID) |

**JWTs in localStorage** is an anti-pattern — XSS can steal the token. Store JWTs in HttpOnly cookies for security. Use short expiry (15 minutes) + refresh tokens.

**Server-side sessions with Redis** are simpler and more secure for most web apps — instant logout, no token bloat, and the session data never leaves the server.`,
          interviewQuestions: [
            {
              question: "Explain the 5 caching layers in a web stack and what belongs at each layer.",
              difficulty: "mid",
              answer: "Browser cache: user-specific responses, static assets with cache headers. CDN/edge: public content served to many users — product pages, public APIs, static assets. Reverse proxy cache (Nginx, Varnish): same as CDN but self-hosted, useful for caching generated pages before they hit application servers. Application cache (Redis, Memcached): expensive database queries, computed results, third-party API responses — anything the app frequently recomputes. Database cache: automatic — the DB engine caches hot data pages in its buffer pool, but you can also use query result caching.",
            },
            {
              question: "Why is storing JWTs in localStorage a security risk?",
              difficulty: "mid",
              answer: "localStorage is accessible via JavaScript — document.cookie cannot read HttpOnly cookies, but localStorage has no such protection. An XSS vulnerability anywhere on the page allows an attacker's script to read localStorage and steal the JWT. The attacker can then make authenticated API calls from any machine. JWTs should be stored in HttpOnly, Secure, SameSite=Strict cookies — inaccessible to JavaScript, transmitted only over HTTPS, and not sent on cross-site requests.",
            },
            {
              question: "What is the difference between SameSite=Strict and SameSite=Lax?",
              difficulty: "mid",
              answer: "SameSite=Strict never sends the cookie on cross-site requests — including when a user clicks a link from another site to your site. This is the most secure but can break user experience (e.g., login state is lost when following a link from an email). SameSite=Lax sends the cookie on top-level cross-site navigations (user clicks a link, browser navigates) but not on cross-site subresource requests (images, iframes, AJAX). Lax is a good default — protects against CSRF while preserving navigation usability.",
            },
            {
              question: "How do you invalidate a JWT before it expires?",
              difficulty: "senior",
              answer: "JWTs cannot be invalidated by default — once issued, they are valid until expiry. Solutions: (1) Token blocklist: store revoked JWT JTI (unique identifier) in Redis until expiry. On each request, check the JTI against the blocklist. This adds a Redis lookup but enables instant revocation. (2) Short expiry + refresh tokens: access tokens expire in 15 minutes; refresh tokens (stored in Redis) can be revoked instantly. (3) Rotate the signing secret: invalidates ALL tokens but is a nuclear option. The blocklist approach is most common for fine-grained revocation.",
            },
            {
              question: "Explain the cache-aside pattern and its failure modes.",
              difficulty: "senior",
              answer: "Cache-aside (lazy loading): on read, check cache first; if miss, fetch from DB, populate cache, return result. On write, update DB and invalidate the cache key. Failure modes: (1) Cache stampede/thundering herd: many concurrent cache misses for the same key all hit the DB simultaneously. Solution: use a lock (Redis SETNX) so only one request fetches from DB. (2) Stale data: cache is not invalidated when data changes. Solution: explicit invalidation on writes, or short TTLs. (3) Cold cache: after Redis restart, all keys are missing and DB gets full load. Solution: gradual warmup, or persistent Redis (AOF/RDB).",
            },
          ],
          quizQuestions: [
            {
              question: "Users report that after changing their password, they are still logged in on other devices and can still access the app. Sessions are stored in Redis. What is wrong?",
              type: "scenario",
              answer: "Password change does not invalidate existing sessions. On password change: (1) find all session keys for this user in Redis (store a set of session IDs per user: key 'user_sessions:<user_id>'), (2) delete each session from Redis, (3) issue a new session for the current device. Many frameworks have a 'logout all devices' feature that does this. Without this, old sessions remain valid until they expire via TTL.",
            },
            {
              question: "An attacker exploits XSS on your site and executes document.cookie in the console. They see only the analytics cookie but not the session cookie. Why?",
              type: "scenario",
              answer: "The session cookie is set with the HttpOnly attribute. Cookies marked HttpOnly cannot be read or modified by JavaScript — they are only sent by the browser in HTTP request headers. The analytics cookie is missing HttpOnly, so JavaScript can read it. This is correct security design for session cookies: XSS cannot steal an HttpOnly session cookie directly (though other session hijacking attacks may still be possible).",
            },
            {
              question: "Your Redis cache has a very high hit rate (99%) but your app is still slow. Database CPU is near 0%. Where should you look next?",
              type: "scenario",
              answer: "With 99% cache hit rate and no DB pressure, the bottleneck is likely: (1) the application server itself — CPU-bound processing after cache hit (serialization, business logic); (2) network latency between app server and Redis — check Redis latency with 'redis-cli --latency'; (3) large values being deserialized on cache hit — profile which endpoints are slow; (4) the 1% cache misses are extremely expensive queries that dominate latency — check slow query log.",
            },
            {
              question: "Write a Redis cache-aside function in Python that caches a database result with a 10-minute TTL, using a lock to prevent cache stampede.",
              type: "hands-on",
              hint: "Use redis.setnx() or SET NX EX for the lock, then fetch from DB only if lock is acquired.",
              answer: "import redis, json; r = redis.Redis(); def get_data(key): cached = r.get(key); return json.loads(cached) if cached else None; lock_key = f'lock:{key}'; if r.set(lock_key, 1, nx=True, ex=5): value = fetch_from_db(key); r.setex(key, 600, json.dumps(value)); r.delete(lock_key); return value; return r.brpoplpush(lock_key, lock_key, timeout=5) and json.loads(r.get(key))",
            },
            {
              question: "Set the correct Set-Cookie header for a session cookie that: is HTTPS-only, not accessible to JS, blocks CSRF, and expires in 2 hours.",
              type: "hands-on",
              hint: "Include HttpOnly, Secure, SameSite=Strict, and Max-Age attributes.",
              answer: "Set-Cookie: session_id=<value>; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=7200",
            },
            {
              question: "Configure Django settings to use Redis as the session backend, with sessions expiring after 30 minutes of inactivity.",
              type: "hands-on",
              hint: "Use SESSION_ENGINE, CACHES with django-redis backend, and SESSION_COOKIE_AGE.",
              answer: "SESSION_ENGINE = 'django.contrib.sessions.backends.cache'; SESSION_CACHE_ALIAS = 'default'; SESSION_COOKIE_AGE = 1800; SESSION_SAVE_EVERY_REQUEST = True; CACHES = {'default': {'BACKEND': 'django_redis.cache.RedisCache', 'LOCATION': 'redis://127.0.0.1:6379/1', 'TIMEOUT': 1800}}",
            },
          ],
        },
        {
          id: "api-waf-loadtest",
          title: "REST APIs, WAF, DDoS Protection & Load Testing",
          duration: 50,
          type: "lesson",
          description: "REST API design principles, API gateway patterns, WAF rules for OWASP Top 10, rate limiting, DDoS protection strategies, and performance testing with k6 and Locust.",
          objectives: [
            "Design RESTful APIs following HTTP semantics and naming conventions",
            "Explain API gateway responsibilities and when to use one",
            "Configure WAF rules to protect against OWASP Top 10 threats",
            "Implement multi-layer rate limiting",
            "Distinguish DDoS protection layers (L3/L4 vs L7)",
            "Write a k6 load test script and interpret results",
            "Run a Locust load test and analyze the output",
          ],
          tags: ["rest-api", "api-gateway", "waf", "owasp", "rate-limiting", "ddos", "k6", "locust", "load-testing"],
          content: `# REST APIs, WAF, DDoS Protection & Load Testing

## REST API Design

REST (Representational State Transfer) uses HTTP semantics to design resource-oriented APIs:

\`\`\`
# Resource naming: nouns, plural, hierarchical
GET    /users              # List users
POST   /users              # Create user
GET    /users/42           # Get user 42
PUT    /users/42           # Replace user 42
PATCH  /users/42           # Partial update user 42
DELETE /users/42           # Delete user 42

GET    /users/42/orders    # Orders belonging to user 42
GET    /orders?user_id=42  # Alternative: filter with query params

# Versioning:
GET /api/v1/users          # URI versioning (most common)
Accept: application/vnd.example.v2+json  # Content negotiation (more RESTful)

# Pagination:
GET /users?page=2&per_page=50
GET /users?cursor=eyJpZCI6MTAwfQ  # Cursor-based (better for large datasets)
\`\`\`

**Response envelope pattern:**

\`\`\`json
{
  "data": { "id": 42, "name": "Alice" },
  "meta": { "request_id": "abc-123", "timestamp": "2024-01-01T00:00:00Z" },
  "errors": null
}
\`\`\`

## API Gateway

An API Gateway is a dedicated reverse proxy for APIs providing:

- **Authentication:** verify JWT/API keys before reaching services
- **Rate limiting:** per-client, per-endpoint limits
- **Request routing:** route /v1 and /v2 to different backends
- **Protocol translation:** REST to gRPC, HTTP to WebSocket
- **Observability:** centralized access logs, metrics, tracing
- **Transformation:** modify headers/body before forwarding

Popular choices: AWS API Gateway, Kong, Traefik, Nginx (with Lua).

\`\`\`yaml
# Kong route with rate limiting plugin:
services:
  - name: user-service
    url: http://user-service:8080
    routes:
      - name: users-route
        paths: [/api/v1/users]
    plugins:
      - name: rate-limiting
        config:
          minute: 60
          hour: 1000
          policy: redis
      - name: jwt
        config:
          secret_is_base64: false
\`\`\`

## WAF: OWASP Top 10 Protection

**SQL Injection:** Block requests containing SQL keywords in parameters:
\`\`\`
# ModSecurity rule (simplified):
SecRule ARGS "@detectSQLi" "id:942100,phase:2,block,msg:'SQL Injection Detected'"
\`\`\`

**XSS (Cross-Site Scripting):** Block script tags and event handlers in input:
\`\`\`
SecRule ARGS "@detectXSS" "id:941100,phase:2,block,msg:'XSS Attack Detected'"
\`\`\`

**AWS WAF managed rule groups:**
\`\`\`bash
# Apply OWASP managed rules via AWS CLI:
aws wafv2 create-web-acl \\
    --name "production-waf" \\
    --scope REGIONAL \\
    --default-action Allow={} \\
    --rules '[{
        "Name": "AWSManagedRulesCommonRuleSet",
        "Priority": 1,
        "OverrideAction": {"None": {}},
        "Statement": {
            "ManagedRuleGroupStatement": {
                "VendorName": "AWS",
                "Name": "AWSManagedRulesCommonRuleSet"
            }
        },
        "VisibilityConfig": {...}
    }]'
\`\`\`

## Rate Limiting Layers

Effective rate limiting uses multiple layers:

1. **CDN/Edge:** Block volumetric attacks before reaching your infrastructure (Cloudflare rate rules)
2. **Load Balancer:** Per-IP rate limits at L7 (HAProxy \`stick-table\`, Nginx \`limit_req\`)
3. **API Gateway:** Per-client (API key / JWT sub) rate limits
4. **Application:** Business-logic limits (e.g., 3 password attempts per account per 15 minutes)

## DDoS Protection

**L3/L4 DDoS (volumetric):** Floods of UDP/TCP packets. Protection: upstream scrubbing centers (Cloudflare, AWS Shield), anycast routing to absorb traffic, blackhole routing of attack source IPs.

**L7 DDoS (application layer):** Floods of valid-looking HTTP requests (low-and-slow, Slowloris, request floods). Protection:
- Challenge pages (JavaScript challenges, CAPTCHAs)
- Rate limiting by IP + fingerprint
- Behavioral analysis (bot detection)
- Connection limits in Nginx/HAProxy

\`\`\`nginx
# Nginx: protect against Slowloris (slow header attacks):
client_header_timeout 10s;
client_body_timeout 10s;
send_timeout 10s;
keepalive_timeout 65s;

# Limit concurrent connections per IP:
limit_conn_zone \$binary_remote_addr zone=perip:10m;
limit_conn perip 20;
\`\`\`

## Load Testing with k6

k6 is a modern load testing tool with JavaScript scripting:

\`\`\`javascript
// k6 load test script: load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 50 },   // Ramp up to 50 users
        { duration: '3m', target: 50 },   // Stay at 50 users
        { duration: '1m', target: 200 },  // Ramp to 200 users
        { duration: '3m', target: 200 },  // Stay at 200 users
        { duration: '1m', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
        http_req_failed: ['rate<0.01'],    // Error rate under 1%
    },
};

export default function() {
    const res = http.get('https://api.example.com/users');
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time OK': (r) => r.timings.duration < 500,
    });
    sleep(1);
}
\`\`\`

\`\`\`bash
# Run the test:
k6 run load-test.js

# Output includes:
# http_req_duration: avg=45ms p(90)=120ms p(95)=200ms p(99)=850ms
# http_req_failed: 0.02% (2 errors in 10000 requests)
# vus: 200 (virtual users at peak)
\`\`\`

## Load Testing with Locust

Locust uses Python and has a web UI:

\`\`\`python
# locustfile.py
from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 3)  # Wait 1-3 seconds between tasks

    @task(3)  # Weight: run 3x more than other tasks
    def view_products(self):
        self.client.get("/api/products")

    @task(1)
    def view_product(self):
        self.client.get("/api/products/42")

    @task(1)
    def create_order(self):
        self.client.post("/api/orders", json={"product_id": 42, "qty": 1},
                         headers={"Authorization": "Bearer test-token"})
\`\`\`

\`\`\`bash
# Run with web UI on port 8089:
locust -f locustfile.py --host=https://api.example.com

# Run headless (CI/CD):
locust -f locustfile.py --host=https://api.example.com \\
    --users 100 --spawn-rate 10 --run-time 5m --headless
\`\`\``,
          interviewQuestions: [
            {
              question: "What are the responsibilities of an API Gateway?",
              difficulty: "mid",
              answer: "An API Gateway centralizes cross-cutting concerns: authentication (verify JWT, API keys before requests reach services), rate limiting (per-client or per-endpoint throttling), request routing (direct /v1 to old service, /v2 to new), protocol translation (REST to gRPC), SSL/TLS termination, request/response transformation (add/remove headers, reshape body), centralized logging and tracing, circuit breaking (stop sending requests to a failing upstream), and caching. It prevents each microservice from implementing these concerns independently.",
            },
            {
              question: "What is the difference between L3/L4 and L7 DDoS attacks?",
              difficulty: "mid",
              answer: "L3/L4 (network/transport layer) attacks flood the target with raw packets — UDP floods, SYN floods, ICMP floods. The goal is to saturate bandwidth or exhaust TCP state tables. Protection requires upstream scrubbing centers (Cloudflare, AWS Shield Advanced) because the bandwidth must be absorbed before reaching your infrastructure. L7 (application layer) attacks send valid-looking HTTP requests that are expensive to process — Slowloris keeps connections open with incomplete headers, HTTP floods send real GETs at high rates. L7 attacks require application-aware protection: rate limiting, JS challenges, behavioral analysis, because the packets themselves look legitimate.",
            },
            {
              question: "What metrics do you collect during a load test and what do they tell you?",
              difficulty: "mid",
              answer: "Request rate (RPS/TPS): throughput the system achieves. Response time percentiles (p50, p90, p95, p99): median and tail latency — p95 and p99 reveal what slow users experience. Error rate: percentage of 4xx/5xx responses — should be near 0 at normal load. Concurrent users/VUs: simulated load level. Time to first byte (TTFB): server processing time. Resource utilization (CPU, memory, DB connections) correlated with request load identifies bottlenecks. Throughput plateau: where adding more users stops increasing RPS — indicates the system's capacity limit.",
            },
            {
              question: "Design a rate limiting system for a public API that supports per-user, per-endpoint, and global limits.",
              difficulty: "senior",
              answer: "Implement a Redis-based token bucket or sliding window: (1) Global limit: a single Redis counter for total RPS — protect infrastructure from aggregate overload. (2) Per-endpoint: separate counters per route (/login gets stricter limits than /products). (3) Per-user/API key: counter keyed by user ID or API key. Redis INCR with EXPIRE sets the window; Lua scripts make the check-and-increment atomic. Return Retry-After and X-RateLimit-Remaining headers. Consider tiered limits: free tier = 100/min, paid = 1000/min. The API gateway (Kong, AWS API GW) can handle all of this with plugins, avoiding custom code.",
            },
            {
              question: "A load test shows p50 response time of 20ms but p99 is 8 seconds. What are possible causes?",
              difficulty: "senior",
              answer: "High p99 with low p50 indicates a specific subset of requests are extremely slow: (1) Database lock contention — some queries wait for row/table locks. Check slow query log and lock wait events. (2) Connection pool exhaustion — occasionally a request waits for a free DB connection. Increase pool size or optimize connection reuse. (3) Garbage collection pauses (JVM/Go) — periodic GC pauses freeze all request processing briefly. Check GC logs. (4) A specific slow code path (complex query, external API call) triggered by certain inputs. Profile which endpoints have high p99. (5) Thread pool saturation — synchronous thread pools block when all threads are busy.",
            },
          ],
          quizQuestions: [
            {
              question: "Your API allows users to POST /orders with a JSON body. A penetration tester reports a SQL injection vulnerability. You use parameterized queries in your code. What else might be vulnerable?",
              type: "scenario",
              answer: "Even with parameterized queries in application code, injection can occur in: (1) ORM raw queries or .extra() calls with unsanitized input; (2) stored procedures that concatenate input; (3) ORDER BY or column name parameters — these cannot be parameterized in most drivers; (4) second-order injection: input stored safely but used unsafely in a later query; (5) NoSQL injection if using MongoDB or similar with unvalidated operators (\$where, \$regex). Also check your WAF logs to see what the tester's payload was and ensure it would have been blocked.",
            },
            {
              question: "A k6 load test shows error rate spikes to 15% when virtual users exceed 150. Below 150 VUs, error rate is 0%. What is the most likely bottleneck?",
              type: "scenario",
              answer: "A hard resource limit is being hit at ~150 concurrent users. Most likely: (1) database connection pool is exhausted — all connections are in use, new requests fail or time out. Check pool size vs concurrent users. (2) Application thread pool limit — synchronous workers are all busy. (3) File descriptor limit (ulimit) — the OS limit on open connections reached. Check 'ulimit -n' and /proc/sys/net/core/somaxconn. (4) A downstream service has its own rate limit. Correlate the spike timing with DB/app metrics to pinpoint which resource is exhausted.",
            },
            {
              question: "An API endpoint GET /reports/generate takes 45 seconds. During a load test, concurrent requests cause timeouts. How do you redesign this?",
              type: "scenario",
              answer: "Move long-running work to an async pattern: (1) POST /reports returns immediately with 202 Accepted and a job ID: {'job_id': 'abc-123'}. (2) A background worker (Celery, AWS SQS+Lambda) processes the report asynchronously. (3) Client polls GET /reports/abc-123/status until status='completed'. (4) GET /reports/abc-123/download returns the completed report. This prevents web worker thread exhaustion, allows progress tracking, and clients don't timeout. Add a cache: if the same report was generated recently, return the cached result immediately.",
            },
            {
              question: "Write a k6 script that tests a POST /login endpoint with 50 users for 2 minutes, checking for status 200 and response time under 300ms, failing the test if error rate exceeds 1%.",
              type: "hands-on",
              hint: "Use import http and check(), define options with stages and thresholds, and set the correct threshold format.",
              answer: "import http from 'k6/http'; import { check } from 'k6'; export const options = { stages: [{ duration: '30s', target: 50 }, { duration: '2m', target: 50 }, { duration: '30s', target: 0 }], thresholds: { http_req_duration: ['p(95)<300'], http_req_failed: ['rate<0.01'] } }; export default function() { const res = http.post('https://api.example.com/login', JSON.stringify({username: 'test', password: 'test123'}), { headers: { 'Content-Type': 'application/json' } }); check(res, { 'status is 200': (r) => r.status === 200 }); }",
            },
            {
              question: "Configure AWS WAF to block requests containing SQL injection patterns using the AWS managed rule group, and add a rate limit of 1000 requests per 5 minutes per IP.",
              type: "hands-on",
              hint: "Use two rules: AWSManagedRulesSQLiRuleSet and a rate-based rule with a 5-minute window.",
              answer: "Create Web ACL with two rules: (1) ManagedRuleGroup rule: VendorName=AWS, Name=AWSManagedRulesSQLiRuleSet, Priority=1, OverrideAction=None (block by default). (2) Rate-based rule: Priority=2, Action=Block, RateKey=IP, Limit=1000, EvaluationWindowSec=300. Apply the Web ACL to your ALB or CloudFront distribution. Start in Count mode to review false positives before switching to Block.",
            },
            {
              question: "A Locust test with 100 users shows your API handles 200 RPS with p95 latency of 150ms. The product team wants to support 1000 concurrent users. How do you estimate if your current infrastructure can handle it?",
              type: "hands-on",
              hint: "Calculate RPS per user, estimate required RPS at 1000 users, and identify what needs to scale.",
              answer: "Current: 200 RPS / 100 users = 2 RPS per user. At 1000 users: 1000 * 2 = 2000 RPS required. Current infrastructure handles 200 RPS well. To support 2000 RPS (10x): estimate needing 10x application servers, 10x DB read capacity (read replicas), and 10x connection pool capacity. Run a progressive k6 test: ramp to 500, 750, 1000 users while monitoring CPU, memory, DB connections, and latency. Find the inflection point where p95 latency starts increasing or errors appear — that is the current capacity limit. Scale horizontally and retest.",
            },
          ],
        },
      ],
      exam: [
        { question: "Your Redis cache has a 98% hit rate but application response times are still high. Database CPU is near zero. Where do you look next and what commands help you investigate?", answer: "With 98% hit rate and low DB CPU, the bottleneck is likely: (1) Redis latency itself — run 'redis-cli --latency' to measure round-trip time; if latency is high, check network between app and Redis, Redis memory pressure (evictions), or a slow command blocking the event loop ('redis-cli SLOWLOG GET 10'). (2) Application-side deserialization — cached values may be large blobs that take significant CPU to deserialize; profile which endpoints are slow after the cache hit. (3) The 2% cache misses are hitting extremely expensive queries that dominate tail latency — identify them in the slow query log. (4) Application server CPU — profile for CPU-bound logic running after each cache hit.", difficulty: "senior" },
        { question: "A load test using k6 shows p50 response time of 15ms and p99 of 12 seconds. The average throughput is 500 RPS. What are the most likely causes of this bimodal distribution?", answer: "A large gap between p50 and p99 indicates a specific subset of requests experience severe slowdown: (1) Database connection pool exhaustion — occasionally a request waits for a free DB connection; the wait time skews p99 dramatically. Increase pool size or reduce connection hold time. (2) JVM or Go garbage collection pauses — periodic GC stops all request processing; check GC logs for long pause events. (3) A specific expensive code path (report generation, complex join) hit by ~1% of requests. Profile which endpoint has the high p99. (4) Thread pool saturation in a synchronous server — when all threads are busy, new requests queue; the queue wait time adds to p99. Check thread pool active count vs pool size.", difficulty: "senior" },
        { question: "A penetration tester demonstrates a cache poisoning attack on your CDN where a crafted request causes incorrect content to be served to other users. How does this attack work and how do you prevent it?", answer: "Cache poisoning exploits discrepancies between how the CDN and the origin server parse requests. An attacker sends a request with an ambiguous header or URL that the CDN normalizes differently from the origin, causing the origin to return attacker-controlled content that the CDN caches for subsequent legitimate requests. Prevention: (1) Configure the CDN to normalize and validate incoming requests before forwarding. (2) Set Cache-Control: no-store on any response that varies based on unusual headers. (3) Use the Vary header to ensure the CDN caches separate versions for each relevant header combination. (4) Enable CDN-level request header validation to block requests with conflicting or malformed headers. (5) Test with tools like Param Miner to discover cache-key discrepancies.", difficulty: "senior" },
        { question: "You are designing rate limiting for a public API. A single corporate client sends all traffic from one IP (NAT). Describe a rate limiting strategy that does not unfairly penalize this client.", answer: "IP-based rate limiting will penalize the entire corporate network as one client. Use API key or JWT sub (user/client identifier) as the rate limit key instead. Each corporate user or application gets their own API key with its own quota. Implement: (1) Per-API-key rate limit tracked in Redis with a sliding window counter. (2) Return X-RateLimit-Limit, X-RateLimit-Remaining, and Retry-After headers so clients can self-throttle. (3) Still apply a loose IP-level limit as a secondary safety valve against unauthenticated abuse. (4) Offer tiered quotas — free vs paid keys have different limits. This separates client identity from network address and is the correct approach for B2B APIs.", difficulty: "senior" },
        { question: "Users report that after clearing their browser cookies, they are still logged in. Sessions are stored in Redis and expire after 1 hour. Explain what is happening.", answer: "Clearing cookies removes the session ID cookie from the browser, but the session data still exists in Redis with its original TTL. If the user can obtain the same session ID again (which should not happen with a proper cryptographically random ID), they could reconnect to the old session. The more likely scenario: the user is still logged in because another browser or device has the session cookie and is still active. Or the application has a 'remember me' token (separate from the session cookie) stored elsewhere — persistent login tokens in a database that survive cookie clearing. The fix: implement a 'logout all sessions' feature that scans and deletes all Redis keys for a user (using a set of session IDs per user) and invalidates any persistent login tokens.", difficulty: "mid" },
        { question: "A k6 load test shows throughput plateaus at 300 RPS regardless of how many virtual users you add. CPU and memory on the application server are at 20%. What is the bottleneck?", answer: "When throughput plateaus with headroom on app server resources, the bottleneck is external: (1) Database connection pool — all available connections are in use; new requests queue waiting for a connection. Check pool size vs concurrent users and DB max_connections. (2) An upstream external API being called synchronously — if every request calls a third-party API with 300ms latency and the API limits you to 300 concurrent connections, your throughput caps at 1000/300ms = ~333 RPS. (3) Network bandwidth saturation — check network I/O on the server. (4) A downstream service (cache, message queue) is the bottleneck. Identify which operation takes longest under load and instrument it separately.", difficulty: "senior" },
        { question: "Explain the difference between SQL injection and second-order SQL injection. Why do parameterized queries not fully protect against second-order injection?", answer: "First-order (direct) SQL injection: malicious input is immediately used in an SQL query without sanitization. Parameterized queries prevent this by treating input as data, never code. Second-order SQL injection: malicious input is safely stored in the database (parameterized queries protect the storage step), but is later retrieved and used unsafely in a subsequent query — often in a different code path. Example: a username containing ' OR 1=1 -- is stored safely, but when an admin function retrieves it and concatenates it into a dynamic SQL string (e.g., to audit 'SELECT * FROM logs WHERE username = ' + retrieved_username), the injection fires. Prevention: use parameterized queries everywhere SQL is constructed, including when using data retrieved from the database.", difficulty: "senior" },
        { question: "Your WAF is blocking legitimate requests from mobile app users who send large JSON payloads to a search endpoint. How do you investigate and resolve this without disabling WAF protection?", answer: "1) Check WAF logs to identify the specific rule ID being triggered and the matched pattern. Common causes: request body size limit, SQL/XSS pattern matching on JSON values (e.g., a search term containing 'select' or 'script'). 2) Switch the specific rule to Count mode temporarily to confirm it is the cause without blocking users. 3) Options to resolve: (a) Increase body size threshold if the rule triggers on payload size. (b) Create a rule exception (scope-down statement) for the specific endpoint URL and the specific rule ID, while keeping all other rules active. (c) If the JSON field is flagged for false-positive keyword matches, exclude that specific field from the rule's inspection scope. 4) Test the exception in a staging environment before applying to production.", difficulty: "mid" },
        { question: "Design a complete caching strategy for an e-commerce site with product pages, user cart, and checkout. Specify what is cached at each layer and the TTL for each.", answer: "Browser cache: static assets (JS/CSS/images) with content hashes — max-age=1y, immutable. Product images — max-age=86400. User cart and checkout pages — no-cache (personalized). CDN/edge: product listing pages — s-maxage=300 (5 min, purge on inventory change with surrogate keys). Product detail pages — s-maxage=3600 (1 hour, purge on price/availability change). Homepage — s-maxage=60. Cart, checkout, any authenticated page — Cache-Control: private, no-store. Application cache (Redis): product catalog data — TTL 300s, invalidate on admin update. Session data — TTL 1800s (30 min inactivity). Database query results for product search — TTL 60s. Database layer: PostgreSQL buffer pool caches hot data automatically; add read replicas for product catalog queries.", difficulty: "senior" },
        { question: "A Locust load test shows your API handles 500 RPS at p95=100ms with 50 users, but the product team wants to 10x capacity. What is your approach to planning the scaling?", answer: "1) Establish the current capacity ceiling: run progressive tests (100, 200, 500, 1000 users) while monitoring CPU, memory, DB connections, and latency. Find where p95 starts degrading or errors appear — this is your current limit. 2) Identify the bottleneck layer: is it app server CPU, DB connection pool, DB query throughput, or a downstream service? 3) For 10x capacity (5000 RPS): horizontally scale app servers behind a load balancer (add instances), add DB read replicas for read-heavy queries, add Redis caching for expensive computations, and tune connection pool sizes. 4) Retest after each scaling change to confirm throughput improvement and find the next bottleneck. 5) Implement auto-scaling policies based on RPS or CPU metrics so capacity adjusts to actual demand.", difficulty: "senior" },
      ],
    },
  ],
};
