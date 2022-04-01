const DOM_SELECTOR = {
  CAROUSEL_LIST: ".carousel__list",
  CAROUSEL_BTN_GROUP: ".carousel__btn-group",
};

let movies = [];
let moviesRendered = [];

const fetchData = async () => {
  let data = await fetch("http://localhost:3000/movies")
    .then((res) => res.json())
    .then((json) => json);

  return data;
};

const render = (el, data) => {
  if (data instanceof Array) return el.replaceChildren(...data);

  el.replaceChildren(data);
};

const generateCarouselImg = (carousel) => {
  const { id, imgUrl, name, outlineInfo} = carousel;

  const listNode = document.createElement("li");
  listNode.id = id;
  listNode.classList.add("carousel__slide");

  const imgNode = document.createElement("img");
  imgNode.src = imgUrl;
  imgNode.alt = name;
  imgNode.classList.add("carousel__img");

  const titleNode = document.createElement("h2");
  titleNode.innerText = name;

  const descNode = document.createElement("p");
  descNode.innerText = outlineInfo;

  listNode.append(imgNode, titleNode, descNode);

  return listNode;
};

const generateCarousel = (carouselList) => {
  const renderedList = [];

  for (let i = 0; i < 4; i++) {
    renderedList.push(generateCarouselImg(carouselList[i]));
  }

  moviesRendered = renderedList;

  return renderedList;
};

const renderCarouselList = (carouselList) => {
  const data = generateCarousel(carouselList);
  const el = document.querySelector(DOM_SELECTOR.CAROUSEL_LIST);

  render(el, data);
};

const swapImg = (e) => {
  const { target } = e;

  const carouselListNode = document.querySelector(DOM_SELECTOR.CAROUSEL_LIST);

  if (target.classList.contains("prev")) {
    moviesRendered = [...moviesRendered];
    const popped = moviesRendered.pop();
    const idx = (popped.id + moviesRendered.length + 1) % movies.length;
    moviesRendered.unshift(generateCarouselImg(movies[idx]));
  }

  if (target.classList.contains("next")) {
    moviesRendered = [...moviesRendered];
    const shifted = moviesRendered.shift();
    const idx = (shifted.id + moviesRendered.length) % movies.length;
    moviesRendered.push(generateCarouselImg(movies[idx]));
  }

  render(carouselListNode, moviesRendered);
  renderCarouselBtn();
};

const generateCarouselBtn = (text) => {
  const btn = document.createElement("button");
  btn.innerHTML = text;
  btn.classList.add("carousel__btn");
  btn.addEventListener("click", swapImg);

  if (moviesRendered.length === 0) btn.classList.add("carousel__btn-disable");

  return btn;
};

const compareId = (id1, id2) => id1 * 1 === id2 * 1;

const renderCarouselBtn = () => {
  const imgSectionNodePrev = generateCarouselBtn("&#8656;");
  imgSectionNodePrev.classList.add("prev");

  if (compareId(moviesRendered[0].id, 1))
    imgSectionNodePrev.classList.add("carousel__btn-disable");

  const imgSectionNodeNext = generateCarouselBtn("&#8658;");
  imgSectionNodeNext.classList.add("next");

  if (compareId(moviesRendered[moviesRendered.length - 1].id, movies.length))
    imgSectionNodeNext.classList.add("carousel__btn-disable");

  const el = document.querySelector(DOM_SELECTOR.CAROUSEL_BTN_GROUP);

  render(el, [imgSectionNodePrev, imgSectionNodeNext]);
};

const init = async () => {
  movies = await fetchData();

  renderCarouselList(movies);
  renderCarouselBtn();
};

init();
