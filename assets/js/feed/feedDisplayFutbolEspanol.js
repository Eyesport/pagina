
/**
 * @namespace aria
 */
var aria = aria || {};

aria.NoticiasData = [
  {
    name: '<strong>Brillante Actuación de Lio Messi</strong>',
    id: 1,
    type:'<p>  El astro argentino del <strong>Futbol Club Barcelona, Lionel Messi</strong>, completó este domingo ante el Real Betis una esplendida actuación por el partido de Liga, donde junto a la genialidad de <strong>Luis Suárez<strong> lograron darle el triunfo al <strong>Barcelona 4 a 1;</strong> quienes son más lideres que nunca a pocas fechas de culminar el campeonato liguero. </p>',
    image: 'imgfutbol/brillante-messi.jpg',
    audio: "audiofutbol/messibetis.mp3",
    link:"noticias/messi-brillante.html"
  },
  {
    name: '<strong>El Barcelona se impone sobre el Real Madrid en Copa del Rey</strong>',
    id: 2,
    type:'   <p>  <strong>El FC Barcelona</strong> se impuso ante el <strong>Real Madrid</strong>en el partido de vuelta de la semifinal de <strong>Copa del Rey en el Santiago Bernabéu</strong>, con un marcador de 3 goles por 0, encuentro en el que el equipo merengue parecía lucir superior, sobre todo en el primer tiempo cuando tenía asediada el área del equipo culé, generando muchas oportunidades de gol, pero ninguna concretada con éxito. </p>',
    image: 'imgfutbol/barca-madrid.jpg',
    audio: "audiofutbol/barcamadrid.mp3",
    link:"noticias/barca-madrid.html"
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