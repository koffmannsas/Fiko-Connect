
export default function AutomationModule() {
  return (
    <div className="text-white">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Automation</h1>
        <p className="text-gray-400">
          Créez des scénarios qui vendent automatiquement
        </p>
      </div>

      {/* STATUS */}
      <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800 mb-6 flex items-center justify-between">
        <div>
            <h3 className='font-bold text-lg'>⚙️ Automatisation active</h3>
            <p className='text-sm text-gray-400'>3 scénarios en cours • 12 leads traités automatiquement aujourd’hui</p>
        </div>
        <div className='flex gap-2'>
            <button className="bg-fiko-red text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700">
            ➕ Nouveau scénario
            </button>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700">
            📂 Templates
            </button>
        </div>
      </div>

      {/* SCENARIO LIST */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800 flex flex-col gap-2">
          <h3 className="font-bold text-lg">Closing automatique</h3>
          <p className="text-gray-400 text-sm">
            Conversion : 18% <br />
            Revenus : 120 000 FCFA
          </p>
          <button className='text-sm text-fiko-red font-semibold hover:underline mt-4 self-start'>Optimiser</button>
        </div>
         <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800 flex flex-col gap-2">
          <h3 className="font-bold text-lg">Relance Panier</h3>
          <p className="text-gray-400 text-sm">
            Conversion : 12% <br />
            Revenus : 45 000 FCFA
          </p>
          <button className='text-sm text-fiko-red font-semibold hover:underline mt-4 self-start'>Optimiser</button>
        </div>
      </div>
    </div>
  );
}
