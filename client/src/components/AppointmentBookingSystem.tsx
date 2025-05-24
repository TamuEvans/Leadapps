import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock, User, Video, Phone, MessageCircle, DollarSign } from "lucide-react";

interface Counselor {
  id: number;
  name: string;
  avatar?: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  availableSlots: TimeSlot[];
  nextAvailable: string;
}

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  duration: number;
  isAvailable: boolean;
  sessionType: 'video' | 'phone' | 'in-person';
}

interface Appointment {
  id: number;
  counselorId: number;
  counselorName: string;
  date: string;
  time: string;
  duration: number;
  sessionType: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  meetingLink?: string;
  cost: number;
}

export default function AppointmentBookingSystem() {
  const [selectedCounselor, setSelectedCounselor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<string>("video");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(1); // 1: Select Counselor, 2: Select Time, 3: Confirm
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: counselors = [] } = useQuery({
    queryKey: ['/api/counselors'],
  });

  const { data: availableSlots = [] } = useQuery({
    queryKey: ['/api/counselors', selectedCounselor, 'availability', selectedDate?.toISOString().split('T')[0]],
    enabled: !!selectedCounselor && !!selectedDate,
  });

  const { data: myAppointments = [] } = useQuery({
    queryKey: ['/api/appointments/my-appointments'],
  });

  const bookAppointmentMutation = useMutation({
    mutationFn: (appointmentData: any) => 
      apiRequest('POST', '/api/appointments/book', appointmentData),
    onSuccess: () => {
      toast({
        title: "Appointment Booked Successfully!",
        description: "You'll receive a confirmation email with meeting details.",
      });
      setStep(1);
      setSelectedCounselor(null);
      setSelectedSlot(null);
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ['/api/appointments/my-appointments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const selectedCounselorData = counselors.find((c: Counselor) => c.id === selectedCounselor);
  const selectedSlotData = availableSlots.find((s: TimeSlot) => s.id === selectedSlot);

  const handleBookAppointment = () => {
    if (!selectedCounselor || !selectedSlot || !selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please select a counselor, date, and time slot.",
        variant: "destructive",
      });
      return;
    }

    const appointmentData = {
      counselorId: selectedCounselor,
      slotId: selectedSlot,
      date: selectedDate.toISOString().split('T')[0],
      sessionType,
      notes: notes.trim(),
    };

    bookAppointmentMutation.mutate(appointmentData);
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in-person': return <User className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNum}
            </div>
            {stepNum < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Counselor */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Choose Your Counselor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {counselors.map((counselor: Counselor) => (
              <Card
                key={counselor.id}
                className={`cursor-pointer transition-all ${
                  selectedCounselor === counselor.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedCounselor(counselor.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{counselor.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(Math.floor(counselor.rating))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {counselor.rating} ({counselor.reviewCount} reviews)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {counselor.specialties.slice(0, 2).map((specialty, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-green-600 font-medium">
                          {formatCurrency(counselor.hourlyRate)}/hour
                        </span>
                        <span className="text-xs text-gray-500">
                          Next: {new Date(counselor.nextAvailable).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={() => setStep(2)}
              disabled={!selectedCounselor}
            >
              Continue to Scheduling
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Select Date & Time */}
      {step === 2 && selectedCounselorData && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Select Date & Time</h3>
            <Button variant="outline" onClick={() => setStep(1)}>
              Change Counselor
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Time Slots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Available Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot: TimeSlot) => (
                        <Button
                          key={slot.id}
                          variant={selectedSlot === slot.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSlot(slot.id)}
                          disabled={!slot.isAvailable}
                          className="justify-start"
                        >
                          <div className="flex items-center gap-2">
                            {getSessionTypeIcon(slot.sessionType)}
                            <span>{slot.time}</span>
                          </div>
                        </Button>
                      ))}
                    </div>

                    {/* Session Type Selection */}
                    <div className="space-y-2">
                      <Label>Session Type</Label>
                      <Select value={sessionType} onValueChange={setSessionType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              Video Call
                            </div>
                          </SelectItem>
                          <SelectItem value="phone">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Phone Call
                            </div>
                          </SelectItem>
                          <SelectItem value="in-person">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              In-Person
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Share any specific topics or questions you'd like to discuss..."
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Please select a date to view available time slots
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button 
              onClick={() => setStep(3)}
              disabled={!selectedSlot}
            >
              Review Booking
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm Booking */}
      {step === 3 && selectedCounselorData && selectedSlotData && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Confirm Your Appointment</h3>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Counselor</span>
                  <span className="font-medium">{selectedCounselorData.name}</span>
                </div>
                
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="font-medium">
                    {selectedDate?.toLocaleDateString()} at {selectedSlotData.time}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{selectedSlotData.duration} minutes</span>
                </div>
                
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Session Type</span>
                  <div className="flex items-center gap-2">
                    {getSessionTypeIcon(sessionType)}
                    <span className="font-medium capitalize">{sessionType.replace('-', ' ')}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Cost</span>
                  <span className="font-medium text-lg">
                    {formatCurrency((selectedSlotData.duration / 60) * selectedCounselorData.hourlyRate)}
                  </span>
                </div>
                
                {notes && (
                  <div className="pb-4 border-b">
                    <span className="text-gray-600 block mb-2">Notes</span>
                    <p className="text-sm bg-gray-50 p-3 rounded">{notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back to Scheduling
            </Button>
            <Button 
              onClick={handleBookAppointment}
              disabled={bookAppointmentMutation.isPending}
              className="flex items-center gap-2"
            >
              {bookAppointmentMutation.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Booking...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4" />
                  Confirm & Pay
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      {myAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myAppointments.slice(0, 3).map((appointment: Appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.counselorName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatCurrency(appointment.cost)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}