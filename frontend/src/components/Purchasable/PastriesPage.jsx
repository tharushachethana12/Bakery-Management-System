import React from 'react';
import TopNavbar from '../TopNavbar';

const PastriesPage = () => {
  const pastries = [
    {
      id: 1,
      name: "Butter Croissants",
      description: "Classic French croissants with flaky, buttery layers and golden crisp exterior",
      price: "$4",
      image: "https://www.ilgraninobakery.com.au/wp-content/uploads/2019/07/Butter-Croissants.jpeg",
      category: "french",
      type: "viennoiserie",
      ingredients: ["Premium butter", "White flour", "Yeast", "Milk", "Sugar"]
    },
    {
      id: 2,
      name: "Cinnamon Rolls",
      description: "Soft, fluffy rolls swirled with cinnamon sugar and topped with cream cheese frosting",
      price: "$5",
      image: "https://images.unsplash.com/photo-1693407839053-04089e33b60d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1076",
      category: "sweet",
      type: "breakfast",
      ingredients: ["Cinnamon", "Brown sugar", "Cream cheese", "Flour", "Butter"]
    },
    {
      id: 3,
      name: "Fruit Danishes",
      description: "Buttery pastry filled with seasonal fruit preserves and cream cheese",
      price: "$4.50",
      image: "https://www.britishbakels.co.uk/wp-content/uploads/sites/2/2022/01/Bakels_147-Large.jpg",
      category: "danish",
      type: "breakfast",
      ingredients: ["Puff pastry", "Cream cheese", "Fruit preserves", "Powdered sugar"]
    },
    {
      id: 4,
      name: "Chocolate Éclairs",
      description: "Light choux pastry filled with vanilla custard and topped with dark chocolate glaze",
      price: "$5.50",
      image: "https://tatyanaseverydayfood.com/wp-content/uploads/2017/02/Chocolate-Coffee-Eclairs-1.jpg",
      category: "french",
      type: "dessert",
      ingredients: ["Choux pastry", "Vanilla custard", "Dark chocolate", "Whipped cream"]
    },
    {
      id: 5,
      name: "Sicilian Cannoli",
      description: "Crispy fried shells filled with sweet ricotta cream and chocolate chips",
      price: "$6",
      image: "https://orderisda.org/wp-content/uploads/2021/05/iStock-1309768205.jpg",
      category: "italian",
      type: "dessert",
      ingredients: ["Ricotta cheese", "Powdered sugar", "Chocolate chips", "Candied fruit"]
    },
    {
      id: 6,
      name: "Bread Pudding",
      description: "Comforting baked pudding made with day-old bread, raisins, and warm spices",
      price: "$4.50",
      image: "https://simplyhomecooked.com/wp-content/uploads/2021/11/bread-pudding-recipe-6.jpg",
      category: "comfort",
      type: "dessert",
      ingredients: ["Brioche bread", "Raisins", "Cinnamon", "Vanilla", "Eggs", "Milk"]
    },
    {
      id: 7,
      name: "Pain au Raisin",
      description: "Spiral pastry with vanilla custard and plump raisins, topped with sugar glaze",
      price: "$4.75",
      image: "https://mysecretconfections.com/wp-content/uploads/2020/03/DSC_0998_02-1-scaled.jpg",
      category: "french",
      type: "viennoiserie",
      ingredients: ["Laminated dough", "Vanilla custard", "Raisins", "Sugar glaze"]
    },
    {
      id: 8,
      name: "Apple Turnovers",
      description: "Flaky puff pastry filled with spiced apple compote, baked to golden perfection",
      price: "$4.25",
      image: "https://www.spendwithpennies.com/wp-content/uploads/2022/08/Easy-Apple-Turnovers-SpendWithPennies-8.jpg",
      category: "fruit",
      type: "breakfast",
      ingredients: ["Puff pastry", "Apple compote", "Cinnamon", "Sugar", "Butter"]
    }
  ];

  const [quantities, setQuantities] = React.useState({});

  const handleQuantityChange = (id, change) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + change)
    }));
  };

  const addToCart = (pastry) => {
    const quantity = quantities[pastry.id] || 1;
    alert(`Added ${quantity} ${pastry.name}(s) to cart!`);
    // Here you would typically update your cart state or context
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <TopNavbar currentPage="Pastries" />
      
      {/* Pastries Hero Section */}
      <section className="bg-amber-100 py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-6">Delicious Pastries</h1>
          <p className="text-xl text-amber-600 max-w-3xl mx-auto">
            Freshly baked pastries made with European butter and the finest ingredients. 
            Perfect for breakfast, dessert, or any time you crave something sweet.
          </p>
        </div>
      </section>

      {/* Pastries Grid - 4x2 layout */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastries.map((pastry) => (
              <div
                key={pastry.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col"
              >
                <img 
                  src={pastry.image} 
                  alt={pastry.name} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1555507036-ab794f27d2e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
                  }}
                />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-amber-800">{pastry.name}</h3>
                    <span className="text-md font-bold text-amber-600">{pastry.price}</span>
                  </div>
                  <p className="text-sm text-amber-600 mb-3 flex-1">{pastry.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-xs text-amber-500 bg-amber-100 px-2 py-1 rounded-full">
                        {pastry.category}
                      </span>
                      <span className="text-xs text-amber-500 bg-amber-100 px-2 py-1 rounded-full">
                        {pastry.type}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-amber-800 font-medium">Qty:</span>
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => handleQuantityChange(pastry.id, -1)}
                          className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center hover:bg-amber-300 text-sm"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-semibold text-sm">
                          {quantities[pastry.id] || 0}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(pastry.id, 1)}
                          className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center hover:bg-amber-300 text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => addToCart(pastry)}
                    className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition duration-300 font-semibold text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="bg-amber-200 py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Fresh Pastries Daily</h2>
          <p className="text-amber-700 max-w-2xl mx-auto">
            All our pastries are made fresh each morning using traditional techniques and premium ingredients. 
            Visit us early for the best selection!
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <div className="bg-amber-300 px-4 py-2 rounded-lg">
              <span className="text-amber-800 font-semibold">🍽️ Serving Size:</span>
              <span className="text-amber-700 ml-2">Individual portions</span>
            </div>
            <div className="bg-amber-300 px-4 py-2 rounded-lg">
              <span className="text-amber-800 font-semibold">⏰ Best Time:</span>
              <span className="text-amber-700 ml-2">Morning & Afternoon</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PastriesPage;