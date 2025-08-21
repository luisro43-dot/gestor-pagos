// /src/components/AddPaymentForm.jsx
import React, { useState, useEffect, useCallback } from 'react';

// Hook personalizado para encapsular la lógica de la Web Speech API
const useSpeechRecognition = (onResult) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Web Speech API no es soportada en este navegador.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'es-ES';
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = (event) => console.error('Error en reconocimiento de voz:', event.error);
    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    setRecognition(rec);

    return () => rec.stop();
  }, [onResult]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      recognition.start();
    }
  }, [recognition, isListening]);

  return { isListening, startListening };
};


const AddPaymentForm = ({ services, onAddPayment, isLoading }) => {
  const [formData, setFormData] = useState({
    nombre_servicio: '',
    dia: '',
    mes: '',
    ano: '',
    importe: '',
    metodo_pago: '',
  });

  // Máquina de estados para el flujo conversacional
  const [step, setStep] = useState('IDLE'); // IDLE, ASKING_*, CONFIRMING_*, FINALIZED
  const [transcript, setTranscript] = useState('');

  const fieldOrder = ['nombre_servicio', 'dia', 'mes', 'ano', 'importe', 'metodo_pago'];
  const questions = {
    nombre_servicio: '¿Cuál es el servicio?',
    dia: '¿Qué día?',
    mes: '¿En qué mes se pagó?',
    ano: '¿Qué año?',
    importe: '¿Cuál es el importe?',
    metodo_pago: '¿Cuál es el método de pago?',
  };

  // Lógica de reconocimiento de voz
  const handleSpeechResult = useCallback((result) => {
    setTranscript(result);
  }, []);

  const { isListening, startListening } = useSpeechRecognition(handleSpeechResult);

  // Efecto para procesar el resultado de la voz cuando se recibe
  useEffect(() => {
    if (transcript && step.startsWith('ASKING_')) {
      const currentField = step.replace('ASKING_', '').toLowerCase();
      setFormData(prev => ({ ...prev, [currentField]: transcript }));
      setStep(`CONFIRMING_${currentField.toUpperCase()}`);
      setTranscript(''); // Reset transcript
    }
  }, [transcript, step]);


  // Inicia o avanza el flujo conversacional
  const handleMainMicClick = () => {
    if (step === 'IDLE') {
      const firstField = fieldOrder[0];
      setStep(`ASKING_${firstField.toUpperCase()}`);
      startListening();
    }
  };

  // Maneja la lógica de los botones de confirmación
  const handleConfirmation = (isCorrect) => {
    const currentFieldKey = step.replace('CONFIRMING_', '').toLowerCase();
    const currentFieldIndex = fieldOrder.indexOf(currentFieldKey);

    if (isCorrect) {
      if (currentFieldIndex < fieldOrder.length - 1) {
        const nextField = fieldOrder[currentFieldIndex + 1];
        setStep(`ASKING_${nextField.toUpperCase()}`);
        startListening();
      } else {
        setStep('FINALIZED');
      }
    } else {
      // Limpiar el campo y volver a preguntar
      setFormData(prev => ({ ...prev, [currentFieldKey]: '' }));
      setStep(`ASKING_${currentFieldKey.toUpperCase()}`);
      startListening();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step !== 'FINALIZED') {
        alert("Por favor completa todos los pasos del formulario de voz.");
        return;
    }

    // 1. Construir el objeto de pago final para enviar al padre
    // Nota: La API de backend espera `fecha_pago`, no día, mes, año por separado.
    // Aquí podrías agregar una lógica para convertir mes (ej. "Enero") a número si es necesario.
    const finalPaymentData = {
        nombre_servicio: formData.nombre_servicio,
        // Asumimos que el año, mes y día son números válidos.
        fecha_pago: `${formData.ano}-${formData.mes.padStart(2, '0')}-${formData.dia.padStart(2, '0')}`,
        importe: formData.importe,
        metodo_pago: formData.metodo_pago,
    };

    // 2. Enviar el nuevo pago al componente padre para actualizar el historial
    onAddPayment(finalPaymentData);

    // 3. Limpiar y reiniciar el formulario y el flujo de voz
    setFormData({
        nombre_servicio: '',
        dia: '',
        mes: '',
        ano: '',
        importe: '',
        metodo_pago: '',
    });
    setStep('IDLE'); // Reactivar el flujo de voz

    alert('¡Gasto registrado con éxito!');
  };
  
  const renderConfirmationPanel = () => {
    if (!step.startsWith('CONFIRMING_')) return null;

    return (
      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <p className="text-center mb-2 text-sm text-gray-700">¿Es correcto?</p>
        <div className="flex justify-center gap-2">
          <button type="button" onClick={() => handleConfirmation(true)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">Correcto</button>
          <button type="button" onClick={() => handleConfirmation(false)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Incorrecto</button>
          <button type="button" onClick={() => handleConfirmation(false)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">Modificar</button>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Registrar Gasto (Modo Conversacional)</h3>
        <button 
            type="button" 
            onClick={handleMainMicClick} 
            disabled={step !== 'IDLE' || isListening}
            className={`w-12 h-12 rounded-full text-white text-2xl flex items-center justify-center transition-all ${step !== 'IDLE' || isListening ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            title="Iniciar registro por voz"
        >
          🎤
        </button>
      </div>

      {step !== 'IDLE' && (
        <div className="space-y-3">
            {fieldOrder.map(field => (
                <div key={field}>
                    <label className="text-sm font-medium text-gray-600 capitalize">{field.replace('_', ' ')}</label>
                    <input type="text" value={formData[field]} readOnly className="w-full p-2 mt-1 bg-gray-200 border rounded-md" />
                </div>
            ))}

            <div className="mt-4 text-center p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-blue-800">
                    {isListening ? 'Escuchando...' : questions[step.replace(/ASKING_|CONFIRMING_/, '').toLowerCase()] || 'Confirmación'}
                </p>
            </div>

            {renderConfirmationPanel()}
        </div>
      )}

      <button type="submit" disabled={isLoading || step !== 'FINALIZED'} className="w-full mt-4 py-2 px-4 bg-indigo-600 text-white rounded-md disabled:bg-gray-400">
        {isLoading ? 'Guardando...' : 'Registrar Gasto'}
      </button>
    </form>
  );
};

export default AddPaymentForm;


