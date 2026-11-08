/**
 * Initial sample menu data and storage manager for Chef Management System.
 */

const INITIAL_DISHES = [
  {
    id: "dish-1",
    name: "Truffle & Wild Mushroom Risotto",
    category: "Mains",
    price: 24.50,
    description: "Arborio rice cooked with black summer truffle, wild chanterelles, parmesan reggiano, and fresh thyme finish.",
    ingredients: ["Arborio Rice", "Black Truffle", "Chanterelle Mushrooms", "Parmesan", "White Wine", "Fresh Thyme"],
    dietary: ["Vegetarian", "Gluten-Free"],
    prepTime: 25,
    calories: 580,
    image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80",
    available: true,
    featured: true
  },
  {
    id: "dish-2",
    name: "Pan-Seared Wagyu Ribeye",
    category: "Mains",
    price: 48.00,
    description: "A5 Wagyu beef served with garlic herb butter, roasted heirloom carrots, and bone marrow jus.",
    ingredients: ["Wagyu Beef", "Garlic Butter", "Heirloom Carrots", "Rosemary", "Bone Marrow Reduction"],
    dietary: ["Gluten-Free"],
    prepTime: 20,
    calories: 850,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    available: true,
    featured: true
  },
  {
    id: "dish-3",
    name: "Artisanal Burrata & Heirloom Tomatoes",
    category: "Starters",
    price: 16.00,
    description: "Fresh Puglia burrata, aged balsamic reduction, roasted pine nuts, and organic basil oil.",
    ingredients: ["Burrata Cheese", "Heirloom Tomatoes", "Balsamic Vinegar", "Pine Nuts", "Fresh Basil"],
    dietary: ["Vegetarian", "Gluten-Free"],
    prepTime: 10,
    calories: 420,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=800&q=80",
    available: true,
    featured: false
  },
  {
    id: "dish-4",
    name: "Crispy Calamari Fritti",
    category: "Starters",
    price: 14.50,
    description: "Lightly battered squids with smoked paprika aioli and fresh lemon wedges.",
    ingredients: ["Squid", "Paprika Aioli", "Lemon", "Garlic Powder", "Sea Salt"],
    dietary: [],
    prepTime: 12,
    calories: 390,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
    available: true,
    featured: false
  },
  {
    id: "dish-5",
    name: "Valrhona Dark Chocolate Soufflé",
    category: "Desserts",
    price: 13.00,
    description: "70% Valrhona dark chocolate warm soufflé served with house-made Madagascar vanilla bean gelato.",
    ingredients: ["Valrhona Chocolate", "Organic Eggs", "Vanilla Gelato", "Powdered Sugar"],
    dietary: ["Vegetarian"],
    prepTime: 18,
    calories: 460,
    image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80",
    available: true,
    featured: true
  },
  {
    id: "dish-6",
    name: "Classic Pistachio Tiramisu",
    category: "Desserts",
    price: 11.50,
    description: "Espresso soaked ladyfingers layered with Sicilian pistachio cream and mascarpone cheese.",
    ingredients: ["Ladyfingers", "Espresso", "Pistachio Paste", "Mascarpone", "Cocoa Powder"],
    dietary: ["Vegetarian", "Contains Nuts"],
    prepTime: 10,
    calories: 510,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
    available: false,
    featured: false
  },
  {
    id: "dish-7",
    name: "Smoked Rosemary Old Fashioned",
    category: "Beverages",
    price: 15.00,
    description: "Bourbon whisky infused with smoked rosemary stem, Angostura bitters, and orange peel zest.",
    ingredients: ["Bourbon", "Rosemary", "Angostura Bitters", "Simple Syrup", "Orange Peel"],
    dietary: ["Vegan", "Gluten-Free"],
    prepTime: 5,
    calories: 180,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    available: true,
    featured: false
  },
  {
    id: "dish-8",
    name: "Pan-Seared Atlantic Salmon",
    category: "Specials",
    price: 29.00,
    description: "Crispy skin Atlantic salmon over saffron cauliflower puree and grilled asparagus tips.",
    ingredients: ["Atlantic Salmon", "Saffron", "Cauliflower", "Asparagus", "Dill Butter"],
    dietary: ["Gluten-Free"],
    prepTime: 22,
    calories: 620,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    available: true,
    featured: true
  }
];

// Preset Food Images for Quick Selection when Creating / Editing Dishes
const PRESET_IMAGES = [
  { name: "Steak / Meat", url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" },
  { name: "Risotto / Rice", url: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80" },
  { name: "Salmon / Seafood", url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80" },
  { name: "Salad / Burrata", url: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=800&q=80" },
  { name: "Pasta", url: "https://images.unsplash.com/photo-1621996346565-e3d5d6281270?auto=format&fit=crop&w=800&q=80" },
  { name: "Dessert / Cake", url: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80" },
  { name: "Cocktail / Drink", url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80" },
  { name: "Burger / Bistro", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" }
];

const STORAGE_KEY = "gourmet_chef_dishes_v1";

/**
 * Dish Repository helper
 */
const DishRepository = {
  getDishes() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      this.saveDishes(INITIAL_DISHES);
      return INITIAL_DISHES;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing stored dishes:", e);
      return INITIAL_DISHES;
    }
  },

  saveDishes(dishes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
  },

  getDishById(id) {
    const dishes = this.getDishes();
    return dishes.find(d => d.id === id);
  },

  addDish(dishData) {
    const dishes = this.getDishes();
    const newDish = {
      ...dishData,
      id: "dish-" + Date.now(),
      available: dishData.available !== undefined ? dishData.available : true,
      featured: dishData.featured !== undefined ? dishData.featured : false
    };
    dishes.unshift(newDish);
    this.saveDishes(dishes);
    return newDish;
  },

  updateDish(id, updatedFields) {
    const dishes = this.getDishes();
    const index = dishes.findIndex(d => d.id === id);
    if (index === -1) return null;

    dishes[index] = { ...dishes[index], ...updatedFields };
    this.saveDishes(dishes);
    return dishes[index];
  },

  deleteDish(id) {
    let dishes = this.getDishes();
    dishes = dishes.filter(d => d.id !== id);
    this.saveDishes(dishes);
    return true;
  },

  toggleAvailability(id) {
    const dish = this.getDishById(id);
    if (dish) {
      return this.updateDish(id, { available: !dish.available });
    }
    return null;
  },

  toggleFeatured(id) {
    const dish = this.getDishById(id);
    if (dish) {
      return this.updateDish(id, { featured: !dish.featured });
    }
    return null;
  },

  resetToDefaults() {
    this.saveDishes(INITIAL_DISHES);
    return INITIAL_DISHES;
  }
};
