import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Upload, Mail, FileText, CheckCircle, AlertCircle, Clock, Play, User, Send, Plus, ChevronRight, Loader2, FileCheck, Search, X, Minimize2, Maximize2, Zap, Sparkles, Building, Home } from 'lucide-react';

const InsuranceUnderwriterApp = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Metropolitan Tower Complex",
      client: "ABC Corporation",
      type: "Commercial Property",
      status: "active",
      icon: Building,
      createdAt: "2024-01-15",
      lastActivity: "2 hours ago"
    }
  ]);
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [projectInfo, setProjectInfo] = useState({});
  const [statusSections, setStatusSections] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [sectionChats, setSectionChats] = useState({});
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const createNewProject = () => {
    const newProject = {
      id: projects.length + 1,
      name: "New Insurance Project",
      client: "Pending",
      type: "To be determined",
      status: "setup",
      icon: Home,
      createdAt: new Date().toISOString().split('T')[0],
      lastActivity: "Just now"
    };
    
    setProjects([...projects, newProject]);
    setSelectedProject(newProject);
    setChatMessages([{
      id: 1,
      sender: 'ai',
      text: "Hello! I'm here to help you set up your new insurance project. How would you like to begin? You can:\n\n1. Forward me an email thread about this project\n2. Upload relevant documents (PDFs, forms, etc.)\n3. Simply describe the project to me\n\nWhat would you prefer?",
      timestamp: new Date().toISOString()
    }]);
    setProjectInfo({});
    setStatusSections([]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate AI response based on context
    setTimeout(() => {
      let aiResponse = {
        id: chatMessages.length + 2,
        sender: 'ai',
        text: "",
        timestamp: new Date().toISOString()
      };

      // Dynamic response based on message content
      if (inputMessage.toLowerCase().includes('email') || inputMessage.toLowerCase().includes('forward')) {
        aiResponse.text = "Great! I can analyze email threads. Please forward the email thread to: project-" + selectedProject.id + "@underwriter-ai.com\n\nOnce I receive it, I'll extract all relevant information and populate the project details.";
        
        // Simulate email received after a delay
        setTimeout(() => {
          setProjectInfo({
            "Client": "Stellar Developments LLC",
            "Property Address": "450 Park Avenue, New York, NY",
            "Property Type": "Mixed-Use Commercial",
            "Total Square Footage": "125,000 sq ft",
            "Estimated Value": "$45.5 million",
            "Occupancy Type": "Retail & Office Space"
          });
          
          setStatusSections([
            { id: 1, title: "Property Valuation Report", status: "pending", priority: "high" },
            { id: 2, title: "Environmental Assessment", status: "pending", priority: "medium" },
            { id: 3, title: "Tenant Lease Agreements", status: "required", priority: "high" },
            { id: 4, title: "Building Code Compliance", status: "in-review", priority: "medium" },
            { id: 5, title: "Previous Claims History", status: "pending", priority: "low" }
          ]);
          
          setChatMessages(prev => [...prev, {
            id: prev.length + 1,
            sender: 'ai',
            text: "Perfect! I've received and analyzed the email thread. I've extracted key property information and identified several items we'll need to complete the underwriting process. Check the project information panel for details.",
            timestamp: new Date().toISOString()
          }]);
        }, 3000);
      } else if (inputMessage.toLowerCase().includes('upload') || inputMessage.toLowerCase().includes('document')) {
        aiResponse.text = "I'm ready to analyze your documents. You can drag and drop files directly into this chat, or click the upload button below. I can process PDFs, Word documents, Excel spreadsheets, and images.";
      } else if (inputMessage.toLowerCase().includes('describe') || chatMessages.length === 2) {
        aiResponse.text = "I'd be happy to learn about your project. Let's start with the basics:\n\n• What type of property are we insuring?\n• Where is it located?\n• What's the approximate value?\n• Who is the property owner?";
      } else {
        aiResponse.text = "I understand. Based on what you've told me, I'm updating the project information. Is there anything specific about this property I should know? Any recent renovations, unique features, or previous insurance claims?";
        
        // Simulate dynamic updates based on conversation
        if (Object.keys(projectInfo).length > 0) {
          const newRequirement = {
            id: statusSections.length + 1,
            title: "Additional Information Required",
            status: "pending",
            priority: "medium"
          };
          setStatusSections([...statusSections, newRequirement]);
        }
      }
      
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSectionAction = (sectionId, action) => {
    if (action === 'chat') {
      setExpandedSections({ ...expandedSections, [sectionId]: true });
      setSectionChats({
        ...sectionChats,
        [sectionId]: [{
          id: 1,
          sender: 'ai',
          text: `Let's work on "${statusSections.find(s => s.id === sectionId)?.title}". What information do you currently have available?`
        }]
      });
    } else if (action === 'agent') {
      // Simulate agent processing
      setStatusSections(prev =>
        prev.map(section =>
          section.id === sectionId ? { ...section, status: 'processing' } : section
        )
      );
      
      setTimeout(() => {
        setStatusSections(prev =>
          prev.map(section =>
            section.id === sectionId ? { ...section, status: 'complete' } : section
          )
        );
      }, 3000);
    }
  };

  const ProjectCard = ({ project, onClick }) => {
    const Icon = project.icon;
    return (
      <div 
        onClick={onClick}
        className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full opacity-10 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Icon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                <p className="text-sm text-slate-400">{project.client}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">{project.lastActivity}</span>
            <div className="flex items-center space-x-1 text-blue-400">
              <span>View</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatusSection = ({ section }) => {
    const isExpanded = expandedSections[section.id];
    const chatMessages = sectionChats[section.id] || [];
    
    return (
      <div className="mb-4">
        <div className={`bg-slate-800/50 backdrop-blur rounded-xl p-4 border transition-all duration-300 ${
          section.status === 'complete' ? 'border-green-500/30' :
          section.status === 'processing' ? 'border-blue-500/30' :
          section.status === 'in-review' ? 'border-yellow-500/30' :
          'border-slate-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                section.status === 'complete' ? 'bg-green-400' :
                section.status === 'processing' ? 'bg-blue-400 animate-pulse' :
                section.status === 'in-review' ? 'bg-yellow-400' :
                'bg-slate-500'
              }`} />
              <span className="font-medium text-slate-200">{section.title}</span>
              {section.priority === 'high' && (
                <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">High Priority</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {section.status === 'complete' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : section.status === 'processing' ? (
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              ) : (
                <>
                  <button
                    onClick={() => handleSectionAction(section.id, 'agent')}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors group"
                    title="AI Agent"
                  >
                    <Zap className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleSectionAction(section.id, 'chat')}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors group"
                    title="Guided Chat"
                  >
                    <MessageCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleSectionAction(section.id, 'upload')}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors group"
                    title="Upload"
                  >
                    <Upload className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-2 bg-slate-900/50 rounded-xl p-4 border border-slate-700 animate-slideDown">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-slate-300">Guided Assistant</h4>
              <button
                onClick={() => setExpandedSections({ ...expandedSections, [section.id]: false })}
                className="p-1 hover:bg-slate-700 rounded transition-colors"
              >
                <Minimize2 className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`text-sm ${msg.sender === 'ai' ? 'text-slate-300' : 'text-blue-400'}`}>
                  <span className="font-medium">{msg.sender === 'ai' ? 'AI: ' : 'You: '}</span>
                  {msg.text}
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type here..."
                className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    setSectionChats({
                      ...sectionChats,
                      [section.id]: [...chatMessages, { id: chatMessages.length + 1, sender: 'user', text: e.target.value }]
                    });
                    e.target.value = '';
                  }
                }}
              />
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-slate-950 flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 border-r border-slate-800">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <Sparkles className="w-8 h-8 text-blue-500" />
              <h1 className="text-xl font-bold text-white">UnderwriteAI</h1>
            </div>
            
            <button
              onClick={() => setSelectedProject(null)}
              className="text-slate-400 hover:text-white text-sm mb-6 flex items-center space-x-1"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Back to Projects</span>
            </button>
            
            <div className="space-y-2">
              {projects.map(project => {
                const Icon = project.icon;
                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      selectedProject.id === project.id ? 
                      'bg-blue-500/20 border-l-4 border-blue-500' : 
                      'hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-white text-sm">{project.name}</p>
                        <p className="text-xs text-slate-500">{project.client}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Project Information Panel - Center */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              {/* Project Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedProject.name}</h2>
                <p className="text-slate-400">Project ID: #{selectedProject.id} • Created {selectedProject.createdAt}</p>
              </div>

              {/* Project Information */}
              {Object.keys(projectInfo).length > 0 ? (
                <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-6 mb-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                    Project Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(projectInfo).map(([key, value]) => (
                      <div key={key} className="animate-fadeIn">
                        <p className="text-sm text-slate-500 mb-1">{key}</p>
                        <p className="font-medium text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-12 mb-6 border border-slate-700 text-center">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-400 mb-2">No project information yet</h3>
                  <p className="text-sm text-slate-500">Start a conversation to populate project details</p>
                </div>
              )}

              {/* Status Sections */}
              {statusSections.length > 0 && (
                <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-blue-400" />
                    Requirements & Status
                  </h3>
                  {statusSections.map(section => (
                    <StatusSection key={section.id} section={section} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Interface - Right Side */}
          <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-semibold text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
                AI Assistant
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-slate-800 rounded-2xl px-4 py-3 border border-slate-700">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
            
            <div className="p-4 border-t border-slate-800">
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                  <Upload className="w-5 h-5 text-slate-400" />
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-white">UnderwriteAI</h1>
            </div>
            <button
              onClick={createNewProject}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
        
        {projects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-xl font-medium text-slate-400 mb-2">No projects yet</h3>
            <p className="text-slate-500 mb-6">Create your first insurance underwriting project</p>
            <button
              onClick={createNewProject}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Project</span>
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 300px; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InsuranceUnderwriterApp;