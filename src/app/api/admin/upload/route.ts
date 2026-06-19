import { uploadBinaryFile, getFileContent, updateFile } from "@/lib/github";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-zip-compressed",
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
    const session = await getSession();
    if (!session) {
      return Response.json(
        { error: "Yetkilendirme gerekli veya oturum süresi dolmuş" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const targetPath = formData.get("targetPath") as string | null;
    const commitMessage = formData.get("commitMessage") as string | null;

    // Optional: material metadata for auto-updating materials.json
    const materialMeta = formData.get("materialMeta") as string | null;

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
          error: `Desteklenmeyen dosya türü: ${file.type}. İzin verilen türler: PDF, PPTX, DOCX, ZIP, PNG, JPEG`,
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
    const defaultFileName = `${safeName}${ext}`;
    const defaultFullPath = `${targetPath}/${defaultFileName}`.replace(/\/+/g, "/");

    let finalFileName = defaultFileName;
    let finalFullPath = defaultFullPath;

    // Check if file exists in GitHub repository
    let fileExists = false;
    try {
      await getFileContent(defaultFullPath);
      fileExists = true;
    } catch {
      // File does not exist, which is fine
    }

    if (fileExists) {
      const timestamp = Date.now();
      finalFileName = `${safeName}-${timestamp}${ext}`;
      finalFullPath = `${targetPath}/${finalFileName}`.replace(/\/+/g, "/");
    }

    // Convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Upload to GitHub
    const message = commitMessage || `Dosya eklendi: ${originalName}`;
    await uploadBinaryFile(finalFullPath, base64, message);

    // Return the public URL
    const publicUrl = `/${finalFullPath.replace(/^public\//, "")}`;

    // Auto-update materials.json if materialMeta is provided
    if (materialMeta) {
      try {
        const meta = JSON.parse(materialMeta);
        const { content: rawContent, sha } = await getFileContent("content/materials.json");
        const materials = JSON.parse(rawContent);

        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        const timestamp = Date.now();
        const newMaterial = {
          id: `mat-${timestamp}`,
          courseSlug: meta.courseSlug || "",
          title: meta.title || originalName,
          description: meta.description || "",
          week: meta.week ? Number(meta.week) : null,
          type: meta.type || "kaynak",
          fileUrl: publicUrl,
          fileSize: `${sizeMB} MB`,
          uploadedAt: new Date().toISOString().split("T")[0],
        };

        materials.push(newMaterial);
        await updateFile(
          "content/materials.json",
          JSON.stringify(materials, null, 2),
          `Materyal eklendi: ${newMaterial.title}`,
          sha
        );
      } catch (metaErr) {
        // File uploaded successfully but materials.json update failed
        console.error("materials.json güncelleme hatası:", metaErr);
      }
    }

    return Response.json({
      success: true,
      message: `Dosya başarıyla yüklendi ve GitHub'a kaydedildi.`,
      fileName: finalFileName,
      filePath: finalFullPath,
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
