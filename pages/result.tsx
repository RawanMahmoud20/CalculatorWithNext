import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip, Typography } from "antd";
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
  useEffect(() => {
    // إذا ما فيه بيانات، اعيد التوجيه للصفحة الرئيسية
    if (!students || students.length === 0) {
      router.replace("/"); // replace بدل push عشان ما يرجع بالـ back
    }
  }, [students, router]);
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
const {Title , Text ,Paragraph }=Typography;

const [text , setText]=useState("Can you describe the reason for your low score so that I can take this into account when conducting the final inspection,..................");

const [edit,setEdit]=useState(false);

  return (
    <div className="container mt-4">
      <Title level={2} className="text-center mb-4">Student Results</Title>

      {/* ✅ التحقق من وجود بيانات */}
      {students.length === 0 ? (
        <Text className="text-center">No students yet.</Text>
      ) : (
        students.map((student, index) => (
          <div
            key={`${student._id || student.id}-${index}`}
            className="card p-3 mb-2 shadow-sm"
          >
            {/* ✅ اسم الطالب */}
            <div className="d-flex justify-content-between align-items-center mb-2">
            <Title level={3}>
             The Name :
            <Text strong > {student.name}</Text>
            </Title>
            </div>
          

            {/* ✅ العلامات */}
            <div className="row text-center mt-2">
              <div className="col">
               <Title level={5}>Mid :
                <Text mark> {student.mid}</Text>
                {/* {student.mid} */}
                </Title> 
                </div>
              <div className="col">
                <Title level={5}>Final :
                 <Text mark > {student.final}
                 </Text>
                {/* {student.final} */}
                </Title>
              </div>
              <div className="col">
                <Title level={5}>Activities : <Text mark> {student.activites}</Text>
                {/* {student.activites} */}
                </Title>
              </div>

              <div>
                <Title level={4} >Average : 
                <Text mark> {student.average.toFixed(2)}
                </Text>
                {/* {student.average.toFixed(2)} */}</Title>
              </div>

            </div>
          
          
          {(student.mid <15 || student.final <20 || student.activites <10  ) &&(
          <Paragraph 
              ellipsis={{
              rows:2,
              expandable:true,
              symbol: 'more'
              }}
              copyable
              editable={{
                editing: edit,
                onChange: setText,
                onStart: () => { setText(""); setEdit(true)}, // when click on edit icon
                onEnd: () => setEdit(false), // when finish editing (press enter or click outside)
              }}
              style={{ opacity: 0.5, cursor: "text" }} 
              >
              Can you describe the reason for your low score so that I can take this into account when conducting the final inspection,..................

            </Paragraph>
            )}       
            


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
             {/* <Tooltip s>
             <Button Tooltip="Do you want to edit the marks?">
              Do you want to edit the marks?
             </Button>

           </Tooltip> */}

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
