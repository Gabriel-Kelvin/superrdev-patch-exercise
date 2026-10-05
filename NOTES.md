# Patch notes

Prioritized incorrect search results, stale UI data, and API failures over new features.

Changes: grouped title/description predicates so archive and status constraints apply to both; synchronized the H2/Oracle references and added an ID ordering tie-breaker. Removed the artificial request sleep. Invalid status and pagination now return 400; offset arithmetic uses long to avoid overflow. Status normalization uses trimming and Locale.ROOT. The frontend cancels obsolete requests and ignores their callbacks, ends loading on failure, clears errors on a new request, and resets pagination when either filter changes. Pagination buttons are disabled while loading. Added three Spring/H2 integration tests and three frontend regression tests; added only development/test dependencies for those checks.

Validation: backend tests, frontend tests, and production build pass. Backend starts with the original Windows Maven wrapper command. Browser smoke test covered page navigation and combined api/OPEN search (six matches). Windows rejected port 5173 with EACCES, so frontend smoke testing used `npm run dev -- --port 55173`; default scripts/configuration remain unchanged. Java 17 was downloaded to the workspace because this machine's configured JAVA_HOME did not exist. Oracle changes were reviewed only, not executed.

Assumptions: pages are one-based; pageSize is limited to 100; blank status means all statuses; existing SQL LIKE wildcard semantics are retained.

Deferred: database pagination, debounce, search indexes, dependency upgrades, accessibility polish, and Oracle input validation to keep scope focused. npm audit still reports vulnerabilities.

Biggest remaining risk: this unauthenticated demo exposes task data and the H2 console; it should not be deployed publicly as configured. Fetching all matches also does not scale.

Tools: OpenAI Codex inspected, implemented, and tested this patch; Git, Maven, npm, and browser tools supported verification. Candidate review and genuine handwritten photos remain required before submission.
