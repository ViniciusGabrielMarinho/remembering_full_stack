import { IMonsterSpeed } from "../Interfaces/monsters";

export function formatSpeed(speed: IMonsterSpeed): string {
    const parts: string[] = [];

    for (const key in speed) {
        const value = speed[key];
        if (value !== undefined) {
            // Normaliza chave para primeira letra maiúscula
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            parts.push(`${label} ${value}`);
        }
    }

    return parts.length > 0 ? parts.join(", ") : "—";
}
