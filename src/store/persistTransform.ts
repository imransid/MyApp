// src/store/persistTransforms.ts
import {createTransform} from 'redux-persist';

/**
 * Shape of the Places slice in Redux state.
 * Adjust this interface to match your real slice state.
 */
export interface PlacesState {
  list: string[]; // or your actual item type
  visited: Record<string, boolean>;
  suggested: string[] | null;
}

/**
 * A redux-persist transform that:
 * - Inbound (to storage): persists only minimal fields (`visited`, `suggested`)
 * - Outbound (from storage): restores defaults for `list` and ensures shape consistency
 */
export const placesMinimalTransform = createTransform<
  PlacesState,
  Partial<PlacesState>
>(
  // inbound: Redux state -> persisted state
  (inboundState: PlacesState, key): Partial<PlacesState> => {
    return {
      visited: inboundState.visited,
      suggested: inboundState.suggested,
    };
  },

  // outbound: persisted state -> Redux state
  (outboundState: Partial<PlacesState>, key): PlacesState => {
    return {
      list: [], // Replace [] with static data import if needed
      visited: outboundState.visited ?? {},
      suggested: outboundState.suggested ?? null,
    };
  },

  // Apply only to the `places` slice
  {whitelist: ['places']},
);
