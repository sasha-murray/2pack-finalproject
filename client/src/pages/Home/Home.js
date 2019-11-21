import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Container, TextField, Button, makeStyles } from '@material-ui/core'
import NavBar from '../../components/NavBar/NavBar'
import './Home.css'
import { joinGame } from '../../actions/actions'
import SimpleSnackbar from '../../components/SimpleSnackbar/SimpleSnackbar'
const url = process.env.NODE_ENV === 'production' ? 'https://starry-expanse-259012.appspot.com' : 'http://localhost:8000'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
}))

const Home = () => {
  const dispatch = useDispatch()
  let history = useHistory()
  const classes = useStyles()

  const [showSnackbar, setShowSnackbar] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')

  const play = async (event) => {
    event.preventDefault()
    const res = await fetch(`${url}/list-of-rooms`)
    const data = await res.json()
    if(data.rooms.includes(code)) {
      dispatch(joinGame({name, code}))
      history.push('/player')
    } else {
      setShowSnackbar(true)
    }
  }
  
  return (
    <div>
      <NavBar />
      <SimpleSnackbar open={showSnackbar} setOpen={setShowSnackbar} message={'Room doesn\'t exist!'}/>
      <Container>
        <form className="form" noValidate autoComplete="off" onSubmit={play}>          
          <TextField
            id="Name"
            className={classes.textField}
            label="Name"
            margin="normal"
            required
            onChange={(event) => setName(event.target.value)}
            variant="outlined"/>

          <TextField
            id="Code"
            className={classes.textField}
            label="Code"
            margin="normal"
            required
            onChange={(event) => setCode(event.target.value)}
            variant="outlined"/>

          <Button type="submit" color="primary" variant="contained" className={classes.button}>
            Play
          </Button>

          <Button type="button" color="secondary" variant="contained" onClick={() => history.push('/quizzes')}>
            Host a game
          </Button>
        </form>

      </Container>  
    </div>
  )
}

export default Home;