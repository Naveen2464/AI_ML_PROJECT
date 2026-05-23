const readline = require('readline');

function getHeuristic(board) {
    let attacks = 0;
    const n = board.length;

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (board[i] === board[j] || Math.abs(board[i] - board[j]) === Math.abs(i - j)) {
                attacks += 1;
            }
        }
    }

    return attacks;
}

function generateRandomBoard(n) {
    const board = [];
    for (let i = 0; i < n; i++) {
        board.push(Math.floor(Math.random() * n));
    }
    return board;
}

function getBestNeighbor(board) {
    const n = board.length;
    let bestBoard = [...board];
    let minAttacks = getHeuristic(board);

    for (let col = 0; col < n; col++) {
        for (let row = 0; row < n; row++) {
            if (board[col] !== row) {
                const neighbor = [...board];
                neighbor[col] = row;
                const attacks = getHeuristic(neighbor);

                if (attacks < minAttacks) {
                    minAttacks = attacks;
                    bestBoard = neighbor;
                }
            }
        }
    }

    return { board: bestBoard, attacks: minAttacks };
}

function hillClimbingNQueens(n) {
    let restarts = 0;

    while (true) {
        let board = generateRandomBoard(n);
        let currentAttacks = getHeuristic(board);

        while (currentAttacks > 0) {
            const { board: neighbor, attacks: neighborAttacks } = getBestNeighbor(board);
            if (neighborAttacks >= currentAttacks) {
                break;
            }
            board = neighbor;
            currentAttacks = neighborAttacks;
        }

        if (currentAttacks === 0) {
            return { board, restarts };
        }

        restarts += 1;
    }
}

function printBoard(board) {
    const n = board.length;
    for (let row = 0; row < n; row++) {
        let rowStr = '';
        for (let col = 0; col < n; col++) {
            rowStr += board[col] === row ? 'Q ' : '. ';
        }
        console.log(rowStr.trim());
    }
}

function askForNumber(promptText) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(promptText, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function main() {
    console.log('=== N-Queen Problem Solver (Hill Climbing) ===');

    while (true) {
        const input = await askForNumber('Enter the number of queens (N): ');
        const n = Number(input);

        if (!Number.isInteger(n)) {
            console.log('Invalid input. Please enter an integer.');
            continue;
        }

        if (n <= 0) {
            console.log('Please enter a positive integer.');
            continue;
        }

        if (n === 2 || n === 3) {
            console.log(`No solution exists for N=${n}. Please try N >= 4.`);
            continue;
        }

        console.log(`\nSolving ${n}-Queens problem using Random-Restart Hill Climbing...\n`);
        const result = hillClimbingNQueens(n);

        console.log(`Solution found with ${result.restarts} restarts!`);
        console.log('Board Configuration (Index = Column, Value = Row):');
        console.log(result.board);
        console.log('\nVisual Board:');
        printBoard(result.board);
        break;
    }
}

main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
});
