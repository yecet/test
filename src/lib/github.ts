// GitHub Contents API wrapper – server-side only
// All GitHub operations go through this module to ensure the token never leaks to the client.

const GITHUB_API = "https://api.github.com";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !owner || !repo) {
    throw new Error(
      "GitHub yapılandırması eksik. Lütfen .env.local veya Vercel panelindeki GITHUB_TOKEN, GITHUB_OWNER ve GITHUB_REPO ortam değişkenlerini ayarlayın."
    );
  }

  return { token, owner, repo, branch };
}

function headers() {
  const { token } = getConfig();
  // Classic PAT tokens start with ghp_, fine-grained with github_pat_
  // Classic PAT requires "token" prefix, fine-grained accepts "Bearer"
  const prefix = token.startsWith("ghp_") ? "token" : "Bearer";
  return {
    Authorization: `${prefix} ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

async function handleGitHubError(res: Response, path: string, operation: string): Promise<never> {
  const status = res.status;
  let detail = "";
  try {
    const json = await res.json();
    detail = json.message || JSON.stringify(json);
  } catch {
    try {
      detail = await res.text();
    } catch {
      detail = "Hata detayı okunamadı";
    }
  }

  let userFriendly = `GitHub API Hatası (${operation})`;

  if (status === 401) {
    userFriendly = "GitHub Token geçersiz veya süresi dolmuş. Lütfen .env.local veya Vercel panelindeki GITHUB_TOKEN değerini kontrol edin.";
  } else if (status === 403) {
    if (detail.toLowerCase().includes("resource not accessible by personal access token")) {
      userFriendly = "Token repository contents write (yazma) iznine sahip değil. Lütfen token ayarlarından (Fine-grained Token -> Repository Permissions -> Contents -> Read and Write) yazma yetkisi verildiğinden emin olun.";
    } else if (detail.toLowerCase().includes("rate limit exceeded")) {
      userFriendly = "GitHub API istek limitine ulaşıldı. Lütfen bir süre sonra tekrar deneyin.";
    } else {
      userFriendly = "GitHub API erişim izni reddedildi (403 Forbidden). Lütfen token yetkilerini kontrol edin.";
    }
  } else if (status === 404) {
    userFriendly = `Belirtilen repository veya dosya yolu bulunamadı (${path}). Lütfen GITHUB_OWNER ve GITHUB_REPO değişkenlerini kontrol edin.`;
  } else if (status === 409) {
    userFriendly = `Dosya çakışması (409 Conflict). Dosya siz düzenlerken başkası tarafından güncellenmiş olabilir. Lütfen sayfayı yenileyip tekrar deneyin.`;
  } else if (status === 422) {
    userFriendly = `GitHub API veri doğrulama hatası (422). Dosya zaten güncellenmiş olabilir veya SHA değeri geçersizdir.`;
  }

  throw new Error(`${userFriendly} (Detay: ${detail})`);
}

// ---- Get file content & SHA ----
export async function getFileContent(
  path: string
): Promise<{ content: string; sha: string }> {
  const { owner, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

  const res = await fetch(url, { headers: headers(), cache: "no-store" });

  if (!res.ok) {
    await handleGitHubError(res, path, "dosya okuma");
  }

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}

// ---- Update existing file ----
export async function updateFile(
  path: string,
  content: string,
  message: string,
  sha: string
): Promise<void> {
  const { owner, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  const body = JSON.stringify({
    message,
    content: Buffer.from(content).toString("base64"),
    sha,
    branch,
  });

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(),
    body,
  });

  if (!res.ok) {
    await handleGitHubError(res, path, "dosya güncelleme");
  }
}

// ---- Create new file ----
export async function createFile(
  path: string,
  content: string,
  message: string
): Promise<void> {
  const { owner, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  const body = JSON.stringify({
    message,
    content: Buffer.from(content).toString("base64"),
    branch,
  });

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(),
    body,
  });

  if (!res.ok) {
    await handleGitHubError(res, path, "dosya oluşturma");
  }
}

// ---- Upload binary file (already base64 encoded) ----
export async function uploadBinaryFile(
  path: string,
  base64Content: string,
  message: string
): Promise<void> {
  const { owner, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  // Check if file exists – if so, get SHA for overwrite
  let sha: string | undefined;
  try {
    const existing = await getFileContent(path);
    sha = existing.sha;
  } catch {
    // File doesn't exist – that's fine
  }

  const body: Record<string, string> = {
    message,
    content: base64Content,
    branch,
  };
  if (sha) {
    body.sha = sha;
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    await handleGitHubError(res, path, "dosya yükleme");
  }
}

// ---- Delete file ----
export async function deleteFile(
  path: string,
  sha: string,
  message: string
): Promise<void> {
  const { owner, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  const body = JSON.stringify({
    message,
    sha,
    branch,
  });

  const res = await fetch(url, {
    method: "DELETE",
    headers: headers(),
    body,
  });

  if (!res.ok) {
    await handleGitHubError(res, path, "dosya silme");
  }
}

