import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface Payload {
  img: string;
  url: string;
}

const catSlice = createSlice({
  name: 'catSlice',
  initialState: [] as Payload[],
  reducers: {
    add(state, action: PayloadAction<Payload>) {
      state.push(action.payload);
    },
  },
});

export const { add } = catSlice.actions;
export default catSlice.reducer;
