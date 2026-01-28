import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Pill, Trash2, Bell, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MedicineReminder = () => {
  const [medicines, setMedicines] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    time: '',
    notes: ''
  });

  // Load medicines from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('medicines') || '[]');
    setMedicines(saved);
  }, []);

  // Save to localStorage
  const saveMedicines = (updatedMedicines) => {
    localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
    setMedicines(updatedMedicines);
  };

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.time) {
      toast.error('Please fill medicine name and time');
      return;
    }

    const medicine = {
      ...newMedicine,
      id: Date.now(),
      taken: false,
      createdAt: new Date().toISOString()
    };

    saveMedicines([...medicines, medicine]);
    setNewMedicine({ name: '', dosage: '', frequency: 'Once daily', time: '', notes: '' });
    setShowAddForm(false);
    toast.success('Medicine reminder added!');
  };

  const handleDelete = (id) => {
    saveMedicines(medicines.filter(m => m.id !== id));
    toast.success('Reminder deleted');
  };

  const handleToggleTaken = (id) => {
    const updated = medicines.map(m =>
      m.id === id ? { ...m, taken: !m.taken } : m
    );
    saveMedicines(updated);
    toast.success('Status updated');
  };

  const frequencies = ['Once daily', 'Twice daily', 'Thrice daily', 'Every 4 hours', 'Every 6 hours', 'As needed'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl mb-4 shadow-xl">
            <Pill className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3">
            Medicine Reminder
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Never miss your medication schedule
          </p>
        </motion.div>

        {/* Add Medicine Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Medicine
          </button>
        </motion.div>

        {/* Add Medicine Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border-2 border-blue-200 dark:border-blue-800"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add Medicine Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Paracetamol"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Dosage
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 500mg, 2 tablets"
                    value={newMedicine.dosage}
                    onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Frequency
                  </label>
                  <select
                    value={newMedicine.frequency}
                    onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
                  >
                    {frequencies.map((freq) => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={newMedicine.time}
                    onChange={(e) => setNewMedicine({ ...newMedicine, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    placeholder="e.g., Take after meals"
                    value={newMedicine.notes}
                    onChange={(e) => setNewMedicine({ ...newMedicine, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none min-h-[80px]"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddMedicine}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
                  >
                    Add Reminder
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Medicine List */}
        {medicines.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-xl"
          >
            <Bell className="w-20 h-20 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No reminders yet</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Add your first medicine reminder to get started
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {medicines.map((medicine, idx) => (
              <motion.div
                key={medicine.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 transition-all ${
                  medicine.taken
                    ? 'border-green-300 dark:border-green-800 opacity-75'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-2xl font-bold ${
                        medicine.taken
                          ? 'text-green-600 dark:text-green-400 line-through'
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {medicine.name}
                      </h3>
                      {medicine.taken && (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Taken
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {medicine.dosage && (
                        <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <Pill className="w-4 h-4" />
                          <span className="font-semibold">Dosage:</span> {medicine.dosage}
                        </p>
                      )}
                      <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">Time:</span> {medicine.time} - {medicine.frequency}
                      </p>
                      {medicine.notes && (
                        <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span className="font-semibold">Note:</span> {medicine.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleToggleTaken(medicine.id)}
                        className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
                          medicine.taken
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {medicine.taken ? 'Mark as Pending' : 'Mark as Taken'}
                      </button>
                      <button
                        onClick={() => handleDelete(medicine.id)}
                        className="px-6 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-all flex items-center gap-2 font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineReminder;
