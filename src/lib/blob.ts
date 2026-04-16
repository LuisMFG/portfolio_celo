import { put, del } from "@vercel/blob";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

export type UploadedImage = { url: string; pathname: string };

export async function uploadProjectImage(file: File): Promise<UploadedImage> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("Tipo de imagem inválido. Use JPG, PNG ou WebP.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Imagem maior que 5 MB.");
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN não configurado. Configure o Vercel Blob.",
    );
  }

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const random = crypto.randomUUID();
  const pathname = `projects/${random}.${ext}`;

  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });

  return { url: blob.url, pathname: blob.pathname };
}

export async function deleteProjectImage(pathnameOrUrl: string): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    await del(pathnameOrUrl);
  } catch {
    // best effort: a falha em deletar imagem antiga não deve quebrar a operação
  }
}
