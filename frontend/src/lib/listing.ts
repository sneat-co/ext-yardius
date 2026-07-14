import { BorrowState } from './borrow-state.js';
import { GiveawayState } from './giveaway-state.js';
import { ListingVisibility } from './listing-visibility.js';

// A Listing's transaction type, per REQ publish-listing: exactly `borrow` or
// `giveaway`. Sell / swap / reserve are explicitly out of MVP scope.
export const LISTING_TYPES = ['borrow', 'giveaway'] as const;

export type ListingType = (typeof LISTING_TYPES)[number];

// Any listing state — the union of the two lifecycles' states. Which arm
// applies is discriminated by the Listing's `type` (see `IListingDto`).
export type ListingState = BorrowState | GiveawayState;

// Fields common to both listing kinds.
//
// Per REQ publish-listing a Listing references the Assetus asset BY ID and
// renders asset details via the pinned Assetus read contract — it MUST NOT
// duplicate ownership (or any other Assetus) fields, which is why this DTO
// carries no title/condition/owner data. An asset has at most one OPEN
// Listing at a time.
//
// Persistence (backend concern, not part of this DTO's shape): Listings live
// under `/spaces/{spaceID}/ext/yardius/...` (REQ persistence-convention);
// `spaceID` is the owning Space, which is also how the listings endpoint
// groups/labels results (REQ backend-mediated-query).
interface IListingBase {
	readonly id: string;

	// The owning Space (the Space that owns the referenced asset).
	readonly spaceID: string;

	// Reference to the Assetus asset — by ID only, never duplicated fields.
	readonly assetID: string;

	// The Listing's own visibility; must be permitted by the asset's Assetus
	// visibility per `LISTING_VISIBILITY_CEILING` (REQ
	// listing-visibility-ceiling). Defaults to `DEFAULT_LISTING_VISIBILITY`
	// ('members') at creation time in the app layer; the DTO itself always
	// carries an explicit value.
	readonly visibility: ListingVisibility;
}

// A `borrow` Listing — its `state` moves per `BORROW_STATE_TRANSITIONS`.
export interface IBorrowListingDto extends IListingBase {
	readonly type: 'borrow';
	readonly state: BorrowState;
}

// A `giveaway` Listing — its `state` moves per `GIVEAWAY_STATE_TRANSITIONS`.
export interface IGiveawayListingDto extends IListingBase {
	readonly type: 'giveaway';
	readonly state: GiveawayState;
}

// A Listing, discriminated by `type` so `state` is statically narrowed to the
// right lifecycle.
export type IListingDto = IBorrowListingDto | IGiveawayListingDto;
