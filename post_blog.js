const fetch = require("node-fetch");

const API = "https://blog-agent-backend-ja2b.onrender.com/api/post/blog";
const blog_content = "Automated blog post at " + new Date().toLocaleString();

async function postBlog() {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blog_content }),
    });

    const data = await res.json();
    console.log("✅ Blog posted:", data);
  } catch (err) {
    console.error("❌ Error posting blog:", err);
  }
}

postBlog();

