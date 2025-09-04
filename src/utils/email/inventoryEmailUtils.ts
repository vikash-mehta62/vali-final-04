
import { 
  sendEmail, 
  sendPriceListEmail, 
  EmailSendOptions,
  EmailFormValues
} from '@/utils/email';
import { PriceListTemplate } from '@/components/inventory/forms/formTypes';

/**
 * Send a product price update notification to clients
 * @param productIds - Array of product IDs that were updated
 * @param clientIds - Array of client IDs to notify
 * @param options - Email sending options
 */
export const sendProductPriceUpdateEmail = async (
  productIds: string[],
  clientIds: string[],
  options: EmailSendOptions = {}
): Promise<boolean> => {
  try {
    const formValues: EmailFormValues = {
      to: "multiple-recipients",
      subject: "Product Price Updates",
      message: `We have updated the pricing for ${productIds.length} products. Please refer to the attached price list for more details.`,
    };

    return await sendEmail(formValues, {
      ...options,
      relatedData: {
        entityType: 'product',
        entityId: productIds.join(','),
      }
    });
  } catch (error) {
    console.error('Error sending product price update email:', error);
    return false;
  }
};

/**
 * Send a price list template to selected clients
 * @param priceListTemplate - The price list template to send
 * @param clientIds - Array of client IDs to send to
 * @param options - Email sending options
 */
export const sendPriceListTemplateEmail = async (
  priceListTemplate: PriceListTemplate,
  clientIds: string[],
  options: EmailSendOptions = {}
): Promise<{ success: boolean; sent: number; failed: number }> => {
  const subject = `New Price List: ${priceListTemplate.name}`;
  const message = priceListTemplate.description || 
    `We are pleased to share our updated price list: ${priceListTemplate.name}. Please find the attached document for your reference.`;
  
  return await sendPriceListEmail(
    priceListTemplate.id,
    clientIds,
    message,
    subject,
    options
  );
};

/**
 * Send product availability notification to clients
 * @param productIds - Array of product IDs to include in notification
 * @param clientIds - Array of client IDs to notify
 * @param options - Email sending options
 */
export const sendProductAvailabilityEmail = async (
  productIds: string[],
  clientIds: string[],
  options: EmailSendOptions = {}
): Promise<boolean> => {
  try {
    const formValues: EmailFormValues = {
      to: "multiple-recipients",
      subject: "Product Availability Update",
      message: `We wanted to inform you about the availability of products you might be interested in. Please see the attached information.`,
    };

    return await sendEmail(formValues, {
      ...options,
      relatedData: {
        entityType: 'product',
        entityId: productIds.join(','),
      }
    });
  } catch (error) {
    console.error('Error sending product availability email:', error);
    return false;
  }
};
