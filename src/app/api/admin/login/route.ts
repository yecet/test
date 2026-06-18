import { validateCredentials, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json(
        { error: "Kullanıcı adı ve şifre gereklidir" },
        { status: 400 }
      );
    }

    if (!validateCredentials(username, password)) {
      return Response.json(
        { error: "Kullanıcı adı veya şifre hatalı" },
        { status: 401 }
      );
    }

    await createSession(username);

    return Response.json({ success: true, message: "Giriş başarılı" });
  } catch {
    return Response.json(
      { error: "Giriş sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
