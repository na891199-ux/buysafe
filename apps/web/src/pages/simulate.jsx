import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const products = {
  marshall: {
    marketplace: "BuySafe Mock Store",
    asin: "B0BBYF2SXX",
    brand: "Marshall",
    title: "Marshall Acton III Bluetooth Home Speaker, Cream",
    rating: 4.7,
    reviewCount: 2384,
    basePrice: 279.99,
    listPrice: 329.99,
    shippingPrice: 18.5,
    originCountry: "China",
    seller: "BuySafe Mock Store",
    categoryPath: ["Electronics", "Home Audio", "Bluetooth Speakers"],
    colors: ["Cream", "Black", "Brown"],
    visualType: "speaker",
    specs: [
      ["Connectivity", "Bluetooth 5.2, 3.5 mm input"],
      ["Dimensions", "10.24 x 6.69 x 5.91 in"],
      ["Weight", "6.3 lb"],
      ["Power", "AC power cable"],
      ["Model", "Acton III"],
      ["Country of Origin", "China"],
    ],
    bullets: [
      "Rich Marshall signature sound in a compact home speaker body.",
      "Bluetooth pairing with a wide stereo soundstage for living rooms and desks.",
      "Cream finish with tactile brass control knobs and retro speaker grille.",
      "No battery included; designed for indoor AC-powered use.",
    ],
  },
  sony: {
    marketplace: "BuySafe Mock Store",
    asin: "B0DD8SHVZL",
    brand: "Sony",
    title: "Sony MDR-M1 Professional Reference Closed Monitor Headphones",
    rating: 4.7,
    reviewCount: 107,
    basePrice: 248.0,
    listPrice: 249.99,
    shippingPrice: 0,
    originCountry: "Thailand",
    seller: "BuySafe Mock Store",
    categoryPath: ["Electronics", "Headphones", "Studio Monitor Headphones"],
    colors: ["Black"],
    visualType: "headphones",
    specs: [
      ["Connectivity", "Wired, 3.5 mm and 6.3 mm adapter"],
      ["Frequency Response", "5 Hz - 80,000 Hz"],
      ["Ear Placement", "Over Ear"],
      ["Acoustic Structure", "Closed back"],
      ["Model", "MDR-M1"],
      ["Country of Origin", "Thailand"],
    ],
    bullets: [
      "Professional closed monitor headphones designed for studio production workflows.",
      "Ultra-wideband playback for detailed monitoring from low to high frequencies.",
      "Closed acoustic structure helps isolate sound while tracking or editing.",
      "Lightweight over-ear design with detachable audio cable for daily studio use.",
    ],
  },
  garmin: {
    marketplace: "BuySafe Mock Store",
    asin: "B0DBMM6S89",
    brand: "Garmin",
    title: "Garmin Forerunner 55 GPS Running Smartwatch (Black) Power Bundle",
    rating: 4.5,
    reviewCount: 688,
    basePrice: 189.0,
    listPrice: 249.99,
    shippingPrice: 0,
    originCountry: "Taiwan",
    seller: "BuySafe Mock Store",
    categoryPath: ["Electronics", "Wearable Technology", "GPS Running Watches"],
    colors: ["Black", "Whitestone", "Aqua"],
    visualType: "watch",
    specs: [
      ["Operating System", "Garmin OS"],
      ["Connectivity", "Bluetooth, ANT+, GPS"],
      ["Display Size", "1.04 in"],
      ["Battery Life", "Up to 2 weeks smartwatch mode"],
      ["Water Rating", "5 ATM"],
      ["Model", "Forerunner 55"],
      ["Country of Origin", "Taiwan"],
    ],
    bullets: [
      "Easy-to-use GPS running smartwatch for daily training and fitness tracking.",
      "Tracks time, distance, pace, speed, heart rate, and suggested workouts.",
      "Built-in sports apps support running, cycling, cardio, and more.",
      "Power bundle mock listing includes watch, charging cable, and documentation.",
    ],
  },
  ipad: {
    marketplace: "BuySafe Mock Store",
    asin: "B0DZ75TN5F",
    brand: "Apple",
    title:
      "Apple iPad 11-inch: A16 chip, Liquid Retina Display, 128GB, Wi-Fi 6, 12MP Cameras, Touch ID, All-Day Battery Life - Blue",
    rating: 4.8,
    reviewCount: 21930,
    basePrice: 299.0,
    listPrice: 349.0,
    shippingPrice: 0,
    originCountry: "China",
    seller: "BuySafe Mock Store",
    categoryPath: ["Electronics", "Computers & Tablets", "Tablet Computers"],
    colors: ["Blue", "Pink", "Silver", "Yellow"],
    visualType: "tablet",
    specs: [
      ["Chip", "A16"],
      ["Display", "11-inch Liquid Retina"],
      ["Storage", "128GB"],
      ["Connectivity", "Wi-Fi 6, Bluetooth, USB-C"],
      ["Cameras", "12MP Front, 12MP Back"],
      ["Security", "Touch ID"],
      ["Model", "MD4A4LL/A"],
      ["Country of Origin", "China"],
    ],
    bullets: [
      "11-inch iPad with A16 chip for everyday work, streaming, gaming, and creative tasks.",
      "Liquid Retina display with True Tone for comfortable viewing in different lighting.",
      "Wi-Fi 6, USB-C, 12MP front and back cameras, and Touch ID in the top button.",
      "Compatible with Apple Pencil USB-C and Magic Keyboard Folio accessories.",
    ],
  },
  magnesium: {
    marketplace: "BuySafe Mock Store",
    asin: "B07NWMVMT1",
    brand: "NOW",
    title:
      "NOW Supplements, Magnesium Glycinate 100 mg, Highly Absorbable Form, 180 Tablets",
    rating: 4.6,
    reviewCount: 5896,
    basePrice: 24.99,
    listPrice: 29.99,
    shippingPrice: 5.49,
    originCountry: "United States",
    seller: "BuySafe Mock Store",
    categoryPath: ["Health & Household", "Vitamins", "Magnesium Supplements"],
    colors: ["180 Tablets"],
    visualType: "bottle",
    specs: [
      ["Item Form", "Tablet"],
      ["Primary Supplement Type", "Magnesium"],
      ["Unit Count", "180 tablets"],
      ["Serving Size", "2 tablets"],
      ["Servings Per Container", "90"],
      ["Model", "1289"],
      ["Allergen Note", "Not manufactured with wheat, gluten, soy, milk, egg, fish, shellfish, tree nut or sesame"],
      ["Country of Origin", "United States"],
    ],
    bullets: [
      "Magnesium glycinate uses magnesium bound to glycine for a highly absorbable form.",
      "Supports healthy muscle, nerve, and heart functions as a dietary supplement.",
      "Suggested use: take 2 tablets 1 to 2 times daily with food.",
      "Bottle contains 180 tablets, enough for 90 servings at the standard serving size.",
    ],
  },
  omega3: {
    marketplace: "BuySafe Mock Store",
    asin: "B000SE5SY6",
    brand: "NOW Foods",
    title:
      "NOW Foods Supplements, Ultra Omega-3 Molecularly Distilled and Enteric Coated, 180 Softgels",
    rating: 4.7,
    reviewCount: 3580,
    basePrice: 31.99,
    listPrice: 39.99,
    shippingPrice: 4.99,
    originCountry: "United States",
    seller: "BuySafe Mock Store",
    categoryPath: ["Health & Household", "Vitamins", "Omega-3 Supplements"],
    colors: ["180 Softgels"],
    visualType: "softgels",
    specs: [
      ["Item Form", "Softgel"],
      ["Primary Supplement Type", "Omega-3 Fish Oil"],
      ["Unit Count", "180 softgels"],
      ["Serving Size", "1 softgel"],
      ["Coating", "Enteric coated"],
      ["Certifications", "Non-GMO, Kosher, GMP Quality Assured"],
      ["Package Weight", "1 lb"],
      ["Country of Origin", "United States"],
    ],
    bullets: [
      "Molecularly distilled omega-3 fish oil supplement for cardiovascular support.",
      "Enteric coated and odor-controlled softgels are designed to be easier to tolerate.",
      "Suggested use: take 1 softgel 1 to 2 times daily with food.",
      "Packaged in the USA by a family owned and operated company since 1968.",
    ],
  },
  calvinklein: {
    marketplace: "BuySafe Mock Store",
    asin: "B07PGR2Z62",
    brand: "Calvin Klein",
    title: "Calvin Klein Men's Cotton Classics 7-Pack Boxer Brief, 7 Black, Large",
    rating: 4.5,
    reviewCount: 11703,
    basePrice: 59.68,
    listPrice: 79.5,
    shippingPrice: 0,
    originCountry: "Imported",
    seller: "BuySafe Mock Store",
    categoryPath: ["Clothing", "Men", "Underwear", "Boxer Briefs"],
    colors: ["7 Black", "7 White", "Mixed Pack"],
    visualType: "apparel",
    specs: [
      ["Material", "Cotton"],
      ["Pack Count", "7 boxer briefs"],
      ["Size", "Large"],
      ["Color", "7 Black"],
      ["Fit", "Full rise, longer leg line"],
      ["Care", "Machine wash cold, tumble dry low"],
      ["Department", "Men"],
      ["Country of Origin", "Imported"],
    ],
    bullets: [
      "Cotton classic boxer briefs made with premium cotton yarns for breathability.",
      "Functional fly and contoured pouch provide support and everyday comfort.",
      "Soft flexible Calvin Klein logo waistband keeps its shape through repeated wear.",
      "Designed in the USA by Calvin Klein's NYC-based global design team.",
    ],
  },
};

const reviews = {
  marshall: [
    {
      name: "J. Kim",
      title: "Small body, serious sound",
      text: "The sound is warm and clear. I bought it for a desk setup and the cream color looks great.",
    },
    {
      name: "Alex P.",
      title: "Easy Bluetooth pairing",
      text: "Setup took less than a minute. The knobs feel solid and the bass is stronger than expected.",
    },
    {
      name: "Min S.",
      title: "Good mock product for testing",
      text: "This page has price, shipping, options, specs, seller, and review data in predictable places.",
    },
  ],
  sony: [
    {
      name: "Dana R.",
      title: "Clean detail for editing",
      text: "The closed-back fit is useful while recording, and the high-frequency detail is easy to monitor.",
    },
    {
      name: "Studio K.",
      title: "Comfortable for long sessions",
      text: "Light enough for long desk work. The detachable cable makes the page data easy to test too.",
    },
    {
      name: "Parser Test",
      title: "Predictable Sony product fields",
      text: "ASIN, model, origin, seller, specs, and price are exposed in stable DOM locations.",
    },
  ],
  garmin: [
    {
      name: "Runner A.",
      title: "Simple running watch data",
      text: "GPS, battery life, model number, and sports features are easy to locate on the page.",
    },
    {
      name: "H. Park",
      title: "Good for import test cases",
      text: "This mock listing includes wearable, Bluetooth, GPS, battery, and origin fields.",
    },
    {
      name: "Parser Test",
      title: "Stable Garmin fields",
      text: "ASIN, model, color, seller, price, specs, and quantity all use predictable attributes.",
    },
  ],
  ipad: [
    {
      name: "Creative User",
      title: "Bright display and fast setup",
      text: "The A16 chip feels quick, and the display is sharp enough for notes, video, and light editing.",
    },
    {
      name: "Daily Reader",
      title: "Good everyday tablet",
      text: "Useful for browsing, streaming, and travel. The blue color and 128GB option are easy to parse.",
    },
    {
      name: "Parser Test",
      title: "Tablet fields are predictable",
      text: "Storage, connectivity, model, cameras, price, ASIN, seller, and selected color are exposed clearly.",
    },
  ],
  magnesium: [
    {
      name: "Supplement Buyer",
      title: "Clear supplement facts",
      text: "Serving size, unit count, allergen notes, and supplement type are easy to find.",
    },
    {
      name: "Health Parser",
      title: "Good regulated-item mock",
      text: "This page is useful for testing health supplement category and import checks.",
    },
    {
      name: "Parser Test",
      title: "Stable NOW magnesium fields",
      text: "ASIN, dosage, tablet count, seller, origin, and price use predictable DOM attributes.",
    },
  ],
  omega3: [
    {
      name: "Daily Routine",
      title: "Useful softgel listing",
      text: "The page exposes softgel count, coating, certification, and supplement category fields.",
    },
    {
      name: "Import Tester",
      title: "Good omega-3 test case",
      text: "Fish oil supplement text helps test food and health import warning logic.",
    },
    {
      name: "Parser Test",
      title: "NOW omega data is consistent",
      text: "Price, ASIN, serving size, unit count, origin, and category are stable on the page.",
    },
  ],
  calvinklein: [
    {
      name: "Style Buyer",
      title: "Simple apparel mock",
      text: "Size, color, pack count, care instructions, and material are straightforward to parse.",
    },
    {
      name: "Commerce QA",
      title: "Good clothing variant test",
      text: "The listing includes apparel-specific fields like size, color, fit, and department.",
    },
    {
      name: "Parser Test",
      title: "Stable Calvin Klein fields",
      text: "Brand, ASIN, price, pack count, color, seller, and reviews are in predictable places.",
    },
  ],
};

const productUrls = {
  marshall: "https://www.amazon.com/Marshall-Acton-Bluetooth-Speaker-Cream/dp/B0BBYF2SXX",
  sony: "https://www.amazon.com/-/ko/dp/B0DD8SHVZL",
  garmin: "https://www.amazon.com/dp/B0DBMM6S89",
  ipad: "https://www.amazon.com/-/ko/dp/B0DZ75TN5F",
  magnesium: "https://www.amazon.com/-/ko/dp/B07NWMVMT1",
  omega3: "https://www.amazon.com/-/ko/dp/B000SE5SY6",
  calvinklein: "https://www.amazon.com/-/ko/dp/B07PGR2Z62",
};

const formatUsd = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const ProductVisual = ({ product, color }) => {
  if (product.visualType === "headphones") {
    return (
      <div className="mock-headphones" aria-label="Sony headphones mock image">
        <div className="mock-headband" />
        <div className="mock-earcup left" />
        <div className="mock-earcup right" />
        <span>Sony</span>
      </div>
    );
  }

  if (product.visualType === "watch") {
    return (
      <div className={`mock-watch ${color.toLowerCase()}`} aria-label="Garmin watch mock image">
        <div className="mock-watch-strap top" />
        <div className="mock-watch-face">
          <span>Garmin</span>
          <strong>08:55</strong>
          <small>RUN READY</small>
        </div>
        <div className="mock-watch-strap bottom" />
      </div>
    );
  }

  if (product.visualType === "tablet") {
    return (
      <div className={`mock-tablet ${color.toLowerCase()}`} aria-label="Apple iPad mock image">
        <div className="mock-tablet-screen">
          <span>iPad</span>
          <strong>A16</strong>
          <small>Liquid Retina</small>
        </div>
      </div>
    );
  }

  if (product.visualType === "bottle" || product.visualType === "softgels") {
    return (
      <div
        className={`mock-supplement ${product.visualType}`}
        aria-label={`${product.brand} supplement mock image`}
      >
        <div className="mock-bottle-cap" />
        <div className="mock-bottle-label">
          <span>{product.brand}</span>
          <strong>{product.visualType === "softgels" ? "Ultra Omega-3" : "Magnesium"}</strong>
          <small>{product.colors[0]}</small>
        </div>
      </div>
    );
  }

  if (product.visualType === "apparel") {
    return (
      <div className="mock-apparel" aria-label="Calvin Klein apparel mock image">
        <div className="mock-waistband">Calvin Klein</div>
        <div className="mock-briefs">
          <span>7-Pack</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`mock-speaker ${color.toLowerCase()}`}>
      <div className="mock-speaker-grille" />
      <span>Marshall</span>
    </div>
  );
};

const ProductPage = () => {
  const { productSlug } = useParams();
  const normalizedSlug = productSlug?.toLowerCase();
  const activeSlug = products[normalizedSlug] ? normalizedSlug : "marshall";
  const product = products[activeSlug];
  const [color, setColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const subtotal = useMemo(
    () => product.basePrice * quantity + product.shippingPrice,
    [product, quantity],
  );

  const mockPayload = {
    sourceUrl: productUrls[activeSlug],
    product,
    selectedOption: color,
    quantity,
    estimatedTotal: subtotal,
  };

  return (
    <main className="mock-product-page">
      <div className="mock-product-tabs">
        <Link className={activeSlug === "marshall" ? "active" : ""} to="/simulate/Marshall">
          Marshall speaker
        </Link>
        <Link className={activeSlug === "sony" ? "active" : ""} to="/simulate/Sony">
          Sony headphones
        </Link>
        <Link className={activeSlug === "garmin" ? "active" : ""} to="/simulate/Garmin">
          Garmin watch
        </Link>
        <Link className={activeSlug === "ipad" ? "active" : ""} to="/simulate/iPad">
          Apple iPad
        </Link>
        <Link className={activeSlug === "magnesium" ? "active" : ""} to="/simulate/Magnesium">
          NOW Magnesium
        </Link>
        <Link className={activeSlug === "omega3" ? "active" : ""} to="/simulate/Omega3">
          NOW Omega-3
        </Link>
        <Link className={activeSlug === "calvinklein" ? "active" : ""} to="/simulate/CalvinKlein">
          Calvin Klein
        </Link>
      </div>

      <nav className="mock-breadcrumb" aria-label="breadcrumb">
        {product.categoryPath.map((item, index) => (
          <React.Fragment key={item}>
            <span>{item}</span>
            {index < product.categoryPath.length - 1 && <b>/</b>}
          </React.Fragment>
        ))}
      </nav>

      <section
        className="mock-product-layout"
        data-testid="mock-product"
        data-product-id={product.asin}
      >
        <div className="mock-gallery" aria-label="product images">
          <div className="mock-main-image">
            <ProductVisual product={product} color={color} />
          </div>
          <div className="mock-thumbnails">
            <button aria-label="front view" className="active">
              Front
            </button>
            <button aria-label="side view">Side</button>
            <button aria-label="detail view">Detail</button>
          </div>
        </div>

        <article className="mock-product-info">
          <p className="mock-store-name">{product.marketplace}</p>
          <h2 data-field="product-title">{product.title}</h2>
          <a href="#brand" className="mock-brand" data-field="brand">
            Visit the {product.brand} Store
          </a>

          <div className="mock-rating" data-field="rating">
            <strong>{product.rating}</strong>
            <span aria-label={`${product.rating} out of 5 stars`}>★★★★★</span>
            <a href="#reviews">{product.reviewCount.toLocaleString()} ratings</a>
          </div>

          <hr />

          <div className="mock-price-block">
            <span className="mock-deal">Limited time deal</span>
            <p className="mock-price" data-field="price">
              {formatUsd(product.basePrice)}
            </p>
            <p className="mock-list-price">
              List Price: <s>{formatUsd(product.listPrice)}</s>
            </p>
            <p className="mock-fees">
              Shipping & import estimate shown at checkout. Ships from United
              States.
            </p>
          </div>

          <div className="mock-option-group">
            <p>
              Color: <strong data-field="selected-option">{color}</strong>
            </p>
            <div className="mock-swatches">
              {product.colors.map((item) => (
                <button
                  key={item}
                  className={color === item ? "active" : ""}
                  onClick={() => setColor(item)}
                  data-option-value={item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <section className="mock-about">
            <h3>About this item</h3>
            <ul>
              {product.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="mock-buy-box">
          <p className="mock-buy-price">{formatUsd(product.basePrice)}</p>
          <p className="mock-delivery">
            Delivery estimate: <strong>Apr 25 - Apr 29</strong>
          </p>
          <p className="mock-stock">In Stock</p>

          <label>
            Quantity
            <select
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              data-field="quantity"
            >
              {[1, 2, 3, 4, 5].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <button className="mock-cart-button">Add to Cart</button>
          <button className="mock-buy-button">Buy Now</button>

          <dl className="mock-shipping-facts">
            <div>
              <dt>Ships from</dt>
              <dd>Amazon Mock Fulfillment</dd>
            </div>
            <div>
              <dt>Sold by</dt>
              <dd data-field="seller">{product.seller}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd data-field="shipping-price">
                {formatUsd(product.shippingPrice)}
              </dd>
            </div>
            <div>
              <dt>Estimated total</dt>
              <dd data-field="estimated-total">{formatUsd(subtotal)}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="mock-section-grid">
        <article className="mock-card">
          <h3>Product information</h3>
          <table>
            <tbody>
              {product.specs.map(([label, value]) => (
                <tr key={label}>
                  <th>{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
              <tr>
                <th>ASIN</th>
                <td data-field="asin">{product.asin}</td>
              </tr>
            </tbody>
          </table>
        </article>

        <article className="mock-card">
          <h3>Technical data for parser tests</h3>
          <pre>{JSON.stringify(mockPayload, null, 2)}</pre>
        </article>
      </section>

      <section className="mock-reviews" id="reviews">
        <h3>Customer reviews</h3>
        <div>
          {reviews[activeSlug].map((review) => (
            <article className="mock-review" key={review.name}>
              <strong>{review.name}</strong>
              <span>★★★★★</span>
              <h4>{review.title}</h4>
              <p>{review.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ProductPage;

