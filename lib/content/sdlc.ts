import type { Track } from "./types";

export const sdlcTrack: Track = {
  id: "sdlc",
  title: "Software Development Lifecycle",
  description: "Master every phase of the SDLC — from requirements and design through development, testing, deployment, and maintenance — with modern agile practices, code review workflows, and comprehensive testing strategies.",
  longDescription: "The Software Development Lifecycle defines how software is conceived, built, validated, and maintained. This track walks through every phase — requirements gathering, system design, implementation, all testing types (unit, integration, E2E, performance, security), release, and post-production operations — with practical techniques for each stage.",
  icon: "GitBranch",
  color: "#8b5cf6",
  gradient: "track-sdlc-gradient",
  tags: ["SDLC", "Agile", "Scrum", "Testing", "Requirements", "System Design", "Code Review"],
  level: "beginner",
  estimatedHours: 16,
  modules: [
    // MODULE 1 — SDLC Foundations
    {
      id: "sdlc-foundations",
      title: "SDLC Phases & Methodologies",
      level: "beginner",
      description: "Understand the complete software development lifecycle — from requirements through maintenance — and the methodologies (Waterfall, Agile, Scrum, Kanban) that structure the process.",
      lessons: [
        {
          id: "sdlc-overview",
          title: "SDLC Phases: From Idea to Production",
          duration: 45,
          type: "lesson" as const,
          description: "Walk through every phase of the SDLC — requirements, design, development, testing, deployment, and maintenance — understanding what happens at each stage and why the sequence matters.",
          content: `# SDLC Phases: From Idea to Production

The Software Development Lifecycle (SDLC) is the structured process teams use to plan, create, test, and deliver software. Every software project goes through these phases — the difference between teams is how explicitly they follow them and in what order.

## Phase 1: Requirements Gathering & Analysis

This is where most software projects fail — not in coding, but in understanding what to build. The goal is to produce a clear, unambiguous description of what the software must do.

**Business Requirements** — What problem does the software solve? Written in business language, not technical terms. "Users must be able to pay with saved payment methods" not "Implement idempotent Stripe charge API calls."

**Functional Requirements** — Specific behaviors the system must exhibit. Often written as user stories or use cases:
\`\`\`
User Story: As a customer, I want to filter products by price range
             so that I can find items within my budget.

Acceptance Criteria:
  - Price range has min and max inputs
  - Filters apply without page reload
  - URL updates to reflect filter state (shareable link)
  - Results update as user drags price slider
  - Filter persists across browser navigation
\`\`\`

**Non-Functional Requirements (NFRs)** — Quality attributes that constrain how the system works, not what it does:
- **Performance**: API P95 response time < 200ms under 1000 concurrent users
- **Availability**: 99.9% uptime (8.7 hours downtime/year maximum)
- **Security**: All PII encrypted at rest and in transit; OWASP Top 10 mitigated
- **Scalability**: System must handle 10x current traffic without architecture changes
- **Usability**: New users can complete primary flow without documentation

**Pitfalls:**
- "The system must be fast" — not a requirement, unmeasurable
- Missing edge cases ("what happens if the user cancels during payment?")
- Unstated assumptions ("we assumed users would always have internet")

**Artifacts:** Requirements document (PRD), user stories in Jira/Linear, acceptance criteria, use case diagrams.

## Phase 2: System Design

Once you know WHAT to build, you design HOW to build it. Good design decisions at this phase prevent expensive refactoring months later.

**High-Level Design (HLD)** — The overall architecture:
- What services/components exist?
- How do they communicate?
- What databases and storage layers?
- What third-party integrations?
- How does data flow through the system?

\`\`\`
E-commerce System HLD:

[Mobile/Web Client]
        │
        ▼
[API Gateway / Load Balancer]
        │
   ┌────┴──────────────────────────┐
   │                               │
[Product Service]         [Order Service]
[PostgreSQL: products]    [PostgreSQL: orders]
[Redis: product cache]    [Redis: cart sessions]
        │                          │
        └────────────┬─────────────┘
                     │
            [Message Queue: RabbitMQ/Kafka]
                     │
            [Notification Service]
            [Email / SMS / Push]
\`\`\`

**Low-Level Design (LLD)** — Detail for each component:
- Database schema (tables, indexes, relationships)
- API contracts (endpoints, request/response formats, error codes)
- Class/module structure
- Algorithm choices (which sorting algorithm, which caching strategy)

**Design Review** — Present designs to senior engineers before building. Finding a flaw in a design document takes 1 hour; finding it in deployed code takes 1 week.

**Artifacts:** Architecture diagrams, API specs (OpenAPI/Swagger), database ERD, sequence diagrams for complex flows.

## Phase 3: Implementation (Development)

The coding phase. In Agile, this happens in short cycles (sprints) rather than one long period.

**Best practices:**
- Feature branches with pull/merge requests for all changes
- Code review before merging (at least one reviewer, often two for critical paths)
- Continuous integration — every commit triggers automated tests
- Feature flags for incomplete features that are being merged incrementally
- Definition of Done: code written, reviewed, tests passing, documentation updated

**Definition of Done (DoD)** — A checklist a team agrees defines when work is complete:
\`\`\`
✓ Feature code written and self-reviewed
✓ Unit tests written and passing (coverage maintained)
✓ Integration tests written for new API endpoints
✓ PR reviewed and approved by 2 engineers
✓ No new SAST findings above severity Medium
✓ API documentation updated
✓ Feature flag configured for gradual rollout
✓ Deployed to staging and smoke-tested
\`\`\`

## Phase 4: Testing

Testing is not a single phase — it runs continuously throughout development. See the Testing module for full coverage of each testing type.

**Testing pyramid** — Most tests should be fast unit tests; fewer slow E2E tests:
\`\`\`
         /\\
        /  \\ ← E2E tests (slow, brittle, high confidence)
       /----\\
      / Integ \\← Integration tests (medium speed, test boundaries)
     /----------\\
    /  Unit Tests \\ ← Fast, many, test logic in isolation
   /--------------\\
\`\`\`

## Phase 5: Deployment

Moving software from a tested environment to production. Modern deployments are automated, incremental, and reversible.

**Environments:**
- **Development (Dev)**: Deployed automatically on every merge to main. Used by developers for integration testing.
- **Staging**: Mirror of production. Full E2E and performance tests run here. Manual QA and stakeholder review.
- **Production**: Live user-facing system. Deployed with manual approval gates and canary strategies.

**Deployment strategies:**
- **Rolling**: Replace instances one at a time. Zero downtime, but both versions run simultaneously during the rollout.
- **Blue/Green**: Run two identical environments, switch traffic. Instant rollback.
- **Canary**: Route small percentage (5%) to new version, monitor, gradually increase. Catch regressions with minimal impact.

## Phase 6: Maintenance & Operations

Most software spends 80% of its life in this phase. It includes:
- **Bug fixes** — production incidents, regression fixes
- **Performance optimization** — as scale increases, bottlenecks emerge
- **Security patches** — CVEs in dependencies, security findings from audits
- **Feature enhancements** — iterating on launched features
- **Technical debt reduction** — refactoring, upgrading dependencies

**Key operational practices:**
- On-call rotation for production incidents
- Post-mortem process for significant incidents
- Monitoring and alerting (you can't fix what you can't see)
- Runbooks for common operational procedures

## SDLC Models: How to Sequence the Phases

### Waterfall
Sequential phases, each fully completed before the next begins. Requirements → Design → Build → Test → Deploy. Used for projects with fixed requirements (hardware, regulatory, government contracts). The problem: feedback arrives too late — a design flaw discovered in testing costs 10x more than if caught in the design review.

### Agile
Iterative cycles (sprints, typically 2 weeks) that include all phases in miniature. You gather requirements, design, build, and test a small slice of functionality in each sprint. Working software delivered every 2 weeks; feedback incorporated continuously. The dominant model for modern software.

### Scrum
A specific Agile framework with defined roles (Product Owner, Scrum Master, Development Team), ceremonies (Sprint Planning, Daily Standup, Sprint Review, Retrospective), and artifacts (Product Backlog, Sprint Backlog, Increment).

\`\`\`
Product Backlog (all requirements)
         │
         ▼
Sprint Planning → Sprint Backlog (this sprint's work)
         │
         ▼
2-Week Sprint → Daily Standups (What did I do? What will I do? Blockers?)
         │
         ▼
Sprint Review (demo to stakeholders)
         │
         ▼
Sprint Retrospective (what went well? what to improve?)
         │
         └──→ Next Sprint
\`\`\`

### Kanban
Continuous flow rather than time-boxed sprints. Work items flow through columns (To Do → In Progress → In Review → Done). WIP limits prevent overload. Good for operations teams and support work where demand is unpredictable.

### DevOps and CI/CD
Not a methodology but a culture and practice: development and operations work together, with automation collapsing the time between "code written" and "code in production." CI/CD pipelines automate building, testing, and deploying on every commit.`,
          interviewQuestions: [
            {
              question: "What is the difference between functional and non-functional requirements? Give examples.",
              answer: "Functional requirements describe specific behaviors — what the system does. Example: 'Users must be able to reset their password via email link.' Non-functional requirements describe quality attributes — how well the system does it. Examples: 'Password reset email must arrive within 30 seconds (performance),' 'The system must be available 99.9% of the time (availability),' 'Passwords must be stored with bcrypt, minimum cost factor 12 (security).' Non-functional requirements are often harder to discover and test, but failure to meet them causes major production incidents — a system that's functionally correct but takes 10 seconds to respond is a failed system.",
              difficulty: "junior" as const,
            },
            {
              question: "Why is Agile more effective than Waterfall for most software projects?",
              answer: "Waterfall assumes requirements are fully known upfront and won't change — an assumption that's almost never true. By the time a Waterfall project reaches testing (months later), the business has changed, users have new needs, and the original requirements are stale. Agile delivers working software every 2 weeks, getting real user feedback early. Mistakes are caught in sprint 2, not month 8. Changes are expected and accommodated — the cost of a change in sprint 3 is far lower than in month 8 of a Waterfall project. Exceptions where Waterfall works: projects with truly fixed, well-understood requirements (hardware firmware, regulatory compliance systems, construction projects).",
              difficulty: "junior" as const,
            },
          ],
        },
        {
          id: "agile-practices",
          title: "Agile Practices: Scrum, Backlog, and Team Workflows",
          duration: 40,
          type: "lesson" as const,
          description: "Learn the practical day-to-day of Agile development — backlog refinement, sprint ceremonies, estimation, Definition of Done, and how engineering teams collaborate effectively.",
          content: `# Agile Practices: Scrum, Backlog, and Team Workflows

## The Product Backlog

The product backlog is the single source of truth for all work the team might do. It's an ordered list — highest priority at the top. The Product Owner owns and orders it; the team provides estimates to inform ordering.

**Good backlog items:**
- Written as user stories: "As a [user], I want to [action] so that [benefit]"
- Have clear acceptance criteria
- Are small enough to complete in one sprint
- Are "three amigos" reviewed (Product Owner + Developer + QA)

**Backlog refinement** (also called grooming) — A regular meeting (usually weekly, 1 hour) where the team:
1. Reviews upcoming backlog items for clarity
2. Asks clarifying questions to the Product Owner
3. Estimates complexity (story points or t-shirt sizes)
4. Identifies dependencies and technical risks
5. Breaks large stories (epics) into smaller, sprint-sized items

\`\`\`
BEFORE refinement:
Epic: "Improve checkout"

AFTER refinement (broken into sprint-sized stories):
Story 1: Add address autocomplete to checkout form
  - AC: Address autocomplete uses Google Places API
  - AC: Autocomplete suggests after 3 characters
  - AC: Selecting a suggestion fills all address fields
  - Estimate: 3 points

Story 2: Remember billing address for returning customers
  - AC: Logged-in users see saved billing address pre-filled
  - AC: User can select "use different address"
  - AC: New address can be saved for future use
  - Estimate: 5 points

Story 3: Show estimated delivery date during checkout
  - AC: Delivery date calculated from carrier API
  - AC: Date shown before payment step
  - Estimate: 8 points
\`\`\`

## Story Points and Estimation

Story points measure **complexity and uncertainty**, not time. Teams typically use Fibonacci numbers (1, 2, 3, 5, 8, 13, 21) because the gaps convey increasing uncertainty.

- **1 point**: Trivially small, well-understood. Change a label, add a config value.
- **3 points**: Small, clear. A new API endpoint with known implementation.
- **5 points**: Medium complexity. Some uncertainty, might need research.
- **8 points**: Complex or uncertain. Multiple components, possible unknowns.
- **13+ points**: Too big or too uncertain. Break it down.

**Planning Poker** — Each developer privately chooses their estimate, then everyone reveals simultaneously. Outliers discuss their reasoning. This surfaces different assumptions and knowledge gaps.

**Velocity** — The average story points a team completes per sprint. After 3-4 sprints, velocity stabilizes. Useful for forecasting: "At velocity 32, we'll complete the 160-point roadmap in 5 sprints."

## Sprint Ceremonies

**Sprint Planning** (2-4 hours for a 2-week sprint):
1. PO presents top priority backlog items
2. Team asks clarifying questions (acceptance criteria, design?)
3. Team commits to a sprint goal (a coherent objective, not just a list of tickets)
4. Team pulls stories from the backlog until capacity (velocity) is reached
5. Stories are broken into tasks and assigned

**Daily Standup** (15 minutes maximum):
- What did I complete yesterday?
- What will I work on today?
- Any blockers?

The standup is not a status report to management — it's a synchronization point for the team. Blockers are raised here; solutions are discussed outside the standup in smaller groups.

**Sprint Review** (1-2 hours):
- Team demonstrates working software to stakeholders
- PO accepts or rejects stories based on acceptance criteria
- Stakeholders provide feedback that may become new backlog items

**Sprint Retrospective** (1-1.5 hours):
- What went well? (keep doing these things)
- What didn't go well? (stop or change these things)
- What should we try? (experiments for next sprint)

The retrospective is the team's continuous improvement mechanism. Without it, the same problems recur every sprint.

## Code Review Practices

Code review is where knowledge is shared, bugs are caught, and design decisions are validated before they become permanent.

**As an author:**
- Keep PRs small (< 400 lines of changed code)
- Write a clear PR description: what changed and why, how to test, screenshots for UI changes
- Respond to every comment — either implement the change or explain why you disagree
- Don't take review comments personally

**As a reviewer:**
- Review within 24 hours — blocked PRs block the author's work
- Distinguish blocking comments (must fix) from suggestions (consider, non-blocking)
- Ask questions rather than making demands: "What's the reason for this approach?" opens discussion
- Approve when satisfied, even if minor suggestions remain

**What to look for in a review:**
\`\`\`
Correctness: Does it do what the ticket asks?
Edge cases: What happens with null, empty, very large, unexpected input?
Tests: Are they testing the right thing? Would they catch a regression?
Security: SQL injection? XSS? Unvalidated input? Exposed secrets?
Performance: N+1 queries? Missing indexes? Unbounded loops?
Readability: Can a new team member understand this code?
Duplication: Does this exist elsewhere? Should it be refactored?
\`\`\`

**PR size discipline:** The ideal PR is under 300 lines. Reviewers give meaningful feedback on small PRs; they rubber-stamp large ones because reviewing 1000 lines takes more than an hour. If a feature requires 1000 lines, break it into multiple PRs: database migrations first, then model layer, then API, then UI.

## Technical Debt

Technical debt is the implied cost of future rework caused by choosing a quick solution now over a better (slower) one.

**Types of technical debt:**
- **Deliberate**: "We'll hardcode this limit now and make it configurable later" — conscious choice with payback plan
- **Accidental**: Poor design discovered after the fact — the team didn't know better
- **Outdated**: Dependencies and patterns that made sense 2 years ago but are now legacy

**Managing debt:**
- Track it explicitly (tech debt label in Jira, a dedicated column)
- Allocate sprint capacity: 20% of sprint capacity for debt reduction is a common practice
- Refactor when touching existing code — the "scout rule": leave code cleaner than you found it
- Address debt before it becomes a blocker

## Feature Flags

Feature flags (feature toggles) let you merge incomplete features to the main branch without showing them to users. This enables:
- **Trunk-based development** without long-lived branches
- **A/B testing**: show feature to 10% of users
- **Kill switch**: disable a feature if it causes production issues without a deploy

\`\`\`python
from feature_flags import get_flag

def checkout(user, cart):
    if get_flag('new_checkout_flow', user_id=user.id):
        return new_checkout_flow(user, cart)
    else:
        return legacy_checkout_flow(user, cart)
\`\`\`

Feature flag services: LaunchDarkly, Flagsmith, Unleash, AWS AppConfig, or a simple database-backed implementation.`,
          interviewQuestions: [
            {
              question: "What is a sprint retrospective and why is it important?",
              answer: "A sprint retrospective is a team meeting at the end of each sprint (2-week cycle) where the team reflects on how they worked together, not what they built. They discuss what went well (to reinforce), what didn't go well (to fix), and experiments to try next sprint. It's the team's primary mechanism for continuous improvement. Without retrospectives, the same problems repeat sprint after sprint — slow deployments, unclear requirements, test flakiness. Teams that consistently run effective retrospectives improve their velocity and quality over time. The key is that the team owns and drives changes — it's not a manager telling the team what to fix.",
              difficulty: "junior" as const,
            },
          ],
        },
      ],
      exam: [
        { question: "A new feature is needed urgently. The PO wants to skip writing acceptance criteria and go straight to development. What do you say?", answer: "Acceptance criteria are not bureaucracy — they're the definition of what 'done' means for the feature. Without them: 1) Developers make assumptions about behavior that may not match what the PO had in mind — wasted work. 2) QA doesn't know what to test. 3) The PO might reject the feature in review because it doesn't match unstated expectations. Propose a compromise: 30-minute three-amigos session (PO + developer + QA) to write 5-6 clear acceptance criteria. This prevents the multi-day rework that undefined requirements typically cause. 'Moving fast' without criteria usually means 'moving fast twice.'", difficulty: "junior" as const },
        { question: "Your sprint has 10 stories planned. By day 5, the team realizes 3 of them are blocked by an external API that won't be ready until next sprint. What do you do?", answer: "Immediately raise this in the daily standup. The Scrum Master facilitates: 1) Confirm the block is real and won't resolve within the sprint. 2) Remove the blocked stories from the sprint backlog and return them to the product backlog. 3) Sprint goal may need revision — inform the PO. 4) Pull in the highest-priority unblocked items from the backlog to fill capacity. 5) Don't 'keep the stories in the sprint' as incomplete — this inflates velocity metrics and creates false expectations. The retrospective should discuss whether this external dependency was discoverable during refinement.", difficulty: "mid" as const },
      ],
    },

    // MODULE 2 — Testing
    {
      id: "software-testing",
      title: "Software Testing: All Types & Strategies",
      level: "intermediate",
      description: "Master every type of software testing — unit, integration, E2E, performance, security, UAT — understanding what each tests, how to write them, and how they fit into the CI/CD pipeline.",
      lessons: [
        {
          id: "unit-integration-testing",
          title: "Unit & Integration Testing",
          duration: 55,
          type: "lesson" as const,
          description: "Learn how to write effective unit tests, understand mocking and test doubles, avoid common testing anti-patterns, and test service integrations with databases, APIs, and queues.",
          content: `# Unit & Integration Testing

## The Testing Pyramid

Before diving into test types, understand the testing pyramid — a model for how to distribute your tests:

\`\`\`
          /\\
         /  \\ E2E (~10 tests)
        /----\\
       / Integ \\  (~100 tests)
      /----------\\
     /  Unit Tests \\ (~1000 tests)
    /----------------\\
\`\`\`

**Many unit tests, fewer integration tests, fewest E2E tests** — because:
- Unit tests: milliseconds each, test one thing, easy to write and maintain
- Integration tests: seconds each, need real databases/services, more setup
- E2E tests: minutes each, brittle (UI changes break them), full stack

The pyramid gets inverted in practice when teams write too many E2E tests and not enough units, leading to slow, flaky CI pipelines.

## Unit Tests

A unit test verifies a single function or class **in isolation**, with all external dependencies replaced by test doubles (mocks, stubs, fakes).

**What makes a good unit test:**
- **Fast**: < 10ms. Unit tests should run in seconds for the entire suite.
- **Isolated**: No network, no disk, no database. All dependencies are replaced.
- **Deterministic**: Same output for same input, every time. No randomness, no time dependencies.
- **Self-descriptive**: Test name describes the scenario and expected outcome.

**Naming convention: Given/When/Then or should_[do X]_when_[condition Y]**

\`\`\`python
# Python with pytest
import pytest
from unittest.mock import Mock, patch
from app.services.order_service import OrderService
from app.models import Order, Product

class TestOrderService:

    def test_create_order_returns_order_with_correct_total(self):
        # Arrange (Given)
        product = Product(id=1, price=29.99, name="Widget")
        product_repo = Mock()
        product_repo.find_by_id.return_value = product
        payment_service = Mock()
        payment_service.charge.return_value = {"status": "success", "charge_id": "ch_123"}

        service = OrderService(product_repo=product_repo, payment_service=payment_service)

        # Act (When)
        order = service.create_order(user_id=42, product_id=1, quantity=3)

        # Assert (Then)
        assert order.total == 89.97   # 29.99 × 3
        assert order.status == "confirmed"
        payment_service.charge.assert_called_once_with(user_id=42, amount=89.97)

    def test_create_order_raises_when_product_not_found(self):
        product_repo = Mock()
        product_repo.find_by_id.return_value = None

        service = OrderService(product_repo=product_repo, payment_service=Mock())

        with pytest.raises(ValueError, match="Product 999 not found"):
            service.create_order(user_id=42, product_id=999, quantity=1)

    def test_create_order_does_not_charge_if_product_out_of_stock(self):
        product = Product(id=1, price=29.99, stock=0)
        product_repo = Mock()
        product_repo.find_by_id.return_value = product
        payment_service = Mock()

        service = OrderService(product_repo=product_repo, payment_service=payment_service)

        with pytest.raises(ValueError, match="out of stock"):
            service.create_order(user_id=42, product_id=1, quantity=1)

        payment_service.charge.assert_not_called()  # verify no charge happened
\`\`\`

\`\`\`javascript
// JavaScript / TypeScript with Jest
import { OrderService } from './OrderService';
import { ProductRepository } from './ProductRepository';
import { PaymentService } from './PaymentService';

// Jest auto-mock
jest.mock('./ProductRepository');
jest.mock('./PaymentService');

describe('OrderService', () => {
  let orderService: OrderService;
  let mockProductRepo: jest.Mocked<ProductRepository>;
  let mockPaymentService: jest.Mocked<PaymentService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockProductRepo = new ProductRepository() as jest.Mocked<ProductRepository>;
    mockPaymentService = new PaymentService() as jest.Mocked<PaymentService>;
    orderService = new OrderService(mockProductRepo, mockPaymentService);
  });

  describe('createOrder', () => {
    it('should calculate total correctly for multiple items', async () => {
      mockProductRepo.findById.mockResolvedValue({ id: 1, price: 29.99, name: 'Widget', stock: 10 });
      mockPaymentService.charge.mockResolvedValue({ status: 'success', chargeId: 'ch_123' });

      const order = await orderService.createOrder({ userId: 42, productId: 1, quantity: 3 });

      expect(order.total).toBeCloseTo(89.97);
      expect(order.status).toBe('confirmed');
      expect(mockPaymentService.charge).toHaveBeenCalledWith({ userId: 42, amount: 89.97 });
    });

    it('should throw when product is not found', async () => {
      mockProductRepo.findById.mockResolvedValue(null);

      await expect(
        orderService.createOrder({ userId: 42, productId: 999, quantity: 1 })
      ).rejects.toThrow('Product 999 not found');
    });
  });
});
\`\`\`

## Test Doubles: Mocks, Stubs, Fakes, Spies

**Stub** — Returns pre-defined responses. No behavior verification:
\`\`\`python
# Stub: always return the same user
user_repo_stub = Mock()
user_repo_stub.find.return_value = User(id=1, name="Alice")
\`\`\`

**Mock** — Stub + behavior verification. Assert it was called with specific arguments:
\`\`\`python
payment_mock = Mock()
# ... run code ...
payment_mock.charge.assert_called_once_with(amount=99.99, user_id=42)
\`\`\`

**Fake** — A working implementation with simplified behavior (in-memory database, local email sender):
\`\`\`python
class FakeEmailService:
    def __init__(self):
        self.sent_emails = []

    def send(self, to, subject, body):
        self.sent_emails.append({'to': to, 'subject': subject})

# In tests, inject the fake and verify emails were "sent"
email_service = FakeEmailService()
service = UserService(email_service=email_service)
service.register(email="alice@example.com")
assert len(email_service.sent_emails) == 1
assert email_service.sent_emails[0]['to'] == "alice@example.com"
\`\`\`

**Spy** — Wraps a real object and records calls without changing behavior.

**When to use what:**
- Fake: when you want realistic behavior without external dependencies (in-memory SQLite vs real PostgreSQL)
- Stub: when you only care about the return value, not whether it was called
- Mock: when you need to verify the interaction happened
- Spy: when you want to keep real behavior but also observe calls

## Common Unit Testing Anti-Patterns

**Testing implementation, not behavior:**
\`\`\`python
# Bad: tests internal implementation (will break on refactor)
def test_uses_repository_find_method():
    repo = Mock()
    service.get_user(1)
    repo.find.assert_called()  # Who cares which internal method was called?

# Good: tests observable behavior
def test_get_user_returns_user_by_id():
    service = UserService(repo=Mock(find=lambda id: User(id=id, name="Alice")))
    user = service.get_user(1)
    assert user.id == 1
\`\`\`

**Flaky tests (non-deterministic):**
\`\`\`python
# Bad: depends on current time
def test_subscription_is_expired():
    sub = Subscription(expiry=datetime(2024, 1, 15))
    assert sub.is_expired()  # Only passes after 2024-01-15!

# Good: inject time
def test_subscription_is_expired():
    now = datetime(2024, 6, 1)
    sub = Subscription(expiry=datetime(2024, 1, 15))
    assert sub.is_expired(as_of=now)
\`\`\`

**Over-mocking (mocking what you should test):**
\`\`\`python
# Bad: mocking the code under test
service = Mock()
service.calculate_tax.return_value = 10.00
assert service.calculate_tax(100) == 10.00  # This tests nothing!

# Good: only mock external dependencies
def test_tax_calculation():
    service = TaxService()  # real implementation
    assert service.calculate_tax(amount=100, rate=0.1) == 10.00
\`\`\`

## Integration Tests

Integration tests verify that components work together correctly — your code + a real database, your code + a real external API, your service + another service.

**Database integration tests:**
\`\`\`python
# pytest with a real test database (PostgreSQL in Docker or SQLite for speed)
import pytest
from sqlalchemy import create_engine
from app.models import Base, User, Order
from app.repositories import UserRepository

@pytest.fixture(scope='function')
def db_session():
    engine = create_engine('postgresql://localhost/test_db')
    Base.metadata.create_all(engine)
    with engine.begin() as conn:
        session = Session(conn)
        yield session
        conn.rollback()  # roll back after each test — keeps DB clean

def test_find_users_with_recent_orders(db_session):
    # Arrange — insert real data
    user = User(name="Alice", email="alice@example.com")
    db_session.add(user)
    db_session.flush()

    order = Order(user_id=user.id, total=99.99, created_at=datetime.now())
    db_session.add(order)
    db_session.flush()

    # Act
    repo = UserRepository(db_session)
    result = repo.find_users_with_orders_after(date=datetime.now() - timedelta(days=7))

    # Assert
    assert len(result) == 1
    assert result[0].email == "alice@example.com"
\`\`\`

**API contract tests (testing your API behaves as documented):**
\`\`\`python
# Test the actual HTTP layer
def test_create_order_api(client, db_session, auth_token):
    response = client.post('/api/orders', json={
        'product_id': 1,
        'quantity': 2
    }, headers={'Authorization': f'Bearer {auth_token}'})

    assert response.status_code == 201
    data = response.json()
    assert 'id' in data
    assert data['status'] == 'pending'
    assert data['total'] == 59.98

    # Verify persistence
    order = db_session.query(Order).filter_by(id=data['id']).one()
    assert order.status == 'pending'
\`\`\`

**Testcontainers** — Run real databases in Docker during tests, without a permanent test database:
\`\`\`python
# Python testcontainers
from testcontainers.postgres import PostgresContainer

@pytest.fixture(scope='session')
def postgres():
    with PostgresContainer("postgres:15") as pg:
        yield pg.get_connection_url()

def test_with_real_postgres(postgres):
    engine = create_engine(postgres)
    # ... test with real PostgreSQL ...
\`\`\``,
          interviewQuestions: [
            {
              question: "What is the difference between a mock and a stub, and when do you use each?",
              answer: "A stub is a test double that returns pre-configured responses — it replaces an external dependency and provides canned answers. Use a stub when you only care about the return value your code receives. A mock is a stub plus behavior verification — it records how it was called, and tests assert those calls happened. Use a mock when the interaction itself is part of the contract: 'my code must call the payment service with exactly these arguments.' Over-using mocks (mocking things you should test) leads to brittle tests that break on refactoring but miss real bugs. Prefer stubs and fakes for dependencies; use mocks only when verifying side effects (an email was sent, an event was published).",
              difficulty: "mid" as const,
            },
            {
              question: "Why should integration tests use a real database instead of mocking it?",
              answer: "Mocking a database means you're testing your code against your assumptions about how the database works, not against how it actually works. Real bugs this approach misses: SQL query syntax errors that only appear at runtime, index behavior (a query that works on 10 rows fails on 1 million), transaction isolation issues, constraint violations (duplicate key, null constraint), ORM mapping mismatches. A test with a real database (Testcontainers or a dedicated test DB) catches these. The tradeoff is speed: real DB tests are 100ms vs 1ms for mocked. Solution: use real DB for integration tests (run in CI), use mocks only in unit tests that deliberately test isolation.",
              difficulty: "mid" as const,
            },
          ],
        },
        {
          id: "e2e-and-other-testing",
          title: "E2E, Performance, Security & UAT Testing",
          duration: 55,
          type: "lesson" as const,
          description: "Master end-to-end testing with Playwright, performance testing with k6, security testing practices, regression testing, and user acceptance testing workflows.",
          content: `# E2E, Performance, Security & UAT Testing

## End-to-End (E2E) Testing

E2E tests simulate a real user interacting with the full application — browser, API, database, all real. They test the entire system from the user's perspective.

**When E2E tests are valuable:**
- Validating critical user journeys (signup, purchase, payment)
- Catching integration issues that unit tests miss (the UI sends the wrong parameter to the API)
- Regression testing before releases

**When E2E tests are a liability:**
- Too many of them (slow CI, flaky tests)
- Testing things unit tests should cover (input validation, edge cases)

**Playwright** — The modern standard for browser E2E testing (replaced Cypress for many teams):

\`\`\`typescript
// tests/checkout.spec.ts
import { test, expect, Page } from '@playwright/test';

test.describe('Checkout flow', () => {

  test.beforeEach(async ({ page }) => {
    // Reset to a known state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('user can complete purchase with credit card', async ({ page }) => {
    // Add item to cart
    await page.goto('/products/widget-pro');
    await page.click('[data-testid="add-to-cart"]');
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

    // Proceed to checkout
    await page.click('[data-testid="checkout-button"]');
    await expect(page).toHaveURL('/checkout');

    // Fill shipping address
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Smith');
    await page.fill('[name="address"]', '123 Main St');
    await page.fill('[name="city"]', 'Austin');
    await page.selectOption('[name="state"]', 'TX');
    await page.fill('[name="zipCode"]', '78701');

    await page.click('[data-testid="continue-to-payment"]');

    // Fill payment (Stripe test card)
    const stripeFrame = page.frameLocator('iframe[name="stripe-card"]');
    await stripeFrame.locator('[name="cardnumber"]').fill('4242 4242 4242 4242');
    await stripeFrame.locator('[name="exp-date"]').fill('12/28');
    await stripeFrame.locator('[name="cvc"]').fill('123');

    await page.click('[data-testid="place-order"]');

    // Verify confirmation
    await expect(page).toHaveURL(/\/orders\/[a-z0-9-]+\/confirmation/);
    await expect(page.locator('h1')).toHaveText('Order Confirmed!');
    await expect(page.locator('[data-testid="order-total"]')).toHaveText('$29.99');
  });

  test('shows error when payment fails', async ({ page }) => {
    await page.goto('/checkout?prefilled=true');

    // Use Stripe's "card declined" test number
    const stripeFrame = page.frameLocator('iframe[name="stripe-card"]');
    await stripeFrame.locator('[name="cardnumber"]').fill('4000 0000 0000 0002');
    await stripeFrame.locator('[name="exp-date"]').fill('12/28');
    await stripeFrame.locator('[name="cvc"]').fill('123');

    await page.click('[data-testid="place-order"]');

    await expect(page.locator('[data-testid="payment-error"]'))
      .toHaveText('Your card was declined. Please use a different payment method.');
  });
});
\`\`\`

**Playwright configuration for CI:**
\`\`\`typescript
// playwright.config.ts
export default {
  use: {
    baseURL: process.env.TEST_URL || 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',  // save screenshots for failed tests
    video: 'retain-on-failure',     // save video for failed tests
    trace: 'on-first-retry',        // record trace for debugging
  },
  retries: process.env.CI ? 2 : 0,  // retry flaky tests in CI
  reporter: [['html', { open: 'never' }], ['junit', { outputFile: 'e2e-results.xml' }]],
};
\`\`\`

**Making E2E tests less flaky:**
- Use \`data-testid\` attributes instead of CSS classes (classes change for styling, test IDs shouldn't)
- Wait for elements explicitly instead of arbitrary sleeps: \`await expect(element).toBeVisible()\`
- Stub external services (third-party APIs, emails) in the test environment
- Reset database state before each test to avoid test interdependency

## Performance Testing

Performance testing verifies the system meets speed and capacity requirements under load.

**Types of performance tests:**
- **Load test**: What happens at expected peak load? (normal operation)
- **Stress test**: What happens beyond expected load? Where does it break?
- **Soak test**: What happens after extended periods at normal load? (memory leaks, connection pool exhaustion)
- **Spike test**: What happens with sudden traffic spikes? (auto-scaling behavior)

### k6 — Modern Load Testing

\`\`\`javascript
// k6 load test: api/checkout.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // ramp up to 100 users
    { duration: '5m', target: 100 },   // hold at 100 users
    { duration: '2m', target: 200 },   // ramp up to 200
    { duration: '5m', target: 200 },   // hold at 200
    { duration: '2m', target: 0 },     // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],    // 95th percentile < 200ms
    http_req_failed: ['rate<0.01'],      // error rate < 1%
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'https://staging.myapp.com';

export function setup() {
  // Authenticate and return auth token for use in tests
  const loginRes = http.post(\`\${BASE_URL}/api/auth/login\`, JSON.stringify({
    email: 'loadtest@example.com',
    password: 'loadtestpassword'
  }), { headers: { 'Content-Type': 'application/json' } });

  return { token: loginRes.json('token') };
}

export default function(data) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${data.token}\`
  };

  // Browse products
  const productsRes = http.get(\`\${BASE_URL}/api/products?category=electronics\`, { headers });
  check(productsRes, {
    'products returned 200': (r) => r.status === 200,
    'products has items': (r) => r.json('items').length > 0,
  });
  errorRate.add(productsRes.status !== 200);

  sleep(1);  // think time between requests

  // Add to cart
  const cartRes = http.post(\`\${BASE_URL}/api/cart/items\`,
    JSON.stringify({ productId: 'PROD-001', quantity: 1 }),
    { headers }
  );
  check(cartRes, { 'cart add 201': (r) => r.status === 201 });
  errorRate.add(cartRes.status !== 201);

  sleep(2);
}
\`\`\`

**Run and analyze:**
\`\`\`bash
# Run load test
k6 run --env TARGET_URL=https://staging.myapp.com api/checkout.js

# Output:
# http_req_duration............: avg=145ms  p(90)=189ms  p(95)=198ms  p(99)=312ms
# http_req_failed..............: 0.23%
# vus..........................: 100 min=100 max=200
# ✓ p(95) < 200ms PASS
# ✗ errors < 1%  FAIL (1.2%)
\`\`\`

**What to measure:**
- **Response time percentiles**: p50, p90, p95, p99. Average is misleading — p99 is what your slowest users experience.
- **Throughput**: Requests per second the system handles.
- **Error rate**: What percentage of requests fail under load.
- **Resource utilization**: CPU, memory, DB connections during the load test.

## Security Testing

Security testing finds vulnerabilities before attackers do. It's not optional — it's a phase of every responsible development process.

**SAST (Static Application Security Testing)** — Analyze source code without running it:
\`\`\`bash
# Semgrep: detects security patterns (SQL injection, XSS, hardcoded secrets)
semgrep --config=auto src/

# Bandit (Python): security linter
bandit -r src/ -ll  # only medium+ severity

# ESLint security plugin (JavaScript)
eslint --plugin security src/
\`\`\`

**SCA (Software Composition Analysis)** — Find vulnerabilities in dependencies:
\`\`\`bash
# Check for known CVEs in npm dependencies
npm audit --audit-level=high

# Python dependencies
pip-audit

# Generate SBOM (Software Bill of Materials)
syft myapp:latest -o spdx-json > sbom.json

# Scan SBOM for vulnerabilities
grype sbom:sbom.json --fail-on high
\`\`\`

**DAST (Dynamic Application Security Testing)** — Attack the running application:
\`\`\`bash
# OWASP ZAP baseline scan (passive, safe for staging)
docker run -v $(pwd):/zap/wrk owasp/zap2docker-stable \\
  zap-baseline.py -t https://staging.myapp.com \\
  -r zap-report.html \\
  -I  # don't fail on warnings

# Active scan (aggressive, only use on staging with permission)
zap-full-scan.py -t https://staging.myapp.com -r zap-full.html
\`\`\`

**Penetration Testing** — Manual testing by security professionals. Quarterly or annually for security-sensitive applications.

**OWASP Top 10** — The 10 most critical web application security risks:
1. Broken Access Control
2. Cryptographic Failures
3. Injection (SQL, XSS, command)
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable and Outdated Components
7. Identification and Authentication Failures
8. Software and Data Integrity Failures
9. Security Logging and Monitoring Failures
10. Server-Side Request Forgery (SSRF)

Every developer should know the top 3 cold: broken access control, injection, and cryptographic failures.

## Regression Testing

Regression testing ensures that new changes haven't broken existing functionality. It's not a separate test type — it's a practice of running your existing test suite on every change.

**Automated regression**: Your CI pipeline running all unit, integration, and a smoke subset of E2E tests on every PR is regression testing.

**Regression test selection**: For large suites, run all tests on main branch merges but run only affected-file tests on PR commits (test impact analysis):
\`\`\`bash
# GitHub Actions: run tests for changed packages only
- name: Get changed packages
  id: changed
  run: echo "packages=$(git diff --name-only HEAD~1 | grep -oP 'packages/\K[^/]+' | sort -u | jq -R -s 'split("\n")[:-1]')" >> $GITHUB_OUTPUT

- name: Run tests for changed packages
  run: |
    for pkg in \${{ steps.changed.outputs.packages }}; do
      cd packages/$pkg && npm test
    done
\`\`\`

## User Acceptance Testing (UAT)

UAT is the final validation phase where business stakeholders or real users verify the software meets business requirements before go-live. Unlike QA testing (which tests what the software does), UAT tests whether it does what the business needs.

**UAT process:**
1. Prepare test cases from business requirements and user stories
2. Set up a UAT environment with realistic data
3. Business users execute test cases following scripts
4. Tester documents results: Pass / Fail / Observations
5. Defects found go back to development
6. Sign-off: UAT lead formally approves the release

**UAT test case example:**
\`\`\`
Test Case ID: UAT-CHECKOUT-001
Feature: Guest Checkout
Prerequisite: Add product to cart as anonymous user

Steps:
1. Click "Checkout" from cart page
2. Verify "Continue as Guest" option is visible
3. Click "Continue as Guest"
4. Fill shipping address with valid data
5. Click "Continue to Payment"
6. Enter test Visa card 4111 1111 1111 1111, exp 12/25, CVV 123
7. Click "Place Order"

Expected Result:
- Order confirmation page displays with order number
- Confirmation email received within 2 minutes
- Order appears in admin panel

Actual Result: [tester fills this in]
Status: Pass / Fail
Tester: [name]
Date: [date]
\`\`\`

**Beta testing / canary users** — Release to a subset of real users before full rollout. Collect feedback and error rates before committing to the full release.

## Where Each Test Type Runs in CI/CD

\`\`\`
On every commit (MR pipeline, ~5 minutes):
  ✓ Unit tests (all)
  ✓ SAST scan
  ✓ SCA dependency check
  ✓ Lint

On merge to main (~15 minutes):
  ✓ All unit tests
  ✓ Integration tests
  ✓ Container build + scan
  ✓ Deploy to dev

After deploy to staging (~30 minutes):
  ✓ E2E tests (critical paths)
  ✓ DAST scan
  ✓ Performance smoke test (basic load)

Before production (manual + automated):
  ✓ UAT sign-off
  ✓ Full load test (on staging)
  ✓ Security sign-off
\`\`\``,
          interviewQuestions: [
            {
              question: "What is the difference between load testing, stress testing, and soak testing?",
              answer: "Load testing simulates expected peak traffic to verify the system meets performance requirements under normal worst-case conditions — 'does our system handle Black Friday traffic?' Stress testing pushes beyond expected load to find where and how the system breaks — 'what happens at 10x normal traffic? Which component fails first?' This informs capacity planning and failure handling. Soak testing (endurance testing) runs at normal or moderate load for an extended period (hours or days) to detect issues that only appear over time: memory leaks, connection pool exhaustion, disk space fill-up, resource accumulation. A system might pass load tests but fail after 48 hours due to a memory leak.",
              difficulty: "mid" as const,
            },
            {
              question: "What is the OWASP Top 10 and why should developers know it?",
              answer: "The OWASP Top 10 is the definitive list of the 10 most critical web application security risks, updated every few years based on real-world vulnerability data. Developers should know it because: most security vulnerabilities are in application code, not infrastructure — they're introduced by developers, not attackers. The top risks (injection/SQL injection, broken access control, cryptographic failures) are almost always preventable with known techniques. Specifically: use parameterized queries (not string concatenation) to prevent SQL injection, validate that users can only access their own data (broken access control), use AES-256 or bcrypt for sensitive data (crypto failures). Security tools catch some issues, but a developer who understands these risks writes them in rarely.",
              difficulty: "mid" as const,
            },
          ],
        },
      ],
      exam: [
        { question: "A critical bug is found in production. It was in the codebase for 3 weeks but no tests caught it. How do you prevent this from happening again?", answer: "1) Write a regression test that reproduces the bug first — before fixing it. This test should fail on the buggy code and pass on the fix. Add it to your suite so it never regresses. 2) Analyze WHY no test caught it: was there no unit test for that code path? Was the test mocking away the component where the bug lived? Was the bug a UI integration issue that unit tests couldn't catch? 3) Address the root cause: if unit tests had no coverage for that path, add them. If the bug required browser interaction, add an E2E test for that critical flow. 4) Run a mutation testing tool (Mutmut for Python, Stryker for JS) periodically — it introduces code changes and verifies tests catch them, revealing gaps in test effectiveness.", difficulty: "mid" as const },
        { question: "What types of tests would you write for a REST API endpoint that transfers money between bank accounts?", answer: "Unit tests: test the transfer service logic in isolation — correct amount deducted from source, added to destination; insufficient funds throws correct error; negative amount rejected; same account transfer rejected. Use mocked repository. Integration tests: test with a real database — verify transaction rolls back if either update fails (atomicity), verify concurrent transfers don't create race conditions (test with concurrent requests), verify foreign key constraints are enforced. API tests: test the HTTP layer — correct 200 response on success with transaction ID, 422 with validation errors for bad input, 403 when trying to transfer from another user's account (authorization), 429 on rate limit. E2E test: single test that logs in as a user, transfers $10, verifies both account balances updated in the UI. Security test: verify you can't transfer from another user's account by manipulating the account_id parameter (IDOR vulnerability).", difficulty: "senior" as const },
        { question: "Your Playwright E2E tests are failing in CI 30% of the time (flaky) but pass locally. How do you fix this?", answer: "Flaky E2E tests in CI are usually caused by timing, environment, or state issues. Diagnose: 1) Enable Playwright traces on failure (trace: 'on-first-retry' in config) and screenshots to see what the page looked like when it failed. 2) Look for timing issues: explicit sleeps (await page.waitForTimeout(1000)) are almost always the cause — replace with awaiting specific conditions: await expect(element).toBeVisible() or await page.waitForResponse('/api/data'). 3) Check for test state leakage: tests affecting each other's state. Each test should start from a clean state (reset DB, clear localStorage). 4) Check for CI environment differences: different browser version, slower/faster network, different base URL. 5) Enable retries in CI (retries: 2) as a band-aid, but fix root causes. 6) Stub external services (payment gateway, email) that may be slower or fail in CI.", difficulty: "mid" as const },
      ],
    },

    // MODULE 3 — Code Quality & Review
    {
      id: "code-quality",
      title: "Code Quality, Review & Technical Practices",
      level: "intermediate",
      description: "Establish code review culture, measure code quality, manage technical debt, and apply refactoring techniques that keep codebases maintainable as they grow.",
      lessons: [
        {
          id: "code-review-and-quality",
          title: "Code Quality Metrics & Effective Code Review",
          duration: 40,
          type: "lesson" as const,
          description: "Learn what makes code quality measurable, how to run effective code reviews, static analysis tools, and how to introduce quality gates in CI without slowing teams down.",
          content: `# Code Quality Metrics & Effective Code Review

## What is Code Quality?

Code quality is not a single metric — it's a collection of characteristics that make code easy to understand, change, and maintain. Code quality matters because:

- **Maintainability**: 80% of software cost is maintenance, not initial development. Hard-to-change code is expensive code.
- **Reliability**: Clean, simple code has fewer bugs than clever, complex code.
- **Velocity**: Teams with high code quality ship features faster in the long term — they spend less time understanding and fixing existing code.

## Measuring Code Quality

**Cyclomatic Complexity** — Counts the number of independent paths through a function. Every \`if\`, \`else\`, \`for\`, \`while\`, \`catch\` adds 1. A function with cyclomatic complexity > 10 is hard to test fully (you'd need 10 test cases) and hard to understand.

\`\`\`python
# Cyclomatic complexity = 1 (single path)
def get_greeting(name: str) -> str:
    return f"Hello, {name}"

# Cyclomatic complexity = 5 (5 decision points)
def calculate_discount(user, order):
    if user.is_premium:               # +1
        if order.total > 1000:        # +1
            return 0.20
        else:
            return 0.10
    elif order.total > 500:           # +1
        if user.referral_code:        # +1
            return 0.08
        return 0.05
    else:
        return 0.0                    # +1 base
\`\`\`

**Code Coverage** — Percentage of lines/branches executed during tests. Not a quality metric by itself (you can have 100% coverage with bad tests), but low coverage (< 60%) reliably indicates under-tested code. Aim for 80%+ line coverage, 70%+ branch coverage for business logic.

**Code Duplication** — Duplicated code (copy-paste programming) means bugs must be fixed in multiple places. Tools like SonarQube and CodeClimate detect duplicate blocks.

**Cognitive Complexity** — Sonar's metric that measures how hard code is to understand (not just how many paths). Nested conditions score higher than equivalent flat conditions.

**DORA Metrics** (for engineering teams, not individual code):
- Deployment frequency
- Lead time for changes
- Change failure rate
- Mean time to recovery

## Static Analysis in CI

\`\`\`yaml
# GitHub Actions: quality gate on every PR
- name: Run static analysis
  run: |
    # Python: pylint with threshold
    pylint src/ --fail-under=8.0   # score < 8.0 fails the build

    # Python: type checking
    mypy src/ --strict

    # Complexity check
    radon cc src/ -a -n C          # fail if average complexity > C grade

    # Duplicates
    flake8 src/ --max-complexity=10

# SonarQube quality gate (blocks PR if quality deteriorates)
- name: SonarQube Scan
  uses: SonarSource/sonarcloud-github-action@master
  env:
    SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}
  with:
    args: >
      -Dsonar.qualitygate.wait=true
\`\`\`

## Running Effective Code Reviews

Code review is the most important quality gate — it catches bugs, shares knowledge, and maintains design consistency. Make it a positive, collaborative process.

**PR description template:**
\`\`\`markdown
## What changed and why
Brief description of what this PR does and the motivation.

## How to test
1. Check out this branch
2. Run: docker-compose up
3. Navigate to /checkout
4. Verify the address autocomplete appears

## Screenshots (for UI changes)
[before screenshot] [after screenshot]

## Type of change
- [ ] Bug fix
- [x] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [x] Tests added/updated
- [x] Documentation updated
- [x] No new SAST findings
\`\`\`

**Reviewer heuristics:**

**Approve if:** the code works correctly, is reasonably clear, has tests, and any concerns are minor.

**Request changes if:** the code has a bug, is insecure, is significantly hard to understand without a comment, or violates established team patterns.

**Comment phrasing matters:**

\`\`\`
❌ "This is wrong."
✓ "This could cause a race condition if two requests arrive simultaneously. Would a database-level unique constraint work here?"

❌ "Why did you do it this way?"
✓ "I'm curious about the approach here — is there a reason we didn't use the existing UserService.findById?"

❌ "Nit: change this."
✓ "nit: I'd extract this into a named constant for readability, but it's up to you."
\`\`\`

**Prefix comments to clarify urgency:**
- \`blocking:\` — Must fix before merge
- \`question:\` — Seeking understanding, not requesting change
- \`suggestion:\` — Consider this, non-blocking
- \`nit:\` — Minor style issue, author's discretion

## Refactoring: Improving Code Without Changing Behavior

Refactoring is the disciplined technique of restructuring existing code without changing its external behavior. You make code easier to understand and maintain — the tests confirm you haven't changed behavior.

**Common refactoring patterns:**

**Extract Method** — Long function with comments explaining sections:
\`\`\`python
# Before: one big function doing many things
def process_order(order):
    # Validate order
    if not order.user_id:
        raise ValueError("User required")
    if order.items is None or len(order.items) == 0:
        raise ValueError("Empty order")
    for item in order.items:
        if item.quantity <= 0:
            raise ValueError(f"Invalid quantity for {item.product_id}")

    # Calculate total
    subtotal = sum(item.price * item.quantity for item in order.items)
    tax = subtotal * 0.08
    total = subtotal + tax

    # Apply discount
    if order.coupon_code:
        discount = get_discount(order.coupon_code)
        total = total * (1 - discount)

    order.total = total
    save(order)

# After: extracted methods
def process_order(order):
    validate_order(order)
    order.total = calculate_order_total(order)
    save(order)

def validate_order(order):
    if not order.user_id:
        raise ValueError("User required")
    if not order.items:
        raise ValueError("Empty order")
    for item in order.items:
        if item.quantity <= 0:
            raise ValueError(f"Invalid quantity for {item.product_id}")

def calculate_order_total(order):
    subtotal = sum(item.price * item.quantity for item in order.items)
    total = subtotal * 1.08  # including tax
    if order.coupon_code:
        total *= (1 - get_discount(order.coupon_code))
    return total
\`\`\`

**Replace Conditional with Polymorphism** — Long if/else chains that check type:
\`\`\`python
# Before
def calculate_shipping(order, shipping_type):
    if shipping_type == 'standard':
        return 5.99 if order.total < 50 else 0
    elif shipping_type == 'express':
        return 12.99
    elif shipping_type == 'overnight':
        return 24.99
    else:
        raise ValueError(f"Unknown: {shipping_type}")

# After: strategy pattern
class StandardShipping:
    def calculate(self, order): return 5.99 if order.total < 50 else 0

class ExpressShipping:
    def calculate(self, order): return 12.99

class OvernightShipping:
    def calculate(self, order): return 24.99

SHIPPING_STRATEGIES = {
    'standard': StandardShipping(),
    'express': ExpressShipping(),
    'overnight': OvernightShipping(),
}

def calculate_shipping(order, shipping_type):
    strategy = SHIPPING_STRATEGIES.get(shipping_type)
    if not strategy:
        raise ValueError(f"Unknown: {shipping_type}")
    return strategy.calculate(order)
# Adding a new shipping type: create a class and add to dict. No if/else modification.
\`\`\``,
          interviewQuestions: [
            {
              question: "What is cyclomatic complexity and why does it matter for testing?",
              answer: "Cyclomatic complexity measures the number of independent execution paths through a function — every if, else, for, while, catch, and logical AND/OR adds one. A function with complexity 10 has 10 independent paths, meaning you need at minimum 10 test cases to achieve branch coverage. High complexity (> 10) correlates with: more bugs (more paths = more opportunities for mistakes), harder to review (reviewer can't hold all paths in mind), and harder to test (combinatorial explosion of cases). The fix is usually to extract smaller functions, replace conditionals with polymorphism, or simplify guard clauses. Well-factored code typically has functions with complexity 1-5.",
              difficulty: "mid" as const,
            },
          ],
        },
      ],
      exam: [
        { question: "A PR adds 800 lines of code in a single commit with the description 'implement payment feature.' How do you handle this as a reviewer?", answer: "Request it be broken into smaller PRs before reviewing. An 800-line PR cannot be reviewed thoroughly — research shows review quality degrades sharply above 400 lines. A reviewer will rubber-stamp sections they don't understand. Suggest splitting by layer or logical chunk: 1) Database schema + migration, 2) Payment service + tests, 3) API endpoints + tests, 4) UI integration. Each PR is reviewable in 20-30 minutes and has a focused scope. This isn't bureaucracy — it's how you actually catch bugs. If urgency prevents splitting, at minimum require the author to walk you through it synchronously. Document the decision to accept a large PR as a known risk.", difficulty: "mid" as const },
      ],
    },
  ],
};
