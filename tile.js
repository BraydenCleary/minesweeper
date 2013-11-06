mineSweeper.directive("tile", ['$rootScope', function($rootScope){
  return {
    restrict: 'A',
    link: function(scope, el, attrs){
      var handleStandardClick = function(domEl){
        if (!$rootScope.winner && !$rootScope.loser){

          if (!$rootScope.timerStarted && !domEl.hasClass('mine')){
            $rootScope.timerStarted = true;
            $rootScope.$broadcast('timer-start');
          }

          var tileIndex = domEl.attr('tile-index');
          var adjacentMines = domEl.attr('adjacent-mines');

          $rootScope.$broadcast('tileClicked', {"id": tileIndex});

          if (!domEl.hasClass('clicked') && !domEl.hasClass('flagged')){
            domEl.addClass('clicked');
            if (domEl.hasClass('mine')){
              domEl.html("<img src='mine.jpg'>");
              $rootScope.$broadcast('mineClicked');
            } else if (adjacentMines == 0) {
              var adjacentTiles = JSON.parse(domEl.attr('adjacent-tiles'));
              _.each(adjacentTiles, function(tile){
                handleStandardClick($(".tile[tile-index=" + tile + "]"));
              });
              domEl.html("<div></div>");
            } else {
              domEl.html("<div class='adjacent-mine-count'>" + adjacentMines + "</div>");
            }
          }
        }
      }

      var handleAltClick = function(domEl){
        if (!$rootScope.winner && !$rootScope.loser){
          if (!$rootScope.timerStarted){
            $rootScope.timerStarted = true;
            $rootScope.$broadcast('timer-start');
          }

          if (domEl.hasClass('flagged')){
            domEl.removeClass('flagged');
            domEl.addClass('question-marked');
            $rootScope.$broadcast('flagRemoved', {id: domEl.attr('tile-index')});
          } else if (domEl.hasClass('question-marked')){
            domEl.removeClass('question-marked');
          } else {
            domEl.addClass('flagged');
            $rootScope.$broadcast('flagAdded', {id: domEl.attr('tile-index')});
          }
        }
      }

      el.bind('click', function(e){
        if (e.altKey){
          handleAltClick($(this));
        } else {
          handleStandardClick($(this));
        }
      });
    }
  }
}]);
