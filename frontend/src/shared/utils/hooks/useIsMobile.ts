import { useEffect, useState } from "react";

export const useIsMobile = (initial = false) => {
    const [isMobile, setIsMobile] = useState(initial || window.innerWidth < 730);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 730);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile;
};
