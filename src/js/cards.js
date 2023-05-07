export async function createGalleryCards(cards) {
  const markup = await cards
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <a href="${largeImageURL}" class="gallery-item">
      <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" class="img" />
      <div class="info">
        <p class="info-item">
          <b>Likes: ${likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${downloads}</b>
        </p>
      </div>
    </div>
    </a>`;
      }
    )
    .join('');
  return markup;
}
