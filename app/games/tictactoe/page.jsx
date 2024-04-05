"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import { checkEndGame, checkWinnerFrom } from "@/logic/board.js"
import confetti from "canvas-confetti"

import { TURNS } from "@/lib/constants.js"
import DialogBox from "@/components/DialogBox"
import { Retrobutton } from "@/components/RetroBtn"
import { Square } from "@/components/Square.jsx"
import { Text } from "@/components/Text"
import { WinnerModal } from "@/components/WinnerModal.jsx"

function Tictactoe() {
  const initialBoard = Array(9).fill(null)
  const [board, setBoard] = useState(Array(9).fill(null))
  const [turn, setTurn] = useState(TURNS.X)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const boardFromStorage = window.localStorage.getItem("board")
      if (boardFromStorage) setBoard(JSON.parse(boardFromStorage))

      const turnFromStorage = window.localStorage.getItem("turn")
      if (turnFromStorage) setTurn(turnFromStorage)
    }
  }, [])

  // null es que no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("ticTacToeGameState")
    }
  }

  const updateBoard = (index) => {
    // no actualizamos esta posición
    // si ya tiene algo
    if (board[index] || winner) return
    // actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // guardar aqui partida
    saveGameToStorage({
      board: newBoard,
      turn: newTurn,
    })
    // revisar si hay ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti({ colors: ["#8D9571", "#1F1F1F", "#4E533E"] })
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // empate
    }
  }

  function saveGameToStorage(gameState) {
    // Convertir el estado del juego a un string
    const gameStateString = JSON.stringify(gameState)

    // Guardar el estado del juego en localStorage
    localStorage.setItem("ticTacToeGameState", gameStateString)
  }

  function loadGameFromStorage() {
    // Obtener el estado del juego desde localStorage
    const gameStateString = localStorage.getItem("ticTacToeGameState")

    // Convertir el string de vuelta a un objeto
    const gameState = JSON.parse(gameStateString)

    return gameState
  }
  function clearSavedGameState() {
    localStorage.removeItem("ticTacToeGameState")
  }
  useEffect(() => {
    const savedGameState = loadGameFromStorage()

    if (savedGameState) {
      setBoard(savedGameState.board)
      setTurn(savedGameState.turn)
    } else {
      setBoard(initialBoard)
      setTurn(TURNS.X)
    }
  }, [])
  return (
    <>
      <Head>
        <title>TicTacToe</title>
        <meta
          name="description"
          content="Play the classic game of Tic Tac Toe online with a modern twist! Our web game is built using Tailwind CSS and Next.js, providing a sleek and responsive design for hours of fun."
        />
        <meta
          name="keywords"
          content="tic tac toe, online game, tailwind css, next.js, web game"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Text title="TicTacToe" as="h2" size="h2" className="fade-down-ct" />
      <section className="my-10 flex justify-center gap-1">
        <Square isSelected={turn === TURNS.X} onClick="-" isInteractive={false}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O} isInteractive={false}>
          {TURNS.O}
        </Square>
      </section>
      <DialogBox className="mx-auto grid max-w-fit grid-cols-3 gap-1">
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          )
        })}
      </DialogBox>
      <div className="mt-10 flex w-full flex-1 flex-col items-center justify-center px-4 text-center">
        <Retrobutton onClick={resetGame}>Reset Game</Retrobutton>
      </div>
      <WinnerModal resetGame={resetGame} winner={winner} />
    </>
  )
}

export default Tictactoe
