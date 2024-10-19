'use client'
import { useEffect, useState } from "react";

export default function Home() {
    const [currUser, setCurrUser] = useState(1)
    const [board, setBoard] = useState(Array.from({ length: 7 }, () => Array(6).fill(null)))
    const [gameStatus, setGameStatus] = useState('ongoing')

    const userNames = ['Red', 'Yellow']
    const dropButtonArray = [1,2,3,4,5,6,7]

    const handleDropClick = (index) => {
        if (gameStatus !== 'ongoing') return;

        const currCol = [...board[index]]
        
        for(let i = 0; i < currCol.length; i++){
            if (currCol[i] === null){
                currCol[i] = currUser
                setBoard(prev => {
                    const temp = [...prev]
                    temp[index] = currCol
                    return temp
                })
                setCurrUser(prev => prev === 1 ? 2 : 1)
                break;
            }
        }
    }

    const GetBlockType = ({val}) => {
        if (val === 1){
            return <div className="w-12 h-12 rounded-full bg-red-600" aria-label="Red piece"></div>
        }
        if(val === 2){
            return <div className="w-12 h-12 rounded-full bg-yellow-400" aria-label="Yellow piece"></div>
        }
        return <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-gray-300" aria-label="Empty slot"></div>
    }

    const checkGameStatus = (board) => {
        const rows = 6;
        const cols = 7;
    
        // Check horizontal
        for (let col = 0; col < cols - 3; col++) {
            for (let row = 0; row < rows; row++) {
                if (board[col][row] &&
                    board[col][row] === board[col+1][row] &&
                    board[col][row] === board[col+2][row] &&
                    board[col][row] === board[col+3][row]) {
                    return board[col][row];
                }
            }
        }
    
        // Check vertical
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows - 3; row++) {
                if (board[col][row] &&
                    board[col][row] === board[col][row+1] &&
                    board[col][row] === board[col][row+2] &&
                    board[col][row] === board[col][row+3]) {
                    return board[col][row];
                }
            }
        }
    
        // Check diagonal (top-left to bottom-right)
        for (let col = 0; col < cols - 3; col++) {
            for (let row = 0; row < rows - 3; row++) {
                if (board[col][row] &&
                    board[col][row] === board[col+1][row+1] &&
                    board[col][row] === board[col+2][row+2] &&
                    board[col][row] === board[col+3][row+3]) {
                    return board[col][row];
                }
            }
        }
    
        // Check diagonal (top-right to bottom-left)
        for (let col = 3; col < cols; col++) {
            for (let row = 0; row < rows - 3; row++) {
                if (board[col][row] &&
                    board[col][row] === board[col-1][row+1] &&
                    board[col][row] === board[col-2][row+2] &&
                    board[col][row] === board[col-3][row+3]) {
                    return board[col][row];
                }
            }
        }
    
        // Check for draw
        if (board.every(column => column.every(cell => cell !== null))) {
            return 'draw';
        }
    
        // Game is still ongoing
        return null;
    };

    const resetGame = () => {
        setBoard(Array.from({ length: 7 }, () => Array(6).fill(null)))
        setCurrUser(1)
        setGameStatus('ongoing')
    }

    useEffect(() => {
        const status = checkGameStatus(board);
        if (status) {
            setGameStatus(status === 'draw' ? 'draw' : 'won')
        }
    }, [board]);

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold text-center mb-6">Connect Four</h1>
                <div className="text-xl font-semibold text-center mb-4">
                    {gameStatus === 'ongoing' ? `${userNames[currUser - 1]}'s turn` :
                     gameStatus === 'draw' ? "Draw!" :
                     `${userNames[currUser === 1 ? 1 : 0]} won!`}
                </div>
                <div className="flex justify-center mb-4">
                    {gameStatus === 'ongoing' ? 
                        dropButtonArray.map((item, index) => (
                            <div key={item} className="w-14 px-1">
                                <button 
                                    className="w-full px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 flex items-center justify-center"
                                    onClick={() => handleDropClick(index)}
                                    disabled={board[index][5] !== null}
                                >
                                    Drop
                                </button>
                            </div>
                        ))
                        :
                        <button 
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                            onClick={resetGame}
                        >
                            Play again
                        </button>
                    }
                </div>
                <div className="flex justify-center bg-gray-300 p-4 rounded-lg">
                    {board.map((column, colIndex) => (
                        <div key={colIndex} className="flex flex-col-reverse">
                            {column.map((block, blockIndex) => (
                                <div key={blockIndex} className="p-1">
                                    <GetBlockType val={block} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}