import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import data from '../../data/places';

/**
 * Type definition for a place.
 * Adjust the fields if your `places` data has more properties.
 */
export interface Place {
  id: string;
  name: string;
  [key: string]: any;
}

/**
 * Slice state type.
 */
export interface PlacesState {
  list: Place[];
  visited: Record<string, boolean>;
  suggested: string | null;
}

/**
 * Initial state.
 */
const initialState: PlacesState = {
  list: [],
  visited: {},
  suggested: null,
};

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    /**
     * Toggle the visited state for a given place id.
     */
    toggleVisited: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (!id) return;
      state.visited[id] = !state.visited[id];
    },

    /**
     * Choose a random place from the list and store its id.
     */
    suggestRandomPlace: state => {
      if (!state.list.length) return;
      const random = state.list[Math.floor(Math.random() * state.list.length)];
      state.suggested = random.id;
    },

    /**
     * Reset all visited states and clear suggestion.
     */
    resetVisited: state => {
      state.visited = {};
      state.suggested = null;
    },
  },
});

export const {toggleVisited, suggestRandomPlace, resetVisited} =
  placesSlice.actions;

export default placesSlice.reducer;
