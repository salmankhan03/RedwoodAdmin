import React, { useEffect, useState } from 'react';
import Sidebar from '../Component/Sidebar/Sidebar';
import Navbar from '../Component/Navbar/Navbar';
import Button from "../Component/ButtonComponents/ButtonComponents";
import Modal from 'react-bootstrap/Modal';
import MediaServices from '../../Services/MediaServices';
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from "../Component/ToastComponents/ToastComponents";
import Skeleton from '../Component/SkeletonComponent/SkeletonComponent';
import { useNavigate } from 'react-router-dom';

const mediaItems = [
  {
    id: 1,
    type: "images",
    title: "Image 3",
    src: "https://dev.jackychee.com/assets/dummy_Assetes/service_img1.jpg",
    alt: "Image 1",
    isImage: true,
  },
  {
    id: 2,
    type: "images",
    title: "Image 4",
    src: "https://dev.jackychee.com/assets/dummy_Assetes/service_img2.jpg",
    alt: "Image 2",
    isImage: true,
  },
  {
    id: 3,
    type: "videos",
    title: "Video 2",
    src: "https://dev.jackychee.com/assets/dummy_Assetes/video.mp4",
    isVideo: true,
  },
  {
    id: 4,
    type: "documents",
    title: "Document 2",
    src: "https://dev.jackychee.com/assets/dummy_Assetes/servdsice_img2.jpg",
    thumbnail: "/assets/dummy_Assetes/pdf.jpg",
    isDocument: true,
  },

];


const placeholderImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019"; // Path to a placeholder image
const placeholderVideo = "https://www.shutterstock.com/image-vector/no-video-available-sign-isolated-260nw-2227175051.jpg"; // Path to a video placeholder image
const placeholderDocument = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019"; // Path to a placeholder image

function Media() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const mediaPerPage = (12)
  const [hasMore, setHasMore] = useState(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [filteredItems, setFilteredItems] = useState(mediaItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true)
  const [modalContent, setModalContent] = useState({
    id: "",
    src: "",
    type: "",
    title: "",
    url: "",
  });
  useEffect(() => {
    setLoading(true)
    fetchMedia(currentPage);
  }, [])

  const fetchMedia = async (page) => {
    try {
      const formdata = new FormData();
      formdata.append("page", page);
      formdata.append("pageSize", mediaPerPage);

      const resp = await MediaServices.getMediaList(formdata);
      if (resp?.status_code === 200) {
        console.log(resp);

        if (page === 1) {
          setMediaList(resp?.list?.data || []);
        } else {
          setMediaList((prevList) => [...prevList, ...resp?.list?.data]);
        }

        setCurrentPage(resp?.list?.current_page);
        setHasMore(resp?.list?.next_page_url !== null);

        setTimeout(() => handleClose(), 3000);
      } else {
        notifyError("Please try again.",);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      notifyError("An error occurred during fetch Data. Please try again.",);
    } finally {
      setLoading(false);
    }
  };
  const deleteMedia = async (id) => {
    try {
      const resp = await MediaServices.deleteMedia(id);
      if (resp?.status_code === 200) {
        console.log(resp);
        notifySuccess(resp?.message,);
        setTimeout(() =>
          setLoading(true),
          setShowModal(false),
          fetchMedia(currentPage),
          3000);

      } else {
        notifyError("Please try again.",);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      notifyError("An error occurred during fetch Data. Please try again.",);
    } finally {
      setLoading(false);
    }
  };


  const handleViewClick = (item) => {
    setModalContent({
      id: item?.id,
      src: item.path,
      type: item.category,
      title: item.name,
      url: item.path,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  const handleSearch = () => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const searchedItems = mediaItems.filter((item) =>
      item.title.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredItems(searchedItems);
  };

  const handleFilter = (type) => {
    if (type === "all") {
      setFilteredItems(mediaItems);
    } else {
      setFilteredItems(mediaItems.filter((item) => item.type === type));
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };


  const gotoNextPage = () => {
    if (hasMore) {
      fetchMedia(currentPage + 1);
    }
  };
  const jumpToFirstItem = () => {
    setCurrentPage(1)
    fetchMedia(1);
  };
  const handleDelete = () => {
    deleteMedia(modalContent?.id)
  };
  const gotoUploadMedia = () =>{
    navigate('/upload-media')
  }

  return (
    <React.Fragment>
      <div style={{ height: '100vh' }}> {/* Set height to 100vh to ensure full page */}
        <div className="">
          {/* Sidebar */}
          <Sidebar isVisible={isSidebarVisible} />

          {/* Main Content */}
          <div className={`main-content bodyBg ${isSidebarVisible ? 'shifted' : ''}`}>
            <Navbar toggleSidebar={toggleSidebar} />

            {/* Dashboard Content */}
            <div className="dashboard-content">
              <div className="container-fluid">
                <div className="row mt-5 align-items-center customWhiteBg pt-3 pb-3">
                  <div className="col-4">
                    <h3>Media</h3>
                  </div>
                  <div className="col-8 d-flex justify-content-end">
                    <Button
                      text="Add New Media File"
                      className="btn btn-primary"
                      type="button"
                      onClick={gotoUploadMedia}
                    >
                      Add New Media File
                    </Button>

                  </div>
                </div>
                <br />
                <div className='customWhiteBg row'>
                  <nav className="pt-3 pb-2">
                    <div className="row">
                      <div className="col-md-8">
                        <Button
                          variant="primary"
                          className="btn btn-outline-secondary ms-auto w-auto me-2 media-btn"
                          type="button"
                          text="All"
                          onClick={() => handleFilter("all")}
                        />
                        <Button
                          variant="primary"
                          className="btn btn-outline-secondary ms-auto w-auto me-2"
                          type="button"
                          text="Images"
                          onClick={() => handleFilter("images")}
                        />
                        <Button
                          variant="primary"
                          className="btn btn-outline-secondary ms-auto w-auto me-2"
                          type="button"
                          text="Videos"
                          onClick={() => handleFilter("videos")}
                        />
                        <Button
                          variant="primary"
                          className="btn btn-outline-secondary ms-auto w-auto me-2"
                          type="button"
                          text="Documents"
                          onClick={() => handleFilter("documents")}
                        />
                        <Button
                          variant="primary"
                          className="btn btn-outline-danger ms-auto w-auto me-2"
                          type="button"
                          text="Reset All Filters"
                          onClick={() => handleFilter("all")}
                        />
                      </div>
                      <div className="col-md-4">
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Search media..."
                            aria-label="Search media.."
                            aria-describedby="basic-addon2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <div className="input-group-append">
                            <Button
                              variant="primary"
                              className="btn btn-outline-secondary ms-auto w-auto "
                              type="button"
                              text="search"
                              onClick={handleSearch}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
                  <br />
                  <div className="container">
            
                    <div
                      className="row p-2"
                      id="mediaItems"
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        height: "400px",
                        overflowY: "auto",
                      }}
                    >
                      {loading ? (
                        <>
                          {/* Skeleton Loader */}
                          {Array.from({ length: 12 }).map((_, index) => (
                            <div key={index} className="col-md-3 media-item">
                              <div className="card cardBorder mb-4">
                                {/* Skeleton Image */}
                                <div className="skeleton-box" style={{ width: "100%", height: "200px", backgroundColor: "#ddd" }}></div>

                                {/* Skeleton Card Body */}
                                <div className="card-body">
                                  <div className="skeleton-box" style={{ width: "60%", height: "20px", backgroundColor: "#ddd" }}></div>
                                  <div className="skeleton-box" style={{ width: "40%", height: "30px", backgroundColor: "#ddd", marginTop: "10px" }}></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          {mediaList.map((item) => (
                            <div className="col-md-3 media-item" key={item.id} data-type={item.type}>
                              <div className="card cardBorder mb-4">
                                {item.category === "image" && (
                                  <img
                                    src={item.path || placeholderImage}
                                    className="card-img-top"
                                    alt={item.alt || "Placeholder Image"}
                                    style={{
                                      width: "100%",
                                      height: "200px",
                                      objectFit: "contain",
                                    }}
                                    onError={(e) => (e.target.src = placeholderImage)}
                                  />
                                )}
                                {item.category === "video" && (
                                  <video className="card-img-top" controls>
                                    <source
                                      src={item.path || placeholderImage}
                                      type="video/mp4"
                                      onError={(e) => (e.target.src = placeholderVideo)}
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                                {item.category === "application" && (
                                  <a href={item.path} target="_blank" rel="noopener noreferrer">
                                    <img
                                      src={'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg'}
                                      className="card-img-top"
                                      alt="Document Thumbnail"
                                      style={{ width: "100%" }}
                                      onError={(e) => (e.target.src = placeholderDocument)}
                                    />
                                  </a>
                                )}
                                <div className="card-body">
                                  <h6 className="card-title">
                                    {item.name ? item.name.split('.').slice(0, -1).join('.') : "Untitled"}
                                  </h6>
                                  <div className="d-flex flex-column flex-md-row justify-content-md-center justify-content-center">
                                    <Button
                                      variant="primary"
                                      className="btn btn-primary w-auto me-2"
                                      type="button"
                                      text="View"
                                      onClick={() => handleViewClick(item)}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                            {hasMore && (
                              <div className="text-center">
                                <Button
                                  variant="primary"
                                  className="btn btn-primary ms-auto w-auto me-2"
                                  type="button"
                                  text={loading ? "Loading..." : "Load More"}
                                  onClick={gotoNextPage}
                                  disabled={loading} // Disable the button while loading
                                />
                              </div>
                            )} {currentPage !== 1 && (
                              <div className="text-center">
                                <button
                                  className="btn btn-secondary ms-auto w-auto me-2"
                                  onClick={jumpToFirstItem}
                                >
                                  Jump to First Loaded Item
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                  </div>
              
                  {/* Modal */}
                  <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                      <Modal.Title>{modalContent.title || "Details"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className='row'>
                        <div className='col-md-4'>
                          {modalContent.type === "image" && (
                            <img
                              src={modalContent.src || placeholderImage}
                              className="card-img-top"
                              alt={modalContent.title || "Media"}
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "contain",
                              }}
                              onError={(e) => (e.target.src = placeholderImage)}
                            />
                          )}
                          {modalContent.type === "video" && (
                            <video controls style={{ width: "100%" }}>
                              <source src={modalContent.src} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          )}
                          {modalContent.type === "application" && (
                            <img
                              src={'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg'}
                              alt={modalContent.title || "Document"}
                              style={{ width: "100%", height: "auto", objectFit: "contain" }}
                            />
                          )}

                        </div>
                        <div className='col-md-8'>
                          <h6>File URL:</h6>
                          <a
                            href={modalContent.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {modalContent.url}
                          </a>
                          <div>
                            <Button
                              variant="primary"
                              className="btn btn-danger btn-sm mt-2"
                              type="button"
                              text="Delete"
                              onClick={() => handleDelete()}
                            />
                          </div>
                        </div>

                      </div>

                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <ToastContainer />


                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>


  );
}

export default Media;
