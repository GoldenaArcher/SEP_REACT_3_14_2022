const DOM_SELECTOR = {
  SEARCH_INPUT: "#search_artist",
  PAGE_HEADER: ".page__header",
  CONTAINER__HEADER: ".container__header",
  CONTAINER_BODY: ".container__body",
};

const SEARCH_TEXT = "Search Albums by ArtistName:";

let albums = {};

const fetchData = async (artistName) => {
  artistName = artistName || "";

  let data = await fetchJsonp(
    `https://itunes.apple.com/search?term=${artistName}&media=music&entity=album&attribute=artistTerm&limit=200`
  )
    .then((res) => res.json())
    .then((json) => json);

  return data;
};

const render = (el, data) => {
  if (data instanceof Array) return el.replaceChildren(...data);

  el.replaceChildren(data);
};

const searchArtist = async () => {
  const searchInput = document.querySelector(DOM_SELECTOR.SEARCH_INPUT);

  if (searchInput.value) {
    albums = await fetchData(searchInput.value);
    console.log(albums);
    renderPageBody();
  }
};

const renderPageHeader = () => {
  const el = document.querySelector(DOM_SELECTOR.PAGE_HEADER);

  const searchForm = document.createElement("form");

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = DOM_SELECTOR.SEARCH_INPUT.substring(
    1,
    DOM_SELECTOR.SEARCH_INPUT.length
  );
  searchInput.required = true;

  const searchBtn = document.createElement("input");
  searchBtn.type = "button";
  searchBtn.value = "Search";
  searchBtn.addEventListener("click", searchArtist);

  render(searchForm, [searchInput, searchBtn]);

  render(el, searchForm);
};

const renderContainerHeader = (headerText = SEARCH_TEXT) => {
  const el = document.querySelector(DOM_SELECTOR.CONTAINER__HEADER);

  render(el, headerText);
};

const renderSearchText = () => {
  const searchInput = document.querySelector(DOM_SELECTOR.SEARCH_INPUT);
  const DISPLAY_TEXT = `${albums.resultCount} results for ${searchInput.value}:`;

  renderContainerHeader(DISPLAY_TEXT);
};

const renderAlbum = (album) => {
  const albumCard = document.createElement("figure");
  albumCard.classList.add('album__card');

  const albumImg = document.createElement('img');
  albumImg.classList.add('album__img')
  albumImg.src = album.artworkUrl100;
  albumImg.alt = album.collectionName;

  const albumCaption = document.createElement('figcaption');
  albumCaption.innerText = album.collectionName;
  albumCaption.classList.add('album__title')

  render(albumCard, [albumImg, albumCaption]);
  return albumCard;
};

const renderSearchAlbum = () => {
  const data = albums.results.map((album) => renderAlbum(album));

  const el = document.querySelector(DOM_SELECTOR.CONTAINER_BODY);

  render(el, data);
};

const renderALbumSearch = () => {
  renderSearchText();
  renderSearchAlbum();
};

const renderPageBody = (searching = false) => {
  if (searching) return; // return rendering icon

  // initial render
  if (Object.keys(albums).length === 0) return renderContainerHeader();

  renderALbumSearch();
};

const init = async () => {
  renderPageHeader();
  renderPageBody();
};

init();
