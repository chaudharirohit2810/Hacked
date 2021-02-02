import { useEffect, useState } from "react";
import { secureStorage } from "../config";

export default function useSecureStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        const jsonValue = secureStorage.getItem(key);
        if (jsonValue != null) return JSON.parse(jsonValue);
        return initialValue;
    });

    useEffect(() => {
        secureStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}
