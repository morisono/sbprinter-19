export const checkDymoService = async () => {
  try {
    console.log('Attempting to connect to DYMO Web Service...');
    
    // First try with no-cors to check if service exists
    const response = await fetch('http://127.0.0.1:41951/DYMO/DLS/Printing/Check', {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        'Accept': '*/*',
      }
    });
    
    console.log('DYMO service check response:', {
      status: response.status,
      type: response.type,
      ok: response.ok
    });

    // With no-cors, we can only check if we got an opaque response
    // An opaque response means the service is running
    if (response.type === 'opaque') {
      console.log('DYMO service is running');
      return true;
    }

    console.log('DYMO service check failed - service may not be running');
    return false;
  } catch (error) {
    console.error('DYMO service connection error:', {
      _type: error.constructor.name,
      value: {
        name: error.name,
        message: error.message
      }
    });
    return false;
  }
};

export const getDymoPrinters = () => {
  try {
    // @ts-ignore
    const dymo = window.dymo;
    if (!dymo?.label?.framework) {
      console.error('DYMO framework not available in window object');
      return null;
    }
    
    const printers = dymo.label.framework.getPrinters();
    console.log('Available DYMO printers:', printers);
    
    const labelWriter = printers.find((p: any) => p.printerType === 'LabelWriterPrinter');
    if (!labelWriter) {
      console.error('No DYMO LabelWriter printer found');
    }
    return labelWriter;
  } catch (error) {
    console.error('Error getting DYMO printers:', error);
    return null;
  }
};