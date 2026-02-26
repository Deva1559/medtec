import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle
import os

def train_and_save_model():
    """Train the disease prediction model and save it"""
    
    # Load the dataset
    # Note: In production, this would be downloaded from Kaggle or another source
    # For now, we'll create a mock dataset based on the notebook structure
    
    print("Loading dataset...")
    
    # Create symptom columns (132 symptoms)
    symptom_columns = [
        'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering', 
        'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting',
        'vomiting', 'burning_micturition', 'spotting_urination', 'fatigue', 'weight_gain',
        'anxiety', 'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness',
        'lethargy', 'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever',
        'sunken_eyes', 'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache',
        'yellowish_skin', 'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes',
        'back_pain', 'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine',
        'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach',
        'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm', 'throat_irritation',
        'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 'chest_pain',
        'weakness_in_limbs', 'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region',
        'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising',
        'obesity', 'swollen_legs', 'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid',
        'brittle_nails', 'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts',
        'drying_and_tingling_lips', 'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness',
        'stiff_neck', 'swelling_joints', 'movement_stiffness', 'spinning_movements', 'loss_of_balance',
        'unsteadiness', 'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort',
        'foul_smell_of_urine', 'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching',
        'toxic_look_(typhos)', 'depression', 'irritability', 'muscle_pain', 'altered_sensorium',
        'red_spots_over_body', 'belly_pain', 'abnormal_menstruation', 'dischromic_patches',
        'watering_from_eyes', 'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum',
        'rusty_sputum', 'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion',
        'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'distention_of_abdomen',
        'history_of_alcohol_consumption', 'fluid_overload.1', 'blood_in_sputum', 'prominent_veins_on_calf',
        'palpitations', 'painful_walking', 'pus_filled_pimples', 'blackheads', 'scurring',
        'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails',
        'blister', 'red_sore_around_nose', 'yellow_crust_ooze'
    ]
    
    # Create disease labels (41 diseases)
    diseases = [
        'Fungal infection', 'Allergy', 'GERD', 'Chronic cholestasis', 'Drug Reaction',
        'Peptic ulcer diseae', 'AIDS', 'Diabetes', 'Gastroenteritis', 'Bronchial Asthma',
        'Hypertension', 'Migraine', 'Cervical spondylosis', 'Paralysis (brain hemorrhage)',
        'Jaundice', 'Malaria', 'Chicken pox', 'Dengue', 'Typhoid', 'hepatitis A',
        'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Hepatitis E', 'Alcoholic hepatitis',
        'Tuberculosis', 'Common Cold', 'Pneumonia', 'Dimorphic hemmorhoids(piles)',
        'Heart attack', 'Varicose veins', 'Hypothyroidism', 'Hyperthyroidism', 'Hypoglycemia',
        'Osteoarthristis', 'Arthritis', '(vertigo) Paroymsal  Positional Vertigo', 'Acne',
        'Urinary tract infection', 'Psoriasis', 'Impetigo'
    ]
    
    # Create a simple mock dataset for demonstration
    # In production, this would load the actual Kaggle dataset
    np.random.seed(42)
    n_samples = 5000
    
    # Generate random symptom data
    data = np.random.randint(0, 2, size=(n_samples, len(symptom_columns)))
    
    # Assign diseases based on some symptom combinations
    labels = []
    for i in range(n_samples):
        # Simple rule-based assignment for demo
        row = data[i]
        if row[4] == 1 and row[5] == 1 and row[25] == 1:  # shivering, chills, high_fever
            labels.append('Malaria')
        elif row[30] == 1 and row[31] == 1:  # indigestion, headache
            labels.append('Migraine')
        elif row[38] == 1 and row[39] == 1:  # diarrhoea, mild_fever
            labels.append('Gastroenteritis')
        elif row[48] == 1 and row[49] == 1:  # chest_pain, breathlessness
            labels.append('Bronchial Asthma')
        else:
            labels.append(np.random.choice(diseases))
    
    # Create DataFrame
    df = pd.DataFrame(data, columns=symptom_columns)
    df['prognosis'] = labels
    
    print(f"Dataset shape: {df.shape}")
    print(f"Number of diseases: {df['prognosis'].nunique()}")
    
    # Prepare features and target
    X = df.drop('prognosis', axis=1)
    y = df['prognosis']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Random Forest model
    print("Training Random Forest model...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)
    
    # Evaluate
    train_pred = rf_model.predict(X_train)
    test_pred = rf_model.predict(X_test)
    
    train_acc = accuracy_score(y_train, train_pred)
    test_acc = accuracy_score(y_test, test_pred)
    
    print(f"Training accuracy: {train_acc:.4f}")
    print(f"Testing accuracy: {test_acc:.4f}")
    
    # Save the model
    model_data = {
        'model': rf_model,
        'symptom_columns': symptom_columns,
        'diseases': diseases,
        'accuracy': test_acc
    }
    
    model_path = os.path.join(os.path.dirname(__file__), 'disease_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model_data, f)
    
    print(f"Model saved to {model_path}")
    return model_data

if __name__ == "__main__":
    train_and_save_model()
