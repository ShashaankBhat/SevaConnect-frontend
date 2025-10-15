import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone } from "lucide-react";
import { useDonorApp, type NGO } from "@/contexts/DonorAppContext";
import { useApp, type Need } from "@/contexts/AppContext";

const containerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 20.0004, lng: 75.2245 };
const LIBRARIES: ("places")[] = ["places"];

interface DonationFormProps {
  ngo: NGO;
  onBack: () => void;
  onSubmit: (item: string, quantity: number, notes: string, donorName: string) => void;
}

function DonationForm({ ngo, onBack, onSubmit }: DonationFormProps) {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [donorName, setDonorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = () => {
    if (!item || quantity <= 0) {
      alert("Please enter valid item and quantity");
      return;
    }
    const finalDonorName = isAnonymous ? "Anonymous Donor" : donorName || "Unnamed Donor";
    onSubmit(item, quantity, notes, finalDonorName);
    setItem("");
    setQuantity(1);
    setNotes("");
    setDonorName("");
    setIsAnonymous(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 border rounded shadow-lg bg-white">
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

      <div className="space-y-2">
        <label className="block text-sm font-medium">Donor Name</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          disabled={isAnonymous}
          placeholder="Enter your name"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <label className="text-sm">Donate Anonymously</label>
        </div>
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

// Subcomponent for displaying NGO Needs
function NGOCardNeeds({ ngoNeeds }: { ngoNeeds: Need[] }) {
  const [showAll, setShowAll] = useState(false);

  const urgencyOrder = { High: 1, Medium: 2, Low: 3 };
  const sortedNeeds = [...ngoNeeds].sort(
    (a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
  );

  const displayedNeeds = showAll ? sortedNeeds : sortedNeeds.slice(0, 3);

  return (
    <div className="pt-2">
      <p className="text-sm font-medium text-gray-800 mb-2">Needs:</p>

      {ngoNeeds.length === 0 ? (
        <span className="text-xs text-muted-foreground">No needs currently</span>
      ) : (
        <>
          <div className="space-y-3">
            {displayedNeeds.map((need) => (
              <div
                key={need.id}
                className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-800 text-sm">
                    {need.itemName} ({need.quantity})
                  </span>
                  <Badge
                    variant={
                      need.urgency === "High"
                        ? "destructive"
                        : need.urgency === "Medium"
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {need.urgency} Priority
                  </Badge>
                </div>
                {need.category && (
                  <p className="text-xs text-gray-600 mb-1">
                    Category: <span className="font-medium">{need.category}</span>
                  </p>
                )}
                {need.description && (
                  <p className="text-xs text-gray-600 mb-1">{need.description}</p>
                )}
                {need.expiryDate && (
                  <p className="text-xs text-gray-500 italic">
                    Needed by: {new Date(need.expiryDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>

          {ngoNeeds.length > 3 && (
            <div className="flex justify-center mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : `View All Needs (${ngoNeeds.length})`}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function BrowseNGOsPage() {
  const { ngos, addDonation } = useDonorApp();
  const { needs } = useApp();

  const navigate = useNavigate();
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const mapRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const animateMapCenter = (location: { lat: number; lng: number }, zoom?: number) => {
    if (mapRef.current) {
      mapRef.current.panTo(location);
      if (zoom) mapRef.current.setZoom(zoom);
    }
    setMapCenter(location);
    if (zoom) setMapZoom(zoom);
  };

  const filteredNGOs = useMemo(
    () =>
      ngos.filter(
        (ngo) =>
          ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (categoryFilter ? ngo.category === categoryFilter : true)
      ),
    [ngos, searchQuery, categoryFilter]
  );

  const onMarkerClick = useCallback((ngo: NGO) => {
    setSelectedNGO(ngo);
    animateMapCenter({ lat: Number(ngo.lat), lng: Number(ngo.lng) }, 14);
  }, []);

  const onInfoWindowClose = useCallback(() => setSelectedNGO(null), []);

  const handleDonateClick = (ngo: NGO) => {
    setSelectedNGO(ngo);
    setShowDonationForm(true);
    animateMapCenter({ lat: Number(ngo.lat), lng: Number(ngo.lng) }, 14);
  };

  const handleAboutClick = (ngo: NGO) => {
    navigate(`/donor/dashboard/ngo/${ngo.id}/about`);
  };

  const handleDonationSubmit = (item: string, quantity: number, notes: string, donorName: string) => {
    if (!selectedNGO) return;
    addDonation({
      donorName,
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

  useEffect(() => {
    if (!mapRef.current || !inputRef.current || !(window as any).google) return;
    const autocomplete = new (window as any).google.maps.places.Autocomplete(inputRef.current);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;
      animateMapCenter(
        { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
        14
      );
    });
  }, []);

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

  const categories = Array.from(new Set(ngos.map((ngo) => ngo.category)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Browse NGOs</h1>
        <p className="text-muted-foreground">Find NGOs near you and explore their current needs.</p>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for NGOs on map"
          className="border p-2 rounded flex-1 min-w-[200px]"
        />
        <input
          type="text"
          placeholder="Filter by NGO name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[200px]"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded min-w-[150px]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">NGO Locations</h2>
          <LoadScript
            googleMapsApiKey="AIzaSyDc1wJOONiQgDox6_djhIGSXwva7HCVOeo"
            libraries={LIBRARIES}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={mapZoom}
              onLoad={(map) => {
                mapRef.current = map;
              }}
            >
              {filteredNGOs.map((ngo) => (
                <Marker
                  key={ngo.id}
                  position={{ lat: Number(ngo.lat), lng: Number(ngo.lng) }}
                  onClick={() => onMarkerClick(ngo)}
                  title={ngo.name}
                />
              ))}
              {selectedNGO && (
                <InfoWindow
                  position={{ lat: Number(selectedNGO.lat), lng: Number(selectedNGO.lng) }}
                  onCloseClick={onInfoWindowClose}
                >
                  <div className="space-y-2">
                    <h3 className="font-bold">{selectedNGO.name}</h3>
                    <p>{selectedNGO.address}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => handleDonateClick(selectedNGO)}>
                        Donate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAboutClick(selectedNGO)}>
                        About Us
                      </Button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          {filteredNGOs.map((ngo) => {
            const ngoNeeds = needs?.filter((need) => need.ngoId === ngo.id) || [];

            return (
              <Card
                key={ngo.id}
                className="border shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden"
              >
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex justify-between items-center text-lg font-semibold">
                    <span>{ngo.name}</span>
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {ngo.category}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-sm mt-1">
                    <Phone className="h-4 w-4 text-gray-500" /> {ngo.contact}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <p className="text-sm text-gray-600 leading-snug">{ngo.address}</p>
                  </div>

                  <NGOCardNeeds ngoNeeds={ngoNeeds} />

                  <div className="pt-4 flex justify-end gap-2">
                    <Button
                      onClick={() => handleDonateClick(ngo)}
                      className="px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Donate
                    </Button>
                    <Button
                      onClick={() => handleAboutClick(ngo)}
                      variant="outline"
                      className="px-5 rounded-lg"
                    >
                      About Us
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
