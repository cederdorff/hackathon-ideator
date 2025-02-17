import mistral from "../config/mistral.server";

export async function action() {
  const response = await mistral.chat.complete({
    model: "mistral-small-latest",
    messages: [
      {
        role: "user",
        content:
          "Come up with good ideas for instagram caption about Nybyggerne.",
      },
      {
        role: "system",
        content:
          "Nybyggerne is a Danish reality TV show where couples build the inside of a house. It's a competition, and the couple with the best house wins. The show is very popular in Denmark.",
      },
    ],
  });
  return Response.json(response);
}
