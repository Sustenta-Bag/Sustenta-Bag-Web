"use client";

import React, { useState, useEffect } from "react";
import { Bag, UpdateBagRequest } from "@/services/bagsService";
import Loading from "@/components/loading/Loading";

interface EditBagModalProps {
  isOpen: boolean;
  onClose: () => void;
  bag: Bag | null;
  onSave: (id: number, data: UpdateBagRequest) => Promise<void>;
  isLoading: boolean;
}

const EditBagModal: React.FC<EditBagModalProps> = ({
  isOpen,
  onClose,
  bag,
  onSave,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    type: "Doce" as "Doce" | "Salgada" | "Mista",
    price: "",
    description: "",
    status: 1,
  });

  useEffect(() => {
    if (bag) {
      setFormData({
        type: bag.type,
        price: bag.price.toString(),
        description: bag.description,
        status: bag.status,
      });
    }
  }, [bag]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bag) return;

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      return;
    }

    const bagData: UpdateBagRequest = {
      type: formData.type,
      price: price,
      description: formData.description,
      idBusiness: bag.idBusiness,
      status: formData.status,
    };

    await onSave(bag.id, bagData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-700">Editar Sacola</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              disabled={isLoading}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="edit-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tipo da Sacola <span className="text-red-500">*</span>
              </label>
              <select
                id="edit-type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={isLoading}
              >
                <option value="Doce">Doce</option>
                <option value="Salgada">Salgada</option>
                <option value="Mista">Mista</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Preço (R$) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="edit-price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ex: 25.90"
                step="0.01"
                min="0"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="edit-status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="edit-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              >
                <option value={1}>Ativa</option>
                <option value={0}>Inativa</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição <span className="text-red-500">*</span>
              </label>
              <textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={4}
                placeholder="Descreva a sacola, seus ingredientes e características..."
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loading size="small" text="" />
                    <span>Atualizando...</span>
                  </div>
                ) : (
                  "Atualizar Sacola"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBagModal;
