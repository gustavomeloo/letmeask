import { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { database, ref, push, set, onValue } from '../services/firebase'
import '../styles/room.scss'

type Question = {
  id: string;
  author : {
    name : string,
    avatar : string
  }

  content : string,
  isAnswered: string,
  isHighlighted : string
}

type FirebaseQuestions = Record<string, {
  author : {
    name : string,
    avatar : string
  }

  content : string,
  isAnswered: string,
  isHighlighted : string

}>

type RoomParams = {
  id: string;
}

export function Room() {
  const {user} = useAuth()
  const params = useParams<RoomParams>()
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState('')
  const roomId = params.id;

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`)

    onValue(roomRef, room => {

      const databaseRoom = room.val()

      const FirebaseQuestions : FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(FirebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted : value.isHighlighted,
          isAnswered : value.isAnswered,  
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })

  },[roomId])

  async function handleSendQuestion(event : FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === ''){
      return;
    }
    if (!user){
      throw new Error('You must be logged in')
    }

    const question = {
      content : newQuestion,
      author : {
        name : user.name,
        avatar : user.avatar
      },
      isHighlighted : false,
      isAnswered: false
    }

    const questionRef = ref(database, `rooms/${roomId}/questions`)
    const newQuestionRef = push(questionRef)
    await set(newQuestionRef, question)

    setNewQuestion('')

  }
 
  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={params.id!}/>
        </div>
      </header>

      <main>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea 
          onChange={event => setNewQuestion(event.target.value)}
          value={newQuestion}
          placeholder='o que você quer perguntar' />

          <div className='form-footer'>
            { user ? (
              <div className='user-info'>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            ) }
            <Button type='submit' disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>

        {JSON.stringify(questions)}
      </main>
    </div>
    )
}