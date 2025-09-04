'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('datetime', { ascending: true })

      if (error) throw error
      return data
    }
  })

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')

      if (error) throw error
      return data
    }
  })

  const stats = {
    totalEvents: events?.length || 0,
    totalUsers: 0, // Placeholder - need to determine users table
    totalBookings: bookings?.length || 0,
    upcomingEvents: events?.filter(event => new Date(event.datetime) > new Date()).length || 0
  }

  if (eventsLoading || bookingsLoading) {
    return <div className="text-center py-8">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Overview of your event management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900">Total Events</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalEvents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900">Total Bookings</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.upcomingEvents}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
        {events && events.length > 0 ? (
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => {
              const bookingCount = bookings?.filter(b => b.event_id === event.id).length || 0
              return (
                <div key={event.id} className="flex justify-between items-center border-b pb-3 last:border-b-0">
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-500">{new Date(event.datetime).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{bookingCount} bookings</p>
                    <p className="text-xs text-gray-500">{event.capacity} capacity</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500">No events found</p>
        )}
      </div>
    </div>
  )
}
