// /api/task-member.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST is allowed" });
    }
  
    const { taskId, token, companyId } = req.body;
  
    try {
      const response = await fetch("https://api.cosyfoto.com/", {
        method: "POST",
        headers: {
          Authorization: `JWT ${token}`,
          Companyid: companyId,
          "Content-Type": "application/json",
          Accept: "application/json",
          Namespace: "CMS",
        },
        body: JSON.stringify({
          m: "taskMember",
          fn: "get-list-member",
          taskId,
        }),
      });
  
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(500).json({ error: "Proxy failed", details: error.message });
    }
  }
  