const Payment = require('../models/paymentModel');

// Use for fetch purchase history of user
const Cart = require('../models/cartModel');
const sendEmail = require('../helpers/emailSend'); 

class PaymentController {
  // Create a new payment
  static async createPayment(req, res) {
    try {
      const { cart, payment, card_holder, card_number, exp_date, email } = req.body;

      const newPayment = new Payment({
        cart,
        payment,
        card_holder,
        card_number,
        exp_date
      });

      const savedPayment = await newPayment.save();

      // Mask the card number: show only last 4 digits
      const maskedCardNumber = card_number.slice(-4).padStart(card_number.length, '*');

      // Compose the email
      const emailSubject = 'Payment Confirmation';
      const emailText = `Dear ${card_holder},\n\nYour payment of ${payment} has been processed successfully using card ending in ${maskedCardNumber}.`;
      const emailHtml = `
        <p>Dear ${card_holder},</p>
        <p>Your payment of <strong>${payment}</strong> has been processed successfully using card ending in <strong>${maskedCardNumber}</strong>.</p>
        <p>Thank you for your purchase!</p>
      `;

      if (email) {
        await sendEmail({
          to: email,
          subject: emailSubject,
          text: emailText,
          html: emailHtml
        });
      }

      res.status(201).json(savedPayment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get a payment by ID
  static async getPaymentById(req, res) {
    try {
      const payment = await Payment.findById(req.params.id).populate('cart');
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update a payment by ID
  static async updatePayment(req, res) {
    try {
      const updatedPayment = await Payment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedPayment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      res.json(updatedPayment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete a payment by ID
  static async deletePayment(req, res) {
    try {
      const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
      if (!deletedPayment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get all payments
  static async getAllPayments(req, res) {
    try {
      const payments = await Payment.find()
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getPaymentByUserId(req, res) {
    try {
      const userId = req.params.userId;
      const carts = await Cart.find({ user: userId });
      const cartIds = carts.map(cart => cart._id);
      const payments = await Payment.find({ cart: { $in: cartIds } });
      res.status(200).json(payments);
    } catch (error) {
       res.status(500).json({ message: error.message });
    }
  }

  // Sells Count
  static async getSellsCount(req, res) {
    try {
      const sellsCount = await Payment.countDocuments();  
      res.status(200).json({ sellsCount });              
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

    // Get All Payment Details with products
    static async getAllPaymentsWthProductDetails(req, res) {
    try {
      const payments = await Payment.find()
        .populate({
          path: 'cart',
          populate: {
            path: 'items.product',
            model: 'Product'
          }
        });

      res.status(200).json({ payments });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}


module.exports = PaymentController;
