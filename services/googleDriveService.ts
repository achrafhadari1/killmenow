// googleDriveService.ts
let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

export async function listMusicFiles() {
  if (!accessToken) throw new Error("Not authenticated");

  const url =
    "https://www.googleapis.com/drive/v3/files?" +
    new URLSearchParams({
      q: "mimeType contains 'audio/' and trashed = false",
      fields: "files(id,name,mimeType,size,modifiedTime)",
      pageSize: "1000",
    });

  console.log("Fetching from:", url); // ADD THIS

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  console.log("Google Drive API response:", data); // ADD THIS

  return data.files;
}

export async function getFileMetadata(fileId: string) {
  if (!accessToken) throw new Error("Not authenticated");

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=*`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return await response.json();
}

export async function getStreamUrl(fileId: string) {
  if (!accessToken) throw new Error("Not authenticated");
  return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&access_token=${accessToken}`;
}
