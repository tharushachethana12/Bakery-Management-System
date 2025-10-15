import React from 'react';
import TopNavbar from '../TopNavbar';

const BreadsPage = () => {
  const breads = [
    {
      id: 1,
      name: "Sourdough Bread",
      description: "Traditional sourdough with crispy crust and soft interior, fermented for 24 hours for optimal flavor",
      price: "$8",
      image: "https://www.allrecipes.com/thmb/GPqr9kEn84Kj00QL56aObbv1ci0=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/260540-Chef-Johns-Sourdough-Bread-DDMFS-004-4x3-6791a75a5d804ec28424d04756054c5b.jpg",
      category: "artisan",
      weight: "500g",
      ingredients: ["Organic flour", "Water", "Salt", "Sourdough starter"]
    },
    {
      id: 2,
      name: "Whole Wheat Bread",
      description: "Healthy whole wheat bread packed with nutrients and fiber, perfect for sandwiches",
      price: "$7",
      image: "https://images.getrecipekit.com/20230728144103-md-100-whole-wheat-bread-11-1-of-1-scaled.jpg?aspect_ratio=4:3&quality=90&",
      category: "wholegrain",
      weight: "450g",
      ingredients: ["Whole wheat flour", "Water", "Honey", "Yeast", "Salt"]
    },
    {
      id: 3,
      name: "Baguette",
      description: "Classic French baguette with golden crispy crust and soft, airy interior",
      price: "$6",
      image: "https://www.allrecipes.com/thmb/J96_s7wY7k0vQtMZ9l5_XQZn4cg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/7028-french-baguettes-DDMFS-4x3-a3f7e7cc53654c8db2c9919148e7c915.jpg",
      category: "french",
      weight: "250g",
      ingredients: ["White flour", "Water", "Yeast", "Salt"]
    },
    {
      id: 4,
      name: "Ciabatta Bread",
      description: "Italian ciabatta with olive oil and characteristic airy texture, perfect for bruschetta",
      price: "$9",
      image: "https://sallysbakingaddiction.com/wp-content/uploads/2025/01/ciabatta.jpg",
      category: "italian",
      weight: "400g",
      ingredients: ["White flour", "Water", "Olive oil", "Yeast", "Salt"]
    },
    {
      id: 5,
      name: "Rye Bread",
      description: "Hearty rye bread with rich flavor and dense texture, great with soups and stews",
      price: "$8",
      image: "https://houseofnasheats.com/wp-content/uploads/2018/10/Easy-Homemade-Rye-Bread-10-500x500.jpg",
      category: "rye",
      weight: "600g",
      ingredients: ["Rye flour", "Wheat flour", "Water", "Caraway seeds", "Salt"]
    },
    {
      id: 6,
      name: "Brioche",
      description: "Buttery brioche with soft, tender crumb, perfect for French toast or breakfast",
      price: "$10",
      image: "https://images.food52.com/BTEgY1jPbMd1qoZOXvK7VHSVYd8=/5f629b46-2fb0-415e-b5d2-b7de56685e16--2023-0228_salted-butter-brioche_final_3x2_mj-kroeger-331.jpg",
      category: "sweet",
      weight: "350g",
      ingredients: ["White flour", "Butter", "Eggs", "Milk", "Sugar", "Yeast"]
    },
    {
      id: 7,
      name: "Multigrain Bread",
      description: "Nutritious multigrain bread with seeds and grains for extra texture and flavor",
      price: "$9",
      image: "https://www.lafarmbakery.com/sites/default/files/styles/bread_image/public/multigrainLG.jpg?itok=A1eVoPRI",
      category: "multigrain",
      weight: "550g",
      ingredients: ["Multigrain flour", "Sunflower seeds", "Flax seeds", "Oats", "Honey"]
    },
    {
      id: 8,
      name: "Focaccia",
      description: "Italian flatbread topped with rosemary and sea salt, perfect for dipping",
      price: "$11",
      image: "https://cdn.loveandlemons.com/wp-content/uploads/2023/12/foccacia-recipe.jpg",
      category: "italian",
      weight: "500g",
      ingredients: ["White flour", "Olive oil", "Rosemary", "Sea salt", "Yeast"]
    }
  ];

  const [quantities, setQuantities] = React.useState({});

  const handleQuantityChange = (id, change) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + change)
    }));
  };

  const addToCart = (bread) => {
    const quantity = quantities[bread.id] || 1;
    alert(`Added ${quantity} ${bread.name}(s) to cart!`);
    // Here you would typically update your cart state or context
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <TopNavbar currentPage="Breads" />
      
      {/* Breads Hero Section */}
      <section className="bg-amber-100 py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-6">Freshly Baked Breads</h1>
          <p className="text-xl text-amber-600 max-w-3xl mx-auto">
            Daily baked artisan breads using traditional methods and the finest organic ingredients. 
            Each loaf is crafted with care and baked to perfection.
          </p>
        </div>
      </section>

      {/* Breads Grid - 4x2 layout */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {breads.map((bread) => (
              <div
                key={bread.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col"
              >
                <img 
                  src={bread.image} 
                  alt={bread.name} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
                  }}
                />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-amber-800">{bread.name}</h3>
                    <span className="text-md font-bold text-amber-600">{bread.price}</span>
                  </div>
                  <p className="text-sm text-amber-600 mb-3 flex-1">{bread.description}</p>
                  
                  <div className="mb-3">
                    <p className="text-sm text-amber-500 mb-2">
                      <strong>Weight:</strong> {bread.weight}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-xs text-amber-500 bg-amber-100 px-2 py-1 rounded-full">
                        {bread.category}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-amber-800 font-medium">Qty:</span>
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => handleQuantityChange(bread.id, -1)}
                          className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center hover:bg-amber-300 text-sm"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-semibold text-sm">
                          {quantities[bread.id] || 0}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(bread.id, 1)}
                          className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center hover:bg-amber-300 text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => addToCart(bread)}
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
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Artisan Bread Quality</h2>
          <p className="text-amber-700 max-w-2xl mx-auto">
            All our breads are crafted using traditional baking methods, slow fermentation, 
            and the highest quality organic ingredients for exceptional flavor and texture.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="bg-amber-300 px-4 py-2 rounded-lg">
              <span className="text-amber-800 font-semibold">🥖 Fresh Daily:</span>
              <span className="text-amber-700 ml-2">Baked every morning</span>
            </div>
            <div className="bg-amber-300 px-4 py-2 rounded-lg">
              <span className="text-amber-800 font-semibold">🌱 Organic:</span>
              <span className="text-amber-700 ml-2">Premium ingredients</span>
            </div>
            <div className="bg-amber-300 px-4 py-2 rounded-lg">
              <span className="text-amber-800 font-semibold">⏲️ Slow Fermented:</span>
              <span className="text-amber-700 ml-2">Enhanced flavor</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BreadsPage;