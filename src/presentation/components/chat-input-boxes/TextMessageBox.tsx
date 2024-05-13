import { FC, FormEvent, useState } from "react"

interface Props {
  onSendMessage: (message: string) => void
  placeholder?: string
  disableCorrections?: boolean
}

export const TextMessageBox: FC<Props> = ({
  onSendMessage,
  disableCorrections = false,
  placeholder,
}) => {
  const [message, setMessage] = useState("")

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (message.trim().length === 0) return

    onSendMessage(message)
    setMessage("")
  }

  return (
    <form
      onSubmit={handleSendMessage}
      className='flex flex-row items-center h-16 rounded-xl bg-gray-400 w-full px-2 '
    >
      <div className='flex-grow'>
        <div className='relatice w-full'>
          <input
            type='text'
            autoFocus
            name='message'
            className='flex w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10'
            placeholder={placeholder}
            autoComplete={disableCorrections ? "on" : "off"}
            autoCorrect={disableCorrections ? "on" : "off"}
            spellCheck={disableCorrections ? "true" : "false"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      <div className='ml-4'>
        <button className='btn-primary '>
          <span className='mr-2'>Enviar</span>
          <i className='fa-regular fa-paper-plane'></i>
        </button>
      </div>
    </form>
  )
}
