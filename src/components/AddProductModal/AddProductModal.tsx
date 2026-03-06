import React, { useState } from 'react';
import Icon from "../Icon/Icon";

import s from './AddProductModal.module.css';


interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: { title: string; price: number; brand: string; sku: string }) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    brand: '',
    sku: '',
  });

  const [errors, setErrors] = useState({
    title: '',
    price: '',
    brand: '',
    sku: '',
  });

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {
      title: '',
      price: '',
      brand: '',
      sku: '',
    };

    if (!formData.title.trim()) {
      newErrors.title = 'Наименование обязательно';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Цена обязательна';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Цена должна быть положительным числом';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Вендор обязателен';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'Артикул обязателен';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onAdd({
        title: formData.title,
        price: Number(formData.price),
        brand: formData.brand,
        sku: formData.sku,
      });

      setFormData({
        title: '',
        price: '',
        brand: '',
        sku: '',
      });

      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>
        <div className={s.header}>
          <h2 className={s.title}>Добавить новый товар</h2>
          <button className={s.closeButton} onClick={onClose}>
            <Icon name="close" width={18} height={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.formGroup}>
            <label htmlFor="title" className={s.label}>
              Наименование <span className={s.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`${s.input} ${errors.title ? s.inputError : ''}`}
              placeholder="Введите название товара"
            />
            {errors.title && <span className={s.errorText}>{errors.title}</span>}
          </div>

          <div className={s.formGroup}>
            <label htmlFor="price" className={s.label}>
              Цена <span className={s.required}>*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`${s.input} ${errors.price ? s.inputError : ''}`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.price && <span className={s.errorText}>{errors.price}</span>}
          </div>

          <div className={s.formGroup}>
            <label htmlFor="brand" className={s.label}>
              Вендор <span className={s.required}>*</span>
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`${s.input} ${errors.brand ? s.inputError : ''}`}
              placeholder="Введите бренд"
            />
            {errors.brand && <span className={s.errorText}>{errors.brand}</span>}
          </div>

          <div className={s.formGroup}>
            <label htmlFor="sku" className={s.label}>
              Артикул <span className={s.required}>*</span>
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`${s.input} ${errors.sku ? s.inputError : ''}`}
              placeholder="Например: SKU-1234"
            />
            {errors.sku && <span className={s.errorText}>{errors.sku}</span>}
          </div>

          <div className={s.actions}>
            <button type="button" className={s.cancelButton} onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className={s.submitButton}>
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;