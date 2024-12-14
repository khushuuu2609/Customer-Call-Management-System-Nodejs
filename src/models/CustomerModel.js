import mongoose from 'mongoose';

// Define the Customer Master schema
const customerMasterSchema = new mongoose.Schema({
  client_id: {
    type: String,
    unique: true,  // Ensure client_id is unique
  },
  comp_name: {
    type: String,
    required: true,  // Company name is required
  },
  address: {
    area: {
      type: String,
      required: true,
    },
    root: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
  },
  owner: {
    name: {
      type: String,
      required: true,  // Contact person's name is required
    },
    contactNumber1: {
      type: String,
      required: true,  // First contact number is required
    },
  },
  employee: {
    name: {
      type: String,
      required: true,  // Contact person's name is required
    },
    contactNumber1: {
      type: String,
      required: true,  // First contact number is required
    }
  },
  accountant: {
    name: {
      type: String,
      required: true,  // Contact person's name is required
    },
    contactNumber1: {
      type: String,
      required: true,  // First contact number is required
    },
  },
  softwareType: {
    type: String,
    required: true,
    enum: ['Readymade', 'Superstore', 'Resturant', 'weighbridge', 'PetroCard', 'Jari'],  // Enum for software type
  },
  businessType: {
    type: String,
    required: true,
    enum: ['Retail', 'Wholesale', 'Manufacturing', 'Retail + Wholesale', 'Debit', 'Credit'],  // Enum for business type
  },
  install_dt: {
    type: Date,
    required: true,
  },
  total_user: {
    type: Number,
    required: true,
  },
  whatssap: {
    type: Number,
    default: 0, // Default is unchecked (0)
    enum: [0, 1], // Only 0 and 1 are valid
  },
  sms: {
    type: Number,
    default: 0, // Default is unchecked (0)
    enum: [0, 1], // Only 0 and 1 are valid
  },
  qr_display: {
    type: Number,
    default: 0, // Default is unchecked (0)
    enum: [0, 1], // Only 0 and 1 are valid
  },
  printers_scanners: {
    type: Number,
    default: 0, // Default is unchecked (0)
    enum: [0, 1], // Only 0 and 1 are valid
  },
  lables_ribbons: {
    type: Number,
    default: 0, // Default is unchecked (0)
    enum: [0, 1], // Only 0 and 1 are valid
  },
  refrence_by:{
    type: String,
    required: false,
  },
  remarks: {
    type: String,
    required: false,  // Remarks are optional
  },
}, {
  timestamps: true,  // Automatically add createdAt and updatedAt fields
});

// Static method to get the next client_id, ensuring uniqueness
customerMasterSchema.statics.getNextClientId = async function () {
  let nextClientId = 10001;

  // Fetch the last created client_id to determine the next one
  const lastCustomer = await this.findOne().sort({ client_id: -1 }).select('client_id');

  if (lastCustomer) {
    // Extract the numeric part of the client_id (e.g., 'CLT-3001' => 3001)
    const lastClientIdNum = parseInt(lastCustomer.client_id.split('-')[1]);
    nextClientId = lastClientIdNum + 1;  // Increment the number
  }

  // Ensure that the generated client_id does not already exist
  const existingClient = await this.findOne({ client_id: `CLT-${nextClientId}` });
  if (existingClient) {
    // If the client_id already exists, recursively call the method again
    return this.getNextClientId();
  }

  return `CLT-${nextClientId}`;
};

// Pre-save hook to auto-generate client_id
customerMasterSchema.pre('save', async function (next) {
  if (!this.client_id) {
    // Generate the next client_id
    this.client_id = await this.constructor.getNextClientId();
  }
  next();
});

// Create the CustomerMaster model
const CustomerMaster = mongoose.model('CustomerMaster', customerMasterSchema);

export default CustomerMaster;
