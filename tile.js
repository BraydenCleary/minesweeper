mineSweeper.directive("tile", ['$rootScope', function($rootScope){
  return {
    restrict: 'A',
    link: function(scope, el, attrs){
      el.bind('click', function(e){
        if (!$rootScope.winner && !$rootScope.loser){
          var tileIndex = this.getAttribute('tile-index');
          var adjacentMines = this.getAttribute('adjacent-mines');

          $rootScope.$broadcast('tileClicked', {"id": tileIndex});
          $(this).addClass('clicked');

          if (this.classList.contains('mine')){
            this.innerHTML = "<img src='mine.jpg'>"
            $rootScope.$broadcast('mineClicked');
          } else if (adjacentMines == 0) {
            var adjacentTiles = JSON.parse(this.getAttribute('adjacent-tiles'));
            _.each(adjacentTiles, function(tile){
              $(".tile[tile-index=" + tile + "]").trigger('click');
            });
            this.innerHTML = "<div></div>";
          } else {
            this.innerHTML = "<div>" + adjacentMines + "</div>"
          }
        }
      });
    }
  }
}]);
