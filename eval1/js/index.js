const DOM_SELECTOR = {
  SEARCH_INPUT: "#search_artist",
  PAGE_HEADER: ".page__header",
  CONTAINER__HEADER: ".container__header",
  CONTAINER_BODY: ".container__body",
};

const SEARCH_TEXT = "Search Albums by artist name:";

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

const searchArtist = async (e) => {
  e.preventDefault();
  
  const searchInput = document.querySelector(DOM_SELECTOR.SEARCH_INPUT);

  if (searchInput.value?.trim()) {
    renderPageBody(true);
    albums = await fetchData(searchInput.value);
    renderPageBody();
  }
};

const searchArtistOnPress = (e) => {
  if (e.keyCode === 13) searchArtist();
};

const renderPageHeader = () => {
  const el = document.querySelector(DOM_SELECTOR.PAGE_HEADER);

  const searchGroup = document.createElement("div");
  searchGroup.classList.add("search__group");

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = DOM_SELECTOR.SEARCH_INPUT.substring(
    1,
    DOM_SELECTOR.SEARCH_INPUT.length
  );
  searchInput.required = true;
  searchInput.addEventListener("keyup", searchArtistOnPress);

  const searchBtn = document.createElement("button");
  searchBtn.type = "submit";
  const searchIcon = document.createElement('i');
  searchIcon.classList.add("fas", "fa-search");
  render(searchBtn, searchIcon)
  searchBtn.addEventListener("click", searchArtist);

  render(searchGroup, [searchInput, searchBtn]);

  render(el, searchGroup);
};

const renderContainerHeader = (headerText = SEARCH_TEXT) => {
  const el = document.querySelector(DOM_SELECTOR.CONTAINER__HEADER);

  render(el, headerText);
};

const renderContainerHeaderWithSpinner = () => {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');

  renderContainerHeader(spinner);
}

const renderSearchText = () => {
  const searchInput = document.querySelector(DOM_SELECTOR.SEARCH_INPUT);
  const DISPLAY_TEXT = `${albums.resultCount} results for ${searchInput.value}:`;

  renderContainerHeader(DISPLAY_TEXT);
};

const renderAlbum = (album) => {
  const albumCard = document.createElement("figure");
  albumCard.classList.add("album__card");

  const albumImg = document.createElement("img");
  albumImg.classList.add("album__img");
  albumImg.src = album.artworkUrl100;
  albumImg.alt = album.collectionName;

  const albumCaption = document.createElement("figcaption");
  albumCaption.innerText = album.collectionName;
  albumCaption.classList.add("album__title");

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
  if (searching) return renderContainerHeaderWithSpinner(); // return rendering icon

  // initial render
  if (Object.keys(albums).length === 0) return renderContainerHeader();

  renderALbumSearch();
};

const init = async () => {
  renderPageHeader();
  renderPageBody();
};

init();
