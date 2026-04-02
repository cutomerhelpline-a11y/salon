import React from 'react';
import { motion } from 'framer-motion';

const team = [
    {
        name: 'Grace Silver',
        role: 'Colour Specialist',
        bio: 'Master colourist specializing in vibrant tones and transformative colour artistry.',
        image: '/images/GraceSilver.png'
    },
    {
        name: 'Rachelle Clifford',
        role: 'Stylist',
        bio: 'Passionate stylist dedicated to exceptional hair care and creative transformations.',
        image: '/images/RachelleClifford.png'
    },
    {
        name: 'Stacey Hall',
        role: 'Cut Specialist',
        bio: 'Expert in precision cuts and modern techniques, creating styles that elevate your look.',
        image: '/images/StaceyHall.png'
    },
    {
        name: 'Emmah Taylor',
        role: 'Colour Specialist',
        bio: 'Master colourist specializing in vibrant tones and transformative colour artistry.',
        image: '/images/EmmahTaylor.png'
    },
    {
        name: 'Jelaa Kim',
        role: 'Stylist',
        bio: 'Passionate stylist dedicated to exceptional hair care and creative transformations.',
        image: '/images/JelaaKim.png'
    },
    {
        name: 'Gabriella Louise',
        role: 'Cut Specialist',
        bio: 'Expert in precision cuts and modern techniques, creating styles that elevate your look.',
        image: '/images/GabriellaLouise.png'
    },
    {
        name: 'Tiffany Collier',
        role: 'Colour Specialist',
        bio: 'Master colourist specializing in vibrant tones and transformative colour artistry.',
        image: '/images/TiffanyCollier.jpeg'
    },
    {
        name: 'Tess McMillan',
        role: 'Stylist',
        bio: 'Passionate stylist dedicated to exceptional hair care and creative transformations.',
        image: '/images/TessMcMillan.png'
    },
    {
        name: 'Jennifer Mia',
        role: 'Cut Specialist',
        bio: 'Expert in precision cuts and modern techniques, creating styles that elevate your look.',
        image: '/images/JenniferMia.png'
    },
    {
        name: 'Olivia Hobson',
        role: 'Colour Specialist',
        bio: 'Master colourist specializing in vibrant tones and transformative colour artistry.',
        image: '/images/OliviaHobson.png'
    },
    {
        name: 'Daisy Louise',
        role: 'Stylist',
        bio: 'Passionate stylist dedicated to exceptional hair care and creative transformations.',
        image: '/images/DaisyLouise.png'
    },
    {
        name: 'Nikki Dale',
        role: 'Cut Specialist',
        bio: 'Expert in precision cuts and modern techniques, creating styles that elevate your look.',
        image: '/images/NikkiDale.png'
    },
    {
        name: 'Christine Hegarty',
        role: 'Colour Specialist',
        bio: 'Master colourist specializing in vibrant tones and transformative colour artistry.',
        image: '/images/ChristineHegarty.png'
    },
    {
        name: 'Rachel Dickson',
        role: 'Stylist',
        bio: 'Passionate stylist dedicated to exceptional hair care and creative transformations.',
        image: '/images/RachelDickson.png'
    },
    {
        name: 'Jess Smith',
        role: 'Cut Specialist',
        bio: 'Expert in precision cuts and modern techniques, creating styles that elevate your look.',
        image: '/images/JessSmith.png'
    },
    {
        name: 'Nicolle Benson',
        role: 'Colour Specialist',
        bio: 'Master colourist specializing in vibrant tones and transformative colour artistry.',
        image: '/images/NicolleBenson.png'
    },
    {
        name: 'Fredy Flower',
        role: 'Stylist',
        bio: 'Passionate stylist dedicated to exceptional hair care and creative transformations.',
        image: '/images/FredyFlower.png'
    },
    {
        name: 'Cassandra Norman',
        role: 'Cut Specialist',
        bio: 'Expert in precision cuts and modern techniques, creating styles that elevate your look.',
        image: '/images/CassandraNorman.png'
    },
    {
        name: 'Diana Chase',
        role: 'Colour Specialist',
        bio: 'Master colourist specializing in vibrant tones and transformative colour artistry.',
        image: '/images/DianaChase.png'
    }
];

export default function TeamSection() {
    return (
        <section className="py-24 md:py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-4">
                        Our People
                    </p>
                    <h2 className="font-serif text-4xl md:text-5xl text-neutral-900 mb-6">
                        Meet the Team
                    </h2>
                    <p className="text-neutral-500 max-w-2xl mx-auto leading-relaxed">
                        Our talented team of stylists brings creativity, expertise, and passion to every service. Meet the professionals who make your hair dreams come true.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    {team.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group"
                        >
                            <div className="aspect-[3/4] overflow-hidden mb-6">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <h3 className="font-serif text-2xl text-neutral-900 mb-1">{member.name}</h3>
                            <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 mb-3">
                                {member.role}
                            </p>
                            <p className="text-neutral-500 text-sm leading-relaxed">{member.bio}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}