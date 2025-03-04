import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "@/Api/api";

const PredictPriceModal = ({ coinName, open, onClose }) => {
  const [selectedDays, setSelectedDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const handlePrediction = () => {
    setLoading(true);
    setPredictionResult(null);

    axios
      .get(`${API_BASE_URL}/coins/${coinName.toLowerCase()}/predict`, {
        params: { days: selectedDays },
        headers: { "ngrok-skip-browser-warning": "true" },
      })
      .then((response) => {
        console.log("Prediction response:", Object.values(response.data?.predicted_price || {})[0]);
        setPredictionResult(response.data.predicted_price);
      })
      .catch((error) => {
        console.error("Error fetching prediction:", error);
        setPredictionResult({ error: "Failed to fetch prediction. Please try again." });
      })
      .finally(() => setLoading(false));
  };

  const priceValue = Object.values(predictionResult?.predicted_price || {})[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Predict Price for {coinName}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-gray-600 text-center mb-4">Select prediction period:</p>
          <RadioGroup
            className="grid grid-cols-2 gap-4"
            value={selectedDays}
            onValueChange={(value) => setSelectedDays(Number(value))}
          >
            {[30, 90, 180, 330].map((days) => (
              <Label
                key={days}
                className={`cursor-pointer rounded-lg border px-4 py-3 text-center ${selectedDays === days ? "bg-orange-500 text-white" : "bg-gray-100"
                  }`}
              >
                <RadioGroupItem value={days.toString()} className="hidden" />
                {days} days
              </Label>
            ))}
          </RadioGroup>

          <div className="mt-6 flex justify-center">
            <Button onClick={handlePrediction} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                "Predict"
              )}
            </Button>
          </div>
        </div>

        {predictionResult && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
            {predictionResult.error ? (
              <p className="text-red-500">{predictionResult.error}</p>
            ) : (
              <div className="text-lg font-semibold">
                Predicted Price:
                <span className="text-green-600 ml-2">${Object.values(predictionResult)[0].toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PredictPriceModal;
