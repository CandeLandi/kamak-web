/**
 * Interfaz que representa la información interna de un proyecto
 */
export interface InternalInfo {
  /** Nombre de la persona de contacto */
  contactName: string;

  /** Teléfono de contacto */
  contactPhone: string;

  /** Email de contacto */
  contactEmail: string;

  /** Presupuesto del proyecto */
  budget: string;

  /** Estado de la facturación */
  invoiceStatus: 'Pendiente' | 'Facturado' | 'Pagado' | 'Vencido';

  /** Notas internas sobre el proyecto */
  notes: string;

  /** Indica si la sección de información de contacto está expandida */
  contactInfo?: boolean;

  /** Indica si la sección de información financiera está expandida */
  financialInfo?: boolean;

  /** Indica si la sección de notas internas está expandida */
  notesInfo?: boolean;
}
