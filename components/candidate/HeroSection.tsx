import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <>
            <div className="w-full relative bg-gradient-to-r from-[#197fe6] to-[#0f4c8a] dark:from-[#0f4c8a] dark:to-[#082a4d] pt-16 pb-24 px-4 overflow-hidden mb-8 transition-colors duration-200">
                <div
                    className="absolute inset-0 z-0 opacity-10"
                    style={{
                        backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCzK9t_MUNRZsDgov4OTEphAY31K6gy3rG0MaF2fwzZcFrXMoo84rM40GW9222oEXP7mG8Pq2062qvMIyQ2OYFQaVZwn3WzgHAA0p3KbmvSUU68n6Etj2ePLV0lKLH7IcYUedgGtSYp7NRB7Jte2pt_VbCN849IMr04aG6XsVUBX-77SYvjEFFFpfqVwttnrzcj_aHpKpbGc1juJQiVMfIpTiWybY_hUqgNatQgo3tLy8a2E12OhK2FlgAcat5QWhvXgOT6WOw5iWHk')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                ></div>
                <div className="absolute inset-0 z-0 bg-black/20"></div>
                <div className="relative z-10 max-w-[1280px] mx-auto w-full flex flex-col items-center text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        Temos vagas abertas esperando por você!
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl">
                        Busque oportunidades e acompanhe suas candidaturas no portal.
                    </p>
                </div>
            </div>
        </>
    );
};

export default HeroSection;
