export default function FeatureCard({ icon, title, description, gradient, iconColor, delay = 0 }) {
  return (
    <div 
      className="group relative overflow-hidden bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      {/* Floating particles effect */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl opacity-50"></div>
      
      {/* Icon container */}
      <div className={`relative w-16 h-16 ${iconColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
        {icon}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>
      </div>
      
      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
    </div>
  );
}