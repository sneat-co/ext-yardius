# ext-yardius

The **frozen cross-repo contract surface** for the [yardius](https://github.com/sneat-co/yardius)
extension, per the Sneat [repository-naming standard](https://github.com/sneat-co/sneat-specs/blob/main/standards/repo-naming.md):
every Sneat extension is two repos — `<id>` (implementation) and `ext-<id>`
(the public extension-definition repo other repos import).

This repo holds the shared DTOs, consts, and briefs that both surfaces of the
yardius extension depend on.

Every shared DTO must resolve from the `@sneat/extension-yardius-contract` package — no
duplicate DTO definitions are allowed in the `yardius` implementation repo.

## Status

The shared cross-repo surface is exported from `frontend/src/index.ts` — see
`frontend/src/lib/`
for the individual modules and their `*.spec.ts` round-trip and table-driven
tests:

- the Listing DTO (`IListingDto`, discriminated by type `borrow`/`giveaway`;
  references the Assetus asset **by ID only** — no duplicated ownership
  fields) in `listing.ts`;
- listing visibility (`private`/`members`/`friends`, default `members`) and
  the Assetus-visibility **ceiling mapping** as shared data
  (`LISTING_VISIBILITY_CEILING`, `allowedListingVisibilities`,
  `isListingVisibilityAllowed`) in `listing-visibility.ts` /
  `assetus-visibility.ts`;
- the borrow (`available → requested → approved → borrowed → returned →
  closed`) and give-away (`available → claimed → transferred → closed`)
  lifecycle state enums with their **legal-transition tables** and pure
  `canTransition*` helpers in `borrow-state.ts` / `giveaway-state.ts` /
  `state-transitions.ts`;
- transaction-log entry DTO and the exact event-type set (publish, request,
  withdraw, approve, decline, handover, return, claim, transfer, cancel) in
  `transaction-log.ts`;
- the request/claim shape (`IListingRequestDto`) in `listing-request.ts`;
- the listings-endpoint request/response contract (auth-implied request;
  response grouped/labelled by owning Space, member + direct-friend scope
  only) in `listings-endpoint.ts`.

## Frozen means frozen

Changes here are breaking changes for every consumer. Keep the surface minimal,
additive, and versioned; implementation details stay in the `yardius` repo.

## Build and release

The contract is a small Nx project (`ext-yardius-contract`) in `frontend/`.
`pnpm exec nx build ext-yardius-contract` emits the Node ESM package to
`frontend/dist/`; tests and type-checking run from that same directory. Pushes
to `main` use the shared Sneat npm workflow and `nx release` to version,
publish, tag, and push the contract release.
