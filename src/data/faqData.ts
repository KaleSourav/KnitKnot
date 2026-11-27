/**
 * Central Frequently Asked Questions dataset for Knots & Co.
 * Single source of truth used across Homepage FAQ, dedicated FAQ page (#/faq),
 * Product Details, Policies, B2B Gifting, and Nani story pages.
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  linkAction?: {
    label: string;
    target: 'returns' | 'shipping' | 'b2b' | 'shop';
  };
}

export interface FaqCategory {
  id: 'about' | 'shipping' | 'payments' | 'products' | 'returns' | 'bulk';
  title: string;
  shortLabel: string;
  description: string;
  items: FaqItem[];
}

export const FAQ_CONTACT = {
  email: 'knotsnco101@gmail.com',
  instagramHandle: '@knotsnco._',
  instagramUrl: 'https://www.instagram.com/knotsnco._/',
  website: 'knotsnco.com',
  tagline: 'Handmade with care, made to be kept.',
};

export const FAQ_HEADER = {
  title: 'Frequently Asked Questions',
  subtitle:
    'A little more about what we make, how we make it, and how your order gets to you.',
  welcomeNote:
    'Welcome to Knots & Co. If you have a question before placing an order, we hope you find the answer here. And if you need a little more help, our team is happy to hear from you.',
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'about',
    title: 'About Knots & Co',
    shortLabel: 'About Us',
    description: 'Who makes our crochet pieces, where they come from, and the materials behind every stitch.',
    items: [
      {
        id: 'what-is-knotsnco',
        question: 'What is Knots & Co?',
        answer:
          'Knots & Co is a handmade gifting brand creating crochet flowers, bouquets, plushies, accessories and thoughtful gifts for everyday moments and special occasions. We believe a gift should feel personal—and that the best ones are made to be kept.',
      },
      {
        id: 'where-made',
        question: 'Where are Knots & Co products made?',
        answer:
          'Our products are handmade in India by our network of women artisans. Each piece is crafted with care and brought together by the Knots & Co team before it makes its way to you.',
      },
      {
        id: 'who-makes',
        question: 'Who makes your products?',
        answer:
          'Our crochet pieces are made by skilled women artisans, including grandmothers and homemakers who are part of our maker community. Their skill and creativity are at the heart of what we do.',
      },
      {
        id: 'handmade-vs-machine',
        question: 'Are your products handmade or machine-made?',
        answer:
          'Our crochet products are handcrafted, stitch by stitch. Because they are made by hand rather than mass-produced, small differences in shape, stitching and finishing are natural.',
      },
      {
        id: 'materials-used',
        question: 'What materials do you use?',
        answer:
          'We primarily use cotton yarn for our crochet products. Materials and details can vary by design, so please check the individual product page for the specific details of the item you are interested in.',
      },
    ],
  },
  {
    id: 'shipping',
    title: 'Orders & Shipping',
    shortLabel: 'Shipping',
    description: 'Delivery timelines across India, tracking updates, and occasion scheduling.',
    items: [
      {
        id: 'delivery-timeline',
        question: 'How long will my order take to arrive?',
        answer:
          'Most orders are delivered within approximately 7–10 days. As our products are handmade, preparation time can vary depending on the product and order volume. If your order is time-sensitive, please contact us before placing it.',
        linkAction: { label: 'Read Shipping & Delivery Policy →', target: 'shipping' },
      },
      {
        id: 'india-delivery',
        question: 'Do you deliver across India?',
        answer:
          'Yes, we ship to serviceable pin codes across India. Enter your pin code at checkout to check whether delivery is available to your address.',
      },
      {
        id: 'tracking-details',
        question: 'Will I receive tracking details?',
        answer:
          'Yes. Once your order has been dispatched, we will share tracking details so you can follow its journey. Please allow some time for the courier tracking page to show its first update.',
      },
      {
        id: 'dispatch-time',
        question: 'Why can handmade orders take time to dispatch?',
        answer:
          'Each piece needs time to be crocheted, finished, checked and packed. We do not want to rush the hands and care that go into making your order.',
      },
      {
        id: 'change-address',
        question: 'Can I change my delivery address after placing an order?',
        answer:
          'Please contact us as soon as possible with your order number and the correct address. We can try to update it if the order has not already been processed or dispatched, but changes cannot be guaranteed.',
      },
      {
        id: 'specific-date',
        question: 'Can I request delivery by a particular date?',
        answer:
          "If you need an order for a birthday, wedding or another special occasion, please contact us before ordering. We will check the product's preparation time and delivery options and let you know what is possible.",
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments & Order Support',
    shortLabel: 'Payments & Help',
    description: 'Checkout, order confirmations, and reaching our support team.',
    items: [
      {
        id: 'how-to-order',
        question: 'How can I place an order?',
        answer:
          'You can browse our website, choose your product, add it to your cart and complete checkout using the payment options shown on the website.',
        linkAction: { label: 'Browse All Crafts →', target: 'shop' },
      },
      {
        id: 'order-confirmation',
        question: 'How do I know my order has been placed successfully?',
        answer:
          'After a successful checkout, you should receive an order confirmation on the contact details provided. If you do not receive one, please contact us with the name, phone number or email used at checkout.',
      },
      {
        id: 'order-question',
        question: 'What should I do if I have a question about my order?',
        answer:
          'Write to us at knotsnco101@gmail.com or message us on Instagram at @knotsnco._. Please include your order number so our team can help you faster.',
      },
    ],
  },
  {
    id: 'products',
    title: 'Products & Customisation',
    shortLabel: 'Customisation & Care',
    description: 'Custom bouquets, handmade character, flower longevity, and daily care.',
    items: [
      {
        id: 'customise-product',
        question: 'Can I customise a product?',
        answer:
          'We may be able to customise selected products, colours or combinations depending on the design and our production capacity. Please contact us with your idea before placing the order so we can confirm what is possible.',
      },
      {
        id: 'custom-bouquet',
        question: 'Can I get a customised crochet bouquet?',
        answer:
          'Yes, customised bouquet requests may be possible. Share your preferred flowers, colours, quantity and required date with our team. We will confirm the design and timeline before you place the order.',
      },
      {
        id: 'look-like-photo',
        question: 'Will my product look exactly like the photograph?',
        answer:
          'We make every effort to match the product photographs and description. Since each piece is handmade, slight variations in shape, size, colour placement and stitching may occur. These are part of the handmade character of the product.',
      },
      {
        id: 'do-flowers-last',
        question: 'Do crochet flowers last forever?',
        answer:
          'Crochet flowers do not wilt like fresh flowers and can be enjoyed for a long time with gentle care. Keep them away from excessive moisture, direct heat and rough handling to help them stay looking their best.',
      },
      {
        id: 'how-to-care',
        question: 'How should I care for my crochet product?',
        answer:
          'Keep your product in a clean, dry place. Gently remove dust when needed and avoid soaking, harsh detergents or rough scrubbing. For a specific product, contact us if you are unsure about the best way to clean it.',
      },
    ],
  },
  {
    id: 'returns',
    title: 'Returns, Exchanges & Damaged Orders',
    shortLabel: 'Returns',
    description: 'Damaged deliveries, handmade variation guidance, and order cancellations.',
    items: [
      {
        id: 'damaged-or-incorrect',
        question: 'What if my order arrives damaged or incorrect?',
        answer:
          'Please contact us as soon as possible after delivery at knotsnco101@gmail.com. Share your order number, clear photographs of the product and packaging, and a brief description of the issue. Our team will review it and guide you through the next steps.',
        linkAction: { label: 'Read Return & Exchange Policy →', target: 'returns' },
      },
      {
        id: 'return-or-exchange',
        question: 'Can I return or exchange an item?',
        answer:
          'Returns and exchanges are handled in accordance with our Returns & Refunds Policy. Please read that policy before placing an order, or contact our team if you need help understanding whether your order is eligible.',
        linkAction: { label: 'View Return Policy Details →', target: 'returns' },
      },
      {
        id: 'variations-not-defects',
        question: 'Are small handmade variations considered defects?',
        answer:
          'Small differences in stitching, shape or finishing are normal in handcrafted products and do not by themselves mean an item is defective. If you believe your product has a genuine quality issue, please send us photographs so our team can review it.',
      },
      {
        id: 'cancel-order',
        question: 'Can I cancel an order?',
        answer:
          "Please contact us as soon as possible if you need to cancel. Whether cancellation is possible depends on the order's production and dispatch status and the terms in our Cancellation Policy.",
      },
    ],
  },
  {
    id: 'bulk',
    title: 'Bulk, Wedding & Corporate Gifting',
    shortLabel: 'Bulk & Corporate',
    description: 'Events, weddings, custom corporate gifting, and advance timelines.',
    items: [
      {
        id: 'accept-bulk',
        question: 'Do you accept bulk orders?',
        answer:
          'Yes, we take enquiries for bulk gifting, events, weddings and special projects. Share the product or idea, quantity, budget range and required delivery date with our team so we can discuss the possibilities.',
        linkAction: { label: 'Request Bulk Quote →', target: 'b2b' },
      },
      {
        id: 'offer-corporate',
        question: 'Do you offer corporate gifting?',
        answer:
          'Yes. We work with businesses and brands on gifting requirements and customised projects. Please email knotsnco101@gmail.com with your brief, estimated quantity and timeline.',
        linkAction: { label: 'Visit B2B & Corporate Gifting →', target: 'b2b' },
      },
      {
        id: 'bulk-lead-time',
        question: 'How early should I place a bulk order?',
        answer:
          'Please get in touch as early as possible. Handmade bulk orders need additional planning and production time. Once we understand your quantity and requirements, our team can confirm a feasible timeline.',
      },
    ],
  },
];

export const ALL_FAQ_ITEMS = FAQ_CATEGORIES.flatMap((cat) =>
  cat.items.map((item) => ({ ...item, categoryId: cat.id, categoryTitle: cat.title }))
);
