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

HTTP sends everything in plaintext. Any network hop between client and server — ISP routers, Wi-Fi access points, CDN nodes — can read or modify the data. TLS (Transport Layer Security) solves this with encryption (confidentiality), integrity (tamper detection), and authentication (server identity verification).

TLS 1.3 is the current standard. TLS 1.2 is still widely deployed. SSL is deprecated and must never be used.

## TLS 1.3 Handshake

TLS 1.3 completes in **1-RTT** (one round trip):

\`\`\`
Client                                Server
  |                                      |
  |--- ClientHello ------------------>   |
  |    (supported ciphers, key share,    |
  |     TLS version, random)             |
  |                                      |
  |<-- ServerHello + Certificate ---     |
  |    (chosen cipher, key share,        |
  |     certificate chain, Finished)     |
  |                                      |
  |--- Finished + HTTP Request ------>   |
  |    (session keys derived from        |
  |     Diffie-Hellman key exchange)     |
  |                                      |
  |<-- HTTP Response ---------------     |
\`\`\`

For resumed sessions (session tickets), TLS 1.3 supports **0-RTT** — the client sends data with the first packet. Caveat: 0-RTT data is not replay-safe, so never use it for non-idempotent requests.

\`\`\`bash
# Inspect a TLS handshake:
openssl s_client -connect example.com:443 -tls1_3
# Shows: certificate chain, cipher suite, session details

# Check certificate expiry:
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
\`\`\`

## Certificate Types

| Type | Validation | Browser Indicator | Use Case |
|------|-----------|-------------------|----------|
| DV (Domain Validation) | DNS/HTTP challenge | Padlock | Most sites, APIs |
| OV (Organization Validation) | Legal entity verified | Padlock | Corporate sites |
| EV (Extended Validation) | Strict legal vetting | Green bar (legacy) | Banks, e-commerce |

DV certs can be issued in seconds (Let's Encrypt does it automatically). OV/EV require human vetting — days to weeks.

## Certificate Authority Chain

No browser trusts your cert directly. It trusts a **root CA** (pre-installed in OS/browser). Your cert is signed by an **intermediate CA**, which is signed by the root:

\`\`\`
Root CA (trusted by OS)
  └── Intermediate CA (cross-signed by Root)
        └── Your Certificate (signed by Intermediate)
\`\`\`

You must serve the **full chain** (your cert + intermediate). If you only serve your cert, some clients fail because they can't build the chain to the root.

\`\`\`bash
# Verify your cert chain is complete:
openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt fullchain.pem
# Should output: fullchain.pem: OK
\`\`\`

## Let's Encrypt & Certbot

Let's Encrypt is a free, automated CA. Certbot is the most common client:

\`\`\`bash
# Install Certbot on Ubuntu:
sudo apt install certbot python3-certbot-nginx

# Issue cert with automatic Nginx config:
sudo certbot --nginx -d example.com -d www.example.com

# Wildcard cert (requires DNS challenge):
sudo certbot certonly --manual --preferred-challenges dns -d "*.example.com"

# Certs are stored in:
# /etc/letsencrypt/live/example.com/fullchain.pem
# /etc/letsencrypt/live/example.com/privkey.pem

# Auto-renew (certs expire every 90 days):
sudo certbot renew --dry-run
# Certbot installs a systemd timer or cron job automatically
\`\`\`

## HSTS (HTTP Strict Transport Security)

HSTS tells browsers to always use HTTPS for your domain — even if the user types \`http://\`:

\`\`\`
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
\`\`\`

- \`max-age=31536000\` — 1 year; browser remembers for this duration
- \`includeSubDomains\` — all subdomains also HTTPS-only
- \`preload\` — submit to browser preload lists (hardcoded HTTPS before first visit)

**Warning:** Set a short \`max-age\` (300) in staging. Once set with a long duration, you cannot easily roll back — users will be locked out if you ever need HTTP.

## SNI (Server Name Indication)

Before SNI, one IP could only serve one TLS certificate. SNI is a TLS extension where the client announces the hostname in the ClientHello — before the certificate is sent. This allows one server/IP to serve thousands of distinct HTTPS domains.

\`\`\`bash
# See SNI in action:
openssl s_client -connect 93.184.216.34:443 -servername example.com
# Without -servername, the server doesn't know which cert to present
\`\`\`

## Mutual TLS (mTLS)

Standard TLS only authenticates the server. mTLS requires both sides to present certificates — common in service meshes (Istio, Linkerd), zero-trust networks, and B2B APIs:

\`\`\`nginx
# Nginx mTLS config — verify client certificate:
server {
    listen 443 ssl;
    ssl_certificate /etc/nginx/certs/server.crt;
    ssl_certificate_key /etc/nginx/certs/server.key;
    ssl_client_certificate /etc/nginx/certs/client-ca.crt;
    ssl_verify_client on;

    location / {
        # Client cert subject is available as variable:
        # \$ssl_client_s_dn — e.g., CN=service-a,O=MyOrg
        proxy_set_header X-Client-Cert \$ssl_client_s_dn;
        proxy_pass http://backend;
    }
}
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

A **forward proxy** sits between clients and the internet, acting on behalf of clients. Clients configure the proxy explicitly. Used for: corporate web filtering, anonymization (Tor), caching in enterprise networks.

A **reverse proxy** sits in front of servers, acting on behalf of servers. Clients don't know which backend server they're talking to. Used for: load balancing, TLS termination, caching, WAF, routing.

\`\`\`
Forward proxy:
Client → [Proxy] → Internet → Server
(client is aware of proxy)

Reverse proxy:
Client → [Nginx/HAProxy] → Backend Server 1
                         → Backend Server 2
                         → Backend Server 3
(client sees only the proxy's IP)
\`\`\`

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

## Load Balancing Algorithms Compared

| Algorithm | Best For | Drawback |
|-----------|---------|---------|
| Round-robin | Uniform requests, stateless | Ignores server load |
| Weighted | Heterogeneous server capacity | Static weights |
| Least connections | Variable request duration | Higher overhead |
| IP hash | Stateful apps without session store | Uneven distribution if few IPs |
| Random | Large backend pools | No guarantee of balance |
| Least response time | Latency-sensitive APIs | Requires monitoring |

## Sticky Sessions

When application state is stored in server memory (not a shared session store), users must be routed to the same backend every time:

\`\`\`
# HAProxy cookie-based sticky sessions:
backend app_back
    balance roundrobin
    cookie SERVERID insert indirect nocache
    server app1 10.0.0.1:8080 check cookie app1
    server app2 10.0.0.2:8080 check cookie app2
    server app3 10.0.0.3:8080 check cookie app3
\`\`\`

HAProxy inserts a \`SERVERID\` cookie identifying which backend served the request. On subsequent requests, HAProxy reads this cookie and routes to the same server.

**Tradeoff:** Sticky sessions complicate rolling deployments and mean one server handles all traffic for a user even if it's overloaded. The better long-term solution is to externalize session state to Redis so any backend can serve any user.`,
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

## Django: WSGI vs ASGI

Django is a Python web framework. WSGI (Web Server Gateway Interface) is the traditional synchronous interface. ASGI (Asynchronous Server Gateway Interface) supports async views, WebSockets, and long-polling.

**Gunicorn** is the standard WSGI server for Django. **Uvicorn** with **Gunicorn** as the process manager is the standard ASGI deployment.

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

## Spring Boot: JVM Deployment

Spring Boot packages as a fat JAR containing an embedded Tomcat/Netty server:

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

WordPress is PHP-based. Nginx does not execute PHP directly — it passes PHP files to **PHP-FPM** (FastCGI Process Manager) via the FastCGI protocol:

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

## CDN Edge Caching

A CDN (Content Delivery Network) has Points of Presence (PoPs) distributed globally. When a user requests a resource:

1. Request hits the nearest CDN edge (e.g., Frankfurt PoP for a user in Berlin)
2. If cached (**cache HIT**): served directly from edge — low latency
3. If not cached (**cache MISS**): edge fetches from origin, caches it, returns to user

CDNs respect your \`Cache-Control\` and \`Expires\` headers. The \`s-maxage\` directive specifically targets CDN/shared caches (overrides \`max-age\` for CDNs):

\`\`\`
# Cached by CDN for 1 day, browser for 1 hour:
Cache-Control: public, max-age=3600, s-maxage=86400

# Not cached by CDN, but browser can cache for 1 hour:
Cache-Control: private, max-age=3600

# Bypass all caches:
Cache-Control: no-store
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
    },
  ],
};
