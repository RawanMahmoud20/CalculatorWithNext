import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type Student={
    id:number;
    name:string;
    mid:number;
    final:number;
    activites: number;
    average:number;
};

type StudentsState = {
  data: Student[];
};

const initialState: StudentsState = {
  data: [],
};
const studentSlice= createSlice({
 name: "students",
initialState,
reducers:{
    addStudent:(state, action: PayloadAction<Student>)=>{
        state.data.push(action.payload);
    },
    removeStudent: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter((s) => s.id !== action.payload);
    },
}

});
export default studentSlice.reducer;
export const studentAction= studentSlice.actions;

