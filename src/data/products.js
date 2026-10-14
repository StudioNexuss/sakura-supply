export const PRODUCTS = [
  {
    id: "prod-1",
    name: "Pokemon 151 Special Ultra-Premium Collection Box",
    basePrice: 189.95,
    shippingCost: 0,
    category: "Trading Cards",
    isPreOrder: false,
    stockCount: 14,
    condition: "Brand New Factory Sealed",
    rating: 4.9,
    reviewCount: 38,
    images: [
      "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Ultra-Premium collector edition including metal cards, etched promo cards, playmat, and booster packs.",
    description: "Authentic Australian retail stock. Direct from distributor. Guaranteed unweighed, untampered, and stored in a temperature-controlled archival room in Melbourne. Comes with official seal intact.",
    itemSpecifics: {
      "Brand": "The Pokémon Company",
      "Set": "Scarlet & Violet - 151",
      "Game": "Pokémon TCG",
      "Language": "English",
      "Year Manufactured": "2023",
      "Configuration": "Box with 16 Booster Packs + Promos",
      "Country/Region of Manufacture": "USA / Japan"
    },
    specifications: [
      {
        id: "protectivePackaging",
        name: "Protective Packaging & Presentation",
        options: [
          { label: "Original Factory Seal (Standard)", priceModifier: 0, default: true },
          { label: "Heavy-Duty UV Acrylic Display Case", priceModifier: 16.00 },
          { label: "Archival Bubble Vault + Corner Protectors", priceModifier: 7.50 }
        ]
      },
      {
        id: "transitCover",
        name: "Transit Cover & Insurance",
        options: [
          { label: "Standard Tracked Parcel (Free)", priceModifier: 0, default: true },
          { label: "Signature on Delivery + Full Transit Value Insurance", priceModifier: 9.95 }
        ]
      }
    ]
  },
  {
    id: "prod-2",
    name: "One Piece Card Game: Romance Dawn Booster Box [OP-01] 1st Edition",
    basePrice: 349.00,
    shippingCost: 0,
    category: "Trading Cards",
    isPreOrder: false,
    stockCount: 5,
    condition: "Mint in Sealed Box (MISB)",
    rating: 5.0,
    reviewCount: 42,
    images: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Original Japanese/English print Romance Dawn 24-pack booster box. Complete factory wrap.",
    description: "Extremely scarce collector grade OP-01 Booster Box. 100% genuine guaranteed with Bandai security seal intact. Stored in collector smoke-free environment.",
    itemSpecifics: {
      "Brand": "Bandai",
      "Game": "One Piece CCG",
      "Edition": "1st Edition",
      "Language": "English",
      "Number of Packs": "24",
      "Year Manufactured": "2022"
    },
    specifications: [
      {
        id: "caseProtection",
        name: "Protective Display Case",
        options: [
          { label: "Includes Heavy-Duty UV Acrylic Case (+ $20.00)", priceModifier: 20.00, default: true },
          { label: "Factory Sealed without Hard Case", priceModifier: 0 }
        ]
      }
    ]
  },
  {
    id: "prod-3",
    name: "Cyberpunk 2077: Trauma Team Elite 1/6 Scale Polystone Statue",
    basePrice: 420.00,
    shippingCost: 0,
    category: "Collectibles & Statues",
    isPreOrder: true,
    expectedRelease: "Q4 2026 - Official Allocation",
    stockCount: 8,
    condition: "Brand New - Pre-Order Allocation",
    rating: 4.8,
    reviewCount: 19,
    images: [
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Official CD PROJEKT RED limited run statue. Hand-painted polystone with LED base.",
    description: "Guaranteed allocation upon official batch arrival. Pre-orders are locked in at the pre-order discount price and covered by our pre-order fulfillment guarantee.",
    itemSpecifics: {
      "Manufacturer": "PureArts / CDPR",
      "Scale": "1:6 Scale",
      "Material": "Polystone & ABS",
      "Character": "Trauma Team Unit Leader",
      "Release Window": "October - November 2026"
    },
    specifications: [
      {
        id: "edition",
        name: "Collector Edition Variant",
        options: [
          { label: "Standard Statue Box", priceModifier: 0, default: true },
          { label: "Collector Numbered Art Print Included", priceModifier: 35.00 }
        ]
      },
      {
        id: "shipperBox",
        name: "Outer Box Protection",
        options: [
          { label: "Includes Heavy Brown Shipper Box", priceModifier: 12.00, default: true },
          { label: "Standard Collector Packaging Only", priceModifier: 0 }
        ]
      }
    ]
  },
  {
    id: "prod-4",
    name: "Sony PlayStation 5 Pro 2TB 30th Anniversary Limited Edition Console",
    basePrice: 1599.00,
    shippingCost: 0,
    category: "Gaming Hardware",
    isPreOrder: false,
    stockCount: 3,
    condition: "Brand New in Box (Never Opened)",
    rating: 5.0,
    reviewCount: 27,
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Ultra-limited tribute console inspired by original PS1 aesthetics. Fully serialized.",
    description: "Extremely rare collector unit. Australian plug and local Sony Australia warranty. Box has zero shelf wear. Stored in protective cardboard outer sleeve in Melbourne.",
    itemSpecifics: {
      "Brand": "Sony Interactive Entertainment",
      "Platform": "Sony PlayStation 5 Pro",
      "Storage Capacity": "2 TB",
      "Region Code": "PAL (Australia / NZ)",
      "Edition": "30th Anniversary Limited Edition"
    },
    specifications: [
      {
        id: "outerPackaging",
        name: "Protective Packaging",
        options: [
          { label: "Double-Boxed with Archival Foam Corner Protectors", priceModifier: 25.00, default: true },
          { label: "Standard Courier Box Only", priceModifier: 0 }
        ]
      }
    ]
  },
  {
    id: "prod-5",
    name: "Star Wars: The Black Series Darth Vader 1:1 Scale Helmet (Imperial Edition)",
    basePrice: 229.50,
    shippingCost: 0,
    category: "Collectibles",
    isPreOrder: false,
    stockCount: 9,
    condition: "Brand New Sealed",
    rating: 4.7,
    reviewCount: 51,
    images: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Screen-accurate electronic helmet with interior sculpt and magnetic assembly sounds.",
    description: "Hasbro Pulse authentic line. Features multiple piece magnetic assembly, breathing sound effects, and display stand. Mint collector condition packaging.",
    itemSpecifics: {
      "Brand": "Hasbro",
      "Franchise": "Star Wars",
      "Scale": "1:1 Full Scale Wearable",
      "Features": "Electronic Sound FX, Magnetic Collars"
    },
    specifications: [
      {
        id: "boxProtection",
        name: "Box Protection & Vault",
        options: [
          { label: "Standard Factory Seal + Air Cushion Shell", priceModifier: 10.00, default: true },
          { label: "Standard Packaging", priceModifier: 0 }
        ]
      }
    ]
  },
  {
    id: "prod-6",
    name: "Elden Ring: Shadow of the Erdtree Messmer the Impaler 46cm Figure Box",
    basePrice: 479.00,
    shippingCost: 0,
    category: "Collectibles & Statues",
    isPreOrder: true,
    expectedRelease: "Next Month Re-Stock",
    stockCount: 6,
    condition: "Brand New - Pre-Order Batch #2",
    rating: 4.9,
    reviewCount: 31,
    images: [
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Exclusive 46cm Messmer centerpiece statue with 40-page hardcover artbook and steelbook.",
    description: "FromSoftware Bandai Namco certified collector edition. Includes commemorative certificate of authenticity and DLC art cards.",
    itemSpecifics: {
      "Brand": "Bandai Namco / FromSoftware",
      "Character": "Messmer the Impaler",
      "Height": "46 cm",
      "Type": "Statue & Collector Book Bundle"
    },
    specifications: [
      {
        id: "packagingSpecifics",
        name: "Packaging Specifics",
        options: [
          { label: "Factory Sealed with Acrylic Protective Shield (+ $12.00)", priceModifier: 12.00, default: true },
          { label: "Standard Sealed Box", priceModifier: 0 }
        ]
      }
    ]
  }
];
