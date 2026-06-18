import { uploadBinaryFile } from "@/lib/github";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[şŞ]/g, "s")
    .replace(/[üÜ]/g, "u")
    .replace(/[^a-z0-9.]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const targetPath = formData.get("targetPath") as string | null;
    const commitMessage = formData.get("commitMessage") as string | null;

    if (!file) {
      return Response.json({ error: "Dosya seçilmedi" }, { status: 400 });
    }

    if (!targetPath) {
      return Response.json(
        { error: "Hedef klasör belirtilmedi" },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return Response.json(
        {
          error: `Desteklenmeyen dosya türü: ${file.type}. İzin verilen türler: PDF, PPTX, DOCX, PNG, JPEG`,
        },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return Response.json(
        {
          error: `Dosya boyutu çok büyük (${sizeMB} MB). Maksimum: 25 MB`,
        },
        { status: 400 }
      );
    }

    // Create safe filename
    const originalName = file.name;
    const ext = originalName.substring(originalName.lastIndexOf("."));
    const nameWithoutExt = originalName.substring(
      0,
      originalName.lastIndexOf(".")
    );
    const safeName = slugify(nameWithoutExt);
    const timestamp = Date.now();
    const fileName = `${safeName}-${timestamp}${ext}`;

    // Build full path
    const fullPath = `${targetPath}/${fileName}`.replace(/\/+/g, "/");

    // Convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Upload to GitHub
    const message =
      commitMessage || `Add file: ${originalName}`;

    await uploadBinaryFile(fullPath, base64, message);

    // Return the public URL
    const publicUrl = `/${fullPath.replace(/^public\//, "")}`;

    return Response.json({
      success: true,
      message: `Dosya başarıyla yüklendi ve GitHub'a kaydedildi. Vercel deploy birkaç dakika içinde tamamlanacak.`,
      fileName,
      filePath: fullPath,
      publicUrl,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Bilinmeyen hata";
    return Response.json(
      { error: `Dosya yüklenemedi: ${message}` },
      { status: 500 }
    );
  }
}
