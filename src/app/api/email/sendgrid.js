'use server';

/**
 * SendGrid email service integration
 * Handles sending emails for various notifications
 */

/**
 * Send an email using SendGrid API
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email content
 * @param {string} options.html - HTML email content
 * @returns {Promise<Object>} - Email sending result
 */
export async function sendEmail({ to, subject, text, html }) {
  try {
    // Check if we're in a build/SSG environment or missing API key
    if (process.env.NODE_ENV === 'production' && !process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid API key not available, skipping email send');
      return { success: true, mock: true };
    }

    // In a real implementation, this would use the SendGrid API
    // For demo purposes, we'll just log the email and return success
    console.log('Sending email:', {
      to,
      subject,
      textLength: text?.length,
      htmlLength: html?.length
    });

    // Mock SendGrid API call
    if (process.env.SENDGRID_API_KEY) {
      // In production with a real API key, we would make the actual API call
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      // await sgMail.send({
      //   to,
      //   from: 'notifications@tubeautomator.com',
      //   subject,
      //   text,
      //   html
      // });
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

/**
 * Send a video published notification
 * @param {Object} options - Notification options
 * @param {string} options.to - Recipient email address
 * @param {string} options.videoTitle - Title of the published video
 * @param {string} options.videoUrl - URL to the published video
 * @param {string} options.thumbnailUrl - URL to the video thumbnail
 * @returns {Promise<Object>} - Email sending result
 */
export async function sendVideoPublishedNotification({ to, videoTitle, videoUrl, thumbnailUrl }) {
  const subject = `🎉 Your video "${videoTitle}" has been published!`;
  
  const text = `
    Great news! Your video "${videoTitle}" has been successfully published to YouTube.
    
    Video URL: ${videoUrl}
    
    Thank you for using TubeAutomator!
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF0000;">🎉 Video Published Successfully!</h1>
      
      <p>Great news! Your video has been successfully published to YouTube:</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h2 style="margin-top: 0;">${videoTitle}</h2>
        ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="Video Thumbnail" style="max-width: 100%; border-radius: 5px;">` : ''}
        <p><a href="${videoUrl}" style="color: #FF0000; text-decoration: none; font-weight: bold;">View your video on YouTube</a></p>
      </div>
      
      <p>Your audience can now enjoy your content! Remember to promote your video on social media for maximum reach.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>Thank you for using TubeAutomator!</p>
        <p>If you have any questions, please contact our support team.</p>
      </div>
    </div>
  `;
  
  return sendEmail({ to, subject, text, html });
}

/**
 * Send a video upload failed notification
 * @param {Object} options - Notification options
 * @param {string} options.to - Recipient email address
 * @param {string} options.videoTitle - Title of the failed video
 * @param {string} options.errorMessage - Error message explaining the failure
 * @returns {Promise<Object>} - Email sending result
 */
export async function sendVideoFailedNotification({ to, videoTitle, errorMessage }) {
  const subject = `❌ There was an issue publishing your video "${videoTitle}"`;
  
  const text = `
    We encountered an issue while trying to publish your video "${videoTitle}" to YouTube.
    
    Error: ${errorMessage}
    
    Please check your YouTube API key and try again. If the problem persists, please contact our support team.
    
    Thank you for using TubeAutomator!
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF0000;">❌ Video Publishing Failed</h1>
      
      <p>We encountered an issue while trying to publish your video to YouTube:</p>
      
      <div style="background-color: #fff0f0; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #ffcccc;">
        <h2 style="margin-top: 0; color: #cc0000;">${videoTitle}</h2>
        <p><strong>Error:</strong> ${errorMessage}</p>
      </div>
      
      <p>Here are some steps you can take:</p>
      <ol>
        <li>Check that your YouTube API key is valid and has the correct permissions</li>
        <li>Verify that your YouTube account is in good standing</li>
        <li>Try regenerating and uploading the video again</li>
      </ol>
      
      <p>If the problem persists, please contact our support team for assistance.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>Thank you for using TubeAutomator!</p>
        <p>If you have any questions, please contact our support team.</p>
      </div>
    </div>
  `;
  
  return sendEmail({ to, subject, text, html });
}
