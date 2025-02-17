import mistral from "../config/mistral.server";
import type { Route } from "./+types/chat";
import { z } from "zod";

const projectIdeaSchema = z.object({
  projectName: z.string(),
  description: z.string(),
  keyFeatures: z.array(z.string()),
  targetAudience: z.string(),
  timeline: z.array(
    z.object({
      day: z.number(),
      tasks: z.array(z.string()),
    }),
  ),
  uiComponentsUsed: z.array(z.string()),
  mainChallenge: z.string(),
  numberOfDevelopers: z.number(),
  estimatedTotalTime: z.number(),
});

export type ProjectIdea = z.infer<typeof projectIdeaSchema>;

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const message = formData.get("message") as string;
  const response = await mistral.chat.parse({
    model: "mistral-small-latest",
    messages: [
      {
        role: "system" as const,
        content:
          "You are a hackathon project advisor specialized in web development. Your goal is to generate a creative project idea for a team of 4 students.\n\n" +
          "Technical Stack:\n" +
          "- Remix web framework\n" +
          "- MongoDB\n" +
          "- Mistral AI API\n\n" +
          "Time Constraint: 4 days\n\n" +
          "Available UI Components (from Figma):\n" +
          "- Onboarding flow\n" +
          "- Chatbot interface\n" +
          "- Detail pages and collections\n" +
          "- AI-powered content generation\n" +
          "- Social network features (Instagram-style)\n" +
          "- User dashboard\n\n" +
          "While these components are from a recipe app design, your suggestion should creatively adapt them to another domain. Focus on a feasible, engaging project that showcases the integration of AI with web technologies. Aim for a limited scope that only uses a subset of the UI Components, so there is time to polish the UI and UX.\n\n" +
          "Always reply with a single, concise project idea.\n\n" +
          "These ideas have already been generated, so do not suggest them:\n" +
          "- Travel planner\n" +
          "- Event planner\n" +
          "- Study Buddy\n" +
          "- Fitness tracker\n",
      },
      // If the user has already provided a message, include it in the message thread
      ...(message
        ? [
            {
              role: "assistant" as const,
              content:
                "Can you provide me with a project idea that you want me to expand?",
            },
            {
              role: "user" as const,
              content: message,
            },
          ]
        : []),
    ],
    responseFormat: projectIdeaSchema,
  });
  // Return the first choice from the Mistral response as a JSON response
  return Response.json(response.choices?.[0]?.message?.parsed);
}
