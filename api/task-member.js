export default async function handler(req, res) {
    // if (req.method !== "POST") {
    //     return res.status(405).json({ error: "Method not allowed" });
    // }

    const { taskId, token, companyId } = req.body;

    try {
        const apiResponse = await fetch("https://api.cosyfoto.com/", {
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

        const data = await apiResponse.json();
        return res.status(apiResponse.status).json(data);
    } catch (err) {
        return res.status(500).json({ error: "Proxy API failed" });
    }
}
