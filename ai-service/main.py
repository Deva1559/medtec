from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import os
from dotenv import load_dotenv
import json
import pickle
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(title="HEALX AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Models
class SeverityPredictionRequest(BaseModel):
    symptoms: list
    vitals: dict

class DiseasePredictor(BaseModel):
    symptoms: list
    age: int = None
    medicalHistory: list = None

class HealthScoreRequest(BaseModel):
    vitals: dict
    medicalHistory: list = None

class ChatRequest(BaseModel):
    message: str

# Initialize models
scaler = StandardScaler()

# Load disease prediction model
def load_disease_model():
    """Load the trained disease prediction model"""
    model_path = os.path.join(os.path.dirname(__file__), 'disease_model.pkl')
    try:
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
        logger.info("Disease prediction model loaded successfully")
        return model_data
    except FileNotFoundError:
        logger.warning("Model file not found. Creating new model...")
        # Import and run training
        from train_model import train_and_save_model
        return train_and_save_model()
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        return None

# Load the model
model_data = load_disease_model()
disease_model = model_data['model'] if model_data else None
symptom_columns = model_data['symptom_columns'] if model_data else []
diseases_list = model_data['diseases'] if model_data else []

class DiseasePredictionModel:
    def predict(self, symptoms):
        """Predict disease based on symptoms using the trained model"""
        if disease_model is None:
            return {
                'predicted_disease': 'Model not available',
                'confidence': 0,
                'recommendation': 'Please try again later'
            }
        
        # Create feature vector
        features = np.zeros(len(symptom_columns))
        for symptom in symptoms:
            if symptom in symptom_columns:
                idx = symptom_columns.index(symptom)
                features[idx] = 1
        
        # Make prediction
        prediction = disease_model.predict([features])[0]
        probabilities = disease_model.predict_proba([features])[0]
        confidence = float(np.max(probabilities))
        
        # Get top 3 predictions
        top_indices = np.argsort(probabilities)[-3:][::-1]
        top_predictions = [
            {
                'disease': disease_model.classes_[idx],
                'probability': float(probabilities[idx])
            }
            for idx in top_indices
        ]
        
        # Generate recommendation based on confidence
        if confidence > 0.8:
            recommendation = "High confidence prediction. Please consult a doctor for confirmation."
        elif confidence > 0.5:
            recommendation = "Moderate confidence. Multiple symptoms detected. Medical consultation recommended."
        else:
            recommendation = "Low confidence prediction. Please provide more symptoms or consult a doctor."
        
        return {
            'predicted_disease': prediction,
            'confidence': round(confidence * 100, 2),
            'top_predictions': top_predictions,
            'recommendation': recommendation,
            'symptoms_provided': symptoms
        }

# Dummy AI models for demo
class SimpleSeverityPredictor:
    def predict(self, symptoms, vitals):
        symptom_score = len(symptoms) * 0.2
        
        try:
            heart_rate = int(vitals.get('heartRate', 80))
            oxygen = int(vitals.get('oxygenLevel', 98))
            
            if heart_rate > 120 or oxygen < 90:
                symptom_score += 0.3
            if heart_rate > 140 or oxygen < 85:
                symptom_score += 0.3
        except:
            pass
        
        if symptom_score > 0.8:
            return {'prediction': 'critical', 'score': 0.95, 'confidence': 0.92}
        elif symptom_score > 0.5:
            return {'prediction': 'high', 'score': 0.75, 'confidence': 0.88}
        else:
            return {'prediction': 'medium', 'score': 0.5, 'confidence': 0.85}

class SimpleDiseasePredictor:
    def predict(self, symptoms):
        # Use the new ML model if available
        if disease_model is not None:
            ml_predictor = DiseasePredictionModel()
            return ml_predictor.predict(symptoms)
        
        # Fallback to simple mapping
        disease_mapping = {
            'chest pain': 'Cardiac Issues',
            'shortness of breath': 'Respiratory Problem',
            'headache': 'Migraine/CNS Disorder',
            'fever': 'Infection',
            'cough': 'Respiratory Infection',
            'nausea': 'Digestive Issue'
        }
        
        predicted_diseases = []
        for symptom in symptoms:
            for key, disease in disease_mapping.items():
                if key.lower() in symptom.lower():
                    predicted_diseases.append(disease)
        
        return {
            'predicted_diseases': list(set(predicted_diseases)) or ['General Illness'],
            'confidence': 0.85,
            'recommendation': 'Consult a medical professional'
        }


class SimpleHealthScorer:
    def score(self, vitals):
        score = 100
        
        try:
            heart_rate = int(vitals.get('heartRate', 70))
            if not (60 <= heart_rate <= 100):
                score -= 10
            
            oxygen = int(vitals.get('oxygenLevel', 98))
            if oxygen < 95:
                score -= 20
            
            temp = float(vitals.get('temperature', 98.6))
            if not (98 <= temp <= 99):
                score -= 10
        except:
            pass
        
        score = max(0, min(100, score))
        return {'score': score, 'status': 'healthy' if score > 70 else 'needs_attention'}

severity_predictor = SimpleSeverityPredictor()
disease_predictor = SimpleDiseasePredictor()
health_scorer = SimpleHealthScorer()

@app.get("/health")
async def health_check():
    model_status = "loaded" if disease_model is not None else "not_loaded"
    return {
        "status": "AI Service Running",
        "version": "1.0.0",
        "disease_model": model_status,
        "symptoms_count": len(symptom_columns),
        "diseases_count": len(diseases_list)
    }

@app.get("/api/symptoms")
async def get_available_symptoms():
    """Get list of all available symptoms for prediction"""
    return {
        "symptoms": symptom_columns,
        "count": len(symptom_columns),
        "diseases": diseases_list,
        "diseases_count": len(diseases_list)
    }


@app.post("/api/predict-severity")
async def predict_severity(request: SeverityPredictionRequest):
    try:
        result = severity_predictor.predict(request.symptoms, request.vitals)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict-disease")
async def predict_disease(request: DiseasePredictor):
    try:
        result = disease_predictor.predict(request.symptoms)
        return result
    except Exception as e:
        logger.error(f"Disease prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/health-score")
async def calculate_health_score(request: HealthScoreRequest):
    try:
        result = health_scorer.score(request.vitals)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/outbreak-prediction")
async def predict_outbreak():
    return {
        'disease': 'Seasonal Flu',
        'risk_score': 0.65,
        'locations': ['Delhi', 'NCR'],
        'recommendation': 'Increase vaccination camps in high-risk areas'
    }

@app.post("/api/chat")
async def medical_chatbot(request: ChatRequest):
    message = request.message.lower()
    
    responses = {
        'fever': 'A fever above 100.4°F (38°C) is abnormal. Stay hydrated, rest, and consult a doctor if it persists.',
        'headache': 'Common causes include dehydration, stress, or tension. Try rest and hydration.',
        'covid': 'Get vaccinated, wear masks in crowded areas, and stay home if symptoms appear.',
        'emergency': 'If this is a medical emergency, call 911 or visit the nearest hospital immediately.'
    }
    
    response = 'I can help with basic health information. Could you be more specific about your concern?'
    
    for key, value in responses.items():
        if key in message:
            response = value
            break
    
    return {'response': response, 'confidence': 0.8}

@app.post("/api/triage")
async def ai_triage(request: SeverityPredictionRequest):
    severity = severity_predictor.predict(request.symptoms, request.vitals)
    
    triage_data = {
        'severity': severity['prediction'],
        'urgency': 1 if severity['prediction'] == 'critical' else 2 if severity['prediction'] == 'high' else 3,
        'recommended_action': 'Immediate hospitalization' if severity['prediction'] == 'critical' else 'Urgent care',
        'estimated_wait_time': '5 mins' if severity['prediction'] == 'critical' else '30 mins'
    }
    
    return triage_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
