import { useEffect, useState } from "react";

/**
 * Retrasa el valor N milisegundos después del último cambio.
 * Útil para búsquedas: evita disparar una query por cada tecla.
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}
