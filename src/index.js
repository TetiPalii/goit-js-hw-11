import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
const gallerySimpleLightbox = new SimpleLightbox('.gallery a');
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
let page;
let query = '';

form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  query = e.target.searchQuery.value.trim();
  if (!query) {
    gallery.innerHTML = '';
    Notiflix.Notify.failure('Please, enter a search query');
  } else {
    const response = await axios.get('https://pixabay.com/api/?', {
      params: {
        key: '35862234-c36df0b3c5d22090eb9ac9504',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });

    const {
      data: { hits, totalHits },
    } = response;

    if (!hits.length) {
      gallery.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    const markup = await hits
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
          return `<a href ="${largeImageURL} class = " gallery gallery-item"><div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes ${likes}</b>
            </p>
            <p class="info-item">
              <b>Views ${views}</b>
            </p>
            <p class="info-item">
              <b>Comments ${comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads ${downloads}</b>
            </p>
          </div>
        </div></a>`;
        }
      )
      .join('');
    gallery.innerHTML = markup;
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    gallerySimpleLightbox.refresh();
    btnLoadMore.hidden = false;
  }
}

btnLoadMore.addEventListener('click', onBtnLoadMore);

async function onBtnLoadMore(e) {
  page += 1;
  const response = await axios.get('https://pixabay.com/api/?', {
    params: {
      key: '35862234-c36df0b3c5d22090eb9ac9504',
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 40,
    },
  });
  const {
    data: { hits, totalHits },
  } = response;
  const markup = await hits
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
        return `<div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                  <p class="info-item">
                    <b>Likes ${likes}</b>
                  </p>
                  <p class="info-item">
                    <b>Views ${views}</b>
                  </p>
                  <p class="info-item">
                    <b>Comments ${comments}</b>
                  </p>
                  <p class="info-item">
                    <b>Downloads ${downloads}</b>
                  </p>
                </div>
              </div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  console.log(response);
}

//   const value = e.target.searchQuery.value.trim();
//   if (!value) {
//     gallery.innerHTML = '';
//   }

// console.log(hits);
// .then(({ data: { hits, totalHits, allHits } }) => {
//   console.log(totalHits);

//   if (!hits.length) {
//     gallery.innerHTML = '';
//     Notiflix.Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//   }
//   const markup = hits
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => {
//         return `<div class="photo-card">
//             <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//             <div class="info">
//               <p class="info-item">
//                 <b>Likes ${likes}</b>
//               </p>
//               <p class="info-item">
//                 <b>Views ${views}</b>
//               </p>
//               <p class="info-item">
//                 <b>Comments ${comments}</b>
//               </p>
//               <p class="info-item">
//                 <b>Downloads ${downloads}</b>
//               </p>
//             </div>
//           </div>`;
//       }
//     )
//     .join('');
//   gallery.innerHTML = markup;
//   page += 1;
//   btnLoadMore.hidden = false;
//   btnLoadMore.addEventListener('click', onBtnLoadMore);
// })
// .catch(error => console.log(error));
// }
