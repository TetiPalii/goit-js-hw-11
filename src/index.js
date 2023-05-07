import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { createGalleryCards } from './js/cards';

const galleryLightbox = new SimpleLightbox('.gallery a');
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const guard = document.querySelector('.guard');
let page;
let query = '';
let totalPages = 0;
const options = {
  root: null,
  rootMargin: '100px',
  threshold: 0,
};
let observer = new IntersectionObserver(onPagination, options);

form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;

  query = e.target.searchQuery.value.trim();
  if (!query) {
    gallery.innerHTML = '';
    Notiflix.Notify.failure('Please, enter a search query');
    return;
  }
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
    return;
  }
  gallery.innerHTML = await createGalleryCards(hits);
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  totalPages = Math.round(totalHits / 40);
  if (page !== totalPages) {
    observer.observe(guard);
  }

  // galleryLightbox.refresh();
  // if (createGalleryCards) {
  //   btnLoadMore.hidden = false;
  // }
}

async function onPagination(entries, observer) {
  entries.forEach(async function (entry) {
    if (entry.isIntersecting) {
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

      gallery.insertAdjacentHTML('beforeend', await createGalleryCards(hits));
      totalPages = Math.round(totalHits / 40);
      if (page === totalPages) {
        observer.unobserve(guard);
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  });
}

// btnLoadMore.addEventListener('click', onBtnLoadMore);

// async function onBtnLoadMore() {
//   btnLoadMore.hidden = true;
//   page += 1;
//   const response = await axios.get('https://pixabay.com/api/?', {
//     params: {
//       key: '35862234-c36df0b3c5d22090eb9ac9504',
//       q: query,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: true,
//       page: page,
//       per_page: 40,
//     },
//   });
//   const {
//     data: { hits, totalHits },
//   } = response;

//   gallery.insertAdjacentHTML('beforeend', await createGalleryCards(hits));
//   if (createGalleryCards) {
//     btnLoadMore.hidden = false;
//   }
//   galleryLightbox.refresh();

//   totalPages = Math.round(totalHits / 40);

//   if (totalPages === page) {
//     Notiflix.Notify.warning(
//       "We're sorry, but you've reached the end of search results."
//     );
//     btnLoadMore.hidden = true;
//   }
// }
