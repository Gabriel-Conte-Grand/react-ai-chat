import { useState } from "react"
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxFile,
} from "../../components"
import { audioToTextUseCase } from "../../../core/use-cases"

interface Message {
  text: string
  isGpt: boolean
}

export const AudioToTextPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string, audioFile: File) => {
    setIsLoading(true)
    setMessages((prev) => [...prev, { text: text, isGpt: false }])

    //TODO: UseCase
    const resp = await audioToTextUseCase(audioFile, audioFile.name)
    setIsLoading(false)

    if (!resp) return

    const gptMessage = `

## __TRANSCRIPCIÓN:__

${resp.text}

`

    setMessages((prev) => [...prev, { text: gptMessage, isGpt: true }])
  }

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          {/* Bienvenida */}
          <GptMessage text='Hola! Aqui podras convertir tus audios a texto ' />

          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text={message.text} />
            ) : (
              <MyMessage
                key={index}
                text={message.text || "Transcribe el audio"}
              />
            )
          )}

          {isLoading && (
            <div className='col-start-1 col-end-12 fade-in'>
              <TypingLoader />
            </div>
          )}
        </div>
      </div>

      <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder='Haz click en el icono '
        accept='audio/*'
      />
    </div>
  )
}
