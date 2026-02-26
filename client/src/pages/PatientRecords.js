import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { recordsAPI, aiAPI } from '../api/endpoints';
import AuthContext from '../context/AuthContext';


const PatientRecords = () => {
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Disease prediction state
  const [showDiseasePredictor, setShowDiseasePredictor] = useState(false);
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predicting, setPredicting] = useState(false);


  useEffect(() => {
    if (user) {
      fetchRecords();
      fetchSymptoms();
    }
  }, [user]);

  const fetchSymptoms = async () => {
    try {
      const res = await aiAPI.getSymptoms();
      setAvailableSymptoms(res.data.symptoms || []);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      // Fallback symptoms
      setAvailableSymptoms([
        'itching', 'skin_rash', 'continuous_sneezing', 'shivering', 'chills',
        'joint_pain', 'stomach_pain', 'acidity', 'vomiting', 'burning_micturition',
        'fatigue', 'weight_gain', 'anxiety', 'cold_hands_and_feets', 'weight_loss',
        'restlessness', 'lethargy', 'cough', 'high_fever', 'sunken_eyes',
        'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache',
        'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain',
        'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellowing_of_eyes',
        'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm',
        'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose',
        'congestion', 'chest_pain', 'weakness_in_limbs', 'fast_heart_rate',
        'dizziness', 'cramps', 'obesity', 'swollen_legs', 'mood_swings',
        'depression', 'irritability', 'muscle_pain', 'red_spots_over_body',
        'family_history', 'history_of_alcohol_consumption', 'fluid_overload'
      ]);
    }
  };

  const handleSymptomSelect = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSymptomRemove = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const predictDisease = async () => {
    if (selectedSymptoms.length === 0) return;
    
    try {
      setPredicting(true);
      const res = await aiAPI.predictDisease({ symptoms: selectedSymptoms });
      setPredictionResult(res.data);
    } catch (error) {
      console.error('Error predicting disease:', error);
      setPredictionResult({
        predicted_disease: 'Error',
        confidence: 0,
        recommendation: 'Unable to predict. Please try again.'
      });
    } finally {
      setPredicting(false);
    }
  };


  const fetchRecords = async () => {
    try {
      setLoading(true);
      // For patients, fetch only their records
      if (user?.role === 'patient') {
        const res = await recordsAPI.getPatientRecords(user.id);
        setRecords(res.data.records || res.data);
      } else {
        // For doctors/admins, fetch all records
        const res = await recordsAPI.getAllRecords();
        setRecords(res.data.records);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const getRecordTypeIcon = (type) => {
    switch (type) {
      case 'prescription': return '💊';
      case 'diagnosis': return '🩺';
      case 'lab_report': return '🧪';
      case 'imaging': return '🖼️';
      case 'vaccine': return '💉';
      default: return '📋';
    }
  };

  const getRecordTypeColor = (type) => {
    switch (type) {
      case 'prescription': return 'from-green-500/30 to-green-600/30 border-green-400/50 text-green-300';
      case 'diagnosis': return 'from-blue-500/30 to-blue-600/30 border-blue-400/50 text-blue-300';
      case 'lab_report': return 'from-purple-500/30 to-purple-600/30 border-purple-400/50 text-purple-300';
      case 'imaging': return 'from-pink-500/30 to-pink-600/30 border-pink-400/50 text-pink-300';
      case 'vaccine': return 'from-orange-500/30 to-orange-600/30 border-orange-400/50 text-orange-300';
      default: return 'from-gray-500/30 to-gray-600/30 border-gray-400/50 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading medical records...</p>
        </div>
      </div>
    );
  }

  const filteredRecords = activeTab === 'all'
    ? records
    : records.filter(r => r.recordType === activeTab);

  const title = user?.role === 'patient' ? '📋 Your Medical Records' : '📋 Medical Records';
  const isPatient = user?.role === 'patient';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            <p className="text-gray-400 text-lg">
              {isPatient ? 'Your complete medical history and records' : 'All medical records in the system'}
            </p>
          </div>
          
          {/* Buttons Section */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Health Assistant Button */}
            {isPatient && (
              <Link
                to="/chatbot"
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>🤖</span>
                Health Assistant
              </Link>
            )}
            
            {/* Disease Prediction Button */}
            <button
              onClick={() => setShowDiseasePredictor(!showDiseasePredictor)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>🔮</span>
              {showDiseasePredictor ? 'Hide Predictor' : 'Predict Disease'}
            </button>
          </div>
        </div>

        {/* Disease Prediction Panel */}
        {showDiseasePredictor && (
          <div className="mb-8 backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🔮</span> AI Disease Prediction
            </h2>
            <p className="text-gray-300 mb-4">Select your symptoms to get a disease prediction using machine learning.</p>
            
            {/* Selected Symptoms */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Selected Symptoms:</p>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.length === 0 ? (
                  <span className="text-gray-500 italic">No symptoms selected</span>
                ) : (
                  selectedSymptoms.map((symptom, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm flex items-center gap-2 border border-purple-400/50"
                    >
                      {symptom.replace(/_/g, ' ')}
                      <button
                        onClick={() => handleSymptomRemove(symptom)}
                        className="text-purple-300 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Symptom Selector */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Add Symptoms:</p>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleSymptomSelect(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
              >
                <option value="">Select a symptom...</option>
                {availableSymptoms
                  .filter(s => !selectedSymptoms.includes(s))
                  .map((symptom, idx) => (
                    <option key={idx} value={symptom} className="bg-slate-800">
                      {symptom.replace(/_/g, ' ')}
                    </option>
                  ))}
              </select>
            </div>

            {/* Predict Button */}
            <button
              onClick={predictDisease}
              disabled={selectedSymptoms.length === 0 || predicting}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {predicting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Analyzing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🔍</span> Predict Disease
                </span>
              )}
            </button>

            {/* Prediction Result */}
            {predictionResult && (
              <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3">Prediction Result</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Predicted Disease:</span>
                    <span className="text-xl font-bold text-purple-300">{predictionResult.predicted_disease}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Confidence:</span>
                    <span className="text-lg font-semibold text-green-300">{predictionResult.confidence}%</span>
                  </div>
                  {predictionResult.top_predictions && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-400 mb-2">Other Possibilities:</p>
                      <div className="space-y-1">
                        {predictionResult.top_predictions.slice(1).map((pred, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-400">{pred.disease}</span>
                            <span className="text-gray-300">{(pred.probability * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                    <p className="text-yellow-200 text-sm">
                      <span className="font-semibold">💡 Recommendation:</span> {predictionResult.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}


        {/* Empty State Alert */}
        {isPatient && records.length === 0 && (
          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-white/20 rounded-2xl p-6 mb-8">
            <p className="text-gray-300">📭 No medical records found. Your records will appear here as they are created by healthcare providers.</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8 flex overflow-x-auto gap-2 pb-4">
          {['all', 'prescription', 'diagnosis', 'lab_report', 'imaging'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'backdrop-blur-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                  : 'backdrop-blur-xl bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20 hover:border-white/30'
              }`}
            >
              {tab === 'all' ? '📋 All' : `${getRecordTypeIcon(tab)} ${tab.replace(/_/g, ' ').toUpperCase()}`}
            </button>
          ))}
        </div>

        {/* Records Grid */}
        {filteredRecords.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-gray-300 text-xl font-semibold mb-2">No records found</p>
            <p className="text-gray-400">No {activeTab !== 'all' ? activeTab.replace('_', ' ') : ''} records to display</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRecords.map((record) => (
              <div
                key={record._id}
                className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                {/* Record Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{getRecordTypeIcon(record.recordType)}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {record.diagnosis || record.recordType?.replace(/_/g, ' ').toUpperCase()}
                        </h3>
                        {record.doctor && (
                          <p className="text-gray-400 text-sm">
                            👨‍⚕️ Dr. {record.doctor?.firstName} {record.doctor?.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">📅 {new Date(record.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-bold border bg-gradient-to-r ${getRecordTypeColor(record.recordType)}`}>
                    {record.recordType?.toUpperCase().replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Record Content */}
                <div className="p-6 space-y-6">
                  {/* Vital Signs */}
                  {record.vitals && (
                    <div>
                      <p className="text-lg font-semibold text-white mb-3">❤️ Vital Signs</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {record.vitals.heartRate && (
                          <div className="p-4 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-xl border border-pink-400/30">
                            <p className="text-gray-400 text-sm mb-1">Heart Rate</p>
                            <p className="text-2xl font-bold text-pink-300">{record.vitals.heartRate}</p>
                            <p className="text-gray-500 text-xs">bpm</p>
                          </div>
                        )}
                        {record.vitals.bloodPressure && (
                          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30">
                            <p className="text-gray-400 text-sm mb-1">Blood Pressure</p>
                            <p className="text-2xl font-bold text-blue-300">{record.vitals.bloodPressure}</p>
                            <p className="text-gray-500 text-xs">mmHg</p>
                          </div>
                        )}
                        {record.vitals.temperature && (
                          <div className="p-4 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl border border-orange-400/30">
                            <p className="text-gray-400 text-sm mb-1">Temperature</p>
                            <p className="text-2xl font-bold text-orange-300">{record.vitals.temperature}</p>
                            <p className="text-gray-500 text-xs">°C</p>
                          </div>
                        )}
                        {record.vitals.oxygenLevel && (
                          <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
                            <p className="text-gray-400 text-sm mb-1">Oxygen Level</p>
                            <p className="text-2xl font-bold text-green-300">{record.vitals.oxygenLevel}</p>
                            <p className="text-gray-500 text-xs">%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Prescription */}
                  {record.prescription && record.prescription.length > 0 && (
                    <div>
                      <p className="text-lg font-semibold text-white mb-3">💊 Prescription</p>
                      <div className="space-y-3">
                        {record.prescription.map((med, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-400/30"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white font-semibold">{med.medicine}</p>
                                <p className="text-gray-400 text-sm">{med.dosage} • {med.frequency}</p>
                              </div>
                              {med.duration && (
                                <span className="text-gray-400 text-sm">{med.duration}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Symptoms */}
                  {record.symptoms && record.symptoms.length > 0 && (
                    <div>
                      <p className="text-lg font-semibold text-white mb-3">🩺 Symptoms</p>
                      <div className="flex flex-wrap gap-2">
                        {record.symptoms.map((symptom, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-red-500/30 to-red-600/30 text-red-300 text-sm rounded-full border border-red-400/50"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {record.notes && (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">📝 Notes</p>
                      <p className="text-gray-300">{record.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRecords;
