// data/features.ts
export interface Feature {
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
    cta: string;
    isNew?: boolean; // Example computed field
  }
  
  // Example dynamic logic: Compute `isNew` based on a condition or add environment-specific links
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  
  export const features: Feature[] = [
    {
      id: 1,
      title: "DC BitDevs",
      description: "A technical forum for discussing and participating in the research & development of Bitcoin.",
      image: "/images/feature/feature_dcbit.jpg",
      link: `${BASE_URL}/bitdevs`, // Dynamic link using environment variable
      cta: "Learn More",
      isNew: false, // Static example; could be computed (see below)
    },
    {
      id: 2,
      title: "Coffee & Bitcoin",
      description: "Join us for coffee and talk about what’s happening in the world of Bitcoin. Newcomers welcome!",
      image: "/images/feature/feature_coffee.jpg",
      link: `${BASE_URL}/coffee`,
      cta: "Join us!",
      isNew: false,
    },
    {
      id: 3,
      title: "Book Club",
      description: "Join other DC Bitcoiners on the never-ending journey down the Bitcoin rabbit hole. Our book club meets every month!",
      image: "/images/feature/feature_bookclub.jpg",
      link: `${BASE_URL}/bookclub`,
      cta: "Read with us!",
      isNew: false, // Dynamic logic example
    },
  ];