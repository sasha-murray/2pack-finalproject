import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { nextQuestion, startGame as startGameAction, revealAnswer, sendQuestionsToServer, sendQuestionToPlayers } from '../../actions/actions'
import Question from './Question/Question'
import NavBar from '../../components/NavBar/NavBar'
import { Typography, Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { useStyles } from './Style'
import Scoreboard from '../../components/Scoreboard/Scoreboard'
const url = process.env.NODE_ENV === 'production' ? 'https://starry-expanse-259012.appspot.com' : 'http://localhost:8000'

const GameHost = () => {
  let history = useHistory()
  const [quiz, setQuiz] = useState({
    id: null,
    name: null,
    questions: [
      { 
        question: null,
        answers: [ { correct: null, option: null } ]
      }
    ]
  })
  
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [usersWhoHaveAnswered, setUsersWhoHaveAnswered] = useState(0)
  const { currentQuestion, room, users } = useSelector(state => state.game)

  const classes = useStyles()
  const query = new URLSearchParams(useLocation().search)
  const quizId = query.get('id')
  const dispatch = useDispatch()
  const [ gameStarted, setGameStarted ] = useState(false)

  useEffect(() => {

    const fetchQuiz = async () => {
      const res = await fetch(`${url}/quizzes/${quizId}`)
      const data = await res.json()
      setQuiz(data)
    }

    fetchQuiz()

  }, [dispatch, quizId])

  useEffect(() => {
    console.log(users)
    setUsersWhoHaveAnswered(users.reduce((total, adder) => {
      if(adder.answered) {
        return total + 1
      }
      return total
    }, 0))
    if (usersWhoHaveAnswered === users.length) {
      showAnswer()
    }
  }, [users])

  useEffect(() => {
    const correct = quiz.questions[currentQuestion].answers.find(answer => answer.correct === "true")
    if(correct) {
      console.log('correct option', correct.option)
      setCorrectAnswer(correct.option)
    }
  }, [currentQuestion, quiz])
  
  // const [ showCancel, setShowCancel ] = useState(false)
  // const [ countdown, setCountdown ] = useState(3)
  // const [ countdownStarted, setCountdownStarted ] = useState(false)

  // useEffect(() => {
  //   if(!countdown) {
  //     setGameStarted(true)
  //     setCountdownStarted(false)
  //   }
  //   let intervalId
  //   if(countdownStarted) {
  //     intervalId = setInterval(() => {
  //       setCountdown(countdown - 1)
  //     }, 1000)
  //   }
  //   return () => clearInterval(intervalId)
  // }, [countdown, countdownStarted, dispatch])

  const startGame = () => {
    setGameStarted(true)
    dispatch(sendQuestionToPlayers(quiz.questions[currentQuestion]))
    dispatch(startGameAction())
    // setShowCancel(true)
    // setCountdownStarted(true)
  }

  // const cancelGame = () => {
  //   setShowCancel(false)
  //   setGameStarted(false)
  //   setCountdownStarted(false)
  // }

  const nextQuestionButton = () => {
    dispatch(nextQuestion())
    dispatch(sendQuestionToPlayers(quiz.questions[currentQuestion+1]))
  }

  const showResultsButton = () => {
    dispatch(sendQuestionsToServer(quiz))
    history.push('/result')
  }

  const showAnswer = () => {
    dispatch(revealAnswer(correctAnswer))
  }

  return (
    <div className="App">
      <NavBar />

      { !gameStarted && (
        <div>
          <Typography className={classes.header} variant="h4">
            Waiting for players to join...
          </Typography>
          <Typography className={classes.header} variant="h4">
            Room code: {room}
          </Typography>
          <Button type="button" onClick={startGame} color="primary" variant="contained" className={classes.button}>
            Start Game
          </Button>
          
          <Typography className={classes.header} variant="h4">
          Connected Players
          </Typography>

          <Scoreboard {...{
            players: users
          }}/>

        </div>
      )}

      {/* { !gameStarted && showCancel && (
        <div>
          <Typography className={classes.header} variant="h4">
           {countdown}...
          </Typography>
          <Button type="button" onClick={cancelGame} color="primary" variant="contained" className={classes.button}>
            Cancel
          </Button>
        </div>
      )} */}

      { gameStarted && (
          <div>
            <Question question={quiz.questions[currentQuestion]}/>
            <Typography variant="h4">{usersWhoHaveAnswered} / {users.length} have answered</Typography>
            {currentQuestion === quiz.questions.length - 1 && (
              <Button onClick={showResultsButton} className={classes.nextQuestion} size="large" color="primary" variant="contained"> 
              Show Results
              </Button>
             )}
            {currentQuestion !== quiz.questions.length - 1 && (
              <Button onClick={nextQuestionButton} className={classes.nextQuestion} size="large" color="primary" variant="contained">
                Next Question
              </Button>
            )}
            <Button onClick={showAnswer} className={classes.nextQuestion} size="large" color="primary" variant="contained">
              Show Answer
            </Button>
          </div>
      )}
    </div>
  );
}
 
export default GameHost;