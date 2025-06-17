const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyA5BzeEgIuzEGQO76Tl8VGbzvqDbSVluXA";

const generateRecipeBlogPost = async () => {
  const prompt = `
You are a professional culinary blogger. Write a detailed and engaging blog post about a unique recipe. The blog should include:

1. **Title**: Catchy and relevant to the recipe.
2. **Introduction**: A short backstory or context of the recipe (e.g., cultural origin, inspiration).
3. **Ingredients**: A neatly formatted list.
4. **Preparation Steps**: Clear step-by-step instructions.
5. **Cooking Tips**: Optional tips or substitutions.
6. **Nutritional Info**: A rough estimate of calories and key nutrients.
7. **Conclusion**: Encouraging and share-worthy closing.

The tone should be friendly and professional, ideal for food lovers and home cooks. Format it for easy readability.

Example style:
---
**Title**: Grandma’s Secret Butter Chicken  
**Introduction**: This rich and creamy North Indian classic was a weekend favorite at my grandmother’s house...
---
Please write a new recipe blog post now.
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
