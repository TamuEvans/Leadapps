import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bot,
  X,
  Mic,
  MicOff,
  MessageSquare,
  Volume2,
  VolumeX,
  SendHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";

// Mock predefined context-aware responses based on the current page
const getMockResponse = (page: string, query: string) => {
  const lowerQuery = query.toLowerCase();
  
  // Common responses for any page
  if (lowerQuery.includes("help") || lowerQuery.includes("guide")) {
    return "I'm your LeadApps AI assistant! I can help you navigate the app, explain features, and answer questions about study abroad programs.";
  }
  
  if (lowerQuery.includes("contact") || lowerQuery.includes("support")) {
    return "You can reach our support team via email at support@leadapps.edu or through the Contact option in the main menu.";
  }
  
  // Page-specific responses
  if (page.includes("/profile")) {
    if (lowerQuery.includes("document") || lowerQuery.includes("upload")) {
      return "To upload documents, go to the Documents section of your profile. You can upload passport, transcripts, and certificates. Make sure your files are in PDF, JPG, or PNG format.";
    }
    if (lowerQuery.includes("complete") || lowerQuery.includes("completion")) {
      return "Your profile completion percentage is shown at the top of the page. To increase it, fill out more fields in your profile, especially those marked with an asterisk (*).";
    }
    return "You're on your Profile page. Here you can update your personal information, education history, test scores, and upload important documents required for your applications.";
  }
  
  if (page.includes("/university-search")) {
    if (lowerQuery.includes("filter") || lowerQuery.includes("search")) {
      return "You can filter universities by name, country, or program type using the search filters at the top of the page.";
    }
    if (lowerQuery.includes("apply") || lowerQuery.includes("application")) {
      return "To apply to a university, first view its profile page by clicking 'View Profile', then go to the Programs tab to see available programs.";
    }
    return "You're on the University Search page. Here you can browse through partner universities, view their details, and explore their available programs.";
  }
  
  if (page.includes("/applications")) {
    if (lowerQuery.includes("status") || lowerQuery.includes("track")) {
      return "You can track your application status on this page. The possible statuses include: 'In Progress', 'Submitted', 'Under Review', and 'Decision Made'.";
    }
    if (lowerQuery.includes("document") || lowerQuery.includes("require")) {
      return "Required documents for each application are listed in their respective sections. Common requirements include transcripts, test scores, and personal statements.";
    }
    return "You're on the Applications page. Here you can track existing applications, submit new ones, and check the requirements for each program you're applying to.";
  }
  
  if (page.includes("/personality-hub")) {
    return "The Personality Hub helps identify programs that match your interests and strengths. Take the assessment to receive personalized recommendations.";
  }
  
  if (page.includes("/funding-hub")) {
    return "The Funding Hub shows scholarship opportunities and financial aid options available for your chosen programs.";
  }
  
  if (page.includes("/counselling")) {
    return "In the Counselling section, you can schedule appointments with our education advisors for personalized guidance.";
  }
  
  // Default response if no specific context matches
  return "I'm here to help you navigate LeadApps. What would you like to know about your journey to studying abroad?";
};

// Predefined quick questions based on current page
const getPageQuickQuestions = (page: string) => {
  if (page.includes("/profile")) {
    return [
      "How do I complete my profile?",
      "How do I upload documents?",
      "What documents are required?"
    ];
  }
  
  if (page.includes("/university-search")) {
    return [
      "How can I filter universities?",
      "What are the top schools?",
      "How do I apply to a program?"
    ];
  }
  
  if (page.includes("/applications")) {
    return [
      "How do I track my application?",
      "What's the application process?",
      "What if my documents are missing?"
    ];
  }
  
  if (page.includes("/personality-hub")) {
    return [
      "How does the assessment work?",
      "What will I learn about myself?",
      "How are programs matched to me?"
    ];
  }
  
  if (page.includes("/funding-hub")) {
    return [
      "What scholarships are available?",
      "How do I apply for financial aid?",
      "What are my funding options?"
    ];
  }
  
  // Default questions for any other page
  return [
    "How can I get started?",
    "What features are available?",
    "How can I contact support?"
  ];
};

// Interface for chat messages
interface ChatMessage {
  sender: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

export default function AIGuideButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      message: "Hi there! I'm your LeadApps AI guide. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [micActive, setMicActive] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [location] = useLocation();
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      sender: 'user',
      message: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const responseMessage: ChatMessage = {
        sender: 'ai',
        message: getMockResponse(location, input),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 500);
    
    setInput("");
  };
  
  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle voice toggle (mock functionality)
  const toggleMic = () => {
    setMicActive(!micActive);
    
    if (!micActive) {
      // In a real implementation, we would start voice recognition here
      setTimeout(() => {
        setInput("Help me understand how to use this app");
      }, 1500);
    }
  };
  
  // Handle quick question selection
  const handleQuickQuestion = (question: string) => {
    setInput(question);
    handleSendMessage();
  };
  
  return (
    <>
      {/* Floating AI Guide Button */}
      <Button 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-gradient-primary"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
      
      {/* AI Guide Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-gradient-primary">
                  <AvatarFallback>AI</AvatarFallback>
                  <AvatarImage src="/assets/ai-avatar.png" alt="AI Guide" />
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">LeadApps AI Guide</h3>
                  <p className="text-xs text-gray-500">Available 24/7</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setVoiceOutput(!voiceOutput)}
                >
                  {voiceOutput ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-2 px-4 pt-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="guide">Quick Help</TabsTrigger>
              </TabsList>
              
              {/* Chat Tab */}
              <TabsContent value="chat" className="flex-1 flex flex-col">
                {/* Chat Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                            msg.sender === 'user' 
                              ? 'bg-gradient-primary text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Input Area */}
                <div className="p-4 border-t">
                  <div className="relative">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      className="pr-24 min-h-[60px] resize-none"
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={toggleMic}
                      >
                        {micActive ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="default"
                        size="icon"
                        className="h-8 w-8 bg-gradient-primary"
                        onClick={handleSendMessage}
                        disabled={!input.trim()}
                      >
                        <SendHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Quick Help Tab */}
              <TabsContent value="guide" className="flex-1 flex flex-col p-4">
                <h3 className="font-medium text-sm mb-2">
                  Helpful questions for this page:
                </h3>
                <div className="space-y-2">
                  {getPageQuickQuestions(location).map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto py-3 px-4 text-left"
                      onClick={() => {
                        setActiveTab("chat");
                        handleQuickQuestion(question);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{question}</span>
                    </Button>
                  ))}
                </div>
                
                <div className="mt-auto">
                  <h3 className="font-medium text-sm mb-2 mt-4">About AI Guide</h3>
                  <p className="text-sm text-gray-600">
                    LeadApps AI Guide can help you navigate the application process, 
                    find suitable programs, and answer your questions about studying abroad.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      )}
    </>
  );
}