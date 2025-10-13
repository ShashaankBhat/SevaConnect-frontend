import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useVolunteer } from "@/contexts/VolunteerContext";
import { useDonorAuth } from "@/contexts/DonorAuthContext";
import { CheckCircle, Clock, Users } from "lucide-react";

export default function VolunteerRequestForm() {
  const { toast } = useToast();
  const { donor } = useDonorAuth();
  const { addVolunteerRequest } = useVolunteer();

  const [selectedNGO, setSelectedNGO] = useState("");
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get NGOs from localStorage
  const ngos = JSON.parse(localStorage.getItem("sevaconnect_ngos") || "[]")
    .filter((ngo: any) => ngo.status === "Verified")
    .map((ngo: any) => ({
      id: ngo.id,
      name: ngo.name,
      category: ngo.category,
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!donor) {
      toast({
        title: "Authentication Required",
        description: "Please login as a donor to submit volunteer requests.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedNGO) {
      toast({
        title: "NGO Selection Required",
        description: "Please select an NGO to volunteer for.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedNGOData = ngos.find((ngo: any) => ngo.id === selectedNGO);
      if (!selectedNGOData) throw new Error("Selected NGO not found");

      addVolunteerRequest({
        donorId: donor.id,
        donorName: donor.name,
        donorEmail: donor.email,
        ngoId: selectedNGO,
        ngoName: selectedNGOData.name,
        status: "Pending",
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        availability: availability.split(",").map((a) => a.trim()).filter(Boolean),
        notes,
      });

      toast({
        title: "Volunteer Request Submitted!",
        description: "Your volunteer request has been sent for approval.",
        duration: 5000,
      });

      // Reset form
      setSelectedNGO("");
      setSkills("");
      setAvailability("");
      setNotes("");
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!donor) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Please login as a donor to submit volunteer requests.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          Volunteer Request Form
        </CardTitle>
        <CardDescription>
          Submit your volunteer request to help NGOs in need. Your request will be reviewed by our admin team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Donor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label className="text-muted-foreground">Donor Name</Label>
              <p className="font-medium">{donor.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{donor.email}</p>
            </div>
          </div>

          {/* NGO Selection */}
          <div className="space-y-2">
            <Label htmlFor="ngo">Select NGO to Volunteer For *</Label>
            <Select value={selectedNGO} onValueChange={setSelectedNGO}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an NGO" />
              </SelectTrigger>
              <SelectContent>
                {ngos.length === 0 ? (
                  <SelectItem value="" disabled>
                    No verified NGOs available
                  </SelectItem>
                ) : (
                  ngos.map((ngo: any) => (
                    <SelectItem key={ngo.id} value={ngo.id}>
                      <div className="flex items-center justify-between">
                        <span>{ngo.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {ngo.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {ngos.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No verified NGOs are currently available for volunteering.
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills & Expertise</Label>
            <Input
              id="skills"
              placeholder="e.g., Teaching, Medical, Construction, Cooking... (separate with commas)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              List your relevant skills and areas of expertise
            </p>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              placeholder="e.g., Weekends, Evenings, Full-time... (separate with commas)"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Describe when you're available to volunteer
            </p>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information about your volunteer preferences, experience, or special requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {/* Submission Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">Approval Process</p>
                <p className="text-xs text-blue-700">
                  Your volunteer request will be reviewed by our admin team. 
                  You'll receive notification once it's approved or scheduled.
                </p>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full flex justify-center items-center gap-2" 
            disabled={isSubmitting || !selectedNGO || ngos.length === 0}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting Request...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Submit Volunteer Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
