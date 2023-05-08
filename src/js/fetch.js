import axios from 'axios';

export async function fetchGallery(page, query) {
  const per_page = 40;
  const BASE_URL = 'https://pixabay.com/api/?';
  const params = {
    key: '35862234-c36df0b3c5d22090eb9ac9504',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: per_page,
  };

  try {
    const result = await axios.get(BASE_URL, params);
    return result;
  } catch (err) {
    console.log(err);
  }
}
