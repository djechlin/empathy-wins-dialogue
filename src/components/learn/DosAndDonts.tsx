import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/ui/card';
import { Check, X } from 'lucide-react';

interface DosProps {
  children: ReactNode;
  title?: string;
}

interface DontsProps {
  children: ReactNode;
  title?: string;
}

interface DosAndDontsProps {
  children: ReactNode;
}

export const Dos: React.FC<DosProps> = ({ children, title = 'Story Dos' }) => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-green-500 rounded-full">
            <Check className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-green-800">{title}</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
};

export const Donts: React.FC<DontsProps> = ({ children, title = "Story Don'ts" }) => {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-red-500 rounded-full">
            <X className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-red-800">{title}</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
};

export const ConversationDos: React.FC<DosProps> = ({ children, title = 'Conversation Dos' }) => {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-blue-500 rounded-full">
            <Check className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
};

export const ConversationDonts: React.FC<DontsProps> = ({ children, title = "Conversation Don'ts" }) => {
  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-orange-500 rounded-full">
            <X className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-orange-800">{title}</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
};

export const DosAndDontsItem: React.FC<{ children: ReactNode; type: 'do' | 'dont' }> = ({ children, type }) => {
  const iconColor = type === 'do' ? 'text-green-600' : 'text-red-600';
  const textColor = type === 'do' ? 'text-green-800' : 'text-red-800';
  const Icon = type === 'do' ? Check : X;

  return (
    <div className="flex items-start gap-2">
      <Icon className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`} />
      <span className={`text-sm ${textColor}`}>{children}</span>
    </div>
  );
};

export const ConversationDosAndDontsItem: React.FC<{ children: ReactNode; type: 'do' | 'dont' }> = ({ children, type }) => {
  const iconColor = type === 'do' ? 'text-blue-600' : 'text-orange-600';
  const textColor = type === 'do' ? 'text-blue-800' : 'text-orange-800';
  const Icon = type === 'do' ? Check : X;

  return (
    <div className="flex items-start gap-2">
      <Icon className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`} />
      <span className={`text-sm ${textColor}`}>{children}</span>
    </div>
  );
};

const DosAndDonts: React.FC<DosAndDontsProps> = ({ children }) => {
  return <div className="grid md:grid-cols-2 gap-4">{children}</div>;
};

export default DosAndDonts;
