
/**
 * @function onload
 * @desc 
 */
window.addEventListener('load', function () {
  var feedNode = document.getElementById('noticias-feed');
  var delaySelect = document.getElementById('delay-time-select');
  var noticiasFeed = new aria.Feed(
    feedNode,
    delaySelect
  );

  var noticiasFeedDisplay = new aria.FeedDisplay(
    noticiasFeed,
    function () {
      return aria.NoticiasData;
    }
  );
});