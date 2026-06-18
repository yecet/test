import { getFileContent, updateFile } from "@/lib/github";

export const dynamic = "force-dynamic";

const VALID_TYPES = [
  "profile",
  "courses",
  "materials",
  "announcements",
  "publications",
  "research",
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;

  if (!VALID_TYPES.includes(type)) {
    return Response.json(
      { error: `Geçersiz içerik türü: ${type}` },
      { status: 400 }
    );
  }

  try {
    const { content, sha } = await getFileContent(`content/${type}.json`);
    const data = JSON.parse(content);
    return Response.json({ data, sha });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Bilinmeyen hata";
    return Response.json(
      { error: `İçerik okunamadı: ${message}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;

  if (!VALID_TYPES.includes(type)) {
    return Response.json(
      { error: `Geçersiz içerik türü: ${type}` },
      { status: 400 }
    );
  }

  try {
    const { data, sha, commitMessage } = await request.json();

    if (!data || !sha) {
      return Response.json(
        { error: "data ve sha alanları gereklidir" },
        { status: 400 }
      );
    }

    const typeLabels: Record<string, string> = {
      profile: "Profil bilgileri",
      courses: "Dersler",
      materials: "Materyaller",
      announcements: "Duyurular",
      publications: "Yayınlar",
      research: "Araştırma",
    };

    const message =
      commitMessage || `Update ${typeLabels[type] || type} content`;
    const content = JSON.stringify(data, null, 2);

    await updateFile(`content/${type}.json`, content, message, sha);

    return Response.json({
      success: true,
      message: `${typeLabels[type]} başarıyla güncellendi ve GitHub'a kaydedildi. Vercel deploy birkaç dakika içinde tamamlanacak.`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Bilinmeyen hata";
    return Response.json(
      { error: `İçerik güncellenemedi: ${message}` },
      { status: 500 }
    );
  }
}
