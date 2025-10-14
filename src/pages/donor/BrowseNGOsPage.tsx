import { useState, useCallback } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone } from "lucide-react";
import { useDonorApp, type NGO } from "@/contexts/DonorAppContext";

const containerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 19.076, lng: 72.8777 };

interface DonationFormProps {
  ngo: NGO;
  onBack: () => void;
  onSubmit: (item: string, quantity: number, notes: string) => void;
}

function DonationForm({ ngo, onBack, onSubmit }: DonationFormProps) {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!item || quantity <= 0) {
      alert("Please enter valid item and quantity");
      return;
    }
    onSubmit(item, quantity, notes);
    setItem("");
    setQuantity(1);
    setNotes("");
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 border rounded shadow">
      <h2 className="text-2xl font-bold">{ngo.name} - Donate</h2>
      <p className="text-sm text-muted-foreground">{ngo.address}</p>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Item</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Quantity</label>
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Notes</label>
        <textarea
          className="w-full border p-2 rounded"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSubmit} className="flex-1">
          Donate
        </Button>
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
      </div>
    </div>
  );
}

export function BrowseNGOsPage() {
  const { ngos, addDonation } = useDonorApp();
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(location);
          setMapCenter(location);
        },
        () => alert("Unable to get your location. Using default location.")
      );
    } else alert("Geolocation not supported.");
  };

  const onMarkerClick = useCallback((ngo: NGO) => setSelectedNGO(ngo), []);
  const onInfoWindowClose = useCallback(() => setSelectedNGO(null), []);

  const handleDonateClick = (ngo: NGO) => {
    setSelectedNGO(ngo);
    setShowDonationForm(true);
  };

  const handleDonationSubmit = (item: string, quantity: number, notes: string) => {
    if (!selectedNGO) return;
    addDonation({
      donorName: "Anonymous Donor", // required for type safety
      ngoId: selectedNGO.id,
      ngoName: selectedNGO.name,
      item,
      quantity,
      notes,
    });
    setShowDonationForm(false);
    setSelectedNGO(null);
    alert("Donation added successfully!");
  };

  if (showDonationForm && selectedNGO) {
    return (
      <DonationForm
        ngo={selectedNGO}
        onBack={() => {
          setShowDonationForm(false);
          setSelectedNGO(null);
        }}
        onSubmit={handleDonationSubmit}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Browse NGOs</h1>
          <p className="text-muted-foreground">Find NGOs near you and explore their current needs.</p>
        </div>
        <Button onClick={getCurrentLocation} variant="outline">
          <MapPin className="h-4 w-4 mr-2" /> Get My Location
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Map Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">NGO Locations</h2>
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "demo-key"}>
            <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={10}>
              {userLocation && <Marker position={userLocation} title="Your Location" />}
              {ngos.map((ngo) => (
                <Marker
                  key={ngo.id}
                  position={{ lat: ngo.lat, lng: ngo.lng }}
                  onClick={() => onMarkerClick(ngo)}
                  title={ngo.name}
                />
              ))}
              {selectedNGO && (
                <InfoWindow
                  position={{ lat: selectedNGO.lat, lng: selectedNGO.lng }}
                  onCloseClick={onInfoWindowClose}
                >
                  <div>
                    <h3 className="font-bold">{selectedNGO.name}</h3>
                    <p>{selectedNGO.address}</p>
                    <Button size="sm" onClick={() => handleDonateClick(selectedNGO)}>
                      Donate
                    </Button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* NGO List Section */}
        <div className="space-y-4">
          {ngos.map((ngo) => (
            <Card key={ngo.id} className="border">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {ngo.name} <Badge variant="secondary">{ngo.category}</Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" /> {ngo.contact}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{ngo.address}</p>
                <div className="mt-2 space-x-2">
                  {ngo.needs.map((need, i) => (
                    <Badge key={i}>{need}</Badge>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => handleDonateClick(ngo)}>Donate</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
