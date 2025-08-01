import { useState, useRef, useEffect } from 'react'
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa'
import { MdSmartToy } from 'react-icons/md'
import { useAiModel } from '@/hooks/aimodelHook'

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [],
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const askAva = useAiModel() // Custom hook to call AI

const handleSendMessage = async () => {
  const trimmed = inputValue.trim()
  if (!trimmed) return

  // Append user's message
  const userMessage = { text: trimmed, isUser: true }
  setMessages((prev) => [...prev, userMessage])
  setInputValue('')

  try {
    // Get AI response
    const response = await askAva.mutateAsync({
      message: trimmed,
    })

    if ((response as any)?.data?.reply) {
      const aiMessage = { text: (response as any).data.reply, isUser: false }
      setMessages((prev) => [...prev, aiMessage])
    }
    console.log('AI response:', response)
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        text: 'Sorry, there was an error getting a response.',
        isUser: false,
      },
    ])
  }
}

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendMessage()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <MdSmartToy className="text-xl mr-2" />
              <h3 className="font-semibold">Healthcare AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <FaRobot className="text-4xl mb-2 text-blue-400" />
                <p>Hello! I'm your Healthcare AI Assistant.</p>
                <p>How can I help you today?</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition"
                // disabled={isLoading}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition transform hover:scale-110"
        >
          <FaRobot className="text-2xl" />
        </button>
      )}
    </div>
  )
}

export default AiAssistant
