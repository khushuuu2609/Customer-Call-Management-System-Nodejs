import express from 'express';
import { createCustomer, getCustomers, getCustomerById,
    updateCustomer , deleteCustomer
} from '../controllers/CustomerController.js';

const customerRoutes = express.Router();

// Route to create a new customer
customerRoutes.post('/create', createCustomer);

// Route to get all customers
customerRoutes.get('/getcustomer', getCustomers);

// Route to get a specific customer by ID
customerRoutes.get('/:id', getCustomerById);

// Route to update a customer by ID
customerRoutes.put('/:id', updateCustomer);

// Route to delete a customer by ID
customerRoutes.delete('/:id', deleteCustomer);

export default customerRoutes;
