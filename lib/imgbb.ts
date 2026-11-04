export async function uploadToImgbb(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file");
  }
  const body = new FormData();
  body.append("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
    { method: "POST", body }
  );
  const json = await res.json();
  if (!json.success) throw new Error("Image upload failed");
  return json.data.url as string;
}
