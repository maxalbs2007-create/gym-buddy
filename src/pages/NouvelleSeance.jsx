import React, { useState } from 'react';
import ExerciceSelector from '../components/ExerciceSelector';
import SeanceStepper from '../components/SeanceStepper';
import MinuteurRepos from '../components/MinuteurRepos';
import SeanceSummary from '../components/SeanceSummary';

const NouvelleSeance = ({ profile, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [setsData, setSetsData] = useState([]);
  const [restConfig, setRestConfig] = useState(60);
  const [sessionSummary, setSessionSummary] = useState(null);

  // Gestion des étapes
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div className="nouvelle-seance-container">
      {step === 1 && !showSelector && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
          <button
            className="btn-primary"
            style={{ padding: '18px 32px', fontSize: 18, borderRadius: 18, fontWeight: 700 }}
            onClick={() => setShowSelector(true)}
          >
            Ajouter un exercice
          </button>
        </div>
      )}
      {step === 1 && showSelector && (
        <ExerciceSelector
          selectedExercises={selectedExercises}
          setSelectedExercises={setSelectedExercises}
          onNext={nextStep}
        />
      )}
      {step === 2 && (
        <SeanceStepper
          exercises={selectedExercises}
          setsData={setsData}
          setSetsData={setSetsData}
          onNext={nextStep}
          onPrev={prevStep}
        />
      )}
      {step === 3 && (
        <MinuteurRepos
          setsData={setsData}
          restConfig={restConfig}
          setRestConfig={setRestConfig}
          onFinish={(summary) => {
            setSessionSummary(summary);
            nextStep();
          }}
          onPrev={prevStep}
        />
      )}
      {step === 4 && (
        <SeanceSummary
          summary={sessionSummary}
          onPrev={prevStep}
          profile={profile}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

export default NouvelleSeance;
