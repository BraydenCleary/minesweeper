mineSweeper.directive("tile", ['$rootScope', function($rootScope){
  return {
    restrict: 'A',
    link: function(scope, el, attrs){
      var handleClick = function(domEl){
        if (!$rootScope.winner && !$rootScope.loser){
          var tileIndex = domEl.attr('tile-index');
          var adjacentMines = domEl.attr('adjacent-mines');

          $rootScope.$broadcast('tileClicked', {"id": tileIndex});

          if (!domEl.hasClass('clicked')){
            domEl.addClass('clicked');
            if (domEl.hasClass('mine')){
              domEl.html("<img src='mine.jpg'>");
              $rootScope.$broadcast('mineClicked');
            } else if (adjacentMines == 0) {
              var adjacentTiles = JSON.parse(domEl.attr('adjacent-tiles'));
              _.each(adjacentTiles, function(tile){
                handleClick($(".tile[tile-index=" + tile + "]"));
              });
              domEl.html("<div></div>");
            } else {
              domEl.html("<div>" + adjacentMines + "</div>");
            }
          }
        }
      }

      el.bind('click', function(e){
        handleClick($(this));
      });
    }
  }
}]);
