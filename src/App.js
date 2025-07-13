import React, { useState } from "react";
import { Input, Button, Form, Card, message, Modal, Spin } from "antd";
import "antd/dist/reset.css";
import axios from "axios";

const App = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [taskDetail, setTaskDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  // Gọi API qua CORS proxy
  const findTaskMember = async ({ taskId, token, companyId }) => {
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.cosyfoto.com/",
        {
          m: "taskMember",
          fn: "get-list-member",
          taskId: taskId,
        },
        {
          headers: {
            Authorization: `JWT ${token}`,
            Companyid: companyId,
            "Content-Type": "application/json",
            Accept: "application/json",
            Namespace: "CMS",
          },
        }
      );

      const data = response.data;
      console.log("data:", data);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi gọi API:", error);
      throw error;
    }
  };



  const handleFindTask = async () => {
    const { taskId, token, companyId } = form.getFieldsValue();

    if (!taskId || !token || !companyId) {
      return message.warning("Vui lòng nhập đầy đủ Task ID, Token và Company ID");
    }

    try {
      const data = await findTaskMember({ taskId, token, companyId });
      setTaskDetail(data);
      setModalVisible(true);
    } catch (err) {
      message.error("Không tìm thấy dữ liệu hoặc token sai");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card title="🔍 Tìm người trong Task" style={{ width: 450 }} bordered={false}>
        <Form layout="vertical" form={form}>
          <Form.Item name="taskId" label="ID Task">
            <Input placeholder="Nhập mã Task" />
          </Form.Item>

          <Form.Item name="companyId" label="Company ID">
            <Input placeholder="Nhập Company ID" />
          </Form.Item>

          <Form.Item name="token" label="Token Đăng Nhập">
            <Input.Password placeholder="Nhập Token" />
          </Form.Item>

          <Button
            type="primary"
            block
            onClick={handleFindTask}
            loading={loading}
          >
            🔍 Tìm Việc
          </Button>
        </Form>
      </Card>

      <Modal
        title="📋 Chi tiết Task"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {loading ? (
          <Spin />
        ) : taskDetail ? (
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(taskDetail, null, 2)}
          </pre>
        ) : (
          <p>Không có dữ liệu hiển thị.</p>
        )}
      </Modal>
    </div>
  );
};

export default App;
