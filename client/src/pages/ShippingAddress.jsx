import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function ShippingAddress() {
  const serverUrl = import.meta.env.VITE_API_BASE_URL;
  const apiLocation = "https://location.andika.my.id";
  const navigate = useNavigate();
  const access_token = localStorage.getItem("access_token");

  const [province, setProvince] = useState([]);
  const [regency, setRegency] = useState([]);
  const [district, setDistrict] = useState([]);
  const [village, setVillage] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    country: { value: "Indonesia", label: "Indonesia" },
    province: {},
    regency: {},
    district: {},
    village: {},
    address: "",
    zipCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (e) => {
    const { name } = e.target;
    const selectedOption = e.target.options[e.target.selectedIndex];
    const result = {
      value: Number(selectedOption.value),
      label: selectedOption.text,
    };
    setFormData((prev) => ({ ...prev, [name]: result }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneNumber || !formData.address) {
      return Swal.fire("Error", "Please fill all required fields", "error");
    }
    try {
      await axios.post(
        serverUrl + "/shipping",
        {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          country: formData.country.label,
          province: formData.province.label,
          regency: formData.regency.label,
          district: formData.district.label,
          village: formData.village.label,
          address: formData.address,
          zipCode: formData.zipCode,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      Swal.fire({
        title: "Shipping Address created successfully",
        icon: "success",
        draggable: true,
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        title: error.response?.data?.message || error.message,
        icon: "error",
      });
      console.log(error);
    }
    console.log(formData);
  };

  const fetchProvince = useCallback(async () => {
    try {
      const response = await axios.get(apiLocation + "/api/provinces.json");
      setProvince(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchRegency = useCallback(async () => {
    if (!formData.province.value) return;
    try {
      const response = await axios.get(
        `${apiLocation}/api/regencies/${formData.province.value}.json`
      );
      setRegency(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [formData.province]);

  const fetchDistrict = useCallback(async () => {
    if (!formData.regency.value) return;
    try {
      const response = await axios.get(
        `${apiLocation}/api/districts/${formData.regency.value}.json`
      );
      setDistrict(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [formData.regency]);

  const fetchVillage = useCallback(async () => {
    if (!formData.district.value) return;
    try {
      const response = await axios.get(
        `${apiLocation}/api/villages/${formData.district.value}.json`
      );
      setVillage(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [formData.district]);

  useEffect(() => {
    fetchProvince();
  }, [fetchProvince]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      regency: {},
      district: {},
      village: {},
    }));
    setRegency([]);
    setDistrict([]);
    setVillage([]);
    fetchRegency();
  }, [formData.province, fetchRegency]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, district: {}, village: {} }));
    setDistrict([]);
    setVillage([]);
    fetchDistrict();
  }, [formData.regency, fetchDistrict]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, village: {} }));
    setVillage([]);
    fetchVillage();
  }, [formData.district, fetchVillage]);

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title text-center mb-4">Register</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Country</label>
                <select
                  name="country"
                  className="form-select"
                  onChange={handleSelect}
                  value={formData.country.value}
                >
                  <option value="Indonesia">Indonesia</option>
                </select>
              </div>

              {province.length > 0 && (
                <div className="mb-3">
                  <label className="form-label">Province</label>
                  <select
                    name="province"
                    className="form-select"
                    onChange={handleSelect}
                    value={formData.province.value || ""}
                  >
                    <option value="">Select Province</option>
                    {province.map((el) => (
                      <option key={el.id} value={el.id}>
                        {el.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {regency.length > 0 && (
                <div className="mb-3">
                  <label className="form-label">Regency</label>
                  <select
                    name="regency"
                    className="form-select"
                    onChange={handleSelect}
                    value={formData.regency.value || ""}
                  >
                    <option value="">Select Regency</option>
                    {regency.map((el) => (
                      <option key={el.id} value={el.id}>
                        {el.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {district.length > 0 && (
                <div className="mb-3">
                  <label className="form-label">District</label>
                  <select
                    name="district"
                    className="form-select"
                    onChange={handleSelect}
                    value={formData.district.value || ""}
                  >
                    <option value="">Select District</option>
                    {district.map((el) => (
                      <option key={el.id} value={el.id}>
                        {el.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {village.length > 0 && (
                <div className="mb-3">
                  <label className="form-label">Village</label>
                  <select
                    name="village"
                    className="form-select"
                    onChange={handleSelect}
                    value={formData.village.value || ""}
                  >
                    <option value="">Select Village</option>
                    {village.map((el) => (
                      <option key={el.id} value={el.id}>
                        {el.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">ZIP Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
