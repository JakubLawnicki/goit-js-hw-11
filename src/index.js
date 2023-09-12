import axios from 'axios';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// axios.defaults.baseURL = 'https://pixabay.com/api/';
// axios.defaults.headers.common['key'] = '39399100-235016f623ce03cad7242737a';
// Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
// Notiflix.Notify.failure(
//   `We're sorry, but you've reached the end of search results.`
// );

const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const params = {
  key: '39408745-32e39ba950214e66e33847e97',
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  page: 1,
  per_page: 5,
};

input.addEventListener('change', () => {
  params.q = input.value;
  loadMore.classList.add('hidden');
  gallery.replaceChildren();
  params.page = 1;
});

form.addEventListener('submit', e => {
  e.preventDefault();
  axios
    .get('https://pixabay.com/api/', { params })
    .then(response => {
      if (response.data.totalHits === 0) {
        return Notiflix.Notify.failure(
          `We're sorry, but you've reached the end of search results.`
        );
      } else {
        response.data.hits.forEach(item => {
          gallery.insertAdjacentHTML(
            'beforeend',
            `<div class="photo-card">
          <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes ${item.likes}</b>
            </p>
            <p class="info-item">
              <b>Views ${item.views}</b>
            </p>
            <p class="info-item">
              <b>Comments ${item.comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads ${item.downloads}</b>
            </p>
          </div>
        </div>`
          );
        });

        loadMore.classList.remove('hidden');
      }
    })
    .catch(error => console.log(error));
});

loadMore.addEventListener('click', e => {
  e.preventDefault();
  params.per_page += 1;
  axios.get('https://pixabay.com/api/', { params }).then(response => {
    response.data.hits.forEach(item => {
      gallery.insertAdjacentHTML(
        'beforeend',
        `<div class="photo-card">
          <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes ${item.likes}</b>
            </p>
            <p class="info-item">
              <b>Views ${item.views}</b>
            </p>
            <p class="info-item">
              <b>Comments ${item.comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads ${item.downloads}</b>
            </p>
          </div>
        </div>`
      );
    });
  });
});
