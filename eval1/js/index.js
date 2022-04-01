const DOM_SELECTOR = {
  SEARCH_INPUT: "#search_artist",
  PAGE_HEADER: ".page__header",
  CONTAINER__HEADER: ".container__header",
  CONTAINER_BODY: ".container__body",
  LOAD_MORE: ".load-more",
};

const SEARCH_TEXT = "Search Albums by artist name:";

const LOAD_AMOUNT = 4;
let counter = 0;

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

const handlePermission = (permission) => {
  if (permission !== "granted") return;

  console.log(permission);
  console.log("permission granted");

  var notification = new Notification("Hi there!");
  // const notification = new Notification("New Message From Site", {
  //   body: "You must input artist's name to search",
  //   // icon: "icon.png",
  // });
};

const showNotification = () => {
  if (!window.Notification)
    return alert("You must input artist's name to search");

  Notification.requestPermission().then(handlePermission);
};

const searchArtist = async (e) => {
  e.preventDefault();

  const searchInput = document.querySelector(DOM_SELECTOR.SEARCH_INPUT);

  if (searchInput.value?.trim()) {
    renderPageBody(true);
    albums = await fetchData(searchInput.value);
    renderPageBody();
  } else {
    // alert("You must input artist's name to search");
    showNotification();
  }
};

const searchArtistOnPress = (e) => {
  if (e.keyCode === 13) searchArtist(e);
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
  const searchIcon = document.createElement("i");
  searchIcon.classList.add("fas", "fa-search");
  render(searchBtn, searchIcon);
  searchBtn.addEventListener("click", searchArtist);

  render(searchGroup, [searchInput, searchBtn]);

  render(el, searchGroup);
};

const renderContainerHeader = (headerText = SEARCH_TEXT) => {
  const el = document.querySelector(DOM_SELECTOR.CONTAINER__HEADER);

  render(el, headerText);
};

const renderContainerHeaderWithSpinner = () => {
  const spinner = document.createElement("div");
  spinner.classList.add("spinner");

  renderContainerHeader(spinner);
};

const renderSearchText = () => {
  const searchInput = document.querySelector(DOM_SELECTOR.SEARCH_INPUT);
  const DISPLAY_TEXT = `${albums.resultCount} results for ${searchInput.value}:`;

  renderContainerHeader(DISPLAY_TEXT);
};

const renderAlbum = (album, idx) => {
  const albumCard = document.createElement("figure");
  if (idx >= counter) {
    albumCard.classList.add("hidden");
  }
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
  counter += LOAD_AMOUNT;
  renderLoadMoreBtn();
  const data = albums.results.map((album, idx) => renderAlbum(album, idx));

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

const renderLoadMoreBtn = () => {
  const btn = document.querySelector(DOM_SELECTOR.LOAD_MORE);

  if (counter < albums.resultCount) {
    btn.classList.remove("hidden");
  } else {
    btn.classList.add("hidden");
  }
};

const loadMore = () => {
  if (counter < albums.resultCount) {
    renderSearchAlbum();
    renderLoadMoreBtn();
  }
};

const mountLoadMore = () => {
  const btn = document.querySelector(DOM_SELECTOR.LOAD_MORE);
  renderLoadMoreBtn();

  btn.addEventListener("click", loadMore);
};

const init = async () => {
  renderPageHeader();
  renderPageBody();
  mountLoadMore();
};

init();
