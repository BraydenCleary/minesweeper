mineSweeper.controller("boardController", ["$rootScope", "$scope", function($rootScope, $scope){
  var numMines = 10;
  $scope.rows = 8;
  var numNonMines = $scope.rows * $scope.rows - numMines;
  $scope.board = [];
  $scope.tilesRevealed = [];
  $scope.tilesRevealedCount = 0;

  $scope.$watch('tilesRevealedCount', function(newVal){
    if (newVal == numNonMines){
      $rootScope.winner = true
    }
  });

  $scope.$on('mineClicked', function(){
    $rootScope.loser = true;
    $scope.$apply();
  });

  $scope.$on('tileClicked', function(e, data){
    var tileFlipped = _.contains($scope.tilesRevealed, data.id)
    if (!tileFlipped){
      $scope.tilesRevealed.push(data.id)
      $scope.tilesRevealedCount += 1;
      $scope.$apply();
    }
  });

  $scope.resetBoard = function(rows){
    window.location.reload();
  }

  var generateBlankTiles = function(tileCount){
    _(tileCount).times(function(){
      $scope.board.push('blank tile');
    })
  }

  var generateMineTiles = function(mineCount){
    _(mineCount).times(function(){
      $scope.board.push('mine tile');
    })
  }

  $scope.calculateAdjacentMines = function(index){
    var rows = $scope.rows;
    var row = Math.floor(index / rows);
    var column = index % rows;
    var surroundingTiles = [];

    if (row == 0 && column == 0){
      //top left
      surroundingTiles.push($scope.board[index+1]);
      surroundingTiles.push($scope.board[index+rows]);
      surroundingTiles.push($scope.board[index+rows+1]);
    } else if (row == 0 && column == rows-1) {
      //top right
      surroundingTiles.push($scope.board[index-1]);
      surroundingTiles.push($scope.board[index+rows]);
      surroundingTiles.push($scope.board[index+rows-1]);
    } else if (row == rows-1 && column == 0) {
      //bottom left
      surroundingTiles.push($scope.board[index-rows]);
      surroundingTiles.push($scope.board[index-rows+1]);
      surroundingTiles.push($scope.board[index+1]);
    } else if (row == rows-1 && column == rows-1) {
      //bottom right
      surroundingTiles.push($scope.board[index-1]);
      surroundingTiles.push($scope.board[index-rows]);
      surroundingTiles.push($scope.board[index-rows-1]);
    } else if (row == 0) {
      //first row
      surroundingTiles.push($scope.board[index-1]);
      surroundingTiles.push($scope.board[index+1]);
      surroundingTiles.push($scope.board[index+rows]);
      surroundingTiles.push($scope.board[index+rows-1]);
      surroundingTiles.push($scope.board[index+rows+1]);
    } else if (row == rows-1) {
      //last row
      surroundingTiles.push($scope.board[index-1]);
      surroundingTiles.push($scope.board[index+1]);
      surroundingTiles.push($scope.board[index-rows]);
      surroundingTiles.push($scope.board[index-rows-1]);
      surroundingTiles.push($scope.board[index-rows+1]);
    } else if (column == 0) {
      //first column
      surroundingTiles.push($scope.board[index+1]);
      surroundingTiles.push($scope.board[index-rows]);
      surroundingTiles.push($scope.board[index-rows+1]);
      surroundingTiles.push($scope.board[index+rows]);
      surroundingTiles.push($scope.board[index+rows+1]);
    } else if (column == rows-1) {
      //last column
      surroundingTiles.push($scope.board[index-1]);
      surroundingTiles.push($scope.board[index-rows]);
      surroundingTiles.push($scope.board[index-rows-1]);
      surroundingTiles.push($scope.board[index+rows]);
      surroundingTiles.push($scope.board[index+rows-1]);
    } else {
      //everything else
      surroundingTiles.push($scope.board[index-1]);
      surroundingTiles.push($scope.board[index+1]);
      surroundingTiles.push($scope.board[index+rows]);
      surroundingTiles.push($scope.board[index+rows-1]);
      surroundingTiles.push($scope.board[index+rows+1]);
      surroundingTiles.push($scope.board[index-rows]);
      surroundingTiles.push($scope.board[index-rows-1]);
      surroundingTiles.push($scope.board[index-rows+1]);
    }

    return _.filter(surroundingTiles, function(tile){ return tile == 'mine tile'; }).length;
  }

  $scope.generateBoard = function(rows){
    var boardSize = rows * rows
    generateBlankTiles(boardSize - numMines);
    generateMineTiles(numMines);
    $scope.board = _.shuffle($scope.board);
  }

  $scope.styleTile = function(){
    return {'width': 100 / $scope.rows + "%"};
  }

  $scope.generateBoard($scope.rows);

  $scope.surroundingTiles = function(index){
    var rows = $scope.rows;
    var row = Math.floor(index / rows);
    var column = index % rows;
    var surroundingTiles = [];

    if (row == 0 && column == 0){
      //top left
      surroundingTiles.push(index+1);
      surroundingTiles.push(index+rows);
      surroundingTiles.push(index+rows+1);
    } else if (row == 0 && column == rows-1) {
      //top right
      surroundingTiles.push(index-1);
      surroundingTiles.push(index+rows);
      surroundingTiles.push(index+rows-1);
    } else if (row == rows-1 && column == 0) {
      //bottom left
      surroundingTiles.push(index-rows);
      surroundingTiles.push(index-rows+1);
      surroundingTiles.push(index+1);
    } else if (row == rows-1 && column == rows-1) {
      //bottom right
      surroundingTiles.push(index-1);
      surroundingTiles.push(index-rows);
      surroundingTiles.push(index-rows-1);
    } else if (row == 0) {
      //first row
      surroundingTiles.push(index-1);
      surroundingTiles.push(index+1);
      surroundingTiles.push(index+rows);
      surroundingTiles.push(index+rows-1);
      surroundingTiles.push(index+rows+1);
    } else if (row == rows-1) {
      //last row
      surroundingTiles.push(index-1);
      surroundingTiles.push(index+1);
      surroundingTiles.push(index-rows);
      surroundingTiles.push(index-rows-1);
      surroundingTiles.push(index-rows+1);
    } else if (column == 0) {
      //first column
      surroundingTiles.push(index+1);
      surroundingTiles.push(index-rows);
      surroundingTiles.push(index-rows+1);
      surroundingTiles.push(index+rows);
      surroundingTiles.push(index+rows+1);
    } else if (column == rows-1) {
      //last column
      surroundingTiles.push(index-1);
      surroundingTiles.push(index-rows);
      surroundingTiles.push(index-rows-1);
      surroundingTiles.push(index+rows);
      surroundingTiles.push(index+rows-1);
    } else {
      //everything else
      surroundingTiles.push(index-1);
      surroundingTiles.push(index+1);
      surroundingTiles.push(index+rows);
      surroundingTiles.push(index+rows-1);
      surroundingTiles.push(index+rows+1);
      surroundingTiles.push(index-rows);
      surroundingTiles.push(index-rows-1);
      surroundingTiles.push(index-rows+1);
    }
    return surroundingTiles;
  }
}])
