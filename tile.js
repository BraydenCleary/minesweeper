mineSweeper.directive("tile", ['$rootScope', function($rootScope){
  return {
    restrict: 'A',
    link: function(scope, el, attrs){
      var handleStandardClick = function(domEl){
        if (gameInProgress() && tileUnclicked(domEl) && tileUnflagged(domEl)){
          startTimer(domEl);

          var tileIndex = domEl.attr('tile-index');
          var adjacentTiles = JSON.parse(domEl.attr('adjacent-tiles'));
          var adjacentMines = domEl.attr('adjacent-mines');

          $rootScope.$broadcast('tileClicked', {"id": tileIndex});

          domEl.addClass('clicked');
          domEl.removeClass('question-marked');

          if (isMine(domEl)){
            domEl.addClass('boom');
            $rootScope.$broadcast('mineClicked');
          } else if (noAdjacentMines(domEl)) {
            _.each(adjacentTiles, function(tile){
              handleStandardClick($(".tile[tile-index=" + tile + "]"));
            });
          } else {
            domEl.html("<div class='adjacent-mine-count'>" + adjacentMines + "</div>");
          }
        }
      }

      var handleAltClick = function(domEl){
        if (gameInProgress && tileUnclicked(domEl)){
          startTimer(domEl);

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

      var startTimer = function(domEl){
        if (!$rootScope.timerStarted && !domEl.hasClass('mine')){
          $rootScope.timerStarted = true;
          $rootScope.$broadcast('timer-start');
        }
      }

      var isMine = function(domEl){
        return domEl.hasClass('mine');
      }

      var noAdjacentMines = function(domEl){
        return domEl.attr('adjacent-mines') == 0
      }

      var gameInProgress = function(){
        return !$rootScope.winner && !$rootScope.loser
      }

      var tileUnclicked = function(domEl){
        return !domEl.hasClass('clicked')
      }

      var tileUnflagged = function(domEl){
        return !domEl.hasClass('flagged')
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
