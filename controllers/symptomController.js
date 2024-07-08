import Symptom from "../models/Symptom.js";

// Controller function to handle adding a new symptom
export const addSymptom = async (req, res) => {
    try {
        const symptom = new Symptom(req.body);
        const savedSymptom = await symptom.save();
        res.status(201).json(savedSymptom);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller function to handle retrieving all symptoms
export const getSymptoms = async (req, res) => {
    try {
        const symptoms = await Symptom.find();
        res.status(200).json(symptoms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
