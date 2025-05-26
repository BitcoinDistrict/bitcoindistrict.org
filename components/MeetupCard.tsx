import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; // Assuming you're using shadcn/ui or similar

export interface Meetup {
  id: number;
  name: string;
  city: string;
  location: string;
  description: string;
  logo: string;
  meetupUrl: string;  // URL for the meetup
  websiteUrl: string; // URL for primary website
}

export function MeetupCard({ meetup }: { meetup: Meetup }) {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex items-center">
        {meetup.logo && <a href={meetup.websiteUrl} target="{meetup.websiteUrl}" rel="noopener noreferrer"><img src={meetup.logo} alt={`${meetup.name} logo`} className="w-20 h-20 rounded-full object-cover" /></a>}
        <CardTitle>{meetup.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription><p>📍 {meetup.city}</p></CardDescription>
        {meetup.description}
      </CardContent>
      <CardFooter className="flex items-right">
        <p><a href={meetup.meetupUrl} target=" {meetup.meetupUrl} " rel="noopener noreferrer">🔗 Meetup</a></p>
        <p><a href={meetup.websiteUrl} target=" {meetup.websiteUrl} " rel="noopener noreferrer">🔗 Website</a></p>
      </CardFooter>
    </Card>
  );
} 