import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../../Styles/vendorpages/vendorproducts.css";
import ProductForm from "../../components/vendor_components/Productform";
import ProductDetailsModal from "../../components/vendor_components/ProductDetailsModal";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const VendorProducts = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vendorId = queryParams.get("vendorId");

  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false); // State for showing the details modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [_id, set_id] = useState();
  const [editProduct, setEditProduct] = useState(null);
  const [previousProductIndex, setPreviousProductIndex] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPreviousProductIndex(currentProductIndex);
      setCurrentProductIndex(
        (prevIndex) => (prevIndex + 1) % featuredProducts.length
      );
    }, 5000); // Change featured event every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [featuredProducts.length, currentProductIndex]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not authorized. Please log in.");
      navigate("/login");
    } else {
      axios
        .post(
          "http://localhost:5000/api/protected/get_id",
          {},
          { headers: { Authorization: `Bearer ${token}` } } // Pass token in Authorization header
        )
        .then((response) => {
          set_id(response.data.user._id);
          console.log(response.data);
          console.log(_id);
        })
        .catch((error) => {
          alert(error);
        });
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const result = await axios.get(
        `http://localhost:5000/api/vendor/products/get_products/${vendorId}`
      );
      if (result.data.products && result.data.products.length > 0) {
        setProducts(result.data.products);
        setFeaturedProducts(result.data.products.slice(0, 5)); // Get first 5 products
      } else {
        setProducts([]);
        setFeaturedProducts([]);
        console.log("No products found.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("stock", stock);
    images.forEach((image) => formData.append("images", image));
    formData.append("_id", _id);
    formData.append("editProduct", editProduct);

    const url = editProduct
      ? `http://localhost:5000/api/vendor/products/update_product`
      : `http://localhost:5000/api/vendor/products/add-product`;

    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        alert(result.data.message);
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });

    setShowForm(false);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setStock(0);
    setImages([]);
    setEditProduct(null);
  };

  const handleDelete = async (productId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (isConfirmed) {
      console.log(productId);
      axios
        .post("http://localhost:5000/api/vendor/products/delete-product", {
          _id: productId,
        })
        .then((result) => {
          alert(result.data.message);
          fetchProducts();
        });
    } else {
      alert("Product deletion cancelled.");
    }
  };

  const handleEdit = (product) => {
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
    setStock(product.stock);
    setImages(product.images || []);
    setEditProduct(product._id);
    setShowForm(true);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product); // Set the selected product
    setShowDetails(true); // Show the modal
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedProduct(null);
  };

  return (
    <div className="products-container">
      <Header />
      {featuredProducts.length > 0 && (
        <div className="featured-products">
          <div className="featured-product">
            <img
              src={`http://localhost:5000/${featuredProducts[currentProductIndex]?.images[0]}`}
              alt={featuredProducts[currentProductIndex]?.name}
              className="featured-image"
            />
            <div className="featured-info">
              <h1>{featuredProducts[currentProductIndex]?.name}</h1>
              <p>{featuredProducts[currentProductIndex]?.description}</p>
              <p>💲 Price: ${featuredProducts[currentProductIndex]?.price}</p>
              <p>📦 Stock: {featuredProducts[currentProductIndex]?.stock}</p>
            </div>
          </div>
        </div>
      )}

      <div className="buttons-container">
        <button onClick={() => setShowForm(true)} className="product-button">
          Add Product
        </button>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-card-image-container">
              <img
                src={`http://localhost:5000/${product.images[0]}`}
                alt={product.name}
                className="product-card-image"
              />
              <button
                className="delete-button"
                onClick={() => handleDelete(product._id)}
              >
                ✖
              </button>
              <button
                className="edit-button"
                onClick={() => handleEdit(product)}
              >
                ✎
              </button>
            </div>
            <div className="product-card-info">
              <h3>{product.name}</h3>
              <p>💲 Price: ${product.price}</p>
              <p>📦 Stock: {product.stock}</p>
              <button
                className="view-details-button"
                onClick={() => handleViewDetails(product)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {showDetails && (
        <ProductDetailsModal
          show={showDetails}
          handleClose={closeDetailsModal}
          product={selectedProduct}
        />
      )}

      {showForm && (
        <ProductForm
          show={showForm}
          handleClose={() => setShowForm(false)}
          handleSubmit={handleSubmit}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          price={price}
          setPrice={setPrice}
          category={category}
          setCategory={setCategory}
          stock={stock}
          setStock={setStock}
          setImages={setImages}
        />
      )}
      <Footer />
    </div>
  );
};

export default VendorProducts;
