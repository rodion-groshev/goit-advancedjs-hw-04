import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { searchingRequest } from './js/pixabay-api';
import { renderImages } from './js/render-functions';
import {
  iziToastError,
  iziToastWarning,
  iziToastInfo,
} from './js/izi-messages';

const form = document.querySelector('.search-form');
const loader = document.querySelector('.loader');
const imagesList = document.querySelector('.images-list');
const loadMoreBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.images-list a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let searchParam = {
  key: '45237174-16156409efac0dde2d7dc0545',
  q: null,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 15,
};

form.addEventListener('submit', async event => {
  event.preventDefault();
  loadMoreBtn.style.visibility = 'hidden';
  const searchQuary = event.target.elements.search_key.value.trim();

  if (searchParam.q !== searchQuary) {
    searchParam.q = searchQuary;
    searchParam.page = 1;
    imagesList.innerHTML = '';
  }

  event.target.elements.search_key.value = '';

  if (!searchParam.q) {
    iziToast.warning(iziToastWarning);
    return;
  }
  
  loader.style.display = 'block';

  await searchingRequest(new URLSearchParams(searchParam))
    .then(imagesData => {
      if (imagesData.total === 0) {
        iziToast.error(iziToastError);
        loader.style.display = 'none';
        return;
      }

      renderImages(imagesData);

      loadMoreBtn.style.visibility = 'visible';
      loader.style.display = 'none';

      lightbox.on('show.simplelightbox', function () {});
      lightbox.refresh();
    })
    .catch(error => console.log(error));
});

loadMoreBtn.addEventListener('click', async () => {
  searchParam.page += 1;
  loadMoreBtn.style.visibility = 'hidden';
  loader.style.display = 'block';

  await searchingRequest(new URLSearchParams(searchParam))
    .then(imagesData => {
      renderImages(imagesData);

      const imageCard = document.querySelector('.images-item');
      const cardSize = imageCard.getBoundingClientRect();
      window.scrollBy(0, cardSize.height * 2);

      loader.style.display = 'none';

      if (searchParam.page * searchParam.per_page > imagesData.totalHits) {
        iziToast.info(iziToastInfo);
        loader.style.display = 'none';
        return;
      }

      loadMoreBtn.style.visibility = 'visible';

      lightbox.on('show.simplelightbox', function () {});
      lightbox.refresh();
    })
    .catch(error => console.log(error));
});
