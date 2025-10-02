import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { studentAction } from "./redux/slices/studentsSlice";

const Results: React.FC = () => {
    // fetch data from redux 
  const students = useSelector((state: RootState) => state.students.data);

let dispatch=useDispatch();
  let handleDelete=(id:number)=>{
if(confirm("ARE YOU SURE WANT TO DELETE THIS STUDENT?")){
dispatch(studentAction.removeStudent(id));
}
}
  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">Student Results</h2>
        {/* التحقق من وجود بيانات */}
      {students.length === 0 ? (
        <p className="text-center">No students yet.</p>
      ) : (
          // عرض البيانات
        students.map((student) => (
          <div key={student.id} className="card p-3 mb-2">
            {/* Header: Name & Average */}
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{student.name}</strong>
              </div>
              <div>Avg: {student.average.toFixed(2)}</div>
            
            <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(student.id)}
                >
                  Delete
                </button>
            </div>

            {/* Marks row */}
            <div className="row text-center mt-2">
              <div className="col">Mid: {student.mid}</div>
              <div className="col">Final: {student.final}</div>
              <div className="col">Activities: {student.activites}</div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Results;
