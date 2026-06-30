export async function uploadToCloudinary(file, kind = "image") {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !preset) throw new Error("Cloudinary env missing.");
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${kind === "image" ? "image" : "raw"}/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);
  const res = await fetch(endpoint, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Upload failed");
  return data;
}
