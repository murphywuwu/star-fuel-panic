"use client";

import { useState } from "react";
import { useAuthController } from "@/controller/useAuthController";
import { useCreateMatchController } from "@/controller/useCreateMatchController";

export function CreateMatchScreen() {
  const { state: authState } = useAuthController();
  const { state, actions } = useCreateMatchController();
  const [targetsText, setTargetsText] = useState("");

  return (
    <section className="space-y-3 p-4">
      <h2 className="text-lg font-semibold">Create Match (v2.6)</h2>
      <div className="grid gap-2 md:grid-cols-2">
        <select value={state.mode} onChange={(e) => actions.setField("mode", e.target.value as "free" | "precision")} className="border p-2">
          <option value="free">free</option>
          <option value="precision">precision</option>
        </select>
        <input
          type="number"
          placeholder="solarSystemId"
          value={state.solarSystemId ?? ""}
          onChange={(e) => actions.setField("solarSystemId", Number(e.target.value))}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="sponsorshipFee"
          value={state.sponsorshipFee}
          onChange={(e) => actions.setField("sponsorshipFee", Number(e.target.value))}
          className="border p-2"
        />
        <input type="number" placeholder="maxTeams" value={state.maxTeams} onChange={(e) => actions.setField("maxTeams", Number(e.target.value))} className="border p-2" />
        <input type="number" placeholder="entryFee" value={state.entryFee} onChange={(e) => actions.setField("entryFee", Number(e.target.value))} className="border p-2" />
        <input
          type="number"
          placeholder="durationHours"
          value={state.durationHours}
          onChange={(e) => actions.setField("durationHours", Number(e.target.value))}
          className="border p-2"
        />
      </div>
      <textarea
        placeholder="targetNodeIds, comma separated"
        value={targetsText}
        onChange={(e) => {
          setTargetsText(e.target.value);
          actions.setField(
            "targetNodeIds",
            e.target.value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          );
        }}
        className="w-full border p-2"
      />
      <div className="flex gap-2">
        <button
          className="border px-3 py-2"
          onClick={() => {
            if (authState.walletAddress) void actions.createDraft(authState.walletAddress);
          }}
          disabled={state.loading || !authState.walletAddress}
        >
          Create Draft
        </button>
        <button
          className="border px-3 py-2"
          onClick={() => {
            if (authState.walletAddress) void actions.publish(authState.walletAddress);
          }}
          disabled={state.loading || !state.draftId || !authState.walletAddress}
        >
          Publish
        </button>
      </div>
      <p className="text-sm">draftId: {state.draftId ?? "none"}</p>
      {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
    </section>
  );
}
