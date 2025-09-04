'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface Event {
  id: string
  title: string
  description: string
  location: string
  capacity: number
  datetime: string
  created_by: string
}

export default function EventList() {
  const queryClient = useQueryClient()
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    location: '',
    capacity: '',
    datetime: '',
  })

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('datetime', { ascending: false })

      if (error) throw error
      return data as Event[]
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (eventData: Event) => {
      const { data, error } = await supabase
        .from('events')
        .update({
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          capacity: parseInt(editFormData.capacity),
          datetime: new Date(eventData.datetime).toISOString(),
        })
        .eq('id', eventData.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      setEditingEvent(null)
      setEditFormData({ title: '', description: '', location: '', capacity: '', datetime: '' })
    },
  })

  const startEditing = (event: Event) => {
    setEditingEvent(event)
    setEditFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      capacity: event.capacity.toString(),
      datetime: new Date(event.datetime).toISOString().slice(0, 16),
    })
  }

  const cancelEditing = () => {
    setEditingEvent(null)
    setEditFormData({ title: '', description: '', location: '', capacity: '', datetime: '' })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEvent) return
    updateMutation.mutate({
      ...editingEvent,
      title: editFormData.title,
      description: editFormData.description,
      location: editFormData.location,
      capacity: parseInt(editFormData.capacity),
      datetime: editFormData.datetime,
    })
  }

  const handleDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteMutation.mutate(eventId)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading events...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Manage Events</h2>
        <p className="text-gray-600">View, edit, and delete your events</p>
      </div>

      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        {events && events.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {events.map((event) => (
              <div key={event.id} className="p-6">
                {editingEvent && editingEvent.id === event.id ? (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Title"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={editFormData.location}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="number"
                        placeholder="Capacity"
                        value={editFormData.capacity}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, capacity: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="1"
                      />
                      <input
                        type="datetime-local"
                        value={editFormData.datetime}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, datetime: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={editFormData.description}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="flex space-x-2 justify-end">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {updateMutation.isPending ? 'Updating...' : 'Update'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-gray-600 mt-1">{event.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>📍 {event.location}</span>
                        <span>👥 {event.capacity} capacity</span>
                        <span>📅 {new Date(event.datetime).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => startEditing(event)}
                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No events found. Create your first event!
          </div>
        )}
      </div>
    </div>
  )
}
