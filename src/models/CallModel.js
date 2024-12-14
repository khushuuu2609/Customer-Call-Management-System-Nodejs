import mongoose from 'mongoose';

// Define the callMaster schema
const callMasterSchema = new mongoose.Schema({
  call_status: {
    type: String,
    required: true,
    enum: ['Open', 'Pending', 'In-Process', 'Alloted', 'On the Way', 'Cancelled', 'Finished'],
  },
  reason: {
    type: String,
    required: true,
  },
  remark: {
    type: String,
    required: false,
  },
  assignTo: {
    type: String,
    required: true,
  },
  OpenDate: {
    type: Date,
    default: Date.now, // Automatically sets the current date when the document is created
  },
  CloseDate: {
    type: Date,
    required: false,
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerMaster',
    required: true,
  },
});

// Post-update hook to automatically set CloseDate when the status is changed to "Finished"
callMasterSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  if (update.call_status === 'Finished' && !update.CloseDate) {
    update.CloseDate = new Date(); // Set the CloseDate to the current system date
    this.setUpdate(update); // Ensure the updated document reflects this change
  }

  next();
});

// Create the CallMaster model
const CallMaster = mongoose.model('CallMaster', callMasterSchema);

export default CallMaster;
