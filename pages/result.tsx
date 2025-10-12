import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { RootState } from "../redux/store";
import { studentAction } from "../redux/slices/studentsSlice";
import { Button } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { FloatButton } from "antd";
const Results: React.FC = () => {
  // ✅ fetch data from redux
  const students = useSelector((state: RootState) => state.students.data);
  const dispatch = useDispatch();
  const router = useRouter();

  // ✅ Fetch students from API
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get("/api/marks");
        const fetchedStudents = response.data.data || [];

        // تحويل بيانات MongoDB إلى شكل مناسب
        const mappedStudents = fetchedStudents.map((student: any) => ({
          id: student._id,
          name: student.name,
          mid: student.mid,
          final: student.final,
          activites: student.activites,
          average: (student.mid + student.final + student.activites) / 3,
        }));

        dispatch(studentAction.setStudents(mappedStudents));
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudent();
  }, [dispatch]);

  // ✅ Navigation to Add Student page
  const handleNew = () => {
    router.push(`/`);
  };

  // ✅ Delete Student
  const handleDelete = async (id: number) => {
    if (confirm("ARE YOU SURE YOU WANT TO DELETE THIS STUDENT?")) {
      try {
        await axios.delete(`/api/marks/delete/${id}`);
        dispatch(studentAction.removeStudent(id));
        alert("Student deleted successfully");
      } catch (error: any) {
        console.error(error);
        alert("Failed to delete student");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">Student Results</h2>

      {/* ✅ التحقق من وجود بيانات */}
      {students.length === 0 ? (
        <p className="text-center">No students yet.</p>
      ) : (
        students.map((student, index) => (
          <div
            key={`${student._id || student.id}-${index}`}
            className="card p-3 mb-2 shadow-sm"
          >
            {/* ✅ اسم الطالب */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <strong>{student.name}</strong>
            </div>

            {/* ✅ العلامات */}
            <div className="row text-center mt-2">
              <div className="col">Mid: {student.mid}</div>
              <div className="col">Final: {student.final}</div>
              <div className="col">Activities: {student.activites}</div>
              <div>Avg: {student.average.toFixed(2)}</div>
            </div>

            {/* ✅ أزرار التحكم */}
            <div className="mt-3 d-flex gap-2">
              <Button
               type="primary"
                style={{
                  background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
                  border: "none",
                  color: "white",
                  fontWeight: "bold",
                }}
                shape="round"
                variant="dashed"
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(student.id)}
              >
                Delete
              </Button>

            

              <FloatButton.Group shape="square" style={{ right: 24 }}>
                <FloatButton
                  type="default"
                  icon={<PlusCircleOutlined />}
                  onClick={handleNew}
                  shape="square"
                  tooltip="Add new student"
                />
                {/* <FloatButton
                  icon={<DeleteOutlined />}
                  tooltip="Delete"
                  onClick={() => handleDelete(student.id)}
                /> */}
              </FloatButton.Group>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
export default Results;
