const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/run-blog-post", async (req, res) => {
  const blog_content = "Automated blog post at " + new Date().toLocaleString();
  try {
    const response = await fetch("https://blog-agent-backend-ja2b.onrender.com/api/post/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blog_content }),
    });
    const data = await response.json();
    console.log("✅ Blog posted:", data);
    res.send("✅ Blog posted: " + JSON.stringify(data));
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("❌ Error posting blog");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
