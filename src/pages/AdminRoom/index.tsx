import { useParams, useNavigate} from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'
import deleteImg from '../../assets/images/delete.svg'
import checkImg from '../../assets/images/check.svg'
import answerImg from '../../assets/images/answer.svg'

import { Button } from '../../components/Button'
import { Question } from '../../components/Question'
import { RoomCode } from '../../components/RoomCode'
import { useRoom } from '../../hooks/useRoom'
import { database, ref, remove, update} from '../../services/firebase'
import './styles.scss'

type RoomParams = {
  id: string;
}

export function AdminRoom() {
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


  async function handleCheckQuestionAsAnswered(questionId: string) {
      const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`)
      await update(questionRef, {
        isAnswered : true
      })
  }

  async function handleHighlightQuestion(questionId: string) {
    const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`)
      await update(questionRef, {
        isHighlighted : true
      })
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
                author={question.author} 
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
                >
                  {!question.isAnswered && (
                    <>
                      <button
                        type='button'
                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                      >
                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                      </button>
                      <button
                        type='button'
                        onClick={() => handleHighlightQuestion(question.id)}
                      >
                        <img src={answerImg} alt="Dar destaque à pergunta" />
                      </button>
                    </>
                  ) }
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