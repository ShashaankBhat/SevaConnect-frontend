import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Calendar, Users } from "lucide-react";

interface AboutData {
  memberCount: string;
  establishedDate: string;
  description: string;
  paymentUpiId: string;
  paymentQrCode: string;
}

export default function NGOAboutViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    if (!id) return;
    const savedData = localStorage.getItem(`ngo_about_${id}`);
    if (savedData) setAboutData(JSON.parse(savedData));
  }, [id]);

  if (!aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
          <p className="text-gray-800">This is the public profile of the NGO</p>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline">
          Back
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Organization Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Building2 className="h-5 w-5" />
              Organization Details
            </CardTitle>
            <CardDescription className="text-gray-700">Basic information about the NGO</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="memberCount" className="text-gray-900">
                <Users className="h-4 w-4 inline mr-2" />
                Member Count
              </Label>
              <Input
                id="memberCount"
                type="number"
                value={aboutData.memberCount}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="establishedDate" className="text-gray-900">
                <Calendar className="h-4 w-4 inline mr-2" />
                Established Date
              </Label>
              <Input
                id="establishedDate"
                type="date"
                value={aboutData.establishedDate}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-900">Description</Label>
              <Textarea
                id="description"
                value={aboutData.description}
                disabled
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Online Payment Details</CardTitle>
            <CardDescription className="text-gray-700">Details donors can use to pay</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentUpiId" className="text-gray-900">UPI ID / Payment Number</Label>
              <Input
                id="paymentUpiId"
                value={aboutData.paymentUpiId}
                disabled
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
