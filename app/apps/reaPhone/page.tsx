'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Phone, MessageSquare } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

const initialContacts: Contact[] = [
  { id: '1', name: 'Adeiza Onimisi', phone: '+234 7074088848' },

];

export default function PhoneApp() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts] = useState<Contact[]>(initialContacts);

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm)
  );

  // Placeholder for call action
  const handleCall = (phone: string) => {
    alert(`Initiating call to ${phone}`);
    // Add telephony API integration (e.g., Twilio) here if needed
  };

  // Placeholder for message action
  const handleMessage = (phone: string) => {
    alert(`Opening message to ${phone}`);
    // Add messaging feature integration here if needed
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 rounded-2xl shadow-xl">
        <CardHeader className="text-center border-b border-white/20">
          <CardTitle className="text-white text-2xl font-semibold">Phonebook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {/* Search Bar */}
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500"
          />

          {/* Contact List */}
          <div className="max-h-[60vh] overflow-y-auto space-y-3">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{contact.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{contact.name}</p>
                      <p className="text-white/60 text-sm">{contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-blue-500/20"
                      onClick={() => handleCall(contact.phone)}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-blue-500/20"
                      onClick={() => handleMessage(contact.phone)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/60 text-center">No contacts found</p>
            )}
          </div>

          {/* Back to Desktop Button */}
          <Button
            onClick={() => router.push('/desktop')}
            variant="outline"
            className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Desktop
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}