import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';

interface PhotoGalleryProps {
  photos: string[];
  onAddPhoto: (photo: string) => void;
  onRemovePhoto: (index: number) => void;
}

export function PhotoGallery({ photos, onAddPhoto, onRemovePhoto }: PhotoGalleryProps) {
  const [showUpload, setShowUpload] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAddPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    setShowUpload(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Fotos</h3>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
        >
          <Camera size={20} />
          <span>Añadir Foto</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <img
              src={photo}
              alt={`Foto ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={() => onRemovePhoto(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h4 className="text-lg font-semibold mb-4">Subir Foto</h4>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowUpload(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowUpload(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Subir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}