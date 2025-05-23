const API_KEY = "915c54617705a5fcc3a48ef5e0cd4797"; // Replace with your Last.fm API key

export async function getLastFMAlbumInfo(artist, title) {
  // Check if we have a valid API key
  if (!API_KEY || API_KEY === "YOUR_LASTFM_API_KEY") {
    console.log("No valid Last.fm API key provided, skipping metadata fetch");

    // Try to extract album name from title if it contains brackets
    let albumName = null;
    const bracketMatch = title.match(/\[(.*?)\]|\((.*?)\)/);
    if (bracketMatch) {
      albumName = bracketMatch[1] || bracketMatch[2];
      console.log(`Extracted album name from title: ${albumName}`);
    }

    // Group songs by artist at minimum
    return {
      album: albumName,
      year: null,
      genres: [],
      albumArtUrl: null,
    };
  }

  // If we have a valid API key, proceed with Last.fm API call
  const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${encodeURIComponent(
    artist
  )}&album=${encodeURIComponent(title)}&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.album) return null;

    let year = null;
    const published = data.album?.wiki?.published;
    if (published && typeof published === "string") {
      const match = published.trim().match(/\b(\d{4})\b/);
      if (match) year = match[1];
    }

    return {
      album: data.album.name,
      year,
      genres: data.album?.tags?.tag?.map((t) => t.name) || [],
      albumArtUrl:
        data.album?.image?.length > 0
          ? data.album.image[data.album.image.length - 1]["#text"]
          : null,
    };
  } catch (err) {
    console.error("LastFM fetch failed:", err);
    return null;
  }
}
