class Grammar {
    constructor(rules) {
        this.rules = rules;
        this.terminals = new Set();
        this.nonTerminals = new Set();
        this.startSymbol = rules[0][0];
        this.init();
    }

    init() {
        this.rules.forEach(rule => {
            const [lhs, rhs] = rule;
            this.nonTerminals.add(lhs);
            rhs.split(' ').forEach(symbol => {
                if (!/[A-Z]/.test(symbol)) {
                    this.terminals.add(symbol);
                } else {
                    this.nonTerminals.add(symbol);
                }
            });
        });
    }

    getRules() {
        return this.rules;
    }

    getStartSymbol() {
        return this.startSymbol;
    }
}

// Example grammar
const grammarRules = [
    ['S', 'E'],
    ['E', 'E + T'],
    ['E', 'T'],
    ['T', 'T * F'],
    ['T', 'F'],
    ['F', '( E )'],
    ['F', 'id']
];

const grammar = new Grammar(grammarRules);
class Item {
    constructor(lhs, rhs, dotPosition, lookahead) {
        this.lhs = lhs;
        this.rhs = rhs;
        this.dotPosition = dotPosition;
        this.lookahead = lookahead;
    }

    toString() {
        const rhsWithDot = this.rhs.slice(0, this.dotPosition) + '•' + this.rhs.slice(this.dotPosition);
        return `${this.lhs} -> ${rhsWithDot}`;
    }

    isComplete() {
        return this.dotPosition === this.rhs.length;
    }

    nextSymbol() {
        return this.rhs[this.dotPosition];
    }

    advance() {
        return new Item(this.lhs, this.rhs, this.dotPosition + 1, this.lookahead);
    }
}

class State {
    constructor(items) {
        this.items = items;
    }

    toString() {
        return this.items.map(item => item.toString()).join('\n');
    }
}

// Generate the states (initial example)
const startItem = new Item('S\'', '•S', 0, '$');
const initialState = new State([startItem]);

console.log(initialState.toString());
class Parser {
    constructor(grammar) {
        this.grammar = grammar;
        this.states = [];
        this.actionTable = {};
        this.gotoTable = {};
        this.build();
    }

    build() {
        // Build the LR(0) automaton and fill the action and goto tables
    }

    parse(input) {
        const stack = [0];
        const inputSymbols = input.split(' ');

        while (true) {
            const state = stack[stack.length - 1];
            const symbol = inputSymbols[0];

            if (this.actionTable[state][symbol]) {
                const action = this.actionTable[state][symbol];

                if (action.type === 'shift') {
                    stack.push(action.toState);
                    inputSymbols.shift();
                } else if (action.type === 'reduce') {
                    for (let i = 0; i < action.production.rhs.length; i++) {
                        stack.pop();
                    }
                    stack.push(this.gotoTable[stack[stack.length - 1]][action.production.lhs]);
                } else if (action.type === 'accept') {
                    return 'Accepted';
                }
            } else {
                return 'Error';
            }
        }
    }
}

// Example parser usage
const parser = new Parser(grammar);
const result = parser.parse('id + id * id');
console.log(result);
