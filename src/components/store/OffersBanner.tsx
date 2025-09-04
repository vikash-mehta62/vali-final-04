
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, Zap, Truck, Clock, Percent, Gift, CreditCard, Leaf, Award, TrendingUp, BarChart3 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const OffersBanner: React.FC = () => {
  const offers = [
    {
      title: "Volume Advantage Program",
      description: "Save up to 35% on orders of 100+ items",
      icon: <BarChart3 className="h-4 w-4" />,
      color: "bg-violet-600",
      gradient: "bg-gradient-to-r from-violet-600 to-indigo-400"
    },
    {
      title: "Seasonal Stock-Up Sale",
      description: "Limited time: 25% extra discount on all fresh produce",
      icon: <Percent className="h-4 w-4" />,
      color: "bg-orange-600",
      gradient: "bg-gradient-to-r from-orange-500 to-amber-300"
    },
    {
      title: "Buy More, Save More",
      description: "Tiered discounts at 50, 100, and 200 units",
      icon: <Tag className="h-4 w-4" />,
      color: "bg-blue-600",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-400"
    },
    {
      title: "Complimentary Premium Delivery",
      description: "Free expedited shipping on orders over $750",
      icon: <Truck className="h-4 w-4" />,
      color: "bg-green-600",
      gradient: "bg-gradient-to-r from-green-500 to-emerald-300"
    },
    {
      title: "Flash Deal: 48 Hours Only",
      description: "Buy 3 palettes, get 1 free on selected categories",
      icon: <Zap className="h-4 w-4" />,
      color: "bg-purple-600",
      gradient: "bg-gradient-to-r from-purple-500 to-pink-400"
    },
    {
      title: "New Customer Advantage",
      description: "First-time buyers get $100 credit on orders of $500+",
      icon: <Gift className="h-4 w-4" />,
      color: "bg-red-600",
      gradient: "bg-gradient-to-r from-red-500 to-rose-300"
    },
    {
      title: "Loyalty Rewards Program",
      description: "Earn 3x points this month — $1 spent = 3 points",
      icon: <CreditCard className="h-4 w-4" />,
      color: "bg-teal-600",
      gradient: "bg-gradient-to-r from-teal-500 to-cyan-300"
    },
    {
      title: "Premium Organic Collection",
      description: "30% off our sustainable, certified organic range",
      icon: <Leaf className="h-4 w-4" />,
      color: "bg-green-700",
      gradient: "bg-gradient-to-r from-green-600 to-lime-400"
    },
    {
      title: "Wholesale Partner Benefits",
      description: "Exclusive pricing tiers for regular customers",
      icon: <Award className="h-4 w-4" />,
      color: "bg-amber-600",
      gradient: "bg-gradient-to-r from-amber-500 to-yellow-300"
    },
    {
      title: "Trending Products Alert",
      description: "Early access to high-demand seasonal items",
      icon: <TrendingUp className="h-4 w-4" />,
      color: "bg-blue-700",
      gradient: "bg-gradient-to-r from-blue-600 to-indigo-400"
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Zap className="h-5 w-5 mr-2 text-amber-500" />
        Special Wholesale Offers
        <Badge className="ml-2 bg-amber-100 text-amber-800">Limited Time</Badge>
      </h2>
      <Carousel 
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {offers.map((offer, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Card className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${offer.gradient} text-white transform hover:scale-103 cursor-pointer`}>
                <CardContent className="flex items-center p-6">
                  <Badge className={`mr-4 bg-white/20 backdrop-blur-sm text-white p-2`}>
                    {offer.icon}
                  </Badge>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">{offer.title}</h3>
                    <p className="text-sm text-white/90">{offer.description}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4">
          <CarouselPrevious className="relative mr-2 static translate-y-0" />
          <CarouselNext className="relative ml-2 static translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default OffersBanner;
