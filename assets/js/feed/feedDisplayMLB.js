
/**
 * @namespace aria
 */
var aria = aria || {};

aria.NoticiasData = [
  {
    name: '<strong>Miguel Cabrera Logró su Cuarto Cuadrangular de la Pretemporada</strong>',
    id: 1,
    type:'      <p> El toletero criollo <strong>Miguel Cabrera</strong> conectó su cuarto estacazo para la calle en los <strong>Spring Trainning</strong>, este <strong>sábado 23 de marzo</strong>, en una victoria de los <strong>Tigres de Detroit</strong> ante las <strong>Rayas de Tampa Bay</strong> 8 carreras a 7.</p>',
    image: 'imgbeisbol/Miguel-cabrera-cuarto-cuadrangular.jpg',
    audio: "audiobeisbol/cabrera-cuadrangular.mp3",
    link:"noticias/cabrera-cuadrangular.html"
  },
  {
    name: '<strong>Gleyber Torres se Fue por Cuarta Vez a la Calle</strong>',
    id: 2,
    type:'    <p> La gran ofensiva del caraqueño <strong>Gleyber Torres</strong>  volvió a despertar en esta <strong>pretemporada</strong>  al conectar su cuarto bambinazo de los <strong>Spring Trainning</strong>, un cuadrangular de 3 carreras en el primer episodio, pero que no pudo evitar la derrota de <strong>los Yankees de Nueva York</strong>  al caer 7 a 3 ante <strong>los Azulejos de Toronto.</strong></p>',
    image: 'imgbeisbol/gleyber-torres.jpg',
    audio: "audiobeisbol/gleyber.mp3",
    link:"noticias/gleyber.html"
  },
  {
    name: '<strong>Mike Trout: Un contrato fuera de órbita</strong>',
    id: 3,
    type:'<p> Lo que se creía una locura de contrato, tal como lo fue el de <strong>Bryce Harper cuando pactó con los Philips de Philadelphia por 13 años y 330 millones de dólares</strong>, se queda corto comparado con el contrato que pudiera llegar a firmar <strong>Mike Trout</strong> al extender su vínculo con los <strong>Angels de los Ángeles de Anaheim</strong>, el cual tiene la gran suma de <strong>430 millones de dólares por 12 años.</strong></p>',
    image: 'imgbeisbol/mike-trout.jpg',
    audio: "audiobeisbol/mike-trout.mp3",
    link:"noticias/mike-trout.html"
  },
  {
    name: '<strong>Manny Machado logra contrato estratosférico con los Padres de San Diego</strong>',
    id: 4,
    type:'<p> El ex <strong>Dodgers de los Angeles</strong> firmó un contrato de 10 años con los <strong>Padres de San Diego por un total de 300 millones de dólares</strong>, el mismo habría establecido un <strong>récord</strong> en cuanto a los contratos a largo plazo y también cómo el contrato mejor pagado siendo un agente libre. </p>',
    image: 'imgbeisbol/manny-contrato.jpg',
    audio: "audiobeisbol/manny.mp3",
    link:"noticias/noticiabase.html"
  },
  {
    name: '<strong>El triplecoronado Miguel Cabrera regresó a la caja de bateo</strong>',
    id: 5,
    type:'<p> <strong>Miguel Cabrera</strong> se reportó a los entrenamientos de los <strong>Tigres de Detroit</strong>, antes del comienzo del <strong>Spring Training</strong> y la nueva campaña de la <strong>Mejor League Béisbol (MLB).</strong> El toletero criollo oriundo de Maracay lució bastante sólido y en condiciones en cada batazo que conectaba, esto tras su operación el pasado junio. </p>',
    image: 'imgbeisbol/miggy-caja-de-bateo.jpg',
    audio: "audiobeisbol/miguelcabrera.mp3",
    link:"noticias/cabrera-regresa.html"
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