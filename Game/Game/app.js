var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Roll = (function () {
    function Roll(value, keep) {
        this.value = value;
        this.keep = keep;
    }
    return Roll;
}());
var Player = (function () {
    function Player(name) {
        this.name = name;
        this.rolls = [
            new Roll(0, false),
            new Roll(0, false),
            new Roll(0, false),
            new Roll(0, false),
            new Roll(0, false),
            new Roll(0, false)
        ];
    }
    Player.prototype.setCombination = function (combination) {
        this.combination = combination;
    };
    Player.prototype.getCombination = function () {
        return this.combination;
    };
    Player.prototype.getName = function () {
        return this.name;
    };
    Player.prototype.rollDice = function () {
        for (var i = 0; i < 6; ++i) {
            if (this.rolls[i].keep == false) {
                this.rolls[i].value = getRandomInt(1, 6);
            }
        }
    };
    Player.prototype.keepRoll = function (index, keep) {
        this.rolls[index].keep = keep;
    };
    Player.prototype.getRoll = function (index) {
        if (index < this.rolls.length) {
            return this.rolls[index];
        }
        return new Roll(0, false);
    };
    Player.prototype.getRolls = function () {
        return this.rolls;
    };
    return Player;
}());
var DiceRollGame = (function () {
    function DiceRollGame(player1, player2, maxTurns) {
        if (maxTurns === void 0) { maxTurns = 3; }
        this.currentTurn = 0;
        this.maxTurns = 0;
        this.player1 = new Player(player1);
        this.player2 = new Player(player2);
        this.maxTurns = maxTurns;
    }
    Object.defineProperty(DiceRollGame.prototype, "Player1", {
        get: function () { return this.player1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiceRollGame.prototype, "Player2", {
        get: function () { return this.player2; },
        enumerable: true,
        configurable: true
    });
    DiceRollGame.prototype.nextMove = function () {
        if (this.canMove()) {
            this.player1.rollDice();
            this.player2.rollDice();
            this.currentTurn = this.currentTurn + 1;
        }
    };
    DiceRollGame.prototype.canMove = function () {
        return this.currentTurn < this.maxTurns;
    };
    DiceRollGame.prototype.checkWinner = function () {
        var player1Score = 0;
        var player2Score = 0;
        if (this.player1.getCombination().check(this.player1.getRolls())) {
            player1Score = this.player1.getCombination().getScore();
        }
        if (this.player2.getCombination().check(this.player2.getRolls())) {
            player2Score = this.player2.getCombination().getScore();
        }
        if (player1Score == player2Score) {
            return null;
        }
        return player1Score > player2Score ? this.player1 : this.player2;
    };
    return DiceRollGame;
}());
;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function loadState() {
    var player1Name = localStorage.getItem("player1");
    var player2Name = localStorage.getItem("player2");
    $(player1Id).val(player1Name);
    $(player2Id).val(player2Name);
}
function saveState() {
    var player1Name = $(player1Id).val();
    var player2Name = $(player2Id).val();
    localStorage.setItem("player1", player1Name);
    localStorage.setItem("player2", player2Name);
}
function intializeGame() {
    var player1Name = localStorage.getItem("player1");
    var player2Name = localStorage.getItem("player2");
    game = new DiceRollGame(player1Name, player2Name, 3);
    combinations = [
        new SixDifferentNumbersCombination("1 2 3 4 5 6", "You must roll 6 different numbers.", 6),
        new ThreeXTwoNumbersCombination("3x2", "You must roll 3 same numbers 2 times.", 5),
        new TwoXThreeNumbersCombination("2x3", "You must roll 2 same numbers 3 times.", 5),
        new FourSameNumbersCombination("4 4 4 4", "You must roll 4 same numbers.", 3),
        new FiveSameNumbersCombination("5 5 5 5 5", "You must roll 5 same numbers.", 4),
        new SixSameNumbersCombination("6 6 6 6 6 6", "You must roll 6 same numbers.", 6),
        new NumberOneCombination("1", "You must roll number 1.", 1),
        new NumberTwoCombination("2", "You must roll number 2.", 1),
        new NumberThreeCombination("3", "You must roll number 3.", 1),
        new NumberFourCombination("4", "You must roll number 4.", 1),
        new NumberFiveCombination("5", "You must roll number 5.", 1),
        new NumberSixCombination("6", "You must roll number 6.", 1)
    ];
}
function isRadioChecked(firstPlayerName, secondPlayerName) {
    var notChecked = false;
    var firstPlayerString = "input[name=" + firstPlayerName + "]:checked";
    var secondPlayerString = "input[name=" + secondPlayerName + "]:checked";
    if ($(firstPlayerString).length <= 0) {
        notChecked = true;
    }
    if ($(secondPlayerString).length <= 0) {
        notChecked = true;
    }
    return notChecked;
}
function disableAllRadioButtons() {
    $(":radio").click(function () {
        var radioName = $(this).attr("name");
        $(":radio[name='" + radioName + "']:not(:checked)").attr("disabled", "disabled");
    });
}
function nextMove() {
    var firstPlayerName = game.Player1.getName();
    var secondPlayerName = game.Player2.getName();
    if (!isRadioChecked(firstPlayerName, secondPlayerName)) {
        game.nextMove();
        createDiceRollsTable();
        if (!game.canMove()) {
            if (game.checkWinner() != null) {
                alert(game.checkWinner().getName() + " has won!");
                reInitializeGame();
            }
            else {
                alert("Draw!");
                reInitializeGame();
            }
            toggleButton("startGame");
        }
    }
    else {
        alert("No radio button checked");
    }
}
function reInitializeGame() {
    removeTable(diceRollsTableId);
    removeTable(combinationsTableId);
    intializeGame();
}
;
function toggleButton(btnId) {
    var nextButton = document.getElementById(btnId);
    nextButton.disabled = !nextButton.disabled;
}
function startGame() {
    saveState();
    intializeGame();
    createCombinationsTable(combinations);
    disableAllRadioButtons();
    toggleButton("startGame");
}
function removeTable(id) {
    var previousTable = document.getElementById(id);
    if (previousTable) {
        var tableParent = previousTable.parentNode;
        tableParent.removeChild(previousTable);
    }
}
function createSpanCell(row, title) {
    var cell = row.insertCell();
    var span = document.createElement("span");
    span.innerText = title;
    cell.appendChild(span);
    row.appendChild(cell);
}
function createRollKeepCell(row, roll) {
    var cell = row.insertCell();
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = roll.keep;
    // set event listener to monitor checked state
    checkbox.addEventListener("click", function () {
        // javascript scope will capture roll object
        roll.keep = !roll.keep;
    });
    cell.appendChild(checkbox);
    var span = document.createElement("span");
    span.innerText = roll.value.toString();
    cell.appendChild(span);
    row.appendChild(cell);
}
function insertResultTitles(table) {
    var row = table.insertRow(0);
    row.insertCell();
    for (var i = 1; i < 7; ++i) {
        createSpanCell(row, "#" + i.toString());
    }
}
function insertResultRow(table, player) {
    var row = table.insertRow();
    var playerNameCell = row.insertCell();
    playerNameCell.innerText = player.getName();
    // create cells with results for two players
    for (var _i = 0, _a = player.getRolls(); _i < _a.length; _i++) {
        var roll = _a[_i];
        createRollKeepCell(row, roll);
    }
    table.appendChild(row);
}
function createDiceRollsTable() {
    removeTable(diceRollsTableId);
    var body = document.getElementsByTagName("body")[0];
    var table = document.createElement("table");
    table.setAttribute("id", diceRollsTableId);
    // create titles for players
    insertResultTitles(table);
    // create cell for player results
    insertResultRow(table, game.Player1);
    insertResultRow(table, game.Player2);
    // add created table to DOM
    body.appendChild(table);
}
function createCombinationPickCell(row, player, combination, name) {
    var cell = row.insertCell();
    var radio = document.createElement("input");
    radio.name = name;
    radio.type = "radio";
    radio.checked = false;
    // set event listener to monitor checked state
    radio.addEventListener("click", function () {
        // javascript scope will capture roll object
        player.setCombination(combination);
    });
    cell.appendChild(radio);
    row.appendChild(cell);
}
function insertCombinationTitles(table, combinations) {
    var row = table.insertRow(0);
    row.insertCell();
    for (var _i = 0, combinations_1 = combinations; _i < combinations_1.length; _i++) {
        var combination = combinations_1[_i];
        createSpanCell(row, combination.getName());
    }
}
function insertCombinationsRow(table, player) {
    var row = table.insertRow();
    var playerNameCell = row.insertCell();
    playerNameCell.innerText = player.getName();
    // create cells with results for two players
    for (var _i = 0, combinations_2 = combinations; _i < combinations_2.length; _i++) {
        var combination = combinations_2[_i];
        createCombinationPickCell(row, player, combination, player.getName());
    }
    table.appendChild(row);
}
function createCombinationsTable(combinations) {
    removeTable(combinationsTableId);
    var body = document.getElementsByTagName("body")[0];
    var table = document.createElement("table");
    table.setAttribute("id", combinationsTableId);
    // create titles for combinations
    insertCombinationTitles(table, combinations);
    // create cell for player combinations
    insertCombinationsRow(table, game.Player1);
    insertCombinationsRow(table, game.Player2);
    // add created table to DOM
    body.appendChild(table);
}
var game;
var combinations;
var player1Id = "#player1";
var player2Id = "#player2";
var diceRollsTableId = "dice-rolls-table";
var combinationsTableId = "combinations-table";
$(document).ready(function () {
    loadState();
});
var Dictionary = (function () {
    function Dictionary() {
        this.items = {};
        this.count = 0;
    }
    Dictionary.prototype.ContainsKey = function (key) {
        return this.items.hasOwnProperty(key);
    };
    Dictionary.prototype.Count = function () {
        return this.count;
    };
    Dictionary.prototype.Add = function (key, value) {
        this.items[key] = value;
        this.count++;
    };
    Dictionary.prototype.Remove = function (key) {
        var val = this.items[key];
        delete this.items[key];
        this.count--;
        return val;
    };
    Dictionary.prototype.Item = function (key) {
        return this.items[key];
    };
    Dictionary.prototype.Keys = function () {
        var keySet = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }
        return keySet;
    };
    Dictionary.prototype.Values = function () {
        var values = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }
        return values;
    };
    return Dictionary;
}());
var Combination = (function () {
    function Combination(combinationName, combinationDesc, score) {
        if (score === void 0) { score = 0; }
        this.name = combinationName;
        this.description = combinationDesc;
        this.score = score;
    }
    Combination.prototype.getDescription = function () {
        return this.description;
    };
    Combination.prototype.getName = function () {
        return this.name;
    };
    Combination.prototype.getScore = function () {
        return this.score;
    };
    Combination.prototype.isInArray = function (value, array) {
        for (var i = 0; i < array.length; ++i) {
            if (array[i] == value) {
                return true;
            }
        }
        return false;
    };
    Combination.prototype.findAndCountDublicates = function (numbers) {
        var counts = {};
        numbers.forEach(function (element) {
            counts[element.value] = (counts[element.value] || 0) + 1;
        });
        var dictionary = new Dictionary();
        for (var element in counts) {
            dictionary.Add(element, counts[element]);
        }
        var values = dictionary.Values();
        return values;
    };
    Combination.prototype.hasNumber = function (searchedNumber, numbers) {
        var hasNumber = false;
        hasNumber = this.isInArray(searchedNumber, numbers);
        return hasNumber;
    };
    return Combination;
}());
var SixDifferentNumbersCombination = (function (_super) {
    __extends(SixDifferentNumbersCombination, _super);
    function SixDifferentNumbersCombination(combinationName, combinationDesc, score) {
        return _super.call(this, combinationName, combinationDesc, score) || this;
    }
    SixDifferentNumbersCombination.prototype.check = function (numbers) {
        var isUnique = true;
        for (var i = 0; i < numbers.length; i++) {
            for (var j = 0; j < numbers.length; j++) {
                if (i != j) {
                    if (numbers[i].value == numbers[j].value) {
                        isUnique = false;
                    }
                }
            }
        }
        return isUnique;
    };
    ;
    return SixDifferentNumbersCombination;
}(Combination));
var ThreeXTwoNumbersCombination = (function (_super) {
    __extends(ThreeXTwoNumbersCombination, _super);
    function ThreeXTwoNumbersCombination(combinationName, combinationDesc, score) {
        return _super.call(this, combinationName, combinationDesc, score) || this;
    }
    ThreeXTwoNumbersCombination.prototype.check = function (numbers) {
        var hasSameNumbers = false;
        var values = this.findAndCountDublicates(numbers);
        if (values.length === 3) {
            for (var i = 0; i < values.length; i++) {
                if (values[i] !== 2) {
                    return hasSameNumbers;
                }
            }
            hasSameNumbers = true;
        }
        return hasSameNumbers;
    };
    ;
    return ThreeXTwoNumbersCombination;
}(Combination));
var TwoXThreeNumbersCombination = (function (_super) {
    __extends(TwoXThreeNumbersCombination, _super);
    function TwoXThreeNumbersCombination(combinationName, combinationDesc, score) {
        return _super.call(this, combinationName, combinationDesc, score) || this;
    }
    TwoXThreeNumbersCombination.prototype.check = function (numbers) {
        var hasSameNumbers = false;
        var values = this.findAndCountDublicates(numbers);
        if (values.length === 2) {
            hasSameNumbers = this.isInArray(3, values);
        }
        return hasSameNumbers;
    };
    ;
    return TwoXThreeNumbersCombination;
}(Combination));
var FourSameNumbersCombination = (function (_super) {
    __extends(FourSameNumbersCombination, _super);
    function FourSameNumbersCombination(combinationName, combinationDesc, score) {
        return _super.call(this, combinationName, combinationDesc, score) || this;
    }
    FourSameNumbersCombination.prototype.check = function (numbers) {
        var hasSameNumbers = false;
        var values = this.findAndCountDublicates(numbers);
        hasSameNumbers = this.isInArray(4, values);
        return hasSameNumbers;
    };
    ;
    return FourSameNumbersCombination;
}(Combination));
var FiveSameNumbersCombination = (function (_super) {
    __extends(FiveSameNumbersCombination, _super);
    function FiveSameNumbersCombination(combinationName, combinationDesc, score) {
        return _super.call(this, combinationName, combinationDesc, score) || this;
    }
    FiveSameNumbersCombination.prototype.check = function (numbers) {
        var hasSameNumbers = false;
        var values = this.findAndCountDublicates(numbers);
        hasSameNumbers = this.isInArray(5, values);
        return hasSameNumbers;
    };
    return FiveSameNumbersCombination;
}(Combination));
var SixSameNumbersCombination = (function (_super) {
    __extends(SixSameNumbersCombination, _super);
    function SixSameNumbersCombination(combinationName, combinationDesc, score) {
        return _super.call(this, combinationName, combinationDesc, score) || this;
    }
    SixSameNumbersCombination.prototype.getDescription = function () {
        return _super.prototype.getDescription.call(this);
    };
    SixSameNumbersCombination.prototype.check = function (numbers) {
        var isEqual = true;
        for (var i = 0; i < numbers.length - 1; i++) {
            if (numbers[i] != numbers[i + 1]) {
                isEqual = false;
            }
        }
        return isEqual;
    };
    ;
    return SixSameNumbersCombination;
}(Combination));
var NumberOneCombination = (function (_super) {
    __extends(NumberOneCombination, _super);
    function NumberOneCombination(combinationName, combinationDesc, score) {
        return _super.call(this, combinationName, combinationDesc, score) || this;
    }
    NumberOneCombination.prototype.getDescription = function () {
        return _super.prototype.getDescription.call(this);
    };
    NumberOneCombination.prototype.check = function (numbers) {
        return this.hasNumber(1, numbers.map(function (x) { return x.value; }));
    };
    ;
    return NumberOneCombination;
}(Combination));
var NumberTwoCombination = (function (_super) {
    __extends(NumberTwoCombination, _super);
    function NumberTwoCombination(combinationName, combinationDesc, score) {
        return _super.call(this, combinationName, combinationDesc, score) || this;
    }
    NumberTwoCombination.prototype.getDescription = function () {
        return _super.prototype.getDescription.call(this);
    };
    NumberTwoCombination.prototype.check = function (numbers) {
        return this.hasNumber(2, numbers.map(function (x) { return x.value; }));
    };
    ;
    return NumberTwoCombination;
}(Combination));
var NumberThreeCombination = (function (_super) {
    __extends(NumberThreeCombination, _super);
    function NumberThreeCombination(combinationName, combinationDesc, score) {
        return _super.call(this, combinationName, combinationDesc, score) || this;
    }
    NumberThreeCombination.prototype.getDescription = function () {
        return _super.prototype.getDescription.call(this);
    };
    NumberThreeCombination.prototype.check = function (numbers) {
        return this.hasNumber(3, numbers.map(function (x) { return x.value; }));
    };
    ;
    return NumberThreeCombination;
}(Combination));
var NumberFourCombination = (function (_super) {
    __extends(NumberFourCombination, _super);
    function NumberFourCombination(combinationName, combinationDesc, score) {
        return _super.call(this, combinationName, combinationDesc, score) || this;
    }
    NumberFourCombination.prototype.getDescription = function () {
        return _super.prototype.getDescription.call(this);
    };
    NumberFourCombination.prototype.check = function (numbers) {
        return this.hasNumber(4, numbers.map(function (x) { return x.value; }));
    };
    ;
    return NumberFourCombination;
}(Combination));
var NumberFiveCombination = (function (_super) {
    __extends(NumberFiveCombination, _super);
    function NumberFiveCombination(combinationName, combinationDesc, score) {
        return _super.call(this, combinationName, combinationDesc, score) || this;
    }
    NumberFiveCombination.prototype.getDescription = function () {
        return _super.prototype.getDescription.call(this);
    };
    NumberFiveCombination.prototype.check = function (numbers) {
        return this.hasNumber(5, numbers.map(function (x) { return x.value; }));
    };
    ;
    return NumberFiveCombination;
}(Combination));
var NumberSixCombination = (function (_super) {
    __extends(NumberSixCombination, _super);
    function NumberSixCombination(combinationName, combinationDesc, score) {
        return _super.call(this, combinationName, combinationDesc, score) || this;
    }
    NumberSixCombination.prototype.getDescription = function () {
        return _super.prototype.getDescription.call(this);
    };
    NumberSixCombination.prototype.check = function (numbers) {
        return this.hasNumber(6, numbers.map(function (x) { return x.value; }));
    };
    ;
    return NumberSixCombination;
}(Combination));
//# sourceMappingURL=app.js.map