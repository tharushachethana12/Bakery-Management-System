import React from 'react';
import TopNavbar from '../TopNavbar';

const About = () => {
  return (
    <div className="min-h-screen bg-amber-50">
      <TopNavbar currentPage="About" />
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-amber-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1608190003443-86b12a5b5bb7?auto=format&fit=crop&w=1074&q=80" 
              alt="Bakery" 
              className="rounded-2xl shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-amber-800 mb-6">Our Story</h1>
            <p className="text-amber-700 leading-8 mb-4">
              At Sweet Dreams Bakery, we believe in the art of slow baking. Since 2005, we've been crafting breads, pastries, and cakes
              using traditional methods and the finest ingredients. Our bakers start before dawn each day to bring you fresh, delicious treats.
            </p>
            <p className="text-amber-700 leading-8 mb-4">
              We source locally whenever possible and never use artificial preservatives. Whether you're here for a hearty loaf, a delicate croissant,
              or a custom cake for a special occasion, our team is dedicated to making your experience delightful.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-xl p-4 shadow">
                <h3 className="text-amber-800 font-semibold mb-1">Fresh Daily</h3>
                <p className="text-amber-700 text-sm">Baked every morning for peak freshness</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow">
                <h3 className="text-amber-800 font-semibold mb-1">Premium Ingredients</h3>
                <p className="text-amber-700 text-sm">Organic flour and European butter</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
