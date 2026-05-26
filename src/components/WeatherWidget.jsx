/**
 * WeatherWidget — Clima Amazónico e Interactivo de Alto Impacto
 * Implementa Open-Meteo API (sin necesidad de API keys) con fallback.
 * Cuenta con efectos climáticos premium hiperrealistas dibujados en Canvas:
 * - Clear: Sol giratorio con halo de luz y lens flares reactivos.
 * - Rain/Drizzle: Gotas de lluvia realistas con salpicaduras (splashes) en el borde inferior.
 * - Thunderstorm: Destellos de luz y relámpagos fractales dinámicos.
 * - Clouds: Nubes con gradiente tridimensional flotando a distintas velocidades.
 * - Mist/Fog: Ondas de niebla fluidas que oscilan con ruido sinusoidal.
 * Presenta un diseño Bento Grid premium al estilo Apple Weather con pronóstico de 4 días y selector de ciudades.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Cloud, Sun, CloudRain, CloudLightning, CloudDrizzle, CloudFog, 
  Thermometer, Droplets, Wind, MapPin, Calendar, Umbrella, CloudSun 
} from 'lucide-react';

const CITIES = [
  { id: 'tarapoto', name: 'Tarapoto', lat: -6.4894, lon: -76.3725, region: 'San Martín' },
  { id: 'sauce', name: 'Sauce (Laguna Azul)', lat: -6.7056, lon: -76.2239, region: 'San Martín' },
  { id: 'lamas', name: 'Lamas', lat: -6.4250, lon: -76.5167, region: 'San Martín' },
  { id: 'moyobamba', name: 'Moyobamba', lat: -6.0342, lon: -76.9717, region: 'San Martín' },
  { id: 'chachapoyas', name: 'Chachapoyas', lat: -6.2294, lon: -77.8697, region: 'Amazonas' }
];

const weatherCodes = {
  0: { main: 'clear', description: 'Cielo Despejado', icon: Sun },
  1: { main: 'clouds', description: 'Principalmente Despejado', icon: CloudSun },
  2: { main: 'clouds', description: 'Parcialmente Nublado', icon: CloudSun },
  3: { main: 'clouds', description: 'Nublado', icon: Cloud },
  45: { main: 'mist', description: 'Neblina Húmeda', icon: CloudFog },
  48: { main: 'mist', description: 'Niebla Densa', icon: CloudFog },
  51: { main: 'drizzle', description: 'Llovizna Leve', icon: CloudDrizzle },
  53: { main: 'drizzle', description: 'Llovizna Moderada', icon: CloudDrizzle },
  55: { main: 'drizzle', description: 'Llovizna Intensa', icon: CloudDrizzle },
  61: { main: 'rain', description: 'Lluvia Ligera', icon: CloudRain },
  63: { main: 'rain', description: 'Lluvia Moderada', icon: CloudRain },
  65: { main: 'rain', description: 'Lluvia Intensa', icon: CloudRain },
  80: { main: 'rain', description: 'Chubascos de Lluvia', icon: CloudRain },
  81: { main: 'rain', description: 'Chubascos Fuertes', icon: CloudRain },
  95: { main: 'thunderstorm', description: 'Tormenta Eléctrica', icon: CloudLightning },
  96: { main: 'thunderstorm', description: 'Tormenta con Granizo Leve', icon: CloudLightning },
  99: { main: 'thunderstorm', description: 'Tormenta Eléctrica Severa', icon: CloudLightning },
};

const activitySuggestions = {
  clear: ['Caminata por senderos', 'Canopy y tirolesa', 'Visita a cataratas', 'Piscina del Lodge'],
  clouds: ['Tour por la ciudad', 'Avistamiento de aves', 'Paseo en bote', 'Senderismo fotográfico'],
  rain: ['Spa y masajes amazónicos', 'Taller de chocolate', 'Degustación de café local', 'Lectura de mitos'],
  thunderstorm: ['Relajación en hamaca', 'Clase de cocina regional', 'Juegos de mesa', 'Tragos exóticos en el bar'],
  drizzle: ['Visita al museo regional', 'Compras de artesanías', 'Tour gastronómico', 'Visita a orquidearios'],
  mist: ['Fotografía de amanecer', 'Yoga en el mirador', 'Meditación guiada', 'Observación de flora'],
};

// Canvas weather renderer con efectos avanzados
function useWeatherCanvas(canvasRef, weatherMain) {
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  const initParticles = useCallback((type, width, height) => {
    const particles = [];
    if (type === 'rain' || type === 'thunderstorm') {
      // Gotas de lluvia
      for (let i = 0; i < 70; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 6 + Math.random() * 8,
          length: 15 + Math.random() * 25,
          opacity: 0.15 + Math.random() * 0.45,
          width: 0.8 + Math.random() * 1.2,
          splash: false,
          splashTimer: 0
        });
      }
    } else if (type === 'drizzle') {
      // Llovizna fina
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 3 + Math.random() * 4,
          length: 6 + Math.random() * 12,
          opacity: 0.1 + Math.random() * 0.3,
          width: 0.4 + Math.random() * 0.6,
        });
      }
    } else if (type === 'clouds') {
      // Nubes volumétricas
      for (let i = 0; i < 6; i++) {
        particles.push({
          x: Math.random() * width,
          y: 20 + Math.random() * (height * 0.35),
          radiusX: 35 + Math.random() * 45,
          radiusY: 20 + Math.random() * 25,
          speed: 0.15 + Math.random() * 0.25,
          opacity: 0.04 + Math.random() * 0.06,
        });
      }
    } else if (type === 'clear') {
      // Sol con lente y rayos dinámicos
      particles.push({
        x: width * 0.82,
        y: height * 0.20,
        radius: 35,
        glow: 75,
        angle: 0,
        rays: 10,
        pulseDir: 1,
        pulseVal: 0
      });
    } else if (type === 'mist' || type === 'fog') {
      // Neblina en ondas sinusoidales
      for (let i = 0; i < 5; i++) {
        particles.push({
          y: 30 + (i * (height / 6)),
          amplitude: 8 + Math.random() * 12,
          period: 150 + Math.random() * 100,
          phase: Math.random() * 100,
          speed: 0.4 + Math.random() * 0.6,
          opacity: 0.02 + Math.random() * 0.04,
          height: 15 + Math.random() * 20
        });
      }
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const handleResize = () => {
      const rect = canvas.parentNode.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    handleResize();
    const width = canvas.width;
    const height = canvas.height;

    const type = (weatherMain || 'clouds').toLowerCase();
    particlesRef.current = initParticles(type, width, height);
    
    let flashActive = false;
    let flashFrame = 0;
    let lightningBranches = [];

    // Generador de rayo fractal
    const generateLightning = (startX, startY) => {
      const branches = [];
      let currX = startX;
      let currY = startY;
      
      branches.push({ x1: currX, y1: currY, x2: currX, y2: currY });

      while (currY < height - 10) {
        const nextX = currX + (Math.random() - 0.5) * 45;
        const nextY = currY + Math.random() * 25 + 10;
        branches.push({ x1: currX, y1: currY, x2: nextX, y2: nextY });
        
        // Ramificaciones menores opcionales
        if (Math.random() < 0.15) {
          branches.push({
            x1: currX,
            y1: currY,
            x2: currX + (Math.random() - 0.5) * 60,
            y2: currY + Math.random() * 20 + 5,
            isSub: true
          });
        }
        
        currX = nextX;
        currY = nextY;
      }
      return branches;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const ps = particlesRef.current;

      // 1. EFECTO LLUVIA Y TORMENTA
      if (type === 'rain' || type === 'thunderstorm' || type === 'drizzle') {
        ps.forEach(p => {
          if (p.splash) {
            // Dibujar salpicadura (splash) en la base
            ctx.beginPath();
            ctx.strokeStyle = `rgba(130, 185, 255, ${p.opacity * 0.6})`;
            ctx.lineWidth = p.width * 0.7;
            ctx.arc(p.x, height - 3, p.splashTimer * 1.5, Math.PI, 0);
            ctx.stroke();
            p.splashTimer += 0.5;
            if (p.splashTimer > 4) {
              p.splash = false;
              p.splashTimer = 0;
              p.y = -p.length;
              p.x = Math.random() * width;
            }
          } else {
            ctx.beginPath();
            // Lluvia brillante e inclinada por viento
            const grad = ctx.createLinearGradient(p.x, p.y, p.x - 3, p.y + p.length);
            grad.addColorStop(0, `rgba(150, 195, 255, ${p.opacity * 0.2})`);
            grad.addColorStop(1, `rgba(200, 225, 255, ${p.opacity})`);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = p.width;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - 3, p.y + p.length);
            ctx.stroke();

            p.y += p.speed;
            p.x -= 0.5; // Inclinación

            // Colisión con el piso de la tarjeta
            if (p.y + p.length >= height - 4) {
              if (type !== 'drizzle' && Math.random() < 0.6) {
                p.splash = true;
                p.splashTimer = 1;
              } else {
                p.y = -p.length;
                p.x = Math.random() * width;
              }
            }
            if (p.x < -10) p.x = width + 10;
          }
        });

        // Relámpagos fractales hiperrealistas
        if (type === 'thunderstorm') {
          if (!flashActive && Math.random() < 0.007) {
            flashActive = true;
            flashFrame = 0;
            lightningBranches = generateLightning(width * 0.2 + Math.random() * (width * 0.5), 0);
          }

          if (flashActive) {
            flashFrame++;
            // Destello general en el fondo
            const flashIntensity = flashFrame < 5 ? 0.35 : flashFrame < 15 ? 0.15 : 0.05;
            ctx.fillStyle = `rgba(225, 235, 255, ${flashIntensity})`;
            ctx.fillRect(0, 0, width, height);

            // Dibujar el rayo fractal
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(235, 245, 255, 0.95)';
            ctx.shadowColor = 'rgba(120, 175, 255, 0.9)';
            ctx.shadowBlur = 18;
            
            lightningBranches.forEach(b => {
              ctx.lineWidth = b.isSub ? 1 : 2.5;
              ctx.moveTo(b.x1, b.y1);
              ctx.lineTo(b.x2, b.y2);
            });
            ctx.stroke();
            ctx.shadowBlur = 0; // Reset sombra

            if (flashFrame > 22) {
              flashActive = false;
            }
          }
        }
      } 
      // 2. EFECTO NUBES VOLUMÉTRICAS
      else if (type === 'clouds') {
        ps.forEach(p => {
          ctx.beginPath();
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radiusX);
          grad.addColorStop(0, `rgba(230, 235, 245, ${p.opacity})`);
          grad.addColorStop(0.6, `rgba(185, 195, 215, ${p.opacity * 0.7})`);
          grad.addColorStop(1, 'rgba(180, 190, 210, 0)');
          
          ctx.fillStyle = grad;
          ctx.ellipse(p.x, p.y, p.radiusX, p.radiusY, 0, 0, Math.PI * 2);
          ctx.fill();
          
          p.x += p.speed;
          if (p.x - p.radiusX > width) p.x = -p.radiusX;
        });
      } 
      // 3. EFECTO SOL DESPEJADO E INTERACTIVO
      else if (type === 'clear') {
        const s = ps[0];
        if (s) {
          s.angle += 0.003;
          s.pulseVal += 0.03 * s.pulseDir;
          if (s.pulseVal > 5 || s.pulseVal < -5) s.pulseDir *= -1;

          const currentGlow = s.glow + s.pulseVal;

          // Halo de calor dinámico
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, currentGlow);
          grad.addColorStop(0, 'rgba(255, 185, 45, 0.22)');
          grad.addColorStop(0.4, 'rgba(255, 150, 30, 0.08)');
          grad.addColorStop(1, 'rgba(255, 100, 10, 0)');
          
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(s.x, s.y, currentGlow, 0, Math.PI * 2);
          ctx.fill();

          // Lente de destello secundario (Lens Flare)
          const flareGrad = ctx.createRadialGradient(s.x - 45, s.y + 45, 0, s.x - 45, s.y + 45, 18);
          flareGrad.addColorStop(0, 'rgba(255, 220, 180, 0.04)');
          flareGrad.addColorStop(1, 'rgba(255, 220, 180, 0)');
          ctx.fillStyle = flareGrad;
          ctx.beginPath();
          ctx.arc(s.x - 45, s.y + 45, 18, 0, Math.PI * 2);
          ctx.fill();

          // Rayos del sol giratorios
          for (let i = 0; i < s.rays; i++) {
            const rayAngle = s.angle + (Math.PI * 2 / s.rays) * i;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 175, 40, 0.12)`;
            ctx.lineWidth = 1.8;
            const startDist = s.radius + 3;
            const endDist = currentGlow - 12;
            ctx.moveTo(s.x + Math.cos(rayAngle) * startDist, s.y + Math.sin(rayAngle) * startDist);
            ctx.lineTo(s.x + Math.cos(rayAngle) * endDist, s.y + Math.sin(rayAngle) * endDist);
            ctx.stroke();
          }
        }
      } 
      // 4. EFECTO NIEBLA/HAZE SINUSOIDAL
      else if (type === 'mist' || type === 'fog') {
        ps.forEach((p, idx) => {
          p.phase += p.speed;
          
          ctx.beginPath();
          ctx.fillStyle = `rgba(215, 225, 235, ${p.opacity})`;
          
          // Dibujar neblina flotante como banda sinusoidal
          for (let x = 0; x < width; x += 15) {
            const yOffset = Math.sin((x / p.period) + p.phase) * p.amplitude;
            ctx.fillRect(x, p.y + yOffset, 16, p.height);
          }
        });
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [weatherMain, canvasRef, initParticles]);
}

export default function WeatherWidget() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const canvasRef = useRef(null);
  const dropdownRef = useRef(null);

  // Cerrar selector al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Consultamos la API abierta y gratuita de Open-Meteo
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America/Lima`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        
        // Mapeo clima actual
        const currentCode = data.current.weather_code;
        const currentConfig = weatherCodes[currentCode] || { main: 'clouds', description: 'Nublado', icon: Cloud };
        
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          feels_like: Math.round(data.current.apparent_temperature),
          humidity: data.current.relative_humidity_2m,
          wind: Math.round(data.current.wind_speed_10m),
          uv: Math.round(data.current.uv_index),
          precipitation: data.current.precipitation,
          description: currentConfig.description,
          main: currentConfig.main,
          icon: currentConfig.icon
        });

        // Mapeo pronóstico de 4 días (excluyendo el día de hoy)
        const dailyForecast = [];
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        
        for (let i = 1; i <= 4; i++) {
          const dateStr = data.daily.time[i];
          const dateObj = new Date(dateStr + 'T00:00:00');
          const dayName = days[dateObj.getDay()];
          const code = data.daily.weather_code[i];
          const config = weatherCodes[code] || { main: 'clouds', description: 'Nublado', icon: Cloud };
          
          dailyForecast.push({
            day: dayName,
            max: Math.round(data.daily.temperature_2m_max[i]),
            min: Math.round(data.daily.temperature_2m_min[i]),
            probRain: data.daily.precipitation_probability_max[i],
            icon: config.icon,
            description: config.description
          });
        }
        setForecast(dailyForecast);
        
      } catch (err) {
        console.error("Error cargando clima real:", err);
        // Fallback realista en caso de fallo de red
        const fallbackTemp = selectedCity.id === 'chachapoyas' ? 18 : 28;
        setWeather({
          temp: fallbackTemp,
          feels_like: fallbackTemp + 3,
          humidity: 78,
          wind: 8,
          uv: 6,
          precipitation: 0,
          description: 'Nublado con Sol',
          main: 'clouds',
          icon: CloudSun
        });
        setForecast([
          { day: 'Mañ', max: fallbackTemp + 2, min: fallbackTemp - 3, probRain: 40, icon: CloudSun, description: 'Parcialmente Nublado' },
          { day: 'Pas', max: fallbackTemp + 3, min: fallbackTemp - 2, probRain: 20, icon: Sun, description: 'Despejado' },
          { day: '3er', max: fallbackTemp - 1, min: fallbackTemp - 4, probRain: 80, icon: CloudRain, description: 'Lluvia Moderada' },
          { day: '4to', max: fallbackTemp, min: fallbackTemp - 3, probRain: 60, icon: CloudLightning, description: 'Tormentas Aisladas' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Actualiza cada 5 minutos
    return () => clearInterval(interval);
  }, [selectedCity]);

  useWeatherCanvas(canvasRef, weather?.main);

  const WeatherIcon = weather ? weather.icon : Cloud;
  const suggestions = weather ? (activitySuggestions[weather.main] || activitySuggestions.clouds) : [];

  // Selector de color del background-gradient animado según el clima
  const getClimaGradient = () => {
    if (!weather) return 'from-slate-900 to-slate-950';
    switch (weather.main) {
      case 'clear':
        return 'from-amber-950/40 via-sky-950/60 to-[var(--color-v-gray-950)]';
      case 'rain':
      case 'drizzle':
        return 'from-blue-950/50 via-slate-900/60 to-[var(--color-v-gray-950)]';
      case 'thunderstorm':
        return 'from-purple-950/45 via-blue-950/45 to-[var(--color-v-gray-950)]';
      case 'mist':
      case 'fog':
        return 'from-teal-950/30 via-slate-900/50 to-[var(--color-v-gray-950)]';
      default:
        return 'from-slate-900 via-sky-950/20 to-[var(--color-v-gray-950)]';
    }
  };

  return (
    <div className={`v-card relative overflow-hidden bg-gradient-to-br ${getClimaGradient()} border border-[rgba(255,255,255,0.06)] backdrop-blur-md transition-all duration-700`}>
      {/* Canvas background animado */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
        style={{ opacity: weather?.main === 'clear' ? 0.9 : 0.7 }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* HEADER: Ubicación interactiva con dropdown */}
        <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between" ref={dropdownRef}>
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 hover:bg-white/5 px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer"
            >
              <MapPin size={15} className="text-[var(--color-v-green)] animate-pulse" />
              <div>
                <div className="text-xs font-bold text-[var(--color-v-white)] flex items-center gap-1.5">
                  {selectedCity.name}
                  <span className="text-[10px] text-white/20">▼</span>
                </div>
                <div className="text-[9px] text-[var(--color-v-gray-400)] leading-none uppercase tracking-wider font-semibold">
                  {selectedCity.region}
                </div>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-slate-950/95 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-white/5 text-[9px] font-bold text-white/30 uppercase tracking-widest px-3">
                  Destinos Amazónicos
                </div>
                {CITIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCity(c);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-white/5 transition cursor-pointer ${
                      selectedCity.id === c.id ? 'text-[var(--color-v-green)] bg-white/5 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[9px] opacity-40 font-semibold">{c.region}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-full border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-v-green)] animate-ping" />
            <span className="text-[9px] text-[var(--color-v-gray-400)] font-semibold uppercase tracking-wider">
              En Vivo
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 h-72">
            <div className="w-8 h-8 border-3 border-[var(--color-v-green)] border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs text-[var(--color-v-gray-400)]">Sincronizando clima en tiempo real...</span>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            
            {/* Bento Grid Principal: Clima Actual */}
            <div className="grid grid-cols-12 gap-3">
              {/* Tarjeta de temperatura principal */}
              <div className="col-span-7 bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-5xl font-black text-[var(--color-v-white)] tracking-tighter leading-none select-none">
                      {weather?.temp}°
                    </span>
                    <WeatherIcon size={32} className="text-white/80 animate-pulse" />
                  </div>
                  <p className="text-xs text-white/90 font-bold capitalize mt-2 flex items-center gap-1.5">
                    {weather?.description}
                  </p>
                </div>
                <div className="text-[9px] text-white/40 font-semibold mt-4">
                  Sensación térmica: {weather?.feels_like}°C
                </div>
              </div>

              {/* Bento Grid Métricas Operativas */}
              <div className="col-span-5 grid grid-rows-2 gap-2.5">
                <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets size={14} className="text-cyan-400" />
                    <div>
                      <div className="text-[8px] text-white/30 uppercase font-semibold leading-none">Humedad</div>
                      <div className="text-xs font-bold text-white mt-0.5">{weather?.humidity}%</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind size={14} className="text-slate-300" />
                    <div>
                      <div className="text-[8px] text-white/30 uppercase font-semibold leading-none">Viento</div>
                      <div className="text-xs font-bold text-white mt-0.5">{weather?.wind} km/h</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Grid Pronóstico 4 días */}
            <div className="bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Calendar size={11} className="text-slate-400" />
                <span className="text-[9px] text-[var(--color-v-gray-400)] uppercase tracking-wider font-bold">
                  Pronóstico de 4 días
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {forecast.map((f, i) => {
                  const ForecastDayIcon = f.icon;
                  return (
                    <div key={i} className="bg-white/[0.02] hover:bg-white/[0.04] transition border border-white/5 p-2 rounded-xl flex flex-col items-center justify-between text-center">
                      <span className="text-[10px] text-white/60 font-semibold">{f.day}</span>
                      <ForecastDayIcon size={16} className="text-white/70 my-1.5" />
                      
                      {/* Probabilidad de lluvia */}
                      {f.probRain > 15 ? (
                        <span className="text-[8px] text-cyan-400 font-bold leading-none mb-1 flex items-center gap-0.5">
                          <Umbrella size={8} /> {f.probRain}%
                        </span>
                      ) : (
                        <span className="text-[8px] text-white/30 font-semibold leading-none mb-1">
                          Seco
                        </span>
                      )}

                      <div className="text-[9px] font-bold text-white leading-none">
                        {f.max}°<span className="text-white/30 text-[8px] font-medium ml-0.5">{f.min}°</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actividades Recomendadas dinámicas */}
            <div className="bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-[var(--color-v-gray-400)] uppercase tracking-wider font-bold">
                  Actividades Recomendadas
                </span>
                <span className="text-[8px] bg-[var(--color-v-green)]/10 text-[var(--color-v-green)] font-extrabold px-1.5 py-0.5 rounded uppercase leading-none">
                  Lodge Tips
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s, i) => (
                  <span 
                    key={i} 
                    className="text-[9px] font-medium text-white/80 bg-white/5 border border-white/5 px-2 py-1 rounded-lg hover:border-white/20 hover:bg-white/10 transition cursor-default"
                  >
                    🍃 {s}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
