'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export default function CreateEvent() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    capacity: '',
    datetime: '',
    event_type: 'private',
    organizing_college: 'DBC Bangalore',
    visibility_level: 'college',
    category: 'academic',
    entry_fee: '0',
    is_team_event: false,
    requirements: '',
    contact_email: '',
    contact_phone: ''
  })

  const createEventMutation = useMutation({
    mutationFn: async (eventData: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          capacity: parseInt(eventData.capacity),
          datetime: new Date(eventData.datetime).toISOString(),
          event_type: eventData.event_type,
          organizing_college: eventData.organizing_college,
          college_domain: 'dbcblr.edu.in',
          visibility_level: eventData.visibility_level,
          category: eventData.category,
          entry_fee: parseFloat(eventData.entry_fee) || 0,
          is_team_event: eventData.is_team_event,
          requirements: eventData.requirements,
          contact_email: eventData.contact_email || undefined,
          contact_phone: eventData.contact_phone || undefined,
          created_by: user.id,
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['events'] })
    // Reset form to initial state
    setFormData({
      title: '',
      description: '',
      location: '',
      capacity: '',
      datetime: '',
      event_type: 'private',
      organizing_college: 'DBC Bangalore',
      visibility_level: 'college',
      category: 'academic',
      entry_fee: '0',
      is_team_event: false,
      requirements: '',
      contact_email: '',
      contact_phone: ''
    })
    alert('Event created successfully!')
  },
  onError: (error: unknown) => {
    const message = error instanceof Error ? error.message : 'An unknown error occurred'
    alert('Error creating event: ' + message)
  }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createEventMutation.mutate(formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
        <p className="text-gray-600">Fill in the details to create a new event</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter event title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter event description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter location"
            />
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Capacity
            </label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              required
              min="1"
              value={formData.capacity}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter capacity"
            />
          </div>
        </div>

        <div>
          <label htmlFor="datetime" className="block text-sm font-medium text-gray-700">
            Date & Time
          </label>
          <input
            id="datetime"
            name="datetime"
            type="datetime-local"
            required
            value={formData.datetime}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={createEventMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  )
}
