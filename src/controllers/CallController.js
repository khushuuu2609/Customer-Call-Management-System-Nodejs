import CallMaster from '../models/CallModel.js';  // Assuming your model is in '../models/CallMaster.js'

// Create a new CallMaster document (Open a Call)
export const createCallMaster = async (req, res) => {
  try {
    const { reason, assignTo, client_id } = req.body;

    // Create a new CallMaster instance
    const newCallMaster = new CallMaster({
      call_status: 'Open',  // Default to 'Open' when a call is created
      reason,
      assignTo,
      client_id,
    });

    // Save the document to the database
    const savedCallMaster = await newCallMaster.save();
    res.status(201).json({
      success: true,
      message: 'CallMaster created successfully',
      data: savedCallMaster,
    });
  } catch (error) {
    console.error('Error creating CallMaster:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating CallMaster',
      error: error.message,
    });
  }
};

// Get all CallMasters
export const getAllCallMasters = async (req, res) => {
  try {
    const callMasters = await CallMaster.find().populate('client_id');
    res.status(200).json({
      success: true,
      data: callMasters,
    });
  } catch (error) {
    console.error('Error fetching CallMasters:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching CallMasters',
      error: error.message,
    });
  }
};

// Get a specific CallMaster by client_id
export const getCallMasterByClientId = async (req, res) => {
  try {
    const { client_id } = req.params;
    const callMasters = await CallMaster.find({ client_id }).populate('client_id');
    res.status(200).json({
      success: true,
      data: callMasters,
    });
  } catch (error) {
    console.error('Error fetching CallMasters by client_id:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching CallMasters by client_id',
      error: error.message,
    });
  }
};

// Update CallMaster status to 'Finished' (set CloseDate)
export const finishCallMaster = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and update the CallMaster status to 'Finished'
    const updatedCallMaster = await CallMaster.findByIdAndUpdate(
      id,
      { call_status: 'Finished' },
      { new: true }
    );

    if (!updatedCallMaster) {
      return res.status(404).json({
        success: false,
        message: 'CallMaster not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'CallMaster finished successfully',
      data: updatedCallMaster,
    });
  } catch (error) {
    console.error('Error finishing CallMaster:', error);
    res.status(500).json({
      success: false,
      message: 'Error finishing CallMaster',
      error: error.message,
    });
  }
};

// Update CallMaster status (can update to any status)
export const updateCallMasterStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { call_status } = req.body;

    const updatedCallMaster = await CallMaster.findByIdAndUpdate(
      id,
      { call_status },
      { new: true }
    );

    if (!updatedCallMaster) {
      return res.status(404).json({
        success: false,
        message: 'CallMaster not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'CallMaster status updated successfully',
      data: updatedCallMaster,
    });
  } catch (error) {
    console.error('Error updating CallMaster status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating CallMaster status',
      error: error.message,
    });
  }
};

// Delete a CallMaster
export const deleteCallMaster = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCallMaster = await CallMaster.findByIdAndDelete(id);

    if (!deletedCallMaster) {
      return res.status(404).json({
        success: false,
        message: 'CallMaster not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'CallMaster deleted successfully',
      data: deletedCallMaster,
    });
  } catch (error) {
    console.error('Error deleting CallMaster:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting CallMaster',
      error: error.message,
    });
  }
};
