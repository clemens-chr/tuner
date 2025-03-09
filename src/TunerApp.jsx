import React, { useState, useRef, useEffect } from 'react';

const TunerApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Simple Sidebar */}
      <div className="w-56 bg-indigo-700 text-white">
        <div className="p-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          <h1 className="text-xl font-bold">Tuner</h1>
        </div>
        
        <nav className="mt-6">
          <SidebarLink 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            }
            label="Dashboard" 
          />
          <SidebarLink 
            active={activeTab === 'robots'} 
            onClick={() => setActiveTab('robots')} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            }
            label="My Robots" 
          />
          <SidebarLink 
            active={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            label="Tasks" 
          />
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-medium text-gray-800">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'robots' && 'My Robots'}
            {activeTab === 'tasks' && 'Tasks'}
          </h2>
          <button 
            onClick={() => setShowChatbot(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Create Task with Assistant
          </button>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && <Dashboard onCreateTask={() => setShowChatbot(true)} />}
          {activeTab === 'robots' && <Robots />}
          {activeTab === 'tasks' && <Tasks />}
        </main>
      </div>
      
      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl h-5/6 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium text-lg">Task Creation Assistant</h3>
              <button onClick={() => setShowChatbot(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <TunerChatbotComponent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Sidebar Link Component
const SidebarLink = ({ active, onClick, icon, label }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center space-x-2 w-full px-6 py-3 ${active ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

// Simplified Dashboard with Chatbot Integration
const Dashboard = ({ onCreateTask }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Connected Robots" value="2" />
        <StatCard title="Active Tasks" value="3" />
        <StatCard title="Completed Tasks" value="12" />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Quick Start Guide</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-indigo-100 rounded-full p-2 mr-4">
              <span className="font-bold text-indigo-600">1</span>
            </div>
            <div>
              <h4 className="font-medium">Connect Your Robot</h4>
              <p className="text-gray-600">Add your robot to the platform to start creating tasks.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-indigo-100 rounded-full p-2 mr-4">
              <span className="font-bold text-indigo-600">2</span>
            </div>
            <div>
              <h4 className="font-medium">Define Your Task</h4>
              <p className="text-gray-600">
                Use our conversational assistant to explain what you want your robot to do.
                <button 
                  onClick={onCreateTask}
                  className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Try it now
                </button>
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-indigo-100 rounded-full p-2 mr-4">
              <span className="font-bold text-indigo-600">3</span>
            </div>
            <div>
              <h4 className="font-medium">Train & Deploy</h4>
              <p className="text-gray-600">Tuner will prepare instructions for your robot based on your needs.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature Highlight for Chatbot */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
        <div className="flex items-start">
          <div className="bg-indigo-100 rounded-full p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-lg">New: Conversational Task Creation</h4>
            <p className="text-gray-600 mt-1">
              Our new AI assistant helps you define tasks in natural language. 
              Just tell it what you want your robot to do, and it will guide you through the process.
            </p>
            <button 
              onClick={onCreateTask}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Try Task Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Stat Card
const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
};

// Simplified Robots View
const Robots = () => {
  const robots = [
    { id: 1, name: 'Kitchen Helper', type: 'Manipulation Arm', status: 'Online' },
    { id: 2, name: 'Garden Assistant', type: 'Mobile Platform', status: 'Offline' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-medium">My Connected Robots</h3>
          <button className="text-indigo-600 hover:text-indigo-800">
            + Add Robot
          </button>
        </div>
        
        <div className="divide-y">
          {robots.map(robot => (
            <div key={robot.id} className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-gray-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">{robot.name}</h4>
                  <p className="text-sm text-gray-500">{robot.type}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className={`inline-block rounded-full px-3 py-1 text-sm ${
                  robot.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {robot.status}
                </span>
                <button className="ml-4 text-indigo-600 hover:text-indigo-800">Configure</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simplified Tasks View
const Tasks = () => {
  const tasks = [
    { id: 1, name: 'Sort Recycling', robot: 'Kitchen Helper', status: 'Active' },
    { id: 2, name: 'Water Plants', robot: 'Garden Assistant', status: 'Scheduled' },
    { id: 3, name: 'Organize Desk', robot: 'Kitchen Helper', status: 'Completed' },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium">My Tasks</h3>
      </div>
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Robot</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map(task => (
            <tr key={task.id}>
              <td className="px-6 py-4 whitespace-nowrap font-medium">{task.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.robot}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                  task.status === 'Active' ? 'bg-green-100 text-green-800' : 
                  task.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button className="text-indigo-600 hover:text-indigo-900">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Tuner Chatbot Component
const TunerChatbotComponent = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your Tuner assistant. I'll help you create instructions for your robot. What task would you like to automate?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [robotType, setRobotType] = useState('');
  const [stage, setStage] = useState('task-description');
  const [taskSummary, setTaskSummary] = useState({
    description: '',
    robotType: '',
    environment: '',
    constraints: []
  });
  
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSend = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Process user input based on current stage
    processUserInput(input);
    
    // Clear input field
    setInput('');
  };
  
  const processUserInput = (userInput) => {
    // Delay bot response for natural feeling
    setTimeout(() => {
      let botResponse = '';
      
      switch(stage) {
        case 'task-description':
          setTaskSummary(prev => ({...prev, description: userInput}));
          botResponse = "Great! What type of robot will be performing this task? (e.g., arm manipulator, mobile robot, etc.)";
          setStage('robot-type');
          break;
          
        case 'robot-type':
          setTaskSummary(prev => ({...prev, robotType: userInput}));
          botResponse = "In what environment will this task take place? (e.g., kitchen, warehouse, garden)";
          setStage('environment');
          break;
          
        case 'environment':
          setTaskSummary(prev => ({...prev, environment: userInput}));
          botResponse = "Are there any specific constraints or safety concerns I should know about?";
          setStage('constraints');
          break;
          
        case 'constraints':
          setTaskSummary(prev => ({
            ...prev, 
            constraints: [...prev.constraints, userInput]
          }));
          botResponse = "Would you like to upload any reference images or videos to help train the robot? (yes/no)";
          setStage('media');
          break;
          
        case 'media':
          if (userInput.toLowerCase().includes('yes')) {
            botResponse = "Great! Click the upload button below to add reference materials.";
            setStage('upload');
          } else {
            botResponse = "Thanks for providing all this information! I've summarized your task below. You can review and make changes, or proceed to fine-tune your robot.";
            setStage('summary');
          }
          break;
          
        default:
          botResponse = "I didn't understand that. Could you please try again?";
      }
      
      // Add bot response
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      
      // If we've reached the summary stage, add a summary message
      if (stage === 'summary') {
        const summaryText = `
          **Task Summary:**
          - **Description:** ${taskSummary.description}
          - **Robot Type:** ${taskSummary.robotType}
          - **Environment:** ${taskSummary.environment}
          - **Constraints:** ${taskSummary.constraints.join(', ')}
        `;
        
        const summaryMessage = {
          id: messages.length + 3,
          text: summaryText,
          sender: 'bot',
          type: 'summary',
          timestamp: new Date()
        };
        
        setTimeout(() => {
          setMessages(prevMessages => [...prevMessages, summaryMessage]);
        }, 500);
      }
      
    }, 700); // Slight delay for more natural conversation feel
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full rounded-lg shadow-lg bg-white overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <h3 className="font-medium">Tuner Assistant</h3>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`mb-4 max-w-3/4 ${message.sender === 'user' ? 'ml-auto' : ''}`}
          >
            <div 
              className={`p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-indigo-500 text-white rounded-br-none' 
                  : message.type === 'summary'
                    ? 'bg-white border border-gray-200'
                    : 'bg-white border border-gray-200 rounded-bl-none'
              }`}
            >
              {message.type === 'summary' 
                ? <pre className="whitespace-pre-line text-sm text-gray-700">{message.text}</pre> 
                : <p>{message.text}</p>
              }
            </div>
            <div 
              className={`text-xs text-gray-500 mt-1 ${
                message.sender === 'user' ? 'text-right' : ''
              }`}
            >
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Upload Section */}
      {stage === 'upload' && (
        <div className="p-4 bg-gray-100 border-t border-gray-200">
          <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            <p className="text-sm text-gray-500 mt-1">
              Drag images or videos, or click to browse
            </p>
            <button className="mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200">
              Select Files
            </button>
          </div>
        </div>
      )}
      
      {/* Summary Actions */}
      {stage === 'summary' && (
        <div className="p-4 bg-gray-100 border-t border-gray-200 flex justify-end space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">
            Edit Details
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Fine-Tune Robot
          </button>
        </div>
      )}
      
      {/* Input Area */}
      {stage !== 'summary' && stage !== 'upload' && (
        <div className="p-4 border-t border-gray-200 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            className="ml-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default TunerApp;