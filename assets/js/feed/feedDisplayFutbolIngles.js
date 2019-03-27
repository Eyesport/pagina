
/**
 * @namespace aria
 */
var aria = aria || {};

aria.NoticiasData = [
  {
    name: '<strong>Pogba dio un Pequeño guiño al Madrid y a Zidane</strong>',
    id: 1,
    type:'    <p> <strong>Paul Pogba</strong> dio unas declaraciones en rueda de prensa desde <strong>Clairefontaine</strong>, lugar donde está concentrado con la selección de Francia como preparación para el partido de clasificación para la <strong>Eurocopa 2020</strong> ante Moldavia. El jugador del <strong>Manchester United</strong> puso en juego la posibilidad de que haya una intención de fichar por el <strong>Real Madrid</strong>, debido a que, le preguntaron y su respuesta fue “El Madrid es un club de ensueño para todos, uno de los más grandes del mundo.” </p>',
    image: 'imgfutbol/Pogba-madrid.jpg',
    audio: "audiofutbol/pogba-madrid.mp3",
    link:"noticias/pogba-madrid.html"
  },
  {
    name: '<strong>El Tottenham logra milagroso empate ante el Arsenal</strong>',
    id: 2,
    type:'    <p> El guardameta francés <strong>Hugo Lloris</strong> fue clave para el empate del Tottenham luego que tapara un penalti al gabonés <strong>Pierre Emerick Aubameyang</strong> en el <strong>minuto 91</strong> del encuentro. Al igual que <strong>Harry Kane</strong> quien a <strong>un cuarto de hora del final del partido pudo marcara el gol del empate</strong> para lograr salvar un punto ante los gunners. </p>',
    image: 'imgfutbol/Tottenham-arsenal.jpg',
    audio: "audiofutbol/totteham.mp3",
    link:"noticias/spurs.html"
  }
];

aria.FeedDisplay = function (feed, fetchData) {
  this.feed = feed;
  this.feedNode = feed.getFeedNode();
  this.fetchData = fetchData;
  this.currentPage = 0;
  this.perPage = 10;
  this.feedSize = 0;
  this.feedItems = [];
  this.loading = false;
  this.loadingDelay = 200;

  this.lastChecked = Date.now();
  this.loadData();
  this.setupEvents();
};

aria.FeedDisplay.prototype.setDelay = function (delay) {
  this.loadingDelay = delay;
};

aria.FeedDisplay.prototype.loadData = function () {
  var feedData = this.fetchData(this.currentPage, this.perPage);

  if (!this.feedNode || this.loading) {
    return;
  }

  this.feedNode.setAttribute('aria-busy', 'true');
  this.loading = true;

  var loadingItems = [];

  Array.prototype.forEach.call(feedData, function (itemData) {
    var newFeedItem = this.renderItemData(itemData);
    loadingItems.push(newFeedItem);
  }, this);

  this.delayRender(
    loadingItems,
    function () {
      this.feedNode.removeAttribute('aria-busy');
      this.loading = false;
      this.checkLoadMore();
    }.bind(this)
  );
};

aria.FeedDisplay.prototype.delayRender = function (items, onRenderDone) {
  if (!items || !items.length) {
    onRenderDone();
    return;
  }

  var newFeedItem = items.shift();
  this.feedNode.appendChild(newFeedItem);
  this.feedItems.push(newFeedItem);
  this.feed.addItem(newFeedItem);

  this.feedItems.forEach(function (feedItem) {
    feedItem.setAttribute('aria-setsize', this.feedItems.length);
  }, this);

  setTimeout((function () {
    this.delayRender(items, onRenderDone);
  }).bind(this), this.loadingDelay);
};

function focusArticulo(archivo_audio) {
  var sonido = new Audio(archivo_audio);

  sonido.play();
}
function goToLink (event, url) {
  var type = event.type;

  if (
    (type === 'click') ||
    (type === 'keydown' && event.keyCode === 13)
  ) {
    window.location.href = url;

    event.preventDefault();
    event.stopPropagation();
  }
}
aria.FeedDisplay.prototype.renderItemData = function (itemData) {
  var feedItem = document.createElement('div');
  this.feedSize++;

  feedItem.setAttribute('role', 'article');
  feedItem.className = 'noticias-item';
  feedItem.setAttribute('aria-posinset', this.feedSize);
  feedItem.setAttribute('tabindex', '0');
  feedItem.setAttribute('onfocus', "focusArticulo('" + itemData.audio + "')");
  feedItem.setAttribute('id', 'f' + itemData.id);
  feedItem.setAttribute('onkeydown',"goToLink(event,'" + itemData.link + "')");
  feedItem.setAttribute('onclick',"goToLink(event,'" + itemData.link + "')");


  var itemDetails = document.createElement('div');
  itemDetails.className = 'noticias-details';
  var itemContent = '';
  var describedbyIDs = [];
  var noticiasID = 'noticias-name-' + this.feedSize;
  feedItem.setAttribute('aria-labelledby', noticiasID);

  itemContent += '<div class="noticias-name" ' +
    'id="' + noticiasID + '">' +
    itemData.name +
    '</div>';

  if (itemData.image) {
    itemContent += '<div class="noticias-image"> <img src="' +
      itemData.image +
      '"></div>';
  }

  if (itemData.rating) {
    var ratingID = 'noticias-rating-' + this.feedSize;
    itemContent += '<div id="' + ratingID + '">' +
      '</div>';
    describedbyIDs.push(ratingID);
  }

  if (itemData.type) {
    var typeID = 'noticias-type-' + this.feedSize;
    itemContent += '<div class="noticias-type" id="' + typeID + '">' +
      itemData.type +
      '</div>';
    describedbyIDs.push(typeID);
  }

  itemDetails.innerHTML = itemContent;
  feedItem.appendChild(itemDetails);

  var locationBlock = document.createElement('div');
  var locationID = 'noticias-location-' + this.feedSize;
  locationBlock.setAttribute('id', locationID);
  locationBlock.className = 'location-block';
  var locationContent = '';
  describedbyIDs.push(locationID);



  locationBlock.innerHTML = locationContent;
  feedItem.appendChild(locationBlock);

  feedItem.setAttribute('aria-describedby', describedbyIDs.join(' '));

  var actions = document.createElement('div');
  actions.className = 'noticias-actions';
  actions.innerHTML = '';
  actions.setAttribute('href', itemData.link );
  feedItem.appendChild(actions);

  return feedItem;
};

aria.FeedDisplay.prototype.setupEvents = function () {
  window.addEventListener('scroll', this.handleScroll.bind(this));
};

aria.FeedDisplay.prototype.handleScroll = function () {
  var now = Date.now();

  if ((this.lastChecked + 100 - now) < 0) {
    this.checkLoadMore();
    this.lastChecked = now;
  }
};

aria.FeedDisplay.prototype.checkLoadMore = function () {
  if (!this.feedItems || !this.feedItems.length) {
    return;
  }

  var lastFeedItem = this.feedItems[this.feedItems.length - 1];
  var scrollTop = window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;
  var scrollBottom = scrollTop + window.innerHeight;


};