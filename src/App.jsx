import {useState} from "react"
import { languages } from "./assets/JS/languages"
import { clsx } from "clsx"
import { getFarewellText, getRandomWord } from "./assets/JS/utils"
import Confetti from "react-confetti"



export default function App(){
    //State Values
    const [currentWord, setCurrentWord] = useState(() => getRandomWord())
    const [guessedLetter, setGuessedLetter] = useState([])
    console.log(getFarewellText)

    //Derived values
    const numOfGuesses = languages.length - 1
    const wrongGuesseCount = guessedLetter.filter(letter => !currentWord.includes(letter)).length
    const isGameWon = currentWord.split("").every(letter => guessedLetter.includes(letter))
    const isGameLost = wrongGuesseCount >= numOfGuesses
    const isGameOver = isGameWon || isGameLost
    const lastGuessedLetter = guessedLetter[guessedLetter.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

    
    //Static values
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    
    function startNewGame(){
        setCurrentWord(() => getRandomWord())
        setGuessedLetter([])
    }
    
    function addGuessedLetters(letter){
        setGuessedLetter(prevLetter => 
            prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter]
        )
    }
    
    const letterElement = currentWord.split("").map((letter, index) => {
        const shoudlRevealWord = isGameOver || guessedLetter.includes(letter)
        const letterElement = clsx(
            isGameLost && !guessedLetter.includes(letter) && "missed-letter"
        )
        return(
            <span key={index} className={letterElement}>{shoudlRevealWord ? letter.toUpperCase() : ""}</span>
        )
    })

    const languageElements = languages.map((lang, index) => {
        const isLanguageLost = index < wrongGuesseCount
        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }
        const chip = clsx("chip", isLanguageLost && "lost")

        return(
            <span key={lang.name} style={styles} className={chip}>{lang.name}</span>
        )
    })

    const keyboardElements = alphabet.split("").map(letter => {
        const isGuessed = guessedLetter.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)

        const keyboardElements = clsx({
            correct: isCorrect,
            wrong: isWrong 
        })
        return(
            <button key={letter} className={keyboardElements} disabled={isGameOver} onClick={() => addGuessedLetters(letter)}> 
                {letter.toUpperCase()}
            </button>
        )
    })

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

    function renderGameStatus(){
        if (!isGameOver && isLastGuessIncorrect){
            return(
                <p className="farewell-message">
                    {getFarewellText(languages[wrongGuesseCount - 1].name)}
                </p>
            )
        }

        if (isGameWon){
            return(
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                    <Confetti />
                </>
            )
        }

        if (isGameLost){
            return(
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        }

        return null
    }

    return(
        <main>
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
            </header>

            <section className={gameStatusClass}>
                {renderGameStatus()}
            </section>

            <section className="language-chips">
                {languageElements}
            </section>

            <section className="word">
                {letterElement}
            </section>
            
            <section className="keyboard">
                {keyboardElements}
            </section>

            {isGameOver && 
                <button className="new-game" onClick={startNewGame}>New Game</button>
            }
        </main>
    )
}