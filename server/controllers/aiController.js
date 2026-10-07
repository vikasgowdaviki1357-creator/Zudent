import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        message: "Messages are required",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content: `
You are JIT AI, the intelligent assistant inside the
Jyothy Institute of Technology College Super App.

You help JIT students with:

- Academics
- Attendance
- Timetable
- Assignments
- Marks
- CGPA
- Exams
- Study resources
- Notes
- Question papers
- Marketplace
- Placements
- Internships
- Events
- Clubs
- College bus information
- Lost and Found
- Leave applications
- Complaints
- Campus notices

Important rules:

1. Be concise and student-friendly.
2. Never invent student attendance, marks, CGPA,
   timetable or other personal academic information.
3. If actual college data is unavailable, clearly say
   that the data has not yet been connected.
4. You are specifically the assistant for
   Jyothy Institute of Technology.
5. Help students navigate the College Super App.
          `,
        },

        ...messages.map((message) => ({
          role: message.role,
          content: message.text || message.content,
        })),
      ],

      temperature: 0.5,
      max_completion_tokens: 800,
    });

    const answer =
      completion.choices?.[0]?.message?.content;

    return res.status(200).json({
      reply: answer || "I couldn't generate a response.",
    });
  } catch (error) {
    console.error("Groq AI Error:", error);

    return res.status(500).json({
      message: "AI Assistant failed",
      error: error.message,
    });
  }
};