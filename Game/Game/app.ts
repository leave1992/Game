class Roll {
    constructor(
        public value: number,
        public keep: boolean) {
    }
}

class Player {
    private readonly rolls: Roll[];
    private readonly name: string;
    private combination: Combination;

    constructor(name: string) {
        this.name = name;
        this.rolls = [
            new Roll(0, false),
            new Roll(0, false),
            new Roll(0, false),
            new Roll(0, false),
            new Roll(0, false),
            new Roll(0, false)
        ]
    }

    setCombination(combination: Combination): void {
        this.combination = combination;
    }

    getCombination(): Combination {
        return this.combination;
    }

    getName(): string {
        return this.name;
    }

    rollDice(): void {
        for (let i = 0; i < 6; ++i) {
            if (this.rolls[i].keep == false) {
                this.rolls[i].value = getRandomInt(1, 6);
            }
        }
    }

    keepRoll(index: number, keep: boolean): void {
        this.rolls[index].keep = keep;
    }

    getRoll(index: number): Roll {
        if (index < this.rolls.length) {
            return this.rolls[index];
        }
        return new Roll(0, false);
    }

    getRolls(): Roll[] {
        return this.rolls;
    }
}

class DiceRollGame {
    private currentTurn: number = 0;
    private maxTurns: number = 0;
    private player1: Player;
    private player2: Player;

    constructor(player1: string, player2: string, maxTurns: number = 3) {
        this.player1 = new Player(player1);
        this.player2 = new Player(player2);
        this.maxTurns = maxTurns;
    }

    get Player1(): Player { return this.player1; }
    get Player2(): Player { return this.player2; }

    nextMove(): void {
        if (this.canMove()) {
            this.player1.rollDice();
            this.player2.rollDice();
            this.currentTurn = this.currentTurn + 1;
        }
    }

    canMove(): boolean {
        return this.currentTurn < this.maxTurns;
    }

    checkWinner(): Player {
        let player1Score: number = 0;
        let player2Score: number = 0;

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
    }
};

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadState(): void {
    let player1Name = localStorage.getItem("player1");
    let player2Name = localStorage.getItem("player2");

    $(player1Id).val(player1Name);
    $(player2Id).val(player2Name);
}

function saveState(): void {
    let player1Name = $(player1Id).val();
    let player2Name = $(player2Id).val();

    localStorage.setItem("player1", player1Name);
    localStorage.setItem("player2", player2Name);
}

function intializeGame(): void {
    let player1Name = localStorage.getItem("player1");
    let player2Name = localStorage.getItem("player2");
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

function isRadioChecked(firstPlayerName: string, secondPlayerName: string): boolean {
    let notChecked = false;
    let firstPlayerString = "input[name=" + firstPlayerName + "]:checked";
    let secondPlayerString = "input[name=" + secondPlayerName + "]:checked";
    if ($(firstPlayerString).length <= 0) {
        notChecked = true;
    }
    if ($(secondPlayerString).length <= 0) {
        notChecked = true;
    }

    return notChecked;
}

function disableAllRadioButtons(): void {
    $(":radio").click(function () {
        var radioName = $(this).attr("name");
        $(":radio[name='" + radioName + "']:not(:checked)").attr("disabled", "disabled");
    });
}

function nextMove(): void {
    let firstPlayerName = game.Player1.getName();
    let secondPlayerName = game.Player2.getName();
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

function reInitializeGame(): void {
    removeTable(diceRollsTableId);
    removeTable(combinationsTableId);
    intializeGame();
};

function toggleButton(btnId: string): void {
    let nextButton = <HTMLButtonElement>document.getElementById(btnId);
    nextButton.disabled = !nextButton.disabled;
}

function startGame(): void {
    saveState();
    intializeGame();
    createCombinationsTable(combinations);
    disableAllRadioButtons();
    toggleButton("startGame");
}

function removeTable(id: string): void {
    let previousTable = document.getElementById(id);
    if (previousTable) {
        let tableParent = previousTable.parentNode;
        tableParent.removeChild(previousTable);
    }
}

function createSpanCell(row: HTMLTableRowElement, title: string): void {
    let cell = row.insertCell();

    let span = <HTMLSpanElement>document.createElement("span");
    span.innerText = title;

    cell.appendChild(span);
    row.appendChild(cell);
}

function createRollKeepCell(row: HTMLTableRowElement, roll: Roll): void {
    let cell = row.insertCell();

    let checkbox = <HTMLInputElement>document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = roll.keep;
    // set event listener to monitor checked state
    checkbox.addEventListener("click", function () {
        // javascript scope will capture roll object
        roll.keep = !roll.keep;
    });
    cell.appendChild(checkbox);

    let span = <HTMLSpanElement>document.createElement("span");
    span.innerText = roll.value.toString();
    cell.appendChild(span);

    row.appendChild(cell);
}

function insertResultTitles(table: HTMLTableElement): void {
    let row = table.insertRow(0);
    row.insertCell();

    for (let i = 1; i < 7; ++i) {
        createSpanCell(row, "#" + i.toString());
    }
}

function insertResultRow(table: HTMLTableElement, player: Player): void {
    let row = table.insertRow();
    let playerNameCell = row.insertCell();
    playerNameCell.innerText = player.getName();

    // create cells with results for two players
    for (let roll of player.getRolls()) {
        createRollKeepCell(row, roll);
    }

    table.appendChild(row);
}

function createDiceRollsTable(): void {
    removeTable(diceRollsTableId);

    let body = document.getElementsByTagName("body")[0];
    let table = <HTMLTableElement>document.createElement("table");
    table.setAttribute("id", diceRollsTableId);

    // create titles for players
    insertResultTitles(table);

    // create cell for player results
    insertResultRow(table, game.Player1);
    insertResultRow(table, game.Player2);

    // add created table to DOM
    body.appendChild(table);
}

function createCombinationPickCell(row: HTMLTableRowElement, player: Player, combination: Combination, name: string): void {
    let cell = row.insertCell();

    let radio = <HTMLInputElement>document.createElement("input");
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

function insertCombinationTitles(table: HTMLTableElement, combinations: Combination[]): void {
    let row = table.insertRow(0);
    row.insertCell();

    for (let combination of combinations) {
        createSpanCell(row, combination.getName());
    }
}

function insertCombinationsRow(table: HTMLTableElement, player: Player): void {
    let row = table.insertRow();
    let playerNameCell = row.insertCell();
    playerNameCell.innerText = player.getName();

    // create cells with results for two players
    for (let combination of combinations) {
        createCombinationPickCell(row, player, combination, player.getName());
    }

    table.appendChild(row);
}

function createCombinationsTable(combinations: Combination[]): void {
    removeTable(combinationsTableId);

    let body = document.getElementsByTagName("body")[0];
    let table = <HTMLTableElement>document.createElement("table");
    table.setAttribute("id", combinationsTableId);

    // create titles for combinations
    insertCombinationTitles(table, combinations);

    // create cell for player combinations
    insertCombinationsRow(table, game.Player1);
    insertCombinationsRow(table, game.Player2);

    // add created table to DOM
    body.appendChild(table);
}

let game: DiceRollGame;
let combinations: Combination[];
const player1Id = "#player1";
const player2Id = "#player2";
const diceRollsTableId = "dice-rolls-table";
const combinationsTableId = "combinations-table";

$(document).ready(function () {
    loadState();
});

interface IDictionaryCollection<T> {
    Add(key: string, value: T);
    ContainsKey(key: string): boolean;
    Count(): number;
    Item(key: string): T;
    Keys(): string[];
    Remove(key: string): T;
    Values(): T[];
}

class Dictionary<T> implements IDictionaryCollection<T> {
    private items: { [index: string]: T } = {};

    private count: number = 0;

    public ContainsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    public Count(): number {
        return this.count;
    }

    public Add(key: string, value: T) {
        this.items[key] = value;
        this.count++;
    }

    public Remove(key: string): T {
        var val = this.items[key];
        delete this.items[key];
        this.count--;
        return val;
    }

    public Item(key: string): T {
        return this.items[key];
    }

    public Keys(): string[] {
        var keySet: string[] = [];

        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }

        return keySet;
    }

    public Values(): T[] {
        var values: T[] = [];

        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }

        return values;
    }
}

abstract class Combination {
    protected name: string;
    protected description: string;
    protected score: number;

    constructor(combinationName: string, combinationDesc: string, score: number = 0) {
        this.name = combinationName;
        this.description = combinationDesc;
        this.score = score;
    }

    getDescription(): string {
        return this.description;
    }

    getName(): string {
        return this.name;
    }

    getScore(): number {
        return this.score;
    }

    abstract check(numbers: Roll[]);

    protected isInArray(value: number, array: number[]): boolean {
        for (let i = 0; i < array.length; ++i) {
            if (array[i] == value) {
                return true;
            }
        }
        return false;
    }

    protected findAndCountDublicates(numbers: Roll[]): number[] {
        let counts = {};

        numbers.forEach(function (element) {
            counts[element.value] = (counts[element.value] || 0) + 1;
        });

        let dictionary = new Dictionary<number>();

        for (var element in counts) {
            dictionary.Add(element, counts[element]);
        }

        let values: number[] = dictionary.Values();

        return values;
    }

    protected hasNumber(searchedNumber: number, numbers: number[]): boolean {
        let hasNumber = false;

        hasNumber = this.isInArray(searchedNumber, numbers);

        return hasNumber;
    }
}

class SixDifferentNumbersCombination extends Combination {
    constructor(combinationName, combinationDesc, score) {
        super(combinationName, combinationDesc, score);
    }

    check(numbers: Roll[]): boolean {
        let isUnique = true

        for (var i = 0; i < numbers.length; i++) {
            for (var j = 0; j < numbers.length; j++) {
                if (i != j) {
                    if (numbers[i].value == numbers[j].value) {
                        isUnique = false
                    }
                }
            }
        }
        return isUnique;
    };
}

class ThreeXTwoNumbersCombination extends Combination {
    constructor(combinationName, combinationDesc, score) {
        super(combinationName, combinationDesc, score);
    }

    check(numbers: Roll[]) {
        let hasSameNumbers = false;
        let values = this.findAndCountDublicates(numbers);

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
}

class TwoXThreeNumbersCombination extends Combination {
    constructor(combinationName, combinationDesc, score) {
        super(combinationName, combinationDesc, score);
    }

    check(numbers: Roll[]) {
        let hasSameNumbers = false;
        let values = this.findAndCountDublicates(numbers);

        if (values.length === 2) {
            hasSameNumbers = this.isInArray(3, values);
        }

        return hasSameNumbers;
    };
}

class FourSameNumbersCombination extends Combination {
    constructor(combinationName, combinationDesc, score) {
        super(combinationName, combinationDesc, score);
    }

    check(numbers: Roll[]): boolean {
        let hasSameNumbers = false;
        let values = this.findAndCountDublicates(numbers);
        hasSameNumbers = this.isInArray(4, values);

        return hasSameNumbers;
    };
}

class FiveSameNumbersCombination extends Combination {
    constructor(combinationName, combinationDesc, score) {
        super(combinationName, combinationDesc, score);
    }

    check(numbers: Roll[]): boolean {
        let hasSameNumbers = false;
        let values = this.findAndCountDublicates(numbers);
        hasSameNumbers = this.isInArray(5, values);

        return hasSameNumbers;
    }
}

class SixSameNumbersCombination extends Combination {
    constructor(combinationName, combinationDesc, score) {
        super(combinationName, combinationDesc, score);
    }

    getDescription(): string {
        return super.getDescription();
    }

    check(numbers: Roll[]): boolean {
        let isEqual = true;
        for (var i = 0; i < numbers.length - 1; i++) {
            if (numbers[i] != numbers[i + 1]) {
                isEqual = false;
            }
        }
        return isEqual;
    };
}

class NumberOneCombination extends Combination {
    constructor(combinationName, combinationDesc, score) {
        super(combinationName, combinationDesc, score);
    }

    getDescription(): string {
        return super.getDescription();
    }

    check(numbers: Roll[]): boolean {
        return this.hasNumber(1, numbers.map(x => { return x.value; }));
    };
}

class NumberTwoCombination extends Combination {
    constructor(combinationName, combinationDesc, score) {
        super(combinationName, combinationDesc, score);
    }

    getDescription(): string {
        return super.getDescription();
    }

    check(numbers: Roll[]): boolean {
        return this.hasNumber(2, numbers.map(x => { return x.value; }));
    };
}

class NumberThreeCombination extends Combination {
    constructor(combinationName, combinationDesc, score) {
        super(combinationName, combinationDesc, score);
    }

    getDescription(): string {
        return super.getDescription();
    }

    check(numbers: Roll[]): boolean {
        return this.hasNumber(3, numbers.map(x => { return x.value; }));
    };
}

class NumberFourCombination extends Combination {
    constructor(combinationName, combinationDesc, score) {
        super(combinationName, combinationDesc, score);
    }

    getDescription(): string {
        return super.getDescription();
    }

    check(numbers: Roll[]): boolean {
        return this.hasNumber(4, numbers.map(x => { return x.value; }));
    };
}

class NumberFiveCombination extends Combination {
    constructor(combinationName, combinationDesc, score) {
        super(combinationName, combinationDesc, score);
    }

    getDescription(): string {
        return super.getDescription();
    }

    check(numbers: Roll[]): boolean {
        return this.hasNumber(5, numbers.map(x => { return x.value; }));
    };
}

class NumberSixCombination extends Combination {
    constructor(combinationName, combinationDesc, score) {
        super(combinationName, combinationDesc, score);
    }

    getDescription(): string {
        return super.getDescription();
    }

    check(numbers: Roll[]): boolean {
        return this.hasNumber(6, numbers.map(x => { return x.value; }));
    };
}
