import React, { useState } from 'react';
import { Wrench, AlertTriangle, ChevronDown, Save, X } from 'lucide-react';
import type { RepairItem } from '../types';
import { commonRepairs } from '../types';

interface RepairFormProps {
  vehicleId: string;
  onSubmit: (repair: Omit<RepairItem, 'id' | 'created_at' | 'user_id'>) => void;
  editingRepair?: RepairItem;
  onCancel?: () => void;
}

export function RepairForm({ vehicleId, onSubmit, editingRepair, onCancel }: RepairFormProps) {
  const [formData, setFormData] = useState({
    description: editingRepair?.description || '',
    cost: editingRepair?.cost || 0,
    is_warning: editingRepair?.is_warning || false,
    status: editingRepair?.status || 'pending' as const,
  });
  const [showCommonRepairs, setShowCommonRepairs] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      vehicle_id: vehicleId,
      description: formData.description,
      cost: formData.cost,
      is_warning: formData.is_warning,
      status: formData.is_warning ? 'warning' : 'pending',
    });
    if (!editingRepair) {
      setFormData({
        description: '',
        cost: 0,
        is_warning: false,
        status: 'pending',
      });
    }
  };

  const handleCommonRepairSelect = (repair: typeof commonRepairs[0]) => {
    setFormData({
      ...formData,
      description: repair.description,
      cost: repair.cost,
    });
    setShowCommonRepairs(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-blue-600">
          <Wrench size={24} />
          <h3 className="text-lg font-semibold">
            {editingRepair ? 'Editar Reparación' : 'Añadir Reparación'}
          </h3>
        </div>
        {editingRepair && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <div className="relative mt-1">
          <textarea
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowCommonRepairs(!showCommonRepairs)}
            className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600"
          >
            <ChevronDown size={20} />
          </button>
        </div>
        
        {showCommonRepairs && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
            <ul className="py-1">
              {commonRepairs.map((repair, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => handleCommonRepairSelect(repair)}
                >
                  <span>{repair.description}</span>
                  <span className="text-gray-600">{repair.cost.toFixed(2)}€</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Coste</label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.cost}
          onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_warning"
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          checked={formData.is_warning}
          onChange={(e) => {
            setFormData({ ...formData, is_warning: e.target.checked });
            if (!e.target.checked) {
              setShowCommonRepairs(false);
            }
          }}
        />
        <label htmlFor="is_warning" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
          <AlertTriangle size={16} className="text-yellow-500" />
          <span>Marcar como advertencia para reparación futura</span>
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
        >
          <Save size={16} />
          <span>{editingRepair ? 'Guardar Cambios' : 'Añadir Reparación'}</span>
        </button>
      </div>
    </form>
  );
}