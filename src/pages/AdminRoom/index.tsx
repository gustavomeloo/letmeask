import { useParams, useNavigate} from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'
import deleteImg from '../../assets/images/delete.svg'

import { Button } from '../../components/Button'
import { Question } from '../../components/Question'
import { RoomCode } from '../../components/RoomCode'
import { useAuth } from '../../hooks/useAuth'
import { useRoom } from '../../hooks/useRoom'
import { database, ref, push, set, remove, update} from '../../services/firebase'
import './styles.scss'

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const {user} = useAuth()
  const navigate = useNavigate()
  const params = useParams<RoomParams>()
  const roomId = params.id;

  const {title, questions} = useRoom(roomId!)

  async function handleEndRoom() {
    const roomRef = ref(database, `rooms/${roomId}`)
    await update(roomRef, {
      closedAt: new Date()
    })

    navigate('/')
  }

  async function handleDeleteQuestion(questionId: string){
    if (window.confirm('tem certeza que deseja excluir essa pergunta?')){
      const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`)
      await remove(questionRef)
      
    }
  }
 
  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={params.id!}/>
            <Button isOutlined onClick={handleEndRoom} >Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id} 
                content={question.content} 
                author={question.author} >
                  <button
                    type='button'
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Remover Pergunta" />
                  </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
    )
}