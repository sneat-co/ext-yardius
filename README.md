# yardius-contract

The **frozen cross-repo contract surface** for the [yardius](https://github.com/sneat-co/yardius)
extension, per the Sneat [repository-naming standard](https://github.com/sneat-co/sneat-specs/blob/main/standards/repo-naming.md):
every Sneat extension is two repos — `<id>` (implementation) and `<id>-contract`
(the stable interface other repos import).

This repo holds the shared DTOs, consts, and briefs that both surfaces of the
yardius extension depend on.

Every shared DTO must resolve from the `@sneat/yardius-contract` package — no
duplicate DTO definitions are allowed in the `yardius` implementation repo.

## Status

Intentionally empty for now — see `src/index.ts`. DTOs land in a follow-up task.

## Frozen means frozen

Changes here are breaking changes for every consumer. Keep the surface minimal,
additive, and versioned; implementation details stay in the `yardius` repo.
