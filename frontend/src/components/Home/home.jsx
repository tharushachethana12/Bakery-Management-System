import React, { useState, useEffect } from 'react';

const BakeryHome = () => {
  // State for cart items count
  const [cartItems, setCartItems] = useState(3);
  
  // State for mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Slideshow data
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1555507036-ab794f24d6c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      title: "Freshly Baked Bread",
      description: "Our artisan bread is made daily with organic flour and natural sourdough starter for that perfect crust and flavor.",
      cta: "Explore Our Breads"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      title: "Delicious Pastries",
      description: "From flaky croissants to decadent danishes, our pastries are crafted with European butter and the finest ingredients.",
      cta: "View Pastries"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1089&q=80",
      title: "Custom Cakes",
      description: "Celebrate your special occasions with our beautifully designed custom cakes, tailored to your taste and theme.",
      cta: "Order a Cake"
    }
  ];

  // Specialties blocks data
  const specialties = [
    {
      id: 1,
      title: "Customize Cake",
      description: "Design your dream cake with our easy customization tool",
      image: "https://images.unsplash.com/photo-1574085732737-67a1017ed2d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      color: "bg-amber-500",
      size: "large"
    },
    {
      id: 2,
      title: "Bread Section",
      description: "Freshly baked artisan breads daily",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      color: "bg-amber-400",
      size: "small"
    },
    {
      id: 3,
      title: "Order History",
      description: "Track your previous orders and favorites",
      image: "https://images.unsplash.com/photo-1564436872-f6d81182df59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80",
      color: "bg-amber-600",
      size: "small"
    },
    {
      id: 4,
      title: "Drinks & Beverages",
      description: "Complement your treats with our specialty drinks",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      color: "bg-amber-300",
      size: "medium"
    },
    {
      id: 5,
      title: "Customer Feedback",
      description: "See what our customers love about us",
      image: "https://images.unsplash.com/photo-1581287053822-fd7bf4f4b358?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=701&q=80",
      color: "bg-amber-200",
      size: "medium"
    },
    {
      id: 6,
      title: "About Us",
      description: "Learn about our bakery's story and values",
      image: "https://images.unsplash.com/photo-1608190003443-86b12a5b5bb7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      color: "bg-amber-700",
      size: "large"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  // Scroll animation styles
  const sectionAnimation = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-section {
      animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .section-hidden {
      opacity: 0;
      transform: translateY(50px);
    }
  `;

  // Intersection Observer for scroll animations
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = sectionAnimation;
    document.head.appendChild(styleSheet);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-section');
            entry.target.classList.remove('section-hidden');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all sections except hero
    const sections = document.querySelectorAll('section:not(:first-child)');
    sections.forEach((section) => {
      section.classList.add('section-hidden');
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-amber-800 text-amber-50 py-4 px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Name */}
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-amber-600 flex items-center justify-center mr-3">
              <span className="text-xl">🍞</span>
            </div>
            <h1 className="text-xl font-bold">Sweet Dreams Bakery</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="hover:text-amber-200 transition-colors">Home</a>
            <a href="#" className="hover:text-amber-200 transition-colors">Products</a>
            <a href="#" className="hover:text-amber-200 transition-colors">About</a>
            <a href="#" className="hover:text-amber-200 transition-colors">Contact</a>
          </nav>

          {/* Right side - User and Cart */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm">hello@sweetdreams.com</span>
              <div className="h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center">
                <span className="text-sm">U</span>
              </div>
            </div>
            
            {/* Cart */}
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-amber-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-amber-700 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-amber-700 mt-4 py-4 px-6 rounded-lg">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="hover:text-amber-200 transition-colors">Home</a>
              <a href="#" className="hover:text-amber-200 transition-colors">Products</a>
              <a href="#" className="hover:text-amber-200 transition-colors">About</a>
              <a href="#" className="hover:text-amber-200 transition-colors">Contact</a>
              <div className="pt-4 border-t border-amber-600 flex items-center space-x-2">
                <span className="text-sm">hello@sweetdreams.com</span>
                <div className="h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center">
                  <span className="text-sm">U</span>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Full-screen Hero Section with Slideshow - Image Left, Content Right */}
      <section className="relative h-screen bg-white">
        <div className="h-full flex flex-col md:flex-row">
          {/* Left Side - Image Slideshow */}
          <div className="md:w-1/2 relative order-1 md:order-1">
            <div className="relative h-full w-full overflow-hidden">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>
              ))}
              
              {/* Navigation arrows */}
              <button
                onClick={goToPrevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white backdrop-blur-sm"
              >
                <svg className="w-6 h-6 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white backdrop-blur-sm"
              >
                <svg className="w-6 h-6 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Slide indicators */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentSlide ? 'bg-amber-500' : 'bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Side - Content */}
          <div className="md:w-1/2 flex items-center justify-center bg-amber-50 order-2 md:order-2">
            <div className="max-w-md mx-auto px-8 py-12 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-amber-800 mb-6">
                {slides[currentSlide].title}
              </h2>
              <p className="text-lg text-amber-600 mb-8 leading-relaxed">
                {slides[currentSlide].description}
              </p>
              <button className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition duration-300 text-lg font-medium shadow-lg">
                {slides[currentSlide].cta}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Windows 8 Style Specialties Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-amber-800 mb-12">Our Specialties</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 h-[600px] md:gap-6">
            {specialties.map((item) => (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  item.size === 'large' ? 'col-span-2 row-span-2' : 
                  item.size === 'medium' ? 'col-span-2' : 'col-span-1'
                }`}
              >
                <div className="aspect-square">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 ${item.color} bg-opacity-70 flex flex-col justify-end p-4 text-white`}>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-sm opacity-90">{item.description}</p>
                    <button className="mt-2 text-xs font-semibold bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full w-fit transition-all">
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-amber-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <img 
              src="https://images.unsplash.com/photo-1608190003443-86b12a5b5bb7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
              alt="Bakery Interior" 
              className="rounded-2xl shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-amber-800 mb-6">Our Story</h2>
            <p className="text-amber-600 mb-4">
              Sweet Dreams Bakery began in 2005 with a simple mission: to create delicious baked goods using traditional methods and the finest ingredients.
            </p>
            <p className="text-amber-600 mb-4">
              Our master bakers wake up early every morning to handcraft each item with care and attention to detail. We source locally whenever possible and never use artificial preservatives.
            </p>
            <p className="text-amber-600 mb-6">
              Today, we're proud to serve our community with a wide range of bread, pastries, cakes, and other baked delights that bring joy to every occasion.
            </p>
            <button className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition duration-300">
              Learn More About Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="bg-amber-800 text-amber-50 py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Sweet Dreams Bakery</h3>
            <p className="mb-4">Where every bite tells a story of tradition and taste</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-amber-200">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:text-amber-200">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Hours</h3>
            <ul className="space-y-2">
              <li>Monday - Friday: 7am - 7pm</li>
              <li>Saturday: 8am - 6pm</li>
              <li>Sunday: 8am - 4pm</li>
            </ul>       
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>123 Bakery Street, Sweetville</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: info@sweetdreamsbakery.com</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-amber-700 text-center">
          <p>© 2024 Sweet Dreams Bakery. All rights reserved.</p>
        </div>
      </section>
    </div>
  );
};

export default BakeryHome;