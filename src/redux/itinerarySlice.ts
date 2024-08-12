import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ItineraryEntry {
  date: string;
  activity: string[];
  time: string[];
}
interface SerializableDateRange {
  from: string | null;
  to: string | null;
}
interface ItineraryState {
  date: SerializableDateRange;
  itinerary: ItineraryEntry[];
  activityColumn: number;
}

const initialState: ItineraryState = {
  date: {
    from: null,
    to: null,
  },
  itinerary: [],
  activityColumn: 1,
};

const itinerarySlice = createSlice({
  name: "itinerary",
  initialState,
  reducers: {
    setDate(state, action: PayloadAction<SerializableDateRange>) {
      state.date = action.payload;
    },
    setItinerary(state, action: PayloadAction<ItineraryEntry[]>) {
      state.itinerary = action.payload;
    },
    updateActivityItinerary(
      state,
      action: PayloadAction<{
        index: number;
        colIndex: number;
        activity: string;
      }>,
    ) {
      const { index, colIndex, activity } = action.payload;
      state.itinerary[index].activity[colIndex] = activity;
    },
    updateTimeItinerary(
      state,
      action: PayloadAction<{ index: number; colIndex: number; time: string }>,
    ) {
      const { index, colIndex, time } = action.payload;
      state.itinerary[index].time[colIndex] = time;
    },
    setActivityColumn(state, action: PayloadAction<number>) {
      state.activityColumn = action.payload;
    },
  },
});

export const {
  setDate,
  setItinerary,
  updateActivityItinerary,
  updateTimeItinerary,
  setActivityColumn,
} = itinerarySlice.actions;

export default itinerarySlice.reducer;
