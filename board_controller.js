mineSweeper.controller("boardController", ["$timeout", "$rootScope", "$scope", function($timeout, $rootScope, $scope){
  $scope.numMines = 10;
  $scope.flaggedMines = [];
  $scope.flaggedMineCount = 0;
  $scope.rows = 8;
  var numNonMines = $scope.rows * $scope.rows - $scope.numMines;
  $scope.board = [];
  $scope.tilesRevealed = [];
  $scope.tilesRevealedCount = 0;

  $scope.$on('flagAdded', function(e, data){
    addFlaggedMine(data.id);
  })

  var addFlaggedMine = function(id){
    $scope.flaggedMines.push(id);
    $scope.flaggedMineCount += 1;
    $scope.$apply();
  }

  var destroyFlaggedMine = function(id){
    $scope.flaggedMines = _.without($scope.flaggedMines, id);
    $scope.flaggedMineCount -= 1;
    $scope.$apply();
  }

  var youLose = function(){
    $rootScope.loser = true;
    $rootScope.$broadcast('timer-stop');
    $timeout(function(){
      $scope.$apply();
    })
  }

  var youWin = function(){
    $rootScope.winner = true;
    $rootScope.$broadcast('timer-stop');
  }

  $scope.$on('flagRemoved', function(e, data){
    destroyFlaggedMine(data.id);
  })

  $scope.$watch('tilesRevealedCount', function(newVal){
    if (newVal == numNonMines){
      youWin();
    }
  });

  $scope.$on('mineClicked', function(){
    youLose();
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

  $scope.checkBoard = function(){
    if ($scope.flaggedMines.length != $scope.numMines){
      youLose();
    } else {
      var incorrectlyFlaggedMines = _.difference(_.map($scope.flaggedMines, function(num){return parseInt(num)}), $scope.mineIndicies);
      debugger
      if (incorrectlyFlaggedMines.length == 0){
        debugger
        youWin();
      } else {
        youLose();
      }
    }
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

  $scope.flipCheating = function(){
    if ($scope.cheating){
      $scope.cheating = false
    } else {
      $scope.cheating = true
    }
  }

  $scope.isCheating = function(){
    if ($scope.cheating){
      return 'cheat'
    }
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

  var generateMineIndicies = function(){
    var mineIndicies = [];
    _.each($scope.board, function(tile, index){
      if (tile == 'mine tile'){
        mineIndicies.push(index)
      }
    });
    return mineIndicies;
  }

  $scope.generateBoard = function(rows){
    var boardSize = rows * rows
    generateBlankTiles(boardSize - $scope.numMines);
    generateMineTiles($scope.numMines);
    $scope.board = _.shuffle($scope.board);
    $scope.mineIndicies = generateMineIndicies();
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
