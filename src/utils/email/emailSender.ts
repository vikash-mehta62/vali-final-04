
import { EmailFormValues, EmailSendOptions } from './emailTypes';

/**
 * Send an email using the provided form values and options
 * @param formValues - The email form values
 * @param options - Email sending options
 */
export const sendEmail = async (
  formValues: EmailFormValues,
  options: EmailSendOptions = {}
): Promise<boolean> => {
  const { 
    webhookUrl, 
    onSuccess, 
    onError, 
    showNotifications = true,
    fromDomain,
    fromEmail,
    fromName,
    trackInCRM = false,
    relatedData
  } = options;

  if (!webhookUrl) {
    console.error('No webhook URL provided for sending email');
    if (onError) onError(new Error('No webhook URL provided'));
    return false;
  }

  try {
    // Prepare sender information
    const sender = fromEmail ? 
      { email: fromEmail, name: fromName || 'Business CRM' } : 
      { email: `noreply@${fromDomain || 'example.com'}`, name: fromName || 'Business CRM' };

    // This would connect to your webhook that handles the actual email sending
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify({
        ...formValues,
        from: sender,
        timestamp: new Date().toISOString(),
        trackInCRM,
        relatedData,
      }),
    });

    if (onSuccess) onSuccess();
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    if (onError) onError(error as Error);
    return false;
  }
};

/**
 * Verify an email domain by sending a test email
 * @param domain - The domain to verify
 * @param webhookUrl - The webhook URL to use for verification
 */
export const verifyEmailDomain = async (
  domain: string,
  webhookUrl: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // This would connect to your webhook that handles the domain verification
    // In a real implementation, this might send a verification email to the domain owner
    // or check DNS records
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify({
        action: 'verifyDomain',
        domain,
        timestamp: new Date().toISOString(),
      }),
    });

    return { success: true, message: `Verification email sent to ${domain} admin` };
  } catch (error) {
    console.error('Error verifying domain:', error);
    return { success: false, message: `Failed to verify domain: ${(error as Error).message}` };
  }
};

/**
 * Send a price list update email to clients
 * @param priceListId - ID of the price list to send
 * @param clientIds - Array of client IDs to send to
 * @param options - Email sending options
 */
export const sendPriceListEmail = async (
  priceListId: string,
  clientIds: string[],
  message: string,
  subject: string,
  options: EmailSendOptions = {}
): Promise<{ success: boolean; sent: number; failed: number }> => {
  const { webhookUrl } = options;
  
  if (!webhookUrl) {
    console.error('No webhook URL provided for sending price list email');
    return { success: false, sent: 0, failed: clientIds.length };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify({
        action: 'sendPriceList',
        priceListId,
        clientIds,
        message,
        subject,
        timestamp: new Date().toISOString(),
      }),
    });

    return { 
      success: true, 
      sent: clientIds.length, 
      failed: 0 
    };
  } catch (error) {
    console.error('Error sending price list email:', error);
    return { 
      success: false, 
      sent: 0, 
      failed: clientIds.length 
    };
  }
};

/**
 * Send an invoice via email
 * @param invoiceId - ID of the invoice to send
 * @param clientId - ID of the client to send to
 * @param options - Email sending options
 */
export const sendInvoiceEmail = async (
  invoiceId: string,
  clientId: string,
  message: string,
  subject: string,
  options: EmailSendOptions = {}
): Promise<boolean> => {
  const { webhookUrl } = options;
  
  if (!webhookUrl) {
    console.error('No webhook URL provided for sending invoice email');
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify({
        action: 'sendInvoice',
        invoiceId,
        clientId,
        message,
        subject,
        timestamp: new Date().toISOString(),
      }),
    });

    return true;
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return false;
  }
};
