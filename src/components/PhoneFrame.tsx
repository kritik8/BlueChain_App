import React, { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)' }}>
      {/* Ambient light spots */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30 blur-[120px]" style={{ background: 'radial-gradient(circle, #0ea5a4 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-25 blur-[100px]" style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />
      <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full opacity-20 blur-[80px]" style={{ background: 'radial-gradient(circle, #0891b2 0%, transparent 70%)' }} />
      <div className="absolute bottom-[40%] left-[5%] w-[250px] h-[250px] rounded-full opacity-15 blur-[90px]" style={{ background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)' }} />
      
      {/* iPhone 15 Frame */}
      <div className="relative w-[390px] h-[844px] rounded-[55px] p-3 shadow-phone z-10" style={{ background: 'linear-gradient(135deg, #000000 0%, #6d3d84 100%)' }}>
        {/* Inner bezel highlight */}
        <div className="absolute inset-0 rounded-[55px] ring-1 ring-white/10" />
        
        {/* Screen */}
        <div className="relative w-full h-full bg-background rounded-[44px] overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[126px] h-[35px] bg-black rounded-full z-50" />
          
          {/* App Content */}
          <div className="h-full w-full overflow-hidden">
            {children}
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-foreground/20 rounded-full z-50" />
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;
