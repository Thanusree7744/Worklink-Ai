import { useState, useRef, useEffect } from 'react';
import { Navbar } from '../components/worklink/Navbar';
import { DashboardSidebar } from '../components/worklink/DashboardSidebar';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Send, Check, CheckCheck, Phone, Video, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatChannel {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

export function MessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  // Use user's role to adapt the sidebar
  const currentRole = user?.role || 'worker';

  // Demo active channels
  const initialChannels: ChatChannel[] = [
    {
      id: '1',
      name: 'Jane Smith (Acme Home Services)',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      role: 'Customer / Contractor',
      lastMessage: 'Let\'s schedule the pipe repair for Tuesday morning.',
      time: '10:42 AM',
      unread: 1,
      messages: [
        { id: 'm1', senderId: 'jane', text: 'Hi Sarah, are you available next week for a quick residential plumbing job?', timestamp: '10:30 AM', status: 'read' },
        { id: 'm2', senderId: 'sarah', text: 'Hello Jane! Yes, I am. What seems to be the issue?', timestamp: '10:32 AM', status: 'read' },
        { id: 'm3', senderId: 'jane', text: 'There\'s a minor leakage in the main kitchen sink drainage pipeline. Needs a pipe replacement.', timestamp: '10:35 AM', status: 'read' },
        { id: 'm4', senderId: 'sarah', text: 'Got it. I can bring the matching pipes. How about Tuesday morning at 9:00 AM?', timestamp: '10:40 AM', status: 'read' },
        { id: 'm5', senderId: 'jane', text: 'Let\'s schedule the pipe repair for Tuesday morning.', timestamp: '10:42 AM', status: 'delivered' }
      ]
    },
    {
      id: '2',
      name: 'John Smith',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      role: 'Customer',
      lastMessage: 'Thanks for finishing the kitchen sink installation!',
      time: 'Yesterday',
      unread: 0,
      messages: [
        { id: 'm21', senderId: 'john', text: 'Hi, can you install a double-bowl drop-in sink?', timestamp: '2:15 PM', status: 'read' },
        { id: 'm22', senderId: 'sarah', text: 'Sure, I have installed many of those. It usually takes 2-3 hours.', timestamp: '2:20 PM', status: 'read' },
        { id: 'm23', senderId: 'john', text: 'Thanks for finishing the kitchen sink installation!', timestamp: '5:30 PM', status: 'read' }
      ]
    },
    {
      id: '3',
      name: 'Michael Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      role: 'Worker (Electrician)',
      lastMessage: 'Do you want to collab on the renovation job next week?',
      time: '2 days ago',
      unread: 0,
      messages: [
        { id: 'm31', senderId: 'michael', text: 'Hey Sarah! I saw a big home renovation post in Brooklyn. They need plumbing and electrical.', timestamp: '11:00 AM', status: 'read' },
        { id: 'm32', senderId: 'sarah', text: 'Oh nice. I\'d love to team up.', timestamp: '11:15 AM', status: 'read' },
        { id: 'm33', senderId: 'michael', text: 'Do you want to collab on the renovation job next week?', timestamp: '11:18 AM', status: 'read' }
      ]
    }
  ];

  const [channels, setChannels] = useState<ChatChannel[]>(initialChannels);
  const [selectedChannelId, setSelectedChannelId] = useState<string>('1');
  const [typedMessage, setTypedMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChannel = channels.find(c => c.id === selectedChannelId) || channels[0];

  // Scroll to bottom of message logs
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChannelId, channels]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMessage: Message = {
      id: `m_new_${Date.now()}`,
      senderId: 'sarah', // assume current user is Sarah in mock state
      text: typedMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    const updatedChannels = channels.map(channel => {
      if (channel.id === selectedChannelId) {
        return {
          ...channel,
          lastMessage: typedMessage,
          time: newMessage.timestamp,
          messages: [...channel.messages, newMessage]
        };
      }
      return channel;
    });

    setChannels(updatedChannels);
    setTypedMessage('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} userType={currentRole === 'admin' ? 'customer' : currentRole} />
      <div className="flex">
        <DashboardSidebar
          userType={currentRole}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] h-[calc(100vh-4rem)] flex flex-col">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-1">Messages</h1>
            <p className="text-sm text-muted-foreground">Chat with clients, contractors, and partners about job requests</p>
          </div>

          <Card className="flex-1 overflow-hidden grid lg:grid-cols-3 min-h-[500px]">
            {/* Left Panel: Conversational threads */}
            <div className="border-r h-full flex flex-col">
              <div className="p-4 border-b">
                <Input placeholder="Search messages..." />
              </div>
              <div className="flex-1 overflow-y-auto divide-y">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => {
                      setSelectedChannelId(channel.id);
                      // Clear unreads
                      setChannels(channels.map(c => c.id === channel.id ? { ...c, unread: 0 } : c));
                    }}
                    className={`w-full text-left p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors ${
                      selectedChannelId === channel.id ? 'bg-muted/70' : ''
                    }`}
                  >
                    <Avatar className="w-10 h-10 border border-muted">
                      <AvatarImage src={channel.avatarUrl} alt={channel.name} />
                      <AvatarFallback>{channel.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm truncate">{channel.name}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{channel.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-1">{channel.role}</p>
                      <p className="text-xs font-normal truncate text-foreground/80">{channel.lastMessage}</p>
                    </div>
                    {channel.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                        {channel.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Panel: Chat Log */}
            <div className="lg:col-span-2 flex flex-col h-full bg-slate-50/50 dark:bg-zinc-950/20">
              {/* Header */}
              <div className="p-4 border-b bg-card flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedChannel.avatarUrl} />
                    <AvatarFallback>{selectedChannel.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm leading-tight">{selectedChannel.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedChannel.role} • Active now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="w-4 h-4 text-muted-foreground" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Video className="w-4 h-4 text-muted-foreground" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Info className="w-4 h-4 text-muted-foreground" /></Button>
                </div>
              </div>

              {/* Message log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChannel.messages.map((message) => {
                  const isMe = message.senderId === 'sarah'; // Mocked as Sarah Johnson
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                        isMe 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-card text-foreground rounded-tl-none border shadow-sm'
                      }`}>
                        <p>{message.text}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] ${
                          isMe ? 'text-primary-foreground/75' : 'text-muted-foreground'
                        }`}>
                          <span>{message.timestamp}</span>
                          {isMe && (
                            message.status === 'read' ? <CheckCheck className="w-3.5 h-3.5 text-green-300" /> :
                            message.status === 'delivered' ? <CheckCheck className="w-3.5 h-3.5 text-white/80" /> :
                            <Check className="w-3.5 h-3.5 text-white/60" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Send Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t bg-card flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
