import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: {},
    settings: {},
  },
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setSettings(state, action) {
      state.settings = action.payload;
    },
  },
});

export const { setProfile, setSettings } = userSlice.actions;
export default userSlice.reducer;
