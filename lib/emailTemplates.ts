export function meetingScheduledTemplate(clientName: string, date: string, meetLink: string) {
  return {
    subject: "Your Meeting is Scheduled",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        
        <h2 style="color: #333;">Hello ${clientName},</h2>
        <p>Your meeting has been successfully scheduled.</p>
        <p><strong>Date & Time:</strong> ${date}</p>
        <p><strong>Meeting Link:</strong> 
          <a href="${meetLink}" style="color: #007bff; text-decoration: none; font-weight: bold;">Join Meeting</a>
        </p>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <p style="font-size: 14px; color: #666;">Thank you,<br>Freelancer SaaS Team</p>
        <div style="text-align: center; padding-bottom: 10px;">
          <img src="https://iconape.com/wp-content/uploads/1/12/google-meet-0%D9%A2.png" 
               alt="Google Meet" 
               width="150" 
               height="130" 
               style="display: block; margin: auto;" />
        </div>
      </div>
    `,
  };
}
