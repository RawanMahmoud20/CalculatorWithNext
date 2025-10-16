import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Typography, Button, Card, FloatButton, Slider, Flex, Modal } from "antd";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { RootState } from "../redux/store";
import { studentAction } from "../redux/slices/studentsSlice";
import { useRouter } from "next/router";

const Results: React.FC = () => {
  const students = useSelector((state: RootState) => state.students.data);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get("/api/marks");
        const fetchedStudents = response.data.data || [];
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
    if (!students || students.length === 0) {
      router.replace("/");
    }
  }, [students, router]);

  const handleNew = () => {
    router.push(`/`);
  };

  const handleDelete = async (id: number) => {
    if (confirm("ARE YOU SURE YOU WANT TO DELETE THIS STUDENT?")) {
      try {
        await axios.delete(`/api/marks/delete/${id}`);
        dispatch(studentAction.removeStudent(id));
        Modal.success({
          title: 'Success',
          content: 'Student deleted successfully',
          okText: 'OK',
        });
        } catch (error: any) {
        console.error(error);
        Modal.error({
          title: 'Error',
          content: 'Failed to delete student',
          okText: 'OK',
        });
      }
    }
  };

  const { Title, Text, Paragraph } = Typography;
  const [text, setText] = useState(
    "Can you describe the reason for your low score so that I can take this into account when conducting the final inspection..."
  );
  const [edit, setEdit] = useState(false);




  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
        Student Results
      </Title>

      {students.length === 0 ? (
        <Text>No students yet.</Text>
      ) : (
        students.map((student, index) => (
          <>

      <Card
        key={`${student._id || student.id}-${index}`}
        style={{ marginBottom: "16px" }}
        hoverable
      >
        {/* اسم الطالب */}
        <Title level={3}>
          The Name: <Text strong>{student.name}</Text>
        </Title>
      <Flex
          justify="space-around"
          align="middle"
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          <div>
            <Title level={5}>
              Mid: <Text mark>{student.mid}</Text>
            </Title>
          </div>

          <Divider type="vertical" style={{ height: "40px" }} />

          <div>
            <Title level={5}>
              Final: <Text mark>{student.final}</Text>
            </Title>
          </div>

          <Divider type="vertical" style={{ height: "40px" }} />

          <div>
            <Title level={5}>
              Activities: <Text mark>{student.activites}</Text>
            </Title>
          </div>

          <Divider type="vertical" style={{ height: "40px" }} />

          <div>
            <Title level={4}>
              Average: <Text mark>{student.average.toFixed(2)}</Text>
            </Title>
          </div>
      </Flex>
        <Flex vertical align="flex-end" justify="space-between" style={{ padding: 32 }}>
          {/* ملاحظات الطالب إذا كانت العلامات منخفضة */}
       {(student.mid < 15 || student.final < 20 || student.activites < 10) && (
            <Paragraph
              copyable
              editable={{
                editing: edit,
                onChange: setText,
                onStart: () => setEdit(true),
                onEnd: () => setEdit(false),
              }}
              onClick={() => {
                setEdit(true);
                setText("");
              }}
              style={{ opacity: 0.5, cursor: "text", marginTop: "16px" }}
            >
              Can you describe the reason for your low score so that I can take this
              into account when conducting the final inspection...
            </Paragraph>
          )}
          {/* أزرار التحكم */}
         <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "16px" }}>
            <Button
              type="primary"
              danger
              style={{
                background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
                border: "none",
                color: "white",
                fontWeight: "bold",
              }}
              onClick={() => handleDelete(student.id)}
            >
              Delete
            </Button>
        </div>
      </Flex>
      </Card>
      <FloatButton.Group shape="square" style={{ right: 24 }}>
        <FloatButton
          type="default"
          icon={<PlusCircleOutlined />}
          onClick={handleNew}
          tooltip="Add new student"
        />
      </FloatButton.Group>

          </>
        ))
      )}
    </div>
  );
};

export default Results;

