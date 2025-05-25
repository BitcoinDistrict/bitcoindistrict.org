import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming you're using shadcn/ui or similar

export interface Meetup {
  id: number;
  name: string;
  location: string;
  description: string;
  logo: string;
  url: string;  // URL for the meetup
}

export function MeetupCard({ meetup }: { meetup: Meetup }) {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex items-center">
        {meetup.logo && <a href={meetup.url} target="_blank" rel="noopener noreferrer"><img src={meetup.logo} alt={`${meetup.name} logo`} className="w-20 h-20 rounded-full object-cover" /></a>}
        <CardTitle>{meetup.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>Location: {meetup.location}</CardDescription>
        <p>{meetup.description}</p>
      </CardContent>
    </Card>
  );
} 