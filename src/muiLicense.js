import { LicenseInfo } from '@mui/x-license';

/**
 * Inicializa la licencia MUI X Pro
 * La key se obtiene de la variable de entorno REACT_APP_MUI_LICENSE
 */
function initializeMuiLicense() {
  const licenseKey = process.env.REACT_APP_MUI_LICENSE;

  if (!licenseKey) {
    console.warn(
      '⚠️ MUI X License key not found. Set REACT_APP_MUI_LICENSE in .env file.\n' +
      'Components may show watermarks or license warnings.'
    );
    return;
  }

  try {
    LicenseInfo.setLicenseKey(licenseKey);
    console.log('✓ MUI X License initialized successfully');
  } catch (error) {
    console.error('✗ Error initializing MUI X License:', error);
  }
}

initializeMuiLicense();
