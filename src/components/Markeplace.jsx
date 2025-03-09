import React, { useState } from 'react';
import marketplaceItems from '../assets/marketplacedata';

const TunerMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRobotType, setSelectedRobotType] = useState('all');

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'sorting', name: 'Sorting & Recycling' },
    { id: 'manipulation', name: 'Object Manipulation' },
    { id: 'cleaning', name: 'Cleaning & Maintenance' },
    { id: 'retail', name: 'Retail Operations' },
    { id: 'gardening', name: 'Agriculture & Gardening' },
    { id: 'household', name: 'Household Tasks' },
    { id: 'logistics', name: 'Logistics & Shipping' },
    { id: 'organization', name: 'Organization & Storage' }
  ];

  // Robot types for filtering
  const robotTypes = [
    { id: 'all', name: 'All Robots' },
    { id: 'arm', name: 'Robotic Arms' },
    { id: 'mobile', name: 'Mobile Robots' }
  ];

  // Filter marketplace items based on search, category, and robot type
  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    const matchesRobotType = selectedRobotType === 'all' || item.robotType === selectedRobotType;
    
    return matchesSearch && matchesCategory && matchesRobotType;
  });

  // Get robot image (this would normally fetch from your assets)
  const getRobotImage = (imageId) => {
    // In a real app, you'd return actual images
    // Here we'll return colored rectangles as placeholders
    const colors = {
      'bottle-sorter': '#3498db',
      'precision-pickup': '#e74c3c',
      'floor-cleaner': '#2ecc71',
      'shelf-stocker': '#f39c12',
      'plant-waterer': '#27ae60',
      'kitchen-helper': '#9b59b6',
      'package-sorter': '#e67e22',
      'tool-organizer': '#1abc9c'
    };
    
    return (
      <div 
        className="w-full h-32 flex items-center justify-center rounded-t-lg" 
        style={{ backgroundColor: colors[imageId] || '#bdc3c7' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Robot Task Marketplace</h1>
      
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for robot tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Robot Type</label>
              <select 
                value={selectedRobotType}
                onChange={(e) => setSelectedRobotType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {robotTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredItems.length} of {marketplaceItems.length} robot tasks
        </p>
      </div>
      
      {/* Marketplace Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <MarketplaceItem key={item.id} item={item} getRobotImage={getRobotImage} />
        ))}
      </div>
      
      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

const MarketplaceItem = ({ item, getRobotImage }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Item Image */}
      {getRobotImage(item.image)}
      
      {/* Item Content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg text-gray-900">{item.title}</h3>
          <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm font-medium">{item.rating}</span>
          </div>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.description}</p>
        
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
          </svg>
          <span>{item.downloads.toLocaleString()} downloads</span>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {item.tags.map((tag, index) => (
            <span key={index} className="inline-block px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="mt-3 flex items-center">
          <span className="text-xs text-gray-500">Compatible with: </span>
          <span className="ml-1 text-xs text-gray-700">{item.compatibility.slice(0, 2).join(", ")}{item.compatibility.length > 2 ? "..." : ""}</span>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">By {item.author}</span>
          <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors">
            Use Model
          </button>
        </div>
      </div>
    </div>
  );
};

export default TunerMarketplace;