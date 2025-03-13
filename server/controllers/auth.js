exports.forgotPassword = async (req, res) => {
  try {
    console.log('Forgot password request received:', {
      email: req.body.email,
      timestamp: new Date().toISOString()
    });

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({
        success: false,
        message: 'User not found with this email address'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpiry;
    await user.save();

    // Create reset URL
    const clientUrl = process.env.NODE_ENV === 'production' 
      ? 'https://jay-kirana.onrender.com'
      : 'http://localhost:5200';
    
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    console.log('Reset URL generated:', {
      token: resetToken,
      url: resetUrl,
      expiry: new Date(resetTokenExpiry).toISOString()
    });

    // Send email
    const { transporter, defaultMailOptions } = require('../utils/mailer');
    
    const mailOptions = {
      ...defaultMailOptions,
      to: user.email,
      subject: 'Password Reset Request - Jay Kirana',
      html: `
        <h1>Password Reset Request</h1>
        <p>You are receiving this email because you (or someone else) has requested to reset your password.</p>
        <p>Please click on the following link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>This link will expire in 1 hour.</p>
      `
    };

    console.log('Attempting to send reset email to:', user.email);

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Reset email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    console.error('Error in forgotPassword:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });

    res.status(500).json({
      success: false,
      message: 'Error sending password reset email',
      error: error.message
    });
  }
}; 