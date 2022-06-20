import { useNavigate } from 'react-router-dom'
import illistrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg  from '../assets/images/google-icon.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { database, ref, get } from '../services/firebase'

export function Home() {

  const navigate = useNavigate()
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('')

  async function handleCreateRoom() {

    if(!user){
      await signInWithGoogle()
    }

    navigate('/rooms/new')
  }

  async function handleJoinRoom(event : FormEvent){
    event.preventDefault();

    if(roomCode.trim() === ''){
      return;
    }
    
    const roomRef = ref(database, `rooms/${roomCode}`)
    const getRoomRef = await get(roomRef)

    if(!getRoomRef.exists()) {
      alert('Rooms does not exists')
      return;
    }

    navigate(`/rooms/${roomCode}`)

  }


  return(
    <div id='page-auth'>
      <aside>
        <img src={illistrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>crie salar de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logoImg} alt="letmeask" />
          <button onClick={handleCreateRoom} className='create-room'>
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className='separator'>
            ou entre em uma sala
          </div>
          <form onSubmit={handleJoinRoom} action="">
            <input
              type="text" 
              placeholder='digite o código da sala'
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
              />
            <Button type='submit'>
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}