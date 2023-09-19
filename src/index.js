import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery div a');
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
  per_page: 40,
};

input.addEventListener('change', () => {
  params.q = input.value;
  loadMore.classList.add('hidden');
  gallery.replaceChildren();
  params.page = 1;
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  try {
    const response = await axios.get('https://pixabay.com/api/', { params });

    if (response.data.totalHits === 0) {
      return Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    } else {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
      response.data.hits.forEach(item => {
        gallery.insertAdjacentHTML(
          'beforeend',
          `<div class="photo-card">
            <a href="${item.largeImageURL}"><img src="${item.webformatURL}" alt="${item.tags}" data-source="${item.largeImageURL}" loading="lazy" /></a>
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
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      loadMore.classList.remove('hidden');
    }
  } catch (error) {
    console.log(error.message);
  }
});

loadMore.addEventListener('click', async e => {
  e.preventDefault();
  try {
    params.page += 1;
    const response = await axios.get('https://pixabay.com/api/', { params });

    response.data.hits.forEach(item => {
      gallery.insertAdjacentHTML(
        'beforeend',
        `<div class="photo-card">
          <a href="${item.largeImageURL}"><img src="${item.webformatURL}" alt="${item.tags}" data-source="${item.largeImageURL}" loading="lazy" /></a>
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
    lightbox.refresh();
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    if (response.data.totalHits < params.page * params.per_page) {
      loadMore.classList.add('hidden');
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  } catch (error) {
    console.log(error.message);
  }
});

gallery.addEventListener('click', clickImage);

function clickImage(e) {
  e.preventDefault();
  const lightbox = new SimpleLightbox('.gallery div a');
  if (e.target.nodeName !== 'IMG') {
    return;
  }
}
