import React, { useState, useEffect } from 'react';
import { Car, ChevronDown } from 'lucide-react';
import type { Vehicle } from '../types';
import { carBrands, carModels } from '../types';

interface VehicleFormProps {
  onSubmit: (vehicle: Omit<Vehicle, 'id'>) => void;
}

export function VehicleForm({ onSubmit }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    license_plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    client_name: '',
    phone_number: '',
  });
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState(carBrands);
  const [filteredModels, setFilteredModels] = useState<string[]>([]);

  useEffect(() => {
    if (formData.brand) {
      const models = carModels[formData.brand] || [];
      setFilteredModels(models);
    } else {
      setFilteredModels([]);
    }
  }, [formData.brand]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      license_plate: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      client_name: '',
      phone_number: '',
    });
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, brand: value, model: '' });
    const filtered = carBrands.filter(brand => 
      brand.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBrands(filtered);
    setShowBrandDropdown(true);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, model: value });
    if (formData.brand && carModels[formData.brand]) {
      const filtered = carModels[formData.brand].filter(model => 
        model.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredModels(filtered);
    }
    setShowModelDropdown(true);
  };

  const handleBrandSelect = (brand: string) => {
    setFormData({ ...formData, brand, model: '' });
    setShowBrandDropdown(false);
  };

  const handleModelSelect = (model: string) => {
    setFormData({ ...formData, model });
    setShowModelDropdown(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-center text-blue-600 mb-4">
        <Car size={40} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Matrícula</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.license_plate}
            onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Marca</label>
          <div className="relative">
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                value={formData.brand}
                onChange={handleBrandChange}
                onFocus={() => setShowBrandDropdown(true)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Escribe o selecciona una marca"
              />
              <button
                type="button"
                className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowBrandDropdown(!showBrandDropdown)}
              >
                <ChevronDown size={16} />
              </button>
            </div>
            
            {showBrandDropdown && filteredBrands.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
                <div className="py-1">
                  {filteredBrands.map((brand) => (
                    <div
                      key={brand}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleBrandSelect(brand)}
                    >
                      {brand}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Modelo</label>
          <div className="relative">
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                value={formData.model}
                onChange={handleModelChange}
                onFocus={() => formData.brand && setShowModelDropdown(true)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={formData.brand ? "Escribe o selecciona un modelo" : "Primero selecciona una marca"}
              />
              <button
                type="button"
                className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => formData.brand && setShowModelDropdown(!showModelDropdown)}
              >
                <ChevronDown size={16} />
              </button>
            </div>
            
            {showModelDropdown && filteredModels.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
                <div className="py-1">
                  {filteredModels.map((model) => (
                    <div
                      key={model}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleModelSelect(model)}
                    >
                      {model}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Año</label>
          <input
            type="number"
            required
            min="1900"
            max={new Date().getFullYear()}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="tel"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Añadir Vehículo
        </button>
      </div>
    </form>
  );
}