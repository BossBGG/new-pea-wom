import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = "desktop"

export const ScreenSizeSlice = createSlice({
  name: "screen_size",
  initialState,
  reducers: {
    setScreenSize: (_, action: PayloadAction<string>) => action.payload,
  }
})

export const {setScreenSize} = ScreenSizeSlice.actions;
export default ScreenSizeSlice.reducer;
