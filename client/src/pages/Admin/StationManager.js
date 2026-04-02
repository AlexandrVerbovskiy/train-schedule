import React, { useState, useEffect, useCallback } from "react";
import * as stationsApi from "../../api/stations";
import ConfirmModal from "../../components/Common/Modal/ConfirmModal";
import CustomTable from "../../components/Common/CustomTable";

import StationRow from "../../components/Admin/Stations/StationRow";
import StationCreateModal from "../../components/Admin/Stations/StationCreateModal";
import StationHeaderActions from "../../components/Admin/Stations/StationHeaderActions";

const StationManager = () => {
  const [stations, setStations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchStations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await stationsApi.getStations(page, 6);
      if (response.error) {
        setError(response.message);
      } else if (response.data) {
        setStations(response.data);
        setTotalCount(response.count || 0);
      }
    } catch (err) {
      setError("Failed to download stations");
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const handleEdit = (station) => {
    setEditingStation(station);
    setIsModalOpen(true);
  };

  const handleSubmit = async (name) => {
    setLoading(true);
    setError("");
    try {
      const resp = editingStation
        ? await stationsApi.updateStation(editingStation.id, name)
        : await stationsApi.createStation(name);

      if (resp.error) {
        setError(resp.message);
        setLoading(false);
        return;
      }

      if (!editingStation) {
        setPage(1);
      }

      setIsModalOpen(false);
      setEditingStation(null);
      await fetchStations();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await stationsApi.deleteStation(deleteConfirmId);
      fetchStations();
    } catch (err) {
      setError("Failed to delete station");
    }
    setDeleteConfirmId(null);
  };

  return (
    <>
      <CustomTable
        title="Stations"
        headerActions={
          <StationHeaderActions
            onCreateClick={() => {
              setEditingStation(null);
              setIsModalOpen(true);
            }}
          />
        }
        headers={["ID", "Name", "Actions"]}
        items={stations}
        emptyText="No stations found"
        page={page}
        totalPages={Math.ceil(totalCount / 6)}
        onPageChange={setPage}
        loading={loading}
        renderRow={(station) => (
          <StationRow
            key={station.id}
            station={station}
            onEdit={handleEdit}
            onDelete={setDeleteConfirmId}
          />
        )}
      />

      <StationCreateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStation(null);
          setError("");
        }}
        onSubmit={handleSubmit}
        initialName={editingStation?.name || ""}
        title={editingStation ? "Update Station" : "Add New Station"}
        loading={loading}
        error={error}
      />

      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
        title="Delete Station?"
        message="Are you sure you want to delete this station?"
        confirmText="Remove Station"
      />
    </>
  );
};

export default StationManager;
