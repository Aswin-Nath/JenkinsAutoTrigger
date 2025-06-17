const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyA5BzeEgIuzEGQO76Tl8VGbzvqDbSVluXA";

const generateRecipeBlogPost = async () => {
  const prompt = `
You are a professional culinary blogger. You are REQUIRED to write a complete and engaging blog post about a unique and delicious recipe.

⚠️ STRICT INSTRUCTIONS:
- DO NOT OMIT any of the following sections.
- The blog MUST follow the exact format and order given below.
- Each section should be clearly labeled with bold headers like **Title**, **Introduction**, etc.
- If any section is missing or improperly formatted, the blog will be rejected.

🎯 BLOG FORMAT TEMPLATE:
---
**Title**: [Write a catchy and relevant title]

**Introduction**: [Short context or backstory: e.g., cultural origin, seasonal inspiration]

**Ingredients**:
* [Item 1]
* [Item 2]
* [Item 3]
(Use clear and consistent bullet points)

**Preparation Steps**:
1. [Step 1]
2. [Step 2]
3. [Step 3]
(Numbered steps must be clear and specific)

**Cooking Tips**:
* [Optional cooking tips or substitutions]

**Nutritional Info**:
* Calories: ~XXX
* Protein: ~XXg
* Carbohydrates: ~XXg
* Fat: ~XXg
(Make it approximate but realistic per serving)

**Conclusion**:
[Encouraging wrap-up. Make it feel personal and engaging.]

Now, write a completely new recipe blog post that strictly follows this structure.
`;

  const url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  const response = await axios.post(url, requestBody);
  const blogPost = response.data.candidates[0].content.parts[0].text;
  return blogPost;
};


app.get("/generate-recipe-blog", async (req, res) => {
  try {
    const blog_content = await generateRecipeBlogPost();
    const result = await axios.post("https://blog-agent-backend-ja2b.onrender.com/api/post/blog", {
      blog_content,
    });
    console.log("✅ Blog posted:", result.data);
    res.send("✅ Recipe blog posted: " + JSON.stringify(result.data));
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).send("❌ Failed to generate/post recipe blog");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
