"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

export type FieldDefinition = {
  label: string;
  type: "text" | "email" | "phone" | "number" | "textarea" | "url" | "file" | "select";
  required: boolean;
  options: string[];
};

const FIELD_TYPES = [
  { value: "text", label: "Short Text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "number", label: "Number" },
  { value: "textarea", label: "Long Text" },
  { value: "url", label: "URL / Link" },
  { value: "file", label: "File Upload" },
  { value: "select", label: "Dropdown Select" },
];

const PRESETS: Record<string, FieldDefinition[]> = {
  default: [
    { label: "Name", type: "text", required: true, options: [] },
    { label: "Email", type: "email", required: true, options: [] },
    { label: "Phone", type: "phone", required: true, options: [] },
    { label: "College", type: "text", required: true, options: [] },
  ],
  hackathon: [
    { label: "Team Name", type: "text", required: true, options: [] },
    { label: "Team Leader Name", type: "text", required: true, options: [] },
    { label: "Team Leader Email", type: "email", required: true, options: [] },
    { label: "Team Leader Phone", type: "phone", required: true, options: [] },
    { label: "College", type: "text", required: true, options: [] },
    { label: "Team Size", type: "number", required: true, options: [] },
    { label: "Member Names", type: "textarea", required: false, options: [] },
  ],
};

interface FormBuilderProps {
  fields: FieldDefinition[];
  onChange: (fields: FieldDefinition[]) => void;
}

export default function FormBuilder({ fields, onChange }: FormBuilderProps) {
  const [showPresets, setShowPresets] = useState(fields.length === 0);

  function addField() {
    onChange([
      ...fields,
      { label: "", type: "text", required: false, options: [] },
    ]);
    setShowPresets(false);
  }

  function removeField(index: number) {
    onChange(fields.filter((_, i) => i !== index));
  }

  function updateField(index: number, updates: Partial<FieldDefinition>) {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    onChange(newFields);
  }

  function moveField(from: number, to: number) {
    if (to < 0 || to >= fields.length) return;
    const newFields = [...fields];
    const [moved] = newFields.splice(from, 1);
    newFields.splice(to, 0, moved);
    onChange(newFields);
  }

  function addOption(fieldIndex: number) {
    const newFields = [...fields];
    newFields[fieldIndex] = {
      ...newFields[fieldIndex],
      options: [...newFields[fieldIndex].options, ""],
    };
    onChange(newFields);
  }

  function updateOption(fieldIndex: number, optionIndex: number, value: string) {
    const newFields = [...fields];
    const options = [...newFields[fieldIndex].options];
    options[optionIndex] = value;
    newFields[fieldIndex] = { ...newFields[fieldIndex], options };
    onChange(newFields);
  }

  function removeOption(fieldIndex: number, optionIndex: number) {
    const newFields = [...fields];
    const options = newFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
    newFields[fieldIndex] = { ...newFields[fieldIndex], options };
    onChange(newFields);
  }

  function applyPreset(presetKey: string) {
    onChange(PRESETS[presetKey].map((f) => ({ ...f, options: [...f.options] })));
    setShowPresets(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-zinc-400">
          Registration Form Fields
        </label>
        {fields.length === 0 && (
          <span className="text-xs text-zinc-500">Using default form</span>
        )}
      </div>

      {showPresets && fields.length === 0 && (
        <div className="bg-zinc-800/30 p-4 rounded-lg border border-zinc-700/50 space-y-3">
          <p className="text-xs text-zinc-400">Quick start with a template:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset("default")}
              className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded transition"
            >
              Default (Name, Email, Phone, College)
            </button>
            <button
              type="button"
              onClick={() => applyPreset("hackathon")}
              className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded transition"
            >
              Hackathon Template
            </button>
            <button
              type="button"
              onClick={addField}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition"
            >
              Start from Scratch
            </button>
          </div>
        </div>
      )}

      {fields.length > 0 && (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3 relative"
            >
              <div className="flex items-start gap-2">
                <div className="flex flex-col gap-1 pt-2">
                  <button
                    type="button"
                    onClick={() => moveField(index, index - 1)}
                    disabled={index === 0}
                    className="text-zinc-500 hover:text-white disabled:opacity-30 transition"
                  >
                    <GripVertical className="w-4 h-4 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveField(index, index + 1)}
                    disabled={index === fields.length - 1}
                    className="text-zinc-500 hover:text-white disabled:opacity-30 transition"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Field Label (e.g., Name, PPT Link)"
                      value={field.label}
                      onChange={(e) => updateField(index, { label: e.target.value })}
                      className="flex-1 bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                    <select
                      value={field.type}
                      onChange={(e) =>
                        updateField(index, {
                          type: e.target.value as FieldDefinition["type"],
                        })
                      }
                      className="bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      {FIELD_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`required-${index}`}
                      checked={field.required}
                      onChange={(e) => updateField(index, { required: e.target.checked })}
                      className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-600"
                    />
                    <label htmlFor={`required-${index}`} className="text-xs text-zinc-400 cursor-pointer">
                      Required
                    </label>
                  </div>

                  {field.type === "select" && (
                    <div className="space-y-2 pl-4 border-l-2 border-zinc-700">
                      <p className="text-xs text-zinc-500">Options:</p>
                      {field.options.map((option, oi) => (
                        <div key={oi} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder={`Option ${oi + 1}`}
                            value={option}
                            onChange={(e) => updateOption(index, oi, e.target.value)}
                            className="flex-1 bg-black border border-zinc-800 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(index, oi)}
                            className="p-1 text-zinc-500 hover:text-red-400 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(index)}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Option
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addField}
            className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-lg text-sm text-zinc-400 hover:text-white transition"
          >
            <Plus className="w-4 h-4" /> Add Field
          </button>
        </div>
      )}
    </div>
  );
}
