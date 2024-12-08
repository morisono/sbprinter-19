export const checkDymoService = async () => {
  try {
    // Try to connect to DYMO Web Service
    const response = await fetch('http://127.0.0.1:41951/DYMO/DLS/Printing/Check', {
      method: 'GET',
      mode: 'no-cors' // Required for local service connections
    });
    
    console.log('DYMO service check response:', {
      status: response.status,
      type: response.type,
      ok: response.ok
    });
    
    // Since we're using no-cors, we need to check response.type
    return response.type === 'opaque';
  } catch (error) {
    console.error('DYMO service connection error:', error);
    return false;
  }
};

export const getDymoPrinters = () => {
  try {
    // @ts-ignore
    const dymo = window.dymo;
    if (!dymo?.label?.framework) {
      console.error('DYMO framework not available');
      return null;
    }
    
    const printers = dymo.label.framework.getPrinters();
    console.log('Available DYMO printers:', printers);
    return printers.find((p: any) => p.printerType === 'LabelWriterPrinter');
  } catch (error) {
    console.error('Error getting DYMO printers:', error);
    return null;
  }
};