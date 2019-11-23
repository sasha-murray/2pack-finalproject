import io from 'socket.io-client'
import {
  setUsers, closeRoom, setQuestion, gameStarted, showAnswerToPlayer, setAllQuestionsToPlayers,
  CREATE_GAME, START_GAME, JOIN_GAME, SEND_QUESTION_TO_PLAYERS, SEND_QUESTIONS_TO_SERVER, CORRECT_ANSWER, INCORRECT_ANSWER, REVEAL_ANSWER
} from '../actions/actions'
const url = process.env.NODE_ENV === 'production' ? 'https://starry-expanse-259012.appspot.com' : 'http://localhost:8000'

const socketMiddleware = state => {
  let socket = null
  if (!socket) {
    socket = io(url)
  }

  socket.on('users', data => {
    state.dispatch(setUsers(data))
  })

  socket.on('new question', question => {
    state.dispatch(setQuestion(question))
  })

  socket.on('game started', ({ currentQuestionIndex, numberOfQuestions }) => {
    state.dispatch(gameStarted({ currentQuestionIndex, numberOfQuestions }))
  })

  socket.on('answer', answer => {
    state.dispatch(showAnswerToPlayer(answer))
  })

  socket.on('all questions', quiz => {
    state.dispatch(setAllQuestionsToPlayers(quiz))
  })

  socket.on('room closing', () => {
    console.log('Room closing!')
    state.dispatch(closeRoom())
    // SEND USER BACK TO STARTING PAGE HERE
  })

  return next => action => {
    switch (action.type) {
      case CORRECT_ANSWER: {
        socket.emit('correct answer')
        break
      }

      case REVEAL_ANSWER: {
        socket.emit('reveal answer', action.answer)
        break
      }

      case INCORRECT_ANSWER: {
        socket.emit('incorrect answer')
        break
      }

      case CREATE_GAME: {
        socket.emit('join game as host', action.room)
        break
      }

      case START_GAME: {
        socket.emit('start game', { numberOfQuestions: action.numberOfQuestions, currentQuestionIndex: action.currentQuestionIndex })
        break
      }

      case JOIN_GAME: {
        socket.emit('join game', action)
        break
      }

      case SEND_QUESTION_TO_PLAYERS: {
        socket.emit('send question to players', action.question)
        break
      }

      case SEND_QUESTIONS_TO_SERVER: {
        socket.emit('send questions', action.quiz)
        break
      }

      default:
        break
    }

    return next(action)
  }
}

export default socketMiddleware
