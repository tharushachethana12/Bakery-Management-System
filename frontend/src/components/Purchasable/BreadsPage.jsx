import React from 'react';

const BreadsPage = () => {
  const breads = [
    {
      id: 1,
      name: "Sourdough Bread",
      description: "Traditional sourdough with crispy crust and soft interior, fermented for 24 hours for optimal flavor",
      price: "$8",
      image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "artisan",
      weight: "500g",
      ingredients: ["Organic flour", "Water", "Salt", "Sourdough starter"]
    },
    {
      id: 2,
      name: "Whole Wheat Bread",
      description: "Healthy whole wheat bread packed with nutrients and fiber, perfect for sandwiches",
      price: "$7",
      image: "https://images.unsplash.com/photo-1598373182131-37df6a2beca4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
      category: "wholegrain",
      weight: "450g",
      ingredients: ["Whole wheat flour", "Water", "Honey", "Yeast", "Salt"]
    },
    {
      id: 3,
      name: "Baguette",
      description: "Classic French baguette with golden crispy crust and soft, airy interior",
      price: "$6",
      image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "french",
      weight: "250g",
      ingredients: ["White flour", "Water", "Yeast", "Salt"]
    },
    {
      id: 4,
      name: "Ciabatta Bread",
      description: "Italian ciabatta with olive oil and characteristic airy texture, perfect for bruschetta",
      price: "$9",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
      category: "italian",
      weight: "400g",
      ingredients: ["White flour", "Water", "Olive oil", "Yeast", "Salt"]
    },
    {
      id: 5,
      name: "Rye Bread",
      description: "Hearty rye bread with rich flavor and dense texture, great with soups and stews",
      price: "$8",
      image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "rye",
      weight: "600g",
      ingredients: ["Rye flour", "Wheat flour", "Water", "Caraway seeds", "Salt"]
    },
    {
      id: 6,
      name: "Brioche",
      description: "Buttery brioche with soft, tender crumb, perfect for French toast or breakfast",
      price: "$10",
      image: "https://images.unsplash.com/photo-1555507036-ab794f24d6c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "sweet",
      weight: "350g",
      ingredients: ["White flour", "Butter", "Eggs", "Milk", "Sugar", "Yeast"]
    },
    {
      id: 7,
      name: "Multigrain Bread",
      description: "Nutritious multigrain bread with seeds and grains for extra texture and flavor",
      price: "$9",
      image: "https://images.unsplash.com/photo-1534620808146-d33bb39128b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1138&q=80",
      category: "multigrain",
      weight: "550g",
      ingredients: ["Multigrain flour", "Sunflower seeds", "Flax seeds", "Oats", "Honey"]
    },
    {
      id: 8,
      name: "Focaccia",
      description: "Italian flatbread topped with rosemary and sea salt, perfect for dipping",
      price: "$11",
      image: "https://images.unsplash.com/photo-1598373182131-37df6a2beca4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
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
      {/* Header */}
      <header className="bg-amber-800 text-amber-50 py-4 px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-amber-600 flex items-center justify-center mr-3">
              <span className="text-xl">🍞</span>
            </div>
            <h1 className="text-xl font-bold">Sweet Dreams Bakery - Breads</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="hover:text-amber-200 transition-colors">Home</a>
            <a href="/cakes" className="hover:text-amber-200 transition-colors">Cakes</a>
            <a href="/breads" className="hover:text-amber-200 transition-colors border-b-2">Breads</a>
            <a href="/about" className="hover:text-amber-200 transition-colors">About</a>
          </nav>
        </div>
      </header>

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

      {/* Breads Grid */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {breads.map((bread) => (
              <div
                key={bread.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                <img 
                  src={bread.image} 
                  alt={bread.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-amber-800">{bread.name}</h3>
                    <span className="text-lg font-bold text-amber-600">{bread.price}</span>
                  </div>
                  <p className="text-amber-600 mb-3">{bread.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-sm text-amber-500 mb-2">
                      <strong>Weight:</strong> {bread.weight}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="text-xs text-amber-500 bg-amber-100 px-2 py-1 rounded-full">
                        {bread.category}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-amber-800 font-medium">Quantity:</span>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleQuantityChange(bread.id, -1)}
                          className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center hover:bg-amber-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {quantities[bread.id] || 0}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(bread.id, 1)}
                          className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center hover:bg-amber-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => addToCart(bread)}
                    className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition duration-300 font-semibold"
                  >
                    Add to Cart - {bread.price}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BreadsPage;