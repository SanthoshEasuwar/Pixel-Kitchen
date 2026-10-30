export async function exportPalette(colors: string[]) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/exports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ colors }),
    });
    if (!res.ok) throw new Error("Export failed");
    const data = await res.json();
    window.open(data.url, "_blank");
  } catch (err) {
    console.error(err);
    alert("Export failed, try again");
  }
}