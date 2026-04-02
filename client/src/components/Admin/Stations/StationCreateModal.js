import React, { useState, useEffect } from "react";
import Modal from "../../Common/Modal/Modal";
import Input from "../../Common/Input";
import { GhostButton, ActionButton } from "../../Common/Button";

const StationCreateModal = ({
  error,
  isOpen,
  onClose,
  onSubmit,
  initialName = "",
  title = "Add New Station",
  loading,
}) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
    }
  }, [isOpen, initialName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-500 pl-2">
            Location
          </label>
          <Input
            placeholder="London"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 bg-white/5 rounded-xl border border-white/5 text-sm"
          />
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-xs font-bold text-red-400">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <ActionButton
            type="submit"
            disabled={loading}
            className="flex-1 h-14"
          >
            {loading ? "Saving..." : "Save"}
          </ActionButton>
          <GhostButton type="button" onClick={onClose} className="flex-1 h-14">
            Cancel
          </GhostButton>
        </div>
      </form>
    </Modal>
  );
};

export default StationCreateModal;
