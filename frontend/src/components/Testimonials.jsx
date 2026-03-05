import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger);

/* Real-feeling social proof cards — mix of sizes, tones, styles */
const CARDS = [
    {
        name: 'Sarah Johnson',
        handle: '@sarahj_vp',
        role: 'VP of Sales · TechCorp',
        avatar: 'SJ',
        avatarBg: '#ff5e00',
        stars: 5,
        featured: true,
        text: 'I did not believe it would work. Three months later our close rate is up 22% and our team refuses to get on a call without it. Genuinely changed how we sell.',
        meta: 'via App Store · Verified purchase',
    },
    {
        name: 'Mike Tran',
        handle: '@miketran_arch',
        role: 'Solutions Architect',
        avatar: 'MT',
        avatarBg: '#7c5cbf',
        stars: 5,
        text: 'It\'s like having a senior AE in your ear on every call. Except it never panics, never forgets a script, and never needs a coffee break.',
        meta: 'via G2 · Verified',
    },
    {
        name: 'Elena R.',
        handle: '@elena_ae',
        role: 'Account Executive',
        avatar: 'ER',
        avatarBg: '#27c93f',
        stars: 5,
        featured: true,
        pull: true,
        text: '"I used to dread discovery calls.\n\nNow I look forward to them."',
        meta: 'Capsule Review',
    },
    {
        name: 'David Kim',
        handle: '@davidkim_build',
        role: 'Founder, Gridline',
        avatar: 'DK',
        avatarBg: '#0099ff',
        stars: 5,
        text: 'Replaced our clunky call recording stack entirely. nx.ai is faster, smarter, completely invisible — and our prospects never notice.',
        meta: 'via Trustpilot',
    },
    {
        name: 'Jessica Moore',
        handle: '@jess_sells',
        role: 'Sales Director',
        avatar: 'JM',
        avatarBg: '#ff3d71',
        stars: 5,
        stat: { n: '+31%', l: 'quota attainment jump' },
        text: 'The objection detection is basically a superpower. I watched a junior SDR handle a VP-level pricing pushback perfectly because nx.ai surfaced the exact right reframe.',
        meta: 'via Product Hunt',
    },
    {
        name: 'Brian Liu',
        handle: '@brian_rev',
        role: 'Head of Revenue',
        avatar: 'BL',
        avatarBg: '#d4a017',
        stars: 5,
        featured: true,
        text: 'ROI within 10 days of deployment. I had to stop myself from calling every investor and just saying "nx.ai".',
        meta: 'via Capterra · Verified',
    },
    {
        name: 'Priya Nair',
        handle: '@priya_sdr',
        role: 'Senior SDR',
        avatar: 'PN',
        avatarBg: '#17b0d4',
        stars: 5,
        pull: true,
        text: '"Closed a $400k deal on my third week using nx.ai.\n\nI\'m not joking."',
        meta: 'Shared via Discord',
    },
    {
        name: 'Tom Hassan',
        handle: '@tomh_cro',
        role: 'Chief Revenue Officer',
        avatar: 'TH',
        avatarBg: '#ff5e00',
        stars: 5,
        featured: true,
        text: 'We run 200+ calls a week across our sales team. Since deploying nx.ai, follow-up emails dropped by 80% — everyone already knows exactly what was agreed on each call. This thing runs our post-call workflow almost entirely.',
        meta: 'via Salesforce AppExchange · Enterprise',
    },
    {
        name: 'Anika V.',
        handle: '@anikav_smb',
        role: 'SMB Account Executive',
        avatar: 'AV',
        avatarBg: '#7c5cbf',
        stars: 5,
        text: 'My manager thought I was getting coaching on the side. Nope — just nx.ai.',
        meta: 'via LinkedIn',
    },
];

/* Split cards into 3 columns for masonry */
const COLS = [
    CARDS.filter((_, i) => i % 3 === 0),
    CARDS.filter((_, i) => i % 3 === 1),
    CARDS.filter((_, i) => i % 3 === 2),
];

const Stars = ({ n }) => (
    <div className="tl-stars">
        {[...Array(n)].map((_, i) => <Star key={i} size={12} fill="#ffbd2e" color="#ffbd2e" />)}
    </div>
);

const Card = ({ card }) => (
    <div className={`tl-card ${card.featured ? 'tl-card-featured' : ''} ${card.pull ? 'tl-card-pull' : ''}`}>
        {/* Header */}
        <div className="tl-card-header">
            <div className="tl-avatar" style={{ background: card.avatarBg }}>
                {card.avatar}
            </div>
            <div className="tl-info">
                <div className="tl-name">{card.name}</div>
                <div className="tl-handle">{card.handle} · {card.role}</div>
            </div>
            <Stars n={card.stars} />
        </div>

        {card.stat && (
            <div className="tl-stat-chip">
                <span className="tl-stat-n">{card.stat.n}</span>
                <span className="tl-stat-l">{card.stat.l}</span>
            </div>
        )}

        <p className={`tl-text ${card.pull ? 'tl-pull-quote' : ''}`}>{card.text}</p>

        <div className="tl-meta">{card.meta}</div>
    </div>
);

const Testimonials = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            /* Header */
            gsap.fromTo('.tl-header > *',
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
                }
            );

            /* Per-column: fly in from different directions */
            const colDirections = [
                { x: -120, y: 40 },   // col 1 — from left
                { x: 0, y: 100 },  // col 2 — from below
                { x: 120, y: 40 },   // col 3 — from right
            ];

            document.querySelectorAll('.tl-col').forEach((col, i) => {
                const dir = colDirections[i];

                // Entrance — fly from direction into position
                gsap.fromTo(col,
                    { x: dir.x, y: dir.y, opacity: 0 },
                    {
                        x: 0, y: 0, opacity: 1,
                        duration: 1.0, delay: i * 0.12, ease: 'power3.out',
                        scrollTrigger: { trigger: '.tl-masonry', start: 'top 85%' }
                    }
                );

                // Ongoing scroll parallax after entrance
                const speeds = [-120, 60, -80];
                gsap.to(col, {
                    y: speeds[i],
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.tl-masonry',
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5 + i * 0.3,
                    }
                });
            });

            /* Individual cards within each col fly from alternating sub-directions */
            document.querySelectorAll('.tl-card').forEach((card, i) => {
                const fromX = i % 4 === 0 ? -40 : i % 4 === 1 ? 40 : i % 4 === 2 ? -20 : 20;
                gsap.fromTo(card,
                    { x: fromX, y: 30, opacity: 0, rotation: (i % 2 === 0 ? -1.5 : 1.5) },
                    {
                        x: 0, y: 0, opacity: 1, rotation: 0,
                        duration: 0.8, delay: i * 0.06, ease: 'power3.out',
                        scrollTrigger: { trigger: '.tl-masonry', start: 'top 85%' }
                    }
                );
            });


        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="tl-section" id="testimonials" ref={sectionRef}>

            {/* Section header */}
            <div className="container tl-header">
                <div className="tl-eyebrow">Wall of Love</div>
                <div className="tl-header-row">
                    <h2 className="tl-title">
                        Real results.<br />
                        <em className="tl-title-italic font-serif">Real teams.</em>
                    </h2>
                    <p className="tl-subtitle">
                        Over 2,000 sales teams use nx.ai every day.<br />
                        Here's what they're saying.
                    </p>
                </div>
            </div>

            {/* Masonry wall */}
            <div className="container tl-masonry">
                {COLS.map((col, ci) => (
                    <div className="tl-col" key={ci}>
                        {col.map((card, i) => <Card key={i} card={card} />)}
                    </div>
                ))}
            </div>

            {/* Bottom CTA strip */}
            <div className="tl-bottom-strip">
                <div className="tl-strip-inner">
                    <span className="tl-strip-text">Join 2,000+ teams closing more.</span>
                    <button className="tl-strip-btn interactive">Start free →</button>
                </div>
            </div>

        </section>
    );
};

export default Testimonials;
