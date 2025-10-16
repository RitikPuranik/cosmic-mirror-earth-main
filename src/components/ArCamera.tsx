import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, RotateCcw, Zap, AlertTriangle, X, Scan, Lightbulb, Monitor } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type DetectedObject = {
  id: string;
  type: 'device' | 'light' | 'screen';
  name: string;
  description: string;
  reaction: string;
  solution: string;
  educational: string;
  position: { x: number; y: number };
};

export const ArCamera = () => {
  const [isCamera, setIsCamera] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isStormDetected, setIsStormDetected] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<DetectedObject | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate object detection and storm effects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let detectionInterval: NodeJS.Timeout;
    
    if (isCamera) {
      // Simulate object detection
      detectionInterval = setInterval(() => {
        const objectTypes = [
          {
            type: 'device' as const,
            name: 'Smartphone',
            description: 'GPS-enabled mobile device with navigation systems vulnerable to ionospheric disturbances',
            reaction: 'GPS accuracy degrades from 5m to 50m+ error. Location tracking becomes erratic. Navigation apps show incorrect positions.',
            solution: 'Switch to offline maps. Use landmark-based navigation. Wait 2-3 hours for ionosphere to stabilize.',
            educational: 'Solar flares release charged particles that disrupt Earth\'s ionosphere (60-600km altitude), interfering with GPS satellite signals (20,200km orbit).',
          },
          {
            type: 'light' as const,
            name: 'LED Light System',
            description: 'Grid-connected electrical lighting powered by regional power distribution network',
            reaction: 'Experiences flickering, dimming, or sudden brightness changes. May completely fail during severe geomagnetic storms.',
            solution: 'Install surge protectors. Use battery backup systems. Report sustained flickers to power company.',
            educational: 'Geomagnetically Induced Currents (GICs) flow through power lines during solar storms, causing voltage fluctuations and potential transformer damage.',
          },
          {
            type: 'screen' as const,
            name: 'Display Monitor',
            description: 'Electronic display device receiving data via electromagnetic signals',
            reaction: 'Static interference, color distortion, signal loss. Wireless connectivity drops. Video calls freeze or disconnect.',
            solution: 'Use wired connections during storms. Restart devices if glitches persist. Avoid critical video conferences.',
            educational: 'Solar Radio Bursts emit strong electromagnetic radiation across radio frequencies, overwhelming weak electronic signals and causing interference.',
          },
        ];

        const randomObject = objectTypes[Math.floor(Math.random() * objectTypes.length)];
        const newObject: DetectedObject = {
          id: Date.now().toString(),
          ...randomObject,
          position: {
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 60,
          },
        };

        setDetectedObjects(prev => {
          const filtered = prev.filter(obj => Date.now() - parseInt(obj.id) < 10000);
          return [...filtered, newObject].slice(-3);
        });
      }, 4000);

      // Storm detection
      interval = setInterval(() => {
        const stormChance = Math.random();
        if (stormChance > 0.7) {
          setIsStormDetected(true);
          toast({
            title: "⚡ Solar Storm Detected!",
            description: "Active electromagnetic interference in your area",
          });
        } else {
          setIsStormDetected(false);
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (detectionInterval) clearInterval(detectionInterval);
    };
  }, [isCamera]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: 'environment', // Use back camera for AR
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsCamera(true);
      setHasPermission(true);
      
      toast({
        title: "🚀 AR Mode Activated!",
        description: "Point your camera at objects to see storm effects",
      });
    } catch (error) {
      console.error('Camera access denied:', error);
      setHasPermission(false);
      toast({
        title: "Camera Access Required",
        description: "Please allow camera access to use AR features",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCamera(false);
    setIsStormDetected(false);
  };

  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        // Add AR overlay effects
        ctx.fillStyle = 'rgba(255, 100, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Save or share the image
        const dataURL = canvas.toDataURL('image/png');
        // In a real app, you could download or share this image
        
        toast({
          title: "📸 AR Snapshot Captured!",
          description: "Cosmic storm effects saved to image",
        });
      }
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          AR Cosmic Mirror Experience
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Use your device camera to see how objects around you would react during a solar storm. 
          AR overlays show real-time cosmic interference effects.
        </p>
      </div>

      {/* Large Information Prompt Window */}
      {showPrompt && (
        <Card className="max-w-5xl mx-auto mb-8 cosmic-shadow border-aurora-blue/30 bg-gradient-to-br from-space-navy via-card to-space-navy backdrop-blur-md relative overflow-hidden">
          {/* Animated Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-blue/5 via-solar-orange/5 to-aurora-purple/5 animate-pulse"></div>
          
          <Button 
            onClick={() => setShowPrompt(false)}
            variant="ghost" 
            size="icon"
            className="absolute top-4 right-4 z-10 hover:bg-destructive/20"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="relative p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-aurora-blue/20 aurora-glow">
                <Zap className="w-8 h-8 text-aurora-blue" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">How AR Solar Storm Detection Works</h3>
                <p className="text-sm text-muted-foreground">Real-time cosmic interference simulation</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* What We Detect Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Scan className="w-5 h-5 text-aurora-blue" />
                  <h4 className="text-xl font-semibold text-foreground">What We Detect:</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-3 p-3 rounded-lg bg-card/50 border border-aurora-blue/20">
                    <Camera className="w-5 h-5 text-aurora-blue mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Electronic Devices</p>
                      <p className="text-sm text-muted-foreground">Phones, tablets, laptops, and smart devices with GPS capabilities</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-lg bg-card/50 border border-solar-orange/20">
                    <Lightbulb className="w-5 h-5 text-solar-orange mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Light Sources</p>
                      <p className="text-sm text-muted-foreground">Lamps, ceiling lights, and electrical lighting systems</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-lg bg-card/50 border border-aurora-purple/20">
                    <Monitor className="w-5 h-5 text-aurora-purple mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Screens & Displays</p>
                      <p className="text-sm text-muted-foreground">TVs, monitors, and display panels</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How Objects React Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-solar-orange" />
                  <h4 className="text-xl font-semibold text-foreground">Solar Flare Reactions:</h4>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-solar-orange/10 to-transparent border border-solar-orange/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-solar-orange" />
                      <p className="font-semibold text-foreground">GPS Signal Drift</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Electronic devices show erratic GPS behavior, with location accuracy degrading by several meters. 
                      You'll see "DRIFTING" indicators and detection frame jitter.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-aurora-blue/10 to-transparent border border-aurora-blue/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-aurora-blue" />
                      <p className="font-semibold text-foreground">Power Grid Fluctuations</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Lights experience flickering and intensity variations as electromagnetic interference 
                      affects power distribution. Orange overlay indicates active disruption.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-aurora-purple/10 to-transparent border border-aurora-purple/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Monitor className="w-4 h-4 text-aurora-purple" />
                      <p className="font-semibold text-foreground">Communication Interference</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Screens and communication devices show signal disruption overlays. Radio frequencies 
                      and satellite communications experience temporary blackouts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Storm Intensity Indicator */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-solar-orange/20 via-aurora-blue/20 to-aurora-purple/20 border border-primary/30">
              <div className="flex items-center justify-center gap-3">
                <Zap className="w-5 h-5 text-solar-orange animate-pulse" />
                <p className="text-sm font-medium text-foreground">
                  <span className="text-solar-orange font-bold">Live Storm Detection:</span> When a solar storm is detected, 
                  all objects react simultaneously with visual overlays, shake effects, and alert badges
                </p>
                <Zap className="w-5 h-5 text-solar-orange animate-pulse" />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Camera Interface */}
      <Card className="max-w-4xl mx-auto cosmic-shadow border-aurora-blue/20 bg-card/50 backdrop-blur-sm">
        <div className="relative aspect-video bg-space-navy rounded-lg overflow-hidden">
          {isCamera ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              
              {/* AR Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Storm Effect Overlay */}
                {isStormDetected && (
                  <>
                    <div className="absolute inset-0 bg-solar-orange/20 animate-power-flicker"></div>
                    <div className="absolute top-4 left-4">
                      <Badge variant="destructive" className="animate-pulse">
                        <Zap className="w-3 h-3 mr-1" />
                        Storm Detected
                      </Badge>
                    </div>
                  </>
                )}
                
                {/* GPS Drift Indicator */}
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className={isStormDetected ? 'animate-gps-drift' : ''}>
                    📍 GPS: {isStormDetected ? 'DRIFTING' : 'STABLE'}
                  </Badge>
                </div>
                
                {/* Detected Objects with Interactive Overlays */}
                <div className="absolute inset-0 pointer-events-auto">
                  {detectedObjects.map((obj) => (
                    <div
                      key={obj.id}
                      className={`absolute cursor-pointer transition-all duration-300 ${
                        isStormDetected ? 'animate-storm-shake' : ''
                      }`}
                      style={{
                        left: `${obj.position.x}%`,
                        top: `${obj.position.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onClick={() => setSelectedObject(obj)}
                    >
                      {/* Detection Frame */}
                      <div className={`relative w-40 h-32 border-2 rounded-lg animate-pulse ${
                        obj.type === 'device' ? 'border-aurora-blue' :
                        obj.type === 'light' ? 'border-solar-orange' :
                        'border-aurora-purple'
                      }`}>
                        {/* Object Label */}
                        <div className={`absolute -top-6 left-0 px-2 py-1 rounded text-xs font-semibold ${
                          obj.type === 'device' ? 'bg-aurora-blue text-black' :
                          obj.type === 'light' ? 'bg-solar-orange text-black' :
                          'bg-aurora-purple text-white'
                        }`}>
                          {obj.type === 'device' ? '📱' : obj.type === 'light' ? '💡' : '📺'} {obj.name}
                        </div>

                        {/* Storm Impact Indicator */}
                        {isStormDetected && (
                          <div className="absolute -bottom-6 left-0 right-0">
                            <Badge variant="destructive" className="text-xs animate-pulse">
                              <Zap className="w-3 h-3 mr-1" />
                              Affected
                            </Badge>
                          </div>
                        )}

                        {/* Tap to Learn More */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/70 px-2 py-1 rounded text-xs text-white">
                            Tap for Info
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Center Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 border-2 border-primary rounded-full animate-pulse"></div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-24 h-24 rounded-full bg-aurora-blue/20 flex items-center justify-center mb-6 aurora-glow">
                <Camera className="w-12 h-12 text-aurora-blue" />
              </div>
              
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Ready for AR Experience
              </h3>
              
              {hasPermission === false && (
                <div className="mb-4">
                  <Badge variant="destructive">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Camera Access Required
                  </Badge>
                </div>
              )}
              
              <p className="text-muted-foreground mb-6 max-w-md">
                Grant camera access to start the AR experience. Point your camera at objects 
                to see how they react during solar storms.
              </p>
            </div>
          )}
        </div>
        
        {/* Camera Controls */}
        <div className="p-4 flex justify-center gap-4">
          {!isCamera ? (
            <Button onClick={startCamera} className="aurora-glow">
              <Camera className="w-4 h-4 mr-2" />
              Start AR Camera
            </Button>
          ) : (
            <>
              <Button onClick={stopCamera} variant="outline">
                <CameraOff className="w-4 h-4 mr-2" />
                Stop Camera
              </Button>
              <Button onClick={captureSnapshot} className="solar-glow">
                <Camera className="w-4 h-4 mr-2" />
                Capture AR Shot
              </Button>
              <Button onClick={startCamera} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Hidden canvas for snapshots */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Detailed Object Information Modal */}
      {selectedObject && (
        <Card className="fixed inset-4 z-50 max-w-4xl mx-auto my-auto h-fit cosmic-shadow border-2 border-primary/50 bg-gradient-to-br from-space-navy via-card to-space-navy backdrop-blur-xl overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-blue/10 via-solar-orange/10 to-aurora-purple/10 animate-pulse"></div>
          
          <div className="relative p-6 max-h-[80vh] overflow-y-auto">
            {/* Close Button */}
            <Button
              onClick={() => setSelectedObject(null)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 hover:bg-destructive/20"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-full ${
                selectedObject.type === 'device' ? 'bg-aurora-blue/20 aurora-glow' :
                selectedObject.type === 'light' ? 'bg-solar-orange/20 solar-glow' :
                'bg-aurora-purple/20 purple-glow'
              }`}>
                {selectedObject.type === 'device' ? <Camera className="w-8 h-8 text-aurora-blue" /> :
                 selectedObject.type === 'light' ? <Lightbulb className="w-8 h-8 text-solar-orange" /> :
                 <Monitor className="w-8 h-8 text-aurora-purple" />}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  {selectedObject.type === 'device' ? '📱' : selectedObject.type === 'light' ? '💡' : '📺'} {selectedObject.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedObject.description}</p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="space-y-4">
              {/* Device Description Section */}
              <div className="p-5 rounded-lg bg-card/50 border border-primary/30">
                <div className="flex items-center gap-2 mb-3">
                  <Scan className="w-5 h-5 text-primary" />
                  <h4 className="text-lg font-semibold text-foreground">📡 Device Description</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedObject.description}
                </p>
              </div>

              {/* Solar Flare Reaction */}
              <div className="p-5 rounded-lg bg-gradient-to-r from-solar-orange/10 to-transparent border border-solar-orange/40">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-solar-orange animate-pulse" />
                  <h4 className="text-lg font-semibold text-foreground">⚠️ Solar Flare Reaction</h4>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedObject.reaction}
                </p>
                {isStormDetected && (
                  <Badge variant="destructive" className="mt-3 animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    Currently Experiencing These Effects
                  </Badge>
                )}
              </div>

              {/* Protection Solutions */}
              <div className="p-5 rounded-lg bg-gradient-to-r from-aurora-blue/10 to-transparent border border-aurora-blue/40">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-aurora-blue" />
                  <h4 className="text-lg font-semibold text-foreground">🛠️ Smart Protection Solutions</h4>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedObject.solution}
                </p>
              </div>

              {/* Educational Science Section */}
              <div className="p-5 rounded-lg bg-gradient-to-r from-aurora-purple/10 to-transparent border border-aurora-purple/40">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-aurora-purple" />
                  <h4 className="text-lg font-semibold text-foreground">🔆 The Science Behind It</h4>
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">
                  {selectedObject.educational}
                </p>
                
                {/* Educational Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                    <p className="text-xs text-muted-foreground">Solar Flare Speed</p>
                    <p className="text-lg font-bold text-solar-orange">3 million km/h</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                    <p className="text-xs text-muted-foreground">Earth Reach Time</p>
                    <p className="text-lg font-bold text-aurora-blue">8-15 minutes</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                    <p className="text-xs text-muted-foreground">Impact Duration</p>
                    <p className="text-lg font-bold text-aurora-purple">Hours to Days</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                    <p className="text-xs text-muted-foreground">Affected Altitude</p>
                    <p className="text-lg font-bold text-primary">60-600 km</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => setSelectedObject(null)}
                  className="flex-1 bg-gradient-to-r from-aurora-blue to-aurora-purple hover:opacity-90"
                >
                  Continue Scanning
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "📚 Bookmarked!",
                      description: `${selectedObject.name} info saved for later`,
                    });
                  }}
                >
                  Bookmark Info
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* AR Instructions */}
      <div className="mt-8 grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card className="p-4 text-center cosmic-shadow border-aurora-blue/20 bg-card/30 backdrop-blur-sm">
          <div className="text-2xl mb-2">📱</div>
          <h4 className="font-semibold mb-2 text-foreground">Point at Devices</h4>
          <p className="text-sm text-muted-foreground">
            Aim camera at phones, tablets, or electronics to see GPS drift effects
          </p>
        </Card>
        
        <Card className="p-4 text-center cosmic-shadow border-solar-orange/20 bg-card/30 backdrop-blur-sm">
          <div className="text-2xl mb-2">💡</div>
          <h4 className="font-semibold mb-2 text-foreground">Find Light Sources</h4>
          <p className="text-sm text-muted-foreground">
            Target lamps or lights to witness power grid flicker simulations
          </p>
        </Card>
        
        <Card className="p-4 text-center cosmic-shadow border-aurora-purple/20 bg-card/30 backdrop-blur-sm">
          <div className="text-2xl mb-2">📺</div>
          <h4 className="font-semibold mb-2 text-foreground">Scan Screens</h4>
          <p className="text-sm text-muted-foreground">
            Point at TVs or monitors to see communication disruption overlays
          </p>
        </Card>
      </div>
    </div>
  );
};