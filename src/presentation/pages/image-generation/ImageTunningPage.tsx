import { useState } from "react"
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
  GptMessageSelectableImage,
} from "../../components"
import {
  imageGenerationUseCase,
  imageVariationUseCase,
} from "../../../core/use-cases"

interface Message {
  text: string
  isGpt: boolean
  info?: {
    imageURL: string
    alt: string
  }
}

export const ImageTunningPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      isGpt: true,
      text: "Imágen base",
      info: {
        imageURL:
          "http://localhost:3000/gpt/image-generation/1715437074861.png",
        alt: "Imagen base",
      },
    },
  ])

  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  })

  const handlePost = async (text: string) => {
    setIsLoading(true)
    setMessages((prev) => [...prev, { text: text, isGpt: false }])

    const { mask, original } = originalImageAndMask

    const imageInfo = await imageGenerationUseCase(text, original, mask)
    setIsLoading(false)

    if (!imageInfo) {
      return setMessages((prev) => [
        ...prev,
        { text: "No se pudo generar la imagen", isGpt: true },
      ])
    }

    setMessages((prev) => [
      ...prev,
      {
        text: text,
        isGpt: true,
        info: {
          imageURL: imageInfo.url,
          alt: imageInfo.alt,
        },
      },
    ])

    // Todo: Añadir el mensaje de isGPT en true
  }

  const handleVariation = async () => {
    setIsLoading(true)

    const resp = await imageVariationUseCase(originalImageAndMask.original!)

    setIsLoading(false)

    if (!resp) return

    setMessages((prev) => [
      ...prev,
      {
        text: "Variación",
        isGpt: true,
        info: {
          imageURL: resp.url,
          alt: resp.alt,
        },
      },
    ])
  }

  return (
    <>
      {originalImageAndMask.original && (
        <div className='fixed flex flex-col items-center top-10 right-10 z-10 fade-in'>
          <span>Editando</span>
          <img
            src={originalImageAndMask.mask ?? originalImageAndMask.original}
            alt='Imagen original'
            className='border rounded-xl w-40 h-40 object-contain'
          />
          <button onClick={handleVariation} className='btn-primary mt-2'>
            Generar variación
          </button>
        </div>
      )}

      <div className='chat-container'>
        <div className='chat-messages'>
          <div className='grid grid-cols-12 gap-y-2'>
            {/* Bienvenida */}
            <GptMessage text='¿Qué imágen deseas generar?' />

            {messages.map((message, index) =>
              message.isGpt ? (
                // <GptMessageImage
                <GptMessageSelectableImage
                  key={index}
                  text={message.text}
                  imageURL={message.info!.imageURL}
                  alt={message.info!.alt}
                  onImageSelected={(maskImageURL) =>
                    setOriginalImageAndMask({
                      original: message.info?.imageURL,
                      mask: maskImageURL,
                    })
                  }
                />
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
      </div>
    </>
  )
}
