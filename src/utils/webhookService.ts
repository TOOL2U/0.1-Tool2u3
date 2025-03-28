import axios from 'axios';
import { Order, GpsCoordinates } from '../context/OrderContext';

/**
 * Service for sending webhook notifications
 */
export const webhookService = {
  /**
   * Send order details to the webhook endpoint
   * @param order The order data to send
   * @returns Promise resolving to the response or error
   */
  sendOrderWebhook: async (order: Order): Promise<any> => {
    try {
      const WEBHOOK_URL = "https://hook.eu2.make.com/vu3s7gc6ao5gmun1o1t976566txn5t1c";
      
      // Format GPS coordinates
      const gpsLocation = formatGpsCoordinates(order.gpsCoordinates);
      
      // Generate Google Maps link if coordinates are available
      const googleMapsLink = generateGoogleMapsLink(order.gpsCoordinates);
      
      // Format driver location if available
      const driverLocation = order.driverLocation 
        ? formatGpsCoordinates({
            latitude: order.driverLocation.latitude,
            longitude: order.driverLocation.longitude
          })
        : "N/A";
      
      // Generate driver Google Maps link if available
      const driverGoogleMapsLink = order.driverLocation
        ? generateGoogleMapsLink({
            latitude: order.driverLocation.latitude,
            longitude: order.driverLocation.longitude
          })
        : "N/A";
      
      // Build the payload according to the required format
      const payload = {
        order_id: order.id || "N/A",
        customer_name: order.customerInfo?.name || "N/A",
        customer_email: order.customerInfo?.email || "N/A",
        customer_phone: order.customerInfo?.phone || "N/A",
        shipping_address: order.deliveryAddress || "N/A",
        gps_location: gpsLocation,
        gps_maps_link: googleMapsLink,
        driver_location: driverLocation,
        driver_maps_link: driverGoogleMapsLink,
        driver_last_updated: order.driverLocation?.lastUpdated || "N/A",
        distance_km: order.distance ? order.distance.toFixed(1) : "N/A",
        ordered_items: order.items.map(item => ({
          id: item.id || "N/A",
          name: item.name || "N/A",
          brand: item.brand || "N/A",
          quantity: item.quantity || 1,
          days: item.days || 1,
          price: item.price || 0,
          subtotal: item.quantity * item.price * (item.days || 1)
        })),
        total_amount: calculateTotalAmount(order) || 0,
        delivery_fee: order.deliveryFee || 0,
        payment_method: order.paymentMethod || "N/A",
        order_status: formatOrderStatus(order.status) || "Pending",
        order_date: order.orderDate || new Date().toISOString(),
        delivery_time: order.deliveryTime || "N/A",
        estimated_delivery: order.estimatedDelivery || "N/A"
      };
      
      // Send the data to the webhook
      const response = await axios.post(WEBHOOK_URL, payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      console.log("Webhook sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Webhook Error:", error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
};

/**
 * Calculate the total amount including tax and delivery fee
 */
function calculateTotalAmount(order: Order): number {
  const subtotal = order.totalAmount || 0;
  const tax = subtotal * 0.07; // 7% tax
  return subtotal + tax + (order.deliveryFee || 0);
}

/**
 * Format order status to a more user-friendly format
 */
function formatOrderStatus(status: string): string {
  switch (status) {
    case 'payment_verification':
      return 'Pending Payment';
    case 'pending':
      return 'Pending';
    case 'processing':
      return 'Processing';
    case 'delivered':
      return 'Delivered';
    case 'completed':
      return 'Completed';
    default:
      return status || 'N/A';
  }
}

/**
 * Format GPS coordinates to a string
 */
function formatGpsCoordinates(coordinates?: GpsCoordinates): string {
  if (!coordinates || typeof coordinates.latitude !== 'number' || typeof coordinates.longitude !== 'number') {
    return "N/A";
  }
  
  return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
}

/**
 * Generate a Google Maps link from GPS coordinates
 */
function generateGoogleMapsLink(coordinates?: GpsCoordinates): string {
  if (!coordinates || typeof coordinates.latitude !== 'number' || typeof coordinates.longitude !== 'number') {
    return "N/A";
  }
  
  return `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`;
}

/**
 * Extract GPS coordinates from address string if available
 * Expects coordinates in format like "13.756331, 100.501765"
 */
function extractGPSCoordinates(address: string): { latitude: number; longitude: number } | null {
  if (!address) return null;
  
  // Check if the address contains coordinates
  const coordinateRegex = /(\d+\.\d+),\s*(\d+\.\d+)/;
  const match = address.match(coordinateRegex);
  
  if (match && match.length >= 3) {
    const latitude = parseFloat(match[1]);
    const longitude = parseFloat(match[2]);
    
    if (!isNaN(latitude) && !isNaN(longitude)) {
      return { latitude, longitude };
    }
  }
  
  return null;
}
