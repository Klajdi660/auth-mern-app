import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    signupData: null,
    loading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setSignupData(state, value) {
            state.signupData = value.payload;
        },
        setLoading(state, value) {
            console.log('state :>> ', state);
            console.log('value :>> ', value);
            console.log('object :>> ', state.loading = value.payload);
            state.loading = value.payload;
        },
    },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;