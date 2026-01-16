
import { GlobalState } from '../types';

export class ExportService {
  /**
   * Exporta el estado completo del sistema a JSON
   */
  static exportToJSON(state: any, iaStates: any, notifications: string[]) {
    const bundle = {
      header: {
        system: "EDPLIA",
        version: "2.0.definitive",
        timestamp: new Date().toISOString(),
      },
      simulation_metrics: state.parameters,
      ia_intelligence_reports: iaStates,
      narrative_history: notifications
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    this.download(blob, `EDPLIA_CORTEX_${Date.now()}.json`);
  }

  /**
   * Exporta los logs y métricas a CSV para análisis de datos
   */
  static exportToCSV(notifications: string[]) {
    let csvContent = "data:text/csv;charset=utf-8,ID,Timestamp,Event_Description\n";
    
    notifications.forEach((note, index) => {
      // Limpiar comas para evitar errores de CSV
      const cleanNote = note.replace(/,/g, ";");
      const timestamp = new Date().toLocaleTimeString();
      csvContent += `${index},${timestamp},${cleanNote}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EDPLIA_LOGS_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private static download(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
