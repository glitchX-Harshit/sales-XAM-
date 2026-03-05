import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';
import './Testimonials.css';

const TESTIMONIALS = [
    { text: "nx.ai single-handedly increased our team's close rate by 22% in the first quarter.", author: "Sarah J.", role: "VP of Sales" },
    { text: "It's like having a senior engineer on the call whispering architectural answers into my ear.", author: "Mike T.", role: "Solutions Architect" },
    { text: "I used to dread discovery calls. Now I walk in knowing I have the perfect response to any objection.", author: "Elena R.", role: "Account Executive" },
    { text: "We threw out our clunky call recording software. nx.ai is faster, smarter, and invisible.", author: "David K.", role: "Founder" },
    { text: "The real-time objection detection is basically a cheat code for sales.", author: "Jessica M.", role: "Sales Director" },
];

const Testimonials = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Infinite horizontal marquee
            gsap.to('.testi-track', {
                xPercent: -50,
                ease: 'none',
                duration: 30,
                repeat: -1
            });

            // Quick fade in for the header
            gsap.fromTo('.testi-header > *',
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, stagger: 0.1, duration: 0.8,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%'
                    }
                }
            );

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    // Double the array to make infinite scrolling seamless
    const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

    return (
        <section className="testi-section" id="testimonials" ref={sectionRef}>
            <div className="container testi-header">
                <h2 className="testi-title">
                    <span className="font-serif">Wall of</span> Love
                </h2>
                <p className="testi-desc">Join thousands of top performers who already upgraded their workflows.</p>
            </div>

            <div className="testi-marquee-container">
                <div className="testi-track">
                    {duplicatedTestimonials.map((t, i) => (
                        <div key={i} className="testi-card">
                            <div className="testi-stars">
                                {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#ffbd2e" color="#ffbd2e" />)}
                            </div>
                            <p className="testi-text">"{t.text}"</p>
                            <div className="testi-author">
                                <div className="testi-avatar"></div>
                                <div>
                                    <div className="testi-name">{t.author}</div>
                                    <div className="testi-role">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
