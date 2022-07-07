import { createSlice } from "@reduxjs/toolkit";
import { State } from "react-native-gesture-handler";



const initialState = {
    origin: null,
    destination: null
}

export const navSlice = createSlice({
    name:'nav',
    initialState,
    reducers: {
        setOrigin: (state, action) => {
            state.origin = action.payload
        }
    }
})


export const {setOrigin} = navSlice.actions


export const selectOrigin = (state) => state.nav.origin

export default navSlice.reducer