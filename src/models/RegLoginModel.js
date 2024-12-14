import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Enforce unique usernames
    minlength: 3, // Optional: add a minimum length constraint
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Optional: enforce minimum password length
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['admin', 'employee'], // Restrict values to either 'admin' or 'employee'
    default: 'employee', // Default is 'employee'
  },
});

// Mongoose pre-save middleware to hash password before saving
userSchema.pre('save', async function(next) {
  // Check if passwords match
  if (this.password !== this.confirmPassword) {
    const err = new Error('Passwords do not match');
    return next(err);
  }

  // Hash the password before saving
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10); // Generate salt
      this.password = await bcrypt.hash(this.password, salt); // Hash the password
      this.confirmPassword = undefined; // Remove confirmPassword from the document
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    return next();
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password); // Compare the provided password with the hashed password
  } catch (error) {
    throw new Error('Error comparing password');
  }
};

// Create the User model
const User = mongoose.model('User', userSchema);

export default User;  // Export the User model
