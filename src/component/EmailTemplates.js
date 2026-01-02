const emailTemplates = {
  welcome: {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to FlowMail - Your Journey Begins!',
    body: `Hello [Name],

Welcome to FlowMail! 🎉

We're thrilled to have you join our community of professionals who value efficient and beautiful email management.

Here's what you can do next:
• Complete your profile setup
• Explore our smart AI features
• Connect your existing email accounts
• Customize your email preferences

Getting Started Guide: [Link]
Need help? Our support team is here 24/7

Best regards,
The FlowMail Team

---
FlowMail Professional
Email Management Reimagined
`,
    category: 'onboarding'
  },
  
  otp: {
    id: 'otp',
    name: 'OTP Verification',
    subject: 'Your FlowMail Verification Code',
    body: `Security Verification Required

Hello [Name],

To ensure the security of your FlowMail account, please use the verification code below:

🔐 Verification Code: [OTP_CODE]

This code will expire in 10 minutes for your security.

If you didn't request this code, please ignore this email or contact our security team immediately.

Important Security Tips:
• Never share this code with anyone
• FlowMail will never ask for your code via phone or email
• Always verify the sender's email address

Stay secure,
FlowMail Security Team

---
This is an automated security message from FlowMail
`,
    category: 'security'
  },
  
  resetPassword: {
    id: 'resetPassword',
    name: 'Password Reset',
    subject: 'Reset Your FlowMail Password',
    body: `Password Reset Request

Hello [Name],

We received a request to reset your FlowMail account password. If you made this request, click the button below to create a new password:

🔗 Reset Your Password: [RESET_LINK]

This link will expire in 24 hours for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your current password will remain unchanged.

For your account security:
• Choose a strong, unique password
• Enable two-factor authentication
• Keep your recovery information updated

Need assistance? Contact our support team.

Best regards,
FlowMail Security Team

---
FlowMail Professional
Secure Email Management
`,
    category: 'security'
  }
};

export default emailTemplates;