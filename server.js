import http from "http";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ API key pulled from .env
});

const PORT = 5178;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.url === "/api/chat" && req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { message } = JSON.parse(body);
        console.log("📩 Incoming message from frontend:", message);

        // --- MOCK MODE ---
        if (!process.env.OPENAI_API_KEY || process.env.MOCK_MODE === "true") {
          const fakeReply = `🤖 MockBot says: You said "${message}"`;
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ reply: fakeReply }));
          return;
        }

        // --- REAL OPENAI SDK CALL ---
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        });

        const reply = completion.choices[0].message.content;
        console.log("✅ OpenAI API reply:", reply);

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ reply }));

      } catch (err) {
        console.error("❌ Server error:", err);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Something went wrong" }));
      }
    });

  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});









// import http from "http";
// import dotenv from "dotenv";
// import fetch from "node-fetch";

// dotenv.config();

// const PORT = 5178;

// const server = http.createServer(async (req, res) => {
//   // ✅ Set CORS headers once, globally
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//   if (req.method === "OPTIONS") {
//     res.statusCode = 204;
//     res.end();
//     return;
//   }

//   if (req.url === "/api/chat" && req.method === "POST") {
//     let body = "";

//     req.on("data", chunk => {
//       body += chunk.toString();
//     });

// //    req.on("end", async () => {
// //   try {
// //     const { message } = JSON.parse(body);
// //     console.log("📩 Incoming message from frontend:", message);

// //     const response = await fetch("https://api.openai.com/v1/chat/completions", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
// //       },
// //       body: JSON.stringify({
// //         model: "gpt-3.5-turbo",
// //         messages: [{ role: "user", content: message }],
// //       }),
// //     });

// //     const data = await response.json();
// //     console.log("✅ OpenAI API response:", data);

// //     if (!data.choices || !data.choices[0]?.message?.content) {
// //       throw new Error("Unexpected OpenAI response format");
// //     }

// //     res.statusCode = 200;
// //     res.setHeader("Content-Type", "application/json");
// //     res.end(JSON.stringify({ reply: data.choices[0].message.content }));
// //   } catch (err) {
// //     console.error("❌ Server error:", err);
// //     res.statusCode = 500;
// //     res.setHeader("Content-Type", "application/json");
// //     res.end(JSON.stringify({ error: "Something went wrong" }));
// //   }
// // });
// req.on("end", async () => {
//   try {
//     const { message } = JSON.parse(body);
//     console.log("📩 Incoming message from frontend:", message);

//     // --- MOCK MODE: if no quota, return fake reply ---
//     if (!process.env.OPENAI_API_KEY || process.env.MOCK_MODE === "true") {
//       const fakeReply = `🤖 MockBot says: You said "${message}"`;
//       res.statusCode = 200;
//       res.setHeader("Content-Type", "application/json");
//       res.end(JSON.stringify({ reply: fakeReply }));
//       return;
//     }

//     // --- REAL OPENAI CALL ---
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: message }],
//       }),
//     });

//     const data = await response.json();
//     console.log("✅ OpenAI API response:", data);

//     if (!data.choices || !data.choices[0]?.message?.content) {
//       throw new Error("Unexpected OpenAI response format");
//     }

//     res.statusCode = 200;
//     res.setHeader("Content-Type", "application/json");
//     res.end(JSON.stringify({ reply: data.choices[0].message.content }));

//   } catch (err) {
//     console.error("❌ Server error:", err);
//     res.statusCode = 500;
//     res.setHeader("Content-Type", "application/json");
//     res.end(JSON.stringify({ error: "Something went wrong" }));
//   }
// });


//   } else {
//     res.statusCode = 404;
//     res.setHeader("Content-Type", "application/json");
//     res.end(JSON.stringify({ error: "Route not found" }));
//   }
// });

// server.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });

