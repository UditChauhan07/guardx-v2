import React, { useState } from 'react';
import styles from './ExcelAddSociety.module.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import { FaCloudUploadAlt, FaFileExcel } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const ExcelAddSociety = () => {
    const [moduleTitle, setModuleTitle] = useState('Upload Societies via Excel');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleSidebarClick = (title) => {
        setModuleTitle(title);
    };

    // Handle File Selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
            setFile(selectedFile);
        } else {
            toast.error("Please upload a valid Excel file (.xlsx)");
        }
    };

    // Drag and Drop Functionality
    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.name.endsWith('.xlsx')) {
            setFile(droppedFile);
        } else {
            toast.error("Please upload a valid Excel file (.xlsx)");
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Handle Upload Functionality
    const handleUpload = async () => {
        if (!file) {
            toast.warning("Please select an Excel file to upload.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post("https://api-kpur6ixuza-uc.a.run.app/upload-societies", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success("Societies uploaded successfully!");
            setFile(null);
            navigate('/society'); // Redirect back to society list
        } catch (error) {
            toast.error("Error uploading file. Please try again.");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Navbar moduleTitle={moduleTitle} />
            <Sidebar onClick={handleSidebarClick} />

            <div className={styles.uploadSection}>
                <h2>Upload Societies via Excel</h2>

                <div
                    className={styles.dropZone}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <FaCloudUploadAlt size={60} className={styles.uploadIcon} />
                    <p>Drag & Drop your Excel file here or</p>
                    <label className={styles.fileInputLabel}>
                        <input type="file" accept=".xlsx" onChange={handleFileChange} hidden />
                        Click to Browse
                    </label>
                </div>

                {file && (
                    <div className={styles.filePreview}>
                        <FaFileExcel size={40} className={styles.fileIcon} />
                        <span>{file.name}</span>
                    </div>
                )}

                <button
                    className={`${styles.uploadButton} ${uploading ? styles.disabled : ''}`}
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Upload File"}
                </button>
            </div>
        </div>
    );
};

export default ExcelAddSociety;
