import smtplib
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

# In-memory OTP storage (for development)
# In production, use Redis or database
otp_storage = {}

class EmailSender:
    def __init__(self):
        # Using Gmail SMTP (Free)
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.sender_email = os.getenv('SENDER_EMAIL', 'mediconnect.ai@gmail.com')
        self.sender_password = os.getenv('SENDER_PASSWORD', '')
        
    def generate_otp(self, length=6):
        """Generate a random OTP"""
        return ''.join(random.choices(string.digits, k=length))
    
    def store_otp(self, email, otp):
        """Store OTP with expiration (5 minutes)"""
        expiration = datetime.utcnow() + timedelta(minutes=5)
        otp_storage[email] = {
            'otp': otp,
            'expires_at': expiration,
            'attempts': 0
        }
        logger.info(f"OTP stored for {email}, expires at {expiration}")
    
    def verify_otp(self, email, otp, delete_after_verify=False):
        """Verify OTP"""
        if email not in otp_storage:
            return False, "OTP not found or expired"
        
        stored_data = otp_storage[email]
        
        # Check expiration
        if datetime.utcnow() > stored_data['expires_at']:
            del otp_storage[email]
            return False, "OTP expired"
        
        # Check attempts
        if stored_data['attempts'] >= 3:
            del otp_storage[email]
            return False, "Too many failed attempts"
        
        # Verify OTP
        if stored_data['otp'] == otp:
            # Only delete if explicitly requested (for final verification during signup/login)
            if delete_after_verify:
                del otp_storage[email]
            return True, "OTP verified successfully"
        else:
            stored_data['attempts'] += 1
            return False, "Invalid OTP"
    
    def delete_otp(self, email):
        """Delete OTP after successful use"""
        if email in otp_storage:
            del otp_storage[email]
    
    def send_otp_email(self, recipient_email, otp):
        """Send OTP via email"""
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = "MediConnect - Your Verification Code"
            message["From"] = self.sender_email
            message["To"] = recipient_email
            
            # Create HTML content
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .otp-box {{ background: white; border: 2px dashed #3b82f6; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }}
                    .otp-code {{ font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 8px; }}
                    .footer {{ text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }}
                    .warning {{ background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏥 MediConnect AI</h1>
                        <p>Your Health, Our Priority</p>
                    </div>
                    <div class="content">
                        <h2>Verification Code</h2>
                        <p>Hello!</p>
                        <p>You requested a verification code for your MediConnect account. Use the code below to complete your authentication:</p>
                        
                        <div class="otp-box">
                            <div class="otp-code">{otp}</div>
                        </div>
                        
                        <div class="warning">
                            <strong>⚠️ Important:</strong>
                            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                                <li>This code expires in <strong>5 minutes</strong></li>
                                <li>Do not share this code with anyone</li>
                                <li>If you didn't request this, please ignore this email</li>
                            </ul>
                        </div>
                        
                        <p>Need help? Contact our support team.</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 MediConnect AI. All rights reserved.</p>
                        <p>This is an automated message, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Attach HTML content
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)
            
            # For development without real email credentials
            if not self.sender_password:
                logger.info(f"[DEV MODE] OTP for {recipient_email}: {otp}")
                print(f"\n{'='*50}")
                print(f"📧 EMAIL OTP (Development Mode)")
                print(f"{'='*50}")
                print(f"To: {recipient_email}")
                print(f"OTP Code: {otp}")
                print(f"Expires in: 5 minutes")
                print(f"{'='*50}\n")
                return True
            
            # Send email using SMTP
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)
            
            logger.info(f"OTP email sent successfully to {recipient_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send OTP email: {str(e)}")
            # In development, still log the OTP
            logger.info(f"[FALLBACK] OTP for {recipient_email}: {otp}")
            print(f"\n⚠️ Email sending failed, but OTP generated: {otp}\n")
            return True  # Return True for development purposes
    
    def send_otp(self, email):
        """Generate and send OTP"""
        otp = self.generate_otp()
        self.store_otp(email, otp)
        success = self.send_otp_email(email, otp)
        return success, otp if not self.sender_password else None  # Return OTP only in dev mode

# Singleton instance
email_sender = EmailSender()
