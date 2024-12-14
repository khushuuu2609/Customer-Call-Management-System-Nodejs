import User from '../models/RegLoginModel.js';


export const registerUser = async (req, res) => {
    const { username, password, confirmPassword } = req.body;
  
    // Basic validation
    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const user = new User({ username, password, confirmPassword });
      await user.save(); // Save the user (password will be hashed automatically)
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  };
  
  // Login a user
  export const loginUser = async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await user.comparePassword(password); // Compare the provided password with the stored one
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  };