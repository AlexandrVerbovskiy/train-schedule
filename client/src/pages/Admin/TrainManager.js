import React, { useState, useEffect, useCallback } from "react";
import * as trainsApi from "../../api/trains";
import * as stationsApi from "../../api/stations";
import ConfirmModal from "../../components/Common/Modal/ConfirmModal";

import TrainRow from "../../components/Admin/Trains/TrainRow";
import TrainCreateModal from "../../components/Admin/Trains/TrainCreateModal";
import TrainHeaderActions from "../../components/Admin/Trains/TrainHeaderActions";
import CustomTable from "../../components/Common/CustomTable";

const TrainManager = () => {
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [trainsData, stationsData] = await Promise.all([
        trainsApi.getAllTrains(page, 6),
        stationsApi.getAllStations(),
      ]);

      if (trainsData.data) setTrains(trainsData.data);
      if (stationsData) setStations(stationsData);
    } catch (err) {
      setError("Failed to fetch data");
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (formData, id) => {
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...formData,
        routeItems: formData.routeItems.map((item, idx) => {
          const [arrivalHour = "0", arrivalMinute = "0"] = (item.arrivalTime || "00:00").split(":");
          const [departureHour = "0", departureMinute = "0"] = (item.departureTime || "00:00").split(":");
          
          return {
            stationId: item.stationId,
            order: idx + 1,
            arrivalHour: parseInt(arrivalHour, 10),
            arrivalMinute: parseInt(arrivalMinute, 10),
            departureHour: parseInt(departureHour, 10),
            departureMinute: parseInt(departureMinute, 10),
          };
        }),
      };

      let data;
      if (id) {
        data = await trainsApi.updateTrain(id, payload);
      } else {
        data = await trainsApi.createTrain(payload);
      }

      if (data.error || data.message)
        throw new Error(data.message || "Operation failed");

      setIsModalOpen(false);
      setEditingTrain(null);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await trainsApi.deleteTrain(deleteConfirmId);
      fetchData();
    } catch (err) {
      setError("Deletion failed");
    }
    setDeleteConfirmId(null);
  };

  return (
    <>
      <CustomTable
        title="Trains"
        headerActions={<TrainHeaderActions onCreateClick={() => { setError(""); setIsModalOpen(true); }} />}
        headers={["ID", "Number", "Name", "Type", "Stops", "Actions"]}
        items={trains}
        emptyText="No trains found"
        page={page}
        onPageChange={setPage}
        loading={loading}
        renderRow={(train) => (
          <TrainRow 
            key={train.id} 
            train={train} 
            onDelete={setDeleteConfirmId} 
            onEdit={(t) => {
              setError("");
              setEditingTrain(t);
              setIsModalOpen(true);
            }}
          />
        )}
      />

      <TrainCreateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTrain(null);
          setError("");
        }}
        onCreate={handleSubmit}
        stations={stations}
        loading={loading}
        initialData={editingTrain}
        error={error}
      />

      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
        title="Delete Train?"
        message="Are you sure you want to delete this train?"
        confirmText="Delete"
      />
    </>
  );
};

export default TrainManager;
