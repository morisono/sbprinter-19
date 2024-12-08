export const checkDymoService = async () => {
  try {
    console.log('Attempting to connect to DYMO Web Service...');
    
    // First check if DYMO framework is available in window
    // @ts-ignore
    if (!window.dymo?.label?.framework) {
      console.error('DYMO framework not available in window object');
      return false;
    }

    // Try to get printers directly through DYMO framework instead of fetch
    try {
      // @ts-ignore
      const printers = window.dymo.label.framework.getPrinters();
      console.log('Successfully retrieved DYMO printers:', printers);
      return true;
    } catch (frameworkError) {
      console.error('Error accessing DYMO framework:', {
        name: frameworkError.name,
        message: frameworkError.message
      });
      return false;
    }
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