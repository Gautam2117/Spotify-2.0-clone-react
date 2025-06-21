import axios from 'axios';

const apiKey = '91aa30c0b6msh90fd43d6aaca243p185f82jsnd8e3df3607ac';
const apiHost = 'shazam-core.p.rapidapi.com';

// ✅ Get Top Charts (Smart simulation via multi-search)
export const getTopCharts = async () => {
  const options = {
    method: 'GET',
    url: `https://${apiHost}/v1/search/multi`,
    params: { query: 'top hits', search_type: 'SONGS' },
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost
    }
  };

  try {
    const response = await axios.request(options);
    if (response.data?.tracks?.hits?.length > 0) {
      return response.data.tracks.hits.map(hit => hit.track);
    } else {
      console.warn('No tracks found in top charts response');
      return [];
    }
  } catch (error) {
    console.error('Error fetching top charts:', error);
    return [];
  }
};

// ✅ Search Songs (same multi-search endpoint)
export const searchSongs = async (query) => {
  const options = {
    method: 'GET',
    url: `https://${apiHost}/v1/search/multi`,
    params: { query, search_type: 'SONGS' },
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost
    }
  };

  try {
    const response = await axios.request(options);
    if (response.data?.tracks?.hits?.length > 0) {
      return response.data.tracks.hits.map(hit => hit.track);
    } else {
      console.warn('No search results found');
      return [];
    }
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
};
