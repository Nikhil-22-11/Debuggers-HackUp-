const KPICard = ({ label, value, highlight, color }: { label: string; value: string; highlight?: boolean; color?: 'blue' | 'red' | 'green' | 'purple' }) => {
  let bgColor = 'bg-gray-50 border-gray-200'
  let textColor = 'text-gray-900'
  let accentColor = 'text-gray-600'
  
  if (highlight) {
    switch (color) {
      case 'red':
        bgColor = 'bg-red-50 border-red-200'
        textColor = 'text-red-600'
        accentColor = 'text-red-500'
        break
      case 'blue':
        bgColor = 'bg-blue-50 border-blue-200'
        textColor = 'text-blue-600'
        accentColor = 'text-blue-500'
        break
      case 'green':
        bgColor = 'bg-green-50 border-green-200'
        textColor = 'text-green-600'
        accentColor = 'text-green-500'
        break
      case 'purple':
        bgColor = 'bg-purple-50 border-purple-200'
        textColor = 'text-purple-600'
        accentColor = 'text-purple-500'
        break
    }
  }

  return (
    <div className={`rounded-xl border p-4 sm:p-6 ${bgColor} card-hover smooth-fade`}>
      <p className="text-xs sm:text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 sm:mb-3">{label}</p>
      <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${textColor}`}>
        {value}
      </p>
      <div className={`mt-3 h-1 w-12 rounded-full ${accentColor} opacity-30`}></div>
    </div>
  )
}

export default function KPICards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-4">
      <KPICard label="Total Traffic" value="2.4M" />
      <KPICard label="Bots Blocked" value="1.68M" highlight={true} color="red" />
      <KPICard label="Accuracy Rate" value="99.2%" highlight={true} color="blue" />
      <KPICard label="False Positives" value="0.08%" highlight={true} color="green" />
    </div>
  )
}
