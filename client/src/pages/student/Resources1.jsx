import React, {

  useContext,

  useEffect,

  useRef,

  useState,

} from "react";



import {

  BookOpen,

  Upload,

  FileText,

  X,

  Search,

  Download,

  Clock3,

  CheckCircle2,

} from "lucide-react";



import { AuthContext } from "../../context/AuthContext";



/* =========================================================

   CONSTANTS

========================================================= */



const RESOURCE_TYPES = [

  "Notes",

  "Question Papers",

  "Lab Manuals",

  "Important Questions",

];



const BRANCHES = [

  "CSE",

  "ISE",

  "ECE",

  "EEE",

  "MECH",

  "CIVIL",

];



const SEMESTERS = [

  1,

  2,

  3,

  4,

  5,

  6,

  7,

  8,

];



/* =========================================================

   FILE SIZE

========================================================= */



function formatFileSize(bytes) {

  if (!bytes) {

    return "";

  }



  if (bytes < 1024) {

    return `${bytes} B`;

  }



  if (bytes < 1024 * 1024) {

    return `${(bytes / 1024).toFixed(1)} KB`;

  }



  return `${(

    bytes /

    (1024 * 1024)

  ).toFixed(1)} MB`;

}



/* =========================================================

   COMPONENT

========================================================= */



function Resources() {

  const {

    authFetch,

    token,

    user,

  } = useContext(AuthContext);



  /* =======================================================

     FILE INPUT

  ======================================================= */



  const fileInputRef =

    useRef(null);



  /* =======================================================

     RESOURCES

  ======================================================= */



  const [resources, setResources] =

    useState([]);



  const [loading, setLoading] =

    useState(true);



  /* =======================================================

     SEARCH

  ======================================================= */



  const [search, setSearch] =

    useState("");



  const [filterType, setFilterType] =

    useState("All Resources");



  /* =======================================================

     MODAL

  ======================================================= */



  const [showUploadModal, setShowUploadModal] =

    useState(false);



  const [uploading, setUploading] =

    useState(false);



  /* =======================================================

     MESSAGES

  ======================================================= */



  const [message, setMessage] =

    useState("");



  const [messageType, setMessageType] =

    useState("");



  /* =======================================================

     FORM

  ======================================================= */



  const [form, setForm] =

    useState({

      title: "",

      subject: "",

      branch: "CSE",

      semester: "1",

      type: "Notes",

      description: "",

    });



  const [selectedFile, setSelectedFile] =

    useState(null);



  /* =========================================================

     MESSAGE HELPER

  ========================================================= */



  const showMessage = (

    text,

    type = "error"

  ) => {

    setMessage(text);

    setMessageType(type);

  };



  /* =========================================================

     LOAD RESOURCES

  ========================================================= */



  const loadResources = async () => {

    try {

      setLoading(true);



      setMessage("");

      setMessageType("");



      /*

       * IMPORTANT:

       * authFetch automatically adds:

       *

       * Authorization: Bearer <jit_token>

       */



      const response =

        await authFetch(

          "/api/student/resources"

        );



      const data =

        await response.json();



      console.log(

        "RESOURCES RESPONSE:",

        data

      );



      if (!response.ok) {

        throw new Error(

          data?.message ||

            "Failed to load resources."

        );

      }



      /*

       * Your backend returns:

       *

       * {

       *   success: true,

       *   data: [...]

       * }

       */



      let resourceList = [];



      if (

        Array.isArray(data?.data)

      ) {

        resourceList =

          data.data;

      } else if (

        Array.isArray(

          data?.resources

        )

      ) {

        resourceList =

          data.resources;

      } else if (

        Array.isArray(data)

      ) {

        resourceList = data;

      }



      setResources(

        resourceList

      );

    } catch (error) {

      console.error(

        "RESOURCE LOAD ERROR:",

        error

      );



      setResources([]);



      showMessage(

        error.message ||

          "Unable to load resources.",

        "error"

      );

    } finally {

      setLoading(false);

    }

  };



  /* =========================================================

     LOAD ON PAGE OPEN

  ========================================================= */



  useEffect(() => {

    /*

     * Wait until AuthContext has restored

     * the login session.

     */



    if (token) {

      loadResources();

    } else {

      setLoading(false);

    }

  }, [token]);



  /* =========================================================

     FORM CHANGE

  ========================================================= */



  const handleChange = (

    event

  ) => {

    const {

      name,

      value,

    } = event.target;



    setForm(

      (previous) => ({

        ...previous,

        [name]: value,

      })

    );



    setMessage("");

    setMessageType("");

  };



  /* =========================================================

     OPEN MODAL

  ========================================================= */



  const openUploadModal = () => {

    setMessage("");

    setMessageType("");



    setForm({

      title: "",

      subject: "",

      branch: "CSE",

      semester: "1",

      type: "Notes",

      description: "",

    });



    setSelectedFile(null);



    if (

      fileInputRef.current

    ) {

      fileInputRef.current.value =

        "";

    }



    setShowUploadModal(true);

  };



  /* =========================================================

     CLOSE MODAL

  ========================================================= */



  const closeUploadModal = () => {

    if (uploading) {

      return;

    }



    setShowUploadModal(false);



    setMessage("");

    setMessageType("");



    setForm({

      title: "",

      subject: "",

      branch: "CSE",

      semester: "1",

      type: "Notes",

      description: "",

    });



    setSelectedFile(null);



    if (

      fileInputRef.current

    ) {

      fileInputRef.current.value =

        "";

    }

  };



  /* =========================================================

     OPEN FILE PICKER

  ========================================================= */



  const openFilePicker = (

    event

  ) => {

    event.preventDefault();

    event.stopPropagation();



    if (uploading) {

      return;

    }



    if (

      fileInputRef.current

    ) {

      fileInputRef.current.click();

    }

  };



  /* =========================================================

     FILE CHANGE

  ========================================================= */



  const handleFileChange = (

    event

  ) => {

    event.stopPropagation();



    const file =

      event.target.files?.[0];



    if (!file) {

      return;

    }



    const allowedExtensions = [

      ".pdf",

      ".doc",

      ".docx",

      ".ppt",

      ".pptx",

    ];



    const extension =

      "." +

      file.name

        .split(".")

        .pop()

        .toLowerCase();



    if (

      !allowedExtensions.includes(

        extension

      )

    ) {

      showMessage(

        "Only PDF, DOC, DOCX, PPT and PPTX files are allowed.",

        "error"

      );



      event.target.value = "";



      setSelectedFile(null);



      return;

    }



    if (

      file.size >

      10 * 1024 * 1024

    ) {

      showMessage(

        "File size must be less than 10 MB.",

        "error"

      );



      event.target.value = "";



      setSelectedFile(null);



      return;

    }



    setSelectedFile(file);



    setMessage("");

    setMessageType("");

  };



  /* =========================================================

     REMOVE FILE

  ========================================================= */



  const removeFile = (

    event

  ) => {

    event.preventDefault();

    event.stopPropagation();



    setSelectedFile(null);



    if (

      fileInputRef.current

    ) {

      fileInputRef.current.value =

        "";

    }



    setMessage("");

    setMessageType("");

  };



  /* =========================================================

     UPLOAD

  ========================================================= */



  const handleUpload = async (

    event

  ) => {

    event.preventDefault();

    event.stopPropagation();



    if (uploading) {

      return;

    }



    setMessage("");

    setMessageType("");



    /* -------------------------------------------------------

       AUTH CHECK

    ------------------------------------------------------- */



    if (!token) {

      showMessage(

        "Your login session is missing. Please login again.",

        "error"

      );



      return;

    }



    /* -------------------------------------------------------

       TITLE

    ------------------------------------------------------- */



    if (

      !form.title.trim()

    ) {

      showMessage(

        "Please enter the resource title.",

        "error"

      );



      return;

    }



    /* -------------------------------------------------------

       SUBJECT

    ------------------------------------------------------- */



    if (

      !form.subject.trim()

    ) {

      showMessage(

        "Please enter the subject.",

        "error"

      );



      return;

    }



    /* -------------------------------------------------------

       FILE

    ------------------------------------------------------- */



    if (!selectedFile) {

      showMessage(

        "Please choose a file.",

        "error"

      );



      return;

    }



    /* -------------------------------------------------------

       FORM DATA

    ------------------------------------------------------- */



    const formData =

      new FormData();



    formData.append(

      "title",

      form.title.trim()

    );



    formData.append(

      "subject",

      form.subject.trim()

    );



    formData.append(

      "branch",

      form.branch

    );



    formData.append(

      "semester",

      String(

        form.semester

      )

    );



    formData.append(

      "type",

      form.type

    );



    formData.append(

      "description",

      form.description.trim()

    );



    /*

     * VERY IMPORTANT

     *

     * Backend uses:

     *

     * uploadResourceFile.single("file")

     *

     * Therefore the field MUST be:

     *

     * "file"

     */



    formData.append(

      "file",

      selectedFile

    );



    try {

      setUploading(true);



      console.log(

        "Uploading resource...",

        {

          title:

            form.title,

          subject:

            form.subject,

          branch:

            form.branch,

          semester:

            form.semester,

          type:

            form.type,

          file:

            selectedFile.name,

        }

      );



      /*

       * IMPORTANT:

       *

       * authFetch automatically

       * adds the JWT.

       *

       * DO NOT manually add

       * Content-Type here.

       *

       * Browser will automatically

       * generate multipart boundary.

       */



      const response =

        await authFetch(

          "/api/student/resources",

          {

            method: "POST",

            body: formData,

          }

        );



      const data =

        await response.json();



      console.log(

        "UPLOAD RESPONSE:",

        data

      );



      /* -----------------------------------------------------

         SERVER ERROR

      ----------------------------------------------------- */



      if (!response.ok) {

        throw new Error(

          data?.message ||

            data?.error ||

            "Resource upload failed."

        );

      }



      /* -----------------------------------------------------

         SUCCESS

      ----------------------------------------------------- */



      showMessage(

        "Resource uploaded successfully.",

        "success"

      );



      /* -----------------------------------------------------

         REFRESH RESOURCE LIST

      ----------------------------------------------------- */



      await loadResources();



      /* -----------------------------------------------------

         RESET AFTER SUCCESS

      ----------------------------------------------------- */



      setTimeout(() => {

        setShowUploadModal(false);



        setForm({

          title: "",

          subject: "",

          branch: "CSE",

          semester: "1",

          type: "Notes",

          description: "",

        });



        setSelectedFile(null);



        if (

          fileInputRef.current

        ) {

          fileInputRef.current.value =

            "";

        }



        setMessage("");

        setMessageType("");

      }, 1000);



    } catch (error) {

      console.error(

        "RESOURCE UPLOAD ERROR:",

        error

      );



      showMessage(

        error.message ||

          "Failed to upload resource.",

        "error"

      );



    } finally {

      setUploading(false);

    }

  };



  /* =========================================================

     FILTER

  ========================================================= */



  const filteredResources =

    resources.filter(

      (resource) => {

        const searchValue =

          search

            .toLowerCase()

            .trim();



        const title =

          resource.title

            ?.toLowerCase() ||

          "";



        const subject =

          resource.subject

            ?.toLowerCase() ||

          "";



        const matchesSearch =

          !searchValue ||

          title.includes(

            searchValue

          ) ||

          subject.includes(

            searchValue

          );



        const matchesType =

          filterType ===

            "All Resources" ||

          resource.type ===

            filterType;



        return (

          matchesSearch &&

          matchesType

        );

      }

    );



  /* =========================================================

     DOWNLOAD

  ========================================================= */



  const handleDownload = (

    resource

  ) => {

    if (

      !resource?.fileUrl

    ) {

      showMessage(

        "File is not available for this resource.",

        "error"

      );



      return;

    }



    const API_URL =

      import.meta.env

        .VITE_API_URL ||

      "http://localhost:5000";



    const fileUrl =

      resource.fileUrl.startsWith(

        "http"

      )

        ? resource.fileUrl

        : `${API_URL}${resource.fileUrl}`;



    window.open(

      fileUrl,

      "_blank",

      "noopener,noreferrer"

    );

  };



  /* =========================================================

     RENDER

  ========================================================= */



  return (

    <div className="resources-page">



      {/* =====================================================

          HEADER

      ===================================================== */}



      <div className="resources-header">



        <div>



          <p className="page-eyebrow">

            ACADEMIC RESOURCES

          </p>



          <h1>

            Resources

          </h1>



          <p>

            Find notes, question papers,

            lab manuals and important

            questions shared by JIT students.

          </p>



        </div>



        <button

          type="button"

          className="upload-resource-btn"

          onClick={

            openUploadModal

          }

        >

          <Upload size={18} />



          Upload Resource

        </button>



      </div>



      {/* =====================================================

          GLOBAL MESSAGE

      ===================================================== */}



      {message &&

        !showUploadModal && (

          <div

            className={`resource-alert ${

              messageType ===

              "success"

                ? "success"

                : "error"

            }`}

          >



            {messageType ===

            "success" ? (

              <CheckCircle2

                size={18}

              />

            ) : (

              <span>⚠</span>

            )}



            <span>

              {message}

            </span>



            <button

              type="button"

              onClick={() =>

                setMessage("")

              }

            >

              ×

            </button>



          </div>

        )}



      {/* =====================================================

          SEARCH

      ===================================================== */}



      <div className="resources-toolbar">



        <div className="resource-search">



          <Search

            size={18}

          />



          <input

            type="text"

            placeholder="Search resources..."

            value={search}

            onChange={(event) =>

              setSearch(

                event.target.value

              )

            }

          />



        </div>



        <select

          value={filterType}

          onChange={(event) =>

            setFilterType(

              event.target.value

            )

          }

        >



          <option value="All Resources">

            All Resources

          </option>



          {RESOURCE_TYPES.map(

            (type) => (

              <option

                key={type}

                value={type}

              >

                {type}

              </option>

            )

          )}



        </select>



      </div>



      {/* =====================================================

          RESOURCE CARD

      ===================================================== */}



      <section className="resources-card">



        <div className="resources-card-header">



          <div>



            <h2>

              Available Resources

            </h2>



            <p>

              {filteredResources.length}{" "}

              resources available

            </p>



          </div>



        </div>



        {/* LOADING */}



        {loading && (

          <div className="resource-empty">



            <div className="loading-spinner">

            </div>



            <h3>

              Loading resources...

            </h3>



          </div>

        )}



        {/* EMPTY */}



        {!loading &&

          filteredResources.length ===

            0 && (

            <div className="resource-empty">



              <BookOpen

                size={42}

              />



              <h3>

                No resources found

              </h3>



              <p>

                Upload the first academic

                resource for your classmates.

              </p>



            </div>

          )}



        {/* LIST */}



        {!loading &&

          filteredResources.length >

            0 && (

            <div className="resource-list">



              {filteredResources.map(

                (resource) => (

                  <div

                    className="resource-item"

                    key={

                      resource._id

                    }

                  >



                    <div className="resource-file-icon">

                      <FileText

                        size={22}

                      />

                    </div>



                    <div className="resource-info">



                      <span className="resource-type">

                        {resource.type}

                      </span>



                      <h3>

                        {resource.title}

                      </h3>



                      <p>

                        {resource.subject}



                        {resource.branch &&

                          ` • ${resource.branch}`}



                        {resource.semester &&

                          ` • Semester ${resource.semester}`}

                      </p>



                      <small>

                        {resource.uploadedBy

                          ?.name

                          ? `Uploaded by ${resource.uploadedBy.name}`

                          : "Uploaded by JIT student"}

                      </small>



                    </div>



                    <button

                      type="button"

                      className="download-resource-btn"

                      onClick={() =>

                        handleDownload(

                          resource

                        )

                      }

                    >



                      <Download

                        size={17}

                      />



                      Download



                    </button>



                  </div>

                )

              )}



            </div>

          )}



      </section>



      {/* =====================================================

          UPLOAD MODAL

      ===================================================== */}



      {showUploadModal && (

        <div

          className="upload-modal-overlay"

          onMouseDown={(

            event

          ) => {



            /*

             * Clicking ONLY the dark

             * background closes modal.

             */



            if (

              event.target ===

                event.currentTarget &&

              !uploading

            ) {

              closeUploadModal();

            }



          }}

        >



          <div

            className="upload-modal"

            onMouseDown={(

              event

            ) =>

              event.stopPropagation()

            }

          >



            {/* =================================================

                MODAL HEADER

            ================================================= */}



            <div className="upload-modal-header">



              <div>



                <h2>

                  Upload Resource

                </h2>



                <p>

                  Share useful academic

                  material with JIT students.

                </p>



              </div>



              <button

                type="button"

                className="modal-close-btn"

                onClick={

                  closeUploadModal

                }

                disabled={

                  uploading

                }

              >

                <X size={22} />

              </button>



            </div>



            <div className="upload-divider" />



            {/* =================================================

                FORM

            ================================================= */}



            <form

              className="resource-upload-form"

              onSubmit={

                handleUpload

              }

            >



              {/* TITLE */}



              <div className="form-group">



                <label htmlFor="resource-title">

                  Resource Title

                </label>



                <input

                  id="resource-title"

                  name="title"

                  type="text"

                  value={

                    form.title

                  }

                  onChange={

                    handleChange

                  }

                  placeholder="Example: Python Module 2 Notes"

                  autoComplete="off"

                  disabled={

                    uploading

                  }

                />



              </div>



              {/* SUBJECT */}



              <div className="form-group">



                <label htmlFor="resource-subject">

                  Subject

                </label>



                <input

                  id="resource-subject"

                  name="subject"

                  type="text"

                  value={

                    form.subject

                  }

                  onChange={

                    handleChange

                  }

                  placeholder="Subject name"

                  autoComplete="off"

                  disabled={

                    uploading

                  }

                />



              </div>



              {/* BRANCH / SEMESTER */}



              <div className="form-row">



                <div className="form-group">



                  <label htmlFor="resource-branch">

                    Branch

                  </label>



                  <select

                    id="resource-branch"

                    name="branch"

                    value={

                      form.branch

                    }

                    onChange={

                      handleChange

                    }

                    disabled={

                      uploading

                    }

                  >



                    {BRANCHES.map(

                      (branch) => (

                        <option

                          key={

                            branch

                          }

                          value={

                            branch

                          }

                        >

                          {branch}

                        </option>

                      )

                    )}



                  </select>



                </div>



                <div className="form-group">



                  <label htmlFor="resource-semester">

                    Semester

                  </label>



                  <select

                    id="resource-semester"

                    name="semester"

                    value={

                      form.semester

                    }

                    onChange={

                      handleChange

                    }

                    disabled={

                      uploading

                    }

                  >



                    {SEMESTERS.map(

                      (semester) => (

                        <option

                          key={

                            semester

                          }

                          value={

                            String(

                              semester

                            )

                          }

                        >

                          Semester{" "}

                          {semester}

                        </option>

                      )

                    )}



                  </select>



                </div>



              </div>



              {/* TYPE */}



              <div className="form-group">



                <label htmlFor="resource-type">

                  Resource Type

                </label>



                <select

                  id="resource-type"

                  name="type"

                  value={

                    form.type

                  }

                  onChange={

                    handleChange

                  }

                  disabled={

                    uploading

                  }

                >



                  {RESOURCE_TYPES.map(

                    (type) => (

                      <option

                        key={type}

                        value={type}

                      >

                        {type}

                      </option>

                    )

                  )}



                </select>



              </div>



              {/* DESCRIPTION */}



              <div className="form-group">



                <label htmlFor="resource-description">

                  Description

                </label>



                <textarea

                  id="resource-description"

                  name="description"

                  value={

                    form.description

                  }

                  onChange={

                    handleChange

                  }

                  placeholder="Add a short description..."

                  rows="3"

                  disabled={

                    uploading

                  }

                />



              </div>



              {/* =================================================

                  FILE INPUT

              ================================================= */}



              <div className="form-group">



                <label>

                  Choose File

                </label>



                {/*

                 * Hidden native file input.

                 *

                 * NOTHING ELSE is connected

                 * to this input.

                 */}



                <input

                  ref={

                    fileInputRef

                  }

                  id="resource-file"

                  type="file"

                  accept=".pdf,.doc,.docx,.ppt,.pptx"

                  onChange={

                    handleFileChange

                  }

                  disabled={

                    uploading

                  }

                  style={{

                    display:

                      "none",

                  }}

                />



                {!selectedFile ? (



                  <button

                    type="button"

                    className="file-picker-button"

                    onClick={

                      openFilePicker

                    }

                    disabled={

                      uploading

                    }

                  >



                    <Upload

                      size={20}

                    />



                    <div>



                      <strong>

                        Choose a file

                      </strong>



                      <span>

                        PDF, DOC, DOCX,

                        PPT or PPTX

                      </span>



                    </div>



                  </button>



                ) : (



                  <div className="selected-file">



                    <div className="selected-file-left">



                      <div className="selected-file-icon">



                        <FileText

                          size={20}

                        />



                      </div>



                      <div>



                        <strong>

                          {

                            selectedFile.name

                          }

                        </strong>



                        <span>

                          {formatFileSize(

                            selectedFile.size

                          )}

                        </span>



                      </div>



                    </div>



                    <button

                      type="button"

                      className="remove-file-btn"

                      onClick={

                        removeFile

                      }

                      disabled={

                        uploading

                      }

                    >

                      <X size={19} />

                    </button>



                  </div>



                )}



                <small className="file-help">

                  Supported: PDF, DOC,

                  DOCX, PPT, PPTX •

                  Maximum 10 MB

                </small>



              </div>



              {/* =================================================

                  MODAL MESSAGE

              ================================================= */}



              {message && (

                <div

                  className={`upload-message ${

                    messageType ===

                    "success"

                      ? "success"

                      : "error"

                  `}

                >



                  {messageType ===

                  "success" ? (

                    <CheckCircle2

                      size={17}

                    />

                  ) : (

                    <span>

                      ⚠

                    </span>

                  )}



                  <span>

                    {message}

                  </span>



                </div>

              )}



              {/* =================================================

                  ACTIONS

              ================================================= */}



              <div className="upload-form-actions">



                <button

                  type="button"

                  className="cancel-upload-btn"

                  onClick={

                    closeUploadModal

                  }

                  disabled={

                    uploading

                  }

                >

                  Cancel

                </button>



                <button

                  type="submit"

                  className="submit-upload-btn"

                  disabled={

                    uploading

                  }

                >



                  {uploading ? (

                    <>

                      <Clock3

                        size={18}

                      />

                      Uploading...

                    </>

                  ) : (

                    <>

                      <Upload

                        size={18}

                      />

                      Upload Resource

                    </>

                  )}



                </button>



              </div>



            </form>



          </div>



        </div>

      )}



      {/* =====================================================

          PAGE CSS

      ===================================================== */}



      <style>{`



        .resources-page {

          width: 100%;

          min-height: 100%;

          padding: 32px;

          background: #f7f8fc;

          color: #14213d;

        }



        .resources-header {

          display: flex;

          justify-content: space-between;

          align-items: flex-start;

          gap: 24px;

          margin-bottom: 26px;

        }



        .page-eyebrow {

          margin: 0 0 7px;

          color: #5364e8;

          font-size: 12px;

          font-weight: 700;

          letter-spacing: 1.3px;

        }



        .resources-header h1 {

          margin: 0;

          color: #101b35;

          font-size: 36px;

        }



        .resources-header p:last-child {

          margin: 8px 0 0;

          color: #697386;

          font-size: 15px;

        }



        .upload-resource-btn {

          border: none;

          background: #5364e8;

          color: white;

          border-radius: 10px;

          padding: 13px 19px;

          display: flex;

          align-items: center;

          gap: 8px;

          font-weight: 600;

          cursor: pointer;

          white-space: nowrap;

        }



        .upload-resource-btn:hover {

          background: #4354d8;

        }



        .resource-alert {

          margin-bottom: 18px;

          padding: 12px 15px;

          border-radius: 9px;

          display: flex;

          align-items: center;

          gap: 9px;

        }



        .resource-alert.error {

          background: #fff0f0;

          border: 1px solid #ffd5d5;

          color: #c0392b;

        }



        .resource-alert.success {

          background: #effbf3;

          border: 1px solid #ccefd7;

          color: #198754;

        }



        .resource-alert button {

          margin-left: auto;

          border: none;

          background: transparent;

          cursor: pointer;

          font-size: 20px;

        }



        .resources-toolbar {

          display: flex;

          gap: 13px;

          margin-bottom: 22px;

        }



        .resource-search {

          flex: 1;

          height: 48px;

          background: white;

          border: 1px solid #e0e4ec;

          border-radius: 9px;

          display: flex;

          align-items: center;

          gap: 9px;

          padding: 0 14px;

        }



        .resource-search svg {

          color: #8b94a6;

          flex-shrink: 0;

        }



        .resource-search input {

          width: 100%;

          border: none;

          outline: none;

          background: transparent;

          font-size: 14px;

        }



        .resources-toolbar select {

          min-width: 190px;

          height: 48px;

          padding: 0 13px;

          border: 1px solid #e0e4ec;

          border-radius: 9px;

          background: white;

          outline: none;

          cursor: pointer;

        }



        .resources-card {

          background: white;

          border: 1px solid #e4e7ef;

          border-radius: 15px;

          padding: 25px;

        }



        .resources-card-header {

          margin-bottom: 22px;

        }



        .resources-card-header h2 {

          margin: 0;

          font-size: 21px;

        }



        .resources-card-header p {

          margin: 5px 0 0;

          color: #7d8799;

          font-size: 13px;

        }



        .resource-list {

          display: flex;

          flex-direction: column;

          gap: 12px;

        }



        .resource-item {

          display: flex;

          align-items: center;

          gap: 15px;

          padding: 16px;

          border: 1px solid #e7eaf0;

          border-radius: 11px;

        }



        .resource-file-icon {

          width: 44px;

          height: 44px;

          flex-shrink: 0;

          border-radius: 10px;

          background: #eef0ff;

          color: #5364e8;

          display: flex;

          align-items: center;

          justify-content: center;

        }



        .resource-info {

          flex: 1;

          min-width: 0;

        }



        .resource-type {

          color: #5364e8;

          font-size: 11px;

          font-weight: 700;

        }



        .resource-info h3 {

          margin: 3px 0;

          font-size: 16px;

        }



        .resource-info p {

          margin: 0;

          color: #687386;

          font-size: 13px;

        }



        .resource-info small {

          display: block;

          margin-top: 5px;

          color: #9aa2b1;

        }



        .download-resource-btn {

          border: none;

          background: #5364e8;

          color: white;

          border-radius: 8px;

          padding: 9px 13px;

          display: flex;

          align-items: center;

          gap: 6px;

          cursor: pointer;

          white-space: nowrap;

        }



        .resource-empty {

          min-height: 250px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;

          color: #7c8799;

        }



        .resource-empty h3 {

          margin: 10px 0 4px;

          color: #1c2944;

        }



        .resource-empty p {

          margin: 0;

        }



        .loading-spinner {

          width: 34px;

          height: 34px;

          border: 3px solid #e4e7ef;

          border-top-color: #5364e8;

          border-radius: 50%;

          animation: resourceSpin .8s linear infinite;

        }



        @keyframes resourceSpin {

          to {

            transform: rotate(360deg);

          }

        }



        /* =====================================================

           MODAL

        ===================================================== */



        .upload-modal-overlay {

          position: fixed;

          inset: 0;

          z-index: 9999;

          background: rgba(15, 23, 42, .55);

          backdrop-filter: blur(4px);

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 20px;

        }



        .upload-modal {

          width: min(570px, 100%);

          max-height: 92vh;

          overflow-y: auto;

          background: white;

          border-radius: 16px;

          padding: 28px;

          box-shadow: 0 25px 80px rgba(0,0,0,.25);

        }



        .upload-modal-header {

          display: flex;

          justify-content: space-between;

          gap: 20px;

        }



        .upload-modal-header h2 {

          margin: 0;

          font-size: 24px;

          color: #14213d;

        }



        .upload-modal-header p {

          margin: 5px 0 0;

          color: #7b8495;

          font-size: 13px;

        }



        .modal-close-btn {

          width: 36px;

          height: 36px;

          border: none;

          background: #f4f5f8;

          border-radius: 8px;

          display: flex;

          align-items: center;

          justify-content: center;

          cursor: pointer;

          color: #566176;

        }



        .upload-divider {

          height: 1px;

          background: #e8ebf0;

          margin: 23px 0;

        }



        .resource-upload-form {

          display: flex;

          flex-direction: column;

          gap: 17px;

        }



        .form-group {

          display: flex;

          flex-direction: column;

          gap: 7px;

        }



        .form-group label {

          color: #263552;

          font-size: 13px;

          font-weight: 700;

        }



        .form-group input[type="text"],

        .form-group select,

        .form-group textarea {

          width: 100%;

          border: 1px solid #d9dfe9;

          border-radius: 9px;

          background: white;

          color: #253452;

          outline: none;

          font-size: 14px;

        }



        .form-group input[type="text"],

        .form-group select {

          height: 48px;

          padding: 0 13px;

        }



        .form-group textarea {

          padding: 12px 13px;

          resize: vertical;

          font-family: inherit;

        }



        .form-group input:focus,

        .form-group select:focus,

        .form-group textarea:focus {

          border-color: #5364e8;

          box-shadow: 0 0 0 3px rgba(83,100,232,.09);

        }



        .form-row {

          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 13px;

        }



        .file-picker-button {

          width: 100%;

          min-height: 64px;

          border: 1.5px dashed #cbd2df;

          border-radius: 10px;

          background: #fafbfe;

          color: #5364e8;

          cursor: pointer;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          text-align: left;

        }



        .file-picker-button:hover {

          border-color: #5364e8;

          background: #f6f7ff;

        }



        .file-picker-button div {

          display: flex;

          flex-direction: column;

        }



        .file-picker-button span {

          color: #8a93a5;

          font-size: 11px;

          margin-top: 2px;

        }



        .selected-file {

          width: 100%;

          min-height: 65px;

          padding: 10px 12px;

          border: 1px solid #dce1eb;

          border-radius: 10px;

          background: #fafbfe;

          display: flex;

          align-items: center;

          justify-content: space-between;

        }



        .selected-file-left {

          min-width: 0;

          display: flex;

          align-items: center;

          gap: 10px;

        }



        .selected-file-icon {

          width: 40px;

          height: 40px;

          flex-shrink: 0;

          border-radius: 8px;

          background: #eef0ff;

          color: #5364e8;

          display: flex;

          align-items: center;

          justify-content: center;

        }



        .selected-file-left div:last-child {

          display: flex;

          flex-direction: column;

          min-width: 0;

        }



        .selected-file-left strong {

          max-width: 400px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          color: #17213b;

          font-size: 13px;

        }



        .selected-file-left span {

          margin-top: 3px;

          color: #8992a3;

          font-size: 11px;

        }



        .remove-file-btn {

          width: 34px;

          height: 34px;

          flex-shrink: 0;

          border: none;

          background: transparent;

          color: #5c6678;

          border-radius: 7px;

          cursor: pointer;

        }



        .remove-file-btn:hover {

          background: #f0f1f5;

        }



        .file-help {

          color: #939baa;

          font-size: 11px;

        }



        .upload-message {

          padding: 11px 13px;

          border-radius: 8px;

          display: flex;

          align-items: center;

          gap: 8px;

          font-size: 13px;

        }



        .upload-message.error {

          background: #fff0f0;

          border: 1px solid #ffd2d2;

          color: #c0392b;

        }



        .upload-message.success {

          background: #effbf3;

          border: 1px solid #ccefd7;

          color: #198754;

        }



        .upload-form-actions {

          display: flex;

          justify-content: flex-end;

          gap: 10px;

          padding-top: 4px;

        }



        .cancel-upload-btn,

        .submit-upload-btn {

          min-height: 44px;

          padding: 0 17px;

          border-radius: 8px;

          font-size: 13px;

          font-weight: 600;

          cursor: pointer;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

        }



        .cancel-upload-btn {

          border: 1px solid #d9dfe9;

          background: white;

          color: #59657a;

        }



        .submit-upload-btn {

          border: none;

          background: #5364e8;

          color: white;

        }



        .submit-upload-btn:hover:not(:disabled) {

          background: #4354d8;

        }



        .submit-upload-btn:disabled,

        .cancel-upload-btn:disabled,

        .file-picker-button:disabled {

          opacity: .55;

          cursor: not-allowed;

        }



        @media (max-width: 700px) {



          .resources-page {

            padding: 20px;

          }



          .resources-header {

            flex-direction: column;

          }



          .resources-toolbar {

            flex-direction: column;

          }



          .resources-toolbar select {

            width: 100%;

          }



          .form-row {

            grid-template-columns: 1fr;

          }



          .resource-item {

            align-items: flex-start;

            flex-wrap: wrap;

          }



          .download-resource-btn {

            margin-left: 59px;

          }



        }



      `}</style>



    </div>

  );

}



export default Resources;