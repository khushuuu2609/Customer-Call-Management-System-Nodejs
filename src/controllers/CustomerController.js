import CustomerMaster from '../models/CustomerModel.js';
import mongoose from 'mongoose';

// Create customer
export const createCustomer = async (req, res) => {
  const { comp_name, address, owner, employee, accountant, softwareType, businessType,install_dt,  total_user, refrence_by,  remarks } = req.body;

  try {
    // Check if required fields are present
    if (!comp_name || !address || !owner || !employee || !accountant || !softwareType || !total_user || !businessType || !install_dt) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Generate a new client_id
    const client_id = await CustomerMaster.getNextClientId();

    // Create a new CustomerMaster document
    const newCustomer = new CustomerMaster({
      client_id,
      comp_name,
      address,
      owner,
      employee,
      accountant,
      softwareType,
      businessType,
      install_dt,
      total_user,
      refrence_by,
      remarks,
    });

    // Save the new customer
    await newCustomer.save();

    // Respond with success
    res.status(201).json({
      message: 'Customer created successfully',
      customer: newCustomer,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      message: 'Error creating customer',
      error: error.message,
    });
  }
};

// Get all customers (with optional pagination)
export const getCustomers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;  // Default to page 1 and limit 10

  try {
    // Convert page and limit to integers
    const pageNum = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    const customers = await CustomerMaster.find()
      .skip((pageNum - 1) * pageLimit)  // Pagination
      .limit(pageLimit);

    const totalCustomers = await CustomerMaster.countDocuments();

    res.status(200).json({
      customers,
      totalCustomers,
      totalPages: Math.ceil(totalCustomers / pageLimit),
      currentPage: pageNum,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
};

// Get a specific customer by ID
export const getCustomerById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format (MongoDB ObjectId)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid customer ID format' });
  }

  try {
    const customer = await CustomerMaster.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error: error.message });
  }
};

// Update a customer by ID
export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { comp_name, address, owner, employee, accountant, softwareType, total_user, businessType, refrence_by, remarks } = req.body;

  // Validate the ID format (MongoDB ObjectId)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid customer ID format' });
  }

  try {
    const updatedCustomer = await CustomerMaster.findByIdAndUpdate(
      id,
      {
        comp_name,
        address,
        owner,
        employee,
        accountant,
        softwareType,
        businessType,
        install_dt,
        total_user,
        refrence_by,
        remarks
      },
      { new: true, runValidators: true }  // `new: true` returns the updated document
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error: error.message });
  }
};

// Delete a customer by ID
export const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format (MongoDB ObjectId)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid customer ID format' });
  }

  try {
    const deletedCustomer = await CustomerMaster.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error: error.message });
  }
};
