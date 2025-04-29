import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Wrench, AlertTriangle, Edit2, FileText, CheckCircle } from 'lucide-react';
import { VehicleForm } from './components/VehicleForm';
import { SignaturePad } from './components/SignaturePad';
import { RepairForm } from './components/RepairForm';
import { Dashboard } from './components/Dashboard';
import { PhotoGallery } from './components/PhotoGallery';
import { generateRepairPDF } from './components/PDFGenerator';
import type { Vehicle, RepairItem, WorkOrder, Statistics, Appointment } from './types';

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [repairs, setRepairs] = useState<RepairItem[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [vehiclePhotos, setVehiclePhotos] = useState<{ [key: string]: string[] }>({});
  const [editingRepair, setEditingRepair] = useState<RepairItem | null>(null);
  const [selectedRepair, setSelectedRepair] = useState<RepairItem | null>(null);
  const [currentWorkOrderId, setCurrentWorkOrderId] = useState<string | null>(null);

  useEffect(() => {
    const savedWorkOrders = localStorage.getItem('workOrders');
    const savedAppointments = localStorage.getItem('appointments');
    if (savedWorkOrders) {
      setWorkOrders(JSON.parse(savedWorkOrders));
    }
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workOrders', JSON.stringify(workOrders));
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [workOrders, appointments]);

  const activeRepairs = repairs.filter(repair => !repair.is_warning);
  const totalRevenue = activeRepairs.reduce((sum, repair) => sum + repair.cost, 0);

  const mockStatistics: Statistics = {
    total_repairs: activeRepairs.length,
    total_revenue: totalRevenue,
    average_repair_time: 4,
    common_repairs: [
      { description: 'Cambio de aceite', count: 15 },
      { description: 'Frenos', count: 10 },
      { description: 'Neumáticos', count: 8 },
    ],
    monthly_revenue: [
      { month: 'Ene', revenue: 3000 },
      { month: 'Feb', revenue: 4500 },
      { month: 'Mar', revenue: 3800 },
    ],
  };

  const handleAddVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: crypto.randomUUID()
    };
    setVehicles([newVehicle, ...vehicles]);
    setVehiclePhotos({ ...vehiclePhotos, [newVehicle.id]: [] });
  };

  const handleAddRepair = (repairData: Omit<RepairItem, 'id'>) => {
    if (editingRepair) {
      setRepairs(repairs.map(repair => 
        repair.id === editingRepair.id 
          ? { ...repair, ...repairData }
          : repair
      ));
      setEditingRepair(null);
    } else {
      const newRepair: RepairItem = {
        ...repairData,
        id: crypto.randomUUID(),
        work_order_id: currentWorkOrderId
      };
      setRepairs([newRepair, ...repairs]);
    }
  };

  const handleAddAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: crypto.randomUUID()
    };
    setAppointments([...appointments, newAppointment]);
  };

  const handleEditRepair = (repair: RepairItem) => {
    setEditingRepair(repair);
  };

  const handleCompleteRepair = (repairId: string) => {
    setRepairs(repairs.map(repair =>
      repair.id === repairId
        ? { ...repair, status: 'completed' }
        : repair
    ));
  };

  const handleSignature = (signature: string) => {
    if (selectedVehicle) {
      const newWorkOrderId = crypto.randomUUID();
      setCurrentWorkOrderId(newWorkOrderId);

      const newWorkOrder: WorkOrder = {
        id: newWorkOrderId,
        vehicle_id: selectedVehicle.id,
        date: new Date().toISOString(),
        status: 'approved',
        total_cost: 0,
        signature,
      };

      setWorkOrders([newWorkOrder, ...workOrders]);
      setShowSignaturePad(false);
    }
  };

  const handleAddPhoto = (vehicleId: string, photo: string) => {
    setVehiclePhotos({
      ...vehiclePhotos,
      [vehicleId]: [...(vehiclePhotos[vehicleId] || []), photo],
    });
  };

  const handleRemovePhoto = (vehicleId: string, index: number) => {
    setVehiclePhotos({
      ...vehiclePhotos,
      [vehicleId]: vehiclePhotos[vehicleId].filter((_, i) => i !== index),
    });
  };

  const handleGeneratePDF = (vehicle: Vehicle, workOrderId: string) => {
    const workOrderRepairs = repairs.filter(r => 
      r.vehicle_id === vehicle.id && 
      r.work_order_id === workOrderId &&
      !r.is_warning && 
      r.status === 'completed'
    );
    
    const hasUncompletedRepairs = repairs.some(r => 
      r.vehicle_id === vehicle.id && 
      r.work_order_id === workOrderId &&
      !r.is_warning && 
      r.status !== 'completed'
    );

    if (workOrderRepairs.length > 0 && !hasUncompletedRepairs) {
      const workOrder = workOrders.find(wo => wo.id === workOrderId);
      generateRepairPDF({ vehicle, repairs: workOrderRepairs, workOrder });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Wrench className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Taller Mecánico</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <Dashboard 
              statistics={mockStatistics} 
              appointments={appointments}
              vehicles={vehicles}
              onAddAppointment={handleAddAppointment}
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Nuevo Vehículo</h2>
                <VehicleForm onSubmit={handleAddVehicle} />
              </div>
            </div>

            {vehicles.length > 0 && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Vehículos Registrados</h2>
                  <div className="space-y-4">
                    {vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium">{vehicle.brand} {vehicle.model}</h3>
                            <p className="text-gray-600">Matrícula: {vehicle.license_plate}</p>
                            <p className="text-gray-600">Cliente: {vehicle.client_name}</p>
                            <p className="text-gray-600">Teléfono: {vehicle.phone_number}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedVehicle(vehicle);
                                setShowSignaturePad(true);
                              }}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                              Autorizar Trabajo
                            </button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <PhotoGallery
                            photos={vehiclePhotos[vehicle.id] || []}
                            onAddPhoto={(photo) => handleAddPhoto(vehicle.id, photo)}
                            onRemovePhoto={(index) => handleRemovePhoto(vehicle.id, index)}
                          />
                        </div>

                        {selectedVehicle?.id === vehicle.id && !showSignaturePad && (
                          <div className="mt-4">
                            <RepairForm 
                              vehicleId={vehicle.id} 
                              onSubmit={handleAddRepair}
                              editingRepair={editingRepair}
                              onCancel={() => setEditingRepair(null)}
                            />
                          </div>
                        )}

                        {workOrders
                          .filter(wo => wo.vehicle_id === vehicle.id)
                          .map(workOrder => {
                            const workOrderRepairs = repairs.filter(r => 
                              r.vehicle_id === vehicle.id && 
                              r.work_order_id === workOrder.id
                            );

                            if (workOrderRepairs.length === 0) return null;

                            return (
                              <div key={workOrder.id} className="mt-4 border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium">
                                    Orden de trabajo ({format(new Date(workOrder.date), 'dd/MM/yyyy')})
                                  </h4>
                                  {workOrderRepairs.every(r => r.is_warning || r.status === 'completed') && (
                                    <button
                                      onClick={() => handleGeneratePDF(vehicle, workOrder.id)}
                                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    >
                                      <FileText size={16} />
                                      <span>Generar Factura</span>
                                    </button>
                                  )}
                                </div>
                                <ul className="space-y-2">
                                  {workOrderRepairs.map((repair) => (
                                    <li key={repair.id} className="flex justify-between border-b pb-2">
                                      <div className="flex items-center space-x-2">
                                        {repair.is_warning ? (
                                          <AlertTriangle size={16} className="text-yellow-500" />
                                        ) : repair.status === 'completed' ? (
                                          <CheckCircle size={16} className="text-green-500" />
                                        ) : null}
                                        <span>{repair.description}</span>
                                      </div>
                                      <div className="flex items-center space-x-4">
                                        <span className="font-medium">{repair.cost.toFixed(2)}€</span>
                                        {!repair.is_warning && repair.status !== 'completed' && (
                                          <button
                                            onClick={() => handleCompleteRepair(repair.id)}
                                            className="text-green-500 hover:text-green-700"
                                            title="Marcar como completada"
                                          >
                                            <CheckCircle size={16} />
                                          </button>
                                        )}
                                        <button
                                          onClick={() => handleEditRepair(repair)}
                                          className="text-gray-500 hover:text-gray-700"
                                          title="Editar reparación"
                                        >
                                          <Edit2 size={16} />
                                        </button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                                <div className="mt-2 text-right">
                                  <span className="font-medium">
                                    Total: {workOrderRepairs
                                      .filter(r => !r.is_warning)
                                      .reduce((sum, repair) => sum + repair.cost, 0)
                                      .toFixed(2)}€
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {showSignaturePad && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <h3 className="text-lg font-medium mb-4">Firma de Autorización</h3>
                  <SignaturePad onSave={handleSignature} />
                  <button
                    onClick={() => setShowSignaturePad(false)}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;