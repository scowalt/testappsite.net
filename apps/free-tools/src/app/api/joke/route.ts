export async function GET() {
  const response = await fetch(
    "https://official-joke-api.appspot.com/random_joke"
  );

  if (!response.ok) {
    return Response.json(
      { error: "Failed to fetch joke" },
      { status: response.status }
    );
  }

  const joke = await response.json();
  return Response.json(joke);
}
