import mongoose from "mongoose";

const SymptomSchema = new mongoose.Schema({
    symptom: { type: String, required: true },
    age: { type: String, required: true },
    diagnosed: { type: String, required: true },
    sex: { type: String, required: true },
    weight: { type: String, required: true },
    height: { type: String, required: true },
    alcoholConsumption: { type: String, required: true },
    medications: { type: String, required: true },
    alcoholFrequency: { type: String, required: true },
    familyHistory: { type: String, required: true },
    diseaseName: { type: String, required: true }
});

const Symptom = mongoose.model('Symptom', SymptomSchema);
export default Symptom;
