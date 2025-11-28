'use client';

import React from "react";
import { IMonster, IMonsterAttributes } from "../Interfaces/monsters";
import { formatSpeed } from "../components/FormatSpeed";
import Image from "next/image";

// ---------------- ATTRIBUTES BLOCK ----------------
const AttributesBlock: React.FC<{ attributes: IMonsterAttributes }> = ({ attributes }) => {
    const attrList = ["str", "dex", "con", "int", "wis", "cha"] as const;

    const getModifier = (score: number): string => {
        const mod = Math.floor((score - 10) / 2);
        return mod >= 0 ? `+${mod}` : `${mod}`;
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                background: "#2b1d0e",
                padding: "10px",
                borderRadius: "6px",
                marginTop: "12px",
                color: "#f4e4c1",
                fontWeight: "bold",
            }}
        >
            {attrList.map((attr) => (
                <div key={attr} style={{ textAlign: "center", width: "50px" }}>
                    <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>{attr.toUpperCase()}</div>
                    <div style={{ fontSize: "1.1rem" }}>{attributes[attr]}</div>
                    <div style={{ fontSize: "0.8rem", color: "#d1b58b" }}>
                        ({getModifier(attributes[attr])})
                    </div>
                </div>
            ))}
        </div>
    );
};

// --------------- IMAGE URL BUILDER -----------------
const getMonsterImage = (monster: IMonster) => {
    const name = monster.name.replace(/\s+/g, "%20");
    return `https://5e.tools/img/bestiary/tokens/${monster.source}/${name}.webp`;
};

// -------------------- CARD --------------------------
export default function MonsterCard({ monster }: { monster: IMonster }) {
    return (
        <div
            style={{
                background: "#1a0f0a",
                border: "3px solid #8b4513",
                borderRadius: "12px",
                padding: "15px",
                boxShadow: "0 0 15px rgba(0,0,0,0.6)",
                color: "#f8e8c8",
                fontFamily: "Georgia, serif",
                width: "280px",
                margin: "auto",
            }}
        >
            {/* Name */}
            <h3
                style={{
                    textAlign: "center",
                    color: "#ffd38d",
                    fontSize: "1.3rem",
                    marginBottom: "10px",
                    textShadow: "1px 1px 3px black",
                }}
            >
                {monster.name}
            </h3>

            {/* Image */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "12px",
                }}
            >
                <Image
                    src={getMonsterImage(monster)}
                    alt={monster.name}
                    width={200}
                    height={200}
                    style={{
                        borderRadius: "50%",
                        border: "4px solid #8b4513",
                        background: "#000",
                    }}
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
            </div>

            {/* CR */}
            <div style={{ textAlign: "center", marginBottom: "8px", color: "#d0b483" }}>
                <strong>CR:</strong>{" "}
                <span style={{ fontSize: "1.2rem", color: "#9cff9c" }}>
                    {monster.cr ?? "?"}
                </span>
            </div>

            <hr style={{ borderColor: "#8b4513", opacity: 0.5 }} />

            {/* Infos */}
            <p>
                <strong>Type:</strong> {monster.type}
            </p>
            <p>
                <strong>AC:</strong> {monster.ac}
            </p>
            <p>
                <strong>HP:</strong> {monster.hp}
            </p>
            <p>
                <strong>Speed:</strong> {formatSpeed(monster.speed)}
            </p>

            {/* Attributes */}
            {monster.attributes && <AttributesBlock attributes={monster.attributes} />}

            {/* Actions */}
            {monster.actions && monster.actions.length > 0 && (
                <div
                    style={{
                        marginTop: "10px",
                        paddingTop: "10px",
                        borderTop: "1px solid #5a3b23",
                    }}
                >
                    <strong>Actions:</strong>{" "}
                    {monster.actions.map((a) => a.name).join(", ")}
                </div>
            )}
        </div>
    );
}
