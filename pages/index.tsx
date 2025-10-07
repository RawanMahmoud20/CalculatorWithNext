import Head from "next/head";
import React, { useEffect, useRef } from "react";
// import style from  "../styles/style.css"; 
import { useDispatch, useSelector} from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { RootState } from "../redux/store";
import { studentAction } from "../redux/slices/studentsSlice";

const Home: React.FC = () => {
 
 let nameRef = useRef<HTMLInputElement>(null);
 let midRef = useRef<HTMLInputElement>(null);
 let finalRef = useRef<HTMLInputElement>(null);
 let activitedRef = useRef<HTMLInputElement>(null);
 const students = useSelector((state: RootState) => state.students.data);

 let dispatch=useDispatch();
 const router= useRouter();
let cheackData = () => {
  return (
    nameRef.current?.value !== "" &&
    midRef.current?.value !== "" &&
    finalRef.current?.value !== "" &&
    activitedRef.current?.value !== ""
  );
}

let clear = () => {
  nameRef.current && (nameRef.current.value = "");
  midRef.current && (midRef.current.value = "");
  finalRef.current && (finalRef.current.value = "");
  activitedRef.current && (activitedRef.current.value = "");
}
let saveData=async()=>{
  // save data in redux  ,, نحسب المعدل ونسجله في Redux store., 
const id = Date.now(); // or use any unique id logic
const name = nameRef.current?.value || "";
const mid = Number(midRef.current?.value) || 0;
const final = Number(finalRef.current?.value) || 0;
const activites = Number(activitedRef.current?.value) || 0;
const average = (mid + final + activites) / 3;

const student = {
  id,
  name,
  mid,
  final,
  activites,
  average,
};

try{
const response= await axios.post('/api/marks/store',{
  name,
  mid,
  final,
  activites,
});
console.log(response.data); // رسالة النجاح
// الحصول على الطالب الجديد من قاعدة البيانات (مع _id)
 const studentFromDb = response.data.data || response.data.student;
 // نتأكد أنه ما انضاف مسبقًا
  const exists = students.some((s) => s.id === studentFromDb?._id);
if (!exists) {
  dispatch(studentAction.addStudent(student));
}
clear();
router.push("/result");
// const exists = students.some((s) => s.id === student.id);

}catch (error: any) {
    console.error("Error:", error.response?.data?.message || error.message);
    alert(error.response?.data?.message || "Something went wrong!");

}  
}
let submitHandeller = (event:React.FormEvent)=>{
 event.preventDefault();
if (cheackData()){
  saveData();
  
}else {
    alert("Please fill all fields correctly!");
  }
}

  return (
    <div>
  <Head>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Average Calculator</title>
  {/* <!-- Bootstrap 5 CSS --> */}
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css" rel="stylesheet"/>

  {/* <!-- External CSS --> */}
  {/* <link rel="stylesheet" href="style.css"/> */}
  </Head> 
      <main>
  <div className="container">
  {/* <!-- Header --> */}
  <div className="row align-items-center page-header">
    <div className="col-md-8">
      <h2 className="mb-2">AVERAGE CALCULATOR</h2>
      <p className="small-muted mb-0">
        ENTER THE GRADES 
      </p>
    </div>
    <div className="col-md-4 text-center">
      <img src="https://img.freepik.com/free-vector/calculator-concept-illustration_114360-6469.jpg?w=200" alt="calc" className="img-fluid"style={{ maxWidth: '160px' }}/>
    </div>
  </div>

  {/* <!-- Form --> */}
  <form className="marks-form" onSubmit={submitHandeller}>
    <div className="row g-3 align-items-end">
      <div className="col-md-4">
        <label className="form-label">Student Name</label>
        <input
         type="text" 
         id="studentName" 
         className="form-control form-input" 
         placeholder="Enter Name"
         ref={nameRef}
         />
      </div>

      <div className="col-md-4">
        <label className="form-label">Mid Term</label>
        <input type="number"
         id="midTerm" 
         className="form-control form-input"
          placeholder="Enter Mark"
           min="0"
          ref={midRef}

           />
      </div>

      <div className="col-md-4">
        <label className="form-label">Final</label>
        <input type="number" 
        id="finalTerm" 
        className="form-control form-input" 
        placeholder="Enter Mark"
        min="0"
        ref={finalRef}

         />
      </div>
    </div>

    <div className="row mt-3">
      <div className="col-12">
        <label className="form-label">Activities</label>
        <input type="number"
         id="activities"
          className="form-control form-input" 
          placeholder="Enter Mark"
           min="0"
          ref={activitedRef}
           />
      </div>
    </div>

    <div className="row mt-4">
      <div className="col-12 text-center">
        <button 
        type="submit"
         id="saveBtn" 
         className="save-btn"
         onClick={submitHandeller}
         >SAVE
         </button>
      </div>
    </div>
  </form>

  {/* <!-- Results container (cards appended here) --> */}
  <div id="results" className="mt-4"></div>

</div>

</main>
    </div>


  );
}

export default Home;
