
/**
 * @namespace aria
 */
var aria = aria || {};

aria.NoticiasData = [
  {
    name: '<strong>La Vinotinto Impecable Ante Argentina</strong>',
    id: 1,
    type:'     <p> <strong>Venezuela</strong> disputó su primer juego ante <strong>Argentina</strong>  en este 2019, encuentro que se llevó a cabo en el <strong>Wanda Metropolitano</strong>  y quienes asistieron fueron testigos de un partido histórico para la <strong>Selección Nacional</strong>, debido a que, lograron su segunda victoria histórica ante la <strong>albiceleste</strong>  por un marcador de 3 a 1 este viernes 22 de marzo, con los goles de <strong>Salomón Rondón, Jhon Murillo y Josef Martínez</strong> de penal. </p>',
    image: 'imgfutbol/vinotinto-vence-argentina.jpg',
    audio: "audiofutbol/vzla-gano.mp3",
    link:"noticias/vinotinto-gano.html"
  },
  {
    name: '<strong>La Vinotinto se Enfrentará Ante Argentina</strong> ',
    id: 2,
    type:' <p> <strong>El combinado Vinotinto</strong> se enfrentará este <strong>viernes 22 de marzo</strong> ante la Selección de Argentina en el <strong>Wanda Metropolitano</strong> en la ciudad de Madrid, estadio que le pertenece al <strong>Atlético de Madrid.</strong> Una selección argentina que reincorpora a Messi nuevamente a su grupo de convocados. </p>',
    image: 'imgfutbol/vinotinto-argentina-entrenan.jpg',
    audio: "audiofutbol/vzla-argentina.mp3",
    link:"noticias/vinotinto-argentina.html"
  },
  {
    name: '<strong>Messi Regresa con la Selección de Argentina</strong> ',
    id: 3,
    type:'   <p>  <strong>Lionel Messi</strong> vuelve a los entrenamientos con la <strong>Selección Argentina</strong> tras casi 8 meses de haber dejado a la albiceleste, luego de su atropellada salida desde haber dejado la selección cuando quedaron eliminados del <strong>Mundial de Rusia 2018.</strong> El argentino regresa a tono tras haber completado una gran actuación en La Liga ante el Real Betis. Llega para reforzar a una albiceleste que no contará con la incorporación de <strong>Nicolas Otamendi</strong>, tras sufrir un esguince en un encuentro con el Manchester City y de cara a lo que será la próxima edición de la <strong>Copa América de Brasil 2019.</strong></p>',
    image: 'imgfutbol/messi-vuelve.jpg',
    audio: "audiofutbol/messi-arg.mp3",
    link:"noticias/messi-regresa.html"
  },
  {
    name: '<strong>La promesa de Zlatan Ibrahimovic</strong>',
    id: 4,
    type:'    <p> El astro sueco <strong>Zlatan Ibrahimovic</strong> jugador de <strong>los Angeles Galaxy</strong>, quien comienza su segunda temporada en la <strong>Major League Soccer (MLS) </strong>, afirmó durante la presentación del nuevo uniforme alternativo del equipo que estaba preparado y listo para romper todos los records existentes en la competencia. </p>',
    image: 'imgfutbol/zlatan-mls.jpg',
    audio: "audiofutbol/zlatan.mp3",
    link:"noticias/zlatan.html"
  },
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