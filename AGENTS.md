# AGENTS.md — Kiro for Codex

This file defines the agent contract and serves as the index to project guidance. It applies repo‑wide unless overridden by a nested AGENTS.md.

## Steering Documents
- Purpose: Treat Steering as the first‑party source for product, technical, and structural guidance.
- Location: `.codex/steering/product.md`, `.codex/steering/tech.md`, `.codex/steering/structure.md`.
- Access: Resolve paths via `ConfigManager` (e.g., `ConfigManager.getPath('steering')`). Never hardcode absolute paths.
- Mutations: Treat Steering as read‑only; update via feature flows (Init/Refine/Delete) rather than ad‑hoc edits.
- Usage: Summarize applicable Steering points in outputs; cite the specific file/section without restating details.

## Decision Precedence
1) Code‑level flags and constraints in `src/constants.ts`.
2) Steering documents under `.codex/steering/*.md`.
3) This AGENTS.md contract (general repository conventions).
4) Generic assumptions (avoid unless explicitly allowed).

## Agent Behavior Contract
- Use `CodexProvider` for CLI operations; use `ProcessManager`/`CommandBuilder`; avoid spawning child processes directly.
- Respect feature flags in `src/constants.ts` and any `package.json` `contributes.*` gating.
- Logging: Use the shared `OutputChannel`; log key lifecycle and error paths; avoid noisy logs.
- Error handling: Use centralized services (e.g., `ErrorHandler`, `RetryService`); avoid ad‑hoc try/catch loops.
- Performance/UX: Do not block the extension host; long tasks use split terminals and VS Code progress notifications.
- Reference Steering for specifics (naming, boundaries, directory layout) rather than restating them here.

## Paths & I/O
- Workspace I/O: Prefer VS Code FS APIs (`vscode.workspace.fs`) for read/write/create.
- Path resolution: Use `ConfigManager` for all `.codex/*` paths; avoid absolute paths.
- Write boundaries: Only write within `.codex/**`, the workspace, or VS Code storage as allowed by project rules.
- Steering: Do not overwrite files under `.codex/steering` directly; use feature flows.

## CLI Integration
- Build CLI arguments with `CommandBuilder`; execute via `ProcessManager`.
- Approval modes and model flags: Reference their definition sites/tests without duplicating values.
- Verify Codex availability before invocation; surface setup guidance if unavailable.

## Submission Checklist (For Agents)
- Verified decisions against `.codex/steering/*.md`; cited files/sections without duplication.
- Resolved steering path via `ConfigManager`; avoided absolute paths.
- Respected feature flags and constraints in `src/constants.ts`.
- Used `CodexProvider`/`CommandBuilder`/`ProcessManager` for CLI interactions.
- Avoided restating Steering or code constants; kept AGENTS.md concise and index‑like.

## Non‑Goals / Anti‑Patterns
- Do not bypass `CodexProvider`/`ProcessManager` for CLI calls.
- Do not store state in globals beyond established singletons.
- Do not write outside approved directories or overwrite Steering directly.
- Do not re‑enable disabled features unless explicitly requested.

## Instructions to Apply
- Write or update `AGENTS.md` at the repository root with the structure above.
- If an AGENTS.md already exists, update it in‑place to conform to this reference‑first contract without duplicating Steering content.

