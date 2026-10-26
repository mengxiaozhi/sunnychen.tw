# Pocket Polis for sunnychen.tw

Upstream: https://github.com/mashbean/pocket-polis
Pinned commit: 836ba19ffa93037555b22f2fd48645678255ab03
License: MIT, Copyright (c) 2026 mashbean. Full original license is retained in LICENSE.

This copy uses a separate Worker and Queue named sunnychen-polis / sunnychen-polis-sensemaking. It does not reuse any existing Worker, Durable Object namespace, conversation ID, or admin token.

Local integration changes:
- src/sunny-worker.ts adds a limited CORS allowlist, disables MCP, protects conversation creation with SUNNY_SETUP_TOKEN, and preserves moderated submissions / non-public row exports.
- src/service.ts removes the original deployment's known conversation IDs.
- wrangler.jsonc uses this deployment's own names and has no custom-domain routes.
- Public participant and report data remain served by Pocket Polis; the native Next.js UI uses its REST API.

Never commit .dev.vars, .wrangler, OAuth credentials, or one-time admin tokens. Keep private handoff files under the ignored root .local/ directory with mode 600.

- This site uses REST only. MCP transport code/tests and its runtime dependencies are omitted; /mcp is disabled. The upstream PCA/clustering/consensus, moderation, SQLite and AI budget pipeline remain intact.
- The upstream demo datasets, GitHub workflows and agent-installation skill are omitted. No upstream demo response or participant is seeded into this site's discussion.
- Participant/report/admin documents disallow embedding by unrelated domains.
- Deployment tools are updated to compatible current releases and checked separately from the website.
