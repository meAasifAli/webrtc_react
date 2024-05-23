import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Lobby = () => {
    const navigate = useNavigate()
    const [roomId, setRoomId] = useState("")
    function handleCall(e) {
        if (!roomId) return alert("Please enter a room id")
        e.preventDefault()
        navigate(`/${roomId}`)
    }
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <form onSubmit={handleCall} className="sm:w-[30%] mx-auto p-4 sm:p-16 shadow-lg flex flex-col w-full space-y-4 rounded-3xl">
                <h2 className="text-xl font-bold text-center">Join Room</h2>
                <input
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    type="text" placeholder="room id" className="w-full p-3 border-0 outline-none bg-gray-300 rounded-full" />
                <button type="submit" className="bg-blue-600 rounded-full p-3 text-white hover:bg-blue-700 transition-all duration-300">Join</button>
            </form>
        </div>
    )
}
export default Lobby