# 👨‍🍳 Chef Manager Application - L'Étoile Gourmet

A modern, responsive, real-time Chef Web Application where chef managers can log in, view analytics, update existing menu items, add new dishes, toggle stock availability, and preview the live customer menu.

---

## 🚀 Quick Start (How to Run)

### Option 1: Open Directly in Browser (No setup required)
Simply double-click `index.html` or open `index.html` in any web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Run with Node.js Server
If Node.js is installed on your machine:
```bash
# Start the local server
npm start
# OR
node server.js
```
Then open your browser to [http://localhost:3000](http://localhost:3000).

---

## 🔑 Chef Manager Login Credentials

- **Email:** `chef@gourmet.com`
- **Password:** `chef123`

*(Note: Custom manager emails and passwords are also supported in demo mode.)*

---

## ✨ Features Included

1. **Chef Manager Authentication**:
   - Secure login & logout session management with `sessionStorage` / `localStorage`.
   - Dedicated Chef profile header display.

2. **Dish Creation (Add New Dish)**:
   - Form fields for Dish Name, Category (Starters, Mains, Desserts, Beverages, Chef Specials), Price ($), Preparation Time, Calories, Ingredients, Description, and Image URL.
   - Dietary Tag selection (Vegetarian, Vegan, Gluten-Free, Contains Nuts, Spicy).
   - Quick preset image buttons for rapid menu creation.
   - Real-time image URL preview.

3. **Update Existing Dishes**:
   - Edit modal pre-filled with all current properties of any dish.
   - Instantly update pricing, description, dietary badges, image, and availability.

4. **Quick Availability & Specials Switch**:
   - Inline toggle switch for instant "In Stock" vs "Out of Stock" status.
   - Feature star toggle to highlight items as "Chef Specials".

5. **Customer Digital Menu Preview**:
   - Switch mode to **"View Customer Menu"** to see how guests experience the live digital menu in real-time.
   - Real-time sync: when a chef marks an item "Out of Stock" or edits a price, it immediately reflects on the customer view.

6. **Search & Smart Filters**:
   - Search dishes by name or ingredients.
   - Filter by Category (Starters, Mains, Desserts, Beverages, Chef Specials) or Availability.
   - Sort by Name, Price (Low to High / High to Low), or Preparation Time.
   - Layout mode toggle: **Grid View** vs **Table View**.

7. **Data Persistence & Factory Reset**:
   - All custom dishes, edits, and availability updates persist in browser `localStorage`.
   - "Reset" button available to restore original sample gourmet menu at any time.

---

## 📁 Project Structure

```
CHEF APPLICATION/
├── index.html            # Main HTML application page
├── css/
│   └── style.css         # Custom responsive stylesheet (Dark Gold luxury theme)
├── js/
│   ├── dishes-data.js    # Data repository & initial sample menu
│   ├── auth.js           # Authentication & manager session handling
│   └── app.js            # Main UI controller & state management logic
├── server.js             # Lightweight Node.js local HTTP server
├── package.json          # Node project configuration
└── README.md             # Project documentation
```
