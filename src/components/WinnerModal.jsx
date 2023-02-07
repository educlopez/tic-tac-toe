import { Button } from './Button.jsx'
import { Square } from './Square.jsx'

export function WinnerModal({ winner, resetGame }) {
  if (winner === null) return null
  const winnerText = winner === false ? 'Tie' : 'Winner!'
  return (
    <>
      <div className="relative z-10">
        <div className="fixed inset-0 transition-opacity bg-black/50 dark:bg-black/70 backdrop-blur-sm dark:backdrop-blur" />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <div className="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:w-full dark:border dark:border-zinc-900 dark:bg-black sm:my-8 sm:max-w-sm sm:p-6">
              <div>
                <div className="text-center">
                  <p className="mb-3 text-lg font-medium text-zinc-500 dark:text-white">
                    {winnerText}
                  </p>
                  <div className="flex justify-center">
                    {winner && <Square>{winner}</Square>}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <Button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium shadow-sm sm:text-sm"
                  onClick={resetGame}
                >
                  Reset Game
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
