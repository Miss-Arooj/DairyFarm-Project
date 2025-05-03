const Employee = require('../models/Employee');

const generateEmployeeId = async () => {
  try {
    // Get the current year and month
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Find the highest existing employee ID
    const lastEmployee = await Employee.findOne().sort({ employeeId: -1 });
    
    let sequenceNumber;
    if (!lastEmployee || !lastEmployee.employeeId) {
      sequenceNumber = 1;
    } else {
      // Extract the sequence number from the last ID
      const lastId = lastEmployee.employeeId;
      const lastSequence = parseInt(lastId.slice(-4), 10) || 0;
      sequenceNumber = lastSequence + 1;
    }
    
    // Format the sequence number with leading zeros
    const formattedSequence = sequenceNumber.toString().padStart(4, '0');
    
    // Return the new ID in format EMPYYMM0001
    return `EMP${year}${month}${formattedSequence}`;
  } catch (error) {
    console.error('Error generating employee ID:', error);
    throw new Error('Failed to generate employee ID');
  }
};

module.exports = { generateEmployeeId };