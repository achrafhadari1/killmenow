// googleDriveService.ts
let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

export async function listMusicFiles() {
  if (!accessToken) {
    console.error("Access token is null or empty");
    throw new Error("Not authenticated - missing access token");
  }

  console.log(
    "Using access token (first 10 chars):",
    accessToken.substring(0, 10) + "..."
  );

  const url =
    "https://www.googleapis.com/drive/v3/files?" +
    new URLSearchParams({
      q: "mimeType contains 'audio/' and trashed = false",
      fields: "files(id,name,mimeType,size,modifiedTime)",
      pageSize: "1000",
    });

  console.log("Fetching from:", url);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error(
        "API request failed:",
        response.status,
        response.statusText
      );
      const errorText = await response.text();
      console.error("Error details:", errorText);
      throw new Error(
        `Google Drive API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(
      "Google Drive API response received, files count:",
      data.files?.length || 0
    );

    if (!data.files) {
      console.warn("No files array in response:", JSON.stringify(data));
      return [];
    }

    return data.files;
  } catch (error) {
    console.error("Failed to fetch music files:", error);
    throw error;
  }
}

export async function getFileMetadata(fileId: string) {
  if (!accessToken) {
    console.error("Access token is null or empty");
    throw new Error("Not authenticated - missing access token");
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=*`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error(
        "API request failed:",
        response.status,
        response.statusText
      );
      const errorText = await response.text();
      console.error("Error details:", errorText);
      throw new Error(
        `Google Drive API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to get metadata for file ${fileId}:`, error);
    throw error;
  }
}

export async function getStreamUrl(fileId: string) {
  if (!accessToken) {
    console.error("Access token is null or empty");
    throw new Error("Not authenticated - missing access token");
  }

  // Log that we're generating a stream URL (useful for debugging)
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&access_token=${accessToken}`;
  console.log(`Generated stream URL for file ${fileId}`);
  return url;
}
