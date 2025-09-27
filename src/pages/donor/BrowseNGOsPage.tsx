import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone } from 'lucide-react';
import { useDonorApp, type NGO } from '@/contexts/DonorAppContext';
import { DonationForm } from '@/components/donor/DonationForm';

const containerStyle = {
  width: '100%',
  height: '500px'
};

// Default center (Mumbai)
const defaultCenter = {
  lat: 19.0760,
  lng: 72.8777
};

export function BrowseNGOsPage() {
  const { ngos } = useDonorApp();
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Using default location.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const onMarkerClick = useCallback((ngo: NGO) => {
    setSelectedNGO(ngo);
  }, []);

  const onInfoWindowClose = useCallback(() => {
    setSelectedNGO(null);
  }, []);

  const handleDonateClick = (ngo: NGO) => {
    setSelectedNGO(ngo);
    setShowDonationForm(true);
  };

  if (showDonationForm && selectedNGO) {
    return (
      <DonationForm 
        ngo={selectedNGO} 
        onBack={() => {
          setShowDonationForm(false);
          setSelectedNGO(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Browse NGOs</h1>
          <p className="text-muted-foreground">Find NGOs near you and see their current needs</p>
        </div>
        <Button onClick={getCurrentLocation} variant="outline">
          <MapPin className="h-4 w-4 mr-2" />
          Get My Location
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Map Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">NGO Locations</h2>
    <LoadScript
  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'demo-key'}
>

            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={10}
            >
              {/* User location marker */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="8" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
                      </svg>
                    `),
                  }}
                  title="Your Location"
                />
              )}

              {/* NGO markers */}
              {ngos.map((ngo) => (
                <Marker
                  key={ngo.id}
                  position={{ lat: ngo.lat, lng: ngo.lng }}
                  onClick={() => onMarkerClick(ngo)}
                  title={ngo.name}
                />
              ))}

              {/* Info window for selected NGO */}
              {selectedNGO && (
                <InfoWindow
                  position={{ lat: selectedNGO.lat, lng: selectedNGO.lng }}
                  onCloseClick={onInfoWindowClose}
                >
                  <div className="p-2 max-w-xs">
                    <h3 className="font-semibold text-lg">{selectedNGO.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{selectedNGO.address}</p>
                    <div className="space-y-2">
                      <Badge variant="secondary">{selectedNGO.category}</Badge>
                      <div>
                        <p className="text-sm font-medium">Current Needs:</p>
                        <p className="text-sm">{selectedNGO.needs.slice(0, 3).join(', ')}</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleDonateClick(selectedNGO)}
                        className="w-full"
                      >
                        Donate Now
                      </Button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* NGO List Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available NGOs</h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {ngos.map((ngo) => (
              <Card key={ngo.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{ngo.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {ngo.address}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{ngo.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    {ngo.contact}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Current Needs:</p>
                    <div className="flex flex-wrap gap-1">
                      {ngo.needs.map((need, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {need}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleDonateClick(ngo)}
                      className="flex-1"
                    >
                      Donate
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => onMarkerClick(ngo)}
                      className="flex-1"
                    >
                      View on Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}