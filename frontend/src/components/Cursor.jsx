import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Cursor = () => {
    const cursorRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;

        const onMouseMove = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });
        };

        const addHoverClass = () => cursor.classList.add('active');
        const removeHoverClass = () => cursor.classList.remove('active');

        window.addEventListener('mousemove', onMouseMove);

        // Add hover effect to interactive elements
        const interactives = document.querySelectorAll('a, button, .interactive');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', addHoverClass);
            el.addEventListener('mouseleave', removeHoverClass);
        });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            interactives.forEach(el => {
                el.removeEventListener('mouseenter', addHoverClass);
                el.removeEventListener('mouseleave', removeHoverClass);
            });
        };
    }, []);

    return <div ref={cursorRef} className="custom-cursor" />;
};

export default Cursor;
