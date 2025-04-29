import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import type { Vehicle, RepairItem, WorkOrder } from '../types';

interface PDFGeneratorProps {
  vehicle: Vehicle;
  repairs: RepairItem[];
  workOrder: WorkOrder | undefined;
}

export function generateRepairPDF({ vehicle, repairs, workOrder }: PDFGeneratorProps) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Añadir imagen de encabezado
  const logoUrl = 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=800&q=80';
  doc.addImage(logoUrl, 'JPEG', 20, 10, 40, 25);

  // Título
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('Factura de Reparación', pageWidth / 2, 45, { align: 'center' });

  // Información del vehículo
  doc.setFontSize(12);
  doc.text('Datos del Vehículo:', 20, 65);
  
  const vehicleInfo = [
    ['Matrícula:', vehicle.license_plate],
    ['Marca:', vehicle.brand],
    ['Modelo:', vehicle.model],
    ['Año:', vehicle.year.toString()],
    ['Cliente:', vehicle.client_name],
    ['Teléfono:', vehicle.phone_number],
    ['Fecha:', format(workOrder ? new Date(workOrder.date) : new Date(), 'dd/MM/yyyy HH:mm')]
  ];

  autoTable(doc, {
    startY: 70,
    head: [],
    body: vehicleInfo,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 2
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 100 }
    }
  });

  // Lista de reparaciones
  doc.setFontSize(12);
  doc.text('Reparaciones Realizadas:', 20, doc.previousAutoTable.finalY + 15);

  const repairData = repairs
    .filter(repair => !repair.is_warning && repair.status === 'completed')
    .map(repair => [
      repair.description,
      `${repair.cost.toFixed(2)}€`
    ]);

  const totalCost = repairs
    .filter(repair => !repair.is_warning && repair.status === 'completed')
    .reduce((sum, repair) => sum + repair.cost, 0);

  autoTable(doc, {
    startY: doc.previousAutoTable.finalY + 20,
    head: [['Descripción', 'Coste']],
    body: [...repairData, ['Total', `${totalCost.toFixed(2)}€`]],
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 30, halign: 'right' }
    },
    foot: [['Total', `${totalCost.toFixed(2)}€`]],
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    }
  });

  if (workOrder?.signature) {
    const signatureY = pageHeight - 60;
    
    // Texto de autorización
    doc.setFontSize(10);
    doc.text('Autorización del Cliente:', 20, signatureY);
    doc.setFontSize(8);
    doc.text('Por la presente autorizo la realización de los trabajos descritos en este documento.', 20, signatureY + 5);
    
    // Añadir firma
    try {
      doc.addImage(workOrder.signature, 'PNG', 20, signatureY + 10, 50, 20);
    } catch (error) {
      console.error('Error al añadir la firma:', error);
    }
    
    // Nombre del cliente
    doc.setFontSize(8);
    doc.text(`Firmado: ${vehicle.client_name}`, 20, signatureY + 35);
  }

  // Pie de página
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Descargar el PDF
  doc.save(`factura_${vehicle.license_plate}_${format(new Date(), 'yyyyMMdd')}.pdf`);
}