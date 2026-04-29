import { Search, User, Filter, Phone, MessageSquare } from 'lucide-react';

const leads = [
  { id: 1, name: 'Marie Koné', score: 95, status: 'HOT', last: 'Il y a 5 min' },
  { id: 2, name: 'Koffi Yao', score: 91, status: 'HOT', last: 'Il y a 12 min' },
  { id: 3, name: 'Awa Diallo', score: 88, status: 'HOT', last: 'Il y a 25 min' },
  { id: 4, name: 'Jean Zadi', score: 65, status: 'WARM', last: 'Hier' },
];

export default function LeadsModule() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Fiko Leads</h1>
            <p className="text-gray-400">Gérez et convertissez vos prospects</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-[#111] p-3 rounded-xl border border-gray-800 text-sm font-semibold hover:border-gray-600">
            <Filter size={16}/> Filtrer
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-gray-500" size={16} />
            <input type="text" placeholder="Rechercher un lead..." className="bg-[#111] border border-gray-800 rounded-xl p-3 pl-10 text-sm text-white w-64" />
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#111] text-gray-400 text-sm">
            <tr>
              <th className="p-4">Lead</th>
              <th className="p-4">Score</th>
              <th className="p-4">Statut</th>
              <th className="p-4">Dernière activité</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-800'>
            {leads.map(lead => (
              <tr key={lead.id} className='hover:bg-[#111] transition'>
                <td className="p-4 flex items-center gap-3">
                  <div className='bg-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm'>{lead.name[0]}</div>
                  <span className='font-semibold'>{lead.name}</span>
                </td>
                <td className="p-4 font-bold text-fiko-red">{lead.score}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${lead.status === 'HOT' ? 'bg-red-950 text-red-400' : 'bg-yellow-950 text-yellow-400'}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-400">{lead.last}</td>
                <td className="p-4 flex gap-2">
                  <button className='p-2 bg-gray-900 rounded-lg hover:bg-fiko-red transition'><MessageSquare size={16}/></button>
                  <button className='p-2 bg-gray-900 rounded-lg hover:bg-fiko-red transition'><Phone size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
