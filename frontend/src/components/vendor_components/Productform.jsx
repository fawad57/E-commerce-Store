import React, { useState } from "react";
import "../../Styles/components/productform.css";

const ProductForm = ({
  show,
  handleClose,
  handleSubmit,
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  category,
  setCategory,
  stock,
  setStock,
  setImages,
}) => {
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  return (
    show && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close-button" onClick={handleClose}>
            ×
          </button>
          <form onSubmit={handleSubmit} className="product-form">
            <h2 className="form-heading">Add New Product</h2>
            <label className="form-label">
              Product Name:
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Description:
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="form-textarea"
              />
            </label>
            <label className="form-label">
              Price:
              <input
                type="number"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="form-input"
                min="0"
              />
            </label>
            <label className="form-label">
              Category:
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="form-input"
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Books">Books</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="form-label">
              Stock:
              <input
                type="number"
                name="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="form-input"
                min="0"
              />
            </label>
            <label className="form-label">
              Product Images:
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  name="images"
                  onChange={handleImageChange}
                  required
                  className="file-input"
                  multiple
                />
                <span className="file-upload-text">Choose images</span>
              </div>
            </label>
            {imagePreviews.length > 0 && (
              <div className="picture-preview">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="picture-preview-image"
                  />
                ))}
              </div>
            )}
            <button type="submit" className="form-submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default ProductForm;
