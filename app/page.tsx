'use client'

import { useState } from 'react'

type RoomStatus = 'occ' | 'VC' | 'DND' | 'S/O' | 'VD' | ''
type SpecialItem = 'Babycot' | 'Extra Bed' | ''

interface Room {
  number: string
  status: RoomStatus
  occupancy: number
}

interface SpecialRequest {
  room: string
  item: SpecialItem
}

export default function Home() {
  const [date, setDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [attendant, setAttendant] = useState('')
  const [shift, setShift] = useState<'Morning' | 'Evening'>('Morning')

  const initialRooms: Room[] = [
    { number: '101', status: '', occupancy: 0 },
    { number: '102', status: '', occupancy: 0 },
    { number: '103', status: '', occupancy: 0 },
    { number: '104', status: '', occupancy: 0 },
    { number: '105', status: '', occupancy: 0 },
    { number: '106', status: '', occupancy: 0 },
    { number: '107', status: '', occupancy: 0 },
    { number: '108', status: '', occupancy: 0 },
    { number: '109', status: '', occupancy: 0 },
    { number: '201', status: '', occupancy: 0 },
    { number: '202', status: '', occupancy: 0 },
    { number: '203', status: '', occupancy: 0 },
    { number: '204', status: '', occupancy: 0 },
    { number: '205', status: '', occupancy: 0 },
    { number: '206', status: '', occupancy: 0 },
    { number: '207', status: '', occupancy: 0 },
    { number: '208', status: '', occupancy: 0 },
    { number: '209', status: '', occupancy: 0 },
    { number: '301', status: '', occupancy: 0 },
    { number: '302', status: '', occupancy: 0 },
    { number: '303', status: '', occupancy: 0 },
    { number: '304', status: '', occupancy: 0 },
    { number: '305', status: '', occupancy: 0 },
    { number: '306', status: '', occupancy: 0 },
    { number: '307', status: '', occupancy: 0 },
    { number: '308', status: '', occupancy: 0 },
    { number: '309', status: '', occupancy: 0 },
  ]

  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [specialRequests, setSpecialRequests] = useState<SpecialRequest[]>([])
  const [newSpecialRoom, setNewSpecialRoom] = useState('')
  const [newSpecialItem, setNewSpecialItem] = useState<SpecialItem>('Babycot')

  const updateRoom = (roomNumber: string, field: 'status' | 'occupancy', value: any) => {
    setRooms(rooms.map(room =>
      room.number === roomNumber
        ? { ...room, [field]: value }
        : room
    ))
  }

  const addSpecialRequest = () => {
    if (newSpecialRoom) {
      setSpecialRequests([...specialRequests, { room: newSpecialRoom, item: newSpecialItem }])
      setNewSpecialRoom('')
    }
  }

  const removeSpecialRequest = (index: number) => {
    setSpecialRequests(specialRequests.filter((_, i) => i !== index))
  }

  const generateWhatsAppMessage = () => {
    const dateObj = new Date(date)
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    let message = `Occupancy - ${shift}\n`
    message += `Date: ${formattedDate}\n`
    message += `Attendant: ${attendant}\n\n`

    rooms.forEach(room => {
      if (room.status || room.occupancy > 0) {
        message += `${room.number}- `
        if (room.status === 'occ' && room.occupancy > 0) {
          message += `occ ${room.occupancy}`
        } else if (room.status) {
          message += room.status
        }
        message += `\n`
      }
    })

    if (specialRequests.length > 0) {
      message += `\n`
      specialRequests.forEach(req => {
        message += `${req.item}: ${req.room}\n`
      })
    }

    return message
  }

  const copyToClipboard = () => {
    const message = generateWhatsAppMessage()
    navigator.clipboard.writeText(message)
    alert('Copied to clipboard! You can now paste this into WhatsApp.')
  }

  const shareToWhatsApp = () => {
    const message = generateWhatsAppMessage()
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
  }

  const resetForm = () => {
    setRooms(initialRooms)
    setSpecialRequests([])
    setAttendant('')
    const today = new Date()
    setDate(today.toISOString().split('T')[0])
    setShift('Morning')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Hotel Occupancy Tracker</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as 'Morning' | 'Evening')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attendant Name</label>
              <input
                type="text"
                value={attendant}
                onChange={(e) => setAttendant(e.target.value)}
                placeholder="Enter name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Room Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map(room => (
              <div key={room.number} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-bold text-lg text-gray-800 mb-3">Room {room.number}</div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
                  <select
                    value={room.status}
                    onChange={(e) => updateRoom(room.number, 'status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select status</option>
                    <option value="occ">Occupied</option>
                    <option value="VC">Vacant Clean</option>
                    <option value="VD">Vacant Dirty</option>
                    <option value="DND">Do Not Disturb</option>
                    <option value="S/O">Sleep Out</option>
                  </select>
                </div>

                {room.status === 'occ' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Occupancy</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={room.occupancy}
                      onChange={(e) => updateRoom(room.number, 'occupancy', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Number of guests"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Special Requests</h2>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newSpecialRoom}
              onChange={(e) => setNewSpecialRoom(e.target.value)}
              placeholder="Room number"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={newSpecialItem}
              onChange={(e) => setNewSpecialItem(e.target.value as SpecialItem)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Babycot">Baby Cot</option>
              <option value="Extra Bed">Extra Bed</option>
            </select>
            <button
              onClick={addSpecialRequest}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add
            </button>
          </div>

          {specialRequests.length > 0 && (
            <div className="space-y-2">
              {specialRequests.map((req, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                  <span className="text-gray-700">
                    <span className="font-semibold">{req.item}</span> in Room {req.room}
                  </span>
                  <button
                    onClick={() => removeSpecialRequest(index)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview</h2>
          <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap font-mono text-gray-700 border border-gray-200">
            {generateWhatsAppMessage()}
          </pre>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex gap-3">
            <button
              onClick={copyToClipboard}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              📋 Copy to Clipboard
            </button>
            <button
              onClick={shareToWhatsApp}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              📱 Share to WhatsApp
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
