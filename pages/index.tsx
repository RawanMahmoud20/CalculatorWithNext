import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { RootState } from "../redux/store";
import { studentAction } from "../redux/slices/studentsSlice";
import { Button, message, Modal , Alert} from "antd";
const Home: React.FC = () => {
 let nameRef = useRef<HTMLInputElement>(null);
 let midRef = useRef<HTMLInputElement>(null);
 let finalRef = useRef<HTMLInputElement>(null);
 let activitedRef = useRef<HTMLInputElement>(null);
 const students = useSelector((state: RootState) => state.students.data);
let [errorMessage, setErrorMessage] = useState<string>("");
 let dispatch=useDispatch();
 const router= useRouter();
const [modal, setModal] = React.useState
<{
  open: boolean;
  type: 'success' | 'error' | 'warning';
  content: string;
}>({ open: false, type: 'success', content: '' });

const [messageApi,contextHolder]= message.useMessage();

let checkData = () => {
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
  if (!exists) dispatch(studentAction.addStudent(student));
  clear();
  setErrorMessage("");
  return true;
// router.push("/result");
// const exists = students.some((s) => s.id === student.id);

}catch (error: any) {
    console.error("Error:", error.response?.data?.message || error.message);
    setErrorMessage(error.response?.data?.message || "Something went wrong!");
    setTimeout(() => setErrorMessage(""), 4000);
    return false; 
}  
}
const [loading, setLoading] = React.useState<boolean>(false);
const submitHandeller = async (event: React.FormEvent) => {
    event.preventDefault();

    // التحقق المحلي أولًا
    if (!checkData()) {
      setModal({
        open: true,
        type: "warning",
        content:
          "Please fill all fields correctly! (Name must contain only letters)",
      });
      return;
    }

    setLoading(true);
    try {
      const success = await saveData();
      if (success) {
        // setModal({
        //   open: true,
        //   type: "success",
        //   content: "Student added successfully!",
        // });
       messageApi.open({
          type: 'success',
          content: 'Student added successfully!',
        });
        // الانتقال بعد2  ثانية
        setTimeout(() => router.push("/result"), 2000);
      }
    } catch (error: any) {
      setModal({
        open: true,
        type: "error",
        content: error.message || "Failed to add student!",
      });
    } finally {
      setLoading(false);
    }
  };
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
         onChange={()=>setErrorMessage("")}
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
          onChange={()=>setErrorMessage("")}
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
        onChange={()=>setErrorMessage("")}
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
          onChange={()=>setErrorMessage("")}

           />
      </div>
    </div>

    <div className="row mt-4">
      <div className="col-12 text-center">
        {contextHolder}
        {errorMessage && (
            <Alert
              type="error"
              message={errorMessage}
              showIcon
              banner={true}
             style={{ marginBottom: "20px" }}
            />
          )}

        <Button 
        htmlType="submit"
        onClick={submitHandeller}
        type="primary"
         id="saveBtn" 
         className="save-btn"
         loading={loading}
         >SAVE
         </Button>
         
        {modal.open &&(
          <Modal
          open={modal.open}
          onOk={() => setModal({ ...modal, open: false })}
          onCancel={() => setModal({ ...modal, open: false })}
          okText="OK"
          title={modal.type === 'success' ? 'Success' : modal.type === 'warning' ? 'Warning' : 'Error'}
          >
            <p>{modal.content}</p>
          </Modal>
        )}

      </div>
    </div>
  </form>

  {/* <!-- Results container (cards appended here) --> */}
  <div id="results" className="mt-4"></div>

</div>

</main>
    </div>


  )
}

export default Home;
