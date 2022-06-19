import { Link, useNavigate } from 'react-router-dom'
import { FormEvent, useState } from 'react'

import illistrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { database, ref, push, set } from '../services/firebase'

export function NewRoom() {

  const { user } = useAuth()
  const navigate = useNavigate() 
  const [newRoom, setNewRoom] = useState('')

  async function handleCreateRoom(event: FormEvent){
    event.preventDefault();

    if(newRoom.trim() === '') {
      return;
    }

    const roomRef = ref(database, 'rooms')
    const newRoomRef = push(roomRef)
    set(newRoomRef, {
      title: newRoom,
      authorId: user?.id 
    })

    navigate(`/rooms/${newRoomRef.key}`) 
    
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
          <h2>criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom} action="">
            <input 
              type="text" 
              placeholder='nome da sala'
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
              />
            <Button type='submit'>
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to='/'>clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}