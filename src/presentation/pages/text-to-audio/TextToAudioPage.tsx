import { useState } from "react"
import { TextMessageBoxSelect } from "../../components/chat-input-boxes/TextMessageBoxSelect"
import {
  GptMessage,
  GptMessageAudio,
  MyMessage,
  TypingLoader,
} from "../../components"
import { textToAudioUseCase } from "../../../core/use-cases"

interface TextMessage {
  text: string
  isGpt: boolean
  type: "text"
}

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
]

interface AudioMessage {
  text: string
  isGpt: boolean
  audio: string
  type: "audio"
}

type Message = TextMessage | AudioMessage

export const TextToAudioPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string, selectedVoice: string) => {
    setIsLoading(true)
    setMessages((prev) => [...prev, { text: text, isGpt: false, type: "text" }])

    //TODO: UseCase
    const { message, ok, audioURL } = await textToAudioUseCase(
      text,
      selectedVoice
    )
    setIsLoading(false)

    if (!ok) return alert("No se pudo generar el audio")

    setMessages((prev) => [
      ...prev,
      {
        text: ` ${selectedVoice} - ${message}`,
        isGpt: true,
        type: "audio",
        audio: audioURL!,
      },
    ])
  }

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          {/* Bienvenida */}
          <GptMessage text='Aqui puedes escribir textos y yo los transformaré en audio.' />

          {messages.map((message, index) =>
            message.isGpt ? (
              message.type === "audio" ? (
                <GptMessageAudio
                  key={index}
                  text={message.text}
                  audio={message.audio}
                />
              ) : (
                <MyMessage key={index} text={message.text} />
              )
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

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder='Escribe aquí '
        options={voices}
      />
    </div>
  )
}
