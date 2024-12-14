import express from 'express';
import {
  createCallMaster,
  getAllCallMasters,
  getCallMasterByClientId,
  finishCallMaster,
  updateCallMasterStatus,
  deleteCallMaster,
} from '../controllers/CallController.js';

const CallRoutes = express.Router();

// Route to create a new CallMaster (Open a Call)
CallRoutes.post('/createCall', createCallMaster);

// Route to get all CallMasters
CallRoutes.get('/getAllcall', getAllCallMasters);

// Route to get CallMasters by client_id
CallRoutes.get('/client/:client_id', getCallMasterByClientId);

// Route to mark a CallMaster as Finished (automatically sets CloseDate)
CallRoutes.put('/finish/:id', finishCallMaster);

// Route to update CallMaster status
CallRoutes.put('/status/:id', updateCallMasterStatus);

// Route to delete a CallMaster
CallRoutes.delete('/:id', deleteCallMaster);

export default CallRoutes;
