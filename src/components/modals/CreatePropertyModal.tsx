import React, { useState } from "react";
import { Modal } from "./Modal";
import { Input, Select } from "../ui/Input";
import { Button } from "../ui/Button";
import { useCreateProperty } from "../../hooks/contractHooks";
import { useApp } from "../../context/AppContext";
import { PropertyFormData } from "../../types";
import {
  PROPERTY_TYPE_OPTIONS,
  PROPERTY_CATEGORY_OPTIONS,
  WARRANTY_OPTIONS,
} from "../../utils/helpers";

export function CreatePropertyModal() {
  const { closeModal, addToast, refreshProperties } = useApp();
  const { createProperty, isLoading, isSuccess } = useCreateProperty();

  const [form, setForm] = useState<PropertyFormData>({
    amount: "",
    propType: "Villa",
    category: "Beachfront",
    warranty: "10 years",
  });

  const [errors, setErrors] = useState<Partial<PropertyFormData>>({});

  const validate = () => {
    const errs: Partial<PropertyFormData> = {};
    if (!form.amount || Number(form.amount) <= 0)
      errs.amount = "Price must be greater than 0";
    if (!form.propType) errs.propType = "Property type is required";
    if (!form.category) errs.category = "Category is required";
    if (!form.warranty) errs.warranty = "Warranty is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await createProperty(form);
    addToast({
      type: "success",
      title: "Property Created",
      message: "Asset initialized successfully",
    });
    refreshProperties();
    closeModal();
  };

  const typeOptions = PROPERTY_TYPE_OPTIONS.slice(1).map((v) => ({
    value: v,
    label: v,
  }));
  const categoryOptions = PROPERTY_CATEGORY_OPTIONS.slice(1).map((v) => ({
    value: v,
    label: v,
  }));
  const warrantyOptions = WARRANTY_OPTIONS.map((v) => ({ value: v, label: v }));

  return (
    <Modal title="Create New Property">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        <div className="col-span-2">
          <Input
            label="Price (Token Units)"
            type="number"
            placeholder="e.g. 500000"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            error={errors.amount}
          />
        </div>

        <Select
          label="Property Type"
          options={typeOptions}
          value={form.propType}
          onChange={(e) => setForm({ ...form, propType: e.target.value })}
          error={errors.propType}
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          error={errors.category}
        />

        <div className="col-span-2">
          <Select
            label="Warranty"
            options={warrantyOptions}
            value={form.warranty}
            onChange={(e) => setForm({ ...form, warranty: e.target.value })}
            error={errors.warranty}
          />
        </div>

        {/* Info box */}
        <div className="col-span-2 bg-primary-container/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">
              info
            </span>
            <p className="text-xs text-on-surface-variant font-body leading-relaxed">
              Creating a property will deploy an on-chain asset. You'll need to
              separately list it to make it available in the marketplace.
            </p>
          </div>
        </div>

        <div className="col-span-2 flex gap-4 pt-2">
          <Button variant="ghost" fullWidth type="button" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            fullWidth
            type="submit"
            isLoading={isLoading}
          >
            Initialize Asset
          </Button>
        </div>
      </form>
    </Modal>
  );
}
