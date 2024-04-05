"use client"

import { useCallback, useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import confetti from "canvas-confetti"

import { Retrobutton } from "@/components/RetroBtn"
import { Text } from "@/components/Text"

export default function Whoisthatpokemon() {
  const [pokemon, setPokemon] = useState({})
  const [pokemonList, setPokemonList] = useState([])
  const [userGuess, setUserGuess] = useState("")
  const [guessMessage, setGuessMessage] = useState("")
  const [correctGuesses, setCorrectGuesses] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPokemon = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`, {
        next: { revalidate: 10 },
      })
      const data = await res.json()
      const pokemonData = data.results
        .filter((p) => !pokemonList.includes(p.name.toLowerCase()))
        .map((p) => p.url)

      if (!pokemonData.length) {
        setGuessMessage("All Pokémons have been guessed, congratulations!")
        return
      }

      const randomPokemon =
        pokemonData[Math.floor(Math.random() * pokemonData.length)]
      const pokemonRes = await fetch(randomPokemon)
      const pokemonInfo = await pokemonRes.json()
      setPokemon(pokemonInfo)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [pokemonList])

  useEffect(() => {
    fetchPokemon()
  }, [fetchPokemon])

  const handleGuess = (e) => {
    setUserGuess(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (userGuess.toLowerCase() === pokemon.name.toLowerCase()) {
      setGuessMessage("Correct! You won!")
      confetti({
        particleCount: 200,
        spread: 80,
        colors: ["#8D9571", "#1F1F1F", "#4E533E"],
      })
      setPokemonList([...pokemonList, pokemon.name])

      // Increase the correct guess counter
      setCorrectGuesses(correctGuesses + 1)

      if (correctGuesses + 1 === 10) {
        setGuessMessage("You have guessed 10 correct Pokémon. Congratulations!")
      }
    } else {
      setGuessMessage("Incorrect. Try again.")
    }
    setUserGuess("")
  }
  const resetGame = () => {
    setPokemonList([])
    setGuessMessage("")
    setUserGuess("")
    setCorrectGuesses(0)
  }

  return (
    <>
      <Head>
        <title>Who is that Pokemon</title>
        <meta name="description" content="" />
        <meta
          name="keywords"
          content="Who's that pokemon, online game, tailwind css, next.js, web game"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Text
        title="Who is that pokemon"
        as="h2"
        size="h2"
        className="fade-down-ct"
      />

      <section className="my-10 flex flex-col justify-center">
        {pokemon.name ? (
          <div className="flex flex-col items-center justify-center">
            <Image
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/${pokemon.id}.png`}
              alt="pokemon sprite"
              width={96}
              height={96}
              unoptimized
            />
            <p className="my-4 text-center text-xs text-gameboy-900">
              Remember, if a pokemon have spaces in her name use `-`
            </p>
            <p className="mb-4 text-center text-gameboy-900">
              Correct Guesses: {correctGuesses} / 10
            </p>
            <div>
              {guessMessage ===
              "All pokemons have been guessed, congratulations!" ? (
                <div>
                  <p className="text-gameboy-900">{guessMessage}</p>
                  <div className="mt-6 flex justify-center">
                    <Retrobutton onClick={resetGame}>Reset Game</Retrobutton>
                  </div>
                </div>
              ) : correctGuesses === 10 ? (
                <div>
                  <p className="text-gameboy-900">{guessMessage}</p>
                  <div className="mt-6 flex justify-center">
                    <Retrobutton onClick={resetGame}>Reset Game</Retrobutton>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Enter Pokemon name"
                    value={userGuess}
                    onChange={handleGuess}
                    className=" flex h-8 w-full items-center gap-2 rounded-sm bg-gameboy-100 p-3 text-center text-sm text-gameboy-900 ring-1 ring-gameboy-700 transition placeholder:text-gameboy-700 hover:ring-gameboy-900 focus:[&:not(:focus-visible)]:outline-none"
                  />
                </form>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gameboy-900">Loading...</p>
        )}
        <div className="mt-10 grid grid-flow-row grid-cols-5">
          {pokemonList.map((pokemon) => {
            return (
              <div
                className="relative flex w-auto grow flex-row items-center justify-center bg-gameboy-100/50 py-2 pl-2 pr-5 text-sm text-gameboy-900 ring-1 ring-gameboy-400 transition hover:z-10  hover:ring-gameboy-700 focus:[&:not(:focus-visible)]:outline-none"
                key={pokemon}
              >
                <Image
                  src={`https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/${pokemon}.png`}
                  alt={pokemon}
                  width={48}
                  height={36}
                  className="relative bottom-2.5 left-0"
                />
                <p className="text-center text-xs capitalize">{pokemon}</p>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
