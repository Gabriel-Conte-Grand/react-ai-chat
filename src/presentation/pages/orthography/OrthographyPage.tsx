import { useState } from "react"
import {
  GptMessage,
  GptOrthographyMessage,
  MyMessage,
  TextMessageBox,
  TextMessageBoxFile,
  TypingLoader,
} from "../../components"
import { orthographyUseCase } from "../../../core/use-cases"

interface Message {
  text: string
  isGpt: boolean
  info?: {
    userScore: number
    errors: string[]
    message: string
  }
}

export const OrthographyPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string) => {
    setIsLoading(true)
    setMessages((prev) => [...prev, { text: text, isGpt: false }])

    //data
    const { errors, message, ok, userScore } = await orthographyUseCase(text)

    if (!ok) {
      setMessages((prev) => [
        ...prev,
        { text: "No se pudo realizar la correción.", isGpt: true },
      ])
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: message,
          isGpt: true,
          info: {
            errors,
            message,
            userScore,
          },
        },
      ])
    }

    setIsLoading(false)

    // Todo: Añadir el mensaje de isGPT en true
  }

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          {/* Bienvenida */}
          <GptMessage text='Hola, puedes escribir tu texto en español, y te ayudo con las correcciones' />

          {messages.map((message, index) =>
            message.isGpt ? (
              <GptOrthographyMessage key={index} {...message.info!} />
            ) : (
              <MyMessage key={index} text={message.text} />
            )
          )}

          {isLoading && (
            <div className='col-start-1 col-end-12 fade-in'>
              <TypingLoader />
            </div>
          )}
        </div>
      </div>

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder='Escribe aquí '
        disableCorrections
      />
      {/* <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder='Escribe aquí '
        disableCorrections
      /> */}
    </div>
  )
}
