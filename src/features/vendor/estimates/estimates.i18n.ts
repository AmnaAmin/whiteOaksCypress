export const NEW_ESTIMATE = 'newEstimate'

export const estimates = {
  en: {
    translation: {
      [NEW_ESTIMATE]: {
        // Modal
        title: 'New Estimate',
        estimateInformation: 'Estimate Information',
        propertyInformation: 'Property Information',
        estimateManagement: 'Estimate Management',

        // Estimate Table
        estimateID: 'Estimate ID',
        WOstatus: 'WO Status',
        WoID: 'WO ID',
        trade: 'Trade',
        dueDateWO: 'Due Date WO',
        expectedPaymentDate: 'Expected Payment Date',

        // Estimate Information Form
        name: 'Name',
        type: 'Type',
        woNumber: 'WO Number',
        poNumber: 'PO Number',
        clientStartDate: 'Client Start Date',
        clientDueDate: 'Client Due Date',
        woStartDate: 'WOA Start Date',
        originalSOWAmount: 'Original SOW Amount',
        uploadEstimateSOW: 'Upload Estimate SOW',
        chooseFile: 'Choose File',
        fileFormat: 'Please select a valid file format (pdf, png, jpg, jpeg)',
        uploadEstimate: 'Upload Estimate',

        // Estimate Property Form
        estimateId: 'Estimate ID',
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

        // Estimate Management Form
        fieldEstimateManager: 'Field Estimate Manager',
        estimateCoordinator: 'Estimate Coordinator',
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
      [NEW_ESTIMATE]: {
        // Modal
        title: 'Nuevo Proyecto',
        estimateInformation: 'Información del Proyecto',
        propertyInformation: 'Información del Inmueble',
        estimateManagement: 'Gestión del Proyecto',

        // Estimate Table
        estimateID: 'Estimateo ID',
        WOstatus: 'Estado de OT',
        WoID: 'ID de OT',
        trade: 'Comercio',
        dueDateWO: 'Fecha de vencimiento OT',
        expectedPaymentDate: 'Fecha de pago esperada',

        // Estimate Information Form
        name: 'Nombre',
        type: 'Tipo',
        woNumber: 'Número de WO',
        poNumber: 'Número de PO',
        clientStartDate: 'Fecha de Inicio del Cliente',
        clientDueDate: 'Fecha de Vencimiento del Cliente',
        woStartDate: 'Fecha de Inicio del WOA',
        originalSOWAmount: 'Monto Original del SOW',
        uploadEstimateSOW: 'Subir SOW del Proyecto',
        chooseFile: 'Seleccionar Archivo',

        // Estimate Property Form
        estimateId: 'ID del Proyecto',
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

        // Estimate Management Form
        fieldEstimateManager: 'Gerente de Proyecto',
        estimateCoordinator: 'Coordinador de Proyecto',
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
