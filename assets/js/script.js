const apiKey = "AIzaSyCJfq41oFqvf9QfI77pTyvh8xQk2me7tRA"; // Replace with your API key
const channelIds = [
  "UCA-mWX9CvCTVFWRMb9bKc9w",
  "UCU2C5JHfTxj9FODXE_lRdhQ",
  "UCZUYNOxNHLU2UpwJ6ECM4gQ",
]; // Replace with your channel IDs

// Fetch videos for all channels
async function fetchVideosForChannels() {
  for (const channelId of channelIds) {
    await fetchVideosFromChannel(channelId);
  }
}

// Fetch videos for a single channel
async function fetchVideosFromChannel(channelId) {
  try {
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );
    const channelData = await channelResponse.json();
    console.log(channelData);
    if (channelData.items.length > 0) {
      const uploadsPlaylistId =
        channelData.items[0].contentDetails.relatedPlaylists.uploads;

      // Fetch videos from the uploads playlist
      const playlistResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
      );
      const playlistData = await playlistResponse.json();

      // Display videos
      displayVideos(playlistData.items, channelId);
    } else {
      console.error(`Channel not found: ${channelId}`);
    }
  } catch (error) {
    console.error(`Error fetching videos for channel ${channelId}:`, error);
  }
}

// Display videos on the website
function displayVideos(videos, channelId) {
  const container = document.getElementById("videoContainer");

  const channelHeader = document.createElement("h3");
  channelHeader.textContent = `Videos from Channel: ${channelId}`;
  container.appendChild(channelHeader);

  videos.forEach((video) => {
    const videoId = video.snippet.resourceId.videoId;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}`;

    iframe.allow =
      "accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    // Create container for iframe
    const div = document.createElement("div");
    div.classList.add("yt-video");

    div.appendChild(iframe);
    container.appendChild(div);
  });
}

// Run the function
fetchVideosForChannels();
