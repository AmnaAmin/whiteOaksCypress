export const NEW_PROJECT = 'newProject'

export const projects = {
  en: {
    translation: {
      [NEW_PROJECT]: {
        // Modal
        title: 'New Project',
        projectInformation: 'Project Information',
        propertyInformation: 'Property Information',
        projectManagement: 'Project Management',

        // Project Information Form
        name: 'Name',
        type: 'Type',
        woNumber: 'WO Number',
        poNumber: 'PO Number',
        clientStartDate: 'Client Start Date',
        clientDueDate: 'Client Due Date',
        woStartDate: 'WOA Start Date',
        originalSOWAmount: 'Original SOW Amount',
        uploadProjectSOW: 'Upload Project SOW',
        chooseFile: 'Choose File',
        fileFormat: 'Please select a valid file format (pdf, png, jpg, jpeg)',

        // Project Property Form
        projectId: 'Project ID',
        existAddressMessage: 'using this address already exists',
        acknowledged: 'Acknowledged',
        address: 'Address',
        city: 'City',
        state: 'State',
        zipCode: 'Zip Code',
        market: 'Market',
        gateCode: 'Gate Code',
        lockBoxCode: 'Lock Box Code',
        hoaPhone: 'HOA Phone',
        hoaContactEmail: 'HOA Contact Email',
        ext: 'Ext',
        cancel: 'Cancel',
        next: 'Next',

        // Project Management Form
        fieldProjectManager: 'Field Project Manager',
        projectCoordinator: 'Project Coordinator',
        client: 'Client',
        clientSuperName: 'Client Super Name',
        superPhoneNumber: 'Super Phone',
        superEmail: 'Super Email',
        save: 'Save',
      },
    },
  },
  es: {
    translation: {
      [NEW_PROJECT]: {
        // Modal
        title: 'Nuevo Proyecto',
        projectInformation: 'Información del Proyecto',
        propertyInformation: 'Información del Inmueble',
        projectManagement: 'Gestión del Proyecto',

        // Project Information Form
        name: 'Nombre',
        type: 'Tipo',
        woNumber: 'Número de WO',
        poNumber: 'Número de PO',
        clientStartDate: 'Fecha de Inicio del Cliente',
        clientDueDate: 'Fecha de Vencimiento del Cliente',
        woStartDate: 'Fecha de Inicio del WOA',
        originalSOWAmount: 'Monto Original del SOW',
        uploadProjectSOW: 'Subir SOW del Proyecto',
        chooseFile: 'Seleccionar Archivo',

        // Project Property Form
        projectId: 'ID del Proyecto',
        existAddressMessage: 'ya existe una dirección con este nombre',
        acknowledged: 'Aceptado',
        address: 'Dirección',
        city: 'Ciudad',
        state: 'Estado',
        zipCode: 'Código Postal',
        market: 'Mercado',
        gateCode: 'Código de Puerta',
        lockBoxCode: 'Código de Caja',
        hoaPhone: 'Teléfono de HOA',
        ext: 'Ext',
        hoaContactEmail: 'Correo de Contacto de HOA',
        cancel: 'Cancelar',
        next: 'Siguiente',

        // Project Management Form
        fieldProjectManager: 'Gerente de Proyecto',
        projectCoordinator: 'Coordinador de Proyecto',
        client: 'Cliente',
        clientSuperName: 'Supervisor del Cliente',
        superPhoneNumber: 'Teléfono del Supervisor',
        superEmail: 'Correo del Supervisor',
        save: 'Guardar',
        fileFormat: 'Seleccione un formato de archivo válido (pdf, png, jpg, jpeg)',
      },
    },
  },
}
