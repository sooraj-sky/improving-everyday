import type { Track } from "./types";

export const databasesTrack: Track = {
  id: "databases",
  title: "Databases",
  description: "Master relational and non-relational databases — from SQL fundamentals and ACID transactions to NoSQL patterns, indexing strategies, and choosing the right database for each problem.",
  longDescription: "Databases are the foundation of every application. This track covers how relational databases work under the hood (indexes, query planning, transactions, normalization), then moves through the full NoSQL landscape — document, key-value, wide-column, graph, and time-series — with practical guidance on when to use each.",
  icon: "Database",
  color: "#f59e0b",
  gradient: "track-databases-gradient",
  tags: ["SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Cassandra", "NoSQL", "ACID"],
  level: "beginner",
  estimatedHours: 18,
  modules: [
    // MODULE 1 — Relational Databases
    {
      id: "rdbms-fundamentals",
      title: "Relational Databases (RDBMS)",
      level: "beginner",
      description: "Understand how relational databases work — tables, SQL, ACID transactions, indexes, query planning, and normalization.",
      lessons: [
        {
          id: "how-rdbms-works",
          title: "How Relational Databases Work",
          duration: 50,
          type: "lesson" as const,
          description: "Understand the architecture of a relational database — storage engine, query planner, buffer pool, WAL — and why these internals matter for performance.",
          content: `# How Relational Databases Work

A relational database is not magic. It's a structured file on disk with layers of software that make it feel like rows and columns. Understanding what's actually happening when you run a query changes how you write SQL, design schemas, and debug slowdowns.

## The Core Idea: Tables Are Abstractions

Physically, a PostgreSQL or MySQL database is a collection of files on disk. A table is a file (or set of files) with a structured binary format. When you \`SELECT\`, the database reads bytes from disk, parses them according to the table's schema, and returns matching rows. Everything else — indexes, transactions, query planning — exists to make that process fast and safe.

## Architecture Layers

**Client → SQL Parser → Query Planner → Executor → Storage Engine → Disk**

1. **SQL Parser** — Parses your SQL string into an abstract syntax tree (AST). Catches syntax errors here.
2. **Query Planner / Optimizer** — The most important layer. Takes the AST and figures out the most efficient way to execute it. Decides whether to use an index or a full table scan, in what order to join tables, and how to apply filters. EXPLAIN ANALYZE shows you what the planner decided.
3. **Executor** — Runs the plan chosen by the optimizer.
4. **Storage Engine** — Handles the physical reading and writing of data. MySQL has pluggable storage engines (InnoDB is the default and the right choice for almost everything). PostgreSQL has a single storage engine.
5. **Buffer Pool / Shared Buffer** — An in-memory cache of recently accessed data pages. A "page" is typically 8 KB. If the page you need is in the buffer pool, the database reads from memory (~100ns). If not, it reads from disk (~100μs for NVMe, ~10ms for spinning disk). This 1000x difference is why buffer pool sizing matters.
6. **Write-Ahead Log (WAL)** — Before any change is written to the main data file, it's written to the WAL (a sequential append-only log). If the server crashes mid-write, the WAL allows recovery. This is how databases guarantee durability without writing to the actual data file synchronously on every operation.

## How a Write Actually Works

When you \`INSERT\` a row:
1. The row is written to the WAL first (fast, sequential write)
2. The row is written to the buffer pool (in memory)
3. Eventually, a background process (checkpoint) flushes dirty pages from buffer pool to the actual data files on disk

If the server crashes between steps 1 and 3, recovery reads the WAL and replays the operations. Nothing is lost.

## ACID Properties

ACID is what separates a database from a flat file:

**Atomicity** — A transaction either fully commits or fully rolls back. If you transfer $100 from Account A to Account B, and the server crashes after deducting from A but before adding to B, the transaction rolls back and the money stays in A.

**Consistency** — Transactions bring the database from one valid state to another valid state. Constraints (NOT NULL, UNIQUE, FOREIGN KEY, CHECK) are enforced. A transaction that would violate a constraint is rejected.

**Isolation** — Concurrent transactions don't interfere with each other in unexpected ways. The default isolation level determines how visible another transaction's in-progress changes are to your transaction.

**Durability** — Once a transaction commits, it's permanent — even if the server crashes immediately after. The WAL guarantees this.

**Isolation levels** — There are four, from least to most strict:

| Level | Dirty Read | Non-repeatable Read | Phantom Read |
|---|---|---|---|
| READ UNCOMMITTED | Possible | Possible | Possible |
| READ COMMITTED | Prevented | Possible | Possible |
| REPEATABLE READ | Prevented | Prevented | Possible |
| SERIALIZABLE | Prevented | Prevented | Prevented |

PostgreSQL defaults to **READ COMMITTED** — you see only committed data, but if another transaction commits between two reads of the same row, you might see different values. MySQL InnoDB defaults to **REPEATABLE READ**.

\`\`\`sql
-- Explicit transaction with isolation level
BEGIN;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

SELECT balance FROM accounts WHERE id = 1;  -- reads 1000
-- Another transaction commits a change to balance
SELECT balance FROM accounts WHERE id = 1;  -- still reads 1000 (repeatable)

COMMIT;
\`\`\`

## Locking

Databases use locks to enforce isolation. Understanding locks explains why you see \`waiting for lock\` in slow query logs.

**Row-level locks** — Lock only the specific rows being modified. InnoDB/PostgreSQL default. Allows high concurrency on the same table.

**Table-level locks** — Lock the entire table. Used by MyISAM and for DDL operations (ALTER TABLE). Blocks all other reads/writes.

**Shared lock (S)** — Multiple transactions can hold a shared lock on the same row simultaneously. Used for SELECT ... FOR SHARE.

**Exclusive lock (X)** — Only one transaction can hold an exclusive lock. Used for UPDATE, DELETE, INSERT, and SELECT ... FOR UPDATE.

\`\`\`sql
-- Lock rows for update (prevents other transactions from modifying)
BEGIN;
SELECT * FROM inventory WHERE product_id = 42 FOR UPDATE;
-- Other sessions that try SELECT ... FOR UPDATE on product_id=42 will wait
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 42;
COMMIT;

-- Deadlock example:
-- Session 1: locks row A, tries to lock row B
-- Session 2: locks row B, tries to lock row A
-- Database detects the cycle and kills one transaction
\`\`\`

## MVCC — Multi-Version Concurrency Control

PostgreSQL and InnoDB use MVCC to provide isolation without locking reads. Instead of blocking readers when a writer is active, the database keeps multiple versions of a row:

- When you UPDATE, the old row version is kept (marked as deleted) and a new version is created
- Readers see the version that was current at the start of their transaction
- Old versions are eventually cleaned up by a VACUUM process (PostgreSQL) or purge thread (InnoDB)

This is why you don't need \`LOCK TABLE\` for reads in PostgreSQL — readers never block writers and writers never block readers.

## Query Execution: EXPLAIN ANALYZE

\`EXPLAIN ANALYZE\` is the most important debugging tool for SQL performance:

\`\`\`sql
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) as order_count
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name
ORDER BY order_count DESC
LIMIT 10;
\`\`\`

Output tells you:
- **Seq Scan** — Full table scan. Reads every row. Bad on large tables.
- **Index Scan** — Uses an index to find rows. Fast for selective queries.
- **Index Only Scan** — Data is in the index itself, no heap access needed. Fastest.
- **Hash Join / Nested Loop / Merge Join** — Different join strategies with different cost profiles
- **actual time** — Real execution time in milliseconds
- **rows** — Actual vs estimated rows (large difference = stale statistics, run ANALYZE)
- **Buffers: shared hit=X read=Y** — X pages from buffer pool (memory), Y pages from disk

\`\`\`sql
-- Force statistics refresh so planner makes better decisions
ANALYZE users;
ANALYZE orders;
\`\`\``,
          interviewQuestions: [
            {
              question: "What is MVCC and how does it allow reads and writes to not block each other?",
              answer: "MVCC (Multi-Version Concurrency Control) stores multiple versions of each row. When a transaction updates a row, the old version is kept alongside the new one, marked with transaction timestamps. A reading transaction sees the version of each row that was current at its start time — even if another transaction is simultaneously modifying those rows. This means readers never block writers and writers never block readers. The tradeoff is storage overhead for old versions and the need for a cleanup process (VACUUM in PostgreSQL) to reclaim space from expired row versions.",
              difficulty: "senior" as const,
            },
          ],
        },
        {
          id: "sql-and-indexes",
          title: "SQL & Indexing Deep Dive",
          duration: 55,
          type: "lesson" as const,
          description: "Write effective SQL, understand B-tree and other index types, know when indexes help and when they hurt, and use EXPLAIN to diagnose slow queries.",
          content: `# SQL & Indexing Deep Dive

Indexes are the most impactful performance tool in relational databases. A query that takes 10 seconds on an unindexed table can take 1 millisecond with the right index. But indexes also slow down writes and take space — understanding when to add them requires knowing how they work.

## How B-Tree Indexes Work

The default index type in PostgreSQL and MySQL is a **B-tree** (Balanced Tree). It's a sorted tree structure where:
- Leaf nodes contain the indexed column value + a pointer to the actual row (heap pointer / row ID)
- Internal nodes contain separator keys that route searches
- The tree stays balanced — all leaf nodes are at the same depth

\`\`\`
         [50]
        /    \\
    [25]      [75]
   /    \\   /    \\
[10,20] [30,40] [60,70] [80,90]
\`\`\`

Finding a row with value 30:
1. Compare 30 < 50, go left
2. Compare 30 > 25, go right
3. Find 30 in leaf node, read heap pointer
4. Fetch row from heap using pointer

This is O(log n) — a table with 1 billion rows needs ~30 comparisons. A full scan needs 1 billion reads.

**What B-tree indexes are good for:**
- Equality: \`WHERE id = 42\`
- Range: \`WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31'\`
- Sorting: \`ORDER BY last_name\` (index is already sorted)
- Prefix matching: \`WHERE name LIKE 'Smith%'\` (not \`'%Smith'\`)

**What B-tree indexes can't help with:**
- Functions on the column: \`WHERE LOWER(email) = 'user@example.com'\` (use expression index)
- Leading wildcard: \`WHERE name LIKE '%Smith'\` (full scan required)
- Low-cardinality columns (e.g., boolean): the index has so few distinct values it's often faster to scan

## Index Types

**Composite index** — An index on multiple columns. Column order matters: the index is sorted by the first column, then within that by the second column.

\`\`\`sql
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- This query uses the index (leftmost prefix):
SELECT * FROM orders WHERE user_id = 42 AND created_at > '2024-01-01';

-- This also uses the index (leftmost prefix only):
SELECT * FROM orders WHERE user_id = 42;

-- This CANNOT use the index efficiently:
SELECT * FROM orders WHERE created_at > '2024-01-01';
-- (created_at is not the leftmost column)
\`\`\`

**Partial index** — Index only rows that match a condition. Smaller, faster to update:
\`\`\`sql
-- Only index unprocessed orders (most queries are for unprocessed ones)
CREATE INDEX idx_orders_unprocessed ON orders(created_at)
WHERE status = 'pending';
\`\`\`

**Expression / functional index** — Index the result of a function:
\`\`\`sql
-- Allows case-insensitive email lookups without full scan
CREATE INDEX idx_users_email_lower ON users(LOWER(email));

-- Now this uses the index:
SELECT * FROM users WHERE LOWER(email) = LOWER('User@Example.com');
\`\`\`

**Covering index** — An index that contains all columns needed for a query, allowing an Index Only Scan:
\`\`\`sql
CREATE INDEX idx_orders_covering ON orders(user_id) INCLUDE (total, status, created_at);

-- This query never touches the heap (Index Only Scan):
SELECT total, status, created_at FROM orders WHERE user_id = 42;
\`\`\`

**GIN index** — Generalized Inverted Index. Used for full-text search, JSONB, and arrays:
\`\`\`sql
CREATE INDEX idx_posts_content_gin ON posts USING GIN(to_tsvector('english', content));
SELECT * FROM posts WHERE to_tsvector('english', content) @@ to_tsquery('english', 'postgres & index');
\`\`\`

## When Indexes Hurt

Indexes slow down INSERT, UPDATE, and DELETE because the index must be maintained alongside the data. A table with 10 indexes takes 10x the write overhead for each row modification.

**Don't add indexes on:**
- Tiny tables (full scan is fine, index adds overhead)
- Columns never used in WHERE/JOIN/ORDER BY
- Columns with very low cardinality (boolean, status with 2 values)
- Tables with extremely high write throughput where index maintenance bottlenecks writes

**Find unused indexes:**
\`\`\`sql
-- PostgreSQL: indexes never used since last statistics reset
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY tablename, indexname;
\`\`\`

## SQL Patterns for Performance

**N+1 problem — the most common ORM performance bug:**
\`\`\`sql
-- N+1: fetch 100 users, then 100 separate queries for their orders
SELECT * FROM users WHERE active = true;
-- for each user: SELECT * FROM orders WHERE user_id = ?

-- Fix: JOIN or IN clause
SELECT u.*, o.id as order_id, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.active = true;
\`\`\`

**Window functions — analytics without subqueries:**
\`\`\`sql
-- Running total of revenue per user
SELECT
  user_id,
  order_date,
  total,
  SUM(total) OVER (PARTITION BY user_id ORDER BY order_date) as running_total,
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total DESC) as rank_by_value
FROM orders;
\`\`\`

**CTEs for readable complex queries:**
\`\`\`sql
WITH high_value_users AS (
  SELECT user_id, SUM(total) as lifetime_value
  FROM orders
  WHERE created_at > NOW() - INTERVAL '1 year'
  GROUP BY user_id
  HAVING SUM(total) > 1000
),
user_details AS (
  SELECT u.id, u.email, u.name, h.lifetime_value
  FROM users u
  JOIN high_value_users h ON h.user_id = u.id
)
SELECT * FROM user_details ORDER BY lifetime_value DESC;
\`\`\`

**UPSERT — insert or update atomically:**
\`\`\`sql
-- PostgreSQL
INSERT INTO user_stats (user_id, login_count, last_login)
VALUES (42, 1, NOW())
ON CONFLICT (user_id)
DO UPDATE SET
  login_count = user_stats.login_count + 1,
  last_login = NOW();
\`\`\`

## Normalization vs Denormalization

**Normalization** organizes data to reduce redundancy. The normal forms (1NF, 2NF, 3NF, BCNF) progressively eliminate data anomalies:

- **1NF**: No repeating groups, each column holds atomic values
- **2NF**: No partial dependencies on composite primary keys
- **3NF**: No transitive dependencies (non-key columns depend only on the primary key)

Normalized schemas are storage-efficient and anomaly-free but require JOINs for queries.

**Denormalization** deliberately adds redundancy to eliminate JOINs for frequently-accessed data:

\`\`\`sql
-- Normalized (3 tables, requires JOIN for display)
orders: id, user_id, total
users: id, name, email
order_items: id, order_id, product_id, quantity

-- Denormalized for analytics (replicate user name into orders)
orders: id, user_id, user_name, user_email, total
-- Now analytics queries don't need to JOIN users
\`\`\`

Denormalization trades storage and write complexity for read performance. Use it for read-heavy analytics tables, materialized views, and caching layers.`,
          interviewQuestions: [
            {
              question: "Why can't you use an index on WHERE LOWER(email) = 'foo@bar.com' without a special index?",
              answer: "A standard B-tree index stores the raw column values in sorted order. When you apply LOWER() in the WHERE clause, the database can't use the index because it would need to apply LOWER() to every indexed value to find matches — that's equivalent to a full scan. The solution is an expression index: CREATE INDEX idx ON users(LOWER(email)). This stores the pre-computed LOWER(email) values in the index. The query planner can then match the expression in the WHERE clause to the index expression and use the index normally.",
              difficulty: "mid" as const,
            },
            {
              question: "Explain the N+1 query problem and how to fix it.",
              answer: "N+1 occurs when code fetches N parent records, then issues N separate queries to fetch each parent's related records — O(N) database round trips instead of 1. Example: fetch 100 users, then loop and query orders for each user = 101 queries. Fix: 1) JOIN in a single query — SELECT u.*, o.* FROM users u LEFT JOIN orders o ON o.user_id = u.id. 2) Use an IN clause — fetch users, collect IDs, then SELECT * FROM orders WHERE user_id IN (id1, id2, ...) = 2 queries. Most ORMs have an 'eager loading' option (Rails includes:, Django select_related/prefetch_related, Hibernate JOIN FETCH) that generates the efficient query instead of N+1.",
              difficulty: "mid" as const,
            },
          ],
        },
        {
          id: "schema-design-replication",
          title: "Schema Design, Replication & Scaling",
          duration: 50,
          type: "lesson" as const,
          description: "Design schemas that scale, understand read replicas and sharding, connection pooling with PgBouncer, and when you've hit relational limits.",
          content: `# Schema Design, Replication & Scaling

## Schema Design Principles

A good schema is one where queries are fast, constraints prevent invalid data, and the schema can evolve without painful migrations.

**Choose primary keys carefully:**
\`\`\`sql
-- Auto-increment integer: simple, fast, sequential
id BIGSERIAL PRIMARY KEY  -- PostgreSQL
id BIGINT AUTO_INCREMENT PRIMARY KEY  -- MySQL

-- UUID: no coordination needed, globally unique, works for distributed systems
id UUID DEFAULT gen_random_uuid() PRIMARY KEY

-- ULID/UUIDv7: UUID that is also time-sortable (avoids random index fragmentation)
-- Better than UUIDv4 for primary keys in high-insert tables
\`\`\`

UUIDs cause **index fragmentation**: because UUID values are random, new inserts land in random positions in the B-tree index. This causes many page splits and poor cache locality. UUIDv7 and ULID are monotonically increasing, avoiding this problem while retaining uniqueness.

**Foreign keys enforce referential integrity:**
\`\`\`sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'shipped', 'delivered', 'cancelled')),
  total NUMERIC(12, 2) NOT NULL CHECK (total > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partial unique constraint: only one pending order per user
CREATE UNIQUE INDEX idx_orders_one_pending_per_user
ON orders(user_id)
WHERE status = 'pending';
\`\`\`

**Soft deletes:**
\`\`\`sql
-- Instead of DELETE, set a timestamp
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;

-- Queries must always filter: WHERE deleted_at IS NULL
-- Use partial index to keep active records fast:
CREATE INDEX idx_users_active ON users(email) WHERE deleted_at IS NULL;
\`\`\`

**Audit columns (always include these):**
\`\`\`sql
created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
created_by  BIGINT REFERENCES users(id),
updated_by  BIGINT REFERENCES users(id)
\`\`\`

## Read Replicas

As read traffic grows, one database server becomes a bottleneck. The first scaling step is adding **read replicas**:

- Primary (writer): handles all writes
- Replicas (readers): receive a stream of changes from the primary via replication and serve read queries

Replication is **asynchronous** by default: a write commits on the primary and is replicated to replicas with a small lag (typically < 1 second). Reads from replicas may see slightly stale data. For most applications this is acceptable.

\`\`\`python
# Application-level read/write splitting
import psycopg2

PRIMARY_DSN = "postgresql://primary-host:5432/mydb"
REPLICA_DSN = "postgresql://replica-host:5432/mydb"

def get_db(readonly=False):
    dsn = REPLICA_DSN if readonly else PRIMARY_DSN
    return psycopg2.connect(dsn)

# Writes go to primary
with get_db(readonly=False) as conn:
    conn.execute("INSERT INTO orders ...")

# Analytics reads go to replica (stale data acceptable)
with get_db(readonly=True) as conn:
    conn.execute("SELECT COUNT(*) FROM orders WHERE ...")
\`\`\`

**PostgreSQL streaming replication setup:**
\`\`\`bash
# On primary — create replication user
psql -c "CREATE ROLE replicator REPLICATION LOGIN PASSWORD 'repl_password';"

# In pg_hba.conf — allow replica to connect for replication
# host  replication  replicator  10.0.0.5/32  md5

# On replica — base backup from primary
pg_basebackup -h primary-host -U replicator -D /var/lib/postgresql/data -P -R
# -R creates standby.signal and postgresql.auto.conf with primary_conninfo

# Start replica PostgreSQL — it automatically connects and streams WAL
\`\`\`

## Connection Pooling with PgBouncer

Every database connection consumes memory (~5-10 MB per connection in PostgreSQL). 1000 concurrent application threads × 10 MB = 10 GB just for connections. PostgreSQL starts degrading around 300-500 connections.

**PgBouncer** is a lightweight connection pooler that sits between applications and PostgreSQL. Applications maintain a pool of connections to PgBouncer; PgBouncer maintains a much smaller pool to PostgreSQL.

**Pooling modes:**
- **Session pooling**: One server connection per client session. Connection is held for the duration of the client connection. Same as no pooling.
- **Transaction pooling**: Server connection is held only for the duration of a transaction. Returned to pool after COMMIT/ROLLBACK. Most efficient — 1000 clients can share 50 server connections if they're not all in transactions simultaneously.
- **Statement pooling**: Most aggressive, but incompatible with multi-statement transactions.

\`\`\`ini
# pgbouncer.ini
[databases]
mydb = host=postgres-primary port=5432 dbname=mydb

[pgbouncer]
listen_port = 5432
pool_mode = transaction
max_client_conn = 5000
default_pool_size = 50    # server connections to PostgreSQL
reserve_pool_size = 10    # extra connections for peak bursts
server_idle_timeout = 600
\`\`\`

## Sharding — Horizontal Partitioning

When a single database server can't handle write volume (even with replicas), you shard: split data across multiple database servers by a **shard key**.

\`\`\`
Shard 0: user_ids 0–2M    → db-shard-0
Shard 1: user_ids 2M–4M   → db-shard-1
Shard 2: user_ids 4M–6M   → db-shard-2
\`\`\`

The application determines which shard to query based on the shard key:
\`\`\`python
NUM_SHARDS = 4

def get_shard(user_id: int):
    return databases[user_id % NUM_SHARDS]

def get_user_orders(user_id: int):
    db = get_shard(user_id)
    return db.query("SELECT * FROM orders WHERE user_id = ?", user_id)
\`\`\`

**Sharding challenges:**
- Cross-shard queries (join data from multiple shards) are expensive or impossible
- Rebalancing shards when you add new shards requires data migration
- Transactions across shards require distributed transaction protocols (complex)
- The shard key must be chosen to distribute load evenly — a hot shard key concentrates traffic

**Table partitioning** (within one server) is often a better starting point than sharding:
\`\`\`sql
-- Range partition by month (PostgreSQL)
CREATE TABLE events (
  id BIGSERIAL,
  user_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2024_01 PARTITION OF events
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE events_2024_02 PARTITION OF events
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
-- Old partitions can be dropped instantly (no DELETE needed)
\`\`\`

## When You've Hit Relational Limits

Consider moving off RDBMS when:
- **Write throughput** exceeds what a single primary can handle (even with partitioning)
- **Flexible schema** needed — the schema changes so frequently that migrations are a bottleneck
- **Massive scale** at specific access patterns (simple key-value lookups at millions/second)
- **Specific data structures** — graphs, time-series, full-text — where specialized engines excel

The typical progression: single database → read replicas → connection pooler → table partitioning → sharding. Many applications never need to go past read replicas + PgBouncer.`,
          interviewQuestions: [
            {
              question: "What are read replicas, what are their limitations, and when would you use them?",
              answer: "Read replicas receive a stream of changes from the primary database via asynchronous replication. They handle read queries, offloading the primary. Limitations: 1) Replication lag — replicas are slightly behind the primary (typically < 1 second). Applications reading from replicas may see stale data. 2) Replicas don't reduce write load — all writes still go to the primary. 3) If the primary fails, manual or automated failover to a replica is needed (requires promoting the replica to primary). Use read replicas for: analytics queries, reporting, read-heavy operations where slight staleness is acceptable, and geographic distribution (replica in another region for local reads).",
              difficulty: "mid" as const,
            },
          ],
        },
      ],
      exam: [
        { question: "A query that takes 30ms in dev takes 8 seconds in production on the same table. The only difference is prod has 50 million rows vs 10,000 in dev. What do you investigate and fix?", answer: "1) Run EXPLAIN ANALYZE in production on the slow query. Look for Seq Scan on the large table — the dev table was small enough that a full scan was fast, but 50M rows makes that unacceptable. 2) Identify the WHERE and JOIN columns and check if they're indexed: SELECT * FROM pg_indexes WHERE tablename = 'your_table'. 3) If no index exists on the filter column, create one: CREATE INDEX CONCURRENTLY idx_table_col ON table(col) — CONCURRENTLY avoids table lock in production. 4) Check if the planner is using the index after creation with EXPLAIN ANALYZE. 5) If the query has functions on columns (WHERE DATE(created_at) = today), replace with range: WHERE created_at >= today AND created_at < tomorrow, or create an expression index.", difficulty: "mid" as const },
        { question: "Explain what happens if you don't use a transaction when transferring money between two accounts.", answer: "Without a transaction, the two UPDATE operations are independent. If the first (deduct from account A) succeeds but the server crashes before the second (add to account B) executes, account A has less money but account B was never credited — money disappears. With a transaction: BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT. If any step fails or the server crashes before COMMIT, the database rolls back to the state before BEGIN. Atomicity guarantees both updates happen or neither does. Additionally, without ISOLATION, a concurrent read between the two updates would see the account in a temporarily inconsistent state (money deducted but not yet credited).", difficulty: "junior" as const },
        { question: "What is a composite index and why does column order matter?", answer: "A composite index is a B-tree index on multiple columns stored together, sorted by the first column, then within that by the second column. Column order matters because: the index can only be used efficiently starting from the leftmost column (the leftmost prefix rule). An index on (user_id, created_at) enables: WHERE user_id = 42 (uses index), WHERE user_id = 42 AND created_at > '2024-01-01' (uses both columns). But WHERE created_at > '2024-01-01' alone cannot use this index efficiently because created_at is not the first column. Put the column you filter on most selectively first, then additional sort/range columns.", difficulty: "mid" as const },
        { question: "When would you choose UUID vs auto-increment integer for primary keys?", answer: "Auto-increment (BIGSERIAL): simpler, sequential, smaller storage (8 bytes vs 16), better index performance (no fragmentation from random inserts), human-readable in URLs. Choose for most applications. UUID: globally unique without central coordination — useful for distributed systems, merging data from multiple databases, or when IDs must not be guessable/sequential (security). Tradeoff: UUIDs cause B-tree index fragmentation because random values land in random index positions, causing page splits. Solution: use UUIDv7 or ULID (monotonically increasing UUIDs) which preserve uniqueness while remaining sortable — best of both worlds for distributed systems.", difficulty: "mid" as const },
        { question: "What is connection pooling and why is it necessary for high-concurrency applications?", answer: "Each PostgreSQL connection is a separate OS process consuming ~5-10 MB RAM and taking ~30ms to establish. At 1000 concurrent users each holding a persistent connection: 10 GB of memory just for connections, and PostgreSQL performance degrades significantly past ~300 connections. Connection pooling (PgBouncer) maintains a small pool of long-lived connections to PostgreSQL (e.g., 50) while serving thousands of application clients. In transaction pooling mode, a server connection is checked out only for the duration of a transaction and immediately returned. 1000 clients with average 100ms transactions at 10 RPS each need only ~1000 × 0.1s / 10s = 10 simultaneous server connections at any moment.", difficulty: "mid" as const },
      ],
    },

    // MODULE 2 — NoSQL Databases
    {
      id: "nosql-databases",
      title: "NoSQL Databases",
      level: "intermediate",
      description: "Understand the four NoSQL categories — document, key-value, wide-column, and graph — with the theory behind why each exists and when to use each over a relational database.",
      lessons: [
        {
          id: "nosql-landscape",
          title: "The NoSQL Landscape: CAP Theorem & When to Go NoSQL",
          duration: 45,
          type: "lesson" as const,
          description: "Understand why NoSQL databases exist, the CAP theorem, eventual consistency, and how to choose between the four NoSQL categories.",
          content: `# The NoSQL Landscape: CAP Theorem & When to Go NoSQL

"NoSQL" is a marketing term that covers four fundamentally different database categories. They share almost nothing except a rejection of the relational model — each solves a different problem that relational databases handle poorly.

## Why NoSQL Exists

Relational databases are excellent for structured, consistent data with complex relationships. They struggle with:

1. **Horizontal scale** — Adding more write capacity requires sharding, which is operationally complex in an RDBMS. NoSQL databases were often designed with distribution in mind from the start.
2. **Flexible schemas** — ALTER TABLE is painful at scale. Document databases accept any JSON structure.
3. **Specific access patterns** — A B-tree index for key-value lookups at a million requests per second is overkill. A key-value store with in-memory hash tables is more efficient.
4. **Specialized data structures** — Graphs, time-series, and geospatial data have specialized query patterns that relational databases handle awkwardly.

## The CAP Theorem

CAP says a distributed database can guarantee at most 2 of 3 properties simultaneously:

- **Consistency (C)** — Every read sees the most recent write (or an error). All nodes return the same data at the same time.
- **Availability (A)** — Every request receives a response (not necessarily the most recent data).
- **Partition Tolerance (P)** — The system continues operating even when network partitions (message loss/delay between nodes) occur.

Network partitions are inevitable in distributed systems (they happen regularly). So the practical choice is **CP vs AP**:

- **CP databases** (prioritize Consistency over Availability during partitions): HBase, MongoDB in strong consistency mode, Spanner. During a network partition, the system may refuse requests rather than return stale data.
- **AP databases** (prioritize Availability over Consistency during partitions): Cassandra, DynamoDB, CouchDB. During a network partition, the system returns the best available (potentially stale) data.

**Important:** This is specifically about behavior during partition events. In normal operation (no partitions), databases can provide both consistency and availability.

## Eventual Consistency

Most AP databases use **eventual consistency**: if no new updates are made, all replicas will eventually converge to the same value. The word "eventually" is key — during the convergence period, different replicas may return different data.

**Practical implications:**
- A write to Cassandra may not be visible to all reads immediately
- Two users writing the same record simultaneously may cause conflicts resolved by last-write-wins or application logic
- Read-your-own-writes consistency (you always see your own writes) often requires routing to the same replica or using session tokens

Strong consistency is possible in distributed databases — it just requires coordination (quorum reads/writes) at a performance cost.

## The Four NoSQL Categories

### 1. Document Databases
Store JSON/BSON documents. Each document is self-contained. No schema required.

**Examples:** MongoDB, CouchDB, Firestore
**Use when:** Data is hierarchical or nested (blog posts with comments, orders with line items), schema evolves frequently, you need flexible querying on document fields

### 2. Key-Value Stores
Map a key to an arbitrary blob. Simplest data model, highest performance.

**Examples:** Redis, DynamoDB (in KV mode), Memcached, etcd
**Use when:** You know the key you're querying, you need sub-millisecond latency, caching sessions, rate limiting, feature flags

### 3. Wide-Column Stores
Tables with rows identified by a key, but columns are dynamic per row. Optimized for time-series and huge datasets with defined query patterns.

**Examples:** Apache Cassandra, HBase, Google Bigtable
**Use when:** Time-series data (IoT, metrics), write-heavy workloads, queries are well-defined and access patterns don't change

### 4. Graph Databases
Store entities (nodes) and relationships (edges) as first-class citizens. Graph traversals are O(depth) not O(table size).

**Examples:** Neo4j, Amazon Neptune, TigerGraph
**Use when:** Relationships between entities ARE the data — social networks, fraud detection, recommendation engines, knowledge graphs

## Choosing Between Relational and NoSQL

| Scenario | Recommended |
|---|---|
| Financial transactions, banking | RDBMS (ACID critical) |
| User profiles with varied attributes | Document DB |
| Session storage, caching | Key-value (Redis) |
| Social graph, friend-of-friend | Graph DB |
| IoT sensor data, metrics | Wide-column (Cassandra) |
| Product catalog with search | Document DB + search engine |
| Audit logs, append-only events | Wide-column or document |
| General business application | RDBMS (PostgreSQL) |

**When in doubt: start with PostgreSQL.** It supports JSON columns (JSONB) for flexible schemas, arrays, full-text search, and can handle far more than most applications need. Move to a specialized database only when you hit a concrete, measurable limitation.`,
          interviewQuestions: [
            {
              question: "Explain the CAP theorem and how it affects your database choice.",
              answer: "CAP states a distributed database can guarantee only 2 of: Consistency (all nodes return the same data), Availability (every request gets a response), and Partition Tolerance (system works during network splits). Since network partitions are unavoidable, the real choice is CP vs AP. CP databases (HBase, MongoDB strong mode) refuse requests during partitions to avoid returning stale data — choose for financial systems where consistency is critical. AP databases (Cassandra, DynamoDB) return potentially stale data during partitions but remain available — choose for high-availability systems where slightly stale data is acceptable (social feeds, shopping carts). Single-node RDBMS avoids the CAP constraint (no distribution) but can't scale writes horizontally.",
              difficulty: "senior" as const,
            },
          ],
        },
        {
          id: "document-databases",
          title: "Document Databases: MongoDB",
          duration: 50,
          type: "lesson" as const,
          description: "Learn MongoDB's document model, query language, indexes, aggregation pipeline, replication, and sharding — and the patterns where document databases excel.",
          content: `# Document Databases: MongoDB

MongoDB stores data as **BSON documents** (Binary JSON) in collections. Unlike relational tables where every row has the same columns, MongoDB documents in the same collection can have completely different fields.

## The Document Model

\`\`\`javascript
// A single MongoDB document (stored as BSON, shown as JSON)
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),  // auto-generated unique ID
  "username": "jsmith",
  "email": "john@example.com",
  "profile": {                           // nested object
    "firstName": "John",
    "lastName": "Smith",
    "avatar": "https://cdn.example.com/avatars/jsmith.jpg"
  },
  "roles": ["user", "moderator"],        // array of scalars
  "orders": [                            // array of embedded documents
    {
      "orderId": "ORD-2024-001",
      "total": 89.99,
      "items": [
        { "productId": "PROD-42", "qty": 2, "price": 29.99 },
        { "productId": "PROD-17", "qty": 1, "price": 30.01 }
      ]
    }
  ],
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "metadata": {
    "source": "web",
    "ipAddress": "192.168.1.100"
  }
}
\`\`\`

All related data in one document. No joins needed to fetch a user and their profile and their recent orders — it's all there.

## CRUD Operations

\`\`\`javascript
// Connect
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('myapp');
const users = db.collection('users');

// INSERT
await users.insertOne({ username: 'alice', email: 'alice@example.com', roles: ['user'] });
await users.insertMany([{ username: 'bob' }, { username: 'charlie' }]);

// FIND — query by field value
await users.findOne({ username: 'alice' });

// Comparison operators: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin
await users.find({
  'profile.age': { $gte: 18, $lte: 65 },
  roles: { $in: ['admin', 'moderator'] }
}).toArray();

// Logical operators
await users.find({
  $or: [
    { email: /example.com$/ },    // regex match
    { 'profile.company': 'Acme' }
  ]
}).toArray();

// Projection (select which fields to return)
await users.find({}, {
  projection: { username: 1, email: 1, _id: 0 }
}).toArray();

// UPDATE
await users.updateOne(
  { username: 'alice' },
  {
    $set: { 'profile.lastName': 'Wonder' },   // set specific fields
    $push: { roles: 'editor' },                // append to array
    $inc: { loginCount: 1 },                   // increment
    $currentDate: { lastModified: true }
  }
);

// Upsert (insert if not found)
await users.updateOne(
  { username: 'dave' },
  { $setOnInsert: { email: 'dave@example.com', createdAt: new Date() } },
  { upsert: true }
);

// DELETE
await users.deleteOne({ username: 'alice' });
await users.deleteMany({ 'profile.inactive': true, lastLogin: { $lt: new Date('2022-01-01') } });
\`\`\`

## Indexes in MongoDB

\`\`\`javascript
// Single field index
await users.createIndex({ email: 1 }, { unique: true });

// Compound index
await users.createIndex({ 'profile.country': 1, createdAt: -1 });

// Partial index (only active users)
await users.createIndex(
  { email: 1 },
  { partialFilterExpression: { active: { $eq: true } } }
);

// Text search index
await db.collection('posts').createIndex({ title: 'text', body: 'text' });
await db.collection('posts').find({ $text: { $search: 'mongodb indexing tutorial' } });

// Check which index a query used
await users.find({ email: 'john@example.com' }).explain('executionStats');
\`\`\`

## Aggregation Pipeline

The aggregation pipeline transforms documents through stages (like Unix pipes). Each stage takes documents in, transforms them, outputs documents out.

\`\`\`javascript
// Revenue by country, top 10
await orders.aggregate([
  // Stage 1: Filter
  { $match: {
    createdAt: { $gte: new Date('2024-01-01') },
    status: 'completed'
  }},

  // Stage 2: Join with users collection
  { $lookup: {
    from: 'users',
    localField: 'userId',
    foreignField: '_id',
    as: 'user'
  }},

  // Stage 3: Unwind the joined array
  { $unwind: '$user' },

  // Stage 4: Group by country
  { $group: {
    _id: '$user.profile.country',
    totalRevenue: { $sum: '$total' },
    orderCount: { $sum: 1 },
    avgOrderValue: { $avg: '$total' }
  }},

  // Stage 5: Sort
  { $sort: { totalRevenue: -1 } },

  // Stage 6: Limit
  { $limit: 10 },

  // Stage 7: Reshape output
  { $project: {
    country: '$_id',
    totalRevenue: { $round: ['$totalRevenue', 2] },
    orderCount: 1,
    avgOrderValue: { $round: ['$avgOrderValue', 2] },
    _id: 0
  }}
]).toArray();
\`\`\`

## Data Modeling Patterns

**Embedding vs Referencing** — The fundamental MongoDB modeling decision:

**Embed** (put sub-documents inside the parent) when:
- The child data is only accessed alongside the parent (order items with an order)
- The child data has bounded size (a user won't have millions of comments)
- Strong read performance for the parent+child together

**Reference** (store IDs, join at query time with $lookup) when:
- The child entity is accessed independently
- The relationship is many-to-many
- The child data grows unboundedly (user's activity log)

\`\`\`javascript
// Embedding: order with items (items only make sense with their order)
{
  "_id": "ORD-001",
  "userId": ObjectId("..."),
  "items": [{ "productId": "PROD-1", "qty": 2 }],  // embedded
  "total": 59.98
}

// Referencing: posts with comments (comments are many, accessed independently)
// Post document:
{ "_id": ObjectId("post123"), "title": "MongoDB Modeling", "authorId": ObjectId("...") }

// Comment documents (separate collection, reference post):
{ "_id": ObjectId("..."), "postId": ObjectId("post123"), "text": "Great post!", "userId": ObjectId("...") }
\`\`\`

## Transactions

MongoDB 4.0+ supports multi-document ACID transactions (on replica sets):

\`\`\`javascript
const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await accounts.updateOne(
      { _id: fromId },
      { $inc: { balance: -amount } },
      { session }
    );
    await accounts.updateOne(
      { _id: toId },
      { $inc: { balance: +amount } },
      { session }
    );
  });
} finally {
  session.endSession();
}
\`\`\`

## Replication and Sharding

**Replica Set** — A group of MongoDB instances that maintain the same data. One primary handles writes; 2+ secondaries replicate changes. If the primary fails, an election automatically promotes a secondary (typically < 30 seconds).

\`\`\`bash
# Initiate a 3-node replica set
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})
\`\`\`

**Sharded Cluster** — For datasets too large for one replica set. Data is partitioned across multiple shards by a shard key. Each shard is itself a replica set.`,
          interviewQuestions: [
            {
              question: "When would you embed documents vs reference them in MongoDB?",
              answer: "Embed when: the child data is always accessed with the parent (order line items with an order), the child set is bounded in size (a user's last 5 notifications), and read performance matters more than update flexibility. Reference when: the child entity is accessed independently without the parent, the relationship is many-to-many (users and groups), or the child data grows unboundedly (a user's entire activity log would make the document exceed MongoDB's 16 MB document size limit). Embedding avoids joins (faster reads) but makes updating child documents harder. Referencing enables independent access but requires $lookup (similar to a SQL JOIN) which is slower and doesn't support all index optimizations.",
              difficulty: "mid" as const,
            },
          ],
        },
        {
          id: "wide-column-timeseries",
          title: "Wide-Column Stores: Cassandra & Time-Series Databases",
          duration: 50,
          type: "lesson" as const,
          description: "Master Apache Cassandra's data model, partition keys, clustering columns, and tunable consistency — plus time-series databases like InfluxDB for metrics and IoT data.",
          content: `# Wide-Column Stores: Cassandra & Time-Series Databases

## Apache Cassandra

Cassandra is a distributed wide-column store designed for massive write throughput with no single point of failure. It was built by Facebook to handle the inbox search problem at scale — billions of writes per day across geographically distributed data centres.

### Core Concepts

**Keyspace** — Equivalent to a database. Specifies replication factor and strategy.

**Table** — Looks like a relational table but behaves very differently. Every table must have a primary key, and ALL queries must filter on the primary key.

**Partition key** — Determines which node(s) in the cluster store the data. All rows with the same partition key live on the same node (and its replicas). This is why partition key selection is critical: a good partition key distributes data evenly across nodes.

**Clustering columns** — Additional primary key columns that sort data within a partition. Cassandra stores rows within a partition in sorted order by clustering columns, making range queries on clustering columns fast.

**Wide rows** — A partition can contain millions of rows (all stored together on the same node, sorted). This enables the "time-series in a partition" pattern: store all events for a device in one partition, sorted by timestamp.

\`\`\`sql
-- Create keyspace with replication
CREATE KEYSPACE myapp
  WITH replication = {
    'class': 'NetworkTopologyStrategy',
    'us-east': 3,    -- 3 replicas in us-east datacenter
    'eu-west': 3     -- 3 replicas in eu-west datacenter
  };

-- Time-series table for IoT sensor readings
-- Data model: sensor readings partitioned by sensor_id + date
-- All readings for a sensor on a given day are in one partition
-- Sorted by timestamp within the partition
CREATE TABLE sensor_readings (
  sensor_id    UUID,
  date         DATE,           -- partition key includes date to limit partition size
  timestamp    TIMESTAMP,      -- clustering column (sorted within partition)
  temperature  DECIMAL,
  humidity     DECIMAL,
  pressure     DECIMAL,
  PRIMARY KEY ((sensor_id, date), timestamp)    -- composite partition key + clustering column
) WITH CLUSTERING ORDER BY (timestamp DESC);   -- newest readings first

-- Insert readings (Cassandra INSERT is an upsert by default)
INSERT INTO sensor_readings (sensor_id, date, timestamp, temperature)
VALUES (uuid(), '2024-01-15', toTimestamp(now()), 22.5);

-- Query all readings for a sensor today (efficient — partition key specified)
SELECT * FROM sensor_readings
WHERE sensor_id = a1b2c3d4-... AND date = '2024-01-15';

-- Query recent readings for a sensor (uses clustering column sort order)
SELECT * FROM sensor_readings
WHERE sensor_id = a1b2c3d4-... AND date = '2024-01-15'
AND timestamp > '2024-01-15 12:00:00'
LIMIT 100;
\`\`\`

### Tunable Consistency

Cassandra lets you choose the consistency level **per query**. With a replication factor of 3:

\`\`\`
QUORUM = ceil(3/2) = 2 nodes must respond
ONE = 1 node must respond (fastest, least consistent)
ALL = all 3 nodes must respond (slowest, most consistent)
LOCAL_QUORUM = quorum within local datacenter only
\`\`\`

\`\`\`python
from cassandra.cluster import Cluster
from cassandra import ConsistencyLevel
from cassandra.query import SimpleStatement

cluster = Cluster(['cassandra-node1', 'cassandra-node2'])
session = cluster.connect('myapp')

# Strong consistency: write AND read at QUORUM (guarantees you read your writes)
stmt = SimpleStatement(
    "INSERT INTO sensor_readings (sensor_id, date, timestamp, temperature) VALUES (%s, %s, %s, %s)",
    consistency_level=ConsistencyLevel.LOCAL_QUORUM
)
session.execute(stmt, [sensor_id, date, timestamp, temp])

# Fast read, eventual consistency
read_stmt = SimpleStatement(
    "SELECT * FROM sensor_readings WHERE sensor_id=%s AND date=%s LIMIT 100",
    consistency_level=ConsistencyLevel.ONE
)
\`\`\`

**The formula:** If write consistency + read consistency > replication factor → you're guaranteed to read your own writes.

QUORUM + QUORUM = 2 + 2 = 4 > 3 → consistent
ONE + ONE = 1 + 1 = 2 ≤ 3 → possibly stale

### Cassandra Anti-Patterns

**ALLOW FILTERING** — Cassandra can't filter on non-primary-key columns without scanning all partitions. \`ALLOW FILTERING\` enables it but causes a full cluster scan. Never use in production:
\`\`\`sql
-- This scans the entire cluster — avoid:
SELECT * FROM sensor_readings WHERE temperature > 30 ALLOW FILTERING;
-- Solution: model the query with temperature in the primary key, or use a secondary index
\`\`\`

**Unbounded partitions** — If you don't include a time bucket (date/hour) in the partition key, all data for an entity goes in one partition. A partition with billions of rows causes hotspots and OOM on that node. Always bucket time-series data.

**Lightweight Transactions (CAS)** — Cassandra supports compare-and-set with \`IF NOT EXISTS\` / \`IF condition\`, but they use Paxos consensus — they're 4x slower than normal writes. Use sparingly.

## Time-Series Databases

For metrics, monitoring, IoT, and financial data — data that arrives in time-ordered streams and is almost always queried by time range — purpose-built time-series databases outperform general-purpose databases by 10-100x.

### InfluxDB

InfluxDB uses a columnar storage engine optimized for time-series:

\`\`\`
Measurement (≈ table): "cpu_usage"
Tags (indexed, string): {host: "web-01", region: "us-east"}
Fields (not indexed, numeric): {usage_percent: 72.4, load_1m: 2.3}
Timestamp: 2024-01-15T10:30:00Z
\`\`\`

\`\`\`python
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS

client = InfluxDBClient(url="http://influxdb:8086", token="mytoken", org="myorg")
write_api = client.write_api(write_options=SYNCHRONOUS)

# Write a point
point = (
    Point("cpu_usage")
    .tag("host", "web-01")
    .tag("region", "us-east")
    .field("usage_percent", 72.4)
    .field("load_1m", 2.3)
)
write_api.write(bucket="metrics", record=point)

# Query with Flux (InfluxDB query language)
query_api = client.query_api()
query = '''
from(bucket: "metrics")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "cpu_usage" and r.host == "web-01")
  |> aggregateWindow(every: 5m, fn: mean)
  |> yield(name: "mean_cpu")
'''
result = query_api.query(query)
\`\`\`

**Retention policies** — Automatically delete old data. Raw metrics at 1-second resolution kept for 7 days; downsampled hourly averages kept for 1 year:

\`\`\`
bucket "raw_metrics": retention = 7 days
bucket "hourly_metrics": retention = 365 days

# Continuous query (downsampling task)
Task every 1h:
  SELECT mean(usage_percent) FROM raw_metrics
  WHERE time > now() - 1h
  GROUP BY time(1h), host
  INTO hourly_metrics
\`\`\`

### When to Use Time-Series DBs vs Cassandra

| | Cassandra | InfluxDB / TimescaleDB |
|---|---|---|
| Query model | CQL (SQL-like, partition key required) | SQL / Flux with time functions |
| Write throughput | Millions/sec, multi-DC | High, single cluster |
| Compression | Standard | 10-100x compression (columnar + delta encoding) |
| Retention policies | Manual TTL per row | Automatic policy-based |
| Downsampling | Manual | Built-in continuous queries |
| Best for | IoT at Cassandra scale, multi-DC | Application metrics, monitoring |

TimescaleDB (PostgreSQL extension) is a popular middle ground: it adds time-series optimizations (automatic hypertable partitioning, compression, continuous aggregates) to PostgreSQL, so you keep SQL and ACID while getting time-series performance.`,
          interviewQuestions: [
            {
              question: "Why must you design your data model around query patterns in Cassandra, unlike in a relational database?",
              answer: "In a relational database, you normalize data and use indexes to answer ad-hoc queries — the query optimizer figures out how to access the data. In Cassandra, ALL queries must specify the partition key, which determines which node holds the data. Without the partition key, Cassandra would have to broadcast the query to every node (full cluster scan), which doesn't scale. This means you design a separate table for each access pattern. If you need to query users by email AND by phone number, you create two tables with different partition keys. This is called query-driven design: start with the queries you need to answer, then design the tables that answer them efficiently.",
              difficulty: "senior" as const,
            },
          ],
        },
        {
          id: "graph-keyvalue-databases",
          title: "Graph Databases & Key-Value Stores",
          duration: 45,
          type: "lesson" as const,
          description: "Master Neo4j's graph model for relationship-heavy data, and understand when key-value stores like Redis are the right tool — beyond just caching.",
          content: `# Graph Databases & Key-Value Stores

## Graph Databases: Neo4j

Graph databases model data as **nodes** (entities) and **edges** (relationships). Relationships are first-class citizens — they have their own properties and are stored as physical pointers, not computed via joins.

### Why Graphs Excel for Relationships

In a relational database, finding all friends-of-friends requires a self-join on the users table — expensive because the database must compare every user to every other user. In a graph database, you follow pointers from node to node — O(depth of traversal), not O(table size).

Consider finding "people Alice knows within 3 degrees":
- **SQL**: Three nested joins on a friendship table. With 1 million users, this joins millions × millions × millions of rows.
- **Neo4j**: Start at Alice's node, follow KNOWS edges 3 hops. Only visits the nodes and edges actually in Alice's social graph.

### Neo4j Data Model and Cypher

\`\`\`cypher
// Create nodes with labels and properties
CREATE (alice:Person {name: 'Alice', age: 30, city: 'London'})
CREATE (bob:Person {name: 'Bob', age: 28, city: 'Paris'})
CREATE (neo4j:Technology {name: 'Neo4j', category: 'database'})

// Create relationships (with direction and properties)
CREATE (alice)-[:KNOWS {since: 2020, strength: 'close'}]->(bob)
CREATE (alice)-[:USES {since: 2022, proficiency: 'expert'}]->(neo4j)
CREATE (bob)-[:USES {since: 2023, proficiency: 'beginner'}]->(neo4j)

// Find all of Alice's direct friends
MATCH (alice:Person {name: 'Alice'})-[:KNOWS]->(friend:Person)
RETURN friend.name, friend.city

// Find friends-of-friends (2 hops)
MATCH (alice:Person {name: 'Alice'})-[:KNOWS*2]->(fof:Person)
WHERE NOT (alice)-[:KNOWS]->(fof)  // exclude direct friends
RETURN DISTINCT fof.name

// Shortest path between Alice and a specific person
MATCH path = shortestPath(
  (alice:Person {name: 'Alice'})-[:KNOWS*]-(target:Person {name: 'Carol'})
)
RETURN length(path), [n in nodes(path) | n.name]

// Recommendation: people Alice doesn't know who use the same tech
MATCH (alice:Person {name: 'Alice'})-[:USES]->(tech:Technology)<-[:USES]-(other:Person)
WHERE NOT (alice)-[:KNOWS]-(other) AND alice <> other
RETURN other.name, collect(tech.name) as commonTech, count(*) as commonTechCount
ORDER BY commonTechCount DESC
LIMIT 10

// Create index for faster lookups
CREATE INDEX person_name FOR (p:Person) ON (p.name)
\`\`\`

### Real-World Use Cases for Graphs

**Fraud Detection** — Build a graph of transactions, accounts, devices, and IP addresses. A ring of accounts that share devices and IPs and transfer money between each other is a fraud ring — pattern that's trivial to find with graph traversal, nearly impossible with SQL joins.

**Recommendation Engines** — "Users who bought X also bought Y" is a graph pattern. Amazon, Netflix, and Spotify use graph-inspired algorithms (collaborative filtering, knowledge graphs).

**Access Control / RBAC** — Permissions propagate through hierarchies. "Can user Alice access resource R?" means traversing a graph of user → roles → permissions → resources.

**Knowledge Graphs** — Google's Knowledge Graph, LinkedIn's economic graph, and pharmaceutical drug interaction databases are all knowledge graphs.

### When NOT to Use a Graph Database

- Simple key-value or document lookups (use the right tool)
- Data that doesn't have complex relationships
- Your team doesn't know Cypher / graph modeling
- Transaction volumes that require horizontal sharding (Neo4j Community edition is single-server; Enterprise has clustering)

## Key-Value Stores: Redis Beyond Caching

Redis is often described as a cache, but it's more accurately a **data structure server** that happens to have very fast in-memory storage. Its rich data types make it the right tool for many problems beyond object caching.

### Redis Data Types and Use Cases

**Strings** — Atomic get/set with expiry. Cache, counters, rate limiting:
\`\`\`python
import redis
r = redis.Redis()

# Cache with TTL
r.setex('user:123:profile', 3600, json.dumps(user_profile))
profile = r.get('user:123:profile')

# Atomic counter (no race conditions)
r.incr('page:views:/home')
r.incrby('stats:revenue:today', 99)  # add 99

# Rate limiting
def is_rate_limited(user_id):
    key = f'ratelimit:{user_id}:{int(time.time() // 60)}'
    count = r.incr(key)
    if count == 1:
        r.expire(key, 60)
    return count > 100
\`\`\`

**Hashes** — Map of field:value. Efficient for objects (only store/retrieve specific fields):
\`\`\`python
# Store user session (access individual fields without deserializing whole object)
r.hset('session:abc123', mapping={
    'user_id': '42',
    'role': 'admin',
    'last_active': str(time.time())
})
r.expire('session:abc123', 3600)
r.hget('session:abc123', 'user_id')
r.hgetall('session:abc123')
r.hincrby('session:abc123', 'request_count', 1)
\`\`\`

**Lists** — Ordered list with O(1) push/pop from either end. Message queues, activity feeds:
\`\`\`python
# Simple job queue (LPUSH + BRPOP = blocking pop for workers)
r.lpush('jobs:email', json.dumps({'to': 'user@example.com', 'template': 'welcome'}))

# Worker process (blocks until job available, 30s timeout)
job = r.brpop('jobs:email', timeout=30)
if job:
    process_email_job(json.loads(job[1]))

# Activity feed: keep last 100 actions
r.lpush(f'feed:{user_id}', json.dumps(action))
r.ltrim(f'feed:{user_id}', 0, 99)  # keep only first 100
\`\`\`

**Sets** — Unordered unique elements. Set operations (union, intersection, difference):
\`\`\`python
# Track unique visitors per day
r.sadd('visitors:2024-01-15', user_id)
r.expire('visitors:2024-01-15', 86400 * 7)
unique_visitors = r.scard('visitors:2024-01-15')

# Find users who visited both pages (intersection)
r.sinterstore('both_pages', 'visitors:/pricing', 'visitors:/signup')

# Tagging: find all posts tagged "python" AND "tutorial"
r.sadd('tag:python', post_id_1, post_id_2, post_id_3)
r.sadd('tag:tutorial', post_id_1, post_id_4)
result = r.sinter('tag:python', 'tag:tutorial')  # {post_id_1}
\`\`\`

**Sorted Sets (ZSets)** — Elements with a score, sorted by score. Leaderboards, priority queues, time-ordered data:
\`\`\`python
# Leaderboard
r.zadd('leaderboard:global', {'player1': 1500, 'player2': 2300, 'player3': 900})
r.zincrby('leaderboard:global', 100, 'player1')  # player1 scores 100 more points

# Top 10 players
top10 = r.zrevrange('leaderboard:global', 0, 9, withscores=True)

# Player's rank (0-indexed)
rank = r.zrevrank('leaderboard:global', 'player1')

# Delayed job queue (score = scheduled timestamp)
import time
r.zadd('scheduled_jobs', {json.dumps(job): time.time() + delay_seconds})

# Worker: fetch jobs due for execution
due_jobs = r.zrangebyscore('scheduled_jobs', 0, time.time(), start=0, num=10)
\`\`\`

**Streams** — Append-only log (like Kafka for lightweight use cases). Event sourcing, change data capture:
\`\`\`python
# Produce events
r.xadd('user-events', {'user_id': '42', 'event': 'purchase', 'amount': '99.99'})

# Consumer group (multiple consumers share the stream)
r.xgroup_create('user-events', 'analytics-consumers', id='0', mkstream=True)

# Consumer reads messages
messages = r.xreadgroup('analytics-consumers', 'consumer-1', {'user-events': '>'}, count=10)
\`\`\`

### Redis Persistence

Redis is in-memory first, but it supports two persistence modes:
- **RDB (snapshotting)**: Periodic point-in-time snapshots to disk. Fast restarts, potential data loss between snapshots.
- **AOF (Append Only File)**: Logs every write operation. Near-zero data loss, slower restarts.

For critical data, use AOF with \`fsync: everysec\` (at most 1 second of data loss). For pure caching, RDB is sufficient.

## Choosing Between NoSQL Options

| Need | Solution |
|---|---|
| Flexible JSON documents, complex queries | MongoDB |
| Massive write throughput, time-series, multi-DC | Cassandra |
| Sub-millisecond reads, caching, counters, queues | Redis |
| Relationship traversal, graph algorithms | Neo4j |
| Application metrics, IoT sensor data | InfluxDB / TimescaleDB |
| Full-text search | Elasticsearch / OpenSearch |`,
          interviewQuestions: [
            {
              question: "Give three use cases for Redis beyond simple key-value caching.",
              answer: "1) Rate limiting: INCR on a key with per-minute TTL provides atomic, race-condition-free request counting across multiple application instances. 2) Leaderboards: Sorted Sets maintain a score-ordered ranking with O(log N) updates and O(log N + K) range queries — perfect for gaming leaderboards or trending content. 3) Distributed locking: SET key value NX EX 30 atomically sets a key only if it doesn't exist with a 30-second expiry — used to ensure only one process runs a critical section (e.g., cron job). Also: session storage, pub/sub, delayed job queues (ZSet with timestamp as score), real-time counters, and lightweight event streaming (Streams).",
              difficulty: "mid" as const,
            },
            {
              question: "Why are graph databases faster than relational databases for relationship traversal?",
              answer: "In a relational database, finding all friends-of-friends requires a self-join: JOIN friendships f1 ON f1.user_id = alice_id JOIN friendships f2 ON f2.user_id = f1.friend_id. The database must evaluate this join across all rows in the friendships table — O(N²) or worse with multiple hops. In a graph database, relationships are stored as physical pointers between nodes. Traversal follows pointers: read Alice's node → follow KNOWS edges → read friend nodes → follow their KNOWS edges. This is O(depth × average degree) — independent of total graph size. A 3-hop traversal in a 1-billion-node graph visits only the nodes actually in Alice's neighborhood, not all 1 billion.",
              difficulty: "senior" as const,
            },
          ],
        },
      ],
      exam: [
        { question: "Your e-commerce application stores orders in PostgreSQL but analytics queries (revenue by country, daily active users) are taking 30+ seconds and slowing the main database. What do you do?", answer: "Short-term: Add a read replica and route analytics queries to it so they don't compete with transactional workloads. Medium-term: Set up a nightly ETL/ELT to copy data to a data warehouse (Redshift, BigQuery, or Snowflake) optimized for analytical queries with columnar storage and MPP. This separates OLTP (transactional) and OLAP (analytics) workloads entirely. Long-term: Implement a streaming pipeline (Debezium CDC → Kafka → data warehouse) for near-real-time analytics. Never run heavy analytics directly against your primary OLTP database.", difficulty: "mid" as const },
        { question: "Describe three scenarios where you would choose MongoDB over PostgreSQL.", answer: "1) Rapidly evolving schema — you're building a product where the data model changes weekly. ALTER TABLE at scale blocks writes; MongoDB accepts any valid JSON without schema changes. 2) Hierarchical/nested data that's always accessed together — a product catalog where each product has different specifications (electronics vs clothing vs books), nested arrays of reviews, and variant attributes. Modeling in relational tables requires many JOINs; one MongoDB document per product maps naturally. 3) Horizontal write scaling in early architecture — if you know you'll need to distribute writes across geographic regions from the start, Cassandra or MongoDB's sharding is designed for this; PostgreSQL sharding (Citus, etc.) adds operational complexity. Don't choose MongoDB for: financial transactions (use PostgreSQL ACID), complex queries with many joins, or data with well-defined schemas.", difficulty: "mid" as const },
        { question: "How does Cassandra achieve fault tolerance without a primary node?", answer: "Cassandra uses a peer-to-peer ring architecture with consistent hashing. Data is distributed across nodes based on a hash of the partition key. Each piece of data is replicated to N nodes (replication factor) — typically 3. With RF=3, the cluster can lose any 2 nodes and still have all data. There's no single primary — any node can serve any request. Reads and writes use a consistency level to determine how many nodes must respond: QUORUM (2 of 3) gives strong consistency while tolerating 1 node failure; ONE gives maximum availability. If a node is down during a write, hinted handoff stores the write temporarily on another node and delivers it when the target node returns. This design means there's no master election, no split-brain, and no planned downtime for failover.", difficulty: "senior" as const },
        { question: "When would you use a time-series database instead of PostgreSQL for storing metrics?", answer: "Use a time-series database (InfluxDB, TimescaleDB, Prometheus) when: 1) Write volume is very high — millions of data points per second from IoT devices or application metrics. PostgreSQL handles writes well but the overhead of row-level MVCC and WAL doesn't compress to time-series compression ratios (10-100x with delta encoding + columnar storage). 2) You need automatic retention policies — automatically delete raw data older than 7 days while keeping downsampled hourly averages for 1 year. With PostgreSQL, you manage partitions manually. 3) You need time-aware query functions built in — time_bucket(), rate(), derivative(), moving_average() are native in time-series DBs, awkward in SQL. TimescaleDB is a PostgreSQL extension that adds these capabilities, letting you keep SQL and ACID while getting time-series performance — often the best compromise.", difficulty: "senior" as const },
      ],
    },
  ],
};
