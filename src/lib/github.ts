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
      "GitHub yapılandırması eksik. GITHUB_TOKEN, GITHUB_OWNER ve GITHUB_REPO ortam değişkenlerini ayarlayın."
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


// ---- Get file content & SHA ----
export async function getFileContent(
  path: string
): Promise<{ content: string; sha: string }> {
  const { owner, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

  const res = await fetch(url, { headers: headers(), cache: "no-store" });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub dosya okuma hatası (${path}): ${res.status} – ${err}`);
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
    const err = await res.text();
    throw new Error(`GitHub dosya güncelleme hatası (${path}): ${res.status} – ${err}`);
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
    const err = await res.text();
    throw new Error(`GitHub dosya oluşturma hatası (${path}): ${res.status} – ${err}`);
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
    const err = await res.text();
    throw new Error(`GitHub dosya yükleme hatası (${path}): ${res.status} – ${err}`);
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
    const err = await res.text();
    throw new Error(`GitHub dosya silme hatası (${path}): ${res.status} – ${err}`);
  }
}
