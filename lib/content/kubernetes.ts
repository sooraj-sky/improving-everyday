import type { Track } from "./types";

export const kubernetesTrack: Track = {
  id: "kubernetes",
  title: "Kubernetes",
  description: "Master container orchestration from pods to production clusters",
  longDescription:
    "Go from zero to hero with Kubernetes — understanding the control plane, workloads, networking, storage, security, and GitOps. Learn how Google, Airbnb, Uber, and Netflix run Kubernetes at massive scale.",
  icon: "Layers",
  color: "#326ce5",
  gradient: "track-kubernetes-gradient",
  tags: ["containers", "orchestration", "devops", "cloud-native", "k8s"],
  modules: [
    {
      id: "kubernetes-foundations",
      title: "Kubernetes Architecture",
      level: "beginner",
      description: "Understand why Kubernetes exists and how its components work together.",
      lessons: [
        {
          id: "why-kubernetes",
          title: "Why Kubernetes Exists",
          duration: 18,
          type: "lesson",
          description: "Understand the problems Kubernetes solves that Docker alone cannot.",
          objectives: [
            "Explain why container orchestration is needed at scale",
            "Describe the Kubernetes control plane and worker node components",
            "Read a Kubernetes architecture diagram",
            "Explain what happens when you run kubectl apply",
          ],
          content: `# Why Kubernetes Exists

## The Problem Docker Alone Can't Solve

Docker is excellent for running one container on one machine. But real production systems run hundreds or thousands of containers across many machines. Docker alone gives you no answer for:

- **Scheduling**: Which machine should run this container?
- **Health**: If a container crashes, who restarts it?
- **Scaling**: If traffic spikes, how do you add more containers?
- **Discovery**: How does Service A find Service B when IPs change?
- **Rolling updates**: How do you deploy v2 without downtime?

**Real scale:** Google runs 2 billion containers per week using Borg (the system that directly inspired Kubernetes). Airbnb migrated from EC2 to Kubernetes and reduced infrastructure costs by 25%. Uber runs 4,000+ microservices on Kubernetes. Netflix uses Kubernetes for its streaming backend across 230 million subscribers.

Kubernetes (K8s) was open-sourced by Google in 2014 and is now the de facto standard for container orchestration.

## Kubernetes Architecture

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    CONTROL PLANE                         │
│                                                         │
│  ┌─────────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ kube-apiserver│  │  etcd    │  │ kube-scheduler    │  │
│  │ (REST API)  │  │(key-value│  │ (places pods on   │  │
│  │             │  │  store)  │  │  nodes)           │  │
│  └─────────────┘  └──────────┘  └───────────────────┘  │
│  ┌──────────────────────────────────────────────────┐   │
│  │         kube-controller-manager                  │   │
│  │  (node controller, replicaset controller, etc.)  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
    ┌─────────▼──┐ ┌───────▼────┐ ┌────▼───────┐
    │  WORKER 1  │ │  WORKER 2  │ │  WORKER 3  │
    │            │ │            │ │            │
    │ ┌────────┐ │ │ ┌────────┐ │ │ ┌────────┐ │
    │ │kubelet │ │ │ │kubelet │ │ │ │kubelet │ │
    │ │kube-   │ │ │ │kube-   │ │ │ │kube-   │ │
    │ │proxy   │ │ │ │proxy   │ │ │ │proxy   │ │
    │ │contai- │ │ │ │contai- │ │ │ │contai- │ │
    │ │nerd    │ │ │ │nerd    │ │ │ │nerd    │ │
    │ └────────┘ │ │ └────────┘ │ │ └────────┘ │
    └────────────┘ └────────────┘ └────────────┘
\`\`\`

### Control Plane Components

**kube-apiserver** — The front door to Kubernetes. Every kubectl command, every controller, every kubelet talks to the API server. It validates and stores all cluster state.

**etcd** — The cluster's brain. A distributed key-value store that holds all cluster state. If etcd dies without a backup, your cluster is gone. This is why etcd backup is a critical SRE responsibility.

**kube-scheduler** — Watches for new pods with no node assigned, selects the best node based on resource requests, affinity rules, and taints/tolerations.

**kube-controller-manager** — Runs a loop of controllers: ReplicaSet controller (ensures desired pod count), Node controller (handles node failures), Endpoints controller, etc.

### Worker Node Components

**kubelet** — The agent on each node. Talks to the API server, receives pod specs, tells the container runtime (containerd) to start/stop containers, reports health back.

**kube-proxy** — Implements Service networking on each node. Manages iptables or IPVS rules to route traffic to the right pod IPs.

**containerd** — The container runtime. Actually pulls images and runs containers. Docker Engine uses containerd internally; Kubernetes talks to it directly via the Container Runtime Interface (CRI).

## What Happens When You Run kubectl apply

\`\`\`bash
kubectl apply -f deployment.yaml
\`\`\`

1. **kubectl** reads the YAML and sends a REST request to the API server
2. **kube-apiserver** authenticates (Who are you?), authorizes (Are you allowed?), validates the schema
3. **etcd** persists the desired state
4. **kube-controller-manager** notices the Deployment object → creates a ReplicaSet → creates Pod objects
5. **kube-scheduler** notices pods in Pending state → assigns each to a node
6. **kubelet** on the assigned node notices the pod → tells containerd to pull the image and start the container
7. **kubelet** reports pod status back → visible in kubectl get pods
\`\`\`

## Common Mistakes

- **Confusing Docker and Kubernetes**: Docker builds and runs containers on ONE machine. Kubernetes orchestrates containers across MANY machines.
- **Thinking control plane nodes run your workloads**: By default, the control plane has a taint that prevents user pods from being scheduled there.
- **Underestimating etcd**: etcd needs regular backups (daily minimum). A lost etcd = lost cluster.
`,
          interviewQuestions: [
            {
              question: "What problem does Kubernetes solve that Docker Compose can't?",
              difficulty: "junior" as const,
              answer: `Docker Compose manages multiple containers on a SINGLE machine. It has no concept of multiple nodes, no automatic rescheduling if a node dies, no built-in load balancing across machines, and no horizontal scaling across a fleet.

Kubernetes solves:
- **Multi-node scheduling**: Decides which of N machines should run each container based on resources, affinity, and taints
- **Self-healing**: If a pod crashes or a node goes down, K8s reschedules the pods automatically
- **Horizontal scaling**: HPA can scale from 3 to 30 replicas based on CPU/memory/custom metrics
- **Service discovery**: A Service object gives pods a stable DNS name even as pod IPs change
- **Rolling deployments**: Zero-downtime updates by gradually replacing old pods with new ones

Real example: When an AWS availability zone fails, Kubernetes detects the unreachable nodes and reschedules the pods on healthy nodes in other AZs — automatically, without human intervention.`,
            },
            {
              question: "What is etcd and why is it the most critical Kubernetes component?",
              difficulty: "mid" as const,
              answer: `etcd is a distributed key-value store that holds ALL Kubernetes cluster state: every Pod, Deployment, Service, ConfigMap, Secret, and more. It uses the Raft consensus algorithm to remain consistent across its cluster members (typically 3 or 5 nodes).

Why it's the most critical component:
- **Single source of truth**: If etcd says a Deployment has 3 replicas, that's what Kubernetes works toward, regardless of what's actually running
- **No backup = no recovery**: If etcd data is lost (hardware failure, corrupted disk), you cannot restore the cluster. The nodes are still running their containers, but the control plane has no state to reconcile against
- **Total cluster loss risk**: Unlike losing the API server (temporary disruption), losing etcd without a backup means you must rebuild the cluster from scratch

Best practices:
\`\`\`bash
# Backup etcd (run on a control plane node)
ETCDCTL_API=3 etcdctl snapshot save backup.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# Verify the backup
etcdctl snapshot status backup.db
\`\`\`

In managed K8s (EKS, GKE, AKS), the cloud provider manages etcd for you and takes responsibility for backups — a major reason teams use managed K8s.`,
            },
            {
              question: "Walk me through exactly what happens when a pod gets scheduled onto a node.",
              difficulty: "senior" as const,
              answer: `Full lifecycle from kubectl apply to container running:

1. **kubectl apply** → API server receives the Deployment manifest
2. **API server** validates (schema check), runs admission webhooks (e.g., OPA/Kyverno policies), then writes to etcd
3. **Deployment controller** (in kube-controller-manager) watches etcd, sees the new Deployment, creates a ReplicaSet object
4. **ReplicaSet controller** watches the ReplicaSet, sees 0 of 3 pods exist, creates 3 Pod objects (status: Pending, nodeName: "")
5. **Scheduler** watches for pods with empty nodeName. For each pod, it:
   - Runs **filter plugins**: eliminates nodes with insufficient CPU/memory, wrong taints, affinity mismatches
   - Runs **score plugins**: ranks remaining nodes by available resources, spreading constraints, etc.
   - Assigns the highest-scoring node by setting pod.spec.nodeName
6. **kubelet** on the assigned node watches for pods assigned to it. It:
   - Calls the container runtime (containerd via CRI) to pull the image
   - Creates the pod sandbox (network namespace)
   - Calls the CNI plugin to assign an IP and set up networking
   - Starts the init containers (if any), then the main containers
7. **kubelet** reports container status back to the API server
8. **Pod status** transitions: Pending → ContainerCreating → Running
9. **kube-proxy** on all nodes updates iptables/IPVS rules to include the new pod's IP in any Services that select it

Total time in a healthy cluster: typically 5–30 seconds depending on image pull time.`,
            },
          ],
        },
        {
          id: "kubernetes-objects",
          title: "Pods, Labels & Namespaces",
          duration: 15,
          type: "lesson",
          description: "Master the fundamental building blocks of Kubernetes.",
          objectives: [
            "Explain why Kubernetes uses Pods instead of running containers directly",
            "Use labels and selectors to group and query resources",
            "Organize workloads with namespaces",
            "Write a basic Pod manifest",
          ],
          content: `# Pods, Labels & Namespaces

## Why Pods, Not Containers?

Kubernetes doesn't schedule containers directly — it schedules **Pods**. Understanding why requires understanding what a Pod actually is at the OS level.

A Pod is a group of one or more containers that share:
- A **network namespace** — the same IP address and the same loopback interface (localhost). If container A in the pod listens on port 3000, container B can connect to it via \`localhost:3000\`.
- An **IPC namespace** — containers can communicate via POSIX shared memory and semaphores.
- Optionally a **PID namespace** — containers can see each other's processes (useful for debugging tools).
- **Storage volumes** — volumes are defined at the Pod level and mounted into individual containers.

### The Sidecar Pattern — Why Multiple Containers Per Pod

The most common pattern is **one container per pod** for simplicity. But the sidecar pattern is where multi-container pods shine:

\`\`\`
Pod: payments-api
├── Container: payments-api       ← main business logic
├── Container: envoy-proxy        ← intercepts all network traffic (Istio)
└── Container: vault-agent        ← fetches secrets from Vault, writes to shared volume
\`\`\`

These sidecars MUST be in the same pod because:
- The Envoy proxy needs to intercept the main container's network traffic — only possible if they share a network namespace.
- The Vault agent needs to write secrets to a volume that the main container reads — only possible if they share volume mounts.

**Airbnb, Lyft, Uber** all use Istio's Envoy sidecar pattern. Netflix uses sidecar containers for their Metaflow observability agent.

### Init Containers

Init containers run to completion BEFORE any regular containers start. They're perfect for:

\`\`\`yaml
spec:
  initContainers:
  - name: wait-for-db
    image: busybox
    # Wait until PostgreSQL is accepting connections before the app starts
    command: ['sh', '-c', 'until nc -z postgres-service 5432; do echo waiting; sleep 2; done']
  - name: run-migrations
    image: myapp:v2
    # Run database migrations before the API server starts
    command: ['python', 'manage.py', 'migrate']
  containers:
  - name: api
    image: myapp:v2
    # Only starts after BOTH init containers succeed
\`\`\`

### Pod Lifecycle Phases

Understanding lifecycle phases is essential for debugging:

\`\`\`
Pending → ContainerCreating → Running → Succeeded / Failed / Unknown

Pending:          Pod accepted by Kubernetes, but not yet scheduled or image not pulled
ContainerCreating: Pod scheduled to a node, pulling image, setting up volumes/networking
Running:          At least one container is running
Succeeded:        All containers exited with code 0 (for Jobs)
Failed:           All containers have exited, at least one with non-zero exit code
Unknown:          Node communication lost — kubelet unreachable for > node-monitor-grace-period (40s default)
\`\`\`

\`\`\`bash
# Why is a pod Pending? Check conditions and events
kubectl describe pod <name>
# Look for: "0/3 nodes are available: 3 Insufficient cpu"
# Or: "0/3 nodes are available: node(s) had taint"
# Or: "PVC not bound"
\`\`\`

## A Production-Grade Pod Manifest

\`\`\`yaml
apiVersion: v1
kind: Pod              # most often you'd use a Deployment, not bare Pod
metadata:
  name: nginx
  namespace: production
  labels:
    app: nginx          # Services use this to find the pod
    tier: frontend      # custom label for your organization
    version: "1.25"     # useful for canary traffic routing
  annotations:
    prometheus.io/scrape: "true"    # Prometheus autodiscovery
    prometheus.io/port: "9113"      # which port to scrape
    git-commit: "abc1234"           # audit trail
spec:
  containers:
  - name: nginx
    image: nginx:1.25           # always pin a specific tag, not :latest
    ports:
    - containerPort: 80         # informational only — does NOT open a firewall
    resources:
      requests:
        memory: "64Mi"          # scheduler uses this to find a fitting node
        cpu: "250m"             # 250 millicores = 0.25 CPU cores
      limits:
        memory: "128Mi"         # container killed (OOMKilled) if it exceeds this
        cpu: "500m"             # container throttled (not killed) if it exceeds this
\`\`\`

\`\`\`bash
kubectl apply -f pod.yaml
kubectl get pods
kubectl describe pod nginx       # full details including events (start here for debugging)
kubectl logs nginx               # container stdout/stderr
kubectl logs nginx -f            # follow (stream) logs in real time
kubectl logs nginx --previous    # logs from the previous (crashed) container
kubectl exec -it nginx -- bash   # shell into the container
kubectl delete pod nginx         # terminates immediately (no grace period with bare pods)
\`\`\`

## Labels and Selectors — How Kubernetes Connects Resources

Labels are key-value pairs attached to any Kubernetes object. They are the primary mechanism by which Kubernetes objects find each other.

**Two types of selectors:**

**Equality-based** (simple match):
\`\`\`bash
kubectl get pods -l app=nginx              # app equals "nginx"
kubectl get pods -l app!=nginx             # app does NOT equal "nginx"
kubectl get pods -l app=nginx,tier=frontend  # AND: both must match
\`\`\`

**Set-based** (IN, NOTIN, EXISTS):
\`\`\`bash
kubectl get pods -l "tier in (frontend,backend)"   # tier is frontend OR backend
kubectl get pods -l "env notin (dev,test)"         # env is NOT dev and NOT test
kubectl get pods -l "gpu"                          # label "gpu" exists (any value)
\`\`\`

### How Services Use Label Selectors

This is the critical mechanic to understand. A Service doesn't reference pods by name — it uses a label selector to dynamically find matching pods:

\`\`\`yaml
# Service with selector:
kind: Service
spec:
  selector:
    app: nginx          # finds ALL pods with this label, routes traffic to them
    tier: frontend      # AND this label (both must match)
\`\`\`

When a pod is added or removed, the Service automatically updates its endpoint list. This is how Kubernetes achieves load balancing without static IP configuration.

**Practical tip:** If a Service has no endpoints (no traffic going to pods), the #1 cause is a label mismatch between the Service selector and the pod labels. Always verify with:
\`\`\`bash
kubectl get endpoints my-service      # shows pod IPs included in the service
kubectl get pods --show-labels        # verify pod labels match the selector
\`\`\`

## Namespaces: Team and Environment Isolation

Namespaces partition a physical cluster into logical virtual clusters. They provide:
- **Name scoping**: Two namespaces can each have a pod named "postgres" — no conflict
- **RBAC scope**: Roles and RoleBindings are namespace-scoped
- **Network Policy scope**: NetworkPolicies are namespace-scoped
- **Resource quotas**: Limit CPU/memory/pods per namespace

\`\`\`bash
kubectl get namespaces
# NAME              STATUS
# default           Active   ← where you work if no namespace is specified
# kube-system       Active   ← Kubernetes internal components (CoreDNS, kube-proxy)
# kube-public       Active   ← publicly readable config (cluster-info)
# kube-node-lease   Active   ← node heartbeat Lease objects (performance optimization)

# Create and use namespaces
kubectl create namespace team-payments
kubectl get pods -n team-payments
kubectl get pods --all-namespaces    # or -A — see everything in the cluster

# Set a default namespace for your kubectl session
kubectl config set-context --current --namespace=team-payments
\`\`\`

### When to Use Multiple Namespaces

**Team isolation** (most common in enterprise):
\`\`\`
cluster
├── namespace: team-payments      # payments team owns this
├── namespace: team-inventory     # inventory team owns this
└── namespace: team-auth          # auth team owns this
\`\`\`
Each team gets their own RBAC permissions, resource quotas, and network policies.

**Environment isolation** (simpler but less safe):
\`\`\`
cluster
├── namespace: development
├── namespace: staging
└── namespace: production
\`\`\`
Beware: a misconfigured NetworkPolicy or RBAC role in one namespace can affect others in the same cluster. For true production isolation, use separate clusters.

### Resource Quotas and LimitRanges

Namespaces without quotas can be starved by a runaway deployment. Apply quotas to every production namespace:

\`\`\`yaml
# ResourceQuota — hard limits for the entire namespace
apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-payments-quota
  namespace: team-payments
spec:
  hard:
    requests.cpu: "10"          # total CPU requests across all pods
    requests.memory: 20Gi       # total memory requests
    limits.cpu: "20"
    limits.memory: 40Gi
    count/pods: "50"            # max 50 pods in this namespace
    count/persistentvolumeclaims: "10"
---
# LimitRange — per-pod defaults and max/min
apiVersion: v1
kind: LimitRange
metadata:
  name: team-payments-limits
  namespace: team-payments
spec:
  limits:
  - type: Container
    default:
      cpu: "200m"       # default limit if not specified
      memory: "256Mi"
    defaultRequest:
      cpu: "100m"       # default request if not specified
      memory: "128Mi"
    max:
      cpu: "2"          # no single container can request more than this
      memory: "4Gi"
\`\`\`

## The Object Model

Every Kubernetes resource has the same four top-level fields:

\`\`\`yaml
apiVersion: apps/v1   # Which API group (v1 = core, apps/v1 = Deployments, etc.)
kind: Deployment      # What type of object
metadata:             # Identity: name, namespace, labels, annotations
  name: my-app
  namespace: production
  labels:
    app: my-app
spec:                 # Desired state — what YOU declare you want
  replicas: 3
# status:            # Actual state — what Kubernetes observes (never write this)
\`\`\`

### The Reconciliation Loop — How Kubernetes Works

This is the most important mental model for Kubernetes. Every Kubernetes controller runs a loop:

\`\`\`
Observe current state → Compare to desired state → Act to close the gap → Repeat
\`\`\`

For the Deployment controller:
\`\`\`
Desired state: 3 replicas (from spec.replicas)
Current state: 2 pods running (from etcd + node status)
Action:        Create 1 new pod
\`\`\`

This means Kubernetes is **self-healing by design**. If a node dies, the ReplicaSet controller detects that actual replica count dropped below desired, and creates replacement pods on healthy nodes — automatically, without human intervention.

## Under the Hood — Shared Network Namespace

When two containers run in the same Pod, they share a network namespace at the Linux kernel level. The pod creates a "pause container" (also called the infra container or sandbox container) first — this container holds the network namespace for the lifetime of the pod. All other containers join this namespace. The pause container is invisible in \`kubectl get pods\` but you can see it on the node with \`crictl ps\`.

## Common Mistakes

- **Running bare Pods in production**: A bare Pod (not managed by a Deployment) will never be rescheduled if the node it runs on fails. Always use a controller (Deployment, StatefulSet, DaemonSet).
- **Using \`:latest\` image tags**: K8s cannot tell if the image changed, leading to inconsistent behavior across nodes. Always pin a specific version tag.
- **Not setting resource requests**: Without requests, the scheduler cannot make good placement decisions, leading to overloaded nodes and unexpected OOM kills.
- **Forgetting to allow DNS egress in NetworkPolicies**: A deny-all policy blocks UDP port 53 (DNS), breaking ALL service name resolution. Always add a DNS allow rule first.
- **Label selector mismatch**: A Service with \`selector: app: nginx\` won't route to a pod labeled \`app: web-nginx\` — exact string match required.

## Production Pattern

At **Airbnb**, every namespace has LimitRanges with sensible defaults so engineers don't have to remember to set resource requests. Teams that exceed their ResourceQuota open a capacity request. NetworkPolicy deny-all is applied automatically to every new namespace via a Kyverno admission policy. No team can accidentally leave a port open to the whole cluster.
`,
          interviewQuestions: [
            {
              question: "Why does Kubernetes use Pods instead of running containers directly?",
              difficulty: "junior" as const,
              answer: `Pods exist for several important reasons:

1. **Sidecar pattern support**: Some applications need helper containers that share the same network and filesystem. Example: an nginx pod + a sidecar that syncs config from git. These must share localhost — only possible if they're in the same network namespace (same pod).

2. **Atomic scheduling unit**: The scheduler needs to place related containers together. If containers were scheduled independently, the nginx and its config-sync sidecar might land on different nodes.

3. **Shared fate**: All containers in a pod live and die together. If the pod is deleted, all containers are stopped simultaneously.

4. **Resource grouping**: Requests and limits are set per container but are accounted for at the pod level for scheduling purposes.

Real-world example: Istio, the service mesh used by Airbnb and Lyft, injects an Envoy proxy container as a sidecar into every application pod. The sidecar intercepts all network traffic without the application knowing. This only works because pod containers share a network namespace.`,
            },
            {
              question: "What's the difference between labels and annotations?",
              difficulty: "junior" as const,
              answer: `**Labels** are for selection and grouping. Kubernetes uses them internally:
- Services use label selectors to find their pods
- Deployments use label selectors to own their pods
- Kubectl can filter by labels: \`kubectl get pods -l app=nginx\`
- Labels must be short and optimized for querying

**Annotations** are for metadata that tools read but Kubernetes doesn't query on:
- Build info: \`git-commit: abc123\`, \`build-date: 2024-01-15\`
- Tool configuration: Prometheus scraping (\`prometheus.io/scrape: "true"\`)
- Owner info: \`owner: team-payments@company.com\`
- Annotations can hold larger values (up to 256KB)

\`\`\`yaml
metadata:
  labels:
    app: payments        # K8s uses this for selection
    version: v2
  annotations:
    git-commit: "abc1234"           # tools read this
    prometheus.io/scrape: "true"    # Prometheus reads this
    description: "Long description that would be too verbose for a label"
\`\`\``,
            },
          ],
        },
      ],
      exam: [
        {
          question: "A new developer asks why you need Kubernetes when Docker works fine. How do you explain the gap Docker alone cannot fill in production?",
          answer: "Docker runs containers on a single machine but gives you no answers for multi-host scheduling, automatic restarts on failure, horizontal scaling under load, service discovery when IPs change, or zero-downtime rolling updates. Kubernetes adds an orchestration layer — a control plane that continuously reconciles desired state with actual state across a cluster of machines, handling all of those concerns automatically.",
          difficulty: "junior",
        },
        {
          question: "What is the role of etcd in a Kubernetes cluster and what is the operational risk if it fails without a backup?",
          answer: "etcd is the distributed key-value store that holds all cluster state — every object definition, resource quota, and secret. The kube-apiserver reads from and writes to etcd on every operation. If etcd is lost without a backup, the entire cluster state is gone: no record of Deployments, Services, ConfigMaps, or PersistentVolumes. Recovery requires restoring from a snapshot or rebuilding the cluster from scratch, so etcd backup (using etcdctl snapshot save) is a critical SRE responsibility.",
          difficulty: "mid",
        },
        {
          question: "Walk through exactly what happens in the Kubernetes control plane when you run `kubectl apply -f deployment.yaml`.",
          answer: "1) kubectl serializes the manifest and sends an HTTP PUT/POST to kube-apiserver. 2) kube-apiserver authenticates and authorizes the request, validates the object schema, and writes the object to etcd. 3) kube-controller-manager's ReplicaSet controller detects the new/updated Deployment and creates/updates the ReplicaSet object. 4) The ReplicaSet controller creates Pod objects with no node assigned. 5) kube-scheduler watches for unscheduled pods, scores nodes by resource availability, affinity, and taints, then writes the chosen node name into the Pod spec. 6) The kubelet on that node watches for pods assigned to itself, pulls the image via containerd, starts the container, and reports status back to the apiserver.",
          difficulty: "mid",
        },
        {
          question: "What is a Kubernetes Pod and why does Kubernetes use Pods as the smallest unit rather than individual containers?",
          answer: "A Pod is a wrapper around one or more tightly coupled containers that share the same network namespace (same IP, loopback interface) and can share volumes. Kubernetes schedules, scales, and manages Pods rather than individual containers because some applications require a main container plus sidecar containers (e.g., a log shipper or service mesh proxy) that must always be co-located and co-scheduled. Using a Pod as the unit allows these coupled containers to be treated as a single schedulable entity.",
          difficulty: "junior",
        },
        {
          question: "A Pod is stuck in `Pending` state. What are the most common causes and how do you diagnose each?",
          answer: "Run `kubectl describe pod <name>` and check the Events section. Common causes: 1) Insufficient resources — the scheduler cannot find a node with enough CPU/memory; fix by reducing resource requests or adding nodes. 2) No node matches affinity/toleration rules — check nodeSelector, nodeAffinity, and taints on nodes. 3) PVC not bound — if the pod uses a PersistentVolumeClaim that is in Pending state, the pod waits; check `kubectl get pvc`. 4) Image pull errors — if the pod is moving to ContainerCreating and failing; check `kubectl describe` for ImagePullBackOff.",
          difficulty: "junior",
        },
        {
          question: "Explain the difference between a Kubernetes Service and a Deployment. Why do you need both?",
          answer: "A Deployment manages the lifecycle of a set of Pod replicas — it ensures the desired number are running, handles rolling updates, and can roll back. A Service provides a stable network endpoint (virtual IP + DNS name) that load-balances traffic across whichever pods match its selector. You need both because pod IPs are ephemeral — they change on every restart. The Service's ClusterIP stays constant, so other applications always have a reliable address to call, regardless of how many replicas exist or what their IPs are.",
          difficulty: "junior",
        },
        {
          question: "What is the purpose of a ConfigMap and how is it different from directly embedding configuration in a container image?",
          answer: "A ConfigMap stores non-sensitive configuration data (environment variables, config files) as Kubernetes objects, decoupled from the container image. This allows the same image to run in dev, staging, and production with different configurations — you change the ConfigMap, not the image. Embedding config in the image means rebuilding and redeploying the image for every config change, breaking the 12-factor app principle of separating config from code, and potentially baking sensitive values into the image layer.",
          difficulty: "junior",
        },
        {
          question: "Describe the kube-scheduler's decision process. What factors influence which node a Pod is placed on?",
          answer: "The scheduler runs a two-phase process: Filtering removes nodes that cannot satisfy the pod's requirements (insufficient CPU/memory requests, node taints not tolerated, nodeSelector or nodeAffinity not matched, pod anti-affinity conflicts, port conflicts). Scoring ranks the remaining nodes using plugins (LeastAllocated for spreading load, NodeAffinity weight, pod topology spread, image locality). The node with the highest score wins. If scores are equal, a node is chosen at random from the top scorers.",
          difficulty: "mid",
        },
        {
          question: "What are Labels and Annotations in Kubernetes and what are the key differences in their intended use?",
          answer: "Labels are key-value pairs used for identification and selection — Services, ReplicaSets, and NetworkPolicies use label selectors to target specific pods. They are indexed and queryable with `kubectl get pods -l app=payments`. Annotations are also key-value pairs but intended for non-identifying metadata: tool configuration (prometheus.io/scrape), git commit SHAs, descriptions, or external system references. Annotations are not used for selection and are not indexed. The rule of thumb: if something needs to be selected or filtered on, use a label; if it is informational metadata for tooling, use an annotation.",
          difficulty: "mid",
        },
        {
          question: "A production cluster's control plane node loses network connectivity for 5 minutes. What happens to running workloads during the outage and what happens when connectivity is restored?",
          answer: "Running pods on worker nodes continue to run — the kubelet runs containers independently of the control plane and does not stop pods if it loses contact with the apiserver. However, no new scheduling decisions are made, no rolling updates proceed, and no self-healing occurs (if a pod crashes, it is not rescheduled). The Node controller in kube-controller-manager starts marking nodes as NotReady after the grace period. When connectivity is restored, kubelets re-register, the apiserver receives updated node status, and the controller manager reconciles any missed events (restarting crashed pods, rescheduling pods from nodes marked Unknown).",
          difficulty: "senior",
        },
      ],
    },
    {
      id: "core-workloads",
      title: "Core Workloads",
      level: "intermediate",
      description: "Master Deployments, StatefulSets, and DaemonSets for every production use case.",
      lessons: [
        {
          id: "deployments-deep-dive",
          title: "Deployments & Health Probes",
          duration: 22,
          type: "lesson",
          description: "Run stateless applications reliably with rolling updates and health checks.",
          objectives: [
            "Write a production-grade Deployment manifest",
            "Configure liveness, readiness, and startup probes",
            "Perform rolling updates and rollbacks",
            "Debug CrashLoopBackOff, OOMKilled, and Pending pod states",
          ],
          content: `# Deployments & Health Probes

## Why Deployments, Not Pods Directly?

Never run pods directly in production. If a bare pod crashes, it's gone forever — nobody restarts it. If the node it runs on dies, the pod is lost. A **Deployment** wraps pods in a controller that guarantees a desired number of replicas always run.

### The ReplicaSet Underneath

A Deployment doesn't manage pods directly — it manages a **ReplicaSet**, which manages the pods. This layering is intentional:

\`\`\`
Deployment (version manager)
├── ReplicaSet v2 (current, 3 pods)      ← actively managed
│   ├── Pod (v2, running)
│   ├── Pod (v2, running)
│   └── Pod (v2, running)
└── ReplicaSet v1 (previous, 0 pods)     ← kept for rollback, scaled to 0
\`\`\`

**Why never create ReplicaSets directly?** You could, but the Deployment layer adds rolling update management, rollback capability, and revision history. The Kubernetes community considers bare ReplicaSets an anti-pattern.

### How the Rolling Update Algorithm Works

With \`replicas: 10\`, \`maxSurge: 2\`, \`maxUnavailable: 1\`, a rolling update proceeds:

\`\`\`
Start:         10 old pods running (v1)
Step 1:        Create 2 new pods (v2) → 12 pods total [maxSurge allows up to 12]
               Terminate 1 old pod (v1) → 11 pods (2 new + 9 old)
               Wait for the 2 new pods to pass readiness probe
Step 2:        Create 2 more new pods → 13 pods
               Terminate 3 old pods → 10 pods (4 new + 6 old)
               ...continue until all 10 are new version
\`\`\`

**Calculating update speed:** With maxSurge=2 and 10 replicas, each step adds 2 new pods and removes 2 old ones. A 10-pod update with a 30s readiness warmup takes roughly 5 steps × 30s = ~150 seconds minimum.

**Recreate strategy** — when v1 and v2 cannot coexist (e.g., incompatible DB schema migration):
\`\`\`yaml
strategy:
  type: Recreate    # terminates ALL old pods first, then creates new ones — brief outage
\`\`\`

## A Production-Grade Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payments-api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: payments-api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1           # can have 1 extra pod during update
      maxUnavailable: 0     # never go below desired count (zero-downtime)
  template:
    metadata:
      labels:
        app: payments-api
        version: v2
    spec:
      containers:
      - name: payments-api
        image: mycompany/payments:v2.1.0
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
          failureThreshold: 3
        startupProbe:
          httpGet:
            path: /healthz
            port: 8080
          failureThreshold: 30
          periodSeconds: 10   # gives up to 5min for slow startup
\`\`\`

## Health Probes — Deep Dive

The three probes serve completely different purposes and trigger different actions on failure.

### Liveness Probe — Detect Deadlocks

**What it asks:** "Is this process alive and capable of making progress?"

**What happens when it fails:** The container is killed with SIGTERM (grace period), then SIGKILL. The container is restarted. The restart count increments. This is the cause of the CrashLoopBackOff you see when probes are misconfigured.

**Use for:** Deadlock detection — where the process is running but stuck. Example: a Go server where a goroutine leaked and the request queue is blocked. The process is "running" but never responds. Without a liveness probe, this pod would sit broken forever.

**Critical warning — liveness probe mistakes cause flapping:**
\`\`\`yaml
# BAD: Liveness probe checks external dependencies
livenessProbe:
  httpGet:
    path: /health-with-db-check    # checks if DB is reachable
# Problem: DB is temporarily slow → probe fails → container restarts → more DB load → cascade

# GOOD: Liveness probe checks ONLY internal process health
livenessProbe:
  httpGet:
    path: /healthz    # returns 200 as long as the process is running, regardless of DB
\`\`\`

### Readiness Probe — Control Traffic Routing

**What it asks:** "Is this pod ready to receive traffic right now?"

**What happens when it fails:** The pod is removed from the Service's endpoint list. Traffic stops going to it. The container KEEPS RUNNING — no restart. When the probe passes again, the pod is added back to endpoints automatically.

**When to use:**
- App is warming up a cache or loading a ML model before it can respond to requests
- App needs to establish a database connection pool
- During graceful shutdown — mark yourself not-ready so the load balancer stops sending traffic before the container exits

\`\`\`yaml
readinessProbe:
  httpGet:
    path: /ready    # endpoint returns 503 if DB connection pool is not ready
  periodSeconds: 5
  failureThreshold: 3    # 15 seconds of failure before being removed from endpoints
  successThreshold: 1    # 1 success → added back to Service endpoints
\`\`\`

### Startup Probe — Handle Slow-Starting Applications

**What it asks:** "Has the application finished initializing?"

**What happens when it passes:** Startup probe is disabled permanently. Liveness and readiness probes activate.

\`\`\`
Without startup probe (Java Spring Boot, 90s startup):
  App starts... livenessProbe fires at 30s (initialDelaySeconds) → FAIL → KILL → restart → infinite loop

With startup probe:
  startupProbe fires at 10s, 20s, 30s, ... 90s → PASS
  liveness/readiness probes now activate → normal operation
\`\`\`

\`\`\`yaml
# For Elasticsearch (can take 2-3 minutes to start):
startupProbe:
  httpGet:
    path: /_cluster/health
    port: 9200
  failureThreshold: 18    # 18 × 10s = 3 minutes max to start
  periodSeconds: 10
  # Once this passes, liveness/readiness take over
\`\`\`

### How the Scheduler Assigns Pods to Nodes

When a pod is created with no node assigned, the scheduler runs a two-phase process:

**Filtering** — eliminates nodes that cannot run the pod:
- Insufficient CPU/memory requests
- Node has a taint the pod doesn't tolerate
- NodeSelector or nodeAffinity requirements don't match
- Port conflicts

**Scoring** — ranks remaining nodes by: LeastAllocated (most available resources), topology spread constraints (keep pods in different AZs), image locality (node already has the image cached).

### Taints and Tolerations

\`\`\`yaml
# Mark a node so only GPU workloads schedule on it:
# kubectl taint nodes gpu-node-1 dedicated=gpu:NoSchedule

# A pod that tolerates the taint (can schedule on GPU nodes):
spec:
  tolerations:
  - key: dedicated
    operator: Equal
    value: gpu
    effect: NoSchedule     # NoSchedule | PreferNoSchedule | NoExecute
  nodeSelector:
    kubernetes.io/instance-type: p3.2xlarge    # further constrain to GPU instances
\`\`\`

**Real-world use:** Uber runs mixed node pools — some nodes have fast local NVMe SSDs tainted \`disktype=local-nvme:NoSchedule\`. Only their latency-sensitive database pods have the matching toleration. This guarantees the SSD nodes are reserved for the workloads that need them.

## Rolling Updates & Rollbacks

\`\`\`bash
# Deploy a new image version (triggers rolling update)
kubectl set image deployment/payments-api payments-api=mycompany/payments:v2.2.0

# Watch the rollout progress in real time
kubectl rollout status deployment/payments-api
# Waiting for deployment rollout to finish: 1 of 3 updated replicas are available...
# deployment "payments-api" successfully rolled out

# View rollout history (shows revisions and change-cause annotations)
kubectl rollout history deployment/payments-api
# REVISION  CHANGE-CAUSE
# 1         Deploy v2.0.0: initial deployment
# 2         Deploy v2.1.0: add payment retry logic

# Rollback to previous version
kubectl rollout undo deployment/payments-api

# Rollback to a specific revision
kubectl rollout undo deployment/payments-api --to-revision=2

# Pause a rollout mid-way (useful for canary manual inspection)
kubectl rollout pause deployment/payments-api
kubectl rollout resume deployment/payments-api
\`\`\`

## Debugging Common Pod States

\`\`\`bash
# Pod not starting? Check events FIRST — always start here
kubectl describe pod <pod-name>
# The Events section at the bottom contains the root cause 90% of the time

# CrashLoopBackOff: container keeps crashing
# "BackOff" = K8s increases delay between restarts: 10s → 20s → 40s → 5min max
kubectl logs <pod-name>                      # current (may be empty if crashes instantly)
kubectl logs <pod-name> --previous           # logs from the LAST crash ← check this

# OOMKilled: container exceeded memory limit (exit code 137 = 128 + SIGKILL)
kubectl describe pod <pod-name> | grep -A5 "Last State"
# Shows: Reason: OOMKilled → increase memory limit OR fix memory leak

# Pending: pod can't be scheduled
kubectl describe pod <pod-name> | grep -A10 Events
# Common messages:
#   "0/3 nodes are available: 3 Insufficient cpu" → add nodes or reduce requests
#   "0/3 nodes are available: node(s) had taint" → add a toleration
#   "0/3 nodes are available: pod has unbound PVC" → fix the PersistentVolumeClaim

# ImagePullBackOff: can't pull the image
kubectl describe pod <pod-name>
# Common causes: image tag typo, registry unreachable, missing imagePullSecrets
\`\`\`

## Under the Hood — ReplicaSet Controller

The Deployment controller watches the Deployment object. When you change \`spec.template\`, it computes a hash of the new template and creates a new ReplicaSet with that hash. It then begins scaling up the new ReplicaSet and scaling down the old one, respecting \`maxSurge\` and \`maxUnavailable\`. The old ReplicaSet is kept at 0 replicas (not deleted) for \`revisionHistoryLimit\` revisions, enabling fast rollback — rollback just scales the old ReplicaSet back up and the current one to 0.

## Common Mistakes

- **Liveness probe too aggressive**: A liveness probe checking external dependencies (DB, Redis) causes cascading restarts during dependency failures. Keep liveness probes checking ONLY internal process health.
- **No startup probe for JVM apps**: Spring Boot apps with classpath scanning take 60-120s to start. Without a startup probe, the liveness probe kills them before they finish starting — infinite CrashLoopBackOff.
- **maxUnavailable > 0 on stateful apps**: Even "stateless" apps with in-flight requests need maxUnavailable: 0 to prevent request loss during rollout.
- **Forgetting terminationGracePeriodSeconds**: Default is 30 seconds. If your app drains connections in 45 seconds, it will be killed mid-drain. Set this to your actual drain time plus a 15s buffer.

## Production Pattern

**Netflix** uses a combination of readiness probes and PreStop lifecycle hooks to achieve zero-downtime deploys:

\`\`\`yaml
lifecycle:
  preStop:
    exec:
      command: ["sh", "-c", "sleep 10"]
# When a pod is being terminated:
# 1. K8s sets pod "Terminating" → readiness probe fails → removed from Service endpoints
# 2. preStop hook runs (10s sleep) → ensures load balancer propagates the endpoint removal
# 3. SIGTERM is sent to the container
# 4. App drains in-flight requests and shuts down gracefully
# The 10-second sleep prevents the window where LB still sends traffic to a terminating pod
\`\`\`
`,
          interviewQuestions: [
            {
              question: "A pod is in CrashLoopBackOff. Walk me through your debugging process.",
              difficulty: "mid" as const,
              answer: `CrashLoopBackOff means the container starts, crashes, and Kubernetes keeps restarting it with exponential backoff (10s, 20s, 40s, up to 5 minutes).

**Step 1: Get logs from the crash**
\`\`\`bash
kubectl logs <pod-name> --previous   # logs from the crashed instance
kubectl logs <pod-name>              # current instance (may be starting)
\`\`\`

**Step 2: Check events**
\`\`\`bash
kubectl describe pod <pod-name>
# Look at Events section at the bottom
\`\`\`

**Common root causes and fixes:**

1. **Application error on startup**: The app exits with non-zero code. Fix: check logs for exception/error, fix the application code or config
2. **Missing environment variables**: App requires DB_URL but it's not set. Fix: add the env var to the deployment
3. **OOMKilled**: Memory limit too low. Fix: increase memory limit or fix memory leak
4. **Liveness probe too aggressive**: Probe fires before app is ready → kills it → loop. Fix: add a startup probe or increase initialDelaySeconds
5. **Wrong command/entrypoint**: ENTRYPOINT in Dockerfile is wrong. Fix: test with \`kubectl run debug --image=myimage --command -- /bin/sh\`
6. **Config file missing**: App expects /etc/config/app.yaml but ConfigMap not mounted. Fix: verify volume mounts

**Quick diagnostic**:
\`\`\`bash
# If logs are empty (crashes too fast), override the entrypoint
kubectl run debug-pod --image=mycompany/payments:v2 \
  --command -- sleep 3600
kubectl exec -it debug-pod -- bash
# Then manually run the entrypoint to see the error
\`\`\``,
            },
            {
              question: "What's the difference between liveness, readiness, and startup probes?",
              difficulty: "junior" as const,
              answer: `All three are health checks, but they serve different purposes and trigger different actions:

**Liveness probe**: "Is this container alive?" → failing kills and restarts the container
- Use: detect deadlocks (app is running but stuck, not processing requests)
- Example: HTTP endpoint that checks internal goroutine health

**Readiness probe**: "Is this container ready to receive traffic?" → failing removes pod from Service endpoints (traffic stops going to it, container keeps running)
- Use: DB connection pool not ready, cache warming, during rolling restart
- Example: check if DB connection is alive before accepting requests

**Startup probe**: "Has the container finished starting?" → disables liveness/readiness until it passes
- Use: slow-starting apps (Java, large ML models, Elasticsearch)
- Example: failureThreshold: 30, periodSeconds: 10 = up to 5 minutes to start

**Practical example**: Without startup probes, a Java Spring Boot app that takes 90 seconds to start will be killed by the liveness probe (set to fire at 30s) before it's even ready, creating an infinite restart loop. The startup probe solves this.`,
            },
            {
              question: "Your deployment has 3 replicas but traffic is only going to 2 of them. Why?",
              difficulty: "mid" as const,
              answer: `The most common reason: **one pod is failing its readiness probe**.

When a pod's readiness probe fails, Kubernetes removes it from the Service's Endpoints list. Traffic only goes to pods with passing readiness checks.

**Debug steps:**
\`\`\`bash
# Check pod status
kubectl get pods -l app=payments-api
# You'll see one pod with READY: 0/1 despite STATUS: Running

# Check readiness probe failures
kubectl describe pod <failing-pod>
# Events: Readiness probe failed: HTTP probe failed...

# Check what the probe is hitting
kubectl exec -it <failing-pod> -- curl localhost:8080/ready
# This shows you what Kubernetes sees

# Check Service endpoints
kubectl get endpoints payments-api-service
# Will show only 2 pod IPs, not 3
\`\`\`

Other possible causes:
- Pod is in **Pending** state (not scheduled yet)
- Pod is in **ContainerCreating** (image still pulling)
- Pod is **Terminating** (being replaced during a rollout)
- **PodDisruptionBudget** limiting how many pods can be unavailable`,
            },
          ],
        },
        {
          id: "statefulsets-and-daemonsets",
          title: "StatefulSets & DaemonSets",
          duration: 18,
          type: "lesson",
          description: "Run stateful applications and node-level daemons reliably.",
          objectives: [
            "Explain when to use StatefulSet vs Deployment",
            "Deploy a database with a StatefulSet and persistent storage",
            "Use DaemonSets for node-level agents",
            "Understand ordered pod creation and stable network identities",
          ],
          content: `# StatefulSets & DaemonSets

## StatefulSets: For Stateful Applications

Deployments treat pods as interchangeable cattle — any pod can be replaced by any other and the application still works. But databases, message brokers, and distributed systems are NOT interchangeable. Each node has a unique identity and specific stored data that must stay associated with it.

StatefulSets give pods four guarantees Deployments cannot provide:

### Guarantee 1: Stable Network Identity

Each pod in a StatefulSet gets a predictable, stable hostname: \`<statefulset-name>-<ordinal>\`. With a Deployment, pod names are random hashes like \`payments-api-7d9f8b-xr9kp\` that change on every restart.

- StatefulSet pod names: \`postgres-0\`, \`postgres-1\`, \`postgres-2\` — ALWAYS these names
- Kafka brokers need to know each other's addresses. They're configured at startup: \`broker.0\`, \`broker.1\`, \`broker.2\`. With random Deployment pod names, this is impossible.

### Guarantee 2: Stable Storage (One PVC Per Pod)

\`volumeClaimTemplates\` creates a dedicated PVC for EACH pod, named \`<pvc-template-name>-<pod-name>\`:

\`\`\`
postgres-0 → PVC: data-postgres-0 → EBS volume in us-east-1a
postgres-1 → PVC: data-postgres-1 → EBS volume in us-east-1b
postgres-2 → PVC: data-postgres-2 → EBS volume in us-east-1c
\`\`\`

When \`postgres-1\` is rescheduled to a different node (due to node failure), it reconnects to \`data-postgres-1\` — its own data, preserved. A Deployment pod would get a fresh empty volume.

### Guarantee 3: Ordered Deployment and Scaling

Pods are created in order (0, 1, 2, ...) and each must be Running AND Ready before the next starts. This is essential for leader election:

\`\`\`
postgres-0 starts → Running+Ready → postgres-1 starts → Running+Ready → postgres-2 starts
                  ↑
                  Primary/master must exist before replicas can replicate from it
\`\`\`

Scaling down is in reverse order (2, 1, 0) — always remove followers before the leader.

### Guarantee 4: Stable DNS via Headless Service

StatefulSets require a **headless service** (\`clusterIP: None\`). This creates DNS records for EACH individual pod instead of a single virtual IP:

\`\`\`
postgres-0.postgres.production.svc.cluster.local → 10.0.1.5 (postgres-0's actual IP)
postgres-1.postgres.production.svc.cluster.local → 10.0.1.6 (postgres-1's actual IP)
postgres-2.postgres.production.svc.cluster.local → 10.0.1.7 (postgres-2's actual IP)
\`\`\`

A regular ClusterIP service gives you ONE virtual IP that load-balances across all pods — you can't target a specific replica. For replication, the primary needs to be addressed directly, and the DNS format above enables this.

**Real-world users:**
- **Elastic** runs Elasticsearch on StatefulSets (master-0, data-0, data-1, data-2)
- **Cassandra** clusters use StatefulSets for stable node naming
- **Kafka** brokers use StatefulSets (broker-0, broker-1, broker-2)
- **PostgreSQL** with Patroni for HA streaming replication

**Use StatefulSet when your app needs:**
- Stable network identity (pod-0, pod-1, pod-2 — not random names)
- Stable storage (each pod gets its own PVC that follows it)
- Ordered deployment/scaling (pod-0 must be Running before pod-1 starts)
- Ordered rolling updates

**Real-world users:**
- **Elastic** runs Elasticsearch on StatefulSets (master-0, data-0, data-1, data-2)
- **Cassandra** clusters use StatefulSets for stable node naming
- **Kafka** brokers use StatefulSets (broker-0, broker-1, broker-2)
- **PostgreSQL** with streaming replication

\`\`\`yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: "postgres"   # headless service name
  replicas: 3
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:    # Each pod gets its own PVC
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: gp2
      resources:
        requests:
          storage: 50Gi
\`\`\`

This creates:
- \`postgres-0\`, \`postgres-1\`, \`postgres-2\` (stable names that survive restarts)
- \`data-postgres-0\`, \`data-postgres-1\`, \`data-postgres-2\` (dedicated PVCs, NOT deleted when pods restart)
- DNS: \`postgres-0.postgres.default.svc.cluster.local\` (individual pod addressability)

The headless service is critical — without \`clusterIP: None\`, the DNS records for individual pods would not be created, and you'd only get the virtual load-balancing IP.

### PodDisruptionBudgets — Protecting StatefulSets During Maintenance

When you run \`kubectl drain\` on a node for maintenance or a cluster upgrade, Kubernetes evicts pods. Without a PodDisruptionBudget, it could evict ALL StatefulSet pods simultaneously — taking your database cluster offline.

\`\`\`yaml
# Ensure at least 2 PostgreSQL pods are always running during disruptions
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: postgres-pdb
  namespace: production
spec:
  minAvailable: 2          # always keep at least 2 pods running
  # OR: maxUnavailable: 1  # allow at most 1 pod to be unavailable
  selector:
    matchLabels:
      app: postgres
\`\`\`

With this PDB:
- A node drain that would take postgres-0 down checks the PDB: 2/3 pods still available → OK
- A node drain that would take postgres-1 down when postgres-0 is already down: 1/3 pods available → BLOCKED until postgres-0 is restored
- Kubernetes will wait, not skip — giving you safety during cluster upgrades

**Real-world:** When EKS upgrades node groups, each node is drained one by one. PDBs prevent the upgrade from creating database downtime by blocking node drains that would violate the minimum availability requirement.

## DaemonSets: One Pod Per Node

A DaemonSet ensures **exactly one pod runs on every node** (or a subset matching a node selector). When new nodes join the cluster, the DaemonSet controller automatically creates a pod on them. When nodes are removed, the pods are garbage collected.

### Why DaemonSets, Not Deployments With High Replica Count?

With a 100-node cluster, a Deployment with \`replicas: 100\` doesn't guarantee one pod per node. The scheduler places pods where resources are available. You might end up with 50 pods on 20 nodes and 0 pods on 80 nodes. A DaemonSet guarantees **one and only one pod per node**.

**Use DaemonSets for:**
- **Log collectors** — Fluentd, Filebeat, Promtail need to read \`/var/log\` on the **specific node** where application containers write their logs. A pod on node-2 cannot read logs written to node-1's filesystem.
- **Monitoring agents** — Datadog Agent, Prometheus Node Exporter collect metrics about the node they run on (CPU, memory, disk, network interfaces)
- **Network plugins (CNI)** — Calico, Cilium, Flannel must run on every node to set up pod networking
- **Storage drivers** — CSI node drivers (EBS, EFS) must be present on every node where pods might mount volumes
- **Security tools** — Falco (runtime security) monitors syscalls from all containers on the node

**Real-world:** Datadog runs its agent as a DaemonSet on every node. Netflix runs their Metaflow log collection as a DaemonSet. All CNI plugins (the core of Kubernetes networking) are DaemonSets — they must be present on every node before any pods can get network connectivity.

\`\`\`yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: kube-system
spec:
  selector:
    matchLabels:
      name: fluentd
  updateStrategy:
    type: RollingUpdate          # updates one node at a time (vs Recreate which kills all first)
    rollingUpdate:
      maxUnavailable: 1          # at most 1 node's fluentd is down during update
  template:
    metadata:
      labels:
        name: fluentd
    spec:
      tolerations:
      - key: node-role.kubernetes.io/control-plane
        effect: NoSchedule        # also run on control plane nodes (for control plane log collection)
      - key: node.kubernetes.io/not-ready
        effect: NoExecute         # start even on nodes that aren't fully ready yet
        tolerationSeconds: 300
      # Priority class: ensures fluentd is NOT evicted when a node is under memory pressure
      priorityClassName: system-node-critical
      containers:
      - name: fluentd
        image: fluent/fluentd-kubernetes-daemonset:v1
        resources:
          requests:
            cpu: "100m"
            memory: "200Mi"
          limits:
            memory: "500Mi"         # limit is set; if exceeded, fluentd is OOMKilled (not app pods)
        volumeMounts:
        - name: varlog
          mountPath: /var/log       # read host's /var/log directory
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true            # read-only: fluentd only reads, never writes
      volumes:
      - name: varlog
        hostPath:
          path: /var/log            # mount the NODE's filesystem, not a PVC
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
\`\`\`

### DaemonSet Update Strategies

\`\`\`bash
# Rolling update (default): updates one node at a time
# Good for: log shippers, monitoring agents — brief gap in collection is acceptable

# OnDelete: only updates when you manually delete the pod
# Good for: CNI plugins — you control exactly when the network plugin is updated (risky operation)

# Check DaemonSet rollout status:
kubectl rollout status daemonset/fluentd -n kube-system
# Waiting for daemon set "fluentd" rollout to finish: 2 out of 10 new pods have been updated...
\`\`\`

## Under the Hood — StatefulSet Identity

When a StatefulSet pod restarts, even on a different node, Kubernetes preserves its identity through two mechanisms:
1. The pod spec uses the ordinal index in the name — \`postgres-1\` is always \`postgres-1\`
2. The PVC binding is stored in etcd — \`data-postgres-1\` is always bound to the same underlying storage

This means if postgres-1's node fails, the new postgres-1 pod is created on a different node, but the PVC \`data-postgres-1\` is reconnected (the EBS volume is detached from the dead node and attached to the new node). The pod wakes up with its data intact.

## Common Mistakes

- **Using a regular ClusterIP Service instead of headless**: Without \`clusterIP: None\`, individual pod DNS records (\`postgres-0.postgres.svc...\`) are not created. Replication configurations that reference pods by hostname will fail.
- **Deleting a StatefulSet without deleting its PVCs**: The PVCs are NOT automatically deleted. This is intentional safety — your data survives. But it means you need to manually delete PVCs if you want to reclaim storage.
- **Forgetting PodDisruptionBudgets**: Without a PDB, a cluster upgrade can drain nodes so fast it takes down all replicas of a stateful service simultaneously.
- **Running a database as a Deployment with shared storage**: Multiple replicas trying to write to the same EBS volume will corrupt data. Use StatefulSets with volumeClaimTemplates.
`,
          interviewQuestions: [
            {
              question: "When would you use a StatefulSet instead of a Deployment?",
              difficulty: "mid" as const,
              answer: `Use **StatefulSet** when your application needs any of:

1. **Stable network identity**: Each pod gets a predictable DNS name (postgres-0, postgres-1). With a Deployment, pod names are random hashes. Kafka brokers need to know each other's addresses; they can't work with random pod names.

2. **Stable storage (one PVC per pod)**: StatefulSets use \`volumeClaimTemplates\` — each pod gets its own PersistentVolumeClaim. If postgres-1 is rescheduled to another node, it reconnects to the same PVC with its data intact. With a Deployment, all pods share one PVC (or each pod uses a new empty PVC on every restart).

3. **Ordered startup**: For a 3-node Elasticsearch cluster, the master node (es-0) must be Running before data nodes (es-1, es-2) start. StatefulSets guarantee this ordering.

4. **Ordered rolling updates**: Updates go in reverse order (pod-2 first, then pod-1, then pod-0), so primary/master nodes are updated last.

**Use Deployment for**: stateless services (web servers, APIs, workers) where any replica is identical and interchangeable.

**Common mistake**: Using a Deployment for PostgreSQL and sharing one PVC across all pods — this causes data corruption as all pods write to the same volume simultaneously.`,
            },
            {
              question: "Why would you use a DaemonSet instead of a Deployment with enough replicas?",
              difficulty: "junior" as const,
              answer: `A Deployment with replicas doesn't guarantee coverage across all nodes. The scheduler places pods where there are available resources, so you might get 3 monitoring agents all on node-1 and none on node-2 and node-3.

DaemonSet guarantees **exactly one pod per node** (matching the node selector):
- **New nodes automatically get the daemon**: When cluster autoscaler adds a node, the DaemonSet controller immediately creates the pod there. With a Deployment, you'd have to manually scale up.
- **No resource-based scheduling**: DaemonSet pods are placed on nodes even if they're "full" for normal pods (they bypass normal scheduling, with resource constraints still applying).
- **Node-local data access**: Log collectors need to read \`/var/log\` on the specific node. A Deployment replica scheduled to the wrong node can't access another node's logs.

Example: If you have a 100-node cluster and deploy Datadog Agent as a DaemonSet vs a Deployment with replicas=100, the Deployment might cluster all 100 agents on 20 nodes, leaving 80 nodes unmonitored.`,
            },
          ],
        },
      ],
      exam: [
        {
          question: "Your Deployment has 3 replicas but only 1 pod is in Ready state. The other two are in CrashLoopBackOff. What steps do you take to diagnose the issue?",
          answer: "1) Run `kubectl get pods` to confirm the states. 2) Run `kubectl logs <crashing-pod> --previous` to see the last crash output — this usually reveals the root cause (missing env var, failed DB connection, OOMKilled). 3) Run `kubectl describe pod <crashing-pod>` to check Events for image pull failures, resource limits, or failed liveness probes. 4) Check if the issue is a misconfigured environment variable or secret by running `kubectl exec` into a healthy pod and checking the env. 5) Check resource usage with `kubectl top pod` to see if OOM is the cause.",
          difficulty: "junior",
        },
        {
          question: "What is the difference between a Deployment's `RollingUpdate` and `Recreate` strategies? When would you use each?",
          answer: "RollingUpdate (default) gradually replaces old pods with new ones, maintaining availability during the rollout — controlled by `maxSurge` (extra pods allowed above desired count) and `maxUnavailable` (pods allowed to be down). Recreate terminates all old pods before creating new ones, causing a brief downtime window. Use RollingUpdate for most stateless services where you need zero downtime. Use Recreate when the new version is incompatible with the old version running simultaneously — for example, a database schema migration that cannot coexist with the old application code.",
          difficulty: "junior",
        },
        {
          question: "Explain what `maxSurge: 1` and `maxUnavailable: 0` mean in a RollingUpdate Deployment strategy with 10 replicas.",
          answer: "With these settings, Kubernetes keeps all 10 existing pods running (0 unavailable) while spinning up 1 additional new-version pod (max 11 pods total during rollout). Once the new pod is Ready, one old pod is terminated, bringing it back to 10. This cycle repeats until all 10 pods run the new version. This is the safest rolling update strategy — no capacity is lost — but it requires extra headroom (11 pods worth of resources). It is ideal for production services where availability is critical.",
          difficulty: "mid",
        },
        {
          question: "What is the difference between a Deployment and a StatefulSet? Give a concrete use case for each.",
          answer: "A Deployment manages interchangeable, stateless pods — any pod can be killed and replaced with a fresh one and the application still works correctly. Pods get random names and share PVCs if any. A StatefulSet gives each pod a stable, ordered identity (pod-0, pod-1, pod-2), a stable DNS hostname (pod-0.service.namespace.svc), and an individual PersistentVolumeClaim per pod that follows the pod if it is rescheduled. Use Deployments for stateless services (APIs, web servers, workers). Use StatefulSets for databases (PostgreSQL, MongoDB), distributed systems requiring quorum (Kafka, Zookeeper, Elasticsearch), or any application that requires stable network identity.",
          difficulty: "mid",
        },
        {
          question: "You need to run a log-shipping agent on every node in the cluster, including nodes added in the future. What Kubernetes resource do you use and why?",
          answer: "Use a DaemonSet. It ensures exactly one pod runs on every node that matches the DaemonSet's node selector. When a new node joins the cluster, the DaemonSet controller automatically schedules a pod on it — no manual intervention needed. Unlike a Deployment with replicas equal to the node count, a DaemonSet guarantees one-per-node placement regardless of scheduling pressure, and it runs on nodes that are 'full' for normal pods. Common DaemonSet use cases: log collectors (Fluentd, Filebeat), monitoring agents (Datadog, Prometheus node exporter), CNI plugins, and storage drivers.",
          difficulty: "junior",
        },
        {
          question: "A Deployment rollout is stuck — new pods are created but they never become Ready. The rollout does not proceed. What do you investigate?",
          answer: "1) Run `kubectl rollout status deployment/<name>` to confirm the rollout is blocked. 2) Run `kubectl get pods` to find pods in non-Ready states. 3) `kubectl describe pod <new-pod>` — check if the readiness probe is failing (wrong port, wrong path, app startup too slow requiring `initialDelaySeconds` increase). 4) Check if the pod is in CrashLoopBackOff (`kubectl logs --previous`). 5) Check if resource requests cannot be satisfied (pods Pending). 6) If `minReadySeconds` is set, confirm the pod has been stable for that duration. Fix the probe configuration or the application startup issue, then resume or roll back with `kubectl rollout undo`.",
          difficulty: "mid",
        },
        {
          question: "What is a liveness probe vs a readiness probe in Kubernetes? What happens when each fails?",
          answer: "A readiness probe determines whether a pod should receive traffic. When it fails, the pod is removed from the Service's endpoints — it stops getting requests but keeps running. This is used for slow startup or temporary unavailability (e.g., loading a model into memory). A liveness probe determines whether a pod is alive. When it fails a configured number of times (failureThreshold), Kubernetes kills the container and restarts it (subject to the pod's restartPolicy). Use liveness probes to recover from deadlocks or infinite loops that would otherwise leave a non-functional pod running indefinitely.",
          difficulty: "mid",
        },
        {
          question: "How do you perform a canary deployment using Kubernetes primitives (no Argo Rollouts or Flagger)?",
          answer: "Create two Deployments — `app-stable` with 9 replicas and `app-canary` with 1 replica — both using the same `app: myapp` label that the Service selects on. The Service will distribute traffic roughly 90%/10% (proportional to pod count). Monitor error rates and latency on the canary. If healthy, gradually scale up `app-canary` and scale down `app-stable`. If problematic, scale `app-canary` to 0. This is a manual process; tools like Argo Rollouts automate progressive traffic shifting with automated analysis and rollback.",
          difficulty: "senior",
        },
        {
          question: "What is a PodDisruptionBudget (PDB) and why is it important during a Deployment rollout or node drain?",
          answer: "A PodDisruptionBudget limits the number of pods of a given application that can be voluntarily disrupted simultaneously. You define either `minAvailable` (minimum pods that must stay up) or `maxUnavailable` (maximum pods that can be down). During a `kubectl drain` (node maintenance) or a cluster upgrade, Kubernetes checks PDBs before evicting pods — if evicting a pod would violate the PDB, it waits. This prevents a node drain from taking down all replicas of a critical service at once. Example: `minAvailable: 2` on a 3-replica Deployment ensures at least 2 are always running during disruptions.",
          difficulty: "senior",
        },
        {
          question: "You need to run a one-off database migration job before a new Deployment goes live. What Kubernetes resource do you use and what are its key configuration fields?",
          answer: "Use a Kubernetes Job. Key fields: `completions` — number of successful pod completions required (1 for a one-off migration). `parallelism` — how many pods run concurrently. `backoffLimit` — how many times to retry before marking the Job as failed. `restartPolicy: Never` or `OnFailure` (Never is preferred for migrations so each attempt is a fresh pod and logs are preserved). For scheduling the migration before the Deployment, use a Helm hook (`helm.sh/hook: pre-upgrade`) or an init container in the Deployment, though a pre-upgrade Job is cleaner for schema migrations.",
          difficulty: "mid",
        },
      ],
    },
    {
      id: "kubernetes-networking",
      title: "Kubernetes Networking",
      level: "intermediate",
      description: "Master Services, Ingress, and Network Policies for secure cluster networking.",
      lessons: [
        {
          id: "services-and-ingress",
          title: "Services & Ingress",
          duration: 22,
          type: "lesson",
          description: "Expose applications inside and outside the cluster.",
          objectives: [
            "Explain ClusterIP, NodePort, and LoadBalancer Service types",
            "Configure an Ingress with TLS termination",
            "Understand how kube-proxy implements service routing",
            "Debug service connectivity issues",
          ],
          content: `# Services & Ingress

## Why Services Exist

Pods are ephemeral — they die, restart, and get assigned new IP addresses. If Service A hardcodes Service B's pod IP, that IP is invalid the moment B's pod restarts. A **Service** gives you a stable virtual IP (ClusterIP) and a DNS name that automatically routes to healthy pods.

\`\`\`
Without Service:
  Pod B (10.0.1.5) → crashes → new Pod B (10.0.1.23)
  Service A has hardcoded 10.0.1.5 → broken

With Service:
  Service B (ClusterIP: 10.96.0.100, DNS: payments-api) → always routes to healthy pods
  Service A uses DNS name "payments-api" → always works, regardless of pod IP changes
\`\`\`

## Service Types — Deep Dive

### ClusterIP (default) — Internal Only

Creates a virtual IP reachable ONLY from within the cluster. kube-proxy programs iptables/IPVS rules on every node to DNAT traffic to this virtual IP into one of the pod IPs.

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: payments-api
  namespace: production
spec:
  type: ClusterIP             # default if omitted — internal only
  selector:
    app: payments-api         # dynamically finds pods with this label
  ports:
  - name: http                # name the port (referenced by Ingress and probes)
    port: 80                  # port the SERVICE listens on (callers use this)
    targetPort: 8080          # port the CONTAINER listens on (must match containerPort)
    protocol: TCP             # TCP (default) or UDP
\`\`\`

DNS resolution within the cluster:
\`\`\`bash
# Short form (works within same namespace):
curl http://payments-api/v1/payments

# Full FQDN (works cross-namespace):
curl http://payments-api.production.svc.cluster.local/v1/payments

# The DNS search order adds the namespace automatically for same-namespace lookups
# CoreDNS serves all cluster DNS queries from kube-system
\`\`\`

### NodePort — Exposes on Every Node's IP

Allocates a port in the range 30000-32767 on EVERY node in the cluster. Traffic hitting any-node-IP:nodePort is forwarded to the Service.

\`\`\`yaml
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 8080
    nodePort: 30080    # if omitted, K8s auto-assigns a port in 30000-32767
\`\`\`

**When to use NodePort:**
- On-premises clusters without cloud load balancers
- Development environments (access the app via \`http://node-ip:30080\`)
- Behind a hardware load balancer that you configure to point at the NodePorts

**Why not use NodePort in production:** Each node IP is exposed. If a node is replaced, clients need to update their configuration. Use an Ingress controller (which sits in front of NodePort) or a LoadBalancer Service instead.

### LoadBalancer — Cloud-Managed External Access

Creates a cloud load balancer (AWS NLB, GCP CLB, Azure LB) in front of the Service. Each LoadBalancer Service gets its own cloud LB.

\`\`\`yaml
spec:
  type: LoadBalancer
  # Annotations customize the cloud LB:
  # (AWS example — creates an NLB instead of classic ELB)
metadata:
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
# Result: AWS provisions an NLB, you get an external DNS name/IP
\`\`\`

**Cost consideration:** On AWS, each NLB costs ~$16/month + data processing. A cluster with 50 microservices using LoadBalancer Services costs ~$800/month in LB fees alone. Use ONE Ingress controller instead.

### ExternalName — DNS Alias to External Services

Creates a CNAME record pointing outside the cluster. Use for database endpoints, external APIs.

\`\`\`yaml
spec:
  type: ExternalName
  externalName: mydb.us-east-1.rds.amazonaws.com
  # In-cluster: curl http://prod-database → resolves to RDS endpoint
  # Allows you to use a K8s service name even for external resources
  # Can easily switch from external to internal by changing the Service type
\`\`\`

## How kube-proxy Implements Service Routing

kube-proxy runs on every node and watches the API server for Service and Endpoints changes. It programs the Linux networking stack to intercept and redirect traffic.

### iptables Mode (default)

For each Service with 3 endpoints, kube-proxy creates iptables DNAT rules:

\`\`\`bash
# Traffic to 10.96.0.100:80 (ClusterIP) is intercepted and probabilistically redirected:
# With 3 pods, the probability chain looks like:
#   → 10.0.1.5:8080 with probability 1/3 (33%)
#   → 10.0.1.6:8080 with probability 1/2 of remaining (33%)
#   → 10.0.1.7:8080 always (33%)

# See the iptables rules on a node:
sudo iptables -t nat -L KUBE-SERVICES | grep payments
sudo iptables -t nat -L KUBE-SVC-<hash>  # the per-service chain
\`\`\`

**Problem at scale:** iptables rules are evaluated linearly — O(n) where n is the number of endpoints. At 10,000 Services with 5 pods each = 50,000 rules per node, evaluated sequentially for every packet. This causes multi-millisecond latency increases at large scale.

### IPVS Mode (recommended for large clusters)

IPVS uses hash tables for O(1) lookup. Supports advanced load-balancing algorithms: round-robin, least connections, shortest expected delay, destination hashing.

\`\`\`bash
# Enable IPVS mode in kube-proxy config:
# kube-proxy --proxy-mode=ipvs --ipvs-scheduler=lc  # least connections

# See IPVS rules:
ipvsadm -Ln | grep 10.96.0.100
\`\`\`

**At scale:** Google, Baidu, and JD.com switched to IPVS for clusters with 10,000+ Services. At 5,000 Services, IPVS reduces packet processing time from ~50ms to ~0.5ms.

## Ingress: One Load Balancer for All Services

Instead of one LoadBalancer per service (expensive), use one Ingress controller that routes traffic based on hostname and path. The Ingress controller is itself a Deployment with a LoadBalancer Service.

\`\`\`
Internet → AWS ALB (1 LB, ~$16/month total)
              │
   ┌──────────┼───────────────┐
   │          │               │
api.company.com  app.company.com  admin.company.com
   │          │               │
api-svc     app-svc        admin-svc (ClusterIP)
\`\`\`

### Ingress Controller Architecture

The Ingress **resource** (YAML object) declares the routing rules. The Ingress **controller** is a running pod that:
1. Watches Ingress objects in the cluster
2. Configures an underlying reverse proxy (nginx, Envoy, HAProxy) based on those rules
3. Provisions cloud LBs when using cloud-specific controllers (AWS ALB Ingress Controller)

**Popular controllers and their use cases:**
- **nginx** — most common, great for HTTP/HTTPS routing, rate limiting, auth
- **Traefik** — automatic TLS via Let's Encrypt, dynamic configuration
- **AWS ALB Ingress Controller** — provisions an AWS Application Load Balancer per Ingress, native integration with WAF and Cognito
- **Istio Gateway** — for service mesh environments, supports gRPC, WebSocket, circuit breaking

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: main-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: "nginx"          # which controller handles this Ingress
    nginx.ingress.kubernetes.io/rate-limit: "100" # 100 req/sec per client IP
    cert-manager.io/cluster-issuer: "letsencrypt-prod"  # auto TLS cert
spec:
  ingressClassName: nginx       # modern way (Kubernetes 1.18+)
  tls:
  - hosts:
    - api.mycompany.com
    secretName: api-tls-cert    # cert-manager creates and populates this Secret
  rules:
  - host: api.mycompany.com     # matches Host: header
    http:
      paths:
      - path: /v1               # matches URL path prefix
        pathType: Prefix        # Prefix (starts with) | Exact | ImplementationSpecific
        backend:
          service:
            name: payments-api  # routes to this Service
            port:
              number: 80
      - path: /health
        pathType: Exact         # exact match only — /health not /health/db
        backend:
          service:
            name: healthcheck
            port:
              number: 8080
\`\`\`

### How DNS Resolves Service Names Within a Cluster

CoreDNS runs as a Deployment in \`kube-system\` and is the DNS server for all pods. It is configured with the cluster domain (default: \`cluster.local\`).

\`\`\`
Pod DNS resolution for "payments-api":
1. Search domains (from /etc/resolv.conf in the pod):
   - payments-api.production.svc.cluster.local → hit! → return ClusterIP
   - payments-api.svc.cluster.local → (if not found above)
   - payments-api.cluster.local → (if not found above)
   - payments-api. → external DNS lookup (if none of above match)

2. For cross-namespace: "payments-api.production" →
   payments-api.production.svc.cluster.local → return ClusterIP
\`\`\`

\`\`\`bash
# Verify DNS resolution from within a pod:
kubectl exec -it debug-pod -- nslookup payments-api
# Server:    10.96.0.10          ← CoreDNS ClusterIP
# Address:   10.96.0.10#53
# Name:      payments-api.production.svc.cluster.local
# Address:   10.96.45.100        ← Service ClusterIP
\`\`\`

## Debugging Service Connectivity

\`\`\`bash
# Step 1: Can the pod resolve the service DNS name?
kubectl exec -it debug-pod -- nslookup payments-api
kubectl exec -it debug-pod -- nslookup payments-api.default.svc.cluster.local
# If this fails: CoreDNS issue — check kubectl get pods -n kube-system | grep coredns

# Step 2: Are there endpoints? (Is the selector matching pods?)
kubectl get endpoints payments-api
# If ENDPOINTS shows <none>: selector mismatch — most common cause
kubectl get pods --show-labels | grep payments-api  # compare with service selector

# Step 3: Are the pods passing their readiness probes?
kubectl get pods -l app=payments-api
# READY column: 0/1 means readiness probe failing → pod excluded from endpoints

# Step 4: Can you reach the pod directly (bypass service routing)?
kubectl get pod my-pod -o jsonpath='{.status.podIP}'
kubectl exec -it debug-pod -- curl <pod-ip>:8080
# If direct works but service doesn't: kube-proxy issue or NetworkPolicy blocking traffic

# Step 5: Check service port mapping
kubectl describe service payments-api
# Verify Port (service port), TargetPort (container port), and NodePort if applicable
\`\`\`

## Under the Hood — Endpoints and EndpointSlices

When you create a Service, Kubernetes automatically creates an **Endpoints** object (or EndpointSlices in newer versions) that contains the IP addresses of all pods matching the selector that have passed their readiness probe. kube-proxy watches these Endpoints objects (not the pods directly) to update its iptables/IPVS rules.

This is why:
- A pod that fails its readiness probe is automatically removed from Service traffic (the Endpoints controller removes its IP)
- A pod being terminated gracefully stops receiving traffic before it shuts down (if you send a SIGTERM, the pod is first removed from endpoints, then given time to drain)

## Common Mistakes

- **Selector mismatch between Service and Deployment**: The Service has \`app: payments-api\` but the Deployment's pod template has \`app: payments_api\` (underscore vs hyphen). No endpoints are populated.
- **Port vs TargetPort confusion**: \`port: 80\` is the Service port (what callers use). \`targetPort: 8080\` is the container port (what the app listens on). They don't have to match.
- **Using NodePort when Ingress is available**: NodePort works but exposes every node's IP to the internet and requires external load balancer configuration. Use Ingress instead.
- **One LoadBalancer Service per microservice**: At 50 microservices × $16/month = $800/month vs one Ingress controller.
- **Forgetting the headless service for StatefulSets**: Without \`clusterIP: None\`, individual pod DNS records are not created. StatefulSet pods cannot be addressed individually.

## Production Pattern

**Airbnb's service routing** uses NGINX Ingress with rate limiting and OIDC authentication at the Ingress layer. Every microservice uses a ClusterIP Service internally. The only Services with external exposure are through Ingress rules with TLS termination, WAF integration, and request logging. Individual engineers never have access to create LoadBalancer Services in production — only ClusterIP and Ingress resources are permitted via OPA/Gatekeeper policies.
`,
          interviewQuestions: [
            {
              question: "Your service is unreachable from within the cluster. How do you debug it?",
              difficulty: "mid" as const,
              answer: `Systematic debugging approach:

**1. Check if the service exists and has correct configuration**
\`\`\`bash
kubectl get service my-service
kubectl describe service my-service
# Check: selector, port, targetPort
\`\`\`

**2. Check if endpoints are populated**
\`\`\`bash
kubectl get endpoints my-service
# If <none>: service selector doesn't match any pod labels
# Fix: compare service selector with pod labels
kubectl get pods --show-labels | grep app=my-service
\`\`\`

**3. Test DNS resolution**
\`\`\`bash
kubectl run debug --image=busybox --rm -it --restart=Never -- sh
nslookup my-service
nslookup my-service.default.svc.cluster.local
# If this fails: CoreDNS issue
kubectl get pods -n kube-system | grep coredns
\`\`\`

**4. Test direct pod connectivity**
\`\`\`bash
# Bypass the service, hit the pod directly
kubectl get pod my-pod -o wide  # get pod IP
curl <pod-ip>:<container-port>
# If this works but service doesn't: kube-proxy issue
\`\`\`

**5. Check NetworkPolicy**
\`\`\`bash
kubectl get networkpolicy
# A deny-all policy blocking traffic?
\`\`\`

Most common root cause: **selector mismatch** — the service has \`app: my-app\` but pods have \`app: myapp\` (typo).`,
            },
            {
              question: "Why use Ingress instead of a LoadBalancer Service for each microservice?",
              difficulty: "junior" as const,
              answer: `**Cost**: Each LoadBalancer Service creates a cloud load balancer. On AWS, an NLB costs ~$16/month + data processing fees. If you have 20 microservices, that's $320+/month just for load balancers. One Ingress controller = one LB = ~$16/month for all 20 services.

**Features**: Ingress provides:
- **Host-based routing**: api.mycompany.com → api service, app.mycompany.com → app service
- **Path-based routing**: /api → api service, /static → frontend service
- **TLS termination**: Manage one certificate at the ingress, not in each service
- **Rate limiting, auth**: Nginx Ingress annotations, OAuth2 proxy patterns

**Example cost comparison for Airbnb-scale (hundreds of services)**:
- LoadBalancer per service: 200 services × $16 = $3,200/month
- Ingress controllers: 3 ingress controllers (HA) × $16 = $48/month

**When to use LoadBalancer directly**: For TCP/UDP services that aren't HTTP (databases, game servers, gRPC with specific requirements), since Ingress is HTTP/HTTPS-only.`,
            },
          ],
        },
        {
          id: "network-policies",
          title: "Network Policies",
          duration: 15,
          type: "lesson",
          description: "Implement zero-trust networking with NetworkPolicy.",
          objectives: [
            "Explain why default Kubernetes networking is permissive",
            "Write NetworkPolicy to isolate workloads",
            "Implement a deny-all baseline with selective allow rules",
            "Apply NetworkPolicy for compliance requirements",
          ],
          content: `# Network Policies

## The Problem: Kubernetes Is Open By Default

By default, every pod in a Kubernetes cluster can talk to every other pod — across namespaces. There is NO implicit isolation. If an attacker exploits a vulnerability in your frontend pod, they can directly connect to your database pod on port 5432.

\`\`\`
Default Kubernetes (no NetworkPolicies):
  frontend-pod → database-pod:5432 ✓   ← should this be allowed? Probably not
  frontend-pod → payments-api:8080 ✓
  frontend-pod → internal-admin-api ✓  ← dangerous! admin APIs have no business receiving frontend traffic
  compromised-pod → database-pod ✓     ← lateral movement attack succeeds
\`\`\`

This violates the **zero-trust** security model and fails compliance requirements:
- **PCI DSS** requires cardholder data to be isolated in a separate network segment
- **HIPAA** requires PHI systems to have strict access controls
- **SOC 2** requires demonstrable network segmentation

### CNI Plugin Requirements — Not All CNIs Enforce NetworkPolicy

NetworkPolicy is a Kubernetes API object, but the actual enforcement happens in the CNI plugin. If your CNI doesn't support NetworkPolicy, applying the objects does NOTHING — no enforcement, no error, just a false sense of security.

| CNI Plugin | NetworkPolicy Support |
|------------|----------------------|
| **Calico** | Yes — L3/L4 + Calico-specific L7 policies |
| **Cilium** | Yes — L3/L4/L7, eBPF-based, best performance |
| **Weave Net** | Yes |
| **Flannel** | **NO** — policies are ignored |
| **AWS VPC CNI** | Needs Calico or Cilium added |
| **GKE Dataplane V2** | Yes (uses Cilium) |
| **AKS** | Yes (Calico or Azure NetworkPolicy plugin) |

Always verify your CNI supports NetworkPolicy:
\`\`\`bash
kubectl get daemonset -n kube-system  # look for calico-node, cilium, etc.
\`\`\`

## NetworkPolicy: How It Works Internally

A NetworkPolicy selects pods via a \`podSelector\` and declares allowed ingress/egress rules. Once ANY NetworkPolicy selects a pod, that pod's traffic is restricted to what the policies explicitly permit. Pods not selected by any NetworkPolicy have no restrictions.

**Additive model:** Multiple NetworkPolicies can select the same pod. The allowed traffic is the UNION of all matching policies. There is no "deny rule" — only allow rules. To deny traffic, simply don't have an allow rule for it.

## Step 1: Deny All (Zero-Trust Baseline)

This is the first NetworkPolicy to apply to every production namespace:

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: production
spec:
  podSelector: {}      # empty selector = applies to ALL pods in this namespace
  policyTypes:
  - Ingress            # apply ingress rules
  - Egress             # apply egress rules
  # No ingress[] or egress[] rules defined = deny ALL ingress and egress
\`\`\`

After applying this, ALL traffic to and from pods in the production namespace is blocked. Nothing works yet — including DNS resolution. That's intentional. Now we selectively open only what's needed.

## Step 2: Always Allow DNS First

DNS uses UDP/TCP port 53. If you block egress port 53, pods cannot resolve any service names — everything breaks silently (curl my-service returns "Name or service not known").

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns-egress
  namespace: production
spec:
  podSelector: {}       # applies to ALL pods
  policyTypes:
  - Egress
  egress:
  - ports:
    - protocol: UDP
      port: 53          # DNS is primarily UDP
    - protocol: TCP
      port: 53          # DNS can also use TCP for large responses
  # This allows ALL pods to reach CoreDNS for name resolution
\`\`\`

## Step 3: Allow Specific Application Traffic

\`\`\`yaml
# Allow frontend pods to call payments-api on port 8080
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-payments
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: payments-api     # this policy applies TO payments-api pods (the receiver)
  policyTypes:
  - Ingress                 # controls who can send TO payments-api
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend     # ONLY frontend pods can send ingress traffic
    ports:
    - protocol: TCP
      port: 8080            # only on this port
---
# Allow payments-api to reach postgres on port 5432
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-payments-to-db
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: postgres         # applies TO postgres pods
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: payments-api # only payments-api can reach postgres
    ports:
    - protocol: TCP
      port: 5432
\`\`\`

Now the traffic flow is:
\`\`\`
frontend → payments-api:8080  ✓  (allowed by policy)
payments-api → postgres:5432  ✓  (allowed by policy)
frontend → postgres:5432      ✗  (no policy allows this)
compromised-pod → postgres    ✗  (no policy allows this — lateral movement blocked)
\`\`\`

## Cross-Namespace Policies — Combined Selectors

When you need to allow traffic from a different namespace, combine \`namespaceSelector\` AND \`podSelector\`:

\`\`\`yaml
# Allow Prometheus in the "monitoring" namespace to scrape metrics from production pods
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-prometheus-scrape
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: payments-api
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          purpose: monitoring    # the monitoring namespace must have this label
      podSelector:               # AND within that namespace, only these pods
        matchLabels:
          app: prometheus
    ports:
    - port: 9090
\`\`\`

**Critical syntax note:** In the \`from\` list, entries within the SAME list item are AND conditions. Entries in SEPARATE list items are OR conditions:

\`\`\`yaml
# This is AND: must be from monitoring namespace AND have app=prometheus label
ingress:
- from:
  - namespaceSelector:
      matchLabels:
        purpose: monitoring
    podSelector:              # same list item → AND
      matchLabels:
        app: prometheus

# This is OR: from monitoring namespace OR from any pod with app=prometheus label
ingress:
- from:
  - namespaceSelector:        # separate list item → OR
      matchLabels:
        purpose: monitoring
  - podSelector:              # separate list item → OR
      matchLabels:
        app: prometheus
\`\`\`

## ipBlock — Controlling External Traffic

Use \`ipBlock\` to allow/deny traffic from specific CIDR ranges:

\`\`\`yaml
# Allow only internal corporate network and VPN to access the admin API
ingress:
- from:
  - ipBlock:
      cidr: 10.0.0.0/8        # corporate internal network
  - ipBlock:
      cidr: 192.168.1.0/24    # VPN subnet
      except:
      - 192.168.1.100/32      # block a specific compromised IP within the range
\`\`\`

## Under the Hood — How CNI Enforces NetworkPolicy

When Calico or Cilium is the CNI, each node runs an agent (calico-node or cilium-agent) that watches NetworkPolicy objects. When a policy is applied or changed, the agent programs either:
- **iptables rules** (Calico in standard mode) — iptables chains per namespace, per pod
- **eBPF programs** (Cilium) — kernel-level bytecode attached to each network interface, significantly faster than iptables

Every packet is evaluated against the policy rules at the kernel level before it leaves the pod's veth interface. This means enforcement is at the source, not at the destination — a compromised pod cannot even send the packet.

## Common Mistakes

- **Forgetting DNS egress rule**: The most common mistake. Always apply the allow-dns policy before or alongside deny-all.
- **Using OR when you meant AND in from[] selectors**: Separate list entries are OR. Same-item namespace+pod selector is AND. Getting this wrong opens up unintended cross-namespace access.
- **CNI doesn't support NetworkPolicy**: Using Flannel and wondering why policies don't work. Always verify CNI support before relying on NetworkPolicy for compliance.
- **Not labeling namespaces for namespaceSelector**: If \`namespaceSelector\` references a label that no namespace has, no traffic is allowed — not even from the intended namespace.
- **Only applying Ingress rules, forgetting Egress**: If your app needs to make outbound calls (to external APIs, databases in other namespaces), you also need egress rules.

## Production Pattern

**Stripe's** zero-trust networking model: every namespace gets a deny-all policy automatically via a Kyverno ClusterPolicy that watches for new namespaces and injects the baseline policies. Service-to-service communication is then opened up by the service owner as part of their deployment configuration. Prometheus scraping is handled by a ClusterPolicy that automatically allows scraping from the monitoring namespace. No human intervention required for new services to get the baseline security posture.
`,
          interviewQuestions: [
            {
              question: "By default, can a pod in namespace A talk to a pod in namespace B?",
              difficulty: "junior" as const,
              answer: `**Yes** — by default, Kubernetes applies no network restrictions. All pods can communicate with all other pods across all namespaces, regardless of namespace boundaries.

This is why NetworkPolicy is critical for production security:

\`\`\`bash
# Without NetworkPolicy, this works by default:
kubectl exec -it frontend-pod -n frontend -- \
  curl http://payments-db.backend.svc.cluster.local:5432
\`\`\`

To achieve namespace isolation:
1. Apply a \`deny-all\` NetworkPolicy in each namespace
2. Then selectively allow required communication

**Important caveat**: NetworkPolicy only works if your CNI plugin supports it. Flannel (the simplest CNI) doesn't enforce NetworkPolicy. Calico, Cilium, and Weave do.

For compliance requirements (PCI DSS, HIPAA), namespace isolation via NetworkPolicy is usually required. Many companies implement it as: frontend namespace can only talk to API namespace, API namespace can talk to database namespace, nothing can bypass these boundaries.`,
            },
            {
              question: "You applied a deny-all NetworkPolicy and now your app can't resolve DNS. What happened?",
              difficulty: "mid" as const,
              answer: `DNS in Kubernetes is served by CoreDNS pods in the \`kube-system\` namespace, on port 53 (UDP/TCP). When you apply a deny-all Egress policy, you also block DNS queries — so no service names resolve.

**Fix: Add an explicit egress rule for DNS**

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns-egress
spec:
  podSelector: {}        # all pods
  policyTypes:
  - Egress
  egress:
  - ports:               # allow DNS
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53
\`\`\`

This is one of the most common NetworkPolicy mistakes. The correct pattern is:
1. Apply deny-all (ingress + egress)
2. Immediately apply allow-dns
3. Then add your specific application rules

Without DNS, \`kubectl exec -- curl my-service\` fails with "Name or service not known" even if you've allowed the service port, because the pod can't resolve \`my-service\` to an IP.`,
            },
          ],
        },
      ],
      exam: [
        {
          question: "What is the difference between a ClusterIP, NodePort, and LoadBalancer Service in Kubernetes? When would you use each?",
          answer: "ClusterIP (default) assigns a virtual IP reachable only within the cluster — use for internal service-to-service communication. NodePort exposes the Service on a static port on every node's IP, making it reachable from outside the cluster via <NodeIP>:<NodePort> — use for development or on-premises environments without a cloud load balancer. LoadBalancer provisions an external cloud load balancer (AWS ELB, GCP CLB) that routes external traffic to the Service — use for production internet-facing services in cloud environments. Each LoadBalancer Service typically costs money per cloud provider.",
          difficulty: "junior",
        },
        {
          question: "A pod cannot reach another service by its DNS name (e.g., `payments-api.default.svc.cluster.local`). The service exists. What are the possible causes and how do you debug?",
          answer: "1) Verify DNS resolution: `kubectl exec -it <pod> -- nslookup payments-api.default.svc.cluster.local`. If it fails, check CoreDNS pods are running (`kubectl get pods -n kube-system`). 2) Verify the Service selector matches the target pod labels: `kubectl describe svc payments-api` and compare selector to `kubectl get pods --show-labels`. 3) Check if the target pods are Ready — unhealthy pods are removed from Endpoints. 4) If a NetworkPolicy is in place, verify it permits ingress on the correct port from the source pod's namespace/labels. 5) Check `kubectl get endpoints payments-api` — if empty, no pods match the selector.",
          difficulty: "mid",
        },
        {
          question: "Explain how Kubernetes Ingress works. What components are involved and what does the Ingress controller do?",
          answer: "An Ingress resource is a Kubernetes API object that defines HTTP/HTTPS routing rules — which hostname and path maps to which Service. The Ingress resource itself does nothing on its own; it requires an Ingress controller (NGINX, Traefik, AWS ALB Ingress Controller, etc.) — a pod running in the cluster that watches for Ingress objects and configures a reverse proxy accordingly. When a request arrives at the load balancer in front of the cluster, the Ingress controller routes it to the correct Service based on Host header and URL path matching. TLS termination happens at the Ingress controller using a Secret referenced by the Ingress.",
          difficulty: "mid",
        },
        {
          question: "You have three microservices: frontend, API, and database. Design the Service types for each and justify your choices.",
          answer: "Database: ClusterIP only — it should never be exposed outside the cluster. Only the API should be able to reach it, enforced with a NetworkPolicy. API: ClusterIP — only the frontend needs to call it internally; or optionally a LoadBalancer if mobile clients call it directly. Frontend: LoadBalancer (or NodePort) — it serves end users, so it needs an externally accessible endpoint. In production, you would typically put an Ingress in front of the frontend and API (with path-based routing), using a single LoadBalancer for the Ingress controller, reducing cloud LB costs.",
          difficulty: "junior",
        },
        {
          question: "What is a Kubernetes NetworkPolicy and what is the default behavior of a cluster without any NetworkPolicies applied?",
          answer: "Without any NetworkPolicies, all pods can communicate with all other pods across all namespaces — this is the default open behavior. A NetworkPolicy is a namespaced object that restricts ingress and/or egress traffic to/from pods matching a podSelector. Once any NetworkPolicy selects a pod, that pod's traffic is restricted to what the policies explicitly allow — a default-deny model is achieved by creating a policy that selects all pods but specifies no ingress/egress rules. NetworkPolicies are enforced by the CNI plugin (Calico, Cilium, Weave) — not all CNI plugins support them (e.g., Flannel does not).",
          difficulty: "mid",
        },
        {
          question: "How does kube-proxy implement Service routing? What is the difference between iptables and IPVS mode?",
          answer: "kube-proxy watches for Service and Endpoint changes and programs the node's network stack to route ClusterIP traffic to pod IPs. In iptables mode (default), kube-proxy creates iptables DNAT rules for each Service endpoint — traffic to the ClusterIP is randomly NAT'd to one of the endpoint pod IPs. This works well up to a few thousand services but has O(n) rule lookup time. In IPVS mode, kube-proxy uses the Linux kernel's IP Virtual Server, which uses hash tables for O(1) lookups and supports advanced load-balancing algorithms (round-robin, least connections, shortest expected delay). IPVS mode is recommended for large clusters with thousands of Services.",
          difficulty: "senior",
        },
        {
          question: "You need to restrict a payment service pod so it can only receive traffic from the frontend and cannot make any outbound calls except to the database on port 5432. Write the NetworkPolicy logic.",
          answer: "You need two rules on the payment service pod: an ingress rule allowing traffic only from pods with label `app: frontend`, and an egress rule allowing traffic only to pods with label `app: database` on port 5432, plus an egress rule for DNS (port 53 UDP/TCP to kube-dns). The NetworkPolicy selects pods with `app: payments`, specifies `policyTypes: [Ingress, Egress]`, ingress from `podSelector: {matchLabels: {app: frontend}}`, and egress to `podSelector: {matchLabels: {app: database}}` port 5432 plus to kube-dns namespace. All other ingress and egress is implicitly denied once the policy is applied.",
          difficulty: "senior",
        },
        {
          question: "What is the DNS naming convention for Services in Kubernetes and how does a pod resolve a service in another namespace?",
          answer: "The full DNS name for a Service is `<service-name>.<namespace>.svc.cluster.local`. Within the same namespace, pods can use just `<service-name>` (short form) because the search domain includes the local namespace. To reach a service in a different namespace, pods must use at minimum `<service-name>.<namespace>` or the full FQDN. For example, a pod in the `frontend` namespace calling the `payments-api` Service in the `payments` namespace uses `payments-api.payments` or `payments-api.payments.svc.cluster.local`. This is resolved by CoreDNS running in kube-system.",
          difficulty: "junior",
        },
        {
          question: "An Ingress with TLS is configured but the browser reports an SSL certificate warning. What are the possible causes?",
          answer: "1) The TLS Secret referenced in the Ingress does not exist or is in the wrong namespace — check `kubectl get secret <tls-secret> -n <ingress-namespace>`. 2) The certificate in the Secret has expired — check with `kubectl get secret <name> -o jsonpath='{.data.tls\\.crt}' | base64 -d | openssl x509 -noout -dates`. 3) The certificate CN/SAN does not match the hostname in the Ingress rule. 4) The Ingress controller is using a default self-signed certificate as fallback — check that the `spec.tls[].secretName` in the Ingress matches exactly. 5) cert-manager has not yet issued the certificate — check `kubectl get certificate` and `kubectl describe certificate`.",
          difficulty: "mid",
        },
        {
          question: "Describe what happens at the network level when Pod A in namespace `frontend` calls `http://api-service.backend:8080/users`.",
          answer: "1) Pod A's DNS resolver sends a query for `api-service.backend.svc.cluster.local` to CoreDNS (at the cluster DNS IP, e.g., 10.96.0.10). 2) CoreDNS returns the ClusterIP of `api-service` in the `backend` namespace (e.g., 10.100.45.23). 3) Pod A sends a TCP packet to 10.100.45.23:8080. 4) iptables (kube-proxy rules) on Pod A's node intercepts the packet and DNAT's it to one of the actual pod IPs backing `api-service` (e.g., 192.168.1.55:8080) — chosen randomly or via IPVS. 5) The packet is routed via the CNI overlay network to the target node. 6) The target pod receives the request on port 8080. On the return path, conntrack reverses the NAT.",
          difficulty: "senior",
        },
      ],
    },
    {
      id: "config-and-storage",
      title: "Config & Storage",
      level: "intermediate",
      description: "Manage configuration and persistent data in Kubernetes.",
      lessons: [
        {
          id: "configmaps-and-secrets",
          title: "ConfigMaps & Secrets",
          duration: 18,
          type: "lesson",
          description: "Decouple configuration from container images.",
          objectives: [
            "Create ConfigMaps and mount them as files or env vars",
            "Understand why Secrets are not secure by default",
            "Use Sealed Secrets or External Secrets for production",
            "Rotate secrets without restarting pods",
          ],
          content: `# ConfigMaps & Secrets

## ConfigMaps: Non-Sensitive Configuration

A ConfigMap decouples configuration data from container images. The 12-factor app methodology says "config" is anything that varies between deployments (dev vs staging vs prod) — and that config should NOT be baked into the image.

**What belongs in a ConfigMap:**
- Environment names, log levels, feature flags
- Server configuration files (nginx.conf, prometheus.yml, app.properties)
- URLs to external services (database endpoint, Redis address)
- Non-secret tuning parameters

\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: production
data:
  # Simple key-value pairs (used as env vars):
  APP_ENV: "production"
  LOG_LEVEL: "info"
  CACHE_TTL: "300"
  DATABASE_POOL_SIZE: "10"

  # Multi-line value (mounted as a file):
  nginx.conf: |
    server {
      listen 80;
      location /health {
        return 200 'ok';
      }
    }

  # Properties file format:
  app.properties: |
    server.port=8080
    feature.new-checkout=true
    max.retry.count=3
\`\`\`

### Three Ways to Consume ConfigMaps

Each method has different behavior, especially for hot-reloading:

\`\`\`yaml
spec:
  containers:
  - name: app
    image: myapp:v1

    # Method 1: individual env var from a specific key
    env:
    - name: APP_ENV                    # the env var name inside the container
      valueFrom:
        configMapKeyRef:
          name: app-config             # ConfigMap name
          key: APP_ENV                 # key within the ConfigMap
    - name: DB_POOL_SIZE
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: DATABASE_POOL_SIZE
          optional: false              # pod fails to start if this key doesn't exist

    # Method 2: ALL keys as env vars at once (convenient, can cause name collisions)
    envFrom:
    - configMapRef:
        name: app-config               # every key in app-config becomes an env var
      prefix: "APP_"                   # optional: prefix all keys to avoid collisions

    # Method 3: mount as files in a volume (supports hot-reload)
    volumeMounts:
    - name: nginx-config
      mountPath: /etc/nginx/conf.d/    # nginx.conf appears here as a file
    - name: app-config-vol
      mountPath: /etc/app/             # app.properties appears here as a file

  volumes:
  - name: nginx-config
    configMap:
      name: app-config
      items:                           # mount ONLY specific keys as files
      - key: nginx.conf
        path: default.conf             # the file name inside mountPath
  - name: app-config-vol
    configMap:
      name: app-config
\`\`\`

### Hot-Reloading: Volume Mounts vs Env Vars

This is a critical operational difference:

\`\`\`
Method 3 (volume mount) → kubelet syncs ConfigMap changes to mounted files every ~1 minute
  Application can use inotify/fsnotify to watch for file changes and reload config
  nginx can reload: nginx -s reload
  RESULT: Config change takes effect WITHOUT restarting the pod

Method 1 & 2 (env vars) → Values are injected at pod startup and NEVER change
  Updating the ConfigMap does NOT update env vars in running pods
  RESULT: Must restart pods for env var changes to take effect
  kubectl rollout restart deployment/<name>
\`\`\`

\`\`\`bash
# After updating a ConfigMap:
# For volume-mounted config (app watches files): no action needed
# For env var config: restart the deployment
kubectl rollout restart deployment/payments-api
\`\`\`

### Immutable ConfigMaps (Performance Optimization)

For ConfigMaps that change rarely (or never in production), mark them immutable:

\`\`\`yaml
immutable: true    # prevents any updates; kubelet stops watching it (saves API server load)
\`\`\`

At scale (1,000+ pods watching the same ConfigMap), the constant watch loop adds load on the API server. Immutable ConfigMaps opt out of this. To "update" an immutable ConfigMap, create a new one with a different name and update the pod spec to reference it — this triggers a rolling restart automatically.

## Secrets: Sensitive Data (With a Critical Warning)

Secrets look almost identical to ConfigMaps but are intended for sensitive data: passwords, API keys, TLS certificates, tokens.

\`\`\`yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
  namespace: production
type: Opaque                # Opaque = arbitrary data (most common type)
stringData:                 # K8s automatically base64-encodes these when stored
  username: myuser
  password: supersecret123
  connection-string: "postgresql://myuser:supersecret123@db.example.com:5432/app"

# Other Secret types:
# type: kubernetes.io/tls         → TLS certificate + key pair
# type: kubernetes.io/dockerconfigjson → registry credentials (imagePullSecrets)
# type: kubernetes.io/service-account-token → ServiceAccount tokens
\`\`\`

### CRITICAL: Kubernetes Secrets Are NOT Encrypted by Default

Base64 is **encoding**, not encryption. It can be trivially decoded:

\`\`\`bash
# Anyone with kubectl access can decode a Secret:
kubectl get secret db-credentials -o jsonpath='{.data.password}' | base64 -d
# Outputs: supersecret123

# Secrets are stored in etcd in base64 (not encrypted) unless you configure EncryptionConfiguration
# A backup of etcd contains all your "secrets" in plaintext
\`\`\`

**What this means in practice:**
- Anyone with \`kubectl get secrets\` RBAC permission can read all secrets
- Anyone with direct etcd access reads all secrets
- An etcd backup on S3 without encryption contains all your secrets
- Container logs that accidentally print env vars expose secrets

## Production Secret Management — Three Approaches

### Option 1: Encrypt etcd at Rest (Minimum Baseline — Self-Managed Clusters)

Configure the API server to encrypt Secrets before writing to etcd:

\`\`\`yaml
# /etc/kubernetes/encryption-config.yaml (on every control plane node)
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
- resources:
  - secrets                # encrypt Secret objects
  providers:
  - aesgcm:                # AES-GCM (preferred over aescbc — authenticated encryption)
      keys:
      - name: key1
        secret: <base64-encoded-32-byte-key>   # openssl rand -base64 32
  - identity: {}           # fallback for existing unencrypted secrets (read-only)
\`\`\`

\`\`\`bash
# After configuring: re-encrypt all existing secrets
kubectl get secrets -A -o json | kubectl replace -f -

# Verify encryption is working:
# Read a secret directly from etcd (should show encrypted bytes, not readable text)
ETCDCTL_API=3 etcdctl get /registry/secrets/production/db-credentials | hexdump -C
\`\`\`

Note: Managed Kubernetes (EKS, GKE, AKS) encrypts etcd at rest automatically using KMS.

### Option 2: Sealed Secrets — GitOps-Friendly Encrypted Secrets

Sealed Secrets (by Bitnami) lets you commit encrypted secrets to git safely:

\`\`\`bash
# Install the Sealed Secrets controller in the cluster
helm install sealed-secrets sealed-secrets/sealed-secrets -n kube-system

# Get the public key (used to encrypt):
kubeseal --fetch-cert > pub-cert.pem

# Encrypt a secret with the cluster's public key:
kubectl create secret generic db-credentials \\
  --from-literal=password=supersecret123 \\
  --dry-run=client -o yaml | \\
  kubeseal --cert pub-cert.pem --format yaml > sealed-db-credentials.yaml

# ✓ sealed-db-credentials.yaml is safe to commit to git
# The encrypted data can only be decrypted by the cluster's private key
git add sealed-db-credentials.yaml
\`\`\`

\`\`\`yaml
# The resulting sealed secret (safe to commit):
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
spec:
  encryptedData:
    password: AgBy8hCe...  # RSA-encrypted ciphertext — unreadable without the cluster's private key
\`\`\`

When applied to the cluster, the Sealed Secrets controller decrypts it and creates a regular Kubernetes Secret.

### Option 3: External Secrets Operator — Centralized Secret Management (Recommended)

ESO syncs secrets from external vaults (AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager) into Kubernetes Secrets. The source of truth is the external vault, not Kubernetes.

\`\`\`yaml
# First, create a SecretStore that tells ESO how to connect to AWS Secrets Manager:
apiVersion: external-secrets.io/v1beta1
kind: ClusterSecretStore
metadata:
  name: aws-secretsmanager
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-east-1
      auth:
        jwt:                               # use IRSA (IAM Roles for Service Accounts)
          serviceAccountRef:
            name: external-secrets-sa
---
# Now reference a secret from AWS Secrets Manager:
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-credentials
  namespace: production
spec:
  refreshInterval: 1h                    # re-sync every hour (picks up rotations)
  secretStoreRef:
    name: aws-secretsmanager
    kind: ClusterSecretStore
  target:
    name: db-credentials                 # name of the Kubernetes Secret to create
    creationPolicy: Owner                # ESO owns the K8s Secret (recreates if deleted)
  data:
  - secretKey: password                  # key in the Kubernetes Secret
    remoteRef:
      key: prod/database/credentials     # path in AWS Secrets Manager
      property: password                 # JSON key within the secret value
  - secretKey: username
    remoteRef:
      key: prod/database/credentials
      property: username
\`\`\`

**Benefits of ESO:**
- Secrets never need to be committed to git (even encrypted)
- Automatic rotation: when AWS Secrets Manager rotates the secret, ESO creates a new K8s Secret version within \`refreshInterval\`
- Audit trail: every secret access is logged in AWS CloudTrail
- Used by **Airbnb, Lyft, DoorDash** in production

\`\`\`bash
# Check ESO sync status:
kubectl get externalsecret db-credentials -n production
# NAME              STORE                  REFRESH INTERVAL  STATUS
# db-credentials    aws-secretsmanager     1h                SecretSynced
\`\`\`

## Under the Hood — How Secrets Are Delivered to Pods

When a pod references a Secret (via env vars or volume mount), the kubelet fetches the Secret from the API server and:
- For env vars: injects values at container creation time (never updates after start)
- For volume mounts: creates a tmpfs (in-memory filesystem) at the mount path. Files are stored in RAM, not on the node's disk. Updated when the Secret changes (kubelet sync period, ~1 minute).

The tmpfs approach is why Secret volume mounts are more secure than env vars — env vars appear in process listings, crash dumps, and debug output. Files in tmpfs are only accessible to the container.

## Common Mistakes

- **Base64 in ConfigMaps as "encryption"**: ConfigMaps have no encryption — base64 there is not protection, it's just encoding. Use Secrets (with encryption at rest) for sensitive data.
- **Secrets in environment variables show up in logs**: If your app logs all env vars on startup (common in Java Spring Boot), Secret values are logged. Use volume mounts for Secrets to reduce exposure surface.
- **Updating a ConfigMap with env vars and expecting live reload**: Env vars never update after pod start. You MUST restart the pod. Volume mounts reload within ~1 minute.
- **Not using External Secrets**: Committing even Sealed Secrets to git means if the cluster's private key is ever lost or compromised, all historical "sealed" secrets are decryptable. ESO keeps secrets out of git entirely.
- **Overly permissive RBAC on secrets**: \`verbs: ["get", "list", "watch"]\` on secrets lets users read ALL secrets. Narrow this with \`resourceNames: ["only-this-secret"]\` where possible.

## Production Pattern

**DoorDash** uses the External Secrets Operator with AWS Secrets Manager. Every team's secrets are scoped in AWS Secrets Manager under a path matching their team (\`prod/team-payments/db-password\`). IAM policies restrict each team's ExternalSecret to only their prefix. The ESO controller uses IRSA to authenticate to AWS. No plaintext or sealed secrets exist in git — the source of truth is AWS Secrets Manager with automatic rotation for database passwords via AWS RDS secret rotation.
`,
          interviewQuestions: [
            {
              question: "Kubernetes Secrets are not secure by default. What does that mean and how do you fix it?",
              difficulty: "senior" as const,
              answer: `**The problem**: Kubernetes stores Secret objects in etcd as base64-encoded strings. Base64 is encoding (reversible transformation), not encryption. Anyone who can:
- Run \`kubectl get secret -o yaml\` → reads the base64 value
- Access etcd directly → reads the plaintext data
- Access an etcd snapshot/backup → reads all secrets

**Layers of protection to add:**

**1. Encrypt etcd at rest** (must-have baseline)
Configure the API server with an encryption provider (AES-CBC, AES-GCM, or KMS). Then secrets in etcd are encrypted.
\`\`\`bash
# Verify encryption is active
ETCDCTL_API=3 etcdctl get /registry/secrets/default/my-secret \
  --prefix | hexdump -C
# Should see encrypted bytes, not readable text
\`\`\`

**2. RBAC**: Restrict who can \`get secrets\`. Developers shouldn't need to read production secrets.
\`\`\`yaml
rules:
- resources: ["secrets"]
  verbs: ["list"]   # can list secret names, not read values
  # NOT: ["get", "list", "watch"]
\`\`\`

**3. External secrets management** (best practice): Use AWS Secrets Manager, Vault, or GCP Secret Manager as the source of truth. Secrets Manager has audit logging, automatic rotation, and fine-grained access control. The External Secrets Operator syncs them to K8s Secrets.

**4. Audit logging**: Enable K8s audit logs for secret access. Know who read which secrets.

At companies like Stripe and Lyft, Vault is the standard: all secrets live in Vault, pods authenticate with their ServiceAccount, and the Vault agent sidecar injects secrets into the pod at runtime — secrets never touch etcd at all.`,
            },
          ],
        },
        {
          id: "persistent-storage",
          title: "Persistent Storage",
          duration: 18,
          type: "lesson",
          description: "Manage persistent data with PersistentVolumes, PVCs, and StorageClasses.",
          objectives: [
            "Explain the PV/PVC/StorageClass relationship",
            "Provision storage dynamically with StorageClasses",
            "Choose the right access mode for your use case",
            "Debug storage binding failures",
          ],
          content: `# Persistent Storage

## The PV/PVC/StorageClass Model

\`\`\`
StorageClass (gp2, gp3, efs)
    ↓ provisions
PersistentVolume (the actual disk)
    ↑ claims
PersistentVolumeClaim (what your pod requests)
    ↑ mounts
Pod
\`\`\`

**PersistentVolume (PV)**: The actual storage resource (an EBS volume, NFS share, etc.). Created by an admin or dynamically by a StorageClass.

**PersistentVolumeClaim (PVC)**: A request for storage by a pod. "I need 10Gi of ReadWriteOnce storage." Kubernetes binds it to a matching PV.

**StorageClass**: A template for dynamic PV provisioning. When a PVC references a StorageClass, K8s automatically creates a PV.

## Dynamic Provisioning with StorageClasses

\`\`\`yaml
# StorageClass (usually pre-configured on managed K8s)
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  encrypted: "true"
reclaimPolicy: Retain    # Delete | Retain | Recycle
volumeBindingMode: WaitForFirstConsumer  # wait until pod is scheduled
\`\`\`

\`\`\`yaml
# PVC requesting 20Gi from the fast-ssd class
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 20Gi
\`\`\`

\`\`\`yaml
# Pod using the PVC
spec:
  containers:
  - name: postgres
    volumeMounts:
    - name: data
      mountPath: /var/lib/postgresql/data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: postgres-data
\`\`\`

## Access Modes

| Mode | Abbreviation | Meaning | Example |
|------|-------------|---------|---------|
| ReadWriteOnce | RWO | One node reads+writes | Database, single-instance app |
| ReadOnlyMany | ROX | Many nodes read | Shared config files |
| ReadWriteMany | RWX | Many nodes read+write | Shared file storage, EFS |

**EBS volumes (gp2/gp3)**: Only RWO — one node at a time
**EFS (AWS)**: Supports RWX — multiple pods across multiple nodes can write simultaneously

**Real-world:** Uber uses StatefulSets with SSD-backed PVCs (gp3) for their trip data store. For shared ML model storage, they use EFS with RWX access so multiple inference pods can read the same model files.

## Reclaim Policy

When a PVC is deleted:
- **Delete**: The PV and underlying storage (EBS volume) are deleted. Use for ephemeral dev environments.
- **Retain**: The PV stays, data preserved. Requires manual cleanup. Use for production databases.

\`\`\`bash
# Check PVC status
kubectl get pvc
# NAME           STATUS   VOLUME    CAPACITY   ACCESS MODES   STORAGECLASS
# postgres-data  Bound    pvc-abc   20Gi       RWO            fast-ssd

# If stuck in Pending:
kubectl describe pvc postgres-data
# Common causes:
#   - No PV available matching the request
#   - StorageClass doesn't exist
#   - WaitForFirstConsumer: waiting for pod to be scheduled first
\`\`\`
`,
          interviewQuestions: [
            {
              question: "What's the difference between RWO and RWX access modes, and when does it matter?",
              difficulty: "mid" as const,
              answer: `**ReadWriteOnce (RWO)**: The volume can be mounted as read-write by a SINGLE NODE at a time. Multiple pods on the same node can use it, but if your pods are on different nodes, only one node can mount it.

**ReadWriteMany (RWX)**: The volume can be mounted as read-write by MULTIPLE NODES simultaneously.

**When it matters**: With a Deployment of 3 replicas using RWO storage, if the pods are scheduled on 3 different nodes, only the first pod that mounts the volume gets read-write access — the other two fail to start. This is why databases use StatefulSets with \`volumeClaimTemplates\` (one PVC per pod) rather than sharing one RWO PVC.

**Storage that supports RWX** (on AWS):
- **EFS (NFS)**: Supports RWX. Use for shared content — multiple pods on multiple nodes read/write the same filesystem (static assets, ML models, shared uploads)
- **EBS (gp2/gp3)**: Only RWO. Block storage physically attached to one EC2 instance at a time

**Common mistake**: Deploying a stateless app with 3 replicas, giving it an EBS PVC for shared file storage, then wondering why 2 of the 3 pods are stuck in ContainerCreating. Fix: use EFS (RWX) for shared storage, or move the storage to S3 and access it via the AWS SDK instead.`,
            },
          ],
        },
      ],
      exam: [
        {
          question: "What is the difference between mounting a ConfigMap as environment variables versus mounting it as a volume file? What are the operational implications of each?",
          answer: "When mounted as environment variables, the values are injected at pod startup and never change — updating the ConfigMap requires restarting the pod for new values to take effect. When mounted as a volume (file), Kubernetes periodically syncs ConfigMap changes to the mounted file (kubelet sync period, default ~1 minute) without restarting the pod — the application must watch the file and reload its config. Use env vars for simple key-value config that rarely changes. Use volume mounts for complex config files (NGINX config, Prometheus rules) where live reload is important.",
          difficulty: "mid",
        },
        {
          question: "Kubernetes Secrets are 'not secure by default.' What does this mean and what solutions exist for production-grade secret management?",
          answer: "By default, Secrets are stored in etcd base64-encoded (not encrypted) — anyone with etcd access or RBAC permission to `get secrets` can read them. Additionally, Secrets appear in pod specs, environment variables, and audit logs. Solutions: 1) Enable etcd encryption at rest (EncryptionConfiguration) — encrypts Secret data before writing to etcd. 2) Sealed Secrets (Bitnami) — encrypts Secrets with a cluster-side key so encrypted form is safe to commit to git. 3) External Secrets Operator — syncs secrets from AWS Secrets Manager, HashiCorp Vault, or GCP Secret Manager into Kubernetes Secrets. 4) Use CSI Secret Store driver to mount secrets directly from Vault without creating a Kubernetes Secret at all.",
          difficulty: "mid",
        },
        {
          question: "A pod is failing because it cannot find an environment variable that should come from a Secret. How do you debug this?",
          answer: "1) Check if the Secret exists: `kubectl get secret <name> -n <namespace>`. 2) Verify the Secret has the expected key: `kubectl describe secret <name>` (shows keys, not values). 3) Check the pod spec references the correct Secret name and key: `kubectl describe pod <pod>` — look for `envFrom` or `env[].valueFrom.secretKeyRef`. 4) If the Secret exists but the pod fails to start with 'secret not found', the pod was created before the Secret — restart the pod. 5) Check RBAC — if using a service account that cannot read Secrets, the kubelet may fail to inject them. 6) Decode and verify the value: `kubectl get secret <name> -o jsonpath='{.data.<key>}' | base64 -d`.",
          difficulty: "junior",
        },
        {
          question: "What is the difference between a PersistentVolume (PV) and a PersistentVolumeClaim (PVC)? How does dynamic provisioning work?",
          answer: "A PV is a cluster-level resource representing a piece of actual storage (an EBS volume, NFS share, etc.) — created by an admin or dynamically. A PVC is a namespace-level resource — a request for storage by a pod, specifying size, access mode, and StorageClass. Kubernetes binds a PVC to a matching PV. Dynamic provisioning: when a PVC references a StorageClass, the StorageClass's provisioner (e.g., EBS CSI driver) automatically creates a PV and the underlying cloud storage, then binds them — no manual PV creation needed. This is the standard pattern in cloud environments. The PVC remains even if the pod is deleted; the PV (and cloud storage) remains until the PVC is deleted, depending on the `reclaimPolicy` (Delete vs Retain).",
          difficulty: "mid",
        },
        {
          question: "Three application pods all need to read from the same shared filesystem. You are on AWS. What PVC access mode and storage class do you use and why?",
          answer: "Use `ReadWriteMany` (RWX) access mode with an EFS-backed StorageClass (using the AWS EFS CSI driver). EBS volumes only support ReadWriteOnce (one node at a time) — they cannot be mounted on multiple nodes simultaneously, so multiple pods on different nodes would fail to mount the EBS PVC. EFS is a managed NFS service that supports concurrent mounts from multiple nodes and pods. Configure the StorageClass with `provisioner: efs.csi.aws.com`, create a PVC with `accessModes: [ReadWriteMany]`, and all three pods reference the same PVC in their volumes.",
          difficulty: "mid",
        },
        {
          question: "What happens to a PersistentVolumeClaim and its data when a pod using it is deleted? When a StatefulSet is scaled to zero?",
          answer: "When a pod is deleted, the PVC and its data are not deleted — PVCs are independent resources with their own lifecycle. The pod simply loses its mount. If another pod references the same PVC, it can mount it and access the same data. When a StatefulSet is scaled to zero, all pods are deleted but the `volumeClaimTemplates` PVCs remain — they are not garbage collected by the StatefulSet controller. This is intentional data safety. To delete the PVCs, you must do so manually (`kubectl delete pvc`). The underlying PV reclaim behavior then depends on the `reclaimPolicy`: `Delete` removes the cloud storage, `Retain` keeps it for manual recovery.",
          difficulty: "mid",
        },
        {
          question: "A StatefulSet pod `db-2` is in a crash loop and you need to inspect its data volume. How do you access the data without the application running?",
          answer: "1) Identify the PVC bound to `db-2`: `kubectl get pvc -l statefulset.kubernetes.io/pod-name=db-2` or by naming convention (volumeClaimTemplate name + pod name). 2) Create a temporary pod that mounts the same PVC: write a Pod manifest using the PVC name, with a simple image (busybox or ubuntu), and `command: ['sleep', '3600']`. Apply it with `kubectl apply -f debug-pod.yaml`. 3) `kubectl exec -it debug-pod -- sh` to explore the volume data. 4) After debugging, delete the debug pod. Note: ensure the StatefulSet pod is not running simultaneously if the PVC is ReadWriteOnce.",
          difficulty: "senior",
        },
        {
          question: "What is a StorageClass in Kubernetes and how does it affect PVC provisioning and performance?",
          answer: "A StorageClass defines the type of storage to provision — it references a provisioner (driver) and parameters like disk type, IOPS, and reclaim policy. When a PVC specifies a StorageClass, the associated provisioner dynamically creates a PV with the specified characteristics. Examples on AWS: `gp3` StorageClass using the EBS CSI driver provisions general-purpose SSD volumes; a `io2` StorageClass provisions high-IOPS provisioned IOPS SSD for database workloads. StorageClass also controls `reclaimPolicy` (Delete or Retain) and `allowVolumeExpansion`. Without a StorageClass reference, a PVC uses the default StorageClass in the cluster.",
          difficulty: "mid",
        },
        {
          question: "How do you update a ConfigMap value and propagate the change to running pods with minimal disruption?",
          answer: "Edit the ConfigMap: `kubectl edit configmap <name>` or `kubectl apply -f updated-configmap.yaml`. If pods mount the ConfigMap as a volume, the kubelet syncs the updated file to the pod within ~1 minute (no pod restart needed, but the app must re-read the file). If pods consume the ConfigMap as environment variables, the new values are NOT reflected until the pod restarts — perform a rolling restart: `kubectl rollout restart deployment/<name>`. Note: for critical config changes, always validate the new config before applying, and use an immutable ConfigMap + update the reference in the Deployment to trigger a controlled rollout.",
          difficulty: "mid",
        },
        {
          question: "A developer accidentally deleted a Secret that a production Deployment depends on. The pods are now crash-looping. What is your recovery plan?",
          answer: "Immediate mitigation: 1) Scale the Deployment to 0 to stop crash-loop noise and prevent further restarts burning resources: `kubectl scale deployment/<name> --replicas=0`. 2) Recreate the Secret from your source of truth — a secrets manager (AWS Secrets Manager, Vault), a Sealed Secret in git, or a backup. Never store plaintext secrets in git. 3) Restore: `kubectl apply -f secret.yaml` or use External Secrets Operator to re-sync. 4) Scale the Deployment back up: `kubectl scale deployment/<name> --replicas=3`. Prevention: enable Kubernetes RBAC to restrict who can delete Secrets, use External Secrets Operator so Secrets are auto-reconciled from the source of truth, and consider Velero for etcd-level backup of all cluster resources.",
          difficulty: "senior",
        },
      ],
    },
    {
      id: "kubernetes-operations",
      title: "Operations & Helm",
      level: "advanced",
      description: "Master kubectl for debugging and Helm for package management.",
      lessons: [
        {
          id: "kubectl-mastery",
          title: "kubectl Mastery",
          duration: 20,
          type: "lesson",
          description: "Essential kubectl commands for production Kubernetes operations.",
          objectives: [
            "Use kubectl get, describe, logs, exec efficiently",
            "Debug pods with port-forward and temporary debug containers",
            "Query resources with JSONPath and custom columns",
            "Use kubectx and kubens for multi-cluster management",
          ],
          content: `# kubectl Mastery

## Essential Commands

\`\`\`bash
# Get resources — most common
kubectl get pods                        # default namespace
kubectl get pods -n production          # specific namespace
kubectl get pods -A                     # all namespaces
kubectl get pods -o wide                # show node, IP
kubectl get pods -l app=nginx           # filter by label
kubectl get pods --sort-by=.status.startTime

# Describe — full details including events
kubectl describe pod my-pod
kubectl describe node my-node           # node conditions, capacity
kubectl describe service my-service     # endpoints, selectors

# Logs
kubectl logs my-pod                     # stdout
kubectl logs my-pod -c sidecar          # specific container
kubectl logs my-pod --previous          # previous crash
kubectl logs my-pod -f                  # follow/stream
kubectl logs -l app=nginx               # all pods matching label
kubectl logs my-pod --tail=100          # last 100 lines
kubectl logs my-pod --since=1h          # last 1 hour
\`\`\`

## Debugging Commands

\`\`\`bash
# Execute commands in a running pod
kubectl exec -it my-pod -- bash
kubectl exec -it my-pod -c sidecar -- sh
kubectl exec my-pod -- env | grep DB

# Port forward to local machine (bypasses service, connects directly to pod)
kubectl port-forward pod/my-pod 8080:8080
kubectl port-forward service/my-service 8080:80
# Then: curl localhost:8080

# Copy files
kubectl cp my-pod:/var/log/app.log ./app.log
kubectl cp ./config.yaml my-pod:/etc/config/

# Resource usage
kubectl top pods                        # requires metrics-server
kubectl top pods --sort-by=memory
kubectl top nodes

# Events (great for debugging scheduling issues)
kubectl get events --sort-by=.lastTimestamp
kubectl get events -n production --field-selector reason=OOMKilling
\`\`\`

## Advanced Querying

\`\`\`bash
# JSONPath — extract specific fields
kubectl get pod my-pod -o jsonpath='{.status.podIP}'
kubectl get pods -o jsonpath='{.items[*].metadata.name}'
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.conditions[-1].type}{"\n"}{end}'

# Custom columns
kubectl get pods -o custom-columns='NAME:.metadata.name,STATUS:.status.phase,NODE:.spec.nodeName'

# Get all images running in the cluster
kubectl get pods -A -o jsonpath='{range .items[*]}{.spec.containers[*].image}{"\n"}{end}' | sort -u

# Find pods that are not Running
kubectl get pods -A --field-selector=status.phase!=Running
\`\`\`

## Multi-Cluster Management

\`\`\`bash
# Built-in context management
kubectl config get-contexts             # list all clusters
kubectl config use-context prod-cluster # switch cluster
kubectl config current-context

# kubectx + kubens (much faster)
brew install kubectx    # installs both kubectx and kubens

kubectx                 # list contexts
kubectx prod            # switch to prod context
kubectx -               # switch to previous context

kubens                  # list namespaces
kubens production       # switch default namespace
\`\`\`

## The Debugging Workflow

\`\`\`bash
# Pod not starting?
kubectl get pod my-pod                        # check STATUS, READY, RESTARTS
kubectl describe pod my-pod                   # check Events section
kubectl logs my-pod --previous                # if CrashLoopBackOff

# Service not reachable?
kubectl get endpoints my-service              # check pod IPs listed
kubectl exec -it debug-pod -- curl my-service # test from inside cluster

# Node issue?
kubectl describe node my-node                 # check conditions, pressure
kubectl get events --field-selector involvedObject.name=my-node

# Resource constraints?
kubectl describe pod my-pod | grep -A5 Requests
kubectl top pod my-pod
\`\`\`
`,
          interviewQuestions: [
            {
              question: "How do you debug a pod that's running but your application isn't responding?",
              difficulty: "mid" as const,
              answer: `**Step 1: Check pod health indicators**
\`\`\`bash
kubectl get pod my-pod
# Check READY column: 0/1 means readiness probe failing
# Check RESTARTS: high number = repeatedly crashing
\`\`\`

**Step 2: Check application logs**
\`\`\`bash
kubectl logs my-pod
kubectl logs my-pod --previous  # if restarting
\`\`\`

**Step 3: Test the application directly (bypass service routing)**
\`\`\`bash
kubectl port-forward pod/my-pod 8080:8080
curl localhost:8080/health
\`\`\`

**Step 4: Exec into the pod and test locally**
\`\`\`bash
kubectl exec -it my-pod -- bash
curl localhost:8080/health    # from inside the container
env | grep -E "DB|API|SECRET"  # check env vars
cat /etc/config/app.yaml       # check mounted configs
\`\`\`

**Step 5: Check for resource pressure**
\`\`\`bash
kubectl top pod my-pod          # current CPU/memory usage
kubectl describe pod my-pod | grep -A10 "Limits\|Requests"
# OOMKilled? Increase memory limits
# CPU throttled? Increase CPU limits
\`\`\`

**Step 6: Check service and network**
\`\`\`bash
kubectl get endpoints my-service   # is this pod's IP in the list?
kubectl describe service my-service  # selector matches pod labels?
\`\`\``,
            },
            {
              question: "How do you quickly check what's happening across all namespaces in a cluster?",
              difficulty: "junior" as const,
              answer: `\`\`\`bash
# Get all non-running pods across the cluster
kubectl get pods -A --field-selector=status.phase!=Running

# Get recent events across all namespaces (sorted by time)
kubectl get events -A --sort-by=.lastTimestamp | tail -20

# Get all pods with their nodes (spot scheduling issues)
kubectl get pods -A -o wide

# Check node status
kubectl get nodes
# Look for: NotReady, SchedulingDisabled

# Quick health overview
kubectl get pods -A | grep -v Running | grep -v Completed

# Check resource usage
kubectl top nodes
kubectl top pods -A --sort-by=memory | head -20
\`\`\`

For regular operations, I also recommend:
- **k9s**: Terminal UI for Kubernetes — real-time view of all resources, logs, and events. Much faster than kubectl for exploration.
- **Lens**: Desktop GUI for multi-cluster management.

In an incident: first \`kubectl get events -A --sort-by=.lastTimestamp | tail -30\` to see what's been happening recently — this usually surfaces the root cause faster than checking individual pods.`,
            },
          ],
        },
        {
          id: "helm-package-manager",
          title: "Helm Package Manager",
          duration: 20,
          type: "lesson",
          description: "Package, version, and deploy Kubernetes applications with Helm.",
          objectives: [
            "Understand Helm charts, values, and releases",
            "Install, upgrade, and rollback Helm releases",
            "Override values for different environments",
            "Find and use community Helm charts",
          ],
          content: `# Helm Package Manager

## What is Helm?

Helm is the package manager for Kubernetes — like apt for Ubuntu or brew for macOS. It lets you:
- **Package** Kubernetes manifests into a reusable chart
- **Version** your deployments
- **Template** manifests with environment-specific values
- **Share** charts (Bitnami publishes 100+ production-ready charts)

**Real-world scale**: Bitnami Helm charts are downloaded 10M+ times per month. Fortune 500 companies use Bitnami's PostgreSQL, Redis, Kafka charts rather than writing their own Kubernetes manifests.

## Helm Concepts

\`\`\`
Chart
├── Chart.yaml          # chart metadata (name, version, description)
├── values.yaml         # default values (overridable)
├── templates/          # Kubernetes manifest templates
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── _helpers.tpl    # reusable template snippets
└── charts/             # chart dependencies
\`\`\`

A **Release** is a deployed instance of a chart. You can deploy the same chart multiple times with different names and values (dev-nginx, staging-nginx, prod-nginx).

## Essential Helm Commands

\`\`\`bash
# Add a chart repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search for charts
helm search repo postgres
helm search hub nginx           # search Artifact Hub (public charts)

# Install a chart
helm install my-postgres bitnami/postgresql \
  --namespace production \
  --set auth.postgresPassword=secret123 \
  --set primary.persistence.size=50Gi

# Install with a values file (better for production)
helm install my-postgres bitnami/postgresql \
  -f postgres-values-prod.yaml \
  --namespace production

# List releases
helm list -A

# Check release status
helm status my-postgres -n production

# Upgrade a release
helm upgrade my-postgres bitnami/postgresql \
  -f postgres-values-prod.yaml \
  --namespace production

# Upgrade with atomic (rollback on failure)
helm upgrade my-postgres bitnami/postgresql \
  -f postgres-values-prod.yaml \
  --atomic \
  --timeout 5m

# Rollback
helm rollback my-postgres 1    # rollback to revision 1
helm history my-postgres       # show revision history

# Uninstall
helm uninstall my-postgres -n production

# Dry run (see what will be applied)
helm upgrade my-postgres bitnami/postgresql \
  -f postgres-values-prod.yaml \
  --dry-run
\`\`\`

## values.yaml: Environment Configuration

\`\`\`yaml
# values-prod.yaml — production overrides
replicaCount: 3

image:
  repository: mycompany/payments
  tag: "v2.1.0"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: nginx
  hosts:
  - host: api.mycompany.com
    paths:
    - path: /
      pathType: Prefix
  tls:
  - secretName: api-tls
    hosts:
    - api.mycompany.com

resources:
  requests:
    memory: "256Mi"
    cpu: "100m"
  limits:
    memory: "512Mi"
    cpu: "500m"

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 20
  targetCPUUtilizationPercentage: 70
\`\`\`

\`\`\`bash
# Apply different configs for dev vs prod
helm upgrade payments ./payments-chart -f values-prod.yaml
helm upgrade payments-dev ./payments-chart -f values-dev.yaml
\`\`\`

## Template Syntax

\`\`\`yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-app
  labels:
    app: {{ .Chart.Name }}
    version: {{ .Chart.Version }}
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        {{- if .Values.resources }}
        resources:
          {{- toYaml .Values.resources | nindent 10 }}
        {{- end }}
\`\`\`
`,
          interviewQuestions: [
            {
              question: "What's the difference between helm install and helm upgrade --install?",
              difficulty: "junior" as const,
              answer: `**helm install**: Creates a new release. Fails if the release already exists.

**helm upgrade --install**: Installs if the release doesn't exist, upgrades if it does. This is idempotent and the pattern used in CI/CD pipelines — you don't need to check whether it's a first deploy or an update.

\`\`\`bash
# CI/CD pipeline — works for both first deploy and updates:
helm upgrade --install payments ./payments-chart \
  -f values-prod.yaml \
  --namespace production \
  --create-namespace \   # create namespace if it doesn't exist
  --atomic \             # roll back if deployment fails
  --timeout 5m \
  --wait                 # wait for all pods to be ready
\`\`\`

**--atomic**: If the upgrade fails (pods fail to become ready), automatically rolls back to the previous release. Essential for production CD pipelines.

**--wait**: Blocks until all Deployments, StatefulSets have their desired pod count ready. Without this, the pipeline thinks the deploy succeeded even if pods are still starting.`,
            },
            {
              question: "How do you manage secrets with Helm? You can't commit passwords to values.yaml.",
              difficulty: "senior" as const,
              answer: `Several approaches, in order of preference:

**1. Helm + External Secrets Operator (best for production)**
Don't put secrets in Helm values at all. Use External Secrets to sync from AWS Secrets Manager:
\`\`\`yaml
# In your chart's templates/external-secret.yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
spec:
  secretStoreRef:
    name: aws-secretsmanager
  target:
    name: {{ .Release.Name }}-db-secret
  data:
  - secretKey: password
    remoteRef:
      key: "{{ .Values.secretsManager.path }}"
\`\`\`

**2. helm-secrets plugin (git-friendly)**
Encrypts values files using SOPS + KMS/age:
\`\`\`bash
helm secrets enc secrets-prod.yaml   # encrypt
helm upgrade payments ./chart \
  -f values-prod.yaml \
  -f secrets://secrets-prod.yaml    # helm-secrets decrypts on the fly
\`\`\`

**3. CI/CD --set flag (simple but less auditable)**
\`\`\`bash
helm upgrade payments ./chart \
  -f values-prod.yaml \
  --set database.password=\${DB_PASSWORD}  # injected from CI secret store
\`\`\`

**What NOT to do**: Never put plaintext passwords in values.yaml and commit to git. This is one of the most common secret leak vectors — git history is forever.`,
            },
          ],
        },
      ],
      exam: [
        {
          question: "A pod is in `CrashLoopBackOff` state. What kubectl commands do you run to diagnose it and in what order?",
          answer: "1) `kubectl get pod <name> -n <namespace>` — confirm the state and see restart count. 2) `kubectl describe pod <name> -n <namespace>` — check Events for OOMKilled, failed probes, image pull errors, or volume mount failures. 3) `kubectl logs <name> -n <namespace> --previous` — view logs from the last crashed container (the current container may have no logs if it crashes immediately). 4) If the container exits too fast to exec into, temporarily override the command: `kubectl debug <pod> -it --copy-to=debug-pod --container=<name> -- sh` to get a shell. 5) Check resource usage: `kubectl top pod <name>` — if OOMKilled appears in describe, increase the memory limit.",
          difficulty: "junior",
        },
        {
          question: "How do you use `kubectl port-forward` and when is it the right debugging tool? What are its limitations in production?",
          answer: "`kubectl port-forward pod/<name> <local-port>:<pod-port>` or `kubectl port-forward svc/<name> <local-port>:<svc-port>` tunnels traffic from your local machine to the pod/service through the API server. It is ideal for debugging — accessing a database, internal API, or metrics endpoint that has no external exposure, without modifying any Service type. Limitations: it is a temporary tunnel that terminates when the kubectl process ends; it uses the apiserver as a proxy (adds latency); it is not suitable for persistent connections or production traffic; only one user at a time per forwarded port. Never use port-forward as a production networking solution.",
          difficulty: "junior",
        },
        {
          question: "You need to run a debugging container alongside a running pod that has no shell. How do you do this with modern kubectl?",
          answer: "Use `kubectl debug -it <pod-name> --image=busybox --target=<container-name>` (ephemeral containers, available since Kubernetes 1.23 stable). This injects a temporary container into the running pod's namespace, sharing its process namespace (with `--target`) so you can inspect the main process, filesystem, and network without modifying the original pod spec. Alternatively, `kubectl debug <pod-name> --copy-to=debug-pod --image=ubuntu` creates a copy of the pod with your debug image substituted — useful when the cluster does not allow ephemeral containers. After debugging, delete the debug pod with `kubectl delete pod debug-pod`.",
          difficulty: "mid",
        },
        {
          question: "What does `kubectl rollout history deployment/<name>` show and how do you roll back to a specific previous version?",
          answer: "`kubectl rollout history deployment/<name>` lists the revision history of the Deployment, showing revision number and the change-cause annotation if set. By default only 10 revisions are kept (configurable via `revisionHistoryLimit`). To roll back to the previous version: `kubectl rollout undo deployment/<name>`. To roll back to a specific revision: `kubectl rollout undo deployment/<name> --to-revision=3`. To see what changed in a specific revision: `kubectl rollout history deployment/<name> --revision=3`. Always set `--record` (deprecated) or use the `kubernetes.io/change-cause` annotation to document what each revision was for.",
          difficulty: "junior",
        },
        {
          question: "What is Helm and how does it improve on applying raw Kubernetes YAML manifests?",
          answer: "Helm is a package manager for Kubernetes. It bundles related Kubernetes manifests into a Chart — a directory of templates plus a values.yaml file. Benefits over raw YAML: 1) Templating — reuse the same chart with different values per environment (dev vs prod), avoiding copy-paste duplication. 2) Release management — Helm tracks what was deployed (release history), enabling atomic upgrades and `helm rollback`. 3) Dependency management — Charts can declare dependencies on other Charts (e.g., a PostgreSQL subchart). 4) Single install command — `helm install my-app ./chart -f prod-values.yaml` applies all resources atomically. 5) Ecosystem — thousands of community Charts on Artifact Hub for databases, monitoring, ingress controllers, etc.",
          difficulty: "junior",
        },
        {
          question: "Explain the `helm upgrade --install` pattern. Why do teams use it in CI/CD pipelines instead of separate `helm install` and `helm upgrade`?",
          answer: "`helm upgrade --install <release> <chart>` installs the release if it does not exist, or upgrades it if it does — a single idempotent command. In CI/CD pipelines this is preferred because the pipeline does not need to check whether a release already exists, avoiding race conditions or failures when the release was manually deleted. It is safe to run on every push. Additional useful flags: `--atomic` (rollback automatically if the upgrade fails), `--wait` (wait for all pods to be Ready before reporting success), `--timeout` (maximum wait time), `--set image.tag=${GIT_SHA}` (inject the image tag from CI).",
          difficulty: "mid",
        },
        {
          question: "How do you find which pod is consuming the most memory in a namespace?",
          answer: "Use `kubectl top pods -n <namespace> --sort-by=memory` — this returns pods sorted by memory usage in descending order. You can also add `--containers` flag to break down usage per container within each pod. For cluster-wide: `kubectl top pods -A --sort-by=memory`. Note: `kubectl top` requires metrics-server to be installed in the cluster. If metrics-server is not available, use Prometheus with `container_memory_working_set_bytes` metric or check node-level usage with `kubectl top nodes`.",
          difficulty: "junior",
        },
        {
          question: "You need to check all Kubernetes events in a namespace sorted by time to understand what happened during a recent incident. How do you do this?",
          answer: "`kubectl get events -n <namespace> --sort-by='.lastTimestamp'` shows all events sorted chronologically. For a specific resource: `kubectl describe pod <name>` shows that resource's events inline. Events older than 1 hour are typically deleted by the event TTL. For production incident investigation, use `kubectl get events -n <namespace> -o json` piped through jq for filtering, or use a logging/monitoring stack (Datadog, Prometheus + Alertmanager) that scrapes and retains events long-term. Events are a critical first stop — they show scheduling failures, image pull errors, OOMKills, probe failures, and controller actions.",
          difficulty: "mid",
        },
        {
          question: "What is the difference between `helm install`, `helm template`, and `helm lint`? When do you use each in a CI pipeline?",
          answer: "`helm lint ./chart` validates the chart structure and template syntax without connecting to a cluster — use this in CI on every PR to catch template errors early. `helm template ./chart -f values.yaml` renders the templates locally and prints the resulting YAML without installing anything — use this to inspect what would be deployed, pipe into `kubectl apply --dry-run=server`, or pass to conftest/OPA for policy validation. `helm install`/`helm upgrade --install` actually deploys to the cluster. A typical CI pipeline runs: lint → template (+ policy check) → upgrade --install (against a test cluster) → test (`helm test`) → promote to production.",
          difficulty: "mid",
        },
        {
          question: "A Helm upgrade failed halfway through. Some resources were updated, some were not. How do you recover?",
          answer: "1) Check the release status: `helm status <release>` — if it shows `failed`, the release is in a broken state. 2) View what went wrong: `helm history <release>` — find the failed revision and `helm status <release> --revision=<n>`. 3) Roll back to the last known-good revision: `helm rollback <release> <previous-revision>`. Helm recreates/patches resources to match the previous state. 4) If `--atomic` was used, Helm automatically rolled back on failure. 5) If rollback also fails (e.g., due to immutable field changes), you may need to manually delete conflicting resources and re-run. To prevent partial failures, always use `--atomic` and `--wait` in production upgrades.",
          difficulty: "senior",
        },
      ],
    },
    {
      id: "production-kubernetes",
      title: "Production Kubernetes",
      level: "advanced",
      description: "Autoscaling, security hardening, and GitOps with ArgoCD.",
      lessons: [
        {
          id: "autoscaling",
          title: "Autoscaling Strategies",
          duration: 22,
          type: "lesson",
          description: "Scale pods and nodes automatically based on demand.",
          objectives: [
            "Configure HPA for CPU and custom metrics",
            "Understand VPA for right-sizing resource requests",
            "Use KEDA for event-driven autoscaling",
            "Configure Cluster Autoscaler for node scaling",
          ],
          content: `# Autoscaling Strategies

## The Four Scaling Dimensions

\`\`\`
┌─────────────────────────────────────────────────┐
│  Cluster Autoscaler → Add/Remove Nodes          │
│    ┌────────────────────────────────────┐        │
│    │  HPA → Scale Pod Replicas          │        │
│    │    ┌──────────────────────────┐    │        │
│    │    │  VPA → Resize Pod CPU/  │    │        │
│    │    │        Memory Requests  │    │        │
│    │    └──────────────────────────┘    │        │
│    └────────────────────────────────────┘        │
│  KEDA → Scale to Zero / Event-Driven            │
└─────────────────────────────────────────────────┘
\`\`\`

## HPA: Horizontal Pod Autoscaler

HPA scales replicas based on CPU, memory, or custom metrics.

\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: payments-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: payments-api
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70    # scale when avg CPU > 70%
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60     # wait 60s before scaling up again
      policies:
      - type: Percent
        value: 100                        # max double the replicas at once
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300    # wait 5min before scaling down
      policies:
      - type: Pods
        value: 1                          # remove max 1 pod per 60s
        periodSeconds: 60
\`\`\`

\`\`\`bash
kubectl get hpa                           # current state
kubectl describe hpa payments-api-hpa     # see scaling events
\`\`\`

**Critical prerequisite**: HPA requires metrics-server to be installed. Without it, HPA shows "unknown" for current metrics and won't scale.

\`\`\`bash
# Install metrics-server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
\`\`\`

## VPA: Vertical Pod Autoscaler

VPA analyzes historical CPU/memory usage and recommends (or automatically applies) better resource requests.

\`\`\`yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: payments-api-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: payments-api
  updatePolicy:
    updateMode: "Off"    # Off (recommend only), Initial, Auto
\`\`\`

\`\`\`bash
# See recommendations without changing anything
kubectl describe vpa payments-api-vpa
# Output shows:
#   Lower bound: requests you can safely reduce to
#   Target: recommended requests
#   Upper bound: maximum you might need
\`\`\`

**Don't use HPA and VPA together** on the same CPU/memory metrics — they conflict. Use VPA to right-size requests, then HPA for replica count.

## KEDA: Event-Driven Autoscaling

KEDA extends HPA to scale on external events — SQS queue depth, Kafka lag, HTTP request rate, cron schedules.

\`\`\`yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: order-processor
spec:
  scaleTargetRef:
    name: order-processor
  minReplicaCount: 0    # scale to ZERO when no messages
  maxReplicaCount: 100
  triggers:
  - type: aws-sqs-queue
    metadata:
      queueURL: https://sqs.us-east-1.amazonaws.com/123456789/orders
      queueLength: "10"    # 1 pod per 10 messages in queue
      awsRegion: us-east-1
\`\`\`

**Scale to zero**: KEDA can scale deployments to 0 replicas when idle. No messages in queue → 0 pods (save cost). First message arrives → KEDA scales to 1+ pod. This is how serverless-style workloads run on Kubernetes.

## Cluster Autoscaler

Adds nodes when pods are Pending due to insufficient resources. Removes nodes when they're underutilized (< 50% for 10 minutes).

\`\`\`bash
# On EKS, deploy the Cluster Autoscaler
helm repo add autoscaler https://kubernetes.github.io/autoscaler
helm install cluster-autoscaler autoscaler/cluster-autoscaler \
  --set autoDiscovery.clusterName=my-cluster \
  --set awsRegion=us-east-1

# Check CA logs to see scaling decisions
kubectl logs -n kube-system -l app=cluster-autoscaler -f
\`\`\`
`,
          interviewQuestions: [
            {
              question: "Your HPA is set up but pods aren't scaling despite high CPU. What do you check?",
              difficulty: "mid" as const,
              answer: `**Step 1: Check HPA status**
\`\`\`bash
kubectl describe hpa my-hpa
# Look for:
#   Conditions: ScalingActive False → metrics not available
#   Current replicas vs desired replicas
#   Last scale event
\`\`\`

**Step 2: Check if metrics-server is running**
\`\`\`bash
kubectl get pods -n kube-system | grep metrics-server
kubectl top pods    # if this fails, metrics-server is down
\`\`\`

**Step 3: Check if resource requests are set**
HPA calculates utilization as \`actual_usage / requested_amount\`. If requests are not set, HPA can't calculate a percentage.
\`\`\`bash
kubectl describe pod my-pod | grep -A5 Requests
# If empty → set resource requests in the Deployment
\`\`\`

**Step 4: Check stabilization window**
HPA has a 5-minute scale-down stabilization window by default. For scale-up, check the behavior configuration.

**Step 5: Check maxReplicas**
Already at maxReplicas? Add more nodes (Cluster Autoscaler) or increase maxReplicas.

**Step 6: Check scaleTargetRef**
The HPA must reference the exact deployment name. A typo means it's watching a non-existent deployment.

Most common cause: **resource requests not set** — HPA shows "unknown/70%" for current metrics.`,
            },
            {
              question: "What's the difference between HPA and KEDA?",
              difficulty: "mid" as const,
              answer: `**HPA (Horizontal Pod Autoscaler)**:
- Native Kubernetes feature
- Scales on: CPU utilization, memory utilization, custom metrics via metrics-server/Prometheus adapter
- Minimum replicas: 1 (can't scale to zero)
- Works well for: web servers, APIs where CPU/memory is the bottleneck

**KEDA (Kubernetes Event-Driven Autoscaling)**:
- External operator that extends/replaces HPA
- Scales on: 60+ event sources — SQS queue depth, Kafka consumer lag, Redis list length, HTTP requests/second, Azure Service Bus, cron schedules
- Minimum replicas: **0** — can completely scale down to zero pods
- Works well for: batch processors, queue workers, scheduled jobs

**Example where KEDA shines**: You have an order processing service that reads from an SQS queue. At midnight, no orders → 0 pods running (no cost). At noon on Black Friday, 10,000 messages → KEDA scales to 100 pods.

With HPA, you'd need at least 1 pod always running (watching the queue), and CPU might not correlate with queue depth at all (the worker might be idle while the queue grows).

Many teams use both: KEDA for event-driven workloads, HPA for request-serving APIs.`,
            },
          ],
        },
        {
          id: "kubernetes-security",
          title: "Security: RBAC & Pod Security",
          duration: 22,
          type: "lesson",
          description: "Secure your Kubernetes cluster with RBAC, Pod Security Standards, and policy enforcement.",
          objectives: [
            "Design RBAC roles for least-privilege access",
            "Apply Pod Security Standards to prevent privilege escalation",
            "Integrate Vault for dynamic secret management",
            "Implement admission control with OPA/Kyverno",
          ],
          content: `# Kubernetes Security

## RBAC: Role-Based Access Control

Kubernetes RBAC controls who can do what. The model:

\`\`\`
User/ServiceAccount → RoleBinding/ClusterRoleBinding → Role/ClusterRole → Permissions
\`\`\`

**Role** (namespace-scoped) vs **ClusterRole** (cluster-wide):

\`\`\`yaml
# Role: developer can view pods and logs in production namespace
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: developer-read
  namespace: production
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch"]
---
# RoleBinding: attach role to a user
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: alice-developer
  namespace: production
subjects:
- kind: User
  name: alice@mycompany.com
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: developer-read
  apiGroup: rbac.authorization.k8s.io
\`\`\`

\`\`\`bash
# Check what a user can do
kubectl auth can-i get pods --as=alice@mycompany.com -n production
kubectl auth can-i delete pods --as=alice@mycompany.com -n production
# Output: yes / no

# See all permissions for a service account
kubectl auth can-i --list --as=system:serviceaccount:production:payments-sa
\`\`\`

## ServiceAccounts for Pod Identity

Pods use ServiceAccounts to authenticate to the K8s API (and via IRSA, to AWS).

\`\`\`yaml
# Create a dedicated service account for payments
apiVersion: v1
kind: ServiceAccount
metadata:
  name: payments-sa
  namespace: production
  annotations:
    # IRSA: this SA can assume the AWS IAM role
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789:role/payments-role
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: payments-role
  namespace: production
rules:
- apiGroups: [""]
  resources: ["secrets"]
  resourceNames: ["payments-db-secret"]  # only THIS secret
  verbs: ["get"]
---
# Assign SA to the deployment
spec:
  serviceAccountName: payments-sa
\`\`\`

## Pod Security Standards

Kubernetes has three built-in security profiles:

| Standard | Description | Blocks |
|----------|-------------|--------|
| **Privileged** | No restrictions | Nothing |
| **Baseline** | Minimal restrictions | Privileged containers, hostNetwork, hostPID |
| **Restricted** | Heavily restricted | + must run as non-root, no privilege escalation |

\`\`\`yaml
# Apply to a namespace
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/audit: restricted
\`\`\`

\`\`\`yaml
# Pod that passes restricted standard
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
  containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]
\`\`\`

## Admission Control with Kyverno

Kyverno lets you write policies as Kubernetes resources:

\`\`\`yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-resource-limits
spec:
  rules:
  - name: check-container-resources
    match:
      resources:
        kinds: ["Pod"]
    validate:
      message: "Resource limits are required"
      pattern:
        spec:
          containers:
          - resources:
              limits:
                memory: "?*"
                cpu: "?*"
\`\`\`
`,
          interviewQuestions: [
            {
              question: "A pod keeps getting OOMKilled in production. Walk me through the debugging and fix.",
              difficulty: "mid" as const,
              answer: `OOMKilled means the container exceeded its memory limit — the kernel killed it.

**Step 1: Confirm OOMKilled**
\`\`\`bash
kubectl describe pod my-pod
# Last State: Terminated
#   Reason: OOMKilled
#   Exit Code: 137   ← 128 + 9 (SIGKILL)
\`\`\`

**Step 2: Check current limits and actual usage**
\`\`\`bash
kubectl describe pod my-pod | grep -A10 "Limits\|Requests"
kubectl top pod my-pod   # current memory usage
\`\`\`

**Step 3: Check historical usage (if you have Prometheus)**
\`\`\`
container_memory_working_set_bytes{pod=~"my-pod.*"}
\`\`\`

**Step 4: Determine root cause**
- **Legitimate growth**: App needs more memory → increase limit
- **Memory leak**: Memory grows until OOM → fix the leak (profile with pprof/heap dump)
- **Limit too aggressive**: Was set too low without profiling → use VPA recommendations

**Step 5: Fix**
\`\`\`yaml
resources:
  requests:
    memory: "256Mi"    # what the scheduler uses for placement
  limits:
    memory: "1Gi"      # increase from 512Mi if OOMKilled at 512Mi
\`\`\`

**Step 6: Prevent recurrence**
- Set up a Prometheus alert: \`container_memory_working_set_bytes / container_spec_memory_limit_bytes > 0.8\` → alert at 80% of limit
- Use VPA in "Off" mode to get recommendations without auto-applying

**Caution**: Don't set limits too high to avoid OOM — this causes other pods to be starved of memory. Find the right size.`,
            },
            {
              question: "How do you prevent containers from running as root in Kubernetes?",
              difficulty: "mid" as const,
              answer: `**Three layers of enforcement:**

**1. Pod Security Standards (cluster-level, built-in)**
\`\`\`yaml
# Label the namespace to enforce restricted standard
metadata:
  labels:
    pod-security.kubernetes.io/enforce: restricted
\`\`\`
The "restricted" standard requires \`runAsNonRoot: true\`.

**2. SecurityContext (pod/container level)**
\`\`\`yaml
spec:
  securityContext:
    runAsNonRoot: true      # any non-zero UID
    runAsUser: 1000         # specific UID
  containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]       # remove all Linux capabilities
\`\`\`

**3. Admission policy (Kyverno or OPA Gatekeeper)**
\`\`\`yaml
# Kyverno policy — reject any pod running as root
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-root-user
spec:
  rules:
  - name: check-runAsNonRoot
    match:
      resources:
        kinds: ["Pod"]
    validate:
      message: "Containers must not run as root"
      pattern:
        spec:
          containers:
          - =(securityContext):
              runAsNonRoot: true
\`\`\`

**In practice**: Start with Pod Security Standards (easier to enable), add Kyverno for more specific policies, and update Dockerfiles to use non-root users:
\`\`\`dockerfile
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup
USER appuser
\`\`\``,
            },
            {
              question: "Explain Kubernetes RBAC and how you'd restrict a developer's access to only view pods in one namespace.",
              difficulty: "junior" as const,
              answer: `RBAC (Role-Based Access Control) controls what API operations a subject (user, group, or service account) can perform on which resources.

**Components:**
- **Role/ClusterRole**: Defines permissions (what verbs on what resources)
- **RoleBinding/ClusterRoleBinding**: Grants a Role to a subject

**For a read-only developer in the "staging" namespace:**

\`\`\`yaml
# Step 1: Create a Role with only get/list/watch on pods
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-viewer
  namespace: staging
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]

---
# Step 2: Bind the Role to the developer
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: alice-pod-viewer
  namespace: staging
subjects:
- kind: User
  name: alice@mycompany.com   # from their identity provider
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-viewer
  apiGroup: rbac.authorization.k8s.io
\`\`\`

**Verify:**
\`\`\`bash
kubectl auth can-i get pods --as=alice@mycompany.com -n staging    # yes
kubectl auth can-i delete pods --as=alice@mycompany.com -n staging # no
kubectl auth can-i get pods --as=alice@mycompany.com -n production # no
\`\`\`

**Key principle**: Use Role (not ClusterRole + ClusterRoleBinding) to keep access namespaced. ClusterRoleBindings grant access cluster-wide — a developer with a ClusterRoleBinding for pod-viewer can read pods in all namespaces including kube-system.`,
            },
          ],
        },
        {
          id: "gitops-and-argocd",
          title: "GitOps & ArgoCD",
          duration: 22,
          type: "lesson",
          description: "Implement GitOps to manage Kubernetes deployments through Git.",
          objectives: [
            "Explain GitOps principles and why they improve reliability",
            "Deploy and configure ArgoCD",
            "Create ArgoCD Applications for automated sync",
            "Implement the App of Apps pattern for multi-cluster management",
          ],
          content: `# GitOps & ArgoCD

## What is GitOps?

GitOps is an operating model where **Git is the single source of truth** for infrastructure and application configuration. Every change to the cluster goes through a Git pull request.

**Four core principles (OpenGitOps):**
1. **Declarative**: The system is described declaratively (YAML, Helm values)
2. **Versioned**: All state is version-controlled (git history = audit log)
3. **Automatic**: Approved changes are applied automatically
4. **Continuous**: The system continuously ensures actual state matches desired state

**Why GitOps improves reliability:**
- **Audit trail**: Every change has a commit, a PR, a reviewer, a timestamp
- **Rollback**: \`git revert\` undoes any deployment in seconds
- **Consistency**: No snowflake configs — the cluster always matches git
- **Security**: Developers never need kubectl access to production

**Real-world:** Intuit uses ArgoCD to manage 50+ Kubernetes clusters across multiple AWS accounts. Weaveworks (creators of the GitOps pattern) uses it for all their production deployments.

## ArgoCD Architecture

\`\`\`
Git Repository
     │
     │ watches (webhook / polling)
     ▼
┌─────────────────────────────────────┐
│           ArgoCD                     │
│                                     │
│  ┌──────────────┐ ┌──────────────┐  │
│  │  API Server  │ │  Repository  │  │
│  │  (UI + CLI)  │ │  Server      │  │
│  └──────────────┘ └──────────────┘  │
│  ┌──────────────────────────────┐   │
│  │  Application Controller      │   │
│  │  (reconciliation loop)       │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
     │
     │ applies manifests
     ▼
Kubernetes Cluster
\`\`\`

## Installing ArgoCD

\`\`\`bash
kubectl create namespace argocd
kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Access the UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d

# Login via CLI
argocd login localhost:8080 --username admin --password <password>
\`\`\`

## Creating an ArgoCD Application

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: payments-api
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/mycompany/k8s-manifests
    targetRevision: main           # branch, tag, or commit SHA
    path: apps/payments/production # folder with K8s manifests
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true       # delete resources removed from git
      selfHeal: true    # revert manual kubectl changes
    syncOptions:
    - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
\`\`\`

## App of Apps Pattern

For managing many applications, use a "root" application that manages other Application objects:

\`\`\`
apps/
├── root-application.yaml      ← ArgoCD manages this
└── applications/
    ├── payments-app.yaml      ← ArgoCD App for payments
    ├── inventory-app.yaml     ← ArgoCD App for inventory
    └── auth-app.yaml          ← ArgoCD App for auth
\`\`\`

\`\`\`yaml
# root-application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: root
  namespace: argocd
spec:
  source:
    repoURL: https://github.com/mycompany/k8s-manifests
    path: applications/          # directory of Application manifests
    targetRevision: main
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
\`\`\`

## The GitOps Workflow

\`\`\`
Developer → PR: update payments:v2 → v3
    ↓
Code Review + CI tests pass
    ↓
PR merged to main
    ↓
ArgoCD detects change (webhook or 3-min polling)
    ↓
ArgoCD syncs: runs kubectl apply with new manifests
    ↓
Kubernetes performs rolling update
    ↓
ArgoCD reports: Healthy + Synced
\`\`\`

\`\`\`bash
# Manual sync (if not automated)
argocd app sync payments-api

# Check sync status
argocd app get payments-api
argocd app list

# Rollback via git
git revert HEAD
git push origin main
# ArgoCD auto-syncs back to previous version
\`\`\`
`,
          interviewQuestions: [
            {
              question: "What is GitOps and how does it differ from traditional CI/CD?",
              difficulty: "mid" as const,
              answer: `**Traditional CI/CD (push model)**:
\`\`\`
Developer commits → CI builds image → CD pipeline runs kubectl apply → cluster updated
\`\`\`
The CD pipeline has kubectl/kubeconfig credentials and actively pushes changes to the cluster.

**GitOps (pull model)**:
\`\`\`
Developer commits → CI builds image + updates manifest in git → 
ArgoCD detects git change → ArgoCD pulls and applies → cluster updated
\`\`\`
The cluster's GitOps operator (ArgoCD/Flux) pulls desired state from git. No external system needs cluster credentials.

**Key differences:**

| Aspect | Traditional CD | GitOps |
|--------|---------------|--------|
| Credentials | CD system has kubectl access | ArgoCD runs inside the cluster |
| Audit trail | CI logs (ephemeral) | Git commits (permanent) |
| Drift detection | None — runs once | Continuous — reverts unauthorized changes |
| Rollback | Re-run old pipeline | \`git revert\` or click in ArgoCD UI |
| Source of truth | Whatever is running | Git repository |

**Self-healing**: If someone runs \`kubectl scale deployment payments --replicas=0\` in production, ArgoCD (with selfHeal: true) detects the drift within 3 minutes and applies the git-defined value back. This prevents snowflake configurations.`,
            },
            {
              question: "How do you handle a situation where ArgoCD has synced a bad deployment and the app is down?",
              difficulty: "senior" as const,
              answer: `**Immediate response (first 2 minutes):**

**Option 1: Revert in git (preferred — maintains GitOps)**
\`\`\`bash
git revert HEAD --no-edit
git push origin main
# ArgoCD auto-syncs → Kubernetes rolls back
# Downtime limited to ArgoCD polling interval (default 3 min) or use webhook for instant sync
\`\`\`

**Option 2: ArgoCD history rollback (faster but creates git drift)**
\`\`\`bash
argocd app history payments-api  # find the last healthy revision
argocd app rollback payments-api <revision-number>
\`\`\`
This deploys the previous git commit's state but doesn't change git HEAD — creates drift. Follow up with a git revert to sync them.

**Option 3: Emergency kubectl (last resort)**
\`\`\`bash
kubectl rollout undo deployment/payments-api -n production
\`\`\`
This will be reverted by ArgoCD on next sync (selfHeal: true). Disable auto-sync first:
\`\`\`bash
argocd app set payments-api --sync-policy none
\`\`\`

**Root cause prevention:**
1. **Progressive delivery**: Use Argo Rollouts (canary/blue-green) so bad deploys only hit 5% of traffic before full rollout
2. **Health checks**: ArgoCD won't mark a sync as Healthy until pods are Ready
3. **Sync windows**: Block auto-sync during business hours, only allow off-peak
4. **Required PR approval**: Enforce CODEOWNERS so production manifests need a second reviewer`,
            },
          ],
        },
      ],
      exam: [
        {
          question: "Your API pods are under heavy load and the HPA has not scaled up even though CPU is above the target threshold. What are the possible reasons?",
          answer: "1) Metrics server is not installed or not returning metrics — `kubectl top pods` fails; HPA cannot act without metrics. 2) The HPA `minReplicas` equals `maxReplicas` — it cannot scale. 3) The scale-up stabilization window (default 5 minutes) is preventing rapid scale-up; check `kubectl describe hpa`. 4) The pod does not have CPU resource requests set — HPA calculates utilization as (current usage / request); without requests, it cannot compute a ratio. 5) The cooldown period has not elapsed since the last scale event. Fix: ensure metrics-server is running, set CPU requests on pods, and verify `kubectl get hpa` shows current/target metrics correctly.",
          difficulty: "mid",
        },
        {
          question: "What is the difference between Horizontal Pod Autoscaler (HPA) and Vertical Pod Autoscaler (VPA)? Can you run both simultaneously?",
          answer: "HPA scales the number of pod replicas based on metrics (CPU, memory, custom). VPA adjusts the resource requests/limits of individual pods based on observed usage, resizing containers to right-size them. They address different dimensions: HPA handles traffic load, VPA handles resource efficiency. Running both on CPU simultaneously is problematic — they can conflict (VPA increases requests, which changes HPA's utilization calculation, causing oscillation). The recommended pattern: use VPA in recommendation mode to determine correct resource requests, set those values manually, then use HPA for runtime scaling. Or use VPA only for non-horizontally-scalable workloads (like databases) and HPA for stateless services.",
          difficulty: "senior",
        },
        {
          question: "Explain how RBAC works in Kubernetes. What are the four main RBAC objects and how do they relate to each other?",
          answer: "RBAC (Role-Based Access Control) controls who can do what in the cluster. The four objects: 1) Role — defines a set of permissions (verbs like get/list/create on resources like pods/secrets) within a specific namespace. 2) ClusterRole — same as Role but cluster-wide, covering non-namespaced resources (nodes, PVs) or used across namespaces. 3) RoleBinding — binds a Role or ClusterRole to subjects (users, groups, ServiceAccounts) within a namespace — grants the permissions for that namespace only. 4) ClusterRoleBinding — binds a ClusterRole to subjects cluster-wide. Example: to give a CI service account permission to deploy to the `production` namespace only, create a Role with deployment update permissions + a RoleBinding in `production` binding to the CI ServiceAccount.",
          difficulty: "mid",
        },
        {
          question: "A pod running in your cluster should only need to read ConfigMaps in its namespace, not create or delete them. How do you implement least-privilege access for this pod?",
          answer: "1) Create a dedicated ServiceAccount: `kubectl create serviceaccount config-reader -n production`. 2) Create a Role with only the needed permissions: `apiGroups: [''], resources: ['configmaps'], verbs: ['get', 'list', 'watch']`. 3) Create a RoleBinding linking the Role to the ServiceAccount in the same namespace. 4) Set the pod's `spec.serviceAccountName: config-reader`. The pod will mount the ServiceAccount token, which the API server validates against RBAC rules. Avoid using the `default` ServiceAccount for anything sensitive — in many clusters it has broad permissions. Also set `automountServiceAccountToken: false` on pods that do not need API access at all.",
          difficulty: "mid",
        },
        {
          question: "What is Pod Security Admission (PSA) and how does it replace PodSecurityPolicy? Describe the three enforcement levels.",
          answer: "PSA is the built-in Kubernetes mechanism (stable since 1.25) that replaced the deprecated PodSecurityPolicy. It enforces security profiles at the namespace level via labels. Three standard profiles: 1) `privileged` — no restrictions, same as no policy. 2) `baseline` — prevents the most dangerous capabilities (hostPID, hostNetwork, privileged containers, dangerous capabilities like SYS_ADMIN) while allowing most workloads. 3) `restricted` — heavily restricted following current hardening best practices (requires non-root user, drops all capabilities, disallows privilege escalation, requires seccomp). Three enforcement modes per profile: `enforce` (reject violating pods), `audit` (allow but log), `warn` (allow but warn). Label example: `pod-security.kubernetes.io/enforce: baseline`.",
          difficulty: "senior",
        },
        {
          question: "What is GitOps and how does ArgoCD implement it? What is the reconciliation loop?",
          answer: "GitOps is a practice where the desired state of infrastructure and applications is declared in a Git repository, and an automated operator continuously ensures the live cluster matches that desired state. ArgoCD implements GitOps by: 1) Watching a Git repository (polling or webhook) for changes to Kubernetes manifests (raw YAML, Helm charts, Kustomize). 2) Comparing the desired state in git with the live state in the cluster. 3) When drift is detected, ArgoCD syncs — applies the git state to the cluster. The reconciliation loop runs continuously (every ~3 minutes by default or on git push). With `selfHeal: true`, any manual change to the cluster is automatically reverted to match git — git becomes the single source of truth.",
          difficulty: "mid",
        },
        {
          question: "A developer did `kubectl edit deployment payments-api` directly in production to hotfix a critical bug. ArgoCD is configured with auto-sync and selfHeal. What happens?",
          answer: "ArgoCD will detect drift between the live Deployment (manual edit) and the desired state in git, then automatically revert the manual change by reapplying the git state — overwriting the hotfix. The developer's change will be lost within minutes. The correct GitOps workflow is: 1) Disable auto-sync temporarily (`argocd app set payments-api --sync-policy none`) or use an ArgoCD sync window. 2) Commit the fix to git (proper PR review). 3) ArgoCD syncs the git change. This enforces auditability — every change has a git commit, PR, and review trail. Emergency hotfixes should still go through git, possibly with an expedited review process.",
          difficulty: "mid",
        },
        {
          question: "Your cluster has pods running as root with host network access. A security audit flags this. What steps do you take to harden pod security?",
          answer: "1) Audit current posture: `kubectl get pods -A -o jsonpath='{range .items[*]}{.metadata.namespace}/{.metadata.name}: {.spec.securityContext}{\"\\n\"}{end}'` and check for `hostNetwork: true`, `privileged: true`, `runAsUser: 0`. 2) Add Pod Security Admission labels to namespaces — start with `warn` and `audit` modes to identify violations without breaking things. 3) Update pod specs: set `securityContext.runAsNonRoot: true`, `runAsUser: 1000`, `allowPrivilegeEscalation: false`, `capabilities.drop: [ALL]`, `readOnlyRootFilesystem: true`. 4) Remove `hostNetwork`, `hostPID`, `hostIPC` unless absolutely required (only for node-level agents like CNI plugins). 5) Enforce the `baseline` or `restricted` PSA profile once pods are compliant.",
          difficulty: "senior",
        },
        {
          question: "Explain what happens during an ArgoCD sync when a Helm chart upgrade includes a breaking schema change to a CRD. What safeguards should be in place?",
          answer: "CRD upgrades are risky — Kubernetes validates existing custom resources against the new schema after the CRD is updated. If existing resources violate the new schema, they may become invalid (though Kubernetes does not delete them). Safeguards: 1) Use ArgoCD sync phases and waves — annotate the CRD with `argocd.argoproj.io/sync-wave: '-1'` so it applies before dependent resources. 2) Use ArgoCD `Replace=true` sync option for CRDs (kubectl apply cannot always update CRD schemas). 3) Test in staging first — apply the chart upgrade to a staging cluster before production. 4) Check ArgoCD's app health after sync — it will show Degraded if resources fail to apply. 5) Have a rollback plan: `helm rollback` or revert the git commit and let ArgoCD re-sync.",
          difficulty: "senior",
        },
        {
          question: "How does Cluster Autoscaler work and what is the difference between it and HPA? What prevents it from scaling down a node?",
          answer: "HPA scales pod replicas based on resource metrics — it operates at the workload level. Cluster Autoscaler (CA) scales the number of nodes in a node group based on scheduling pressure — it operates at the infrastructure level. When pods are Pending because no node has enough capacity, CA provisions a new node. When nodes are underutilized and all pods can fit on fewer nodes, CA removes nodes. CA will NOT scale down a node if: 1) A pod on the node has a PodDisruptionBudget that would be violated. 2) A pod uses local storage (hostPath, emptyDir with data). 3) A pod has the annotation `cluster-autoscaler.kubernetes.io/safe-to-evict: 'false'`. 4) A node has the annotation `cluster-autoscaler.kubernetes.io/scale-down-disabled: 'true'`. 5) The node has been recently added (scale-down delay).",
          difficulty: "senior",
        },
      ],
    },
  ],
};
