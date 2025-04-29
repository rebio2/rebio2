import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Calendar as CalendarIcon, AlertTriangle, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import type { Statistics, Appointment, Vehicle } from '../types';
import 'react-calendar/dist/Calendar.css';

interface DashboardProps {
  statistics: Statistics;
  appointments: Appointment[];
  vehicles: Vehicle[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

export function Dashboard({ statistics, appointments, vehicles, onAddAppointment }: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    vehicle_id: '',
    time: '09:00',
    duration: 60,
    service_type: '',
    notes: '',
    client_name: '',
    phone_number: ''
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowAppointmentModal(true);
  };

  const handleSubmitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && appointmentForm.vehicle_id) {
      const [hours, minutes] = appointmentForm.time.split(':');
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes));

      onAddAppointment({
        vehicle_id: appointmentForm.vehicle_id,
        date: appointmentDate.toISOString(),
        duration: appointmentForm.duration,
        service_type: appointmentForm.service_type,
        notes: appointmentForm.notes,
        status: 'scheduled'
      });

      setShowAppointmentModal(false);
      setAppointmentForm({
        vehicle_id: '',
        time: '09:00',
        duration: 60,
        service_type: '',
        notes: '',
        client_name: '',
        phone_number: ''
      });
    }
  };

  // Get upcoming appointments sorted by date
  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* KPI Cards */}
      <div className="col-span-full">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ingresos Totales</p>
              <p className="text-2xl font-bold">{statistics.total_revenue.toFixed(2)}€</p>
            </div>
            <DollarSign className="text-green-500" size={24} />
          </div>
        </div>
      </div>

      {/* Gráfico de Ingresos */}
      <div className="col-span-full lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Ingresos Mensuales</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statistics.monthly_revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calendario */}
      <div className="col-span-full lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Calendario de Citas</h3>
        <Calendar
          className="w-full"
          onClickDay={handleDateClick}
          tileContent={({ date }) => {
            const appointmentsForDay = appointments.filter(
              (apt) => new Date(apt.date).toDateString() === date.toDateString()
            );
            return appointmentsForDay.length > 0 ? (
              <div className="absolute bottom-0 right-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            ) : null;
          }}
        />
      </div>

      {/* Modal de Nueva Cita */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nueva Cita</h3>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={appointmentForm.client_name}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, client_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono del Cliente</label>
                <input
                  type="tel"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={appointmentForm.phone_number}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, phone_number: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Vehículo</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={appointmentForm.vehicle_id}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, vehicle_id: e.target.value })}
                >
                  <option value="">Seleccionar vehículo</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Hora</label>
                <input
                  type="time"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Duración (minutos)</label>
                <input
                  type="number"
                  required
                  min="30"
                  step="30"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={appointmentForm.duration}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, duration: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Servicio</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={appointmentForm.service_type}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, service_type: e.target.value })}
                >
                  <option value="">Seleccionar servicio</option>
                  <option value="Cambio de aceite">Cambio de aceite</option>
                  <option value="Revisión de frenos">Revisión de frenos</option>
                  <option value="Cambio de neumáticos">Cambio de neumáticos</option>
                  <option value="Revisión general">Revisión general</option>
                  <option value="Diagnóstico">Diagnóstico</option>
                  <option value="Reparación">Reparación</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notas</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={appointmentForm.notes}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAppointmentModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Guardar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alertas y Recordatorios */}
      <div className="col-span-full lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Próximas Citas</h3>
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => {
            const vehicle = vehicles.find(v => v.id === appointment.vehicle_id);
            if (!vehicle) return null;

            return (
              <div key={appointment.id} className="flex items-start space-x-3">
                <CalendarIcon className="text-blue-500 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium">{vehicle.brand} {vehicle.model}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(appointment.date), 'dd/MM/yyyy HH:mm')} - {appointment.service_type}
                  </p>
                  {appointment.notes && (
                    <p className="text-xs text-gray-400 mt-1">{appointment.notes}</p>
                  )}
                </div>
              </div>
            );
          })}
          {upcomingAppointments.length === 0 && (
            <p className="text-sm text-gray-500">No hay citas programadas</p>
          )}
        </div>
      </div>
    </div>
  );
}